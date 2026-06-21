/* Per-lesson visualizations of the code's data & results. Merged into window.CODEVIZ by id.
   { question?, charts:[ chartSpec ], caption? }  — chartSpec types: bars/line/scatter/roc/confusion/heatmap.
   Each entry runs the REAL algorithm on a concrete NAMED real-world scenario; numbers below are its actual output. */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "aix-relaxation": {
    question: "Hospital delivery robot: how good is the relaxed (walls-removed) A* heuristic for the route to the Pharmacy?",
    charts: [{
      type: "heatmap", title: "Relaxed heuristic h = steps to Pharmacy (5,5), walls ignored",
      rows: ["Entrance row 0", "Ward row 1", "Ward row 2", "Lab row 3", "Lab row 4", "Pharmacy row 5"],
      cols: ["col 0", "col 1", "col 2", "col 3", "col 4", "col 5"],
      matrix: [[10, 9, 8, 7, 6, 5], [9, 8, 7, 6, 5, 4], [8, 7, 6, 5, 4, 3], [7, 6, 5, 4, 3, 2], [6, 5, 4, 3, 2, 1], [5, 4, 3, 2, 1, 0]],
      showVals: true
    }],
    caption: "On the hospital floor the relaxed heuristic says the robot is h = 10 steps from the Pharmacy at the Entrance (0,0). The true walled route through the serpentine corridors is 20 steps, so h never overestimates (admissible) yet still guides A* straight at the goal.",
    code: `import numpy as np, heapq
import matplotlib.pyplot as plt

# Hospital 1st-floor wing as a 6x6 grid. Goal = Pharmacy at (5,5).
# Walls form a serpentine corridor between wards, labs and the pharmacy.
GRID, goal = 6, (5, 5)
walls = {(0,1),(1,1),(2,1),(3,1),(4,1),
         (1,3),(2,3),(3,3),(4,3),(5,3),
         (0,5),(1,5),(2,5),(3,5)}

# Relaxed heuristic: Manhattan steps to the Pharmacy with walls removed.
H = np.zeros((GRID, GRID), int)
for r in range(GRID):
    for c in range(GRID):
        H[r, c] = abs(r - goal[0]) + abs(c - goal[1])

# Real A* on the walled grid confirms h(start)=10 vs true cost=20 (admissible).
def astar(start):
    pq, seen = [(H[start], 0, start)], {}
    while pq:
        f, g, s = heapq.heappop(pq)
        if s in seen and g >= seen[s]: continue
        seen[s] = g
        if s == goal: return g
        r, c = s
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            inb = nr in range(GRID) and nc in range(GRID)
            if inb and (nr, nc) not in walls:
                heapq.heappush(pq, (g+1+H[nr,nc], g+1, (nr,nc)))
print("h(start)=", H[0,0], " true walled cost=", astar((0,0)))

fig, ax = plt.subplots()
im = ax.imshow(H, cmap="viridis")
for r in range(GRID):
    for c in range(GRID):
        ax.text(c, r, H[r, c], ha="center", va="center", color="w")
ax.set_title("Relaxed heuristic h = steps to Pharmacy (5,5), walls ignored")
fig.colorbar(im, ax=ax)
plt.show()`
  },

  "aix-structured-perceptron": {
    question: "POS-tagging 'dogs chase cats': does one perceptron update make the correct NOUN VERB NOUN tagging win?",
    charts: [{
      type: "bars", title: "Score of tagging 'dogs chase cats' before vs after one update",
      labels: ["correct: NOUN VERB NOUN", "wrong: NOUN NOUN NOUN"],
      values: [3, -5],
      valueLabels: ["+3", "-5"],
      colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "With zero weights both taggings score 0 and tie. After one structured-perceptron update (reward the gold emission and transition features, penalize the predicted wrong ones), the correct tagging scores +3 and the wrong all-NOUN tagging scores -5 — a winning margin of 8.",
    code: `import matplotlib.pyplot as plt

# POS tagging the real sentence "dogs chase cats". Gold = NOUN VERB NOUN.
sent = ["dogs", "chase", "cats"]
gold  = ["NOUN", "VERB", "NOUN"]
wrong = ["NOUN", "NOUN", "NOUN"]

def feats(words, tags):
    f = {}
    for w, t in zip(words, tags):                 # emission features
        f[("emit", w, t)] = f.get(("emit", w, t), 0) + 1
    for i in range(1, len(tags)):                 # transition features
        k = ("trans", tags[i-1], tags[i])
        f[k] = f.get(k, 0) + 1
    return f

def score(w, f):
    return sum(w.get(k, 0.0) * v for k, v in f.items())

fg, fw = feats(sent, gold), feats(sent, wrong)
w = {}
before = [score(w, fg), score(w, fw)]             # both 0
for k, v in fg.items(): w[k] = w.get(k, 0.0) + v  # +gold features
for k, v in fw.items(): w[k] = w.get(k, 0.0) - v  # -predicted features
after = [score(w, fg), score(w, fw)]              # +3 vs -5

labels = ["correct: NOUN VERB NOUN", "wrong: NOUN NOUN NOUN"]
colors = ["#7ee787", "#ff7b72"]
fig, ax = plt.subplots()
bars = ax.bar(labels, after, color=colors)
for b, v in zip(bars, after):
    ax.text(b.get_x()+b.get_width()/2, v, str(int(v)),
            ha="center", va="bottom" if v >= 0 else "top")
ax.axhline(0, color="gray", lw=0.8)
ax.set_title("Score of tagging 'dogs chase cats' before vs after one update")
plt.show()`
  },

  "aix-monte-carlo": {
    question: "Blackjack: by averaging real hand outcomes, what is the value of standing on 20 against a dealer showing 6?",
    charts: [{
      type: "line", title: "Monte Carlo value of 'stand on 20 vs dealer 6' as hands accumulate",
      xlabel: "blackjack hands simulated", ylabel: "average return (+1 win, -1 loss)",
      series: [
        { name: "running estimate", color: "#4ea1ff", points: [[1, 1.0], [5, 1.0], [10, 1.0], [25, 0.84], [50, 0.78], [100, 0.74], [250, 0.712], [500, 0.698], [1000, 0.7], [2500, 0.71], [5000, 0.699]] },
        { name: "converged value ~ 0.70", color: "#7ee787", points: [[1, 0.699], [5000, 0.699]] }
      ]
    }],
    caption: "Standing on 20 is a strong hand: early luck reads +1.0, but averaging 5000 real dealer-rollout hands settles the state value near +0.70 — the player wins about 85% and loses about 15% of the time, exactly as Monte Carlo averaging of returns predicts.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(7)

# Blackjack: estimate value of STANDING on player sum 20 vs dealer showing 6.
def draw():
    c = rng.integers(1, 14)
    return min(c, 10) if c != 1 else 1

def dealer_play(showing):
    total, ace = showing, (showing == 1)
    if ace: total += 10
    while total in range(17):                # hit on totals 0..16, stand on 17+
        c = draw()
        if c == 1 and total + 11 in range(22):
            total, ace = total + 11, True
        else:
            total += c
        while total > 21 and ace:
            total, ace = total - 10, False
    return total

def episode():
    dealer = dealer_play(6)                 # dealer reveals a 6, then hits to 17+
    if dealer > 21 or dealer in range(20): return 1.0   # bust or below 20 -> player wins
    if dealer > 20: return -1.0
    return 0.0                              # push at 20

N = 5000
rets = np.array([episode() for _ in range(N)])
running = np.cumsum(rets) / np.arange(1, N + 1)
xs = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
ys = [running[x - 1] for x in xs]

fig, ax = plt.subplots()
ax.plot(xs, ys, "-o", color="#4ea1ff", label="running estimate")
ax.axhline(running[-1], color="#7ee787", label="converged value ~ 0.70")
ax.set_xscale("log")
ax.set_xlabel("blackjack hands simulated"); ax.set_ylabel("average return (+1 win, -1 loss)")
ax.set_title("Monte Carlo value of 'stand on 20 vs dealer 6' as hands accumulate")
ax.legend()
plt.show()`
  },

  "aix-sarsa-td": {
    question: "Warehouse delivery robot: how does value flow back from the loading dock to the starting shelf over TD(0) sweeps?",
    charts: [{
      type: "line", title: "V(start shelf) climbing toward the discounted dock reward over TD sweeps",
      xlabel: "TD(0) sweep", ylabel: "value of start shelf",
      series: [
        { name: "V(shelf 0)", color: "#4ea1ff", points: [[1, 0.041], [2, 0.123], [3, 0.226], [5, 0.418], [10, 0.626], [20, 0.656]] },
        { name: "true value gamma^4 = 0.656", color: "#7ee787", points: [[1, 0.656], [20, 0.656]] }
      ]
    }],
    caption: "The robot's corridor has 5 shelves; the loading dock (shelf 4) pays +1. Each TD(0) sweep seeps that reward one shelf further back, so the start shelf's value rises 0.04 -> 0.656, matching the true discounted distance gamma^4 = 0.656 exactly.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Warehouse robot on a 5-shelf corridor; shelf 4 is the loading dock (reward +1).
N, alpha, gamma = 5, 0.5, 0.9
V = np.zeros(N); V[N - 1] = 1.0            # dock value pinned at +1
track = []
for sweep in range(1, 21):
    for s in range(N - 2, -1, -1):         # right-to-left so value flows back toward the start
        V[s] += alpha * (gamma * V[s + 1] - V[s])
    track.append(V[0])

xs = [1, 2, 3, 5, 10, 20]
ys = [track[x - 1] for x in xs]
true_v0 = gamma ** (N - 1)                 # 0.656

fig, ax = plt.subplots()
ax.plot(xs, ys, "-o", color="#4ea1ff", label="V(shelf 0)")
ax.axhline(true_v0, color="#7ee787", label="true value gamma^4 = 0.656")
ax.set_xlabel("TD(0) sweep"); ax.set_ylabel("value of start shelf")
ax.set_title("V(start shelf) climbing toward the discounted dock reward over TD sweeps")
ax.legend()
plt.show()`
  },

  "aix-game-theory": {
    question: "Soccer penalty kicks: what mix of Left/Right should a right-footed kicker use, and what is the scoring rate at equilibrium?",
    charts: [{
      type: "heatmap", title: "Kicker scoring chance (%) by kicker direction vs goalie dive",
      rows: ["Kicker aims Left", "Kicker aims Right"],
      cols: ["Goalie dives Left", "Goalie dives Right"],
      matrix: [[58, 95], [93, 70]],
      showVals: true
    }],
    caption: "This is a real penalty-kick game: the goalie wants the lowest scoring %, the kicker the highest. No pure choice is safe, so the mixed-strategy Nash equilibrium has the right-footed kicker aiming Left only 38% of the time, yielding a 79.6% scoring rate whatever the goalie guesses.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Penalty-kick zero-sum game. Entry = kicker scoring chance (%).
# Rows = kicker direction, cols = goalie dive. Right-footed kicker is stronger
# shooting to their Left, so the matrix is asymmetric.
K = np.array([[58.0, 95.0],     # kicker Left:  goalie Left=58, goalie Right=95
              [93.0, 70.0]])     # kicker Right: goalie Left=93, goalie Right=70

# Solve the 2x2 mixed-strategy Nash: kicker prob of aiming Left.
a, b, c, d = K[0,0], K[0,1], K[1,0], K[1,1]
q = (d - c) / (a - b - c + d)              # 0.383
value = a*q + c*(1 - q)                    # 79.6% scoring chance
print("aim Left prob=", round(q,3), " game value=", round(value,1), "%")

fig, ax = plt.subplots()
im = ax.imshow(K, cmap="magma")
for r in range(2):
    for c2 in range(2):
        ax.text(c2, r, int(K[r, c2]), ha="center", va="center", color="w")
ax.set_xticks([0, 1]); ax.set_xticklabels(["Goalie dives Left", "Goalie dives Right"])
ax.set_yticks([0, 1]); ax.set_yticklabels(["Kicker aims Left", "Kicker aims Right"])
ax.set_title("Kicker scoring chance (%) by kicker direction vs goalie dive")
fig.colorbar(im, ax=ax)
plt.show()`
  },

  "aix-variable-elimination": {
    question: "Sprinkler-Rain-WetGrass network: the grass is wet — what is the posterior probability that it rained?",
    charts: [{
      type: "bars", title: "P(Rain | WetGrass = True) by variable elimination",
      labels: ["Rain = False", "Rain = True"],
      values: [0.292, 0.708],
      valueLabels: ["0.292", "0.708"],
      colors: ["#ff7b72", "#4ea1ff"]
    }],
    caption: "On the classic Cloudy/Sprinkler/Rain/WetGrass Bayes net, eliminating Cloudy and Sprinkler from the wet-grass evidence gives P(Rain = True | WetGrass) = 0.708 vs 0.292 — wet grass is good but not conclusive evidence of rain, since the sprinkler is the competing explanation.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Sprinkler-Rain-WetGrass Bayes net (Russell & Norvig). 0=False, 1=True.
P_C = np.array([0.5, 0.5])
P_S_C = np.array([[0.5, 0.5], [0.9, 0.1]])   # P(Sprinkler | Cloudy)
P_R_C = np.array([[0.8, 0.2], [0.2, 0.8]])   # P(Rain | Cloudy)
P_W = np.zeros((2, 2, 2))                     # P(WetGrass | Sprinkler, Rain)
P_W[0,0] = [1.0, 0.0];  P_W[0,1] = [0.1, 0.9]
P_W[1,0] = [0.1, 0.9];  P_W[1,1] = [0.01, 0.99]

# Eliminate Cloudy and Sprinkler; keep Rain, condition on WetGrass=True.
joint_R = np.zeros(2)
for c in range(2):
    for s in range(2):
        for r in range(2):
            joint_R[r] += P_C[c]*P_S_C[c,s]*P_R_C[c,r]*P_W[s,r,1]
post = joint_R / joint_R.sum()               # [0.292, 0.708]

labels = ["Rain = False", "Rain = True"]
fig, ax = plt.subplots()
bars = ax.bar(labels, post, color=["#ff7b72", "#4ea1ff"])
for b, v in zip(bars, post):
    ax.text(b.get_x()+b.get_width()/2, v, str(round(v,3)), ha="center", va="bottom")
ax.set_title("P(Rain | WetGrass = True) by variable elimination")
plt.show()`
  },

  "aix-gibbs-particle": {
    question: "Sprinkler-Rain network: does Gibbs sampling recover the joint posterior over (Sprinkler, Rain) given wet grass?",
    charts: [{
      type: "bars", title: "Gibbs estimate of P(Sprinkler, Rain | WetGrass) vs exact (40k samples)",
      labels: ["S=off, R=no", "S=off, R=rain", "S=on, R=no", "S=on, R=rain"],
      values: [0.0, 0.575, 0.29, 0.135],
      valueLabels: ["0.000", "0.575", "0.290", "0.135"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }],
    caption: "Gibbs sampling the Sprinkler-Rain net (resampling Cloudy, Sprinkler, Rain one at a time with WetGrass pinned True) drives the visit fractions to [0.000, 0.575, 0.290, 0.135], matching the exact posterior [0.000, 0.570, 0.292, 0.138] within 0.005. The most likely explanation of wet grass is rain alone.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(0)

# Same Sprinkler-Rain-WetGrass net; estimate P(Sprinkler,Rain | WetGrass=True).
P_C = np.array([0.5, 0.5])
P_S_C = np.array([[0.5, 0.5], [0.9, 0.1]])
P_R_C = np.array([[0.8, 0.2], [0.2, 0.8]])
P_W = np.zeros((2, 2, 2))
P_W[0,0] = [1.0, 0.0];  P_W[0,1] = [0.1, 0.9]
P_W[1,0] = [0.1, 0.9];  P_W[1,1] = [0.01, 0.99]
norm = lambda v: v / v.sum()

C = S = R = 0
counts = np.zeros((2, 2))
for t in range(40000):
    C = rng.choice(2, p=norm(np.array([P_C[c]*P_S_C[c,S]*P_R_C[c,R] for c in range(2)])))
    S = rng.choice(2, p=norm(np.array([P_S_C[C,s]*P_W[s,R,1] for s in range(2)])))
    R = rng.choice(2, p=norm(np.array([P_R_C[C,r]*P_W[S,r,1] for r in range(2)])))
    counts[S, R] += 1
emp = (counts / counts.sum()).flatten()

labels = ["S=off, R=no", "S=off, R=rain", "S=on, R=no", "S=on, R=rain"]
fig, ax = plt.subplots()
bars = ax.bar(labels, emp, color="#4ea1ff")
for b, v in zip(bars, emp):
    ax.text(b.get_x()+b.get_width()/2, v, str(round(v,3)), ha="center", va="bottom")
ax.set_title("Gibbs estimate of P(Sprinkler, Rain | WetGrass) (40k samples)")
plt.show()`
  },

  "aix-markov-blanket": {
    question: "Burglar Alarm network: given an earthquake and both neighbors calling, what is the local posterior that the alarm is on?",
    charts: [{
      type: "bars", title: "P(Alarm | its Markov blanket) in the Burglar Alarm net",
      labels: ["Alarm = On", "Alarm = Off"],
      values: [0.998, 0.002],
      valueLabels: ["0.998", "0.002"],
      colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "In the Russell & Norvig Burglar Alarm net, the alarm's Markov blanket is its parents (Burglary, Earthquake) and children (JohnCalls, MaryCalls). With no burglary but an earthquake and both neighbors calling, the local conditional P(Alarm = On) = 0.998 — the rest of the network cancels, which is why Gibbs only needs the blanket.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Burglar Alarm net. Observed: no burglary, an earthquake, John & Mary both called.
# Markov blanket of Alarm = parents {Burglary, Earthquake} + children {John, Mary}.
P_A_BE = np.zeros((2, 2, 2))                  # P(Alarm | Burglary, Earthquake)
P_A_BE[0,0] = [0.999, 0.001]; P_A_BE[0,1] = [0.71, 0.29]
P_A_BE[1,0] = [0.06, 0.94];   P_A_BE[1,1] = [0.05, 0.95]
P_J_A = np.array([[0.95, 0.05], [0.10, 0.90]])  # P(JohnCalls | Alarm)
P_M_A = np.array([[0.99, 0.01], [0.30, 0.70]])  # P(MaryCalls | Alarm)

B, E, J, M = 0, 1, 1, 1                        # no burglary, quake, both call
score = np.array([P_A_BE[B,E,a]*P_J_A[a,J]*P_M_A[a,M] for a in range(2)])
post = score / score.sum()                    # [P(off), P(on)] -> on = 0.998

labels = ["Alarm = On", "Alarm = Off"]
vals = [post[1], post[0]]
fig, ax = plt.subplots()
bars = ax.bar(labels, vals, color=["#7ee787", "#ff7b72"])
for b, v in zip(bars, vals):
    ax.text(b.get_x()+b.get_width()/2, v, str(round(v,3)), ha="center", va="bottom")
ax.set_title("P(Alarm | its Markov blanket) in the Burglar Alarm net")
plt.show()`
  },

  "aix-forward-backward": {
    question: "Umbrella world: a guard sees the boss carry an umbrella on days 1,2,4,5 but not day 3 — what is the smoothed belief that it rained each day?",
    charts: [{
      type: "line", title: "Smoothed P(Rain | all 5 umbrella observations) per day",
      xlabel: "day", ylabel: "P(Rain = True | all evidence)",
      series: [
        { name: "P(Rain)", color: "#4ea1ff", points: [[1, 0.867], [2, 0.82], [3, 0.307], [4, 0.82], [5, 0.867]] }
      ]
    }],
    caption: "In the classic umbrella HMM, the underground guard infers Rain only from whether the boss brought an Umbrella (yes,yes,no,yes,yes). Forward-backward smoothing gives beliefs [0.87, 0.82, 0.31, 0.82, 0.87]; day 3 dips below 0.5 because no umbrella appeared, and the surrounding rainy days pull it back up.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Umbrella-world HMM (Russell & Norvig). States: [no rain, rain].
pi = np.array([0.5, 0.5])
T  = np.array([[0.7, 0.3], [0.3, 0.7]])      # weather persists day to day
E  = np.array([[0.8, 0.2],                   # no rain: umbrella unlikely
               [0.1, 0.9]])                  # rain:    umbrella likely
obs = [1, 1, 0, 1, 1]                         # umbrella on days 1,2,4,5; none on day 3
n = len(obs)

alpha = np.zeros((n, 2)); beta = np.zeros((n, 2))
alpha[0] = pi * E[:, obs[0]]
for i in range(1, n):
    alpha[i] = (alpha[i-1] @ T) * E[:, obs[i]]
beta[n-1] = 1.0
for i in range(n-2, -1, -1):
    beta[i] = T @ (E[:, obs[i+1]] * beta[i+1])

post = alpha * beta
post /= post.sum(axis=1, keepdims=True)       # smoothed P(Rain) per day
days = [1, 2, 3, 4, 5]

fig, ax = plt.subplots()
ax.plot(days, post[:, 1], "-o", color="#4ea1ff", label="P(Rain)")
ax.set_xticks(days)
ax.set_xlabel("day"); ax.set_ylabel("P(Rain = True | all evidence)")
ax.set_title("Smoothed P(Rain | all 5 umbrella observations) per day")
ax.legend()
plt.show()`
  },

  "aix-lda-topic": {
    question: "Six news headlines, two hidden topics: does collapsed-Gibbs LDA separate the Sports words from the Finance words?",
    charts: [{
      type: "heatmap", title: "Recovered topic-word distributions from 6 news headlines",
      rows: ["Topic: Sports", "Topic: Finance"],
      cols: ["game", "team", "win", "market", "stock", "bank"],
      matrix: [[0.405, 0.325, 0.246, 0.008, 0.008, 0.008], [0.008, 0.008, 0.008, 0.325, 0.405, 0.246]],
      showVals: true
    }],
    caption: "Running collapsed-Gibbs LDA (K=2) over six tiny headlines mixing sports words (game, team, win) and finance words (market, stock, bank) cleanly recovers the topics: the Sports topic puts ~0.98 of its mass on game/team/win and the Finance topic on market/stock/bank, with near-zero cross-leakage.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(1)

# Six real-style news headlines over two topics.
vocab = ["game", "team", "win", "market", "stock", "bank"]
raw = [["team","win","game","game"], ["game","team","win","team"],
       ["win","game","game","team"], ["market","stock","bank","stock"],
       ["stock","market","bank","market"], ["bank","stock","market","stock"]]
wi = {w: i for i, w in enumerate(vocab)}
docs = [[wi[w] for w in h] for h in raw]
V, K, a, b = len(vocab), 2, 0.1, 0.1

z = [rng.integers(0, K, len(d)).tolist() for d in docs]
ndk = np.zeros((len(docs), K)); nkw = np.zeros((K, V))
for d, doc in enumerate(docs):
    for i, w in enumerate(doc):
        ndk[d, z[d][i]] += 1; nkw[z[d][i], w] += 1

for _ in range(500):                     # collapsed Gibbs sampling
    for d, doc in enumerate(docs):
        for i, w in enumerate(doc):
            k = z[d][i]; ndk[d, k] -= 1; nkw[k, w] -= 1
            p = (ndk[d] + a) * (nkw[:, w] + b) / (nkw.sum(1) + V * b)
            k = rng.choice(K, p=p / p.sum())
            z[d][i] = k; ndk[d, k] += 1; nkw[k, w] += 1

phi = (nkw + b) / (nkw.sum(1, keepdims=True) + V * b)
if phi[1, wi["game"]] > phi[0, wi["game"]]:    # order row 0 = Sports
    phi = phi[::-1]

fig, ax = plt.subplots()
im = ax.imshow(phi, cmap="viridis")
for r in range(K):
    for c in range(V):
        ax.text(c, r, round(phi[r, c], 3), ha="center", va="center", color="w")
ax.set_xticks(range(V)); ax.set_xticklabels(vocab)
ax.set_yticks(range(K)); ax.set_yticklabels(["Topic: Sports", "Topic: Finance"])
ax.set_title("Recovered topic-word distributions from 6 news headlines")
fig.colorbar(im, ax=ax)
plt.show()`
  },

  "aix-fol": {
    question: "Family knowledge base: applying the grandparent rule by forward chaining, how many facts can we derive?",
    charts: [{
      type: "bars", title: "Facts in the family KB: asserted vs after forward chaining",
      labels: ["asserted Parent facts", "after grandparent rule"],
      values: [4, 6],
      valueLabels: ["4", "6"],
      colors: ["#ffb454", "#7ee787"]
    }],
    caption: "The knowledge base asserts 4 Parent facts (Tom-Bob, Bob-Ann, Tom-Liz, Liz-Pat). Forward chaining the rule Parent(x,y) and Parent(y,z) => Grandparent(x,z) unifies them to derive 2 new facts, Grandparent(Tom,Ann) and Grandparent(Tom,Pat), growing the KB from 4 to 6.",
    code: `import matplotlib.pyplot as plt

# Family relations knowledge base.
parent = [("Tom","Bob"), ("Bob","Ann"), ("Tom","Liz"), ("Liz","Pat")]
facts = set(("Parent",) + p for p in parent)
before = len(facts)

# Forward-chain the rule: Parent(x,y) AND Parent(y,z) => Grandparent(x,z).
grand = set()
for (x, y) in parent:
    for (y2, z) in parent:
        if y == y2:
            grand.add(("Grandparent", x, z))
facts |= grand
after = len(facts)
print("derived:", sorted(g[1] + "-" + g[2] for g in grand))  # Tom-Ann, Tom-Pat

labels = ["asserted Parent facts", "after grandparent rule"]
counts = [before, after]
fig, ax = plt.subplots()
bars = ax.bar(labels, counts, color=["#ffb454", "#7ee787"])
for bar, v in zip(bars, counts):
    ax.text(bar.get_x()+bar.get_width()/2, v, str(v), ha="center", va="bottom")
ax.set_ylabel("facts known")
ax.set_title("Facts in the family KB: asserted vs after forward chaining")
plt.show()`
  }

});
