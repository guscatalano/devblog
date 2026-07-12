---
title: Security — ProcMonClone
---

# Security — ProcMonClone

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/procmonclone) · [Source](https://github.com/guscatalano/ProcMonClone)_

**Summary: A local kernel-tracing diagnostics tool. It requires administrator
rights and captures sensitive system-wide activity, but stores nothing and sends
nothing.**

## Attack surface

- **No network surface at all** — no listeners, no outbound calls, no telemetry.
- The only "port" it uses is a local kernel minifilter communication channel
  (on-machine driver IPC, not networking).

## Privileges & data

- **Requires Administrator** to open kernel ETW sessions and the minifilter port.
- It captures highly sensitive, system-wide activity (process/thread/image, file,
  registry, and network events, including process command lines). This data is
  rendered live in memory and **is not written to disk** — there is no persistence,
  and the save/export menu items are stubs.

## Running it safely

- Run elevated only when you actively need to trace, and close it afterward.
- Captured command lines can contain secrets (passwords, tokens) that other
  processes passed on their command line; the tool doesn't store or transmit
  them, but be mindful when sharing your screen.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
