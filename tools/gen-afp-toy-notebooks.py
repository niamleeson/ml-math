#!/usr/bin/env python3
"""Generate beginner toy-example notebooks for AFP modules that lack one.

Each module gets a CPU-only, tiny, hand-traceable notebook following the house
standard: step-by-step process, print logging, a visualization per idea, a break
case, and asserts. Colab-preinstalled libs only (numpy / scikit-learn / matplotlib).
Notebooks are written to afp/notebooks/<module-slug>.ipynb.

Run: python3 tools/gen-afp-toy-notebooks.py
"""
import json, os

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUTDIR = os.path.join(ROOT, "afp", "notebooks")


class NB:
    def __init__(self):
        self.cells = []
    def md(self, t):
        self.cells.append({"cell_type": "markdown", "metadata": {}, "source": t.strip("\n").splitlines(keepends=True)})
    def code(self, s):
        self.cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": s.strip("\n").splitlines(keepends=True)})
    def write(self, slug):
        nb = {"cells": self.cells,
              "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
                           "language_info": {"name": "python"}},
              "nbformat": 4, "nbformat_minor": 5}
        out = os.path.join(OUTDIR, slug + ".ipynb")
        with open(out, "w") as f:
            json.dump(nb, f, indent=1)
        print(f"wrote afp/notebooks/{slug}.ipynb ({len(self.cells)} cells, "
              f"{sum(c['cell_type']=='code' for c in self.cells)} code)")


SETUP = r"""
import numpy as np
import matplotlib.pyplot as plt
np.random.seed(0)
plt.rcParams["figure.figsize"] = (6, 4)

def log(label, value):
    print(f"[{label}] {value}")

log("setup", "tools ready — seed fixed to 0")
"""

MODULES = {}
def module(slug):
    def deco(fn):
        MODULES[slug] = fn
        return fn
    return deco


# ------------------------------------------------------------------ M03
@module("M03-loss-optimization")
def m03():
    n = NB()
    n.md("# M03 · Losses & Optimization — Toy Example, Step by Tiny Step\n\n"
         "**Companion to lesson M03. Written for someone new to ML.**\n\n"
         "A **loss** turns a prediction into a single number to minimize. This notebook builds the two "
         "you meet most — **log loss** (for probabilities) and **squared/absolute/Huber** (for numbers) — "
         "one tiny step at a time, with a **break case** showing how one outlier hijacks squared error.")
    n.md("## Step 0 · Setup"); n.code(SETUP)
    n.md("## Step 1 · Log loss punishes confident-and-wrong predictions\n\n"
         "For a true label `y=1`, log loss is `-log(p)` where `p` is the predicted probability of the "
         "true class. Being confident and **right** costs almost nothing; being confident and **wrong** "
         "costs a lot.")
    n.code(r"""
ps = np.array([0.9, 0.5, 0.1, 0.01])          # predicted P(y=1) for a truly-positive example
for p in ps:
    log(f"y=1, p={p}", f"log loss = -log(p) = {(-np.log(p)):.3f}")
assert abs(-np.log(0.9) - 0.105) < 1e-2       # confident-right ~ 0.105
assert abs(-np.log(0.01) - 4.605) < 1e-2      # confident-wrong ~ 4.605 (44x worse)

grid = np.linspace(0.01, 0.99, 100)
plt.plot(grid, -np.log(grid), label="y=1: -log(p)")
plt.plot(grid, -np.log(1 - grid), label="y=0: -log(1-p)")
plt.title("log loss vs predicted probability"); plt.xlabel("p"); plt.ylabel("loss"); plt.legend(); plt.show()
""")
    n.md("▶ What you'll see: loss near 0 when confident-and-right, exploding when confident-and-wrong.")
    n.md("## Step 2 · Regression losses and the outlier break case\n\n"
         "**MSE** squares the residual, **MAE** takes its absolute value, **Huber** is quadratic near 0 "
         "and linear far out. The break case: a single residual of 10 costs **100** under MSE but only "
         "**10** under MAE — so one outlier can dominate an MSE fit.")
    n.code(r"""
r = np.linspace(-12, 12, 200); delta = 1.0
mse = r**2; mae = np.abs(r)
huber = np.where(np.abs(r) <= delta, 0.5*r**2, delta*(np.abs(r) - 0.5*delta))
log("residual 10 -> MSE", 10**2); log("residual 10 -> MAE", 10)
assert 10**2 > 10                              # MSE lets the outlier dominate

plt.plot(r, mse, label="MSE (r^2)"); plt.plot(r, mae, label="MAE (|r|)")
plt.plot(r, huber, label="Huber (delta=1)"); plt.ylim(0, 40)
plt.title("regression losses vs residual"); plt.xlabel("residual"); plt.ylabel("loss"); plt.legend(); plt.show()
""")
    n.md("▶ What you'll see: MSE's steep parabola (outlier-sensitive) vs MAE's V and Huber's blend.")
    n.md("## Recap\n\n- **Log loss** = `-log(p_true)`: confident-wrong is punished hardest.\n"
         "- **MSE** squares residuals (outlier-sensitive); **MAE** is robust; **Huber** blends both.\n"
         "- Choosing the loss *is* choosing what mistakes you care about.")
    return n


# ------------------------------------------------------------------ M05
@module("M05-offline-metrics")
def m05():
    n = NB()
    n.md("# M05 · Offline Metrics — Toy Example, Step by Tiny Step\n\n"
         "**Companion to lesson M05.** Turn model scores into a **confusion matrix**, read off "
         "**precision / recall / F1**, sweep the **threshold**, and meet the **imbalance trap** where "
         "accuracy lies.")
    n.md("## Step 0 · Setup"); n.code(SETUP)
    n.md("## Step 1 · Confusion matrix and precision/recall/F1\n\n"
         "At a chosen threshold, every prediction is a TP, FP, FN, or TN. Precision = of what I flagged, "
         "how many were right; recall = of the true positives, how many I caught.")
    n.code(r"""
TP, FP, FN, TN = 8, 2, 4, 86                    # from a threshold on synthetic pCTR scores
precision = TP / (TP + FP)
recall = TP / (TP + FN)
f1 = 2 * precision * recall / (precision + recall)
log("precision = TP/(TP+FP)", f"{TP}/{TP+FP} = {precision:.2f}")
log("recall = TP/(TP+FN)", f"{TP}/{TP+FN} = {recall:.2f}")
log("F1", round(f1, 3))
assert abs(precision - 0.80) < 1e-9 and abs(recall - 2/3) < 1e-9

cm = np.array([[TN, FP], [FN, TP]])
plt.imshow(cm, cmap="Blues")
for i in range(2):
    for j in range(2): plt.text(j, i, cm[i, j], ha="center", va="center")
plt.xticks([0,1], ["pred -","pred +"]); plt.yticks([0,1], ["true -","true +"])
plt.title("confusion matrix"); plt.show()
""")
    n.md("▶ What you'll see: precision 0.80, recall 0.67, F1 ≈ 0.73.")
    n.md("## Step 2 · Threshold sweep — recall falls as the threshold rises\n\n"
         "Raise the threshold and you predict positive less often: fewer false alarms (precision up) but "
         "more misses (recall down). We sweep and plot both.")
    n.code(r"""
y = np.array([1]*20 + [0]*80)                   # 20 positives, 80 negatives
scores = np.clip(np.where(y == 1, np.random.normal(0.65, 0.15, 100),
                          np.random.normal(0.35, 0.15, 100)), 0, 1)
ths = np.linspace(0.1, 0.9, 9); precs, recs = [], []
for t in ths:
    p = (scores >= t).astype(int)
    tp = np.sum((y==1)&(p==1)); fp = np.sum((y==0)&(p==1)); fn = np.sum((y==1)&(p==0))
    precs.append(tp/(tp+fp) if tp+fp else 1.0); recs.append(tp/(tp+fn) if tp+fn else 0.0)
log("recall by threshold", [round(r,2) for r in recs])
assert all(recs[i+1] <= recs[i] + 1e-9 for i in range(len(recs)-1))   # recall never rises with threshold

plt.plot(ths, precs, "-o", label="precision"); plt.plot(ths, recs, "-o", label="recall")
plt.title("precision & recall vs threshold"); plt.xlabel("threshold"); plt.legend(); plt.show()
""")
    n.md("▶ What you'll see: recall sliding down as the threshold rises, precision generally rising.")
    n.md("## Step 3 · The imbalance trap (break case)\n\n"
         "On a 1%-click dataset, predicting **no clicks** is ~99% accurate and catches **zero** clicks.")
    n.code(r"""
y_imb = np.array([1] + [0]*99)                  # 1% positive
pred_none = np.zeros(100, int)
log("accuracy (predict no clicks)", np.mean(pred_none == y_imb))
log("recall (predict no clicks)", 0.0)
assert np.mean(pred_none == y_imb) == 0.99
print("Lesson: on imbalanced data use precision/recall/F1/AUC, never accuracy.")
""")
    n.md("▶ What you'll see: 0.99 accuracy next to 0.0 recall.")
    n.md("## Recap\n\n- Precision/recall/F1 are fractions of the four confusion counts.\n"
         "- The threshold trades precision for recall — sweep it, don't guess.\n"
         "- On imbalanced data, **accuracy lies**; judge by recall/precision/F1/AUC.")
    return n


# ------------------------------------------------------------------ M16
@module("M16-dimensionality-reduction-anomaly")
def m16():
    n = NB()
    n.md("# M16 · Dimensionality Reduction — Toy Example, Step by Tiny Step\n\n"
         "**Companion to lesson M16.** Build **PCA** on correlated engagement-style features: see how a "
         "few components capture most of the variance, read the loadings, and note the honest caveat.")
    n.md("## Step 0 · Setup"); n.code(SETUP)
    n.md("## Step 1 · Correlated features → PCA explained variance\n\n"
         "We make 3 features that are basically the same signal (clicks/views/dwell all track engagement) "
         "plus 1 independent noise feature. PCA finds new axes ordered by how much variance each explains.")
    n.code(r"""
from sklearn.decomposition import PCA
engagement = np.random.normal(0, 1, (200, 1))                 # one hidden 'engagement' signal
X = np.hstack([engagement + 0.1*np.random.normal(size=(200,1)) for _ in range(3)]  # clicks, views, dwell
               + [np.random.normal(0, 1, (200, 1))])                                # independent noise
pca = PCA().fit(X)
cev = np.cumsum(pca.explained_variance_ratio_)
log("explained variance ratio", np.round(pca.explained_variance_ratio_, 3).tolist())
log("cumulative explained variance", np.round(cev, 3).tolist())
assert np.all(np.diff(cev) >= -1e-9)                         # cumulative variance is non-decreasing
n_comp = int(np.searchsorted(cev, 0.90) + 1)                 # components to reach 90%
log("components to reach 90% variance", n_comp)
assert cev[n_comp - 1] >= 0.90

plt.plot(range(1, len(cev)+1), cev, "-o"); plt.axhline(0.90, ls="--", color="red")
plt.title("cumulative explained variance"); plt.xlabel("# components"); plt.ylabel("fraction of variance"); plt.show()
""")
    n.md("▶ What you'll see: PC1 alone captures most variance (the 3 correlated features), reaching ~90% in 1–2 PCs.")
    n.md("## Step 2 · Loadings — what each component is made of\n\n"
         "A component's **loadings** say which original features it mixes. PC1 should load heavily on the "
         "three correlated engagement features and little on the noise feature.")
    n.code(r"""
pc1 = pca.components_[0]
log("PC1 loadings [click, view, dwell, noise]", np.round(pc1, 2).tolist())
assert abs(pc1[3]) < max(abs(pc1[:3]))                       # noise feature loads LESS than the engagement trio

plt.bar(["click","view","dwell","noise"], pc1)
plt.title("PC1 loadings (general engagement direction)"); plt.ylabel("weight"); plt.show()
""")
    n.md("▶ What you'll see: large loadings on click/view/dwell, near-zero on noise.")
    n.md("## Recap\n\n- PCA rotates to axes ordered by variance; a few PCs often capture most of it.\n"
         "- **Loadings** interpret a component (here PC1 = general engagement).\n"
         "- Caveat: low-dimensional blobs are **visualization hypotheses**, not labels.")
    return n


# ------------------------------------------------------------------ M27
@module("M27-linear-convex-optimization")
def m27():
    n = NB()
    n.md("# M27 · Convex Optimization — Toy Example, Step by Tiny Step\n\n"
         "**Companion to lesson M27.** Watch **gradient descent** roll to the bottom of a convex bowl, "
         "and see the **break case** where too large a step size makes it diverge.")
    n.md("## Step 0 · Setup"); n.code(SETUP)
    n.md("## Step 1 · Gradient descent on a convex function\n\n"
         "Minimize `f(x) = (x-3)^2`. Its slope is `f'(x) = 2(x-3)`. Gradient descent steps **against** the "
         "slope: `x ← x - lr * f'(x)`. On a convex bowl it converges to the single minimum at x=3.")
    n.code(r"""
f = lambda x: (x - 3)**2
grad = lambda x: 2 * (x - 3)
x = 0.0; lr = 0.1; hist = [x]
for step in range(20):
    x = x - lr * grad(x)                        # step downhill
    hist.append(x)
    if step < 4: log(f"step {step}: x", round(x, 4))
log("final x (should approach 3)", round(hist[-1], 4))
assert abs(hist[-1] - 3) < 0.1

grid = np.linspace(-1, 7, 100)
plt.plot(grid, f(grid)); plt.plot(hist, [f(x) for x in hist], "-o", color="red")
plt.title("gradient descent on (x-3)^2"); plt.xlabel("x"); plt.ylabel("f(x)"); plt.show()
""")
    n.md("▶ What you'll see: x marching 0 → 3 and the red path sliding down the parabola.")
    n.md("## Step 2 · Break case: too-large a step size diverges\n\n"
         "The step size (learning rate) must match the curvature. With `lr = 1.1` on this bowl, each step "
         "**overshoots farther** than the last and the value explodes.")
    n.code(r"""
x = 0.0; lr_big = 1.1; hist_big = [x]
for step in range(8):
    x = x - lr_big * grad(x)
    hist_big.append(x)
log("x with lr=1.1 (diverging)", [round(v, 2) for v in hist_big])
assert abs(hist_big[-1] - 3) > abs(hist_big[0] - 3)          # it moved AWAY from the minimum

plt.plot(hist_big, "-o"); plt.axhline(3, ls="--", color="green", label="minimum")
plt.title("too-large step size diverges"); plt.xlabel("step"); plt.ylabel("x"); plt.legend(); plt.show()
""")
    n.md("▶ What you'll see: x bouncing outward with growing swings — divergence.")
    n.md("## Recap\n\n- Gradient descent steps against the slope; on a **convex** function it reaches the "
         "global minimum.\n- The **step size** must suit the curvature — too big diverges, too small crawls.")
    return n


# ------------------------------------------------------------------ M25
@module("M25-contextual-bandits")
def m25():
    n = NB()
    n.md("# M25 · Contextual Bandits — Toy Example, Step by Tiny Step\n\n"
         "**Companion to lesson M25.** Learn which of 3 arms pays best from feedback alone, using "
         "**epsilon-greedy** (mostly exploit the best-so-far, occasionally explore), and see the "
         "**break case** where zero exploration gets stuck on a bad arm.")
    n.md("## Step 0 · Setup"); n.code(SETUP)
    n.md("## Step 1 · Epsilon-greedy learns the best arm\n\n"
         "Three arms pay 1 with hidden probabilities 0.2, 0.5, 0.8. We keep a running average reward `Q` "
         "per arm. Each round: with prob `eps` explore a random arm, else pull the current best; then "
         "update that arm's average.")
    n.code(r"""
true_p = [0.2, 0.5, 0.8]; Q = [0.0, 0.0, 0.0]; N = [0, 0, 0]; eps = 0.1
rewards = []
for t in range(500):
    arm = np.random.randint(3) if np.random.rand() < eps else int(np.argmax(Q))
    reward = 1 if np.random.rand() < true_p[arm] else 0
    N[arm] += 1; Q[arm] += (reward - Q[arm]) / N[arm]        # incremental average
    rewards.append(reward)
log("learned Q (est. reward per arm)", np.round(Q, 2).tolist())
log("pulls per arm", N)
assert int(np.argmax(Q)) == 2                                 # it found the 0.8 arm

plt.plot(np.cumsum(rewards) / (np.arange(500) + 1))
plt.title("epsilon-greedy: average reward climbs"); plt.xlabel("round"); plt.ylabel("avg reward"); plt.show()
""")
    n.md("▶ What you'll see: Q[arm2] ≈ 0.8, most pulls on arm 2, and average reward rising toward 0.8.")
    n.md("## Step 2 · Break case: no exploration (eps=0) gets stuck\n\n"
         "With `eps=0` the agent only ever pulls whatever looked best first. One lucky early pull on a "
         "**bad** arm can lock it in forever — it never tries the truly-best arm.")
    n.code(r"""
Q0 = [0.0, 0.0, 0.0]; N0 = [0, 0, 0]
Q0[0] = 1.0; N0[0] = 1                                        # a lucky first win on the WORST arm (0.2)
for t in range(500):
    arm = int(np.argmax(Q0))                                 # pure greedy, no exploration
    reward = 1 if np.random.rand() < true_p[arm] else 0
    N0[arm] += 1; Q0[arm] += (reward - Q0[arm]) / N0[arm]
log("greedy-only pulls per arm", N0)
assert N0[2] == 0                                            # it NEVER even tried the best arm
print("Lesson: without exploration you can lock onto a bad arm forever.")
""")
    n.md("▶ What you'll see: all pulls stuck on arm 0, zero pulls on the truly-best arm 2.")
    n.md("## Recap\n\n- A bandit learns from **reward feedback only** — no labels.\n"
         "- **Epsilon-greedy** balances exploiting the best-so-far with exploring alternatives.\n"
         "- **No exploration** risks locking onto a bad arm; some exploration is essential.")
    return n


if __name__ == "__main__":
    for slug, fn in MODULES.items():
        fn().write(slug)
    print(f"\ngenerated {len(MODULES)} AFP toy notebooks")
