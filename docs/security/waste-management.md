---
title: Security — Home Assistant Waste Management Integration
---

# Security — Home Assistant Waste Management Integration

_Last updated: July 12, 2026 · [All security pages](/security/) · [Privacy](/privacy/waste-management) · [Source](https://github.com/guscatalano/homeassistant-waste_management)_

**Summary: A Home Assistant custom integration that logs into Waste Management's
cloud with your account credentials. Those credentials are stored by Home
Assistant in its config storage.**

## Attack surface

- **Outbound only:** HTTPS to Waste Management's cloud and its Okta sign-in
  service (via the separate `waste-management` Python package this integration
  depends on), polling roughly every six hours. No inbound listener is added.

## Secrets & data at rest

- You provide your **wm.com username and password**. They are stored in your Home
  Assistant **config entry**, which Home Assistant persists to
  `.storage/core.config_entries` **unencrypted** on the host — so their security
  depends on the security of your Home Assistant instance. The credentials are
  sent only to Waste Management / Okta to authenticate.
- The integration reads your account list, service list, and upcoming pickup
  dates. It does not handle or transmit your street address.

## Running it safely

- **Protect your Home Assistant host and its `.storage` directory** — that's
  where your wm.com credentials live.
- Use a unique password for your wm.com account so a leak can't be reused
  elsewhere.

## Reporting

Found an issue? See [how to report a vulnerability](/security/#reporting-a-vulnerability)
or email [gus@guscatalano.com](mailto:gus@guscatalano.com).
