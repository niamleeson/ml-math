/* =====================================================================
   REAL-WORLD WALKTHROUGHS — MODULE 09 (A) CLASSICAL ML.
   Three worked, runnable walkthroughs per lesson. Each one:
     data  ->  manipulation/math  ->  runnable code  ->  exact output.
   All code was actually executed with python3 (scikit-learn 1.6.1,
   numpy 1.26.4) and the EXACT stdout is pasted into each `output`.
   Math is delimited with $...$ / $$...$$ and every LaTeX backslash is
   doubled. Never a raw < or > inside math (use &lt; / &gt;).
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ============================================================== */
  /* 1. Gaussian Mixture Models                                     */
  /* ============================================================== */
  "cls-gmm": [
    {
      title: `Customer segmentation from spend behavior`,
      domain: `Retail analytics`,
      question: `A shop has spend-vs-visits data with no labels. How do we split shoppers into segments AND know which shoppers sit on the fence between two segments?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Each shopper is a 2-D point: features like normalized spend and visit frequency. We synthesize 400 shoppers from two hidden segments with <code>make_blobs</code> (spread $\\sigma=1.5$ so the clouds overlap a little).</p>
                 <p>There are no labels. We only assume the data is a blend of two Gaussian blobs.</p>`
        },
        {
          title: `The math`,
          body: `<p>A GMM models the density as $p(x)=\\sum_{k=1}^{2}\\pi_k\\,\\mathcal{N}(x;\\mu_k,\\Sigma_k)$, where $\\pi_k$ is the size of segment $k$.</p>
                 <p>For each shopper it computes a <b>responsibility</b> $\\gamma_k=\\dfrac{\\pi_k\\,\\mathcal{N}(x;\\mu_k,\\Sigma_k)}{\\sum_j \\pi_j\\,\\mathcal{N}(x;\\mu_j,\\Sigma_j)}$. A shopper exactly between segments has $\\gamma_k\\approx 0.5$ — the model's max responsibility is barely above one half.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit a 2-component GMM, read the segment centers, and find the most uncertain shopper (the one whose largest membership is smallest).</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.mixture import GaussianMixture
X, _ = make_blobs(n_samples=400, centers=2, cluster_std=1.5, random_state=0)
gmm = GaussianMixture(n_components=2, random_state=0).fit(X)
labels = gmm.predict(X)
for k in range(2):
    print("segment", k, "size", int((labels==k).sum()), "center", np.round(gmm.means_[k], 2))
p = gmm.predict_proba(X)
maxp = p.max(axis=1)
print("most uncertain customer max-prob:", round(maxp.min(), 3))`,
          output: `segment 0 size 209 center [1.84 0.79]
segment 1 size 191 center [0.88 4.34]
most uncertain customer max-prob: 0.503`
        }
      ],
      conclusion: `The GMM recovers two segments of size 209 and 191 with centers $(1.84,0.79)$ and $(0.88,4.34)$. Crucially, the most ambiguous shopper has a top membership of only $0.503$ — almost a coin flip between segments. That soft score is what k-means throws away: it lets the business treat fence-sitters differently from confident members.`
    },
    {
      title: `Detecting anomalous sensor readings`,
      domain: `Industrial IoT`,
      question: `Normal machine readings cluster into a couple of operating modes. How do we flag a reading that fits none of them, without ever labeling "anomaly"?`,
      steps: [
        {
          title: `The data`,
          body: `<p>We model 300 normal readings as two Gaussian operating modes. Anomaly detection is unsupervised: fit the density of "normal", then score new points by how well that density explains them.</p>`
        },
        {
          title: `The math`,
          body: `<p>A GMM gives the log-likelihood $\\log p(x)=\\log\\sum_k \\pi_k\\,\\mathcal{N}(x;\\mu_k,\\Sigma_k)$ of any point. Normal points sit under a bell, so $\\log p(x)$ is high. A point far from every bell has $\\mathcal{N}\\approx 0$ for all $k$, so $\\log p(x)$ plunges.</p>
                 <p>Pick a threshold at the 1st percentile of training scores. Flag a reading if its $\\log p(x)$ falls below it.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Score one ordinary point and one wild outlier, then compare against the threshold.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.mixture import GaussianMixture
X, _ = make_blobs(n_samples=300, centers=2, cluster_std=1.0, random_state=0)
gmm = GaussianMixture(n_components=2, random_state=0).fit(X)
test = np.array([[0.0, 2.0], [50.0, 50.0]])
ll = gmm.score_samples(test)
print("log-likelihood normal point:", round(ll[0], 2))
print("log-likelihood outlier:     ", round(ll[1], 2))
thr = np.percentile(gmm.score_samples(X), 1)
print("1st-percentile threshold:", round(thr, 2))
print("outlier flagged:", bool(ll[1] < thr))`,
          output: `log-likelihood normal point: -4.82
log-likelihood outlier:      -2169.02
1st-percentile threshold: -6.38
outlier flagged: True`
        }
      ],
      conclusion: `The normal reading scores $-4.82$, comfortably above the $-6.38$ threshold; the outlier scores $-2169.02$ and is flagged. A GMM turns "unusual" into a number — low $\\log p(x)$ — so anomaly detection needs no anomaly labels at all.`
    },
    {
      title: `Soft membership vs a hard cut`,
      domain: `Marketing`,
      question: `When we ask the model "which segment is this customer?", how confident is it — and does a clean three-segment dataset converge quickly?`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 points from three well-separated blobs ($\\sigma=1.2$). With clear structure, EM should converge in a handful of iterations.</p>`
        },
        {
          title: `The math`,
          body: `<p>EM alternates the E-step (compute responsibilities $\\gamma_k$ by Bayes' rule) and the M-step (re-fit $\\mu_k,\\Sigma_k,\\pi_k$ as $\\gamma$-weighted averages). Each round can only raise the log-likelihood, so it converges to a local maximum. For a clean, separated dataset that takes very few rounds.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit, check convergence and iteration count, then read one point's full membership vector.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.mixture import GaussianMixture
X, _ = make_blobs(n_samples=300, centers=3, cluster_std=1.2, random_state=0)
gmm = GaussianMixture(n_components=3, random_state=0).fit(X)
probs = gmm.predict_proba(X)
print("weights:", np.round(gmm.weights_, 3))
print("converged:", gmm.converged_, "in", gmm.n_iter_, "iters")
soft = probs[0]
print("point 0 memberships:", np.round(soft, 3))
print("hard label:", gmm.predict(X[:1])[0])`,
          output: `weights: [0.272 0.379 0.348]
converged: True in 4 iters
point 0 memberships: [0.009 0.991 0.   ]
hard label: 1`
        }
      ],
      conclusion: `EM converged in just 4 iterations with mixing weights $(0.272,0.379,0.348)$. Point 0's membership vector $[0.009,0.991,0.000]$ shows it is 99.1% segment 1 — the hard label is just the argmax, but the full vector is the honest answer. Confident points look like this; fence-sitters spread their mass.`
    }
  ],

  /* ============================================================== */
  /* 2. DBSCAN                                                       */
  /* ============================================================== */
  "cls-dbscan": [
    {
      title: `Finding the two crescents k-means can't`,
      domain: `Shape clustering`,
      question: `Two interleaved crescent moons. Can a density method separate them perfectly without ever being told there are two clusters?`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 points in two moons (<code>make_moons</code>, light noise $0.06$). The moons curve, so points across the gap can be closer than points along the same arc — fatal for k-means, easy for density.</p>`
        },
        {
          title: `The math`,
          body: `<p>DBSCAN never sets $k$. A point is a <b>core</b> point if $|N_\\varepsilon(p)|\\ge\\text{minPts}$, where $N_\\varepsilon(p)=\\{q:\\lVert p-q\\rVert\\le\\varepsilon\\}$. Core points within $\\varepsilon$ chain together, tracing the curve of each moon. With dense, low-noise arcs and the right $\\varepsilon$, every point becomes core or border — zero noise.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Run DBSCAN with $\\varepsilon=0.2$, minPts $=5$, and count clusters, noise, and sizes.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.cluster import DBSCAN
X, _ = make_moons(n_samples=300, noise=0.06, random_state=0)
db = DBSCAN(eps=0.2, min_samples=5).fit(X)
labels = db.labels_
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = int((labels == -1).sum())
print("clusters found:", n_clusters)
print("noise points:", n_noise)
print("cluster sizes:", [int((labels==c).sum()) for c in sorted(set(labels)) if c!=-1])`,
          output: `clusters found: 2
noise points: 0
cluster sizes: [150, 150]`
        }
      ],
      conclusion: `DBSCAN finds exactly 2 clusters of 150 points each, with 0 noise — a perfect split of the two moons, and it was never told $k=2$. It followed the density chain along each arc, something a centroid-distance method cannot do.`
    },
    {
      title: `GPS check-in hotspots with noise`,
      domain: `Location analytics`,
      question: `City check-ins cluster around a few popular venues, but plenty of stray pings sit in between. How do we find the hotspots and ignore the strays?`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 dense check-ins around 3 venues ($\\sigma=0.4$) plus 40 uniformly scattered stray pings. The strays sit in low-density space — they should become noise, not a fake fourth cluster.</p>`
        },
        {
          title: `The math`,
          body: `<p>Raise minPts to 8 so a hotspot needs a real crowd. Strays in sparse space fail $|N_\\varepsilon(p)|\\ge 8$ and touch no core point, so they are labeled noise (label $-1$). Only the three packed venues survive as clusters.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Stack the dense venues and the strays, run DBSCAN, and count hotspots vs noise.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import DBSCAN
core, _ = make_blobs(n_samples=300, centers=3, cluster_std=0.4, random_state=0)
rng = np.random.RandomState(0)
noise = rng.uniform(low=core.min(0), high=core.max(0), size=(40, 2))
X = np.vstack([core, noise])
db = DBSCAN(eps=0.5, min_samples=8).fit(X)
labels = db.labels_
print("hotspots detected:", len(set(labels)) - (1 if -1 in labels else 0))
print("flagged as noise:", int((labels == -1).sum()))`,
          output: `hotspots detected: 3
flagged as noise: 22`
        }
      ],
      conclusion: `DBSCAN nails the 3 venue hotspots and pushes 22 stray pings into the noise bucket. Density clustering's built-in "none of the above" label is exactly what location analytics needs — most map clutter is noise, not a cluster.`
    },
    {
      title: `Fraud as low-density outliers`,
      domain: `Payments`,
      question: `Legitimate transactions pile up in dense regions of feature space; fraud is rare and scattered. Can a clustering algorithm double as a fraud flag?`,
      steps: [
        {
          title: `The data`,
          body: `<p>500 legit transactions in two dense behavioral clusters ($\\sigma=0.7$), plus 15 injected "fraud" points spread uniformly across $[-8,8]^2$. Fraud lives where legit behavior does not.</p>`
        },
        {
          title: `The math`,
          body: `<p>DBSCAN labels a point noise when it is neither core nor border — i.e. it sits in empty space. With minPts $=10$, the dense legit clusters absorb their members, while sparse fraud points get label $-1$. We then check how many of the injected fraud points (the last 15 rows) were caught.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit DBSCAN, collect the $-1$ outliers, and count how many injected fraud points landed in them.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import DBSCAN
X, _ = make_blobs(n_samples=500, centers=2, cluster_std=0.7, random_state=0)
rng = np.random.RandomState(0)
fraud = rng.uniform(-8, 8, size=(15, 2))
data = np.vstack([X, fraud])
db = DBSCAN(eps=0.6, min_samples=10).fit(data)
labels = db.labels_
outliers = np.where(labels == -1)[0]
caught = sum(1 for i in range(len(X), len(data)) if labels[i] == -1)
print("total outliers flagged:", len(outliers))
print("injected fraud caught:", caught, "of 15")`,
          output: `total outliers flagged: 17
injected fraud caught: 12 of 15`
        }
      ],
      conclusion: `DBSCAN flags 17 outliers and catches 12 of the 15 injected fraud points — with no fraud labels and no $k$. The 3 misses were fraud points that happened to land near a legit cluster, the classic precision/recall trade you tune with $\\varepsilon$ and minPts.`
    }
  ],

  /* ============================================================== */
  /* 3. Spectral clustering                                         */
  /* ============================================================== */
  "cls-spectral-clustering": [
    {
      title: `Two moons: spectral vs k-means head-to-head`,
      domain: `Pattern recognition`,
      question: `On interleaved crescents, exactly how much better is spectral clustering than k-means? Let's score both against the ground truth.`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 points in two moons (noise $0.06$) with the true moon labels kept aside for scoring. We compare a connectivity method (spectral) against a distance method (k-means).</p>`
        },
        {
          title: `The math`,
          body: `<p>Spectral clustering builds a nearest-neighbor similarity graph, forms the Laplacian $L=D-W$, and cuts along its smallest non-trivial eigenvector (the Fiedler vector) — a cut through the thin seam between the moons. We grade with the <b>Adjusted Rand Index</b>: $1$ = perfect, $0$ = chance.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit both, score each against the hidden truth $y$.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.cluster import SpectralClustering, KMeans
from sklearn.metrics import adjusted_rand_score
X, y = make_moons(n_samples=300, noise=0.06, random_state=0)
sc = SpectralClustering(n_clusters=2, affinity='nearest_neighbors',
                        n_neighbors=10, random_state=0).fit(X)
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
print("spectral ARI vs truth:", round(adjusted_rand_score(y, sc.labels_), 3))
print("k-means  ARI vs truth:", round(adjusted_rand_score(y, km.labels_), 3))`,
          output: `spectral ARI vs truth: 0.871
k-means  ARI vs truth: 0.234`
        }
      ],
      conclusion: `Spectral clustering scores ARI $0.871$ versus k-means' $0.234$ — a near-perfect recovery of the moons against a method barely above chance. When "similar" means "connected along a curve", the graph Laplacian wins decisively.`
    },
    {
      title: `Concentric rings (nested segments)`,
      domain: `Image segmentation`,
      question: `An inner blob inside an outer ring — like a target painted on an image. Can the graph cut separate the ring from its core?`,
      steps: [
        {
          title: `The data`,
          body: `<p><code>make_circles</code> gives an outer ring and an inner disk (factor $0.4$, noise $0.05$). The inner points are closer to the ring across the gap than to the far side of their own disk, so straight-line distance is useless.</p>`
        },
        {
          title: `The math`,
          body: `<p>In the similarity graph $W_{ij}=\\exp(-\\lVert x_i-x_j\\rVert^2/2\\sigma^2)$, the ring and disk are each densely self-connected but barely connected to each other. The Laplacian's Fiedler vector cuts that weak seam, separating ring from core.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Score spectral and k-means on the nested rings.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_circles
from sklearn.cluster import SpectralClustering, KMeans
from sklearn.metrics import adjusted_rand_score
X, y = make_circles(n_samples=300, noise=0.05, factor=0.4, random_state=0)
sc = SpectralClustering(n_clusters=2, affinity='nearest_neighbors',
                        n_neighbors=15, random_state=0).fit(X)
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
print("spectral ARI:", round(adjusted_rand_score(y, sc.labels_), 3))
print("k-means  ARI:", round(adjusted_rand_score(y, km.labels_), 3))`,
          output: `spectral ARI: 1.0
k-means  ARI: -0.002`
        }
      ],
      conclusion: `Spectral clustering separates ring from core perfectly (ARI $1.0$) while k-means is at chance (ARI $-0.002$, effectively random). Nested, non-convex shapes are exactly where the connectivity view beats the distance view — the same reason it powers image segmentation.`
    },
    {
      title: `Community detection in well-separated groups`,
      domain: `Network science`,
      question: `When groups are clean and separated, does spectral clustering still work as a community detector, and how does it score?`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 points from three well-separated blobs ($\\sigma=0.8$), standing in for three tight communities in a network embedding. Ground-truth community labels are kept for scoring.</p>`
        },
        {
          title: `The math`,
          body: `<p>For $k=3$ communities, spectral clustering keeps the 3 smallest eigenvectors of $L$ and runs k-means in that embedding. Well-separated groups give 3 near-zero eigenvalues (one per connected component), so the embedding cleanly splits the communities.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Cluster into 3 communities and score against the truth.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import SpectralClustering
from sklearn.metrics import adjusted_rand_score
X, y = make_blobs(n_samples=300, centers=3, cluster_std=0.8, random_state=0)
sc = SpectralClustering(n_clusters=3, affinity='nearest_neighbors',
                        n_neighbors=15, random_state=0).fit(X)
print("communities found:", len(set(sc.labels_)))
print("ARI vs truth:", round(adjusted_rand_score(y, sc.labels_), 3))
print("sizes:", sorted([int((sc.labels_==c).sum()) for c in set(sc.labels_)]))`,
          output: `communities found: 3
ARI vs truth: 0.901
sizes: [93, 97, 110]`
        }
      ],
      conclusion: `Spectral clustering recovers all 3 communities with ARI $0.901$ and balanced sizes $[93,97,110]$. It is not just for exotic shapes — on clean, separated data it remains a strong, principled community detector.`
    }
  ],

  /* ============================================================== */
  /* 4. LDA & QDA                                                   */
  /* ============================================================== */
  "cls-lda-qda": [
    {
      title: `A fast, robust diagnosis baseline`,
      domain: `Medical screening`,
      question: `Two patient groups (healthy vs diseased) separate along a couple of biomarkers. How accurate is the simplest Gaussian classifier, and can it give a probability per patient?`,
      steps: [
        {
          title: `The data`,
          body: `<p>400 patients, 2 biomarkers, two Gaussian classes centered at $(0,0)$ and $(3,3)$ with equal spread. This is the regime LDA was built for: roughly Gaussian classes sharing one shape.</p>`
        },
        {
          title: `The math`,
          body: `<p>LDA assumes a shared covariance $\\Sigma$, so its discriminant $\\delta_k(x)=x^\\top\\Sigma^{-1}\\mu_k-\\tfrac12\\mu_k^\\top\\Sigma^{-1}\\mu_k+\\log\\pi_k$ is <b>linear</b> in $x$: the boundary is a straight line. Because it is Gaussian, it also returns a calibrated $p(\\text{class}\\mid x)$ per patient.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Train/test split, fit LDA, read accuracy and one patient's class probabilities.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.model_selection import train_test_split
X, y = make_blobs(n_samples=400, centers=[[0,0],[3,3]], cluster_std=1.0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
lda = LinearDiscriminantAnalysis().fit(Xtr, ytr)
print("LDA test accuracy:", round(lda.score(Xte, yte), 3))
print("class means:", np.round(lda.means_, 2).tolist())
print("P(class) for a test point:", np.round(lda.predict_proba(Xte[:1])[0], 3))`,
          output: `LDA test accuracy: 0.975
class means: [[0.0, 0.01], [2.93, 2.9]]
P(class) for a test point: [0. 1.]`
        }
      ],
      conclusion: `LDA hits $97.5\\%$ test accuracy with a single linear boundary, recovers the two class means near $(0,0)$ and $(2.93,2.9)$, and outputs $p(\\text{class}\\mid x)=[0,1]$ for the test patient. For Gaussian-ish classes that share a shape, LDA is a hard baseline to beat.`
    },
    {
      title: `When classes have different spreads, QDA wins`,
      domain: `Medical imaging`,
      question: `Two tissue types share the same center but one varies far more than the other. Does forcing a single shared covariance hurt — and does per-class covariance fix it?`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 points of a <b>tight</b> class ($\\sigma=0.6$) and 300 of a <b>wide</b> class ($\\sigma=2.5$), both centered at the origin. The classes differ only in spread — the exact case where a shared covariance is wrong.</p>`
        },
        {
          title: `The math`,
          body: `<p>QDA keeps each class's own $\\Sigma_k$, so its score retains the full quadratic $-\\tfrac12(x-\\mu_k)^\\top\\Sigma_k^{-1}(x-\\mu_k)-\\tfrac12\\log|\\Sigma_k|$. The boundary becomes a <b>curve</b> (here, a ring) that wraps the tight class. LDA, forced to pool the two covariances, can only draw a line — and a line cannot separate a tight blob nested inside a wide one.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit both on the same split and compare accuracy.</p>`,
          code: `import numpy as np
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis
from sklearn.model_selection import train_test_split
rng = np.random.RandomState(0)
A = rng.randn(300, 2) * 0.6 + [0, 0]
B = rng.randn(300, 2) * 2.5 + [0, 0]
X = np.vstack([A, B]); y = np.array([0]*300 + [1]*300)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
lda = LinearDiscriminantAnalysis().fit(Xtr, ytr)
qda = QuadraticDiscriminantAnalysis().fit(Xtr, ytr)
print("LDA accuracy (forced 1 shared shape):", round(lda.score(Xte, yte), 3))
print("QDA accuracy (per-class shape):      ", round(qda.score(Xte, yte), 3))`,
          output: `LDA accuracy (forced 1 shared shape): 0.639
QDA accuracy (per-class shape):       0.894`
        }
      ],
      conclusion: `LDA stalls at $63.9\\%$ because a straight line cannot separate a tight class nested inside a wide one; QDA reaches $89.4\\%$ with its curved boundary. When class shapes genuinely differ, the extra covariance parameters of QDA pay off — this is the imaging case where tissue types vary in spread, not just location.`
    },
    {
      title: `LDA as a supervised dimensionality reducer`,
      domain: `Feature engineering`,
      question: `Three classes live in 5-D. Can LDA both project them down to 2-D for plotting AND keep them perfectly separable?`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 points, 3 classes, 5 features, $\\sigma=2.0$. Beyond classifying, LDA can <i>transform</i>: it finds the directions that best separate the class means.</p>`
        },
        {
          title: `The math`,
          body: `<p>With $C$ classes, LDA yields at most $C-1$ discriminant directions — here $3-1=2$. It maximizes the ratio of between-class scatter to within-class scatter, so the projected axes carry the most class-separating signal. The <code>explained_variance_ratio_</code> tells how that signal splits across the 2 axes.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Project 5-D down to 2-D with <code>fit_transform</code> and check separability on the projection.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
X, y = make_blobs(n_samples=300, centers=3, n_features=5, cluster_std=2.0, random_state=0)
lda = LinearDiscriminantAnalysis(n_components=2)
Z = lda.fit_transform(X, y)
print("reduced shape:", Z.shape)
print("explained variance ratio:", np.round(lda.explained_variance_ratio_, 3))
print("train accuracy after projection:", round(lda.score(X, y), 3))`,
          output: `reduced shape: (300, 2)
explained variance ratio: [0.604 0.396]
train accuracy after projection: 1.0`
        }
      ],
      conclusion: `LDA compresses 5-D to 2-D (shape $(300,2)$) while keeping $100\\%$ train accuracy, with the two discriminant axes carrying $60.4\\%$ and $39.6\\%$ of the class-separating variance. Unlike PCA, LDA uses the labels — so its 2-D plot is the most class-separated 2-D view available.`
    }
  ],

  /* ============================================================== */
  /* 5. Gaussian Processes                                          */
  /* ============================================================== */
  "cls-gaussian-process": [
    {
      title: `Honest error bars near data vs far from it`,
      domain: `Sensor modeling`,
      question: `A few noisy sensor samples of a smooth signal. When we predict at a point right among the data versus far outside it, does the model admit how unsure it is?`,
      steps: [
        {
          title: `The data`,
          body: `<p>8 noisy samples of $\\sin(x)$ for $x\\in[0,10]$. We fit a GP and then probe it at $x=5$ (inside the data) and $x=20$ (far outside).</p>`
        },
        {
          title: `The math`,
          body: `<p>The GP posterior variance is $\\sigma_*^2=k(x_*,x_*)-k_*^\\top K^{-1}k_*$. Near data, $k_*$ is large and the subtracted term is big, so $\\sigma_*$ shrinks. Far from data, $k_*\\approx 0$, the subtraction vanishes, and $\\sigma_*$ rises to the prior level — the GP literally reports "I don't know out here."</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit a GP (RBF $+$ noise kernel) and print mean $\\pm$ std at both probe points.</p>`,
          code: `import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, WhiteKernel
rng = np.random.RandomState(0)
X = np.sort(rng.uniform(0, 10, 8)).reshape(-1, 1)
y = np.sin(X).ravel() + 0.1 * rng.randn(8)
kernel = RBF(length_scale=1.0) + WhiteKernel(noise_level=0.1)
gp = GaussianProcessRegressor(kernel=kernel, random_state=0).fit(X, y)
Xtest = np.array([[5.0], [20.0]])
mean, std = gp.predict(Xtest, return_std=True)
print("near data  x=5 : mean", round(mean[0],3), "std", round(std[0],3))
print("far away   x=20: mean", round(mean[1],3), "std", round(std[1],3))`,
          output: `near data  x=5 : mean -0.865 std 0.073
far away   x=20: mean -0.0 std 1.002`
        }
      ],
      conclusion: `At $x=5$ the GP predicts $-0.865\\pm0.073$ — tight, because data surrounds it. At $x=20$ it predicts $-0.0\\pm1.002$: the mean reverts to the prior and the error bar balloons to the full prior width. That self-aware uncertainty is the whole reason to reach for a GP.`
    },
    {
      title: `Bayesian optimization: where to sample next`,
      domain: `Experiment design`,
      question: `An expensive black-box function with a hidden peak. After 5 samples, where should we evaluate next to find the maximum fastest?`,
      steps: [
        {
          title: `The data`,
          body: `<p>The black box is $f(x)=-(x-3)^2+5$ (true peak at $x=3$), but the optimizer doesn't know that. We have 5 random samples in $[0,6]$.</p>`
        },
        {
          title: `The math`,
          body: `<p>Fit a GP to the 5 samples, giving a mean $\\mu(x)$ and std $\\sigma(x)$ everywhere. The <b>Upper Confidence Bound</b> acquisition picks $x_{\\text{next}}=\\arg\\max_x\\,\\mu(x)+2\\sigma(x)$ — balancing "predicted high" against "still uncertain". This is how Bayesian optimization decides each next experiment.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit the GP, evaluate UCB on a grid, and report the suggested next sample.</p>`,
          code: `import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF
def f(x): return -(x - 3.0)**2 + 5.0
rng = np.random.RandomState(0)
X = rng.uniform(0, 6, 5).reshape(-1, 1)
y = f(X).ravel()
gp = GaussianProcessRegressor(kernel=RBF(1.0), random_state=0).fit(X, y)
grid = np.linspace(0, 6, 200).reshape(-1, 1)
mean, std = gp.predict(grid, return_std=True)
ucb = mean + 2.0 * std
next_x = grid[np.argmax(ucb)][0]
print("current best sampled x:", round(X[np.argmax(y)][0], 2))
print("UCB suggests next sample at x:", round(next_x, 2))
print("true optimum is at x = 3.0")`,
          output: `current best sampled x: 3.27
UCB suggests next sample at x: 2.98
true optimum is at x = 3.0`
        }
      ],
      conclusion: `After only 5 blind samples, the GP's UCB rule points to $x=2.98$ — essentially the true optimum at $x=3.0$. That is Bayesian optimization in one shot: the GP's mean and uncertainty together steer each costly experiment toward the peak.`
    },
    {
      title: `Kriging: interpolating a spatial field`,
      domain: `Geostatistics`,
      question: `Scattered elevation measurements across a region. Can we predict elevation at an unmeasured spot AND say how trustworthy each prediction is?`,
      steps: [
        {
          title: `The data`,
          body: `<p>20 measurements at random 2-D coordinates in $[0,10]^2$ of a smooth surface $\\sin(x/2)\\cos(y/2)$ plus small noise. We want elevation at two new spots: one surrounded by data, one near an empty corner.</p>`
        },
        {
          title: `The math`,
          body: `<p>GP regression in 2-D is exactly <b>kriging</b>. The RBF length scale $\\ell$ sets how far a measurement's influence reaches; the posterior variance grows wherever measurements are sparse. A query in a well-sampled region gets a small error bar; one near an empty corner gets a large one.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit the GP and predict elevation $\\pm$ uncertainty at the two query locations.</p>`,
          code: `import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, WhiteKernel
rng = np.random.RandomState(0)
coords = rng.uniform(0, 10, (20, 2))
elev = np.sin(coords[:,0]/2) * np.cos(coords[:,1]/2) + 0.05*rng.randn(20)
k = RBF(length_scale=2.0) + WhiteKernel(0.05)
gp = GaussianProcessRegressor(kernel=k, random_state=0).fit(coords, elev)
query = np.array([[5.0, 5.0], [9.5, 0.5]])
m, s = gp.predict(query, return_std=True)
print("location (5,5)    : elevation", round(m[0],3), "+/-", round(s[0],3))
print("location (9.5,0.5): elevation", round(m[1],3), "+/-", round(s[1],3))`,
          output: `location (5,5)    : elevation -0.581 +/- 0.043
location (9.5,0.5): elevation -0.549 +/- 0.649`
        }
      ],
      conclusion: `The central, well-sampled location $(5,5)$ gets elevation $-0.581\\pm0.043$; the corner $(9.5,0.5)$, far from measurements, gets $-0.549\\pm0.649$ — a $15\\times$ wider error bar. Kriging doesn't just interpolate, it maps where you can trust the interpolation, which is gold for deciding where to measure next.`
    }
  ],

  /* ============================================================== */
  /* 6. Bayesian linear regression                                  */
  /* ============================================================== */
  "cls-bayesian-regression": [
    {
      title: `An effect size with an honest error bar`,
      domain: `A/B testing`,
      question: `From 30 small-sample observations, what is the slope (effect size) — and how uncertain is a prediction at a new input?`,
      steps: [
        {
          title: `The data`,
          body: `<p>30 points from a linear relationship with heavy noise (std $10$) generated by <code>make_regression</code>, with the true slope returned so we can check it. Small data means many lines fit — perfect for a Bayesian treatment.</p>`
        },
        {
          title: `The math`,
          body: `<p>The posterior over weights is $p(w\\mid D)=\\mathcal{N}(w;m_N,S_N)$ with $S_N=(\\alpha I+\\beta\\,\\Phi^\\top\\Phi)^{-1}$ and $m_N=\\beta\\,S_N\\,\\Phi^\\top y$. <code>BayesianRidge</code> learns the noise precision $\\alpha$ (here $\\beta$ in the lesson's notation) and the prior precision from the data, then a prediction at a new $x$ comes with a predictive std.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit, compare the estimated slope to the truth, and predict with a $\\pm$ band.</p>`,
          code: `import numpy as np
from sklearn.linear_model import BayesianRidge
from sklearn.datasets import make_regression
X, y, coef = make_regression(n_samples=30, n_features=1, noise=10.0,
                             coef=True, random_state=0)
br = BayesianRidge().fit(X, y)
print("estimated slope:", round(br.coef_[0], 2), " true slope:", round(float(coef), 2))
mean, std = br.predict([[1.5]], return_std=True)
print("prediction at x=1.5:", round(mean[0], 2), "+/-", round(std[0], 2))
print("noise precision (alpha):", round(br.alpha_, 4))`,
          output: `estimated slope: 95.23  true slope: 94.37
prediction at x=1.5: 140.79 +/- 8.59
noise precision (alpha): 0.0144`
        }
      ],
      conclusion: `From just 30 noisy points the model recovers a slope of $95.23$ (true $94.37$) and, crucially, predicts $140.79\\pm8.59$ at $x=1.5$ — a calibrated error bar a plain least-squares fit never gives. The learned noise precision $\\alpha=0.0144$ corresponds to a noise std of about $8.3$, matching the data.`
    },
    {
      title: `The prior tames overfitting`,
      domain: `High-dimensional modeling`,
      question: `With 20 features but only 40 samples, ordinary regression would overfit wildly. Does the Bayesian prior keep the weights under control?`,
      steps: [
        {
          title: `The data`,
          body: `<p>40 samples, 20 features, but only 5 are truly informative (noise std $15$). More features than the model can safely fit from this little data — a recipe for overfitting.</p>`
        },
        {
          title: `The math`,
          body: `<p>The Gaussian prior $w\\sim\\mathcal{N}(0,\\alpha^{-1}I)$ adds $\\alpha I$ inside $S_N=(\\alpha I+\\beta\\Phi^\\top\\Phi)^{-1}$. This is exactly ridge regularization: it shrinks weights toward zero unless the data strongly argues otherwise. The learned weight precision $\\lambda$ controls how hard it pulls.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit, count how many weights got shrunk near zero, and check $R^2$.</p>`,
          code: `import numpy as np
from sklearn.linear_model import BayesianRidge
from sklearn.datasets import make_regression
X, y = make_regression(n_samples=40, n_features=20, n_informative=5,
                       noise=15.0, random_state=0)
br = BayesianRidge().fit(X, y)
small = int((np.abs(br.coef_) < 1.0).sum())
print("features:", X.shape[1])
print("weights shrunk near zero by prior:", small)
print("weight precision (lambda):", round(br.lambda_, 4))
print("train R^2:", round(br.score(X, y), 3))`,
          output: `features: 20
weights shrunk near zero by prior: 6
weight precision (lambda): 0.0013
train R^2: 0.994`
        }
      ],
      conclusion: `The prior shrinks 6 of the 20 weights below $1.0$ in magnitude, quietly suppressing uninformative features while still explaining the data ($R^2=0.994$). The prior is regularization with a probabilistic conscience — it is the built-in defense against overfitting when features outnumber comfortable sample sizes.`
    },
    {
      title: `Uncertainty shrinks as data accumulates`,
      domain: `Forecasting`,
      question: `As a forecasting model sees more history, should our confidence in its slope tighten? Let's watch the posterior over the slope as N grows.`,
      steps: [
        {
          title: `The data`,
          body: `<p>A line $y=0.8x+0.3$ with noise (std $0.5$), sampled at $N=5,25,200$ points. We track the posterior uncertainty of the slope at each $N$.</p>`
        },
        {
          title: `The math`,
          body: `<p>As data arrives, the term $\\beta\\,\\Phi^\\top\\Phi$ in $S_N=(\\alpha I+\\beta\\,\\Phi^\\top\\Phi)^{-1}$ grows, so $S_N$ shrinks toward zero. The posterior std of the slope is $\\sqrt{(S_N)_{11}}$. More data $\\Rightarrow$ smaller $S_N$ $\\Rightarrow$ a sharper, more confident slope estimate.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit at three sample sizes and print the slope $\\pm$ its posterior std.</p>`,
          code: `import numpy as np
from sklearn.linear_model import BayesianRidge
true_slope, true_int = 0.8, 0.3
def make(n, seed):
    rng = np.random.RandomState(seed)
    x = np.linspace(0, 5, n).reshape(-1, 1)
    y = true_slope * x.ravel() + true_int + 0.5 * rng.randn(n)
    return x, y
for n in [5, 25, 200]:
    x, y = make(n, 0)
    br = BayesianRidge().fit(x, y)
    slope_std = np.sqrt(br.sigma_[0, 0])
    print("N=%3d  slope=%.3f  +/- %.4f" % (n, br.coef_[0], slope_std))`,
          output: `N=  5  slope=0.874  +/- 0.0845
N= 25  slope=0.691  +/- 0.0694
N=200  slope=0.781  +/- 0.0249`
        }
      ],
      conclusion: `The slope's posterior std falls from $0.0845$ at $N=5$ to $0.0249$ at $N=200$ — the cloud of plausible lines tightens by more than $3\\times$ as data accumulates, exactly as $S_N=(\\alpha I+\\beta\\Phi^\\top\\Phi)^{-1}$ predicts. Bayesian regression doesn't just forecast; it tells you when to trust the forecast.`
    }
  ],

  /* ============================================================== */
  /* 7. Gradient boosting / XGBoost                                 */
  /* ============================================================== */
  "cls-gradient-boosting": [
    {
      title: `Credit-risk classification on tabular data`,
      domain: `Lending`,
      question: `On a tabular credit dataset, how good is a gradient-boosted classifier, and does adding more trees actually keep reducing error?`,
      steps: [
        {
          title: `The data`,
          body: `<p>600 applicants, 10 features (5 informative, 2 redundant), two classes (default vs repay) from <code>make_classification</code>. Tabular, mixed-signal data — boosting's home turf.</p>`
        },
        {
          title: `The math`,
          body: `<p>Boosting builds $F_m(x)=F_{m-1}(x)+\\nu\\,h_m(x)$, each tree $h_m$ fitting the negative gradient of the loss (the current residual). <code>staged_predict</code> replays the model after each tree, so we can watch test error fall as stages accumulate.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Train 100 trees and compare test error after 10 vs 100 stages.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
X, y = make_classification(n_samples=600, n_features=10, n_informative=5,
                           n_redundant=2, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1,
                                max_depth=3, random_state=0).fit(Xtr, ytr)
print("test accuracy:", round(gb.score(Xte, yte), 3))
stages = list(gb.staged_predict(Xte))
err10 = round(1 - accuracy_score(yte, stages[9]), 3)
err100 = round(1 - accuracy_score(yte, stages[99]), 3)
print("test error after  10 trees:", err10)
print("test error after 100 trees:", err100)`,
          output: `test accuracy: 0.9
test error after  10 trees: 0.128
test error after 100 trees: 0.1`
        }
      ],
      conclusion: `The boosted model reaches $90\\%$ test accuracy, and test error drops from $0.128$ after 10 trees to $0.100$ after 100 — each stage chips away at the residual the previous trees left behind. That staged error reduction is the signature of boosting.`
    },
    {
      title: `Watching residuals shrink stage by stage`,
      domain: `Regression / demand`,
      question: `Boosting claims each new tree fits the leftover error. Can we see the training error collapse as trees are added?`,
      steps: [
        {
          title: `The data`,
          body: `<p>500 samples, 8 features (5 informative), noise std $10$, from <code>make_regression</code> — a stand-in for a demand or pricing target.</p>`
        },
        {
          title: `The math`,
          body: `<p>With squared-error loss, the negative gradient is exactly the residual $r_i=y_i-F_{m-1}(x_i)$. Each stump-then-tree fits those residuals, so $\\sum_i r_i^2$ (the train MSE) falls monotonically as stages accumulate. We snapshot it at 1, 10, 50, and 200 trees.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Train 200 trees and print train MSE at several stages, plus the final test MSE.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
X, y = make_regression(n_samples=500, n_features=8, n_informative=5,
                       noise=10.0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
gb = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1,
                               max_depth=3, random_state=0).fit(Xtr, ytr)
preds = list(gb.staged_predict(Xtr))
for m in [1, 10, 50, 200]:
    mse = mean_squared_error(ytr, preds[m-1])
    print("after %3d trees  train MSE = %8.1f" % (m, mse))
print("test MSE:", round(mean_squared_error(yte, gb.predict(Xte)), 1))`,
          output: `after   1 trees  train MSE =  18780.4
after  10 trees  train MSE =   7705.1
after  50 trees  train MSE =    535.4
after 200 trees  train MSE =     45.8
test MSE: 1615.3`
        }
      ],
      conclusion: `Train MSE collapses from $18780.4$ (1 tree) to $45.8$ (200 trees) — each stage really does fit the residual the last left over, just as the negative-gradient view predicts. The test MSE of $1615.3$ also flags the gap: keep adding trees and you eventually fit noise, which is why the next walkthrough tunes the learning rate.`
    },
    {
      title: `Why a small learning rate generalizes better`,
      domain: `Model tuning`,
      question: `Does taking smaller boosting steps (shrinkage $\\nu$) actually improve test accuracy, even when training accuracy already hits 100%?`,
      steps: [
        {
          title: `The data`,
          body: `<p>800 samples, 12 features (6 informative, 3 redundant), two classes. We hold the tree count at 200 and only vary the learning rate $\\nu\\in\\{1.0,0.3,0.05\\}$.</p>`
        },
        {
          title: `The math`,
          body: `<p>Each stage updates $F_m=F_{m-1}+\\nu\\,h_m$. A large $\\nu$ lets one tree dominate and overshoot; a small $\\nu$ takes gentle steps so the ensemble averages many weak corrections — a form of regularization. The trade is more trees needed for the same fit. We watch train vs test accuracy across $\\nu$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit three models differing only in $\\nu$ and compare train vs test accuracy.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=800, n_features=12, n_informative=6,
                           n_redundant=3, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
for nu in [1.0, 0.3, 0.05]:
    gb = GradientBoostingClassifier(n_estimators=200, learning_rate=nu,
                                    max_depth=3, random_state=0).fit(Xtr, ytr)
    print("nu=%.2f  train acc=%.3f  test acc=%.3f" %
          (nu, gb.score(Xtr, ytr), gb.score(Xte, yte)))`,
          output: `nu=1.00  train acc=1.000  test acc=0.921
nu=0.30  train acc=1.000  test acc=0.938
nu=0.05  train acc=0.998  test acc=0.921`
        }
      ],
      conclusion: `At $\\nu=1.0$ the model memorizes the training set ($100\\%$) but tests at $92.1\\%$; dialing $\\nu$ down to $0.3$ lifts test accuracy to $93.8\\%$ — gentler steps generalize better. Push too far ($\\nu=0.05$) and 200 trees is no longer enough to finish learning, so test accuracy slips back to $92.1\\%$. The sweet spot is small-but-not-tiny $\\nu$ paired with enough trees.`
    }
  ]

});
