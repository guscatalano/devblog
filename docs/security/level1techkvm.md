---
title: Security — Level1Techs KVM Control
---

# Security — Level1Techs KVM Control

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/level1techkvm) · [Source](https://github.com/guscatalano/Level1TechKVMControl)_

**Summary: The command-line tools are local-only. The optional web server is a
LAN convenience with no authentication — run it only on a network you trust.**

## Attack surface

- The command-line scripts talk only to the KVM over a local **serial (COM)
  port**. No network surface.
- The optional web server (`kvm-server.ps1`) listens on your machine's **LAN
  network interfaces** (default port 8080), so other devices on your local
  network can reach it — not just the local machine.
- The web server has **no authentication.** Anyone who can reach the port can
  switch the KVM and, via the `raw` command, send arbitrary serial commands to
  the device (including restart / factory-reset commands the KVM understands).
- **No internet egress**, no telemetry, and nothing is stored on disk.

## Running it safely

- **Trusted networks only.** Run the web server on a home/office LAN you control,
  and **never forward the port to the internet.**
- The script deliberately binds to specific LAN IPs (not a wildcard) so it
  doesn't need an admin URL ACL; you can further restrict access with host
  firewall rules limiting which source IPs may reach port 8080.
- If you only need local control, use the CLI (`kvm.ps1`) instead of the web
  server.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
