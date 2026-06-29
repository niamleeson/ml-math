/* Per-lesson CODE VISUALIZATIONS — 09-classical-b.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["cls-stacking"] = {
  question: "Does a learned combiner really beat each base model and a plain average?",
  code: `// Three base models predict a house price (true y = 300).
// A learned meta-model weights them; compare absolute errors.
const y = 300;
const base = [
  { name: "Tree",   z: 310, w: 0.5 },
  { name: "Linear", z: 290, w: 0.4 },
  { name: "kNN",    z: 330, w: 0.1 },
];
const avg = base.reduce((s, b) => s + b.z, 0) / base.length;   // 310
let stack = 0;
for (const b of base) stack += b.w * b.z;                       // 304
const absErr = (p) => Math.abs(p - y);
console.log("plain average:", avg, "err", absErr(avg));         // 310, err 10
console.log("learned stack:", stack, "err", absErr(stack));     // 304, err 4`,
  caption: "",
  charts: [
    {
      type: "bars",
      title: "Healthy stack: learned blend beats every base model and the average",
      labels: ["Tree", "Linear", "kNN", "Plain avg", "Learned stack"],
      values: [10, 10, 30, 10, 4],
      valueLabels: ["10", "10", "30", "10", "4"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#9aa7b4", "#7ee787"],
      interpret: "Each bar is the absolute prediction error (predicted minus true price of 300, sign dropped) in $k. The three blue bars are the base models, grey is the plain average, green is the learned stack. The learned combiner (error 4) is shorter than the plain average (error 10) because it can down-weight the worst model (kNN); a shorter green bar than every other bar is what a working stack looks like."
    },
    {
      type: "bars",
      title: "Correlated bases: stacking barely helps (illustrative)",
      labels: ["Tree A", "Tree B", "Tree C", "Plain avg", "Learned stack"],
      values: [9, 10, 11, 9, 8],
      valueLabels: ["9", "10", "11", "9", "8"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#9aa7b4", "#ffb454"],
      interpret: "Illustrative. Here the three base models are near-duplicates (three flavours of the same boosted tree), so they make the same mistakes. The green stack you hoped for is only the orange bar 8 versus the average 9 — a tiny gain. When the learned stack sits right next to the average and the base bars are all similar heights, your models lack diversity and stacking is wasted effort."
    },
    {
      type: "bars",
      title: "Leakage: great in-sample, worse out-of-sample (illustrative)",
      series: [
        { name: "In-sample (training)", color: "#7ee787", points: [["Tree", 9], ["Linear", 10], ["Plain avg", 9], ["Learned stack", 2]] },
        { name: "Out-of-sample (new data)", color: "#ff7b72", points: [["Tree", 11], ["Linear", 12], ["Plain avg", 11], ["Learned stack", 16]] }
      ],
      labels: ["Tree", "Linear", "Plain avg", "Learned stack"],
      interpret: "Illustrative. Green bars are error measured on data the base models already memorised; red bars are error on genuinely new data. The learned-stack green bar (2) looks amazing, but its red twin (16) is the worst of all — the meta-model trained on in-sample base predictions, so it learned noise. When the stack's training error is far below its new-data error, you have leakage; the fix is to train the meta-model on out-of-fold predictions."
    }
  ]
};

window.CODEVIZ["cls-anomaly"] = {
  question: "How does path length turn into an anomaly score, and what does a bad one look like?",
  code: `// Anomaly score s(x) = 2^(-E[h(x)] / c(n)), c(n) = typical depth.
const c = 4;                                  // typical path length
const score = (Eh) => Math.pow(2, -Eh / c);   // map path length -> (0,1)
console.log("normal  E[h]=5  ->", score(5).toFixed(2));   // 0.42  below 0.6 -> normal
console.log("outlier E[h]=1.5->", score(1.5).toFixed(2)); // 0.77  above 0.6 -> flag
// short path (few cuts) -> big score -> anomaly.
// curve s(E[h]) for the line chart:
for (let Eh = 0.5; Eh <= 7; Eh += 0.5) console.log(Eh, score(Eh).toFixed(3));`,
  caption: "",
  charts: [
    {
      type: "line",
      title: "Score curve: short isolation paths give high anomaly scores",
      xlabel: "average path length E[h(x)] (cuts to isolate)",
      ylabel: "anomaly score s(x)",
      series: [
        { name: "s(x) = 2^(-E[h]/4)", color: "#4ea1ff", points: [[0.5,0.917],[1,0.841],[1.5,0.771],[2,0.707],[3,0.595],[4,0.5],[5,0.420],[6,0.354],[7,0.297]] },
        { name: "threshold 0.6", color: "#9aa7b4", points: [[0.5,0.6],[7,0.6]] },
        { name: "outlier E[h]=1.5", color: "#ffb454", points: [[1.5,0.0],[1.5,0.771]] },
        { name: "normal E[h]=5", color: "#7ee787", points: [[5,0.0],[5,0.420]] }
      ],
      interpret: "The x-axis is how many random cuts it took to fence a point off (averaged over the forest); the y-axis is the resulting score in (0,1). The blue curve falls as path length grows, so few cuts (left) means a high score. The orange marker (outlier, 1.5 cuts) lands at 0.77 above the grey 0.6 threshold and is flagged; the green marker (normal, 5 cuts) sits at 0.42 below it. Read it as: the further left a point falls on this curve, the more anomalous."
    },
    {
      type: "hist",
      title: "Healthy: scores separate into a normal bulk and a high-score tail",
      labels: ["0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"],
      values: [40, 120, 180, 90, 12, 8, 6, 4],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ffb454", "#ffb454", "#ffb454", "#ffb454"],
      interpret: "Illustrative. Each bar counts how many points got a score in that bucket. The green bulk on the left is the normal traffic clustered well below the 0.6 threshold; the small orange tail on the right is the handful of genuine anomalies. A clear valley between the bulk and the tail means the threshold sits in empty space, so the cut is robust and you are not splitting a crowded region."
    },
    {
      type: "hist",
      title: "Wrong contamination: threshold cuts into the normal bulk (illustrative)",
      labels: ["0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"],
      values: [30, 90, 150, 130, 70, 25, 8, 4],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
      interpret: "Illustrative, same axes as above. Here there is no valley — the normal bulk spills right past 0.6, so the red region slices through ordinary points. Setting contamination too high pushes the threshold left into the crowd and floods you with false positives. When the histogram has no gap at the cut, do not trust a fixed threshold; rank by score and review the top slice instead."
    },
    {
      type: "scatter",
      title: "Diagonal structure axis-aligned cuts miss (illustrative)",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "normal (correlated)", color: "#4ea1ff", points: [[1,1.1],[2,1.9],[3,3.2],[4,3.8],[5,5.1],[6,5.9],[7,7.2],[2.5,2.6],[4.5,4.4],[5.5,5.6]] },
        { name: "true anomaly (off the line)", color: "#ff7b72", points: [[2,6],[6,2]] }
      ],
      interpret: "Illustrative. Both axes are raw features and the blue points lie along a diagonal band (the two features are correlated). The red points are anomalous only because they sit off that diagonal — each one's individual feature-1 and feature-2 values are perfectly ordinary. A standard Isolation Forest cuts one axis at a time, so it cannot fence off a point that is normal on every single axis; these diagonal outliers slip through. Use an Extended Isolation Forest with oblique cuts when anomalies live across a combination of features."
    }
  ]
};

window.CODEVIZ["cls-recommender"] = {
  question: "How does factoring a sparse ratings grid into two thin matrices fill in the blanks?",
  code: `// Matrix factorization: predict a blank rating as a dot product of
// a user's taste vector and an item's trait vector.
const U = { Ann:[0.9,0.2], Bo:[0.3,0.9], Cy:[0.6,0.6] };   // [comedy, action]
const V = { I1:[0.8,0.6], I2:[0.1,0.9], I3:[0.9,0.2], I4:[0.5,0.5] };
const dot = (a,b) => a[0]*b[0] + a[1]*b[1];
// Ann has never rated I4 -- predict it:
const pred = dot(U.Ann, V.I4);   // 0.9*0.5 + 0.2*0.5 = 0.55
console.log("predicted Ann x I4 =", pred.toFixed(2));`,
  caption: "A predicted rating is the dot product of a user's latent taste vector and an item's latent trait vector. The charts below show what a healthy factorization looks like and two situations you will actually meet.",
  charts: [
    {
      type: "heatmap",
      title: "Healthy reconstruction: dense grid, blanks filled by U.Vt",
      rows: ["Ann", "Bo", "Cy"],
      cols: ["I1", "I2", "I3", "I4"],
      matrix: [
        [0.84, 0.27, 0.85, 0.55],
        [0.78, 0.84, 0.45, 0.60],
        [0.84, 0.60, 0.66, 0.60]
      ],
      showVals: true,
      interpret: "Rows are users, columns are items, each cell is the predicted rating (real dot products of the two-factor vectors in the code, on a 0 to 1 scale). Brighter = higher predicted rating. Ann lights up on I1 and I3 (comedy-heavy items) because her taste vector is comedy-heavy; the model fills every blank, so you read off a recommendation by scanning a user's row for its brightest unrated cell."
    },
    {
      type: "heatmap",
      title: "Cold start: a brand-new user is one flat, useless row",
      rows: ["Ann", "Bo", "NewUser"],
      cols: ["I1", "I2", "I3", "I4"],
      matrix: [
        [0.84, 0.27, 0.85, 0.55],
        [0.78, 0.84, 0.45, 0.60],
        [0.50, 0.50, 0.50, 0.50]
      ],
      showVals: true,
      interpret: "Illustrative. The bottom row is a user with no ratings yet, so they have no learned factor vector and every cell collapses to the same flat value. A uniform, featureless row is the visual signature of cold start: the dot product cannot personalize without history, so you must fall back to popularity or onboarding questions until interactions arrive."
    },
    {
      type: "bars",
      title: "Popularity bias: predictions pile onto a few hit items",
      labels: ["I1 (hit)", "I2", "I3 (hit)", "I4", "I5", "I6"],
      values: [0.88, 0.31, 0.85, 0.28, 0.22, 0.19],
      colors: ["#ff7b72", "#9aa7b4", "#ff7b72", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      interpret: "Illustrative. Each bar is the average predicted rating an item receives across all users. A few popular items (red) tower over a long tail of near-zero bars. This skew is a warning sign: the model keeps recommending the same hits, those get more clicks, and the loop reinforces itself, so add diversity or debiasing before the catalog collapses to a handful of items."
    }
  ]
};

window.CODEVIZ["cls-tsne"] = {
  question: "Why does t-SNE use a heavy-tailed curve for the 2-D map, and what do its pictures actually mean?",
  code: `// The core trick: a heavy-tailed Student-t affinity for the 2-D map
// keeps far-apart clusters from crushing together.
const studentT = d => 1 / (1 + d*d);   // heavy tail
const gaussian = d => Math.exp(-d*d);  // crushes fast
for (const d of [1, 2, 3]) {
  console.log("d=" + d,
    "Student-t=" + studentT(d).toFixed(4),
    "Gaussian="  + gaussian(d).toFixed(5));
}
// d=3 -> Student-t 0.1000 vs Gaussian 0.00012: the heavy tail
// still gives a far pair real affinity, so clusters can spread out.`,
  caption: "The line chart shows the heavy-tail trick with real numbers; the scatters show how to read (and mis-read) the resulting maps.",
  charts: [
    {
      type: "line",
      title: "Heavy tail vs Gaussian: affinity as map distance grows",
      xlabel: "map distance d between two points",
      ylabel: "affinity (neighbor weight)",
      series: [
        { name: "Student-t (1+d^2)^-1", color: "#7ee787", points: [[0,1],[0.5,0.8],[1,0.5],[1.5,0.308],[2,0.2],[2.5,0.138],[3,0.1],[3.5,0.075],[4,0.059]] },
        { name: "Gaussian e^(-d^2)", color: "#ff7b72", points: [[0,1],[0.5,0.779],[1,0.368],[1.5,0.105],[2,0.0183],[2.5,0.00193],[3,0.00012],[3.5,0],[4,0]] }
      ],
      interpret: "X is the distance between two points on the 2-D map, Y is the affinity that distance produces (real values from the two formulas). The Gaussian (red) drops to near-zero by d=2, so it cannot tell 'far' from 'even farther' and crushes distant clusters into one blob. The Student-t (green) keeps a real, non-vanishing tail, so far pairs can sit at a large but finite gap and clusters separate cleanly."
    },
    {
      type: "scatter",
      title: "Healthy map: three well-separated blobs",
      xlabel: "t-SNE dimension 1 (no units)",
      ylabel: "t-SNE dimension 2 (no units)",
      groups: [
        { name: "class A", color: "#4ea1ff", points: [[1.0,5.0],[1.3,5.4],[0.8,4.7],[1.5,5.1],[1.1,4.6],[0.7,5.3]] },
        { name: "class B", color: "#7ee787", points: [[6.0,5.2],[6.3,4.8],[5.7,5.5],[6.4,5.0],[5.9,4.6],[6.1,5.6]] },
        { name: "class C", color: "#ffb454", points: [[3.5,1.2],[3.8,0.8],[3.2,1.5],[3.9,1.1],[3.4,0.7],[3.6,1.6]] }
      ],
      interpret: "Each point is one high-D example squashed to 2-D; color is its true label. Three tight, well-separated blobs is the result you hope for: points that were neighbors in high-D stayed neighbors here. Read it as 'the classes are distinguishable' -- but do NOT read the gap sizes or blob areas as real, t-SNE distorts both."
    },
    {
      type: "scatter",
      title: "Hallucinated clusters: random noise carved into fake blobs",
      xlabel: "t-SNE dimension 1 (no units)",
      ylabel: "t-SNE dimension 2 (no units)",
      groups: [
        { name: "all one true class", color: "#9aa7b4", points: [[1.0,5.0],[1.3,5.4],[0.8,4.7],[6.0,5.2],[6.3,4.8],[5.7,5.5],[3.5,1.2],[3.8,0.8],[3.2,1.5]] }
      ],
      interpret: "Illustrative. Every point here is the SAME true class (one grey color), yet t-SNE has still split structureless data into three neat-looking blobs. This is the trap: t-SNE will happily manufacture clusters from noise. The lesson -- always check apparent blobs against labels or a clustering metric, and trust only structure that survives different perplexity values and random seeds."
    },
    {
      type: "scatter",
      title: "Perplexity too low: real clusters shatter into specks",
      xlabel: "t-SNE dimension 1 (no units)",
      ylabel: "t-SNE dimension 2 (no units)",
      groups: [
        { name: "class A", color: "#4ea1ff", points: [[1.0,5.0],[2.2,4.6],[0.6,3.4],[3.1,5.5]] },
        { name: "class B", color: "#7ee787", points: [[6.0,5.2],[4.9,3.9],[6.8,4.3],[5.3,5.8]] },
        { name: "class C", color: "#ffb454", points: [[3.5,1.2],[2.4,1.9],[4.6,0.7],[3.0,2.6]] }
      ],
      interpret: "Illustrative. Same three classes as the healthy map, but with perplexity set too low the same-colored points scatter into tiny fragments instead of cohesive blobs. When real groups fracture into specks like this, suspect the perplexity (or too few neighbors), not the data: raise perplexity (try 5 to 50) and keep only the structure that is stable across settings."
    }
  ]
};

window.CODEVIZ["cls-factor-analysis"] = {
  question: "How do you READ a factor-loading chart, and how do you spot when the factors are trustworthy?",
  charts: [
    {
      type: "bars",
      title: "Ideal: Factor 1 loadings on six real wine chemistry signals",
      labels: ["alcohol", "malic acid", "phenols", "flavanoids", "color", "proline"],
      values: [0.33, -0.4, 0.89, 0.97, -0.1, 0.57],
      colors: ["#9aa7b4", "#9aa7b4", "#7ee787", "#7ee787", "#9aa7b4", "#7ee787"],
      interpret: "Real FactorAnalysis on the 178-bottle wine set. Each bar is how strongly one measured signal responds to hidden Factor 1 (its <b>loading</b>); bar height (and sign) is the response. Two bars tower above the rest, phenols (+0.89) and flavanoids (+0.97), so Factor 1 is a <b>polyphenol axis</b>: a wine high on this hidden cause is high on both. Read a loading chart by naming the factor from its big bars and ignoring the small grey ones near zero (no real response)."
    },
    {
      type: "bars",
      title: "Variant A (illustrative): one general factor, all loadings positive",
      labels: ["test 1", "test 2", "test 3", "test 4", "test 5", "test 6"],
      values: [0.72, 0.68, 0.81, 0.64, 0.77, 0.7],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
      interpret: "Illustrative shape for the classic 'g' factor: every signal loads positive and similar, so one hidden cause lifts them all together. When you see this, the factor is a single shared driver, here 'general ability' across test scores. A flat all-positive bank of bars is the signature of one dominant common factor; all the between-signal correlation rides on it."
    },
    {
      type: "bars",
      title: "Variant B (illustrative): weak loadings, no factor really emerges",
      labels: ["sig 1", "sig 2", "sig 3", "sig 4", "sig 5", "sig 6"],
      values: [0.18, -0.12, 0.09, 0.21, -0.15, 0.11],
      colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
      interpret: "Illustrative failure case: every bar hugs zero (all under about 0.25). No signal responds strongly, so this 'factor' explains almost nothing, the signals were nearly uncorrelated to begin with. When a loading chart looks like flat noise, do not name or trust the factor; you likely asked for too many factors or the data has no shared structure to find."
    },
    {
      type: "bars",
      title: "Variant C (illustrative): scree of variance explained per factor",
      labels: ["F1", "F2", "F3", "F4", "F5", "F6"],
      values: [3.1, 1.4, 0.4, 0.3, 0.2, 0.15],
      valueLabels: ["3.1", "1.4", "0.4", "0.3", "0.2", "0.15"],
      colors: ["#7ee787", "#7ee787", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      interpret: "Illustrative scree plot for picking how many factors to keep. Each bar is the variance one factor explains, sorted big to small. There is a sharp <b>elbow</b> after F2: the first two bars are tall, then it flattens into rubble. Keep the factors before the elbow (here 2) and drop the flat tail, those just fit noise. The elbow is how you avoid choosing too many factors."
    }
  ],
  caption: "Read loadings by their tall bars (the factor's meaning); read a scree plot by its elbow (how many factors to keep). Healthy factors have a few big loadings; an all-near-zero chart means no real factor.",
  code: `import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import FactorAnalysis

wine = load_wine()                       # 178 real wines, 13 chemistry features
idx = [0, 1, 5, 6, 9, 12]
names = ["alcohol", "malic acid", "phenols", "flavanoids", "color", "proline"]
X = StandardScaler().fit_transform(wine.data)[:, idx]

fa = FactorAnalysis(n_components=2, random_state=0).fit(X)
loadings = fa.components_[0]              # Factor 1 loadings across six signals

colors = ["#7ee787" if abs(v) > 0.5 else "#9aa7b4" for v in loadings]
plt.bar(names, loadings, color=colors)
plt.axhline(0, color="#9aa7b4", linewidth=1)
plt.title("Factor 1 loadings across six wine chemistry signals")
plt.ylabel("loading")
plt.tick_params(axis="x", rotation=45)
plt.show()`
};

window.CODEVIZ["cls-svr"] = {
  question: "How do you READ an SVR plot, and how does the wrong tube width or kernel show up in the picture?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: SVR fit on real diabetes data with a well-sized tube",
      xlabel: "BMI (standardized)",
      ylabel: "disease progression",
      groups: [
        { name: "patients", color: "#4ea1ff", points: [[-0.09,94],[-0.07,158],[-0.063,65],[-0.05,75],[-0.046,114],[-0.04,78],[-0.033,94],[-0.031,55],[-0.03,160],[-0.02,111],[-0.011,168],[-0.001,292],[0.007,67],[0.014,220],[0.019,265],[0.03,244],[0.046,175],[0.06,263],[0.069,277],[0.077,332],[0.093,200],[0.127,308],[0.171,242]] }
      ],
      lines: [
        { name: "SVR fit", color: "#7ee787", points: [[-0.09,85],[-0.05,95],[-0.01,132],[0.03,197],[0.07,224],[0.11,273],[0.15,295],[0.171,267]] },
        { name: "tube upper", color: "#ffb454", dash: true, points: [[-0.09,135],[-0.05,145],[-0.01,182],[0.03,247],[0.07,274],[0.11,323],[0.15,345],[0.171,317]] },
        { name: "tube lower", color: "#ffb454", dash: true, points: [[-0.09,35],[-0.05,45],[-0.01,82],[0.03,147],[0.07,174],[0.11,223],[0.15,245],[0.171,217]] }
      ],
      interpret: "Real diabetes data (442 patients). The x-axis is body-mass index, the y-axis is one-year disease progression. The green line is the SVR fit; the amber dashed lines are the <b>epsilon-tube</b> of forgiveness around it. Read it like this: points <i>inside</i> the tube cost nothing, points <i>outside</i> are the <b>support vectors</b> that pull the line. A healthy fit tracks the rising trend while leaving the bulk of the noisy points inside the band."
    },
    {
      type: "scatter",
      title: "Variant A (illustrative): epsilon too small, tube chases noise",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "data", color: "#4ea1ff", points: [[0.5,1.6],[1,1.4],[1.5,2.4],[2,2.1],[2.5,3.6],[3,3.0],[3.5,4.6],[4,3.8],[4.5,5.3],[5,4.7]] }
      ],
      lines: [
        { name: "wiggly fit", color: "#ff7b72", points: [[0.5,1.6],[1,1.4],[1.5,2.4],[2,2.1],[2.5,3.6],[3,3.0],[3.5,4.6],[4,3.8],[4.5,5.3],[5,4.7]] },
        { name: "tube upper", color: "#ffb454", dash: true, points: [[0.5,1.8],[5,4.9]] },
        { name: "tube lower", color: "#ffb454", dash: true, points: [[0.5,1.4],[5,4.5]] }
      ],
      interpret: "Illustrative. The tube is so thin that almost every point sits outside it, so nearly all points become support vectors and the red line bends to touch each one, tracking the noise instead of the trend. Recognise it by a fit that <b>wiggles through every dot</b> and a pencil-thin band. Cure: raise epsilon so small jitter is forgiven."
    },
    {
      type: "scatter",
      title: "Variant B (illustrative): epsilon too large, model underfits",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "data", color: "#4ea1ff", points: [[0.5,1.6],[1,1.4],[1.5,2.4],[2,2.1],[2.5,3.6],[3,3.0],[3.5,4.6],[4,3.8],[4.5,5.3],[5,4.7]] }
      ],
      lines: [
        { name: "flat fit", color: "#ff7b72", points: [[0.5,3.1],[5,3.3]] },
        { name: "tube upper", color: "#ffb454", dash: true, points: [[0.5,5.3],[5,5.5]] },
        { name: "tube lower", color: "#ffb454", dash: true, points: [[0.5,0.9],[5,1.1]] }
      ],
      interpret: "Illustrative. The tube is so wide that <b>every</b> point falls inside it, so no point is a support vector and nothing pulls the line, it stays nearly flat and ignores the real upward slope. Recognise it by a giant band swallowing all the data and a lazy, near-horizontal fit. Cure: shrink epsilon so genuine trend points poke outside the tube."
    },
    {
      type: "scatter",
      title: "Variant C (illustrative): gamma too high, RBF kernel overfits",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "data", color: "#4ea1ff", points: [[0.5,1.6],[1,1.4],[1.5,2.4],[2,2.1],[2.5,3.6],[3,3.0],[3.5,4.6],[4,3.8],[4.5,5.3],[5,4.7]] }
      ],
      lines: [
        { name: "spiky fit", color: "#ff7b72", points: [[0.5,1.6],[0.9,1.5],[1,1.4],[1.4,1.5],[1.5,2.4],[1.9,2.2],[2,2.1],[2.4,3.5],[2.5,3.6],[2.9,3.1],[3,3.0],[3.4,4.5],[3.5,4.6],[3.9,3.9],[4,3.8],[4.4,5.2],[4.5,5.3],[4.9,4.8],[5,4.7]] }
      ],
      interpret: "Illustrative. Here the tube width is fine but the RBF kernel width gamma is too large, so each point's influence is razor-narrow. The fit forms a <b>spike at every point</b> and collapses to a flat baseline between them. Recognise it by sharp bumps over data points with dead-flat gaps in between. Cure: lower gamma so neighbouring points share influence and the curve smooths out."
    }
  ],
  caption: "Read an SVR plot by the tube: inside points are free, outside points (support vectors) bend the line. A pencil-thin tube means epsilon too small (chases noise); a band swallowing all data means epsilon too large (underfit); spikes over each point mean gamma too high.",
  code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.svm import SVR

db = load_diabetes()                     # 442 real patients
x = db.data[:, 2]                        # BMI feature (standardized)
y = db.target                            # disease progression after one year
order = np.argsort(x); x, y = x[order], y[order]

eps = 25.0
svr = SVR(kernel="rbf", C=1000.0, epsilon=eps, gamma="scale").fit(x.reshape(-1, 1), y)
grid = np.linspace(x.min(), x.max(), 200).reshape(-1, 1)
fit = svr.predict(grid)

plt.scatter(x, y, c="#4ea1ff", s=12, label="patients")
plt.plot(grid[:, 0], fit, c="#7ee787", label="SVR fit")
plt.plot(grid[:, 0], fit + eps, "--", c="#ffb454", label="tube upper")
plt.plot(grid[:, 0], fit - eps, "--", c="#ffb454", label="tube lower")
plt.title("SVR fit of disease progression vs BMI with the epsilon-tube")
plt.xlabel("BMI (standardized)")
plt.ylabel("disease progression")
plt.legend()
plt.show()`
};

window.CODEVIZ["cls-bandits"] = {
  question: "Across three ad creatives, does UCB beat random rotation, and how do you spot a bandit that got stuck on a false favorite?",
  charts: [
    {
      type: "line",
      title: "Ideal: cumulative clicks over 2000 impressions (UCB1 vs random rotation)",
      xlabel: "impression",
      ylabel: "cumulative clicks",
      series: [
        { name: "UCB1", color: "#7ee787", points: [[0,0.0],[80,8.0],[160,18.0],[240,24.0],[320,32.0],[400,41.0],[480,46.0],[560,49.0],[640,59.0],[720,71.0],[800,78.0],[880,87.0],[960,97.0],[1040,106.0],[1120,119.0],[1200,130.0],[1280,140.0],[1360,158.0],[1440,167.0],[1520,179.0],[1600,186.0],[1680,201.0],[1760,208.0],[1840,228.0],[1920,237.0],[1999,254.0]] },
        { name: "random rotation", color: "#9aa7b4", points: [[0,0.0],[80,5.0],[160,12.0],[240,28.0],[320,32.0],[400,38.0],[480,45.0],[560,52.0],[640,60.0],[720,67.0],[800,72.0],[880,81.0],[960,90.0],[1040,107.0],[1120,114.0],[1200,120.0],[1280,130.0],[1360,138.0],[1440,147.0],[1520,160.0],[1600,168.0],[1680,178.0],[1760,186.0],[1840,191.0],[1920,205.0],[1999,212.0]] }
      ],
      interpret: "The x-axis is how many ads have been shown; the y-axis is total clicks earned so far (higher is better). Early on both lines rise together because UCB is still sampling every arm. As evidence builds, the green UCB line bends <b>upward and away</b> from the grey random line and finishes ahead (254 vs 212 clicks) — that growing gap is the reward UCB earns by shifting traffic to the winner instead of splitting it evenly. A healthy bandit looks like this: it matches the baseline at first, then pulls ahead."
    },
    {
      type: "line",
      title: "Read this one: cumulative regret (lost clicks vs always picking the best arm)",
      xlabel: "impression",
      ylabel: "cumulative regret (clicks missed)",
      series: [
        { name: "UCB1 (sub-linear, good)", color: "#7ee787", points: [[0,0.1],[80,4.0],[160,7.7],[240,11.0],[320,14.0],[400,17.3],[480,20.6],[560,23.8],[640,26.5],[720,27.9],[800,30.2],[880,34.8],[960,37.9],[1040,41.5],[1120,43.1],[1200,45.0],[1280,48.5],[1360,48.8],[1440,50.6],[1520,55.7],[1600,57.9],[1680,58.7],[1760,61.3],[1840,61.8],[1920,62.6],[1999,62.6]] },
        { name: "random (linear)", color: "#9aa7b4", points: [[0,0.1],[80,4.3],[160,8.7],[240,13.0],[320,17.2],[400,21.5],[480,25.8],[560,30.3],[640,33.6],[720,38.3],[800,42.3],[880,46.5],[960,50.9],[1040,55.0],[1120,58.8],[1200,63.4],[1280,67.0],[1360,71.2],[1440,76.4],[1520,80.5],[1600,85.1],[1680,89.4],[1760,93.6],[1840,98.6],[1920,102.8],[1999,107.3]] },
        { name: "greedy stuck on false favorite (linear, worst)", color: "#ff7b72", points: [[0,0.1],[80,8.0],[160,16.0],[240,24.0],[320,32.0],[400,40.0],[480,48.0],[560,56.0],[640,64.0],[720,72.0],[800,80.0],[880,88.0],[960,96.0],[1040,104.0],[1120,112.0],[1200,120.0],[1280,128.0],[1360,136.0],[1440,144.0],[1520,152.0],[1600,160.0],[1680,168.0],[1760,176.0],[1840,184.0],[1920,192.0],[1999,199.9]] }
      ],
      interpret: "Regret is the gold-standard bandit diagnostic: at each step it adds up the clicks you <i>would have</i> earned by always showing the true-best ad, minus what you actually earned — so lower and flatter is better, and zero is perfect. The healthy UCB curve (green) <b>bends over and flattens</b> (sub-linear): once it has found the winner it stops losing ground. A <b>straight line</b> means a fixed per-step loss that never improves: random (grey) explores forever, and a pure-greedy run that locked onto a false favorite (red) is the worst — its slope is steepest because it keeps serving a bad arm with full confidence. Read the shape: flattening = learning; straight = not learning."
    },
    {
      type: "bars",
      title: "Healthy allocation: impressions UCB1 served per ad (true CTR 0.06 / 0.10 / 0.16)",
      labels: ["Ad A: 6% CTR", "Ad B: 10% CTR", "Ad C: 16% CTR (best)"],
      values: [361, 442, 1197],
      colors: ["#9aa7b4", "#4ea1ff", "#7ee787"],
      interpret: "Each bar is how many of the 2000 impressions UCB sent to that ad. A healthy bandit puts the <b>tallest bar on the truly best arm</b> (green, Ad C got 1197) while still giving the weaker arms a few hundred pulls each — that residual traffic is exploration, the insurance that you did not crown the wrong winner by luck. This skew toward the best arm is exactly what produced the upward bend in the first chart."
    },
    {
      type: "bars",
      title: "Failure to recognise: greedy stuck on a false favorite",
      labels: ["Ad A: 6% CTR (false favorite)", "Ad B: 10% CTR", "Ad C: 16% CTR (best)"],
      values: [1998, 1, 1],
      colors: ["#ff7b72", "#9aa7b4", "#9aa7b4"],
      interpret: "Illustrative of a real failure mode: a pure-greedy rule (no exploration bonus) got a lucky early click on the worst ad, decided it was the winner, and poured <b>nearly all 2000 impressions into it</b> (red) while the genuinely best ad got pulled once and never revisited. Recognise this pattern by the single dominant bar sitting on a <i>weak</i> arm and near-zero traffic everywhere else — it is why greedy's regret line above is a steep straight line. The fix is the UCB bonus (or epsilon-greedy / Thompson sampling), which forces under-tried arms to be sampled before being written off."
    },
    {
      type: "line",
      title: "Why the bonus shrinks: exploration term sqrt(2 ln t / n) vs pulls (at t = 1000)",
      xlabel: "times this arm has been pulled, n",
      ylabel: "exploration bonus added to the average",
      series: [
        { name: "bonus = sqrt(2 ln 1000 / n)", color: "#ffb454", points: [[1,3.717],[2,2.628],[5,1.662],[10,1.175],[20,0.831],[40,0.588],[80,0.416],[160,0.294],[320,0.208],[640,0.147],[1000,0.118]] }
      ],
      interpret: "X is how many times one arm has been pulled; Y is the optimism bonus UCB adds on top of that arm's measured average (real values of sqrt(2 ln t / n) at round t = 1000). The first pull earns a huge bonus (about 3.7) — UCB is shouting 'we barely know this arm, try it!' — but the curve plunges as pulls accumulate, reaching about 0.1 after 1000 pulls. That decay is the engine of UCB: under-tried arms get a big benefit-of-the-doubt that forces exploration, and well-tried arms fall back to being judged on their average alone (pure exploitation)."
    }
  ],
  caption: "Three ad creatives with click-through rates 6% / 10% / 16%. UCB1 finds that the carousel (Ad C) wins and routes most traffic there, finishing with 254 clicks vs 212 for blind random rotation. Read the regret curve to judge any bandit: flattening means it learned; a straight line means it is stuck.",
  code: `import numpy as np
import matplotlib.pyplot as plt

ads = ["Ad A: blue banner", "Ad B: video", "Ad C: carousel"]
true_ctr = np.array([0.06, 0.10, 0.16])  # real-looking click-through rates
K, T = len(true_ctr), 2000

def run(strategy, seed):
    rng = np.random.default_rng(seed)
    sums = np.zeros(K); counts = np.zeros(K); cum = []; total = 0.0
    for t in range(T):
        if t < K:
            arm = t                          # pull each arm once to start
        elif strategy == "ucb":
            mean = sums / counts
            arm = int(np.argmax(mean + np.sqrt(2 * np.log(t) / counts)))
        else:                                # random rotation baseline
            arm = int(rng.integers(K))
        r = float(rng.random() < true_ctr[arm])
        sums[arm] += r; counts[arm] += 1; total += r; cum.append(total)
    return np.array(cum), counts.astype(int)

ucb_cum, ucb_counts = run("ucb", 0)
rnd_cum, _ = run("random", 1)

fig, ax = plt.subplots(1, 2, figsize=(11, 4))
ax[0].plot(np.arange(T), ucb_cum, c="#7ee787", label="UCB1")
ax[0].plot(np.arange(T), rnd_cum, c="#9aa7b4", label="random")
ax[0].set_title("Cumulative clicks: UCB vs random rotation")
ax[0].set_xlabel("impression"); ax[0].set_ylabel("cumulative clicks"); ax[0].legend()
ax[1].bar(ads, ucb_counts, color=["#9aa7b4", "#4ea1ff", "#7ee787"])
ax[1].set_title("Impressions served per ad by UCB1")
ax[1].tick_params(axis="x", rotation=20)
plt.show()`
};
