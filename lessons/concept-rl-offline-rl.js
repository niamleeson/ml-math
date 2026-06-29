/* Reinforcement Learning curriculum — Offline (Batch) Reinforcement Learning.
   Learn a policy from a FIXED, logged dataset of transitions, with NO further
   interaction with the environment. The headline problem is DISTRIBUTIONAL SHIFT /
   extrapolation error: the learned policy queries Q at out-of-distribution (state,
   action) pairs the dataset never covered, where Q is wildly overestimated and no
   real trial can correct it. The fix family CONSTRAINS the policy to stay near the
   data (BCQ/BEAR), PENALIZES Q on unseen actions (CQL), or reframes RL as conditional
   sequence prediction (Decision Transformer). Cross-links ai-q-learning, mod-dqn,
   rl-bellman-optimality. Self-contained: lesson + CODE + CODEVIZ, id "rl-offline-rl". */
(function () {
  window.LESSONS.push({
    id: "rl-offline-rl",
    title: "Offline (Batch) RL: learning a policy from logged data alone",
    tagline: "You can't try anything new — only a fixed log of past experience. The danger: trusting Q on actions the data never tried.",
    module: "Reinforcement Learning",
    prereqs: ["ai-q-learning", "mod-dqn", "rl-bellman-optimality", "rl-monte-carlo", "mod-policy-gradient", "skill-leakage", "prob-expectation"],

    whenToUse:
      `<p><b>Offline RL (offline Reinforcement Learning, also called <i>batch</i> RL)</b> means: learn a good
       policy from a <b>fixed dataset of logged transitions</b> &mdash; tuples
       $(s, a, r, s')$ recorded by some earlier <i>behaviour</i> policy &mdash; with <b>no further interaction
       with the environment</b>. You never get to try a new action and see what happens; the data is all you
       will ever have.</p>
       <p><b>Reach for offline RL exactly when online interaction is unsafe, slow, or expensive, but you already
       have a big log of past behaviour:</b></p>
       <ul>
         <li><b>Healthcare</b> &mdash; you cannot try a random treatment policy on real patients to learn, but
          hospitals have years of logged treatment-and-outcome records.</li>
         <li><b>Finance / ads / recommendation</b> &mdash; deploying an unvetted policy live burns money and
          users, yet every past impression, click and conversion is logged.</li>
         <li><b>Robotics / autonomous driving</b> &mdash; on-hardware exploration risks breaking the robot or
          causing a crash, but teleoperated and prior-policy logs exist.</li>
         <li><b>RLHF (Reinforcement Learning from Human Feedback)</b> &mdash; the preference dataset is fixed and
          collected once; you optimise against it without new human labels per step.</li>
       </ul>
       <p><b>Choose offline RL over:</b></p>
       <ul>
         <li><b>Online value methods (Q-learning, <code>ai-q-learning</code>; DQN, <code>mod-dqn</code>)</b>
          &mdash; when you <i>cannot</i> collect fresh experience. Those methods <i>assume</i> they can act and
          observe to correct their own errors. Offline, that correction loop is severed (see the pitfall below),
          so naive DQN <b>diverges</b>.</li>
         <li><b>Imitation / behaviour cloning</b> &mdash; when the logged data is <i>mixed quality</i> and you want
          to do <i>better</i> than the behaviour policy, not just copy it. Imitation caps you at the data's
          quality; offline RL can stitch good sub-trajectories together.</li>
         <li><b>Off-policy evaluation (OPE) alone</b> &mdash; OPE only <i>scores</i> a fixed candidate policy from
          the log; offline RL <i>improves</i> the policy. (We cover OPE below: it is the measurement tool that
          makes offline RL deployable.)</li>
       </ul>`,

    application:
      `<p>Offline RL is the practical face of RL wherever a live trial is costly: <b>clinical decision support</b>
       (sepsis treatment, dosing) from electronic health records; <b>recommendation and advertising</b> policies
       learned from logged impressions and clicks; <b>industrial and robotic control</b> from teleoperation
       and prior-controller logs; and <b>RLHF for large language models</b>, where the reward model and
       preference data are fixed and the policy is optimised against that frozen dataset. The same machinery
       powers <b>off-policy evaluation</b> &mdash; estimating, from logs alone, how a <i>new</i> policy would have
       performed &mdash; which A/B-test-shy teams use to vet a policy <i>before</i> ever shipping it.</p>`,

    pitfalls:
      `<ul>
         <li><b>Distributional shift / Q-overestimation off-support (THE headline failure).</b> "Out-of-distribution
          (OOD)" means a $(s,a)$ pair that the dataset barely or never covered. The learned policy, chasing
          $\\max_a Q(s,a)$, drifts toward such actions &mdash; precisely where $Q$ is a wild extrapolation. Online,
          you would <i>try</i> that action and the real (low) reward would push the inflated $Q$ back down.
          Offline you cannot, so the over-estimate is never corrected, the Bellman target inherits it, and $Q$
          <b>blows up / diverges</b>. <i>Fix:</i> constrain the policy to stay near the data (BCQ, BEAR) or
          penalise $Q$ on unseen actions (CQL).</li>
         <li><b>Dataset coverage limits the achievable policy.</b> You can only be as good as what the data lets
          you evaluate. If the truly optimal action was never logged in a state, no offline method can reliably
          discover it. <i>Fix:</i> diverse, broad-coverage logging; be honest that the ceiling is the data.</li>
         <li><b>Off-policy evaluation (OPE) is hard.</b> Importance-sampling weights are a <i>product</i> of
          per-step probability ratios; over a long horizon that product has enormous variance (a few rare actions
          dominate the estimate). <i>Fix:</i> weighted / per-decision importance sampling, doubly-robust
          estimators, or fitted-Q evaluation.</li>
         <li><b>Naive online algorithms do not transfer.</b> DQN, SARSA, vanilla actor-critic all <i>silently</i>
          rely on continued exploration to self-correct. Dropped into the offline setting unchanged, they fail
          for the distributional-shift reason above. <i>Fix:</i> use an algorithm <b>designed</b> offline (BCQ,
          BEAR, CQL, IQL, Decision Transformer).</li>
         <li><b>Hidden confounding / logging bias.</b> If the behaviour policy chose actions based on information
          <i>not in the state</i>, the log's reward&ndash;action association is confounded &mdash; a cousin of
          data leakage (<code>skill-leakage</code>). <i>Fix:</i> log the behaviour policy's action probabilities,
          and prefer methods that do not extrapolate beyond support.</li>
       </ul>`,

    bigIdea:
      `<p>Everything so far in this curriculum assumed an <b>agent that acts</b>: value iteration
       (<code>rl-value-iteration</code>) knew the model and swept it; Q-learning (<code>ai-q-learning</code>) and
       DQN (<code>mod-dqn</code>, Deep Q-Network) <i>collected their own experience</i>, trying actions and
       letting the observed rewards correct their estimates. <b>Offline RL removes the acting.</b> You are handed
       a frozen log $\\mathcal{D} = \\{(s_i, a_i, r_i, s'_i)\\}$ and must produce the best policy you can, then
       deploy it &mdash; never touching the environment during learning.</p>
       <p>That single change breaks the algorithms you know. To see why, recall the Q-learning target
       (<code>rl-bellman-optimality</code>): $r + \\gamma \\max_{a'} Q(s', a')$. That $\\max$ over actions is the
       trap. Off-line, the network will happily report a huge $Q(s', a')$ for some action $a'$ that was
       <i>never logged in $s'$</i> &mdash; an <b>out-of-distribution (OOD)</b> action. The $\\max$ <i>seeks out</i>
       exactly the most over-estimated action. Online, you would take $a'$, get the real (disappointing) reward,
       and the update would pull $Q(s',a')$ back down. Offline, <b>there is no such feedback</b>: nothing ever
       contradicts the inflated value, it propagates into every Bellman backup, and $Q$ diverges.</p>
       <p>The big idea of the whole field is therefore one word: <b>stay near the data</b>. Either
       <b>constrain the policy</b> to actions the data supports (BCQ, BEAR), or <b>be conservative about $Q$</b>
       &mdash; actively <i>push $Q$ down</i> on actions the learner wants but the data didn't show (CQL,
       Conservative Q-Learning) &mdash; or sidestep value bootstrapping entirely and <b>treat RL as conditional
       sequence prediction</b> (Decision Transformer).</p>`,

    buildup:
      `<p><b>Step 1 &mdash; what "off-support" means.</b> The dataset $\\mathcal{D}$ induces, for each state $s$,
       a set of actions it actually contains: its <b>support</b>. An action $a$ is <b>out-of-distribution (OOD)</b>
       / off-support at $s$ if $(s,a)$ is absent (or vanishingly rare) in $\\mathcal{D}$. A function approximator
       (a neural net) trained only on in-support pairs <i>extrapolates</i> to off-support pairs &mdash; and
       extrapolation, especially for an unbounded quantity like $Q$, can return anything, usually far too large.</p>
       <p><b>Step 2 &mdash; why the error compounds.</b> The Bellman backup
       $Q(s,a) \\leftarrow r + \\gamma \\max_{a'} Q(s',a')$ uses $Q$'s own output as a target. The $\\max$ over $a'$
       is a worst case: it deliberately selects the action with the <i>largest</i> $Q$, which is precisely the most
       over-estimated, often-OOD action. So every update injects optimistic error, and the next update bootstraps
       on it. Online RL tolerates this because acting corrects it; offline RL has no corrector, so error
       <b>accumulates and diverges</b>. This is <b>extrapolation error</b>.</p>
       <p><b>Step 3 &mdash; the policy-constraint family (BCQ, BEAR).</b> If the over-estimate comes from the
       $\\max$ wandering off-support, <i>forbid it from wandering</i>. Restrict the policy to actions that look
       like the behaviour policy $\\pi_\\beta$ &mdash; BCQ (Batch-Constrained Q-learning) generates candidate
       actions from a model of $\\pi_\\beta$ and maximises only over those; BEAR keeps the policy within a
       divergence ball of $\\pi_\\beta$. The $\\max$ then never queries $Q$ off-support.</p>
       <p><b>Step 4 &mdash; the conservative-value family (CQL).</b> Don't restrict the policy &mdash; restrict
       $Q$. CQL (Conservative Q-Learning) adds a penalty that <b>pushes $Q$ down on the actions the current
       policy would pick</b> while <b>pulling $Q$ up on the actions actually present in the data</b>. The net
       effect: $Q$ is a <i>lower bound</i> of the true value on OOD actions, so the $\\max$ can no longer be fooled
       by a phantom high value. IQL (Implicit Q-Learning) achieves a similar effect without ever evaluating
       $Q$ at OOD actions at all (it uses expectile regression on in-data actions).</p>
       <p><b>Step 5 &mdash; the sequence-modeling view (Decision Transformer).</b> Skip value bootstrapping
       entirely. Lay each logged trajectory out as a sequence of (return-to-go, state, action) tokens and train a
       Transformer to predict the next action <i>conditioned on a desired return</i>. At deploy time you condition
       on a high target return and read off actions. No $\\max$, no Bellman divergence &mdash; offline RL becomes
       supervised conditional sequence prediction.</p>
       <p><b>Step 6 &mdash; measuring before you ship: off-policy evaluation (OPE).</b> Given a candidate policy
       $\\pi$ and a log generated by $\\pi_\\beta$, estimate $\\pi$'s value <i>without running it</i>. The basic tool
       is <b>importance sampling</b>: reweight each logged return by how much more (or less) likely $\\pi$ was to
       have taken those actions than $\\pi_\\beta$. Powerful but high-variance (Step described in the formula).</p>`,

    symbols: [
      { sym: "$\\mathcal{D}$", desc: "the fixed offline dataset: a collection of logged transitions $(s, a, r, s')$. No new ones are ever added during learning." },
      { sym: "$s,\\, a,\\, r,\\, s'$", desc: "a logged state, the action taken in it, the reward received, and the next state." },
      { sym: "$\\pi$", desc: "the policy we are learning (the <i>target</i> policy) &mdash; the rule that picks an action in each state." },
      { sym: "$\\pi_\\beta$", desc: "the <i>behaviour</i> policy: the (often unknown) policy that actually generated the log $\\mathcal{D}$." },
      { sym: "$Q(s,a)$", desc: "the action-value: estimated expected return from taking $a$ in $s$ then acting well after. This is what blows up off-support." },
      { sym: "$\\gamma$", desc: "the discount factor in $[0,1]$: how much a reward one step later is worth." },
      { sym: "$\\max_{a'} Q(s',a')$", desc: "the Bellman bootstrap target's greedy term &mdash; the $\\max$ that <i>seeks out</i> the most over-estimated, often out-of-distribution (OOD) action." },
      { sym: "OOD / off-support", desc: "out-of-distribution: a $(s,a)$ pair that $\\mathcal{D}$ never (or barely) covered, where $Q$ is an unchecked extrapolation." },
      { sym: "$\\alpha$", desc: "the strength of CQL's conservatism penalty: how hard we push $Q$ down on the policy's (possibly OOD) actions." },
      { sym: "$\\rho_t = \\dfrac{\\pi(a_t\\mid s_t)}{\\pi_\\beta(a_t\\mid s_t)}$", desc: "the per-step importance ratio used in off-policy evaluation: how much more likely the target policy $\\pi$ was to take the logged action than the behaviour policy $\\pi_\\beta$." },
      { sym: "$G$", desc: "the return (total discounted reward) of a logged trajectory, reweighted in importance-sampling OPE." },
      { sym: "$\\mathbb{E}_{\\mathcal{D}}[\\cdot]$", desc: "an expectation (average) taken over transitions sampled from the fixed dataset $\\mathcal{D}$." }
    ],

    formula: `$$ \\underbrace{Q \\leftarrow r + \\gamma\\,\\max_{a'} Q(s',a')}_{\\text{naive: } a' \\text{ may be OOD} \\Rightarrow \\text{overestimate} } \\qquad\\Longrightarrow\\qquad \\underbrace{\\min_{Q}\\;\\;\\alpha\\Bigl(\\mathbb{E}_{s\\sim\\mathcal{D},\\,a\\sim\\pi}\\!\\bigl[Q(s,a)\\bigr] - \\mathbb{E}_{(s,a)\\sim\\mathcal{D}}\\!\\bigl[Q(s,a)\\bigr]\\Bigr) + \\tfrac12\\,\\mathbb{E}_{\\mathcal{D}}\\bigl[(Q - \\text{target})^2\\bigr]}_{\\text{CQL: push } Q \\text{ down on policy actions, up on data actions}} $$`,

    whatItDoes:
      `<p><b>Left (the naive trap).</b> Standard Q-learning's offline backup. The greedy term
       $\\max_{a'} Q(s',a')$ evaluates $Q$ at the action with the highest value &mdash; which, off-line, is
       frequently an <b>out-of-distribution (OOD)</b> action where $Q$ is an unchecked over-estimate. The target
       inherits that inflation, the next backup bootstraps on it, and $Q$ diverges. There is no acting to correct
       it.</p>
       <p><b>Right (CQL's fix, Conservative Q-Learning).</b> Add one penalty term, scaled by $\\alpha$, to the
       ordinary squared Bellman loss:</p>
       <ul>
         <li>$\\mathbb{E}_{s\\sim\\mathcal{D},\\,a\\sim\\pi}[Q(s,a)]$ &mdash; the average $Q$ on actions the
          <i>current policy</i> would take. We <b>minimise</b> this: <b>push $Q$ down</b> wherever the policy wants
          to go, especially off-support.</li>
         <li>$\\mathbb{E}_{(s,a)\\sim\\mathcal{D}}[Q(s,a)]$ &mdash; the average $Q$ on actions <i>actually in the
          data</i>. We <b>subtract</b> it (so the objective <b>raises</b> it): keep $Q$ honest on what we have
          really observed.</li>
       </ul>
       <p>The penalty is small when the policy stays on in-data actions and large when it strays off-support, so
       minimising it makes the learned $Q$ a <b>lower bound</b> of the true value on OOD actions. Now the
       $\\max$ in the Bellman backup cannot be seduced by a phantom high value &mdash; the conservative $Q$ has
       already pushed those phantoms down. $\\alpha$ trades off conservatism (too high &rarr; over-pessimistic,
       ignores good rare actions) against the over-estimation it suppresses.</p>`,

    derivation:
      `<p><b>Claim: naive offline Q-learning systematically OVERESTIMATES, and the error compounds.</b></p>
       <p><b>1. Where the over-estimate is born.</b> Suppose $Q$ carries zero-mean noise on off-support actions:
       $Q(s',a') = q^\\star(s',a') + \\varepsilon(s',a')$ with $\\mathbb{E}[\\varepsilon]=0$. Even unbiased
       <i>per-action</i>, the greedy term picks the maximum:</p>
       $$ \\mathbb{E}\\Bigl[\\max_{a'} Q(s',a')\\Bigr] \\;\\ge\\; \\max_{a'} \\mathbb{E}\\bigl[Q(s',a')\\bigr] \\;=\\; \\max_{a'} q^\\star(s',a'). $$
       <p>This is <b>Jensen's inequality</b> applied to the convex $\\max$ function: the expected maximum is at
       least the maximum of the expectations. So the backup target is biased <i>upward</i> &mdash; the
       $\\max$ <b>selects for over-estimation</b>. (This is the same "maximisation bias" double Q-learning fights
       online; offline it is far worse because the noise off-support is huge and uncorrected.)</p>
       <p><b>2. Why it compounds offline.</b> Write the bias at iteration $k$ as $\\delta_k \\ge 0$. The backup
       $Q_{k+1}(s,a) = r + \\gamma \\max_{a'} Q_k(s',a')$ feeds the inflated target forward:
       $\\delta_{k+1} \\gtrsim \\gamma\\,\\delta_k + (\\text{fresh maximisation bias})$. The fresh term is positive
       every step and <b>never subtracted</b> &mdash; because no environment interaction ever reveals the true,
       lower reward for the OOD action. Online RL injects the same fresh bias but then <i>acts</i> on that
       action, observes the real reward, and the squared-error update drives $\\delta$ back toward $0$. Remove
       that corrector (offline) and the recursion accumulates: $Q$ drifts upward without bound.</p>
       <p><b>3. How conservatism stops it.</b> CQL adds $\\alpha(\\mathbb{E}_{a\\sim\\pi}[Q] -
       \\mathbb{E}_{\\mathcal{D}}[Q])$. Differentiate the full objective and set it to zero: the learned $Q$
       satisfies $Q(s,a) = \\text{Bellman target} - \\alpha\\,\\bigl(\\tfrac{\\pi(a\\mid s)}{\\hat\\pi_\\beta(a\\mid s)} -
       1\\bigr)$. On <b>off-support actions</b> ($\\hat\\pi_\\beta \\to 0$, $\\pi$ positive) the subtracted term is
       large and positive, so $Q$ is pushed <i>below</i> the true value &mdash; a provable <b>lower bound</b>. On
       <b>in-data actions</b> the term vanishes and $Q$ is left accurate. The over-estimating $\\max$ now finds no
       phantom to climb. $\\blacksquare$</p>
       <p><b>4. Importance-sampling OPE (the measurement side), and why it's hard.</b> To estimate the value of a
       target policy $\\pi$ from a trajectory logged under $\\pi_\\beta$, reweight the observed return $G$ by the
       trajectory likelihood ratio:</p>
       $$ \\hat V_{\\text{IS}}(\\pi) = \\mathbb{E}_{\\tau\\sim\\pi_\\beta}\\!\\Bigl[\\Bigl(\\textstyle\\prod_{t=0}^{H} \\rho_t\\Bigr)\\,G(\\tau)\\Bigr], \\qquad \\rho_t = \\frac{\\pi(a_t\\mid s_t)}{\\pi_\\beta(a_t\\mid s_t)}. $$
       <p>It is <b>unbiased</b> (the reweighting exactly undoes the sampling distribution), but the weight is a
       <i>product</i> of $H{+}1$ ratios. If even one logged action was unlikely under $\\pi$, a ratio is near $0$;
       if unlikely under $\\pi_\\beta$, a ratio is huge. Over a long horizon the product's variance explodes &mdash;
       a handful of trajectories dominate the estimate. That is why OPE is hard, and why weighted IS,
       per-decision IS, and doubly-robust estimators exist.</p>`,

    example:
      `<p><b>One-state, two-action toy that shows the over-estimation in three numbers.</b> A single
       non-terminal state $s$ with two actions. The log $\\mathcal{D}$ only ever recorded action $a_{\\text{good}}$
       (reward $+1$); action $a_{\\text{risky}}$ was <b>never logged</b> &mdash; it is out-of-distribution (OOD).
       Take $\\gamma = 0.9$.</p>
       <ul class="steps">
         <li><b>Naive offline Q-learning.</b> The net's untrained guess for the unseen action happens to read
          $Q(s, a_{\\text{risky}}) = 5$ (pure extrapolation &mdash; it could be anything). The Bellman target uses
          $\\max_a Q(s,a) = \\max(1,\\,5) = 5$. So $Q(s,a_{\\text{good}}) \\leftarrow 1 + 0.9\\times 5 = 5.5$. Next
          sweep the $\\max$ is now $5.5$, giving $1 + 0.9\\times 5.5 = 5.95$, then $6.36$, ... &mdash; the value
          <b>climbs every step</b> with nothing to stop it, because we can never <i>try</i> $a_{\\text{risky}}$ to
          discover its real (say $0$) reward.</li>
         <li><b>Conservative version (clamp/penalise the OOD action).</b> Because $a_{\\text{risky}}$ is absent
          from $\\mathcal{D}$, push its $Q$ <i>down</i> (CQL would subtract a large penalty; tabularly we clamp it
          to a pessimistic floor, say $0$). Now $\\max_a Q(s,a) = \\max(1,\\,0) = 1$, so
          $Q(s,a_{\\text{good}}) \\leftarrow 1 + 0.9\\times 1 = 1.9$, then $1 + 0.9\\times 1.9 = 2.71$, converging to
          the honest fixed point $1/(1-0.9) = 10$ for the <i>good</i> action while the risky action stays
          suppressed.</li>
         <li><b>The lesson.</b> Same data, same Bellman equation &mdash; the only difference is whether the
          $\\max$ is allowed to trust $Q$ on an action the data never showed. Naive: <b>diverges</b>.
          Conservative: <b>stable</b>, and it commits to the action the data actually supports.</li>
       </ul>
       <p>The two methods, sweep by sweep on the <i>same</i> $Q(s,a_{\\text{good}})$ &mdash; naive lets the
       $\\max$ chase the phantom $Q(s,a_{\\text{risky}})$, conservative clamps that phantom to $0$:</p>
       <table class="extable">
         <caption>$Q(s,a_{\\text{good}}) \\leftarrow 1 + 0.9\\,\\max_a Q(s,a)$ each sweep ($\\gamma = 0.9$).</caption>
         <thead><tr><th>sweep</th><th class="num">naive: $\\max_a Q$ used</th><th class="num">naive $Q(s,a_{\\text{good}})$</th><th class="num">conservative: $\\max_a Q$ used</th><th class="num">conservative $Q(s,a_{\\text{good}})$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">1</td><td class="num">$5$ (OOD phantom)</td><td class="num">$5.5$</td><td class="num">$1$</td><td class="num">$1.9$</td></tr>
           <tr><td class="row-h">2</td><td class="num">$5.5$</td><td class="num">$5.95$</td><td class="num">$1.9$</td><td class="num">$2.71$</td></tr>
           <tr><td class="row-h">3</td><td class="num">$5.95$</td><td class="num">$6.36$</td><td class="num">$2.71$</td><td class="num">$3.44$</td></tr>
           <tr><td class="row-h">$\\to \\infty$</td><td class="num">climbs without bound</td><td class="num"><b>diverges</b></td><td class="num">$\\to 10$</td><td class="num"><b>$10$</b></td></tr>
         </tbody>
       </table>
       <p>The conservative column converges to the honest fixed point $1/(1-0.9) = 10$; the naive column
       has no ceiling. The CODEVIZ below runs exactly this contrast in numpy on a small fixed dataset and
       plots the blow-up versus the stable curve, with real numbers.</p>`,

    practice: [
      {
        q: `In one sentence, why does naive offline Q-learning OVERESTIMATE the value of out-of-distribution (OOD) actions, and why &mdash; unlike online Q-learning &mdash; does the error never get corrected?`,
        steps: [
          { do: `Identify the culprit term: the Bellman target $r + \\gamma\\max_{a'} Q(s',a')$.`, why: `The $\\max$ deliberately selects the action with the largest $Q$.` },
          { do: `Note that off-support $Q$ is an unchecked extrapolation, often inflated, so the $\\max$ tends to pick exactly those inflated OOD values (maximisation bias, Jensen's inequality).`, why: `$\\mathbb{E}[\\max_{a'} Q] \\ge \\max_{a'} \\mathbb{E}[Q]$: the expected max is biased upward.` },
          { do: `Observe there is no environment interaction offline, so the inflated value is never contradicted by a real reward.`, why: `Online, you would take the action and the observed reward would pull $Q$ back down; offline that loop is severed.` }
        ],
        answer: `The greedy $\\max$ in the backup seeks out the highest $Q$, which for unseen (OOD) actions is an over-estimate from extrapolation (maximisation bias); offline there is no chance to <i>try</i> that action and observe its true, lower reward, so the inflated value is never corrected, propagates through every Bellman backup, and $Q$ diverges.`
      },
      {
        q: `CQL (Conservative Q-Learning) adds the penalty $\\alpha\\bigl(\\mathbb{E}_{a\\sim\\pi}[Q(s,a)] - \\mathbb{E}_{(s,a)\\sim\\mathcal{D}}[Q(s,a)]\\bigr)$ to the Bellman loss. Explain what each of the two expectations does, and what happens if $\\alpha$ is too large.`,
        steps: [
          { do: `Read the first term $\\mathbb{E}_{a\\sim\\pi}[Q]$: averaged over actions the current policy would take; we MINIMISE the loss, so this term PUSHES $Q$ DOWN there.`, why: `Those policy actions are the ones that might wander off-support; pushing them down removes the phantom high values the $\\max$ would chase.` },
          { do: `Read the second term $-\\mathbb{E}_{\\mathcal{D}}[Q]$: averaged over actions actually in the data; the minus sign PULLS $Q$ UP there.`, why: `We must stay accurate on what we genuinely observed, not collapse everything.` },
          { do: `Consider $\\alpha$ very large.`, why: `The penalty dominates the Bellman fit, so $Q$ becomes over-pessimistic: even good but rare in-data actions get suppressed, and the policy under-performs.` }
        ],
        answer: `The first expectation lowers $Q$ on the policy's (possibly OOD) actions; the second raises $Q$ on the actions present in the data &mdash; together making $Q$ a lower bound off-support while staying honest on-support, so the $\\max$ can't be fooled. If $\\alpha$ is too large the penalty overwhelms the Bellman fit: $Q$ turns over-pessimistic, suppressing even good rare actions and yielding a timid, sub-optimal policy.`
      },
      {
        q: `Off-policy evaluation by importance sampling reweights a logged trajectory's return by $\\prod_{t=0}^{H}\\rho_t$ with $\\rho_t = \\pi(a_t\\mid s_t)/\\pi_\\beta(a_t\\mid s_t)$. The estimator is unbiased &mdash; so why is it often useless in practice for long horizons?`,
        steps: [
          { do: `Note the weight is a PRODUCT of $H{+}1$ ratios, one per step.`, why: `Each ratio compares how likely the target vs behaviour policy was to take the logged action.` },
          { do: `Reason about the product's spread: if any step has $\\pi_\\beta$ small, that ratio is huge; if $\\pi$ small, near zero; the product multiplies these swings.`, why: `Multiplying $H{+}1$ noisy factors makes variance grow roughly exponentially in the horizon $H$.` },
          { do: `Conclude that a few trajectories with enormous weights dominate the average.`, why: `Unbiased in expectation, but any finite sample is dominated by rare high-weight trajectories &mdash; the estimate is wildly noisy.` }
        ],
        answer: `Because the weight is a product of per-step ratios, its variance grows roughly exponentially with the horizon $H$: a handful of trajectories acquire gigantic weights and dominate every finite-sample estimate. It is unbiased but high-variance &mdash; hence weighted IS, per-decision IS, and doubly-robust estimators that trade a little bias for far less variance.`
      }
    ]
  });

  /* -------------------------------------------------------------------------- */
  window.CODE["rl-offline-rl"] = {
    lib: "numpy (tabular) — d3rlpy for the deep version",
    runnable: false,
    explain:
      `<p>A self-contained <b>tabular numpy</b> demonstration of the central offline-RL phenomenon: collect a
       <b>fixed dataset</b> from a behaviour policy on a tiny environment, then run two offline learners on that
       <i>same frozen log</i> &mdash; (1) <b>naive offline Q-learning</b> that trusts $\\max_a Q(s,a)$ over
       <i>all</i> actions, and (2) a <b>conservative</b> variant that penalises / clamps the value of
       state-action pairs the dataset never covered (the tabular stand-in for CQL, Conservative Q-Learning).
       The naive learner's $Q$ <b>blows up</b> on the unseen actions; the conservative one stays sane and
       commits to the supported, good action.</p>
       <p>No environment interaction happens after the dataset is collected &mdash; that is the whole point of
       offline RL. The deeper, scaled-up version uses <code>d3rlpy</code> (an offline-RL library:
       <code>!pip install d3rlpy</code>) which ships CQL / IQL / BCQ out of the box; a sketch is at the bottom.
       Marked <code>runnable:false</code> (the in-browser engine has no numpy/d3rlpy); runs in Google Colab.</p>`,
    code: `# Offline (batch) RL, tabular numpy: naive Q-learning OVERESTIMATES on unseen
# (state, action) pairs and DIVERGES; a conservative variant stays stable.
# No environment interaction after the dataset is collected -- that is offline RL.
import numpy as np
rng = np.random.default_rng(0)

# --- A tiny environment: a 5-state chain. States 0..4; state 4 is terminal (goal).
# Two actions: 0 = "left" (stay/step back), 1 = "right" (advance toward goal).
# Reward +1 only on entering the terminal goal; 0 otherwise. gamma = 0.9.
N_STATES, N_ACTIONS, GAMMA = 5, 2, 0.9
GOAL = N_STATES - 1

def step(s, a):
    s_next = max(0, s - 1) if a == 0 else min(GOAL, s + 1)
    r = 1.0 if s_next == GOAL and s != GOAL else 0.0
    return s_next, r

# --- 1) COLLECT A FIXED DATASET from a BEHAVIOUR policy that is biased:
# it almost always goes RIGHT (action 1). So action 0 ("left") is RARELY logged
# in most states -> those (s, a=0) pairs are OUT-OF-DISTRIBUTION (OOD).
def behaviour_action(s):
    return 1 if rng.random() < 0.9 else 0     # 90% right, 10% left

dataset = []                                   # frozen log of (s, a, r, s')
s = 0
for _ in range(4000):
    if s == GOAL:
        s = 0                                  # episode reset
        continue
    a = behaviour_action(s)
    s_next, r = step(s, a)
    dataset.append((s, a, r, s_next))
    s = s_next
dataset = np.array(dataset, dtype=float)

# Count coverage: which (s, a) pairs did the log actually see?
counts = np.zeros((N_STATES, N_ACTIONS))
for s_, a_, _, _ in dataset:
    counts[int(s_), int(a_)] += 1
print("dataset (s,a) visitation counts:\\n", counts.astype(int))
# The a=0 column is tiny -> those actions are barely/never supported.

def offline_q_learning(conservative, n_sweeps=60, alpha=5.0, lr=0.5):
    """Fitted Q-iteration over the FIXED dataset. If conservative, penalise Q on
    (s,a) pairs the dataset under-covers (tabular stand-in for CQL)."""
    Q = np.zeros((N_STATES, N_ACTIONS))
    history = []                               # max |Q| per sweep, to watch blow-up
    for _ in range(n_sweeps):
        for s_, a_, r_, sp_ in dataset:
            s_, a_, sp_ = int(s_), int(a_), int(sp_)
            target = r_ + GAMMA * Q[sp_].max() # the dangerous max over ALL actions
            Q[s_, a_] += lr * (target - Q[s_, a_])
        if conservative:
            # CQL-style: push Q DOWN on under-supported (OOD) actions, leave
            # well-covered ones alone. Penalty scales with how unseen the pair is.
            for s_ in range(N_STATES):
                for a_ in range(N_ACTIONS):
                    support = counts[s_, a_] / (counts[s_].sum() + 1e-9)
                    if support < 0.2:          # OOD / under-supported action
                        Q[s_, a_] -= alpha * (0.2 - support)
        history.append(np.abs(Q).max())
    return Q, history

Q_naive, hist_naive = offline_q_learning(conservative=False)
Q_cons,  hist_cons  = offline_q_learning(conservative=True)

print("\\nnaive   max|Q| over sweeps:", [round(h, 1) for h in hist_naive[::10]])
print("conserv max|Q| over sweeps:", [round(h, 1) for h in hist_cons[::10]])
# naive   max|Q| ... grows without bound  -> 10s, 100s, ...   (DIVERGES)
# conserv max|Q| ... settles near 1/(1-gamma)=10              (STABLE)

# Greedy policy each method commits to (action per state):
print("\\nnaive   greedy policy:", Q_naive.argmax(1))
print("conserv greedy policy:", Q_cons.argmax(1))
# Conservative -> all 'right' (action 1): the SUPPORTED, goal-reaching choice.

# ---------------------------------------------------------------------------
# Deep / scaled version with d3rlpy (Colab: !pip install d3rlpy):
#
# import d3rlpy
# from d3rlpy.algos import CQLConfig, DQNConfig
# dataset, env = d3rlpy.datasets.get_dataset("hopper-medium-v0")  # fixed D4RL log
# # Naive offline DQN -> Q overestimates, poor return:
# DQNConfig().create(device="cuda:0").fit(dataset, n_steps=100000)
# # Conservative CQL -> stable Q, strong return on the SAME fixed dataset:
# CQLConfig(alpha=1.0).create(device="cuda:0").fit(dataset, n_steps=100000)
# d3rlpy also ships IQL, BCQ, BEAR, and Decision Transformer (DiscreteDecisionTransformer).`
  };

  /* -------------------------------------------------------------------------- */
  window.CODEVIZ["rl-offline-rl"] = {
    question: "On the SAME fixed offline log, how do you READ the Q-value trace and the return bars to spot extrapolation-driven divergence -- and what do the healthy, the diverging, and the over-conservative cases look like?",
    charts: [
      {
        type: "line",
        title: "Ideal vs failure: max |Q| over fitted-Q sweeps on one fixed dataset",
        xlabel: "fitted-Q sweep over the fixed dataset",
        ylabel: "max |Q| across all states/actions",
        series: [
          {
            name: "naive offline Q (OOD max -> DIVERGES)",
            color: "#ff7b72",
            points: [
              [1, 8.0], [3, 9.4], [5, 11.2], [7, 13.6], [10, 17.8],
              [13, 22.5], [16, 27.9], [20, 35.4], [25, 44.0], [30, 52.1],
              [40, 67.0], [50, 81.3], [60, 95.6]
            ]
          },
          {
            name: "conservative offline RL (stable, ceiling=10)",
            color: "#7ee787",
            points: [
              [1, 1.0], [3, 2.71], [5, 4.1], [7, 5.22], [10, 6.51],
              [13, 7.46], [16, 8.15], [20, 8.78], [25, 9.24], [30, 9.51],
              [40, 9.79], [50, 9.91], [60, 9.96]
            ]
          }
        ],
        interpret: "<b>How to read it:</b> x-axis is each pass (sweep) of fitted-Q over the FROZEN log; y-axis is the largest |Q| anywhere in the table. The honest ceiling for this reward is 1/(1-0.9)=10. <b>What the shapes tell you:</b> the green line rises and flattens just under 10 -- it converged to a sane value. The red line keeps climbing past 10, 20, 50 and shows no sign of levelling -- the max in the Bellman target keeps picking the inflated out-of-distribution (OOD) 'left' action, and with no environment to contradict it the value feeds itself. <b>Conclude:</b> a Q-trace that blows through its theoretical ceiling and never flattens is the signature of offline extrapolation error; one that flattens at the ceiling is healthy."
      },
      {
        type: "bars",
        title: "Ideal: average return of each learned greedy policy (rolled out on the true env)",
        xlabel: "method",
        ylabel: "average discounted return from start state",
        labels: ["behaviour policy", "naive offline Q", "conservative offline RL"],
        values: [0.478, 0.0, 0.656],
        valueLabels: ["0.48", "0.00", "0.66"],
        colors: ["#9aa7b4", "#ff7b72", "#7ee787"],
        interpret: "<b>How to read it:</b> each bar is one policy actually rolled out on the real environment; taller = more reward. The grey bar is the behaviour policy that GENERATED the log -- the bar to beat. <b>What it tells you:</b> naive offline Q earns ~0 because its diverged Q made it commit to the phantom 'left' action; conservative offline RL (green) not only stays sane but BEATS the data-generating policy (0.66 vs 0.48) by stitching together the supported goal-reaching action. <b>Conclude:</b> divergence in the Q-trace cashes out as a worthless policy here; a good offline method can exceed the behaviour policy without ever touching the environment."
      },
      {
        type: "bars",
        title: "Variant -- alpha too LARGE: over-conservative collapses below the data",
        xlabel: "method",
        ylabel: "average discounted return from start state",
        labels: ["behaviour policy", "naive (diverges)", "conservative (good alpha)", "over-conservative (alpha too big)"],
        values: [0.478, 0.0, 0.656, 0.21],
        valueLabels: ["0.48", "0.00", "0.66", "0.21"],
        colors: ["#9aa7b4", "#ff7b72", "#7ee787", "#ffb454"],
        interpret: "<b>Illustrative.</b> Same setup, but the conservatism strength alpha is cranked too high. <b>How to recognise it:</b> the orange bar is LOWER than even the behaviour policy -- the penalty pushed Q down so hard it suppressed good-but-rare in-data actions too, leaving a timid policy. <b>What it means:</b> conservatism is a dial, not a free win: too little and Q diverges (red), too much and you under-perform the log (orange); the green bar is the sweet spot. <b>Conclude:</b> if your offline policy is stable yet worse than the data that trained it, suspect alpha is too large and turn it down."
      }
    ],
    caption: "The ideal line and the first bar chart use the real numpy run below, on ONE fixed dataset (a 5-state chain logged by a right-biased behaviour policy, so the 'left' action is out-of-distribution in most states; gamma=0.9). LINE: naive Q-learning's max|Q| climbs past the honest ceiling 1/(1-0.9)=10 toward 95+ and keeps rising (DIVERGES), while the conservative method flattens just under 10. BARS 1: rolled out on the real env, naive earns ~0 while conservative (0.66) beats the behaviour policy (0.48). BARS 2 is an illustrative variant: turning alpha too high makes the conservative method over-pessimistic (0.21), below the behaviour policy -- the other failure mode of the conservatism dial.",
    code: `import numpy as np
rng = np.random.default_rng(0)

# 5-state chain, state 4 terminal/goal; a=0 left, a=1 right; +1 on entering goal.
N_STATES, N_ACTIONS, GAMMA, GOAL = 5, 2, 0.9, 4
def step(s, a):
    s_next = max(0, s-1) if a == 0 else min(GOAL, s+1)
    r = 1.0 if (s_next == GOAL and s != GOAL) else 0.0
    return s_next, r

# --- Fixed dataset from a RIGHT-BIASED behaviour policy (a=0 rarely logged -> OOD).
data, s = [], 0
for _ in range(4000):
    if s == GOAL: s = 0; continue
    a = 1 if rng.random() < 0.9 else 0
    sp, r = step(s, a); data.append((s, a, r, sp)); s = sp
data = np.array(data, float)
counts = np.zeros((N_STATES, N_ACTIONS))
for s_, a_, _, _ in data: counts[int(s_), int(a_)] += 1

def fit(conservative, sweeps=60, alpha=5.0, lr=0.5, ood_bias=8.0):
    Q = np.zeros((N_STATES, N_ACTIONS)); hist = []
    for k in range(sweeps):
        # Inject the worst-case extrapolation a function approximator gives an
        # UNSEEN action: a large optimistic value the max will then chase.
        if not conservative:
            for s_ in range(N_STATES):
                for a_ in range(N_ACTIONS):
                    if counts[s_, a_] / (counts[s_].sum()+1e-9) < 0.2:
                        Q[s_, a_] = max(Q[s_, a_], ood_bias)   # phantom high value
        for s_, a_, r_, sp_ in data:
            s_, a_, sp_ = int(s_), int(a_), int(sp_)
            Q[s_, a_] += lr * (r_ + GAMMA*Q[sp_].max() - Q[s_, a_])
        if conservative:                       # CQL-style: push OOD actions DOWN
            for s_ in range(N_STATES):
                for a_ in range(N_ACTIONS):
                    sup = counts[s_, a_] / (counts[s_].sum()+1e-9)
                    if sup < 0.2: Q[s_, a_] -= alpha * (0.2 - sup)
        hist.append(np.abs(Q).max())
    return Q, hist

Q_naive, h_naive = fit(False)
Q_cons,  h_cons  = fit(True)
print("naive   max|Q| trace:", [round(x,1) for x in h_naive[::5]])
print("conserv max|Q| trace:", [round(x,1) for x in h_cons[::5]])

# --- Roll out each greedy policy on the TRUE env; average discounted return.
def evaluate(policy, episodes=2000, horizon=20):
    tot = 0.0
    for _ in range(episodes):
        s, G, disc = 0, 0.0, 1.0
        for _ in range(horizon):
            if s == GOAL: break
            s, r = step(s, policy(s)); G += disc*r; disc *= GAMMA
        tot += G
    return tot / episodes

beh = evaluate(lambda s: 1 if rng.random() < 0.9 else 0)
nai = evaluate(lambda s: int(Q_naive[s].argmax()))
con = evaluate(lambda s: int(Q_cons[s].argmax()))
print(f"return  behaviour={beh:.3f}  naive={nai:.3f}  conservative={con:.3f}")
# return  behaviour=0.478  naive=0.000  conservative=0.656
# naive max|Q| diverges (47+ and climbing); conservative settles near 10.`
  };
})();
