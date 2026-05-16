<script setup lang="ts">
import { data as tools } from '../../../gtools/tools.data.ts'
import StatusBadge from './StatusBadge.vue'
</script>

<template>
  <div class="tool-list">
    <a v-for="tool in tools" :key="tool.url" :href="tool.url" class="tool-card">
      <div class="tool-card-header">
        <h3>{{ tool.title }}</h3>
        <StatusBadge v-if="tool.status" :status="tool.status" />
      </div>
      <p v-if="tool.problem" class="tool-card-problem">{{ tool.problem }}</p>
      <p v-if="tool.repo" class="tool-card-repo">{{ tool.repo }}</p>
    </a>
    <p v-if="!tools.length" class="empty">No tools yet — drop a markdown file in <code>docs/gtools/</code> to add one.</p>
  </div>
</template>

<style scoped>
.tool-list {
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  margin-top: 1.5em;
}
.tool-card {
  display: block;
  padding: 1em 1.2em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, transform 0.15s;
}
.tool-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
.tool-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
  margin-bottom: 0.4em;
}
.tool-card-header h3 {
  margin: 0;
  font-size: 1.1em;
}
.tool-card-problem {
  color: var(--vp-c-text-2);
  margin: 0.3em 0;
  font-size: 0.95em;
}
.tool-card-repo {
  color: var(--vp-c-text-3);
  margin: 0.3em 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8em;
}
.empty {
  color: var(--vp-c-text-2);
}
</style>
