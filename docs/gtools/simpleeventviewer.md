---
title: Simple Event Viewer
tool: true
status: stable
repo: guscatalano/SimpleEventViewer
problem: A modern WinUI 3 replacement for the Windows Event Viewer — fast streaming reads, cross-aware filters, EVTX file support, and an optional MCP server so an LLM can query your logs.
install: |
  # Download from GitHub releases:
  # https://github.com/guscatalano/SimpleEventViewer/releases/latest
  # MSI installer (recommended) or MSIX package, both x64
installLang: powershell
screenshot: ../assets/images/simpleeventviewer.png
relatedPosts:
  - link: /posts/simple-event-viewer
    text: "Why I rewrote Windows Event Viewer"
---

<ToolPage>

## Highlights

- **Streaming reads** — events appear in the UI as they're pulled from the log; the UI stays responsive even on 50k+ event loads.
- **Cross-aware filters** — every filter dropdown narrows to values that actually appear in the current view, with live counts.
- **EVTX / XML / ETL support** — open saved log files directly; XML and ETL loaders behind an experimental toggle.
- **MCP server** — optional local Model Context Protocol server (127.0.0.1 only, default port 7321) that exposes loaded events to LLM clients via `tools/call` (`list_events`, `search_events`, `event_summary`, etc.).
- **Themes** — System / Light / Dark plus Nord, Dracula, Solarized, Sepia, and High Contrast presets.
- **Export** — selection or full filtered view to CSV / JSON / XML.

## Install

Download the latest release from [GitHub releases](https://github.com/guscatalano/SimpleEventViewer/releases/latest):

- `SimpleEventViewer.msi` — standard MSI installer
- `SimpleEventViewer_1.x.x.x_x64.msix` — MSIX package (requires sideloading enabled)

Requires Windows 10 1809+ or Windows 11.

See the [companion blog post](/posts/simple-event-viewer) for the why and how.

</ToolPage>
