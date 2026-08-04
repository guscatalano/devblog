<script setup lang="ts">
// Dense model-comparison table. Every measure is shown as "primary → secondary"
// along whichever axis the run varied (alone vs concurrent, warm vs cold, …),
// because the gap between those two states is the thing worth looking at and a
// flat row-per-run table hides it.
//
// Encoding, per the data-viz method:
//   correctness → meter (a share of a fixed 0–100 whole), sequential blue
//   decode      → dumbbell (before/after per item), one hue two shades, orange
// Both palettes validated against the dark surface this site forces.
import { computed, ref } from 'vue'
import { data as runs } from '../../../benchmarks/runs.data.ts'

const props = defineProps<{ benchId: string }>()
const run = computed(() => runs[props.benchId])

const axis = computed(() => run.value?.meta?.axis ?? null)
const primaryLabel = computed(() => axis.value?.primary ?? 'measured')
const secondaryLabel = computed(() => axis.value?.secondary ?? null)

type SortKey = 'model' | 'perfect' | 'decode' | 'ttft' | 'total'
const sortKey = ref<SortKey>('perfect')
const sortAsc = ref(false)

function setSort(key: SortKey) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else {
    sortKey.value = key
    // Names read best A→Z; measures big-first, except latency where less is better.
    sortAsc.value = key === 'model' || key === 'ttft' || key === 'total'
  }
}

const rows = computed(() => {
  const list = [...(run.value?.models ?? [])]
  const dir = sortAsc.value ? 1 : -1
  return list.sort((a, b) => {
    if (sortKey.value === 'model') return dir * String(a.model).localeCompare(String(b.model))
    const av = a.primary?.[sortKey.value] ?? -Infinity
    const bv = b.primary?.[sortKey.value] ?? -Infinity
    return dir * (av - bv)
  })
})

const maxDecode = computed(() =>
  Math.max(1, ...rows.value.flatMap((r) => [r.primary?.decode ?? 0, r.secondary?.decode ?? 0]))
)

const pct = (v?: number | null) => (v == null ? null : Math.round(v * 100))
const num = (v?: number | null, d = 0) =>
  v == null ? '—' : v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const ms = (v?: number | null) =>
  v == null ? '—' : v >= 1000 ? `${(v / 1000).toFixed(1)} s` : `${Math.round(v)} ms`
const ratio = (a?: number | null, b?: number | null) =>
  a && b ? `${(b / a).toFixed(1)}×` : ''

const scaled = (v?: number | null) => ((v ?? 0) / maxDecode.value) * 100
const lo = (r: any) => Math.min(scaled(r.primary?.decode), scaled(r.secondary?.decode))
const hi = (r: any) => Math.max(scaled(r.primary?.decode), scaled(r.secondary?.decode))

// Fields already spent on the axis shouldn't also appear in the caption as if
// they were constant for the whole run.
const captionBits = computed(() => {
  const m = run.value?.meta ?? {}
  const bits = [`${run.value?.models?.length ?? 0} models`, m.suite]
  if (m.tasks && m.runsPerCell) bits.push(`${m.tasks} tasks / ${m.runsPerCell} runs`)
  if (m.context) bits.push(`${m.context} context`)
  if (axis.value?.key !== 'thinking' && m.thinking) bits.push(`thinking ${m.thinking}`)
  if (axis.value?.key !== 'cache' && m.cache) bits.push(String(m.cache))
  if (m.temperature != null) bits.push(`t=${Number(m.temperature).toFixed(1)}`)
  if (m.gpus?.length) bits.push(m.gpus.join(', '))
  return bits.filter(Boolean)
})

function tip(r: any) {
  const t = [
    [r.model, r.variant, r.backend, r.quant].filter(Boolean).join(' · ')
  ]
  const states: [string, any][] = [[primaryLabel.value, r.primary]]
  if (secondaryLabel.value) states.push([secondaryLabel.value, r.secondary])
  for (const [name, m] of states) {
    if (!m) continue
    const tiers =
      m.core != null || m.hard != null ? ` (core ${pct(m.core)}%, hard ${pct(m.hard)}%)` : ''
    t.push(
      `${name}: ${pct(m.perfect)}% fully correct${tiers} · ` +
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
        <span class="key"><i class="dot solo" /> {{ primaryLabel }}</span>
        <span v-if="secondaryLabel" class="key"><i class="dot par" /> {{ secondaryLabel }}</span>
      </span>
      <span class="bench-meta">{{ captionBits.join(' · ') }}</span>
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
          <tr v-for="r in rows" :key="r.model + r.backend + (r.variant ?? '')" :title="tip(r)">
            <td class="col-model">
              <span class="name">{{ r.model }}</span>
              <span v-if="r.variant" class="variant">{{ r.variant }}</span>
              <span class="backend">{{ r.backend }}</span>
            </td>

            <td class="col-correct">
              <div class="meter">
                <div class="meter-track">
                  <div class="meter-fill" :style="{ width: `${pct(r.primary?.perfect) ?? 0}%` }" />
                  <div
                    v-if="r.secondary?.perfect != null"
                    class="meter-tick"
                    :style="{ left: `${pct(r.secondary.perfect)}%` }"
                  />
                </div>
                <span class="meter-value">
                  {{ pct(r.primary?.perfect) ?? '—' }}<span class="pctsign">%</span>
                  <span v-if="secondaryLabel" class="meter-delta">
                    → {{ pct(r.secondary?.perfect) ?? '—' }}%
                  </span>
                </span>
              </div>
            </td>

            <td class="col-decode">
              <div class="dumbbell">
                <div class="db-track">
                  <div
                    class="db-link"
                    :style="{ left: `${lo(r)}%`, width: `${Math.max(0, hi(r) - lo(r))}%` }"
                  />
                  <i
                    v-if="r.secondary?.decode != null"
                    class="dot par"
                    :style="{ left: `${scaled(r.secondary.decode)}%` }"
                  />
                  <i class="dot solo" :style="{ left: `${scaled(r.primary?.decode)}%` }" />
                </div>
                <span class="db-value">
                  {{ num(r.primary?.decode, 1) }}
                  <span v-if="secondaryLabel" class="db-delta">→ {{ num(r.secondary?.decode, 1) }}</span>
                </span>
              </div>
            </td>

            <td class="col-ttft num">
              {{ ms(r.primary?.ttft) }}
              <span v-if="secondaryLabel" class="sub">
                → {{ ms(r.secondary?.ttft) }}
                <span class="ratio">{{ ratio(r.primary?.ttft, r.secondary?.ttft) }}</span>
              </span>
            </td>

            <td class="col-total num">
              {{ ms(r.primary?.total) }}
              <span v-if="secondaryLabel" class="sub">→ {{ ms(r.secondary?.total) }}</span>
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
  margin: 0;
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
.col-model .variant,
.col-model .backend {
  display: inline-block;
  margin-left: 0.5em;
  padding: 0.05em 0.45em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
  vertical-align: 1px;
  white-space: nowrap;
}
.col-model .variant {
  border-color: color-mix(in srgb, var(--correct) 45%, transparent);
  color: var(--vp-c-text-2);
}

/* correctness — meter against a fixed 0–100 whole */
.col-correct {
  width: 32%;
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

/* decode — dumbbell between the two states */
.col-decode {
  width: 24%;
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
