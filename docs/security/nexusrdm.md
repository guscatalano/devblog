---
title: Security — NexusRDM
---

# Security — NexusRDM

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/nexusrdm) · [Source](https://github.com/guscatalano/NexusRDM)_

**Summary: A local RDP/SSH connection manager. Passwords live in Windows
Credential Manager and never touch the app's database or logs. The one caveat is
a brief plaintext exposure while launching an external client.**

## Attack surface

- **Outbound only, to the hosts you configure** — RDP/SSH sessions, the Proxmox
  REST API of a cluster you register, and LAN discovery/ping sweeps you initiate.
- On demand, it downloads the **FreeRDP** and **PuTTYNG** client binaries from
  their official GitHub releases if they aren't already present.
- No inbound listener, no telemetry, and no update "phone-home."
- Store package capabilities: `internetClient`, `privateNetworkClientServer`,
  `runFullTrust`, and `allowElevation` (used by the optional Hyper-V helper,
  which requests administrator rights).

## Secrets & data at rest

- **Passwords, SSH key passphrases, and API token secrets are stored in Windows
  Credential Manager**, protected at rest by Windows' per-user encryption. They
  are **never** written to the app's SQLite database or its logs — the database
  only holds a reference to the credential entry.
- **Brief plaintext at launch:** to start an external client, a password is
  momentarily handled in the clear —
  - **SSH (PuTTY):** written to a temporary file that is locked to your user
    account and deleted right after PuTTY starts.
  - **RDP (FreeRDP):** passed on the FreeRDP command line, which can be visible
    to other processes on the machine (e.g. via `tasklist`) for the moment the
    client launches.
- Local logs and a crash log live under `%LocalAppData%\NexusRDM\` and do not
  contain your passwords.

## Running it safely

- On a shared or multi-user machine, be aware of the momentary FreeRDP
  command-line exposure; prefer machines where you're the only user for sensitive
  RDP credentials.
- The downloaded FreeRDP/PuTTY binaries come from official GitHub releases —
  verify them if your threat model calls for it.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
