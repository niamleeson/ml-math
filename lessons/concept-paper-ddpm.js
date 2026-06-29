/* Paper lesson — "Denoising Diffusion Probabilistic Models" (DDPM), Ho, Jain & Abbeel 2020.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-ddpm".
   GROUNDED from arXiv:2006.11239 (abstract) and the ar5iv HTML mirror (Sections 2-4, Eqns 2,4,11,12,14,
   Algorithms 1-2). Track B (architecture): build the forward noising schedule, a small denoising network,
   and the simplified noise-prediction loss (Eq. 14) by hand on top of nn.Linear; train on a 2-D toy
   distribution; print samples emerging from noise. The score/ELBO derivation lives in concept
   mod-diffusion; here we recap and link. */
(function () {
  window.LESSONS.push({
    id: "paper-ddpm",
    title: "DDPM — Denoising Diffusion Probabilistic Models (2020)",
    tagline: "Slowly add noise to data, then train a network to undo one noise step at a time — and you can generate new samples from pure noise.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Jonathan Ho, Ajay Jain, Pieter Abbeel",
      org: "UC Berkeley",
      year: 2020,
      venue: "arXiv:2006.11239 (Jun 2020); NeurIPS 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/2006.11239",
      code: "https://github.com/hojonathanho/diffusion"
    },
    conceptLink: "mod-diffusion",
    partOf: [
      { capstone: "capstone-diffusion", step: 3, builds: "the forward noising schedule + denoising network + simplified loss" }
    ],
    prereqs: ["mod-diffusion", "mod-vae", "dl-conv", "dl-backprop", "prob-normal", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the best way to generate realistic images was the <b>Generative Adversarial
       Network</b> (GAN) &mdash; a generator and a discriminator trained against each other. GANs make sharp
       images but are notoriously hard to train: the two networks can fail to balance, and the generator can
       <b>mode-collapse</b> (a "mode" is one cluster of the data; mode-collapse means it only ever produces a
       few of them). <b>Diffusion probabilistic models</b> &mdash; a different idea borrowed from physics,
       where you watch a structured thing dissolve into random noise &mdash; existed, but had not produced
       image quality anywhere near GANs.</p>
       <p>This paper's question: can we make a diffusion model that is <b>stable to train</b> (just one
       network, one regression loss &mdash; no adversary) and still produces <b>high-quality</b> samples?</p>`,
    contribution:
      `<ul>
        <li><b>A fixed forward "noising" process.</b> Take a clean data point $x_0$ and, over $T$ small steps,
        add a little Gaussian noise each time until it becomes pure noise $x_T$. This direction needs no
        learning at all &mdash; it is a fixed recipe (the <b>variance schedule</b> $\\beta_1,\\dots,\\beta_T$).</li>
        <li><b>Predict the noise, not the image.</b> The key reparameterization (&sect;3.2): instead of
        training the network to output the denoised mean directly, train it to <b>predict the noise
        $\\epsilon$</b> that was added. This turns generation into a simple noise-regression problem.</li>
        <li><b>A simplified training loss (Eq. 14).</b> Drop the per-timestep weighting from the proper
        variational bound and just minimize the <b>mean-squared error</b> between the true noise and the
        predicted noise. Simpler to code, and the paper reports it gives <i>better</i> samples.</li>
      </ul>`,
    whyItMattered:
      `<p>DDPM is the foundation of the modern image-generation wave. The exact training loop you build here
       &mdash; sample a clean image, noise it to a random timestep, ask a network to predict the noise, take
       a gradient step &mdash; scaled up (with a U-Net denoiser and text conditioning) becomes Stable
       Diffusion, Imagen, and DALL&middot;E&nbsp;2. Later work added <b>classifier-free guidance</b> (the
       next paper, paper-cfg) and faster samplers, but the core noise-prediction objective is unchanged.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Background)</b> &mdash; the forward process $q(x_t \\mid x_{t-1})$ (Eq. 2) and the
        crucial closed form $q(x_t \\mid x_0)$ (Eq. 4) that lets you jump to <i>any</i> noise level in one step.</li>
        <li><b>&sect;3.2 (Reverse process and $L_{t-1}$)</b> &mdash; the noise-prediction parameterization of
        the mean (Eq. 11) and the loss it leads to (Eq. 12).</li>
        <li><b>Eq. 14</b> &mdash; the simplified objective $L_{\\text{simple}}$ you will implement. This one
        line is the whole training signal.</li>
        <li><b>Algorithms 1 and 2</b> (the boxed pseudocode) &mdash; training (Alg. 1) and sampling (Alg. 2).
        You will translate these almost line-for-line into code.</li>
       </ul>
       <p><b>Skim:</b> the nonequilibrium-thermodynamics framing in &sect;2, the full variational-bound
       algebra (&sect;3.1, the appendix), and the discrete-decoder details (&sect;3.3) on a first pass &mdash;
       the math you need to run the model is Eqs. 2, 4, 11, 14 plus the two algorithm boxes.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train one small network on a 2-D toy distribution &mdash; points arranged in a ring of 8
       little clusters (8 "modes"). The network only ever learns to <b>predict the noise added to a point</b>.
       At sampling time we start from a cloud of pure Gaussian noise and run the reverse steps.</p>
       <p>Before running: where do you think the final points land? Spread out everywhere like the noise we
       started from? Collapsed into one cluster (like a mode-collapsed GAN)? Or back onto the 8 original
       clusters? Write your guess.</p>`,
    attempt:
      `<p>Before the reveal, sketch the three pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Schedule.</b> <code>betas = torch.linspace(1e-4, 0.02, T)</code>; then
        <code>alphas = 1 - betas</code> and TODO: <code>abar = </code> the running product
        (<code>torch.cumprod</code>) of <code>alphas</code>.</li>
        <li><b>Forward noising</b> (Eq. 4): given a batch of clean points <code>x0</code>, random timesteps
        <code>t</code>, and noise <code>eps = torch.randn_like(x0)</code>, TODO:
        <code>xt = abar[t].sqrt() * x0 + (1 - abar[t]).sqrt() * eps</code>.</li>
        <li><b>Loss</b> (Eq. 14): <code>pred = net(xt, t)</code>; TODO:
        <code>loss = ((eps - pred) ** 2).mean()</code>  <i># predict the noise, MSE</i>.</li>
       </ul>
       <p>Then a sampling loop (Alg. 2) that starts from <code>torch.randn</code> and walks $t$ down from $T$
       to $0$. Predict what the scatter looks like at the start, the middle, and the end.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>Two processes, one fixed and one learned.</b></p>
       <p><b>1. The forward process (fixed, no learning).</b> Start with a clean data point $x_0$. At each of
       $T$ steps, shrink it slightly and add a little Gaussian noise. The amount of noise at step $t$ is set
       by a small number $\\beta_t$ from a fixed <b>variance schedule</b>. The paper writes one noising step
       as a Gaussian (&sect;2, Eq. 2):</p>
       <p>$$ q(x_t \\mid x_{t-1}) = \\mathcal{N}\\!\\big(x_t;\\ \\sqrt{1-\\beta_t}\\,x_{t-1},\\ \\beta_t \\mathbf{I}\\big). $$</p>
       <p>Here $\\mathcal{N}(x;\\,\\mu,\\,\\Sigma)$ means "$x$ is drawn from a Gaussian (bell-curve) with mean
       $\\mu$ and variance $\\Sigma$." After many steps $x_T$ is essentially pure noise.</p>
       <p><b>The shortcut that makes it practical (Eq. 4).</b> You do not have to run $t$ steps one by one. The
       paper shows that noising $x_0$ all the way to step $t$ has a one-shot closed form. Define
       $\\alpha_t = 1-\\beta_t$ and the running product $\\bar\\alpha_t = \\prod_{s=1}^{t}\\alpha_s$. Then</p>
       <p>$$ q(x_t \\mid x_0) = \\mathcal{N}\\!\\big(x_t;\\ \\sqrt{\\bar\\alpha_t}\\,x_0,\\ (1-\\bar\\alpha_t)\\mathbf{I}\\big),
       \\qquad\\text{i.e.}\\qquad x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon,\\ \\ \\epsilon\\sim\\mathcal{N}(0,\\mathbf{I}). $$</p>
       <p>So $x_t$ is just a weighted mix: a $\\sqrt{\\bar\\alpha_t}$ fraction of the clean point plus a
       $\\sqrt{1-\\bar\\alpha_t}$ fraction of fresh noise $\\epsilon$. As $t$ grows, $\\bar\\alpha_t \\to 0$, so
       the clean part fades and the noise takes over.</p>
       <p><b>2. The reverse process (learned).</b> Generation runs the other way: start from noise $x_T$ and
       step back down to $x_0$. Each reverse step is modeled as a Gaussian whose mean is produced by a network
       with parameters $\\theta$ (&sect;3.2, Eq. 1): $p_\\theta(x_{t-1}\\mid x_t) = \\mathcal{N}(x_{t-1};\\,
       \\mu_\\theta(x_t,t),\\,\\Sigma_\\theta(x_t,t))$.</p>
       <p><b>The trick: predict the noise.</b> Instead of having the network output the mean directly, the
       paper reparameterizes the mean in terms of a <b>noise predictor</b> $\\epsilon_\\theta(x_t,t)$ &mdash; a
       network that looks at the noisy $x_t$ and the timestep $t$ and guesses which noise $\\epsilon$ was
       added (&sect;3.2, Eq. 11):</p>
       <p>$$ \\mu_\\theta(x_t,t) = \\frac{1}{\\sqrt{\\alpha_t}}\\left(x_t - \\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}}\\,\\epsilon_\\theta(x_t,t)\\right). $$</p>
       <p>Plugging this into the proper training objective gives a weighted noise-MSE (Eq. 12). The paper then
       <b>drops the weights</b> and trains the plain mean-squared error between the true and predicted noise
       &mdash; that is $L_{\\text{simple}}$, Eq. 14, the formula below.</p>`,
    architecture:
      `<p>The only learned component is the noise predictor $\\epsilon_\\theta(x_t,t)$. For images the paper builds
       it as a <b>U-Net</b> (&sect;4, Appendix B); our toy uses a small multilayer perceptron instead so it runs
       in seconds. The U-Net is described component by component below.</p>
       <p><b>Input / output shape.</b> The network maps a noisy image $x_t$ (same height&times;width&times;channels
       as the data) plus a scalar timestep $t$ to a noise estimate $\\epsilon_\\theta$ of the <b>same shape as
       the image</b> &mdash; it is image-to-image, not image-to-label. Trained on $32\\times32$ CIFAR-10 and up
       to $256\\times256$ LSUN.</p>
       <p><b>U-Net backbone (encoder&ndash;decoder with skips).</b> "A U-Net backbone similar to an unmasked
       PixelCNN++." An <b>encoder</b> path repeatedly downsamples the image through several resolution levels
       (e.g. $32\\to16\\to8\\to4$), and a symmetric <b>decoder</b> path upsamples back to full size. Each decoder
       level receives a <b>skip connection</b> carrying the matching-resolution encoder features, so fine spatial
       detail is not lost through the bottleneck. Each level is a stack of <b>residual blocks</b> (convolution +
       skip-add).</p>
       <p><b>Group normalization throughout.</b> Every residual block uses <b>group normalization</b> (a
       batch-size-independent normalizer that splits channels into groups) followed by the <b>Swish / SiLU</b>
       activation $x\\,\\sigma(x)$.</p>
       <p><b>Self-attention at $16\\times16$.</b> At the $16\\times16$ feature-map resolution the blocks include a
       <b>self-attention</b> layer, letting every spatial location attend to every other &mdash; capturing
       long-range structure that local convolutions miss.</p>
       <p><b>Time embedding (how the one network knows the noise level).</b> The same weights denoise <i>every</i>
       timestep, so $t$ must be fed in. The scalar $t$ is turned into a vector by the <b>Transformer sinusoidal
       position embedding</b> (sines and cosines at many frequencies), passed through a small multilayer
       perceptron, and <b>added into every residual block</b>. This is exactly the $t$-conditioning the toy MLP
       mimics by concatenating $t/T$, and the ablation in this lesson shows removing it wrecks samples.</p>
       <p><b>Reverse-step variance.</b> $\\Sigma_\\theta$ is not learned: it is fixed to $\\sigma_t^2\\mathbf{I}$
       with $\\sigma_t^2 = \\beta_t$ or $\\tilde\\beta_t$ (Eq. 7). Only the mean &mdash; via $\\epsilon_\\theta$
       &mdash; is learned.</p>`,
    symbols: [
      { sym: "$x_0$", desc: "a <b>clean data point</b> (here a 2-D point; in the paper an image)." },
      { sym: "$x_t$", desc: "the data point after $t$ steps of noising &mdash; a <b>noisy version</b> of $x_0$. $x_T$ is essentially pure noise." },
      { sym: "$t$", desc: "the <b>timestep</b>, an integer from $1$ to $T$. Larger $t$ = noisier. Also fed to the network so it knows the noise level." },
      { sym: "$T$", desc: "the <b>total number of noise steps</b> (the paper uses $T=1000$; our toy uses $T=50$)." },
      { sym: "$\\beta_t$", desc: "the <b>variance schedule</b> value at step $t$: a small number setting how much noise is added at step $t$. Grows slowly from a tiny value to about $0.02$." },
      { sym: "$\\alpha_t$", desc: "shorthand $\\alpha_t = 1-\\beta_t$: the fraction of the previous signal <i>kept</i> at one step." },
      { sym: "$\\bar\\alpha_t$", desc: "(\"alpha-bar\") the <b>running product</b> $\\bar\\alpha_t = \\alpha_1\\alpha_2\\cdots\\alpha_t$: the fraction of the <i>original</i> signal still present at step $t$. Goes from near $1$ down toward $0$." },
      { sym: "$\\epsilon$", desc: "the <b>actual noise</b> drawn from a standard Gaussian $\\mathcal{N}(0,\\mathbf{I})$ and mixed into $x_0$ to make $x_t$. This is the target the network must predict." },
      { sym: "$\\epsilon_\\theta(x_t,t)$", desc: "the <b>noise predictor</b>: the trainable network (parameters $\\theta$) that looks at noisy $x_t$ and timestep $t$ and outputs its guess of $\\epsilon$." },
      { sym: "$\\mu_\\theta(x_t,t)$", desc: "the <b>mean</b> of the learned reverse step, computed from the predicted noise via Eq. 11." },
      { sym: "$\\Sigma_\\theta(x_t,t)$", desc: "the <b>covariance</b> of the learned reverse step. Not learned in DDPM: fixed to $\\sigma_t^2\\mathbf{I}$." },
      { sym: "$p_\\theta(x_{t-1}\\mid x_t)$", desc: "the <b>learned reverse step</b>: a Gaussian (parameters $\\theta$) that denoises $x_t$ one step toward $x_{t-1}$ (Eq. 1)." },
      { sym: "$p(x_T)$", desc: "the <b>prior</b> the reverse process starts from: the standard Gaussian $\\mathcal{N}(0,\\mathbf{I})$ (pure noise)." },
      { sym: "$q(x_{t-1}\\mid x_t,x_0)$", desc: "the <b>forward-process posterior</b>: the true reverse step when the clean $x_0$ is known &mdash; the target $p_\\theta$ is trained to match (Eqs. 6&ndash;7)." },
      { sym: "$\\tilde\\mu_t(x_t,x_0)$", desc: "(\"mu-tilde\") the <b>mean of that posterior</b> &mdash; a fixed weighted blend of $x_0$ and $x_t$ (Eq. 7)." },
      { sym: "$\\tilde\\beta_t$", desc: "(\"beta-tilde\") the <b>variance of that posterior</b>, $\\tilde\\beta_t = \\frac{1-\\bar\\alpha_{t-1}}{1-\\bar\\alpha_t}\\beta_t$ (Eq. 7)." },
      { sym: "$\\bar\\alpha_{t-1}$", desc: "the running product $\\bar\\alpha$ one step earlier (signal fraction left at step $t-1$)." },
      { sym: "$\\sigma_t$", desc: "the <b>noise level added back</b> during sampling (Alg. 2). Set to $\\sqrt{\\beta_t}$ or $\\sqrt{\\tilde\\beta_t}$; zero at the final step." },
      { sym: "$z$", desc: "fresh <b>standard Gaussian noise</b> injected at each sampling step except the last." },
      { sym: "$L$", desc: "the <b>variational bound</b> (Eq. 3): the upper bound on $-\\log p_\\theta(x_0)$ that is minimized; splits into $L_T + \\sum L_{t-1} + L_0$ (Eq. 5)." },
      { sym: "$L_{t-1}$", desc: "one <b>per-timestep KL term</b> of $L$ (Eq. 5): the KL divergence between the posterior $q(x_{t-1}\\mid x_t,x_0)$ and the learned step $p_\\theta(x_{t-1}\\mid x_t)$." },
      { sym: "$\\sigma_t^2$", desc: "the variance used in the KL/sampling; equals $\\beta_t$ or $\\tilde\\beta_t$." },
      { sym: "$\\theta$", desc: "the <b>trainable parameters</b> of the noise-predictor network." },
      { sym: "$\\mathcal{N}(x;\\,\\mu,\\,\\Sigma)$", desc: "a <b>Gaussian</b> (normal / bell-curve) distribution for $x$ with mean $\\mu$ and variance $\\Sigma$; $\\mathbf{I}$ is the identity (independent, equal-variance components)." },
      { sym: "$D_{\\mathrm{KL}}(q\\,\\Vert\\,p)$", desc: "the <b>Kullback&ndash;Leibler divergence</b>: a measure of how far distribution $q$ is from $p$; zero when they match." },
      { sym: "$L_{\\text{simple}}$", desc: "the <b>simplified training loss</b> (Eq. 14): the plain mean-squared error between the true noise $\\epsilon$ and the predicted noise $\\epsilon_\\theta$." }
    ],
    formula: `$$ q(x_t \\mid x_{t-1}) = \\mathcal{N}\\!\\big(x_t;\\ \\sqrt{1-\\beta_t}\\,x_{t-1},\\ \\beta_t \\mathbf{I}\\big), \\qquad q(x_{1:T}\\mid x_0) = \\prod_{t=1}^{T} q(x_t\\mid x_{t-1}) $$
       <p>One forward noising step is a Gaussian that shrinks the previous point by $\\sqrt{1-\\beta_t}$ and adds variance $\\beta_t$; the whole forward chain is their product (&sect;2, Eq. 2).</p>
       $$ q(x_t \\mid x_0) = \\mathcal{N}\\!\\big(x_t;\\ \\sqrt{\\bar\\alpha_t}\\,x_0,\\ (1-\\bar\\alpha_t)\\mathbf{I}\\big), \\qquad \\alpha_t := 1-\\beta_t,\\ \\ \\bar\\alpha_t := \\prod_{s=1}^{t}\\alpha_s $$
       <p>Closed form: noise $x_0$ to <i>any</i> step $t$ in one shot. Equivalently $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$ with $\\epsilon\\sim\\mathcal{N}(0,\\mathbf{I})$ (&sect;2, Eq. 4).</p>
       $$ p_\\theta(x_{t-1}\\mid x_t) := \\mathcal{N}\\!\\big(x_{t-1};\\ \\mu_\\theta(x_t,t),\\ \\Sigma_\\theta(x_t,t)\\big), \\qquad p_\\theta(x_{0:T}) = p(x_T)\\prod_{t=1}^{T} p_\\theta(x_{t-1}\\mid x_t) $$
       <p>The learned reverse process: each denoising step is a Gaussian with a network-produced mean $\\mu_\\theta$ (&sect;2, Eq. 1). Generation starts at $p(x_T)=\\mathcal{N}(0,\\mathbf{I})$.</p>
       $$ \\mathbb{E}\\big[-\\log p_\\theta(x_0)\\big] \\le \\mathbb{E}_q\\!\\left[-\\log p(x_T) - \\sum_{t\\ge 1}\\log \\frac{p_\\theta(x_{t-1}\\mid x_t)}{q(x_t\\mid x_{t-1})}\\right] =: L $$
       <p>The variational (ELBO) bound that is actually minimized: an upper bound on the negative log-likelihood (&sect;2, Eq. 3).</p>
       $$ q(x_{t-1}\\mid x_t,x_0) = \\mathcal{N}\\!\\big(x_{t-1};\\ \\tilde\\mu_t(x_t,x_0),\\ \\tilde\\beta_t\\mathbf{I}\\big),\\quad \\tilde\\mu_t = \\frac{\\sqrt{\\bar\\alpha_{t-1}}\\,\\beta_t}{1-\\bar\\alpha_t}x_0 + \\frac{\\sqrt{\\alpha_t}\\,(1-\\bar\\alpha_{t-1})}{1-\\bar\\alpha_t}x_t,\\quad \\tilde\\beta_t = \\frac{1-\\bar\\alpha_{t-1}}{1-\\bar\\alpha_t}\\beta_t $$
       <p>The forward process posterior &mdash; the <i>true</i> reverse step when $x_0$ is known. Tractable because conditioning on $x_0$ makes it Gaussian (&sect;3.1, Eqs. 6&ndash;7). $L$ splits into $L_T + \\sum_{t\\gt1} L_{t-1} + L_0$ of KL terms (Eq. 5), and each $L_{t-1}$ matches $p_\\theta$ to this posterior.</p>
       $$ \\mu_\\theta(x_t,t) = \\frac{1}{\\sqrt{\\alpha_t}}\\!\\left(x_t - \\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}}\\,\\epsilon_\\theta(x_t,t)\\right) $$
       <p>The $\\epsilon$-prediction reparameterization: rather than output the mean, the network predicts the noise $\\epsilon_\\theta$, and the mean is built from it (&sect;3.2, Eq. 11).</p>
       $$ L_{t-1} - C = \\mathbb{E}_{x_0,\\epsilon}\\!\\left[\\frac{\\beta_t^2}{2\\sigma_t^2\\,\\alpha_t(1-\\bar\\alpha_t)}\\big\\lVert\\epsilon - \\epsilon_\\theta\\big(\\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon,\\,t\\big)\\big\\rVert^2\\right] $$
       <p>Substituting Eq. 11 turns the mean-matching KL into a weighted noise mean-squared error (&sect;3.2, Eq. 12).</p>
       $$ L_{\\text{simple}}(\\theta) := \\mathbb{E}_{t,\\,x_0,\\,\\epsilon}\\Big[\\,\\big\\lVert\\,\\epsilon - \\epsilon_\\theta\\big(\\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon,\\ t\\big)\\big\\rVert^2\\,\\Big] $$
       <p>Drop the per-timestep weight from Eq. 12 &mdash; the simplified training objective the paper actually uses (&sect;3.4, Eq. 14).</p>
       $$ x_{t-1} = \\frac{1}{\\sqrt{\\alpha_t}}\\!\\left(x_t - \\frac{1-\\alpha_t}{\\sqrt{1-\\bar\\alpha_t}}\\,\\epsilon_\\theta(x_t,t)\\right) + \\sigma_t z, \\qquad z\\sim\\mathcal{N}(0,\\mathbf{I})\\ (t\\gt1),\\ z=0\\ (t=1) $$
       <p>One sampling step (Algorithm 2): denoise with $\\mu_\\theta$, then add fresh noise $\\sigma_t z$ except at the final step. The paper sets $\\sigma_t^2 = \\beta_t$ or $\\tilde\\beta_t$ (similar results).</p>`,
    whatItDoes:
      `<p>Each equation in turn:</p>
       <ul>
        <li><b>Forward step (Eq. 2):</b> one noising step keeps a $\\sqrt{1-\\beta_t}$ fraction of the point and
        adds Gaussian noise of variance $\\beta_t$; the full chain multiplies $T$ such steps.</li>
        <li><b>Closed form (Eq. 4):</b> you can jump straight to step $t$ &mdash; $x_t$ is a fixed blend
        $\\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$ of clean signal and fresh noise.</li>
        <li><b>Reverse process (Eq. 1):</b> generation is a chain of learned Gaussian steps starting from pure
        noise $p(x_T)$; each step's mean comes from the network.</li>
        <li><b>Variational bound (Eq. 3):</b> we cannot maximize the data likelihood directly, so we minimize an
        upper bound $L$ on its negative log &mdash; the same ELBO idea as the VAE.</li>
        <li><b>Posterior (Eqs. 6&ndash;7):</b> if you knew $x_0$, the true reverse step is a Gaussian with a
        known mean $\\tilde\\mu_t$ and variance $\\tilde\\beta_t$; $L$ asks the network to match it.</li>
        <li><b>$\\epsilon$-parameterization (Eq. 11):</b> rewrite that mean so the network only has to predict the
        noise $\\epsilon_\\theta$ &mdash; everything else is arithmetic.</li>
        <li><b>Weighted loss (Eq. 12):</b> the resulting per-step objective is a noise mean-squared error scaled
        by a $t$-dependent weight.</li>
        <li><b>$L_{\\text{simple}}$ (Eq. 14):</b> drop that weight. <b>Draw a clean point $x_0$, a random
        timestep $t$, fresh noise $\\epsilon$; build $x_t$; ask the network to predict that very $\\epsilon$;
        minimize the squared error</b> &mdash; averaged over all three random draws ($\\mathbb{E}_{t,x_0,\\epsilon}$).
        The double bars $\\lVert\\cdot\\rVert^2$ are the squared length of the error vector.</li>
        <li><b>Sampling step (Alg. 2):</b> denoise $x_t$ with the predicted noise, then add a little fresh noise
        $\\sigma_t z$ &mdash; except at the final step, which outputs the mean alone.</li>
       </ul>
       <p>The whole training signal is just a regression: predict the noise, minimize mean-squared error. No
       adversary, no balancing &mdash; the source of diffusion's training stability.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the full score/ELBO derivation is in the concept lesson.</b> Why does
       predicting noise give a valid generative model? The honest objective is the <b>variational bound</b> on
       the data log-likelihood (the same Evidence Lower BOund, or ELBO, idea behind the VAE in mod-vae): you
       cannot maximize $\\log p_\\theta(x_0)$ directly, so you maximize a tractable lower bound on it. The
       paper shows that bound breaks into per-timestep terms, and that each term is minimized by matching the
       reverse step's mean to the true "denoising" mean. Substituting the Eq. 11 noise parameterization turns
       that mean-matching into the <b>noise-MSE</b> of Eq. 12:</p>
       <p>$$ \\mathbb{E}_{x_0,\\epsilon}\\!\\left[\\frac{\\beta_t^2}{2\\sigma_t^2\\,\\alpha_t(1-\\bar\\alpha_t)}\\big\\lVert\\epsilon - \\epsilon_\\theta(x_t,t)\\big\\rVert^2\\right] \\qquad\\text{(Eq. 12)}. $$</p>
       <p>Eq. 14 simply <b>drops the per-timestep weight</b> in front. The paper reports this unweighted
       version is easier and gives better samples &mdash; it effectively down-weights very small-$t$ terms and
       lets the network focus on the harder, noisier steps. The link to <b>denoising score matching</b> (the
       network is learning the gradient of the log-density, the "score") and the full ELBO algebra are derived
       in the <b>mod-diffusion</b> concept lesson; we only recap here.</p>`,
    example:
      `<p>Work one <b>forward-noising step</b> by hand with a tiny 4-step schedule
       $\\beta = [0.1,\\,0.2,\\,0.3,\\,0.4]$, so $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0
       + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$ is concrete. First build the schedule: keep-fraction
       $\\alpha_t = 1-\\beta_t$, then the running product $\\bar\\alpha_t = \\alpha_1\\cdots\\alpha_t$ (each cell
       is the one above-left times its own $\\alpha$), and the two Eq. 4 mixing coefficients:</p>
       <table class="extable">
        <caption>The 4-step schedule. $\\bar\\alpha_t$ is the running product of $\\alpha$; it fades from $0.9$ toward $0.30$.</caption>
        <thead>
         <tr><th class="num">$t$</th><th class="num">$\\beta_t$</th><th class="num">$\\alpha_t$</th><th class="num">$\\bar\\alpha_t$</th><th class="num">$\\sqrt{\\bar\\alpha_t}$</th><th class="num">$\\sqrt{1-\\bar\\alpha_t}$</th></tr>
        </thead>
        <tbody>
         <tr><td class="num">1</td><td class="num">0.1</td><td class="num">0.9</td><td class="num">0.9</td><td class="num">0.9487</td><td class="num">0.3162</td></tr>
         <tr><td class="num">2</td><td class="num">0.2</td><td class="num">0.8</td><td class="num">0.72</td><td class="num">0.8485</td><td class="num">0.5292</td></tr>
         <tr><td class="num">3</td><td class="num">0.3</td><td class="num">0.7</td><td class="num">0.504</td><td class="num">0.7099</td><td class="num">0.7043</td></tr>
         <tr><td class="num">4</td><td class="num">0.4</td><td class="num">0.6</td><td class="num">0.3024</td><td class="num">0.5499</td><td class="num">0.8352</td></tr>
        </tbody>
       </table>
       <p>Now noise $x_0 = 2.0$ to timestep $t = 2$ with one noise draw $\\epsilon = 0.5$, reading the $t=2$ row
       ($\\bar\\alpha_2 = 0.72$):</p>
       <ul class="steps">
        <li><b>Clean part:</b> $\\sqrt{\\bar\\alpha_2}\\,x_0 = 0.848528 \\times 2.0 = 1.697056$.</li>
        <li><b>Noise part:</b> $\\sqrt{1-\\bar\\alpha_2}\\,\\epsilon = 0.529150 \\times 0.5 = 0.264575$.</li>
        <li><b>Mix</b> (Eq. 4): $x_2 = 1.697056 + 0.264575 = \\mathbf{1.961631}$.</li>
       </ul>
       <p>Read the two parts: about $1.70$ is the surviving clean signal and about $0.26$ is the injected
       noise. At $t=4$ the clean coefficient is only $\\sqrt{0.3024}\\approx 0.55$ (last table row), so the signal
       has faded much further. These exact numbers are recomputed in the notebook's first cell so you can check
       them by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build the schedule.</b> <code>betas = linspace(1e-4, 0.02, T)</code>;
        <code>alphas = 1 - betas</code>; <code>abar = cumprod(alphas)</code> (the $\\bar\\alpha_t$).</li>
        <li><b>Build the noise-predictor network</b> $\\epsilon_\\theta$: a small multilayer perceptron (a
        plain stack of <code>nn.Linear</code> layers) that takes the noisy point <i>and</i> the timestep and
        outputs a noise vector the same size as the data. (For images this is a tiny U-Net &mdash; built in
        paper-unet; here a 2-D toy uses an MLP.)</li>
        <li><b>Train</b> (Alg. 1): for each batch, draw clean $x_0$, random $t$, noise $\\epsilon$; form
        $x_t$ (Eq. 4); predict $\\hat\\epsilon = \\epsilon_\\theta(x_t,t)$; step on $L_{\\text{simple}} =
        \\lVert\\epsilon-\\hat\\epsilon\\rVert^2$ (Eq. 14).</li>
        <li><b>Sample</b> (Alg. 2): start from $x_T \\sim \\mathcal{N}(0,\\mathbf{I})$; for $t = T,\\dots,1$
        compute $x_{t-1} = \\frac{1}{\\sqrt{\\alpha_t}}\\big(x_t - \\frac{1-\\alpha_t}{\\sqrt{1-\\bar\\alpha_t}}\\epsilon_\\theta(x_t,t)\\big) + \\sigma_t z$
        (add fresh noise $z$ for $t\\gt1$, none at the last step).</li>
        <li><b>Print samples emerging from noise:</b> snapshot the points at a few timesteps and watch the
        cloud condense onto the data.</li>
        <li><b>Ablate:</b> remove the timestep input $t$ from the network and retrain &mdash; samples degrade,
        showing the network needs to know the noise level.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "On the unconditional CIFAR10 dataset, we obtain an Inception score of
       <b>9.46</b> and a state-of-the-art FID score of <b>3.17</b>. On 256&times;256 LSUN, we obtain sample
       quality similar to ProgressiveGAN." (Inception score and FID, Fr&eacute;chet Inception Distance, are
       standard image-quality metrics &mdash; higher Inception, lower FID is better.)</p>
       <p><i>These are the paper's reported figures, quoted from the abstract. The numbers in the CODEVIZ
       panel below are from our own tiny 2-D run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> For real images the paper scores samples with two standard
       distributional metrics &mdash; <b>FID</b> (Fr&eacute;chet Inception Distance, lower is better) and
       <b>Inception score</b> (higher is better) &mdash; on unconditional CIFAR-10. The "no-skill" anchor is a
       large FID (a model that outputs noise scores enormously high); the bar to beat is the paper's reported
       <b>FID 3.17 / Inception 9.46</b> on CIFAR-10. For the 2-D toy you cannot run Inception, so use a cheap
       proxy: the <b>fraction of samples within $0.4$ of one of the 8 cluster centers</b> and the
       <b>mean sample radius</b> (it should climb toward the ring radius $2.0$); a uniform-noise generator
       would land only a tiny fraction near a cluster.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> Verify $\\bar\\alpha_t$ is a <i>decreasing</i> product from
        near $1$ down toward $0$ (not a sum). Confirm the worked example reproduces exactly:
        $\\beta=[0.1,0.2,0.3,0.4]$, $x_0=2.0$, $t=2$, $\\epsilon=0.5 \\Rightarrow x_t \\approx 1.9616$.
        Check the loss is the MSE against the <i>same</i> $\\epsilon$ used to build $x_t$; at init the network
        outputs $\\approx 0$, so $L_{\\text{simple}} \\approx \\mathbb{E}\\lVert\\epsilon\\rVert^2 \\approx 2$
        (the data dimension; a rule of thumb, not a paper claim). Overfit a single tiny batch and watch the loss
        fall toward $0$ &mdash; if it cannot, the network or the $t$-conditioning is mis-wired. Confirm
        $\\epsilon_\\theta(x_t,t)$ returns the <b>same shape</b> as $x_t$.</li>
        <li><b>Expected range.</b> On the toy ring a correct build should put roughly $\\gt 0.9$ of samples within
        $0.4$ of a cluster with the mean radius near $2.0$ (the lesson's run got $\\approx 0.94$ &mdash; our small
        run, not a paper number). On CIFAR-10 a faithful scaled-up build should approach the paper's
        <b>FID $\\approx 3.17$</b> (arXiv:2006.11239, abstract; approximate). An FID many times larger, or a toy
        fraction near chance, signals a bug rather than tuning.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The central knob is <b>timestep
        conditioning</b>: drop $t$ from the network (feed a constant in its place) and retrain identically. The
        cluster-hit fraction should <b>drop</b> noticeably &mdash; one denoiser cannot invert every noise level
        without knowing which level it is at. If the metric does <i>not</i> fall, $t$ was never really being used.
        (A second ablation: predict $x_0$ instead of $\\epsilon$ and watch samples worsen.)</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Loss NaN</b> &rarr; learning rate too high or a
        $\\sqrt{\\cdot}$ of a negative/zero quantity (check the schedule). <b>Samples stay a diffuse blob</b>
        (radius never grows toward $2.0$) &rarr; the reverse/sampling step is wrong, or $\\bar\\alpha_t$ is a sum
        not a product. <b>All samples collapse onto one cluster</b> &rarr; mode collapse from too-few steps or a
        too-aggressive schedule. <b>Grainy final samples</b> &rarr; you added noise $\\sigma_t z$ at the last step
        ($t{=}1\\to0$) instead of outputting the mean alone. <b>Loss flat from step 0</b> &rarr; you regressed
        against a different noise draw than the one used to build $x_t$.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the building blocks already ship in PyTorch, so you
       <b>import</b> them and build only the novel diffusion machinery. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.SiLU</code>, the Adam optimizer, and <code>torch.randn</code>. <b>Build by hand:</b> the
       forward noising schedule ($\\beta_t,\\alpha_t,\\bar\\alpha_t$), the closed-form noising of Eq. 4, the
       small noise-predictor network, the $L_{\\text{simple}}$ loss (Eq. 14), and the sampling loop
       (Alg. 2). We train on a 2-D toy distribution (a ring of 8 Gaussian clusters) instead of images so it
       runs in seconds; the same loop with a U-Net and real images is how the picture models are trained. The
       ELBO/score derivation is recapped from the mod-diffusion concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Predicting the image instead of the noise.</b> The whole simplification is that the network
        outputs $\\epsilon$, the noise &mdash; not $x_0$ and not the mean. Train the MSE against the sampled
        $\\epsilon$, the same $\\epsilon$ you used to build $x_t$. Reusing a different noise draw breaks it.</li>
        <li><b>Forgetting to feed the timestep $t$ to the network.</b> The same $x_t$ value means different
        things at different noise levels, so $\\epsilon_\\theta$ <i>must</i> see $t$. Dropping it (the
        ablation) noticeably degrades samples.</li>
        <li><b>$\\bar\\alpha_t$ is a product, not a sum.</b> $\\bar\\alpha_t = \\prod_s \\alpha_s$
        (<code>cumprod</code>), the fraction of the <i>original</i> signal left. Using a running sum or
        forgetting the cumulative product scrambles every noise level.</li>
        <li><b>Adding noise at the last sampling step.</b> In Alg. 2 you add fresh noise $\\sigma_t z$ at
        every step <i>except</i> the final one ($t=1\\to0$): the last step outputs the mean only. Adding noise
        there leaves a grainy result.</li>
        <li><b>Too few steps or too aggressive a schedule.</b> If $\\beta_T$ is large or $T$ tiny, $x_T$ is
        not close to pure noise (or the reverse jumps are too big), and samples miss the data. The paper's
        small linear schedule over many steps is deliberate.</li>
      </ul>`,
    recall: [
      "Write the closed-form forward noising $x_t = \\\\sqrt{\\\\bar\\\\alpha_t}\\\\,x_0 + \\\\sqrt{1-\\\\bar\\\\alpha_t}\\\\,\\\\epsilon$ (Eq. 4) from memory.",
      "State the simplified loss $L_{\\\\text{simple}}$ (Eq. 14) and say what the network predicts.",
      "Define $\\\\beta_t$, $\\\\alpha_t$, and $\\\\bar\\\\alpha_t$ and how they relate.",
      "Why does diffusion train more stably than a GAN?",
      "In the sampling loop (Alg. 2), when do you NOT add fresh noise?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> Your trained model samples cleanly onto the 8 clusters. Now remove the
            timestep input $t$ from the network (feed only $x_t$) and retrain everything else identically.
            What happens to the samples, and what does that show?`,
        steps: [
          { do: `Change the network so it ignores $t$ (e.g. always pass a constant in place of the timestep feature); keep architecture width, schedule, optimizer, data, and steps the same.`, why: `An honest ablation changes exactly one thing &mdash; the timestep conditioning &mdash; so any difference is attributable to it.` },
          { do: `Retrain and sample. The points no longer settle tightly onto the 8 clusters: they stay diffuse or smear between modes.`, why: `The <i>same</i> noisy value $x_t$ needs a different correction depending on how noisy it is. Without $t$, $\\epsilon_\\theta$ cannot tell an early (slightly noisy) step from a late (very noisy) one, so it predicts a blurry average.` },
          { do: `Conclude that the timestep conditioning, not just the network capacity, is what lets one network invert the whole schedule.`, why: `One denoiser must handle all noise levels; $t$ is how it knows which level it is at.` }
        ],
        answer: `<p>Samples degrade &mdash; the cloud fails to condense cleanly onto the 8 clusters and instead
                 stays spread out or smears between modes. Because the timestep is the only thing removed, this
                 isolates <b>timestep conditioning</b> as essential: a single network must invert <i>every</i>
                 noise level, and $t$ tells it which level it is undoing. (The CODE includes this ablation.)</p>`
      },
      {
        q: `Using the worked schedule $\\beta = [0.1, 0.2, 0.3, 0.4]$, noise a point $x_0 = 1.0$ to timestep
            $t = 4$ with noise $\\epsilon = -1.0$. What is $x_4$, and what does each part represent?`,
        steps: [
          { do: `Recall $\\bar\\alpha_4 = 0.9 \\times 0.8 \\times 0.7 \\times 0.6 = 0.3024$.`, why: `$\\bar\\alpha_t$ is the running product of $\\alpha_s = 1-\\beta_s$; at $t=4$ it is the full product.` },
          { do: `Coefficients: $\\sqrt{0.3024} \\approx 0.5499$ and $\\sqrt{1 - 0.3024} = \\sqrt{0.6976} \\approx 0.8352$.`, why: `Eq. 4 weights the clean part by $\\sqrt{\\bar\\alpha_t}$ and the noise by $\\sqrt{1-\\bar\\alpha_t}$.` },
          { do: `Mix: $x_4 = 0.5499 \\times 1.0 + 0.8352 \\times (-1.0) = 0.5499 - 0.8352 = -0.2853$.`, why: `Plugging into $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$.` }
        ],
        answer: `<p>$x_4 \\approx -0.285$. The first piece $0.5499 \\times 1.0 \\approx 0.55$ is the <b>surviving
                 clean signal</b> (only ~$0.55$ of the original $1.0$ is left this deep into the schedule); the
                 second piece $0.8352 \\times (-1.0) \\approx -0.84$ is the <b>injected noise</b>, now the
                 dominant part &mdash; which is exactly why late-$t$ points look almost like pure noise.</p>`
      },
      {
        q: `Why is the network trained to predict the <i>noise</i> $\\epsilon$ rather than the clean point
            $x_0$ directly? Both are recoverable from each other given $x_t$.`,
        steps: [
          { do: `Note from Eq. 4 that $x_0 = (x_t - \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon)/\\sqrt{\\bar\\alpha_t}$, so predicting $\\epsilon$ and predicting $x_0$ are algebraically interchangeable.`, why: `Given $x_t$ and the schedule, knowing one determines the other.` },
          { do: `Consider the target's scale across timesteps: $\\epsilon$ is always unit-variance Gaussian noise, the same scale for every $t$. The implied $x_0$ correction is not.`, why: `A constant-scale target is easier to regress; the loss is well-conditioned at every noise level.` },
          { do: `Recall the paper's empirical result: substituting the $\\epsilon$ parameterization (Eq. 11) and the unweighted MSE (Eq. 14) gave better samples than the direct alternatives.`, why: `Theory (score matching) and practice both favor the noise target.` }
        ],
        answer: `<p>They are interchangeable in principle (Eq. 4 relates them), but predicting $\\epsilon$ gives a
                 <b>fixed-scale, well-conditioned target</b> &mdash; standard Gaussian noise at every timestep
                 &mdash; and connects the loss to denoising <b>score matching</b>. The paper found this
                 parameterization (Eq. 11) plus the unweighted MSE (Eq. 14) simply trains better and produces
                 higher-quality samples.</p>`
      }
    ]
  });

  window.CODE["paper-ddpm"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the forward noising schedule, a small noise-predictor network, the
       simplified loss (Eq. 14), and the sampling loop (Alg. 2) by hand on top of <code>nn.Linear</code>. We
       train on a 2-D toy distribution &mdash; a ring of <b>8 Gaussian clusters</b> (8 modes) &mdash; so it
       runs in seconds. The first cell recomputes the worked example ($\\beta=[0.1,0.2,0.3,0.4]$,
       $x_0=2.0$, $t=2$, $\\epsilon=0.5 \\Rightarrow x_2 \\approx 1.9616$). Training minimizes
       $\\lVert\\epsilon - \\epsilon_\\theta(x_t,t)\\rVert^2$ (Eq. 14). Sampling starts from pure noise and we
       <b>print samples emerging</b> by snapshotting the cloud's mean radius as it condenses onto the
       ring. Finally an <b>ablation</b> removes the timestep input and shows the samples degrade. Paste into
       Colab and run.</p>`,
    code: `import torch, torch.nn as nn, math
torch.manual_seed(0)

# --- 0. Sanity-check the worked example: Eq. 4 on a tiny 4-step schedule. ---
betas_demo = torch.tensor([0.1, 0.2, 0.3, 0.4])
alphas_demo = 1 - betas_demo
abar_demo = torch.cumprod(alphas_demo, 0)          # running product: alpha-bar
x0, eps, t = torch.tensor(2.0), torch.tensor(0.5), 2
ab = abar_demo[t - 1]                              # alpha-bar_2 = 0.72
xt = ab.sqrt() * x0 + (1 - ab).sqrt() * eps         # Eq. 4
print("alpha-bar:", [round(v, 4) for v in abar_demo.tolist()])   # [0.9, 0.72, 0.504, 0.3024]
print("worked x_t (t=2):", round(xt.item(), 6))                  # 1.961631


# --- 1. The forward noising schedule (built by hand). ---
T = 50
betas  = torch.linspace(1e-4, 0.02, T)             # small linear variance schedule
alphas = 1 - betas
abar   = torch.cumprod(alphas, 0)                  # alpha-bar_t = prod_{s<=t} alpha_s


# --- 2. A 2-D toy distribution: 8 Gaussian clusters on a ring (8 modes). ---
def sample_data(n):
    k = torch.randint(0, 8, (n,))
    ang = k.float() / 8 * 2 * math.pi
    centers = torch.stack([torch.cos(ang), torch.sin(ang)], 1) * 2.0
    return centers + torch.randn(n, 2) * 0.15


# --- 3. The noise predictor eps_theta(x_t, t): a small MLP. use_t toggles the ablation. ---
class Denoiser(nn.Module):
    def __init__(self, h=128, use_t=True):
        super().__init__()
        self.use_t = use_t
        self.net = nn.Sequential(nn.Linear(2 + 1, h), nn.SiLU(),
                                 nn.Linear(h, h), nn.SiLU(),
                                 nn.Linear(h, h), nn.SiLU(),
                                 nn.Linear(h, 2))
    def forward(self, x, t):
        te = (t.float() / T).unsqueeze(1)
        if not self.use_t:
            te = torch.zeros_like(te)              # ablation: hide the timestep
        return self.net(torch.cat([x, te], 1))


def train(use_t=True, steps=3000):
    torch.manual_seed(0)
    net = Denoiser(use_t=use_t)
    opt = torch.optim.Adam(net.parameters(), lr=1e-3)
    for step in range(steps):
        x0  = sample_data(512)
        tb  = torch.randint(0, T, (512,))          # random timesteps (Alg. 1)
        eps = torch.randn_like(x0)                 # the noise to predict
        ab  = abar[tb].unsqueeze(1)
        xt  = ab.sqrt() * x0 + (1 - ab).sqrt() * eps   # Eq. 4: forward-noise in one shot
        loss = ((eps - net(xt, tb)) ** 2).mean()       # Eq. 14: L_simple (predict the noise)
        opt.zero_grad(); loss.backward(); opt.step()
        if step % 500 == 0:
            print(f"  step {step:4d}  loss {loss.item():.4f}")
    return net


# --- 4. Sampling (Algorithm 2): start from noise, denoise step by step. ---
@torch.no_grad()
def sample(net, n=500, snapshot_at=(40, 30, 20, 10, 0)):
    x = torch.randn(n, 2)                          # x_T ~ N(0, I): pure noise
    snaps = {}
    for t in reversed(range(T)):                   # t = T-1, ..., 0
        tb  = torch.full((n,), t, dtype=torch.long)
        eps = net(x, tb)
        a, ab = alphas[t], abar[t]
        mean = (1 / a.sqrt()) * (x - ((1 - a) / (1 - ab).sqrt()) * eps)   # Eq. 11 / Alg. 2
        x = mean + betas[t].sqrt() * torch.randn_like(x) if t > 0 else mean  # no noise at last step
        if t in snapshot_at:
            snaps[t] = x.clone()
    return x, snaps


print("TRAIN (with timestep):")
net = train(use_t=True)
samples, snaps = sample(net)

# distance of each sample to the nearest of the 8 cluster centers -> did it find the ring?
ang   = torch.arange(8).float() / 8 * 2 * math.pi
modes = torch.stack([torch.cos(ang), torch.sin(ang)], 1) * 2.0
d = torch.cdist(samples, modes).min(1).values
print("\\nfrac of samples within 0.4 of a cluster:", round((d < 0.4).float().mean().item(), 3))
print("PRINT samples emerging from noise (mean radius should grow toward 2.0):")
for t in (40, 30, 20, 10, 0):
    r = snaps[t].norm(dim=1).mean().item()
    print(f"  t={t:2d}  mean radius {r:.3f}")
# Typical: ~0.94 of samples land on a cluster; radius climbs ~1.5 -> ~2.0 as noise is removed.
# (Our small run -- not the paper's reported number.)

# --- 5. ABLATION: drop the timestep input, retrain, resample. Samples get worse. ---
print("\\nABLATION (no timestep input):")
net_no_t = train(use_t=False)
samp_no_t, _ = sample(net_no_t)
d2 = torch.cdist(samp_no_t, modes).min(1).values
print("frac within 0.4 of a cluster, NO timestep:", round((d2 < 0.4).float().mean().item(), 3))
# Lower fraction: without t the one network cannot tell which noise level it is undoing.`
  };

  window.CODEVIZ["paper-ddpm"] = {
    question: "Starting from pure noise, do the reverse (denoising) steps pull the cloud back onto the 8 data clusters?",
    charts: [
      {
        type: "scatter",
        title: "Samples denoising over reverse steps (ours, labeled): noise → ring of 8 clusters",
        xlabel: "x1",
        ylabel: "x2",
        groups: [
          { name: "t=49 (≈ pure noise)", color: "#ff7b72", points: [[-0.867,0.488],[1.013,-1.371],[-0.176,0.237],[-0.726,-1.02],[0.984,-0.481],[-1.695,-0.472],[0.661,1.006],[0.184,0.828],[-1.894,-0.14],[1.9,-0.325],[0.112,0.901],[1.195,-0.733],[-0.074,-0.407],[-1.88,-0.271],[-2.049,0.736],[-1.014,-1.358],[-0.062,-0.387],[0.112,2.345],[0.997,-0.73],[-0.746,-0.787],[-1.331,1.108],[1.502,-1.14],[-0.172,-0.234],[0.523,0.329],[-0.208,-0.409],[0.192,-0.308],[-2.722,-1.102],[-0.173,0.839],[1.679,0.022],[-0.447,-2.198],[1.076,-0.359],[-0.552,0.779],[0.166,0.201],[-0.513,0.74],[-1.191,-1.823],[-0.307,-0.738],[-1.167,1.332],[0.39,-0.165],[-0.684,-0.413],[-0.987,0.636],[-2.254,0.416],[0.321,0.492],[-0.049,-1.194],[1.735,0.981],[-0.327,-0.147],[0.981,0.816],[-0.675,0.023],[0.441,1.533],[-0.685,0.978],[1.231,-1.07],[0.339,-0.11],[-0.424,0.263],[0.557,1.888],[-1.059,2.11],[0.524,-0.182],[0.555,-1.247],[-1.225,-0.278],[0.541,-0.09],[-0.57,-0.566],[0.691,0.741]] },
          { name: "t=16 (mid-denoise)", color: "#d29922", points: [[-1.991,-0.436],[2.059,-1.198],[0.108,2.082],[-0.434,-2.408],[2.177,-0.339],[-1.788,-0.462],[0.188,1.531],[0.421,1.233],[-1.893,-0.025],[2.084,0.55],[-0.076,1.205],[2.293,-0.403],[-1.463,1.282],[-2.161,-0.046],[-1.265,0.383],[-0.932,-1.595],[0.119,-1.872],[-0.431,1.72],[0.557,-1.799],[-1.561,-1.379],[-1.745,1.447],[1.849,-0.092],[-1.478,-0.19],[1.447,1.501],[-1.781,-0.246],[1.167,-1.48],[-1.883,-1.544],[-1.309,1.353],[1.126,-1.765],[0.011,-1.954],[2.038,0.163],[-1.786,0.363],[1.502,0.966],[-1.532,1.029],[-1.231,-1.336],[-1.501,-0.41],[-1.771,1.816],[2.339,-0.032],[-1.714,0.069],[-1.615,-0.245],[-2.084,0.569],[-0.371,1.406],[0.175,-1.783],[1.367,0.831],[-1.08,-1.198],[1.171,1.507],[-1.737,0.178],[0.343,1.582],[1.067,-0.426],[1.442,-1.522],[-0.205,-1.602],[-1.765,0.167],[1.324,1.31],[-1.62,1.139],[1.048,-0.749],[1.492,-1.123],[-1.742,-1.186],[1.202,-1.265],[-1.785,-0.115],[1.82,0.805]] },
          { name: "t=0 (final samples)", color: "#7ee787", points: [[-1.888,-0.349],[1.66,-1.456],[0.071,2.012],[-0.055,-2.007],[2.085,-0.155],[-2.117,-0.041],[0.077,1.851],[0.037,1.752],[-2.093,-0.351],[2.158,0.015],[-0.04,1.657],[2.058,-0.06],[-1.42,1.415],[-2.164,-0.029],[-1.49,0.228],[-1.332,-1.446],[-0.222,-2.235],[0.023,1.799],[0.206,-2.185],[-1.23,-1.475],[-1.446,1.589],[2.226,0.005],[-1.765,-0.109],[1.441,1.634],[-1.975,-0.123],[1.398,-1.594],[-1.543,-1.439],[-1.315,1.286],[1.528,-1.773],[-0.067,-1.827],[1.803,0.175],[-1.874,0.284],[1.264,1.159],[-1.565,1.278],[-1.438,-1.436],[-1.793,-0.227],[-1.726,1.65],[2.101,-0.115],[-1.834,0.004],[-1.788,-0.345],[-1.943,0.263],[-0.118,1.68],[0.063,-2.092],[1.477,1.161],[-1.337,-1.317],[1.41,1.514],[-1.838,0.204],[0.005,1.682],[1.493,-0.214],[1.547,-1.724],[-0.01,-1.842],[-1.905,0.032],[1.225,1.329],[-1.344,1.249],[1.498,-1.259],[1.585,-1.374],[-1.454,-1.458],[1.405,-1.351],[-1.778,0.218],[1.93,0.543]] },
          { name: "8 data clusters", color: "#4ea1ff", points: [[2.0,0.0],[1.414,1.414],[0.0,2.0],[-1.414,1.414],[-2.0,0.0],[-1.414,-1.414],[0.0,-2.0],[1.414,-1.414]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A noise-predictor MLP trained with the simplified loss (Eq. 14) on a 2-D ring of 8 Gaussian clusters, then sampled with Algorithm 2. Red = the starting cloud near pure noise (t=49), a featureless blob; orange = midway through denoising (t=16), already pulling toward the ring; green = the final samples (t=0), tightly seated on the 8 blue cluster centers. In this run ~94% of samples land within 0.4 of a cluster and the mean radius climbs from ~1.5 toward the ring radius 2.0 as noise is removed — structure emerging from noise, exactly what the reverse process is trained to do.",
    code: `import torch, torch.nn as nn, math
torch.manual_seed(0)

T = 50
betas  = torch.linspace(1e-4, 0.02, T)
alphas = 1 - betas
abar   = torch.cumprod(alphas, 0)

def sample_data(n):
    k = torch.randint(0, 8, (n,))
    ang = k.float() / 8 * 2 * math.pi
    return torch.stack([torch.cos(ang), torch.sin(ang)], 1) * 2.0 + torch.randn(n, 2) * 0.15

class Denoiser(nn.Module):
    def __init__(self, h=128):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(3, h), nn.SiLU(), nn.Linear(h, h), nn.SiLU(),
                                 nn.Linear(h, h), nn.SiLU(), nn.Linear(h, 2))
    def forward(self, x, t):
        return self.net(torch.cat([x, (t.float() / T).unsqueeze(1)], 1))

net = Denoiser(); opt = torch.optim.Adam(net.parameters(), lr=1e-3)
for _ in range(3000):                              # train on Eq. 14
    x0 = sample_data(512); tb = torch.randint(0, T, (512,)); eps = torch.randn_like(x0)
    ab = abar[tb].unsqueeze(1)
    xt = ab.sqrt() * x0 + (1 - ab).sqrt() * eps
    loss = ((eps - net(xt, tb)) ** 2).mean()
    opt.zero_grad(); loss.backward(); opt.step()

@torch.no_grad()                                   # Algorithm 2: sample, snapshot the cloud
def sample(n=500, snap=(49, 16, 0)):
    x = torch.randn(n, 2); snaps = {}
    for t in reversed(range(T)):
        tb = torch.full((n,), t, dtype=torch.long); e = net(x, tb)
        a, ab = alphas[t], abar[t]
        mean = (1 / a.sqrt()) * (x - ((1 - a) / (1 - ab).sqrt()) * e)
        x = mean + betas[t].sqrt() * torch.randn_like(x) if t > 0 else mean
        if t in snap: snaps[t] = x[:60].clone()
    return snaps

torch.manual_seed(7)
snaps = sample()
for t in (49, 16, 0):
    print(f"t={t:2d}", [[round(p[0].item(), 3), round(p[1].item(), 3)] for p in snaps[t][:5]], "...")
# t=49 -> diffuse blob; t=16 -> pulling toward the ring; t=0 -> seated on the 8 clusters.`
  };
})();
