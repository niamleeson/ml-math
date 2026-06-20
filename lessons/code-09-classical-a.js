/* =====================================================================
   CODE SECTION for MODULE 09 (A) — CLASSICAL ML (beyond the cheat sheet).
   One window.CODE entry per lesson id in 09-classical-a.js.
   Primary library: scikit-learn. Every snippet is deterministic
   (random_state=0), self-contained, and prints results/metrics.
   ===================================================================== */
window.CODE = Object.assign(window.CODE || {}, {

  "cls-gmm": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Soft clustering with <code>GaussianMixture</code>. We make 3 blobs, fit a 3-component mixture, and print the recovered weights, the converged means, and the soft responsibilities for the first few points. <code>predict_proba</code> gives each point's membership across components.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.mixture import GaussianMixture

X, y_true = make_blobs(n_samples=300, centers=3, cluster_std=1.0, random_state=0)

gmm = GaussianMixture(n_components=3, covariance_type="full", random_state=0)
gmm.fit(X)

print("converged:", gmm.converged_, "in", gmm.n_iter_, "iters")
print("mixing weights (pi):", np.round(gmm.weights_, 3))
print("component means:\\n", np.round(gmm.means_, 2))

labels = gmm.predict(X)
print("hard label counts:", np.bincount(labels))

proba = gmm.predict_proba(X[:3])
print("soft responsibilities (first 3 points):\\n", np.round(proba, 3))
print("avg log-likelihood per sample:", round(gmm.score(X), 3))`
  },

  "cls-dbscan": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Density clustering with <code>DBSCAN</code> on two crescent moons. No <code>k</code> is given — DBSCAN discovers the clusters from density and labels sparse points as noise (label <code>-1</code>). We print how many clusters it found and how many points became noise.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.cluster import DBSCAN

X, _ = make_moons(n_samples=300, noise=0.06, random_state=0)

db = DBSCAN(eps=0.2, min_samples=5)
labels = db.fit_predict(X)

# label -1 means noise; count distinct cluster ids excluding it
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = int(np.sum(labels == -1))

print("clusters found:", n_clusters)
print("noise points:", n_noise)
print("label values:", sorted(set(labels)))
for lab in sorted(set(labels)):
    print("  cluster", lab, "->", int(np.sum(labels == lab)), "points")
print("core samples:", len(db.core_sample_indices_))`
  },

  "cls-spectral-clustering": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p><code>SpectralClustering</code> cuts a nearest-neighbor similarity graph along its thin seam, so it separates two interleaved moons that k-means slices in half. We compare both on the same data with the Adjusted Rand Index against the true moon labels.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.cluster import SpectralClustering, KMeans
from sklearn.metrics import adjusted_rand_score

X, y = make_moons(n_samples=300, noise=0.06, random_state=0)

sc = SpectralClustering(n_clusters=2, affinity="nearest_neighbors",
                        n_neighbors=10, assign_labels="kmeans",
                        random_state=0)
sc_labels = sc.fit_predict(X)

km_labels = KMeans(n_clusters=2, n_init=10, random_state=0).fit_predict(X)

print("spectral cluster sizes:", np.bincount(sc_labels))
print("spectral ARI vs truth:", round(adjusted_rand_score(y, sc_labels), 3))
print("k-means  ARI vs truth:", round(adjusted_rand_score(y, km_labels), 3))
print("-> spectral follows the curved moons; k-means does not")`
  },

  "cls-lda-qda": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>LDA (shared covariance, linear boundary) vs QDA (per-class covariance, curved boundary) from <code>sklearn.discriminant_analysis</code>. We fit both on a 2-class, 2-feature problem with a train/test split and print held-out accuracy for each.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.discriminant_analysis import (
    LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis)

X, y = make_classification(n_samples=400, n_features=2, n_redundant=0,
                           n_informative=2, n_clusters_per_class=1,
                           class_sep=1.2, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

lda = LinearDiscriminantAnalysis().fit(Xtr, ytr)
qda = QuadraticDiscriminantAnalysis().fit(Xtr, ytr)

print("class priors (LDA):", np.round(lda.priors_, 3))
print("LDA test accuracy:", round(lda.score(Xte, yte), 3))
print("QDA test accuracy:", round(qda.score(Xte, yte), 3))
print("LDA predicts (first 8):", lda.predict(Xte[:8]))
print("true labels  (first 8):", yte[:8])`
  },

  "cls-gaussian-process": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>A <code>GaussianProcessRegressor</code> with an RBF kernel fits a noisy 1-D function and returns a mean <em>and</em> a standard deviation at each test point. The error bars pinch shut near training data and fan out far from it — we print the std at a covered point vs a far-out point.</p>`,
    code: `import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, WhiteKernel

rng = np.random.RandomState(0)
X = np.sort(rng.uniform(-3, 3, 12)).reshape(-1, 1)
y = np.sin(X).ravel() + 0.1 * rng.randn(12)

kernel = 1.0 * RBF(length_scale=1.0) + WhiteKernel(noise_level=0.01)
gp = GaussianProcessRegressor(kernel=kernel, random_state=0,
                              normalize_y=True).fit(X, y)

print("learned kernel:", gp.kernel_)
print("log marginal likelihood:", round(gp.log_marginal_likelihood_value_, 3))

Xtest = np.array([[0.0], [10.0]])   # one point near data, one far away
mean, std = gp.predict(Xtest, return_std=True)
print("at x=0  : mean=%.3f  std=%.3f" % (mean[0], std[0]))
print("at x=10 : mean=%.3f  std=%.3f" % (mean[1], std[1]))
print("-> std is far larger where there is no data")`
  },

  "cls-bayesian-regression": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p><code>BayesianRidge</code> places a Gaussian prior on the weights and returns a posterior, so <code>predict(..., return_std=True)</code> gives calibrated error bars. We fit a linear regression problem and print the learned weights, the inferred noise/weight precisions, and predictive std on a couple of test points.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import BayesianRidge

X, y, coef = make_regression(n_samples=120, n_features=4, noise=8.0,
                             coef=True, random_state=0)

br = BayesianRidge(compute_score=True)
br.fit(X, y)

print("true coefficients :", np.round(coef, 2))
print("learned coef (mean):", np.round(br.coef_, 2))
print("intercept:", round(br.intercept_, 3))
print("alpha (noise precision):", round(br.alpha_, 4))
print("lambda (weight precision):", round(br.lambda_, 4))

mean, std = br.predict(X[:3], return_std=True)
for i in range(3):
    print("pred %.2f +/- %.2f   (true %.2f)" % (mean[i], std[i], y[i]))`
  },

  "cls-gradient-boosting": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Stage-wise boosting with <code>GradientBoostingRegressor</code>: each tree fits the previous model's residuals. We fit a regression target, print held-out R^2 and MSE, and use <code>staged_predict</code> to show the test error dropping as trees are added.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score

X, y = make_regression(n_samples=400, n_features=6, noise=10.0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

gb = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1,
                               max_depth=3, random_state=0)
gb.fit(Xtr, ytr)

pred = gb.predict(Xte)
print("n_estimators:", gb.n_estimators_)
print("test R^2:", round(r2_score(yte, pred), 3))
print("test MSE:", round(mean_squared_error(yte, pred), 2))

# error after 1, 50, 200 trees -> shrinks as stages accumulate
for i, yp in enumerate(gb.staged_predict(Xte), start=1):
    if i in (1, 50, 200):
        print("after %3d trees  test MSE = %.2f" % (i, mean_squared_error(yte, yp)))`
  }

});
