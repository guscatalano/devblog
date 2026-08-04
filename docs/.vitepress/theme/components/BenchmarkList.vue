<script setup lang="ts">
import { data as benchmarks } from '../../../benchmarks/benchmarks.data.ts'
</script>

<template>
  <div class="bench-list">
    <a v-for="b in benchmarks" :key="b.url" :href="b.url" class="bench-card">
      <div class="bench-card-header">
        <h3>{{ b.title }}</h3>
        <time v-if="b.date">{{ b.date }}</time>
      </div>
      <p v-if="b.summary" class="bench-card-summary">{{ b.summary }}</p>
      <p v-if="b.benchId" class="bench-card-id">{{ b.benchId }}</p>
    </a>
    <p v-if="!benchmarks.length" class="empty">
      No reports yet — run <code>node scripts/import-bench.mjs &lt;report-url&gt;</code> to add one.
    </p>
  </div>
</template>

<style scoped>
.bench-list {
  display: grid;
  gap: 1em;
  margin-top: 1.5em;
}
.bench-card {
  display: block;
  padding: 1em 1.2em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, transform 0.15s;
}
.bench-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
.bench-card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75em;
  margin-bottom: 0.4em;
}
.bench-card-header h3 {
  margin: 0;
  font-size: 1.1em;
}
.bench-card-header time {
  color: var(--vp-c-text-3);
  font-size: 0.85em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.bench-card-summary {
  color: var(--vp-c-text-2);
  margin: 0.3em 0;
  font-size: 0.95em;
}
.bench-card-id {
  color: var(--vp-c-text-3);
  margin: 0.3em 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8em;
}
.empty {
  color: var(--vp-c-text-2);
}
</style>
