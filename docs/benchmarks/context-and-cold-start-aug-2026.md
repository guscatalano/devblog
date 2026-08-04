---
title: What a cold cache and a 256k context actually cost
benchmark: true
date: 2026-08-03
benchId: b_a29bf50fb1c1
report: /bench-reports/b_a29bf50fb1c1.html
summary: Nineteen configurations on a GB10 measured warm and cold, plus one model held at 32k, 128k and 256k context — two knobs that turn out to cost far less than expected.
---

# What a cold cache and a 256k context actually cost

Two questions this run was meant to settle, both about knobs I'd been treating
as expensive without ever measuring them:

1. How much does a **cold prefix cache** really cost on the first request?
2. What does allocating a **large context window** cost when the prompt doesn't
   use it?

Every configuration ran twice, cached and cold, on the `coding-v1` suite at
short context with thinking off and `t=0.0`, one request at a time.
DeepSeek-V4-Flash additionally ran at three context sizes — 32k, 128k and 256k —
with everything else held constant.

## Long context is close to free when you don't use it

This is the clearest result in the table. The same model at 32k, 128k and 256k:

| Context | TTFT (cached) | Decode | Fully correct |
|---|---|---|---|
| 32k | 140 ms | 17.8 tok/s | 94% |
| 128k | 141 ms | 17.7 tok/s | 94% |
| 256k | 143 ms | 17.8 tok/s | 94% |

Three milliseconds and a rounding error across an 8× increase in allocated
context. On this hardware, with a short prompt, sizing the window generously
costs essentially nothing at inference time — the cost is VRAM reservation, not
latency. That's the opposite of the folk wisdom I'd been operating on.

The caveat that matters: this measures a **short prompt in a large window**, not
a large prompt. It says allocation is cheap. It says nothing about what happens
when you actually fill 256k, which is a different run.

## A cold cache is cheaper than it feels

The worst cold penalty in the table is DeepSeek at 32k, going from 140 ms to
336 ms — **2.4× in relative terms, but only +196 ms in absolute ones**. Most
models land between 1.0× and 1.3×; `qwen3-coder-next`, `minicpm-v4.5`,
`llama4:latest` and `gemma4:26b` all come in within 2% of their warm number.

Both framings are true and they point in opposite directions, which is exactly
why the ratio alone misleads. The models that look worst by ratio are the ones
that were fastest to begin with — a fast model paying 200 ms still beats a slow
model's warm path. Sort by TTFT and the cold column barely reorders anything.

Worth being clear about what "cold" means here: no warm prefix cache. The model
is already resident. This is not a model-load benchmark, and it doesn't tell you
what the first request after a swap costs.

## Correctness doesn't move

Across all 19 configurations the mean change in "fully correct" between cached
and cold is **0.6 points**, with a 5.6-point worst case that's consistent with
run-to-run noise at 36 runs per cell. Caching is a pure latency knob here, not a
quality one — which is what you'd hope, and worth confirming rather than
assuming.

<BenchTable bench-id="b_a29bf50fb1c1" />

`ornith-nvfp4` reports no TTFT in this run — the vLLM path didn't record one, so
that cell shows a gap rather than a zero.

Note this suite is `coding-v1`, while the [concurrency
run](/benchmarks/local-models-gb10-aug-2026) used `coding-v2`. The correctness
percentages are **not comparable between the two pages** — same models, different
questions.

[Full report →](/bench-reports/b_a29bf50fb1c1.html) — the standalone version,
with per-case detail. Prints to PDF.
