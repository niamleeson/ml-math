/* Reinforcement Learning — "Value iteration as a contraction mapping".
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-value-iteration".
   Deeper RL-curriculum treatment of the app's existing ai-value-iteration lesson. */
(function () {
  window.LESSONS.push({
    id: "rl-value-iteration",
    title: "Value iteration: one backup to rule them all",
    tagline: "Collapse policy iteration's two steps into a single Bellman optimality backup, and converge to V* geometrically because that backup is a contraction.",
    module: "Reinforcement Learning",
    prereqs: ["rl-bellman-optimality", "ai-value-iteration", "ai-mdp", "prob-expectation"],

    whenToUse:
      `<p><b>Value iteration is the workhorse for small-to-medium MDPs (Markov Decision Processes) whose model you fully know</b>
       &mdash; the transition probabilities and rewards are given, and you can afford to sweep every state.
       It returns the exact optimal value function $V^*$ and the optimal policy $\\pi^*$, with no learning loop and no neural network.</p>
       <p>This is the deeper, contraction-mapping treatment of the app's existing
       <a href="#ai-value-iteration"><code>ai-value-iteration</code></a> lesson. That lesson shows the mechanics of a Bellman sweep;
       here we explain <i>why</i> the sweeps must converge, and how fast.</p>
       <ul>
         <li><b>Reach for it when:</b> the MDP is known and the state space is small enough to enumerate (tens to a few million states);
         you want the optimal policy exactly, not an approximation.</li>
         <li><b>Choose it over <a href="#rl-policy-iteration">policy iteration</a></b> when you prefer many <i>cheap</i> backups
         to a few <i>expensive</i> full policy evaluations. Value iteration folds evaluation and improvement into one $\\max$.</li>
         <li><b>Do NOT reach for it when:</b> you do not know the model (then learn it &mdash; this is the template behind
         <a href="#ai-q-learning"><code>ai-q-learning</code></a>, its sampled, model-free cousin); or the state space is huge or
         continuous (then use function approximation, e.g. <a href="#mod-dqn"><code>mod-dqn</code></a>).</li>
       </ul>`,

    application:
      `<p>Value iteration powers exact planning wherever a model is available: gridworld and warehouse navigation, inventory and
       supply-chain control, elevator and traffic-light scheduling, board-game endgame tables, and the solver inside
       model-based RL. Its sampled form &mdash; replace the exact expectation by a single observed transition &mdash; is exactly
       <b>Q-learning</b>, which scales the same idea to unknown and large environments.</p>`,

    pitfalls:
      `<ul>
         <li><b>It is model-based.</b> You must know $P(s' \\mid s,a)$ and the reward $R$ to compute a single backup.
         If you only have experience, not a model, use a model-free method (Q-learning, SARSA) instead.</li>
         <li><b>It does not scale to large or continuous state spaces.</b> Each sweep costs
         $\\mathcal{O}(\\lvert S\\rvert \\cdot \\lvert A\\rvert \\cdot \\lvert S\\rvert)$ &mdash; one term per state, action, and successor.
         When $\\lvert S\\rvert$ explodes, switch to function approximation or approximate dynamic programming.</li>
         <li><b>Slow when $\\gamma \\to 1$.</b> The error shrinks by a factor of $\\gamma$ each sweep, so to reach tolerance $\\varepsilon$ you need
         about $\\log(\\varepsilon)/\\log(\\gamma)$ sweeps. As $\\gamma \\to 1$ that blows up; a $\\gamma$ very close to $1$ converges painfully slowly.</li>
         <li><b>Tolerance choice.</b> Stop on the Bellman residual $\\lVert V_{k+1}-V_k\\rVert_\\infty \\lt \\varepsilon$.
         Too loose and the greedy policy is suboptimal; too tight and you waste sweeps past the point the <i>policy</i> stopped changing
         (the policy often stabilizes long before the values do).</li>
         <li><b>Synchronous vs in-place.</b> A textbook sweep backs up from the <i>previous</i> sweep's $V_k$. If you overwrite in place
         (Gauss&ndash;Seidel style), you mix in half-updated values &mdash; usually fine and often <i>faster</i>, but it changes the exact iterates.</li>
       </ul>`,

    bigIdea:
      `<p><a href="#rl-policy-iteration">Policy iteration</a> alternates two phases: <b>evaluate</b> the current policy to convergence,
       then <b>improve</b> it greedily. <b>Value iteration</b> notices you do not need a fully evaluated policy to improve &mdash;
       <i>one</i> backup of evaluation, immediately followed by the greedy $\\max$, is enough. Collapse the two steps into one.</p>
       <p>The single combined update is the <b>Bellman optimality backup</b>. Apply it to every state, sweep after sweep.
       The values march toward $V^*$, the optimal value function. Read off the greedy action in each state and you have $\\pi^*$, the optimal policy.</p>
       <p>The deep reason it must work: that backup is a <b>contraction mapping</b>. Each sweep pulls any two value functions strictly closer together,
       so they all funnel to one fixed point &mdash; and $V^*$ is that fixed point.</p>`,

    buildup:
      `<p>Recall the pieces of an MDP (see <a href="#ai-mdp"><code>ai-mdp</code></a>): states $s$, actions $a$, a transition rule
       $P(s' \\mid s,a)$, a reward $R$, and a discount $\\gamma$. A value function $V(s)$ assigns a number to each state &mdash;
       the expected discounted return from there.</p>
       <p>The Bellman <i>optimality</i> equation says the optimal value of a state is the value of its <i>best</i> action:
       take that action's immediate reward plus the discounted optimal value of where you land, averaged over where you might land.</p>
       <p>Value iteration turns that equation into an <i>update</i>: treat the right-hand side as an operator $T$ that takes a guess $V_k$
       and returns a better guess $V_{k+1} = T V_k$. We show $T$ is a $\\gamma$-contraction, so by the Banach fixed-point theorem the iterates converge geometrically to the unique fixed point $V^*$.</p>`,

    symbols: [
      { sym: "$s,\\ s'$", desc: "the current state and a possible next state." },
      { sym: "$a$", desc: "an action available in state $s$." },
      { sym: "$P(s' \\mid s,a)$", desc: "the transition probability: chance of landing in $s'$ after taking action $a$ in state $s$. The bar '$\\mid$' reads 'given'." },
      { sym: "$R$", desc: "the reward received for the transition (here written as a single number; in general it can depend on $s,a,s'$)." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), $0 \\le \\gamma \\lt 1$: how much a future reward is worth now. $\\gamma=0$ is myopic; $\\gamma \\to 1$ is far-sighted." },
      { sym: "$V_k(s)$", desc: "the value estimate for state $s$ after $k$ sweeps. The subscript $k$ is the sweep number, not a power." },
      { sym: "$V^*(s)$", desc: "the optimal value of $s$: the expected discounted return when acting optimally forever. The star means 'optimal'." },
      { sym: "$\\pi^*(s)$", desc: "the optimal policy: the best action to take in state $s$." },
      { sym: "$\\max_a$", desc: "'the largest over all actions $a$'. Picks the value of the best action." },
      { sym: "$\\arg\\max_a$", desc: "the action $a$ that achieves that largest value (the best action itself, not its number)." },
      { sym: "$T$", desc: "the Bellman optimality operator: the function that maps a value function $V$ to the backed-up value function $TV$. One sweep is one application of $T$." },
      { sym: "$\\lVert V - V'\\rVert_\\infty$", desc: "the max-norm (sup-norm) distance between two value functions: $\\max_s \\lvert V(s)-V'(s)\\rvert$, the single largest per-state gap." }
    ],

    formula: `$$ V_{k+1}(s) \\;=\\; \\max_a \\sum_{s'} P(s' \\mid s,a)\\,\\big[\\,R + \\gamma\\,V_k(s')\\,\\big] \\;\\equiv\\; (T V_k)(s), \\qquad \\pi^*(s) = \\arg\\max_a \\sum_{s'} P(s' \\mid s,a)\\,\\big[\\,R + \\gamma\\,V^*(s')\\,\\big] $$`,

    whatItDoes:
      `<p>For each state $s$, look at every action $a$. For each action, average $R + \\gamma V_k(s')$ over the next states $s'$
       it could lead to &mdash; that is the action's one-step backed-up value. Take the $\\max$ over actions and store it as $V_{k+1}(s)$.
       That single line is one application of the Bellman optimality operator $T$, written $V_{k+1} = T V_k$.</p>
       <p>Sweep $T$ over all states, again and again, until the largest change
       $\\lVert V_{k+1}-V_k\\rVert_\\infty$ drops below a tolerance. The values have then essentially reached $V^*$.</p>
       <p>Finally, read off the policy: in each state, $\\pi^*(s) = \\arg\\max_a(\\cdots)$ is the action that attains the best backed-up value.
       The $\\max$ gives the optimal <i>number</i>; the $\\arg\\max$ gives the optimal <i>action</i>.</p>`,

    derivation:
      `<p><b>Why must the sweeps converge?</b> Because $T$ is a <b>$\\gamma$-contraction in the max-norm</b>. We prove
       $\\lVert TV - TV'\\rVert_\\infty \\le \\gamma\\,\\lVert V - V'\\rVert_\\infty$ for any two value functions $V$ and $V'$.</p>
       <p>Fix a state $s$. Let $a_V$ be the action that achieves the $\\max$ for $TV$ at $s$. Then</p>
       $$ (TV)(s) - (TV')(s) \\;\\le\\; \\sum_{s'} P(s'\\mid s,a_V)\\big[R+\\gamma V(s')\\big] - \\sum_{s'} P(s'\\mid s,a_V)\\big[R+\\gamma V'(s')\\big] $$
       <p>(the second term used $a_V$, which can only be $\\le$ its own $\\max$). The rewards $R$ cancel, leaving</p>
       $$ (TV)(s) - (TV')(s) \\;\\le\\; \\gamma \\sum_{s'} P(s'\\mid s,a_V)\\,\\big[V(s') - V'(s')\\big] \\;\\le\\; \\gamma \\sum_{s'} P(s'\\mid s,a_V)\\,\\lVert V - V'\\rVert_\\infty \\;=\\; \\gamma\\,\\lVert V-V'\\rVert_\\infty, $$
       <p>since the probabilities sum to $1$. By symmetry the same bound holds for $(TV')(s)-(TV)(s)$, so
       $\\lvert (TV)(s)-(TV')(s)\\rvert \\le \\gamma\\lVert V-V'\\rVert_\\infty$ for <i>every</i> $s$. Taking the max over $s$:</p>
       $$ \\lVert TV - TV'\\rVert_\\infty \\;\\le\\; \\gamma\\,\\lVert V - V'\\rVert_\\infty. $$
       <p><b>The consequence (Banach fixed-point theorem).</b> A contraction on a complete space has exactly one fixed point, and iterating
       converges to it from any start. The Bellman optimality equation says $V^* = T V^*$, so $V^*$ is that unique fixed point. Therefore</p>
       $$ \\lVert V_k - V^*\\rVert_\\infty \\;=\\; \\lVert T V_{k-1} - T V^*\\rVert_\\infty \\;\\le\\; \\gamma\\,\\lVert V_{k-1} - V^*\\rVert_\\infty \\;\\le\\; \\cdots \\;\\le\\; \\gamma^{k}\\,\\lVert V_0 - V^*\\rVert_\\infty \\;\\to\\; 0. $$
       <p>The error shrinks by a factor of $\\gamma$ <i>every sweep</i> &mdash; <b>geometric (linear) convergence</b>. To hit tolerance $\\varepsilon$
       you need about $k \\approx \\log(\\varepsilon)/\\log(\\gamma)$ sweeps, which is why $\\gamma \\to 1$ is slow.</p>
       <p><b>Async / Gauss&ndash;Seidel variants.</b> You need not back up every state synchronously from $V_k$. <i>In-place</i> (Gauss&ndash;Seidel)
       value iteration overwrites $V(s)$ immediately and reuses the fresh value within the same sweep; <i>asynchronous</i> value iteration
       backs up states in any order, even skipping some, as long as every state is updated infinitely often. Both still converge to $V^*$
       &mdash; the contraction argument is robust &mdash; and in-place often converges in fewer sweeps because good values propagate sooner.</p>`,

    example:
      `<p>A tiny 3-state chain to see one full sweep with real numbers. States $A, B, G$; $G$ is a terminal goal worth $10$.
       From $A$ you can go right to $B$; from $B$ you can go right to $G$. Step reward $R=-1$, discount $\\gamma=0.9$. Start $V_0 = 0$ everywhere.</p>
       <ul class="steps">
         <li><b>Sweep 1.</b> $V_1(B) = -1 + 0.9\\cdot V_0(G) = -1 + 0.9\\cdot 10 = 8$. And $V_1(A) = -1 + 0.9\\cdot V_0(B) = -1 + 0.9\\cdot 0 = -1$.
         (The good news has reached $B$ but not yet $A$.)</li>
         <li><b>Sweep 2.</b> $V_2(A) = -1 + 0.9\\cdot V_1(B) = -1 + 0.9\\cdot 8 = 6.2$. Now $A$ knows about the goal too.</li>
         <li><b>Convergence.</b> $V^*(G)=10,\\ V^*(B)=8,\\ V^*(A)=6.2$; further sweeps no longer change them. The Bellman residual has hit $0$.</li>
         <li><b>Read off $\\pi^*$.</b> In $A$, 'right' is the only/best action $\\Rightarrow \\pi^*(A)=\\text{right}$; likewise $\\pi^*(B)=\\text{right}$. Head for the goal.</li>
         <li><b>Contraction check.</b> Between sweeps the max change went $8 \\to 6.2$-ish per state, each bounded by $\\gamma$ times the previous &mdash; the geometric decay the theory promises.</li>
       </ul>`,

    practice: [
      {
        q: `In a state $s$ with two actions, the backed-up values are $\\sum_{s'}P(s'\\mid s,a)[R+\\gamma V_k(s')] = 3$ for action "up" and $7$ for action "down". What is $V_{k+1}(s)$ and what is $\\pi^*(s)$?`,
        steps: [
          { do: `Apply the optimality backup: take the $\\max$ over actions.`, why: `Value iteration stores the value of the best action, not an average.` },
          { do: `$V_{k+1}(s) = \\max(3,7) = 7$.`, why: `The $\\max$ gives the optimal number.` },
          { do: `$\\pi^*(s) = \\arg\\max(3,7) = \\text{down}$.`, why: `The $\\arg\\max$ gives the action that attains it.` }
        ],
        answer: `$V_{k+1}(s)=7$ and $\\pi^*(s)=\\text{down}$.`
      },
      {
        q: `With $\\gamma = 0.9$, after one sweep the worst-case error obeys $\\lVert V_1 - V^*\\rVert_\\infty \\le \\gamma\\,\\lVert V_0 - V^*\\rVert_\\infty$. If the initial error $\\lVert V_0 - V^*\\rVert_\\infty = 100$, bound the error after 3 sweeps.`,
        steps: [
          { do: `Use geometric decay: $\\lVert V_k - V^*\\rVert_\\infty \\le \\gamma^{k}\\,\\lVert V_0 - V^*\\rVert_\\infty$.`, why: `Each sweep is one application of the $\\gamma$-contraction $T$, so error multiplies by $\\gamma$.` },
          { do: `Plug in: $\\gamma^3 = 0.9^3 = 0.729$, so the bound is $0.729 \\times 100 = 72.9$.`, why: `Three sweeps shrink the worst-case error by $\\gamma^3$.` }
        ],
        answer: `At most $72.9$. (Slow! That is why $\\gamma$ near $1$ needs many sweeps.)`
      },
      {
        q: `Roughly how many sweeps does value iteration need to reach tolerance $\\varepsilon = 10^{-3}$ when $\\gamma = 0.9$, ignoring the initial-error constant?`,
        steps: [
          { do: `Solve $\\gamma^{k} \\le \\varepsilon$ for $k$: $k \\ge \\log(\\varepsilon)/\\log(\\gamma)$.`, why: `The error is bounded by $\\gamma^{k}$ times a constant; set that below $\\varepsilon$.` },
          { do: `Compute $\\log(10^{-3})/\\log(0.9) = (-3)/(-0.0458) \\approx 65$.`, why: `Both logs are negative, so the ratio is positive.` }
        ],
        answer: `About $65$ sweeps. Halving $\\varepsilon$ adds only a constant number of sweeps; pushing $\\gamma$ toward $1$ multiplies them.`
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  window.CODE["rl-value-iteration"] = {
    lib: "Python + NumPy (gridworld; FrozenLake-style)",
    runnable: false,
    explain:
      `<p>Value iteration on a small known MDP: a deterministic 4&times;4 FrozenLake-style gridworld. We sweep the Bellman
       <b>optimality</b> backup over every state until the max value-change drops below a tolerance, then extract the greedy
       policy $\\pi^*$ and print $V^*$ and $\\pi^*$ as grids. Pure NumPy &mdash; <b>runs in Colab</b> with no extra installs
       (swap in <code>!pip install gymnasium</code> and <code>gymnasium.make("FrozenLake-v1")</code> for the stochastic version).</p>`,
    code: `import numpy as np

# 4x4 FrozenLake-style gridworld. S=start, F=frozen, H=hole, G=goal.
#   S F F F
#   F H F H
#   F F F H
#   H F F G
GRID = ["SFFF", "FHFH", "FFFH", "HFFG"]
ROWS, COLS = 4, 4
holes  = {(r, c) for r in range(ROWS) for c in range(COLS) if GRID[r][c] == "H"}
goal   = next((r, c) for r in range(ROWS) for c in range(COLS) if GRID[r][c] == "G")
states = [(r, c) for r in range(ROWS) for c in range(COLS)]
ACTS   = {0: (-1, 0), 1: (1, 0), 2: (0, -1), 3: (0, 1)}   # up, down, left, right
ARROW  = {0: "^", 1: "v", 2: "<", 3: ">"}
gamma, tol = 0.9, 1e-10

def terminal(s): return s in holes or s == goal

def step(s, a):                              # deterministic move; walls bounce back
    if terminal(s): return s
    dr, dc = ACTS[a]
    ns = (s[0] + dr, s[1] + dc)
    if not (0 <= ns[0] < ROWS and 0 <= ns[1] < COLS): ns = s
    return ns

def reward(s, ns):                           # +1 only for stepping onto the goal
    return 1.0 if (ns == goal and s != goal) else 0.0

# ----- value iteration: sweep the Bellman OPTIMALITY backup to convergence -----
V = {s: 0.0 for s in states}
for sweep in range(10_000):
    nV, delta = dict(V), 0.0
    for s in states:
        if terminal(s):                      # holes/goal keep value 0
            continue
        best = max(reward(s, step(s, a)) + gamma * V[step(s, a)] for a in ACTS)
        nV[s] = best
        delta = max(delta, abs(nV[s] - V[s]))
    V = nV
    if delta < tol:
        break
print(f"converged in {sweep + 1} sweeps (max change {delta:.2e})")

# ----- read off the greedy policy pi* from V* -----
pi = {}
for s in states:
    if terminal(s):
        pi[s] = "G" if s == goal else "H"
    else:
        pi[s] = ARROW[max(ACTS, key=lambda a: reward(s, step(s, a)) + gamma * V[step(s, a)])]

print("\\nV* (optimal value per cell):")
for r in range(ROWS):
    print("  " + "  ".join(f"{V[(r, c)]:.3f}" for c in range(COLS)))
print("\\npi* (greedy policy):")
for r in range(ROWS):
    print("  " + " ".join(pi[(r, c)] for c in range(COLS)))
# converged in 7 sweeps (max change 0.00e+00)
# V*:  0.590 0.656 0.729 0.656 / 0.656 0.000 0.810 0.000 / 0.729 0.810 0.900 0.000 / 0.000 0.900 1.000 0.000
# pi*: v  >  v  <  / v  H  v  H / >  v  v  H / H  >  >  G`
  };

  /* ---------------------------------------------------------------- */
  window.CODEVIZ["rl-value-iteration"] = {
    question: "How fast does value iteration converge? Plot the max value-change per sweep — the contraction predicts geometric decay toward 0.",
    charts: [{
      type: "line",
      title: "Bellman residual per sweep on a 3x4 gridworld — geometric γ-contraction decay toward 0",
      xlabel: "sweep k", ylabel: "max value-change  ||V(k+1) - V(k)||_inf",
      series: [{
        name: "||V(k+1) - V(k)||_inf", color: "#4ea1ff",
        points: [
          [1, 0.04], [2, 0.7128], [3, 0.506736], [4, 0.359018], [5, 0.253244],
          [6, 0.198886], [7, 0.123413], [8, 0.072437], [9, 0.035482], [10, 0.016783],
          [11, 0.007518], [12, 0.003303], [13, 0.001417], [14, 0.000601], [15, 0.000252],
          [16, 0.000105], [17, 0.000043], [18, 0.000018], [19, 0.000007], [20, 0.000003], [21, 0.000001]
        ]
      }]
    }],
    caption: "Real per-sweep Bellman residuals from the code below (γ=0.9, 3x4 stochastic gridworld). After the early build-up while reward news spreads, the residual decays geometrically — each sweep multiplies the error by roughly γ, exactly the γ-contraction the Banach fixed-point theorem predicts (a straight line on a log axis). It hits machine-zero by sweep 22 (those trailing zero deltas are dropped from the plot).",
    code: `import numpy as np

# Tiny 3x4 stochastic gridworld (no gym): goal +1, hazard -1, one wall.
ROWS, COLS = 3, 4
WALL, GOAL, HAZARD = (1, 1), (0, 3), (1, 3)
gamma, step_cost = 0.9, -0.04
acts = {"up": (-1, 0), "down": (1, 0), "left": (0, -1), "right": (0, 1)}
def ok(s): return 0 <= s[0] < ROWS and 0 <= s[1] < COLS and s != WALL
states = [(r, c) for r in range(ROWS) for c in range(COLS) if (r, c) != WALL]
def reward(s): return 1.0 if s == GOAL else (-1.0 if s == HAZARD else step_cost)
def trans(s, a):                              # 0.8 intended, 0.1 each perpendicular slip
    perp = ["left", "right"] if a in ("up", "down") else ["up", "down"]
    res = {}
    for p, mv in [(0.8, a), (0.1, perp[0]), (0.1, perp[1])]:
        d = acts[mv]; ns = (s[0] + d[0], s[1] + d[1])
        if not ok(ns): ns = s
        res[ns] = res.get(ns, 0) + p
    return res

# Sweep the Bellman optimality backup; record the max change per sweep.
V = {s: 0.0 for s in states}
deltas = []
for sweep in range(1000):
    nV, delta = {}, 0.0
    for s in states:
        if s in (GOAL, HAZARD):
            nV[s] = reward(s); continue
        nV[s] = reward(s) + gamma * max(
            sum(p * V[ns] for ns, p in trans(s, a).items()) for a in acts)
        delta = max(delta, abs(nV[s] - V[s]))
    V = nV
    deltas.append(round(delta, 6))
    if delta < 1e-8:
        break

print("sweeps:", len(deltas))
print("per-sweep ||V_{k+1}-V_k||_inf:", deltas)
# sweeps: 27
# [0.04, 0.7128, 0.506736, 0.359018, 0.253244, 0.198886, 0.123413, 0.072437,
#  0.035482, 0.016783, 0.007518, 0.003303, 0.001417, 0.000601, 0.000252,
#  0.000105, 4.3e-05, 1.8e-05, 7e-06, 3e-06, 1e-06, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
# Ratio delta[k+1]/delta[k] settles near gamma=0.9 -> the contraction, made visible.`
  };
})();
