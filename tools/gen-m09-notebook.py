#!/usr/bin/env python3
"""Generate afp/notebooks/M09-cold-start-distillation.ipynb.

A runnable, VERY beginner-friendly Colab notebook for module M9: cold-start and
the cold->warm confidence blend (priors, c_n = n/(n+k), exit criteria, pacing),
transfer learning (few target labels, learning curve, negative transfer), and
knowledge distillation (teacher->student, temperature / dark knowledge, the
quality-vs-latency tradeoff).

Granular: small steps, plain-language explanation, print logging, and a
visualization for every idea. Colab-preinstalled libraries only
(pandas/numpy/scikit-learn/matplotlib).

Run: python3 tools/gen-m09-notebook.py
"""
import json, os

cells = []
def md(t):   cells.append({"cell_type": "markdown", "metadata": {}, "source": t.strip("\n").splitlines(keepends=True)})
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
try:
    from nbfmt import format_source as _fmt_src
except Exception:
    def _fmt_src(s): return s
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": _fmt_src(s).strip("\n").splitlines(keepends=True)})

# ------------------------------------------------------------------- intro
md(r"""
# M9 · Cold-start, Transfer & Distillation — Hands-on, Step by Tiny Step

**Companion to lesson M9. Written for someone new to ML.**

Every model faces a moment when it has **almost no data** but the product still has to
decide: a brand-new ad, a first-time visitor, a just-launched surface. That's **cold-start**.
This notebook shows the safe pattern — start from a **prior**, then hand off to the
**learned model** only once the evidence is strong enough — and then two ways to *reuse*
knowledge so you need fewer labels: **transfer learning** and **distillation**.

**What you'll do (every step has an explanation, logging, and a picture):**
- **Part A · Cold-start & the confidence blend:** why an early "2 clicks / 20 impressions"
  is a lie, how the blend `p = (1-c)·prior + c·learned` with `c = n/(n+k)` bridges safely,
  the exit criteria, and why this protects ad **budgets**.
- **Part B · Transfer learning:** reuse an **old model** on a new surface and **add new
  features** it never saw — see exactly how features are added and how training/inference
  flow, why it beats training from scratch on few labels, plus **negative transfer**. Then
  **redo it all in PyTorch**, with the old model as a **frozen sub-module inside** the new one.
- **Part C · Distillation:** train a small, fast **student** to imitate a strong, slow
  **teacher** — including **temperature** and "dark knowledge," and the quality-vs-latency
  tradeoff.

We use **scikit-learn** + **matplotlib** (no installs in Colab). Run each cell with
**Shift+Enter**.
""")

# =================================================================== SETUP
md(r"""
## Step 1 · Setup

Just imports and a couple of colors. Each later step explains the ML idea before its code.
""")
code(r"""
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.metrics import roc_auc_score
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"
print("ready")
""")

md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full pipeline, here is **one tiny, hand-traceable toy example for every computing
mechanic** in this lesson — cold-start noise, priors, confidence blending, regime gates, budget
decisions, transfer features, frozen old models, distillation targets, temperature, evaluation,
latency tradeoffs, and bias copying. Each toy uses a handful of small numbers, prints every
intermediate value, includes the concrete `# ->` result in comments, asserts the key fact, and draws
exactly one picture. The at-scale versions follow in Parts A–C.
""")

md(r"""
## ✍️ Toy 1 · tiny cold-start samples make fake spikes

Cold-start starts with a warning: **a few impressions are noisy**. Here 8 brand-new ads each have
only 20 impressions. Computing raw CTR by hand shows that a couple of lucky clicks can make an ad
look "hot" even before there is enough evidence.
""")
code(r"""
toy01_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy01_clicks = np.array([0, 1, 2, 0, 1, 0, 0, 3])                 # -> 8 tiny click counts
toy01_imps = np.full(8, 20)                                      # -> [20,20,20,20,20,20,20,20]
toy01_raw_ctr = toy01_clicks / toy01_imps                        # -> [0,.05,.10,0,.05,0,0,.15]
toy01_hot = toy01_raw_ctr >= 0.10                                # -> [False,False,True,False,False,False,False,True]
toy01_hot_share = toy01_hot.mean()                               # -> 0.25
print("clicks:", toy01_clicks.tolist())
print("impressions:", toy01_imps.tolist())
print("raw CTR:", np.round(toy01_raw_ctr, 2).tolist())
print("looks >=10% CTR:", toy01_hot.tolist())
print("share that look hot:", toy01_hot_share)
assert toy01_hot_share == 0.25

plt.figure(figsize=(5.5, 3.2))
plt.bar(np.arange(8), toy01_raw_ctr, color="tomato")
plt.axhline(0.10, color="black", linestyle="--", label="10% looks hot")
plt.xlabel("new ad")
plt.ylabel("raw CTR")
plt.title("with only 20 impressions, raw CTR spikes are easy")
plt.legend()
plt.show()
""")
md("▶ What you'll see: two of 8 tiny samples look like 10–15% CTR, so raw early rates can "
   "overreact before the ad has earned trust.")

md(r"""
## ✍️ Toy 2 · metadata prior for a brand-new item

A prior uses **similar old items** when the new item has no history. Here the only metadata feature
is a category ID. We aggregate old clicks/impressions by category, then assign a prior to a new item
from its category.
""")
code(r"""
toy02_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy02_cat = np.array([0, 0, 1, 1, 2, 2])                          # -> metadata category per old item
toy02_clicks = np.array([1, 2, 1, 3, 0, 1])                       # -> old clicks
toy02_imps = np.array([20, 20, 20, 20, 20, 20])                   # -> old impressions
toy02_cats = np.array([0, 1, 2])                                  # -> all category IDs
toy02_prior0 = toy02_clicks[toy02_cat == 0].sum() / toy02_imps[toy02_cat == 0].sum()   # -> 0.075
toy02_prior1 = toy02_clicks[toy02_cat == 1].sum() / toy02_imps[toy02_cat == 1].sum()   # -> 0.100
toy02_prior2 = toy02_clicks[toy02_cat == 2].sum() / toy02_imps[toy02_cat == 2].sum()   # -> 0.025
toy02_priors = np.array([toy02_prior0, toy02_prior1, toy02_prior2])                    # -> [.075,.100,.025]
toy02_global = toy02_clicks.sum() / toy02_imps.sum()                  # -> 0.0667
toy02_new_cat = 1                                                      # -> new item metadata says category 1
toy02_new_prior = toy02_priors[toy02_new_cat]                          # -> 0.100
print("old categories:", toy02_cat.tolist())
print("old clicks:", toy02_clicks.tolist())
print("old impressions:", toy02_imps.tolist())
print("category priors:", np.round(toy02_priors, 3).tolist())
print("global prior:", round(float(toy02_global), 3))
print("new item's category:", toy02_new_cat)
print("new item's starting prior:", round(float(toy02_new_prior), 3))
assert np.isclose(toy02_new_prior, 0.10)

plt.figure(figsize=(5.2, 3.2))
plt.bar(["cat 0", "cat 1", "cat 2"], toy02_priors, color="steelblue")
plt.axhline(toy02_global, color="black", linestyle="--", label="global prior")
plt.ylabel("prior CTR")
plt.title("metadata chooses the category prior for a new item")
plt.legend()
plt.show()
""")
md("▶ What you'll see: category 1 has prior 0.10, so a brand-new category-1 item starts there "
   "instead of trusting its own nonexistent history.")

md(r"""
## ✍️ Toy 3 · confidence dial `c_n = n/(n+k)`

The confidence dial is the **decision rule** for how much evidence to trust. With small `n`, `c_n`
is near 0; as impressions grow, it moves toward 1. The constant `k` controls how cautious the
handoff is.
""")
code(r"""
toy03_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy03_n = np.array([0, 20, 50, 100, 500, 1000])                   # -> evidence sizes
toy03_k = 1000                                                    # -> cautious handoff constant
toy03_den = toy03_n + toy03_k                                     # -> [1000,1020,1050,1100,1500,2000]
toy03_c = toy03_n / toy03_den                                     # -> [0,.0196,.0476,.0909,.3333,.5]
print("n:", toy03_n.tolist())
print("n + k:", toy03_den.tolist())
print("c_n:", np.round(toy03_c, 4).tolist())
print("at n=20, trust own data only:", round(float(toy03_c[1]), 4))
print("at n=1000, trust own data:", round(float(toy03_c[-1]), 4))
assert np.isclose(toy03_c[-1], 0.5)

plt.figure(figsize=(5.5, 3.2))
plt.plot(toy03_n, toy03_c, "o-", color="seagreen")
plt.xlabel("impressions n")
plt.ylabel("confidence c_n")
plt.title("confidence grows slowly when k=1000")
plt.show()
""")
md("▶ What you'll see: 20 impressions produce `c_n≈0.02`, so early evidence barely moves the "
   "score away from the prior.")

md(r"""
## ✍️ Toy 4 · blend prior with learned rate

The score is the weighted average `p = (1-c)·prior + c·learned`. This toy applies the formula to 6
ads, showing exactly how a high but tiny learned rate gets pulled back toward the prior.
""")
code(r"""
toy04_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy04_prior = 0.01                                                # -> safe category prior
toy04_learned = np.array([0.10, 0.05, 0.00, 0.02, 0.12, 0.08])     # -> raw/learned CTRs
toy04_n = np.array([20, 20, 20, 100, 500, 1000])                  # -> evidence sizes
toy04_k = 1000                                                    # -> cautious handoff constant
toy04_c = toy04_n / (toy04_n + toy04_k)                           # -> [.0196,.0196,.0196,.0909,.3333,.5]
toy04_prior_part = (1 - toy04_c) * toy04_prior                    # -> prior contribution
toy04_learned_part = toy04_c * toy04_learned                      # -> learned contribution
toy04_blend = toy04_prior_part + toy04_learned_part               # -> [.0118,.0108,.0098,.0109,.0467,.045]
print("prior:", toy04_prior)
print("learned:", toy04_learned.tolist())
print("n:", toy04_n.tolist())
print("c:", np.round(toy04_c, 4).tolist())
print("prior contribution:", np.round(toy04_prior_part, 4).tolist())
print("learned contribution:", np.round(toy04_learned_part, 4).tolist())
print("blended CTR:", np.round(toy04_blend, 4).tolist())
assert np.isclose(toy04_blend[0], 0.011764705882352941)

plt.figure(figsize=(5.8, 3.2))
toy04_x = np.arange(6)
plt.bar(toy04_x - 0.18, toy04_learned, 0.36, color="tomato", label="learned/raw")
plt.bar(toy04_x + 0.18, toy04_blend, 0.36, color="seagreen", label="blend")
plt.axhline(toy04_prior, color="black", linestyle="--", label="prior")
plt.xlabel("ad")
plt.ylabel("CTR")
plt.title("blend pulls low-evidence rates toward the prior")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the 10% rate at n=20 becomes about 1.18%, while high-evidence rows move "
   "farther away from the prior.")

md(r"""
## ✍️ Toy 5 · running cold-to-warm handoff

For one item, recompute the cumulative raw rate, confidence, and blend after every impression. This
is the moving handoff: raw data is jumpy, but the blended estimate changes smoothly.
""")
code(r"""
toy05_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy05_clicks = np.array([1, 0, 0, 1, 0, 0, 0, 1, 0, 0])            # -> 10 impressions
toy05_imps = np.arange(1, 11)                                     # -> [1,2,3,4,5,6,7,8,9,10]
toy05_cum_clicks = np.cumsum(toy05_clicks)                        # -> [1,1,1,2,2,2,2,3,3,3]
toy05_raw = toy05_cum_clicks / toy05_imps                         # -> running CTR
toy05_prior = 0.10                                                # -> starting prior
toy05_k = 4                                                       # -> tiny k for a hand-sized demo
toy05_c = toy05_imps / (toy05_imps + toy05_k)                     # -> [.2,.333,.429,.5,.556,.6,.636,.667,.692,.714]
toy05_blend = (1 - toy05_c) * toy05_prior + toy05_c * toy05_raw   # -> [.28,.233,.2,.3,.267,.24,.218,.283,.262,.243]
print("click stream:", toy05_clicks.tolist())
print("cumulative clicks:", toy05_cum_clicks.tolist())
print("raw running CTR:", np.round(toy05_raw, 3).tolist())
print("confidence:", np.round(toy05_c, 3).tolist())
print("blend:", np.round(toy05_blend, 3).tolist())
assert np.isclose(toy05_blend[-1], 0.24285714285714285)

plt.figure(figsize=(6, 3.2))
plt.plot(toy05_imps, toy05_raw, "o-", color="tomato", label="raw")
plt.plot(toy05_imps, toy05_blend, "o-", color="seagreen", label="blend")
plt.axhline(toy05_prior, color="black", linestyle="--", label="prior")
plt.xlabel("impressions seen")
plt.ylabel("CTR estimate")
plt.title("running handoff: blend smooths the jumpy raw rate")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the raw CTR starts at 100%, but the blend starts much closer to the prior "
   "and moves gradually as evidence accumulates.")

md(r"""
## ✍️ Toy 6 · regime gates: cold, blended, warm

The handoff should be logged with a regime label. A simple gate says **warm** only after enough
impressions and clicks; otherwise the row is cold or blended.
""")
code(r"""
toy06_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy06_imps = np.array([20, 80, 300, 900, 1000, 1200])              # -> candidate histories
toy06_clicks = np.array([1, 2, 8, 19, 18, 25])                    # -> click counts
toy06_enough_imps = toy06_imps >= 1000                            # -> [False,False,False,False,True,True]
toy06_enough_clicks = toy06_clicks >= 20                          # -> [False,False,False,False,False,True]
toy06_is_warm = toy06_enough_imps & toy06_enough_clicks           # -> [False,False,False,False,False,True]
toy06_is_blended = (toy06_imps >= 50) & (~toy06_is_warm)          # -> [False,True,True,True,True,False]
toy06_regime = np.where(toy06_is_warm, "warm", np.where(toy06_is_blended, "blended", "cold"))
toy06_first_warm = int(np.where(toy06_is_warm)[0][0])             # -> 5
print("impressions:", toy06_imps.tolist())
print("clicks:", toy06_clicks.tolist())
print("enough impressions:", toy06_enough_imps.tolist())
print("enough clicks:", toy06_enough_clicks.tolist())
print("warm mask:", toy06_is_warm.tolist())
print("regimes:", toy06_regime.tolist())
print("first warm row index:", toy06_first_warm)
assert toy06_regime.tolist() == ["cold", "blended", "blended", "blended", "blended", "warm"]

plt.figure(figsize=(5.8, 3.4))
toy06_color = np.where(toy06_is_warm, "seagreen", np.where(toy06_is_blended, "orange", "tomato"))
plt.scatter(toy06_imps, toy06_clicks, s=110, c=toy06_color)
plt.axvline(1000, color="black", linestyle="--", label="1000 imps")
plt.axhline(20, color="gray", linestyle="--", label="20 clicks")
plt.xlabel("impressions")
plt.ylabel("clicks")
plt.title("warm only after both gate thresholds pass")
plt.legend()
plt.show()
""")
md("▶ What you'll see: only the last row passes both gates, so the system can log exactly where "
   "the cold→warm handoff happened.")

md(r"""
## ✍️ Toy 7 · budget uses blended CTR, not raw spikes

Pacing often turns CTR into a value score. If it uses raw CTR, a tiny lucky spike wins. If it uses
the blend, the proven ad with real evidence wins.
""")
code(r"""
toy07_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy07_clicks = np.array([3, 2, 0, 25, 4, 1])                      # -> clicks for 6 ads
toy07_imps = np.array([20, 100, 20, 1500, 80, 20])                # -> impressions
toy07_bid = np.ones(6)                                            # -> same bid for hand tracing
toy07_prior = 0.01                                                # -> safe prior CTR
toy07_k = 1000                                                    # -> cautious handoff
toy07_raw = toy07_clicks / toy07_imps                             # -> [.15,.02,0,.0167,.05,.05]
toy07_c = toy07_imps / (toy07_imps + toy07_k)                     # -> [.0196,.0909,.0196,.6,.0741,.0196]
toy07_blend = (1 - toy07_c) * toy07_prior + toy07_c * toy07_raw   # -> [.0127,.0109,.0098,.014,.013,.0108]
toy07_raw_score = toy07_raw * toy07_bid                           # -> raw value scores
toy07_blend_score = toy07_blend * toy07_bid                       # -> blended value scores
toy07_raw_winner = int(np.argmax(toy07_raw_score))                # -> 0
toy07_blend_winner = int(np.argmax(toy07_blend_score))            # -> 3
print("clicks:", toy07_clicks.tolist())
print("impressions:", toy07_imps.tolist())
print("raw CTR:", np.round(toy07_raw, 4).tolist())
print("confidence:", np.round(toy07_c, 4).tolist())
print("blended CTR:", np.round(toy07_blend, 4).tolist())
print("raw-score winner:", toy07_raw_winner)
print("blend-score winner:", toy07_blend_winner)
assert toy07_raw_winner == 0 and toy07_blend_winner == 3

plt.figure(figsize=(6, 3.2))
toy07_x = np.arange(6)
plt.bar(toy07_x - 0.18, toy07_raw_score, 0.36, color="tomato", label="raw")
plt.bar(toy07_x + 0.18, toy07_blend_score, 0.36, color="seagreen", label="blended")
plt.xlabel("ad")
plt.ylabel("CTR × bid")
plt.title("budget decision flips from lucky spike to proven ad")
plt.legend()
plt.show()
""")
md("▶ What you'll see: raw ranking picks ad 0 (3/20), while blended ranking picks ad 3 "
   "(25/1500) because it has enough evidence.")

md(r"""
## ✍️ Toy 8 · old model squashes shared features into one probability

Transfer begins with an old model that already knows the shared features. A linear model computes
`dot(features, weights) + bias`, then a sigmoid turns that logit into one probability.
""")
code(r"""
toy08_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy08_X = np.array([[1, 0, 1], [0, 1, 1], [1, 1, 0], [2, 0, 1], [0, 2, 1], [1, 0, 0]], float)
toy08_w = np.array([0.8, -0.4, 0.6])                              # -> old shared-feature weights
toy08_b = -0.2                                                    # -> old model bias
toy08_dot = toy08_X @ toy08_w                                     # -> [1.4,.2,.4,2.2,-.2,.8]
toy08_logit = toy08_dot + toy08_b                                 # -> [1.2,0,.2,2,-.4,.6]
toy08_prob = 1 / (1 + np.exp(-toy08_logit))                       # -> [.769,.5,.55,.881,.401,.646]
print("shared feature table:\n", toy08_X)
print("old weights:", toy08_w.tolist())
print("old bias:", toy08_b)
print("dot products:", np.round(toy08_dot, 3).tolist())
print("logits:", np.round(toy08_logit, 3).tolist())
print("old-model probabilities:", np.round(toy08_prob, 3).tolist())
assert np.isclose(toy08_prob[0], 0.7685247834990175)

plt.figure(figsize=(5.5, 3.2))
plt.bar(np.arange(6), toy08_prob, color="slateblue")
plt.xlabel("impression")
plt.ylabel("old-model probability")
plt.title("3 shared features become 1 old-model score")
plt.show()
""")
md("▶ What you'll see: every 3-number row becomes one logit and one probability — the old model's "
   "compressed opinion.")

md(r"""
## ✍️ Toy 9 · old model is blind to new features

If two impressions have the same shared features, the old model gives the same score even when new
surface features differ. That is why transfer must add new columns instead of serving the old model
as-is.
""")
code(r"""
toy09_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy09_shared = np.array([[1, 0, 1], [1, 0, 1], [0, 1, 1], [0, 1, 1], [1, 1, 0], [1, 1, 0]], float)
toy09_new = np.array([[0, 0], [1, 0], [0, 0], [0, 1], [0, 0], [1, 1]], float)
toy09_w = np.array([0.8, -0.4, 0.6])                              # -> old shared-feature weights
toy09_b = -0.2                                                    # -> old model bias
toy09_logit = toy09_shared @ toy09_w + toy09_b                    # -> [1.2,1.2,0,0,.2,.2]
toy09_prob = 1 / (1 + np.exp(-toy09_logit))                       # -> [.769,.769,.5,.5,.55,.55]
toy09_pair_same = np.array([toy09_prob[0] == toy09_prob[1],
                            toy09_prob[2] == toy09_prob[3],
                            toy09_prob[4] == toy09_prob[5]])      # -> [True,True,True]
print("shared features:\n", toy09_shared)
print("new features [is_video, is_weekend]:\n", toy09_new)
print("old logits:", np.round(toy09_logit, 3).tolist())
print("old probabilities:", np.round(toy09_prob, 3).tolist())
print("same score within same-shared pairs:", toy09_pair_same.tolist())
assert toy09_pair_same.all()

plt.figure(figsize=(5.6, 3.2))
plt.scatter(toy09_new[:, 0], toy09_prob, s=120, c=toy09_new[:, 1], cmap="coolwarm")
plt.xlabel("is_video (new feature)")
plt.ylabel("old-model probability")
plt.title("old score does not change when only new features change")
plt.show()
""")
md("▶ What you'll see: paired rows with different new features get identical old-model scores, "
   "proving the old model has no slot for the new signal.")

md(r"""
## ✍️ Toy 10 · adding features means gluing columns

The new model input is just a table: `[old_pred | is_video | is_weekend]`. `column_stack` makes the
three-column table that the transfer model can train on.
""")
code(r"""
toy10_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy10_old_pred = np.array([0.73, 0.45, 0.62, 0.81, 0.33, 0.58])   # -> old model's one-column opinion
toy10_new_feats = np.array([[1, 0], [0, 0], [1, 1], [0, 1], [1, 0], [0, 1]], float)
toy10_old_col = toy10_old_pred.reshape(-1, 1)                    # -> shape (6,1)
toy10_glued = np.column_stack([toy10_old_col, toy10_new_feats])   # -> shape (6,3)
print("old_pred column shape:", toy10_old_col.shape)
print("new feature columns shape:", toy10_new_feats.shape)
print("glued table shape:", toy10_glued.shape)
print("glued table [old_pred, is_video, is_weekend]:\n", toy10_glued)
assert toy10_glued.shape == (6, 3)

plt.figure(figsize=(5, 3.4))
plt.imshow(toy10_glued, aspect="auto", cmap="viridis")
plt.colorbar(label="value")
plt.xticks([0, 1, 2], ["old_pred", "video", "weekend"])
plt.yticks(np.arange(6), [f"row {i}" for i in range(6)])
plt.title("feature addition = side-by-side columns")
plt.show()
""")
md("▶ What you'll see: a `(6,1)` old-score column and `(6,2)` new-feature table become one "
   "`(6,3)` transfer input.")

md(r"""
## ✍️ Toy 11 · one gradient step learns one weight per column

A logistic head learns **one weight per glued column**. Starting from zeros, compute probabilities,
errors, gradients, and one update by hand.
""")
code(r"""
toy11_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy11_X = np.array([[0.8, 1, 0], [0.7, 0, 0], [0.3, 0, 1], [0.6, 1, 0], [0.2, 0, 1], [0.4, 0, 0]], float)
toy11_y = np.array([1, 1, 0, 1, 0, 0], float)                     # -> labels
toy11_w = np.array([0.0, 0.0, 0.0])                               # -> start with 3 zero weights
toy11_b = 0.0                                                     # -> zero bias
toy11_logit = toy11_X @ toy11_w + toy11_b                         # -> [0,0,0,0,0,0]
toy11_prob = 1 / (1 + np.exp(-toy11_logit))                       # -> [.5,.5,.5,.5,.5,.5]
toy11_error = toy11_prob - toy11_y                                # -> [-.5,-.5,.5,-.5,.5,.5]
toy11_grad_w = toy11_X.T @ toy11_error / len(toy11_y)             # -> [-.1,-.1667,.1667]
toy11_grad_b = toy11_error.mean()                                 # -> 0
toy11_lr = 1.0                                                    # -> one simple learning-rate step
toy11_w_after = toy11_w - toy11_lr * toy11_grad_w                 # -> [.1,.1667,-.1667]
toy11_b_after = toy11_b - toy11_lr * toy11_grad_b                 # -> 0
print("X [old_pred, video, weekend]:\n", toy11_X)
print("labels:", toy11_y.tolist())
print("initial logits:", toy11_logit.tolist())
print("initial probabilities:", toy11_prob.tolist())
print("errors prob-label:", toy11_error.tolist())
print("weight gradient:", np.round(toy11_grad_w, 4).tolist())
print("bias gradient:", round(float(toy11_grad_b), 4))
print("updated weights:", np.round(toy11_w_after, 4).tolist())
print("updated bias:", round(float(toy11_b_after), 4))
assert toy11_w_after[1] > 0 and toy11_w_after[2] < 0

plt.figure(figsize=(5.4, 3.2))
plt.bar(["old_pred", "video", "weekend"], toy11_w_after, color=["slateblue", "seagreen", "tomato"])
plt.axhline(0, color="black", linewidth=0.8)
plt.ylabel("weight after one update")
plt.title("one learned weight per glued column")
plt.show()
""")
md("▶ What you'll see: the video weight moves positive, the weekend weight moves negative, and "
   "the old-pred column gets its own learned weight too.")

md(r"""
## ✍️ Toy 12 · transfer inference end to end

Inference chains the old model and the new head: shared features → old probability → glue with new
features → weighted sum → sigmoid. This toy traces all 6 rows with small numbers.
""")
code(r"""
toy12_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy12_shared = np.array([[1, 0, 2], [0, 1, 1], [2, 0, 1], [1, 1, 0], [0, 2, 1], [1, 0, 0]], float)
toy12_old_w = np.array([0.7, -0.2, 0.5])                          # -> old shared weights
toy12_old_b = -0.1                                                # -> old bias
toy12_old_dot = toy12_shared @ toy12_old_w                        # -> [1.7,.3,1.9,.5,.1,.7]
toy12_old_logit = toy12_old_dot + toy12_old_b                     # -> [1.6,.2,1.8,.4,0,.6]
toy12_old_pred = 1 / (1 + np.exp(-toy12_old_logit))               # -> [.832,.55,.858,.599,.5,.646]
toy12_new = np.array([[1, 0], [0, 1], [1, 1], [0, 0], [1, 0], [0, 1]], float)
toy12_glued = np.column_stack([toy12_old_pred, toy12_new])        # -> 6 rows x 3 columns
toy12_head_w = np.array([1.5, 0.6, -0.4])                         # -> new-head weights
toy12_head_b = -0.8                                               # -> new-head bias
toy12_terms = toy12_glued * toy12_head_w                          # -> per-feature contributions
toy12_score = toy12_terms.sum(axis=1) + toy12_head_b              # -> [1.048,-.375,.687,.098,.55,-.232]
toy12_prob = 1 / (1 + np.exp(-toy12_score))                       # -> [.74,.407,.665,.524,.634,.442]
print("shared features:\n", toy12_shared)
print("old dot:", np.round(toy12_old_dot, 3).tolist())
print("old logit:", np.round(toy12_old_logit, 3).tolist())
print("old probability:", np.round(toy12_old_pred, 3).tolist())
print("new features:\n", toy12_new)
print("glued [old_pred, video, weekend]:\n", np.round(toy12_glued, 3))
print("head contribution terms:\n", np.round(toy12_terms, 3))
print("final score:", np.round(toy12_score, 3).tolist())
print("final probability:", np.round(toy12_prob, 3).tolist())
assert np.isclose(toy12_prob[0], 0.7403959601228155)

plt.figure(figsize=(5.8, 3.2))
plt.plot(np.arange(6), toy12_old_pred, "o-", color="gray", label="old probability")
plt.plot(np.arange(6), toy12_prob, "o-", color="seagreen", label="transfer probability")
plt.xlabel("impression")
plt.ylabel("probability")
plt.title("new head adjusts the old model with new features")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the transfer probability follows the old score but shifts up or down when "
   "`is_video` or `is_weekend` contributes.")

md(r"""
## ✍️ Toy 13 · evaluate a cold slice with AUC by hand

To compare scratch, old-only, and transfer on a cold slice, AUC counts positive-negative pairs:
what fraction put the positive above the negative?
""")
code(r"""
toy13_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy13_y = np.array([1, 1, 1, 0, 0, 0])                            # -> 3 positives, 3 negatives
toy13_scratch = np.array([0.70, 0.30, 0.45, 0.60, 0.20, 0.40])    # -> scratch scores
toy13_old = np.array([0.60, 0.55, 0.40, 0.50, 0.45, 0.35])        # -> old-only scores
toy13_transfer = np.array([0.80, 0.70, 0.65, 0.40, 0.35, 0.30])   # -> transfer scores
toy13_pos_transfer = toy13_transfer[toy13_y == 1]                 # -> [.8,.7,.65]
toy13_neg_transfer = toy13_transfer[toy13_y == 0]                 # -> [.4,.35,.3]
toy13_pair_transfer = (toy13_pos_transfer[:, None] > toy13_neg_transfer[None, :]).astype(float)
toy13_auc_transfer = toy13_pair_transfer.mean()                  # -> 1.0
toy13_auc_scratch = ((toy13_scratch[toy13_y == 1, None] > toy13_scratch[toy13_y == 0][None, :]).astype(float)).mean()
toy13_auc_old = ((toy13_old[toy13_y == 1, None] > toy13_old[toy13_y == 0][None, :]).astype(float)).mean()
toy13_aucs = np.array([toy13_auc_scratch, toy13_auc_old, toy13_auc_transfer])   # -> [.667,.778,1.0]
print("labels:", toy13_y.tolist())
print("scratch scores:", toy13_scratch.tolist())
print("old-only scores:", toy13_old.tolist())
print("transfer scores:", toy13_transfer.tolist())
print("transfer positive scores:", toy13_pos_transfer.tolist())
print("transfer negative scores:", toy13_neg_transfer.tolist())
print("transfer pair wins:\n", toy13_pair_transfer)
print("AUCs [scratch, old-only, transfer]:", np.round(toy13_aucs, 3).tolist())
assert toy13_auc_transfer == 1.0 and toy13_auc_transfer > toy13_auc_old > toy13_auc_scratch

plt.figure(figsize=(5.4, 3.2))
plt.bar(["scratch", "old-only", "transfer"], toy13_aucs, color=["tomato", "gray", "seagreen"])
plt.ylim(0, 1.05)
plt.ylabel("AUC on cold slice")
plt.title("transfer ranks the cold slice best")
plt.show()
""")
md("▶ What you'll see: transfer wins all 9 positive-negative pairs, while scratch and old-only "
   "miss some pairs.")

md(r"""
## ✍️ Toy 14 · negative transfer when the old model is wrong

Reusing a source model is a hypothesis. If its scores are backwards for the new task, the transfer
feature can hurt more than training from scratch.
""")
code(r"""
toy14_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy14_y = np.array([1, 1, 1, 0, 0, 0])                            # -> 3 positives, 3 negatives
toy14_scratch = np.array([0.55, 0.50, 0.45, 0.48, 0.44, 0.42])    # -> weak but mostly right
toy14_good = np.array([0.82, 0.75, 0.68, 0.35, 0.30, 0.25])       # -> related old model helps
toy14_wrong = np.array([0.20, 0.30, 0.35, 0.80, 0.70, 0.60])      # -> mismatched old model hurts
toy14_auc_scratch = ((toy14_scratch[toy14_y == 1, None] > toy14_scratch[toy14_y == 0][None, :]).astype(float)).mean()
toy14_auc_good = ((toy14_good[toy14_y == 1, None] > toy14_good[toy14_y == 0][None, :]).astype(float)).mean()
toy14_auc_wrong = ((toy14_wrong[toy14_y == 1, None] > toy14_wrong[toy14_y == 0][None, :]).astype(float)).mean()
toy14_aucs = np.array([toy14_auc_scratch, toy14_auc_good, toy14_auc_wrong])      # -> [.889,1.0,0.0]
print("labels:", toy14_y.tolist())
print("scratch scores:", toy14_scratch.tolist())
print("good-transfer scores:", toy14_good.tolist())
print("wrong-transfer scores:", toy14_wrong.tolist())
print("AUCs [scratch, good transfer, wrong transfer]:", np.round(toy14_aucs, 3).tolist())
assert toy14_auc_wrong < toy14_auc_scratch < toy14_auc_good

plt.figure(figsize=(5.6, 3.2))
plt.bar(["scratch", "good\ntransfer", "wrong\ntransfer"], toy14_aucs, color=["gray", "seagreen", "tomato"])
plt.ylim(0, 1.05)
plt.ylabel("AUC")
plt.title("mismatched source model causes negative transfer")
plt.show()
""")
md("▶ What you'll see: the good source reaches AUC 1.0, but the wrong source ranks every pair "
   "backwards and falls below scratch.")

md(r"""
## ✍️ Toy 15 · old net logit and BCE-with-logits loss

The PyTorch old net is also a linear logit. `BCEWithLogitsLoss` means the model returns raw logits,
and the loss applies the sigmoid internally in a stable way.
""")
code(r"""
toy15_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy15_X = np.array([[1, 0, 1], [0, 1, 1], [1, 1, 0], [2, 0, 1], [0, 2, 1], [1, 0, 0]], float)
toy15_w = np.array([0.4, -0.3, 0.2])                              # -> old-net weights
toy15_b = -0.1                                                    # -> old-net bias
toy15_y = np.array([1, 0, 1, 1, 0, 0], float)                     # -> labels
toy15_logit = toy15_X @ toy15_w + toy15_b                         # -> [.5,-.2,0,.9,-.5,.3]
toy15_prob = 1 / (1 + np.exp(-toy15_logit))                       # -> [.622,.45,.5,.711,.378,.574]
toy15_bce = np.logaddexp(0, toy15_logit) - toy15_y * toy15_logit  # -> stable BCE per row
toy15_loss = toy15_bce.mean()                                     # -> .5725
print("features:\n", toy15_X)
print("weights:", toy15_w.tolist())
print("bias:", toy15_b)
print("labels:", toy15_y.tolist())
print("logits:", np.round(toy15_logit, 3).tolist())
print("sigmoid probabilities:", np.round(toy15_prob, 3).tolist())
print("BCE terms:", np.round(toy15_bce, 3).tolist())
print("mean BCE loss:", round(float(toy15_loss), 4))
assert np.isclose(toy15_loss, 0.572491522917061)

plt.figure(figsize=(5.6, 3.2))
plt.bar(np.arange(6), toy15_bce, color="slateblue")
plt.xlabel("training row")
plt.ylabel("BCE loss")
plt.title("BCEWithLogitsLoss applies sigmoid inside the loss")
plt.show()
""")
md("▶ What you'll see: logits are raw scores; the printed probabilities are for interpretation, "
   "while the stable BCE formula computes the loss directly from logits.")

md(r"""
## ✍️ Toy 16 · freezing means old parameters do not update

Freezing sets old parameters to "do not train." Even if an old gradient exists, the update leaves
old weights unchanged while trainable head weights move.
""")
code(r"""
toy16_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy16_old_w = np.array([0.50, -0.50, 0.25])                       # -> frozen old weights before
toy16_old_grad = np.array([0.30, 0.20, -0.40])                    # -> gradient that would have moved them
toy16_head_w = np.array([0.10, 0.20, -0.10])                      # -> trainable head weights before
toy16_head_grad = np.array([-0.20, 0.10, 0.30])                   # -> head gradient
toy16_lr = 0.50                                                   # -> learning rate
toy16_old_after = toy16_old_w.copy()                              # -> unchanged because frozen
toy16_head_after = toy16_head_w - toy16_lr * toy16_head_grad      # -> [.2,.15,-.25]
print("old weights before:", toy16_old_w.tolist())
print("old gradient:", toy16_old_grad.tolist())
print("old weights after frozen update:", toy16_old_after.tolist())
print("head weights before:", toy16_head_w.tolist())
print("head gradient:", toy16_head_grad.tolist())
print("head weights after update:", toy16_head_after.tolist())
assert np.allclose(toy16_old_after, toy16_old_w) and not np.allclose(toy16_head_after, toy16_head_w)

plt.figure(figsize=(5.8, 3.2))
toy16_x = np.arange(3)
plt.bar(toy16_x - 0.18, toy16_head_w, 0.36, color="gray", label="head before")
plt.bar(toy16_x + 0.18, toy16_head_after, 0.36, color="seagreen", label="head after")
plt.axhline(0, color="black", linewidth=0.8)
plt.xticks(toy16_x, ["w0", "w1", "w2"])
plt.ylabel("head weight")
plt.title("head moves; frozen old weights do not")
plt.legend()
plt.show()
""")
md("▶ What you'll see: old weights are identical before/after, while the head weights change by "
   "`-lr × gradient`.")

md(r"""
## ✍️ Toy 17 · composed net forward pass

In the PyTorch transfer version, the new model **contains** the old model. The forward pass computes
an old logit, glues it to two new features, then applies a head.
""")
code(r"""
toy17_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy17_shared = np.array([[1, 0], [0, 1], [1, 1], [2, 0], [0, 2], [2, 1]], float)
toy17_new = np.array([[1, 0], [0, 1], [1, 1], [0, 0], [1, 0], [0, 1]], float)
toy17_old_w = np.array([0.9, -0.4])                               # -> old submodule weights
toy17_old_b = 0.1                                                 # -> old submodule bias
toy17_old_logit = toy17_shared @ toy17_old_w + toy17_old_b        # -> [1,-.3,.6,1.9,-.7,1.5]
toy17_old_prob = 1 / (1 + np.exp(-toy17_old_logit))               # -> [.731,.426,.646,.87,.332,.818]
toy17_z = np.column_stack([toy17_old_logit, toy17_new])           # -> [old_logit, is_video, is_weekend]
toy17_head_w = np.array([0.8, 0.5, -0.3])                         # -> head weights
toy17_head_b = -0.2                                               # -> head bias
toy17_final_logit = toy17_z @ toy17_head_w + toy17_head_b         # -> [1.1,-.74,.48,1.32,-.26,.7]
toy17_final_prob = 1 / (1 + np.exp(-toy17_final_logit))           # -> [.75,.323,.618,.789,.435,.668]
print("shared features:\n", toy17_shared)
print("new features:\n", toy17_new)
print("old logits:", np.round(toy17_old_logit, 3).tolist())
print("old probabilities:", np.round(toy17_old_prob, 3).tolist())
print("head input z:\n", np.round(toy17_z, 3))
print("final logits:", np.round(toy17_final_logit, 3).tolist())
print("final probabilities:", np.round(toy17_final_prob, 3).tolist())
assert np.isclose(toy17_final_prob[0], 0.7502601055951177)

plt.figure(figsize=(5.8, 3.2))
plt.plot(np.arange(6), toy17_old_prob, "o-", color="gray", label="old submodule prob")
plt.plot(np.arange(6), toy17_final_prob, "o-", color="seagreen", label="composed net prob")
plt.xlabel("impression")
plt.ylabel("probability")
plt.title("old submodule + head = composed transfer net")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the old net produces one logit per row, the head sees that logit plus two "
   "new features, and final probabilities differ from old-only probabilities.")

md(r"""
## ✍️ Toy 18 · training only the head

Once the old net is frozen, optimization should use only head parameters. This toy computes one head
gradient step and proves the old weights stayed unchanged.
""")
code(r"""
toy18_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy18_z = np.array([[0.9, 1, 0], [-0.3, 0, 1], [0.6, 1, 1], [1.2, 0, 0], [-0.7, 1, 0], [0.1, 0, 1]], float)
toy18_y = np.array([1, 0, 1, 1, 0, 0], float)                     # -> labels
toy18_old_w_before = np.array([0.9, -0.4])                        # -> frozen old weights
toy18_head_w = np.array([0.0, 0.0, 0.0])                          # -> trainable head starts at zero
toy18_head_b = 0.0                                                # -> trainable head bias
toy18_logit = toy18_z @ toy18_head_w + toy18_head_b               # -> [0,0,0,0,0,0]
toy18_prob = 1 / (1 + np.exp(-toy18_logit))                       # -> [.5,.5,.5,.5,.5,.5]
toy18_error = toy18_prob - toy18_y                                # -> [-.5,.5,-.5,-.5,.5,.5]
toy18_grad_w = toy18_z.T @ toy18_error / len(toy18_y)             # -> [-.3,-.0833,.0833]
toy18_grad_b = toy18_error.mean()                                 # -> 0
toy18_head_after = toy18_head_w - toy18_grad_w                    # -> [.3,.0833,-.0833]
toy18_old_w_after = toy18_old_w_before.copy()                     # -> unchanged
print("head input z:\n", toy18_z)
print("labels:", toy18_y.tolist())
print("head probabilities before update:", toy18_prob.tolist())
print("head errors:", toy18_error.tolist())
print("head gradient:", np.round(toy18_grad_w, 4).tolist())
print("head bias gradient:", round(float(toy18_grad_b), 4))
print("head weights after update:", np.round(toy18_head_after, 4).tolist())
print("old weights before:", toy18_old_w_before.tolist())
print("old weights after:", toy18_old_w_after.tolist())
assert np.allclose(toy18_old_w_before, toy18_old_w_after) and toy18_head_after[0] > 0

plt.figure(figsize=(5.4, 3.2))
plt.bar(["old_logit", "video", "weekend"], toy18_head_after, color=["slateblue", "seagreen", "tomato"])
plt.axhline(0, color="black", linewidth=0.8)
plt.ylabel("head weight after one update")
plt.title("only the head receives the update")
plt.show()
""")
md("▶ What you'll see: the head learns weights from the composed input, while the printed old "
   "weights are unchanged.")

md(r"""
## ✍️ Toy 19 · scratch net vs transfer net comparison

The PyTorch section repeats the same evaluation idea: score the same cold slice with a scratch net,
an old-only net, and a transfer net, then compare AUC.
""")
code(r"""
toy19_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy19_y = np.array([1, 1, 1, 0, 0, 0])                            # -> 3 positives, 3 negatives
toy19_scratch = np.array([0.62, 0.48, 0.40, 0.58, 0.35, 0.30])    # -> scratch-net scores
toy19_oldonly = np.array([0.70, 0.60, 0.45, 0.50, 0.42, 0.36])    # -> old-only scores
toy19_transfer = np.array([0.78, 0.70, 0.66, 0.44, 0.38, 0.25])   # -> transfer-net scores
toy19_auc_scratch = ((toy19_scratch[toy19_y == 1, None] > toy19_scratch[toy19_y == 0][None, :]).astype(float)).mean()
toy19_auc_oldonly = ((toy19_oldonly[toy19_y == 1, None] > toy19_oldonly[toy19_y == 0][None, :]).astype(float)).mean()
toy19_auc_transfer = ((toy19_transfer[toy19_y == 1, None] > toy19_transfer[toy19_y == 0][None, :]).astype(float)).mean()
toy19_aucs = np.array([toy19_auc_scratch, toy19_auc_oldonly, toy19_auc_transfer])       # -> [.778,.889,1.0]
print("labels:", toy19_y.tolist())
print("scratch-net scores:", toy19_scratch.tolist())
print("old-only scores:", toy19_oldonly.tolist())
print("transfer-net scores:", toy19_transfer.tolist())
print("AUCs [scratch net, old-only, transfer net]:", np.round(toy19_aucs, 3).tolist())
assert toy19_auc_transfer > toy19_auc_oldonly > toy19_auc_scratch

plt.figure(figsize=(5.4, 3.2))
plt.bar(["scratch\nnet", "old-only", "transfer\nnet"], toy19_aucs, color=["tomato", "gray", "seagreen"])
plt.ylim(0, 1.05)
plt.ylabel("AUC")
plt.title("frozen-old transfer net ranks best")
plt.show()
""")
md("▶ What you'll see: the transfer net has the highest AUC on the toy cold slice, matching the "
   "larger PyTorch comparison later.")

md(r"""
## ✍️ Toy 20 · teacher is nonlinear, student is simpler

Distillation starts with a strong teacher and a lighter student. This toy makes the teacher use an
interaction term that the simple linear student misses.
""")
code(r"""
toy20_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy20_X = np.array([[0, 0, 0], [1, 0, 0], [0, 1, 1], [1, 1, 0], [2, 1, 1], [1, 2, 0]], float)
toy20_linear = 0.8 * toy20_X[:, 0] - 0.5 * toy20_X[:, 1] + 0.3 * toy20_X[:, 2] - 0.2
toy20_interaction = 1.2 * toy20_X[:, 0] * toy20_X[:, 1]           # -> [0,0,0,1.2,2.4,2.4]
toy20_teacher_logit = toy20_linear + toy20_interaction            # -> [-.2,.6,-.4,1.3,3.6,2.0]
toy20_student_logit = toy20_linear                                # -> simple student misses interaction
toy20_teacher_prob = 1 / (1 + np.exp(-toy20_teacher_logit))       # -> [.45,.646,.401,.786,.973,.881]
toy20_student_prob = 1 / (1 + np.exp(-toy20_student_logit))       # -> [.45,.646,.401,.525,.769,.401]
print("features:\n", toy20_X)
print("linear part:", np.round(toy20_linear, 3).tolist())
print("teacher interaction:", np.round(toy20_interaction, 3).tolist())
print("teacher logits:", np.round(toy20_teacher_logit, 3).tolist())
print("student logits:", np.round(toy20_student_logit, 3).tolist())
print("teacher probabilities:", np.round(toy20_teacher_prob, 3).tolist())
print("student probabilities:", np.round(toy20_student_prob, 3).tolist())
assert toy20_teacher_prob[-1] > toy20_student_prob[-1]

plt.figure(figsize=(5.8, 3.2))
plt.plot(np.arange(6), toy20_teacher_prob, "o-", color="purple", label="teacher")
plt.plot(np.arange(6), toy20_student_prob, "o-", color="seagreen", label="student")
plt.xlabel("item")
plt.ylabel("probability")
plt.title("teacher captures interaction the student misses")
plt.legend()
plt.show()
""")
md("▶ What you'll see: rows with feature interactions get much higher teacher probabilities than "
   "the simple student can produce.")

md(r"""
## ✍️ Toy 21 · temperature softens teacher probabilities

Temperature divides the teacher logit before the sigmoid. Higher `T` pulls probabilities toward
0.5, exposing "almost positive" and "almost negative" cases.
""")
code(r"""
toy21_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy21_p = np.array([0.92, 0.62, 0.40, 0.08, 0.55, 0.20])          # -> teacher probabilities
toy21_clip = np.clip(toy21_p, 1e-6, 1 - 1e-6)                    # -> unchanged here
toy21_logit = np.log(toy21_clip / (1 - toy21_clip))               # -> [2.442,.49,-.405,-2.442,.201,-1.386]
toy21_soft_T2 = 1 / (1 + np.exp(-(toy21_logit / 2)))              # -> [.772,.561,.449,.228,.525,.333]
toy21_soft_T4 = 1 / (1 + np.exp(-(toy21_logit / 4)))              # -> [.648,.531,.475,.352,.513,.414]
toy21_hard = (toy21_p > 0.5).astype(int)                          # -> [1,1,0,0,1,0]
print("teacher probabilities:", toy21_p.tolist())
print("teacher logits:", np.round(toy21_logit, 3).tolist())
print("soft targets T=2:", np.round(toy21_soft_T2, 3).tolist())
print("soft targets T=4:", np.round(toy21_soft_T4, 3).tolist())
print("hard labels:", toy21_hard.tolist())
assert abs(toy21_soft_T4[0] - 0.5) < abs(toy21_p[0] - 0.5)

plt.figure(figsize=(6, 3.2))
toy21_x = np.arange(6)
plt.bar(toy21_x - 0.22, toy21_p, 0.22, color="purple", label="T=1")
plt.bar(toy21_x, toy21_soft_T2, 0.22, color="seagreen", label="T=2")
plt.bar(toy21_x + 0.22, toy21_soft_T4, 0.22, color="orange", label="T=4")
plt.axhline(0.5, color="black", linewidth=0.8)
plt.xlabel("item")
plt.ylabel("target probability")
plt.title("higher temperature moves targets toward 0.5")
plt.legend()
plt.show()
""")
md("▶ What you'll see: 0.92 softens to 0.77 at T=2 and 0.65 at T=4, while hard labels would only "
   "say 1 or 0.")

md(r"""
## ✍️ Toy 22 · hard-label loss vs soft-target distillation loss

Hard labels collapse teacher probabilities to 0/1. Distillation keeps the teacher's soft target and
computes BCE against that probability, preserving dark knowledge.
""")
code(r"""
toy22_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy22_teacher = np.array([0.92, 0.62, 0.40, 0.08, 0.55, 0.20])    # -> soft teacher targets
toy22_hard = (toy22_teacher > 0.5).astype(float)                  # -> [1,1,0,0,1,0]
toy22_student = np.array([0.70, 0.70, 0.30, 0.30, 0.30, 0.30])    # -> student probabilities
toy22_hard_bce = -(toy22_hard * np.log(toy22_student) + (1 - toy22_hard) * np.log(1 - toy22_student))
toy22_soft_bce = -(toy22_teacher * np.log(toy22_student) + (1 - toy22_teacher) * np.log(1 - toy22_student))
toy22_hard_loss = toy22_hard_bce.mean()                           # -> .4979
toy22_soft_loss = toy22_soft_bce.mean()                           # -> .5953
print("teacher soft targets:", toy22_teacher.tolist())
print("hard labels:", toy22_hard.astype(int).tolist())
print("student probabilities:", toy22_student.tolist())
print("hard-label BCE terms:", np.round(toy22_hard_bce, 3).tolist())
print("soft-target BCE terms:", np.round(toy22_soft_bce, 3).tolist())
print("mean hard loss:", round(float(toy22_hard_loss), 4))
print("mean soft distillation loss:", round(float(toy22_soft_loss), 4))
assert not np.isclose(toy22_hard_loss, toy22_soft_loss)

plt.figure(figsize=(5.8, 3.2))
toy22_x = np.arange(6)
plt.bar(toy22_x - 0.18, toy22_hard_bce, 0.36, color="gray", label="hard BCE")
plt.bar(toy22_x + 0.18, toy22_soft_bce, 0.36, color="seagreen", label="soft BCE")
plt.xlabel("item")
plt.ylabel("loss")
plt.title("soft targets give a different teaching signal")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the 0.55 teacher target is not treated like the 0.92 target; soft BCE "
   "keeps that uncertainty visible.")

md(r"""
## ✍️ Toy 23 · teacher labels an unlabeled pool with soft logits

The distilled student can learn from many unlabeled rows after the teacher scores them. Here the
teacher makes soft probabilities, we convert them to logits, and a tiny ridge solve fits a student.
""")
code(r"""
toy23_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy23_X = np.array([[0, 0], [1, 0], [0, 1], [1, 1], [2, 0], [0, 2]], float)
toy23_teacher_w = np.array([1.0, -0.5])                           # -> teacher logit weights
toy23_teacher_b = 0.2                                             # -> teacher bias
toy23_teacher_logit = toy23_X @ toy23_teacher_w + toy23_teacher_b # -> [.2,1.2,-.3,.7,2.2,-.8]
toy23_teacher_prob = 1 / (1 + np.exp(-toy23_teacher_logit))       # -> [.55,.769,.426,.668,.9,.31]
toy23_X_aug = np.column_stack([np.ones(len(toy23_X)), toy23_X])   # -> add bias column
toy23_alpha = 0.1                                                 # -> small ridge penalty
toy23_I = np.eye(3)                                               # -> 3x3 identity
toy23_I[0, 0] = 0.0                                               # -> do not penalize bias
toy23_left = toy23_X_aug.T @ toy23_X_aug + toy23_alpha * toy23_I  # -> normal-equation left side
toy23_right = toy23_X_aug.T @ toy23_teacher_logit                 # -> normal-equation right side
toy23_student_coef = np.linalg.solve(toy23_left, toy23_right)     # -> [.219,.971,-.499]
toy23_student_logit = toy23_X_aug @ toy23_student_coef            # -> [.219,1.19,-.281,.691,2.161,-.78]
toy23_corr = np.corrcoef(toy23_teacher_logit, toy23_student_logit)[0, 1]
print("unlabeled features:\n", toy23_X)
print("teacher logits:", np.round(toy23_teacher_logit, 3).tolist())
print("teacher probabilities:", np.round(toy23_teacher_prob, 3).tolist())
print("student coefficients [bias,w0,w1]:", np.round(toy23_student_coef, 3).tolist())
print("student logits:", np.round(toy23_student_logit, 3).tolist())
print("teacher-student logit correlation:", round(float(toy23_corr), 4))
assert toy23_corr > 0.99

plt.figure(figsize=(4.5, 4))
plt.scatter(toy23_teacher_logit, toy23_student_logit, s=120, color="seagreen")
plt.plot([-1, 2.5], [-1, 2.5], color="black", linestyle="--")
plt.xlabel("teacher logit")
plt.ylabel("student logit")
plt.title("student fits teacher soft logits")
plt.show()
""")
md("▶ What you'll see: the student logits almost lie on the teacher-logit diagonal, showing how "
   "unlabeled rows become soft supervision.")

md(r"""
## ✍️ Toy 24 · quality-vs-latency tradeoff

Distillation is useful when a small student is much faster but only slightly worse. Compute the AUC
drop and speedup explicitly, then view the serving options.
""")
code(r"""
toy24_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy24_names = np.array(["teacher", "student", "tiny", "ensemble", "cached", "rule"])
toy24_latency = np.array([40, 5, 3, 60, 12, 1], float)            # -> milliseconds
toy24_auc = np.array([0.88, 0.84, 0.80, 0.89, 0.86, 0.70])        # -> quality scores
toy24_auc_drop = toy24_auc[0] - toy24_auc[1]                      # -> 0.04
toy24_speedup = toy24_latency[0] / toy24_latency[1]               # -> 8.0
toy24_good_trade = (toy24_speedup >= 5) & (toy24_auc_drop <= 0.05)
print("model names:", toy24_names.tolist())
print("latency ms:", toy24_latency.tolist())
print("AUC:", toy24_auc.tolist())
print("teacher-student AUC drop:", round(float(toy24_auc_drop), 3))
print("teacher-student speedup:", round(float(toy24_speedup), 1), "x")
print("is the trade acceptable in this toy?", bool(toy24_good_trade))
assert toy24_good_trade

plt.figure(figsize=(5.8, 3.5))
plt.scatter(toy24_latency, toy24_auc, s=120, color="slateblue")
for toy24_i, toy24_name in enumerate(toy24_names):
    plt.annotate(toy24_name, (toy24_latency[toy24_i], toy24_auc[toy24_i]), xytext=(5, 2), textcoords="offset points")
plt.xlabel("latency ms (lower is better)")
plt.ylabel("AUC (higher is better)")
plt.title("student: small AUC drop, big speedup")
plt.show()
""")
md("▶ What you'll see: the student is 8× faster than the teacher with only a 0.04 AUC drop, which "
   "is the basic distillation tradeoff.")

md(r"""
## ✍️ Toy 25 · student copies teacher bias

Distillation imitates the teacher; it does not magically fix teacher bias. If the teacher scores one
group lower for the same quality, the student learns that pattern too.
""")
code(r"""
toy25_rng = np.random.default_rng(0)                              # -> deterministic seed 0
toy25_quality = np.array([0.9, 0.8, 0.7, 0.6, 0.9, 0.8, 0.7, 0.6])
toy25_group = np.array([0, 0, 0, 0, 1, 1, 1, 1])                  # -> group 1 is teacher-penalized
toy25_teacher = toy25_quality - 0.2 * toy25_group                 # -> group 1 gets lower scores
toy25_noise = np.array([0.01, -0.01, 0.00, 0.01, -0.01, 0.00, 0.01, -0.01])
toy25_student = toy25_teacher + toy25_noise                       # -> close imitation of teacher
toy25_corr = np.corrcoef(toy25_teacher, toy25_student)[0, 1]      # -> .9984
toy25_group0_mean = toy25_student[toy25_group == 0].mean()        # -> .7525
toy25_group1_mean = toy25_student[toy25_group == 1].mean()        # -> .5475
toy25_gap = toy25_group0_mean - toy25_group1_mean                 # -> .205
print("true quality:", toy25_quality.tolist())
print("group:", toy25_group.tolist())
print("teacher scores:", np.round(toy25_teacher, 3).tolist())
print("student scores:", np.round(toy25_student, 3).tolist())
print("teacher-student correlation:", round(float(toy25_corr), 4))
print("student group 0 mean:", round(float(toy25_group0_mean), 4))
print("student group 1 mean:", round(float(toy25_group1_mean), 4))
print("student copied gap:", round(float(toy25_gap), 4))
assert toy25_corr > 0.99 and toy25_gap > 0.19

plt.figure(figsize=(4.7, 4))
plt.scatter(toy25_teacher, toy25_student, c=toy25_group, cmap="coolwarm", s=130)
plt.plot([0.35, 0.95], [0.35, 0.95], color="black", linestyle="--")
plt.xlabel("teacher score")
plt.ylabel("student score")
plt.title("student closely imitates teacher, bias included")
plt.show()
""")
md("▶ What you'll see: student scores are almost perfectly correlated with teacher scores, so the "
   "teacher's group gap remains in the distilled model.")

# =================================================================== PART A
md("---\n# Part A · Cold-start & the confidence blend")

md(r"""
## Step 2 · What is cold-start? (and the trap)

**Cold-start** = the model has (almost) no history for something new. Three flavors:

| Type | What's missing | Example |
|---|---|---|
| **New item** | item interaction history | a brand-new Event Ad |
| **New user** | user history | a first-session visitor |
| **New system** | reliable labels | a just-launched surface |

The trap: a new ad gets **2 clicks in 20 impressions** — a raw CTR of **10%**. That looks
amazing, but 20 impressions is almost no evidence. If pacing believes it, budget floods a
noisy fluke. Let's *see* how unreliable a 20-impression rate is.
""")
code(r"""
rng = np.random.default_rng(0)
true_ctr = 0.01                       # the REAL click rate for these new ads is a boring 1%
n_imps   = 20                         # but each new ad has only 20 impressions so far
observed = rng.binomial(n_imps, true_ctr, size=5000) / n_imps   # 5000 new ads' observed CTRs

print("true CTR of every ad:", true_ctr, " (1%)")
print("yet observed 20-impression CTRs range from", observed.min(), "to", observed.max())
print("share of ads that look like >=10% CTR by luck:", round((observed >= 0.10).mean(), 3))
plt.figure(figsize=(6,3.2))
plt.hist(observed, bins=np.arange(0, observed.max()+0.026, 0.025), color=RED, alpha=.8)
plt.axvline(true_ctr, color="k", ls="--", label="true CTR (1%)")
plt.xlabel("observed CTR from 20 impressions"); plt.ylabel("# of new ads"); plt.legend()
plt.title("20 impressions is NOISE: many ads look 10-20% by pure luck"); plt.show()
""")

md(r"""
## Step 3 · The safe anchor — a **prior**

Instead of trusting 2/20, start from what **similar** items usually do. A **category prior**
might say "ads in this category average **1%** CTR." It's boring, but stable — it doesn't
swing with a couple of lucky clicks. Cold-start begins here.
""")
code(r"""
p_prior = 0.01
print("category prior CTR:", p_prior, "-> our safe starting guess for ANY brand-new ad")
print("compare: the noisy '2 clicks / 20 impressions' raw estimate =", 2/20, "(way too hot)")
""")

md(r"""
## Step 4 · The confidence blend — the key formula

We don't want to ignore the ad's own data forever — just to **trust it in proportion to how
much of it there is**. The blend:
$$\hat p = (1-c_n)\,p_\text{prior} + c_n\,p_\text{learned},\qquad c_n=\frac{n}{n+k}$$
`c_n` is a **confidence dial** from 0 to 1. With `n` impressions and a constant `k`:
- tiny `n` → `c_n≈0` → we mostly trust the **prior**,
- huge `n` → `c_n≈1` → we mostly trust the ad's **own learned rate**.
`k` sets "how much evidence before I start trusting the data." Let's plot the dial.
""")
code(r"""
k = 1000
n = np.arange(0, 5001)
plt.figure(figsize=(6,3.2))
for kk, c in [(200, GREEN), (1000, BLUE), (3000, RED)]:
    plt.plot(n, n/(n+kk), color=c, label=f"k={kk}")
plt.xlabel("n = impressions collected"); plt.ylabel("confidence c_n in the learned rate")
plt.title("c_n = n/(n+k): trust grows with evidence (bigger k = more cautious)"); plt.legend(); plt.show()
for nv in [20, 100, 1000, 5000]:
    print(f"  n={nv:>4}: c_n = {nv/(nv+k):.3f}")
""")

md(r"""
## Step 5 · The worked example from the lesson

Plug in the lesson's numbers: `p_prior=1%`, `p_learned=10%` (the hot 2/20 rate), `n=20`,
`k=1000`. The blend should stay near **1.18%**, *not* 10% — the 20 impressions barely move
us off the prior. Verify it exactly.
""")
code(r"""
p_prior, p_learned, n, k = 0.010, 0.100, 20, 1000
c_n = n / (n + k)
p_blend = (1 - c_n) * p_prior + c_n * p_learned
print(f"c_n = {n}/({n}+{k}) = {c_n:.4f}")
print(f"blend = (1-{c_n:.4f})*{p_prior} + {c_n:.4f}*{p_learned} = {p_blend:.4f}  ({p_blend*100:.2f}%)")
assert round(p_blend, 4) == 0.0118
print("matches the lesson's 1.18% ✓  -> the early spike is tamed")
""")

md(r"""
## Step 6 · Watch the handoff happen

Now follow **one** ad as impressions accumulate (true CTR 10%). Plot three lines:
- **prior** (flat 1%),
- **raw** running CTR (jumpy early, settles late),
- **blended** estimate — starts glued to the prior, then smoothly slides toward the truth.
This is the cold→warm handoff in one picture.
""")
code(r"""
rng = np.random.default_rng(2)
true_ctr, p_prior, k = 0.10, 0.01, 1000
N = 4000
clicks = (rng.random(N) < true_ctr).astype(int)
imps = np.arange(1, N+1)
raw = np.cumsum(clicks) / imps
c_n = imps / (imps + k)
blend = (1 - c_n) * p_prior + c_n * raw

plt.figure(figsize=(7,3.6))
plt.axhline(p_prior, color=GRAY, ls="--", label="prior (1%)")
plt.axhline(true_ctr, color="k", ls=":", label="true CTR (10%)")
plt.plot(imps, raw, color=RED, alpha=.5, label="raw running CTR (jumpy)")
plt.plot(imps, blend, color=GREEN, lw=2, label="blended estimate (safe handoff)")
plt.xlabel("impressions collected"); plt.ylabel("estimated CTR"); plt.legend()
plt.title("cold -> warm: blended starts at the prior, slides to the truth as evidence grows"); plt.show()
for nv in [20, 100, 500, 1000, 3000]:
    print(f"  n={nv:>4}: raw={raw[nv-1]:.3f}  blended={blend[nv-1]:.3f}  c_n={c_n[nv-1]:.2f}")
""")

md(r"""
## Step 7 · Exit criteria — log the regime, gate the handoff

Don't switch on a hunch. Define **gates** and label every score with the **regime** that
produced it, so later you can tell "the model is bad" from "we handed off too early":
- **cold** (trust prior) → **blended** → **warm** (trust learned) once, e.g., **≥1000
  impressions AND ≥20 clicks** with stable calibration.
""")
code(r"""
def regime(n_imps, n_clicks):
    if n_imps >= 1000 and n_clicks >= 20:
        return "warm"
    if n_imps >= 50:
        return "blended"
    return "cold"

for n_imps, n_clicks in [(20, 2), (300, 8), (1200, 25), (5000, 90)]:
    print(f"  {n_imps:>5} imps / {n_clicks:>3} clicks  ->  regime = {regime(n_imps, n_clicks)}")

cum_clicks = np.cumsum(clicks)
regimes = [regime(i, cum_clicks[i-1]) for i in imps]
first_warm = regimes.index("warm") + 1
plt.figure(figsize=(7,3.4))
plt.plot(imps, blend, color=GREEN, lw=2, label="blended estimate")
plt.axvline(first_warm, color=PURPLE, ls="--", label=f"handoff to WARM (n={first_warm})")
plt.axhline(0.10, color="k", ls=":", label="true CTR")
plt.xlabel("impressions"); plt.ylabel("estimated CTR"); plt.legend()
plt.title("regime gates: cold -> blended -> warm only after the exit criteria are met"); plt.show()
""")

md(r"""
## Step 8 · Why it matters — protecting the **budget**

Pacing multiplies CTR by bid to spend budget. If it uses the **raw** early rate, it pours
money into lucky spikes. The **blend** keeps every new ad near the prior until it earns
trust — so budget follows the ad with real, sustained evidence, not the noisiest fluke.
""")
code(r"""
p_prior, k = 0.01, 1000
ads = [("spike A (2/20)", 2, 20), ("spike B (3/20)", 3, 20),
       ("dud (0/20)", 0, 20), ("proven (25/1500)", 25, 1500)]
rows = []
for name, c, n in ads:
    raw = c/n; cn = n/(n+k); bl = (1-cn)*p_prior + cn*raw
    rows.append((name, raw, bl))
df = pd.DataFrame(rows, columns=["ad", "raw CTR", "blended CTR"]); print(df.to_string(index=False))

fig, ax = plt.subplots(1, 2, figsize=(10, 3.4))
names = [r[0] for r in rows]
ax[0].bar(names, [r[1] for r in rows], color=RED);  ax[0].set_title("raw CTR -> budget chases spikes"); ax[0].tick_params(axis="x", rotation=20)
ax[1].bar(names, [r[2] for r in rows], color=GREEN); ax[1].set_title("blended -> the PROVEN ad wins"); ax[1].tick_params(axis="x", rotation=20)
plt.show()
print("raw would overspend on the 15% spike; blended ranks the proven ad highest. Budget stays safe.")
""")

# =================================================================== PART B
md("---\n# Part B · Transfer learning")

md(r"""
## Step 9 · The scenario — reuse an OLD model on a NEW surface

Imagine your team already has a mature **events-ranking model** ("the **old model**"). It was
trained on **tons** of data using a rich set of **shared features** (audience fit, creative
quality, advertiser history, topic signals — 25 engineered features in total).

Now a **new Event Ads surface** launches. It has:
- the **same 25 shared features**, **plus**
- **2 brand-new features the old model never saw** — `is_video` (is the creative a video?)
  and `is_weekend` — and
- only a **few hundred labels** so far (it's new).

**The goal:** don't throw away the old model, and don't ignore the new features. We'll
**reuse the old model AND add the two new features** into a small **new model**. Along the
way you'll see exactly how a feature is "added," and how training and inference flow.
""")

md(r"""
## Step 10 · Build the OLD model (trained on lots of data, shared features only)

First we create the old model. It learns the relationship between the **25 shared features**
and clicks from **40,000** rows — so it has genuinely mastered that signal. Keep in mind it
has **never seen** `is_video` or `is_weekend`; those didn't exist on the old surface.
""")
code(r"""
D_SHARED = 25
gen = np.random.default_rng(0)
w_shared = gen.normal(0, 1, D_SHARED) * np.array([1.0]*6 + [0.25]*19)   # a few strong + many weak signals

def gen_shared(n, rng):
    return rng.normal(0, 1, (n, D_SHARED))     # 25 standardized engineered features (0 = average)

# OLD MODEL: the mature model, trained on 40k rows using the shared features ONLY
r = np.random.default_rng(1)
Xs = gen_shared(40000, r)
ys = (r.random(40000) < 1/(1 + np.exp(-(Xs @ w_shared - 0.3)))).astype(int)
old_model = LogisticRegression(max_iter=3000).fit(Xs, ys)
print(f"OLD model trained on {len(Xs):,} rows x {D_SHARED} shared features")
print(f"OLD model input width: {old_model.coef_.shape[1]} features  (it ONLY knows these 25)")

# The NEW task: same 25 shared features + 2 NEW ones (is_video, is_weekend), explained next.
w_new = np.array([1.6, -1.1])   # the true effect of the new features (video helps, weekend hurts)
def gen_new(n, seed):
    r = np.random.default_rng(seed)
    Xshared    = gen_shared(n, r)
    is_video   = r.integers(0, 2, n).astype(float)
    is_weekend = r.integers(0, 2, n).astype(float)
    Xextra     = np.column_stack([is_video, is_weekend])
    logit = Xshared @ w_shared + Xextra @ w_new - 0.3
    y = (r.random(n) < 1/(1 + np.exp(-logit))).astype(int)
    return Xshared, Xextra, y

# held-out test set for the NEW task (used later to score models)
Xsh_test, Xnew_test, y_test = gen_new(6000, 99)
print("OLD model AUC on the NEW task using shared signal only:",
      round(roc_auc_score(y_test, old_model.predict_proba(Xsh_test)[:, 1]), 3),
      "\n  -> decent, but it's blind to the 2 new features, so it's capped.")
""")

md(r"""
## Step 11 · The OLD model squashes MANY features into ONE number

Take **5 example impressions**. Each has the 25 shared features (a wide table). When we ask
the old model to score them, it turns each **row of 25 numbers into a single prediction** — a
click probability. That one number is the old model's whole opinion, distilled. Watch 25
columns become 1.
""")
code(r"""
# 5 example impressions we'll follow all the way through
Xsh_demo, Xnew_demo, y_demo = gen_new(5, 123)

# show the first 4 of the 25 shared columns (the rest exist, just hidden for readability)
demo_shared = pd.DataFrame(Xsh_demo[:, :4].round(2), columns=[f"f{i+1}" for i in range(4)])
demo_shared.insert(0, "impression", [f"imp {i+1}" for i in range(5)])
demo_shared["...(25 total)"] = "..."
print("STEP 11a — the 5 impressions' SHARED features (showing 4 of 25 columns):")
print(demo_shared.to_string(index=False))

# the old model turns those 25 columns into ONE probability per row
old_pred_demo = old_model.predict_proba(Xsh_demo)[:, 1]
print("\nSTEP 11b — OLD model's output = ONE number per impression (25 features -> 1):")
for i, p in enumerate(old_pred_demo):
    print(f"   imp {i+1}:  25 shared features  ->  old_model prob = {p:.3f}")
""")

md(r"""
## Step 12 · The NEW task has extra features the old model never saw

Those same 5 impressions also carry **2 new features** — `is_video` and `is_weekend`. The old
model **cannot** use them: it was built with exactly 25 inputs, so it has no slot for these.
They're brand-new signal that only exists on the new surface.
""")
code(r"""
demo_new = pd.DataFrame({"impression": [f"imp {i+1}" for i in range(5)],
                         "is_video":   Xnew_demo[:, 0].astype(int),
                         "is_weekend": Xnew_demo[:, 1].astype(int)})
print("STEP 12 — the SAME 5 impressions' NEW features (old model never saw these):")
print(demo_new.to_string(index=False))
print("\nThe old model expects", old_model.coef_.shape[1], "inputs, so it literally can't eat these 2.")
print("But the NEW model we build next CAN combine the old model's opinion WITH these.")
""")

md(r"""
## Step 13 · "Adding a feature" = gluing another column on

A model's input is just a **table**: one row per impression, one **column per feature**.
Adding a feature means **pasting on another column** (`np.hstack` = stack side by side). We
build the **new model's input** as three columns:

`[ old_model's prediction | is_video | is_weekend ]`

The old model (all 25 of its features) is now compressed into **column 0**; the two new
features are columns 1 and 2.
""")
code(r"""
def old_feature(Xshared):
    # the old model's probability, shaped as ONE column to glue on
    return old_model.predict_proba(Xshared)[:, 1].reshape(-1, 1)

col_old   = old_feature(Xsh_demo)      # column 0: the old model's opinion
cols_new  = Xnew_demo                  # columns 1,2: is_video, is_weekend
glued     = np.hstack([col_old, cols_new])   # <-- adding features = gluing columns

show = pd.DataFrame(glued.round(3), columns=["old_pred", "is_video", "is_weekend"])
show.insert(0, "impression", [f"imp {i+1}" for i in range(5)])
print("STEP 13 — the NEW model's input table (3 glued columns):")
print(show.to_string(index=False))
print("\ncolumn 0 = old model's opinion (25 feats squashed),  columns 1-2 = the new features.")
print("shape went from", col_old.shape, "+", cols_new.shape, "->", glued.shape, "(same rows, more columns)")
""")

md(r"""
## Step 14 · Train the NEW model — it learns ONE weight per column

Now fit a small **new model** on that 3-column input using the new surface's few hundred
labels. A linear model just learns **one weight per column** — how much each matters. Expect
a **big weight on `old_pred`** (the old model already did the hard work) and real weights on
the two new features.
""")
code(r"""
# training data for the new surface: only 300 labels
Xsh_tr, Xnew_tr, y_tr = gen_new(300, 7)
X_train = np.hstack([old_feature(Xsh_tr), Xnew_tr])     # [old_pred | is_video | is_weekend]
new_model = LogisticRegression(max_iter=3000).fit(X_train, y_tr)

names = ["old_pred", "is_video", "is_weekend"]
weights = new_model.coef_[0]
print("STEP 14 — weights the NEW model learned (300 labels):")
for nm, w in zip(names, weights):
    print(f"   {nm:>11}: {w:+.2f}")
print(f"   {'bias':>11}: {new_model.intercept_[0]:+.2f}")

plt.figure(figsize=(5.5, 3.2))
colors = [BLUE, GREEN, RED]
plt.bar(names, weights, color=colors)
plt.axhline(0, color="k", lw=.8)
plt.ylabel("learned weight"); plt.title("one weight per column (big trust on the old model)")
plt.show()
print("old_pred gets the largest weight -> the new model leans heavily on the old model,")
print("then adjusts with is_video (helps) and is_weekend (hurts).")
""")

md(r"""
## Step 15 · Inference for ONE impression, end to end

Let's score a single new impression by hand so the flow is concrete:
**shared features → old model → one number → glue on the 2 new features → weighted sum →
sigmoid → final probability.** We'll reproduce `predict_proba` with plain arithmetic.
""")
code(r"""
# take one fresh impression
Xsh_one, Xnew_one, _ = gen_new(1, 2024)

# 1) shared features -> old model -> one number
old_p = old_model.predict_proba(Xsh_one)[:, 1][0]
print("1) old model reads its 25 shared features -> old_pred =", round(old_p, 3))

# 2) grab the 2 new features
v, wk = Xnew_one[0]
print(f"2) new features -> is_video = {int(v)}, is_weekend = {int(wk)}")

# 3) glue into the new model's 3-number input
x = np.array([old_p, v, wk])
print("3) glued input for the new model:", x.round(3))

# 4) weighted sum = w . x + bias  (the new model's core computation)
w = new_model.coef_[0]; b = new_model.intercept_[0]
score = float(np.dot(w, x) + b)
terms = "  +  ".join(f"{wi:+.2f}*{xi:g}" for wi, xi in zip(w, x))
print(f"4) score = {terms}  {b:+.2f}  =  {score:.3f}")

# 5) sigmoid -> probability
prob = 1/(1 + np.exp(-score))
print(f"5) probability = sigmoid({score:.3f}) = {prob:.3f}")
print("   check vs model.predict_proba:", round(float(new_model.predict_proba(x.reshape(1,-1))[:,1][0]), 3), "(matches)")
""")

md(r"""
## Step 16 · Does it actually help? scratch vs old-only vs transfer

Three ways to serve the new surface, across different label budgets:
- **from scratch** — train on all 27 raw features (25 shared + 2 new) using only the few
  labels. With so many features and so few rows it **overfits**.
- **old model only** — reuse the old model as-is. It's stuck below the ceiling because it
  **can't see the 2 new features**.
- **transfer** — old model's prediction **plus** the 2 new features (what we built). Best of
  both: the old model's mastery **and** the new signal.
""")
code(r"""
def score_scratch(n):
    Xsh, Xnew, y = gen_new(n, 7)
    m = LogisticRegression(max_iter=3000).fit(np.hstack([Xsh, Xnew]), y)
    return roc_auc_score(y_test, m.predict_proba(np.hstack([Xsh_test, Xnew_test]))[:, 1])

def score_transfer(n):
    Xsh, Xnew, y = gen_new(n, 7)
    m = LogisticRegression(max_iter=3000).fit(np.hstack([old_feature(Xsh), Xnew]), y)
    return roc_auc_score(y_test, m.predict_proba(np.hstack([old_feature(Xsh_test), Xnew_test]))[:, 1])

label_counts = [100, 200, 500, 1000, 5000]
scratch  = [score_scratch(n)  for n in label_counts]
transfer = [score_transfer(n) for n in label_counts]
old_only = roc_auc_score(y_test, old_model.predict_proba(Xsh_test)[:, 1])

print(f"{'labels':>7}{'scratch':>10}{'old-only':>10}{'transfer':>10}")
for n, s, t in zip(label_counts, scratch, transfer):
    print(f"{n:>7}{s:>10.3f}{old_only:>10.3f}{t:>10.3f}")

plt.figure(figsize=(6.5, 3.6))
plt.plot(label_counts, scratch, "o-", color=RED, label="from scratch (all raw)")
plt.axhline(old_only, color=GRAY, ls="--", label="old model only (blind to new feats)")
plt.plot(label_counts, transfer, "o-", color=GREEN, label="transfer (old_pred + new feats)")
plt.xscale("log"); plt.xlabel("# new-surface labels (log)"); plt.ylabel("test AUC"); plt.legend()
plt.title("transfer wins with few labels; scratch needs far more"); plt.show()
""")

md(r"""
## Step 17 · The catch — negative transfer

Transfer is a *hypothesis*, not a guarantee. If the old model solved a **different** problem,
its prediction is misleading and leaning on it does **worse than scratch**. We build a
**mismatched** old model (trained toward unrelated weights) and reuse it — AUC drops. Always
validate that the old model actually fits the new task (e.g., beats a scratch baseline).
""")
code(r"""
# a mismatched "old model": trained on the same features but a DIFFERENT relationship
w_wrong = np.random.default_rng(777).normal(0, 1, D_SHARED)
rb = np.random.default_rng(2); Xb = gen_shared(40000, rb)
yb = (rb.random(40000) < 1/(1 + np.exp(-(Xb @ w_wrong - 0.3)))).astype(int)
wrong_model = LogisticRegression(max_iter=3000).fit(Xb, yb)
def wrong_feature(Xshared):
    return wrong_model.predict_proba(Xshared)[:, 1].reshape(-1, 1)

Xsh, Xnew, y = gen_new(300, 7)
a_scratch = score_scratch(300)
a_good    = score_transfer(300)
a_bad     = roc_auc_score(y_test,
              LogisticRegression(max_iter=3000).fit(np.hstack([wrong_feature(Xsh), Xnew]), y)
              .predict_proba(np.hstack([wrong_feature(Xsh_test), Xnew_test]))[:, 1])
print("with 300 labels:")
print(f"  scratch                     AUC {a_scratch:.3f}")
print(f"  transfer from GOOD old model  AUC {a_good:.3f}  (helps)")
print(f"  transfer from WRONG old model AUC {a_bad:.3f}  (hurts! negative transfer)")
plt.figure(figsize=(5.5, 3.2))
plt.bar(["scratch", "good\ntransfer", "wrong\ntransfer"], [a_scratch, a_good, a_bad],
        color=[GRAY, GREEN, RED])
plt.ylabel("test AUC"); plt.title("a wrong old model is worse than no old model"); plt.show()
""")

md("---\n# Part B (continued) · The same process in PyTorch")

md(r"""
## Step 18 · Why a PyTorch version — and a *literal* "built on top of"

Steps 10–16 wired the two models together with data (glue a column, `hstack`). PyTorch lets
us make the **"new model built on top of the old model"** literal: the old model becomes a
**frozen sub-module living *inside* the new model**. Same idea, same result — but now it's one
object, which is how real deep-learning transfer usually looks.

We'll redo the walkthrough as small neural nets:
1. build & train the **old net**, 2. **freeze** it, 3. wrap it inside a **new net** with a
small **head** over `[old_logit | is_video | is_weekend]`, 4. train **only the head**,
5. trace inference, 6. check it beats scratch. (Reuses the same data from Step 10.)
""")

md(r"""
## Step 19 · Build & train the OLD net (`nn.Linear` → a logit)

The old net is a single linear layer mapping the 25 shared features to **one logit** (a raw
score; no sigmoid inside — `BCEWithLogitsLoss` applies it during training, which is the
numerically stable pattern). We train it on the 40,000 source rows and log the loss.
""")
code(r"""
import torch, torch.nn as nn
torch.manual_seed(0)

def T(a): return torch.tensor(np.asarray(a, dtype="float32"))
def new_task_tensors(n, seed):
    Xsh, Xnew, y = gen_new(n, seed)          # reuse the SAME data generator from Step 10
    return T(Xsh), T(Xnew), T(y).reshape(-1, 1)

# source data for the old net (40k rows, shared features only)
rs = np.random.default_rng(1)
Xs_np = gen_shared(40000, rs)
ys_np = (rs.random(40000) < 1/(1 + np.exp(-(Xs_np @ w_shared - 0.3)))).astype("float32")
Xs_t, ys_t = T(Xs_np), T(ys_np).reshape(-1, 1)

class OldNet(nn.Module):
    def __init__(self):
        super().__init__(); self.lin = nn.Linear(D_SHARED, 1)   # 25 features -> 1 logit
    def forward(self, x):
        return self.lin(x)                                      # returns a LOGIT (no sigmoid)

torch_old = OldNet()
opt = torch.optim.Adam(torch_old.parameters(), lr=0.05)
loss_fn = nn.BCEWithLogitsLoss()
old_losses = []
for epoch in range(300):
    opt.zero_grad()
    loss = loss_fn(torch_old(Xs_t), ys_t)
    loss.backward(); opt.step(); old_losses.append(loss.item())
    if epoch % 60 == 0:
        print(f"  epoch {epoch:>3}: training loss {loss.item():.4f}")

Xsh_te_t, Xnew_te_t, y_te_t = new_task_tensors(6000, 99)
with torch.no_grad():
    auc_old_torch = roc_auc_score(y_te_t.numpy(), torch.sigmoid(torch_old(Xsh_te_t)).numpy())
print("OLD net AUC on the new task (shared signal only):", round(auc_old_torch, 3))
plt.figure(figsize=(5.5, 3)); plt.plot(old_losses, color=BLUE)
plt.xlabel("epoch"); plt.ylabel("BCE loss"); plt.title("old net training loss"); plt.show()
""")

md(r"""
## Step 20 · Freeze the OLD net

Transfer means we **don't** want to disturb what the old model learned. Setting
`requires_grad = False` on its parameters **freezes** them — gradients won't update them. Then
we confirm it still turns 25 features into one logit for our 5 demo impressions.
""")
code(r"""
for p in torch_old.parameters():
    p.requires_grad = False
print("old net frozen:", all(not p.requires_grad for p in torch_old.parameters()))

Xsh_d, Xnew_d, _ = new_task_tensors(5, 123)
with torch.no_grad():
    demo_logits = torch_old(Xsh_d).squeeze(1)
print("\n5 demo impressions -> old net logit (25 features -> 1 number):")
for i, z in enumerate(demo_logits.tolist()):
    print(f"   imp {i+1}: logit {z:+.3f}  (prob {torch.sigmoid(torch.tensor(z)):.3f})")
""")

md(r"""
## Step 21 · The NEW net **contains** the frozen old net

Here's the literal "built on top of." `NewNet` holds **`self.old`** (the frozen old net) as a
sub-module, plus a tiny **`self.head`** — a `Linear(3, 1)` over `[old_logit, is_video,
is_weekend]`. In `forward`, it runs the old net (no grad), **concatenates** its logit with the
2 new features, and passes that to the head. Printing the module shows the old net nested
inside the new one.
""")
code(r"""
class NewNet(nn.Module):
    def __init__(self, old_net):
        super().__init__()
        self.old  = old_net                 # <-- the OLD model lives INSIDE the new model
        self.head = nn.Linear(1 + 2, 1)     # [old_logit, is_video, is_weekend] -> 1 logit
    def forward(self, Xshared, Xnew):
        with torch.no_grad():
            old_logit = self.old(Xshared)   # old net runs, frozen
        z = torch.cat([old_logit, Xnew], dim=1)   # glue columns (same idea as np.hstack)
        return self.head(z)

model = NewNet(torch_old)
print(model)
print("\ntrainable parameters (only the head):")
for name, p in model.named_parameters():
    if p.requires_grad:
        print("  ", name, tuple(p.shape))
""")

md(r"""
## Step 22 · Train ONLY the head (old net stays frozen)

We hand the optimizer **only `model.head.parameters()`**, so training updates the head and
leaves the old net untouched. We prove it by printing one old-net weight before and after —
it doesn't move. The head learns how much to trust the old net's logit and what the 2 new
features add.
""")
code(r"""
before = torch_old.lin.weight[0, 0].item()
opt = torch.optim.Adam(model.head.parameters(), lr=0.05)   # ONLY the head is optimized
Xsh_tr_t, Xnew_tr_t, y_tr_t = new_task_tensors(300, 7)     # only 300 labels
head_losses = []
for epoch in range(400):
    opt.zero_grad()
    loss = loss_fn(model(Xsh_tr_t, Xnew_tr_t), y_tr_t)
    loss.backward(); opt.step(); head_losses.append(loss.item())
    if epoch % 80 == 0:
        print(f"  epoch {epoch:>3}: training loss {loss.item():.4f}")
after = torch_old.lin.weight[0, 0].item()

print(f"\nold net weight[0,0] before {before:.5f} -> after {after:.5f}  (unchanged = truly frozen)")
w = model.head.weight.detach().numpy().ravel()
print(f"head learned weights -> old_logit {w[0]:+.2f}, is_video {w[1]:+.2f}, is_weekend {w[2]:+.2f}")
plt.figure(figsize=(5.5, 3)); plt.plot(head_losses, color=GREEN)
plt.xlabel("epoch"); plt.ylabel("BCE loss"); plt.title("new head training loss"); plt.show()
""")

md(r"""
## Step 23 · Inference through the composed net (one impression)

Now one call to `model(...)` runs the **whole chain** — old net → glue → head → logit. We
unpack it by hand to see each stage, then confirm the manual result equals the module's
output.
""")
code(r"""
Xsh_one, Xnew_one, _ = new_task_tensors(1, 2024)
with torch.no_grad():
    old_logit = model.old(Xsh_one)                 # stage 1: old net
    z = torch.cat([old_logit, Xnew_one], dim=1)    # stage 2: glue
    head_logit = model.head(z)                     # stage 3: head
    prob = torch.sigmoid(head_logit)               # stage 4: probability

print(f"1) old net logit          = {old_logit.item():+.3f}")
print(f"2) glued input to head    = {z.numpy().ravel().round(3)}   [old_logit, is_video, is_weekend]")
print(f"3) head logit             = {head_logit.item():+.3f}")
print(f"4) final probability      = sigmoid = {prob.item():.3f}")
with torch.no_grad():
    print("   check: torch.sigmoid(model(...)) =", round(torch.sigmoid(model(Xsh_one, Xnew_one)).item(), 3), "(matches)")
""")

md(r"""
## Step 24 · Does it help? transfer net vs scratch net

Finally, train a **from-scratch** net on all 27 raw features with the same 300 labels, and
compare to the transfer net. Same lesson as the sklearn version: with few labels, standing on
the frozen old net wins.
""")
code(r"""
class ScratchNet(nn.Module):
    def __init__(self):
        super().__init__(); self.lin = nn.Linear(D_SHARED + 2, 1)   # all 27 raw features
    def forward(self, x): return self.lin(x)

Xall_tr = torch.cat([Xsh_tr_t, Xnew_tr_t], dim=1)
Xall_te = torch.cat([Xsh_te_t, Xnew_te_t], dim=1)
scratch_net = ScratchNet()
opt = torch.optim.Adam(scratch_net.parameters(), lr=0.05)
for epoch in range(400):
    opt.zero_grad(); loss = loss_fn(scratch_net(Xall_tr), y_tr_t); loss.backward(); opt.step()

with torch.no_grad():
    auc_scratch_t  = roc_auc_score(y_te_t.numpy(), torch.sigmoid(scratch_net(Xall_te)).numpy())
    auc_transfer_t = roc_auc_score(y_te_t.numpy(), torch.sigmoid(model(Xsh_te_t, Xnew_te_t)).numpy())
print(f"scratch net (27 raw, 300 labels)      AUC {auc_scratch_t:.3f}")
print(f"transfer net (frozen old + head)      AUC {auc_transfer_t:.3f}")
plt.figure(figsize=(5, 3.2))
plt.bar(["scratch\nnet", "transfer\nnet"], [auc_scratch_t, auc_transfer_t], color=[GRAY, GREEN])
plt.ylabel("test AUC"); plt.ylim(0.7, 0.87)
plt.title("PyTorch: transfer (old net inside) beats scratch"); plt.show()
print("\nSame story as Steps 10-16 — only now the old model is a frozen sub-module of the new one.")
""")

# =================================================================== PART C
md("---\n# Part C · Distillation")

md(r"""
## Step 25 · Teacher vs student

**Distillation** trains a small, **fast student** to imitate a big, **slow teacher**. Why?
The teacher may be too slow to serve online, or you may have lots of **unlabeled** traffic
the teacher can label cheaply. Here the teacher is a 400-tree gradient boosting model (strong
but heavy); the student will be a light logistic model. The task has a 3-way interaction and
a sine wave — signal the light student can only *partly* capture, so it will stay a bit below
the teacher (that's the quality/latency tradeoff).
""")
code(r"""
from sklearn.ensemble import GradientBoostingClassifier
def make2(n, seed):
    r = np.random.default_rng(seed); X = r.normal(0, 1, (n, 8))
    logit = (1.3*X[:,0] - 1.0*X[:,1] + 1.2*X[:,2]*X[:,3]
             + 1.6*X[:,2]*X[:,3]*X[:,4] + 0.8*np.sin(2.5*X[:,5]) - 0.4*X[:,6] - 0.2)
    y = (r.random(n) < 1/(1+np.exp(-logit))).astype(int)
    return X, y

Xtest, ytest = make2(6000, 4)
teacher = GradientBoostingClassifier(max_depth=4, n_estimators=400).fit(*make2(25000, 10))
auc_teacher = roc_auc_score(ytest, teacher.predict_proba(Xtest)[:,1])
print("teacher AUC (strong, but slow to serve):", round(auc_teacher, 3))
""")

md(r"""
## Step 26 · Temperature & "dark knowledge"

A **hard label** says only 0 or 1. The teacher's **probability** says much more: a negative
scored 0.45 is "almost a click," while 0.02 is "clearly not." That extra shading is **dark
knowledge**. **Temperature** `T` softens probabilities (divide the logit by `T`) to make the
shading easier for the student to see. Let's visualize the softening.
""")
code(r"""
def soften(p, T):
    z = np.log(np.clip(p, 1e-6, 1-1e-6) / (1 - np.clip(p, 1e-6, 1-1e-6)))
    return 1 / (1 + np.exp(-z / T))

items = ["ad A", "ad B", "ad C", "ad D"]
p_teacher = np.array([0.92, 0.62, 0.40, 0.08])
xb = np.arange(len(items)); w = 0.25
plt.figure(figsize=(6.5,3.4))
for j, (T, c) in enumerate([(1, BLUE), (2, GREEN), (4, RED)]):
    plt.bar(xb + (j-1)*w, soften(p_teacher, T), w, color=c, label=f"T={T}")
plt.xticks(xb, items); plt.ylabel("softened teacher probability"); plt.legend()
plt.title("higher T -> softer targets that expose 'almost' cases (dark knowledge)"); plt.show()
print("hard labels would be", (p_teacher>0.5).astype(int), "- the student would never learn how 'close' B and C were.")
""")

md(r"""
## Step 27 · Distill — the teacher teaches the student

Two students, both light logistic models (with interaction features so they *can* learn a
bit):
- **hard student:** trained on only **400 hard labels** → overfits, underperforms.
- **distilled student:** the teacher labels a big **unlabeled pool (20,000 rows)** with soft
  scores; the student learns from those. It sees far more supervision → much better AUC,
  approaching (but below) the teacher.
""")
code(r"""
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.pipeline import make_pipeline

def student_clf():   # small + fast: interaction features + logistic
    return make_pipeline(PolynomialFeatures(2, include_bias=False), StandardScaler(),
                         LogisticRegression(max_iter=4000, C=0.5))
def student_reg():   # same shape, regresses onto teacher logits
    return make_pipeline(PolynomialFeatures(2, include_bias=False), StandardScaler(), Ridge(alpha=1.0))

Xhard, yhard = make2(400, 3)                         # few hard labels
hard = student_clf().fit(Xhard, yhard)
auc_hard = roc_auc_score(ytest, hard.predict_proba(Xtest)[:,1])

Xpool, _ = make2(20000, 5)                           # big UNLABELED pool
soft = np.clip(teacher.predict_proba(Xpool)[:,1], 1e-6, 1-1e-6)
distilled = student_reg().fit(Xpool, np.log(soft/(1-soft)))   # learn the teacher's soft logits
auc_distilled = roc_auc_score(ytest, distilled.predict(Xtest))

print(f"teacher (strong/slow)          AUC {auc_teacher:.3f}")
print(f"student, 400 HARD labels       AUC {auc_hard:.3f}")
print(f"student, 20k teacher SOFT labels AUC {auc_distilled:.3f}  (+{auc_distilled-auc_hard:.3f} over hard)")
plt.figure(figsize=(5.8,3.3))
plt.bar(["teacher","student\n(hard 400)","student\n(distilled)"], [auc_teacher, auc_hard, auc_distilled],
        color=[PURPLE, GRAY, GREEN])
plt.ylabel("test AUC"); plt.ylim(0.7, 0.9); plt.title("distillation lifts the small student toward the teacher"); plt.show()
""")

md(r"""
## Step 28 · The quality-vs-latency tradeoff

The distilled student is a little **below** the teacher but **much cheaper to serve**. That
trade can be a win: if latency is the bottleneck, a 5 ms student at slightly lower AUC beats
a 40 ms teacher you can't afford to run online. (The ms numbers below are illustrative,
matching the lesson.)
""")
code(r"""
serving_ms = {"teacher": 40, "distilled student": 5}
aucs       = {"teacher": auc_teacher, "distilled student": auc_distilled}
plt.figure(figsize=(5.5,3.6))
for name, c in [("teacher", PURPLE), ("distilled student", GREEN)]:
    plt.scatter(serving_ms[name], aucs[name], s=160, color=c, label=name, zorder=3)
    plt.annotate(name, (serving_ms[name], aucs[name]), textcoords="offset points", xytext=(8, -4))
plt.xlabel("serving latency (ms) - lower is better"); plt.ylabel("AUC - higher is better")
plt.title("small AUC drop, big speedup: the distillation tradeoff"); plt.legend(); plt.show()
print(f"teacher: AUC {auc_teacher:.3f} @ ~40 ms   vs   student: AUC {auc_distilled:.3f} @ ~5 ms (~8x faster)")
""")

md(r"""
## Step 29 · The catch — distillation copies the teacher's bias

Distillation makes serving cheaper; it does **not** fix a bad teacher. If the teacher learned
from a biased policy, the student inherits that bias. So keep the teacher as an offline
reference, check student-vs-teacher disagreement on important slices, and **recalibrate**
(Part of M8) — matching logits doesn't guarantee good serving probabilities.
""")
code(r"""
# the student closely tracks the teacher's ranking -> it also copies whatever the teacher got wrong
p_t = teacher.predict_proba(Xtest)[:,1]
p_s = 1/(1+np.exp(-distilled.predict(Xtest)))
corr = np.corrcoef(p_t, p_s)[0,1]
print("correlation between teacher and student scores:", round(corr, 3), "-> student mimics the teacher (bias included)")
plt.figure(figsize=(4.4,4.2))
plt.scatter(p_t, p_s, s=5, alpha=.2, color=BLUE)
plt.plot([0,1],[0,1],"k--"); plt.xlabel("teacher probability"); plt.ylabel("student probability")
plt.title(f"student imitates teacher (corr={corr:.2f})"); plt.show()
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## Recap — the M9 toolkit

**Cold-start (Part A).** New items/users/systems have almost no evidence, so a raw early rate
(2/20 = 10%) is noise. Anchor on a **prior**, then blend in the learned rate in proportion to
evidence: `p = (1-c)·prior + c·learned` with `c = n/(n+k)`. Gate the cold→warm handoff with
**exit criteria** (min impressions, min positives, stable calibration) and log the regime.
This is what keeps ad **budgets** from chasing lucky spikes.

**Transfer (Part B).** With few target labels, a from-scratch model flounders. **Reuse a
related source** (here, its prediction as a feature) to reach the ceiling with ~100 labels
instead of ~10,000 — but validate fit, because a mismatched source causes **negative
transfer** (worse than scratch).

**Distillation (Part C).** Train a small, fast **student** to imitate a strong, slow
**teacher**. **Temperature** exposes the teacher's **dark knowledge** (how "close" the
negatives were), and letting the teacher label a big **unlabeled pool** lifts the student
well above training on a few hard labels — at a fraction of the serving cost. It copies the
teacher's **bias**, so keep evaluating slices and recalibrate.

**Where this connects:** M9 is how you launch responsibly with little data. It leans on M8
(calibrate the blended/distilled scores) and feeds M10 (the implicit, delayed labels these
systems learn from as evidence finally arrives).
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M09 · Cold-start, Transfer & Distillation", "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M09-cold-start-distillation.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
