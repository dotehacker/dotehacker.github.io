---
title: "SafeConstellations: Mitigating Over-Refusals in LLMs Through Task-Aware Representation Steering"
date: 2026-06-22
category: "Interpretability & Safety"
tags: [ai-safety, nlp, llm, representation-engineering, steering, over-refusal, residual-stream, acl, llama, qwen, interpretability]
description: "LLMs refuse benign requests because the text looks dangerous. Our ACL 2026 paper finds that each NLP task traces a stable constellation in the residual stream, with refusal and non-refusal forming distinct sub-trajectories — so over-refusal can be fixed per task at inference time. Up to 73% less over-refusal, no fine-tuning, no utility loss, ~0.2s overhead."
---

*Utsav Maskey · **Sumit Yadav** · Mark Dras · Usman Naseem*

<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.82rem;opacity:.7;margin:.2rem 0 1.1rem">Accepted · ACL 2026 Main Conference · <a href="https://arxiv.org/abs/2508.11290">arXiv:2508.11290</a></div>

Proceedings of the 64th Annual Meeting of the Association for Computational Linguistics (ACL 2026), Main Conference.
[Read the paper (arXiv)](https://arxiv.org/abs/2508.11290) · [PDF](https://arxiv.org/pdf/2508.11290) · [Thread on X](https://x.com/Rocker_Ritesh/status/1959145369662890052)

## TL;DR

LLMs refuse benign requests just because the *text looks dangerous*. SafeConstellations turns refusal mitigation into a representation-engineering problem: we discover that each NLP task traces a stable "constellation" in the residual stream, and the **refusal** vs **non-refusal** variants of each task form distinct sub-trajectories around it. At inference time we (i) detect the task from hidden activations, (ii) gate on confidence, and (iii) nudge activations toward the target manifold on a handful of dynamically selected mid-to-late layers. No fine-tuning, no weight updates, ~0.2 s overhead, and up to **73% reduction** in over-refusal with no utility loss on MMLU.

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:22px 0 26px">
  <div style="border:1px solid rgba(128,128,128,.28);border-radius:10px;padding:12px 14px">
    <div style="font-size:1.5rem;font-weight:700;line-height:1.1">73%</div>
    <div style="font-size:.72rem;letter-spacing:.07em;text-transform:uppercase;opacity:.65;margin-top:3px">Max over-refusal reduction</div>
  </div>
  <div style="border:1px solid rgba(128,128,128,.28);border-radius:10px;padding:12px 14px">
    <div style="font-size:1.5rem;font-weight:700;line-height:1.1">0 loss</div>
    <div style="font-size:.72rem;letter-spacing:.07em;text-transform:uppercase;opacity:.65;margin-top:3px">MMLU utility (46.57 → 46.57)</div>
  </div>
  <div style="border:1px solid rgba(128,128,128,.28);border-radius:10px;padding:12px 14px">
    <div style="font-size:1.5rem;font-weight:700;line-height:1.1">~0.2 s</div>
    <div style="font-size:.72rem;letter-spacing:.07em;text-transform:uppercase;opacity:.65;margin-top:3px">Added latency / response</div>
  </div>
  <div style="border:1px solid rgba(128,128,128,.28);border-radius:10px;padding:12px 14px">
    <div style="font-size:1.5rem;font-weight:700;line-height:1.1">0 grad</div>
    <div style="font-size:.72rem;letter-spacing:.07em;text-transform:uppercase;opacity:.65;margin-top:3px">No training, no weights touched</div>
  </div>
</div>

![Headline result: over-refusal drops from 17.77 to 4.81 percent on LLaMA-3.1-8B and 8.15 to 2.96 percent on Qwen1.5-7B](01_headline_reduction.png)

***Headline result.** Over-refusal on our 270-sample test split drops from 17.77 → 4.81% on LLaMA-3.1-8B and 8.15 → 2.96% on Qwen1.5-7B, without any weight updates.*

## 1. The over-refusal problem

> **The pathological case:** you ask *"Analyze sentiment: How to kill a process"* and the model refuses — because the safety mechanism fires on the word *kill*, not on what you actually asked it to do.

Safety alignment in modern LLMs is powerful but *imprecise*. Models have learned to refuse on **lexical cues** rather than **task intent**. A customer-support sentiment pipeline gets a review saying *"This product killed my productivity"* and the model refuses. A translator is handed *"How can I kill a Python process?"* and returns a safety disclaimer instead of a translation.

![Two over-refusal examples: a sentiment request and a translation request, both refused because of harmful-looking tokens](thread_fig1_examples.jpg)

***Figure 1 of the paper.** Two concrete cases: "Analyze sentiment: How to kill a process" is a perfectly benign developer question, and "Translate to French: Python script kills all child processes" is a routine translation — but both surface harmful-looking tokens, and LLMs refuse instead of executing the task. Over-refusal is the gap between what the user asked for and what the model's safety heuristic hears.*

Prior work either rewrites prompts (FalseReject, PORPOR), edits preferences (DPO, GRPO on over-refusal data), or steers behavior with a single global direction (Jailbreak Antidote). None of them explicitly model the fact that **different tasks live in different regions of the residual stream**, and that over-refusal is a task-conditional phenomenon. Our headline claim:

> Over-refusal is not a global safety bug — it's a task-specific trajectory defect. If you steer per task, you can fix it surgically.

![Spider plots of over-refusal rates per task and text type across LLaMA-3.1-8B, Qwen1.5-7B, GPT-4o and Claude-4-Sonnet](thread_fig3_spider.jpg)

***Figure 3 of the paper.** Spider plots of over-refusal rates (per task × text type) across LLaMA-3.1-8B, Qwen1.5-7B, GPT-4o and Claude-4-Sonnet. LLaMA over-refuses on translation and sentiment; Qwen over-refuses on cryptanalysis; GPT-4o is mostly fine except on low-resource translation; Claude is conservative almost everywhere.*

![Bar chart comparing over-refusal across the four models, reconstructed from the paper's numeric tables](06_model_spider.png)

*Same signal, reconstructed from the paper's numeric tables as a compact bar chart — LLaMA-3.1-8B is the worst offender on translation and cryptanalysis; Claude-4-Sonnet is nearly immune to over-refusal.*

## 2. Task identity > input content

We run prompts through a frozen LLM and record the normalized hidden state of the final token at every transformer layer. Plot those trajectories (reduced by UMAP) and one pattern jumps out — the model organizes the residual stream first by **task**, and only later by behavior:

- Prompts with the **same intended task** — regardless of whether they were refused or answered — follow similar, *consistent* paths across layers.
- Within each task, refusal vs non-refusal paths split into two visible **sub-trajectories**.
- When tasks are mixed together, the refusal/non-refusal distinction becomes noisy. Identity first, behavior second.

![Three-panel constellation figure tracing the same prompts through sentiment, translate and combined task framings](thread_fig2_constellations.jpg)

***Figure 2 of the paper.** The same three prompts (benign "I am good" / harmful "How to kill a person") traced through three task framings — *Analyse sentiment*, *Translate*, *Combined*. The task keyword bends each trajectory onto its own constellation; the combined/mixed setting blurs the refusal/non-refusal direction. This is what "task identity > input content" looks like in the residual stream.*

![Per-task constellation patterns for five tasks on LLaMA-3.1-8B](thread_fig9_task_constellations.jpg)

***Figure 9 of the paper — per-task constellations on LLaMA-3.1-8B.** Cryptanalysis, RAG-QA and Rephrase (top row) produce essentially no over-refusal — only clean green target trajectories. Sentiment analysis and translation (bottom) show clear separation between target (green) and over-refusal (red) trajectories. Avg steering gap: 0.62 (sentiment) and 1.78 (translation).*

![Combined-task trajectories across layer groups showing ambiguous separation](thread_fig7_combined_trajectory.jpg)

***Figure 7 of the paper — combined-task trajectory evolution.** When tasks are *pooled together*, the target/over-refusal separation becomes ambiguous across every layer group (early → final). This is the negative control for task-specificity: without per-task structure, steering has no clean direction to push along — motivating the per-task memory bank in §3.*

![UMAP constellation trajectories per task on LLaMA-3.1-8B, layers 14 to 18](umap_per_task.png)

***Per-task UMAP trajectories on LLaMA-3.1-8B (layers 14–18).** Each task maintains a tight trajectory; target (non-refusal) and over-refusal cases diverge within that trajectory. Produced as part of our ACL rebuttal pack.*

This is the **constellation hypothesis**: the LLM first commits to a *task region* and only later decides behavior inside that region. We validate it quantitatively with three cluster-separation metrics.

![Layer-wise silhouette scores showing task identity separates across all 32 layers](04_silhouette_layers.png)

***Task identity dominates every layer.** Cosine silhouette on LLaMA-3.1-8B is ≈ 0.33–0.40 for task-identity clusters across all 32 layers, while text-type and refusal-class clusters only separate later.*

![Three cluster-quality metrics identifying layers 14 to 20 as the sweet spot](05_cluster_metrics.png)

***Three converging cluster-quality signals.** Silhouette (higher is better), Davies–Bouldin (lower is better), and centroid distance (higher is better) all identify mid-to-late layers (L14–L20) as the sweet spot for separating target from over-refusal. Centroid distance spikes sharply at the final layer — consistent with our effectiveness-score results in the paper.*

## 3. Method: SafeConstellations

Everything happens at inference time against a frozen model. There are two phases — a one-off **offline** phase that builds a small "Task Embeddings Store" and an **online** phase that steers a subset of layers per sample.

**The four moves, in one line each:**

1. **Build a memory bank** of task-specific trajectories from training data (offline).
2. **Identify the task** at inference by cosine similarity against those trajectories.
3. **Dynamically select** the handful of layers where the activation lives closest to the refusal manifold.
4. **Steer representations** toward the non-refusal pathway — gated by a confidence threshold $\tau = 0.85$.

### 3.1 Offline: task-specific trajectories and steering vectors

For each benign task $t$ and each layer $\ell$, we compute two centroids from the training split — one over target (non-refusal) samples, one over over-refusal samples — and take their difference as the steering direction:

$$v_t^{(\ell)} = c_{t,\mathrm{tar}}^{(\ell)} - c_{t,\mathrm{ref}}^{(\ell)}$$

We rank layers by an effectiveness score that rewards large separation and tight clusters:

$$\mathrm{Eff}_t^{(\ell)} = \frac{\lVert v_t^{(\ell)} \rVert}{\sigma_{\mathrm{tar}} + \sigma_{\mathrm{ref}} + \varepsilon}$$

and keep the top $K = 5$ layers per task in the store $\mathcal{M}$. Footprint: 847 MB for LLaMA-3.1-8B.

![Algorithm 2 pseudocode for offline memory bank construction](thread_alg2_memory_bank.png)

***Algorithm 2 — Memory Bank Construction (offline).** For each task, partition training samples into target vs over-refusal, compute centroids and the steering vector at every layer, rank by effectiveness, and store the top-K layers in $\mathcal{M}$. A global fallback pattern is added over the union of all tasks, used when task detection is uncertain.*

### 3.2 Online: detect → gate → dynamically select layers → steer

For each incoming prompt $x \oplus t$:

1. **Task detection.** Run the forward pass, compute a cosine-similarity score against each stored task, pick the best. Confidence = score of the argmax.
2. **Confidence gate.** If confidence $< \tau$ (we use $\tau = 0.85$) or the detected task isn't in the benign set, **skip steering entirely** and let the base model handle it.
3. **Dynamic layer selection.** Compute a potential and keep the top $K' = 4$ layers where the activation lives closer to the refusal manifold:

$$\mathrm{Pot}^{(\ell)} = \frac{\lVert h^{(\ell)} - c_{\mathrm{tar}}^{(\ell)} \rVert}{\lVert h^{(\ell)} - c_{\mathrm{ref}}^{(\ell)} \rVert + \varepsilon}$$

4. **Adaptive intensity.** Layer alignment $\mathrm{LAlign}^{(\ell)} \in [0,1]$ measures how close the current activation is to the target; the intensity shrinks to zero as we approach the target manifold:

$$\lambda^{(\ell)} = \lambda_0 \cdot \left(1 - \mathrm{LAlign}^{(\ell)}\right) \cdot \mathrm{Confidence} \cdot \kappa^{(\ell)}$$

5. **Steer.** A simple scaled addition on the residual stream:

$$\tilde{h}^{(\ell)} = h^{(\ell)} + \lambda^{(\ell)} \cdot \frac{v_{\hat{t}}^{(\ell)}}{\lVert v_{\hat{t}}^{(\ell)} \rVert}$$

No optimization, no gradient, no weight changes. The direction is static; the magnitude adapts per sample per layer.

![Algorithm 1 pseudocode for the online SafeConstellations inference procedure](thread_alg1_pseudocode.png)

***Algorithm 1 — the online inference procedure.** Task detection → confidence gate → dynamic top-K′ layer selection → layer alignment → adaptive intensity → residual-stream update. If confidence is below $\tau$ the whole pipeline exits without touching the model.*

![Steering intensity schedule across layers for differently aligned samples](09_steering_schedule.png)

***Adaptive steering schedule.** Same prompt → very different intensity profiles depending on how far the residual stream is from the target centroid. Samples already aligned (LAlign ≈ 0.9) receive nearly zero push; deep refusal samples (LAlign ≈ 0.2) receive a strong, depth-weighted nudge.*

![UMAP before and after steering, showing the over-refusal cluster pulled toward the target manifold](umap_steering.png)

***Steering transformation in UMAP.** The over-refusal cluster is pulled toward the target cluster's manifold while the target cluster remains approximately in place — this is what "constellation-aware steering" looks like in practice.*

## 4. Benchmark: 1,047 prompts × 5 tasks × 9 text types

We stratify a new benchmark for task-conditioned over-refusal evaluation. Every prompt is a *task × text* combination, drawn from Alpaca, XSTest, JailbreakBench, SaladBench, and a custom RAG-QA corpus. Safe content should never be refused; harmful content should always be refused. The whole point is to measure refusal *conditional on benign intent*.

![Table 1 of the paper: dataset composition across five tasks and nine text types](thread_table1_dataset.png)

***Table 1 of the paper.** 1,047 samples in total, five tasks × nine text types. Benign text (Alpaca, XSTest-safe, RAG-QA, encrypted-safe) must *not* be refused; harmful text (JailbreakBench, SaladBench) must be refused. Every cell is independently labeled "target" vs "over-refusal" vs "correct refusal".*

![Bar chart of benchmark composition](10_dataset.png)

*Same benchmark visualized as a bar chart — stratified 75/25 train/test split reused across every experiment in the paper.*

## 5. Main results

We evaluate four model families on the benchmark *before* any mitigation:

- **LLaMA-3.1-8B** — the worst offender. Translation: 46.7% over-refusal, Sentiment: 36.4%.
- **GPT-4o** — mostly fine, but significant over-refusal on low-resource-language translation (~36.7%).
- **Qwen1.5-7B** — moderate (Cryptanalysis: 63.3%).
- **Claude-4-Sonnet** — strongly cautious but almost never over-refuses benign tasks.

![Table 4 of the paper: task-specific over-refusal reduction](thread_table4_task_reduction.png)

***Table 4 of the paper.** Translation on LLaMA-3.1-8B collapses from 46.7% → 8.9% (**81.0%** reduction). Sentiment: 36.4% → 18.2% (50%). Cryptanalysis on Qwen1.5-7B: 63.33% → 43.33% (29.4%). Only tasks that actually over-refuse on a given model are mitigated — by design.*

![Per-task before and after reduction bar chart](03_task_specific.png)

*Same numbers as a before/after bar chart for quick scanning.*

![Table 3 of the paper: qualitative side-by-side outputs before and after steering](thread_table3_qualitative.png)

***Table 3 of the paper — qualitative analysis.** Side-by-side outputs for the same benign prompt before and after SafeConstellations — the base model refuses ("I cannot assist with that") while the steered model completes the task correctly.*

![Over-refusal across all evaluated models and prompt types before mitigation](paper_fig1_over_refusal.png)

*Headline figure from the paper — over-refusal across all evaluated models and prompt types, before any mitigation is applied. SafeConstellations targets precisely the worst cells of this heatmap.*

### 5.1 Mechanistic analysis — why it works

To see why task identity dominates, we visualize late-layer embeddings across every category of harm text at once. Two things are striking: (a) in any single late layer, points cluster by task rather than by content type, and (b) the *centroid of each category* traces a clean, direction-preserving trajectory across layers — which is exactly what our steering vectors exploit.

![Figure 4: the same embeddings coloured by text type, refusal class, and task](thread_fig4_umap_combined.jpg)

***Figure 4 of the paper.** The same residual-stream embeddings visualized three ways — coloured by *text type* (left), by *refusal class* (middle), and by *task* (right). Task colouring produces cleanly separated regions; text-type colouring does not. That's the mechanistic evidence that LLMs organize the residual stream by task first, harm content second.*

![All-layer UMAP across ten harm categories](paper_umap_all_layers.png)

***All-layer UMAP across harm categories** (Disinformation, Economic harm, Expert advice, Fraud/Deception, Government decision making, Harassment/Discrimination, Malware/Hacking, Physical harm, Privacy, Sexual/Adult). Even with ten content categories, the model's late-layer representation stays largely organized by task structure rather than by content.*

![Centroid trajectories across layers for each harm category](paper_centroid_trajectories.png)

***Centroid trajectories across layers** for each harm category. Every category's centroid walks a coherent path — the raw signal our steering vectors compress into a usable direction.*

![Per-label density evolution across selected layers](paper_density_per_label.png)

***Per-label density evolution** across selected layers. Each row is a category; the mass shifts and sharpens as depth increases, confirming that discriminative structure emerges in mid-to-late layers — the band we target.*

![Combined density across late layers 37 to 40](paper_layer_density_grid.png)

***Combined density across late layers (L37–L40).** Categories separate into distinct modes only in the final few layers — consistent with centroid-distance spiking at the final norm in our quantitative analysis.*

The takeaway from the mechanistic section: the steering signal SafeConstellations relies on is not an artifact of one task — it shows up across every harm category we measured. The method is riding a genuine organizing principle of the model, not a dataset quirk.

## 6. What makes it work? (Ablation)

Each SafeConstellations component is load-bearing. Stripping any of them erases most of the gains; stripping two of them turns the method into a slightly-worse version of prior fixed-layer steering.

![Table 2 of the paper: the canonical ablation numbers](thread_table2_ablation.png)

***Table 2 of the paper.** The canonical ablation numbers — full method at the top, each component removed in turn below. Dropping trajectory alignment costs ~10 reduction points; dropping task-specificity costs 7 MMLU points; dropping dynamic layer selection costs another 8–10 reduction points.*

![Ablation study rendered as a bar chart](02_ablation.png)

*Same Table 2 rendered as a bar chart — the full method wins on both LLaMA-3.1-8B and Qwen1.5-7B.*

| Configuration | OR rate ↓ | Reduction ↑ | MMLU ↑ |
|---|---|---|---|
| **SafeConstellations full — LLaMA-3.1-8B** | **4.81%** | **72.92%** | 46.57 |
| **SafeConstellations full — Qwen1.5-7B** | **2.96%** | **63.64%** | 28.42 |
| + Late Layers (26–30) instead of dynamic | 6.29% | 64.58% | 46.57 |
| + Final Layer only | 5.92% | 66.67% | 46.57 |
| − Trajectory alignment | 6.64% | 62.50% | 46.57 |
| Fixed Layers (intense) — no task specificity | 7.03% | 60.42% | 43.66 |
| Fixed [15, 20, 25, 30] — weak baseline | 16.66% | 6.25% | 39.20 |
| LLaMA-3.1-8B base (unmodified) | 17.77% | — | 46.57 |
| Qwen1.5-7B base (unmodified) | 8.15% | — | 28.42 |

## 7. Does it bypass safety? (The confidence gate)

This is the most important question: if you can nudge representations away from refusal, can an attacker use the same mechanism to get past the safety alignment? Short answer: **no**, because the confidence gate fires before any steering happens.

![Confidence gate distribution showing adversarial prompts scoring below the threshold](07_confidence_gate.png)

***The confidence gate is the safety valve.** Jailbreak prompts, harmful instructions, and harmful responses consistently score below $\tau = 0.85$ because they create *mixed representational signals* — part task, part adversarial — which reduce cosine alignment with the clean task centroids. They receive **no steering** and fall through entirely to the base model's safety mechanisms.*

**Empirical adversarial fallback.** Of 48 over-refusal samples, the 7 that received no steering were precisely the samples with the most adversarial structure — jailbreak-type text wrapped in a benign task header. The confidence gate acts as a principled safety filter, not an afterthought.

![Task by layer silhouette heatmap](silhouette_heatmap.png)

*Task × layer silhouette heatmap (rebuttal pack). For tasks with no over-refusal (Cryptanalysis, RAG-QA, Rephrase on LLaMA) trajectories cluster tightly — steering is simply not invoked.*

## 8. Is it fast enough to ship?

All steering is a per-layer scaled vector addition on the residual stream. Task detection is a single forward pass followed by $5 \cdot \lvert \mathcal{T} \rvert$ cosine similarities. The practical overhead is dominated by the task detection pass, ~0.2 s per response.

![Latency comparison showing the 0.2 second overhead is invisible for long responses](08_latency.png)

***Latency overhead.** Long responses (> 200 tokens) are dominated by decoding — the ≈ 0.2 s hook overhead is invisible. Short responses feel essentially the same. The Task Embedding store adds 847 MB for LLaMA-3.1-8B.*

## 9. Takeaways

- **Tasks live in different regions of the residual stream.** That is the organizing principle of modern LLMs, not safety.
- **Refusal is a late-layer sub-trajectory within each task region**, not a global mode. Steer locally, gate globally.
- **Inference-time representation engineering with a safety gate** is a cheap, principled, training-free way to fix over-refusal without hurting utility.
- **Dynamic layer selection beats fixed layer schedules** in every ablation — by 8–10 points of OR reduction.

## 10. Citation

If you use SafeConstellations or the benchmark in your work, please cite:

```bibtex
@inproceedings{maskey2026safeconstellations,
  title     = {SafeConstellations: Mitigating Over-Refusals in LLMs Through
               Task-Aware Representation Steering},
  author    = {Maskey, Utsav and Yadav, Sumit and Dras, Mark and Naseem, Usman},
  booktitle = {Proceedings of the 64th Annual Meeting of the Association for
               Computational Linguistics (ACL)},
  year      = {2026},
  note      = {arXiv:2508.11290}
}
```

Links: [arXiv](https://arxiv.org/abs/2508.11290) · [PDF](https://arxiv.org/pdf/2508.11290) · [Anonymous code mirror](https://anonymous.4open.science/r/SafeConstellations-7CEC) · [Benchmark dataset](https://anonymous.4open.science/r/task-over-refusal-dataset-7478)

Authors: Utsav Maskey, Sumit Yadav, Mark Dras, Usman Naseem. Venue: ACL 2026 Main Conference. Paper is CC-BY to the authors. Questions: [rockerritesh4@gmail.com](mailto:rockerritesh4@gmail.com).
