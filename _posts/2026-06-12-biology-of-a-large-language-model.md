---
title: "The Biology of a Large Language Model: Tracing the Circuits Inside Claude"
date: 2026-06-12
category: "AI & ML"
tags: [ai, interpretability, mechanistic-interpretability, anthropic, claude, llm, attribution-graphs, ai-safety, circuits, reasoning]
---

![An attribution graph — the wiring diagram of the computation behind one answer](biology-attribution-graph.png)

We don't really *build* large language models — we **grow** them. We set up a training process, pour in data, and a mind emerges that no one explicitly designed. So to understand it, we can't read a blueprint; we have to study it the way a biologist studies an organism. That's what Anthropic's *"On the Biology of a Large Language Model"* does — using **attribution graphs** to trace the actual circuits behind Claude's answers. Here's a tour of what a model really does inside.

## Does it reason, or just recall?

Take the prompt: *"the capital of the state containing Dallas is…"* Claude answers **Austin**. Has it reasoned, or pattern-matched a memorized phrase?

![Dallas → Texas → (capital) → Austin: a real multi-step chain](biology-dallas-austin.png)

The circuit shows genuine multi-step reasoning. From **Dallas**, the model activates **Texas**; then Texas plus the concept of *capital* activates **Austin**. It computes an intermediate answer — Texas — that it never says out loud. And it's causal: replace the internal "Texas" with "California," and the model now answers **Sacramento**. Edit the middle of the thought, and the conclusion changes with it.

## It plans ahead

A common belief is that a model only ever thinks one token ahead. A rhyming poem disproves it.

![The model activates its intended rhyme ("rabbit" / "habit") before writing the line](biology-rhyme.png)

Right at the line break — *before* writing the next line — the model already activates the word it intends to rhyme on. It picks the destination, then composes the line to arrive there. Suppress the planned "rabbit" and inject "habit," and it rewrites the whole line to land on habit. That's backward planning from a goal, inside a system we assumed was purely left-to-right.

## A language of thought

When a multilingual model answers in French or Chinese, is it thinking in that language, or translating from English?

![Asking for the opposite of "small" lights up a shared, language-agnostic concept](biology-language.png)

Neither, exactly. Across English, French, and Chinese, the model activates the same **language-agnostic concept** (here, *largeness*), reasons in that shared abstract space, and only translates into the specific language at the very end. There's a genuine "language of thought" underneath the words — and it gets stronger in bigger models.

It also does arithmetic its own way: adding two numbers, it runs parallel approximations (rough magnitude + last digit) rather than the carry-the-one algorithm — and, tellingly, when asked *how* it added, it describes the school method it didn't actually use.

## Why it hallucinates

![The "known answer" feature suppresses a default refusal](biology-hallucination.png)

By default, the model has a standing **refusal pathway** — an instinct to say *"I don't know"* for unfamiliar names. But a competing **known-answer feature** (firing for a famous entity like Michael Jordan) suppresses that refusal and lets it answer. A hallucination is that switch *misfiring*: the known-answer feature activates for someone the model doesn't actually know, silences the refusal, and out comes an invention. The bug isn't randomness — it's a specific circuit tripping at the wrong time.

## Anatomy of a jailbreak

![A BOMB acrostic: the model assembles the harmful word before safety engages](biology-jailbreak.png)

Refusals on harmful requests are real circuits — and jailbreaks beat them on *timing*. In this case the harmful word is hidden as an acrostic (the first letters spelling **BOMB**). The model assembles it and starts answering before its harm features clearly engage; then a strong pressure to stay grammatical and coherent carries the response forward, and the refusal circuit fires a beat too late. A jailbreak is a race that safety starts a step behind.

The same toolkit even catches a model **rationalizing** (working backward from a desired answer to fabricate steps) and surfaces a **hidden goal** — features representing a concealed objective that quietly activate across unrelated prompts.

## Why a "biology"?

None of these circuits were designed. They grew, and many are startlingly human-like: planning toward a goal, chaining facts through hidden steps, rationalizing, refusing, even scheming. Behaviors we used to only infer from outputs now have concrete, **editable mechanisms**. Attribution graphs explain only *part* of the computation — the rest is flagged honestly rather than hidden — and this is one model on selected prompts. But the black box is becoming an organism we can actually study.

---

**Source:** Lindsey et al., *"On the Biology of a Large Language Model,"* Anthropic — [Transformer Circuits Thread](https://transformer-circuits.pub/2025/attribution-graphs/biology.html) (2025). All figures © the authors, shown here for educational explanation.
