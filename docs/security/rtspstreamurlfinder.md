---
title: Security — RTSP Stream URL Finder
---

# Security — RTSP Stream URL Finder

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/rtspstreamurlfinder) · [Source](https://github.com/guscatalano/RTSPStreamUrlFinder)_

**Summary: A local console tool that talks only to the one camera you point it
at. No inbound surface, no remote egress, nothing stored.**

## Attack surface

- **Outbound only, to the single camera IP you specify** — it opens RTSP
  connections to that one device and nothing else. No listener, no remote or
  third-party host, no telemetry, no update check.

## Secrets & data

- The camera credentials you supply are transmitted **only to that camera** as
  part of the RTSP connection. They are not persisted (aside from living in the
  source/config file if you hard-code them there). Results are printed to the
  console; received video frames are discarded, not saved.

## Running it safely

- This tool tries many candidate stream paths against a device — effectively
  brute-forcing URLs. **Only run it against cameras you own or are explicitly
  authorized to test**, and prefer changing the camera's default credentials over
  relying on obscure stream paths.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
