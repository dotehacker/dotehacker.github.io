---
title: "The Steerability Spectrum: When Reading a Feature Isn't Enough to Steer It"
date: 2026-06-23
category: "Interpretability"
tags: [interpretability, steering, vision-models, mechanistic-interpretability, clip, siglip, dinov2, paligemma, concept-vectors, kstar]
---

> **This is an interactive piece.** Read the full version with live charts — drag the steering rank and watch the law emerge — here:
> ### → [The Steerability Spectrum of Visual Attributes](/study/steerability-spectrum/)

Here is a small puzzle that turns out to say something general about vision models.

Take a frozen vision encoder — DINOv2, CLIP, SigLIP — and a set of rendered objects where you vary exactly one thing: an object's **size**, or its **orientation**. Train a linear probe to read that attribute back. For *both* attributes the probe is nearly perfect — the information is plainly there, linearly, in almost every layer.

Now try to *change* the model's mind with the classic steering vector — the difference of class means, added to the activations. For size, it nudges the readout. For orientation, it barely moves. **The same direction that reads orientation perfectly fails to steer it.** Decodability and steerability come apart.

The interactive explainer works through why, and introduces a number — **k\***, the *steerability dimension* — that measures how many directions an attribute is spread across, predicts how hard it is to steer, and prescribes the fix.

**The headline findings:**

- **Decodable ≠ steerable.** A feature you can read off perfectly can still resist a single-vector push if it is geometrically *wide*.
- **k\* measures that width — and prescribes the intervention.** Generalize the rank-1 concept vector to a rank-K *subspace* edit. Steering success peaks exactly when the rank K reaches k\*: for orientation on DINOv2, the classic concept vector closes only **11%** of the gap, but a rank-k\* edit closes **96%** — with object identity perfectly intact. Push *past* k\* and identity breaks. You need k\* dimensions, and no more.
- **The law is objective-universal** — it holds across self-distillation (DINOv2), contrastive (CLIP), and sigmoid (SigLIP) encoders.
- **But it is bounded by the readout.** Inside PaliGemma, the same edit steers the *representation* (following the k\* law) yet a *frozen language model* downstream ignores it — the caption doesn't move. Steerability is gated by two things: the encoding geometry (k\*) **and** whether the readout listens to the subspace you edited.

The full piece has two interactive figures driven by the real measurements — switch attributes and encoders, drag the rank, and see the dissociation break and re-form for yourself.

### → [Read the interactive version](/study/steerability-spectrum/)
