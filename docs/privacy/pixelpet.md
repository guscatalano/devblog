---
title: Privacy Policy — PixelPet
---

# Privacy Policy — PixelPet

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/PixelPet)_

**Summary: PixelPet is a desktop pet that runs on your computer. It contains no
analytics or telemetry. It reaches the network only for an optional AI feature
you configure and for app updates.**

## What the app works with

PixelPet is an Electron desktop app — an animated pet that lives on your screen.
To let the pet "stand on" your windows, it reads the on-screen position and size
of visible windows and your cursor location. It reads **only window geometry**
(positions/sizes and visibility) — not window titles, not window contents, and
it does not capture keystrokes or your clipboard.

## What leaves your device

**By default, essentially nothing about you.** There is no telemetry or
analytics. Network access is limited to:

- **App updates** — on launch and periodically, PixelPet checks GitHub Releases
  for a new version. (This is disabled in the Microsoft Store build, which
  updates through the Store.)
- **Optional AI pet generation** — if you turn this on and configure a provider,
  PixelPet sends a **photo you select** to the AI provider **you choose** to
  generate a pet from it. You can use OpenAI, Anthropic, or point it at a local
  model (e.g. Ollama) so nothing leaves your machine at all. Photos are sent only
  to the endpoint you configured, and only when you use this feature.
- **Optional Immich "dream mode"** — if you configure it, PixelPet fetches photos
  from **your own** Immich server.

## Credentials

If you use the AI or Immich features, your **API keys are encrypted at rest**
using the operating system's secure storage (Windows DPAPI via Electron
`safeStorage`), stored separately from the rest of your settings, and never
exposed to the app's UI layer. Keys are sent only to the provider they belong to.

## What's stored on your device

Everything lives under `%APPDATA%\PixelPet\`:

- **`settings.json`** — your active pet, scale, and (non-secret) AI/Immich
  configuration.
- **`ai-key.json` / `immich-key.json`** — the encrypted API keys above.
- **`care.json`** — your pet's state.
- **Source photos** for generated pets, saved under `pets\<id>\` so "dream mode"
  can use them; deleted when you delete the pet.

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/PixelPet/issues)
