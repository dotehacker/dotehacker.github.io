---
title: "SafeConstellations: Mitigating Over-Refusals in LLMs Through Task-Aware Representation Steering (ACL 2026)"
date: 2026-04-18
category: "Interpretability & Safety"
author: Sumit Yadav (@Rocker_Ritesh)
categories: [ai, llm, research]
tags: [llm, safety, over-refusal, representation-engineering, acl-2026, activation-steering, llama, qwen]
---

# SafeConstellations — ACL 2026 Main Conference

A deep-dive companion blog for **SafeConstellations**, accepted at **ACL 2026 Main**. An inference-time method that reduces LLM over-refusal by up to **73%** by steering task-specific trajectories in the residual stream — no fine-tuning, ~0.2s overhead, zero utility loss on MMLU.

**[Read the full interactive blog →](/study/stellar-steering/)**

---

## TL;DR

LLMs refuse benign requests just because the *text looks dangerous* ("Analyze sentiment: How to kill a process" → refusal). SafeConstellations turns refusal mitigation into a representation-engineering problem:

1. Each NLP task traces a stable **constellation** in the residual stream.
2. Refusal vs non-refusal variants form distinct sub-trajectories within each task.
3. At inference we detect the task, gate on confidence (τ = 0.85), and nudge activations toward the target manifold on a handful of dynamically selected mid-to-late layers.

## Headline Numbers

| Metric | Value |
|--------|-------|
| Max over-refusal reduction | **73%** |
| MMLU utility | 46.57 → 46.57 (no loss) |
| Added latency / response | ~0.2 s |
| Training / weight updates | 0 |

## Paper

- **Title:** SafeConstellations: Mitigating Over-Refusals in LLMs Through Task-Aware Representation Steering
- **Authors:** Utsav Maskey, **Sumit Yadav**, Mark Dras, Usman Naseem
- **Venue:** Proceedings of the 64th Annual Meeting of the Association for Computational Linguistics (ACL 2026), Main Conference
- **arXiv:** [2508.11290](https://arxiv.org/abs/2508.11290)
- **Thread:** [@Rocker_Ritesh on X](https://x.com/Rocker_Ritesh/status/1959145369662890052)

## What's Inside the Blog

The full interactive write-up at **[/study/stellar-steering/](/study/stellar-steering/)** walks through:

- **Motivation** — why LLMs over-refuse on task keywords like "kill", "exploit", "crack"
- **Constellation hypothesis** — task identity dominates the residual stream; behavior is a sub-structure
- **Method** — offline task-embedding memory bank + online task detection + dynamic layer selection + confidence-gated steering
- **Results** — 270-sample test split, LLaMA-3.1-8B and Qwen1.5-7B, per-task reductions
- **Ablations** — which components matter (confidence gate, layer selection, per-task vs global direction)
- **Safety** — no weakening of harmful-request refusal; utility preserved
- **Latency** — ~0.2s per response, 847 MB memory bank footprint

## Why This Matters

Over-refusal is not a global safety bug — it's a **task-specific trajectory defect**. Steer per task, and you fix it surgically. No DPO, no GRPO, no prompt rewriting, no fine-tuning. Just activation geometry.

**[Open the full blog →](/study/stellar-steering/)**
