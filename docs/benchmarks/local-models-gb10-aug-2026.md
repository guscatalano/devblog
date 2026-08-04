---
title: 40 local models on a GB10
benchmark: true
date: 2026-08-02
benchId: b_23168a3d7a38
report: /bench-reports/b_23168a3d7a38.html
summary: Twenty local models on a 122 GB GB10, each run alone and at 4× concurrency, graded on the coding-v2 suite across llama.cpp, Ollama, and vLLM.
---

# 40 local models on a GB10

Twenty models, each measured twice — once with the box to itself, once at four
concurrent requests — on a single NVIDIA GB10 with 122 GB of memory. Every run
used the `coding-v2` suite at short context, with thinking off, a warm prefix
cache, and `t=0.0`, so the comparison is between the models and the servers
rather than between sampling settings. That's 29 tasks × 87 runs per cell.

The reason for running it this way: single-stream tok/s is the number everyone
quotes, and it's the number that falls apart first when anything else is using
the GPU. So every measure below is shown as **alone → under 4× load**, and the
gap between those two is the part worth reading.

A few things worth pulling out of the table:

- **Decode speed and correctness are close to independent.** `qwen3:0.6b`
  decodes at 301 tok/s and gets 5% of cases fully correct. `devstral-2:123b`
  manages 2.7 tok/s at 76%. Fast is easy; fast *and* right is the hard part.
- **The concurrency penalty is wildly uneven.** `qwen3-coder:30b` halves its
  decode rate under 4× load (84.5 → 41.0 tok/s) and `gemma4:26b` loses nearly as
  much (63.5 → 36.1), while `qwen3.6:35b-a3b` (75.0 → 75.0) and
  `qwen3-coder:tuned` (50.7 → 50.8) hold their rate essentially unchanged.
- **Time-to-first-token degrades much harder than decode.** `qwen3.6:27b` goes
  from 491 ms to 24.2 seconds under concurrency while its decode rate doesn't
  move at all — the queue, not the arithmetic, is what you feel.
- **vLLM posts the fastest cold start.** `ornith-nvfp4` has the lowest TTFT in
  the table at 120 ms, and both vLLM entries stay near the front under load. It
  isn't the most *resilient*, though — measured as a ratio, `qwen3:0.6b` (1.6×)
  and `gemma4:latest` (1.6×) give up less than either vLLM run (2.7× and 2.4×).
  vLLM simply starts from far enough ahead that it's still fast afterward.
- **Grading catches things throughput never would.** `gpt-oss:120b` decodes at a
  respectable 37.9 tok/s and still only clears 43% fully correct, below several
  models a third its size.

Timings are p50. **Fully correct** is the share of the 87 runs where every
assertion passed — the filled bar is with the box to itself, the light tick is
the same model under 4× load. **Decode** is a dumbbell between those two states
on a shared scale. Sort by any column; hovering a row gives the exact numbers
plus the split between the suite's `core` and `hard` tiers.

<BenchTable bench-id="b_23168a3d7a38" />

[Full report →](/bench-reports/b_23168a3d7a38.html) — the standalone version, with per-case
detail. Prints to PDF.
