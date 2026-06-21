/* Per-lesson visualizations of the code's data & results. Merged into window.CODEVIZ by id.
   { question?, charts:[ chartSpec ], caption? }  — chartSpec types: bars/line/scatter/roc/confusion/heatmap.
   All numbers below are the REAL output of running each lesson's code (Python/NumPy). */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "ai-linear-predictors": {
    question: "Which emails are spam, and how confident is each call?",
    charts: [{
      type: "scatter", title: "4 emails: features and the decision line", xlabel: "count of 'free'", ylabel: "number of links",
      groups: [
        { name: "spam (y=+1)", color: "#ff7b72", points: [[2, 3], [4, 2]] },
        { name: "ham (y=-1)", color: "#4ea1ff", points: [[0, 1], [1, 0]] }
      ],
      lines: [{ name: "boundary 1.5x+0.5y-3=0", color: "#ffb454", points: [[1.333, 0.333], [2, 0]] }]
    }, {
      type: "bars", title: "Margin per email (score times true label)", labels: ["email 0", "email 1", "email 2", "email 3"],
      values: [1.5, 2.5, 4.0, 1.5], colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787"]
    }],
    caption: "Scores are [1.5, -2.5, 4.0, -1.5]; every margin is positive so all 4 emails are classified correctly (accuracy 1.0).",
    code: `import numpy as np
import matplotlib.pyplot as plt

X = np.array([[2,3,1],[0,1,1],[4,2,1],[1,0,1]])
y = np.array([1,-1,1,-1])
w = np.array([1.5, 0.5, -3.0])
scores = X @ w
margin = scores * y

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
spam, ham = y > 0, y < 0
ax1.scatter(X[spam,0], X[spam,1], c="#ff7b72", s=120, label="spam (+1)")
ax1.scatter(X[ham,0], X[ham,1], c="#4ea1ff", s=120, label="ham (-1)")
xs = np.linspace(-0.5, 4.5, 50)
ax1.plot(xs, (3 - 1.5*xs)/0.5, "#ffb454", label="boundary")
ax1.set_xlabel("count of free"); ax1.set_ylabel("links"); ax1.legend()
ax1.set_title("emails and decision line")

ax2.bar(range(4), margin, color="#7ee787")
ax2.set_xticks(range(4)); ax2.set_xticklabels(["e0","e1","e2","e3"])
ax2.set_title("margin = score * label")
plt.tight_layout(); plt.show()`
  },

  "ai-loss-minimization": {
    question: "How harshly does each loss punish the same set of margins?",
    charts: [{
      type: "bars", title: "Loss at each margin (margins: 2.0, 0.3, -0.5, 1.5, -1.2)",
      labels: ["m=2.0", "m=0.3", "m=-0.5", "m=1.5", "m=-1.2"],
      values: [0, 0.7, 1.5, 0, 2.2],
      valueLabels: ["hinge 0", "0.7", "1.5", "hinge 0", "2.2"], colors: ["#7ee787", "#ffb454", "#ff7b72", "#7ee787", "#ff7b72"]
    }, {
      type: "bars", title: "Mean loss over the 5 margins, by loss function", labels: ["zero-one", "hinge", "squared"],
      values: [0.4, 0.88, 1.766], colors: ["#4ea1ff", "#ffb454", "#c89bff"]
    }],
    caption: "Hinge stays 0 once a margin passes 1 but grows for small/negative margins; mean hinge 0.88 vs mean zero-one 0.40 vs mean squared 1.77.",
    code: `import numpy as np
import matplotlib.pyplot as plt

m = np.array([2.0, 0.3, -0.5, 1.5, -1.2])
zero_one = (m < 0).astype(float)
hinge = np.maximum(1 - m, 0)
squared = (m - 1) ** 2

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
colors = ["#7ee787" if h == 0 else ("#ff7b72" if v else "#ffb454")
          for h, v in zip(hinge, m < 0)]
ax1.bar(range(5), hinge, color=colors)
ax1.set_xticks(range(5))
ax1.set_xticklabels(["2.0","0.3","-0.5","1.5","-1.2"])
ax1.set_title("hinge loss per margin"); ax1.set_xlabel("margin")

means = [zero_one.mean(), hinge.mean(), squared.mean()]
ax2.bar(["zero-one","hinge","squared"], means,
        color=["#4ea1ff","#ffb454","#c89bff"])
ax2.set_title("mean loss by function")
plt.tight_layout(); plt.show()`
  },

  "ai-sgd": {
    question: "Does stepping downhill after each example actually drive the loss down?",
    charts: [{
      type: "line", title: "Hinge loss per epoch (SGD)", xlabel: "epoch", ylabel: "mean hinge loss",
      series: [{ name: "train loss", color: "#4ea1ff", points: [[0, 1.0], [1, 0.725], [2, 0.708], [3, 0.658], [4, 0.85], [5, 0.592], [6, 0.542], [7, 0.492]] }]
    }, {
      type: "scatter", title: "The 2 separable clouds SGD learns to split", xlabel: "x1", ylabel: "x2",
      groups: [
        { name: "class -1", color: "#4ea1ff", points: [[1, 1], [1, 2], [2, 1]] },
        { name: "class +1", color: "#ff7b72", points: [[4, 4], [5, 4], [4, 5]] }
      ]
    }],
    caption: "The noisy per-example updates trend the loss down from 1.0 to 0.49 over 8 epochs; final weights [0.25, 0.3, -0.75] separate both clouds.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(0)

X = np.array([[1,1,1],[1,2,1],[2,1,1],[4,4,1],[5,4,1],[4,5,1]], float)
y = np.array([-1,-1,-1,1,1,1], float)
w = np.zeros(3); eta = 0.05; losses = []
for epoch in range(8):
    for i in rng.permutation(len(y)):
        if y[i] * (w @ X[i]) < 1:
            w += eta * y[i] * X[i]
    losses.append(np.mean(np.maximum(1 - y * (X @ w), 0)))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.plot(range(8), losses, "-o", color="#4ea1ff")
ax1.set_xlabel("epoch"); ax1.set_ylabel("mean hinge loss")
ax1.set_title("hinge loss per epoch")
neg, pos = y < 0, y > 0
ax2.scatter(X[neg,0], X[neg,1], c="#4ea1ff", s=120, label="class -1")
ax2.scatter(X[pos,0], X[pos,1], c="#ff7b72", s=120, label="class +1")
ax2.set_xlabel("x1"); ax2.set_ylabel("x2"); ax2.legend()
ax2.set_title("two separable clouds")
plt.tight_layout(); plt.show()`
  },

  "ai-search-problem": {
    question: "What path does BFS find from S to the goal G?",
    charts: [{
      type: "scatter", title: "Search graph with the BFS path S to G", xlabel: "x", ylabel: "y",
      groups: [
        { name: "on path", color: "#7ee787", points: [[90, 180], [230, 90], [380, 60], [540, 180]] },
        { name: "off path", color: "#4ea1ff", points: [[230, 270], [380, 190], [380, 310]] }
      ],
      lines: [{ name: "path S-A-C-G", color: "#ffb454", points: [[90, 180], [230, 90], [380, 60], [540, 180]] }]
    }],
    caption: "BFS discovers nodes in order S, A, B, C, D, E, G and returns the shortest path S to A to C to G (length 3).",
    code: `from collections import deque
import matplotlib.pyplot as plt

succ = {"S":["A","B"],"A":["C","D"],"B":["D","E"],
        "C":["G"],"D":["G"],"E":["G"],"G":[]}
frontier = deque(["S"]); parent = {"S": None}
while frontier:
    u = frontier.popleft()
    if u == "G": break
    for v in succ[u]:
        if v not in parent:
            parent[v] = u; frontier.append(v)
path = []; node = "G"
while node is not None:
    path.append(node); node = parent[node]
path.reverse()

pos = {"S":(90,180),"A":(230,90),"B":(230,270),"C":(380,60),
       "D":(380,190),"E":(380,310),"G":(540,180)}
fig, ax = plt.subplots(figsize=(8, 5))
for u in succ:
    for v in succ[u]:
        ax.plot([pos[u][0],pos[v][0]],[pos[u][1],pos[v][1]],
                color="#888", zorder=1)
px = [pos[n][0] for n in path]; py = [pos[n][1] for n in path]
ax.plot(px, py, color="#ffb454", lw=3, zorder=2)
onp = set(path)
for n,(x,y) in pos.items():
    ax.scatter(x, y, s=300, zorder=3,
               c="#7ee787" if n in onp else "#4ea1ff")
    ax.annotate(n, (x, y), ha="center", va="center")
ax.set_title("BFS path S to G"); plt.show()`
  },

  "ai-tree-search": {
    question: "How do BFS (wide) and DFS (deep) differ in visit order on the same tree?",
    charts: [{
      type: "bars", title: "Visit step for each node (lower = visited earlier) — BFS", labels: ["1", "2", "3", "4", "5", "6", "7"],
      values: [1, 2, 3, 4, 5, 6, 7], colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }, {
      type: "bars", title: "Visit step for each node — DFS", labels: ["1", "2", "3", "4", "5", "6", "7"],
      values: [1, 2, 5, 3, 4, 6, 7], colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"]
    }],
    caption: "BFS visits level-by-level [1,2,3,4,5,6,7]; DFS dives into the left branch first [1,2,4,5,3,6,7].",
    code: `import matplotlib.pyplot as plt

children = {1:[2,3],2:[4,5],3:[6,7],4:[],5:[],6:[],7:[]}
def search(use_stack):
    frontier = [1]; order = []
    while frontier:
        u = frontier.pop() if use_stack else frontier.pop(0)
        order.append(u)
        kids = list(reversed(children[u])) if use_stack else children[u]
        frontier.extend(kids)
    return order

bfs = search(False); dfs = search(True)
# visit step per node id 1..7
bfs_step = [bfs.index(n)+1 for n in range(1,8)]
dfs_step = [dfs.index(n)+1 for n in range(1,8)]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.bar(range(1,8), bfs_step, color="#4ea1ff")
ax1.set_title("BFS visit step"); ax1.set_xlabel("node")
ax2.bar(range(1,8), dfs_step, color="#ffb454")
ax2.set_title("DFS visit step"); ax2.set_xlabel("node")
plt.tight_layout(); plt.show()`
  },

  "ai-graph-search": {
    question: "What is the cheapest cost from S to G, accounting for edge weights?",
    charts: [{
      type: "bars", title: "Best-known cost g to each node when UCS settles G", labels: ["S", "A", "B", "C", "D", "G"],
      values: [0, 1, 3, 3, 4, 6], valueLabels: ["0", "1", "3", "3", "4", "6"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ffb454"]
    }],
    caption: "UCS always pops the cheapest frontier node; it settles G at total cost 6 via the path S to A to B to D to G.",
    code: `import heapq
import matplotlib.pyplot as plt

edges = [("S","A",1),("S","B",4),("A","C",2),("A","B",2),
         ("B","D",1),("C","G",3),("D","G",2),("C","D",1)]
nbr = {}
for u, v, w in edges:
    nbr.setdefault(u, []).append((v, w))
    nbr.setdefault(v, []).append((u, w))

pq = [(0, "S")]; best = {"S": 0}
while pq:
    cost, u = heapq.heappop(pq)
    if cost > best.get(u, 1e9): continue
    for v, w in nbr[u]:
        if cost + w < best.get(v, 1e9):
            best[v] = cost + w
            heapq.heappush(pq, (cost + w, v))

nodes = ["S","A","B","C","D","G"]
vals = [best[n] for n in nodes]
colors = ["#7ee787"]*5 + ["#ffb454"]
fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(nodes, vals, color=colors)
for i, v in enumerate(vals):
    ax.text(i, v, str(v), ha="center", va="bottom")
ax.set_title("UCS best cost g to each node"); plt.show()`
  },

  "ai-astar": {
    question: "Which grid cells lie on the cheapest route, and which does A* skip?",
    charts: [{
      type: "heatmap", title: "f = g + h on the 5x7 grid (lower = explored first)",
      rows: ["r0", "r1", "r2", "r3", "r4"], cols: ["c0", "c1", "c2", "c3", "c4", "c5", "c6"],
      matrix: [
        [10, 8, 8, 8, 8, 8, 10],
        [8, 6, 6, 6, 6, 6, 8],
        [6, 4, 4, 4, 4, 4, 6],
        [8, 6, 6, 6, 6, 6, 8],
        [10, 8, 8, 8, 8, 8, 10]
      ], showVals: true
    }],
    caption: "Start (2,1) and goal (2,5) both sit at f=4; A* expands the low-f corridor first and leaves the darker high-f cells for last.",
    code: `import numpy as np
import matplotlib.pyplot as plt

ROWS, COLS = 5, 7
start, goal = (2, 1), (2, 5)
def manh(a, b):
    return abs(a[0]-b[0]) + abs(a[1]-b[1])

# f = g + h for each cell: g = dist from start, h = dist to goal
f = np.zeros((ROWS, COLS))
for r in range(ROWS):
    for c in range(COLS):
        f[r, c] = manh((r, c), start) + manh((r, c), goal)

fig, ax = plt.subplots(figsize=(8, 5))
im = ax.imshow(f, cmap="viridis")
for r in range(ROWS):
    for c in range(COLS):
        ax.text(c, r, int(f[r, c]), ha="center", va="center",
                color="white")
ax.set_title("f = g + h on the 5x7 grid")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-mdp": {
    question: "What immediate reward does each action earn on average from each state?",
    charts: [{
      type: "heatmap", title: "Expected immediate reward (rows = action, cols = start state)",
      rows: ["left", "right"], cols: ["state 0", "state 1", "state 2"],
      matrix: [[0.0, 0.0, 2.0], [0.0, 4.0, 5.0]], showVals: true
    }],
    caption: "Every transition row sums to 1; 'right' earns more because it slips toward the rewarding state 2 (reward 5) more often.",
    code: `import numpy as np
import matplotlib.pyplot as plt

T = np.array([
    [[0.8,0.2,0.0],[0.7,0.3,0.0],[0.0,0.6,0.4]],
    [[0.1,0.9,0.0],[0.0,0.2,0.8],[0.0,0.0,1.0]],
])
R = np.array([0.0, 0.0, 5.0])
exp_reward = T @ R                      # [action, start state]

fig, ax = plt.subplots(figsize=(7, 3))
im = ax.imshow(exp_reward, cmap="viridis", aspect="auto")
ax.set_yticks([0,1]); ax.set_yticklabels(["left","right"])
ax.set_xticks([0,1,2])
ax.set_xticklabels(["state 0","state 1","state 2"])
for a in range(2):
    for s in range(3):
        ax.text(s, a, round(exp_reward[a, s], 1),
                ha="center", va="center", color="white")
ax.set_title("expected immediate reward")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-policy-value": {
    question: "What is each state worth if we follow this fixed policy forever?",
    charts: [{
      type: "heatmap", title: "Policy values V(s) from solving (I - gamma P) V = r",
      rows: ["V"], cols: ["state 0", "state 1", "state 2"],
      matrix: [[68.43, 83.636, 100.0]], showVals: true
    }],
    caption: "Solving the linear Bellman system gives V = [68.43, 83.64, 100.0]; the absorbing state 2 (reward 10) is worth 100 at gamma 0.9.",
    code: `import numpy as np
import matplotlib.pyplot as plt

P = np.array([[0.5,0.5,0.0],
              [0.0,0.5,0.5],
              [0.0,0.0,1.0]])
r = np.array([0.0, 1.0, 10.0]); gamma = 0.9
V = np.linalg.solve(np.eye(3) - gamma * P, r)  # (I - gamma P) V = r

fig, ax = plt.subplots(figsize=(7, 2.5))
im = ax.imshow(V.reshape(1, 3), cmap="viridis", aspect="auto")
ax.set_yticks([0]); ax.set_yticklabels(["V"])
ax.set_xticks([0,1,2])
ax.set_xticklabels(["state 0","state 1","state 2"])
for s in range(3):
    ax.text(s, 0, round(V[s], 2), ha="center", va="center",
            color="white")
ax.set_title("policy values V(s)")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-qvalue": {
    question: "In each state, which action has the higher Q-value?",
    charts: [{
      type: "heatmap", title: "Q(s,a) = expected reward + gamma V (rows = action, cols = state)",
      rows: ["action 0", "action 1"], cols: ["state 0", "state 1", "state 2"],
      matrix: [[5.24, 10.36, 19.0], [7.46, 16.84, 19.0]], showVals: true
    }],
    caption: "Action 1 wins in states 0 and 1 (7.46 > 5.24, 16.84 > 10.36); the two actions tie at 19.0 in the absorbing state 2.",
    code: `import numpy as np
import matplotlib.pyplot as plt

T = np.array([
    [[0.8,0.2,0.0],[0.0,0.8,0.2],[0.0,0.0,1.0]],
    [[0.2,0.8,0.0],[0.0,0.2,0.8],[0.0,0.0,1.0]],
])
R = np.array([0.0, 1.0, 10.0])
V = np.array([5.0, 8.0, 10.0]); gamma = 0.9
Q = T @ (R + gamma * V)                 # Q[action, state]

fig, ax = plt.subplots(figsize=(7, 3))
im = ax.imshow(Q, cmap="viridis", aspect="auto")
ax.set_yticks([0,1]); ax.set_yticklabels(["action 0","action 1"])
ax.set_xticks([0,1,2])
ax.set_xticklabels(["state 0","state 1","state 2"])
for a in range(2):
    for s in range(3):
        ax.text(s, a, round(Q[a, s], 2), ha="center",
                va="center", color="white")
ax.set_title("Q(s,a) = expected reward + gamma V")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-value-iteration": {
    question: "What is each state worth under the optimal policy?",
    charts: [{
      type: "heatmap", title: "Converged optimal values V* (3-state slippery MDP)",
      rows: ["V*"], cols: ["state 0", "state 1", "state 2"],
      matrix: [[84.185, 96.083, 98.522]], showVals: true
    }, {
      type: "bars", title: "Optimal action per state (0 = left, 1 = right)", labels: ["state 0", "state 1", "state 2"],
      values: [1, 1, 0], valueLabels: ["right", "right", "left"], colors: ["#7ee787", "#7ee787", "#4ea1ff"]
    }],
    caption: "Value iteration converges after 39 sweeps to V* = [84.19, 96.08, 98.52]; the greedy policy drives right toward the goal.",
    code: `import numpy as np
import matplotlib.pyplot as plt

T = np.array([
    [[0.8,0.2,0.0],[0.0,0.8,0.2],[0.0,0.0,1.0]],
    [[0.2,0.8,0.0],[0.0,0.2,0.8],[0.0,0.0,1.0]],
])
R = np.array([0.0, 0.0, 10.0]); gamma = 0.9
V = np.zeros(3)
for _ in range(100):
    newV = (T @ (R + gamma * V)).max(axis=0)
    if np.max(np.abs(newV - V)) < 1e-6: break
    V = newV
policy = (T @ (R + gamma * V)).argmax(axis=0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 3))
im = ax1.imshow(V.reshape(1, 3), cmap="viridis", aspect="auto")
ax1.set_yticks([0]); ax1.set_yticklabels(["V*"])
ax1.set_xticks([0,1,2]); ax1.set_xticklabels(["s0","s1","s2"])
for s in range(3):
    ax1.text(s, 0, round(V[s], 2), ha="center", va="center",
             color="white")
ax1.set_title("optimal values V*")
cols = ["#7ee787" if p else "#4ea1ff" for p in policy]
ax2.bar(range(3), policy, color=cols)
ax2.set_xticks([0,1,2]); ax2.set_xticklabels(["s0","s1","s2"])
ax2.set_title("optimal action (0=left,1=right)")
plt.tight_layout(); plt.show()`
  },

  "ai-q-learning": {
    question: "Can the agent learn the right move per state from trial and error alone?",
    charts: [{
      type: "heatmap", title: "Learned Q-table (rows = state, cols = action)",
      rows: ["state 0", "state 1", "state 2", "state 3"], cols: ["left", "right"],
      matrix: [[4.58, 6.2], [4.58, 8.0], [6.2, 10.0], [0.0, 0.0]], showVals: true
    }, {
      type: "bars", title: "Recovered greedy policy (0 = left, 1 = right)", labels: ["state 0", "state 1", "state 2", "state 3"],
      values: [1, 1, 1, 0], valueLabels: ["right", "right", "right", "goal"], colors: ["#7ee787", "#7ee787", "#7ee787", "#4ea1ff"]
    }],
    caption: "After 400 episodes Q-learning learns 'go right' everywhere; Q-values rise toward the goal (10.0 for right in state 2).",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(0)

N, A = 4, 2
def step(s, a):
    s2 = max(0, s-1) if a == 0 else min(N-1, s+1)
    return s2, (10.0 if s2 == N-1 else -1.0)
Q = np.zeros((N, A)); alpha, gamma, eps = 0.5, 0.9, 0.2
for ep in range(400):
    s = 0
    for _ in range(20):
        a = rng.integers(A) if rng.random() < eps else int(Q[s].argmax())
        s2, r = step(s, a)
        Q[s, a] += alpha * (r + gamma * Q[s2].max() - Q[s, a])
        s = s2
        if s == N-1: break
policy = Q.argmax(axis=1)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
im = ax1.imshow(Q, cmap="viridis", aspect="auto")
ax1.set_xticks([0,1]); ax1.set_xticklabels(["left","right"])
ax1.set_yticks(range(4))
ax1.set_yticklabels(["s0","s1","s2","s3"])
for s in range(N):
    for a in range(A):
        ax1.text(a, s, round(Q[s, a], 2), ha="center",
                 va="center", color="white")
ax1.set_title("learned Q-table")
cols = ["#7ee787" if p else "#4ea1ff" for p in policy]
ax2.bar(range(4), policy, color=cols)
ax2.set_xticks(range(4))
ax2.set_xticklabels(["s0","s1","s2","s3"])
ax2.set_title("greedy policy (0=left,1=right)")
plt.tight_layout(); plt.show()`
  },

  "ai-minimax": {
    question: "Which top move wins when the opponent plays optimally?",
    charts: [{
      type: "bars", title: "Backed-up MIN value of each root child (MAX picks the larger)",
      labels: ["subtree 0", "subtree 1"], values: [8, 6], colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "Each subtree reports its MIN value (8 and 6); the MAX root picks subtree 0, so the minimax value is 8.",
    code: `import matplotlib.pyplot as plt

tree = [[[3, 12], [8, 2]], [[4, 6], [14, 5]]]
def minimax(node, maximizing):
    if isinstance(node, int):
        return node
    vals = [minimax(c, not maximizing) for c in node]
    return max(vals) if maximizing else min(vals)

sub = [minimax(t, maximizing=False) for t in tree]  # MIN value per child
best = int(max(range(len(sub)), key=lambda i: sub[i]))

fig, ax = plt.subplots(figsize=(6, 4))
cols = ["#7ee787" if i == best else "#ff7b72" for i in range(len(sub))]
ax.bar(["subtree 0","subtree 1"], sub, color=cols)
for i, v in enumerate(sub):
    ax.text(i, v, str(v), ha="center", va="bottom")
ax.set_title("MIN value per root child (MAX picks larger)")
plt.show()`
  },

  "ai-alpha-beta": {
    question: "Does pruning reach the same answer while skipping leaves?",
    charts: [{
      type: "bars", title: "Leaves examined: alpha-beta vs full minimax", labels: ["alpha-beta", "full minimax"],
      values: [6, 8], valueLabels: ["6 visited", "8 total"], colors: ["#7ee787", "#ffb454"]
    }],
    caption: "Alpha-beta returns the same value 8 but examines only 6 of 8 leaves — 2 branches are pruned with no change to the decision.",
    code: `import matplotlib.pyplot as plt

tree = [[[3, 12], [8, 2]], [[4, 6], [14, 5]]]
visited = [0]
def ab(node, alpha, beta, maximizing):
    if isinstance(node, int):
        visited[0] += 1
        return node
    if maximizing:
        v = -10**9
        for c in node:
            v = max(v, ab(c, alpha, beta, False))
            alpha = max(alpha, v)
            if alpha >= beta: break
        return v
    v = 10**9
    for c in node:
        v = min(v, ab(c, alpha, beta, True))
        beta = min(beta, v)
        if alpha >= beta: break
    return v

ab(tree, -10**9, 10**9, True)
total = 8
fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(["alpha-beta","full minimax"], [visited[0], total],
       color=["#7ee787","#ffb454"])
ax.text(0, visited[0], str(visited[0]), ha="center", va="bottom")
ax.text(1, total, str(total), ha="center", va="bottom")
ax.set_title("leaves examined: alpha-beta vs minimax")
plt.show()`
  },

  "ai-expectimax": {
    question: "Does it matter whether the opponent is adversarial or random?",
    charts: [{
      type: "bars", title: "Root value under each opponent model", labels: ["minimax (worst case)", "expectimax (random)"],
      values: [3, 7.67], colors: ["#ff7b72", "#7ee787"]
    }, {
      type: "bars", title: "How each subtree is scored (min vs average of its leaves)",
      labels: ["subtree 0 min", "subtree 1 min", "subtree 0 avg", "subtree 1 avg"],
      values: [3, 2, 7.67, 4.0], colors: ["#ff7b72", "#ff7b72", "#7ee787", "#7ee787"]
    }],
    caption: "Against a worst-case opponent the root is worth 3; against a random one it is worth 7.67 — the assumed opponent changes the move's value.",
    code: `import matplotlib.pyplot as plt

tree = [[3, 12, 8], [4, 6, 2]]
sub_min = [min(t) for t in tree]
sub_avg = [sum(t) / len(t) for t in tree]
mm = max(sub_min)            # adversarial opponent
em = max(sub_avg)            # random opponent

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.bar(["minimax","expectimax"], [mm, em],
        color=["#ff7b72","#7ee787"])
ax1.set_title("root value by opponent model")
labels = ["s0 min","s1 min","s0 avg","s1 avg"]
vals = sub_min + sub_avg
cols = ["#ff7b72","#ff7b72","#7ee787","#7ee787"]
ax2.bar(labels, [round(v, 2) for v in vals], color=cols)
ax2.set_title("subtree score: min vs avg")
plt.tight_layout(); plt.show()`
  },

  "ai-csp": {
    question: "Does each map coloring satisfy every 'adjacent regions differ' constraint?",
    charts: [{
      type: "bars", title: "Constraint violations per assignment (9 edges total)", labels: ["good assignment", "bad assignment"],
      values: [0, 1], valueLabels: ["0 (valid)", "1 (SA=NSW clash)"], colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "The good coloring violates 0 of 9 adjacency constraints; flipping NSW to blue creates 1 clash with SA, so it fails.",
    code: `import matplotlib.pyplot as plt

edges = [("WA","NT"),("WA","SA"),("NT","SA"),("NT","Q"),
         ("SA","Q"),("SA","NSW"),("SA","V"),("Q","NSW"),("NSW","V")]
def violations(assign):
    return sum(1 for a, b in edges if assign[a] == assign[b])

good = {"WA":"red","NT":"green","SA":"blue",
        "Q":"red","NSW":"green","V":"red"}
bad = dict(good); bad["NSW"] = "blue"
vals = [violations(good), violations(bad)]

fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(["good","bad"], vals, color=["#7ee787","#ff7b72"])
for i, v in enumerate(vals):
    ax.text(i, v, str(v), ha="center", va="bottom")
ax.set_title("constraint violations (9 edges total)")
plt.show()`
  },

  "ai-csp-search": {
    question: "What full coloring does backtracking find for the 7 regions?",
    charts: [{
      type: "bars", title: "Color assigned to each region (1=red, 2=green, 3=blue)",
      labels: ["WA", "NT", "SA", "Q", "NSW", "V", "T"], values: [1, 2, 3, 1, 2, 1, 1],
      valueLabels: ["red", "green", "blue", "red", "green", "red", "red"],
      colors: ["#ff7b72", "#7ee787", "#4ea1ff", "#ff7b72", "#7ee787", "#ff7b72", "#ff7b72"]
    }],
    caption: "Backtracking assigns one region at a time and finds a valid 3-coloring: WA red, NT green, SA blue, then the rest fit without clashes.",
    code: `import matplotlib.pyplot as plt

variables = ["WA","NT","SA","Q","NSW","V","T"]
colors = ["red","green","blue"]
edges = [("WA","NT"),("WA","SA"),("NT","SA"),("NT","Q"),
         ("SA","Q"),("SA","NSW"),("SA","V"),("Q","NSW"),("NSW","V")]
def ok(var, color, assign):
    for a, b in edges:
        if a == var and assign.get(b) == color: return False
        if b == var and assign.get(a) == color: return False
    return True
def backtrack(assign):
    if len(assign) == len(variables): return assign
    var = next(v for v in variables if v not in assign)
    for color in colors:
        if ok(var, color, assign):
            assign[var] = color
            if backtrack(assign): return assign
            del assign[var]
    return None
sol = backtrack({})

code_of = {"red":1, "green":2, "blue":3}
palette = {"red":"#ff7b72","green":"#7ee787","blue":"#4ea1ff"}
vals = [code_of[sol[v]] for v in variables]
cols = [palette[sol[v]] for v in variables]
fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(variables, vals, color=cols)
for i, v in enumerate(variables):
    ax.text(i, vals[i], sol[v], ha="center", va="bottom")
ax.set_title("color per region (1=red,2=green,3=blue)")
plt.show()`
  },

  "ai-bayes-net": {
    question: "How likely is the alarm ringing with no burglary and no earthquake?",
    charts: [{
      type: "bars", title: "Joint probability of the queried assignment vs its complement",
      labels: ["P(B=F,E=F,A=T)", "everything else"], values: [0.000997, 0.999003],
      valueLabels: ["0.000997", "0.999003"], colors: ["#ffb454", "#4ea1ff"]
    }],
    caption: "Multiplying the CPT entries gives P(no burglary, no quake, alarm) = 0.000997; the full joint over all 8 assignments sums to 1.0.",
    code: `import matplotlib.pyplot as plt

pB = {True: 0.001, False: 0.999}
pE = {True: 0.002, False: 0.998}
pA = {(True,True):0.95,(True,False):0.94,
      (False,True):0.29,(False,False):0.001}
def joint(b, e, a):
    pa = pA[(b, e)] if a else 1 - pA[(b, e)]
    return pB[b] * pE[e] * pa

p = joint(False, False, True)
vals = [p, 1 - p]

fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(["P(B=F,E=F,A=T)","everything else"], vals,
       color=["#ffb454","#4ea1ff"])
for i, v in enumerate(vals):
    ax.text(i, v, round(v, 6), ha="center", va="bottom")
ax.set_title("joint probability of queried assignment")
plt.show()`
  },

  "ai-bayes-inference": {
    question: "Given the alarm rang, what is the posterior over Burglary?",
    charts: [{
      type: "bars", title: "Posterior P(Burglary | Alarm = True)", labels: ["Burglary = True", "Burglary = False"],
      values: [0.3736, 0.6264], colors: ["#ff7b72", "#4ea1ff"]
    }],
    caption: "Summing out Earthquake and normalizing gives P(Burglary | Alarm) = 0.37 — the alarm raises burglary far above its 0.001 prior but a quiet night is still likelier.",
    code: `import matplotlib.pyplot as plt

pB = {True: 0.001, False: 0.999}
pE = {True: 0.002, False: 0.998}
pA = {(True,True):0.95,(True,False):0.94,
      (False,True):0.29,(False,False):0.001}
def joint(b, e, a):
    pa = pA[(b, e)] if a else 1 - pA[(b, e)]
    return pB[b] * pE[e] * pa

unnorm = {b: sum(joint(b, e, True) for e in (True, False))
          for b in (True, False)}
z = unnorm[True] + unnorm[False]
post = [unnorm[True] / z, unnorm[False] / z]

fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(["Burglary=True","Burglary=False"], post,
       color=["#ff7b72","#4ea1ff"])
for i, v in enumerate(post):
    ax.text(i, v, round(v, 4), ha="center", va="bottom")
ax.set_title("posterior P(Burglary | Alarm=True)")
plt.show()`
  },

  "ai-hmm": {
    question: "How does the belief that it is raining change as umbrellas are observed?",
    charts: [{
      type: "line", title: "Filtered belief P(rain) over 3 days", xlabel: "day", ylabel: "P(rain)",
      series: [{ name: "P(rain)", color: "#4ea1ff", points: [[0, 0.818], [1, 0.883], [2, 0.191] ] }]
    }],
    caption: "Umbrella on days 0 and 1 pushes P(rain) up to 0.82 then 0.88; no umbrella on day 2 collapses it to 0.19.",
    code: `import numpy as np
import matplotlib.pyplot as plt

T = np.array([[0.7, 0.3], [0.3, 0.7]])
E_umb = np.array([0.9, 0.2])
belief = np.array([0.5, 0.5])
observations = [True, True, False]
p_rain = []
for saw in observations:
    belief = belief @ T                 # predict
    e = E_umb if saw else (1 - E_umb)
    belief = belief * e                 # update by observation
    belief = belief / belief.sum()      # renormalize
    p_rain.append(belief[0])

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(range(3), p_rain, "-o", color="#4ea1ff")
ax.set_xticks(range(3)); ax.set_xlabel("day")
ax.set_ylabel("P(rain)"); ax.set_ylim(0, 1)
ax.set_title("filtered belief P(rain) over 3 days")
plt.show()`
  },

  "ai-propositional-logic": {
    question: "Does the knowledge base entail R, and how many models survive it?",
    charts: [{
      type: "bars", title: "Truth-table check: facts true in every KB-satisfying model",
      labels: ["P", "Q", "R"], values: [1, 1, 1], valueLabels: ["true", "true", "true (entailed)"],
      colors: ["#7ee787", "#7ee787", "#ffb454"]
    }],
    caption: "Of 8 assignments, exactly 1 satisfies the KB (P->Q, Q->R, P); R is true there, so the KB entails R.",
    code: `import itertools
import matplotlib.pyplot as plt

symbols = ["P", "Q", "R"]
def kb(m):
    return ((not m["P"]) or m["Q"]) and ((not m["Q"]) or m["R"]) and m["P"]

# facts true in every model that satisfies the KB
sat = [dict(zip(symbols, v))
       for v in itertools.product([False, True], repeat=3)
       if kb(dict(zip(symbols, v)))]
truth = [int(all(m[s] for m in sat)) for s in symbols]

fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(symbols, truth, color=["#7ee787","#7ee787","#ffb454"])
for i, s in enumerate(symbols):
    ax.text(i, truth[i], "true" if truth[i] else "false",
            ha="center", va="bottom")
ax.set_ylim(0, 1.3)
ax.set_title("facts true in every KB-satisfying model")
plt.show()`
  },

  "ai-inference-rules": {
    question: "Starting from just A, which facts does forward chaining derive?",
    charts: [{
      type: "bars", title: "Facts known before vs after forward chaining", labels: ["A", "B", "C", "D", "E"],
      values: [1, 1, 1, 1, 1],
      valueLabels: ["known", "derived", "derived", "derived", "derived"],
      colors: ["#4ea1ff", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
    }],
    caption: "Starting from {A}, modus ponens fires in order to derive B, C, D, then E — the full closure is {A, B, C, D, E}.",
    code: `import matplotlib.pyplot as plt

rules = [(["A","B"],"C"), (["C"],"D"), (["A"],"B"), (["D","C"],"E")]
facts = {"A"}; order = ["A"]
changed = True
while changed:
    changed = False
    for premises, conclusion in rules:
        if conclusion not in facts and all(p in facts for p in premises):
            facts.add(conclusion); order.append(conclusion)
            changed = True

labels = ["A","B","C","D","E"]
known = [1] * len(labels)
cols = ["#4ea1ff"] + ["#7ee787"] * 4
fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(labels, known, color=cols)
for i, l in enumerate(labels):
    ax.text(i, 1, "known" if l == "A" else "derived",
            ha="center", va="bottom")
ax.set_ylim(0, 1.4)
ax.set_title("facts before vs after forward chaining")
plt.show()`
  }

});
