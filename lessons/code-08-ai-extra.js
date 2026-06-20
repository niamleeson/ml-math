/* =====================================================================
   CODE SECTION — MODULE 8 — ARTIFICIAL INTELLIGENCE — MORE.
   One window.CODE entry per lesson in 08-ai-extra.js.
   Primary library: plain Python + NumPy (from-scratch algorithm code).
   Each runnable snippet is self-contained, deterministic, and print()s.
   ===================================================================== */
window.CODE = Object.assign(window.CODE || {}, {

  /* ---- Relaxed heuristics for A* ---- */
  "aix-relaxation": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Relax the maze by dropping "no walking through walls": the cost of that easier
      problem is the Manhattan distance, an admissible heuristic. Here we BFS the real maze to get
      the true cost and confirm the relaxed heuristic never overestimates it.</p>`,
    code: `import numpy as np
from collections import deque

# 5x5 grid; 1 = wall. Start (0,0), goal (4,4).
grid = np.zeros((5, 5), int)
for r, c in [(1,0),(1,1),(1,2),(1,3),(3,1),(3,2),(3,3),(3,4)]:
    grid[r, c] = 1
start, goal = (0, 0), (4, 4)

def manhattan(a, b):                      # relaxed cost: walls removed
    return abs(a[0]-b[0]) + abs(a[1]-b[1])

def true_cost(grid, s, g):                # BFS shortest path obeying walls
    q, seen = deque([(s, 0)]), {s}
    while q:
        (r, c), d = q.popleft()
        if (r, c) == g:
            return d
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < 5 and 0 <= nc < 5 and grid[nr, nc] == 0 and (nr, nc) not in seen:
                seen.add((nr, nc)); q.append(((nr, nc), d+1))
    return float("inf")

h, cost = manhattan(start, goal), true_cost(grid, start, goal)
print("relaxed heuristic h =", h)
print("true maze cost      =", cost)
print("admissible (h <= cost)?", h <= cost)`
  },

  /* ---- Learning costs (structured perceptron) ---- */
  "aix-structured-perceptron": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Score whole paths by a weight vector dotted with edge-count features. Predict the
      argmax path; on a mistake, add the gold path's features and subtract the predicted path's.
      Watch the weights swing until the true path wins.</p>`,
    code: `import numpy as np

# features = edge-usage counts over 4 edges [e1, e2, e3, e4].
# True path uses e1,e2 ; one impostor path uses e3,e4.
phi_true    = np.array([1, 1, 0, 0])
phi_wrong   = np.array([0, 0, 1, 1])

w = np.zeros(4)
for step in range(3):
    # predict the highest-scoring path; on a tie prefer the impostor (counts as a mistake)
    s_true, s_wrong = w @ phi_true, w @ phi_wrong
    phi_hat = phi_wrong if s_wrong >= s_true else phi_true
    if not np.array_equal(phi_hat, phi_true):     # mistake -> structured perceptron update
        w = w + phi_true - phi_hat
    print(f"step {step}: w={w.tolist()}  true={w@phi_true:.0f}  wrong={w@phi_wrong:.0f}")

print("final weights:", w.tolist())
print("true path wins?", (w @ phi_true) > (w @ phi_wrong))`
  },

  /* ---- Monte Carlo reinforcement learning ---- */
  "aix-monte-carlo": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>No model: play full episodes from a fixed (s,a), record each discounted return, and
      average them. The running mean converges to the true expected return by the law of large
      numbers.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

gamma = 0.9
def sample_return():
    # reach goal in 2..4 random steps: -1 per step, +10 at the goal
    steps = rng.integers(2, 5)
    u, disc = 0.0, 1.0
    for _ in range(steps):
        u += disc * (-1); disc *= gamma
    u += disc * 10
    return u

returns = [sample_return() for _ in range(2000)]
running = np.cumsum(returns) / np.arange(1, len(returns) + 1)
print("first 3 returns:", [round(r, 2) for r in returns[:3]])
print("Q-hat after   10 episodes:", round(running[9], 3))
print("Q-hat after  100 episodes:", round(running[99], 3))
print("Q-hat after 2000 episodes:", round(running[-1], 3))`
  },

  /* ---- SARSA and temporal-difference learning ---- */
  "aix-sarsa-td": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A 1x5 corridor with a +1 goal. Each TD update nudges V(s) toward r + gamma*V(s'),
      so value seeps backward one cell per sweep. After several sweeps V approaches the discounted
      distance-to-goal.</p>`,
    code: `import numpy as np

N, alpha, gamma = 5, 0.5, 0.9
V = np.zeros(N); V[N-1] = 1.0    # goal cell value fixed at +1

# TD(0) value update: V(s) <- V(s) + alpha[ r + gamma V(s') - V(s) ], reward r = 0
for sweep in range(20):
    for s in range(N - 2, -1, -1):       # sweep right-to-left so value flows back
        target = 0 + gamma * V[s + 1]
        V[s] += alpha * (target - V[s])

print("learned V:", [round(v, 3) for v in V])
true = np.array([gamma ** (N - 1 - s) for s in range(N)])  # discounted distance to goal
print("true   V:", [round(v, 3) for v in true])
print("max error:", round(float(np.max(np.abs(V - true))), 4))`
  },

  /* ---- Simultaneous games and Nash equilibrium ---- */
  "aix-game-theory": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Build the prisoner's dilemma payoff matrices, compute each player's best response to
      every opponent move, and flag the cell where both best-respond: the pure-strategy Nash
      equilibrium (Defect, Defect).</p>`,
    code: `import numpy as np

# rows = A's move {0=Cooperate,1=Defect}; cols = B's move. Higher payoff is better.
A = np.array([[-1, -3],   # A's payoff
              [ 0, -2]])
B = np.array([[-1,  0],   # B's payoff
              [-3, -2]])
names = ["Cooperate", "Defect"]

print("Nash equilibria (each player best-responding):")
for r in range(2):
    for c in range(2):
        a_best = A[r, c] == A[:, c].max()   # A can't improve by changing row
        b_best = B[r, c] == B[r, :].max()   # B can't improve by changing col
        if a_best and b_best:
            print(f"  (A:{names[r]}, B:{names[c]}) payoffs ({A[r,c]},{B[r,c]})")
print("Defect dominant for A?", bool((A[1] > A[0]).all()))`
  },

  /* ---- Exact inference: variable elimination ---- */
  "aix-variable-elimination": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>On a chain A - f1(A,B) - f2(B,C), eliminate B by multiplying the two factors and
      summing over B. NumPy's einsum does the product-then-sum in one line, yielding the new factor
      g(A,C).</p>`,
    code: `import numpy as np

# binary factors as 2x2 tables, indexed [A,B] and [B,C].
f1 = np.array([[2.0, 1.0],    # f1(A=0,B=0)=2, f1(0,1)=1
               [1.0, 2.0]])   #              A=1 row
f2 = np.array([[1.0, 2.0],    # f2(B=0,C=0)=1, f2(0,1)=2
               [3.0, 1.0]])   #              B=1 row

# eliminate B: g(A,C) = sum_B f1[A,B] * f2[B,C]  (a matrix product over B)
g = np.einsum("ab,bc->ac", f1, f2)
print("g(A,C) factor after summing out B:")
print(g)
print("g(A=0,C=0) =", g[0, 0], "(expect 2*1 + 1*3 = 5)")

# normalize to a distribution over (A,C) for the query answer
print("normalized:")
print(np.round(g / g.sum(), 3))`
  },

  /* ---- Approximate inference: Gibbs sampling and particle filtering ---- */
  "aix-gibbs-particle": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>When exact inference is too big, sample instead. Here a Gibbs sampler walks a 2-variable
      binary distribution by resampling each variable from its conditional; the visit histogram
      converges to the true posterior.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

# unnormalized joint over (X,Y), each in {0,1}: a 2x2 table.
phi = np.array([[1.0, 2.0],
                [3.0, 4.0]])
true_post = phi / phi.sum()

def cond(fix_axis, fix_val):
    row = phi[fix_val, :] if fix_axis == 0 else phi[:, fix_val]
    return row / row.sum()

x, y = 0, 0
counts = np.zeros((2, 2))
for t in range(20000):
    x = rng.choice(2, p=cond(1, y))   # resample X | Y
    y = rng.choice(2, p=cond(0, x))   # resample Y | X
    counts[x, y] += 1

emp = counts / counts.sum()
print("true posterior:\\n", np.round(true_post, 3))
print("Gibbs estimate:\\n", np.round(emp, 3))
print("max abs error:", round(float(np.max(np.abs(emp - true_post))), 4))`
  },

  /* ---- The Markov blanket ---- */
  "aix-markov-blanket": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A node's Markov blanket is its parents, children, and children's co-parents. Given the
      blanket, the node is independent of everything else. We compute the blanket directly from the
      Bayes-net edge lists.</p>`,
    code: `# Bayes net edges (parent -> child). Target node = "X".
parents = {"X": ["A", "B"], "Y": ["X", "C"], "Z": ["X", "D"], "W": ["E"]}

def children(node):
    return [n for n, ps in parents.items() if node in ps]

def markov_blanket(node):
    blanket = set(parents.get(node, []))          # parents
    for ch in children(node):                     # children ...
        blanket.add(ch)
        blanket.update(parents[ch])               # ... and their other parents (co-parents)
    blanket.discard(node)
    return sorted(blanket)

mb = markov_blanket("X")
print("children of X:", children("X"))
print("Markov blanket of X:", mb)
# E and W are outside the blanket -> X is independent of them given the blanket
print("W in blanket?", "W" in mb)`
  },

  /* ---- HMM smoothing (forward-backward) ---- */
  "aix-forward-backward": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The forward pass alpha gathers evidence up to step i; the backward pass beta gathers
      it from the end back to i. Their product, normalized, is the smoothed posterior P(H_i | all
      evidence) for each time step.</p>`,
    code: `import numpy as np

# 2 hidden states. pi = start, T[i,j] = P(state j | state i), E[:,o] = P(obs o | state).
pi = np.array([0.6, 0.4])
T  = np.array([[0.7, 0.3],
               [0.4, 0.6]])
E  = np.array([[0.9, 0.1],     # state 0 emission probs for obs {0,1}
               [0.2, 0.8]])
obs = [0, 1, 0]                # observed sequence
N = len(obs)

alpha = np.zeros((N, 2)); beta = np.zeros((N, 2))
alpha[0] = pi * E[:, obs[0]]                       # forward init
for i in range(1, N):
    alpha[i] = (alpha[i-1] @ T) * E[:, obs[i]]
beta[N-1] = 1.0                                    # backward init
for i in range(N-2, -1, -1):
    beta[i] = T @ (E[:, obs[i+1]] * beta[i+1])

post = alpha * beta
post /= post.sum(axis=1, keepdims=True)            # smoothed P(H_i | E)
print("smoothed posteriors per step:")
print(np.round(post, 3))`
  },

  /* ---- Latent Dirichlet Allocation (topic modeling) ---- */
  "aix-lda-topic": {
    lib: "Python + NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>LDA finds hidden topics by a collapsed Gibbs sampler: repeatedly reassign each word's
      topic from counts of (document,topic) and (topic,word). On a tiny 2-topic corpus the recovered
      topic-word tables separate the two word clusters.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

# vocab 0..3. Docs 0,1 favor words {0,1}; docs 2,3 favor words {2,3}.
docs = [[0,1,0,1], [1,0,1,0], [2,3,2,3], [3,2,3,2]]
V, K = 4, 2                       # vocab size, number of topics
alpha, beta = 0.1, 0.1
z = [rng.integers(0, K, len(d)).tolist() for d in docs]

ndk = np.zeros((len(docs), K))    # doc-topic counts
nkw = np.zeros((K, V))            # topic-word counts
for d, doc in enumerate(docs):
    for i, w in enumerate(doc):
        ndk[d, z[d][i]] += 1; nkw[z[d][i], w] += 1

for _ in range(300):              # collapsed Gibbs sampling
    for d, doc in enumerate(docs):
        for i, w in enumerate(doc):
            k = z[d][i]; ndk[d, k] -= 1; nkw[k, w] -= 1
            p = (ndk[d] + alpha) * (nkw[:, w] + beta) / (nkw.sum(1) + V*beta)
            k = rng.choice(K, p=p / p.sum())
            z[d][i] = k; ndk[d, k] += 1; nkw[k, w] += 1

phi = (nkw + beta) / (nkw.sum(1, keepdims=True) + V*beta)
print("topic-word distributions (rows = topics):")
print(np.round(phi, 2))`
  },

  /* ---- First-order logic ---- */
  "aix-fol": {
    lib: "Python",
    runnable: true,
    packages: [],
    explain: `<p>Reasoning in FOL runs on unification: find a substitution that makes two atoms
      identical, then resolve. This pure-Python unifier matches predicates and binds variables,
      e.g. unifying Knows(x, John) with Knows(Alice, y).</p>`,
    code: `def is_var(t):
    return isinstance(t, str) and t[0].islower()   # lowercase = variable

def unify(a, b, s=None):
    s = {} if s is None else s
    if s is None: return None
    if a == b: return s
    if is_var(a): return unify_var(a, b, s)
    if is_var(b): return unify_var(b, a, s)
    if isinstance(a, tuple) and isinstance(b, tuple) and len(a) == len(b):
        for x, y in zip(a, b):
            s = unify(x, y, s)
            if s is None: return None
        return s
    return None

def unify_var(v, x, s):
    if v in s: return unify(s[v], x, s)
    s = dict(s); s[v] = x; return s

# Knows(x, John) vs Knows(Alice, y)
atom1 = ("Knows", "x", "John")
atom2 = ("Knows", "Alice", "y")
print("unifier:", unify(atom1, atom2))            # {x: Alice, y: John}
print("no match:", unify(("P", "Alice"), ("P", "Bob")))`
  }

});
