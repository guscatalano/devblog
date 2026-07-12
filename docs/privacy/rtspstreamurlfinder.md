---
title: Privacy Policy — RTSP Stream URL Finder
---

# Privacy Policy — RTSP Stream URL Finder

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/RTSPStreamUrlFinder)_

**Summary: A local console tool that talks only to the one camera you point it
at. No internet, no telemetry, nothing stored.**

## What the app works with

RTSP Stream URL Finder is a console utility that helps you discover which RTSP
stream paths a camera exposes. You supply the camera's IP address and its
credentials, and the tool tries a list of candidate RTSP URLs against that one
device.

## What leaves your device

**Only connections to the camera IP you specify.** The tool opens RTSP
connections to the single camera address you configure and nothing else. There
is no remote/third-party server, no telemetry, no analytics, and no update
check. The camera credentials you enter are transmitted only to that camera as
part of the RTSP connection — never anywhere else.

## What's stored on your device

**Nothing.** Results (valid URLs) are printed to the console. No files, logs,
caches, settings, or registry writes. Received video frames are discarded, not
saved. Your credentials are not written to disk (note that if you hard-code them
in the source file, they live in that file as you'd expect).

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/RTSPStreamUrlFinder/issues)
