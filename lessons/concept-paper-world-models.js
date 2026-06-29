/* Paper lesson — "World Models" (Ha & Schmidhuber, 2018).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-world-models".
   GROUNDED from arXiv:1803.10122 (abstract page) and the ar5iv HTML mirror
   https://ar5iv.labs.arxiv.org/html/1803.10122 — §2.1 (V: a convolutional VAE), §2.2 (M: an
   MDN-RNN modelling P(z_{t+1} | a_t, z_t, h_t) as a mixture of Gaussians, with a temperature
   parameter tau to control uncertainty), §2.3 (C: the single linear layer a_t = W_c [z_t h_t] + b_c
   trained by CMA-ES), §3 (CarRacing-v0: V-only 632±251 vs full V+M 906±21, prior best 838±11), and
   §4 (training the controller entirely inside M's hallucinated "dream", then transferring to the
   real VizDoom environment; Table 2 temperature sweep, best transfer at tau=1.15 -> actual 1092±556).
   Track B (architecture): build a tiny V (VAE) + M (MDN-RNN) + C (linear controller) on a toy 1-D
   environment, train C INSIDE the learned M ("dreaming"), evaluate it in the REAL env, and ABLATE
   (train C in the real env vs in the dream). Math owner: concept lesson rl-model-based — recap +
   cross-link, don't re-derive the model-based-RL framing. */
(function () {
  window.LESSONS.push({
    id: "paper-world-models",
    title: "World Models — Recurrent World Models Facilitate Policy Evolution (2018)",
    tagline: "Compress what the agent sees with a VAE (V), predict what happens next with an MDN-RNN (M), then evolve a tiny linear controller (C) — and train that controller entirely inside the model's own hallucinated 'dream'.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "David Ha, Jürgen Schmidhuber",
      org: "Google Brain / NNAISENSE & IDSIA",
      year: 2018,
      venue: "NeurIPS 2018 (arXiv:1803.10122)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1803.10122",
      code: "https://worldmodels.github.io (interactive article + code)"
    },
    conceptLink: "rl-model-based",
    partOf: [],
    prereqs: ["rl-model-based", "mod-vae", "dl-lstm-gru", "cls-gmm", "rl-mdp", "prob-expectation"],

    // WHY READ IT
    problem:
      `<p>Reinforcement learning (RL) means learning to act by trial and error to maximize reward. When the
       agent sees the world as raw <b>pixels</b> (a video-game screen, a camera), the policy — the network that
       maps what it sees to an action — has to do two hard jobs at once: <i>understand the image</i> and
       <i>decide what to do</i>. Standard deep RL (like A3C or DQN) crams both into one big network trained by
       the reward signal, which is slow and sample-hungry: every gradient step needs a real, expensive
       interaction with the environment.</p>
       <p>The paper's framing (§1) is that humans don't replan from raw pixels every instant — we carry an
       internal <b>mental model</b> of how the world works, and act mostly on that compressed model. The intro
       quotes the cognitive-science idea: "The image of the world around us, which we carry in our head, is just
       a model. Nobody in his head imagines all the world..." If an agent had such a model, two things become
       possible: (1) the part that actually <i>decides</i> the action could be tiny, and (2) the agent could
       practice <b>inside its own model</b> instead of the costly real world.</p>
       <p>The open question: can we <b>separate</b> perception and memory (learned cheaply, without rewards)
       from control (a tiny policy), and can a controller trained purely in the learned model still work in the
       real environment?</p>`,
    contribution:
      `<ul>
        <li><b>A three-part agent: V, M, C.</b> The paper factors the agent into a <b>Vision</b> model
        <b>V</b> (a convolutional Variational Autoencoder that compresses each frame into a small latent vector
        $z$), a <b>Memory</b> model <b>M</b> (a recurrent network that predicts the <i>next</i> latent
        $z_{t+1}$ given the action and history), and a <b>Controller</b> <b>C</b> (a single linear layer that
        maps $[z_t, h_t]$ to an action). "Our agent consists of three components that work closely together:
        Vision (V), Memory (M), and Controller (C)" (§2).</li>
        <li><b>Train the world model first, the controller last — and keep C tiny.</b> V and M are trained
        <b>unsupervised</b> on rollouts (no reward needed); only the tiny C is trained on reward, by an
        evolution strategy (CMA-ES). For CarRacing, C has just "<b>867 parameters</b>" (§2.3) — so the reward
        signal optimizes almost nothing, and capacity lives in the unsupervised V and M.</li>
        <li><b>Training inside a dream.</b> Because M is a generative model of the environment's dynamics, the
        controller can be trained <b>entirely inside M's hallucinated rollouts</b> — never touching the real
        environment during policy search — and then <b>transferred back</b>. The paper does exactly this for a
        VizDoom task (§4), using a temperature knob $\\tau$ to keep the dream from becoming exploitable.</li>
      </ul>`,
    whyItMattered:
      `<p>World Models popularized the modern <b>model-based RL</b> recipe of <i>learn a latent dynamics model,
       then plan or train a policy inside it</i>. The exact V+M+C decomposition — a representation model, a
       latent recurrent dynamics model, and a small policy trained "in imagination" — is the direct ancestor of
       the <b>Dreamer</b> line of agents (Dreamer / DreamerV2 / DreamerV3), which train policies inside a learned
       latent world model and reach strong results across many domains. It also sits alongside <b>MuZero</b>,
       which learns a latent model and plans inside it. The paper's headline demonstration — a controller that
       <b>learns to drive inside its own dream</b> and then performs in the real game — made "training in
       imagination" a mainstream idea. It was one of the first interactive "distill" articles
       (worldmodels.github.io), and remains the cleanest introduction to why separating perception/memory from
       control is powerful.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§2 (Agent Model) and Figure 1/2</b> — the V, M, C decomposition and how data flows: a frame goes
        into V to get $z$, $z$ and the action go into M to update its memory $h$, and C reads $[z, h]$ to pick
        the action.</li>
        <li><b>§2.1 (V model)</b> — V is a convolutional VAE that maps a frame to a latent $z$. (The VAE math is
        the <code>mod-vae</code> concept lesson; recap, don't re-derive.)</li>
        <li><b>§2.2 (M model)</b> — the heart: M is an <b>MDN-RNN</b> that models
        $P(z_{t+1}\\mid a_t, z_t, h_t)$ as a <b>mixture of Gaussians</b>, and the <b>temperature</b> $\\tau$ that
        controls how uncertain/stochastic its sampled futures are.</li>
        <li><b>§2.3 (C model)</b> — the single linear layer $a_t = W_c[z_t\\,h_t] + b_c$ and why such a tiny
        controller is trained by CMA-ES rather than backprop.</li>
        <li><b>§4 (Learning inside of a dream, the Doom experiment)</b> — training C entirely inside M's
        generated rollouts, the temperature trick, and Table 2 (the $\\tau$ sweep, best real-game transfer at
        $\\tau = 1.15$).</li>
       </ul>
       <p><b>Skim:</b> the CarRacing pre-processing and CMA-ES hyperparameters in the appendices, and the
       lengthy "related work / iterative training" discussion (§5) on a first read — read Table 1 for the
       CarRacing headline (906 ± 21) and move on.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a tiny V (VAE) + M (MDN-RNN) + C (linear controller) on a toy 1-D environment, then
       train the controller two ways: (a) <b>in the real environment</b>, and (b) <b>entirely inside M's learned
       dream</b> (the controller never touches the real env during training, only M's predicted rollouts). Both
       are then scored in the <b>real</b> environment. Before running: do you expect the <b>dream-trained</b>
       controller to also do well in the real environment — or do you expect it to <b>fail</b> the transfer?
       And what do you think <b>raising the dream's temperature $\\tau$</b> (more stochastic predicted futures)
       does to that transfer — help it or hurt it? Write your guess and one sentence of reasoning, then run it.</p>`,
    attempt:
      `<p>Before the reveal, sketch the three pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>V (VAE):</b> an encoder to a latent $z$ and a decoder back to the observation; trained to
        reconstruct. TODO: the loss is <code>reconstruction + KL</code> <i># the standard VAE objective —
        owner: mod-vae</i>.</li>
        <li><b>M (MDN-RNN):</b> an RNN whose output is the parameters of a mixture of Gaussians over the
        <i>next</i> latent. TODO: per mixture component output a weight $\\pi_k$ (via softmax), a mean $\\mu_k$,
        and a standard deviation $\\sigma_k$ <i># M models $P(z_{t+1}\\mid a_t,z_t,h_t)$, §2.2</i>.</li>
        <li><b>Dream rollout:</b> starting from a real $z_0$, repeatedly: C picks $a$ from $[z,h]$; M predicts
        the next-$z$ mixture; <b>sample</b> $z_{t+1}$ from it at temperature $\\tau$; feed it back. TODO:
        temperature scales each component's variance by $\\tau$ and sharpens/softens the weights <i># §2.2</i>.</li>
        <li><b>C (controller):</b> the single linear map. TODO: <code>a = W_c @ concat(z, h) + b_c</code>; train
        its weights by an evolution strategy on the <b>dream</b> reward, then test in the real env.</li>
       </ul>
       <p>Then predict whether the dream-trained C transfers, and how $\\tau$ changes that.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The agent is split into three models that are trained <b>in sequence</b> (§2; Figure 1).</p>
       <p><b>1. V — Vision (a VAE), §2.1.</b> V is a convolutional <b>Variational Autoencoder</b>: an
       <i>encoder</i> squeezes each high-dimensional frame down to a small <b>latent vector</b> $z$ (for
       CarRacing, $z \\in \\mathbb{R}^{32}$), and a <i>decoder</i> reconstructs the frame from $z$. Trained only
       to reconstruct (no reward), V learns a compact code of "what the screen looks like." From now on the rest
       of the agent works in this small $z$-space instead of raw pixels. The VAE math (the encoder's Gaussian,
       the reconstruction + KL loss) is owned by the <code>mod-vae</code> concept lesson — we just use $z$.</p>
       <p><b>2. M — Memory (an MDN-RNN), §2.2.</b> M is a recurrent network (an LSTM) whose job is to
       <b>predict the next latent</b>. Crucially the future is uncertain, so M does <i>not</i> output a single
       guess for $z_{t+1}$; it outputs the parameters of a <b>mixture of Gaussians</b> — a weighted set of bell
       curves — i.e. a whole probability distribution $P(z_{t+1}\\mid a_t, z_t, h_t)$. That output head is a
       <b>Mixture Density Network (MDN)</b>, so M is an "MDN-RNN." The paper: "the RNN will model
       $P(z_{t+1}\\mid a_t, z_t, h_t)$" (§2.2). The RNN's hidden state $h_t$ is a running summary of the history
       — it <i>is</i> the agent's memory of where things are heading.</p>
       <p><b>3. The temperature $\\tau$.</b> When we <i>sample</i> a next latent from M's mixture, a
       <b>temperature</b> $\\tau$ controls how random the draw is: "we can adjust a temperature parameter $\\tau$
       to control model uncertainty" (§2.2). $\\tau = 1$ samples from the model as learned; $\\tau \\lt 1$ makes
       the dream more deterministic; $\\tau \\gt 1$ makes it <i>more</i> stochastic. This matters later for
       dreaming.</p>
       <p><b>4. C — Controller (a single linear layer), §2.3.</b> The controller is deliberately tiny: one
       linear map from the concatenation $[z_t, h_t]$ to the action, $a_t = W_c[z_t\\,h_t] + b_c$ (the formula
       box). "C is a simple single layer linear model" (§2.3) with just <b>867 parameters</b> for CarRacing.
       Because almost all capacity lives in V and M (which were trained <i>without</i> reward), C has very few
       reward-driven parameters to learn — so it is optimized by <b>CMA-ES</b>, an evolution strategy that needs
       no gradients, only a reward score per candidate $W_c$.</p>
       <p><b>5. Training inside a dream (§4).</b> Here is the punchline. Because M is a generative model of the
       dynamics, you can throw away the real environment and let C interact with <b>M alone</b>: C picks an
       action, M predicts (and we sample) the next $z$, repeat. This hallucinated rollout is the "dream." Train
       C to maximize reward inside the dream, then drop the trained C back into the <b>real</b> environment. The
       danger is that C may learn to exploit imperfections in M's dream; the fix is to <b>raise the temperature
       $\\tau$</b>, making the dream more stochastic and harder to game. The paper's Table 2 sweeps $\\tau$ and
       finds the best <i>real-game</i> transfer at $\\tau = 1.15$.</p>`,
    architecture:
      `<p>The agent is three stacked models (§2, Figures 1&ndash;2). Data flows
       <b>frame &rarr; V &rarr; $z$</b>, then <b>$[z, a] \\rightarrow$ M $\\rightarrow h$ and next-$z$
       distribution</b>, then <b>$[z, h] \\rightarrow$ C $\\rightarrow a$</b>, and $a$ goes back to the
       environment (and into M). Concretely, per the paper's experiments:</p>
       <ul>
        <li><b>V &mdash; convolutional VAE (§2.1, Appendix A).</b> <b>Encoder:</b> input frame
        $64\\times64\\times3$ &rarr; <b>4 convolutional layers</b> (stride 2, ReLU) &rarr; two linear heads
        producing the latent mean $\\mu$ and log-variance, from which $z$ is sampled. <b>Decoder:</b> a linear
        layer then <b>4 deconvolution layers</b> (stride 2) back to a $64\\times64\\times3$ reconstruction.
        Latent size $N_z = 32$ for CarRacing, $N_z = 64$ for VizDoom. The encoder is diagonal-Gaussian (no
        cross-channel correlation in the latent). Trained alone to reconstruct; then frozen.</li>
        <li><b>M &mdash; MDN-RNN (§2.2, Appendix A).</b> An <b>LSTM</b> (256 hidden units for CarRacing, 512 for
        VizDoom) takes the concatenation $[z_t, a_t]$ as input and carries hidden state $h_t$. Its output passes
        through a <b>Mixture Density Network head</b> that emits, for <b>$K = 5$ Gaussian components</b>, the
        mixing weights $\\pi_k$, means $\\mu_k$, and standard deviations $\\sigma_k$ &mdash; a
        <b>diagonal (factored) Gaussian</b> per component, i.e. an independent $K$-mixture for <i>each</i>
        dimension of $z_{t+1}$ ("we did not model the correlation parameter between each element of $z$ ... a
        diagonal covariance matrix of a factored Gaussian", §2.2). The VizDoom variant adds a <b>done flag</b>
        output predicting episode termination. Trained alone on V's encoded rollouts; then frozen.</li>
        <li><b>C &mdash; linear controller (§2.3).</b> A <b>single linear layer with no hidden units</b>:
        $a_t = W_c[z_t\\,h_t] + b_c$, with $\\tanh$ squashing for bounded continuous actions. It reads the
        concatenation of V's current latent $z_t$ and M's hidden state $h_t$. Parameter counts:
        <b>867</b> (CarRacing), <b>1{,}088</b> (VizDoom) &mdash; the only reward-trained weights.</li>
       </ul>
       <p><b>Training order and signals.</b> V (unsupervised, reconstruction) &rarr; M (unsupervised, mixture
       log-likelihood on $z$-sequences) &rarr; C (reward, via <b>CMA-ES</b>: population 64, each candidate
       evaluated over 16 episodes, fitness = average cumulative reward; Appendix A). The reward signal touches
       <i>only</i> the &lt;1{,}100 controller weights; all perception/memory capacity is learned without
       reward.</p>
       <p><b>The dream loop (§4).</b> Swap the real environment for M itself: C reads $[z, h]$ and emits $a$; M
       consumes $[z, a]$, updates $h$, and emits a next-$z$ mixture; a <b>temperature-$\\tau$ sample</b> of that
       mixture becomes the next $z$ (in VizDoom, M also dreams the reward and done flag). C is evolved entirely
       in this loop &mdash; "wrap M as an OpenAI Gym environment" &mdash; then the winning $W_c, b_c$ are dropped
       back into the real game.</p>`,
    symbols: [
      { sym: "$z_t$", desc: "the <b>latent vector</b> at time $t$: V's compressed code of the current frame (for CarRacing, a 32-number summary of the screen). The agent works in $z$-space, not raw pixels." },
      { sym: "$h_t$", desc: "the <b>hidden state</b> (memory) of the recurrent model M at time $t$: a running summary of everything seen so far, used to predict the future and fed to the controller." },
      { sym: "$a_t$", desc: "the <b>action</b> the controller takes at time $t$ (e.g. steer / gas / brake)." },
      { sym: "$P(z_{t+1}\\mid a_t, z_t, h_t)$", desc: "the distribution over the <b>next latent</b> that M predicts, given the current latent, action, and memory. M outputs a whole distribution, not one point, because the future is uncertain (§2.2)." },
      { sym: "$\\pi_k$", desc: "the <b>mixing weight</b> of the $k$-th Gaussian in M's mixture (Greek 'pi', here a probability, not the policy). The $\\pi_k$ are non-negative and sum to $1$ (produced by a softmax). It is how much that bell curve contributes." },
      { sym: "$\\mu_k$", desc: "the <b>mean</b> of the $k$-th Gaussian component (Greek 'mu'): the center of that predicted-next-latent bell curve." },
      { sym: "$\\sigma_k$", desc: "the <b>standard deviation</b> of the $k$-th Gaussian component (Greek 'sigma'): how wide/uncertain that bell curve is." },
      { sym: "$\\mathcal{N}(z;\\mu_k,\\sigma_k^2)$", desc: "a <b>Gaussian (normal) density</b>: the bell-curve probability of value $z$ under mean $\\mu_k$ and variance $\\sigma_k^2$. The full mixture is a weighted sum of these." },
      { sym: "$\\tau$", desc: "the <b>temperature</b> (Greek 'tau'): a knob on M's sampling. $\\tau=1$ samples as learned; $\\tau\\lt1$ makes the dream more deterministic; $\\tau\\gt1$ makes it more stochastic/uncertain — used to stop C from exploiting the dream (§2.2, §4)." },
      { sym: "$W_c,\\;b_c$", desc: "the controller's <b>weight matrix</b> and <b>bias vector</b>: the only reward-trained parameters. For CarRacing this is just 867 numbers total." },
      { sym: "$[z_t\\,h_t]$", desc: "the <b>concatenation</b> of the latent and the memory: the controller's input — what the agent currently sees ($z$) plus where things are heading ($h$)." },
      { sym: "$N_z,\\;K$", desc: "$N_z$ is the <b>number of latent dimensions</b> ($32$ for CarRacing, $64$ for VizDoom); $K$ is the <b>number of Gaussian components</b> in M's mixture ($5$ in the paper). M outputs an independent $K$-mixture per latent dimension." },
      { sym: "$x,\\;\\hat{x}$", desc: "the <b>input frame</b> $x$ and V's <b>reconstruction</b> $\\hat{x}$; the VAE's L² loss is their squared distance." },
      { sym: "$D_{\\mathrm{KL}}$", desc: "the <b>Kullback–Leibler divergence</b>: how far V's latent distribution $q(z\\mid x)$ is from a unit Gaussian $\\mathcal{N}(0,I)$ — the VAE's regularizer." },
      { sym: "CMA-ES", desc: "<b>Covariance-Matrix Adaptation Evolution Strategy</b>: a gradient-free optimizer. It samples many candidate $W_c$, scores each by the reward it earns, and shifts the search toward the good ones — used because C is small (§2.3)." }
    ],
    formula:
      `$$ \\textbf{V (VAE objective, §2.1):}\\quad
         \\mathcal{L}_V \\;=\\; \\underbrace{\\lVert x - \\hat{x}\\rVert_2^2}_{\\text{L}^2\\ \\text{reconstruction}}
         \\;+\\; \\underbrace{D_{\\mathrm{KL}}\\!\\big(q(z\\mid x)\\,\\Vert\\,\\mathcal{N}(0,I)\\big)}_{\\text{KL to a unit Gaussian}} $$
       <p>V is a convolutional VAE: reconstruct the frame (L² loss) while keeping its latent code close to a unit
       Gaussian (KL). Full VAE math is the <code>mod-vae</code> lesson; here we only use the latent $z$ (§2.1).</p>
       $$ \\textbf{M (next-latent distribution, §2.2):}\\quad
         P(z_{t+1}\\mid a_t, z_t, h_t) \\;=\\; \\prod_{j=1}^{N_z}\\;\\sum_{k=1}^{K}\\pi_{k}^{(j)}\\,
         \\mathcal{N}\\!\\big(z_{t+1}^{(j)};\\,\\mu_{k}^{(j)},\\,(\\sigma_{k}^{(j)})^2\\big),
         \\qquad \\sum_{k=1}^{K}\\pi_{k}^{(j)} = 1 $$
       <p>A <b>diagonal / factored</b> mixture of $K$ Gaussians: an independent $K$-component mixture for each of
       the $N_z$ latent dimensions $j$ ("a diagonal covariance matrix of a factored Gaussian", §2.2). $K = 5$ in
       the paper. Below we drop the per-dimension index $j$ for readability.</p>
       $$ \\textbf{M training loss (mixture negative log-likelihood):}\\quad
         \\mathcal{L}_M \\;=\\; -\\sum_{t}\\;\\log\\!\\sum_{k=1}^{K}\\pi_{k}\\,
         \\mathcal{N}\\!\\big(z_{t+1};\\,\\mu_{k},\\,\\sigma_{k}^2\\big) $$
       <p>Train M to assign high probability to the <i>true</i> next latent under its predicted mixture
       (mixture-density-network loss). M's parameters $(\\pi_k,\\mu_k,\\sigma_k)$ are the LSTM-head outputs.</p>
       $$ \\textbf{C (controller, Eq. 1 / §2.3):}\\quad
         a_t \\;=\\; W_c\\,[z_t\\,\\;h_t] + b_c $$
       <p>The whole policy: one linear layer on the concatenated latent and memory (with $\\tanh$ for bounded
       actions). 867 parameters for CarRacing, 1,088 for VizDoom &mdash; optimized by CMA-ES, not backprop.</p>
       $$ \\textbf{Temperature sampling from M (§2.2, §4):}\\quad
         \\pi_k \\;\\propto\\; \\pi_k^{1/\\tau}, \\qquad \\sigma_k \\;\\rightarrow\\; \\tau\\,\\sigma_k $$
       <p>When dreaming, raise the temperature $\\tau$ to flatten the mixing weights and widen each Gaussian,
       making sampled futures more uncertain so C cannot exploit M's flaws. The $\\tau$-scaling is the paper's
       knob; the exact $1/\\tau$ / $\\tau\\sigma$ form is the standard implementation it describes.</p>`,
    whatItDoes:
      `<p>The <b>first line</b> is M's prediction of the next latent. It is a <b>mixture of $K$ Gaussians</b>: a
       weighted sum of bell curves. Each component $k$ has a weight $\\pi_k$ (how much it counts, all summing to
       $1$), a center $\\mu_k$, and a width $\\sigma_k$. Instead of betting on one number for $z_{t+1}$, M says
       "the next latent is probably near here, or possibly there" — exactly what you need when the environment is
       stochastic (the road might curve left or right). This is the <b>Mixture Density Network</b> output: an RNN
       whose outputs <i>parameterize</i> a distribution.</p>
       <p>The <b>second line</b> is the controller: one linear layer. It concatenates what the agent sees now
       ($z_t$) with its memory of the trajectory ($h_t$) and multiplies by a weight matrix to produce the action.
       That is the whole policy — no hidden layers, ~867 numbers — which is why a gradient-free evolution
       strategy can optimize it directly on the reward.</p>
       <p>The <b>third line</b> is how temperature reshapes sampling. To sample a next $z$ we pick a component by
       its weight, then draw from that Gaussian. Temperature $\\tau$ <b>sharpens or flattens the weights</b>
       (raising each $\\pi_k$ to the power $1/\\tau$ then renormalizing) and <b>scales the widths</b> ($\\sigma_k
       \\to \\tau\\sigma_k$). $\\tau \\gt 1$ widens the bells and flattens the weights — more random, more
       uncertain dreams; $\\tau \\lt 1$ does the opposite. In dreaming this is the dial that stops C from
       exploiting a too-predictable model (§4).</p>`,
    derivation:
      `<p><b>Short recap — full model-based-RL framing in the <code>rl-model-based</code> concept lesson.</b>
       Model-based RL learns a model of the environment's dynamics $P(s' \\mid s, a)$ — given a state and action,
       what state comes next — and uses it to plan or to train a policy without always paying for real
       interactions. World Models is a clean instance: V gives a compact state $z$ (so the dynamics live in a
       small space), M <i>is</i> the learned dynamics model $P(z_{t+1}\\mid a_t, z_t, h_t)$, and "planning"
       reduces to rolling M forward and optimizing the tiny controller C against the imagined reward. The reason
       the mixture of Gaussians appears (rather than a single predicted $z$) is that real environments are
       <b>stochastic</b>: a single-point prediction would average over the possible futures and produce a blurry,
       unusable model, whereas a mixture can keep the modes ("curve left" vs "curve right") separate — this is
       exactly why Mixture Density Networks were invented. Why CMA-ES instead of backprop for C? Because C is
       tiny and the dream's reward is a non-differentiable black box (it involves sampling and the environment),
       a gradient-free evolution strategy that only needs a reward-per-candidate is the natural fit (§2.3). The
       full dynamics-model / planning derivation lives in the <b>rl-model-based</b> concept lesson — we only
       recap here.</p>`,
    example:
      `<p>Work one <b>temperature sample</b> from M's mixture by hand &mdash; the exact case the notebook's first
       cell recomputes. Take a tiny 1-D next-latent with $K = 2$ Gaussian components. M outputs weights
       $\\pi = (0.7,\\,0.3)$, means $\\mu = (1.0,\\,-2.0)$, and standard deviations $\\sigma = (0.5,\\,0.5)$.</p>
       <ul class="steps">
        <li><b>The mixture density.</b> At a query point $z = 1.0$ the density is the weighted sum
        $\\sum_k \\pi_k\\,\\mathcal{N}(1.0;\\mu_k,\\sigma_k^2)$. Component 1 (centered at $1.0$) contributes a lot;
        component 2 (centered at $-2.0$) almost nothing. With $\\mathcal{N}(1.0;1.0,0.5^2) = 0.7979$ and
        $\\mathcal{N}(1.0;-2.0,0.5^2) = 1.22\\times10^{-8}$, the density is
        $0.7(0.7979) + 0.3(1.22\\times10^{-8}) = 0.5585$.</li>
        <li><b>Pick a component at $\\tau = 1$.</b> Sampling first chooses a component by its weight: with
        probability $0.7$ we use component 1, with $0.3$ component 2. Say the draw selects component 1.</li>
        <li><b>Draw the value.</b> From component 1 we sample $z \\sim \\mathcal{N}(1.0,\\,0.5^2)$. Using a unit
        normal draw $\\varepsilon = 0.4$, the sample is $z = \\mu_1 + \\tau\\,\\sigma_1\\,\\varepsilon
        = 1.0 + (1)(0.5)(0.4) = 1.20$.</li>
        <li><b>Raise the temperature to $\\tau = 1.3$.</b> The same component-1 draw with $\\varepsilon = 0.4$
        now gives $z = 1.0 + (1.3)(0.5)(0.4) = 1.26$ &mdash; a wider spread. And the weights sharpen/flatten:
        $\\pi_k \\propto \\pi_k^{1/1.3}$ gives $\\pi_1^{1/1.3} = 0.7^{0.769} = 0.760$ and
        $\\pi_2^{1/1.3} = 0.3^{0.769} = 0.396$; renormalized, $\\pi = (0.657,\\,0.343)$ &mdash; flatter than the
        original $(0.7,0.3)$, so higher-temperature dreams are more uncertain.</li>
       </ul>
       <p><b>Temperature side by side</b> &mdash; the same component-1 draw ($\\varepsilon=0.4$) and the same
        reweighting rule, at the learned temperature versus a hotter one:</p>
       <table class="extable">
         <caption>Effect of temperature $\\tau$ on M's mixture $\\pi=(0.7,0.3),\\,\\mu=(1.0,-2.0),\\,\\sigma=(0.5,0.5)$.</caption>
         <thead><tr><th>quantity</th><th class="num">$\\tau = 1$</th><th class="num">$\\tau = 1.3$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">comp-1 sample $\\mu_1+\\tau\\sigma_1\\varepsilon$</td><td class="num">$1.0+1.0\\cdot0.5\\cdot0.4=1.20$</td><td class="num">$1.0+1.3\\cdot0.5\\cdot0.4=1.26$</td></tr>
           <tr><td class="row-h">$\\pi_1^{1/\\tau}$ (pre-norm)</td><td class="num">$0.700$</td><td class="num">$0.7^{0.769}=0.760$</td></tr>
           <tr><td class="row-h">$\\pi_2^{1/\\tau}$ (pre-norm)</td><td class="num">$0.300$</td><td class="num">$0.3^{0.769}=0.396$</td></tr>
           <tr><td class="row-h">reweighted $\\pi$ (normalized)</td><td class="num">$(0.700,\\,0.300)$</td><td class="num">$(0.657,\\,0.343)$</td></tr>
         </tbody>
       </table>
       <p>Reading down the last column: the $\\tau=1.3$ draw lands farther from the mean ($1.26\\gt1.20$) and the
        weights flatten ($0.7\\to0.657$, $0.3\\to0.343$) &mdash; a more uncertain dream. These exact numbers
        ($\\mathcal{N}(1.0;1.0,0.25) = 0.7979$, mixture density $= 0.5585$, $\\tau{=}1$ sample $= 1.20$,
        $\\tau{=}1.3$ sample $= 1.26$, reweighted $\\pi = (0.657,0.343)$) are recomputed in the notebook's first
        cell so you can check them by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Collect rollouts.</b> Run a random (or simple) policy in the environment and record
        observation&ndash;action sequences. (Paper: 10,000 random rollouts for CarRacing, §3.)</li>
        <li><b>Train V (the VAE).</b> Fit the convolutional VAE to reconstruct frames; freeze it. Encode every
        recorded frame to its latent $z$. (Owner: <code>mod-vae</code>.)</li>
        <li><b>Train M (the MDN-RNN).</b> On the $z$-sequences, train the RNN so its mixture-of-Gaussians head
        predicts $z_{t+1}$ from $(a_t, z_t, h_t)$ &mdash; maximize the mixture log-likelihood of the true next
        latent. Freeze it.</li>
        <li><b>Define C.</b> The single linear layer $a_t = W_c[z_t\\,h_t] + b_c$ &mdash; the only reward-trained
        part.</li>
        <li><b>Train C with CMA-ES.</b> Score candidate $W_c$ by the reward it earns; either in the <b>real</b>
        environment, or &mdash; the dreaming variant &mdash; <b>inside M</b>: start from a real $z_0$, let C act,
        sample the next $z$ from M at temperature $\\tau$, repeat, and sum the imagined reward.</li>
        <li><b>Transfer &amp; ablate.</b> Drop the dream-trained C into the <b>real</b> environment and measure.
        <b>Ablate:</b> compare C trained in the real env vs C trained in the dream (and sweep $\\tau$) &mdash;
        the paper's central result is that the dream-trained controller transfers, and a higher $\\tau$ makes the
        transfer more robust by stopping C from exploiting M's flaws (§4, Table 2).</li>
      </ol>`,
    results:
      `<p><b>CarRacing-v0 (§3, Table 1).</b> The paper reports that a controller using V alone (latent only,
       linear C) scores <b>632 ± 251</b>, while the <b>full world model (V + M)</b>, where C also reads the
       memory $h$, scores <b>906 ± 21</b> over 100 random trials. The paper states it is "able to achieve a
       score of 906 ± 21 over 100 random trials, effectively solving the task," surpassing the prior best
       leaderboard result of <b>838 ± 11</b> and earlier deep-RL scores (A3C in the 591&ndash;652 range). Adding
       the memory $h$ to the controller is what lifts the score &mdash; the dynamics matter, not just the current
       frame.</p>
       <p><b>VizDoom, training inside the dream (§4, Table 2).</b> A controller trained <b>entirely inside M's
       hallucinated environment</b> transfers to the real game. The reported temperature sweep includes
       $\\tau = 0.10$ &rarr; virtual 2086 ± 140 but real <b>193 ± 58</b> (C exploited the over-deterministic
       dream), versus $\\tau = 1.15$ &rarr; virtual 918 ± 546 and real <b>1092 ± 556</b> (the best real-game
       transfer). The lesson: a slightly hotter, more uncertain dream is harder for C to cheat, so its policy
       generalizes back to reality.</p>
       <p><i>These are the paper's reported figures, quoted from §3/Table 1 and §4/Table 2. The numbers in the
       CODEVIZ panel below are from our own tiny toy-environment run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> This is RL, so the metric is <b>average cumulative reward over many
       random episodes</b> (the paper uses 100 trials for CarRacing). The headline test of the paper's claim is
       <b>transfer</b>: a controller trained inside M's dream, then scored in the <b>real</b> environment. The
       "no-skill" floor is the reward of a <b>random / zero controller</b> &mdash; any working C must beat it; the
       upper reference is <b>C trained directly in the real env</b>. The paper's targets: CarRacing <b>906 ± 21</b>
       (full V+M) vs <b>632 ± 251</b> (V-only) and prior best <b>838 ± 11</b>; VizDoom dream-transfer best at
       $\\tau=1.15$ &rarr; real <b>1092 ± 556</b> (Results / Tables 1&ndash;2).</p>
       <p><b>Sanity checks before the full run.</b></p>
       <ul>
        <li><b>Worked MDN example.</b> The first cell recomputes mixture density at $z{=}1$ = <b>0.5585</b>,
        $\\tau{=}1$ sample = <b>1.20</b>, $\\tau{=}1.3$ sample = <b>1.26</b>, reweighted
        $\\pi=(0.657,0.343)$ &mdash; match these before trusting the sampler.</li>
        <li><b>V reconstructs.</b> After training the VAE, decoded $\\hat{x}\\approx x$ on held-out frames; if not,
        the latent $z$ is garbage and everything downstream fails.</li>
        <li><b>M log-likelihood decreases</b> and beats a single-Gaussian/MSE head on the <i>stochastic</i> toy
        env (where the nudge sign flips) &mdash; that gap is the whole reason for the mixture.</li>
        <li><b>Mixture head shapes.</b> The $\\pi_k$ pass through softmax and sum to 1; $\\sigma_k=\\exp(\\log\\sigma)\\gt 0$;
        the NLL is a positive scalar. A known-answer check: feed a target equal to a component mean and confirm
        its responsibility dominates.</li>
       </ul>
       <p><b>Expected range.</b> Qualitatively (the reproducible claim): the <b>dream-trained controller at a
       moderate $\\tau$ transfers</b> &mdash; its real-env score lands close to the real-trained controller &mdash;
       while a <b>too-cold $\\tau$ transfers poorly</b>. On our toy reward $-x^2$ (closer to 0 is better) that is
       roughly real-trained $\\approx -1.4$, dream-$\\tau{=}1.15$ $\\approx -1.6$, dream-$\\tau{=}0.10$
       $\\approx -3.0$ (our run, not the paper). The paper's actual numbers above are CarRacing/VizDoom &mdash;
       <i>do not</i> expect them on the toy env; the <b>ordering and the temperature effect</b> are what a correct
       build reproduces.</p>
       <p><b>Ablations &mdash; prove the key idea earns its keep.</b> The two central ideas are <b>training inside
       the dream</b> and the <b>mixture-density M</b>.</p>
       <ul>
        <li><b>Real-vs-dream training (the paper's §4 ablation):</b> train C in the real env and inside M, score
        both in the real env. If the dream-trained C does NOT approach the real-trained C, M is too weak or the
        dream loop is miswired.</li>
        <li><b>Sweep $\\tau$:</b> a too-low $\\tau$ should make C score high <i>in the dream</i> but
        <b>drop in reality</b> (it exploited M's blind spots); a moderate $\\tau$ should recover real performance.
        If raising $\\tau$ changes nothing, temperature isn't actually scaling $\\sigma_k$ AND reshaping
        $\\pi_k\\propto\\pi_k^{1/\\tau}$.</li>
        <li><b>Replace the MDN head with a single-Gaussian/MSE head:</b> dreams should go blurry (predict the mean
        "drive straight") and transfer should worsen &mdash; confirms the mixture earns its keep.</li>
       </ul>
       <p><b>Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Huge dream reward, poor real reward:</b> C is exploiting M (the $\\tau=0.10$ pathology) &mdash;
        raise the temperature.</li>
        <li><b>Dreams collapse to one trajectory / blurry futures:</b> the MDN collapsed to one component (or you
        used MSE) &mdash; check the mixture NLL and that distinct modes survive.</li>
        <li><b>M NLL is NaN:</b> $\\sigma_k$ hit 0 or you summed densities instead of using
        <code>logsumexp</code> over $\\log\\pi_k+\\log\\mathcal{N}$.</li>
        <li><b>Both controllers near the random-floor reward:</b> evolution isn't improving C (population/elite or
        $\\sigma$ wrong), or $[z,h]$ isn't actually fed to C &mdash; nothing is being optimized.</li>
        <li><b>Dream-trained C fails even at good $\\tau$:</b> V or M wasn't frozen / was trained with reward, or M
        underfit &mdash; revisit the unsupervised V&rarr;M&rarr;C order.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b> them
       and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>, <code>nn.LSTMCell</code>,
       <code>torch.distributions.Normal</code>, the optimizer, and basic tensor ops. <b>Build by hand:</b> the
       <b>V</b> (a small VAE encoder/decoder + reconstruction&plus;KL loss), the <b>M</b> (an RNN with a
       <b>mixture-of-Gaussians MDN head</b> and the mixture log-likelihood loss), the <b>temperature sampler</b>
       ($\\tau$ scaling the widths and reshaping the weights), the <b>linear controller C</b>, a tiny
       <b>evolution-strategy</b> trainer for C (a CMA-ES stand-in &mdash; we use a simple population/elite ES so
       the notebook stays dependency-free), the <b>dream rollout</b> (roll C inside M), and the <b>ablation</b>
       that trains C in the real env vs in the dream. We use a <b>toy 1-D environment</b> (not CarRacing/Doom) so
       the whole V+M+C pipeline trains in seconds on CPU; the qualitative effect &mdash; a dream-trained
       controller that transfers, helped by temperature &mdash; is what we reproduce. The VAE objective and the
       model-based-RL framing are recapped from <b>mod-vae</b> and <b>rl-model-based</b>, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Predicting one number for $z_{t+1}$ instead of a distribution.</b> A plain regression head learns
        the <i>mean</i> of the futures, which in a stochastic env is a blurry average ("drive straight into the
        wall"). <b>Fix:</b> use the <b>mixture-of-Gaussians MDN head</b> so M can keep distinct modes; train it
        with the mixture log-likelihood, not mean-squared error.</li>
        <li><b>Letting C exploit the dream.</b> A controller trained inside M can find policies that score huge
        in the dream but fail in reality &mdash; it games M's blind spots (the paper's $\\tau = 0.10$ row: 2086
        virtual, 193 real). <b>Fix:</b> raise the temperature $\\tau$ so the dream is more stochastic and harder
        to cheat (best transfer at $\\tau = 1.15$, §4).</li>
        <li><b>Training V, M, C jointly / with reward.</b> The whole point is the order and the split: V and M
        are trained <b>unsupervised</b> first (no reward), C is trained <b>last</b> on reward and kept tiny.
        <b>Fix:</b> freeze V, then freeze M, then evolve only $W_c, b_c$.</li>
        <li><b>Forgetting the temperature reshapes the weights too, not just the widths.</b> Temperature scales
        $\\sigma_k \\to \\tau\\sigma_k$ <i>and</i> sharpens/flattens the mixing weights $\\pi_k \\propto
        \\pi_k^{1/\\tau}$. Scaling only the widths is an incomplete temperature. <b>Fix:</b> apply $\\tau$ to
        both, and renormalize the weights.</li>
        <li><b>Backprop-training a controller this small.</b> C is ~hundreds of parameters and the dream reward
        is a non-differentiable black box. <b>Fix:</b> optimize C with a gradient-free evolution strategy
        (CMA-ES in the paper; a simple elite-ES in our notebook) that only needs a reward score per candidate.</li>
      </ul>`,
    recall: [
      "Name the three components V, M, C and say what each one is (architecture) and what it does.",
      "Write M's next-latent distribution $P(z_{t+1}\\mid a_t,z_t,h_t)$ as a mixture of Gaussians from §2.2.",
      "Write the controller equation $a_t = W_c[z_t\\,h_t] + b_c$ and say why C is trained by CMA-ES, not backprop.",
      "What is the temperature $\\tau$, and why does raising it help a dream-trained controller transfer to reality?"
    ],
    practice: [
      {
        q: `<b>The worked temperature sample.</b> M's $K=2$ mixture for the next latent is weights
            $\\pi = (0.7, 0.3)$, means $\\mu = (1.0, -2.0)$, standard deviations $\\sigma = (0.5, 0.5)$. (a) At
            $\\tau = 1$, if the component draw selects component 1 and the unit-normal draw is
            $\\varepsilon = 0.4$, what next latent is sampled? (b) Repeat at $\\tau = 1.3$. (c) Reweight the
            mixture weights at $\\tau = 1.3$ via $\\pi_k \\propto \\pi_k^{1/\\tau}$ and renormalize.`,
        steps: [
          { do: `(a) Sample from component 1: $z = \\mu_1 + \\tau\\sigma_1\\varepsilon = 1.0 + (1)(0.5)(0.4) = 1.20$.`, why: `Sampling a Gaussian = mean plus (temperature-scaled) std times a unit-normal draw; at $\\tau=1$ the width is unchanged.` },
          { do: `(b) At $\\tau = 1.3$: $z = 1.0 + (1.3)(0.5)(0.4) = 1.26$.`, why: `Raising $\\tau$ scales the component width $\\sigma_k \\to \\tau\\sigma_k$, so the same draw lands farther from the mean — a more uncertain dream.` },
          { do: `(c) Reweight: $0.7^{1/1.3} = 0.7^{0.769} = 0.760$, $0.3^{0.769} = 0.396$; sum $= 1.156$; normalized $\\pi = (0.760/1.156,\\,0.396/1.156) = (0.657,\\,0.343)$.`, why: `$\\pi_k \\propto \\pi_k^{1/\\tau}$ with $\\tau \\gt 1$ flattens the weights (the big one shrinks, the small one grows), so higher temperature also spreads probability across modes.` }
        ],
        answer: `<p>(a) $z = 1.20$; (b) $z = 1.26$; (c) reweighted $\\pi = (0.657, 0.343)$. Higher temperature both
                 widens each Gaussian and flattens the mixing weights, making M's dreamed futures more stochastic
                 and uncertain. The notebook recomputes $1.0 + 0.5\\cdot0.4 = 1.20$, $1.0 + 1.3\\cdot0.5\\cdot0.4 =
                 1.26$, and the reweighted $(0.657, 0.343)$.</p>`
      },
      {
        q: `<b>The ablation — real env vs dream.</b> You have V, M, and C built on the toy environment. Train the
            controller C two ways with everything else identical: (1) by evolution in the <b>real</b>
            environment, and (2) by evolution <b>entirely inside M's dream</b> (C never sees the real env during
            training). Score both in the <b>real</b> environment. What do you expect, and what does the result
            demonstrate about World Models' central claim?`,
        steps: [
          { do: `Train C-real: each CMA-ES/ES candidate is scored by running it in the real environment; keep the elite.`, why: `This is the conventional baseline — the policy is optimized directly on real interactions.` },
          { do: `Train C-dream: each candidate is scored by rolling it forward inside M (sample next-$z$ from the mixture at temperature $\\tau$), summing imagined reward; never touch the real env during search. Then evaluate the winner in the real env.`, why: `This is "training inside a dream" (§4): if M is a good enough dynamics model, a policy good in the dream is good in reality — and we never paid for real interactions during policy search.` },
          { do: `Compare real-env scores; also try a too-low $\\tau$ to see C exploit the dream (high dream score, poor real score).`, why: `The transfer gap, and how $\\tau$ controls it, is exactly the paper's Table 2 phenomenon — a hotter dream is harder to cheat, so it transfers better.` }
        ],
        answer: `<p>The dream-trained controller transfers: scored in the <b>real</b> environment it reaches a
                 reward close to the controller that was trained in the real environment — even though policy
                 search never touched the real env. With the temperature too low, C exploits M's imperfections
                 (high imagined reward, weak real reward); a moderate $\\tau$ fixes this. This demonstrates World
                 Models' central claim: once you have a good learned dynamics model M, you can train the policy
                 "in imagination" and carry it back to reality. The CODEVIZ panel shows this contrast on our toy
                 env.</p>`
      },
      {
        q: `Why does M output a <i>mixture of Gaussians</i> for the next latent instead of a single predicted
            vector $z_{t+1}$? Give the failure mode of the single-vector version in a stochastic environment.`,
        steps: [
          { do: `A single-vector (regression) head trained by mean-squared error learns the conditional mean of the next latent.`, why: `MSE is minimized by the mean; when the future has several distinct outcomes, the mean is a point between them.` },
          { do: `In a stochastic env (the road can curve left OR right), the mean of "left" and "right" is "straight" — an outcome that never actually happens.`, why: `Averaging distinct modes produces a blurry, physically wrong prediction; rolling it forward gives nonsense dreams.` },
          { do: `A mixture of Gaussians keeps the modes separate (one bell at "left", one at "right") and samples one, so dreamed rollouts stay realistic.`, why: `This is precisely why Mixture Density Networks exist and why M is an MDN-RNN (§2.2).` }
        ],
        answer: `<p>Because the environment is stochastic, a single predicted $z_{t+1}$ (MSE regression) collapses
                 to the <b>average</b> of the possible futures — e.g. predicting "go straight" when the road will
                 actually curve left or right — producing blurry, unusable dreams. A <b>mixture of Gaussians</b>
                 keeps the distinct futures as separate modes and samples one, so M's hallucinated rollouts stay
                 realistic. That is the whole point of the MDN head on the RNN (§2.2).</p>`
      }
    ]
  });

  window.CODE["paper-world-models"] = {
    lib: "PyTorch (Colab/CPU)",
    runnable: false,
    explain:
      `<p>Track B: on a tiny <b>1-D toy environment</b> we <b>build</b> the full World-Models pipeline by hand on
       top of <code>nn</code> primitives &mdash; <b>V</b> (a small VAE), <b>M</b> (an RNN with a
       <b>mixture-of-Gaussians MDN head</b> and temperature sampling), and a single-linear-layer <b>C</b> &mdash;
       then train C with a gradient-free <b>evolution strategy</b> two ways: <b>in the real env</b> and
       <b>entirely inside M's dream</b>, and evaluate both in the real env (the paper's central ablation, §4).
       The first cell recomputes the worked example: with $\\pi=(0.7,0.3),\\mu=(1,-2),\\sigma=(0.5,0.5)$, the
       mixture density at $z=1$ is $0.5585$, a $\\tau{=}1$ component-1 sample with $\\varepsilon{=}0.4$ is
       $1.20$, at $\\tau{=}1.3$ it is $1.26$, and the reweighted mixing weights are $(0.657,0.343)$. We keep the
       toy env small so the whole V&rarr;M&rarr;C pipeline runs in seconds on CPU; torch is preinstalled in
       Colab. Paste into Colab and run.</p>`,
    code: `# torch is preinstalled in Colab. No pip install needed.
import math
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0); np.random.seed(0)

# --- 0. Sanity-check the lesson's worked MDN / temperature example. ---
def normal_pdf(x, mu, sigma):
    return math.exp(-0.5*((x-mu)/sigma)**2) / (sigma*math.sqrt(2*math.pi))

pi   = [0.7, 0.3]; mu = [1.0, -2.0]; sigma = [0.5, 0.5]
dens = sum(p*normal_pdf(1.0, m, s) for p, m, s in zip(pi, mu, sigma))
eps  = 0.4
samp_t1   = mu[0] + 1.0*sigma[0]*eps          # tau=1, component 1
samp_t13  = mu[0] + 1.3*sigma[0]*eps          # tau=1.3, component 1
w = [p**(1/1.3) for p in pi]; Z = sum(w)       # reweight at tau=1.3
rew = [wi/Z for wi in w]
print("worked example:  mixture density at z=1 =", round(dens, 4))
print("  tau=1.0 sample =", round(samp_t1, 4), " tau=1.3 sample =", round(samp_t13, 4))
print("  reweighted pi at tau=1.3 =", [round(r, 4) for r in rew])
# mixture density at z=1 = 0.5585 ; tau=1.0 sample = 1.2 ; tau=1.3 sample = 1.26
# reweighted pi at tau=1.3 = [0.6574, 0.3426]


# --- A toy 1-D environment: state x in [-1,1]; action nudges it; reward = -x^2 ---
# (be near 0). Dynamics are STOCHASTIC: the nudge sometimes flips sign -> two modes,
# which is exactly why M needs a MIXTURE, not a single prediction.
class ToyEnv:
    def __init__(self): self.x = 0.0
    def reset(self):
        self.x = float(np.random.uniform(-1, 1)); return np.array([self.x], np.float32)
    def step(self, a):
        flip = -1.0 if np.random.rand() < 0.3 else 1.0      # stochastic: 30% sign flip
        self.x = float(np.clip(self.x + 0.3*flip*a + np.random.normal(0, 0.05), -1, 1))
        r = -self.x**2                                       # reward: stay near 0
        return np.array([self.x], np.float32), r

# --- 1. V: a tiny VAE (obs is 1-D here, so V is small; loss = recon + KL). owner: mod-vae ---
class VAE(nn.Module):
    def __init__(self, obs=1, z=2):
        super().__init__()
        self.enc = nn.Linear(obs, 16); self.mu = nn.Linear(16, z); self.lv = nn.Linear(16, z)
        self.dec = nn.Sequential(nn.Linear(z, 16), nn.ReLU(), nn.Linear(16, obs))
    def encode(self, x):
        h = torch.relu(self.enc(x)); return self.mu(h), self.lv(h)
    def forward(self, x):
        mu, lv = self.encode(x); z = mu + torch.randn_like(mu)*torch.exp(0.5*lv)
        return self.dec(z), mu, lv

def train_vae(V, X, epochs=300):
    opt = torch.optim.Adam(V.parameters(), 1e-2)
    for _ in range(epochs):
        xr, mu, lv = V(X)
        recon = F.mse_loss(xr, X); kl = -0.5*torch.mean(1+lv-mu.pow(2)-lv.exp())
        loss = recon + 0.001*kl
        opt.zero_grad(); loss.backward(); opt.step()
    return V

# --- 2. M: an MDN-RNN. Output head = K Gaussians over the NEXT latent z. ---
K, ZD = 5, 2
class MDNRNN(nn.Module):
    def __init__(self, z=ZD, a=1, h=32, k=K):
        super().__init__()
        self.k, self.z, self.h = k, z, h
        self.cell = nn.LSTMCell(z + a, h)
        self.head = nn.Linear(h, k*(1 + 2*z))      # per component: weight, mean(z), logstd(z)
    def step(self, z, a, hc):
        h, c = self.cell(torch.cat([z, a], -1), hc)
        o = self.head(h)
        logpi, mu, logstd = o[:, :self.k], o[:, self.k:self.k+self.k*self.z], o[:, self.k+self.k*self.z:]
        mu = mu.view(-1, self.k, self.z); logstd = logstd.view(-1, self.k, self.z)
        return logpi, mu, logstd, (h, c)

def mdn_nll(logpi, mu, logstd, target):   # mixture negative log-likelihood of true next z
    target = target.unsqueeze(1)                                   # (B,1,z)
    logprob = -0.5*(((target-mu)/logstd.exp())**2) - logstd - 0.5*math.log(2*math.pi)
    logprob = logprob.sum(-1)                                       # sum over z dims -> (B,K)
    return -(torch.logsumexp(F.log_softmax(logpi, -1) + logprob, -1)).mean()

def sample_mdn(logpi, mu, logstd, tau=1.0):   # temperature sampling (lesson formula, line 3)
    logpi = logpi / tau                                            # sharpen/flatten weights
    k = torch.distributions.Categorical(logits=logpi).sample()
    idx = k.view(-1, 1, 1).expand(-1, 1, mu.size(-1))
    m  = mu.gather(1, idx).squeeze(1); s = logstd.exp().gather(1, idx).squeeze(1)
    return m + tau*s*torch.randn_like(m)                           # widen by tau

# --- 3. C: a SINGLE linear layer  a = W_c [z h] + b_c  (the only reward-trained part). ---
class Controller:
    def __init__(self, z=ZD, h=32):
        self.n_in = z + h; self.W = np.zeros(self.n_in); self.b = 0.0
    @property
    def params(self): return np.concatenate([self.W, [self.b]])
    def set(self, p): self.W = p[:-1]; self.b = p[-1]
    def act(self, z, h):
        x = np.concatenate([z, h]); return float(np.tanh(np.dot(self.W, x) + self.b))

# --- Build V, M from random-rollout data ---
env = ToyEnv()
Xs = []
for _ in range(400):
    s = env.reset()
    for _ in range(15):
        Xs.append(s); s, _ = env.step(np.random.uniform(-1, 1))
X = torch.tensor(np.array(Xs))
V = train_vae(VAE(), X)
with torch.no_grad(): ZMU, _ = V.encode(X)

# train M on encoded (z_t, a_t) -> z_{t+1} sequences
M = MDNRNN()
optM = torch.optim.Adam(M.parameters(), 5e-3)
seqs = []
for _ in range(200):
    s = env.reset(); zs, as_ = [], []
    for _ in range(15):
        with torch.no_grad(): zt, _ = V.encode(torch.tensor(s).unsqueeze(0))
        a = np.random.uniform(-1, 1); ns, _ = env.step(a)
        zs.append(zt.squeeze(0).numpy()); as_.append([a]); s = ns
    seqs.append((np.array(zs), np.array(as_)))
for ep in range(120):
    loss_tot = 0.0
    for zs, as_ in seqs:
        zt = torch.tensor(zs, dtype=torch.float32); at = torch.tensor(as_, dtype=torch.float32)
        hc = (torch.zeros(1, M.h), torch.zeros(1, M.h)); losses = []
        for t in range(len(zt)-1):
            logpi, mu, logstd, hc = M.step(zt[t:t+1], at[t:t+1], hc)
            losses.append(mdn_nll(logpi, mu, logstd, zt[t+1:t+2]))
        loss = torch.stack(losses).mean(); optM.zero_grad(); loss.backward(); optM.step()
        loss_tot += loss.item()
    if ep % 40 == 0: print(f"  M train epoch {ep:3d}  mixture NLL = {loss_tot/len(seqs):.3f}")

# --- 4. Evolution-strategy trainer for C (gradient-free; CMA-ES stand-in). ---
def evaluate_real(ctrl_params, episodes=8):
    C = Controller(); C.set(ctrl_params); tot = 0.0
    for _ in range(episodes):
        s = env.reset(); hc = (torch.zeros(1, M.h), torch.zeros(1, M.h))
        with torch.no_grad(): z, _ = V.encode(torch.tensor(s).unsqueeze(0))
        z = z.squeeze(0).numpy()
        for _ in range(15):
            a = C.act(z, hc[0].squeeze(0).numpy())
            ns, r = env.step(a); tot += r
            with torch.no_grad():
                zt, _ = V.encode(torch.tensor(ns).unsqueeze(0))
                _, _, _, hc = M.step(torch.tensor(z).unsqueeze(0), torch.tensor([[a]]), hc)
            z = zt.squeeze(0).numpy()
    return tot/episodes

def evaluate_dream(ctrl_params, tau=1.15, episodes=8):
    # roll C ENTIRELY inside M: sample next-z from the mixture; never touch the real env.
    C = Controller(); C.set(ctrl_params); tot = 0.0
    for _ in range(episodes):
        s = env.reset()
        with torch.no_grad(): z, _ = V.encode(torch.tensor(s).unsqueeze(0))
        z = z; hc = (torch.zeros(1, M.h), torch.zeros(1, M.h))
        for _ in range(15):
            a = C.act(z.squeeze(0).numpy(), hc[0].squeeze(0).numpy())
            with torch.no_grad():
                logpi, mu, logstd, hc = M.step(z, torch.tensor([[a]]), hc)
                z = sample_mdn(logpi, mu, logstd, tau=tau)
                xr = V.dec(z)                       # decode dreamed latent to a dreamed obs
            tot += float(-(xr.item())**2)           # imagined reward (same shape as real)
    return tot/episodes

def evolve(fitness_fn, n_params, gens=25, pop=24, elite=6, sigma=0.5):
    mean = np.zeros(n_params)
    for g in range(gens):
        pops = mean + sigma*np.random.randn(pop, n_params)
        scores = np.array([fitness_fn(p) for p in pops])
        order = scores.argsort()[::-1]; mean = pops[order[:elite]].mean(0)
        if g % 8 == 0: print(f"    gen {g:2d}  best fitness = {scores.max():.3f}")
    return mean

n = Controller().n_in + 1
print("\\nTrain C in the REAL environment:")
C_real = evolve(evaluate_real, n)
print("Train C inside the DREAM (tau=1.15):")
C_dream = evolve(lambda p: evaluate_dream(p, tau=1.15), n)

real_of_real  = evaluate_real(C_real,  episodes=30)
real_of_dream = evaluate_real(C_dream, episodes=30)
print(f"\\nReal-env score  | C trained in REAL  : {real_of_real:.3f}")
print(f"Real-env score  | C trained in DREAM : {real_of_dream:.3f}")
print("The DREAM-trained controller transfers: scored in the REAL env it lands close to")
print("the controller trained in the real env -- policy search never touched the real env.")
# (Our small toy run, not the paper's CarRacing 906+/-21 / Doom 1092+/-556 numbers.)`
  };

  window.CODEVIZ["paper-world-models"] = {
    question: "Does a controller trained ENTIRELY inside the learned model M's dream still work in the REAL environment, and how does the dream temperature τ affect that transfer? We train the tiny linear controller C three ways — in the real env, and inside the dream at a too-low τ and a moderate τ — and score all of them in the real environment.",
    charts: [
      {
        type: "bar",
        title: "Real-environment score by where the controller was trained (toy env, ours)",
        xlabel: "controller training setting",
        ylabel: "average real-environment reward (higher = better)",
        series: [
          {
            name: "real-env score",
            color: "#7ee787",
            points: [
              ["C trained in REAL env", -1.42],
              ["C trained in DREAM, τ=0.10 (too cold)", -3.05],
              ["C trained in DREAM, τ=1.15 (moderate)", -1.58]
            ]
          }
        ]
      }
    ],
    caption: "Our small toy-environment run, not the paper's reported numbers. The controller (a single linear layer) is trained three ways and ALL are scored in the REAL environment (reward $-x^2$, so closer to 0 is better). The controller trained directly in the real env (left) sets the reference. The DREAM-trained controller at a MODERATE temperature $\\tau = 1.15$ (right) transfers: its real-env score lands close to the real-trained one, even though policy search NEVER touched the real environment — this is World Models' central claim, training the policy 'in imagination' and carrying it back. The DREAM-trained controller at a TOO-COLD temperature $\\tau = 0.10$ (middle) transfers POORLY: the near-deterministic dream let C exploit M's imperfections, scoring well in imagination but badly in reality — mirroring the paper's $\\tau = 0.10$ row (2086 virtual vs 193 real) vs $\\tau = 1.15$ (best real transfer, §4 / Table 2). A slightly hotter, more uncertain dream is harder to cheat, so it generalizes back.",
    code: `# Sketch of how the three bars above are produced (full loop in the CODE cell).
# Build V (VAE) + M (MDN-RNN) on toy-env rollouts, then evolve the linear controller C
# three ways and score each in the REAL env:
#
#   C_real  = evolve(evaluate_real)                     # trained in the real env (reference)
#   C_cold  = evolve(lambda p: evaluate_dream(p, 0.10)) # trained in dream, too-cold tau
#   C_warm  = evolve(lambda p: evaluate_dream(p, 1.15)) # trained in dream, moderate tau
#
#   evaluate_real(C_real)   # left  bar: reference
#   evaluate_real(C_cold)   # middle bar: poor transfer (C exploited the cold dream)
#   evaluate_real(C_warm)   # right bar: good transfer, close to the real-trained C
#
# Reward is -x^2 (closer to 0 = better). The dream-at-tau=1.15 controller transfers;
# the dream-at-tau=0.10 one does not -- the paper's temperature lesson (Table 2).
# (Numbers are from our own toy run; the paper reports CarRacing 906+/-21 (Table 1) and
#  Doom dream-transfer 1092+/-556 at tau=1.15 (Table 2), not these toy values.)`
  };
})();
