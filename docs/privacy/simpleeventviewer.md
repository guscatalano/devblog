---
title: Privacy Policy — Simple Event Viewer
---

# Privacy Policy — Simple Event Viewer

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/SimpleEventViewer)_

**Summary: Simple Event Viewer runs entirely on your computer. It contains no
analytics or telemetry, and it does not send your data anywhere. The app does
not even request internet access.**

## What the app works with

Simple Event Viewer reads Windows Event Logs from your machine — live logs and
saved log files (`.evtx`, and `.xml`/`.etl` behind an experimental toggle). Log
data is loaded into memory and shown in the UI. This can include whatever your
Windows logs contain, such as usernames and computer names, but that data never
leaves your device.

## What leaves your device

**Nothing.** The app makes no outbound network connections and declares no
internet capability in its Microsoft Store package. There is no telemetry, no
analytics, no crash reporting sent anywhere, and no update "phone-home."

## What's stored on your device

- **UI preferences** (theme, colors, column layout, filter settings, MCP
  settings) in the app's per-user local settings.
- **A crash log** written locally to `%TEMP%\simpleeventviewer-crash.log` if the
  app hits an unhandled error. It stays on your machine.
- **Exports** you explicitly save (CSV/JSON/XML) go wherever you choose.

## The optional MCP server

Simple Event Viewer includes an optional local **MCP server** so an AI client on
your machine can query the events you have loaded. It is **off by default**, and
when enabled it binds to **loopback only** (`127.0.0.1`, default port 7321), so
it is not reachable from other machines. It has **no authentication**, so while
it is enabled any process on your computer can query the events you currently
have loaded. For details and safe-use guidance, see the [MCP section of the
README](https://github.com/guscatalano/SimpleEventViewer#readme).

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/SimpleEventViewer/issues)
