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

// js-yaml turns an unquoted `2026-08-02` into a Date; String() on that gives
// "Sat Aug 02 2026 ..." and renders a day early in a negative-offset zone.
// Go through UTC so the published date is the one written in the frontmatter.
const isoDate = (d: unknown): string | undefined =>
  d instanceof Date ? d.toISOString().slice(0, 10) : d ? String(d).slice(0, 10) : undefined

export default createContentLoader('benchmarks/*.md', {
  excerpt: false,
  transform(raw): Benchmark[] {
    return raw
      .filter((page) => page.frontmatter.benchmark === true)
      .map((page) => ({
        url: page.url,
        title: page.frontmatter.title ?? page.url,
        date: isoDate(page.frontmatter.date),
        summary: page.frontmatter.summary,
        benchId: page.frontmatter.benchId,
        report: page.frontmatter.report
      }))
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  }
})
