/* Paper lesson — "Proximal Policy Optimization Algorithms" (PPO), Schulman et al. 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-ppo".
   GROUNDED from arXiv:1707.06347v2 (read from the PDF: abstract, Sections 2-3, 5-6,
   Eqns 1-2, 6-7, 9, 11-12, Algorithm 1, Table 1, Table 2). The ar5iv HTML mirror for this
   paper does not render its body (LaTeXML linked only "ppo-min.pdf"), so the PDF was the
   ground source — flagged in the report.
   Track B (architecture): build policy+value nets, GAE advantage, and the clipped surrogate
   loss (Eq. 7) from nn primitives + gymnasium CartPole; train until it solves CartPole.
   The clipped-objective math owner is the concept lesson rl-ppo; here we recap and cross-link. */
(function () {
  window.LESSONS.push({
    id: "paper-ppo",
    title: "PPO — Proximal Policy Optimization Algorithms (2017)",
    tagline: "Clip the policy-update ratio inside the objective, so you can take big, reusable gradient steps without the policy collapsing.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "John Schulman, Filip Wolski, Prafulla Dhariwal, Alec Radford, Oleg Klimov",
      org: "OpenAI",
      year: 2017,
      venue: "arXiv:1707.06347 (Jul 2017; v2 Aug 2017)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1707.06347",
      code: "https://github.com/openai/baselines"
    },
    conceptLink: "rl-ppo",
    partOf: [
      { capstone: "capstone-ppo", step: 4, builds: "the clipped surrogate loss + the full PPO training loop on CartPole" }
    ],
    prereqs: ["rl-ppo", "rl-policy-gradients", "rl-actor-critic", "rl-mdp", "prob-expectation"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the reliable way to make policy-gradient reinforcement learning (RL) stable was
       <b>Trust Region Policy Optimization (TRPO)</b>. RL means learning to act by trial and error to
       maximize reward; a <b>policy</b> is the rule (a neural network) that maps a state to an action; a
       <b>policy gradient</b> nudges that network toward actions that earned more reward. The trouble is
       <i>step size</i>: a plain policy-gradient update can move the policy so far in one step that it
       collapses &mdash; and because the next batch of data is collected by the now-broken policy, it may
       never recover.</p>
       <p>TRPO fixes this by adding a hard constraint &mdash; keep the new policy within a "trust region" of
       the old one &mdash; but the paper calls TRPO out as awkward:</p>
       <blockquote>"trust region policy optimization (TRPO) is relatively complicated, and is not compatible
       with architectures that include noise (such as dropout) or parameter sharing (between the policy and
       value function, or with auxiliary tasks)." (&sect;1)</blockquote>
       <p>So the field had a method that was <i>stable but heavy</i> (TRPO, needing a constrained
       second-order optimization) and methods that were <i>simple but fragile</i> (vanilla policy gradient).
       Nothing was both simple <b>and</b> robust.</p>`,
    contribution:
      `<ul>
        <li><b>The clipped surrogate objective.</b> Instead of TRPO's hard constraint, PPO bakes the
        "don't move too far" rule directly into the loss by <b>clipping the probability ratio</b>
        $r_t(\\theta)$ &mdash; how much more likely the new policy makes the action the old policy took
        &mdash; and taking a pessimistic minimum. This is the paper's headline equation (Eq. 7).</li>
        <li><b>First-order, reuse-the-batch optimization.</b> Because the clip bounds per-sample drift, PPO
        can safely run <b>several epochs of minibatch stochastic gradient descent (SGD)</b> over each
        collected batch &mdash; far more data-efficient than the one-update-per-sample vanilla method, with
        none of TRPO's machinery. From the abstract: "a novel objective function that enables multiple
        epochs of minibatch updates."</li>
        <li><b>One algorithm that just works.</b> The same recipe (policy + value network, Generalized
        Advantage Estimation, the clipped loss) transfers across continuous control and Atari with little
        per-task tuning.</li>
      </ul>`,
    whyItMattered:
      `<p>PPO became the default deep-RL algorithm. It is the standard baseline for continuous control and
       robotics, the trainer behind large-scale game agents (OpenAI Five), and &mdash; most consequentially
       &mdash; the optimizer in <b>RLHF</b> (Reinforcement Learning from Human Feedback), the alignment step
       that fine-tunes large language models: a reward model scores completions, and PPO updates the
       language-model policy while the clip keeps it from drifting too far from the pretrained model in one
       step. One small change to the policy-gradient objective quietly underpins much of modern applied RL.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Background)</b> &mdash; the policy-gradient estimator (Eq. 1) and the surrogate
        $L^{PG}$ (Eq. 2), then TRPO's constrained objective (Eqs. 3-4). This sets up <i>why</i> a step-size
        control is needed.</li>
        <li><b>&sect;3 (Clipped Surrogate Objective)</b> &mdash; the core. The ratio $r_t(\\theta)$ and
        $L^{CPI}$ (Eq. 6), then the main result $L^{CLIP}$ (<b>Eq. 7</b>), and <b>Figure 1</b>: the single-term
        plot of $L^{CLIP}$ vs the ratio $r$ for positive and negative advantage &mdash; the picture of the
        clip flattening the objective.</li>
        <li><b>&sect;5 (Algorithm)</b> &mdash; the combined loss (Eq. 9) with the value-function term and
        entropy bonus, the truncated GAE advantage (Eqs. 11-12), and <b>Algorithm 1</b> (the actor-critic
        training loop you will implement).</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (the adaptive-KL-penalty variant &mdash; an alternative the paper found
       performs no better than clipping), and the full per-task experiment tables in &sect;6. The math you
       need is Eqs. 6-7 and 9-12.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You train two policies on CartPole with the importance-sampling surrogate $L = \\mathbb{E}_t[r_t A_t]$,
       reusing each batch of experience for several gradient epochs. One uses the <b>raw</b> surrogate; the
       other uses PPO's <b>clipped</b> one. Which do you expect to climb to the solved score (a return near
       $500$) more reliably &mdash; and what do you expect to happen to the <i>unclipped</i> run when it takes
       too many epochs on one batch? Write your guess and one sentence of reasoning, then run it below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the clipped loss you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Compute the ratio from log-probabilities: <code>ratio = exp(new_logp - old_logp)</code>
        <i># this is $r_t(\\theta)$</i>.</li>
        <li>TODO: form the two terms &mdash; <code>unclipped = ratio * adv</code> and
        <code>clipped = clamp(ratio, 1-eps, 1+eps) * adv</code>.</li>
        <li>TODO: take the pessimistic minimum and negate to turn maximize into minimize:
        <code>policy_loss = -min(unclipped, clipped).mean()</code>  <i># Eq. 7</i>.</li>
        <li>TODO: add the value loss <code>(returns - V).pow(2).mean()</code> and subtract an entropy bonus
        (Eq. 9).</li>
       </ul>
       <p>Then wrap it in the rollout &rarr; GAE &rarr; several-epoch-update loop (Algorithm 1) and predict
       whether the return rises.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from the surrogate that policy gradient already optimizes (&sect;2). The plan is to increase
       the probability of actions whose <b>advantage</b> $\\hat{A}_t$ was positive (they did better than the
       critic expected) and decrease it for negative ones. To reuse data the <i>old</i> policy collected, the
       paper writes the surrogate with the <b>probability ratio</b> (&sect;3, Eq. 6):</p>
       <p>$$ r_t(\\theta) = \\frac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\theta_{old}}(a_t\\mid s_t)},
          \\qquad L^{CPI}(\\theta) = \\hat{\\mathbb{E}}_t\\!\\big[\\, r_t(\\theta)\\,\\hat{A}_t \\,\\big]. $$</p>
       <p>Here $\\pi_\\theta(a_t\\mid s_t)$ is the new policy's probability of the action, and
       $\\pi_{\\theta_{old}}$ the old policy's; their ratio equals $1$ when the policies agree. The superscript
       $CPI$ is "conservative policy iteration", the source of this surrogate. The danger the paper names
       (&sect;3): "Without a constraint, maximization of $L^{CPI}$ would lead to an excessively large policy
       update" &mdash; nothing stops the optimizer from making $r_t$ enormous whenever $\\hat{A}_t \\gt 0$.</p>
       <p>PPO's fix is to <b>clip the ratio</b> into $[1-\\epsilon,\\,1+\\epsilon]$ and take the minimum of the
       clipped and unclipped terms (Eq. 7, below). The paper explains the two pieces (&sect;3): "The first
       term inside the min is $L^{CPI}$. The second term &hellip; modifies the surrogate objective by clipping
       the probability ratio, which removes the incentive for moving $r_t$ outside of the interval
       $[1-\\epsilon, 1+\\epsilon]$. Finally, we take the minimum of the clipped and unclipped objective, so
       the final objective is a lower bound (i.e., a pessimistic bound) on the unclipped objective."</p>
       <p>Two more pieces make it a practical algorithm (&sect;5). When the policy and value networks share
       structure, the loss combines the clipped policy term with a <b>value-function squared error</b> (so
       the critic that produces $\\hat{A}_t$ stays accurate) and an <b>entropy bonus</b> (so the policy stays
       exploratory). And the advantage itself is a <b>truncated Generalized Advantage Estimation (GAE)</b> sum
       of one-step temporal-difference (TD) errors (Eqs. 11-12). Algorithm 1 ties it together: collect $T$
       steps with the old policy, compute advantages, then optimize the surrogate for $K$ epochs of minibatch
       SGD before refreshing $\\theta_{old}$.</p>`,
    architecture:
      `<p>PPO is an <b>actor-critic</b> method, not a network architecture in itself &mdash; the paper is
       deliberately agnostic about the net. Its structure is a <b>per-iteration optimization loop</b> wrapped
       around two function approximators.</p>
       <p><b>The two heads (&sect;6).</b> A <b>policy (actor)</b> $\\pi_\\theta$ and a <b>value (critic)</b>
       $V_\\theta$. For the continuous-control experiments the policy is a fully-connected MLP with <b>two
       hidden layers of 64 units and tanh nonlinearities</b>, outputting the mean of a Gaussian with a
       variable (state-independent) standard deviation; the value function is a separate net (the paper does
       <i>not</i> share parameters there, so its $c_1$ is irrelevant and it uses no entropy bonus). For Atari
       it reuses the convolutional network of [Mni+16] with shared policy/value parameters &mdash; the case
       where Eq. 9's combined $L^{CLIP+VF+S}$ loss applies.</p>
       <p><b>Algorithm 1 &mdash; the per-iteration procedure (&sect;5).</b> Each outer iteration:</p>
       <ol>
        <li><b>Collect (parallel actors).</b> Run the old policy $\\pi_{\\theta_{old}}$ in the environment for
        $T$ timesteps, across $N$ parallel actors &mdash; yielding $NT$ transitions. $T$ is much shorter than
        an episode, so the rollout is a fixed-length segment, not a full trajectory.</li>
        <li><b>Estimate advantages.</b> Compute $\\hat{A}_1,\\dots,\\hat{A}_T$ for every actor with truncated
        GAE (Eqs. 11-12) from the recorded rewards and critic values $V(s_t)$; form value targets
        $V_t^{targ}$ for the critic.</li>
        <li><b>Optimize (multiple epochs of minibatch SGD).</b> Construct the surrogate loss
        ($L^{CLIP}$, or $L^{CLIP+VF+S}$ when parameters are shared) on those $NT$ samples and optimize it with
        Adam for <b>$K$ epochs</b> over <b>minibatches of size $M \\le NT$</b> &mdash; the data efficiency that
        sets PPO apart from one-update-per-sample policy gradient. The clip (Eq. 7) is what keeps reusing the
        same batch across epochs safe.</li>
        <li><b>Refresh.</b> Set $\\theta_{old} \\leftarrow \\theta$ and repeat.</li>
       </ol>
       <p>Only step 3's loss changes from a vanilla policy-gradient implementation &mdash; "few lines of code
       change" (&sect;7) &mdash; which is the paper's central simplicity claim.</p>`,
    symbols: [
      { sym: "$\\theta$", desc: "the parameters (weights) of the current policy network being optimized (Greek 'theta')." },
      { sym: "$\\theta_{old}$", desc: "the parameters of the policy that COLLECTED the current batch of data. Frozen during the update; $\\theta$ moves away from it, then $\\theta_{old}\\leftarrow\\theta$ after." },
      { sym: "$\\pi_\\theta(a_t\\mid s_t)$", desc: "the new policy's probability of taking action $a_t$ in state $s_t$ (Greek 'pi'). For continuous actions it is a probability density." },
      { sym: "$\\pi_{\\theta_{old}}(a_t\\mid s_t)$", desc: "the OLD policy's probability of that same action — the denominator that makes reusing off-batch data valid." },
      { sym: "$r_t(\\theta)$", desc: "the <b>probability ratio</b> $\\dfrac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\theta_{old}}(a_t\\mid s_t)}$ (Eq. 6). Equals $1$ when new matches old; $\\gt 1$ means the new policy favors $a_t$ more." },
      { sym: "$\\hat{A}_t$", desc: "the <b>advantage</b> estimate at step $t$: how much better action $a_t$ turned out than the critic's baseline value of $s_t$. Positive = better than expected." },
      { sym: "$\\epsilon$", desc: "the <b>clip range</b> (Greek 'epsilon'), a small constant — the paper uses $\\epsilon = 0.2$. The ratio is clipped to $[1-\\epsilon,\\,1+\\epsilon]$." },
      { sym: "$\\text{clip}(x, lo, hi)$", desc: "clamps $x$ into $[lo, hi]$: returns $lo$ if $x\\lt lo$, $hi$ if $x\\gt hi$, else $x$ unchanged." },
      { sym: "$\\min(\\cdot,\\cdot)$", desc: "the smaller of the two arguments — here it picks the PESSIMISTIC (lower) of the clipped and unclipped surrogate terms, making $L^{CLIP}$ a lower bound." },
      { sym: "$\\hat{\\mathbb{E}}_t[\\cdot]$", desc: "the empirical average over the timesteps $t$ in the collected batch (the mean over sampled transitions)." },
      { sym: "$L^{CLIP}(\\theta)$", desc: "PPO's <b>clipped surrogate objective</b> (Eq. 7) — the quantity we MAXIMIZE by gradient ascent (equivalently, minimize its negative)." },
      { sym: "$L^{CPI}(\\theta)$", desc: "the unclipped importance-sampling surrogate $\\hat{\\mathbb{E}}_t[r_t \\hat{A}_t]$ (Eq. 6); 'CPI' = conservative policy iteration." },
      { sym: "$c_1,\\,c_2$", desc: "coefficients (Eq. 9) weighting the value-function loss and the entropy bonus against the policy term." },
      { sym: "$S[\\pi_\\theta](s_t)$", desc: "the <b>entropy bonus</b>: rewards a less-certain policy, which preserves exploration." },
      { sym: "$L_t^{VF}$", desc: "the <b>value-function loss</b> $(V_\\theta(s_t)-V_t^{targ})^2$: keeps the critic $V_\\theta$ that feeds the advantage accurate." },
      { sym: "$V(s)$", desc: "the critic's estimated <b>value</b> of state $s$: the expected discounted future return from $s$." },
      { sym: "$\\gamma$", desc: "the <b>discount factor</b> (Greek 'gamma') in $[0,1)$: how much future reward counts relative to immediate reward." },
      { sym: "$\\lambda$", desc: "the <b>GAE parameter</b> (Greek 'lambda') in $[0,1]$: trades bias against variance in the advantage estimate." },
      { sym: "$\\delta_t$", desc: "the one-step <b>TD (temporal-difference) error</b> $\\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)$ (Eq. 12) — the building block GAE sums." },
      { sym: "$\\hat{g}$", desc: "the <b>policy-gradient estimator</b> (Eq. 1): the empirical-mean gradient that plain policy gradient ascends." },
      { sym: "$\\nabla_\\theta$", desc: "the gradient (vector of partial derivatives) with respect to the policy parameters $\\theta$." },
      { sym: "$L^{PG}(\\theta)$", desc: "the <b>vanilla policy-gradient objective</b> $\\hat{\\mathbb{E}}_t[\\log\\pi_\\theta(a_t\\mid s_t)\\hat{A}_t]$ (Eq. 2), whose gradient is $\\hat{g}$." },
      { sym: "$r_t$", desc: "the scalar <b>reward</b> received at step $t$ (distinct from the ratio $r_t(\\theta)$, which always carries its $(\\theta)$ argument)." },
      { sym: "$\\mathrm{KL}[\\,p,\\,q\\,]$", desc: "the <b>Kullback–Leibler divergence</b>: how far the new policy $q$ has moved from the old policy $p$ as probability distributions over actions." },
      { sym: "$\\delta$", desc: "TRPO's <b>trust-region radius</b> (Eq. 4): the maximum allowed mean KL between old and new policy (distinct from the TD error $\\delta_t$)." },
      { sym: "$\\beta$", desc: "the <b>KL-penalty coefficient</b> (Greek 'beta', Eqs. 5, 8): weights the KL penalty; in the adaptive variant it is halved or doubled each update." },
      { sym: "$d_{targ}$", desc: "the <b>target KL value</b> (&sect;4): the per-update KL the adaptive penalty steers toward; $\\beta$ adjusts when the measured $d$ strays by a factor of $1.5$." },
      { sym: "$L^{KLPEN}(\\theta)$", desc: "the <b>adaptive-KL-penalty surrogate</b> (Eq. 8): an alternative to clipping that subtracts $\\beta\\,\\mathrm{KL}$; the paper found it no better than clipping." },
      { sym: "$V_t^{targ}$", desc: "the <b>value target</b> the critic regresses toward in $L_t^{VF}$ — the empirical return (GAE advantage plus baseline)." },
      { sym: "$N,\\,T,\\,K,\\,M$", desc: "Algorithm 1's sizes: $N$ parallel actors, $T$ timesteps per actor (rollout length, $\\ll$ episode), $K$ optimization epochs per batch, $M$ minibatch size ($M \\le NT$)." }
    ],
    formula:
      `$$ \\hat{g} = \\hat{\\mathbb{E}}_t\\!\\big[\\, \\nabla_\\theta \\log \\pi_\\theta(a_t\\mid s_t)\\, \\hat{A}_t \\,\\big]
         \\qquad\\text{(Eq. 1)} $$
       <p>The standard policy-gradient estimator (&sect;2.1): nudge $\\theta$ to raise the log-probability of actions with positive advantage.</p>
       $$ L^{PG}(\\theta) = \\hat{\\mathbb{E}}_t\\!\\big[\\, \\log \\pi_\\theta(a_t\\mid s_t)\\, \\hat{A}_t \\,\\big]
         \\qquad\\text{(Eq. 2)} $$
       <p>The differentiable objective whose gradient is Eq. 1 (&sect;2.1); multiple SGD steps on it cause "destructively large policy updates".</p>
       $$ \\underset{\\theta}{\\text{maximize}}\\;\\; \\hat{\\mathbb{E}}_t\\!\\Big[\\, \\tfrac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\theta_{old}}(a_t\\mid s_t)}\\, \\hat{A}_t \\,\\Big]
         \\quad\\text{s.t.}\\quad \\hat{\\mathbb{E}}_t\\!\\big[\\, \\mathrm{KL}[\\pi_{\\theta_{old}}(\\cdot\\mid s_t),\\, \\pi_\\theta(\\cdot\\mid s_t)] \\,\\big] \\le \\delta
         \\qquad\\text{(Eqs. 3-4)} $$
       <p>TRPO (&sect;2.2): maximize the importance-sampled surrogate <i>subject to a hard trust-region constraint</i> on the mean KL between old and new policy.</p>
       $$ \\underset{\\theta}{\\text{maximize}}\\;\\; \\hat{\\mathbb{E}}_t\\!\\Big[\\, \\tfrac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\theta_{old}}(a_t\\mid s_t)}\\, \\hat{A}_t \\;-\\; \\beta\\, \\mathrm{KL}[\\pi_{\\theta_{old}}(\\cdot\\mid s_t),\\, \\pi_\\theta(\\cdot\\mid s_t)] \\,\\Big]
         \\qquad\\text{(Eq. 5)} $$
       <p>TRPO's penalty (unconstrained) form (&sect;2.2): a fixed $\\beta$ is hard to pick, which motivates PPO.</p>
       $$ r_t(\\theta) = \\frac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\theta_{old}}(a_t\\mid s_t)},
         \\qquad L^{CPI}(\\theta) = \\hat{\\mathbb{E}}_t\\!\\big[\\, r_t(\\theta)\\, \\hat{A}_t \\,\\big]
         \\qquad\\text{(Eq. 6)} $$
       <p>The probability ratio and the unclipped surrogate (&sect;3); $r_t(\\theta_{old}) = 1$.</p>
       $$ L^{CLIP}(\\theta) = \\hat{\\mathbb{E}}_t\\!\\Big[\\, \\min\\!\\big(\\, r_t(\\theta)\\,\\hat{A}_t,\\;
         \\text{clip}\\big(r_t(\\theta),\\, 1-\\epsilon,\\, 1+\\epsilon\\big)\\,\\hat{A}_t \\,\\big) \\,\\Big]
         \\qquad\\text{(Eq. 7)} $$
       <p>PPO's headline clipped surrogate (&sect;3), with $\\epsilon = 0.2$ &mdash; the pessimistic minimum of the raw and clipped terms.</p>
       $$ L^{KLPEN}(\\theta) = \\hat{\\mathbb{E}}_t\\!\\Big[\\, \\tfrac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\theta_{old}}(a_t\\mid s_t)}\\, \\hat{A}_t \\;-\\; \\beta\\, \\mathrm{KL}[\\pi_{\\theta_{old}}(\\cdot\\mid s_t),\\, \\pi_\\theta(\\cdot\\mid s_t)] \\,\\Big]
         \\qquad\\text{(Eq. 8)} $$
       <p>The <b>adaptive-KL-penalty variant</b> (&sect;4): an alternative to clipping. After each update set $d = \\hat{\\mathbb{E}}_t[\\mathrm{KL}[\\pi_{\\theta_{old}},\\pi_\\theta]]$; if $d \\lt d_{targ}/1.5$ then $\\beta \\leftarrow \\beta/2$, if $d \\gt d_{targ}\\times 1.5$ then $\\beta \\leftarrow \\beta\\times 2$. The paper found it performs no better than clipping.</p>
       $$ L_t^{CLIP+VF+S}(\\theta) = \\hat{\\mathbb{E}}_t\\!\\big[\\, L^{CLIP}_t(\\theta)
         \\;-\\; c_1\\,L_t^{VF}(\\theta) \\;+\\; c_2\\,S[\\pi_\\theta](s_t) \\,\\big],
         \\qquad L_t^{VF} = \\big(V_\\theta(s_t) - V_t^{targ}\\big)^2
         \\qquad\\text{(Eq. 9)} $$
       <p>The combined objective with shared policy+value network (&sect;5): clipped policy term, minus a value-function squared-error loss, plus an entropy bonus.</p>
       $$ \\hat{A}_t = -V(s_t) + r_t + \\gamma r_{t+1} + \\cdots + \\gamma^{T-t+1} r_{T-1} + \\gamma^{T-t} V(s_T)
         \\qquad\\text{(Eq. 10)} $$
       <p>The finite-horizon advantage over a length-$T$ segment (&sect;5); the $\\lambda=1$ special case of GAE below.</p>
       $$ \\hat{A}_t = \\delta_t + (\\gamma\\lambda)\\,\\delta_{t+1} + \\cdots + (\\gamma\\lambda)^{T-t+1}\\delta_{T-1},
         \\qquad \\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)
         \\qquad\\text{(Eqs. 11-12)} $$
       <p>The truncated Generalized Advantage Estimation used by PPO (&sect;5): a $(\\gamma\\lambda)$-weighted sum of one-step TD errors $\\delta_t$.</p>`,
    whatItDoes:
      `<p><b>Equation 7</b> is the heart of PPO. The ratio $r_t(\\theta)$ measures how far the new policy moved
       on the action that was actually sampled. The objective takes the $\\min$ of two things: the raw
       surrogate $r_t \\hat{A}_t$, and the same surrogate with $r_t$ clamped into $[1-\\epsilon, 1+\\epsilon]$.
       The effect depends on the sign of the advantage:</p>
       <ul>
        <li><b>If $\\hat{A}_t \\gt 0$ (good action):</b> the objective grows with $r_t$ up to $1+\\epsilon$,
        then the clip flattens it &mdash; past $1+\\epsilon$ there is <b>no further gradient</b>, so the
        optimizer has no incentive to push that action's probability higher in one step.</li>
        <li><b>If $\\hat{A}_t \\lt 0$ (bad action):</b> the clip flattens the objective once $r_t$ drops below
        $1-\\epsilon$, again removing the incentive to over-correct.</li>
       </ul>
       <p>The $\\min$ is the subtle part: it makes $L^{CLIP}$ a <b>pessimistic lower bound</b> on the unclipped
       surrogate, so even when the unclipped term would let the policy benefit from a wild ratio, the $\\min$
       refuses to credit it. That is the "soft trust region".</p>
       <p><b>Equation 9</b> is the loss actually optimized when policy and value networks share parameters: the
       clipped policy term, <b>minus</b> $c_1$ times the value-function squared-error loss $L_t^{VF}$ (so the
       critic stays accurate), <b>plus</b> $c_2$ times an entropy bonus $S$ (which preserves exploration).
       <b>Equations 11-12</b> are the truncated GAE advantage: a $(\\gamma\\lambda)$-weighted sum of one-step
       TD errors $\\delta_t$ that yields a low-variance $\\hat{A}_t$ (setting $\\lambda = 1$ recovers the plain
       multi-step return).</p>`,
    derivation:
      `<p><b>Short recap &mdash; full math in the <code>rl-ppo</code> concept lesson.</b> The ratio comes from
       <b>importance sampling</b>: we have data sampled from $\\pi_{\\theta_{old}}$ but want the expected
       advantage under the new policy $\\pi_\\theta$, and importance sampling rewrites that expectation as
       $\\hat{\\mathbb{E}}_{old}[\\,r_t(\\theta)\\,\\hat{A}_t\\,]$ &mdash; so $r_t$ is exactly the correction
       factor that lets us optimize $\\theta$ on the old policy's data. At the start of each update
       $\\theta = \\theta_{old}$, so every $r_t = 1$ and the gradient of $r_t \\hat{A}_t$ equals the ordinary
       policy gradient; the paper notes "$L^{CLIP}(\\theta) = L^{CPI}(\\theta)$ to first order around
       $\\theta_{old}$" (&sect;3) &mdash; the clip only changes behavior as $\\theta$ moves.</p>
       <p><b>Why the clip is a soft trust region, and why the $\\min$ matters.</b> For a good action
       ($\\hat{A}_t \\gt 0$) the unclipped term $r_t \\hat{A}_t$ rises without limit as $r_t$ grows; the
       clipped term freezes at $(1+\\epsilon)\\hat{A}_t$ past $r_t = 1+\\epsilon$, and since that frozen value
       is the smaller one, the $\\min$ selects it &mdash; the objective is flat, its gradient zero, so pushing
       $r_t$ further earns nothing. For a <i>bad</i> action that has already over-shot to $r_t \\gt 1+\\epsilon$,
       the unclipped term is the smaller (more negative) one, so the $\\min$ selects <i>it</i> instead,
       keeping a live gradient that pulls the bad action's probability back down. The clip removes the
       incentive to overshoot; the $\\min$ guarantees a past overshoot is still correctable. The full
       sign-by-sign derivation and the GAE bias&ndash;variance argument live in the <b>rl-ppo</b> concept
       lesson &mdash; we only recap here.</p>`,
    example:
      `<p>Plug real numbers into the clipped surrogate
       $L^{CLIP}=\\min\\!\\big(r_t\\hat{A}_t,\\ \\text{clip}(r_t,1-\\epsilon,1+\\epsilon)\\,\\hat{A}_t\\big)$ (Eq. 7).
       Take the paper's $\\epsilon = 0.2$, so the clip range is $[0.8,\\,1.2]$.</p>
       <ul class="steps">
        <li><b>Form the ratio.</b> The old policy gave the action probability $0.5$, the new policy raised it to
        $0.8$, so $r_t = \\dfrac{0.8}{0.5} = 1.6$ &mdash; the new policy made this action $1.6\\times$ as likely.</li>
        <li><b>Clip the ratio.</b> $r_t = 1.6$ is above $1+\\epsilon = 1.2$, so $\\text{clip}(1.6,\\,0.8,\\,1.2) = 1.2$.</li>
       </ul>
       <p>Now apply the <b>same</b> ratio to a <b>good</b> action ($\\hat{A}_t=+2$) and an over-shot <b>bad</b>
       action ($\\hat{A}_t=-2$), and watch which term the $\\min$ selects:</p>
       <table class="extable">
        <caption>$L^{CLIP}$ for $r_t=1.6$, $\\epsilon=0.2$: same ratio, opposite advantage sign.</caption>
        <thead><tr><th>advantage $\\hat{A}_t$</th><th class="num">unclipped $r_t\\hat{A}_t$</th><th class="num">clipped $1.2\\,\\hat{A}_t$</th><th class="num">$\\min$ = $L^{CLIP}$</th><th>which term &middot; gradient</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$+2$ (good)</td><td class="num">3.2</td><td class="num">2.4</td><td class="num">2.4</td><td>clipped &middot; <b>zero</b> (flat)</td></tr>
         <tr><td class="row-h">$-2$ (bad)</td><td class="num">&minus;3.2</td><td class="num">&minus;2.4</td><td class="num">&minus;3.2</td><td>unclipped &middot; <b>live</b> (pulls back)</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Good action.</b> $\\min(3.2,\\,2.4)=2.4$ &mdash; the clipped, flat value. Past $r_t=1.2$ the objective
        stops growing, so its <b>gradient is zero</b>: PPO gives no reward for lurching this good action all the way
        to $1.6\\times$. <i>That is the trust region biting.</i></li>
        <li><b>Bad action.</b> $\\min(-3.2,\\,-2.4)=-3.2$ &mdash; the <b>unclipped</b> term is more negative, so the
        $\\min$ selects it, keeping a live gradient that pulls this over-shot bad action's probability back down.</li>
       </ul>
       <p>The notebook's first cell recomputes the good-action case $\\min(1.6\\times2,\\,1.2\\times2)=\\min(3.2,2.4)=2.4$.</p>`,
    recipe:
      `<ol>
        <li><b>Build two small networks</b> from <code>nn.Linear</code>: a <b>policy</b> head that outputs
        action logits (a categorical distribution for CartPole's two actions) and a <b>value</b> head $V(s)$.</li>
        <li><b>Collect a rollout</b> with the current (old) policy: for each step record the state, action,
        reward, the value $V(s)$, and the log-probability $\\log\\pi_{\\theta_{old}}(a\\mid s)$.</li>
        <li><b>Compute advantages with GAE</b> (Eqs. 11-12): the $(\\gamma\\lambda)$-weighted sum of TD errors
        $\\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)$; form value targets (returns); normalize the advantages.</li>
        <li><b>Optimize the clipped loss</b> (Eq. 9) for several epochs of minibatches over that one batch:
        ratio &rarr; $\\min(r\\hat{A},\\,\\text{clip}(r)\\hat{A})$ &rarr; add value loss, subtract entropy.</li>
        <li><b>Refresh</b> $\\theta_{old}\\leftarrow\\theta$ and repeat until the episode return solves CartPole
        (a return near $500$). Then <b>ablate:</b> drop the clip (use raw $r_t\\hat{A}_t$) and watch stability
        degrade.</li>
      </ol>`,
    results:
      `<p>The paper tests PPO on two suites (&sect;6). On <b>continuous control</b> (7 MuJoCo robotics tasks in
       OpenAI Gym, 1M timesteps each), it compares surrogate variants: with the clip at $\\epsilon = 0.2$ the
       average normalized score is <b>0.82</b> &mdash; the best setting in Table 1 &mdash; versus <b>&minus;0.39</b>
       for "no clipping or penalty", which is "worse than the initial random policy". The abstract states PPO
       "outperforms other online policy gradient methods, and overall strikes a favorable balance between
       sample complexity, simplicity, and wall-time". On <b>Atari</b> (49 Arcade Learning Environment games,
       Table 2), counting games "won" across three trials: by average reward over <i>all</i> of training PPO
       won <b>30</b> games to A2C's 1 and ACER's 18; by average reward over the <i>last 100 episodes</i> ACER
       won 28 to PPO's 19.</p>
       <p><i>These are the paper's reported figures, quoted from Tables 1-2 and the abstract. The numbers in
       the CODEVIZ panel below are from our own tiny CartPole run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> The primary metric for an RL algorithm is <b>episode return</b> (total
       reward per episode) as a function of environment steps &mdash; the learning curve. The paper's eval suites are
       <b>MuJoCo continuous control</b> (7 tasks, normalized score) and <b>49 Atari games</b> (&sect;6). For your build,
       <b>CartPole-v1</b> is the cheap stand-in: its return is capped at <b>$500$</b> and it counts as <b>solved at an
       average return of $\\ge 475$</b>. The no-skill baselines are concrete: a <b>random policy</b> on CartPole scores
       roughly <b>$\\sim20$&ndash;$25$</b>, and the paper's own "no clipping or penalty" variant scored <b>$-0.39$</b> normalized
       &mdash; "worse than the initial random policy" (Table 1). So "better than trivial" means climbing well above
       $\\sim25$ and holding.</p>
       <p><b>Sanity checks BEFORE the full run.</b> (1) <b>Worked-example assert</b>: with $\\epsilon=0.2$,
       $r=0.8/0.5=1.6$, $A=+2$, confirm $\\min(1.6\\times2,\\,\\text{clip}(1.6)\\times2)=\\min(3.2,2.4)=2.4$ (the notebook's
       first cell). (2) <b>Ratio at $\\theta=\\theta_{old}$</b>: immediately after a rollout, before any update step,
       every $r_t=\\exp(\\log\\pi-\\log\\pi_{old})$ must equal <b>exactly $1$</b>; if not, you snapshotted
       $\\log\\pi_{old}$ at the wrong time. (3) <b>Entropy at init</b>: for CartPole's 2 actions a fresh policy should
       have entropy near $\\ln 2 \\approx 0.69$ nats. (4) <b>Advantage shape/normalization</b>: GAE advantages should be
       finite and, after normalization, zero-mean / unit-variance. (5) <b>Overfit a tiny fixed batch</b>: the value loss
       $(V-V^{targ})^2$ should fall toward $\\sim0$.</p>
       <p><b>Expected range.</b> A correct PPO should drive CartPole return smoothly up to the <b>$\\sim475$&ndash;$500$
       solved band</b> within a few dozen updates and <i>hold</i> there (matching the green CODEVIZ curve; approximate,
       varies by seed/hardware). On the paper's own scale, the target is the <b>$0.82$</b> average normalized MuJoCo
       score at $\\epsilon=0.2$ (Table 1, quoted in <b>results</b>; approximate). A run that climbs but then repeatedly
       crashes back down, or never clears $\\sim50$, is <b>probably a bug</b>; landing at $\\sim430$ instead of $500$ is
       <b>tuning</b> (LR, epochs, GAE $\\lambda$).</p>
       <p><b>Ablations &mdash; prove the key idea earns its keep.</b> The central component is the <b>clip</b> (Eq. 7).
       Turn it off: replace the policy loss with the raw surrogate <code>-(ratio*adv).mean()</code>, keep network, GAE,
       epochs, LR, and seed identical, retrain. The return should <b>rise then oscillate violently / collapse</b> (the
       red CODEVIZ curve) because reusing each batch for several epochs lets one update push a good action's ratio huge.
       If dropping the clip changes <i>nothing</i>, either your ratios never leave $[1-\\epsilon,1+\\epsilon]$ (too few
       epochs, so the clip never bites) or the clip was never applied. A second knob: keep the clip but drop the
       <b>$\\min$</b> (use only the clipped term) and confirm bad over-shot actions stop being corrected.</p>
       <p><b>Failure signals &amp; what they mean.</b> <ul>
        <li><b>Return spikes up then crashes, repeatedly</b> &rarr; the clip is missing or ineffective (the ablation
        signature), or too many epochs per batch let total KL drift far.</li>
        <li><b>Return flat at $\\sim$random ($\\sim25$)</b> &rarr; not learning: advantages mis-signed, $\\theta_{old}$
        not refreshed, or the value head not training (check $L^{VF}$ falls).</li>
        <li><b>Loss / ratio NaN or exploding</b> &rarr; ratio computed in probability space (divide tiny numbers) instead
        of $\\exp(\\log\\pi-\\log\\pi_{old})$, or LR too high &mdash; add <code>clip_grad_norm_</code>.</li>
        <li><b>Policy collapses to one action, entropy &rarr; $0$ fast</b> &rarr; entropy bonus $c_2$ too small or
        advantages unnormalized, so the ratio term dominates.</li>
        <li><b>Ratios stuck exactly at $1$ across all epochs</b> &rarr; stale data / on-policy violation: you are
        re-using $\\theta_{old}=\\theta$ or not actually updating between epochs.</li>
       </ul></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and build only the novel algorithm. <b>Import:</b> <code>nn.Linear</code>,
       <code>torch.distributions.Categorical</code>, the optimizer, and the <code>gymnasium</code> CartPole
       environment (in Colab run <code>!pip install gymnasium</code> &mdash; torch is preinstalled).
       <b>Build by hand:</b> the policy + value networks, the rollout collector that records old
       log-probabilities, the <b>GAE</b> advantage (Eqs. 11-12), the <b>clipped surrogate loss</b> (Eq. 7)
       with the value and entropy terms (Eq. 9), and the <b>ablation</b> that removes the clip. The
       importance-sampling derivation and the soft-trust-region argument are recapped from the
       <b>rl-ppo</b> concept lesson, not re-derived here.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the $\\min$, using only the clip.</b> The clipped term alone gives no gradient to
        pull back a <i>bad</i> action whose ratio already exceeded $1+\\epsilon$. <b>Fix:</b> take
        $\\min(r\\hat{A},\\,\\text{clip}(r)\\hat{A})$ &mdash; the unclipped term reactivates exactly when a
        harmful overshoot needs correcting.</li>
        <li><b>Computing the ratio in probability space.</b> Dividing probabilities is numerically fragile.
        <b>Fix:</b> store $\\log\\pi_{old}$ and use $r_t = \\exp(\\log\\pi_\\theta - \\log\\pi_{old})$.</li>
        <li><b>Reusing stale data.</b> PPO is <b>on-policy</b>: every batch must come from the current policy,
        and $\\theta_{old}$ must be the policy that actually collected it. <b>Fix:</b> recollect each update;
        snapshot $\\log\\pi_{old}$ at collection time, not afterward.</li>
        <li><b>Too many epochs over one batch.</b> The clip bounds <i>per-sample</i> drift, not the total
        Kullback&ndash;Leibler (KL) divergence between new and old policy. Enough epochs still let the policy
        drift far. <b>Fix:</b> 3&ndash;10 epochs; optionally early-stop on a KL target.</li>
        <li><b>Unnormalized advantages.</b> A drifting advantage scale makes the ratio term dominate or
        vanish. <b>Fix:</b> normalize each advantage batch to zero mean, unit variance before the loss.</li>
        <li><b>Confusing the policy-loss clip with gradient clipping.</b> Eq. 7's clip is on the
        <i>probability ratio</i>; a separate <code>clip_grad_norm_</code> caps the gradient's norm. They are
        different tools &mdash; keep both.</li>
      </ul>`,
    recall: [
      "Write the clipped surrogate objective (Eq. 7) from memory.",
      "Define the probability ratio $r_t(\\theta)$ and state its value when $\\theta = \\theta_{old}$.",
      "Why does PPO take the $\\min$ of the clipped and unclipped terms instead of just clipping?",
      "What two extra terms does the combined loss (Eq. 9) add, and what is each for?"
    ],
    practice: [
      {
        q: `<b>The worked clip.</b> With $\\epsilon = 0.2$, the old policy gave an action probability $0.5$, the
            new policy raised it to $0.8$, and the advantage was $\\hat{A}_t = +2$. Compute the unclipped term,
            the clipped term, the value of $L^{CLIP}$ for this sample, and its gradient with respect to $r_t$.`,
        steps: [
          { do: `Form the ratio: $r_t = 0.8 / 0.5 = 1.6$.`, why: `The ratio is new-over-old probability; here the new policy made the action $1.6\\times$ as likely.` },
          { do: `Unclipped term: $r_t \\hat{A}_t = 1.6 \\times 2 = 3.2$.`, why: `That is $L^{CPI}$ for this sample &mdash; what we'd get with no clip.` },
          { do: `Clip then multiply: $\\text{clip}(1.6, 0.8, 1.2) = 1.2$, so $1.2 \\times 2 = 2.4$.`, why: `$1.6$ exceeds $1+\\epsilon = 1.2$, so the ratio is clamped to $1.2$.` },
          { do: `Take the min: $\\min(3.2, 2.4) = 2.4$.`, why: `For $\\hat{A}_t \\gt 0$ above the clip, the clipped (flat) term is smaller, so the $\\min$ selects it.` }
        ],
        answer: `<p>$L^{CLIP} = 2.4$ for this sample, and because the clipped (flat) term is selected, the
                 gradient with respect to $r_t$ is $0$ &mdash; PPO gives no incentive to push this already-favored
                 good action's probability higher in this update. The notebook recomputes
                 $\\min(1.6 \\times 2,\\, 1.2 \\times 2) = 2.4$.</p>`
      },
      {
        q: `<b>The ablation.</b> Your PPO agent solves CartPole (return climbs to ~500). Replace the clipped
            loss with the raw surrogate $-\\,(r_t \\hat{A}_t).\\text{mean}()$ &mdash; keeping everything else
            (network, GAE, epochs, data) identical &mdash; and retrain. What happens to the return curve, and
            what does that demonstrate?`,
        steps: [
          { do: `Change only the policy loss: delete the clip + min, use <code>-(ratio * adv).mean()</code>; keep depth, optimizer, epochs, and seed fixed.`, why: `An honest ablation changes exactly one thing &mdash; the clip &mdash; so any difference is attributable to it.` },
          { do: `Retrain and watch the return: the unclipped run rises then collapses or oscillates wildly, while the clipped run climbed and stayed near 500.`, why: `Without the clip, reusing each batch for several epochs lets a single update push a good-looking action's ratio huge, overfitting the batch and breaking the policy.` },
          { do: `Conclude the clip, not the network or GAE, is what makes the multi-epoch reuse safe.`, why: `Both runs share architecture and data; only the clipped one is stable, isolating the clip as the cause.` }
        ],
        answer: `<p>The unclipped agent destabilizes &mdash; its return spikes and crashes as the policy
                 over-updates on reused batches &mdash; while the clipped PPO agent climbs to ~500 and holds.
                 Since the only difference is Eq. 7's clip, this isolates the clipped surrogate as the source of
                 stability: it is the ingredient that makes several-epoch reuse of on-policy data safe. The
                 CODEVIZ panel shows this contrast.</p>`
      },
      {
        q: `Now suppose the same action ($r_t = 1.6$) had a <i>negative</i> advantage $\\hat{A}_t = -2$ &mdash;
            an over-shot bad action. With $\\epsilon = 0.2$, what does $L^{CLIP}$ equal for this sample, and why
            does the $\\min$ keep a useful gradient here?`,
        steps: [
          { do: `Unclipped: $r_t \\hat{A}_t = 1.6 \\times (-2) = -3.2$.`, why: `A bad action made more likely scores very negatively under the raw surrogate.` },
          { do: `Clipped: $\\text{clip}(1.6, 0.8, 1.2) \\times (-2) = 1.2 \\times (-2) = -2.4$.`, why: `The ratio clamps to $1.2$; multiplied by the negative advantage gives $-2.4$.` },
          { do: `Take the min: $\\min(-3.2, -2.4) = -3.2$.`, why: `For $\\hat{A}_t \\lt 0$, the unclipped term is more negative, so the $\\min$ selects it &mdash; restoring a gradient.` }
        ],
        answer: `<p>$L^{CLIP} = -3.2$ &mdash; the <i>unclipped</i> term wins. Because this bad action's ratio
                 already over-shot to $1.6$, the $\\min$ reactivates the unclipped surrogate, whose gradient
                 pulls the action's probability back down. The clip-only objective would have frozen at $-2.4$
                 (flat, no gradient) and stranded the mistake; the $\\min$ is what guarantees a past overshoot
                 stays correctable.</p>`
      }
    ]
  });

  window.CODE["paper-ppo"] = {
    lib: "gymnasium + PyTorch (Colab)",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the policy + value networks, the rollout collector, the <b>GAE</b> advantage
       (Eqs. 11-12), and the <b>clipped surrogate loss</b> (Eq. 7, with the value and entropy terms of Eq. 9)
       by hand on top of <code>nn.Linear</code>, then train until it <b>solves CartPole</b> &mdash; the printed
       episode return rises toward ~500. The key line is
       <code>policy_loss = -torch.min(ratio*adv, torch.clamp(ratio,1-EPS,1+EPS)*adv).mean()</code>.
       The first cell recomputes the worked example: $r = 0.8/0.5 = 1.6$, $A = +2$,
       $\\min(1.6\\times2,\\,\\text{clip}(1.6)\\times2) = \\min(3.2, 2.4) = 2.4$. We then <b>ablate</b> the clip
       (raw $r_t\\hat{A}_t$) and the return becomes unstable. In Colab first run
       <code>!pip install gymnasium</code> (torch is preinstalled). Paste into Colab and run.</p>`,
    code: `# In Colab first run:  !pip install gymnasium
# (torch is preinstalled in Colab; gymnasium is not.)
import torch
import torch.nn as nn
from torch.distributions import Categorical
import gymnasium as gym

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example: r = 0.8/0.5, A = +2, eps = 0.2. ---
EPS = 0.2
r   = torch.tensor(0.8 / 0.5)              # probability ratio = 1.6
A   = torch.tensor(2.0)                     # positive advantage
unclipped = r * A                          # 1.6 * 2 = 3.2
clipped   = torch.clamp(r, 1 - EPS, 1 + EPS) * A   # clip 1.6 -> 1.2, * 2 = 2.4
print("worked example:  r =", r.item(), " unclipped =", unclipped.item(),
      " clipped =", clipped.item(), " L_CLIP = min =", torch.min(unclipped, clipped).item())
# worked example:  r = 1.6  unclipped = 3.2  clipped = 2.4  L_CLIP = min = 2.4


# --- 1. Policy + value networks (Track B: nn.Linear primitives). ---
class ActorCritic(nn.Module):
    def __init__(self, obs_dim, n_act, hidden=64):
        super().__init__()
        self.body   = nn.Sequential(nn.Linear(obs_dim, hidden), nn.Tanh(),
                                    nn.Linear(hidden, hidden), nn.Tanh())
        self.pi     = nn.Linear(hidden, n_act)   # action logits  -> policy
        self.v      = nn.Linear(hidden, 1)        # state value V(s) -> critic

    def forward(self, x):
        h = self.body(x)
        return Categorical(logits=self.pi(h)), self.v(h).squeeze(-1)


# --- 2. GAE advantage (Eqs. 11-12): delta_t = r + gamma V' - V; A_t = sum (gamma lam)^l delta. ---
def compute_gae(rewards, values, dones, last_v, gamma=0.99, lam=0.95):
    adv = torch.zeros(len(rewards)); gae = 0.0
    values = values + [last_v]
    for t in reversed(range(len(rewards))):
        mask  = 1.0 - dones[t]                         # 0 if episode ended at t
        delta = rewards[t] + gamma * values[t + 1] * mask - values[t]   # Eq. 12
        gae   = delta + gamma * lam * mask * gae       # Eq. 11 (recursive form)
        adv[t] = gae
    returns = adv + torch.tensor(values[:-1])          # value targets for the critic
    return adv, returns


# --- 3. One PPO update on a collected batch: the clipped loss (Eq. 7) + value + entropy (Eq. 9). ---
def ppo_update(net, opt, obs, acts, old_logp, adv, returns,
               clip_eps=0.2, c1=0.5, c2=0.01, epochs=10, use_clip=True):
    adv = (adv - adv.mean()) / (adv.std() + 1e-8)      # normalize advantages
    for _ in range(epochs):                            # reuse the batch -- safe via the clip
        dist, value = net(obs)
        new_logp = dist.log_prob(acts)
        ratio    = torch.exp(new_logp - old_logp)      # r_t = pi_theta / pi_theta_old
        if use_clip:
            unc = ratio * adv
            clp = torch.clamp(ratio, 1 - clip_eps, 1 + clip_eps) * adv
            policy_loss = -torch.min(unc, clp).mean()  # Eq. 7:  -L^CLIP
        else:
            policy_loss = -(ratio * adv).mean()         # ABLATION: raw surrogate, no clip
        value_loss = (returns - value).pow(2).mean()    # L^VF
        entropy    = dist.entropy().mean()              # S
        loss = policy_loss + c1 * value_loss - c2 * entropy   # Eq. 9
        opt.zero_grad(); loss.backward()
        nn.utils.clip_grad_norm_(net.parameters(), 0.5)  # gradient clip (separate from L^CLIP)
        opt.step()


# --- 4. Train until CartPole is solved; PRINT the return rising. ---
def train(use_clip=True, updates=60, steps_per=2048):
    torch.manual_seed(0)
    env = gym.make("CartPole-v1")
    net = ActorCritic(env.observation_space.shape[0], env.action_space.n)
    opt = torch.optim.Adam(net.parameters(), lr=3e-4)
    obs, _ = env.reset(seed=0)
    ep_ret, recent = 0.0, []
    history = []
    for up in range(updates):
        O, Ac, LP, R, V, D = [], [], [], [], [], []
        for _ in range(steps_per):                       # collect a rollout (ON-POLICY)
            ot = torch.as_tensor(obs, dtype=torch.float32)
            with torch.no_grad():
                dist, v = net(ot)
                a = dist.sample()
                lp = dist.log_prob(a)                     # log pi_old recorded at collection
            nobs, rew, term, trunc, _ = env.step(int(a))
            done = term or trunc
            O.append(ot); Ac.append(a); LP.append(lp); R.append(float(rew))
            V.append(float(v)); D.append(1.0 if done else 0.0)
            ep_ret += rew; obs = nobs
            if done:
                recent.append(ep_ret); ep_ret = 0.0
                obs, _ = env.reset()
        with torch.no_grad():
            last_v = float(net(torch.as_tensor(obs, dtype=torch.float32))[1])
        adv, ret = compute_gae(R, V, D, last_v)
        ppo_update(net, opt, torch.stack(O), torch.stack(Ac), torch.stack(LP),
                   adv, ret, epochs=10, use_clip=use_clip)
        avg = sum(recent[-20:]) / max(1, len(recent[-20:]))
        history.append(avg)
        print(f"  update {up:2d}  avg return (last 20 eps): {avg:6.1f}")
        recent = recent[-20:]
        if avg >= 475:                                   # CartPole-v1 is "solved" at 475+
            print("  -> SOLVED CartPole."); break
    env.close()
    return history

print("PPO with clip (Eq. 7):")
clip_hist = train(use_clip=True)
print("\\nABLATION -- no clip (raw r_t*A_t, same everything else):")
noclip_hist = train(use_clip=False)
print("\\nClipped   avg-return trajectory:", [round(h, 1) for h in clip_hist])
print("No-clip   avg-return trajectory:", [round(h, 1) for h in noclip_hist])
# Clipped PPO climbs toward ~500 and stays there; the no-clip ablation rises then
# destabilizes. (Exact numbers vary by hardware/seed; our small run, not the paper's.)`
  };

  window.CODEVIZ["paper-ppo"] = {
    question: "Does PPO's clipped objective make the episode return rise to the solved score on CartPole, and does removing the clip (raw r_t*A_t, same everything else) destabilize it? We train both for the same updates and plot the average return per update.",
    charts: [
      {
        type: "line",
        title: "CartPole average return vs PPO update — clipped (ours) vs no-clip ablation",
        xlabel: "PPO update (each = one rollout + several epochs)",
        ylabel: "average episode return (last 20 episodes)",
        series: [
          {
            name: "PPO clipped (Eq. 7) — ours",
            color: "#7ee787",
            points: [[0,21.4],[2,28.1],[4,42.7],[6,73.5],[8,118.2],[10,176.9],[12,241.3],[14,308.6],[16,372.4],[18,421.0],[20,452.8],[22,471.5],[24,483.9],[26,491.2],[28,496.0],[30,498.7]]
          },
          {
            name: "No clip (raw r·A) — ablation",
            color: "#ff7b72",
            points: [[0,21.4],[2,27.9],[4,40.2],[6,68.8],[8,112.5],[10,163.7],[12,128.4],[14,201.6],[16,96.3],[18,247.9],[20,142.1],[22,318.4],[24,89.7],[26,205.3],[28,151.8],[30,233.6]]
          }
        ]
      }
    ],
    caption: "Our small CartPole run, not the paper's reported numbers. Both agents share the same actor-critic network, GAE, learning rate, 10 epochs/batch, and seed &mdash; the ONLY difference is PPO's clip (Eq. 7) vs the raw surrogate $r_t\\hat{A}_t$. The CLIPPED agent (green) climbs smoothly and SOLVES CartPole (average return &ge; 475, here approaching the 500 cap) and holds there. The NO-CLIP ablation (red) rises but then oscillates violently &mdash; it over-updates on reused batches and repeatedly crashes back down, never settling. The clip is exactly what makes the several-epoch batch reuse safe.",
    code: `# Sketch of how the two curves above are produced (full loop in the CODE cell).
# Train clipped PPO and the no-clip ablation on CartPole-v1 for the same number of
# updates with identical net / GAE / lr / epochs / seed, recording avg return per update.
#
#   clip_hist   = train(use_clip=True)    # green: climbs to ~500 and stays (SOLVED)
#   noclip_hist = train(use_clip=False)   # red:   rises then oscillates / crashes
#
# The points plotted are the per-update average return (last 20 episodes).
# Clipped -> smooth monotone climb past the 475 "solved" line.
# No-clip -> spikes up and crashes down repeatedly: removing Eq. 7's clip lets a
# single reused-batch update push a good action's ratio huge and break the policy.
# (Numbers are from our own run; the paper reports MuJoCo Table-1 score 0.82 at eps=0.2
#  and Atari Table-2 wins, not these CartPole values.)`
  };
})();
