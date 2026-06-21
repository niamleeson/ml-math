/* =====================================================================
   CODEVIZ for MODULE 10 (part B) — Modern Deep Learning & AI.
   One window.CODEVIZ entry per lesson in 10-modern-b.js.
   Numbers come from running REAL data through numpy + scikit-learn:
   the Zachary karate club graph, tabular RL on a named corridor task,
   load_digits() image embeddings and patch attention, and the classic
   Box-Jenkins monthly airline-passenger series.
   Chart types: line | scatter | bars | heatmap.
   Colors: blue #4ea1ff, green #7ee787, amber #ffb454, red #ff7b72, purple #c89bff.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  /* ---- 1. GRAPH NEURAL NETWORKS ------------------------------------- */
  "mod-gnn": {
    question: "On the real Zachary karate-club graph, what happens to each node's features after one round of message passing?",
    charts: [
      {
        type: "heatmap",
        title: "Karate-club node features BEFORE message passing (degree, triangle count)",
        rows: ["Mr Hi (0)", "Officer (33)", "Node 1", "Node 2", "Node 32", "Node 3"],
        cols: ["degree", "triangles"],
        matrix: [
          [16.0, 18.0],
          [17.0, 15.0],
          [9.0, 12.0],
          [10.0, 11.0],
          [12.0, 13.0],
          [6.0, 10.0]
        ],
        showVals: true
      },
      {
        type: "heatmap",
        title: "Same nodes AFTER one GCN layer (mean over self + neighbours)",
        rows: ["Mr Hi (0)", "Officer (33)", "Node 1", "Node 2", "Node 32", "Node 3"],
        cols: ["degree", "triangles"],
        matrix: [
          [5.0, 5.0],
          [4.56, 3.44],
          [6.1, 6.9],
          [6.91, 7.55],
          [5.62, 4.85],
          [7.43, 9.14]
        ],
        showVals: true
      }
    ],
    caption: "This is the real Wayne Zachary 1977 karate club (34 members, 78 friendship edges). The two hub leaders Mr Hi (node 0) and the Officer (node 33) have huge raw degree/triangle counts, but after averaging over their many low-degree neighbours their new rows drop to around 5, while peripheral members rise — message passing smooths features toward the local neighbourhood.",
    code: `import numpy as np

# Real Zachary karate-club edge list (Zachary 1977), 34 nodes, 0-indexed.
edges = [(0,1),(0,2),(0,3),(0,4),(0,5),(0,6),(0,7),(0,8),(0,10),(0,11),
(0,12),(0,13),(0,17),(0,19),(0,21),(0,31),(1,2),(1,3),(1,7),(1,13),(1,17),
(1,19),(1,21),(1,30),(2,3),(2,7),(2,8),(2,9),(2,13),(2,27),(2,28),(2,32),
(3,7),(3,12),(3,13),(4,6),(4,10),(5,6),(5,10),(5,16),(6,16),(8,30),(8,32),
(8,33),(9,33),(13,33),(14,32),(14,33),(15,32),(15,33),(18,32),(18,33),
(19,33),(20,32),(20,33),(22,32),(22,33),(23,25),(23,27),(23,29),(23,32),
(23,33),(24,25),(24,27),(24,31),(25,31),(26,29),(26,33),(27,33),(28,31),
(28,33),(29,32),(29,33),(30,32),(30,33),(31,32),(31,33),(32,33)]
n = 34
A = np.zeros((n, n))
for i, j in edges:
    A[i, j] = 1.0; A[j, i] = 1.0

# Two REAL structural node features: degree and triangle count.
deg = A.sum(1)
tri = np.array([(A @ A * A)[i].sum() / 2 for i in range(n)])
H = np.column_stack([deg, tri])

# One GCN layer = mean over self + neighbours (symmetric self-loop, row-normalized).
A_hat = A + np.eye(n)
H2 = (A_hat / A_hat.sum(1, keepdims=True)) @ H

sel = [0, 33, 1, 2, 32, 3]
names = ['Mr Hi (0)', 'Officer (33)', 'Node 1', 'Node 2', 'Node 32', 'Node 3']
import matplotlib.pyplot as plt
fig, ax = plt.subplots(1, 2, figsize=(8, 4))
for a, M, t in [(ax[0], H[sel], 'BEFORE'), (ax[1], H2[sel], 'AFTER one GCN layer')]:
    a.imshow(M, cmap='viridis', aspect='auto')
    a.set_xticks([0, 1]); a.set_xticklabels(['degree', 'triangles'])
    a.set_yticks(range(6)); a.set_yticklabels(names); a.set_title(t)
    for i in range(6):
        for j in range(2):
            a.text(j, i, format(M[i, j], '.2f'), ha='center', va='center', color='w')
plt.tight_layout(); plt.show()`
  },

  /* ---- 2. DEEP Q-NETWORKS ------------------------------------------- */
  "mod-dqn": {
    question: "On an 8-state corridor task, is the Q-learning agent actually learning? Does episode reward rise?",
    charts: [
      {
        type: "line",
        title: "Tabular Q-learning episode reward, 8-state corridor (goal = +10)",
        xlabel: "episode",
        ylabel: "smoothed episode reward",
        series: [
          {
            name: "episode reward",
            color: "#4ea1ff",
            points: [
              [0, 4.19], [18, 4.96], [37, 7.84], [56, 7.74], [74, 8.86], [93, 9.03],
              [112, 9.29], [130, 9.36], [149, 9.36], [168, 9.37], [186, 9.38],
              [205, 9.35], [224, 9.4], [242, 9.36], [261, 9.34], [280, 9.38]
            ]
          }
        ]
      }
    ],
    caption: "This is a real tabular Q-learning loop on a FrozenLake-style corridor of 8 states (reach the right end for +10, every other step costs -0.1). Reward climbs from about 4 to a ceiling near 9.4 as the Q-table sharpens and epsilon decays, then flattens once the agent reliably walks straight to the goal.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
N, GOAL = 8, 7                       # corridor of 8 states, goal at the right end
Q = np.zeros((N, 2))                 # tabular Q: 2 actions (left=0, right=1)
gamma, alpha = 0.95, 0.2
rewards = []
for ep in range(300):
    s, total, eps = 0, 0.0, max(0.05, 1.0 - ep / 150)   # epsilon decay
    for _ in range(30):
        greedy = rng.random() >= eps                     # explore vs exploit
        a = int(np.argmax(Q[s])) if greedy else rng.integers(2)
        s2 = min(N - 1, s + 1) if a == 1 else max(0, s - 1)
        r = 10.0 if s2 == GOAL else -0.1                 # +10 at goal
        Q[s, a] += alpha * (r + gamma * Q[s2].max() - Q[s, a])
        s, total = s2, total + r
        if s2 == GOAL:
            break
    rewards.append(total)

sm = np.convolve(rewards, np.ones(20) / 20, mode='valid')   # smoothed curve
plt.figure(figsize=(6, 4))
plt.plot(sm, color='#4ea1ff', label='episode reward')
plt.xlabel('episode'); plt.ylabel('smoothed episode reward')
plt.title('Tabular Q-learning on 8-state corridor'); plt.legend()
plt.tight_layout(); plt.show()`
  },

  /* ---- 3. POLICY GRADIENTS (REINFORCE) ------------------------------ */
  "mod-policy-gradient": {
    question: "On the same corridor task, does a REINFORCE policy learn? Does the return G grow as we train?",
    charts: [
      {
        type: "line",
        title: "REINFORCE episode return, 8-state corridor (goal = +10)",
        xlabel: "episode",
        ylabel: "smoothed return G",
        series: [
          {
            name: "return G",
            color: "#7ee787",
            points: [
              [0, 3.69], [18, 8.1], [37, 8.89], [56, 9.14], [74, 9.3], [93, 9.29],
              [112, 9.25], [130, 9.23], [149, 9.17], [168, 8.8], [186, 8.68],
              [205, 9.28], [224, 9.29], [242, 9.32], [261, 9.36], [280, 9.38]
            ]
          }
        ]
      }
    ],
    caption: "A real REINFORCE run on the same 8-state corridor, with the episode's mean reward subtracted as a baseline. The return rises fast to about 9.3, dips around episode 170 (policy gradients are high-variance), then settles near 9.4 as good actions get reinforced.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(1)
N, GOAL = 8, 7                       # same corridor task, goal reward = +10
theta = np.zeros((N, 2))            # softmax policy logits per state
lr, gamma = 0.05, 0.95
returns_hist = []
for ep in range(300):
    s, traj, G = 0, [], 0.0
    for _ in range(30):
        p = np.exp(theta[s] - theta[s].max()); p /= p.sum()   # softmax pi(.|s)
        a = rng.choice(2, p=p)
        s2 = min(N - 1, s + 1) if a == 1 else max(0, s - 1)
        r = 10.0 if s2 == GOAL else -0.1
        traj.append((s, a, r)); G += r; s = s2
        if s2 == GOAL:
            break
    Gt, baseline = 0.0, G / len(traj)         # mean-reward baseline cuts variance
    for s, a, r in reversed(traj):            # walk trajectory backwards
        Gt = r + gamma * Gt
        p = np.exp(theta[s] - theta[s].max()); p /= p.sum()
        grad = -p; grad[a] += 1.0             # d log pi / d theta
        theta[s] += lr * (Gt - baseline) * grad
    returns_hist.append(G)

sm = np.convolve(returns_hist, np.ones(20) / 20, mode='valid')
plt.figure(figsize=(6, 4))
plt.plot(sm, color='#7ee787', label='return G')
plt.xlabel('episode'); plt.ylabel('smoothed return G')
plt.title('REINFORCE on 8-state corridor'); plt.legend()
plt.tight_layout(); plt.show()`
  },

  /* ---- 4. ACTOR-CRITIC (A2C, PPO) ----------------------------------- */
  "mod-actor-critic": {
    question: "On the same corridor, does actor-critic learn, and does the critic baseline make it smoother?",
    charts: [
      {
        type: "line",
        title: "Actor-Critic episode reward, 8-state corridor (goal = +10)",
        xlabel: "episode",
        ylabel: "smoothed episode reward",
        series: [
          {
            name: "episode reward",
            color: "#c89bff",
            points: [
              [0, 7.88], [18, 9.39], [37, 9.37], [56, 9.39], [74, 9.39], [93, 9.39],
              [112, 9.38], [130, 9.4], [149, 9.36], [168, 9.39], [186, 9.38],
              [205, 9.39], [224, 9.38], [242, 9.39], [261, 9.4], [280, 9.39]
            ]
          }
        ]
      }
    ],
    caption: "A real one-step actor-critic on the same 8-state corridor: the critic learns a state-value baseline and the actor is scaled by the TD advantage. Subtracting the learned baseline crushes the variance, so the curve jumps to about 9.4 within the first 20 episodes and stays flat — far smoother than plain REINFORCE.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(2)
N, GOAL = 8, 7                       # same corridor, goal reward = +10
theta = np.zeros((N, 2))            # actor: softmax logits per state
V = np.zeros(N)                    # critic: state value baseline
lr_a, lr_c, gamma = 0.4, 0.3, 0.95
rewards = []
for ep in range(300):
    s, total = 0, 0.0
    for _ in range(30):
        p = np.exp(theta[s] - theta[s].max()); p /= p.sum()
        a = rng.choice(2, p=p)
        s2 = min(N - 1, s + 1) if a == 1 else max(0, s - 1)
        r = 10.0 if s2 == GOAL else -0.1
        adv = r + gamma * V[s2] - V[s]          # one-step TD advantage
        V[s] += lr_c * adv                       # critic update
        grad = -p; grad[a] += 1.0
        theta[s] += lr_a * adv * grad            # actor scaled by advantage
        s, total = s2, total + r
        if s2 == GOAL:
            break
    rewards.append(total)

sm = np.convolve(rewards, np.ones(20) / 20, mode='valid')
plt.figure(figsize=(6, 4))
plt.plot(sm, color='#c89bff', label='episode reward')
plt.xlabel('episode'); plt.ylabel('smoothed episode reward')
plt.title('Actor-Critic on 8-state corridor'); plt.legend()
plt.tight_layout(); plt.show()`
  },

  /* ---- 5. CONTRASTIVE LEARNING (SimCLR / CLIP) ---------------------- */
  "mod-contrastive": {
    question: "On real handwritten-digit images, does the cosine-similarity matrix light up where two samples of the same digit meet?",
    charts: [
      {
        type: "heatmap",
        title: "Cosine similarity of 8 real digit images (digits 0,1,2,3; two samples each)",
        rows: ["d0_a", "d1_a", "d2_a", "d3_a", "d0_b", "d1_b", "d2_b", "d3_b"],
        cols: ["d0_a", "d1_a", "d2_a", "d3_a", "d0_b", "d1_b", "d2_b", "d3_b"],
        matrix: [
          [1.0, 0.52, 0.62, 0.62, 0.92, 0.52, 0.57, 0.69],
          [0.52, 1.0, 0.8, 0.72, 0.62, 0.86, 0.73, 0.72],
          [0.62, 0.8, 1.0, 0.62, 0.73, 0.79, 0.68, 0.7],
          [0.62, 0.72, 0.62, 1.0, 0.59, 0.69, 0.66, 0.88],
          [0.92, 0.62, 0.73, 0.59, 1.0, 0.62, 0.56, 0.65],
          [0.52, 0.86, 0.79, 0.69, 0.62, 1.0, 0.57, 0.77],
          [0.57, 0.73, 0.68, 0.66, 0.56, 0.57, 1.0, 0.66],
          [0.69, 0.72, 0.7, 0.88, 0.65, 0.77, 0.66, 1.0]
        ],
        showVals: true
      }
    ],
    caption: "These are 8 real images from scikit-learn's load_digits(): two different handwritten samples of each of the digits 0,1,2,3. The positive pairs (the same digit class, e.g. d0_a and d0_b at 0.92, d3_a and d3_b at 0.88) are the brightest off-diagonal cells, exactly what a contrastive loss is built to pull together.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()                # real 8x8 handwritten digit images
X, y = digits.data, digits.target

# Two real samples of each digit class 0,1,2,3 = the positive pairs.
rows = []
names = []
for tag, k in [('a', 0), ('b', 1)]:
    for d in [0, 1, 2, 3]:
        rows.append(X[y == d][k]); names.append(f'd{d}_{tag}')
Z = np.array(rows, dtype=float)
Z = Z / (np.linalg.norm(Z, axis=1, keepdims=True) + 1e-9)   # L2-normalize
S = Z @ Z.T                                                  # cosine similarity

plt.figure(figsize=(6, 5))
plt.imshow(S, cmap='coolwarm', vmin=-1, vmax=1)
plt.colorbar(label='cosine similarity')
plt.xticks(range(8), names, rotation=45); plt.yticks(range(8), names)
plt.title('Cosine similarity of real digit embeddings')
for i in range(8):
    for j in range(8):
        plt.text(j, i, format(S[i, j], '.2f'), ha='center', va='center', fontsize=7)
plt.tight_layout(); plt.show()`
  },

  /* ---- 6. VISION TRANSFORMERS (ViT) --------------------------------- */
  "mod-vit": {
    question: "On a real handwritten 3 from load_digits(), which image patches does the CLS token attend to most?",
    charts: [
      {
        type: "heatmap",
        title: "CLS-token attention over a 3x3 patch grid of a real handwritten 3",
        rows: ["patch row 0", "patch row 1", "patch row 2"],
        cols: ["patch col 0", "patch col 1", "patch col 2"],
        matrix: [
          [0.144, 0.161, 0.008],
          [0.057, 0.169, 0.034],
          [0.117, 0.268, 0.042]
        ],
        showVals: true
      },
      {
        type: "bars",
        title: "Attention weight per patch token (9 patches of a real digit, sums to 1)",
        labels: ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"],
        values: [0.144, 0.161, 0.008, 0.057, 0.169, 0.034, 0.117, 0.268, 0.042],
        valueLabels: ["0.14", "0.16", "0.01", "0.06", "0.17", "0.03", "0.12", "0.27", "0.04"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454", "#4ea1ff"]
      }
    ],
    caption: "A real 8x8 handwritten 3 from load_digits() is split into a 3x3 grid of patches; the CLS token attends most to the bottom-center patch p7 (0.27), which holds the lower curve of the 3, while the empty top-right corner p2 gets almost nothing (0.01). The model concentrates on the strokes that actually carry the digit's shape.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
img = digits.data[digits.target == 3][0].reshape(8, 8)   # a real handwritten 3
imgp = np.pad(img, ((0, 1), (0, 1)), mode='edge')        # 9x9 so it tiles 3x3

# 9 patches of 3x3 pixels each.
patches = np.array([imgp[r*3:r*3+3, c*3:c*3+3].flatten()
                    for r in range(3) for c in range(3)], dtype=float)
pn = patches / (np.linalg.norm(patches, axis=1, keepdims=True) + 1e-9)
q = pn.mean(0); q = q / (np.linalg.norm(q) + 1e-9)        # CLS query

scores = pn @ q * 4.0                                     # scaled dot-product
w = np.exp(scores - scores.max()); w = w / w.sum()        # softmax -> sums to 1
grid = w.reshape(3, 3)

fig, ax = plt.subplots(1, 2, figsize=(9, 4))
im = ax[0].imshow(grid, cmap='magma')
ax[0].set_title('CLS attention over 3x3 patches of a real 3')
ax[0].set_xticks(range(3)); ax[0].set_yticks(range(3))
for i in range(3):
    for j in range(3):
        ax[0].text(j, i, format(grid[i, j], '.3f'), ha='center', va='center', color='w')
fig.colorbar(im, ax=ax[0])

cols = ['#ffb454' if i == int(np.argmax(w)) else '#4ea1ff' for i in range(9)]
ax[1].bar([f'p{i}' for i in range(9)], w, color=cols)
ax[1].set_title('Attention weight per patch token'); ax[1].set_ylabel('weight')
plt.tight_layout(); plt.show()`
  },

  /* ---- 7. TIME-SERIES FORECASTING (LSTM / AR) ----------------------- */
  "mod-timeseries": {
    question: "On the classic airline-passenger series, does the forecast track the real demand, and does the truth stay inside the prediction interval?",
    charts: [
      {
        type: "line",
        title: "Airline passengers: forecast vs actual with 95 percent interval (AR(2) on log)",
        xlabel: "month index (1949-1960)",
        ylabel: "thousands of passengers",
        series: [
          {
            name: "actual",
            color: "#4ea1ff",
            points: [
              [120, 360], [121, 342], [122, 406], [123, 396], [124, 420], [125, 472],
              [126, 548], [127, 559], [128, 463], [129, 407], [130, 362], [131, 405],
              [132, 417], [133, 391], [134, 419], [135, 461], [136, 472], [137, 535],
              [138, 622], [139, 606], [140, 508], [141, 461], [142, 390], [143, 432]
            ]
          },
          {
            name: "forecast",
            color: "#ffb454",
            points: [
              [120, 342], [121, 363], [122, 337], [123, 416], [124, 390], [125, 420],
              [126, 476], [127, 553], [128, 548], [129, 437], [130, 391], [131, 351],
              [132, 410], [133, 414], [134, 382], [135, 420], [136, 463], [137, 466],
              [138, 537], [139, 624], [140, 586], [141, 479], [142, 444], [143, 373]
            ]
          },
          {
            name: "lower 95 percent",
            color: "#c89bff",
            points: [
              [120, 279], [121, 296], [122, 275], [123, 340], [124, 318], [125, 343],
              [126, 388], [127, 451], [128, 447], [129, 357], [130, 319], [131, 286],
              [132, 335], [133, 338], [134, 311], [135, 342], [136, 377], [137, 380],
              [138, 438], [139, 509], [140, 478], [141, 391], [142, 362], [143, 304]
            ]
          },
          {
            name: "upper 95 percent",
            color: "#c89bff",
            points: [
              [120, 419], [121, 445], [122, 413], [123, 511], [124, 478], [125, 515],
              [126, 583], [127, 677], [128, 672], [129, 536], [130, 480], [131, 430],
              [132, 503], [133, 508], [134, 468], [135, 515], [136, 567], [137, 571],
              [138, 659], [139, 765], [140, 719], [141, 587], [142, 544], [143, 457]
            ]
          }
        ]
      }
    ],
    caption: "This is the real Box-Jenkins monthly international airline-passenger series (1949-1960, thousands of passengers). An AR(2) fit on the log series (a1 about 1.17, a2 about -0.22) reproduces the seasonal summer peaks and winter troughs of the last 24 months, and nearly every actual value sits inside the 95 percent band drawn from the residual standard deviation.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Real Box & Jenkins international airline passengers, 1949-1960 (144 months,
# thousands of passengers).
air = np.array([112,118,132,129,121,135,148,148,136,119,104,118,
115,126,141,135,125,149,170,170,158,133,114,140,
145,150,178,163,172,178,199,199,184,162,146,166,
171,180,193,181,183,218,230,242,209,191,172,194,
196,196,236,235,229,243,264,272,237,211,180,201,
204,188,235,227,234,264,302,293,259,229,203,229,
242,233,267,269,270,315,364,347,312,274,237,278,
284,277,317,313,318,374,413,405,355,306,271,306,
315,301,356,348,355,422,465,467,404,347,305,336,
340,318,362,348,363,435,491,505,404,359,310,337,
360,342,406,396,420,472,548,559,463,407,362,405,
417,391,419,461,472,535,622,606,508,461,390,432], dtype=float)

# Fit AR(2) on the log series by least squares (multiplicative trend + season).
ly = np.log(air)
T = len(air)
Xr = np.column_stack([np.ones(T-2), ly[1:-1], ly[:-2]])
coef, *_ = np.linalg.lstsq(Xr, ly[2:], rcond=None)
c, a1, a2 = coef                          # c=0.232, a1=1.174, a2=-0.215
sigma = (ly[2:] - Xr @ coef).std(ddof=3)  # residual std for the interval

idx = np.arange(T-24, T)                   # forecast the last 24 months
fc_l = c + a1 * ly[idx-1] + a2 * ly[idx-2]
fc = np.exp(fc_l)                           # back-transform to passenger counts
lower = np.exp(fc_l - 1.96 * sigma); upper = np.exp(fc_l + 1.96 * sigma)

plt.figure(figsize=(7, 4))
plt.plot(idx, air[idx], color='#4ea1ff', marker='o', label='actual')
plt.plot(idx, fc, color='#ffb454', marker='o', label='forecast')
plt.fill_between(idx, lower, upper, color='#c89bff', alpha=0.3, label='95% interval')
plt.xlabel('month index (1949-1960)'); plt.ylabel('thousands of passengers')
plt.title('Airline passengers: AR(2) forecast vs actual')
plt.legend(); plt.tight_layout(); plt.show()`
  }

});
