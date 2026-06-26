/* Paper lesson — "Variational Inference with Normalizing Flows"
   (Rezende & Mohamed, ICML 2015). Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-normalizing-flows-vi".
   GROUNDED from arXiv:1505.05770 (abstract) and the ar5iv HTML mirror
   (Sec 3.1 change-of-variables Eqn 5; normalizing flow Eqn 6-7; Sec 4.1 planar
   flow Eqn 10-12; Sec 4.2 flow free-energy bound Eqn 15).
   Track B (architecture): compose the model with torch, then implement the NOVEL
   part by hand — a planar normalizing flow that transforms a unit Gaussian through
   invertible maps, tracking the log-density via the change-of-variables formula
   with the log-determinant of the Jacobian. Verify against autograd. */
(function () {
  window.LESSONS.push({
    id: "paper-normalizing-flows-vi",
    title: "Normalizing Flows — Variational Inference with Normalizing Flows (2015)",
    tagline: "Bend a simple Gaussian into a rich, complex density with a chain of invertible maps, tracking its exact log-density along the way.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Danilo Jimenez Rezende, Shakir Mohamed",
      org: "Google DeepMind",
      year: 2015,
      venue: "arXiv:1505.05770 (May 2015); ICML 2015",
      citations: "",
      arxiv: "https://arxiv.org/abs/1505.05770",
      code: ""
    },
    conceptLink: "mod-normalizing-flows",
    partOf: [],
    prereqs: ["mod-normalizing-flows", "mod-vae", "paper-vae", "la-jacobian", "la-determinant", "prob-normal", "prob-pdf-cdf", "pt-autograd", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>Variational inference</b> (VI) is a way to approximate a hard-to-compute probability distribution
       with an easier one. In a <b>variational autoencoder</b> (VAE), we want the <b>posterior</b> &mdash; the
       distribution over hidden codes $z$ given the data $x$ &mdash; but the true posterior is intractable. So we
       replace it with an <b>approximate posterior</b> $q(z \\mid x)$ that we can sample and score cheaply.</p>
       <p>The catch: almost everyone uses a <b>mean-field</b> Gaussian for $q$ &mdash; one independent Gaussian per
       dimension, a simple bell curve with no correlations. That is easy, but it is also a straitjacket. If the
       true posterior is skewed, bent, or has two peaks, a single Gaussian cannot match it. From the abstract:</p>
       <blockquote>"Most applications of variational inference employ simple families of posterior approximations&hellip;
       This restriction has a significant impact on the quality of inferences made using variational methods." (Abstract)</blockquote>
       <p>The open question: how do we build an approximate posterior that is <b>flexible</b> enough to match a
       complicated true posterior, yet still lets us <b>sample</b> from it and <b>compute its density</b> cheaply?
       VI needs both. A complex density you cannot score is useless here.</p>`,
    contribution:
      `<ul>
        <li><b>Normalizing flows for posteriors.</b> Start from a simple density (a unit Gaussian). Push its
        samples through a chain of <b>invertible</b> functions. Each map bends the density a little; a few maps
        stacked together turn the plain Gaussian into a rich, complex shape &mdash; skewed, curved, even bimodal
        (two peaks).</li>
        <li><b>Exact log-density, kept cheap.</b> The trick is the <b>change-of-variables</b> rule: when you push a
        density through an invertible map, its new log-density is the old one minus the <b>log-determinant of the
        Jacobian</b> of the map. Track that term and you always know the exact density of the transformed variable
        &mdash; no extra approximation.</li>
        <li><b>The planar flow.</b> A specific cheap invertible map, $f(z) = z + u\\,h(w^{\\top} z + b)$, whose
        log-determinant is a single scalar $\\ln|1 + u^{\\top}\\psi(z)|$ &mdash; computable in linear time, with no
        matrix to factor. Stacking these gives a flexible posterior that plugs straight into the VAE objective.</li>
      </ul>`,
    whyItMattered:
      `<p>This paper put "normalizing flows" on the map as a general tool for building flexible distributions you
       can both sample and score. The same change-of-variables idea &mdash; track the log-determinant of the
       Jacobian through invertible maps &mdash; became the backbone of an entire family of generative models:
       Real NVP, Inverse Autoregressive Flow, Glow, and continuous-time / neural-ODE flows. Beyond VAEs, flows
       are now used for density estimation, simulation-based inference, and as building blocks inside diffusion
       and probabilistic-programming systems. The lasting takeaway: an invertible map plus its log-determinant
       gives you a tractable, exact density &mdash; complexity without giving up the math.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 / &sect;3.1 (Normalizing Flows)</b> &mdash; the core idea. The <b>change-of-variables</b>
        formula (their <b>Equation 5</b>) and the flow log-density as a sum of log-determinant terms (their
        <b>Equations 6&ndash;7</b>). This is the math you transcribe and implement.</li>
        <li><b>&sect;4.1 (Invertible Linear-time Transformations)</b> &mdash; the <b>planar flow</b>
        $f(z) = z + u\\,h(w^{\\top}z + b)$ and its log-determinant, their <b>Equations 10&ndash;12</b>. This is the
        map you build by hand.</li>
        <li><b>&sect;4.2 (Flow-Based Free Energy Bound)</b> &mdash; how the flow plugs into the variational
        objective (their <b>Equation 15</b>): the same evidence lower bound as a VAE, but with the extra
        sum-of-log-determinants term from the flow.</li>
       </ul>
       <p><b>Skim:</b> &sect;5 (infinitesimal flows / the Langevin and Hamiltonian flow theory) and the MNIST /
       CIFAR experiments in &sect;6 unless you want them. The finite planar/radial flows in &sect;4 are all you
       need to understand and reproduce the headline effect.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will take a plain 2-D unit Gaussian (a round, symmetric blob of samples) and push it through a short
       chain of <b>planar flows</b> with fixed random parameters. Before you run it, predict: after a few flows,
       does the cloud of points stay a round Gaussian, or does it get <b>stretched / bent</b> into a different
       shape &mdash; and will the per-dimension <b>variance</b> (spread) stay near 1, or change a lot? Write your
       guess and one sentence of reasoning.</p>
       <p>(Hint: each planar flow adds a ridge $u\\,h(w^{\\top}z + b)$ that shoves points along direction $u$ by an
       amount that depends on where they sit. Does that preserve a round shape?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>The map.</b> A planar flow takes a point $z$ and returns $f(z) = z + u\\,h(w^{\\top}z + b)$, where
        $h = \\tanh$. TODO &mdash; write the forward pass in tensors: compute the scalar $a = w^{\\top}z + b$, then
        $z + u\\tanh(a)$.</li>
        <li><b>The log-determinant.</b> Each map changes the density. TODO &mdash; compute
        $\\psi(z) = h'(w^{\\top}z + b)\\,w$ (with $h'(a) = 1 - \\tanh^2 a$), then the per-point log-determinant term
        $\\ln|1 + u^{\\top}\\psi(z)|$.</li>
        <li><b>Track the density.</b> Start every point's log-density at the base Gaussian's
        $\\ln q_0(z_0)$. After each flow, TODO &mdash; <i>subtract</i> that flow's log-determinant term to get
        $\\ln q_K(z_K)$.</li>
        <li>TODO: why <i>subtract</i> the log-determinant rather than add it? (Look at the change-of-variables
        formula: the new density is divided by $|\\det \\partial f / \\partial z|$.)</li>
       </ul>
       <p>Then verify: compare your $\\ln q_K$ against the log-determinant of the flow's full Jacobian computed by
       autograd. They must match.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>The setup.</b> We have a simple density we can sample and score: a <b>unit Gaussian</b> $q_0(z_0)$ in,
       say, two dimensions. We want a more complex density. The plan: pass the samples through invertible maps and
       keep exact track of how the density changes.</p>
       <p><b>One invertible map.</b> Let $f$ be a smooth, invertible function, and let $z' = f(z)$. The
       <b>change-of-variables</b> rule from probability says the density does not just carry over &mdash; it gets
       rescaled by how much $f$ stretches or squeezes space locally. That local stretch factor is the absolute
       value of the <b>determinant of the Jacobian</b> of $f$. (The <b>Jacobian</b> is the matrix of all partial
       derivatives $\\partial f_i / \\partial z_j$; its <b>determinant</b> is the factor by which $f$ scales a tiny
       volume.) The paper writes this as their <b>Equation 5</b> (&sect;3.1):</p>
       <p>$$ q(z') = q(z)\\,\\Big|\\det \\frac{\\partial f}{\\partial z}\\Big|^{-1}. $$</p>
       <p>In words: where $f$ <i>spreads</i> points out (Jacobian determinant greater than 1), the density gets
       <i>thinner</i> (divided by a number bigger than 1); where $f$ <i>packs</i> points together, the density gets
       denser. Total probability stays 1.</p>
       <p><b>A flow: chain many maps.</b> Apply $K$ invertible maps in a row,
       $z_K = f_K \\circ \\cdots \\circ f_1(z_0)$. Take the logarithm of the change-of-variables rule at every step
       and add them up. The log-determinant terms simply <b>sum</b> (their <b>Equations 6&ndash;7</b>, &sect;3.1):</p>
       <p>$$ \\ln q_K(z_K) = \\ln q_0(z_0) - \\sum_{k=1}^{K} \\ln\\Big|\\det \\frac{\\partial f_k}{\\partial z_{k-1}}\\Big|. $$</p>
       <p>So if every map has a <b>cheap log-determinant</b>, we get the exact log-density of the final, complex
       variable for free. That is the whole point: complexity (from stacking maps) without losing the ability to
       score.</p>
       <p><b>The planar flow (the cheap map).</b> The paper's workhorse is
       $f(z) = z + u\\,h(w^{\\top}z + b)$ (&sect;4.1, <b>Equation 10</b>). Here $w$ and $u$ are vectors, $b$ is a
       scalar, and $h$ is a smooth nonlinearity (they use $\\tanh$). Geometrically it adds a "ridge": it shoves
       points along direction $u$ by an amount that depends, through $h$, on which side of the plane
       $w^{\\top}z + b = 0$ they fall. Its Jacobian is the identity plus a rank-one outer product, so its
       determinant collapses to a single scalar (&sect;4.1, <b>Equations 11&ndash;12</b>):</p>
       <p>$$ \\psi(z) = h'(w^{\\top}z + b)\\,w, \\qquad
            \\Big|\\det \\frac{\\partial f}{\\partial z}\\Big| = |1 + u^{\\top}\\psi(z)|. $$</p>
       <p>No matrix to factor &mdash; just a dot product and a logarithm. Stack a handful of these and the round
       Gaussian becomes a bent, possibly multi-peaked density, while we still know its exact log-density at every
       sample.</p>`,
    architecture:
      `<p><b>What is being built:</b> a flexible approximate posterior $q_K(z \\mid x)$ for amortized variational
       inference (a VAE), assembled as a <b>stack of invertible flow maps placed on top of a simple base
       posterior</b>. Data flows in one direction; the exact log-density is carried alongside.</p>
       <p><b>Block 1 &mdash; Inference network (encoder).</b> A neural network reads the data $x$ and outputs the
       parameters of the <b>base density</b> $q_0$: a mean-field Gaussian $\\mu(x), \\sigma(x)$ <i>plus</i> the
       per-step <b>flow parameters</b> $\\{(w_k, u_k, b_k)\\}_{k=1}^{K}$ (for planar flows) or
       $\\{(z_{0,k}, \\alpha_k, \\beta_k)\\}$ (for radial flows). The flow parameters are <b>amortized</b> &mdash;
       predicted by the encoder from $x$, not free per-datapoint variables.</p>
       <p><b>Block 2 &mdash; Base sample.</b> Draw $z_0 \\sim q_0 = \\mathcal{N}(\\mu(x), \\sigma(x)^2)$ via the
       reparameterization trick, and initialize its log-density $\\ln q_0(z_0)$.</p>
       <p><b>Block 3 &mdash; The flow stack (the novel part).</b> $K$ flow layers in series,
       $z_K = f_K \\circ \\cdots \\circ f_1(z_0)$. Each layer $f_k$:</p>
       <ul>
        <li>maps its input $z_{k-1}$ to $z_k = z_{k-1} + u_k\\,h(w_k^{\\top}z_{k-1} + b_k)$ (planar) &mdash; an
        elementwise add of a rank-one "ridge"; the layer changes the <i>shape</i> of the density but keeps the
        dimension $d$ unchanged;</li>
        <li>emits a scalar <b>log-determinant</b> $\\ln|1 + u_k^{\\top}\\psi_k(z_{k-1})|$, which is
        <b>subtracted</b> from the running $\\ln q$;</li>
        <li>passes $z_k$ to the next layer.</li>
       </ul>
       <p>A <b>radial</b> flow layer is the drop-in alternative: it contracts/expands points around a learned
       center $z_0$ instead of along a direction $u$.</p>
       <p><b>Block 4 &mdash; Decoder + objective.</b> The final $z_K$ feeds the generative model $p(x, z_K)$
       (the decoder). The whole thing is trained by minimizing the <b>flow-based free energy</b> $\\mathcal{F}(x)$
       (Eq 15): the usual VAE evidence lower bound with one extra term &mdash; the summed flow log-determinants.</p>
       <p><b>Data flow, end to end:</b>
       $x \\rightarrow$ encoder $\\rightarrow (\\mu, \\sigma, \\{w_k, u_k, b_k\\}) \\rightarrow z_0 \\sim q_0
       \\rightarrow f_1 \\rightarrow z_1 \\rightarrow \\cdots \\rightarrow f_K \\rightarrow z_K \\rightarrow$
       decoder $p(x \\mid z_K)$. Two quantities are propagated in parallel: the <b>sample</b> $z_k$ and its
       <b>running log-density</b> $\\ln q_k = \\ln q_0 - \\sum_{j\\le k}\\ln|\\det \\partial f_j|$. Cost per layer is
       $O(d)$ &mdash; one dot product and one logarithm &mdash; so depth $K$ is cheap to add.</p>`,
    symbols: [
      { sym: "$z_0$", desc: "a sample from the <b>base density</b> $q_0$ &mdash; here a 2-D unit Gaussian (a round symmetric blob, mean 0, variance 1 per dimension). This is the simple distribution we start from." },
      { sym: "$q_0(z_0)$", desc: "the <b>base density</b>: the probability density of the starting Gaussian, which we can sample and score in closed form." },
      { sym: "$f$ , $f_k$", desc: "an <b>invertible map</b> (a function with a well-defined inverse). $f_k$ is the $k$-th map in the chain. Invertibility is what lets the change-of-variables rule apply." },
      { sym: "$z_K$", desc: "the <b>final, transformed sample</b> after applying all $K$ maps: $z_K = f_K \\circ \\cdots \\circ f_1(z_0)$. Its density $q_K$ is the complex one we wanted." },
      { sym: "$q_K(z_K)$", desc: "the <b>flow density</b>: the exact probability density of the transformed variable, tracked via change of variables." },
      { sym: "Jacobian $\\partial f / \\partial z$", desc: "the <b>matrix of partial derivatives</b> of the map: entry $(i,j)$ is $\\partial f_i / \\partial z_j$. It describes how $f$ stretches space locally." },
      { sym: "$\\det(\\cdot)$ (determinant)", desc: "a single number computed from a square matrix that equals the <b>volume scaling factor</b> of the linear map it represents. The Jacobian determinant is how much $f$ scales a tiny volume at $z$." },
      { sym: "$\\ln|\\det \\partial f / \\partial z|$", desc: "the <b>log-determinant of the Jacobian</b>: the logarithm of the absolute volume-scaling factor. This is the per-step correction to the log-density." },
      { sym: "change of variables", desc: "the probability rule for how a density transforms under an invertible map: divide the old density by the absolute Jacobian determinant (Eqn 5). It conserves total probability." },
      { sym: "$w$ , $u$", desc: "the planar flow's <b>parameter vectors</b>: $w$ sets the orientation of the dividing plane $w^{\\top}z + b = 0$; $u$ is the direction along which points get pushed." },
      { sym: "$b$", desc: "the planar flow's scalar <b>bias</b>: it shifts the dividing plane." },
      { sym: "$h$ , $h'$", desc: "the smooth <b>nonlinearity</b> (the paper uses $h = \\tanh$) and its derivative $h'$ (for $\\tanh$, $h'(a) = 1 - \\tanh^2 a$)." },
      { sym: "$\\psi(z)$", desc: "a helper vector $\\psi(z) = h'(w^{\\top}z + b)\\,w$ (Eqn 11). It is the gradient of the ridge term; the planar log-determinant is built from it (Eqn 12)." },
      { sym: "$\\hat{u}$ , $m(\\cdot)$", desc: "the <b>reparameterized</b> $u$ that enforces invertibility (Appendix A.1): $\\hat{u} = u + [m(w^{\\top}u) - w^{\\top}u]\\,w/\\lVert w\\rVert^2$ with $m(x) = -1 + \\ln(1 + e^x)$. It pushes $w^{\\top}u \\ge -1$ so that $1 + u^{\\top}\\psi(z) \\gt 0$." },
      { sym: "$z_0$ (radial center)", desc: "for the <b>radial flow</b>: the <b>center point</b> around which the map contracts or expands. (Distinct from the base sample $z_0$ &mdash; same letter, different role.)" },
      { sym: "$\\alpha$ , $\\beta$", desc: "the radial flow's scalar parameters: $\\alpha \\gt 0$ sets the radius scale, and $\\beta$ sets the strength (and sign) of the radial push." },
      { sym: "$r$", desc: "the <b>radius</b> $r = \\lVert z - z_0 \\rVert$: the distance from a point to the radial flow's center." },
      { sym: "$h(\\alpha, r)$ , $h'(\\alpha,r)$", desc: "the radial flow's <b>radial kernel</b> $h(\\alpha, r) = 1/(\\alpha + r)$ and its derivative $h'(\\alpha,r) = -1/(\\alpha + r)^2$ (used in the radial log-determinant, Eq 14)." },
      { sym: "$d$", desc: "the <b>dimension</b> of $z$. It appears as the exponent $d-1$ in the radial flow's determinant, and sets the $O(d)$ cost of each planar/radial log-determinant." },
      { sym: "$\\mathcal{F}(x)$", desc: "the <b>free energy</b> / negative evidence lower bound (Eq 15): the variational objective minimized when the approximate posterior is a normalizing flow &mdash; the VAE bound plus the flow's summed log-determinant term." },
      { sym: "$p(x, z_K)$", desc: "the generative model's <b>joint density</b> of data $x$ and the flowed latent $z_K$; the decoder term in the free energy bound (Eq 15)." }
    ],
    formula:
      `<p>$$ q(z') = q(z)\\,\\Big|\\det \\frac{\\partial f^{-1}}{\\partial z'}\\Big| = q(z)\\,\\Big|\\det \\frac{\\partial f}{\\partial z}\\Big|^{-1} $$</p>
       <p>Change of variables for an invertible map $z' = f(z)$ &mdash; the new density is the old one divided by the absolute Jacobian determinant (Eq 5, &sect;3.1).</p>
       <p>$$ z_K = f_K \\circ \\cdots \\circ f_2 \\circ f_1(z_0), \\qquad
            \\ln q_K(z_K) = \\ln q_0(z_0) - \\sum_{k=1}^{K} \\ln\\Big|\\det \\frac{\\partial f_k}{\\partial z_{k-1}}\\Big| $$</p>
       <p>A flow of length $K$ and its log-density: the log-determinant corrections simply sum over the chain (Eqs 6&ndash;7, &sect;3.1).</p>
       <p>$$ \\mathbb{E}_{q_K}[\\,h(z)\\,] = \\mathbb{E}_{q_0}\\big[\\,h\\big(f_K \\circ \\cdots \\circ f_1(z_0)\\big)\\,\\big] $$</p>
       <p>Law of the unconscious statistician: expectations under the flow density are computed by sampling the base $q_0$ and pushing through the maps &mdash; no explicit $q_K$ needed (Eq 8, &sect;3.1).</p>
       <p>$$ f(z) = z + u\\,h(w^{\\top}z + b), \\qquad
            \\psi(z) = h'(w^{\\top}z + b)\\,w, \\qquad
            \\Big|\\det \\frac{\\partial f}{\\partial z}\\Big| = \\big|1 + u^{\\top}\\psi(z)\\big| $$</p>
       <p>The <b>planar flow</b>: a rank-one "ridge" map and its linear-time log-determinant via the matrix determinant lemma (Eqs 10&ndash;12, &sect;4.1).</p>
       <p>$$ \\hat{u}(w,u) = u + \\big[\\,m(w^{\\top}u) - (w^{\\top}u)\\,\\big]\\frac{w}{\\lVert w\\rVert^2}, \\qquad m(x) = -1 + \\ln(1 + e^{x}) $$</p>
       <p>Invertibility constraint for the planar flow: reparameterize $u$ so that $w^{\\top}u \\ge -1$, guaranteeing $1 + u^{\\top}\\psi(z) \\gt 0$ (Appendix A.1, &sect;4.1).</p>
       <p>$$ f(z) = z + \\beta\\,h(\\alpha, r)\\,(z - z_0), \\quad r = \\lVert z - z_0 \\rVert, \\;\\; h(\\alpha, r) = \\frac{1}{\\alpha + r} $$</p>
       <p>$$ \\Big|\\det \\frac{\\partial f}{\\partial z}\\Big| = \\big[1 + \\beta\\,h(\\alpha,r)\\big]^{d-1}\\,\\big[1 + \\beta\\,h(\\alpha,r) + \\beta\\,h'(\\alpha,r)\\,r\\big] $$</p>
       <p>The <b>radial flow</b>: contracts or expands points radially around a center $z_0$; its log-determinant is also a closed-form scalar (Eqs 13&ndash;14, &sect;4.1).</p>
       <p>$$ \\mathcal{F}(x) = \\mathbb{E}_{q_0(z_0)}\\big[\\ln q_0(z_0)\\big]
            - \\mathbb{E}_{q_0(z_0)}\\big[\\log p(x, z_K)\\big]
            - \\mathbb{E}_{q_0(z_0)}\\Big[\\sum_{k=1}^{K} \\ln\\big|1 + u_k^{\\top}\\psi_k(z_{k-1})\\big|\\Big] $$</p>
       <p>The <b>flow-based free energy bound</b>: the negative evidence lower bound minimized when the posterior is a planar flow &mdash; the standard VAE objective plus the flow's sum-of-log-determinants term (Eq 15, &sect;4.2).</p>`,
    whatItDoes:
      `<p><b>The flow log-density</b> (left, the paper's <b>Equations 6&ndash;7</b>) says: the log-density of the
       final variable equals the base log-density minus the running total of log-determinants, one per map. Each
       map bends the density and contributes one correction term. Because the terms simply add, you can stack as
       many maps as you like and still get an exact log-density &mdash; provided each map's log-determinant is
       cheap to compute.</p>
       <p><b>The planar flow</b> (right, the paper's <b>Equations 10&ndash;12</b>) is the cheap map that makes this
       practical. $f(z) = z + u\\,h(w^{\\top}z + b)$ adds a localized push. Its Jacobian is the identity plus a
       rank-one term $u\\,\\psi(z)^{\\top}$, and the determinant of "identity plus rank-one" is the famous matrix
       determinant lemma result $1 + u^{\\top}\\psi(z)$ &mdash; a single scalar. So the per-step correction is just
       $\\ln|1 + u^{\\top}\\psi(z)|$: one dot product, one logarithm, linear in the dimension. That is why these
       flows are called <b>linear-time</b>.</p>
       <p><b>The radial flow</b> (the paper's <b>Equations 13&ndash;14</b>) is the other linear-time map. Instead of
       pushing along a direction, $f(z) = z + \\beta\\,h(\\alpha, r)(z - z_0)$ contracts or expands points
       <i>radially</i> around a center $z_0$, by an amount that falls off with distance $r = \\lVert z - z_0\\rVert$.
       Its determinant is again closed-form: $[1 + \\beta h]^{d-1}[1 + \\beta h + \\beta h' r]$ &mdash; the $d-1$
       directions tangent to the sphere each scale by $1 + \\beta h$, and the one radial direction scales by
       $1 + \\beta h + \\beta h' r$.</p>
       <p><b>The invertibility constraint</b> (Appendix A.1) keeps the planar map one-to-one. For arbitrary $u$ the
       factor $1 + u^{\\top}\\psi(z)$ can hit zero; reparameterizing $u \\to \\hat{u}$ forces $w^{\\top}u \\ge -1$,
       which keeps it positive so the log is always defined.</p>
       <p><b>The free energy bound</b> (the paper's <b>Equation 15</b>) is where the flow earns its keep. Training a
       VAE minimizes the negative evidence lower bound $\\mathcal{F}(x)$. With a flow posterior it splits into three
       expectations under the easy base $q_0$: the base entropy term $\\mathbb{E}[\\ln q_0(z_0)]$, the
       reconstruction/prior term $-\\mathbb{E}[\\log p(x, z_K)]$ (evaluated at the flowed sample $z_K$), and the
       extra flow term $-\\mathbb{E}[\\sum_k \\ln|1 + u_k^{\\top}\\psi_k(z_{k-1})|]$ &mdash; the summed log-determinants.
       Every piece is an expectation over $q_0$, so it is estimated by sampling $z_0$ and pushing it through the
       flow (the law of the unconscious statistician, Eq 8).</p>`,
    derivation:
      `<p><b>Short recap &mdash; the change-of-variables machinery lives in the mod-normalizing-flows concept
       lesson.</b> Here we make the planar flow's log-determinant concrete. Start from the change-of-variables
       rule (Eqn 5): for an invertible $z' = f(z)$, $q(z') = q(z)\\,|\\det \\partial f / \\partial z|^{-1}$. Take
       logs and you get one correction term $-\\ln|\\det \\partial f / \\partial z|$ per map; chaining $K$ maps just
       sums these (Eqns 6&ndash;7), giving the formula above.</p>
       <p>Now the planar flow's Jacobian. Differentiate $f(z) = z + u\\,h(w^{\\top}z + b)$ with respect to $z$. The
       identity part contributes $I$. For the ridge, by the chain rule, $\\partial / \\partial z\\,[u\\,h(w^{\\top}z + b)]
       = u\\,h'(w^{\\top}z + b)\\,w^{\\top} = u\\,\\psi(z)^{\\top}$, where $\\psi(z) = h'(w^{\\top}z + b)\\,w$ (Eqn 11).
       So the Jacobian is</p>
       <p>$$ \\frac{\\partial f}{\\partial z} = I + u\\,\\psi(z)^{\\top}. $$</p>
       <p>This is the identity plus a <b>rank-one</b> outer product. The <b>matrix determinant lemma</b> says
       $\\det(I + u\\,v^{\\top}) = 1 + v^{\\top}u$ for vectors $u, v$. With $v = \\psi(z)$ that gives
       $\\det(\\partial f / \\partial z) = 1 + \\psi(z)^{\\top}u = 1 + u^{\\top}\\psi(z)$, hence the absolute
       log-determinant $\\ln|1 + u^{\\top}\\psi(z)|$ (Eqn 12). No matrix factorization &mdash; the whole determinant
       is one scalar, computable in linear time. (The paper adds a small constraint on $u$ so that
       $1 + u^{\\top}\\psi(z) > 0$ and the map stays invertible; for the toy demo with random parameters we just
       use the absolute value.)</p>`,
    example:
      `<p>Apply one planar flow to a single 2-D point and compute its log-determinant term by hand, so the formula
       is concrete. Use $h = \\tanh$. Take the point $z = (1.0,\\, 0.5)$ and the flow parameters
       $w = (1.0,\\, -1.0)$, $u = (2.0,\\, 0.0)$, $b = 0.5$.</p>
       <ul class="steps">
        <li><b>Pre-activation.</b> $a = w^{\\top}z + b = (1)(1.0) + (-1)(0.5) + 0.5 = 1.0 - 0.5 + 0.5 = 1.0$.</li>
        <li><b>Nonlinearity.</b> $h(a) = \\tanh(1.0) = 0.761594$. Its derivative
        $h'(a) = 1 - \\tanh^2(1.0) = 1 - 0.580026 = 0.419974$.</li>
        <li><b>Forward map.</b> $f(z) = z + u\\,h(a) = (1.0,\\,0.5) + (2.0,\\,0.0)(0.761594)
        = (1.0 + 1.523188,\\; 0.5 + 0) = (2.523188,\\; 0.5)$. The point moved along $u$ (the first axis); the
        second coordinate is unchanged because $u_2 = 0$.</li>
        <li><b>The helper $\\psi$.</b> $\\psi(z) = h'(a)\\,w = 0.419974 \\cdot (1.0,\\,-1.0)
        = (0.419974,\\; -0.419974)$.</li>
        <li><b>Dot product.</b> $u^{\\top}\\psi(z) = (2.0)(0.419974) + (0.0)(-0.419974) = 0.839949$.</li>
        <li><b>Log-determinant term.</b> $\\ln|1 + u^{\\top}\\psi(z)| = \\ln|1 + 0.839949| = \\ln(1.839949)
        = 0.609738$. The Jacobian determinant is $1.839949$ &mdash; this flow <i>spreads</i> volume out by about
        $1.84\\times$ near $z$, so the density there is divided by $1.84$, i.e. its log-density drops by
        $0.609738$.</li>
       </ul>
       <p>The notebook recomputes these exact numbers and cross-checks the log-determinant against the full
       Jacobian determinant from autograd &mdash; both give $0.609738$.</p>`,
    recipe:
      `<ol>
        <li><b>Base density.</b> Sample $z_0$ from a 2-D unit Gaussian; its log-density is
        $\\ln q_0(z_0) = -\\tfrac12 \\lVert z_0 \\rVert^2 - \\ln(2\\pi)$ (the standard 2-D normal).</li>
        <li><b>Build the planar flow</b> with <code>torch.nn</code>: a module holding parameters $w$, $u$, $b$. Its
        forward returns both the mapped point $f(z) = z + u\\tanh(w^{\\top}z + b)$ and the per-point log-determinant
        $\\ln|1 + u^{\\top}\\psi(z)|$ with $\\psi(z) = (1 - \\tanh^2(\\cdot))\\,w$ (Eqns 10&ndash;12).</li>
        <li><b>Compose $K$ flows.</b> Push the samples through the chain. Start each point's log-density at
        $\\ln q_0(z_0)$ and, after each flow, <b>subtract</b> that flow's log-determinant term &mdash; this is the
        flow log-density formula (Eqns 6&ndash;7).</li>
        <li><b>Verify the change of variables.</b> Pick one sample. Compute the full flow's Jacobian with
        <code>torch.autograd.functional.jacobian</code>, take $\\ln|\\det|$, and confirm it equals the sum of the
        per-flow log-determinants. The tracked $\\ln q_K$ must match $\\ln q_0 - \\ln|\\det J_{\\text{full}}|$.</li>
        <li><b>Reproduce the effect.</b> Compare the base cloud to the flowed cloud: the round Gaussian becomes
        stretched / curved, and the per-dimension variance changes &mdash; a richer density.</li>
        <li><b>Ablate.</b> Drop the log-determinant term (pretend every flow has determinant 1) and watch the
        change-of-variables check break: the tracked density no longer matches autograd.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): normalizing flows give "flexible, arbitrarily complex and scalable approximate
       posterior distributions," and the paper demonstrates "that the theoretical advantages of having posteriors
       that better match the true posterior, combined with the scalability of amortized variational approaches,
       provides a clear improvement in performance and applicability of variational inference." (Abstract)</p>
       <p>In the experiments (&sect;6) the authors train flow posteriors on binarized MNIST and other data and
       report improved variational bounds as the number of flows $K$ grows. We do not quote specific bound numbers
       here because the focus of this lesson is the mechanism.</p>
       <p><i>These are the paper's own statements, quoted from the abstract. The numbers in the CODE and CODEVIZ
       panels below are from our own tiny CPU run with fixed random flow parameters &mdash; not the paper's reported
       results.</i></p>`,

    evaluation:
      `<p><b>What you measure.</b> A flow is a density, so the right metric is a <b>likelihood</b>, not an accuracy.
       In the VAE setting (the paper's actual setup, &sect;6), the number to track is the <b>flow-based free energy</b>
       $\\mathcal{F}(x)$ (Eq 15) &mdash; the negative evidence lower bound &mdash; on held-out data. The baseline to
       beat is the <b>same VAE with no flow</b> ($K = 0$, a plain mean-field Gaussian posterior): adding flows should
       <i>lower</i> $\\mathcal{F}$ (tighter bound). The paper's qualitative claim is that the bound improves as the
       number of flows $K$ grows (&sect;6); reuse that as your direction-of-travel, not a fixed target.</p>
       <p><b>Sanity checks before any training.</b> This lesson's core is the change-of-variables bookkeeping, and it
       has an exact, cheap oracle &mdash; run it first:</p>
       <ul>
        <li><b>Jacobian cross-check.</b> For one sample, confirm your tracked
        $\\ln q_K = \\ln q_0 - \\sum_k \\ln|\\det \\partial f_k|$ equals $\\ln q_0 - \\ln|\\det J_{\\text{full}}|$ from
        <code>torch.autograd.functional.jacobian</code>. They must agree to ~5 decimals (the lesson hits
        $-3.82672$ vs $-3.82672$). Disagreement means the log-determinant is wrong or has the wrong sign.</li>
        <li><b>Known-answer unit test.</b> Reproduce the worked example: $z=(1,0.5)$, $w=(1,-1)$, $u=(2,0)$, $b=0.5$
        must give log-determinant $0.609738$. A single hard number catches most bugs.</li>
        <li><b>Degenerate flow = identity.</b> Set $u = 0$. Then $f(z) = z$, every log-determinant is
        $\\ln|1| = 0$, and $\\ln q_K$ must equal $\\ln q_0$ exactly. If it drifts, your accumulation is leaking.</li>
        <li><b>Density integrates to 1.</b> On a 2-D grid, $\\sum \\exp(\\ln q_K)\\,\\Delta A \\approx 1$. A flow whose
        "density" does not normalize is not a valid flow &mdash; usually a dropped or double-counted Jacobian term.</li>
       </ul>
       <p><b>Expected range (rule of thumb, not a paper claim).</b> The Jacobian cross-check is exact, so demand a
       match to $\\le 10^{-4}$, not "roughly." For the VAE bound, expect a modest but real improvement from the first
       few flows that tapers as $K$ grows; the paper reports gains with increasing $K$ (&sect;6) but no single number
       we can quote for your dataset. A bound that gets <i>worse</i> as you add flows means the flow is fighting the
       objective &mdash; almost always a sign error in the log-determinant.</p>
       <p><b>Ablation &mdash; prove the Jacobian term earns its keep.</b> The paper's central object is the
       <b>sum-of-log-determinants</b> correction. Turn it off: set $\\ln q_K = \\ln q_0$ (pretend every map has
       determinant 1). The change-of-variables cross-check must now <i>break</i> &mdash; the mismatch equals exactly the
       dropped $\\sum_k \\ln|\\det \\partial f_k|$, and the "density" no longer integrates to 1. If your check still
       passes with the term removed, your flows are accidentally near-identity (e.g. $u \\approx 0$ or tiny
       parameters) and are not actually bending the density. Separately, ablate <b>depth</b>: $K = 0$ should collapse
       to the mean-field VAE and lose the bound improvement.</p>
       <p><b>Failure signals &amp; what they mean.</b> <i>Tracked $\\ln q_K$ off by a constant ratio from autograd</i>
       &rarr; you <b>added</b> the log-determinant instead of subtracting (off by $2\\times$ the term) &mdash; the rule
       <i>divides</i> by $|\\det|$, so subtract in log-space. <i>$\\ln(\\text{non-positive})$ &rarr; NaN</i> &rarr;
       $1 + u^{\\top}\\psi(z) \\le 0$ for some point; constrain $u$ via the $\\hat{u}$ reparameterization (Appendix A.1)
       or take $\\ln|\\cdot|$ with small parameters in the toy demo. <i>Cross-check fails only after several flows</i>
       &rarr; you evaluated $\\psi$ at the map's <b>output</b> $f(z)$ instead of its <b>input</b> $z$. <i>Flowed cloud
       stays a round Gaussian</i> (variance unchanged from the base ~1) &rarr; flows are effectively identity; the
       reshaping you should see is the deformation in this lesson's CODEVIZ scatter (per-dim variance moving from
       ~$[1.02, 0.82]$ to ~$[1.27, 8.10]$).</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The plumbing already ships in PyTorch, so you
       <b>import</b> it and build only the novel composition. <b>Import:</b> <code>nn.Module</code> /
       <code>nn.Parameter</code> to hold $w, u, b$, the tensor ops (<code>tanh</code>, matrix-vector products),
       and <code>torch.autograd.functional.jacobian</code> as the oracle. <b>Build by hand:</b> the <b>planar
       flow</b> &mdash; its forward map $f(z) = z + u\\,h(w^{\\top}z + b)$ <i>and</i> its log-determinant
       $\\ln|1 + u^{\\top}\\psi(z)|$ &mdash; and the <b>change-of-variables bookkeeping</b> that accumulates
       $\\ln q_K = \\ln q_0 - \\sum_k \\ln|\\det \\partial f_k|$ across the chain. That accumulation, and the
       linear-time log-determinant, are the paper's contribution; PyTorch will not track the density for you. The
       general change-of-variables theory is recapped from the <b>mod-normalizing-flows</b> concept lesson, not
       re-derived here.</p>`,
    pitfalls:
      `<ul>
        <li><b>Adding the log-determinant instead of subtracting it.</b> The change-of-variables rule
        <i>divides</i> the density by $|\\det \\partial f / \\partial z|$, so in log-space you <b>subtract</b>
        $\\ln|\\det|$. Add it by mistake and your tracked $\\ln q_K$ will be wrong by twice the log-determinant.
        <b>Fix:</b> $\\ln q_K = \\ln q_0 - \\sum_k \\ln|\\det \\partial f_k|$.</li>
        <li><b>Evaluating $\\psi$ at the wrong point.</b> $\\psi(z) = h'(w^{\\top}z + b)\\,w$ must use the
        <b>input</b> $z$ to that flow (the point <i>before</i> the map), not the output $f(z)$. Using the output
        gives the wrong Jacobian. <b>Fix:</b> compute the log-determinant from the pre-map $z$ inside each flow's
        forward.</li>
        <li><b>Forgetting the absolute value / log of a non-positive number.</b> $1 + u^{\\top}\\psi(z)$ can be
        $\\le 0$ for arbitrary $u$, and $\\ln$ of that is undefined. The paper constrains $u$ so the map stays
        invertible ($1 + u^{\\top}\\psi(z) > 0$); for a toy demo with random parameters, take $\\ln|\\cdot|$ and
        keep parameters small. <b>Fix:</b> use the absolute value, or apply the paper's reparameterization of
        $u$.</li>
        <li><b>Confusing the Jacobian determinant with the Jacobian.</b> The correction is a single scalar
        (the determinant's log), not the whole matrix. For the planar flow you never build the matrix at all
        &mdash; the rank-one structure collapses it to $1 + u^{\\top}\\psi(z)$.</li>
        <li><b>Assuming any function is a valid flow.</b> The map must be <b>invertible</b> for change of
        variables to apply. A non-invertible $f$ can collapse volume to zero (determinant 0), and $\\ln 0$ blows
        up &mdash; the density is no longer well-defined.</li>
      </ul>`,
    recall: [
      "Write the change-of-variables flow log-density $\\ln q_K(z_K)$ in terms of $\\ln q_0$ and the log-determinants (Eqns 6-7).",
      "State the planar flow $f(z)$ and its log-determinant term (Eqns 10-12), and define $\\psi(z)$.",
      "In log-space, do you add or subtract the log-determinant of the Jacobian, and why?",
      "What property must every map $f_k$ have for the change-of-variables rule to apply, and what goes wrong without it?"
    ],
    practice: [
      {
        q: `<b>The log-determinant ablation.</b> You have a working planar flow that tracks
            $\\ln q_K = \\ln q_0 - \\sum_k \\ln|\\det \\partial f_k|$ and matches autograd. You now <i>drop</i> the
            log-determinant term &mdash; you set $\\ln q_K = \\ln q_0$, as if every map had determinant 1. What
            breaks, and why is this not just a small error?`,
        steps: [
          { do: `Remove the running subtraction: stop accumulating $\\ln|1 + u^{\\top}\\psi(z)|$ per flow.`, why: `Without the term you are claiming each map preserves volume exactly ($\\det = 1$), which a planar flow does not &mdash; it stretches and squeezes space.` },
          { do: `Re-run the change-of-variables check against the autograd Jacobian determinant of the full flow.`, why: `The tracked $\\ln q_K$ now equals $\\ln q_0$, but the true value is $\\ln q_0 - \\ln|\\det J_{\\text{full}}|$. The mismatch equals the dropped log-determinant.` },
          { do: `Note the consequence for VI: the density is no longer normalized, so the variational bound it feeds is invalid.`, why: `A flow's whole value is an <b>exact</b> density; drop the Jacobian term and you no longer have a valid density at all.` }
        ],
        answer: `<p>Dropping the log-determinant assumes every map preserves volume ($\\det = 1$), which a planar
                 flow does not. The tracked $\\ln q_K$ collapses to $\\ln q_0$ and stops matching the autograd
                 Jacobian determinant &mdash; the error is exactly the missing $\\sum_k \\ln|\\det \\partial f_k|$.
                 This is not a small mistake: the log-determinant is what makes the transformed density a
                 <b>valid, normalized</b> density. Without it the "density" does not integrate to 1, and any
                 variational bound built on it is meaningless. The Jacobian term <i>is</i> the flow.</p>`
      },
      {
        q: `Why does the <b>planar flow</b> have a log-determinant that costs only $O(d)$ (linear in the dimension
            $d$), when a general invertible map's Jacobian determinant costs $O(d^3)$ to compute?`,
        steps: [
          { do: `Write the planar Jacobian: $\\partial f / \\partial z = I + u\\,\\psi(z)^{\\top}$, the identity plus a rank-one outer product.`, why: `The ridge term $u\\,h(w^{\\top}z+b)$ depends on $z$ only through the scalar $w^{\\top}z$, so its derivative is the single outer product $u\\,\\psi(z)^{\\top}$.` },
          { do: `Apply the matrix determinant lemma: $\\det(I + u\\,v^{\\top}) = 1 + v^{\\top}u$.`, why: `For a rank-one update the determinant collapses to a single scalar &mdash; no $d \\times d$ factorization needed.` },
          { do: `Count the cost: one dot product $u^{\\top}\\psi(z)$ is $O(d)$; one $\\ln$ is $O(1)$.`, why: `A general determinant needs an $O(d^3)$ LU factorization; the rank-one structure avoids it entirely.` }
        ],
        answer: `<p>Because the planar Jacobian is "identity plus rank-one," $I + u\\,\\psi(z)^{\\top}$. The matrix
                 determinant lemma turns the determinant of any rank-one update into a single scalar,
                 $1 + u^{\\top}\\psi(z)$ &mdash; one dot product, $O(d)$, plus a logarithm. A general $d \\times d$
                 Jacobian determinant needs an $O(d^3)$ factorization. The whole design of the planar (and radial)
                 flows is to pick maps whose Jacobian has special structure so the determinant stays cheap; that is
                 what lets you stack many of them.</p>`
      },
      {
        q: `In the worked example you had $z = (1.0, 0.5)$, $w = (1.0, -1.0)$, $u = (2.0, 0.0)$, $b = 0.5$, giving
            $a = 1.0$, $\\psi(z) = (0.419974, -0.419974)$, $u^{\\top}\\psi = 0.839949$, and log-determinant
            $0.609738$. Now change $u$ to $u = (0.0, 2.0)$ (push along the <i>second</i> axis instead). Recompute
            $u^{\\top}\\psi(z)$ and the log-determinant. What does the result tell you?`,
        steps: [
          { do: `Note $a$, $h'(a)$, and $\\psi(z)$ are unchanged: they depend only on $w, b, z$, not on $u$. So $\\psi(z) = (0.419974, -0.419974)$ still.`, why: `$u$ does not enter the pre-activation $w^{\\top}z + b$ or the helper $\\psi$ &mdash; only the forward push and the dot product.` },
          { do: `Compute the new dot product: $u^{\\top}\\psi = (0.0)(0.419974) + (2.0)(-0.419974) = -0.839949$.`, why: `Pushing along the second axis, where $\\psi$ is negative, flips the sign of the dot product.` },
          { do: `Compute the log-determinant: $\\ln|1 + (-0.839949)| = \\ln|0.160051| = \\ln(0.160051) = -1.832$.`, why: `Now $1 + u^{\\top}\\psi = 0.160 < 1$, so the map <b>compresses</b> volume here and the log-determinant is negative.` }
        ],
        answer: `<p>With $u = (0.0, 2.0)$: $\\psi(z)$ is unchanged at $(0.419974, -0.419974)$, but
                 $u^{\\top}\\psi = -0.839949$, so $1 + u^{\\top}\\psi = 0.160051$ and the log-determinant is
                 $\\ln(0.160051) \\approx -1.832$. The sign flipped: the original $u$ <b>spread</b> volume out
                 (determinant $1.84 > 1$, positive log-determinant), while this $u$ <b>compresses</b> it
                 (determinant $0.16 < 1$, negative log-determinant). The same flow can locally expand or contract
                 the density depending on how $u$ aligns with $\\psi(z)$ &mdash; and that is exactly the freedom
                 that lets stacked planar flows sculpt a complex shape. (Note $0.160 > 0$, so this map is still
                 invertible here.)</p>`
      }
    ]
  });

  window.CODE["paper-normalizing-flows-vi"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> the model with <code>torch.nn</code> (an <code>nn.Module</code> holding the
       planar flow parameters $w, u, b$), then build the <b>novel</b> part by hand &mdash; the planar flow's
       forward map and its linear-time log-determinant, plus the change-of-variables bookkeeping that tracks the
       exact log-density through the chain. The first cell recomputes the worked example
       ($z=(1,0.5)$, $w=(1,-1)$, $u=(2,0)$, $b=0.5 \\to$ log-determinant $0.609738$) and cross-checks it against
       the full Jacobian determinant from <code>torch.autograd.functional.jacobian</code> (the oracle). We then
       push a 2-D unit Gaussian through $K=3$ planar flows with fixed random parameters, accumulate
       $\\ln q_K = \\ln q_0 - \\sum_k \\ln|\\det \\partial f_k|$, and verify on a single sample that this matches
       $\\ln q_0 - \\ln|\\det J_{\\text{full}}|$ from autograd. Finally we show the flow <b>reshapes</b> the density:
       the round Gaussian's per-dimension variance changes a lot. CPU, instant. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, math, numpy as np
torch.manual_seed(0); np.random.seed(0)

# --- 0. Worked example: ONE planar flow on a 2-D point, by hand, vs autograd. ---
# f(z) = z + u * tanh(w^T z + b);  psi(z) = (1 - tanh^2(a)) * w;  logdet = ln|1 + u^T psi|.
z = torch.tensor([1.0, 0.5]); w = torch.tensor([1.0, -1.0]); u = torch.tensor([2.0, 0.0]); b = 0.5
a = (w @ z) + b                              # pre-activation w^T z + b = 1.0
h = torch.tanh(a)
hp = 1 - h*h                                 # h'(a) = 1 - tanh^2(a)
fz = z + u * h
psi = hp * w                                 # psi(z) = h'(a) * w  (Eqn 11)
uTpsi = (u @ psi).item()
logdet = math.log(abs(1 + uTpsi))            # ln|1 + u^T psi|     (Eqn 12)
print("worked example: a=%.1f  tanh=%.6f  h'=%.6f" % (a.item(), h.item(), hp.item()))
print("  f(z)=%s  psi=%s" % ([round(v,6) for v in fz.tolist()], [round(v,6) for v in psi.tolist()]))
print("  u^T psi=%.6f   logdet=ln|1+u^T psi|=%.6f" % (uTpsi, logdet))
# ORACLE: log-determinant from the full Jacobian via autograd.
def f_one(zz): return zz + u * torch.tanh((w @ zz) + b)
J = torch.autograd.functional.jacobian(f_one, z.clone().requires_grad_(True))
print("  autograd ln|det J| = %.6f   (matches)" % math.log(abs(torch.det(J).item())))
# worked example: a=1.0  tanh=0.761594  h'=0.419974
#   f(z)=[2.523188, 0.5]  psi=[0.419974, -0.419974]
#   u^T psi=0.839949   logdet=ln|1+u^T psi|=0.609738
#   autograd ln|det J| = 0.609738   (matches)


# --- 1. The planar flow as an nn.Module (Eqns 10-12). Forward returns f(z) AND log|det|. ---
class PlanarFlow(nn.Module):
    def __init__(self, dim=2):
        super().__init__()
        self.w = nn.Parameter(torch.randn(dim) * 1.5)
        self.u = nn.Parameter(torch.randn(dim) * 1.5)
        self.b = nn.Parameter(torch.randn(1))
    def forward(self, z):                    # z: (N, dim)
        a   = z @ self.w + self.b            # (N,)  pre-activation
        h   = torch.tanh(a)
        fz  = z + h.unsqueeze(-1) * self.u   # Eqn 10
        psi = (1 - h*h).unsqueeze(-1) * self.w               # Eqn 11
        logdet = torch.log(torch.abs(1 + psi @ self.u))      # Eqn 12: ln|1 + u^T psi|
        return fz, logdet

# --- 2. Compose K=3 flows; track ln q_K = ln q_0 - sum_k ln|det| (change of variables, Eqns 6-7). ---
torch.manual_seed(1)
K = 3; flows = nn.ModuleList([PlanarFlow(2) for _ in range(K)])
N = 50
z0 = torch.randn(N, 2)
log_q = -0.5*(z0**2).sum(-1) - math.log(2*math.pi)          # ln q_0 for 2-D unit Gaussian
z = z0
for flow in flows:
    z, ld = flow(z)
    log_q = log_q - ld                       # SUBTRACT each flow's log-determinant

# --- 3. Verify change of variables on one sample against the full-flow autograd Jacobian. ---
def full_flow(zz):
    cur = zz
    for flow in flows:
        cur = cur + torch.tanh(cur @ flow.w + flow.b) * flow.u
    return cur
Jf = torch.autograd.functional.jacobian(full_flow, z0[0].clone().requires_grad_(True))
lq0_0 = (-0.5*(z0[0]**2).sum() - math.log(2*math.pi)).item()
print("\\nchange-of-variables check (sample 0):")
print("  ln q_K via flow logdet  = %.6f" % log_q[0].item())
print("  ln q_K via autograd det = %.6f" % (lq0_0 - math.log(abs(torch.det(Jf).item()))))

# --- 4. The effect: a round Gaussian becomes a stretched / curved density. ---
print("\\nbase  z0   per-dim variance:", [round(v,3) for v in z0.var(0).tolist()])
print("flowed z_K per-dim variance:", [round(v,3) for v in z.var(0).tolist()])
# change-of-variables check (sample 0):
#   ln q_K via flow logdet  = -3.826720
#   ln q_K via autograd det = -3.826719   <- matches to 5 decimals
# base  z0   per-dim variance: [1.329, 0.709]
# flowed z_K per-dim variance: [1.491, 8.651]   <- density reshaped by the flow
# (Our small CPU run with fixed random flow params, not the paper's reported numbers.)`
  };

  window.CODEVIZ["paper-normalizing-flows-vi"] = {
    question: "When we push a 2-D unit Gaussian through a few planar flows, does the round blob actually deform into a more complex density — and does our tracked log-density agree with autograd?",
    charts: [
      {
        type: "scatter",
        title: "A unit Gaussian (base) vs after 3 planar flows — the round blob is stretched and bent",
        xlabel: "dimension 1",
        ylabel: "dimension 2",
        series: [
          {
            name: "base q0 (unit Gaussian)",
            color: "#7ee787",
            points: [[1.879,-0.072],[0.158,-0.773],[0.199,0.046],[0.153,-0.476],[-0.111,0.293],[-0.158,-0.029],[2.357,-1.037],[1.575,-0.63],[-0.927,0.545],[0.066,-0.437],[0.763,0.442],[1.165,2.015],[0.984,0.879],[-1.45,-1.18],[0.41,0.408],[0.258,1.095],[1.326,0.855],[-0.281,0.7],[-1.457,1.609],[0.094,-1.26]]
          },
          {
            name: "flowed q3 (after 3 planar flows)",
            color: "#ff7b72",
            points: [[1.665,3.622],[0.736,-2.462],[-0.04,-0.307],[0.687,-1.978],[-0.517,-0.616],[0.047,-1.997],[2.377,2.176],[1.452,2.444],[-1.172,-1.849],[0.567,-2.17],[0.266,2.535],[0.882,5.416],[0.608,3.728],[-1.252,-5.037],[-0.239,1.417],[-0.442,2.116],[1.051,4.257],[-1.05,0.32],[-2.381,0.867],[0.625,-3.333]]
          }
        ]
      }
    ],
    caption: "Our small CPU run with fixed random flow parameters, not the paper's reported numbers. A 2-D unit Gaussian (base q0, mean 0, variance ~1 per dimension) is pushed through K=3 planar flows f(z)=z+u&middot;tanh(w&#8868;z+b) with fixed random w,u,b. The round green blob is stretched and bent into the red shape: per-dimension variance moves from roughly [1.02, 0.82] to [1.27, 8.10] &mdash; the second axis spread grows ~10&times;. Crucially, the exact log-density is tracked through the chain via change of variables, ln q_K = ln q_0 &minus; &Sigma; ln|det &part;f_k|; on a held-out sample this matches the full-Jacobian autograd log-determinant to 5 decimals (&minus;3.82672 vs &minus;3.82672). Complexity from stacking maps, with the density still exact.",
    code: `import torch, torch.nn as nn, math, numpy as np
torch.manual_seed(0); np.random.seed(0)

class PlanarFlow(nn.Module):
    def __init__(self, dim=2):
        super().__init__()
        self.w = nn.Parameter(torch.randn(dim)*1.5)
        self.u = nn.Parameter(torch.randn(dim)*1.5)
        self.b = nn.Parameter(torch.randn(1))
    def forward(self, z):
        a = z @ self.w + self.b; h = torch.tanh(a)
        fz = z + h.unsqueeze(-1) * self.u                      # Eqn 10
        psi = (1 - h*h).unsqueeze(-1) * self.w                 # Eqn 11
        logdet = torch.log(torch.abs(1 + psi @ self.u))        # Eqn 12
        return fz, logdet

torch.manual_seed(1)
K = 3; flows = nn.ModuleList([PlanarFlow(2) for _ in range(K)])
N = 20
z0 = torch.randn(N, 2)
log_q = -0.5*(z0**2).sum(-1) - math.log(2*math.pi)            # ln q_0
z = z0
for flow in flows:
    z, ld = flow(z); log_q = log_q - ld                       # Eqns 6-7

# verify change of variables on one sample vs autograd full-Jacobian
def full(zz):
    c = zz
    for fl in flows: c = c + torch.tanh(c @ fl.w + fl.b) * fl.u
    return c
J = torch.autograd.functional.jacobian(full, z0[0].clone().requires_grad_(True))
lq0 = (-0.5*(z0[0]**2).sum() - math.log(2*math.pi)).item()
print("ln q_K flow   :", round(log_q[0].item(), 5))
print("ln q_K autograd:", round(lq0 - math.log(abs(torch.det(J).item())), 5))
print("base  var:", [round(v,3) for v in z0.var(0).tolist()])
print("flowed var:", [round(v,3) for v in z.var(0).tolist()])
print("base  pts:", [[round(a,3) for a in p] for p in z0.tolist()])
print("flowed pts:", [[round(a,3) for a in p] for p in z.tolist()])
# ln q_K flow   : -3.82672
# ln q_K autograd: -3.82672    <- change of variables verified
# base  var: [1.017, 0.822]    flowed var: [1.267, 8.096]
# Our small run with fixed random flow params, not the paper's number.`
  };
})();