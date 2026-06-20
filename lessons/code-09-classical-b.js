/* Per-lesson CODE SECTION for Module 9B — Classical ML (beyond the cheat sheet).
   { lib, runnable, packages?, explain(HTML), code } — runnable ones execute via Pyodide
   (only numpy / scikit-learn / scipy / pandas + stdlib; NO torch). Merged into window.CODE by id. */
window.CODE = Object.assign(window.CODE || {}, {

  "cls-stacking": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p><code>StackingClassifier</code> trains several diverse base models, then a meta-model learns how to combine their out-of-fold predictions. Compare the stack against each base model alone.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score

X, y = make_classification(n_samples=600, n_features=20, n_informative=8,
                           random_state=0)

base = [("rf", RandomForestClassifier(n_estimators=50, random_state=0)),
        ("knn", KNeighborsClassifier(n_neighbors=7))]
stack = StackingClassifier(estimators=base,
                           final_estimator=LogisticRegression(max_iter=1000),
                           cv=5)

for name, est in base + [("stack", stack)]:
    acc = cross_val_score(est, X, y, cv=5).mean()
    print("%-6s 5-fold accuracy = %.3f" % (name, acc))`
  },

  "cls-anomaly": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p><code>IsolationForest</code> scores points by how few random cuts isolate them. We plant a few obvious outliers and check the model flags them with the most-negative scores.</p>`,
    code: `import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(0)
inliers = rng.normal(0, 1, size=(200, 2))          # dense blob
outliers = rng.uniform(-6, 6, size=(10, 2))        # scattered far out
X = np.vstack([inliers, outliers])

iso = IsolationForest(contamination=0.05, random_state=0).fit(X)
pred = iso.predict(X)                               # -1 = anomaly, 1 = normal
score = iso.decision_function(X)                    # lower = more anomalous

flagged = np.where(pred == -1)[0]
print("points flagged as anomalies:", len(flagged))
print("of the 10 true outliers, caught:", sum(i >= 200 for i in flagged))
print("most anomalous index:", int(np.argmin(score)),
      " score=%.3f" % score.min())`
  },

  "cls-recommender": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Matrix factorization with <code>TruncatedSVD</code>: factor a sparse ratings matrix into thin user and item factors, then reconstruct to fill in the blanks. We check error on held-out known cells.</p>`,
    code: `import numpy as np
from sklearn.decomposition import TruncatedSVD

rng = np.random.default_rng(0)
# true low-rank ratings: 40 users x 25 items, rank 3
U = rng.normal(size=(40, 3)); V = rng.normal(size=(25, 3))
R = U @ V.T

mask = rng.random(R.shape) < 0.7                   # 70% observed
Robs = np.where(mask, R, 0.0)                       # zero-fill unknowns

svd = TruncatedSVD(n_components=3, random_state=0)
Z = svd.fit_transform(Robs)                         # user factors
Rhat = Z @ svd.components_                           # reconstruction

known = mask
hidden = ~mask
print("rank used        :", svd.n_components)
print("RMSE on observed :", round(np.sqrt(np.mean((Rhat[known]-R[known])**2)), 3))
print("RMSE on hidden   :", round(np.sqrt(np.mean((Rhat[hidden]-R[hidden])**2)), 3))`
  },

  "cls-tsne": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p><code>TSNE</code> squashes high-dimensional data to 2-D while keeping neighbors together. We embed three Gaussian blobs and confirm the clusters stay tight (small within-cluster spread, large between-cluster gaps).</p>`,
    code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.manifold import TSNE

X, labels = make_blobs(n_samples=150, n_features=10, centers=3,
                       cluster_std=1.0, random_state=0)

emb = TSNE(n_components=2, perplexity=30, init="pca",
           random_state=0).fit_transform(X)
print("embedded shape:", emb.shape)

# cluster centroids in the 2-D map
cents = np.array([emb[labels == k].mean(axis=0) for k in range(3)])
within = np.mean([np.linalg.norm(emb[labels == k] - cents[k], axis=1).mean()
                  for k in range(3)])
between = np.mean([np.linalg.norm(cents[i] - cents[j])
                   for i in range(3) for j in range(i + 1, 3)])
print("avg within-cluster radius :", round(within, 2))
print("avg between-cluster gap   :", round(between, 2))
print("separation ratio          :", round(between / within, 2))`
  },

  "cls-factor-analysis": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p><code>FactorAnalysis</code> explains many correlated signals with a few hidden factors plus per-variable noise. We build data from 2 true factors and check the model recovers a 2-factor structure.</p>`,
    code: `import numpy as np
from sklearn.decomposition import FactorAnalysis

rng = np.random.default_rng(0)
n, k, p = 500, 2, 6
Z = rng.normal(size=(n, k))                         # hidden factors
Lam = rng.normal(size=(k, p))                       # loadings
noise = rng.normal(0, 0.5, size=(n, p))             # per-variable noise
X = Z @ Lam + noise                                  # observed signals

fa = FactorAnalysis(n_components=2, random_state=0).fit(X)
print("loading matrix shape:", fa.components_.shape)
print("learned noise variance per signal:",
      np.round(fa.noise_variance_, 2))
print("avg log-likelihood:", round(fa.score(X), 3))

# 1-factor model should fit worse than 2-factor (truth has 2)
fa1 = FactorAnalysis(n_components=1, random_state=0).fit(X)
print("score with 1 factor :", round(fa1.score(X), 3))
print("score with 2 factors:", round(fa.score(X), 3))`
  },

  "cls-svr": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p><code>SVR</code> fits a function inside an epsilon-tube, ignoring points already covered. We fit a noisy sine and inspect how many training points became support vectors.</p>`,
    code: `import numpy as np
from sklearn.svm import SVR

rng = np.random.default_rng(0)
X = np.sort(rng.uniform(0, 6, size=(120, 1)), axis=0)
y = np.sin(X[:, 0]) + rng.normal(0, 0.1, size=120)

svr = SVR(kernel="rbf", C=10.0, epsilon=0.1, gamma="scale").fit(X, y)
pred = svr.predict(X)

print("R^2 on training data :", round(svr.score(X, y), 3))
print("support vectors      :", len(svr.support_), "of", len(X))
print("fraction inside tube :",
      round(1 - len(svr.support_) / len(X), 3))
print("max residual         :", round(np.abs(y - pred).max(), 3))`
  },

  "cls-bandits": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>No sklearn estimator fits a bandit, so here is a clean from-scratch <b>UCB1</b> loop in NumPy. Three arms with unknown payouts; UCB should converge to pulling the best arm most often.</p>`,
    code: `import numpy as np

rng = np.random.default_rng(0)
true_p = np.array([0.3, 0.55, 0.7])                 # hidden win rates
K, T = len(true_p), 2000
sums = np.zeros(K); counts = np.zeros(K)

# seed: pull each arm once
for i in range(K):
    r = rng.random() < true_p[i]
    sums[i] += r; counts[i] += 1

for t in range(K, T):
    mean = sums / counts
    bonus = np.sqrt(2 * np.log(t) / counts)         # optimism bonus
    arm = int(np.argmax(mean + bonus))              # UCB1 choice
    r = rng.random() < true_p[arm]
    sums[arm] += r; counts[arm] += 1

best = int(np.argmax(true_p))
print("pulls per arm   :", counts.astype(int).tolist())
print("estimated means :", np.round(sums / counts, 3).tolist())
print("true best arm   :", best, " pulled %.1f%% of the time"
      % (100 * counts[best] / T))
total_reward = sums.sum()
print("avg reward/pull :", round(total_reward / T, 3),
      " (best possible %.3f)" % true_p[best])`
  }

});
