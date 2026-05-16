---
title: FindNeedle
tool: true
status: alpha
repo: guscatalano/findneedle
problem: A Windows log search utility for chewing through giant log dumps fast — multi-file, multi-format, with a JSON RuleDSL for declarative filtering, enrichment, and output pipelines.
install: |
  # From the Microsoft Store:
  # https://apps.microsoft.com/detail/9NWLTBV4NRDL
  #
  # Or build from source:
  git clone https://github.com/guscatalano/findneedle.git
  cd findneedle
  dotnet build
installLang: powershell
relatedPosts: []
---

<ToolPage>

## Status

**Experimental / alpha.** The plugin-based configuration system is being replaced by a new **RuleDSL** (JSON-based, declarative). Both still exist in the current build; expect breaking changes as RuleDSL stabilizes.

## What it does

- **Multi-file log search** across `.evtx`, `.etl`, and plain text logs.
- **RuleDSL** — a JSON config that defines an `inputs → filters → enrichments → outputs` pipeline. Rules are portable and version-controllable; no rebuild needed to change behavior.
- **Microsoft Store distribution** — install with one click, auto-updates.
- Designed for the case where you're handed a folder of customer logs and need to find one needle across all of it.

## Quick RuleDSL example

```json
{
  "schemaVersion": "2.0",
  "title": "Error Detection",
  "inputs": [
    {
      "type": "folder",
      "path": "C:\\Logs",
      "depth": "Intermediate"
    }
  ]
}
```

Full schema and examples are in the [repo README](https://github.com/guscatalano/findneedle).

## Where it's headed

The big upcoming work is honest `.etl` support — current handling is limited, and proper rendering for kernel/provider traces probably means leaning on TraceProcessing. That work is parked here rather than in [Simple Event Viewer](/gtools/simpleeventviewer) because FindNeedle is the better home for huge multi-file traces.

</ToolPage>
