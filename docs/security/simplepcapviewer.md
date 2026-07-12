---
title: Security — Simple PCap Viewer
---

# Security — Simple PCap Viewer

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/simplepcapviewer) · [Source](https://github.com/guscatalano/SimplePCapViewer)_

**Summary: A local desktop app with no network egress. Its only network surface
is an optional MCP server that is loopback-only and unauthenticated. It also
handles capture files that can contain secrets.**

## Attack surface

- **No outbound network access** — the Store package does not declare the
  `internetClient` capability.
- Optional **MCP server**:
  - Binds to **loopback only** (`127.0.0.1`, default port 7777) — not reachable
    from other machines. It also serves a `/config` helper page.
  - Has **no authentication.** While it's running, any local process can query
    the capture you currently have open — including **decrypted TLS** if you
    loaded a key-log file.
- For deep analysis it may run a local `tshark.exe` if one is installed; that's a
  local process, not a network call.

## Secrets & data at rest

- No settings file, log, or registry data is written; UI preferences live in
  memory only.
- If you use "extract objects," carved payload files are written to
  `%TEMP%\SimplePCapViewer\objects\`. Capture files themselves can contain
  credentials and other secrets in packet payloads — handle them accordingly.

## Running it safely

- Start the MCP server only when you need it, and be mindful that a loaded TLS
  key-log lets any local MCP caller read decrypted traffic.
- Treat capture files (and extracted objects) as sensitive.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
