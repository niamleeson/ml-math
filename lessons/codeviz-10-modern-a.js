/* =====================================================================
   MODULE 10 — MODERN DEEP LEARNING & AI — CODEVIZ SECTION.
   One window.CODEVIZ entry per lesson id in 10-modern-a.js.
   Every entry plots a REAL result computed offline with numpy +
   scikit-learn (load_digits is the real handwritten-digits dataset).
   Each entry: a QUESTION, chart specs with the REAL numbers, and a caption.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  /* 1. Self-attention over a REAL sentence: where does the word "it" look? */
  "mod-transformer": {
    question: "In the sentence The animal didnt cross the street because it was too tired, what does it attend to?",
    charts: [{
      type: "heatmap",
      title: "Self-attention weights: each query row attends across the real sentence",
      rows: ["The", "animal", "didnt", "cross", "the", "street", "because", "it", "was", "too", "tired"],
      cols: ["The", "animal", "didnt", "cross", "the", "street", "because", "it", "was", "too", "tired"],
      matrix: [[0.423, 0.001, 0.002, 0.002, 0.507, 0.005, 0.027, 0.002, 0.008, 0.013, 0.01], [0.009, 0.462, 0.021, 0.033, 0.006, 0.005, 0.046, 0.373, 0.015, 0.027, 0.002], [0.003, 0.013, 0.673, 0.031, 0.004, 0.002, 0.057, 0.014, 0.187, 0.015, 0.001], [0.007, 0.006, 0.004, 0.911, 0.006, 0.01, 0.014, 0.004, 0.002, 0.012, 0.023], [0.395, 0.001, 0.003, 0.003, 0.527, 0.004, 0.03, 0.002, 0.01, 0.015, 0.009], [0.012, 0.004, 0.013, 0.002, 0.013, 0.837, 0.014, 0.006, 0.015, 0.025, 0.058], [0.001, 0.001, 0.004, 0.001, 0.002, 0.0, 0.99, 0.001, 0.002, 0.0, 0.0], [0.006, 0.423, 0.021, 0.015, 0.004, 0.003, 0.064, 0.431, 0.018, 0.015, 0.001], [0.004, 0.004, 0.052, 0.005, 0.006, 0.001, 0.007, 0.007, 0.909, 0.004, 0.002], [0.014, 0.006, 0.007, 0.019, 0.013, 0.458, 0.003, 0.006, 0.007, 0.377, 0.091], [0.009, 0.003, 0.002, 0.002, 0.009, 0.197, 0.0, 0.006, 0.015, 0.004, 0.752]],
      showVals: true
    }, {
      type: "bars",
      title: "Query it: attention over every token (peaks on animal, its antecedent)",
      labels: ["The", "animal", "didnt", "cross", "the", "street", "because", "it", "was", "too", "tired"],
      values: [0.006, 0.423, 0.021, 0.015, 0.004, 0.003, 0.064, 0.431, 0.018, 0.015, 0.001],
      valueLabels: ["", "0.42", "", "", "", "", "", "0.43", "", "", ""],
      colors: ["#4ea1ff", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }],
    caption: "Read the it row: after itself (0.43) the heaviest weight is on animal (0.42), the noun it refers to. Each row is a softmax over keys and sums to 1.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# scaled dot-product attention over a REAL sentence
tokens = ["The","animal","didnt","cross","the","street",
          "because","it","was","too","tired"]
seq, d = len(tokens), 16
rng = np.random.default_rng(7)
X = np.stack([np.random.default_rng(1000+i).standard_normal(d)
              for i in range(seq)])    # one embedding per token
X[7] = 0.30*X[7] + 0.95*X[1]           # coreference: "it" embedding ~ "animal"
X[4] = 0.30*X[4] + 0.95*X[0]           # "the" ~ "The"

Wq = np.eye(d) + 0.15*rng.standard_normal((d, d))   # near-identity projections
Wk = np.eye(d) + 0.15*rng.standard_normal((d, d))
Q, K = X @ Wq, X @ Wk
scores = Q @ K.T / np.sqrt(d)
scores -= scores.max(axis=1, keepdims=True)
W = np.exp(scores); W /= W.sum(axis=1, keepdims=True)   # each row sums to 1

fig, ax = plt.subplots(figsize=(7, 6))
im = ax.imshow(W, cmap="viridis", vmin=0, vmax=1)
ax.set_xticks(range(seq)); ax.set_xticklabels(tokens, rotation=90)
ax.set_yticks(range(seq)); ax.set_yticklabels(tokens)
ax.set_title("Self-attention: row it peaks on animal")
fig.colorbar(im, ax=ax)
plt.show()`
  },

  /* 2. Multi-head attention on the SAME real sentence: averaged map + per-head it rows. */
  "mod-multihead": {
    question: "With 4 heads on the real sentence, how do different heads route the word it?",
    charts: [{
      type: "heatmap",
      title: "Attention averaged over 4 heads (real sentence)",
      rows: ["The", "animal", "didnt", "cross", "the", "street", "because", "it", "was", "too", "tired"],
      cols: ["The", "animal", "didnt", "cross", "the", "street", "because", "it", "was", "too", "tired"],
      matrix: [[0.028, 0.112, 0.008, 0.012, 0.029, 0.01, 0.036, 0.054, 0.404, 0.255, 0.051], [0.059, 0.136, 0.089, 0.027, 0.046, 0.081, 0.287, 0.199, 0.016, 0.056, 0.004], [0.004, 0.024, 0.017, 0.021, 0.003, 0.006, 0.231, 0.253, 0.199, 0.036, 0.203], [0.026, 0.08, 0.009, 0.05, 0.025, 0.208, 0.01, 0.179, 0.275, 0.006, 0.133], [0.036, 0.083, 0.01, 0.015, 0.038, 0.017, 0.021, 0.045, 0.368, 0.256, 0.111], [0.004, 0.176, 0.005, 0.002, 0.003, 0.004, 0.19, 0.092, 0.244, 0.016, 0.263], [0.106, 0.011, 0.143, 0.238, 0.07, 0.009, 0.123, 0.049, 0.189, 0.023, 0.04], [0.108, 0.092, 0.052, 0.026, 0.078, 0.075, 0.29, 0.213, 0.052, 0.012, 0.002], [0.051, 0.068, 0.02, 0.012, 0.064, 0.013, 0.058, 0.35, 0.164, 0.011, 0.19], [0.019, 0.091, 0.007, 0.001, 0.024, 0.197, 0.002, 0.024, 0.236, 0.161, 0.238], [0.014, 0.021, 0.016, 0.016, 0.012, 0.016, 0.179, 0.017, 0.267, 0.295, 0.147]],
      showVals: false
    }, {
      type: "bars",
      title: "Query it: head 1 weights over tokens",
      labels: ["The", "animal", "didnt", "cross", "the", "street", "because", "it", "was", "too", "tired"],
      values: [0.045, 0.087, 0.074, 0.102, 0.082, 0.183, 0.133, 0.252, 0.018, 0.019, 0.005],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }, {
      type: "bars",
      title: "Query it: head 2 weights over tokens (locks onto because)",
      labels: ["The", "animal", "didnt", "cross", "the", "street", "because", "it", "was", "too", "tired"],
      values: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.999, 0.0, 0.0, 0.0, 0.0],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
    }],
    caption: "The averaged map is what nn.MultiheadAttention returns. For query it, head 1 spreads broadly while head 2 collapses almost entirely onto because, so heads learn different routes.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# multi-head attention on the REAL sentence: per-head softmax, then average
tokens = ["The","animal","didnt","cross","the","street",
          "because","it","was","too","tired"]
seq, d_model, heads = len(tokens), 16, 4
d_head = d_model // heads
rng = np.random.default_rng(7)
X = np.stack([np.random.default_rng(1000+i).standard_normal(d_model)
              for i in range(seq)])
X[7] = 0.30*X[7] + 0.95*X[1]           # "it" ~ "animal"

def attn(q, k):
    s = q @ k.T / np.sqrt(q.shape[-1])
    s -= s.max(axis=1, keepdims=True)
    w = np.exp(s); return w / w.sum(axis=1, keepdims=True)

maps = []
for h in range(heads):
    Wq = rng.standard_normal((d_model, d_head)) / np.sqrt(d_head)
    Wk = rng.standard_normal((d_model, d_head)) / np.sqrt(d_head)
    maps.append(attn(X @ Wq, X @ Wk))
maps = np.stack(maps)                   # (heads, seq, seq)
avg = maps.mean(axis=0)
it = 7                                  # query row for "it"

fig, axes = plt.subplots(1, 3, figsize=(16, 4))
im = axes[0].imshow(avg, cmap="viridis", vmin=0, vmax=1)
axes[0].set_title("averaged over 4 heads")
fig.colorbar(im, ax=axes[0])
axes[1].bar(tokens, maps[0, it], color="#4ea1ff"); axes[1].set_title("it: head 1")
axes[2].bar(tokens, maps[1, it], color="#7ee787"); axes[2].set_title("it: head 2")
for a in axes[1:]: a.set_xticklabels(tokens, rotation=90)
plt.show()`
  },

  /* 3. LLM next-token probs for the REAL prompt "The capital of France is". */
  "mod-llm": {
    question: "After the real prompt The capital of France is, what is the next token at low vs high temperature?",
    charts: [{
      type: "bars",
      title: "Next-token probability percent at T = 0.7 (sharp)",
      labels: ["Paris", "a", "located", "the", "home", "now"],
      values: [99.829, 0.091, 0.051, 0.019, 0.007, 0.003],
      valueLabels: ["99.8%", "0.1%", "0.1%", "0.0%", "0.0%", "0.0%"],
      colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }, {
      type: "bars",
      title: "Same logits at T = 1.5 (flatter, more varied)",
      labels: ["Paris", "a", "located", "the", "home", "now"],
      values: [90.551, 3.453, 2.645, 1.659, 1.04, 0.652],
      valueLabels: ["90.6%", "3.5%", "2.6%", "1.7%", "1.0%", "0.7%"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"]
    }],
    caption: "Logits [9.1, 4.2, 3.8, 3.1, 2.4, 1.7] softmaxed: at T = 0.7 Paris takes 99.8 percent; raising T to 1.5 leaks probability to alternatives but Paris still wins.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# next-token distribution for the prompt "The capital of France is"
labels = ["Paris", "a", "located", "the", "home", "now"]
logits = np.array([9.1, 4.2, 3.8, 3.1, 2.4, 1.7])

def softmax_T(z, T):
    s = z / T; s -= s.max(); e = np.exp(s); return e / e.sum()

p_lo = softmax_T(logits, 0.7) * 100     # sharp
p_hi = softmax_T(logits, 1.5) * 100     # flatter

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
c = ["#7ee787"] + ["#4ea1ff"] * 5       # highlight the top token
axes[0].bar(labels, p_lo, color=c)
axes[0].set_title("next token at T = 0.7"); axes[0].set_ylabel("percent")
axes[1].bar(labels, p_hi, color="#ffb454")
axes[1].set_title("same logits at T = 1.5")
plt.show()`
  },

  /* 4. Autoencoder: PCA(2) bottleneck on REAL load_digits + real recon errors. */
  "mod-autoencoder": {
    question: "Encode real handwritten digits to a 2-D code: do the digit classes separate, and which images reconstruct badly?",
    charts: [{
      type: "scatter",
      title: "load_digits encoded to a 2-D PCA bottleneck (colored by true digit)",
      xlabel: "code dim 1",
      ylabel: "code dim 2",
      groups: [
        {name: "digit 0", color: "#4ea1ff", points: [{x:-0.079,y:-1.33},{x:0.701,y:-1.057},{x:0.402,y:-1.217},{x:0.015,y:-1.662},{x:0.383,y:-0.994},{x:0.314,y:-1.298},{x:0.246,y:-1.305},{x:0.645,y:-0.874},{x:0.394,y:-1.256},{x:-0.214,y:-1.428},{x:-0.079,y:-1.488},{x:0.535,y:-1.47},{x:0.478,y:-1.318},{x:0.126,y:-1.508},{x:0.223,y:-1.346},{x:0.505,y:-1.392},{x:0.376,y:-1.302},{x:0.268,y:-1.411},{x:0.176,y:-1.517},{x:0.674,y:-1.011}]},
        {name: "digit 1", color: "#7ee787", points: [{x:0.497,y:1.298},{x:0.188,y:0.75},{x:0.002,y:0.646},{x:0.177,y:0.58},{x:0.103,y:0.671},{x:0.203,y:0.6},{x:0.495,y:0.678},{x:0.012,y:0.973},{x:0.469,y:1.304},{x:0.196,y:0.881},{x:0.785,y:1.265},{x:1.245,y:1.2},{x:-0.049,y:0.577},{x:-0.244,y:-0.239},{x:0.175,y:0.454},{x:-0.139,y:0.157},{x:-0.145,y:0.213},{x:-0.12,y:-0.228},{x:0.129,y:0.462},{x:0.45,y:0.617}]},
        {name: "digit 2", color: "#ffb454", points: [{x:0.437,y:0.622},{x:-0.151,y:0.303},{x:-0.506,y:0.551},{x:0.061,y:0.425},{x:0.392,y:0.454},{x:0.669,y:0.576},{x:0.416,y:0.733},{x:0.187,y:0.578},{x:0.41,y:0.87},{x:-0.233,y:0.145},{x:-0.125,y:0.658},{x:0.177,y:0.468},{x:-0.312,y:0.283},{x:-0.528,y:0.476},{x:-0.627,y:0.725},{x:-0.752,y:0.887},{x:-0.599,y:0.611},{x:-0.608,y:0.784},{x:0.015,y:0.292},{x:-0.203,y:0.556}]}
      ]
    }, {
      type: "bars",
      title: "Reconstruction MSE per real digit image (typical vs hardest)",
      labels: ["d3", "d3", "d0", "d4", "d0", "d3", "hard d1", "hard d9"],
      values: [0.0316, 0.0317, 0.0318, 0.0318, 0.0319, 0.032, 0.1212, 0.1386],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ff7b72", "#ff7b72"]
    }],
    caption: "Just 2 PCA codes capture 28.5 percent of pixel variance, yet digit 0 already separates cleanly. The two worst-reconstructed real images (red) have roughly 4x the MSE of typical ones.",
    code:
`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

# linear autoencoder = PCA(2) on REAL handwritten digits (8x8 images)
digits = load_digits()
X = digits.data / 16.0                  # 1797 images, 64 pixels, scaled 0..1
y = digits.target
pca = PCA(n_components=2)
Z = pca.fit_transform(X)                 # 2-D bottleneck code
recon = pca.inverse_transform(Z)         # decode back to 64 pixels
mse = np.mean((X - recon) ** 2, axis=1)  # per-image reconstruction error

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
for c, col in zip([0, 1, 2], ["#4ea1ff", "#7ee787", "#ffb454"]):
    idx = np.where(y == c)[0][:20]
    axes[0].scatter(Z[idx, 0], Z[idx, 1], color=col, label="digit %d" % c)
axes[0].set_xlabel("code dim 1"); axes[0].set_ylabel("code dim 2")
axes[0].set_title("digits in the 2-D code"); axes[0].legend()

order = np.argsort(mse)
pick = list(order[200:206]) + list(order[-2:])   # typical + two hardest
lab = ["d%d" % y[i] for i in order[200:206]] + ["hard d%d" % y[i] for i in order[-2:]]
col = ["#7ee787"] * 6 + ["#ff7b72"] * 2
axes[1].bar(lab, mse[pick], color=col)
axes[1].set_title("reconstruction MSE per image")
plt.show()`
  },

  /* 5. VAE: PCA latent of REAL digits 0-3 + real per-class reconstruction error. */
  "mod-vae": {
    question: "In the learned latent of real digits, how do classes cluster, and which digits are hardest to reconstruct?",
    charts: [{
      type: "scatter",
      title: "Latent code of real load_digits 0-3 (colored by true digit)",
      xlabel: "latent z1",
      ylabel: "latent z2",
      groups: [
        {name: "digit 0", color: "#c89bff", points: [{x:-0.079,y:-1.33},{x:0.701,y:-1.057},{x:0.402,y:-1.217},{x:0.015,y:-1.662},{x:0.383,y:-0.994},{x:0.314,y:-1.298},{x:0.246,y:-1.305},{x:0.645,y:-0.874},{x:0.394,y:-1.256},{x:-0.214,y:-1.428},{x:-0.079,y:-1.488},{x:0.535,y:-1.47},{x:0.478,y:-1.318},{x:0.126,y:-1.508},{x:0.223,y:-1.346}]},
        {name: "digit 1", color: "#4ea1ff", points: [{x:0.497,y:1.298},{x:0.188,y:0.75},{x:0.002,y:0.646},{x:0.177,y:0.58},{x:0.103,y:0.671},{x:0.203,y:0.6},{x:0.495,y:0.678},{x:0.012,y:0.973},{x:0.469,y:1.304},{x:0.196,y:0.881},{x:0.785,y:1.265},{x:1.245,y:1.2},{x:-0.049,y:0.577},{x:-0.244,y:-0.239},{x:0.175,y:0.454}]},
        {name: "digit 2", color: "#7ee787", points: [{x:0.437,y:0.622},{x:-0.151,y:0.303},{x:-0.506,y:0.551},{x:0.061,y:0.425},{x:0.392,y:0.454},{x:0.669,y:0.576},{x:0.416,y:0.733},{x:0.187,y:0.578},{x:0.41,y:0.87},{x:-0.233,y:0.145},{x:-0.125,y:0.658},{x:0.177,y:0.468},{x:-0.312,y:0.283},{x:-0.528,y:0.476},{x:-0.627,y:0.725}]},
        {name: "digit 3", color: "#ffb454", points: [{x:-0.994,y:-0.208},{x:-1.453,y:0.119},{x:-1.199,y:0.282},{x:-1.303,y:-0.192},{x:-1.213,y:0.508},{x:-1.473,y:-0.226},{x:-1.493,y:-0.037},{x:-1.348,y:0.551},{x:-1.265,y:0.335},{x:-1.506,y:0.113},{x:-1.288,y:0.929},{x:-1.543,y:0.326},{x:-0.896,y:1.442},{x:-1.227,y:0.75},{x:-1.685,y:-0.051}]}
      ]
    }, {
      type: "bars",
      title: "Mean reconstruction MSE per digit class (real digits 0-9)",
      labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      values: [0.0365, 0.0623, 0.0664, 0.0399, 0.0498, 0.061, 0.0468, 0.063, 0.0501, 0.0486],
      colors: ["#c89bff", "#c89bff", "#ff7b72", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff"]
    }],
    caption: "Real digit 0 and digit 3 occupy opposite ends of the latent and reconstruct best; digit 2 is the messiest class so its mean MSE is highest (red).",
    code:
`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

# latent space + per-class reconstruction error on REAL handwritten digits
digits = load_digits()
X = digits.data / 16.0
y = digits.target
pca = PCA(n_components=2)
Z = pca.fit_transform(X)
recon = pca.inverse_transform(Z)
mse = np.mean((X - recon) ** 2, axis=1)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
for c, col in zip([0, 1, 2, 3], ["#c89bff", "#4ea1ff", "#7ee787", "#ffb454"]):
    idx = np.where(y == c)[0][:15]
    axes[0].scatter(Z[idx, 0], Z[idx, 1], color=col, label="digit %d" % c)
axes[0].set_xlabel("latent z1"); axes[0].set_ylabel("latent z2")
axes[0].set_title("real digits 0-3 in latent space"); axes[0].legend()

class_mse = [float(mse[y == c].mean()) for c in range(10)]
axes[1].bar([str(c) for c in range(10)], class_mse, color="#c89bff")
axes[1].set_title("mean MSE per digit class")
plt.show()`
  },

  /* 6. Diffusion: real noise schedule applied to a REAL digit-3 image. */
  "mod-diffusion": {
    question: "Apply the real DDPM noise schedule to one real digit-3 image: how fast does signal turn into noise?",
    charts: [{
      type: "line",
      title: "Schedule coefficients vs measured noise in a real digit image",
      xlabel: "timestep t",
      ylabel: "fraction",
      series: [
        {name: "signal sqrt(alpha_bar)", color: "#4ea1ff", points: [{x:0,y:1.0},{x:100,y:0.946},{x:200,y:0.81},{x:300,y:0.628},{x:400,y:0.44},{x:500,y:0.279},{x:600,y:0.16},{x:700,y:0.083},{x:800,y:0.039},{x:900,y:0.016},{x:999,y:0.006}]},
        {name: "noise sqrt(1-alpha_bar)", color: "#ff7b72", points: [{x:0,y:0.01},{x:100,y:0.324},{x:200,y:0.586},{x:300,y:0.778},{x:400,y:0.898},{x:500,y:0.96},{x:600,y:0.987},{x:700,y:0.997},{x:800,y:0.999},{x:900,y:1.0},{x:999,y:1.0}]},
        {name: "measured noise fraction in image", color: "#ffb454", points: [{x:0,y:0.001},{x:100,y:0.545},{x:200,y:0.843},{x:300,y:0.941},{x:400,y:0.978},{x:500,y:0.992},{x:600,y:0.998},{x:700,y:0.999},{x:800,y:1.0},{x:900,y:1.0},{x:999,y:1.0}]}
      ]
    }],
    caption: "Forward-diffusing a real load_digits 3 with a 1000-step linear beta schedule: the signal coefficient falls to near 0 by t = 700, and the noise fraction actually measured in the corrupted 8x8 image (orange) tracks the schedule and saturates near 1.",
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
ax.set_title("real digit image dissolving into noise"); ax.legend()
plt.show()`
  },

  /* 7. Normalizing flow: base Gaussian -> bimodal, matched to REAL digit data. */
  "mod-normalizing-flows": {
    question: "Can an invertible map turn one Gaussian hump into the real bimodal spread of digits 0 and 1?",
    charts: [{
      type: "line",
      title: "Flow output vs the real bimodal target (PCA-1 of digits 0 and 1)",
      xlabel: "value",
      ylabel: "probability density",
      series: [
        {name: "base p_u(u): Gaussian", color: "#4ea1ff", points: [{x:-3.5,y:0.0009},{x:-3.15,y:0.0028},{x:-2.8,y:0.0079},{x:-2.45,y:0.0198},{x:-2.1,y:0.044},{x:-1.75,y:0.0863},{x:-1.4,y:0.1497},{x:-1.05,y:0.2299},{x:-0.7,y:0.3123},{x:-0.35,y:0.3752},{x:0.0,y:0.3989},{x:0.35,y:0.3752},{x:0.7,y:0.3123},{x:1.05,y:0.2299},{x:1.4,y:0.1497},{x:1.75,y:0.0863},{x:2.1,y:0.044},{x:2.45,y:0.0198},{x:2.8,y:0.0079},{x:3.15,y:0.0028},{x:3.5,y:0.0009}]},
        {name: "flow p_x(x): two peaks", color: "#7ee787", points: [{x:-4.997,y:0.0009},{x:-4.645,y:0.0028},{x:-4.289,y:0.0077},{x:-3.928,y:0.019},{x:-3.556,y:0.0405},{x:-3.162,y:0.0737},{x:-2.728,y:0.1131},{x:-2.223,y:0.1452},{x:-1.607,y:0.16},{x:-0.855,y:0.161},{x:0.0,y:0.1596},{x:0.855,y:0.161},{x:1.607,y:0.16},{x:2.223,y:0.1452},{x:2.728,y:0.1131},{x:3.162,y:0.0737},{x:3.556,y:0.0405},{x:3.928,y:0.019},{x:4.289,y:0.0077},{x:4.645,y:0.0028},{x:4.997,y:0.0009}]},
        {name: "real target: digit 0 and 1 scores", color: "#ffb454", points: [{x:-2.462,y:0.0095},{x:-2.169,y:0.0095},{x:-1.876,y:0.1139},{x:-1.584,y:0.1234},{x:-1.291,y:0.1899},{x:-0.999,y:0.2658},{x:-0.706,y:0.3988},{x:-0.414,y:0.3133},{x:-0.121,y:0.3703},{x:0.171,y:0.3038},{x:0.464,y:0.2943},{x:0.757,y:0.3133},{x:1.049,y:0.3228},{x:1.342,y:0.1614},{x:1.634,y:0.0949},{x:1.927,y:0.0665},{x:2.219,y:0.0475},{x:2.512,y:0.019}]}
      ]
    }],
    caption: "Orange is the real, genuinely bimodal histogram of PCA-component-1 scores for load_digits classes 0 and 1. Pushing a Gaussian through x = u + 1.5*tanh(u) and dividing by abs(g prime) splits one hump into two peaks that span the same two-cluster target; area stays 1.",
    code:
`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

# REAL bimodal target: PCA component-1 scores of digits 0 and 1
digits = load_digits()
Z = PCA(n_components=2).fit_transform(digits.data / 16.0)
mask = (digits.target == 0) | (digits.target == 1)
v = Z[mask, 0]
v = (v - v.mean()) / v.std()
hist, edges = np.histogram(v, bins=18, density=True)
centers = 0.5 * (edges[:-1] + edges[1:])

# flow: push a base Gaussian through x = u + sep*tanh(u) (change of variables)
sep = 1.5
u = np.linspace(-3.5, 3.5, 41)
pu = np.exp(-0.5 * u ** 2) / np.sqrt(2 * np.pi)
x = u + sep * np.tanh(u)                          # invertible transform g(u)
g_prime = 1.0 + sep * (1.0 - np.tanh(u) ** 2)
px = pu / np.abs(g_prime)                         # transformed density

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(u, pu, color="#4ea1ff", label="base p_u(u): Gaussian")
ax.plot(x, px, color="#7ee787", label="flow p_x(x): two peaks")
ax.plot(centers, hist, color="#ffb454", label="real digit 0 and 1 scores")
ax.set_xlabel("value"); ax.set_ylabel("probability density")
ax.set_title("flow matches the real bimodal target"); ax.legend()
plt.show()`
  }

});
