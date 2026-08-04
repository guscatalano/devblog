import { createContentLoader } from 'vitepress'

export interface Benchmark {
  url: string
  title: string
  date?: string
  summary?: string
  benchId?: string
  report?: string
}

declare const data: Benchmark[]
export { data }

export default createContentLoader('benchmarks/*.md', {
  excerpt: false,
  transform(raw): Benchmark[] {
    return raw
      .filter((page) => page.frontmatter.benchmark === true)
      .map((page) => ({
        url: page.url,
        title: page.frontmatter.title ?? page.url,
        date: page.frontmatter.date
          ? String(page.frontmatter.date).slice(0, 10)
          : undefined,
        summary: page.frontmatter.summary,
        benchId: page.frontmatter.benchId,
        report: page.frontmatter.report
      }))
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  }
})
