---
title: Security — DonationTracker
---

# Security — DonationTracker

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/donationtracker) · [Source](https://github.com/guscatalano/DonationTracker)_

**Summary: DonationTracker is a self-hosted web app that holds personal and
financial records. By default its web server listens on all interfaces with no
authentication, and its data is stored unencrypted. Run it on a trusted network
or behind your own auth.**

## Attack surface

- **Web server binds to `0.0.0.0` (all interfaces)** on port 8000, with **no
  authentication.** Anyone who can reach the port can view, edit, and export
  every record.
- The **export endpoint** (full database + CSVs + all images as a ZIP) is also
  unauthenticated.
- **Optional self-signed HTTPS** (`USE_HTTPS=1`) encrypts the connection but is
  **not** access control.
- **Outbound:** item photos are sent to the LLM endpoint you configure
  (`LLM_BASE_URL`) for categorization — this defaults to a local Ollama, so
  images stay on your machine unless you change it. An optional self-update pulls
  code from the app's Git remote. Receipt images are never sent anywhere.

## Secrets & data at rest

- Donor names, charity names/addresses, dollar amounts, notes, and uploaded
  item/receipt images are stored **unencrypted** in a SQLite database and file
  folder under `DATA_DIR` (default `./data`).
- **Daily database backups** (last several) sit under `data/backups/`, and any
  **Export ZIP** you generate contains the full unencrypted dataset.
- There are no user accounts, so there are no passwords for the app itself to
  store.

## Running it safely

- **Bind to loopback** (`127.0.0.1`) if only the local machine needs access, or
  reach it remotely over a private network such as Tailscale rather than port
  forwarding.
- **Put it behind authentication** — a reverse proxy with basic/OIDC auth, or a
  Cloudflare Tunnel — before exposing it beyond a trusted LAN.
- **Protect `DATA_DIR`** with filesystem permissions and/or full-disk
  encryption, and treat exported ZIPs as sensitive.
- **Keep the LLM endpoint local** if you don't want item photos leaving your
  machine.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
