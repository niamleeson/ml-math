#!/usr/bin/env python3
"""Generate afp/notebooks/M11-embeddings-representation.ipynb.

A runnable, beginner-friendly Colab notebook for module M11: embeddings &
representation learning. Part A covers what an embedding encodes, dot vs cosine
similarity, why L2-normalize, and ID vs text embeddings, ending with the
"checks before trusting neighbors" (norms, dot-vs-cosine neighbors, hubness).
Part B learns an embedding with negative sampling (matrix factorization / BPR —
the same objective as word2vec / skip-gram),
covers alignment & uniformity, and walks the evaluation ladder as concrete
CHECKS: recall@k, slice checks (cold-start gap), and probing.

Granular: small steps, plain-language explanation, print logging, and a
visualization for every idea. Colab-preinstalled libraries only
(numpy / pandas / scikit-learn / matplotlib).

Run: python3 tools/gen-m11-notebook.py
"""
import json, os

cells = []
def md(t):   cells.append({"cell_type": "markdown", "metadata": {}, "source": t.strip("\n").splitlines(keepends=True)})
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": s.strip("\n").splitlines(keepends=True)})

# ------------------------------------------------------------------- intro
md(r"""
# M11 · Embeddings & Representation Learning — Hands-on, Step by Tiny Step

**Companion to lesson M11. Written for someone new to ML.**

An **embedding** turns any entity — a creator, a search query, an ad, a word — into a list of
numbers (a **vector**), placed in a space where **similar things sit close together**. That
lets you *search*, *cluster*, and *feed* entities into other models. The catch: "close" means
**"the training signal made these look similar,"** not "these are truly the same." This
notebook builds that intuition, then shows the two things you must be able to do:
**compare vectors correctly** and **check whether the space is any good.**

**What you'll do (every step has an explanation, logging, and a picture):**
- **Part A · What embeddings encode & similarity:** vectors as points, **dot product vs
  cosine**, why you **L2-normalize**, **ID vs text** embeddings, and the **checks before
  trusting neighbors** (norms, dot-vs-cosine, hubness).
- **Part B · Learning & evaluating:** **learn** an embedding with **negative sampling**
  (the same objective behind **word2vec / skip-gram**),
  measure **alignment & uniformity**, then run the evaluation **checks** — **recall@k**,
  **slice checks** (the cold-start gap), and **probing**.

We use **scikit-learn** + **matplotlib** (no installs in Colab). Run each cell with
**Shift+Enter**.
""")

md(r"""
## Step 1 · Setup
""")
code(r"""
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"
print("ready")
""")


md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full notebook, here is **one tiny, hand-traceable toy example for every mechanic** in
this lesson — points/neighborhoods, dot vs cosine, normalization, normalization decision tests,
ID vs text cold-start, neighbor sanity checks, skip-gram negative sampling, alignment, uniformity,
recall@k, slice checks, probing, and the 2D projection used for inspection. Each uses a handful of
small numbers you can check by hand, prints every intermediate value, and draws one picture. The
at-scale versions follow in Parts A–B.
""")

md(r"""
## ✍️ Toy 1 · embeddings are points, neighborhoods are distances

An embedding is just coordinates. To read the space, measure distances from a query point to each
entity; nearby points form the neighborhood. Six tiny 2D creators make the cluster visible by hand.
""")
code(r"""
t1_names = ["Fit-A", "Fit-B", "Fit-C", "Fin-D", "Fin-E", "Fin-F"]
t1_items = np.array([[1,1], [2,1], [1,2], [8,8], [9,8], [8,9]], float)
t1_query = np.array([1, 1], float)
t1_offsets = t1_items - t1_query                                  # -> [[0,0],[1,0],[0,1],[7,7],[8,7],[7,8]]
print("offset from query to each item:", t1_offsets.astype(int).tolist())
t1_d2 = (t1_offsets**2).sum(axis=1)                               # -> [0, 1, 1, 98, 113, 113]
print("squared distances:", t1_d2.astype(int).tolist())
t1_order = np.argsort(t1_d2)                                      # -> [0, 1, 2, 3, 4, 5]
print("nearest-to-farthest item ids:", t1_order.tolist())
t1_top3 = t1_order[:3].tolist()                                   # -> [0, 1, 2]
print("top-3 neighborhood:", [(t1_i, t1_names[t1_i]) for t1_i in t1_top3])
assert t1_top3 == [0, 1, 2]

plt.figure(figsize=(4.8, 4.2))
plt.scatter(t1_items[:3,0], t1_items[:3,1], s=120, color=GREEN, label="fitness cluster")
plt.scatter(t1_items[3:,0], t1_items[3:,1], s=120, color=BLUE, label="finance cluster")
for t1_i, (t1_x, t1_y) in enumerate(t1_items):
    plt.text(t1_x + 0.1, t1_y + 0.1, f"{t1_i}: {t1_names[t1_i]}")
plt.scatter(*t1_query, marker="*", s=260, color=GOLD, edgecolor="k", label="query")
plt.title("nearest points define the embedding neighborhood"); plt.legend(); plt.show()
""")
md("▶ What you'll see: the query at `[1,1]` has distances `[0,1,1,98,113,113]`, so its hand-checked "
   "neighborhood is the three fitness points. Step 2 draws the same idea for creator embeddings.")

md(r"""
## ✍️ Toy 2 · dot product vs cosine by hand

Dot product rewards both direction and length; cosine divides length away and keeps only angle. The
same six vectors show why a long vector can win by dot even when another vector points just as well.
""")
code(r"""
t2_q = np.array([1, 0], float)
t2_items = np.array([[4,0], [2,2], [0,3], [1,0], [-1,0], [0,-2]], float)
t2_dots = t2_items @ t2_q                                         # -> [4, 2, 0, 1, -1, 0]
print("dot scores:", t2_dots.astype(int).tolist())
t2_item_norms = np.linalg.norm(t2_items, axis=1)                  # -> [4.00, 2.83, 3.00, 1.00, 1.00, 2.00]
print("item norms:", np.round(t2_item_norms, 2).tolist())
t2_q_norm = np.linalg.norm(t2_q)                                  # -> 1.0
print("query norm:", float(t2_q_norm))
t2_cosines = t2_dots / (t2_q_norm * t2_item_norms)                # -> [1.00, 0.71, 0.00, 1.00, -1.00, 0.00]
print("cosine scores:", np.round(t2_cosines, 2).tolist())
t2_dot_best = int(np.argmax(t2_dots))                             # -> 0
t2_cos_best = np.where(np.isclose(t2_cosines, t2_cosines.max()))[0].tolist()  # -> [0, 3]
print("best by dot:", t2_dot_best, " best by cosine tie:", t2_cos_best)
assert t2_dots[0] == 4 and np.isclose(t2_cosines[0], t2_cosines[3])

plt.figure(figsize=(4.8, 4.2))
plt.axhline(0, color=GRAY, lw=.7); plt.axvline(0, color=GRAY, lw=.7)
for t2_i, t2_v in enumerate(t2_items):
    plt.annotate("", xy=t2_v, xytext=(0,0), arrowprops=dict(arrowstyle="->", lw=2))
    plt.text(t2_v[0] + 0.08, t2_v[1] + 0.08, f"{t2_i}: dot={t2_dots[t2_i]:.0f}, cos={t2_cosines[t2_i]:.2f}")
plt.annotate("", xy=t2_q*4.5, xytext=(0,0), arrowprops=dict(arrowstyle="->", color=RED, lw=3), label="query")
plt.xlim(-1.5, 4.8); plt.ylim(-2.5, 3.5); plt.title("dot sees length; cosine sees angle"); plt.show()
""")
md("▶ What you'll see: item 0 and item 3 both have cosine 1.0, but item 0's longer norm makes its "
   "dot score 4 instead of 1. Step 3 uses this exact distinction.")

md(r"""
## ✍️ Toy 3 · L2-normalization turns dot into cosine

L2-normalizing scales each vector to length 1. After that, a dot product with a normalized query is
exactly cosine similarity, so ranking is based on direction instead of magnitude.
""")
code(r"""
t3_vecs = np.array([[3,0], [0,4], [3,4], [-2,0], [1,1], [0,-2]], float)
t3_q = np.array([1, 0], float)
t3_norms = np.linalg.norm(t3_vecs, axis=1)                        # -> [3.00, 4.00, 5.00, 2.00, 1.41, 2.00]
print("raw norms:", np.round(t3_norms, 2).tolist())
t3_unit_vecs = t3_vecs / t3_norms[:, None]                        # -> first rows [[1,0],[0,1],[0.6,0.8],...]
print("unit vectors:", np.round(t3_unit_vecs, 2).tolist())
t3_unit_q = t3_q / np.linalg.norm(t3_q)                           # -> [1.0, 0.0]
print("unit query:", t3_unit_q.tolist())
t3_raw_dots = t3_vecs @ t3_q                                      # -> [3, 0, 3, -2, 1, 0]
print("raw dot scores:", t3_raw_dots.astype(int).tolist())
t3_unit_dots = t3_unit_vecs @ t3_unit_q                           # -> [1.00, 0.00, 0.60, -1.00, 0.71, 0.00]
print("dot after normalization:", np.round(t3_unit_dots, 2).tolist())
t3_cosines = t3_raw_dots / (t3_norms * np.linalg.norm(t3_q))       # -> [1.00, 0.00, 0.60, -1.00, 0.71, 0.00]
print("cosines from formula:", np.round(t3_cosines, 2).tolist())
assert np.allclose(np.linalg.norm(t3_unit_vecs, axis=1), 1.0) and np.allclose(t3_unit_dots, t3_cosines)

plt.figure(figsize=(5, 4.2))
plt.bar(np.arange(6) - .18, t3_raw_dots, .36, label="raw dot", color=BLUE)
plt.bar(np.arange(6) + .18, t3_unit_dots, .36, label="normalized dot = cosine", color=GREEN)
plt.xlabel("item id"); plt.ylabel("score"); plt.title("normalization removes magnitude from the score"); plt.legend(); plt.show()
""")
md("▶ What you'll see: the normalized-dot list matches the cosine list exactly. Step 4 uses that "
   "fact when norm should not act like popularity.")

md(r"""
## ✍️ Toy 4 · norm-vs-nuisance correlation decision test

The first normalization test asks whether vector length tracks a nuisance such as popularity. If
norm is basically a popularity meter, raw dot-product retrieval is partly ranking by popularity.
""")
code(r"""
t4_popularity = np.array([1, 2, 3, 4, 5, 6], float)
t4_vectors = np.array([[1,0], [2,0], [3,0], [4,0], [5,0], [6,0]], float)
t4_norms = np.linalg.norm(t4_vectors, axis=1)                     # -> [1, 2, 3, 4, 5, 6]
print("popularity:", t4_popularity.astype(int).tolist())
print("embedding norms:", t4_norms.astype(int).tolist())
t4_corr = np.corrcoef(t4_popularity, t4_norms)[0, 1]              # -> 1.0
print("corr(norm, popularity):", round(float(t4_corr), 2))
t4_decision = "normalize" if abs(t4_corr) > 0.8 else "keep raw"  # -> normalize
print("decision:", t4_decision)
assert np.isclose(t4_corr, 1.0) and t4_decision == "normalize"

plt.figure(figsize=(4.8, 3.4))
plt.scatter(t4_popularity, t4_norms, s=120, color=PURPLE)
plt.xlabel("popularity nuisance"); plt.ylabel("embedding norm"); plt.title("high norm-popularity correlation -> normalize"); plt.show()
""")
md("▶ What you'll see: popularity and norm line up perfectly (`r = 1.0`), so the measured decision is "
   "to normalize. Step 4b runs this test at a larger scale.")

md(r"""
## ✍️ Toy 5 · ranking-flip decision test

The second normalization test compares top-k by dot and top-k by cosine. If the lists flip, norm is
steering retrieval; normalize unless that magnitude is intentionally meaningful.
""")
code(r"""
t5_q = np.array([1, 0], float)
t5_items = np.array([[5,5], [1,0], [2,.2], [0,1], [3,-3], [-1,0]], float)
t5_dots = t5_items @ t5_q                                        # -> [5, 1, 2, 0, 3, -1]
print("dot scores:", np.round(t5_dots, 2).tolist())
t5_norms = np.linalg.norm(t5_items, axis=1)                      # -> [7.07, 1.00, 2.01, 1.00, 4.24, 1.00]
print("norms:", np.round(t5_norms, 2).tolist())
t5_cosines = t5_dots / t5_norms                                  # -> [0.71, 1.00, 1.00, 0.00, 0.71, -1.00]
print("cosine scores:", np.round(t5_cosines, 3).tolist())
t5_dot_top2 = np.argsort(-t5_dots)[:2].tolist()                  # -> [0, 4]
t5_cos_top2 = np.argsort(-t5_cosines)[:2].tolist()               # -> [1, 2]
print("top-2 by dot:", t5_dot_top2)
print("top-2 by cosine:", t5_cos_top2)
t5_overlap = len(set(t5_dot_top2) & set(t5_cos_top2)) / 2         # -> 0.0
print("top-2 overlap:", t5_overlap)
assert t5_dot_top2 == [0, 4] and t5_cos_top2 == [1, 2] and t5_overlap == 0.0

plt.figure(figsize=(5.2, 3.6))
plt.bar(np.arange(6) - .18, t5_dots, .36, color=BLUE, label="dot")
plt.bar(np.arange(6) + .18, t5_cosines, .36, color=GREEN, label="cosine")
plt.xlabel("item id"); plt.ylabel("score"); plt.title("low overlap means norm changes who you retrieve"); plt.legend(); plt.show()
""")
md("▶ What you'll see: dot returns `[0,4]`, cosine returns `[1,2]`, and overlap is 0.0 — a concrete "
   "ranking flip. Step 4b uses this as the practical normalize/keep-raw test.")

md(r"""
## ✍️ Toy 6 · ID vs text embeddings for cold-start

An ID embedding memorizes behavior when history exists; a text embedding can still land near the
right topic for a new entity. Compare six tiny representations by cosine to one topic direction.
""")
code(r"""
t6_labels = ["est ID", "est text", "new ID", "new text", "off ID", "off text"]
t6_topic = np.array([1, 1], float)
t6_vectors = np.array([[2,2], [1,2], [2,-2], [1,2], [-1,0], [0,-2]], float)
t6_dots = t6_vectors @ t6_topic                                  # -> [4, 3, 0, 3, -1, -2]
print("dot to topic:", t6_dots.astype(int).tolist())
t6_norms = np.linalg.norm(t6_vectors, axis=1)                    # -> [2.83, 2.24, 2.83, 2.24, 1.00, 2.00]
print("representation norms:", np.round(t6_norms, 2).tolist())
t6_topic_norm = np.linalg.norm(t6_topic)                         # -> 1.41
t6_cosines = t6_dots / (t6_norms * t6_topic_norm)                # -> [1.00, 0.95, 0.00, 0.95, -0.71, -0.71]
print("cosine to topic:", {t6_labels[t6_i]: round(float(t6_cosines[t6_i]), 2) for t6_i in range(6)})
assert t6_cosines[3] > t6_cosines[2] and np.isclose(t6_cosines[0], 1.0)

plt.figure(figsize=(5.6, 3.5))
plt.bar(t6_labels, t6_cosines, color=[GREEN, GREEN, RED, GREEN, GRAY, GRAY])
plt.axhline(0, color="black", lw=.7); plt.ylabel("cosine to topic"); plt.xticks(rotation=20)
plt.title("new text stays near topic; new ID is untrained noise"); plt.show()
""")
md("▶ What you'll see: the new ID has cosine 0.00, while the new text vector has cosine 0.95. Step 5 "
   "uses this cold-start gap to motivate blending ID and text signals.")

md(r"""
## ✍️ Toy 7 · norm outlier sanity check

Before trusting neighbors, scan vector norms. A single high-norm item can act like a popularity hub
under dot product, so the norm histogram is the fastest pre-flight check.
""")
code(r"""
t7_items = np.array([[10,0], [1,0], [0,1], [1,1], [-1,0], [0,-1]], float)
t7_norms = np.linalg.norm(t7_items, axis=1)                      # -> [10.00, 1.00, 1.00, 1.41, 1.00, 1.00]
print("norms:", np.round(t7_norms, 2).tolist())
t7_median = np.median(t7_norms)                                  # -> 1.0
print("median norm:", float(t7_median))
t7_ratios = t7_norms / t7_median                                 # -> [10.00, 1.00, 1.00, 1.41, 1.00, 1.00]
print("norm / median:", np.round(t7_ratios, 2).tolist())
t7_outliers = np.where(t7_ratios > 3)[0].tolist()                # -> [0]
print("outlier ids (>3x median):", t7_outliers)
assert t7_outliers == [0]

plt.figure(figsize=(5, 3.4))
plt.bar(range(6), t7_norms, color=[RED if t7_i in t7_outliers else GRAY for t7_i in range(6)])
plt.axhline(3*t7_median, color=RED, ls="--", label="3x median")
plt.xlabel("item id"); plt.ylabel("norm"); plt.title("norm sanity check finds the high-norm hub"); plt.legend(); plt.show()
""")
md("▶ What you'll see: item 0 has norm 10, far above the 3×-median line. Step 6 starts with this "
   "same norm-outlier check.")

md(r"""
## ✍️ Toy 8 · dot-vs-cosine neighbor sanity check

Even after a norm scan, compare the actual neighbor lists. If dot and cosine top-k disagree, the
space is telling you that magnitude is changing retrieval.
""")
code(r"""
t8_q = np.array([1, 0], float)
t8_items = np.array([[9,2], [2,0], [4,4], [0,3], [-1,0], [1,0]], float)
t8_dot_scores = t8_items @ t8_q                                  # -> [9, 2, 4, 0, -1, 1]
print("dot scores:", t8_dot_scores.astype(int).tolist())
t8_norms = np.linalg.norm(t8_items, axis=1)                      # -> [9.22, 2.00, 5.66, 3.00, 1.00, 1.00]
print("norms:", np.round(t8_norms, 2).tolist())
t8_cos_scores = t8_dot_scores / t8_norms                         # -> [0.98, 1.00, 0.71, 0.00, -1.00, 1.00]
print("cosine scores:", np.round(t8_cos_scores, 2).tolist())
t8_dot_top2 = np.argsort(-t8_dot_scores)[:2].tolist()            # -> [0, 2]
t8_cos_top2 = np.argsort(-t8_cos_scores)[:2].tolist()            # -> [1, 5]
print("dot top-2:", t8_dot_top2)
print("cosine top-2:", t8_cos_top2)
t8_agree = set(t8_dot_top2) == set(t8_cos_top2)                  # -> False
print("same neighbor set?", t8_agree)
assert t8_dot_top2 == [0, 2] and t8_cos_top2 == [1, 5] and not t8_agree

plt.figure(figsize=(5.2, 3.5))
plt.bar(np.arange(6) - .18, t8_dot_scores, .36, label="dot", color=BLUE)
plt.bar(np.arange(6) + .18, t8_cos_scores, .36, label="cosine", color=GREEN)
plt.xlabel("item id"); plt.ylabel("score"); plt.title("different top-k lists flag norm-driven retrieval"); plt.legend(); plt.show()
""")
md("▶ What you'll see: dot chooses high-score items `[0,2]`, while cosine chooses aligned items `[1,5]`. "
   "Step 6 performs this neighbor sanity check before trusting results.")

md(r"""
## ✍️ Toy 9 · hubness count by hand

A hub is an item that becomes the nearest neighbor for many unrelated queries. Count each query's
nearest item; a long right tail means some vectors dominate the space.
""")
code(r"""
t9_items = np.array([[0,0], [1,0], [-1,0], [0,1], [0,-1], [3,3]], float)
t9_queries = np.array([[.2,0], [-.2,0], [0,.2], [0,-.2], [.3,.3], [2.8,3]], float)
t9_d2 = ((t9_queries[:, None, :] - t9_items[None, :, :])**2).sum(axis=2)  # -> 6 queries x 6 item distances
print("distance table:\n", np.round(t9_d2, 2))
t9_nn = np.argmin(t9_d2, axis=1)                                # -> [0, 0, 0, 0, 0, 5]
print("nearest item per query:", t9_nn.tolist())
t9_counts = np.bincount(t9_nn, minlength=len(t9_items))          # -> [5, 0, 0, 0, 0, 1]
print("nearest-neighbor counts:", t9_counts.tolist())
t9_hub = int(np.argmax(t9_counts))                              # -> 0
print("biggest hub:", t9_hub, "with", int(t9_counts[t9_hub]), "queries")
assert t9_hub == 0 and t9_counts.tolist() == [5, 0, 0, 0, 0, 1]

plt.figure(figsize=(5, 3.4))
plt.bar(range(6), t9_counts, color=[RED if t9_i == t9_hub else GRAY for t9_i in range(6)])
plt.xlabel("item id"); plt.ylabel("# queries where item is nearest"); plt.title("hubness = repeated nearest-neighbor wins"); plt.show()
""")
md("▶ What you'll see: item 0 is nearest for 5 of 6 queries, so it is a hub. Step 6 counts the same "
   "thing over the learned embedding space.")

md(r"""
## ✍️ Toy 10 · weighted positive pairs and train/test holdout

Before training, the notebook builds positive brief↔creator pairs. Affinity becomes a probability;
established creators get boosted, rare verticals get downweighted, and one positive is held out for
evaluation.
""")
code(r"""
t10_rng = np.random.default_rng(0)
t10_affinity = np.array([3, 2, 1, 0, 1, 2], float)
t10_established = np.array([1, 1, 0, 1, 0, 0], bool)
t10_rare = np.array([0, 0, 0, 0, 1, 1], bool)
t10_base = np.exp(t10_affinity - t10_affinity.max())             # -> [1.00, 0.37, 0.14, 0.05, 0.14, 0.37]
print("softmax base weights:", np.round(t10_base, 3).tolist())
t10_boost = np.where(t10_established, 2.0, 1.0)                  # -> [2, 2, 1, 2, 1, 1]
print("established boost:", t10_boost.astype(int).tolist())
t10_penalty = np.where(t10_rare, 0.5, 1.0)                       # -> [1.0, 1.0, 1.0, 1.0, 0.5, 0.5]
print("rare-vertical penalty:", t10_penalty.tolist())
t10_weights = t10_base * t10_boost * t10_penalty                 # -> [2.00, 0.74, 0.14, 0.10, 0.07, 0.18]
print("final unnormalized weights:", np.round(t10_weights, 3).tolist())
t10_probs = t10_weights / t10_weights.sum()                      # -> [0.621, 0.228, 0.042, 0.031, 0.021, 0.057]
print("sampling probabilities:", np.round(t10_probs, 3).tolist())
t10_chosen = t10_rng.choice(6, 3, replace=False, p=t10_probs)    # -> [1, 0, 2]
print("sampled positives:", t10_chosen.tolist())
t10_train = t10_chosen[:-1].tolist()                             # -> [1, 0]
t10_test = int(t10_chosen[-1])                                   # -> 2
print("train positives:", t10_train, " held-out test positive:", t10_test)
assert t10_chosen.tolist() == [1, 0, 2] and t10_train == [1, 0] and t10_test == 2

plt.figure(figsize=(5.2, 3.5))
plt.bar(range(6), t10_probs, color=[GREEN if t10_established[t10_i] else GOLD for t10_i in range(6)])
plt.xlabel("creator id"); plt.ylabel("positive-pair probability"); plt.title("positive sampling weights before skip-gram training"); plt.show()
""")
md("▶ What you'll see: affinity plus boosts produces probabilities, the seeded draw picks positives "
   "`[1,0,2]`, and creator 2 becomes the held-out positive. Step 7 does this for every brief.")

md(r"""
## ✍️ Toy 11 · one skip-gram negative-sampling update

Skip-gram-style training pushes a positive context above a sampled negative. Trace one BPR update:
compute positive and negative scores, loss, gradient weight, and the nudged vectors.
""")
code(r"""
t11_rng = np.random.default_rng(0)
t11_vectors = np.array([[1,1], [1,0], [-1,1], [0,-1], [2,2], [0,2]], float)
t11_center_i = 0
t11_pos_i = 1
t11_neg_i = int(t11_rng.choice([2, 3, 4, 5]))                    # -> 5
t11_center = t11_vectors[t11_center_i].copy()                    # -> [1, 1]
t11_pos = t11_vectors[t11_pos_i].copy()                          # -> [1, 0]
t11_neg = t11_vectors[t11_neg_i].copy()                          # -> [0, 2]
print("center, positive, negative ids:", t11_center_i, t11_pos_i, t11_neg_i)
print("start vectors:", t11_center.tolist(), t11_pos.tolist(), t11_neg.tolist())
t11_pos_score = float(t11_center @ t11_pos)                      # -> 1.0
print("positive score:", t11_pos_score)
t11_neg_score = float(t11_center @ t11_neg)                      # -> 2.0
print("negative score:", t11_neg_score)
t11_diff = t11_pos_score - t11_neg_score                         # -> -1.0
t11_loss = float(np.log1p(np.exp(-t11_diff)))                    # -> 1.313
print("score diff and BPR loss:", round(t11_diff, 3), round(t11_loss, 3))
t11_g = 1 / (1 + np.exp(t11_diff))                               # -> 0.731
print("gradient weight sigmoid(-diff):", round(float(t11_g), 3))
t11_lr = 0.5
t11_delta_center = t11_lr * t11_g * (t11_pos - t11_neg)           # -> [0.366, -0.731]
t11_delta_pos = t11_lr * t11_g * t11_center                      # -> [0.366, 0.366]
t11_delta_neg = -t11_lr * t11_g * t11_center                     # -> [-0.366, -0.366]
print("delta center:", np.round(t11_delta_center, 3).tolist())
print("delta positive:", np.round(t11_delta_pos, 3).tolist())
print("delta negative:", np.round(t11_delta_neg, 3).tolist())
t11_center_new = t11_center + t11_delta_center                   # -> [1.366, 0.269]
t11_pos_new = t11_pos + t11_delta_pos                            # -> [1.366, 0.366]
t11_neg_new = t11_neg + t11_delta_neg                            # -> [-0.366, 1.634]
print("new vectors:", np.round(t11_center_new, 3).tolist(), np.round(t11_pos_new, 3).tolist(), np.round(t11_neg_new, 3).tolist())
t11_new_pos_score = float(t11_center_new @ t11_pos_new)          # -> 1.963
t11_new_neg_score = float(t11_center_new @ t11_neg_new)          # -> -0.060
t11_new_diff = t11_new_pos_score - t11_new_neg_score             # -> 2.023
print("new pos score, new neg score, new diff:", round(t11_new_pos_score, 3), round(t11_new_neg_score, 3), round(t11_new_diff, 3))
assert t11_new_diff > t11_diff and t11_loss > np.log1p(np.exp(-t11_new_diff))

plt.figure(figsize=(4.8, 4.2))
plt.axhline(0, color=GRAY, lw=.7); plt.axvline(0, color=GRAY, lw=.7)
plt.scatter(t11_vectors[:,0], t11_vectors[:,1], s=90, color=GRAY, label="other vectors")
plt.arrow(0, 0, t11_center[0], t11_center[1], color=BLUE, width=.015, length_includes_head=True, label="center before")
plt.arrow(0, 0, t11_center_new[0], t11_center_new[1], color=GREEN, width=.015, length_includes_head=True, label="center after")
plt.scatter(*t11_pos, s=160, color=GREEN, edgecolor="k", label="positive")
plt.scatter(*t11_neg, s=160, color=RED, edgecolor="k", label="negative")
plt.xlim(-1.2, 2.4); plt.ylim(-1.2, 2.4); plt.title("negative sampling nudges center toward positive, away from negative"); plt.legend(); plt.show()
""")
md("▶ What you'll see: the positive starts below the negative (`diff=-1.0`), then one update makes "
   "the positive score higher (`diff≈2.02`). Step 7 repeats this update many times.")

md(r"""
## ✍️ Toy 12 · alignment metric by hand

Alignment checks whether known positive pairs land close together. Compute squared distance for each
positive pair, then average those distances; lower means positives are tighter.
""")
code(r"""
t12_left = np.array([[0,0], [1,0], [0,1], [3,3], [4,3], [3,4]], float)
t12_right = np.array([[.1,0], [1.1,0], [0,1.2], [3.1,3], [4,3.2], [2.9,4]], float)
t12_diffs = t12_right - t12_left                                 # -> [[.1,0],[.1,0],[0,.2],[.1,0],[0,.2],[-.1,0]]
print("pair differences:", np.round(t12_diffs, 2).tolist())
t12_pair_d2 = (t12_diffs**2).sum(axis=1)                         # -> [0.01, 0.01, 0.04, 0.01, 0.04, 0.01]
print("squared distance per positive pair:", np.round(t12_pair_d2, 3).tolist())
t12_alignment = float(t12_pair_d2.mean())                        # -> 0.02
print("alignment = mean squared distance:", round(t12_alignment, 3))
assert np.isclose(t12_alignment, 0.02)

plt.figure(figsize=(5, 4))
plt.scatter(t12_left[:,0], t12_left[:,1], color=BLUE, s=90, label="brief")
plt.scatter(t12_right[:,0], t12_right[:,1], color=GREEN, s=90, label="matched creator")
for t12_i in range(len(t12_left)):
    plt.plot([t12_left[t12_i,0], t12_right[t12_i,0]], [t12_left[t12_i,1], t12_right[t12_i,1]], color=GRAY)
plt.title("alignment averages positive-pair distances"); plt.legend(); plt.show()
""")
md("▶ What you'll see: every positive pair is close, with mean squared distance 0.02. Step 8 computes "
   "this over held-out brief↔creator positives.")

md(r"""
## ✍️ Toy 13 · uniformity metric catches collapse

Uniformity checks whether vectors spread out instead of collapsing into one blob. The formula averages
`exp(-2 distance²)` over pairs and takes a log; lower is more spread out.
""")
code(r"""
t13_spread = np.array([[1,0], [-1,0], [0,1], [0,-1], [.7,.7], [-.7,-.7]], float)
t13_collapsed = np.array([[0,0], [.1,0], [-.1,0], [0,.1], [0,-.1], [.1,.1]], float)
t13_pair_i, t13_pair_j = np.triu_indices(6, k=1)                 # -> 15 unique pairs
t13_spread_d2 = ((t13_spread[t13_pair_i] - t13_spread[t13_pair_j])**2).sum(axis=1)  # -> spread pair distances
t13_collapsed_d2 = ((t13_collapsed[t13_pair_i] - t13_collapsed[t13_pair_j])**2).sum(axis=1)  # -> tiny collapsed distances
print("spread pair d^2:", np.round(t13_spread_d2, 2).tolist())
print("collapsed pair d^2:", np.round(t13_collapsed_d2, 3).tolist())
t13_spread_uniformity = float(np.log(np.mean(np.exp(-2 * t13_spread_d2))))          # -> -2.421
t13_collapsed_uniformity = float(np.log(np.mean(np.exp(-2 * t13_collapsed_d2))))    # -> -0.045
print("uniformity(spread):", round(t13_spread_uniformity, 3))
print("uniformity(collapsed):", round(t13_collapsed_uniformity, 3))
assert t13_spread_uniformity < t13_collapsed_uniformity

plt.figure(figsize=(5.4, 4))
plt.scatter(t13_spread[:,0], t13_spread[:,1], s=110, color=GREEN, label="spread")
plt.scatter(t13_collapsed[:,0], t13_collapsed[:,1], s=110, color=RED, label="collapsed")
plt.title("uniformity is lower when points spread out"); plt.legend(); plt.show()
""")
md("▶ What you'll see: the collapsed cloud has uniformity near 0, while the spread cloud is much lower "
   "(`-2.42`). Step 8 reads alignment and uniformity together to catch collapse.")

md(r"""
## ✍️ Toy 14 · retrieval recall@k by hand

Recall@k asks whether each held-out true item appears in the top-k retrieved candidates. Average the
hits across queries; always name the candidate universe you ranked against.
""")
code(r"""
t14_items = np.array([[1,0], [0,1], [-1,0], [0,-1], [1,1], [-1,1]], float)
t14_queries = np.array([[1,0], [0,1], [-1,0], [0,-1], [.6,.6], [.6,-.6]], float)
t14_true = np.array([0, 1, 2, 3, 4, 5])
t14_scores = t14_queries @ t14_items.T                           # -> 6 queries x 6 candidate dot scores
print("score table:\n", np.round(t14_scores, 2))
t14_top2 = np.argsort(-t14_scores, axis=1)[:, :2]                # -> [[0,4],[1,4],[2,5],[3,0],[4,0],[0,3]]
print("top-2 candidates per query:", t14_top2.tolist())
t14_hits = np.array([t14_true[t14_i] in t14_top2[t14_i] for t14_i in range(6)])  # -> [1, 1, 1, 1, 1, 0]
print("hit per query:", t14_hits.astype(int).tolist())
t14_recall2 = float(t14_hits.mean())                             # -> 0.8333333333333334
print("recall@2 over 6 candidates:", round(t14_recall2, 3))
assert np.isclose(t14_recall2, 5/6)

plt.figure(figsize=(5, 3.4))
plt.bar(range(6), t14_hits.astype(int), color=[GREEN if t14_h else RED for t14_h in t14_hits])
plt.ylim(0, 1.2); plt.xlabel("query id"); plt.ylabel("true item in top-2?"); plt.title("recall@2 = 5 hits / 6 queries"); plt.show()
""")
md("▶ What you'll see: five of six held-out positives appear in the top-2, so recall@2 is `5/6 = "
   "0.833`. Step 9 computes recall@20 against all creators.")

md(r"""
## ✍️ Toy 15 · slice checks expose a hidden gap

An overall average can hide failures. Put each example into slices, compute the same metric inside
each slice, and compare established vs new or rare groups.
""")
code(r"""
t15_rows = np.array([
    [1, 1, 0], [1, 1, 0], [1, 1, 1], [1, 1, 1],
    [0, 0, 0], [0, 0, 1], [1, 0, 2], [0, 0, 2],
], int)  # columns: hit, established, vertical_id
t15_hits = t15_rows[:, 0].astype(bool)                           # -> [1,1,1,1,0,0,1,0]
t15_established = t15_rows[:, 1].astype(bool)                    # -> [1,1,1,1,0,0,0,0]
t15_rare = t15_rows[:, 2] == 2                                   # -> [0,0,0,0,0,0,1,1]
print("hits:", t15_hits.astype(int).tolist())
print("established mask:", t15_established.astype(int).tolist())
print("rare-vertical mask:", t15_rare.astype(int).tolist())
t15_overall = float(t15_hits.mean())                             # -> 0.625
t15_est = float(t15_hits[t15_established].mean())                # -> 1.0
t15_new = float(t15_hits[~t15_established].mean())               # -> 0.25
t15_rare_recall = float(t15_hits[t15_rare].mean())               # -> 0.5
print("overall, established, new, rare:", [round(t15_v, 3) for t15_v in [t15_overall, t15_est, t15_new, t15_rare_recall]])
assert t15_overall == 0.625 and t15_est == 1.0 and t15_new == 0.25 and t15_rare_recall == 0.5

plt.figure(figsize=(5.6, 3.5))
t15_names = ["overall", "established", "new", "rare"]
t15_vals = [t15_overall, t15_est, t15_new, t15_rare_recall]
plt.bar(t15_names, t15_vals, color=[GRAY, GREEN, RED, GOLD]); plt.ylim(0, 1.05)
plt.ylabel("recall"); plt.title("slice checks reveal the cold-start gap"); plt.show()
""")
md("▶ What you'll see: overall recall is 0.625, but established is 1.0 and new is 0.25. Step 10 uses "
   "this exact discipline to reveal cold-start weakness.")

md(r"""
## ✍️ Toy 16 · probing with a tiny frozen-vector classifier

A probe freezes embeddings and trains a small classifier to see what information is recoverable. Here
a two-class linear probe is just the difference between class means.
""")
code(r"""
t16_X = np.array([[-2,0], [-1,1], [-1,-1], [-2,1], [1,0], [2,1], [1,-1], [2,0]], float)
t16_y = np.array([0, 0, 0, 0, 1, 1, 1, 1])
t16_mean0 = t16_X[t16_y == 0].mean(axis=0)                       # -> [-1.5, 0.25]
t16_mean1 = t16_X[t16_y == 1].mean(axis=0)                       # -> [1.5, 0.0]
print("class 0 mean:", t16_mean0.tolist(), " class 1 mean:", t16_mean1.tolist())
t16_w = t16_mean1 - t16_mean0                                    # -> [3.0, -0.25]
t16_mid = (t16_mean0 + t16_mean1) / 2                            # -> [0.0, 0.125]
print("probe weight:", t16_w.tolist(), " midpoint:", t16_mid.tolist())
t16_scores = (t16_X - t16_mid) @ t16_w                           # -> negative for class 0, positive for class 1
print("probe scores:", np.round(t16_scores, 3).tolist())
t16_pred = (t16_scores > 0).astype(int)                          # -> [0,0,0,0,1,1,1,1]
print("predicted labels:", t16_pred.tolist())
t16_acc = float((t16_pred == t16_y).mean())                      # -> 1.0
print("probe accuracy:", t16_acc)
assert t16_acc == 1.0

plt.figure(figsize=(5, 4))
plt.scatter(t16_X[:,0], t16_X[:,1], c=t16_y, cmap="coolwarm", s=120, edgecolor="k")
t16_line_y = np.linspace(-1.5, 1.5, 20)
t16_line_x = t16_mid[0] - (t16_w[1] / t16_w[0]) * (t16_line_y - t16_mid[1])  # -> decision boundary scores equal 0
plt.plot(t16_line_x, t16_line_y, color="black", label="probe boundary")
plt.title("probe recovers the encoded class label"); plt.legend(); plt.show()
""")
md("▶ What you'll see: a frozen-vector linear probe separates the two classes with 100% accuracy. "
   "Step 11 uses logistic regression to ask what vertical information the learned space encodes.")

md(r"""
## ✍️ Toy 17 · 2D projection for inspecting clusters

After probing, the notebook projects vectors to 2D for a sanity picture. A PCA/SVD projection centers
the data, finds the strongest directions, and plots coordinates on the first two components.
""")
code(r"""
t17_X = np.array([[1,1,0], [2,1,0], [1,2,0], [-1,-1,0], [-2,-1,0], [-1,-2,0]], float)
t17_labels = np.array([1, 1, 1, 0, 0, 0])
t17_mean = t17_X.mean(axis=0)                                    # -> [0.0, 0.0, 0.0]
print("mean vector:", t17_mean.tolist())
t17_centered = t17_X - t17_mean                                  # -> same numbers here, centered at 0
print("centered rows:", t17_centered.astype(int).tolist())
t17_U, t17_S, t17_Vt = np.linalg.svd(t17_centered, full_matrices=False)  # -> singular values [4.69, 1.41, 0.0]
print("singular values:", np.round(t17_S, 3).tolist())
t17_components = t17_Vt[:2]                                      # -> first two principal directions
print("first two components:", np.round(t17_components, 3).tolist())
t17_proj = t17_centered @ t17_components.T                       # -> 6 rows x 2 projected coordinates
print("2D projected coordinates:", np.round(t17_proj, 3).tolist())
assert t17_proj.shape == (6, 2) and np.isclose(t17_S[2], 0.0)

plt.figure(figsize=(5, 4))
plt.scatter(t17_proj[:,0], t17_proj[:,1], c=t17_labels, cmap="coolwarm", s=130, edgecolor="k")
for t17_i, (t17_x, t17_y) in enumerate(t17_proj):
    plt.text(t17_x + .05, t17_y + .05, str(t17_i))
plt.xlabel("component 1"); plt.ylabel("component 2"); plt.title("SVD projection makes clusters visible"); plt.show()
""")
md("▶ What you'll see: centering plus SVD turns six 3D vectors into six 2D coordinates whose two "
   "classes separate visually. Step 11 uses the same projection for inspection after probing.")

# =================================================================== PART A
md("---\n# Part A · What embeddings encode & similarity")

md(r"""
## Step 2 · An embedding is just a point in space

Give each creator a short vector. Here we use **2 numbers** each so we can *draw* them. Nearby
points = "the training signal saw these as similar." Notice the fitness creators cluster
together and the finance ones cluster elsewhere — **that clustering is the whole value.**
""")
code(r"""
creators = {
    "Fit-Anna":   [0.9, 0.2], "Fit-Ben":  [0.8, 0.35], "Fit-Cy": [0.95, 0.1],
    "Fin-Dana":   [0.2, 0.9], "Fin-Eli":  [0.1, 0.85], "Fin-Fay": [0.25, 0.95],
}
plt.figure(figsize=(5,5))
for name,(x,y) in creators.items():
    c = GREEN if name.startswith("Fit") else BLUE
    plt.scatter(x,y,s=120,color=c); plt.annotate(name,(x,y),textcoords="offset points",xytext=(6,4))
plt.xlabel("dim 1"); plt.ylabel("dim 2"); plt.title("creators as points — similar ones cluster")
plt.xlim(0,1.1); plt.ylim(0,1.1); plt.show()
print("dims usually aren't individually meaningful — read NEIGHBORHOODS, not single axes.")
""")

md(r"""
## Step 3 · The two ways to score similarity — dot product vs cosine

To rank items for a query you need a **similarity score**. The two you must know:
$$\text{dot}(q,x)=q^\top x \qquad \cos(q,x)=\frac{q^\top x}{\lVert q\rVert\,\lVert x\rVert}$$
- **Dot product** rewards **direction AND size (norm)**.
- **Cosine** divides out the norms → rewards **direction only** (the angle).

We use the lesson's exact example: query `q=[1,0]` and three items.
""")
code(r"""
q = np.array([1.0, 0.0])
items = {"A (big norm, same dir)": np.array([10.0, 0.0]),
         "B (small norm, near dir)": np.array([0.8, 0.6]),
         "C (orthogonal)": np.array([0.0, 1.0])}
print(f"{'item':>26}{'dot':>8}{'cosine':>9}")
for name, x in items.items():
    dot = q @ x
    cos = dot / (np.linalg.norm(q)*np.linalg.norm(x))
    print(f"{name:>26}{dot:>8.2f}{cos:>9.2f}")
print("\ndot says A is 12.5x stronger than B (its norm is 10).")
print("cosine says A is only 0.2 ahead of B (norm ignored, pure angle).")
""")

md(r"""
## Step 4 · *See* the difference, and why you **normalize**

Plot the query and items as arrows. **Dot** cares how far the arrow reaches along the query;
**cosine** cares only about the angle. The norm often secretly encodes **popularity /
frequency** — so **dot-product retrieval can bury a niche-but-perfectly-aligned item under a
popular one.** **L2-normalizing** (scaling every vector to length 1) removes that, making dot
product *equal* cosine, so pure **direction** wins.
""")
code(r"""
fig, ax = plt.subplots(1, 2, figsize=(10, 4.6))
def arrows(a, title, normalize):
    a.axhline(0,color=GRAY,lw=.6); a.axvline(0,color=GRAY,lw=.6)
    vecs = {"q":(q,"k")} | {n:(x,c) for (n,x),c in zip(items.items(),[RED,GREEN,BLUE])}
    for name,(v,c) in vecs.items():
        vv = v/np.linalg.norm(v) if normalize else v
        a.annotate("",xy=vv,xytext=(0,0),arrowprops=dict(arrowstyle="->",color=c,lw=2))
        a.annotate(name.split()[0],vv,color=c)
    lim = 1.3 if normalize else 10.5
    a.set_xlim(-0.2,lim); a.set_ylim(-0.2,lim); a.set_title(title)
arrows(ax[0],"raw vectors (A shoots far → dot loves it)",False)
arrows(ax[1],"L2-normalized (all length 1 → angle only)",True)
plt.show()
print("after normalizing, A and q point the same way (cosine 1.0), B is a 37-degree angle (0.8).")
print("normalize when you DON'T want norm to act like a popularity prior.")
""")

md(r"""
## Step 4b · Practical test — *should* you normalize? (a decision you can measure)

"Normalize when norm shouldn't drive ranking" is the rule — but **how do you check?** The key
fact: a vector's **length (norm) is usually an accidental byproduct** — of **popularity,
frequency, or text length** — *not* of meaning. Frequent words and popular items pick up
**bigger norms** just from being seen more. So two concrete tests:

1. **Norm-vs-nuisance correlation.** Correlate each vector's **norm** with a quantity you
   *don't* want steering results (popularity / word frequency / document length). **High |r| →
   the norm is a popularity prior → normalize.**
2. **Ranking-flip test.** Compare **top-k by dot** vs **top-k by cosine**. If the lists **change
   a lot**, the norm is driving retrieval — normalize unless you *deliberately* want popularity
   in the score.

Below we build items whose norm leaked popularity, then run **both** tests.
""")
code(r"""
rng = np.random.default_rng(3)
d, n = 16, 300
pop  = rng.integers(1, 500, n)                                   # popularity/frequency: a NUISANCE
dirs = rng.normal(0, 1, (n, d)); dirs /= np.linalg.norm(dirs, axis=1, keepdims=True)  # pure MEANING (unit)
norms = 1.0 + pop/50.0 + rng.normal(0, 0.4, n)                  # popular -> longer vectors (real effect)
E = dirs * norms[:, None]                                        # embeddings whose LENGTH encodes popularity

# ---- TEST 1: does norm correlate with the nuisance (popularity)? ----
r = np.corrcoef(pop, norms)[0, 1]
print(f"TEST 1  corr(norm, popularity) = {r:+.2f}")
print("  |r| is large -> norm is basically a popularity meter -> NORMALIZE.\n")

# ---- TEST 2: do dot and cosine retrieve different items? ----
Q = rng.normal(0, 1, (200, d)); Q /= np.linalg.norm(Q, axis=1, keepdims=True)
dot_top = np.argsort(-(Q @ E.T),    axis=1)[:, :10]             # dot ranking (norm counts)
cos_top = np.argsort(-(Q @ dirs.T), axis=1)[:, :10]            # cosine ranking (angle only)
overlap = [len(set(a) & set(b)) / 10 for a, b in zip(dot_top, cos_top)]
print(f"TEST 2  avg top-10 overlap(dot, cosine) = {np.mean(overlap):.2f}")
print("  far below 1.0 -> normalizing changes WHO you retrieve -> the norm is steering results.")
""")
code(r"""
fig, ax = plt.subplots(1, 2, figsize=(11, 4.3))

# left: WHY normalize -- norm rises with popularity
ax[0].scatter(pop, norms, s=14, alpha=.5, color=BLUE)
ax[0].set_xlabel("item popularity (a nuisance)"); ax[0].set_ylabel("embedding norm  ||v||")
ax[0].set_title(f"TEST 1 -- norm leaks popularity  (r = {r:+.2f})")

# right: CONSEQUENCE -- how much retrieval changes when you normalize
ax[1].hist(overlap, bins=np.linspace(0, 1, 11), color=PURPLE, edgecolor="white")
ax[1].axvline(np.mean(overlap), color=RED, lw=2, ls="--", label=f"mean = {np.mean(overlap):.2f}")
ax[1].set_xlabel("per-query top-10 overlap (dot vs cosine)"); ax[1].set_ylabel("# queries")
ax[1].set_title("TEST 2 -- low overlap => norm steers retrieval"); ax[1].legend()
plt.show()
print("RULE OF THUMB: high corr(norm, nuisance) OR low dot-vs-cosine overlap  ->  L2-normalize.")
print("KEEP raw norms only when magnitude is MEANINGFUL (trained confidence/calibration you want).")
""")

md(r"""
## Step 5 · ID embeddings vs text embeddings

Two ways to get an entity's vector:
- **ID embedding** — a **learned lookup** vector per entity. Great for entities with **lots of
  history** (their vector memorizes real behavior). **Fails for new entities** — a fresh ID
  has no history, so its vector is random.
- **Text embedding** — an **encoder** reads the entity's text (bio, title) → a vector. It
  **generalizes to unseen entities** (cold-start), but may **miss platform behavior** (who
  actually converts).

Below: a brand-new creator's **ID** vector is random noise, but its **text** vector still
lands near the right topic.
""")
code(r"""
rng = np.random.default_rng(0)
d = 12
topic = rng.normal(0, 1, d); topic /= np.linalg.norm(topic)    # the 'cybersecurity' direction

established_id = topic + rng.normal(0, 0.05, d)   # learned ID vector: near the topic (rich history)
new_id        = rng.normal(0, 1, d)               # NEW creator's ID vector: random (no history!)
new_text      = topic + rng.normal(0, 0.15, d)    # text encoder: still near the topic from the bio

def cos(a, b): return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))
print("cosine similarity to the 'cybersecurity' topic direction:")
print(f"  established creator, ID vector : {cos(established_id, topic):+.2f}  (history -> aligned)")
print(f"  NEW creator, ID vector         : {cos(new_id,  topic):+.2f}  (no history -> ~0, random!)")
print(f"  NEW creator, TEXT vector       : {cos(new_text, topic):+.2f}  (bio -> still aligned)")
print("\n-> production often BLENDS: text for cold-start, ID where history is rich.")
""")

md(r"""
## Step 6 · CHECK #1 — before you trust the neighbors

Never trust an embedding's neighbor list blindly. Three quick diagnostics from the lesson:
1. **Norms** — are a few high-norm vectors dominating?
2. **dot vs cosine neighbors** — do the top results *change* when you normalize? (if yes, norm
   is driving retrieval)
3. **Hubness** — is one vector the nearest neighbor of *many* unrelated queries?
""")
code(r"""
rng = np.random.default_rng(1)
E = rng.normal(0, 1, (400, 16))
E[0] *= 8   # plant one artificially popular "hub" with a huge norm

norms = np.linalg.norm(E, axis=1)
print("CHECK norms:  min %.2f  median %.2f  max %.2f" % (norms.min(), np.median(norms), norms.max()))
print("  -> item 0 norm = %.1f is a big outlier (a popularity hub?)\n" % norms[0])

q = rng.normal(0, 1, 16)
dot_top = np.argsort(-(E @ q))[:5]
En = E / norms[:, None]
cos_top = np.argsort(-(En @ (q/np.linalg.norm(q))))[:5]
print("CHECK dot vs cosine neighbors for one query:")
print("  top-5 by DOT   :", dot_top.tolist(), "(item 0 sneaks in via norm)" if 0 in dot_top else "")
print("  top-5 by COSINE:", cos_top.tolist(), "(norm removed -> different list)")

# hubness: how often is each item SOMEONE's nearest neighbor
S = En @ En.T; np.fill_diagonal(S, -1e9)
nn = np.argmax(S, axis=1); counts = np.bincount(nn, minlength=len(E))
plt.figure(figsize=(5.5,3)); plt.hist(counts, bins=30, color=PURPLE)
plt.xlabel("# times an item is someone's nearest neighbor"); plt.ylabel("count")
plt.title("hubness check (a long right tail = hubs)"); plt.show()
print("CHECK hubness: biggest hub is the NN of", counts.max(), "others (watch for these).")
""")

# =================================================================== PART B
md("---\n# Part B · Learning & evaluating embeddings")

md(r"""
## Step 7 · Word2vec / skip-gram — learn an embedding with negative sampling

Now we *train* vectors instead of hand-placing them. Setup: **advertiser briefs** and
**creators**, each in a **vertical** (topic), and creators have a **tenure** (established vs
new). Positives = brief↔creator pairs that "matched" (established creators get more matches —
richer history). We learn brief and creator vectors so a **positive scores higher than a
random negative** (BPR / matrix factorization — the same negative-sampling idea as M10).

> **This is exactly the word2vec / skip-gram engine.** Word2vec skip-gram learns *word*
> vectors by taking a word + a **nearby** word as a **positive** pair and a few **random**
> words as **negatives**, then nudging vectors so positives outscore negatives. Swap
> "word ↔ nearby word" for "brief ↔ matched creator" and it's the **same objective** — only
> the source of the positive pairs changes. So the loop below *is* skip-gram-style training,
> applied to briefs/creators instead of text.
""")
code(r"""
rng = np.random.default_rng(0)
dim, V = 16, 6
n_brief, n_creator = 1000, 1400

centers = rng.normal(0, 1, (V, dim))                 # a center per vertical (so topics cluster)
brief_v   = rng.integers(0, V, n_brief)
creator_v = rng.integers(0, V, n_creator)
Bf = centers[brief_v]   + rng.normal(0, 0.6, (n_brief, dim))     # TRUE latent taste (hidden)
Cf = centers[creator_v] + rng.normal(0, 0.6, (n_creator, dim))
established = rng.random(n_creator) < 0.7             # 70% established, 30% new
aff = Bf @ Cf.T

# build positive (brief, creator) pairs; established & common verticals get more interactions
train, test = {}, {}
for b in range(n_brief):
    w = np.exp(aff[b] - aff[b].max())
    w *= np.where(established, 4.0, 1.0)              # established -> more matches (rich history)
    w *= np.where(creator_v == 5, 0.25, 1.0)         # vertical 5 is RARE (few interactions)
    w /= w.sum()
    cs = list(rng.choice(n_creator, rng.integers(3, 8), replace=False, p=w))
    if len(cs) >= 2: test[b] = cs[-1]; train[b] = cs[:-1]   # hold out 1 positive per brief
    else: train[b] = cs
train_pairs = [(b, c) for b, cs in train.items() for c in cs]
print(f"{n_brief} briefs, {n_creator} creators, {len(train_pairs)} training positives")

# train with BPR: push positive above a random negative
Be = rng.normal(0, .1, (n_brief, dim)); Ce = rng.normal(0, .1, (n_creator, dim))
lr, reg = 0.1, 1e-5; losses = []
for epoch in range(40):
    rng.shuffle(train_pairs); tot = 0.0
    for b, c in train_pairs:
        neg = rng.integers(0, n_creator)
        diff = Be[b] @ Ce[c] - Be[b] @ Ce[neg]
        g = 1/(1 + np.exp(diff))                     # gradient weight = sigmoid(-diff)
        Be[b]  += lr * (g*(Ce[c]-Ce[neg]) - reg*Be[b])
        Ce[c]  += lr * (g*Be[b] - reg*Ce[c])
        Ce[neg]+= lr * (-g*Be[b] - reg*Ce[neg])
        tot += -np.log(1/(1+np.exp(-diff)))
    losses.append(tot/len(train_pairs))
    if epoch % 8 == 0: print(f"  epoch {epoch:>2}: avg BPR loss {losses[-1]:.4f}")
plt.figure(figsize=(5.5,3)); plt.plot(losses, color=BLUE)
plt.xlabel("epoch"); plt.ylabel("BPR loss"); plt.title("embedding training loss"); plt.show()
""")

md(r"""
## Step 8 · CHECK #2 — alignment & uniformity

A good space needs **two** things:
- **Alignment** — positive pairs are **close**: `E‖f(x)−f(y)‖²` (lower = better).
- **Uniformity** — vectors **spread out**, not collapsed into one blob:
  `log E e^{−2‖x−y‖²}` (lower = more spread).

The trap: a **collapsed** space (everything ≈ the same point) has *great* alignment but
*terrible* uniformity — every neighbor list is the same, so retrieval can't discriminate. We
compare our trained space to a deliberately collapsed one.
""")
code(r"""
def unit(X): return X / np.linalg.norm(X, axis=1, keepdims=True)   # these metrics live on the unit sphere
def alignment(x, y): return float(np.mean(np.sum((x - y)**2, axis=1)))
def uniformity(X, m=3000):
    i = rng.integers(0, len(X), m); j = rng.integers(0, len(X), m)
    return float(np.log(np.mean(np.exp(-2*np.sum((X[i]-X[j])**2, axis=1)))))

Bn, Cn = unit(Be), unit(Ce)                          # L2-normalize the learned vectors
bs = np.array(list(test.keys())); cs = np.array([test[b] for b in bs])
Xpos, Ypos = Bn[bs], Cn[cs]                          # held-out positive pairs (brief vs matched creator)

# a COLLAPSED space: every creator points in almost the SAME direction
v = rng.normal(0, 1, dim)
collapsed = unit(np.tile(v, (n_creator, 1)) + rng.normal(0, 0.05, (n_creator, dim)))
Xc = collapsed[cs]; Yc = unit(collapsed[cs] + rng.normal(0, 0.05, (len(cs), dim)))

print(f"{'space':>12}{'alignment':>12}{'uniformity':>12}")
print(f"{'trained':>12}{alignment(Xpos,Ypos):>12.3f}{uniformity(Cn):>12.2f}")
print(f"{'collapsed':>12}{alignment(Xc,Yc):>12.4f}{uniformity(collapsed):>12.2f}")
print("\ncollapsed has TINY alignment (looks great!) but uniformity ~0 (all jammed) -> useless.")
print("trained keeps positives close AND spreads everything else -> retrieval can discriminate.")
""")

md(r"""
## Step 9 · CHECK #3 — retrieval recall@k (the first real metric)

The closest-to-production check: for each held-out positive, rank **all** creators by
similarity and ask **"is the true match in the top k?"** Averaged over briefs, that's
**recall@k**. Compare to a random baseline.
""")
code(r"""
def recall_at_k(mask=None, k=20):
    hits = tot = 0
    for b, ti in test.items():
        if mask is not None and not mask(ti): continue
        s = Be[b] @ Ce.T
        for c in train[b]: s[c] = -1e9               # exclude training positives
        if ti in np.argpartition(-s, k)[:k]: hits += 1
        tot += 1
    return hits / max(tot, 1), tot

overall, n = recall_at_k()
print(f"recall@20 overall: {overall:.2f}  (over {n} briefs)")
print(f"random baseline  : {20/n_creator:.3f}   -> the model is far above random")
""")

md(r"""
## Step 10 · CHECK #4 — SLICE checks (where cold-start hides)

**One overall number lies.** Break recall down by slice. Watch the **cold-start gap**:
established creators (rich history) retrieve well; **new** creators (little history) retrieve
poorly; a **rare vertical** is also weak. This is the single most important embedding check —
the fix isn't "bigger vectors," it's better text features / a cold-start blend / hard
negatives for rare verticals.
""")
code(r"""
overall, _  = recall_at_k()
est, _      = recall_at_k(mask=lambda c: established[c])
new, _      = recall_at_k(mask=lambda c: not established[c])
rare, _     = recall_at_k(mask=lambda c: creator_v[c] == 5)
rows = [("overall", overall), ("established", est), ("new (cold-start)", new), ("rare vertical", rare)]
for name, r in rows: print(f"  recall@20  {name:>18}: {r:.2f}")

plt.figure(figsize=(6,3.3))
names = [r[0] for r in rows]; vals = [r[1] for r in rows]
plt.bar(names, vals, color=[GRAY, GREEN, RED, GOLD]); plt.ylabel("recall@20")
plt.title("slice checks expose the cold-start gap"); plt.xticks(rotation=15); plt.show()
print("established >> new: the ID embedding memorized history the new creators don't have yet.")
""")

md(r"""
## Step 11 · CHECK #5 — probing (does the space encode what we think?)

Freeze the learned vectors and train a **tiny classifier** to predict a known label (here the
**vertical**) from them. High accuracy = the space really encodes topic structure. (Also a
bias audit: if a probe recovers a *protected* attribute you didn't intend, that's a red flag.)
""")
code(r"""
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
acc = cross_val_score(LogisticRegression(max_iter=1000), Ce, creator_v, cv=3).mean()
print(f"probe: predict vertical from frozen creator vectors -> {acc:.2f} accuracy")
print(f"random guessing would be 1/{V} = {1/V:.2f}  -> the space clearly encodes vertical")
# visualize: project to 2D and color by vertical
from numpy.linalg import svd
U, S, Vt = svd(Ce - Ce.mean(0), full_matrices=False)
proj = (Ce - Ce.mean(0)) @ Vt[:2].T
plt.figure(figsize=(5.2,5))
plt.scatter(proj[:,0], proj[:,1], c=creator_v, cmap="tab10", s=8, alpha=.6)
plt.xlabel("component 1"); plt.ylabel("component 2")
plt.title("creators colored by vertical (clusters = learned structure)"); plt.show()
""")

# ------------------------------------------------------------------- eval toolkit
md(r"""
---
## Step 12 · The evaluation toolkit — every method, **sorted by importance**

You ran the checks above. Here's each one ranked by **how much it should weigh in deciding
whether the space is good and safe to ship** (most → least). Read each as: *why it ranks here →
what it is → what it's good for → the trap → where it fits → rule of thumb.* Note the deliberate
inversion at the end: importance runs top-down, but the **order you run them** runs bottom-up
(cheap gates first, the expensive verdict last).

### 1. Downstream lift — *the verdict*
- **Why #1:** the only method that proves the embedding is *useful*, not just *neat*. Everything
  else is a proxy for this.
- **What it is:** feed the embedding into the **real product model** (the ranker) and measure
  whether the **business metric** moves — CTR, conversion, invite-acceptance (e.g. 6.0% → 6.6%).
- **Good for:** the **ground truth of value** — a space can ace recall@k and still not help the
  ranker (which may already have that signal elsewhere).
- **The trap:** **slow, expensive, confounded** — needs an online A/B test, time for significance,
  and everything else moves at once, so attribution is hard.
- **Where it fits:** the **ship/no-ship decision**; every rung below exists because this is too
  costly to run every iteration.
- **Rule of thumb:** offline metrics let you *iterate fast*; downstream lift lets you *decide to ship*.

### 2. Slice checks — *the most important discipline*
- **Why #2:** the average always lies, and the failures that hurt real users hide inside slices.
- **What it is:** break every metric down by **subgroup** — new vs established, rare verticals,
  languages, small advertisers, policy-sensitive categories.
- **Good for:** exposing what a single average **buries** — "recall@20 = 0.80" can hide a
  **cold-start catastrophe** (notebook: established **0.53** vs new **0.23**).
- **The trap:** you must **pre-define the slices that matter**, or you'll miss the one that breaks;
  and the *fix* is domain-specific ("bigger vectors" rarely helps — better features / cold-start
  blend / hard negatives for the weak slice do).
- **Where it fits:** a **discipline applied on top of** recall / downstream / neighbors, not a
  standalone metric.
- **Rule of thumb:** **never ship on the overall number** — assume the average lies until slices prove otherwise.

### 3. Retrieval recall@k — *the workhorse*
- **Why #3:** your daily driver for offline iteration and the best *fast* proxy for downstream value.
- **What it is:** put a query in the space, take its **top-k** neighbors, ask **"is the true match
  in there?"** Average over queries (notebook: recall@20 = **0.50** vs 0.014 random).
- **Good for:** measuring the **actual job you'll serve** — a real, trackable, A/B-able number.
- **The trap:** **meaningless without naming the candidate universe** — a few sampled negatives is
  wildly optimistic vs the full catalog (same model: 0.88 sampled vs 0.52 full); a good *overall*
  number also masks bad slices.
- **Where it fits:** the **first metric you actually optimize** day to day.
- **Rule of thumb:** always report **recall@k + the universe you ranked against**.

### 4. Alignment & uniformity — *the gate*
- **Why #4:** a prerequisite — if the space is collapsed, everything above is meaningless. Catches
  a catastrophic failure for almost no cost.
- **What it is:** two numbers — **alignment** = are positive pairs close? **uniformity** = are
  vectors spread out (not collapsed)?
- **Good for:** catching **collapse** — where everything is near everything, so neighbor lists are
  all the same.
- **The trap:** each alone lies — **great alignment + bad uniformity = a collapsed, useless space**
  (positives close, but so is everything). Read them **together**.
- **Where it fits:** a **pre-flight structural gate**, before you trust any retrieval number; once
  it passes it stops being informative.
- **Rule of thumb:** demand **both** — positives close *and* the rest spread.

### 5. Qualitative neighbors — *the reality check*
- **Why #5:** catches "plausible but wrong" that metrics miss, and generates hypotheses you then verify.
- **What it is:** for real queries, **read the top-k neighbors** — for head, torso, tail, and
  cold-start examples.
- **Good for:** catching failures metrics miss — neighbors *topically* similar but **wrong for the
  product task** (right topic, wrong audience/region).
- **The trap:** **anecdotal and cherry-pickable** — a few good examples prove nothing; look across
  the distribution, not just the ones that look good.
- **Where it fits:** a **reality check** on what the numbers claim, and a source of hypotheses to
  verify quantitatively.
- **Rule of thumb:** if you can't stomach the **top-5 neighbors for a tail query**, the metric is lying.

### 6. Probing — *the diagnostic & bias audit*
- **Why #6 for quality (but #1 for safety):** it measures *presence* of info, not usefulness — yet
  it's a ship-blocker if it recovers protected attributes.
- **What it is:** freeze the vectors, train a **tiny classifier** to predict a known label
  (vertical, language) from them (notebook: **0.49** vs 0.17 random).
- **Good for:** confirming the space captures expected structure, and **auditing bias** — a probe
  recovering a *protected* attribute you never intended is a red flag.
- **The trap:** measures **presence of information, not usefulness** — a probe can ace "predict
  language" while retrieval still fails.
- **Where it fits:** a **diagnostic/audit** alongside (not instead of) recall; for fairness it jumps
  to the top.
- **Rule of thumb:** probe to learn *what's in there* and *what shouldn't be*.

### 7. Norms / dot-vs-cosine / hubness — *the 10-second sanity pass*
- **Why #7:** cheap symptom detectors — they flag problems rather than measure quality.
- **What it is:** three quick diagnostics (Step 6) — histogram **norms**, compare **dot vs cosine**
  neighbors, and count **hubness** (how often each vector is someone's nearest neighbor).
- **Good for:** exposing **norm-driven retrieval** (high-norm hubs = ranking by popularity), whether
  the top-k **changes** when you normalize, and **hubness** (one vector that's everyone's neighbor).
- **The trap:** they tell you *there's a problem*, not *how much it hurts the product*.
- **Where it fits:** a **fast pre-flight** before you spend effort on recall@k.
- **Rule of thumb:** if dot and cosine neighbors disagree, decide *on purpose* whether norm should matter.

### 8. t-SNE / UMAP — *soft intuition only*
- **Why #8:** a picture, not a number — the softest, most misleading rung.
- **What it is:** squashes high-dim vectors down to **2D** so you can *see* whether similar things
  cluster (like the Step 11 scatter).
- **Good for:** building intuition, spotting **gross** failures (e.g. total collapse).
- **The trap:** **lossy and cosmetic** — cluster sizes and distances are artifacts of the
  `perplexity` setting, not reality; not a number you can threshold, track, or slice, and a pretty
  plot can hide terrible cold-start recall.
- **Where it fits:** a **debugging/sanity aid**, never a grade.
- **Rule of thumb:** use it to *look and hypothesize*, then *prove* it with metrics.

**The ranking in one line:** **downstream lift** (the verdict) > **slice checks** (catches what the
average hides) > **recall@k** (the fast workhorse) > **alignment/uniformity** (the collapse gate) >
**qualitative neighbors** (reality check) > **probing** (diagnostic; #1 for bias) >
**norms/dot-vs-cosine/hubness** (sanity) > **t-SNE** (a picture).

**Importance vs sequence:** you *weight* the expensive verdict most (downstream lift, slices) but
*run* the cheap gates first (alignment, norms, t-SNE) — importance is top-down, sequence is bottom-up.
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## Recap — the M11 toolkit + the checklist

**What embeddings encode (Part A).** A vector's **neighborhood** reflects the **training
signal**, not universal truth. Compare vectors with **dot product** (direction *and* norm —
norm often acts like popularity) or **cosine** (direction only, after **L2-normalizing**).
**ID** embeddings memorize history (great for established entities, random for new ones);
**text** embeddings generalize to cold-start but miss platform behavior — so **blend** them.

**Learning & evaluating (Part B).** You learn vectors by pushing **positives above sampled
negatives** (matrix factorization / BPR). A healthy space has **alignment** (positives close)
**and uniformity** (everything spread) — collapse kills retrieval.

**The checks — ranked by importance (weight them top-down, run them bottom-up):**
1. **Downstream lift** — does the embedding actually improve the product model? *(the verdict)*
2. **Slice checks** — new vs established, rare verticals, languages: **this is where cold-start hides.**
3. **recall@k** — of held-out positives, how many land in the top k? *(state the candidate universe)*
4. **Alignment & uniformity** — positives close *without* the space collapsing. *(the gate)*
5. **Qualitative neighbors** — do the top neighbors actually make sense for the *product task*?
6. **Probing** — can a light classifier recover expected labels (and not leak protected ones)?
7. **Norms / dot-vs-cosine / hubness** — is retrieval secretly driven by popularity/norm?
8. **t-SNE / UMAP** — a picture for intuition only, never a grade.

**Where this connects:** M11's vectors and negative sampling build on M10 (implicit labels,
logQ) and feed **M12 two-tower retrieval** — the system that searches these embeddings at
scale. Cold-start (M9) reappears as the ID-embedding weakness the slice checks expose.
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M11 · Embeddings & Representation", "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M11-embeddings-representation.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
