---
title: Privacy Policy — DonationTracker
---

# Privacy Policy — DonationTracker

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/DonationTracker)_

**Summary: DonationTracker is a self-hosted app you run yourself. Your donation
records stay in a local database on your machine. It has no telemetry and sends
nothing to me — but the data is stored unencrypted and the web app has no
password by default, so please read the security notes below.**

## What the app does

DonationTracker helps you track your charitable donations locally. You run it as
a small web app on your own machine or home server and enter your records.

## What it stores, and where

Data is stored in a local SQLite database and file folder under the app's data
directory (`./data` by default):

- **Donation records** — item descriptions, categories, estimated values,
  quantities, and notes; **donation events** including charity names and
  addresses; **donor names**; and **cash donations** including amounts, dates,
  and payment methods.
- **Uploaded images** — item photos and receipt images you upload, kept in
  `data/uploads/`.
- **Daily database backups** (last several) under `data/backups/`.

**This data is stored unencrypted** on disk, and the export feature produces a
ZIP containing the full database, CSVs, and all images.

## What leaves your device

- **By default, nothing.** DonationTracker has no telemetry or analytics and no
  cloud sync.
- **Item photo categorization (optional AI)** — when you add an item photo, the
  app can send that image to an OpenAI-compatible model to suggest a category.
  **By default this points at a local model** (Ollama on `localhost`), so the
  image stays on your machine. You can change the endpoint in Settings; if you
  point it at a remote/cloud service, your item photos will be sent there. Cash
  **receipt** images are never sent — only item photos, and only if you use this
  feature.
- **Optional self-update** pulls new code from the app's Git repository if you
  enable it; no data is uploaded.

## Access and security

DonationTracker has **no built-in authentication**, and by default its web
server listens on all network interfaces — so on an untrusted network, others
could view, edit, or export the records described above. Your data is also stored
unencrypted on disk. These are deployment properties, not data that is sent to
me.

For how to run it safely — binding to localhost, fronting it with
authentication, and protecting the data directory — see the [Security notes in
the README](https://github.com/guscatalano/DonationTracker#security-notes).

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/DonationTracker/issues)
