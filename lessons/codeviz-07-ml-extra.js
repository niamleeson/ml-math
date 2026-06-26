/* Per-lesson CODE VISUALIZATIONS — 07-ml-extra.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["mlx-newton"] = {
  question: "How fast does each method reach the minimum — and when does Newton go wrong?",
  code: `// J(theta) = 3 theta^2 - 12 theta + 7. Slope 6 theta - 12, curvature 6.
function Jp(t){ return 6*t - 12; }
const Jpp = 6;            // constant curvature
let t = 5;               // start
// Newton: one exact step to the bottom
const newton = [t];
t = t - Jp(t)/Jpp;       // 5 - 18/6 = 2
newton.push(t);          // [5, 2]  -> slope at 2 is 0, done
// Gradient descent, alpha = 0.1, crawls toward 2
let g = 5; const gd = [g];
for (let i = 0; i < 12; i++){ g = g - 0.1*Jp(g); gd.push(g); }
console.log("newton steps:", newton.length - 1);   // 1
console.log("gd dist after 5:", Math.abs(gd[5]-2).toFixed(3));`,
  charts: [
    {
      type: "line",
      title: "Ideal: distance to the minimum vs step number",
      xlabel: "step number",
      ylabel: "distance to minimum |theta - 2|",
      series: [
        { name: "Newton", color: "#c89bff", points: [[0,3],[1,0],[2,0],[3,0],[4,0],[5,0]] },
        { name: "gradient descent (alpha=0.1)", color: "#ffb454", points: [[0,3],[1,1.2],[2,0.48],[3,0.192],[4,0.0768],[5,0.0307]] }
      ],
      interpret: "<b>x</b> is how many steps you have taken; <b>y</b> is how far the current guess is from the true minimum at theta=2 (0 means you are there). The <b>purple</b> Newton line drops straight to 0 at step 1 and stays there: for a parabola, dividing the slope by the curvature lands exactly at the bottom in one jump. The <b>orange</b> gradient-descent line shrinks by 60% each step but never quite hits 0 — many cautious steps for the same answer. Real numbers from J(theta)=3theta^2-12theta+7, start theta0=5."
    },
    {
      type: "line",
      title: "Healthy variant: quadratic convergence on a smooth (non-parabola) cost",
      xlabel: "step number",
      ylabel: "error |theta - theta*| (log-ish scale)",
      series: [
        { name: "Newton", color: "#7ee787", points: [[0,1],[1,0.1],[2,0.001],[3,1e-7],[4,1e-15]] }
      ],
      interpret: "Illustrative. For a smooth cost that is only locally parabola-like, Newton still wins but takes more than one step. Read the steep cliff: the error roughly <b>squares</b> each step (1, 0.1, 0.001, ...), so the number of correct digits doubles every step — that is <b>quadratic convergence</b>. Green = the behaviour you want: a few steps to machine precision."
    },
    {
      type: "line",
      title: "Failure: overshoot / divergence when started far on a non-convex cost",
      xlabel: "step number",
      ylabel: "error |theta - theta*|",
      series: [
        { name: "Newton (diverging)", color: "#ff7b72", points: [[0,2],[1,3.5],[2,6],[3,11],[4,20]] }
      ],
      interpret: "Illustrative. Here the error <b>grows</b> instead of shrinking — the line climbs away from 0. Pure Newton trusts its local parabola completely, so far from the optimum (or where the cost is non-convex) the step can overshoot and blow up. Recognise it by a curve that heads up and to the right. The fix is a <b>line search</b> or step-size backtracking so every step actually lowers the cost."
    },
    {
      type: "line",
      title: "Failure: negative curvature sends the step uphill (toward a saddle)",
      xlabel: "parameter theta",
      ylabel: "cost J(theta)",
      series: [
        { name: "cost (has a hump)", color: "#9aa7b4", points: [[-3,1],[-2,3],[-1,4.2],[0,4.5],[1,4.2],[2,3],[3,1]] },
        { name: "Newton step direction", color: "#ff7b72", points: [[-0.5,4.45],[1.5,3.6]] }
      ],
      interpret: "Illustrative. The grey curve bends <b>downward</b> here (a hill, not a bowl) so the curvature (Hessian) is negative. Newton divides the slope by that negative curvature, which flips the sign: the red arrow points <b>away</b> from the dip and toward the flat top of the hump — a saddle, not a minimum. Whenever the Hessian is not positive-definite, add damping (a lambda*I ridge) or use a trust region so the step stays pointed downhill."
    }
  ]
};

window.CODEVIZ["mlx-lwr"] = {
  question: "How does the bandwidth tau decide whether the local fit is just right, too wiggly, or too flat?",
  code: `// Locally weighted regression: at each query x, fit a line weighting
// nearby points with a Gaussian bell of width tau.
const data = [];
for (let i = 0; i < 28; i++){
  const x = i/27*10 - 5;                        // x in [-5,5]
  const y = Math.sin(x) + 0.25*x;               // underlying signal
  data.push([x, y]);
}
function predict(xq, tau){
  let Sw=0,Swx=0,Swy=0,Swxx=0,Swxy=0;
  for (const [x,y] of data){
    const w = Math.exp(-((x-xq)*(x-xq))/(2*tau*tau));   // bell weight
    Sw+=w; Swx+=w*x; Swy+=w*y; Swxx+=w*x*x; Swxy+=w*x*y;
  }
  const det = Sw*Swxx - Swx*Swx;
  const b = (Swxx*Swy - Swx*Swxy)/det;          // intercept
  const m = (Sw*Swxy - Swx*Swy)/det;            // slope
  return m*xq + b;
}
console.log("fit at x=0, tau=0.9:", predict(0, 0.9).toFixed(2));`,
  charts: [
    {
      type: "scatter",
      title: "Good tau: the local fit follows the real bend",
      xlabel: "input x",
      ylabel: "target y",
      groups: [
        { name: "training data", color: "#4ea1ff", points: [[-5,-0.29],[-3.5,-1.22],[-2,-1.41],[-1,-1.09],[0,0],[1,1.09],[2,1.41],[3,1.16],[3.5,0.52],[4.3,0.14],[5,0.29]] }
      ],
      lines: [
        { color: "#7ee787", dash: [], points: [[-5,-0.3],[-3.5,-1.15],[-2,-1.4],[-1,-1.05],[0,0.02],[1,1.05],[2,1.4],[3,1.2],[4,0.6],[5,0.3]] }
      ],
      interpret: "<b>x</b> is the input, <b>y</b> the target; blue dots are training points from y = sin(x) + 0.25x. The <b>green</b> curve is LWR with a sensible bandwidth tau=0.9: at every x it fits a fresh line, weighting nearby dots most. Read it as a smooth thread that <b>passes through the trend</b> of the dots without darting at each one — this is the sweet spot between wiggly and flat."
    },
    {
      type: "scatter",
      title: "Too small tau: the curve chases every point (overfit)",
      xlabel: "input x",
      ylabel: "target y",
      groups: [
        { name: "training data", color: "#4ea1ff", points: [[-5,-0.29],[-3.5,-1.22],[-2,-1.41],[-1,-1.09],[0,0],[1,1.09],[2,1.41],[3,1.16],[3.5,0.52],[4.3,0.14],[5,0.29]] }
      ],
      lines: [
        { color: "#ff7b72", dash: [], points: [[-5,-0.29],[-4.2,-0.8],[-3.5,-1.22],[-2.8,-1.0],[-2,-1.41],[-1.4,-1.0],[-1,-1.09],[-0.4,-0.5],[0,0],[0.5,0.6],[1,1.09],[1.6,1.0],[2,1.41],[2.6,1.3],[3,1.16],[3.5,0.52],[4.3,0.14],[5,0.29]] }
      ],
      interpret: "Illustrative. Same dots, but tau is tiny so only the very nearest point counts at each query. The <b>red</b> curve zig-zags through nearly every dot, including the random ups and downs. Recognise overfitting by a fit that is <b>too jumpy</b> to be the real signal: it has memorised the noise. Cure: increase tau so more neighbours vote and the curve smooths out."
    },
    {
      type: "scatter",
      title: "Too large tau: the fit flattens into one straight line (underfit)",
      xlabel: "input x",
      ylabel: "target y",
      groups: [
        { name: "training data", color: "#4ea1ff", points: [[-5,-0.29],[-3.5,-1.22],[-2,-1.41],[-1,-1.09],[0,0],[1,1.09],[2,1.41],[3,1.16],[3.5,0.52],[4.3,0.14],[5,0.29]] }
      ],
      lines: [
        { color: "#ffb454", dash: [], points: [[-5,-0.7],[5,0.7]] }
      ],
      interpret: "Illustrative. Now tau is huge, so the weights are almost equal everywhere and every local line is the same global line. The <b>orange</b> line is nearly straight and misses the clear hump-and-dip in the dots. Recognise underfitting when the fit is <b>too simple</b> to track the visible shape. Cure: shrink tau so the fit can bend locally. Pick tau by cross-validation, not by eye."
    },
    {
      type: "scatter",
      title: "Edge effect: unreliable extrapolation past the data",
      xlabel: "input x",
      ylabel: "target y",
      groups: [
        { name: "training data", color: "#4ea1ff", points: [[-5,-0.29],[-3.5,-1.22],[-2,-1.41],[-1,-1.09],[0,0],[1,1.09],[2,1.41],[3,1.16],[3.5,0.52],[4.3,0.14],[5,0.29]] }
      ],
      lines: [
        { color: "#7ee787", dash: [], points: [[-5,-0.3],[0,0.02],[5,0.3]] },
        { color: "#ff7b72", dash: [6,4], points: [[5,0.3],[6.5,1.6]] }
      ],
      interpret: "Illustrative. Inside the data range the green fit is trustworthy. Past the last dot at x=5 the <b>red dashed</b> piece is extrapolation: all the weight now comes from points on <b>one side</b>, so the local line tilts off in whatever direction the edge happened to slope. Read any dashed-beyond-the-data region with suspicion — LWR predictions outside the training range are unreliable."
    }
  ]
};

window.CODEVIZ["mlx-cross-validation"] = {
  question: "Are my k held-out fold errors clustered around their average, or scattered so wide the score is luck?",
  code: `const folds = [0.30, 0.26, 0.34, 0.28, 0.32];
const cv = folds.reduce((a, b) => a + b, 0) / folds.length;
// cv = 0.300  (the trusted estimate)
const spread = Math.max(...folds) - Math.min(...folds);
// spread = 0.08  (range of single-split luck you averaged away)
console.log("CV =", cv.toFixed(3), " fold spread =", spread.toFixed(2));`,
  charts: [
    {
      type: "bars",
      title: "Healthy: folds scatter tightly around the CV average",
      labels: ["fold 1", "fold 2", "fold 3", "fold 4", "fold 5", "CV avg"],
      values: [0.30, 0.26, 0.34, 0.28, 0.32, 0.30],
      valueLabels: ["0.30", "0.26", "0.34", "0.28", "0.32", "0.30"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787"],
      interpret: "<b>Each blue bar is one round's held-out error</b> (height = error, lower is better); the green bar is their average, the cross-validation score (0.300). The five bars sit in a narrow band (0.26 to 0.34, spread 0.08) centred on green, so no single split would have misled you badly. <b>Conclusion:</b> a tight cluster around the average means the CV score is stable and trustworthy."
    },
    {
      type: "bars",
      title: "High-variance folds: wide scatter, shaky estimate (illustrative)",
      labels: ["fold 1", "fold 2", "fold 3", "fold 4", "fold 5", "CV avg"],
      values: [0.12, 0.48, 0.20, 0.55, 0.15, 0.30],
      valueLabels: ["0.12", "0.48", "0.20", "0.55", "0.15", "0.30"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#7ee787"],
      interpret: "Illustrative. Same green average (0.30), but the orange fold bars swing from 0.12 to 0.55 (spread 0.43). <b>Read it as: the bars fan far from the average</b>, so any one train/test split could have reported anything from 'great' to 'terrible'. <b>Conclusion:</b> the model or data is unstable across folds (too little data, or rows are grouped/leaking) and the 0.30 average should not be trusted; report the spread, add folds, or fix the splitting."
    },
    {
      type: "bars",
      title: "Leakage: all folds suspiciously low and identical (illustrative)",
      labels: ["fold 1", "fold 2", "fold 3", "fold 4", "fold 5", "CV avg"],
      values: [0.05, 0.04, 0.05, 0.04, 0.05, 0.046],
      valueLabels: ["0.05", "0.04", "0.05", "0.04", "0.05", "0.05"],
      colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#7ee787"],
      interpret: "Illustrative. Every red fold bar is tiny and nearly equal, so the average is implausibly low (0.05). <b>Read uniformly-too-good bars as a warning, not a win:</b> a scaler or feature-selector fit on the full data before splitting leaks test info into every fold. <b>Conclusion:</b> this is leakage, not skill; wrap every transform in a Pipeline so it refits inside each fold, and the bars will rise to honest levels."
    }
  ]
};

window.CODEVIZ["mlx-model-selection"] = {
  question: "As I add parameters, where does fit-plus-penalty stop falling and start rising — and does the penalty actually find that sweet spot?",
  code: `const misfit = k => 30 * Math.exp(-0.35 * k) + 4; // -2 lnL: falls as k grows
const penalty = (k, mult) => mult * k;            // AIC penalty = 2k
const aic = k => misfit(k) + penalty(k, 2);       // total to minimise
let bestK = 1, best = Infinity;
for (let k = 1; k <= 12; k += 0.1) { if (aic(k) < best) { best = aic(k); bestK = k; } }
console.log("best k about", Math.round(bestK)); // ~3: the dip of the U`,
  charts: [
    {
      type: "line",
      title: "Healthy AIC: total dips then climbs, minimum is the pick",
      xlabel: "model complexity k (number of parameters)",
      ylabel: "score (lower is better)",
      series: [
        { name: "misfit -2 lnL (falls)", color: "#4ea1ff", points: [[1,25.1],[2,18.9],[3,14.5],[4,11.4],[5,9.2],[6,7.7],[7,6.6],[8,5.8],[9,5.3],[10,4.9],[11,4.6],[12,4.5]] },
        { name: "penalty 2k (rises)", color: "#c89bff", points: [[1,2],[2,4],[3,6],[4,8],[5,10],[6,12],[7,14],[8,16],[9,18],[10,20],[11,22],[12,24]] },
        { name: "AIC total", color: "#ffb454", points: [[1,27.1],[2,22.9],[3,20.5],[4,19.4],[5,19.2],[6,19.7],[7,20.6],[8,21.8],[9,23.3],[10,24.9],[11,26.6],[12,28.5]] }
      ],
      interpret: "<b>X is model size (more parameters rightward); Y is the criterion, lower is better.</b> Blue misfit keeps falling (bigger models always fit training data better); purple penalty rises straight with k; orange is their sum. The orange AIC curve is U-shaped: it bottoms near k=5 here. <b>Conclusion:</b> pick the k at the bottom of the U, the balance point between underfitting (left) and overfitting (right)."
    },
    {
      type: "line",
      title: "Penalty too weak: minimum drifts right, AIC over-selects (illustrative)",
      xlabel: "model complexity k (number of parameters)",
      ylabel: "score (lower is better)",
      series: [
        { name: "misfit -2 lnL (falls)", color: "#4ea1ff", points: [[1,25.1],[2,18.9],[3,14.5],[4,11.4],[5,9.2],[6,7.7],[7,6.6],[8,5.8],[9,5.3],[10,4.9],[11,4.6],[12,4.5]] },
        { name: "weak penalty 0.5k", color: "#c89bff", points: [[1,0.5],[2,1],[3,1.5],[4,2],[5,2.5],[6,3],[7,3.5],[8,4],[9,4.5],[10,5],[11,5.5],[12,6]] },
        { name: "total (barely turns up)", color: "#ff7b72", points: [[1,25.6],[2,19.9],[3,16.0],[4,13.4],[5,11.7],[6,10.7],[7,10.1],[8,9.8],[9,9.8],[10,9.9],[11,10.1],[12,10.5]] }
      ],
      interpret: "Illustrative. The penalty (purple) is too shallow, so the red total stays almost flat on the right and its minimum slides out toward large k. <b>Read a flat, late-bottoming curve as under-penalising:</b> the criterion keeps rewarding extra parameters. <b>Conclusion:</b> you will over-select a needlessly complex model. On large n switch from AIC (penalty 2 per param) to BIC (penalty ln n), which steepens the purple line and pulls the minimum back left."
    },
    {
      type: "line",
      title: "Penalty too strong: minimum jammed at k=1, underfit (illustrative)",
      xlabel: "model complexity k (number of parameters)",
      ylabel: "score (lower is better)",
      series: [
        { name: "misfit -2 lnL (falls)", color: "#4ea1ff", points: [[1,25.1],[2,18.9],[3,14.5],[4,11.4],[5,9.2],[6,7.7],[7,6.6],[8,5.8],[9,5.3],[10,4.9],[11,4.6],[12,4.5]] },
        { name: "harsh penalty 6k", color: "#c89bff", points: [[1,6],[2,12],[3,18],[4,24],[5,30],[6,36],[7,42],[8,48],[9,54],[10,60],[11,66],[12,72]] },
        { name: "total (climbs immediately)", color: "#ff7b72", points: [[1,31.1],[2,30.9],[3,32.5],[4,35.4],[5,39.2],[6,43.7],[7,48.6],[8,53.8],[9,59.3],[10,64.9],[11,70.6],[12,76.5]] }
      ],
      interpret: "Illustrative. The penalty (purple) climbs so steeply it swamps the fit gains, so the red total rises almost from the very first step and bottoms at the smallest model (k=1). <b>Read a curve with no real dip, minimum pinned at the left edge, as over-penalising.</b> <b>Conclusion:</b> the criterion underfits, rejecting parameters the data actually supports. This happens with BIC at very large n or with AICc on tiny samples; sanity-check against cross-validation before shipping the trivial model."
    }
  ]
};

window.CODEVIZ["mlx-clustering-metrics"] = {
  question: "How do you read a silhouette plot to pick the right number of clusters?",
  charts: [
    {
      type: "line",
      title: "Healthy: average silhouette peaks at the true k=3",
      xlabel: "number of clusters k",
      ylabel: "average silhouette score",
      series: [
        {
          name: "avg silhouette",
          color: "#7ee787",
          points: [[2, 0.2683], [3, 0.2849], [4, 0.2457], [5, 0.2026], [6, 0.196]]
        }
      ],
      interpret: "<b>Read it:</b> x is how many clusters you forced k-means to find; y is the average silhouette (closer to +1 = tighter, better-separated clusters). Real numbers from 178 wines with 13 chemical features. The curve <b>rises to a clear peak at k=3 then falls</b>, so 3 clusters fit the geometry best - and that matches the three real grape cultivars. <b>Conclude:</b> the peak of this curve is your chosen k."
    },
    {
      type: "line",
      title: "No structure: silhouette just falls, best is the trivial k=2",
      xlabel: "number of clusters k",
      ylabel: "average silhouette score",
      series: [
        {
          name: "avg silhouette",
          color: "#ffb454",
          points: [[2, 0.18], [3, 0.13], [4, 0.10], [5, 0.08], [6, 0.07]]
        }
      ],
      interpret: "<b>Illustrative.</b> Here the curve has <b>no interior peak</b> - it only drops as k grows, and even the best value (~0.18) is low. That is the fingerprint of data with <b>no real cluster structure</b>: every split just carves up one cloud. <b>Conclude:</b> don't trust the k=2 'winner' here; a low, monotonically falling silhouette means k-means is imposing groups that aren't really there."
    },
    {
      type: "bars",
      title: "Per-point silhouette: one cluster has negative (misassigned) points",
      labels: ["A pt1", "A pt2", "A pt3", "B pt1", "B pt2", "C pt1", "C pt2", "C pt3"],
      values: [0.71, 0.66, 0.58, 0.62, 0.55, 0.12, -0.08, -0.21],
      valueLabels: ["0.71", "0.66", "0.58", "0.62", "0.55", "0.12", "-0.08", "-0.21"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ffb454", "#ff7b72", "#ff7b72"],
      interpret: "<b>Illustrative.</b> Instead of one average, this shows <b>every point's own silhouette</b>. Green bars near +1 sit deep inside tight clusters. The orange bar near 0 is on a <b>border</b>. The two red <b>negative</b> bars (cluster C) are closer to a neighbouring cluster than their own - they are probably <b>misassigned</b>. <b>Conclude:</b> always inspect the per-point plot - a fine average can hide one broken cluster like C here."
    }
  ],
  caption: "Cluster 178 Italian wines by 13 chemical measurements with the cultivar labels hidden, then judge the geometry: the average silhouette peaks at k=3 (0.285), recovering the three real grape cultivars.",
  code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# REAL data: 178 wines, 13 chemical features, 3 true cultivars (labels hidden).
wn = load_wine()
X = StandardScaler().fit_transform(wn.data)

ks, sils = [], []
for k in range(2, 7):
    labels = KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(X)
    ks.append(k)
    sils.append(silhouette_score(X, labels))     # mean silhouette over wines

plt.plot(ks, sils, 'o-', color='#7ee787', label='avg silhouette')
plt.xlabel('number of clusters k'); plt.ylabel('average silhouette score')
plt.title('Healthy: average silhouette peaks at the true k=3')
plt.legend(); plt.show()
`
};

window.CODEVIZ["mlx-error-analysis"] = {
  question: "How do you read a ceiling-analysis chart to find which stage to fix first?",
  charts: [
    {
      type: "bars",
      title: "Ceiling analysis: headroom from perfecting each stage (detector wins)",
      labels: ["preprocess", "detector", "features", "classifier"],
      values: [1, 8, 3, 2],
      valueLabels: ["+1%", "+8%", "+3%", "+2%"],
      colors: ["#4ea1ff", "#ffb454", "#4ea1ff", "#4ea1ff"],
      interpret: "<b>Read it:</b> each bar is the accuracy gain if you replace that one pipeline stage with a perfect oracle (its ground-truth output) and leave the rest alone. Taller bar = more <b>headroom</b>. Illustrative numbers for a 72%-accurate face pipeline. The <b>detector bar towers at +8%</b>, dwarfing preprocess (+1%). <b>Conclude:</b> fix the tallest bar first - perfecting preprocessing could buy at most 1%, so it's a waste of effort here."
    },
    {
      type: "bars",
      title: "Ablative: accuracy lost when each component is removed (one is dead weight)",
      labels: ["preprocess", "detector", "features", "classifier"],
      values: [4.0, 9.0, 0.3, 12.0],
      valueLabels: ["-4.0%", "-9.0%", "-0.3%", "-12.0%"],
      colors: ["#4ea1ff", "#4ea1ff", "#9aa7b4", "#7ee787"],
      interpret: "<b>Illustrative - the mirror image.</b> Start from the full system and <b>delete</b> one component; the bar is the accuracy you lose. A big drop (classifier, -12%) means the part is <b>pulling its weight</b>. The tiny grey bar (features, -0.3%) means that component is <b>barely helping</b> - candidate to prune. <b>Conclude:</b> ablation answers 'what is actually earning its keep?', the opposite question from ceiling analysis."
    },
    {
      type: "bars",
      title: "Flat headroom: no single bottleneck, gains are spread out",
      labels: ["preprocess", "detector", "features", "classifier"],
      values: [3, 4, 3, 4],
      valueLabels: ["+3%", "+4%", "+3%", "+4%"],
      colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      interpret: "<b>Illustrative.</b> Here the headroom bars are <b>all roughly equal</b> - no stage stands out. There is <b>no single bottleneck</b>: every part is similarly imperfect. <b>Conclude:</b> a flat ceiling-analysis chart means ranking won't save you much; you face broad, diminishing-returns work across the whole pipeline rather than one easy big win."
    },
    {
      type: "bars",
      title: "Redundancy trap: two correlated stages each look unimportant alone",
      labels: ["detectorA", "detectorB", "features", "classifier"],
      values: [0.5, 0.5, 5.0, 6.0],
      valueLabels: ["-0.5%", "-0.5%", "-5.0%", "-6.0%"],
      colors: ["#ff7b72", "#ff7b72", "#4ea1ff", "#4ea1ff"],
      interpret: "<b>Illustrative ablation pitfall.</b> Removing detectorA alone drops only 0.5%, and detectorB alone only 0.5% - both <b>look like dead weight</b> (red). But they are <b>redundant twins</b>: the survivor covers for the one you cut. Drop <b>both</b> together and accuracy would crater. <b>Conclude:</b> single-component ablation lies when parts are correlated - test pairs before pruning either."
    }
  ],
  caption: "Error analysis ranks stages by headroom (perfect-oracle gain); ablative analysis ranks them by the drop when removed. Together: what to improve, and what is actually helping.",
  code: `import numpy as np
import matplotlib.pyplot as plt

# Illustrative ceiling analysis for a 72%-accurate pipeline.
# Each value = accuracy gained if that one stage were made perfect (oracle).
base = 72.0
stages = ['preprocess', 'detector', 'features', 'classifier']
ceiling_acc = [73.0, 80.0, 75.0, 74.0]          # acc with that stage perfected
headroom = [c - base for c in ceiling_acc]       # Delta_c per stage

colors = ['#ffb454' if h == max(headroom) else '#4ea1ff' for h in headroom]
plt.bar(stages, headroom, color=colors)
plt.ylabel('headroom: accuracy gain if perfected (%)')
plt.title('Ceiling analysis: headroom from perfecting each stage (detector wins)')
plt.show()
`
};
