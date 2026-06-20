/* Per-lesson code implementations (industry libraries). Merged into window.CODE by id.
   { lib, runnable, packages?, explain(HTML), code } — runnable ones execute via Pyodide
   (only numpy / scikit-learn / scipy / pandas available; PyTorch is copy-to-run). */
window.CODE = Object.assign(window.CODE || {}, {
  "ml-supervised": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>The whole supervised loop in one library: build a labeled training set, <code>.fit</code> a model, then <code>.predict</code> on new inputs. <code>scikit-learn</code> is the standard toolkit for classical ML.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# synthetic labeled data: inputs X, answers y
X, y = make_classification(n_samples=400, n_features=4, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

# learn a rule h(x) from the training pairs
model = LogisticRegression().fit(Xtr, ytr)

# answer brand-new inputs it never saw
print("train accuracy:", round(model.score(Xtr, ytr), 3))
print("test  accuracy:", round(model.score(Xte, yte), 3))
print("first 5 predictions:", model.predict(Xte[:5]))`
  },
  "ml-loss": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A loss scores one prediction. Here is the raw math in <code>NumPy</code> for the three workhorse losses — squared, hinge, and cross-entropy — so you can see exactly what each computes.</p>`,
    code: `import numpy as np

# squared loss: 1/2 (y - z)^2
y, z = 3.0, 2.5
print("squared loss:", 0.5 * (y - z) ** 2)

# hinge loss (SVM): max(0, 1 - margin), margin = y * z, y in {-1, +1}
y_pm, score = 1.0, 0.3
print("hinge loss:", max(0.0, 1 - y_pm * score))

# binary cross-entropy: -[y log p + (1-y) log(1-p)]
y_bin, p = 1.0, 0.88
bce = -(y_bin * np.log(p) + (1 - y_bin) * np.log(1 - p))
print("cross-entropy:", round(float(bce), 4))

# bigger gap -> much bigger squared loss (4x the loss for 2x the gap)
for gap in [1.0, 2.0, 4.0]:
    print("gap %.0f -> squared loss %.1f" % (gap, 0.5 * gap ** 2))`
  },
  "ml-cost": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Cost is the loss summed (or averaged) over every example. Showing the raw <code>NumPy</code> sum makes clear that better parameters mean a lower total.</p>`,
    code: `import numpy as np

rng = np.random.default_rng(0)
X = rng.uniform(0, 10, size=20)
y = 2.0 * X + 1.0 + rng.normal(0, 1, size=20)   # true line y = 2x + 1

def cost(theta, b):
    pred = theta * X + b
    return np.mean(0.5 * (pred - y) ** 2)        # mean squared loss = J

# a bad guess vs. the true parameters
print("cost at bad   theta=0, b=0 :", round(cost(0.0, 0.0), 3))
print("cost at good  theta=2, b=1 :", round(cost(2.0, 1.0), 3))

# scan theta -> J(theta) is a bowl with one bottom
for t in [0.0, 1.0, 2.0, 3.0]:
    print("theta=%.1f  J=%.3f" % (t, cost(t, 1.0)))`
  },
  "ml-gradient-descent": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Gradient descent, written by hand in <code>NumPy</code>, so the update <b>theta &larr; theta - alpha &middot; grad</b> is fully visible. We minimize a simple bowl and watch it roll to the bottom.</p>`,
    code: `import numpy as np

# minimize J(theta) = theta^2, gradient = 2*theta, minimum at 0
def grad(theta):
    return 2 * theta

theta = 5.0       # starting point
alpha = 0.1       # learning rate (step size)

for step in range(20):
    theta = theta - alpha * grad(theta)   # step opposite the slope
    if step % 5 == 0:
        print("step %2d  theta=%.4f  J=%.4f" % (step, theta, theta ** 2))

print("converged theta:", round(theta, 5))   # close to 0
# too-big alpha diverges:
t = 5.0
for _ in range(5):
    t = t - 1.1 * grad(t)
print("alpha=1.1 blows up to:", round(t, 1))`
  },
  "ml-linear-regression": {
    lib: "NumPy + scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Fit a line two ways: the closed-form <b>normal equation</b> in NumPy, and <code>scikit-learn</code> (the standard library for classical ML). Both should agree.</p>`,
    code: `import numpy as np
from sklearn.linear_model import LinearRegression

# synthetic data: y = 3x + 2 + noise
rng = np.random.default_rng(0)
X = rng.uniform(0, 10, size=(50, 1))
y = 3 * X[:, 0] + 2 + rng.normal(0, 1, size=50)

# closed-form: w = (X^T X)^-1 X^T y
Xb = np.c_[np.ones(len(X)), X]
w = np.linalg.solve(Xb.T @ Xb, Xb.T @ y)
print("normal equation  intercept=%.3f  slope=%.3f" % (w[0], w[1]))

# scikit-learn
m = LinearRegression().fit(X, y)
print("scikit-learn     intercept=%.3f  slope=%.3f" % (m.intercept_, m.coef_[0]))
print("R^2 =", round(m.score(X, y), 4))`
  },
  "ml-likelihood": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Maximum likelihood, shown as raw math in <code>NumPy</code>: write the data's probability as a function of the parameter, then find the value that makes it largest. For a coin, that is just the fraction of heads.</p>`,
    code: `import numpy as np

# observed: 7 heads in 10 flips. Which heads-probability best explains it?
h, n = 7, 10

def log_likelihood(theta):
    # log of theta^h (1-theta)^(n-h)
    return h * np.log(theta) + (n - h) * np.log(1 - theta)

thetas = np.linspace(0.01, 0.99, 99)
ll = log_likelihood(thetas)
best = thetas[np.argmax(ll)]

print("log-likelihood at 0.5:", round(float(log_likelihood(0.5)), 4))
print("log-likelihood at 0.7:", round(float(log_likelihood(0.7)), 4))
print("argmax theta (grid):", round(float(best), 2))
print("closed-form MLE h/n :", h / n)`
  },
  "ml-logistic-regression": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>PyTorch is the industry standard for anything trained by gradient descent. Logistic regression is just a one-neuron net with a sigmoid and binary cross-entropy loss.</p>`,
    code: `import torch
import torch.nn as nn

model = nn.Linear(2, 1)              # weights w and bias b
loss_fn = nn.BCEWithLogitsLoss()    # sigmoid + cross-entropy, numerically stable
opt = torch.optim.SGD(model.parameters(), lr=0.1)

X = torch.randn(200, 2)
y = (X[:, 0] + X[:, 1] > 0).float().unsqueeze(1)   # true boundary

for epoch in range(100):
    opt.zero_grad()
    logits = model(X)
    loss = loss_fn(logits, y)
    loss.backward()                 # autograd computes gradients
    opt.step()                      # gradient-descent update

preds = (torch.sigmoid(model(X)) > 0.5).float()
print("accuracy:", (preds == y).float().mean().item())`
  },
  "ml-softmax": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Softmax (multinomial) regression is a one-layer net with K outputs trained by gradient descent. PyTorch's <code>CrossEntropyLoss</code> applies softmax + cross-entropy together, numerically stable.</p>`,
    code: `import torch
import torch.nn as nn

K = 3                                # number of classes
model = nn.Linear(4, K)              # one score per class
loss_fn = nn.CrossEntropyLoss()     # softmax + cross-entropy in one
opt = torch.optim.SGD(model.parameters(), lr=0.1)

X = torch.randn(300, 4)
y = (X[:, 0] + 2 * X[:, 1] > 0).long() + (X[:, 2] > 1).long()   # labels in {0,1,2}

for epoch in range(150):
    opt.zero_grad()
    logits = model(X)               # raw scores, shape (300, K)
    loss = loss_fn(logits, y)
    loss.backward()
    opt.step()

probs = torch.softmax(model(X), dim=1)   # each row sums to 1
preds = probs.argmax(dim=1)
print("accuracy:", (preds == y).float().mean().item())
print("first row probs:", probs[0].detach().tolist())`
  },
  "ml-glm": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>A generalized linear model swaps the squared-error/Gaussian assumption for another exponential-family distribution. For counts, the <b>Poisson</b> GLM is standard — <code>scikit-learn</code>'s <code>PoissonRegressor</code> with a log link.</p>`,
    code: `import numpy as np
from sklearn.linear_model import PoissonRegressor, LinearRegression

# count data: y ~ Poisson(mean = exp(0.5*x)), a log link
rng = np.random.default_rng(0)
X = rng.uniform(0, 3, size=(300, 1))
mean = np.exp(0.5 * X[:, 0])
y = rng.poisson(mean)

# Poisson GLM matches the data-generating process
glm = PoissonRegressor(alpha=0.0).fit(X, y)
print("Poisson coef:", round(glm.coef_[0], 3), " intercept:", round(glm.intercept_, 3))
print("Poisson deviance score:", round(glm.score(X, y), 4))

# plain linear regression ignores the count structure -> worse fit
lin = LinearRegression().fit(X, y)
print("linear R^2:", round(lin.score(X, y), 4))`
  },
  "ml-svm": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>A linear SVM finds the widest separating margin. <code>scikit-learn</code>'s <code>SVC(kernel="linear")</code> is the standard implementation; the support vectors are the points that sit on the margin.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=300, n_features=2, n_redundant=0,
                           n_clusters_per_class=1, class_sep=1.5, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

clf = SVC(kernel="linear", C=1.0).fit(Xtr, ytr)
print("test accuracy:", round(clf.score(Xte, yte), 3))
print("number of support vectors:", clf.support_vectors_.shape[0])
print("weight vector w:", np.round(clf.coef_[0], 3))`
  },
  "ml-kernels": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>The kernel trick lets an SVM draw curved boundaries without building the curved features. Here the <b>RBF kernel</b> separates concentric rings that no straight line can split.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_circles
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

# two concentric rings: not linearly separable
X, y = make_circles(n_samples=400, noise=0.08, factor=0.4, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

linear = SVC(kernel="linear").fit(Xtr, ytr)
rbf = SVC(kernel="rbf", gamma=1.0).fit(Xtr, ytr)

print("linear kernel test accuracy:", round(linear.score(Xte, yte), 3))
print("RBF    kernel test accuracy:", round(rbf.score(Xte, yte), 3))`
  },
  "ml-gda": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Gaussian discriminant analysis models each class as a bell curve, then uses Bayes' rule to classify. With a shared covariance this is <b>LDA</b>; with per-class covariance it is <b>QDA</b> — both in <code>scikit-learn</code>.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.discriminant_analysis import (
    LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis)
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=400, n_features=5, n_informative=3,
                           n_redundant=0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

lda = LinearDiscriminantAnalysis().fit(Xtr, ytr)     # shared covariance
qda = QuadraticDiscriminantAnalysis().fit(Xtr, ytr)  # per-class covariance

print("LDA test accuracy:", round(lda.score(Xte, yte), 3))
print("QDA test accuracy:", round(qda.score(Xte, yte), 3))
print("class priors:", np.round(lda.priors_, 3))`
  },
  "ml-naive-bayes": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Naive Bayes assumes features are independent given the class, then multiplies their probabilities. <code>scikit-learn</code> ships several variants; <code>GaussianNB</code> handles continuous features.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=400, n_features=6, n_informative=4,
                           random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

nb = GaussianNB().fit(Xtr, ytr)
print("test accuracy:", round(nb.score(Xte, yte), 3))
print("class priors P(y):", np.round(nb.class_prior_, 3))

# it outputs calibrated-ish probabilities per class
print("first 3 predicted probabilities:")
print(np.round(nb.predict_proba(Xte[:3]), 3))`
  },
  "ml-trees": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>A decision tree (CART) asks yes/no questions to split the data. <code>scikit-learn</code>'s <code>DecisionTreeClassifier</code> chooses splits by Gini impurity and is fully readable.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=400, n_features=5, n_informative=3,
                           random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

tree = DecisionTreeClassifier(max_depth=3, random_state=0).fit(Xtr, ytr)
print("test accuracy:", round(tree.score(Xte, yte), 3))
print("feature importances:", np.round(tree.feature_importances_, 3))
print(export_text(tree, max_depth=2).strip()[:200])`
  },
  "ml-ensembles": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Ensembles combine many weak models into a strong one. <code>RandomForest</code> averages independent trees (bagging); <code>GradientBoosting</code> adds trees that fix the previous errors (boosting) — both standard in <code>scikit-learn</code>.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=600, n_features=10, n_informative=5,
                           random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

tree = DecisionTreeClassifier(random_state=0).fit(Xtr, ytr)
rf = RandomForestClassifier(n_estimators=200, random_state=0).fit(Xtr, ytr)
gb = GradientBoostingClassifier(random_state=0).fit(Xtr, ytr)

print("single tree   :", round(tree.score(Xte, yte), 3))
print("random forest :", round(rf.score(Xte, yte), 3))
print("boosting      :", round(gb.score(Xte, yte), 3))`
  },
  "ml-knn": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>k-nearest neighbors predicts from the closest known points — no training, just a lookup. <code>scikit-learn</code>'s <code>KNeighborsClassifier</code> is the standard; scaling features first matters because it uses distances.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=400, n_features=4, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

# scaling + kNN, since kNN relies on distances
for k in [1, 5, 15]:
    knn = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=k))
    knn.fit(Xtr, ytr)
    print("k=%2d  test accuracy: %.3f" % (k, knn.score(Xte, yte)))`
  },
  "ml-bias-variance": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Too simple underfits (high bias); too complex overfits (high variance). Sweeping polynomial degree in <code>scikit-learn</code> shows train error always dropping while test error dips then climbs.</p>`,
    code: `import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

rng = np.random.default_rng(0)
X = rng.uniform(-3, 3, size=(120, 1))
y = np.sin(X[:, 0]) + rng.normal(0, 0.3, size=120)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

for d in [1, 3, 9, 15]:
    model = make_pipeline(PolynomialFeatures(d), LinearRegression()).fit(Xtr, ytr)
    tr = mean_squared_error(ytr, model.predict(Xtr))
    te = mean_squared_error(yte, model.predict(Xte))
    print("degree %2d  train MSE %.3f  test MSE %.3f" % (d, tr, te))`
  },
  "ml-learning-theory": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Learning theory says more data closes the gap between training and test error. <code>scikit-learn</code>'s <code>learning_curve</code> makes this concrete by scoring a model at growing training-set sizes.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import learning_curve

X, y = make_classification(n_samples=800, n_features=8, n_informative=5,
                           random_state=0)

sizes, train_sc, val_sc = learning_curve(
    LogisticRegression(max_iter=500), X, y,
    train_sizes=[0.1, 0.3, 0.6, 1.0], cv=5, random_state=0)

for n, tr, va in zip(sizes, train_sc.mean(1), val_sc.mean(1)):
    print("train size %4d  train acc %.3f  val acc %.3f  gap %.3f"
          % (n, tr, va, tr - va))`
  },
  "ml-kmeans": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>k-means groups unlabeled points into k clusters around moving centers. <code>scikit-learn</code>'s <code>KMeans</code> is the standard; inertia (within-cluster squared distance) measures how tight the clusters are.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans

X, true_labels = make_blobs(n_samples=400, centers=3, cluster_std=0.8,
                            random_state=0)

km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print("cluster centers:")
print(np.round(km.cluster_centers_, 2))
print("inertia (tightness):", round(km.inertia_, 1))

# the elbow: inertia keeps dropping as k grows
for k in [1, 2, 3, 4]:
    km_k = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    print("k=%d  inertia=%.1f" % (k, km_k.inertia_))`
  },
  "ml-em": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Expectation-Maximization fits a <b>Gaussian mixture</b> for soft clustering: each point gets a probability of belonging to each group. <code>scikit-learn</code>'s <code>GaussianMixture</code> runs EM under the hood.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.mixture import GaussianMixture

X, _ = make_blobs(n_samples=400, centers=3, cluster_std=1.0, random_state=0)

gmm = GaussianMixture(n_components=3, random_state=0).fit(X)
print("converged:", gmm.converged_)
print("mixture weights:", np.round(gmm.weights_, 3))

# soft assignments: each row is P(component | point), sums to 1
probs = gmm.predict_proba(X[:3])
print("soft memberships of first 3 points:")
print(np.round(probs, 3))`
  },
  "ml-hierarchical": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Hierarchical clustering merges the closest groups repeatedly into a tree. <code>scikit-learn</code>'s <code>AgglomerativeClustering</code> performs this bottom-up merging with a chosen linkage.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import adjusted_rand_score

X, true_labels = make_blobs(n_samples=300, centers=3, cluster_std=0.7,
                            random_state=0)

for link in ["ward", "average", "complete"]:
    agg = AgglomerativeClustering(n_clusters=3, linkage=link)
    labels = agg.fit_predict(X)
    ari = adjusted_rand_score(true_labels, labels)
    print("linkage %-9s  ARI vs truth: %.3f" % (link, ari))`
  },
  "ml-pca": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>PCA finds the directions of most spread and keeps only those. <code>scikit-learn</code>'s <code>PCA</code> reports how much variance each component explains, so you know what you keep when you drop dimensions.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.decomposition import PCA

X, _ = make_classification(n_samples=400, n_features=8, n_informative=3,
                           random_state=0)

pca = PCA(n_components=8, random_state=0).fit(X)
ratio = pca.explained_variance_ratio_
print("variance explained per component:", np.round(ratio, 3))
print("cumulative:", np.round(np.cumsum(ratio), 3))

# project down to 2 dimensions
X2 = PCA(n_components=2, random_state=0).fit_transform(X)
print("reduced shape:", X2.shape)
print("kept variance with 2 comps:", round(float(np.cumsum(ratio)[1]), 3))`
  },
  "ml-ica": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>ICA unmixes blended signals back into independent sources — the cocktail-party problem. <code>scikit-learn</code>'s <code>FastICA</code> is the standard solver; here it recovers two source signals from their mixtures.</p>`,
    code: `import numpy as np
from sklearn.decomposition import FastICA

rng = np.random.default_rng(0)
t = np.linspace(0, 8, 600)
s1 = np.sin(2 * t)                       # source 1: sine
s2 = np.sign(np.sin(3 * t))             # source 2: square wave
S = np.c_[s1, s2]
S += 0.1 * rng.normal(size=S.shape)

# mix the sources together
A = np.array([[1.0, 0.7], [0.5, 1.0]])
X = S @ A.T

ica = FastICA(n_components=2, random_state=0)
S_hat = ica.fit_transform(X)            # recovered sources

# correlation of each recovered signal with a true source (up to sign/order)
corr = np.corrcoef(S_hat.T, S.T)[:2, 2:]
print("recovered-vs-true correlations:")
print(np.round(corr, 2))`
  },
  "ml-classification-metrics": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Beyond accuracy: the confusion matrix and precision / recall / F1 tell you <i>which</i> mistakes a classifier makes. <code>scikit-learn.metrics</code> computes them all.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report

X, y = make_classification(n_samples=500, n_features=6, weights=[0.7, 0.3],
                           random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

clf = LogisticRegression().fit(Xtr, ytr)
pred = clf.predict(Xte)

print("confusion matrix [[TN FP] [FN TP]]:")
print(confusion_matrix(yte, pred))
print(classification_report(yte, pred, digits=3))`
  },
  "ml-roc-auc": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>The ROC curve traces true-positive vs false-positive rate across every threshold; AUC summarizes it in one number. <code>scikit-learn.metrics</code> gives both from predicted probabilities.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_curve, roc_auc_score

X, y = make_classification(n_samples=500, n_features=6, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

clf = LogisticRegression().fit(Xtr, ytr)
scores = clf.predict_proba(Xte)[:, 1]          # probability of class 1

auc = roc_auc_score(yte, scores)
print("AUC:", round(auc, 4))                   # 0.5 = random, 1.0 = perfect

fpr, tpr, thresh = roc_curve(yte, scores)
for i in [0, len(fpr) // 2, len(fpr) - 1]:
    print("FPR %.2f  TPR %.2f  threshold %.2f" % (fpr[i], tpr[i], thresh[i]))`
  },
  "ml-regression-metrics": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>How good is the fit? <b>RMSE</b> reports error in the target's units; <b>R&sup2;</b> compares the model against just predicting the mean. <code>scikit-learn.metrics</code> computes both.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

X, y = make_regression(n_samples=400, n_features=5, noise=15.0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

model = LinearRegression().fit(Xtr, ytr)
pred = model.predict(Xte)

rmse = np.sqrt(mean_squared_error(yte, pred))
print("RMSE:", round(rmse, 3), "(same units as y)")
print("R^2 :", round(r2_score(yte, pred), 4))

# baseline: always predict the mean -> R^2 = 0
baseline = np.full_like(yte, ytr.mean())
print("baseline R^2:", round(r2_score(yte, baseline), 4))`
  },
  "ml-regularization": {
    lib: "scikit-learn",
    runnable: true,
    packages: ["numpy", "scikit-learn"],
    explain: `<p>Regularization penalizes big weights to fight overfitting; cross-validation tunes how strong that penalty is. <code>scikit-learn</code>'s <code>RidgeCV</code> picks the best penalty by k-fold CV automatically.</p>`,
    code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression, RidgeCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# few samples, many features -> plain least squares overfits
X, y = make_regression(n_samples=60, n_features=40, noise=10.0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4, random_state=0)

ols = LinearRegression().fit(Xtr, ytr)
ridge = RidgeCV(alphas=np.logspace(-2, 3, 20)).fit(Xtr, ytr)

print("OLS    test R^2:", round(r2_score(yte, ols.predict(Xte)), 3))
print("Ridge  test R^2:", round(r2_score(yte, ridge.predict(Xte)), 3))
print("chosen penalty alpha:", round(ridge.alpha_, 3))
print("OLS    weight norm:", round(float(np.linalg.norm(ols.coef_)), 2))
print("Ridge  weight norm:", round(float(np.linalg.norm(ridge.coef_)), 2))`
  }
});
