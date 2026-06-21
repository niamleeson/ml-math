/* Per-lesson visualizations of the code's data & results. Merged into window.CODEVIZ by id.
   { question?, charts:[ chartSpec ], caption? }  — chartSpec types: bars/line/scatter/roc/confusion/heatmap.
   Numbers below are REAL outputs from running each lesson's Python (numpy/stdlib). */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "aix-relaxation": {
    question: "What does the relaxed (walls-removed) heuristic look like across the whole grid?",
    charts: [{
      type: "heatmap", title: "Relaxed heuristic h = Manhattan steps to goal (4,4)",
      rows: ["row 0", "row 1", "row 2", "row 3", "row 4"],
      cols: ["col 0", "col 1", "col 2", "col 3", "col 4"],
      matrix: [[8, 7, 6, 5, 4], [7, 6, 5, 4, 3], [6, 5, 4, 3, 2], [5, 4, 3, 2, 1], [4, 3, 2, 1, 0]],
      showVals: true
    }],
    caption: "Each cell holds its straight-line distance to the goal; from start (0,0) h = 8, while the true walled cost is 16, so h never overestimates (admissible).",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Relaxed heuristic = Manhattan steps to goal (4,4), walls removed.
goal = (4, 4)
H = np.zeros((5, 5), int)
for r in range(5):
    for c in range(5):
        H[r, c] = abs(r - goal[0]) + abs(c - goal[1])

fig, ax = plt.subplots()
im = ax.imshow(H, cmap="viridis")
for r in range(5):
    for c in range(5):
        ax.text(c, r, H[r, c], ha="center", va="center", color="w")
ax.set_xticks(range(5)); ax.set_xticklabels(["col " + str(i) for i in range(5)])
ax.set_yticks(range(5)); ax.set_yticklabels(["row " + str(i) for i in range(5)])
ax.set_title("Relaxed heuristic h = Manhattan steps to goal (4,4)")
fig.colorbar(im, ax=ax)
plt.show()`
  },

  "aix-structured-perceptron": {
    question: "Does one perceptron update flip the score so the true path wins?",
    charts: [{
      type: "bars", title: "Path scores before vs after the single update",
      labels: ["true path", "wrong path"],
      values: [2, -2],
      valueLabels: ["+2", "-2"],
      colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "Starting from all-zero weights both paths tie at 0; one update (+1 to true edges, -1 to wrong edges) makes the true path score +2 and the wrong path -2, a winning gap of 4.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# One structured-perceptron update from zero weights.
phi_true  = np.array([1, 1, 0, 0])
phi_wrong = np.array([0, 0, 1, 1])
w = np.zeros(4)
w = w + phi_true - phi_wrong          # single mistake update
s_true, s_wrong = w @ phi_true, w @ phi_wrong

labels = ["true path", "wrong path"]
scores = [s_true, s_wrong]
colors = ["#7ee787", "#ff7b72"]
fig, ax = plt.subplots()
bars = ax.bar(labels, scores, color=colors)
for b, v in zip(bars, scores):
    ax.text(b.get_x() + b.get_width() / 2, v, str(int(v)),
            ha="center", va="bottom" if v >= 0 else "top")
ax.axhline(0, color="gray", lw=0.8)
ax.set_title("Path scores before vs after the single update")
plt.show()`
  },

  "aix-monte-carlo": {
    question: "Does averaging real episode returns converge to the true Q-value?",
    charts: [{
      type: "line", title: "Running mean of sampled returns vs episodes",
      xlabel: "episodes (log-ish steps)", ylabel: "Q-hat estimate",
      series: [
        { name: "running Q-hat", color: "#4ea1ff", points: [[1, 3.122], [2, 3.851], [5, 4.936], [10, 5.26], [25, 4.632], [50, 4.787], [100, 4.54], [250, 4.5], [500, 4.534], [1000, 4.573], [2000, 4.587]] },
        { name: "true Q ~ 4.59", color: "#7ee787", points: [[1, 4.587], [2000, 4.587]] }
      ]
    }],
    caption: "The running average wobbles early (5.26 at 10 episodes) then settles onto the true expected return ~4.59 by 2000 episodes, exactly as the law of large numbers predicts.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(0)
gamma = 0.9

def sample_return():
    steps = rng.integers(2, 5)        # 2..4 steps: -1 each, +10 at goal
    u, disc = 0.0, 1.0
    for _ in range(steps):
        u += disc * (-1); disc *= gamma
    return u + disc * 10

returns = [sample_return() for _ in range(2000)]
running = np.cumsum(returns) / np.arange(1, len(returns) + 1)
xs = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2000]
ys = [running[x - 1] for x in xs]

fig, ax = plt.subplots()
ax.plot(xs, ys, "-o", color="#4ea1ff", label="running Q-hat")
ax.axhline(running[-1], color="#7ee787", label="true Q ~ 4.59")
ax.set_xscale("log")
ax.set_xlabel("episodes (log-ish steps)"); ax.set_ylabel("Q-hat estimate")
ax.set_title("Running mean of sampled returns vs episodes")
ax.legend()
plt.show()`
  },

  "aix-sarsa-td": {
    question: "How does value flow back from the goal toward the start over TD sweeps?",
    charts: [{
      type: "line", title: "V(s0) climbing toward true discounted value over sweeps",
      xlabel: "sweep", ylabel: "value estimate",
      series: [
        { name: "V(s0)", color: "#4ea1ff", points: [[1, 0.041], [2, 0.123], [3, 0.226], [5, 0.418], [10, 0.626], [20, 0.656]] },
        { name: "true V(s0) = 0.656", color: "#7ee787", points: [[1, 0.656], [20, 0.656]] }
      ]
    }],
    caption: "Each TD(0) sweep seeps the +1 goal reward one cell further back; V(s0) rises from 0.04 to 0.656, matching the true discounted distance gamma^4 exactly (max error 0).",
    code: `import numpy as np
import matplotlib.pyplot as plt

N, alpha, gamma = 5, 0.5, 0.9
V = np.zeros(N); V[N - 1] = 1.0       # goal value fixed at +1
track = []
for sweep in range(1, 21):
    for s in range(N - 2, -1, -1):    # right-to-left so value flows back
        V[s] += alpha * (gamma * V[s + 1] - V[s])
    track.append(V[0])

xs = [1, 2, 3, 5, 10, 20]
ys = [track[x - 1] for x in xs]
true_v0 = gamma ** (N - 1)

fig, ax = plt.subplots()
ax.plot(xs, ys, "-o", color="#4ea1ff", label="V(s0)")
ax.axhline(true_v0, color="#7ee787", label="true V(s0) = 0.656")
ax.set_xlabel("sweep"); ax.set_ylabel("value estimate")
ax.set_title("V(s0) climbing toward true discounted value over sweeps")
ax.legend()
plt.show()`
  },

  "aix-game-theory": {
    question: "Which cell of the prisoner's dilemma is the Nash equilibrium?",
    charts: [{
      type: "heatmap", title: "Sum of payoffs A+B per cell (Nash = Defect,Defect highlighted by value)",
      rows: ["A: Cooperate", "A: Defect"],
      cols: ["B: Cooperate", "B: Defect"],
      matrix: [[-2, -3], [-3, -4]],
      showVals: true
    }],
    caption: "Defect strictly dominates for both players, so the unique Nash cell is (Defect, Defect) at A+B = -4 — worse for the pair than (Cooperate, Cooperate) at -2, yet individually stable.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Prisoner's dilemma payoffs; rows = A move, cols = B move.
A = np.array([[-1, -3], [0, -2]])
B = np.array([[-1, 0], [-3, -2]])
total = A + B                          # sum of payoffs per cell

fig, ax = plt.subplots()
im = ax.imshow(total, cmap="magma")
for r in range(2):
    for c in range(2):
        ax.text(c, r, total[r, c], ha="center", va="center", color="w")
ax.set_xticks([0, 1]); ax.set_xticklabels(["B: Cooperate", "B: Defect"])
ax.set_yticks([0, 1]); ax.set_yticklabels(["A: Cooperate", "A: Defect"])
ax.set_title("Sum of payoffs A+B per cell (Nash = Defect,Defect)")
fig.colorbar(im, ax=ax)
plt.show()`
  },

  "aix-variable-elimination": {
    question: "What factor results from summing variable B out of f1 and f2?",
    charts: [{
      type: "bars", title: "New factor g(A,C) values after eliminating B",
      labels: ["g(0,0)", "g(0,1)", "g(1,0)", "g(1,1)"],
      values: [5, 5, 7, 4],
      valueLabels: ["5", "5", "7", "4"],
      colors: ["#4ea1ff", "#4ea1ff", "#ffb454", "#4ea1ff"]
    }],
    caption: "einsum('ab,bc->ac') computes g(A,C) = sum_B f1(A,B)*f2(B,C); g(0,0)=2*1+1*3=5 and the largest entry g(1,0)=7, leaving a single factor over A and C with B gone.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Chain A - f1(A,B) - f2(B,C); eliminate B by product-then-sum.
f1 = np.array([[2.0, 1.0], [1.0, 2.0]])
f2 = np.array([[1.0, 2.0], [3.0, 1.0]])
g = np.einsum("ab,bc->ac", f1, f2)     # g(A,C) = sum_B f1[A,B]*f2[B,C]

labels = ["g(0,0)", "g(0,1)", "g(1,0)", "g(1,1)"]
vals = g.flatten()
colors = ["#ffb454" if v == vals.max() else "#4ea1ff" for v in vals]
fig, ax = plt.subplots()
bars = ax.bar(labels, vals, color=colors)
for b, v in zip(bars, vals):
    ax.text(b.get_x() + b.get_width() / 2, v, str(int(v)), ha="center", va="bottom")
ax.set_title("New factor g(A,C) values after eliminating B")
plt.show()`
  },

  "aix-gibbs-particle": {
    question: "Does the Gibbs sampler's visit histogram converge to the true posterior?",
    charts: [{
      type: "bars", title: "Gibbs estimate vs true posterior over (X,Y) cells (20k samples)",
      labels: ["(0,0)", "(0,1)", "(1,0)", "(1,1)"],
      values: [0.098, 0.201, 0.297, 0.405],
      valueLabels: ["0.098", "0.201", "0.297", "0.405"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }],
    caption: "Resampling one variable at a time from its conditional drives the empirical cell fractions to [0.098, 0.201, 0.297, 0.405], matching the true posterior [0.1, 0.2, 0.3, 0.4] within 0.005.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(0)

phi = np.array([[1.0, 2.0], [3.0, 4.0]])   # unnormalized joint over (X,Y)
def cond(fix_axis, fix_val):
    row = phi[fix_val, :] if fix_axis == 0 else phi[:, fix_val]
    return row / row.sum()

x, y = 0, 0
counts = np.zeros((2, 2))
for t in range(20000):
    x = rng.choice(2, p=cond(1, y))   # resample X | Y
    y = rng.choice(2, p=cond(0, x))   # resample Y | X
    counts[x, y] += 1
emp = (counts / counts.sum()).flatten()

labels = ["(0,0)", "(0,1)", "(1,0)", "(1,1)"]
fig, ax = plt.subplots()
bars = ax.bar(labels, emp, color="#4ea1ff")
for b, v in zip(bars, emp):
    ax.text(b.get_x() + b.get_width() / 2, v, str(round(v, 3)), ha="center", va="bottom")
ax.set_title("Gibbs estimate over (X,Y) cells (20k samples)")
plt.show()`
  },

  "aix-markov-blanket": {
    question: "Given only its Markov blanket, what is node X's local conditional posterior?",
    charts: [{
      type: "bars", title: "Local conditional posterior P(X | blanket) from blanket factors",
      labels: ["X = 1", "X = 0"],
      values: [0.789, 0.211],
      valueLabels: ["0.789", "0.211"],
      colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "Using only parent and child factors (X=1 scores 0.6*0.5=0.30, X=0 scores 0.4*0.2=0.08), X's posterior is 0.789 vs 0.211 — the rest of the net cancels, which is why Gibbs only needs the blanket {A,B,C,D,Y,Z}.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Local scores from blanket factors only (parent * child contributions).
score_x1 = 0.6 * 0.5      # X=1: prior 0.6, child likelihood 0.5
score_x0 = 0.4 * 0.2      # X=0: prior 0.4, child likelihood 0.2
post = np.array([score_x1, score_x0])
post = post / post.sum()  # normalize the local conditional

labels = ["X = 1", "X = 0"]
colors = ["#7ee787", "#ff7b72"]
fig, ax = plt.subplots()
bars = ax.bar(labels, post, color=colors)
for b, v in zip(bars, post):
    ax.text(b.get_x() + b.get_width() / 2, v, str(round(v, 3)), ha="center", va="bottom")
ax.set_title("Local conditional posterior P(X | blanket)")
plt.show()`
  },

  "aix-forward-backward": {
    question: "What is the smoothed posterior over the hidden state at each time step?",
    charts: [{
      type: "line", title: "Smoothed P(H = state 1 | all evidence) per time step",
      xlabel: "time step", ylabel: "P(H = state 1 | E)",
      series: [
        { name: "P(state 1)", color: "#4ea1ff", points: [[1, 0.811], [2, 0.26], [3, 0.792]] }
      ]
    }],
    caption: "Multiplying forward alpha by backward beta and normalizing gives smoothed beliefs [0.811, 0.26, 0.792] for state 1; the middle step dips because its observation favors state 2, using future as well as past evidence.",
    code: `import numpy as np
import matplotlib.pyplot as plt

pi = np.array([0.6, 0.4])
T  = np.array([[0.7, 0.3], [0.4, 0.6]])
E  = np.array([[0.9, 0.1], [0.2, 0.8]])    # E[state, obs]
obs = [0, 1, 0]
N = len(obs)

alpha = np.zeros((N, 2)); beta = np.zeros((N, 2))
alpha[0] = pi * E[:, obs[0]]
for i in range(1, N):
    alpha[i] = (alpha[i - 1] @ T) * E[:, obs[i]]
beta[N - 1] = 1.0
for i in range(N - 2, -1, -1):
    beta[i] = T @ (E[:, obs[i + 1]] * beta[i + 1])

post = alpha * beta
post /= post.sum(axis=1, keepdims=True)    # smoothed posterior
steps = [1, 2, 3]
fig, ax = plt.subplots()
ax.plot(steps, post[:, 0], "-o", color="#4ea1ff", label="P(state 1)")
ax.set_xticks(steps)
ax.set_xlabel("time step"); ax.set_ylabel("P(H = state 1 | E)")
ax.set_title("Smoothed P(H = state 1 | all evidence) per time step")
ax.legend()
plt.show()`
  },

  "aix-lda-topic": {
    question: "Did the collapsed Gibbs sampler separate the two hidden topics' words?",
    charts: [{
      type: "heatmap", title: "Recovered topic-word distributions phi (rows = topics)",
      rows: ["topic 0", "topic 1"],
      cols: ["word 0", "word 1", "word 2", "word 3"],
      matrix: [[0.488, 0.488, 0.012, 0.012], [0.012, 0.012, 0.488, 0.488]],
      showVals: true
    }],
    caption: "After 300 Gibbs sweeps each topic concentrates ~0.49 mass on its own word pair (topic 0 -> words 0,1; topic 1 -> words 2,3), cleanly recovering the two clusters with near-zero cross-leakage.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(0)

docs = [[0,1,0,1], [1,0,1,0], [2,3,2,3], [3,2,3,2]]
V, K = 4, 2
a, b = 0.1, 0.1
z = [rng.integers(0, K, len(d)).tolist() for d in docs]
ndk = np.zeros((len(docs), K)); nkw = np.zeros((K, V))
for d, doc in enumerate(docs):
    for i, w in enumerate(doc):
        ndk[d, z[d][i]] += 1; nkw[z[d][i], w] += 1

for _ in range(300):              # collapsed Gibbs sampling
    for d, doc in enumerate(docs):
        for i, w in enumerate(doc):
            k = z[d][i]; ndk[d, k] -= 1; nkw[k, w] -= 1
            p = (ndk[d] + a) * (nkw[:, w] + b) / (nkw.sum(1) + V * b)
            k = rng.choice(K, p=p / p.sum())
            z[d][i] = k; ndk[d, k] += 1; nkw[k, w] += 1

phi = (nkw + b) / (nkw.sum(1, keepdims=True) + V * b)
fig, ax = plt.subplots()
im = ax.imshow(phi, cmap="viridis")
for r in range(K):
    for c in range(V):
        ax.text(c, r, round(phi[r, c], 3), ha="center", va="center", color="w")
ax.set_xticks(range(V)); ax.set_xticklabels(["word " + str(i) for i in range(V)])
ax.set_yticks(range(K)); ax.set_yticklabels(["topic " + str(i) for i in range(K)])
ax.set_title("Recovered topic-word distributions phi (rows = topics)")
fig.colorbar(im, ax=ax)
plt.show()`
  },

  "aix-fol": {
    question: "How many ground facts can resolution derive on top of the asserted ones?",
    charts: [{
      type: "bars", title: "Facts known: before vs after one unify + resolve step",
      labels: ["before (given)", "after resolution"],
      values: [1, 2],
      valueLabels: ["1", "2"],
      colors: ["#ffb454", "#7ee787"]
    }],
    caption: "Unifying Knows(x,John) with Knows(Alice,y) yields {x/Alice, y/John}; resolving the fact P(a,b) against the rule not-P(a,b) or Q(a) cancels the literal and derives the new fact Q(a), growing known facts from 1 to 2.",
    code: `import matplotlib.pyplot as plt

# Start with one fact P(a,b); one resolution step against not-P(a,b) or Q(a) derives Q(a).
facts = {("P", "a", "b")}
before = len(facts)
facts.add(("Q", "a"))          # resolved new fact
after = len(facts)

labels = ["before (given)", "after resolution"]
counts = [before, after]
colors = ["#ffb454", "#7ee787"]
fig, ax = plt.subplots()
bars = ax.bar(labels, counts, color=colors)
for bar, v in zip(bars, counts):
    ax.text(bar.get_x() + bar.get_width() / 2, v, str(v), ha="center", va="bottom")
ax.set_ylabel("facts known")
ax.set_title("Facts known: before vs after one unify + resolve step")
plt.show()`
  }

});
