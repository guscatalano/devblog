---
title: Privacy Policy — Level1Techs KVM Control
---

# Privacy Policy — Level1Techs KVM Control

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/Level1TechKVMControl)_

**Summary: This is a local tool that controls a KVM switch over a serial cable.
It does not connect to the internet, contains no telemetry, and stores nothing.**

## What the app works with

Level1Techs KVM Control is a set of PowerShell scripts. The command-line tools
talk only to the KVM over a local serial (COM) port. An optional web-server
script (`kvm-server.ps1`) serves a small phone-friendly control page on your
local network so you can switch inputs from a browser.

## What leaves your device

**Nothing leaves your machine, and nothing is sent to the internet.** The tool
makes no outbound network calls and has no telemetry, analytics, or update
check. Command activity is written to the console only; nothing is saved to
disk, and there are no credentials to store.

## Access and security

The optional web server listens on your machine's LAN interfaces (default port
8080) and has **no authentication**, so any device on your local network can use
it to switch the KVM. It stores no data and sends nothing to the internet, but
**you should run it only on a network you trust** and never forward the port to
the internet. See the [Security note in the
README](https://github.com/guscatalano/Level1TechKVMControl#security-note) for
details.

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/Level1TechKVMControl/issues)
