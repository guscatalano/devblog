#!/usr/bin/env node
// Import an AI_Proxy usage report into the blog.
//
//   node scripts/import-stats.mjs http://192.168.6.183:11444
//   node scripts/import-stats.mjs http://192.168.6.183:11444/__proxy/api/stats/report --date 2026-08-05
//
// Unlike a bench report, this one is a rolling snapshot of everything the proxy
// has ever recorded, so the asset is dated and successive snapshots accumulate
// rather than overwrite.
//
// SCRUBBING: the usage report identifies a llama.cpp model by its on-disk
// checkpoint path, which embeds the local username. The bench report renders a
// display name instead; this one doesn't, so we do it here. Anything
// path-shaped that survives the rewrite fails the import — this repo is public.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseArgs(argv) {
  const opts = { positional: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) opts[a.slice(2)] = argv[++i]
    else opts.positional.push(a)
  }
  return opts
}

const opts = parseArgs(process.argv.slice(2))
const target = opts.positional[0]
if (!target) {
  console.error('usage: import-stats.mjs <proxy-url> [--date YYYY-MM-DD] [--slug <slug>]')
  process.exit(1)
}

const url = new URL(target)
const endpoint = url.pathname.includes('/stats/report')
  ? url.toString()
  : `${url.protocol}//${url.host}/__proxy/api/stats/report`

console.log(`fetching ${endpoint} ...`)
let html
try {
  const res = await fetch(endpoint)
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
  html = await res.text()
} catch (err) {
  console.error(`could not reach the proxy: ${err.message}`)
  process.exit(1)
}

// A checkpoint path stands in for a model name. Render it the way the bench
// report does: basename, extension gone, shard suffix gone.
const PATH_RE = /(?:\/home\/|\/Users\/|[A-Za-z]:\\\\?)[^"'<>\s]{4,}/g
const displayFromPath = (p) =>
  p
    .split(/[/\\]/)
    .pop()
    .replace(/\.(gguf|safetensors|bin|pt)$/i, '')
    .replace(/-\d+-of-\d+$/i, '')

const scrubbed = []
html = html.replace(PATH_RE, (m) => {
  const name = displayFromPath(m)
  scrubbed.push(`${m}  ->  ${name}`)
  return name
})
if (scrubbed.length) {
  console.log(`scrubbed ${scrubbed.length} filesystem path(s):`)
  for (const s of scrubbed) console.log(`  ${s}`)
}

// Nothing identifying may ship. Checked after the rewrite, so a path shape the
// scrubber didn't anticipate stops the import instead of getting published.
const checks = [
  ['filesystem path', /(?:\/home\/|\/Users\/|[A-Za-z]:\\)[^"'<>\s]{4,}/],
  ['private IP', /\b(?:10|127)\.\d{1,3}\.\d{1,3}\.\d{1,3}\b|\b192\.168\.\d{1,3}\.\d{1,3}\b|\b172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/],
  ['credential', /sk-[A-Za-z0-9_-]{12,}|bearer\s+[A-Za-z0-9._-]{12,}|api[_-]?key["':= ]{1,4}[A-Za-z0-9_-]{12,}/i],
  ['external reference', /(?:src|href)\s*=\s*"(?:https?:)?\/\//i]
]
let failed = false
for (const [label, re] of checks) {
  const hit = html.match(re)
  if (hit) {
    console.error(`refusing to import: found ${label} -> ${hit[0].slice(0, 70)}`)
    failed = true
  }
}
if (failed) process.exit(1)

const date = opts.date || new Date().toISOString().slice(0, 10)
const assetName = `usage-${date}.html`
const assetDir = path.join(root, 'docs/public/usage-reports')
fs.mkdirSync(assetDir, { recursive: true })
fs.writeFileSync(path.join(assetDir, assetName), html)
console.log(`wrote docs/public/usage-reports/${assetName} (${Math.round(html.length / 1024)} KB)`)

const slug = opts.slug || `usage-${date}`
const pagePath = path.join(root, 'docs/benchmarks', `${slug}.md`)
if (fs.existsSync(pagePath)) {
  console.log(`docs/benchmarks/${slug}.md exists — left alone (asset refreshed)`)
} else {
  fs.writeFileSync(
    pagePath,
    `---
title: Usage report — ${date}
benchmark: true
date: ${date}
report: /usage-reports/${assetName}
summary: TODO — one line.
---

# Usage report — ${date}

TODO

[Full report →](/usage-reports/${assetName}) — the standalone version. Prints to PDF.
`
  )
  console.log(`wrote docs/benchmarks/${slug}.md — fill in the TODOs`)
}
