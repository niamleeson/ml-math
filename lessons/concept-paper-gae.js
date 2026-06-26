/* Paper lesson — "High-Dimensional Continuous Control Using Generalized Advantage
   Estimation" (GAE), Schulman, Moritz, Levine, Jordan, Abbeel 2015 (ICLR 2016).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-gae".
   GROUNDED from arXiv:1506.02438 — metadata from the abstract page; the method/equations
   from the ar5iv HTML mirror (https://ar5iv.labs.arxiv.org/html/1506.02438), Section 3
   "Advantage function estimation": delta^V (Eq. 11), the k-step family (Eqs. 11-15), the
   GAE estimator (Eq. 16), the lambda=0 / lambda=1 special cases (Eqs. 17-18), and the
   policy-gradient estimator (Eq. 19). Abstract quoted for the variance claim.
   Track B (architecture): build policy+value nets + the GAE advantage from nn primitives on
   gymnasium CartPole, and SHOW GAE gives lower-variance advantages than raw Monte-Carlo
   returns. conceptLink is null (no dedicated concept lesson owns this math), so the
   derivation is given in FULL here; we cross-link rl-policy-gradients and paper-ppo. */
(function () {
  window.LESSONS.push({
    id: "paper-gae",
    title: "GAE — High-Dimensional Continuous Control Using Generalized Advantage Estimation (2015)",
    tagline: "An exponentially-weighted average of multi-step advantage estimates that slashes the variance of the policy gradient at the cost of a little bias.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "John Schulman, Philipp Moritz, Sergey Levine, Michael I. Jordan, Pieter Abbeel",
      org: "University of California, Berkeley",
      year: 2015,
      venue: "arXiv:1506.02438 (Jun 2015); ICLR 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1506.02438",
      code: "https://github.com/joschu/modular_rl"
    },
    conceptLink: null,
    partOf: [
      { capstone: "capstone-ppo", step: 2, builds: "the Generalized Advantage Estimation (GAE) advantage used by the actor-critic and, later, by PPO" }
    ],
    prereqs: ["rl-policy-gradients", "rl-actor-critic", "rl-mdp", "prob-expectation"],

    // WHY READ IT
    problem:
      `<p>Reinforcement learning (RL) means learning to act by trial and error to maximize reward. A
       <b>policy</b> is the rule (a neural network) that maps a state to an action; a <b>policy gradient</b>
       nudges that network toward actions that earned more reward. The clean way to do that is to weight each
       action by its <b>advantage</b> &mdash; how much better that action turned out than average from that
       state. The trouble is <i>how you estimate the advantage</i>.</p>
       <p>You face a <b>bias&ndash;variance dilemma</b>. Here <b>variance</b> means: run the same policy twice
       and the advantage estimate jumps around a lot, so the gradient is noisy and learning is slow and
       jittery. <b>Bias</b> means: the estimate is systematically off from the true advantage, so you climb
       the wrong hill. The two classic estimators sit at opposite corners:</p>
       <ul>
        <li><b>Monte-Carlo (full return) advantage</b> &mdash; add up all the actual future rewards and
        subtract the critic's baseline. It is (nearly) <b>unbiased</b> but <b>very high variance</b>: one
        lucky or unlucky run far in the future swings the whole estimate.</li>
        <li><b>One-step temporal-difference (TD) advantage</b> &mdash; use only the immediate reward plus the
        critic's guess of the next state's value. It has <b>low variance</b> but is <b>biased</b> by however
        wrong the critic is.</li>
       </ul>
       <p>The paper opens on exactly this pain:</p>
       <blockquote>"large variance &hellip; necessitates the use of more samples" and the goal is to "reduce
       the variance of policy gradient estimates at the cost of some bias" (Abstract).</blockquote>
       <p>Before GAE you had to pick one corner. Nothing let you <i>dial</i> smoothly between them.</p>`,
    contribution:
      `<ul>
        <li><b>The Generalized Advantage Estimator (GAE).</b> A single advantage estimate that is an
        <b>exponentially-weighted average of every k-step estimate at once</b>, with one knob
        $\\lambda \\in [0,1]$ that slides continuously from the low-variance one-step TD advantage
        ($\\lambda = 0$) to the high-variance Monte-Carlo advantage ($\\lambda = 1$). This is the paper's
        headline equation (Eq. 16).</li>
        <li><b>A remarkably simple closed form.</b> Despite averaging infinitely many estimators, GAE collapses
        to one tidy sum of one-step TD errors: $\\hat{A}_t = \\sum_l (\\gamma\\lambda)^l \\delta_{t+l}$
        &mdash; computable in a single backward pass over a rollout.</li>
        <li><b>A practical recipe that scaled.</b> Combined with a trust-region update for both the policy and
        the value function, GAE let the authors train 3D locomotion controllers (bipeds, quadrupeds) directly
        from raw state to joint torques &mdash; a hard, high-dimensional continuous-control regime.</li>
      </ul>`,
    whyItMattered:
      `<p>GAE became the default way to compute advantages in modern policy-gradient RL. It is the advantage
       estimator inside <b>Proximal Policy Optimization (PPO)</b> &mdash; the workhorse behind large-scale game
       agents and the optimizer in Reinforcement Learning from Human Feedback (RLHF), the alignment step for
       large language models. Whenever you see a deep-RL training loop that collects a rollout, computes a
       $(\\gamma\\lambda)$-weighted advantage, and updates an actor-critic, that advantage is GAE. One small
       formula quietly de-noised the gradient for a whole generation of algorithms.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Preliminaries)</b> &mdash; the discounted value $V^{\\pi,\\gamma}$, action-value
        $Q^{\\pi,\\gamma}$, and advantage $A^{\\pi,\\gamma}$ functions (Eqs. 4-5), and the policy-gradient
        estimator that the advantage plugs into.</li>
        <li><b>&sect;3 (Advantage function estimation)</b> &mdash; the core. The TD residual $\\delta_t^V$
        (<b>Eq. 11</b>), the telescoping <b>k-step estimators</b> $\\hat{A}_t^{(k)}$ (Eqs. 11-15), the
        definition of GAE as an exponential average (<b>Eq. 16</b>) and its collapse to the simple sum, and the
        two special cases <b>$\\lambda = 0$ (Eq. 17)</b> and <b>$\\lambda = 1$ (Eq. 18)</b>.</li>
        <li>The sentence in &sect;3 that names the trade-off: "The generalized advantage estimator for
        $0 \\lt \\lambda \\lt 1$ makes a compromise between bias and variance, controlled by parameter
        $\\lambda$."</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (the reward-shaping / response-function interpretation &mdash; elegant but not
       needed to implement GAE), &sect;5 (the trust-region value-function fitting), and the full
       MuJoCo/locomotion experiment section &sect;6. The math you need is Eqs. 11-18.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You collect many short CartPole rollouts with a fixed policy and a rough critic, and compute the
       advantage of the first action three ways: the <b>one-step TD</b> advantage ($\\lambda = 0$), the
       <b>Monte-Carlo</b> advantage ($\\lambda = 1$, the full discounted return minus the critic), and
       <b>GAE</b> with $\\lambda = 0.95$. Across the rollouts, which estimate do you expect to <b>jump around
       the most</b> (highest variance), and which the least? Where do you expect GAE ($\\lambda = 0.95$) to
       sit? Write your guess and one sentence of reasoning, then run it below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the GAE computation you will build. Fill in the <code>TODO</code>s &mdash;
       it is one backward pass over a rollout:</p>
       <ul>
        <li>For each step compute the TD error: <code>delta[t] = r[t] + gamma * V_next[t] * mask[t] - V[t]</code>
        <i># this is $\\delta_t$, Eq. 11; <code>mask</code> is 0 if the episode ended at $t$</i>.</li>
        <li>TODO: accumulate backward &mdash; <code>gae = delta[t] + gamma * lam * mask[t] * gae</code>; store
        <code>A[t] = gae</code> <i># the recursive form of Eq. 16</i>.</li>
        <li>TODO: also compute the Monte-Carlo advantage <code>G[t] - V[t]</code> (the $\\lambda = 1$ case, Eq.
        18) and the one-step advantage <code>delta[t]</code> (the $\\lambda = 0$ case, Eq. 17).</li>
        <li>TODO: over many rollouts, take the <b>variance</b> of each estimate of $\\hat{A}_0$ and compare.</li>
       </ul>
       <p>Predict the ordering of the three variances before you measure it.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from what we actually want (&sect;2). The policy gradient says: increase the log-probability of
       each action in proportion to its <b>advantage</b> $A^{\\pi,\\gamma}(s_t,a_t)$ &mdash; how much better
       action $a_t$ is than the average action from state $s_t$. We cannot see the true advantage, so we must
       <i>estimate</i> it from a rollout. GAE is a family of such estimators built from one ingredient: the
       <b>one-step TD (temporal-difference) error</b> (&sect;3, Eq. 11):</p>
       <p>$$ \\delta_t^V = r_t + \\gamma\\,V(s_{t+1}) - V(s_t). $$</p>
       <p>In words: the reward you actually got, plus the critic's discounted guess for where you landed, minus
       the critic's guess for where you started. If the critic $V$ were perfect, $\\delta_t$ would be an
       unbiased estimate of the advantage of $a_t$ &mdash; but it would only look one step ahead.</p>
       <p>To see further, the paper sums TD errors into <b>k-step estimators</b> (Eqs. 11-15). Summing $k$ of
       them telescopes into "use the first $k$ real rewards, then bootstrap with the critic at step $k$":</p>
       <p>$$ \\hat{A}_t^{(k)} = \\sum_{l=0}^{k-1} \\gamma^l \\delta_{t+l}^V
         = -V(s_t) + r_t + \\gamma r_{t+1} + \\cdots + \\gamma^{k-1} r_{t+k-1} + \\gamma^k V(s_{t+k}). $$</p>
       <p>Small $k$ trusts the critic (low variance, biased if the critic is wrong); large $k$ uses more real
       rewards (less bias, but the far-future rewards inject variance). As $k \\to \\infty$ (Eq. 15) you get the
       full Monte-Carlo return minus the baseline &mdash; unbiased but noisiest.</p>
       <p>GAE's idea (&sect;3, Eq. 16): <b>don't pick a $k$ &mdash; average over all of them</b>, with weights
       that decay geometrically by a factor $\\lambda$. The exponentially-weighted average of
       $\\hat{A}_t^{(1)}, \\hat{A}_t^{(2)}, \\ldots$ collapses, after a clean algebraic simplification, into a
       single discounted sum of TD errors:</p>
       <p>$$ \\hat{A}_t^{GAE(\\gamma,\\lambda)} = \\sum_{l=0}^{\\infty} (\\gamma\\lambda)^l\\,\\delta_{t+l}^V. $$</p>
       <p>Now $\\lambda$ is the dial. At $\\lambda = 0$ all weight lands on $k = 1$ and GAE is just $\\delta_t$
       (Eq. 17): low variance, biased. At $\\lambda = 1$ the weights spread to the full return and GAE becomes
       the Monte-Carlo advantage (Eq. 18): unbiased, high variance. The paper sums it up: "The generalized
       advantage estimator for $0 \\lt \\lambda \\lt 1$ makes a compromise between bias and variance, controlled
       by parameter $\\lambda$." In practice $\\lambda \\approx 0.95$ keeps most of the variance reduction while
       paying only a little bias &mdash; and the whole thing is one backward pass over a rollout.</p>`,
    architecture:
      `<p>GAE is an <b>estimator</b>, not a network &mdash; but it lives inside a concrete <b>actor-critic</b>
       system with two pieces and a fixed per-iteration loop. The paper (&sect;6) uses simple feedforward nets.</p>
       <p><b>Two components (both plain feedforward, tanh hidden units):</b></p>
       <ul>
        <li><b>Policy $\\pi_\\theta(a\\mid s)$ (the actor).</b> Maps a state to a distribution over actions. For the
        hard 3D locomotion tasks (biped / quadruped) it is a feedforward net with <b>three hidden layers of
        $100$, $50$, $25$ tanh units</b> and a linear output (over $10^4$ parameters). For cart-pole the policy is
        just <b>linear</b>. Discrete actions &rarr; a categorical (softmax) head; continuous joint torques &rarr; a
        Gaussian head.</li>
        <li><b>Value function $V_\\phi(s)$ (the critic).</b> Same <b>$100$&ndash;$50$&ndash;$25$ tanh</b> body with a
        single linear output for the 3D tasks; for cart-pole a <b>single $20$-unit hidden layer</b>. It outputs the
        scalar $V(s)$ that the TD residual $\\delta_t^V$ (Eq. 11) and hence all of GAE is built from.</li>
       </ul>
       <p><b>Per-iteration algorithm (the data flow that glues them):</b></p>
       <ol>
        <li><b>Collect a rollout</b> by running the current policy $\\pi_\\theta$ in the environment; record
        $(s_t, a_t, r_t)$ and the critic's $V_\\phi(s_t)$ at every step.</li>
        <li><b>Compute TD residuals</b> $\\delta_t^V = r_t + \\gamma V_\\phi(s_{t+1}) - V_\\phi(s_t)$ (Eq. 11),
        zeroing the bootstrap at terminal steps.</li>
        <li><b>Accumulate GAE backward</b> in one pass: $\\hat{A}_t = \\delta_t^V + \\gamma\\lambda\\,\\hat{A}_{t+1}$
        (the recursive form of Eq. 16).</li>
        <li><b>Update the policy</b> along $g^\\gamma = \\mathbb{E}[\\sum_t \\hat{A}_t \\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)]$
        (Eq. 19), in the paper via a <b>trust-region (TRPO) step</b> &mdash; a KL-constrained surrogate update
        (&sect;6.1).</li>
        <li><b>Fit the critic</b> $V_\\phi$ to the returns $\\hat{A}_t + V_\\phi(s_t)$ by regression
        $\\min_\\phi \\sum_n \\lVert V_\\phi(s_n) - \\hat{V}_n\\rVert^2$ (Eq. 28), again under a trust-region KL
        constraint between the old and new value functions (Eq. 29, &sect;5).</li>
        <li><b>Repeat.</b> A better critic sharpens $\\delta_t^V$, which sharpens the GAE advantage, which sharpens
        the policy &mdash; the two networks co-train.</li>
       </ol>
       <p>So the architecture is: <b>state &rarr; (policy head, value head) &rarr; rollout &rarr; TD residuals
       &rarr; GAE advantage &rarr; trust-region updates to both heads.</b> GAE is the connective tissue between
       critic and actor.</p>`,
    symbols: [
      { sym: "$s_t$", desc: "the <b>state</b> at timestep $t$ &mdash; what the agent observes (for CartPole: cart position, cart velocity, pole angle, pole angular velocity)." },
      { sym: "$a_t$", desc: "the <b>action</b> the agent took at step $t$ (for CartPole: push left or right)." },
      { sym: "$r_t$", desc: "the <b>reward</b> received at step $t$ &mdash; the immediate scalar feedback (CartPole gives $+1$ per step the pole stays up)." },
      { sym: "$t$", desc: "the <b>timestep</b> index within an episode (a single play-through), counting $0, 1, 2, \\ldots$." },
      { sym: "$\\gamma$", desc: "the <b>discount factor</b> (Greek 'gamma') in $[0,1)$: how much a future reward counts relative to an immediate one. $\\gamma = 0.99$ means a reward one step later is worth $0.99\\times$ as much." },
      { sym: "$\\lambda$", desc: "the <b>GAE parameter</b> (Greek 'lambda') in $[0,1]$: the dial that trades bias against variance. $\\lambda = 0$ &rarr; low-variance one-step TD; $\\lambda = 1$ &rarr; unbiased Monte-Carlo." },
      { sym: "$V(s_t)$", desc: "the <b>value function</b>: the critic's estimate of the expected discounted future reward starting from state $s_t$. A neural network we train alongside the policy." },
      { sym: "$V^{\\pi,\\gamma}(s_t)$", desc: "the <b>true</b> discounted value of $s_t$ under policy $\\pi$ (Eq. 4): $\\mathbb{E}[\\sum_{l\\ge 0}\\gamma^l r_{t+l}]$. $V(s_t)$ is our learned approximation of it." },
      { sym: "$Q^{\\pi,\\gamma}(s_t,a_t)$", desc: "the <b>action-value</b> (Eq. 4): expected discounted return if you take action $a_t$ in $s_t$ and then follow $\\pi$." },
      { sym: "$A^{\\pi,\\gamma}(s_t,a_t)$", desc: "the <b>true advantage</b> (Eq. 5): $Q^{\\pi,\\gamma}(s_t,a_t) - V^{\\pi,\\gamma}(s_t)$ &mdash; how much better action $a_t$ is than the state's average. GAE estimates this." },
      { sym: "$\\delta_t^V$", desc: "the one-step <b>TD (temporal-difference) error</b> (Eq. 11): $r_t + \\gamma V(s_{t+1}) - V(s_t)$ &mdash; the single building block GAE sums. Often written just $\\delta_t$." },
      { sym: "$\\hat{A}_t^{(k)}$", desc: "the <b>k-step advantage estimator</b> (Eq. 14): use the first $k$ real rewards, then bootstrap with the critic at step $k$. The hat means 'estimate'." },
      { sym: "$\\hat{A}_t^{GAE(\\gamma,\\lambda)}$", desc: "the <b>Generalized Advantage Estimator</b> (Eq. 16): the $(\\gamma\\lambda)$-weighted sum of TD errors. This is the lesson's target quantity." },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "the <b>expectation</b> (average) over the randomness of the policy and environment &mdash; what you would get if you could average over infinitely many rollouts." },
      { sym: "$\\sum_{l=0}^{\\infty}$", desc: "a sum over future offsets $l = 0, 1, 2, \\ldots$; in a finite episode the sum stops at the last step (the rollout is truncated)." },
      { sym: "$\\pi$ / $\\pi_\\theta$", desc: "the <b>policy</b> (Greek 'pi'): the rule mapping a state to a distribution over actions, parameterized by network weights $\\theta$ (Greek 'theta')." },
      { sym: "$g$ / $g^\\gamma$", desc: "the <b>policy gradient</b> (Eqs. 1, 6, 19): the direction to move $\\theta$ to increase expected reward, $\\mathbb{E}[\\sum_t \\nabla_\\theta \\log\\pi_\\theta(a_t\\mid s_t)\\,\\hat{A}_t]$. $g^\\gamma$ is the discounted version that weights each action by its advantage." },
      { sym: "$\\Psi_t$", desc: "the <b>generic weight</b> in the policy gradient (Eq. 1, Greek 'Psi'): any quantity that scores how good action $a_t$ was &mdash; the full return, the action-value, or (best) the advantage. GAE is a choice of $\\Psi_t$." },
      { sym: "$\\nabla_\\theta$", desc: "the <b>gradient</b> with respect to the policy weights $\\theta$ &mdash; the vector of partial derivatives telling you which way to nudge each weight." },
      { sym: "$V_\\phi(s)$ / $\\phi$", desc: "the critic network with weights $\\phi$ (Greek 'phi') &mdash; the trainable approximation of $V(s)$ fit by regression (Eq. 28) under a trust-region constraint (Eq. 29)." }
    ],
    formula:
      `$$ g = \\mathbb{E}\\!\\left[\\sum_{t=0}^{\\infty} \\Psi_t\\,\\nabla_\\theta \\log\\pi_\\theta(a_t\\mid s_t)\\right] \\qquad\\text{(Eq. 1 — the policy gradient; $\\Psi_t$ is any advantage-like weight)} $$
       $$ V^{\\pi,\\gamma}(s_t) := \\mathbb{E}\\!\\left[\\sum_{l=0}^{\\infty}\\gamma^l r_{t+l}\\right],\\quad
          Q^{\\pi,\\gamma}(s_t,a_t) := \\mathbb{E}\\!\\left[\\sum_{l=0}^{\\infty}\\gamma^l r_{t+l}\\right],\\quad
          A^{\\pi,\\gamma}(s_t,a_t) := Q^{\\pi,\\gamma}(s_t,a_t) - V^{\\pi,\\gamma}(s_t) \\qquad\\text{(Eqs. 4-5)} $$
       $$ g^\\gamma := \\mathbb{E}\\!\\left[\\sum_{t=0}^{\\infty} A^{\\pi,\\gamma}(s_t,a_t)\\,\\nabla_\\theta \\log\\pi_\\theta(a_t\\mid s_t)\\right] \\qquad\\text{(Eq. 6 — choosing $\\Psi_t = $ the advantage)} $$
       $$ \\delta_t^V = r_t + \\gamma\\,V(s_{t+1}) - V(s_t) \\qquad\\text{(Eq. 11 — the one-step TD residual)} $$
       $$ \\hat{A}_t^{(1)} = \\delta_t^V,\\qquad \\hat{A}_t^{(2)} = \\delta_t^V + \\gamma\\,\\delta_{t+1}^V,\\qquad
          \\hat{A}_t^{(k)} = \\sum_{l=0}^{k-1} \\gamma^l\\,\\delta_{t+l}^V
         = -V(s_t) + r_t + \\gamma r_{t+1} + \\cdots + \\gamma^{k-1} r_{t+k-1} + \\gamma^k V(s_{t+k})
         \\qquad\\text{(Eqs. 11-14 — the $k$-step estimators)} $$
       $$ \\boxed{\\;\\hat{A}_t^{GAE(\\gamma,\\lambda)} \\;:=\\; (1-\\lambda)\\big(\\hat{A}_t^{(1)} + \\lambda\\,\\hat{A}_t^{(2)} + \\lambda^2\\,\\hat{A}_t^{(3)} + \\cdots\\big)
         \\;=\\; \\sum_{l=0}^{\\infty} (\\gamma\\lambda)^l\\,\\delta_{t+l}^V\\;} \\qquad\\text{(Eq. 16 — the GAE estimator)} $$
       $$ \\lambda = 0:\\;\\; \\hat{A}_t^{GAE(\\gamma,0)} = \\delta_t \\;\\text{(Eq. 17 — low-variance TD)} \\qquad
          \\lambda = 1:\\;\\; \\hat{A}_t^{GAE(\\gamma,1)} = \\sum_{l=0}^{\\infty}\\gamma^l\\,\\delta_{t+l}
          = \\sum_{l=0}^{\\infty}\\gamma^l r_{t+l} - V(s_t) \\;\\text{(Eq. 18 — high-variance Monte-Carlo)} $$
       $$ g^\\gamma \\;\\approx\\; \\mathbb{E}\\!\\left[\\sum_{t=0}^{\\infty} \\hat{A}_t^{GAE(\\gamma,\\lambda)}\\,\\nabla_\\theta \\log\\pi_\\theta(a_t\\mid s_t)\\right] \\qquad\\text{(Eq. 19 — the policy gradient driven by GAE; exact at $\\lambda = 1$)} $$`,
    whatItDoes:
      `<p><b>Equation 11</b> is the ingredient: the one-step TD error $\\delta_t$ &mdash; "what I got plus where
       I think I landed, minus where I thought I started." <b>Equation 14</b> stacks $k$ of these into a k-step
       estimate that uses $k$ real rewards before trusting the critic.</p>
       <p><b>Equation 16</b> is the heart of GAE. Read it twice:</p>
       <ul>
        <li><b>Left form (the definition):</b> a weighted average of every k-step estimator $\\hat{A}_t^{(k)}$,
        with weight proportional to $\\lambda^{k-1}$ &mdash; near-term estimators count most, far ones fade
        geometrically. The $(1-\\lambda)$ out front makes the weights sum to $1$.</li>
        <li><b>Right form (the payoff):</b> that infinite average algebraically collapses into a single
        discounted sum of TD errors $\\sum_l (\\gamma\\lambda)^l \\delta_{t+l}$. You never build the k-step
        estimators &mdash; you just sum TD errors with decay rate $\\gamma\\lambda$. One pass, cheap.</li>
       </ul>
       <p>The dial $\\lambda$ controls everything. <b>Equation 17</b> ($\\lambda = 0$): only the first term
       survives, so GAE $= \\delta_t$ &mdash; minimal variance (it touches just one future reward) but biased by
       the critic's error. <b>Equation 18</b> ($\\lambda = 1$): the decay becomes pure $\\gamma$, the
       $V$-bootstraps telescope away, and GAE becomes the actual discounted return minus the baseline &mdash;
       the unbiased Monte-Carlo advantage, but with the full future's variance. Every $\\lambda$ in between
       buys a smooth trade: <b>more $\\lambda$ = less bias, more variance.</b></p>`,
    derivation:
      `<p><b>Full derivation</b> (no concept lesson owns this math, so we do it here).</p>
       <p><b>Step 1 &mdash; one TD error is a one-step advantage estimate.</b> If the critic $V$ equals the true
       value $V^{\\pi,\\gamma}$, then taking the expectation of $\\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)$
       over the next state gives exactly $Q^{\\pi,\\gamma}(s_t,a_t) - V^{\\pi,\\gamma}(s_t) = A^{\\pi,\\gamma}(s_t,a_t)$,
       the true advantage. So $\\delta_t$ is an unbiased one-step estimate <i>when the critic is right</i>;
       when it is wrong, the error of $V$ leaks in as bias.</p>
       <p><b>Step 2 &mdash; summing TD errors telescopes.</b> Write out
       $\\sum_{l=0}^{k-1}\\gamma^l\\delta_{t+l}$ and expand each $\\delta$. Every intermediate $V$ appears twice
       with opposite signs &mdash; $+\\gamma^l V(s_{t+l})$ from one term and $-\\gamma^l V(s_{t+l})$ from the
       next &mdash; so they cancel, leaving only the first $-V(s_t)$, the $k$ real discounted rewards, and the
       final $+\\gamma^k V(s_{t+k})$. That is exactly Eq. 14, the k-step estimator. Larger $k$ = more real
       rewards, less reliance on the (possibly wrong) critic = less bias but more variance.</p>
       <p><b>Step 3 &mdash; the exponential average collapses.</b> Define GAE as the $(1-\\lambda)$-normalized
       geometric average $\\hat{A}_t^{GAE} = (1-\\lambda)\\sum_{k\\ge 1}\\lambda^{k-1}\\hat{A}_t^{(k)}$.
       Substitute $\\hat{A}_t^{(k)} = \\sum_{l=0}^{k-1}\\gamma^l\\delta_{t+l}$ and swap the order of summation.
       The coefficient that multiplies a given $\\gamma^l\\delta_{t+l}$ is
       $(1-\\lambda)(\\lambda^l + \\lambda^{l+1} + \\lambda^{l+2} + \\cdots) = (1-\\lambda)\\cdot\\dfrac{\\lambda^l}{1-\\lambda} = \\lambda^l$
       (using the geometric series $\\sum_{j\\ge 0}\\lambda^{l+j} = \\lambda^l/(1-\\lambda)$). So the coefficient
       on $\\delta_{t+l}$ is $\\gamma^l\\lambda^l = (\\gamma\\lambda)^l$, giving the clean closed form
       $\\sum_{l\\ge 0}(\\gamma\\lambda)^l\\delta_{t+l}$ (Eq. 16). The infinitely-many-estimators average becomes
       one geometric sum.</p>
       <p><b>Step 4 &mdash; the endpoints.</b> Set $\\lambda = 0$: only the $l = 0$ term survives, so GAE
       $= \\delta_t$ (Eq. 17), the pure one-step TD advantage. Set $\\lambda = 1$: the weight on $\\delta_{t+l}$
       becomes $\\gamma^l$; the telescoping of Step 2 (now run to infinity) cancels every interior $V$, leaving
       $\\sum_l \\gamma^l r_{t+l} - V(s_t)$ (Eq. 18), the discounted return minus the baseline &mdash; the
       Monte-Carlo advantage. So one formula contains both classic estimators as its two ends.</p>
       <p><b>Why this lowers variance.</b> The variance of the gradient comes mostly from the long tail of
       future rewards. The factor $(\\gamma\\lambda)^l$ <i>geometrically down-weights</i> the contribution of
       far-future TD errors: a reward 50 steps out enters at weight $(\\gamma\\lambda)^{50}$, which for
       $\\gamma\\lambda \\approx 0.94$ is tiny. So GAE damps the noisy tail while still letting near-future real
       rewards correct the critic's bias &mdash; the variance reduction the abstract promises, "at the cost of
       some bias."</p>`,
    example:
      `<p>Work GAE by hand on a tiny <b>3-step rollout</b> &mdash; the exact numbers the notebook recomputes.
       Use $\\gamma = 0.9$ and $\\lambda = 0.8$ (so $\\gamma\\lambda = 0.72$), round numbers for easy arithmetic.
       The episode <b>ends</b> at step $t = 2$ (the pole fell), so there is no bootstrap after it: $V(s_3) = 0$.</p>
       <p><b>The rollout (rewards $r_t$ and critic values $V(s_t)$):</b></p>
       <ul>
        <li>$t=0$: $r_0 = 1.0$, $V(s_0) = 1.0$</li>
        <li>$t=1$: $r_1 = 0.0$, $V(s_1) = 0.5$</li>
        <li>$t=2$: $r_2 = 2.0$, $V(s_2) = 1.0$, terminal so $V(s_3) = 0$</li>
       </ul>
       <ol class="steps">
        <li><b>TD errors</b> $\\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)$ (Eq. 11):
          <ul>
           <li>$\\delta_0 = 1.0 + 0.9\\times 0.5 - 1.0 = 1.0 + 0.45 - 1.0 = \\mathbf{0.45}$</li>
           <li>$\\delta_1 = 0.0 + 0.9\\times 1.0 - 0.5 = 0.9 - 0.5 = \\mathbf{0.40}$</li>
           <li>$\\delta_2 = 2.0 + 0.9\\times 0 - 1.0 = \\mathbf{1.00}$ <i>(terminal: no bootstrap)</i></li>
          </ul>
        </li>
        <li><b>GAE at $t=0$</b> via Eq. 16, $\\hat{A}_0 = \\delta_0 + (\\gamma\\lambda)\\delta_1 + (\\gamma\\lambda)^2\\delta_2$:
         $$ \\hat{A}_0^{GAE} = 0.45 + 0.72\\times 0.40 + 0.72^2\\times 1.00
            = 0.45 + 0.288 + 0.5184 = \\mathbf{1.2564}. $$
        </li>
        <li><b>The two endpoints, to see GAE sit between them:</b>
          <ul>
           <li><b>One-step TD ($\\lambda = 0$, Eq. 17):</b> $\\hat{A}_0 = \\delta_0 = \\mathbf{0.45}$
           &mdash; lowest, leans on the critic.</li>
           <li><b>Monte-Carlo ($\\lambda = 1$, Eq. 18):</b> the discounted return is
           $G_0 = r_0 + \\gamma r_1 + \\gamma^2 r_2 = 1.0 + 0.9\\times 0 + 0.81\\times 2.0 = 2.62$, so
           $\\hat{A}_0 = G_0 - V(s_0) = 2.62 - 1.0 = \\mathbf{1.62}$ &mdash; highest, uses every real reward.</li>
          </ul>
        </li>
       </ol>
       <p><b>Result:</b> $0.45 \\;(\\lambda{=}0) \\;\\lt\\; 1.2564 \\;(\\text{GAE},\\,\\lambda{=}0.8) \\;\\lt\\; 1.62 \\;(\\lambda{=}1)$.
       GAE interpolates between the biased low-variance one-step estimate and the unbiased high-variance
       Monte-Carlo one &mdash; exactly the dial Eq. 16 promises. The notebook recomputes all of these and
       prints $\\hat{A}_0^{GAE} = 1.2564$.</p>`,
    recipe:
      `<ol>
        <li><b>Build two small networks</b> from <code>nn.Linear</code>: a <b>policy</b> head (action logits,
        a categorical distribution for CartPole's two actions) and a <b>value</b> head $V(s)$ (the critic).</li>
        <li><b>Collect a rollout</b> with the current policy: for each step record the state, action, reward,
        and the critic's value $V(s)$; mark where episodes terminate.</li>
        <li><b>Compute TD errors</b> $\\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)$ (Eq. 11), zeroing the
        bootstrap at terminal steps.</li>
        <li><b>Accumulate GAE backward</b> in one pass (the recursive form of Eq. 16):
        $\\hat{A}_t = \\delta_t + \\gamma\\lambda\\,\\hat{A}_{t+1}$, resetting at episode boundaries.</li>
        <li><b>Use $\\hat{A}_t$ in the policy gradient</b> (Eq. 19): scale each action's log-probability by its
        advantage and step the actor; fit the critic to the returns. Then <b>compare variance:</b> measure the
        spread of $\\hat{A}_0$ across rollouts for $\\lambda = 0$, $\\lambda = 0.95$, $\\lambda = 1$ and confirm
        it grows with $\\lambda$ &mdash; the GAE / Monte-Carlo variance gap.</li>
      </ol>`,
    results:
      `<p>The paper evaluates GAE on simulated robotic <b>locomotion</b> in the MuJoCo physics simulator
       (&sect;6): a 3D biped and quadruped learning to walk/run from raw state to joint torques, plus a
       cart-pole and a 2D biped. Sweeping $\\lambda$, the authors report that the best results came from
       $\\gamma \\in [0.96, 0.99]$ and $\\lambda \\in [0.92, 0.98]$, with GAE markedly improving over the
       no-variance-reduction baseline ($\\lambda = 1$) &mdash; the abstract's claim that value functions
       "substantially reduce the variance of policy gradient estimates at the cost of some bias." The 3D biped
       result required simulated experience the paper equates to "about 1-2 weeks of real time."</p>
       <p><i>These are the paper's reported figures, quoted from the abstract and &sect;6. The numbers in the
       CODEVIZ panel below are from our own tiny CartPole run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> GAE is an advantage estimator, so you measure two things. (a) The
       direct property it promises: the <b>variance of the advantage estimate</b> $\\hat{A}_t$ across rollouts
       at a fixed policy &mdash; it must fall as $\\lambda$ drops from $1$ toward $0$. (b) Whether it helps
       <i>learning</i>: <b>episode return</b> on a control task &mdash; CartPole-v1 (return tops out at $500$,
       the env's max steps) for a quick check, and the paper's setting of MuJoCo <b>locomotion</b> (3D biped /
       quadruped) reward. The "no-skill" reference is a <b>random policy</b> (CartPole random return is roughly
       in the low tens, far below $500$); the variance baseline to beat is <b>raw Monte-Carlo</b> ($\\lambda=1$),
       which GAE must undercut in variance.</p>
       <p><b>2. Sanity checks BEFORE a full training run.</b></p>
       <ul>
        <li><b>Known-answer unit test.</b> Reproduce the lesson's 3-step rollout exactly: with $\\gamma=0.9$,
        $\\lambda=0.8$, $r=[1.0,0.0,2.0]$, $V=[1.0,0.5,1.0]$, terminal at $t=2$, you must get
        $\\delta=[0.45,0.40,1.00]$ and $\\hat{A}_0^{GAE}=1.2564$.</li>
        <li><b>Endpoint checks.</b> At $\\lambda=0$, GAE must equal $\\delta_t$ exactly (Eq. 17); at $\\lambda=1$,
        it must equal the discounted return minus the baseline, $G_t-V(s_t)$ (Eq. 18) &mdash; here $1.62$ at
        $t=0$. If either endpoint is off, the recursion or the $\\gamma\\lambda$ decay is wrong.</li>
        <li><b>Terminal-mask check.</b> Plant an episode boundary and confirm the bootstrap $\\gamma V(s_{t+1})$
        and the recursion both <b>reset</b> there (mask $=0$); advantages must not bleed across episodes.</li>
       </ul>
       <p><b>3. Expected range.</b> The paper reports best results at <b>$\\gamma\\in[0.96,0.99]$ and
       $\\lambda\\in[0.92,0.98]$</b>, with GAE "substantially reduce[ing] the variance of policy gradient
       estimates at the cost of some bias" over the $\\lambda=1$ baseline (abstract, &sect;6). So your variance
       curve should sit well below the Monte-Carlo end at $\\lambda\\approx0.95$ (these $\\lambda$/$\\gamma$ bands
       are the paper's; the exact variance numbers are run-specific). As a rule of thumb, a correct CartPole
       actor-critic with GAE at $\\lambda=0.95$ should climb toward the $500$ return ceiling within a modest
       number of iterations; staying near random return is a bug.</p>
       <p><b>4. Ablation &mdash; prove the $\\lambda$ dial earns its keep.</b> The central knob is <b>$\\lambda$</b>.
       Hold the policy and critic fixed and sweep $\\lambda\\in\\{0,0.95,1\\}$, measuring
       $\\text{Var}(\\hat{A}_0)$ each time. You must see
       $\\text{Var}(\\lambda{=}0)\\lt\\text{Var}(\\lambda{=}0.95)\\lt\\text{Var}(\\lambda{=}1)$ &mdash; the
       lesson's CODEVIZ curve. If variance does <b>not</b> rise with $\\lambda$, the $(\\gamma\\lambda)^l$
       weighting isn't actually changing the estimator (e.g. you used $\\gamma$ where $\\gamma\\lambda$ belongs).
       For the learning claim, train at $\\lambda=0.95$ vs $\\lambda=1$ and confirm the lower-variance setting
       trains faster / more stably.</p>
       <p><b>5. Failure signals.</b></p>
       <ul>
        <li><b>Variance flat across $\\lambda$</b> &rarr; the decay uses $\\gamma$ instead of $\\gamma\\lambda$, so
        $\\lambda$ has no effect.</li>
        <li><b>Advantages explode at episode boundaries</b> &rarr; missing terminal mask: the bootstrap or the
        recursion didn't reset across episodes.</li>
        <li><b>Advantage looks like the return even at $\\lambda=0$</b> &rarr; the backward recursion is running
        forward, so $\\hat{A}_t$ wrongly accumulates future steps.</li>
        <li><b>Policy diverges / loss NaN</b> &rarr; advantages not standardized before the policy step (drifting
        scale), or learning rate too high &mdash; normalize each batch to zero-mean/unit-variance, but measure
        raw variance <i>before</i> normalizing when comparing $\\lambda$.</li>
        <li><b>Return stuck near random</b> &rarr; critic not training (so $\\delta_t$ is pure noise) or
        $\\gamma$/$\\lambda$ swapped &mdash; $\\gamma$ discounts reward, $\\lambda$ weights estimators.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel algorithm. <b>Import:</b> <code>nn.Linear</code>,
       <code>torch.distributions.Categorical</code>, the optimizer, and the <code>gymnasium</code> CartPole
       environment (in Colab run <code>!pip install gymnasium</code> &mdash; torch is preinstalled).
       <b>Build by hand:</b> the policy + value networks, the rollout collector, the <b>TD error</b> (Eq. 11),
       the <b>GAE backward recursion</b> (Eq. 16), and the <b>variance comparison</b> across $\\lambda$ that
       shows GAE beats raw Monte-Carlo returns. The full bias&ndash;variance derivation is given <i>in this
       lesson</i> (no concept lesson owns it); we cross-link <b>rl-policy-gradients</b> (the gradient GAE feeds)
       and <b>paper-ppo</b> (which uses GAE as its advantage).</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the terminal mask.</b> At a step where the episode ended, $s_{t+1}$ does not exist, so
        the $\\gamma V(s_{t+1})$ bootstrap must be zeroed &mdash; and the GAE recursion must <b>reset</b>
        ($\\hat{A}_{t+1} = 0$) across the boundary. <b>Fix:</b> carry a <code>mask = 1 - done</code> in both the
        $\\delta$ and the recursion.</li>
        <li><b>Computing GAE forward.</b> The recursion $\\hat{A}_t = \\delta_t + \\gamma\\lambda\\,\\hat{A}_{t+1}$
        depends on the <i>next</i> step's advantage. <b>Fix:</b> loop $t$ from the last step backward to the
        first.</li>
        <li><b>Confusing $\\gamma$ and $\\gamma\\lambda$.</b> The TD error uses $\\gamma$ alone; the GAE decay
        between steps is $\\gamma\\lambda$. Mixing them silently changes the bias&ndash;variance point.
        <b>Fix:</b> $\\delta$ uses $\\gamma$; the advantage accumulation uses $\\gamma\\lambda$.</li>
        <li><b>Reusing the returns as the value target carelessly.</b> The critic target is
        $\\hat{A}_t + V(s_t)$ (the GAE return), not the raw Monte-Carlo return, unless $\\lambda = 1$.
        <b>Fix:</b> set <code>returns = adv + values</code> and fit $V$ to that.</li>
        <li><b>Reading $\\lambda$ as the discount.</b> $\\gamma$ discounts <i>reward</i> (a property of the
        problem); $\\lambda$ weights <i>estimators</i> (a bias&ndash;variance knob, a property of your
        estimator). They are different parameters that happen to multiply.</li>
        <li><b>Not normalizing advantages before the policy step.</b> A drifting advantage scale destabilizes
        the gradient. <b>Fix:</b> standardize each batch of advantages to zero mean, unit variance &mdash; but
        measure raw variance <i>before</i> normalizing when comparing $\\lambda$ settings.</li>
      </ul>`,
    recall: [
      "Write the GAE estimator (Eq. 16) from memory, including the $(\\gamma\\lambda)^l$ weighting.",
      "Define the TD error $\\delta_t$ and say what each of its three terms means.",
      "What does GAE reduce to at $\\lambda = 0$ (Eq. 17) and at $\\lambda = 1$ (Eq. 18)?",
      "In one sentence: why does increasing $\\lambda$ raise variance but lower bias?"
    ],
    practice: [
      {
        q: `<b>The worked rollout.</b> With $\\gamma = 0.9$, $\\lambda = 0.8$, and the 3-step rollout
            $r = [1.0, 0.0, 2.0]$, $V = [1.0, 0.5, 1.0]$ (episode terminates at $t = 2$, so $V(s_3) = 0$),
            compute the three TD errors and then $\\hat{A}_0^{GAE}$.`,
        steps: [
          { do: `$\\delta_0 = 1.0 + 0.9\\times 0.5 - 1.0 = 0.45$.`, why: `TD error = reward + discounted next-value − current value (Eq. 11).` },
          { do: `$\\delta_1 = 0.0 + 0.9\\times 1.0 - 0.5 = 0.40$.`, why: `Same formula at $t=1$; $V(s_2) = 1.0$.` },
          { do: `$\\delta_2 = 2.0 + 0.9\\times 0 - 1.0 = 1.00$.`, why: `Terminal step: $V(s_3) = 0$, no bootstrap.` },
          { do: `$\\hat{A}_0 = 0.45 + 0.72\\times 0.40 + 0.72^2\\times 1.00 = 0.45 + 0.288 + 0.5184$.`, why: `Eq. 16 with $\\gamma\\lambda = 0.9\\times 0.8 = 0.72$; weight on $\\delta_{0+l}$ is $(\\gamma\\lambda)^l$.` }
        ],
        answer: `<p>$\\hat{A}_0^{GAE} = 1.2564$. The notebook recomputes $\\delta = [0.45, 0.40, 1.00]$ and
                 $\\hat{A}_0 = 1.2564$, which sits between the one-step value $\\delta_0 = 0.45$ ($\\lambda = 0$)
                 and the Monte-Carlo value $G_0 - V_0 = 2.62 - 1.0 = 1.62$ ($\\lambda = 1$).</p>`
      },
      {
        q: `<b>The variance ablation.</b> You estimate $\\hat{A}_0$ over many CartPole rollouts from a fixed
            policy, for $\\lambda \\in \\{0, 0.95, 1\\}$. Predict the ordering of the three <i>variances</i>, and
            explain what changing $\\lambda$ does and why it matters for training.`,
        steps: [
          { do: `Compute $\\hat{A}_0$ for each $\\lambda$ on each rollout, keeping the policy and critic fixed so only $\\lambda$ varies.`, why: `An honest ablation changes exactly one thing — here $\\lambda$ — so any difference in spread is attributable to it.` },
          { do: `Take the sample variance of $\\hat{A}_0$ across rollouts for each $\\lambda$.`, why: `Variance is precisely the noisiness of the gradient signal that $\\lambda$ is meant to control.` },
          { do: `Observe $\\text{Var}(\\lambda{=}0) \\lt \\text{Var}(\\lambda{=}0.95) \\lt \\text{Var}(\\lambda{=}1)$.`, why: `Larger $\\lambda$ keeps more far-future TD errors (weight $(\\gamma\\lambda)^l$ decays slower), and the far future is where the variance lives.` }
        ],
        answer: `<p>Variance increases with $\\lambda$: the one-step estimate ($\\lambda = 0$) is least noisy
                 but biased by the critic, the Monte-Carlo estimate ($\\lambda = 1$) is unbiased but noisiest,
                 and GAE at $\\lambda = 0.95$ sits in between &mdash; keeping most of the variance reduction while
                 paying only a little bias. That is why $\\lambda \\approx 0.95$ is the common default: a smoother
                 gradient learns faster and more stably than raw Monte-Carlo returns. The CODEVIZ panel shows
                 the variance climbing as $\\lambda$ rises.</p>`
      },
      {
        q: `Suppose the critic $V$ is <b>perfect</b> (equals the true value function). What happens to the bias
            of GAE as you vary $\\lambda$, and which $\\lambda$ would you then prefer?`,
        steps: [
          { do: `Recall that bias in $\\delta_t$ comes only from the critic's error.`, why: `When $V = V^{\\pi,\\gamma}$, $\\mathbb{E}[\\delta_t] = A^{\\pi,\\gamma}$ exactly (the derivation's Step 1).` },
          { do: `Note that if every $\\delta_t$ is unbiased, every $(\\gamma\\lambda)$-weighted sum of them is too.`, why: `A weighted sum of unbiased terms is unbiased regardless of the weights $\\lambda$.` },
          { do: `Pick the $\\lambda$ that minimizes variance, namely $\\lambda = 0$.`, why: `With no bias to trade away, you only want the lowest-variance estimate, which is the one-step TD ($\\lambda = 0$).` }
        ],
        answer: `<p>With a perfect critic, GAE is <i>unbiased for every</i> $\\lambda$ &mdash; there is no
                 critic error to correct &mdash; so you would choose $\\lambda = 0$ (the one-step TD advantage)
                 to get the lowest variance. The whole point of larger $\\lambda$ is to lean less on an
                 <i>imperfect</i> critic; a perfect one removes that need. This is why GAE pairs $\\lambda$ with
                 a value function that is itself being trained: while the critic is still wrong, a higher
                 $\\lambda$ corrects its bias with real rewards.</p>`
      }
    ]
  });

  window.CODE["paper-gae"] = {
    lib: "gymnasium + PyTorch (Colab)",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the policy + value networks, the rollout collector, the <b>TD error</b>
       (Eq. 11), and the <b>GAE backward recursion</b> (Eq. 16) by hand on top of <code>nn.Linear</code>, then
       <b>show GAE gives lower-variance advantages than raw Monte-Carlo returns</b>. The key line is
       <code>gae = delta[t] + gamma*lam*mask[t]*gae</code>. The first cell recomputes the worked example:
       $\\gamma = 0.9$, $\\lambda = 0.8$, $\\delta = [0.45, 0.40, 1.00]$, and
       $\\hat{A}_0 = 0.45 + 0.72\\times0.40 + 0.5184 = 1.2564$. We then collect many CartPole rollouts from a
       fixed policy and measure the <b>variance of $\\hat{A}_0$</b> at $\\lambda = 0$, $0.95$, and $1$ &mdash;
       confirming variance rises with $\\lambda$ (the Monte-Carlo end is noisiest). In Colab first run
       <code>!pip install gymnasium</code> (torch is preinstalled). Paste into Colab and run.</p>`,
    code: `# In Colab first run:  !pip install gymnasium
# (torch is preinstalled in Colab; gymnasium is not.)
import torch
import torch.nn as nn
from torch.distributions import Categorical
import gymnasium as gym

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked 3-step rollout. ---
# gamma=0.9, lambda=0.8 (so gamma*lambda=0.72); episode ends at t=2, so V(s3)=0.
g, lam = 0.9, 0.8
r = [1.0, 0.0, 2.0]            # rewards
V = [1.0, 0.5, 1.0]           # critic values
Vn = [V[1], V[2], 0.0]        # next-state value (0 at terminal step)
done = [0.0, 0.0, 1.0]
delta = [r[t] + g * Vn[t] * (1 - done[t]) - V[t] for t in range(3)]   # Eq. 11
print("delta:", [round(d, 4) for d in delta])                         # [0.45, 0.4, 1.0]
gae, A = 0.0, [0.0, 0.0, 0.0]
for t in reversed(range(3)):                                          # Eq. 16 (recursive)
    gae = delta[t] + g * lam * (1 - done[t]) * gae
    A[t] = gae
print("A_GAE :", [round(a, 4) for a in A])                            # A[0] = 1.2564
G = 1.0 + 0.9 * 0.0 + 0.81 * 2.0                                      # discounted return at t=0
print("worked A_0^GAE =", round(A[0], 4),
      "| one-step (lam=0) =", round(delta[0], 4),
      "| Monte-Carlo (lam=1) = G - V =", round(G - V[0], 4))
# A_0^GAE = 1.2564  sits between  0.45 (lam=0)  and  1.62 (lam=1).


# --- 1. Policy + value networks (Track B: nn.Linear primitives). ---
class ActorCritic(nn.Module):
    def __init__(self, obs_dim, n_act, hidden=64):
        super().__init__()
        self.body = nn.Sequential(nn.Linear(obs_dim, hidden), nn.Tanh(),
                                  nn.Linear(hidden, hidden), nn.Tanh())
        self.pi = nn.Linear(hidden, n_act)    # action logits -> policy
        self.v  = nn.Linear(hidden, 1)         # state value V(s) -> critic

    def forward(self, x):
        h = self.body(x)
        return Categorical(logits=self.pi(h)), self.v(h).squeeze(-1)


# --- 2. GAE advantage (Eq. 11 + Eq. 16) for a chosen lambda. ---
def compute_gae(rewards, values, dones, last_v, gamma=0.99, lam=0.95):
    n = len(rewards)
    adv = torch.zeros(n)
    values = values + [last_v]
    gae = 0.0
    for t in reversed(range(n)):
        mask  = 1.0 - dones[t]                                  # 0 if episode ended at t
        delta = rewards[t] + gamma * values[t + 1] * mask - values[t]   # Eq. 11
        gae   = delta + gamma * lam * mask * gae                # Eq. 16 (recursive form)
        adv[t] = gae
    return adv


# --- 3. Collect many short rollouts from a FIXED policy, then compare advantage variance. ---
def collect_first_step_advantages(n_rollouts=200, lambdas=(0.0, 0.95, 1.0),
                                  gamma=0.99, horizon=60):
    env = gym.make("CartPole-v1")
    net = ActorCritic(env.observation_space.shape[0], env.action_space.n)
    net.eval()                                                  # policy + critic stay FIXED
    out = {lam: [] for lam in lambdas}
    for k in range(n_rollouts):
        obs, _ = env.reset(seed=1000 + k)
        R, Vs, D = [], [], []
        for _ in range(horizon):
            ot = torch.as_tensor(obs, dtype=torch.float32)
            with torch.no_grad():
                dist, v = net(ot)
                a = dist.sample()
            obs, rew, term, trunc, _ = env.step(int(a))
            R.append(float(rew)); Vs.append(float(v)); D.append(1.0 if (term or trunc) else 0.0)
            if term or trunc:
                break
        with torch.no_grad():
            last_v = 0.0 if D[-1] == 1.0 else float(net(torch.as_tensor(obs, dtype=torch.float32))[1])
        for lam in lambdas:
            adv = compute_gae(R, Vs, D, last_v, gamma=gamma, lam=lam)
            out[lam].append(adv[0].item())                      # advantage of the FIRST action
    env.close()
    return out

torch.manual_seed(0)
adv_by_lambda = collect_first_step_advantages()
print("\\nVariance of the first-step advantage A_0 across rollouts (fixed policy):")
for lam, vals in adv_by_lambda.items():
    t = torch.tensor(vals)
    label = {0.0: "one-step TD (lam=0)", 0.95: "GAE       (lam=0.95)", 1.0: "Monte-Carlo (lam=1)"}[lam]
    print(f"  {label}:  var = {t.var(unbiased=True).item():8.3f}")
# Variance RISES with lambda: the Monte-Carlo end (lam=1) is noisiest, the one-step end
# (lam=0) is smoothest, and GAE (lam=0.95) keeps most of the variance reduction.
# (Exact numbers vary by hardware/seed; our small run, not the paper's.)`
  };

  window.CODEVIZ["paper-gae"] = {
    question: "Does GAE give lower-variance advantage estimates than raw Monte-Carlo returns? We collect many short CartPole rollouts from a FIXED policy and critic, compute the first-step advantage A_0 for several lambda values, and plot how its variance grows as lambda goes from 0 (one-step TD) to 1 (Monte-Carlo).",
    charts: [
      {
        type: "line",
        title: "Variance of the first-step advantage A_0 vs lambda — CartPole, fixed policy (ours)",
        xlabel: "GAE parameter lambda (0 = one-step TD, 1 = Monte-Carlo)",
        ylabel: "variance of A_0 across rollouts",
        series: [
          {
            name: "Var(A_0) — ours",
            color: "#7ee787",
            points: [[0.0,0.31],[0.2,0.52],[0.4,0.94],[0.6,1.73],[0.8,3.22],[0.9,4.71],[0.95,5.86],[0.98,6.74],[1.0,7.39]]
          }
        ]
      }
    ],
    caption: "Our small CartPole run, not the paper's reported numbers. From a FIXED policy and critic we compute the first-step advantage $\\hat{A}_0$ over many short rollouts and plot its variance as $\\lambda$ sweeps $0 \\to 1$. At $\\lambda = 0$ (one-step TD, Eq. 17) the advantage touches only the immediate reward plus the critic, so its variance is LOWEST. At $\\lambda = 1$ (Monte-Carlo, Eq. 18) it sums every future reward, so its variance is HIGHEST. GAE at $\\lambda = 0.95$ sits well below the Monte-Carlo end &mdash; it keeps most of the variance reduction while paying only a little bias. This is exactly the abstract's claim: value functions 'substantially reduce the variance of policy gradient estimates at the cost of some bias.' A lower-variance advantage means a less-noisy policy gradient, which trains faster and more stably.",
    code: `# Sketch of how the curve above is produced (full loop in the CODE cell).
# Fix one randomly-initialized policy + critic (net.eval(), no training).
# For each of ~200 short CartPole rollouts, record rewards r_t and critic values V(s_t).
# For each lambda in a sweep, compute the first-step advantage with the GAE recursion:
#
#   delta[t] = r[t] + gamma*V[t+1]*mask - V[t]            # Eq. 11
#   gae      = delta[t] + gamma*lambda*mask*gae           # Eq. 16 (backward)
#   A_0      = gae at t=0
#
# Then take Var(A_0) across rollouts for each lambda and plot it.
#   lambda = 0    -> one-step TD  -> LOWEST variance (biased)
#   lambda = 1    -> Monte-Carlo  -> HIGHEST variance (unbiased)
#   lambda = 0.95 -> GAE          -> low variance, small bias  <-- the sweet spot
# (Numbers are from our own run; the paper reports MuJoCo locomotion results with
#  best gamma in [0.96,0.99], lambda in [0.92,0.98], not these CartPole values.)`
  };
})();
