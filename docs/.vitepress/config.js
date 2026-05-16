import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function readFrontmatter(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8')
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  return yaml.load(match[1]) || {}
}

function loadTools() {
  const dir = path.resolve(__dirname, '../gtools')
  const tools = []
  if (!fs.existsSync(dir)) return tools
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.md') || file === 'index.md') continue
    const slug = file.replace(/\.md$/, '')
    const fm = readFrontmatter(path.join(dir, file))
    if (fm.tool !== true) continue
    tools.push({
      slug,
      title: fm.title || slug,
      relatedPosts: Array.isArray(fm.relatedPosts) ? fm.relatedPosts : []
    })
  }
  return tools
}

function gtoolsSidebars() {
  const tools = loadTools()
  const baseSection = {
    text: 'GTools',
    items: [
      { text: 'All Tools', link: '/gtools/' },
      ...tools.map((t) => ({ text: t.title, link: `/gtools/${t.slug}` }))
    ]
  }

  const sidebars = { '/gtools/': [baseSection] }
  for (const tool of tools) {
    const sections = [baseSection]
    if (tool.relatedPosts.length > 0) {
      sections.push({
        text: 'Related Posts',
        items: tool.relatedPosts.map((p) => ({ text: p.text, link: p.link }))
      })
    }
    sidebars[`/gtools/${tool.slug}`] = sections
  }
  return sidebars
}

export default {
  title: 'Gus Catalano',
  description: 'Developer, creator, and tech enthusiast',
  base: '/',
  appearance: 'force-dark',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/posts/simple-event-viewer' },
      { text: 'GTools', link: '/gtools/' },
      { text: 'About', link: '/about' }
    ],
    sidebar: {
      '/posts/': [
        {
          text: 'Posts',
          items: [
            { text: 'Why I Rewrote Windows Event Viewer (and Gave It an MCP Server)', link: '/posts/simple-event-viewer' },
            { text: 'Controlling a Level1Techs KVM From Anywhere on My LAN', link: '/posts/level1-kvm-control' },
            { text: 'Welcome', link: '/posts/welcome' }
          ]
        }
      ],
      ...gtoolsSidebars()
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/guscatalano' },
      { icon: 'twitter', link: 'https://twitter.com/guscatalano' }
    ],
    footer: {
      message: '© 2026 Gus Catalano',
      copyright: 'All rights reserved'
    }
  }
}
