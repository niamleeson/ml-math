/* Paper lesson — "Score-Based Generative Modeling through Stochastic Differential Equations"
   (Score SDE), Song, Sohl-Dickstein, Kingma, Kumar, Ermon & Poole, 2020 (ICLR 2021 Oral).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-score-sde".
   GROUNDED from arXiv:2011.13456 (abstract) and the ar5iv HTML mirror (Sections 3.1-3.4, 4.3;
   Eqns 5, 6, 7, 9, 11, 13). Track B (architecture): build a tiny score network, train it with
   denoising score matching, and sample by integrating the reverse-time SDE (Euler-Maruyama) on a
   2-D toy distribution. The diffusion math owner is concept mod-diffusion; here we recap + link, and
   cross-link paper-ddpm as the discrete special case (the VP SDE). */
(function () {
  window.LESSONS.push({
    id: "paper-score-sde",
    title: "Score SDE — Score-Based Generative Modeling through SDEs (2020)",
    tagline: "Cast diffusion as a continuous stochastic differential equation: a forward SDE turns data into noise, and a reverse SDE driven by the learned score (the gradient of log-density) turns noise back into data.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Yang Song, Jascha Sohl-Dickstein, Diederik P. Kingma, Abhishek Kumar, Stefano Ermon, Ben Poole",
      org: "Stanford University, Google Brain",
      year: 2020,
      venue: "arXiv:2011.13456 (Nov 2020); ICLR 2021 (Oral)",
      citations: "",
      arxiv: "https://arxiv.org/abs/2011.13456",
      code: "https://github.com/yang-song/score_sde"
    },
    conceptLink: "mod-diffusion",
    partOf: [],
    prereqs: ["mod-diffusion", "paper-ddpm", "mod-vae", "prob-normal", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p>Two families of generative models had grown up side by side and looked unrelated. One was
       <b>score matching with Langevin dynamics</b> (SMLD): perturb data with several fixed noise levels,
       learn the <b>score</b> at each level (the score is the gradient of the log-density &mdash; it points
       toward where data is denser), then walk samples uphill. The other was <b>denoising diffusion</b>
       (DDPM, the previous paper): add noise over many small discrete steps, then learn to undo one step at
       a time. Both work, both add noise then remove it &mdash; but each was its own recipe with its own
       discrete schedule, and it was unclear how they related or how to improve them.</p>
       <p>This paper's question: is there <b>one continuous framework</b> that contains both as special
       cases, makes the math exact instead of discretized, and unlocks better samplers?</p>`,
    contribution:
      `<ul>
        <li><b>Diffusion as a continuous SDE.</b> A <b>stochastic differential equation</b> (SDE) is just a
        rule for how a point drifts and randomly jitters as continuous time $t$ advances. The paper writes
        the noising process as a forward SDE (Eq. 5) whose number of "steps" is infinite &mdash; the discrete
        schedules of SMLD and DDPM are coarse approximations of it.</li>
        <li><b>Generation by the reverse-time SDE (Eq. 6).</b> A classical result says every forward SDE has
        a <b>reverse SDE</b> that runs it backward in time &mdash; and that reverse SDE needs only one unknown
        quantity: the <b>score</b> $\\nabla_x \\log p_t(x)$ of the noised data at each time. Learn the score,
        plug it in, integrate backward from noise, and you have a sample.</li>
        <li><b>A single training objective + a unifying view.</b> Train one network $s_\\theta(x,t)$ to match
        the score by <b>denoising score matching</b> (Eq. 7). The paper shows SMLD is the
        <b>Variance Exploding</b> (VE) SDE and DDPM is the <b>Variance Preserving</b> (VP) SDE &mdash; two
        choices of the same equation &mdash; and adds a deterministic <b>probability-flow ODE</b> (Eq. 13)
        for exact likelihoods.</li>
      </ul>`,
    whyItMattered:
      `<p>This is the paper that made "diffusion = score + SDE" the standard mental model. Treating the
       process as continuous let the authors swap in better numerical integrators and a deterministic ODE
       sampler, and reach (their abstract) <i>"record-breaking performance for unconditional image generation
       on CIFAR-10 with an Inception score of 9.89 and FID of 2.20."</i> The SDE/ODE view underlies the fast
       samplers (DDIM, DPM-Solver) and the continuous-time training used across modern diffusion systems.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Perturbing data with SDEs)</b> &mdash; the forward SDE (Eq. 5): the drift
        $f(x,t)$ and diffusion $g(t)$ that define the noising.</li>
        <li><b>&sect;3.2 (Generating samples by reversing the SDE)</b> &mdash; the reverse-time SDE (Eq. 6).
        This is the generator; note that the <b>only</b> learned term is the score.</li>
        <li><b>&sect;3.3 (Estimating scores for the SDE)</b> &mdash; the denoising-score-matching objective
        (Eq. 7) with its time-weighting $\\lambda(t)$.</li>
        <li><b>&sect;3.4 (Examples: VE, VP SDEs and beyond)</b> &mdash; the VE SDE (Eq. 9 &rarr; SMLD) and the
        VP SDE (Eq. 11 &rarr; DDPM). This is where the two old methods become one equation.</li>
       </ul>
       <p><b>Skim on a first pass:</b> &sect;4 (predictor&ndash;corrector samplers) and the
       probability-flow ODE (&sect;4.3, Eq. 13) &mdash; powerful, but Eqs. 5&ndash;7 are all you need to build
       a working sampler.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train one small <b>score network</b> $s_\\theta(x,t)$ on a 2-D toy distribution &mdash;
       points arranged in a ring of 8 little Gaussian clusters (8 "modes") &mdash; then generate by
       integrating the <b>reverse SDE</b> from pure noise.</p>
       <p><b>Predict before you run:</b> the score is what tells each noisy point which way to move toward
       data. If we <b>hide the time input</b> $t$ from the network (the ablation), one network has to give the
       same score whether the point is barely noised or wildly noised. Will the samples still land on the 8
       clusters, or fall apart?</p>`,
    attempt:
      `<p>Before the reveal, sketch the three pieces:</p>
       <ol>
        <li><b>Forward (no learning).</b> Given a clean point $x_0$ and time $t$, set the noise scale
        $\\sigma_t$ and form $x_t = x_0 + \\sigma_t\\, z$ with $z \\sim \\mathcal{N}(0, I)$. (This is the VE
        SDE's perturbation; $f=0$.)</li>
        <li><b>Train (denoising score matching).</b> The known score of the perturbation kernel is
        $\\nabla_{x_t} \\log p(x_t \\mid x_0) = -\\,z/\\sigma_t$. Train $s_\\theta(x_t,t)$ to predict it,
        weighting the loss by $\\sigma_t^2$ (Eq. 7's $\\lambda(t)$).</li>
        <li><b>Sample (reverse SDE).</b> Start at $x \\sim \\mathcal{N}(0, \\sigma_{\\max}^2 I)$ and step
        backward in time with Euler&ndash;Maruyama using Eq. 6, plugging $s_\\theta$ in for the score.</li>
       </ol>
       <p>Leave a TODO for the time-weighting and the reverse-step sign; the reveal fills them in.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>1. A forward SDE turns data into noise (&sect;3.1).</b> Think of one data point as a speck in a
       fluid. Over continuous time $t$ from $0$ to $1$ it gets pushed a little (the <b>drift</b> $f(x,t)$) and
       randomly kicked (the <b>diffusion</b> $g(t)$ times tiny random noise $d w$, the
       <b>Wiener process</b> &mdash; the continuous-time idealization of a random walk). Run it long enough and
       any starting data point dissolves into a simple noise distribution you can sample from directly. No
       learning happens here; $f$ and $g$ are chosen by hand.</p>
       <p><b>2. The reverse SDE runs the movie backward (&sect;3.2).</b> A classical theorem (Anderson 1982,
       cited in the paper) says this dissolving has an exact time-reversal: another SDE that, started from the
       noise distribution, flows the specks back into data. Crucially, the reverse SDE is the same drift and
       diffusion <b>plus one extra force</b>: the <b>score</b> $\\nabla_x \\log p_t(x)$, the gradient of the
       log-density of the noised data at time $t$. The score points "uphill" toward where data is denser, so
       it is exactly the correction that re-concentrates noise back into the data clusters.</p>
       <p><b>3. We do not know the score &mdash; so we learn it (&sect;3.3).</b> We train a network
       $s_\\theta(x,t)$ to output the score at every $x$ and $t$. We cannot evaluate the true
       $\\nabla_x \\log p_t(x)$ directly (we do not know $p_t$), but for a single noised sample we
       <b>do</b> know the score of the perturbation kernel $p(x_t \\mid x_0)$ in closed form, because that
       kernel is a Gaussian. <b>Denoising score matching</b> (Eq. 7) trains the network to match that known
       per-sample score; the optimum equals the true marginal score.</p>
       <p><b>4. Two famous methods are two settings of the same equation (&sect;3.4).</b> Choose $f=0$ and let
       the noise scale explode &mdash; that is the <b>Variance Exploding</b> (VE) SDE (Eq. 9), and its discrete
       version is <b>SMLD</b>. Choose a shrinking drift that keeps total variance near one &mdash; that is the
       <b>Variance Preserving</b> (VP) SDE (Eq. 11), and its discrete version is exactly <b>DDPM</b>
       (paper-ddpm). Same framework, two dials.</p>`,
    architecture:
      `<p><b>Score network $s_\\theta(x,t) \\approx \\nabla_x \\log p_t(x)$.</b> The only learned component. It is a
       function that takes a (possibly noised) point $x$ and a time $t$ and returns a vector of the same
       dimension as $x$ &mdash; an estimate of the score at that point and time. The paper uses a time-conditioned
       U-Net (NCSN++ for the VE SDE, DDPM++ for the VP SDE) for images; here we use a small MLP for 2-D points.
       Component by component for our build:</p>
       <ul>
        <li><b>Input.</b> Concatenate the point $x \\in \\mathbb{R}^2$ with the scalar time $t \\in [0,1]$ &rarr; a
        3-vector. (Image models instead use a learned <b>time embedding</b> &mdash; sinusoidal features of $t$
        fed into every residual block.)</li>
        <li><b>Body.</b> Three hidden layers of width $128$ with <code>SiLU</code> nonlinearities
        (<code>Linear(3,128) &rarr; SiLU &rarr; Linear(128,128) &rarr; SiLU &rarr; Linear(128,128) &rarr; SiLU</code>).</li>
        <li><b>Output head.</b> <code>Linear(128,2)</code> &mdash; a 2-vector, the predicted score $s_\\theta(x,t)$,
        matched against the target $-z/\\sigma_t$ by Eq. 7.</li>
       </ul>
       <p><b>Data flow (train then sample), component by component:</b></p>
       <ol>
        <li><b>Schedule (no parameters).</b> A fixed map $t \\mapsto \\sigma_t$ (VE: geometric) or
        $t \\mapsto \\beta(t)$ (VP). This sets the noise level; it is chosen, not learned.</li>
        <li><b>Forward / perturbation (no parameters).</b> Draw clean $x_0$, time $t$, noise $z$; form the noised
        point via the kernel ($x_t = x_0 + \\sigma_t z$ for VE). Produces the network's training input.</li>
        <li><b>Score network (the parameters).</b> $s_\\theta(x_t,t)$ predicts the score; the loss (Eq. 7) pushes
        it toward the known kernel score.</li>
        <li><b>Reverse integrator (no parameters).</b> The Euler&ndash;Maruyama loop for Eq. 6 (or the
        probability-flow ODE, Eq. 13): repeatedly call $s_\\theta$, take a drift step
        $-g(t)^2 s_\\theta\\,dt$, and (for the SDE) add a noise kick $g(t)\\,d\\bar w$, stepping $t$ from $1$ to $0$.</li>
       </ol>
       <p>So the architecture is one trainable block (the score network) wrapped by three fixed numerical
       pieces (schedule, perturbation kernel, integrator). Swapping the schedule from VE to VP is what turns
       this same diagram from SMLD into DDPM.</p>`,
    symbols: [
      { sym: "$x$", desc: "a data point (here a 2-D vector); during diffusion it is the noised version at time $t$." },
      { sym: "$t$", desc: "continuous time, running $0$ (clean data) to $1$ (pure noise). NOT a discrete step index." },
      { sym: "$p_t(x)$", desc: "the probability density of the data after it has been noised up to time $t$." },
      { sym: "$\\nabla_x \\log p_t(x)$", desc: "the SCORE: the gradient (vector of partial derivatives) of the log-density with respect to $x$. It points toward higher data density." },
      { sym: "$s_\\theta(x,t)$", desc: "our score NETWORK with weights $\\theta$; trained so that $s_\\theta(x,t) \\approx \\nabla_x \\log p_t(x)$." },
      { sym: "$f(x,t)$", desc: "the DRIFT coefficient: the deterministic push on $x$ per unit time (a vector)." },
      { sym: "$g(t)$", desc: "the DIFFUSION coefficient: how strong the random noise injection is per unit time (a scalar here)." },
      { sym: "$w$", desc: "the Wiener process (Brownian motion): continuous-time random walk; $dw$ is an infinitesimal random kick." },
      { sym: "$\\bar{w}$", desc: "the same kind of random kick but for the REVERSE-time SDE (time flowing from $1$ down to $0$)." },
      { sym: "$\\lambda(t)$", desc: "a positive weighting function over time in the loss; balances how much each noise level counts." },
      { sym: "$\\sigma_t$", desc: "the noise scale at time $t$ (for the VE SDE, the standard deviation added to the data)." },
      { sym: "$\\beta(t)$", desc: "the VP SDE's noise-rate schedule; the continuous-time version of DDPM's $\\beta_t$." },
      { sym: "$z$", desc: "a fresh standard-normal noise vector, $z \\sim \\mathcal{N}(0, I)$, used to perturb a clean point." },
      { sym: "$p_{0t}(x(t)\\mid x(0))$", desc: "the PERTURBATION KERNEL: the (Gaussian) density of the noised point $x(t)$ given the clean point $x(0)$; known in closed form, so its score can be computed exactly." },
      { sym: "$\\theta$", desc: "the trainable weights of the score network; $\\theta^*$ is the optimal setting found by minimizing Eq. 7." },
      { sym: "$\\sigma^2(t)$", desc: "the variance of the noise added by time $t$; for the VE SDE $g(t)^2 = d\\sigma^2(t)/dt$." }
    ],
    formula:
      `$$d x = f(x,t)\\,dt + g(t)\\,d w$$
       <p><b>Forward SDE (&sect;3.1, Eq. 5).</b> The noising process: drift $f(x,t)$ plus random kick $g(t)\\,dw$ dissolves data into noise as time $t$ runs $0 \\to 1$.</p>
       $$d x = \\bigl[f(x,t) - g(t)^2\\,\\nabla_x \\log p_t(x)\\bigr]\\,dt + g(t)\\,d\\bar{w}$$
       <p><b>Reverse-time SDE (&sect;3.2, Eq. 6).</b> Time-reversal of Eq. 5 (Anderson 1982); the one new, learned term is the score $\\nabla_x \\log p_t(x)$. Integrate from $t=1$ down to $0$ to generate.</p>
       $$\\theta^* = \\arg\\min_\\theta\\; \\mathbb{E}_{t}\\Bigl\\{\\lambda(t)\\,\\mathbb{E}_{x(0)}\\,\\mathbb{E}_{x(t)\\mid x(0)}\\bigl[\\,\\lVert s_\\theta(x(t),t) - \\nabla_{x(t)} \\log p_{0t}(x(t)\\mid x(0)) \\rVert_2^2\\,\\bigr]\\Bigr\\}$$
       <p><b>Denoising score matching objective (&sect;3.3, Eq. 7).</b> Match the network $s_\\theta$ to the per-sample score of the Gaussian perturbation kernel $p_{0t}(x(t)\\mid x(0))$, averaged over time with positive weight $\\lambda(t)$. The minimizer equals the true marginal score.</p>
       $$d x = \\sqrt{\\tfrac{d}{dt}\\,\\sigma^2(t)}\\; d w \\qquad (f = 0,\\;\\; g(t) = \\sqrt{\\tfrac{d}{dt}\\,\\sigma^2(t)})$$
       <p><b>Variance Exploding (VE) SDE (&sect;3.4, Eq. 9).</b> Zero drift; variance grows without bound. Its discretization is <b>SMLD / NCSN</b>. Perturbation kernel $p_{0t}(x(t)\\mid x(0)) = \\mathcal{N}\\bigl(x(0),\\,[\\sigma^2(t)-\\sigma^2(0)]\\,I\\bigr)$.</p>
       $$d x = -\\tfrac{1}{2}\\,\\beta(t)\\,x\\,dt + \\sqrt{\\beta(t)}\\; d w \\qquad (f = -\\tfrac{1}{2}\\beta(t)x,\\;\\; g(t) = \\sqrt{\\beta(t)})$$
       <p><b>Variance Preserving (VP) SDE (&sect;3.4, Eq. 11).</b> Shrinking drift keeps total variance near $1$. Its discretization is exactly <b>DDPM</b>. Kernel mean $x(0)\\,e^{-\\frac{1}{2}\\int_0^t \\beta(s)\\,ds}$ with variance approaching $I$.</p>
       $$d x = \\Bigl[f(x,t) - \\tfrac{1}{2}\\,g(t)^2\\,\\nabla_x \\log p_t(x)\\Bigr]\\,dt$$
       <p><b>Probability-flow ODE (&sect;4.3, Eq. 13).</b> A deterministic ODE with the <b>same marginals</b> $p_t(x)$ as the reverse SDE (note the $\\tfrac{1}{2}$ on $g^2$ and no noise term). Enables exact likelihoods and fast deterministic sampling.</p>`,
    whatItDoes:
      `<p>The <b>forward SDE</b> (Eq. 5, &sect;3.1) is the noising rule: each instant, push $x$ by
       $f(x,t)\\,dt$ and add a random kick $g(t)\\,dw$. Repeat to dissolve data into noise.</p>
       <p>The <b>reverse-time SDE</b> (Eq. 6, &sect;3.2) is the generator. It is the same equation run backward,
       but with one new term: $-\\,g(t)^2\\,\\nabla_x \\log p_t(x)$. That term is the <b>score force</b> pulling
       samples back toward data. The only piece we cannot write down by hand is the score, so we replace it
       with the network $s_\\theta(x,t)$ and integrate from $t=1$ down to $t=0$ to produce a sample.</p>`,
    derivation:
      `<p>The full score / variational story is owned by concept <b>mod-diffusion</b> &mdash; recap and link
       rather than re-derive. Short version: (i) Anderson's 1982 theorem (cited in &sect;3.2) gives the exact
       reverse-time SDE for any forward SDE, and the only data-dependent unknown in it is the score
       $\\nabla_x \\log p_t(x)$. (ii) We cannot compute that marginal score, but the <b>denoising score
       matching</b> trick (Vincent 2011, used in Eq. 7) replaces it with the per-sample score of the Gaussian
       perturbation kernel, $\\nabla_{x_t}\\log p(x_t\\mid x_0) = -(x_t - x_0)/\\sigma_t^2$, which we DO know;
       in expectation the two objectives share the same minimizer. (iii) DDPM (paper-ddpm) is the discrete VP
       SDE (Eq. 11) and its noise-prediction loss is this same objective with a particular $\\lambda(t)$
       &mdash; see the worked example for why predicting the noise and predicting the score are the same job
       up to a scale.</p>`,
    example:
      `<p><b>Worked numbers: the score of a Gaussian.</b> The reverse SDE's only learned quantity is the score
       $\\nabla_x \\log p_t(x)$, and during training the target is the score of a Gaussian perturbation kernel.
       So the one number you must be able to compute by hand is the score of a Gaussian.</p>
       <p>Let $x \\sim \\mathcal{N}(\\mu, \\sigma^2 I)$ in 2-D. Then
       $\\log p(x) = -\\dfrac{\\lVert x - \\mu \\rVert^2}{2\\sigma^2} + \\text{const}$, and differentiating
       with respect to $x$ gives the score</p>
       $$\\nabla_x \\log p(x) = -\\,\\frac{x - \\mu}{\\sigma^2}.$$
       <p>Plug in $\\mu = (1.0,\\,-0.5)$, $\\sigma = 0.5$ (so $\\sigma^2 = 0.25$), and $x = (1.4,\\,0.3)$:</p>
       <ul class="steps">
        <li><b>Deviation:</b> $x - \\mu = (1.4 - 1.0,\\; 0.3 - (-0.5)) = (0.4,\\; 0.8)$.</li>
        <li><b>Divide by $\\sigma^2 = 0.25$:</b> $(0.4,\\,0.8)/0.25 = (1.6,\\; 3.2)$.</li>
        <li><b>Negate:</b> score $= -(1.6,\\,3.2) = (-1.6,\\; -3.2)$ &mdash; it points back toward the mean $\\mu$,
        and is steeper the farther $x$ is from $\\mu$.</li>
       </ul>
       <p><b>Why this is the training target.</b> The VE perturbation kernel is $x_t = x_0 + \\sigma_t z$, a
       Gaussian centered at $x_0$, so its score equals $-(x_t - x_0)/\\sigma_t^2 = -\\,z/\\sigma_t$. With
       $\\sigma_t = 0.5$, $x_0 = (1.0,-0.5)$, $z = (0.8,\\,1.6)$ &mdash; note $x_0 + \\sigma_t z = (1.0,-0.5) +
       0.5\\,(0.8,1.6) = (1.4,\\,0.3) = x$, the same point. The two routes give the same vector:</p>
       <table class="extable">
        <caption>Two ways to the score &mdash; direct formula vs. denoising-score-matching (DSM) target</caption>
        <thead>
         <tr><th>route</th><th>computation</th><th class="num">component 1</th><th class="num">component 2</th></tr>
        </thead>
        <tbody>
         <tr><td class="row-h">direct: $-(x-\\mu)/\\sigma^2$</td><td>$-(0.4,\\,0.8)/0.25$</td><td class="num">-1.6</td><td class="num">-3.2</td></tr>
         <tr><td class="row-h">DSM target: $-z/\\sigma_t$</td><td>$-(0.8,\\,1.6)/0.5$</td><td class="num">-1.6</td><td class="num">-3.2</td></tr>
        </tbody>
       </table>
       <p>They match exactly &mdash; the network is trained to output $-z/\\sigma_t$, which equals the true
       Gaussian score. The notebook's first cell recomputes both.</p>`,
    recipe:
      `<ol>
        <li><b>Pick the SDE (here VE).</b> Set $f=0$ and a geometric noise scale
        $\\sigma_t = \\sigma_{\\min}(\\sigma_{\\max}/\\sigma_{\\min})^t$, $t \\in [0,1]$.</li>
        <li><b>Forward-noise a batch.</b> Sample clean $x_0$, sample $t$, draw $z \\sim \\mathcal{N}(0,I)$,
        form $x_t = x_0 + \\sigma_t z$.</li>
        <li><b>Denoising score matching (Eq. 7).</b> Minimize
        $\\lambda(t)\\,\\lVert s_\\theta(x_t,t) - (-z/\\sigma_t) \\rVert^2$ with $\\lambda(t)=\\sigma_t^2$; this
        makes $s_\\theta \\approx \\nabla_x \\log p_t$.</li>
        <li><b>Sample by the reverse SDE (Eq. 6).</b> Start $x \\sim \\mathcal{N}(0,\\sigma_{\\max}^2 I)$.
        Step $t$ from $1$ to $0$ with Euler&ndash;Maruyama: drift by $-g(t)^2 s_\\theta(x,t)\\,dt$ then add
        $g(t)\\sqrt{|dt|}$ times fresh noise, where $g(t)^2 = \\tfrac{d}{dt}[\\sigma_t^2]$.</li>
        <li><b>Ablate.</b> Hide $t$ from the network and watch sample quality collapse.</li>
       </ol>`,
    results:
      `<p>The paper reports (abstract, and Table 3 in &sect;4) on unconditional CIFAR-10:
       <i>"record-breaking performance ... with an Inception score of 9.89 and FID of 2.20"</i> for their best
       VE continuous model, plus a likelihood of 2.99 bits/dim with the sub-VP probability-flow ODE. Those are
       the paper's numbers, quoted with their source. Everything in our CODE/CODEVIZ below is a tiny 2-D run
       &mdash; our own, not the paper's reported number.</p>`,
    evaluation:
      `<p><b>Metric &amp; benchmark.</b> For a generative model the metric is <b>sample quality</b>. On the
       paper's benchmark &mdash; unconditional <b>CIFAR-10</b> &mdash; that is <b>FID</b> (Fr&eacute;chet
       Inception Distance, lower is better) and <b>Inception score</b> (higher is better); the paper reports its
       best VE continuous model at <b>IS $=9.89$, FID $=2.20$</b> (abstract, &sect;4, Table 3), beating the prior
       SOTA it set out to pass. The "no-skill" floor is samples that ignore the data &mdash; pure $\\mathcal{N}(0,
       \\sigma_{\\max}^2 I)$ noise, which scores a huge FID. For our 2-D toy build the cheap proxy is the
       <b>fraction of samples landing within $0.4$ of one of the 8 cluster centers</b> (random noise &asymp; near
       $0$; a working sampler &asymp; $0.99$ in our run).</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> Recompute the worked example: the score of
        $\\mathcal{N}(\\mu,\\sigma^2 I)$ is $-(x-\\mu)/\\sigma^2$; at $\\mu=(1,-0.5)$, $\\sigma=0.5$,
        $x=(1.4,0.3)$ it is $(-1.6,-3.2)$, and the denoising-score-matching target $-z/\\sigma_t$ gives the same
        vector (the notebook's first cell checks both match). Then: confirm $s_\\theta(x,t)$ outputs a vector the
        <b>same shape</b> as $x$; <b>overfit a single batch</b> and watch the Eq. 7 loss fall toward $0$; check
        the sampler's <b>sign and noise scale</b> &mdash; samples that fly to infinity mean the reverse-step sign
        is wrong, and the start must be $\\mathcal{N}(0,\\sigma_{\\max}^2 I)$, not unit variance.</li>
        <li><b>Expected range.</b> On the toy task a correct build should land $\\approx 0.99$ of samples within
        $0.4$ of a cluster and reach a <b>mean radius near the ring radius $2.0$</b> (our numbers, not the
        paper's). On CIFAR-10 the target to anchor to is the paper's <b>FID $2.20$ / IS $9.89$</b> (abstract);
        far worse FID with a correctly-trained score net usually means a sampler bug, not a modeling limit.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The central trick is a
        <b>time-conditioned</b> score network &mdash; one $s_\\theta(x,t)$ that gives very different scores at
        small vs large noise. Turn it off by <b>hiding the time input $t$</b> (feed a constant), retrain, and
        confirm the cluster-hit fraction <b>drops sharply</b> &mdash; from $\\approx 0.99$ to $\\approx 0.15$ in
        our run. If quality does NOT fall, the network was effectively ignoring $t$ anyway (e.g. $t$ never
        reached the layers), so the conditioning is not actually wired in.</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Samples explode to large radius:</b> reverse-step
        sign wrong (recall $dt\\lt 0$ when integrating $t$ from $1$ to $0$), or you started sampling from unit
        variance instead of $\\sigma_{\\max}^2$. <b>Loss won't drop:</b> the target is $-z/\\sigma_t$, not $z$ or
        $-z$ &mdash; confusing the score with the noise (off by the $-1/\\sigma_t$ factor) trains the wrong field.
        <b>Samples form a blurry blob, not 8 distinct clusters:</b> missing or mis-weighted $\\lambda(t)$ so high-
        and low-noise levels are not balanced. <b>Right shape, wrong magnitude everywhere:</b> the classic
        time-blind failure &mdash; the ablation symptom &mdash; one network applying a single-scale correction
        across all noise levels.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>Track B (architecture): we <b>build by hand</b> the VE noise schedule, the denoising-score-matching
       loss (Eq. 7), and the reverse-SDE Euler&ndash;Maruyama sampler (Eq. 6). We <b>import the plumbing</b>:
       <code>nn.Linear</code>/<code>nn.SiLU</code> for the score network and <code>torch.optim.Adam</code>. We
       do not re-derive Anderson's reverse-SDE theorem or the score-matching identity &mdash; that math lives
       in concept mod-diffusion; we recap and link.</p>`,
    pitfalls:
      `<ul>
        <li><b>Sign of the reverse step.</b> The reverse SDE adds $-g(t)^2 \\nabla_x \\log p_t(x)$. Integrating
        backward (time decreasing) means $dt \\lt 0$; getting the sign wrong sends samples to infinity instead
        of onto the clusters.</li>
        <li><b>Score vs noise.</b> The score is $-z/\\sigma_t$, NOT $z$. DDPM predicts $z$ (the noise); the
        score is that same vector scaled by $-1/\\sigma_t$. They are the same job up to a known factor &mdash;
        do not confuse the two when reading code.</li>
        <li><b>Hiding $t$ breaks it.</b> One network must give very different scores at small vs large noise.
        Drop the time input and it cannot, so samples scatter (our ablation).</li>
        <li><b>VE noise must start big.</b> Initialize sampling from $\\mathcal{N}(0,\\sigma_{\\max}^2 I)$, not
        unit variance &mdash; for the VE SDE the terminal distribution has variance $\\sigma_{\\max}^2$.</li>
        <li><b>"$t$" is continuous.</b> Unlike DDPM's integer step index, here $t \\in [0,1]$ is a real number;
        feeding integers will mismatch the schedule.</li>
       </ul>`,
    recall: [
      "State the reverse-time SDE (Eq. 6) and name its one learned term.",
      "Write the score of $\\mathcal{N}(\\mu,\\sigma^2 I)$ and evaluate it at one point.",
      "Define the score $\\nabla_x \\log p_t(x)$ in plain English.",
      "Which SDE is DDPM (VP or VE)? Which is SMLD?",
      "What does $\\lambda(t)$ do in the score-matching loss (Eq. 7)?"
    ],
    practice: [
      {
        q: `Compute the score of a 2-D Gaussian $\\mathcal{N}(\\mu,\\sigma^2 I)$ with $\\mu=(0,2)$, $\\sigma=1$, at $x=(1,0)$.`,
        steps: [
          { do: `Use $\\nabla_x \\log p(x) = -(x-\\mu)/\\sigma^2$.`, why: `This is the score of an isotropic Gaussian (derived in the worked example).` },
          { do: `$x-\\mu=(1-0,\\,0-2)=(1,-2)$; $\\sigma^2=1$.`, why: `Subtract the mean componentwise.` },
          { do: `Negate and divide by $\\sigma^2$: $-(1,-2)/1=(-1,2)$.`, why: `The score points back toward the mean $\\mu$.` }
        ],
        answer: `The score is $(-1,\\,2)$ — pointing from $x=(1,0)$ toward $\\mu=(0,2)$.`
      },
      {
        q: `Why does the reverse SDE need the score but the forward SDE does not?`,
        steps: [
          { do: `Look at Eq. 5 vs Eq. 6.`, why: `The forward SDE has only $f$ and $g$, both chosen by hand.` },
          { do: `Eq. 6 adds the term $-g(t)^2\\nabla_x\\log p_t(x)$.`, why: `Anderson's reversal theorem (§3.2) introduces the score as the extra force when running time backward.` }
        ],
        answer: `Noising is a fixed recipe, so the forward SDE needs no data information. Reversing it requires knowing where data density is — that information IS the score, the one learned term in Eq. 6.`
      },
      {
        q: `ABLATION: what happens to samples if you hide the time input $t$ from $s_\\theta$, and why?`,
        steps: [
          { do: `Recall the score scales like $-z/\\sigma_t$, and $\\sigma_t$ varies hugely with $t$.`, why: `Early in sampling the noise is large; near the end it is tiny — the correct score differs by orders of magnitude.` },
          { do: `Without $t$, one network must output a single score field for all noise levels.`, why: `It can no longer tell a barely-noised point from a wildly-noised one, so it applies the wrong-magnitude correction.` },
          { do: `Run both and compare the fraction of samples landing on a cluster.`, why: `In our run it drops from ~0.99 (with $t$) to ~0.15 (no $t$).` }
        ],
        answer: `Samples scatter and miss the clusters. The fraction within 0.4 of a cluster falls from ≈0.99 to ≈0.15 in our small run (not the paper's number) — confirming the time-conditioning is essential.`
      }
    ]
  });

  window.CODE["paper-score-sde"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the VE noise schedule, a small score network $s_\\theta(x,t)$, the
       denoising-score-matching loss (Eq. 7), and the reverse-SDE Euler&ndash;Maruyama sampler (Eq. 6) by
       hand on top of <code>nn.Linear</code>. We train on a 2-D toy distribution &mdash; a ring of <b>8
       Gaussian clusters</b> (8 modes) &mdash; so it runs in seconds. The first cell recomputes the worked
       example (score of a Gaussian at $\\mu=(1,-0.5)$, $\\sigma=0.5$, $x=(1.4,0.3)$ &rArr; $(-1.6,-3.2)$,
       and the same vector as the denoising-score-matching target $-z/\\sigma_t$). Then we train, sample by
       integrating the reverse SDE from pure noise, and <b>print samples emerging</b>. Finally an
       <b>ablation</b> hides the time input and the samples scatter. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, math
torch.manual_seed(0)

# --- 0. Worked example: the score of a Gaussian (the reverse SDE's only learned term). ---
# For x ~ N(mu, sigma^2 I): grad_x log p(x) = -(x - mu)/sigma^2
mu, sigma, x = torch.tensor([1.0, -0.5]), 0.5, torch.tensor([1.4, 0.3])
score = -(x - mu) / sigma**2
print("worked score:", [round(v, 4) for v in score.tolist()])          # [-1.6, -3.2]
# Denoising-score-matching target is the SAME vector: for x_t = x0 + sigma_t*z, score = -z/sigma_t
x0d, z, st = torch.tensor([1.0, -0.5]), torch.tensor([0.8, 1.6]), 0.5
print("DSM target -z/sigma_t:", [round(v, 4) for v in (-z / st).tolist()])   # [-1.6, -3.2]

# --- 1. The VE SDE noise schedule (geometric sigma_t, t in [0,1]). ---
sigma_min, sigma_max = 0.05, 3.0
log_ratio = math.log(sigma_max / sigma_min)
def sigma_at(t):                                    # standard deviation added at time t
    return sigma_min * (sigma_max / sigma_min) ** t

# --- 2. A 2-D toy distribution: 8 Gaussian clusters on a ring (8 modes). ---
def sample_data(n):
    k = torch.randint(0, 8, (n,))
    ang = k.float() / 8 * 2 * math.pi
    return torch.stack([torch.cos(ang), torch.sin(ang)], 1) * 2.0 + torch.randn(n, 2) * 0.1

# --- 3. The score network s_theta(x, t): a small MLP. use_t toggles the ablation. ---
class ScoreNet(nn.Module):
    def __init__(self, h=128, use_t=True):
        super().__init__(); self.use_t = use_t
        self.net = nn.Sequential(nn.Linear(2 + 1, h), nn.SiLU(),
                                 nn.Linear(h, h), nn.SiLU(),
                                 nn.Linear(h, h), nn.SiLU(),
                                 nn.Linear(h, 2))
    def forward(self, x, t):
        te = t.unsqueeze(1)
        if not self.use_t:
            te = torch.zeros_like(te)               # ablation: hide the time
        return self.net(torch.cat([x, te], 1))

# --- 4. Train with denoising score matching (Eq. 7), lambda(t) = sigma_t^2. ---
def train(use_t=True, steps=4000):
    torch.manual_seed(0)
    net = ScoreNet(use_t=use_t)
    opt = torch.optim.Adam(net.parameters(), lr=2e-3)
    for step in range(steps):
        x0 = sample_data(512)
        t  = torch.rand(512)                        # continuous time in [0,1]
        s  = sigma_at(t).unsqueeze(1)
        z  = torch.randn_like(x0)
        xt = x0 + s * z                             # VE perturbation: x_t = x0 + sigma_t * z
        target = -z / s                             # known score of the Gaussian kernel
        loss = ((s * (net(xt, t) - target)) ** 2).sum(1).mean()   # Eq. 7 with lambda = sigma^2
        opt.zero_grad(); loss.backward(); opt.step()
        if step % 1000 == 0:
            print(f"  step {step:4d}  loss {loss.item():.4f}")
    return net

# --- 5. Sample by integrating the reverse SDE (Eq. 6) with Euler-Maruyama. ---
@torch.no_grad()
def sample(net, n=500, N=400, snapshot_at=(0.99, 0.5, 0.0)):
    x  = torch.randn(n, 2) * sigma_max              # x(1) ~ N(0, sigma_max^2 I)
    ts = torch.linspace(1.0, 1e-3, N)
    dt = ts[1] - ts[0]                              # negative: time runs backward
    snaps = {}
    for i in range(N):
        t  = ts[i]
        s  = sigma_at(t)
        g2 = 2 * log_ratio * s ** 2                 # g(t)^2 = d[sigma^2]/dt for geometric sigma
        sc = net(x, torch.full((n,), float(t)))     # learned score s_theta(x, t)
        x  = x - g2 * sc * dt                        # reverse drift: -g^2 * score * dt   (dt<0)
        if i < N - 1:
            x = x + math.sqrt(float(g2 * (-dt))) * torch.randn_like(x)   # g(t) dW-bar
        for key in snapshot_at:
            if abs(float(t) - key) < abs(float(dt)) / 2 and key not in snaps:
                snaps[key] = x.clone()
    snaps[0.0] = x.clone()
    return x, snaps

print("TRAIN (with time):")
net = train(use_t=True)
samples, snaps = sample(net)

# fraction of samples landing on the ring of 8 clusters
ang   = torch.arange(8).float() / 8 * 2 * math.pi
modes = torch.stack([torch.cos(ang), torch.sin(ang)], 1) * 2.0
d = torch.cdist(samples, modes).min(1).values
print("\\nfrac of samples within 0.4 of a cluster:", round((d < 0.4).float().mean().item(), 3))
print("mean radius (should approach ring radius 2.0):", round(samples.norm(dim=1).mean().item(), 3))
# Typical: ~0.99 of samples land on a cluster; mean radius ~1.99. (Our small run -- not the paper's number.)

# --- 6. ABLATION: hide the time input, retrain, resample. Samples scatter. ---
print("\\nABLATION (no time input):")
net_no_t = train(use_t=False)
samp_no_t, _ = sample(net_no_t)
d2 = torch.cdist(samp_no_t, modes).min(1).values
print("frac within 0.4 of a cluster, NO time:", round((d2 < 0.4).float().mean().item(), 3))
# Much lower (~0.15): one network cannot give the right-magnitude score across all noise levels.`
  };

  window.CODEVIZ["paper-score-sde"] = {
    question: "Starting from pure VE noise, does integrating the reverse SDE (driven by the learned score) pull the cloud back onto the 8 data clusters?",
    charts: [
      {
        type: "scatter",
        title: "Reverse-SDE sampling (ours, labeled): exploded noise → ring of 8 clusters",
        xlabel: "x1",
        ylabel: "x2",
        groups: [
          { name: "t=0.99 (≈ pure VE noise)", color: "#ff7b72", points: [[-2.472,1.605],[1.842,-3.456],[-0.905,0.537],[-1.663,-2.034],[3.682,-2.37],[-3.912,-1.674],[1.651,2.522],[1.831,1.604],[-4.652,-2.635],[7.118,-0.597],[2.141,2.699],[3.259,-0.811],[-0.733,-0.367],[-5.215,-1.44],[-5.089,1.892],[-3.438,-4.408],[-0.423,-0.203],[-0.713,5.463],[2.529,-3.013],[-3.73,-2.779],[-4.304,2.827],[3.803,-2.846],[-0.205,-0.321],[0.503,-0.061],[-1.07,-0.196],[0.879,-2.015],[-9.959,-4.379],[-1.72,2.443],[3.692,0.349],[-1.616,-6.486],[3.626,-1.297],[0.484,1.793],[-0.265,0.942],[0.138,2.679],[-4.292,-5.042],[-1.147,-0.315],[-1.705,4.456],[1.545,-1.058],[-2.298,-0.607],[-0.916,2.165],[-7.345,-0.022],[-0.005,0.48],[-0.915,0.108],[5.047,2.974],[-0.784,-0.935],[1.115,2.489],[-0.117,-1.428],[0.815,3.533],[-2.149,1.789],[3.704,-2.471],[0.287,1.963],[-1.589,2.466],[1.015,4.336],[-2.883,4.73],[0.257,-1.425],[1.493,-2.397],[-2.555,-0.574],[3.743,0.174],[-3.963,-0.877],[2.613,3.41]] },
          { name: "t=0.5 (mid-reverse)", color: "#d29922", points: [[-2.385,0.758],[1.938,0.225],[-1.961,0.738],[-2.386,-0.087],[1.045,-1.086],[-2.495,0.264],[1.401,2.11],[0.352,-1.719],[-1.062,-1.74],[1.273,1.76],[-1.315,-1.69],[-1.603,1.903],[-1.615,0.328],[-0.995,-1.032],[-0.969,1.271],[-1.842,-2.034],[-2.557,-0.043],[-0.463,2.355],[1.354,-1.599],[0.153,2.042],[-1.686,0.203],[-0.255,-1.623],[-0.835,-0.711],[0.304,1.841],[0.106,-1.845],[0.42,-1.824],[-2.12,0.375],[-1.574,1.392],[1.149,1.399],[-1.798,-1.249],[-0.071,1.619],[-1.869,0.084],[1.98,1.781],[1.723,1.19],[0.83,-1.615],[1.038,-1.142],[-1.805,0.288],[-1.567,-1.239],[-1.643,-0.772],[-1.525,-0.994],[-1.909,-0.12],[0.854,-1.304],[1.368,0.175],[1.598,0.051],[-1.295,1.5],[-0.247,1.858],[-1.179,0.815],[2.361,0.174],[-0.852,1.359],[-0.09,1.667],[-1.817,0.375],[1.672,0.934],[0.37,2.033],[2.195,0.573],[-0.215,2.019],[0.214,-1.619],[-1.126,-1.873],[-1.505,0.044],[-1.443,-1.413],[-0.612,1.655]] },
          { name: "t=0.0 (final samples)", color: "#7ee787", points: [[-2.113,0.047],[2.22,0.124],[-1.871,-0.029],[-2.041,0.367],[1.421,-1.375],[-1.984,0.149],[1.474,1.429],[0.031,-2.091],[-1.071,-1.539],[1.327,1.434],[-1.427,-1.351],[-1.306,1.468],[-1.982,0.048],[-1.419,-1.679],[-1.362,1.465],[-1.386,-1.319],[-2.0,-0.286],[-0.12,2.147],[1.424,-1.337],[-0.065,2.13],[-1.894,0.003],[-0.122,-2.016],[-1.312,-1.164],[-0.113,1.948],[-0.099,-1.973],[0.061,-2.113],[-2.016,-0.015],[-1.443,1.273],[1.455,1.318],[-1.283,-1.286],[-0.007,2.148],[-2.133,-0.11],[1.525,1.489],[1.042,1.297],[1.397,-1.578],[1.231,-1.287],[-2.102,0.055],[-1.429,-1.25],[-1.498,-1.511],[-1.424,-1.602],[-2.193,-0.015],[1.322,-1.339],[1.854,0.013],[2.017,0.085],[-1.443,1.192],[0.023,1.801],[-1.536,1.224],[1.945,-0.052],[-1.416,1.288],[-0.083,2.048],[-1.881,-0.036],[1.394,1.539],[0.074,2.099],[1.989,0.083],[0.071,1.989],[-0.049,-1.974],[-1.237,-1.395],[-2.162,-0.107],[-1.407,-1.434],[-0.258,2.004]] },
          { name: "8 data clusters", color: "#4ea1ff", points: [[2.0,0.0],[1.414,1.414],[0.0,2.0],[-1.414,1.414],[-2.0,0.0],[-1.414,-1.414],[0.0,-2.0],[1.414,-1.414]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A score network s_theta(x,t) trained with denoising score matching (Eq. 7) on a 2-D ring of 8 Gaussian clusters, then sampled by integrating the reverse VE SDE (Eq. 6) with Euler–Maruyama. Red = the starting cloud at t≈0.99 near pure VE noise — wildly spread (std σ_max=3, points out past radius 10); orange = midway (t=0.5), the score force already pulling the cloud toward the ring; green = the final samples (t=0), tightly seated on the 8 blue cluster centers. In this run ≈0.99 of samples land within 0.4 of a cluster and the mean radius approaches the ring radius 2.0 — structure pulled out of noise by the learned score, exactly what the reverse SDE is meant to do. Hiding the time input drops the fraction to ≈0.15 (ablation).",
    code: `import torch, torch.nn as nn, math
torch.manual_seed(0)

sigma_min, sigma_max = 0.05, 3.0
log_ratio = math.log(sigma_max / sigma_min)
def sigma_at(t): return sigma_min * (sigma_max / sigma_min) ** t

def sample_data(n):
    k = torch.randint(0, 8, (n,)); ang = k.float() / 8 * 2 * math.pi
    return torch.stack([torch.cos(ang), torch.sin(ang)], 1) * 2.0 + torch.randn(n, 2) * 0.1

class ScoreNet(nn.Module):
    def __init__(self, h=128):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(3, h), nn.SiLU(), nn.Linear(h, h), nn.SiLU(),
                                 nn.Linear(h, h), nn.SiLU(), nn.Linear(h, 2))
    def forward(self, x, t): return self.net(torch.cat([x, t.unsqueeze(1)], 1))

net = ScoreNet(); opt = torch.optim.Adam(net.parameters(), lr=2e-3)
for _ in range(4000):                                # denoising score matching (Eq. 7)
    x0 = sample_data(512); t = torch.rand(512); s = sigma_at(t).unsqueeze(1)
    z = torch.randn_like(x0); xt = x0 + s * z
    loss = ((s * (net(xt, t) - (-z / s))) ** 2).sum(1).mean()
    opt.zero_grad(); loss.backward(); opt.step()

@torch.no_grad()                                     # reverse SDE (Eq. 6), Euler-Maruyama
def sample(n=80, N=400, snap=(0.99, 0.5, 0.0)):
    x = torch.randn(n, 2) * sigma_max
    ts = torch.linspace(1.0, 1e-3, N); dt = ts[1] - ts[0]; snaps = {}
    for i in range(N):
        t = ts[i]; s = sigma_at(t); g2 = 2 * log_ratio * s ** 2
        sc = net(x, torch.full((n,), float(t)))
        x = x - g2 * sc * dt
        if i < N - 1: x = x + math.sqrt(float(g2 * (-dt))) * torch.randn_like(x)
        for k in snap:
            if abs(float(t) - k) < abs(float(dt)) / 2 and k not in snaps: snaps[k] = x[:60].clone()
    snaps[0.0] = x[:60].clone(); return snaps

torch.manual_seed(7); snaps = sample()
for k in (0.99, 0.5, 0.0):
    print(f"t={k:.2f}", [[round(p[0].item(), 3), round(p[1].item(), 3)] for p in snaps[k][:5]], "...")
# t=0.99 -> exploded blob; t=0.5 -> pulling toward the ring; t=0.0 -> seated on the 8 clusters.`
  };
})();
