---
title: Security — AI Proxy
---

# Security — AI Proxy

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/ai-proxy) · [Source](https://github.com/guscatalano/AI_Proxy)_

**Summary: AI Proxy records the AI traffic that passes through it to a local
database, and by default its dashboard listens on all network interfaces with no
authentication. Treat it as a tool for a trusted, isolated machine and harden it
before exposing it anywhere else.**

## Attack surface

- **Dashboard / API binds to `0.0.0.0` (all interfaces) by default**, on port
  8000. There is **no authentication.** Anyone who can reach the port can browse
  the recorded traffic.
- The built-in **PII redaction** limits which viewers see full bodies based on
  their IP/subnet relative to the request originator (loopback sees everything).
  This is a visibility control, **not a login** — don't rely on it as access
  control.
- The optional **MCP endpoint** can require a bearer token (`MCP_API_KEY`), but
  it is **disabled by default**.
- **Outbound:** proxied requests go to the upstream you configure (a local model,
  or a third party such as Anthropic if you point it there). Optional web-search
  tools contact Brave or DuckDuckGo.
- **No TLS interception.** It is an explicit reverse proxy, not a MITM — it does
  not mint certificates or intercept your other TLS traffic. It can optionally
  serve its own HTTPS listener if you supply a cert and key.

## Secrets & data at rest

- The SQLite database stores **full request and response bodies, streamed
  content, and request/response headers in cleartext.** Because headers are
  stored verbatim, any `Authorization` / `x-api-key` your client sends is written
  to the database. Bodies are capped (256 KB default) and pruned after a
  retention window (30 days default).
- The database lives at `PROXY_DB`, or a per-user data directory
  (`%LOCALAPPDATA%\ai-proxy\`, `~/.local/share/ai-proxy`, or `/data` in Docker).
  Treat this file as sensitive.

## Running it safely

- **Bind to loopback** — set `PROXY_HOST=127.0.0.1` if only the local machine
  needs access. (Note the Docker image and compose file default to `0.0.0.0`.)
- **Put it behind your own auth** — if it must be reachable, front it with an
  authenticated reverse proxy, a firewall/allowlist, or a private network
  (e.g. Tailscale). Do not expose it to the public internet.
- **Protect the database file** with filesystem permissions and/or disk
  encryption; shorten `PROXY_REQUEST_RETENTION_DAYS` if you don't need history.
- **Don't proxy traffic you're not comfortable storing** in cleartext on disk.
- Keep `PROXY_REDACT_PII` on, and understand what it does and doesn't cover.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
