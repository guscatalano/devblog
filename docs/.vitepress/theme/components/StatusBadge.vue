<script setup lang="ts">
const props = defineProps<{ status: 'alpha' | 'beta' | 'stable' | string }>()
const colors: Record<string, string> = {
  alpha: '#b45309',
  beta: '#1d4ed8',
  stable: '#15803d'
}
</script>

<template>
  <span class="status-badge" :style="{ backgroundColor: colors[props.status] || '#525252' }">
    {{ props.status }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.15em 0.6em;
  border-radius: 999px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  vertical-align: middle;
}
</style>
