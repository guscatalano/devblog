---
title: Privacy Policy — NexusRDM
---

# Privacy Policy — NexusRDM

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/NexusRDM)_

**Summary: NexusRDM is a local RDP/SSH connection manager. Your connection
details stay on your machine, passwords are kept in Windows Credential Manager,
and there is no telemetry. It connects out only to the machines and services you
configure.**

## What the app works with

NexusRDM stores and launches your remote-connection profiles (RDP, SSH, and
Proxmox/Hyper-V sources). A profile holds things like the display name, host/IP,
port, protocol, username, and tags. It can also scan and ping hosts on your
local network to help you find machines.

## Where your passwords live

Connection **passwords, SSH key passphrases, and API token secrets are stored in
Windows Credential Manager**, which protects them at rest using Windows' own
per-user encryption. They are **never** written to the app's database or its
logs — the database only stores a reference to the credential entry.

When launching an external client, a password is briefly handled in the clear
(a short-lived, user-locked temporary file for PuTTY; the FreeRDP command line
for RDP). This is a property of those third-party clients, and the credential is
still used only to connect to the host you chose. See the
[README](https://github.com/guscatalano/NexusRDM#readme) for details.

## What leaves your device

- **Your remote connections** — RDP/SSH/Proxmox traffic goes to the hosts you
  configure, as you'd expect.
- **On-demand tool downloads** — if the required client isn't present, NexusRDM
  downloads FreeRDP and PuTTYNG binaries from their official GitHub releases.
- **Nothing else.** There is no telemetry, no analytics, and no update
  "phone-home."

## What's stored on your device

Everything lives under `%LocalAppData%\NexusRDM\`:

- **`connections.db`** (SQLite) — your connection profiles, groups, and an audit
  log of connect/disconnect actions. No passwords (see above).
- **`settings.json`** — app preferences.
- **Logs** (`logs\`, 7-day retention) and a **crash log** (`crash.log`) — local
  only, and they do not contain your passwords.
- **Screenshots** you capture and **cached downloaded clients** (FreeRDP).
- Temporary files during a session (e.g. a FreeRDP `.rdp` file that contains
  host/username but not the password), deleted when the session ends.

## Microsoft Store capabilities

The Store package declares `internetClient` and `privateNetworkClientServer`
(for your remote and LAN connections), `runFullTrust`, and `allowElevation`
(used by the optional Hyper-V helper). No microphone, camera, location, or
contacts access is requested.

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/NexusRDM/issues)
