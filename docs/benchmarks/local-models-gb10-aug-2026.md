---
title: 40 local models on a GB10
benchmark: true
date: 2026-08-02
benchId: b_23168a3d7a38
report: /bench-reports/b_23168a3d7a38.html
summary: Twenty local models on a 122 GB GB10, each run alone and at 4× concurrency, scored on the short graded suite across llama.cpp, Ollama, and vLLM.
---

# 40 local models on a GB10

Twenty models, each measured twice — once with the box to itself, once at four
concurrent requests — on a single NVIDIA GB10 with 122 GB of memory. Every run
used the `short` graded suite with thinking off, a warm cache, and `t=0.0`, so
the comparison is between the models and the servers rather than between
sampling settings.

The reason for running it this way: single-stream tok/s is the number everyone
quotes, and it's the number that falls apart first when anything else is using
the GPU. The interesting column is what happens between the two rows for the
same model.

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

Numbers are p50 over the suite. "Fully correct" is the share of cases that
passed every assertion; "Cases" is the share of individual assertions that
passed — a model can score well on the second and poorly on the first by
getting most of each case right and fumbling one detail.

<!-- bench:table:start -->

| Run | Model | Think | Prompt | Server ctx | TTFT p50 | Decode p50 | Total p50 | Fully correct | Cases |
|---|---|---|---|---|---|---|---|---|---|
| DeepSeek-V4-Flash-0731-UD-IQ2_XXS · @llamacpp · short · think=off · cached · t=0.0 | DeepSeek-V4-Flash-0731-UD-IQ2_XXS | off | 0 | — | 143 ms | 17.7 tok/s | 8906 ms | 86% | 85% |
| DeepSeek-V4-Flash-0731-UD-IQ2_XXS · @llamacpp · short · think=off · cached · 4×parallel · t=0.0 | DeepSeek-V4-Flash-0731-UD-IQ2_XXS | off | 0 | 32768 | 1233 ms | 12.4 tok/s | 12541 ms | 79% | 80% |
| codellama:70b · @ollama · short · think=off · cached · t=0.0 | codellama:70b | off | 0 | — | 279 ms | 5.7 tok/s | 45484 ms | 26% | 42% |
| codellama:70b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | codellama:70b | off | 0 | — | 960 ms | 5.5 tok/s | 47884 ms | 23% | 41% |
| devstral-2:123b · @ollama · short · think=off · cached · t=0.0 | devstral-2:123b | off | 0 | — | 661 ms | 2.7 tok/s | 57047 ms | 76% | 85% |
| devstral-2:123b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | devstral-2:123b | off | 0 | — | 2655 ms | 2.4 tok/s | 64218 ms | 75% | 85% |
| devstral-small-2:24b · @ollama · short · think=off · cached · t=0.0 | devstral-small-2:24b | off | 0 | — | 349 ms | 13.8 tok/s | 10677 ms | 68% | 83% |
| devstral-small-2:24b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | devstral-small-2:24b | off | 0 | — | 830 ms | 12.6 tok/s | 12413 ms | 71% | 85% |
| gemma3:27b · @ollama · short · think=off · cached · t=0.0 | gemma3:27b | off | 0 | — | 643 ms | 11.5 tok/s | 18462 ms | 76% | 76% |
| gemma3:27b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | gemma3:27b | off | 0 | — | 1101 ms | 10.4 tok/s | 23780 ms | 72% | 76% |
| gemma4:26b · @ollama · short · think=off · cached · t=0.0 | gemma4:26b | off | 0 | — | 496 ms | 63.5 tok/s | 3920 ms | 83% | 88% |
| gemma4:26b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | gemma4:26b | off | 0 | — | 843 ms | 36.1 tok/s | 7085 ms | 85% | 90% |
| gemma4:latest · @ollama · short · think=off · cached · t=0.0 | gemma4:latest | off | 0 | — | 471 ms | 56.1 tok/s | 8217 ms | 54% | 54% |
| gemma4:latest · @ollama · short · think=off · cached · 4×parallel · t=0.0 | gemma4:latest | off | 0 | — | 753 ms | 42.6 tok/s | 11462 ms | 48% | 48% |
| gpt-oss:120b · @ollama · short · think=off · cached · t=0.0 | gpt-oss:120b | off | 0 | — | 508 ms | 37.9 tok/s | 13924 ms | 43% | 37% |
| gpt-oss:120b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | gpt-oss:120b | off | 0 | — | 1279 ms | 20.6 tok/s | 23443 ms | 43% | 38% |
| llama3:70b-instruct · @ollama · short · think=off · cached · t=0.0 | llama3:70b-instruct | off | 0 | — | 433 ms | 5.5 tok/s | 21611 ms | 52% | 72% |
| llama3:70b-instruct · @ollama · short · think=off · cached · 4×parallel · t=0.0 | llama3:70b-instruct | off | 0 | — | 1124 ms | 5.3 tok/s | 22715 ms | 51% | 72% |
| llama4:latest · @ollama · short · think=off · cached · t=0.0 | llama4:latest | off | 0 | — | 541 ms | 18.0 tok/s | 8701 ms | 62% | 75% |
| llama4:latest · @ollama · short · think=off · cached · 4×parallel · t=0.0 | llama4:latest | off | 0 | — | 3133 ms | 11.0 tok/s | 14611 ms | 62% | 76% |
| minicpm-v4.5:latest · @ollama · short · think=off · cached · t=0.0 | minicpm-v4.5:latest | off | 0 | — | 240 ms | 40.5 tok/s | 3362 ms | 22% | 51% |
| minicpm-v4.5:latest · @ollama · short · think=off · cached · 4×parallel · t=0.0 | minicpm-v4.5:latest | off | 0 | — | 412 ms | 35.1 tok/s | 4017 ms | 20% | 48% |
| qwen3-coder-next:latest · @ollama · short · think=off · cached · t=0.0 | qwen3-coder-next:latest | off | 0 | — | 290 ms | 51.2 tok/s | 3801 ms | 76% | 81% |
| qwen3-coder-next:latest · @ollama · short · think=off · cached · 4×parallel · t=0.0 | qwen3-coder-next:latest | off | 0 | — | 5599 ms | 51.3 tok/s | 8839 ms | 76% | 81% |
| qwen3-coder:30b · @ollama · short · think=off · cached · t=0.0 | qwen3-coder:30b | off | 0 | — | 224 ms | 84.5 tok/s | 1994 ms | 71% | 84% |
| qwen3-coder:30b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | qwen3-coder:30b | off | 0 | — | 440 ms | 41.0 tok/s | 4290 ms | 75% | 87% |
| qwen3-coder:tuned · @ollama · short · think=off · cached · t=0.0 | qwen3-coder:tuned | off | 0 | — | 267 ms | 50.7 tok/s | 3671 ms | 76% | 82% |
| qwen3-coder:tuned · @ollama · short · think=off · cached · 4×parallel · t=0.0 | qwen3-coder:tuned | off | 0 | — | 5716 ms | 50.8 tok/s | 8603 ms | 76% | 82% |
| qwen3.6:27b · @ollama · short · think=off · cached · t=0.0 | qwen3.6:27b | off | 0 | — | 491 ms | 12.2 tok/s | 16566 ms | 72% | 76% |
| qwen3.6:27b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | qwen3.6:27b | off | 0 | — | 24219 ms | 12.2 tok/s | 39924 ms | 72% | 76% |
| qwen3.6:35b-a3b · @ollama · short · think=off · cached · t=0.0 | qwen3.6:35b-a3b | off | 0 | — | 385 ms | 75.0 tok/s | 4117 ms | 76% | 82% |
| qwen3.6:35b-a3b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | qwen3.6:35b-a3b | off | 0 | — | 4781 ms | 75.0 tok/s | 7460 ms | 76% | 82% |
| qwen3:0.6b · @ollama · short · think=off · cached · t=0.0 | qwen3:0.6b | off | 0 | — | 203 ms | 301.1 tok/s | 502 ms | 5% | 38% |
| qwen3:0.6b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | qwen3:0.6b | off | 0 | — | 323 ms | 190.5 tok/s | 732 ms | 5% | 38% |
| qwen3:4b · @ollama · short · think=off · cached · t=0.0 | qwen3:4b | off | 0 | — | 229 ms | 73.1 tok/s | 7220 ms | 7% | 8% |
| qwen3:4b · @ollama · short · think=off · cached · 4×parallel · t=0.0 | qwen3:4b | off | 0 | — | 446 ms | 61.8 tok/s | 8767 ms | 5% | 8% |
| ornith-nvfp4 · @vllm · short · think=off · cached · t=0.0 | ornith-nvfp4 | off | 0 | — | 120 ms | 65.4 tok/s | 3184 ms | 76% | 83% |
| ornith-nvfp4 · @vllm · short · think=off · cached · 4×parallel · t=0.0 | ornith-nvfp4 | off | 0 | — | 326 ms | 48.6 tok/s | 3887 ms | 78% | 83% |
| qwen3-coder-next · @vllm · short · think=off · cached · t=0.0 | qwen3-coder-next | off | 0 | — | 160 ms | 62.1 tok/s | 2943 ms | 79% | 84% |
| qwen3-coder-next · @vllm · short · think=off · cached · 4×parallel · t=0.0 | qwen3-coder-next | off | 0 | — | 385 ms | 41.4 tok/s | 4388 ms | 82% | 85% |

<!-- bench:table:end -->

[Full report →](/bench-reports/b_23168a3d7a38.html) — the standalone version, with per-case
detail. Prints to PDF.
