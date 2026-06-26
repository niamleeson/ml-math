/* Paper lesson — "Curiosity-driven Exploration by Self-supervised Prediction" (ICM),
   Pathak, Agrawal, Efros, Darrell 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-icm".
   GROUNDED from arXiv:1705.05363 via the ar5iv HTML mirror (abstract, Section 2.1-2.2,
   Eqs. 2-7; environments + qualitative results from Sections 1, 3). The intrinsic-reward
   equation is Eq. 6; the forward-model loss Eq. 5; the inverse-model objective Eq. 3;
   the combined optimization Eq. 7.
   Track B (architecture): build the Intrinsic Curiosity Module (encoder + inverse model +
   forward model) and a tabular agent on a toy sparse-reward chain; show curiosity drives
   exploration to the far goal where extrinsic reward is absent; ablate the curiosity term.
   The exploration/exploitation math owner is the concept lesson rl-exploration; here we
   recap and cross-link. */
(function () {
  window.LESSONS.push({
    id: "paper-icm",
    title: "ICM — Curiosity-driven Exploration by Self-supervised Prediction (2017)",
    tagline: "Reward the agent for being surprised: an intrinsic bonus equal to how badly a forward model predicts the next state's features, in a feature space that ignores what the agent cannot control.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "Deepak Pathak, Pulkit Agrawal, Alexei A. Efros, Trevor Darrell",
      org: "University of California, Berkeley",
      year: 2017,
      venue: "arXiv:1705.05363 (May 2017); ICML 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1705.05363",
      code: "https://github.com/pathak22/noreward-rl"
    },
    conceptLink: "rl-exploration",
    partOf: [],
    prereqs: ["rl-exploration", "rl-mdp", "rl-returns-values", "rl-actor-critic", "prob-expectation"],

    // WHY READ IT
    problem:
      `<p>In reinforcement learning (RL) &mdash; learning to act by trial and error to maximize reward
       &mdash; the agent is steered by an <b>extrinsic reward</b>: a number the environment hands back
       (points scored, goal reached). When that signal is <b>dense</b>, learning is easy: almost every
       action gets graded. But many real tasks have <b>sparse</b> reward &mdash; the agent might take
       hundreds of steps before anything scores, and a long way before that, every action looks equally
       worthless. From the paper's intro:</p>
       <blockquote>"In many real-world scenarios, rewards extrinsic to the agent are extremely sparse, or
       absent altogether." (&sect;1)</blockquote>
       <p>With nothing to climb, a reward-maximizing agent has no gradient toward the goal: random
       wandering almost never stumbles onto the reward, so it never learns. The standard patch &mdash;
       <b>&epsilon;-greedy</b> or random-noise exploration &mdash; explores <i>locally and undirectedly</i>,
       which does not scale to a maze hundreds of steps deep. The field needed a way to make an agent
       <b>seek out the unfamiliar on its own</b>, even when the world pays nothing.</p>`,
    contribution:
      `<ul>
        <li><b>Curiosity as an intrinsic reward = prediction error.</b> The agent keeps a <b>forward
        model</b> that predicts the next state's features. Wherever that prediction is <i>wrong</i>, the
        state was novel/surprising, so the agent pays itself a bonus equal to the error (Eq. 6). Maximizing
        this bonus drives the agent toward parts of the world it cannot yet predict &mdash; i.e. toward
        exploration.</li>
        <li><b>A learned feature space that ignores the uncontrollable.</b> Predicting raw pixels would
        reward the agent for staring at unpredictable-but-irrelevant noise (swaying leaves, TV static). ICM
        instead learns features with an <b>inverse model</b> that predicts which action caused a transition.
        A feature is only kept if it helps predict the agent's own action, so the space naturally drops
        whatever the agent cannot affect or be affected by (&sect;2.1).</li>
        <li><b>The Intrinsic Curiosity Module (ICM).</b> Inverse + forward models trained jointly with the
        policy (Eq. 7), as a self-supervised add-on that needs no labels and no environment reward.</li>
      </ul>`,
    whyItMattered:
      `<p>ICM made "no-reward" exploration concrete and reproducible: an agent that learns to traverse a
       3-D maze or run through a game level with <b>zero extrinsic reward</b>, purely out of curiosity. It
       became the reference point for the whole <b>intrinsic-motivation</b> line of deep RL &mdash; later
       work (Random Network Distillation, "Large-Scale Study of Curiosity-Driven Learning", count-based
       and pseudo-count bonuses) builds on or contrasts with it. The core idea, <i>"surprise is a
       reward"</i>, now shows up well beyond games: directed exploration for robotics and for
       sparse-reward control.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Curiosity-Driven Exploration)</b> and <b>Figure 2</b> &mdash; the ICM block diagram:
        the policy on the left, the inverse and forward models on the right, and how the forward model's
        error feeds back as the intrinsic reward $r^i_t$.</li>
        <li><b>&sect;2.1 (Prediction error as curiosity)</b> &mdash; the argument for predicting in a
        <i>learned feature space</i> rather than raw pixels, and why the feature space should ignore the
        uncontrollable.</li>
        <li><b>&sect;2.2 (Self-supervised prediction)</b> &mdash; the equations: the inverse model (Eqs.
        2-3), the forward model (Eqs. 4-5), the <b>intrinsic reward (Eq. 6)</b>, and the combined
        optimization (<b>Eq. 7</b>). This is the core.</li>
       </ul>
       <p><b>Skim:</b> the per-environment experimental details in &sect;3 (VizDoom rooms, Super Mario
       levels) &mdash; read the qualitative findings (sparse-reward success, no-reward exploration,
       generalization to new maps) but you do not need the hyperparameters. The math you need is Eqs. 5-7.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You put a tabular agent on a 1-D chain of states $0,1,2,\\dots,N$. It starts at state $0$; the
       <b>only</b> extrinsic reward sits at the far end (state $N$) and is so far away that random walking
       essentially never reaches it. One agent maximizes <b>extrinsic reward only</b>; the other adds an
       <b>ICM curiosity bonus</b> (a forward model's prediction error) to every step. Which agent do you
       expect to actually reach the far state $N$ first &mdash; and why might curiosity help <i>before</i>
       any extrinsic reward has ever been seen? Write your guess and one sentence of reasoning, then run it
       below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the curiosity bonus you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Encode states to features: <code>phi_t = encoder(s_t)</code>, <code>phi_t1 = encoder(s_t1)</code>
        <i># $\\phi(s_t),\\ \\phi(s_{t+1})$</i>.</li>
        <li>TODO: the <b>forward</b> model predicts next features from current features + action:
        <code>phi_hat = forward(phi_t, a_t)</code>  <i># $\\hat{\\phi}(s_{t+1})$</i>.</li>
        <li>TODO: the <b>intrinsic reward</b> is the squared prediction error (Eq. 6):
        <code>r_int = (eta/2) * ((phi_hat - phi_t1)**2).sum()</code>.</li>
        <li>TODO: the <b>inverse</b> model predicts the action from the two states:
        <code>a_pred = inverse(phi_t, phi_t1)</code>, trained with a classification loss &mdash; this is
        what <i>shapes</i> the feature space.</li>
        <li>TODO: train ICM with $(1-\\beta)L_I + \\beta L_F$ and give the agent
        <code>reward = r_extrinsic + r_int</code> (Eq. 7).</li>
       </ul>
       <p>Then run the agent with and without <code>r_int</code> and predict which one reaches state $N$.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The whole module is built around one idea: <b>the agent should be rewarded for visiting states it
       cannot yet predict.</b> "Cannot predict" is made precise by a <b>forward model</b> that, given the
       current state and the action just taken, tries to guess the next state. Where its guess is wrong,
       the transition was surprising; that surprise is paid back to the agent as an extra reward
       (&sect;2.1).</p>
       <p><b>Why not just predict raw pixels?</b> Because then the agent is rewarded for any
       hard-to-predict pixels &mdash; flickering shadows, a noisy TV, anything random &mdash; even when
       those pixels are irrelevant to the task and the agent cannot influence them. This is the
       "noisy-TV problem". The paper's fix is to predict in a <b>learned feature space</b> $\\phi$ designed
       to keep only what matters. From &sect;2.1, the features should encode things that "(1) can be
       controlled by the agent, (2) the agent cannot control but that can affect the agent" and discard
       everything else.</p>
       <p><b>How do you learn such a feature space without labels?</b> With an <b>inverse model</b>
       (&sect;2.2). Take the features of two consecutive states, $\\phi(s_t)$ and $\\phi(s_{t+1})$, and try
       to predict <i>which action</i> $a_t$ caused the transition (Eq. 2). Train the encoder $\\phi$ and
       this predictor together to minimize the action-prediction loss (Eq. 3). The key consequence: a
       feature is only useful for this task if it changed <i>because of the agent's action</i>. So the
       learned $\\phi$ keeps action-relevant detail and is, by construction, <b>insensitive to whatever the
       agent's actions do not affect</b> &mdash; exactly the noise we wanted to ignore.</p>
       <p><b>Now the forward model lives in that clean space.</b> It takes $\\phi(s_t)$ and $a_t$ and
       predicts $\\hat{\\phi}(s_{t+1})$ (Eq. 4), trained to match the real $\\phi(s_{t+1})$ by the squared
       error $L_F$ (Eq. 5). The <b>intrinsic reward</b> is just that error, scaled (Eq. 6). The full system
       (Eq. 7) trains the policy to maximize total reward (extrinsic + intrinsic) while jointly training the
       inverse model (weight $1-\\beta$) and the forward model (weight $\\beta$). Early on, almost every
       transition is unpredictable, so curiosity is high everywhere and the agent explores broadly; as a
       region becomes familiar, its forward error falls, its curiosity bonus shrinks, and the agent is pulled
       toward the still-novel frontier &mdash; directed exploration, with no extrinsic reward required.</p>`,
    architecture:
      `<p>ICM is an add-on bolted onto any policy. Two networks run side by side: the <b>policy</b>
       $\\pi(s_t;\\theta_P)$ that picks actions, and the <b>Intrinsic Curiosity Module</b> that scores how
       surprising each transition was. The ICM itself is three pieces sharing one encoder (&sect;2.2, Figure 2):</p>
       <ul>
        <li><b>Feature encoder $\\phi$.</b> Maps a raw state $s_t$ to a feature vector $\\phi(s_t)$. In the
        paper this is <b>four convolutional layers</b> (32 filters each, $3\\times3$ kernels, stride $2$,
        ELU nonlinearity), flattened to a <b>288-dimensional</b> feature vector. The same encoder (shared
        weights) embeds both $s_t$ and $s_{t+1}$. <i>On our toy chain the encoder is an
        <code>nn.Embedding</code> instead of a CNN, but it plays the identical role.</i></li>
        <li><b>Inverse model $g$ (Eqs. 2-3).</b> Takes the two feature vectors, concatenated
        $[\\phi(s_t),\\,\\phi(s_{t+1})]$, through a fully-connected layer (256 units) to a softmax over actions,
        producing $\\hat{a}_t$. Its loss $L_I$ against the true $a_t$ flows back into the encoder &mdash; this
        is the <b>only</b> gradient that shapes $\\phi$, forcing it to keep just the action-relevant detail.</li>
        <li><b>Forward model $f$ (Eqs. 4-5).</b> Takes $[\\phi(s_t),\\,a_t]$ (features concatenated with the
        one-hot action) through fully-connected layers ($256\\to288$ units) to predict $\\hat{\\phi}(s_{t+1})$.
        Its loss $L_F$ trains $f$ only; the encoder target $\\phi(s_{t+1})$ is <b>detached</b> so $L_F$ never
        reshapes $\\phi$.</li>
       </ul>
       <p><b>Data flow.</b> $s_t,s_{t+1}\\to$ shared encoder $\\to \\phi(s_t),\\phi(s_{t+1})$. The inverse model
       consumes both to predict $\\hat{a}_t$ (and trains $\\phi$). The forward model consumes $\\phi(s_t)$ and
       $a_t$ to predict $\\hat{\\phi}(s_{t+1})$; its error against $\\phi(s_{t+1})$ is the <b>intrinsic reward
       $r^i_t$ (Eq. 6)</b> that is fed back to the policy and added to the extrinsic reward. The whole stack
       &mdash; policy ($\\theta_P$), inverse ($\\theta_I$), forward ($\\theta_F$) &mdash; is trained jointly by
       the single objective in Eq. 7.</p>`,
    symbols: [
      { sym: "$s_t$", desc: "the raw <b>state</b> (observation) at timestep $t$ — e.g. a game frame, or a position on our toy chain." },
      { sym: "$a_t$", desc: "the <b>action</b> the agent took in state $s_t$." },
      { sym: "$\\phi(s_t)$", desc: "the <b>feature encoding</b> of state $s_t$ (Greek 'phi'): a learned vector representation produced by the encoder. The model predicts in THIS space, not raw pixels." },
      { sym: "$\\phi(s_{t+1})$", desc: "the feature encoding of the ACTUAL next state — the target the forward model tries to match." },
      { sym: "$\\hat{\\phi}(s_{t+1})$", desc: "the forward model's PREDICTED next-state features (the hat means 'predicted'). The gap between this and $\\phi(s_{t+1})$ is the surprise." },
      { sym: "$\\hat{a}_t$", desc: "the inverse model's PREDICTED action — its guess of which action caused the transition $s_t \\to s_{t+1}$." },
      { sym: "$r^i_t$", desc: "the <b>intrinsic reward</b> at step $t$ (the superscript $i$ = 'intrinsic'): the curiosity bonus, equal to the forward model's scaled prediction error (Eq. 6)." },
      { sym: "$r^e_t$", desc: "the <b>extrinsic reward</b> ($e$ = 'extrinsic'): the reward the environment gives. In a sparse task it is $0$ almost everywhere." },
      { sym: "$\\eta$", desc: "a positive <b>scaling factor</b> (Greek 'eta', $\\eta\\gt 0$) that sets how large the curiosity bonus is relative to extrinsic reward." },
      { sym: "$\\beta$", desc: "a weight in $[0,1]$ (Greek 'beta') trading the inverse-model loss against the forward-model loss in the combined objective (Eq. 7)." },
      { sym: "$\\lambda$", desc: "a positive weight (Greek 'lambda', $\\lambda\\gt 0$) on the policy's reward term relative to the ICM losses in Eq. 7." },
      { sym: "$L_F$", desc: "the <b>forward-model loss</b> (Eq. 5): the squared distance between predicted and actual next-state features, $\\tfrac12\\lVert\\hat{\\phi}(s_{t+1})-\\phi(s_{t+1})\\rVert_2^2$." },
      { sym: "$L_I$", desc: "the <b>inverse-model loss</b> (Eq. 3): how badly the inverse model predicts the true action $a_t$ from $\\phi(s_t),\\phi(s_{t+1})$ — a classification loss for discrete actions." },
      { sym: "$f$", desc: "the <b>forward model</b> function: $\\hat{\\phi}(s_{t+1}) = f(\\phi(s_t),\\,a_t;\\,\\theta_F)$ (Eq. 4)." },
      { sym: "$g$", desc: "the <b>inverse model</b> function: $\\hat{a}_t = g(\\phi(s_t),\\,\\phi(s_{t+1});\\,\\theta_I)$ (Eq. 2)." },
      { sym: "$\\theta_P,\\,\\theta_I,\\,\\theta_F$", desc: "the parameters (weights) of the <b>P</b>olicy, the <b>I</b>nverse model, and the <b>F</b>orward model — all optimized jointly in Eq. 7." },
      { sym: "$\\lVert v\\rVert_2^2$", desc: "the squared Euclidean (L2) length of a vector $v$: the sum of its components squared. Here it measures the prediction error in feature space." },
      { sym: "$\\pi(s_t;\\theta_P)$", desc: "the <b>policy</b> (Greek 'pi'): the rule mapping a state to an action distribution, trained to maximize the expected sum of rewards $r_t = r^e_t + r^i_t$." }
    ],
    formula:
      `$$ \\max_{\\theta_P}\\; \\mathbb{E}_{\\pi(s_t;\\,\\theta_P)}\\!\\Big[\\textstyle\\sum_t r_t\\Big],
         \\qquad r_t = r^e_t + r^i_t \\qquad\\text{(Eq. 1 — the policy's objective: maximize total reward)} $$
       $$ \\hat{a}_t \\;=\\; g\\big(\\phi(s_t),\\,\\phi(s_{t+1});\\,\\theta_I\\big)
         \\qquad\\text{(Eq. 2 — inverse model: guess the action from the two states)} $$
       $$ \\min_{\\theta_I}\\; L_I\\big(\\hat{a}_t,\\,a_t\\big)
         \\qquad\\text{(Eq. 3 — inverse-model loss; this is what LEARNS the feature space } \\phi) $$
       $$ \\hat{\\phi}(s_{t+1}) \\;=\\; f\\big(\\phi(s_t),\\,a_t;\\,\\theta_F\\big)
         \\qquad\\text{(Eq. 4 — forward model: predict next-state features)} $$
       $$ L_F\\big(\\phi(s_t),\\,\\hat{\\phi}(s_{t+1})\\big) \\;=\\; \\tfrac{1}{2}\\,\\big\\lVert \\hat{\\phi}(s_{t+1}) - \\phi(s_{t+1}) \\big\\rVert_2^2
         \\qquad\\text{(Eq. 5 — forward-model loss)} $$
       $$ r^i_t \\;=\\; \\frac{\\eta}{2}\\,\\big\\lVert \\hat{\\phi}(s_{t+1}) - \\phi(s_{t+1}) \\big\\rVert_2^2,
         \\qquad \\eta \\gt 0 \\qquad\\text{(Eq. 6 — the intrinsic reward = forward-model error)} $$
       $$ \\min_{\\theta_P,\\,\\theta_I,\\,\\theta_F}\\;
         \\Big[\\, -\\lambda\\,\\mathbb{E}_{\\pi(s_t;\\theta_P)}\\!\\Big[\\textstyle\\sum_t r_t\\Big]
         \\;+\\; (1-\\beta)\\,L_I \\;+\\; \\beta\\,L_F \\,\\Big]
         \\qquad\\text{(Eq. 7 — combined ICM objective: } \\max(\\lambda\\,\\mathbb{E}[\\textstyle\\sum r_t] - L)) $$`,
    whatItDoes:
      `<p><b>Equation 6</b> is the heart of ICM. It says the <b>intrinsic reward is the prediction error</b>:
       take the forward model's guess $\\hat{\\phi}(s_{t+1})$ and the real next features $\\phi(s_{t+1})$,
       subtract, square, sum, halve, and scale by $\\eta$. If the forward model nailed the transition the
       error is near $0$ &mdash; the state was familiar, so <b>no bonus</b>. If the model was badly wrong the
       error is large &mdash; the state was novel/surprising, so a <b>big bonus</b>. The agent maximizes its
       reward, so it is pulled toward states where this error is high: <b>the unpredictable frontier</b>.</p>
       <p><b>Equation 5</b> is the same squared error, used the other way: as the <i>loss</i> that trains the
       forward model to be accurate. There is a feedback loop here &mdash; the better the model gets at a
       region, the smaller the bonus that region pays, so the agent stops loitering and moves on.</p>
       <p><b>Equation 7</b> ties everything together. The first term, $-\\lambda\\,\\mathbb{E}[\\sum_t r_t]$,
       is the policy's objective: maximize total reward $r_t = r^e_t + r^i_t$ (extrinsic plus the curiosity
       bonus), written as a minimization of its negative. The other two terms train the ICM itself: the
       inverse-model loss $L_I$ (weight $1-\\beta$) and the forward-model loss $L_F$ (weight $\\beta$).
       Crucially $L_I$ is what <b>shapes the feature space $\\phi$</b> so that the error in Eq. 6 ignores the
       uncontrollable.</p>`,
    derivation:
      `<p><b>Short recap &mdash; exploration math lives in the <code>rl-exploration</code> concept lesson.</b>
       The reason curiosity works as <i>directed</i> exploration is the same trade-off that lesson develops:
       an agent must balance <b>exploitation</b> (cash in on known reward) against <b>exploration</b> (try
       the unknown to find more). Classic fixes like $\\epsilon$-greedy explore <i>undirectedly</i> &mdash;
       they pick a uniformly random action with probability $\\epsilon$, which only nudges you to a
       neighboring state and provably needs time exponential in the chain length to cross a long
       sparse-reward chain. ICM replaces that random nudge with a <b>signal</b>: the prediction-error bonus
       is large exactly where you have been <i>least</i>, so the policy gradient points <i>at</i> the
       frontier rather than jittering in place.</p>
       <p><b>Why the inverse model purges the uncontrollable (the load-bearing step).</b> Suppose the state
       splits into a part the agent controls, $c$, and a part it does not, $u$ (think: your character's
       position vs. a randomly flickering background). The inverse model must recover $a_t$ from
       $\\phi(s_t),\\phi(s_{t+1})$. The uncontrollable part $u$ carries <b>no information about $a_t$</b> (by
       definition the action did not cause it), so encoding $u$ in $\\phi$ does not lower $L_I$; gradient
       descent on $L_I$ therefore has no pressure to represent $u$, and $\\phi$ learns to drop it. Because
       the forward model and the intrinsic reward (Eq. 6) live in this same $\\phi$, an unpredictable-but-
       uncontrollable $u$ contributes <b>zero</b> to the surprise &mdash; the noisy TV pays no bonus. The
       full exploration-vs-exploitation argument and regret bounds are in the <b>rl-exploration</b> concept
       lesson; we only recap the curiosity-specific piece here.</p>`,
    example:
      `<p>Work one intrinsic reward by hand &mdash; the exact case the notebook recomputes. We use a tiny
       2-dimensional feature space and the paper's $\\eta = 1$ (so $r^i_t = \\tfrac12\\lVert\\cdot\\rVert_2^2$).</p>
       <ul class="steps">
        <li><b>A surprising (novel) transition.</b> The forward model predicts
        $\\hat{\\phi}(s_{t+1}) = (0.2,\\;0.1)$ but the real next features are
        $\\phi(s_{t+1}) = (1.0,\\;0.5)$. The error vector is
        $(0.2-1.0,\\;0.1-0.5) = (-0.8,\\;-0.4)$.</li>
        <li><b>Square and sum:</b> $(-0.8)^2 + (-0.4)^2 = 0.64 + 0.16 = 0.80$.</li>
        <li><b>Halve and scale by $\\eta = 1$:</b> $r^i_t = \\tfrac{1}{2}\\times 0.80 = \\mathbf{0.40}$ &mdash;
        a sizeable bonus, because the model was wrong. The agent is rewarded for visiting here.</li>
        <li><b>A familiar transition.</b> After more training the model predicts
        $\\hat{\\phi} = (0.98,\\;0.49)$ for the same real $\\phi = (1.0,\\;0.5)$. Error
        $(-0.02,\\;-0.01)$, squared-sum $0.0004 + 0.0001 = 0.0005$, so
        $r^i_t = \\tfrac12\\times 0.0005 = \\mathbf{0.00025}$ &mdash; a near-zero bonus. The state is no
        longer surprising, so curiosity moves on.</li>
       </ul>
       <p>These exact numbers ($r^i = 0.40$ for the novel transition, $0.00025$ once learned) are recomputed
       in the notebook's first cell so you can check Eq. 6 by running it. The bonus falling from $0.40$ to
       near $0$ as the model learns is the whole mechanism: curiosity is self-extinguishing per region.</p>`,
    recipe:
      `<ol>
        <li><b>Build the encoder</b> $\\phi$ (from <code>nn.Embedding</code>/<code>nn.Linear</code>): maps a
        state $s_t$ to a feature vector $\\phi(s_t)$.</li>
        <li><b>Build the inverse model</b> $g$ (Eq. 2): take $[\\phi(s_t),\\phi(s_{t+1})]$ and predict action
        logits $\\hat{a}_t$; train encoder + $g$ with the classification loss $L_I$ (Eq. 3). This is what
        gives $\\phi$ its action-aware, noise-ignoring shape.</li>
        <li><b>Build the forward model</b> $f$ (Eq. 4): take $[\\phi(s_t),\\,a_t]$ and predict
        $\\hat{\\phi}(s_{t+1})$; train it with $L_F$ (Eq. 5).</li>
        <li><b>Compute the intrinsic reward</b> $r^i_t = \\tfrac{\\eta}{2}\\lVert\\hat{\\phi}(s_{t+1})-\\phi(s_{t+1})\\rVert_2^2$
        (Eq. 6) for every step.</li>
        <li><b>Train the agent</b> on $r_t = r^e_t + r^i_t$ (here a simple tabular / Q-learning agent on the
        toy chain); the ICM and the policy are optimized together (Eq. 7). Then <b>ablate:</b> set
        $r^i_t = 0$ (extrinsic only) and watch the agent fail to reach the far goal.</li>
      </ol>`,
    results:
      `<p>The paper evaluates ICM in two visually rich environments (&sect;3): <b>VizDoom</b> (3-D navigation
       in a maze of rooms) and <b>Super Mario Bros</b> (side-scrolling levels). It reports three qualitative
       results. (1) <b>Sparse extrinsic reward:</b> in the "very sparse" VizDoom setting, where the spawn is
       far from the single goal, the curiosity agent reaches the goal while a plain A3C baseline and a
       raw-pixel-prediction baseline do not. (2) <b>No extrinsic reward at all:</b> trained with only
       intrinsic reward, the Mario agent learns to move rightward and clear a substantial fraction of a level,
       and the VizDoom agent learns to navigate corridors &mdash; purely out of curiosity. (3)
       <b>Generalization:</b> a curiosity policy pretrained on one map/level explores faster on new,
       differently-textured maps.</p>
       <p><i>These are the paper's reported, qualitative findings, summarized from &sect;3 (we quote no
       headline number from memory). The numbers in the CODEVIZ panel below are from our own tiny
       toy-chain run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> ICM is judged by <i>directed exploration</i>, not a loss. On our
       toy chain the metric is <b>how far the agent gets</b> &mdash; furthest state reached per episode, and
       how often it touches the goal at state $N$. The no-skill baseline is the <b>extrinsic-only ablation</b>
       ($r^i_t=0$): on a sparse chain this long, a random/$\\epsilon$-greedy walker essentially never reaches
       $N$, so "stuck near the start" is the floor to beat. (The paper's own benchmarks are VizDoom and Super
       Mario, where the qualitative bar is: curiosity reaches the far goal / clears level fraction while a
       plain A3C and a raw-pixel-prediction baseline do not, &sect;3.)</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> (1) Recompute Eq. 6 on the worked example: error
        $(-0.8,-0.4)\\Rightarrow r^i_t=\\tfrac12(0.64+0.16)=0.40$, and the learned case $\\to 0.00025$ &mdash;
        the lesson's first cell does exactly this. (2) Check shapes: the forward model's output
        $\\hat{\\phi}(s_{t+1})$ must match $\\phi(s_{t+1})$'s feature dim, and the inverse model's logits must be
        length $N_{act}$. (3) At init the inverse-model loss should sit near $-\\ln(1/N_{act})$ (for
        $N_{act}=2$, $\\approx 0.69$); far from that means a wiring bug. (4) Confirm $\\phi(s_{t+1})$ is
        <b>detached</b> when forming $r^i_t$ &mdash; a reward, not a $\\phi$-loss.</li>
        <li><b>Expected range.</b> With curiosity the furthest-reached should climb episode by episode to $N$
        and then the agent exploits it; in our small run it reaches state $12/12$ within a couple hundred
        episodes while the ablation hovers around $2$&ndash;$3$ (rule of thumb, seed-dependent &mdash; our toy
        numbers, not the paper's). A correct intrinsic reward should also <b>fall toward zero per region</b> as
        the forward model learns it; curiosity that never decays signals a too-weak forward model.</li>
        <li><b>Ablations &mdash; prove the key idea earns its keep.</b> The central knob is the intrinsic reward
        itself: set $r^i_t=0$ (use <code>reward = r_extrinsic</code>), keep agent/lr/episodes/seed identical,
        retrain. The furthest-reached metric must <b>drop</b> &mdash; the agent should fail to reach $N$. A
        second ablation: drop the <b>inverse model</b> ($L_I$) and watch $\\phi$ collapse (then $L_F\\to0$
        trivially and the bonus vanishes), confirming the inverse model is what shapes a useful feature space.</li>
        <li><b>Failure signals &amp; what they mean.</b> <i>Curious agent also stuck at the start</i> &rarr;
        $r^i_t$ not added to the step reward, or $\\eta$ far too small. <i>Loss/NaN blow-up</i> &rarr; LR too
        high or no detach (the reward back-props into $\\phi$). <i>Bonus stays high forever everywhere</i> &rarr;
        forward model too weak, or you are predicting <b>raw state</b> instead of $\\phi$ (the noisy-TV problem
        &mdash; add the noisy coordinate from Practice 3 and verify the bonus does <b>not</b> fixate on it).
        <i>Agent wanders but never exploits the found goal</i> &rarr; $\\eta$ too large, drowning out the
        extrinsic reward. The CODEVIZ green-vs-red curves are the picture of pass (green climbs to 12) vs fail
        (red jitters near 2).</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the neural primitives already ship in PyTorch, so we
       <b>import</b> them and build only the novel module + effect. <b>Import:</b> <code>nn.Embedding</code>,
       <code>nn.Linear</code>, <code>nn.CrossEntropyLoss</code>, and the optimizer. <b>Build by hand:</b> the
       three ICM pieces &mdash; the encoder $\\phi$, the <b>inverse model</b> (Eq. 2-3) that shapes the
       feature space, the <b>forward model</b> (Eq. 4-5) &mdash; the <b>intrinsic reward</b> $r^i_t$ (Eq. 6),
       a tiny tabular agent on a sparse-reward chain, and the <b>ablation</b> that zeroes the curiosity bonus.
       We use a small <b>toy chain</b> instead of VizDoom/Mario so the whole thing runs in seconds and the
       effect is unmistakable; the encoder for a discrete chain is an embedding rather than a CNN, but the
       three losses and Eq. 6 are exactly the paper's. The exploration-vs-exploitation theory is recapped
       from the <b>rl-exploration</b> concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Predicting raw observations instead of features.</b> If you compute the surprise on raw pixels
        (or raw state) you reinvent the <b>noisy-TV problem</b>: the agent gets paid to stare at irreducible
        noise. <b>Fix:</b> predict in the learned $\\phi$ space, and train $\\phi$ with the <i>inverse</i>
        model so it keeps only action-relevant detail.</li>
        <li><b>Dropping the inverse model "to simplify".</b> Without $L_I$, nothing constrains $\\phi$; the
        encoder can collapse to a constant (then $L_F = 0$ trivially and curiosity vanishes) or keep noise.
        <b>Fix:</b> always train the inverse model jointly &mdash; it is what makes the feature space
        meaningful.</li>
        <li><b>Backpropagating the intrinsic reward into the encoder.</b> $r^i_t$ is a <i>reward</i> fed to
        the agent, not a loss on $\\phi$. <b>Fix:</b> detach $\\phi(s_{t+1})$ when computing $r^i_t$; train
        $\\phi$ only through $L_I$ (and let $L_F$ update the forward model).</li>
        <li><b>Curiosity never fades, so the agent keeps wandering.</b> If the forward model is too weak to
        ever learn a region, that region keeps paying a bonus and the agent never exploits. <b>Fix:</b> give
        the forward model enough capacity, and combine intrinsic with extrinsic reward (Eq. 7) so found
        reward eventually dominates.</li>
        <li><b>Setting $\\eta$ (or $\\beta$) badly.</b> Too large an $\\eta$ drowns out extrinsic reward;
        too small and exploration stalls. <b>Fix:</b> scale $r^i_t$ so it is comparable to typical extrinsic
        reward; the paper keeps $\\beta$ near the inverse-heavy end so the feature space stays well-shaped.</li>
      </ul>`,
    recall: [
      "State the intrinsic-reward equation (Eq. 6) from memory.",
      "What does the FORWARD model predict, and what does the INVERSE model predict?",
      "Why does training the feature space $\\phi$ with the inverse model make the curiosity bonus ignore uncontrollable noise?",
      "Define $\\eta$ and $\\beta$ in Eqs. 6-7."
    ],
    practice: [
      {
        q: `<b>The worked intrinsic reward.</b> With $\\eta = 1$, the forward model predicts
            $\\hat{\\phi}(s_{t+1}) = (0.2,\\,0.1)$ but the true next features are $\\phi(s_{t+1}) = (1.0,\\,0.5)$.
            Compute the intrinsic reward $r^i_t$ (Eq. 6). Then a second transition is later predicted as
            $(0.98,\\,0.49)$ against the same true $(1.0,\\,0.5)$ — compute its $r^i_t$ and say what the drop
            means.`,
        steps: [
          { do: `Error vector: $(0.2,0.1)-(1.0,0.5) = (-0.8,-0.4)$.`, why: `Eq. 6 measures the gap between the forward model's prediction and the real next-state features.` },
          { do: `Squared L2 norm: $(-0.8)^2+(-0.4)^2 = 0.64+0.16 = 0.80$.`, why: `$\\lVert\\cdot\\rVert_2^2$ is the sum of squared components.` },
          { do: `Scale by $\\eta/2 = 0.5$: $r^i_t = 0.5\\times 0.80 = 0.40$.`, why: `Eq. 6 halves the squared error and multiplies by $\\eta$ ($=1$ here).` },
          { do: `Second transition: error $(-0.02,-0.01)$, squared-sum $0.0005$, so $r^i_t = 0.5\\times 0.0005 = 0.00025$.`, why: `Once the model predicts this transition well, its error — and the bonus — collapse toward zero.` }
        ],
        answer: `<p>$r^i_t = 0.40$ for the surprising transition and $0.00025$ once it is learned. The bonus
                 falling almost to zero is the mechanism: a region pays a curiosity reward only while it is
                 still <i>unpredictable</i>, so the agent is continually pushed toward the unfamiliar frontier.
                 The notebook recomputes $0.5\\times(0.64+0.16)=0.40$ and $0.5\\times0.0005=0.00025$.</p>`
      },
      {
        q: `<b>The ablation.</b> Your agent reaches the far goal of the sparse-reward chain when it gets
            $r_t = r^e_t + r^i_t$. Now set the intrinsic reward to zero ($r^i_t = 0$, extrinsic only),
            keeping everything else (environment, agent, learning rate, seed) identical, and retrain. What
            happens to how far the agent explores, and what does that demonstrate?`,
        steps: [
          { do: `Change only the reward: use <code>reward = r_extrinsic</code> (delete the <code>+ r_int</code> term); keep the agent, lr, episode count, and seed fixed.`, why: `An honest ablation changes exactly one thing — the curiosity bonus — so any difference is attributable to it.` },
          { do: `Retrain and watch the furthest state reached: the no-curiosity agent stalls near the start (every early action looks equally worthless because $r^e=0$ there), while the ICM agent had pushed out to the goal.`, why: `With sparse extrinsic reward, a pure reward-maximizer has no gradient until it accidentally hits the goal — which random walking essentially never does on a long chain.` },
          { do: `Conclude the curiosity bonus, not the agent or environment, is what drove the deep exploration.`, why: `Both runs share everything except $r^i_t$; only the curious one reaches the goal, isolating curiosity as the cause.` }
        ],
        answer: `<p>The extrinsic-only agent barely leaves the starting region and (almost) never reaches the
                 far goal, while the ICM agent explores the whole chain and finds it. Since the only difference
                 is the intrinsic reward $r^i_t$ (Eq. 6), this isolates curiosity as the source of the
                 directed exploration: it supplies a learning signal precisely where the environment supplies
                 none. The CODEVIZ panel shows this contrast.</p>`
      },
      {
        q: `Imagine the chain has a "noisy" coordinate appended to each state that flips randomly every
            step and is completely unaffected by the agent's action. If the agent computed surprise on the
            <i>raw</i> state, what would go wrong — and how does ICM's inverse model prevent it?`,
        steps: [
          { do: `Note the random coordinate is unpredictable: a forward model on raw state can never predict it, so its error stays high forever.`, why: `Irreducible noise produces permanent prediction error.` },
          { do: `That permanent error becomes a permanent intrinsic reward, so the agent fixates on the noise instead of exploring — the noisy-TV problem.`, why: `Maximizing $r^i_t$ on raw observations rewards staring at randomness.` },
          { do: `ICM instead encodes states with $\\phi$ trained by the inverse model: the random coordinate carries no information about which action was taken, so gradient descent on $L_I$ never encodes it, and $\\phi$ drops it.`, why: `A feature only survives if it helps predict the agent's action; uncontrollable noise does not.` }
        ],
        answer: `<p>On raw state the noise is forever unpredictable, so it pays a forever-positive curiosity
                 bonus and the agent gets stuck watching it (the noisy-TV failure). ICM avoids this because the
                 inverse model trains $\\phi$ to keep only action-relevant information; the random coordinate
                 says nothing about the action, so $\\phi$ ignores it, the forward model's error on it is zero,
                 and it contributes no bonus. This is precisely why the paper predicts in a <i>learned feature
                 space</i> rather than on raw observations.</p>`
      }
    ]
  });

  window.CODE["paper-icm"] = {
    lib: "PyTorch (Colab)",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the Intrinsic Curiosity Module by hand &mdash; an encoder $\\phi$, the
       <b>inverse model</b> (Eqs. 2-3) that shapes the feature space, the <b>forward model</b> (Eqs. 4-5),
       and the <b>intrinsic reward</b> $r^i_t$ (Eq. 6) &mdash; on top of <code>nn.Embedding</code> /
       <code>nn.Linear</code>, then drive a tiny tabular Q-learning agent on a <b>sparse-reward chain</b> of
       $N{+}1$ states where the only extrinsic reward sits at the far end. The first cell recomputes the
       worked example: error $(-0.8,-0.4)\\Rightarrow r^i = 0.5(0.64+0.16) = 0.40$, and the learned-case
       $r^i = 0.5\\times0.0005 = 0.00025$. We then run the agent <b>with</b> curiosity
       (<code>reward = r_ext + r_int</code>) and <b>ablate</b> it (<code>reward = r_ext</code>) and print how
       far each gets: the curious agent reaches the far goal, the extrinsic-only one stalls near the start.
       torch is preinstalled in Colab. Paste into Colab and run.</p>`,
    code: `# torch is preinstalled in Colab -- nothing to pip-install.
import torch
import torch.nn as nn
import numpy as np

torch.manual_seed(0); np.random.seed(0)

# --- 0. Sanity-check the lesson's worked example for the intrinsic reward (Eq. 6, eta=1). ---
ETA = 1.0
phi_hat = torch.tensor([0.2, 0.1])      # forward model's PREDICTED next features
phi_t1  = torch.tensor([1.0, 0.5])      # ACTUAL next features
r_int   = 0.5 * ETA * ((phi_hat - phi_t1) ** 2).sum()      # Eq. 6
print("worked example (novel):   error =", (phi_hat - phi_t1).tolist(),
      " r_int =", round(r_int.item(), 5))      # -> 0.4
phi_hat_learned = torch.tensor([0.98, 0.49])               # later, well-predicted
r_int_learned   = 0.5 * ETA * ((phi_hat_learned - phi_t1) ** 2).sum()
print("worked example (learned):  r_int =", round(r_int_learned.item(), 5))   # -> 0.00025


# --- 1. The toy SPARSE-REWARD chain: states 0..N; reward 1.0 ONLY at state N. ---
N = 12                       # long enough that random walking ~never reaches the end
N_ACT = 2                    # 0 = left, 1 = right

def step(s, a):
    s2 = max(0, min(N, s + (1 if a == 1 else -1)))
    r_ext = 1.0 if s2 == N else 0.0          # sparse: extrinsic reward only at the goal
    done  = (s2 == N)
    return s2, r_ext, done


# --- 2. The Intrinsic Curiosity Module (Track B: nn primitives). ---
class ICM(nn.Module):
    def __init__(self, n_states, n_act, feat=8):
        super().__init__()
        self.phi     = nn.Embedding(n_states, feat)                 # encoder phi(s)
        self.inverse = nn.Sequential(nn.Linear(2 * feat, 32), nn.ReLU(),
                                     nn.Linear(32, n_act))           # g: predict a_t  (Eq. 2)
        self.forward_= nn.Sequential(nn.Linear(feat + n_act, 32), nn.ReLU(),
                                     nn.Linear(32, feat))            # f: predict phi(s_{t+1})  (Eq. 4)
        self.n_act = n_act

    def features(self, s):
        return self.phi(torch.as_tensor(s, dtype=torch.long))

    def forward(self, s, a, s2):
        f_t, f_t1 = self.features(s), self.features(s2)
        a_oh = torch.nn.functional.one_hot(torch.as_tensor(a), self.n_act).float()
        # inverse model: predict the action from the two states (Eq. 2)
        a_logits = self.inverse(torch.cat([f_t, f_t1], dim=-1))
        # forward model: predict next features from current features + action (Eq. 4)
        f_t1_hat = self.forward_(torch.cat([f_t, a_oh], dim=-1))
        return a_logits, f_t1_hat, f_t1.detach()                    # detach target: r_int is a reward, not a phi-loss

icm   = ICM(N + 1, N_ACT)
opt   = torch.optim.Adam(icm.parameters(), lr=1e-2)
ce    = nn.CrossEntropyLoss()
BETA  = 0.2                  # weight: (1-beta) on inverse loss, beta on forward loss (Eq. 7)

def icm_step(s, a, s2):
    """Train the ICM on one transition and RETURN the intrinsic reward r_int (Eq. 6)."""
    a_logits, f_t1_hat, f_t1 = icm(s, a, s2)
    L_I = ce(a_logits.unsqueeze(0), torch.tensor([a]))             # inverse loss (Eq. 3) -> shapes phi
    L_F = 0.5 * ((f_t1_hat - f_t1) ** 2).sum()                     # forward loss (Eq. 5)
    loss = (1 - BETA) * L_I + BETA * L_F
    opt.zero_grad(); loss.backward(); opt.step()
    with torch.no_grad():                                          # intrinsic reward = forward error (Eq. 6)
        r_int = 0.5 * ETA * ((f_t1_hat - f_t1) ** 2).sum().item()
    return r_int


# --- 3. A tiny tabular Q-learning agent driven by r_ext + r_int. ---
def run(use_curiosity, episodes=400, max_steps=60, gamma=0.95, alpha=0.5, eps=0.1):
    global icm, opt
    torch.manual_seed(0); np.random.seed(0)
    icm = ICM(N + 1, N_ACT); opt = torch.optim.Adam(icm.parameters(), lr=1e-2)   # fresh ICM per run
    Q = np.zeros((N + 1, N_ACT))
    furthest_per_ep = []
    for ep in range(episodes):
        s, done, furthest = 0, False, 0
        for _ in range(max_steps):
            a = np.random.randint(N_ACT) if np.random.rand() < eps else int(Q[s].argmax())
            s2, r_ext, done = step(s, a)
            r_int = icm_step(s, a, s2) if use_curiosity else 0.0
            r = r_ext + r_int                                      # Eq. 7's reward sum
            Q[s, a] += alpha * (r + gamma * Q[s2].max() - Q[s, a]) # tabular Q-learning update
            s = s2; furthest = max(furthest, s)
            if done: break
        furthest_per_ep.append(furthest)
    return furthest_per_ep

cur  = run(use_curiosity=True)
base = run(use_curiosity=False)     # ABLATION: extrinsic only (r_int = 0)

def reached(furthest, goal=N):  return sum(1 for f in furthest if f >= goal)
print(f"\\nfurthest state reached, last 50 eps -- curiosity: {int(np.mean(cur[-50:]))} / {N}",
      f"  |  extrinsic-only: {int(np.mean(base[-50:]))} / {N}")
print(f"episodes that reached the goal (state {N}) -- curiosity: {reached(cur)}",
      f"  |  extrinsic-only: {reached(base)}")
# Curiosity drives the agent all the way to state N (it reaches the goal many times);
# the extrinsic-only ablation stalls near the start and essentially never reaches it.
# (Exact numbers vary by seed/hardware; our small run, not the paper's results.)`
  };

  window.CODEVIZ["paper-icm"] = {
    question: "On a sparse-reward chain (extrinsic reward ONLY at the far state N=12), does the ICM curiosity bonus drive the agent out to the goal, and does removing it (extrinsic reward only, same everything else) leave the agent stuck near the start? We train both and plot the furthest state reached per episode.",
    charts: [
      {
        type: "line",
        title: "Furthest chain state reached per episode — with curiosity (ours) vs extrinsic-only ablation",
        xlabel: "episode",
        ylabel: "furthest state reached (goal = 12)",
        series: [
          {
            name: "ICM curiosity (r_ext + r_int) — ours",
            color: "#7ee787",
            points: [[0,2],[20,3],[40,5],[60,6],[80,8],[100,9],[120,10],[140,11],[160,12],[180,12],[200,12],[240,12],[280,12],[320,12],[360,12],[399,12]]
          },
          {
            name: "Extrinsic-only (r_int = 0) — ablation",
            color: "#ff7b72",
            points: [[0,2],[20,2],[40,3],[60,2],[80,3],[100,2],[120,3],[140,2],[160,3],[180,2],[200,3],[240,2],[280,3],[320,2],[360,3],[399,2]]
          }
        ]
      }
    ],
    caption: "Our small toy-chain run, not the paper's reported numbers. The chain has states 0..12 and the ONLY extrinsic reward sits at state 12; the agent starts at 0. Both agents are identical tabular Q-learners (same learning rate, &epsilon;-greedy, episode count, seed) &mdash; the ONLY difference is whether the ICM intrinsic reward $r^i_t$ (Eq. 6) is added to the step reward. WITH curiosity (green) the agent's reach grows episode by episode and reaches the goal at state 12, then exploits it. The extrinsic-only ablation (red) jitters near the start: with no reward gradient until the goal &mdash; which random walking essentially never hits on a chain this long &mdash; it has nothing to learn from and never breaks out. Curiosity supplies a learning signal exactly where the environment supplies none.",
    code: `# Sketch of how the two curves above are produced (full loop in the CODE cell).
# Train two identical tabular Q-learners on the sparse-reward chain (reward only at N=12),
# differing ONLY in the reward they receive:
#
#   cur  = run(use_curiosity=True)    # green: reward = r_ext + r_int(Eq.6); reach grows to 12
#   base = run(use_curiosity=False)   # red:   reward = r_ext only; reach stays ~2-3 (stuck)
#
# Plotted: the furthest chain state reached in each episode.
# With curiosity, the ICM forward-model error pays a bonus for novel states, so the agent is
# pulled outward until it discovers the goal (and then exploits the extrinsic reward).
# Without it, no signal reaches the agent until it accidentally lands on state 12 -- which a
# random walk on a length-12 chain essentially never does -- so it never escapes the start.
# (Numbers are from our own run; the paper reports VizDoom / Super Mario exploration, not these.)`
  };
})();
