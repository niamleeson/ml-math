#!/usr/bin/env python3
"""Generate afp/notebooks/M08-calibration-imbalance.ipynb.

A runnable, VERY beginner-friendly Colab notebook for module M8: calibration
(reliability diagrams, ECE, Platt vs isotonic, and why it breaks pCTR x bid),
class imbalance (accuracy trap, class weights, focal loss, resampling +
recalibration), and sparse slices / delayed feedback (shrinkage, censoring).

Granular: small steps, lots of plain-language explanation, print logging, and a
visualization for every idea. Colab-preinstalled libraries only
(pandas/numpy/scikit-learn/matplotlib).

Run: python3 tools/gen-m08-notebook.py
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
# M8 · Calibration & Class Imbalance — Hands-on, Step by Tiny Step

**Companion to lesson M8. Written for someone new to ML.**

In M7 we built a model that predicts **pCTR** (a click probability) and saw that the ad
auction does `pCTR × bid`. That means the probability has to be **honest** — if the model
says `0.20`, clicks should really happen ~20% of the time. This notebook is about making
probabilities honest (**calibration**) and about what happens when the thing you're
predicting is **rare** (**class imbalance**), plus two real-world traps (**sparse slices**
and **delayed feedback**).

**What you'll do (each step has an explanation, logging, and a picture):**
- **Part A · Calibration:** reliability diagrams, the **ECE** number, why a good *ranking*
  can still be a *lying* probability, and two fixes — **Platt** and **isotonic**.
- **Part B · Class imbalance:** why *accuracy* lies when positives are rare, and how
  **class weights / focal loss / resampling** help (and why resampling then needs
  recalibration).
- **Part C · Sparse slices & delayed feedback:** why tiny groups need **shrinkage** and
  why fresh data looks falsely negative.

We use **scikit-learn** — the standard toolbox for calibration (the base model could be
anything, including the PyTorch models from M7). Runs in Colab with no installs. Run each
cell with **Shift+Enter**.
""")

# =================================================================== SETUP
md(r"""
## Step 1 · Setup + a couple of helper functions

Two helpers we'll reuse:
- `reliability(...)` buckets predictions and returns, per bucket, the **average predicted**
  probability and the **actual** rate — the two things a reliability diagram plots.
- `ece(...)` turns those bucket gaps into **one number** (Expected Calibration Error).
Don't worry about the code yet — the next steps explain both with pictures.
""")
code(r"""
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"

def reliability(pred, actual, n_bins=10):
    edges = np.linspace(0, 1, n_bins + 1)
    xs, ys, counts = [], [], []
    for lo, hi in zip(edges[:-1], edges[1:]):
        m = (pred >= lo) & (pred < hi)
        if m.sum():
            xs.append(pred[m].mean()); ys.append(actual[m].mean()); counts.append(int(m.sum()))
    return np.array(xs), np.array(ys), np.array(counts)

def ece(pred, actual, n_bins=10):
    xs, ys, counts = reliability(pred, actual, n_bins)
    return float(np.sum(counts / len(pred) * np.abs(ys - xs)))

print("helpers ready: reliability() and ece()")
""")

md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full notebook, here is **one tiny, hand-traceable toy example for every computing
mechanic** in M8 — calibration, overconfidence, reliability diagrams, ECE, auction value,
Platt and isotonic fixes, imbalance metrics and fixes, sparse-slice smoothing, and delayed
feedback. Each toy uses just a few numbers, prints the intermediate values, pins the answer
with an `assert`, and draws exactly one picture. The at-scale versions follow in Parts A–C.
""")

md(r"""
## ✍️ Toy 1 · what "calibrated" means

**Calibrated** means "when the model says 25%, about 25% happen; when it says 50%, about
50% happen." Trace two tiny buckets by hand: 4 impressions at 25% with 1 click, and 6
impressions at 50% with 3 clicks.
""")
code(r"""
t1_pred = np.array([0.25,0.25,0.25,0.25, 0.50,0.50,0.50,0.50,0.50,0.50])
t1_y = np.array([1,0,0,0, 1,1,1,0,0,0])
t1_low = t1_pred == 0.25                         # -> [True, True, True, True, False, False, False, False, False, False]
t1_high = t1_pred == 0.50                        # -> [False, False, False, False, True, True, True, True, True, True]
t1_low_pred = t1_pred[t1_low].mean()             # -> 0.25
t1_low_actual = t1_y[t1_low].mean()              # -> 0.25
t1_high_pred = t1_pred[t1_high].mean()           # -> 0.50
t1_high_actual = t1_y[t1_high].mean()            # -> 0.50
print("predictions:", t1_pred.tolist())
print("clicks     :", t1_y.tolist())
print("25% bucket: predicted", t1_low_pred, "actual", t1_low_actual)
print("50% bucket: predicted", t1_high_pred, "actual", t1_high_actual)
assert t1_low_pred == t1_low_actual and t1_high_pred == t1_high_actual

t1_xs = np.array([t1_low_pred, t1_high_pred])     # -> [0.25, 0.50]
t1_ys = np.array([t1_low_actual, t1_high_actual]) # -> [0.25, 0.50]
plt.figure(figsize=(4.5, 4))
plt.plot([0, 1], [0, 1], "k--", label="perfect calibration")
plt.scatter(t1_xs, t1_ys, s=[120, 180], color="tab:green", label="toy buckets")
plt.xlabel("average predicted probability"); plt.ylabel("actual click rate")
plt.title("calibrated buckets land on the diagonal"); plt.legend(); plt.show()
""")
md("▶ What you'll see: the 25% bucket has 1/4 clicks and the 50% bucket has 3/6 clicks, so both "
   "points sit exactly on the calibration diagonal.")

md(r"""
## ✍️ Toy 2 · overconfident scores keep the ranking but lie

An overconfident model pushes probabilities toward 0 and 1. The order is unchanged (so ranking
metrics can look fine), but the numbers move away from the true probabilities.
""")
code(r"""
t2_true_p = np.array([0.10,0.20,0.30,0.40,0.60,0.70,0.80,0.90])
t2_logit = np.log(t2_true_p / (1 - t2_true_p))                 # -> [-2.20, -1.39, -0.85, -0.41, 0.41, 0.85, 1.39, 2.20]
t2_raw = 1 / (1 + np.exp(-2.0 * t2_logit))                    # -> [0.012, 0.059, 0.155, 0.308, 0.692, 0.845, 0.941, 0.988]
t2_true_order = np.argsort(t2_true_p)                         # -> [0, 1, 2, 3, 4, 5, 6, 7]
t2_raw_order = np.argsort(t2_raw)                             # -> [0, 1, 2, 3, 4, 5, 6, 7]
t2_avg_move = np.abs(t2_raw - t2_true_p).mean()               # -> 0.1165
print("true probabilities:", t2_true_p.tolist())
print("overconfident raw :", np.round(t2_raw, 3).tolist())
print("true order:", t2_true_order.tolist())
print("raw order :", t2_raw_order.tolist())
print("average probability movement:", round(float(t2_avg_move), 4))
assert np.array_equal(t2_true_order, t2_raw_order) and t2_avg_move > 0.11

plt.figure(figsize=(5, 3.4))
plt.plot(t2_true_p, "o-", label="true p", color="tab:green")
plt.plot(t2_raw, "o-", label="overconfident raw", color="tab:red")
plt.ylabel("probability"); plt.xlabel("item sorted by true p")
plt.title("same order, more extreme probabilities"); plt.legend(); plt.show()
""")
md("▶ What you'll see: the ranking stays `[0,1,2,3,4,5,6,7]`, but the raw probabilities are "
   "pushed toward 0/1 — the calibration problem.")

md(r"""
## ✍️ Toy 3 · reliability diagram buckets by hand

A reliability diagram buckets predictions, then plots each bucket's **average prediction** against
the **actual** click rate. Off the diagonal means the model's probabilities are not honest.
""")
code(r"""
t3_pred = np.array([0.10,0.20,0.20, 0.40,0.50,0.60, 0.80,0.80,0.90,0.90])
t3_y = np.array([0,0,1, 0,1,1, 0,1,1,1])
t3_edges = np.array([0.00, 1/3, 2/3, 1.01])
t3_xs = []
t3_ys = []
t3_counts = []
for t3_lo, t3_hi in zip(t3_edges[:-1], t3_edges[1:]):
    t3_mask = (t3_pred >= t3_lo) & (t3_pred < t3_hi)
    t3_bucket_pred = t3_pred[t3_mask].mean()
    t3_bucket_actual = t3_y[t3_mask].mean()
    t3_bucket_count = int(t3_mask.sum())
    t3_xs.append(t3_bucket_pred)
    t3_ys.append(t3_bucket_actual)
    t3_counts.append(t3_bucket_count)
    print(f"bucket [{t3_lo:.2f},{t3_hi:.2f}): count={t3_bucket_count}, pred={t3_bucket_pred:.3f}, actual={t3_bucket_actual:.3f}")
t3_xs = np.array(t3_xs)                          # -> [0.167, 0.500, 0.850]
t3_ys = np.array(t3_ys)                          # -> [0.333, 0.667, 0.750]
t3_counts = np.array(t3_counts)                  # -> [3, 3, 4]
print("bucket predictions:", np.round(t3_xs, 3).tolist())
print("bucket actuals    :", np.round(t3_ys, 3).tolist())
print("bucket counts     :", t3_counts.tolist())
assert np.allclose(t3_xs, [1/6, 0.5, 0.85]) and np.allclose(t3_ys, [1/3, 2/3, 0.75])

plt.figure(figsize=(4.6, 4.2))
plt.plot([0, 1], [0, 1], "k--", label="honest")
plt.plot(t3_xs, t3_ys, "o-", color="tab:red", label="toy model")
plt.xlabel("bucket avg prediction"); plt.ylabel("bucket actual rate")
plt.title("reliability diagram: off diagonal = miscalibrated"); plt.legend(); plt.show()
""")
md("▶ What you'll see: three bucket dots; none sits exactly on the diagonal, so the model is "
   "miscalibrated bucket by bucket.")

md(r"""
## ✍️ Toy 4 · ECE as weighted bucket gaps

**ECE** turns the reliability diagram into one number: each bucket's absolute gap, weighted by
how many examples are in that bucket, then summed.
""")
code(r"""
t4_pred_rate = np.array([0.20, 0.50, 0.80])
t4_actual_rate = np.array([0.25, 0.50, 0.75])
t4_counts = np.array([4, 4, 2])
t4_total = t4_counts.sum()                         # -> 10
t4_gap = np.abs(t4_actual_rate - t4_pred_rate)      # -> [0.05, 0.00, 0.05]
t4_weight = t4_counts / t4_total                    # -> [0.40, 0.40, 0.20]
t4_contrib = t4_weight * t4_gap                     # -> [0.020, 0.000, 0.010]
t4_ece = t4_contrib.sum()                           # -> 0.030
print("pred rates :", t4_pred_rate.tolist())
print("actual rates:", t4_actual_rate.tolist())
print("counts     :", t4_counts.tolist(), "total:", int(t4_total))
print("gaps       :", np.round(t4_gap, 3).tolist())
print("weights    :", np.round(t4_weight, 3).tolist())
print("contribs   :", np.round(t4_contrib, 3).tolist())
print("ECE        :", round(float(t4_ece), 3))
assert np.isclose(t4_ece, 0.03)

plt.figure(figsize=(4.8, 3.2))
plt.bar(["low", "mid", "high"], t4_contrib, color="tab:orange")
plt.ylabel("weighted gap contribution"); plt.title("ECE = sum of weighted bucket gaps")
plt.show()
""")
md("▶ What you'll see: low and high buckets contribute `0.020 + 0.010`, so ECE is `0.030`.")

md(r"""
## ✍️ Toy 5 · `pCTR × bid` breaks when pCTR is wrong

The auction multiplies probability by bid. If the probability is off, the expected value in
dollars is off too — even for the same bids.
""")
code(r"""
t5_pred_pctr = np.array([0.20,0.30,0.40,0.50,0.60,0.70])
t5_true_ctr = np.array([0.35,0.25,0.55,0.45,0.50,0.80])
t5_bid = np.array([10.0,8.0,6.0,4.0,3.0,2.0])
t5_model_value = t5_pred_pctr * t5_bid             # -> [2.0, 2.4, 2.4, 2.0, 1.8, 1.4]
t5_true_value = t5_true_ctr * t5_bid               # -> [3.5, 2.0, 3.3, 1.8, 1.5, 1.6]
t5_error = t5_true_value - t5_model_value          # -> [1.5, -0.4, 0.9, -0.2, -0.3, 0.2]
t5_worst = int(np.argmax(np.abs(t5_error)))        # -> 0
print("pred pCTR :", t5_pred_pctr.tolist())
print("true CTR  :", t5_true_ctr.tolist())
print("bids      :", t5_bid.tolist())
print("model $   :", np.round(t5_model_value, 2).tolist())
print("reality $ :", np.round(t5_true_value, 2).tolist())
print("error $   :", np.round(t5_error, 2).tolist())
print("worst item:", t5_worst, "model says", t5_model_value[t5_worst], "reality is", t5_true_value[t5_worst])
assert t5_worst == 0 and np.isclose(t5_error[t5_worst], 1.5)

plt.figure(figsize=(5.5, 3.2))
t5_x = np.arange(len(t5_bid))
plt.bar(t5_x - 0.18, t5_model_value, 0.36, label="model pCTR × bid", color="tab:red")
plt.bar(t5_x + 0.18, t5_true_value, 0.36, label="true CTR × bid", color="tab:green")
plt.xlabel("auction item"); plt.ylabel("expected value ($)")
plt.title("wrong pCTR means wrong auction value"); plt.legend(); plt.show()
""")
md("▶ What you'll see: item 0 is undervalued by `$1.50` because the model used 0.20 instead of "
   "the true 0.35.")

md(r"""
## ✍️ Toy 6 · Platt scaling as a two-number sigmoid

Platt scaling learns two numbers, `a` and `b`, then maps a raw score to
`sigmoid(a·score + b)`. Here a tiny grid search picks the best `(a,b)` by log loss.
""")
code(r"""
t6_raw = np.array([0.10,0.20,0.30,0.40,0.60,0.70,0.80,0.90])
t6_y = np.array([0,0,1,0,1,0,1,1])
def t6_sigmoid(t6_z):
    return 1 / (1 + np.exp(-t6_z))
t6_candidates = [(4.0,-2.0), (6.0,-3.0), (8.0,-4.0), (2.0,-1.0)]
t6_losses = []
for t6_a, t6_b in t6_candidates:
    t6_p = t6_sigmoid(t6_a * t6_raw + t6_b)
    t6_loss = -np.mean(t6_y*np.log(t6_p) + (1-t6_y)*np.log(1-t6_p))
    t6_losses.append(t6_loss)
    print(f"a={t6_a:>3.0f}, b={t6_b:>4.0f} -> probs={np.round(t6_p,3).tolist()} -> logloss={t6_loss:.3f}")
t6_losses = np.array(t6_losses)                    # -> [0.533, 0.535, 0.570, 0.580]
t6_best_i = int(np.argmin(t6_losses))              # -> 0
t6_best_a, t6_best_b = t6_candidates[t6_best_i]     # -> (4.0, -2.0)
t6_calibrated = t6_sigmoid(t6_best_a*t6_raw + t6_best_b)  # -> [0.168, 0.231, 0.310, 0.401, 0.599, 0.690, 0.769, 0.832]
print("best (a,b):", (t6_best_a, t6_best_b))
print("calibrated:", np.round(t6_calibrated, 3).tolist())
assert (t6_best_a, t6_best_b) == (4.0, -2.0)

plt.figure(figsize=(5, 3.4))
plt.plot(t6_raw, t6_raw, "o--", color="gray", label="raw score")
plt.plot(t6_raw, t6_calibrated, "o-", color="tab:blue", label="Platt sigmoid")
plt.xlabel("raw score"); plt.ylabel("calibrated probability")
plt.title("Platt scaling: sigmoid(a·score + b)"); plt.legend(); plt.show()
""")
md("▶ What you'll see: the tiny calibration set chooses `(a,b) = (4,-2)`, producing a smooth "
   "sigmoid correction.")

md(r"""
## ✍️ Toy 7 · isotonic calibration pools a non-monotone staircase

Isotonic calibration fits a monotone staircase. If a later bucket has a lower rate than an
earlier one, the pool-adjacent-violators idea merges them and replaces both with their average.
""")
code(r"""
t7_score = np.array([0.1,0.2, 0.3,0.4, 0.5,0.6, 0.8,0.9])
t7_y = np.array([0,0, 1,1, 0,1, 1,1])
t7_block1 = t7_y[0:2].mean()                       # -> 0.00
t7_block2 = t7_y[2:4].mean()                       # -> 1.00
t7_block3 = t7_y[4:6].mean()                       # -> 0.50
t7_block4 = t7_y[6:8].mean()                       # -> 1.00
t7_rates_before = np.array([t7_block1, t7_block2, t7_block3, t7_block4])  # -> [0.0, 1.0, 0.5, 1.0]
t7_pooled = (2*t7_block2 + 2*t7_block3) / 4         # -> 0.75
t7_rates_after = np.array([t7_block1, t7_pooled, t7_pooled, t7_block4])   # -> [0.0, 0.75, 0.75, 1.0]
t7_per_item = np.repeat(t7_rates_after, 2)          # -> [0.0,0.0,0.75,0.75,0.75,0.75,1.0,1.0]
print("scores:", t7_score.tolist())
print("labels:", t7_y.tolist())
print("block rates before:", t7_rates_before.tolist())
print("violation: 1.00 then 0.50 -> pool to", t7_pooled)
print("block rates after :", t7_rates_after.tolist())
print("per-item isotonic :", t7_per_item.tolist())
assert np.all(np.diff(t7_rates_after) >= 0) and np.isclose(t7_pooled, 0.75)

plt.figure(figsize=(5, 3.4))
plt.step([1,2,3,4], t7_rates_before, where="mid", color="tab:red", label="before pooling")
plt.step([1,2,3,4], t7_rates_after, where="mid", color="tab:green", label="isotonic")
plt.xticks([1,2,3,4]); plt.ylim(-0.05, 1.05)
plt.xlabel("score bucket"); plt.ylabel("calibrated probability")
plt.title("isotonic = monotone staircase"); plt.legend(); plt.show()
""")
md("▶ What you'll see: the non-monotone `1.00 → 0.50` steps are pooled into two `0.75` steps, "
   "making the staircase monotone.")

md(r"""
## ✍️ Toy 8 · before vs after calibration payoff

After calibration, ECE should drop while ranking stays the same. This toy compares raw,
Platt-like, and isotonic-like probabilities on the same 8 labels.
""")
code(r"""
t8_y = np.array([1,0,0,0, 1,1,1,0])
t8_raw = np.array([0.10,0.10,0.10,0.10, 0.90,0.90,0.90,0.90])
t8_platt = np.array([0.30,0.30,0.30,0.30, 0.70,0.70,0.70,0.70])
t8_iso = np.array([0.25,0.25,0.25,0.25, 0.75,0.75,0.75,0.75])
def t8_two_bucket_ece(t8_p):
    t8_xs = np.array([t8_p[:4].mean(), t8_p[4:].mean()])
    t8_ys = np.array([t8_y[:4].mean(), t8_y[4:].mean()])
    t8_counts = np.array([4, 4])
    return float(np.sum(t8_counts/8 * np.abs(t8_ys - t8_xs)))
def t8_pair_auc(t8_scores):
    t8_pos = t8_scores[t8_y == 1]
    t8_neg = t8_scores[t8_y == 0]
    t8_wins = [(1 if t8_ps > t8_ns else 0.5 if t8_ps == t8_ns else 0) for t8_ps in t8_pos for t8_ns in t8_neg]
    return float(np.mean(t8_wins))
t8_eces = np.array([t8_two_bucket_ece(t8_raw), t8_two_bucket_ece(t8_platt), t8_two_bucket_ece(t8_iso)])  # -> [0.15, 0.05, 0.00]
t8_aucs = np.array([t8_pair_auc(t8_raw), t8_pair_auc(t8_platt), t8_pair_auc(t8_iso)])                  # -> [0.75, 0.75, 0.75]
print("labels:", t8_y.tolist())
print("raw    ECE/AUC:", round(float(t8_eces[0]), 3), round(float(t8_aucs[0]), 3))
print("Platt  ECE/AUC:", round(float(t8_eces[1]), 3), round(float(t8_aucs[1]), 3))
print("Iso    ECE/AUC:", round(float(t8_eces[2]), 3), round(float(t8_aucs[2]), 3))
assert t8_eces[0] > t8_eces[1] > t8_eces[2] and np.allclose(t8_aucs, t8_aucs[0])

plt.figure(figsize=(6, 3.4))
t8_x = np.arange(3)
plt.bar(t8_x - 0.18, t8_eces, 0.36, label="ECE (lower)", color="tab:orange")
plt.bar(t8_x + 0.18, t8_aucs, 0.36, label="AUC (same)", color="tab:blue")
plt.xticks(t8_x, ["raw", "Platt", "isotonic"]); plt.ylim(0, 1.0)
plt.title("calibration improves ECE, not ranking"); plt.legend(); plt.show()
""")
md("▶ What you'll see: ECE falls from `0.15 → 0.05 → 0.00`, while AUC stays `0.75` for all three.")

md(r"""
## ✍️ Toy 9 · make a rare-positive dataset

For rare positives, most labels are 0. Here 10 tiny feature rows produce only 1 click after
sampling from small probabilities with a seeded RNG.
""")
code(r"""
t9_X = np.array([[0.0,0.0],[0.2,0.1],[0.4,0.1],[0.6,0.2],[0.8,0.2],
                 [1.0,0.3],[0.2,0.8],[0.5,0.7],[0.8,0.8],[1.0,1.0]])
t9_logit = -4.4 + 2.0*t9_X[:,0] + 0.8*t9_X[:,1]   # -> [-4.4, -3.92, -3.52, -3.04, -2.64, -2.16, -3.36, -2.84, -2.16, -1.60]
t9_p = 1 / (1 + np.exp(-t9_logit))                # -> [0.012, 0.019, 0.029, 0.046, 0.067, 0.103, 0.034, 0.055, 0.103, 0.168]
t9_rng = np.random.default_rng(0)
t9_draw = t9_rng.random(len(t9_p))                # -> [0.637, 0.270, 0.041, 0.017, 0.813, 0.913, 0.607, 0.729, 0.544, 0.935]
t9_y = (t9_draw < t9_p).astype(int)               # -> [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
t9_rate = t9_y.mean()                             # -> 0.10
print("features:\n", t9_X)
print("positive probabilities:", np.round(t9_p, 3).tolist())
print("random draws          :", np.round(t9_draw, 3).tolist())
print("labels                :", t9_y.tolist())
print("positive rate         :", round(float(t9_rate), 3))
assert int(t9_y.sum()) == 1 and np.isclose(t9_rate, 0.1)

plt.figure(figsize=(4.6, 3.2))
plt.bar(["negative", "positive"], [(t9_y==0).mean(), (t9_y==1).mean()], color=["lightgray", "tab:green"])
plt.ylabel("share"); plt.title("rare positives: only 1 of 10 clicks"); plt.show()
""")
md("▶ What you'll see: only one of ten labels is positive, so a naive accuracy score can be misleading.")

md(r"""
## ✍️ Toy 10 · the accuracy trap

With rare positives, an all-negative model can have high accuracy while catching none of the
positives. Accuracy looks good; recall reveals the failure.
""")
code(r"""
t10_y = np.array([0,0,0,0,0,0,0,0,0,1])
t10_pred = np.zeros_like(t10_y)                    # -> [0,0,0,0,0,0,0,0,0,0]
t10_correct = (t10_pred == t10_y)                  # -> [True, True, True, True, True, True, True, True, True, False]
t10_accuracy = t10_correct.mean()                 # -> 0.90
t10_true_pos = ((t10_pred == 1) & (t10_y == 1)).sum()  # -> 0
t10_actual_pos = (t10_y == 1).sum()                # -> 1
t10_recall = t10_true_pos / t10_actual_pos         # -> 0.00
print("labels     :", t10_y.tolist())
print("predictions:", t10_pred.tolist())
print("correct?   :", t10_correct.tolist())
print("accuracy   :", round(float(t10_accuracy), 3))
print("recall     :", round(float(t10_recall), 3))
assert np.isclose(t10_accuracy, 0.9) and t10_recall == 0

plt.figure(figsize=(4.8, 3.2))
plt.bar(["true negatives", "missed positives"], [int((t10_y==0).sum()), int(t10_actual_pos)], color=["lightgray", "tab:red"])
plt.ylabel("count"); plt.title("90% accuracy but 0% recall"); plt.show()
""")
md("▶ What you'll see: the do-nothing model gets 9/10 labels correct, but it misses the only positive.")

md(r"""
## ✍️ Toy 11 · PR-AUC and recall focus on positives

Precision-recall metrics ask: as we scan down the ranked list, how many true positives have we
found, and how many predicted positives are correct?
""")
code(r"""
t11_score = np.array([0.90,0.80,0.70,0.60,0.40,0.30,0.20,0.10])
t11_y = np.array([1,0,1,0,0,1,0,0])
t11_order = np.argsort(-t11_score)                 # -> [0,1,2,3,4,5,6,7]
t11_sorted_y = t11_y[t11_order]                    # -> [1,0,1,0,0,1,0,0]
t11_tp = np.cumsum(t11_sorted_y)                   # -> [1,1,2,2,2,3,3,3]
t11_fp = np.cumsum(1 - t11_sorted_y)               # -> [0,1,1,2,3,3,4,5]
t11_precision = t11_tp / (t11_tp + t11_fp)         # -> [1.000,0.500,0.667,0.500,0.400,0.500,0.429,0.375]
t11_recall_curve = t11_tp / t11_tp[-1]             # -> [0.333,0.333,0.667,0.667,0.667,1.000,1.000,1.000]
t11_ap = t11_precision[t11_sorted_y == 1].mean()   # -> 0.722
t11_recall_at_05 = t11_y[t11_score >= 0.50].sum() / t11_y.sum()  # -> 0.667
print("scores sorted order:", t11_order.tolist())
print("labels in that order:", t11_sorted_y.tolist())
print("cum TP:", t11_tp.tolist(), "cum FP:", t11_fp.tolist())
print("precision:", np.round(t11_precision, 3).tolist())
print("recall   :", np.round(t11_recall_curve, 3).tolist())
print("AP:", round(float(t11_ap), 3), "| recall @ score>=0.5:", round(float(t11_recall_at_05), 3))
assert np.isclose(t11_ap, 13/18) and np.isclose(t11_recall_at_05, 2/3)

plt.figure(figsize=(4.8, 3.4))
plt.step(t11_recall_curve, t11_precision, where="post", color="tab:purple")
plt.xlabel("recall"); plt.ylabel("precision"); plt.ylim(0, 1.05)
plt.title("precision-recall curve on 8 examples"); plt.show()
""")
md("▶ What you'll see: AP is `0.722` and recall at threshold 0.5 is `2/3`, which exposes positive-class behavior.")

md(r"""
## ✍️ Toy 12 · class weights make positives count more

Balanced class weights give each class the same total weight. With 6 negatives and 2 positives,
each positive must count 3× as much as each negative.
""")
code(r"""
t12_y = np.array([0,0,0,0,0,0,1,1])
t12_n = len(t12_y)                                  # -> 8
t12_pos = int((t12_y == 1).sum())                   # -> 2
t12_neg = int((t12_y == 0).sum())                   # -> 6
t12_w_pos = t12_n / (2 * t12_pos)                   # -> 2.0
t12_w_neg = t12_n / (2 * t12_neg)                   # -> 0.667
t12_weights = np.where(t12_y == 1, t12_w_pos, t12_w_neg)  # -> [0.667,...,2.0,2.0]
t12_neg_total = t12_weights[t12_y == 0].sum()       # -> 4.0
t12_pos_total = t12_weights[t12_y == 1].sum()       # -> 4.0
print("labels:", t12_y.tolist())
print("counts: negatives", t12_neg, "positives", t12_pos)
print("weights: negative", round(float(t12_w_neg), 3), "positive", round(float(t12_w_pos), 3))
print("per-example weights:", np.round(t12_weights, 3).tolist())
print("total class weight: negatives", round(float(t12_neg_total), 3), "positives", round(float(t12_pos_total), 3))
assert np.isclose(t12_neg_total, t12_pos_total) and np.isclose(t12_w_pos / t12_w_neg, 3.0)

plt.figure(figsize=(4.8, 3.2))
plt.bar(["negatives total", "positives total"], [t12_neg_total, t12_pos_total], color=["lightgray", "tab:green"])
plt.ylabel("total training weight"); plt.title("class weights balance class influence"); plt.show()
""")
md("▶ What you'll see: although there are only 2 positives, weighting makes positives and negatives each contribute total weight 4.")

md(r"""
## ✍️ Toy 13 · focal loss down-weights easy examples

Focal loss multiplies the ordinary loss by `(1-p_t)^γ`, where `p_t` is the model's probability
for the true class. Easy examples have high `p_t`, so their weight becomes tiny.
""")
code(r"""
t13_pt = np.array([0.95,0.80,0.60,0.40,0.20,0.05])
t13_gamma = 2
t13_one_minus = 1 - t13_pt                         # -> [0.05,0.20,0.40,0.60,0.80,0.95]
t13_weight = t13_one_minus ** t13_gamma            # -> [0.0025,0.0400,0.1600,0.3600,0.6400,0.9025]
print("p_t values        :", t13_pt.tolist())
print("1 - p_t           :", np.round(t13_one_minus, 3).tolist())
print("focal weights γ=2 :", np.round(t13_weight, 4).tolist())
print("hard/easy weight ratio:", round(float(t13_weight[-1] / t13_weight[0]), 1))
assert t13_weight[-1] > 300 * t13_weight[0]

plt.figure(figsize=(5, 3.2))
plt.plot(t13_pt, t13_weight, "o-", color="tab:red")
plt.xlabel("p_t (probability assigned to true class)"); plt.ylabel("(1 - p_t)^2")
plt.title("focal loss: easy examples fade out"); plt.show()
""")
md("▶ What you'll see: an easy `p_t=0.95` example gets weight `0.0025`, while a hard `p_t=0.05` "
   "example gets `0.9025`.")

md(r"""
## ✍️ Toy 14 · resampling changes the prior, then recalibration fixes it

Oversampling positives can make the training data look 50/50 even when the real rate is 10%.
The raw probabilities are therefore too high; a prior correction pulls them back down.
""")
code(r"""
t14_real_y = np.array([1,0,0,0,0,0,0,0,0,0])
t14_neg = int((t14_real_y == 0).sum())              # -> 9
t14_pos = int((t14_real_y == 1).sum())              # -> 1
t14_oversampled_y = np.array([1]*t14_neg + [0]*t14_neg)
t14_real_prior = t14_pos / len(t14_real_y)          # -> 0.10
t14_train_prior = t14_oversampled_y.mean()          # -> 0.50
t14_p_resampled = np.array([0.50,0.60,0.40,0.70,0.30,0.80])
t14_odds_resampled = t14_p_resampled / (1 - t14_p_resampled)  # -> [1.000,1.500,0.667,2.333,0.429,4.000]
t14_prior_ratio = (t14_real_prior/(1-t14_real_prior)) / (t14_train_prior/(1-t14_train_prior))  # -> 0.111
t14_odds_fixed = t14_odds_resampled * t14_prior_ratio  # -> [0.111,0.167,0.074,0.259,0.048,0.444]
t14_p_fixed = t14_odds_fixed / (1 + t14_odds_fixed)    # -> [0.100,0.143,0.069,0.206,0.045,0.308]
print("real labels:", t14_real_y.tolist(), "real prior:", round(float(t14_real_prior), 3))
print("oversampled labels have prior:", round(float(t14_train_prior), 3))
print("raw probs after oversampling:", t14_p_resampled.tolist())
print("prior ratio:", round(float(t14_prior_ratio), 3))
print("recalibrated probs:", np.round(t14_p_fixed, 3).tolist())
print("mean before/after:", round(float(t14_p_resampled.mean()), 3), "->", round(float(t14_p_fixed.mean()), 3))
assert np.isclose(t14_p_fixed[0], 0.1) and t14_p_fixed.mean() < t14_p_resampled.mean()

plt.figure(figsize=(5.5, 3.2))
t14_x = np.arange(len(t14_p_resampled))
plt.bar(t14_x - 0.18, t14_p_resampled, 0.36, label="after oversampling", color="tab:red")
plt.bar(t14_x + 0.18, t14_p_fixed, 0.36, label="after recalibration", color="tab:green")
plt.axhline(t14_real_prior, color="black", linestyle="--", label="real prior")
plt.xlabel("validation item"); plt.ylabel("probability"); plt.title("resampling inflates probabilities")
plt.legend(); plt.show()
""")
md("▶ What you'll see: oversampled probabilities average `0.55`, then prior correction drops them near the real `0.10` rate.")

md(r"""
## ✍️ Toy 15 · sparse-slice smoothing (shrinkage)

A tiny slice's raw rate is noisy. Shrinkage mixes the slice rate with the global rate, pulling
small slices more than large slices.
""")
code(r"""
t15_global = 0.05
t15_m = 50
t15_slices = np.array([[1,10],[4,40],[5,100],[12,200],[40,800],[90,2000]], float)
t15_clicks = t15_slices[:, 0]                      # -> [1,4,5,12,40,90]
t15_imps = t15_slices[:, 1]                        # -> [10,40,100,200,800,2000]
t15_raw = t15_clicks / t15_imps                    # -> [0.100,0.100,0.050,0.060,0.050,0.045]
t15_shrunk = (t15_clicks + t15_m*t15_global) / (t15_imps + t15_m)  # -> [0.058,0.072,0.050,0.058,0.050,0.045]
t15_pull_small = abs(t15_raw[0] - t15_shrunk[0])    # -> 0.0417
t15_pull_big = abs(t15_raw[-1] - t15_shrunk[-1])    # -> 0.0001
print("clicks/imps:\n", t15_slices.astype(int))
print("raw rates   :", np.round(t15_raw, 3).tolist())
print("shrunk rates:", np.round(t15_shrunk, 3).tolist())
print("pull on smallest slice:", round(float(t15_pull_small), 4))
print("pull on biggest slice :", round(float(t15_pull_big), 4))
assert t15_pull_small > 100 * t15_pull_big and np.isclose(t15_shrunk[2], t15_global)

plt.figure(figsize=(5.5, 3.2))
plt.plot(t15_imps, t15_raw, "o-", color="tab:red", label="raw slice rate")
plt.plot(t15_imps, t15_shrunk, "o-", color="tab:green", label="shrunk estimate")
plt.axhline(t15_global, color="gray", linestyle="--", label="global")
plt.xscale("log"); plt.xlabel("slice impressions"); plt.ylabel("rate")
plt.title("small slices shrink toward global"); plt.legend(); plt.show()
""")
md("▶ What you'll see: the 10-impression slice moves from `0.100` to `0.058`, while the 2000-impression slice barely moves.")

md(r"""
## ✍️ Toy 16 · delayed feedback makes fresh rows look negative

If the click arrives after you check the label, the row looks like a negative for now. Fresh
impressions are therefore biased downward unless you wait for the attribution window.
""")
code(r"""
t16_age_hours = np.array([1,2,3,4, 12,14,18,22], float)
t16_will_convert = np.array([1,0,1,0, 1,0,1,0], dtype=bool)
t16_delay_hours = np.array([5,1,6,2, 4,3,10,1], float)
t16_observed_now = t16_will_convert & (t16_delay_hours <= t16_age_hours)  # -> [False,False,False,False,True,False,True,False]
t16_fresh = t16_age_hours < 6                         # -> [True,True,True,True,False,False,False,False]
t16_old = ~t16_fresh                                  # -> [False,False,False,False,True,True,True,True]
t16_fresh_true = t16_will_convert[t16_fresh].mean()   # -> 0.50
t16_fresh_obs = t16_observed_now[t16_fresh].mean()    # -> 0.00
t16_old_true = t16_will_convert[t16_old].mean()       # -> 0.50
t16_old_obs = t16_observed_now[t16_old].mean()        # -> 0.50
print("age hours     :", t16_age_hours.tolist())
print("will convert? :", t16_will_convert.astype(int).tolist())
print("delay hours   :", t16_delay_hours.tolist())
print("observed now? :", t16_observed_now.astype(int).tolist())
print("fresh true/observed:", t16_fresh_true, "->", t16_fresh_obs)
print("old true/observed  :", t16_old_true, "->", t16_old_obs)
assert t16_fresh_obs < t16_fresh_true and t16_old_obs == t16_old_true

plt.figure(figsize=(5, 3.2))
t16_x = np.arange(2)
plt.bar(t16_x - 0.18, [t16_fresh_true, t16_old_true], 0.36, label="eventual true", color="tab:green")
plt.bar(t16_x + 0.18, [t16_fresh_obs, t16_old_obs], 0.36, label="observed now", color="tab:red")
plt.xticks(t16_x, ["fresh (<6h)", "old (>=6h)"]); plt.ylabel("conversion rate")
plt.title("fresh labels are censored by delay"); plt.legend(); plt.show()
""")
md("▶ What you'll see: fresh rows truly convert at 50%, but observed-now says 0% because their clicks have not arrived yet.")

# =================================================================== PART A
md("---\n# Part A · Calibration")

md(r"""
## Step 2 · What does "calibrated" mean? (make data with a KNOWN truth)

**Calibrated** = the number means what it says. A weather forecaster who says "70% rain"
should be right about 70% of the time. To check a model we need to know the *real*
probability, so (like M7) we build synthetic data where **we** set the true click
probability `true_p` for each impression, then flip a coin to get the click.
""")
code(r"""
rng = np.random.default_rng(0)
N = 12000
x1, x2, x3 = rng.uniform(0,1,N), rng.uniform(0,1,N), rng.uniform(0,1,N)
true_p = 1 / (1 + np.exp(-(-1.0 + 2.5*x1 + 1.5*x2 - 1.0*x3)))   # the REAL click probability
y = (rng.random(N) < true_p).astype(int)                        # the click (0/1)

# split: train the model / hold out a "calibration" set / final test
tr, cal, te = slice(0, 7000), slice(7000, 9500), slice(9500, N)
print("impressions:", N, "| overall click rate:", round(y.mean(), 3))
print("true_p ranges from", round(true_p.min(),3), "to", round(true_p.max(),3))
""")

md(r"""
## Step 3 · An **overconfident** model (ranks great, lies about probabilities)

Many real models — boosted trees, deep nets — come out **overconfident**: they push scores
too close to 0 and 1. We simulate that by *sharpening* the true probabilities. Crucially
this keeps the **ranking** identical (it's a monotone transform), so **AUC stays high** —
the model orders impressions perfectly, yet its numbers are wrong. That's the trap M8 is
about.
""")
code(r"""
from sklearn.metrics import roc_auc_score
def logit(p): p = np.clip(p, 1e-6, 1-1e-6); return np.log(p/(1-p))

raw_all = 1 / (1 + np.exp(-2.2 * logit(true_p)))     # sharpen: same order, overconfident numbers
raw      = raw_all[te]                                # scores on the test set
raw_cal  = raw_all[cal]                               # scores on the calibration set

print("AUC (ranking quality):", round(roc_auc_score(y[te], raw), 3), "-> ranks fine")
print("ECE (calibration error):", round(ece(raw, y[te]), 3), "-> but the probabilities are OFF")
""")

md(r"""
## Step 4 · The reliability diagram — *see* the miscalibration

Bucket impressions by predicted probability; for each bucket plot **predicted** (x) vs
**actual** rate (y). Honest = dots on the diagonal. An overconfident model bows **away**
from the line: where it predicts high it's too high, where it predicts low it's too low.
""")
code(r"""
xs, ys, counts = reliability(raw, y[te])
plt.figure(figsize=(4.8, 4.6))
plt.plot([0,1],[0,1], "k--", label="perfectly honest")
plt.plot(xs, ys, "o-", color=RED, label="overconfident model")
plt.xlabel("predicted probability"); plt.ylabel("actual click rate")
plt.title("reliability diagram — off the diagonal = miscalibrated"); plt.legend(); plt.show()
print("bucket-by-bucket (predicted vs actual):")
for x, yv, c in zip(xs, ys, counts):
    print(f"  predicted {x:.2f} -> actual {yv:.2f}   ({c} impressions)")
""")

md(r"""
## Step 5 · Turn the picture into one number — **ECE**

**Expected Calibration Error** = the average gap between predicted and actual, weighted by
how many impressions are in each bucket:
$$\text{ECE}=\sum_b \frac{n_b}{n}\,\big|\text{actual}_b-\text{predicted}_b\big|$$
Lower is better; 0 = perfectly honest. We print each bucket's contribution so you see where
the error comes from.
""")
code(r"""
xs, ys, counts = reliability(raw, y[te])
print(f"{'bucket pred':>11}{'actual':>8}{'gap':>7}{'weight':>8}{'contrib':>9}")
total = 0
for x, yv, c in zip(xs, ys, counts):
    w = c/len(raw); contrib = w*abs(yv-x); total += contrib
    print(f"{x:>11.2f}{yv:>8.2f}{abs(yv-x):>7.2f}{w:>8.2f}{contrib:>9.3f}")
print(f"\nECE (sum of contributions) = {total:.3f}")
""")

md(r"""
## Step 6 · Why it matters — it breaks `pCTR × bid`

The auction multiplies the probability by the bid. If the model says **0.20** but the truth
is **0.38**, then with a \$10 bid the auction computes \$2.00 of expected value when it's
really \$3.80 — it will **under-spend** on this ad. Wrong probabilities = wrong money,
even though the *ranking* was fine.
""")
code(r"""
# find a bucket where the model is clearly off and show the dollar consequence
xs, ys, counts = reliability(raw, y[te])
i = int(np.argmax(np.abs(ys - xs)))          # the most miscalibrated bucket
bid = 10.0
print(f"impressions the model scored ~{xs[i]:.2f}:")
print(f"  model says value = pCTR x bid = {xs[i]:.2f} x ${bid:.0f} = ${xs[i]*bid:.2f}")
print(f"  reality          =            = {ys[i]:.2f} x ${bid:.0f} = ${ys[i]*bid:.2f}")
plt.figure(figsize=(4.5,3))
plt.bar(["model says", "reality"], [xs[i]*bid, ys[i]*bid], color=[RED, GREEN])
plt.ylabel("expected value ($)"); plt.title("miscalibration -> wrong auction value"); plt.show()
""")

md(r"""
## Step 7 · Fix #1 — **Platt scaling** (a sigmoid correction)

The fix: learn a correction on a **held-out calibration set** (never the training data).
**Platt scaling** fits a small logistic regression that maps the raw score to an honest
probability: `p = sigmoid(a·score + b)`. It's just two numbers (`a`, `b`), so it's stable
even with little data — but it assumes the correction is a smooth S-shape.
""")
code(r"""
from sklearn.linear_model import LogisticRegression
platt = LogisticRegression().fit(raw_cal.reshape(-1,1), y[cal])   # learn a, b on the CAL set
p_platt = platt.predict_proba(raw.reshape(-1,1))[:, 1]            # apply to the test scores
print("a =", round(platt.coef_[0,0],2), " b =", round(platt.intercept_[0],2))
print("ECE   raw:", round(ece(raw, y[te]),3), "->  Platt:", round(ece(p_platt, y[te]),3))
print("AUC   raw:", round(roc_auc_score(y[te], raw),3), "->  Platt:", round(roc_auc_score(y[te], p_platt),3), "(ranking unchanged)")
""")

md(r"""
## Step 8 · Fix #2 — **Isotonic** calibration (a flexible staircase)

**Isotonic regression** fits a flexible **monotone step function** instead of a fixed
S-shape. It can correct any monotone distortion, so it's more powerful — but it needs
**more** calibration data or it overfits into a jagged staircase. Use Platt with little
data, isotonic with plenty.
""")
code(r"""
from sklearn.isotonic import IsotonicRegression
iso = IsotonicRegression(out_of_bounds="clip").fit(raw_cal, y[cal])
p_iso = iso.predict(raw)
print("ECE   raw:", round(ece(raw, y[te]),3),
      " Platt:", round(ece(p_platt, y[te]),3),
      " Isotonic:", round(ece(p_iso, y[te]),3))
""")

md(r"""
## Step 9 · Before vs after — the payoff

All three reliability curves together. Both corrections pull the dots onto the diagonal
(honest), and the **AUC table proves the ranking was not harmed** — calibration only fixed
the *numbers*, not the *order*.
""")
code(r"""
fig, ax = plt.subplots(1, 2, figsize=(11, 4.3))
ax[0].plot([0,1],[0,1], "k--", label="honest")
for p, name, c in [(raw,"raw (overconfident)",RED), (p_platt,"Platt",BLUE), (p_iso,"isotonic",GREEN)]:
    xs, ys, _ = reliability(p, y[te]); ax[0].plot(xs, ys, "o-", color=c, label=name)
ax[0].set_xlabel("predicted"); ax[0].set_ylabel("actual"); ax[0].legend(); ax[0].set_title("reliability: before vs after")

names = ["raw", "Platt", "isotonic"]
eces = [ece(raw,y[te]), ece(p_platt,y[te]), ece(p_iso,y[te])]
aucs = [roc_auc_score(y[te],raw), roc_auc_score(y[te],p_platt), roc_auc_score(y[te],p_iso)]
xb = np.arange(3)
ax[1].bar(xb-0.2, eces, 0.4, color=GOLD, label="ECE (lower=better)")
ax[1].bar(xb+0.2, aucs, 0.4, color=BLUE, label="AUC (unchanged)")
ax[1].set_xticks(xb); ax[1].set_xticklabels(names); ax[1].legend(); ax[1].set_title("ECE drops, AUC stays")
plt.show()
print("Platt vs isotonic: Platt = smooth S-curve, few params, good with little data;")
print("isotonic = flexible staircase, needs more data, can overfit tiny calibration sets.")
""")

# =================================================================== PART B
md("---\n# Part B · Class imbalance")

md(r"""
## Step 10 · Make a **rare-positive** dataset

Clicks are rare. We build data where only about **3%** of impressions are positive — and
immediately hit the trap.
""")
code(r"""
rng2 = np.random.default_rng(1)
M = 20000
f1, f2 = rng2.uniform(0,1,M), rng2.uniform(0,1,M)
p_pos = 1 / (1 + np.exp(-(-6.4 + 3.0*f1 + 2.0*f2)))    # rare positives
yb = (rng2.random(M) < p_pos).astype(int)
Xb = np.c_[f1, f2]
t, v = slice(0, 15000), slice(15000, M)
print("positive (click) rate:", round(yb.mean(), 3), " -> very imbalanced")
plt.figure(figsize=(4.5,3)); plt.bar(["no click","click"], [ (yb==0).mean(), yb.mean() ], color=[GRAY, GREEN])
plt.ylabel("share"); plt.title("only a few percent are positive"); plt.show()
""")

md(r"""
## Step 11 · The accuracy trap — a "model" that does nothing looks great

Train a normal model and look at **accuracy**. Because positives are rare, a model that
basically predicts "no click" for everyone scores high accuracy — but its **recall**
(fraction of real clicks it catches) is near **zero**. Accuracy is the wrong metric here.
""")
code(r"""
from sklearn.metrics import recall_score, average_precision_score, accuracy_score
naive = LogisticRegression().fit(Xb[t], yb[t])
pv = naive.predict_proba(Xb[v])[:, 1]
pred_label = (pv > 0.5).astype(int)
print("accuracy:", round(accuracy_score(yb[v], pred_label), 3), " <- looks amazing")
print("recall  :", round(recall_score(yb[v], pred_label), 3), " <- but it catches almost NO real clicks")
print("(a do-nothing 'always no' model would score accuracy", round((yb[v]==0).mean(),3), "too)")
""")

md(r"""
## Step 12 · Use honest metrics — PR-AUC and recall

For rare positives, use **precision-recall AUC** (PR-AUC) and **recall at your threshold**,
not accuracy. The precision-recall curve shows the trade-off; PR-AUC summarizes it (higher
is better; a random model scores about the positive rate).
""")
code(r"""
from sklearn.metrics import precision_recall_curve
prec, rec, _ = precision_recall_curve(yb[v], pv)
print("PR-AUC:", round(average_precision_score(yb[v], pv), 3), " (random baseline ~", round(yb[v].mean(),3), ")")
plt.figure(figsize=(5,3.4)); plt.plot(rec, prec, color=PURPLE)
plt.axhline(yb[v].mean(), color=GRAY, ls="--", label="random")
plt.xlabel("recall"); plt.ylabel("precision"); plt.legend(); plt.title("precision-recall curve"); plt.show()
""")

md(r"""
## Step 13 · Fix — **class weights** (make rare positives count more)

The simplest fix: tell the model each positive is worth many negatives, so ignoring them
costs a lot of loss. In scikit-learn that's `class_weight="balanced"`. Recall jumps.
""")
code(r"""
weighted = LogisticRegression(class_weight="balanced").fit(Xb[t], yb[t])
pw = weighted.predict_proba(Xb[v])[:, 1]
print("recall  @0.5  ->  naive:", round(recall_score(yb[v], pv>0.5),3),
      " weighted:", round(recall_score(yb[v], pw>0.5),3))
plt.figure(figsize=(4.6,3))
plt.bar(["naive","class-weighted"], [recall_score(yb[v], pv>0.5), recall_score(yb[v], pw>0.5)], color=[GRAY, GREEN])
plt.ylabel("recall @0.5"); plt.title("class weights expose the rare positives"); plt.show()
""")

md(r"""
## Step 14 · **Focal loss** — the idea, visualized

Focal loss is another lever: it **down-weights easy examples** so training focuses on the
hard, confusing ones. The factor is $(1-p_t)^\gamma$, where $p_t$ is the probability the
model gave the *true* class. An easy example (high $p_t$) gets a tiny weight; a hard one
(low $p_t$) keeps almost full weight. We plot that factor so you can see it.
""")
code(r"""
pt = np.linspace(0.01, 0.99, 200)
plt.figure(figsize=(5.5,3.4))
for gamma, c in [(0, GRAY), (1, BLUE), (2, GREEN), (5, RED)]:
    plt.plot(pt, (1-pt)**gamma, color=c, label=f"gamma={gamma}")
plt.xlabel("p_t  (model's confidence on the TRUE class)"); plt.ylabel("weight on this example")
plt.title("focal loss down-weights easy examples (high p_t)"); plt.legend(); plt.show()
print("gamma=0 -> ordinary loss (all equal). Bigger gamma -> easy examples fade, hard ones dominate.")
""")

md(r"""
## Step 15 · **Resampling** — and why it then needs recalibration

Another fix is to **oversample** positives until the training set is balanced. It helps the
model learn the boundary, but it **changes the prior**: the model now thinks positives are
common, so its raw probabilities come out **way too high**. You must **recalibrate** on
real-rate data before using the numbers. We show the inflation, then fix it with Part A's
Platt scaling.
""")
code(r"""
# oversample positives in the training set to ~50/50
pos = np.where(yb[t]==1)[0]; neg = np.where(yb[t]==0)[0]
pos_os = rng2.choice(pos, size=len(neg), replace=True)      # duplicate positives up to #negatives
idx = np.concatenate([neg, pos_os]); rng2.shuffle(idx)
resampled = LogisticRegression().fit(Xb[t][idx], yb[t][idx])
p_res = resampled.predict_proba(Xb[v])[:, 1]
print("true positive rate:", round(yb[v].mean(),3))
print("mean predicted prob after oversampling:", round(p_res.mean(),3), " <- inflated ~", round(p_res.mean()/yb[v].mean(),1), "x")

# recalibrate back to the real rate with Platt (fit on a real-rate slice)
recal = LogisticRegression().fit(p_res.reshape(-1,1), yb[v])   # (demo: fit on real-rate data)
p_fixed = recal.predict_proba(p_res.reshape(-1,1))[:,1]
print("mean predicted prob after recalibration:", round(p_fixed.mean(),3), " <- back near the true rate")
plt.figure(figsize=(5.5,3))
plt.hist(p_res, bins=30, alpha=.6, color=RED, label="after oversampling (inflated)")
plt.hist(p_fixed, bins=30, alpha=.6, color=GREEN, label="after recalibration")
plt.axvline(yb[v].mean(), color="k", ls="--", label="true rate")
plt.legend(); plt.title("resampling inflates probabilities -> recalibrate"); plt.xlabel("predicted prob"); plt.show()
""")

# =================================================================== PART C
md("---\n# Part C · Sparse slices & delayed feedback")

md(r"""
## Step 16 · Sparse slices — don't trust a tiny group's raw rate

Calibration can be great overall but wrong on a small **slice** (one country, a new
advertiser). If a slice has **2 clicks in 20 impressions**, its observed rate is 10% — but
with only 20 samples that's noisy. The fix is **shrinkage**: pull the tiny slice's estimate
toward the global rate, trusting it more as it gets more data:
$$\hat p_{\text{slice}}=\frac{n\cdot\bar p_{\text{slice}} + m\cdot p_{\text{global}}}{n+m}$$
""")
code(r"""
global_rate = 0.05
def shrink(clicks, imps, m=50, glob=global_rate):
    return (clicks + m*glob) / (imps + m)

for clicks, imps in [(2, 20), (30, 500), (900, 20000)]:
    raw_rate = clicks/imps
    print(f"slice with {clicks:>3} clicks / {imps:>5} imps: raw {raw_rate:.3f} -> shrunk {shrink(clicks,imps):.3f}")

sizes = [20, 100, 500, 2000, 20000]
raws  = [2/20, 8/100, 30/500, 110/2000, 900/20000]   # noisy small slices, steadier big ones
shr   = [shrink(r*n, n) for r, n in zip(raws, sizes)]
plt.figure(figsize=(6,3.2))
plt.plot(sizes, raws, "o-", color=RED, label="raw slice rate (noisy)")
plt.plot(sizes, shr, "o-", color=GREEN, label="shrunk toward global")
plt.axhline(global_rate, color=GRAY, ls="--", label="global rate")
plt.xscale("log"); plt.xlabel("slice size (log)"); plt.ylabel("estimated rate"); plt.legend()
plt.title("small slices get pulled toward global; big slices trusted"); plt.show()
""")

md(r"""
## Step 17 · Delayed feedback — fresh data looks falsely negative

A click or conversion can arrive **hours later**. If you check labels *now*, recent
impressions look like "no click" only because the click **hasn't happened yet**. Training
on those biases probabilities **downward** for fresh cohorts. The fix (same as leakage): use
an **attribution window** and **exclude** rows whose window hasn't elapsed ("censored").
""")
code(r"""
# each impression eventually converts with prob 0.20, but the click arrives after a random delay
rng3 = np.random.default_rng(5)
K = 4000
age_hours = rng3.uniform(0, 24, K)                 # how long ago the impression happened
will_convert = rng3.random(K) < 0.20
delay = rng3.exponential(6, K)                     # click arrives this many hours after impression
observed_now = will_convert & (delay <= age_hours) # only counts if the click already arrived

# observed conversion rate by how fresh the impression is
bins = np.linspace(0, 24, 9)
obs, true = [], []
for lo, hi in zip(bins[:-1], bins[1:]):
    m = (age_hours>=lo) & (age_hours<hi)
    obs.append(observed_now[m].mean()); true.append(will_convert[m].mean())
centers = (bins[:-1]+bins[1:])/2
plt.figure(figsize=(6,3.2))
plt.plot(centers, true, "o-", color=GREEN, label="eventual (true) rate")
plt.plot(centers, obs, "o-", color=RED, label="observed NOW")
plt.xlabel("impression age (hours)"); plt.ylabel("conversion rate"); plt.legend()
plt.title("fresh impressions look falsely negative (labels still pending)"); plt.show()
print("young impressions: observed rate far below the eventual rate -> exclude censored rows or model the delay.")
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## Recap — the M8 toolkit

**Calibration (Part A).** A model can *rank* perfectly yet *lie* about probabilities.
Check it with a **reliability diagram** and one number, **ECE**. Fix it on a held-out set
with **Platt** (smooth S-curve, little data) or **isotonic** (flexible staircase, more
data). Calibration lowers ECE while leaving AUC unchanged — and it's what makes
`pCTR × bid` trustworthy.

**Class imbalance (Part B).** With rare positives, **accuracy lies** — use **PR-AUC** and
**recall**. Expose the rare class with **class weights** or **focal loss** (down-weights
easy examples); **resampling** works too but **changes the prior**, so **recalibrate**
afterward.

**Sparse slices & delayed feedback (Part C).** Don't trust a tiny slice's raw rate — **shrink**
it toward the global rate. And remember fresh data looks **falsely negative** because labels
are still arriving — use an **attribution window** and drop censored rows.

**Where this connects:** M8 is the safety layer on top of the M7 ranker — it makes the
probabilities honest before they hit the auction. Next, M9 handles brand-new items/users
(cold-start), and M10 handles the messy implicit labels these systems learn from.
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M08 · Calibration & Class Imbalance", "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M08-calibration-imbalance.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
