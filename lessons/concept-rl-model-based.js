/* Reinforcement Learning curriculum — MODEL-BASED RL.
   Learn a model of the environment (transition + reward), then PLAN with it,
   instead of learning purely from real trial-and-error (model-FREE). Covers
   Dyna-Q (interleave real steps with planning on the learned model), decision-time
   planning via Monte Carlo Tree Search (MCTS / UCT) as used in AlphaGo/AlphaZero,
   MuZero (latent-space model, no rules needed), and World Models / Dreamer
   (train the policy "in imagination"). The big payoff is SAMPLE EFFICIENCY; the
   big risk is COMPOUNDING MODEL ERROR over long rollouts.
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-model-based". */
(function () {
  window.LESSONS.push({
    id: "rl-model-based",
    title: "Model-based RL: learn the world, then plan in it",
    tagline: "Instead of only learning from real trial-and-error, learn a model of how the world works and plan against it — so each real sample teaches you far more.",
    module: "Reinforcement Learning",
    prereqs: ["ai-mdp", "rl-value-iteration", "ai-q-learning", "rl-monte-carlo"],

    whenToUse:
      `<p><b>Model-based RL (Reinforcement Learning) means you LEARN a model of the environment</b> &mdash; an estimate
       $\\hat P(s' \\mid s,a)$ of where you land and an estimate $\\hat R(s,a)$ of the reward &mdash; and then <b>PLAN</b>
       with that model (look ahead, imagine rollouts, run value iteration on it) to choose actions. This is the opposite
       of <b>model-free</b> RL such as <a href="#ai-q-learning"><code>ai-q-learning</code></a> or
       <a href="#rl-monte-carlo"><code>rl-monte-carlo</code></a>, which throws the model away and learns a value or policy
       directly from real experience.</p>
       <p>The hat '$\\hat{\\ }$' over $P$ and $R$ just means "estimated from data" &mdash; the agent does not know the true
       dynamics, so it fits its own approximation. The bar '$\\mid$' in $\\hat P(s' \\mid s,a)$ reads "given": the probability
       of next state $s'$ <i>given</i> you took action $a$ in state $s$.</p>
       <p><b>Reach for model-based RL when:</b></p>
       <ul>
         <li><b>Real samples are expensive or risky</b> &mdash; robotics, a real chemical plant, a recommender that affects real
          users. A learned model lets you squeeze far more learning out of each real interaction (better <b>sample efficiency</b>),
          and you can plan in imagination instead of breaking real hardware.</li>
         <li><b>Look-ahead clearly helps</b> &mdash; board games and puzzles, where searching a few moves ahead beats reacting.
          This is where <b>MCTS (Monte Carlo Tree Search)</b> shines (AlphaGo, AlphaZero, MuZero).</li>
         <li><b>The dynamics are learnable</b> &mdash; smooth, low-noise physics is easy to model; a slot machine's payout is not.</li>
       </ul>
       <p><b>Prefer model-free instead when:</b> the dynamics are hard to model accurately, samples are cheap and plentiful
       (a fast simulator), or you cannot afford the planning compute at decision time. A wrong model gives <i>confident</i>
       bad plans &mdash; sometimes worse than honest model-free learning.</p>`,

    application:
      `<p><b>Games.</b> <b>AlphaGo / AlphaZero</b> pair MCTS with a learned policy/value network and self-play to reach
       superhuman Go, chess and shogi. <b>MuZero</b> goes further: it learns its model in a <i>latent</i> (hidden,
       learned-features) space, so it never needs the rules of the game &mdash; it planned its way to top play in Atari, Go,
       chess and shogi from interaction alone.</p>
       <p><b>Robotics and control.</b> Real robots are slow and breakable, so sample efficiency matters most here.
       <b>World Models</b> and <b>Dreamer</b> learn a latent dynamics model and then train the policy almost entirely
       "in imagination" &mdash; rolling the policy forward inside the learned model rather than on the real robot.
       <b>Dyna</b> (and its tabular form <b>Dyna-Q</b>) is the classic, simplest template: interleave a few real steps with
       many cheap planning updates on the learned model.</p>
       <p><b>Operations and planning.</b> Inventory, energy, and scheduling problems where a reasonable simulator can be fit
       from logs and then planned against. Any AlphaZero-style domain with a known or learnable simulator is a fit.</p>`,

    pitfalls:
      `<ul>
         <li><b>Compounding model error (the central risk).</b> A model with a small one-step error becomes very wrong over a
          long rollout: errors multiply step after step, so a 20-step imagined trajectory can be nonsense. <i>Fix:</i> keep
          rollouts <b>short</b>, re-ground frequently on real data (Dyna does this every real step), or use ensembles to flag
          where the model is uncertain.</li>
         <li><b>Confident wrong plans.</b> A wrong model does not say "I'm unsure" &mdash; it hands you a precise, optimal-looking
          plan for a world that does not exist. <i>Fix:</i> model uncertainty (ensembles / Bayesian models) and plan
          pessimistically where the model is unsure.</li>
         <li><b>Learning a good model is itself hard.</b> Especially from images or in high dimensions. <i>Fix:</i> learn a
          <b>latent</b> model (MuZero, Dreamer) that only has to predict what matters for reward and value, not every pixel.</li>
         <li><b>Planning is expensive at decision time.</b> MCTS runs many simulations <i>per move</i>. <i>Fix:</i> a learned
          policy/value net to guide and truncate the search (AlphaZero), and a compute budget per decision.</li>
         <li><b>MCTS needs a model to expand nodes.</b> It needs either a real simulator or a learned model; with neither, you
          cannot roll the tree forward. MuZero's whole point is to <i>learn</i> that model so MCTS works without the rules.</li>
       </ul>`,

    bigIdea:
      `<p>Model-free RL learns the <i>answer</i> (a value or a policy) directly from experience and never builds a model of the
       world. <b>Model-based RL learns the <i>world</i></b> &mdash; an estimate $\\hat P$ of the dynamics and $\\hat R$ of the
       reward &mdash; and then <b>plans</b> against that learned world to get the answer. One real experience can then be reused
       many times: replay it through the model, look ahead with it, dream new trajectories from it.</p>
       <p><b>Why bother?</b> <b>Sample efficiency.</b> Model-free RL's great weakness is that it needs an enormous number of real
       interactions, because each real step updates only one value. With a model you can generate <i>imagined</i> experience for
       free and plan ahead, so each real sample teaches you much more. That is exactly why model-based methods dominate when
       real samples are precious (robots) or where look-ahead is decisive (games).</p>
       <p>Three faces of "plan with the model":</p>
       <ul>
         <li><b>Background planning &mdash; Dyna.</b> After each real step, do $n$ extra value updates on transitions
          <i>sampled from the learned model</i>. Real learning and simulated learning use the <i>same</i> update rule; the model
          just manufactures cheap extra practice.</li>
         <li><b>Decision-time planning &mdash; MCTS.</b> When it is your turn to act, build a search tree of futures using the
          model, and pick the action the search likes best. AlphaZero guides this tree with a learned policy/value network.</li>
         <li><b>Imagination &mdash; World Models / Dreamer.</b> Learn a compact latent dynamics model, then train the policy by
          rolling it forward <i>inside</i> the model, hardly touching the real environment.</li>
       </ul>`,

    buildup:
      `<p>Recall the MDP (Markov Decision Process; see <a href="#ai-mdp"><code>ai-mdp</code></a>): states $s$, actions $a$,
       true dynamics $P(s'\\mid s,a)$, reward $R(s,a)$, discount $\\gamma$. <b>Value iteration</b>
       (<a href="#rl-value-iteration"><code>rl-value-iteration</code></a>) solves a <i>known</i> MDP by repeatedly backing up
       $V(s)\\leftarrow \\max_a \\sum_{s'} P(s'\\mid s,a)[R + \\gamma V(s')]$. Model-free
       <a href="#ai-q-learning"><code>ai-q-learning</code></a> solves an <i>unknown</i> MDP from samples, never forming $P$ or $R$.</p>
       <p>Model-based RL sits in between: the MDP is unknown, so we <b>estimate</b> it. Every time we observe a real transition
       $(s,a,r,s')$ we update counts to form $\\hat P(s'\\mid s,a)$ and an average $\\hat R(s,a)$. Now we have a (learned) MDP we
       can plan with &mdash; we can run value-iteration-style backups on $\\hat P,\\hat R$ exactly as if the model were given.</p>
       <p><b>Dyna-Q</b> is the cleanest realization. In the deterministic tabular case the model is trivial: just remember, for
       each visited $(s,a)$, the reward $r$ and next state $s'$ you saw. After each real Q-learning step, sample some past
       $(s,a)$ pairs from this remembered model and apply the <i>same</i> Q-learning update to them. Those simulated updates cost
       no real environment steps, yet they propagate reward information across the state space &mdash; so the policy becomes good
       in far fewer <i>real</i> interactions. The CODE and CODEVIZ below show exactly this speed-up.</p>
       <p><b>MCTS</b> handles the decision-time case. Each move, it grows a tree by repeating four phases &mdash; <b>selection,
       expansion, simulation, backup</b> &mdash; using the model to step forward, and balances trying promising actions against
       trying under-explored ones with the <b>UCT (Upper Confidence bounds applied to Trees)</b> rule, derived below.</p>`,

    symbols: [
      { sym: "$s,\\ s'$", desc: "the current state and a possible next state." },
      { sym: "$a$", desc: "an action available in state $s$." },
      { sym: "$P(s'\\mid s,a)$", desc: "the TRUE transition probability: chance of landing in $s'$ after action $a$ in $s$. The bar '$\\mid$' reads 'given'. Unknown to the agent." },
      { sym: "$\\hat P(s'\\mid s,a)$", desc: "the agent's LEARNED estimate of that transition probability. The hat '$\\hat{\\ }$' means 'estimated from data'." },
      { sym: "$R(s,a)$ and $\\hat R(s,a)$", desc: "the true reward for taking $a$ in $s$, and the agent's learned estimate of it." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), $0\\le\\gamma\\lt 1$: how much a future reward is worth now." },
      { sym: "$Q(s,a)$", desc: "the action-value: expected discounted return from taking $a$ in $s$ and acting greedily afterward. Both real and planning updates change it." },
      { sym: "$n$", desc: "the number of PLANNING updates done per real step in Dyna ($n=0$ is plain Q-learning). Bigger $n$ = more imagined practice per real sample." },
      { sym: "$\\alpha$", desc: "the learning rate (Greek 'alpha'), $0\\lt\\alpha\\le 1$: step size of each Q-update toward its target." },
      { sym: "$N(s)$", desc: "in MCTS, the visit count of node $s$: how many simulations passed through state $s$ so far." },
      { sym: "$N(s,a)$", desc: "in MCTS, the visit count of the edge $(s,a)$: how many simulations took action $a$ from $s$." },
      { sym: "$Q(s,a)$ (in MCTS)", desc: "the mean simulated return obtained after taking $a$ from $s$ &mdash; the search's running estimate of how good that move is." },
      { sym: "$c$", desc: "the exploration constant in UCT: larger $c$ favors trying under-visited actions; smaller $c$ trusts the current $Q$ estimates." },
      { sym: "$\\ln$", desc: "the natural logarithm. $\\ln N(s)$ grows slowly, so the exploration bonus shrinks gradually as the parent is visited more." },
      { sym: "$\\arg\\max_a$", desc: "the action $a$ that maximizes the bracketed quantity (the action the rule selects)." }
    ],

    formula: `$$ \\underbrace{\\hat P(s'\\mid s,a) = \\frac{\\#(s,a\\to s')}{\\#(s,a)},\\quad \\hat R(s,a)=\\overline{r\\,(s,a)}}_{\\text{1. learn the model}} \\qquad \\underbrace{Q(s,a)\\leftarrow Q(s,a)+\\alpha\\Big[\\hat R(s,a)+\\gamma\\max_{a'}Q(s',a')-Q(s,a)\\Big]}_{\\text{2. plan: same backup, on a model-sampled }(s,a,s')} $$
       $$ \\underbrace{a^\\star \\;=\\; \\arg\\max_a\\Big[\\,Q(s,a) \\;+\\; c\\,\\sqrt{\\tfrac{\\ln N(s)}{N(s,a)}}\\,\\Big]}_{\\text{3. MCTS selection (UCT): exploit }Q\\text{ + explore the rarely-tried}} $$`,

    whatItDoes:
      `<p><b>Step 1 &mdash; learn the model.</b> From real transitions, estimate the dynamics. $\\hat P(s'\\mid s,a)$ is just the
       fraction of times that taking $a$ in $s$ led to $s'$ (count of $(s,a\\to s')$ over count of $(s,a)$); $\\hat R(s,a)$ is the
       running average reward. In a <i>deterministic</i> world this collapses to "remember the one $(r,s')$ you saw".</p>
       <p><b>Step 2 &mdash; plan with it (Dyna).</b> Run the ordinary Q-learning backup, but on a transition <i>sampled from the
       model</i> instead of from the real environment. The bracket is the <b>TD (Temporal-Difference) error</b>: target
       $\\hat R + \\gamma\\max_{a'}Q(s',a')$ minus current $Q(s,a)$. Doing this $n$ times per real step spreads reward
       information across states for free &mdash; no real samples spent.</p>
       <p><b>Step 3 &mdash; choose at decision time (MCTS / UCT).</b> Inside the search tree, at each node pick the action with the
       highest <b>UCT</b> score: the first term $Q(s,a)$ <i>exploits</i> the move that looks best so far; the second term
       $c\\sqrt{\\ln N(s)/N(s,a)}$ is an <i>exploration</i> bonus that is large for actions tried few times
       (small $N(s,a)$) and shrinks as they are visited. The $\\sqrt{\\ln N(s)}$ in the numerator lets every action keep getting
       occasional attention. This balances exploration and exploitation as the tree grows.</p>`,

    derivation:
      `<p><b>Why Dyna's planning update is legitimate.</b> Q-learning's update is a sampled Bellman optimality backup: its target
       $r+\\gamma\\max_{a'}Q(s',a')$ is an unbiased single-sample estimate of
       $\\sum_{s'}P(s'\\mid s,a)[R+\\gamma\\max_{a'}Q(s',a')]$. A model-sampled transition $(s,a,\\hat r,\\hat s')\\sim\\hat P,\\hat R$
       gives the <i>same</i> target shape but draws $(\\hat r,\\hat s')$ from the learned model. So <b>if</b> $\\hat P\\to P$ and
       $\\hat R\\to R$, planning updates converge to the same fixed point as real updates &mdash; they are extra, free Bellman
       backups. The only error they can add is the model error $\\hat P-P$, which is exactly the thing that compounds over long
       rollouts. Dyna keeps rollouts to length one (single sampled transitions) precisely to keep that error tiny.</p>
       <p><b>Where UCT comes from (UCB applied to a tree).</b> Treat the choice of action at a node as a multi-armed bandit: each
       action is an arm with unknown mean value $Q(s,a)$, estimated from $N(s,a)$ samples. The UCB1 (Upper Confidence Bound)
       algorithm chooses $\\arg\\max_a[\\bar X_a + \\sqrt{2\\ln N / N_a}]$, where the bonus is a <b>confidence interval</b> on the
       mean. The justification is Hoeffding's inequality: for a mean of $N_a$ bounded samples,</p>
       $$ \\Pr\\big(\\,\\text{true mean} \\gt \\bar X_a + u\\,\\big) \\;\\le\\; e^{-2 N_a u^2}. $$
       <p>Set the failure probability to shrink as $N^{-4}$, i.e. $e^{-2N_a u^2}=N^{-4}$. Solving for the width $u$:
       $2N_a u^2 = 4\\ln N$, so $u = \\sqrt{2\\ln N / N_a}$. That is the exploration bonus. An arm is selected either because its mean
       $\\bar X_a$ is high (<b>exploit</b>) or because its bonus $u$ is high since it was rarely tried (<b>explore</b>). UCT is just
       UCB1 run at every node of the tree, with a tunable constant $c$ in front of the bonus:</p>
       $$ a^\\star = \\arg\\max_a\\Big[\\,Q(s,a) + c\\sqrt{\\tfrac{\\ln N(s)}{N(s,a)}}\\,\\Big],\\qquad N(s,a)=0 \\Rightarrow \\text{bonus}=\\infty\\ (\\text{try it first}). $$
       <p><b>The four MCTS phases, each move.</b> (1) <b>Selection:</b> from the root, follow UCT down to a leaf. (2) <b>Expansion:</b>
       add a new child node for an untried action, stepping the model forward. (3) <b>Simulation (rollout):</b> from the new node,
       play to the end with a quick default policy (AlphaZero replaces this with a value-net estimate). (4) <b>Backup:</b> propagate
       the outcome back up the path, incrementing each $N(s),N(s,a)$ and updating each $Q(s,a)$ toward the result. Repeat for the
       compute budget, then play the most-visited root action.</p>
       <p><b>AlphaZero / MuZero in one line.</b> AlphaZero replaces the random rollout with a network $(p,v)=f_\\theta(s)$ &mdash; a
       prior policy $p$ to bias selection and a value $v$ to score leaves &mdash; and trains $f_\\theta$ from self-play so the search
       and the network bootstrap each other. <b>MuZero</b> drops the rules: it learns three nets &mdash; a representation $s\\to$
       latent, a dynamics latent$\\times a\\to$ (next latent, reward), and a prediction latent$\\to(p,v)$ &mdash; and runs MCTS
       entirely in that learned latent space, so it needs no simulator of the real environment at all.</p>`,

    example:
      `<p><b>One real step of Dyna-Q on a tiny corridor</b> $s_0 \\to s_1 \\to G$ ($G$ = goal, reward $+1$; else $0$), with
       $\\gamma=0.9,\\ \\alpha=0.5$, all $Q=0$, and $n=2$ planning steps. Suppose the agent has already once experienced
       $(s_1,\\text{right})\\to G$ with reward $1$, so its model remembers that transition; now it takes a real step
       $(s_0,\\text{right})\\to s_1$ with reward $0$.</p>
       <ul class="steps">
         <li><b>Real update.</b> Target $=0+0.9\\max_{a'}Q(s_1,a')=0$ (still all zero), so $Q(s_0,\\text{right})$ stays $0$. One real
          step alone learned nothing yet &mdash; the goal news has not reached $s_0$.</li>
         <li><b>Record the model.</b> Store $\\hat P:(s_0,\\text{right})\\to s_1$, $\\hat R(s_0,\\text{right})=0$. The model now knows
          two transitions: $(s_0,\\text{right})\\to s_1$ and $(s_1,\\text{right})\\to G$.</li>
         <li><b>Planning step 1.</b> Sample the remembered $(s_1,\\text{right})\\to G,\\ r=1$ from the model. Update
          $Q(s_1,\\text{right})\\leftarrow 0+0.5[\\,1+0.9\\cdot 0-0\\,]=0.5$. The goal value just propagated into $s_1$ &mdash;
          using <i>no</i> real step.</li>
         <li><b>Planning step 2.</b> Sample the remembered $(s_0,\\text{right})\\to s_1,\\ r=0$. Now
          $\\max_{a'}Q(s_1,a')=0.5$, so $Q(s_0,\\text{right})\\leftarrow 0+0.5[\\,0+0.9\\cdot 0.5-0\\,]=0.225$. The value reached
          $s_0$ too &mdash; again with no real step.</li>
         <li><b>Punchline.</b> Plain Q-learning ($n=0$) would have needed the agent to physically walk
          $s_0\\to s_1\\to G$ again to move $Q(s_0,\\cdot)$ off zero. Dyna did it in imagination after a single real step. That is the
          sample-efficiency win &mdash; quantified in the chart below.</li>
       </ul>`,

    practice: [
      {
        q: `In Dyna-Q, what is the only difference between a "real" Q-update and a "planning" Q-update, and why does adding planning updates make the agent reach a good policy in fewer REAL environment steps?`,
        steps: [
          { do: `Write both updates: both are $Q(s,a)\\leftarrow Q(s,a)+\\alpha[\\,r+\\gamma\\max_{a'}Q(s',a')-Q(s,a)\\,]$.`, why: `Dyna deliberately uses the identical backup for both, so they accumulate into the same $Q$.` },
          { do: `Note where $(s,a,r,s')$ comes from: the real update uses a transition just observed in the environment; the planning update uses one SAMPLED from the learned model $\\hat P,\\hat R$.`, why: `That is the whole distinction &mdash; real vs imagined source of the transition.` },
          { do: `Each planning update costs zero real steps but still propagates reward information across states.`, why: `So $n$ planning updates per real step multiply how much each real sample teaches.` }
        ],
        answer: `The update rule is identical; only the SOURCE of the transition differs (real environment vs the learned model). Planning updates spread reward information for free, so the policy becomes good in far fewer real interactions &mdash; the sample-efficiency advantage of model-based RL.`
      },
      {
        q: `In MCTS, a node $s$ has been visited $N(s)=100$ times. Action "left" has $Q=0.6,\\ N(s,\\text{left})=80$; action "right" has $Q=0.5,\\ N(s,\\text{right})=4$. With $c=1$, which does UCT select?`,
        steps: [
          { do: `Compute the UCT score $Q(s,a)+c\\sqrt{\\ln N(s)/N(s,a)}$ for each. Here $\\ln 100\\approx 4.605$.`, why: `UCT adds an exploration bonus to the exploit value $Q$.` },
          { do: `Left: $0.6 + 1\\cdot\\sqrt{4.605/80}=0.6+\\sqrt{0.0576}=0.6+0.240=0.840$.`, why: `Left is well-explored, so its bonus is small.` },
          { do: `Right: $0.5 + 1\\cdot\\sqrt{4.605/4}=0.5+\\sqrt{1.151}=0.5+1.073=1.573$.`, why: `Right was tried only 4 times, so its bonus is large.` }
        ],
        answer: `UCT selects "right" ($1.573 \\gt 0.840$). Even though "left" has the higher mean value, "right" is under-explored, so the bonus dominates &mdash; exactly the exploration UCT is designed to force before committing.`
      },
      {
        q: `Why must model-based RL keep its imagined rollouts SHORT, and what specifically goes wrong if it plans 50 steps ahead with a slightly-wrong model?`,
        steps: [
          { do: `Recall the model is an estimate $\\hat P\\neq P$ with some per-step error.`, why: `It was fit from finite data, so it is never exact.` },
          { do: `In a multi-step rollout, the next state feeds the model again, so errors compound: a small step-1 error puts you in a slightly wrong state, whose prediction is more wrong, and so on.`, why: `Errors multiply along the trajectory rather than staying bounded.` },
          { do: `After many steps the imagined trajectory can be physically meaningless, so any plan built on it is unreliable.`, why: `The planner optimizes confidently against a fantasy.` }
        ],
        answer: `Because model errors COMPOUND: each step is predicted from an already-imperfect state, so a 50-step rollout can drift into nonsense and the planner produces a confident but wrong plan. The fixes are short rollouts, frequent re-grounding on real data (as Dyna does with single-step samples), and modeling uncertainty so the planner distrusts regions the model has not seen.`
      }
    ]
  });

  /* -------------------------------------------------------------------------- */
  window.CODE["rl-model-based"] = {
    lib: "Python + NumPy (tabular Dyna-Q on a gridworld)",
    runnable: false,
    explain:
      `<p><b>Tabular Dyna-Q</b> on the classic 6&times;9 maze (Sutton &amp; Barto). The agent learns a deterministic model
       &mdash; for each visited $(s,a)$ it simply remembers the reward and next state it saw &mdash; and after every REAL step it
       does $n$ <b>planning</b> updates on transitions sampled from that remembered model, using the <i>same</i> Q-learning backup.
       We run $n=0$ (plain Q-learning), $n=5$, and $n=50$, and print how many real environment steps each needs to first reach a
       near-optimal episode. Pure NumPy &mdash; <b>runs in Colab</b> with no installs.</p>`,
    code: `import numpy as np

# Classic Dyna maze (Sutton & Barto): 6x9 grid, start (2,0), goal (0,8).
ROWS, COLS = 6, 9
WALLS = {(1,2),(2,2),(3,2),(4,5),(0,7),(1,7),(2,7)}
START, GOAL = (2,0), (0,8)
ACTS = {0:(-1,0), 1:(1,0), 2:(0,-1), 3:(0,1)}    # up, down, left, right
nA = 4
def free(s):  return 0 <= s[0] < ROWS and 0 <= s[1] < COLS and s not in WALLS
def sidx(s):  return s[0]*COLS + s[1]

def step(s, a):                                  # deterministic; +1 only at goal
    dr, dc = ACTS[a]; ns = (s[0]+dr, s[1]+dc)
    if not free(ns): ns = s                      # walls / borders bounce back
    if ns == GOAL:   return ns, 1.0, True
    return ns, 0.0, False

def argmax_rand(row, rng):                        # break ties at random (crucial early on)
    cand = np.flatnonzero(row == row.max())
    return int(cand[rng.integers(len(cand))])

def dyna_q(n_plan, episodes=50, alpha=0.1, gamma=0.95, eps=0.1, seed=0, cap=2000):
    rng = np.random.default_rng(seed)
    Q = np.zeros((ROWS*COLS, nA))
    model = {}                                    # learned model: (s_idx,a) -> (r, s'_idx, done)
    steps_per_ep = []
    for _ in range(episodes):
        s, n_steps, done = START, 0, False
        while not done and n_steps < cap:
            si = sidx(s)
            a = int(rng.integers(nA)) if rng.random() < eps else argmax_rand(Q[si], rng)
            ns, r, done = step(s, a); nsi = sidx(ns)
            # ----- REAL update (ordinary Q-learning backup) -----
            target = r + (0 if done else gamma * Q[nsi].max())
            Q[si, a] += alpha * (target - Q[si, a])
            # ----- learn the model: remember what really happened -----
            model[(si, a)] = (r, nsi, done)
            # ----- PLAN: n updates on transitions sampled FROM THE MODEL (no real steps) -----
            if n_plan:
                keys = list(model.keys())
                for _ in range(n_plan):
                    (psi, pa) = keys[rng.integers(len(keys))]
                    pr, pnsi, pdone = model[(psi, pa)]
                    pt = pr + (0 if pdone else gamma * Q[pnsi].max())
                    Q[psi, pa] += alpha * (pt - Q[psi, pa])    # SAME backup, imagined transition
            s, n_steps = ns, n_steps + 1
        steps_per_ep.append(n_steps)
    return steps_per_ep

def avg(n_plan, seeds=20):                         # average steps/episode over 20 seeds
    return np.array([dyna_q(n_plan, seed=s) for s in range(seeds)]).mean(axis=0)

def steps_until_good(curve, thresh=20):            # cumulative REAL steps to first near-optimal episode
    cum = 0
    for ep, v in enumerate(curve):
        cum += v
        if v <= thresh: return ep+1, int(cum)
    return None, int(cum)

for n in (0, 5, 50):
    ep, real = steps_until_good(avg(n))
    tag = "Q-learning" if n == 0 else f"Dyna-Q (n={n}) "
    print(f"{tag}: near-optimal by episode {ep:2d}  after {real:5d} REAL env steps")
# Optimal path length = 14 steps.
# Q-learning   : near-optimal by episode 28  after  4409 REAL env steps
# Dyna-Q (n=5) : near-optimal by episode  6  after  1156 REAL env steps
# Dyna-Q (n=50): near-optimal by episode  4  after   991 REAL env steps
# Planning lets Dyna reach a good policy with ~4x FEWER real interactions.`
  };

  /* -------------------------------------------------------------------------- */
  window.CODEVIZ["rl-model-based"] = {
    question: "Does planning on a learned model let Dyna-Q reach the goal in fewer REAL environment steps than plain Q-learning? Plot steps-to-goal per episode for n=0 (plain Q-learning) vs n=5 vs n=50 planning steps.",
    charts: [{
      type: "line",
      title: "Dyna-Q on the 6x9 maze: steps-to-goal per episode (lower = better; optimal = 14). More planning ⇒ good policy in far fewer real episodes.",
      xlabel: "episode (each costs real environment steps)",
      ylabel: "steps to reach goal (log scale; mean of 20 seeds)",
      logy: true,
      series: [
        { name: "Q-learning (n=0 planning)", color: "#ff7b72", points: [
          [1,924],[2,462],[3,454],[4,391],[5,326],[6,195],[7,195],[8,130],[9,135],[10,163],
          [11,107],[12,99],[13,87],[14,106],[15,90],[16,84],[17,70],[18,56],[19,42],[20,45],
          [22,35],[24,25],[26,24],[28,19],[30,19],[34,17],[38,18],[42,18],[46,18],[50,18] ] },
        { name: "Dyna-Q (n=5 planning)", color: "#4ea1ff", points: [
          [1,831],[2,175],[3,66],[4,44],[5,24],[6,18],[7,17],[8,17],[9,17],[10,18],
          [12,16],[14,17],[16,17],[18,17],[20,18],[24,16],[28,17],[34,17],[42,17],[50,16] ] },
        { name: "Dyna-Q (n=50 planning)", color: "#3fb950", points: [
          [1,863],[2,89],[3,23],[4,17],[5,17],[6,16],[7,17],[8,16],[9,16],[10,17],
          [12,17],[14,16],[16,17],[18,17],[20,17],[24,17],[28,16],[34,17],[42,17],[50,16] ] }
      ]
    }],
    caption: "Real outputs of the NumPy code below (mean of 20 seeds; log y-axis; optimal path = 14 steps). Plain Q-learning (n=0) only settles near optimal around episode 28 (≈4409 real environment steps); Dyna-Q with n=5 planning steps is near optimal by episode 6 (≈1156 real steps), and n=50 by episode 4 (≈991). Same real experience, but each real step is reused in many imagined planning backups — roughly a 4x cut in real interactions. The catch (not shown): on a stochastic or changing maze the learned model would be wrong, and planning on a wrong model degrades the policy — model error is the price of this sample efficiency.",
    code: `import numpy as np

# Classic 6x9 Dyna maze; start (2,0), goal (0,8); deterministic; +1 only at goal.
ROWS, COLS = 6, 9
WALLS = {(1,2),(2,2),(3,2),(4,5),(0,7),(1,7),(2,7)}
START, GOAL = (2,0), (0,8)
ACTS = {0:(-1,0),1:(1,0),2:(0,-1),3:(0,1)}; nA = 4
def free(s): return 0 <= s[0] < ROWS and 0 <= s[1] < COLS and s not in WALLS
def sidx(s): return s[0]*COLS + s[1]
def step(s, a):
    dr, dc = ACTS[a]; ns = (s[0]+dr, s[1]+dc)
    if not free(ns): ns = s
    if ns == GOAL:   return ns, 1.0, True
    return ns, 0.0, False
def argmax_rand(row, rng):
    cand = np.flatnonzero(row == row.max()); return int(cand[rng.integers(len(cand))])

def dyna_q(n_plan, episodes=50, alpha=0.1, gamma=0.95, eps=0.1, seed=0, cap=2000):
    rng = np.random.default_rng(seed)
    Q = np.zeros((ROWS*COLS, nA)); model = {}; out = []
    for _ in range(episodes):
        s, t, done = START, 0, False
        while not done and t < cap:
            si = sidx(s)
            a = int(rng.integers(nA)) if rng.random() < eps else argmax_rand(Q[si], rng)
            ns, r, done = step(s, a); nsi = sidx(ns)
            Q[si,a] += alpha*(r + (0 if done else gamma*Q[nsi].max()) - Q[si,a])   # real
            model[(si,a)] = (r, nsi, done)                                          # learn model
            if n_plan:                                                             # plan
                keys = list(model.keys())
                for _ in range(n_plan):
                    psi, pa = keys[rng.integers(len(keys))]
                    pr, pnsi, pdone = model[(psi,pa)]
                    Q[psi,pa] += alpha*(pr + (0 if pdone else gamma*Q[pnsi].max()) - Q[psi,pa])
            s, t = ns, t + 1
        out.append(t)
    return out

def avg(n, seeds=20): return np.array([dyna_q(n, seed=s) for s in range(seeds)]).mean(axis=0)
for n in (0, 5, 50):
    c = avg(n); print(f"n={n:2d}", [int(round(x)) for x in c])
# n= 0 -> settles ~18 steps/ep only after ~episode 28 (slow; needs many real steps)
# n= 5 -> at/near optimal (~17) by episode ~6
# n=50 -> at/near optimal (~17) by episode ~4
# Optimal path length is 14. Dyna reaches good policy in far fewer REAL steps.`
  };
})();
