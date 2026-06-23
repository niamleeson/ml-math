/* =====================================================================
   MODULE — Reinforcement Learning.
   Lesson: rl-policy-iteration — POLICY ITERATION, the dynamic-programming
   method that solves a KNOWN Markov Decision Process by alternating policy
   evaluation and greedy policy improvement until the policy stops changing.
   Self-contained: pushes one TECHNIQUE lesson into window.LESSONS, a real
   runnable-in-Colab NumPy implementation (window.CODE) on a small gridworld,
   and a reproducible NumPy convergence chart (window.CODEVIZ) whose numbers
   are the ACTUAL output of running the code.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "rl-policy-iteration",
    title: "Policy iteration",
    tagline: "Score a plan, then make it greedy; repeat until the plan stops changing.",
    module: "Reinforcement Learning",
    prereqs: ["ai-mdp", "ai-value-iteration", "prob-expectation"],

    whenToUse:
      `<p><b>Use policy iteration when you KNOW the model of a small Markov Decision Process (MDP)</b> &mdash; the transition probabilities $P$ and the rewards $R$ &mdash; and the set of states is small enough to sweep through directly.</p>
       <p>A <b>Markov Decision Process (MDP)</b> is the standard description of a control problem: states, actions, a rule $P$ for how actions move you between states, and a reward $R$ for each move. "Markov" means the next state depends only on the current state and action, not on the whole history.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Value iteration</b> (the sibling method) &mdash; when one full, exact policy score per round is worth more to you than many cheap approximate ones. Policy iteration usually converges in very few improvement steps; value iteration does more, lighter rounds. Both reach the same optimal policy $\\pi^*$.</li>
         <li><b>Just evaluating one fixed policy</b> &mdash; when you want the <i>best</i> plan, not the score of a plan you were handed. The greedy improvement step is what optimizes.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>You do <i>not</i> know $P$ or $R$ &mdash; that is the model-free setting; use Monte-Carlo control, SARSA, or Q-learning, which learn from sampled experience instead.</li>
         <li>The state space is huge or continuous &mdash; a full sweep over every state is impossible; use approximate dynamic programming or function approximation.</li>
       </ul>`,

    application:
      `<p>Policy iteration is the exact solver for small, fully-known control problems: robot grid navigation, inventory and queueing control, gambling and betting problems, and board-game endgames where the rules (hence $P$ and $R$) are known.</p>
       <p>Its real importance is conceptual: <b>evaluate-then-improve</b> is the backbone of <b>actor&ndash;critic</b> methods. The critic plays the evaluation role (it scores the current policy) and the actor plays the improvement role (it shifts the policy toward higher value). Deep reinforcement learning is, in large part, this same loop with neural-network function approximation in place of the exact sweeps.</p>`,

    pitfalls:
      `<ul>
         <li><b>It needs the model.</b> Every backup uses $P(s'\\mid s,a)$ and $R$ explicitly. Without them you cannot run a single step &mdash; this is a <i>model-based</i> method. If the model is unknown, learn it or switch to a model-free method.</li>
         <li><b>Full sweeps do not scale.</b> Each evaluation sweep costs $\\mathcal{O}(|\\mathcal{S}|^2|\\mathcal{A}|)$ for the iterative form (or solving a $|\\mathcal{S}|\\times|\\mathcal{S}|$ linear system). Large state spaces make every sweep infeasible.</li>
         <li><b>Evaluating to full convergence is wasteful.</b> You do not need the exact $V^\\pi$ before improving &mdash; a rough estimate already points the greedy step the right way. Truncating evaluation to a few sweeps gives <b>modified policy iteration</b>; truncating it to <i>one</i> sweep <i>is</i> value iteration.</li>
         <li><b>Ties in the improvement step.</b> When two actions have equal value, $\\arg\\max$ must break the tie the same way every round, or the policy can flip-flop between equal-value actions and never report "unchanged". Break ties deterministically (e.g. lowest action index) and the algorithm halts.</li>
         <li><b>Non-terminating policies under $\\gamma = 1$.</b> With no discounting, a policy that loops forever without reaching a terminal state has $V^\\pi = -\\infty$ and iterative evaluation never converges. Keep $\\gamma \\lt 1$, or guarantee every policy eventually reaches a terminal state, or cap the evaluation sweeps.</li>
       </ul>`,

    bigIdea:
      `<p>We want the best plan for a known world. Policy iteration finds it by alternating two moves until they agree.</p>
       <p><b>(1) Evaluate.</b> Take the current plan $\\pi$ and compute how good every state is <i>if you follow $\\pi$ forever</i>. Call this score $V^\\pi(s)$.</p>
       <p><b>(2) Improve.</b> In every state, look one step ahead with those scores and switch to whichever action looks best. That gives a new, greedier plan $\\pi'$.</p>
       <p>Repeat. The <b>policy-improvement theorem</b> guarantees $\\pi'$ is never worse than $\\pi$, and because there are only finitely many deterministic plans, the loop reaches the optimal plan $\\pi^*$ in a finite number of steps.</p>`,

    buildup:
      `<p>Recall from the MDP lesson that the value of a state under a fixed policy $\\pi$ is the expected total discounted reward you collect starting there and acting by $\\pi$ ever after. This obeys the <b>Bellman expectation equation</b>: a state's value equals the immediate reward plus the discounted value of where you land next, averaged over the policy's actions and the environment's transitions.</p>
       <p>That equation is the engine of step (1): turn it into an assignment and apply it over and over (the <b>expectation backup</b>) and the values settle onto $V^\\pi$. It is also a linear system in the unknowns $V^\\pi(s)$, so for small problems you can solve it directly instead of iterating.</p>
       <p>Step (2) uses the same one-step look-ahead but with a $\\max$ instead of an average over $\\pi$: act <i>greedily</i> with respect to the scores you just computed. The deep fact &mdash; proved below &mdash; is that greedy-with-respect-to-$V^\\pi$ is always an improvement.</p>`,

    symbols: [
      { sym: "$s,\\ s'$", desc: "a state and the next state. $\\mathcal{S}$ is the set of all states; $|\\mathcal{S}|$ is how many there are." },
      { sym: "$a$", desc: "an action; $\\mathcal{A}$ is the set of available actions." },
      { sym: "$\\pi(s)$", desc: "the policy: the action the current plan takes in state $s$. $\\pi'$ is the improved plan; $\\pi^*$ is the optimal plan." },
      { sym: "$P(s'\\mid s,a)$", desc: "the transition probability: the chance of landing in $s'$ after taking action $a$ in state $s$. Part of the known model." },
      { sym: "$R(s,a,s')$", desc: "the reward received for the transition $s \\to s'$ under action $a$. Also part of the known model." },
      { sym: "$\\gamma$", desc: "the discount factor, $0 \\le \\gamma \\le 1$. It shrinks future rewards: a reward $t$ steps away is worth $\\gamma^{t}$ times its face value." },
      { sym: "$V^\\pi(s)$", desc: "the state-value: the expected total discounted reward from state $s$ when you follow policy $\\pi$ forever." },
      { sym: "$Q^\\pi(s,a)$", desc: "the action-value: the expected total discounted reward from taking action $a$ in $s$ once, then following $\\pi$." },
      { sym: "$\\mathbb{E}$", desc: "expected value &mdash; a probability-weighted average over the random next states (and any randomness in $\\pi$)." },
      { sym: "$\\arg\\max_a$", desc: "the action $a$ that achieves the largest value (as opposed to $\\max_a$, which is the largest value itself)." },
      { sym: "$\\leftarrow$", desc: "assignment: 'compute the right-hand side and store it in the left-hand symbol'." }
    ],

    formula:
      `$$ \\text{(1) evaluate: } \\quad V^\\pi(s) \\leftarrow \\sum_{s'} P(s'\\mid s,\\pi(s))\\,\\big[\\,R(s,\\pi(s),s') + \\gamma\\, V^\\pi(s')\\,\\big] $$
       $$ \\text{(2) improve: } \\quad \\pi'(s) = \\arg\\max_{a}\\ \\sum_{s'} P(s'\\mid s,a)\\,\\big[\\,R(s,a,s') + \\gamma\\, V^\\pi(s')\\,\\big] $$`,

    whatItDoes:
      `<p><b>Equation (1)</b> is the <b>policy-evaluation backup</b>. Read it as: a state's value is the immediate reward plus the discounted value of the next state, averaged ($\\sum_{s'}P\\,[\\cdots]$) over where the policy's action $\\pi(s)$ might send you. Apply it to every state, over and over, and the values converge to $V^\\pi$. (For a small MDP you can instead solve it as a linear system in one shot.)</p>
       <p><b>Equation (2)</b> is the <b>policy-improvement step</b>. The bracketed quantity is exactly $Q^\\pi(s,a)$ &mdash; the value of trying action $a$ once and then reverting to $\\pi$. Picking the $\\arg\\max$ over $a$ sets $\\pi'(s)$ to the action that looks best under the current scores. That is "acting greedily with respect to $V^\\pi$".</p>
       <p>Alternate (1) and (2). When an improvement step changes no action, the policy is <b>stable</b> and equals $\\pi^*$; stop.</p>`,

    derivation:
      `<p><b>Why each step is no worse: the policy-improvement theorem.</b> Let $\\pi'$ be greedy with respect to $V^\\pi$. By construction of the $\\arg\\max$, taking $\\pi'(s)$ for one step and then following $\\pi$ is at least as good as following $\\pi$ from the start:</p>
       $$ Q^\\pi\\big(s,\\pi'(s)\\big)\\ \\ge\\ Q^\\pi\\big(s,\\pi(s)\\big)\\ =\\ V^\\pi(s) \\quad \\text{for every } s. $$
       <p>The equality holds because following $\\pi$'s own action is one of the options the $\\max$ considered, so the best option cannot be worse than it.</p>
       <p>Now unroll that one inequality forever. Apply it again at the next state, and again, peeling off one $\\pi'$ action at a time:</p>
       $$ V^\\pi(s)\\ \\le\\ Q^\\pi(s,\\pi'(s))\\ =\\ \\mathbb{E}\\big[\\,R + \\gamma\\,V^\\pi(s')\\,\\big]\\ \\le\\ \\mathbb{E}\\big[\\,R + \\gamma\\,Q^\\pi(s',\\pi'(s'))\\,\\big]\\ \\le\\ \\cdots\\ \\le\\ V^{\\pi'}(s). $$
       <p>Every inequality reuses $Q^\\pi(\\cdot,\\pi'(\\cdot)) \\ge V^\\pi(\\cdot)$; the discounted tail collapses to $V^{\\pi'}$, the value of actually following $\\pi'$ from now on. So</p>
       $$ Q^\\pi(s,\\pi'(s)) \\ge V^\\pi(s)\\quad \\Rightarrow\\quad V^{\\pi'}(s) \\ge V^\\pi(s)\\ \\text{ for all } s. $$
       <p><b>Why it terminates at $\\pi^*$.</b> Each improvement either strictly raises the value of some state or changes nothing. There are only finitely many deterministic policies (finite states $\\times$ finite actions), and values never decrease, so the process cannot cycle and must stop after finitely many steps. When it stops, no action change helped, which means the greedy policy already equals the current one. That fixed-point condition is the <b>Bellman optimality equation</b> $V(s) = \\max_a \\sum_{s'} P\\,[R + \\gamma V(s')]$ &mdash; satisfied only by $V^*$ &mdash; so the stable policy is the optimal $\\pi^*$.</p>`,

    example:
      `<p>A 3-state chain: states $L \\to M \\to G$, where $G$ is a terminal goal worth nothing further. Two actions, <code>left</code> and <code>right</code>, are deterministic; every step that does not enter $G$ costs $R = -1$; entering $G$ costs $-1$ on that final move; $\\gamma = 1$. Start with the bad plan $\\pi = $ "always <code>left</code>".</p>
       <ul class="steps">
         <li><b>Evaluate $\\pi$ (always left).</b> From $M$, left $\\to L$; from $L$, left stays at $L$. Following this plan you never reach $G$, so $V^\\pi(L) = V^\\pi(M) = -\\infty$ &mdash; the bad plan loops forever. (This is the $\\gamma = 1$ non-termination pitfall; in code we cap the sweeps.)</li>
         <li><b>Improve.</b> Look one step ahead with these scores. In $M$: <code>right</code> $\\to G$ gives $Q(M,\\text{right}) = -1 + 1\\cdot 0 = -1$, far better than looping left. So $\\pi'(M) = \\text{right}$. In $L$: <code>right</code> $\\to M$ gives $Q(L,\\text{right}) = -1 + 1\\cdot V(M)$, better than staying. So $\\pi'(L) = \\text{right}$. Two actions changed.</li>
         <li><b>Evaluate $\\pi'$ (always right).</b> Now $L \\to M \\to G$. $V^{\\pi'}(M) = -1$ (one step to $G$); $V^{\\pi'}(L) = -1 + V^{\\pi'}(M) = -2$. Finite, and $\\ge$ the old scores, exactly as the theorem promised.</li>
         <li><b>Improve again.</b> Greedy with respect to these values picks <code>right</code> everywhere &mdash; no action changes. The policy is stable, so $\\pi' = \\pi^*$. Done in two improvement steps.</li>
       </ul>
       <p>The CODE below runs the same loop on a 4&times;4 gridworld; the CODEVIZ chart plots how many states change action each improvement step &mdash; dropping to $0$ marks convergence.</p>`,

    practice: [
      {
        q: `Under policy $\\pi$, state $s$ has $V^\\pi(s) = 4$. A one-step look-ahead gives action-values $Q^\\pi(s,\\text{up}) = 4$, $Q^\\pi(s,\\text{down}) = 7$, $Q^\\pi(s,\\text{stay}) = 1$. What does the improvement step set $\\pi'(s)$ to, and what does the policy-improvement theorem promise?`,
        steps: [
          { do: `Compute $\\arg\\max_a Q^\\pi(s,a) = \\arg\\max(4,7,1)$.`, why: `The improvement step picks the action with the highest one-step look-ahead value.` },
          { do: `Compare the best $Q$, which is $7$, against $V^\\pi(s) = 4$.`, why: `The theorem's premise is $Q^\\pi(s,\\pi'(s)) \\ge V^\\pi(s)$; here $7 \\ge 4$.` }
        ],
        answer: `$\\pi'(s) = \\text{down}$ (the $\\arg\\max$). Since $Q^\\pi(s,\\text{down}) = 7 \\ge 4 = V^\\pi(s)$, the policy-improvement theorem guarantees $V^{\\pi'} \\ge V^\\pi$ at every state &mdash; the new plan is no worse anywhere, and strictly better at $s$.`
      },
      {
        q: `You run an improvement step and not a single state's action changes. What do you conclude, and why is it safe to stop?`,
        steps: [
          { do: `Note that "greedy with respect to $V^\\pi$ equals $\\pi$ itself".`, why: `No action changed means the $\\arg\\max$ already agreed with the current policy in every state.` },
          { do: `Write down what that fixed point says: $V^\\pi(s) = \\max_a \\sum_{s'} P\\,[R + \\gamma V^\\pi(s')]$.`, why: `Greedy-equals-current means the value already satisfies the Bellman OPTIMALITY equation, not just the expectation equation.` }
        ],
        answer: `The policy is <b>stable</b>: it already satisfies the Bellman optimality equation, whose only solution is $V^*$. So the current policy is $\\pi^*$ and you stop. (This is also why ties must be broken deterministically &mdash; otherwise the $\\arg\\max$ could "change" between equal-value actions and the stable condition would never register.)`
      },
      {
        q: `Policy iteration evaluates each policy to full convergence before improving. Name a cheaper variant and the extreme case where it becomes value iteration.`,
        steps: [
          { do: `Recall that the greedy improvement only needs an APPROXIMATE $V^\\pi$ to point the right way.`, why: `Exact evaluation is wasteful (a listed pitfall); a few sweeps usually suffice to get the $\\arg\\max$ right.` },
          { do: `Consider truncating evaluation to a fixed number $k$ of sweeps, then to $k=1$.`, why: `Truncated evaluation interpolates between policy iteration ($k=\\infty$) and value iteration ($k=1$).` }
        ],
        answer: `<b>Modified policy iteration</b>: run only $k$ evaluation sweeps before each improvement instead of iterating to convergence. As $k \\to 1$ &mdash; one evaluation sweep then an improvement &mdash; the combined update becomes $V(s) \\leftarrow \\max_a \\sum_{s'} P\\,[R + \\gamma V(s')]$, which is exactly the <b>value-iteration</b> backup. So value iteration is the extreme, fully-truncated case of policy iteration.`
      }
    ]
  });

  window.CODE["rl-policy-iteration"] = {
    lib: "Python + NumPy",
    runnable: false,
    explain: `<p>Policy iteration on a 4&times;4 gridworld (the classic Sutton &amp; Barto layout): the two opposite corners are terminal, every move costs $-1$, $\\gamma = 1$. We do <b>iterative policy evaluation</b> to a tolerance, then a <b>greedy improvement</b>, and loop until the policy stops changing &mdash; printing the optimal policy and $V$. The in-browser engine has no reinforcement-learning libraries; this runs as-is in <b>Colab</b> with only NumPy (<code>!pip install numpy</code>, already present).</p>`,
    code: `import numpy as np

# 4x4 gridworld. States 0..15 row-major. Corners 0 and 15 are terminal.
# Every move costs -1; gamma = 1. Actions: 0=up, 1=down, 2=left, 3=right.
N, A = 4, 4
TERMINAL = {0, 15}
MOVE = {0: (-1, 0), 1: (1, 0), 2: (0, -1), 3: (0, 1)}
ARROW = {0: "up", 1: "down", 2: "left", 3: "right"}
gamma = 1.0

def next_state(s, a):
    if s in TERMINAL:
        return s
    r, c = divmod(s, N)
    dr, dc = MOVE[a]
    nr, nc = r + dr, c + dc
    if 0 <= nr < N and 0 <= nc < N:      # stay put if the move hits a wall
        return nr * N + nc
    return s

def policy_eval(policy, tol=1e-4, max_sweeps=1000):
    """Iterative policy evaluation: apply the Bellman EXPECTATION backup
       V(s) <- R + gamma * V(s') until the largest change drops below tol."""
    V = np.zeros(N * N)
    for _ in range(max_sweeps):
        delta = 0.0
        for s in range(N * N):
            if s in TERMINAL:
                continue
            s2 = next_state(s, policy[s])
            v_new = -1.0 + gamma * V[s2]   # deterministic move, reward -1
            delta = max(delta, abs(v_new - V[s]))
            V[s] = v_new
        if delta < tol:
            break
    return V

def greedy_improve(V):
    """Policy IMPROVEMENT: pi'(s) = argmax_a [ R + gamma V(s') ].
       Ties broken by lowest action index (np.argmax) so the loop terminates."""
    policy = np.zeros(N * N, dtype=int)
    for s in range(N * N):
        if s in TERMINAL:
            continue
        q = [-1.0 + gamma * V[next_state(s, a)] for a in range(A)]
        policy[s] = int(np.argmax(q))
    return policy

# Start from an arbitrary policy (always 'up') and alternate the two steps.
policy = np.zeros(N * N, dtype=int)
for step in range(50):
    V = policy_eval(policy)                # (1) evaluate current policy
    new_policy = greedy_improve(V)         # (2) improve greedily
    changed = int(np.sum(new_policy != policy))
    print(f"improvement step {step}: {changed} states changed action")
    if changed == 0:                       # policy stable => optimal
        break
    policy = new_policy

print("\\noptimal value V* (4x4 grid):")
print(np.round(V.reshape(N, N), 1))
print("\\noptimal policy pi* (4x4 grid):")
grid = np.array([("term" if s in TERMINAL else ARROW[policy[s]])
                 for s in range(N * N)]).reshape(N, N)
print(grid)`
  };

  window.CODEVIZ["rl-policy-iteration"] = {
    question: "On the classic 4x4 gridworld, how fast does policy iteration lock in the optimal policy?",
    charts: [{
      type: "line",
      title: "States that change action per improvement step (0 = policy stable = converged)",
      xlabel: "improvement step",
      ylabel: "number of states whose greedy action changed",
      series: [
        { name: "policy iteration (4x4 gridworld)", color: "#7ee787",
          points: [[0, 6], [1, 7], [2, 2], [3, 0]] }
      ]
    }],
    caption: "A reproducible NumPy run on the Sutton & Barto 4x4 gridworld (corners terminal, step cost -1, gamma=1), started from the bad 'always up' policy. The first greedy improvement flips 6 states, the next 7, then 2, then 0 — four improvement steps and the policy is stable, i.e. optimal. The drop to 0 is the convergence signal: greedy-with-respect-to-V now equals the current policy, so it satisfies the Bellman optimality equation. The recovered V* is the negated shortest-path distance to the nearest corner, exactly as policy iteration guarantees.",
    code: `import numpy as np

# 4x4 gridworld: corners 0 and 15 terminal, every move costs -1, gamma = 1.
N, A = 4, 4
TERMINAL = {0, 15}
MOVE = {0: (-1, 0), 1: (1, 0), 2: (0, -1), 3: (0, 1)}   # up, down, left, right
gamma = 1.0

def next_state(s, a):
    if s in TERMINAL:
        return s
    r, c = divmod(s, N)
    dr, dc = MOVE[a]
    nr, nc = r + dr, c + dc
    return nr * N + nc if (0 <= nr < N and 0 <= nc < N) else s

def policy_eval(policy, tol=1e-4, max_sweeps=1000):
    V = np.zeros(N * N)
    for _ in range(max_sweeps):
        delta = 0.0
        for s in range(N * N):
            if s in TERMINAL:
                continue
            v = -1.0 + gamma * V[next_state(s, policy[s])]
            delta = max(delta, abs(v - V[s]))
            V[s] = v
        if delta < tol:
            break
    return V

policy = np.zeros(N * N, dtype=int)       # arbitrary start: 'always up'
changes = []
for _ in range(50):
    V = policy_eval(policy)
    new_policy = np.array([
        int(np.argmax([-1.0 + gamma * V[next_state(s, a)] for a in range(A)]))
        if s not in TERMINAL else 0
        for s in range(N * N)
    ])
    changed = int(np.sum(new_policy != policy))
    changes.append(changed)
    if changed == 0:
        break
    policy = new_policy

print("states changed per improvement step:", changes)  # [6, 7, 2, 0]
print("optimal V*:\\n", np.round(V.reshape(N, N), 1))`
  };
})();
