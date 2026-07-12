---
title: Privacy Policy — Home Assistant Waste Management Integration
---

# Privacy Policy — Home Assistant Waste Management Integration

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/homeassistant-waste_management)_

**Summary: This is a Home Assistant custom integration you install yourself. It
connects Home Assistant to Waste Management's cloud on your behalf using your
wm.com credentials. It has no telemetry and sends nothing to me.**

## What it does

The integration lets Home Assistant show your next Waste Management pickup times
by logging into **Waste Management's cloud service** (via its Okta sign-in) and
reading your account's pickup schedule. It polls roughly every six hours.

## Credentials you supply, and where they're stored

You provide your **wm.com account username and password**. The integration
stores them in your Home Assistant **config entry**, which Home Assistant
persists to its configuration storage on your machine. As with all Home
Assistant config-entry data, they are stored unencrypted on disk — protect your
Home Assistant instance accordingly.

## What is sent and received

- **Sent:** your wm.com username and password (to authenticate to Waste
  Management / Okta) and your selected account and service identifiers when
  querying pickups.
- **Received:** your account list, service list, and upcoming pickup dates. The
  integration does not read or transmit your street address.

## Where data goes

Only between your Home Assistant instance and Waste Management's cloud service.
There is **no telemetry or analytics**, and nothing is sent to me or any third
party other than Waste Management.

**Note:** the network/authentication logic lives in the separate open-source
`waste-management` Python package that this integration depends on.

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/homeassistant-waste_management/issues)
