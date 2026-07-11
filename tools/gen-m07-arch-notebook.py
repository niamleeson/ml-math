#!/usr/bin/env python3
"""Generate afp/notebooks/M07-production-architecture.ipynb.

Implements the M7 "common default path" flowchart in REAL PyTorch, for a new
student: DIN attention over user history, a DCN-V2 cross network, an MMoE
multi-task tower with CTR/VTR/LTR heads, position-as-feature debiasing, and a
final MMR re-ranking stage. Heavy on explanations, print logging, and
visualizations (loss curves, per-head AUC, DIN attention, MMoE gates,
calibration, history ablation, re-ranking before/after).

Runs in Google Colab with no installs (torch is preinstalled there;
numpy/sklearn/matplotlib also standard).

Run: python3 tools/gen-m07-arch-notebook.py
"""
import json, os

cells = []
def md(t):   cells.append({"cell_type": "markdown", "metadata": {}, "source": t.strip("\n").splitlines(keepends=True)})
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": s.strip("\n").splitlines(keepends=True)})

# ------------------------------------------------------------------- intro
md(r"""
# M7 · The Production Ranker, For Real — Implementing the Architecture Flowchart

**Companion to lesson M7. For a new student who wants the *real* thing.**

The other two notebooks used simple models (logistic regression, a plain network) to
teach the *pipeline*. This one **implements the actual architectures** from the M7
"common default path" flowchart, in real **PyTorch** — the same building blocks used in
production ad rankers:

| Flowchart stage | We implement |
|---|---|
| 1 · Feature interactions | **DCN-V2 cross network** (explicit feature crosses) |
| 2 · User history | **DIN** — attention over the user's past behavior |
| 3 · Multiple objectives | **MMoE** — experts + gates → three heads (CTR / VTR / LTR) |
| 4 · Label bias | **position-as-feature** debiasing |
| 5 · Re-ranking | **MMR** diversity re-ranking of the final slate |
| 6 · Evaluate | per-head **AUC** + **calibration** |

Every piece has: a plain-English explanation, **print logging** so you see shapes and
numbers, and a **picture**. Runs top-to-bottom in Colab (PyTorch is already installed
there). Read the note above each cell, then run it (**Shift+Enter**).
""")

# =================================================================== SETUP
md(r"""
## Step 0 · Imports and a quick check

We use **PyTorch** (`torch`) to build the network. In Google Colab it's already
installed. This cell just imports everything and prints the version so we know we're
ready.
""")
code(r"""
import numpy as np
import torch, torch.nn as nn
import matplotlib.pyplot as plt
from sklearn.metrics import roc_auc_score
from sklearn.calibration import calibration_curve
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"
HEADS = ["CTR", "VTR", "LTR"]; HEAD_COLORS = [BLUE, GREEN, PURPLE]

torch.manual_seed(0)
rng = np.random.default_rng(0)
print("PyTorch version:", torch.__version__, "| ready.")
""")

md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full production ranker, here is **one tiny, hand-traceable toy example for every
computational mechanic** in the flowchart — history affinity, label probabilities, train-only
standardization, embedding lookup, DIN attention, DCN crosses, MMoE gates, model assembly,
multi-head loss, AUC, position neutralization, attention/gate diagnostics, calibration, history
ablation, and MMR re-ranking. Each uses only a handful of numbers, prints every intermediate value,
and draws one picture. The at-scale PyTorch version follows in Steps 1–18.
""")

md(r"""
## ✍️ Toy 1 · history affinity by hand (the signal DIN should find)

DIN starts with a user's recent history and the candidate item. The hidden signal in our synthetic
data is **affinity**: the fraction of history slots whose genre matches the candidate genre. Here we
count matches in 8 slots by hand.
""")
code(r"""
toy1_rng = np.random.default_rng(0)
toy1_genres = np.array(["sports", "cooking", "tech", "travel", "finance", "music"])
toy1_hist_ids = np.array([2, 0, 2, 5, 2, 1, 4, 2])
print("history ids:", toy1_hist_ids.tolist())                          # -> [2, 0, 2, 5, 2, 1, 4, 2]
toy1_cand_id = 2
print("candidate id:", int(toy1_cand_id), toy1_genres[toy1_cand_id])    # -> 2 tech
toy1_hist_names = toy1_genres[toy1_hist_ids]
print("history genres:", toy1_hist_names.tolist())                     # -> ['tech','sports','tech','music','tech','cooking','finance','tech']
toy1_match = toy1_hist_ids == toy1_cand_id
print("match mask:", toy1_match.tolist())                              # -> [True, False, True, False, True, False, False, True]
toy1_match_count = toy1_match.sum()
print("matching slots:", int(toy1_match_count))                        # -> 4
toy1_affinity = toy1_match.mean()
print("affinity = matches / history length:", toy1_affinity)           # -> 0.5
toy1_bar_heights = np.ones(len(toy1_hist_ids))
print("bar heights:", toy1_bar_heights.tolist())                       # -> [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
assert toy1_match_count == 4
assert np.isclose(toy1_affinity, 0.5)

plt.figure(figsize=(6, 2.6))
plt.bar(np.arange(len(toy1_hist_ids)), toy1_bar_heights, color=np.where(toy1_match, "seagreen", "lightgray"))
plt.xticks(np.arange(len(toy1_hist_ids)), toy1_hist_names, rotation=30)
plt.yticks([])
plt.title("green history slots match the candidate genre")
plt.show()
""")
md("▶ What you'll see: 4 of 8 history items are `tech`, so affinity is `4/8 = 0.5`. Step 1 creates this signal at scale.")

md(r"""
## ✍️ Toy 2 · label probabilities from features + position

The notebook invents three outcomes (CTR/VTR/LTR) with a sigmoid: weighted features → logit →
probability → Bernoulli label. Position lowers CTR/VTR, while affinity helps all heads.
""")
code(r"""
toy2_rng = np.random.default_rng(0)
toy2_relevance = np.array([0.1, 0.9, 0.6, 0.2, 0.8, 0.4])
print("relevance:", toy2_relevance.tolist())                           # -> [0.1, 0.9, 0.6, 0.2, 0.8, 0.4]
toy2_quality = np.array([0.9, 0.8, 0.3, 0.5, 0.7, 0.2])
print("ad quality:", toy2_quality.tolist())                            # -> [0.9, 0.8, 0.3, 0.5, 0.7, 0.2]
toy2_price = np.array([0.2, 0.4, 0.9, 0.1, 0.8, 0.6])
print("price:", toy2_price.tolist())                                   # -> [0.2, 0.4, 0.9, 0.1, 0.8, 0.6]
toy2_is_video = np.array([0, 1, 1, 0, 1, 0])
print("is video:", toy2_is_video.tolist())                             # -> [0, 1, 1, 0, 1, 0]
toy2_position = np.array([1, 2, 5, 8, 3, 10])
print("position:", toy2_position.tolist())                             # -> [1, 2, 5, 8, 3, 10]
toy2_affinity = np.array([0.0, 0.75, 0.5, 0.25, 1.0, 0.0])
print("affinity:", toy2_affinity.tolist())                             # -> [0.0, 0.75, 0.5, 0.25, 1.0, 0.0]
toy2_ctr_logit = -1.8 + 2.2 * toy2_relevance + 1.0 * toy2_quality - 0.18 * toy2_position + 3.0 * toy2_affinity
print("CTR logits:", np.round(toy2_ctr_logit, 3).tolist())             # -> [-0.86, 2.87, 0.42, -1.55, 3.12, -2.52]
toy2_ctr_prob = 1 / (1 + np.exp(-toy2_ctr_logit))
print("CTR probabilities:", np.round(toy2_ctr_prob, 3).tolist())       # -> [0.297, 0.946, 0.603, 0.175, 0.958, 0.074]
toy2_vtr_logit = -1.4 + 0.8 * toy2_quality + 2.2 * toy2_is_video - 0.10 * toy2_position + 2.4 * toy2_affinity
print("VTR logits:", np.round(toy2_vtr_logit, 3).tolist())             # -> [-0.78, 3.04, 1.74, -1.2, 3.46, -2.24]
toy2_vtr_prob = 1 / (1 + np.exp(-toy2_vtr_logit))
print("VTR probabilities:", np.round(toy2_vtr_prob, 3).tolist())       # -> [0.314, 0.954, 0.851, 0.231, 0.97, 0.096]
toy2_ltr_logit = -2.2 + 2.2 * toy2_relevance + 1.6 * toy2_price + 2.2 * toy2_affinity
print("LTR logits:", np.round(toy2_ltr_logit, 3).tolist())             # -> [-1.66, 2.07, 1.66, -1.05, 3.04, -0.36]
toy2_ltr_prob = 1 / (1 + np.exp(-toy2_ltr_logit))
print("LTR probabilities:", np.round(toy2_ltr_prob, 3).tolist())       # -> [0.16, 0.888, 0.84, 0.259, 0.954, 0.411]
toy2_click_draw = toy2_rng.random(6)
print("click random draws:", np.round(toy2_click_draw, 3).tolist())    # -> [0.637, 0.27, 0.041, 0.017, 0.813, 0.913]
toy2_view_draw = toy2_rng.random(6)
print("view random draws:", np.round(toy2_view_draw, 3).tolist())      # -> [0.607, 0.729, 0.544, 0.935, 0.816, 0.003]
toy2_lead_draw = toy2_rng.random(6)
print("lead random draws:", np.round(toy2_lead_draw, 3).tolist())      # -> [0.857, 0.034, 0.73, 0.176, 0.863, 0.541]
toy2_click = (toy2_click_draw < toy2_ctr_prob).astype(int)
print("click labels:", toy2_click.tolist())                            # -> [0, 1, 1, 1, 1, 0]
toy2_view = (toy2_view_draw < toy2_vtr_prob).astype(int)
print("view labels:", toy2_view.tolist())                              # -> [0, 1, 1, 0, 1, 1]
toy2_lead = (toy2_lead_draw < toy2_ltr_prob).astype(int)
print("lead labels:", toy2_lead.tolist())                              # -> [0, 1, 1, 1, 1, 0]
toy2_base_rates = np.array([toy2_click.mean(), toy2_view.mean(), toy2_lead.mean()])
print("base rates:", np.round(toy2_base_rates, 3).tolist())            # -> [0.667, 0.667, 0.667]
assert toy2_click.tolist() == [0, 1, 1, 1, 1, 0]
assert np.allclose(toy2_base_rates, [2/3, 2/3, 2/3])

plt.figure(figsize=(4.5, 3))
plt.bar(["CTR", "VTR", "LTR"], toy2_base_rates, color=["#4C72B0", "#55A868", "#8172B3"])
plt.ylim(0, 1)
plt.ylabel("positive label rate")
plt.title("tiny generated labels per head")
plt.show()
""")
md("▶ What you'll see: features become logits, logits become probabilities, and seeded draws make labels. Step 2 does this for 9,000 impressions.")

md(r"""
## ✍️ Toy 3 · train-only standardization and split

Dense features are standardized with **training rows only**: subtract the train mean and divide by
the train standard deviation. Test rows use those same train statistics to avoid leakage.
""")
code(r"""
toy3_rng = np.random.default_rng(0)
toy3_dense = np.array([[0.2, 1.0], [0.4, 2.0], [0.6, 3.0], [0.8, 4.0], [1.0, 5.0], [1.2, 6.0]])
print("raw dense rows:", toy3_dense.tolist())                          # -> [[0.2,1.0],...,[1.2,6.0]]
toy3_n_train = 4
print("train rows:", toy3_n_train)                                     # -> 4
toy3_train = toy3_dense[:toy3_n_train]
print("train slice:", toy3_train.tolist())                             # -> first 4 rows
toy3_test = toy3_dense[toy3_n_train:]
print("test slice:", toy3_test.tolist())                               # -> last 2 rows
toy3_mu = toy3_train.mean(axis=0)
print("train mean:", np.round(toy3_mu, 3).tolist())                    # -> [0.5, 2.5]
toy3_sd = toy3_train.std(axis=0)
print("train std:", np.round(toy3_sd, 3).tolist())                     # -> [0.224, 1.118]
toy3_scaled = (toy3_dense - toy3_mu) / toy3_sd
print("standardized rows:", np.round(toy3_scaled, 3).tolist())         # -> train is centered; test uses train stats
toy3_scaled_train_mean = toy3_scaled[:toy3_n_train].mean(axis=0)
print("scaled train mean:", np.round(toy3_scaled_train_mean, 6).tolist()) # -> [0.0, 0.0]
toy3_scaled_train_std = toy3_scaled[:toy3_n_train].std(axis=0)
print("scaled train std:", np.round(toy3_scaled_train_std, 6).tolist()) # -> [1.0, 1.0]
assert np.allclose(toy3_scaled_train_mean, [0.0, 0.0])
assert np.allclose(toy3_scaled_train_std, [1.0, 1.0])

plt.figure(figsize=(5, 3))
plt.scatter(toy3_dense[:, 0], toy3_dense[:, 1], s=80, label="raw")
plt.scatter(toy3_scaled[:, 0], toy3_scaled[:, 1], s=80, label="standardized")
plt.axhline(0, color="black", lw=1)
plt.axvline(0, color="black", lw=1)
plt.legend()
plt.title("same rows before/after train-only scaling")
plt.show()
""")
md("▶ What you'll see: only the first 4 rows define mean/std; after scaling, the train slice has mean 0 and std 1. Step 3 uses the same rule.")

md(r"""
## ✍️ Toy 4 · embedding lookup for genre IDs

An embedding table is just a matrix. Looking up genre ID `2` means selecting row 2. Candidate and
history IDs use the same table so DIN can compare vectors in the same space.
""")
code(r"""
toy4_rng = np.random.default_rng(0)
toy4_table = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [-1.0, 1.0], [-1.0, 0.0], [0.0, -1.0]])
print("embedding table:", toy4_table.tolist())                         # -> 6 rows x 2 numbers
toy4_cand_id = 2
print("candidate id:", toy4_cand_id)                                   # -> 2
toy4_cand_vec = toy4_table[toy4_cand_id]
print("candidate vector:", toy4_cand_vec.tolist())                     # -> [1.0, 1.0]
toy4_hist_ids = np.array([2, 0, 2, 5])
print("history ids:", toy4_hist_ids.tolist())                          # -> [2, 0, 2, 5]
toy4_hist_vecs = toy4_table[toy4_hist_ids]
print("history vectors:", toy4_hist_vecs.tolist())                     # -> [[1,1],[1,0],[1,1],[0,-1]]
toy4_history_mean = toy4_hist_vecs.mean(axis=0)
print("plain history mean:", toy4_history_mean.tolist())               # -> [0.75, 0.25]
assert toy4_cand_vec.tolist() == [1.0, 1.0]
assert np.allclose(toy4_history_mean, [0.75, 0.25])

plt.figure(figsize=(4, 4))
plt.scatter(toy4_table[:, 0], toy4_table[:, 1], s=90, color="lightgray")
for toy4_i, toy4_xy in enumerate(toy4_table):
    plt.text(toy4_xy[0] + 0.04, toy4_xy[1] + 0.04, f"id {toy4_i}")
plt.scatter(*toy4_cand_vec, marker="*", s=260, color="gold", edgecolor="black", label="candidate")
plt.scatter(toy4_hist_vecs[:, 0], toy4_hist_vecs[:, 1], s=120, facecolors="none", edgecolors="seagreen", label="history lookups")
plt.legend()
plt.title("embedding lookup = choose table rows")
plt.show()
""")
md("▶ What you'll see: IDs select rows from one shared table; candidate `2` and history genre `2` land on the same vector. Step 4 learns this table.")

md(r"""
## ✍️ Toy 5 · DIN attention: scores → softmax → weighted history

DIN does not average history equally. It builds candidate/history interaction features, scores each
slot, softmaxes the scores into weights, then takes a weighted sum of history embeddings.
""")
code(r"""
toy5_rng = np.random.default_rng(0)
toy5_q = np.array([1.0, 1.0])
print("candidate query q:", toy5_q.tolist())                           # -> [1.0, 1.0]
toy5_h = np.array([[1.0, 1.0], [1.0, 0.0], [0.0, 1.0], [-1.0, 0.0]])
print("history vectors h:", toy5_h.tolist())                           # -> [[1,1],[1,0],[0,1],[-1,0]]
toy5_q_repeated = np.tile(toy5_q, (len(toy5_h), 1))
print("q repeated per slot:", toy5_q_repeated.tolist())                # -> four copies of q
toy5_diff = toy5_q_repeated - toy5_h
print("q - h:", toy5_diff.tolist())                                    # -> [[0,0],[0,1],[1,0],[2,1]]
toy5_prod = toy5_q_repeated * toy5_h
print("q * h:", toy5_prod.tolist())                                    # -> [[1,1],[1,0],[0,1],[-1,0]]
toy5_feats = np.concatenate([toy5_q_repeated, toy5_h, toy5_diff, toy5_prod], axis=1)
print("interaction features:", toy5_feats.tolist())                    # -> [q,h,q-h,q*h] per slot
toy5_score_weight = np.array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0])
print("score weights:", toy5_score_weight.tolist())                    # -> read only the q*h columns
toy5_scores = toy5_feats @ toy5_score_weight
print("attention scores:", toy5_scores.tolist())                       # -> [2.0, 1.0, 1.0, -1.0]
toy5_shifted = toy5_scores - toy5_scores.max()
print("shifted scores:", toy5_shifted.tolist())                        # -> [0.0, -1.0, -1.0, -3.0]
toy5_exp = np.exp(toy5_shifted)
print("exp(shifted):", np.round(toy5_exp, 3).tolist())                 # -> [1.0, 0.368, 0.368, 0.05]
toy5_weights = toy5_exp / toy5_exp.sum()
print("softmax weights:", np.round(toy5_weights, 3).tolist())          # -> [0.56, 0.206, 0.206, 0.028]
toy5_hist_vec = toy5_weights @ toy5_h
print("weighted history vector:", np.round(toy5_hist_vec, 3).tolist()) # -> [0.738, 0.766]
assert np.isclose(toy5_weights.sum(), 1.0)
assert toy5_weights.argmax() == 0

plt.figure(figsize=(5, 3))
plt.bar(np.arange(len(toy5_weights)), toy5_weights, color=["seagreen", "lightgray", "lightgray", "lightgray"])
plt.xlabel("history slot")
plt.ylabel("attention weight")
plt.title("DIN puts most weight on the best-matching slot")
plt.show()
""")
md("▶ What you'll see: the exact-match history vector gets the largest score and softmax weight. Step 5 replaces the hand-set scorer with a tiny neural net.")

md(r"""
## ✍️ Toy 6 · DCN-V2 cross layer by hand

A cross layer keeps the same length but injects explicit products: `x_next = x0 * (W·x + b) + x`.
Here one 3-number input goes through one cross layer.
""")
code(r"""
toy6_rng = np.random.default_rng(0)
toy6_x0 = np.array([0.5, -1.0, 2.0])
print("x0:", toy6_x0.tolist())                                        # -> [0.5, -1.0, 2.0]
toy6_x = toy6_x0.copy()
print("current x:", toy6_x.tolist())                                  # -> [0.5, -1.0, 2.0]
toy6_W = np.array([[0.2, 0.1, 0.0], [-0.3, 0.0, 0.2], [0.1, 0.4, 0.1]])
print("W:", toy6_W.tolist())                                          # -> 3 x 3 matrix
toy6_b = np.array([0.1, -0.2, 0.0])
print("b:", toy6_b.tolist())                                          # -> [0.1, -0.2, 0.0]
toy6_linear = toy6_W @ toy6_x + toy6_b
print("W·x + b:", np.round(toy6_linear, 3).tolist())                  # -> [0.1, 0.05, -0.15]
toy6_cross_term = toy6_x0 * toy6_linear
print("x0 * (W·x + b):", np.round(toy6_cross_term, 3).tolist())       # -> [0.05, -0.05, -0.3]
toy6_next = toy6_cross_term + toy6_x
print("cross output:", np.round(toy6_next, 3).tolist())               # -> [0.55, -1.05, 1.7]
assert np.allclose(toy6_next, [0.55, -1.05, 1.7])

plt.figure(figsize=(5, 3))
toy6_axis = np.arange(len(toy6_x0))
plt.bar(toy6_axis - 0.18, toy6_x0, width=0.36, label="input")
plt.bar(toy6_axis + 0.18, toy6_next, width=0.36, label="after cross")
plt.xticks(toy6_axis, ["f0", "f1", "f2"])
plt.legend()
plt.title("cross layer changes values, not dimensionality")
plt.show()
""")
md("▶ What you'll see: one explicit cross term is added back as a residual, and the vector stays length 3. Step 6 stacks this layer twice.")

md(r"""
## ✍️ Toy 7 · MMoE: experts, gates, mixtures, heads

MMoE computes several expert outputs, then each task has a softmax gate that mixes those experts
differently before its head produces a logit.
""")
code(r"""
toy7_rng = np.random.default_rng(0)
toy7_x = np.array([1.0, 2.0])
print("input x:", toy7_x.tolist())                                    # -> [1.0, 2.0]
toy7_expert0 = np.maximum(np.array([toy7_x[0], toy7_x[1]]), 0)
print("expert 0 output:", toy7_expert0.tolist())                      # -> [1.0, 2.0]
toy7_expert1 = np.maximum(np.array([0.5 * toy7_x[0] + 0.5 * toy7_x[1], toy7_x[0] - toy7_x[1] + 1.0]), 0)
print("expert 1 output:", toy7_expert1.tolist())                      # -> [1.5, 0.0]
toy7_expert2 = np.maximum(np.array([-toy7_x[0] + toy7_x[1], 0.2 * toy7_x[0] + 0.2 * toy7_x[1]]), 0)
print("expert 2 output:", toy7_expert2.tolist())                      # -> [1.0, 0.6]
toy7_E = np.stack([toy7_expert0, toy7_expert1, toy7_expert2])
print("stacked experts:", toy7_E.tolist())                            # -> shape (3 experts, 2 hidden)
toy7_gate_logits = np.array([[2.0, 0.0, 1.0], [0.0, 2.0, 1.0]])
print("gate logits per task:", toy7_gate_logits.tolist())             # -> CTR likes expert 0; LTR likes expert 1
toy7_shifted = toy7_gate_logits - toy7_gate_logits.max(axis=1, keepdims=True)
print("shifted gate logits:", toy7_shifted.tolist())                  # -> [[0,-2,-1],[-2,0,-1]]
toy7_gate_exp = np.exp(toy7_shifted)
print("exp gate logits:", np.round(toy7_gate_exp, 3).tolist())        # -> [[1,0.135,0.368],[0.135,1,0.368]]
toy7_gates = toy7_gate_exp / toy7_gate_exp.sum(axis=1, keepdims=True)
print("softmax gates:", np.round(toy7_gates, 3).tolist())             # -> [[0.665,0.09,0.245],[0.09,0.665,0.245]]
toy7_mixed = toy7_gates @ toy7_E
print("task-specific mixtures:", np.round(toy7_mixed, 3).tolist())    # -> [[1.045,1.477],[1.333,0.327]]
toy7_head_w = np.array([[0.6, 0.2], [0.1, 0.7]])
print("head weights:", toy7_head_w.tolist())                          # -> one head row per task
toy7_head_b = np.array([-0.1, 0.0])
print("head bias:", toy7_head_b.tolist())                             # -> [-0.1, 0.0]
toy7_logits = (toy7_mixed * toy7_head_w).sum(axis=1) + toy7_head_b
print("task logits:", np.round(toy7_logits, 3).tolist())              # -> [0.822, 0.362]
assert np.allclose(toy7_gates.sum(axis=1), [1.0, 1.0])
assert toy7_gates[0, 0] > toy7_gates[0, 1]

plt.figure(figsize=(4.5, 3))
toy7_img = plt.imshow(toy7_gates, cmap="viridis", aspect="auto", vmin=0, vmax=1)
plt.colorbar(toy7_img, label="gate weight")
plt.yticks([0, 1], ["CTR", "LTR"])
plt.xticks([0, 1, 2], ["expert 0", "expert 1", "expert 2"], rotation=20)
plt.title("different tasks mix experts differently")
plt.show()
""")
md("▶ What you'll see: CTR leans on expert 0 while LTR leans on expert 1. Step 7 learns these gates instead of hand-setting them.")

md(r"""
## ✍️ Toy 8 · assemble model signals and count parameters

The full ranker concatenates dense features, candidate embedding, and DIN history vector, sends that
through cross/deep branches, concatenates again, then counts learnable parameters.
""")
code(r"""
toy8_rng = np.random.default_rng(0)
toy8_dense = np.array([0.2, -0.4])
print("dense features:", toy8_dense.tolist())                         # -> [0.2, -0.4]
toy8_candidate = np.array([1.0, 0.0])
print("candidate embedding:", toy8_candidate.tolist())                # -> [1.0, 0.0]
toy8_history = np.array([0.7, 0.3])
print("DIN history vector:", toy8_history.tolist())                   # -> [0.7, 0.3]
toy8_x = np.concatenate([toy8_dense, toy8_candidate, toy8_history])
print("ranker input concat:", toy8_x.tolist())                        # -> [0.2,-0.4,1.0,0.0,0.7,0.3]
toy8_scale = 0.1 * np.arange(1, len(toy8_x) + 1)
print("cross scale:", np.round(toy8_scale, 2).tolist())               # -> [0.1,0.2,0.3,0.4,0.5,0.6]
toy8_cross_out = toy8_x + toy8_x * toy8_scale
print("tiny cross branch:", np.round(toy8_cross_out, 3).tolist())     # -> [0.22,-0.48,1.3,0.0,1.05,0.48]
toy8_deep_out = np.array([toy8_x[:3].sum(), toy8_x[3:].sum()])
print("tiny deep branch:", np.round(toy8_deep_out, 3).tolist())       # -> [0.8,1.0]
toy8_joined = np.concatenate([toy8_cross_out, toy8_deep_out])
print("MMoE input concat:", np.round(toy8_joined, 3).tolist())        # -> 8 numbers
toy8_param_counts = np.array([6 * 6 + 6, 6 * 2 + 2, 8 * 3 + 3])
print("parameter counts [cross, deep, heads]:", toy8_param_counts.tolist()) # -> [42,14,27]
toy8_total_params = toy8_param_counts.sum()
print("total parameters:", int(toy8_total_params))                    # -> 83
assert len(toy8_joined) == 8
assert toy8_total_params == 83

plt.figure(figsize=(5, 3))
plt.bar(["cross", "deep", "heads"], toy8_param_counts, color=["#4C72B0", "#55A868", "#8172B3"])
plt.ylabel("learnable numbers")
plt.title("tiny parameter count by component")
plt.show()
""")
md("▶ What you'll see: the inputs are concatenated, branches are concatenated again, and parameters add up component by component. Step 8 builds the real module.")

md(r"""
## ✍️ Toy 9 · multi-head BCE loss (what training minimizes)

Training predicts logits for CTR/VTR/LTR, converts them to probabilities, computes binary
cross-entropy for each head, then sums the per-head losses.
""")
code(r"""
toy9_rng = np.random.default_rng(0)
toy9_logits = np.array([[-1.0, 0.5, 1.0], [0.2, 1.2, -0.5], [1.0, -0.2, 0.4], [-0.7, 0.8, 1.5]])
print("logits:", toy9_logits.tolist())                                # -> 4 impressions x 3 heads
toy9_labels = np.array([[0, 1, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1]], dtype=float)
print("labels:", toy9_labels.astype(int).tolist())                    # -> binary CTR/VTR/LTR labels
toy9_prob = 1 / (1 + np.exp(-toy9_logits))
print("probabilities:", np.round(toy9_prob, 3).tolist())              # -> [[0.269,0.622,0.731],...]
toy9_bce = -(toy9_labels * np.log(toy9_prob) + (1 - toy9_labels) * np.log(1 - toy9_prob))
print("BCE per example/head:", np.round(toy9_bce, 3).tolist())        # -> [[0.313,0.474,0.313],...]
toy9_per_head = toy9_bce.mean(axis=0)
print("per-head loss:", np.round(toy9_per_head, 3).tolist())          # -> [0.407, 0.427, 0.375]
toy9_total = toy9_per_head.sum()
print("total loss:", round(float(toy9_total), 3))                     # -> 1.209
assert np.allclose(np.round(toy9_per_head, 3), [0.407, 0.427, 0.375])
assert np.isclose(round(float(toy9_total), 3), 1.209)

plt.figure(figsize=(4.5, 3))
plt.bar(["CTR", "VTR", "LTR"], toy9_per_head, color=["#4C72B0", "#55A868", "#8172B3"])
plt.ylabel("BCE loss")
plt.title("loss is tracked per head, then summed")
plt.show()
""")
md("▶ What you'll see: every head has its own BCE, and the training objective is their sum. Steps 9–10 optimize and plot the same quantities.")

md(r"""
## ✍️ Toy 10 · AUC by pair counting

AUC asks: among every positive/negative pair, how often did the positive get the higher score?
This tiny example counts the pairs directly.
""")
code(r"""
toy10_rng = np.random.default_rng(0)
toy10_labels = np.array([1, 0, 1, 0, 1, 0])
print("labels:", toy10_labels.tolist())                               # -> [1, 0, 1, 0, 1, 0]
toy10_scores = np.array([0.9, 0.8, 0.4, 0.3, 0.2, 0.1])
print("scores:", toy10_scores.tolist())                               # -> [0.9, 0.8, 0.4, 0.3, 0.2, 0.1]
toy10_pos_scores = toy10_scores[toy10_labels == 1]
print("positive scores:", toy10_pos_scores.tolist())                  # -> [0.9, 0.4, 0.2]
toy10_neg_scores = toy10_scores[toy10_labels == 0]
print("negative scores:", toy10_neg_scores.tolist())                  # -> [0.8, 0.3, 0.1]
toy10_wins = toy10_pos_scores[:, None] > toy10_neg_scores[None, :]
print("positive > negative matrix:", toy10_wins.astype(int).tolist()) # -> [[1,1,1],[0,1,1],[0,0,1]]
toy10_auc = toy10_wins.mean()
print("AUC = winning pairs / all pairs:", round(float(toy10_auc), 3)) # -> 0.667
assert np.isclose(toy10_auc, 6 / 9)

plt.figure(figsize=(5, 2.8))
plt.scatter(toy10_scores, toy10_labels, s=100, c=np.where(toy10_labels == 1, "seagreen", "lightgray"))
plt.yticks([0, 1], ["negative", "positive"])
plt.xlabel("score")
plt.title("AUC counts positive-vs-negative score orderings")
plt.show()
""")
md("▶ What you'll see: 6 of 9 positive/negative pairs are ordered correctly, so AUC is `0.667`. Step 11 computes this per head.")

md(r"""
## ✍️ Toy 11 · position neutralization at serving

Position was standardized during training, so serving-time neutralization also uses the train
mean/std: replace every real slot with the standardized value for slot 1.
""")
code(r"""
toy11_rng = np.random.default_rng(0)
toy11_train_pos = np.array([1.0, 2.0, 4.0, 7.0])
print("train positions:", toy11_train_pos.tolist())                   # -> [1.0, 2.0, 4.0, 7.0]
toy11_mu = toy11_train_pos.mean()
print("train position mean:", round(float(toy11_mu), 3))              # -> 3.5
toy11_sd = toy11_train_pos.std()
print("train position std:", round(float(toy11_sd), 3))               # -> 2.291
toy11_real_pos = np.array([1.0, 5.0, 10.0])
print("real serving positions:", toy11_real_pos.tolist())             # -> [1.0, 5.0, 10.0]
toy11_real_z = (toy11_real_pos - toy11_mu) / toy11_sd
print("standardized real positions:", np.round(toy11_real_z, 3).tolist()) # -> [-1.091,0.655,2.837]
toy11_neutral_z = (1.0 - toy11_mu) / toy11_sd
print("standardized neutral slot-1 value:", round(float(toy11_neutral_z), 3)) # -> -1.091
toy11_base_logit = np.array([-0.2, 0.2, 0.4])
print("quality-only logits:", toy11_base_logit.tolist())              # -> [-0.2, 0.2, 0.4]
toy11_position_coef = -0.6
print("position coefficient:", toy11_position_coef)                   # -> -0.6
toy11_logit_real = toy11_base_logit + toy11_position_coef * toy11_real_z
print("real-position logits:", np.round(toy11_logit_real, 3).tolist()) # -> [0.455,-0.193,-1.302]
toy11_logit_neutral = toy11_base_logit + toy11_position_coef * toy11_neutral_z
print("neutral-position logits:", np.round(toy11_logit_neutral, 3).tolist()) # -> [0.455,0.855,1.055]
toy11_p_real = 1 / (1 + np.exp(-toy11_logit_real))
print("real-position pCTR:", np.round(toy11_p_real, 3).tolist())      # -> [0.612,0.452,0.214]
toy11_p_neutral = 1 / (1 + np.exp(-toy11_logit_neutral))
print("neutralized pCTR:", np.round(toy11_p_neutral, 3).tolist())     # -> [0.612,0.702,0.742]
assert toy11_p_neutral.mean() > toy11_p_real.mean()
assert np.isclose(toy11_real_z[0], toy11_neutral_z)

plt.figure(figsize=(5, 3))
toy11_axis = np.arange(len(toy11_real_pos))
plt.bar(toy11_axis - 0.18, toy11_p_real, width=0.36, label="real position")
plt.bar(toy11_axis + 0.18, toy11_p_neutral, width=0.36, label="neutral slot 1")
plt.xticks(toy11_axis, [f"item {toy11_i}" for toy11_i in toy11_axis])
plt.ylabel("pCTR")
plt.legend()
plt.title("neutralization removes slot differences")
plt.show()
""")
md("▶ What you'll see: lower real slots get lower pCTR, but all items use the same neutral slot-1 value at serving. Step 12 does this on the test set.")

md(r"""
## ✍️ Toy 12 · DIN diagnostic: matching vs other attention

After training, the notebook checks whether DIN puts more attention on history slots whose genre
matches the candidate. That is just two masked averages.
""")
code(r"""
toy12_rng = np.random.default_rng(0)
toy12_attn = np.array([[0.50, 0.20, 0.10, 0.15, 0.05], [0.10, 0.15, 0.45, 0.20, 0.10], [0.30, 0.25, 0.20, 0.15, 0.10]])
print("attention rows:", toy12_attn.tolist())                         # -> 3 impressions x 5 slots
toy12_match = np.array([[1, 0, 0, 1, 0], [0, 0, 1, 0, 1], [1, 1, 0, 0, 0]], dtype=bool)
print("match mask rows:", toy12_match.astype(int).tolist())           # -> 1 where history genre matches candidate
toy12_match_means = np.array([toy12_attn[toy12_i][toy12_match[toy12_i]].mean() for toy12_i in range(len(toy12_attn))])
print("per-row matching attention:", np.round(toy12_match_means, 3).tolist()) # -> [0.325,0.275,0.275]
toy12_other_means = np.array([toy12_attn[toy12_i][~toy12_match[toy12_i]].mean() for toy12_i in range(len(toy12_attn))])
print("per-row other attention:", np.round(toy12_other_means, 3).tolist()) # -> [0.117,0.15,0.15]
toy12_avg_match = toy12_match_means.mean()
print("avg matching attention:", round(float(toy12_avg_match), 3))    # -> 0.292
toy12_avg_other = toy12_other_means.mean()
print("avg other attention:", round(float(toy12_avg_other), 3))       # -> 0.139
assert toy12_avg_match > toy12_avg_other
assert np.isclose(round(float(toy12_avg_match), 3), 0.292)

plt.figure(figsize=(4.5, 3))
plt.bar(["matching genre", "other genre"], [toy12_avg_match, toy12_avg_other], color=["seagreen", "lightgray"])
plt.ylabel("avg attention weight")
plt.title("DIN should focus on matching history")
plt.show()
""")
md("▶ What you'll see: matching slots receive about twice the attention of other slots. Step 13 computes the same masked averages after training.")

md(r"""
## ✍️ Toy 13 · MMoE diagnostic: average gate weights

To inspect specialization, average each task's gate over impressions. Rows that differ mean tasks
are leaning on different experts.
""")
code(r"""
toy13_rng = np.random.default_rng(0)
toy13_gates = np.array([[[0.7, 0.2, 0.1], [0.1, 0.8, 0.1], [0.3, 0.2, 0.5]],
                        [[0.6, 0.3, 0.1], [0.2, 0.7, 0.1], [0.2, 0.3, 0.5]],
                        [[0.8, 0.1, 0.1], [0.1, 0.6, 0.3], [0.4, 0.2, 0.4]],
                        [[0.5, 0.4, 0.1], [0.3, 0.5, 0.2], [0.3, 0.3, 0.4]]])
print("gate tensor:", toy13_gates.tolist())                           # -> 4 impressions x 3 tasks x 3 experts
toy13_row_sums = toy13_gates.sum(axis=2)
print("gate row sums:", np.round(toy13_row_sums, 3).tolist())         # -> every row sums to 1
toy13_avg_gates = toy13_gates.mean(axis=0)
print("average gates:", np.round(toy13_avg_gates, 3).tolist())        # -> [[0.65,0.25,0.1],[0.175,0.65,0.175],[0.3,0.25,0.45]]
toy13_best_expert = toy13_avg_gates.argmax(axis=1)
print("best expert per task:", toy13_best_expert.tolist())            # -> [0, 1, 2]
assert np.allclose(toy13_row_sums, 1.0)
assert toy13_best_expert.tolist() == [0, 1, 2]

plt.figure(figsize=(4.8, 3))
toy13_img = plt.imshow(toy13_avg_gates, cmap="viridis", aspect="auto", vmin=0, vmax=1)
plt.colorbar(toy13_img, label="avg gate weight")
plt.yticks([0, 1, 2], ["CTR", "VTR", "LTR"])
plt.xticks([0, 1, 2], ["expert 0", "expert 1", "expert 2"], rotation=20)
plt.title("average MMoE gates by task")
plt.show()
""")
md("▶ What you'll see: each task's largest average gate lands on a different expert. Step 14 plots the learned version.")

md(r"""
## ✍️ Toy 14 · calibration bins

Calibration groups predictions into bins and compares **mean predicted probability** with the
**actual positive rate** inside each bin.
""")
code(r"""
toy14_rng = np.random.default_rng(0)
toy14_pred = np.array([0.10, 0.20, 0.35, 0.45, 0.60, 0.70, 0.85, 0.95])
print("predicted probabilities:", toy14_pred.tolist())                # -> [0.1,0.2,0.35,0.45,0.6,0.7,0.85,0.95]
toy14_label = np.array([0, 0, 0, 1, 1, 1, 1, 1])
print("labels:", toy14_label.tolist())                                # -> [0,0,0,1,1,1,1,1]
toy14_edges = np.array([0.0, 0.33, 0.66, 1.0])
print("bin edges:", toy14_edges.tolist())                             # -> [0.0,0.33,0.66,1.0]
toy14_bin_id = np.digitize(toy14_pred, toy14_edges[1:-1])
print("bin id per prediction:", toy14_bin_id.tolist())                # -> [0,0,1,1,1,2,2,2]
toy14_mean_pred = np.array([toy14_pred[toy14_bin_id == toy14_b].mean() for toy14_b in range(3)])
print("mean prediction per bin:", np.round(toy14_mean_pred, 3).tolist()) # -> [0.15,0.467,0.833]
toy14_frac_pos = np.array([toy14_label[toy14_bin_id == toy14_b].mean() for toy14_b in range(3)])
print("actual positive rate per bin:", np.round(toy14_frac_pos, 3).tolist()) # -> [0.0,0.667,1.0]
toy14_gap = toy14_frac_pos - toy14_mean_pred
print("calibration gap actual - predicted:", np.round(toy14_gap, 3).tolist()) # -> [-0.15,0.2,0.167]
assert np.allclose(np.round(toy14_mean_pred, 3), [0.15, 0.467, 0.833])
assert toy14_frac_pos[-1] == 1.0

plt.figure(figsize=(4.5, 4))
plt.plot([0, 1], [0, 1], "k--", label="perfect")
plt.plot(toy14_mean_pred, toy14_frac_pos, "o-", color="seagreen", label="toy head")
plt.xlabel("mean predicted")
plt.ylabel("actual rate")
plt.legend()
plt.title("calibration curve from three bins")
plt.show()
""")
md("▶ What you'll see: each point is one bin's predicted-vs-actual rate. Step 15 repeats this for CTR, VTR, and LTR.")

md(r"""
## ✍️ Toy 15 · history ablation as an AUC drop

To prove history matters, scramble it, score again, and measure the AUC drop. The toy uses direct
pair-count AUC so you can see the drop without any library.
""")
code(r"""
toy15_rng = np.random.default_rng(0)
toy15_hist = np.array([[2, 2, 0], [1, 1, 3], [2, 0, 2], [4, 5, 4]])
print("original histories:", toy15_hist.tolist())                     # -> four users
toy15_perm = np.array([2, 0, 3, 1])
print("scramble permutation:", toy15_perm.tolist())                   # -> [2,0,3,1]
toy15_scrambled_hist = toy15_hist[toy15_perm]
print("scrambled histories:", toy15_scrambled_hist.tolist())          # -> histories reassigned to other users
toy15_labels = np.array([1, 0, 1, 0, 1, 0])
print("labels:", toy15_labels.tolist())                               # -> [1,0,1,0,1,0]
toy15_real_scores = np.array([0.9, 0.2, 0.8, 0.4, 0.7, 0.1])
print("scores with real history:", toy15_real_scores.tolist())        # -> [0.9,0.2,0.8,0.4,0.7,0.1]
toy15_scrambled_scores = np.array([0.6, 0.7, 0.55, 0.5, 0.4, 0.3])
print("scores with scrambled history:", toy15_scrambled_scores.tolist()) # -> [0.6,0.7,0.55,0.5,0.4,0.3]
toy15_real_pos = toy15_real_scores[toy15_labels == 1]
print("real positive scores:", toy15_real_pos.tolist())               # -> [0.9,0.8,0.7]
toy15_real_neg = toy15_real_scores[toy15_labels == 0]
print("real negative scores:", toy15_real_neg.tolist())               # -> [0.2,0.4,0.1]
toy15_real_auc = (toy15_real_pos[:, None] > toy15_real_neg[None, :]).mean()
print("real-history AUC:", round(float(toy15_real_auc), 3))           # -> 1.0
toy15_scr_pos = toy15_scrambled_scores[toy15_labels == 1]
print("scrambled positive scores:", toy15_scr_pos.tolist())           # -> [0.6,0.55,0.4]
toy15_scr_neg = toy15_scrambled_scores[toy15_labels == 0]
print("scrambled negative scores:", toy15_scr_neg.tolist())           # -> [0.7,0.5,0.3]
toy15_scr_auc = (toy15_scr_pos[:, None] > toy15_scr_neg[None, :]).mean()
print("scrambled-history AUC:", round(float(toy15_scr_auc), 3))       # -> 0.556
toy15_drop = toy15_real_auc - toy15_scr_auc
print("AUC drop:", round(float(toy15_drop), 3))                       # -> 0.444
assert np.isclose(toy15_real_auc, 1.0)
assert toy15_drop > 0.4

plt.figure(figsize=(4.5, 3))
plt.bar(["real history", "scrambled"], [toy15_real_auc, toy15_scr_auc], color=["seagreen", "lightgray"])
plt.ylim(0.5, 1.05)
plt.ylabel("AUC")
plt.title("history ablation should hurt")
plt.show()
""")
md("▶ What you'll see: scrambling history drops AUC from `1.0` to about `0.556`. Step 16 performs this ablation with the trained DIN.")

md(r"""
## ✍️ Toy 16 · serving score + MMR re-ranking

The final slate first blends multiple objectives into one serving score, then MMR greedily trades a
little score for genre diversity: `λ·score − (1−λ)·same_genre_penalty`.
""")
code(r"""
toy16_rng = np.random.default_rng(0)
toy16_genres = np.array(["tech", "tech", "tech", "sports", "cooking", "music"])
print("candidate genres:", toy16_genres.tolist())                     # -> ['tech','tech','tech','sports','cooking','music']
toy16_ctr = np.array([0.95, 0.90, 0.85, 0.70, 0.68, 0.60])
print("CTR probabilities:", toy16_ctr.tolist())                       # -> [0.95,0.9,0.85,0.7,0.68,0.6]
toy16_vtr = np.array([0.80, 0.70, 0.65, 0.70, 0.60, 0.75])
print("VTR probabilities:", toy16_vtr.tolist())                       # -> [0.8,0.7,0.65,0.7,0.6,0.75]
toy16_ltr = np.array([0.70, 0.65, 0.60, 0.80, 0.80, 0.85])
print("LTR probabilities:", toy16_ltr.tolist())                       # -> [0.7,0.65,0.6,0.8,0.8,0.85]
toy16_scores = 0.5 * toy16_ctr + 0.2 * toy16_vtr + 0.3 * toy16_ltr
print("serving scores:", np.round(toy16_scores, 3).tolist())          # -> [0.845,0.785,0.735,0.73,0.7,0.705]
toy16_score_order = np.argsort(-toy16_scores).tolist()
print("score-only order:", toy16_score_order)                         # -> [0,1,2,3,5,4]
toy16_top_score = toy16_score_order[:4]
print("score-only top-4 genres:", toy16_genres[toy16_top_score].tolist()) # -> ['tech','tech','tech','sports']
toy16_lam = 0.65
print("MMR lambda:", toy16_lam)                                       # -> 0.65
toy16_picked = []
print("initial picked:", toy16_picked)                                # -> []
toy16_candidates = list(range(len(toy16_scores)))
print("initial candidates:", toy16_candidates)                        # -> [0,1,2,3,4,5]
while len(toy16_picked) < 4:
    toy16_values = []
    for toy16_i in toy16_candidates:
        toy16_sim = 1.0 if any(toy16_genres[toy16_i] == toy16_genres[toy16_j] for toy16_j in toy16_picked) else 0.0
        toy16_value = toy16_lam * toy16_scores[toy16_i] - (1 - toy16_lam) * toy16_sim
        toy16_values.append(toy16_value)
    print("MMR values for candidates", toy16_candidates, ":", np.round(toy16_values, 3).tolist()) # -> pick highest
    toy16_best_pos = int(np.argmax(toy16_values))
    print("best position in candidate list:", toy16_best_pos)         # -> highest MMR value index
    toy16_best_item = toy16_candidates[toy16_best_pos]
    print("picked item:", toy16_best_item, toy16_genres[toy16_best_item]) # -> 0, then 3, then 5, then 4
    toy16_picked.append(toy16_best_item)
    toy16_candidates.remove(toy16_best_item)
    print("picked so far:", toy16_picked)                             # -> grows to [0,3,5,4]
toy16_mmr_genres = toy16_genres[toy16_picked].tolist()
print("MMR top-4 genres:", toy16_mmr_genres)                          # -> ['tech','sports','music','cooking']
toy16_all_genres = np.array(["tech", "sports", "cooking", "music"])
print("genre buckets:", toy16_all_genres.tolist())                    # -> ['tech','sports','cooking','music']
toy16_score_counts = np.array([(toy16_genres[toy16_top_score] == toy16_g).sum() for toy16_g in toy16_all_genres])
print("score-only genre counts:", toy16_score_counts.tolist())        # -> [3,1,0,0]
toy16_mmr_counts = np.array([(toy16_genres[toy16_picked] == toy16_g).sum() for toy16_g in toy16_all_genres])
print("MMR genre counts:", toy16_mmr_counts.tolist())                 # -> [1,1,1,1]
toy16_score_total = toy16_scores[toy16_top_score].sum()
print("score-only total score:", round(float(toy16_score_total), 3))  # -> 3.095
toy16_mmr_total = toy16_scores[toy16_picked].sum()
print("MMR total score:", round(float(toy16_mmr_total), 3))           # -> 2.98
assert toy16_picked == [0, 3, 5, 4]
assert len(set(toy16_mmr_genres)) > len(set(toy16_genres[toy16_top_score].tolist()))

plt.figure(figsize=(5.5, 3))
toy16_axis = np.arange(len(toy16_all_genres))
plt.bar(toy16_axis - 0.18, toy16_score_counts, width=0.36, color="lightgray", label="score only")
plt.bar(toy16_axis + 0.18, toy16_mmr_counts, width=0.36, color="seagreen", label="MMR")
plt.xticks(toy16_axis, toy16_all_genres, rotation=20)
plt.ylabel("items in top-4")
plt.legend()
plt.title("MMR trades a little score for diversity")
plt.show()
""")
md("▶ What you'll see: score-only picks three `tech` items, while MMR picks one item from each genre with a small total-score tradeoff. Steps 17–18 scale this to a top-10 slate.")

# =================================================================== DATA: HISTORY
md(r"""
## Step 1 · Build the data — user **history** (this is what DIN needs)

DIN's whole idea is attention over a user's **past behavior**, so our data needs a
*history sequence* per impression. We create:
- `G = 6` item **genres** (think: sports, cooking, tech, ...).
- Each impression carries a **history** of the last `H = 12` genres this user interacted
  with. We bias each user toward a favourite genre, so their history is informative.
- A **candidate** item genre (the ad we're about to score).

The key hidden signal is **affinity** = how much of the user's history matches the
candidate's genre. A good history model (DIN) should recover this from attention.
""")
code(r"""
N, G, H = 9000, 6, 12
genres = ["sports", "cooking", "tech", "travel", "finance", "music"]

pref = rng.integers(0, G, N)                         # each user's favourite genre
hist = np.stack([rng.choice(G, size=H, p=[(0.6 if g == pref[i] else 0.4/(G-1)) for g in range(G)])
                 for i in range(N)])                 # (N, H) history of genre ids
cand_genre = rng.integers(0, G, N)                   # the candidate ad's genre
affinity = np.array([(hist[i] == cand_genre[i]).mean() for i in range(N)])   # hidden signal

print("history shape (impressions x history length):", hist.shape)
print("example user 0 favourite genre:", genres[pref[0]])
print("user 0 history genres:", [genres[g] for g in hist[0]])
print("user 0 candidate genre:", genres[cand_genre[0]], "-> affinity:", round(affinity[0], 2))
""")

# =================================================================== DATA: FEATURES + LABELS
md(r"""
## Step 2 · Candidate features, position, and the three labels

Alongside history we have normal features: `relevance`, `ad_quality`, `price`,
`is_video`, and `position` (slot 1–10). Then we invent the true rules for three outcomes
— **click (CTR)**, **view (VTR)**, **lead (LTR)** — each leaning on **affinity** so the
history model has something real to find. `position` lowers clicks (a **bias** we'll deal
with in Step 8).
""")
code(r"""
def sig(z): return 1 / (1 + np.exp(-z))
relevance = rng.uniform(0,1,N); ad_quality = rng.uniform(0,1,N); price = rng.uniform(0,1,N)
is_video  = rng.integers(0,2,N); position = rng.integers(1,11,N)

click = (rng.random(N) < sig(-1.8 + 2.2*relevance + 1.0*ad_quality - 0.18*position + 3.0*affinity)).astype(np.float32)
view  = (rng.random(N) < sig(-1.4 + 0.8*ad_quality + 2.2*is_video - 0.10*position + 2.4*affinity)).astype(np.float32)
lead  = (rng.random(N) < sig(-2.2 + 2.2*relevance + 1.6*price + 2.2*affinity)).astype(np.float32)

print("base rates -> CTR", round(click.mean(),3), "VTR", round(view.mean(),3), "LTR", round(lead.mean(),3))
plt.figure(figsize=(5,3)); plt.bar(HEADS, [click.mean(), view.mean(), lead.mean()], color=HEAD_COLORS)
plt.ylabel("base rate"); plt.title("how often each outcome happens"); plt.show()
""")

# =================================================================== TENSORS
md(r"""
## Step 3 · Pack into tensors and split train/test

We standardize the dense features (mean 0 / spread 1, using **train** stats only), then
turn everything into PyTorch **tensors** — the arrays the network consumes. We log the
shapes so you can see what goes in.
""")
code(r"""
dense = np.c_[relevance, ad_quality, price, is_video, position].astype(np.float32)
n_tr = 6750
mu, sd = dense[:n_tr].mean(0), dense[:n_tr].std(0)
dense = (dense - mu) / sd
Y = np.c_[click, view, lead].astype(np.float32)

def T(a): return torch.tensor(a)
tr, te = slice(0, n_tr), slice(n_tr, N)
Dtr, Ctr, Htr, Ytr = T(dense[tr]), T(cand_genre[tr]), T(hist[tr]), T(Y[tr])
Dte, Cte, Hte, Yte = T(dense[te]), T(cand_genre[te]), T(hist[te]), T(Y[te])
print("train:", Dtr.shape[0], "test:", Dte.shape[0])
print("per impression -> dense features:", Dtr.shape[1],
      "| candidate genre: 1 id | history:", Htr.shape[1], "genre ids | labels:", Ytr.shape[1])
""")

# =================================================================== EMBEDDINGS
md(r"""
## Step 4 · Embeddings — turn genre IDs into vectors

A network can't do math on the word "sports". An **embedding table** is a lookup that
gives every genre a short learnable vector (here length 8). Genres that behave similarly
end up with similar vectors. Both the candidate genre and every history genre use the
**same** table, so they live in the same space — which is what lets DIN compare them.
""")
code(r"""
EMB_DIM = 8
genre_emb = nn.Embedding(G, EMB_DIM)
demo = genre_emb(torch.tensor([0, 1]))
print("genre embedding table shape:", genre_emb.weight.shape, "(6 genres x 8 numbers each)")
print("embedding for 'sports' (genre 0):", np.round(demo[0].detach().numpy(), 2))
""")

# =================================================================== DIN
md(r"""
## Step 5 · DIN — attention over history (Stage 2 of the flowchart)

**The idea in one sentence:** don't average all of a user's history equally — pay more
**attention** to the past items that are *relevant to the ad we're scoring right now*.

How it works, step by step:
1. Embed the candidate genre (the "query") and every history genre (the "keys").
2. For each history item, build interaction features `[query, key, query−key, query×key]`
   and pass them through a tiny network to get one **attention score**.
3. **Softmax** the scores → weights that sum to 1 (how much to listen to each past item).
4. The history vector = the weighted sum of history embeddings.

Because the weights depend on the candidate, the **same history produces a different
summary for different ads** — that's "candidate-aware," DIN's superpower.
""")
code(r"""
class DIN(nn.Module):
    def __init__(self, emb, dim):
        super().__init__()
        self.emb = emb
        self.att = nn.Sequential(nn.Linear(4*dim, dim), nn.ReLU(), nn.Linear(dim, 1))
    def forward(self, cand, hist):
        c = self.emb(cand)                      # (B, d)  the candidate = the "query"
        h = self.emb(hist)                      # (B, H, d) the history  = the "keys/values"
        q = c.unsqueeze(1).expand_as(h)         # repeat the query for every history slot
        feats = torch.cat([q, h, q - h, q * h], dim=-1)   # DIN interaction features
        scores = self.att(feats).squeeze(-1)    # (B, H) one score per history item
        weights = torch.softmax(scores, dim=-1) # (B, H) attention weights, sum to 1
        hist_vec = (weights.unsqueeze(-1) * h).sum(dim=1)  # (B, d) weighted summary
        return hist_vec, weights, c

din_test = DIN(genre_emb, EMB_DIM)
hv, w, _ = din_test(Cte[:2], Hte[:2])
print("history vector shape:", hv.shape, "| attention weights shape:", w.shape)
print("attention weights for impression 0 (sum =", round(float(w[0].sum()),2), "):")
print(np.round(w[0].detach().numpy(), 3))
""")

# =================================================================== DCN
md(r"""
## Step 6 · DCN-V2 cross network (Stage 1 of the flowchart)

Plain networks mix features only *implicitly*. A **cross network** builds **explicit**
feature crosses — products like `relevance × affinity`, then crosses of crosses — cheaply
and automatically. Each cross layer computes `x0 * (W·x + b) + x`: it multiplies the
**original** input `x0` by a learned transform of the current features, then adds the
current features back (a "residual"). Stacking `k` layers gives crosses up to degree
`k+1`.
""")
code(r"""
class CrossNet(nn.Module):
    def __init__(self, dim, n_layers=2):
        super().__init__()
        self.layers = nn.ModuleList([nn.Linear(dim, dim) for _ in range(n_layers)])
    def forward(self, x0):
        x = x0
        for layer in self.layers:
            x = x0 * layer(x) + x        # explicit cross + residual
        return x

cn = CrossNet(4, 2)
print("a 2-layer cross network on a 4-dim input keeps the same shape:",
      tuple(cn(torch.randn(3, 4)).shape), "(it enriches, doesn't shrink)")
""")

# =================================================================== MMoE
md(r"""
## Step 7 · MMoE — multi-task with experts + gates (Stage 3 of the flowchart)

We predict **three** things (click, view, lead). Forcing them through one shared network
makes them fight ("negative transfer"). **MMoE** fixes this:
- several small **expert** networks each learn a different view of the input,
- each **task** has its own **gate** — a softmax that decides *how much of each expert*
  that task uses.

So the click task can lean on one expert while the lead task leans on another, sharing
where it helps and specializing where it doesn't. Each task then has a small **head**
that outputs its logit.
""")
code(r"""
class MMoE(nn.Module):
    def __init__(self, dim, n_experts=4, n_tasks=3, hid=32):
        super().__init__()
        self.experts = nn.ModuleList([nn.Sequential(nn.Linear(dim, hid), nn.ReLU()) for _ in range(n_experts)])
        self.gates   = nn.ModuleList([nn.Linear(dim, n_experts) for _ in range(n_tasks)])
        self.heads   = nn.ModuleList([nn.Linear(hid, 1) for _ in range(n_tasks)])
    def forward(self, x):
        E = torch.stack([e(x) for e in self.experts], dim=1)   # (B, n_experts, hid)
        logits, gates = [], []
        for gate, head in zip(self.gates, self.heads):
            g = torch.softmax(gate(x), dim=-1)                 # (B, n_experts) per-task gate
            gates.append(g)
            mixed = (g.unsqueeze(-1) * E).sum(dim=1)           # blend experts for this task
            logits.append(head(mixed).squeeze(-1))
        return torch.stack(logits, dim=1), torch.stack(gates, dim=1)

print("MMoE: 4 experts, 3 per-task gates, 3 heads -> one logit per task.")
""")

# =================================================================== ASSEMBLE
md(r"""
## Step 8 · Assemble the full model (and handle position bias)

Now we stack the pieces exactly like the flowchart:
`DIN(history) → concat with dense + candidate → DCN cross (+ a deep branch) → MMoE → 3 heads`.

**Position bias (Stage 4):** items shown in the top slot get clicked partly *because*
they're on top, not because they're better. We include `position` as a **feature** during
training so the model can *explain away* that effect; at **serving** time we feed a neutral
position so ranking reflects true quality, not slot luck. (We'll demonstrate this in
Step 12.)
""")
code(r"""
class Ranker(nn.Module):
    def __init__(self, G, emb_dim=EMB_DIM, n_dense=5):
        super().__init__()
        self.emb = nn.Embedding(G, emb_dim)
        self.din = DIN(self.emb, emb_dim)
        dim = n_dense + emb_dim + emb_dim          # dense + candidate emb + history vec
        self.cross = CrossNet(dim, 2)
        self.deep  = nn.Sequential(nn.Linear(dim, 32), nn.ReLU())
        self.mmoe  = MMoE(dim + 32)
    def forward(self, dense, cand, hist):
        hist_vec, attn, cand_emb = self.din(cand, hist)
        x = torch.cat([dense, cand_emb, hist_vec], dim=-1)
        z = torch.cat([self.cross(x), self.deep(x)], dim=-1)   # DCN branch + deep branch
        logits, gates = self.mmoe(z)
        return logits, attn, gates

model = Ranker(G)
n_params = sum(p.numel() for p in model.parameters())
print("full model built. total learnable numbers (parameters):", n_params)
print("pipeline: DIN -> [dense|cand|history] -> DCN cross + deep -> MMoE -> CTR/VTR/LTR")
""")

# =================================================================== TRAIN
md(r"""
## Step 9 · Train — and log the loss going down

Training = show the model the data many times (**epochs**); each epoch it predicts,
measures error (**BCE loss**, summed over the three heads), and nudges its weights to do
better (**Adam** optimizer). We **print the loss every few epochs** and store it for a
curve. Watch the total loss fall.
""")
code(r"""
opt = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.BCEWithLogitsLoss()

hist_total, hist_tasks = [], []
print("epoch |  total | CTR   VTR   LTR   (per-head loss)")
for epoch in range(70):
    model.train(); opt.zero_grad()
    logits, _, _ = model(Dtr, Ctr, Htr)
    per_task = [loss_fn(logits[:, k], Ytr[:, k]) for k in range(3)]
    loss = sum(per_task)
    loss.backward(); opt.step()
    hist_total.append(loss.item()); hist_tasks.append([l.item() for l in per_task])
    if epoch % 10 == 0:
        pt = [round(l.item(), 3) for l in per_task]
        print(f"{epoch:5d} | {loss.item():.3f} | {pt[0]:.3f} {pt[1]:.3f} {pt[2]:.3f}")
print("done. final total loss:", round(hist_total[-1], 3))
""")

md("""
## Step 10 · The learning curves

Total loss and each head's loss over training. All should fall and flatten — the shared
model is learning all three tasks at once.
""")
code(r"""
hist_tasks = np.array(hist_tasks)
fig, ax = plt.subplots(1, 2, figsize=(11, 3.4))
ax[0].plot(hist_total, color="black", lw=2); ax[0].set_title("total loss"); ax[0].set_xlabel("epoch")
for k, (name, c) in enumerate(zip(HEADS, HEAD_COLORS)):
    ax[1].plot(hist_tasks[:, k], color=c, lw=2, label=name)
ax[1].set_title("loss per head"); ax[1].set_xlabel("epoch"); ax[1].legend()
plt.show()
""")

# =================================================================== EVALUATE
md(r"""
## Step 11 · Evaluate each head — AUC

Predict on the held-out test set and score each head with **AUC** (chance a positive is
ranked above a negative; 0.5 = coin flip, 1.0 = perfect).
""")
code(r"""
model.eval()
with torch.no_grad():
    logits_te, attn_te, gates_te = model(Dte, Cte, Hte)
proba = torch.sigmoid(logits_te).numpy()
aucs = [roc_auc_score(Y[te][:, k], proba[:, k]) for k in range(3)]
for name, a in zip(HEADS, aucs): print(f"{name} AUC: {a:.3f}")
plt.figure(figsize=(5,3)); plt.bar(HEADS, aucs, color=HEAD_COLORS); plt.ylim(0.5, 0.9)
for i,a in enumerate(aucs): plt.text(i, a+0.005, f"{a:.3f}", ha="center")
plt.ylabel("AUC"); plt.title("ranking quality per head"); plt.show()
""")

md(r"""
## Step 12 · Position debias in action

Here's the payoff of including `position` as a feature. We score the same impressions
twice: once with their **real** position, once with everyone forced to the **top slot**
(neutral). If the model learned the position effect, the neutralized scores strip out the
"clicked just because it was high" boost — that's the version you rank with at serving.
""")
code(r"""
neutral = Dte.clone()
pos_col = 4                                  # position is the 5th dense feature
neutral[:, pos_col] = (1 - mu[pos_col]) / sd[pos_col]   # force everyone to slot 1 (standardized)
with torch.no_grad():
    p_real = torch.sigmoid(model(Dte, Cte, Hte)[0][:, 0]).numpy()
    p_neut = torch.sigmoid(model(neutral, Cte, Hte)[0][:, 0]).numpy()
print("avg pCTR with real position:", round(p_real.mean(), 3))
print("avg pCTR with neutral (top) position:", round(p_neut.mean(), 3))
plt.figure(figsize=(6,3))
plt.hist(p_real, bins=30, alpha=.6, color=GRAY, label="real position")
plt.hist(p_neut, bins=30, alpha=.6, color=BLUE, label="neutralized (serving)")
plt.xlabel("predicted CTR"); plt.legend(); plt.title("position debias shifts the scores"); plt.show()
""")

# =================================================================== DIN VIZ
md(r"""
## Step 13 · Look inside DIN — is the attention really candidate-aware?

The proof DIN works: for each test impression, we measure how much attention landed on
history items whose genre **matches** the candidate vs those that **don't**. If DIN is
doing its job, far more attention goes to **matching** history — it's focusing on the
relevant past.
""")
code(r"""
attn = attn_te.numpy()                       # (test, H)
match = (Hte.numpy() == Cte.numpy()[:, None])# (test, H) True where history genre == candidate
# average attention on matching vs non-matching history slots
att_match = np.array([attn[i][match[i]].mean() if match[i].any() else np.nan for i in range(len(attn))])
att_other = np.array([attn[i][~match[i]].mean() if (~match[i]).any() else np.nan for i in range(len(attn))])
print("avg attention on MATCHING-genre history:", round(np.nanmean(att_match), 3))
print("avg attention on other history         :", round(np.nanmean(att_other), 3))

fig, ax = plt.subplots(1, 2, figsize=(11, 3.4))
ax[0].bar(["matching\ngenre", "other\ngenre"], [np.nanmean(att_match), np.nanmean(att_other)], color=[GREEN, GRAY])
ax[0].set_ylabel("avg attention weight"); ax[0].set_title("DIN attends to relevant history")
# one concrete example: attention over user 0's 12 history slots, colored by match
i = int(np.argmax(match.sum(1)))             # pick a user with several matching items
colors = [GREEN if m else GRAY for m in match[i]]
ax[1].bar(range(H), attn[i], color=colors)
ax[1].set_title(f"one impression: green = same genre as the ad"); ax[1].set_xlabel("history slot")
plt.show()
""")

# =================================================================== MMoE VIZ
md(r"""
## Step 14 · Look inside MMoE — do the tasks use different experts?

We average each task's **gate** over the test set: rows = tasks (CTR/VTR/LTR), columns =
experts, values = how much each task relies on each expert. Different rows = the tasks
specialized to different experts, which is exactly why MMoE beats a single shared network
when tasks conflict.
""")
code(r"""
avg_gates = gates_te.mean(0).numpy()         # (3 tasks, n_experts)
plt.figure(figsize=(5.5, 3.2))
im = plt.imshow(avg_gates, cmap="viridis", aspect="auto")
plt.colorbar(im, label="avg gate weight")
plt.yticks(range(3), HEADS); plt.xticks(range(avg_gates.shape[1]), [f"expert {j}" for j in range(avg_gates.shape[1])])
plt.title("which experts each task leans on"); plt.show()
print("gate rows differ across tasks -> the heads specialized:")
for name, row in zip(HEADS, avg_gates): print(f"  {name}: {np.round(row,2)}")
""")

# =================================================================== CALIBRATION
md(r"""
## Step 15 · Calibration per head

Each head should be honest: when it says 0.3, about 30% should happen. Reliability curves
on the diagonal = trustworthy — needed because the serving score multiplies these.
""")
code(r"""
plt.figure(figsize=(5, 4.5)); plt.plot([0,1],[0,1], "k--", label="perfectly honest")
for k, (name, c) in enumerate(zip(HEADS, HEAD_COLORS)):
    frac, mean = calibration_curve(Y[te][:, k], proba[:, k], n_bins=10)
    plt.plot(mean, frac, "o-", color=c, label=name)
plt.xlabel("predicted"); plt.ylabel("actual rate"); plt.legend(); plt.title("calibration of all three heads"); plt.show()
""")

# =================================================================== ABLATION
md(r"""
## Step 16 · Does the history model earn its keep? (ablation)

We scramble each user's history (feed random genres) and re-score. If DIN's history was
carrying real signal, every head's AUC should **drop**. This is how you justify the extra
complexity of a history model.
""")
code(r"""
Hrand = torch.randint(0, G, Hte.shape)
with torch.no_grad():
    proba_rand = torch.sigmoid(model(Dte, Cte, Hrand)[0]).numpy()
aucs_rand = [roc_auc_score(Y[te][:, k], proba_rand[:, k]) for k in range(3)]
print(f"{'head':<5}{'real history':>14}{'scrambled':>11}{'drop':>7}")
for name, a, ar in zip(HEADS, aucs, aucs_rand):
    print(f"{name:<5}{a:>14.3f}{ar:>11.3f}{a-ar:>7.3f}")
x = np.arange(3); wd = 0.35
plt.figure(figsize=(6,3.2))
plt.bar(x-wd/2, aucs, wd, color=GREEN, label="real history (DIN)")
plt.bar(x+wd/2, aucs_rand, wd, color=GRAY, label="scrambled history")
plt.xticks(x, HEADS); plt.ylim(0.5, 0.85); plt.ylabel("AUC"); plt.legend()
plt.title("DIN's history attention adds real signal"); plt.show()
""")

# =================================================================== RE-RANKING
md(r"""
## Step 17 · Re-ranking with MMR (Stage 5 of the flowchart)

Ranking each item alone can fill the whole page with **near-duplicates** (all the same
genre). **Re-ranking** looks at the slate *as a set*. We use **MMR** (Maximal Marginal
Relevance): build the slate greedily, each step picking the item that maximizes

`score = λ · (model score) − (1 − λ) · (similarity to what's already picked)`

so a slightly lower-scoring item from a *fresh* genre can beat yet another duplicate. We
build one user's candidate slate, rank by model score, then MMR-rerank and compare.
""")
code(r"""
# make a candidate pool for ONE user: many items across genres, same user history
np_rng = np.random.default_rng(3)
M = 40
u_hist = Hte[:1].repeat(M, 1)                         # this user's history, repeated
c_gen = torch.tensor(np_rng.integers(0, G, M))        # candidate genres across the pool
d_pool = torch.tensor(((np.c_[np_rng.uniform(0,1,M), np_rng.uniform(0,1,M), np_rng.uniform(0,1,M),
                              np_rng.integers(0,2,M), np_rng.integers(1,11,M)].astype(np.float32) - mu)/sd))
with torch.no_grad():
    lg, _, _ = model(d_pool, c_gen, u_hist)
    # multi-objective serving score
    scores = (0.5*torch.sigmoid(lg[:,0]) + 0.2*torch.sigmoid(lg[:,1]) + 0.3*torch.sigmoid(lg[:,2])).numpy()

def mmr(scores, genres_, k=10, lam=0.7):
    picked, cand = [], list(range(len(scores)))
    while len(picked) < k and cand:
        best, best_val = None, -1e9
        for i in cand:
            sim = 1.0 if any(genres_[i] == genres_[j] for j in picked) else 0.0  # same-genre = redundant
            val = lam*scores[i] - (1-lam)*sim
            if val > best_val: best, best_val = i, val
        picked.append(best); cand.remove(best)
    return picked

top_by_score = list(np.argsort(-scores)[:10])
top_by_mmr   = mmr(scores, c_gen.numpy(), k=10, lam=0.7)
g_score = [genres[c_gen[i]] for i in top_by_score]
g_mmr   = [genres[c_gen[i]] for i in top_by_mmr]
print("top-10 by SCORE only  ->", g_score)
print("  distinct genres:", len(set(g_score)))
print("top-10 after MMR      ->", g_mmr)
print("  distinct genres:", len(set(g_mmr)))
""")

md(r"""
## Step 18 · Re-ranking, visualized — relevance vs diversity

Left: how many distinct genres make the top-10 (higher = more diverse). Right: the total
model score of the slate (MMR gives up a little to gain variety). This is the
relevance-vs-diversity tradeoff the `λ` knob controls.
""")
code(r"""
import collections
fig, ax = plt.subplots(1, 2, figsize=(11, 3.4))
for j, (lab, sel, col) in enumerate([("score only", top_by_score, GRAY), ("MMR", top_by_mmr, GREEN)]):
    cnt = collections.Counter(genres[c_gen[i]] for i in sel)
    ax[0].bar(np.arange(G)+ (j*0.4-0.2), [cnt.get(genres[g],0) for g in range(G)], 0.4, color=col, label=lab)
ax[0].set_xticks(range(G)); ax[0].set_xticklabels(genres, rotation=30); ax[0].set_ylabel("count in top-10")
ax[0].set_title("genre mix of the slate"); ax[0].legend()
ax[1].bar(["score only", "MMR"], [scores[top_by_score].sum(), scores[top_by_mmr].sum()], color=[GRAY, GREEN])
ax[1].set_ylabel("total slate score"); ax[1].set_title("MMR trades a little score for diversity")
plt.show()
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## Recap — you implemented the whole flowchart

Every stage of the M7 "common default path", in real PyTorch:
1. **DCN-V2 cross network** — explicit feature crosses (Step 6).
2. **DIN** — candidate-aware attention over user history; you *saw* it focus on the
   matching genre (Step 5, 13).
3. **MMoE** — experts + per-task gates → CTR/VTR/LTR heads; you *saw* the tasks pick
   different experts (Step 7, 14).
4. **Position-as-feature debias** — neutralize slot luck at serving (Step 8, 12).
5. **MMR re-ranking** — diversify the final slate (Step 17, 18).
6. **Evaluate** — per-head AUC, calibration, and a history ablation (Steps 11, 15, 16).

**Scaling up in the real world:** swap DIN for **DIEN/BST/SIM** for longer history, MMoE
for **PLE** under heavier task conflict, and add **ESMM** if conversions only follow
clicks — the exact "upgrade when…" arrows on the flowchart. You now have the real mental
model *and* the working code of a production ranker. 🚀
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M07 · Production ranker (DIN + DCN + MMoE + re-ranking)", "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M07-production-architecture.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
