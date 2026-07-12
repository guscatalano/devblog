---
title: Security — Simple Event Viewer
---

# Security — Simple Event Viewer

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/simpleeventviewer) · [Source](https://github.com/guscatalano/SimpleEventViewer)_

**Summary: A local desktop app with no network egress. Its only network surface
is an optional MCP server that is off by default, loopback-only, and
unauthenticated.**

## Attack surface

- **No outbound network access** — the Store package does not even declare the
  `internetClient` capability.
- Optional **MCP server**:
  - **Off by default** — you must enable it in Settings.
  - Binds to **loopback only** (`127.0.0.1`, default port 7321), so it is not
    reachable from other machines.
  - Has **no authentication**, and responds with a permissive CORS header. While
    it's enabled, any local process — including a web page open in your browser —
    can query the events you currently have loaded.

## Secrets & data at rest

- No credentials are handled. UI preferences are stored in the app's per-user
  local settings.
- A crash log may be written to `%TEMP%\simpleeventviewer-crash.log`, and a small
  `mcp-instances.json` (process id / port only) tracks running MCP instances.
  Both stay on your machine.

## Running it safely

- Leave the MCP server **off** unless you're actively using an AI client with it,
  and disable it when you're done.
- Treat loaded event logs as sensitive — they can contain usernames, computer
  names, and other operational detail.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
