#!/usr/bin/env python3
"""Generate M3.1 loss-function visualizations that make the 'Use when' column
concrete. Writes 3 PNGs to afp/assets/:

  m3-loss-shapes.png    - loss vs residual: who punishes big errors
  m3-loss-outliers.png  - fit a constant with an outlier: mean vs median vs Huber
  m3-loss-gradient.png  - dLoss/dr: why Huber optimizes smoothly yet stays robust

Uses matplotlib only. Run: python3 tools/gen-m3-loss-viz.py
"""
import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

MSE_C, MAE_C, HUB_C = "#C44E52", "#4C72B0", "#55A868"
OUT = os.path.join(os.path.dirname(__file__), "..", "afp", "assets")
os.makedirs(OUT, exist_ok=True)
plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "font.size": 11})

DELTA = 1.0
def huber(r, d=DELTA):
    a = np.abs(r)
    return np.where(a <= d, 0.5 * r**2, d * (a - 0.5 * d))
def huber_grad(r, d=DELTA):
    return np.clip(r, -d, d)

# ------------------------------------------------- 1) loss shapes vs residual
r = np.linspace(-4, 4, 400)
fig, ax = plt.subplots(figsize=(6.4, 4.2))
ax.plot(r, r**2, color=MSE_C, lw=2.4, label=r"MSE  $r^2$")
ax.plot(r, np.abs(r), color=MAE_C, lw=2.4, label=r"MAE  $|r|$")
ax.plot(r, huber(r), color=HUB_C, lw=2.8, label=r"Huber ($\delta=1$)")
ax.axvspan(-DELTA, DELTA, color="gray", alpha=.08)
ax.annotate("MSE explodes on\nlarge errors", xy=(3, 9), xytext=(0.2, 12),
            color=MSE_C, fontsize=10, arrowprops=dict(arrowstyle="->", color=MSE_C))
ax.annotate("MAE grows only\nlinearly (outlier-robust)", xy=(3.6, 3.6), xytext=(-3.9, 9.5),
            color=MAE_C, fontsize=10, arrowprops=dict(arrowstyle="->", color=MAE_C))
ax.annotate("Huber = MSE near 0,\nMAE in the tails", xy=(1.6, huber(1.6)), xytext=(-1.2, 6.2),
            color=HUB_C, fontsize=10, arrowprops=dict(arrowstyle="->", color=HUB_C))
ax.set_xlabel("residual  r = prediction − actual"); ax.set_ylabel("loss")
ax.set_title("Loss shape: how hard is a big error punished?")
ax.set_ylim(-0.4, 14); ax.legend(loc="upper center")
fig.tight_layout(); fig.savefig(os.path.join(OUT, "m3-loss-shapes.png"), dpi=95); plt.close(fig)

# ------------------------------------------------- 2) outlier tug-of-war
y = np.array([9., 10., 10., 11., 12., 13., 60.])          # bulk ~10-11 + one outlier
grid = np.linspace(8, 62, 20001)
mse_fit = grid[np.argmin([np.mean((y - c)**2) for c in grid])]      # == mean
mae_fit = grid[np.argmin([np.mean(np.abs(y - c)) for c in grid])]   # == median
hub_fit = grid[np.argmin([np.mean(huber(y - c)) for c in grid])]

fig, ax = plt.subplots(figsize=(7.6, 3.4))
ax.scatter(y[:-1], np.zeros(len(y) - 1), s=90, color="#444", zorder=3, label="bulk points")
ax.scatter(y[-1], 0, s=140, color="#C44E52", marker="X", zorder=3, label="outlier (60)")
for val, c, name, ls in [(mse_fit, MSE_C, "MSE fit = mean", "-"),
                         (hub_fit, HUB_C, "Huber fit", "-"),
                         (mae_fit, MAE_C, "MAE fit = median", "--")]:
    ax.axvline(val, color=c, lw=2.4, ls=ls, label=f"{name}  ({val:.1f})")
ax.set_yticks([]); ax.set_xlim(7, 63)
ax.set_xlabel("value being predicted (a single constant)")
ax.set_title("Where does the fit land? One outlier drags the MSE fit; MAE/Huber resist")
ax.legend(loc="upper center", ncol=2, fontsize=9)
fig.tight_layout(); fig.savefig(os.path.join(OUT, "m3-loss-outliers.png"), dpi=95); plt.close(fig)

# ------------------------------------------------- 3) gradient (optimization signal)
r = np.linspace(-4, 4, 400)
fig, ax = plt.subplots(figsize=(6.4, 4.2))
ax.plot(r, 2 * r, color=MSE_C, lw=2.4, label=r"MSE'  $2r$ (unbounded)")
ax.plot(r, np.sign(r), color=MAE_C, lw=2.4, label=r"MAE'  $\mathrm{sign}(r)$ (jumps at 0)")
ax.plot(r, huber_grad(r), color=HUB_C, lw=2.8, label=r"Huber' (smooth & bounded)")
ax.scatter([0, 0], [1, -1], color=MAE_C, facecolors="white", zorder=4, s=45)
ax.annotate("MAE gradient is discontinuous\nat 0 → jitters near the optimum",
            xy=(0, 0), xytext=(-3.9, 4.3), color=MAE_C, fontsize=9.5,
            arrowprops=dict(arrowstyle="->", color=MAE_C))
ax.annotate("MSE gradient grows without bound\n→ one outlier = huge step",
            xy=(3.4, 6.8), xytext=(-2.0, -6.6), color=MSE_C, fontsize=9.5,
            arrowprops=dict(arrowstyle="->", color=MSE_C))
ax.axhline(0, color="k", lw=.6)
ax.set_xlabel("residual  r"); ax.set_ylabel("dLoss / dr  (the step the optimizer takes)")
ax.set_title("Gradient: Huber is smooth through 0 yet bounded in the tails")
ax.set_ylim(-8, 8); ax.legend(loc="lower right", fontsize=9)
fig.tight_layout(); fig.savefig(os.path.join(OUT, "m3-loss-gradient.png"), dpi=95); plt.close(fig)

print("mean(MSE fit):", round(mse_fit, 2), "| median(MAE fit):", round(mae_fit, 2),
      "| Huber fit:", round(hub_fit, 2))
print("wrote 3 PNGs to", os.path.relpath(OUT))
