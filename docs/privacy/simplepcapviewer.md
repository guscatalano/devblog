---
title: Privacy Policy — Simple PCap Viewer
---

# Privacy Policy — Simple PCap Viewer

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/SimplePCapViewer)_

**Summary: Simple PCap Viewer runs entirely on your computer. It contains no
analytics or telemetry, sends your data nowhere, and declares no internet
capability in its Microsoft Store package.**

## What the app works with

Simple PCap Viewer opens packet capture files (`.pcap`/`.pcapng`) that you
select, and can attach Windows event/trace logs (`.evtx`/`.etl`). It parses and
displays the full contents of those files, including packet payloads. If you
provide a TLS key-log file, it can also decrypt captured HTTPS traffic. All of
this happens locally.

Because captures can contain anything that was on the wire, they may include
sensitive data (credentials, tokens, personal information) in packet payloads.
The app only ever reads what you open; it neither transmits nor retains that
content beyond your session and the files you choose to save.

## What leaves your device

**Nothing.** No outbound network connections, no telemetry, no analytics, no
update check. For deep analysis the app may run a local copy of `tshark.exe` if
one is installed — that's a local process, not a network call.

## What's stored on your device

- **No settings file, log, or registry data** is written; UI preferences (such
  as the MCP port) are kept in memory only.
- **Extracted objects** — if you use the "extract objects" feature, carved files
  are written to `%TEMP%\SimplePCapViewer\objects\` on your machine.
- **Exports** you save go wherever you choose.

## The optional MCP server

Simple PCap Viewer includes an optional local **MCP server** for AI clients. It
binds to **loopback only** (`127.0.0.1`, default port 7777), so it is not
reachable from other machines, and it has **no authentication** — while it is
running, any local process can query the capture you currently have open
(including decrypted TLS if you enabled a key-log). For details and safe-use
guidance, see the [README](https://github.com/guscatalano/SimplePCapViewer#readme).

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/SimplePCapViewer/issues)
