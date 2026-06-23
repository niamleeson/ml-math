/* Reinforcement Learning — "Returns and value functions: how RL measures 'how good'".
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-returns-values". */
(function () {
  window.LESSONS.push({
    id: "rl-returns-values",
    title: "Returns and value functions: how RL measures \"how good\"",
    tagline: "The return is the discounted sum of future rewards; a value function is its expectation. Bellman makes that expectation recursive.",
    module: "Reinforcement Learning",
    prereqs: ["ai-mdp", "ai-value-iteration", "ai-q-learning", "prob-expectation"],

    whenToUse:
      `<p><b>Value functions are the central object of reinforcement learning (RL).</b> Almost every RL
       algorithm either estimates a value function, improves a policy using one, or both. So this lesson is
       the hinge the rest of RL turns on.</p>
       <p>There are two jobs in RL, and value functions sit under both:</p>
       <ul>
         <li><b>Prediction (policy evaluation).</b> Given a fixed policy $\\pi$, estimate its value $V^\\pi$ or
         $Q^\\pi$ &mdash; "how good is this way of behaving?" That is exactly what this lesson computes.</li>
         <li><b>Control.</b> Find the <i>best</i> policy. Every control method &mdash; value iteration
         (<code>ai-value-iteration</code>), Q-learning (<code>ai-q-learning</code>), Deep Q-Networks
         (<code>mod-dqn</code>), actor-critic (<code>mod-actor-critic</code>) &mdash; is built on top of the
         value functions and Bellman equations defined here.</li>
       </ul>
       <p>Reach for a value function whenever you need a single number that summarizes the long-run consequence
       of being in a state (or taking an action) and then behaving in a particular way. If you only care about
       one-step outcomes, you do not need RL at all.</p>`,

    application:
      `<p>Value functions and the Bellman equations are everywhere RL is used:</p>
       <ul>
         <li><b>Games.</b> Atari, Go, chess, StarCraft &mdash; agents learn $Q$ or $V$ to evaluate board
         positions and moves.</li>
         <li><b>Robotics and control.</b> Locomotion, manipulation, and flight stabilization estimate the
         long-run value of states to choose actions safely.</li>
         <li><b>Recommendation and ads.</b> Treating a session as a sequence, the value of showing an item is
         the expected discounted future engagement, not just the next click.</li>
         <li><b>Operations.</b> Inventory restocking, queue routing, and energy scheduling are MDPs (Markov
         Decision Processes) whose policies are scored by value functions.</li>
         <li><b>RLHF (Reinforcement Learning from Human Feedback).</b> Fine-tuning large language models with
         Proximal Policy Optimization (PPO) uses a learned value function as a baseline to reduce gradient
         variance.</li>
       </ul>
       <p>This lesson goes deeper than <code>ai-mdp</code> / <code>ai-policy-value</code> (which introduce
       policies and values) and feeds directly into <code>aix-monte-carlo</code> and <code>aix-sarsa-td</code>
       (which <i>estimate</i> these values from sampled experience instead of solving for them).</p>`,

    pitfalls:
      `<ul>
         <li><b>Confusing $V$ and $Q$.</b> $V^\\pi(s)$ scores a <i>state</i> (you have not committed to an action
         yet); $Q^\\pi(s,a)$ scores a <i>state-action pair</i> (you commit to $a$ now, then follow $\\pi$). They
         are linked by $V^\\pi(s)=\\sum_a \\pi(a\\mid s)\\,Q^\\pi(s,a)$. Mixing them up corrupts every update.</li>
         <li><b>Forgetting values are policy-dependent.</b> There is no such thing as "the value of state $s$" in
         a vacuum. It is always $V^\\pi(s)$ &mdash; the value <i>under a specific policy</i> $\\pi$. Change the
         policy and every value changes. The superscript $\\pi$ is not decoration.</li>
         <li><b>Ignoring the discount's effect.</b> The discount $\\gamma$ (Greek "gamma") sets the agent's
         horizon. Near $1$ it cares about the far future (and the numbers grow large, roughly $1/(1-\\gamma)$
         times the typical reward); near $0$ it is myopic. Pick $\\gamma$ to match the real time horizon, then
         keep it fixed &mdash; comparing values computed at different $\\gamma$ is meaningless.</li>
         <li><b>Forgetting the expectation has two sources of randomness.</b> $\\mathbb{E}_\\pi[\\cdot]$ averages
         over <i>both</i> the policy's action choices ($\\pi(a\\mid s)$) <i>and</i> the environment's dynamics
         ($P(s'\\mid s,a)$). Drop either and your Bellman equation is wrong.</li>
         <li><b>Treating a single return as the value.</b> The return $G_t$ from one episode is a noisy sample;
         the value is its <i>mean</i>. One lucky rollout is not the value of a state.</li>
       </ul>`,

    bigIdea:
      `<p>An RL agent collects rewards over time. To act well it needs one number per state (or per
       state-action) answering: <b>"if I start here and keep behaving this way, how much reward will I rack up
       in the long run?"</b> That number is a <b>value function</b>.</p>
       <p>The raw long-run reward of a single run is the <b>return</b> $G_t$ &mdash; the discounted sum of all
       future rewards. Because the world and the policy are random, the return is random, so we take its
       <b>expectation</b>. That expectation is the value function.</p>
       <p>The magic is that the return obeys a one-line recursion, $G_t = R_{t+1} + \\gamma G_{t+1}$. Taking
       expectations of that recursion gives the <b>Bellman equations</b> &mdash; value-now in terms of
       reward-now plus discounted value-next. That recursion is the engine behind nearly every RL algorithm.</p>`,

    buildup:
      `<p>From <code>ai-mdp</code>: a state $s$, an action $a$, a random next state $s'$, a reward, and a
       discount $\\gamma$. From <code>ai-policy-value</code>: a policy $\\pi$ maps states to action choices, and
       its value averages discounted reward.</p>
       <p>Here we make all of that precise and recursive. First define the return $G_t$ (one run's discounted
       reward total). Then define two value functions as expectations of $G_t$: $V^\\pi$ over states and $Q^\\pi$
       over state-action pairs. Then derive the Bellman expectation equations from the return's own recursion.</p>
       <p>The payoff: a value function you can <i>solve for</i> as a linear system, not just estimate by
       simulation.</p>`,

    symbols: [
      { sym: "$t$", desc: "the time step (an integer index $0,1,2,\\dots$ counting moves)." },
      { sym: "$S_t$", desc: "the state at time $t$ (capital $S$ because it is a random variable)." },
      { sym: "$A_t$", desc: "the action taken at time $t$ (a random variable)." },
      { sym: "$R_{t+1}$", desc: "the reward received after acting at time $t$ (so it arrives one step later). A random variable." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), a number in $[0,1]$. It shrinks rewards that arrive later." },
      { sym: "$\\gamma^k$", desc: "$\\gamma$ raised to the power $k$: the weight on a reward that is $k$ steps in the future. Larger $k$ means a smaller weight." },
      { sym: "$G_t$", desc: "the return from time $t$: the discounted sum of all future rewards (capital $G$). This is the quantity the agent ultimately wants to be large." },
      { sym: "$\\pi$", desc: "the policy (Greek 'pi'): the agent's behavior rule." },
      { sym: "$\\pi(a\\mid s)$", desc: "the probability the policy picks action $a$ when in state $s$. The '$\\mid$' is read 'given'." },
      { sym: "$P(s'\\mid s,a)$", desc: "the transition probability: the chance the environment moves to next state $s'$ given current state $s$ and action $a$. The '$\\mid$' is read 'given'." },
      { sym: "$R(s,a)$", desc: "the expected immediate reward for taking action $a$ in state $s$ (averaged over where you land)." },
      { sym: "$\\mathbb{E}_\\pi[\\cdot]$", desc: "the expected value (mean) when actions follow policy $\\pi$ and states follow the environment's dynamics. The subscript $\\pi$ flags which policy we average under." },
      { sym: "$V^\\pi(s)$", desc: "the state-value function: the expected return starting from state $s$ and then following policy $\\pi$. 'How good is this state under $\\pi$?'" },
      { sym: "$Q^\\pi(s,a)$", desc: "the action-value function (the 'Q-value'): the expected return starting from state $s$, taking action $a$ now, and following $\\pi$ thereafter. 'How good is this action here, under $\\pi$?'" },
      { sym: "$s'$", desc: "a possible next state ($s$-prime, read 's prime')." }
    ],

    formula:
      `$$ G_t = \\sum_{k\\ge 0} \\gamma^k\\, R_{t+k+1}
              = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots $$
       $$ V^\\pi(s) = \\mathbb{E}_\\pi\\!\\left[\\, G_t \\mid S_t = s \\,\\right],
          \\qquad
          Q^\\pi(s,a) = \\mathbb{E}_\\pi\\!\\left[\\, G_t \\mid S_t = s,\\, A_t = a \\,\\right] $$
       $$ V^\\pi(s) = \\sum_a \\pi(a\\mid s)\\, Q^\\pi(s,a) $$
       $$ V^\\pi(s) = \\sum_a \\pi(a\\mid s) \\sum_{s'} P(s'\\mid s,a)\\,\\big[\\, R(s,a) + \\gamma\\, V^\\pi(s') \\,\\big] $$
       $$ Q^\\pi(s,a) = \\sum_{s'} P(s'\\mid s,a)\\,\\Big[\\, R(s,a) + \\gamma \\sum_{a'} \\pi(a'\\mid s')\\, Q^\\pi(s',a') \\,\\Big] $$`,

    whatItDoes:
      `<p><b>Return $G_t$.</b> Add up every future reward, but discount each one: the reward $k$ steps ahead is
       multiplied by $\\gamma^k$. Reward now ($R_{t+1}$) counts fully; reward later counts for less. $G_t$ is one
       run's score, and it is random.</p>
       <p><b>State value $V^\\pi(s)$.</b> The <i>average</i> return over all the random runs that start in $s$ and
       follow $\\pi$. It scores a state.</p>
       <p><b>Action value $Q^\\pi(s,a)$.</b> The average return when you start in $s$, are forced to take $a$
       first, then follow $\\pi$. It scores a state-action pair, which is what you need to compare actions.</p>
       <p><b>The link $V^\\pi(s)=\\sum_a \\pi(a\\mid s)\\,Q^\\pi(s,a)$.</b> A state's value is just the
       policy-weighted average of the action values available there &mdash; average the $Q$s by how often $\\pi$
       picks each action.</p>
       <p><b>The Bellman expectation equations.</b> The last two lines say value-now equals reward-now plus
       discounted value-next, averaged over the policy and the dynamics. They turn an infinite sum into a finite
       set of equations you can solve.</p>`,

    derivation:
      `<p><b>Step 1 &mdash; the return's recursion.</b> Start from the definition and peel off the first term:</p>
       <p>$G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots$</p>
       <p>$\\quad\\;\\; = R_{t+1} + \\gamma\\big(R_{t+2} + \\gamma R_{t+3} + \\cdots\\big)$</p>
       <p>The parenthesized part is exactly the return one step later, $G_{t+1}$. So</p>
       <p>$$ G_t = R_{t+1} + \\gamma\\, G_{t+1}. $$</p>
       <p>This is the whole trick: an infinite discounted sum is "the next reward plus a discounted copy of the
       same kind of sum, shifted by one step".</p>
       <p><b>Step 2 &mdash; take the expectation under $\\pi$.</b> Apply $\\mathbb{E}_\\pi[\\cdot\\mid S_t=s]$ to
       both sides. Expectation is linear, so it splits across the sum:</p>
       <p>$V^\\pi(s) = \\mathbb{E}_\\pi[G_t\\mid S_t=s] = \\mathbb{E}_\\pi[R_{t+1}\\mid S_t=s]
       + \\gamma\\,\\mathbb{E}_\\pi[G_{t+1}\\mid S_t=s].$</p>
       <p><b>Step 3 &mdash; expand the expectation over the two random choices.</b> From state $s$, two random
       things happen: the policy picks an action $a$ with probability $\\pi(a\\mid s)$, then the environment moves
       to $s'$ with probability $P(s'\\mid s,a)$. Averaging over both:</p>
       <p>$\\mathbb{E}_\\pi[R_{t+1}\\mid S_t=s] = \\sum_a \\pi(a\\mid s)\\,R(s,a)$
       $= \\sum_a \\pi(a\\mid s)\\sum_{s'} P(s'\\mid s,a)\\,R(s,a).$</p>
       <p><b>Step 4 &mdash; the key recursive step.</b> Given we land in $s'$, the expected value of the
       <i>future</i> return $G_{t+1}$ is, by definition, $V^\\pi(s')$. (This uses the Markov property from
       <code>ai-mdp</code>: the future depends only on where you are, $s'$, not on how you got there.) So</p>
       <p>$\\mathbb{E}_\\pi[G_{t+1}\\mid S_t=s] = \\sum_a \\pi(a\\mid s)\\sum_{s'} P(s'\\mid s,a)\\,V^\\pi(s').$</p>
       <p><b>Step 5 &mdash; combine.</b> Putting Steps 3 and 4 together gives the Bellman expectation equation
       for $V^\\pi$:</p>
       <p>$$ V^\\pi(s) = \\sum_a \\pi(a\\mid s) \\sum_{s'} P(s'\\mid s,a)\\,\\big[\\, R(s,a) + \\gamma\\, V^\\pi(s') \\,\\big]. $$</p>
       <p>The same five steps, but conditioning on $A_t=a$ as well, give the $Q$ version (and you recover the
       link $V^\\pi(s)=\\sum_a \\pi(a\\mid s)\\,Q^\\pi(s,a)$ by averaging $Q^\\pi$ over the policy).</p>
       <p><b>Why this is so useful.</b> With finitely many states, the Bellman equation is one linear equation
       per state &mdash; a system $V = R_\\pi + \\gamma P_\\pi V$. Rearranged, $(I - \\gamma P_\\pi)V = R_\\pi$,
       whose exact solution is $V = (I - \\gamma P_\\pi)^{-1} R_\\pi$. No simulation, no infinite sum: just solve
       a linear system. That is exactly what the code below does.</p>`,

    example:
      `<p>Tiny $2$-state chain. State $s_0$ then absorbing goal $s_1$. The fixed policy always advances:
       $80\\%$ it reaches $s_1$ (reward $+1$), $20\\%$ it slips and stays in $s_0$ (reward $0$). Once in $s_1$ it
       stays forever with reward $0$. Discount $\\gamma = 0.9$.</p>
       <ul class="steps">
         <li>Goal value is easy: $V^\\pi(s_1) = 0$ (no more reward).</li>
         <li>Write Bellman at $s_0$: $V^\\pi(s_0) = 0.8\\,[\\,1 + \\gamma V^\\pi(s_1)\\,] + 0.2\\,[\\,0 + \\gamma V^\\pi(s_0)\\,]$.</li>
         <li>Substitute $V^\\pi(s_1)=0$: $V^\\pi(s_0) = 0.8 + 0.18\\,V^\\pi(s_0)$.</li>
         <li>Solve: $V^\\pi(s_0)(1 - 0.18) = 0.8$, so $V^\\pi(s_0) = 0.8 / 0.82 \\approx 0.976$.</li>
         <li>Sanity check: it is a bit below $1$ (the slip-chance and discount cost you a little), exactly as the
         recursion demands. We solved one Bellman equation by hand &mdash; no infinite sum needed.</li>
       </ul>`,

    demo: function (host) {
      gridworldDemo(host, {
        label: "A gridworld whose cells are colored by V<sub>π</sub>(s). Cells nearer the <b>+1 goal</b> have higher value; " +
          "the value of each cell equals its expected reward plus the discounted value of where you go next (sweep {n})."
      });
    },

    practice: [
      {
        q: `A policy gives a fixed reward stream $R_{t+1}=R_{t+2}=\\cdots = 2$ forever, with $\\gamma = 0.9$. What is the return $G_t$?`,
        steps: [
          { do: `Write $G_t = 2 + 2\\gamma + 2\\gamma^2 + \\cdots = 2\\sum_{k\\ge 0}\\gamma^k$.`, why: `Every reward is $2$, each discounted by a higher power of $\\gamma$ — a geometric series.` },
          { do: `Use the geometric-series sum $\\sum_{k\\ge 0}\\gamma^k = \\frac{1}{1-\\gamma}$ (valid since $\\gamma\\lt 1$).`, why: `This closed form is why values stay finite even over an infinite horizon.` },
          { do: `Plug in: $G_t = 2\\cdot\\frac{1}{1-0.9} = 2\\cdot 10 = 20$.`, why: `$\\frac{1}{1-\\gamma}=10$ is the effective horizon at $\\gamma=0.9$.` }
        ],
        answer: `<p>$G_t = \\dfrac{2}{1-0.9} = 20$. Because rewards are deterministic here, the value $V^\\pi$ equals this return, $20$.</p>`
      },
      {
        q: `In a state $s$, the policy picks action $a_1$ with probability $0.7$ and $a_2$ with probability $0.3$. You know $Q^\\pi(s,a_1)=10$ and $Q^\\pi(s,a_2)=4$. What is $V^\\pi(s)$?`,
        steps: [
          { do: `Recall the link $V^\\pi(s)=\\sum_a \\pi(a\\mid s)\\,Q^\\pi(s,a)$.`, why: `A state's value is the policy-weighted average of its action values.` },
          { do: `Plug in: $V^\\pi(s) = 0.7\\times 10 + 0.3\\times 4$.`, why: `Weight each $Q$ by how often the policy picks that action.` },
          { do: `Compute: $7 + 1.2 = 8.2$.`, why: `Just an expectation over the two action choices.` }
        ],
        answer: `<p>$V^\\pi(s) = 0.7(10) + 0.3(4) = 8.2$. Note this is between the two $Q$-values — a value can never exceed the best action's value or fall below the worst.</p>`
      },
      {
        q: `Why must value functions always carry a policy superscript, $V^\\pi$ rather than just $V$? Give the one-line reason and a consequence.`,
        steps: [
          { do: `State the definition: $V^\\pi(s)=\\mathbb{E}_\\pi[G_t\\mid S_t=s]$.`, why: `The expectation is taken under policy $\\pi$ — the actions are drawn from $\\pi(a\\mid s)$.` },
          { do: `Note the dynamics are fixed but the action choices are not.`, why: `Change $\\pi$ and the distribution of future rewards changes, so the average return changes.` }
        ],
        answer: `<p>Because the return averages over actions drawn from $\\pi$, the value <i>is a property of the policy</i>, not of the state alone. Consequence: two different policies generally give two different values at the same state, and the Bellman equation you solve depends on $P_\\pi$ and $R_\\pi$, both built from $\\pi$.</p>`
      }
    ]
  });

  /* ------------------------------------------------------------------ */
  window.CODE["rl-returns-values"] = {
    lib: "numpy",
    runnable: false,
    explain:
      `<p>We <b>evaluate a fixed policy</b> on a small MDP (Markov Decision Process) by solving the Bellman
       expectation equation <i>directly</i> as a linear system &mdash; no simulation, no iteration. The MDP is a
       $4$-state chain: states $s_0\\to s_1\\to s_2\\to s_3$, where $s_3$ is an absorbing goal. Two actions:
       <b>advance</b> (mostly moves you one step toward the goal, sometimes slips and stays) and <b>stay</b>. The
       fixed policy advances with probability $0.7$ and stays with $0.3$.</p>
       <p>We build the policy-induced transition matrix $P_\\pi$ and reward vector $R_\\pi$, then solve
       $(I-\\gamma P_\\pi)V = R_\\pi$ with <code>np.linalg.solve</code> to get $V^\\pi$. From $V^\\pi$ we read off
       $Q^\\pi(s,a)=R(s,a)+\\gamma\\sum_{s'}P(s'\\mid s,a)V^\\pi(s')$, and verify the link
       $V^\\pi(s)=\\sum_a\\pi(a\\mid s)Q^\\pi(s,a)$. Pure numpy, so it runs anywhere &mdash; paste into Google
       Colab and run. <code>runnable</code> is off only because the in-browser engine has no numpy.</p>`,
    code: `import numpy as np
np.set_printoptions(precision=3, suppress=True)

# ============================================================
# A 4-state chain MDP:  s0 -> s1 -> s2 -> s3 (absorbing goal)
# Actions: 0 = advance (toward goal), 1 = stay
# ============================================================
n_states, n_actions = 4, 2
gamma = 0.9

# P[a][s, s'] = probability of next state s' given state s, action a.
P = np.zeros((n_actions, n_states, n_states))
# advance: 80% step forward, 20% slip and stay; goal absorbs.
P[0] = np.array([[0.2, 0.8, 0.0, 0.0],
                 [0.0, 0.2, 0.8, 0.0],
                 [0.0, 0.0, 0.2, 0.8],
                 [0.0, 0.0, 0.0, 1.0]])
# stay: remain in place; goal absorbs.
P[1] = np.array([[1.0, 0.0, 0.0, 0.0],
                 [0.0, 1.0, 0.0, 0.0],
                 [0.0, 0.0, 1.0, 0.0],
                 [0.0, 0.0, 0.0, 1.0]])

# R[a][s, s'] = reward for that move: +1 for entering the goal, -0.1 step cost otherwise.
R = np.full((n_actions, n_states, n_states), -0.1)
R[:, :, 3] = 1.0     # entering goal pays +1
R[:, 3, 3] = 0.0     # absorbing goal: no further reward

# Expected immediate reward r(s, a) = sum_s' P(s'|s,a) R(s,a,s').
Rsa = np.einsum('asx,asx->as', P, R)          # shape (a, s)

# ------------------------------------------------------------
# The fixed policy we are EVALUATING:
#   advance w.p. 0.7, stay w.p. 0.3 in every non-goal state;
#   in the goal, just stay.
# ------------------------------------------------------------
pi = np.zeros((n_states, n_actions))
pi[:, 0] = 0.7; pi[:, 1] = 0.3
pi[3] = [0.0, 1.0]

# Policy-induced dynamics:  P_pi[s, s'] and R_pi[s]
P_pi = np.einsum('sa,asx->sx', pi, P)         # average transitions over the policy
R_pi = np.einsum('sa,as->s', pi, Rsa)         # average immediate reward over the policy

# ============================================================
# SOLVE THE BELLMAN EXPECTATION EQUATION DIRECTLY (linear system):
#     V = R_pi + gamma P_pi V   ==>   (I - gamma P_pi) V = R_pi
# ============================================================
V = np.linalg.solve(np.eye(n_states) - gamma * P_pi, R_pi)

# Action values from V:  Q(s,a) = r(s,a) + gamma sum_s' P(s'|s,a) V(s')
Q = Rsa.T + gamma * np.einsum('asx,x->sa', P, V)   # shape (s, a)

print("V_pi  (state values):", V)
print("Q_pi  (rows = state, cols = [advance, stay]):")
print(Q)
print("check V = sum_a pi(a|s) Q(s,a):", np.einsum('sa,sa->s', pi, Q))

# ---- output ----
# V_pi  (state values): [0.291 0.547 0.854 0.   ]
# Q_pi  (rows = state, cols = [advance, stay]):
# [[0.346 0.162]
#  [0.614 0.393]
#  [0.934 0.669]
#  [0.    0.   ]]
# check V = sum_a pi(a|s) Q(s,a): [0.291 0.547 0.854 0.   ]`
  };

  /* ------------------------------------------------------------------ */
  window.CODEVIZ["rl-returns-values"] = {
    question: "On a 3x3 gridworld, what is each cell worth to a random-walking agent — and do values rise toward the goal?",
    charts: [{
      type: "heatmap",
      title: "V_pi(s) over a 3x3 gridworld (goal at bottom-right, +1), solved from (I - gamma P_pi) V = R_pi",
      rows: ["row 0", "row 1", "row 2"],
      cols: ["col 0", "col 1", "col 2 (goal col)"],
      matrix: [[-0.11, -0.05, 0.04], [-0.05, 0.08, 0.32], [0.04, 0.32, 0.00]],
      showVals: true
    }],
    caption: "Solving the linear Bellman system for the uniform-random policy gives values that climb toward the +1 goal: the goal's neighbors are worth 0.32, while the far corner is only -0.11. The goal cell shows 0 (absorbing, no further reward). gamma = 0.9, step cost -0.04.",
    code: `import numpy as np
import matplotlib.pyplot as plt
np.set_printoptions(precision=2, suppress=True)

# ----- tiny self-contained 3x3 gridworld (NO gym needed) -----
# cell index = r*3 + c.  Goal = cell 8 (bottom-right), +1, absorbing.
# Policy: uniform-random over 4 moves; bumping a wall keeps you in place.
nrows, ncols = 3, 3
N = nrows * ncols
goal = 8
gamma = 0.9
step_r = -0.04

def nxt(s, a):
    r, c = divmod(s, ncols)
    if   a == 0: r2, c2 = r - 1, c      # up
    elif a == 1: r2, c2 = r + 1, c      # down
    elif a == 2: r2, c2 = r, c - 1      # left
    else:        r2, c2 = r, c + 1      # right
    if 0 <= r2 < nrows and 0 <= c2 < ncols:
        return r2 * ncols + c2
    return s                            # bumped a wall -> stay

# Build policy-induced P_pi and reward R_pi for the uniform-random policy.
P_pi = np.zeros((N, N)); R_pi = np.zeros(N)
for s in range(N):
    if s == goal:
        P_pi[s, s] = 1.0; R_pi[s] = 0.0; continue   # absorbing
    for a in range(4):
        sp = nxt(s, a)
        P_pi[s, sp] += 0.25                          # 1/4 per move
        R_pi[s] += 0.25 * (1.0 if sp == goal else step_r)

# Solve the Bellman expectation equation directly: (I - gamma P_pi) V = R_pi
V = np.linalg.solve(np.eye(N) - gamma * P_pi, R_pi)
grid = V.reshape(nrows, ncols)
print(grid)
# [[-0.11 -0.05  0.04]
#  [-0.05  0.08  0.32]
#  [ 0.04  0.32  0.  ]]

fig, ax = plt.subplots(figsize=(5, 5))
im = ax.imshow(grid, cmap="viridis")
for r in range(nrows):
    for c in range(ncols):
        ax.text(c, r, round(grid[r, c], 2), ha="center", va="center", color="white")
ax.set_xticks(range(ncols)); ax.set_yticks(range(nrows))
ax.set_title("V_pi over the gridworld (values rise toward the +1 goal)")
fig.colorbar(im, ax=ax); plt.show()`
  };
})();
