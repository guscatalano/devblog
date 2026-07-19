---
title: Simple PCap Viewer
tool: true
status: beta
repo: guscatalano/SimplePCapViewer
problem: A WinUI 3 viewer for pcap/pcapng capture files that's easy to search — and, primarily, exposes packet captures to an MCP server so an AI assistant can search and analyze network traffic for you.
install: |
  # Grab the MSIX or MSI from a tagged release:
  # https://github.com/guscatalano/SimplePCapViewer/releases
  #
  # Or build from source (requires the .NET 10 SDK):
  git clone https://github.com/guscatalano/SimplePCapViewer
  cd SimplePCapViewer
  dotnet build
installLang: powershell
screenshot: /screenshots/simplepcapviewer.png
relatedPosts: []
---

<ToolPage>

## What it does

- **Reads `pcap` / `pcapng` in-process** — no Npcap needed for the packet list and
  hex view; parsing is pure-managed.
- **tshark on demand** — uses the Wireshark CLI for display-filter search,
  per-field dissection, conversation/protocol statistics, stream reassembly, and
  object extraction.
- **MCP server (the primary use case)** — a local, loopback-only server that lets
  an AI assistant (Claude, etc.) search and analyze the capture you have open.
- **Optional TLS decryption** — point it at a TLS key-log file to inspect HTTPS
  traffic.

Requires Windows 10 (1809+) or Windows 11.

See the [privacy](/privacy/simplepcapviewer) and [security](/security/simplepcapviewer)
notes for how it handles capture data and the MCP server.

</ToolPage>
