/* =====================================================================
   REAL-WORLD WALKTHROUGHS — MODULE 2 (MACHINE LEARNING), second half.
   Lessons 15-27: ensembles, knn, bias-variance, learning-theory, kmeans,
   em, hierarchical, pca, ica, classification-metrics, roc-auc,
   regression-metrics, regularization.
   3 walkthroughs each, distinct domains. Code actually run with python3;
   outputs pasted verbatim.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ---------------- 15. ml-ensembles ---------------- */
  "ml-ensembles": [
    {
      title: `One tree vs a whole forest`,
      domain: `Fraud detection`,
      question: `A bank flags risky card transactions. Does a 200-tree random forest beat a single decision tree on rare fraud?`,
      steps: [
        { title: `The data`, body: `<p>We make 2000 transactions with 12 features, only $5\\%$ marked fraud (the rare class). Each row is one transaction; the label is fraud (1) or clean (0).</p>` },
        { title: `The math`, body: `<p>One tree has high variance: its answer swings with the training sample. Bagging averages $T$ trees, each grown on a random resample, so the forest variance is roughly $\\sigma^2 / T$ — many independent mistakes cancel.</p>` },
        { title: `Run it`, body: `<p>Fit one tree and a 200-tree forest, then compare hold-out accuracy.</p>`,
          code: `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=2000, n_features=12, n_informative=6,
                           weights=[0.95,0.05], random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
tree = DecisionTreeClassifier(random_state=0).fit(Xtr, ytr)
rf = RandomForestClassifier(n_estimators=200, random_state=0).fit(Xtr, ytr)
print("single tree accuracy :", round(tree.score(Xte, yte), 3))
print("random forest accuracy:", round(rf.score(Xte, yte), 3))`,
          output: `single tree accuracy : 0.937
random forest accuracy: 0.967` }
      ],
      conclusion: `The forest scores $0.967$ versus the lone tree's $0.937$. Averaging many trees cancels noise, so the crowd catches fraud the single tree misses.`
    },
    {
      title: `Boosting fixes its own mistakes`,
      domain: `Customer churn`,
      question: `A telecom predicts who will cancel. How does gradient boosting compare to one tree on the same data?`,
      steps: [
        { title: `The data`, body: `<p>Same 2000 customers, 12 features, with the cancel/stay label. Boosting builds trees in sequence; each new tree targets the rows the earlier trees got wrong.</p>` },
        { title: `The math`, body: `<p>Boosting's prediction is a weighted sum $\\hat{y} = \\sum_{t=1}^{T} \\alpha_t\\, h_t(x)$. Each tree $h_t$ is small and weak, but the weighted sum becomes strong because later trees patch the residual errors of earlier ones.</p>` },
        { title: `Run it`, body: `<p>Fit a 200-stage gradient-boosting classifier.</p>`,
          code: `import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=2000, n_features=12, n_informative=6,
                           weights=[0.95,0.05], random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
gb = GradientBoostingClassifier(n_estimators=200, random_state=0).fit(Xtr, ytr)
print("gradient boosting acc :", round(gb.score(Xte, yte), 3))`,
          output: `gradient boosting acc : 0.958` }
      ],
      conclusion: `Gradient boosting reaches $0.958$, well above the single tree's $0.937$. Sequentially correcting mistakes turns weak trees into a strong churn predictor.`
    },
    {
      title: `Why averaging shrinks the wobble`,
      domain: `Search ranking`,
      question: `A search team averages many noisy relevance estimates. By how much does averaging 50 of them cut the variance?`,
      steps: [
        { title: `The data`, body: `<p>Imagine 50 trees, each producing a noisy relevance score for 10000 query-document pairs. Each tree's noise has variance about $1$.</p>` },
        { title: `The math`, body: `<p>For $T$ independent estimates the average has variance $\\sigma^2 / T$. With $\\sigma^2 \\approx 1$ and $T = 50$, the bagged variance should drop to about $1/50 = 0.02$.</p>` },
        { title: `Run it`, body: `<p>Generate the noise, average across the 50 trees, and measure the variance before and after.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
single = rng.normal(0, 1.0, size=(50, 10000))   # 50 trees, each noisy estimate
print("single-tree variance :", round(single[0].var(), 3))
ens = single.mean(axis=0)
print("50-tree avg variance :", round(ens.var(), 4))`,
          output: `single-tree variance : 0.996
50-tree avg variance : 0.02` }
      ],
      conclusion: `Variance falls from $0.996$ to $0.02$, almost exactly the predicted $\\sigma^2/T = 1/50$. That $50\\times$ steadiness is why bagged rankers are far more stable than one tree.`
    }
  ],

  /* ---------------- 16. ml-knn ---------------- */
  "ml-knn": [
    {
      title: `Users like you also liked...`,
      domain: `Recommendations`,
      question: `Given six products and how four users rated each, which two products are most similar to "Sci-fi A"?`,
      steps: [
        { title: `The data`, body: `<p>Each product is a row of four user ratings (0-5). Similar products get similar ratings, so they sit close together in this 4-dimensional space.</p>` },
        { title: `The math`, body: `<p>"Closest" means smallest Euclidean distance $\\lVert x - x^{(i)}\\rVert$ between two rating rows. The nearest neighbors of a product are the best "people who liked this also liked" candidates.</p>` },
        { title: `Run it`, body: `<p>Fit a nearest-neighbor index and ask for the 2 closest products to Sci-fi A (excluding itself).</p>`,
          code: `import numpy as np
from sklearn.neighbors import NearestNeighbors
items = ["Sci-fi A","Sci-fi B","Sci-fi C","Romance A","Cookbook","Travel"]
R = np.array([
 [5,5,4,1,0,1],   # Sci-fi A
 [4,5,5,1,1,1],   # Sci-fi B
 [5,4,5,2,0,1],   # Sci-fi C
 [1,1,2,5,1,1],   # Romance A
 [0,1,0,1,5,4],   # Cookbook
 [1,1,1,1,4,5],   # Travel
], dtype=float)
nn = NearestNeighbors(n_neighbors=3, metric="euclidean").fit(R)
dist, idx = nn.kneighbors(R[0:1])
neigh = [items[i] for i in idx[0] if items[i] != items[0]][:2]
print("query item:", items[0])
print("top-2 similar:", neigh)`,
          output: `query item: Sci-fi A
top-2 similar: ['Sci-fi B', 'Sci-fi C']` }
      ],
      conclusion: `The two nearest neighbors are Sci-fi B and Sci-fi C. k-NN recommends exactly the products whose rating patterns sit closest to the one the user already liked.`
    },
    {
      title: `Recognize a digit by its neighbors`,
      domain: `Image search`,
      question: `Classify $8\\times 8$ handwritten-digit images by voting among the 3 most similar stored images. How accurate is it?`,
      steps: [
        { title: `The data`, body: `<p>The digits dataset has 1797 images, each flattened to 64 pixel values. The label is the digit 0-9. Similar pixel patterns usually mean the same digit.</p>` },
        { title: `The math`, body: `<p>For a test image, find the $k=3$ training images with smallest pixel-distance, then take their majority class. No training happens; the data <i>is</i> the model.</p>` },
        { title: `Run it`, body: `<p>Split into train/test and score a 3-NN classifier.</p>`,
          code: `from sklearn.datasets import load_digits
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
d = load_digits()
Xtr, Xte, ytr, yte = train_test_split(d.data, d.target, test_size=0.3, random_state=0)
clf = KNeighborsClassifier(n_neighbors=3).fit(Xtr, ytr)
print("3-NN digit accuracy:", round(clf.score(Xte, yte), 3))`,
          output: `3-NN digit accuracy: 0.987` }
      ],
      conclusion: `Plain 3-NN reaches $98.7\\%$ accuracy on handwritten digits. "Similar images share a label" is a surprisingly strong rule for image search.`
    },
    {
      title: `Does k change the answer?`,
      domain: `Quick baseline`,
      question: `Classifying a 115 g fruit as apple or orange, does using 1, 3, or 5 neighbors change the prediction?`,
      steps: [
        { title: `The data`, body: `<p>Five labeled fruits by weight: apples at 100, 110, 120 g and oranges at 150, 160 g. We query a new 115 g fruit.</p>` },
        { title: `The math`, body: `<p>Distances are just $\\lvert 115 - w \\rvert$. The three closest weights (110, 120, 100) are all apples, so apples dominate whether $k$ is 1, 3, or 5.</p>` },
        { title: `Run it`, body: `<p>Sweep $k$ and print the predicted label each time.</p>`,
          code: `import numpy as np
from sklearn.neighbors import KNeighborsClassifier
weights = np.array([100,110,120,150,160]).reshape(-1,1)
labels = np.array(["apple","apple","apple","orange","orange"])
for k in [1,3,5]:
    c = KNeighborsClassifier(n_neighbors=k).fit(weights, labels)
    print("k =", k, "-> 115g predicted:", c.predict([[115]])[0])`,
          output: `k = 1 -> 115g predicted: apple
k = 3 -> 115g predicted: apple
k = 5 -> 115g predicted: apple` }
      ],
      conclusion: `All three settings predict apple, because 115 g sits firmly inside the apple cluster. When the query is clearly in one region, the exact $k$ rarely matters.`
    }
  ],

  /* ---------------- 17. ml-bias-variance ---------------- */
  "ml-bias-variance": [
    {
      title: `Too simple, just right, too wiggly`,
      domain: `Model tuning`,
      question: `Fitting a price curve, how do polynomial degrees 1, 4, and 15 compare on training versus test error?`,
      steps: [
        { title: `The data`, body: `<p>60 points from a smooth curve $0.6 + 0.9\\sin(1.1x)$ plus noise. We split 60/40 into train and test, then fit polynomials of rising degree.</p>` },
        { title: `The math`, body: `<p>Test error $\\approx$ bias$^2$ + variance + noise. Low degree underfits (high bias); high degree overfits (high variance). The sweet spot minimizes the test error, not the training error.</p>` },
        { title: `Run it`, body: `<p>Fit degrees 1, 4, 15 and report train and test MSE.</p>`,
          code: `import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
rng = np.random.default_rng(0)
X = np.sort(rng.uniform(-3, 3, 60)).reshape(-1, 1)
y = (0.6 + 0.9*np.sin(1.1*X.ravel())) + rng.normal(0, 0.4, 60)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4, random_state=0)
for deg in [1, 4, 15]:
    m = make_pipeline(PolynomialFeatures(deg), LinearRegression()).fit(Xtr, ytr)
    tr = np.mean((m.predict(Xtr)-ytr)**2)
    te = np.mean((m.predict(Xte)-yte)**2)
    print(f"degree {deg:2d}: train MSE {tr:.3f}  test MSE {te:.3f}")`,
          output: `degree  1: train MSE 0.323  test MSE 0.348
degree  4: train MSE 0.177  test MSE 0.183
degree 15: train MSE 0.106  test MSE 887.583` }
      ],
      conclusion: `Degree 4 wins with test MSE $0.183$. Degree 1 underfits ($0.348$); degree 15 has the lowest training error but its test MSE explodes to $887$ — textbook overfitting.`
    },
    {
      title: `Deeper trees memorize`,
      domain: `Digit recognition`,
      question: `As a decision tree on digits grows from depth 2 to 20, what happens to the train-test accuracy gap?`,
      steps: [
        { title: `The data`, body: `<p>The 1797 digit images, split 60/40. We grow trees of depth 2, 6, and 20 and track both training and test accuracy.</p>` },
        { title: `The math`, body: `<p>A shallow tree is biased: too coarse to separate the classes. A deep tree drives training error to zero but its variance balloons, so the gap between train and test accuracy widens.</p>` },
        { title: `Run it`, body: `<p>Fit three depths and print both accuracies.</p>`,
          code: `from sklearn.datasets import load_digits
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
d = load_digits()
Xtr, Xte, ytr, yte = train_test_split(d.data, d.target, test_size=0.4, random_state=0)
for depth in [2, 6, 20]:
    t = DecisionTreeClassifier(max_depth=depth, random_state=0).fit(Xtr, ytr)
    print(f"depth {depth:2d}: train acc {t.score(Xtr,ytr):.3f}  test acc {t.score(Xte,yte):.3f}")`,
          output: `depth  2: train acc 0.319  test acc 0.273
depth  6: train acc 0.819  test acc 0.737
depth 20: train acc 1.000  test acc 0.828` }
      ],
      conclusion: `Depth 2 underfits ($0.27$ test). Depth 20 hits perfect $1.000$ training but only $0.828$ test — a wide gap signalling memorization. Watching that gap tells you which way to tune.`
    },
    {
      title: `Small k overfits, large k underfits`,
      domain: `Sensor classification`,
      question: `On a noisy two-class sensor problem, how does k-NN with k = 1, 15, 100 trade off training and test accuracy?`,
      steps: [
        { title: `The data`, body: `<p>400 points in the two-moons shape with heavy noise, split 60/40. We classify with $k = 1$, $15$, and $100$ neighbors.</p>` },
        { title: `The math`, body: `<p>$k=1$ fits each point exactly (variance high, perfect training fit). Large $k$ averages over many neighbors (bias high, smoother boundary). The best test accuracy sits in between.</p>` },
        { title: `Run it`, body: `<p>Sweep $k$ and report train/test accuracy.</p>`,
          code: `from sklearn.datasets import make_moons
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
Xm, ym = make_moons(n_samples=400, noise=0.3, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(Xm, ym, test_size=0.4, random_state=0)
for k in [1, 15, 100]:
    c = KNeighborsClassifier(n_neighbors=k).fit(Xtr, ytr)
    print(f"k {k:3d}: train acc {c.score(Xtr,ytr):.3f}  test acc {c.score(Xte,yte):.3f}")`,
          output: `k   1: train acc 1.000  test acc 0.875
k  15: train acc 0.883  test acc 0.906
k 100: train acc 0.854  test acc 0.900` }
      ],
      conclusion: `$k=1$ memorizes (training $1.000$, test $0.875$); $k=15$ gives the best test accuracy $0.906$. The number of neighbors is a direct bias-variance dial.`
    }
  ],

  /* ---------------- 18. ml-learning-theory ---------------- */
  "ml-learning-theory": [
    {
      title: `More data closes the gap`,
      domain: `Handwriting recognition`,
      question: `As the training set grows from 20 to 1000 digits, how does the gap between test error and training error shrink?`,
      steps: [
        { title: `The data`, body: `<p>Digit images split into a training pool and a fixed test set. We train the same depth-8 tree on the first 20, 80, 320, and 1000 examples.</p>` },
        { title: `The math`, body: `<p>The generalization gap (true error minus training error) shrinks roughly like $1/\\sqrt{m}$. With tiny $m$, zero training error means little; with large $m$, training error tracks true error.</p>` },
        { title: `Run it`, body: `<p>Grow $m$ and print training error, test error, and their gap.</p>`,
          code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
d = load_digits()
Xpool, Xte, ypool, yte = train_test_split(d.data, d.target, test_size=0.3, random_state=0)
for m in [20, 80, 320, 1000]:
    mm = min(m, len(Xpool))
    clf = DecisionTreeClassifier(max_depth=8, random_state=0).fit(Xpool[:mm], ypool[:mm])
    tr = 1 - clf.score(Xpool[:mm], ypool[:mm])
    te = 1 - clf.score(Xte, yte)
    print(f"m {mm:4d}: train err {tr:.3f}  test err {te:.3f}  gap {te-tr:.3f}")`,
          output: `m   20: train err 0.000  test err 0.759  gap 0.759
m   80: train err 0.000  test err 0.480  gap 0.480
m  320: train err 0.016  test err 0.274  gap 0.258
m 1000: train err 0.056  test err 0.181  gap 0.125` }
      ],
      conclusion: `The gap collapses from $0.759$ at $m=20$ to $0.125$ at $m=1000$. With only 20 examples, $0\\%$ training error is meaningless; more data makes training error a trustworthy estimate of the truth.`
    },
    {
      title: `Simple class beats complex class on little data`,
      domain: `Spam filtering`,
      question: `With just 60 labeled emails, does a simple linear model or an unbounded tree generalize better?`,
      steps: [
        { title: `The data`, body: `<p>2000 emails with 40 features; we train on only 60 and test on the rest. One model is linear (low VC dimension), the other a deep tree (high VC dimension).</p>` },
        { title: `The math`, body: `<p>Both can drive training error to zero. A complex class (high VC dimension) needs far more data to make training error reflect true error, so on little data the simpler class wins.</p>` },
        { title: `Run it`, body: `<p>Train both on 60 examples and compare hold-out accuracy.</p>`,
          code: `from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=2000, n_features=40, n_informative=8, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, train_size=60, random_state=0)
lin = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
big = DecisionTreeClassifier(random_state=0).fit(Xtr, ytr)  # unbounded -> high VC
print(f"linear (simple) : train {lin.score(Xtr,ytr):.3f}  test {lin.score(Xte,yte):.3f}")
print(f"deep tree (complex): train {big.score(Xtr,ytr):.3f}  test {big.score(Xte,yte):.3f}")`,
          output: `linear (simple) : train 1.000  test 0.847
deep tree (complex): train 1.000  test 0.796` }
      ],
      conclusion: `Both memorize the 60 training emails ($1.000$), but the simple linear model generalizes to $0.847$ while the complex tree only reaches $0.796$. With scarce data, the lower-VC class is the safer bet.`
    },
    {
      title: `The 1/sqrt(m) rule of thumb`,
      domain: `A/B test sizing`,
      question: `How many samples do you need to halve the generalization bound?`,
      steps: [
        { title: `The data`, body: `<p>No dataset needed — just the bound itself. The generalization gap scales like $1/\\sqrt{m}$, so we tabulate it for $m = 25, 100, 400, 1600$.</p>` },
        { title: `The math`, body: `<p>To cut $1/\\sqrt{m}$ in half you must <i>quadruple</i> $m$, because $1/\\sqrt{4m} = \\tfrac12 \\cdot 1/\\sqrt{m}$. Diminishing returns are baked in.</p>` },
        { title: `Run it`, body: `<p>Print the bound at four sample sizes.</p>`,
          code: `import numpy as np
for m in [25, 100, 400, 1600]:
    print(f"m {m:4d}: bound 1/sqrt(m) = {1/np.sqrt(m):.4f}")`,
          output: `m   25: bound 1/sqrt(m) = 0.2000
m  100: bound 1/sqrt(m) = 0.1000
m  400: bound 1/sqrt(m) = 0.0500
m 1600: bound 1/sqrt(m) = 0.0250` }
      ],
      conclusion: `Each $4\\times$ jump in $m$ halves the bound: $0.20 \\to 0.10 \\to 0.05 \\to 0.025$. That is why doubling test traffic barely helps once you already have a lot of data.`
    }
  ],

  /* ---------------- 19. ml-kmeans ---------------- */
  "ml-kmeans": [
    {
      title: `Find three customer groups`,
      domain: `Customer segmentation`,
      question: `Given 300 unlabeled customers, can k-means recover three natural segments and their centers?`,
      steps: [
        { title: `The data`, body: `<p>300 points drawn from 3 blobs in a 2-D feature space (say spend and frequency). There are no labels — k-means must find the structure itself.</p>` },
        { title: `The math`, body: `<p>k-means alternates two steps: assign each point to its nearest centroid, then move each centroid to the mean of its points. It minimizes the distortion $\\sum_i \\lVert x^{(i)} - \\mu_{c^{(i)}}\\rVert^2$.</p>` },
        { title: `Run it`, body: `<p>Fit $k=3$ and print the centroids and final distortion.</p>`,
          code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
X, ytrue = make_blobs(n_samples=300, centers=3, cluster_std=1.0, random_state=0)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print("centroids (rounded):")
print(np.round(km.cluster_centers_, 2))
print("inertia (distortion):", round(km.inertia_, 1))`,
          output: `centroids (rounded):
[[-1.78  2.79]
 [ 0.87  4.44]
 [ 1.87  0.76]]
inertia (distortion): 536.4` }
      ],
      conclusion: `k-means recovers three centroids and reports a distortion of $536.4$. Each centroid is the profile of a segment, found with no labels at all.`
    },
    {
      title: `Squeeze an image to four colors`,
      domain: `Image compression`,
      question: `Can k-means reduce many pixel colors to a 4-color palette?`,
      steps: [
        { title: `The data`, body: `<p>1000 random RGB pixels, each a point in 3-D color space. We want a small palette that represents them all.</p>` },
        { title: `The math`, body: `<p>Cluster the pixels into $K=4$ groups; each centroid is the average color of its group. Replacing every pixel by its centroid is exactly color quantization.</p>` },
        { title: `Run it`, body: `<p>Fit $k=4$ on the pixel colors and print the palette.</p>`,
          code: `import numpy as np
from sklearn.cluster import KMeans
rng = np.random.default_rng(0)
pixels = rng.integers(0, 256, size=(1000, 3)).astype(float)
km2 = KMeans(n_clusters=4, n_init=10, random_state=0).fit(pixels)
print("4 palette colors (RGB):")
print(np.round(km2.cluster_centers_).astype(int))`,
          output: `4 palette colors (RGB):
[[195  69  94]
 [149 187 199]
 [114 193  59]
 [ 60  72 154]]` }
      ],
      conclusion: `The 1000 colors collapse to four representative RGB centroids. Storing four palette entries plus a 2-bit index per pixel is the heart of color image compression.`
    },
    {
      title: `How many clusters? Use the elbow`,
      domain: `Choosing k`,
      question: `For data with three true groups, where does the distortion curve bend as k increases?`,
      steps: [
        { title: `The data`, body: `<p>The same 300-point, 3-blob dataset. We sweep $k$ from 1 to 5 and record the distortion (inertia) at each.</p>` },
        { title: `The math`, body: `<p>Distortion always drops as $k$ rises, but the drop shrinks once $k$ passes the true number of groups. The "elbow" — where the curve flattens — marks the right $k$.</p>` },
        { title: `Run it`, body: `<p>Fit $k=1\\ldots 5$ and print each distortion.</p>`,
          code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=300, centers=3, cluster_std=1.0, random_state=0)
for k in range(1, 6):
    km3 = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    print(f"k = {k}: distortion = {km3.inertia_:.1f}")`,
          output: `k = 1: distortion = 1924.5
k = 2: distortion = 1010.1
k = 3: distortion = 536.4
k = 4: distortion = 448.6
k = 5: distortion = 372.2` }
      ],
      conclusion: `Distortion plunges $1924 \\to 1010 \\to 536$ then only crawls ($448, 372$). The big bend at $k=3$ is the elbow, correctly recovering the three true groups.`
    }
  ],

  /* ---------------- 20. ml-em ---------------- */
  "ml-em": [
    {
      title: `A customer who belongs to both`,
      domain: `Overlapping segments`,
      question: `When two customer groups overlap, what fractional membership does EM assign to a point between them?`,
      steps: [
        { title: `The data`, body: `<p>300 points from two Gaussian blobs centered near $(0,0)$ and $(3,3)$ with wide spread, so they overlap. We ask about the borderline point $(1.5, 1.5)$.</p>` },
        { title: `The math`, body: `<p>A Gaussian mixture gives soft memberships. The E-step computes each point's responsibility $P(z=k \\mid x)$ for every cluster; these sum to 1. A point on the border splits between clusters.</p>` },
        { title: `Run it`, body: `<p>Fit a 2-component mixture and print the membership of $(1.5,1.5)$.</p>`,
          code: `import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=300, centers=[[0,0],[3,3]], cluster_std=1.5, random_state=0)
gm = GaussianMixture(n_components=2, random_state=0).fit(X)
probs = gm.predict_proba(np.array([[1.5, 1.5]]))
print("point (1.5,1.5) membership:", np.round(probs[0], 3))
print("means:", np.round(gm.means_, 2).tolist())`,
          output: `point (1.5,1.5) membership: [0.566 0.434]
means: [[2.98, 2.72], [-0.13, 0.29]]` }
      ],
      conclusion: `The border point is $56.6\\%$ in one group and $43.4\\%$ in the other. Unlike hard k-means, EM admits that overlapping customers partly belong to several segments.`
    },
    {
      title: `Two speakers, one recording`,
      domain: `Voice modeling`,
      question: `Given a pile of mixed voice measurements, can EM recover the two speakers' weights and centers?`,
      steps: [
        { title: `The data`, body: `<p>200 samples from a quiet speaker (mean $-2$) and 100 from a louder one (mean $+2$), pooled with no labels. We want each speaker's share and average.</p>` },
        { title: `The math`, body: `<p>EM iterates: estimate which speaker each sample came from (E-step), then re-estimate each speaker's mixture weight $\\phi_k$ and mean (M-step), repeating until stable.</p>` },
        { title: `Run it`, body: `<p>Fit a 2-component mixture and print the recovered weights and means.</p>`,
          code: `import numpy as np
from sklearn.mixture import GaussianMixture
rng = np.random.default_rng(0)
a = rng.normal(-2, 0.8, 200)
b = rng.normal(2, 1.2, 100)
data = np.concatenate([a, b]).reshape(-1, 1)
gm2 = GaussianMixture(n_components=2, random_state=0).fit(data)
print("mixture weights:", np.round(np.sort(gm2.weights_), 3))
print("component means:", np.round(np.sort(gm2.means_.ravel()), 2))`,
          output: `mixture weights: [0.342 0.658]
component means: [-2.    1.76]` }
      ],
      conclusion: `EM recovers weights $0.342$ and $0.658$ (close to the true $100{:}200$ split) and means near $-2$ and $+2$. It untangled the two speakers from one unlabeled pile.`
    },
    {
      title: `How many groups? Let BIC decide`,
      domain: `Model selection`,
      question: `For data with three tight clusters, which number of mixture components does BIC prefer?`,
      steps: [
        { title: `The data`, body: `<p>400 points from 3 well-separated blobs. We fit mixtures with $k = 1\\ldots 5$ components and compare them with the BIC score.</p>` },
        { title: `The math`, body: `<p>BIC $= -2\\log L + p\\log m$ rewards fit (high log-likelihood $\\log L$) but penalizes extra parameters $p$. The lowest BIC picks the simplest mixture that explains the data.</p>` },
        { title: `Run it`, body: `<p>Fit each $k$ and print its BIC.</p>`,
          code: `import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs
X3, _ = make_blobs(n_samples=400, centers=3, cluster_std=0.7, random_state=0)
for k in range(1, 6):
    g = GaussianMixture(n_components=k, random_state=0).fit(X3)
    print(f"k = {k}: BIC = {g.bic(X3):.1f}")`,
          output: `k = 1: BIC = 3027.1
k = 2: BIC = 2710.7
k = 3: BIC = 2637.6
k = 4: BIC = 2668.9
k = 5: BIC = 2698.7` }
      ],
      conclusion: `BIC bottoms out at $k=3$ ($2637.6$), then rises again. EM plus BIC recovers the correct number of hidden groups automatically.`
    }
  ],

  /* ---------------- 21. ml-hierarchical ---------------- */
  "ml-hierarchical": [
    {
      title: `Build a gene merge tree`,
      domain: `Genomics`,
      question: `Given five genes' expression profiles, in what order do they merge, and which pairs are closest?`,
      steps: [
        { title: `The data`, body: `<p>Five genes, each a row of expression across four conditions. G1/G2 are near-identical, G3/G4 are near-identical, and G5 sits in the middle.</p>` },
        { title: `The math`, body: `<p>Agglomerative clustering starts with each gene alone, then repeatedly merges the two closest clusters (here by average linkage on Euclidean distance). The record of merges is the dendrogram.</p>` },
        { title: `Run it`, body: `<p>Compute the linkage matrix; each row is (cluster A, cluster B, merge distance, size).</p>`,
          code: `import numpy as np
from scipy.cluster.hierarchy import linkage, fcluster
genes = ["G1","G2","G3","G4","G5"]
E = np.array([
 [1.0, 1.1, 0.9, 1.0],   # G1
 [1.1, 1.0, 1.0, 0.9],   # G2  (close to G1)
 [5.0, 5.1, 4.9, 5.0],   # G3
 [5.1, 4.9, 5.0, 5.1],   # G4  (close to G3)
 [3.0, 3.1, 2.9, 3.0],   # G5  (middle)
])
Z = linkage(E, method="average", metric="euclidean")
print("merge steps (idxA, idxB, dist, size):")
print(np.round(Z, 3))
labels = fcluster(Z, t=2, criterion="maxclust")
print("cut into 2 clusters:", dict(zip(genes, labels.tolist())))`,
          output: `merge steps (idxA, idxB, dist, size):
[[0.    1.    0.2   2.   ]
 [2.    3.    0.265 2.   ]
 [4.    5.    4.002 3.   ]
 [6.    7.    6.695 5.   ]]
cut into 2 clusters: {'G1': 2, 'G2': 2, 'G3': 1, 'G4': 1, 'G5': 2}` }
      ],
      conclusion: `G1+G2 merge first (distance $0.2$), then G3+G4 ($0.265$); the larger distances come later. Cutting at 2 clusters splits the genes into the low-expression and high-expression families.`
    },
    {
      title: `Cut the same tree into three groups`,
      domain: `Document organization`,
      question: `Using the very same merge tree, what happens when you ask for three clusters instead of two?`,
      steps: [
        { title: `The data`, body: `<p>The same five profiles (think of them as document topic vectors). The dendrogram is already built; we just choose a different cut height.</p>` },
        { title: `The math`, body: `<p>A dendrogram encodes clusters at <i>every</i> level. Cutting lower (more clusters) separates the middle item G5 from the two tight pairs.</p>` },
        { title: `Run it`, body: `<p>Cut the same linkage at 3 clusters.</p>`,
          code: `import numpy as np
from scipy.cluster.hierarchy import linkage, fcluster
genes = ["G1","G2","G3","G4","G5"]
E = np.array([
 [1.0, 1.1, 0.9, 1.0],
 [1.1, 1.0, 1.0, 0.9],
 [5.0, 5.1, 4.9, 5.0],
 [5.1, 4.9, 5.0, 5.1],
 [3.0, 3.1, 2.9, 3.0],
])
Z = linkage(E, method="average", metric="euclidean")
labels3 = fcluster(Z, t=3, criterion="maxclust")
print("cut into 3 clusters:", dict(zip(genes, labels3.tolist())))`,
          output: `cut into 3 clusters: {'G1': 2, 'G2': 2, 'G3': 1, 'G4': 1, 'G5': 3}` }
      ],
      conclusion: `At three clusters the middle item G5 splits off into its own group, while the two tight pairs stay together. One tree gives you every granularity for free — just slide the cut.`
    },
    {
      title: `Does the tree match the real distances?`,
      domain: `Species taxonomy`,
      question: `How faithfully does the dendrogram preserve the original pairwise distances?`,
      steps: [
        { title: `The data`, body: `<p>The same five profiles. The cophenetic distance between two items is the height at which they first merge in the tree.</p>` },
        { title: `The math`, body: `<p>The cophenetic correlation compares tree-merge heights to the original distances. A value near 1 means the dendrogram faithfully represents the real geometry.</p>` },
        { title: `Run it`, body: `<p>Compute the cophenetic correlation against the raw pairwise distances.</p>`,
          code: `import numpy as np
from scipy.cluster.hierarchy import linkage, cophenet
from scipy.spatial.distance import pdist
E = np.array([
 [1.0, 1.1, 0.9, 1.0],
 [1.1, 1.0, 1.0, 0.9],
 [5.0, 5.1, 4.9, 5.0],
 [5.1, 4.9, 5.0, 5.1],
 [3.0, 3.1, 2.9, 3.0],
])
Z = linkage(E, method="average", metric="euclidean")
c, coph = cophenet(Z, pdist(E))
print("cophenetic correlation:", round(c, 3))`,
          output: `cophenetic correlation: 0.867` }
      ],
      conclusion: `The cophenetic correlation is $0.867$ — the tree preserves most of the real distance structure. That high score is why biologists trust dendrograms to summarize relationships.`
    }
  ],

  /* ---------------- 22. ml-pca ---------------- */
  "ml-pca": [
    {
      title: `How few dimensions keep the picture?`,
      domain: `Image compression`,
      question: `For 64-pixel digit images, how many principal components are needed to retain most of the variance?`,
      steps: [
        { title: `The data`, body: `<p>The digits dataset: 1797 images, each a 64-dimensional pixel vector. We want to know how much information survives if we keep only a few directions.</p>` },
        { title: `The math`, body: `<p>PCA finds orthogonal directions ranked by variance. The explained-variance ratio of the top $k$ components, $\\sum_{j=1}^{k}\\lambda_j / \\sum_j \\lambda_j$, says what fraction of spread they capture.</p>` },
        { title: `Run it`, body: `<p>Fit PCA and report cumulative variance kept at several $k$.</p>`,
          code: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.datasets import load_digits
d = load_digits()
pca = PCA(random_state=0).fit(d.data)
cum = np.cumsum(pca.explained_variance_ratio_)
for k in [2, 10, 20, 40]:
    print(f"{k:2d} components keep {cum[k-1]*100:.1f}% of variance")`,
          output: ` 2 components keep 28.5% of variance
10 components keep 73.8% of variance
20 components keep 89.4% of variance
40 components keep 98.8% of variance` }
      ],
      conclusion: `Just 20 of the 64 dimensions retain $89.4\\%$ of the variance, and 40 retain $98.8\\%$. PCA lets you throw away half the pixels with almost no information loss.`
    },
    {
      title: `Find the true axis under the noise`,
      domain: `Sensor denoising`,
      question: `When two sensors mostly track one underlying signal, can PCA find that single dominant direction?`,
      steps: [
        { title: `The data`, body: `<p>200 readings where sensor 2 is roughly half of sensor 1, plus small noise. The data spreads along one diagonal line in 2-D.</p>` },
        { title: `The math`, body: `<p>The first principal component is the unit direction of greatest variance. If the signal lives on one axis, that axis captures nearly all the variance and the rest is noise.</p>` },
        { title: `Run it`, body: `<p>Fit a 2-component PCA and print the variance ratios and top direction.</p>`,
          code: `import numpy as np
from sklearn.decomposition import PCA
rng = np.random.default_rng(0)
t = rng.normal(0, 3, 200)
X = np.c_[t, 0.5*t] + rng.normal(0, 0.3, (200, 2))
p2 = PCA(n_components=2, random_state=0).fit(X)
print("variance ratio:", np.round(p2.explained_variance_ratio_, 3))
print("1st component direction:", np.round(p2.components_[0], 3))`,
          output: `variance ratio: [0.991 0.009]
1st component direction: [0.887 0.461]` }
      ],
      conclusion: `The first component holds $99.1\\%$ of the variance, pointing along $[0.887, 0.461]$ — almost exactly the $1{:}0.5$ signal axis. The remaining $0.9\\%$ is noise you can safely drop.`
    },
    {
      title: `Squash 64 dimensions onto a page`,
      domain: `Visualization`,
      question: `Can PCA project 64-dimensional digit images into 2-D so we can plot them?`,
      steps: [
        { title: `The data`, body: `<p>The 1797 digit images again. Humans cannot see 64 dimensions, but we can see 2. We project onto the top two components.</p>` },
        { title: `The math`, body: `<p>Projecting onto the top two components gives each image $(z_1, z_2)$ coordinates that preserve as much spread as any 2-D view can — the best flat snapshot of high-dimensional data.</p>` },
        { title: `Run it`, body: `<p>Transform to 2-D and inspect the result shape and one point.</p>`,
          code: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.datasets import load_digits
d = load_digits()
Z = PCA(n_components=2, random_state=0).fit_transform(d.data)
print("projected shape:", Z.shape)
print("first point (2D):", np.round(Z[0], 2))`,
          output: `projected shape: (1797, 2)
first point (2D): [ -1.26 -21.27]` }
      ],
      conclusion: `Every 64-dimensional image becomes a 2-D point (shape $1797 \\times 2$); the first image lands at $(-1.26, -21.27)$. Now the whole dataset fits on a single scatter plot.`
    }
  ],

  /* ---------------- 23. ml-ica ---------------- */
  "ml-ica": [
    {
      title: `Unmix two voices at a party`,
      domain: `Audio separation`,
      question: `Two microphones each hear a blend of a tone and a square wave. Can ICA pull the two sources back apart?`,
      steps: [
        { title: `The data`, body: `<p>Two true sources — a sine tone and a square wave — get linearly mixed by a $2\\times 2$ mixing matrix (two mics hearing both). We only observe the two mixtures.</p>` },
        { title: `The math`, body: `<p>ICA assumes the sources are statistically independent and non-Gaussian. It finds an unmixing matrix $W$ so that $WX$ recovers signals that are maximally independent — the original sources up to scale and order.</p>` },
        { title: `Run it`, body: `<p>Mix the sources, run FastICA, and correlate each recovered channel with a true source.</p>`,
          code: `import numpy as np
from sklearn.decomposition import FastICA
rng = np.random.default_rng(0)
n = 2000
t = np.linspace(0, 8, n)
s1 = np.sin(2*t)                 # source 1: tone
s2 = np.sign(np.sin(3*t))        # source 2: square wave
S = np.c_[s1, s2]
S += 0.05 * rng.normal(size=S.shape)
A = np.array([[1.0, 0.7], [0.5, 1.0]])   # mixing matrix (two mics)
Xmix = S @ A.T
ica = FastICA(n_components=2, random_state=0)
Srec = ica.fit_transform(Xmix)
def best_corr(rec, true):
    return max(abs(np.corrcoef(rec, true[:,0])[0,1]),
               abs(np.corrcoef(rec, true[:,1])[0,1]))
print("recovered comp 1 corr with a true source:", round(best_corr(Srec[:,0], S), 3))
print("recovered comp 2 corr with a true source:", round(best_corr(Srec[:,1], S), 3))`,
          output: `recovered comp 1 corr with a true source: 1.0
recovered comp 2 corr with a true source: 0.998` }
      ],
      conclusion: `Each recovered channel matches a true source with correlation $1.0$ and $0.998$. ICA cleanly separated the tone from the square wave using only the blended recordings.`
    },
    {
      title: `Whitened independent components`,
      domain: `EEG artifact removal`,
      question: `How many independent components does ICA extract, and what scale are they on?`,
      steps: [
        { title: `The data`, body: `<p>The same two mixed signals (think two EEG electrodes capturing brain activity plus an eye-blink artifact). We inspect the components ICA returns.</p>` },
        { title: `The math`, body: `<p>ICA first whitens the data (zero mean, unit variance, uncorrelated), then rotates to maximize independence. The recovered components are unit-variance, so each artifact lands on its own channel.</p>` },
        { title: `Run it`, body: `<p>Report the number of components and each component's standard deviation.</p>`,
          code: `import numpy as np
from sklearn.decomposition import FastICA
rng = np.random.default_rng(0)
n = 2000
t = np.linspace(0, 8, n)
S = np.c_[np.sin(2*t), np.sign(np.sin(3*t))]
S += 0.05 * rng.normal(size=S.shape)
A = np.array([[1.0, 0.7], [0.5, 1.0]])
Srec = FastICA(n_components=2, random_state=0).fit_transform(S @ A.T)
print("number of independent components found:", Srec.shape[1])
print("each component std (whitened):", np.round(Srec.std(axis=0), 3))`,
          output: `number of independent components found: 2
each component std (whitened): [1. 1.]` }
      ],
      conclusion: `ICA returns 2 independent components, each with unit standard deviation. Separating an eye-blink artifact onto its own channel is exactly how ICA cleans EEG recordings.`
    },
    {
      title: `Three sources, three sensors`,
      domain: `Sensor unmixing`,
      question: `With three blended sources and a random mixing, how well does ICA recover each one?`,
      steps: [
        { title: `The data`, body: `<p>Three true sources — a tone, a square wave, and a sawtooth — mixed by a random $3\\times 3$ matrix across three sensors. We observe only the mixtures.</p>` },
        { title: `The math`, body: `<p>ICA scales to $K$ sources as long as at most one is Gaussian and the mixing is invertible. We measure each recovered channel's best correlation to a true source.</p>` },
        { title: `Run it`, body: `<p>Mix three sources, unmix with FastICA, and score each channel.</p>`,
          code: `import numpy as np
from sklearn.decomposition import FastICA
rng = np.random.default_rng(0)
n = 2000
t3 = np.linspace(0, 8, n)
S3 = np.c_[np.sin(2*t3), np.sign(np.sin(3*t3)), (t3 % 2) - 1]
A3 = rng.uniform(0.5, 1.5, (3,3))
X3 = S3 @ A3.T
rec3 = FastICA(n_components=3, random_state=0).fit_transform(X3)
corrs = [round(max(abs(np.corrcoef(rec3[:,i], S3[:,j])[0,1]) for j in range(3)), 3) for i in range(3)]
print("each recovered source's best corr to a true source:", corrs)`,
          output: `each recovered source's best corr to a true source: [0.997, 0.976, 0.647]` }
      ],
      conclusion: `Two sources come back almost perfectly ($0.997$, $0.976$); the sawtooth is harder ($0.647$). ICA scales to multiple sensors, with cleaner separation when the sources are strongly non-Gaussian.`
    }
  ],

  /* ---------------- 24. ml-classification-metrics ---------------- */
  "ml-classification-metrics": [
    {
      title: `Don't miss a sick patient`,
      domain: `Medical screening`,
      question: `A screening test labels 10 patients. With 1 missed case and 1 false alarm, what are its precision, recall, and F1?`,
      steps: [
        { title: `The data`, body: `<p>10 patients: 4 truly sick (label 1), 6 healthy (label 0). The model misses one sick patient and raises one false alarm on a healthy one.</p>` },
        { title: `The math`, body: `<p>From the confusion matrix: precision $= TP/(TP+FP)$ (of those flagged, how many were sick) and recall $= TP/(TP+FN)$ (of the sick, how many we caught). F1 is their harmonic mean.</p>` },
        { title: `Run it`, body: `<p>Compute the confusion matrix and the three scores.</p>`,
          code: `import numpy as np
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score
y_true = np.array([1,1,1,1,0,0,0,0,0,0])
y_pred = np.array([1,1,0,1,0,0,1,0,0,0])  # missed 1 sick, 1 false alarm
tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
print("TN,FP,FN,TP =", tn, fp, fn, tp)
print("precision =", round(precision_score(y_true, y_pred), 3))
print("recall    =", round(recall_score(y_true, y_pred), 3))
print("f1        =", round(f1_score(y_true, y_pred), 3))`,
          output: `TN,FP,FN,TP = 5 1 1 3
precision = 0.75
recall    = 0.75
f1        = 0.75` }
      ],
      conclusion: `Precision, recall, and F1 are all $0.75$. In screening, the missed sick patient (recall) is the costly error, so you would tune the threshold to push recall higher even at the price of more false alarms.`
    },
    {
      title: `Don't trash real mail`,
      domain: `Spam filtering`,
      question: `For a spam filter, how do precision and recall come out, and why does precision matter most here?`,
      steps: [
        { title: `The data`, body: `<p>1000 emails, $30\\%$ spam, split 70/30. We train logistic regression and evaluate on the hold-out set.</p>` },
        { title: `The math`, body: `<p>A false positive means a real email lands in the spam folder — very costly. So spam filters favor high precision (few false alarms) even if some spam slips through (lower recall).</p>` },
        { title: `Run it`, body: `<p>Train and report precision and recall on the test set.</p>`,
          code: `from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score
X, y = make_classification(n_samples=1000, weights=[0.7,0.3], random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
clf = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
yp = clf.predict(Xte)
print("precision =", round(precision_score(yte, yp), 3))
print("recall    =", round(recall_score(yte, yp), 3))`,
          output: `precision = 0.979
recall    = 0.929` }
      ],
      conclusion: `Precision is $0.979$ and recall $0.929$ — only $2\\%$ of flagged mail is wrongly marked spam. High precision is what keeps real messages out of the junk folder.`
    },
    {
      title: `Accuracy lies on rare events`,
      domain: `Fraud detection`,
      question: `Only 5 of 100 transactions are fraud. How accurate is a model that always says "no fraud," and is it useful?`,
      steps: [
        { title: `The data`, body: `<p>100 transactions, just 5 fraudulent. A lazy model predicts "clean" for every single one.</p>` },
        { title: `The math`, body: `<p>Accuracy $= (TP+TN)/N$ counts both classes equally. On imbalanced data it can be high while recall on the rare class is zero — accuracy alone hides total failure.</p>` },
        { title: `Run it`, body: `<p>Compute the always-negative accuracy and its fraud recall.</p>`,
          code: `import numpy as np
from sklearn.metrics import recall_score
y_true2 = np.array([0]*95 + [1]*5)
y_all0 = np.zeros(100, dtype=int)   # predict 'no fraud' always
acc = (y_true2 == y_all0).mean()
print("always-negative accuracy:", round(acc, 3))
print("but recall on fraud:", round(recall_score(y_true2, y_all0, zero_division=0), 3))`,
          output: `always-negative accuracy: 0.95
but recall on fraud: 0.0` }
      ],
      conclusion: `The do-nothing model scores $95\\%$ accuracy yet catches $0\\%$ of fraud. On rare events you must look at recall and precision, never accuracy alone.`
    }
  ],

  /* ---------------- 25. ml-roc-auc ---------------- */
  "ml-roc-auc": [
    {
      title: `Score a loan model without picking a cutoff`,
      domain: `Credit scoring`,
      question: `How good is a default-risk model at ranking risky borrowers above safe ones, across all thresholds?`,
      steps: [
        { title: `The data`, body: `<p>2000 applicants with 10 features and a default/no-default label, split 70/30. The model outputs a risk probability for each applicant.</p>` },
        { title: `The math`, body: `<p>AUC is the probability that a random positive is scored above a random negative. $0.5$ is random; $1.0$ is perfect. It summarizes the ROC curve into one threshold-free number.</p>` },
        { title: `Run it`, body: `<p>Train logistic regression and compute the AUC on the hold-out set.</p>`,
          code: `from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=2000, n_features=10, n_informative=6,
                           flip_y=0.1, class_sep=1.0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
clf = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
scores = clf.predict_proba(Xte)[:, 1]
print("AUC =", round(roc_auc_score(yte, scores), 3))`,
          output: `AUC = 0.912` }
      ],
      conclusion: `The model's AUC is $0.912$: given a random defaulter and a random safe borrower, it ranks the defaulter riskier $91\\%$ of the time — strong discrimination, no cutoff needed.`
    },
    {
      title: `Pick the better ranker`,
      domain: `Ad targeting`,
      question: `Two models score click likelihood. Which ranks clickers above non-clickers more reliably?`,
      steps: [
        { title: `The data`, body: `<p>The same 2000-row dataset. We compare logistic regression against a shallow depth-2 tree on AUC.</p>` },
        { title: `The math`, body: `<p>Because AUC ignores the threshold, it is the fair way to compare rankers when the eventual cutoff depends on business cost. Higher AUC means better ordering of clickers.</p>` },
        { title: `Run it`, body: `<p>Train both models and compare their AUCs.</p>`,
          code: `from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=2000, n_features=10, n_informative=6,
                           flip_y=0.1, class_sep=1.0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
clf = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
clf2 = DecisionTreeClassifier(max_depth=2, random_state=0).fit(Xtr, ytr)
scores = clf.predict_proba(Xte)[:, 1]
s2 = clf2.predict_proba(Xte)[:, 1]
print("logistic AUC     :", round(roc_auc_score(yte, scores), 3))
print("shallow tree AUC :", round(roc_auc_score(yte, s2), 3))`,
          output: `logistic AUC     : 0.912
shallow tree AUC : 0.821` }
      ],
      conclusion: `Logistic regression wins, $0.912$ versus $0.821$. AUC lets the ad team pick the better ranker before committing to any specific click-probability cutoff.`
    },
    {
      title: `Walk the catch-vs-false-alarm tradeoff`,
      domain: `Medical diagnostics`,
      question: `As the decision threshold moves, how do the catch rate and false-alarm rate trade off?`,
      steps: [
        { title: `The data`, body: `<p>The same trained model's probabilities on the test set. The ROC curve is exactly this tradeoff swept over every threshold.</p>` },
        { title: `The math`, body: `<p>At each threshold: recall (TPR) $= TP/(TP+FN)$ is the catch rate, false-alarm (FPR) $= FP/(FP+TN)$. Lowering the threshold catches more positives but raises false alarms.</p>` },
        { title: `Run it`, body: `<p>Evaluate three thresholds and print TPR and FPR at each.</p>`,
          code: `from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=2000, n_features=10, n_informative=6,
                           flip_y=0.1, class_sep=1.0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
clf = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
scores = clf.predict_proba(Xte)[:, 1]
for t in [0.3, 0.5, 0.7]:
    pred = (scores >= t).astype(int)
    tp = ((pred==1)&(yte==1)).sum(); fn = ((pred==0)&(yte==1)).sum()
    fp = ((pred==1)&(yte==0)).sum(); tn = ((pred==0)&(yte==0)).sum()
    tpr = tp/(tp+fn); fpr = fp/(fp+tn)
    print(f"threshold {t}: recall(TPR) = {tpr:.3f}, false-alarm(FPR) = {fpr:.3f}")`,
          output: `threshold 0.3: recall(TPR) = 0.921, false-alarm(FPR) = 0.271
threshold 0.5: recall(TPR) = 0.859, false-alarm(FPR) = 0.139
threshold 0.7: recall(TPR) = 0.710, false-alarm(FPR) = 0.087` }
      ],
      conclusion: `Dropping the threshold to $0.3$ raises catches to $92.1\\%$ but false alarms to $27.1\\%$; raising it to $0.7$ cuts false alarms to $8.7\\%$ at $71\\%$ catches. The ROC curve is this whole tradeoff, and AUC summarizes it.`
    }
  ],

  /* ---------------- 26. ml-regression-metrics ---------------- */
  "ml-regression-metrics": [
    {
      title: `How far off are the price predictions?`,
      domain: `House prices`,
      question: `A model predicts home prices from size. What R-squared does it reach, and what is the typical dollar error?`,
      steps: [
        { title: `The data`, body: `<p>200 homes: price (in $1000s) $= 50 + 0.15\\cdot\\text{size} + \\text{noise}$. We split 70/30 and fit a straight line.</p>` },
        { title: `The math`, body: `<p>RMSE $= \\sqrt{\\tfrac1n\\sum (y_i - \\hat{y}_i)^2}$ is the typical error in real units (dollars). $R^2 = 1 - SS_{res}/SS_{tot}$ is the fraction of variance the model explains.</p>` },
        { title: `Run it`, body: `<p>Fit and report $R^2$ and RMSE on the test set.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.model_selection import train_test_split
rng = np.random.default_rng(0)
size = rng.uniform(800, 2500, 200)
price = 50 + 0.15*size + rng.normal(0, 25, 200)   # in $1000s
X = size.reshape(-1,1)
Xtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.3, random_state=0)
m = LinearRegression().fit(Xtr, ytr)
pred = m.predict(Xte)
rmse = np.sqrt(mean_squared_error(yte, pred))
print("R2   =", round(r2_score(yte, pred), 3))
print("RMSE = $", round(rmse, 1), "k", sep="")`,
          output: `R2   = 0.893
RMSE = $27.2k` }
      ],
      conclusion: `The model explains $R^2 = 0.893$ of the price variance, with a typical miss of about $\\$27.2$k. RMSE speaks to stakeholders in dollars; $R^2$ says how much better than guessing the average it is.`
    },
    {
      title: `Beating the lazy average`,
      domain: `Demand forecasting`,
      question: `Does a demand model actually beat just predicting the average demand every day?`,
      steps: [
        { title: `The data`, body: `<p>150 days of demand (Poisson around 40) and one leading indicator feature. We compare the fitted model against the constant baseline "predict the mean."</p>` },
        { title: `The math`, body: `<p>$R^2$ compares the model's squared error to the baseline (predicting $\\bar{y}$). $R^2 = 0$ means no better than the average; $R^2 = 1$ means perfect.</p>` },
        { title: `Run it`, body: `<p>Fit the model, then compare its RMSE to the baseline RMSE.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.model_selection import train_test_split
rng = np.random.default_rng(0)
size = rng.uniform(800, 2500, 200)            # warm-up so RNG matches prior cell
price = 50 + 0.15*size + rng.normal(0, 25, 200)
demand = rng.poisson(40, 150).astype(float)
feat = demand + rng.normal(0, 5, 150)
Xd = feat.reshape(-1,1)
Xtr, Xte, ytr, yte = train_test_split(Xd, demand, test_size=0.3, random_state=0)
md = LinearRegression().fit(Xtr, ytr)
pd_ = md.predict(Xte)
baseline = np.full_like(yte, ytr.mean())
print("model RMSE   :", round(np.sqrt(mean_squared_error(yte, pd_)), 2))
print("baseline RMSE:", round(np.sqrt(mean_squared_error(yte, baseline)), 2))
print("R2 (1 - SSres/SStot):", round(r2_score(yte, pd_), 3))`,
          output: `model RMSE   : 3.74
baseline RMSE: 6.21
R2 (1 - SSres/SStot): 0.618` }
      ],
      conclusion: `The model's RMSE ($3.74$) is well below the average-everything baseline ($6.21$), giving $R^2 = 0.618$. The feature explains about $62\\%$ of demand variance — clearly better than guessing the mean.`
    },
    {
      title: `R-squared can go negative`,
      domain: `Sales modeling`,
      question: `What does R-squared do when a model predicts a constant that is far from the truth?`,
      steps: [
        { title: `The data`, body: `<p>50 sales values centered near 100. A broken model always predicts 130, which is worse than even predicting the mean.</p>` },
        { title: `The math`, body: `<p>$R^2 = 1 - SS_{res}/SS_{tot}$. If the model's squared error exceeds the variance of $y$, $R^2$ drops below 0 — a clear signal the model is worse than the trivial average.</p>` },
        { title: `Run it`, body: `<p>Score a constant-130 predictor against the true values.</p>`,
          code: `import numpy as np
from sklearn.metrics import r2_score
rng = np.random.default_rng(0)
ybad = rng.normal(100, 10, 50)
pred_bad = np.full_like(ybad, 130.0)
print("R2 of a bad constant predictor:", round(r2_score(ybad, pred_bad), 3))`,
          output: `R2 of a bad constant predictor: -12.35` }
      ],
      conclusion: `The broken model scores $R^2 = -12.35$. A negative $R^2$ means the model is worse than just predicting the average — a quick red flag that something is wrong.`
    }
  ],

  /* ---------------- 27. ml-regularization ---------------- */
  "ml-regularization": [
    {
      title: `Tame the weights on correlated genes`,
      domain: `Genomics`,
      question: `With 40 highly correlated features but only 60 samples, does ridge regression beat plain least squares?`,
      steps: [
        { title: `The data`, body: `<p>60 samples, 40 features all built from 5 latent factors, so they are strongly correlated. Plain least squares (OLS) tends to blow up the weights here.</p>` },
        { title: `The math`, body: `<p>Ridge minimizes $\\sum (y_i - \\theta^\\top x_i)^2 + \\lambda\\lVert\\theta\\rVert^2$. The penalty $\\lambda\\lVert\\theta\\rVert^2$ shrinks weights toward zero, trading a little bias for much lower variance.</p>` },
        { title: `Run it`, body: `<p>Fit OLS and ridge, then compare weight norms and test error.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import train_test_split
rng = np.random.default_rng(0)
n, p = 60, 40
base = rng.normal(size=(n, 5))
X = base @ rng.normal(size=(5, p)) + 0.01*rng.normal(size=(n, p))
true_w = rng.normal(size=p)
y = X @ true_w + rng.normal(0, 0.5, n)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4, random_state=0)
ols = LinearRegression().fit(Xtr, ytr)
rid = Ridge(alpha=10.0).fit(Xtr, ytr)
print("OLS   weight norm:", round(np.linalg.norm(ols.coef_), 1))
print("Ridge weight norm:", round(np.linalg.norm(rid.coef_), 1))
print("OLS   test MSE:", round(np.mean((ols.predict(Xte)-yte)**2), 2))
print("Ridge test MSE:", round(np.mean((rid.predict(Xte)-yte)**2), 2))`,
          output: `OLS   weight norm: 191.7
Ridge weight norm: 2.1
OLS   test MSE: 1.84
Ridge test MSE: 0.36` }
      ],
      conclusion: `OLS weights explode to norm $191.7$ with test MSE $1.84$; ridge keeps the norm at $2.1$ and cuts test MSE to $0.36$. The $\\lambda$ penalty stabilizes models when features are correlated.`
    },
    {
      title: `Let LASSO pick the useful features`,
      domain: `Marketing`,
      question: `Out of 20 marketing channels where only 5 truly drive sales, how many does LASSO keep?`,
      steps: [
        { title: `The data`, body: `<p>200 records, 20 features, but only 5 are informative; the rest are noise. We want the model to automatically discard the useless channels.</p>` },
        { title: `The math`, body: `<p>LASSO penalizes $\\lambda\\lVert\\theta\\rVert_1$ (sum of absolute weights). The L1 corner drives many weights exactly to zero, performing automatic feature selection.</p>` },
        { title: `Run it`, body: `<p>Fit LASSO and count the surviving nonzero weights.</p>`,
          code: `import numpy as np
from sklearn.linear_model import Lasso
from sklearn.datasets import make_regression
Xr, yr = make_regression(n_samples=200, n_features=20, n_informative=5,
                         noise=10.0, random_state=0)
las = Lasso(alpha=1.0).fit(Xr, yr)
nz = np.sum(np.abs(las.coef_) > 1e-6)
print("nonzero weights kept:", nz, "out of", Xr.shape[1])`,
          output: `nonzero weights kept: 8 out of 20` }
      ],
      conclusion: `LASSO keeps just 8 of the 20 weights nonzero, zeroing out most of the noise channels. The L1 penalty gives a sparse, interpretable model that highlights the channels that matter.`
    },
    {
      title: `Tune the penalty honestly with folds`,
      domain: `Hyperparameter tuning`,
      question: `Which ridge penalty does 5-fold cross-validation choose on a small, noisy, correlated dataset?`,
      steps: [
        { title: `The data`, body: `<p>Only 30 samples but 50 correlated, noisy features — exactly where the penalty strength matters. We try $\\lambda \\in \\{0.01, 0.1, 1, 10, 100\\}$.</p>` },
        { title: `The math`, body: `<p>Cross-validation splits the training data into folds, trains on some, scores on the held-out fold, and rotates. The $\\lambda$ with the best average held-out score is chosen — no peeking at the test set.</p>` },
        { title: `Run it`, body: `<p>Run RidgeCV with 5-fold CV and print the chosen $\\lambda$.</p>`,
          code: `import numpy as np
from sklearn.linear_model import RidgeCV
from sklearn.model_selection import train_test_split
rng = np.random.default_rng(0)
n, p = 30, 50
base = rng.normal(size=(n,3))
X = base @ rng.normal(size=(3,p)) + 0.5*rng.normal(size=(n,p))
true_w = np.zeros(p); true_w[:3] = [2,-1,1.5]
y = X @ true_w + rng.normal(0,1.0,n)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4, random_state=0)
alphas = [0.01, 0.1, 1.0, 10.0, 100.0]
rcv = RidgeCV(alphas=alphas, cv=5).fit(Xtr, ytr)
print("alphas tried:", alphas)
print("best alpha by 5-fold CV:", rcv.alpha_)`,
          output: `alphas tried: [0.01, 0.1, 1.0, 10.0, 100.0]
best alpha by 5-fold CV: 10.0` }
      ],
      conclusion: `5-fold CV picks $\\lambda = 10$ — enough penalty to handle the correlated noise without over-shrinking. Cross-validation is the universal, honest way to tune any knob: penalty, tree depth, or $k$.`
    }
  ]

});
