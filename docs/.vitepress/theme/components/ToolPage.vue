<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

const { frontmatter } = useData()

const repo = computed(() => frontmatter.value.repo as string | undefined)
const status = computed(() => frontmatter.value.status as string | undefined)
const problem = computed(() => frontmatter.value.problem as string | undefined)
const install = computed(() => frontmatter.value.install as string | undefined)
const installLang = computed(() => (frontmatter.value.installLang as string) || 'powershell')
const screenshot = computed(() => frontmatter.value.screenshot as string | undefined)
const relatedPosts = computed(
  () => (frontmatter.value.relatedPosts as Array<{ link: string; text: string }>) || []
)

const repoUrl = computed(() => (repo.value ? `https://github.com/${repo.value}` : null))
</script>

<template>
  <div class="tool-page">
    <header class="tool-header">
      <h1>
        {{ frontmatter.title }}
        <StatusBadge v-if="status" :status="status" />
      </h1>
      <p v-if="problem" class="tool-problem">{{ problem }}</p>

      <div v-if="repo" class="tool-badges">
        <a :href="repoUrl" target="_blank" rel="noopener">
          <img :src="`https://img.shields.io/github/stars/${repo}?style=social`" alt="GitHub stars" />
        </a>
        <a :href="repoUrl" target="_blank" rel="noopener">
          <img :src="`https://img.shields.io/github/license/${repo}`" alt="License" />
        </a>
        <a :href="repoUrl" target="_blank" rel="noopener">
          <img :src="`https://img.shields.io/github/last-commit/${repo}`" alt="Last commit" />
        </a>
      </div>
    </header>

    <img v-if="screenshot" :src="screenshot" :alt="`${frontmatter.title} screenshot`" class="tool-screenshot" />

    <section v-if="install" class="tool-install">
      <h2>Install</h2>
      <pre><code>{{ install.trim() }}</code></pre>
    </section>

    <section v-if="repo" class="tool-links">
      <h2>Source</h2>
      <p>
        <a :href="repoUrl" target="_blank" rel="noopener">{{ repoUrl }}</a>
      </p>
    </section>

    <section class="tool-body">
      <slot />
    </section>

    <section v-if="relatedPosts.length" class="tool-related">
      <h2>Related Posts</h2>
      <ul>
        <li v-for="post in relatedPosts" :key="post.link">
          <a :href="post.link">{{ post.text }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.tool-page {
  max-width: 100%;
}
.tool-header h1 {
  display: flex;
  align-items: center;
  gap: 0.6em;
  flex-wrap: wrap;
}
.tool-problem {
  font-size: 1.1em;
  color: var(--vp-c-text-2);
  margin-top: -0.4em;
}
.tool-badges {
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
  margin: 0.5em 0 1.5em;
}
.tool-badges img {
  display: block;
}
.tool-screenshot {
  max-width: 100%;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  margin: 1em 0;
}
.tool-install pre {
  background: var(--vp-c-bg-soft);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}
.tool-install code {
  background: transparent;
  font-family: var(--vp-font-family-mono);
  white-space: pre;
}
.tool-related ul {
  padding-left: 1.2em;
}
</style>
