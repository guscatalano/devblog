---
title: LLM Benchmarks
---

# LLM Benchmarks

Measurements of local models running on my own hardware — throughput, latency,
and whether the answer was actually correct. Every number here came off a rig I
control, with the methodology written down, so you can decide how much it should
transfer to yours.

Runs are executed and graded by [AI Proxy](https://github.com/guscatalano/AI_Proxy),
which sits in front of llama.cpp, Ollama, and vLLM and records every request.
Reports are exported and committed here rather than served live — the proxy only
listens on my LAN.

Most pages here are **benchmarks**: a fixed suite, one knob moved at a time,
reproducible. The occasional **usage report** is the opposite — a rolling
snapshot of whatever actually ran. Those are labelled as such, and the column
guide below applies to the benchmarks.

## Reports

<BenchmarkList />

## How to read these

- **TTFT** — time to first token. What you feel as "is it awake yet."
- **Decode** — sustained tokens per second after generation starts.
- **Total** — wall-clock for the whole response.
- All timings are **p50** across the suite, not means. One pathological case
  can't drag the number around.
- **Fully correct** — share of cases where every assertion passed.
- **Cases** — share of individual assertions that passed. A model can look good
  here and bad on "fully correct" by getting most of each case right and
  fumbling one detail.

Each report links to a standalone HTML version with per-case detail, which is
the same artifact the proxy generates and is what I actually look at when
something surprising shows up.

## Caveats worth stating plainly

Local benchmarking is easy to get wrong, so: quantization is listed per run and
matters enormously — a heavily quantized large model is not the same model.
Numbers are from one machine, one driver version, one point in time. Runs marked
`cached` had a warm prefix cache, which flatters TTFT relative to a cold start.
And the graded suites test what they test; a model that scores badly on one may
be fine at work you care about that isn't represented.

These are here because they were useful to me, not as a leaderboard.
