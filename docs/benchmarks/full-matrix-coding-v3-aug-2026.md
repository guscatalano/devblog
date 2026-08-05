---
title: Concurrency costs latency, not accuracy — with one exception
benchmark: true
date: 2026-08-05
benchId: b_6b2dbfd0a67d
report: /bench-reports/b_6b2dbfd0a67d.html
summary: A full cache × concurrency matrix on coding-v3 — 96 runs across 48 configurations. The two knobs turn out to be independent, and one model quietly loses accuracy under load.
---

# Concurrency costs latency, not accuracy — with one exception

The two previous runs each moved one knob: [concurrency
alone](/benchmarks/local-models-gb10-aug-2026), then [cache
state](/benchmarks/context-and-cold-start-aug-2026). This one moves both at
once — cold and cached, single and 4× concurrent — so the question is whether
they interact. 96 runs over 48 configurations on `coding-v3`, 47 tasks and 94
runs per cell, thinking off, `t=0.0`.

The table below is grouped by concurrency (**alone → 4× concurrent**), with cold
and cached shown as separate rows via the badge next to each model name.

## The knobs don't interact

Averaged across all 24 model configurations, decode rate retained under 4× load
is **80% when cached and 81% when cold** — a one-point difference, which is
noise. Whatever a cold cache costs you, it costs you the same whether the box is
busy or idle, and vice versa.

That's the boring answer, and it's the useful one: these two can be reasoned
about separately. You don't need a 2×2 matrix to predict a configuration you
haven't measured — the penalties compose.

## Accuracy mostly ignores load — except for one model

Across the 24 cached configurations, the mean change in "fully correct" going
from alone to 4× concurrent is **+0.9 points** (median +1.1). Correctness under
concurrency is, for almost everything here, a non-issue — the load costs you
latency, not answers.

The exception is stark:

| Model | Alone | 4× concurrent | Change |
|---|---|---|---|
| `gpt-oss:120b` | 82% | 74% | **−7.4 pts** |
| `gemma3:27b` | 78% | 77% | −1.1 pts |
| everything else | — | — | ≥ 0 |

`gpt-oss:120b` is the only model in the run that measurably gets *worse at the
task* when the GPU is contended. I don't have an explanation from this data
alone — it could be batching-related nondeterminism, or a timeout/truncation
path that trips under load and gets graded as a miss. It's worth isolating
before trusting that model in a multi-user setup, and it's precisely the kind of
thing a throughput-only benchmark would never surface.

## Time-to-first-token is where the pain actually lands

The latency spread under concurrency is enormous and, again, unrelated to
accuracy:

- `qwen3.6:27b` — 619 ms → **21.0 s** (33.9×)
- `qwen3-coder-next:latest` — 390 ms → 4.9 s (12.7×)
- `qwen3.6:35b-a3b` — 410 ms → 4.8 s (11.8×)
- `qwen3-coder:tuned` — 367 ms → 4.1 s (11.1×)

A 34× TTFT blowup with unchanged accuracy is the signature of queueing, not
computation. If you're sizing for concurrent users, this column is the one that
decides whether the thing feels usable.

## The long-context result holds on a second suite

DeepSeek-V4-Flash again ran at 32k, 128k and 256k, and again the window size
costs nothing measurable — 87% correct alone and 89% at 4× at all three sizes,
with decode and TTFT within noise of each other:

| Context | Correct (alone → 4×) | Decode | TTFT (alone → 4×) |
|---|---|---|---|
| 32k | 87% → 89% | 17.6 → 12.3 tok/s | 341 → 1426 ms |
| 128k | 87% → 89% | 17.5 → 13.2 tok/s | 338 → 1433 ms |
| 256k | 87% → 89% | 17.6 → 13.2 tok/s | 356 → 1489 ms |

That reproduces the [previous run's
finding](/benchmarks/context-and-cold-start-aug-2026) on a different suite,
which is the only reason I'd now believe it.

<BenchTable bench-id="b_6b2dbfd0a67d" />

The top of the table is tight: DeepSeek at 87%, `gemma4:26b` at 87%,
`qwen3-coder-next` at 84%. Note that these are `coding-v3` scores and the other
two pages use `coding-v1` and `coding-v2` — **the percentages are not comparable
across pages**, only within this one.

[Full report →](/bench-reports/b_6b2dbfd0a67d.html) — the standalone version,
with per-case detail. Prints to PDF.
