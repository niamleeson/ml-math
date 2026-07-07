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
