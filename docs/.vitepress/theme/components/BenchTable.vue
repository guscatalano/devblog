<script setup lang="ts">
// Dense model-comparison table. Every measure is shown as "alone → under 4×
// concurrent load", because the gap between those two is the thing worth
// looking at and a flat row-per-run table hides it.
//
// Encoding, per the data-viz method:
//   correctness → meter (a share of a fixed 0–100 whole), sequential blue
//   decode      → dumbbell (before/after per item), one hue two shades, orange
// Both palettes validated against the dark surface this site forces.
import { computed, ref } from 'vue'
import { data as runs } from '../../../benchmarks/runs.data.ts'

const props = defineProps<{ benchId: string }>()
const run = computed(() => runs[props.benchId])

type SortKey = 'model' | 'perfect' | 'decode' | 'ttft' | 'total'
const sortKey = ref<SortKey>('perfect')
const sortAsc = ref(false)

function setSort(key: SortKey) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else {
    sortKey.value = key
    // Names read best A→Z; every measure reads best big-first, except latency.
    sortAsc.value = key === 'model' || key === 'ttft' || key === 'total'
  }
}

const rows = computed(() => {
  const list = [...(run.value?.models ?? [])]
  const dir = sortAsc.value ? 1 : -1
  return list.sort((a, b) => {
    if (sortKey.value === 'model') return dir * String(a.model).localeCompare(String(b.model))
    const av = a.solo?.[sortKey.value] ?? -Infinity
    const bv = b.solo?.[sortKey.value] ?? -Infinity
    return dir * (av - bv)
  })
})

const maxDecode = computed(() =>
  Math.max(1, ...rows.value.flatMap((r) => [r.solo?.decode ?? 0, r.par?.decode ?? 0]))
)

const pct = (v?: number | null) => (v == null ? null : Math.round(v * 100))
const num = (v?: number | null, d = 0) =>
  v == null ? '—' : v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const ms = (v?: number | null) =>
  v == null ? '—' : v >= 1000 ? `${(v / 1000).toFixed(1)} s` : `${Math.round(v)} ms`
const ratio = (a?: number | null, b?: number | null) =>
  a && b ? `${(b / a).toFixed(1)}×` : ''

// Dumbbell geometry, as a percentage of the shared decode scale.
const lo = (r: any) => (Math.min(r.solo?.decode ?? 0, r.par?.decode ?? 0) / maxDecode.value) * 100
const hi = (r: any) => (Math.max(r.solo?.decode ?? 0, r.par?.decode ?? 0) / maxDecode.value) * 100

function tip(r: any) {
  const t = [`${r.model} · ${r.backend}${r.quant ? ` · ${r.quant}` : ''}`]
  for (const [name, m] of [['alone', r.solo], ['4× concurrent', r.par]] as const) {
    if (!m) continue
    t.push(
      `${name}: ${pct(m.perfect)}% fully correct (core ${pct(m.core)}%, hard ${pct(m.hard)}%) · ` +
        `${num(m.decode, 1)} tok/s · TTFT ${ms(m.ttft)} · total ${ms(m.total)}`
    )
  }
  return t.join('\n')
}
</script>

<template>
  <div v-if="!run" class="bench-missing">
    No imported data for <code>{{ benchId }}</code> — run
    <code>node scripts/import-bench.mjs &lt;report-url&gt;</code>.
  </div>

  <figure v-else class="bench">
    <figcaption class="bench-caption">
      <span class="bench-legend">
        <span class="key"><i class="dot solo" /> alone</span>
        <span class="key"><i class="dot par" /> 4× concurrent</span>
      </span>
      <span class="bench-meta">
        {{ run.models.length }} models · {{ run.meta.suite }} ·
        {{ run.meta.tasks }} tasks / {{ run.meta.runsPerCell }} runs · thinking
        {{ run.meta.thinking }} · {{ run.meta.cache }} ·
        t={{ Number(run.meta.temperature).toFixed(1) }} ·
        {{ run.meta.gpus.join(', ') }}
      </span>
    </figcaption>

    <div class="bench-scroll">
      <table class="bench-table">
        <thead>
          <tr>
            <th class="col-model" :aria-sort="sortKey === 'model' ? (sortAsc ? 'ascending' : 'descending') : 'none'">
              <button @click="setSort('model')">Model</button>
            </th>
            <th class="col-correct" :aria-sort="sortKey === 'perfect' ? (sortAsc ? 'ascending' : 'descending') : 'none'">
              <button @click="setSort('perfect')">Fully correct</button>
            </th>
            <th class="col-decode" :aria-sort="sortKey === 'decode' ? (sortAsc ? 'ascending' : 'descending') : 'none'">
              <button @click="setSort('decode')">Decode <span class="unit">tok/s</span></button>
            </th>
            <th class="col-ttft" :aria-sort="sortKey === 'ttft' ? (sortAsc ? 'ascending' : 'descending') : 'none'">
              <button @click="setSort('ttft')">TTFT <span class="unit">p50</span></button>
            </th>
            <th class="col-total" :aria-sort="sortKey === 'total' ? (sortAsc ? 'ascending' : 'descending') : 'none'">
              <button @click="setSort('total')">Total <span class="unit">p50</span></button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.model + r.backend" :title="tip(r)">
            <td class="col-model">
              <span class="name">{{ r.model }}</span>
              <span class="backend">{{ r.backend }}</span>
            </td>

            <td class="col-correct">
              <div class="meter" :aria-label="`${pct(r.solo?.perfect)}% alone, ${pct(r.par?.perfect)}% under load`">
                <div class="meter-track">
                  <div class="meter-fill" :style="{ width: `${pct(r.solo?.perfect) ?? 0}%` }" />
                  <div v-if="r.par?.perfect != null" class="meter-tick" :style="{ left: `${pct(r.par.perfect)}%` }" />
                </div>
                <span class="meter-value">
                  {{ pct(r.solo?.perfect) ?? '—' }}<span class="pctsign">%</span>
                  <span class="meter-delta">→ {{ pct(r.par?.perfect) ?? '—' }}%</span>
                </span>
              </div>
            </td>

            <td class="col-decode">
              <div class="dumbbell">
                <div class="db-track">
                  <div class="db-link" :style="{ left: `${lo(r)}%`, width: `${Math.max(0, hi(r) - lo(r))}%` }" />
                  <i class="dot par" :style="{ left: `${((r.par?.decode ?? 0) / maxDecode) * 100}%` }" />
                  <i class="dot solo" :style="{ left: `${((r.solo?.decode ?? 0) / maxDecode) * 100}%` }" />
                </div>
                <span class="db-value">
                  {{ num(r.solo?.decode, 1) }}
                  <span class="db-delta">→ {{ num(r.par?.decode, 1) }}</span>
                </span>
              </div>
            </td>

            <td class="col-ttft num">
              {{ ms(r.solo?.ttft) }}
              <span class="sub">→ {{ ms(r.par?.ttft) }}
                <span class="ratio">{{ ratio(r.solo?.ttft, r.par?.ttft) }}</span>
              </span>
            </td>

            <td class="col-total num">
              {{ ms(r.solo?.total) }}
              <span class="sub">→ {{ ms(r.par?.total) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style scoped>
.bench {
  /* Data marks: sequential blue for correctness, orange for the second
     sequential context. Validated against the dark surface (all checks pass). */
  --correct: #3987e5;
  --correct-dim: #86b6ef;
  --speed: #d95926;
  --speed-dim: #f0a583;
  --track: var(--vp-c-bg-alt);
  margin: 1.75rem 0;
}

.bench-caption {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1.25rem;
  margin-bottom: 0.6rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}
.bench-legend {
  display: flex;
  gap: 1rem;
  white-space: nowrap;
}
.bench-legend .key {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  color: var(--vp-c-text-2);
}
.bench-legend .dot {
  position: static;
  transform: none;
}
.bench-meta {
  min-width: 0;
}

.bench-scroll {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.bench-table {
  width: 100%;
  min-width: 46rem;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.bench-table th,
.bench-table td {
  padding: 0.5rem 0.85rem;
  text-align: left;
  vertical-align: middle;
  border: 0;
}
.bench-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 500;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
.bench-table thead th button {
  all: unset;
  cursor: pointer;
  color: inherit;
}
.bench-table thead th button:hover {
  color: var(--vp-c-text-1);
}
.bench-table thead th[aria-sort='ascending'] button::after {
  content: ' ↑';
}
.bench-table thead th[aria-sort='descending'] button::after {
  content: ' ↓';
}
.bench-table .unit {
  color: var(--vp-c-text-3);
  font-weight: 400;
}
.bench-table tbody tr + tr td {
  border-top: 1px solid var(--vp-c-divider);
}
.bench-table tbody tr:hover td {
  background: var(--vp-c-bg-elv);
}

.col-model .name {
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  color: var(--vp-c-text-1);
}
.col-model .backend {
  display: inline-block;
  margin-left: 0.5em;
  padding: 0.05em 0.45em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
  vertical-align: 1px;
}

/* correctness — meter against a fixed 0–100 whole */
.col-correct {
  width: 34%;
}
.meter {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.meter-track {
  position: relative;
  flex: 1;
  min-width: 5rem;
  height: 8px;
  border-radius: 4px;
  background: var(--track);
}
.meter-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--correct);
}
.meter-tick {
  position: absolute;
  top: -2px;
  width: 2px;
  height: 12px;
  margin-left: -1px;
  border-radius: 1px;
  background: var(--correct-dim);
  /* 2px surface ring so the tick reads against the fill it sits on */
  box-shadow: 0 0 0 2px var(--vp-c-bg-soft);
}
.meter-value {
  min-width: 6.5rem;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-1);
}
.pctsign {
  color: var(--vp-c-text-3);
}
.meter-delta,
.db-delta,
.sub {
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
}

/* decode — dumbbell, alone → under load */
.col-decode {
  width: 26%;
}
.dumbbell {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.db-track {
  position: relative;
  flex: 1;
  min-width: 5rem;
  height: 10px;
}
.db-track::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 50%;
  height: 1px;
  background: var(--vp-c-divider);
}
.db-link {
  position: absolute;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
  border-radius: 1px;
  background: var(--speed-dim);
}
.dot {
  position: absolute;
  top: 50%;
  width: 9px;
  height: 9px;
  margin-left: -4.5px;
  border-radius: 50%;
  transform: translateY(-50%);
}
.dot.solo {
  background: var(--speed);
  box-shadow: 0 0 0 2px var(--vp-c-bg-soft);
}
.dot.par {
  background: var(--speed-dim);
  box-shadow: 0 0 0 2px var(--vp-c-bg-soft);
}
.db-value {
  min-width: 6.5rem;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-1);
}

.num {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--vp-c-text-1);
}
.num .sub {
  display: block;
}
.ratio {
  color: var(--vp-c-text-3);
}

.bench-missing {
  padding: 1rem;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .bench-table {
    min-width: 40rem;
    font-size: 0.8rem;
  }
  .bench-table th,
  .bench-table td {
    padding: 0.45rem 0.6rem;
  }
}
</style>
