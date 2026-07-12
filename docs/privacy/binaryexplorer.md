---
title: Privacy Policy — BinaryExplorer
---

# Privacy Policy — BinaryExplorer

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/BinaryExplorer)_

**Summary: BinaryExplorer inspects Windows binaries on your machine without
running them. It contains no analytics or telemetry. It reaches the network only
for optional features you turn on — a VirusTotal hash lookup and a YARA tool
download.**

## What the app works with

BinaryExplorer statically analyzes a binary file you select — parsing its PE/MSI
structure, imports, resources, strings, signatures, hashes, and embedded files.
It **does not execute** the target binary. It reads (never writes) some local
registry keys to resolve COM identifiers found in the file.

## What leaves your device

**By default, nothing** — no telemetry, no analytics. Two optional features make
outbound connections, and only when you enable them:

- **VirusTotal lookup** — if you save a VirusTotal API key in Settings,
  BinaryExplorer sends the **SHA-256 hash** of the file you're inspecting to
  `virustotal.com` to look up existing analysis. It sends the hash only — **the
  file itself is never uploaded.** Without a configured key, no VirusTotal call
  is made.
- **YARA download** — if you choose to install YARA from within the app, it
  downloads the official release from GitHub.

An optional local **MCP server** binds to `localhost` and is started only by you;
it is not a remote connection. (It has no authentication — see "Access and
security" below.)

## Credentials

The only secret is your **VirusTotal API key**, if you choose to enter one. Be
aware it is stored in the app's local settings **in plaintext** (not encrypted),
and it is sent to VirusTotal to authenticate your lookups. It is not written to
any log. If that trade-off concerns you, simply don't configure a key — the rest
of the app works fully offline.

## What's stored on your device

- **Settings** (including the VirusTotal key and scan preferences) in the app's
  local settings store.
- **A startup/crash log** at `%USERPROFILE%\.binexp-startup.log` (app version,
  OS info, and error stack traces). Local only.
- **Extracted embedded files**, if you extract them, under
  `%TEMP%\BinaryExplorer\`.
- **Downloaded YARA binaries** under `%LOCALAPPDATA%\BinaryExplorer\yara\`.
- **Reports** you export go wherever you choose.

## Access and security

BinaryExplorer runs locally. Two things are worth knowing: its optional MCP
server has no authentication (and sends a permissive CORS header while running),
and the VirusTotal API key, if you set one, is stored unencrypted in the app's
local settings. For how to use these safely, see the [Security notes in the
README](https://github.com/guscatalano/BinaryExplorer#security-notes).

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/BinaryExplorer/issues)
