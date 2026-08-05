---
title: 43,000 requests, 2.1 billion tokens, 37 cents
benchmark: true
date: 2026-08-05
report: /usage-reports/usage-2026-08-05.html
summary: Eighteen days of everything my local models actually did — 42,987 requests and 2.1B tokens — and what the electricity to produce them came to.
---

# 43,000 requests, 2.1 billion tokens, 37 cents

The other pages here are deliberate benchmarks: fixed suites, controlled knobs,
one variable at a time. This one is the opposite — it's the log of whatever
actually happened. Every request that went through
[AI Proxy](/gtools/ai-proxy) between **2026-07-17 and 2026-08-05**, which is 18 days and
12 hours of real use: agents, editor completions, and my own benchmark runs all
mixed together.

| | |
|---|---|
| Requests | 42,987 |
| Tokens read | 2.1B |
| Tokens written | 9.7M |
| GPU hours | 143 |
| Hardware | NVIDIA GB10 |

## The ratio nobody talks about

**219 tokens read for every one written.** That single number reframes what a
local inference box is actually doing: it is overwhelmingly a *reading* machine.
Generation — the thing every tok/s benchmark measures, including
[mine](/benchmarks/local-models-gb10-aug-2026) — is under half a percent of the
token volume.

98% of those reads are prefix-cache hits, and the effect shows up in the time
split: with prompts 219× larger than replies, prefill *should* dominate
completely. It's **16%**. The rest is decode. That inversion is the prompt cache
earning its keep, and it's also a canary — a sudden jump in the prefill share is
how a caching regression would announce itself before anything else went
visibly wrong.

## What it cost

Here's the part that prompted the write-up:

| | |
|---|---|
| Electricity, 143 GPU hours | **$0.37** |
| Same tokens, hosted open-weights (30B class) | $83 |
| Same tokens, Claude Sonnet 4.5 pricing | $920 |

I want to be honest about what that comparison is and isn't. It's a **token-for-token
price substitution** — the same volume, run through someone else's rate card. It
is *not* a claim that the output was equivalent. A local 30B at IQ2 quantization
answering a coding question is not interchangeable with Sonnet answering it, and
my own grading bears that out: the best local model on
[coding-v3](/benchmarks/full-matrix-coding-v3-aug-2026) clears 87% of cases
fully correct, which is a long way from "no difference."

What the number does honestly say: the marginal cost of a token on hardware you
already own is close to nothing, and cache-heavy agent workloads inflate token
counts enormously — 2.1B of the 2.1B is mostly the same context re-read across
turns. Anything billed per-token gets very expensive at that ratio, which is
precisely the workload shape where running locally pays off. The capital cost of
the box isn't in that $0.37, either.

## Where the traffic came from

| Client | Requests |
|---|---|
| hermes | 21,863 |
| ai-proxy-bench | 17,644 |
| vscode-copilot | 1,507 |
| requests | 1,072 |

Worth noting for anyone reading the other pages: **41% of this traffic is my own
benchmarking.** The `ai-proxy-bench` client is the harness that produced the
runs on this section of the site. This is a report about a machine that spends a
lot of its time measuring itself.

By upstream, vLLM took 19,394 requests, Ollama 15,331, LM Studio 5,837, and
llama.cpp 2,425. LM Studio's 108-second mean latency stands out badly against
vLLM's 10 seconds — though means over whole requests flatter nothing, and a few
very long sessions drag that upward.

## Errors

41,904 of 42,987 requests returned 200. The tail: 588 × 404, 213 with no
response (aborted or still in flight), 176 × 400, 100 × 499, and 6 × 500. A
2.5% non-200 rate for a box being actively developed against seems about right
(2.0% if you don't count the aborted and in-flight ones as failures). The 404s
are almost certainly me pointing a client at a model that wasn't loaded.

::: info A snapshot, not a measurement
This covers everything the proxy had recorded as of 2026-08-05 and will read
differently next month. The benchmark pages in this section are reproducible;
this one is a log of whatever happened to run.
:::

[Full report →](/usage-reports/usage-2026-08-05.html) — the standalone version,
with day-by-day tables, decode rate bucketed by prompt depth, conversation-depth
costs, and the tool-call breakdown. Prints to PDF.
