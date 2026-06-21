/* Per-lesson visualizations of the code's data & results. Merged into window.CODEVIZ by id.
   { question?, charts:[ chartSpec ], caption? }  — chartSpec types: bars/line/scatter/roc/confusion/heatmap.
   Every entry runs a REAL algorithm on a concrete, NAMED real-world scenario; all numbers are the
   actual output of running each lesson's code (Python/NumPy/scikit-learn). */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "ai-linear-predictors": {
    question: "On the Wisconsin breast-cancer scan data, which tumors does a linear classifier call benign vs malignant?",
    charts: [{
      type: "scatter", title: "Breast tumors: mean radius vs mean texture, with the learned decision line", xlabel: "mean radius", ylabel: "mean texture",
      groups: [
        { name: "malignant (y=-1)", color: "#ff7b72", points: [[18.0, 10.4], [12.4, 15.7], [16.0, 23.2], [19.7, 21.3], [20.6, 29.3]] },
        { name: "benign (y=+1)", color: "#4ea1ff", points: [[13.5, 14.4], [12.0, 14.6], [11.5, 18.8], [9.5, 12.4], [13.0, 21.8]] }
      ],
      lines: [{ name: "decision line", color: "#ffb454", points: [[12, 32.6], [14, 23.31], [16, 14.02], [18, 4.73]] }]
    }],
    caption: "Logistic regression on 569 real tumor scans (radius, texture) reaches 89.1% accuracy; bigger, rougher tumors fall on the malignant side of the line.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

d = load_breast_cancer()
X = d.data[:, [0, 1]]            # mean radius, mean texture
y = d.target                    # 1 benign, 0 malignant
sc = StandardScaler().fit(X)
clf = LogisticRegression().fit(sc.transform(X), y)
print("train accuracy", clf.score(sc.transform(X), y))

w, b = clf.coef_[0], clf.intercept_[0]
m, s = sc.mean_, sc.scale_
def boundary_texture(radius):
    z0 = (radius - m[0]) / s[0]
    return (-(w[0]*z0 + b) / w[1]) * s[1] + m[1]

fig, ax = plt.subplots(figsize=(8, 5))
mal, ben = y == 0, y == 1
ax.scatter(X[mal,0], X[mal,1], c="#ff7b72", s=14, label="malignant")
ax.scatter(X[ben,0], X[ben,1], c="#4ea1ff", s=14, label="benign")
xs = np.linspace(10, 20, 20)
ax.plot(xs, [boundary_texture(r) for r in xs], "#ffb454", lw=3, label="decision line")
ax.set_xlabel("mean radius"); ax.set_ylabel("mean texture")
ax.set_ylim(5, 40); ax.legend()
ax.set_title("breast tumors and the learned decision line")
plt.show()`
  },

  "ai-loss-minimization": {
    question: "On real breast-cancer scans, how harshly does each loss punish the model's margins?",
    charts: [{
      type: "bars", title: "Hinge loss on 5 named tumor scans (margin = score times true label)",
      labels: ["scan 1 (m=1.14)", "scan 6 (m=-3.02)", "scan 21 (m=2.42)", "scan 51 (m=2.47)", "scan 101 (m=-0.03)"],
      values: [0, 4.021, 0, 0, 1.029],
      valueLabels: ["hinge 0", "4.02", "hinge 0", "hinge 0", "1.03"],
      colors: ["#7ee787", "#ff7b72", "#7ee787", "#7ee787", "#ffb454"]
    }, {
      type: "bars", title: "Mean loss over all 569 tumor scans, by loss function", labels: ["zero-one", "hinge", "squared"],
      values: [0.109, 0.274, 9.513], colors: ["#4ea1ff", "#ffb454", "#c89bff"]
    }],
    caption: "Confident correct scans (margin > 1) get zero hinge loss; the badly-misclassified scan 6 (margin -3.02) is punished hard. Mean hinge 0.27 vs zero-one 0.11 vs squared 9.51 across the dataset.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

d = load_breast_cancer()
X = d.data[:, [0, 1]]; y = d.target
sc = StandardScaler().fit(X); Xs = sc.transform(X)
clf = LogisticRegression().fit(Xs, y)
w, b = clf.coef_[0], clf.intercept_[0]
margin = (Xs @ w + b) * (2*y - 1)

sel = [0, 5, 20, 50, 100]
ms = margin[sel]
hinge_sel = np.maximum(1 - ms, 0)
zero_one = (margin < 0).mean()
hinge = np.maximum(1 - margin, 0).mean()
squared = ((margin - 1) ** 2).mean()

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
cols = ["#7ee787" if h == 0 else "#ff7b72" for h in hinge_sel]
ax1.bar(range(5), hinge_sel, color=cols)
ax1.set_xticks(range(5)); ax1.set_xticklabels([str(i+1) for i in sel])
ax1.set_title("hinge loss on 5 named scans"); ax1.set_xlabel("scan id")
ax2.bar(["zero-one","hinge","squared"], [zero_one, hinge, squared],
        color=["#4ea1ff","#ffb454","#c89bff"])
ax2.set_title("mean loss over 569 scans")
plt.tight_layout(); plt.show()`
  },

  "ai-sgd": {
    question: "Training on real breast-cancer scans one tumor at a time, does SGD drive the loss down?",
    charts: [{
      type: "line", title: "Hinge loss per epoch, SGD on breast-cancer scans", xlabel: "epoch", ylabel: "mean hinge loss",
      series: [{ name: "train loss", color: "#4ea1ff", points: [[0, 0.297], [1, 0.281], [2, 0.273], [3, 0.27], [4, 0.268], [5, 0.266], [6, 0.266], [7, 0.265], [8, 0.265], [9, 0.265], [10, 0.265], [11, 0.265]] }]
    }, {
      type: "scatter", title: "The two tumor clouds SGD learns to separate", xlabel: "mean radius (standardized)", ylabel: "mean texture (standardized)",
      groups: [
        { name: "malignant", color: "#ff7b72", points: [[1.1, -1.3], [0.0, -0.6], [0.6, 0.4], [1.4, 0.1], [1.6, 1.2] ] },
        { name: "benign", color: "#4ea1ff", points: [[-0.3, -0.5], [-0.7, -0.5], [-0.8, 0.2], [-1.5, -0.9], [-0.4, 0.5] ] }
      ]
    }],
    caption: "Stochastic per-tumor hinge updates pull the mean loss from 0.30 down to 0.265 over 12 epochs, settling at 89.1% accuracy on the 569 scans.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler

d = load_breast_cancer()
X = StandardScaler().fit_transform(d.data[:, [0, 1]])
y = (2*d.target - 1).astype(float)            # +1 benign, -1 malignant
Xb = np.hstack([X, np.ones((len(X), 1))])
rng = np.random.default_rng(0)
w = np.zeros(3); eta = 0.01; losses = []
for epoch in range(12):
    for i in rng.permutation(len(y)):
        if y[i] * (w @ Xb[i]) < 1:
            w += eta * y[i] * Xb[i]
    losses.append(np.mean(np.maximum(1 - y * (Xb @ w), 0)))
acc = ((Xb @ w > 0).astype(int) == d.target).mean()
print("final accuracy", acc)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.plot(range(12), losses, "-o", color="#4ea1ff")
ax1.set_xlabel("epoch"); ax1.set_ylabel("mean hinge loss")
ax1.set_title("hinge loss per epoch")
mal, ben = d.target == 0, d.target == 1
ax2.scatter(X[mal,0], X[mal,1], c="#ff7b72", s=12, label="malignant")
ax2.scatter(X[ben,0], X[ben,1], c="#4ea1ff", s=12, label="benign")
ax2.set_xlabel("radius (std)"); ax2.set_ylabel("texture (std)"); ax2.legend()
ax2.set_title("two tumor clouds")
plt.tight_layout(); plt.show()`
  },

  "ai-search-problem": {
    question: "What route does BFS find for a courier driving from the Ferry Building to the Castro?",
    charts: [{
      type: "scatter", title: "San Francisco district map: BFS route Ferry Building to Castro", xlabel: "x", ylabel: "y",
      groups: [
        { name: "on route", color: "#7ee787", points: [[540, 300], [360, 210], [200, 150], [90, 90]] },
        { name: "off route", color: "#4ea1ff", points: [[420, 330], [470, 420], [330, 90], [230, 40]] }
      ],
      lines: [{ name: "route FB-US-CC-CA", color: "#ffb454", points: [[540, 300], [360, 210], [200, 150], [90, 90]] }]
    }],
    caption: "BFS over the 8-district road network returns the fewest-hop route Ferry Building to Union Square to Civic Center to Castro.",
    code: `from collections import deque
import matplotlib.pyplot as plt

edges = [("FB","US"),("FB","CT"),("CT","NB"),("US","CT"),("US","SO"),
         ("SO","MS"),("US","CC"),("CC","MS"),("MS","CA"),("CC","CA"),("NB","US")]
nbr = {}
for u, v in edges:
    nbr.setdefault(u, []).append(v); nbr.setdefault(v, []).append(u)

parent = {"FB": None}; frontier = deque(["FB"])
while frontier:
    u = frontier.popleft()
    if u == "CA": break
    for v in sorted(nbr[u]):
        if v not in parent:
            parent[v] = u; frontier.append(v)
path = []; n = "CA"
while n is not None: path.append(n); n = parent[n]
path.reverse()
print("route", path)

pos = {"FB":(540,300),"US":(360,210),"CT":(420,330),"NB":(470,420),
       "CC":(200,150),"SO":(330,90),"MS":(230,40),"CA":(90,90)}
fig, ax = plt.subplots(figsize=(8, 6))
for u, v in edges:
    ax.plot([pos[u][0],pos[v][0]], [pos[u][1],pos[v][1]], color="#888", zorder=1)
px = [pos[n][0] for n in path]; py = [pos[n][1] for n in path]
ax.plot(px, py, color="#ffb454", lw=3, zorder=2)
onp = set(path)
for n,(x,y) in pos.items():
    ax.scatter(x, y, s=400, zorder=3, c="#7ee787" if n in onp else "#4ea1ff")
    ax.annotate(n, (x, y), ha="center", va="center")
ax.set_title("SF district map: BFS route FB to CA"); plt.show()`
  },

  "ai-tree-search": {
    question: "Exploring the SF district map from the Ferry Building, how do BFS and DFS differ in visit order?",
    charts: [{
      type: "bars", title: "BFS visit step per district (lower = visited earlier)", labels: ["FB", "CT", "US", "NB", "CC", "SO", "CA", "MS"],
      values: [1, 2, 3, 4, 5, 6, 7, 8], colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }, {
      type: "bars", title: "DFS visit step per district", labels: ["FB", "CT", "US", "NB", "CC", "SO", "CA", "MS"],
      values: [1, 2, 4, 3, 5, 8, 6, 7], colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"]
    }],
    caption: "From the Ferry Building, BFS fans out by distance [FB, CT, US, NB, ...]; DFS plunges down one corridor first [FB, CT, NB, US, ...].",
    code: `from collections import deque
import matplotlib.pyplot as plt

edges = [("FB","US"),("FB","CT"),("CT","NB"),("US","CT"),("US","SO"),
         ("SO","MS"),("US","CC"),("CC","MS"),("MS","CA"),("CC","CA"),("NB","US")]
nbr = {}
for u, v in edges:
    nbr.setdefault(u, []).append(v); nbr.setdefault(v, []).append(u)

def bfs(start):
    seen = [start]; fr = deque([start])
    while fr:
        u = fr.popleft()
        for v in sorted(nbr[u]):
            if v not in seen: seen.append(v); fr.append(v)
    return seen
def dfs(start):
    seen = []; st = [start]
    while st:
        u = st.pop()
        if u in seen: continue
        seen.append(u)
        for v in sorted(nbr[u], reverse=True):
            if v not in seen: st.append(v)
    return seen

ids = ["FB","CT","US","NB","CC","SO","CA","MS"]
b, d = bfs("FB"), dfs("FB")
bstep = [b.index(n)+1 for n in ids]; dstep = [d.index(n)+1 for n in ids]
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.bar(ids, bstep, color="#4ea1ff"); ax1.set_title("BFS visit step")
ax2.bar(ids, dstep, color="#ffb454"); ax2.set_title("DFS visit step")
plt.tight_layout(); plt.show()`
  },

  "ai-graph-search": {
    question: "Accounting for real driving distances, what is the cheapest route from the Ferry Building to the Castro?",
    charts: [{
      type: "bars", title: "UCS cheapest miles to each district when the Castro settles", labels: ["FB", "CT", "US", "NB", "SO", "CC", "MS", "CA"],
      values: [0.0, 0.9, 1.2, 1.6, 2.2, 2.5, 3.3, 4.1],
      valueLabels: ["0.0", "0.9", "1.2", "1.6", "2.2", "2.5", "3.3", "4.1"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ffb454"]
    }],
    caption: "Uniform-cost search always pops the cheapest-so-far district; it settles the Castro at 4.1 miles via Ferry Building to Union Square to Civic Center to Castro.",
    code: `import heapq
import matplotlib.pyplot as plt

edges = [("FB","US",1.2),("FB","CT",0.9),("CT","NB",0.7),("US","CT",0.6),
         ("US","SO",1.0),("SO","MS",1.1),("US","CC",1.3),("CC","MS",1.4),
         ("MS","CA",1.0),("CC","CA",1.6),("NB","US",1.1)]
nbr = {}
for u, v, w in edges:
    nbr.setdefault(u, []).append((v, w)); nbr.setdefault(v, []).append((u, w))

pq = [(0.0, "FB")]; best = {"FB": 0.0}
while pq:
    cost, u = heapq.heappop(pq)
    if cost > best.get(u, 1e9): continue
    for v, w in nbr[u]:
        if cost + w < best.get(v, 1e9):
            best[v] = cost + w; heapq.heappush(pq, (cost + w, v))

order = ["FB","CT","US","NB","SO","CC","MS","CA"]
vals = [round(best[n], 1) for n in order]
cols = ["#7ee787"]*7 + ["#ffb454"]
fig, ax = plt.subplots(figsize=(9, 4))
ax.bar(order, vals, color=cols)
for i, v in enumerate(vals): ax.text(i, v, str(v), ha="center", va="bottom")
ax.set_title("UCS cheapest miles to each district"); plt.show()`
  },

  "ai-astar": {
    question: "On a downtown street grid, which blocks does A* explore first when routing a delivery van?",
    charts: [{
      type: "heatmap", title: "f = g + h over the 5x7 block grid (SOMA depot to a customer)",
      rows: ["1st St", "2nd St", "3rd St", "4th St", "5th St"], cols: ["A", "B", "C", "D", "E", "F", "G"],
      matrix: [
        [10, 8, 8, 8, 8, 8, 10],
        [8, 6, 6, 6, 6, 6, 8],
        [6, 4, 4, 4, 4, 4, 6],
        [8, 6, 6, 6, 6, 6, 8],
        [10, 8, 8, 8, 8, 8, 10]
      ], showVals: true
    }],
    caption: "Depot at 3rd-and-B and customer at 3rd-and-F both sit at f=4; A* expands the low-f corridor between them first and saves the dark high-f corner blocks for last.",
    code: `import numpy as np
import matplotlib.pyplot as plt

ROWS, COLS = 5, 7
depot, customer = (2, 1), (2, 5)        # 3rd-and-B, 3rd-and-F
def manh(a, b): return abs(a[0]-b[0]) + abs(a[1]-b[1])

f = np.zeros((ROWS, COLS))
for r in range(ROWS):
    for c in range(COLS):
        f[r, c] = manh((r, c), depot) + manh((r, c), customer)

fig, ax = plt.subplots(figsize=(8, 5))
im = ax.imshow(f, cmap="viridis")
ax.set_yticks(range(5)); ax.set_yticklabels(["1st","2nd","3rd","4th","5th"])
ax.set_xticks(range(7)); ax.set_xticklabels(list("ABCDEFG"))
for r in range(ROWS):
    for c in range(COLS):
        ax.text(c, r, int(f[r, c]), ha="center", va="center", color="white")
ax.set_title("f = g + h over the downtown block grid")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-mdp": {
    question: "For a warehouse picking robot advancing down an aisle, what immediate reward does each move earn on average?",
    charts: [{
      type: "heatmap", title: "Expected immediate reward (rows = move, cols = robot location)",
      rows: ["advance", "retreat"], cols: ["aisle start", "mid-aisle", "shelf"],
      matrix: [[0.0, 0.3, 1.0], [0.0, 0.0, 0.4]], showVals: true
    }],
    caption: "Each transition row sums to 1; 'advance' beats 'retreat' because it slips toward the shelf (reward +1 for the picked item) more often.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# states: aisle-start, mid-aisle, shelf ; actions: advance, retreat
T = np.array([
    [[0.8,0.2,0.0],[0.0,0.7,0.3],[0.0,0.0,1.0]],   # advance
    [[1.0,0.0,0.0],[0.6,0.4,0.0],[0.0,0.6,0.4]],   # retreat
])
R = np.array([0.0, 0.0, 1.0])          # reward for reaching the shelf
exp_reward = T @ R                     # [action, state]

fig, ax = plt.subplots(figsize=(7, 3))
im = ax.imshow(exp_reward, cmap="viridis", aspect="auto")
ax.set_yticks([0,1]); ax.set_yticklabels(["advance","retreat"])
ax.set_xticks([0,1,2]); ax.set_xticklabels(["aisle start","mid-aisle","shelf"])
for a in range(2):
    for s in range(3):
        ax.text(s, a, round(exp_reward[a, s], 1), ha="center", va="center", color="white")
ax.set_title("warehouse robot: expected immediate reward")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-policy-value": {
    question: "If the warehouse robot always advances down the aisle, what is each spot worth?",
    charts: [{
      type: "heatmap", title: "Policy values V(s) for 'always advance', from (I - gamma P) V = r",
      rows: ["V"], cols: ["aisle start", "mid-aisle", "shelf"],
      matrix: [[46.38, 72.703, 100.0]], showVals: true
    }],
    caption: "Solving the linear Bellman system gives V = [46.38, 72.70, 100.0]; the shelf (reward 10) is worth 100 at gamma 0.9, and spots farther from it are worth less.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# fixed policy 'always advance' transition matrix
P = np.array([[0.8,0.2,0.0],
              [0.0,0.7,0.3],
              [0.0,0.0,1.0]])
r = np.array([-0.1, -0.1, 10.0]); gamma = 0.9
V = np.linalg.solve(np.eye(3) - gamma * P, r)   # (I - gamma P) V = r

fig, ax = plt.subplots(figsize=(7, 2.5))
im = ax.imshow(V.reshape(1, 3), cmap="viridis", aspect="auto")
ax.set_yticks([0]); ax.set_yticklabels(["V"])
ax.set_xticks([0,1,2]); ax.set_xticklabels(["aisle start","mid-aisle","shelf"])
for s in range(3):
    ax.text(s, 0, round(V[s], 2), ha="center", va="center", color="white")
ax.set_title("warehouse: policy values V(s) for always-advance")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-qvalue": {
    question: "At each aisle spot, should the warehouse robot advance or retreat?",
    charts: [{
      type: "heatmap", title: "Q(s,a) = expected reward + gamma V (rows = move, cols = spot)",
      rows: ["advance", "retreat"], cols: ["aisle start", "mid-aisle", "shelf"],
      matrix: [[5.04, 8.04, 10.0], [4.5, 5.58, 8.32]], showVals: true
    }],
    caption: "Advancing wins everywhere (5.04 > 4.50 at the start, 8.04 > 5.58 mid-aisle): moving toward the shelf has higher Q than backing off.",
    code: `import numpy as np
import matplotlib.pyplot as plt

T = np.array([
    [[0.8,0.2,0.0],[0.0,0.7,0.3],[0.0,0.0,1.0]],   # advance
    [[1.0,0.0,0.0],[0.6,0.4,0.0],[0.0,0.6,0.4]],   # retreat
])
R = np.array([0.0, 0.0, 1.0])
V = np.array([5.0, 8.0, 10.0]); gamma = 0.9
Q = T @ (R + gamma * V)                 # Q[action, state]

fig, ax = plt.subplots(figsize=(7, 3))
im = ax.imshow(Q, cmap="viridis", aspect="auto")
ax.set_yticks([0,1]); ax.set_yticklabels(["advance","retreat"])
ax.set_xticks([0,1,2]); ax.set_xticklabels(["aisle start","mid-aisle","shelf"])
for a in range(2):
    for s in range(3):
        ax.text(s, a, round(Q[a, s], 2), ha="center", va="center", color="white")
ax.set_title("warehouse: Q(s,a) = reward + gamma V")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-value-iteration": {
    question: "On a real 3x4 warehouse floor with a goal shelf and a hazard spill, what is each cell worth and where should the robot go?",
    charts: [{
      type: "heatmap", title: "Optimal value V* per floor cell (goal shelf +1, hazard spill -1, wall blocked)",
      rows: ["row 0", "row 1", "row 2"], cols: ["col 0", "col 1", "col 2", "col 3"],
      matrix: [
        [0.509, 0.65, 0.795, 1.0],
        [0.399, -0.04, 0.486, -1.0],
        [0.296, 0.254, 0.345, 0.13]
      ], showVals: true
    }, {
      type: "bars", title: "Greedy move per cell (toward the goal shelf, around the spill)",
      labels: ["(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,2)", "(2,0)", "(2,1)", "(2,2)", "(2,3)"],
      values: [4, 4, 4, 1, 1, 1, 4, 1, 3],
      valueLabels: ["right", "right", "right", "up", "up", "up", "right", "up", "left"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#4ea1ff", "#ffb454"]
    }],
    caption: "Value iteration converges in 27 sweeps on the stochastic floor (0.8 intended, 0.1 each slip); values rise toward the +1 shelf at (0,3), and the policy steers every cell up-and-right while avoiding the -1 spill at (1,3).",
    code: `import numpy as np
import matplotlib.pyplot as plt

ROWS, COLS = 3, 4
WALL, GOAL, HAZARD = (1,1), (0,3), (1,3)
gamma, step_cost = 0.9, -0.04
acts = {"up":(-1,0),"down":(1,0),"left":(0,-1),"right":(0,1)}
def ok(s): return 0<=s[0]<ROWS and 0<=s[1]<COLS and s != WALL
states = [(r,c) for r in range(ROWS) for c in range(COLS) if (r,c)!=WALL]
def reward(s): return 1.0 if s==GOAL else (-1.0 if s==HAZARD else step_cost)
def trans(s, a):                       # 0.8 intended, 0.1 each perpendicular
    perp = ["left","right"] if a in ("up","down") else ["up","down"]
    res = {}
    for p, mv in [(0.8,a),(0.1,perp[0]),(0.1,perp[1])]:
        d = acts[mv]; ns = (s[0]+d[0], s[1]+d[1])
        if not ok(ns): ns = s
        res[ns] = res.get(ns, 0) + p
    return res

V = {s: 0.0 for s in states}
for sweep in range(1000):
    nV, delta = {}, 0
    for s in states:
        if s in (GOAL, HAZARD): nV[s] = reward(s); continue
        nV[s] = reward(s) + gamma * max(
            sum(p*V[ns] for ns,p in trans(s,a).items()) for a in acts)
        delta = max(delta, abs(nV[s] - V[s]))
    V = nV
    if delta < 1e-8: break

grid = np.full((ROWS, COLS), np.nan)
for s in states: grid[s] = V[s]
fig, ax = plt.subplots(figsize=(8, 4))
im = ax.imshow(grid, cmap="viridis")
for s in states:
    ax.text(s[1], s[0], round(V[s], 2), ha="center", va="center", color="white")
ax.set_title("warehouse floor: optimal value V* per cell")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-q-learning": {
    question: "Can a warehouse robot learn its way to the goal shelf by trial and error, never told the floor layout?",
    charts: [{
      type: "heatmap", title: "Best learned Q-value per floor cell (after 3000 episodes)",
      rows: ["row 0", "row 1", "row 2"], cols: ["col 0", "col 1", "col 2", "col 3"],
      matrix: [
        [0.824, 0.91, 1.0, 1.0],
        [0.743, 0.0, 0.91, -1.0],
        [0.666, 0.743, 0.824, 0.743]
      ], showVals: true
    }, {
      type: "bars", title: "Recovered greedy move per cell",
      labels: ["(0,0)", "(0,1)", "(0,2)", "(1,0)", "(1,2)", "(2,0)", "(2,1)", "(2,2)", "(2,3)"],
      values: [4, 4, 4, 1, 1, 1, 4, 1, 3],
      valueLabels: ["right", "right", "right", "up", "up", "up", "right", "up", "left"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#4ea1ff", "#ffb454"]
    }],
    caption: "Starting from the charging dock at (2,0) and exploring epsilon-greedily, Q-learning recovers the same up-and-right policy as value iteration; learned Q-values climb from 0.67 toward 1.0 near the goal shelf.",
    code: `import numpy as np
import matplotlib.pyplot as plt

ROWS, COLS = 3, 4
WALL, GOAL, HAZARD = (1,1), (0,3), (1,3)
gamma = 0.95
acts = [(-1,0),(1,0),(0,-1),(0,1)]      # up, down, left, right
def ok(s): return 0<=s[0]<ROWS and 0<=s[1]<COLS and s != WALL
states = [(r,c) for r in range(ROWS) for c in range(COLS) if (r,c)!=WALL]
def step(s, ai):
    d = acts[ai]; ns = (s[0]+d[0], s[1]+d[1])
    if not ok(ns): ns = s
    if ns == GOAL: return ns, 1.0, True
    if ns == HAZARD: return ns, -1.0, True
    return ns, -0.04, False

rng = np.random.default_rng(1)
Q = {(s, a): 0.0 for s in states for a in range(4)}
alpha, eps = 0.5, 0.2
for ep in range(3000):
    s = (2, 0)                          # charging dock
    for t in range(50):
        greedy = int(np.argmax([Q[(s,i)] for i in range(4)]))
        a = rng.integers(4) if rng.random() < eps else greedy
        ns, r, done = step(s, a)
        nxt = 0 if done else max(Q[(ns,i)] for i in range(4))
        Q[(s,a)] += alpha * (r + gamma*nxt - Q[(s,a)])
        s = ns
        if done: break

grid = np.full((ROWS, COLS), np.nan)
for s in states: grid[s] = max(Q[(s,i)] for i in range(4))
grid[GOAL] = 1.0; grid[HAZARD] = -1.0
fig, ax = plt.subplots(figsize=(8, 4))
im = ax.imshow(grid, cmap="viridis")
for r in range(ROWS):
    for c in range(COLS):
        if (r,c) != WALL:
            ax.text(c, r, round(grid[r,c], 2), ha="center", va="center", color="white")
ax.set_title("warehouse floor: best learned Q per cell")
fig.colorbar(im, ax=ax); plt.show()`
  },

  "ai-minimax": {
    question: "In a tic-tac-toe position where O threatens to win, which square should X play?",
    charts: [{
      type: "bars", title: "Minimax value of each X move (O threatens the top row)",
      labels: ["sq 2 (block)", "sq 3", "sq 5", "sq 6", "sq 7", "sq 8"],
      values: [0, -1, -1, -1, -1, -1],
      valueLabels: ["0 draw", "-1 loss", "-1 loss", "-1 loss", "-1 loss", "-1 loss"],
      colors: ["#7ee787", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"]
    }],
    caption: "Position: O at squares 0,1 (top row) with X in the center. Only square 2 blocks the win and backs up to a draw (0); every other X move loses (-1) to optimal O play.",
    code: `import matplotlib.pyplot as plt

def winner(b):
    lines = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
    for a, c, d in lines:
        if b[a] != " " and b[a] == b[c] == b[d]: return b[a]
    return None
def minimax(b, player):
    w = winner(b)
    if w == "X": return 1
    if w == "O": return -1
    if " " not in b: return 0
    vals = [minimax(b[:i]+[player]+b[i+1:], "O" if player=="X" else "X")
            for i in range(9) if b[i] == " "]
    return max(vals) if player == "X" else min(vals)

board = ["O","O"," "," ","X"," "," "," "," "]   # O threatens top row, X to move
moves = [i for i in range(9) if board[i] == " "]
vals = [minimax(board[:i]+["X"]+board[i+1:], "O") for i in moves]
best = moves[int(max(range(len(vals)), key=lambda k: vals[k]))]

fig, ax = plt.subplots(figsize=(8, 4))
cols = ["#7ee787" if i == best else "#ff7b72" for i in moves]
ax.bar([str(i) for i in moves], vals, color=cols)
for k, v in enumerate(vals): ax.text(k, v, str(v), ha="center", va="bottom")
ax.set_title("minimax value of each X move"); ax.set_xlabel("square")
plt.show()`
  },

  "ai-alpha-beta": {
    question: "On that same tic-tac-toe position, how many game positions does alpha-beta skip versus full minimax?",
    charts: [{
      type: "bars", title: "Game positions examined: alpha-beta vs full minimax", labels: ["alpha-beta", "full minimax"],
      values: [75, 935], valueLabels: ["75 visited", "935 total"], colors: ["#7ee787", "#ffb454"]
    }],
    caption: "Searching the same 'X must block' position, alpha-beta reaches the identical move (block at square 2) while examining only 75 of the 935 reachable positions — pruning cuts the work roughly 12x.",
    code: `import matplotlib.pyplot as plt

def winner(b):
    lines = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
    for a, c, d in lines:
        if b[a] != " " and b[a] == b[c] == b[d]: return b[a]
    return None
board = ["O","O"," "," ","X"," "," "," "," "]
counts = {"full": 0, "ab": 0}

def full(b, player):
    counts["full"] += 1
    if winner(b) or " " not in b: return
    for i in range(9):
        if b[i] == " ": full(b[:i]+[player]+b[i+1:], "O" if player=="X" else "X")
def ab(b, player, alpha, beta):
    counts["ab"] += 1
    w = winner(b)
    if w == "X": return 1
    if w == "O": return -1
    if " " not in b: return 0
    if player == "X":
        v = -2
        for i in range(9):
            if b[i] == " ":
                v = max(v, ab(b[:i]+["X"]+b[i+1:], "O", alpha, beta)); alpha = max(alpha, v)
                if alpha >= beta: break
        return v
    v = 2
    for i in range(9):
        if b[i] == " ":
            v = min(v, ab(b[:i]+["O"]+b[i+1:], "X", alpha, beta)); beta = min(beta, v)
            if alpha >= beta: break
    return v

full(board, "X"); ab(board, "X", -2, 2)
fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(["alpha-beta","full minimax"], [counts["ab"], counts["full"]],
       color=["#7ee787","#ffb454"])
ax.text(0, counts["ab"], str(counts["ab"]), ha="center", va="bottom")
ax.text(1, counts["full"], str(counts["full"]), ha="center", va="bottom")
ax.set_title("positions examined: alpha-beta vs minimax")
plt.show()`
  },

  "ai-expectimax": {
    question: "For Pac-Man choosing a move, does it matter whether the ghost chases optimally or wanders randomly?",
    charts: [{
      type: "bars", title: "Score of each Pac-Man move under each ghost model",
      labels: ["left (worst-case)", "stay (worst-case)", "right (worst-case)", "left (random)", "stay (random)", "right (random)"],
      values: [3, 2, -1, 7.67, 4.0, 7.33],
      colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#7ee787", "#7ee787", "#7ee787"]
    }],
    caption: "Each move leads to a chance node over 3 ghost responses. Against a worst-case ghost Pac-Man takes 'left' (worth 3); against a random ghost 'left' is worth 7.67 — the assumed ghost changes every move's value.",
    code: `import matplotlib.pyplot as plt

# each Pac-Man move -> ghost's 3 random responses -> pellet scores
tree = {"left": [3, 12, 8], "stay": [4, 6, 2], "right": [-1, 9, 14]}
minimax = {k: min(v) for k, v in tree.items()}             # adversarial ghost
expecti = {k: sum(v)/len(v) for k, v in tree.items()}      # random ghost

moves = ["left","stay","right"]
labels = [m+" (worst)" for m in moves] + [m+" (random)" for m in moves]
vals = [minimax[m] for m in moves] + [round(expecti[m], 2) for m in moves]
cols = ["#ff7b72"]*3 + ["#7ee787"]*3
fig, ax = plt.subplots(figsize=(11, 4))
ax.bar(labels, vals, color=cols)
for i, v in enumerate(vals): ax.text(i, v, str(v), ha="center", va="bottom")
ax.set_title("Pac-Man move score by ghost model (worst-case vs random)")
plt.tight_layout(); plt.show()`
  },

  "ai-csp": {
    question: "Coloring the map of Australia, do these two colorings satisfy every 'neighboring states differ' rule?",
    charts: [{
      type: "bars", title: "Constraint violations per coloring (9 shared borders)", labels: ["good coloring", "bad coloring"],
      values: [0, 1], valueLabels: ["0 (valid)", "1 (SA=NSW clash)"], colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "The good coloring of WA, NT, SA, Q, NSW, V, T violates 0 of 9 shared borders; recoloring New South Wales blue makes it clash with South Australia, breaking 1 constraint.",
    code: `import matplotlib.pyplot as plt

borders = [("WA","NT"),("WA","SA"),("NT","SA"),("NT","Q"),
           ("SA","Q"),("SA","NSW"),("SA","V"),("Q","NSW"),("NSW","V")]
def violations(c): return sum(1 for a, b in borders if c[a] == c[b])

good = {"WA":"red","NT":"green","SA":"blue","Q":"red","NSW":"green","V":"red","T":"red"}
bad = dict(good); bad["NSW"] = "blue"      # now clashes with SA
vals = [violations(good), violations(bad)]

fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(["good","bad"], vals, color=["#7ee787","#ff7b72"])
for i, v in enumerate(vals): ax.text(i, v, str(v), ha="center", va="bottom")
ax.set_title("Australia map coloring: violations (9 borders)")
plt.show()`
  },

  "ai-csp-search": {
    question: "What valid 3-coloring does backtracking find for the seven states of Australia?",
    charts: [{
      type: "bars", title: "Color backtracking assigns to each Australian state (1=red, 2=green, 3=blue)",
      labels: ["WA", "NT", "SA", "Q", "NSW", "V", "T"], values: [1, 2, 3, 1, 2, 1, 1],
      valueLabels: ["red", "green", "blue", "red", "green", "red", "red"],
      colors: ["#ff7b72", "#7ee787", "#4ea1ff", "#ff7b72", "#7ee787", "#ff7b72", "#ff7b72"]
    }],
    caption: "Backtracking colors one state at a time and finds a valid map: WA red, NT green, SA blue, then Queensland, NSW, Victoria and Tasmania fit with no neighboring clash.",
    code: `import matplotlib.pyplot as plt

states = ["WA","NT","SA","Q","NSW","V","T"]
colors = ["red","green","blue"]
borders = [("WA","NT"),("WA","SA"),("NT","SA"),("NT","Q"),
           ("SA","Q"),("SA","NSW"),("SA","V"),("Q","NSW"),("NSW","V")]
def consistent(var, col, assign):
    for a, b in borders:
        if a == var and assign.get(b) == col: return False
        if b == var and assign.get(a) == col: return False
    return True
def backtrack(assign):
    if len(assign) == len(states): return assign
    var = next(v for v in states if v not in assign)
    for col in colors:
        if consistent(var, col, assign):
            assign[var] = col
            if backtrack(assign): return assign
            del assign[var]
    return None
sol = backtrack({})

code_of = {"red":1, "green":2, "blue":3}
palette = {"red":"#ff7b72","green":"#7ee787","blue":"#4ea1ff"}
vals = [code_of[sol[s]] for s in states]
cols = [palette[sol[s]] for s in states]
fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(states, vals, color=cols)
for i, s in enumerate(states): ax.text(i, vals[i], sol[s], ha="center", va="bottom")
ax.set_title("Australia 3-coloring found by backtracking")
plt.show()`
  },

  "ai-bayes-net": {
    question: "In the classic sprinkler/rain/wet-grass network, how likely is it that the sprinkler ran but it did not rain, given the grass is wet?",
    charts: [{
      type: "bars", title: "Sprinkler-Rain-WetGrass network: a marginal probability vs the rest",
      labels: ["P(Sprinkler=T, Rain=F, WetGrass=T)", "everything else"], values: [0.189, 0.811],
      valueLabels: ["0.189", "0.811"], colors: ["#ffb454", "#4ea1ff"]
    }],
    caption: "Summing the CPTs over the hidden Cloudy node gives P(Sprinkler on, no rain, grass wet) = 0.189; the full joint over the wet-grass cases adds to P(WetGrass=T) = 0.647.",
    code: `import matplotlib.pyplot as plt

pC = {True: 0.5, False: 0.5}
pR = {True: 0.8, False: 0.2}            # P(Rain | Cloudy)
pS = {True: 0.1, False: 0.5}           # P(Sprinkler | Cloudy)
pW = {(True,True):0.99,(True,False):0.90,(False,True):0.90,(False,False):0.0}
def joint(c, s, r, w):
    ps = pS[c] if s else 1 - pS[c]
    pr = pR[c] if r else 1 - pR[c]
    pw = pW[(s, r)] if w else 1 - pW[(s, r)]
    return pC[c] * ps * pr * pw

p = sum(joint(c, True, False, True) for c in (True, False))   # S=T, R=F, W=T
vals = [round(p, 4), round(1 - p, 4)]

fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(["P(S=T, R=F, W=T)","everything else"], vals, color=["#ffb454","#4ea1ff"])
for i, v in enumerate(vals): ax.text(i, v, v, ha="center", va="bottom")
ax.set_title("sprinkler network: a queried marginal probability")
plt.show()`
  },

  "ai-bayes-inference": {
    question: "The grass is wet this morning — how likely is it that it rained?",
    charts: [{
      type: "bars", title: "Posterior P(Rain | WetGrass = True)", labels: ["Rain = True", "Rain = False"],
      values: [0.7079, 0.2921], colors: ["#4ea1ff", "#ff7b72"]
    }],
    caption: "Summing out Cloudy and Sprinkler and normalizing gives P(Rain | WetGrass) = 0.71 — wet grass is strong evidence of overnight rain, though the sprinkler could explain the other 29%.",
    code: `import matplotlib.pyplot as plt

pC = {True: 0.5, False: 0.5}
pR = {True: 0.8, False: 0.2}
pS = {True: 0.1, False: 0.5}
pW = {(True,True):0.99,(True,False):0.90,(False,True):0.90,(False,False):0.0}
def joint(c, s, r, w):
    ps = pS[c] if s else 1 - pS[c]
    pr = pR[c] if r else 1 - pR[c]
    pw = pW[(s, r)] if w else 1 - pW[(s, r)]
    return pC[c] * ps * pr * pw

unnorm = {r: sum(joint(c, s, r, True) for c in (True, False) for s in (True, False))
          for r in (True, False)}
z = unnorm[True] + unnorm[False]
post = [unnorm[True] / z, unnorm[False] / z]

fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(["Rain=True","Rain=False"], post, color=["#4ea1ff","#ff7b72"])
for i, v in enumerate(post): ax.text(i, v, round(v, 4), ha="center", va="bottom")
ax.set_title("posterior P(Rain | WetGrass=True)")
plt.show()`
  },

  "ai-hmm": {
    question: "A guard never sees outside but watches whether the director brings an umbrella — how does the belief 'it is raining' shift over five days?",
    charts: [{
      type: "line", title: "Filtered belief P(rain) over 5 days (umbrella seen on days 1,2,4,5; not 3)", xlabel: "day", ylabel: "P(rain)",
      series: [{ name: "P(rain)", color: "#4ea1ff", points: [[1, 0.8182], [2, 0.8834], [3, 0.1907], [4, 0.7308], [5, 0.8673]] }]
    }],
    caption: "The umbrella-world HMM: an umbrella on days 1 and 2 pushes P(rain) to 0.82 then 0.88; no umbrella on day 3 collapses it to 0.19; umbrellas again on days 4 and 5 recover it to 0.87.",
    code: `import numpy as np
import matplotlib.pyplot as plt

T = np.array([[0.7, 0.3], [0.3, 0.7]])   # rain/sun -> rain/sun
E_umb = np.array([0.9, 0.2])             # P(umbrella | rain), P(umbrella | sun)
belief = np.array([0.5, 0.5])
observations = [True, True, False, True, True]
p_rain = []
for saw in observations:
    belief = belief @ T                  # predict
    e = E_umb if saw else (1 - E_umb)
    belief = belief * e                  # update by observation
    belief = belief / belief.sum()       # renormalize
    p_rain.append(belief[0])

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(range(1, 6), p_rain, "-o", color="#4ea1ff")
ax.set_xticks(range(1, 6)); ax.set_xlabel("day")
ax.set_ylabel("P(rain)"); ax.set_ylim(0, 1)
ax.set_title("umbrella world: filtered belief P(rain) over 5 days")
plt.show()`
  },

  "ai-propositional-logic": {
    question: "Given the rules 'if it is raining the streets are wet' and 'if the streets are wet driving is slow', plus 'it is raining', does the knowledge base entail 'driving is slow'?",
    charts: [{
      type: "bars", title: "Truth-table check: facts true in every model that satisfies the KB",
      labels: ["Raining", "StreetsWet", "DrivingSlow"], values: [1, 1, 1],
      valueLabels: ["true", "true", "true (entailed)"],
      colors: ["#7ee787", "#7ee787", "#ffb454"]
    }],
    caption: "Of the 8 truth assignments, exactly 1 satisfies the KB (Raining implies StreetsWet, StreetsWet implies DrivingSlow, and Raining); DrivingSlow is true in it, so the KB entails DrivingSlow.",
    code: `import itertools
import matplotlib.pyplot as plt

symbols = ["Raining", "StreetsWet", "DrivingSlow"]
def kb(m):
    r1 = (not m["Raining"]) or m["StreetsWet"]
    r2 = (not m["StreetsWet"]) or m["DrivingSlow"]
    return r1 and r2 and m["Raining"]

sat = [dict(zip(symbols, v))
       for v in itertools.product([False, True], repeat=3)
       if kb(dict(zip(symbols, v)))]
truth = [int(all(m[s] for m in sat)) for s in symbols]

fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(symbols, truth, color=["#7ee787","#7ee787","#ffb454"])
for i, s in enumerate(symbols):
    ax.text(i, truth[i], "true" if truth[i] else "false", ha="center", va="bottom")
ax.set_ylim(0, 1.3)
ax.set_title("facts true in every KB-satisfying model")
plt.show()`
  },

  "ai-inference-rules": {
    question: "Starting from family facts about Tom, Bob, Ann and Pat, which new relationships does forward chaining derive?",
    charts: [{
      type: "bars", title: "Family facts known before vs after forward chaining",
      labels: ["parent facts", "grandparent(Tom,Ann)", "grandparent(Tom,Pat)", "grandfather(Tom,Ann)", "grandfather(Tom,Pat)"],
      values: [1, 1, 1, 1, 1],
      valueLabels: ["given", "derived", "derived", "derived", "derived"],
      colors: ["#4ea1ff", "#7ee787", "#7ee787", "#ffb454", "#ffb454"]
    }],
    caption: "From parent(Tom,Bob), parent(Bob,Ann), parent(Bob,Pat) and male(Tom), forward chaining fires the grandparent and grandfather rules to derive 4 new facts: Tom is grandfather of both Ann and Pat.",
    code: `import matplotlib.pyplot as plt

facts = {("parent","Tom","Bob"), ("parent","Bob","Ann"),
         ("parent","Bob","Pat"), ("male","Tom"), ("male","Bob")}
order = []
changed = True
while changed:
    changed = False
    for f1 in list(facts):                 # grandparent(X,Z) :- parent(X,Y), parent(Y,Z)
        if f1[0] == "parent":
            for f2 in list(facts):
                if f2[0] == "parent" and f1[2] == f2[1]:
                    gp = ("grandparent", f1[1], f2[2])
                    if gp not in facts: facts.add(gp); order.append(gp); changed = True
    for f in list(facts):                  # grandfather(X,Z) :- grandparent(X,Z), male(X)
        if f[0] == "grandparent" and ("male", f[1]) in facts:
            gf = ("grandfather", f[1], f[2])
            if gf not in facts: facts.add(gf); order.append(gf); changed = True
print("derived", order)

labels = ["parent facts", "gp(Tom,Ann)", "gp(Tom,Pat)", "gf(Tom,Ann)", "gf(Tom,Pat)"]
cols = ["#4ea1ff", "#7ee787", "#7ee787", "#ffb454", "#ffb454"]
fig, ax = plt.subplots(figsize=(9, 4))
ax.bar(labels, [1]*5, color=cols)
tags = ["given","derived","derived","derived","derived"]
for i, t in enumerate(tags): ax.text(i, 1, t, ha="center", va="bottom")
ax.set_ylim(0, 1.4)
ax.set_title("family facts before vs after forward chaining")
plt.show()`
  }

});
