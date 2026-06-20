/* =====================================================================
   MODULE 4 — ARTIFICIAL INTELLIGENCE (CS221): CODE SECTION.
   One window.CODE entry per lesson. Each entry is a tiny, self-contained,
   deterministic program that implements the lesson's actual algorithm from
   scratch (plain Python + NumPy) and PRINTS its result.
   Runs in Pyodide (numpy / stdlib only).
   ===================================================================== */
window.CODE = Object.assign(window.CODE || {}, {

  /* ---- Linear predictors: score = w . phi(x), predict by sign ---- */
  "ai-linear-predictors": {
    lib: "Python + NumPy", runnable: true, packages: ["numpy"],
    explain: `<p>A linear predictor turns an input into a feature vector, takes a dot
      product with a weight vector to get a score, then reads the sign as the answer.
      Here we score four emails and print the spam / not-spam decision plus the margin.</p>`,
    code: `import numpy as np

# features per email: [count of "free", number of links], plus a bias 1.
X = np.array([[2, 3, 1], [0, 1, 1], [4, 2, 1], [1, 0, 1]])
y = np.array([+1, -1, +1, -1])          # true labels (spam / not spam)
w = np.array([1.5, 0.5, -3.0])          # learned weights (last entry = bias)

scores = X @ w                          # dot product: one score per email
pred   = np.sign(scores)                # +1 = spam, -1 = not spam
margin = scores * y                     # confident AND correct => big positive

for i in range(len(y)):
    tag = "spam" if pred[i] > 0 else "ham "
    print("email", i, "score=%6.2f" % scores[i],
          "->", tag, "margin=%6.2f" % margin[i])
print("accuracy:", np.mean(pred == y))`
  },

  /* ---- Loss minimization: average per-example loss for several losses ---- */
  "ai-loss-minimization": {
    lib: "Python + NumPy", runnable: true, packages: ["numpy"],
    explain: `<p>A loss scores how wrong one prediction is; training loss is the average
      over the data. We compute zero-one, hinge, and squared loss for a fixed set of
      margins and print the averages so you can compare how harshly each one penalizes.</p>`,
    code: `import numpy as np

# margins m = score * true_label (positive = correct & confident).
m = np.array([2.0, 0.3, -0.5, 1.5, -1.2])

zero_one = (m < 0).astype(float)        # 1 if wrong, else 0
hinge    = np.maximum(1 - m, 0)         # SVM loss: 0 once margin passes 1
squared  = (m - 1) ** 2                 # punishes distance from a margin of 1

print("margins :", m)
print("zero-one:", zero_one, " mean =", zero_one.mean())
print("hinge   :", np.round(hinge, 2), " mean =", round(hinge.mean(), 3))
print("squared :", np.round(squared, 2), " mean =", round(squared.mean(), 3))`
  },

  /* ---- SGD: from-scratch stochastic gradient descent for hinge loss ---- */
  "ai-sgd": {
    lib: "Python + NumPy", runnable: true, packages: ["numpy"],
    explain: `<p>Stochastic gradient descent updates the weights after each single example:
      w &larr; w - eta * gradient. We train a linear classifier on a tiny separable
      dataset with the hinge loss and print the loss falling each epoch.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

# 6 points in 2D plus a bias feature; two clearly separable clouds.
X = np.array([[1,1,1],[1,2,1],[2,1,1],[4,4,1],[5,4,1],[4,5,1]], float)
y = np.array([-1,-1,-1,+1,+1,+1], float)
w = np.zeros(3)
eta = 0.05

for epoch in range(8):
    for i in rng.permutation(len(y)):       # one random example at a time
        margin = y[i] * (w @ X[i])
        if margin < 1:                       # hinge gradient is nonzero only here
            w += eta * y[i] * X[i]           # w <- w - eta * grad(hinge)
    loss = np.mean(np.maximum(1 - y * (X @ w), 0))
    print("epoch %d  hinge loss = %.3f" % (epoch, loss))

print("final weights:", np.round(w, 3))
print("predictions  :", np.sign(X @ w).astype(int))`
  },

  /* ---- Search problem: BFS over the explicit graph from the lesson ---- */
  "ai-search-problem": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>A search problem is defined by a start, the actions/successors, and a goal
      test. We encode the lesson's small graph and run breadth-first search, printing the
      order nodes are discovered and the path found from S to the goal G.</p>`,
    code: `from collections import deque

succ = {"S":["A","B"], "A":["C","D"], "B":["D","E"],
        "C":["G"], "D":["G"], "E":["G"], "G":[]}

start, goal = "S", "G"
frontier = deque([start])
parent = {start: None}
order = []

while frontier:
    u = frontier.popleft()          # BFS: take from the front of the queue
    order.append(u)
    if u == goal:
        break
    for v in succ[u]:
        if v not in parent:         # first time we see v
            parent[v] = u
            frontier.append(v)

path = []                           # rebuild the path by following parents back
node = goal
while node is not None:
    path.append(node); node = parent[node]
path.reverse()

print("discovery order:", order)
print("path S -> G     :", " -> ".join(path), "(length", len(path) - 1, ")")`
  },

  /* ---- Tree search: BFS vs DFS visit order on a binary tree ---- */
  "ai-tree-search": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>BFS uses a queue (go wide), DFS uses a stack (go deep). The same tree gives
      different visit orders. We run both on a 7-node binary tree and print each order.</p>`,
    code: `children = {1:[2,3], 2:[4,5], 3:[6,7], 4:[], 5:[], 6:[], 7:[]}

def search(use_stack):
    frontier = [1]
    order = []
    while frontier:
        u = frontier.pop() if use_stack else frontier.pop(0)
        order.append(u)
        kids = children[u]
        if use_stack:
            kids = reversed(kids)    # so the left child comes off the stack first
        for v in kids:
            frontier.append(v)
    return order

print("BFS (queue):", search(use_stack=False))
print("DFS (stack):", search(use_stack=True))`
  },

  /* ---- Graph search: uniform cost search (Dijkstra) on weighted graph ---- */
  "ai-graph-search": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>Uniform cost search always expands the cheapest frontier node next, and
      remembers settled states so it never repeats work. We run it on the lesson's
      weighted graph and print the cheapest cost and path from S to G.</p>`,
    code: `import heapq

edges = [("S","A",1),("S","B",4),("A","C",2),("A","B",2),
         ("B","D",1),("C","G",3),("D","G",2),("C","D",1)]
nbr = {}
for u, v, w in edges:                       # undirected adjacency list
    nbr.setdefault(u, []).append((v, w))
    nbr.setdefault(v, []).append((u, w))

start, goal = "S", "G"
pq = [(0, start, [start])]                  # (past cost, node, path)
settled = set()

while pq:
    cost, u, path = heapq.heappop(pq)       # pop the cheapest-so-far node
    if u in settled:
        continue
    settled.add(u)
    if u == goal:
        print("cheapest cost S -> G:", cost)
        print("path:", " -> ".join(path))
        break
    for v, w in nbr[u]:
        if v not in settled:
            heapq.heappush(pq, (cost + w, v, path + [v]))`
  },

  /* ---- A*: shortest path on a grid with the Manhattan heuristic ---- */
  "ai-astar": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>A* is uniform cost search with a heuristic h: it orders the frontier by
      f = g + h (cost so far plus a guess of what's left). With the admissible Manhattan
      heuristic on a grid, it finds the optimal path while exploring far fewer cells.</p>`,
    code: `import heapq

ROWS, COLS = 5, 7
start, goal = (2, 1), (2, 5)

def h(p):                                   # Manhattan distance: admissible on a grid
    return abs(p[0]-goal[0]) + abs(p[1]-goal[1])

def neighbors(p):
    r, c = p
    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
        nr, nc = r+dr, c+dc
        if 0 <= nr < ROWS and 0 <= nc < COLS:
            yield (nr, nc)

pq = [(h(start), 0, start, [start])]        # (f = g+h, g, node, path)
best_g = {start: 0}
expanded = 0

while pq:
    f, g, u, path = heapq.heappop(pq)
    expanded += 1
    if u == goal:
        print("optimal path length:", len(path) - 1)
        print("path:", path)
        print("cells expanded:", expanded, "of", ROWS * COLS)
        break
    for v in neighbors(u):
        ng = g + 1
        if ng < best_g.get(v, 1e9):
            best_g[v] = ng
            heapq.heappush(pq, (ng + h(v), ng, v, path + [v]))`
  },

  /* ---- MDP: define a tiny MDP and verify transition probabilities ---- */
  "ai-mdp": {
    lib: "Python + NumPy", runnable: true, packages: ["numpy"],
    explain: `<p>An MDP adds randomness: an action lands in each next state with some
      probability T(s,a,s'), and pays a reward. We build a 3-state MDP as a transition
      tensor, check each row sums to 1, and print the expected immediate reward per action.</p>`,
    code: `import numpy as np

# States 0,1,2.  Actions: 0 = "left", 1 = "right".
# T[a, s, s'] = probability of s -> s' under action a (the "slippery" robot).
T = np.array([
    [[0.8,0.2,0.0],[0.7,0.3,0.0],[0.0,0.6,0.4]],   # action left
    [[0.1,0.9,0.0],[0.0,0.2,0.8],[0.0,0.0,1.0]],   # action right
])
R = np.array([0.0, 0.0, 5.0])                       # reward for arriving in each state
gamma = 0.9

print("row sums (must all be 1):")
print(T.sum(axis=2))                                # over s', for every (a, s)

# expected immediate reward of taking action a in state s = sum_s' T * R(s')
exp_reward = T @ R
for a, name in enumerate(["left ", "right"]):
    print("action", name, "-> expected reward by start state:",
          np.round(exp_reward[a], 2))
print("discount gamma =", gamma)`
  },

  /* ---- Policy / value: evaluate a fixed policy by solving V = R + gamma P V ---- */
  "ai-policy-value": {
    lib: "Python + NumPy", runnable: true, packages: ["numpy"],
    explain: `<p>A policy says which action to take in each state; its value V is the
      expected discounted reward of following it. For a fixed policy the values satisfy
      a linear system V = r + gamma P V, which we solve directly and print.</p>`,
    code: `import numpy as np

# A fixed policy induces a Markov chain. P[s, s'] = transition under the policy.
P = np.array([[0.5, 0.5, 0.0],
              [0.0, 0.5, 0.5],
              [0.0, 0.0, 1.0]])          # state 2 is absorbing
r = np.array([0.0, 1.0, 10.0])          # immediate reward in each state
gamma = 0.9

# Policy evaluation: V = r + gamma P V  =>  (I - gamma P) V = r
I = np.eye(3)
V = np.linalg.solve(I - gamma * P, r)

print("policy values V(s):", np.round(V, 3))
# sanity check: re-apply the Bellman equation, should reproduce V
print("Bellman check    :", np.round(r + gamma * P @ V, 3))`
  },

  /* ---- Q-value: Q(s,a) = sum T (R + gamma V) from V ---- */
  "ai-qvalue": {
    lib: "Python + NumPy", runnable: true, packages: ["numpy"],
    explain: `<p>The Q-value Q(s,a) is the value of taking action a now, then acting well
      after. Given state values V, we compute Q for each action by averaging over where the
      action might land, then print which action is best in each state.</p>`,
    code: `import numpy as np

# T[a, s, s'] transition probs; reward R(s') on arrival; known values V.
T = np.array([
    [[0.8,0.2,0.0],[0.0,0.8,0.2],[0.0,0.0,1.0]],   # action 0
    [[0.2,0.8,0.0],[0.0,0.2,0.8],[0.0,0.0,1.0]],   # action 1
])
R = np.array([0.0, 1.0, 10.0])
V = np.array([5.0, 8.0, 10.0])
gamma = 0.9

# Q[a, s] = sum_s' T[a,s,s'] * (R[s'] + gamma * V[s'])
Q = T @ (R + gamma * V)
print("Q-values (rows = action, cols = state):")
print(np.round(Q, 2))
best = Q.argmax(axis=0)                  # best action per state
print("best action per state:", best)`
  },

  /* ---- Value iteration on a tiny gridworld MDP ---- */
  "ai-value-iteration": {
    lib: "Python + NumPy", runnable: true, packages: ["numpy"],
    explain: `<p>Value iteration repeatedly applies the Bellman optimality update
      V(s) = max_a sum_s' T (R + gamma V) until the values stop changing. We run it on a
      small slippery MDP and print the converged values and the greedy policy.</p>`,
    code: `import numpy as np

# 3 states, 2 actions. T[a, s, s']; state 2 is the absorbing goal (reward 10).
T = np.array([
    [[0.8,0.2,0.0],[0.0,0.8,0.2],[0.0,0.0,1.0]],
    [[0.2,0.8,0.0],[0.0,0.2,0.8],[0.0,0.0,1.0]],
])
R = np.array([0.0, 0.0, 10.0])
gamma = 0.9
V = np.zeros(3)

for it in range(40):
    Q = T @ (R + gamma * V)              # Q[a, s]
    newV = Q.max(axis=0)                 # best action's value, per state
    if np.max(np.abs(newV - V)) < 1e-6:
        print("converged after", it, "iterations")
        break
    V = newV

policy = (T @ (R + gamma * V)).argmax(axis=0)
print("optimal values V*:", np.round(V, 3))
print("optimal policy   :", policy)`
  },

  /* ---- Q-learning: model-free tabular learning on a tiny MDP ---- */
  "ai-q-learning": {
    lib: "Python + NumPy", runnable: true, packages: ["numpy"],
    explain: `<p>Q-learning learns action values by trial and error, with no model of the
      world. Each step nudges Q toward reward + gamma * max future Q. We learn a tabular Q on
      a 4-state chain and print the learned table plus the recovered greedy policy.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

# Chain: states 0..3, state 3 is the goal. Action 0 = left, 1 = right.
N, A = 4, 2
def step(s, a):
    s2 = max(0, s - 1) if a == 0 else min(N - 1, s + 1)
    reward = 10.0 if s2 == N - 1 else -1.0
    return s2, reward

Q = np.zeros((N, A))
alpha, gamma, eps = 0.5, 0.9, 0.2

for ep in range(400):
    s = 0
    for _ in range(20):
        a = rng.integers(A) if rng.random() < eps else int(Q[s].argmax())
        s2, r = step(s, a)
        # Q-learning update toward r + gamma * best next Q
        Q[s, a] += alpha * (r + gamma * Q[s2].max() - Q[s, a])
        s = s2
        if s == N - 1:
            break

print("learned Q-table:\\n", np.round(Q, 2))
print("greedy policy (0=left,1=right):", Q.argmax(axis=1))`
  },

  /* ---- Minimax on a small game tree ---- */
  "ai-minimax": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>Minimax assumes you maximize and the opponent minimizes, alternating by
      depth. We recurse over a small game tree of leaf utilities and print the minimax value
      at the root plus the value each layer reports.</p>`,
    code: `# Nested lists = game tree. A number is a leaf utility; a list is an internal node.
tree = [[[3, 12], [8, 2]], [[4, 6], [14, 5]]]

def minimax(node, maximizing):
    if isinstance(node, int):
        return node                      # leaf: just its utility
    values = [minimax(child, not maximizing) for child in node]
    return max(values) if maximizing else min(values)

# root is a MAX node; layers alternate MAX, MIN, MAX, leaves
root_value = minimax(tree, maximizing=True)
print("MAX over two MIN subtrees")
for i, sub in enumerate(tree):
    print("  subtree", i, "MIN value =", minimax(sub, maximizing=False))
print("minimax value at root:", root_value)`
  },

  /* ---- Alpha-beta pruning, counting nodes vs plain minimax ---- */
  "ai-alpha-beta": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>Alpha-beta pruning gives the same answer as minimax but skips branches that
      cannot change the decision. We run it on the same tree, counting leaves visited, and
      compare against the total number of leaves to show the savings.</p>`,
    code: `tree = [[[3, 12], [8, 2]], [[4, 6], [14, 5]]]
visited = [0]                            # mutable counter of leaves examined

def ab(node, alpha, beta, maximizing):
    if isinstance(node, int):
        visited[0] += 1
        return node
    if maximizing:
        v = -10**9
        for child in node:
            v = max(v, ab(child, alpha, beta, False))
            alpha = max(alpha, v)
            if alpha >= beta:
                break                    # beta cutoff: prune the rest
        return v
    else:
        v = 10**9
        for child in node:
            v = min(v, ab(child, alpha, beta, True))
            beta = min(beta, v)
            if alpha >= beta:
                break                    # alpha cutoff: prune the rest
        return v

value = ab(tree, -10**9, 10**9, True)
print("alpha-beta value:", value)
print("leaves examined :", visited[0], "of 8 total (rest were pruned)")`
  },

  /* ---- Expectimax: chance nodes average instead of minimize ---- */
  "ai-expectimax": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>When the opponent is random rather than optimal, the MIN layer becomes a
      chance layer that averages its children. We compute both the minimax value and the
      expectimax value on the same tree and print how they differ.</p>`,
    code: `tree = [[3, 12, 8], [4, 6, 2]]      # two subtrees of leaf utilities

def evaluate(node, maximizing, chance):
    if isinstance(node, int):
        return node
    vals = [evaluate(c, not maximizing, chance) for c in node]
    if maximizing:
        return max(vals)
    return sum(vals) / len(vals) if chance else min(vals)

mm = evaluate(tree, maximizing=True, chance=False)   # adversarial opponent
em = evaluate(tree, maximizing=True, chance=True)    # random opponent
print("minimax value   (worst-case opponent):", mm)
print("expectimax value (random opponent)   :", em)`
  },

  /* ---- CSP: define a map-coloring CSP and check an assignment ---- */
  "ai-csp": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>A CSP has variables, domains, and constraints. We define the classic
      Australia map-coloring CSP, then test two full assignments and print whether each one
      satisfies every "adjacent regions differ" constraint.</p>`,
    code: `variables = ["WA","NT","SA","Q","NSW","V"]
domains = {v: ["red","green","blue"] for v in variables}
edges = [("WA","NT"),("WA","SA"),("NT","SA"),("NT","Q"),
         ("SA","Q"),("SA","NSW"),("SA","V"),("Q","NSW"),("NSW","V")]

def satisfied(assign):
    return all(assign[a] != assign[b] for a, b in edges)

good = {"WA":"red","NT":"green","SA":"blue",
        "Q":"red","NSW":"green","V":"red"}
bad  = dict(good); bad["NSW"] = "blue"          # now SA and NSW clash

print("variables:", variables)
print("good assignment satisfied?", satisfied(good))
print("bad  assignment satisfied?", satisfied(bad))`
  },

  /* ---- CSP search: backtracking solver for map coloring ---- */
  "ai-csp-search": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>Backtracking assigns one variable at a time, checks the constraints
      immediately, and backs up the moment it gets stuck. We solve the Australia
      map-coloring CSP and print the first full solution it finds.</p>`,
    code: `variables = ["WA","NT","SA","Q","NSW","V","T"]
colors = ["red","green","blue"]
edges = [("WA","NT"),("WA","SA"),("NT","SA"),("NT","Q"),
         ("SA","Q"),("SA","NSW"),("SA","V"),("Q","NSW"),("NSW","V")]

def ok(var, color, assign):
    for a, b in edges:                  # no adjacent pair may share a color
        if a == var and b in assign and assign[b] == color: return False
        if b == var and a in assign and assign[a] == color: return False
    return True

def backtrack(assign):
    if len(assign) == len(variables):
        return assign                   # all variables assigned: done
    var = next(v for v in variables if v not in assign)
    for color in colors:
        if ok(var, color, assign):
            assign[var] = color
            result = backtrack(assign)
            if result is not None:
                return result
            del assign[var]             # undo and try the next color
    return None

solution = backtrack({})
print("solution found:")
for v in variables:
    print(" ", v, "=", solution[v])`
  },

  /* ---- Bayes net: build a CPT-based net and check it ---- */
  "ai-bayes-net": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>A Bayes net stores a small conditional probability table (CPT) per variable
      instead of one giant joint table. We encode the classic alarm net and compute the joint
      probability of one full assignment by multiplying the relevant CPT entries.</p>`,
    code: `# Variables: Burglary, Earthquake, Alarm. P(true) tables.
pB = {True: 0.001, False: 0.999}
pE = {True: 0.002, False: 0.998}
# P(Alarm=True | B, E)
pA = {(True,True): 0.95, (True,False): 0.94,
      (False,True): 0.29, (False,False): 0.001}

def joint(b, e, a):
    pa = pA[(b, e)] if a else 1 - pA[(b, e)]
    return pB[b] * pE[e] * pa            # factorized joint = product of CPTs

# probability of: no burglary, no earthquake, but the alarm rings
p = joint(False, False, True)
print("P(B=F, E=F, A=T) =", round(p, 8))

# sanity: the full joint over all 8 assignments sums to 1
total = sum(joint(b, e, a) for b in (True, False)
            for e in (True, False) for a in (True, False))
print("sum over all assignments =", round(total, 6))`
  },

  /* ---- Bayes inference: enumeration to get a posterior ---- */
  "ai-bayes-inference": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>Inference asks: given evidence, what's the chance of the query? We use
      inference by enumeration on the alarm net to compute P(Burglary | Alarm=True),
      summing out the hidden Earthquake variable, and print the normalized posterior.</p>`,
    code: `pB = {True: 0.001, False: 0.999}
pE = {True: 0.002, False: 0.998}
pA = {(True,True): 0.95, (True,False): 0.94,
      (False,True): 0.29, (False,False): 0.001}

def joint(b, e, a):
    pa = pA[(b, e)] if a else 1 - pA[(b, e)]
    return pB[b] * pE[e] * pa

# Query P(B | A=True): sum out the hidden variable E for each value of B.
unnorm = {}
for b in (True, False):
    unnorm[b] = sum(joint(b, e, True) for e in (True, False))

z = unnorm[True] + unnorm[False]        # normalizing constant = P(A=True)
post = {b: unnorm[b] / z for b in unnorm}

print("P(Alarm=True)            =", round(z, 6))
print("P(Burglary=True | Alarm) =", round(post[True], 4))
print("P(Burglary=False| Alarm) =", round(post[False], 4))`
  },

  /* ---- HMM: forward algorithm for filtering ---- */
  "ai-hmm": {
    lib: "Python + NumPy", runnable: true, packages: ["numpy"],
    explain: `<p>In an HMM you see noisy emissions, not the true hidden state. The forward
      algorithm propagates a belief over hidden states and reweights it by each observation.
      We run it on the classic rain/umbrella HMM and print the filtered belief each day.</p>`,
    code: `import numpy as np

# Hidden states: 0 = Rain, 1 = No rain.
T = np.array([[0.7, 0.3],     # P(next | Rain)
              [0.3, 0.7]])    # P(next | No rain)
# Emission P(umbrella seen | state); observation each day = umbrella?
E_umb = np.array([0.9, 0.2])  # rain -> usually umbrella; sun -> rarely
prior = np.array([0.5, 0.5])

observations = [True, True, False]   # umbrella, umbrella, no umbrella
belief = prior
for day, saw_umbrella in enumerate(observations):
    belief = belief @ T                       # predict: push through transitions
    e = E_umb if saw_umbrella else (1 - E_umb)
    belief = belief * e                       # update: weight by the observation
    belief = belief / belief.sum()            # renormalize
    print("day", day, "umbrella=%-5s" % saw_umbrella,
          "P(rain) = %.3f" % belief[0])`
  },

  /* ---- Propositional logic: truth-table model checking for entailment ---- */
  "ai-propositional-logic": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>Propositional logic builds true/false statements with AND, OR, NOT. We check
      entailment by truth table: enumerate every assignment, keep those where the knowledge
      base holds, and test whether the query is true in all of them.</p>`,
    code: `import itertools

symbols = ["P", "Q", "R"]

# Knowledge base: (P -> Q) and (Q -> R) and P.  Query: R.
def kb(m):
    return ((not m["P"]) or m["Q"]) and ((not m["Q"]) or m["R"]) and m["P"]
def query(m):
    return m["R"]

models, entails = 0, True
for vals in itertools.product([False, True], repeat=len(symbols)):
    m = dict(zip(symbols, vals))
    if kb(m):                            # only models where the KB is true
        models += 1
        print("KB true at", m, "-> query R =", query(m))
        if not query(m):
            entails = False

print("models satisfying KB:", models)
print("KB entails R?", entails)`
  },

  /* ---- Inference rules: forward chaining with modus ponens ---- */
  "ai-inference-rules": {
    lib: "Python", runnable: true, packages: [],
    explain: `<p>Forward chaining mechanically derives new facts: whenever every premise of a
      rule is known, modus ponens fires and adds the conclusion. We run it on a small set of
      definite clauses and print each fact as it is derived, then the final closure.</p>`,
    code: `# Rules as (premises, conclusion). Definite clauses (Horn).
rules = [
    (["A", "B"], "C"),
    (["C"], "D"),
    (["A"], "B"),
    (["D", "C"], "E"),
]
facts = {"A"}                            # known facts to start

changed = True
while changed:                           # keep firing rules until nothing new
    changed = False
    for premises, conclusion in rules:
        if conclusion not in facts and all(p in facts for p in premises):
            facts.add(conclusion)        # modus ponens fires
            print("derived", conclusion, "from", premises)
            changed = True

print("final known facts:", sorted(facts))
print("E proven?", "E" in facts)`
  }

});
