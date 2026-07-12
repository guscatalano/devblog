---
title: Privacy Policy — FoscamFinder
---

# Privacy Policy — FoscamFinder

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/FoscamFinder)_

**Summary: A local console tool that discovers Foscam cameras on your own
network. No internet, no telemetry, nothing stored.**

## What the app works with

FoscamFinder is a proof-of-concept console utility. It sends a UDP broadcast on
your local network to discover Foscam cameras, then reads the details each
camera reports back (camera ID, name, IP, firmware version, and similar network
metadata) and can query a discovered camera's local CGI API.

## What leaves your device

**Only local-network traffic.** It broadcasts on your LAN and communicates with
cameras discovered on that LAN. There is no remote/third-party server, no cloud
endpoint, no telemetry, no analytics, and no update check.

**Security note:** if you use the optional login function, the camera username
and password are sent in cleartext over plain HTTP to that LAN camera (this is a
limitation of the camera's own CGI API). Those credentials are still only sent
to the camera on your network, never anywhere else.

## What's stored on your device

**Nothing.** Discovered cameras are held in memory and printed to the console.
No files, logs, caches, settings, or registry writes. Credentials are never
saved to disk.

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/FoscamFinder/issues)
