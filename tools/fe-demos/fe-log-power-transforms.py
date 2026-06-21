# =============================================================================
# LESSON: Log / power (Box-Cox) transform of a heavy-tailed positive feature
# -----------------------------------------------------------------------------
# THE STORY a beginner should SEE:
#   - We have ONE positive feature x that is RIGHT-SKEWED: most values are small,
#     but a few are HUGE (a "heavy tail"). Think income, city population, # of
#     followers, web-page visits -- they all look like this.
#   - The TRUE relationship is log-linear:  y grows with log(x), not with x.
#   - If we fit a plain LINEAR REGRESSION on the RAW x, the few giant x values
#     dominate the fit, R^2 is poor, and the residual-vs-fitted plot FUNNELS
#     (heteroscedastic: errors get bigger as the prediction gets bigger).
#   - THE FIX: replace x with log1p(x) = log(1 + x). The feature becomes roughly
#     symmetric/Gaussian, the SAME linear regression now fits well (higher R^2),
#     and the residual plot is an even, flat band.
# =============================================================================

import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# -----------------------------------------------------------------------------
# 1. LOAD / BUILD DATA  (constructed with a FIXED rng so numbers reproduce).
#    We build a REALISTIC right-skewed positive feature: a log-normal variable.
#    log-normal = exp(normal), which is exactly the heavy-tailed shape you get
#    for income / counts / sizes in the real world. The target depends on
#    log(x) -- a genuine log-linear relation -- plus a little noise.
# -----------------------------------------------------------------------------
rng = np.random.default_rng(0)
n = 400

# x is positive and heavy-tailed: most values small, a few enormous.
x = np.exp(rng.normal(loc=0.0, scale=1.3, size=n))      # log-normal -> right-skewed
# TRUE signal is log-linear: y = a + b*log(x) + noise.
y = 3.0 + 2.0 * np.log(x) + rng.normal(scale=1.0, size=n)

X_raw = x.reshape(-1, 1)                                  # sklearn wants 2-D
X_log = np.log1p(x).reshape(-1, 1)                        # log1p = log(1 + x)

# -----------------------------------------------------------------------------
# 2. VISUALIZE THE PURE (RAW) DATA -- histogram of the raw vs the logged feature.
#    The raw histogram is a tall spike near 0 with a long tail to the right.
#    The logged histogram is a nice symmetric bell. (Side by side.)
# -----------------------------------------------------------------------------
fig, ax = plt.subplots(1, 2, figsize=(11, 4))
ax[0].hist(x, bins=40, color="#d9534f", edgecolor="white")
ax[0].set_title("RAW feature x (right-skewed, heavy tail)")
ax[0].set_xlabel("x"); ax[0].set_ylabel("count")
ax[1].hist(np.log1p(x), bins=40, color="#5cb85c", edgecolor="white")
ax[1].set_title("log1p(x)  (symmetric / ~Gaussian)")
ax[1].set_xlabel("log1p(x)"); ax[1].set_ylabel("count")
plt.tight_layout(); plt.show()

# -----------------------------------------------------------------------------
# 3. REPRODUCE THE PROBLEM ON RAW DATA -- fit linear regression on RAW x.
#    R^2 is poor because a straight line in x cannot follow a log-shaped curve,
#    and the handful of giant x values drag the line around.
# -----------------------------------------------------------------------------
raw_model = LinearRegression().fit(X_raw, y)
y_pred_raw = raw_model.predict(X_raw)
r2_raw = r2_score(y, y_pred_raw)
resid_raw = y - y_pred_raw
print(f"PROBLEM (raw x):        R^2 = {r2_raw:.3f}")

# -----------------------------------------------------------------------------
# 4. APPLY THE FIX (already computed X_log above) and refit the SAME model.
# -----------------------------------------------------------------------------
log_model = LinearRegression().fit(X_log, y)
y_pred_log = log_model.predict(X_log)
r2_log = r2_score(y, y_pred_log)
resid_log = y - y_pred_log
print(f"FIX (log1p(x) feature): R^2 = {r2_log:.3f}")

# -----------------------------------------------------------------------------
#    VISUALIZE THE FAILURE vs THE FIX -- residual-vs-fitted scatter, side by side.
#    LEFT (raw): a FUNNEL -- spread of residuals grows with the fitted value
#                (heteroscedastic). The model is systematically wrong.
#    RIGHT (log): an EVEN, flat band of points around 0 -- well-behaved errors.
# -----------------------------------------------------------------------------
fig, ax = plt.subplots(1, 2, figsize=(11, 4), sharey=True)
ax[0].scatter(y_pred_raw, resid_raw, s=12, alpha=0.6, color="#d9534f")
ax[0].axhline(0, color="black", lw=1)
ax[0].set_title(f"RAW: residuals FUNNEL  (R^2={r2_raw:.2f})")
ax[0].set_xlabel("fitted value"); ax[0].set_ylabel("residual (y - prediction)")
ax[1].scatter(y_pred_log, resid_log, s=12, alpha=0.6, color="#5cb85c")
ax[1].axhline(0, color="black", lw=1)
ax[1].set_title(f"FIXED: residuals EVEN  (R^2={r2_log:.2f})")
ax[1].set_xlabel("fitted value")
plt.tight_layout(); plt.show()

# -----------------------------------------------------------------------------
# 5. ONE-LINE SUMMARY
# -----------------------------------------------------------------------------
print(f"PROBLEM (raw): {r2_raw:.3f}   ->   FIX (log1p feature): {r2_log:.3f}")
