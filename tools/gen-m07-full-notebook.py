#!/usr/bin/env python3
"""Generate afp/notebooks/M07-full-ranking-pipeline.ipynb.

A fully runnable, VERY beginner-friendly Colab notebook that builds the shape of a
real production ad ranker: ONE shared-bottom multi-task model (in PyTorch) that predicts
THREE outcomes at once -- CTR (click), VTR (video view), LTR (lead/conversion) -- using
user-history features, then combines the heads into a serving score.

Granular: many small cells, plain-language explanations of every idea (including the
model choice), logging (per-epoch loss curves, per-head AUC), lots of visualizations, a
history ablation that proves history helps, and per-head proof graphs.

Colab-preinstalled libraries only (pandas/numpy/scikit-learn/matplotlib/torch).

Run: python3 tools/gen-m07-full-notebook.py
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
# M7 · The Full Ranking Pipeline — CTR + VTR + LTR + History (for a New Student)

**Companion to lesson M7. Assumes no prior ML.** The other M7 notebook built one model
for one thing (clicks). Real ad rankers predict **several things at once** and use your
**history**. This notebook builds that shape, end to end, in tiny explained steps.

### First, the vocabulary (three "p" numbers a ranker predicts)
For each ad shown to a person, the model predicts three probabilities:
- **CTR** — *Click-Through Rate*: chance they **click** the ad.
- **VTR** — *View-Through Rate*: chance they **watch/view** it (mostly for video ads).
- **LTR** — *Lead-Through Rate*: chance it leads to a **conversion/lead** (a signup, a form).

And **history**: what this person did *before* — e.g. how much they engaged with *similar*
ads in the past. History is one of the strongest signals in real systems, so we'll include
it and then **prove** it helps.

### The big idea: one model, three heads (multi-task)
Instead of training three separate models, we train **one** network with a shared body and
**three output "heads"** (one per outcome). Sharing lets the three tasks help each other
and is far cheaper to serve. This is the **shared-bottom** design from lesson M7.3.

Run each cell with **Shift+Enter**; read the note above it first.
""")

# =================================================================== SETUP + STATIC FEATURES
md(r"""
## Step 1 · Set up and create the *static* features

An **example** = one ad shown to one person (an *impression*). Static features are things
about the ad and the slot that don't depend on the person's past:
- `relevance` (0–1), `ad_quality` (0–1), `price` (0–1, the advertiser's price tier),
- `position` (1–10, slot on the page), `is_video` (1 = video ad).
""")
code(r"""
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD, GRAY = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974", "#888"
HEADS = ["CTR", "VTR", "LTR"]; HEAD_COLORS = [BLUE, GREEN, PURPLE]

rng = np.random.default_rng(7)
N = 8000

relevance  = rng.uniform(0, 1, N)
ad_quality = rng.uniform(0, 1, N)
price      = rng.uniform(0, 1, N)
position   = rng.integers(1, 11, N)
is_video   = rng.integers(0, 2, N)
print("created", N, "impressions with 5 static features")
print("share of video ads:", round(is_video.mean(), 2))
""")

# =================================================================== TOY EXAMPLES
md("---\n# Part 0 · ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the full notebook, here is **one tiny, hand-traceable toy for each computing mechanic**
in the ranking pipeline: candidate scoring, business filtering, de-duplication, history
features, three outcome rules, labels, matrices, buckets, splitting, scaling, the shared
model, loss, one training step, AUC, calibration, blending, sorting, auction value,
diversity re-ranking, nDCG, ablation, and prediction-vs-actual proof. Each toy uses only
NumPy + Matplotlib, prints every intermediate value, and draws exactly one picture.
""")

md(r"""
## ✍️ Toy 1 · candidate retrieval scoring by hand

A retrieval stage gives each candidate a quick score, often a dot product between a small
feature vector and weights. Trace 6 candidates with 3 features: relevance, quality, and
freshness. The top few become the candidate set for later filters and rankers.
""")
code(r"""
t01_features = np.array([[1, 3, 0],
                         [2, 2, 1],
                         [3, 1, 0],
                         [0, 3, 2],
                         [2, 0, 2],
                         [1, 1, 3]], float)                         # -> 6 candidates x 3 features
print("features [relevance, quality, freshness]:")
print(t01_features.astype(int))

t01_weights = np.array([0.5, 0.3, 0.2])                             # -> retrieval weights
print("weights:", t01_weights.tolist())

t01_scores = t01_features @ t01_weights                             # -> [1.4, 1.8, 1.8, 1.3, 1.4, 1.4]
print("dot-product scores:", np.round(t01_scores, 2).tolist())

t01_order = np.argsort(-t01_scores)                                  # -> [1, 2, 5, 0, 4, 3]
print("candidates sorted high to low:", t01_order.tolist())

t01_top3 = t01_order[:3]                                             # -> [1, 2, 5]
print("retrieved top-3:", t01_top3.tolist())
assert t01_top3.tolist() == [1, 2, 5]

plt.figure(figsize=(5, 3))
plt.bar(np.arange(6), t01_scores, color="steelblue")
plt.scatter(t01_top3, t01_scores[t01_top3], s=160, facecolors="none", edgecolors="black", linewidths=2)
plt.xlabel("candidate id")
plt.ylabel("retrieval score")
plt.title("Toy 1: dot-product retrieval keeps the top-3")
plt.show()
""")
md("▶ What you'll see: 6 tiny feature rows become scores `[1.4, 1.8, 1.8, 1.3, 1.4, 1.4]`, "
   "so candidates `[1, 2, 5]` are retrieved before the heavier ranking work.")

md(r"""
## ✍️ Toy 2 · business-rule filtering by hand

After retrieval, hard rules remove candidates that are not eligible: policy blocks, empty
budget, or a frequency cap. This is not model scoring; it is a deterministic yes/no mask.
""")
code(r"""
t02_ids = np.arange(6)                                               # -> [0, 1, 2, 3, 4, 5]
print("candidate ids:", t02_ids.tolist())

t02_score = np.array([0.82, 0.76, 0.91, 0.64, 0.88, 0.71])           # -> model/retrieval score
print("scores:", t02_score.tolist())

t02_policy_ok = np.array([1, 1, 0, 1, 1, 1])                         # -> candidate 2 fails policy
print("policy_ok:", t02_policy_ok.tolist())

t02_budget_ok = np.array([1, 0, 1, 1, 1, 1])                         # -> candidate 1 has no budget
print("budget_ok:", t02_budget_ok.tolist())

t02_seen_today = np.array([2, 4, 1, 1, 3, 2])                        # -> candidate 1 also over cap 3
print("seen_today:", t02_seen_today.tolist())

t02_mask = (t02_policy_ok == 1) & (t02_budget_ok == 1) & (t02_seen_today <= 3)  # -> [True, False, False, True, True, True]
print("eligible mask:", t02_mask.tolist())

t02_kept = t02_ids[t02_mask]                                         # -> [0, 3, 4, 5]
print("kept after hard filters:", t02_kept.tolist())
assert t02_kept.tolist() == [0, 3, 4, 5]

plt.figure(figsize=(5, 3))
plt.bar(t02_ids, t02_score, color=np.where(t02_mask, "seagreen", "lightgray"))
plt.xlabel("candidate id")
plt.ylabel("score")
plt.title("Toy 2: hard filters remove ineligible candidates")
plt.show()
""")
md("▶ What you'll see: high-scoring candidate 2 still disappears because policy fails; "
   "filters keep only `[0, 3, 4, 5]` for downstream ranking.")

md(r"""
## ✍️ Toy 3 · de-duplicate by keeping the best item per group

Real candidate generators can return near-duplicates from the same campaign or advertiser.
De-duplication groups candidates and keeps the highest-scoring one in each group.
""")
code(r"""
t03_ids = np.arange(6)                                               # -> [0, 1, 2, 3, 4, 5]
print("candidate ids:", t03_ids.tolist())

t03_campaign = np.array([10, 10, 11, 12, 12, 13])                    # -> duplicates in campaigns 10 and 12
print("campaign ids:", t03_campaign.tolist())

t03_score = np.array([0.80, 0.85, 0.70, 0.90, 0.88, 0.65])           # -> candidate scores
print("scores:", t03_score.tolist())

t03_groups = np.unique(t03_campaign)                                 # -> [10, 11, 12, 13]
print("unique campaigns:", t03_groups.tolist())

t03_kept = []
for t03_group in t03_groups:
    t03_members = np.where(t03_campaign == t03_group)[0]             # -> members for this campaign
    print(f"campaign {t03_group} members:", t03_members.tolist())
    t03_member_scores = t03_score[t03_members]                       # -> scores inside group
    print(f"campaign {t03_group} scores:", t03_member_scores.tolist())
    t03_best_member = t03_members[np.argmax(t03_member_scores)]       # -> best id in group
    print(f"keep candidate {int(t03_best_member)}")
    t03_kept.append(int(t03_best_member))

t03_kept = np.array(t03_kept)                                        # -> [1, 2, 3, 5]
print("deduped candidate ids:", t03_kept.tolist())
assert t03_kept.tolist() == [1, 2, 3, 5]

plt.figure(figsize=(5, 3))
plt.bar(t03_ids, t03_score, color=np.where(np.isin(t03_ids, t03_kept), "seagreen", "lightgray"))
plt.xlabel("candidate id")
plt.ylabel("score")
plt.title("Toy 3: keep the best candidate per campaign")
plt.show()
""")
md("▶ What you'll see: campaigns 10 and 12 each produce two candidates, but de-dup keeps "
   "`[1, 2, 3, 5]`: the best scorer from every campaign group.")

md(r"""
## ✍️ Toy 4 · candidate-aware history affinity by hand

The notebook uses `hist_affinity`: how much this user liked ads similar to the candidate.
Here, each past event and the candidate have 3 topic bits; matching topics get age-weighted.
""")
code(r"""
t04_history = np.array([[1, 0, 1],
                        [0, 1, 1],
                        [1, 1, 0],
                        [0, 0, 1]], float)                          # -> 4 past events x 3 topics
print("history topic bits:")
print(t04_history.astype(int))

t04_age_weight = np.array([1.0, 0.7, 0.4, 0.2])                      # -> recent events count more
print("age weights:", t04_age_weight.tolist())

t04_candidate = np.array([1, 0, 1], float)                           # -> candidate topics
print("candidate topic bits:", t04_candidate.astype(int).tolist())

t04_matches = t04_history @ t04_candidate                            # -> [2.0, 1.0, 1.0, 1.0]
print("topic matches per event:", t04_matches.tolist())

t04_weighted = t04_age_weight * t04_matches                          # -> [2.0, 0.7, 0.4, 0.2]
print("age-weighted matches:", t04_weighted.tolist())

t04_affinity = t04_weighted.sum() / t04_age_weight.sum() / 2.0        # -> 0.717391304347826
print("history affinity:", round(float(t04_affinity), 3))
assert np.isclose(t04_affinity, 0.717391304347826)

plt.figure(figsize=(5, 3))
plt.bar(np.arange(4), t04_weighted, color="mediumpurple")
plt.xlabel("past event")
plt.ylabel("weighted match")
plt.title("Toy 4: candidate-aware history affinity")
plt.show()
""")
md("▶ What you'll see: the candidate matches the recent event strongly, giving a hand-computed "
   "history affinity of about `0.717`.")

md(r"""
## ✍️ Toy 5 · three outcome logits and sigmoid probabilities

CTR, VTR, and LTR use different rules. A linear logit combines features, then `sigmoid`
turns each logit into a probability between 0 and 1.
""")
code(r"""
t05_X = np.array([[0.2, 0.8, 0.1, 0.0],
                  [0.7, 0.4, 0.3, 0.5],
                  [0.9, 0.6, 0.8, 0.8],
                  [0.4, 0.2, 0.9, 0.3],
                  [0.6, 0.9, 0.2, 0.7],
                  [0.1, 0.3, 0.6, 0.2]])                            # -> 6 rows x [rel, quality, price, history]
print("features [rel, quality, price, history]:")
print(t05_X)

t05_ctr_logit = -2.0 + 2.0*t05_X[:, 0] + 0.5*t05_X[:, 1] + 1.0*t05_X[:, 3]  # -> [-1.2, 0.1, 0.9, -0.8, 0.35, -1.45]
print("CTR logits:", np.round(t05_ctr_logit, 2).tolist())

t05_vtr_logit = -1.0 + 1.2*t05_X[:, 1] + 0.8*t05_X[:, 3]              # -> [-0.04, -0.12, 0.36, -0.52, 0.64, -0.48]
print("VTR logits:", np.round(t05_vtr_logit, 2).tolist())

t05_ltr_logit = -2.2 + 1.5*t05_X[:, 2] + 1.2*t05_X[:, 3]              # -> [-2.05, -1.15, -0.04, -0.49, -1.06, -1.06]
print("LTR logits:", np.round(t05_ltr_logit, 2).tolist())

t05_logits = np.column_stack([t05_ctr_logit, t05_vtr_logit, t05_ltr_logit])  # -> 6 x 3 logits
print("all logits:")
print(np.round(t05_logits, 2))

t05_prob = 1.0 / (1.0 + np.exp(-t05_logits))                         # -> probabilities
print("sigmoid probabilities:")
print(np.round(t05_prob, 3))
assert np.allclose(np.round(t05_prob[2], 3), [0.711, 0.589, 0.490])

plt.figure(figsize=(5.5, 3))
plt.plot(t05_prob[:, 0], "o-", label="pCTR")
plt.plot(t05_prob[:, 1], "o-", label="pVTR")
plt.plot(t05_prob[:, 2], "o-", label="pLTR")
plt.xlabel("candidate id")
plt.ylabel("probability")
plt.title("Toy 5: three heads, three probability columns")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the same 6 candidates get three different probability columns; candidate 2 "
   "is strongest for all three in this tiny hand-built rule.")

md(r"""
## ✍️ Toy 6 · seeded Bernoulli labels from probabilities

To create labels, compare each probability with a random draw. If the draw is smaller than
the probability, the event happened. The seed makes the coin flips repeatable.
""")
code(r"""
t06_rng = np.random.default_rng(0)                                   # -> deterministic toy randomness
print("seeded generator: default_rng(0)")

t06_prob = np.array([0.119, 0.401, 0.500, 0.690, 0.832, 0.900])       # -> event probabilities
print("probabilities:", t06_prob.tolist())

t06_draw = t06_rng.random(6)                                         # -> [0.637, 0.270, 0.041, 0.017, 0.813, 0.913]
print("random draws:", np.round(t06_draw, 3).tolist())

t06_label = (t06_draw < t06_prob).astype(int)                        # -> [0, 1, 1, 1, 1, 0]
print("labels draw < probability:", t06_label.tolist())
assert t06_label.tolist() == [0, 1, 1, 1, 1, 0]

plt.figure(figsize=(5, 3))
plt.plot(t06_prob, "o-", label="probability")
plt.plot(t06_draw, "s-", label="random draw")
plt.scatter(np.arange(6), t06_label, c=np.where(t06_label == 1, "seagreen", "lightgray"), s=90, label="label")
plt.xlabel("example id")
plt.title("Toy 6: label is 1 when draw < probability")
plt.legend()
plt.show()
""")
md("▶ What you'll see: with seed 0, the draws make labels `[0, 1, 1, 1, 1, 0]`; "
   "these are the tiny version of the notebook's simulated clicks/views/leads.")

md(r"""
## ✍️ Toy 7 · stack feature and label matrices, then compute base rates

Training code wants `X` as a feature matrix and `Y` as a label matrix. Base rate is just the
mean of each label column.
""")
code(r"""
t07_rel = np.array([1, 2, 3, 1, 2, 3], float)                        # -> feature column 1
print("relevance column:", t07_rel.tolist())

t07_quality = np.array([3, 2, 1, 2, 3, 1], float)                    # -> feature column 2
print("quality column:", t07_quality.tolist())

t07_history = np.array([0, 1, 1, 0, 1, 0], float)                    # -> feature column 3
print("history column:", t07_history.tolist())

t07_X = np.column_stack([t07_rel, t07_quality, t07_history])          # -> shape (6, 3)
print("X matrix:")
print(t07_X.astype(int))

t07_Y = np.array([[1, 0, 0],
                  [0, 1, 0],
                  [1, 1, 0],
                  [0, 0, 0],
                  [1, 1, 1],
                  [0, 1, 0]])                                       # -> shape (6, 3)
print("Y matrix [clicked, viewed, lead]:")
print(t07_Y)

t07_base_rates = t07_Y.mean(axis=0)                                  # -> [0.5, 0.6666666667, 0.1666666667]
print("base rates:", np.round(t07_base_rates, 3).tolist())
assert np.allclose(t07_base_rates, [0.5, 2/3, 1/6])

plt.figure(figsize=(5, 3))
plt.bar(["CTR", "VTR", "LTR"], t07_base_rates, color=["steelblue", "seagreen", "mediumpurple"])
plt.ylabel("share that happened")
plt.title("Toy 7: base rate = column mean of Y")
plt.show()
""")
md("▶ What you'll see: six examples stack into `X` and `Y`; column means give base rates "
   "`CTR=0.50`, `VTR=0.67`, `LTR=0.17`.")

md(r"""
## ✍️ Toy 8 · bucket history affinity and compute outcome rates

The notebook checks whether higher history affinity means higher outcomes. Bucket each
example, then average labels inside each bucket.
""")
code(r"""
t08_affinity = np.array([0.05, 0.18, 0.33, 0.46, 0.62, 0.79, 0.88, 0.96])  # -> 8 tiny affinities
print("history affinity:", t08_affinity.tolist())

t08_clicked = np.array([0, 0, 1, 0, 1, 1, 1, 1])                    # -> labels
print("clicked labels:", t08_clicked.tolist())

t08_bucket = np.minimum((t08_affinity * 4).astype(int), 3)           # -> [0, 0, 1, 1, 2, 3, 3, 3]
print("bucket id:", t08_bucket.tolist())

t08_rates = []
for t08_b in range(4):
    t08_idx = np.where(t08_bucket == t08_b)[0]                       # -> examples in bucket b
    print(f"bucket {t08_b} examples:", t08_idx.tolist())
    t08_rate = t08_clicked[t08_idx].mean()                           # -> bucket click rate
    print(f"bucket {t08_b} click rate:", round(float(t08_rate), 3))
    t08_rates.append(float(t08_rate))

t08_rates = np.array(t08_rates)                                      # -> [0.0, 0.5, 1.0, 1.0]
print("bucket rates:", t08_rates.tolist())
assert t08_rates.tolist() == [0.0, 0.5, 1.0, 1.0]

plt.figure(figsize=(5, 3))
plt.plot(np.arange(4), t08_rates, "o-", color="seagreen")
plt.xlabel("history-affinity bucket")
plt.ylabel("click rate")
plt.title("Toy 8: higher history bucket, higher outcome rate")
plt.show()
""")
md("▶ What you'll see: bucket rates rise from `0.0` to `1.0`, the tiny version of the "
   "history-signal plot in the full notebook.")

md(r"""
## ✍️ Toy 9 · train/test split with a seeded permutation

Train/test split is just shuffling row ids, taking some for training, and hiding the rest
for evaluation. The seed makes the split repeatable.
""")
code(r"""
t09_rng = np.random.default_rng(0)                                   # -> deterministic split
print("seeded generator: default_rng(0)")

t09_ids = np.arange(8)                                               # -> [0, 1, 2, 3, 4, 5, 6, 7]
print("row ids:", t09_ids.tolist())

t09_perm = t09_rng.permutation(t09_ids)                              # -> [2, 4, 3, 6, 5, 0, 1, 7]
print("shuffled ids:", t09_perm.tolist())

t09_train = t09_perm[:6]                                             # -> [2, 4, 3, 6, 5, 0]
print("train ids:", t09_train.tolist())

t09_test = t09_perm[6:]                                              # -> [1, 7]
print("test ids:", t09_test.tolist())
assert t09_train.tolist() == [2, 4, 3, 6, 5, 0]
assert t09_test.tolist() == [1, 7]

plt.figure(figsize=(5, 2.5))
plt.scatter(t09_train, np.zeros_like(t09_train), s=120, label="train")
plt.scatter(t09_test, np.ones_like(t09_test), s=120, label="test")
plt.yticks([0, 1], ["train", "test"])
plt.xlabel("row id")
plt.title("Toy 9: seeded train/test split")
plt.legend()
plt.show()
""")
md("▶ What you'll see: seed 0 gives train ids `[2, 4, 3, 6, 5, 0]` and test ids `[1, 7]`; "
   "evaluation later uses only the hidden test rows.")

md(r"""
## ✍️ Toy 10 · standardize features using train statistics only

Standardization subtracts the training mean and divides by the training standard deviation.
The test set must use the same train mean/std so evaluation stays honest.
""")
code(r"""
t10_train_raw = np.array([[1, 10],
                          [2, 14],
                          [3, 18],
                          [4, 22]], float)                          # -> 4 train rows x 2 features
print("raw train features:")
print(t10_train_raw.astype(int))

t10_mean = t10_train_raw.mean(axis=0)                                # -> [2.5, 16.0]
print("train mean:", t10_mean.tolist())

t10_std = t10_train_raw.std(axis=0)                                  # -> [1.1180339887, 4.472135955]
print("train std:", np.round(t10_std, 3).tolist())

t10_train_z = (t10_train_raw - t10_mean) / t10_std                   # -> standardized train rows
print("standardized train:")
print(np.round(t10_train_z, 2))

t10_test_raw = np.array([[5, 26]], float)                            # -> one hidden test row
print("raw test feature:", t10_test_raw.tolist())

t10_test_z = (t10_test_raw - t10_mean) / t10_std                     # -> [[2.236, 2.236]]
print("standardized test using TRAIN stats:", np.round(t10_test_z, 2).tolist())
assert np.allclose(np.round(t10_test_z, 2), [[2.24, 2.24]])

plt.figure(figsize=(5, 3))
plt.scatter(t10_train_raw[:, 0], t10_train_raw[:, 1], label="raw train")
plt.scatter(t10_train_z[:, 0], t10_train_z[:, 1], label="standardized train")
plt.scatter(t10_test_z[:, 0], t10_test_z[:, 1], marker="*", s=180, label="standardized test")
plt.xlabel("feature 1")
plt.ylabel("feature 2")
plt.title("Toy 10: standardization uses train mean/std")
plt.legend()
plt.show()
""")
md("▶ What you'll see: train values move to roughly mean 0 and std 1; the test row is transformed "
   "with those same train statistics, not its own.")

md(r"""
## ✍️ Toy 11 · shared-bottom forward pass with three heads

A shared-bottom ranker first computes one hidden representation, then three heads produce
CTR/VTR/LTR logits. This toy does the forward pass with tiny NumPy matrices.
""")
code(r"""
t11_X = np.array([[0.2, 0.6, 1.0],
                  [0.8, 0.1, 0.0]], float)                          # -> 2 examples x 3 features
print("input X:")
print(t11_X)

t11_W_body = np.array([[1.0, -1.0],
                       [0.5, 0.5],
                       [-0.2, 0.3]])                                # -> 3 features to 2 hidden units
print("body weights:")
print(t11_W_body)

t11_b_body = np.array([0.1, -0.2])                                   # -> hidden bias
print("body bias:", t11_b_body.tolist())

t11_hidden_raw = t11_X @ t11_W_body + t11_b_body                     # -> [[0.4, 0.2], [0.95, -0.95]]
print("raw hidden values:")
print(np.round(t11_hidden_raw, 3))

t11_hidden = np.maximum(t11_hidden_raw, 0.0)                         # -> ReLU [[0.4, 0.2], [0.95, 0.0]]
print("ReLU hidden values:")
print(np.round(t11_hidden, 3))

t11_W_heads = np.array([[1.0, -0.5, 0.2],
                        [0.3, 0.8, -0.4]])                          # -> 2 hidden units to 3 heads
print("head weights:")
print(t11_W_heads)

t11_b_heads = np.array([-0.1, 0.0, 0.2])                             # -> 3 head biases
print("head bias:", t11_b_heads.tolist())

t11_logits = t11_hidden @ t11_W_heads + t11_b_heads                  # -> [[0.36, -0.04, 0.2], [0.85, -0.475, 0.39]]
print("head logits:")
print(np.round(t11_logits, 3))

t11_prob = 1.0 / (1.0 + np.exp(-t11_logits))                         # -> [[0.589, 0.49, 0.55], [0.701, 0.383, 0.596]]
print("head probabilities:")
print(np.round(t11_prob, 3))

t11_param_count = t11_W_body.size + t11_b_body.size + t11_W_heads.size + t11_b_heads.size  # -> 17
print("learnable numbers:", int(t11_param_count))
assert int(t11_param_count) == 17
assert np.allclose(np.round(t11_prob[0], 3), [0.589, 0.490, 0.550])

plt.figure(figsize=(5, 3))
plt.imshow(t11_prob, vmin=0, vmax=1, cmap="viridis")
plt.xticks([0, 1, 2], ["pCTR", "pVTR", "pLTR"])
plt.yticks([0, 1], ["ex0", "ex1"])
plt.colorbar(label="probability")
plt.title("Toy 11: shared body feeds three heads")
plt.show()
""")
md("▶ What you'll see: two examples pass through one shared hidden layer, then split into "
   "three probability heads with 17 tiny learnable numbers.")

md(r"""
## ✍️ Toy 12 · multi-task BCE loss, one column per head

Binary cross-entropy measures probability error for each head. The notebook sums the three
head losses so one shared model learns all tasks at once.
""")
code(r"""
t12_logits = np.array([[-1.0, 0.5, 1.2],
                       [0.8, -0.4, 0.0]])                           # -> 2 examples x 3 head logits
print("logits:")
print(t12_logits)

t12_y = np.array([[0, 1, 1],
                  [1, 0, 0]])                                       # -> true labels
print("labels:")
print(t12_y)

t12_p = 1.0 / (1.0 + np.exp(-t12_logits))                           # -> [[0.269, 0.622, 0.769], [0.69, 0.401, 0.5]]
print("sigmoid probabilities:")
print(np.round(t12_p, 3))

t12_bce = -(t12_y*np.log(t12_p) + (1 - t12_y)*np.log(1 - t12_p))     # -> per-example, per-head BCE
print("BCE per example/head:")
print(np.round(t12_bce, 3))

t12_per_head = t12_bce.mean(axis=0)                                  # -> [0.342, 0.494, 0.478]
print("mean BCE per head:", np.round(t12_per_head, 3).tolist())

t12_total = t12_per_head.sum()                                       # -> 1.313942118972018
print("summed multi-task loss:", round(float(t12_total), 3))
assert np.isclose(t12_total, 1.313942118972018)

plt.figure(figsize=(5, 3))
plt.bar(["CTR", "VTR", "LTR"], t12_per_head, color=["steelblue", "seagreen", "mediumpurple"])
plt.ylabel("mean BCE")
plt.title("Toy 12: total loss = sum of head losses")
plt.show()
""")
md("▶ What you'll see: each head has its own BCE, and the shared model optimizes their sum "
   "`0.342 + 0.494 + 0.478 ≈ 1.314`.")

md(r"""
## ✍️ Toy 13 · one gradient step lowers a tiny logistic loss

The real notebook uses PyTorch autograd. Here is the same idea by hand for one logistic
head: compute probabilities, a gradient, update weights, and verify the loss goes down.
""")
code(r"""
t13_X = np.array([[0, 0],
                  [1, 0],
                  [0, 1],
                  [1, 1],
                  [2, 1],
                  [1, 2]], float)                                   # -> 6 examples x 2 features
print("training X:")
print(t13_X.astype(int))

t13_y = np.array([0, 0, 0, 1, 1, 1], float)                          # -> labels
print("labels:", t13_y.astype(int).tolist())

t13_w = np.array([0.1, 0.1])                                         # -> initial weights
print("initial weights:", t13_w.tolist())

t13_b = -0.2                                                         # -> initial bias
print("initial bias:", t13_b)

t13_z = t13_X @ t13_w + t13_b                                       # -> [-0.2, -0.1, -0.1, 0.0, 0.1, 0.1]
print("initial logits:", np.round(t13_z, 3).tolist())

t13_p = 1.0 / (1.0 + np.exp(-t13_z))                                # -> [0.45, 0.475, 0.475, 0.5, 0.525, 0.525]
print("initial probabilities:", np.round(t13_p, 3).tolist())

t13_loss = -(t13_y*np.log(t13_p) + (1 - t13_y)*np.log(1 - t13_p)).mean()  # -> 0.6448121150393035
print("initial loss:", round(float(t13_loss), 3))

t13_error = t13_p - t13_y                                           # -> probability minus label
print("probability error:", np.round(t13_error, 3).tolist())

t13_grad_w = t13_X.T @ t13_error / len(t13_y)                       # -> [-0.2416736, -0.2416736]
print("weight gradient:", np.round(t13_grad_w, 3).tolist())

t13_grad_b = t13_error.mean()                                       # -> -0.008305666218746325
print("bias gradient:", round(float(t13_grad_b), 3))

t13_lr = 0.8                                                        # -> learning rate
print("learning rate:", t13_lr)

t13_w2 = t13_w - t13_lr*t13_grad_w                                  # -> [0.29333888, 0.29333888]
print("updated weights:", np.round(t13_w2, 3).tolist())

t13_b2 = t13_b - t13_lr*t13_grad_b                                  # -> -0.19335546702500295
print("updated bias:", round(float(t13_b2), 3))

t13_z2 = t13_X @ t13_w2 + t13_b2                                    # -> updated logits
print("updated logits:", np.round(t13_z2, 3).tolist())

t13_p2 = 1.0 / (1.0 + np.exp(-t13_z2))                              # -> updated probabilities
print("updated probabilities:", np.round(t13_p2, 3).tolist())

t13_loss2 = -(t13_y*np.log(t13_p2) + (1 - t13_y)*np.log(1 - t13_p2)).mean()  # -> 0.5701459017136988
print("updated loss:", round(float(t13_loss2), 3))
assert t13_loss2 < t13_loss

plt.figure(figsize=(4.5, 3))
plt.bar(["before", "after"], [t13_loss, t13_loss2], color=["lightgray", "seagreen"])
plt.ylabel("BCE loss")
plt.title("Toy 13: one gradient step lowers loss")
plt.show()
""")
md("▶ What you'll see: one explicit update moves the loss from `0.645` down to `0.570`, "
   "the tiny version of the training loop's repeated updates.")

md(r"""
## ✍️ Toy 14 · AUC by positive-vs-negative pairs

AUC is the fraction of positive/negative pairs where the positive example has the higher
score. Count those pair wins directly on 6 examples.
""")
code(r"""
t14_score = np.array([0.9, 0.8, 0.4, 0.7, 0.3, 0.2])                # -> predicted scores
print("scores:", t14_score.tolist())

t14_y = np.array([1, 1, 0, 0, 1, 0])                                # -> labels
print("labels:", t14_y.tolist())

t14_pos = t14_score[t14_y == 1]                                     # -> [0.9, 0.8, 0.3]
print("positive scores:", t14_pos.tolist())

t14_neg = t14_score[t14_y == 0]                                     # -> [0.4, 0.7, 0.2]
print("negative scores:", t14_neg.tolist())

t14_wins = (t14_pos[:, None] > t14_neg[None, :]).astype(float)       # -> pairwise wins matrix
print("positive beats negative matrix:")
print(t14_wins.astype(int))

t14_ties = (t14_pos[:, None] == t14_neg[None, :]).astype(float)      # -> all zeros here
print("ties matrix:")
print(t14_ties.astype(int))

t14_auc = (t14_wins + 0.5*t14_ties).mean()                           # -> 0.7777777777777778
print("AUC:", round(float(t14_auc), 3))
assert np.isclose(t14_auc, 7/9)

plt.figure(figsize=(4.5, 3))
plt.imshow(t14_wins, cmap="Greens", vmin=0, vmax=1)
plt.xlabel("negative example")
plt.ylabel("positive example")
plt.title("Toy 14: AUC counts pair wins")
plt.colorbar(label="positive wins?")
plt.show()
""")
md("▶ What you'll see: positives beat negatives in 7 of 9 pairs, so AUC is `7/9 = 0.778`.")

md(r"""
## ✍️ Toy 15 · calibration bins by hand

Calibration asks: when the model predicts about `p`, does the event happen about `p` of the
time? Bin predictions, average predictions, and average labels.
""")
code(r"""
t15_pred = np.array([0.10, 0.20, 0.35, 0.45, 0.55, 0.65, 0.80, 0.90])  # -> predicted probabilities
print("predicted probabilities:", t15_pred.tolist())

t15_y = np.array([0, 0, 0, 1, 0, 1, 1, 1])                            # -> observed labels
print("labels:", t15_y.tolist())

t15_bucket = np.minimum((t15_pred * 4).astype(int), 3)                # -> [0, 0, 1, 1, 2, 2, 3, 3]
print("calibration bucket:", t15_bucket.tolist())

t15_mean_pred = []
t15_actual = []
for t15_b in range(4):
    t15_idx = np.where(t15_bucket == t15_b)[0]                        # -> examples in bucket b
    print(f"bucket {t15_b} examples:", t15_idx.tolist())
    t15_mp = t15_pred[t15_idx].mean()                                 # -> mean predicted probability
    print(f"bucket {t15_b} mean prediction:", round(float(t15_mp), 3))
    t15_ar = t15_y[t15_idx].mean()                                    # -> actual event rate
    print(f"bucket {t15_b} actual rate:", round(float(t15_ar), 3))
    t15_mean_pred.append(float(t15_mp))
    t15_actual.append(float(t15_ar))

t15_mean_pred = np.array(t15_mean_pred)                               # -> [0.15, 0.4, 0.6, 0.85]
print("mean predictions:", t15_mean_pred.tolist())

t15_actual = np.array(t15_actual)                                     # -> [0.0, 0.5, 0.5, 1.0]
print("actual rates:", t15_actual.tolist())
assert np.allclose(t15_mean_pred, [0.15, 0.40, 0.60, 0.85])
assert np.allclose(t15_actual, [0.0, 0.5, 0.5, 1.0])

plt.figure(figsize=(4.5, 4))
plt.plot([0, 1], [0, 1], "k--", label="perfect")
plt.plot(t15_mean_pred, t15_actual, "o-", color="steelblue", label="toy model")
plt.xlabel("mean predicted probability")
plt.ylabel("actual rate")
plt.title("Toy 15: calibration curve")
plt.legend()
plt.show()
""")
md("▶ What you'll see: each point compares a bucket's mean prediction to its actual rate, "
   "the same reliability-curve mechanic used later.")

md(r"""
## ✍️ Toy 16 · multi-objective weighted blend

Serving needs one score, so calibrated pCTR, pVTR, and pLTR are blended with business
weights. Changing weights changes which outcome matters most.
""")
code(r"""
t16_prob = np.array([[0.10, 0.80, 0.20],
                     [0.30, 0.20, 0.60],
                     [0.60, 0.30, 0.10],
                     [0.20, 0.60, 0.50],
                     [0.50, 0.40, 0.40],
                     [0.40, 0.10, 0.70]])                            # -> 6 candidates x [pCTR, pVTR, pLTR]
print("probabilities [pCTR, pVTR, pLTR]:")
print(t16_prob)

t16_weights = np.array([0.3, 0.2, 0.5])                              # -> click/view/lead weights
print("business weights:", t16_weights.tolist())

t16_terms = t16_prob * t16_weights                                   # -> weighted terms per objective
print("weighted objective terms:")
print(np.round(t16_terms, 3))

t16_score = t16_terms.sum(axis=1)                                    # -> [0.29, 0.43, 0.29, 0.43, 0.43, 0.49]
print("serving scores:", np.round(t16_score, 3).tolist())
assert np.allclose(t16_score, [0.29, 0.43, 0.29, 0.43, 0.43, 0.49])

plt.figure(figsize=(5, 3))
plt.bar(np.arange(6), t16_score, color="mediumpurple")
plt.xlabel("candidate id")
plt.ylabel("blended score")
plt.title("Toy 16: score = 0.3·pCTR + 0.2·pVTR + 0.5·pLTR")
plt.show()
""")
md("▶ What you'll see: each row's three probabilities collapse to one business-weighted score; "
   "candidate 5 wins because its lead probability is high.")

md(r"""
## ✍️ Toy 17 · sort by serving score to make a ranked list

Ranking is sorting candidates from highest serving score to lowest. The top positions are
what a user would see first.
""")
code(r"""
t17_score = np.array([0.29, 0.43, 0.29, 0.43, 0.43, 0.49])           # -> serving scores from Toy 16
print("serving scores:", t17_score.tolist())

t17_ids = np.arange(6)                                               # -> [0, 1, 2, 3, 4, 5]
print("candidate ids:", t17_ids.tolist())

t17_order = np.argsort(-t17_score)                                   # -> [5, 1, 3, 4, 0, 2]
print("ranked ids:", t17_order.tolist())

t17_top3 = t17_order[:3]                                             # -> [5, 1, 3]
print("top-3 shown:", t17_top3.tolist())

t17_top_scores = t17_score[t17_top3]                                 # -> [0.49, 0.43, 0.43]
print("top-3 scores:", t17_top_scores.tolist())
assert t17_top3.tolist() == [5, 1, 3]

plt.figure(figsize=(5, 3))
plt.bar(np.arange(6), t17_score[t17_order], color="steelblue")
plt.xticks(np.arange(6), t17_order)
plt.xlabel("ranked candidate id")
plt.ylabel("serving score")
plt.title("Toy 17: sorting creates the ranked list")
plt.show()
""")
md("▶ What you'll see: sorting puts candidate 5 first, then tied candidates 1 and 3 before "
   "the remaining lower-scoring ads.")

md(r"""
## ✍️ Toy 18 · auction value: probability times bid

In ads, business value can combine predicted action probability with an advertiser bid.
A lower pCTR can still win if the bid is high enough.
""")
code(r"""
t18_pctr = np.array([0.10, 0.30, 0.20, 0.25, 0.15, 0.35])            # -> click probabilities
print("pCTR:", t18_pctr.tolist())

t18_bid = np.array([6.0, 1.5, 3.0, 2.0, 5.0, 1.0])                  # -> advertiser bids
print("bid:", t18_bid.tolist())

t18_value = t18_pctr * t18_bid                                      # -> [0.6, 0.45, 0.6, 0.5, 0.75, 0.35]
print("pCTR × bid value:", np.round(t18_value, 3).tolist())

t18_order = np.argsort(-t18_value)                                  # -> [4, 0, 2, 3, 1, 5]
print("auction order:", t18_order.tolist())

t18_top = int(t18_order[0])                                         # -> 4
print("winner:", t18_top)
assert t18_top == 4

plt.figure(figsize=(5, 3))
plt.bar(np.arange(6), t18_value, color="darkorange")
plt.scatter([t18_top], [t18_value[t18_top]], s=160, facecolors="none", edgecolors="black", linewidths=2)
plt.xlabel("candidate id")
plt.ylabel("pCTR × bid")
plt.title("Toy 18: bid can change business value")
plt.show()
""")
md("▶ What you'll see: candidate 5 has the biggest pCTR, but candidate 4 wins the auction-value "
   "score because `0.15 × 5.0 = 0.75`.")

md(r"""
## ✍️ Toy 19 · diversity re-rank with MMR

After initial ranking, a re-ranker can trade relevance for diversity. MMR chooses the next
item by `λ·relevance − (1−λ)·similarity_to_selected`.
""")
code(r"""
t19_rel = np.array([0.92, 0.85, 0.80, 0.78, 0.70, 0.65])            # -> initial relevance scores
print("relevance scores:", t19_rel.tolist())

t19_sim = np.array([[1.0, 0.8, 0.1, 0.2, 0.1, 0.0],
                    [0.8, 1.0, 0.2, 0.1, 0.0, 0.1],
                    [0.1, 0.2, 1.0, 0.7, 0.2, 0.1],
                    [0.2, 0.1, 0.7, 1.0, 0.3, 0.2],
                    [0.1, 0.0, 0.2, 0.3, 1.0, 0.6],
                    [0.0, 0.1, 0.1, 0.2, 0.6, 1.0]])               # -> pairwise similarity
print("similarity matrix:")
print(t19_sim)

t19_lambda = 0.7                                                     # -> relevance/diversity tradeoff
print("lambda:", t19_lambda)

t19_selected = []
t19_candidates = [0, 1, 2, 3, 4, 5]
for t19_step in range(3):
    if len(t19_selected) == 0:
        t19_mmr = t19_rel[t19_candidates]                            # -> first pick uses relevance only
    else:
        t19_max_sim = np.array([t19_sim[t19_i, t19_selected].max() for t19_i in t19_candidates])  # -> similarity penalty
        print(f"step {t19_step} max similarity:", np.round(t19_max_sim, 3).tolist())
        t19_mmr = t19_lambda*t19_rel[t19_candidates] - (1 - t19_lambda)*t19_max_sim  # -> MMR scores
    print(f"step {t19_step} candidates:", t19_candidates)
    print(f"step {t19_step} MMR scores:", np.round(t19_mmr, 3).tolist())
    t19_pick = t19_candidates[int(np.argmax(t19_mmr))]               # -> selected candidate
    print(f"step {t19_step} pick:", int(t19_pick))
    t19_selected.append(int(t19_pick))
    t19_candidates.remove(int(t19_pick))

print("MMR selected:", t19_selected)                                  # -> [0, 2, 4]
assert t19_selected == [0, 2, 4]

plt.figure(figsize=(5, 3))
plt.bar(np.arange(6), t19_rel, color=np.where(np.isin(np.arange(6), t19_selected), "seagreen", "lightgray"))
plt.xlabel("candidate id")
plt.ylabel("initial relevance")
plt.title("Toy 19: MMR picks relevant but diverse items")
plt.show()
""")
md("▶ What you'll see: MMR starts with item 0, skips its near-twin item 1, then picks "
   "`[0, 2, 4]` to cover more diverse candidates.")

md(r"""
## ✍️ Toy 20 · position discount and nDCG

nDCG rewards putting high-relevance items near the top. The discount shrinks lower positions,
then DCG is divided by the ideal DCG.
""")
code(r"""
t20_relevance = np.array([2, 0, 1, 2, 1, 0])                         # -> shown order relevance labels
print("shown-order relevance:", t20_relevance.tolist())

t20_gain = 2**t20_relevance - 1                                      # -> [3, 0, 1, 3, 1, 0]
print("gains 2^rel - 1:", t20_gain.tolist())

t20_positions = np.arange(1, 7)                                      # -> [1, 2, 3, 4, 5, 6]
print("positions:", t20_positions.tolist())

t20_discount = 1.0 / np.log2(t20_positions + 1)                      # -> [1.0, 0.631, 0.5, 0.431, 0.387, 0.356]
print("position discounts:", np.round(t20_discount, 3).tolist())

t20_dcg_terms = t20_gain * t20_discount                              # -> [3.0, 0.0, 0.5, 1.292, 0.387, 0.0]
print("DCG terms:", np.round(t20_dcg_terms, 3).tolist())

t20_dcg = t20_dcg_terms.sum()                                        # -> 5.178882481454721
print("DCG:", round(float(t20_dcg), 3))

t20_ideal_gain = np.sort(t20_gain)[::-1]                             # -> [3, 3, 1, 1, 0, 0]
print("ideal gains:", t20_ideal_gain.tolist())

t20_idcg = (t20_ideal_gain * t20_discount).sum()                     # -> 5.823465818787765
print("ideal DCG:", round(float(t20_idcg), 3))

t20_ndcg = t20_dcg / t20_idcg                                        # -> 0.8893127636718536
print("nDCG:", round(float(t20_ndcg), 3))
assert np.isclose(t20_ndcg, 0.8893127636718536)

plt.figure(figsize=(5, 3))
plt.bar(t20_positions, t20_dcg_terms, color="steelblue", label="actual DCG term")
plt.plot(t20_positions, t20_ideal_gain*t20_discount, "o-", color="black", label="ideal term")
plt.xlabel("position")
plt.ylabel("discounted gain")
plt.title("Toy 20: nDCG compares actual to ideal order")
plt.legend()
plt.show()
""")
md("▶ What you'll see: lower positions get smaller discounts; this ranking gets "
   "`nDCG ≈ 0.889` compared with the ideal ordering.")

md(r"""
## ✍️ Toy 21 · history ablation as an AUC drop

An ablation removes one signal and checks whether quality drops. Here, scores with history
rank all positives above all negatives; scores without history make two pair mistakes.
""")
code(r"""
t21_y = np.array([1, 1, 1, 0, 0, 0])                                # -> three positives, three negatives
print("labels:", t21_y.tolist())

t21_with_history = np.array([0.9, 0.8, 0.7, 0.4, 0.3, 0.2])          # -> good scores
print("scores with history:", t21_with_history.tolist())

t21_without_history = np.array([0.8, 0.35, 0.7, 0.6, 0.4, 0.2])      # -> one positive now too low
print("scores without history:", t21_without_history.tolist())

t21_pos_full = t21_with_history[t21_y == 1]                          # -> [0.9, 0.8, 0.7]
print("positive scores with history:", t21_pos_full.tolist())

t21_neg_full = t21_with_history[t21_y == 0]                          # -> [0.4, 0.3, 0.2]
print("negative scores with history:", t21_neg_full.tolist())

t21_auc_full = (t21_pos_full[:, None] > t21_neg_full[None, :]).mean()  # -> 1.0
print("AUC with history:", round(float(t21_auc_full), 3))

t21_pos_nohist = t21_without_history[t21_y == 1]                     # -> [0.8, 0.35, 0.7]
print("positive scores without history:", t21_pos_nohist.tolist())

t21_neg_nohist = t21_without_history[t21_y == 0]                     # -> [0.6, 0.4, 0.2]
print("negative scores without history:", t21_neg_nohist.tolist())

t21_auc_nohist = (t21_pos_nohist[:, None] > t21_neg_nohist[None, :]).mean()  # -> 0.7777777777777778
print("AUC without history:", round(float(t21_auc_nohist), 3))

t21_drop = t21_auc_full - t21_auc_nohist                             # -> 0.2222222222222222
print("AUC drop:", round(float(t21_drop), 3))
assert np.isclose(t21_auc_full, 1.0)
assert np.isclose(t21_auc_nohist, 7/9)

plt.figure(figsize=(4.5, 3))
plt.bar(["with history", "without"], [t21_auc_full, t21_auc_nohist], color=["seagreen", "lightgray"])
plt.ylim(0.5, 1.05)
plt.ylabel("AUC")
plt.title("Toy 21: ablation shows history helps")
plt.show()
""")
md("▶ What you'll see: dropping the history signal lowers AUC from `1.000` to `0.778`, "
   "the tiny version of the notebook's history ablation.")

md(r"""
## ✍️ Toy 22 · predicted-vs-actual proof groups

The closing proof sorts examples by predicted probability, groups them, then compares the
mean prediction with the actual label rate in each group.
""")
code(r"""
t22_pred = np.array([0.12, 0.18, 0.25, 0.55, 0.62, 0.78, 0.82, 0.91])  # -> predicted probabilities
print("predicted probabilities:", t22_pred.tolist())

t22_y = np.array([0, 0, 0, 1, 1, 1, 1, 1])                            # -> labels
print("labels:", t22_y.tolist())

t22_order = np.argsort(t22_pred)                                      # -> [0, 1, 2, 3, 4, 5, 6, 7]
print("sorted example ids:", t22_order.tolist())

t22_groups = np.array_split(t22_order, 4)                             # -> 4 groups of 2 examples
print("groups:", [g.tolist() for g in t22_groups])

t22_mean_pred = []
t22_actual = []
for t22_g in t22_groups:
    t22_group_pred = t22_pred[t22_g]                                  # -> predictions in group
    print("group predictions:", np.round(t22_group_pred, 3).tolist())
    t22_group_y = t22_y[t22_g]                                        # -> labels in group
    print("group labels:", t22_group_y.tolist())
    t22_mp = t22_group_pred.mean()                                    # -> mean prediction
    print("group mean prediction:", round(float(t22_mp), 3))
    t22_ar = t22_group_y.mean()                                       # -> actual rate
    print("group actual rate:", round(float(t22_ar), 3))
    t22_mean_pred.append(float(t22_mp))
    t22_actual.append(float(t22_ar))

t22_mean_pred = np.array(t22_mean_pred)                               # -> [0.15, 0.4, 0.7, 0.865]
print("group mean predictions:", np.round(t22_mean_pred, 3).tolist())

t22_actual = np.array(t22_actual)                                     # -> [0.0, 0.5, 1.0, 1.0]
print("group actual rates:", t22_actual.tolist())
assert np.allclose(t22_mean_pred, [0.15, 0.40, 0.70, 0.865])
assert np.allclose(t22_actual, [0.0, 0.5, 1.0, 1.0])

plt.figure(figsize=(5, 3))
plt.bar(np.arange(4), t22_mean_pred, color="steelblue", alpha=0.6, label="predicted")
plt.plot(np.arange(4), t22_actual, "o-", color="black", label="actual")
plt.xlabel("score group, low → high")
plt.ylabel("rate")
plt.title("Toy 22: predicted vs actual by score group")
plt.legend()
plt.show()
""")
md("▶ What you'll see: as score groups go low to high, both predicted and actual rates rise; "
   "that is the final sanity check the full notebook repeats per head.")

# =================================================================== HISTORY FEATURES
md(r"""
## Step 2 · Add the *user-history* features

This is what makes it a real ranker. For each impression we add two features summarizing
the person's past behavior **with ads like this one**:
- `hist_affinity` (0–1): how strongly this user engaged with *similar* ads before
  (1 = loves this category). This is a "candidate-aware" history summary — the same idea
  behind the **DIN** attention model in lesson M7.3, precomputed into one number.
- `hist_len` (0–50): how many past events we have for this user (little history = less
  certainty).
""")
code(r"""
hist_affinity = rng.uniform(0, 1, N)     # engagement with similar ads in the past
hist_len      = rng.integers(0, 50, N)   # how many past events we have
print("history features added.")
print("hist_affinity mean:", round(hist_affinity.mean(), 2),
      "| hist_len mean:", round(hist_len.mean(), 1))
""")

# =================================================================== TRUE RULES + LABELS
md(r"""
## Step 3 · Invent the three TRUE rules, then generate the three labels

Just like the other notebook, *we* define the real rules so we can grade the model later.
Each outcome depends on different features — that's the whole point of predicting three
separate things — but **all three lean on `hist_affinity`** (history matters everywhere):

- **Click** ← relevance, quality, position, **history**
- **View** ← quality, **is_video**, position, **history**
- **Lead** ← relevance, price, **history**

We turn each rule's score into a probability (sigmoid) and flip a coin for the label.
""")
code(r"""
def sigmoid(z): return 1 / (1 + np.exp(-z))

click_logit = -2.6 + 2.2*relevance + 1.0*ad_quality - 0.2*position + 2.6*hist_affinity
view_logit  = -1.6 + 0.8*ad_quality + 2.2*is_video   - 0.1*position + 2.2*hist_affinity
lead_logit  = -2.6 + 2.4*relevance + 1.8*price        + 2.0*hist_affinity

true_ctr, true_vtr, true_ltr = sigmoid(click_logit), sigmoid(view_logit), sigmoid(lead_logit)
clicked = (rng.random(N) < true_ctr).astype(int)
viewed  = (rng.random(N) < true_vtr).astype(int)
lead    = (rng.random(N) < true_ltr).astype(int)

print("base rates (share that happened):")
print("  CTR (clicks):", round(clicked.mean(), 3))
print("  VTR (views) :", round(viewed.mean(), 3))
print("  LTR (leads) :", round(lead.mean(), 3))
""")

md(r"""
## Step 4 · Assemble the dataset and peek at it

We stack everything into one table. `X` = the 7 features the model may look at; `Y` = the
three labels it must predict (three columns). The `true_*` columns are kept only to grade
ourselves — the model never sees them.
""")
code(r"""
features = ["relevance", "ad_quality", "price", "position", "is_video", "hist_affinity", "hist_len"]
data = pd.DataFrame(dict(relevance=relevance, ad_quality=ad_quality, price=price, position=position,
                         is_video=is_video, hist_affinity=hist_affinity, hist_len=hist_len,
                         clicked=clicked, viewed=viewed, lead=lead,
                         true_ctr=true_ctr, true_vtr=true_vtr, true_ltr=true_ltr))
X = data[features].to_numpy(dtype=float)
Y = data[["clicked", "viewed", "lead"]].to_numpy()
print("X (features):", X.shape, " Y (three labels):", Y.shape)
data[features + ["clicked", "viewed", "lead"]].head()
""")

# =================================================================== EXPLORE
md(r"""
## Step 5 · Look at the three outcomes

A quick bar chart of how often each outcome happens. They're different rates — clicks and
leads are rarer than views here — which is realistic and part of why we model them
separately.
""")
code(r"""
rates = [clicked.mean(), viewed.mean(), lead.mean()]
plt.figure(figsize=(5, 3))
plt.bar(HEADS, rates, color=HEAD_COLORS)
plt.ylabel("share that happened"); plt.title("base rate of each outcome")
for i, r in enumerate(rates): plt.text(i, r+0.01, f"{r:.2f}", ha="center")
plt.show()
""")

md(r"""
## Step 6 · Does history drive all three outcomes?

Our claim is that `hist_affinity` matters for clicks, views, **and** leads. Let's check: for
each outcome, bucket impressions by history affinity and plot the outcome rate. All three
should slope **up** — proof there's real history signal to learn (and a preview of the
ablation in Step 12).
""")
code(r"""
data["ha_bucket"] = pd.cut(data.hist_affinity, 10, labels=False)
fig, ax = plt.subplots(1, 3, figsize=(13, 3.2))
for a, (col, name, color) in zip(ax, [("clicked","CTR",BLUE), ("viewed","VTR",GREEN), ("lead","LTR",PURPLE)]):
    a.plot(data.groupby("ha_bucket")[col].mean().values, "o-", color=color)
    a.set_title(f"history affinity ↑ → {name} ↑"); a.set_xlabel("history-affinity bucket"); a.set_ylabel(f"{name} rate")
plt.show()
""")

# =================================================================== SPLIT + SCALE
md(r"""
## Step 7 · Train/test split

75% to learn from, 25% hidden for grading. We split the features and **all three** label
columns together so each impression keeps its three answers.
""")
code(r"""
from sklearn.model_selection import train_test_split
idx = np.arange(N)
tr, te = train_test_split(idx, test_size=0.25, random_state=0)
Xtr_raw, Xte_raw = X[tr], X[te]
Ytr, Yte = Y[tr], Y[te]
true_test = data.loc[te, ["true_ctr", "true_vtr", "true_ltr"]].to_numpy()
print("train:", len(tr), "| test:", len(te))
""")

md(r"""
## Step 8 · Standardize the features

Features are on different scales (`position` up to 10, `hist_len` up to 50, others 0–1). We
rescale each to mean 0 / spread 1 using **train** statistics only, so no feature shouts over
the others and training is stable.
""")
code(r"""
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler().fit(Xtr_raw)      # learn mean/std on TRAIN only
Xtr = scaler.transform(Xtr_raw)
Xte = scaler.transform(Xte_raw)
print("standardized. train feature means (should be ~0):", np.round(Xtr.mean(0), 2))
""")

# =================================================================== THE MODEL
md(r"""
## Step 9 · Choose the model — why **shared-bottom multi-task** (in PyTorch)

**The model choice.** We must predict **three** related things (click, view, lead). Two
options:
- train **three separate models** — simple, but you learn the common patterns three times
  and pay to train/serve three networks;
- train **one shared-bottom multi-task model** — a single **shared body** (hidden layers)
  that learns the patterns common to all three tasks, then **three small heads**, one per
  task, that specialize.

We pick **shared-bottom** because the three outcomes overlap a lot (a relevant ad from a
favored category tends to do well on all of them), so sharing is cheaper *and* usually
more accurate (each task benefits from the others' data). It's the standard **starting
point** for multi-task ranking — lesson M7.3's **MMoE/PLE** are upgrades for when the
tasks start to *fight* each other.

**In PyTorch** we write it directly: a shared `body`, then a list of one-output `heads`.
""")
code(r"""
import torch, torch.nn as nn
torch.manual_seed(0)

class SharedBottomRanker(nn.Module):
    def __init__(self, n_features, n_tasks=3):
        super().__init__()
        self.body  = nn.Sequential(               # the SHARED body: 7 -> 32 -> 16
            nn.Linear(n_features, 32), nn.ReLU(),
            nn.Linear(32, 16), nn.ReLU())
        self.heads = nn.ModuleList([nn.Linear(16, 1) for _ in range(n_tasks)])  # one head per task
    def forward(self, x):
        z = self.body(x)                          # shared representation
        return torch.cat([h(z) for h in self.heads], dim=1)   # (batch, 3) logits: CTR, VTR, LTR

model = SharedBottomRanker(len(features))
print("model: 7 features -> shared (32, 16) -> 3 heads (CTR, VTR, LTR)")
print("total learnable numbers:", sum(p.numel() for p in model.parameters()))
""")

md(r"""
## Step 10 · Train it — and log the learning

We run the PyTorch training loop ourselves so we can **log** it. Each **epoch**: predict,
measure the error on **all three heads** (summed **BCE** log loss), let autograd compute
gradients (`loss.backward()`), and step (`optimizer.step()`). We print the total and
per-head loss every 50 epochs and store them for a curve.
""")
code(r"""
Xtr_t = torch.tensor(Xtr, dtype=torch.float32)
Ytr_t = torch.tensor(Ytr, dtype=torch.float32)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.BCEWithLogitsLoss()

total_hist, task_hist = [], []
print("epoch |  total | CTR   VTR   LTR")
for epoch in range(300):
    model.train(); optimizer.zero_grad()
    logits = model(Xtr_t)
    per_task = [loss_fn(logits[:, k], Ytr_t[:, k]) for k in range(3)]   # one loss per head
    loss = sum(per_task)                          # shared model optimizes all three at once
    loss.backward(); optimizer.step()
    total_hist.append(loss.item()); task_hist.append([l.item() for l in per_task])
    if epoch % 50 == 0:
        p = [l.item() for l in per_task]
        print(f"{epoch:5d} | {loss.item():.3f} | {p[0]:.3f} {p[1]:.3f} {p[2]:.3f}")
print("done. final total loss:", round(total_hist[-1], 3))

task_hist = np.array(task_hist)
fig, ax = plt.subplots(1, 2, figsize=(11, 3.2))
ax[0].plot(total_hist, color="black", lw=2); ax[0].set_title("total loss"); ax[0].set_xlabel("epoch")
for k, (name, c) in enumerate(zip(HEADS, HEAD_COLORS)):
    ax[1].plot(task_hist[:, k], color=c, lw=2, label=name)
ax[1].set_title("loss per head"); ax[1].set_xlabel("epoch"); ax[1].legend(); plt.show()
""")

# =================================================================== PREDICT
md(r"""
## Step 11 · Predict all three probabilities on unseen impressions

We switch the model to eval mode, predict under `torch.no_grad()` (no training), and apply
`torch.sigmoid` to turn each head's score into a probability: pCTR, pVTR, pLTR.
""")
code(r"""
model.eval()
with torch.no_grad():
    proba = torch.sigmoid(model(torch.tensor(Xte, dtype=torch.float32))).numpy()  # (n_test, 3)
pred = pd.DataFrame(proba, columns=["pCTR", "pVTR", "pLTR"]).round(3)
pred["clicked"], pred["viewed"], pred["lead"] = Yte[:,0], Yte[:,1], Yte[:,2]
print("predictions on impressions the model never saw:")
print(pred.head(6).to_string(index=False))
""")

# =================================================================== EVALUATE AUC
md(r"""
## Step 12 · Grade each head — AUC

AUC per head: *pick a positive and a negative example at random — AUC is the chance the
model scored the positive higher.* 0.5 = coin flip, 1.0 = perfect. We grade all three heads
and log them.
""")
code(r"""
from sklearn.metrics import roc_auc_score
aucs = [roc_auc_score(Yte[:, k], proba[:, k]) for k in range(3)]
for name, a in zip(HEADS, aucs): print(f"{name} AUC: {a:.3f}")
plt.figure(figsize=(5, 3))
plt.bar(HEADS, aucs, color=HEAD_COLORS); plt.ylim(0.5, 1.0); plt.ylabel("AUC")
for i, a in enumerate(aucs): plt.text(i, a+0.01, f"{a:.3f}", ha="center")
plt.title("ranking quality per head"); plt.show()
""")

# =================================================================== CALIBRATION
md(r"""
## Step 13 · Are the three probabilities honest? (calibration)

Each head should be calibrated: when it says 0.3, about 30% should really happen. We draw a
reliability curve per head; on the diagonal = honest. Calibration matters because the next
step *multiplies* these probabilities, so their scale must be truthful.
""")
code(r"""
from sklearn.calibration import calibration_curve
plt.figure(figsize=(5, 4.5))
plt.plot([0,1],[0,1], "k--", label="perfectly honest")
for k, (name, color) in enumerate(zip(HEADS, HEAD_COLORS)):
    frac, mean = calibration_curve(Yte[:, k], proba[:, k], n_bins=10)
    plt.plot(mean, frac, "o-", color=color, label=name)
plt.xlabel("predicted probability"); plt.ylabel("actual rate")
plt.title("calibration of all three heads"); plt.legend(); plt.show()
""")

# =================================================================== MULTI-OBJECTIVE
md(r"""
## Step 14 · Combine the heads into ONE serving score (multi-objective)

A real system must pick ONE ad, so it blends the heads into a single **serving score** with
business weights that say how much each outcome is worth:

`score = w_click · pCTR + w_view · pVTR + w_lead · pLTR`

Leads are worth the most here, so they get the biggest weight. Because each head is a
calibrated probability, the terms are on a comparable scale and the weights are a genuine
business choice (not an accidental unit mismatch). This is the multi-objective head from
lesson M7.3.
""")
code(r"""
w_click, w_view, w_lead = 0.3, 0.2, 0.5     # business weights (leads valued most)
serving_score = w_click*proba[:,0] + w_view*proba[:,1] + w_lead*proba[:,2]
print("serving score = "
      f"{w_click}·pCTR + {w_view}·pVTR + {w_lead}·pLTR")
print("example scores:", np.round(serving_score[:5], 3))

# show how the same impression can rank differently by objective
top_click = np.argsort(-proba[:,0])[:1][0]
top_lead  = np.argsort(-proba[:,2])[:1][0]
print(f"\nhighest-pCTR impression: pCTR={proba[top_click,0]:.2f} pLTR={proba[top_click,2]:.2f}")
print(f"highest-pLTR impression: pCTR={proba[top_lead,0]:.2f}  pLTR={proba[top_lead,2]:.2f}")
print("-> optimizing clicks vs leads can pick different ads; the weights decide.")
""")

md(r"""
## Step 15 · Rank the ads by the combined score

Sort impressions by the serving score, highest first — this is what would be shown at the
top. We display the top few with all three predicted probabilities so you can see the blend
at work.
""")
code(r"""
order = np.argsort(-serving_score)
top = pd.DataFrame(proba[order[:8]], columns=["pCTR","pVTR","pLTR"]).round(3)
top["serving_score"] = serving_score[order[:8]].round(3)
print("top-8 ads by combined serving score:")
print(top.to_string(index=False))
""")

# =================================================================== ABLATION
md(r"""
## Step 16 · Does history actually help? (an ablation)

The honest test: **remove** the two history features, retrain the same model, and compare.
If history carries real signal, every head's AUC should **drop** without it. This is how you
justify a feature's cost in a real system.
""")
code(r"""
# drop the two history features (columns 5, 6), standardize, retrain the SAME architecture in torch
Xtr_nh_raw, Xte_nh_raw = X[tr][:, :5], X[te][:, :5]
sc_nh = StandardScaler().fit(Xtr_nh_raw)
Xtr_nh = torch.tensor(sc_nh.transform(Xtr_nh_raw), dtype=torch.float32)
Xte_nh = torch.tensor(sc_nh.transform(Xte_nh_raw), dtype=torch.float32)

torch.manual_seed(0)
model_nh = SharedBottomRanker(5)                       # same model, 5 features (no history)
opt_nh = torch.optim.Adam(model_nh.parameters(), lr=0.01)
for epoch in range(300):
    model_nh.train(); opt_nh.zero_grad()
    lg = model_nh(Xtr_nh)
    loss = sum(loss_fn(lg[:, k], Ytr_t[:, k]) for k in range(3))
    loss.backward(); opt_nh.step()
model_nh.eval()
with torch.no_grad():
    proba_nh = torch.sigmoid(model_nh(Xte_nh)).numpy()
aucs_nh = [roc_auc_score(Yte[:,k], proba_nh[:,k]) for k in range(3)]

print(f"{'head':<5} {'with history':>13} {'without':>9} {'drop':>7}")
for name, a, anh in zip(HEADS, aucs, aucs_nh):
    print(f"{name:<5} {a:>13.3f} {anh:>9.3f} {a-anh:>7.3f}")

x = np.arange(3); wdt = 0.35
plt.figure(figsize=(6, 3.4))
plt.bar(x-wdt/2, aucs, wdt, color=GREEN, label="with history")
plt.bar(x+wdt/2, aucs_nh, wdt, color=GRAY, label="without history")
plt.xticks(x, HEADS); plt.ylim(0.5, 0.9); plt.ylabel("AUC")
plt.title("history helps every head"); plt.legend(); plt.show()
""")

# =================================================================== PROOF
md(r"""
## Step 17 · Proof — predicted vs actual, per head

The closing check. For each head, sort impressions into 10 groups by predicted probability
and compare the **predicted** rate (bars) to the **actual** rate (dots). Matching, low to
high, means the model's probabilities track reality for all three tasks.
""")
code(r"""
fig, ax = plt.subplots(1, 3, figsize=(13.5, 3.6))
for k, (name, color) in enumerate(zip(HEADS, HEAD_COLORS)):
    dec = pd.qcut(proba[:, k], 10, labels=False, duplicates="drop")
    gdf = pd.DataFrame({"d": dec, "pred": proba[:, k], "act": Yte[:, k]}).groupby("d").mean()
    ax[k].bar(gdf.index, gdf.pred, color=color, alpha=.5, label="predicted")
    ax[k].plot(gdf.index, gdf.act, "o-", color="black", label="actual")
    ax[k].set_title(f"{name}: predicted vs actual"); ax[k].set_xlabel("group (low → high)")
    ax[k].set_ylabel("rate"); ax[k].legend(fontsize=8)
plt.tight_layout(); plt.show()
print("AUCs — CTR {:.3f}, VTR {:.3f}, LTR {:.3f}. All three heads track reality.".format(*aucs))
""")

# ------------------------------------------------------------------- recap
md(r"""
---
## What you just built — a real ranker's shape

1. **Data** with static + **history** features and **three** outcomes (click / view / lead).
2. One **shared-bottom multi-task** model → three calibrated heads (**pCTR, pVTR, pLTR**).
3. Watched it **train** (loss curve), graded each head (**AUC**), checked **calibration**.
4. Blended the heads into one **serving score** with business weights (multi-objective).
5. **Proved history helps** with an ablation, and that each head **tracks reality**.

### How this maps to lesson M7.3 (the architecture flowchart)
- The single history number is a precomputed **DIN**-style candidate-aware feature; richer
  systems learn it with attention over the raw history (**DIN → DIEN → BST → SIM**).
- Our three-head network is the **shared-bottom** tower; **MMoE** and **PLE** are upgrades
  that reduce the tasks fighting each other ("negative transfer").
- The `serving_score = Σ wᵢ·pᵢ` blend is the **multi-objective head**; in ads it's combined
  with the **bid** (`pCTR × bid`) in the auction.
- Calibration (Step 13) is exactly what module **M8** teaches you to measure and repair.

You now have the end-to-end mental model of a production ranker. 🎯
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M07 · Full multi-task ranking pipeline (CTR/VTR/LTR + history)", "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M07-full-ranking-pipeline.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
