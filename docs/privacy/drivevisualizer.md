---
title: Privacy Policy — DriveVisualizer
---

# Privacy Policy — DriveVisualizer

_Last updated: July 27, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/DriveVisualizer)_

**Summary: DriveVisualizer scans your disk and draws the results on your own
machine. It has no network code at all — no telemetry, no analytics, no update
check. What it saves (scan snapshots and history) stays in your local app data
folder.**

## What the app works with

DriveVisualizer enumerates files and folders on the drive or folder you choose,
reading **metadata only** — names, paths, sizes (logical and on-disk),
attributes, and timestamps. It does **not** read file contents, and it does not
open, execute, or upload anything it finds. File names and paths are used to
classify entries into categories (apps, pictures, documents, temp & logs, and so
on) entirely on-device.

## What leaves your device

**Nothing.** The app contains no HTTP client, socket code, telemetry, analytics,
or crash-reporting SDK — there is no server for it to talk to, mine or anyone
else's. It never checks for updates on its own; the Microsoft Store build is
updated by the Store, and I receive no data from it beyond the anonymous install
and rating counts Microsoft shows every publisher.

## What's stored on your device

All of it local, under `%LOCALAPPDATA%\DriveVisualizer\` (or the packaged app's
local folder when installed as MSIX):

- **Scan snapshots** (`autosnap\*.dvsnap`) — one automatic baseline per scanned
  target, so the next scan can show what changed. These contain the folder and
  file structure you scanned with sizes, so treat them like a directory listing.
- **Daily history** (`history\`) — one snapshot per day of use per target, which
  feeds the size-over-time chart.
- **Settings** — your view preferences, in the app's local settings store.
- **A crash log** (`crash.log`) — timestamps and exception stack traces, written
  only when something goes wrong.
- **Generated reports** — diff, history, and comparison HTML reports are written
  to your temp folder (`%TEMP%\DriveVisualizer-*.html`) when you open one; snapshots
  and reports you explicitly save go wherever you choose.

Nothing here is encrypted, because none of it leaves the machine. Delete the
folder any time to reset the app's memory of your drives.

## Files you delete

Deleting from within the app is a real delete: **Delete** sends the item to the
Recycle Bin, **Delete permanently** does not, and **compress to zip** removes the
original after zipping. DriveVisualizer keeps no copy of anything it deletes.

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/DriveVisualizer/issues)
