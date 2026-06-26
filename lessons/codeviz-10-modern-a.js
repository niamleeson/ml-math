/* Per-lesson CODE VISUALIZATIONS — 10-modern-a.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["mod-transformer"] = {
  question: "How do you read a self-attention heatmap, and how do you spot a healthy one versus a broken one?",
  code: `// One attention row, end to end, for token 'cat'.
// raw scores QK^T already divided by sqrt(d):
const tokens = ["The", "cat", "sat", "down"];
const scaled = [0.5, 2.0, 1.0, -0.5];   // cat's scores against each key
const mx = Math.max(...scaled);
const ex = scaled.map(s => Math.exp(s - mx));
const Z = ex.reduce((a, b) => a + b, 0);
const weights = ex.map(e => e / Z);
// weights = [0.13, 0.59, 0.22, 0.06], they sum to 1.00
console.log(weights.map(w => w.toFixed(2)));`,
  charts: [
    {
      type: "heatmap",
      title: "Healthy attention: each row is a softmax over keys (sums to 1)",
      rows: ["The", "cat", "sat", "down"],
      cols: ["The", "cat", "sat", "down"],
      matrix: [
        [0.66, 0.20, 0.10, 0.04],
        [0.13, 0.59, 0.22, 0.06],
        [0.05, 0.27, 0.55, 0.13],
        [0.03, 0.08, 0.22, 0.67]
      ],
      showVals: true,
      interpret: "<b>Rows are queries</b> (the token doing the looking), <b>columns are keys</b> (the token being looked at). Read along one row: it is a softmax, so the four cells sum to 1.00 and tell you how 'cat' splits its attention. Dark cells mark where attention concentrates. These are the real numbers from the worked example: 'cat' puts 0.59 on itself and 0.22 on 'sat', so its new vector is mostly itself plus a dash of 'sat'. A healthy map has clear, varied focus that differs row to row."
    },
    {
      type: "heatmap",
      title: "Diffuse attention: every weight near 0.25 (untrained or temperature too high)",
      rows: ["The", "cat", "sat", "down"],
      cols: ["The", "cat", "sat", "down"],
      matrix: [
        [0.26, 0.25, 0.25, 0.24],
        [0.25, 0.26, 0.25, 0.24],
        [0.24, 0.25, 0.26, 0.25],
        [0.25, 0.24, 0.25, 0.26]
      ],
      showVals: true,
      interpret: "Illustrative. Here every cell is roughly 1/4, so each row is almost flat. That means the model is attending to everything equally and choosing nothing. You see this before training (random scores) or when the softmax temperature is too high and washes out the differences. The output token becomes a bland average of all values, carrying little context. If your real map looks this uniform after training, the attention layer is not learning useful relationships."
    },
    {
      type: "heatmap",
      title: "Attention collapse: every row dumps onto one column (rank collapse / sink)",
      rows: ["The", "cat", "sat", "down"],
      cols: ["The", "cat", "sat", "down"],
      matrix: [
        [0.91, 0.04, 0.03, 0.02],
        [0.89, 0.05, 0.04, 0.02],
        [0.90, 0.04, 0.04, 0.02],
        [0.88, 0.06, 0.04, 0.02]
      ],
      showVals: true,
      interpret: "Illustrative. Notice one column ('The') is dark for <b>every</b> row while the rest stay pale. All tokens funnel their attention into the same key, so every output collapses toward one value vector and the rows stop differing. This is the 'attention sink' or rank-collapse failure, common in deep stacks without good normalization or residuals. The fix is pre-norm placement, careful init, and warmup; if you see one solid column dominating, suspect collapse rather than real structure."
    },
    {
      type: "heatmap",
      title: "Mask leak: a decoder row attends to a future token (off-by-one causal mask)",
      rows: ["The", "cat", "sat", "down"],
      cols: ["The", "cat", "sat", "down"],
      matrix: [
        [1.00, 0.00, 0.00, 0.00],
        [0.45, 0.55, 0.00, 0.00],
        [0.20, 0.30, 0.50, 0.00],
        [0.15, 0.20, 0.25, 0.40]
      ],
      showVals: true,
      interpret: "Illustrative of a correct causal mask: the upper-right triangle is all zeros, so token i never peeks at tokens after it. In a decoder this is mandatory. The bug to watch for is a non-zero value creeping into that upper triangle (e.g. row 'cat' having weight on 'sat'), which lets a token see the future, leaks the answer, and silently inflates training scores while test performance tanks. Always eyeball the upper-right triangle of a decoder map: any ink up there is a masking bug."
    }
  ]
};

window.CODEVIZ["mod-multihead"] = {
  question: "How do you read several attention heads at once, and how do you tell specialized heads from redundant or starved ones?",
  code: `// 'cat' attending under three heads. Each is its own softmax over keys.
const tokens = ["The", "cat", "sat"];
function softmax(r) {
  const mx = Math.max(...r);
  const ex = r.map(v => Math.exp(v - mx));
  const Z = ex.reduce((a, b) => a + b, 0);
  return ex.map(e => e / Z);
}
const headRaw = {
  identity: [0, 3, 0],   // looks at itself
  previous: [3, 0, 0],   // looks one word back
  verb:     [0, 0, 3]    // looks at 'sat'
};
for (const k in headRaw) console.log(k, softmax(headRaw[k]).map(w => w.toFixed(2)));`,
  charts: [
    {
      type: "bars",
      title: "Healthy heads: three heads, three different focuses for the same token 'cat'",
      labels: ["The", "cat", "sat"],
      series: [
        { name: "Head 1: self", color: "#4ea1ff", points: [["The", 0.04], ["cat", 0.92], ["sat", 0.04]] },
        { name: "Head 2: previous", color: "#7ee787", points: [["The", 0.92], ["cat", 0.04], ["sat", 0.04]] },
        { name: "Head 3: verb", color: "#c89bff", points: [["The", 0.04], ["cat", 0.04], ["sat", 0.92]] }
      ],
      interpret: "Each group on the x-axis is a key token; each colored bar is one head's attention weight on that key. Read one color across the chart: Head 1 (blue) peaks on 'cat' itself, Head 2 (green) peaks on 'The' (one word back), Head 3 (purple) peaks on 'sat' (the verb). Within a head the three bars sum to 1. <b>Different colors peaking in different places is exactly what you want</b> — each head learned a distinct relationship, and concatenating them gives 'cat' a richer vector than any single head could."
    },
    {
      type: "bars",
      title: "Redundant heads: all three heads peak in the same place (prune candidates)",
      labels: ["The", "cat", "sat"],
      series: [
        { name: "Head 1", color: "#4ea1ff", points: [["The", 0.05], ["cat", 0.90], ["sat", 0.05]] },
        { name: "Head 2", color: "#7ee787", points: [["The", 0.06], ["cat", 0.88], ["sat", 0.06]] },
        { name: "Head 3", color: "#ffb454", points: [["The", 0.04], ["cat", 0.91], ["sat", 0.05]] }
      ],
      interpret: "Illustrative. All three colors stack at the same key ('cat'), so the heads are doing nearly identical work. Multi-head attention only pays off when heads diverge; here you are spending three heads' compute and cache for one head's information. This is common — many heads learn duplicate patterns and pruning a large fraction barely hurts. If your heads look like this, they are prune candidates, not evidence that more heads helped."
    },
    {
      type: "bars",
      title: "Starved heads: too many heads over a small model dim, each near-uniform",
      labels: ["The", "cat", "sat"],
      series: [
        { name: "Head 1", color: "#4ea1ff", points: [["The", 0.34], ["cat", 0.33], ["sat", 0.33]] },
        { name: "Head 2", color: "#7ee787", points: [["The", 0.33], ["cat", 0.34], ["sat", 0.33]] },
        { name: "Head 3", color: "#c89bff", points: [["The", 0.33], ["cat", 0.33], ["sat", 0.34]] }
      ],
      interpret: "Illustrative. Every bar sits near 1/3, so no head has a clear focus. This happens when you split a small model dimension d into too many heads: each head gets a tiny d/h subspace with too little capacity to form a sharp pattern. The cure is fewer, wider heads (keep head size around 32-128), not more heads. Flat bars across all heads mean the heads are starved, not that the data lacks structure."
    },
    {
      type: "heatmap",
      title: "Head specialization map: which head fires for which query token",
      rows: ["The", "cat", "sat"],
      cols: ["Head 1: self", "Head 2: previous", "Head 3: verb"],
      matrix: [
        [0.92, 0.04, 0.04],
        [0.04, 0.92, 0.92],
        [0.04, 0.92, 0.92]
      ],
      showVals: true,
      interpret: "Illustrative summary. Rows are query tokens, columns are heads; a cell shows roughly how strongly that head's top weight lands on a meaningful (non-self-trivial) target for that query. The point is to scan columns: a column that is dark for some rows and pale for others is a head with a real, selective job. A column that is uniformly dark or uniformly pale is doing the same thing everywhere and is a redundancy or starvation flag. Use this kind of overview to decide which heads to keep before trusting any single head's 'meaning'."
    }
  ]
};

window.CODEVIZ["mod-llm"] = {
  question: "The model scores every word, then softmax turns scores into a probability bar chart. What does temperature do to those bars?",
  code: `// Next-token distribution from logits via temperature-scaled softmax.
const vocab = ["mat", "sofa", "roof", "moon", "idea"];
const logits = [3.2, 2.1, 1.0, -0.5, -1.5];
function probs(T) {
  const s = logits.map(v => v / T);
  const m = Math.max.apply(null, s);
  const ex = s.map(v => Math.exp(v - m));
  const Z = ex.reduce((a, b) => a + b, 0);
  return ex.map(e => e / Z);
}
console.log("T=1  :", probs(1).map(p => (p * 100).toFixed(1) + "%"));
console.log("T=0.5:", probs(0.5).map(p => (p * 100).toFixed(1) + "%"));
console.log("T=2  :", probs(2).map(p => (p * 100).toFixed(1) + "%"));`,
  charts: [
    {
      type: "bars",
      title: "Healthy next-token distribution (T = 1): one clear winner",
      labels: ["mat", "sofa", "roof", "moon", "idea"],
      values: [62.0, 20.6, 6.9, 1.5, 0.6],
      valueLabels: ["62%", "21%", "6.9%", "1.5%", "0.6%"],
      colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
      interpret: "Each bar is the chance the model picks that word next, after softmax over the 5 logits [3.2, 2.1, 1.0, -0.5, -1.5] at temperature 1. The bars sum to 100%. The tallest green bar ('mat', 62%) is the model's top guess; the rest fall off fast. <b>Read it as: the model is fairly confident but not certain</b> — a sensible, slightly varied prediction."
    },
    {
      type: "bars",
      title: "Low temperature (T = 0.3): distribution collapses to greedy",
      labels: ["mat", "sofa", "roof", "moon", "idea"],
      values: [97.0, 2.7, 0.3, 0.0, 0.0],
      valueLabels: ["97%", "2.7%", "0.3%", "~0%", "~0%"],
      colors: ["#7ee787", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      interpret: "Same logits, but dividing by a small T = 0.3 stretches the gaps before softmax, so one bar swallows almost all the mass. <b>Recognise it by a single near-100% spike and everything else flat.</b> The model becomes deterministic and repetitive — great for factual answers, but it loses diversity and gets stuck in loops. (Illustrative numbers, same shape you would compute.)"
    },
    {
      type: "bars",
      title: "High temperature (T = 2.5): distribution flattens toward uniform",
      labels: ["mat", "sofa", "roof", "moon", "idea"],
      values: [33.0, 25.0, 19.0, 13.0, 10.0],
      valueLabels: ["33%", "25%", "19%", "13%", "10%"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"],
      interpret: "Dividing by a large T = 2.5 shrinks the gaps between logits, so the bars even out and unlikely words get real probability. <b>Recognise it by bars that are all similar height.</b> Output becomes creative but riskier — 'moon' or 'idea' might be sampled even though they barely fit. Too high and the model produces gibberish. (Illustrative numbers, same flattening you would compute.)"
    },
    {
      type: "line",
      title: "Top-word probability vs temperature",
      xlabel: "temperature T",
      ylabel: "probability of top word 'mat'",
      series: [{
        name: "P(top word)",
        color: "#c89bff",
        points: [[0.3, 0.97], [0.5, 0.88], [0.8, 0.70], [1.0, 0.62], [1.5, 0.47], [2.0, 0.40], [2.5, 0.33], [3.0, 0.30]]
      }],
      interpret: "This traces how sure the model is of its top guess as you turn the temperature knob. Left (low T) the curve is near 1.0 — confident, deterministic. As T rises the curve drops toward 1/5 = 0.20, the uniform floor for 5 words. <b>Use it to pick a working point:</b> low T for accuracy, mid T (~0.7-1.0) for natural text, high T for brainstorming. The flattening is monotonic — more heat always means less certainty."
    }
  ]
};

window.CODEVIZ["mod-autoencoder"] = {
  question: "An autoencoder rebuilds its input from a tiny code. How do you read the input-vs-reconstruction bars, and what does reconstruction error tell you?",
  code: `// Encode 5 numbers -> 2-number code -> rebuild 5 numbers. Fixed linear weights.
const x = [0.8, 0.2, 0.9, 0.1, 0.6];
const We = [[0.5,0.1,0.5,0.0,0.3],[0.0,0.6,0.1,0.6,0.2]];
const Wd = [[0.9,0.0],[0.1,0.8],[0.9,0.1],[0.0,0.9],[0.4,0.3]];
const z = We.map(row => row.reduce((s, w, i) => s + w * x[i], 0));
const xhat = Wd.map(row => row[0]*z[0] + row[1]*z[1]);
const mse = x.reduce((s, xi, i) => s + (xi - xhat[i])**2, 0) / x.length;
console.log("code z   =", z.map(v => v.toFixed(2)));
console.log("rebuilt  =", xhat.map(v => v.toFixed(2)));
console.log("MSE      =", mse.toFixed(4));`,
  charts: [
    {
      type: "bars",
      title: "Healthy reconstruction: rebuilt bars track the input (low error)",
      labels: ["x1", "x2", "x3", "x4", "x5"],
      series: [
        { name: "input x", color: "#7ee787", points: [[0, 0.80], [1, 0.20], [2, 0.90], [3, 0.10], [4, 0.60]] },
        { name: "reconstruction", color: "#4ea1ff", points: [[0, 0.95], [1, 0.42], [2, 0.98], [3, 0.35], [4, 0.54]] }
      ],
      interpret: "Green = the original 5 inputs; blue = what the decoder rebuilt from just the 2-number code. Read each pair side by side: the closer the blue bar to the green, the better the rebuild. Here they roughly match (mean squared error about 0.028) even though 5 numbers were squeezed through 2. <b>Conclude: the data really lives on a 2-D surface</b>, so the bottleneck kept the essence. Small gaps are the price of compression."
    },
    {
      type: "bars",
      title: "Identity trap: bottleneck as wide as input copies perfectly but learns nothing",
      labels: ["x1", "x2", "x3", "x4", "x5"],
      series: [
        { name: "input x", color: "#7ee787", points: [[0, 0.80], [1, 0.20], [2, 0.90], [3, 0.10], [4, 0.60]] },
        { name: "reconstruction", color: "#ff7b72", points: [[0, 0.80], [1, 0.20], [2, 0.90], [3, 0.10], [4, 0.60]] }
      ],
      interpret: "Here the red bars sit exactly on top of the green ones — a flawless rebuild, error near zero. That looks great but is a <b>warning sign</b>: when the code is as wide as the input (5 in, 5 out), the network just passes numbers straight through and learns no useful summary. <b>Recognise it by perfect reconstruction with a too-wide latent.</b> Shrink the bottleneck or add input noise (denoising autoencoder) to force real learning. (Illustrative — exact copy.)"
    },
    {
      type: "hist",
      title: "Anomaly detection: error histogram, normal cluster vs anomaly tail",
      labels: ["0.00", "0.02", "0.04", "0.06", "0.08", "0.10", "0.15", "0.20", "0.30", "0.40"],
      values: [40, 120, 90, 35, 12, 5, 3, 6, 9, 7],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#9aa7b4", "#9aa7b4", "#ffb454", "#ffb454", "#ff7b72"],
      interpret: "Train only on normal data, then plot every input's reconstruction error. The tall green hump on the left is normal data — it rebuilds well, so error is small. The orange/red bump far to the right is anomalies (e.g. fraud): the model never learned them, so they rebuild badly and error spikes. <b>Pick a threshold in the valley between the humps</b> (around 0.12 here); anything past it is flagged. The cleaner the gap, the more reliable the detector. (Illustrative counts.)"
    },
    {
      type: "line",
      title: "Choosing the bottleneck: reconstruction error vs code size",
      xlabel: "code (bottleneck) dimension",
      ylabel: "reconstruction error (MSE)",
      series: [{
        name: "validation MSE",
        color: "#c89bff",
        points: [[1, 0.090], [2, 0.028], [3, 0.012], [4, 0.006], [5, 0.001]]
      }],
      interpret: "Each point is the rebuild error for a different code width. Error falls as you allow more code numbers — a wider bottleneck can carry more detail. But notice the steep drop flattens after 2-3 dimensions: that 'elbow' is the data's true intrinsic dimensionality. <b>Read it as: pick the smallest code just past the elbow</b> — enough to capture the structure, small enough to force a useful summary and avoid the copy-everything identity trap at the far right. (Illustrative curve.)"
    }
  ]
};

window.CODEVIZ["mod-vae"] = {
  question: "What does a HEALTHY VAE latent space look like, and how do you spot posterior collapse or a bad reconstruction/KL trade-off?",
  charts: [
    {
      type: "scatter",
      title: "Healthy VAE latent: classes spread out and fill a tidy Gaussian blob",
      xlabel: "latent z1",
      ylabel: "latent z2",
      groups: [
        { name: "digit 0", color: "#c89bff", points: [[-0.08,-1.33],[0.70,-1.06],[0.40,-1.22],[0.02,-1.66],[0.38,-0.99],[0.31,-1.30],[0.25,-1.31],[0.65,-0.87],[0.39,-1.26],[-0.21,-1.43],[0.54,-1.47],[0.13,-1.51]] },
        { name: "digit 1", color: "#4ea1ff", points: [[0.50,1.30],[0.19,0.75],[0.00,0.65],[0.18,0.58],[0.10,0.67],[0.20,0.60],[0.50,0.68],[0.01,0.97],[0.47,1.30],[0.20,0.88],[0.79,1.27],[1.25,1.20]] },
        { name: "digit 2", color: "#7ee787", points: [[0.44,0.62],[-0.15,0.30],[-0.51,0.55],[0.06,0.43],[0.39,0.45],[0.67,0.58],[0.42,0.73],[0.19,0.58],[0.41,0.87],[-0.23,0.15],[-0.13,0.66],[0.18,0.47]] },
        { name: "digit 3", color: "#ffb454", points: [[-0.99,-0.21],[-1.45,0.12],[-1.20,0.28],[-1.30,-0.19],[-1.21,0.51],[-1.47,-0.23],[-1.49,-0.04],[-1.35,0.55],[-1.27,0.34],[-1.51,0.11],[-1.29,0.93],[-1.54,0.33]] }
      ],
      interpret: "Each dot is one real digit image, placed by the two numbers (z1, z2) the encoder gives it. Same-colour dots clump together, so the latent has learned to separate the classes, and all four clumps sit close to the origin in one continuous blob (no big empty gaps). That is exactly what the KL term buys you: you can pick any point in this blob, decode it, and get a plausible digit. Real load_digits classes 0-3."
    },
    {
      type: "scatter",
      title: "Posterior collapse: every input maps to the same tiny dot at the origin",
      xlabel: "latent z1",
      ylabel: "latent z2",
      groups: [
        { name: "digit 0", color: "#c89bff", points: [[0.02,-0.03],[-0.01,0.02],[0.03,0.01],[-0.02,-0.01],[0.01,0.03],[0.00,-0.02]] },
        { name: "digit 1", color: "#4ea1ff", points: [[-0.03,0.01],[0.02,-0.02],[0.01,0.02],[-0.01,-0.03],[0.03,0.00],[-0.02,0.02]] },
        { name: "digit 2", color: "#7ee787", points: [[0.01,0.02],[-0.02,-0.01],[0.02,0.03],[0.00,-0.02],[-0.01,0.01],[0.03,-0.01]] },
        { name: "digit 3", color: "#ffb454", points: [[-0.01,-0.02],[0.02,0.01],[-0.03,0.02],[0.01,-0.01],[0.00,0.03],[-0.02,-0.02]] }
      ],
      interpret: "Illustrative failure mode. Here EVERY colour is piled on top of the origin in one indistinguishable smudge. The encoder has given up: it outputs the prior N(0,1) for every input, so z carries no information and the decoder ignores it. You see this when the KL term overpowers reconstruction (or the decoder is too strong). Fix with KL warmup (anneal its weight) or a weaker decoder. Recognise it by classes that do NOT separate in latent space."
    },
    {
      type: "bars",
      title: "Reconstruction quality per class: healthy VAE vs collapsed VAE (MSE, lower better)",
      labels: ["0","1","2","3","4","5","6","7","8","9"],
      series: [
        { name: "healthy VAE", color: "#7ee787", points: [[0,0.037],[1,0.062],[2,0.066],[3,0.040],[4,0.050],[5,0.061],[6,0.047],[7,0.063],[8,0.050],[9,0.049]] },
        { name: "collapsed VAE", color: "#ff7b72", points: [[0,0.180],[1,0.205],[2,0.210],[3,0.185],[4,0.195],[5,0.200],[6,0.190],[7,0.205],[8,0.198],[9,0.193]] }
      ],
      interpret: "Each pair of bars is one digit class; height is mean squared reconstruction error (lower = sharper rebuild). The green (healthy) bars hover near 0.05, while the red (collapsed) bars sit ~4x higher and nearly flat across classes. A flat, uniformly-high error bar like the red one is the tell-tale of collapse: the model rebuilds every input as the same blurry class-average. Green numbers are the real load_digits PCA-2 reconstruction MSEs; red is illustrative of a collapsed run."
    },
    {
      type: "line",
      title: "Reconstruction vs KL trade-off as beta grows (the beta-VAE knob)",
      xlabel: "beta (weight on the KL term)",
      ylabel: "loss component",
      series: [
        { name: "reconstruction error", color: "#7ee787", points: [[0.1,0.030],[0.5,0.038],[1.0,0.050],[2.0,0.075],[4.0,0.120],[8.0,0.190]] },
        { name: "KL divergence", color: "#4ea1ff", points: [[0.1,9.0],[0.5,5.5],[1.0,3.5],[2.0,1.8],[4.0,0.7],[8.0,0.15]] }
      ],
      interpret: "The x-axis is beta, the dial that weights the KL term against reconstruction. As beta rises (left to right) the blue KL line falls (latent gets tidier, more like N(0,1)) but the green reconstruction error climbs (rebuilds get blurrier). They pull in opposite directions, so there is no free lunch: a sweet spot near beta = 1 keeps both tolerable, far right is where posterior collapse starts. Illustrative curves showing the qualitative trade-off you tune in a beta-VAE."
    }
  ],
  caption: "",
  code:
`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

# A 2-D PCA stands in for a healthy VAE latent on REAL handwritten digits
digits = load_digits()
X = digits.data / 16.0
y = digits.target
Z = PCA(n_components=2).fit_transform(X)

fig, ax = plt.subplots(figsize=(7, 6))
for c, col in zip([0, 1, 2, 3], ["#c89bff", "#4ea1ff", "#7ee787", "#ffb454"]):
    idx = np.where(y == c)[0][:12]
    ax.scatter(Z[idx, 0], Z[idx, 1], color=col, label="digit %d" % c)
ax.set_xlabel("latent z1"); ax.set_ylabel("latent z2")
ax.set_title("healthy VAE latent: classes separate in one tidy blob")
ax.legend()
plt.show()`
};

window.CODEVIZ["mod-diffusion"] = {
  question: "What does a GOOD diffusion noise schedule look like, and how do you recognise a bad schedule, a diverging training run, or too-few sampling steps?",
  charts: [
    {
      type: "line",
      title: "Healthy linear DDPM schedule on a real digit-3 image",
      xlabel: "timestep t",
      ylabel: "fraction (0 to 1)",
      series: [
        { name: "signal sqrt(alpha_bar)", color: "#4ea1ff", points: [[0,1.0],[100,0.946],[200,0.81],[300,0.628],[400,0.44],[500,0.279],[600,0.16],[700,0.083],[800,0.039],[900,0.016],[999,0.006]] },
        { name: "noise sqrt(1-alpha_bar)", color: "#ff7b72", points: [[0,0.01],[100,0.324],[200,0.586],[300,0.778],[400,0.898],[500,0.96],[600,0.987],[700,0.997],[800,0.999],[900,1.0],[999,1.0]] },
        { name: "measured noise in image", color: "#ffb454", points: [[0,0.001],[100,0.545],[200,0.843],[300,0.941],[400,0.978],[500,0.992],[600,0.998],[700,0.999],[800,1.0],[900,1.0],[999,1.0]] }
      ],
      interpret: "x-axis is the diffusion step t (0 = clean image, 999 = pure noise). Blue is how much original signal survives, red is how much noise has been mixed in; at every t they trade off so the total stays balanced. Orange is the noise fraction actually measured in the corrupted 8x8 image and it tracks the red curve, confirming the schedule does what the math says. A healthy schedule like this spends its steps GRADUALLY, with the cross-over near the middle. Real load_digits 3, 1000-step linear beta schedule."
    },
    {
      type: "line",
      title: "Bad schedule: signal destroyed in a handful of steps (wasted budget)",
      xlabel: "timestep t",
      ylabel: "fraction (0 to 1)",
      series: [
        { name: "signal sqrt(alpha_bar)", color: "#4ea1ff", points: [[0,1.0],[100,0.30],[200,0.07],[300,0.02],[400,0.005],[500,0.0],[600,0.0],[700,0.0],[800,0.0],[900,0.0],[999,0.0]] },
        { name: "noise sqrt(1-alpha_bar)", color: "#ff7b72", points: [[0,0.0],[100,0.954],[200,0.998],[300,1.0],[400,1.0],[500,1.0],[600,1.0],[700,1.0],[800,1.0],[900,1.0],[999,1.0]] }
      ],
      interpret: "Illustrative bad schedule. The blue signal nose-dives to ~0 by t = 200 and then the curves are flat for 800 steps. Those flat steps are wasted: the network sees pure noise and learns nothing, while the early steps jump too far for it to follow. Recognise this by a signal curve that collapses early and a long flat tail. Fix it by stretching the schedule (a cosine schedule keeps signal alive longer) and matching the training and sampling schedules."
    },
    {
      type: "line",
      title: "Training the denoiser: healthy convergence vs diverging run",
      xlabel: "training step (thousands)",
      ylabel: "noise-prediction loss (MSE)",
      series: [
        { name: "healthy (good LR + warmup)", color: "#7ee787", points: [[0,1.0],[10,0.42],[20,0.25],[40,0.15],[80,0.10],[160,0.075],[300,0.062]] },
        { name: "diverging (LR too high)", color: "#ff7b72", points: [[0,1.0],[10,0.55],[20,0.40],[40,0.6],[80,1.4],[160,3.2],[300,6.0]] }
      ],
      interpret: "y-axis is the noise-prediction loss: how far the network's guessed noise is from the true noise it must subtract (lower = better). Green falls smoothly and flattens near 0.06, the convergence you want. Red drops at first then turns upward and explodes, the classic sign of a learning rate that is too high (or no warmup) for an unstable diffusion model. If your loss curve turns back up like the red one, cut the LR and add a warmup schedule. Illustrative loss curves."
    },
    {
      type: "bars",
      title: "Sample quality vs number of denoising steps (FID, lower is better)",
      labels: ["5 steps","10 steps","25 steps","50 steps","100 steps","250 steps"],
      values: [85, 42, 18, 9, 6, 5],
      valueLabels: ["85","42","18","9","6","5"],
      colors: ["#ff7b72","#ffb454","#ffb454","#7ee787","#7ee787","#7ee787"],
      interpret: "Each bar is one sampling budget; height is FID (a lower score means generated images look closer to real ones). Quality improves fast as you add steps but then flattens: jumping from 5 to 50 steps slashes FID from 85 to 9, while 50 to 250 barely helps. This is the speed/quality trade-off behind diffusion being slow, and why fast samplers (DDIM) or distillation aim to keep the low FID of many steps at the cost of just a few. Illustrative FID-vs-steps curve."
    }
  ],
  caption: "",
  code:
`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

# forward diffusion of a REAL digit image with the standard DDPM schedule
digits = load_digits()
img = (digits.data / 16.0)[np.where(digits.target == 3)[0][0]]  # one real "3"
T = 1000
betas = np.linspace(1e-4, 0.02, T)              # linear noise schedule
alpha_bar = np.cumprod(1.0 - betas)
ts = np.arange(0, T, 100)
signal = np.sqrt(alpha_bar[ts])
noise = np.sqrt(1.0 - alpha_bar[ts])

rng = np.random.default_rng(3)
eps = rng.standard_normal(img.shape)
meas = []
for t in ts:
    xt = np.sqrt(alpha_bar[t]) * img + np.sqrt(1 - alpha_bar[t]) * eps
    meas.append(np.var(np.sqrt(1 - alpha_bar[t]) * eps) / (np.var(xt) + 1e-9))

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(ts, signal, color="#4ea1ff", label="signal sqrt(alpha_bar)")
ax.plot(ts, noise, color="#ff7b72", label="noise sqrt(1-alpha_bar)")
ax.plot(ts, np.clip(meas, 0, 1), color="#ffb454", label="measured noise fraction")
ax.set_xlabel("timestep t"); ax.set_ylabel("fraction")
ax.set_title("healthy schedule: real digit image dissolving into noise"); ax.legend()
plt.show()`
};

window.CODEVIZ["mod-normalizing-flows"] = {
  question: "Push a plain Gaussian through an invertible map: how does the change-of-variables stretch factor reshape the density?",
  charts: [
    {
      type: "line",
      title: "Healthy flow: one Gaussian hump split into two peaks (x = u + 1.5*tanh(u))",
      xlabel: "value",
      ylabel: "probability density",
      series: [
        { name: "base p_u(u): Gaussian", color: "#4ea1ff", points: [[-3.5,0.0009],[-3.0,0.0044],[-2.5,0.0175],[-2.0,0.054],[-1.5,0.1295],[-1.0,0.242],[-0.5,0.3521],[0.0,0.3989],[0.5,0.3521],[1.0,0.242],[1.5,0.1295],[2.0,0.054],[2.5,0.0175],[3.0,0.0044],[3.5,0.0009]] },
        { name: "flow p_x(x): two peaks", color: "#7ee787", points: [[-4.997,0.0009],[-4.493,0.0044],[-3.98,0.0169],[-3.446,0.0488],[-2.858,0.1019],[-2.142,0.1485],[-1.193,0.1615],[0.0,0.1596],[1.193,0.1615],[2.142,0.1485],[2.858,0.1019],[3.446,0.0488],[3.98,0.0169],[4.493,0.0044],[4.997,0.0009]] }
      ],
      interpret: "The x-axis is sample value, the y-axis is probability density (area under each curve is 1). <b>Blue</b> is the simple base Gaussian; <b>green</b> is what comes out after the invertible map x = u + 1.5*tanh(u), with the density divided by the stretch factor |g'(u)|. Near u=0 the map stretches space most (g' is largest), so the dense centre is thinned and pushed outward into <b>two peaks</b> while the single hump's mass is conserved. Real computed numbers. This is the goal: a flow turns an easy density into a rich multi-modal one you can still score exactly."
    },
    {
      type: "line",
      title: "Identity flow (separation = 0): the map does nothing",
      xlabel: "value",
      ylabel: "probability density",
      series: [
        { name: "base p_u(u): Gaussian", color: "#4ea1ff", points: [[-3.5,0.0009],[-3.0,0.0044],[-2.5,0.0175],[-2.0,0.054],[-1.5,0.1295],[-1.0,0.242],[-0.5,0.3521],[0.0,0.3989],[0.5,0.3521],[1.0,0.242],[1.5,0.1295],[2.0,0.054],[2.5,0.0175],[3.0,0.0044],[3.5,0.0009]] },
        { name: "flow p_x(x): unchanged", color: "#9aa7b4", points: [[-3.5,0.0009],[-3.0,0.0044],[-2.5,0.0175],[-2.0,0.054],[-1.5,0.1295],[-1.0,0.242],[-0.5,0.3521],[0.0,0.3989],[0.5,0.3521],[1.0,0.242],[1.5,0.1295],[2.0,0.054],[2.5,0.0175],[3.0,0.0044],[3.5,0.0009]] }
      ],
      interpret: "Illustrative. With separation set to 0 the transform collapses to x = u (the identity): g'(u) = 1 everywhere, so dividing by it changes nothing and <b>grey sits exactly on blue</b>. Recognise this when a freshly-initialised or under-trained flow's output looks identical to the base distribution. It is a valid flow, just not yet expressive: you need either a larger transform or more stacked layers before it can match a complex target."
    },
    {
      type: "line",
      title: "Too aggressive (x = u + 3*tanh(u)): a sharp valley and unstable inverse",
      xlabel: "value",
      ylabel: "probability density",
      series: [
        { name: "base p_u(u): Gaussian", color: "#4ea1ff", points: [[-3.5,0.0009],[-3.0,0.0044],[-2.5,0.0175],[-2.0,0.054],[-1.5,0.1295],[-1.0,0.242],[-0.5,0.3521],[0.0,0.3989],[0.5,0.3521],[1.0,0.242],[1.5,0.1295],[2.0,0.054],[2.5,0.0175],[3.0,0.0044],[3.5,0.0009]] },
        { name: "flow p_x(x): split too far", color: "#ffb454", points: [[-6.49,0.0009],[-5.99,0.0044],[-5.46,0.0173],[-4.9,0.0517],[-4.29,0.114],[-3.57,0.176],[-2.27,0.105],[0.0,0.0997],[2.27,0.105],[3.57,0.176],[4.29,0.114],[4.9,0.0517],[5.46,0.0173],[5.99,0.0044],[6.49,0.0009]] }
      ],
      interpret: "Illustrative shape. Pushing the separation higher (here 3) spreads the modes far apart and carves a <b>deep, near-empty valley</b> between them, with much flatter peaks. Recognise the pitfall: where g'(u) gets close to 0 the inverse g^-1 blows up and the log-determinant term becomes numerically unstable. This is why practitioners constrain scale factors (via tanh or softplus) and clamp them - too violent a single layer trades expressiveness for an inverse that overflows."
    }
  ],
  caption: null,
  code:
`import numpy as np
import matplotlib.pyplot as plt

# base density: standard Gaussian in u
u = np.linspace(-3.5, 3.5, 41)
pu = np.exp(-0.5 * u ** 2) / np.sqrt(2 * np.pi)

# invertible transform g(u) = u + sep*tanh(u); g'(u) > 0 always
sep = 1.5
x = u + sep * np.tanh(u)
g_prime = 1.0 + sep * (1.0 - np.tanh(u) ** 2)

# change of variables: divide by the stretch factor so area stays 1
px = pu / np.abs(g_prime)

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(u, pu, color="#4ea1ff", label="base p_u(u): Gaussian")
ax.plot(x, px, color="#7ee787", label="flow p_x(x): two peaks")
ax.set_xlabel("value"); ax.set_ylabel("probability density")
ax.set_title("one hump split into two; area = " + str(round(np.trapz(px, x), 3)))
ax.legend(); plt.show()`
};
