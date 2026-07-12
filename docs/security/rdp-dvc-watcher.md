---
title: Security — RDP DVC Watcher
---

# Security — RDP DVC Watcher

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/rdp-dvc-watcher) · [Source](https://github.com/guscatalano/RDP_DVC_Watcher)_

**Summary: A local ETW diagnostics tool. It requires administrator rights, reads
only channel names and byte counts, and stores/sends nothing.**

## Attack surface

- **No network surface** — no listeners, no outbound calls, no telemetry.

## Privileges & data

- **Requires Administrator** to open the ETW trace session.
- It reads only per-channel names and traffic byte counts — no message content
  and no personal data. Counts are held in memory and printed to the console;
  nothing is persisted.

## Running it safely

- Run elevated only while you need to observe RDP channel traffic, then close it.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
