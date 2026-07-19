---
title: Level1Techs KVM Control
tool: true
status: stable
repo: guscatalano/Level1TechKVMControl
problem: Control your Level1Techs HDMI 2.1 KVM from a CLI or a phone-friendly web page, instead of reaching for the front-panel buttons.
install: |
  git clone https://github.com/guscatalano/Level1TechKVMControl
  cd Level1TechKVMControl
  ./kvm.ps1 -PC 2
installLang: powershell
screenshot: /screenshots/kvmweb.png
relatedPosts:
  - link: /posts/level1-kvm-control
    text: "Controlling a Level1Techs KVM easily and remotely"
---

<ToolPage>

## Notes

Requires a Cisco CAT6 RJ-45 → RJ-11 adapter plus an RJ-45 (or RJ-11) → USB RS-232 cable. Defaults to `COM5`; pass `-Port COMx` if yours differs.

See the [companion blog post](/posts/level1-kvm-control) for the full setup story, including how the probe script reverse-engineered the serial protocol.

</ToolPage>
