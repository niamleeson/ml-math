#!/usr/bin/env python3
"""Generate afp/assets/m7-architecture-flowchart.png — a COMPACT decision path
showing the single most common / default architecture choice at each stage of a
ranking/CTR model, with a one-line reason and a small "upgrade when..." hint.

This is the "start here" path. (The full option-by-option comparison lives in the
lesson text.)

Matplotlib only. Run: python3 tools/gen-m7-architecture-flowchart.py
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

OUT = os.path.join(os.path.dirname(__file__), "..", "afp", "assets")
os.makedirs(OUT, exist_ok=True)
GOOD, UP = "#2e7d32", "#777"

# (stage title, color, DEFAULT choice, why, upgrade hint)
stages = [
    ("1 - FEATURE INTERACTIONS", "#4C72B0",
     "DeepFM  or  DCN-V2",
     "cheap automatic feature crosses; strong and low-tuning",
     "upgrade to AutoInt / xDeepFM for learned high-order crosses"),
    ("2 - USER HISTORY", "#55A868",
     "DIN  (attention over recent behavior)",
     "candidate-aware; a big lift from what the user did before",
     "upgrade to SIM / ETA for very long (lifelong) history"),
    ("3 - MULTIPLE OBJECTIVES", "#8172B3",
     "shared-bottom  ->  MMoE",
     "one model, several heads (click / view / lead)",
     "upgrade to MMoE, then PLE, when the tasks start to conflict"),
    ("4 - LABEL BIAS", "#C44E52",
     "position-as-feature  /  debias tower",
     "stop 'clicked just because it was on top' from fooling the model",
     "upgrade to ESMM when conversions only happen after a click"),
    ("5 - RE-RANKING  (optional)", "#CC8B3C",
     "skip at first  (rank items independently)",
     "simpler; add set-aware re-ranking only if it clearly helps",
     "upgrade to PRM + MMR / DPP for slate context & diversity"),
    ("6 - EVALUATE & SHIP", "#3C8DAA",
     "GAUC + calibration,  then an A/B test",
     "per-user ranking quality + honest probabilities before launch",
     "add off-policy eval (M24) to pre-screen risky changes"),
]

BOX_H, GAP, PAD = 1.55, 0.55, 0.35
X0, X1 = 0.4, 11.6
n = len(stages)
total = n * BOX_H + (n - 1) * GAP + 1.6   # + start banner
fig, ax = plt.subplots(figsize=(12, total * 0.74))
ax.set_xlim(0, 12); ax.set_ylim(0, total); ax.axis("off")

# start banner
y = total
ax.add_patch(FancyBboxPatch((X0, y - 0.95), X1 - X0, 0.85,
             boxstyle="round,pad=0.02,rounding_size=0.12",
             linewidth=1.8, edgecolor="#333", facecolor="#ececec", zorder=2))
ax.text(6, y - 0.38, "RANKING / CTR - THE COMMON DEFAULT PATH  (start here)",
        fontsize=14, fontweight="bold", color="#222", ha="center", va="center", zorder=3)
ax.text(6, y - 0.70, "one recommended choice per stage - flow top to bottom, skip stages you don't need",
        fontsize=10, style="italic", color="#555", ha="center", va="center", zorder=3)
y -= 0.95 + GAP

spans = []
for title, color, default, why, upgrade in stages:
    top, bot = y, y - BOX_H
    ax.add_patch(FancyBboxPatch((X0, bot), X1 - X0, BOX_H,
                 boxstyle="round,pad=0.02,rounding_size=0.10",
                 linewidth=1.8, edgecolor=color, facecolor="#fbfbfb", zorder=2))
    ax.add_patch(FancyBboxPatch((X0, bot), 0.16, BOX_H,
                 boxstyle="round,pad=0,rounding_size=0.02",
                 linewidth=0, facecolor=color, zorder=3))
    ax.text(X0 + 0.42, top - 0.34, title, fontsize=12, fontweight="bold",
            color=color, va="center", zorder=4)
    ax.text(X0 + 0.42, top - 0.80, "\u2713 " + default, fontsize=14, fontweight="bold",
            color=GOOD, va="center", zorder=4)
    ax.text(X0 + 0.72, top - 1.14, why, fontsize=10.3, color="#222", va="center", zorder=4)
    ax.text(X0 + 0.72, top - 1.42, "\u2191 " + upgrade, fontsize=9.6, style="italic",
            color=UP, va="center", zorder=4)
    spans.append((top, bot)); y = bot - GAP

for (t0, b0), (t1, b1) in zip(spans[:-1], spans[1:]):
    ax.add_patch(FancyArrowPatch((6, b0), (6, t1), arrowstyle="-|>",
                 mutation_scale=18, linewidth=2.0, color="#888", zorder=1))
ax.add_patch(FancyArrowPatch((6, total - 0.95 - 0.0), (6, spans[0][0]),
             arrowstyle="-|>", mutation_scale=18, linewidth=2.0, color="#888", zorder=1))

fig.tight_layout()
path = os.path.join(OUT, "m7-architecture-flowchart.png")
fig.savefig(path, dpi=115, bbox_inches="tight"); plt.close(fig)
print("wrote", os.path.relpath(path))
