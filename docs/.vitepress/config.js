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
      { text: 'About', link: '/about' },
      { text: 'Privacy', link: '/privacy/' },
      { text: 'Security', link: '/security/' }
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
      '/privacy/': [
        {
          text: 'Privacy Policies',
          items: [
            { text: 'Overview', link: '/privacy/' },
            { text: 'Simple Event Viewer', link: '/privacy/simpleeventviewer' },
            { text: 'Simple PCap Viewer', link: '/privacy/simplepcapviewer' },
            { text: 'FindNeedle', link: '/privacy/findneedle' },
            { text: 'BinaryExplorer', link: '/privacy/binaryexplorer' },
            { text: 'NexusRDM', link: '/privacy/nexusrdm' },
            { text: 'PixelPet', link: '/privacy/pixelpet' },
            { text: 'AI Proxy', link: '/privacy/ai-proxy' },
            { text: 'Level1Techs KVM Control', link: '/privacy/level1techkvm' },
            { text: 'DonationTracker', link: '/privacy/donationtracker' },
            { text: 'ProcMonClone', link: '/privacy/procmonclone' },
            { text: 'RTSP Stream URL Finder', link: '/privacy/rtspstreamurlfinder' },
            { text: 'FoscamFinder', link: '/privacy/foscamfinder' },
            { text: 'RDP DVC Watcher', link: '/privacy/rdp-dvc-watcher' },
            { text: 'HA — Generac/Honeywell', link: '/privacy/ha-generac' },
            { text: 'HA — Waste Management', link: '/privacy/waste-management' }
          ]
        }
      ],
      '/security/': [
        {
          text: 'Security',
          items: [
            { text: 'Overview', link: '/security/' },
            { text: 'Simple Event Viewer', link: '/security/simpleeventviewer' },
            { text: 'Simple PCap Viewer', link: '/security/simplepcapviewer' },
            { text: 'FindNeedle', link: '/security/findneedle' },
            { text: 'BinaryExplorer', link: '/security/binaryexplorer' },
            { text: 'NexusRDM', link: '/security/nexusrdm' },
            { text: 'PixelPet', link: '/security/pixelpet' },
            { text: 'AI Proxy', link: '/security/ai-proxy' },
            { text: 'Level1Techs KVM Control', link: '/security/level1techkvm' },
            { text: 'DonationTracker', link: '/security/donationtracker' },
            { text: 'ProcMonClone', link: '/security/procmonclone' },
            { text: 'RTSP Stream URL Finder', link: '/security/rtspstreamurlfinder' },
            { text: 'FoscamFinder', link: '/security/foscamfinder' },
            { text: 'RDP DVC Watcher', link: '/security/rdp-dvc-watcher' },
            { text: 'HA — Generac/Honeywell', link: '/security/ha-generac' },
            { text: 'HA — Waste Management', link: '/security/waste-management' }
          ]
        }
      ],
      ...gtoolsSidebars()
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/guscatalano' },
      { icon: 'twitter', link: 'https://twitter.com/guscatalano' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/gustavocatalano/' }
    ],
    footer: {
      message: '<a href="/privacy/">Privacy Policy</a> · <a href="/security/">Security</a> · © 2026 Gus Catalano',
      copyright: 'All rights reserved'
    }
  }
}
