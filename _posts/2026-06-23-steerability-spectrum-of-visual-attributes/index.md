---
title: "The Steerability Spectrum: When Reading a Feature Isn't Enough to Steer It"
date: 2026-06-23
category: "Interpretability"
tags: [interpretability, steering, vision-models, mechanistic-interpretability, clip, siglip, dinov2, paligemma, concept-vectors, kstar]
---

# The Steerability Spectrum of Visual Attributes

*You can read an attribute off a vision model perfectly — and still fail to steer it with a single vector. A number called $k^*$ says why, and prescribes the fix.*

<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.82rem;opacity:.65;margin:.2rem 0 1.1rem">Sumit Yadav · June 2026 · DINOv2 · CLIP · SigLIP · PaliGemma</div>

<div style="margin:22px 0 26px">
  <div style="height:12px;border-radius:7px;background:linear-gradient(90deg,#C2410C,#9a5db0 52%,#3730A3)"></div>
  <div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.74rem;opacity:.7;margin-top:8px">
    <span><b>size</b> · concentrated · low k* · steers with few dims</span>
    <span>high k* · distributed · resists a single vector · <b>orientation</b></span>
  </div>
</div>

Here is a small puzzle that turns out to say something general about vision models. Take a frozen vision encoder — DINOv2, CLIP, SigLIP — and a set of rendered objects where you vary exactly one thing: an object's **size**, or its **orientation**. Train a linear probe to read that attribute from the encoder's activations. For *both* attributes the probe is nearly perfect — the information is plainly there, linearly, in almost every layer.

Now try to *change* the model's mind. Build the classic steering vector — the difference of class means, $v = \mu_{\text{back}} - \mu_{\text{front}}$ — and add it to the activations to push "front" toward "back." For size, this nudges the readout. For orientation, it barely moves: the same direction that *reads* orientation perfectly fails to *steer* it.

So decodability and steerability come apart. A feature you can read off cleanly can still resist a single-vector push. This is about *why* — and about a number, **$k^*$**, that predicts how hard each attribute is to steer, and prescribes how to steer it.

> **The one-line claim.** Each visual attribute occupies a subspace of some width $k^*$. To control the attribute you must steer that whole $k^*$-dimensional subspace — no more, no less. Push along one direction and a wide attribute slips around your edit; push along its full $k^*$ dimensions and it moves cleanly, identity intact. The width $k^*$ is set by the encoder's training objective, and the law holds across objectives — until it meets one wall, a frozen language model, which is itself the interesting part.

## 01 · k\*: the steerability dimension

The intuition is geometric. Take the encoder activations for all your images at one layer and ask: *how many orthogonal directions span the variation that correlates with the attribute?* Rank the principal components by how strongly they correlate with the label, and count how many you need to capture 95% of the attribute-correlated signal. That count is $k^*$.

$$k^* \;=\; \min\Big\lbrace\, K : \frac{\sum_{j=1}^{K}\rho_j^2}{\sum_j \rho_j^2}\ \ge\ 0.95 \,\Big\rbrace,\qquad \rho_j=\operatorname{corr}(\mathrm{PC}_j,\ \text{attribute})$$

A *concentrated* attribute (small $k^*$) lives along a few directions — a single vector is a faithful summary of it. A *distributed* attribute (large $k^*$) is smeared across many directions, so no single vector represents it well, and no single vector steers it. Crucially, $k^*$ is about *geometry, not availability*: an attribute can be perfectly decodable and still have large $k^*$. That gap is the whole story. In our renders the ends are clean — **size** is concentrated ($k^*\!\approx\!12\text{–}16$); **orientation** is distributed ($k^*\!\approx\!49\text{–}65$), as you'd expect for a circular quantity that needs at least a $(\sin\theta,\cos\theta)$ pair before any model-specific spreading.

## 02 · Steering, generalized: from a vector to a subspace

If a wide attribute resists a single direction, the fix writes itself: steer *more* directions. Generalize the rank-1 concept vector to a **rank-$K$ subspace swap**. Let $U_K$ hold the top-$K$ attribute directions (the same components that define $k^*$), let $P_K=U_KU_K^\top$ project onto them, and let $t^*$ be the target prototype. Then edit every token:

$$h' \;=\; h + P_K\,(t^* - h).$$

This replaces only the activation's *attribute-subspace* content with the target's and leaves the orthogonal complement — object identity, everything else — untouched by construction. At $K=1$ it is essentially the old concept vector; as $K$ grows it covers more of the attribute's true width.

The figure is the result, and it is yours to drive. **Drag the plot** to set the steering rank $K$. The solid line is steering success — the fraction of the front→target readout gap you close. The dashed line is identity preserved — whether the object is still recognizable. The vertical mark is $k^*$. Switch the attribute and the encoder.

<iframe class="steer-fig" src="steer-fig-enc.html" title="Encoder steering: how much control does rank K buy?" loading="lazy" scrolling="no" style="width:100%;height:600px;border:0;background:transparent"></iframe>

Read it for **orientation on DINOv2**. At $K=1$ — the classic concept vector — you close about **11%** of the gap. Useless. Slide right and almost nothing happens through $K\approx30$… then it snaps to **96%** right as $K$ reaches $k^*\approx49$, with the object's shape perfectly intact the whole way. The dissociation doesn't gently improve; it *breaks* when the rank finally matches the attribute's width.

Now switch to **size**. It closes the gap early — by $K\approx13$, near its small $k^*$ — and then watch the dashed line: push *past* $k^*$ and identity falls apart. Over-steering a concentrated attribute spends rank on directions that aren't about size, and those directions carry the object. So the prescription is two-sided: **you need $k^*$ dimensions, and you want no more than $k^*$.**

## 03 · The same law across training objectives

Is this a quirk of one model? Flip the encoder toggle above. The three encoders use genuinely different objectives — DINOv2 (self-distillation), CLIP (contrastive), SigLIP (sigmoid) — yet the law holds in all three: orientation's single-vector push fails everywhere (rank-1 closes $0.11$, $-0.03$, $0.01$), and only climbs to full control as $K\to k^*$; size stays concentrated and saturates at small $K$.

One wrinkle is visible in the identity line. DINOv2 and CLIP read from a `CLS` token and hold identity at ~1.0 up to $k^*$; SigLIP has no `CLS` — it mean-pools every patch — so an all-token edit hits the readout more directly and identity frays sooner. So **control follows $k^*$** (set by the objective) while **identity headroom follows the readout pooling** (set by the architecture). Two different knobs, two different causes. [See a diagram of CLS vs MAP pooling — and why a uniform shift survives the pool →](steer-siglip.html)

## 04 · The wall: a frozen language model doesn't follow

Everything above reads the attribute with a *linear probe*. What if the readout is a full **language model**? PaliGemma is the clean test: its vision tower *is* a SigLIP, bolted to a Gemma language model. We recompute the attribute subspace inside PaliGemma's own tower, apply the same rank-$K$ swap, and read it out two ways at once — the tower's linear probe (does the *representation* move?) and Gemma's caption (does the *language* move?).

<iframe class="steer-fig" src="steer-fig-pg.html" title="PaliGemma: representation vs language steering" loading="lazy" scrolling="no" style="width:100%;height:520px;border:0;background:transparent"></iframe>

The **representation** line behaves exactly like the encoders — it follows the $K\approx k^*$ law (orientation climbs to full control near $k^*\approx54$; size saturates early). The edit unquestionably works at the representation level. **But the language line is flat on the floor.** The caption's preference for the target word does not move — at any rank — while object identity quietly degrades. The tower edit reaches Gemma only as *noise*, not as *attribute control*.

So the $k^*$-subspace law is a property of **linear readouts** — it holds across encoders and inside PaliGemma's own tower — but it does **not** automatically propagate to a frozen generative language model. The tower's probe-defined attribute subspace is simply not the channel the projector and language model read for that attribute. Steerability is gated by *two* things, not one: by $k^*$ (the encoding geometry — how wide the attribute is) **and** by readout↔subspace alignment (whether whatever reads the model actually listens to the subspace you edited).

## 05 · What to take away

- **Decodable ≠ steerable.** A feature you can read off perfectly can still resist a single-vector push if it is geometrically wide.
- **$k^*$ measures that width and prescribes the intervention.** Steer the attribute's own $k^*$-dimensional subspace: fewer dimensions under-steer; more dimensions break identity. The rank you need *is* $k^*$.
- **The law is objective-universal** across self-distillation, contrastive, and sigmoid encoders — but **bounded by the readout**: it controls representations and linear probes, not (out of the box) a frozen language model's words.

None of this needs the attribute to be hidden or hard to find. It needs the attribute to be *concentrated enough that one direction is a faithful summary of it* — and $k^*$ is just the honest measurement of when that is true.

## 06 · Explore it yourself

The $k^*$ analysis treats each attribute's subspace as a whole. We can also crack open individual *neurons* — features of a sparse autoencoder trained on PaliGemma's L10 stream — and ask what each fires on. Load the explorer (it fetches a small data file on demand), pick a neuron, and the 500-image map recolors by that neuron's activation; hover any point for its caption.

<iframe class="steer-fig" src="steer-explorer.html" title="SAE feature explorer" loading="lazy" scrolling="no" style="width:100%;height:660px;border:0;background:transparent"></iframe>

Some neurons are crisp and object-like — a *banana/pizza* feature, a *cat/surfboard* feature — lighting a tight cluster. Others smear across the map. That spread is what $k^*$ measures, now visible neuron by neuron: a concentrated feature is a bright island; a distributed attribute like orientation has no such island, which is why one vector can't steer it.

**Run your own image.** The full dashboard — pass any image, read its SAE neurons, clamp one, and watch PaliGemma's caption — is packaged as a Hugging Face Space.

<div style="font-size:.86rem;background:rgba(194,65,12,.08);border-radius:8px;padding:.7rem .9rem;margin:1rem 0">⚠️ The live demo runs PaliGemma-3B on a free CPU Space, so it may be asleep or queued — give it a moment, or duplicate it to your own account for a private GPU run. <a href="https://huggingface.co/spaces/rockerritesh/visual-steerability" target="_blank" rel="noopener">Open the Space ↗</a></div>

<iframe src="https://rockerritesh-visual-steerability.hf.space" loading="lazy" title="Visual Steerability — live SAE steering demo" style="width:100%;height:640px;border:1px solid var(--rule);border-radius:12px;background:var(--surface);margin:1.2rem 0"></iframe>

---

*Controlled renders (size & orientation sweeps), per-layer embeddings, the $k^*$ analysis, and the rank-$K$ steering code are open. Built and run on a single consumer GPU; the encoder experiments run on a laptop.*

<script>
(function(){
  function theme(){var c=document.documentElement.classList;return (c.contains('dark-theme')||c.contains('rain-theme'))?'dark':'light';}
  function sync(){document.querySelectorAll('iframe.steer-fig').forEach(function(f){try{f.contentWindow.postMessage({type:'theme',theme:theme()},'*');}catch(e){}});}
  document.querySelectorAll('iframe.steer-fig').forEach(function(f){f.addEventListener('load',sync);});
  try{new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});}catch(e){}
  setTimeout(sync,400);setTimeout(sync,1400);
})();
</script>
