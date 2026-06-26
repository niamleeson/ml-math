/* Reinforcement Learning — "The Markov Decision Process: the formal model behind all of RL".
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-mdp".
   Goes DEEPER than the existing ai-mdp lesson (the RL-curriculum treatment) and cross-links it. */
(function () {
  window.LESSONS.push({
    id: "rl-mdp",
    title: "The Markov Decision Process: the formal model behind all of RL",
    tagline: "States, actions, transition dynamics, reward, and a discount — the five-part contract every reinforcement-learning algorithm is solving.",
    module: "Reinforcement Learning",
    prereqs: ["ai-mdp", "prob-expectation"],

    whenToUse:
      `<p><b>Frame a problem as a Markov Decision Process (MDP) whenever you can describe it as
       <i>states</i> the agent is in, <i>actions</i> it can take, and <i>rewards</i> it collects
       over time &mdash; and the future depends only on the current state and action, not the entire
       past.</b> This is the universal lens of reinforcement learning (RL): every RL algorithm you
       will meet (value iteration, Q-learning, SARSA, Deep Q-Networks, policy gradients,
       actor-critic, Proximal Policy Optimization) is just a different way to <i>solve</i> an MDP.</p>
       <ul>
         <li><b>Reach for an MDP when:</b> decisions are <i>sequential</i> (what you do now changes
         what you face later); actions are <i>uncertain</i> (the same action can lead to different
         outcomes); you receive a <i>scalar reward</i> signal you want to maximize over time; and the
         <b>Markov property</b> holds &mdash; the current state is a sufficient summary of history.</li>
         <li><b>Do NOT force an MDP when:</b> there is no notion of a state evolving over time (a
         one-shot prediction is plain supervised learning, not RL); the reward is dense, immediate,
         and unaffected by your own future actions (a <b>bandit</b> problem &mdash; an MDP with one
         state); or you genuinely cannot observe enough to make the state Markov (then you need a
         <b>POMDP</b>, Partially Observable MDP, below).</li>
       </ul>
       <p>This lesson is the formal foundation. It deepens the existing <code>ai-mdp</code> lesson:
       there an MDP was a planning model; here it is the object that all of RL optimizes. The next
       lessons (value iteration in <code>ai-value-iteration</code>, learning from experience in
       <code>ai-q-learning</code>, <code>aix-monte-carlo</code>, <code>aix-sarsa-td</code>) all
       operate on the tuple defined right here.</p>`,

    application:
      `<p>The MDP is the modeling language of sequential decision making. Everywhere RL is applied,
       step one is "write it down as an MDP."</p>
       <ul>
         <li><b>Games.</b> Board and video games &mdash; chess, Go, Atari, StarCraft &mdash; where the
         board / screen is the state, legal moves are actions, and winning is the reward.</li>
         <li><b>Robotics and control.</b> Joint angles and velocities are the state, motor torques are
         the actions, and staying upright / reaching a target is the reward.</li>
         <li><b>Recommendation and ads.</b> A user's context is the state, items to show are actions,
         and clicks / long-term engagement are the reward &mdash; sequential because today's
         recommendation shapes tomorrow's user.</li>
         <li><b>Operations.</b> Inventory restocking, datacenter cooling, and traffic-light control are
         classic MDPs.</li>
         <li><b>RLHF (Reinforcement Learning from Human Feedback).</b> Aligning large language models is
         cast as an MDP: the prompt-so-far is the state, the next token is the action, and a learned
         reward model scores the completion.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>A non-Markov state.</b> The single most common failure. If the right action depends on
         something <i>not</i> in the state &mdash; velocity (so you need the last two frames), a hidden
         timer, what you saw three steps ago &mdash; then $P(s'\\mid s,a)$ is not well-defined and every
         algorithm built on it is solving the wrong problem. <b>Fix:</b> fold the missing history into
         the state (stack frames, add the elapsed time) until the state is a sufficient summary.</li>
         <li><b>Wrong reward.</b> The agent maximizes <i>exactly</i> the reward you write, not the one
         you meant. Reward "reaching the cell" and it reaches the cell instead of the goal; reward "balls
         touched" and a cleaning robot knocks balls off shelves to touch them again. <b>Fix:</b> reward
         the true outcome, sparingly, and watch for reward hacking.</li>
         <li><b>Wrong discount $\\gamma$ (Greek "gamma").</b> A $\\gamma$ too close to $1$ makes the
         return sum slowly-converging and high-variance; a $\\gamma$ too small makes the agent myopic and
         ignore the goal. <b>Fix:</b> pick $\\gamma$ to match the real time horizon of the task.</li>
         <li><b>Unnormalized transitions.</b> For each $(s,a)$ the next-state probabilities must sum to
         $1$. A typo that breaks this silently corrupts every value computed downstream. <b>Fix:</b>
         assert $\\sum_{s'} P(s'\\mid s,a)=1$ for all $s,a$.</li>
         <li><b>Huge or continuous state spaces.</b> A tabular MDP needs one entry per state; cross
         many variables and the table explodes; continuous states have infinitely many. <b>Fix:</b>
         function approximation &mdash; neural networks &mdash; covered in <code>mod-dqn</code>,
         <code>mod-policy-gradient</code>, and <code>mod-actor-critic</code>.</li>
         <li><b>Partial observability.</b> If you see an <i>observation</i> that is not the full state,
         a plain MDP is mis-specified; use a POMDP (Partially Observable MDP), which adds an observation
         model and forces the agent to track a <i>belief</i> (a probability distribution over states).</li>
       </ul>`,

    bigIdea:
      `<p>The existing <code>ai-mdp</code> lesson introduced the pieces. This lesson states the
       <b>full formal model</b> that every reinforcement-learning algorithm optimizes, and names each
       part precisely &mdash; because RL is notation-heavy and the rest of the curriculum depends on it.</p>
       <p>A <b>Markov Decision Process (MDP)</b> is a 5-tuple
       $(\\mathcal{S}, \\mathcal{A}, P, R, \\gamma)$:
       a set of <b>states</b> $\\mathcal{S}$, a set of <b>actions</b> $\\mathcal{A}$, the
       <b>transition dynamics</b> $P(s'\\mid s,a)$, the <b>reward</b> $R(s,a,s')$, and a
       <b>discount</b> $\\gamma$. That is the entire contract.</p>
       <p>The agent does not get to pick the dynamics or the reward &mdash; those are the world. It only
       gets to pick a <b>policy</b>: a rule for choosing actions. The whole of RL is the search for the
       policy that earns the most reward over time.</p>`,

    buildup:
      `<p>Read the loop out loud: the agent is in state $s_t$ at time $t$. It picks an action $a_t$.
       The world responds &mdash; randomly &mdash; with a next state $s_{t+1}$ drawn from
       $P(\\cdot\\mid s_t,a_t)$ and a reward $R_t$. Then it is time $t+1$, and repeat.</p>
       <p>The <b>Markov property</b> is the assumption that makes this tractable: the next state and
       reward depend <i>only</i> on the current state and action, not on the whole trajectory that led
       there. Formally, with the history written out,
       $P(s_{t+1}\\mid s_t,a_t,s_{t-1},a_{t-1},\\dots,s_0,a_0) = P(s_{t+1}\\mid s_t,a_t)$.
       The current state $s_t$ is a <b>sufficient statistic</b> for the past: knowing it, the history
       tells you nothing more about the future.</p>
       <p>Why it matters: it lets us define a value for each <i>state</i> (not each history), which is
       what makes the Bellman equations &mdash; and all of dynamic programming and RL &mdash; possible.
       If the property fails, the cure is not to abandon the framework but to <b>enlarge the state</b>
       until it holds again.</p>`,

    symbols: [
      { sym: "$\\mathcal{S}$", desc: "the state space (script 'S'): the set of all states $s$ the agent can be in." },
      { sym: "$\\mathcal{A}$", desc: "the action space (script 'A'): the set of all actions $a$ the agent can take." },
      { sym: "$s, s'$", desc: "a current state $s$ and a possible next state $s'$ ($s$-prime, read 's prime')." },
      { sym: "$a$", desc: "an action the agent chooses." },
      { sym: "$t$", desc: "the discrete time step: $t = 0, 1, 2, \\dots$. $s_t$ is the state at step $t$." },
      { sym: "$P(s'\\mid s,a)$", desc: "the transition dynamics: the probability of landing in $s'$ given that action $a$ was taken in state $s$. A conditional probability; the bar '$\\mid$' reads 'given'." },
      { sym: "$R(s,a,s')$", desc: "the reward function: the scalar reward earned on the move from $s$ to $s'$ under action $a$. (Often written $R(s,a)$, its average over $s'$.)" },
      { sym: "$R_t$", desc: "the reward actually received at step $t$, i.e. $R_t = R(s_t, a_t, s_{t+1})$." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), a number in $[0,1)$. It shrinks future rewards: a reward $k$ steps away counts for $\\gamma^k$ of its face value." },
      { sym: "$\\pi$", desc: "a policy (Greek 'pi'): the agent's rule for choosing actions from states." },
      { sym: "$\\pi(s)$", desc: "a deterministic policy: it returns a single action for state $s$." },
      { sym: "$\\pi(a\\mid s)$", desc: "a stochastic policy: the probability of choosing action $a$ in state $s$. For each $s$, these sum to $1$ over actions." },
      { sym: "$G_t$", desc: "the return: the discounted sum of all rewards from step $t$ onward, $G_t = \\sum_{k\\ge 0}\\gamma^k R_{t+k}$." },
      { sym: "$\\mathbb{E}_\\pi[\\cdot]$", desc: "the expected (average) value when actions are drawn from policy $\\pi$ and next states from $P$. Averages over all the randomness." }
    ],

    formula:
      `$$ \\text{MDP} = (\\mathcal{S}, \\mathcal{A}, P, R, \\gamma) \\qquad
         P(s_{t+1}\\mid s_t,a_t,\\dots,s_0,a_0) = P(s_{t+1}\\mid s_t,a_t) $$
       $$ G_t = \\sum_{k=0}^{\\infty}\\gamma^{k}\\,R_{t+k} \\qquad
         \\pi^\\star = \\arg\\max_{\\pi}\\;\\mathbb{E}_\\pi\\!\\left[\\sum_{t=0}^{\\infty}\\gamma^{t} R_t\\right] $$`,

    whatItDoes:
      `<p>The <b>first line</b> is the MDP itself and the Markov property: the next state $s_{t+1}$
       depends on the whole history only through $s_t$ and $a_t$. Everything past $s_t$ is irrelevant
       once $s_t$ is known.</p>
       <p>The <b>second line</b> is the objective. The <b>return</b> $G_t$ adds up every future reward,
       discounting one drawn $k$ steps later by $\\gamma^k$ &mdash; the agent prefers reward sooner.
       The <b>optimal policy</b> $\\pi^\\star$ is the one that maximizes the <i>expected</i> return,
       averaged over the world's randomness (the $\\mathbb{E}_\\pi$). That single optimization &mdash;
       "find the policy with the highest expected discounted return" &mdash; is the problem all of
       reinforcement learning solves.</p>
       <p>Why discount? Two reasons. <b>Mathematically:</b> if rewards are bounded by $R_{\\max}$, then
       $\\sum_k \\gamma^k R_{\\max} = R_{\\max}/(1-\\gamma)$ is finite for $\\gamma\\lt 1$, so the
       infinite sum converges. <b>Practically:</b> it encodes that sooner reward is worth more.</p>`,

    derivation:
      `<p><b>Why the Markov property makes value functions well-defined.</b> Suppose we want to score how
       good it is to be in a state under a policy $\\pi$. Define the value as the expected return from
       that state, $V_\\pi(s) = \\mathbb{E}_\\pi[G_t \\mid s_t = s]$. This is only a function of $s$
       &mdash; not of how we arrived &mdash; <i>because</i> of the Markov property: the future
       distribution depends on the past only through $s$. Without it, the "value" would depend on the
       entire history and could not be tabulated per state, and dynamic programming would be impossible.</p>
       <p><b>Why the discounted return is finite.</b> Split the return after one step:
       $G_t = R_t + \\gamma R_{t+1} + \\gamma^2 R_{t+2} + \\dots = R_t + \\gamma G_{t+1}$. This simple
       recursion &mdash; today's return is today's reward plus a discounted copy of tomorrow's return
       &mdash; is the seed of the <b>Bellman equation</b> developed in the value-iteration lesson. With
       $|R_t|\\le R_{\\max}$ and $0\\le\\gamma\\lt 1$, the geometric bound
       $|G_t|\\le R_{\\max}\\sum_{k\\ge 0}\\gamma^k = R_{\\max}/(1-\\gamma)$ guarantees the sum converges,
       so the objective $\\mathbb{E}_\\pi[G_0]$ is a finite, well-defined number to maximize.</p>
       <p><b>Why one optimal policy exists, and it can be deterministic.</b> A foundational MDP theorem:
       for any finite MDP there exists a policy $\\pi^\\star$ that is simultaneously optimal in <i>every</i>
       state, and at least one such optimal policy is <b>deterministic</b> &mdash; in each state there is
       a best action, so no coin-flipping is needed at the optimum. (Stochastic policies still matter
       during <i>learning</i>, for exploration, and in games / POMDPs.) This is why so much of RL chases
       a deterministic $\\pi^\\star(s)$ even though it searches over stochastic policies along the way.</p>`,

    example:
      `<p>A tiny <b>4-state chain</b>: states $s_0, s_1, s_2, s_3$ in a line; $s_3$ is the goal. Two
       actions, <b>LEFT</b> and <b>RIGHT</b>. The floor is slippery: the intended move happens with
       probability $0.8$, and with probability $0.2$ the agent stays put. Reward is $+1$ for entering
       $s_3$ and $0$ otherwise; $\\gamma = 0.9$.</p>
       <ul class="steps">
         <li><b>Transitions from $s_2$ under RIGHT:</b> $P(s_3\\mid s_2,\\text{RIGHT}) = 0.8$ and
         $P(s_2\\mid s_2,\\text{RIGHT}) = 0.2$. Check: $0.8 + 0.2 = 1$ &mdash; valid.</li>
         <li><b>Markov check:</b> the chance of reaching $s_3$ depends only on being in $s_2$ and
         choosing RIGHT &mdash; not on how the agent got to $s_2$. The property holds.</li>
         <li><b>A single move's expected reward</b> from $s_2$ under RIGHT:
         $0.8\\times 1 + 0.2\\times 0 = 0.8$, not the $1$ you would assume if the move always worked.
         That gap is the cost of slipperiness.</li>
         <li><b>Return of a lucky run</b> from $s_0$ that reaches the goal in $3$ clean steps (reward
         only on the last): $G_0 = \\gamma^0\\!\\cdot 0 + \\gamma^1\\!\\cdot 0 + \\gamma^2\\!\\cdot 1
         = 0.9^2 = 0.81$. A slower, slippier run discounts the $+1$ more, so its return is smaller. The
         objective $\\mathbb{E}_\\pi[G_0]$ averages over all such runs.</li>
       </ul>
       <p>The CODE below builds exactly this MDP as numpy arrays and simulates a trajectory; the CODEVIZ
       draws its transition matrix as a heatmap.</p>`,

    practice: [
      {
        q: `An agent's state is the current screen pixels of a Pong game. Is this state Markov? If not, how do you fix it?`,
        steps: [
          { do: `Ask what the optimal action depends on.`, why: `In Pong you need the ball's direction and speed to decide where to move the paddle.` },
          { do: `Check whether one frame reveals that.`, why: `A single still frame shows the ball's position but NOT its velocity — you cannot tell which way it is moving.` },
          { do: `Conclude and fix.`, why: `One frame is non-Markov. Stack the last few frames into the state so velocity is recoverable — this is exactly what the DQN (Deep Q-Network) Atari work did.` }
        ],
        answer: `<p>No &mdash; a single frame is not Markov because it hides velocity. <b>Fix:</b> make the state a stack of the last 2&ndash;4 frames so the dynamics depend only on the (enlarged) current state again.</p>`
      },
      {
        q: `In the 4-state chain ($\\gamma = 0.9$), a run reaches the goal $s_3$ in exactly 4 steps, earning $+1$ only on the final step. What is the return $G_0$?`,
        steps: [
          { do: `Locate where the reward lands.`, why: `Reward $+1$ is received entering the goal, on step 4 — i.e. as $R_3$ (the reward at $t=3$, since the first reward is $R_0$).` },
          { do: `Apply the discount $\\gamma^k$.`, why: `A reward at offset $k$ from the start counts for $\\gamma^k$. Here $k = 3$, so the factor is $\\gamma^3 = 0.9^3$.` },
          { do: `Compute.`, why: `$0.9^3 = 0.729$. All earlier rewards are $0$, so they add nothing.` }
        ],
        answer: `<p>$G_0 = \\gamma^3 \\cdot 1 = 0.9^3 = 0.729$. The extra step shrinks the reward versus the 3-step run's $0.81$ &mdash; discounting rewards speed.</p>`
      },
      {
        q: `Why does discounting with $\\gamma \\lt 1$ guarantee the infinite-horizon return is a finite number?`,
        steps: [
          { do: `Bound each reward.`, why: `Assume rewards never exceed some $R_{\\max}$ in size, $|R_t| \\le R_{\\max}$.` },
          { do: `Bound the whole sum.`, why: `$|G_t| \\le \\sum_{k\\ge0}\\gamma^k R_{\\max} = R_{\\max}\\sum_{k\\ge0}\\gamma^k$, a geometric series.` },
          { do: `Sum the geometric series.`, why: `For $0\\le\\gamma\\lt1$, $\\sum_{k\\ge0}\\gamma^k = 1/(1-\\gamma)$, which is finite.` }
        ],
        answer: `<p>Because $|G_t| \\le R_{\\max}/(1-\\gamma)$, a finite bound. With $\\gamma = 1$ the geometric series diverges and the return can be infinite, which is why infinite-horizon RL discounts (or uses average reward / episodic termination instead).</p>`
      }
    ]
  });

  window.CODE["rl-mdp"] = {
    lib: "numpy",
    runnable: false,
    explain:
      `<p>We build the 4-state slippery chain MDP from the worked example <b>explicitly in numpy</b>
       &mdash; no Gymnasium, no PyTorch &mdash; so every part of the tuple
       $(\\mathcal{S}, \\mathcal{A}, P, R, \\gamma)$ is a plain array you can inspect. <code>P</code> is the
       transition tensor <code>P[s, a, s']</code>; <code>R</code> is the reward table <code>R[s, a]</code>;
       <code>gamma</code> is the discount. Then we <b>simulate one trajectory</b> under a fixed
       "always RIGHT" policy, sampling each next state from <code>P[s, a]</code> and printing the
       state / action / reward at every step. This runs anywhere Python + numpy do (Colab included);
       <code>runnable</code> is off only because the in-browser engine has no numpy.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

# ============================================================
# A 4-STATE SLIPPERY CHAIN MDP, written out as the tuple
#   (S, A, P, R, gamma)  --- the whole formal model, as arrays.
#   States: 0,1,2,3 in a line.  State 3 is the terminal GOAL.
#   Actions: 0 = LEFT, 1 = RIGHT.  Floor is slippery: intended
#   move happens w.p. 0.8, else the agent STAYS (w.p. 0.2).
# ============================================================
S = [0, 1, 2, 3]                 # state space  (script S)
A = [0, 1]                       # action space (script A); 0=LEFT, 1=RIGHT
ACTION_NAME = {0: "LEFT", 1: "RIGHT"}
GOAL, gamma = 3, 0.9
nS, nA = len(S), len(A)

# --- P[s, a, s'] : probability of next state s' given (s, a) ---
P = np.zeros((nS, nA, nS))
for s in S:
    left  = max(s - 1, 0)        # clamp at the left wall
    right = min(s + 1, nS - 1)   # clamp at the right wall
    P[s, 0, left]  += 0.8; P[s, 0, s] += 0.2   # LEFT : 0.8 go, 0.2 slip-stay
    P[s, 1, right] += 0.8; P[s, 1, s] += 0.2   # RIGHT: 0.8 go, 0.2 slip-stay
P[GOAL, :, :] = 0.0; P[GOAL, :, GOAL] = 1.0    # goal is absorbing (terminal)

# Sanity: for every (s, a) the next-state probs must sum to 1.
assert np.allclose(P.sum(axis=2), 1.0), "transitions must be valid probabilities"

# --- R[s, a] : expected reward = +1 for ENTERING the goal, else 0 ---
R = P[:, :, GOAL] * 1.0          # reward only when the move lands in the goal
R[GOAL, :] = 0.0                 # no reward once already terminal

print("Transition tensor P[s, RIGHT, s'] (rows=s, cols=s'):")
print(np.round(P[:, 1, :], 2))
print("Reward table R[s, a]  (cols: LEFT, RIGHT):")
print(np.round(R, 2), "\\n")

# ============================================================
# SIMULATE ONE TRAJECTORY under a FIXED policy: always RIGHT.
#   pi(s) = RIGHT for every state  (a deterministic policy).
# ============================================================
def pi(s):
    return 1                     # always RIGHT

def step(s, a):
    s_next = rng.choice(nS, p=P[s, a])   # sample s' ~ P(. | s, a)
    r = R[s, a]                          # reward for this (s, a)
    return s_next, r

s, t, G = 0, 0, 0.0              # start in s0; track time t and return G
print(f"{'t':>2} {'state':>5} {'action':>6} {'reward':>7}")
while s != GOAL and t < 30:
    a = pi(s)
    s_next, r = step(s, a)
    G += (gamma ** t) * r        # accumulate discounted return G = sum gamma^t R_t
    print(f"{t:>2} {s:>5} {ACTION_NAME[a]:>6} {r:>7.2f}")
    s, t = s_next, t + 1

print(f"\\nReached goal at t={t}.  Discounted return G_0 = {G:.4f}")
# Try changing the seed (rng = default_rng(k)) to see different slippery runs,
# or change pi to 'always LEFT' to watch a bad policy never reach the goal.`
  };

  window.CODEVIZ["rl-mdp"] = {
    question: "How do you READ the transition dynamics P(s' | s, a) of an MDP? A transition matrix is a heatmap: each ROW is a current state s, each COLUMN a possible next state s', and the colour is the probability of that move. Below is the healthy slippery chain plus the variants you actually run into — a broken (unnormalised) matrix, a deterministic chain, and a near-random one.",
    charts: [
      {
        type: "heatmap",
        title: "Healthy slippery chain: P(s' | s, RIGHT), rows = s, cols = s'",
        rows: ["s0", "s1", "s2", "s3 (goal)"],
        cols: ["s0", "s1", "s2", "s3 (goal)"],
        matrix: [
          [0.2, 0.8, 0.0, 0.0],
          [0.0, 0.2, 0.8, 0.0],
          [0.0, 0.0, 0.2, 0.8],
          [0.0, 0.0, 0.0, 1.0]
        ],
        showVals: true,
        interpret: "<b>Read one row at a time:</b> row s2 says that taking RIGHT in s2 lands you in s3 with probability 0.8 (the bright off-diagonal cell) and slips back to s2 with probability 0.2 (the dim diagonal cell). The bright band just above the diagonal is the intended 'move one step right'; the dim diagonal is the 'slip and stay'. The bottom row is all-zero except a 1.0 on s3 itself: the goal is <b>absorbing</b> — once there you never leave. <b>Every row sums to 1.0</b> — that is what makes this a valid probability distribution and the real 'P' of the MDP. (Real numbers, from the numpy code below.)"
      },
      {
        type: "heatmap",
        title: "BUG — unnormalised rows: P(s' | s, RIGHT) that does NOT sum to 1",
        rows: ["s0", "s1", "s2", "s3 (goal)"],
        cols: ["s0", "s1", "s2", "s3 (goal)"],
        matrix: [
          [0.2, 0.8, 0.0, 0.0],
          [0.0, 0.2, 0.5, 0.0],
          [0.0, 0.0, 0.2, 0.7],
          [0.0, 0.0, 0.0, 1.0]
        ],
        showVals: true,
        interpret: "<b>Illustrative bug.</b> It looks almost identical, but add up row s1: 0.0 + 0.2 + 0.5 + 0.0 = 0.7, not 1.0. A typo dropped 0.3 of the probability mass into nowhere. Every value computed downstream (returns, V, Q) is then silently wrong, because the agent thinks 30% of the time the world simply vanishes. <b>How to spot it:</b> a row whose cells don't add to 1, or a row that looks unexpectedly dim overall. The fix is the assert in the code: check that each row sums to 1 for every (s, a)."
      },
      {
        type: "heatmap",
        title: "Deterministic chain (no slip): P(s' | s, RIGHT) with slip probability 0",
        rows: ["s0", "s1", "s2", "s3 (goal)"],
        cols: ["s0", "s1", "s2", "s3 (goal)"],
        matrix: [
          [0.0, 1.0, 0.0, 0.0],
          [0.0, 0.0, 1.0, 0.0],
          [0.0, 0.0, 0.0, 1.0],
          [0.0, 0.0, 0.0, 1.0]
        ],
        showVals: true,
        interpret: "<b>Illustrative — what a non-slippery floor looks like.</b> All the mass is a single bright 1.0 on the off-diagonal; the dim 'slip-stay' diagonal is gone. RIGHT in s2 now reaches s3 with certainty. When you see a transition matrix made entirely of crisp 1.0s and 0.0s, the environment is <b>deterministic</b>: the same action in the same state always gives the same next state. This is the easy case — planning is just following the bright cells."
      },
      {
        type: "heatmap",
        title: "Near-random dynamics: P(s' | s, RIGHT) with heavy slip",
        rows: ["s0", "s1", "s2", "s3 (goal)"],
        cols: ["s0", "s1", "s2", "s3 (goal)"],
        matrix: [
          [0.55, 0.45, 0.0, 0.0],
          [0.45, 0.10, 0.45, 0.0],
          [0.0, 0.45, 0.10, 0.45],
          [0.0, 0.0, 0.0, 1.0]
        ],
        showVals: true,
        interpret: "<b>Illustrative — a very slippery, near-random floor.</b> The probability mass is smeared across several cells per row instead of concentrating on one, and some of it leaks backward (left of the diagonal). The 'intended' RIGHT move now barely outweighs slipping the wrong way, so the agent's action only weakly controls where it ends up. <b>When you see diffuse, spread-out rows</b>, the dynamics are highly stochastic: actions matter little, the discount must work harder, and the optimal policy is much less obvious than in the crisp deterministic case."
      }
    ],
    caption: "Read every transition matrix the same way: one row per current state, one column per next state, colour = probability, and each row must sum to 1. The first heatmap is the real, valid slippery chain from the numpy code; the other three are illustrative variants — a normalisation bug, a deterministic chain, and near-random dynamics — so you can recognise each at a glance.",
    code: `import numpy as np

# Build the same 4-state slippery chain and read off P(. | s, RIGHT).
nS = 4
GOAL = 3
P = np.zeros((nS, 2, nS))            # P[s, a, s'];  a: 0=LEFT, 1=RIGHT
for s in range(nS):
    left  = max(s - 1, 0)
    right = min(s + 1, nS - 1)
    P[s, 0, left]  += 0.8; P[s, 0, s] += 0.2   # LEFT
    P[s, 1, right] += 0.8; P[s, 1, s] += 0.2   # RIGHT
P[GOAL, :, :] = 0.0; P[GOAL, :, GOAL] = 1.0    # absorbing goal

P_right = P[:, 1, :]                 # the RIGHT-action transition matrix
print(np.round(P_right, 2))          # -> the 4x4 grid plotted as the heatmap
print("row sums:", P_right.sum(axis=1))   # all 1.0 -> valid probability rows`
  };
})();
