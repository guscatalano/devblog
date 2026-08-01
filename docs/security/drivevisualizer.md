---
title: Security — DriveVisualizer
---

# Security — DriveVisualizer

_Last updated: July 31, 2026 · [All security pages](/security/) · [Privacy](/privacy/drivevisualizer) · [Source](https://github.com/guscatalano/DriveVisualizer)_

**Summary: A local, offline desktop app with no network code and no listening
port. It runs as your normal user, not as admin. The real risk it carries is the
one you'd expect from a disk cleaner: it can delete files, including
permanently.**

## Attack surface

- **No network, inbound or outbound.** There is no HTTP client, no socket code,
  no update check, and no server component. Nothing listens on a port.
- **Metadata only.** The scanner reads directory entries via Win32
  (`FindFirstFileEx`) — names, sizes, attributes, timestamps. It does not read
  file contents and never executes anything it finds.
- **Runs unelevated.** The app manifest requests no elevation, so it runs with
  your token; directories your account can't read are skipped rather than
  bypassed. Don't run it elevated unless you actually need to see protected
  paths — and understand that doing so also gives its delete actions that reach.
- **S.M.A.R.T. reads are query-only.** Drive health opens a
  `\\.\PhysicalDriveN` handle with **zero access rights** and issues a single
  read-only property query (`IOCTL_STORAGE_QUERY_PROPERTY` for the NVMe health
  log), falling back to the storage WMI namespace. That's deliberately the one
  S.M.A.R.T. path available without admin — the app never opens a drive for raw
  read or write, so it can't read past the filesystem or bypass file ACLs, and
  it never sends a vendor command to the device. Drives that don't expose the
  data just show fewer fields.
- **Untrusted input is your own filesystem.** Scanning a folder full of
  attacker-controlled file names is safe: names are parsed and rendered, not
  interpreted. Reports are generated as static HTML from that data.
- The MSIX package runs full-trust (`runFullTrust`), as WinUI 3 desktop apps do.

## Destructive operations

This is the part worth reading twice:

- **Delete** uses the shell file operation with undo enabled — items go to the
  **Recycle Bin**.
- **Delete permanently** skips the Recycle Bin. There is no undo.
- **Compress to zip** deletes the original after creating the archive.
- Shell confirmation prompts are suppressed (`FOF_NOCONFIRMATION`), so the app's
  own confirmation is the only one you get.
- **Cleanup candidates** is a filter, never an automatic action — it highlights
  temp folders, caches, logs, the recycle bin and `node_modules`, and leaves the
  decision to you. Nothing is deleted without you asking.

Treat it like any tool with a delete button: verify the path before confirming,
and be deliberate with the permanent option.

## Data at rest

Scan snapshots, daily history, settings, and a crash log live under
`%LOCALAPPDATA%\DriveVisualizer\`; generated HTML reports go to `%TEMP%`. None of
it is encrypted, and a snapshot is effectively a full directory listing of what
you scanned — so if the paths on your machine are sensitive, treat those files
(and any report you export) accordingly.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
