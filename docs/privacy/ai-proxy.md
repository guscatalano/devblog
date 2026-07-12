---
title: Privacy Policy — AI Proxy
---

# Privacy Policy — AI Proxy

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/AI_Proxy)_

**Summary: AI Proxy is a self-hosted observability tool you run yourself. Its
whole job is to record the AI traffic that passes through it, and it stores that
on your machine. It has no telemetry and sends nothing to me. Because it records
full requests and responses locally and has no built-in access control, also see
"Access and security" below.**

## What the app does

AI Proxy sits between an AI client and an AI backend (for example a local Ollama
or LM Studio, or Anthropic's API) so you can see and analyze what's happening. To
do that, it **records each request and response** it proxies.

## What it stores, and where

AI Proxy writes proxied traffic to a local SQLite database on the machine where
you run it:

- **Full request and response bodies** (your prompts and the model's outputs),
  **streamed content**, the **model name**, the **client IP**, and the
  **request/response headers**. Bodies are stored in plaintext, capped at 256 KB
  each by default, and pruned after a retention window (30 days by default) —
  both configurable.
- Derived data such as conversation labels, memory, to-dos, and benchmark runs.

The database lives at your configured `PROXY_DB` path, or a per-user data
directory (`%LOCALAPPDATA%\ai-proxy\` on Windows; `~/.local/share/ai-proxy` on
Linux; `/data` in Docker). Generated images and your `rules.json` live alongside
it.

**Important — headers can contain API keys.** Because it records request headers
verbatim, any `Authorization` or `x-api-key` header sent by your client is
written to the local database in cleartext.

## What leaves your device

- **Proxied traffic goes to the upstream you configure** — a local model, or a
  third party such as Anthropic (`api.anthropic.com`) if you point it there. That
  forwarding is the tool's purpose.
- **Optional web search** (Brave or DuckDuckGo) if you enable those tools.
- **No telemetry, no analytics, and nothing is sent to me or any server I
  control.**

## Access and security

AI Proxy has **no built-in authentication**, and by default its dashboard/API
listens on all network interfaces — so on an untrusted network, others could
reach the recorded traffic described above. This is a property of how you deploy
it, not data that is sent to me.

For how to run it safely — binding to `127.0.0.1`, fronting it with an
authenticated reverse proxy, tuning the PII redaction, and protecting the
database file — see the [Security notes in the
README](https://github.com/guscatalano/AI_Proxy#security-notes).

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/AI_Proxy/issues)
