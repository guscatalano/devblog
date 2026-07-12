---
title: Privacy Policy — FindNeedle
---

# Privacy Policy — FindNeedle

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/findneedle)_

**Summary: FindNeedle is a local log-search tool. It works entirely on your
machine by default and contains no analytics or telemetry. It reaches the
network only for optional features you configure — such as connecting to an
online log source or downloading an optional helper tool.**

## What the app works with

FindNeedle searches diagnostic files on your computer. It reads local logs such
as Windows Event Logs (`.evtx`), ETW traces (`.etl`), packet captures
(`.pcap`/`.pcapng`), and CSV/JSON/text/ZIP files, and it can read (never write)
some registry keys to locate tools and OS build information. These files can
contain sensitive content; FindNeedle processes them locally.

## What leaves your device

**By default, nothing.** There is no telemetry, no analytics, and no automatic
update check that contacts a server. The app reaches out only when you use one
of these opt-in features:

- **Online log sources** — if you configure a GitHub, Azure DevOps, or Azure
  Data Explorer (Kusto) source, FindNeedle connects over HTTPS to the endpoint
  **you specify** to run your queries and pull results. This happens only for
  sources you set up.
- **Optional tooling downloads** — if you enable diagram features that need
  PlantUML, Node.js, or Mermaid, FindNeedle downloads those from their official
  distribution sites. This happens only if you trigger it.

An optional local **MCP server** is loopback-only (`127.0.0.1`) and is not a
remote connection.

## Credentials

If you connect to an online source that needs a token (for example a GitHub
token or an Azure DevOps Personal Access Token), FindNeedle stores it **encrypted
with Windows DPAPI** (tied to your Windows user account) in the app's local data
folder — never in plaintext, and never in logs. Tokens are transmitted only to
the corresponding service, over HTTPS.

## What's stored on your device

Everything below lives under `%LocalAppData%\FindNeedle\`:

- **Connection settings** for online sources (`online-sources.json`,
  `connections.json`) — including the DPAPI-encrypted secrets above.
- **A search-index cache** (`Cache\`, SQLite) derived from the log content you
  search, to make repeat searches fast. This holds content from your logs and is
  auto-pruned. You can delete it at any time.
- **UI preferences** (e.g. CSV column mappings) and **downloaded helper tools**
  under `Dependencies\`.
- Temporary working files under `%Temp%\FindNeedle\`.

## Microsoft Store capabilities

The Store package declares `internetClient` (for the optional online sources and
downloads above), `broadFileSystemAccess` (so it can open log files anywhere you
point it — appropriate for a log-search tool), and `runFullTrust`. It does not
request microphone, camera, location, or contacts access.

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/findneedle/issues)
