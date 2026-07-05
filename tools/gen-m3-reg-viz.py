#!/usr/bin/env python3
"""Generate M3.3 regularization intuition visuals + the real numbers used in the
numbered walkthrough. A degree-9 polynomial overfits 10 noisy points; L2 shrinks
the weights and fixes it. Writes PNGs to afp/assets/ and prints the numbers.

Run: python3 tools/gen-m3-reg-viz.py
"""
import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.metrics import mean_squared_error

OUT = os.path.join(os.path.dirname(__file__), "..", "afp", "assets")
os.makedirs(OUT, exist_ok=True)
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "font.size": 11})
BLUE, GREEN, RED, GRAY = "#4C72B0", "#55A868", "#C44E52", "#888888"

rng = np.random.default_rng(7)
def true_f(x): return 0.5 + 0.45 * np.sin(2 * np.pi * x)

# 10 noisy training points; a dense noisy validation set
xtr = np.sort(rng.uniform(0, 1, 10))
ytr = true_f(xtr) + rng.normal(0, 0.12, xtr.size)
xva = np.sort(rng.uniform(0, 1, 200))
yva = true_f(xva) + rng.normal(0, 0.12, xva.size)

DEG = 9
poly = PolynomialFeatures(DEG, include_bias=False)
Ptr, Pva = poly.fit_transform(xtr[:, None]), poly.transform(xva[:, None])
grid = np.linspace(0, 1, 400)
Pgrid = poly.transform(grid[:, None])

# unregularized (lambda = 0)
lin = LinearRegression().fit(Ptr, ytr)
# a well-chosen L2
ridge = Ridge(alpha=1e-3).fit(Ptr, ytr)

max_coef_lin = np.abs(lin.coef_).max()
max_coef_ridge = np.abs(ridge.coef_).max()
tr_lin = mean_squared_error(ytr, lin.predict(Ptr))
va_lin = mean_squared_error(yva, lin.predict(Pva))
tr_rid = mean_squared_error(ytr, ridge.predict(Ptr))
va_rid = mean_squared_error(yva, ridge.predict(Pva))

# ---------------------------------------------------------------- fig 1: the fits
fig, ax = plt.subplots(figsize=(6.6, 4.3))
ax.plot(grid, true_f(grid), color=GRAY, lw=2, ls="--", label="true curve")
ax.scatter(xtr, ytr, color="black", zorder=5, s=45, label="10 noisy training points")
ax.plot(grid, lin.predict(Pgrid), color=RED, lw=2.2, label=f"no penalty (λ=0): wild")
ax.plot(grid, ridge.predict(Pgrid), color=GREEN, lw=2.6, label="L2 (λ=1e-3): smooth")
ax.set_ylim(-0.6, 1.7); ax.set_xlabel("x"); ax.set_ylabel("y")
ax.set_title("Same degree-9 model: no penalty overfits, L2 recovers the shape")
ax.legend(loc="upper right", fontsize=9)
fig.tight_layout(); fig.savefig(os.path.join(OUT, "m3-reg-fit.png"), dpi=95); plt.close(fig)

# ---------------------------------------------------------------- fig 2: U-curve vs lambda
lams = np.logspace(-8, 3, 40)
tr_curve, va_curve = [], []
for a in lams:
    m = Ridge(alpha=a).fit(Ptr, ytr)
    tr_curve.append(mean_squared_error(ytr, m.predict(Ptr)))
    va_curve.append(mean_squared_error(yva, m.predict(Pva)))
best = int(np.argmin(va_curve))
fig, ax = plt.subplots(figsize=(6.6, 4.3))
ax.plot(lams, tr_curve, color=BLUE, lw=2.2, marker="o", ms=3, label="train MSE")
ax.plot(lams, va_curve, color=RED, lw=2.2, marker="o", ms=3, label="validation MSE")
ax.axvline(lams[best], color=GREEN, lw=2, ls="--", label=f"best λ ≈ {lams[best]:.1e}")
ax.annotate("overfit\n(λ too small)", xy=(lams[1], va_curve[1]), xytext=(3e-8, 0.12),
            fontsize=9, color=RED, arrowprops=dict(arrowstyle="->", color=RED))
ax.annotate("underfit\n(λ too large)", xy=(lams[-3], va_curve[-3]), xytext=(2, 0.08),
            fontsize=9, color=RED, arrowprops=dict(arrowstyle="->", color=RED))
ax.set_xscale("log"); ax.set_xlabel("regularization strength λ"); ax.set_ylabel("MSE")
ax.set_title("Validation error is U-shaped in λ — pick the bottom")
ax.legend(loc="upper center", fontsize=9)
fig.tight_layout(); fig.savefig(os.path.join(OUT, "m3-reg-ucurve.png"), dpi=95); plt.close(fig)

# ---------------------------------------------------------------- fig 3: coefficient magnitudes
idx = np.arange(1, DEG + 1)
fig, ax = plt.subplots(figsize=(6.6, 4.3))
w = 0.4
ax.bar(idx - w/2, np.abs(lin.coef_), w, color=RED, label="no penalty (λ=0)")
ax.bar(idx + w/2, np.abs(ridge.coef_), w, color=GREEN, label="L2 (λ=1e-3)")
ax.set_yscale("log"); ax.set_xlabel("polynomial term (power of x)")
ax.set_ylabel("|weight|  (log scale)")
ax.set_title("Regularization shrinks the huge weights that fit noise")
ax.legend(fontsize=9); ax.set_xticks(idx)
fig.tight_layout(); fig.savefig(os.path.join(OUT, "m3-reg-coefs.png"), dpi=95); plt.close(fig)

# L1 sparsity note
lasso = Lasso(alpha=1e-3, max_iter=100000).fit(Ptr, ytr)
n_zero = int(np.sum(np.abs(lasso.coef_) < 1e-8))

print(f"no-penalty  : max|w| = {max_coef_lin:,.0f}   train MSE = {tr_lin:.4f}   val MSE = {va_lin:.3f}")
print(f"L2 (1e-3)   : max|w| = {max_coef_ridge:,.1f}     train MSE = {tr_rid:.4f}   val MSE = {va_rid:.3f}")
print(f"best λ on the U-curve ≈ {lams[best]:.1e}  (val MSE {va_curve[best]:.3f})")
print(f"L1 (Lasso 1e-3): zeros out {n_zero} of {DEG} polynomial terms (sparse)")
print("wrote m3-reg-fit.png, m3-reg-ucurve.png, m3-reg-coefs.png")
