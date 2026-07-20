#!/usr/bin/env python3
"""Generate afp/notebooks/M04-model-families.ipynb.

A runnable, self-contained Colab notebook for M4 (Model families): 10 basic +
5 easy + 5 advanced examples, each runnable with a matplotlib visualization,
covering linear/logistic, trees, bagging/RF, gradient boosting/GBDT, and MLPs,
plus the GBDT-vs-NN decision. Uses only Colab-preinstalled libraries
(pandas/numpy/scikit-learn/matplotlib) so it runs top-to-bottom with zero
installs.

Run: python3 tools/gen-m4-notebook.py
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
# M4 · Model Families — Hands-on Notebook

**Companion to curriculum lesson M4.** Runnable examples of every model family M4
discusses — **linear / logistic**, **decision trees**, **bagging / random forests**,
**gradient boosting (GBDT)**, and **neural nets (MLP)** — plus the **GBDT-vs-NN
decision**. Runs top-to-bottom in Google Colab with **no installs** (pandas, numpy,
scikit-learn, matplotlib only).

- **Basic (10):** linear reg · logistic reg · the interaction a line misses ·
  feature-cross fix · decision tree + splits · tree solves the interaction ·
  single-tree variance · bagging / random forest · gradient boosting · MLP
- **Easy (5):** GBDT depth sweep · learning-rate ↔ n_trees · tree vs RF vs GBDT
  bake-off · feature importance · extrapolation failure
- **Advanced (5):** entity embeddings for sparse IDs · family bake-off (AUC + cost) ·
  big-MLP-on-tiny-data overfit · calibration across families · decision-boundary gallery
""")

# ------------------------------------------------------------------- setup
md(r"""
## Setup — two datasets

1. **`df`** — a synthetic **ads** table whose click label has a genuine *interaction*:
   members in the **US** with **bid > 5** click much more. A purely additive linear
   model can't see that combination; trees / GBDT / MLP can.
2. **`X2, y2`** — a clean 2-D **XOR** set (label = one region *or* the other, not both)
   for drawing decision boundaries — the sharpest picture of each family's inductive bias.
""")
code(r"""
import numpy as np, pandas as pd, time
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"

rng = np.random.default_rng(0)
N = 4000
country = rng.choice(["US","IN","BR","GB","DE","FR","CA","AU"], size=N, p=[.32,.18,.12,.09,.08,.08,.07,.06])
device  = rng.choice(["ios","android","web"], size=N, p=[.45,.40,.15])
size    = rng.choice(["S","M","L"], size=N, p=[.5,.35,.15])
campaign = rng.integers(2000, 2000+300, size=N)          # 300 campaigns (high-card id)
bid     = np.round(rng.uniform(0.5, 12.0, size=N), 2)
spend   = np.round(rng.exponential(40, size=N), 2)

is_US = (country == "US").astype(float)
is_ios = (device == "ios").astype(float)
size_ord = pd.Series({"S":0.,"M":1.,"L":2.})[size].to_numpy()
# four interactions, all computable from the features the models see (FEATS):
inter1 = ((is_US == 1) & (bid > 5)).astype(float)         # US & high bid
inter2 = ((is_ios == 1) & (size_ord == 2)).astype(float)  # iOS & large creative
inter3 = ((size_ord == 0) & (spend > 60)).astype(float)   # small creative & high spend
inter4 = ((is_ios == 0) & (bid < 3)).astype(float)        # non-iOS & low bid
size_lift = pd.Series({"S":0.,"M":.4,"L":.8})[size].to_numpy()
logit = (-2.4 + 2.0*inter1 + 1.7*inter2 + 1.5*inter3 + 1.2*inter4
         + 0.04*bid + 0.003*spend + rng.normal(0, 0.30, N))
clicked = (rng.random(N) < 1/(1+np.exp(-logit))).astype(int)
# a continuous target for the linear-regression demo
value = np.round(5 + 1.2*bid + 0.02*spend + size_lift*2 + rng.normal(0, 2, N), 2)

FEATS = ["is_US", "is_ios", "size_ord", "bid", "spend"]   # tabular features (capture both interactions)
df = pd.DataFrame(dict(country=country, device=device, creative_size=size, campaign_id=campaign,
                       bid=bid, spend=spend, is_US=is_US, is_ios=is_ios, size_ord=size_ord,
                       clicked=clicked, value=value))
train, valid = train_test_split(df, test_size=0.25, random_state=0, stratify=df.clicked)

# 2-D XOR set for decision boundaries
n2 = 1500
x1, x2 = rng.uniform(0,1,n2), rng.uniform(0,1,n2)
y2 = ((x1 > 0.5) ^ (x2 > 0.5)).astype(int)
y2 = np.where(rng.random(n2) < 0.05, 1 - y2, y2)            # 5% label noise
X2 = np.c_[x1, x2]
X2tr, X2va, y2tr, y2va = train_test_split(X2, y2, test_size=0.3, random_state=0)

def plot_boundary(ax, model, title):
    xx, yy = np.meshgrid(np.linspace(0,1,200), np.linspace(0,1,200))
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    ax.contourf(xx, yy, Z, alpha=.25, cmap="coolwarm", levels=1)
    ax.scatter(X2va[:,0], X2va[:,1], c=y2va, cmap="coolwarm", s=8, edgecolors="none")
    ax.set_title(title, fontsize=10); ax.set_xticks([]); ax.set_yticks([])

print("df:", df.shape, "| click rate:", round(df.clicked.mean(),3))
print("XOR set:", X2.shape, "| positive rate:", round(y2.mean(),3))
df.head()
""")


md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full survey, here is **one tiny, hand-traceable toy example for each computing
mechanic** used by the model-family notebook: linear solves, logistic probabilities, AUC,
interactions, tree splits, bootstrapping, ensembles, boosting, classic family rules, MLP forward
passes, tuning gaps, embeddings, calibration, and boundary grids. Each toy uses a few small
numbers, prints every intermediate value, pins the result with an assert, and draws exactly one
picture.
""")

md(r"""
## ✍️ Toy 1 · linear regression normal equation

Linear regression fits an additive weighted sum. With a bias column, the closed-form solve is
$w=(X^TX)^{-1}X^Ty$; on this six-row dataset the exact weights are easy to check by hand.
""")
code(r"""
t1_X = np.array([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], dtype=float)  # -> 6 rows, 2 features
t1_y = np.array([1, 3, 5, 4, 6, 8], dtype=float)  # -> 1 + 2*x0 + 3*x1
print("X:", t1_X.tolist())
print("y:", t1_y.tolist())

t1_ones = np.ones((len(t1_X), 1))  # -> [[1], [1], [1], [1], [1], [1]]
t1_A = np.c_[t1_ones, t1_X]  # -> add bias column
print("design matrix [1,x0,x1]:", t1_A.tolist())

t1_xtx = t1_A.T @ t1_A  # -> [[6,6,3],[6,10,3],[3,3,3]]
t1_xty = t1_A.T @ t1_y  # -> [27,35,18]
print("X^T X:", t1_xtx.tolist())
print("X^T y:", t1_xty.tolist())

t1_w = np.linalg.solve(t1_xtx, t1_xty)  # -> [1,2,3]
t1_pred = t1_A @ t1_w  # -> [1,3,5,4,6,8]
t1_resid = t1_y - t1_pred  # -> [0,0,0,0,0,0]
print("weights [bias,w0,w1]:", np.round(t1_w, 3).tolist())
print("predictions:", np.round(t1_pred, 3).tolist())
print("residuals:", np.round(t1_resid, 3).tolist())
assert np.allclose(t1_w, [1, 2, 3])

plt.figure(figsize=(5, 3))
plt.plot(np.arange(len(t1_y)), t1_y, "o", label="actual")
plt.plot(np.arange(len(t1_pred)), t1_pred, "x", label="linear prediction")
plt.xlabel("row")
plt.ylabel("target")
plt.title("normal equation recovers the exact line")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the normal-equation pieces `X^T X` and `X^T y`, weights `[1,2,3]`, zero residuals, and predicted points sitting on the labels.")

md(r"""
## ✍️ Toy 2 · logistic sigmoid + log loss

Logistic regression first makes an additive score $z$, then turns it into a probability with the
sigmoid. Log loss is small for confident correct labels and large for confident mistakes.
""")
code(r"""
t2_X = np.array([[0, 0], [1, 0], [2, 0], [0, 2], [2, 2], [3, 2]], dtype=float)  # -> 6 rows, 2 features
t2_y = np.array([0, 0, 1, 0, 1, 1], dtype=float)  # -> binary labels
print("X:", t2_X.tolist())
print("y:", t2_y.astype(int).tolist())

t2_A = np.c_[np.ones(len(t2_X)), t2_X]  # -> add bias column
t2_w = np.array([-3, 1, 1], dtype=float)  # -> bias=-3, feature weights=1,1
t2_z = t2_A @ t2_w  # -> [-3,-2,-1,-1,1,2]
t2_p = 1 / (1 + np.exp(-t2_z))  # -> [0.047,0.119,0.269,0.269,0.731,0.881]
t2_loss_each = -(t2_y * np.log(t2_p) + (1 - t2_y) * np.log(1 - t2_p))  # -> [0.049,0.127,1.313,0.313,0.313,0.127]
t2_loss = t2_loss_each.mean()  # -> 0.374
print("scores z:", np.round(t2_z, 3).tolist())
print("sigmoid probabilities:", np.round(t2_p, 3).tolist())
print("per-row log loss:", np.round(t2_loss_each, 3).tolist())
print("mean log loss:", round(float(t2_loss), 3))
assert np.isclose(t2_loss, 0.3737047393690593)

t2_grid = np.linspace(-4, 4, 100)  # -> 100 score values
t2_curve = 1 / (1 + np.exp(-t2_grid))  # -> sigmoid curve
plt.figure(figsize=(5, 3))
plt.plot(t2_grid, t2_curve, color="green", label="sigmoid")
plt.scatter(t2_z, t2_p, c=t2_y, cmap="coolwarm", s=70, edgecolor="k", label="toy rows")
plt.xlabel("score z")
plt.ylabel("probability")
plt.title("logistic: score → sigmoid probability")
plt.legend()
plt.show()
""")
md("▶ What you'll see: scores `[-3,-2,-1,-1,1,2]`, their sigmoid probabilities, one large loss for a missed positive, and the S-shaped sigmoid curve.")

md(r"""
## ✍️ Toy 3 · AUC by pair counting

AUC asks: for every positive-negative pair, did the positive get the higher score? This is the
same ranking score used throughout the notebook bake-offs.
""")
code(r"""
t3_scores = np.array([0.90, 0.70, 0.60, 0.55, 0.30, 0.20], dtype=float)  # -> model scores for 6 rows
t3_y = np.array([1, 0, 1, 0, 1, 0], dtype=int)  # -> 3 positives, 3 negatives
print("scores:", t3_scores.tolist())
print("labels:", t3_y.tolist())

t3_pos = t3_scores[t3_y == 1]  # -> [0.9,0.6,0.3]
t3_neg = t3_scores[t3_y == 0]  # -> [0.7,0.55,0.2]
t3_wins = (t3_pos[:, None] > t3_neg[None, :]).astype(float)  # -> [[1,1,1],[0,1,1],[0,0,1]]
t3_auc = t3_wins.mean()  # -> 0.667
print("positive scores:", t3_pos.tolist())
print("negative scores:", t3_neg.tolist())
print("pairwise wins matrix:", t3_wins.astype(int).tolist())
print("AUC = wins / pairs:", round(float(t3_auc), 3))
assert np.isclose(t3_auc, 2 / 3)

t3_order = np.argsort(-t3_scores)  # -> [0,1,2,3,4,5]
plt.figure(figsize=(5, 3))
plt.bar(np.arange(len(t3_scores)), t3_scores[t3_order], color=np.where(t3_y[t3_order] == 1, "green", "lightgray"))
plt.xticks(np.arange(len(t3_scores)), [str(t3_i) for t3_i in t3_order])
plt.ylabel("score")
plt.xlabel("row id in ranked order")
plt.title("AUC counts positive-over-negative pairs")
plt.show()
""")
md("▶ What you'll see: 6 winning positive-negative pairs out of 9, so AUC is `0.667`, with positives highlighted in the ranked bar chart.")

md(r"""
## ✍️ Toy 4 · why marginal additive effects miss an interaction

If clicks happen only in the **US AND high-bid** corner, separate marginal lifts for `is_US` and
`high_bid` smear credit onto the wrong corners. This is the motivation for feature crosses and trees.
""")
code(r"""
t4_X = np.array([[0, 0], [0, 0], [0, 1], [0, 1], [1, 0], [1, 0], [1, 1], [1, 1]], dtype=float)  # -> [is_US, high_bid]
t4_y = (t4_X[:, 0] * t4_X[:, 1]).astype(float)  # -> [0,0,0,0,0,0,1,1]
print("[is_US, high_bid]:", t4_X.astype(int).tolist())
print("true interaction label:", t4_y.astype(int).tolist())

t4_base = t4_y.mean()  # -> 0.25
t4_us_lift = t4_y[t4_X[:, 0] == 1].mean() - t4_base  # -> 0.25
t4_bid_lift = t4_y[t4_X[:, 1] == 1].mean() - t4_base  # -> 0.25
t4_additive = t4_base + t4_us_lift * t4_X[:, 0] + t4_bid_lift * t4_X[:, 1]  # -> [0.25,0.25,0.5,0.5,0.5,0.5,0.75,0.75]
t4_flags = (t4_additive >= 0.5).astype(int)  # -> [0,0,1,1,1,1,1,1]
print("base click rate:", round(float(t4_base), 2))
print("US marginal lift:", round(float(t4_us_lift), 2))
print("high-bid marginal lift:", round(float(t4_bid_lift), 2))
print("additive scores:", np.round(t4_additive, 2).tolist())
print("additive >= 0.5 flags:", t4_flags.tolist())
assert int(((t4_flags == 1) & (t4_y == 0)).sum()) == 4

t4_heat = np.array([[t4_additive[(t4_X[:, 0] == 0) & (t4_X[:, 1] == 0)][0], t4_additive[(t4_X[:, 0] == 0) & (t4_X[:, 1] == 1)][0]],
                    [t4_additive[(t4_X[:, 0] == 1) & (t4_X[:, 1] == 0)][0], t4_additive[(t4_X[:, 0] == 1) & (t4_X[:, 1] == 1)][0]]])  # -> [[0.25,0.5],[0.5,0.75]]
plt.figure(figsize=(4, 3.5))
plt.imshow(t4_heat, cmap="YlOrRd", vmin=0, vmax=1)
plt.xticks([0, 1], ["low bid", "high bid"])
plt.yticks([0, 1], ["non-US", "US"])
for t4_i in range(2):
    for t4_j in range(2):
        plt.text(t4_j, t4_i, f"{t4_heat[t4_i, t4_j]:.2f}", ha="center", va="center")
plt.title("additive marginal scores smear the AND corner")
plt.colorbar(label="score")
plt.show()
""")
md("▶ What you'll see: marginal additive scoring gives `0.5` to two non-click corners, proving the interaction signal was smeared across separate features.")

md(r"""
## ✍️ Toy 5 · feature cross makes the interaction explicit

A feature cross computes the missing product. Once `US_and_high_bid = is_US * high_bid` exists, a
linear/logistic model can score only the true corner.
""")
code(r"""
t5_X = np.array([[0, 0], [0, 0], [0, 1], [0, 1], [1, 0], [1, 0], [1, 1], [1, 1]], dtype=float)  # -> [is_US, high_bid]
t5_y = (t5_X[:, 0] * t5_X[:, 1]).astype(int)  # -> [0,0,0,0,0,0,1,1]
t5_cross = (t5_X[:, 0] * t5_X[:, 1]).astype(int)  # -> [0,0,0,0,0,0,1,1]
t5_score = -0.5 + 1.0 * t5_cross  # -> [-0.5,-0.5,-0.5,-0.5,-0.5,-0.5,0.5,0.5]
t5_pred = (t5_score > 0).astype(int)  # -> [0,0,0,0,0,0,1,1]
print("cross feature:", t5_cross.tolist())
print("linear score using only the cross:", t5_score.tolist())
print("predicted labels:", t5_pred.tolist())
print("true labels:", t5_y.tolist())
assert np.array_equal(t5_pred, t5_y)

plt.figure(figsize=(5, 3))
plt.bar(np.arange(len(t5_cross)) - 0.18, t5_y, width=0.36, label="true label")
plt.bar(np.arange(len(t5_cross)) + 0.18, t5_pred, width=0.36, label="cross-model prediction")
plt.xlabel("row")
plt.ylabel("0/1")
plt.title("the cross isolates exactly the US & high-bid rows")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the cross column is 1 only for rows 6 and 7, and the simple linear score predicts the interaction labels exactly.")

md(r"""
## ✍️ Toy 6 · decision-tree Gini split

A tree tries candidate threshold splits and picks the one with the lowest weighted impurity. Here
`x0 <= 2.5` makes both child leaves pure.
""")
code(r"""
t6_X = np.array([[1, 1], [1, 2], [2, 1], [2, 2], [4, 1], [4, 2], [5, 1], [5, 2]], dtype=float)  # -> 8 rows, 2 features
t6_y = np.array([0, 0, 0, 0, 1, 1, 1, 1], dtype=int)  # -> low x0 is class 0, high x0 is class 1
print("X:", t6_X.tolist())
print("y:", t6_y.tolist())

def t6_weighted_gini(t6_labels, t6_mask):
    t6_total = len(t6_labels)
    t6_score = 0.0
    for t6_side in [t6_mask, ~t6_mask]:
        t6_part = t6_labels[t6_side]
        t6_p1 = t6_part.mean() if len(t6_part) else 0.0
        t6_gini = 2 * t6_p1 * (1 - t6_p1)
        t6_score = t6_score + len(t6_part) / t6_total * t6_gini
    return t6_score

t6_splits = [("x0<=1.5", t6_X[:, 0] <= 1.5), ("x0<=2.5", t6_X[:, 0] <= 2.5), ("x0<=4.5", t6_X[:, 0] <= 4.5), ("x1<=1.5", t6_X[:, 1] <= 1.5)]
t6_scores = []
for t6_name, t6_mask in t6_splits:
    t6_left = t6_y[t6_mask]
    t6_right = t6_y[~t6_mask]
    t6_score = t6_weighted_gini(t6_y, t6_mask)
    t6_scores.append(t6_score)
    print(t6_name, "left", t6_left.tolist(), "right", t6_right.tolist(), "weighted Gini", round(float(t6_score), 3))
# -> scores [0.333, 0.000, 0.333, 0.500]
t6_best = int(np.argmin(t6_scores))  # -> 1
t6_best_name = t6_splits[t6_best][0]  # -> x0<=2.5
print("best split:", t6_best_name)
assert t6_best_name == "x0<=2.5"

plt.figure(figsize=(5, 3))
plt.bar([t6_name for t6_name, t6_mask in t6_splits], t6_scores, color="lightgray")
plt.bar(t6_best_name, t6_scores[t6_best], color="green")
plt.ylabel("weighted Gini")
plt.title("tree split search: lower impurity wins")
plt.xticks(rotation=20)
plt.show()
""")
md("▶ What you'll see: four candidate split scores, with `x0<=2.5` producing Gini `0.0`, so the tree picks that threshold.")

md(r"""
## ✍️ Toy 7 · tree routing solves XOR boxes

XOR cannot be captured by one straight line, but a depth-2 tree routes through axis-aligned boxes:
first check `x0`, then check `x1` inside each side.
""")
code(r"""
t7_X = np.array([[0.2, 0.2], [0.3, 0.1], [0.8, 0.2], [0.9, 0.1], [0.2, 0.8], [0.1, 0.9], [0.8, 0.8], [0.9, 0.9]], dtype=float)  # -> 8 XOR points
t7_y = ((t7_X[:, 0] > 0.5) ^ (t7_X[:, 1] > 0.5)).astype(int)  # -> [0,0,1,1,1,1,0,0]
print("XOR points:", t7_X.tolist())
print("true XOR labels:", t7_y.tolist())

t7_right = t7_X[:, 0] > 0.5  # -> [False,False,True,True,False,False,True,True]
t7_high = t7_X[:, 1] > 0.5  # -> [False,False,False,False,True,True,True,True]
t7_left_leaf_pred = t7_high.astype(int)  # -> [0,0,0,0,1,1,1,1]
t7_right_leaf_pred = 1 - t7_high.astype(int)  # -> [1,1,1,1,0,0,0,0]
t7_pred = np.where(t7_right, t7_right_leaf_pred, t7_left_leaf_pred)  # -> [0,0,1,1,1,1,0,0]
print("x0 > 0.5 mask:", t7_right.tolist())
print("x1 > 0.5 mask:", t7_high.tolist())
print("tree predictions:", t7_pred.tolist())
assert np.array_equal(t7_pred, t7_y)

plt.figure(figsize=(4.5, 4))
plt.scatter(t7_X[:, 0], t7_X[:, 1], c=t7_pred, cmap="coolwarm", s=90, edgecolor="k")
plt.axvline(0.5, color="black", linestyle="--")
plt.axhline(0.5, color="black", linestyle="--")
plt.xlim(0, 1)
plt.ylim(0, 1)
plt.title("depth-2 tree boxes solve XOR")
plt.show()
""")
md("▶ What you'll see: two threshold lines carve four boxes; the tree predictions match the XOR labels exactly.")

md(r"""
## ✍️ Toy 8 · bootstrap resamples change a tree's first split

A single deep tree is high-variance because a bootstrap resample can make a different root split
look best. The seed is fixed, so the two sampled bags are reproducible.
""")
code(r"""
t8_X = np.array([[0.2, 0.2], [0.3, 0.1], [0.8, 0.2], [0.9, 0.1], [0.2, 0.8], [0.1, 0.9], [0.8, 0.8], [0.9, 0.9]], dtype=float)  # -> 8 XOR points
t8_y = ((t8_X[:, 0] > 0.5) ^ (t8_X[:, 1] > 0.5)).astype(int)  # -> [0,0,1,1,1,1,0,0]
t8_rng = np.random.default_rng(0)  # -> fixed toy seed
t8_boot = t8_rng.integers(0, len(t8_X), size=(6, len(t8_X)))  # -> deterministic bootstrap table
t8_idx_a = t8_boot[1]  # -> [1,6,5,7,4,4,7,5]
t8_idx_b = t8_boot[5]  # -> [3,0,0,0,0,5,4,5]
print("bootstrap A indices:", t8_idx_a.tolist())
print("bootstrap B indices:", t8_idx_b.tolist())

def t8_weighted_gini(t8_labels, t8_mask):
    t8_total = len(t8_labels)
    t8_score = 0.0
    for t8_side in [t8_mask, ~t8_mask]:
        t8_part = t8_labels[t8_side]
        t8_p1 = t8_part.mean() if len(t8_part) else 0.0
        t8_gini = 2 * t8_p1 * (1 - t8_p1)
        t8_score = t8_score + len(t8_part) / t8_total * t8_gini
    return t8_score

t8_choices = []
for t8_name, t8_idx in [("A", t8_idx_a), ("B", t8_idx_b)]:
    t8_sample_X = t8_X[t8_idx]
    t8_sample_y = t8_y[t8_idx]
    t8_gini_x0 = t8_weighted_gini(t8_sample_y, t8_sample_X[:, 0] > 0.5)
    t8_gini_x1 = t8_weighted_gini(t8_sample_y, t8_sample_X[:, 1] > 0.5)
    t8_choice = "x0" if t8_gini_x0 < t8_gini_x1 else "x1"
    t8_choices.append(t8_choice)
    print(f"bag {t8_name} labels", t8_sample_y.tolist(), "Gini x0", round(float(t8_gini_x0), 3), "Gini x1", round(float(t8_gini_x1), 3), "-> choose", t8_choice)
# -> bag A chooses x0; bag B chooses x1
assert t8_choices == ["x0", "x1"]

t8_fig, t8_ax = plt.subplots(1, 2, figsize=(7, 3.2))
for t8_axis, t8_idx, t8_title in zip(t8_ax, [t8_idx_a, t8_idx_b], ["bag A chooses x0", "bag B chooses x1"]):
    t8_axis.scatter(t8_X[t8_idx, 0], t8_X[t8_idx, 1], c=t8_y[t8_idx], cmap="coolwarm", s=70, edgecolor="k")
    t8_axis.axvline(0.5, color="black", linestyle="--", alpha=0.5)
    t8_axis.axhline(0.5, color="black", linestyle=":", alpha=0.5)
    t8_axis.set_xlim(0, 1)
    t8_axis.set_ylim(0, 1)
    t8_axis.set_title(t8_title)
plt.show()
""")
md("▶ What you'll see: two seeded bootstrap bags from the same 8 points; one favors an `x0` root split and the other favors `x1`.")

md(r"""
## ✍️ Toy 9 · bagging vote averages away variance

Bagging keeps several high-variance trees and averages their votes. A few individual mistakes are
overruled when the majority agrees.
""")
code(r"""
t9_y = np.array([0, 0, 1, 1, 0, 1], dtype=int)  # -> true labels for 6 rows
t9_tree1 = np.array([0, 0, 1, 1, 0, 1], dtype=int)  # -> tree 1 votes
t9_tree2 = np.array([0, 1, 1, 1, 0, 0], dtype=int)  # -> tree 2 votes
t9_tree3 = np.array([0, 0, 1, 0, 0, 1], dtype=int)  # -> tree 3 votes
t9_votes = np.vstack([t9_tree1, t9_tree2, t9_tree3])  # -> 3 trees x 6 rows
t9_vote_sum = t9_votes.sum(axis=0)  # -> [0,1,3,2,0,2]
t9_vote_prob = t9_vote_sum / 3  # -> [0,0.333,1,0.667,0,0.667]
t9_bag_pred = (t9_vote_prob >= 0.5).astype(int)  # -> [0,0,1,1,0,1]
print("true labels:", t9_y.tolist())
print("tree vote matrix:", t9_votes.tolist())
print("vote sums:", t9_vote_sum.tolist())
print("averaged probabilities:", np.round(t9_vote_prob, 3).tolist())
print("bagged predictions:", t9_bag_pred.tolist())
assert np.array_equal(t9_bag_pred, t9_y)

plt.figure(figsize=(5, 3))
plt.imshow(t9_votes, cmap="coolwarm", aspect="auto", vmin=0, vmax=1)
plt.yticks([0, 1, 2], ["tree1", "tree2", "tree3"])
plt.xticks(np.arange(6), [f"row {t9_i}" for t9_i in range(6)], rotation=30)
plt.title("bagging: majority vote per row")
plt.colorbar(label="vote for class 1")
plt.show()
""")
md("▶ What you'll see: tree 2 and tree 3 each make a mistake, but the averaged vote recovers all six labels.")

md(r"""
## ✍️ Toy 10 · bias-variance decomposition

The ensemble story is bias plus variance plus irreducible noise. Averaging predictions can shrink
variance even when each single model wiggles.
""")
code(r"""
t10_true = np.array([1, 2, 3, 4, 5, 6], dtype=float)  # -> true function on 6 points
t10_preds = np.array([[1, 2, 3, 5, 6, 7], [0, 2, 4, 4, 5, 6], [2, 3, 3, 4, 4, 6]], dtype=float)  # -> 3 fitted models
t10_mean_pred = t10_preds.mean(axis=0)  # -> [1,2.333,3.333,4.333,5,6.333]
t10_bias2 = ((t10_mean_pred - t10_true) ** 2).mean()  # -> 0.074
t10_variance_by_x = t10_preds.var(axis=0)  # -> [0.667,0.222,0.222,0.222,0.667,0.222]
t10_variance = t10_variance_by_x.mean()  # -> 0.370
t10_noise = 0.25  # -> irreducible label noise
t10_total = t10_bias2 + t10_variance + t10_noise  # -> 0.694
print("true values:", t10_true.tolist())
print("model predictions:", t10_preds.tolist())
print("mean prediction:", np.round(t10_mean_pred, 3).tolist())
print("bias^2:", round(float(t10_bias2), 3))
print("variance by x:", np.round(t10_variance_by_x, 3).tolist())
print("mean variance:", round(float(t10_variance), 3))
print("bias^2 + variance + noise:", round(float(t10_total), 3))
assert np.isclose(t10_total, 0.6944444444444444)

plt.figure(figsize=(5, 3))
plt.bar(["bias^2", "variance", "noise"], [t10_bias2, t10_variance, t10_noise], color=["gray", "purple", "gold"])
plt.ylabel("error component")
plt.title("bias-variance pieces on six points")
plt.show()
""")
md("▶ What you'll see: variance is the largest component here, which is exactly what bagging tries to reduce.")

md(r"""
## ✍️ Toy 11 · GBDT residual step + shrinkage

Gradient boosting starts with a simple prediction, computes residuals, fits a small tree to those
errors, and adds only a learning-rate-sized correction.
""")
code(r"""
t11_x = np.arange(6, dtype=float)  # -> [0,1,2,3,4,5]
t11_y = np.array([1, 1, 2, 4, 4, 5], dtype=float)  # -> regression target
t11_pred0 = np.full_like(t11_y, t11_y.mean())  # -> [2.833,2.833,2.833,2.833,2.833,2.833]
t11_resid0 = t11_y - t11_pred0  # -> [-1.833,-1.833,-0.833,1.167,1.167,2.167]
print("x:", t11_x.tolist())
print("y:", t11_y.tolist())
print("initial mean prediction:", np.round(t11_pred0, 3).tolist())
print("residuals:", np.round(t11_resid0, 3).tolist())

t11_left_mask = t11_x <= 2  # -> [True,True,True,False,False,False]
t11_left_value = t11_resid0[t11_left_mask].mean()  # -> -1.5
t11_right_value = t11_resid0[~t11_left_mask].mean()  # -> 1.5
t11_tree_correction = np.where(t11_left_mask, t11_left_value, t11_right_value)  # -> [-1.5,-1.5,-1.5,1.5,1.5,1.5]
t11_eta = 0.5  # -> learning rate
t11_pred1 = t11_pred0 + t11_eta * t11_tree_correction  # -> [2.083,2.083,2.083,3.583,3.583,3.583]
t11_resid1 = t11_y - t11_pred1  # -> [-1.083,-1.083,-0.083,0.417,0.417,1.417]
t11_mse0 = np.mean(t11_resid0 ** 2)  # -> 2.472
t11_mse1 = np.mean(t11_resid1 ** 2)  # -> 0.785
print("stump correction values:", t11_tree_correction.tolist())
print("updated prediction:", np.round(t11_pred1, 3).tolist())
print("new residuals:", np.round(t11_resid1, 3).tolist())
print("MSE before -> after:", round(float(t11_mse0), 3), "->", round(float(t11_mse1), 3))
assert t11_mse1 < t11_mse0

plt.figure(figsize=(5, 3))
plt.plot(t11_x, t11_y, "o-", label="target")
plt.plot(t11_x, t11_pred0, "--", label="start mean")
plt.plot(t11_x, t11_pred1, "s-", label="after one boosted stump")
plt.xlabel("x")
plt.ylabel("prediction")
plt.title("boosting adds a residual correction")
plt.legend()
plt.show()
""")
md("▶ What you'll see: one stump correction cuts MSE from `2.472` to `0.785` after multiplying by learning rate `0.5`.")

md(r"""
## ✍️ Toy 12 · learning-rate shrinkage needs more trees

A smaller learning rate takes smaller correction steps. With the same number of trees it moves more
slowly, which is why the notebook sweeps learning rate against number of trees.
""")
code(r"""
t12_target = np.array([2, 2, 1, -1, -2, -2], dtype=float)  # -> residual pattern to fit on 6 rows
t12_rates = np.array([0.5, 0.1], dtype=float)  # -> fast and slow shrinkage
print("target correction:", t12_target.tolist())
print("learning rates:", t12_rates.tolist())

t12_curves = []
for t12_eta in t12_rates:
    t12_pred = np.zeros_like(t12_target)
    t12_mses = []
    for t12_step in range(1, 5):
        t12_resid = t12_target - t12_pred
        t12_pred = t12_pred + t12_eta * t12_resid
        t12_mse = np.mean((t12_target - t12_pred) ** 2)
        t12_mses.append(t12_mse)
        print(f"eta={t12_eta:.1f} step={t12_step} pred={np.round(t12_pred, 3).tolist()} mse={t12_mse:.4f}")
    t12_curves.append(t12_mses)
# -> eta=0.5 MSEs [0.75,0.1875,0.0469,0.0117]; eta=0.1 MSEs [2.43,1.9683,1.5943,1.2914]
t12_curves = np.array(t12_curves)  # -> 2 x 4 table
assert t12_curves[0, -1] < t12_curves[1, -1]

plt.figure(figsize=(5, 3))
plt.plot([1, 2, 3, 4], t12_curves[0], "o-", label="eta=0.5")
plt.plot([1, 2, 3, 4], t12_curves[1], "o-", label="eta=0.1")
plt.xlabel("trees added")
plt.ylabel("MSE to target correction")
plt.title("smaller learning rate moves slower")
plt.legend()
plt.show()
""")
md("▶ What you'll see: after four corrections, `eta=0.5` is nearly done while `eta=0.1` still has large residual error.")

md(r"""
## ✍️ Toy 13 · SVM margin and hinge loss

An SVM scores a point by distance to a separating hyperplane. Hinge loss is zero when the signed
margin is at least 1 and positive inside the margin.
""")
code(r"""
t13_X = np.array([[0, 1], [1, 0], [1, 1], [2, 1], [3, 1], [1, 3]], dtype=float)  # -> 6 points, 2 features
t13_y = np.array([-1, -1, -1, 1, 1, 1], dtype=float)  # -> SVM labels {-1,+1}
t13_w = np.array([1, 1], dtype=float)  # -> line normal
t13_b = -3.0  # -> decision line x0+x1-3=0
t13_score = t13_X @ t13_w + t13_b  # -> [-2,-2,-1,0,1,1]
t13_margin = t13_y * t13_score  # -> [2,2,1,0,1,1]
t13_hinge = np.maximum(0, 1 - t13_margin)  # -> [0,0,0,1,0,0]
print("scores:", t13_score.tolist())
print("signed margins y*z:", t13_margin.tolist())
print("hinge losses:", t13_hinge.tolist())
print("total hinge loss:", round(float(t13_hinge.sum()), 3))
assert np.isclose(t13_hinge.sum(), 1.0)

t13_line_x = np.array([0, 4], dtype=float)  # -> endpoints for plotting
plt.figure(figsize=(4.5, 4))
plt.scatter(t13_X[:, 0], t13_X[:, 1], c=t13_y, cmap="coolwarm", s=90, edgecolor="k")
plt.plot(t13_line_x, 3 - t13_line_x, "k-", label="margin center")
plt.plot(t13_line_x, 2 - t13_line_x, "k--", alpha=0.5, label="margin edges")
plt.plot(t13_line_x, 4 - t13_line_x, "k--", alpha=0.5)
plt.xlim(-0.2, 4)
plt.ylim(-0.2, 4)
plt.title("SVM: one point sits inside the margin")
plt.legend(fontsize=8)
plt.show()
""")
md("▶ What you'll see: all margins are at least 1 except one positive point with margin `0`, which contributes hinge loss `1`.")

md(r"""
## ✍️ Toy 14 · kNN distance vote

k-nearest neighbors stores the data and predicts from the labels of the closest points. The only
math is distance, sorting, and majority vote.
""")
code(r"""
t14_X = np.array([[0, 0], [1, 0], [0, 1], [4, 4], [5, 4], [4, 5], [2, 2]], dtype=float)  # -> 7 stored points
t14_y = np.array([0, 0, 0, 1, 1, 1, 0], dtype=int)  # -> labels
t14_q = np.array([3.6, 3.8], dtype=float)  # -> query point
t14_d2 = ((t14_X - t14_q) ** 2).sum(axis=1)  # -> [27.4,21.2,20.8,0.2,2.0,1.6,5.8]
t14_order = np.argsort(t14_d2)  # -> [3,5,4,6,2,1,0]
t14_top3 = t14_order[:3]  # -> [3,5,4]
t14_votes = np.bincount(t14_y[t14_top3], minlength=2)  # -> [0,3]
t14_pred = int(np.argmax(t14_votes))  # -> 1
print("squared distances:", np.round(t14_d2, 2).tolist())
print("nearest order:", t14_order.tolist())
print("top-3 ids:", t14_top3.tolist())
print("top-3 labels:", t14_y[t14_top3].tolist())
print("class votes:", t14_votes.tolist(), "prediction:", t14_pred)
assert t14_pred == 1

plt.figure(figsize=(4.5, 4))
plt.scatter(t14_X[:, 0], t14_X[:, 1], c=t14_y, cmap="coolwarm", s=80, edgecolor="k")
plt.scatter(t14_X[t14_top3, 0], t14_X[t14_top3, 1], facecolors="none", edgecolors="green", s=180, linewidths=2, label="3 nearest")
plt.scatter(*t14_q, marker="*", s=280, color="gold", edgecolor="k", label="query")
plt.title("kNN: vote among the closest three")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the query's three nearest points are all class 1, so kNN predicts class 1.")

md(r"""
## ✍️ Toy 15 · naive Bayes posterior

Naive Bayes multiplies per-feature likelihoods by the class prior. In log space, that becomes a
sum of log probabilities plus the log prior.
""")
code(r"""
t15_X = np.array([[2, 0], [1, 0], [2, 1], [0, 2], [0, 1], [1, 2]], dtype=float)  # -> counts for [free, meeting]
t15_y = np.array([1, 1, 1, 0, 0, 0], dtype=int)  # -> 1=spam, 0=ham
t15_q = np.array([1, 0], dtype=float)  # -> query has one 'free' token
print("word counts [free, meeting]:", t15_X.tolist())
print("labels:", t15_y.tolist())
print("query counts:", t15_q.tolist())

t15_prior_spam = (t15_y == 1).mean()  # -> 0.5
t15_prior_ham = (t15_y == 0).mean()  # -> 0.5
t15_spam_counts = t15_X[t15_y == 1].sum(axis=0)  # -> [5,1]
t15_ham_counts = t15_X[t15_y == 0].sum(axis=0)  # -> [1,5]
t15_spam_prob = (t15_spam_counts + 1) / (t15_spam_counts.sum() + 2)  # -> [0.75,0.25]
t15_ham_prob = (t15_ham_counts + 1) / (t15_ham_counts.sum() + 2)  # -> [0.25,0.75]
t15_log_spam = np.log(t15_prior_spam) + (t15_q * np.log(t15_spam_prob)).sum()  # -> -0.981
t15_log_ham = np.log(t15_prior_ham) + (t15_q * np.log(t15_ham_prob)).sum()  # -> -2.079
t15_unnorm = np.exp([t15_log_ham, t15_log_spam])  # -> [0.125,0.375]
t15_post = t15_unnorm / t15_unnorm.sum()  # -> [0.25,0.75]
print("priors ham/spam:", round(float(t15_prior_ham), 2), round(float(t15_prior_spam), 2))
print("spam word counts:", t15_spam_counts.tolist(), "prob:", t15_spam_prob.tolist())
print("ham word counts:", t15_ham_counts.tolist(), "prob:", t15_ham_prob.tolist())
print("log posterior scores ham/spam:", np.round([t15_log_ham, t15_log_spam], 3).tolist())
print("normalized posterior ham/spam:", np.round(t15_post, 3).tolist())
assert np.allclose(t15_post, [0.25, 0.75])

plt.figure(figsize=(5, 3))
plt.bar(["ham free", "ham meeting"], t15_ham_prob, color="lightgray", label="ham")
plt.bar(["spam free", "spam meeting"], t15_spam_prob, color="tomato", label="spam")
plt.ylabel("P(word | class)")
plt.title("naive Bayes likelihoods with Laplace smoothing")
plt.show()
""")
md("▶ What you'll see: the query word `free` has likelihood `0.75` under spam and `0.25` under ham, so the posterior is `[ham=0.25, spam=0.75]`.")

md(r"""
## ✍️ Toy 16 · MLP forward pass

A neural net composes linear layers with nonlinear activations. This tiny fixed MLP uses two ReLU
hidden units to detect whether two coordinates differ.
""")
code(r"""
t16_X = np.array([[0, 0], [1, 0], [0, 1], [1, 1], [2, 0], [0, 2]], dtype=float)  # -> 6 inputs, 2 dims
t16_W1 = np.array([[1, -1], [-1, 1]], dtype=float)  # -> hidden columns compute x0-x1 and x1-x0
t16_b1 = np.array([0, 0], dtype=float)  # -> no hidden bias
t16_W2 = np.array([1, 1], dtype=float)  # -> sum hidden activations
t16_b2 = -0.5  # -> output bias
t16_hidden_raw = t16_X @ t16_W1 + t16_b1  # -> [[0,0],[1,-1],[-1,1],[0,0],[2,-2],[-2,2]]
t16_hidden = np.maximum(0, t16_hidden_raw)  # -> [[0,0],[1,0],[0,1],[0,0],[2,0],[0,2]]
t16_z = t16_hidden @ t16_W2 + t16_b2  # -> [-0.5,0.5,0.5,-0.5,1.5,1.5]
t16_p = 1 / (1 + np.exp(-t16_z))  # -> [0.378,0.622,0.622,0.378,0.818,0.818]
t16_pred = (t16_p >= 0.5).astype(int)  # -> [0,1,1,0,1,1]
print("inputs:", t16_X.tolist())
print("hidden raw:", t16_hidden_raw.tolist())
print("hidden ReLU:", t16_hidden.tolist())
print("output scores:", t16_z.tolist())
print("probabilities:", np.round(t16_p, 3).tolist())
print("predictions:", t16_pred.tolist())
assert t16_pred.tolist() == [0, 1, 1, 0, 1, 1]

plt.figure(figsize=(4.5, 4))
plt.scatter(t16_X[:, 0], t16_X[:, 1], c=t16_pred, cmap="coolwarm", s=100, edgecolor="k")
for t16_i, t16_prob in enumerate(t16_p):
    plt.text(t16_X[t16_i, 0] + 0.04, t16_X[t16_i, 1] + 0.04, f"p={t16_prob:.2f}")
plt.xlabel("x0")
plt.ylabel("x1")
plt.title("fixed MLP forward pass")
plt.show()
""")
md("▶ What you'll see: linear hidden scores, ReLU activations, sigmoid probabilities, and predictions for six inputs — no training required.")

md(r"""
## ✍️ Toy 17 · depth/capacity sweep and overfit gap

The tuning plots compare train and validation metrics as capacity grows. Train can keep improving
while validation peaks and then falls.
""")
code(r"""
t17_depth = np.array([1, 2, 3, 4, 5, 6], dtype=int)  # -> candidate tree depths
t17_train_auc = np.array([0.62, 0.72, 0.83, 0.91, 0.97, 1.00], dtype=float)  # -> train keeps rising
t17_val_auc = np.array([0.60, 0.70, 0.80, 0.82, 0.78, 0.74], dtype=float)  # -> validation peaks then drops
t17_gap = t17_train_auc - t17_val_auc  # -> [0.02,0.02,0.03,0.09,0.19,0.26]
t17_best_idx = int(np.argmax(t17_val_auc))  # -> 3
t17_best_depth = int(t17_depth[t17_best_idx])  # -> 4
print("depths:", t17_depth.tolist())
print("train AUC:", t17_train_auc.tolist())
print("validation AUC:", t17_val_auc.tolist())
print("overfit gap:", np.round(t17_gap, 2).tolist())
print("best validation depth:", t17_best_depth)
assert t17_best_depth == 4 and t17_gap[-1] > t17_gap[0]

plt.figure(figsize=(5, 3))
plt.plot(t17_depth, t17_train_auc, "o-", label="train")
plt.plot(t17_depth, t17_val_auc, "o-", label="validation")
plt.axvline(t17_best_depth, color="black", linestyle="--", alpha=0.5)
plt.xlabel("max depth / capacity")
plt.ylabel("AUC")
plt.title("capacity sweep: validation picks the sweet spot")
plt.legend()
plt.show()
""")
md("▶ What you'll see: train AUC rises all the way to `1.00`, but validation peaks at depth `4` before the overfit gap opens.")

md(r"""
## ✍️ Toy 18 · family bake-off with an AUC-cost budget

The notebook compares families by quality and training cost. A simple decision rule is: among
models under the cost budget, pick the highest validation AUC.
""")
code(r"""
t18_names = np.array(["logistic", "tree", "random forest", "GBDT", "MLP", "kNN"])  # -> 6 candidate families
t18_auc = np.array([0.70, 0.76, 0.82, 0.86, 0.84, 0.78], dtype=float)  # -> validation AUC
t18_secs = np.array([0.1, 0.2, 1.2, 0.8, 3.0, 0.05], dtype=float)  # -> toy fit/query cost
t18_budget = 1.0  # -> max acceptable seconds
t18_feasible = t18_secs <= t18_budget  # -> [True,True,False,True,False,True]
t18_masked_auc = np.where(t18_feasible, t18_auc, -np.inf)  # -> hide over-budget families
t18_best_idx = int(np.argmax(t18_masked_auc))  # -> 3
t18_best_name = str(t18_names[t18_best_idx])  # -> GBDT
print("families:", t18_names.tolist())
print("validation AUC:", t18_auc.tolist())
print("cost seconds:", t18_secs.tolist())
print("under budget:", t18_feasible.tolist())
print("best under budget:", t18_best_name)
assert t18_best_name == "GBDT"

plt.figure(figsize=(5, 3.5))
plt.scatter(t18_secs, t18_auc, s=90, c=np.where(t18_feasible, "green", "lightgray"), edgecolor="k")
for t18_i, t18_name in enumerate(t18_names):
    plt.text(t18_secs[t18_i] + 0.04, t18_auc[t18_i], t18_name, fontsize=8)
plt.axvline(t18_budget, color="black", linestyle="--", label="budget")
plt.xlabel("cost seconds")
plt.ylabel("validation AUC")
plt.title("choose highest AUC under the cost budget")
plt.legend()
plt.show()
""")
md("▶ What you'll see: MLP has high AUC but is over budget; among feasible models, GBDT wins with AUC `0.86`.")

md(r"""
## ✍️ Toy 19 · feature importance from loss reductions

Tree ensembles report importance by adding up how much each split reduced impurity/loss, then
normalizing the totals.
""")
code(r"""
t19_features = np.array(["bid", "spend", "is_US"])  # -> 3 features
t19_split_feature = np.array([0, 2, 0, 1, 2, 0], dtype=int)  # -> feature used by each of 6 splits
t19_drop = np.array([0.30, 0.20, 0.10, 0.05, 0.15, 0.20], dtype=float)  # -> loss reduction per split
t19_totals = np.zeros(len(t19_features), dtype=float)  # -> [0,0,0]
np.add.at(t19_totals, t19_split_feature, t19_drop)  # -> [0.60,0.05,0.35]
t19_importance = t19_totals / t19_totals.sum()  # -> [0.60,0.05,0.35]
t19_order = np.argsort(t19_importance)  # -> [1,2,0]
print("split features:", t19_features[t19_split_feature].tolist())
print("loss drops:", t19_drop.tolist())
print("total drop by feature:", dict(zip(t19_features.tolist(), np.round(t19_totals, 2).tolist())))
print("normalized importance:", dict(zip(t19_features.tolist(), np.round(t19_importance, 2).tolist())))
assert t19_features[int(np.argmax(t19_importance))] == "bid"

plt.figure(figsize=(5, 3))
plt.barh(t19_features[t19_order], t19_importance[t19_order], color="gold")
plt.xlabel("normalized importance")
plt.title("feature importance = summed loss reduction")
plt.show()
""")
md("▶ What you'll see: `bid` receives 60% of the total loss reduction, so it is the most important toy feature.")

md(r"""
## ✍️ Toy 20 · extrapolation: line trends, tree leaf goes flat

Linear models keep extending their fitted slope. Trees predict a leaf average, so beyond the last
training region they stay flat.
""")
code(r"""
t20_x = np.array([0, 1, 2, 3, 4, 5], dtype=float)  # -> training x values
t20_y = 2 + 1.5 * t20_x  # -> [2,3.5,5,6.5,8,9.5]
t20_grid = np.array([4, 5, 6, 7, 8], dtype=float)  # -> includes extrapolation beyond 5
t20_linear_pred = 2 + 1.5 * t20_grid  # -> [8,9.5,11,12.5,14]
t20_last_leaf_mean = t20_y[t20_x >= 3].mean()  # -> 8.0
t20_tree_pred = np.where(t20_grid <= 2, t20_y[t20_x <= 2].mean(), t20_last_leaf_mean)  # -> [8,8,8,8,8]
print("train x:", t20_x.tolist())
print("train y:", t20_y.tolist())
print("prediction grid:", t20_grid.tolist())
print("linear predictions:", t20_linear_pred.tolist())
print("last tree leaf mean:", round(float(t20_last_leaf_mean), 2))
print("tree predictions:", t20_tree_pred.tolist())
assert t20_tree_pred[-1] == t20_tree_pred[0] and t20_linear_pred[-1] > t20_linear_pred[0]

plt.figure(figsize=(5, 3))
plt.scatter(t20_x, t20_y, color="gray", label="train")
plt.plot(t20_grid, t20_linear_pred, "o-", label="linear")
plt.plot(t20_grid, t20_tree_pred, "s-", label="tree leaf")
plt.axvline(5, color="black", linestyle="--", alpha=0.5)
plt.xlabel("x")
plt.ylabel("prediction")
plt.title("outside training range: trees go flat")
plt.legend()
plt.show()
""")
md("▶ What you'll see: after `x=5`, the linear prediction keeps rising to `14`, while the tree leaf stays flat at `8`.")

md(r"""
## ✍️ Toy 21 · sparse ID aggregation → dense SVD embedding

The notebook's embedding stand-in builds a campaign-by-context matrix and compresses it to a few
dense coordinates with SVD.
""")
code(r"""
t21_codes = np.array([0, 0, 1, 1, 2, 2, 3, 3], dtype=int)  # -> 8 rows mapped to 4 campaign IDs
t21_ctx = np.array([[1, 1, 0], [1, 0, 0], [0, 1, 1], [0, 1, 0], [1, 0, 1], [0, 0, 1], [0, 1, 0], [1, 1, 0]], dtype=float)  # -> 3 context counts
t21_agg = np.zeros((4, 3), dtype=float)  # -> campaign x context matrix starts at zero
np.add.at(t21_agg, t21_codes, t21_ctx)  # -> [[2,1,0],[0,2,1],[1,0,2],[1,2,0]]
t21_centered = t21_agg - t21_agg.mean(axis=0)  # -> center columns before SVD
t21_U, t21_S, t21_Vt = np.linalg.svd(t21_centered, full_matrices=False)  # -> singular values [2.121,1.732,0]
t21_emb = t21_U[:, :2] * t21_S[:2]  # -> 4 campaigns x 2 dense coordinates
print("campaign-context matrix:", t21_agg.tolist())
print("column means:", np.round(t21_agg.mean(axis=0), 3).tolist())
print("singular values:", np.round(t21_S, 3).tolist())
print("2-D embedding:", np.round(t21_emb, 3).tolist())
assert t21_emb.shape == (4, 2) and np.isclose(t21_S[2], 0.0)

plt.figure(figsize=(4.5, 4))
plt.scatter(t21_emb[:, 0], t21_emb[:, 1], s=100, color="purple")
for t21_i in range(4):
    plt.text(t21_emb[t21_i, 0] + 0.04, t21_emb[t21_i, 1] + 0.04, f"campaign {t21_i}")
plt.xlabel("SVD dim 1")
plt.ylabel("SVD dim 2")
plt.title("dense coordinates from sparse ID contexts")
plt.show()
""")
md("▶ What you'll see: an 8-row sparse-ID toy becomes a `4 x 3` context table, then a `4 x 2` dense embedding.")

md(r"""
## ✍️ Toy 22 · calibration reliability bins

Calibration checks whether predicted probabilities match observed frequencies inside bins. The
notebook draws this as a reliability curve.
""")
code(r"""
t22_prob = np.array([0.10, 0.20, 0.40, 0.45, 0.60, 0.65, 0.80, 0.90], dtype=float)  # -> predicted probabilities
t22_y = np.array([0, 0, 1, 0, 1, 0, 1, 1], dtype=int)  # -> observed labels
t22_bins = np.array([0.0, 0.5, 0.75, 1.0], dtype=float)  # -> 3 bins
print("predicted probabilities:", t22_prob.tolist())
print("labels:", t22_y.tolist())

t22_mean_pred = []
t22_frac_pos = []
for t22_i in range(len(t22_bins) - 1):
    t22_lo = t22_bins[t22_i]
    t22_hi = t22_bins[t22_i + 1]
    t22_lower = t22_prob >= t22_lo
    t22_upper = t22_prob < t22_hi if t22_i < len(t22_bins) - 2 else t22_prob <= t22_hi
    t22_mask = t22_lower & t22_upper
    t22_mean = t22_prob[t22_mask].mean()
    t22_frac = t22_y[t22_mask].mean()
    t22_mean_pred.append(t22_mean)
    t22_frac_pos.append(t22_frac)
    print(f"bin [{t22_lo:.2f},{t22_hi:.2f}] mean_pred={t22_mean:.3f} observed={t22_frac:.3f} rows={np.where(t22_mask)[0].tolist()}")
# -> mean_pred [0.288,0.625,0.850], observed [0.250,0.500,1.000]
t22_mean_pred = np.array(t22_mean_pred)  # -> [0.2875,0.625,0.85]
t22_frac_pos = np.array(t22_frac_pos)  # -> [0.25,0.5,1.0]
assert np.allclose(t22_frac_pos, [0.25, 0.5, 1.0])

plt.figure(figsize=(4, 4))
plt.plot([0, 1], [0, 1], "k--", label="perfect")
plt.plot(t22_mean_pred, t22_frac_pos, "o-", color="green", label="toy model")
plt.xlabel("mean predicted probability")
plt.ylabel("observed positive rate")
plt.title("calibration: predictions vs outcomes")
plt.legend()
plt.show()
""")
md("▶ What you'll see: each probability bin prints its mean prediction and observed click rate, then those pairs form a reliability curve.")

md(r"""
## ✍️ Toy 23 · decision-boundary grid by hand

A boundary plot makes a grid, applies a prediction rule to every grid point, reshapes the labels,
and colors the regions.
""")
code(r"""
t23_axis = np.array([0.0, 0.5, 1.0], dtype=float)  # -> 3 grid coordinates per axis
t23_xx, t23_yy = np.meshgrid(t23_axis, t23_axis)  # -> 3 x 3 grid
t23_grid = np.c_[t23_xx.ravel(), t23_yy.ravel()]  # -> 9 points, 2 dims
t23_score = t23_grid[:, 0] + t23_grid[:, 1] - 1.0  # -> linear decision scores
t23_pred = (t23_score >= 0).astype(int)  # -> [0,0,1,0,1,1,1,1,1]
t23_Z = t23_pred.reshape(t23_xx.shape)  # -> [[0,0,1],[0,1,1],[1,1,1]]
print("grid points:", t23_grid.tolist())
print("scores:", np.round(t23_score, 2).tolist())
print("flat predictions:", t23_pred.tolist())
print("reshaped boundary grid:", t23_Z.tolist())
assert t23_Z.shape == (3, 3) and int(t23_Z.sum()) == 6

plt.figure(figsize=(4, 4))
plt.contourf(t23_xx, t23_yy, t23_Z, alpha=0.35, cmap="coolwarm", levels=[-0.5, 0.5, 1.5])
plt.scatter(t23_grid[:, 0], t23_grid[:, 1], c=t23_pred, cmap="coolwarm", edgecolor="k", s=90)
plt.xlabel("x0")
plt.ylabel("x1")
plt.title("decision boundary = predictions on a grid")
plt.show()
""")
md("▶ What you'll see: nine grid points, their scores, a `3 x 3` prediction grid, and the corresponding colored decision regions.")

# =================================================================== BASIC (10)
md("---\n# Basic (10) — one family / concept per example")

md(r"""
## 1 · Linear regression — additive weighted sum (interpretable)

Predicts a **number** as $w_0+\sum_j w_j x_j$. Each coefficient is a clean
"per-unit" effect. Here we predict `value` from `bid` and `spend`.
""")
code(r"""
from sklearn.linear_model import LinearRegression

lin = LinearRegression().fit(train[["bid","spend"]], train["value"])
print("intercept:", round(lin.intercept_,2), "| coef(bid, spend):", np.round(lin.coef_,3))

plt.figure(figsize=(5,3))
plt.bar(["bid","spend"], lin.coef_, color=BLUE)
plt.title("Linear regression coefficients (per-unit effect on value)"); plt.show()
""")

md(r"""
## 2 · Logistic regression — score → probability

Wraps the same additive score in a sigmoid to output a **calibrated probability**
for a 0/1 label (pCTR). Coefficients stay interpretable.
""")
code(r"""
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

feats = ["bid","spend","is_US","is_ios","size_ord"]
lr = LogisticRegression(max_iter=1000).fit(train[feats], train.clicked)
auc = roc_auc_score(valid.clicked, lr.predict_proba(valid[feats])[:,1])
print("val AUC:", round(auc,3), "| coefs:", dict(zip(feats, np.round(lr.coef_[0],3))))

z = np.linspace(-6,6,200)
plt.figure(figsize=(5,3))
plt.plot(z, 1/(1+np.exp(-z)), color=GREEN, lw=2)
plt.title("sigmoid: linear score → probability"); plt.xlabel("score z"); plt.ylabel("p"); plt.show()
""")

md(r"""
## 3 · The interaction a line misses

Clicks jump only when **US *and* bid > 5** — a combination. A logistic model given
`country` and `bid` *separately* can't represent it. The 4-case truth table is XOR-like.
""")
code(r"""
truth = pd.DataFrame({"country":["US","US","IN","IN"], "bid":[3,7,3,7], "click_prone":["no","yes","no","no"]})
print(truth.to_string(index=False))

# logistic with only additive is_US and bid -> can't isolate the US&bid>5 cell
add = LogisticRegression(max_iter=1000).fit(train[["is_US","bid"]], train.clicked)
auc_add = roc_auc_score(valid.clicked, add.predict_proba(valid[["is_US","bid"]])[:,1])
print("additive logistic (is_US + bid) val AUC:", round(auc_add,3))

plt.figure(figsize=(5,3))
sub = valid.sample(400, random_state=1)
plt.scatter(sub.bid, sub.is_US + rng.normal(0,0.05,len(sub)), c=sub.clicked, cmap="coolwarm", s=12)
plt.axvline(5, color="k", ls="--"); plt.yticks([0,1], ["non-US","US"]); plt.xlabel("bid")
plt.title("clicks concentrate in the US & bid>5 corner"); plt.show()
""")

md(r"""
## 4 · Feature cross fixes the linear model

Hand the linear model the interaction as one column (`US_and_bid_gt_5`) and it can
represent the combination — AUC jumps.
""")
code(r"""
for d in (train, valid):
    d["US_and_bid_gt_5"] = ((d.is_US==1) & (d.bid>5)).astype(int)

feats2 = ["is_US","bid","US_and_bid_gt_5"]
crossed = LogisticRegression(max_iter=1000).fit(train[feats2], train.clicked)
auc_cross = roc_auc_score(valid.clicked, crossed.predict_proba(valid[feats2])[:,1])
print(f"additive AUC {auc_add:.3f}  ->  with cross {auc_cross:.3f}")

plt.figure(figsize=(4.5,3))
plt.bar(["additive","+ cross"], [auc_add, auc_cross], color=[GRAY, GREEN])
plt.ylim(0.5,1.0); plt.ylabel("val AUC"); plt.title("the cross recovers the interaction"); plt.show()
""")

md(r"""
## 5 · Decision tree — threshold splits (reads the interaction directly)

A tree splits on `bid > 5`, then on `country == US`, landing the click-prone case in
its own leaf — no hand-crafted cross needed.
""")
code(r"""
from sklearn.tree import DecisionTreeClassifier, plot_tree

tree = DecisionTreeClassifier(max_depth=3, random_state=0).fit(train[FEATS], train.clicked)
auc_tree = roc_auc_score(valid.clicked, tree.predict_proba(valid[FEATS])[:,1])
print("tree val AUC:", round(auc_tree,3))

plt.figure(figsize=(9,4))
plot_tree(tree, feature_names=FEATS, class_names=["no","click"],
          filled=True, impurity=False, fontsize=8, max_depth=2)
plt.title("first splits: bid, then is_US — the interaction, learned"); plt.show()
""")

md(r"""
## 6 · Tree vs line on XOR — the boundary picture

On the 2-D XOR set, a linear boundary is one diagonal (≈ chance); a tree carves
axis-aligned boxes that solve it.
""")
code(r"""
from sklearn.tree import DecisionTreeClassifier

fig, ax = plt.subplots(1, 2, figsize=(8,4))
plot_boundary(ax[0], LogisticRegression().fit(X2tr, y2tr), "logistic (one line — fails XOR)")
plot_boundary(ax[1], DecisionTreeClassifier(max_depth=4, random_state=0).fit(X2tr, y2tr), "decision tree (boxes — solves it)")
plt.show()
""")

md(r"""
## 7 · A single tree is high-variance

Refit a deep tree on two bootstrap resamples: the boundaries differ noticeably —
small data changes swing the splits. Motivates ensembles.
""")
code(r"""
fig, ax = plt.subplots(1, 2, figsize=(8,4))
for a, seed in zip(ax, [1, 2]):
    idx = np.random.default_rng(seed).integers(0, len(X2tr), len(X2tr))
    t = DecisionTreeClassifier(max_depth=6, random_state=0).fit(X2tr[idx], y2tr[idx])
    plot_boundary(a, t, f"deep tree on bootstrap #{seed}")
plt.suptitle("same model, different resample → different boundary (high variance)", y=1.02); plt.show()
""")

md(r"""
## 8 · Bagging / Random Forest — average away the variance

Many trees on resampled data + random feature subsets, averaged. The boundary
smooths and validation AUC becomes higher and more stable than one tree.
""")
code(r"""
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=300, random_state=0).fit(X2tr, y2tr)
one = DecisionTreeClassifier(max_depth=6, random_state=0).fit(X2tr, y2tr)
print("XOR val AUC — single tree:", round(roc_auc_score(y2va, one.predict_proba(X2va)[:,1]),3),
      "| random forest:", round(roc_auc_score(y2va, rf.predict_proba(X2va)[:,1]),3))

fig, ax = plt.subplots(1, 2, figsize=(8,4))
plot_boundary(ax[0], one, "single tree (jagged)")
plot_boundary(ax[1], rf, "random forest (smooth, averaged)")
plt.show()
""")

md(r"""
## 9 · Gradient boosting (GBDT) — sequential corrections

Boosting adds shallow trees one at a time, each fitting the current errors. Watch
validation AUC climb as trees accumulate on the ads data.
""")
code(r"""
from sklearn.ensemble import GradientBoostingClassifier

feats = FEATS
gb = GradientBoostingClassifier(n_estimators=200, max_depth=3, learning_rate=0.1, random_state=0)
gb.fit(train[feats], train.clicked)
staged = [roc_auc_score(valid.clicked, p[:,1]) for p in gb.staged_predict_proba(valid[feats])]
print("final GBDT val AUC:", round(staged[-1],3))

plt.figure(figsize=(5.5,3.2))
plt.plot(range(1, len(staged)+1), staged, color=PURPLE, lw=2)
plt.xlabel("number of boosting trees"); plt.ylabel("val AUC")
plt.title("each tree corrects the last → AUC climbs"); plt.show()
""")

md(r"""
## 10 · MLP (neural net) — learned nonlinear boundary

A small multilayer perceptron learns a smooth curved boundary on XOR — no
hand-crafted features, at the cost of more tuning.
""")
code(r"""
from sklearn.neural_network import MLPClassifier

mlp = MLPClassifier(hidden_layer_sizes=(16,16), max_iter=800, random_state=0).fit(X2tr, y2tr)
print("XOR val AUC — MLP:", round(roc_auc_score(y2va, mlp.predict_proba(X2va)[:,1]),3))
fig, ax = plt.subplots(figsize=(4.5,4))
plot_boundary(ax, mlp, "MLP — smooth learned boundary")
plt.show()
""")

# =================================================================== EASY (5)
md("---\n# Easy (5) — tune & compare")

md(r"""
## 11 · GBDT depth sweep — under- vs over-fitting

Depth controls interaction complexity per tree. Shallow underfits; too deep
memorizes — train AUC keeps rising while validation stalls or drops.
""")
code(r"""
feats = FEATS
rows = []
for depth in [1, 2, 3, 5, 8]:
    m = GradientBoostingClassifier(n_estimators=200, max_depth=depth, learning_rate=0.1, random_state=0).fit(train[feats], train.clicked)
    rows.append((depth, roc_auc_score(train.clicked, m.predict_proba(train[feats])[:,1]),
                        roc_auc_score(valid.clicked, m.predict_proba(valid[feats])[:,1])))
tbl = pd.DataFrame(rows, columns=["depth","train_AUC","val_AUC"]); print(tbl.round(3).to_string(index=False))
plt.figure(figsize=(5.5,3.2))
plt.plot(tbl.depth, tbl.train_AUC, "o-", color=BLUE, label="train")
plt.plot(tbl.depth, tbl.val_AUC, "o-", color=RED, label="validation")
plt.xlabel("max_depth"); plt.ylabel("AUC"); plt.legend(); plt.title("depth sweep: the overfitting gap opens up"); plt.show()
""")

md(r"""
## 12 · Learning rate ↔ number of trees

A smaller learning rate makes each correction tinier — it needs *more* trees but
usually gives a smoother, higher validation curve.
""")
code(r"""
feats = FEATS
plt.figure(figsize=(5.8,3.4))
for lr, c in [(0.3, RED), (0.1, PURPLE), (0.03, GREEN)]:
    m = GradientBoostingClassifier(n_estimators=300, max_depth=3, learning_rate=lr, random_state=0).fit(train[feats], train.clicked)
    staged = [roc_auc_score(valid.clicked, p[:,1]) for p in m.staged_predict_proba(valid[feats])]
    plt.plot(range(1,301), staged, color=c, label=f"lr={lr}")
plt.xlabel("trees"); plt.ylabel("val AUC"); plt.legend(); plt.title("small lr → needs more trees, smoother"); plt.show()
""")

md(r"""
## 13 · Single tree vs Random Forest vs GBDT — bake-off

Same tabular task, three tree-based options: averaging (RF) and boosting (GBDT)
both beat a lone tree.
""")
code(r"""
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
feats = FEATS
res = {
  "single tree": DecisionTreeClassifier(random_state=0),   # full depth → overfits noise
  "random forest": RandomForestClassifier(n_estimators=300, random_state=0),
  "GBDT": GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0),
}
aucs = {k: roc_auc_score(valid.clicked, v.fit(train[feats], train.clicked).predict_proba(valid[feats])[:,1]) for k,v in res.items()}
print({k: round(v,3) for k,v in aucs.items()})
plt.figure(figsize=(5,3)); plt.bar(list(aucs), list(aucs.values()), color=[GRAY,BLUE,PURPLE])
plt.ylim(0.5, max(aucs.values())+0.03); plt.ylabel("val AUC"); plt.title("ensembles beat a single tree"); plt.show()
""")

md(r"""
## 14 · Feature importance — a peek at interpretability

GBDT reports how much each feature reduced loss. The engineered interaction and
`bid` dominate — matching how we built the data.
""")
code(r"""
feats = FEATS + ["US_and_bid_gt_5"]
gb = GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0).fit(train[feats], train.clicked)
imp = pd.Series(gb.feature_importances_, index=feats).sort_values()
print(imp.round(3))
plt.figure(figsize=(5.5,3)); imp.plot(kind="barh", color=GOLD)
plt.title("GBDT feature importances"); plt.xlabel("importance"); plt.show()
""")

md(r"""
## 15 · Extrapolation — trees go flat, lines don't

Trees predict from leaf regions, so beyond the training range they output a
**constant**; a linear model keeps trending. Fit on x∈[0,5], predict to x=8.
""")
code(r"""
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import GradientBoostingRegressor
xr = np.sort(np.random.default_rng(1).uniform(0,5,120))
yr = 2 + 1.5*xr + np.random.default_rng(2).normal(0,1,120)
Xr = xr[:,None]; grid = np.linspace(0,8,300)[:,None]
lin = LinearRegression().fit(Xr, yr)
tre = DecisionTreeRegressor(max_depth=4, random_state=0).fit(Xr, yr)
gbr = GradientBoostingRegressor(n_estimators=200, max_depth=3, random_state=0).fit(Xr, yr)
plt.figure(figsize=(6,3.6))
plt.scatter(xr, yr, s=12, color=GRAY, label="train (x≤5)")
plt.axvline(5, color="k", ls=":")
plt.plot(grid, lin.predict(grid), color=BLUE, label="linear (extrapolates)")
plt.plot(grid, tre.predict(grid), color=RED, label="tree (flat beyond 5)")
plt.plot(grid, gbr.predict(grid), color=PURPLE, label="GBDT (flat beyond 5)")
plt.legend(fontsize=8); plt.title("beyond the training range, trees can't trend"); plt.show()
""")

# =================================================================== ADVANCED (5)
md("---\n# Advanced (5)")

md(r"""
## 16 · Entity embeddings for a high-cardinality id

One-hot `campaign_id` (300 sparse columns) vs a learned **dense** vector. Deep models
use `torch.nn.Embedding`; here a runnable stand-in (truncated SVD of a campaign×context
matrix) gives each campaign a 2-D coordinate — similar campaigns cluster.
""")
code(r"""
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import OneHotEncoder

ctx = OneHotEncoder(sparse_output=False).fit_transform(df[["country","device","creative_size"]])
codes, uniq = pd.factorize(df.campaign_id)
agg = np.zeros((len(uniq), ctx.shape[1])); np.add.at(agg, codes, ctx)
emb = TruncatedSVD(n_components=2, random_state=0).fit_transform(agg)
ctr = df.groupby("campaign_id").clicked.mean().reindex(uniq).to_numpy()
print("one-hot columns:", ctx.shape[1]+len(uniq), "-> dense embedding dims:", emb.shape[1])
plt.figure(figsize=(5.5,4))
sc = plt.scatter(emb[:,0], emb[:,1], c=ctr, cmap="viridis", s=16); plt.colorbar(sc, label="campaign CTR")
plt.title("2-D campaign embeddings (SVD stand-in for nn.Embedding)"); plt.show()
""")

md(r"""
## 17 · Family bake-off — AUC vs cost

Train all four families on the same task and compare validation AUC **and** fit time —
the GBDT-vs-NN decision, made concrete.
""")
code(r"""
from sklearn.preprocessing import StandardScaler
feats = FEATS
Xtr, Xva = train[feats].to_numpy(), valid[feats].to_numpy()
Xtr_s = StandardScaler().fit(Xtr); Xtr_z, Xva_z = Xtr_s.transform(Xtr), Xtr_s.transform(Xva)
models = {
  "logistic":     (LogisticRegression(max_iter=1000), Xtr_z, Xva_z),
  "randomforest": (RandomForestClassifier(n_estimators=300, random_state=0), Xtr, Xva),
  "GBDT":         (GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0), Xtr, Xva),
  "MLP":          (MLPClassifier(hidden_layer_sizes=(32,16), max_iter=600, random_state=0), Xtr_z, Xva_z),
}
rows = []
for name,(m,a,b) in models.items():
    t=time.time(); m.fit(a, train.clicked); dt=time.time()-t
    rows.append((name, round(roc_auc_score(valid.clicked, m.predict_proba(b)[:,1]),3), round(dt,3)))
tbl = pd.DataFrame(rows, columns=["family","val_AUC","fit_secs"]); print(tbl.to_string(index=False))
fig, ax = plt.subplots(1,2, figsize=(9,3.2))
ax[0].bar(tbl.family, tbl.val_AUC, color=[GREEN,BLUE,PURPLE,GOLD]); ax[0].set_ylim(0.5, tbl.val_AUC.max()+0.03); ax[0].set_title("val AUC")
ax[1].bar(tbl.family, tbl.fit_secs, color=[GREEN,BLUE,PURPLE,GOLD]); ax[1].set_title("fit time (s)")
for a in ax: a.tick_params(axis="x", rotation=15)
plt.show()
""")

md(r"""
## 18 · Big MLP on tiny data — overfitting

Give a large MLP only 60 rows: it drives train AUC to ~1.0 while validation lags —
too much flexibility for the data. GBDT is steadier on the same tiny sample.
""")
code(r"""
from sklearn.preprocessing import StandardScaler
feats = FEATS
tiny = train.sample(60, random_state=0)
sc = StandardScaler().fit(tiny[feats])
Xt, Xv = sc.transform(tiny[feats]), sc.transform(valid[feats])
big   = MLPClassifier(hidden_layer_sizes=(128,128,64), max_iter=1500, random_state=0).fit(Xt, tiny.clicked)
small = LogisticRegression(max_iter=1000).fit(Xt, tiny.clicked)
rows = [("big MLP (high capacity)", roc_auc_score(tiny.clicked, big.predict_proba(Xt)[:,1]),   roc_auc_score(valid.clicked, big.predict_proba(Xv)[:,1])),
        ("logistic (low capacity)", roc_auc_score(tiny.clicked, small.predict_proba(Xt)[:,1]), roc_auc_score(valid.clicked, small.predict_proba(Xv)[:,1]))]
tbl = pd.DataFrame(rows, columns=["model","train_AUC","val_AUC"]); print(tbl.round(3).to_string(index=False))
x = np.arange(2); w=0.35
plt.figure(figsize=(5.5,3))
plt.bar(x-w/2, tbl.train_AUC, w, color=BLUE, label="train"); plt.bar(x+w/2, tbl.val_AUC, w, color=RED, label="val")
plt.xticks(x, tbl.model, fontsize=8); plt.ylabel("AUC"); plt.legend()
plt.title("60 rows: the big MLP memorizes; the low-capacity model generalizes"); plt.show()
""")

md(r"""
## 19 · Calibration across families

A probability of 0.7 should mean "clicks ~70% of the time." Logistic tends to be
well-calibrated; RF/boosting often need calibration. Reliability curves show it.
""")
code(r"""
from sklearn.calibration import calibration_curve
feats = FEATS
fitted = {
  "logistic":     LogisticRegression(max_iter=1000).fit(train[feats], train.clicked),
  "randomforest": RandomForestClassifier(n_estimators=300, random_state=0).fit(train[feats], train.clicked),
  "GBDT":         GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0).fit(train[feats], train.clicked),
}
plt.figure(figsize=(5,4)); plt.plot([0,1],[0,1],"k--",label="perfect")
for (name,m),c in zip(fitted.items(), [GREEN,BLUE,PURPLE]):
    frac, mean = calibration_curve(valid.clicked, m.predict_proba(valid[feats])[:,1], n_bins=10)
    plt.plot(mean, frac, "o-", color=c, label=name)
plt.xlabel("predicted probability"); plt.ylabel("observed click rate"); plt.legend(); plt.title("reliability curves"); plt.show()
""")

md(r"""
## 20 · Decision-boundary gallery — inductive bias at a glance

The same XOR data through five families. Notice: logistic = one line (fails), tree =
boxes, RF/GBDT = smoother boxes, MLP = a smooth curve. This *is* "model family = a bet
about what patterns are easy to learn."
""")
code(r"""
gallery = {
  "logistic":     LogisticRegression().fit(X2tr, y2tr),
  "decision tree":DecisionTreeClassifier(max_depth=5, random_state=0).fit(X2tr, y2tr),
  "random forest":RandomForestClassifier(n_estimators=300, random_state=0).fit(X2tr, y2tr),
  "GBDT":         GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0).fit(X2tr, y2tr),
  "MLP":          MLPClassifier(hidden_layer_sizes=(16,16), max_iter=800, random_state=0).fit(X2tr, y2tr),
}
fig, ax = plt.subplots(1, 5, figsize=(15,3.1))
for a,(name,m) in zip(ax, gallery.items()):
    plot_boundary(a, m, f"{name}\nAUC {roc_auc_score(y2va, m.predict_proba(X2va)[:,1]):.2f}")
plt.show()
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## Recap — picking a family

- **Linear / logistic:** additive, interpretable, cheap; needs **feature crosses** for
  interactions. Great calibrated baseline.
- **Single tree:** captures thresholds & interactions automatically, but **high variance**.
- **Random forest (bagging):** averages many trees → variance down, strong & robust.
- **GBDT (boosting):** sequential corrections → usually the **best on tabular**; tune
  depth / learning-rate / n_trees; watch overfitting, weak **extrapolation**.
- **MLP / neural nets:** learn representations; shine on **sparse IDs (embeddings),
  text, sequences, images** and shared tasks; need more data, tuning, and serving care.

Rule of thumb: **medium tabular → start with GBDT**; **sparse/text/sequence or shared
representations → neural net**; always keep a **logistic baseline** for calibration and
interpretability.
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name":"python3","display_name":"Python 3"},
                   "language_info": {"name":"python"},
                   "colab": {"name":"M04 · Model Families","provenance":[],"toc_visible":True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M04-model-families.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
