#!/usr/bin/env python3
"""Generate afp/notebooks/M06-recsys-landscape.ipynb.

A runnable, self-contained Colab notebook for M6 (RecSys landscape): 10 basic +
5 easy + 5 advanced examples with matplotlib visualizations, covering the
retrieval->ranking funnel, collaborative filtering (user-user & item-item),
matrix factorization / latent factors, implicit feedback + negatives, two-tower
retrieval, ANN, sequential recommenders, and generative retrieval (semantic IDs).

Uses only Colab-preinstalled libraries (pandas/numpy/scikit-learn/matplotlib) so
it runs top-to-bottom with zero installs. Every cell carries a step-by-step
"why it's done this way" explanation in the preceding markdown.

Run: python3 tools/gen-m6-notebook.py
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
# M6 · RecSys Landscape — Hands-on Notebook

**Companion to curriculum lesson M6.** Runnable, visual examples of every family M6
discusses — **collaborative filtering** (user-user & item-item), **matrix
factorization / latent factors**, **two-tower retrieval + ANN**, **sequential**, and
**generative retrieval** — plus the **retrieval→ranking funnel** and cold-start.

Runs top-to-bottom in Google Colab with **no installs** (pandas, numpy,
scikit-learn, matplotlib only). Each example's markdown explains **why** it's built
that way, not just what the code does.

- **Basic (10):** interaction matrix & sparsity · popularity baseline · user-user CF ·
  item-item CF · the cosine-similarity idea · cold-start failure · matrix
  factorization (SGD) · latent-factor map · MF reconstruction · MF top-k recs
- **Easy (5):** train/test recall@k · CF vs MF vs popularity bake-off · the
  retrieval→ranking funnel · implicit feedback + negative sampling · two-tower model
- **Advanced (5):** ANN vs brute force (recall/latency) · sequential (order matters) ·
  generative retrieval (semantic IDs) · full funnel bake-off · cold-start fixed with content
""")

# ------------------------------------------------------------------- setup
md(r"""
## Setup — a synthetic dataset *with real latent structure*

CF and MF only "work" when the data has hidden structure to recover, so we build it in:
**200 members**, **120 items**, **5 genres**. Each member prefers 1–2 genres; each item
belongs to a genre and has a popularity drawn from a **power law** (a few hits, a long
tail). A member interacts with items in proportion to *(their genre affinity × item
popularity)*. That mirrors reality — taste + popularity — and means a good model can
recover genre clusters, while popularity alone is a real baseline to beat.
""")
code(r"""
import numpy as np, pandas as pd, time
import matplotlib.pyplot as plt
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"

rng = np.random.default_rng(42)
n_users, n_items, n_genres = 200, 120, 5
genres = ["tech", "cooking", "fitness", "travel", "finance"]
item_genre = rng.integers(0, n_genres, n_items)
item_pop = (rng.zipf(1.3, n_items) * 1.0).clip(max=20)          # power-law popularity (tamed)

# each user prefers 1-2 genres (this is the latent taste we hope to recover)
user_pref = np.full((n_users, n_genres), 0.05)
for u in range(n_users):
    favs = rng.choice(n_genres, size=rng.integers(1, 3), replace=False)
    user_pref[u, favs] += 2.0
user_pref /= user_pref.sum(1, keepdims=True)

# generate implicit interactions: prob(item) ~ genre affinity x item popularity
R = np.zeros((n_users, n_items), dtype=int)
for u in range(n_users):
    p = user_pref[u, item_genre] * item_pop
    p /= p.sum()
    k = rng.integers(8, 25)
    items = rng.choice(n_items, size=k, replace=False, p=p)
    R[u, items] = 1

interactions = R.sum()
sparsity = 1 - interactions / R.size
print(f"interactions: {interactions}  |  matrix {R.shape}  |  sparsity {sparsity:.1%}")
print("avg interactions/user:", round(R.sum(1).mean(), 1))
""")


# =================================================================== TOY EXAMPLES
md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full recommender tour, here is **one tiny, hand-traceable toy example for every
computational mechanic** in M6. Each toy uses 6–12 small users/items/vectors, prints every
intermediate value, includes concrete `# ->` comments, makes exactly one matplotlib picture,
and ends with an assert. The larger examples below reuse these same moves at notebook scale.
""")

md(r"""
## ✍️ Toy 1 · taste × popularity makes interaction probabilities

The setup cell creates interactions from two ingredients: a user's **genre taste** and each
item's **popularity**. By hand, multiply `taste[item_genre] × popularity`, then normalize so the
weights become probabilities that sum to 1.
""")
code(r"""
t01_rng = np.random.default_rng(0)
print("rng seed:", 0)

t01_item_genre = np.array([0, 0, 1, 1, 2, 2])                 # -> 6 items, 3 genres
t01_item_pop = np.array([1., 3., 2., 1., 4., 2.])             # -> simple popularity weights
t01_user_pref = np.array([0.5, 0.3, 0.2])                    # -> user's genre taste sums to 1
print("item genres:", t01_item_genre.tolist())
print("item popularity:", t01_item_pop.tolist())
print("user genre preference:", t01_user_pref.tolist())

t01_taste_per_item = t01_user_pref[t01_item_genre]            # -> [0.5, 0.5, 0.3, 0.3, 0.2, 0.2]
print("taste lookup per item:", t01_taste_per_item.tolist())

t01_weight = t01_taste_per_item * t01_item_pop                # -> [0.5, 1.5, 0.6, 0.3, 0.8, 0.4]
print("taste × popularity weights:", t01_weight.tolist())

t01_total = t01_weight.sum()                                  # -> 4.1
print("weight total:", round(float(t01_total), 1))

t01_prob = t01_weight / t01_total                             # -> [0.122, 0.366, 0.146, 0.073, 0.195, 0.098]
print("normalized probabilities:", np.round(t01_prob, 3).tolist())

t01_pick = int(np.argmax(t01_prob))                           # -> 1
print("highest-probability item:", t01_pick)
assert t01_pick == 1 and np.isclose(t01_prob.sum(), 1.0)

plt.figure(figsize=(5, 3))
plt.bar(range(6), t01_prob, color=BLUE)
plt.xticks(range(6), [f"i{i}\ng{g}" for i, g in enumerate(t01_item_genre)])
plt.ylabel("probability")
plt.title("interaction probability = taste × popularity, normalized")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: item 1 wins because it combines the user's favorite genre with high popularity; "
   "the normalized probabilities sum to 1 before sampling interactions.")

md(r"""
## ✍️ Toy 2 · interaction matrix and sparsity by hand

A recommender's starting object is a binary user–item matrix. Count the 1s as known interactions,
count the 0s as unknowns, and compute sparsity = unknown cells / all cells.
""")
code(r"""
t02_rng = np.random.default_rng(0)
print("rng seed:", 0)

t02_R = np.array([[1, 0, 1, 0, 0, 0],
                  [0, 1, 1, 0, 0, 0],
                  [0, 0, 0, 1, 1, 0],
                  [1, 0, 0, 0, 1, 0]])                       # -> 4 users × 6 items
print("interaction matrix:\n", t02_R)

t02_interactions = int(t02_R.sum())                           # -> 8
print("number of 1s:", t02_interactions)

t02_total_cells = int(t02_R.size)                             # -> 24
print("total cells:", t02_total_cells)

t02_unknowns = t02_total_cells - t02_interactions             # -> 16
print("number of 0s (unknowns):", t02_unknowns)

t02_sparsity = t02_unknowns / t02_total_cells                 # -> 0.6666666666666666
print("sparsity:", round(float(t02_sparsity), 3))
assert t02_interactions == 8 and np.isclose(t02_sparsity, 16/24)

plt.figure(figsize=(5, 3))
plt.imshow(t02_R, cmap="Greys", interpolation="nearest", aspect="auto")
plt.xlabel("items")
plt.ylabel("users")
plt.title("tiny interaction matrix: 8 known, 16 unknown")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: a 4×6 matrix with 8 black cells and sparsity 16/24 ≈ 0.667, the same calculation "
   "the setup performs on the larger synthetic dataset.")

md(r"""
## ✍️ Toy 3 · popularity baseline ranks column sums

Popularity ignores who the user is. Sum each item column, sort descending, then hide items the
current user already consumed before taking the top-k recommendations.
""")
code(r"""
t03_rng = np.random.default_rng(0)
print("rng seed:", 0)

t03_R = np.array([[1, 0, 1, 0, 0, 0],
                  [0, 1, 1, 0, 0, 0],
                  [0, 0, 0, 1, 1, 0],
                  [1, 0, 0, 0, 1, 0]])                       # -> same 4×6 toy matrix
print("interaction matrix:\n", t03_R)

t03_pop_score = t03_R.sum(axis=0)                             # -> [2, 1, 2, 1, 2, 0]
print("column sums / popularity:", t03_pop_score.tolist())

t03_order = np.argsort(-t03_pop_score)                        # -> [0, 2, 4, 1, 3, 5]
print("global popularity ranking:", t03_order.tolist())

t03_user = 0                                                  # -> recommend for user 0
t03_seen = np.where(t03_R[t03_user] == 1)[0]                  # -> [0, 2]
print("user 0 already saw:", t03_seen.tolist())

t03_scores = t03_pop_score.astype(float)                      # -> [2., 1., 2., 1., 2., 0.]
t03_scores[t03_seen] = -np.inf                                # -> [-inf, 1., -inf, 1., 2., 0.]
print("masked popularity scores:", t03_scores.tolist())

t03_recs = np.argsort(-t03_scores)[:2]                        # -> [4, 1]
print("top-2 popularity recs for user 0:", t03_recs.tolist())
assert t03_recs.tolist() == [4, 1]

plt.figure(figsize=(5, 3))
plt.bar(range(6), t03_pop_score, color=GOLD)
plt.scatter(t03_recs, t03_pop_score[t03_recs], s=180, facecolors="none", edgecolors=RED, linewidths=2, label="recommended")
plt.xlabel("item")
plt.ylabel("interactions")
plt.title("popularity baseline = column sums")
plt.legend(); plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: items 0, 2, and 4 tie globally, but user 0 has already seen 0 and 2, so the "
   "baseline recommends item 4 first.")

md(r"""
## ✍️ Toy 4 · cosine similarity is dot divided by two lengths

Collaborative filtering uses cosine similarity so overlap is normalized by activity level. Compute
the dot product, both vector lengths, and the final cosine one line at a time.
""")
code(r"""
t04_rng = np.random.default_rng(0)
print("rng seed:", 0)

t04_a = np.array([1., 1., 0., 0.])                            # -> user/item vector A
t04_b = np.array([1., 1., 1., 0.])                            # -> similar vector B
t04_c = np.array([0., 0., 1., 1.])                            # -> different vector C
print("a:", t04_a.tolist())
print("b:", t04_b.tolist())
print("c:", t04_c.tolist())

t04_dot_ab = float(t04_a @ t04_b)                              # -> 2.0
print("dot(a,b):", t04_dot_ab)

t04_norm_a = float(np.linalg.norm(t04_a))                      # -> 1.4142135623730951
print("||a||:", round(t04_norm_a, 3))

t04_norm_b = float(np.linalg.norm(t04_b))                      # -> 1.7320508075688772
print("||b||:", round(t04_norm_b, 3))

t04_cos_ab = t04_dot_ab / (t04_norm_a * t04_norm_b)            # -> 0.8164965809277261
print("cos(a,b):", round(t04_cos_ab, 3))

t04_dot_ac = float(t04_a @ t04_c)                              # -> 0.0
print("dot(a,c):", t04_dot_ac)

t04_cos_ac = t04_dot_ac / (t04_norm_a * np.linalg.norm(t04_c)) # -> 0.0
print("cos(a,c):", round(float(t04_cos_ac), 3))
assert np.isclose(t04_cos_ab, 0.8164965809277261) and np.isclose(t04_cos_ac, 0.0)

plt.figure(figsize=(4, 4))
plt.arrow(0, 0, t04_a[0], t04_a[1], head_width=0.06, color=BLUE, length_includes_head=True)
plt.arrow(0, 0, t04_b[0], t04_b[1], head_width=0.06, color=GREEN, length_includes_head=True)
plt.arrow(0, 0, t04_c[0], t04_c[2], head_width=0.06, color=RED, length_includes_head=True)
plt.text(1.05, 1.05, "a", color=BLUE)
plt.text(1.05, 1.18, "b", color=GREEN)
plt.text(0.05, 1.05, "c", color=RED)
plt.xlim(-0.1, 1.4); plt.ylim(-0.1, 1.4)
plt.title("cosine: same direction high, orthogonal zero")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: `cos(a,b)=0.816` because they overlap after length-normalization, while "
   "`cos(a,c)=0.0` because their active coordinates do not overlap.")

md(r"""
## ✍️ Toy 5 · user-user CF weighted vote

User-user CF finds neighbors similar to the target user, then lets those neighbors vote for items.
The score for item `i` is `sum_v sim(target,v) × R[v,i]`, with already-seen items masked out.
""")
code(r"""
t05_rng = np.random.default_rng(0)
print("rng seed:", 0)

t05_R = np.array([[1., 1., 0., 0., 0., 0.],
                  [1., 1., 1., 0., 0., 0.],
                  [0., 1., 1., 1., 0., 0.],
                  [0., 0., 0., 1., 1., 1.]])                 # -> 4 users × 6 items
print("interaction matrix:\n", t05_R.astype(int))

t05_target = 0                                                # -> recommend for user 0
print("target user:", t05_target)

t05_norms = np.linalg.norm(t05_R, axis=1)                     # -> [1.414, 1.732, 1.732, 1.732]
print("user row norms:", np.round(t05_norms, 3).tolist())

t05_user_sim = (t05_R @ t05_R[t05_target]) / (t05_norms * t05_norms[t05_target])  # -> [1.0, 0.816, 0.408, 0.0]
print("cosine to target:", np.round(t05_user_sim, 3).tolist())

t05_user_sim[t05_target] = 0.0                                # -> [0.0, 0.816, 0.408, 0.0]
print("self-similarity zeroed:", np.round(t05_user_sim, 3).tolist())

t05_scores = t05_user_sim @ t05_R                             # -> [0.816, 1.225, 1.225, 0.408, 0.0, 0.0]
print("weighted votes before masking:", np.round(t05_scores, 3).tolist())

t05_seen = np.where(t05_R[t05_target] == 1)[0]                # -> [0, 1]
print("target already saw:", t05_seen.tolist())

t05_scores[t05_seen] = -np.inf                                # -> [-inf, -inf, 1.225, 0.408, 0.0, 0.0]
print("weighted votes after masking:", t05_scores.tolist())

t05_recs = np.argsort(-t05_scores)[:2]                        # -> [2, 3]
print("user-user CF top-2:", t05_recs.tolist())
assert t05_recs.tolist() == [2, 3]

plt.figure(figsize=(5, 3))
plt.bar(range(6), np.nan_to_num(t05_scores, neginf=0.0), color=BLUE)
plt.xticks(range(6))
plt.xlabel("item")
plt.ylabel("weighted vote")
plt.title("user-user CF: similar users vote for unseen items")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: neighbor votes give item 2 the largest unseen score, then item 3; seen items "
   "are removed before the top-k step.")

md(r"""
## ✍️ Toy 6 · item-item CF sums similarity to liked items

Item-item CF precomputes item neighborhoods. For one user, score each candidate item by summing its
similarity to the items that user already liked.
""")
code(r"""
t06_rng = np.random.default_rng(0)
print("rng seed:", 0)

t06_item_sim = np.array([[0.0, 0.8, 0.1, 0.0, 0.2, 0.0],
                         [0.8, 0.0, 0.7, 0.1, 0.0, 0.0],
                         [0.1, 0.7, 0.0, 0.6, 0.2, 0.0],
                         [0.0, 0.1, 0.6, 0.0, 0.9, 0.4],
                         [0.2, 0.0, 0.2, 0.9, 0.0, 0.5],
                         [0.0, 0.0, 0.0, 0.4, 0.5, 0.0]])    # -> 6 items × 6 items
print("item similarity matrix:\n", t06_item_sim)

t06_liked = np.array([0, 1])                                  # -> user liked items 0 and 1
print("liked items:", t06_liked.tolist())

t06_scores = t06_item_sim[:, t06_liked].sum(axis=1)           # -> [0.8, 0.8, 0.8, 0.1, 0.2, 0.0]
print("sum similarity to liked items:", np.round(t06_scores, 2).tolist())

t06_scores[t06_liked] = -np.inf                               # -> [-inf, -inf, 0.8, 0.1, 0.2, 0.0]
print("scores after masking liked items:", t06_scores.tolist())

t06_recs = np.argsort(-t06_scores)[:3]                        # -> [2, 4, 3]
print("item-item CF top-3:", t06_recs.tolist())
assert t06_recs.tolist() == [2, 4, 3]

plt.figure(figsize=(5, 3))
plt.bar(range(6), np.nan_to_num(t06_scores, neginf=0.0), color=GREEN)
plt.xlabel("candidate item")
plt.ylabel("sum sim to liked")
plt.title("item-item CF score = similarity sum")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: candidate item 2 ties each liked item strongly enough to win after items 0 and 1 "
   "are masked out.")

md(r"""
## ✍️ Toy 7 · cold-start item has no CF neighbors

A brand-new item is an all-zero column: nobody has interacted with it. Its norm is zero, so cosine
similarity to every existing item becomes zero after safe division.
""")
code(r"""
t07_rng = np.random.default_rng(0)
print("rng seed:", 0)

t07_R = np.array([[1., 0., 1., 0., 0., 0.],
                  [0., 1., 1., 0., 0., 0.],
                  [0., 0., 0., 1., 1., 0.],
                  [1., 0., 0., 0., 1., 0.]])                 # -> item 5 is cold (all zeros)
print("interaction matrix with cold item 5:\n", t07_R.astype(int))

t07_new = 5                                                   # -> cold item id
print("cold item id:", t07_new)

t07_item_norms = np.linalg.norm(t07_R, axis=0)                # -> [1.414, 1.0, 1.414, 1.0, 1.414, 0.0]
print("item norms:", np.round(t07_item_norms, 3).tolist())

t07_dot_to_new = t07_R.T @ t07_R[:, t07_new]                  # -> [0., 0., 0., 0., 0., 0.]
print("dot with cold item:", t07_dot_to_new.tolist())

t07_den = t07_item_norms * t07_item_norms[t07_new]            # -> [0., 0., 0., 0., 0., 0.]
print("cosine denominators:", t07_den.tolist())

t07_sim = np.divide(t07_dot_to_new, t07_den, out=np.zeros_like(t07_dot_to_new), where=t07_den > 0)  # -> all zeros
print("safe cosine to cold item:", t07_sim.tolist())
assert np.allclose(t07_sim, 0.0)

plt.figure(figsize=(5, 3))
plt.bar(range(6), t07_sim, color=GRAY)
plt.xlabel("existing item")
plt.ylabel("similarity to cold item")
plt.title("CF cold-start: all similarities are zero")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: item 5 has zero interactions, zero norm, and zero similarity to every item, so "
   "pure CF cannot recommend it.")

md(r"""
## ✍️ Toy 8 · one BPR matrix-factorization update

Matrix factorization learns user/item vectors. For one observed positive item and one sampled
negative, BPR increases `score(user, positive)` and decreases `score(user, negative)`.
""")
code(r"""
t08_rng = np.random.default_rng(0)
print("rng seed:", 0)

t08_p = np.array([0.2, 0.1])                                  # -> user vector (2 dims)
t08_q_pos = np.array([0.4, 0.3])                              # -> positive item vector
t08_q_neg = np.array([0.1, 0.5])                              # -> negative item vector
print("user vector p:", t08_p.tolist())
print("positive item q+:", t08_q_pos.tolist())
print("negative item q-:", t08_q_neg.tolist())

t08_pos_score = float(t08_p @ t08_q_pos)                      # -> 0.11000000000000001
print("positive score before:", round(t08_pos_score, 3))

t08_neg_score = float(t08_p @ t08_q_neg)                      # -> 0.07
print("negative score before:", round(t08_neg_score, 3))

t08_diff = t08_pos_score - t08_neg_score                      # -> 0.04000000000000001
print("score difference before:", round(t08_diff, 3))

t08_sig = 1 / (1 + np.exp(t08_diff))                           # -> 0.4900013331200346
print("BPR gradient weight:", round(float(t08_sig), 3))

t08_lr = 0.1                                                   # -> learning rate
t08_reg = 0.0                                                  # -> no regularization in the toy
print("learning rate:", t08_lr)

t08_old_p = t08_p.copy()                                       # -> [0.2, 0.1]
t08_old_q_pos = t08_q_pos.copy()                               # -> [0.4, 0.3]
t08_old_q_neg = t08_q_neg.copy()                               # -> [0.1, 0.5]

t08_p = t08_old_p + t08_lr * t08_sig * (t08_old_q_pos - t08_old_q_neg)       # -> [0.2147, 0.0902]
t08_q_pos = t08_old_q_pos + t08_lr * t08_sig * t08_old_p                    # -> [0.4098, 0.3049]
t08_q_neg = t08_old_q_neg - t08_lr * t08_sig * t08_old_p                    # -> [0.0902, 0.4951]
print("updated user vector:", np.round(t08_p, 4).tolist())
print("updated positive vector:", np.round(t08_q_pos, 4).tolist())
print("updated negative vector:", np.round(t08_q_neg, 4).tolist())

t08_new_diff = float(t08_p @ (t08_q_pos - t08_q_neg))          # -> about 0.0515
print("score difference after:", round(t08_new_diff, 4))
assert t08_new_diff > t08_diff

plt.figure(figsize=(5, 3))
plt.bar(["before", "after"], [t08_diff, t08_new_diff], color=[GRAY, PURPLE])
plt.ylabel("score(pos) - score(neg)")
plt.title("BPR update pushes positive above negative")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: a single gradient step increases the positive-minus-negative score gap from "
   "0.04 to about 0.052, which is the core MF training move.")

md(r"""
## ✍️ Toy 9 · latent factors score and personalize top-k

After training, MF recommends by dot products. Different user vectors point toward different item
vectors, so the same catalog produces personalized top-k lists.
""")
code(r"""
t09_rng = np.random.default_rng(0)
print("rng seed:", 0)

t09_P = np.array([[1.0, 0.2],
                  [0.1, 1.0],
                  [0.8, 0.8]])                                # -> 3 user factors
t09_Q = np.array([[1.0, 0.0],
                  [0.8, 0.2],
                  [0.0, 1.0],
                  [0.2, 0.9],
                  [0.7, 0.7],
                  [0.1, 0.1]])                                # -> 6 item factors
print("user factors:\n", t09_P)
print("item factors:\n", t09_Q)

t09_scores = t09_P @ t09_Q.T                                  # -> 3×6 predicted score matrix
print("predicted scores:\n", np.round(t09_scores, 2))

t09_seen = {0: [0], 1: [2], 2: [4]}                            # -> hide already-seen items
print("seen items per user:", t09_seen)

t09_masked = t09_scores.copy()                                 # -> copy before masking
t09_masked[0, t09_seen[0]] = -np.inf                           # -> user 0 item 0 hidden
t09_masked[1, t09_seen[1]] = -np.inf                           # -> user 1 item 2 hidden
t09_masked[2, t09_seen[2]] = -np.inf                           # -> user 2 item 4 hidden
print("masked scores:\n", t09_masked)

t09_top2 = [np.argsort(-t09_masked[u])[:2].tolist() for u in range(3)]       # -> [[1, 4], [3, 4], [3, 1]]
print("personalized top-2 lists:", t09_top2)
assert t09_top2 == [[1, 4], [3, 4], [3, 1]]

plt.figure(figsize=(5, 3))
plt.imshow(t09_scores, cmap="viridis", aspect="auto")
plt.colorbar(label="dot product score")
plt.xlabel("items")
plt.ylabel("users")
plt.title("MF reconstruction: P @ Q.T")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: the score matrix is just `P @ Q.T`, and each user gets a different top-2 after "
   "seen items are masked.")

md(r"""
## ✍️ Toy 10 · PCA map from latent factors

The latent-factor map compresses learned item vectors to 2-D for visualization. By hand: center the
matrix, compute covariance, take eigenvectors, and project onto the top two directions.
""")
code(r"""
t10_rng = np.random.default_rng(0)
print("rng seed:", 0)

t10_X = np.array([[2., 0., 0.],
                  [3., 0., 0.],
                  [0., 2., 0.],
                  [0., 3., 0.],
                  [0., 0., 2.],
                  [0., 0., 3.]])                              # -> 6 item vectors, 3 dims
print("item factor matrix:\n", t10_X)

t10_mean = t10_X.mean(axis=0)                                  # -> [0.8333, 0.8333, 0.8333]
print("column mean:", np.round(t10_mean, 3).tolist())

t10_centered = t10_X - t10_mean                                # -> centered factors
print("centered factors first row:", np.round(t10_centered[0], 3).tolist())

t10_cov = (t10_centered.T @ t10_centered) / (len(t10_X) - 1)    # -> covariance matrix
print("covariance:\n", np.round(t10_cov, 3))

t10_vals, t10_vecs = np.linalg.eigh(t10_cov)                   # -> eigenvalues ascending
print("eigenvalues ascending:", np.round(t10_vals, 3).tolist())

t10_order = np.argsort(-t10_vals)                              # -> [2, 1, 0]
print("eigenvalue order descending:", t10_order.tolist())

t10_components = t10_vecs[:, t10_order[:2]]                    # -> top two principal directions
print("top-2 component matrix:\n", np.round(t10_components, 3))

t10_coords = t10_centered @ t10_components                     # -> 6×2 map coordinates
print("2-D PCA coordinates:\n", np.round(t10_coords, 3))
assert t10_coords.shape == (6, 2) and np.isclose(t10_vals.sum(), np.trace(t10_cov))

plt.figure(figsize=(4.5, 4))
plt.scatter(t10_coords[:, 0], t10_coords[:, 1], c=[0, 0, 1, 1, 2, 2], cmap="tab10", s=90)
for i, (x, y) in enumerate(t10_coords): plt.text(x + 0.03, y + 0.03, f"i{i}")
plt.xlabel("PC1")
plt.ylabel("PC2")
plt.title("PCA projects latent factors to a 2-D map")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: six 3-D item factors become a 2-D scatter by centering, eigendecomposing the "
   "covariance, and multiplying by the top components.")

md(r"""
## ✍️ Toy 11 · leave-one-out recall@k

Evaluation hides one known interaction per user, recommends from the remaining matrix, and asks
whether the hidden item appears in the top-k list.
""")
code(r"""
t11_rng = np.random.default_rng(0)
print("rng seed:", 0)

t11_R = np.array([[1, 1, 0, 0, 0, 0],
                  [0, 1, 1, 0, 0, 0],
                  [0, 0, 0, 1, 1, 0],
                  [1, 0, 0, 0, 1, 0]])                       # -> 4 users × 6 items
print("full interactions:\n", t11_R)

t11_test = {0: 1, 1: 2, 2: 4, 3: 0}                           # -> one held-out item per user
print("held-out item per user:", t11_test)

t11_Rtr = t11_R.copy()                                        # -> training copy
t11_Rtr[0, 1] = 0                                             # -> hide user 0's item 1
t11_Rtr[1, 2] = 0                                             # -> hide user 1's item 2
t11_Rtr[2, 4] = 0                                             # -> hide user 2's item 4
t11_Rtr[3, 0] = 0                                             # -> hide user 3's item 0
print("training matrix after holdout:\n", t11_Rtr)

t11_scores = np.array([[0.2, 0.9, 0.5, 0.1, 0.0, 0.3],
                       [0.1, 0.4, 0.8, 0.2, 0.3, 0.0],
                       [0.0, 0.2, 0.1, 0.4, 0.7, 0.6],
                       [0.6, 0.3, 0.2, 0.1, 0.9, 0.0]])       # -> model scores
print("model scores:\n", t11_scores)

t11_hits = []                                                 # -> collect hits per user
for t11_u in range(4):
    t11_s = t11_scores[t11_u].copy()                          # -> one user's scores
    t11_s[t11_Rtr[t11_u] == 1] = -np.inf                       # -> hide training positives
    t11_top2 = np.argsort(-t11_s)[:2].tolist()                 # -> top-2 recommendations
    t11_hit = int(t11_test[t11_u] in t11_top2)                 # -> 1 if held-out item found
    print(f"user {t11_u}: top2={t11_top2} held={t11_test[t11_u]} hit={t11_hit}")
    t11_hits.append(t11_hit)

t11_recall = np.mean(t11_hits)                                # -> 1.0
print("recall@2:", round(float(t11_recall), 3))
assert np.isclose(t11_recall, 1.0)

plt.figure(figsize=(5, 3))
plt.bar(range(4), t11_hits, color=GREEN)
plt.ylim(0, 1.1)
plt.xlabel("user")
plt.ylabel("held-out hit")
plt.title("leave-one-out recall@2 = average hits")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: each user's hidden item lands in that user's top-2, so recall@2 is 4/4 = 1.0.")

md(r"""
## ✍️ Toy 12 · model bake-off uses the same held-out test

A fair bake-off runs every model through the same holdout and metric. Here three tiny score tables
share the same four hidden items, then recall@2 is compared side by side.
""")
code(r"""
t12_rng = np.random.default_rng(0)
print("rng seed:", 0)

t12_Rtr = np.array([[1, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 1, 0]])                     # -> training positives after holdout
print("training matrix:\n", t12_Rtr)

t12_test = {0: 1, 1: 2, 2: 4, 3: 0}                           # -> same hidden items for all models
print("held-out items:", t12_test)

t12_model_scores = {
    "pop": np.array([[0.3, 0.6, 0.5, 0.4, 0.2, 0.1],
                     [0.3, 0.6, 0.5, 0.4, 0.2, 0.1],
                     [0.3, 0.6, 0.5, 0.4, 0.2, 0.1],
                     [0.3, 0.6, 0.5, 0.4, 0.2, 0.1]]),       # -> same ranking for everyone
    "cf":  np.array([[0.1, 0.9, 0.5, 0.2, 0.0, 0.3],
                     [0.1, 0.4, 0.8, 0.2, 0.3, 0.0],
                     [0.0, 0.2, 0.1, 0.4, 0.7, 0.6],
                     [0.6, 0.3, 0.2, 0.1, 0.9, 0.0]]),       # -> finds all held-out items
    "mf":  np.array([[0.1, 0.8, 0.7, 0.2, 0.0, 0.3],
                     [0.1, 0.3, 0.7, 0.2, 0.6, 0.0],
                     [0.0, 0.2, 0.1, 0.4, 0.9, 0.8],
                     [0.7, 0.3, 0.2, 0.1, 0.6, 0.0]])        # -> also finds all held-out items
}
print("models:", list(t12_model_scores))

t12_results = {}
for t12_name, t12_scores in t12_model_scores.items():
    t12_hits = []                                             # -> per-user hits for this model
    for t12_u in range(4):
        t12_s = t12_scores[t12_u].copy()                      # -> user scores
        t12_s[t12_Rtr[t12_u] == 1] = -np.inf                  # -> mask training positives
        t12_top2 = np.argsort(-t12_s)[:2].tolist()             # -> top-2 recommendations
        t12_hit = int(t12_test[t12_u] in t12_top2)             # -> held-out hit
        print(f"{t12_name} user {t12_u}: top2={t12_top2} hit={t12_hit}")
        t12_hits.append(t12_hit)
    t12_results[t12_name] = float(np.mean(t12_hits))           # -> model recall@2
print("recall@2 results:", t12_results)
assert t12_results == {"pop": 0.5, "cf": 1.0, "mf": 1.0}

plt.figure(figsize=(5, 3))
plt.bar(list(t12_results), list(t12_results.values()), color=[GOLD, BLUE, PURPLE])
plt.ylim(0, 1.1)
plt.ylabel("recall@2")
plt.title("bake-off: same test, same metric")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: popularity hits 2/4 hidden items, while the personalized score tables hit 4/4, "
   "which is exactly how the larger bake-off is read.")

md(r"""
## ✍️ Toy 13 · retrieve candidates, then rerank them

The funnel uses a cheap retriever to narrow the catalog, then a richer ranker reorders only those
candidates. This separates candidate generation from final decision-making.
""")
code(r"""
t13_rng = np.random.default_rng(0)
print("rng seed:", 0)

t13_mf_scores = np.array([0.10, 0.90, 0.80, 0.20, 0.70, 0.30, 0.60, 0.40])  # -> cheap retrieval scores for 8 items
print("retrieval scores:", t13_mf_scores.tolist())

t13_retrieved = np.argsort(-t13_mf_scores)[:4]                # -> [1, 2, 4, 6]
print("retrieved candidate ids:", t13_retrieved.tolist())

t13_fresh = np.array([0.0, 0.0, 0.05, 0.0, 0.25, 0.0, 0.0, 0.0])            # -> ranker-only freshness feature
print("freshness feature:", t13_fresh.tolist())

t13_rank_score = t13_mf_scores[t13_retrieved] + t13_fresh[t13_retrieved]    # -> [0.9, 0.85, 0.95, 0.6]
print("ranker scores on candidates:", np.round(t13_rank_score, 2).tolist())

t13_final = t13_retrieved[np.argsort(-t13_rank_score)[:2]]     # -> [4, 1]
print("final slate:", t13_final.tolist())
assert t13_final.tolist() == [4, 1]

plt.figure(figsize=(5, 3))
plt.bar(range(8), t13_mf_scores, color=GRAY, label="retrieval score")
plt.scatter(t13_retrieved, t13_mf_scores[t13_retrieved], s=150, facecolors="none", edgecolors=BLUE, linewidths=2, label="retrieved")
plt.scatter(t13_final, t13_mf_scores[t13_final], s=220, marker="*", color=GOLD, edgecolor="black", label="final")
plt.xlabel("item")
plt.ylabel("score")
plt.title("funnel: catalog → candidates → final slate")
plt.legend(); plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: item 4 was only third by retrieval score, but the ranker freshness boost moves it "
   "to the top of the final slate.")

md(r"""
## ✍️ Toy 14 · implicit zeros are sampled as negatives

In implicit feedback, a zero means "not observed," not "disliked." Training therefore samples a few
zeros as negatives for each positive instead of treating every zero as negative.
""")
code(r"""
t14_rng = np.random.default_rng(0)
print("rng seed:", 0)

t14_user_row = np.array([1, 0, 1, 0, 0, 0, 1, 0])              # -> 8 items, positives at 0,2,6
print("implicit user row:", t14_user_row.tolist())

t14_pos = np.where(t14_user_row == 1)[0]                      # -> [0, 2, 6]
print("positive item ids:", t14_pos.tolist())

t14_zero_pool = np.where(t14_user_row == 0)[0]                 # -> [1, 3, 4, 5, 7]
print("zero/unknown pool:", t14_zero_pool.tolist())

t14_sampled_neg = t14_rng.choice(t14_zero_pool, size=3, replace=False)       # -> deterministic sample [5, 7, 4]
print("sampled negatives:", t14_sampled_neg.tolist())

t14_training_pairs = [(int(p), int(n)) for p, n in zip(t14_pos, t14_sampled_neg)]  # -> [(0,5),(2,7),(6,4)]
print("positive-vs-negative pairs:", t14_training_pairs)

t14_all_zero_count = int(len(t14_zero_pool))                  # -> 5
print("all zeros count:", t14_all_zero_count)

t14_sample_count = int(len(t14_sampled_neg))                  # -> 3
print("sampled zero count:", t14_sample_count)
assert set(t14_sampled_neg).issubset(set(t14_zero_pool)) and t14_sample_count == len(t14_pos)

plt.figure(figsize=(6, 2.8))
plt.scatter(t14_pos, np.ones_like(t14_pos), s=180, color=GREEN, label="positive")
plt.scatter(t14_zero_pool, np.zeros_like(t14_zero_pool), s=90, color=GRAY, label="unknown zero")
plt.scatter(t14_sampled_neg, np.zeros_like(t14_sampled_neg), s=220, facecolors="none", edgecolors=RED, linewidths=2, label="sampled negative")
plt.yticks([0, 1], ["zero", "positive"])
plt.xlabel("item")
plt.title("negative sampling chooses a few zeros, not all zeros")
plt.legend(loc="center left", bbox_to_anchor=(1, 0.5)); plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: only three unknown zeros are sampled to pair with the three positives; the other "
   "zeros remain unknown, not explicit dislikes.")

md(r"""
## ✍️ Toy 15 · two-tower feature encoders and dot-product retrieval

A two-tower model maps user features and item features into the same vector space. Item vectors can
be precomputed offline; serving computes one user vector and dot products to retrieve items.
""")
code(r"""
t15_rng = np.random.default_rng(0)
print("rng seed:", 0)

t15_user_feat = np.array([1.0, 0.0, 0.5])                     # -> user features: tech, fitness, bias/pop taste
t15_item_feat = np.array([[1.0, 0.0, 0.2],
                          [0.0, 1.0, 0.8],
                          [1.0, 0.0, 0.7],
                          [0.0, 1.0, 0.1],
                          [0.5, 0.5, 0.4],
                          [0.0, 0.0, 1.0]])                 # -> 6 items × 3 features
print("user features:", t15_user_feat.tolist())
print("item features:\n", t15_item_feat)

t15_Wu = np.array([[1.0, 0.0],
                   [0.0, 1.0],
                   [0.2, 0.2]])                              # -> user tower weights, 3×2
t15_Wi = np.array([[1.0, 0.1],
                   [0.1, 1.0],
                   [0.2, 0.2]])                              # -> item tower weights, 3×2
print("user tower weights:\n", t15_Wu)
print("item tower weights:\n", t15_Wi)

t15_user_emb = t15_user_feat @ t15_Wu                         # -> [1.1, 0.1]
print("online user embedding:", np.round(t15_user_emb, 3).tolist())

t15_item_emb = t15_item_feat @ t15_Wi                          # -> precomputed 6×2 item embeddings
print("offline item embeddings:\n", np.round(t15_item_emb, 3))

t15_scores = t15_user_emb @ t15_item_emb.T                     # -> dot-product retrieval scores
print("retrieval scores:", np.round(t15_scores, 3).tolist())

t15_top3 = np.argsort(-t15_scores)[:3]                         # -> [2, 0, 4]
print("two-tower top-3:", t15_top3.tolist())
assert t15_top3.tolist() == [2, 0, 4]

plt.figure(figsize=(5, 4))
plt.scatter(t15_item_emb[:, 0], t15_item_emb[:, 1], s=90, color=GRAY, label="precomputed items")
plt.scatter(t15_item_emb[t15_top3, 0], t15_item_emb[t15_top3, 1], s=180, facecolors="none", edgecolors=GREEN, linewidths=2, label="top-3")
plt.scatter(t15_user_emb[0], t15_user_emb[1], marker="*", s=260, color=GOLD, edgecolor="black", label="user")
for i, (x, y) in enumerate(t15_item_emb): plt.text(x + 0.02, y + 0.02, f"i{i}")
plt.xlabel("tower dim 1")
plt.ylabel("tower dim 2")
plt.title("two-tower retrieval by dot product")
plt.legend(); plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: item embeddings are computed once, then the user's feature-derived vector scores "
   "all six items by dot product and retrieves `[2, 0, 4]`.")

md(r"""
## ✍️ Toy 16 · ANN cluster probing trades scans for recall

Approximate retrieval clusters item vectors, probes the nearest clusters to the query, and scores
only items inside those clusters. More probes scan more items and recover more of brute force.
""")
code(r"""
t16_rng = np.random.default_rng(0)
print("rng seed:", 0)

t16_emb = np.array([[0.0, 0.0],
                    [0.2, 0.1],
                    [0.0, 0.3],
                    [3.0, 3.0],
                    [3.2, 3.1],
                    [2.8, 3.2],
                    [6.0, 0.0],
                    [6.1, 0.2]])                              # -> 8 item vectors in 3 clusters
print("item embeddings:\n", t16_emb)

t16_centers = np.array([[0.1, 0.1],
                        [3.0, 3.1],
                        [6.05, 0.1]])                         # -> hand-set cluster centers
print("cluster centers:\n", t16_centers)

t16_cluster = np.argmin(((t16_emb[:, None, :] - t16_centers[None, :, :]) ** 2).sum(axis=2), axis=1)  # -> [0,0,0,1,1,1,2,2]
print("item cluster assignment:", t16_cluster.tolist())

t16_query = np.array([3.1, 3.0])                               # -> query near cluster 1
print("query vector:", t16_query.tolist())

t16_brute_dist = ((t16_emb - t16_query) ** 2).sum(axis=1)      # -> exact squared distances to all 8
print("brute distances:", np.round(t16_brute_dist, 2).tolist())

t16_brute_top3 = np.argsort(t16_brute_dist)[:3]                # -> [3, 4, 5]
print("brute top-3:", t16_brute_top3.tolist())

t16_center_dist = ((t16_centers - t16_query) ** 2).sum(axis=1) # -> distances to 3 centers
print("center distances:", np.round(t16_center_dist, 2).tolist())

t16_probe_order = np.argsort(t16_center_dist)                  # -> [1, 2, 0]
print("cluster probe order:", t16_probe_order.tolist())

t16_rows = []
for t16_nprobe in [1, 2]:
    t16_keep = np.isin(t16_cluster, t16_probe_order[:t16_nprobe])          # -> scanned item mask
    t16_scanned = np.where(t16_keep)[0]                                    # -> item ids scanned
    t16_ann_top3 = t16_scanned[np.argsort(t16_brute_dist[t16_scanned])[:3]] # -> best within scanned items
    t16_recall = len(set(t16_ann_top3.tolist()) & set(t16_brute_top3.tolist())) / 3
    print(f"nprobe={t16_nprobe}: scanned={t16_scanned.tolist()} ann_top3={t16_ann_top3.tolist()} recall={t16_recall:.2f}")
    t16_rows.append((t16_nprobe, len(t16_scanned), t16_recall))
assert t16_rows[0] == (1, 3, 1.0) and t16_rows[1] == (2, 5, 1.0)

plt.figure(figsize=(5, 4))
plt.scatter(t16_emb[:, 0], t16_emb[:, 1], c=t16_cluster, cmap="tab10", s=90)
plt.scatter(t16_centers[:, 0], t16_centers[:, 1], marker="X", s=200, color="black", label="centers")
plt.scatter(t16_query[0], t16_query[1], marker="*", s=260, color=GOLD, edgecolor="black", label="query")
plt.title("ANN: probe nearest clusters, scan their items")
plt.legend(); plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: one probe scans only the middle cluster's 3 items and already recovers the brute "
   "top-3; extra probes scan more items for safety.")

md(r"""
## ✍️ Toy 17 · sequential Markov transitions and the shuffle test

A sequential recommender estimates `P(next genre | current genre)`. Add-one smoothing avoids zeros,
then accuracy compares ordered sessions to the same sessions shuffled.
""")
code(r"""
t17_rng = np.random.default_rng(0)
print("rng seed:", 0)

t17_sessions = [[0, 1, 2, 2],
                [0, 1, 1, 2],
                [1, 2, 2, 0],
                [2, 0, 1, 2],
                [0, 1, 2, 0],
                [1, 2, 0, 1]]                                # -> 6 ordered sessions over 3 genres
print("ordered sessions:", t17_sessions)

t17_counts = np.ones((3, 3), dtype=float)                     # -> add-one smoothing starts with ones
print("initial smoothed counts:\n", t17_counts)

for t17_s in t17_sessions:
    for t17_a, t17_b in zip(t17_s[:-1], t17_s[1:]):
        t17_counts[t17_a, t17_b] += 1                         # -> count transition a→b
print("transition counts:\n", t17_counts)

t17_prob = t17_counts / t17_counts.sum(axis=1, keepdims=True) # -> row-normalized transition probabilities
print("transition probabilities:\n", np.round(t17_prob, 3))

t17_pred = np.argmax(t17_prob, axis=1)                        # -> most likely next genre from each current genre
print("predicted next genre per current genre:", t17_pred.tolist())

t17_hits = 0                                                  # -> ordered hits
t17_total = 0                                                 # -> ordered transitions
for t17_s in t17_sessions:
    for t17_a, t17_b in zip(t17_s[:-1], t17_s[1:]):
        t17_hits += int(t17_pred[t17_a] == t17_b)              # -> count correct next-genre predictions
        t17_total += 1                                        # -> count transitions
print("ordered hits / total:", t17_hits, "/", t17_total)

t17_ordered_acc = t17_hits / t17_total                        # -> 0.8333333333333334
print("ordered accuracy:", round(float(t17_ordered_acc), 3))

t17_shuffled = [list(t17_rng.permutation(t17_s)) for t17_s in t17_sessions] # -> deterministic shuffled sessions
print("shuffled sessions:", t17_shuffled)

t17_shuf_hits = 0                                             # -> shuffled hits using same learned predictor
t17_shuf_total = 0                                            # -> shuffled transitions
for t17_s in t17_shuffled:
    for t17_a, t17_b in zip(t17_s[:-1], t17_s[1:]):
        t17_shuf_hits += int(t17_pred[t17_a] == t17_b)         # -> count hits after destroying order
        t17_shuf_total += 1                                   # -> count shuffled transitions
print("shuffled hits / total:", t17_shuf_hits, "/", t17_shuf_total)

t17_shuf_acc = t17_shuf_hits / t17_shuf_total                 # -> 0.5555555555555556
print("shuffled accuracy:", round(float(t17_shuf_acc), 3))
assert t17_ordered_acc > t17_shuf_acc

plt.figure(figsize=(5, 3))
plt.bar(["ordered", "shuffled"], [t17_ordered_acc, t17_shuf_acc], color=[GREEN, GRAY])
plt.ylim(0, 1)
plt.ylabel("next-genre accuracy")
plt.title("shuffle test: order carries signal")
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: the learned transition rule predicts ordered next genres better than shuffled "
   "sessions, showing that sequence order carries intent.")

md(r"""
## ✍️ Toy 18 · semantic IDs from coarse code plus residual code

Generative retrieval can represent an item by a short discrete code. First choose a coarse cluster,
then quantize the residual left over from that coarse centroid; the pair is the semantic ID.
""")
code(r"""
t18_rng = np.random.default_rng(0)
print("rng seed:", 0)

t18_emb = np.array([[0.0, 0.0],
                    [0.2, 0.0],
                    [0.0, 0.2],
                    [3.0, 3.0],
                    [3.2, 3.0],
                    [3.0, 3.2]])                              # -> 6 item embeddings, 2 coarse groups
print("item embeddings:\n", t18_emb)

t18_coarse_centers = np.array([[0.0, 0.0],
                               [3.0, 3.0]])                  # -> coarse codebook
print("coarse centers:\n", t18_coarse_centers)

t18_coarse = np.argmin(((t18_emb[:, None, :] - t18_coarse_centers[None, :, :]) ** 2).sum(axis=2), axis=1)  # -> [0,0,0,1,1,1]
print("coarse code per item:", t18_coarse.tolist())

t18_resid = t18_emb - t18_coarse_centers[t18_coarse]           # -> residual after coarse code
print("residual vectors:\n", np.round(t18_resid, 2))

t18_resid_codebook = np.array([[0.0, 0.0],
                               [0.2, 0.0],
                               [0.0, 0.2]])                  # -> fine residual codebook
print("residual codebook:\n", t18_resid_codebook)

t18_fine = np.argmin(((t18_resid[:, None, :] - t18_resid_codebook[None, :, :]) ** 2).sum(axis=2), axis=1)  # -> [0,1,2,0,1,2]
print("fine residual code per item:", t18_fine.tolist())

t18_codes = [(int(a), int(b)) for a, b in zip(t18_coarse, t18_fine)]  # -> semantic IDs
print("semantic IDs:", t18_codes)

t18_generated_prefix = 1                                      # -> pretend generator emits coarse code 1
print("generated coarse prefix:", t18_generated_prefix)

t18_retrieved = np.where(t18_coarse == t18_generated_prefix)[0]       # -> [3, 4, 5]
print("items retrieved by prefix:", t18_retrieved.tolist())
assert t18_retrieved.tolist() == [3, 4, 5] and t18_codes[4] == (1, 1)

plt.figure(figsize=(5, 4))
plt.scatter(t18_emb[:, 0], t18_emb[:, 1], c=t18_coarse, cmap="tab10", s=100)
for i, (x, y) in enumerate(t18_emb): plt.text(x + 0.04, y + 0.04, f"i{i}:{t18_codes[i]}")
plt.scatter(t18_coarse_centers[:, 0], t18_coarse_centers[:, 1], marker="X", s=220, color="black", label="coarse centers")
plt.title("semantic ID = (coarse code, residual code)")
plt.legend(); plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: each item receives a two-part code like `(1, 2)`, and generating prefix `1` "
   "retrieves the semantic group `[3, 4, 5]`.")

md(r"""
## ✍️ Toy 19 · full family chart is just a shared metric table

The closing bake-off gathers every family's recall in one dictionary and plots the same metric. The
mechanic is simple but important: compare families only after they share the exact metric scale.
""")
code(r"""
t19_rng = np.random.default_rng(0)
print("rng seed:", 0)

t19_results = {"popularity": 0.25,
               "user-CF": 0.50,
               "item-CF": 0.50,
               "MF": 0.75,
               "two-tower": 0.75}                            # -> recall@2 values from one shared test
print("shared recall table:", t19_results)

t19_names = list(t19_results.keys())                          # -> model names in chart order
print("model names:", t19_names)

t19_values = np.array(list(t19_results.values()))              # -> [0.25, 0.5, 0.5, 0.75, 0.75]
print("recall values:", t19_values.tolist())

t19_best_idx = int(np.argmax(t19_values))                      # -> 3
print("best model index:", t19_best_idx)

t19_best_name = t19_names[t19_best_idx]                        # -> MF
print("best model name:", t19_best_name)

t19_floor = t19_results["popularity"]                         # -> 0.25
print("popularity floor:", t19_floor)

t19_lift = t19_results[t19_best_name] - t19_floor              # -> 0.5
print("best lift over popularity:", round(float(t19_lift), 2))
assert t19_best_name == "MF" and np.isclose(t19_lift, 0.5)

plt.figure(figsize=(6, 3))
plt.bar(t19_names, t19_values, color=[GOLD, BLUE, GREEN, PURPLE, RED])
plt.ylabel("recall@2")
plt.ylim(0, 1)
plt.title("full family bake-off: one metric scale")
plt.xticks(rotation=15)
plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: all families sit on the same recall axis, making the popularity floor and the "
   "best personalized lift easy to read.")

md(r"""
## ✍️ Toy 20 · content features rescue a cold-start item

Content/two-tower features can score a brand-new item with zero interactions. Build its vector from
metadata, score users by dot product, and check whether the top users match the item's genre.
""")
code(r"""
t20_rng = np.random.default_rng(0)
print("rng seed:", 0)

t20_user_pref = np.array([[1.0, 0.0],
                          [0.8, 0.2],
                          [0.1, 0.9],
                          [0.0, 1.0],
                          [0.6, 0.4],
                          [0.2, 0.8]])                       # -> 6 users, 2 genre preferences
print("user content features:\n", t20_user_pref)

t20_Wu = np.array([[1.0, 0.0],
                   [0.0, 1.0]])                              # -> identity user tower
print("user tower weights:\n", t20_Wu)

t20_Wi = np.array([[1.0, 0.0],
                   [0.0, 1.0]])                              # -> identity item tower
print("item tower weights:\n", t20_Wi)

t20_new_feat = np.array([0.0, 1.0])                           # -> brand-new fitness/item-genre-1 content
print("new item content feature:", t20_new_feat.tolist())

t20_new_interactions = 0                                      # -> cold item has no interactions
print("new item interactions:", t20_new_interactions)

t20_user_emb = t20_user_pref @ t20_Wu                         # -> user embeddings from content
print("user embeddings:\n", t20_user_emb)

t20_new_emb = t20_new_feat @ t20_Wi                           # -> new item embedding from content
print("new item embedding:", t20_new_emb.tolist())

t20_scores = t20_user_emb @ t20_new_emb                       # -> [0.0, 0.2, 0.9, 1.0, 0.4, 0.8]
print("content scores for new item:", np.round(t20_scores, 2).tolist())

t20_top3_users = np.argsort(-t20_scores)[:3]                  # -> [3, 2, 5]
print("top-3 users for new item:", t20_top3_users.tolist())

t20_fans = t20_user_pref[:, 1] > 0.7                          # -> [False, False, True, True, False, True]
print("genre-1 fans:", t20_fans.tolist())

t20_frac = np.mean(t20_fans[t20_top3_users])                  # -> 1.0
print("fraction of top-3 who are genre-1 fans:", round(float(t20_frac), 2))
assert t20_new_interactions == 0 and np.isclose(t20_frac, 1.0)

plt.figure(figsize=(5, 3))
plt.bar(range(6), t20_scores, color=GREEN)
plt.scatter(t20_top3_users, t20_scores[t20_top3_users], s=180, facecolors="none", edgecolors=RED, linewidths=2, label="top users")
plt.xlabel("user")
plt.ylabel("score for new item")
plt.title("content features rank a cold-start item on day one")
plt.legend(); plt.tight_layout(); plt.show()
""")
md("▶ What you'll see: even with zero interactions, the new genre-1 item scores highest for genre-1 "
   "fans `[3, 2, 5]`, solving the CF cold-start failure.")

# =================================================================== BASIC (10)
md("---\n# Basic (10) — the interaction matrix, CF, and MF")

md(r"""
## 1 · The user–item interaction matrix (and why it's mostly empty)

**Why:** every classic recommender starts from one object — a matrix `R` where
`R[u,i]=1` if member `u` interacted with item `i`. Visualizing it shows the central
challenge: it's **overwhelmingly zeros** (sparse), so most user–item opinions are
*unknown*, not *negative*. The whole game is filling in those blanks.
""")
code(r"""
plt.figure(figsize=(7,3.2))
plt.imshow(R[:60, :120], aspect="auto", cmap="Greys", interpolation="nearest")
plt.xlabel("items"); plt.ylabel("users (first 60)")
plt.title(f"interaction matrix — {sparsity:.0%} empty (unknown, not disliked)")
plt.tight_layout(); plt.show()
""")

md(r"""
## 2 · Popularity baseline — the bar every model must clear

**Why:** before anything clever, rank items by how often they're consumed. It ignores
personalization, but it's shockingly hard to beat on head items, so it's the honest
baseline. If your fancy model can't beat popularity on held-out recall, it isn't
learning taste.
""")
code(r"""
pop_score = R.sum(0)                       # column sums = item popularity
top_pop = np.argsort(-pop_score)[:10]
print("top-10 popular items:", top_pop.tolist())

plt.figure(figsize=(6,3))
plt.bar(range(20), np.sort(pop_score)[::-1][:20], color=GOLD)
plt.xlabel("item rank"); plt.ylabel("interactions"); plt.title("popularity is power-law (few hits, long tail)")
plt.tight_layout(); plt.show()
""")

md(r"""
## 3 · User–user collaborative filtering — "people like you also liked…"

**Why:** the CF hypothesis is that **similar users like similar things**. We measure
similarity between users by the **cosine** of their interaction rows (angle between the
two 0/1 vectors — high when they overlap a lot, independent of how active each is).
Then to score an item for user `u`, we take a **similarity-weighted vote** of who else
interacted with it. Cosine (not raw overlap) is used so a hyper-active user doesn't
dominate every neighborhood.
""")
code(r"""
from sklearn.metrics.pairwise import cosine_similarity

user_sim = cosine_similarity(R)            # 200x200, cosine of interaction rows
np.fill_diagonal(user_sim, 0)              # a user is not their own neighbor

u = 0
scores = user_sim[u] @ R                    # weighted vote: sum_v sim(u,v) * R[v,i]
scores[R[u] == 1] = -np.inf                 # don't re-recommend seen items
recs = np.argsort(-scores)[:5]
print("user 0 fav genres:", [genres[g] for g in np.where(user_pref[0] > 0.2)[0]])
print("user-user CF recommends items:", recs.tolist(),
      "| their genres:", [genres[item_genre[i]] for i in recs])

plt.figure(figsize=(4.2,3.6))
plt.imshow(user_sim[:40, :40], cmap="viridis"); plt.colorbar(label="cosine similarity")
plt.title("user–user similarity (block = shared taste)"); plt.tight_layout(); plt.show()
""")

md(r"""
## 4 · Item–item collaborative filtering — the score formula, by hand

**Why:** item-item CF is what production CF usually means (item neighborhoods are more
stable than user ones and can be precomputed). The lesson's formula
$\text{score}(u,i)=\sum_{j\in I(u)} \text{sim}(i,j)\,r_{u,j}$ says: *an item is a good
rec if it's similar to items the user already liked.* We compute item–item cosine, then
score exactly by that sum.
""")
code(r"""
item_sim = cosine_similarity(R.T)          # 120x120 item-item cosine
np.fill_diagonal(item_sim, 0)

u = 0
liked = np.where(R[u] == 1)[0]             # I(u): items the user interacted with
score_i = item_sim[:, liked].sum(1)        # sum_j sim(i,j) for j in I(u)  (r_{u,j}=1)
score_i[R[u] == 1] = -np.inf
recs = np.argsort(-score_i)[:5]
print("user 0 liked genres:", [genres[item_genre[j]] for j in liked][:6], "...")
print("item-item CF recommends:", recs.tolist(),
      "| genres:", [genres[item_genre[i]] for i in recs])
""")

md(r"""
## 5 · What "cosine similarity" actually measures

**Why:** similarity is the whole engine of CF, so it's worth *seeing*. Two users who
like the same items point in nearly the **same direction** (small angle → cosine ≈ 1);
two with disjoint tastes are near-orthogonal (cosine ≈ 0). We show three 2-D vectors to
make the angle-not-magnitude idea concrete.
""")
code(r"""
a = np.array([3., 3.]); b = np.array([4., 3.5]); c = np.array([1., 4.])
def cos(x, y): return x @ y / (np.linalg.norm(x)*np.linalg.norm(y))
print(f"cos(a,b)={cos(a,b):.2f} (similar taste)   cos(a,c)={cos(a,c):.2f} (different)")

plt.figure(figsize=(4,4))
for v, col, name in [(a,BLUE,"a"),(b,GREEN,"b (like a)"),(c,RED,"c (unlike a)")]:
    plt.arrow(0,0,v[0],v[1],head_width=0.15,color=col,length_includes_head=True)
    plt.text(v[0]*1.05, v[1]*1.05, name, color=col)
plt.xlim(0,5); plt.ylim(0,5); plt.title("cosine = angle, not length"); plt.tight_layout(); plt.show()
""")

md(r"""
## 6 · Cold-start — why CF is blind to a brand-new item

**Why:** the failure mode you must be able to name. A newly launched item is an
**all-zero column** in `R` — nobody has interacted with it yet — so it has *no*
neighbors and *zero* similarity to anything. CF literally cannot recommend it. We insert
a new item and watch its similarity be zero to every other item.
""")
code(r"""
R_cold = np.hstack([R, np.zeros((n_users, 1), dtype=int)])   # append an all-zero new item
new_id = R_cold.shape[1] - 1
sims_to_new = cosine_similarity(R_cold.T)[new_id]
print(f"new item {new_id}: interactions={R_cold[:,new_id].sum()}, "
      f"max similarity to any item={np.nan_to_num(sims_to_new).max():.3f}")
print("=> CF gives it a score of 0 everywhere. Needs content features (example 20).")
""")

md(r"""
## 7 · Matrix factorization — learn latent factors with SGD

**Why:** CF only compares *observed* overlaps. MF instead compresses the matrix into a
small vector per user (`P[u]`) and per item (`Q[i]`) so that
$\hat r_{u,i}=P_u\!\cdot\!Q_i$. The coordinates are **latent factors** — learned taste
dimensions (roughly genre here). We train them by gradient descent on the observed
entries plus sampled negatives, so the dot product is high for real interactions and low
otherwise. This *generalizes past exact neighbors*: a user near a genre cluster scores
all items in it, even ones no similar user touched.
""")
code(r"""
K = 16                                       # latent dimension
P = rng.normal(0, 0.1, (n_users, K))
Q = rng.normal(0, 0.1, (n_items, K))
pos = np.argwhere(R == 1)                     # observed (user,item) pairs
lr, reg, epochs = 0.05, 0.02, 30
losses = []
for ep in range(epochs):
    rng.shuffle(pos)
    tot = 0.0
    for u, i in pos:
        j = rng.integers(n_items)             # a random negative item
        while R[u, j] == 1: j = rng.integers(n_items)
        # BPR: want score(u,i) > score(u,j)
        diff = P[u] @ (Q[i] - Q[j])
        sig = 1/(1+np.exp(diff))              # gradient weight
        P[u] += lr*(sig*(Q[i]-Q[j]) - reg*P[u])
        Q[i] += lr*(sig*P[u] - reg*Q[i])
        Q[j] += lr*(-sig*P[u] - reg*Q[j])
        tot += -np.log(1/(1+np.exp(-diff)))
    losses.append(tot/len(pos))
print("final BPR loss:", round(losses[-1], 3))
plt.figure(figsize=(5,3)); plt.plot(losses, color=PURPLE)
plt.xlabel("epoch"); plt.ylabel("BPR loss"); plt.title("MF learns by ranking positives above negatives"); plt.tight_layout(); plt.show()
""")

md(r"""
## 8 · The latent-factor map — do items self-organize by taste?

**Why:** the payoff of MF is that its learned item vectors should cluster by hidden
taste **without ever being told the genres**. We compress the 16-D item vectors to 2-D
(PCA) and color by true genre. Clean color clusters = MF recovered the structure.
""")
code(r"""
from sklearn.decomposition import PCA
Q2 = PCA(2).fit_transform(Q)
plt.figure(figsize=(5.5,4.2))
for g in range(n_genres):
    m = item_genre == g
    plt.scatter(Q2[m,0], Q2[m,1], s=22, label=genres[g])
plt.legend(fontsize=8); plt.title("learned item factors cluster by genre (unsupervised!)")
plt.xlabel("factor 1"); plt.ylabel("factor 2"); plt.tight_layout(); plt.show()
""")

md(r"""
## 9 · MF reconstruction — measurably personalized (not just popular)

**Why:** the real test of MF is whether it recommends *your* taste, not just globally
popular items. We measure, across **all** users, what fraction of each user's MF top-10
falls in their single **favorite** genre, and compare to the popularity baseline and to
random. MF should sit far above both — proof it reconstructs personal taste from the
factored matrix.
""")
code(r"""
def fav_share(score_fn):
    shares = []
    for u in range(n_users):
        fav = user_pref[u].argmax()
        s = np.asarray(score_fn(u), dtype=float); s[R[u] == 1] = -1e9
        top = np.argsort(-s)[:10]
        shares.append(np.mean(item_genre[top] == fav))
    return np.mean(shares)

mf_share   = fav_share(lambda u: P[u] @ Q.T)
pop_share  = fav_share(lambda u: R.sum(0))
rand_base  = np.mean([np.mean(item_genre == user_pref[u].argmax()) for u in range(n_users)])
print(f"fav-genre share in top-10 — MF {mf_share:.2f}  vs  popularity {pop_share:.2f}  vs  random {rand_base:.2f}")

plt.figure(figsize=(5,3))
plt.bar(["random","popularity","MF"], [rand_base, pop_share, mf_share], color=[GRAY, GOLD, PURPLE])
plt.ylabel("share of top-10 in user's fav genre")
plt.title("MF recommends YOUR taste, not just popular items"); plt.tight_layout(); plt.show()
""")

md(r"""
## 10 · MF top-k — different users, different lists

**Why:** personalization means *different people get different recommendations*. We take
three users with different favorite genres and print each one's MF top-8 (unseen items
only). The lists should lean toward each user's own taste — the whole point of learning a
per-user vector.
""")
code(r"""
# find three users with three different strong favorite genres
picked, seen = [], set()
for u in range(n_users):
    fav = user_pref[u].argmax()
    if user_pref[u, fav] > 0.6 and fav not in seen:
        picked.append(u); seen.add(fav)
    if len(picked) == 3: break

for u in picked:
    pred = P[u] @ Q.T; pred[R[u] == 1] = -np.inf
    recs = np.argsort(-pred)[:8]
    fav = genres[user_pref[u].argmax()]
    share = np.mean(item_genre[recs] == user_pref[u].argmax())
    print(f"user {u:>3} (fav={fav:<8}) top-8 genres: {[genres[item_genre[i]] for i in recs]}  "
          f"[{share:.0%} in fav]")
""")

# =================================================================== EASY (5)
md("---\n# Easy (5) — evaluate, compare, and the funnel")

md(r"""
## 11 · Proper evaluation — hold out interactions, measure recall@k

**Why:** you can't grade a recommender on data it trained on. We hide one known
interaction per user (leave-one-out), recommend from the rest, and ask: **was the hidden
item in the top-k?** Averaged over users, that's **recall@k** — the standard retrieval
metric. Doing this right is what separates a demo from a result.
""")
code(r"""
def leave_one_out(R, seed=0):
    rng = np.random.default_rng(seed)
    Rtr = R.copy(); test = {}
    for u in range(R.shape[0]):
        items = np.where(R[u] == 1)[0]
        if len(items) < 2: continue
        h = rng.choice(items); Rtr[u, h] = 0; test[u] = h
    return Rtr, test

def recall_at_k(score_fn, Rtr, test, k=10):
    hits = 0
    for u, held in test.items():
        s = np.asarray(score_fn(u, Rtr), dtype=float); s[Rtr[u] == 1] = -np.inf
        if held in np.argsort(-s)[:k]: hits += 1
    return hits/len(test)

Rtr, test = leave_one_out(R)
pop_s = Rtr.sum(0)
print("recall@10 — popularity:", round(recall_at_k(lambda u,Rt: pop_s.copy(), Rtr, test), 3))
""")

md(r"""
## 12 · Bake-off — popularity vs user-CF vs item-CF vs MF

**Why:** put the families on the same held-out test and read recall@10 side by side.
This is the moment the abstract "CF vs MF" becomes a number: personalization should beat
popularity, and MF (which generalizes) should be competitive with or beat neighborhood CF.
""")
code(r"""
from sklearn.metrics.pairwise import cosine_similarity

def train_mf(Rtr, K=16, epochs=25, lr=0.05, reg=0.02, seed=1):
    rng = np.random.default_rng(seed)
    P = rng.normal(0,0.1,(Rtr.shape[0],K)); Q = rng.normal(0,0.1,(Rtr.shape[1],K))
    pos = np.argwhere(Rtr==1)
    for _ in range(epochs):
        rng.shuffle(pos)
        for u,i in pos:
            j = rng.integers(Rtr.shape[1])
            while Rtr[u,j]==1: j = rng.integers(Rtr.shape[1])
            sig = 1/(1+np.exp(P[u]@(Q[i]-Q[j])))
            P[u]+=lr*(sig*(Q[i]-Q[j])-reg*P[u]); Q[i]+=lr*(sig*P[u]-reg*Q[i]); Q[j]+=lr*(-sig*P[u]-reg*Q[j])
    return P, Q

usim = cosine_similarity(Rtr); np.fill_diagonal(usim,0)
isim = cosine_similarity(Rtr.T); np.fill_diagonal(isim,0)
P,Q = train_mf(Rtr)
scorers = {
  "popularity":  lambda u,Rt: Rt.sum(0).astype(float),
  "user-CF":     lambda u,Rt: usim[u] @ Rt,
  "item-CF":     lambda u,Rt: isim[:, np.where(Rt[u]==1)[0]].sum(1),
  "MF":          lambda u,Rt: P[u] @ Q.T,
}
res = {name: recall_at_k(fn, Rtr, test, 10) for name,fn in scorers.items()}
print({k: round(v,3) for k,v in res.items()})
plt.figure(figsize=(5.5,3)); plt.bar(list(res), list(res.values()), color=[GOLD,BLUE,GREEN,PURPLE])
plt.ylabel("recall@10"); plt.title("recommender bake-off (higher = better)"); plt.tight_layout(); plt.show()
""")

md(r"""
## 13 · The retrieval→ranking funnel

**Why:** you can't run an expensive ranker on a million items per request. The funnel
uses a **cheap** model to retrieve a few hundred candidates, then a **richer** model to
rank just those. We simulate it: MF retrieves top-100, then a "ranker" (here MF score +
a freshness/popularity feature) reorders them. The point is the *shape*, not the ranker.
""")
code(r"""
u = 0
mf_scores = P[u] @ Q.T; mf_scores[Rtr[u]==1] = -np.inf
retrieved = np.argsort(-mf_scores)[:100]                     # cheap retrieval: 120 -> 100
fresh = rng.uniform(0, 0.3, size=n_items)                    # a feature only the ranker sees
rank_score = mf_scores[retrieved] + fresh[retrieved]        # richer ranking on the 100
final = retrieved[np.argsort(-rank_score)][:10]
print("retrieved candidates:", len(retrieved), "-> final slate:", final.tolist())
print("catalog", n_items, "-> retrieve 100 -> rank -> serve 10  (cost scales with candidates, not catalog)")
""")

md(r"""
## 14 · Implicit feedback + negative sampling

**Why:** a "no interaction" is **not** a dislike — the user may never have seen the item.
So we can't treat all zeros as negatives. Instead we **sample** a few negatives per
positive (as MF did in #7). Here we show why the sampling ratio matters: too few
negatives and the model barely learns to separate; more negatives sharpen the ranking.
""")
code(r"""
def train_eval(n_neg):
    rng = np.random.default_rng(2)
    P = rng.normal(0,0.1,(n_users,16)); Q = rng.normal(0,0.1,(n_items,16)); pos=np.argwhere(Rtr==1)
    for _ in range(20):
        rng.shuffle(pos)
        for u,i in pos:
            for _ in range(n_neg):
                j = rng.integers(n_items)
                while Rtr[u,j]==1: j=rng.integers(n_items)
                sig = 1/(1+np.exp(P[u]@(Q[i]-Q[j])))
                P[u]+=0.05*(sig*(Q[i]-Q[j])-0.02*P[u]); Q[i]+=0.05*sig*P[u]; Q[j]+=0.05*(-sig*P[u])
    return recall_at_k(lambda u,Rt: P[u]@Q.T, Rtr, test, 10)

ratios = [1,2,4,8]; r = [train_eval(n) for n in ratios]
print(dict(zip(ratios, [round(x,3) for x in r])))
plt.figure(figsize=(5,3)); plt.plot(ratios, r, "o-", color=GREEN)
plt.xlabel("negatives per positive"); plt.ylabel("recall@10"); plt.title("more (sampled) negatives sharpen ranking"); plt.tight_layout(); plt.show()
""")

md(r"""
## 15 · Two-tower retrieval — separate user & item encoders

**Why:** MF learns a vector per *id*; a **two-tower** model learns a function from
**features** to a vector, one tower per side. That's what lets it (a) generalize to new
ids from their features and (b) **precompute all item vectors offline** and only run the
user tower online. We train tiny linear towers (user-genre-pref → embedding, item-genre
one-hot → embedding) with the same BPR objective, then retrieve by dot product.
""")
code(r"""
# features: user = their genre-preference vector; item = one-hot genre + log-popularity
Uf = user_pref.copy()                                        # (200, 5)
If = np.zeros((n_items, n_genres+1)); If[np.arange(n_items), item_genre] = 1
If[:, -1] = np.log1p(item_pop)/np.log1p(item_pop).max()
Wu = rng.normal(0,0.3,(Uf.shape[1],8)); Wi = rng.normal(0,0.3,(If.shape[1],8))  # two towers
pos = np.argwhere(Rtr==1)
for _ in range(40):
    rng.shuffle(pos)
    for u,i in pos:
        j = rng.integers(n_items)
        while Rtr[u,j]==1: j=rng.integers(n_items)
        ue = Uf[u]@Wu; ie, je = If[i]@Wi, If[j]@Wi
        sig = 1/(1+np.exp(ue@(ie-je)))
        Wu += 0.02*np.outer(Uf[u], sig*(ie-je))
        Wi += 0.02*(np.outer(If[i], sig*ue) - np.outer(If[j], sig*ue))
item_emb = If @ Wi                                           # precompute ALL item vectors offline
def tt_score(u, Rt): return (Uf[u]@Wu) @ item_emb.T          # online: one user vector + dot products
print("two-tower recall@10:", round(recall_at_k(tt_score, Rtr, test, 10), 3))
print("item vectors are precomputed once; serving = 1 user-tower pass + a dot-product scan")
""")

# =================================================================== ADVANCED (5)
md("---\n# Advanced (5) — ANN, sequence, generative, and cold-start")

md(r"""
## 16 · ANN vs brute force — the retrieval speed/recall tradeoff

**Why:** dotting the user against *every* item vector is exact but O(catalog). At scale
you cluster items once (a coarse **inverted index**) and only scan the nearest few
clusters — approximate, but far fewer comparisons. We measure the tradeoff: how much
recall you keep vs how many items you actually scan (nprobe).
""")
code(r"""
from sklearn.cluster import KMeans
emb = item_emb                                     # from the two-tower
km = KMeans(8, n_init=5, random_state=0).fit(emb)
cluster = km.labels_
def brute(uvec): return np.argsort(-(uvec @ emb.T))[:10]
def ann(uvec, nprobe):
    cdist = uvec @ km.cluster_centers_.T
    keep = np.isin(cluster, np.argsort(-cdist)[:nprobe])
    idx = np.where(keep)[0]
    return idx[np.argsort(-(uvec @ emb[idx].T))[:10]], keep.sum()
rows=[]
for nprobe in [1,2,4,8]:
    ov, scan = [], []
    for u in range(n_users):
        uvec = Uf[u]@Wu; b=set(brute(uvec).tolist()); a,s=ann(uvec,nprobe)
        ov.append(len(b & set(a.tolist()))/10); scan.append(s)
    rows.append((nprobe, np.mean(ov), np.mean(scan)))
tbl = pd.DataFrame(rows, columns=["nprobe","recall_vs_brute","avg_items_scanned"]); print(tbl.round(2).to_string(index=False))
fig,ax=plt.subplots(figsize=(5,3)); ax.plot(tbl.avg_items_scanned, tbl.recall_vs_brute,"o-",color=RED)
ax.set_xlabel("items scanned (of 120)"); ax.set_ylabel("recall vs exact"); ax.set_title("ANN: scan less, keep most of the recall"); plt.tight_layout(); plt.show()
""")

md(r"""
## 17 · Sequential recommendation — when *order* carries intent

**Why:** CF/MF treat a user's history as an unordered **bag**. But `venue → catering →
photographer` implies a next step that the same items shuffled would not. We build a
first-order **Markov** transition matrix over genres from ordered sessions, then run the
**shuffle test**: if predicting the next item from the *last* one beats the bag model,
order carries signal; if shuffling destroys that gain, we've proven it.
""")
code(r"""
# build ordered sessions where the next genre depends on the current one (real sequential signal)
trans = np.array([[.5,.2,.1,.1,.1],[.1,.5,.2,.1,.1],[.1,.1,.5,.2,.1],[.1,.1,.1,.5,.2],[.2,.1,.1,.1,.5]])
sessions = []
for _ in range(600):
    g = rng.integers(n_genres); seq=[g]
    for _ in range(5): g = rng.choice(n_genres, p=trans[g]); seq.append(g)
    sessions.append(seq)

def next_acc(seqs):
    P = np.ones((n_genres,n_genres))                # learn transitions with add-1 smoothing
    for s in seqs:
        for a,b in zip(s[:-1], s[1:]): P[a,b]+=1
    P /= P.sum(1,keepdims=True)
    hits=tot=0
    for s in seqs:
        for a,b in zip(s[:-1], s[1:]):
            if P[a].argmax()==b: hits+=1
            tot+=1
    return hits/tot

ordered = next_acc(sessions)
shuffled = next_acc([list(rng.permutation(s)) for s in sessions])
print(f"next-genre accuracy — ordered: {ordered:.2f}   shuffled: {shuffled:.2f}")
plt.figure(figsize=(4.2,3)); plt.bar(["ordered","shuffled"], [ordered, shuffled], color=[GREEN, GRAY])
plt.ylabel("next-item accuracy"); plt.title("shuffle test: order carries real signal"); plt.tight_layout(); plt.show()
""")

md(r"""
## 18 · Generative retrieval — items as *semantic ID codes*

**Why:** generative recommenders (TIGER/HSTU) replace "search nearest vector" with
"**generate the item's code**." The trick is giving each item a short discrete **semantic
ID** so similar items share a prefix. We build 2-level codes by clustering item vectors
twice (a mini RQ-VAE): code = (coarse cluster, fine cluster). Then "generating" a coarse
code retrieves a whole semantic group — retrieval by generation, and prefixes give free
diversity/'control'.
""")
code(r"""
from sklearn.cluster import KMeans
c1 = KMeans(6, n_init=5, random_state=0).fit(item_emb)
codebook1 = c1.labels_
resid = item_emb - c1.cluster_centers_[codebook1]           # residual quantization
c2 = KMeans(4, n_init=5, random_state=1).fit(resid)
codebook2 = c2.labels_
codes = pd.DataFrame({"item":range(n_items), "genre":[genres[g] for g in item_genre],
                      "code":[f"({a},{b})" for a,b in zip(codebook1, codebook2)]})
print("example semantic IDs:\n", codes.head(8).to_string(index=False))
# "generate" a coarse code -> retrieve its items
g0 = codebook1[0]
print(f"\ngenerating coarse code {g0} retrieves items:",
      np.where(codebook1==g0)[0][:8].tolist(),
      "| dominant genre:", codes[codebook1==g0].genre.mode()[0])
plt.figure(figsize=(5.2,4))
plt.scatter(*PCA(2).fit_transform(item_emb).T, c=codebook1, cmap="tab10", s=22)
plt.title("semantic ID level-1 codes = clusters of similar items"); plt.tight_layout(); plt.show()
""")

md(r"""
## 19 · Full funnel bake-off — all families, one recall@10 chart

**Why:** the closing picture. Every family on the same held-out test, so the "pick per
use-case" decision is grounded in numbers, not vibes. Popularity is the floor;
personalization (CF/MF/two-tower) should clear it.
""")
code(r"""
allres = dict(res)                                          # popularity, user-CF, item-CF, MF from #12
allres["two-tower"] = recall_at_k(tt_score, Rtr, test, 10)
print({k: round(v,3) for k,v in allres.items()})
plt.figure(figsize=(6,3))
plt.bar(list(allres), list(allres.values()), color=[GOLD,BLUE,GREEN,PURPLE,RED])
plt.ylabel("recall@10"); plt.title("full recommender bake-off"); plt.xticks(rotation=15); plt.tight_layout(); plt.show()
""")

md(r"""
## 20 · Cold-start, solved — content features rescue the new item

**Why:** #6 showed CF is blind to a new item. The fix: represent items by **content**
(here their genre features), so a brand-new item inherits a vector from its metadata and
can be scored immediately — no interactions required. This is why hybrid/content models
own the cold-start regime.
""")
code(r"""
new_feat = np.zeros(n_genres+1); new_feat[2] = 1; new_feat[-1] = 0.0   # a new *fitness* item, 0 popularity
new_item_emb = new_feat @ Wi                                # content tower gives it a vector instantly
fitness_fans = [u for u in range(n_users) if user_pref[u,2] > 0.2]
scores = np.array([(Uf[u]@Wu) @ new_item_emb for u in range(n_users)])
top_users = np.argsort(-scores)[:10]
frac = np.mean([user_pref[u,2] > 0.2 for u in top_users])
print(f"new fitness item (0 interactions) is matched to users; "
      f"{frac:.0%} of its top-10 users are fitness fans")
print("CF scored it 0 everywhere (#6); the content tower places it correctly on day one.")
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## Recap — picking a family

- **Popularity:** the floor. Always compute it; be suspicious of models that don't beat it.
- **Neighborhood CF (user/item):** "similar users/items"; explainable, but **sparse &
  cold-start-blind** (all-zero rows/columns have no neighbors).
- **Matrix factorization:** latent factors via dot product; **generalizes past exact
  overlaps**, still needs interactions per id.
- **Two-tower:** learns *feature→vector* towers; **precompute item vectors, retrieve with
  ANN**; handles new ids from features.
- **Sequential:** when **order** changes intent (pass the shuffle test first).
- **Generative:** items as **semantic ID codes**, retrieval-by-generation; powerful but
  needs validity/diversity/serving controls.
- **Cold-start:** add **content/hybrid** features so new items get a vector on day one.

Rule of thumb: **retrieve cheap (CF/MF/two-tower) → rank rich**; add **sequence** only
when order pays for itself; reach for **generative** as a sequence-native research path.
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name":"python3","display_name":"Python 3"},
                   "language_info": {"name":"python"},
                   "colab": {"name":"M06 · RecSys Landscape","provenance":[],"toc_visible":True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M06-recsys-landscape.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
