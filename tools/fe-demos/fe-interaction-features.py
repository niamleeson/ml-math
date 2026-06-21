# Interaction features: adding the product x_i * x_j so a LINEAR model can
# capture that two features only matter TOGETHER (their joint sign here).
#
# THE STORY:
#   A plain linear model draws ONE straight line. If the class label depends on
#   the COMBINATION of two features (an XOR pattern), no single straight line
#   can split the data -> the model is stuck near 50% (coin-flip).
#   FIX: hand the model the product feature x1*x2. Now the same straight-line
#   model can separate the classes, because x1*x2 already encodes "same sign?".

import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression

# ----------------------------------------------------------------------------
# 1. LOAD DATA. There is no bundled XOR dataset, so we BUILD one with a fixed
#    rng (reproducible). Two features x1, x2 drawn from a normal distribution.
#    Rule: class y = 1 when x1 and x2 have the SAME sign (both +, or both -),
#    and y = 0 when they have OPPOSITE signs. This is the classic XOR pattern.
# ----------------------------------------------------------------------------
rng = np.random.default_rng(0)          # fixed seed -> same numbers every run
n = 400
x1 = rng.normal(size=n)                 # feature 1
x2 = rng.normal(size=n)                 # feature 2
X_raw = np.column_stack([x1, x2])       # raw feature matrix, shape (n, 2)
# "same sign" -> product is positive. That is exactly y = 1.
y = (np.sign(x1) == np.sign(x2)).astype(int)

# ----------------------------------------------------------------------------
# 2. VISUALIZE THE RAW DATA. Scatter colored by class. You can SEE the four
#    quadrants: top-right & bottom-left are one class, the other two quadrants
#    are the other class. No single straight line can carve that apart.
# ----------------------------------------------------------------------------
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

ax = axes[0]
ax.scatter(x1[y == 1], x2[y == 1], c="tab:blue",   s=18, label="y=1 (same sign)")
ax.scatter(x1[y == 0], x2[y == 0], c="tab:orange", s=18, label="y=0 (opp. sign)")
ax.axhline(0, color="gray", lw=0.8)
ax.axvline(0, color="gray", lw=0.8)
ax.set_xlabel("x1"); ax.set_ylabel("x2")
ax.set_title("RAW data: XOR pattern\n(no straight line can split the 4 quadrants)")
ax.legend(loc="upper right", fontsize=8)

# ----------------------------------------------------------------------------
# 3. REPRODUCE THE PROBLEM. Fit a LINEAR model (LogisticRegression) on the raw
#    [x1, x2] features. Because a straight line cannot separate XOR, accuracy
#    sits around 0.5 -- the model is barely better than guessing.
# ----------------------------------------------------------------------------
clf = LogisticRegression()
clf.fit(X_raw, y)
acc_raw = clf.score(X_raw, y)           # train accuracy on raw features
print(f"PROBLEM  -- linear model on raw [x1, x2]      accuracy = {acc_raw:.3f}")

# ----------------------------------------------------------------------------
# 4. APPLY THE TECHNIQUE: add the INTERACTION feature x1*x2, then visualize it.
#    Plot x1*x2 (one axis) against the class. The two classes now sit on
#    OPPOSITE sides of 0: same-sign points have x1*x2 > 0, opposite-sign < 0.
#    A single threshold at 0 splits them -> linearly separable on this axis.
# ----------------------------------------------------------------------------
inter = (x1 * x2).reshape(-1, 1)        # the new feature, shape (n, 1)
X_eng = np.column_stack([x1, x2, x1 * x2])   # raw features PLUS the product

ax = axes[1]
# small random y-jitter only so overlapping points are visible (cosmetic).
jitter = rng.normal(scale=0.04, size=n)
ax.scatter(inter[y == 1, 0], y[y == 1] + jitter[y == 1],
           c="tab:blue",   s=18, label="y=1 (same sign)")
ax.scatter(inter[y == 0, 0], y[y == 0] + jitter[y == 0],
           c="tab:orange", s=18, label="y=0 (opp. sign)")
ax.axvline(0, color="red", lw=1.2, ls="--", label="threshold at x1*x2 = 0")
ax.set_xlabel("interaction feature  x1 * x2")
ax.set_ylabel("class  y")
ax.set_title("ENGINEERED feature: x1*x2 vs class\n(classes split cleanly at 0)")
ax.legend(loc="center right", fontsize=8)

plt.tight_layout()
plt.show()

# ----------------------------------------------------------------------------
# 5. SHOW THE FIX. Re-fit the SAME LogisticRegression on [x1, x2, x1*x2].
#    The product feature does the heavy lifting -> accuracy jumps to ~1.0.
# ----------------------------------------------------------------------------
clf2 = LogisticRegression()
clf2.fit(X_eng, y)
acc_eng = clf2.score(X_eng, y)
print(f"FIX      -- same model + interaction x1*x2    accuracy = {acc_eng:.3f}")

# Explicit before/after summary.
print(f"PROBLEM (raw): {acc_raw:.3f}   ->   FIX (engineered): {acc_eng:.3f}")
