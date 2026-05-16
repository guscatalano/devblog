import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function readSimpleFrontmatter(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8')
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const out = {}
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!m) continue
    const [, key, raw] = m
    const val = raw.trim().replace(/^["']|["']$/g, '')
    if (val === 'true') out[key] = true
    else if (val === 'false') out[key] = false
    else out[key] = val
  }
  return out
}

function gtoolsSidebar() {
  const dir = path.resolve(__dirname, '../gtools')
  const items = [{ text: 'All Tools', link: '/gtools/' }]
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir).sort()) {
      if (!file.endsWith('.md') || file === 'index.md') continue
      const slug = file.replace(/\.md$/, '')
      const fm = readSimpleFrontmatter(path.join(dir, file))
      if (fm.tool !== true) continue
      items.push({ text: fm.title || slug, link: `/gtools/${slug}` })
    }
  }
  return [{ text: 'GTools', items }]
}

export default {
  title: 'Gus Catalano',
  description: 'Developer, creator, and tech enthusiast',
  base: '/',
  appearance: 'force-dark',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/posts/level1-kvm-control' },
      { text: 'GTools', link: '/gtools/' },
      { text: 'About', link: '/about' }
    ],
    sidebar: {
      '/posts/': [
        {
          text: 'Posts',
          items: [
            { text: 'Controlling a Level1Techs KVM From Anywhere on My LAN', link: '/posts/level1-kvm-control' },
            { text: 'Welcome', link: '/posts/welcome' }
          ]
        }
      ],
      '/gtools/': gtoolsSidebar()
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
