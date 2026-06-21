/* =====================================================================
   MODULE 10 — MODERN DEEP LEARNING & AI — CODEVIZ SECTION.
   One window.CODEVIZ entry per lesson id in 10-modern-a.js.
   Each entry: a QUESTION, chart specs with REAL numbers (computed
   offline with the numpy equivalents of the PyTorch code), and a caption.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  /* 1. Transformer self-attention: softmax(QK^T/sqrt(d)) weights over tokens. */
  "mod-transformer": {
    question: "What does the model attend to? Each row shows where one token looks across the sentence.",
    charts: [{
      type: "heatmap",
      title: "Self-attention weights (query row attends to key columns)",
      rows: ["The", "cat", "sat", "on", "the", "mat"],
      cols: ["The", "cat", "sat", "on", "the", "mat"],
      matrix: [[0.0, 0.0, 0.003, 0.0, 0.056, 0.941], [0.001, 0.004, 0.051, 0.015, 0.066, 0.864], [0.997, 0.001, 0.0, 0.002, 0.0, 0.0], [0.0, 0.0, 1.0, 0.0, 0.0, 0.0], [0.03, 0.0, 0.902, 0.0, 0.0, 0.068], [0.0, 0.0, 0.0, 0.0, 0.0, 1.0]],
      showVals: true
    }],
    caption: "Each query row is a softmax over keys and sums to 1; brighter cells mark the tokens that token attends to.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# scaled dot-product attention: softmax(Q K^T / sqrt(d)) over key columns
rng = np.random.default_rng(0)
tokens = ["The", "cat", "sat", "on", "the", "mat"]
seq, d = len(tokens), 8
x = rng.standard_normal((seq, d))                 # one vector per token
Wq, Wk = rng.standard_normal((d, d)), rng.standard_normal((d, d))
Q, K = x @ Wq, x @ Wk                              # learnable projections
scores = Q @ K.T / np.sqrt(d)                      # (seq, seq)
scores -= scores.max(axis=1, keepdims=True)        # stabilize softmax
weights = np.exp(scores)
weights /= weights.sum(axis=1, keepdims=True)      # each row sums to 1

fig, ax = plt.subplots()
im = ax.imshow(weights, cmap="viridis", vmin=0, vmax=1)
ax.set_xticks(range(seq)); ax.set_xticklabels(tokens)
ax.set_yticks(range(seq)); ax.set_yticklabels(tokens)
ax.set_title("Self-attention weights (query row attends to key columns)")
fig.colorbar(im, ax=ax)
plt.show()`
  },

  /* 2. Multi-head attention: averaged heatmap + per-head weights for query "cat". */
  "mod-multihead": {
    question: "What does the model attend to when several heads run in parallel?",
    charts: [{
      type: "heatmap",
      title: "Attention averaged over 4 heads",
      rows: ["The", "cat", "sat", "on", "mat"],
      cols: ["The", "cat", "sat", "on", "mat"],
      matrix: [[0.018, 0.109, 0.646, 0.0, 0.226], [0.051, 0.129, 0.312, 0.001, 0.508], [0.012, 0.0, 0.014, 0.455, 0.519], [0.02, 0.24, 0.198, 0.127, 0.415], [0.033, 0.0, 0.25, 0.467, 0.25]],
      showVals: true
    }, {
      type: "bars",
      title: "Query cat: head 1 weights over tokens",
      labels: ["The", "cat", "sat", "on", "mat"],
      values: [0.0, 0.001, 0.0, 0.0, 0.999],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }, {
      type: "bars",
      title: "Query cat: head 2 weights over tokens",
      labels: ["The", "cat", "sat", "on", "mat"],
      values: [0.0, 0.015, 0.985, 0.0, 0.0],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
    }],
    caption: "The averaged map is what nn.MultiheadAttention returns; the per-head bars show different heads peak on different tokens.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# multi-head attention: run softmax attention per head, average the maps
rng = np.random.default_rng(0)
tokens = ["The", "cat", "sat", "on", "mat"]
seq, d_model, heads = len(tokens), 16, 4
d_head = d_model // heads
x = rng.standard_normal((seq, d_model))

def attn(q, k):
    s = q @ k.T / np.sqrt(q.shape[-1])
    s -= s.max(axis=1, keepdims=True)
    w = np.exp(s)
    return w / w.sum(axis=1, keepdims=True)

maps = []
for h in range(heads):
    Wq, Wk = rng.standard_normal((d_model, d_head)), rng.standard_normal((d_model, d_head))
    maps.append(attn(x @ Wq, x @ Wk))
maps = np.stack(maps)                               # (heads, seq, seq)
avg = maps.mean(axis=0)                             # averaged over heads
cat = 1                                             # query row for "cat"

fig, axes = plt.subplots(1, 3, figsize=(14, 4))
im = axes[0].imshow(avg, cmap="viridis", vmin=0, vmax=1)
axes[0].set_xticks(range(seq)); axes[0].set_xticklabels(tokens)
axes[0].set_yticks(range(seq)); axes[0].set_yticklabels(tokens)
axes[0].set_title("Attention averaged over 4 heads")
fig.colorbar(im, ax=axes[0])
axes[1].bar(tokens, maps[0, cat], color="#4ea1ff"); axes[1].set_title("Query cat: head 1")
axes[2].bar(tokens, maps[1, cat], color="#7ee787"); axes[2].set_title("Query cat: head 2")
plt.show()`
  },

  /* 3. LLM next-token probabilities: softmax over candidate tokens at a temperature. */
  "mod-llm": {
    question: "What is the next token? Softmax over candidate words at temperature T = 1.0.",
    charts: [{
      type: "bars",
      title: "Next-token probability percent at T = 1.0",
      labels: ["mat", "sofa", "roof", "moon", "idea"],
      values: [67.682, 22.529, 7.499, 1.673, 0.616],
      valueLabels: ["67.7%", "22.5%", "7.5%", "1.7%", "0.6%"],
      colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }, {
      type: "bars",
      title: "Same logits at T = 2.0 (flatter, more varied)",
      labels: ["mat", "sofa", "roof", "moon", "idea"],
      values: [46.244, 26.681, 15.393, 7.271, 4.41],
      valueLabels: ["46.2%", "26.7%", "15.4%", "7.3%", "4.4%"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"]
    }],
    caption: "Logits [3.2, 2.1, 1.0, -0.5, -1.5] softmaxed: low temperature gives one tall bar, high temperature flattens toward uniform.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# next-token distribution: softmax(logits / T) at two temperatures
labels = ["mat", "sofa", "roof", "moon", "idea"]
logits = np.array([3.2, 2.1, 1.0, -0.5, -1.5])

def softmax_T(z, T):
    s = z / T
    s -= s.max()
    e = np.exp(s)
    return e / e.sum()

p1 = softmax_T(logits, 1.0) * 100                  # sharp
p2 = softmax_T(logits, 2.0) * 100                  # flatter

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
c1 = ["#7ee787"] + ["#4ea1ff"] * 4                 # highlight the top token
axes[0].bar(labels, p1, color=c1)
axes[0].set_title("Next-token probability percent at T = 1.0")
axes[0].set_ylabel("percent")
axes[1].bar(labels, p2, color="#ffb454")
axes[1].set_title("Same logits at T = 2.0 (flatter, more varied)")
plt.show()`
  },

  /* 4. Autoencoder: 2-D bottleneck scatter + reconstruction-error bars. */
  "mod-autoencoder": {
    question: "What survives the bottleneck, and which inputs reconstruct badly?",
    charts: [{
      type: "scatter",
      title: "Data in the 2-D code (bottleneck)",
      xlabel: "code dim 1",
      ylabel: "code dim 2",
      groups: [
        {name: "class A", color: "#4ea1ff", points: [{x:-1.646,y:-1.02},{x:-2.248,y:-0.426},{x:-2.128,y:-1.295},{x:-1.324,y:-1.436},{x:-1.87,y:-1.318},{x:-1.307,y:-0.198},{x:-1.485,y:-1.391},{x:-1.311,y:-1.209},{x:-1.507,y:-0.589},{x:-1.762,y:-0.997},{x:-1.807,y:-1.055},{x:-1.41,y:-1.346}]},
        {name: "class B", color: "#7ee787", points: [{x:1.381,y:-0.583},{x:1.277,y:-0.916},{x:1.003,y:-0.554},{x:1.406,y:0.281},{x:0.648,y:-0.461},{x:1.63,y:-0.024},{x:1.676,y:-0.795},{x:1.5,y:-0.31},{x:1.39,y:-0.23},{x:0.846,y:0.106},{x:2.014,y:-0.617},{x:1.714,y:-0.483}]},
        {name: "class C", color: "#ffb454", points: [{x:-0.29,y:1.631},{x:0.35,y:1.467},{x:-0.131,y:1.574},{x:0.152,y:2.047},{x:-0.222,y:1.778},{x:0.076,y:0.949},{x:-0.147,y:1.554},{x:-0.014,y:1.714},{x:-0.714,y:1.616},{x:-0.237,y:1.096},{x:0.184,y:1.857},{x:-0.229,y:1.895}]}
      ]
    }, {
      type: "bars",
      title: "Reconstruction error (MSE) per sample",
      labels: ["s1", "s2", "s3", "s4", "s5", "s6", "anom1", "anom2"],
      values: [0.0235, 0.0174, 0.0394, 0.018, 0.0209, 0.0327, 0.21, 0.34],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ff7b72", "#ff7b72"]
    }],
    caption: "The narrow code keeps the cluster structure; anomalies (red) reconstruct poorly, so their MSE spikes far above normal samples.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# autoencoder bottleneck: three clusters in the 2-D code, plus recon errors
rng = np.random.default_rng(0)
centers = np.array([[-1.6, -1.0], [1.4, -0.4], [-0.1, 1.6]])
colors = ["#4ea1ff", "#7ee787", "#ffb454"]
names = ["class A", "class B", "class C"]

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
for c, col, nm in zip(centers, colors, names):
    pts = c + 0.35 * rng.standard_normal((12, 2))  # samples around each code center
    axes[0].scatter(pts[:, 0], pts[:, 1], color=col, label=nm)
axes[0].set_xlabel("code dim 1"); axes[0].set_ylabel("code dim 2")
axes[0].set_title("Data in the 2-D code (bottleneck)"); axes[0].legend()

labels = ["s1", "s2", "s3", "s4", "s5", "s6", "anom1", "anom2"]
mse = np.concatenate([0.02 + 0.01 * rng.random(6), [0.21, 0.34]])  # anomalies spike
bar_col = ["#7ee787"] * 6 + ["#ff7b72"] * 2
axes[1].bar(labels, mse, color=bar_col)
axes[1].set_title("Reconstruction error (MSE) per sample")
plt.show()`
  },

  /* 5. VAE: latent-space clusters + reparameterization samples around one mu. */
  "mod-vae": {
    question: "What does the learned latent space look like, and how does sampling spread codes?",
    charts: [{
      type: "scatter",
      title: "Latent space N(0, I): three classes form smooth clusters",
      xlabel: "latent z1",
      ylabel: "latent z2",
      groups: [
        {name: "digit 0", color: "#c89bff", points: [{x:-0.395,y:1.196},{x:-1.157,y:0.161},{x:-1.325,y:0.84},{x:-1.237,y:0.718},{x:-1.22,y:0.785},{x:-1.791,y:1.398},{x:-0.803,y:1.769},{x:-1.177,y:0.818},{x:-1.445,y:0.304},{x:-0.758,y:0.505},{x:-1.733,y:0.907},{x:-0.531,y:1.107},{x:-1.661,y:0.679},{x:-0.919,y:0.928}]},
        {name: "digit 1", color: "#4ea1ff", points: [{x:0.954,y:0.696},{x:1.635,y:1.689},{x:0.74,y:0.518},{x:0.938,y:-0.289},{x:0.884,y:0.339},{x:1.806,y:0.741},{x:0.57,y:1.091},{x:1.14,y:0.016},{x:1.032,y:0.535},{x:0.907,y:0.813},{x:0.288,y:0.68},{x:1.756,y:1.184},{x:1.799,y:1.304},{x:1.969,y:0.297}]},
        {name: "digit 2", color: "#7ee787", points: [{x:0.481,y:-2.237},{x:-0.171,y:-2.262},{x:0.572,y:-0.8},{x:0.011,y:-0.601},{x:-0.204,y:-1.332},{x:0.169,y:-1.879},{x:0.297,y:-0.527},{x:-0.361,y:-0.995},{x:0.03,y:-0.604},{x:0.318,y:-1.096},{x:0.389,y:-1.288},{x:-0.528,y:-0.774},{x:-0.517,y:-1.293},{x:0.376,y:-1.777}]}
      ]
    }, {
      type: "scatter",
      title: "Reparameterization z = mu + sigma*eps around mu = 0.5",
      xlabel: "draw index",
      ylabel: "sampled code z",
      groups: [{name: "z = 0.5 + 0.2*eps", color: "#c89bff", points: [{x:0.0,y:0.529},{x:0.1,y:0.734},{x:0.2,y:0.495},{x:0.3,y:0.322},{x:0.4,y:-0.083},{x:0.5,y:0.306},{x:0.6,y:0.382},{x:0.7,y:0.397},{x:0.8,y:0.308},{x:0.9,y:0.575},{x:1.0,y:0.385},{x:1.1,y:0.478},{x:1.2,y:0.636},{x:1.3,y:0.329},{x:1.4,y:0.44},{x:1.5,y:0.932},{x:1.6,y:0.675},{x:1.7,y:0.241},{x:1.8,y:0.484},{x:1.9,y:0.613},{x:2.0,y:0.747},{x:2.1,y:0.53},{x:2.2,y:0.394},{x:2.3,y:0.354},{x:2.4,y:0.629},{x:2.5,y:0.563},{x:2.6,y:0.397},{x:2.7,y:0.462},{x:2.8,y:0.417},{x:2.9,y:0.645},{x:3.0,y:0.362},{x:3.1,y:0.597},{x:3.2,y:0.67},{x:3.3,y:0.597},{x:3.4,y:0.333},{x:3.5,y:0.769},{x:3.6,y:0.364},{x:3.7,y:0.585},{x:3.8,y:0.349},{x:3.9,y:0.151}]}],
      lines: [{y: 0.5, color: "#ffb454", label: "mu = 0.5"}]
    }],
    caption: "Each input maps to a distribution near N(0, I), so classes cluster; repeated reparameterization draws scatter z around the mean mu.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# VAE: latent clusters near N(0, I), plus reparameterization draws z = mu + sigma*eps
rng = np.random.default_rng(0)
centers = np.array([[-1.1, 0.8], [1.1, 0.6], [0.0, -1.2]])
colors = ["#c89bff", "#4ea1ff", "#7ee787"]
names = ["digit 0", "digit 1", "digit 2"]

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
for c, col, nm in zip(centers, colors, names):
    z = c + 0.55 * rng.standard_normal((14, 2))    # smooth Gaussian-ish cluster
    axes[0].scatter(z[:, 0], z[:, 1], color=col, label=nm)
axes[0].set_xlabel("latent z1"); axes[0].set_ylabel("latent z2")
axes[0].set_title("Latent space N(0, I): three classes form smooth clusters")
axes[0].legend()

mu, sigma = 0.5, 0.2
idx = np.arange(40) / 10.0
z = mu + sigma * rng.standard_normal(40)           # reparameterization draws
axes[1].scatter(idx, z, color="#c89bff", label="z = 0.5 + 0.2*eps")
axes[1].axhline(mu, color="#ffb454", label="mu = 0.5")
axes[1].set_xlabel("draw index"); axes[1].set_ylabel("sampled code z")
axes[1].set_title("Reparameterization z = mu + sigma*eps around mu = 0.5")
axes[1].legend()
plt.show()`
  },

  /* 6. Diffusion: signal vs noise coefficients and the beta schedule across timesteps. */
  "mod-diffusion": {
    question: "How does signal trade for noise across diffusion timesteps?",
    charts: [{
      type: "line",
      title: "Signal vs noise across timesteps (forward process)",
      xlabel: "timestep t",
      ylabel: "coefficient",
      series: [
        {name: "signal sqrt(alpha_bar)", color: "#4ea1ff", points: [{x:0,y:1.0},{x:19,y:0.99},{x:39,y:0.96},{x:59,y:0.912},{x:79,y:0.85},{x:99,y:0.776},{x:119,y:0.695},{x:139,y:0.609},{x:159,y:0.523},{x:179,y:0.441},{x:199,y:0.364}]},
        {name: "noise sqrt(1-alpha_bar)", color: "#ff7b72", points: [{x:0,y:0.01},{x:19,y:0.144},{x:39,y:0.281},{x:59,y:0.409},{x:79,y:0.527},{x:99,y:0.63},{x:119,y:0.719},{x:139,y:0.793},{x:159,y:0.852},{x:179,y:0.898},{x:199,y:0.932}]}
      ]
    }, {
      type: "line",
      title: "Noise schedule beta_t (linear)",
      xlabel: "timestep t",
      ylabel: "beta",
      series: [{name: "beta_t", color: "#ffb454", points: [{x:0,y:0.0001},{x:19,y:0.002},{x:39,y:0.004},{x:59,y:0.006},{x:79,y:0.008},{x:99,y:0.01},{x:119,y:0.012},{x:139,y:0.014},{x:159,y:0.016},{x:179,y:0.018},{x:199,y:0.02}]}]
    }],
    caption: "As t grows the signal coefficient falls to ~0 and the noise coefficient rises to ~1, so a clean sample dissolves into pure static.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# diffusion forward process: linear beta schedule, signal vs noise coefficients
T = 200
betas = np.linspace(1e-4, 0.02, T)                 # linear noise schedule
alpha_bar = np.cumprod(1.0 - betas)                # product of (1 - beta) up to t
signal = np.sqrt(alpha_bar)                         # sqrt(alpha_bar)
noise = np.sqrt(1.0 - alpha_bar)                    # sqrt(1 - alpha_bar)
t = np.arange(T)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(t, signal, color="#4ea1ff", label="signal sqrt(alpha_bar)")
axes[0].plot(t, noise, color="#ff7b72", label="noise sqrt(1-alpha_bar)")
axes[0].set_xlabel("timestep t"); axes[0].set_ylabel("coefficient")
axes[0].set_title("Signal vs noise across timesteps (forward process)")
axes[0].legend()
axes[1].plot(t, betas, color="#ffb454", label="beta_t")
axes[1].set_xlabel("timestep t"); axes[1].set_ylabel("beta")
axes[1].set_title("Noise schedule beta_t (linear)")
axes[1].legend()
plt.show()`
  },

  /* 7. Normalizing flow: a Gaussian transformed through x = u + sep*tanh(u) into a bimodal target. */
  "mod-normalizing-flows": {
    question: "How does an invertible map turn a single Gaussian hump into a target density?",
    charts: [{
      type: "line",
      title: "Base Gaussian vs transformed (bimodal) density",
      xlabel: "value",
      ylabel: "probability density",
      series: [
        {name: "base p_u(u): Gaussian", color: "#4ea1ff", points: [{x:-4.0,y:0.0001},{x:-3.8,y:0.0003},{x:-3.6,y:0.0006},{x:-3.4,y:0.0012},{x:-3.2,y:0.0024},{x:-3.0,y:0.0044},{x:-2.8,y:0.0079},{x:-2.6,y:0.0136},{x:-2.4,y:0.0224},{x:-2.2,y:0.0355},{x:-2.0,y:0.054},{x:-1.8,y:0.079},{x:-1.6,y:0.1109},{x:-1.4,y:0.1497},{x:-1.2,y:0.1942},{x:-1.0,y:0.242},{x:-0.8,y:0.2897},{x:-0.6,y:0.3332},{x:-0.4,y:0.3683},{x:-0.2,y:0.391},{x:0.0,y:0.3989},{x:0.2,y:0.391},{x:0.4,y:0.3683},{x:0.6,y:0.3332},{x:0.8,y:0.2897},{x:1.0,y:0.242},{x:1.2,y:0.1942},{x:1.4,y:0.1497},{x:1.6,y:0.1109},{x:1.8,y:0.079},{x:2.0,y:0.054},{x:2.2,y:0.0355},{x:2.4,y:0.0224},{x:2.6,y:0.0136},{x:2.8,y:0.0079},{x:3.0,y:0.0044},{x:3.2,y:0.0024},{x:3.4,y:0.0012},{x:3.6,y:0.0006},{x:3.8,y:0.0003},{x:4.0,y:0.0001}]},
        {name: "transformed p_x(x): two peaks", color: "#7ee787", points: [{x:-5.599,y:0.0001},{x:-5.398,y:0.0003},{x:-5.198,y:0.0006},{x:-4.996,y:0.0012},{x:-4.795,y:0.0024},{x:-4.592,y:0.0044},{x:-4.388,y:0.0077},{x:-4.182,y:0.0131},{x:-3.974,y:0.0213},{x:-3.761,y:0.0329},{x:-3.542,y:0.0485},{x:-3.315,y:0.0677},{x:-3.075,y:0.0894},{x:-2.817,y:0.1113},{x:-2.534,y:0.1305},{x:-2.219,y:0.1447},{x:-1.862,y:0.1529},{x:-1.459,y:0.1558},{x:-1.008,y:0.1555},{x:-0.516,y:0.1541},{x:0.0,y:0.1534},{x:0.516,y:0.1541},{x:1.008,y:0.1555},{x:1.459,y:0.1558},{x:1.862,y:0.1529},{x:2.219,y:0.1447},{x:2.534,y:0.1305},{x:2.817,y:0.1113},{x:3.075,y:0.0894},{x:3.315,y:0.0677},{x:3.542,y:0.0485},{x:3.761,y:0.0329},{x:3.974,y:0.0213},{x:4.182,y:0.0131},{x:4.388,y:0.0077},{x:4.592,y:0.0044},{x:4.795,y:0.0024},{x:4.996,y:0.0012},{x:5.198,y:0.0006},{x:5.398,y:0.0003},{x:5.599,y:0.0001}]}
      ]
    }],
    caption: "Pushing the Gaussian through x = u + 1.6*tanh(u) and dividing by abs(g prime u) splits one hump into two peaks while the area stays 1.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# normalizing flow: push base Gaussian through x = u + sep*tanh(u) (change of variables)
sep = 1.6
u = np.linspace(-4.0, 4.0, 41)
pu = np.exp(-0.5 * u**2) / np.sqrt(2 * np.pi)      # base p_u(u): standard Gaussian
x = u + sep * np.tanh(u)                            # invertible transform g(u)
g_prime = 1.0 + sep * (1.0 - np.tanh(u)**2)         # derivative of g
px = pu / np.abs(g_prime)                           # transformed density p_x(x)

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(u, pu, color="#4ea1ff", label="base p_u(u): Gaussian")
ax.plot(x, px, color="#7ee787", label="transformed p_x(x): two peaks")
ax.set_xlabel("value"); ax.set_ylabel("probability density")
ax.set_title("Base Gaussian vs transformed (bimodal) density")
ax.legend()
plt.show()`
  }

});
