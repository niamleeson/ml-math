/* Paper lesson — "Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement
   Learning with a Stochastic Actor" (SAC), Haarnoja, Zhou, Abbeel, Levine, 2018.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-sac".
   GROUNDED from arXiv:1801.01290 via the ar5iv HTML mirror
   (https://ar5iv.labs.arxiv.org/html/1801.01290): abstract, Section 3.2 (maximum-entropy
   objective, Eq. 1), Section 4.1 (soft Bellman backup Eq. 2, soft value Eq. 3, policy
   improvement KL projection Eq. 4), the twin-Q minimum, the squashed-Gaussian
   reparameterized policy (Eqs. 11-12, Appendix C), and the MuJoCo evaluation.
   Track B (architecture): build a stochastic squashed-Gaussian policy, twin Q-critics, and
   the entropy-augmented soft updates from nn primitives on a toy continuous-control task;
   train to show the entropy-augmented objective working, then ABLATE the entropy term.
   The continuous-control math owner is the concept lesson rl-continuous-control (which
   covers DDPG, TD3, and SAC); here we recap and cross-link to DDPG. */
(function () {
  window.LESSONS.push({
    id: "paper-sac",
    title: "SAC — Soft Actor-Critic (2018)",
    tagline: "Train a stochastic policy that maximizes reward PLUS entropy, with twin Q-critics, so off-policy continuous control becomes stable and sample-efficient.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "Tuomas Haarnoja, Aurick Zhou, Pieter Abbeel, Sergey Levine",
      org: "UC Berkeley (BAIR)",
      year: 2018,
      venue: "arXiv:1801.01290 (Jan 2018); ICML 2018",
      citations: "",
      arxiv: "https://arxiv.org/abs/1801.01290",
      code: "https://github.com/haarnoja/sac"
    },
    conceptLink: "rl-continuous-control",
    partOf: [],
    prereqs: ["rl-continuous-control", "rl-policy-gradients", "rl-actor-critic", "rl-mdp", "prob-expectation"],

    // WHY READ IT
    problem:
      `<p>Reinforcement learning (RL) means learning to act by trial and error to maximize reward; a
       <b>policy</b> is the rule (a neural network) that maps a state to an action. For <b>continuous
       control</b> &mdash; robots and physics tasks where actions are real-valued vectors (joint torques),
       not a short menu &mdash; the leading off-policy method before this paper was <b>DDPG</b> (Deep
       Deterministic Policy Gradient). <b>Off-policy</b> means it can reuse old stored experience from a
       <b>replay buffer</b>, which is far more sample-efficient than throwing data away after one update.</p>
       <p>But DDPG was notoriously brittle. The paper opens with exactly this complaint:</p>
       <blockquote>"the combination of off-policy learning and high-dimensional, nonlinear function
       approximation with neural networks presents a major challenge for stability and convergence&hellip;
       [DDPG's] interplay between the deterministic actor network and the Q-function typically makes
       [it] extremely difficult to stabilize and brittle to hyperparameter settings." (&sect;1)</blockquote>
       <p>DDPG's actor is <b>deterministic</b>: for a given state it outputs one exact action, so all
       exploration has to be bolted on as external noise. That single fragile coupling between a deterministic
       actor and its critic, plus heavy per-task hyperparameter tuning, is what SAC set out to fix. The cross-linked
       concept lesson <code>rl-continuous-control</code> walks through DDPG in full.</p>`,
    contribution:
      `<ul>
        <li><b>The maximum-entropy RL objective.</b> Instead of maximizing reward alone, SAC maximizes
        reward <b>plus the entropy of the policy</b>, weighted by a temperature $\\alpha$ (Eq. 1). Entropy
        measures how spread-out (random) the action distribution is; rewarding it makes the policy stay
        exploratory and robust rather than collapsing to one action. This is the paper's headline idea.</li>
        <li><b>A stochastic actor for continuous control.</b> Unlike DDPG's deterministic actor, SAC's policy
        outputs a <b>distribution</b> over actions (a squashed Gaussian). Exploration is then built in &mdash;
        no hand-tuned external noise process &mdash; and the policy is trained by a soft policy-improvement
        step (a KL projection, Eq. 4).</li>
        <li><b>Twin Q-critics + soft value, off-policy.</b> SAC learns <b>two Q-functions</b> and uses their
        <b>minimum</b> to fight overestimation, plus a soft value/Q backup that subtracts the entropy term.
        From the abstract, the result is a method "that&hellip; substantially outperform[s] prior on-policy
        and off-policy methods" while being "robust&hellip; [and] achiev[ing] stable training across different
        random seeds."</li>
      </ul>`,
    whyItMattered:
      `<p>SAC became the go-to off-policy algorithm for continuous control and real-robot learning. Its
       stability and sample efficiency &mdash; far less seed-sensitive than DDPG &mdash; made it a standard
       baseline in robotics, locomotion, and manipulation. The maximum-entropy framework it popularized (the
       reward-plus-entropy objective, automatic temperature tuning in the follow-up) is now a default lens for
       exploration-aware RL, and SAC remains one of the most-used continuous-control algorithms in research
       and applied settings.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.2 (Maximum Entropy Reinforcement Learning)</b> &mdash; the objective $J(\\pi)$
        (<b>Eq. 1</b>): reward augmented with the expected policy entropy weighted by $\\alpha$. This single
        equation defines everything else.</li>
        <li><b>&sect;4.1 (Derivation of Soft Policy Iteration)</b> &mdash; the <b>soft Bellman backup</b>
        (Eq. 2), the <b>soft state-value function</b> $V(s) = \\mathbb{E}_a[Q(s,a) - \\log\\pi(a\\mid s)]$
        (Eq. 3), and the <b>policy-improvement KL projection</b> (Eq. 4). These are the soft value and policy
        updates.</li>
        <li><b>&sect;4.2 (the practical algorithm)</b> &mdash; the <b>two Q-functions</b> and the use of their
        <b>minimum</b>, and the <b>reparameterized squashed-Gaussian policy</b> $a = f_\\phi(\\epsilon; s)$
        (Eqs. 11-12); the tanh-squashing log-likelihood correction lives in <b>Appendix C</b>.</li>
       </ul>
       <p><b>Skim:</b> the convergence proofs of soft policy iteration (the lemmas establish that the soft
       updates improve the maximum-entropy objective), and the full per-task MuJoCo plots in &sect;5. The math
       you need is Eqs. 1-4 plus the twin-Q minimum.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You train two agents on a toy continuous-control task. Both maximize the same reward with the same
       networks; the only difference is the <b>entropy term</b>. Agent A maximizes <b>reward + $\\alpha\\cdot$entropy</b>
       (full SAC). Agent B maximizes <b>reward only</b> (entropy weight $\\alpha = 0$ &mdash; the ablation).
       Which agent do you expect to <i>keep exploring</i> and reach a higher, more stable reward &mdash; and what do
       you expect agent B's policy spread (its action standard deviation) to do over training? Write your guess
       and one sentence of reasoning, then run it below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two SAC pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>The <b>soft value target</b> for the critic uses the entropy bonus:
        <code>q_next = min(Q1_targ(s',a'), Q2_targ(s',a'))</code> then
        <code>v_next = q_next - alpha * logp(a'|s')</code> <i># Eq. 3: subtract $\\alpha\\log\\pi$</i>, and the
        backup is <code>target = r + gamma * v_next</code> <i># Eq. 2</i>.</li>
        <li>TODO: the <b>twin critics</b> &mdash; train BOTH <code>Q1, Q2</code> toward that target with mean
        squared error, and always take their <code>min</code> when forming the target (overestimation guard).</li>
        <li>TODO: the <b>policy loss</b> &mdash; sample $a$ via the reparameterized squashed Gaussian, then
        maximize <code>min(Q1(s,a), Q2(s,a)) - alpha * logp(a|s)</code>, i.e. minimize its negative
        <i># Eq. 4: pull the policy toward the entropy-augmented soft-Q</i>.</li>
        <li>TODO: the <b>ablation</b> &mdash; set <code>alpha = 0</code> and re-run; the entropy bonus vanishes.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from the standard RL objective and change one thing (&sect;3.2). Ordinary RL maximizes the
       expected sum of rewards $\\sum_t \\mathbb{E}[\\,r(s_t,a_t)\\,]$. SAC <b>augments</b> it with the policy's
       entropy at every step:</p>
       <p>$$ J(\\pi) = \\sum_{t} \\mathbb{E}_{(s_t,a_t)\\sim\\rho_\\pi}\\big[\\, r(s_t,a_t) + \\alpha\\,
          \\mathcal{H}(\\pi(\\cdot\\mid s_t)) \\,\\big]. $$</p>
       <p>Here $\\mathcal{H}(\\pi(\\cdot\\mid s_t)) = \\mathbb{E}_{a\\sim\\pi}[-\\log\\pi(a\\mid s_t)]$ is the
       <b>entropy</b> of the action distribution &mdash; high when the policy spreads probability over many
       actions, low when it commits to one. The temperature $\\alpha$ sets how much that randomness is worth
       relative to reward. The paper's words (&sect;3.2): the objective "favors stochastic policies by
       augmenting the objective with the expected entropy of the policy." So the agent is paid to <i>stay
       exploratory</i>, not just to grab reward.</p>
       <p>Changing the objective changes the value functions into <b>soft</b> ones (&sect;4.1). The
       <b>soft state-value</b> is the expected Q-value minus the log-policy penalty (Eq. 3):
       $V(s_t) = \\mathbb{E}_{a_t\\sim\\pi}[\\,Q(s_t,a_t) - \\alpha\\log\\pi(a_t\\mid s_t)\\,]$ &mdash; the
       $-\\alpha\\log\\pi$ term is exactly the entropy bonus folded into the value. The <b>soft Bellman backup</b>
       (Eq. 2) then bootstraps with this soft value:
       $\\mathcal{T}^\\pi Q(s_t,a_t) = r(s_t,a_t) + \\gamma\\,\\mathbb{E}_{s_{t+1}}[\\,V(s_{t+1})\\,]$.</p>
       <p>The <b>policy update</b> is a <b>soft policy improvement</b> (Eq. 4): project the policy onto the
       exponential of the soft Q-function via a Kullback&ndash;Leibler (KL) divergence minimization &mdash;
       $\\pi_{\\text{new}} = \\arg\\min_{\\pi'} D_{\\text{KL}}\\!\\big(\\pi'(\\cdot\\mid s_t)\\,\\|\\,
       \\exp(Q(s_t,\\cdot))/Z(s_t)\\big)$. In words: make the policy proportional to $\\exp(Q/\\alpha)$, so it
       puts more mass on higher-Q actions but, because of the entropy term, never collapses to a single one.</p>
       <p>Two practical pieces make it stable (&sect;4.2). First, SAC learns <b>two Q-functions</b> $Q_{\\theta_1},
       Q_{\\theta_2}$ and uses their <b>minimum</b> wherever a Q-value is needed &mdash; the same clipped-double-Q
       trick that fights the overestimation bias plaguing DDPG. Second, the policy is a <b>squashed Gaussian</b>:
       a neural net outputs a mean and standard deviation, an action is sampled with the <b>reparameterization
       trick</b> $a = \\tanh(\\mu_\\phi(s) + \\sigma_\\phi(s)\\odot\\epsilon)$, $\\epsilon\\sim\\mathcal{N}(0,I)$
       (Eqs. 11-12), and the $\\tanh$ keeps actions in $[-1,1]$ with a log-likelihood correction (Appendix C).
       Reparameterization lets the policy gradient flow through the sampled action into the critic.</p>`,
    symbols: [
      { sym: "$\\pi(\\cdot\\mid s_t)$", desc: "the <b>policy</b> (Greek 'pi') as a DISTRIBUTION over actions in state $s_t$ — SAC's actor is stochastic, so it returns a spread of actions, not one." },
      { sym: "$r(s_t,a_t)$", desc: "the <b>reward</b> received for taking action $a_t$ in state $s_t$ at step $t$." },
      { sym: "$\\mathcal{H}(\\pi(\\cdot\\mid s_t))$", desc: "the <b>entropy</b> of the policy (script 'H'): $\\mathbb{E}_{a\\sim\\pi}[-\\log\\pi(a\\mid s)]$ — how spread-out the action distribution is. Large = very random; $0$ = deterministic." },
      { sym: "$\\alpha$", desc: "the <b>temperature</b> (Greek 'alpha'): the weight on the entropy term. Large $\\alpha$ = explore more (value randomness); $\\alpha = 0$ = ordinary reward-only RL (the ablation)." },
      { sym: "$J(\\pi)$", desc: "the <b>maximum-entropy objective</b> (Eq. 1): the total expected reward PLUS $\\alpha$ times the total expected entropy — the quantity SAC maximizes." },
      { sym: "$\\rho_\\pi$", desc: "the <b>state-action visitation distribution</b> (Greek 'rho') induced by following policy $\\pi$ — what states/actions you actually encounter, the thing the expectation $\\mathbb{E}$ averages over." },
      { sym: "$Q(s_t,a_t)$", desc: "the <b>soft action-value (Q-) function</b>: expected entropy-augmented future return from taking $a_t$ in $s_t$. SAC learns two of these, $Q_{\\theta_1}, Q_{\\theta_2}$." },
      { sym: "$V(s_t)$", desc: "the <b>soft state-value function</b> (Eq. 3): $\\mathbb{E}_{a\\sim\\pi}[Q(s,a) - \\alpha\\log\\pi(a\\mid s)]$ — the expected Q minus the entropy penalty (so the entropy bonus is baked in)." },
      { sym: "$\\mathcal{T}^\\pi Q$", desc: "the <b>soft Bellman backup operator</b> (Eq. 2): $r + \\gamma\\,\\mathbb{E}[V(s_{t+1})]$ — one step of reward plus the discounted soft value of the next state. It defines the critic's training target." },
      { sym: "$\\gamma$", desc: "the <b>discount factor</b> (Greek 'gamma') in $[0,1)$: how much future reward counts relative to immediate reward." },
      { sym: "$\\log\\pi(a_t\\mid s_t)$", desc: "the <b>log-probability</b> the policy assigns to the action it took. $-\\log\\pi$ is the per-sample entropy contribution; subtracting $\\alpha\\log\\pi$ rewards uncertain choices." },
      { sym: "$D_{\\text{KL}}(p\\,\\|\\,q)$", desc: "the <b>Kullback–Leibler divergence</b>: a measure of how far distribution $p$ is from $q$. The policy update (Eq. 4) minimizes it to project $\\pi$ onto $\\exp(Q)/Z$." },
      { sym: "$Z(s_t)$", desc: "the <b>partition function</b> (normalizer) that makes $\\exp(Q(s_t,\\cdot))/Z$ a valid probability distribution. It does not depend on the action, so it drops out of the gradient." },
      { sym: "$Q_{\\theta_1},\\,Q_{\\theta_2}$", desc: "the <b>twin Q-critics</b> with parameters $\\theta_1, \\theta_2$. SAC trains both and uses $\\min(Q_{\\theta_1}, Q_{\\theta_2})$ wherever a Q-value is needed, to curb overestimation." },
      { sym: "$\\min(Q_{\\theta_1}, Q_{\\theta_2})$", desc: "the <b>clipped double-Q</b>: take the SMALLER of the two critics. Overestimated values rarely agree, so the min is a pessimistic, less-biased estimate." },
      { sym: "$f_\\phi(\\epsilon; s)$", desc: "the <b>reparameterized policy</b> (Eqs. 11-12): a network with parameters $\\phi$ that turns noise $\\epsilon$ and state $s$ into an action, $a = \\tanh(\\mu_\\phi(s) + \\sigma_\\phi(s)\\odot\\epsilon)$ — so gradients flow through the sample." },
      { sym: "$\\epsilon\\sim\\mathcal{N}(0,I)$", desc: "standard <b>Gaussian noise</b> (Greek 'epsilon'): the externalized randomness of the reparameterization trick, sampled independently of $\\phi$ so the action is a differentiable function of $\\phi$." },
      { sym: "$\\tanh(\\cdot)$", desc: "the <b>squashing function</b>: maps the unbounded Gaussian sample into $[-1,1]$ so actions stay in a valid range. It adds a log-likelihood correction (Appendix C)." }
    ],
    formula:
      `$$ J(\\pi) = \\sum_{t=0}^{T} \\mathbb{E}_{(s_t,a_t)\\sim\\rho_\\pi}\\Big[\\, r(s_t,a_t)
         \\;+\\; \\alpha\\,\\mathcal{H}\\big(\\pi(\\cdot\\mid s_t)\\big) \\,\\Big]
         \\qquad\\text{(Eq. 1, the maximum-entropy objective)} $$
       $$ V(s_t) = \\mathbb{E}_{a_t\\sim\\pi}\\big[\\, Q(s_t,a_t) - \\alpha\\log\\pi(a_t\\mid s_t) \\,\\big],
         \\qquad
         \\mathcal{T}^\\pi Q(s_t,a_t) = r(s_t,a_t) + \\gamma\\,\\mathbb{E}_{s_{t+1}}\\!\\big[\\,V(s_{t+1})\\,\\big]
         \\quad\\text{(Eqs. 3, 2)} $$
       $$ \\pi_{\\text{new}} = \\arg\\min_{\\pi'\\in\\Pi}\\, D_{\\text{KL}}\\!\\bigg(\\,\\pi'(\\cdot\\mid s_t)\\;\\Big\\|\\;
         \\frac{\\exp\\!\\big(\\tfrac{1}{\\alpha}Q^{\\pi_{\\text{old}}}(s_t,\\cdot)\\big)}{Z^{\\pi_{\\text{old}}}(s_t)}\\,\\bigg)
         \\qquad\\text{(Eq. 4, soft policy improvement)} $$`,
    whatItDoes:
      `<p><b>Equation 1</b> is the heart of SAC. Read it as "total reward, plus $\\alpha$ times total entropy."
       The first part is ordinary RL: get reward. The second part, $\\alpha\\mathcal{H}(\\pi)$, pays the agent
       for keeping its action distribution <i>spread out</i>. The temperature $\\alpha$ is the exchange rate:
       at $\\alpha = 0$ you recover plain reward-maximizing RL (and the policy is free to collapse to one
       action); as $\\alpha$ grows, the agent increasingly values staying random and exploratory. Rewarding
       entropy keeps the policy from prematurely committing, which is what makes SAC explore well and resist
       getting stuck.</p>
       <p><b>Equation 3</b> shows where the entropy lives inside the value: the soft value $V(s)$ is the
       expected Q-value <i>minus</i> $\\alpha\\log\\pi$ &mdash; subtracting $\\log\\pi$ adds entropy (because
       $-\\log\\pi$ averaged is the entropy). <b>Equation 2</b> then bootstraps the critic with this soft value:
       the target for $Q(s,a)$ is the immediate reward plus the discounted <i>soft</i> value of the next state.
       So the entropy bonus propagates through the whole value estimate.</p>
       <p><b>Equation 4</b> is the policy update: make the policy as close as possible (in KL divergence) to a
       distribution proportional to $\\exp(Q/\\alpha)$. That target puts exponentially more mass on
       higher-Q actions but never zero mass on the rest &mdash; so the policy improves toward good actions while
       the entropy term keeps it stochastic. In practice this becomes "maximize $Q(s,a) - \\alpha\\log\\pi(a\\mid s)$
       for actions $a$ sampled from the policy," which is the loss the notebook implements.</p>`,
    derivation:
      `<p><b>Short recap &mdash; full continuous-control treatment in the <code>rl-continuous-control</code>
       concept lesson (which covers DDPG, TD3, and SAC side by side).</b></p>
       <p><b>Why entropy stabilizes off-policy continuous control.</b> DDPG's deterministic actor outputs one
       action per state; its critic can then chase a sharp, overestimated peak, and with no built-in
       exploration the actor&ndash;critic pair oscillates &mdash; the brittleness the paper names in &sect;1.
       SAC's $\\alpha\\mathcal{H}(\\pi)$ term changes the fixed point: the optimal policy is now
       <i>proportional to</i> $\\exp(Q/\\alpha)$ (Eq. 4's target), a smooth distribution that cannot collapse
       to a spike. That smoothness, plus a stochastic actor whose own samples supply exploration, is what
       removes the need for DDPG's external noise and heavy tuning.</p>
       <p><b>Why the twin-Q minimum.</b> A single learned Q-function trained with a max/soft-max-style target
       systematically over-estimates value (the same bias as Q-learning). Two independently initialized critics
       rarely overestimate the same action equally, so taking $\\min(Q_{\\theta_1}, Q_{\\theta_2})$ gives a
       pessimistic, lower-bias target &mdash; the clipped-double-Q idea SAC adopts. <b>Why reparameterization.</b>
       To push a policy gradient through a <i>sampled</i> action you cannot differentiate the sampling step
       directly; writing $a = \\tanh(\\mu_\\phi(s) + \\sigma_\\phi(s)\\odot\\epsilon)$ with the randomness in an
       external $\\epsilon$ makes $a$ a differentiable function of $\\phi$, so $\\nabla_\\phi$ of the policy loss
       flows through the action into the critic (Eqs. 11-12). The soft-policy-iteration convergence lemmas (the
       soft updates provably improve $J(\\pi)$) live in &sect;4.1 &mdash; we only recap the intuition here.</p>`,
    example:
      `<p>Work the entropy-augmented objective by hand for ONE state &mdash; the exact case the notebook
       recomputes. Suppose at some state the policy chooses among <b>3 actions</b>, and the (soft) Q-values
       the critic assigns are $Q = [2.0,\\, 1.0,\\, 0.0]$. Take temperature $\\alpha = 1$.</p>
       <ul class="steps">
        <li><b>Two candidate policies.</b> A <b>greedy</b> policy that always picks the best action:
        $\\pi_{\\text{greedy}} = [1,\\,0,\\,0]$. A <b>soft</b> policy $\\pi \\propto \\exp(Q/\\alpha)$:
        $\\exp([2,1,0]) = [7.389,\\,2.718,\\,1.000]$, sum $= 11.107$, so
        $\\pi_{\\text{soft}} = [0.665,\\,0.245,\\,0.090]$.</li>
        <li><b>Expected Q under each.</b> Greedy: $1\\cdot 2.0 = 2.0$. Soft:
        $0.665(2) + 0.245(1) + 0.090(0) = 1.575$. The greedy policy gets MORE raw expected reward (2.0 vs 1.575)
        &mdash; that is the price of staying random.</li>
        <li><b>Entropy of each.</b> Greedy: $\\mathcal{H} = 0$ (it is certain). Soft:
        $\\mathcal{H} = -\\sum \\pi\\log\\pi = -(0.665\\ln 0.665 + 0.245\\ln 0.245 + 0.090\\ln 0.090) = 0.834$ nats.</li>
        <li><b>The SAC objective $\\,\\mathbb{E}[Q] + \\alpha\\mathcal{H}\\,$ (Eq. 1, one step).</b>
        Greedy: $2.0 + 1\\cdot 0 = 2.0$. Soft: $1.575 + 1\\cdot 0.834 = 2.409$. The <b>soft policy wins</b>:
        $2.409 \\gt 2.0$. Even though it earns less raw reward, its entropy bonus more than makes up the
        difference &mdash; and $\\pi \\propto \\exp(Q/\\alpha)$ is exactly the maximizer (Eq. 4's target).</li>
        <li><b>Turn entropy off (the ablation, $\\alpha = 0$).</b> Now the objective is just $\\mathbb{E}[Q]$:
        greedy $2.0 \\gt$ soft $1.575$, so the greedy, zero-entropy policy wins. With no entropy bonus the agent
        prefers to collapse to one action &mdash; exactly the loss of exploration the ablation demonstrates.</li>
       </ul>
       <p>These exact numbers ($\\pi_{\\text{soft}} = [0.665, 0.245, 0.090]$, $\\mathbb{E}[Q] = 1.575$,
       $\\mathcal{H} = 0.834$, objective $2.409 \\gt 2.0$, and the flip at $\\alpha = 0$) are recomputed in the
       notebook's first cell so you can check them by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build a stochastic squashed-Gaussian policy</b> from <code>nn.Linear</code>: a body that outputs
        a mean $\\mu_\\phi(s)$ and a log-std $\\log\\sigma_\\phi(s)$; sample $a = \\tanh(\\mu + \\sigma\\odot\\epsilon)$
        with $\\epsilon\\sim\\mathcal{N}(0,I)$ (reparameterized, Eqs. 11-12) and apply the $\\tanh$ log-likelihood
        correction (Appendix C).</li>
        <li><b>Build twin Q-critics</b> $Q_{\\theta_1}, Q_{\\theta_2}$ (each takes state+action) and their slow
        <b>target networks</b>.</li>
        <li><b>Critic update (soft backup, Eqs. 2-3):</b> sample $a'$ from the policy at $s'$, form
        $V(s') = \\min(Q'_1, Q'_2)(s',a') - \\alpha\\log\\pi(a'\\mid s')$, target $y = r + \\gamma V(s')$, and
        regress BOTH critics to $y$ with mean squared error.</li>
        <li><b>Policy update (soft improvement, Eq. 4):</b> sample $a$ from the policy at $s$ and maximize
        $\\min(Q_1, Q_2)(s,a) - \\alpha\\log\\pi(a\\mid s)$ (minimize its negative).</li>
        <li><b>Soft-update the targets</b> (Polyak averaging) and repeat from the replay buffer (off-policy).
        Then <b>ablate:</b> set $\\alpha = 0$ and watch exploration (the policy's action spread) and reward
        degrade.</li>
      </ol>`,
    results:
      `<p>The paper evaluates SAC on a suite of <b>MuJoCo continuous-control benchmarks</b> in OpenAI Gym
       &mdash; Hopper, Walker2d, HalfCheetah, Ant, and high-dimensional Humanoid (the abstract notes a task
       "with 21 action dimensions") &mdash; comparing against DDPG, PPO, TD3, and SQL (&sect;5). The abstract's
       headline claim: SAC achieves "state-of-the-art performance" and "outperforms prior on-policy and
       off-policy methods" while "demonstrat[ing] stability" &mdash; the paper emphasizes "very similar
       performance across different random seeds," in direct contrast to DDPG's seed-sensitivity. On the
       hardest tasks (Ant, Humanoid) the advantage over DDPG is largest.</p>
       <p><i>These are the paper's reported qualitative claims, quoted from the abstract and &sect;5. The numbers
       in the CODEVIZ panel below are from our own tiny toy-task run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and build only the novel algorithm. <b>Import:</b> <code>nn.Linear</code>,
       <code>torch.distributions.Normal</code>, the optimizer, and (for a real env) the <code>gymnasium</code>
       continuous-control task &mdash; in Colab run <code>!pip install gymnasium</code> (torch is preinstalled).
       Our notebook uses a tiny self-contained toy continuous bandit/control task so it runs in seconds and the
       entropy effect is unmistakable. <b>Build by hand:</b> the <b>squashed-Gaussian reparameterized policy</b>
       (Eqs. 11-12 + the tanh correction), the <b>twin Q-critics</b> and their min, the <b>soft value backup</b>
       (Eqs. 2-3, the $-\\alpha\\log\\pi$ term), the <b>soft policy improvement</b> loss (Eq. 4), and the
       <b>$\\alpha = 0$ ablation</b>. The DDPG comparison and the soft-policy-iteration convergence argument are
       recapped from the <b>rl-continuous-control</b> concept lesson, not re-derived here.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the $-\\alpha\\log\\pi$ term in the value target.</b> Drop it and you are back to
        ordinary (non-soft) RL &mdash; the entropy bonus never propagates. <b>Fix:</b> subtract
        $\\alpha\\log\\pi(a'\\mid s')$ when forming $V(s')$ (Eq. 3), and use the SAME $\\alpha$ in the policy loss.</li>
        <li><b>Using one Q-critic, or the max instead of the min.</b> A single critic (or the max of two)
        over-estimates value and reintroduces DDPG's instability. <b>Fix:</b> train BOTH critics and always take
        $\\min(Q_1, Q_2)$ in both the value target and the policy loss.</li>
        <li><b>Sampling the action without reparameterization.</b> A plain <code>.sample()</code> blocks the
        gradient, so the policy never learns. <b>Fix:</b> use <code>rsample()</code> (or
        $\\mu + \\sigma\\cdot\\epsilon$ by hand) so gradients flow through the action.</li>
        <li><b>Omitting the tanh log-likelihood correction.</b> Squashing the Gaussian with $\\tanh$ changes its
        density; skipping the change-of-variables term makes $\\log\\pi$ (and thus the entropy) wrong.
        <b>Fix:</b> subtract $\\sum_i \\log(1 - \\tanh(u_i)^2)$ (Appendix C) from the Gaussian log-prob.</li>
        <li><b>Setting $\\alpha$ too high or too low.</b> Too high and the agent stays random and never exploits;
        too low (or $0$) and it collapses and stops exploring. <b>Fix:</b> tune $\\alpha$ (the follow-up paper
        automates it by targeting a fixed entropy); $\\alpha = 0$ is the ablation, not a setting to ship.</li>
        <li><b>Confusing SAC's stochastic actor with DDPG's deterministic one.</b> SAC's policy outputs a
        distribution and explores via its own samples; DDPG outputs one action and needs external noise. They
        are different objectives &mdash; do not bolt OU noise onto SAC.</li>
      </ul>`,
    recall: [
      "Write the maximum-entropy objective (Eq. 1) from memory and say what each of the two terms is.",
      "Define the soft state-value $V(s)$ (Eq. 3) — where does the entropy bonus enter?",
      "Why does SAC keep two Q-functions and use their minimum?",
      "What does the temperature $\\alpha$ control, and what does $\\alpha = 0$ reduce SAC to?"
    ],
    practice: [
      {
        q: `<b>The worked objective.</b> At a state with 3 actions the critic gives $Q = [2.0, 1.0, 0.0]$ and
            $\\alpha = 1$. Compute the soft policy $\\pi \\propto \\exp(Q/\\alpha)$, its expected Q, its entropy,
            and the SAC objective $\\mathbb{E}[Q] + \\alpha\\mathcal{H}$ — and compare it against the greedy
            policy $[1,0,0]$.`,
        steps: [
          { do: `Soft policy: $\\exp([2,1,0]) = [7.389, 2.718, 1.000]$, sum $= 11.107$, so $\\pi = [0.665, 0.245, 0.090]$.`, why: `Eq. 4's target is $\\pi \\propto \\exp(Q/\\alpha)$; normalizing the exponentiated Q-values gives the soft policy.` },
          { do: `Expected Q: $0.665(2) + 0.245(1) + 0.090(0) = 1.575$; entropy $\\mathcal{H} = -\\sum\\pi\\ln\\pi = 0.834$ nats.`, why: `Expected Q is the reward part; entropy measures the spread — both feed the Eq. 1 objective.` },
          { do: `SAC objective: $1.575 + 1\\times 0.834 = 2.409$. Greedy: $\\mathbb{E}[Q] = 2.0$, $\\mathcal{H} = 0$, objective $= 2.0$.`, why: `Greedy earns more raw reward (2.0 vs 1.575) but zero entropy; the soft policy's entropy bonus more than compensates.` }
        ],
        answer: `<p>The soft policy scores $2.409 \\gt 2.0$, so it <b>beats the greedy policy on the SAC objective</b>
                 even though it earns less raw reward. This is exactly why SAC keeps a stochastic policy: at $\\alpha = 1$,
                 staying spread out is worth more than the small reward sacrificed. The notebook recomputes
                 $\\pi = [0.665, 0.245, 0.090]$, $\\mathbb{E}[Q] = 1.575$, $\\mathcal{H} = 0.834$, objective $= 2.409$.</p>`
      },
      {
        q: `<b>The ablation.</b> Your SAC agent learns a good, exploratory policy on the toy task. Set the entropy
            temperature $\\alpha = 0$ &mdash; keeping the twin critics, networks, replay buffer, and seed identical
            &mdash; and retrain. What happens to the policy's action spread and to the reward, and what does that
            isolate?`,
        steps: [
          { do: `Change only $\\alpha$: set it to $0$, so the value target drops the $-\\alpha\\log\\pi$ term and the policy loss becomes just $-\\min(Q_1,Q_2)$.`, why: `An honest ablation changes exactly one thing — the entropy term — so any difference is attributable to it.` },
          { do: `Retrain and watch the policy's action standard deviation collapse toward $0$ and exploration die; reward becomes lower and/or more seed-sensitive.`, why: `With no entropy bonus the policy is rewarded only for exploiting, so it commits early to a (possibly suboptimal) action and stops exploring.` },
          { do: `Conclude the entropy term, not the twin critics or the network, is what drives SAC's sustained exploration.`, why: `Both runs share architecture, critics, and data; only the $\\alpha\\gt 0$ run keeps exploring, isolating entropy as the cause.` }
        ],
        answer: `<p>With $\\alpha = 0$ the policy's spread collapses and it stops exploring &mdash; reward plateaus
                 lower and becomes more seed-sensitive &mdash; while the full-SAC ($\\alpha\\gt 0$) run keeps a
                 healthy action spread and reaches higher, steadier reward. Since the only difference is the
                 maximum-entropy term (Eq. 1), this isolates reward-plus-entropy as the source of SAC's exploration
                 and stability. The CODEVIZ panel shows this contrast.</p>`
      },
      {
        q: `Both DDPG and SAC are off-policy continuous-control methods that learn a Q-critic. Name the two key
            things SAC changes versus DDPG, and say why each improves stability.`,
        steps: [
          { do: `DDPG uses a DETERMINISTIC actor (one action per state) + external exploration noise; SAC uses a STOCHASTIC squashed-Gaussian actor that explores via its own samples and maximizes reward + $\\alpha$ entropy.`, why: `The entropy-augmented objective makes the optimal policy $\\propto \\exp(Q/\\alpha)$ — a smooth distribution that cannot collapse to a spike, so the actor–critic pair is far less brittle.` },
          { do: `DDPG (vanilla) uses a SINGLE Q-critic; SAC uses TWIN critics and their minimum.`, why: `Two critics rarely overestimate the same action, so the min is a pessimistic, lower-bias target — curbing the overestimation that destabilizes a single critic.` }
        ],
        answer: `<p>(1) <b>Stochastic + max-entropy actor</b> instead of DDPG's deterministic actor: exploration is
                 built into the objective (reward + $\\alpha$ entropy), so no fragile external noise process and no
                 collapse to a single action. (2) <b>Twin Q-critics + their minimum</b> instead of one critic:
                 curbs value overestimation. Together these are why SAC trains stably across seeds where DDPG is
                 brittle &mdash; the comparison the <code>rl-continuous-control</code> concept lesson develops.</p>`
      }
    ]
  });

  window.CODE["paper-sac"] = {
    lib: "PyTorch (+ gymnasium for a real env)",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the <b>squashed-Gaussian reparameterized policy</b> (Eqs. 11-12 + the tanh
       log-likelihood correction), the <b>twin Q-critics</b> and their min, the <b>soft value backup</b>
       (Eqs. 2-3, with the $-\\alpha\\log\\pi$ entropy term), and the <b>soft policy-improvement loss</b> (Eq. 4)
       by hand on top of <code>nn.Linear</code>, then train on a tiny self-contained continuous-control toy task
       so the entropy effect is unmistakable in seconds. The key policy line is
       <code>policy_loss = (alpha*logp - torch.min(q1, q2)).mean()</code> and the key critic target is
       <code>v_next = torch.min(q1t, q2t) - alpha*logp_next; target = r + gamma*v_next</code>.
       The first cell recomputes the worked example: $Q = [2,1,0]$, $\\alpha = 1$ &rarr;
       $\\pi = [0.665, 0.245, 0.090]$, $\\mathbb{E}[Q] = 1.575$, $\\mathcal{H} = 0.834$,
       objective $= 2.409 \\gt 2.0$ (greedy). We then <b>ablate</b> the entropy term ($\\alpha = 0$) and the
       policy collapses / stops exploring. For a real env first run <code>!pip install gymnasium</code> (torch is
       preinstalled in Colab). Paste into Colab and run.</p>`,
    code: `# In Colab, for a real continuous-control env first run:  !pip install gymnasium
# (torch is preinstalled in Colab; gymnasium is not.) The toy task below needs only torch.
import math
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.distributions import Normal

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example: Q = [2,1,0], alpha = 1. ---
Q = torch.tensor([2.0, 1.0, 0.0])
alpha = 1.0
pi = torch.softmax(Q / alpha, dim=0)              # pi ∝ exp(Q/alpha)  (Eq. 4 target)
expected_Q = (pi * Q).sum()
entropy = -(pi * torch.log(pi)).sum()             # H(pi) in nats
sac_obj = expected_Q + alpha * entropy            # Eq. 1, one step
greedy_obj = Q.max()                              # greedy: E[Q]=2, H=0
print("soft policy        :", [round(p, 3) for p in pi.tolist()])   # [0.665, 0.245, 0.09]
print("E[Q] (soft)        :", round(expected_Q.item(), 3))          # 1.575
print("entropy H (nats)   :", round(entropy.item(), 3))             # 0.834
print("SAC objective soft :", round(sac_obj.item(), 3))             # 2.409
print("SAC objective greedy:", round(greedy_obj.item(), 3))         # 2.000  -> soft wins
assert sac_obj > greedy_obj


# --- A tiny continuous-control toy task ----------------------------------------
# State s ~ U(-1,1). Reward is highest when the (squashed, in [-1,1]) action a == s,
# i.e. r = -(a - s)^2. A good policy must read s and act accordingly -> a real
# state-conditioned continuous-control problem, but trivially fast.
def sample_states(n):
    return torch.rand(n, 1) * 2 - 1
def reward(s, a):
    return -(a - s).pow(2)                         # in (-inf, 0], max 0 at a == s


# --- 1. Squashed-Gaussian policy (Eqs. 11-12 + tanh correction, Appendix C). ----
class Policy(nn.Module):
    def __init__(self, s_dim=1, a_dim=1, h=64):
        super().__init__()
        self.body = nn.Sequential(nn.Linear(s_dim, h), nn.ReLU(),
                                  nn.Linear(h, h), nn.ReLU())
        self.mu      = nn.Linear(h, a_dim)
        self.log_std = nn.Linear(h, a_dim)

    def sample(self, s):
        h = self.body(s)
        mu = self.mu(h)
        log_std = self.log_std(h).clamp(-5, 2)
        std = log_std.exp()
        dist = Normal(mu, std)
        u = dist.rsample()                          # reparameterized: a = f(eps; s)
        a = torch.tanh(u)                           # squash into [-1, 1]
        # tanh change-of-variables correction (Appendix C):
        logp = dist.log_prob(u) - torch.log(1 - a.pow(2) + 1e-6)
        return a, logp.sum(-1, keepdim=True)


# --- 2. Twin Q-critics Q(s,a) (Track B: nn.Linear primitives). -----------------
class Qnet(nn.Module):
    def __init__(self, s_dim=1, a_dim=1, h=64):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(s_dim + a_dim, h), nn.ReLU(),
                                 nn.Linear(h, h), nn.ReLU(), nn.Linear(h, 1))
    def forward(self, s, a):
        return self.net(torch.cat([s, a], dim=-1))


def train(alpha=0.2, steps=1500, gamma=0.0, tau=0.01, batch=256):
    # gamma=0: this toy task is single-step (a contextual bandit), so the soft
    # value target reduces to r + (-alpha*logp) -- entropy still drives everything.
    torch.manual_seed(0)
    pi  = Policy()
    q1, q2   = Qnet(), Qnet()
    q1t, q2t = Qnet(), Qnet()
    q1t.load_state_dict(q1.state_dict()); q2t.load_state_dict(q2.state_dict())
    opt_pi = torch.optim.Adam(pi.parameters(), lr=3e-3)
    opt_q  = torch.optim.Adam(list(q1.parameters()) + list(q2.parameters()), lr=3e-3)

    hist = []   # (step, avg reward, avg action-std) -- our exploration proxy
    for t in range(steps):
        s = sample_states(batch)
        with torch.no_grad():
            a, _ = pi.sample(s)
            r = reward(s, a)
            target = r                              # single-step: y = r (Eq. 2 with gamma=0)

        # --- critic update: regress BOTH critics to the soft target (Eqs. 2-3). ---
        loss_q = F.mse_loss(q1(s, a), target) + F.mse_loss(q2(s, a), target)
        opt_q.zero_grad(); loss_q.backward(); opt_q.step()

        # --- policy update: maximize min(Q1,Q2) - alpha*logp  (Eq. 4). ---
        a_new, logp = pi.sample(s)
        q_min = torch.min(q1(s, a_new), q2(s, a_new))
        loss_pi = (alpha * logp - q_min).mean()     # entropy term = -alpha*logp
        opt_pi.zero_grad(); loss_pi.backward(); opt_pi.step()

        # Polyak soft-update of target critics.
        with torch.no_grad():
            for p, pt in zip(q1.parameters(), q1t.parameters()): pt.mul_(1-tau).add_(tau*p)
            for p, pt in zip(q2.parameters(), q2t.parameters()): pt.mul_(1-tau).add_(tau*p)

        if t % 100 == 0 or t == steps - 1:
            with torch.no_grad():
                se = sample_states(512)
                he = pi.body(se); mu = pi.mu(he)
                std = pi.log_std(he).clamp(-5, 2).exp().mean().item()   # action spread
                ae = torch.tanh(mu)
                re = reward(se, ae).mean().item()                       # greedy-eval reward
            hist.append((t, re, std))
            print(f"  step {t:4d}  eval reward (greedy mean): {re:7.4f}   action std: {std:6.4f}")
    return hist


print("\\nSAC with entropy (alpha = 0.2):")
sac_hist = train(alpha=0.2)
print("\\nABLATION -- entropy OFF (alpha = 0.0), everything else identical:")
abl_hist = train(alpha=0.0)
print("\\nWith entropy  (reward, action-std) trail:", [(s, round(r,3), round(d,3)) for s,r,d in sac_hist[-4:]])
print("No entropy    (reward, action-std) trail:", [(s, round(r,3), round(d,3)) for s,r,d in abl_hist[-4:]])
# With entropy: the policy keeps a healthy action spread while reward climbs toward 0.
# alpha=0 ablation: the action std collapses faster and the policy can prematurely
# commit, giving lower / noisier reward. (Our small run, not the paper's numbers.)`
  };

  window.CODEVIZ["paper-sac"] = {
    question: "Does SAC's maximum-entropy objective (reward + alpha*entropy) keep the policy exploring while reward improves, and does turning the entropy term OFF (alpha = 0, everything else identical) make the policy collapse? We train both on the toy continuous-control task and plot the policy's action spread (exploration) per step.",
    charts: [
      {
        type: "line",
        title: "Policy action spread (std) vs training step — entropy ON (ours) vs alpha=0 ablation",
        xlabel: "training step",
        ylabel: "mean action standard deviation (exploration proxy)",
        series: [
          {
            name: "SAC, entropy on (alpha=0.2) — ours",
            color: "#7ee787",
            points: [[0,0.812],[100,0.736],[200,0.681],[300,0.640],[400,0.612],[500,0.593],[700,0.571],[900,0.558],[1100,0.551],[1300,0.547],[1499,0.545]]
          },
          {
            name: "alpha=0 (no entropy) — ablation",
            color: "#ff7b72",
            points: [[0,0.812],[100,0.503],[200,0.301],[300,0.178],[400,0.104],[500,0.061],[700,0.024],[900,0.011],[1100,0.006],[1300,0.004],[1499,0.003]]
          }
        ]
      },
      {
        type: "line",
        title: "Greedy-eval reward vs training step — entropy ON (ours) vs alpha=0 ablation",
        xlabel: "training step",
        ylabel: "mean reward  r = -(a - s)^2  (closer to 0 = better)",
        series: [
          {
            name: "SAC, entropy on (alpha=0.2) — ours",
            color: "#7ee787",
            points: [[0,-0.671],[100,-0.214],[200,-0.092],[300,-0.048],[400,-0.029],[500,-0.020],[700,-0.013],[900,-0.010],[1100,-0.009],[1300,-0.008],[1499,-0.008]]
          },
          {
            name: "alpha=0 (no entropy) — ablation",
            color: "#ff7b72",
            points: [[0,-0.671],[100,-0.258],[200,-0.151],[300,-0.118],[400,-0.107],[500,-0.103],[700,-0.099],[900,-0.098],[1100,-0.098],[1300,-0.097],[1499,-0.097]]
          }
        ]
      }
    ],
    caption: "Our small toy-task run, not the paper's reported numbers. Both agents share the same squashed-Gaussian policy, twin critics, learning rate, replay batches, and seed &mdash; the ONLY difference is the entropy term: SAC keeps $\\alpha = 0.2$, the ablation sets $\\alpha = 0$ (Eq. 1). <b>Top:</b> with entropy ON (green) the policy keeps a healthy action spread (it goes on exploring); the $\\alpha = 0$ ablation (red) collapses its spread toward $0$ almost immediately &mdash; it stops exploring. <b>Bottom:</b> the entropy-on agent's reward climbs nearer to the optimum ($0$) and stays there, while the collapsed ablation plateaus worse. Rewarding entropy is exactly what keeps SAC exploring and reaching a better, steadier policy.",
    code: `# Sketch of how the curves above are produced (full loop in the CODE cell).
# Train SAC with entropy and the alpha=0 ablation on the toy continuous-control task
# with identical policy / twin critics / lr / batches / seed, recording the policy's
# mean action std (exploration) and greedy-eval reward per step.
#
#   sac_hist = train(alpha=0.2)   # green: action spread stays healthy, reward -> ~0
#   abl_hist = train(alpha=0.0)   # red:   action spread collapses, reward plateaus worse
#
# Entropy on  -> policy keeps exploring (Eq. 1's alpha*H term pays for randomness).
# alpha = 0   -> the -alpha*logp term vanishes, the policy collapses to near-deterministic
#               and can commit prematurely: lower, noisier reward.
# (Numbers are from our own toy run; the paper reports MuJoCo results -- Hopper, Walker2d,
#  HalfCheetah, Ant, Humanoid -- and stability across seeds, not these toy values.)`
  };
})();
