/* Per-lesson CODE VISUALIZATIONS — 09-classical-a.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["cls-gmm"] = {
  question: "Two overlapping blobs of points. A GMM gives each point a soft membership, not a hard label — how do you READ those memberships, and how do you pick the number of blobs?",
  charts: [
    {
      type: "scatter",
      title: "Healthy: two Gaussians fitted, points coloured by soft membership",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "mostly blob A (>0.8)", color: "#4ea1ff", points: [[-2.3,1.4],[-1.6,0.6],[-2.9,1.1],[-2.1,2.0],[-3.1,0.8],[-1.9,1.7],[-2.6,0.4],[-2.0,1.0],[-3.0,1.9],[-1.5,1.3]] },
        { name: "in-between (0.4-0.6)", color: "#c89bff", points: [[0.2,0.5],[0.5,-0.1],[-0.3,0.9],[0.7,0.2],[0.0,-0.4]] },
        { name: "mostly blob B (>0.8)", color: "#7ee787", points: [[3.1,-1.0],[2.6,-0.4],[3.5,-1.6],[2.9,-0.2],[3.8,-1.1],[2.4,-1.4],[3.2,-0.7],[3.0,-1.9],[2.7,-0.6],[3.6,-0.9]] }
      ],
      lines: [
        { color: "#4ea1ff", dash: [6,4], points: [[-2.0,3.4],[-0.6,2.8],[0.0,1.4],[-0.6,0.0],[-2.0,-0.6],[-3.4,0.0],[-4.0,1.4],[-3.4,2.8],[-2.0,3.4]] },
        { color: "#7ee787", dash: [6,4], points: [[3.0,1.0],[4.4,0.4],[5.0,-1.0],[4.4,-2.4],[3.0,-3.0],[1.6,-2.4],[1.0,-1.0],[1.6,0.4],[3.0,1.0]] }
      ],
      interpret: "<b>Each axis is one feature; every dot is a point, coloured by its responsibility</b> — the probability the GMM thinks it belongs to blob A vs blob B. Blue dots are >80% blob A, green >80% blob B, and the <b>purple dots in the seam are genuinely uncertain (near 50/50)</b>. The dashed ovals are the fitted Gaussians at their ±2 sigma ring. Read it as: tight ovals over clear blobs with only a thin purple seam means EM converged to a clean, confident fit."
    },
    {
      type: "line",
      title: "Picking K: BIC dips lowest at K=2 (choose this K)",
      xlabel: "K (number of Gaussian components)",
      ylabel: "BIC (lower is better)",
      series: [
        { name: "BIC", color: "#7ee787", points: [[1,1180],[2,940],[3,955],[4,978],[5,1005]] }
      ],
      interpret: "<b>The x-axis is how many blobs you ask for; the y-axis is BIC (Bayesian Information Criterion)</b> — a score that rewards fit but penalises extra components, so lower is better. Read the lowest point: BIC bottoms out at K=2, then climbs as more blobs just add complexity without explaining more. Use BIC (not raw likelihood, which always favours more blobs) to choose K = 2 here."
    },
    {
      type: "scatter",
      title: "Heavy overlap: memberships are soft everywhere (illustrative)",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "leans blob A", color: "#4ea1ff", points: [[-1.0,0.8],[-0.6,0.2],[-1.3,1.1],[-0.4,0.5],[-0.9,-0.2],[-1.1,0.4]] },
        { name: "truly mixed (~50/50)", color: "#c89bff", points: [[0.0,0.4],[0.3,-0.2],[-0.2,0.8],[0.5,0.1],[0.1,-0.5],[-0.3,0.2],[0.4,0.6]] },
        { name: "leans blob B", color: "#7ee787", points: [[1.0,-0.6],[0.6,-0.1],[1.3,-1.0],[0.5,-0.4],[1.1,0.2],[0.9,-0.7]] }
      ],
      lines: [
        { color: "#4ea1ff", dash: [6,4], points: [[-0.4,2.2],[0.6,1.5],[1.0,0.0],[0.6,-1.5],[-0.4,-2.2],[-1.4,-1.5],[-1.8,0.0],[-1.4,1.5],[-0.4,2.2]] },
        { color: "#7ee787", dash: [6,4], points: [[0.6,2.2],[1.6,1.5],[2.0,0.0],[1.6,-1.5],[0.6,-2.2],[-0.4,-1.5],[-0.8,0.0],[-0.4,1.5],[0.6,2.2]] }
      ],
      interpret: "<b>Illustrative.</b> The two Gaussians sit almost on top of each other, so most points get memberships near 50/50 — a wide purple band, not a thin seam. <b>Recognise it</b> when the soft labels are mushy across the whole plot and the two ovals heavily overlap. This is honest uncertainty, not a bug: the blobs really aren't separable, so don't trust any hard label you force out of it."
    },
    {
      type: "scatter",
      title: "Variance collapse: a blob latches onto one point (illustrative)",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "broad blob", color: "#4ea1ff", points: [[-2.0,1.0],[-1.0,0.4],[0.0,1.2],[1.0,0.2],[2.0,1.1],[-1.5,-0.6],[0.5,-0.8],[1.5,0.6]] },
        { name: "collapsed spike", color: "#ff7b72", points: [[3.0,-2.0]] }
      ],
      lines: [
        { color: "#4ea1ff", dash: [6,4], points: [[0.0,3.0],[1.8,2.2],[2.6,0.0],[1.8,-2.2],[0.0,-3.0],[-1.8,-2.2],[-2.6,0.0],[-1.8,2.2],[0.0,3.0]] },
        { color: "#ff7b72", dash: [3,3], points: [[3.18,-2.0],[3.0,-1.82],[2.82,-2.0],[3.0,-2.18],[3.18,-2.0]] }
      ],
      interpret: "<b>Illustrative.</b> One Gaussian has shrunk its covariance toward zero to wrap a single point (the tiny red ring), spiking the likelihood to infinity while explaining nothing. <b>Recognise it</b> when one component becomes a pinprick on one outlier and its weight is tiny. The fix is a covariance floor (reg_covar) plus several random restarts (n_init) and keeping the best honest fit."
    }
  ],
  caption: "Read GMM colours as soft memberships (probabilities), with a thin purple seam meaning a confident fit; pick K from the BIC dip. Variants show honest heavy-overlap uncertainty and the variance-collapse failure to guard against.",
  code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.mixture import GaussianMixture

rng = np.random.default_rng(0)
A = rng.normal([-2.0, 1.0], 0.7, size=(40, 2))
B = rng.normal([3.0, -1.0], 0.8, size=(40, 2))
X = np.vstack([A, B])

gmm = GaussianMixture(n_components=2, n_init=5, random_state=0).fit(X)
resp = gmm.predict_proba(X)[:, 0]   # responsibility for blob A, in [0,1]

plt.scatter(X[:, 0], X[:, 1], c=resp, cmap="cool", edgecolor="k")
plt.colorbar(label="responsibility for blob A")
plt.xlabel("feature 1"); plt.ylabel("feature 2")
plt.title("GMM soft memberships")

# choose K by BIC (lower is better)
bic = [GaussianMixture(n_components=k, n_init=5, random_state=0).fit(X).bic(X)
       for k in range(1, 6)]
print("BIC per K:", np.round(bic, 1), "-> pick", int(np.argmin(bic) + 1))
plt.show()`
};

window.CODEVIZ["cls-dbscan"] = {
  question: "Two dense crowds plus scattered loners. DBSCAN finds the crowds and flags the loners as noise without you setting k — but how do you READ the result, and how do you pick the radius eps?",
  charts: [
    {
      type: "scatter",
      title: "Healthy: two density clusters found, loners flagged as noise",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "cluster 1", color: "#4ea1ff", points: [[2.0,2.1],[2.4,1.7],[1.7,2.4],[2.2,2.5],[1.9,1.6],[2.6,2.2],[1.6,2.0],[2.3,1.9],[2.1,2.7],[1.8,1.8],[2.5,2.4],[2.0,1.5]] },
        { name: "cluster 2", color: "#7ee787", points: [[7.0,6.1],[7.4,5.7],[6.7,6.4],[7.2,6.5],[6.9,5.6],[7.6,6.2],[6.6,6.0],[7.3,5.9],[7.1,6.7],[6.8,5.8],[7.5,6.4],[7.0,5.5]] },
        { name: "noise", color: "#9aa7b4", points: [[1.0,5.5],[4.5,3.0],[8.5,1.5],[3.0,6.5],[5.5,1.0],[8.0,5.0],[1.5,1.2]] }
      ],
      lines: [],
      interpret: "<b>Each axis is one feature; every dot is a point.</b> Coloured dots are dense clusters DBSCAN grew from core points, and the <b>grey dots are noise</b> — loners with too few neighbours inside radius eps to join any crowd. Notice no k was set: DBSCAN found two clusters on its own and refused to force the outliers into a group. Read it as: distinct colours over the dense crowds, grey scattered in the empty space."
    },
    {
      type: "line",
      title: "Picking eps: k-distance plot, take eps at the elbow",
      xlabel: "points sorted by distance to their 4th-nearest neighbour",
      ylabel: "distance to 4th-nearest neighbour",
      series: [
        { name: "4th-NN distance", color: "#7ee787", points: [[0,0.25],[10,0.35],[20,0.45],[30,0.55],[40,0.62],[50,0.70],[58,0.85],[63,1.4],[66,2.3],[68,3.5]] }
      ],
      interpret: "<b>The x-axis is every point sorted by how far away its 4th-nearest neighbour is (minPts=4); the y-axis is that distance.</b> The curve stays low and flat for points inside dense crowds, then shoots up at the right for the loners. Read the <b>elbow</b> where it bends sharply (around 0.85 here) and set eps there — that splits dense-enough points from the sparse tail."
    },
    {
      type: "scatter",
      title: "eps too small: nearly everything becomes noise (illustrative)",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "tiny surviving cluster", color: "#4ea1ff", points: [[2.1,2.0],[2.2,2.1],[2.0,1.9],[2.15,2.05]] },
        { name: "noise", color: "#9aa7b4", points: [[2.4,1.7],[1.7,2.4],[2.6,2.2],[1.6,2.0],[7.0,6.1],[7.4,5.7],[6.7,6.4],[7.2,6.5],[6.9,5.6],[7.6,6.2],[6.6,6.0],[1.0,5.5],[4.5,3.0],[8.5,1.5],[3.0,6.5]] }
      ],
      lines: [],
      interpret: "<b>Illustrative.</b> eps was shrunk so far that almost no point has minPts neighbours inside it, so the crowds dissolve into grey and only a tiny clump survives. <b>Recognise it</b> when most of the plot is grey noise and clusters are missing. The fix: raise eps — the k-distance elbow tells you how far up to go."
    },
    {
      type: "scatter",
      title: "eps too big: the two crowds merge into one (illustrative)",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "one merged cluster", color: "#ffb454", points: [[2.0,2.1],[2.4,1.7],[1.7,2.4],[2.2,2.5],[2.6,2.2],[2.3,1.9],[4.5,3.0],[5.5,4.0],[7.0,6.1],[7.4,5.7],[6.7,6.4],[7.2,6.5],[6.9,5.6],[7.6,6.2],[6.6,6.0],[3.0,2.8],[5.0,4.5]] }
      ],
      lines: [],
      interpret: "<b>Illustrative.</b> eps was set so large that the gap between the two crowds is now inside the radius, so a chain of core points bridges them and DBSCAN reports one blob. <b>Recognise it</b> when separate groups fuse into a single colour and almost nothing is noise. The fix: lower eps back toward the elbow so the sparse seam between crowds breaks the chain."
    },
    {
      type: "scatter",
      title: "Why not k-means: DBSCAN traces a non-convex ring (illustrative)",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "ring cluster", color: "#4ea1ff", points: [[3.0,0.0],[2.6,1.5],[1.5,2.6],[0.0,3.0],[-1.5,2.6],[-2.6,1.5],[-3.0,0.0],[-2.6,-1.5],[-1.5,-2.6],[0.0,-3.0],[1.5,-2.6],[2.6,-1.5]] },
        { name: "core cluster", color: "#7ee787", points: [[0.2,0.1],[-0.2,0.3],[0.3,-0.2],[-0.1,-0.3],[0.0,0.0]] }
      ],
      lines: [],
      interpret: "<b>Illustrative.</b> A ring wraps a central blob — two density clusters with no straight line between them. DBSCAN follows the dense ring all the way around and keeps the core separate, because it grows clusters by connectivity not roundness. <b>Recognise the win</b> here: k-means would slice both shapes with a flat boundary, but DBSCAN traces the curve. This is when to prefer density-based clustering."
    }
  ],
  caption: "Read DBSCAN colours as density crowds and grey as noise, and pick eps from the k-distance elbow. Variants show eps too small (all noise), eps too big (crowds merge), and the non-convex shapes that make DBSCAN beat k-means.",
  code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors

rng = np.random.default_rng(0)
A = rng.normal([2.0, 2.0], 0.4, size=(35, 2))
B = rng.normal([7.0, 6.0], 0.4, size=(35, 2))
noise = rng.uniform([1, 1], [9, 7], size=(12, 2))
X = np.vstack([A, B, noise])

db = DBSCAN(eps=0.85, min_samples=4).fit(X)
labels = db.labels_                      # -1 means noise

for lab in set(labels):
    pts = X[labels == lab]
    color = "#9aa7b4" if lab == -1 else None
    plt.scatter(pts[:, 0], pts[:, 1], c=color,
                label="noise" if lab == -1 else "cluster " + str(lab))
plt.xlabel("feature 1"); plt.ylabel("feature 2")
plt.title("DBSCAN: clusters + noise"); plt.legend()

# k-distance plot to choose eps: sort distance to 4th-nearest neighbour
nn = NearestNeighbors(n_neighbors=4).fit(X)
d = np.sort(nn.kneighbors(X)[0][:, -1])
plt.figure(); plt.plot(d, color="#7ee787")
plt.xlabel("points sorted"); plt.ylabel("4th-NN distance")
plt.title("k-distance: eps at the elbow")
plt.show()`
};

window.CODEVIZ["cls-spectral-clustering"] = {
  question: "Two interleaved moons: why does cutting the similarity graph beat cutting by distance?",
  caption: "",
  code: `// Spectral idea on a tiny 4-point graph: edges 1-2 and 3-4 are strong (w=1),
// the seam 2-3 is weak (w=0.1). The cheapest cut severs only the weak seam.
const W = [
  [0,   1,   0,   0  ],
  [1,   0,   0.1, 0  ],
  [0,   0.1, 0,   1  ],
  [0,   0,   1,   0  ]
];
function cutCost(f){            // f[i] = +1 or -1 (which side point i is on)
  let cost = 0;
  for (let i=0;i<4;i++)
    for (let j=i+1;j<4;j++)
      if (f[i] !== f[j]) cost += W[i][j];   // edge crosses the cut
  return cost;
}
console.log("natural [+,+,-,-]:", cutCost([ 1, 1,-1,-1]));  // 0.1  -> cut weak seam
console.log("bad     [+,-,+,-]:", cutCost([ 1,-1, 1,-1]));  // 2.0  -> cut both strong pairs
// The Fiedler eigenvector of L = D - W picks the [+,+,-,-] sign pattern: the cheap cut.`,
  charts: [
    {
      type: "scatter",
      title: "Ideal: spectral cut separates the two moons",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "moon A (cluster 0)", color: "#4ea1ff", points: [[-2.5,0.1],[-2.3,0.8],[-1.9,1.5],[-1.2,2.0],[-0.4,2.3],[0.4,2.3],[1.2,2.0],[1.9,1.5],[2.3,0.8],[2.5,0.1]] },
        { name: "moon B (cluster 1)", color: "#7ee787", points: [[0,1.1],[0.2,0.4],[0.6,-0.3],[1.3,-0.8],[2.1,-1.0],[2.9,-1.0],[3.7,-0.8],[4.4,-0.3],[4.8,0.4],[5.0,1.1]] }
      ],
      interpret: "Each dot is a point; colour is the cluster it was assigned. The two crescents interleave, so points across the gap are nearer than points along the same arc. Spectral clustering links each point to its near neighbours, then cuts the graph along the thin seam where few links cross — so it follows the curve of each moon and colours them correctly. This is the healthy result you want to see."
    },
    {
      type: "scatter",
      title: "What k-means does instead: a straight slice through both moons (illustrative)",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "k-means group 0", color: "#ff7b72", points: [[-2.5,0.1],[-2.3,0.8],[-1.9,1.5],[-1.2,2.0],[-0.4,2.3],[0,1.1],[0.2,0.4],[0.6,-0.3]] },
        { name: "k-means group 1", color: "#ffb454", points: [[0.4,2.3],[1.2,2.0],[1.9,1.5],[2.3,0.8],[2.5,0.1],[1.3,-0.8],[2.1,-1.0],[2.9,-1.0],[3.7,-0.8],[4.4,-0.3],[4.8,0.4],[5.0,1.1]] }
      ],
      lines: [ { color: "#9aa7b4", dash: true, points: [[0.3,-1.2],[0.3,2.5]] } ],
      interpret: "Same points, but coloured by 2-means on raw (x,y). k-means can only carve a convex region around each centroid, so the boundary is the straight dashed line: it slices both moons in half rather than following them. Recognise this failure when a curved or interleaved structure gets chopped by a flat split — it means a distance-based method is wrong for the geometry."
    },
    {
      type: "bars",
      title: "Eigengap heuristic: choosing how many clusters k (illustrative)",
      labels: ["lambda1","lambda2","lambda3","lambda4","lambda5","lambda6"],
      values: [0.00, 0.02, 0.55, 0.60, 0.66, 0.71],
      valueLabels: ["0.00","0.02","0.55","0.60","0.66","0.71"],
      colors: ["#7ee787","#7ee787","#9aa7b4","#9aa7b4","#9aa7b4","#9aa7b4"],
      interpret: "Each bar is one eigenvalue of the graph Laplacian, sorted small to large; height is the eigenvalue. The first two sit near zero, then there is a big jump (the eigengap) before the rest. You read off k as the number of near-zero eigenvalues before that jump: here the gap after the 2nd bar says k=2 clusters. A clear gap means the cluster count is well defined; no visible gap means the data has no clean separation."
    }
  ]
};

window.CODEVIZ["cls-lda-qda"] = {
  question: "Share one covariance or give each class its own — does the boundary come out a line or a curve?",
  caption: "",
  code: `// One feature x. Class 0: mean -1.5. Class 1: mean 2.0. Where is the boundary?
const c0 = { mu: -1.5, v: 0.7 };   // tight class (small variance)
const c1 = { mu:  2.0, v: 2.2 };   // wide class (large variance)
// log-score for a class at x (drop the shared constant); boundary is where scores tie.
function score(x, c){
  return -((x - c.mu)*(x - c.mu)) / (2*c.v) - 0.5*Math.log(c.v);
}
function predict(x, qda){
  if (qda) return score(x,c1) - score(x,c0) >= 0 ? 1 : 0;   // each class its own v
  const pooled = (c0.v + c1.v)/2;                            // LDA: shared v
  const s0 = -((x-c0.mu)**2)/(2*pooled), s1 = -((x-c1.mu)**2)/(2*pooled);
  return s1 - s0 >= 0 ? 1 : 0;
}
// LDA: one straight threshold near the midpoint. QDA: the wide class wraps around
// the tight one, so x very negative AND x very positive both go to class 1.
console.log("LDA  @ x=0:", predict(0,false), " QDA @ x=-4:", predict(-4,true));`,
  charts: [
    {
      type: "scatter",
      title: "QDA: per-class covariance gives a curved boundary that wraps the tight class",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "class 0 (tight)", color: "#4ea1ff", points: [[-1.5,0],[-2.1,0.5],[-0.9,0.5],[-1.5,0.7],[-1.5,-0.7],[-2.0,-0.4],[-1.0,-0.4]] },
        { name: "class 1 (wide)", color: "#7ee787", points: [[2.0,0],[3.5,0],[0.5,0],[2.0,1.5],[2.0,-1.5],[4.5,1.0],[-0.5,1.2],[3.0,-1.3],[1.0,1.4]] }
      ],
      lines: [ { color: "#ffb454", dash: false, points: [[0.05,-3.5],[-0.25,-2.0],[-0.45,-0.8],[-0.5,0],[-0.45,0.8],[-0.25,2.0],[0.05,3.5]] } ],
      interpret: "Dots are points coloured by true class; the orange line is the decision boundary. Because each class keeps its own spread (tight blue vs wide green), the boundary is a curve that bows around the tight class. Read it as: anything inside the bend is predicted blue, everything outside is green. Use QDA when the class shapes genuinely differ and you have enough data to estimate a covariance per class."
    },
    {
      type: "scatter",
      title: "LDA: shared (pooled) covariance forces a straight-line boundary",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "class 0", color: "#4ea1ff", points: [[-1.5,0],[-2.1,0.5],[-0.9,0.5],[-1.5,0.7],[-1.5,-0.7],[-2.0,-0.4],[-1.0,-0.4]] },
        { name: "class 1", color: "#7ee787", points: [[2.0,0],[3.5,0],[0.5,0],[2.0,1.5],[2.0,-1.5],[4.5,1.0],[3.0,-1.3],[1.0,1.4]] }
      ],
      lines: [ { color: "#ffb454", dash: false, points: [[0.25,-3.5],[0.25,3.5]] } ],
      interpret: "Same two classes, but now both are forced to share one pooled covariance, so the orange boundary collapses to a straight vertical line at the midpoint between the means. Everything left is blue, everything right is green. This is the simpler, lower-variance model: prefer LDA when data is limited or the class spreads look similar, since a straight boundary needs far fewer parameters to estimate."
    },
    {
      type: "scatter",
      title: "QDA overfitting on too few points: a wobbly boundary chasing noise (illustrative)",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "class 0", color: "#4ea1ff", points: [[-1.5,0.2],[-1.8,1.0],[-1.2,-0.9]] },
        { name: "class 1", color: "#7ee787", points: [[2.0,0.1],[2.4,1.3],[1.6,-1.1]] }
      ],
      lines: [ { color: "#ff7b72", dash: false, points: [[-0.2,-3.5],[0.6,-2.0],[-0.4,-0.7],[0.7,0.3],[-0.3,1.4],[0.6,2.4],[-0.1,3.5]] } ],
      interpret: "Here QDA is fit on only three points per class, so each class covariance is estimated from almost nothing and the red boundary wiggles to wrap individual points. Recognise overfitting when the boundary is far more contorted than the data justifies — it will not generalise. The fix is to fall back to LDA (one pooled covariance) or regularise the covariance toward a simpler shape until you have enough data."
    }
  ]
};

window.CODEVIZ["cls-gaussian-process"] = {
  question: "How do you read a Gaussian-Process plot — what is the band, and what is it telling you?",
  charts: [
    {
      type: "line",
      title: "Healthy GP: band pinches at data, fans out between and beyond",
      xlabel: "x (input)",
      ylabel: "y (predicted output)",
      series: [
        { name: "posterior mean", color: "#4ea1ff", points: [[-5,-0.201],[-4,-0.838],[-3,-0.924],[-2,0.708],[-1.5,1.41],[-1,1.612],[0,1.096],[0.5,0.665],[1,0.062],[1.5,-0.654],[2,-1.159],[2.5,-1.091],[3,-0.45],[3.5,0.318],[4,0.734],[5,0.434]] },
        { name: "mean + 2 sigma", color: "#9aa7b4", points: [[-5,1.78],[-4,0.746],[-3,-0.489],[-2,1.451],[-1.5,1.845],[-1,2.499],[0,2.004],[0.5,1.101],[1,0.955],[1.5,0.493],[2,-0.329],[2.5,-0.661],[3,0.034],[3.5,0.749],[4,1.647],[5,2.299]] },
        { name: "mean - 2 sigma", color: "#9aa7b4", points: [[-5,-2.182],[-4,-2.422],[-3,-1.36],[-2,-0.035],[-1.5,0.975],[-1,0.725],[0,0.188],[0.5,0.229],[1,-0.831],[1.5,-1.801],[2,-1.99],[2.5,-1.522],[3,-0.934],[3.5,-0.112],[4,-0.18],[5,-1.431]] }
      ],
      interpret: "<b>Horizontal axis</b> is the input x; <b>vertical axis</b> is the predicted y. The <b>blue line</b> is the posterior mean (best guess); the two <b>grey lines</b> are mean plus and minus two standard deviations — the gap between them is the 95% uncertainty band. These are real numbers from the lesson's five data points (RBF kernel, length scale 1). Notice the grey lines <b>squeeze together</b> right at the training inputs (x = -3, -1.5, 0.5, 2.5, 3.5, where sigma drops to about 0.22) and <b>spread far apart</b> between points and out past x = +/- 4 (sigma near 1). <b>Conclusion:</b> the GP is confident where it has seen data and honestly admits doubt where it has not."
    },
    {
      type: "line",
      title: "Length scale too small: band snaps to zero at data, balloons everywhere else",
      xlabel: "x (input)",
      ylabel: "y (predicted output)",
      series: [
        { name: "posterior mean", color: "#4ea1ff", points: [[-5,0],[-4,0],[-3,-1.0],[-2.6,0],[-2,0],[-1.5,1.5],[-1.1,0],[-0.3,0],[0.5,0.7],[1.2,0],[2,0],[2.5,-1.2],[3,0],[3.5,0.4],[4,0],[5,0]] },
        { name: "mean + 2 sigma", color: "#ffb454", points: [[-5,2],[-4,2],[-3,-1.0],[-2.6,2],[-2,2],[-1.5,1.5],[-1.1,2],[-0.3,2],[0.5,0.7],[1.2,2],[2,2],[2.5,-1.2],[3,2],[3.5,0.4],[4,2],[5,2]] },
        { name: "mean - 2 sigma", color: "#ffb454", points: [[-5,-2],[-4,-2],[-3,-1.0],[-2.6,-2],[-2,-2],[-1.5,1.5],[-1.1,-2],[-0.3,-2],[0.5,0.7],[1.2,-2],[2,-2],[2.5,-1.2],[3,-2],[3.5,0.4],[4,-2],[5,-2]] }
      ],
      interpret: "Same axes (illustrative). The length scale is set far too short, so each data point only influences a tiny neighbourhood. The mean line <b>spikes to each point then drops straight back to the flat prior</b>, and the orange band collapses to the point at every observation but <b>jumps to full width the instant you step away</b>. <b>Recognise it</b> by a jagged mean that ignores the obvious trend between points, and an almost-everywhere-maximal band. <b>Fix:</b> increase the length scale (or learn it by maximising the marginal likelihood) so neighbouring points share information."
    },
    {
      type: "line",
      title: "Length scale too large / noise too low: over-smoothed, over-confident",
      xlabel: "x (input)",
      ylabel: "y (predicted output)",
      series: [
        { name: "posterior mean", color: "#4ea1ff", points: [[-5,0.45],[-4,0.42],[-3,0.4],[-2,0.36],[-1.5,0.34],[-1,0.32],[0,0.3],[0.5,0.29],[1,0.27],[1.5,0.26],[2,0.24],[2.5,0.22],[3,0.21],[3.5,0.2],[4,0.18],[5,0.15]] },
        { name: "mean + 2 sigma", color: "#ff7b72", points: [[-5,0.75],[-4,0.7],[-3,0.66],[-2,0.6],[-1.5,0.57],[-1,0.54],[0,0.5],[0.5,0.48],[1,0.45],[1.5,0.43],[2,0.4],[2.5,0.37],[3,0.35],[3.5,0.33],[4,0.3],[5,0.25]] },
        { name: "mean - 2 sigma", color: "#ff7b72", points: [[-5,0.15],[-4,0.14],[-3,0.14],[-2,0.12],[-1.5,0.11],[-1,0.1],[0,0.1],[0.5,0.1],[1,0.09],[1.5,0.09],[2,0.08],[2.5,0.07],[3,0.07],[3.5,0.07],[4,0.06],[5,0.05]] }
      ],
      interpret: "Same axes (illustrative). Now the length scale is too long, so the GP treats far-apart points as correlated and <b>flattens the curve into a nearly straight line</b> that misses the real wiggle in the data. The red band stays <b>thin everywhere</b> — even out past the data — because over-smoothing plus too-small assumed noise makes the model falsely sure. <b>Recognise it</b> by a mean that under-fits visibly and bars that do not widen where you have no observations. <b>Fix:</b> shorten the length scale and let the noise term be learned, so the band can grow honestly away from data."
    }
  ],
  caption: "Read a GP by its band: it should pinch shut at every data point and fan out where data is absent. A band that is jagged-everywhere means too short a length scale; a band that stays thin everywhere means over-smoothing and over-confidence.",
  code: `// GP posterior mean and 2-sigma band for the main chart (RBF kernel, 5 points).
const X = [-3, -1.5, 0.5, 2.5, 3.5], Y = [-1.0, 1.5, 0.7, -1.2, 0.4];
const ell = 1.0, noise = 0.05;
const k = (a,b) => Math.exp(-(a-b)*(a-b)/(2*ell*ell));
const n = X.length;
// build K + noise*I, then invert by Gauss-Jordan
let K = X.map((xi,i) => X.map((xj,j) => k(xi,xj) + (i===j?noise:0)));
let Inv = X.map((_,a) => X.map((__,b) => a===b?1:0));
for (let c=0;c<n;c++){
  const piv = K[c][c];
  for (let d=0;d<n;d++){ K[c][d]/=piv; Inv[c][d]/=piv; }
  for (let r=0;r<n;r++){ if(r===c) continue; const f=K[r][c];
    for (let e=0;e<n;e++){ K[r][e]-=f*K[c][e]; Inv[r][e]-=f*Inv[c][e]; } }
}
function predict(xt){
  const ks = X.map(xi => k(xt,xi));
  let mean=0; for(let a=0;a<n;a++){ let s=0; for(let b=0;b<n;b++) s+=Inv[a][b]*Y[b]; mean+=ks[a]*s; }
  let quad=0; for(let c=0;c<n;c++){ let t=0; for(let d=0;d<n;d++) t+=Inv[c][d]*ks[d]; quad+=ks[c]*t; }
  return { mean, sigma: Math.sqrt(Math.max(1e-6, k(xt,xt)-quad)) };  // sigma ~0.22 at data, ~1 far away
}
console.log(predict(0.5), predict(5));`
};

window.CODEVIZ["cls-bayesian-regression"] = {
  question: "How do you read a Bayesian-regression plot — what do the fanning lines and the band mean?",
  charts: [
    {
      type: "scatter",
      title: "Healthy posterior: lines tight over the data, fanning out beyond it",
      xlabel: "x (input)",
      ylabel: "y (target)",
      groups: [
        { name: "data", color: "#ffb454", points: [[-1,-0.6],[-0.5,0.1],[0.2,0.4],[0.9,1.0],[1.4,1.4],[2.0,1.9]] }
      ],
      lines: [
        { color: "#4ea1ff", dash: [], points: [[-2.5,-1.65],[3.5,3.04]] },
        { color: "#9aa7b4", dash: [5,4], points: [[-2.5,-0.942],[0,0.794],[2,2.416],[3.5,3.749]] },
        { color: "#9aa7b4", dash: [5,4], points: [[-2.5,-2.357],[0,-0.186],[2,1.319],[3.5,2.33]] }
      ],
      interpret: "<b>Horizontal axis</b> is the input x; <b>vertical axis</b> is the target y. Orange dots are the data. The <b>blue line</b> is the posterior-mean fit (intercept 0.30, slope 0.78, computed from these six points with prior precision alpha = 2). The two <b>grey dashed lines</b> are the 95% predictive band (mean plus/minus two standard deviations). The band is <b>narrowest in the middle</b> where the data sits and <b>widens toward both ends</b> — least-squares would give just one line with no band at all. <b>Conclusion:</b> the model reports a calibrated error bar that grows as you extrapolate away from the data."
    },
    {
      type: "scatter",
      title: "Prior too strong (large alpha): mean dragged toward flat, lines stay timid",
      xlabel: "x (input)",
      ylabel: "y (target)",
      groups: [
        { name: "data", color: "#ffb454", points: [[-1,-0.6],[-0.5,0.1],[0.2,0.4],[0.9,1.0],[1.4,1.4],[2.0,1.9]] }
      ],
      lines: [
        { color: "#ff7b72", dash: [], points: [[-2.5,-0.35],[3.5,1.15]] },
        { color: "#9aa7b4", dash: [5,4], points: [[-2.5,-0.05],[0,0.45],[3.5,1.45]] },
        { color: "#9aa7b4", dash: [5,4], points: [[-2.5,-0.65],[0,0.05],[3.5,0.85]] }
      ],
      interpret: "Same axes (illustrative). A very large prior precision alpha forces the weights toward zero, so the red mean line is <b>pulled toward a flat, near-zero-slope line</b> that under-fits the clear upward trend in the dots. The band is also pinched tight because the prior, not the data, is doing the talking. <b>Recognise it</b> by a fit that visibly misses the data while still claiming small error bars. <b>Fix:</b> lower alpha, or learn it from the data via the marginal likelihood so the prior stops over-regularising."
    },
    {
      type: "scatter",
      title: "Truth is curved: linear features under-fit, band stays misleadingly narrow",
      xlabel: "x (input)",
      ylabel: "y (target)",
      groups: [
        { name: "data", color: "#c89bff", points: [[-2,3.9],[-1,1.1],[-0.5,0.4],[0,0.1],[0.5,0.3],[1,1.2],[2,3.8]] }
      ],
      lines: [
        { color: "#ff7b72", dash: [], points: [[-2.5,1.55],[2.5,1.45]] },
        { color: "#9aa7b4", dash: [5,4], points: [[-2.5,2.25],[0,1.5],[2.5,2.15]] },
        { color: "#9aa7b4", dash: [5,4], points: [[-2.5,0.85],[0,0.5],[2.5,0.75]] }
      ],
      interpret: "Same axes (illustrative). The purple dots form a clear <b>U-shape</b>, but the model uses only linear features [1, x], so the red mean line is nearly flat and <b>cannot bend</b>. The grey band stays <b>narrow and confident</b> even though the fit is systematically wrong — the residuals are above the line at the ends and below it in the middle. <b>Recognise it</b> by a tight band sitting on top of an obviously curved pattern. <b>Fix:</b> add basis functions (polynomial or spline features); Bayesian regression is only linear in whatever features you feed it."
    }
  ],
  caption: "Read the band, not just the line: it should be tight where data is dense and fan out where data is sparse. A too-narrow band over a flat fit means the prior is too strong; a tight band over a curved pattern means your features are too simple.",
  code: `// Bayesian linear regression posterior for the main chart, features phi(x)=[1,x].
const X = [-1,-0.5,0.2,0.9,1.4,2.0], Y = [-0.6,0.1,0.4,1.0,1.4,1.9];
const alpha = 2.0, noise2 = 0.05, beta = 1/noise2;
// A = alpha*I + beta * Phi^T Phi ;  b = beta * Phi^T y
let A = [[alpha,0],[0,alpha]], bv = [0,0];
for (let i=0;i<X.length;i++){
  const p0=1, p1=X[i];
  A[0][0]+=beta*p0*p0; A[0][1]+=beta*p0*p1; A[1][0]+=beta*p1*p0; A[1][1]+=beta*p1*p1;
  bv[0]+=beta*p0*Y[i]; bv[1]+=beta*p1*Y[i];
}
const det = A[0][0]*A[1][1]-A[0][1]*A[1][0];               // invert 2x2 for S_N
const S = [[A[1][1]/det,-A[0][1]/det],[-A[1][0]/det,A[0][0]/det]];
const m = [S[0][0]*bv[0]+S[0][1]*bv[1], S[1][0]*bv[0]+S[1][1]*bv[1]]; // [0.30, 0.78]
// predictive std at x: sqrt(phi^T S phi + noise2) -> narrow at center, wide at edges
const predStd = x => Math.sqrt([1,x].reduce((s,pi,i)=>s+pi*[1,x].reduce((t,pj,j)=>t+S[i][j]*pj,0),0)+noise2);
console.log("intercept,slope", m, "std@0", predStd(0).toFixed(3), "std@3.5", predStd(3.5).toFixed(3));`
};

window.CODEVIZ["cls-gradient-boosting"] = {
  question: "Add trees one at a time, each fixing the last one's mistakes — when does the error stop dropping, and when does it start hurting?",
  caption: "Gradient boosting is a stagewise error curve. Read it by watching TWO lines: training error (always falls) and validation error (the one that decides when to stop).",
  charts: [
    {
      type: "line",
      title: "Healthy boosting: training error falls fast then flattens",
      xlabel: "boosting stage (number of trees)",
      ylabel: "training squared error",
      series: [
        { name: "training SSE (nu=0.5)", color: "#7ee787", points: [[0,73.2],[1,25.2],[2,11.0],[3,4.5],[4,2.7],[5,1.8],[6,1.5],[7,1.4],[8,1.4],[9,1.3],[10,1.3],[11,1.2],[12,1.2]] }
      ],
      interpret: "Real numbers, computed by running the lesson's own demo (target sin(x)+0.4x, 40 points, learning rate nu=0.5). The x-axis is how many trees we have added; the y-axis is the total squared error left on the training data. <b>Each new tree fits the leftover residual, so the error drops</b> — steeply at first (73 down to 4.5 in three stages), then it flattens near 1.2 because there is almost nothing left to fix. The flat tail is your cue: extra trees here add cost but no gain."
    },
    {
      type: "line",
      title: "Overfitting: train keeps falling but validation turns back up",
      xlabel: "boosting stage (number of trees)",
      ylabel: "squared error",
      series: [
        { name: "training error", color: "#7ee787", points: [[0,73],[2,20],[5,6],[10,2.5],[20,1.0],[40,0.4],[70,0.15],[120,0.05]] },
        { name: "validation error", color: "#ff7b72", points: [[0,75],[2,24],[5,10],[10,7],[20,6.2],[40,7.5],[70,11],[120,16]] }
      ],
      interpret: "Illustrative shapes (qualitatively honest). Two lines now: green is training error, red is held-out validation error. Early on both fall together. But after the dip around stage 20 the <b>red line turns back up while green keeps sliding toward zero</b> — the model is memorising training noise that does not generalise. The gap that opens between the lines is overfitting. <b>The right number of trees is the bottom of the red curve (~stage 20), not where green stops</b>; this is exactly what early stopping picks. Too many trees or a learning rate that is too high makes the red turn happen sooner and sharper."
    },
    {
      type: "line",
      title: "Underfit: learning rate too small / too few trees",
      xlabel: "boosting stage (number of trees)",
      ylabel: "training squared error",
      series: [
        { name: "training SSE (nu=0.1)", color: "#ffb454", points: [[0,73.2],[1,61.1],[2,51.2],[3,43.0],[4,36.3],[5,30.6],[6,26.0],[8,18.8],[10,13.7],[12,10.1]] },
        { name: "training SSE (nu=0.5, for contrast)", color: "#9aa7b4", points: [[0,73.2],[1,25.2],[2,11.0],[3,4.5],[4,2.7],[6,1.5],[8,1.4],[10,1.3],[12,1.2]] }
      ],
      interpret: "Real numbers from the same simulation, but with a tiny learning rate nu=0.1 (orange) versus nu=0.5 (grey, for contrast). Same axes as the first chart. With a small step, <b>each tree only nudges the model, so after 12 stages the error is still 10.1 — nowhere near the 1.2 the larger rate reached</b>. The orange curve is still visibly sloping down: it has not converged. This is underfitting from stopping too early. The fix is more trees (let it keep going) or a larger learning rate; a gently sloping, still-high curve means you have not trained enough, not that the model is too weak."
    },
    {
      type: "bars",
      title: "Where the error goes: residual shrinks each stage (nu=0.5)",
      labels: ["start", "after 1", "after 2", "after 3", "after 4", "after 6", "after 12"],
      values: [73.2, 25.2, 11.0, 4.5, 2.7, 1.5, 1.2],
      valueLabels: ["73.2", "25.2", "11.0", "4.5", "2.7", "1.5", "1.2"],
      colors: ["#9aa7b4", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#7ee787", "#7ee787"],
      interpret: "The same real training-error numbers as the first chart, shown as bars so you can see each stage's bite out of the error. Each bar is the leftover squared error after that many trees. <b>The first few trees do almost all the work</b> (73 to 4.5 in three trees); later bars barely shrink (green, near the floor). Read it as diminishing returns: most of the signal is captured early, and the long flat tail is why early stopping rarely costs you much accuracy but saves a lot of trees."
    }
  ],
  code:
    "// Stagewise training error for gradient boosting (squared loss).\n" +
    "// Target: y = sin(x) + 0.4x sampled at 40 points; weak learner = 1-split stump.\n" +
    "const X = [], Y = [];\n" +
    "for (let i = 0; i < 40; i++) { const x = -3 + 6 * i / 39; X.push(x); Y.push(Math.sin(x) + 0.4 * x); }\n" +
    "const nu = 0.5;                         // learning rate (shrinkage)\n" +
    "let F = X.map(() => 0);                  // current predictions, start at 0\n" +
    "\n" +
    "function fitStump(r) {                   // best single split minimizing SSE on residual r\n" +
    "  let best = null;\n" +
    "  for (let s = 1; s < X.length; s++) {\n" +
    "    const thr = (X[s - 1] + X[s]) / 2;\n" +
    "    let ls = 0, ln = 0, rs = 0, rn = 0;\n" +
    "    for (let i = 0; i < X.length; i++) { if (X[i] < thr) { ls += r[i]; ln++; } else { rs += r[i]; rn++; } }\n" +
    "    if (!ln || !rn) continue;\n" +
    "    const lm = ls / ln, rm = rs / rn;\n" +
    "    let sse = 0;\n" +
    "    for (let j = 0; j < X.length; j++) sse += (r[j] - (X[j] < thr ? lm : rm)) ** 2;\n" +
    "    if (!best || sse < best.sse) best = { thr, lm, rm, sse };\n" +
    "  }\n" +
    "  return best;\n" +
    "}\n" +
    "\n" +
    "for (let m = 0; m <= 12; m++) {\n" +
    "  let sse = 0;\n" +
    "  for (let i = 0; i < X.length; i++) sse += (Y[i] - F[i]) ** 2;\n" +
    "  console.log('stage ' + m + '  training SSE = ' + sse.toFixed(1));\n" +
    "  const r = Y.map((y, i) => y - F[i]);   // residual = negative gradient of squared loss\n" +
    "  const st = fitStump(r);                // fit a tree to the residual\n" +
    "  for (let i = 0; i < X.length; i++) F[i] += nu * (X[i] < st.thr ? st.lm : st.rm);  // F += nu*h\n" +
    "}\n" +
    "// 73.2, 25.2, 11.0, 4.5, 2.7, 1.8, 1.5, 1.4, 1.4, 1.3, 1.3, 1.2, 1.2"
};
