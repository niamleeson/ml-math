(function () {
  window.LESSONS.push({
    id: "rl-bellman-optimality",
    title: "Bellman optimality: $V^*$, $Q^*$, and the greedy policy",
    tagline: "The best a state can ever be worth — and the one equation every control algorithm is trying to solve.",
    module: "Reinforcement Learning",
    prereqs: ["ai-mdp", "ai-value-iteration", "ai-q-learning", "prob-expectation"],
    whenToUse:
      `<p><b>This lesson is about the GOAL of control, not a single algorithm.</b> The optimal value functions $V^*$ and $Q^*$ are the target that value iteration [ai-value-iteration], Q-learning [ai-q-learning], and even DQN (Deep Q-Network) [mod-dqn] all chase. Once you have $Q^*$, the MDP (Markov Decision Process) [ai-mdp] is solved — you just act greedily.</p>
       <p><b>Reach for the optimality view when:</b></p>
       <ul>
         <li>You want the <i>best possible</i> behaviour, not the value of some fixed policy. The previous step — policy evaluation — uses an average over actions $\\sum_a \\pi(a\\mid s)$; optimality replaces that average with a <b>$\\max$ over actions</b>. That single change is the whole story.</li>
         <li>You are deriving <i>why</i> a learning rule converges. Q-learning's update target $R + \\gamma\\max_{a'}Q(s',a')$ is literally the right-hand side of the Bellman optimality equation for $Q^*$.</li>
       </ul>
       <p><b>Use the expectation form (policy evaluation) instead when</b> the policy is fixed and you only want to know what it is worth — there is no $\\max$, the equations are linear, and you can solve them directly.</p>`,
    application:
      `<p>$Q^*$ and $V^*$ are the silent target behind almost all of control:</p>
       <ul>
         <li><b>Board games and Atari.</b> DQN [mod-dqn] trains a neural net to approximate $Q^*(s,a)$, then plays $\\arg\\max_a Q^*(s,a)$.</li>
         <li><b>Robotics and operations.</b> Value iteration computes $V^*$ exactly on a known model for navigation, inventory, and scheduling.</li>
         <li><b>Anywhere a critic is learned.</b> Actor-critic [mod-actor-critic] methods estimate values to reduce the variance of a policy gradient [mod-policy-gradient]; the critic is approximating an optimality-style backup.</li>
       </ul>`,
    pitfalls:
      `<ul>
         <li><b>The $\\max$ makes it non-linear, so there is no direct linear solve.</b> Policy evaluation gives a linear system $V = R + \\gamma P V$ you can solve in one shot. Replace $\\sum_a\\pi$ with $\\max_a$ and that linearity is gone — the $\\max$ is a kink. <b>Fix:</b> iterate (value iteration, Q-learning); the Bellman optimality operator is a $\\gamma$-contraction, so iteration converges to the unique fixed point.</li>
         <li><b>Ties in $\\arg\\max$.</b> When two actions have (near-)equal $Q^*$, the greedy policy flickers and floating-point noise picks the "winner". <b>Fix:</b> break ties deterministically, or accept that any of the tied actions is genuinely optimal.</li>
         <li><b>Optimality is per-MDP.</b> $V^*$, $Q^*$, and $\\pi^*$ change the moment you change the reward, the discount $\\gamma$, or the transitions. A policy optimal for $\\gamma=0.9$ can be wrong for $\\gamma=0.99$. <b>Fix:</b> re-solve when the problem changes; never reuse a value table across different rewards.</li>
         <li><b>Off-by-one in the backup.</b> The reward and the discounted next-state value must come from the SAME transition $s \\xrightarrow{a} s'$. Mixing $R(s)$ with $V^*(s)$ instead of $V^*(s')$, or forgetting the $\\gamma$, silently corrupts the fixed point. <b>Fix:</b> write the backup as $R + \\gamma V^*(s')$ over successors $s'$ and check it on a 2-state MDP by hand.</li>
         <li><b>Confusing $V^*$ with $V^\\pi$.</b> $V^\\pi$ is the value of <i>one</i> policy; $V^*$ is the best over <i>all</i> policies. They coincide only when $\\pi$ is already optimal.</li>
       </ul>`,
    bigIdea:
      `<p>Every state has a ceiling: the most discounted future reward you could ever collect starting there, if you played perfectly. That ceiling is the <b>optimal state value</b> $V^*(s)$. The matching quantity for a state-action pair — "commit to action $a$ now, then play perfectly" — is the <b>optimal action value</b> $Q^*(s,a)$.</p>
       <p>The whole point: if you knew $Q^*$, you would not need to plan at all. In any state you would just look at $Q^*(s,\\cdot)$ and take the action with the largest value. That is the central result of this lesson — <b>a policy that is greedy with respect to $Q^*$ is optimal</b>. Finding $Q^*$ <i>is</i> solving the MDP.</p>
       <p>One small change separates this from the previous lesson. Policy evaluation averages over the actions a fixed policy would take, $\\sum_a \\pi(a\\mid s)\\,(\\dots)$. Optimality instead takes the <b>best</b> action, $\\max_a(\\dots)$. That lone $\\max$ is exactly why we can no longer solve the equations directly and must iterate.</p>`,
    buildup:
      `<p>Build the two optimal functions from their definitions.</p>
       <ol>
         <li><b>Optimal state value.</b> $V^*(s) = \\max_\\pi V^\\pi(s)$ — over <i>all</i> policies $\\pi$, the best value any of them gives state $s$. A deep theorem of MDPs says one single policy $\\pi^*$ achieves this maximum in <i>every</i> state at once, so $V^*$ is well defined.</li>
         <li><b>Optimal action value.</b> $Q^*(s,a) = \\max_\\pi Q^\\pi(s,a)$: take action $a$ now, then follow the best policy after. The link between them is $V^*(s) = \\max_a Q^*(s,a)$ — the best state value is the best action's value.</li>
         <li><b>Self-consistency (the Bellman optimality equation).</b> $V^*$ must agree with itself one step later: the value of acting optimally now equals the immediate reward plus $\\gamma$ times the optimal value of where you land — maximised over the first action. Writing that out gives the two equations below.</li>
         <li><b>Greedy extraction.</b> Once $Q^*$ is known, the optimal policy reads straight off it: $\\pi^*(s) = \\arg\\max_a Q^*(s,a)$. No averaging, no planning — just pick the best action.</li>
       </ol>`,
    symbols: [
      { sym: "$s,\\,s'$", desc: "the current state and the next state (where you land after acting)." },
      { sym: "$a,\\,a'$", desc: "the action taken now ($a$) and an action available in the next state ($a'$)." },
      { sym: "$\\pi$", desc: "a policy: a rule for choosing actions. $\\pi(a\\mid s)$ is the probability it picks $a$ in $s$." },
      { sym: "$V^\\pi(s)$", desc: "the value of state $s$ UNDER policy $\\pi$: expected discounted return if you start in $s$ and follow $\\pi$." },
      { sym: "$V^*(s) = \\max_\\pi V^\\pi(s)$", desc: "the OPTIMAL state value: the best value any policy can give state $s$. The star means 'optimal'." },
      { sym: "$Q^*(s,a) = \\max_\\pi Q^\\pi(s,a)$", desc: "the OPTIMAL action value: take action $a$ in $s$, then act optimally forever after." },
      { sym: "$P(s'\\mid s,a)$", desc: "the transition probability: the chance of landing in $s'$ after taking $a$ in $s$." },
      { sym: "$R$", desc: "the immediate reward for the transition $s \\xrightarrow{a} s'$ (write $R(s,a,s')$ when the source matters)." },
      { sym: "$\\gamma \\in [0,1)$", desc: "the discount factor: how much a reward one step later is worth now. Smaller $\\gamma$ = more short-sighted." },
      { sym: "$\\max_a$", desc: "'the largest value over all actions $a$'. This is the operator that makes the equation non-linear." },
      { sym: "$\\arg\\max_a$", desc: "the ACTION $a$ that achieves that largest value (the best action itself, not its number)." },
      { sym: "$\\pi^*(s) = \\arg\\max_a Q^*(s,a)$", desc: "the optimal policy: in state $s$, take the action with the largest $Q^*$." }
    ],
    formula: `$$ V^*(s) = \\max_a \\sum_{s'} P(s'\\mid s,a)\\,\\big[\\,R + \\gamma\\,V^*(s')\\,\\big] $$
              $$ Q^*(s,a) = \\sum_{s'} P(s'\\mid s,a)\\,\\big[\\,R + \\gamma\\,\\max_{a'} Q^*(s',a')\\,\\big] \\qquad \\pi^*(s) = \\arg\\max_a Q^*(s,a) $$`,
    whatItDoes:
      `<p>Read both equations as "best immediate action, then keep acting optimally".</p>
       <ul>
         <li><b>State form.</b> $V^*(s)$ tries every first action $a$, computes the expected reward-plus-discounted-future under that action ($\\sum_{s'} P[R + \\gamma V^*(s')]$), and keeps the <b>best</b> one via $\\max_a$.</li>
         <li><b>Action form.</b> $Q^*(s,a)$ has already committed to $a$, so there is no outer $\\max$ over the first action. The $\\max$ moves <i>inside</i>, onto the next state: $\\max_{a'} Q^*(s',a')$, which is just $V^*(s')$. So $Q^*(s,a) = \\sum_{s'} P(s'\\mid s,a)[R + \\gamma V^*(s')]$ — the two equations are the same statement viewed from a state vs. a state-action pair.</li>
         <li><b>Greedy policy.</b> $\\pi^*(s) = \\arg\\max_a Q^*(s,a)$ turns the values into behaviour. This is why $Q^*$ "solves" the MDP: it carries both the value AND the plan.</li>
       </ul>
       <p><b>Contrast with policy evaluation.</b> There the equation was $V^\\pi(s) = \\sum_a \\pi(a\\mid s)\\sum_{s'} P[R + \\gamma V^\\pi(s')]$ — an <i>average</i> over actions ($\\sum_a\\pi$), which is linear in $V^\\pi$. Optimality swaps that average for a $\\max_a$. The $\\max$ is a non-linear kink, and that is the entire reason we lose the closed-form solve.</p>`,
    derivation:
      `<p><b>Why the greedy policy is optimal, and why we must iterate.</b></p>
       <p><i>Step 1 — the optimality equation is forced.</i> Start from $V^*(s) = \\max_\\pi V^\\pi(s)$. Acting optimally from $s$ means: pick some first action $a$, collect the expected reward, and then act optimally from wherever you land (value $V^*(s')$). Among all first actions you pick the best, so</p>
       $$ V^*(s) = \\max_a \\sum_{s'} P(s'\\mid s,a)\\,\\big[\\,R + \\gamma\\,V^*(s')\\,\\big]. $$
       <p>No averaging over actions appears, because an optimal agent is not hedging — it commits to the single best first action. That is the difference from $V^\\pi$, which averages with the weights $\\pi(a\\mid s)$.</p>
       <p><i>Step 2 — greedy w.r.t. $Q^*$ is optimal.</i> Define the greedy policy $\\pi^*(s) = \\arg\\max_a Q^*(s,a)$. By construction its one-step value equals $\\max_a Q^*(s,a) = V^*(s)$, which is the best any policy can do. Since $V^*$ is the ceiling and $\\pi^*$ reaches it everywhere, $\\pi^*$ is optimal. So knowing $Q^*$ hands you the optimal policy for free — that is the headline result.</p>
       <p><i>Step 3 — why iteration, not a linear solve.</i> Write the right-hand side as an operator $\\mathcal{T}^*$ acting on a value table: $(\\mathcal{T}^* V)(s) = \\max_a \\sum_{s'} P[R + \\gamma V(s')]$. Two facts:</p>
       <ul>
         <li>$V^*$ is the unique <b>fixed point</b>: $\\mathcal{T}^* V^* = V^*$. That is exactly the optimality equation.</li>
         <li>$\\mathcal{T}^*$ is a <b>$\\gamma$-contraction</b> in the max-norm: $\\lVert \\mathcal{T}^* U - \\mathcal{T}^* W \\rVert_\\infty \\le \\gamma \\lVert U - W \\rVert_\\infty$. (The key step uses $\\lvert \\max_a f(a) - \\max_a g(a)\\rvert \\le \\max_a \\lvert f(a)-g(a)\\rvert$.)</li>
       </ul>
       <p>By the Banach fixed-point theorem, repeatedly applying $\\mathcal{T}^*$ from <i>any</i> start converges geometrically to $V^*$ — that is precisely <b>value iteration</b> [ai-value-iteration]. But because $\\mathcal{T}^*$ contains a $\\max$, it is <b>not</b> a linear map, so unlike policy evaluation ($V = R + \\gamma P V$, solvable as $V = (I - \\gamma P)^{-1} R$) there is no matrix inverse that gives $V^*$ in one shot. The non-linearity is the price of optimality.</p>`,
    example:
      `<p>A 2-action backup, by hand, with $\\gamma = 0.9$. State $s$ has two actions; suppose the optimal next-state values are already known: $V^*(s_{\\text{goal}}) = 10$ and $V^*(s_{\\text{empty}}) = 0$. The step reward is $R = -1$ unless noted. Transitions are deterministic here.</p>
       <ul class="steps">
         <li><b>Action "right"</b> goes to the goal: $Q^*(s,\\text{right}) = -1 + 0.9 \\times 10 = 8.0$.</li>
         <li><b>Action "left"</b> goes to an empty cell: $Q^*(s,\\text{left}) = -1 + 0.9 \\times 0 = -1.0$.</li>
         <li><b>Optimal state value:</b> $V^*(s) = \\max(8.0,\\,-1.0) = 8.0$ — the $\\max$ keeps the better action.</li>
         <li><b>Optimal action:</b> $\\pi^*(s) = \\arg\\max(8.0,\\,-1.0) = \\text{right}$.</li>
         <li><b>Stochastic twist.</b> Say "right" is slippery: $0.8$ to the goal, $0.2$ to the empty cell. Then $Q^*(s,\\text{right}) = -1 + 0.9\\,[0.8\\times10 + 0.2\\times0] = -1 + 0.9\\times8 = 6.2$. Still the best, but the slip lowered its value. The reward and next value always come from the SAME transition — that is the off-by-one guard.</li>
       </ul>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340") };
      }
      // V*(s) = max_a Q*(s,a). Slide two Q-values; the max (optimality) wins.
      var st = { qa: 8.0, qb: 3.0 };
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 220; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, 640, 220);
        var qs = [st.qa, st.qb];
        var names = ["Q*(s, action A)", "Q*(s, action B)"];
        var best = qs[0] >= qs[1] ? 0 : 1;
        var lo = -2, hi = 12, base = 170, h = 130;
        function bh(v) { return (v - lo) / (hi - lo) * h; }
        var x0 = 80, w = 160, gap = 90;
        ctx.font = "12px sans-serif"; ctx.textBaseline = "alphabetic";
        for (var i = 0; i < 2; i++) {
          ctx.fillStyle = i === best ? c.accent2 : c.dim;
          ctx.fillRect(x0 + i * (w + gap), base - bh(qs[i]), w, bh(qs[i]));
          ctx.fillStyle = c.ink; ctx.textAlign = "center";
          ctx.fillText(qs[i].toFixed(2), x0 + i * (w + gap) + w / 2, base - bh(qs[i]) - 6);
          ctx.fillStyle = c.dim;
          ctx.fillText(names[i], x0 + i * (w + gap) + w / 2, base + 18);
        }
        ctx.strokeStyle = c.border; ctx.beginPath(); ctx.moveTo(40, base); ctx.lineTo(620, base); ctx.stroke();
        ctx.fillStyle = c.ink; ctx.textAlign = "start"; ctx.font = "13px sans-serif";
        ctx.fillText("V*(s) = max over actions of Q*(s,a)  —  greedy picks the green bar", 40, 28);
        return best;
      }
      function slider(label, key) {
        var row = document.createElement("div"); row.style.margin = "6px 0";
        var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label;
        var inp = document.createElement("input"); inp.type = "range"; inp.min = -2; inp.max = 12; inp.step = 0.1; inp.value = st[key];
        inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); render(); });
        row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
      }
      slider("Q*(s, action A)", "qa");
      slider("Q*(s, action B)", "qb");
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function render() {
        var best = draw();
        var v = Math.max(st.qa, st.qb);
        var tie = Math.abs(st.qa - st.qb) < 1e-9;
        rd.innerHTML = "V*(s) = max(" + st.qa.toFixed(2) + ", " + st.qb.toFixed(2) + ") = <b>" + v.toFixed(2) +
          "</b>. &pi;*(s) = arg max = <b>" + (tie ? "tie (either is optimal)" : "action " + (best === 0 ? "A" : "B")) +
          "</b>. Slide the two Q-values together to make a tie — the greedy choice becomes ambiguous, exactly the arg-max pitfall.";
      }
      render();
    },
    practice: [
      {
        q: `A state $s$ has two actions. Action $a_1$ is deterministic to a state with $V^*=5$; action $a_2$ goes with probability $0.5$ to a state with $V^*=12$ and probability $0.5$ to a state with $V^*=0$. Every transition gives reward $R=1$ and $\\gamma=0.9$. Find $Q^*(s,a_1)$, $Q^*(s,a_2)$, $V^*(s)$, and $\\pi^*(s)$.`,
        steps: [
          { do: `Compute $Q^*(s,a_1) = R + \\gamma V^*(\\text{next}) = 1 + 0.9\\times 5$.`, why: `$a_1$ is deterministic, so the expectation over $s'$ is a single term.` },
          { do: `Compute $Q^*(s,a_2) = R + \\gamma\\,[0.5\\times 12 + 0.5\\times 0]$.`, why: `$a_2$ is stochastic, so average the next-state values with the transition probabilities $P(s'\\mid s,a_2)$.` },
          { do: `Take $V^*(s) = \\max(Q^*(s,a_1), Q^*(s,a_2))$ and $\\pi^*(s) = \\arg\\max$.`, why: `The Bellman optimality equation keeps the best action's value; the policy is the action achieving it.` }
        ],
        answer: `<p>$Q^*(s,a_1) = 1 + 0.9\\times 5 = 5.5$. $Q^*(s,a_2) = 1 + 0.9\\times(0.5\\times12 + 0.5\\times0) = 1 + 0.9\\times 6 = 6.4$. So $V^*(s) = \\max(5.5, 6.4) = 6.4$ and $\\pi^*(s) = a_2$. The risky action wins because its <i>expected</i> next value ($6$) beats the safe $5$, even though it sometimes lands on the $0$ state.</p>`
      },
      {
        q: `In one sentence each: why can policy evaluation be solved by a single linear solve $V = (I-\\gamma P)^{-1}R$, while the Bellman OPTIMALITY equation cannot — and what do we do instead?`,
        steps: [
          { do: `Look at the operator in each case: $\\sum_a \\pi(a\\mid s)(\\dots)$ for evaluation vs. $\\max_a(\\dots)$ for optimality.`, why: `The form of the action aggregation decides linearity.` },
          { do: `Note that $\\sum_a\\pi$ is a weighted sum (linear in $V$) but $\\max_a$ is not.`, why: `A $\\max$ has kinks; it is not a linear map, so no matrix inverse expresses the fixed point.` }
        ],
        answer: `<p>Policy evaluation averages over actions with fixed weights $\\pi(a\\mid s)$, which is <b>linear</b> in $V$, so the fixed point $V = R + \\gamma P V$ rearranges to the closed-form solve $V = (I-\\gamma P)^{-1}R$. The optimality equation replaces that average with $\\max_a$, which is <b>non-linear</b> (a kink), so no single matrix inverse gives $V^*$. Instead we <b>iterate</b> the Bellman optimality operator $\\mathcal{T}^*$ — value iteration — which is a $\\gamma$-contraction and converges geometrically to the unique fixed point $V^*$.</p>`
      }
    ]
  });

  window.CODE["rl-bellman-optimality"] = {
    lib: "numpy",
    runnable: false, // tabular numpy; runs in Colab (no gym/torch needed) — just `import numpy`
    explain: `<p>We build a tiny 3-state MDP (Markov Decision Process) with transition tensor
      $P(s'\\mid s,a)$ and reward tensor $R$, solve for $Q^*$ by value iteration, then <b>verify</b> the
      Bellman OPTIMALITY equation $Q^*(s,a) = \\sum_{s'} P[R + \\gamma\\max_{a'}Q^*(s',a')]$ holds to
      machine precision, and finally read off the greedy optimal policy $\\pi^*(s)=\\arg\\max_a Q^*(s,a)$.
      This is the exact backup that Q-learning [ai-q-learning] and DQN (Deep Q-Network) [mod-dqn]
      approximate from sampled experience. Runs in Colab with only numpy.</p>`,
    code: `import numpy as np

# Tiny MDP: 3 states (s0, s1, GOAL=2), 2 actions (0 = "back", 1 = "advance").
# advance: s0 -> s1 -> GOAL (absorbing). Reward +1 only when entering GOAL. gamma = 0.9.
nS, nA, GOAL, gamma = 3, 2, 2, 0.9

P = np.zeros((nS, nA, nS))          # P[s, a, s'] = transition probability
P[0, 0, 0] = 1.0                    # s0, back   -> s0
P[0, 1, 1] = 1.0                    # s0, advance-> s1
P[1, 0, 0] = 1.0                    # s1, back   -> s0
P[1, 1, 2] = 1.0                    # s1, advance-> GOAL
P[2, 0, 2] = P[2, 1, 2] = 1.0       # GOAL is absorbing

R = np.zeros((nS, nA, nS))          # R[s, a, s'] = reward on that transition
R[1, 1, 2] = 1.0                    # +1 for reaching GOAL

# --- solve for Q* by value iteration: Q*(s,a) = sum_s' P[R + gamma * max_a' Q*(s',a')] ---
Q = np.zeros((nS, nA))
for _ in range(500):
    V = Q.max(axis=1)                               # V*(s') = max_a' Q*(s',a')
    Q_new = np.einsum("sap,sap->sa", P, R + gamma * V[None, None, :])
    if np.max(np.abs(Q_new - Q)) < 1e-12:
        break
    Q = Q_new

np.set_printoptions(precision=4, suppress=True)
print("Q* =\\n", Q)                                 # [[0.81 0.9 ] [0.81 1.  ] [0.  0. ]]
print("V* = max_a Q* =", Q.max(axis=1))             # [0.9 1.  0. ]

# --- VERIFY the Bellman optimality equation: known Q* must satisfy it exactly ---
Vstar = Q.max(axis=1)
rhs = np.einsum("sap,sap->sa", P, R + gamma * Vstar[None, None, :])
print("max |Q* - RHS| =", np.max(np.abs(Q - rhs)))  # 0.0  -> the equation holds

# --- extract the greedy optimal policy pi*(s) = argmax_a Q*(s,a) ---
pi = Q.argmax(axis=1)
print("pi*(s) =", pi)                               # [1 1 0] -> advance, advance, (GOAL: either)`
  };

  window.CODEVIZ["rl-bellman-optimality"] = {
    question: "How do you READ a V*(s) value-map? The converged one shows a smooth gradient rising to the +1 goal — but the same heatmap also tells you when iteration has NOT finished, when the discount gamma is set wrong, and when an off-by-one bug has corrupted the backup. Learn the four pictures.",
    charts: [
      {
        type: "heatmap",
        title: "CONVERGED: V*(s) is a smooth gradient rising to the +1 goal (real, 30 sweeps)",
        rows: ["row 0", "row 1", "row 2"],
        cols: ["col 0", "col 1", "col 2", "col 3"],
        matrix: [
          [0.509, 0.65, 0.795, 1.0],
          [0.399, null, 0.486, -1.0],
          [0.296, 0.254, 0.345, 0.13]
        ],
        showVals: true,
        interpret: "<b>Each cell is its optimal value V*(s); blank = wall.</b> Real value iteration to convergence (intended move 0.8, perpendicular slip 0.1, step cost -0.04, gamma 0.9). <b>Read it:</b> values rise smoothly toward the +1 goal at top-right (0,3) and dip toward the -1 hazard at (1,3) — a clean monotone gradient with no flat patches is the signature of a solved MDP. The greedy policy pi*(s)=argmax_a Q* points uphill: every arrow flows up-and-right toward the goal, and (2,3) points LEFT, backing away from the hazard column. Every number is a real output of the code below."
      },
      {
        type: "heatmap",
        title: "NOT CONVERGED: stop iteration early and only cells near the goal have value (illustrative)",
        rows: ["row 0", "row 1", "row 2"],
        cols: ["col 0", "col 1", "col 2", "col 3"],
        matrix: [
          [0.0, 0.49, 0.76, 1.0],
          [0.0, null, 0.42, -1.0],
          [0.0, 0.0, 0.0, 0.07]
        ],
        showVals: true,
        interpret: "Illustrative (same gridworld, only ~3 sweeps done). <b>Same value map, iteration halted too soon.</b> Reward information has only propagated a few steps back from the goal: cells far from the goal (the whole left column) are still stuck at their initial 0, while near-goal cells already look right. <b>Recognise it:</b> a sharp frontier between sensible values and a block of identical 0s. <b>Fix:</b> keep sweeping until the largest change per sweep (delta) drops below your tolerance — the contraction guarantees it will."
      },
      {
        type: "heatmap",
        title: "WRONG GAMMA: a too-small discount makes the agent short-sighted, values shrink far from goal (illustrative)",
        rows: ["row 0", "row 1", "row 2"],
        cols: ["col 0", "col 1", "col 2", "col 3"],
        matrix: [
          [0.02, 0.08, 0.34, 1.0],
          [-0.03, null, 0.05, -1.0],
          [-0.05, -0.06, -0.05, -0.2]
        ],
        showVals: true,
        interpret: "Illustrative (same grid, gamma dropped to ~0.3 instead of 0.9). <b>Converged, but to a DIFFERENT V* — optimality is per-MDP.</b> A small discount means distant reward barely counts, so value decays steeply away from the goal and far cells are dominated by the -0.04 step cost (slightly negative). <b>Recognise it:</b> values collapse to near-zero just a couple of cells from the goal instead of forming a long smooth ramp. The policy can even change. <b>Lesson:</b> change gamma (or reward, or transitions) and you must re-solve — never reuse a value table across different gamma."
      },
      {
        type: "heatmap",
        title: "BROKEN BACKUP: off-by-one (R(s) not R(s')) corrupts the fixed point (illustrative)",
        rows: ["row 0", "row 1", "row 2"],
        cols: ["col 0", "col 1", "col 2", "col 3"],
        matrix: [
          [0.51, 0.66, 0.81, 1.0],
          [0.41, null, 1.42, -1.0],
          [0.30, 0.26, 0.36, 1.07]
        ],
        showVals: true,
        interpret: "Illustrative — a buggy backup that pairs the reward with the WRONG state (mixing R(s) with V*(s) instead of R+gamma*V*(s') over the SAME transition). <b>Recognise it:</b> values that violate the geometry — here cells next to the -1 hazard (2,3) and (1,2) come out HIGHER than their neighbours and even exceed 1.0, which is impossible when the only +1 is the goal. A value map that is not monotone toward the goal, or exceeds the max attainable reward, means the backup is wrong. <b>Fix:</b> write it as R + gamma*V*(s') over successors s' and hand-check on a 2-state MDP."
      }
    ],
    caption: "The first heatmap is real (numpy value iteration below); the other three are illustrative of what the SAME value map shows when something is off. Healthy: a smooth monotone gradient to the goal. Warnings: a block of untouched 0s far from the goal (not converged), value that collapses within a cell or two of the goal (gamma too small), or values that break the geometry / exceed the max reward (an off-by-one backup bug).",
    code: `import numpy as np

# 3x4 gridworld. Goal (0,3)=+1 (absorbing), hazard (1,3)=-1 (absorbing), wall (1,1) blocked.
# Stochastic moves: intended 0.8, each perpendicular slip 0.1. step cost -0.04, gamma 0.9.
ROWS, COLS = 3, 4
WALL, GOAL, HAZARD = (1, 1), (0, 3), (1, 3)
gamma, step_cost = 0.9, -0.04
acts = {"up": (-1, 0), "down": (1, 0), "left": (0, -1), "right": (0, 1)}

def ok(s):
    return 0 <= s[0] < ROWS and 0 <= s[1] < COLS and s != WALL

states = [(r, c) for r in range(ROWS) for c in range(COLS) if (r, c) != WALL]
terminals = {GOAL, HAZARD}

def reward(s):
    return 1.0 if s == GOAL else (-1.0 if s == HAZARD else step_cost)

def trans(s, a):                                  # P(s' | s, a) as a dict
    perp = ["left", "right"] if a in ("up", "down") else ["up", "down"]
    res = {}
    for p, mv in [(0.8, a), (0.1, perp[0]), (0.1, perp[1])]:
        d = acts[mv]; ns = (s[0] + d[0], s[1] + d[1])
        if not ok(ns):                            # bumping a wall/edge keeps you put
            ns = s
        res[ns] = res.get(ns, 0.0) + p
    return res

# --- value iteration: V*(s) = max_a sum_s' P(s'|s,a)[R + gamma V*(s')] ---
V = {s: 0.0 for s in states}
for sweep in range(1000):
    nV, delta = {}, 0.0
    for s in states:
        if s in terminals:
            nV[s] = reward(s); continue
        nV[s] = reward(s) + gamma * max(
            sum(p * V[ns] for ns, p in trans(s, a).items()) for a in acts)
        delta = max(delta, abs(nV[s] - V[s]))
    V = nV
    if delta < 1e-9:
        break
print("converged in", sweep + 1, "sweeps")        # 30

# heatmap matrix of V* (wall = NaN / blank)
grid = np.full((ROWS, COLS), np.nan)
for s in states:
    grid[s] = V[s]
print(np.round(grid, 3))

# greedy optimal policy pi*(s) = argmax_a Q*(s,a)
for s in sorted(states):
    if s in terminals:
        continue
    best = max(acts, key=lambda a: sum(p * V[ns] for ns, p in trans(s, a).items()))
    print(s, "->", best)`
  };
})();
