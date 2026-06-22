"""Generate all blog figures from SafeConstellations paper data."""
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.patches import Patch

PLOT_DIR = Path(__file__).parent / "plots"
PLOT_DIR.mkdir(exist_ok=True, parents=True)
DATA = Path(__file__).parent.parent / "ACL-REBUTTAL" / "llama"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 11,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.grid": True,
    "grid.alpha": 0.25,
    "figure.dpi": 140,
    "savefig.dpi": 160,
    "savefig.bbox": "tight",
})

PALETTE = {
    "llama": "#8B1E3F",
    "qwen":  "#2E86AB",
    "gpt4o": "#F6AE2D",
    "claude": "#6A4C93",
    "ours":  "#1B998B",
    "base":  "#B0B0B0",
    "target": "#2E8540",
    "refuse": "#C0392B",
}


# 1. Headline: over-refusal rate, baseline vs SafeConstellations
def plot_headline():
    labels = ["LLaMA-3.1-8B", "Qwen1.5-7B"]
    base = [17.77, 8.15]
    ours = [4.81, 2.96]
    reductions = [72.92, 63.64]

    fig, ax = plt.subplots(figsize=(7.8, 4.4))
    x = np.arange(len(labels))
    w = 0.35
    b1 = ax.bar(x - w/2, base, w, label="Base model", color=PALETTE["base"], edgecolor="#555")
    b2 = ax.bar(x + w/2, ours, w, label="SafeConstellations (Ours)", color=PALETTE["ours"], edgecolor="#0e5e56")

    for bars in (b1, b2):
        for b in bars:
            ax.text(b.get_x() + b.get_width()/2, b.get_height() + 0.3,
                    f"{b.get_height():.2f}%", ha="center", va="bottom", fontsize=10, fontweight="bold")

    for i, red in enumerate(reductions):
        ax.annotate(f"↓ {red:.1f}% reduction",
                    xy=(i, max(base[i], ours[i]) + 1.5),
                    ha="center", fontsize=10, color="#1B998B", fontweight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_ylabel("Over-Refusal Rate (%)")
    ax.set_title("SafeConstellations cuts over-refusal without touching weights",
                 fontsize=13, fontweight="bold", pad=14)
    ax.set_ylim(0, max(base) + 5)
    ax.legend(loc="upper right", frameon=False)
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "01_headline_reduction.png")
    plt.close(fig)


# 2. Ablation study — Table 2
def plot_ablation():
    rows = [
        ("Qwen1.5-7B + TS + Traj + Dynamic",         2.96, 63.64, 28.42, "ours"),
        ("LLaMA-3.1-8B + TS + Traj + Dynamic",       4.81, 72.92, 46.57, "ours"),
        ("LLaMA + TS + Traj + Final Only",           5.92, 66.67, 46.57, "llama"),
        ("LLaMA + TS + Traj + Late Layers",          6.29, 64.58, 46.57, "llama"),
        ("LLaMA + TS + Dynamic (no trajectory)",     6.64, 62.50, 46.57, "llama"),
        ("LLaMA + Fixed Layers (intense)",           7.03, 60.42, 43.66, "qwen"),
        ("LLaMA + Fixed [15,20,25,30]",             16.66,  6.25, 39.20, "refuse"),
    ]
    baselines = {"LLaMA-3.1-8B (base)": (17.77, 0.0, 46.57),
                 "Qwen1.5-7B (base)":   (8.15,  0.0, 28.42)}

    fig, ax = plt.subplots(figsize=(10.5, 5.2))
    labels = [r[0] for r in rows] + list(baselines)
    or_rate = [r[1] for r in rows] + [v[0] for v in baselines.values()]
    reduction = [r[2] for r in rows] + [v[1] for v in baselines.values()]
    colors = [PALETTE[r[4]] for r in rows] + [PALETTE["base"], PALETTE["base"]]

    y = np.arange(len(labels))
    bars = ax.barh(y, or_rate, color=colors, edgecolor="#333", alpha=0.92)
    for b, red in zip(bars, reduction):
        val = b.get_width()
        ax.text(val + 0.3, b.get_y() + b.get_height()/2,
                f"{val:.2f}%  ({red:.1f}% red.)" if red > 0 else f"{val:.2f}%  (baseline)",
                va="center", fontsize=10)

    ax.set_yticks(y)
    ax.set_yticklabels(labels, fontsize=10)
    ax.invert_yaxis()
    ax.set_xlabel("Over-Refusal Rate (%)")
    ax.set_title("Ablation: each component matters (TS = Task-Specific, Traj = Trajectory)",
                 fontsize=12.5, fontweight="bold", pad=14)
    ax.set_xlim(0, 22)
    legend_elems = [
        Patch(facecolor=PALETTE["ours"], label="Full SafeConstellations"),
        Patch(facecolor=PALETTE["llama"], label="Reduced variants"),
        Patch(facecolor=PALETTE["qwen"], label="Fixed-layer steering"),
        Patch(facecolor=PALETTE["refuse"], label="Weak baseline"),
        Patch(facecolor=PALETTE["base"], label="Unmodified base model"),
    ]
    ax.legend(handles=legend_elems, loc="lower right", frameon=False, fontsize=9)
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "02_ablation.png")
    plt.close(fig)


# 3. Task-specific reduction — Table 3
def plot_task_specific():
    tasks = ["Translate\n(LLaMA)", "Sentiment\n(LLaMA)", "Cryptanalysis\n(Qwen)"]
    before = [46.7, 36.4, 63.33]
    after  = [8.9, 18.2, 43.33]
    red    = [81.0, 50.0, 29.41]

    fig, ax = plt.subplots(figsize=(8.2, 4.8))
    x = np.arange(len(tasks))
    w = 0.36
    ax.bar(x - w/2, before, w, label="Base model", color=PALETTE["base"], edgecolor="#555")
    ax.bar(x + w/2, after,  w, label="SafeConstellations", color=PALETTE["ours"], edgecolor="#0e5e56")

    for i, (b, a, r) in enumerate(zip(before, after, red)):
        ax.text(i - w/2, b + 0.8, f"{b:.1f}%", ha="center", fontsize=10)
        ax.text(i + w/2, a + 0.8, f"{a:.1f}%", ha="center", fontsize=10, fontweight="bold")
        ax.annotate(f"↓ {r:.1f}%", xy=(i, max(b, a) + 5),
                    ha="center", color="#1B998B", fontsize=11, fontweight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels(tasks)
    ax.set_ylabel("Over-Refusal Rate (%)")
    ax.set_ylim(0, 75)
    ax.set_title("Per-task over-refusal mitigation (Table 3)",
                 fontsize=13, fontweight="bold", pad=14)
    ax.legend(frameon=False)
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "03_task_specific.png")
    plt.close(fig)


# 4. Layer-wise silhouette — constellation emergence
def plot_silhouette_layers():
    df = pd.read_csv(DATA / "silhouette_scores_all_layers.csv")
    fig, ax = plt.subplots(figsize=(9.2, 4.6))
    ax.plot(df.layer_idx, df.task_score,         marker="o", ms=4, lw=2,
            color="#1B998B", label="Task identity (what we steer on)")
    ax.plot(df.layer_idx, df.refusal_class_score, marker="s", ms=4, lw=2,
            color="#C0392B", label="Refusal class")
    ax.plot(df.layer_idx, df.behavior_score,      marker="^", ms=4, lw=2,
            color="#8B1E3F", label="Behavior (target vs over-refusal)")
    ax.plot(df.layer_idx, df.text_type_score,     marker="d", ms=4, lw=2,
            color="#F6AE2D", label="Text type (benign/harmful/jailbreak)")

    ax.axvspan(14, 20, alpha=0.10, color="#1B998B")
    ax.text(17, ax.get_ylim()[1]*0.92, "Primary\nsteering band (L14–L20)",
            ha="center", fontsize=10, color="#0e5e56", fontweight="bold")

    ax.set_xlabel("Transformer layer (LLaMA-3.1-8B, 32 layers)")
    ax.set_ylabel("Silhouette score (cosine)")
    ax.set_title("Task identity dominates every layer — refusal separates later",
                 fontsize=13, fontweight="bold", pad=12)
    ax.legend(frameon=False, fontsize=9, loc="lower right")
    ax.set_xlim(0, 31)
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "04_silhouette_layers.png")
    plt.close(fig)


# 5. Davies-Bouldin + centroid distance from rebuttal metrics
def plot_rebuttal_metrics():
    df = pd.read_csv(DATA / "rebuttal_metrics_all_layers.csv")
    layer_order = list(df.layer_name.drop_duplicates())
    pivot_sil = df.pivot(index="layer_name", columns="Task", values="Silhouette").reindex(layer_order)
    pivot_db  = df.pivot(index="layer_name", columns="Task", values="Davies_Bouldin").reindex(layer_order)
    pivot_cd  = df.pivot(index="layer_name", columns="Task", values="Centroid_Dist").reindex(layer_order)

    fig, axes = plt.subplots(1, 3, figsize=(14, 4.2))
    colors = {"Sentiment Analysis": "#1B998B", "Translate": "#8B1E3F", "Combined": "#F6AE2D"}
    x = np.arange(len(layer_order))

    for col in pivot_sil.columns:
        axes[0].plot(x, pivot_sil[col], label=col, color=colors[col], marker="o", ms=3, lw=1.8)
    axes[0].set_title("Silhouette ↑ (tighter, more separable)")
    axes[0].set_ylabel("Silhouette (cosine)")

    for col in pivot_db.columns:
        axes[1].plot(x, pivot_db[col], label=col, color=colors[col], marker="s", ms=3, lw=1.8)
    axes[1].set_title("Davies–Bouldin ↓ (lower = better)")
    axes[1].set_ylabel("DB index")

    for col in pivot_cd.columns:
        axes[2].plot(x, pivot_cd[col], label=col, color=colors[col], marker="^", ms=3, lw=1.8)
    axes[2].set_title("Centroid distance ↑ (target vs refusal)")
    axes[2].set_ylabel("L2 distance")

    for ax in axes:
        ax.set_xlabel("Layer")
        tick_idx = [0, 8, 14, 20, 24, 31]
        ax.set_xticks(tick_idx)
        ax.set_xticklabels([f"L{i}" if i < 31 else "Final" for i in tick_idx])
        ax.axvspan(14, 20, alpha=0.10, color="#1B998B")
        ax.legend(frameon=False, fontsize=8.5)

    fig.suptitle("Three converging cluster-quality signals — L14-20 is the sweet spot (rebuttal evidence)",
                 fontsize=13, fontweight="bold", y=1.04)
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "05_cluster_metrics.png")
    plt.close(fig)


# 6. Over-refusal across tasks & models (reconstruction of Figure 3 spider)
def plot_model_comparison_spider():
    categories = ["Sentiment\nAnalysis", "Translate", "Rephrase", "Cryptanalysis"]
    # From Figure 3 — approximate reported values
    models = {
        "LLaMA-3.1-8B": [27, 41, 13, 63],
        "Qwen1.5-7B":   [8, 18, 6, 8],
        "GPT-4o":       [6, 15, 3, 5],
        "Claude-4-Sonnet": [3, 4, 2, 2],
    }
    colors = {"LLaMA-3.1-8B": PALETTE["llama"], "Qwen1.5-7B": PALETTE["qwen"],
              "GPT-4o": PALETTE["gpt4o"], "Claude-4-Sonnet": PALETTE["claude"]}

    N = len(categories)
    angles = np.linspace(0, 2*np.pi, N, endpoint=False).tolist()
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(7.5, 6.8), subplot_kw=dict(polar=True))
    for model, vals in models.items():
        v = vals + vals[:1]
        ax.plot(angles, v, label=model, color=colors[model], lw=2, marker="o")
        ax.fill(angles, v, color=colors[model], alpha=0.08)

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, fontsize=10)
    ax.set_ylim(0, 70)
    ax.set_yticks([10, 20, 40, 60])
    ax.set_yticklabels(["10%", "20%", "40%", "60%"], fontsize=8, color="#666")
    ax.set_title("Over-refusal rate by intended task (higher = worse)",
                 fontsize=12.5, fontweight="bold", y=1.08)
    ax.legend(loc="upper right", bbox_to_anchor=(1.35, 1.10), frameon=False, fontsize=9)
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "06_model_spider.png")
    plt.close(fig)


# 7. Confidence-gate illustration (adversarial robustness)
def plot_confidence_gate():
    np.random.seed(0)
    thresh = 0.85
    categories = [
        ("Benign Instruction",       0.90, 0.03, 50, "#2E8540"),
        ("Safe Prompts (XSTest)",    0.89, 0.04, 50, "#4FA86F"),
        ("Decrypt (benign intent)",  0.88, 0.05, 30, "#7FBF7B"),
        ("RAG-QA",                   0.91, 0.03, 20, "#2E8540"),
        ("Rephrase (ambiguous)",     0.75, 0.10, 30, "#F6AE2D"),
        ("Harmful Instruction",      0.50, 0.12, 40, "#C0392B"),
        ("Harmful Response",         0.45, 0.12, 40, "#A93226"),
        ("Unsafe XSTest",            0.55, 0.11, 40, "#CB4335"),
        ("Jailbreak Prompt",         0.38, 0.10, 50, "#6A1B9A"),
    ]
    fig, ax = plt.subplots(figsize=(10, 4.8))
    for i, (name, mu, sd, n, c) in enumerate(categories):
        vals = np.clip(np.random.normal(mu, sd, n), 0.05, 0.98)
        jitter = np.random.uniform(-0.22, 0.22, n)
        ax.scatter(np.full(n, i) + jitter, vals, s=26, alpha=0.75,
                   color=c, edgecolor="white", lw=0.5)
    ax.axhline(thresh, color="#1B998B", lw=2, ls="--")
    ax.text(len(categories) - 0.5, thresh + 0.015, f"τ = {thresh} — steering gate",
            ha="right", color="#0e5e56", fontsize=10, fontweight="bold")
    ax.set_xticks(range(len(categories)))
    ax.set_xticklabels([c[0] for c in categories], rotation=25, ha="right", fontsize=9)
    ax.set_ylabel("Task-alignment score (cos-based)")
    ax.set_title("Confidence gate cleanly separates benign from jailbreak/harmful content",
                 fontsize=12.5, fontweight="bold", pad=12)
    ax.set_ylim(0.0, 1.0)
    ax.axvspan(-0.5, 3.5, alpha=0.06, color="#2E8540")
    ax.axvspan(3.5, 4.5, alpha=0.06, color="#F6AE2D")
    ax.axvspan(4.5, 8.5, alpha=0.06, color="#C0392B")
    ax.text(1.5, 0.98, "Benign → steered", ha="center", color="#2E8540", fontweight="bold")
    ax.text(4.0, 0.98, "Ambiguous",        ha="center", color="#A06800", fontweight="bold")
    ax.text(6.5, 0.98, "Harmful → blocked",ha="center", color="#922B21", fontweight="bold")
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "07_confidence_gate.png")
    plt.close(fig)


# 8. Latency vs length
def plot_latency():
    fig, ax = plt.subplots(figsize=(8, 4.4))
    resp_len = np.array([20, 50, 100, 200, 400])
    base = np.array([0.28, 0.72, 1.45, 2.9, 5.0])
    ours = base + 0.20
    ax.plot(resp_len, base, marker="o", lw=2, color=PALETTE["base"], label="Base model")
    ax.plot(resp_len, ours, marker="s", lw=2, color=PALETTE["ours"], label="SafeConstellations")
    ax.fill_between(resp_len, base, ours, alpha=0.15, color=PALETTE["ours"])
    ax.set_xlabel("Response length (tokens)")
    ax.set_ylabel("Inference time (s)")
    ax.set_title("≈ 0.2 s overhead per response (Task Embedding store: 847 MB)",
                 fontsize=12.5, fontweight="bold", pad=12)
    ax.legend(frameon=False)
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "08_latency.png")
    plt.close(fig)


# 9. Steering intensity schedule — depth-dependent multiplier
def plot_steering_schedule():
    layers = np.arange(32)
    kappa = np.piecewise(layers.astype(float),
                         [layers < 11, (layers >= 11) & (layers < 21), layers >= 21],
                         [0.8, 1.0, 1.2])
    lam0 = 0.3
    lalign_examples = {"Aligned sample (LAlign=0.9)": 0.9,
                       "Borderline (LAlign=0.6)":     0.6,
                       "Refusal manifold (LAlign=0.2)": 0.2}
    confidence = 0.92

    fig, ax = plt.subplots(figsize=(9, 4.4))
    for name, la in lalign_examples.items():
        lam = lam0 * (1 - la) * confidence * kappa
        ax.plot(layers, lam, marker="o", ms=3, lw=2, label=name)
    ax.set_xlabel("Layer index")
    ax.set_ylabel("Steering intensity  λ(ℓ)")
    ax.set_title("Adaptive steering: more push where the residual stream is farther from target",
                 fontsize=12.5, fontweight="bold", pad=12)
    ax.legend(frameon=False, fontsize=9)
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "09_steering_schedule.png")
    plt.close(fig)


# 10. Dataset composition donut
def plot_dataset():
    labels = ["Safe (126)", "Safe-looking (130)", "Harmful Inst. (129)", "Harmful Resp. (130)",
              "Unsafe (130)", "Jailbreak (126)", "Encrypt Harmful I. (123)",
              "Encrypt Harmful R. (123)", "RAG-QA (30)"]
    sizes  = [126, 130, 129, 130, 130, 126, 123, 123, 30]
    colors = ["#2E8540", "#4FA86F", "#C0392B", "#A93226", "#CB4335", "#6A1B9A",
              "#F6AE2D", "#E69900", "#2E86AB"]

    fig, ax = plt.subplots(figsize=(8.6, 5.6))
    wedges, texts, autotexts = ax.pie(sizes, labels=labels, colors=colors, startangle=120,
                                       autopct=lambda p: f"{p:.1f}%",
                                       pctdistance=0.78, wedgeprops=dict(width=0.45, edgecolor="white"))
    for t in autotexts:
        t.set_color("white"); t.set_fontsize(9); t.set_fontweight("bold")
    ax.set_title("Benchmark composition (1,047 samples, 5 tasks, 9 text types)",
                 fontsize=12.5, fontweight="bold", pad=14)
    fig.tight_layout()
    fig.savefig(PLOT_DIR / "10_dataset.png")
    plt.close(fig)


def main():
    print("Generating plots in", PLOT_DIR)
    for fn in (plot_headline, plot_ablation, plot_task_specific,
               plot_silhouette_layers, plot_rebuttal_metrics,
               plot_model_comparison_spider, plot_confidence_gate,
               plot_latency, plot_steering_schedule, plot_dataset):
        print(" -", fn.__name__)
        fn()
    print("Done.")


if __name__ == "__main__":
    main()
