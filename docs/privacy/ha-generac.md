---
title: Privacy Policy — Home Assistant Generac/Honeywell Integration
---

# Privacy Policy — Home Assistant Generac/Honeywell Integration

_Last updated: July 12, 2026 · [All privacy policies](/privacy/) · [Source](https://github.com/guscatalano/ha-generac)_

**Summary: This is a Home Assistant custom integration you install yourself. It
connects Home Assistant to Generac's own MobileLink cloud on your behalf using
credentials you supply. It has no telemetry and sends nothing to me.**

## What it does

The integration lets Home Assistant read the status of your Generac or Honeywell
generator by polling **Generac's MobileLink cloud API**
(`app.mobilelinkgen.com`) roughly every couple of minutes, plus fetching device
images from Generac's image host.

## Credentials you supply, and where they're stored

You provide a **MobileLink session cookie** (obtained by logging into MobileLink
in your browser). The integration stores it in your Home Assistant **config
entry**, which Home Assistant persists to its configuration storage on your
machine. As with all Home Assistant config-entry data, it is stored unencrypted
on disk — protect your Home Assistant instance accordingly.

## What is sent and received

- **Sent:** your session cookie (to authenticate to MobileLink) and standard
  request headers. No generator commands or telemetry are uploaded — it's
  read-only polling.
- **Received:** your generator's details, which can include sensitive
  information such as the **installation street address**, **serial number**,
  device Wi-Fi SSID, and status/GPS-adjacent data. This data is surfaced as Home
  Assistant entities and stays within your Home Assistant instance.

## Where data goes

Only between your Home Assistant instance and Generac's cloud. There is **no
telemetry or analytics**, and nothing is sent to me or any third party other
than Generac.

**Note on debug logging:** if you enable debug logging for this integration, the
full API response (including the address and serial number above) may be written
to your Home Assistant log. Enable debug logging only when troubleshooting, and
be careful when sharing logs.

## Contact

[gus@guscatalano.com](mailto:gus@guscatalano.com) · [Report an issue](https://github.com/guscatalano/ha-generac/issues)
