---
title: Security
---

# Security

_Last updated: July 12, 2026_

This is the security home for the apps and tools I (Gus Catalano) build. Each app
has its own page describing its **attack surface, how secrets are handled, what
privileges it needs, and how to run it safely.** The shared points come first,
then reporting, then the per-app pages.

## The short version

- **Everything is open source and auditable.** Every claim on these pages can be
  checked against the code on [GitHub](https://github.com/guscatalano).
- **No telemetry, no analytics, no backend I control.** My apps don't send usage
  data anywhere, so there's no server-side of mine to attack.
- **Most tools are local.** They run on your machine and expose nothing to the
  network. Where an app *does* listen or reach out, its page says so plainly.
- **A few apps are meant for a trusted network only.** In particular
  [AI Proxy](/security/ai-proxy), [DonationTracker](/security/donationtracker),
  and [Level1Techs KVM Control](/security/level1techkvm) have **no built-in
  authentication** and should be run on a trusted network or behind your own
  auth. Read their pages before exposing them.

## Reporting a vulnerability

If you find a security issue in any of my apps, I'd genuinely like to know.

- **Email:** [gus@guscatalano.com](mailto:gus@guscatalano.com) — the preferred
  channel for anything sensitive. Please don't file public details for an
  unpatched, exploitable issue; email first.
- **GitHub:** for lower-risk issues you can open a
  [Security Advisory](https://github.com/guscatalano) on the relevant repository,
  or a normal issue.
- **What to include:** the app and version, what you found, and enough detail to
  reproduce it.

These are personal open-source projects maintained by one person, so I can't
promise a formal SLA — but I read reports promptly and will credit you if you'd
like. Good-faith security research is welcome; please avoid privacy violations,
data destruction, or testing against systems and networks that aren't yours.

## Security posture by app

| App | Posture in one line |
| --- | --- |
| [Simple Event Viewer](/security/simpleeventviewer) | Local; no egress. Only surface is an optional loopback MCP server (no auth). |
| [Simple PCap Viewer](/security/simplepcapviewer) | Local; no egress. Optional loopback MCP server (no auth). |
| [FindNeedle](/security/findneedle) | Local; opt-in online sources you configure. Tokens DPAPI-encrypted. |
| [BinaryExplorer](/security/binaryexplorer) | Local; opt-in VirusTotal hash lookup. MCP has no auth; VT key stored in cleartext. |
| [NexusRDM](/security/nexusrdm) | Secrets in Windows Credential Manager; brief plaintext at client launch. |
| [PixelPet](/security/pixelpet) | Local desktop app; API keys encrypted at rest. |
| [AI Proxy](/security/ai-proxy) | ⚠️ Binds to all interfaces, no auth; logs headers (API keys) in cleartext. Harden before exposing. |
| [Level1Techs KVM Control](/security/level1techkvm) | ⚠️ LAN web server, no auth. Trusted network only. |
| [DonationTracker](/security/donationtracker) | ⚠️ Binds to all interfaces, no auth; data unencrypted at rest. Trusted network only. |
| [ProcMonClone](/security/procmonclone) | Local; requires admin. Captures system activity but stores/sends nothing. |
| [RTSP Stream URL Finder](/security/rtspstreamurlfinder) | Local; talks only to the camera you specify. |
| [FoscamFinder](/security/foscamfinder) | LAN discovery PoC; login creds sent cleartext to the LAN camera. |
| [RDP DVC Watcher](/security/rdp-dvc-watcher) | Local; requires admin. Nothing stored or sent. |
| [HA — Generac/Honeywell](/security/ha-generac) | Talks to Generac's cloud with a session cookie you supply. |
| [HA — Waste Management](/security/waste-management) | Talks to Waste Management's cloud with credentials you supply. |

For what data each app handles, see the matching [privacy policy](/privacy/).

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [GitHub](https://github.com/guscatalano)
