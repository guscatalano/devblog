import { createContentLoader } from 'vitepress'

export interface Tool {
  url: string
  title: string
  status?: string
  problem?: string
  repo?: string
}

declare const data: Tool[]
export { data }

export default createContentLoader('gtools/*.md', {
  excerpt: false,
  transform(raw): Tool[] {
    return raw
      .filter((page) => page.frontmatter.tool === true)
      .map((page) => ({
        url: page.url,
        title: page.frontmatter.title ?? page.url,
        status: page.frontmatter.status,
        problem: page.frontmatter.problem,
        repo: page.frontmatter.repo
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  }
})
