---
title: Privacy Policy — ProcMonClone
---

# Privacy Policy — ProcMonClone

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/ProcMonClone)_

**Summary: ProcMonClone is a local diagnostics tool. It shows live system
activity on your own machine and stores nothing, sends nothing, and contains no
telemetry.**

## What the app works with

ProcMonClone is a Process Monitor–style tool that uses kernel ETW tracing (and
the Procmon minifilter) to capture live system activity: process, thread, image
load, file, registry, and network events across the machine, including process
command lines. This is inherently sensitive system-wide data. It requires
Administrator rights to run.

## What leaves your device

**Nothing.** There are no network connections of any kind, no telemetry, no
analytics, and no update check. The only "port" it uses is a local kernel
minifilter communication channel — that is on-machine communication with a
driver, not networking.

## What's stored on your device

**Nothing.** Captured events are rendered live to the console/UI in memory and
are not written to disk. There are no settings files, logs, caches, or registry
writes. (The save/export menu items are stubs and do not persist data.)

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/ProcMonClone/issues)
