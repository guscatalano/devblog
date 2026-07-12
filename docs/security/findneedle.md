---
title: Security — FindNeedle
---

# Security — FindNeedle

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/findneedle) · [Source](https://github.com/guscatalano/findneedle)_

**Summary: A local log-search tool. It reaches the network only for optional
sources you configure, stores access tokens encrypted with Windows DPAPI, and
caches log content locally.**

## Attack surface

- **By default there is no network activity.** Outbound HTTPS happens only for
  opt-in features:
  - **Online log sources** you configure (GitHub, Azure DevOps, Azure Data
    Explorer / Kusto) — connections go to the endpoints you specify.
  - **Optional tool downloads** (PlantUML, Node.js, Mermaid) from their official
    sites, only if you trigger them.
- An optional **MCP server** is **loopback-only** (`127.0.0.1`).
- Store package capabilities: `internetClient` (for the above),
  `broadFileSystemAccess` (so it can open log files anywhere you point it), and
  `runFullTrust`.

## Secrets & data at rest

- Access tokens for online sources (e.g. a GitHub token or Azure DevOps PAT) are
  stored **encrypted with Windows DPAPI** (tied to your Windows user account) in
  `%LocalAppData%\FindNeedle\` — never in plaintext, never in logs. They are sent
  only to the corresponding service over HTTPS.
- A **SQLite search-index cache** under `%LocalAppData%\FindNeedle\Cache\` is
  derived from the log content you search — so it can contain sensitive log data.
  It is auto-pruned, and you can delete it at any time.

## Running it safely

- Remember that `broadFileSystemAccess` lets the app read files anywhere on your
  system; that's expected for a log-search tool, but worth knowing.
- If you search sensitive logs, clear the `Cache\` folder afterward.
- Online-source tokens are only as safe as your Windows user account — DPAPI ties
  them to it.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
