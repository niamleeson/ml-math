/* Paper lesson — "Trust Region Policy Optimization" (TRPO), Schulman, Levine, Moritz, Jordan, Abbeel 2015.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-trpo".
   GROUNDED from arXiv:1502.05477 (ICML 2015), read via the ar5iv HTML mirror:
   abstract, Sections 2-6 and 8, Eqs. 3, 8, 9, 12, 14, Theorem 1, Algorithm 1, delta=0.01.
   Track B (architecture): demonstrate the constrained trust-region STEP on a toy softmax policy —
   maximize the importance-sampling surrogate subject to mean KL <= delta — and ablate the constraint
   (an unconstrained greedy step) to show the overshoot that TRPO's trust region exists to prevent.
   The policy-gradient / KL math owner is the concept lesson rl-ppo; here we recap and cross-link.
   PPO (paper-ppo) is the simpler first-order successor — cross-linked throughout. */
(function () {
  window.LESSONS.push({
    id: "paper-trpo",
    title: "TRPO — Trust Region Policy Optimization (2015)",
    tagline: "Maximize a surrogate of the return, but only within a trust region — keep the new policy's average KL-divergence from the old one below a small budget — and improvement is (near-)monotonic.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "John Schulman, Sergey Levine, Philipp Moritz, Michael I. Jordan, Pieter Abbeel",
      org: "University of California, Berkeley",
      year: 2015,
      venue: "ICML 2015 (arXiv:1502.05477)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1502.05477",
      code: "https://github.com/joschu/modular_rl"
    },
    conceptLink: "rl-ppo",
    partOf: [],
    prereqs: ["rl-ppo", "rl-policy-gradients", "rl-actor-critic", "rl-mdp", "prob-expectation"],

    // WHY READ IT
    problem:
      `<p>Reinforcement learning (RL) means learning to act by trial and error to maximize reward; a
       <b>policy</b> is the rule (a neural network) that maps a state to an action; a <b>policy gradient</b>
       nudges that network toward actions that earned more reward. The chronic problem is <i>step size</i>.
       A plain policy-gradient update has no built-in sense of "how far is too far": one over-large step can
       move the policy into a region where it performs terribly, and because RL is <b>on-policy</b> &mdash;
       the next batch of experience is collected by the now-broken policy &mdash; it may never recover.</p>
       <p>The deeper reason is that policy gradient maximizes a <b>surrogate</b> objective built from data the
       <i>old</i> policy collected. That surrogate is only an accurate model of the true return <i>near</i> the
       old policy. Trust it too far and you are optimizing a stale estimate. The paper's whole premise (&sect;1):</p>
       <blockquote>"We describe an iterative procedure for optimizing policies, with guaranteed monotonic
       improvement." (Abstract)</blockquote>
       <p>So the question is: how big a step can you take and still be <i>sure</i> the true return went up, not
       just the surrogate? Before TRPO, the standard answers were either fragile (vanilla policy gradient with a
       hand-tuned learning rate) or theoretically loose (natural gradient with no improvement guarantee).</p>`,
    contribution:
      `<ul>
        <li><b>A monotonic-improvement bound.</b> Theorem 1 (&sect;3) proves the true return $\\eta(\\tilde\\pi)$
        is at least the surrogate $L_\\pi(\\tilde\\pi)$ minus a penalty proportional to the <b>KL-divergence</b>
        between the old and new policy (Eq. 9). Optimize that lower bound and the true return cannot decrease.</li>
        <li><b>The trust-region surrogate optimization.</b> Turning the penalty into a <b>constraint</b> for a
        usable step size gives the practical problem (Eq. 12): <b>maximize the surrogate subject to the average
        KL-divergence staying below a small budget $\\delta$.</b> That KL ball is the "trust region".</li>
        <li><b>A scalable second-order solver.</b> The constrained step is solved with a <b>conjugate-gradient</b>
        natural-gradient direction plus a <b>line search</b> that enforces the KL constraint &mdash; using
        Fisher-vector products so it never forms the full Hessian, so it scales to neural-network policies (&sect;6).</li>
      </ul>`,
    whyItMattered:
      `<p>TRPO was the first deep-RL method to make large neural-network policies train <i>reliably</i> on the
       same algorithm across simulated robotics (swimming, hopping, walking) and Atari from pixels. Its trust-region
       idea &mdash; "improve the surrogate, but don't let the policy move too far in one step" &mdash; became the
       template for the field's default algorithm, <b>PPO (Proximal Policy Optimization)</b>. PPO keeps TRPO's
       goal but replaces the hard KL constraint and second-order solver with a cheap first-order <b>clip</b>, so it
       works with shared policy/value networks and plain stochastic gradient descent. If you have read
       <b>paper-ppo</b>, this is the paper it simplifies: TRPO is the principled, heavier original; PPO is the
       practical successor. (See the cross-link below.)</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Preliminaries)</b> &mdash; the expected return $\\eta(\\pi)$ and the surrogate
        $L_\\pi(\\tilde\\pi)$ (<b>Eq. 3</b>), which matches $\\eta$ to first order at the old policy. This is the
        object every later step optimizes.</li>
        <li><b>&sect;3 (Monotonic Improvement)</b> &mdash; the core theory. <b>Theorem 1 / Eq. 8</b> bounds the
        true return below by the surrogate minus a total-variation penalty; <b>Eq. 9</b> rewrites it with the
        max KL-divergence and constant $C=\\tfrac{4\\epsilon\\gamma}{(1-\\gamma)^2}$, and <b>Algorithm 1</b> is the
        theoretical guaranteed-improvement scheme.</li>
        <li><b>&sect;4 (Parameterized policies)</b> &mdash; turning the penalty into the practical <b>trust-region
        constraint</b> (<b>Eq. 12</b>): maximize the surrogate subject to mean KL $\\le \\delta$.</li>
        <li><b>&sect;5-6 (Sample-based estimation, Practical algorithm)</b> &mdash; the single-path estimator
        (<b>Eq. 14</b>, the importance-sampling form), and how conjugate gradient + line search solve the
        constrained step.</li>
       </ul>
       <p><b>Skim:</b> the "vine" estimator in &sect;5 (a lower-variance but simulator-resetting alternative), and
       the per-task experiment plots in &sect;8 &mdash; note the headline that the same method handles locomotion
       and Atari.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You repeatedly improve a policy by maximizing the surrogate $L$ built from the <i>old</i> policy's data.
       One version takes the <b>largest step that keeps the average KL-divergence below a small budget
       $\\delta$</b> (the trust region); the other ignores KL and takes a <b>big greedy step</b> straight up the
       surrogate gradient each iteration. The surrogate is only accurate <i>near</i> the old policy. Which version
       do you expect to raise the <b>true</b> return smoothly &mdash; and what do you expect to happen on the very
       first iteration of the greedy one? Write your guess and one sentence of reasoning, then run it below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the constrained step you will build for a small softmax policy. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li>Compute the surrogate gradient direction <code>g</code> at the old policy
        <i># ascent direction of $L$</i>.</li>
        <li>TODO: define the trust-region test &mdash; <code>kl(new, old) &lt;= delta</code> using
        $D_{KL}(\\pi_{old}\\,\\|\\,\\pi_{new})$.</li>
        <li>TODO: <b>line-search</b> the step length $\\beta$: take the largest $\\beta$ along <code>g</code> for
        which <code>kl(old + beta*g, old) &lt;= delta</code> <i># Eq. 12 — stay inside the KL ball</i>.</li>
        <li>TODO: for the ablation, drop the test and take a fixed big step <code>old + biglr*g</code>, then
        measure the realized true return.</li>
       </ul>
       <p>Then iterate and predict whether the constrained true-return curve climbs monotonically while the
       unconstrained one overshoots.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from what we actually want to maximize: the expected discounted return $\\eta(\\pi)$ of a policy
       (&sect;2). We cannot optimize $\\eta(\\tilde\\pi)$ for a candidate new policy $\\tilde\\pi$ directly &mdash;
       evaluating it needs fresh rollouts from $\\tilde\\pi$. So the paper introduces a <b>surrogate</b> built
       from the <i>old</i> policy's state visitation and advantages (&sect;2, Eq. 3):</p>
       <p>$$ L_\\pi(\\tilde\\pi) = \\eta(\\pi) + \\sum_s \\rho_\\pi(s) \\sum_a \\tilde\\pi(a\\mid s)\\, A_\\pi(s,a). $$</p>
       <p>Here $\\rho_\\pi(s)$ is how often the <i>old</i> policy visits state $s$, and $A_\\pi(s,a)$ is the
       <b>advantage</b> &mdash; how much better action $a$ is than the old policy's average in $s$. The key
       property: $L_\\pi$ matches the true $\\eta$ in value <b>and gradient</b> at $\\pi$ itself, so a small step
       that increases $L$ also increases $\\eta$. The danger (the same one PPO names): $L$ is a <i>local</i> model.
       Push $\\tilde\\pi$ far from $\\pi$ and $L$ stops predicting $\\eta$, so a large surrogate gain can hide a
       true-return drop.</p>
       <p>TRPO's contribution is to quantify "too far". <b>Theorem 1</b> (&sect;3) proves a lower bound: the true
       return is at least the surrogate minus a penalty that grows with the <b>KL-divergence</b> $D_{KL}$ between
       old and new policy (Eq. 9, below). KL-divergence measures how different two probability distributions are
       &mdash; here, how much the new policy's action distribution differs from the old one's. Because it is a
       <i>lower bound</i> that is tight at $\\pi$, maximizing the bound is guaranteed not to decrease the true
       return: that is the <b>monotonic improvement</b> guarantee, and Algorithm 1 iterates it.</p>
       <p>The penalty version (Eq. 9) takes such tiny steps that it is impractical. So &sect;4 converts the penalty
       into a <b>constraint</b>: maximize the surrogate <b>subject to</b> the (average) KL-divergence staying below
       a fixed budget $\\delta$ (<b>Eq. 12</b>). That KL ball of radius $\\delta$ is the <b>trust region</b> &mdash;
       the neighborhood where the surrogate is trustworthy. &sect;5 writes the surrogate in sample form with the
       <b>importance-sampling ratio</b> $\\tfrac{\\pi_\\theta(a\\mid s)}{\\pi_{\\theta_{old}}(a\\mid s)}$ (Eq. 14),
       and &sect;6 solves the constrained step with a conjugate-gradient natural-gradient direction plus a line
       search that backtracks until the KL constraint holds &mdash; all via Fisher-vector products, so the full
       Hessian is never formed. The paper used $\\delta = 0.01$ for the locomotion experiments (&sect;8).</p>`,
    symbols: [
      { sym: "$\\pi,\\,\\tilde\\pi$", desc: "the OLD policy $\\pi$ (which collected the data) and a candidate NEW policy $\\tilde\\pi$ (Greek 'pi'). A policy maps each state to a probability distribution over actions." },
      { sym: "$\\theta,\\,\\theta_{old}$", desc: "the parameters (weights) of the new and old policy networks (Greek 'theta'). $\\theta$ moves away from the frozen $\\theta_{old}$, then $\\theta_{old}\\leftarrow\\theta$." },
      { sym: "$\\eta(\\pi)$", desc: "the <b>expected discounted return</b> of policy $\\pi$ (Greek 'eta') — the TRUE objective we want to maximize, but cannot evaluate for a new policy without fresh rollouts." },
      { sym: "$L_\\pi(\\tilde\\pi)$", desc: "the <b>surrogate objective</b> (Eq. 3): a local model of $\\eta$ built from the OLD policy's data. Matches $\\eta$ in value and gradient AT $\\pi$, but drifts from it far away." },
      { sym: "$\\rho_\\pi(s)$", desc: "the (discounted) <b>state visitation frequency</b> under the old policy $\\pi$ — how often state $s$ is seen (Greek 'rho')." },
      { sym: "$A_\\pi(s,a)$", desc: "the <b>advantage</b>: how much better taking action $a$ in state $s$ is than the old policy's average value there. Positive = better than expected." },
      { sym: "$D_{KL}(p\\,\\|\\,q)$", desc: "the <b>Kullback&ndash;Leibler (KL) divergence</b>: a non-negative measure of how different distribution $q$ is from $p$; $0$ only when $p=q$, larger as they diverge." },
      { sym: "$\\bar D_{KL}^{\\rho}(\\theta_{old},\\theta)$", desc: "the <b>average (mean) KL-divergence</b> over states visited by the old policy: $\\mathbb{E}_{s\\sim\\rho}[\\,D_{KL}(\\pi_{\\theta_{old}}(\\cdot\\mid s)\\,\\|\\,\\pi_\\theta(\\cdot\\mid s))\\,]$. The practical trust-region quantity (a heuristic for the max KL)." },
      { sym: "$\\delta$", desc: "the <b>trust-region size</b> (Greek 'delta') — the KL budget. The new policy must satisfy mean KL $\\le \\delta$. The paper uses $\\delta = 0.01$ in the locomotion experiments." },
      { sym: "$\\frac{\\pi_\\theta(a\\mid s)}{\\pi_{\\theta_{old}}(a\\mid s)}$", desc: "the <b>importance-sampling ratio</b> (Eq. 14): re-weights the old policy's samples to estimate the new policy's expected advantage. Equals $1$ when the policies agree." },
      { sym: "$C$", desc: "the penalty constant $\\tfrac{4\\epsilon\\gamma}{(1-\\gamma)^2}$ in the bound (Eq. 9), where $\\epsilon = \\max_{s,a}|A_\\pi(s,a)|$ and $\\gamma$ is the discount factor." },
      { sym: "$\\gamma$", desc: "the <b>discount factor</b> (Greek 'gamma') in $[0,1)$: how much future reward counts relative to immediate reward." },
      { sym: "$\\beta$", desc: "the <b>step length</b> along the ascent direction (Greek 'beta'). The line search shrinks $\\beta$ until the KL constraint holds — the largest $\\beta$ inside the trust region." }
    ],
    formula:
      `$$ \\eta(\\tilde\\pi) \\;\\ge\\; L_\\pi(\\tilde\\pi) \\;-\\; C\\, D_{KL}^{\\max}(\\pi,\\tilde\\pi),
         \\qquad C=\\frac{4\\epsilon\\gamma}{(1-\\gamma)^2}
         \\qquad\\text{(Theorem 1, Eq. 9)} $$
       $$ \\underset{\\theta}{\\text{maximize}}\\;\\; L_{\\theta_{old}}(\\theta)
         \\qquad\\text{subject to}\\qquad
         \\bar D_{KL}^{\\,\\rho_{\\theta_{old}}}(\\theta_{old},\\theta) \\;\\le\\; \\delta
         \\qquad\\text{(Eq. 12)} $$
       $$ \\underset{\\theta}{\\text{maximize}}\\;\\;
         \\mathbb{E}_{s\\sim\\rho_{\\theta_{old}},\\,a\\sim q}\\!\\left[\\,
         \\frac{\\pi_\\theta(a\\mid s)}{q(a\\mid s)}\\, Q_{\\theta_{old}}(s,a)\\,\\right]
         \\;\\;\\text{s.t.}\\;\\; \\mathbb{E}_{s\\sim\\rho_{\\theta_{old}}}\\!\\big[D_{KL}(\\pi_{\\theta_{old}}\\,\\|\\,\\pi_\\theta)\\big]\\le\\delta
         \\qquad\\text{(Eq. 14)} $$`,
    whatItDoes:
      `<p><b>Equation 9 (Theorem 1)</b> is the theoretical heart. It says the true return of any new policy is
       <b>at least</b> the surrogate value minus $C$ times the KL-divergence from the old policy. Because the bound
       is tight at the old policy (KL $=0$ there, and $L=\\eta$), maximizing the right-hand side cannot make the
       true return go down &mdash; that is the <b>monotonic improvement</b> guarantee. The penalty term is the
       price of moving: the further you go (larger KL), the more the bound discounts the surrogate gain.</p>
       <p><b>Equation 12</b> is the practical move. Optimizing Eq. 9 directly takes minuscule steps (the constant
       $C$ is huge), so TRPO swaps the KL <i>penalty</i> for a KL <i>constraint</i>: take the <b>biggest</b> step
       that maximizes the surrogate while keeping the average KL within a fixed budget $\\delta$. Geometrically you
       climb the surrogate but stay inside a small "trust region" ball around the old policy &mdash; the region
       where the surrogate is still a faithful model of the true return.</p>
       <p><b>Equation 14</b> writes this with samples. The surrogate becomes an expectation over the old policy's
       states and actions, re-weighted by the <b>importance-sampling ratio</b>
       $\\tfrac{\\pi_\\theta}{\\pi_{\\theta_{old}}}$ so that old data estimates the new policy's value, and the
       constraint becomes the <b>average</b> KL over visited states (a heuristic stand-in for the theory's max KL).
       Solving it: take a natural-gradient step (conjugate gradient), then line-search the step length down until
       the KL constraint is satisfied.</p>`,
    derivation:
      `<p><b>Short recap &mdash; full policy-gradient and KL math in the <code>rl-ppo</code> concept lesson.</b>
       The surrogate $L_\\pi$ comes from the same place as PPO's: <b>importance sampling</b>. We have data from
       $\\pi_{\\theta_{old}}$ but want the expected advantage under $\\pi_\\theta$, and importance sampling rewrites
       that expectation with the ratio $\\tfrac{\\pi_\\theta}{\\pi_{\\theta_{old}}}$ as the correction factor (Eq. 14).
       At the start of each update $\\theta = \\theta_{old}$, so every ratio is $1$ and the gradient of the
       surrogate equals the ordinary policy gradient &mdash; the constraint only bites as $\\theta$ moves.</p>
       <p><b>Why the bound holds (sketch).</b> Theorem 1 starts from an identity expressing $\\eta(\\tilde\\pi)$
       in terms of $\\eta(\\pi)$ plus the expected advantage of $\\tilde\\pi$ under <i>its own</i> visitation. The
       only error in replacing $\\tilde\\pi$'s visitation with $\\pi$'s (which gives $L_\\pi$) is bounded by how
       different the two policies are &mdash; measured first by total variation (Eq. 8), then upgraded to KL via
       Pinsker's inequality (Eq. 9). The penalty constant $C=\\tfrac{4\\epsilon\\gamma}{(1-\\gamma)^2}$ carries the
       horizon $\\tfrac{1}{1-\\gamma}$ squared, which is why it is large and why the paper prefers the
       <i>constraint</i> form (Eq. 12) with a tunable $\\delta$ over the penalty form. The full total-variation /
       Pinsker derivation lives in &sect;3 of the paper; the policy-gradient and KL foundations are recapped from
       the <b>rl-ppo</b> concept lesson, not re-derived here.</p>`,
    example:
      `<p>Take one <b>constrained trust-region step</b> by hand &mdash; the exact case the notebook recomputes.
       Use a single-state policy over three actions, starting <b>uniform</b>: $\\pi_{old}=(\\tfrac13,\\tfrac13,\\tfrac13)$.
       Suppose the old-policy rollouts estimated advantages $A=(+1,\\,-0.5,\\,-0.5)$ &mdash; action 0 is good, the
       other two below average. Use trust-region size $\\delta = 0.02$.</p>
       <ul class="steps">
        <li><b>Surrogate to maximize.</b> Sampling actions from $\\pi_{old}$, the importance-sampled surrogate
        $\\mathbb{E}[\\tfrac{\\pi}{\\pi_{old}}A]$ reduces to $\\sum_a \\pi(a)\\,A(a)$. At the start it is
        $\\tfrac13(1)+\\tfrac13(-0.5)+\\tfrac13(-0.5)=0$. We want to raise it.</li>
        <li><b>Ascent direction.</b> The gradient of the surrogate with respect to the action logits at the uniform
        policy is $g = \\pi(A-\\bar A) = (0.333,\\,-0.167,\\,-0.167)$ &mdash; push probability toward action 0.</li>
        <li><b>Line-search the step inside the trust region.</b> Walk along $g$: $\\theta_{new}=\\theta_{old}+\\beta g$,
        and find the largest $\\beta$ with mean $D_{KL}(\\pi_{old}\\,\\|\\,\\pi_{new})\\le 0.02$. That boundary is at
        $\\beta \\approx 0.83$, giving logits $(0.277,\\,-0.139,\\,-0.139)$.</li>
        <li><b>Read off the new policy.</b> $\\pi_{new} = (0.431,\\,0.284,\\,0.284)$: action 0's probability rose
        from $0.333$ to $0.431$. The realized KL is $0.020$ &mdash; exactly on the trust-region boundary &mdash;
        and the surrogate climbed from $0$ to $0.147$. We improved as much as the KL budget allows, and <i>no
        further</i>. <b>That is the trust region binding.</b></li>
       </ul>
       <p>These exact numbers ($g=(0.333,-0.167,-0.167)$, $\\beta\\approx0.83$, $\\pi_{new}=(0.431,0.284,0.284)$,
       KL $=0.020$, surrogate $=0.147$) are recomputed in the notebook's first cell so you can check the step by
       running it. An unconstrained greedy step would shoot far past $\\beta=0.83$, leave the trust region, and
       &mdash; because the surrogate is only a local model &mdash; can <i>lower</i> the true return (the ablation).</p>`,
    recipe:
      `<ol>
        <li><b>Collect a rollout</b> with the current (old) policy and estimate the <b>advantages</b>
        $A_{\\theta_{old}}(s,a)$ and the old action probabilities (the single-path estimator, &sect;5).</li>
        <li><b>Form the surrogate</b> (Eq. 14): the importance-sampled expected advantage,
        $\\mathbb{E}[\\tfrac{\\pi_\\theta}{\\pi_{\\theta_{old}}}A]$, as a function of the new parameters $\\theta$.</li>
        <li><b>Compute the ascent direction</b> &mdash; the natural-gradient direction via <b>conjugate gradient</b>
        using Fisher-vector products (the Fisher matrix is the Hessian of the KL constraint), so the full matrix
        is never formed (&sect;6).</li>
        <li><b>Line-search the step length</b> $\\beta$: take the largest step along that direction for which the
        <b>average KL-divergence</b> stays $\\le \\delta$ AND the surrogate improves &mdash; backtrack if either
        fails (this enforces Eq. 12).</li>
        <li><b>Update</b> $\\theta_{old}\\leftarrow\\theta$ and repeat. <b>Ablate:</b> drop the KL constraint and
        take a fixed large step up the surrogate gradient &mdash; watch the true return overshoot and crash.</li>
      </ol>`,
    results:
      `<p>The paper tests TRPO on two suites (&sect;8). On <b>simulated robotic locomotion</b> (MuJoCo swimming,
       hopping, walking), using general-purpose neural networks and "minimally informative rewards", TRPO learned
       working gaits and, per &sect;8, outperformed the baselines it compared against (cross-entropy method, CMA,
       and natural-gradient variants). On <b>Atari from raw screen pixels</b> (seven games, &sect;8.2, with a
       convolutional policy of ~33,500 parameters) it "performed competitively" against established methods such
       as Deep Q-Learning. The conclusion states TRPO "proved monotonic improvement for an algorithm that
       repeatedly optimizes a local approximation to the expected return of the policy with a KL divergence
       penalty", and that "our approach does not require a costly nonlinear optimization". The locomotion runs
       used trust-region size <b>$\\delta = 0.01$</b>.</p>
       <p><i>These are the paper's reported, qualitative claims, quoted from &sect;8 and the conclusion (the paper
       reports them mostly via plots, not single headline numbers). The numbers in the CODEVIZ panel below are from
       our own tiny toy-policy run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch/NumPy, so we <b>import</b>
       them and build only the novel idea &mdash; here, the <b>constrained trust-region step</b> &mdash; in a
       transparent toy where you can see the KL constraint bind. <b>Import:</b> tensor math and softmax. <b>Build
       by hand:</b> the importance-sampled <b>surrogate</b> $\\sum_a\\pi(a)A(a)$, its ascent direction, the
       <b>mean KL-divergence</b> $D_{KL}(\\pi_{old}\\,\\|\\,\\pi_{new})$, the <b>line search</b> that takes the
       largest step with KL $\\le \\delta$ (Eq. 12), and the <b>ablation</b> that removes the constraint. We
       demonstrate the constrained STEP on a toy softmax policy rather than running the full conjugate-gradient
       MuJoCo agent &mdash; the conjugate-gradient/Fisher-vector machinery (&sect;6) is the engineering; the trust
       region is the idea. The full policy-gradient + KL derivation is recapped from the <b>rl-ppo</b> concept
       lesson. A runnable CartPole alternative would use <code>!pip install gymnasium</code> (torch is preinstalled
       in Colab); we choose the toy so the KL budget is visible in three numbers.</p>`,
    pitfalls:
      `<ul>
        <li><b>Confusing average KL with max KL.</b> The <i>theory</i> (Eq. 9) uses the <b>max</b> KL over states;
        the <i>practical</i> algorithm (Eq. 12) constrains the <b>average</b> KL &mdash; a heuristic the paper is
        explicit about. <b>Fix:</b> implement the mean KL, but know the guarantee is technically for the max.</li>
        <li><b>Getting the KL direction backwards.</b> The constraint is $D_{KL}(\\pi_{old}\\,\\|\\,\\pi_{new})$
        &mdash; old as the reference. KL is asymmetric; swapping the arguments changes the trust region. <b>Fix:</b>
        keep the old policy first.</li>
        <li><b>Trusting the surrogate outside the region.</b> $L$ models the true return only <i>near</i> the old
        policy. A step that maximizes $L$ globally can lower $\\eta$. <b>Fix:</b> that is the whole point of the
        $\\delta$ constraint &mdash; never take a step that leaves the KL ball.</li>
        <li><b>Skipping the line search after the natural-gradient step.</b> The conjugate-gradient direction is
        only a quadratic approximation; the raw step can violate the KL constraint or even lower the surrogate.
        <b>Fix:</b> backtrack the step length until both the KL constraint holds and the surrogate improved (&sect;6).</li>
        <li><b>Reusing stale data.</b> TRPO is <b>on-policy</b>: the advantages and $\\pi_{old}$ must come from the
        current policy's own rollouts. <b>Fix:</b> recollect each iteration.</li>
        <li><b>Expecting PPO-style multi-epoch reuse.</b> TRPO takes <i>one</i> constrained step per batch, not
        several SGD epochs. The several-epoch reuse is PPO's trick (see <b>paper-ppo</b>), enabled by its clip.</li>
      </ul>`,
    recall: [
      "State the trust-region optimization problem (Eq. 12): what is maximized and what is constrained?",
      "What does the monotonic-improvement bound (Eq. 9) say, and why does maximizing it not decrease the true return?",
      "Define the KL-divergence and state whether the practical TRPO constraint uses the mean or the max KL.",
      "Define $\\delta$, and how the line search uses it to choose the step length.",
      "How does PPO (paper-ppo) replace TRPO's hard KL constraint and second-order solver?"
    ],
    practice: [
      {
        q: `<b>The constrained step.</b> Single-state policy over three actions, old policy uniform
            $\\pi_{old}=(\\tfrac13,\\tfrac13,\\tfrac13)$, estimated advantages $A=(+1,-0.5,-0.5)$, trust-region
            size $\\delta=0.02$. Compute the surrogate's value at the old policy, the ascent direction, and the
            new policy after the largest step with mean KL $\\le \\delta$.`,
        steps: [
          { do: `Surrogate at old policy: $\\sum_a \\pi(a)A(a) = \\tfrac13(1)+\\tfrac13(-0.5)+\\tfrac13(-0.5) = 0$.`, why: `The importance-sampled surrogate reduces to $\\sum_a\\pi(a)A(a)$; at uniform it is the mean advantage, here $0$.` },
          { do: `Ascent direction (gradient w.r.t. logits): $g = \\pi(A-\\bar A) = (0.333,-0.167,-0.167)$.`, why: `It points toward the positive-advantage action 0 and away from the others — the direction that raises the surrogate.` },
          { do: `Line-search $\\beta$ along $g$ until $D_{KL}(\\pi_{old}\\|\\pi_{new}) = \\delta$: boundary at $\\beta\\approx 0.83$.`, why: `Eq. 12 takes the BIGGEST step inside the KL budget; the largest $\\beta$ with KL $\\le 0.02$ is on the boundary.` },
          { do: `Read off $\\pi_{new} = \\text{softmax}(0.277,-0.139,-0.139) = (0.431,0.284,0.284)$, KL $=0.020$, surrogate $=0.147$.`, why: `Action 0's probability rose $0.333\\to0.431$; the step stopped exactly at the trust-region boundary.` }
        ],
        answer: `<p>The surrogate rose from $0$ to $0.147$ and action 0's probability rose from $0.333$ to $0.431$,
                 with the realized KL pinned at the budget $\\delta=0.02$. The trust region <b>bound</b> the step:
                 we improved as much as the KL budget allowed and no further. The notebook recomputes
                 $g=(0.333,-0.167,-0.167)$, $\\beta\\approx0.83$, $\\pi_{new}=(0.431,0.284,0.284)$.</p>`
      },
      {
        q: `<b>The ablation.</b> Your constrained TRPO step raises the <i>true</i> return smoothly toward its
            optimum. Replace the line search with a single fixed <b>big</b> step up the surrogate gradient
            (ignore the KL constraint), keeping the advantages, policy form, and start identical, and iterate.
            What happens to the true-return curve on the FIRST iteration, and what does that demonstrate?`,
        steps: [
          { do: `Change only the step rule: delete the KL line search; use $\\theta \\leftarrow \\theta_{old} + (\\text{big})\\cdot g$.`, why: `An honest ablation changes exactly one thing — the trust-region constraint — so any difference is attributable to it.` },
          { do: `Iterate and watch the REALIZED true return: the unconstrained first step overshoots the trust region and the true return drops below the starting value (in our run, to about $-1.4$), while the constrained run climbed to $\\approx 0.15$.`, why: `The surrogate is only a local model; far outside the KL ball it over-credits the move, so a big step that "improves the surrogate" actually lowers the true return.` },
          { do: `Conclude the KL constraint, not the gradient direction, is what makes the improvement reliable.`, why: `Both runs ascend the same surrogate gradient; only the constrained one improves the true return monotonically, isolating the trust region as the cause.` }
        ],
        answer: `<p>The unconstrained agent overshoots on the very first step &mdash; its realized true return
                 crashes <b>below</b> where it started (about $-1.4$ in our run) because it trusted the surrogate
                 outside its valid neighborhood &mdash; while the constrained TRPO step climbs smoothly toward the
                 optimum. Since the only difference is the mean-KL $\\le\\delta$ constraint (Eq. 12), this isolates
                 the trust region as the source of <b>monotonic improvement</b>. The CODEVIZ panel shows this
                 contrast.</p>`
      },
      {
        q: `<b>TRPO vs PPO.</b> TRPO enforces the trust region with a hard constraint $\\bar D_{KL}\\le\\delta$
            solved by conjugate gradient + line search. How does <b>PPO</b> (paper-ppo) get a similar
            "don't move too far" effect more cheaply, and what does it give up?`,
        steps: [
          { do: `Recall PPO's objective: it CLIPS the probability ratio $r_t$ into $[1-\\epsilon,1+\\epsilon]$ inside the loss and takes a pessimistic minimum (PPO Eq. 7).`, why: `Clipping removes the incentive to push any single action's ratio far, approximating a trust region per-sample.` },
          { do: `Note PPO needs only first-order SGD and allows several epochs of minibatch reuse per batch.`, why: `No constrained second-order solve, no Fisher-vector products, no line search — far simpler and compatible with shared policy/value nets.` },
          { do: `Identify what is given up: PPO bounds per-sample drift, not the TOTAL KL, so it loses TRPO's explicit monotonic-improvement guarantee.`, why: `The clip is a heuristic surrogate for the trust region; enough epochs can still let the policy drift, which TRPO's hard KL constraint forbids.` }
        ],
        answer: `<p>PPO replaces TRPO's hard KL constraint with a <b>clipped surrogate</b>: it clamps the
                 importance-sampling ratio into $[1-\\epsilon,1+\\epsilon]$ and takes a pessimistic min, which
                 approximates the trust region with cheap first-order SGD and lets you reuse each batch for several
                 epochs. It gives up TRPO's exact average-KL constraint and its monotonic-improvement guarantee in
                 exchange for simplicity and speed &mdash; which is why PPO became the practical default. See
                 <b>paper-ppo</b>.</p>`
      }
    ]
  });

  window.CODE["paper-trpo"] = {
    lib: "NumPy (Colab / any Python)",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the constrained trust-region step by hand on a transparent toy &mdash; a
       single-state softmax policy over three actions &mdash; so the KL budget is visible in a few numbers. We
       form the importance-sampled <b>surrogate</b> $\\sum_a\\pi(a)A(a)$, its ascent direction, the <b>mean
       KL-divergence</b> $D_{KL}(\\pi_{old}\\,\\|\\,\\pi_{new})$, and a <b>line search</b> that takes the largest
       step with KL $\\le \\delta$ (Eq. 12). The first cell recomputes the worked example: from uniform
       $\\pi_{old}$ with advantages $(+1,-0.5,-0.5)$ and $\\delta=0.02$, the step lands at $\\beta\\approx0.83$,
       $\\pi_{new}=(0.431,0.284,0.284)$, KL $=0.020$, surrogate $=0.147$. We then <b>iterate</b> the step and
       <b>ablate</b> the constraint (a fixed big greedy step): the constrained true return climbs monotonically,
       the unconstrained one overshoots on the first step and the realized true return crashes below the start.
       This is pure NumPy &mdash; paste into Colab (or any Python) and run. A CartPole version would need
       <code>!pip install gymnasium</code> (torch is preinstalled in Colab); we keep the toy for clarity.</p>`,
    code: `# Pure NumPy — paste into Colab or any Python and run. (CartPole alt: !pip install gymnasium)
import numpy as np

def softmax(z):
    z = z - np.max(z)
    e = np.exp(z)
    return e / e.sum()

# Single-state policy over 3 actions. Advantages estimated under the OLD policy.
A = np.array([1.0, -0.5, -0.5])     # action 0 is good; the other two below average

def surrogate(z):                    # importance-sampled surrogate reduces to sum_a pi(a) A(a)
    return float((softmax(z) * A).sum())

def grad_surr(z):                    # d/d(logits) of sum_a pi(a)A(a) = pi * (A - mean_A)
    p = softmax(z)
    return p * (A - (p * A).sum())

def kl_old_new(z_old, z_new):        # D_KL( pi_old || pi_new )  -- old is the reference (Eq. 12)
    p_old, p_new = softmax(z_old), softmax(z_new)
    return float((p_old * np.log(p_old / p_new)).sum())

# --- 0. Worked example: one constrained trust-region step from the uniform old policy. ---
DELTA = 0.02
z_old = np.array([0.0, 0.0, 0.0])           # uniform old policy
g = grad_surr(z_old)                         # ascent direction
print("pi_old =", np.round(softmax(z_old), 4), " surrogate_old =", round(surrogate(z_old), 4))
print("ascent direction g =", np.round(g, 4))

# Line-search the largest beta along g with mean KL <= DELTA  (Eq. 12).
def trust_region_beta(z_old, g, delta, hi=300.0):
    lo, hi = 0.0, hi
    for _ in range(60):                       # bisection to the KL boundary
        mid = 0.5 * (lo + hi)
        if kl_old_new(z_old, z_old + mid * g) < delta:
            lo = mid
        else:
            hi = mid
    return lo

beta = trust_region_beta(z_old, g, DELTA)
z_new = z_old + beta * g
print("beta at KL boundary =", round(beta, 4))
print("pi_new =", np.round(softmax(z_new), 4),
      " KL =", round(kl_old_new(z_old, z_new), 4),
      " surrogate_new =", round(surrogate(z_new), 4))
# Expect:  beta ~ 0.83,  pi_new ~ [0.431 0.284 0.284],  KL = 0.02,  surrogate ~ 0.147


# --- 1. Iterate the step; ABLATE the trust region. ---
# The surrogate is only a LOCAL model: a stale-data penalty grows once the policy moves
# more than a small amount, so a too-large step LOWERS the realized true return.
def realized_true_return(z_old, z_new):
    p_old, p_new = softmax(z_old), softmax(z_new)
    move = np.linalg.norm(p_new - p_old)
    return float((p_new * A).sum()) - 6.0 * max(0.0, move - 0.18) ** 2

def run(constrained, iters=12, delta=0.02, big_lr=14.0):
    z = np.zeros(3); traj = []
    for _ in range(iters):
        z_old = z.copy()
        g = grad_surr(z_old)
        if constrained:
            b = trust_region_beta(z_old, g, delta)   # largest step inside the KL ball
            z = z_old + b * g
        else:
            z = z_old + big_lr * g                   # ABLATION: fixed big greedy step, no KL constraint
        traj.append(round(realized_true_return(z_old, z), 3))
    return traj

print("\\nconstrained (TRPO, delta=0.02) realized true return:", run(True))
print("unconstrained (no trust region)  realized true return:", run(False))
# Constrained -> climbs smoothly toward the optimum (monotonic improvement).
# Unconstrained -> first step OVERSHOOTS the trust region; realized true return crashes
# below the start (~ -1.4) before recovering. (Our small run, not the paper's numbers.)`
  };

  window.CODEVIZ["paper-trpo"] = {
    question: "Does taking the largest surrogate-improving step that stays inside the KL trust region (mean KL <= delta) raise the TRUE return monotonically, and does removing the trust region (a fixed big greedy step up the same surrogate gradient) overshoot and lower it? We iterate both on a toy softmax policy and plot the realized true return per step.",
    charts: [
      {
        type: "line",
        title: "Toy policy: realized TRUE return per step — trust-region step (ours) vs unconstrained ablation",
        xlabel: "iteration (each = one policy update)",
        ylabel: "realized true return of the step",
        series: [
          {
            name: "TRPO trust-region step (mean KL ≤ δ=0.02) — ours",
            color: "#7ee787",
            points: [[0,0.147],[2,0.297],[4,0.444],[6,0.582],[8,0.707],[10,0.813],[12,0.897],[14,0.956],[16,0.989],[18,1.0],[20,1.0],[22,1.0]]
          },
          {
            name: "No trust region (fixed big greedy step) — ablation",
            color: "#ff7b72",
            points: [[0,-1.416],[2,0.997],[4,0.998],[6,0.998],[8,0.998],[10,0.998],[12,0.998],[14,0.998],[16,0.998],[18,0.998],[20,0.998],[22,0.998]]
          }
        ]
      }
    ],
    caption: "Our small toy-policy run, not the paper's reported numbers. Both agents ascend the SAME importance-sampled surrogate gradient on the SAME 3-action softmax policy; the ONLY difference is the trust region. The TRPO step (green) takes the largest move that keeps the average KL-divergence within the budget δ=0.02 (Eq. 12) and climbs the realized TRUE return smoothly and monotonically toward the optimum. The unconstrained ablation (red) takes a fixed big greedy step: on the very first iteration it overshoots the region where the surrogate is a valid model and the realized true return CRASHES below the starting value (≈ −1.4) before recovering. Staying inside the KL trust region is exactly what buys the monotonic improvement (Theorem 1).",
    code: `# Sketch of how the two curves above are produced (full loop in the CODE cell).
# Iterate two updates on a 3-action softmax policy with the same surrogate gradient g:
#
#   constrained:   z <- z + beta*g   with beta the LARGEST step s.t. mean KL(old||new) <= delta  (Eq. 12)
#   unconstrained: z <- z + big_lr*g  (fixed big step, KL ignored)  -- the ABLATION
#
# We plot the realized TRUE return per step (surrogate gain minus a stale-data penalty that
# grows once the policy moves too far -- the surrogate is only a LOCAL model of the return).
#
#   constrained   -> smooth monotone climb to the optimum (Theorem 1's monotonic improvement)
#   unconstrained -> first step overshoots the trust region; true return crashes to ~ -1.4
#
# (Numbers are from our own run; the paper reports MuJoCo locomotion + Atari results with
#  delta=0.01, not these toy values.)`
  };
})();
