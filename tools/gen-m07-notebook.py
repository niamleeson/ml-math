#!/usr/bin/env python3
"""Generate afp/notebooks/M07-ranking-ctr-family.ipynb.

A fully runnable, beginner-friendly Colab notebook that builds ONE complete
pCTR (predicted Click-Through Rate) model end-to-end on simple synthetic ad
data. GRANULAR version: small steps, lots of logging (we train a PyTorch
logistic-regression model with a loop that prints the loss as it learns), many
visualizations, and a set of proof graphs at the end.

Because the data is synthetic we know each impression's TRUE click probability
and the TRUE rule behind clicks, so we can prove the model recovered both.

Colab-preinstalled libraries only (pandas/numpy/scikit-learn/matplotlib/torch).

Run: python3 tools/gen-m07-notebook.py
"""
import json, os

cells = []
def md(t):   cells.append({"cell_type": "markdown", "metadata": {}, "source": t.strip("\n").splitlines(keepends=True)})
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": s.strip("\n").splitlines(keepends=True)})

# ------------------------------------------------------------------- intro
md(r"""
# M7 · Ranking & CTR — A Complete pCTR Model, Step by Tiny Step

**Companion to curriculum lesson M7. Written for someone brand new to ML.**

We build one **pCTR** model. "pCTR" = **predicted Click-Through Rate**: for each ad we
show a person, predict the *probability they click it* (a number from 0 to 1, e.g.
`0.04` = "about a 4% chance"). Ad systems rank ads by this probability (times the bid).

**What makes this notebook different:** it's *granular*. Instead of one magic `.fit()`,
we build the model in **PyTorch** and **watch it learn**, printing the error going down
each step. We also **explain the model choice** (why logistic regression for pCTR). Every
stage has a picture and a short plain-English "why."

**Roadmap:** make data → look at it → split → **standardize** → **choose & build the
model (logistic regression in PyTorch)** → **train with a logged loop** → check it
recovered the true rule → predict → measure ranking (AUC) → measure honesty (calibration)
→ rank ads → `pCTR × bid` → **four proof graphs**.

Run each cell with **Shift+Enter**. Read the text first — it explains the cell below it.
""")

# =================================================================== DATA
md(r"""
## Step 1a · Create the features

Each **example** is one ad shown to one person (an *impression*). **Features** are things
we know *before* showing the ad. We'll make 6,000 impressions with four features:
- `relevance` (0–1): how well the ad matches the person.
- `position` (1–10): slot on the page (1 = top).
- `ad_quality` (0–1): how good the ad is in general.
- `is_mobile` (0/1): phone or desktop.

We just print each feature's range so we can *see* what we made — that's our first bit of
**logging**.
""")
code(r"""
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"

rng = np.random.default_rng(0)
N = 6000

relevance  = rng.uniform(0, 1, N)
position   = rng.integers(1, 11, N)
ad_quality = rng.uniform(0, 1, N)
is_mobile  = rng.integers(0, 2, N)

for name, col in [("relevance", relevance), ("position", position),
                  ("ad_quality", ad_quality), ("is_mobile", is_mobile)]:
    print(f"{name:<11} range [{col.min():.2f}, {col.max():.2f}]  mean {col.mean():.2f}")
""")

md(r"""
## Step 1b · Invent the TRUE rule, then generate clicks

Here's the trick that lets us *prove* the model works later: **we** decide the real rule
behind clicks. We combine the features into a **score** (called a *logit*), squash it to a
probability with the **sigmoid** function, then flip a weighted coin to decide the click.

The rule (remember these numbers — the model will have to rediscover them):
`logit = -3.0 + 3.0·relevance + 1.5·ad_quality − 0.25·position + 0.4·is_mobile`

Positive numbers push clicks **up** (relevance, quality, mobile); the negative one on
`position` means lower on the page → fewer clicks.
""")
code(r"""
TRUE_WEIGHTS = {"relevance": 3.0, "position": -0.25, "ad_quality": 1.5, "is_mobile": 0.4}
TRUE_BIAS = -3.0

true_logit = (TRUE_BIAS + 3.0*relevance + 1.5*ad_quality - 0.25*position + 0.4*is_mobile)
true_pctr  = 1 / (1 + np.exp(-true_logit))            # sigmoid: score -> probability (0..1)
clicked    = (rng.random(N) < true_pctr).astype(int)  # flip a coin with that probability

data = pd.DataFrame(dict(relevance=relevance, position=position, ad_quality=ad_quality,
                         is_mobile=is_mobile, true_pctr=true_pctr, clicked=clicked))
print("overall click rate:", round(data.clicked.mean(), 3),
      " (so about", int(100*data.clicked.mean()), "clicks per 100 impressions)")
print("true_pctr ranges from", round(true_pctr.min(),3), "to", round(true_pctr.max(),3))
data.head()
""")


md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full pCTR pipeline, here is **one tiny, hand-traceable toy example for each
computational mechanic** the lesson uses: data generation, the hidden CTR rule, sigmoid clicks,
binning, splits, standardization, logistic scores, log loss, gradient steps, learning curves,
weight recovery, prediction, AUC, calibration, ranking, auction value, proof summaries, and the
common CTR-family mechanics (wide crosses, GBDT residuals, embeddings, FM, Wide&Deep, DCN,
DeepFM). Every toy uses only `numpy` + `matplotlib`, prints the numbers you should trace, and draws
one picture.
""")

md(r"""
## ✍️ Toy 1 · tiny impression table and feature stats

Start with the smallest version of Step 1a: 8 ad impressions × 4 features. We compute the range and
mean of each column, exactly like the setup cell logs the synthetic feature shapes.
""")
code(r"""
t1_rng = np.random.default_rng(0)                                      # -> deterministic seed for this toy
t1_relevance = np.array([0.1, 0.2, 0.8, 0.6, 0.9, 0.3, 0.4, 0.7])       # -> 8 relevance values
t1_position = np.array([1, 2, 3, 4, 1, 5, 2, 3], dtype=float)           # -> 8 page slots
t1_quality = np.array([0.2, 0.4, 0.9, 0.5, 0.8, 0.3, 0.6, 0.7])         # -> 8 ad-quality values
t1_mobile = np.array([0, 1, 1, 0, 1, 0, 0, 1], dtype=float)             # -> 8 device flags
t1_X = np.column_stack([t1_relevance, t1_position, t1_quality, t1_mobile])  # -> shape (8, 4)
t1_min = t1_X.min(axis=0)                                              # -> [0.1, 1.0, 0.2, 0.0]
t1_max = t1_X.max(axis=0)                                              # -> [0.9, 5.0, 0.9, 1.0]
t1_mean = t1_X.mean(axis=0)                                            # -> [0.5, 2.625, 0.55, 0.5]
print("X rows (relevance, position, quality, mobile):")
print(t1_X.tolist())
print("column min:", np.round(t1_min, 3).tolist())
print("column max:", np.round(t1_max, 3).tolist())
print("column mean:", np.round(t1_mean, 3).tolist())
assert t1_X.shape == (8, 4)
assert np.allclose(t1_mean, [0.5, 2.625, 0.55, 0.5])

plt.figure(figsize=(5.5, 3.2))
plt.imshow(t1_X, aspect="auto", cmap="viridis")
plt.colorbar(label="feature value")
plt.xticks(range(4), ["rel", "pos", "qual", "mob"])
plt.yticks(range(8), [f"imp {t1_i}" for t1_i in range(8)])
plt.title("Toy 1: 8 impressions × 4 logged features")
plt.show()
""")
md("▶ What you'll see: a tiny 8×4 feature matrix plus the min, max, and mean for each feature — the same logging idea Step 1a uses at 6,000 rows.")

md(r"""
## ✍️ Toy 2 · hidden linear CTR score (logit)

Step 1b invents a secret rule. Here the rule is the same arithmetic on 6 tiny impressions: multiply
each feature by its weight, add the pieces, then add the bias to get a **logit**.
""")
code(r"""
t2_rng = np.random.default_rng(0)                                      # -> deterministic seed for this toy
t2_X = np.array([[0.0, 1.0, 0.0, 0.0],
                 [0.5, 2.0, 0.5, 1.0],
                 [1.0, 1.0, 0.8, 0.0],
                 [0.2, 4.0, 0.1, 1.0],
                 [0.9, 3.0, 0.7, 1.0],
                 [0.4, 5.0, 0.6, 0.0]])                               # -> 6 impressions × 4 features
t2_w = np.array([3.0, -0.25, 1.5, 0.4])                                # -> true feature weights
t2_b = -3.0                                                            # -> true intercept
t2_contrib = t2_X * t2_w                                                # -> contribution of each feature
t2_sum = t2_contrib.sum(axis=1)                                         # -> [-0.25, 2.15, 3.95, 0.15, 3.4, 0.85]
t2_logit = t2_b + t2_sum                                                # -> [-3.25, -0.85, 0.95, -2.85, 0.4, -2.15]
print("feature contributions per row:")
print(np.round(t2_contrib, 3).tolist())
print("sum before bias:", np.round(t2_sum, 3).tolist())
print("logit after bias:", np.round(t2_logit, 3).tolist())
assert np.allclose(t2_logit, [-3.25, -0.85, 0.95, -2.85, 0.4, -2.15])

plt.figure(figsize=(5.5, 3))
plt.bar(range(len(t2_logit)), t2_logit, color="steelblue")
plt.axhline(0, color="black", lw=0.8)
plt.xlabel("impression")
plt.ylabel("logit")
plt.title("Toy 2: weighted feature sum + bias")
plt.show()
""")
md("▶ What you'll see: each row's four weighted pieces, their sum, and the final logits `[-3.25, -0.85, 0.95, -2.85, 0.4, -2.15]`.")

md(r"""
## ✍️ Toy 3 · sigmoid probabilities and seeded click coins

A logit is not a probability yet. Step 1b applies the **sigmoid**, then flips one seeded coin per
impression to create the click label.
""")
code(r"""
t3_rng = np.random.default_rng(0)                                      # -> deterministic seed for this toy
t3_logit = np.array([-3.25, -0.85, 0.95, -2.85, 0.4, -2.15])            # -> logits from Toy 2
t3_prob = 1.0 / (1.0 + np.exp(-t3_logit))                              # -> [0.037, 0.299, 0.721, 0.055, 0.599, 0.104]
t3_draw = t3_rng.random(6)                                             # -> [0.637, 0.27, 0.041, 0.017, 0.813, 0.913]
t3_click = (t3_draw < t3_prob).astype(int)                             # -> [0, 1, 1, 1, 0, 0]
print("sigmoid probabilities:", np.round(t3_prob, 3).tolist())
print("seeded random draws:", np.round(t3_draw, 3).tolist())
print("click = draw < probability:", t3_click.tolist())
assert t3_click.tolist() == [0, 1, 1, 1, 0, 0]

plt.figure(figsize=(5.5, 3))
plt.bar(range(6), t3_prob, color=["seagreen" if t3_click[t3_i] else "lightgray" for t3_i in range(6)])
plt.scatter(range(6), t3_draw, color="black", label="coin draw")
plt.ylim(0, 1)
plt.xlabel("impression")
plt.ylabel("probability / draw")
plt.title("Toy 3: clicks happen when the draw is below pCTR")
plt.legend()
plt.show()
""")
md("▶ What you'll see: sigmoid turns logits into probabilities; the seeded draws produce clicks `[0, 1, 1, 1, 0, 0]`.")

md(r"""
## ✍️ Toy 4 · histogram bin counts for feature shapes

Step 2a looks at histograms. A histogram is just counting how many values fall into each bin; here
we do that by hand for two tiny feature columns.
""")
code(r"""
t4_rng = np.random.default_rng(0)                                      # -> deterministic seed for this toy
t4_rows = np.array([[1.0, 0.1],
                    [1.0, 0.2],
                    [2.0, 0.4],
                    [3.0, 0.5],
                    [4.0, 0.6],
                    [4.0, 0.7],
                    [5.0, 0.9],
                    [6.0, 1.0]])                                      # -> 8 rows × 2 features
t4_position = t4_rows[:, 0]                                           # -> [1, 1, 2, 3, 4, 4, 5, 6]
t4_relevance = t4_rows[:, 1]                                          # -> [0.1, 0.2, 0.4, 0.5, 0.6, 0.7, 0.9, 1.0]
t4_pos_counts = np.histogram(t4_position, bins=[1, 3, 5, 7])[0]        # -> [3, 3, 2]
t4_rel_counts = np.histogram(t4_relevance, bins=[0, 0.5, 0.75, 1.01])[0]  # -> [3, 3, 2]
print("position values:", t4_position.tolist())
print("position bin counts [1-2, 3-4, 5-6]:", t4_pos_counts.tolist())
print("relevance values:", np.round(t4_relevance, 2).tolist())
print("relevance bin counts [low, mid, high]:", t4_rel_counts.tolist())
assert t4_pos_counts.sum() == 8
assert t4_rel_counts.sum() == 8

plt.figure(figsize=(5.5, 3))
t4_x = np.arange(3)                                                    # -> [0, 1, 2]
plt.bar(t4_x - 0.18, t4_pos_counts, 0.36, label="position")
plt.bar(t4_x + 0.18, t4_rel_counts, 0.36, label="relevance")
plt.xticks(t4_x, ["low", "mid", "high"])
plt.ylabel("count")
plt.title("Toy 4: histograms are bin counts")
plt.legend()
plt.show()
""")
md("▶ What you'll see: two histograms reduced to the same count pattern `[3, 3, 2]`, making Step 2a's plots traceable.")

md(r"""
## ✍️ Toy 5 · bucketed click-rate lift

Step 2b asks whether clicks rise with a feature. We bucket relevance into low/high groups, count
clicks in each group, and divide clicks by impressions.
""")
code(r"""
t5_rng = np.random.default_rng(0)                                      # -> deterministic seed for this toy
t5_rows = np.array([[0.1, 0],
                    [0.2, 0],
                    [0.3, 0],
                    [0.4, 1],
                    [0.7, 1],
                    [0.8, 1],
                    [0.9, 1],
                    [1.0, 1]], dtype=float)                           # -> 8 rows: relevance, clicked
t5_relevance = t5_rows[:, 0]                                           # -> [0.1, ..., 1.0]
t5_clicked = t5_rows[:, 1]                                             # -> [0, 0, 0, 1, 1, 1, 1, 1]
t5_bucket = (t5_relevance >= 0.5).astype(int)                          # -> [0, 0, 0, 0, 1, 1, 1, 1]
t5_counts = np.array([(t5_bucket == 0).sum(), (t5_bucket == 1).sum()])  # -> [4, 4]
t5_clicks = np.array([t5_clicked[t5_bucket == 0].sum(), t5_clicked[t5_bucket == 1].sum()])  # -> [1, 4]
t5_rate = t5_clicks / t5_counts                                        # -> [0.25, 1.0]
print("bucket ids:", t5_bucket.tolist())
print("impressions per bucket:", t5_counts.tolist())
print("clicks per bucket:", t5_clicks.astype(int).tolist())
print("click rate per bucket:", np.round(t5_rate, 3).tolist())
assert np.allclose(t5_rate, [0.25, 1.0])

plt.figure(figsize=(4.8, 3))
plt.bar(["low relevance", "high relevance"], t5_rate, color=["lightgray", "seagreen"])
plt.ylim(0, 1.05)
plt.ylabel("click rate")
plt.title("Toy 5: feature bucket → empirical click rate")
plt.show()
""")
md("▶ What you'll see: low relevance clicks 1/4 = 0.25; high relevance clicks 4/4 = 1.00, so the feature has lift.")

md(r"""
## ✍️ Toy 6 · stratified train/test split

Step 3 hides test examples while keeping the click rate similar in train and test. With 4 non-clicks
and 4 clicks, stratification sends the same fraction of each class to each side.
""")
code(r"""
t6_rng = np.random.default_rng(0)                                      # -> deterministic seed for this toy
t6_X = np.array([[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1]], dtype=float)  # -> 8 rows × 2 dims
t6_y = np.array([0, 0, 0, 0, 1, 1, 1, 1])                              # -> 4 non-clicks, 4 clicks
t6_zero = np.where(t6_y == 0)[0]                                       # -> [0, 1, 2, 3]
t6_one = np.where(t6_y == 1)[0]                                        # -> [4, 5, 6, 7]
t6_zero_perm = t6_rng.permutation(t6_zero)                             # -> [2, 0, 1, 3]
t6_one_perm = t6_rng.permutation(t6_one)                               # -> [7, 6, 5, 4]
t6_train_idx = np.r_[t6_zero_perm[:3], t6_one_perm[:3]]                # -> [2, 0, 1, 7, 6, 5]
t6_test_idx = np.r_[t6_zero_perm[3:], t6_one_perm[3:]]                 # -> [3, 4]
t6_train_rate = t6_y[t6_train_idx].mean()                              # -> 0.5
t6_test_rate = t6_y[t6_test_idx].mean()                                # -> 0.5
print("zero-class shuffled:", t6_zero_perm.tolist())
print("one-class shuffled:", t6_one_perm.tolist())
print("train idx:", t6_train_idx.tolist(), "labels:", t6_y[t6_train_idx].tolist())
print("test idx:", t6_test_idx.tolist(), "labels:", t6_y[t6_test_idx].tolist())
print("click rate train/test:", t6_train_rate, t6_test_rate)
assert t6_train_rate == 0.5
assert t6_test_rate == 0.5

plt.figure(figsize=(4.8, 3))
t6_train_counts = np.bincount(t6_y[t6_train_idx], minlength=2)         # -> [3, 3]
t6_test_counts = np.bincount(t6_y[t6_test_idx], minlength=2)           # -> [1, 1]
plt.bar(["train 0", "train 1"], t6_train_counts, color="steelblue")
plt.bar(["test 0", "test 1"], t6_test_counts, color="orange")
plt.ylabel("count")
plt.title("Toy 6: stratification preserves class balance")
plt.show()
""")
md("▶ What you'll see: train has 3 non-clicks + 3 clicks; test has 1 + 1, so both sides keep a 50% click rate.")

md(r"""
## ✍️ Toy 7 · train-only standardization

Step 4 learns mean and standard deviation on **train only**, then applies the same numbers to train
and test. This prevents test data from leaking into preprocessing.
""")
code(r"""
t7_rng = np.random.default_rng(0)                                      # -> deterministic seed for this toy
t7_train = np.array([[1, 10, 0],
                     [2, 8, 1],
                     [3, 6, 0],
                     [4, 4, 1],
                     [5, 2, 0],
                     [6, 0, 1]], dtype=float)                         # -> 6 train rows × 3 dims
t7_test = np.array([[7, 2, 1],
                    [0, 10, 0]], dtype=float)                         # -> 2 unseen rows × 3 dims
t7_mu = t7_train.mean(axis=0)                                         # -> [3.5, 5.0, 0.5]
t7_sd = t7_train.std(axis=0)                                          # -> [1.708, 3.416, 0.5]
t7_train_z = (t7_train - t7_mu) / t7_sd                               # -> standardized train
t7_test_z = (t7_test - t7_mu) / t7_sd                                 # -> standardized test using train stats
print("train mean:", np.round(t7_mu, 3).tolist())
print("train std:", np.round(t7_sd, 3).tolist())
print("first standardized train row:", np.round(t7_train_z[0], 3).tolist())
print("standardized test rows:", np.round(t7_test_z, 3).tolist())
assert np.allclose(t7_train_z.mean(axis=0), [0, 0, 0])
assert np.allclose(t7_train_z.std(axis=0), [1, 1, 1])

plt.figure(figsize=(5.2, 3.2))
plt.scatter(t7_train[:, 0], t7_train[:, 1], label="raw train", s=80)
plt.scatter(t7_train_z[:, 0], t7_train_z[:, 1], label="standardized train", s=80)
plt.axhline(0, color="black", lw=0.7)
plt.axvline(0, color="black", lw=0.7)
plt.xlabel("feature 0")
plt.ylabel("feature 1")
plt.title("Toy 7: standardization recenters and rescales")
plt.legend()
plt.show()
""")
md("▶ What you'll see: train features become mean 0 and std 1; test rows are transformed with the train mean/std, not their own.")

md(r"""
## ✍️ Toy 8 · logistic-regression linear score and parameter count

Step 5's `nn.Linear(4, 1)` is just `X @ w + b`: four weights plus one bias. Trace the matrix multiply
for 6 tiny impressions.
""")
code(r"""
t8_rng = np.random.default_rng(0)                                      # -> deterministic seed for this toy
t8_X = np.array([[1, 0, 2, 1],
                 [0, 1, 1, 0],
                 [2, 1, 0, 1],
                 [1, 1, 1, 1],
                 [0, 2, 1, 1],
                 [2, 0, 1, 0]], dtype=float)                         # -> 6 rows × 4 dims
t8_w = np.array([0.8, -0.4, 0.6, 0.2])                                # -> 4 learned weights
t8_b = -0.1                                                           # -> 1 bias
t8_matrix_product = t8_X @ t8_w                                       # -> [2.2, 0.2, 1.4, 1.2, 0.0, 2.2]
t8_score = t8_matrix_product + t8_b                                   # -> [2.1, 0.1, 1.3, 1.1, -0.1, 2.1]
t8_param_count = t8_w.size + 1                                        # -> 5
print("X @ w:", np.round(t8_matrix_product, 3).tolist())
print("scores after bias:", np.round(t8_score, 3).tolist())
print("parameter count = 4 weights + 1 bias:", t8_param_count)
assert t8_param_count == 5
assert np.isclose(t8_score[0], 2.1)

t8_contrib0 = t8_X[0] * t8_w                                          # -> [0.8, -0.0, 1.2, 0.2]
plt.figure(figsize=(5.2, 3))
plt.bar(["rel", "pos", "qual", "mob"], t8_contrib0, color="slateblue")
plt.axhline(0, color="black", lw=0.8)
plt.ylabel("contribution")
plt.title("Toy 8: first row contributions sum to 2.2, then + bias")
plt.show()
""")
md("▶ What you'll see: `nn.Linear(4,1)` is five numbers; row 0 contributes `[0.8, 0.0, 1.2, 0.2]` before the bias.")

md(r"""
## ✍️ Toy 9 · sigmoid plus binary log loss

Step 6 trains by minimizing log loss. For each example, confident correct predictions get tiny loss;
uncertain or wrong predictions get larger loss.
""")
code(r"""
t9_rng = np.random.default_rng(0)                                      # -> deterministic seed for this toy
t9_rows = np.array([[-2, 0],
                    [-1, 0],
                    [0, 0],
                    [1, 1],
                    [2, 1],
                    [3, 1]], dtype=float)                             # -> logit, clicked
t9_logit = t9_rows[:, 0]                                               # -> [-2, -1, 0, 1, 2, 3]
t9_y = t9_rows[:, 1]                                                   # -> [0, 0, 0, 1, 1, 1]
t9_prob = 1.0 / (1.0 + np.exp(-t9_logit))                              # -> [0.119, 0.269, 0.5, 0.731, 0.881, 0.953]
t9_loss = -(t9_y * np.log(t9_prob) + (1 - t9_y) * np.log(1 - t9_prob))  # -> [0.127, 0.313, 0.693, 0.313, 0.127, 0.049]
t9_mean_loss = t9_loss.mean()                                          # -> 0.270
print("probabilities:", np.round(t9_prob, 3).tolist())
print("per-example log loss:", np.round(t9_loss, 3).tolist())
print("mean log loss:", round(float(t9_mean_loss), 3))
assert np.isclose(round(float(t9_mean_loss), 3), 0.27)

plt.figure(figsize=(5.2, 3))
plt.bar(range(6), t9_loss, color="tomato")
plt.xlabel("example")
plt.ylabel("log loss")
plt.title("Toy 9: log loss punishes uncertainty/wrongness")
plt.show()
""")
md("▶ What you'll see: the uncertain logit 0 has loss 0.693, while confident correct examples have much smaller loss.")

md(r"""
## ✍️ Toy 10 · one gradient-descent update by hand

Step 6's training loop repeats this mechanic: predict, compute error, average gradients, and move
weights downhill. Here is one full logistic-regression update in NumPy.
""")
code(r"""
t10_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t10_X = np.array([[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [0, -1]], dtype=float)  # -> 6 rows × 2 dims
t10_y = np.array([1, 1, 1, 0, 0, 0], dtype=float)                      # -> three clicks, three non-clicks
t10_w = np.array([0.0, 0.0])                                           # -> start weights
t10_b = 0.0                                                           # -> start bias
t10_logit = t10_X @ t10_w + t10_b                                     # -> [0, 0, 0, 0, 0, 0]
t10_prob = 1.0 / (1.0 + np.exp(-t10_logit))                            # -> [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
t10_error = t10_prob - t10_y                                          # -> [-0.5, -0.5, -0.5, 0.5, 0.5, 0.5]
t10_grad_w = t10_X.T @ t10_error / len(t10_y)                         # -> [-0.333, -0.167]
t10_grad_b = t10_error.mean()                                         # -> 0.0
t10_lr = 0.5                                                          # -> learning rate
t10_new_w = t10_w - t10_lr * t10_grad_w                               # -> [0.167, 0.083]
t10_new_b = t10_b - t10_lr * t10_grad_b                               # -> 0.0
print("probabilities:", np.round(t10_prob, 3).tolist())
print("errors p-y:", np.round(t10_error, 3).tolist())
print("gradient w:", np.round(t10_grad_w, 3).tolist(), "gradient b:", round(float(t10_grad_b), 3))
print("updated weights:", np.round(t10_new_w, 3).tolist(), "updated bias:", round(float(t10_new_b), 3))
assert np.allclose(t10_new_w, [1/6, 1/12])
assert np.isclose(t10_new_b, 0.0)

plt.figure(figsize=(4.8, 3))
plt.bar(["w0 old", "w1 old"], t10_w, color="lightgray", label="old")
plt.bar(["w0 new", "w1 new"], t10_new_w, color="seagreen", label="new")
plt.ylabel("weight")
plt.title("Toy 10: one downhill update moves weights positive")
plt.show()
""")
md("▶ What you'll see: errors average into gradients `[-0.333, -0.167]`; subtracting them nudges both weights upward.")

md(r"""
## ✍️ Toy 11 · learning curve from repeated updates

Step 7 plots the loss history. Repeating the exact update from Toy 10 produces a list of losses that
should fall and flatten.
""")
code(r"""
t11_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t11_X = np.array([[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [0, -1]], dtype=float)  # -> 6 rows × 2 dims
t11_y = np.array([1, 1, 1, 0, 0, 0], dtype=float)                      # -> labels
t11_w = np.array([0.0, 0.0])                                           # -> start weights
t11_b = 0.0                                                           # -> start bias
t11_lr = 0.8                                                          # -> learning rate
t11_loss_history = []                                                 # -> filled below
for t11_epoch in range(6):
    t11_logit = t11_X @ t11_w + t11_b                                  # -> current logits
    t11_prob = 1.0 / (1.0 + np.exp(-t11_logit))                        # -> current probabilities
    t11_loss = -(t11_y * np.log(t11_prob) + (1 - t11_y) * np.log(1 - t11_prob)).mean()  # -> scalar loss
    t11_error = t11_prob - t11_y                                       # -> current residuals
    t11_grad_w = t11_X.T @ t11_error / len(t11_y)                      # -> weight gradient
    t11_grad_b = t11_error.mean()                                      # -> bias gradient
    t11_w = t11_w - t11_lr * t11_grad_w                                # -> updated weights
    t11_b = t11_b - t11_lr * t11_grad_b                                # -> updated bias
    t11_loss_history.append(float(t11_loss))                           # -> append loss
    print(f"epoch {t11_epoch}: loss={t11_loss:.4f}, w={np.round(t11_w, 3).tolist()}, b={t11_b:.3f}")
print("loss history:", np.round(t11_loss_history, 4).tolist())
assert t11_loss_history[-1] < t11_loss_history[0]

plt.figure(figsize=(5, 3))
plt.plot(range(6), t11_loss_history, "o-", color="purple")
plt.xlabel("epoch")
plt.ylabel("log loss")
plt.title("Toy 11: loss falls as updates repeat")
plt.show()
""")
md("▶ What you'll see: losses drop from `0.6931` to about `0.3647`, matching the learning-curve idea in Step 7.")

md(r"""
## ✍️ Toy 12 · convert standardized weights back to raw units

Step 8 compares learned weights to the true rule. Because training used standardized features, raw
weights require `w_raw = w_std / std` and a corrected intercept.
""")
code(r"""
t12_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t12_mu = np.array([0.5, 5.0, 0.5])                                     # -> train means
t12_sd = np.array([0.25, 2.0, 0.5])                                    # -> train stds
t12_w_std = np.array([0.75, -0.5, 0.75])                               # -> weights in standardized space
t12_b_std = -2.0                                                       # -> bias in standardized space
t12_w_raw = t12_w_std / t12_sd                                        # -> [3.0, -0.25, 1.5]
t12_b_raw = t12_b_std - (t12_w_std * t12_mu / t12_sd).sum()            # -> -3.0
t12_true_w = np.array([3.0, -0.25, 1.5])                               # -> secret raw weights
t12_true_b = -3.0                                                      # -> secret raw bias
print("standardized weights:", t12_w_std.tolist(), "bias:", t12_b_std)
print("raw weights:", np.round(t12_w_raw, 3).tolist(), "raw bias:", round(float(t12_b_raw), 3))
print("true weights:", t12_true_w.tolist(), "true bias:", t12_true_b)
assert np.allclose(t12_w_raw, t12_true_w)
assert np.isclose(t12_b_raw, t12_true_b)

plt.figure(figsize=(5.2, 3))
t12_x = np.arange(3)                                                   # -> [0, 1, 2]
plt.bar(t12_x - 0.18, t12_true_w, 0.36, color="lightgray", label="true")
plt.bar(t12_x + 0.18, t12_w_raw, 0.36, color="seagreen", label="recovered")
plt.axhline(0, color="black", lw=0.8)
plt.xticks(t12_x, ["rel", "pos", "qual"])
plt.ylabel("raw weight")
plt.title("Toy 12: standardized weights converted back")
plt.legend()
plt.show()
""")
md("▶ What you'll see: standardized weights `[0.75, -0.5, 0.75]` convert exactly to raw weights `[3.0, -0.25, 1.5]`.")

md(r"""
## ✍️ Toy 13 · unseen pCTR prediction

Step 9 predicts on held-out impressions. The computation is the same linear score plus sigmoid, but
now on rows the model did not train on.
""")
code(r"""
t13_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t13_X = np.array([[0.2, 1.0, 0.1, 0.0],
                  [0.8, 2.0, 0.7, 1.0],
                  [0.5, 4.0, 0.2, 0.0],
                  [1.0, 1.0, 0.9, 1.0],
                  [0.1, 5.0, 0.4, 1.0],
                  [0.7, 3.0, 0.6, 0.0]])                              # -> 6 unseen rows × 4 dims
t13_w = np.array([3.0, -0.25, 1.5, 0.4])                               # -> trained raw weights
t13_b = -3.0                                                           # -> trained raw bias
t13_logit = t13_X @ t13_w + t13_b                                     # -> [-2.5, 0.35, -2.2, 1.5, -2.95, -0.75]
t13_pctr = 1.0 / (1.0 + np.exp(-t13_logit))                            # -> [0.076, 0.587, 0.1, 0.818, 0.05, 0.321]
t13_best = int(np.argmax(t13_pctr))                                    # -> 3
print("unseen logits:", np.round(t13_logit, 3).tolist())
print("unseen pCTR:", np.round(t13_pctr, 3).tolist())
print("highest predicted pCTR row:", t13_best)
assert t13_best == 3
assert np.all((t13_pctr >= 0) & (t13_pctr <= 1))

plt.figure(figsize=(5.2, 3))
plt.bar(range(6), t13_pctr, color=["seagreen" if t13_i == t13_best else "lightgray" for t13_i in range(6)])
plt.ylim(0, 1)
plt.xlabel("unseen impression")
plt.ylabel("predicted pCTR")
plt.title("Toy 13: score unseen rows, then sigmoid")
plt.show()
""")
md("▶ What you'll see: the held-out row 3 scores highest with pCTR about `0.818`.")

md(r"""
## ✍️ Toy 14 · AUC from clicked-vs-non-clicked pairs

Step 10's AUC is the chance a clicked impression gets a higher score than a non-clicked one. With
3 clicked and 3 non-clicked rows, there are only 9 pairs to count.
""")
code(r"""
t14_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t14_rows = np.array([[0.9, 1],
                     [0.8, 0],
                     [0.7, 1],
                     [0.4, 0],
                     [0.3, 1],
                     [0.2, 0]], dtype=float)                           # -> score, clicked
t14_score = t14_rows[:, 0]                                             # -> [0.9, 0.8, 0.7, 0.4, 0.3, 0.2]
t14_y = t14_rows[:, 1].astype(int)                                     # -> [1, 0, 1, 0, 1, 0]
t14_pos = t14_score[t14_y == 1]                                        # -> [0.9, 0.7, 0.3]
t14_neg = t14_score[t14_y == 0]                                        # -> [0.8, 0.4, 0.2]
t14_wins = (t14_pos[:, None] > t14_neg[None, :]).sum()                 # -> 6
t14_pairs = t14_pos.size * t14_neg.size                                # -> 9
t14_auc = t14_wins / t14_pairs                                        # -> 0.667
t14_order = np.argsort(-t14_score)                                     # -> [0, 1, 2, 3, 4, 5]
t14_sorted_y = t14_y[t14_order]                                       # -> [1, 0, 1, 0, 1, 0]
t14_tpr = np.r_[0, np.cumsum(t14_sorted_y) / t14_pos.size]             # -> [0, .333, .333, .667, .667, 1, 1]
t14_fpr = np.r_[0, np.cumsum(1 - t14_sorted_y) / t14_neg.size]         # -> [0, 0, .333, .333, .667, .667, 1]
print("positive scores:", t14_pos.tolist())
print("negative scores:", t14_neg.tolist())
print("wins / pairs:", int(t14_wins), "/", int(t14_pairs), "=", round(float(t14_auc), 3))
print("ROC fpr:", np.round(t14_fpr, 3).tolist())
print("ROC tpr:", np.round(t14_tpr, 3).tolist())
assert np.isclose(t14_auc, 2/3)

plt.figure(figsize=(4.6, 4))
plt.plot(t14_fpr, t14_tpr, "o-", color="steelblue", label=f"AUC={t14_auc:.3f}")
plt.plot([0, 1], [0, 1], "k--", label="coin flip")
plt.xlabel("false positive rate")
plt.ylabel("true positive rate")
plt.title("Toy 14: ROC from six scored impressions")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the model wins 6 of 9 clicked-vs-non-clicked pairs, so AUC is `0.667`.")

md(r"""
## ✍️ Toy 15 · calibration buckets

Step 11 checks whether probabilities are honest. We group predictions into probability bins and
compare each bin's average prediction to its actual click rate.
""")
code(r"""
t15_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t15_rows = np.array([[0.10, 0],
                     [0.20, 0],
                     [0.30, 1],
                     [0.40, 0],
                     [0.55, 1],
                     [0.60, 1],
                     [0.80, 1],
                     [0.90, 1]], dtype=float)                         # -> predicted pCTR, clicked
t15_prob = t15_rows[:, 0]                                             # -> [0.1, 0.2, ..., 0.9]
t15_y = t15_rows[:, 1]                                                # -> [0, 0, 1, 0, 1, 1, 1, 1]
t15_bin = np.digitize(t15_prob, [0.33, 0.66])                         # -> [0, 0, 0, 1, 1, 1, 2, 2]
t15_mean_pred = np.array([t15_prob[t15_bin == t15_i].mean() for t15_i in range(3)])  # -> [0.2, 0.517, 0.85]
t15_frac_pos = np.array([t15_y[t15_bin == t15_i].mean() for t15_i in range(3)])      # -> [0.333, 0.667, 1.0]
print("bin ids:", t15_bin.tolist())
print("mean predicted per bin:", np.round(t15_mean_pred, 3).tolist())
print("actual click rate per bin:", np.round(t15_frac_pos, 3).tolist())
assert np.allclose(np.round(t15_mean_pred, 3), [0.2, 0.517, 0.85])
assert np.allclose(np.round(t15_frac_pos, 3), [0.333, 0.667, 1.0])

plt.figure(figsize=(4.6, 4))
plt.plot([0, 1], [0, 1], "k--", label="perfect")
plt.plot(t15_mean_pred, t15_frac_pos, "o-", color="seagreen", label="toy model")
plt.xlabel("mean predicted pCTR")
plt.ylabel("actual click rate")
plt.title("Toy 15: calibration by probability bin")
plt.legend()
plt.show()
""")
md("▶ What you'll see: each bin has two numbers — average predicted pCTR and actual click rate — which should lie near the diagonal when calibrated.")

md(r"""
## ✍️ Toy 16 · sorting by pCTR and assigning ranks

Step 12 turns probabilities into a ranking. We sort high to low, invert that order into rank numbers,
and average the ranks of clicked impressions.
""")
code(r"""
t16_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t16_rows = np.array([[0.12, 0],
                     [0.55, 1],
                     [0.33, 0],
                     [0.81, 1],
                     [0.44, 1],
                     [0.20, 0]], dtype=float)                         # -> pCTR, clicked
t16_pctr = t16_rows[:, 0]                                             # -> [0.12, 0.55, 0.33, 0.81, 0.44, 0.2]
t16_y = t16_rows[:, 1].astype(int)                                    # -> [0, 1, 0, 1, 1, 0]
t16_order = np.argsort(-t16_pctr)                                     # -> [3, 1, 4, 2, 5, 0]
t16_ranks = np.empty_like(t16_order)                                  # -> storage for ranks
t16_ranks[t16_order] = np.arange(1, len(t16_order) + 1)                # -> [6, 2, 4, 1, 3, 5]
t16_clicked_ranks = t16_ranks[t16_y == 1]                             # -> [2, 1, 3]
t16_avg_clicked_rank = t16_clicked_ranks.mean()                       # -> 2.0
print("descending order:", t16_order.tolist())
print("rank per original row:", t16_ranks.tolist())
print("clicked ranks:", t16_clicked_ranks.tolist())
print("average clicked rank:", round(float(t16_avg_clicked_rank), 3))
assert t16_order.tolist() == [3, 1, 4, 2, 5, 0]
assert np.isclose(t16_avg_clicked_rank, 2.0)

plt.figure(figsize=(5.2, 3))
t16_sorted_y = t16_y[t16_order]                                       # -> [1, 1, 1, 0, 0, 0]
plt.bar(range(6), t16_pctr[t16_order], color=["seagreen" if t16_sorted_y[t16_i] else "lightgray" for t16_i in range(6)])
plt.xticks(range(6), [f"row {t16_i}" for t16_i in t16_order])
plt.ylabel("pCTR")
plt.title("Toy 16: clicked rows rise to the top")
plt.show()
""")
md("▶ What you'll see: sorting by pCTR produces order `[3, 1, 4, 2, 5, 0]`; clicked impressions occupy ranks 1–3.")

md(r"""
## ✍️ Toy 17 · pCTR × bid expected value

Step 13 ranks ads by expected value, not probability alone. The multiplication is tiny but critical:
`expected value = pCTR × bid`.
""")
code(r"""
t17_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t17_rows = np.array([[0.010, 8.0],
                     [0.040, 3.0],
                     [0.020, 5.0],
                     [0.030, 2.0]])                                   # -> pCTR, bid for 4 ads
t17_pctr = t17_rows[:, 0]                                             # -> [0.01, 0.04, 0.02, 0.03]
t17_bid = t17_rows[:, 1]                                              # -> [8, 3, 5, 2]
t17_value = t17_pctr * t17_bid                                        # -> [0.08, 0.12, 0.10, 0.06]
t17_winner = int(np.argmax(t17_value))                                # -> 1
print("pCTR:", t17_pctr.tolist())
print("bid:", t17_bid.tolist())
print("expected value:", np.round(t17_value, 3).tolist())
print("winner index:", t17_winner)
assert t17_winner == 1
assert np.isclose(t17_value[t17_winner], 0.12)

plt.figure(figsize=(4.8, 3))
plt.bar(["A", "B", "C", "D"], t17_value, color=["lightgray", "seagreen", "lightgray", "lightgray"])
plt.ylabel("pCTR × bid")
plt.title("Toy 17: expected value picks ad B")
plt.show()
""")
md("▶ What you'll see: ad B wins with value `0.04 × 3 = 0.12`, even though ad A has the largest bid.")

md(r"""
## ✍️ Toy 18 · proof summary: prediction-vs-truth and grouped actuals

Step 14 combines proof graphs. In miniature, compute correlation with hidden truth and grouped
predicted-vs-actual click rates.
""")
code(r"""
t18_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t18_rows = np.array([[0.10, 0.12, 0],
                     [0.20, 0.18, 0],
                     [0.30, 0.31, 0],
                     [0.40, 0.38, 1],
                     [0.50, 0.52, 0],
                     [0.60, 0.62, 1],
                     [0.70, 0.68, 1],
                     [0.80, 0.82, 1]], dtype=float)                   # -> true pCTR, predicted pCTR, clicked
t18_true = t18_rows[:, 0]                                             # -> hidden truth
t18_pred = t18_rows[:, 1]                                             # -> model prediction
t18_y = t18_rows[:, 2]                                                # -> observed clicks
t18_corr = np.corrcoef(t18_true, t18_pred)[0, 1]                      # -> 0.997
t18_order = np.argsort(t18_pred)                                      # -> [0, 1, 2, 3, 4, 5, 6, 7]
t18_groups = t18_order.reshape(4, 2)                                  # -> four low-to-high groups
t18_group_pred = np.array([t18_pred[t18_g].mean() for t18_g in t18_groups])  # -> [0.15, 0.345, 0.57, 0.75]
t18_group_actual = np.array([t18_y[t18_g].mean() for t18_g in t18_groups])   # -> [0.0, 0.5, 0.5, 1.0]
print("correlation predicted vs true:", round(float(t18_corr), 3))
print("groups of row ids:", t18_groups.tolist())
print("group mean predicted:", np.round(t18_group_pred, 3).tolist())
print("group actual click rate:", np.round(t18_group_actual, 3).tolist())
assert t18_corr > 0.99
assert np.allclose(t18_group_actual, [0.0, 0.5, 0.5, 1.0])

t18_fig, t18_ax = plt.subplots(1, 2, figsize=(8.5, 3.2))
t18_ax[0].scatter(t18_true, t18_pred, color="purple")
t18_ax[0].plot([0, 1], [0, 1], "k--")
t18_ax[0].set_title("predicted vs true")
t18_ax[0].set_xlabel("true")
t18_ax[0].set_ylabel("predicted")
t18_ax[1].bar(range(4), t18_group_pred, alpha=0.6, label="pred")
t18_ax[1].plot(range(4), t18_group_actual, "o-", color="tomato", label="actual")
t18_ax[1].set_title("grouped proof")
t18_ax[1].set_xlabel("low → high predicted group")
t18_ax[1].legend()
plt.suptitle("Toy 18: two Step-14 proof mechanics in one figure")
plt.show()
""")
md("▶ What you'll see: predictions track the hidden truth (corr ≈ 0.997), and grouped actual click rates rise with predicted pCTR.")

md(r"""
## ✍️ Toy 19 · wide feature cross by hand

CTR systems often add **wide crosses** such as age bucket × device. A cross turns two simple fields
into a memorized interaction ID and one-hot row.
""")
code(r"""
t19_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t19_rows = np.array([[0, 0, 0],
                     [0, 1, 1],
                     [0, 1, 0],
                     [1, 0, 0],
                     [1, 0, 1],
                     [1, 1, 1]], dtype=int)                           # -> age_bucket, device, clicked
t19_age = t19_rows[:, 0]                                              # -> [0, 0, 0, 1, 1, 1]
t19_device = t19_rows[:, 1]                                           # -> [0, 1, 1, 0, 0, 1]
t19_y = t19_rows[:, 2]                                                # -> [0, 1, 0, 0, 1, 1]
t19_cross_id = t19_age * 2 + t19_device                               # -> [0, 1, 1, 2, 2, 3]
t19_one_hot = np.eye(4, dtype=int)[t19_cross_id]                       # -> 6 rows × 4 crossed columns
t19_counts = np.bincount(t19_cross_id, minlength=4)                   # -> [1, 2, 2, 1]
t19_clicks = np.bincount(t19_cross_id, weights=t19_y, minlength=4)     # -> [0, 1, 1, 1]
t19_rate = np.divide(t19_clicks, t19_counts, out=np.zeros(4), where=t19_counts > 0)  # -> [0, .5, .5, 1]
print("cross ids age*2+device:", t19_cross_id.tolist())
print("one-hot crossed rows:")
print(t19_one_hot.tolist())
print("cross click rates:", np.round(t19_rate, 3).tolist())
assert t19_cross_id.tolist() == [0, 1, 1, 2, 2, 3]
assert np.allclose(t19_rate, [0, 0.5, 0.5, 1.0])

plt.figure(figsize=(4.6, 3.6))
plt.imshow(t19_rate.reshape(2, 2), vmin=0, vmax=1, cmap="Greens")
plt.colorbar(label="click rate")
plt.xticks([0, 1], ["desktop", "mobile"])
plt.yticks([0, 1], ["age 0", "age 1"])
plt.title("Toy 19: crossed feature memorizes interactions")
plt.show()
""")
md("▶ What you'll see: the crossed ID `[0,1,1,2,2,3]` creates four memorized buckets with rates `[0, .5, .5, 1]`.")

md(r"""
## ✍️ Toy 20 · GBDT residual stump

A gradient-boosted tree fits what the current model still gets wrong. With squared error, the
residual is `label − prediction`; a stump stores the average residual on each side of a split.
""")
code(r"""
t20_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t20_X = np.array([[0, 0], [1, 0], [2, 1], [3, 1], [4, 0], [5, 1], [6, 0], [7, 1]], dtype=float)  # -> 8 rows × 2 dims
t20_y = np.array([0, 0, 0, 1, 1, 1, 1, 1], dtype=float)                # -> labels
t20_pred0 = np.full(8, 0.5)                                           # -> current model predicts 0.5 for all
t20_residual = t20_y - t20_pred0                                      # -> [-.5, -.5, -.5, .5, .5, .5, .5, .5]
t20_left = t20_X[:, 0] <= 2.5                                         # -> [T, T, T, F, F, F, F, F]
t20_right = ~t20_left                                                 # -> [F, F, F, T, T, T, T, T]
t20_left_value = t20_residual[t20_left].mean()                        # -> -0.5
t20_right_value = t20_residual[t20_right].mean()                      # -> 0.5
t20_stump = np.where(t20_left, t20_left_value, t20_right_value)        # -> [-.5, -.5, -.5, .5, .5, .5, .5, .5]
t20_lr = 0.4                                                          # -> shrinkage
t20_pred1 = t20_pred0 + t20_lr * t20_stump                            # -> [.3, .3, .3, .7, .7, .7, .7, .7]
t20_loss0 = ((t20_y - t20_pred0) ** 2).mean()                         # -> 0.25
t20_loss1 = ((t20_y - t20_pred1) ** 2).mean()                         # -> 0.09
print("residuals:", np.round(t20_residual, 3).tolist())
print("left/right leaf values:", round(float(t20_left_value), 3), round(float(t20_right_value), 3))
print("updated predictions:", np.round(t20_pred1, 3).tolist())
print("squared loss before/after:", round(float(t20_loss0), 3), round(float(t20_loss1), 3))
assert t20_loss1 < t20_loss0
assert np.allclose(t20_pred1, [0.3, 0.3, 0.3, 0.7, 0.7, 0.7, 0.7, 0.7])

plt.figure(figsize=(5.4, 3))
plt.plot(t20_X[:, 0], t20_y, "o", label="label")
plt.step(t20_X[:, 0], t20_pred1, where="mid", color="tomato", label="after stump")
plt.axvline(2.5, color="black", ls="--", lw=0.8)
plt.xlabel("feature 0")
plt.ylabel("prediction")
plt.title("Toy 20: stump fits residuals on each side")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the stump subtracts 0.2 on the left and adds 0.2 on the right, dropping squared loss from `0.25` to `0.09`.")

md(r"""
## ✍️ Toy 21 · embedding lookup and dot score

Deep CTR models replace sparse IDs with learned vectors. The core mechanic is a lookup: user ID →
user embedding, ad ID → ad embedding, then a dot product score.
""")
code(r"""
t21_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t21_rows = np.array([[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]], dtype=int)  # -> user_id, ad_id pairs
t21_user_E = np.array([[1.0, 0.0],
                       [0.0, 1.0],
                       [1.0, 1.0]])                                  # -> 3 user embeddings × 2 dims
t21_ad_E = np.array([[1.0, 0.5],
                     [0.2, 1.0]])                                    # -> 2 ad embeddings × 2 dims
t21_user_vec = t21_user_E[t21_rows[:, 0]]                             # -> looked-up user vectors
t21_ad_vec = t21_ad_E[t21_rows[:, 1]]                                 # -> looked-up ad vectors
t21_dot = (t21_user_vec * t21_ad_vec).sum(axis=1)                     # -> [1.0, 0.2, 0.5, 1.0, 1.5, 1.2]
t21_prob = 1.0 / (1.0 + np.exp(-t21_dot))                             # -> [0.731, 0.55, 0.622, 0.731, 0.818, 0.769]
print("looked-up user vectors:", t21_user_vec.tolist())
print("looked-up ad vectors:", t21_ad_vec.tolist())
print("dot scores:", np.round(t21_dot, 3).tolist())
print("sigmoid scores:", np.round(t21_prob, 3).tolist())
assert np.allclose(t21_dot, [1.0, 0.2, 0.5, 1.0, 1.5, 1.2])

plt.figure(figsize=(5, 4))
plt.scatter(t21_user_E[:, 0], t21_user_E[:, 1], s=120, marker="o", label="users")
plt.scatter(t21_ad_E[:, 0], t21_ad_E[:, 1], s=160, marker="^", label="ads")
for t21_i, t21_xy in enumerate(t21_user_E):
    plt.text(t21_xy[0] + 0.03, t21_xy[1] + 0.03, f"u{t21_i}")
for t21_i, t21_xy in enumerate(t21_ad_E):
    plt.text(t21_xy[0] + 0.03, t21_xy[1] + 0.03, f"ad{t21_i}")
plt.title("Toy 21: IDs lookup 2-D embeddings")
plt.legend()
plt.show()
""")
md("▶ What you'll see: six user/ad ID pairs become six vector pairs; their dot products are `[1.0, 0.2, 0.5, 1.0, 1.5, 1.2]`.")

md(r"""
## ✍️ Toy 22 · factorization-machine second-order term

An FM models feature interactions without hand-writing every cross. The second-order term sums
`x_i x_j (v_i · v_j)` over feature pairs.
""")
code(r"""
t22_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t22_X = np.array([[1, 0, 1, 1],
                  [0, 1, 1, 0],
                  [1, 1, 0, 0],
                  [0, 0, 1, 1],
                  [1, 0, 0, 1],
                  [0, 1, 0, 1]], dtype=float)                         # -> 6 rows × 4 sparse features
t22_V = np.array([[1.0, 0.0],
                  [0.0, 1.0],
                  [1.0, 1.0],
                  [0.5, 1.0]])                                       # -> 4 feature embeddings × 2 dims
t22_scores = []                                                       # -> FM interaction scores per row
for t22_row in t22_X:
    t22_terms = []                                                     # -> pair terms for this row
    for t22_i in range(4):
        for t22_j in range(t22_i + 1, 4):
            t22_term = t22_row[t22_i] * t22_row[t22_j] * (t22_V[t22_i] @ t22_V[t22_j])  # -> one pair term
            t22_terms.append(float(t22_term))                         # -> collect pair term
    t22_scores.append(sum(t22_terms))                                  # -> row interaction sum
t22_scores = np.array(t22_scores)                                     # -> [3.0, 1.0, 0.0, 1.5, 0.5, 1.0]
t22_first_pairs = [(0, 2, float(t22_V[0] @ t22_V[2])),
                   (0, 3, float(t22_V[0] @ t22_V[3])),
                   (2, 3, float(t22_V[2] @ t22_V[3]))]                # -> active row-0 pairs
print("row 0 active pair dot-products:", t22_first_pairs)
print("FM second-order score per row:", np.round(t22_scores, 3).tolist())
assert np.isclose(t22_scores[0], 3.0)
assert np.allclose(t22_scores, [3.0, 1.0, 0.0, 1.5, 0.5, 1.0])

plt.figure(figsize=(5.2, 3))
plt.bar(range(6), t22_scores, color="slateblue")
plt.xlabel("example")
plt.ylabel("FM interaction score")
plt.title("Toy 22: sum of pairwise embedding dot-products")
plt.show()
""")
md("▶ What you'll see: row 0's active pairs contribute `1.0 + 0.5 + 1.5 = 3.0`; every row gets its own FM interaction score.")

md(r"""
## ✍️ Toy 23 · Wide&Deep score fusion

Wide&Deep adds a memorized **wide** score to a generalized **deep** score. The final logit is the
sum of both parts plus a bias.
""")
code(r"""
t23_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t23_wide_X = np.array([[1, 0, 0],
                       [0, 1, 0],
                       [0, 0, 1],
                       [1, 0, 1],
                       [0, 1, 1],
                       [1, 1, 0]], dtype=float)                       # -> 6 rows × 3 wide cross features
t23_dense_X = np.array([[0.1, 0.9],
                        [0.8, 0.2],
                        [0.6, 0.6],
                        [0.2, 0.7],
                        [0.9, 0.4],
                        [0.4, 0.3]], dtype=float)                     # -> 6 rows × 2 dense features
t23_wide_w = np.array([0.4, -0.2, 0.8])                               # -> wide weights
t23_W1 = np.array([[1.0, -0.5],
                   [0.5, 1.0]])                                      # -> dense hidden weights
t23_b1 = np.array([0.0, 0.1])                                         # -> hidden bias
t23_w2 = np.array([0.7, -0.3])                                        # -> deep output weights
t23_bias = -0.1                                                       # -> final bias
t23_wide_score = t23_wide_X @ t23_wide_w                              # -> [0.4, -0.2, 0.8, 1.2, 0.6, 0.2]
t23_hidden_pre = t23_dense_X @ t23_W1 + t23_b1                        # -> hidden pre-activation
t23_hidden = np.maximum(t23_hidden_pre, 0.0)                           # -> ReLU hidden activation
t23_deep_score = t23_hidden @ t23_w2                                  # -> deep score
t23_logit = t23_bias + t23_wide_score + t23_deep_score                # -> fused logit
t23_prob = 1.0 / (1.0 + np.exp(-t23_logit))                           # -> fused probability
print("wide scores:", np.round(t23_wide_score, 3).tolist())
print("hidden activations:", np.round(t23_hidden, 3).tolist())
print("deep scores:", np.round(t23_deep_score, 3).tolist())
print("fused logits:", np.round(t23_logit, 3).tolist())
print("fused probabilities:", np.round(t23_prob, 3).tolist())
assert t23_logit.shape == (6,)
assert np.all((t23_prob > 0) & (t23_prob < 1))

plt.figure(figsize=(5.4, 3))
plt.bar(range(6), t23_wide_score, label="wide")
plt.bar(range(6), t23_deep_score, bottom=t23_wide_score, label="deep")
plt.axhline(0, color="black", lw=0.8)
plt.xlabel("example")
plt.ylabel("score contribution")
plt.title("Toy 23: final score = wide + deep + bias")
plt.legend()
plt.show()
""")
md("▶ What you'll see: each example gets a memorized wide score, a neural deep score, and a fused probability from their sum.")

md(r"""
## ✍️ Toy 24 · DCN cross layer

A Deep & Cross Network explicitly multiplies the original features back into the current layer:
`x_{l+1} = x0 * (x_l · w) + b + x_l`.
""")
code(r"""
t24_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t24_x0 = np.array([[1.0, 2.0, 0.0],
                   [0.0, 1.0, 1.0],
                   [2.0, 0.0, 1.0],
                   [1.0, 1.0, 1.0],
                   [0.5, 2.0, 1.0],
                   [2.0, 1.0, 0.0]])                                  # -> 6 rows × 3 dims
t24_xl = t24_x0.copy()                                                 # -> first cross layer starts at x0
t24_w = np.array([0.5, -0.25, 0.1])                                   # -> cross-layer weights
t24_b = np.array([0.1, 0.0, -0.1])                                    # -> cross-layer bias
t24_scalar = t24_xl @ t24_w                                           # -> [0.0, -0.15, 1.1, 0.35, -0.15, 0.75]
t24_cross = t24_x0 * t24_scalar[:, None]                              # -> feature-wise cross term
t24_x1 = t24_cross + t24_b + t24_xl                                   # -> next cross-layer output
print("scalar x_l dot w:", np.round(t24_scalar, 3).tolist())
print("first row cross term:", np.round(t24_cross[0], 3).tolist())
print("first row x1:", np.round(t24_x1[0], 3).tolist())
print("all x1 rows:", np.round(t24_x1, 3).tolist())
assert np.allclose(t24_x1[0], [1.1, 2.0, -0.1])
assert t24_x1.shape == t24_x0.shape

plt.figure(figsize=(5.4, 3.2))
plt.imshow(t24_x1, aspect="auto", cmap="coolwarm")
plt.colorbar(label="cross-layer value")
plt.xticks(range(3), ["f0", "f1", "f2"])
plt.yticks(range(6), [f"row {t24_i}" for t24_i in range(6)])
plt.title("Toy 24: one DCN cross layer output")
plt.show()
""")
md("▶ What you'll see: row 0 has scalar `0.0`, so its cross term is zero and the layer output is just `x0 + b = [1.1, 2.0, -0.1]`.")

md(r"""
## ✍️ Toy 25 · DeepFM final logit = linear + FM + deep

DeepFM keeps a linear term, an FM interaction term, and a neural term over the same features. The
mechanic is just adding those three scores before the sigmoid.
""")
code(r"""
t25_rng = np.random.default_rng(0)                                     # -> deterministic seed for this toy
t25_X = np.array([[1, 0, 1, 0],
                  [0, 1, 1, 0],
                  [1, 1, 0, 1],
                  [0, 0, 1, 1],
                  [1, 0, 0, 1],
                  [0, 1, 0, 1]], dtype=float)                         # -> 6 rows × 4 features
t25_linear_w = np.array([0.3, -0.1, 0.2, 0.4])                         # -> linear weights
t25_V = np.array([[1.0, 0.0],
                  [0.0, 1.0],
                  [1.0, 1.0],
                  [0.5, 1.0]])                                       # -> FM embeddings
t25_W1 = np.array([[0.4, -0.2],
                   [0.1, 0.3],
                   [0.5, 0.2],
                   [-0.1, 0.4]])                                     # -> deep hidden weights
t25_w2 = np.array([0.6, -0.2])                                        # -> deep output weights
t25_bias = -0.2                                                       # -> final bias
t25_linear = t25_X @ t25_linear_w                                     # -> linear score
t25_fm = []                                                           # -> FM score per row
for t25_row in t25_X:
    t25_pair_sum = 0.0                                                 # -> row pair accumulator
    for t25_i in range(4):
        for t25_j in range(t25_i + 1, 4):
            t25_pair_sum = t25_pair_sum + t25_row[t25_i] * t25_row[t25_j] * (t25_V[t25_i] @ t25_V[t25_j])  # -> add pair term
    t25_fm.append(float(t25_pair_sum))                                 # -> row FM sum
t25_fm = np.array(t25_fm)                                             # -> FM vector
t25_hidden = np.maximum(t25_X @ t25_W1, 0.0)                           # -> ReLU hidden vectors
t25_deep = t25_hidden @ t25_w2                                        # -> deep score
t25_logit = t25_bias + t25_linear + t25_fm + t25_deep                 # -> final DeepFM logit
t25_prob = 1.0 / (1.0 + np.exp(-t25_logit))                           # -> final probability
print("linear scores:", np.round(t25_linear, 3).tolist())
print("FM scores:", np.round(t25_fm, 3).tolist())
print("deep scores:", np.round(t25_deep, 3).tolist())
print("final probabilities:", np.round(t25_prob, 3).tolist())
assert t25_logit.shape == (6,)
assert np.all((t25_prob > 0) & (t25_prob < 1))

plt.figure(figsize=(5.6, 3))
plt.bar(range(6), t25_linear, label="linear")
plt.bar(range(6), t25_fm, bottom=t25_linear, label="FM")
plt.bar(range(6), t25_deep, bottom=t25_linear + t25_fm, label="deep")
plt.axhline(0, color="black", lw=0.8)
plt.xlabel("example")
plt.ylabel("score contribution")
plt.title("Toy 25: DeepFM sums linear + FM + deep")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the final DeepFM probability comes from adding three parts: memorized linear effects, FM pair interactions, and a deep score.")

# =================================================================== EXPLORE
md(r"""
## Step 2a · Look at each feature's shape

Always *look* at your data. Histograms show how each feature is spread out. `relevance`,
`ad_quality` are flat (uniform), `position` is spread across 1–10, `is_mobile` is two bars.
""")
code(r"""
fig, ax = plt.subplots(1, 4, figsize=(13, 2.8))
for a, (name, col, color) in zip(ax, [("relevance", relevance, BLUE), ("position", position, RED),
                                      ("ad_quality", ad_quality, GREEN), ("is_mobile", is_mobile, PURPLE)]):
    a.hist(col, bins=20, color=color); a.set_title(name)
plt.show()
""")

md(r"""
## Step 2b · Does each feature actually affect clicks?

If our rule is real, click rate should **rise** with relevance/quality and **fall** as
position goes down the page. If these were flat lines, there'd be nothing to learn.
""")
code(r"""
fig, ax = plt.subplots(1, 3, figsize=(13, 3.2))
data["rel_b"] = pd.cut(data.relevance, 10, labels=False)
ax[0].plot(data.groupby("rel_b").clicked.mean().values, "o-", color=BLUE)
ax[0].set_title("relevance ↑  →  clicks ↑"); ax[0].set_xlabel("relevance bucket")
data["q_b"] = pd.cut(data.ad_quality, 10, labels=False)
ax[1].plot(data.groupby("q_b").clicked.mean().values, "o-", color=GREEN)
ax[1].set_title("ad_quality ↑  →  clicks ↑"); ax[1].set_xlabel("quality bucket")
ax[2].plot(data.groupby("position").clicked.mean().values, "o-", color=RED)
ax[2].set_title("position ↓ the page  →  clicks ↓"); ax[2].set_xlabel("position (1=top)")
for a in ax: a.set_ylabel("click rate")
plt.show()
""")

# =================================================================== SPLIT
md(r"""
## Step 3 · Split into training and test sets

Never grade a model on the examples it studied — that's like giving a student the exam
answers. We keep **75%** to learn from (*train*) and hide **25%** to grade on (*test*).
We also separate the **features** `X` from the **label** `y`. `true_pctr` is NOT a feature
(in real life you never know it) — we only carry it along to grade ourselves at the end.
""")
code(r"""
from sklearn.model_selection import train_test_split

features = ["relevance", "position", "ad_quality", "is_mobile"]
X = data[features].to_numpy(dtype=float)
y = data["clicked"].to_numpy()

X_train, X_test, y_train, y_test, pctr_train, pctr_test = train_test_split(
    X, y, data.true_pctr.to_numpy(), test_size=0.25, random_state=42, stratify=y)
print("train impressions:", len(X_train), "| test impressions:", len(X_test))
print("click rate  train:", round(y_train.mean(),3), "| test:", round(y_test.mean(),3),
      " (stratify kept them equal)")
""")

# =================================================================== STANDARDIZE
md(r"""
## Step 4 · Standardize the features (put them on the same scale)

Our features live on different scales: `position` goes up to 10, the others up to 1. If we
train directly, `position` would shout over the others and learning would crawl. So we
**standardize**: subtract the mean and divide by the standard deviation, so every feature
becomes "how many standard deviations from average" (mean 0, spread 1).

We learn the mean/std on **train only** (Step 3's rule — never peek at the test set), then
apply the same transform to the test set.
""")
code(r"""
mu = X_train.mean(axis=0)          # learned on TRAIN only
sd = X_train.std(axis=0)
Xtr = (X_train - mu) / sd          # standardized train
Xte = (X_test  - mu) / sd          # same transform applied to test

for f, m, s in zip(features, mu, sd):
    print(f"{f:<11} mean {m:6.2f}  std {s:5.2f}   (after: mean 0, std 1)")
""")

# =================================================================== THE MATH
md(r"""
## Step 5 · Choose the model — why **logistic regression** (in PyTorch)

**The model choice.** We need to output a **probability** (0–1) for a yes/no event
(click / no-click). The simplest, most reliable tool for exactly that is **logistic
regression**. Why it's the right default for pCTR:
- it outputs a **calibrated probability**, not just a yes/no — and ad auctions need the
  actual number (they multiply pCTR × bid);
- it's **interpretable** — one weight per feature tells you each feature's effect and sign;
- it's **cheap and stable** to train and serve, so it's the baseline every ad team starts
  with and must beat before reaching for anything fancier.

**In PyTorch, logistic regression is literally one layer:** `nn.Linear(4, 1)` holds the
four weights + a bias and produces a **score**; we turn that score into a probability with
the **sigmoid**. We don't hand-derive the math anymore — PyTorch's **autograd** computes
the gradients and **Adam** takes the steps for us. `BCEWithLogitsLoss` is the log loss
(it applies the sigmoid internally, which is numerically safer).
""")
code(r"""
import torch, torch.nn as nn
torch.manual_seed(0)

# logistic regression = ONE linear layer: 4 features in -> 1 score out
model = nn.Linear(4, 1)
loss_fn = nn.BCEWithLogitsLoss()          # = log loss (applies sigmoid inside, safely)
optimizer = torch.optim.Adam(model.parameters(), lr=0.05)   # does the gradient steps for us

print("model:", model)
print("it holds", sum(p.numel() for p in model.parameters()), "numbers: 4 weights + 1 bias")
""")

# =================================================================== TRAIN (LOGGED)
md(r"""
## Step 6 · Train the model — and watch it learn (logging!)

Training repeats a simple loop for many rounds (*epochs*):
1. **predict** every impression's score with the current weights,
2. measure how wrong we are with **log loss**,
3. `loss.backward()` — PyTorch computes the gradients automatically (autograd),
4. `optimizer.step()` — nudge every weight downhill.

We **print the loss every 50 epochs** so you can watch it fall — that's the model
learning. First we turn our standardized arrays into PyTorch **tensors** (the arrays the
network consumes).
""")
code(r"""
X_train_t = torch.tensor(Xtr, dtype=torch.float32)          # standardized train features
y_train_t = torch.tensor(y_train, dtype=torch.float32).unsqueeze(1)

loss_history = []
print("epoch |  loss")
for epoch in range(400):
    optimizer.zero_grad()                 # reset last round's gradients
    logits = model(X_train_t)             # 1) predict a score per impression
    loss = loss_fn(logits, y_train_t)     # 2) how wrong? (log loss)
    loss.backward()                       # 3) autograd computes the gradients
    optimizer.step()                      # 4) step every weight downhill
    loss_history.append(loss.item())
    if epoch % 50 == 0:
        print(f"{epoch:5d} | {loss.item():.4f}")
print(f"{400:5d} | {loss_history[-1]:.4f}   <- final")
""")

md(r"""
## Step 7 · The learning curve

The numbers above, as a picture. A healthy run drops fast at first, then flattens as the
model runs out of things to learn. A flat line at the end means "done."
""")
code(r"""
plt.figure(figsize=(6, 3.4))
plt.plot(loss_history, color=PURPLE, lw=2)
plt.xlabel("epoch (training round)"); plt.ylabel("log loss (lower = better)")
plt.title("the model learning: error drops, then flattens"); plt.show()
print("loss went from", round(loss_history[0], 3), "to", round(loss_history[-1], 3))
""")

md(r"""
## Step 8 · Did it recover the TRUE rule?

We trained on **standardized** features, so the learned weights are in that scaled space.
We pull them out of the PyTorch layer (`model.weight`, `model.bias`) and convert them back
to the original scale (`weight / std`) to compare with the true rule from Step 1b. If the
model worked, these land close to the true weights we secretly used — a direct proof it
learned the real pattern from examples alone.
""")
code(r"""
w = model.weight.detach().numpy().ravel()   # the 4 learned weights (standardized space)
b = float(model.bias.detach())
w_raw = w / sd                              # convert back to the original feature scale
b_raw = b - (w * mu / sd).sum()

print(f"{'feature':<11} {'learned':>9} {'true':>7}")
for f, wl in zip(features, w_raw):
    print(f"{f:<11} {wl:>9.2f} {TRUE_WEIGHTS[f]:>7.2f}")
print(f"{'intercept':<11} {b_raw:>9.2f} {TRUE_BIAS:>7.2f}")

x = np.arange(len(features))
plt.figure(figsize=(6.5, 3.4))
plt.bar(x - 0.2, [TRUE_WEIGHTS[f] for f in features], 0.4, color=GRAY, label="true (secret) rule")
plt.bar(x + 0.2, w_raw, 0.4, color=GREEN, label="what the model learned")
plt.axhline(0, color="k", lw=.6); plt.xticks(x, features, rotation=15)
plt.ylabel("weight"); plt.legend(); plt.title("the model recovered the real rule"); plt.show()
""")

# =================================================================== PREDICT
md(r"""
## Step 9 · Make predictions on unseen impressions

Now use the trained model to predict click probabilities for the **test** set — data the
model never saw. We wrap it in `torch.no_grad()` (we're only predicting, not training) and
apply `torch.sigmoid` to turn the model's score into a probability.
""")
code(r"""
with torch.no_grad():
    scores = model(torch.tensor(Xte, dtype=torch.float32))     # scores on unseen test data
    pred_pctr = torch.sigmoid(scores).numpy().ravel()          # -> probabilities 0..1
show = pd.DataFrame(X_test, columns=features)
show["predicted_pctr"] = pred_pctr.round(3)
show["actually_clicked"] = y_test
print("a few predictions on impressions the model never saw:")
print(show.head(6).to_string(index=False))
""")

# =================================================================== AUC
md(r"""
## Step 10 · Does it *rank* well? (ROC and AUC)

A ranking model's first job is **ordering**: clicked ads should score higher than
non-clicked ones. **AUC** measures exactly that:

> pick one clicked and one non-clicked impression at random — AUC is the chance the model
> scored the clicked one higher.

0.5 = coin flip, 1.0 = perfect. Real ad models sit around 0.7–0.8.
""")
code(r"""
from sklearn.metrics import roc_auc_score, roc_curve
auc = roc_auc_score(y_test, pred_pctr)
fpr, tpr, _ = roc_curve(y_test, pred_pctr)
print("AUC on unseen test data:", round(auc, 3))

plt.figure(figsize=(4.6, 4.2))
plt.plot(fpr, tpr, color=BLUE, lw=2, label=f"our model (AUC={auc:.3f})")
plt.plot([0,1],[0,1], "k--", label="coin flip (0.5)")
plt.xlabel("false positive rate"); plt.ylabel("true positive rate")
plt.title("ROC — bowed to the top-left = good ranking"); plt.legend(); plt.show()
""")

# =================================================================== CALIBRATION
md(r"""
## Step 11 · Are the probabilities *honest*? (calibration)

Ranking isn't enough: ad systems multiply pCTR by the bid, so the number itself must be
truthful. **Calibration** checks that among impressions scored ~0.20, about 20% really get
clicked. We bucket by predicted probability and plot predicted (x) vs actual click rate
(y). On the diagonal = honest.
""")
code(r"""
from sklearn.calibration import calibration_curve
frac_pos, mean_pred = calibration_curve(y_test, pred_pctr, n_bins=10)
plt.figure(figsize=(4.6, 4.2))
plt.plot([0,1],[0,1], "k--", label="perfectly honest")
plt.plot(mean_pred, frac_pos, "o-", color=GREEN, label="our model")
plt.xlabel("predicted probability"); plt.ylabel("actual click rate")
plt.title("calibration: on the diagonal = trustworthy"); plt.legend(); plt.show()
""")

# =================================================================== RANKING
md(r"""
## Step 12 · Rank the ads — do clicked ones rise to the top?

The product output. Sort all impressions by predicted pCTR (highest first). A good model
puts the actually-clicked ones near the top. We log their **average rank** and show the
score histograms for clicked vs non-clicked — clicked (green) should sit to the right.
""")
code(r"""
order = np.argsort(-pred_pctr)
ranks = np.empty_like(order); ranks[order] = np.arange(1, len(order)+1)
clicked_ranks = ranks[y_test == 1]
print(f"clicked impressions land at average rank {clicked_ranks.mean():.0f} "
      f"out of {len(ranks)}  (top {100*clicked_ranks.mean()/len(ranks):.0f}%)")

plt.figure(figsize=(6, 3.4))
plt.hist(pred_pctr[y_test == 0], bins=30, alpha=.6, color=GRAY, label="not clicked")
plt.hist(pred_pctr[y_test == 1], bins=30, alpha=.7, color=GREEN, label="clicked")
plt.xlabel("predicted pCTR"); plt.ylabel("count")
plt.title("clicked impressions get higher scores"); plt.legend(); plt.show()
""")

# =================================================================== AUCTION
md(r"""
## Step 13 · pCTR × bid — ranking by *value*, not just clicks

An ad system wants **value**, not only clicks. Compare advertisers by
**expected value = pCTR × bid** (expected money per impression). A slightly less likely
click on a big bid can beat a likely click on a tiny bid. This is why **calibration
mattered** — a wrong probability makes this arithmetic wrong.
""")
code(r"""
cand = pd.DataFrame({"ad": ["A","B","C"], "bid": [8.0, 3.0, 5.0], "pctr": [0.010, 0.040, 0.020]})
cand["expected_value"] = cand.pctr * cand.bid
print(cand.to_string(index=False))
win = cand.sort_values("expected_value", ascending=False).iloc[0]
print(f"\nWinner: Ad {win.ad} (value {win.expected_value:.3f}) — not the biggest bid, not blindly the biggest pCTR.")
plt.figure(figsize=(4.8, 3))
plt.bar(cand.ad, cand.expected_value, color=[GRAY, GREEN, GRAY])
plt.ylabel("pCTR × bid"); plt.title("the auction ranks by expected value"); plt.show()
""")

# =================================================================== PROOF
md(r"""
## Step 14 · The proof — four graphs it's working

Because we invented the true click probability, we can compare predictions to reality:
1. **Predicted vs TRUE pCTR** — dots on the diagonal = recovered the real probability.
2. **Calibration** — predicted vs observed click rate on the diagonal = honest.
3. **Score distributions** — clicked (green) clearly right of not-clicked (grey).
4. **Predicted vs actual by group** — 10 groups low→high; bars (predicted) and dots
   (actual) match.
""")
code(r"""
fig, ax = plt.subplots(2, 2, figsize=(11, 8))
corr = np.corrcoef(pctr_test, pred_pctr)[0, 1]
ax[0,0].scatter(pctr_test, pred_pctr, s=6, alpha=.3, color=PURPLE); ax[0,0].plot([0,1],[0,1],"k--")
ax[0,0].set_xlabel("TRUE pCTR (hidden truth)"); ax[0,0].set_ylabel("predicted pCTR")
ax[0,0].set_title(f"(1) predicted vs true — corr={corr:.2f}")

frac_pos, mean_pred = calibration_curve(y_test, pred_pctr, n_bins=10)
ax[0,1].plot([0,1],[0,1],"k--"); ax[0,1].plot(mean_pred, frac_pos, "o-", color=GREEN)
ax[0,1].set_xlabel("predicted"); ax[0,1].set_ylabel("actual click rate"); ax[0,1].set_title("(2) calibration — honest")

ax[1,0].hist(pred_pctr[y_test==0], bins=30, alpha=.6, color=GRAY, label="not clicked")
ax[1,0].hist(pred_pctr[y_test==1], bins=30, alpha=.7, color=GREEN, label="clicked")
ax[1,0].legend(); ax[1,0].set_title("(3) clicked scored higher"); ax[1,0].set_xlabel("predicted pCTR")

dec = pd.qcut(pred_pctr, 10, labels=False, duplicates="drop")
gdf = pd.DataFrame({"d": dec, "pred": pred_pctr, "act": y_test}).groupby("d").mean()
ax[1,1].bar(gdf.index, gdf.pred, color=BLUE, alpha=.6, label="predicted")
ax[1,1].plot(gdf.index, gdf.act, "o-", color=RED, label="actual")
ax[1,1].set_xlabel("group (low → high pCTR)"); ax[1,1].set_ylabel("click rate")
ax[1,1].legend(); ax[1,1].set_title("(4) predicted matches actual")
plt.tight_layout(); plt.show()
print(f"AUC={auc:.3f} | predicted-vs-true correlation={corr:.3f} — the pipeline works.")
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## What you just did

You built a **pCTR model in PyTorch** and watched every step:
1. Made data with features + a click label.
2. Explored it; split train/test; **standardized** features.
3. **Chose logistic regression** and built it as one `nn.Linear` layer (Step 5).
4. **Trained** with a PyTorch loop, logging the loss as it fell (Steps 6–7).
5. Proved it **recovered the true rule** (Step 8).
6. Predicted, then measured **ranking (AUC)** and **honesty (calibration)**.
7. Ranked ads and combined **pCTR × bid** for the auction.
8. Confirmed correctness with **four proof graphs**.

**Why logistic regression here?** It outputs a *calibrated probability* (what auctions
need), it's *interpretable* (one weight per feature), and it's the *cheap, stable
baseline* every ad team starts from. Using PyTorch means the exact same training loop
scales up to the deep models in M7.3 — you just swap the one `nn.Linear` for a bigger
network.

**Where this sits in M7:** this was a single **pointwise pCTR** head (M7.1). M7.2 adds
pairwise/listwise ranking; M7.3 adds multi-objective heads (click + dwell + value) and CTR
architectures. The calibration you saw is what module **M8** teaches you to measure and
repair. **Next:** the companion *full pipeline* notebook trains **CTR + VTR + LTR together
with user history** — the shape of a real production ranker.
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M07 · Ranking & CTR — pCTR pipeline (granular)", "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M07-ranking-ctr-family.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
