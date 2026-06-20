/* =====================================================================
   CODE SECTIONS for MODULE 7 — Machine Learning — more.
   One window.CODE entry per lesson in 07-ml-extra.js.
   Runnable in Pyodide: numpy / scipy / scikit-learn / pandas / stdlib.
   ===================================================================== */
window.CODE = Object.assign(window.CODE || {}, {

  "mlx-newton": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Newton's method on a 1-D convex cost <b>J(t) = 3t^2 - 12t + 7</b>. The update is t &larr; t - J'(t)/J''(t).</p>
              <p>Because J is a true parabola, the Hessian (here just J'' = 6) is constant, so Newton lands exactly on the minimum (t = 2) in a single step. We print each iterate to show convergence.</p>`,
    code: `import numpy as np

# Convex cost J(t) = 3t^2 - 12t + 7. Minimum at t = 2.
J   = lambda t: 3*t**2 - 12*t + 7   # cost
Jp  = lambda t: 6*t - 12            # first derivative (slope)
Jpp = lambda t: 6.0                 # second derivative (curvature, constant)

t = 5.0                             # start anywhere
print("start: t=%.6f  J=%.6f  J'=%.6f" % (t, J(t), Jp(t)))
for i in range(1, 5):
    t = t - Jp(t) / Jpp(t)         # Newton step: slope / curvature
    print("step %d: t=%.6f  J=%.6f  J'=%.6f" % (i, t, J(t), Jp(t)))
    if abs(Jp(t)) < 1e-9:
        break
print("minimum at t=%.6f (exact = 2.0) reached in 1 step" % t)
`
  },

  "mlx-lwr": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Locally weighted regression from scratch with NumPy. At each query point we fit a weighted least-squares line, giving nearby training points a Gaussian weight w = exp(-(x-xq)^2 / (2*tau^2)).</p>
              <p>We solve the weighted normal equations (X^T W X) theta = X^T W y and predict at a few queries, printing how a small vs large bandwidth tau changes the fit.</p>`,
    code: `import numpy as np
rng = np.random.RandomState(0)

# Deterministic curvy data: y = sin(x) + 0.25x + noise.
x = np.linspace(-5, 5, 40)
y = np.sin(x) + 0.25*x + 0.15*rng.randn(40)
X = np.c_[np.ones_like(x), x]        # design matrix with intercept column

def lwr_predict(xq, tau):
    w = np.exp(-((x - xq)**2) / (2*tau**2))   # Gaussian weights
    W = np.diag(w)
    # Weighted normal equations: (X^T W X) theta = X^T W y
    theta = np.linalg.solve(X.T @ W @ X, X.T @ W @ y)
    return theta @ np.array([1.0, xq])

for tau in [0.3, 0.8, 3.0]:
    preds = [lwr_predict(xq, tau) for xq in [-3.0, 0.0, 3.0]]
    print("tau=%.1f  preds@(-3,0,3) = [%.3f, %.3f, %.3f]" %
          (tau, preds[0], preds[1], preds[2]))
print("small tau hugs the data (wiggly); large tau ~ one straight line")
`
  },

  "mlx-cross-validation": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>k-fold cross-validation with scikit-learn's <code>cross_val_score</code>. We make a deterministic regression dataset and score a linear model across 5 folds.</p>
              <p>Each fold takes a turn as the held-out validation set; the reported CV error is the average of the 5 fold scores (we use negative MSE, then negate it back to a positive error).</p>`,
    code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score, KFold

X, y = make_regression(n_samples=200, n_features=8, noise=12.0,
                       random_state=0)
model = KFold(n_splits=5, shuffle=True, random_state=0)

# Negative MSE per fold (sklearn maximizes, so error is reported negative).
scores = cross_val_score(LinearRegression(), X, y,
                         cv=model, scoring="neg_mean_squared_error")
mse_per_fold = -scores
for j, m in enumerate(mse_per_fold, 1):
    print("fold %d: MSE = %.3f" % (j, m))
print("CV MSE = mean of 5 folds = %.3f  (std %.3f)" %
      (mse_per_fold.mean(), mse_per_fold.std()))
`
  },

  "mlx-model-selection": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Model selection by balancing fit against complexity. We fit polynomial regressions of growing degree, then score each with AIC = 2k - 2*lnL and BIC = k*ln(n) - 2*lnL using the residual sum of squares.</p>
              <p>The misfit term keeps shrinking with more parameters, but the penalty grows — so AIC/BIC dip then climb. We print the scores and the winning (lowest-AIC) degree.</p>`,
    code: `import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

rng = np.random.RandomState(0)
x = np.linspace(-3, 3, 60)
y = 2 + 1.5*x - 0.8*x**2 + 0.5*rng.randn(60)   # true degree 2
n = len(y)

print("degree   RSS      AIC      BIC")
best_deg, best_aic = None, np.inf
for deg in range(1, 8):
    Xp = PolynomialFeatures(deg).fit_transform(x.reshape(-1, 1))
    yhat = LinearRegression().fit(Xp, y).predict(Xp)
    rss = float(np.sum((y - yhat)**2))
    k = Xp.shape[1] + 1                          # coefs + noise variance
    lnL = -0.5*n*(np.log(2*np.pi*rss/n) + 1)    # Gaussian log-likelihood
    aic = 2*k - 2*lnL
    bic = k*np.log(n) - 2*lnL
    print("%5d  %7.3f  %7.2f  %7.2f" % (deg, rss, aic, bic))
    if aic < best_aic:
        best_aic, best_deg = aic, deg
print("best degree by AIC = %d" % best_deg)
`
  },

  "mlx-clustering-metrics": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Clustering quality via the silhouette score. We make three deterministic blobs, run k-means for several values of k, and compute <code>silhouette_score</code> for each clustering.</p>
              <p>The silhouette s = (b-a)/max(a,b) rewards tight, well-separated clusters. Because the data really has 3 blobs, k = 3 scores highest — which we print and select automatically.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=300, centers=3, cluster_std=0.8,
                  random_state=0)

best_k, best_s = None, -1.0
for k in range(2, 7):
    labels = KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(X)
    s = silhouette_score(X, labels)             # mean silhouette over points
    print("k=%d  avg silhouette = %.4f" % (k, s))
    if s > best_s:
        best_s, best_k = s, k
print("best k by silhouette = %d (true number of blobs = 3)" % best_k)
`
  },

  "mlx-error-analysis": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Ablative analysis on a real model: which feature groups actually earn their keep? We train logistic regression on the full feature set, then remove one block at a time and measure the accuracy drop.</p>
              <p>The block whose removal costs the most accuracy is contributing the most — the same "change one component, re-measure" logic as error/ablative analysis. We print each drop and the most important block.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

X, y = make_classification(n_samples=400, n_features=8, n_informative=4,
                           n_redundant=0, random_state=0)
acc = lambda cols: cross_val_score(
    LogisticRegression(max_iter=1000), X[:, cols], y, cv=5).mean()

full = acc(list(range(8)))                       # baseline: all features
print("full system accuracy = %.4f" % full)

blocks = {"feat0-1": [0, 1], "feat2-3": [2, 3],
          "feat4-5": [4, 5], "feat6-7": [6, 7]}
drops = {}
for name, cols in blocks.items():
    keep = [c for c in range(8) if c not in cols]
    drop = full - acc(keep)                       # accuracy lost without block
    drops[name] = drop
    print("remove %-8s -> drop = %+.4f" % (name, drop))
top = max(drops, key=drops.get)
print("most important block = %s (largest drop)" % top)
`
  }

});
