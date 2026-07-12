---
title: Security — Home Assistant Generac/Honeywell Integration
---

# Security — Home Assistant Generac/Honeywell Integration

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/ha-generac) · [Source](https://github.com/guscatalano/ha-generac)_

**Summary: A Home Assistant custom integration that talks to Generac's MobileLink
cloud using a session cookie you supply. The cookie is stored by Home Assistant
in its config storage, and debug logging can expose sensitive data.**

## Attack surface

- **Outbound only:** HTTPS to Generac's MobileLink API (`app.mobilelinkgen.com`)
  roughly every two minutes, plus fetching device images from Generac's image
  host. No inbound listener is added by the integration.
- It does not send generator commands or telemetry — it's read-only polling.
- Note: the integration's HTTP cookie jar is created in a permissive mode that
  will send cookies to hosts that don't strictly match — a minor consideration
  given it only targets Generac's endpoints.

## Secrets & data at rest

- You provide a **MobileLink session cookie**. It is stored in your Home
  Assistant **config entry**, which Home Assistant persists to
  `.storage/core.config_entries` **unencrypted** on the host — so the security of
  that cookie depends on the security of your Home Assistant instance.
- The data it retrieves can include your generator's **installation street
  address, serial number, and Wi-Fi SSID**, which become Home Assistant entities.
- **Debug logging caveat:** if you enable debug logging for this integration, the
  full API response (including the address and serial number) may be written to
  your Home Assistant log.

## Running it safely

- **Protect your Home Assistant host and its `.storage` directory** — that's
  where the session cookie lives.
- Enable debug logging only while troubleshooting, and scrub logs before sharing.
- If your cookie is exposed, invalidate it by logging out / back into MobileLink
  and re-entering a fresh one.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
