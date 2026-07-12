---
title: Security — PixelPet
---

# Security — PixelPet

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/pixelpet) · [Source](https://github.com/guscatalano/PixelPet)_

**Summary: A local Electron desktop app. It has no inbound network surface, its
API keys are encrypted at rest, and its only outbound calls are app updates and
optional AI features you configure.**

## Attack surface

- **No inbound listener.** All network activity is outbound and originates in the
  main process; the renderer is locked down by a Content-Security-Policy that
  blocks remote requests.
- **Outbound:**
  - An update check against GitHub Releases (disabled in the Microsoft Store
    build, which updates through the Store).
  - Optional **AI pet generation** — if you enable it, a photo you select is sent
    to the provider **you configure** (OpenAI, Anthropic, or a local model such
    as Ollama).
  - Optional **Immich "dream mode"** — fetches photos from **your own** Immich
    server.
- To let the pet "stand on" your windows, it reads other windows' **position and
  size only** — not their titles or contents — and your cursor location. It does
  not capture keystrokes or the clipboard.

## Secrets & data at rest

- AI and Immich **API keys are encrypted at rest** using the OS secure store
  (Windows DPAPI via Electron `safeStorage`), kept in separate files from the
  rest of your settings, and never exposed to the app's UI layer.
- Settings, pet state, and source photos for generated pets live under
  `%APPDATA%\PixelPet\`.

## Running it safely

- Point the AI feature at a **local model** if you don't want photos leaving your
  machine.
- Only configure API keys you're comfortable storing (encrypted) on the device.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
