#!/usr/bin/env node
// Import an AI_Proxy benchmark report into the blog.
//
//   node scripts/import-bench.mjs "http://192.168.6.183:11444/__proxy/api/bench/report?format=html&ids=b_23168a3d7a38"
//   node scripts/import-bench.mjs b_23168a3d7a38 --base http://192.168.6.183:11444
//
// Options: --slug <slug>  --title "<title>"  --base <proxy url>
//
// The proxy only listens on the LAN, so a published page can't link to it. This
// pulls the run while it is still reachable and commits three things:
//
//   docs/benchmarks/runs/<ids>.json        derived data, rendered by <BenchTable>
//   docs/public/bench-reports/<ids>.html   the standalone report, verbatim
//   docs/benchmarks/<slug>.md              the page, if it doesn't exist yet
//
// Re-running refreshes the data and the archived HTML but never rewrites an
// existing page, so prose survives.
//
// NOTE ON PATHS: the proxy's JSON carries `model`/`served` as the on-disk
// checkpoint path (e.g. /home/<user>/models/...). This repo is public, so the
// derived JSON is built from an explicit field allowlist and the display name
// is taken from the label, never from those fields.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

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
  return format === 'json' ? res.json() : res.text()
}

console.log(`fetching ${ids} from ${base} ...`)
let json, html
try {
  ;[json, html] = await Promise.all([get('json'), get('html')])
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

// ── derive ────────────────────────────────────────────────────────────────
// Label shape: "<display name> · @<backend> · <context> · think=<x> · <cache> [· N×parallel] · t=<temp>"
const labelParts = (label) => String(label || '').split(' · ')
const displayName = (row) => labelParts(row.label)[0] || 'unknown'
const backendOf = (row) =>
  (labelParts(row.label).find((p) => p.startsWith('@')) || '@?').slice(1)

const rowsIn = json.rows || []
const distinct = (fn) => [...new Set(rowsIn.map(fn).filter((v) => v != null))]

// Which knob did this run actually turn? A report varies exactly one of these.
// Assuming concurrency (as the first version did) silently collapses a
// cold-vs-cached run to one row per model and drops half the data.
const AXES = [
  {
    key: 'concurrency',
    values: () => distinct((r) => r.concurrency ?? 1),
    isSegment: (p) => /^\d+×parallel$/.test(p),
    of: (r) => r.concurrency ?? 1,
    pickPrimary: (vs) => Math.min(...vs),
    label: (v) => (v === 1 ? 'alone' : `${v}× concurrent`)
  },
  {
    key: 'cache',
    values: () => distinct((r) => r.cache),
    isSegment: (p) => p === 'cold' || p === 'cached',
    of: (r) => r.cache,
    pickPrimary: (vs) => (vs.includes('cached') ? 'cached' : vs[0]),
    label: (v) => String(v)
  },
  {
    key: 'thinking',
    values: () => distinct((r) => r.thinking),
    isSegment: (p) => p.startsWith('think='),
    of: (r) => r.thinking,
    pickPrimary: (vs) => (vs.includes('off') ? 'off' : vs[0]),
    label: (v) => `thinking ${v}`
  }
]

const axis = AXES.find((a) => a.values().length > 1) || null
const axisValues = axis ? axis.values() : []
const primaryValue = axis ? axis.pickPrimary(axisValues) : null
const secondaryValue = axis ? axisValues.find((v) => v !== primaryValue) ?? null : null
const isAxisSegment = (p) => (axis ? axis.isSegment(p) : false)

// Segments present on every row carry no per-entity information - they belong
// in the caption, not in a badge.
const allSegments = rowsIn.map((r) => labelParts(r.label))
const constantSegments = new Set(
  (allSegments[0] || []).filter((seg) => allSegments.every((parts) => parts.includes(seg)))
)

// Entity = the label with the axis segment removed. Whatever still varies
// (e.g. "32k ctx" vs "256k ctx") becomes the variant badge.
const entityKeyOf = (row) => labelParts(row.label).filter((p) => !isAxisSegment(p)).join(' · ')
const variantOf = (row) =>
  labelParts(row.label)
    .slice(2)
    .filter((p) => !isAxisSegment(p) && !constantSegments.has(p) && !p.startsWith('@'))
    .join(' · ')

const byEntity = new Map()
for (const row of rowsIn) {
  const key = entityKeyOf(row)
  if (!byEntity.has(key)) {
    byEntity.set(key, {
      model: displayName(row),
      backend: backendOf(row),
      variant: variantOf(row) || null,
      quant: row.quant || null
    })
  }
  const metrics = {
    ttft: row.ttft_p50 ?? null,
    decode: row.decode_p50 ?? null,
    total: row.total_p50 ?? null,
    perfect: row.perfect_rate ?? null,
    cases: row.case_pass_rate ?? null,
    core: row.tiers?.core?.perfect_rate ?? null,
    hard: row.tiers?.hard?.perfect_rate ?? null
  }
  byEntity.get(key)[!axis || axis.of(row) === primaryValue ? 'primary' : 'secondary'] = metrics
}

const models = [...byEntity.values()].sort(
  (a, b) => (b.primary?.perfect ?? -1) - (a.primary?.perfect ?? -1)
)

const paired = models.filter((m) => m.primary && m.secondary).length
console.log(
  axis
    ? `axis: ${axis.key} (${axis.label(primaryValue)} -> ${axis.label(secondaryValue)}), ${paired}/${models.length} paired`
    : 'axis: none (single state per model)'
)
if (axis && paired < models.length) {
  console.warn(`warning: ${models.length - paired} entit(ies) have only one side of the ${axis.key} axis`)
}

const first = (json.rows || [])[0] || {}
const constantOr = (value, fn) => (distinct(fn).length === 1 ? value ?? null : null)
const envs = (json.env || []).filter(Boolean)
const uniq = (xs) => [...new Set(xs.filter((x) => x != null))]

const data = {
  benchId: ids,
  meta: {
    suite: first.suite ?? null,
    // Only report a setting in the caption if it actually held for the whole
    // run. When a knob varies it lives in the axis or the variant badge, and
    // printing one arbitrary value here would misdescribe half the rows.
    context: constantOr(labelParts(first.label)[2], (r) => labelParts(r.label)[2]),
    thinking: constantOr(first.thinking, (r) => r.thinking),
    cache: constantOr(first.cache, (r) => r.cache),
    entityCount: models.length,
    temperature: first.temperature ?? null,
    axis: axis
      ? { key: axis.key, primary: axis.label(primaryValue), secondary: axis.label(secondaryValue) }
      : null,
    tasks: (first.tiers?.core?.tasks ?? 0) + (first.tiers?.hard?.tasks ?? 0) || null,
    runsPerCell: first.n_total ?? null,
    gpus: uniq(envs.flatMap((e) => (e.gpus || []).map((g) => g.name))),
    memTotalGb:
      Math.round(Math.max(0, ...envs.map((e) => e.mem?.total_mb || 0)) / 1024) || null,
    backends: uniq((json.rows || []).map(backendOf)),
    rowCount: (json.rows || []).length
  },
  models
}

// Belt and braces: nothing that looks like a filesystem path may ship.
const serialized = JSON.stringify(data, null, 2)
const leak = serialized.match(/(?:\/home\/|\/Users\/|[A-Za-z]:\\\\)[^"]*/)
if (leak) {
  console.error(`refusing to write: derived JSON contains a filesystem path (${leak[0].slice(0, 60)}).`)
  process.exit(1)
}

const assetName = `${ids.replace(/[^A-Za-z0-9_,-]/g, '_')}.html`
const assetDir = path.join(root, 'docs/public/bench-reports')
fs.mkdirSync(assetDir, { recursive: true })
fs.writeFileSync(path.join(assetDir, assetName), html)
console.log(`wrote docs/public/bench-reports/${assetName} (${Math.round(html.length / 1024)} KB)`)

const dataDir = path.join(root, 'docs/benchmarks/runs')
fs.mkdirSync(dataDir, { recursive: true })
fs.writeFileSync(path.join(dataDir, `${assetName.replace(/\.html$/, '')}.json`), serialized)
console.log(`wrote docs/benchmarks/runs/${assetName.replace(/\.html$/, '')}.json (${models.length} models, ${data.meta.rowCount} runs)`)

const slug = opts.slug || ids.split(',')[0]
const pagePath = path.join(root, 'docs/benchmarks', `${slug}.md`)
if (fs.existsSync(pagePath)) {
  console.log(`docs/benchmarks/${slug}.md exists — left alone (data refreshed underneath it)`)
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

<BenchTable bench-id="${ids}" />

[Full report →](/bench-reports/${assetName}) — the standalone version, with
per-case detail. Prints to PDF.
`
  fs.mkdirSync(path.dirname(pagePath), { recursive: true })
  fs.writeFileSync(pagePath, page)
  console.log(`wrote docs/benchmarks/${slug}.md — fill in the TODOs`)
}
