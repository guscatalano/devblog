---
title: ProcMonClone
tool: true
status: experimental
repo: guscatalano/ProcMonClone
problem: A Process Monitor–style activity monitor built on kernel ETW (and the Procmon minifilter) — a learning project that captures live process, file, registry, and network events across the machine.
install: |
  # Build from source (requires the .NET SDK). Run elevated — kernel ETW
  # and the minifilter need Administrator rights.
  git clone https://github.com/guscatalano/ProcMonClone
  cd ProcMonClone
  dotnet run
installLang: powershell
relatedPosts: []
---

<ToolPage>

## What it does

- **Live system-wide capture** via kernel ETW — process/thread, image load, file,
  registry, and network events, including process command lines.
- **Procmon minifilter mode** — can drive the real Process Monitor minifilter to
  receive and reply to filter messages.
- Console and WinForms front-ends.

**Requires Administrator** (kernel ETW + minifilter). This is a
learning / reverse-engineering project; captured data is shown live and not
written to disk. See the [security notes](/security/procmonclone).

</ToolPage>
