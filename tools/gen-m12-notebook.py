#!/usr/bin/env python3
"""Generate afp/notebooks/M12-two-tower-retrieval.ipynb.

A runnable, beginner-friendly Colab notebook for module M12: two-tower / EBR
retrieval. Part A builds and trains a two-tower model with the in-batch softmax
loss (PyTorch), covers negative types (random / in-batch / hard) and the logQ
correction. Part B serves it: precompute item vectors, build an IVF-style ANN
index, sweep the recall-vs-latency funnel to an operating point, and show the
freshness (stale-embedding) trap.

Granular: small steps, plain-language explanation, print logging, and a
visualization for every idea. Colab-preinstalled libraries only
(numpy / pandas / scikit-learn / matplotlib / torch).

Run: python3 tools/gen-m12-notebook.py
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
# M12 · Two-Tower / EBR Retrieval — Hands-on, Step by Tiny Step

**Companion to lesson M12. Written for someone new to ML.**

When a request has to search **millions** of candidates (creators, ads, docs), you can't score
them all with a heavy model per request. The standard first-stage trick is a **two-tower
model**: one tower turns the **query** into a vector, another turns each **item** into a
vector, and a match is just a **dot product** in a shared space. Because item vectors don't
depend on the live query, you **precompute** them once and, at serving time, only run the
query tower + a fast **vector search**.

**What you'll do (every step has an explanation, logging, and a picture):**
- **Part A · The model & training:** build **two towers** (PyTorch), train them with the
  **in-batch softmax** loss, measure **recall@k**, see how **hard negatives** sharpen the
  model, and apply the **logQ** correction.
- **Part B · Serving:** **precompute** item vectors, build an **ANN index** (IVF-style),
  **sweep the funnel** (recall vs latency) to an operating point, and hit the **freshness**
  trap.

We use **PyTorch** (for the towers) + **scikit-learn** + **matplotlib** — all preinstalled in
Colab. Run each cell with **Shift+Enter**.
""")

md(r"""
## Step 1 · Setup
""")
code(r"""
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
import torch, torch.nn as nn
torch.manual_seed(0)
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"
print("ready")
""")

md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full two-tower retrieval pipeline, here is **one tiny, hand-traceable toy example for
every computational mechanic** in this lesson — paired synthetic data, query/item towers,
in-batch softmax, the training update, recall@k, negative choices, logQ, serving, ANN scanning,
operating points, and stale embeddings. Each toy uses only NumPy + Matplotlib, prints the
intermediate values, pins the result with an assert, and draws exactly one picture.
""")

md(r"""
## ✍️ Toy 1 · matched query/item pairs from topic + taste

The training set is built from **matched pairs**: a query and its clicked item share a coarse topic
center plus a small user/item "taste" offset. This toy makes 6 pairs in 2D and verifies that each
matched pair is much closer than a mismatched rolled item.
""")
code(r"""
t1_rng = np.random.default_rng(0)                                      # -> seeded RNG for this toy
print("seeded RNG:", 0)
t1_centers = np.array([[0.0, 0.0], [5.0, 0.0], [0.0, 5.0]])            # -> 3 topic centers in 2D
print("topic centers:", t1_centers.tolist())
t1_topic = np.array([0, 0, 1, 1, 2, 2])                                # -> topic id for each of 6 pairs
print("topic ids:", t1_topic.tolist())
t1_taste = np.array([[0, 0], [1, 0], [0, 1], [1, 1], [0, -1], [1, -1]], float)  # -> small shared offsets
print("taste offsets:", t1_taste.tolist())
t1_q_noise = np.zeros((6, 2))                                          # -> no query noise, for easy tracing
print("query noise:", t1_q_noise.tolist())
t1_i_noise = np.array([[0.1, 0.0], [-0.1, 0.0], [0.0, 0.1], [0.0, -0.1], [0.1, 0.1], [-0.1, -0.1]])  # -> tiny item noise
print("item noise:", t1_i_noise.tolist())
t1_base = t1_centers[t1_topic]                                         # -> [[0,0],[0,0],[5,0],[5,0],[0,5],[0,5]]
print("base center per pair:", t1_base.tolist())
t1_queries = t1_base + t1_taste + t1_q_noise                           # -> query vectors
print("queries:", t1_queries.tolist())
t1_items = t1_base + t1_taste + t1_i_noise                             # -> matched item vectors
print("items:", np.round(t1_items, 1).tolist())
t1_pair_gap = np.linalg.norm(t1_queries - t1_items, axis=1)            # -> [0.1,0.1,0.1,0.1,0.14,0.14]
print("matched gaps:", np.round(t1_pair_gap, 2).tolist())
t1_wrong_items = np.roll(t1_items, -1, axis=0)                          # -> mismatched comparison item per row
print("rolled wrong items:", np.round(t1_wrong_items, 1).tolist())
t1_wrong_gap = np.linalg.norm(t1_queries - t1_wrong_items, axis=1)      # -> [0.9,4.15,1.0,6.66,0.91,4.1]
print("wrong gaps:", np.round(t1_wrong_gap, 2).tolist())
assert np.all(t1_pair_gap < 0.15) and np.all(t1_pair_gap < t1_wrong_gap)

plt.figure(figsize=(5, 4))
plt.scatter(t1_queries[:, 0], t1_queries[:, 1], marker="*", s=180, c="gold", edgecolor="black", label="queries")
plt.scatter(t1_items[:, 0], t1_items[:, 1], s=90, c="skyblue", edgecolor="black", label="matched items")
for t1_r in range(6):
    plt.plot([t1_queries[t1_r, 0], t1_items[t1_r, 0]], [t1_queries[t1_r, 1], t1_items[t1_r, 1]], color="gray", lw=1)
    plt.text(t1_items[t1_r, 0] + 0.08, t1_items[t1_r, 1] + 0.08, str(t1_r))
plt.title("synthetic pairs: same topic + taste -> nearby query/item")
plt.legend()
plt.show()
""")
md("▶ What you'll see: 6 matched query/item pairs with tiny gaps (≤0.14), while rolled mismatches are much farther. "
   "Step 4 scales this idea up before training the towers.")

md(r"""
## ✍️ Toy 2 · two separate towers, one shared dot-product space

A two-tower model runs the **query features** through a query tower and **item features** through an
item tower. The towers can have different weights, but both output 2D embeddings so a match score is
just a dot product.
""")
code(r"""
t2_rng = np.random.default_rng(0)                                      # -> seeded RNG for this toy
print("seeded RNG:", 0)
t2_query_raw = np.array([[2,0,0], [0,2,0], [0,0,2], [1,1,0], [1,0,1], [0,1,1]], float)  # -> 6 query feature rows
print("raw query features:", t2_query_raw.tolist())
t2_item_raw = np.array([[2,0,0], [0,2,0], [0,0,2], [1,1,0], [1,0,1], [0,1,1]], float)   # -> 6 item feature rows
print("raw item features:", t2_item_raw.tolist())
t2_Wq = np.array([[1.0, 0.0], [0.0, 1.0], [0.5, 0.5]])                 # -> query tower weights
print("query tower weights:", t2_Wq.tolist())
t2_Wi = np.array([[1.0, 0.0], [0.0, 1.0], [0.25, 0.75]])               # -> item tower weights
print("item tower weights:", t2_Wi.tolist())
t2_query_emb = t2_query_raw @ t2_Wq                                    # -> query embeddings, shape (6,2)
print("query embeddings:", np.round(t2_query_emb, 2).tolist())
t2_item_emb = t2_item_raw @ t2_Wi                                      # -> item embeddings, shape (6,2)
print("item embeddings:", np.round(t2_item_emb, 2).tolist())
t2_scores_for_q0 = t2_item_emb @ t2_query_emb[0]                       # -> [4,0,1,2,2.5,0.5]
print("scores for query 0:", np.round(t2_scores_for_q0, 2).tolist())
t2_best_item = int(np.argmax(t2_scores_for_q0))                        # -> 0
print("best item for query 0:", t2_best_item)
assert t2_best_item == 0 and t2_query_emb.shape == t2_item_emb.shape == (6, 2)

plt.figure(figsize=(5, 4))
plt.scatter(t2_item_emb[:, 0], t2_item_emb[:, 1], s=90, c="lightgray", edgecolor="black", label="item tower outputs")
plt.scatter(t2_query_emb[0, 0], t2_query_emb[0, 1], marker="*", s=260, c="gold", edgecolor="black", label="query 0 output")
for t2_j in range(6):
    plt.text(t2_item_emb[t2_j, 0] + 0.05, t2_item_emb[t2_j, 1] + 0.05, f"i{t2_j}: {t2_scores_for_q0[t2_j]:.1f}")
plt.title("two towers -> same space -> dot-product scores")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the query and item towers produce 2D vectors; dot products rank item 0 highest "
   "for query 0. Step 2 introduces this exact structure conceptually.")

md(r"""
## ✍️ Toy 3 · in-batch score matrix and diagonal positives

For a batch of matched pairs, score **every query against every item**. The positive item for query
row `b` is item column `b`, so the labels are the diagonal `[0,1,2,3,4,5]`.
""")
code(r"""
t3_rng = np.random.default_rng(0)                                      # -> seeded RNG for this toy
print("seeded RNG:", 0)
t3_query_emb = np.array([[3,0], [0,3], [2,2], [-3,0], [0,-3], [-2,-2]], float)  # -> 6 query embeddings
print("query embeddings:", t3_query_emb.tolist())
t3_item_emb = np.array([[3,0], [0,3], [2,2], [-3,0], [0,-3], [-2,-2]], float)   # -> matching item embeddings
print("item embeddings:", t3_item_emb.tolist())
t3_scores = t3_query_emb @ t3_item_emb.T                               # -> 6x6 all query-item dot scores
print("score matrix:\n", t3_scores.astype(int))
t3_labels = np.arange(6)                                                # -> [0,1,2,3,4,5]
print("diagonal labels:", t3_labels.tolist())
t3_diag = np.diag(t3_scores)                                            # -> [9,9,8,9,9,8]
print("positive diagonal scores:", t3_diag.astype(int).tolist())
assert t3_labels.tolist() == [0, 1, 2, 3, 4, 5] and t3_diag.astype(int).tolist() == [9, 9, 8, 9, 9, 8]

plt.figure(figsize=(5, 4))
plt.imshow(t3_scores, cmap="viridis")
plt.colorbar(label="dot score")
plt.scatter(t3_labels, t3_labels, marker="s", s=120, facecolors="none", edgecolors="red", linewidths=2, label="positives")
plt.xlabel("item column")
plt.ylabel("query row")
plt.title("in-batch scores: positives live on the diagonal")
plt.legend(loc="upper right")
plt.show()
""")
md("▶ What you'll see: a 6×6 score matrix. The red squares mark the positive diagonal that cross-entropy "
   "tries to make large in Step 4.")

md(r"""
## ✍️ Toy 4 · in-batch softmax loss for one query

Given one query row's scores, softmax turns the positive and all in-batch negatives into
probabilities. The loss is `-log(probability of the positive)`.
""")
code(r"""
t4_rng = np.random.default_rng(0)                                      # -> seeded RNG for this toy
print("seeded RNG:", 0)
t4_scores = np.array([4.0, 1.0, 3.8, 0.0, -1.0, 2.0])                 # -> [positive,easy,hard,other,other,other]
print("raw scores:", t4_scores.tolist())
t4_positive = 0                                                        # -> positive item column
print("positive column:", t4_positive)
t4_shifted = t4_scores - t4_scores.max()                              # -> [0,-3,-0.2,-4,-5,-2]
print("shifted scores:", np.round(t4_shifted, 2).tolist())
t4_exp = np.exp(t4_shifted)                                           # -> [1,0.05,0.82,0.02,0.01,0.14]
print("exp shifted:", np.round(t4_exp, 2).tolist())
t4_probs = t4_exp / t4_exp.sum()                                      # -> [0.493,0.025,0.404,0.009,0.003,0.067]
print("softmax probabilities:", np.round(t4_probs, 3).tolist())
t4_loss = -np.log(t4_probs[t4_positive])                              # -> 0.707
print("positive probability:", round(float(t4_probs[t4_positive]), 3))
print("loss:", round(float(t4_loss), 3))
assert round(float(t4_probs[t4_positive]), 3) == 0.493 and round(float(t4_loss), 3) == 0.707

plt.figure(figsize=(5.5, 3))
plt.bar(["pos", "easy", "hard", "n3", "n4", "n5"], t4_probs, color=["green", "gray", "red", "gray", "gray", "gray"])
plt.ylabel("softmax probability")
plt.title("hard negative keeps the positive probability below 0.5")
plt.show()
""")
md("▶ What you'll see: the positive gets probability 0.493 and loss 0.707 because the hard negative "
   "at score 3.8 steals almost as much probability. Step 3 uses this loss.")

md(r"""
## ✍️ Toy 5 · one training loop, unrolled by hand

Training repeats: take a mini-batch, build the score matrix, compute softmax loss, compute a gradient,
then update the parameters. To keep it hand-traceable, this toy trains one scalar scale `w` for two
mini-batches.
""")
code(r"""
t5_rng = np.random.default_rng(0)                                      # -> seeded RNG for this toy
print("seeded RNG:", 0)
t5_Q = np.array([[1,0], [0,1], [1,1], [2,0], [0,2], [2,2]], float)     # -> 6 query vectors
print("query batch data:", t5_Q.tolist())
t5_I = np.array([[1,0], [0,1], [1,1], [2,0], [0,2], [2,2]], float)     # -> 6 item vectors
print("item batch data:", t5_I.tolist())
t5_lr = 0.5                                                           # -> learning rate
print("learning rate:", t5_lr)
t5_w0 = 0.1                                                           # -> starting scalar parameter
print("start w:", t5_w0)

t5_idx1 = np.array([0, 1, 2])                                         # -> first mini-batch ids
print("batch 1 ids:", t5_idx1.tolist())
t5_dots1 = t5_Q[t5_idx1] @ t5_I[t5_idx1].T                            # -> [[1,0,1],[0,1,1],[1,1,2]]
print("batch 1 dot matrix:\n", t5_dots1.astype(int))
t5_scores1 = t5_w0 * t5_dots1                                        # -> [[0.1,0,0.1],[0,0.1,0.1],[0.1,0.1,0.2]]
print("batch 1 scores:\n", np.round(t5_scores1, 3))
t5_exp1 = np.exp(t5_scores1 - t5_scores1.max(axis=1, keepdims=True))  # -> stable exponentials
print("batch 1 exp:\n", np.round(t5_exp1, 3))
t5_prob1 = t5_exp1 / t5_exp1.sum(axis=1, keepdims=True)               # -> softmax rows
print("batch 1 probabilities:\n", np.round(t5_prob1, 3))
t5_eye1 = np.eye(3)                                                   # -> diagonal labels
print("batch 1 labels:\n", t5_eye1.astype(int))
t5_loss1 = -np.log(np.diag(t5_prob1)).mean()                          # -> 1.055
print("batch 1 loss:", round(float(t5_loss1), 3))
t5_grad1 = ((t5_prob1 - t5_eye1) * t5_dots1).sum() / 3                # -> -0.422
print("batch 1 gradient dloss/dw:", round(float(t5_grad1), 3))
t5_w1 = t5_w0 - t5_lr * t5_grad1                                      # -> 0.311
print("updated w after batch 1:", round(float(t5_w1), 3))

t5_idx2 = np.array([3, 4, 5])                                         # -> second mini-batch ids
print("batch 2 ids:", t5_idx2.tolist())
t5_dots2 = t5_Q[t5_idx2] @ t5_I[t5_idx2].T                            # -> [[4,0,4],[0,4,4],[4,4,8]]
print("batch 2 dot matrix:\n", t5_dots2.astype(int))
t5_scores2 = t5_w1 * t5_dots2                                        # -> [[1.245,0,1.245],[0,1.245,1.245],[1.245,1.245,2.489]]
print("batch 2 scores:\n", np.round(t5_scores2, 3))
t5_exp2 = np.exp(t5_scores2 - t5_scores2.max(axis=1, keepdims=True))  # -> stable exponentials
print("batch 2 exp:\n", np.round(t5_exp2, 3))
t5_prob2 = t5_exp2 / t5_exp2.sum(axis=1, keepdims=True)               # -> softmax rows
print("batch 2 probabilities:\n", np.round(t5_prob2, 3))
t5_eye2 = np.eye(3)                                                   # -> diagonal labels
print("batch 2 labels:\n", t5_eye2.astype(int))
t5_loss2 = -np.log(np.diag(t5_prob2)).mean()                          # -> 0.703
print("batch 2 loss:", round(float(t5_loss2), 3))
t5_grad2 = ((t5_prob2 - t5_eye2) * t5_dots2).sum() / 3                # -> -0.823
print("batch 2 gradient dloss/dw:", round(float(t5_grad2), 3))
t5_w2 = t5_w1 - t5_lr * t5_grad2                                      # -> 0.723
print("updated w after batch 2:", round(float(t5_w2), 3))
assert round(float(t5_w2), 3) == 0.723 and t5_loss2 < t5_loss1

plt.figure(figsize=(5, 3))
plt.plot([0, 1], [t5_loss1, t5_loss2], "o-", color="purple")
plt.xticks([0, 1], ["batch 1", "batch 2"])
plt.ylabel("loss")
plt.title("training loop: loss -> gradient -> parameter update")
plt.show()
""")
md("▶ What you'll see: two mini-batch updates increase `w` from 0.100 to 0.723 and reduce the traced "
   "loss from 1.055 to 0.703. Step 4 does the same loop with PyTorch towers.")

md(r"""
## ✍️ Toy 6 · recall@k evaluation

Recall@k asks: for each query, is the true matched item in the top `k` scored items? This toy uses a
6×6 score matrix whose row index is also the true item id.
""")
code(r"""
t6_rng = np.random.default_rng(0)                                      # -> seeded RNG for this toy
print("seeded RNG:", 0)
t6_scores = np.array([[9,5,4,1,0,-1], [2,8,7,1,0,3], [6,3,5,4,2,1], [0,1,2,9,5,4], [1,2,0,4,8,7], [3,1,2,5,4,9]], float)  # -> 6 queries x 6 items
print("score matrix:\n", t6_scores.astype(int))
t6_truth = np.arange(6)                                                # -> [0,1,2,3,4,5]
print("true item per query:", t6_truth.tolist())
t6_order = np.argsort(-t6_scores, axis=1)                              # -> descending item ids per query
print("ranked item ids:\n", t6_order)
t6_top1 = t6_order[:, :1]                                              # -> top-1 ids
print("top-1 ids:", t6_top1.ravel().tolist())
t6_top2 = t6_order[:, :2]                                              # -> top-2 ids
print("top-2 ids:", t6_top2.tolist())
t6_hits1 = np.array([t6_truth[t6_r] in t6_top1[t6_r] for t6_r in range(6)])  # -> [T,T,F,T,T,T]
print("hit@1 flags:", t6_hits1.tolist())
t6_hits2 = np.array([t6_truth[t6_r] in t6_top2[t6_r] for t6_r in range(6)])  # -> [T,T,T,T,T,T]
print("hit@2 flags:", t6_hits2.tolist())
t6_recall1 = t6_hits1.mean()                                           # -> 0.833
print("recall@1:", round(float(t6_recall1), 3))
t6_recall2 = t6_hits2.mean()                                           # -> 1.0
print("recall@2:", round(float(t6_recall2), 3))
assert round(float(t6_recall1), 3) == 0.833 and float(t6_recall2) == 1.0

plt.figure(figsize=(4.5, 3))
plt.bar(["recall@1", "recall@2"], [t6_recall1, t6_recall2], color=["orange", "green"])
plt.ylim(0, 1.05)
plt.ylabel("fraction of queries")
plt.title("recall@k: true item appears in the top k")
plt.show()
""")
md("▶ What you'll see: recall@1 is 5/6, while recall@2 is 6/6 because the one miss at rank 1 is recovered "
   "when k grows. Step 5 evaluates the trained towers this way.")

md(r"""
## ✍️ Toy 7 · negative types: random, in-batch, sampled, hard

Negatives can come from different rules. This toy picks one random negative, the other items in the
mini-batch, a popularity-sampled negative, and the highest-scoring wrong item (a hard negative).
""")
code(r"""
t7_rng = np.random.default_rng(0)                                      # -> seeded RNG for deterministic random negative
print("seeded RNG:", 0)
t7_items = np.array([[2,1], [2,0], [0,2], [1,1], [-1,1], [0,-1]], float)  # -> 6 candidate item vectors
print("item vectors:", t7_items.tolist())
t7_query = np.array([2, 1], float)                                     # -> one query vector
print("query vector:", t7_query.tolist())
t7_scores = t7_items @ t7_query                                       # -> [5,4,2,3,-1,-1]
print("item scores:", t7_scores.astype(int).tolist())
t7_positive = 0                                                        # -> clicked item id
print("positive id:", t7_positive)
t7_random_pool = np.array([1, 2, 3, 4, 5])                             # -> all wrong ids
print("random pool:", t7_random_pool.tolist())
t7_random_neg = int(t7_rng.choice(t7_random_pool))                    # -> 5
print("random negative:", t7_random_neg)
t7_batch_ids = np.array([0, 2, 4])                                     # -> mini-batch item ids
print("batch ids:", t7_batch_ids.tolist())
t7_in_batch_negs = t7_batch_ids[t7_batch_ids != t7_positive]           # -> [2,4]
print("in-batch negatives:", t7_in_batch_negs.tolist())
t7_sample_Q = np.array([0.05, 0.10, 0.05, 0.50, 0.20, 0.10])           # -> sampler probabilities
print("sampler Q:", t7_sample_Q.tolist())
t7_sample_mask = t7_sample_Q.copy()                                   # -> copy so we can exclude the positive
t7_sample_mask[t7_positive] = -1.0                                    # -> positive excluded
print("sample mask:", t7_sample_mask.tolist())
t7_sampled_neg = int(np.argmax(t7_sample_mask))                       # -> 3
print("sampled negative (most likely draw):", t7_sampled_neg)
t7_hard_scores = t7_scores.copy()                                     # -> copy so we can exclude the positive
t7_hard_scores[t7_positive] = -np.inf                                 # -> positive excluded
print("hard-negative scores:", t7_hard_scores.tolist())
t7_hard_neg = int(np.argmax(t7_hard_scores))                          # -> 1
print("hard negative (highest wrong score):", t7_hard_neg)
assert t7_random_neg == 5 and t7_in_batch_negs.tolist() == [2, 4] and t7_sampled_neg == 3 and t7_hard_neg == 1

plt.figure(figsize=(5.5, 3))
plt.bar(range(6), t7_scores, color=["green", "red", "gray", "purple", "gray", "orange"])
plt.xticks(range(6), [f"item {t7_j}" for t7_j in range(6)])
plt.ylabel("dot score")
plt.title("negative choices: hard = highest-scoring wrong item")
plt.show()
""")
md("▶ What you'll see: different rules choose different negatives; the hard negative is item 1 because "
   "it scores 4, closest to the positive's 5. Step 6 compares these negative sources.")

md(r"""
## ✍️ Toy 8 · hard negatives keep the loss alive

The hard negative matters because it competes in the softmax. Keep the same 6 candidates, but change
one wrong item from a hard score (2.8) to an easy score (-1.0), and watch the positive probability jump.
""")
code(r"""
t8_rng = np.random.default_rng(0)                                      # -> seeded RNG for this toy
print("seeded RNG:", 0)
t8_with_hard_scores = np.array([3.0, 0.2, 2.8, -0.5, 0.0, 0.1])       # -> positive plus a hard negative
print("scores with hard negative:", t8_with_hard_scores.tolist())
t8_without_hard_scores = np.array([3.0, 0.2, -1.0, -0.5, 0.0, 0.1])   # -> same slot made easy
print("scores without hard negative:", t8_without_hard_scores.tolist())
t8_exp_hard = np.exp(t8_with_hard_scores - t8_with_hard_scores.max()) # -> stable exponentials
print("exp with hard:", np.round(t8_exp_hard, 3).tolist())
t8_prob_hard = t8_exp_hard / t8_exp_hard.sum()                        # -> [0.496,0.03,0.406,0.015,0.025,0.027]
print("probabilities with hard:", np.round(t8_prob_hard, 3).tolist())
t8_exp_easy = np.exp(t8_without_hard_scores - t8_without_hard_scores.max())  # -> stable exponentials
print("exp without hard:", np.round(t8_exp_easy, 3).tolist())
t8_prob_easy = t8_exp_easy / t8_exp_easy.sum()                        # -> [0.824,0.05,0.015,0.025,0.041,0.045]
print("probabilities without hard:", np.round(t8_prob_easy, 3).tolist())
t8_loss_hard = -np.log(t8_prob_hard[0])                               # -> 0.700
print("loss with hard:", round(float(t8_loss_hard), 3))
t8_loss_easy = -np.log(t8_prob_easy[0])                               # -> 0.194
print("loss without hard:", round(float(t8_loss_easy), 3))
assert round(float(t8_prob_hard[0]), 3) == 0.496 and round(float(t8_prob_easy[0]), 3) == 0.824 and t8_loss_hard > t8_loss_easy

plt.figure(figsize=(5.5, 3))
plt.bar(np.arange(6) - 0.18, t8_prob_hard, 0.36, label="with hard")
plt.bar(np.arange(6) + 0.18, t8_prob_easy, 0.36, label="without hard")
plt.xticks(range(6), ["pos", "n1", "hard/easy", "n3", "n4", "n5"])
plt.ylabel("softmax probability")
plt.title("hard negative steals probability from the positive")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the hard negative takes probability 0.406, so the positive probability is only "
   "0.496; when made easy, the positive jumps to 0.824. Step 6 uses this as the training signal.")

md(r"""
## ✍️ Toy 9 · logQ correction for sampled negatives

If negatives are sampled by popularity `Q`, raw scores over-credit popular draws. The correction is
`corrected score = raw score - log(Q)`, which lifts rare sampled items more.
""")
code(r"""
t9_rng = np.random.default_rng(0)                                      # -> seeded RNG for this toy
print("seeded RNG:", 0)
t9_raw_scores = np.array([3.0, 2.0, 2.0, 1.0, 0.5, 0.0])              # -> 6 sampled candidate scores
print("raw scores:", t9_raw_scores.tolist())
t9_Q = np.array([0.10, 0.20, 0.01, 0.30, 0.25, 0.14])                 # -> sampler probabilities, sum = 1
print("sampler Q:", t9_Q.tolist())
t9_logQ = np.log(t9_Q)                                                # -> negative logs because Q<1
print("log Q:", np.round(t9_logQ, 3).tolist())
t9_corrected = t9_raw_scores - t9_logQ                                # -> raw - logQ
print("corrected scores:", np.round(t9_corrected, 3).tolist())
t9_popular_id = 1                                                      # -> raw score 2.0, Q=0.20
print("popular id:", t9_popular_id)
t9_rare_id = 2                                                         # -> raw score 2.0, Q=0.01
print("rare id:", t9_rare_id)
t9_lift_popular = t9_corrected[t9_popular_id] - t9_raw_scores[t9_popular_id]  # -> 1.609
print("popular lift:", round(float(t9_lift_popular), 3))
t9_lift_rare = t9_corrected[t9_rare_id] - t9_raw_scores[t9_rare_id]           # -> 4.605
print("rare lift:", round(float(t9_lift_rare), 3))
assert round(float(t9_lift_popular), 3) == 1.609 and round(float(t9_lift_rare), 3) == 4.605 and t9_lift_rare > t9_lift_popular

plt.figure(figsize=(5.5, 3))
plt.bar(np.arange(6) - 0.18, t9_raw_scores, 0.36, label="raw")
plt.bar(np.arange(6) + 0.18, t9_corrected, 0.36, label="raw - logQ")
plt.xticks(range(6), [f"item {t9_j}" for t9_j in range(6)])
plt.ylabel("score")
plt.title("logQ lifts rare sampled items more than popular ones")
plt.legend()
plt.show()
""")
md("▶ What you'll see: two items with raw score 2.0 separate after correction: Q=0.01 gets a +4.605 lift, "
   "while Q=0.20 gets +1.609. Step 7 applies this correction.")

md(r"""
## ✍️ Toy 10 · serving funnel: precompute items, compute one query, search

Serving works because item embeddings can be computed **offline** once. Online, compute only the
query embedding, dot it with the precomputed item matrix, and keep top-K.
""")
code(r"""
t10_rng = np.random.default_rng(0)                                     # -> seeded RNG for this toy
print("seeded RNG:", 0)
t10_item_raw = np.array([[2,1,0], [0,2,0], [1,0,1], [3,1,0], [0,1,2], [2,0,1]], float)  # -> 6 item feature rows
print("offline raw item features:", t10_item_raw.tolist())
t10_query_raw = np.array([2, 1, 0], float)                             # -> one live query feature row
print("online raw query:", t10_query_raw.tolist())
t10_Wi = np.array([[1.0, 0.0], [0.0, 1.0], [0.5, 0.5]])                # -> item tower weights
print("item tower weights:", t10_Wi.tolist())
t10_Wq = np.array([[1.0, 0.0], [0.0, 1.0], [0.5, 0.5]])                # -> query tower weights
print("query tower weights:", t10_Wq.tolist())
t10_item_vecs = t10_item_raw @ t10_Wi                                  # -> precomputed item embeddings
print("PRECOMPUTED item vectors:", t10_item_vecs.tolist())
t10_query_vec = t10_query_raw @ t10_Wq                                 # -> one online query embedding
print("ONLINE query vector:", t10_query_vec.tolist())
t10_scores = t10_item_vecs @ t10_query_vec                             # -> [5,2,3.5,7,4,5.5]
print("dot scores against precomputed items:", np.round(t10_scores, 2).tolist())
t10_top3 = np.argsort(-t10_scores)[:3]                                 # -> [3,5,0]
print("served top-3 ids:", t10_top3.tolist())
assert t10_top3.tolist() == [3, 5, 0]

plt.figure(figsize=(5, 4))
plt.scatter(t10_item_vecs[:, 0], t10_item_vecs[:, 1], s=90, c="lightgray", edgecolor="black", label="precomputed items")
plt.scatter(t10_query_vec[0], t10_query_vec[1], marker="*", s=260, c="gold", edgecolor="black", label="online query")
for t10_j in range(6):
    plt.text(t10_item_vecs[t10_j, 0] + 0.05, t10_item_vecs[t10_j, 1] + 0.05, f"{t10_j}: {t10_scores[t10_j]:.1f}")
plt.title("serving funnel: one query vector scores cached item vectors")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the item vectors are computed once, the live query is computed once, and dot-product "
   "search returns top-3 `[3,5,0]`. Step 8 serves this way.")

md(r"""
## ✍️ Toy 11 · ANN/IVF: assign cells, probe one cell, scan a fraction

An IVF-style ANN index assigns items to coarse cells. At query time, score the cell centers, probe the
best cell, and scan only that cell's members instead of all 6 items.
""")
code(r"""
t11_rng = np.random.default_rng(0)                                     # -> seeded RNG for this toy
print("seeded RNG:", 0)
t11_items = np.array([[0,0], [0,1], [5,0], [6,0], [0,5], [1,5]], float)  # -> 6 item vectors
print("item vectors:", t11_items.tolist())
t11_centers = np.array([[0,0.5], [5.5,0], [0.5,5]], float)             # -> 3 coarse cell centers
print("cell centers:", t11_centers.tolist())
t11_dist_to_centers = ((t11_items[:, None, :] - t11_centers[None, :, :]) ** 2).sum(axis=2)  # -> item-center squared distances
print("item-center squared distances:\n", np.round(t11_dist_to_centers, 2))
t11_assign = np.argmin(t11_dist_to_centers, axis=1)                    # -> [0,0,1,1,2,2]
print("cell assignment per item:", t11_assign.tolist())
t11_query = np.array([5.2, 0.1])                                       # -> live query vector
print("query vector:", t11_query.tolist())
t11_cell_scores = t11_centers @ t11_query                              # -> [0.05,28.6,3.1]
print("cell dot scores:", np.round(t11_cell_scores, 2).tolist())
t11_probe = int(np.argmax(t11_cell_scores))                            # -> 1
print("probed cell:", t11_probe)
t11_candidates = np.where(t11_assign == t11_probe)[0]                  # -> [2,3]
print("candidate ids scanned:", t11_candidates.tolist())
t11_scan_fraction = len(t11_candidates) / len(t11_items)               # -> 0.333
print("fraction scanned:", round(float(t11_scan_fraction), 3))
t11_candidate_scores = t11_items[t11_candidates] @ t11_query           # -> [26,31.2]
print("candidate scores:", np.round(t11_candidate_scores, 2).tolist())
t11_top_ids = t11_candidates[np.argsort(-t11_candidate_scores)]        # -> [3,2]
print("ANN top ids from scanned cell:", t11_top_ids.tolist())
assert t11_assign.tolist() == [0, 0, 1, 1, 2, 2] and t11_probe == 1 and t11_top_ids.tolist() == [3, 2]

plt.figure(figsize=(5, 4))
plt.scatter(t11_items[:, 0], t11_items[:, 1], c=t11_assign, cmap="viridis", s=90, edgecolor="black", label="items")
plt.scatter(t11_centers[:, 0], t11_centers[:, 1], marker="X", s=220, c="black", label="cell centers")
plt.scatter(t11_query[0], t11_query[1], marker="*", s=280, c="gold", edgecolor="black", label="query")
for t11_j in range(6):
    plt.text(t11_items[t11_j, 0] + 0.08, t11_items[t11_j, 1] + 0.08, str(t11_j))
plt.title("IVF probes cell 1 and scans only items 2 and 3")
plt.legend()
plt.show()
""")
md("▶ What you'll see: items are assigned `[0,0,1,1,2,2]`; the query probes cell 1 and scans only 2/6 "
   "items. Step 9 scales this to many cells and probes.")

md(r"""
## ✍️ Toy 12 · ANN sweep: more probes trade work for recall

The ANN knob is `nprobe`: probe more cells, scan more items, and recover more of the exact top-K.
This toy sweeps `nprobe` over three queries and computes both recall and scanned fraction.
""")
code(r"""
t12_rng = np.random.default_rng(0)                                     # -> seeded RNG for this toy
print("seeded RNG:", 0)
t12_items = np.array([[0,0], [0,1], [5,0], [6,0], [0,5], [1,5]], float)  # -> 6 item vectors
print("item vectors:", t12_items.tolist())
t12_centers = np.array([[0,0.5], [5.5,0], [0.5,5]], float)             # -> 3 coarse centers
print("cell centers:", t12_centers.tolist())
t12_assign = np.array([0, 0, 1, 1, 2, 2])                              # -> two items per cell
print("cell assignments:", t12_assign.tolist())
t12_queries = np.array([[5.2,0.1], [0.1,5.2], [2.5,2.5]], float)       # -> 3 query vectors
print("queries:", t12_queries.tolist())

def t12_exact_top2(t12_qv):
    t12_scores_local = t12_items @ t12_qv                              # -> exact scores against all 6 items
    t12_order_local = np.argsort(-t12_scores_local)[:2]                # -> exact top-2 ids
    return t12_order_local

def t12_ann_top2(t12_qv, t12_nprobe):
    t12_cell_scores_local = t12_centers @ t12_qv                       # -> scores for 3 cells
    t12_cells_local = np.argsort(-t12_cell_scores_local)[:t12_nprobe]  # -> probed cells
    t12_cand_local = np.where(np.isin(t12_assign, t12_cells_local))[0] # -> scanned item ids
    t12_scores_local = t12_items[t12_cand_local] @ t12_qv              # -> candidate scores only
    t12_top_local = t12_cand_local[np.argsort(-t12_scores_local)[:2]]  # -> approximate top-2 ids
    return t12_top_local, t12_cand_local

t12_rows = []                                                          # -> sweep rows: (nprobe, recall, scan)
for t12_nprobe in [1, 2, 3]:
    t12_recalls = []
    t12_scans = []
    for t12_qv in t12_queries:
        t12_exact = t12_exact_top2(t12_qv)
        t12_approx, t12_cand = t12_ann_top2(t12_qv, t12_nprobe)
        t12_hit_fraction = len(set(t12_exact) & set(t12_approx)) / 2
        t12_recalls.append(t12_hit_fraction)
        t12_scans.append(len(t12_cand) / len(t12_items))
        print(f"nprobe={t12_nprobe} query={t12_qv.tolist()} exact={t12_exact.tolist()} approx={t12_approx.tolist()} scan={len(t12_cand)}/6 recall={t12_hit_fraction:.2f}")
    t12_mean_recall = float(np.mean(t12_recalls))
    t12_mean_scan = float(np.mean(t12_scans))
    t12_rows.append((t12_nprobe, t12_mean_recall, t12_mean_scan))
    print(f"summary nprobe={t12_nprobe}: recall={t12_mean_recall:.3f}, scanned={t12_mean_scan:.3f}")
t12_rows_arr = np.array(t12_rows)                                      # -> [[1,.833,.333],[2,1,.667],[3,1,1]]
print("sweep rows:", np.round(t12_rows_arr, 3).tolist())
assert np.allclose(np.round(t12_rows_arr[:, 1], 3), [0.833, 1.0, 1.0]) and np.allclose(np.round(t12_rows_arr[:, 2], 3), [0.333, 0.667, 1.0])

plt.figure(figsize=(5, 3))
plt.plot(t12_rows_arr[:, 2] * 100, t12_rows_arr[:, 1], "o-", color="green")
for t12_np, t12_rc, t12_sc in t12_rows:
    plt.text(t12_sc * 100 + 1, t12_rc - 0.03, f"nprobe={int(t12_np)}")
plt.xlabel("% of items scanned")
plt.ylabel("recall@2")
plt.ylim(0.75, 1.05)
plt.title("ANN sweep: recall rises as scan fraction rises")
plt.show()
""")
md("▶ What you'll see: `nprobe=1` scans 33% and gets 0.833 recall; `nprobe=2` scans 67% and gets perfect "
   "recall on this toy. Step 9 performs the same sweep for recall@50.")

md(r"""
## ✍️ Toy 13 · operating-point rule: cheapest setting that meets the bar

After a sweep, don't pick the most expensive setting by default. Apply the decision rule: filter
settings that meet the recall bar, then choose the one with the smallest scanned fraction.
""")
code(r"""
t13_rng = np.random.default_rng(0)                                     # -> seeded RNG for this toy
print("seeded RNG:", 0)
t13_rows = np.array([[1, 0.83, 0.33], [2, 0.94, 0.50], [4, 0.97, 0.67], [8, 0.98, 1.00]])  # -> nprobe, recall, scanned
print("frontier rows [nprobe, recall, scanned]:", t13_rows.tolist())
t13_bar = 0.95                                                         # -> product recall bar
print("recall bar:", t13_bar)
t13_ok_mask = t13_rows[:, 1] >= t13_bar                                # -> [False,False,True,True]
print("meets bar mask:", t13_ok_mask.tolist())
t13_ok_rows = t13_rows[t13_ok_mask]                                    # -> rows for nprobe 4 and 8
print("eligible rows:", t13_ok_rows.tolist())
t13_best_pos = int(np.argmin(t13_ok_rows[:, 2]))                       # -> 0 within eligible rows
print("cheapest eligible position:", t13_best_pos)
t13_best = t13_ok_rows[t13_best_pos]                                   # -> [4,0.97,0.67]
print("chosen operating point:", t13_best.tolist())
assert int(t13_best[0]) == 4 and round(float(t13_best[1]), 2) == 0.97 and round(float(t13_best[2]), 2) == 0.67

plt.figure(figsize=(5, 3))
plt.plot(t13_rows[:, 2] * 100, t13_rows[:, 1], "o-", color="purple")
plt.axhline(t13_bar, color="red", linestyle="--", label="recall bar")
plt.scatter([t13_best[2] * 100], [t13_best[1]], s=180, facecolors="none", edgecolors="green", linewidths=3, label="chosen")
for t13_row in t13_rows:
    plt.text(t13_row[2] * 100 + 1, t13_row[1] - 0.01, f"nprobe={int(t13_row[0])}")
plt.xlabel("% of corpus scanned")
plt.ylabel("recall")
plt.ylim(0.8, 1.0)
plt.title("choose cheapest point that meets the recall bar")
plt.legend()
plt.show()
""")
md("▶ What you'll see: nprobe 4 is chosen because it is the first/cheapest point above the 0.95 recall "
   "bar. Step 10 applies this operating-point rule.")

md(r"""
## ✍️ Toy 14 · stale embeddings hide a freshly changed item

If item vectors are precomputed, a changed item can have a **new true vector** while the index still
stores the old stale vector. The exact same query misses the item in the stale index and finds it in
the fresh index.
""")
code(r"""
t14_rng = np.random.default_rng(0)                                     # -> seeded RNG for this toy
print("seeded RNG:", 0)
t14_old_items = np.array([[5,0], [4,0], [0,1], [0,4], [1,1], [2,0]], float)  # -> stale index vectors
print("old/stale item vectors:", t14_old_items.tolist())
t14_changed_id = 2                                                     # -> item that rebranded
print("changed item id:", t14_changed_id)
t14_new_items = t14_old_items.copy()                                   # -> fresh vector table starts as old
t14_new_items[t14_changed_id] = np.array([5, 5], float)                # -> changed item moves to the query topic
print("fresh item vectors:", t14_new_items.tolist())
t14_query = np.array([5, 5], float)                                    # -> query for the new profile
print("fresh-profile query:", t14_query.tolist())
t14_stale_scores = t14_old_items @ t14_query                           # -> [25,20,5,20,10,10]
print("scores against STALE index:", t14_stale_scores.astype(int).tolist())
t14_fresh_scores = t14_new_items @ t14_query                           # -> [25,20,50,20,10,10]
print("scores against FRESH index:", t14_fresh_scores.astype(int).tolist())
t14_stale_top2 = np.argsort(-t14_stale_scores)[:2]                     # -> [0,1] (changed item absent)
print("stale top-2:", t14_stale_top2.tolist())
t14_fresh_top2 = np.argsort(-t14_fresh_scores)[:2]                     # -> [2,0] (changed item returns)
print("fresh top-2:", t14_fresh_top2.tolist())
t14_stale_hit = t14_changed_id in t14_stale_top2                       # -> False
print("changed item hit in stale index?", bool(t14_stale_hit))
t14_fresh_hit = t14_changed_id in t14_fresh_top2                       # -> True
print("changed item hit in fresh index?", bool(t14_fresh_hit))
assert not t14_stale_hit and t14_fresh_hit

plt.figure(figsize=(5, 4))
plt.scatter(t14_old_items[:, 0], t14_old_items[:, 1], s=90, c="lightgray", edgecolor="black", label="stale items")
plt.scatter(t14_new_items[t14_changed_id, 0], t14_new_items[t14_changed_id, 1], s=170, c="green", edgecolor="black", label="fresh changed item")
plt.scatter(t14_query[0], t14_query[1], marker="*", s=280, c="gold", edgecolor="black", label="query")
for t14_j in range(6):
    plt.text(t14_old_items[t14_j, 0] + 0.08, t14_old_items[t14_j, 1] + 0.08, f"old {t14_j}")
plt.arrow(t14_old_items[t14_changed_id, 0], t14_old_items[t14_changed_id, 1], t14_new_items[t14_changed_id, 0] - t14_old_items[t14_changed_id, 0], t14_new_items[t14_changed_id, 1] - t14_old_items[t14_changed_id, 1], length_includes_head=True, head_width=0.18, color="green")
plt.title("freshness: stale vector misses, fresh vector hits")
plt.legend()
plt.show()
""")
md("▶ What you'll see: item 2 is absent from the stale top-2 but becomes the top result after its vector "
   "is refreshed. Step 11 shows this freshness trap at larger scale.")

# =================================================================== PART A
md("---\n# Part A · The two-tower model & training")

md(r"""
## Step 2 · What is a two-tower model?

Two separate encoders ("towers"):
- **query tower** `f_q(q)` → a vector for the request (a search query, an advertiser brief),
- **item tower** `f_i(i)` → a vector for each candidate (a creator, an ad).

Both output into the **same space**, and the match score is a **dot product**:
$$s(q,i)=f_q(q)^\top f_i(i)$$
The magic: item vectors **don't depend on the live query**, so you compute them **offline**,
index them, and at request time only run the query tower + a vector search. (A *cross-encoder*
that reads `(query, item)` together is more accurate but must run once per pair — too slow for
millions. That's why two-tower is the **first stage**.)
""")

md(r"""
## Step 3 · The training loss — in-batch softmax

In a batch of `B` matched `(query, item)` pairs, score **every query against every item in the
batch**. For each query, its own item is the **positive**; the other `B−1` items are
**negatives**. The loss makes the positive win a softmax:
$$\mathcal{L}_b=-\log\frac{e^{s(q_b,i_b)}}{\sum_{j=1}^{B} e^{s(q_b,i_j)}}$$
Worked example from the lesson: one query scored against 3 items — positive **4.0**, easy
negative **1.0**, hard negative **3.8**. The hard negative (close to the positive) keeps the
loss high — that's the pressure that teaches fine distinctions.
""")
code(r"""
scores = np.array([4.0, 1.0, 3.8])            # [positive, easy neg, hard neg]
probs = np.exp(scores) / np.exp(scores).sum()
print("positive probability:", round(probs[0], 2), " loss:", round(-np.log(probs[0]), 2))

# if the hard negative were easy (0.5 instead of 3.8):
easy = np.array([4.0, 1.0, 0.5]); pe = np.exp(easy)/np.exp(easy).sum()
print("if hard neg were easy: positive prob", round(pe[0],2), " loss", round(-np.log(pe[0]),2), "(tiny)")
plt.figure(figsize=(5,3)); plt.bar(["positive","easy neg","HARD neg"], np.exp(scores)/np.exp(scores).sum(), color=[GREEN,GRAY,RED])
plt.ylabel("softmax probability"); plt.title("hard negative steals probability -> keeps loss high"); plt.show()
""")

md(r"""
## Step 4 · Build & train the two towers (PyTorch)

We make synthetic data: queries and their matched items share a hidden "topic + taste," so a
positive pair should score high. Each tower is a small network mapping **raw features →
embedding**. We train with the in-batch softmax: in code that's just a **cross-entropy where
the correct class is the diagonal** of the query×item score matrix.
""")
code(r"""
D_raw, D_emb, V = 32, 16, 8
rng = np.random.default_rng(0)
centers = rng.normal(0, 1, (V, D_raw))                    # a topic center per vertical
def make(n, seed):
    r = np.random.default_rng(seed); v = r.integers(0, V, n)
    taste = r.normal(0, 1, (n, D_raw)) * 0.5
    q = centers[v] + taste + r.normal(0, 0.3, (n, D_raw))
    i = centers[v] + taste + r.normal(0, 0.3, (n, D_raw))  # matched item shares topic+taste
    return torch.tensor(q, dtype=torch.float32), torch.tensor(i, dtype=torch.float32)
Q, I = make(4000, 1)
Qte, Ite = make(1000, 2)

class Tower(nn.Module):
    def __init__(self):
        super().__init__(); self.net = nn.Sequential(nn.Linear(D_raw, 32), nn.ReLU(), nn.Linear(32, D_emb))
    def forward(self, x): return self.net(x)

query_tower, item_tower = Tower(), Tower()
opt = torch.optim.Adam(list(query_tower.parameters()) + list(item_tower.parameters()), lr=0.01)

def in_batch_loss(qe, ie):
    S = qe @ ie.T                          # [B,B] every query vs every item in the batch
    labels = torch.arange(len(qe))         # the positive for row b is item b (the diagonal)
    return nn.functional.cross_entropy(S, labels)

B = 256; losses = []
for epoch in range(15):
    perm = torch.randperm(len(Q)); tot = 0.0; nb = 0
    for k in range(0, len(Q), B):
        idx = perm[k:k+B]
        loss = in_batch_loss(query_tower(Q[idx]), item_tower(I[idx]))
        opt.zero_grad(); loss.backward(); opt.step(); tot += loss.item(); nb += 1
    losses.append(tot/nb)
    if epoch % 3 == 0: print(f"  epoch {epoch:>2}: in-batch softmax loss {losses[-1]:.3f}")
plt.figure(figsize=(5.5,3)); plt.plot(losses, color=BLUE)
plt.xlabel("epoch"); plt.ylabel("loss"); plt.title("two-tower training (in-batch softmax)"); plt.show()
""")

md(r"""
## Step 5 · Evaluate — recall@k

Retrieval quality: embed the test queries and items, score each query against **all** test
items, and ask **"is the true match in the top k?"** That's recall@k.
""")
code(r"""
with torch.no_grad():
    qe, ie = query_tower(Qte), item_tower(Ite)
    S = (qe @ ie.T).numpy()                # row r's positive item is item r
def recall_at_k(S, k):
    return np.mean([r in np.argpartition(-S[r], k)[:k] for r in range(len(S))])
for k in [1, 5, 10, 20]:
    print(f"recall@{k:>2}: {recall_at_k(S,k):.3f}   (random {k/len(S):.3f})")
ks = [1,2,5,10,20,50]; rec = [recall_at_k(S,k) for k in ks]
plt.figure(figsize=(5.5,3.2)); plt.plot(ks, rec, "o-", color=GREEN)
plt.xscale("log"); plt.xlabel("k (log)"); plt.ylabel("recall@k"); plt.title("retrieval recall of the trained towers"); plt.show()
""")

md(r"""
## Step 6 · Negative types — and why **hard negatives** matter

Where do the negatives come from? Four choices:
- **random** — a random item from the corpus (clearly wrong; teaches broad separation).
- **in-batch** — the other positives in the batch (cheap — what we used above).
- **sampled** — drawn from a distribution (needs logQ correction — next step).
- **hard** — plausible-but-wrong items (force the sharpest boundary).

A **hard negative** competes with the positive in the softmax, so it **steals probability** and
keeps the gradient alive. Lesson example: positive 3.0, easy 0.2, hard 2.8.
""")
code(r"""
def softmax(x): x = x - x.max(); return np.exp(x)/np.exp(x).sum()
with_hard    = softmax(np.array([3.0, 0.2, 2.8]))   # positive, easy, HARD
without_hard = softmax(np.array([3.0, 0.2]))         # positive, easy only
print("positive probability WITH a hard negative :", round(with_hard[0], 2), "-> loss", round(-np.log(with_hard[0]),2))
print("positive probability WITHOUT it           :", round(without_hard[0], 2), "-> loss", round(-np.log(without_hard[0]),2))
print("the gap is the training signal: a hard negative forces the model to separate look-alikes.")
plt.figure(figsize=(5,3))
plt.bar(["positive","easy neg","hard neg"], with_hard, color=[GREEN, GRAY, RED])
plt.ylabel("softmax probability"); plt.title("hard negative competes with the positive"); plt.show()
print("\ncaution: a hard negative must actually be NEGATIVE. two valid creators for one brief")
print("can look like a hard pair -> filter false negatives before training.")
""")

md(r"""
## Step 7 · logQ — correcting the negative sampler

If you **sample** negatives (e.g. by popularity), popular items appear too often *just because
the sampler favors them* — the model would learn the sampler, not the task. Subtract the log
sampling probability from the score before the softmax:
$$s'(q,i)=s(q,i)-\log Q(i)$$
(Same correction you saw in M10/M11.) Lesson example: raw score 2.0 for two negatives sampled
with `Q=0.20` (popular) and `Q=0.01` (rare).
""")
code(r"""
for Q in [0.20, 0.01]:
    print(f"raw score 2.0, sampled with Q={Q:<4} -> corrected {2.0 - np.log(Q):.2f}")
print("the rare item (small Q) is lifted more: each rare draw represents many un-sampled peers.")
""")

# =================================================================== PART B
md("---\n# Part B · Serving two-tower retrieval")

md(r"""
## Step 8 · The serving funnel — precompute, then search

Serving works because item vectors **don't depend on the live query**:

```
OFFLINE:  item tower -> item vectors -> build ANN index (versioned)
ONLINE :  request -> query tower -> ONE query vector -> ANN top-K
          -> filters/dedupe -> hand top-K to the ranker
```

No negatives are sampled online — the index just returns the highest-scoring candidates. Let's
precompute our item vectors and serve a query with **exact** (brute-force) search first.
""")
code(r"""
with torch.no_grad():
    item_vecs  = item_tower(Ite).numpy()        # PRECOMPUTED offline, indexed once
    query_vecs = query_tower(Qte).numpy()       # computed per request online

def exact_topk(qv, k=50): return set(np.argsort(-(item_vecs @ qv))[:k])
example = exact_topk(query_vecs[0], 10)
print("exact brute-force top-10 for query 0:", sorted(example))
print("true match (item 0) retrieved?", 0 in example)
print("\nbrute force scores ALL", len(item_vecs), "items per query -> correct but slow at scale.")
""")

md(r"""
## Step 9 · An ANN index — scan a fraction, keep most of the recall

Brute force is too slow at millions of items. An **ANN index** scans only a **fraction**. We
build a simple **IVF-style** index: cluster items into cells; at query time probe only the
nearest `nprobe` cells. Sweeping `nprobe` trades **recall** for **work scanned** — the core
retrieval knob (M13 goes deeper on HNSW / IVF-PQ / ScaNN).
""")
code(r"""
from sklearn.cluster import KMeans
nlist = 64
km = KMeans(nlist, n_init=3, random_state=0).fit(item_vecs)
cents = km.cluster_centers_
members = [np.where(km.labels_ == c)[0] for c in range(nlist)]

def ivf_topk(qv, nprobe, k=50):
    near = np.argsort(-(cents @ qv))[:nprobe]                       # nearest cells
    cand = np.concatenate([members[c] for c in near])
    if len(cand) < k: return set(cand)
    return set(cand[np.argsort(-(item_vecs[cand] @ qv))[:k]])

print(f"IVF index: {len(item_vecs)} items in {nlist} cells\n")
print(f"{'nprobe':>7}{'recall@50':>11}{'% scanned':>11}")
rows = []
for nprobe in [1, 2, 4, 8, 16, 32]:
    recs, scan = [], []
    for qv in query_vecs:
        ex = exact_topk(qv, 50); ap = ivf_topk(qv, nprobe, 50)
        recs.append(len(ex & ap)/50)
        scan.append(sum(len(members[c]) for c in np.argsort(-(cents@qv))[:nprobe])/len(item_vecs))
    rows.append((nprobe, np.mean(recs), np.mean(scan)))
    print(f"{nprobe:>7}{np.mean(recs):>11.2f}{np.mean(scan)*100:>10.1f}%")
""")

md(r"""
## Step 10 · Read the tradeoff — pick an operating point

Plot **recall vs work scanned** (a proxy for latency). Every extra bit of recall costs more
scanning. You pick the **cheapest point that meets the product's recall bar** — not the max.
""")
code(r"""
nprobes = [r[0] for r in rows]; recs = [r[1] for r in rows]; scans = [r[2]*100 for r in rows]
fig, ax = plt.subplots(1, 2, figsize=(11, 3.6))
ax[0].plot(scans, recs, "o-", color=PURPLE)
for np_, s, rc in rows: ax[0].annotate(f"nprobe={np_}", (s*100, rc), textcoords="offset points", xytext=(5,-8), fontsize=8)
ax[0].axhline(0.95, color=RED, ls="--", label="recall bar 0.95")
ax[0].set_xlabel("% of corpus scanned (~latency)"); ax[0].set_ylabel("recall@50"); ax[0].legend()
ax[0].set_title("the recall vs work frontier")
ax[1].plot(nprobes, recs, "o-", color=GREEN); ax[1].set_xlabel("nprobe"); ax[1].set_ylabel("recall@50")
ax[1].set_title("more probes -> more recall (diminishing)")
plt.show()
ok = [r for r in rows if r[1] >= 0.95]
if ok:
    best = min(ok, key=lambda r: r[2])
    print(f"cheapest setting meeting recall>=0.95: nprobe={best[0]} ({best[1]:.2f} recall, {best[2]*100:.1f}% scanned)")
""")

md(r"""
## Step 11 · The freshness trap — stale embeddings

Item vectors are precomputed on a schedule. If a creator **changes** (e.g. rebrands to "B2B
cybersecurity") but the index still holds **yesterday's** vector, searches miss them until the
next rebuild. **ANN recall against the stale index can look fine while product recall for fresh
items is poor.** Freshness is a *serving* metric, not a modeling afterthought.
""")
code(r"""
# a creator rebrands: their TRUE vector moves, but the index still has the old one
rng = np.random.default_rng(3)
changed = rng.choice(len(item_vecs), 200, replace=False)
new_true = item_vecs.copy()
new_true[changed] += rng.normal(0, 2.5, (200, item_vecs.shape[1]))   # big profile change

# queries that now match the NEW profile
q_new = new_true[changed] + rng.normal(0, 0.2, (200, item_vecs.shape[1]))
def found(index_vecs):
    hits = 0
    for j, qv in zip(changed, q_new):
        if j in set(np.argsort(-(index_vecs @ qv))[:50]): hits += 1
    return hits/len(changed)
print("recall@50 for rebranded creators:")
print(f"  against STALE index (old vectors): {found(item_vecs):.2f}  <- they vanish")
print(f"  against FRESH index (new vectors): {found(new_true):.2f}  <- rebuild fixes it")
plt.figure(figsize=(4.6,3)); plt.bar(["stale index","fresh index"], [found(item_vecs), found(new_true)], color=[RED, GREEN])
plt.ylabel("recall@50 (rebranded)"); plt.title("stale embeddings hide fresh items"); plt.show()
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## Recap — the M12 toolkit

**The model (Part A).** A **two-tower** model encodes the **query** and each **item**
separately into a shared space; the score is a **dot product**. You train it with the
**in-batch softmax** loss (each query's own item is the positive, the rest of the batch are
negatives). **Hard negatives** — plausible-but-wrong items — compete with the positive in the
softmax and force sharper boundaries (but must be truly negative). When you **sample**
negatives, apply the **logQ** correction so the model learns the task, not the sampler.

**Serving (Part B).** Because item vectors don't depend on the query, you **precompute** and
**index** them; online you run only the **query tower** + a fast **ANN** search. The **ANN knob**
(here `nprobe`) trades **recall for work/latency** — pick the **cheapest point that meets the
recall bar**. Watch **freshness**: a stale index hides items that recently changed.

**Where this connects:** M12 turns M11's embeddings into a retrieval *system*. Its in-batch
softmax + negatives build on M10 (sampling, logQ). The ANN index is the subject of **M13**
(HNSW / IVF-PQ / ScaNN tuning), and the towers themselves are **encoders** trained
contrastively — the subject of **M14**.
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M12 · Two-Tower Retrieval", "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M12-two-tower-retrieval.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
