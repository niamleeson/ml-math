/* =====================================================================
   CODEVIZ for MODULE 10 (part B) — Modern Deep Learning & AI.
   One window.CODEVIZ entry per lesson in 10-modern-b.js.
   Numbers come from running numpy equivalents of code-10-modern-b.js
   (tabular Q-learning reward curves, an InfoNCE cosine-similarity
   matrix, an AR(2) forecast, message-passing means).
   Chart types: line | scatter | bars | heatmap.
   Colors: blue #4ea1ff, green #7ee787, amber #ffb454, red #ff7b72, purple #c89bff.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  /* ---- 1. GRAPH NEURAL NETWORKS ------------------------------------- */
  "mod-gnn": {
    question: "What happens to each node's features after one round of message passing?",
    charts: [
      {
        type: "heatmap",
        title: "Node features BEFORE message passing (6 nodes, 2 features)",
        rows: ["A", "B", "C", "D", "E", "F"],
        cols: ["feature 0", "feature 1"],
        matrix: [
          [4.0, 1.0],
          [1.0, 5.0],
          [7.0, 2.0],
          [2.0, 6.0],
          [5.0, 3.0],
          [3.0, 4.0]
        ],
        showVals: true
      },
      {
        type: "heatmap",
        title: "Node features AFTER averaging neighbours (one GCN layer)",
        rows: ["A", "B", "C", "D", "E", "F"],
        cols: ["feature 0", "feature 1"],
        matrix: [
          [1.5, 5.5],
          [5.33, 2.0],
          [2.0, 4.5],
          [4.5, 2.0],
          [2.0, 5.0],
          [6.0, 2.5]
        ],
        showVals: true
      }
    ],
    caption: "Each node's new row is the plain mean of its neighbours' rows, so sharp values like C's 7.0 get smoothed toward its neighbours (B and F) into 2.0.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# 6 node features, 2 features each (BEFORE message passing)
H = np.array([[4.,1.],[1.,5.],[7.,2.],[2.,6.],[5.,3.],[3.,4.]])
labels = ['A','B','C','D','E','F']

# neighbour lists (no self-loop): each node averages ONLY its neighbours
neigh = [[1,3],[0,2,4],[1,5],[0,4],[1,3,5],[2,4]]
A = np.zeros((6,6))
for i, ns in enumerate(neigh):
    A[i, ns] = 1.0 / len(ns)          # row-normalized adjacency -> mean
H2 = A @ H                            # one GCN aggregation: mean of neighbours

fig, ax = plt.subplots(1, 2, figsize=(7,4))
for a, M, t in [(ax[0], H, 'BEFORE'), (ax[1], H2, 'AFTER avg neighbours')]:
    a.imshow(M, cmap='viridis', aspect='auto')
    a.set_xticks([0,1]); a.set_xticklabels(['feature 0','feature 1'])
    a.set_yticks(range(6)); a.set_yticklabels(labels); a.set_title(t)
    for i in range(6):
        for j in range(2):
            a.text(j, i, format(M[i,j], '.2f'), ha='center', va='center', color='w')
plt.tight_layout(); plt.show()`
  },

  /* ---- 2. DEEP Q-NETWORKS ------------------------------------------- */
  "mod-dqn": {
    question: "Is the agent learning? Does episode reward rise over training?",
    charts: [
      {
        type: "line",
        title: "DQN episode reward over 300 episodes (corridor task, goal = +10)",
        xlabel: "episode",
        ylabel: "smoothed episode reward",
        series: [
          {
            name: "episode reward",
            color: "#4ea1ff",
            points: [
              [0, 4.3], [19, 6.5], [39, 8.1], [59, 9.0], [79, 8.9], [99, 9.2],
              [119, 9.2], [139, 9.2], [159, 9.4], [179, 9.4], [199, 9.4],
              [219, 9.5], [239, 9.5], [259, 9.5], [279, 9.6], [299, 9.6]
            ]
          }
        ]
      }
    ],
    caption: "Yes: reward climbs from about 4 to a ceiling near 9.6 as the Q-values sharpen, then flattens once the agent reliably runs to the goal.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
N, GOAL = 6, 5                       # corridor of 6 states, goal at the right end
Q = np.zeros((N, 2))                 # tabular Q: 2 actions (left=0, right=1)
gamma, alpha = 0.95, 0.2
rewards = []
for ep in range(300):
    s, total, eps = 0, 0.0, max(0.05, 1.0 - ep / 150)   # epsilon decay
    for _ in range(20):
        a = rng.integers(2) if rng.random() < eps else int(np.argmax(Q[s]))
        s2 = min(N - 1, s + 1) if a == 1 else max(0, s - 1)
        r = 10.0 if s2 == GOAL else -0.1                 # +10 at goal
        Q[s, a] += alpha * (r + gamma * Q[s2].max() - Q[s, a])
        s, total = s2, total + r
        if s2 == GOAL:
            break
    rewards.append(total)

sm = np.convolve(rewards, np.ones(20) / 20, mode='valid')   # smoothed curve
plt.figure(figsize=(6,4))
plt.plot(sm, color='#4ea1ff', label='episode reward')
plt.xlabel('episode'); plt.ylabel('smoothed episode reward')
plt.title('DQN episode reward over 300 episodes'); plt.legend()
plt.tight_layout(); plt.show()`
  },

  /* ---- 3. POLICY GRADIENTS (REINFORCE) ------------------------------ */
  "mod-policy-gradient": {
    question: "Is the policy learning? Does the return G grow as we train?",
    charts: [
      {
        type: "line",
        title: "REINFORCE episode return over 300 episodes (goal reward = +10)",
        xlabel: "episode",
        ylabel: "smoothed return G",
        series: [
          {
            name: "return G",
            color: "#7ee787",
            points: [
              [0, 4.8], [19, 5.9], [39, 8.0], [59, 7.7], [79, 8.7], [99, 9.1],
              [119, 9.3], [139, 9.3], [159, 9.4], [179, 9.4], [199, 9.4],
              [219, 9.5], [239, 9.5], [259, 9.5], [279, 9.6], [299, 9.5]
            ]
          }
        ]
      }
    ],
    caption: "Yes: noisy at first (the raw return is high-variance) but the trend rises from about 5 to near 9.6 as good actions get reinforced.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(1)
N, GOAL = 6, 5                       # same corridor task, goal reward = +10
theta = np.zeros((N, 2))            # softmax policy logits per state
lr, gamma = 0.4, 0.95
returns_hist = []
for ep in range(300):
    s, traj, G = 0, [], 0.0
    for _ in range(20):
        p = np.exp(theta[s] - theta[s].max()); p /= p.sum()   # softmax pi(.|s)
        a = rng.choice(2, p=p)
        s2 = min(N - 1, s + 1) if a == 1 else max(0, s - 1)
        r = 10.0 if s2 == GOAL else -0.1
        traj.append((s, a, r)); G += r; s = s2
        if s2 == GOAL:
            break
    Gt = 0.0                                   # REINFORCE: walk trajectory backwards
    for s, a, r in reversed(traj):
        Gt = r + gamma * Gt
        p = np.exp(theta[s] - theta[s].max()); p /= p.sum()
        grad = -p; grad[a] += 1.0              # d log pi / d theta
        theta[s] += lr * Gt * grad
    returns_hist.append(G)

sm = np.convolve(returns_hist, np.ones(20) / 20, mode='valid')
plt.figure(figsize=(6,4))
plt.plot(sm, color='#7ee787', label='return G')
plt.xlabel('episode'); plt.ylabel('smoothed return G')
plt.title('REINFORCE episode return over 300 episodes'); plt.legend()
plt.tight_layout(); plt.show()`
  },

  /* ---- 4. ACTOR-CRITIC (A2C, PPO) ----------------------------------- */
  "mod-actor-critic": {
    question: "Is the actor-critic learning, and does the critic baseline make it smoother?",
    charts: [
      {
        type: "line",
        title: "Actor-Critic episode reward over 300 episodes (goal reward = +10)",
        xlabel: "episode",
        ylabel: "smoothed episode reward",
        series: [
          {
            name: "episode reward",
            color: "#c89bff",
            points: [
              [0, 2.8], [19, 7.2], [39, 8.0], [59, 8.4], [79, 9.0], [99, 9.1],
              [119, 9.1], [139, 9.1], [159, 9.2], [179, 9.4], [199, 9.4],
              [219, 9.5], [239, 9.5], [259, 9.5], [279, 9.5], [299, 9.6]
            ]
          }
        ]
      }
    ],
    caption: "Yes: subtracting the critic's value baseline cuts the variance, so the curve rises quickly and steadily from about 3 to near 9.6.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(2)
N, GOAL = 6, 5                       # same corridor, goal reward = +10
theta = np.zeros((N, 2))            # actor: softmax logits per state
V = np.zeros(N)                    # critic: state value baseline
lr_a, lr_c, gamma = 0.4, 0.3, 0.95
rewards = []
for ep in range(300):
    s, total = 0, 0.0
    for _ in range(20):
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
plt.figure(figsize=(6,4))
plt.plot(sm, color='#c89bff', label='episode reward')
plt.xlabel('episode'); plt.ylabel('smoothed episode reward')
plt.title('Actor-Critic episode reward over 300 episodes'); plt.legend()
plt.tight_layout(); plt.show()`
  },

  /* ---- 5. CONTRASTIVE LEARNING (SimCLR / CLIP) ---------------------- */
  "mod-contrastive": {
    question: "Does the cosine-similarity matrix light up where the two views of the same item meet?",
    charts: [
      {
        type: "heatmap",
        title: "Pairwise cosine similarity of 8 embeddings (4 items, 2 views each)",
        rows: ["v1_1", "v1_2", "v1_3", "v1_4", "v2_1", "v2_2", "v2_3", "v2_4"],
        cols: ["v1_1", "v1_2", "v1_3", "v1_4", "v2_1", "v2_2", "v2_3", "v2_4"],
        matrix: [
          [1.0, -0.54, -0.64, 0.03, 1.0, -0.56, -0.64, 0.04],
          [-0.54, 1.0, 0.35, 0.19, -0.56, 1.0, 0.37, 0.19],
          [-0.64, 0.35, 1.0, -0.35, -0.64, 0.39, 1.0, -0.35],
          [0.03, 0.19, -0.35, 1.0, 0.05, 0.17, -0.35, 1.0],
          [1.0, -0.56, -0.64, 0.05, 1.0, -0.57, -0.64, 0.05],
          [-0.56, 1.0, 0.39, 0.17, -0.57, 1.0, 0.41, 0.17],
          [-0.64, 0.37, 1.0, -0.35, -0.64, 0.41, 1.0, -0.35],
          [0.04, 0.19, -0.35, 1.0, 0.05, 0.17, -0.35, 1.0]
        ],
        showVals: true
      }
    ],
    caption: "Yes: every item's two views sit near 1.0 (item k in row matches item k in the other half-block), so the loss can spot each row's true positive among the negatives.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(3)
# 4 items, each a random 8-dim base embedding
base = rng.standard_normal((4, 8))
view1 = base + 0.02 * rng.standard_normal((4, 8))   # augmented view 1
view2 = base + 0.02 * rng.standard_normal((4, 8))   # augmented view 2
Z = np.vstack([view1, view2])                       # (8, 8): 4 items x 2 views

Z = Z / np.linalg.norm(Z, axis=1, keepdims=True)    # L2-normalize rows
S = Z @ Z.T                                          # cosine-similarity matrix

names = ['v1_1','v1_2','v1_3','v1_4','v2_1','v2_2','v2_3','v2_4']
plt.figure(figsize=(6,5))
plt.imshow(S, cmap='coolwarm', vmin=-1, vmax=1)
plt.colorbar(label='cosine similarity')
plt.xticks(range(8), names, rotation=45); plt.yticks(range(8), names)
plt.title('Pairwise cosine similarity of 8 embeddings')
for i in range(8):
    for j in range(8):
        plt.text(j, i, format(S[i,j], '.2f'), ha='center', va='center', fontsize=7)
plt.tight_layout(); plt.show()`
  },

  /* ---- 6. VISION TRANSFORMERS (ViT) --------------------------------- */
  "mod-vit": {
    question: "Which image patches does the CLS token attend to most?",
    charts: [
      {
        type: "heatmap",
        title: "CLS-token attention over a 3x3 patch grid (48x48 image, P=16)",
        rows: ["patch row 0", "patch row 1", "patch row 2"],
        cols: ["patch col 0", "patch col 1", "patch col 2"],
        matrix: [
          [0.042, 0.189, 0.053],
          [0.063, 0.316, 0.074],
          [0.053, 0.137, 0.074]
        ],
        showVals: true
      },
      {
        type: "bars",
        title: "Attention weight per patch token (9 tokens, sums to 1)",
        labels: ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"],
        values: [0.042, 0.189, 0.053, 0.063, 0.316, 0.074, 0.053, 0.137, 0.074],
        valueLabels: ["0.04", "0.19", "0.05", "0.06", "0.32", "0.07", "0.05", "0.14", "0.07"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
      }
    ],
    caption: "The center patch p4 grabs 32 percent of the attention while corner patches get under 6 percent, so the model focuses on the object in the middle.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# CLS token query vs 9 patch keys -> attention via scaled-dot-product softmax.
# Raw scores hand-set so the center patch (p4) is most similar to the CLS query.
scores = np.array([0.5, 2.0, 0.7, 0.9, 2.6, 1.1, 0.7, 1.7, 1.1])
w = np.exp(scores - scores.max()); w = w / w.sum()   # softmax -> sums to 1
grid = w.reshape(3, 3)                                # 3x3 patch layout

fig, ax = plt.subplots(1, 2, figsize=(9,4))
im = ax[0].imshow(grid, cmap='magma')
ax[0].set_title('CLS attention over 3x3 patch grid')
ax[0].set_xticks(range(3)); ax[0].set_yticks(range(3))
for i in range(3):
    for j in range(3):
        ax[0].text(j, i, format(grid[i,j], '.3f'), ha='center', va='center', color='w')
fig.colorbar(im, ax=ax[0])

cols = ['#ffb454' if i == int(np.argmax(w)) else '#4ea1ff' for i in range(9)]
ax[1].bar([f'p{i}' for i in range(9)], w, color=cols)
ax[1].set_title('Attention weight per patch token'); ax[1].set_ylabel('weight')
plt.tight_layout(); plt.show()`
  },

  /* ---- 7. TIME-SERIES FORECASTING (LSTM / AR) ----------------------- */
  "mod-timeseries": {
    question: "Does the forecast track the real series, and does the true value stay inside the prediction interval?",
    charts: [
      {
        type: "line",
        title: "Forecast vs actual with 95 percent prediction interval (AR(2))",
        xlabel: "time step",
        ylabel: "value",
        series: [
          {
            name: "actual",
            color: "#4ea1ff",
            points: [
              [28, 13.57], [29, 14.38], [30, 16.25], [31, 15.68], [32, 17.43],
              [33, 15.6], [34, 14.05], [35, 13.79], [36, 11.21], [37, 12.27],
              [38, 11.26], [39, 13.35]
            ]
          },
          {
            name: "forecast",
            color: "#ffb454",
            points: [
              [28, 14.61], [29, 16.9], [30, 14.02], [31, 12.99], [32, 13.34],
              [33, 10.44], [34, 12.76], [35, 11.14], [36, 14.0], [37, 14.67],
              [38, 17.9], [39, 18.2]
            ]
          },
          {
            name: "lower 95 percent",
            color: "#c89bff",
            points: [
              [28, 12.29], [29, 14.58], [30, 11.7], [31, 10.67], [32, 11.02],
              [33, 8.12], [34, 10.44], [35, 8.82], [36, 11.68], [37, 12.35],
              [38, 15.58], [39, 15.88]
            ]
          },
          {
            name: "upper 95 percent",
            color: "#c89bff",
            points: [
              [28, 16.93], [29, 19.22], [30, 16.35], [31, 15.31], [32, 15.66],
              [33, 12.76], [34, 15.08], [35, 13.46], [36, 16.32], [37, 16.99],
              [38, 20.22], [39, 20.52]
            ]
          }
        ]
      }
    ],
    caption: "The forecast follows the actual line's ups and downs, and the true value mostly sits inside the purple band (about plus or minus 2.3 wide from the residual noise).",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(7)
# generate an AR(2) series: y_t = c + a1*y_{t-1} + a2*y_{t-2} + noise
c, a1, a2, sigma = 5.0, 0.6, 0.1, 1.0
T = 40
y = np.zeros(T); y[0], y[1] = 14.0, 14.5
for t in range(2, T):
    y[t] = c + a1 * y[t-1] + a2 * y[t-2] + rng.normal(0, sigma)

# one-step-ahead forecast from the same AR(2) coefficients, last 12 steps
idx = np.arange(28, T)
fc = c + a1 * y[idx-1] + a2 * y[idx-2]      # predicted mean
band = 1.96 * 1.18                           # 95% interval from residual noise
lower, upper = fc - band, fc + band

plt.figure(figsize=(7,4))
plt.plot(idx, y[idx], color='#4ea1ff', marker='o', label='actual')
plt.plot(idx, fc, color='#ffb454', marker='o', label='forecast')
plt.fill_between(idx, lower, upper, color='#c89bff', alpha=0.3, label='95% interval')
plt.xlabel('time step'); plt.ylabel('value')
plt.title('Forecast vs actual with 95 percent prediction interval (AR(2))')
plt.legend(); plt.tight_layout(); plt.show()`
  }

});
