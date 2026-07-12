---
title: Security — BinaryExplorer
---

# Security — BinaryExplorer

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/binaryexplorer) · [Source](https://github.com/guscatalano/BinaryExplorer)_

**Summary: A local tool that inspects Windows binaries without running them. It's
offline by default; two opt-in features reach the network, its MCP server is
unauthenticated, and the VirusTotal key is stored in cleartext.**

## Attack surface

- **Static analysis only** — BinaryExplorer parses binaries; it **does not
  execute** the target file.
- **Opt-in outbound calls:**
  - If you set a VirusTotal API key, it sends the **SHA-256 hash** of the
    inspected file to VirusTotal (the hash only — the file is never uploaded).
  - Installing YARA from within the app downloads it from GitHub.
- Optional **MCP server** (started from Settings) binds to `localhost` and has
  **no authentication**, plus a permissive CORS header — so while it runs, any
  local process or a browser page could reach it.
- The MSIX package runs full-trust (`runFullTrust`); note it makes the outbound
  calls above even though it does not declare `internetClient`.

## Secrets & data at rest

- The **VirusTotal API key is stored unencrypted** in the app's local settings.
  If that's a concern, don't configure one — everything else works offline.
- A startup/crash log is written to `%USERPROFILE%\.binexp-startup.log` (version,
  OS info, error stack traces), and extracted embedded files go to
  `%TEMP%\BinaryExplorer\`. Both stay local.

## Running it safely

- Keep the MCP server off unless you're using it, and stop it when you're done.
- Skip the VirusTotal key if you don't want a file hash leaving the machine or a
  key sitting in cleartext settings.
- BinaryExplorer is a reasonable way to examine untrusted binaries precisely
  *because* it never runs them — but still handle malicious samples with the
  usual care.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
