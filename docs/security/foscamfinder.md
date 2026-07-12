---
title: Security — FoscamFinder
---

# Security — FoscamFinder

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/foscamfinder) · [Source](https://github.com/guscatalano/FoscamFinder)_

**Summary: A proof-of-concept LAN discovery tool. All traffic stays on your local
network, nothing is stored, and the optional login sends credentials in cleartext
to the LAN camera.**

## Attack surface

- **Local network only:** it sends a UDP broadcast to discover Foscam cameras and
  listens on UDP port 10000 for their replies, then makes HTTP CGI requests to
  discovered cameras. No remote/third-party host, no cloud endpoint, no telemetry,
  no update check.

## Secrets & data

- If you use the optional login function, the camera username and password are
  sent **in cleartext over plain HTTP** to the LAN camera (a limitation of the
  camera's own CGI API). They still only go to the camera on your network, and
  are never stored.
- Discovered camera details are held in memory and printed to the console;
  nothing is persisted.

## Running it safely

- **Only scan networks you're authorized to.** This is a broadcast discovery
  tool.
- Because credentials go cleartext over HTTP, only use the login feature on a
  trusted LAN, and change camera default passwords.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
