#!/usr/bin/env node
// Import an AI_Proxy benchmark report into the blog.
//
//   node scripts/import-bench.mjs "http://192.168.6.183:11444/__proxy/api/bench/report?format=html&ids=b_23168a3d7a38"
//   node scripts/import-bench.mjs b_23168a3d7a38 --base http://192.168.6.183:11444
//
// Options: --slug <slug>  --title "<title>"  --base <proxy url>
//
// The proxy only listens on the LAN, so a published page can't link to it. This
// pulls both renderings while the run is still reachable and commits them:
//
//   docs/public/bench-reports/<ids>.html   the standalone report, verbatim
//   docs/benchmarks/<slug>.md              a themed page with the markdown table
//
// Re-running against an existing page refreshes only the table (between the
// bench:table markers) and the archived HTML, so hand-written prose survives.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const START = '<!-- bench:table:start -->'
const END = '<!-- bench:table:end -->'

function parseArgs(argv) {
  const opts = { positional: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) opts[arg.slice(2)] = argv[++i]
    else opts.positional.push(arg)
  }
  return opts
}

const opts = parseArgs(process.argv.slice(2))
const target = opts.positional[0]
if (!target) {
  console.error('usage: import-bench.mjs <report-url|bench-id> [--base <url>] [--slug <slug>] [--title <title>]')
  process.exit(1)
}

// Accept either a full report URL (paste it straight from the proxy UI) or a
// bare id plus --base.
let base = opts.base
let ids
if (target.startsWith('http')) {
  const url = new URL(target)
  base = `${url.protocol}//${url.host}`
  ids = url.searchParams.get('ids')
} else {
  ids = target
}
if (!ids) {
  console.error('no bench ids: pass ?ids=... in the URL, or a bare id')
  process.exit(1)
}
if (!base) {
  console.error('no proxy base url: pass a full report URL, or --base http://host:port')
  process.exit(1)
}

const endpoint = (format) =>
  `${base}/__proxy/api/bench/report?format=${format}&ids=${encodeURIComponent(ids)}`

async function get(format) {
  const res = await fetch(endpoint(format))
  if (!res.ok) throw new Error(`${format}: HTTP ${res.status} ${res.statusText}`)
  return res.text()
}

console.log(`fetching ${ids} from ${base} ...`)
let markdown, html
try {
  ;[markdown, html] = await Promise.all([get('markdown'), get('html')])
} catch (err) {
  console.error(`could not reach the proxy: ${err.message}`)
  console.error('the report has to be pulled while the run is still on the LAN box.')
  process.exit(1)
}

// The standalone report is self-contained by design (no external requests), so
// it can be served as a static asset as-is. Bail if that ever stops being true,
// rather than silently publishing a page that phones home.
const external = [...html.matchAll(/(?:src|href)\s*=\s*"(https?:)?\/\//gi)]
if (external.length > 0) {
  console.error(`refusing to import: the HTML report has ${external.length} external reference(s).`)
  console.error('a published copy would make requests off-site. inspect it before committing.')
  process.exit(1)
}

const assetName = `${ids.replace(/[^A-Za-z0-9_,-]/g, '_')}.html`
const assetDir = path.join(root, 'docs/public/bench-reports')
fs.mkdirSync(assetDir, { recursive: true })
fs.writeFileSync(path.join(assetDir, assetName), html)
console.log(`wrote docs/public/bench-reports/${assetName} (${Math.round(html.length / 1024)} KB)`)

const table = markdown.trim()
const rowCount = table.split('\n').filter((l) => l.startsWith('|')).length - 2
const slug = opts.slug || ids.split(',')[0]
const pagePath = path.join(root, 'docs/benchmarks', `${slug}.md`)

if (fs.existsSync(pagePath)) {
  const existing = fs.readFileSync(pagePath, 'utf-8')
  if (!existing.includes(START) || !existing.includes(END)) {
    console.error(`${slug}.md exists but has no bench:table markers — not touching it.`)
    process.exit(1)
  }
  const updated = existing.replace(
    new RegExp(`${START}[\\s\\S]*?${END}`),
    `${START}\n\n${table}\n\n${END}`
  )
  fs.writeFileSync(pagePath, updated)
  console.log(`refreshed table in docs/benchmarks/${slug}.md (${rowCount} rows)`)
} else {
  const today = new Date().toISOString().slice(0, 10)
  const page = `---
title: ${opts.title || slug}
benchmark: true
date: ${today}
benchId: ${ids}
report: /bench-reports/${assetName}
summary: TODO — one line on what this run was testing.
---

# ${opts.title || slug}

TODO — what you were testing and why it mattered.

${START}

${table}

${END}

[Full report →](/bench-reports/${assetName}) — the standalone version, with per-case
detail. Prints to PDF.
`
  fs.mkdirSync(path.dirname(pagePath), { recursive: true })
  fs.writeFileSync(pagePath, page)
  console.log(`wrote docs/benchmarks/${slug}.md (${rowCount} rows) — fill in the TODOs`)
}
