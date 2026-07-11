#!/usr/bin/env python3
"""Generate afp/notebooks/M10-sparse-implicit-labels.ipynb.

A runnable, VERY beginner-friendly Colab notebook for module M10: learning from
sparse & implicit feedback. Part A covers PU learning, negative sampling
(uniform / popularity / hard), the false-negative risk, logQ sampling-bias
correction, and recall@k without true negatives. Part B covers debiasing:
position bias, inverse propensity scoring (IPS), clipping's bias-variance
tradeoff, and delayed feedback.

Granular: small steps, plain-language explanation, print logging, and a
visualization for every idea. Colab-preinstalled libraries only
(numpy / pandas / scikit-learn / matplotlib). No scipy dependency.

Run: python3 tools/gen-m10-notebook.py
"""
import json, os

cells = []
def md(t):   cells.append({"cell_type": "markdown", "metadata": {}, "source": t.strip("\n").splitlines(keepends=True)})
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": s.strip("\n").splitlines(keepends=True)})

# ------------------------------------------------------------------- intro
md(r"""
# M10 · Learning with Sparse & Implicit Labels — Hands-on, Step by Tiny Step

**Companion to lesson M10. Written for someone new to ML.**

Recommenders rarely get clean "like / dislike" labels. They get **implicit feedback**: a
click, a save, a brand contacting a creator. That's positive evidence — but a *missing*
click is **not** proof of dislike. Maybe the item was never shown, or buried at the bottom,
or the feedback just hasn't arrived yet. This notebook shows how to build honest training
data and honest metrics out of such messy signals.

**What you'll do (every step has an explanation, logging, and a picture):**
- **Part A · Implicit feedback & principled negatives:** why "unlabeled ≠ negative" (PU
  learning), how **negative sampling** makes training possible, the **uniform / popularity /
  hard** samplers and the **false-negative** risk, the **logQ** correction, and why
  **recall@k** depends on which candidates you test against.
- **Part B · Debiasing:** how **position bias** fools naive CTR, how **IPS** reweighting
  undoes it, why huge weights need **clipping** (a bias-variance tradeoff), and how
  **delayed feedback** makes fresh data look falsely negative.

We use **scikit-learn** + **matplotlib** (no installs in Colab). Run each cell with
**Shift+Enter**.
""")

# =================================================================== SETUP
md(r"""
## Step 1 · Setup + a small helper

`rank_corr` measures how well two orderings agree (Spearman correlation, computed with plain
numpy). We'll use it to check whether a model's scores rank items in the *true* order.
""")
code(r"""
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"

def rank_corr(a, b):
    ra = np.argsort(np.argsort(a)); rb = np.argsort(np.argsort(b))   # ranks
    return float(np.corrcoef(ra, rb)[0, 1])

print("ready")
""")

md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full notebook, here is **one tiny, hand-traceable toy example for every computing
mechanic** in this lesson: implicit label construction, positive-unlabeled counts, hidden
affinity, exposure-biased observations, holdout splits, negative sampling, pair features,
recall@k, sampler choices, hard negatives, logQ, candidate universes, position bias, IPS,
clipping, and delayed feedback. Each toy uses only a few small numbers, prints every
intermediate value, checks itself with an `assert`, and draws one picture.
""")

md(r"""
## ✍️ Toy 1 · implicit events become a binary label by a rule

Implicit feedback starts as **events**, not clean stars: click, dwell seconds, save, contact.
The first computational step is a **label rule**. Here a creator is positive if dwell is at
least 30 seconds, or if the user saved/contacted them. A click alone is logged, but not strong
enough by this rule.
""")
code(r"""
t01_seed = 0                                                       # -> 0
t01_rng = np.random.default_rng(0)
print("seed:", t01_seed)

t01_events = np.array([
    [0,  4, 0, 0],
    [1,  8, 0, 0],
    [1, 35, 0, 0],
    [0,  0, 1, 0],
    [0, 45, 0, 0],
    [1, 12, 0, 0],
    [0,  0, 0, 1],
    [1, 28, 0, 0],
], int)                                                           # -> 8 rows, columns = click,dwell,save,contact
t01_click = t01_events[:, 0]                                      # -> [0,1,1,0,0,1,0,1]
t01_dwell = t01_events[:, 1]                                      # -> [4,8,35,0,45,12,0,28]
t01_save = t01_events[:, 2]                                       # -> [0,0,0,1,0,0,0,0]
t01_contact = t01_events[:, 3]                                    # -> [0,0,0,0,0,0,1,0]
t01_dwell_positive = t01_dwell >= 30                              # -> [False,False,True,False,True,False,False,False]
t01_strong_event = (t01_save == 1) | (t01_contact == 1)            # -> [False,False,False,True,False,False,True,False]
t01_label = (t01_dwell_positive | t01_strong_event).astype(int)   # -> [0,0,1,1,1,0,1,0]
t01_positive_ids = np.where(t01_label == 1)[0]                    # -> [2,3,4,6]
print("events [click,dwell,save,contact]:", t01_events.tolist())
print("click:", t01_click.tolist())
print("dwell:", t01_dwell.tolist())
print("save:", t01_save.tolist())
print("contact:", t01_contact.tolist())
print("dwell >= 30:", t01_dwell_positive.tolist())
print("save or contact:", t01_strong_event.tolist())
print("binary label:", t01_label.tolist())
print("positive ids:", t01_positive_ids.tolist())
assert t01_positive_ids.tolist() == [2, 3, 4, 6]

plt.figure(figsize=(5.8, 3))
plt.bar(np.arange(8), t01_dwell, color=np.where(t01_label == 1, "seagreen", "lightgray"))
plt.axhline(30, color="black", linestyle="--", label="dwell threshold")
plt.xlabel("creator row")
plt.ylabel("dwell seconds")
plt.title("implicit label rule: threshold or strong event")
plt.legend()
plt.show()
""")
md("▶ What you'll see: rows 2 and 4 pass the dwell threshold, rows 3 and 6 have save/contact, "
   "so the implicit-positive ids are `[2, 3, 4, 6]`.")

md(r"""
## ✍️ Toy 2 · positive-unlabeled means "unknown," not "disliked"

After label construction, **missing** feedback is still not a negative. This toy counts a tiny
catalog: two observed positives and six unlabeled creators. The dangerous mistake is to call
all six unlabeled rows "negative."
""")
code(r"""
t02_seed = 0                                                       # -> 0
t02_rng = np.random.default_rng(0)
print("seed:", t02_seed)

t02_creator_xy = np.array([
    [0, 0],
    [1, 0],
    [2, 1],
    [3, 1],
    [0, 3],
    [1, 3],
    [2, 4],
    [3, 4],
], float)                                                         # -> 8 creators in 2D
t02_observed_positive = np.array([2, 6])                          # -> [2,6]
t02_catalog_count = len(t02_creator_xy)                           # -> 8
t02_positive_count = len(t02_observed_positive)                   # -> 2
t02_unlabeled_count = t02_catalog_count - t02_positive_count      # -> 6
t02_naive_fake_negatives = t02_unlabeled_count                    # -> 6
t02_pu_label = np.full(t02_catalog_count, -1, int)                # -> [-1,-1,-1,-1,-1,-1,-1,-1]
t02_pu_label[t02_observed_positive] = 1                           # -> [-1,-1,1,-1,-1,-1,1,-1]
print("creator coordinates:", t02_creator_xy.tolist())
print("observed positive ids:", t02_observed_positive.tolist())
print("catalog count:", t02_catalog_count)
print("positive count:", t02_positive_count)
print("unlabeled count:", t02_unlabeled_count)
print("naive fake negatives:", t02_naive_fake_negatives)
print("PU labels (+1 positive, -1 unlabeled):", t02_pu_label.tolist())
assert t02_unlabeled_count == 6

plt.figure(figsize=(5, 3.6))
plt.scatter(t02_creator_xy[:, 0], t02_creator_xy[:, 1], c=np.where(t02_pu_label == 1, "seagreen", "gold"), s=90)
for t02_i, t02_xy in enumerate(t02_creator_xy):
    plt.text(t02_xy[0] + 0.05, t02_xy[1] + 0.05, str(t02_i))
plt.title("PU data: positives are known; unlabeled are unknown")
plt.xlabel("feature 1")
plt.ylabel("feature 2")
plt.show()
""")
md("▶ What you'll see: only ids 2 and 6 are green positives; the other six are yellow **unlabeled**, "
   "not proven negatives.")

md(r"""
## ✍️ Toy 3 · hidden affinity is a dot product

The synthetic notebook gives each brand and creator a tiny hidden vector. The **true affinity**
is their dot product. We print the per-dimension products first so you can trace every score.
""")
code(r"""
t03_seed = 0                                                       # -> 0
t03_rng = np.random.default_rng(0)
print("seed:", t03_seed)

t03_brand = np.array([2, 1], float)                               # -> [2,1]
t03_creators = np.array([
    [ 1, 0],
    [ 0, 1],
    [ 1, 1],
    [ 2, 1],
    [ 1, 2],
    [-1, 1],
], float)                                                         # -> 6 creators in 2D
t03_products = t03_creators * t03_brand                           # -> [[2,0],[0,1],[2,1],[4,1],[2,2],[-2,1]]
t03_affinity = t03_products.sum(axis=1)                           # -> [2,1,3,5,4,-1]
t03_order = np.argsort(-t03_affinity)                             # -> [3,4,2,0,1,5]
t03_best = int(t03_order[0])                                      # -> 3
print("brand vector:", t03_brand.tolist())
print("creator vectors:", t03_creators.tolist())
print("per-dim products:", t03_products.tolist())
print("affinity scores:", t03_affinity.tolist())
print("ranked creator ids:", t03_order.tolist())
print("best creator id:", t03_best)
assert t03_best == 3

plt.figure(figsize=(5, 3))
plt.bar(np.arange(6), t03_affinity, color=np.where(np.arange(6) == t03_best, "seagreen", "lightgray"))
plt.xlabel("creator id")
plt.ylabel("dot-product affinity")
plt.title("hidden truth: brand · creator")
plt.show()
""")
md("▶ What you'll see: creator 3 has score `5`, the largest dot product, so it is the hidden "
   "best match for this brand.")

md(r"""
## ✍️ Toy 4 · exposure tilts which positives get observed

Real logs see high-affinity items **through an exposure/popularity filter**. This toy turns
affinity into a softmax weight, multiplies by exposure probability, normalizes, and samples two
observed positives with a fixed seed.
""")
code(r"""
t04_seed = 0                                                       # -> 0
t04_rng = np.random.default_rng(0)
print("seed:", t04_seed)

t04_brand = np.array([2, 1], float)                               # -> [2,1]
t04_creators = np.array([
    [ 1, 0],
    [ 0, 1],
    [ 1, 1],
    [ 2, 1],
    [ 1, 2],
    [-1, 1],
], float)                                                         # -> 6 creators in 2D
t04_affinity = t04_creators @ t04_brand                           # -> [2,1,3,5,4,-1]
t04_popularity = np.array([1, 4, 1, 1, 2, 1], float)              # -> [1,4,1,1,2,1]
t04_affinity_weight = np.exp(t04_affinity - t04_affinity.max())   # -> [0.050,0.018,0.135,1.000,0.368,0.002]
t04_exposure_prob = t04_popularity / t04_popularity.sum()         # -> [0.100,0.400,0.100,0.100,0.200,0.100]
t04_raw_prob = t04_affinity_weight * t04_exposure_prob            # -> [0.005,0.007,0.014,0.100,0.074,0.000]
t04_observed_prob = t04_raw_prob / t04_raw_prob.sum()             # -> [0.025,0.037,0.068,0.501,0.369,0.001]
t04_observed_ids = t04_rng.choice(6, size=2, replace=False, p=t04_observed_prob)  # -> [4,3]
print("affinity:", t04_affinity.tolist())
print("popularity:", t04_popularity.tolist())
print("affinity softmax weights:", np.round(t04_affinity_weight, 3).tolist())
print("exposure probabilities:", np.round(t04_exposure_prob, 3).tolist())
print("raw affinity × exposure:", np.round(t04_raw_prob, 3).tolist())
print("observed-positive probabilities:", np.round(t04_observed_prob, 3).tolist())
print("sampled observed positive ids:", t04_observed_ids.tolist())
assert t04_observed_ids.tolist() == [4, 3]

plt.figure(figsize=(5, 3))
plt.bar(np.arange(6), t04_observed_prob, color="steelblue")
plt.xlabel("creator id")
plt.ylabel("probability observed positive")
plt.title("affinity × exposure -> logged positives")
plt.show()
""")
md("▶ What you'll see: creator 3 has the strongest affinity, creator 4 has high affinity plus "
   "more exposure, and the seeded sample logs `[4, 3]` as positives.")

md(r"""
## ✍️ Toy 5 · leave one positive out for recall testing

The notebook holds out one observed positive per brand. This creates a training set and a tiny
test target for each brand, so later recall@k asks whether the held-out item is retrieved.
""")
code(r"""
t05_seed = 0                                                       # -> 0
t05_rng = np.random.default_rng(0)
print("seed:", t05_seed)

t05_positive_pairs = np.array([
    [0, 3],
    [0, 4],
    [1, 1],
    [1, 2],
    [2, 4],
    [2, 5],
], int)                                                           # -> 6 (brand,creator) positives
t05_pair_order_in_brand = np.array([0, 1, 0, 1, 0, 1], int)       # -> [0,1,0,1,0,1]
t05_is_test = t05_pair_order_in_brand == 1                       # -> [False,True,False,True,False,True]
t05_train_pairs = t05_positive_pairs[~t05_is_test]               # -> [[0,3],[1,1],[2,4]]
t05_test_pairs = t05_positive_pairs[t05_is_test]                 # -> [[0,4],[1,2],[2,5]]
t05_test_brands = t05_test_pairs[:, 0]                           # -> [0,1,2]
t05_test_targets = t05_test_pairs[:, 1]                          # -> [4,2,5]
print("positive pairs:", t05_positive_pairs.tolist())
print("order within each brand:", t05_pair_order_in_brand.tolist())
print("is held out for test:", t05_is_test.tolist())
print("train pairs:", t05_train_pairs.tolist())
print("test pairs:", t05_test_pairs.tolist())
print("test brands:", t05_test_brands.tolist())
print("test creator targets:", t05_test_targets.tolist())
assert t05_test_targets.tolist() == [4, 2, 5]

plt.figure(figsize=(5, 3))
plt.scatter(t05_train_pairs[:, 0], t05_train_pairs[:, 1], s=120, c="seagreen", label="train positive")
plt.scatter(t05_test_pairs[:, 0], t05_test_pairs[:, 1], s=140, c="gold", edgecolor="black", label="held-out target")
plt.xlabel("brand id")
plt.ylabel("creator id")
plt.title("one held-out positive per brand")
plt.legend()
plt.show()
""")
md("▶ What you'll see: each brand keeps one green training positive and one gold held-out "
   "creator target for recall evaluation.")

md(r"""
## ✍️ Toy 6 · negative sampling builds a small training table

Instead of pairing every positive with the whole catalog, sample a few **unlabeled** creators as
temporary negatives. Here two positives become six training rows: each positive plus two
sampled negatives.
""")
code(r"""
t06_seed = 0                                                       # -> 0
t06_rng = np.random.default_rng(0)
print("seed:", t06_seed)

t06_creators = np.arange(6)                                       # -> [0,1,2,3,4,5]
t06_pos_pairs = np.array([[0, 3], [1, 2]], int)                  # -> [[0,3],[1,2]]
t06_brand0_candidates = t06_creators[t06_creators != 3]           # -> [0,1,2,4,5]
t06_brand0_negs = t06_rng.choice(t06_brand0_candidates, size=2, replace=False)  # -> [4,5]
t06_brand1_candidates = t06_creators[t06_creators != 2]           # -> [0,1,3,4,5]
t06_brand1_negs = t06_rng.choice(t06_brand1_candidates, size=2, replace=False)  # -> [5,1]
t06_train_rows = np.array([
    [0, 3, 1],
    [0, 4, 0],
    [0, 5, 0],
    [1, 2, 1],
    [1, 5, 0],
    [1, 1, 0],
], int)                                                           # -> 6 rows [brand,creator,label]
t06_positive_rate = t06_train_rows[:, 2].mean()                  # -> 0.3333333333333333
print("creator ids:", t06_creators.tolist())
print("positive pairs:", t06_pos_pairs.tolist())
print("brand 0 candidate negatives:", t06_brand0_candidates.tolist())
print("brand 0 sampled negatives:", t06_brand0_negs.tolist())
print("brand 1 candidate negatives:", t06_brand1_candidates.tolist())
print("brand 1 sampled negatives:", t06_brand1_negs.tolist())
print("training rows [brand, creator, label]:", t06_train_rows.tolist())
print("positive rate:", round(float(t06_positive_rate), 3))
assert t06_train_rows[:, 2].sum() == 2

plt.figure(figsize=(5, 3))
plt.scatter(t06_train_rows[:, 0], t06_train_rows[:, 1], c=np.where(t06_train_rows[:, 2] == 1, "seagreen", "tomato"), s=120)
plt.xlabel("brand id")
plt.ylabel("creator id")
plt.title("sampled training rows: positives and stand-in negatives")
plt.show()
""")
md("▶ What you'll see: two positive rows and four sampled-negative rows, giving a tiny balanced-enough "
   "training table instead of scanning every creator.")

md(r"""
## ✍️ Toy 7 · pair features let a linear model score brand-creator matches

The notebook trains a linear classifier on the **element-wise product** of brand and creator
vectors. Summing that product is a dot product, so a linear model can learn affinity.
""")
code(r"""
t07_seed = 0                                                       # -> 0
t07_rng = np.random.default_rng(0)
print("seed:", t07_seed)

t07_brand = np.array([2, 1], float)                               # -> [2,1]
t07_creators = np.array([
    [ 1, 0],
    [ 0, 1],
    [ 1, 1],
    [ 2, 1],
    [ 1, 2],
    [-1, 1],
], float)                                                         # -> 6 creators in 2D
t07_pair_features = t07_creators * t07_brand                      # -> [[2,0],[0,1],[2,1],[4,1],[2,2],[-2,1]]
t07_weights = np.array([1, 1], float)                             # -> [1,1]
t07_scores = t07_pair_features @ t07_weights                      # -> [2,1,3,5,4,-1]
t07_probabilities = 1 / (1 + np.exp(-t07_scores))                 # -> [0.881,0.731,0.953,0.993,0.982,0.269]
t07_order = np.argsort(-t07_scores)                               # -> [3,4,2,0,1,5]
print("brand vector:", t07_brand.tolist())
print("creator vectors:", t07_creators.tolist())
print("pair features:", t07_pair_features.tolist())
print("linear weights:", t07_weights.tolist())
print("linear scores:", t07_scores.tolist())
print("sigmoid probabilities:", np.round(t07_probabilities, 3).tolist())
print("ranked creator ids:", t07_order.tolist())
assert int(t07_order[0]) == 3

plt.figure(figsize=(5, 3))
plt.bar(np.arange(6), t07_probabilities, color="mediumpurple")
plt.xlabel("creator id")
plt.ylabel("predicted positive probability")
plt.title("pair feature -> linear score -> probability")
plt.show()
""")
md("▶ What you'll see: element-wise products become scores `[2, 1, 3, 5, 4, -1]`, and creator "
   "3 gets the largest predicted probability.")

md(r"""
## ✍️ Toy 8 · recall@k checks held-out positives

For implicit feedback, recall@k usually asks: "did the held-out positive land in the top k?"
Here two brands each have one held-out target. One target is found in top-2 and one is missed.
""")
code(r"""
t08_seed = 0                                                       # -> 0
t08_rng = np.random.default_rng(0)
print("seed:", t08_seed)

t08_scores = np.array([
    [0.2, 0.1, 0.8, 0.4, 0.7, 0.3],
    [0.5, 0.9, 0.2, 0.8, 0.1, 0.4],
], float)                                                         # -> 2 brands x 6 creators
t08_targets = np.array([4, 2], int)                               # -> [4,2]
t08_order = np.argsort(-t08_scores, axis=1)                       # -> [[2,4,3,5,0,1],[1,3,0,5,2,4]]
t08_top2 = t08_order[:, :2]                                       # -> [[2,4],[1,3]]
t08_hits = (t08_top2 == t08_targets[:, None]).any(axis=1).astype(int)  # -> [1,0]
t08_recall_at_2 = t08_hits.mean()                                # -> 0.5
print("scores:", t08_scores.tolist())
print("held-out targets:", t08_targets.tolist())
print("ranked ids:", t08_order.tolist())
print("top-2 ids:", t08_top2.tolist())
print("hit per brand:", t08_hits.tolist())
print("recall@2:", t08_recall_at_2)
assert t08_recall_at_2 == 0.5

plt.figure(figsize=(4.5, 3))
plt.bar(["brand 0", "brand 1"], t08_hits, color=["seagreen", "tomato"])
plt.ylim(0, 1.1)
plt.ylabel("held-out target in top-2?")
plt.title("recall@2 = average hit rate")
plt.show()
""")
md("▶ What you'll see: brand 0's target appears in `[2, 4]`, brand 1's target does not appear "
   "in `[1, 3]`, so recall@2 is `0.5`.")

md(r"""
## ✍️ Toy 9 · uniform and popularity samplers choose different negatives

Uniform sampling spreads negatives across the catalog. Popularity sampling draws head creators
more often. With the same seed, the average popularity of sampled negatives jumps.
""")
code(r"""
t09_seed = 0                                                       # -> 0
t09_rng = np.random.default_rng(0)
print("seed:", t09_seed)

t09_popularity = np.array([1, 1, 2, 2, 4, 6, 8, 12], float)       # -> [1,1,2,2,4,6,8,12]
t09_uniform_q = np.ones(8) / 8                                    # -> [0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125]
t09_popularity_q = t09_popularity / t09_popularity.sum()          # -> [0.028,0.028,0.056,0.056,0.111,0.167,0.222,0.333]
t09_uniform_draws = t09_rng.choice(8, size=8, replace=True, p=t09_uniform_q)      # -> [5,2,0,0,6,7,4,5]
t09_popularity_draws = t09_rng.choice(8, size=8, replace=True, p=t09_popularity_q)  # -> [6,7,7,0,7,1,7,4]
t09_uniform_sample_pop = t09_popularity[t09_uniform_draws]         # -> [6,2,1,1,8,12,4,6]
t09_popularity_sample_pop = t09_popularity[t09_popularity_draws]   # -> [8,12,12,1,12,1,12,4]
t09_uniform_mean = t09_uniform_sample_pop.mean()                   # -> 5.0
t09_popularity_mean = t09_popularity_sample_pop.mean()             # -> 7.75
print("creator popularity:", t09_popularity.tolist())
print("uniform probabilities:", np.round(t09_uniform_q, 3).tolist())
print("popularity probabilities:", np.round(t09_popularity_q, 3).tolist())
print("uniform draws:", t09_uniform_draws.tolist())
print("popularity draws:", t09_popularity_draws.tolist())
print("popularity of uniform draws:", t09_uniform_sample_pop.tolist())
print("popularity of popularity draws:", t09_popularity_sample_pop.tolist())
print("mean sampled popularity, uniform:", t09_uniform_mean)
print("mean sampled popularity, popularity:", t09_popularity_mean)
assert t09_popularity_mean > t09_uniform_mean

plt.figure(figsize=(5.5, 3))
plt.bar(np.arange(8) - 0.18, t09_uniform_q, 0.36, label="uniform")
plt.bar(np.arange(8) + 0.18, t09_popularity_q, 0.36, label="popularity")
plt.xlabel("creator id")
plt.ylabel("sampling probability")
plt.title("negative-sampler distributions")
plt.legend()
plt.show()
""")
md("▶ What you'll see: uniform gives every creator probability `0.125`, while popularity gives "
   "creator 7 probability `0.333`, making sampled negatives much head-heavier.")

md(r"""
## ✍️ Toy 10 · hard negatives are high-scoring unlabeled items

Hard negatives are chosen by the model's current score, after excluding known positives. They
teach fine distinctions, but they can be **false negatives** if they are truly great matches.
""")
code(r"""
t10_seed = 0                                                       # -> 0
t10_rng = np.random.default_rng(0)
print("seed:", t10_seed)

t10_creator_xy = np.array([
    [0, 0],
    [1, 0],
    [2, 1],
    [2, 2],
    [3, 1],
    [0, 1],
    [1, 2],
    [3, 0],
], float)                                                         # -> 8 creators in 2D
t10_true_scores = t10_creator_xy @ np.array([1, 1], float)         # -> [0,1,3,4,4,1,3,3]
t10_model_scores = np.array([0.1, 1.0, 2.0, 3.6, 3.8, 0.9, 2.8, 3.7])  # -> [0.1,1.0,2.0,3.6,3.8,0.9,2.8,3.7]
t10_observed_positive = np.array([2])                             # -> [2]
t10_candidates = np.setdiff1d(np.arange(8), t10_observed_positive)  # -> [0,1,3,4,5,6,7]
t10_model_order = np.argsort(-t10_model_scores)                   # -> [4,7,3,6,2,1,5,0]
t10_hard_negs = np.array([t10_i for t10_i in t10_model_order if t10_i in t10_candidates][:3])  # -> [4,7,3]
t10_true_top3 = np.argsort(-t10_true_scores)[:3]                  # -> [3,4,2]
t10_uniform_negs = t10_rng.choice(t10_candidates, size=3, replace=False)  # -> [4,7,5]
t10_hard_false = np.intersect1d(t10_hard_negs, t10_true_top3)      # -> [3,4]
t10_uniform_false = np.intersect1d(t10_uniform_negs, t10_true_top3)  # -> [4]
t10_hard_risk = len(t10_hard_false) / len(t10_hard_negs)           # -> 0.6666666666666666
t10_uniform_risk = len(t10_uniform_false) / len(t10_uniform_negs)  # -> 0.3333333333333333
print("creator coordinates:", t10_creator_xy.tolist())
print("true scores:", t10_true_scores.tolist())
print("model scores:", t10_model_scores.tolist())
print("observed positive ids:", t10_observed_positive.tolist())
print("candidate unlabeled ids:", t10_candidates.tolist())
print("model-ranked ids:", t10_model_order.tolist())
print("hard negatives:", t10_hard_negs.tolist())
print("true top-3 ids:", t10_true_top3.tolist())
print("uniform negatives:", t10_uniform_negs.tolist())
print("hard false negatives:", t10_hard_false.tolist())
print("uniform false negatives:", t10_uniform_false.tolist())
print("hard false-negative risk:", round(t10_hard_risk, 3))
print("uniform false-negative risk:", round(t10_uniform_risk, 3))
assert t10_hard_risk > t10_uniform_risk

plt.figure(figsize=(4.8, 3))
plt.bar(["uniform", "hard"], [t10_uniform_risk, t10_hard_risk], color=["steelblue", "tomato"])
plt.ylabel("fraction truly top-3")
plt.title("hard negatives carry more false-negative risk")
plt.show()
""")
md("▶ What you'll see: hard negatives `[4, 7, 3]` include two true top-3 matches, while the "
   "uniform sample includes only one.")

md(r"""
## ✍️ Toy 11 · why popularity sampling creates a logQ problem

This is the **motivation** for logQ, separate from the correction rule. If a head item is sampled
as a negative more often, naive training pushes its score down more often — even before knowing
whether the item is bad.
""")
code(r"""
t11_seed = 0                                                       # -> 0
t11_rng = np.random.default_rng(0)
print("seed:", t11_seed)

t11_q = np.array([0.50, 0.20, 0.10, 0.10, 0.05, 0.05])            # -> [0.5,0.2,0.1,0.1,0.05,0.05]
t11_negative_draws = t11_rng.choice(6, size=12, replace=True, p=t11_q)  # -> [1,0,0,0,3,4,1,2,1,4,3,0]
t11_draw_counts = np.bincount(t11_negative_draws, minlength=6)    # -> [4,3,1,2,2,0]
t11_score_drop = 0.1 * t11_draw_counts                            # -> [0.4,0.3,0.1,0.2,0.2,0.0]
t11_most_sampled = int(t11_draw_counts.argmax())                  # -> 0
print("sampling probabilities Q:", t11_q.tolist())
print("negative draws:", t11_negative_draws.tolist())
print("draw counts:", t11_draw_counts.tolist())
print("naive score drop if each negative subtracts 0.1:", t11_score_drop.tolist())
print("most-sampled item:", t11_most_sampled)
assert t11_most_sampled == 0

plt.figure(figsize=(5, 3))
plt.bar(np.arange(6), t11_draw_counts, color="tomato")
plt.xlabel("item id")
plt.ylabel("# times sampled negative")
plt.title("head items get more negative updates")
plt.show()
""")
md("▶ What you'll see: item 0 has the largest sampling probability and gets four negative "
   "updates, creating a popularity-shaped score drop.")

md(r"""
## ✍️ Toy 12 · logQ correction changes the sampled-softmax decision

Here is the actual **decision rule**: use corrected logits `score − log Q`. High-Q head items get
less boost than rare low-Q items, so the softmax no longer rewards or punishes items just for how
often the sampler picked them.
""")
code(r"""
t12_seed = 0                                                       # -> 0
t12_rng = np.random.default_rng(0)
print("seed:", t12_seed)

t12_scores = np.array([1.4, 1.1, 1.0, 0.8, 0.6, 0.4])             # -> [1.4,1.1,1.0,0.8,0.6,0.4]
t12_q = np.array([0.40, 0.20, 0.15, 0.10, 0.10, 0.05])            # -> [0.4,0.2,0.15,0.1,0.1,0.05]
t12_neg_log_q = -np.log(t12_q)                                    # -> [0.916,1.609,1.897,2.303,2.303,2.996]
t12_corrected_logits = t12_scores + t12_neg_log_q                 # -> [2.316,2.709,2.897,3.103,2.903,3.396]
t12_raw_exp = np.exp(t12_scores - t12_scores.max())               # -> [1.000,0.741,0.670,0.549,0.449,0.368]
t12_corrected_exp = np.exp(t12_corrected_logits - t12_corrected_logits.max())  # -> [0.340,0.503,0.607,0.746,0.611,1.000]
t12_raw_softmax = t12_raw_exp / t12_raw_exp.sum()                 # -> [0.265,0.196,0.177,0.145,0.119,0.097]
t12_corrected_softmax = t12_corrected_exp / t12_corrected_exp.sum()  # -> [0.089,0.132,0.160,0.196,0.160,0.263]
t12_raw_top = int(t12_raw_softmax.argmax())                       # -> 0
t12_corrected_top = int(t12_corrected_softmax.argmax())           # -> 5
print("raw scores:", t12_scores.tolist())
print("sampling probabilities Q:", t12_q.tolist())
print("-log Q:", np.round(t12_neg_log_q, 3).tolist())
print("corrected logits:", np.round(t12_corrected_logits, 3).tolist())
print("raw exp:", np.round(t12_raw_exp, 3).tolist())
print("corrected exp:", np.round(t12_corrected_exp, 3).tolist())
print("raw softmax:", np.round(t12_raw_softmax, 3).tolist())
print("corrected softmax:", np.round(t12_corrected_softmax, 3).tolist())
print("top before correction:", t12_raw_top)
print("top after correction:", t12_corrected_top)
assert t12_raw_top == 0 and t12_corrected_top == 5

plt.figure(figsize=(5.5, 3))
plt.bar(np.arange(6) - 0.18, t12_raw_softmax, 0.36, label="raw")
plt.bar(np.arange(6) + 0.18, t12_corrected_softmax, 0.36, label="score - logQ")
plt.xlabel("candidate id")
plt.ylabel("softmax probability")
plt.title("logQ correction changes sampled-softmax probabilities")
plt.legend()
plt.show()
""")
md("▶ What you'll see: raw softmax favors head item 0; after `score − logQ`, rare item 5 gets "
   "the largest corrected probability.")

md(r"""
## ✍️ Toy 13 · recall@k depends on the candidate universe

The same score vector can look excellent against a few easy sampled negatives and bad against
the full catalog. Always report the candidate universe with recall@k.
""")
code(r"""
t13_seed = 0                                                       # -> 0
t13_rng = np.random.default_rng(0)
print("seed:", t13_seed)

t13_scores = np.array([0.1, 0.2, 0.95, 0.8, 0.7, 0.3, 0.9, 0.6])  # -> [0.1,0.2,0.95,0.8,0.7,0.3,0.9,0.6]
t13_target = 4                                                     # -> 4
t13_sampled_universe = np.array([0, 1, 4, 5], int)                # -> [0,1,4,5]
t13_full_universe = np.arange(8)                                  # -> [0,1,2,3,4,5,6,7]
t13_sampled_order = t13_sampled_universe[np.argsort(-t13_scores[t13_sampled_universe])]  # -> [4,5,1,0]
t13_full_order = t13_full_universe[np.argsort(-t13_scores[t13_full_universe])]  # -> [2,6,3,4,7,5,1,0]
t13_sampled_hit_at_2 = int(t13_target in t13_sampled_order[:2])   # -> 1
t13_full_hit_at_2 = int(t13_target in t13_full_order[:2])         # -> 0
t13_full_rank = int(np.where(t13_full_order == t13_target)[0][0] + 1)  # -> 4
print("scores:", t13_scores.tolist())
print("target id:", t13_target)
print("sampled universe:", t13_sampled_universe.tolist())
print("full universe:", t13_full_universe.tolist())
print("sampled ranking:", t13_sampled_order.tolist())
print("full ranking:", t13_full_order.tolist())
print("sampled hit@2:", t13_sampled_hit_at_2)
print("full hit@2:", t13_full_hit_at_2)
print("target full-catalog rank:", t13_full_rank)
assert t13_sampled_hit_at_2 == 1 and t13_full_hit_at_2 == 0

plt.figure(figsize=(5, 3))
plt.bar(np.arange(8), t13_scores, color=np.where(np.arange(8) == t13_target, "gold", "lightgray"))
plt.xlabel("creator id")
plt.ylabel("score")
plt.title("same target: top-2 in sampled universe, rank 4 in full")
plt.show()
""")
md("▶ What you'll see: target 4 is top-2 among easy sampled candidates, but only rank 4 in the "
   "full catalog, so the reported recall changes.")

md(r"""
## ✍️ Toy 14 · position bias multiplies relevance by examination

Observed clicks are filtered by whether the user even **examined** the row. With the same true
relevance everywhere, lower propensities create lower observed CTR.
""")
code(r"""
t14_seed = 0                                                       # -> 0
t14_rng = np.random.default_rng(0)
print("seed:", t14_seed)

t14_rank = np.array([1, 1, 2, 2, 3, 3, 4, 4], int)                # -> [1,1,2,2,3,3,4,4]
t14_propensity = np.array([0.8, 0.8, 0.4, 0.4, 0.2, 0.2, 0.1, 0.1])  # -> [0.8,0.8,0.4,0.4,0.2,0.2,0.1,0.1]
t14_true_relevance = 0.5                                          # -> 0.5
t14_expected_click = t14_propensity * t14_true_relevance          # -> [0.4,0.4,0.2,0.2,0.1,0.1,0.05,0.05]
t14_naive_by_rank = np.array([
    t14_expected_click[t14_rank == 1].mean(),
    t14_expected_click[t14_rank == 2].mean(),
    t14_expected_click[t14_rank == 3].mean(),
    t14_expected_click[t14_rank == 4].mean(),
])                                                                # -> [0.4,0.2,0.1,0.05]
print("rank per row:", t14_rank.tolist())
print("position propensity:", t14_propensity.tolist())
print("true relevance:", t14_true_relevance)
print("expected observed click:", t14_expected_click.tolist())
print("naive CTR by rank:", t14_naive_by_rank.tolist())
assert t14_naive_by_rank[0] > t14_naive_by_rank[-1]

plt.figure(figsize=(5, 3))
plt.bar([1, 2, 3, 4], t14_naive_by_rank, color="tomato")
plt.axhline(t14_true_relevance, color="black", linestyle="--", label="true relevance")
plt.xlabel("rank")
plt.ylabel("naive observed CTR")
plt.title("same relevance, different positions")
plt.legend()
plt.show()
""")
md("▶ What you'll see: true relevance is always `0.5`, but observed CTR falls from `0.4` at "
   "rank 1 to `0.05` at rank 4 because of examination probability.")

md(r"""
## ✍️ Toy 15 · IPS divides by propensity to undo position bias

Inverse Propensity Scoring reweights each observed outcome by `1 / propensity`. In expectation,
`(propensity × relevance) / propensity` returns the true relevance.
""")
code(r"""
t15_seed = 0                                                       # -> 0
t15_rng = np.random.default_rng(0)
print("seed:", t15_seed)

t15_propensity = np.array([0.8, 0.8, 0.4, 0.4, 0.2, 0.2, 0.1, 0.1])  # -> [0.8,0.8,0.4,0.4,0.2,0.2,0.1,0.1]
t15_true_relevance = 0.5                                          # -> 0.5
t15_expected_click = t15_propensity * t15_true_relevance          # -> [0.4,0.4,0.2,0.2,0.1,0.1,0.05,0.05]
t15_ips_weight = 1 / t15_propensity                               # -> [1.25,1.25,2.5,2.5,5.0,5.0,10.0,10.0]
t15_ips_contribution = t15_expected_click * t15_ips_weight        # -> [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5]
t15_naive_estimate = t15_expected_click.mean()                    # -> 0.1875
t15_ips_estimate = t15_ips_contribution.mean()                    # -> 0.5
print("propensity:", t15_propensity.tolist())
print("true relevance:", t15_true_relevance)
print("expected click:", t15_expected_click.tolist())
print("IPS weights:", np.round(t15_ips_weight, 2).tolist())
print("IPS contributions:", t15_ips_contribution.tolist())
print("naive estimate:", t15_naive_estimate)
print("IPS estimate:", t15_ips_estimate)
assert np.isclose(t15_ips_estimate, t15_true_relevance)

plt.figure(figsize=(5, 3))
plt.bar(["naive", "IPS"], [t15_naive_estimate, t15_ips_estimate], color=["tomato", "seagreen"])
plt.axhline(t15_true_relevance, color="black", linestyle="--", label="true relevance")
plt.ylabel("estimated relevance")
plt.title("IPS recovers the expected truth")
plt.legend()
plt.show()
""")
md("▶ What you'll see: naive averaging gives `0.1875`, but dividing by propensity makes every "
   "row contribute `0.5`, recovering the truth.")

md(r"""
## ✍️ Toy 16 · clipping caps huge IPS weights

Very small propensities make huge weights. Clipping replaces `1 / propensity` with
`min(1 / propensity, cap)`: less variance, but a biased smaller estimate when a rare click
would otherwise get a giant weight.
""")
code(r"""
t16_seed = 0                                                       # -> 0
t16_rng = np.random.default_rng(0)
print("seed:", t16_seed)

t16_propensity = np.array([0.5, 0.5, 0.2, 0.2, 0.1, 0.05, 0.03, 0.03])  # -> [0.5,0.5,0.2,0.2,0.1,0.05,0.03,0.03]
t16_click = np.array([0, 1, 0, 1, 0, 0, 1, 0], float)             # -> [0,1,0,1,0,0,1,0]
t16_weight = 1 / t16_propensity                                  # -> [2.0,2.0,5.0,5.0,10.0,20.0,33.33,33.33]
t16_clip_cap = 10                                                 # -> 10
t16_clipped_weight = np.minimum(t16_weight, t16_clip_cap)         # -> [2.0,2.0,5.0,5.0,10.0,10.0,10.0,10.0]
t16_unclipped_contribution = t16_click * t16_weight               # -> [0.0,2.0,0.0,5.0,0.0,0.0,33.33,0.0]
t16_clipped_contribution = t16_click * t16_clipped_weight         # -> [0.0,2.0,0.0,5.0,0.0,0.0,10.0,0.0]
t16_unclipped_estimate = t16_unclipped_contribution.mean()        # -> 5.041666666666667
t16_clipped_estimate = t16_clipped_contribution.mean()            # -> 2.125
print("propensity:", t16_propensity.tolist())
print("clicks:", t16_click.astype(int).tolist())
print("raw IPS weights:", np.round(t16_weight, 2).tolist())
print("clip cap:", t16_clip_cap)
print("clipped weights:", np.round(t16_clipped_weight, 2).tolist())
print("unclipped contributions:", np.round(t16_unclipped_contribution, 2).tolist())
print("clipped contributions:", np.round(t16_clipped_contribution, 2).tolist())
print("unclipped estimate:", round(float(t16_unclipped_estimate), 3))
print("clipped estimate:", round(float(t16_clipped_estimate), 3))
assert t16_clipped_estimate < t16_unclipped_estimate

plt.figure(figsize=(5.5, 3))
plt.bar(np.arange(8) - 0.18, t16_unclipped_contribution, 0.36, label="unclipped")
plt.bar(np.arange(8) + 0.18, t16_clipped_contribution, 0.36, label="clipped@10")
plt.xlabel("logged row")
plt.ylabel("weighted contribution")
plt.title("clipping shrinks one huge rare-click contribution")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the row with propensity `0.03` would contribute `33.33`; clipping caps "
   "it at `10`, reducing the estimate.")

md(r"""
## ✍️ Toy 17 · delayed feedback makes fresh rows look negative

A row can be a future positive even if the contact has not arrived yet. The computational test
is `seen_now = will_contact AND delay <= age`. Fresh rows are biased downward because many
future contacts have not had time to arrive.
""")
code(r"""
t17_seed = 0                                                       # -> 0
t17_rng = np.random.default_rng(0)
print("seed:", t17_seed)

t17_age_days = np.array([1, 2, 3, 5, 8, 10, 12, 14], float)       # -> [1,2,3,5,8,10,12,14]
t17_will_contact = np.array([1, 0, 1, 1, 0, 1, 0, 1], bool)       # -> [True,False,True,True,False,True,False,True]
t17_delay_days = np.array([4, 0, 2, 7, 0, 3, 0, 10], float)       # -> [4,0,2,7,0,3,0,10]
t17_delay_has_passed = t17_delay_days <= t17_age_days             # -> [False,True,True,False,True,True,True,True]
t17_seen_now = t17_will_contact & t17_delay_has_passed            # -> [False,False,True,False,False,True,False,True]
t17_fresh = t17_age_days < 7                                      # -> [True,True,True,True,False,False,False,False]
t17_mature = t17_age_days >= 7                                    # -> [False,False,False,False,True,True,True,True]
t17_fresh_eventual = t17_will_contact[t17_fresh].mean()           # -> 0.75
t17_fresh_observed = t17_seen_now[t17_fresh].mean()               # -> 0.25
t17_mature_eventual = t17_will_contact[t17_mature].mean()         # -> 0.5
t17_mature_observed = t17_seen_now[t17_mature].mean()             # -> 0.5
print("age days:", t17_age_days.tolist())
print("will eventually contact:", t17_will_contact.tolist())
print("delay days:", t17_delay_days.tolist())
print("delay has passed:", t17_delay_has_passed.tolist())
print("seen now:", t17_seen_now.tolist())
print("fresh rows:", t17_fresh.tolist())
print("mature rows:", t17_mature.tolist())
print("fresh eventual rate:", t17_fresh_eventual)
print("fresh observed-now rate:", t17_fresh_observed)
print("mature eventual rate:", t17_mature_eventual)
print("mature observed-now rate:", t17_mature_observed)
assert t17_fresh_observed < t17_fresh_eventual

plt.figure(figsize=(5, 3))
plt.plot(t17_age_days, t17_will_contact.astype(int), "o-", label="eventual")
plt.plot(t17_age_days, t17_seen_now.astype(int), "o-", label="seen now")
plt.xlabel("row age (days)")
plt.ylabel("label")
plt.title("fresh positives may not have arrived yet")
plt.legend()
plt.show()
""")
md("▶ What you'll see: fresh rows have eventual contact rate `0.75` but observed-now rate `0.25`; "
   "mature rows match because enough time has passed.")

# =================================================================== PART A
md("---\n# Part A · Implicit feedback & principled negatives")

md(r"""
## Step 2 · The core problem — "unlabeled ≠ negative" (PU learning)

Say a brand contacted **1** creator out of a catalog of **100,000**. The tempting move is to
call that 1 a positive and the other **99,999** negatives. But the brand never *saw* almost
any of them! Most are simply **unlabeled** — unknown, not disliked. Treating them all as
negatives teaches the model a lie. This is **PU learning**: **P**ositive + **U**nlabeled,
not positive + negative.
""")
code(r"""
catalog = 100_000
positives = 1
print(f"catalog: {catalog:,} creators")
print(f"observed positives: {positives}")
print(f"naive 'everything else is negative': {catalog-positives:,} fake negatives")
print("reality: those are UNLABELED (unseen / undecided / delayed), not confirmed dislikes")
plt.figure(figsize=(6,1.6))
plt.barh([0],[catalog-positives], color=GOLD, label="unlabeled (unknown)")
plt.barh([0],[positives*2000], color=GREEN, label="positive (x2000 so it's visible)")
plt.yticks([]); plt.xlabel("creators"); plt.legend(loc="upper right")
plt.title("1 positive, ~100k unlabeled — calling all unlabeled 'negative' is wrong"); plt.show()
""")

md(r"""
## Step 3 · Build a tiny brand→creator dataset (with a known truth)

To experiment we make synthetic data where **we** control the truth. Each brand and creator
gets a short hidden "taste vector"; their **true affinity** is the dot product. Observed
positives are high-affinity pairs (tilted by exposure/popularity, as in real logs). We hold
out one positive per brand as a test target.
""")
code(r"""
rng = np.random.default_rng(3)
n_brands, n_creators, dim = 400, 1000, 6
Bf = rng.normal(0, 1, (n_brands, dim))     # brand taste vectors
Cf = rng.normal(0, 1, (n_creators, dim))   # creator style vectors
affinity = Bf @ Cf.T                        # TRUE affinity (hidden from the model)
pop = rng.zipf(1.5, n_creators).astype(float); pop = np.clip(pop, 1, 300); popn = pop / pop.sum()

positives = {}
for b in range(n_brands):
    a = affinity[b]; pr = np.exp(a - a.max()) * popn; pr /= pr.sum()   # affinity x exposure
    k = rng.integers(4, 9)
    positives[b] = list(rng.choice(n_creators, size=k, replace=False, p=pr))
train_pos = {b: v[:-1] for b, v in positives.items() if len(v) >= 2}
test_pos  = {b: v[-1]  for b, v in positives.items() if len(v) >= 2}
print(f"{n_brands} brands, {n_creators} creators")
print(f"observed positive pairs (train): {sum(len(v) for v in train_pos.values())}")
print(f"held-out test positives: {len(test_pos)} (one per brand)")
print("popularity is skewed: top creator is exposed", round(popn.max()/popn.min()), "x more than the rarest")
""")

md(r"""
## Step 4 · Negative sampling makes training possible

We can't train on 100k negatives per positive. Instead, for each positive we **sample a few**
unlabeled creators as stand-in negatives. The model here is deliberately simple: a linear
classifier on the **element-wise product** of the brand and creator vectors — summing that
product *is* the affinity, so a linear model can learn it. We evaluate with **recall@50**:
did the held-out true positive land in the model's top 50?
""")
code(r"""
def pair_feat(bs, cs):
    return Bf[bs] * Cf[cs]                       # element-wise product

def build_training(sampler="uniform", n_neg=5, seed=1):
    r = np.random.default_rng(seed); Xb, Xc, Y = [], [], []
    q = popn if sampler == "popularity" else None
    for b, items in train_pos.items():
        for i in items:
            Xb.append(b); Xc.append(i); Y.append(1)                 # positive
            for j in r.choice(n_creators, n_neg, p=q):
                Xb.append(b); Xc.append(j); Y.append(0)             # sampled negative
    return np.array(Xb), np.array(Xc), np.array(Y)

def recall_at_k(model, k=50):
    hits = 0
    for b, ti in test_pos.items():
        s = model.decision_function(Bf[b] * Cf)                     # score ALL creators
        for i in train_pos[b]: s[i] = -1e9                          # exclude train positives
        topk = np.argpartition(-s, k)[:k]
        hits += int(ti in topk)
    return hits / len(test_pos)

Xb, Xc, Y = build_training("uniform")
model = LogisticRegression(max_iter=1000).fit(pair_feat(Xb, Xc), Y)
r_model = recall_at_k(model); r_random = 50 / n_creators
print(f"training rows: {len(Y)} (positive rate {Y.mean():.2f}) — balanced enough to learn")
print(f"recall@50: model {r_model:.3f}   vs   random {r_random:.3f}   ({r_model/r_random:.0f}x better)")
plt.figure(figsize=(4.5,3)); plt.bar(["random","trained\n(neg. sampling)"], [r_random, r_model], color=[GRAY, GREEN])
plt.ylabel("recall@50"); plt.title("a few sampled negatives are enough to learn"); plt.show()
""")

md(r"""
## Step 5 · The sampler zoo — where do negatives come from?

Different samplers draw different "negatives," and the choice matters:

| Sampler | Draws from | Good for | Watch out |
|---|---|---|---|
| **Uniform** | catalog evenly | broad coverage | usually too easy |
| **Popularity** | exposure-weighted | realistic confusions | overweights head creators |
| **Hard** | items the model already scores high | fine distinctions | may be false negatives |

Let's *see* the difference: a histogram of how popular the sampled negatives are under
uniform vs popularity sampling.
""")
code(r"""
r = np.random.default_rng(0)
uni = r.choice(n_creators, 5000)                  # uniform negatives
pops = r.choice(n_creators, 5000, p=popn)          # popularity negatives
plt.figure(figsize=(6.5,3.2))
plt.hist(pop[uni],  bins=40, alpha=.6, color=BLUE,  label="uniform (mostly tail creators)")
plt.hist(pop[pops], bins=40, alpha=.6, color=RED,   label="popularity (grabs head creators)")
plt.xlabel("creator exposure/popularity"); plt.ylabel("# sampled as negative"); plt.legend()
plt.title("uniform vs popularity: which creators become 'negatives'"); plt.show()
print("uniform avg popularity of negatives:   ", round(pop[uni].mean(), 1))
print("popularity avg popularity of negatives:", round(pop[pops].mean(), 1), "(much higher — head-heavy)")
""")

md(r"""
## Step 6 · Hard negatives are powerful but risky (false negatives)

**Hard negatives** are the creators the model *already* ranks high but that weren't contacted
— great for teaching fine distinctions. The danger: many are creators the brand *would*
actually love (true positives it just hasn't reached yet). Using them as negatives teaches
the model the wrong thing. We measure how often a hard negative is truly a top-20 match, vs a
uniform-random negative.
""")
code(r"""
model_score = affinity + np.random.default_rng(3).normal(0, 2.0, affinity.shape)  # an imperfect model
fn_hard = tot_hard = fn_uni = tot_uni = 0
ru = np.random.default_rng(5)
for b in range(n_brands):
    true_top = set(np.argsort(-affinity[b])[:20].tolist())         # would-be strong matches
    contacted = set(np.argsort(-affinity[b])[:3].tolist())
    hard = [i for i in np.argsort(-model_score[b]) if i not in contacted][:10]
    for j in hard:            tot_hard += 1; fn_hard += int(j in true_top)
    for j in ru.choice(n_creators, 10, replace=False):
                              tot_uni  += 1; fn_uni  += int(j in true_top)
print(f"hard negatives that are actually top-20 matches:   {fn_hard/tot_hard:.2f}  (false-negative risk!)")
print(f"uniform-random negatives that are top-20 matches:  {fn_uni/tot_uni:.3f}  (much safer)")
plt.figure(figsize=(4.8,3)); plt.bar(["uniform","hard"], [fn_uni/tot_uni, fn_hard/tot_hard], color=[BLUE, RED])
plt.ylabel("fraction that are TRUE matches"); plt.title("hard negatives carry a real false-negative risk"); plt.show()
""")

md(r"""
## Step 7 · logQ correction — don't punish an item for being sampled often

If you sample negatives by **popularity**, a head creator appears as a "negative" far more
often than a tail creator — purely because it's popular, not because it's bad. Left alone,
the model learns to **under-score popular items**. The **logQ correction** subtracts the log
sampling probability from each score, `s_i - log Q(i)`, cancelling that artificial frequency.

We show it on a clean **sampled-softmax** retrieval task: learn a score per item from
positives (drawn by true relevance) and negatives (drawn by popularity `Q`), with and without
the correction. We check (a) how well scores rank the true relevance and (b) whether the
score error is correlated with popularity (a bias we want at ~0).
""")
code(r"""
rng2 = np.random.default_rng(0)
M = 200
z_true = rng2.normal(0, 1.2, M)                                   # true relevance (hidden)
p_true = np.exp(z_true - z_true.max()); p_true /= p_true.sum()
Q = rng2.zipf(1.4, M).astype(float); Q = np.clip(Q, 1, 500); Q /= Q.sum()   # popularity sampler

def train_sampled_softmax(correct, steps=4000, n_neg=20, lr=0.5):
    s = np.zeros(M)
    for t in range(steps):
        pos = rng2.choice(M, p=p_true)
        negs = rng2.choice(M, size=n_neg, p=Q)
        cand = np.append(negs, pos)
        logits = s[cand].copy()
        if correct:
            logits = logits - np.log(np.append(Q[negs], Q[pos]))  # <-- logQ correction
        logits -= logits.max()
        pr = np.exp(logits); pr /= pr.sum()
        g = pr.copy(); g[-1] -= 1                                  # softmax gradient (pos is last)
        np.add.at(s, cand, -lr * g / np.sqrt(t + 1))
    return s

for correct in [False, True]:
    s = train_sampled_softmax(correct)
    rho = rank_corr(s, z_true)
    bias = np.corrcoef(s - z_true, np.log(Q))[0, 1]               # error vs popularity (want ~0)
    tag = "WITH logQ" if correct else "no correction"
    print(f"{tag:14}: rank-corr with truth = {rho:.3f}   |  popularity bias = {bias:+.3f}")
""")
code(r"""
# visualize the popularity bias being removed
s_no  = train_sampled_softmax(False)
s_yes = train_sampled_softmax(True)
fig, ax = plt.subplots(1, 2, figsize=(11, 3.8), sharey=True)
for a, s, name, c in [(ax[0], s_no, "no correction", RED), (ax[1], s_yes, "with logQ", GREEN)]:
    a.scatter(np.log(Q), s - z_true, s=10, alpha=.5, color=c)
    z = np.polyfit(np.log(Q), s - z_true, 1); xs = np.array([np.log(Q).min(), np.log(Q).max()])
    a.plot(xs, np.polyval(z, xs), "k--")
    a.set_xlabel("log popularity  log Q(i)"); a.set_title(name)
ax[0].set_ylabel("score error (learned - true)")
fig.suptitle("logQ correction flattens the popularity bias (slope -> ~0)"); plt.show()
print("no correction: popular items (right) are pushed DOWN (negative error). logQ removes the tilt.")
""")

md(r"""
## Step 8 · recall@k has no meaning without saying the candidate universe

Without true negatives, **recall@k = "did we retrieve the known positives?"** — and the
answer depends entirely on **which candidates** you rank against. Testing against a handful
of easy sampled negatives looks great; testing against the full catalog is much harder.
Always state the universe.
""")
code(r"""
def recall_universe(model, k=50, universe="full", seed=0):
    r = np.random.default_rng(seed); hits = 0
    for b, ti in test_pos.items():
        if universe == "full":
            cand = np.arange(n_creators)
        else:                                              # ti + a few sampled negatives
            cand = np.append(r.choice(n_creators, 200, replace=False), ti)
        s = model.decision_function(Bf[b] * Cf[cand])
        order = cand[np.argsort(-s)]
        hits += int(ti in order[:k])
    return hits / len(test_pos)

for uni in ["sampled (ti + 200)", "full"]:
    key = "full" if uni == "full" else "sampled"
    print(f"recall@50 vs {uni:18}: {recall_universe(model, universe=key):.3f}")
print("same model, very different numbers — report the candidate universe every time.")
""")

# =================================================================== PART B
md("---\n# Part B · Debiasing (position, selection, delayed)")

md(r"""
## Step 9 · Observed labels are filtered, not random

The old system decides **what** gets shown and **where**. So the logs are biased:

| Bias | What happens | Failure |
|---|---|---|
| **Position** | top ranks get more attention | confuses *visibility* with *preference* |
| **Selection** | old policy picks what's observable | unshown items look invisible |
| **Delayed** | positives arrive late | fresh rows look falsely negative |

We'll demonstrate **position bias** and its fix (IPS), then **delayed feedback**.
""")

md(r"""
## Step 10 · Position bias — identical items, different CTR

Set up five creators with the **exact same** true relevance (30% click *if examined*). But
each was mostly logged at a different rank, and higher ranks get examined more often
(propensities 0.8, 0.4, 0.2, 0.1, 0.05). Watch the **naive CTR** make them look wildly
different — even though they're identical.
""")
code(r"""
rng3 = np.random.default_rng(0)
exam = np.array([0.8, 0.4, 0.2, 0.1, 0.05])     # examination probability (propensity) by rank
true_rel = 0.30                                  # ALL five creators share this
n_imp = 40000
naive, ips = [], []
for pos in range(5):
    examined = rng3.random(n_imp) < exam[pos]
    clicked  = examined & (rng3.random(n_imp) < true_rel)
    naive.append(clicked.mean())                 # observed CTR (biased by position)
    ips.append((clicked / exam[pos]).mean())     # IPS: divide by propensity
for pos in range(5):
    print(f"  creator {pos+1} @ rank {pos+1} (propensity {exam[pos]:.2f}): naive CTR {naive[pos]:.3f}")
print(f"\nnaive CTR spans {min(naive):.3f}..{max(naive):.3f} — looks like a {max(naive)/min(naive):.0f}x difference, but they're identical!")
plt.figure(figsize=(5.5,3.2)); plt.bar(range(1,6), naive, color=RED)
plt.axhline(true_rel, color="k", ls="--", label="true relevance (0.30)")
plt.xlabel("creator (each mostly shown at this rank)"); plt.ylabel("naive CTR"); plt.legend()
plt.title("position bias: same creators, very different observed CTR"); plt.show()
""")

md(r"""
## Step 11 · IPS undoes it — weight by 1 / propensity

**Inverse Propensity Scoring**: a click seen where exposure was unlikely counts for more.
Divide each outcome by the probability it was exposed:
$$\hat R_{IPS}=\frac1n\sum_i \frac{y_i}{\pi_i}.$$
A click at propensity 0.8 → weight 1.25; at 0.05 → weight 20. Applying it, all five creators
snap back to their true 0.30.
""")
code(r"""
x = np.arange(1, 6)
plt.figure(figsize=(6,3.4))
plt.bar(x-0.2, naive, 0.4, color=RED,   label="naive CTR (biased)")
plt.bar(x+0.2, ips,   0.4, color=GREEN, label="IPS-corrected")
plt.axhline(true_rel, color="k", ls="--", label="true relevance (0.30)")
plt.xlabel("creator"); plt.ylabel("estimated relevance"); plt.legend()
plt.title("IPS recovers the truth from position-biased logs"); plt.show()
for pos in range(5):
    print(f"  rank {pos+1}: naive {naive[pos]:.3f}  ->  IPS {ips[pos]:.3f}  (weight for a click = {1/exam[pos]:.1f})")
""")

md(r"""
## Step 12 · IPS variance & clipping — a bias-variance tradeoff

Those big weights (÷0.05 = ×20) are dangerous: one lucky click at a tiny propensity can
swing the estimate. **Clipping** caps the weight — this lowers variance but adds a little
bias. We estimate a creator's true 0.30 relevance over **600** simulated log-sets, unclipped
vs clipped, and compare the spread.
""")
code(r"""
true_rel = 0.30
def one_run(seed, clip=None):
    r = np.random.default_rng(seed); n = 500
    prop = np.where(r.random(n) < 0.15, 0.03, 0.6)         # mostly 0.6, sometimes tiny 0.03
    click = ((r.random(n) < prop) & (r.random(n) < true_rel)).astype(float)
    w = 1 / prop
    if clip is not None: w = np.minimum(w, clip)
    return (w * click).mean()

unc = np.array([one_run(s)          for s in range(600)])
clp = np.array([one_run(s, clip=5)  for s in range(600)])
print(f"estimating true relevance {true_rel} over 600 log-sets:")
print(f"  unclipped : mean {unc.mean():.3f}  std {unc.std():.3f}   (nearly unbiased, HIGH variance)")
print(f"  clipped@5 : mean {clp.mean():.3f}  std {clp.std():.3f}   (slight bias, LOW variance)")
plt.figure(figsize=(6.5,3.4))
plt.hist(unc, bins=30, alpha=.6, color=RED,   label=f"unclipped (std {unc.std():.3f})")
plt.hist(clp, bins=30, alpha=.6, color=GREEN, label=f"clipped@5 (std {clp.std():.3f})")
plt.axvline(true_rel, color="k", ls="--", label="true 0.30")
plt.xlabel("IPS estimate"); plt.ylabel("# of runs"); plt.legend()
plt.title("clipping trades a little bias for much less variance"); plt.show()
""")

md(r"""
## Step 13 · Delayed feedback — fresh rows look falsely negative

A brand may view a creator today and contact **next week**. If you snapshot labels too early,
recent rows look like "no contact" only because the contact **hasn't happened yet** — biasing
fresh cohorts downward. The fix (same as leakage in M2): score at exposure time, then **wait
for an attribution window** before using a row as a labeled negative.
""")
code(r"""
r = np.random.default_rng(7); K = 6000
age   = r.uniform(0, 14, K)              # days since the brand viewed the creator
will  = r.random(K) < 0.25              # 25% will EVENTUALLY contact
delay = r.exponential(4, K)             # contact arrives this many days after viewing
seen_now = will & (delay <= age)        # only counts if the contact already happened

bins = np.linspace(0, 14, 8); ctr = (bins[:-1] + bins[1:]) / 2
obs = [seen_now[(age >= lo) & (age < hi)].mean() for lo, hi in zip(bins[:-1], bins[1:])]
tru = [will[(age >= lo) & (age < hi)].mean()     for lo, hi in zip(bins[:-1], bins[1:])]
plt.figure(figsize=(6.5,3.4))
plt.plot(ctr, tru, "o-", color=GREEN, label="eventual (true) contact rate")
plt.plot(ctr, obs, "o-", color=RED,   label="observed NOW")
plt.xlabel("row age (days since view)"); plt.ylabel("contact rate"); plt.legend()
plt.title("fresh rows look falsely negative — labels are still arriving"); plt.show()
print(f"1-day-old rows: observed {obs[0]:.2f} vs eventual {tru[0]:.2f}  -> exclude immature rows or model the delay.")
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## Recap — the M10 toolkit

**Implicit feedback & negatives (Part A).** A missing click is **unlabeled**, not negative
(**PU learning**). Make training feasible with **negative sampling**; pick the sampler on
purpose — **uniform** (easy, broad), **popularity** (realistic but head-heavy), **hard**
(sharp but ~1/3 can be **false negatives**). If you sample by popularity, apply the **logQ
correction** `s_i − log Q(i)` so frequently-sampled items aren't unfairly pushed down. And
**recall@k means nothing without naming the candidate universe.**

**Debiasing (Part B).** Logs are filtered by **position**, **selection**, and **delayed
feedback**. Position bias makes identical items look 16× apart; **IPS** (weight by
`1/propensity`) recovers the truth, but tiny propensities create huge weights, so **clip**
them (trading a little bias for much less variance). For delayed feedback, **wait for an
attribution window** before trusting a "no" — fresh rows look falsely negative.

**Where this connects:** M10 is how ranking systems (M7) learn from the messy labels reality
gives them. It reuses M8's calibration/delayed-feedback thinking and M9's careful handling of
sparse evidence — and its debiased, sampled training data is exactly what a production ranker
consumes.
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M10 · Sparse & Implicit Labels", "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M10-sparse-implicit-labels.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
