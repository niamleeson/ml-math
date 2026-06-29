/* Paper lesson — "Generative Adversarial Nets" (GAN), Goodfellow et al. 2014.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-gan".
   GROUNDED from arXiv:1406.2661 (abstract) and the ar5iv HTML mirror
   (Section 3 value function Eq. 1, Algorithm 1, Section 4.1 Proposition 1 & Theorem 1).
   Track B (architecture): build a generator + discriminator (MLP) from nn.Linear and the
   adversarial training loop by hand, train on MNIST (torchvision, preinstalled), and PRINT
   samples improving. The minimax/JSD math lives in concept dl-gan; here we recap. */
(function () {
  window.LESSONS.push({
    id: "paper-gan",
    title: "GAN — Generative Adversarial Nets (2014)",
    tagline: "Train a generator by pitting it against a discriminator that tries to tell real data from its fakes.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio",
      org: "Université de Montréal (DIRO)",
      year: 2014,
      venue: "arXiv:1406.2661 (Jun 2014); NIPS 2014",
      citations: "",
      arxiv: "https://arxiv.org/abs/1406.2661",
      code: "https://github.com/goodfeli/adversarial"
    },
    conceptLink: "dl-gan",
    partOf: [
      { capstone: "capstone-gan", step: 1, builds: "the generator/discriminator pair and the adversarial training loop" }
    ],
    prereqs: ["dl-gan", "dl-backprop", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the deep generative models that worked best leaned on <b>Markov chains</b>
       (repeatedly nudging a sample with random steps until it settles &mdash; slow and hard to mix) or on
       intractable probability integrals that had to be <i>approximated</i>. The paper's framing (&sect;1):</p>
       <blockquote>"Deep generative models have had less of an impact &hellip; due to the difficulty of
       approximating many intractable probabilistic computations that arise in maximum likelihood estimation
       &hellip; and due to difficulty of leveraging the benefits of piecewise linear units in the generative
       context."</blockquote>
       <p>In plain words: to fit a generative model the old way, you had to write down how likely a sample is
       (its <b>likelihood</b>) and maximize that &mdash; but for a rich neural-net generator that quantity is a
       nasty integral nobody can compute exactly. People got stuck approximating it. The authors wanted a way
       to train a powerful neural-net generator using only <b>back-propagation</b> (the ordinary gradient
       method), with <b>no Markov chains</b> and no intractable likelihood.</p>`,
    contribution:
      `<ul>
        <li><b>The adversarial framework.</b> Train two networks at once: a <b>generator</b> $G$ that turns
        random noise into fake samples, and a <b>discriminator</b> $D$ that scores how likely a sample is real.
        $G$ is trained to fool $D$; $D$ is trained not to be fooled. They learn by competing.</li>
        <li><b>A minimax game with a clean optimum.</b> The competition is written as one
        <b>value function</b> $V(D,G)$ (Eq. 1). They prove the game's solution is exactly
        $p_g = p_{\\text{data}}$ &mdash; the generator's distribution equals the real data's &mdash; and at that
        point the discriminator is reduced to guessing ($D = \\tfrac12$ everywhere).</li>
        <li><b>Likelihood-free, backprop-only training.</b> No Markov chains, no explicit density. Both nets
        train with ordinary gradients, so they can use the same piecewise-linear units (ReLU) that made
        discriminative deep nets work.</li>
      </ul>`,
    whyItMattered:
      `<p>GANs launched the modern wave of high-quality image synthesis. The same adversarial recipe was
       scaled and stabilized into DCGAN (convolutional G/D), conditional GANs (generate a chosen class),
       Wasserstein GAN (a better-behaved loss), and on to StyleGAN-class photorealistic faces. The core idea
       &mdash; learn a generator by making a second network try to catch it &mdash; is one of the most cited in
       deep learning and seeded a whole subfield of generative modeling.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Adversarial nets)</b> &mdash; the value function <b>Eq. 1</b> you will transcribe, and
        <b>Algorithm 1</b> (the alternating training loop: $k$ discriminator steps per generator step).</li>
        <li><b>The non-saturating trick</b> at the end of &sect;3 &mdash; early on, "$\\log(1 - D(G(z)))$"
        gives the generator almost no gradient, so they instead maximize "$\\log D(G(z))$". You will use this in
        code.</li>
        <li><b>&sect;4.1, Proposition 1</b> &mdash; the optimal discriminator
        $D^*_G(x) = p_{\\text{data}}(x) / (p_{\\text{data}}(x) + p_g(x))$, the single equation behind the worked
        example.</li>
        <li><b>&sect;4.1, Theorem 1</b> &mdash; the global optimum is $C(G) = -\\log 4$, reached only when
        $p_g = p_{\\text{data}}$, and the rewrite in terms of the Jensen-Shannon divergence.</li>
        <li><b>Fig. 1</b> &mdash; the cartoon of $D$ and $p_g$ co-evolving until $p_g$ matches the data and $D$
        flattens to $\\tfrac12$.</li>
       </ul>
       <p><b>Skim:</b> &sect;5 (experiments / Parzen-window likelihoods), &sect;6 (advantages/disadvantages
       table), and the convergence-proof details in &sect;4.2 unless you want the full argument.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You train a GAN until it has truly converged &mdash; the generator's fakes are indistinguishable from
       real data. At that point, what value does the discriminator output on a typical sample: close to
       <b>1</b> (sure it's real), close to <b>0</b> (sure it's fake), or about <b>0.5</b>? And what should the
       two loss curves &mdash; $D$'s and $G$'s &mdash; look like at convergence: still falling, or flat?
       Write your guess, then watch the loss panel below.</p>
       <p>(Hint: at the optimum the paper proves $D^*_G(x) = p_{\\text{data}}/(p_{\\text{data}}+p_g)$ &mdash;
       plug in $p_g = p_{\\text{data}}$.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the two nets and the loop. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>G = MLP(z_dim &rarr; ... &rarr; 784)</code> with a <code>tanh</code> output (pixels in
        $[-1,1]$); <code>D = MLP(784 &rarr; ... &rarr; 1)</code> giving a single real/fake logit.</li>
        <li><b>Discriminator step</b> (do this $k=1$ time): sample real images $x$ and noise $z$; TODO:
        loss is <code>bce(D(x), 1) + bce(D(G(z).detach()), 0)</code> &mdash; reward $D$ for calling real "1"
        and fake "0". Note <code>.detach()</code> so $G$ is not updated here.</li>
        <li><b>Generator step:</b> sample fresh noise $z$; TODO: <b>non-saturating</b> loss
        <code>bce(D(G(z)), 1)</code> &mdash; $G$ wants $D$ to call its fakes "real".</li>
        <li>Alternate the two steps; every so often, print a few generated digits.</li>
       </ul>
       <p>Predict what $D$'s loss settles to once $G$ wins (hint: $-\\log\\tfrac12$ per side).</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>There are two players. The <b>generator</b> $G(z;\\theta_g)$ takes a random noise vector $z$ &mdash;
       drawn from a fixed simple <b>prior</b> $p_z$ (e.g. a Gaussian) &mdash; and maps it through a neural net to
       a fake sample in data space. The <b>discriminator</b> $D(x;\\theta_d)$ takes a sample $x$ and outputs a
       single number in $[0,1]$: its estimated probability that $x$ is <b>real</b> (came from the true data
       distribution $p_{\\text{data}}$) rather than produced by $G$ (&sect;3).</p>
       <p>They are trained against each other. $D$ is trained to be a good detector: push $D(x)$ toward $1$ on
       real data and $D(G(z))$ toward $0$ on fakes. $G$ is trained to <b>fool</b> $D$: push $D(G(z))$ toward
       $1$. The paper packages both objectives into a single <b>value function</b> $V(D,G)$ (Eq. 1):
       $D$ wants to <i>maximize</i> it, $G$ wants to <i>minimize</i> it &mdash; a <b>minimax game</b>
       $\\min_G \\max_D V(D,G)$.</p>
       <p>You cannot solve the inner $\\max_D$ exactly each round, so <b>Algorithm 1</b> alternates: take $k$
       gradient-<i>ascent</i> steps on $D$ (improve the detector), then one gradient-<i>descent</i> step on $G$
       (improve the forger). The paper uses small $k$ (often $k=1$).</p>
       <p><b>The non-saturating fix.</b> Early in training $D$ rejects $G$'s junk easily, so $D(G(z)) \\approx 0$
       and the term $\\log(1 - D(G(z)))$ is <i>flat</i> there &mdash; tiny gradient, $G$ barely learns. So in
       practice they train $G$ to <b>maximize $\\log D(G(z))$</b> instead (same fixed point, much stronger early
       gradient). This is the form you implement.</p>
       <p><b>Where it lands (&sect;4.1).</b> For a fixed $G$, the best possible discriminator is
       $D^*_G(x) = p_{\\text{data}}(x) / (p_{\\text{data}}(x) + p_g(x))$. Plugging that back, the game's value is
       minimized only when $p_g = p_{\\text{data}}$ &mdash; the fakes match the real distribution &mdash; at which
       point $D^* = \\tfrac12$ everywhere (it can only guess) and $V = -\\log 4$.</p>`,
    architecture:
      `<p>GAN has <b>three moving parts</b>: two networks and the game that couples them.</p>
       <ul>
        <li><b>Generator $G(z;\\theta_g)$.</b> Input: a noise vector $z\\sim p_z$ (fixed simple prior). A neural net
        (here an MLP: $z\\!\\to\\!256\\!\\to\\!512\\!\\to\\!784$, <code>tanh</code> output) maps it to a fake sample in data
        space. Its outputs implicitly define the distribution $p_g$. $G$ has no access to real data &mdash; it only
        ever sees gradients passed back <i>through</i> $D$.</li>
        <li><b>Discriminator $D(x;\\theta_d)$.</b> Input: a sample $x$ (real or fake). A neural net
        ($784\\!\\to\\!512\\!\\to\\!256\\!\\to\\!1$ logit) outputs one number $D(x)\\in[0,1]$ = its estimated probability
        that $x$ is <b>real</b>. It is a binary real-vs-fake classifier.</li>
        <li><b>The adversarial loop</b> (Algorithm 1, &sect;3). Each iteration alternates two opposed updates that
        share no gradients through $G(z)$:
          <ul>
            <li><b>$D$-step</b> ($k$ times, often $k=1$): gradient <i>ascent</i> on $V$ &mdash; pull $D(x)\\to 1$ on a
            real minibatch and $D(G(z))\\to 0$ on a fake one. The fakes are <b>detached</b> so this step moves only
            $\\theta_d$.</li>
            <li><b>$G$-step</b> (once): gradient <i>descent</i> for $G$ &mdash; in practice <i>ascend</i>
            $\\log D(G(z))$ (non-saturating) to push $D(G(z))\\to 1$, fooling the current $D$. Moves only $\\theta_g$.</li>
          </ul>
        </li>
        <li><b>The value-function game.</b> The two steps are the two players of one objective
        $\\min_G \\max_D V(D,G)$: there is no separate target distribution to fit and no likelihood &mdash; $D$ <i>is</i>
        the learned, moving loss that teaches $G$. At equilibrium $p_g = p_{\\text{data}}$ and $D\\equiv\\tfrac12$.</li>
       </ul>`,
    symbols: [
      { sym: "$G(z;\\theta_g)$", desc: "the <b>generator</b>: a neural net (weights $\\theta_g$) that maps a noise vector $z$ to a fake data sample. Implicitly defines a distribution $p_g$ over its outputs." },
      { sym: "$D(x;\\theta_d)$", desc: "the <b>discriminator</b>: a neural net (weights $\\theta_d$) outputting a single number in $[0,1]$ &mdash; its estimated probability that $x$ is <b>real</b> (from $p_{\\text{data}}$) rather than from $G$." },
      { sym: "$z$", desc: "the <b>noise / latent vector</b>: random input to $G$, the source of variety in the fakes." },
      { sym: "$p_z(z)$", desc: "the <b>prior</b> over the noise: a fixed simple distribution we sample $z$ from (e.g. a standard Gaussian or uniform). Not learned." },
      { sym: "$p_{\\text{data}}(x)$", desc: "the <b>true data distribution</b> we want to imitate (e.g. the distribution of real MNIST digit images)." },
      { sym: "$p_g(x)$", desc: "the <b>generator's distribution</b>: the distribution of samples $G(z)$ when $z\\sim p_z$. The training goal is $p_g = p_{\\text{data}}$." },
      { sym: "$V(D,G)$", desc: "the <b>value function</b> of the game (Eq. 1): one scalar that $D$ tries to maximize and $G$ tries to minimize." },
      { sym: "$\\mathbb{E}_{x\\sim p_{\\text{data}}}[\\cdot]$", desc: "an <b>expectation</b> &mdash; the average of the bracketed quantity over many samples $x$ drawn from $p_{\\text{data}}$. In code it is just the mean over a real-data minibatch." },
      { sym: "$\\min_G \\max_D$", desc: "the <b>minimax</b> structure: the discriminator maximizes $V$ (best detector) while the generator minimizes it (best forger)." },
      { sym: "$D^*_G(x)$", desc: "the <b>optimal discriminator</b> for a fixed $G$ (Proposition 1): $D^*_G = p_{\\text{data}}/(p_{\\text{data}}+p_g)$." },
      { sym: "$\\mathrm{JSD}(p_{\\text{data}}\\,\\|\\,p_g)$", desc: "the <b>Jensen-Shannon divergence</b>: a symmetric measure of how far two distributions are apart. It is $\\ge 0$ and equals $0$ only when they are identical. Theorem 1 shows $G$'s objective is $C(G)=-\\log 4 + 2\\,\\mathrm{JSD}$, so minimizing it drives $p_g$ toward $p_{\\text{data}}$." },
      { sym: "$C(G)$", desc: "the <b>generator's objective</b> after substituting the optimal $D^*_G$ into $V$ (Theorem 1): $C(G)=\\max_D V(D,G)$. Its global minimum is $-\\log 4$, attained iff $p_g=p_{\\text{data}}$." },
      { sym: "$k$", desc: "a plain term: the number of discriminator gradient steps taken per single generator step in Algorithm 1 (often $k=1$)." },
      { sym: "“mode collapse”", desc: "a plain term, not a symbol: a failure where $G$ produces only a few kinds of sample (e.g. one digit) instead of the full variety &mdash; it found a narrow output that fools $D$ and got stuck there." }
    ],
    formula: `<p><b>1. The minimax value function</b> (Eq. 1, &sect;3) &mdash; the whole game in one line. $D$ maximizes it, $G$ minimizes it:</p>
       $$ \\min_G \\max_D V(D,G) = \\mathbb{E}_{x\\sim p_{\\text{data}}(x)}\\big[\\log D(x)\\big] + \\mathbb{E}_{z\\sim p_z(z)}\\big[\\log\\big(1 - D(G(z))\\big)\\big] $$
       <p><b>2. The optimal discriminator</b> for a fixed $G$ (Proposition 1, &sect;4.1) &mdash; the best detector compares the two densities at each point:</p>
       $$ D^*_G(x) = \\frac{p_{\\text{data}}(x)}{p_{\\text{data}}(x) + p_g(x)} $$
       <p><b>3. The non-saturating generator loss</b> (&sect;3) &mdash; in practice $G$ <i>maximizes</i> this instead of <i>minimizing</i> $\\log(1 - D(G(z)))$ (same fixed point, far stronger early gradient):</p>
       $$ \\max_{G}\\; \\mathbb{E}_{z\\sim p_z(z)}\\big[\\log D(G(z))\\big] $$
       <p><b>4. The global optimum</b> (Theorem 1, &sect;4.1) &mdash; substitute $D^*_G$ into $V$ and the generator's objective becomes a divergence, minimized only when the fakes match the data:</p>
       $$ C(G) = -\\log 4 + 2\\cdot \\mathrm{JSD}\\big(p_{\\text{data}}\\,\\|\\,p_g\\big), \\qquad C(G)=-\\log 4 \\iff p_g = p_{\\text{data}} $$`,
    whatItDoes:
      `<p>Read each piece. The first term, $\\mathbb{E}_{x\\sim p_{\\text{data}}}[\\log D(x)]$, is the average of
       $\\log D(x)$ over <b>real</b> samples: it is large when $D$ confidently calls real data "real"
       ($D(x)\\to 1$, so $\\log D(x)\\to 0$). The second term,
       $\\mathbb{E}_{z\\sim p_z}[\\log(1 - D(G(z)))]$, is the average over <b>fakes</b> $G(z)$: it is large when
       $D$ confidently calls fakes "fake" ($D(G(z))\\to 0$, so $1-D(G(z))\\to 1$, $\\log\\to 0$).</p>
       <p>So $D$ <b>maximizing</b> $V$ means becoming a sharp real-vs-fake classifier. $G$ <b>minimizing</b> $V$
       can only touch the second term &mdash; it wants $D(G(z))\\to 1$ to make $\\log(1-D(G(z)))\\to -\\infty$,
       i.e. to <i>fool</i> $D$. That tug-of-war <b>is</b> the training signal: no likelihood, just the two
       averages, both computed from minibatches and differentiated by back-propagation.</p>`,
    derivation:
      `<p><b>Step 1 &mdash; the optimal discriminator (Proposition 1).</b> Fix $G$ and find the $D$ that maximizes
       $V$. Write both expectations as integrals over the same variable $x$ (push the $z$-expectation through
       $G$ so the fake term is an integral over data space too):</p>
       <p>$$ V(D,G) = \\int_x \\Big[\\, p_{\\text{data}}(x)\\,\\log D(x) + p_g(x)\\,\\log\\big(1 - D(x)\\big) \\,\\Big]\\, dx. $$</p>
       <p>$D$ may choose its value freely at each $x$, so we maximize the <b>integrand</b> pointwise. For fixed
       constants $a = p_{\\text{data}}(x)$, $b = p_g(x)$, the function $y\\mapsto a\\log y + b\\log(1-y)$ has derivative
       $a/y - b/(1-y)$; set it to $0$ to get $a(1-y) = by$, i.e. $y = a/(a+b)$. Hence</p>
       <p>$$ D^*_G(x) = \\frac{p_{\\text{data}}(x)}{p_{\\text{data}}(x) + p_g(x)}. $$</p>
       <p><b>Step 2 &mdash; the global optimum (Theorem 1).</b> Substitute $D^*_G$ back into $V$. Each term becomes
       $\\log\\frac{p_{\\text{data}}}{p_{\\text{data}}+p_g}$ and $\\log\\frac{p_g}{p_{\\text{data}}+p_g}$. Add and
       subtract $\\log 2$ inside each to turn them into Kullback-Leibler divergences against the mixture
       $\\tfrac12(p_{\\text{data}}+p_g)$, which package into the Jensen-Shannon divergence:</p>
       <p>$$ C(G) = \\max_D V(D,G) = -\\log 4 + 2\\cdot \\mathrm{JSD}\\big(p_{\\text{data}}\\,\\|\\,p_g\\big). $$</p>
       <p>Since $\\mathrm{JSD}\\ge 0$ with equality only when $p_g = p_{\\text{data}}$, the minimum is
       $C(G) = -\\log 4$, attained uniquely there &mdash; the generator's distribution equals the data's.</p>
       <p><b>Step 3 &mdash; why the non-saturating $G$ loss.</b> The paper's game minimizes $\\log(1 - D(G(z)))$.
       Early in training $G$'s fakes are obvious, so $D(G(z))\\approx 0$. There $\\log(1-D(G(z)))\\approx \\log 1 = 0$
       and its slope $-1/(1-D(G(z)))\\approx -1$ &mdash; the value is <i>flat near zero pull</i> in the region $G$
       lives in, so $\\theta_g$ barely moves: the loss <b>saturates</b>. Switching $G$ to <b>maximize
       $\\log D(G(z))$</b> keeps the same fixed point ($D(G(z))\\to 1$) but its slope $1/D(G(z))$ is <i>huge</i> when
       $D(G(z))\\approx 0$ &mdash; a strong gradient exactly when $G$ is losing badly and most needs to learn. The
       full Proposition-1 / Theorem-1 proofs are also in the <b>dl-gan</b> concept lesson.</p>`,
    example:
      `<p>Work the optimal discriminator and one value-function evaluation by hand, with real numbers
       (these are recomputed in the notebook's first cell).</p>
       <ul class="steps">
        <li><b>Optimal $D$ at a point</b> (Proposition 1). Suppose at some sample $x$ the real density is
        $p_{\\text{data}}(x) = 0.6$ and the generator's density is $p_g(x) = 0.2$. Then
        $D^*_G(x) = \\dfrac{0.6}{0.6 + 0.2} = \\dfrac{0.6}{0.8} = 0.75$. The best detector assigns this point a
        $75\\%$ chance of being real &mdash; sensible, since real density there is three times the fake density.</li>
        <li><b>Its real-side contribution to $V$:</b> $\\log D^*(x) = \\log 0.75 = -0.2877$.</li>
        <li><b>A fake-side term.</b> For a fake sample where the current $D$ outputs $D(G(z)) = 0.3$, the
        contribution is $\\log(1 - 0.3) = \\log 0.7 = -0.3567$.</li>
        <li><b>The converged value.</b> When $G$ wins ($p_g = p_{\\text{data}}$), $D^* = \\tfrac12$ everywhere and
        the game value hits its optimum $C(G) = -\\log 4 = -1.3863$. Equivalently each <b>BCE</b> (binary
        cross-entropy) loss term settles at $-\\log\\tfrac12 = \\log 2 = 0.6931$, so the discriminator's total
        loss settles near $2\\log 2 = 1.3863$. Watch for those two numbers in the loss panel below.</li>
       </ul>
       <p><b>The optimal discriminator, before vs at convergence</b> (Proposition 1, plugging two density
       pairs into $D^*_G = p_{\\text{data}}/(p_{\\text{data}}+p_g)$):</p>
       <table class="extable">
        <caption>As the generator matches the data ($p_g \\to p_{\\text{data}}$), the best possible $D$ falls to $0.5$ &mdash; it can only guess.</caption>
        <thead><tr><th>situation</th><th class="num">$p_{\\text{data}}(x)$</th><th class="num">$p_g(x)$</th><th class="num">$D^*_G(x)$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$G$ still losing</td><td class="num">0.6</td><td class="num">0.2</td><td class="num">0.75</td></tr>
         <tr><td class="row-h">$G$ converged</td><td class="num">0.6</td><td class="num">0.6</td><td class="num">0.50</td></tr>
        </tbody>
       </table>
       <p><b>The discriminator's loss: a normal classifier vs a converged GAN.</b> Unlike an ordinary
       classifier, a winning GAN drives $D$'s loss <i>up</i> toward chance, not down to $0$:</p>
       <table class="extable">
        <caption>BCE terms at the two regimes. Each side is $-\\log$ of $D$'s confidence; at equilibrium both sides land on $\\log 2$.</caption>
        <thead><tr><th>regime</th><th class="num">$D(x)$ on real</th><th class="num">real BCE</th><th class="num">fake BCE</th><th class="num">total $D$-loss</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$D$ perfect (won)</td><td class="num">$\\approx 1$</td><td class="num">$\\approx 0$</td><td class="num">$\\approx 0$</td><td class="num">$\\approx 0$</td></tr>
         <tr><td class="row-h">converged ($D=0.5$)</td><td class="num">0.50</td><td class="num">0.6931</td><td class="num">0.6931</td><td class="num">1.3863</td></tr>
        </tbody>
       </table>
       <p>So the target plateau is total $D$-loss $\\approx 2\\log 2 = 1.3863$ (the optimum $-\\log 4$),
       <i>not</i> $0$.</p>`,
    recipe:
      `<ol>
        <li><b>Build the generator</b> $G$: an MLP <code>z_dim &rarr; hidden &rarr; 784</code> with a
        <code>tanh</code> output so pixels lie in $[-1,1]$ (match the data scaling).</li>
        <li><b>Build the discriminator</b> $D$: an MLP <code>784 &rarr; hidden &rarr; 1</code> giving a single
        real/fake logit (apply the sigmoid inside the BCE loss).</li>
        <li><b>Discriminator step</b> ($k=1$): sample real images $x$ and noise $z$; minimize
        <code>bce(D(x),1) + bce(D(G(z).detach()),0)</code>. The <code>.detach()</code> keeps this step from
        updating $G$.</li>
        <li><b>Generator step</b> (non-saturating): sample fresh $z$; minimize <code>bce(D(G(z)),1)</code>,
        i.e. maximize $\\log D(G(z))$.</li>
        <li><b>Alternate</b> the two steps over many minibatches; periodically print a grid of generated digits
        to see them sharpen.</li>
        <li><b>Watch for mode collapse:</b> if every sample looks like the same digit, $G$ collapsed onto one
        mode &mdash; note it as the classic GAN pitfall.</li>
      </ol>`,
    results:
      `<p>The paper evaluates GAN samples on MNIST, the Toronto Face Database, and CIFAR-10, reporting
       log-likelihoods estimated with a <b>Parzen-window</b> density (a kernel density estimate fit to the
       generated samples). They are careful to flag the method's limits, calling these estimates
       "somewhat high variance and do not perform well in high dimensional spaces &hellip; but are the best
       method available." Their qualitative claim is that the generated digits and faces are competitive with
       the better generative models of the time. The paper's strength is the <b>framework and its theory</b>
       (Eq. 1, Proposition 1, Theorem 1), not a single headline accuracy number.</p>
       <p><i>The numbers in the CODEVIZ panel below are from our own tiny run &mdash; not the paper's reported
       results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> A GAN has no single accuracy, so check it three ways on <b>MNIST</b>
       (the paper's setting, with the Toronto Face DB and CIFAR-10). (a) <b>Equilibrium value:</b> the
       discriminator's total BCE loss should settle near <b>$2\\log 2\\approx1.386=-\\log 4$</b> (each side near
       $\\log 2\\approx0.693$), where $D$ is reduced to guessing. (b) <b>Sample quality:</b> generated digits
       should look like real digits and cover all <b>ten</b> classes. (c) The paper's own number, a
       <b>Parzen-window log-likelihood</b> of the samples (which it flags as "high variance &hellip; but the
       best method available"). The "no-skill" reference is $D=0.5$ everywhere &mdash; a converged GAN
       <i>wants</i> $D$ at chance, the opposite of a normal classifier.</p>
       <p><b>2. Sanity checks BEFORE the full MNIST run.</b></p>
       <ul>
        <li><b>Known-answer unit test.</b> Reproduce the worked example: with $p_{\\text{data}}=0.6$, $p_g=0.2$,
        the optimal $D^*_G(x)=0.6/0.8=0.75$, $\\log0.75=-0.2877$, $\\log0.7=-0.3567$, and the optimum
        $-\\log 4=-1.3863$. With $p_g=p_{\\text{data}}=0.6$, $D^*$ must give exactly $0.5$.</li>
        <li><b>Loss at init.</b> Before training, $D$ is near chance, so each BCE term should start near
        $\\log 2\\approx0.693$ &mdash; if $D$'s loss starts near $0$, labels or the real/fake assignment are
        flipped.</li>
        <li><b>Output range &amp; shapes.</b> $G$ ends in <code>tanh</code> (pixels in $[-1,1]$), so normalize
        the real data to $[-1,1]$ too; confirm $G(z)$ is $784$-dim and $D(x)$ is a single logit. A mismatched
        range lets $D$ win on scale alone.</li>
        <li><b>Overfit one batch.</b> Train $D$ alone to separate a fixed real batch from a fixed fake batch and
        confirm its loss drops &mdash; verifies the discriminator and BCE wiring before adding the adversarial loop.</li>
       </ul>
       <p><b>3. Expected range.</b> The paper's claim is <b>qualitative</b>: generated digits/faces "competitive
       with the better generative models of the time," scored by Parzen-window log-likelihood (abstract,
       &sect;5) &mdash; there is no headline accuracy to hit, so target the <b>theoretical equilibrium</b>
       instead: $D$-loss converging to $2\\log 2\\approx1.386$ and samples that span all ten digit classes
       (Theorem 1 / Fig. 1). As a rule of thumb, a $D$-loss pinned near $0$ (D winning) or runaway-high (D
       losing) means the game is unbalanced, not converged.</p>
       <p><b>4. Ablation &mdash; prove the adversarial wiring earns its keep.</b> The central mechanics are the
       <b>detached $D$-step</b> and the <b>non-saturating $G$ loss</b>. (a) Remove <code>.detach()</code> from
       the fakes in the $D$-step and confirm training <b>destabilizes</b> &mdash; the $D$-step's "call the fake
       fake" gradient now also flows into $G$, fighting the $G$-step (the lesson's detach ablation). (b) Swap
       the $G$ loss from non-saturating <code>bce(D(G(z)),1)</code> back to minimizing $\\log(1-D(G(z)))$ and
       confirm $G$ learns far slower early (its gradient nearly vanishes while $D(G(z))\\approx0$). If neither
       change hurts, those pieces aren't actually in the loop.</p>
       <p><b>5. Failure signals.</b></p>
       <ul>
        <li><b>Every sample is the same digit</b> &rarr; <b>mode collapse</b>: $G$ parked $p_g$ on one mode that
        fools $D$; loss can look stable while variety is gone.</li>
        <li><b>$D$-loss crashes to $0$, $G$-loss climbs</b> &rarr; $D$ is winning (often forgot
        <code>.detach()</code> or $D$ is too strong); $G$ gets no useful gradient.</li>
        <li><b>Loss or samples become NaN</b> &rarr; learning rate too high / unstable init &mdash; lower the LR,
        keep Adam $\\beta_1=0.5$.</li>
        <li><b>Samples never sharpen, $G$-loss flat-high early</b> &rarr; using the saturating
        $\\log(1-D(G(z)))$ loss instead of maximizing $\\log D(G(z))$.</li>
        <li><b>Reading "lower $D$-loss is better"</b> &rarr; a converged GAN drives $D$-loss <i>up</i> to
        $\\approx1.386$ (chance), not down to $0$; a flat plateau there is the goal.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the building blocks already ship in PyTorch, so you
       <b>import</b> them and build only the novel composition &mdash; the adversarial loop. <b>Import:</b>
       <code>nn.Linear</code>, <code>nn.ReLU</code>/<code>nn.LeakyReLU</code>, <code>nn.Tanh</code>,
       <code>nn.BCEWithLogitsLoss</code>, the Adam optimizer, and the MNIST loader from torchvision
       (preinstalled in Colab &mdash; no pip). <b>Build by hand:</b> the generator and discriminator nets, the
       two alternating gradient steps (with <code>.detach()</code> on the fakes in the $D$ step), and the
       non-saturating $G$ objective. The minimax / Proposition-1 / JSD math is recapped from the dl-gan concept
       lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting <code>.detach()</code> in the discriminator step.</b> If you backprop $D$'s loss
        through $G(z)$ without detaching, the same step also nudges $G$ &mdash; in the wrong direction, since
        that loss <i>wants</i> the fake called "fake". <b>Fix:</b> use <code>G(z).detach()</code> when training
        $D$; only the $G$ step should move $G$.</li>
        <li><b>Mode collapse.</b> $G$ discovers one output (e.g. a single digit) that reliably fools the current
        $D$ and produces only that. The samples get sharp but lose variety. <b>Mitigations</b> (DCGAN/later
        papers): smaller learning rates, minibatch tricks, different losses; for this lesson, just recognize it
        when every printed sample looks alike.</li>
        <li><b>Using the saturating $G$ loss.</b> Minimizing $\\log(1 - D(G(z)))$ directly gives $G$ almost no
        gradient early (when $D(G(z))\\approx 0$). <b>Fix:</b> maximize $\\log D(G(z))$ &mdash; in code,
        <code>bce(D(G(z)), 1)</code>.</li>
        <li><b>Mismatched output range.</b> If $G$ ends in <code>tanh</code> (pixels in $[-1,1]$) but the real
        images are in $[0,1]$, $D$ separates them on scale alone and $G$ can't catch up. <b>Fix:</b> normalize
        the data to the same range as $G$'s output.</li>
        <li><b>Reading the losses as "lower is better".</b> Unlike a classifier, a GAN that is winning does
        <i>not</i> drive $D$'s loss to $0$ &mdash; it drives it toward $2\\log 2\\approx 1.386$, where $D$ can only
        guess. Flat, non-decreasing losses near that value are the goal, not a bug.</li>
      </ul>`,
    recall: [
      "Write the GAN value function (Eq. 1) from memory.",
      "What is the optimal discriminator $D^*_G(x)$ for a fixed $G$?",
      "At convergence ($p_g = p_{\\text{data}}$), what does $D$ output, and what value does the game reach?",
      "Why does the generator maximize $\\log D(G(z))$ instead of minimizing $\\log(1 - D(G(z)))$?",
      "Define mode collapse."
    ],
    practice: [
      {
        q: `<b>The detach ablation.</b> In your working GAN, remove the <code>.detach()</code> from the fakes in
            the discriminator step (so <code>D</code>'s loss now flows into <code>G</code> too). Keep
            everything else identical. What goes wrong, and what does that show about which step is allowed to
            move $G$?`,
        steps: [
          { do: `Change the D-step from <code>bce(D(G(z).detach()), 0)</code> to <code>bce(D(G(z)), 0)</code>; leave the G-step alone.`, why: `An honest ablation changes exactly one thing &mdash; whether the discriminator's gradient reaches the generator.` },
          { do: `Retrain and watch the samples: $G$ now receives a "make the fake look <i>more</i> fake" signal during the D-step, fighting its own G-step.`, why: `The D-step loss rewards $D$ for calling fakes "fake"; backprop into $G$ pushes $G$ to comply &mdash; the opposite of what $G$ should learn.` },
          { do: `Conclude that only the generator step may update $G$; the discriminator step must treat the fakes as fixed inputs.`, why: `Detaching severs the graph at $G(z)$ so the D-step updates only $\\theta_d$, keeping the two objectives clean.` }
        ],
        answer: `<p>Without <code>.detach()</code>, the discriminator step also back-propagates into $G$ with a
                 signal that wants the fake judged "fake" &mdash; directly undoing the generator step. Training
                 destabilizes or stalls and samples fail to improve. The fix isolates responsibilities: the
                 D-step updates only $D$ (fakes detached), the G-step updates only $G$. This shows the two
                 alternating optimizations must not share gradients through $G(z)$.</p>`
      },
      {
        q: `Your worked example had $p_{\\text{data}}(x) = 0.6$ and $p_g(x) = 0.2$, giving
            $D^*_G(x) = 0.75$. Suppose instead the generator has matched the data at this point, so
            $p_g(x) = 0.6$. What is $D^*_G(x)$ now, and what does that say about the discriminator at
            convergence?`,
        steps: [
          { do: `Plug into Proposition 1: $D^*_G(x) = \\dfrac{0.6}{0.6 + 0.6} = \\dfrac{0.6}{1.2} = 0.5$.`, why: `When the real and fake densities are equal at $x$, the optimal detector has no information to tell them apart.` },
          { do: `Note that if $p_g = p_{\\text{data}}$ <i>everywhere</i>, then $D^* = 0.5$ for every $x$.`, why: `The discriminator is reduced to a coin flip &mdash; exactly the equilibrium of the game.` },
          { do: `Map that to the loss: each BCE term becomes $-\\log 0.5 = \\log 2 \\approx 0.693$, so $D$'s total loss settles near $2\\log 2 \\approx 1.386 = -\\log 4$ in value-function terms.`, why: `This is why a converged GAN does NOT drive $D$'s loss to zero.` }
        ],
        answer: `<p>$D^*_G(x) = 0.6/(0.6+0.6) = 0.5$. Once the generator matches the data ($p_g = p_{\\text{data}}$),
                 the best possible discriminator outputs $0.5$ everywhere &mdash; it can only guess. Its loss
                 settles near $2\\log 2 \\approx 1.386$ (the optimum $-\\log 4$), the flat plateau you see in the
                 loss panel, not $0$.</p>`
      },
      {
        q: `You print samples during training and notice that after a while <b>every</b> generated image is the
            same digit (say, a "1"), even though the loss curves look stable. What failure is this, why does it
            still fool the discriminator, and what is one mitigation?`,
        steps: [
          { do: `Name it: this is <b>mode collapse</b> &mdash; $G$ covers only one mode of $p_{\\text{data}}$ instead of all ten digits.`, why: `The data has many modes (digit classes); $G$ has parked $p_g$ on a single one.` },
          { do: `Explain why it persists: a single very-realistic "1" can make $D(G(z))$ high, so the generator's loss is low even though variety is gone.`, why: `The minimax objective rewards fooling $D$ per-sample; it does not directly force $G$ to cover every mode.` },
          { do: `Apply a mitigation: lower/asymmetric learning rates, minibatch features, or a different loss (e.g. Wasserstein GAN). For this lesson, just flag it on the sample grid.`, why: `Later papers in this module add explicit fixes; recognizing collapse is the first skill.` }
        ],
        answer: `<p>This is <b>mode collapse</b>: the generator covers only one mode of the data while ignoring
                 the rest. It persists because fooling $D$ on each individual sample &mdash; not covering every
                 mode &mdash; is what the loss rewards, so a single convincing digit keeps $G$'s loss low.
                 Mitigations include smaller/asymmetric learning rates, minibatch discrimination, or switching to
                 a Wasserstein loss; the classic GAN loop has no built-in guard against it.</p>`
      }
    ]
  });

  window.CODE["paper-gan"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the generator and discriminator (MLPs from <code>nn.Linear</code>) and the
       <b>adversarial training loop</b> by hand, then train on <b>MNIST</b> (torchvision, preinstalled in Colab
       &mdash; no pip). The two key lines are the alternating steps: the discriminator minimizes
       <code>bce(D(real),1) + bce(D(G(z).detach()),0)</code> (Eq. 1's two terms), and the generator minimizes the
       <b>non-saturating</b> <code>bce(D(G(z)),1)</code> (maximize $\\log D(G(z))$). We <b>print generated digit
       samples improving</b> over training, and watch $D$'s loss settle near $2\\log 2 \\approx 1.386$. The first
       cell recomputes the worked example: $D^* = 0.6/0.8 = 0.75$, $\\log 0.75 = -0.2877$, $\\log 0.7 = -0.3567$,
       and the optimum $-\\log 4 = -1.3863$. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, math
import torchvision, torchvision.transforms as T

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example (Proposition 1 + the global optimum). ---
pdata, pg = 0.6, 0.2
Dstar = pdata / (pdata + pg)                 # D*_G(x) = p_data/(p_data+p_g)
print("worked example:")
print("  D*(x) = %.2f/%.2f = %.4f" % (pdata, pdata+pg, Dstar))           # 0.75
print("  log D*(x)        = %.4f" % math.log(Dstar))                     # -0.2877
print("  log(1-0.3)       = %.4f" % math.log(1 - 0.3))                   # -0.3567
print("  global optimum -log4 = %.4f" % (-math.log(4)))                  # -1.3863
print("  D-loss at equilibrium 2*log2 = %.4f" % (2*math.log(2)))        # 1.3863


# --- 1. Generator and discriminator, built by hand from nn.Linear. ---
Z = 64
class G(nn.Module):                          # noise z -> 784 pixels in [-1,1]
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(Z, 256), nn.LeakyReLU(0.2),
            nn.Linear(256, 512), nn.LeakyReLU(0.2),
            nn.Linear(512, 784), nn.Tanh())
    def forward(self, z): return self.net(z)

class D(nn.Module):                          # 784 pixels -> 1 real/fake logit
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(784, 512), nn.LeakyReLU(0.2),
            nn.Linear(512, 256), nn.LeakyReLU(0.2),
            nn.Linear(256, 1))               # logit; sigmoid lives inside the BCE loss
    def forward(self, x): return self.net(x)

gen, dis = G().to(device), D().to(device)
bce = nn.BCEWithLogitsLoss()
optG = torch.optim.Adam(gen.parameters(), lr=2e-4, betas=(0.5, 0.999))
optD = torch.optim.Adam(dis.parameters(), lr=2e-4, betas=(0.5, 0.999))


# --- 2. MNIST (torchvision is preinstalled in Colab). Scale to [-1,1] to match tanh. ---
tfm = T.Compose([T.ToTensor(), T.Normalize((0.5,), (0.5,))])
data = torchvision.datasets.MNIST(root="./data", train=True, download=True, transform=tfm)
loader = torch.utils.data.DataLoader(data, batch_size=128, shuffle=True, drop_last=True)


# --- 3. Print a tiny ASCII preview of generated digits so we SEE them improve. ---
fixed_z = torch.randn(1, Z, device=device)
def preview(tag):
    gen.eval()
    with torch.no_grad():
        img = gen(fixed_z).view(28, 28).cpu()
    gen.train()
    img = (img + 1) / 2                       # back to [0,1]
    rows = []
    for r in range(0, 28, 2):                 # downsample to 14 rows for the console
        line = "".join(" .:-=+*#%@"[min(9, int(img[r, c].clamp(0,1) * 9))] for c in range(0, 28, 1))
        rows.append(line)
    print("--- samples @", tag, "---")
    print("\\n".join(rows))


# --- 4. The adversarial training loop (the novel part). ---
def train(epochs=3):
    step = 0; dl_hist, gl_hist = [], []
    for ep in range(epochs):
        for x, _ in loader:
            x = x.view(x.size(0), -1).to(device)
            m = x.size(0)
            real_t = torch.ones(m, 1, device=device)
            fake_t = torch.zeros(m, 1, device=device)

            # (a) DISCRIMINATOR step (k=1): ascend log D(x) + log(1-D(G(z))).
            z = torch.randn(m, Z, device=device)
            fake = gen(z).detach()            # detach: this step must NOT move G
            lossD = bce(dis(x), real_t) + bce(dis(fake), fake_t)
            optD.zero_grad(); lossD.backward(); optD.step()

            # (b) GENERATOR step: non-saturating -- maximize log D(G(z)).
            z = torch.randn(m, Z, device=device)
            lossG = bce(dis(gen(z)), real_t)  # wants D to call fakes "real"
            optG.zero_grad(); lossG.backward(); optG.step()

            if step % 200 == 0:
                dl_hist.append((step, lossD.item())); gl_hist.append((step, lossG.item()))
                if step % 600 == 0:
                    print("step %5d   D loss %.3f   G loss %.3f" % (step, lossD.item(), lossG.item()))
            step += 1
        preview("epoch %d" % ep)              # watch the digit sharpen each epoch
    return dl_hist, gl_hist

print("\\nbefore training:"); preview("init")
dl_hist, gl_hist = train(epochs=3)
print("\\nD loss should settle near 2*log2 = 1.386 (D reduced to guessing); samples sharpen each epoch.")
print("If every sample looks like the SAME digit -> mode collapse (the classic GAN pitfall).")
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-gan"] = {
    question: "As a GAN trains, where do the discriminator and generator losses go — and does that match the theory (D → guessing, value → -log 4)?",
    charts: [
      {
        type: "line",
        title: "GAN losses vs step — discriminator and (non-saturating) generator",
        xlabel: "training step",
        ylabel: "BCE loss",
        series: [
          {
            name: "Discriminator loss",
            color: "#4ea1ff",
            points: [[0,1.3627],[20,1.2598],[41,1.3756],[61,1.4546],[82,1.3946],[103,1.3796],[123,1.3851],[144,1.3808],[165,1.3966],[185,1.3891],[206,1.382],[227,1.3879],[247,1.388],[268,1.3849],[289,1.387],[309,1.3853],[330,1.3852],[351,1.386],[371,1.3866],[392,1.3872],[413,1.387],[433,1.3844],[454,1.3847],[475,1.3854],[495,1.3872],[516,1.3866],[537,1.3855],[557,1.3855],[578,1.3867],[599,1.3868]]
          },
          {
            name: "Generator loss",
            color: "#7ee787",
            points: [[0,0.6377],[20,0.608],[41,0.6438],[61,0.734],[82,0.8597],[103,0.794],[123,0.6859],[144,0.6346],[165,0.6883],[185,0.6881],[206,0.7142],[227,0.694],[247,0.6772],[268,0.7108],[289,0.6786],[309,0.704],[330,0.6765],[351,0.724],[371,0.6884],[392,0.6969],[413,0.7005],[433,0.6817],[454,0.7084],[475,0.6808],[495,0.7073],[516,0.6887],[537,0.6794],[557,0.6828],[578,0.7113],[599,0.6944]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny MLP GAN (generator + discriminator from nn.Linear, non-saturating G loss, Adam) trained on a 2-D toy data blob for 600 steps. The discriminator loss climbs to and parks at <b>~1.386 = 2·log 2 = -log 4</b> &mdash; exactly the equilibrium the paper predicts, where $p_g = p_{\\text{data}}$ and $D$ is reduced to guessing ($D = 0.5$). The generator loss settles near <b>log 2 ≈ 0.693</b>, the matching per-sample value. After training, the generated samples' mean matched the real data's mean &mdash; the fakes converged onto the real distribution. Lower is NOT better here: the flat plateau at $2\\log 2$ is the goal.",
    code: `import torch, torch.nn as nn, numpy as np
torch.manual_seed(0)

# Tiny GAN on a 2-D toy blob. Same loop as the MNIST notebook (G/D from nn.Linear,
# non-saturating G loss), small enough to run in seconds and show the equilibrium.
def real_batch(m):                            # real data: a Gaussian blob
    return torch.randn(m, 2) * 0.4 + torch.tensor([1.5, 1.0])

Z = 8
G = nn.Sequential(nn.Linear(Z, 32), nn.ReLU(), nn.Linear(32, 2))
D = nn.Sequential(nn.Linear(2, 32), nn.ReLU(), nn.Linear(32, 1))
bce  = nn.BCEWithLogitsLoss()
optD = torch.optim.Adam(D.parameters(), lr=2e-3, betas=(0.5, 0.999))
optG = torch.optim.Adam(G.parameters(), lr=2e-3, betas=(0.5, 0.999))

m, dl, gl = 128, [], []
for step in range(600):
    x = real_batch(m); z = torch.randn(m, Z)
    fake = G(z).detach()                                   # detach in the D step
    lossD = bce(D(x), torch.ones(m,1)) + bce(D(fake), torch.zeros(m,1))
    optD.zero_grad(); lossD.backward(); optD.step()

    z = torch.randn(m, Z)
    lossG = bce(D(G(z)), torch.ones(m,1))                  # non-saturating: max log D(G(z))
    optG.zero_grad(); lossG.backward(); optG.step()
    dl.append(lossD.item()); gl.append(lossG.item())

idx = np.linspace(0, 599, 30).astype(int)
print("Discriminator:", [[int(i), round(dl[i], 4)] for i in idx])
print("Generator    :", [[int(i), round(gl[i], 4)] for i in idx])
with torch.no_grad():
    print("real mean [1.5, 1.0]  vs  gen mean:",
          [round(v, 3) for v in G(torch.randn(2000, Z)).mean(0).tolist()])
# D loss -> ~1.386 = 2*log2 = -log4 (D reduced to guessing); gen mean -> real mean.`
  };
})();
