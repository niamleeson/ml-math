/* Paper lesson — "Weight Uncertainty in Neural Networks" (Bayes by Backprop),
   Blundell, Cornebise, Kavukcuoglu, Wierstra, ICML 2015. Self-contained:
   lesson + CODE + CODEVIZ merged by id "paper-bayes-by-backprop".
   GROUNDED from arXiv:1505.05424 (abstract) and the ar5iv HTML mirror
   (Section 3 variational free energy Eqn. 1; Section 3.1 Monte-Carlo objective
   Eqn. 2 + Proposition 1; Section 3.2 Gaussian posterior + reparameterised
   sampling w = mu + softplus(rho) * eps; Section 3.3 scale-mixture prior Eqn. 7;
   Section 3.4 minibatch KL reweighting; Section 5.2 the 1-D regression curves).
   Track B (architecture): compose linear layers with torch.nn, then implement the
   NOVEL part by hand — variational Bayesian weights (a learned mean + std per
   weight, sampled with the reparameterization trick) trained on the ELBO. */
(function () {
  window.LESSONS.push({
    id: "paper-bayes-by-backprop",
    title: "Bayes by Backprop — Weight Uncertainty in Neural Networks (2015)",
    tagline: "Give every weight a learned mean and spread, and train the whole distribution by backprop.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Charles Blundell, Julien Cornebise, Koray Kavukcuoglu, Daan Wierstra",
      org: "Google DeepMind",
      year: 2015,
      venue: "arXiv:1505.05424 (May 2015); ICML 2015",
      citations: "",
      arxiv: "https://arxiv.org/abs/1505.05424",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-backprop", "ml-gradient-descent", "pt-autograd", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>An ordinary neural network keeps <b>one fixed number</b> for each weight. After training it answers
       every question with full confidence, even far from anything it ever saw. That is dangerous: the network
       cannot tell you "I do not know here." It has no notion of how <i>uncertain</i> each weight is, so it has no
       notion of how uncertain its predictions are.</p>
       <p>The Bayesian fix is to keep a whole <b>probability distribution</b> over the weights instead of a single
       value. But the exact Bayesian answer (the true posterior over weights given the data) is impossible to
       compute for a real network. From the abstract:</p>
       <blockquote>"We introduce a new, efficient, principled and backpropagation-compatible algorithm for learning
       a probability distribution on the weights of a neural network." (Abstract)</blockquote>
       <p>The open question they answer: can we learn a useful distribution over weights using nothing more exotic
       than ordinary backpropagation and gradient descent?</p>`,
    contribution:
      `<ul>
        <li><b>Every weight becomes a small distribution.</b> Instead of one number per weight, the network stores
        a <b>mean</b> $\\mu$ (the typical value) and a <b>spread</b> $\\sigma$ (how uncertain that weight is). These
        two numbers per weight are what we train.</li>
        <li><b>Train it with plain backprop via the reparameterization trick.</b> To get a gradient through a random
        sample, they write each sampled weight as $w = \\mu + \\sigma \\cdot \\epsilon$ with $\\epsilon$ a fixed
        random draw. Now the randomness sits in $\\epsilon$ and the gradient flows cleanly into $\\mu$ and $\\sigma$.
        This is "Bayes by Backprop."</li>
        <li><b>One clean objective: the variational free energy (the ELBO).</b> Training minimizes a single cost
        that balances <i>fitting the data</i> against <i>staying close to a simple prior</i> on the weights. The
        trained spreads $\\sigma$ then encode weight uncertainty, which turns into honest <b>predictive
        uncertainty</b> that grows away from the data.</li>
      </ul>`,
    whyItMattered:
      `<p>Bayes by Backprop made Bayesian neural networks practical: no special sampler, no second-order machinery,
       just one extra parameter per weight and ordinary gradient descent. It is the canonical example of <b>mean-field
       variational inference</b> for deep networks &mdash; "mean-field" meaning each weight gets its own independent
       little Gaussian. The same reparameterization trick it leans on also powers the variational autoencoder, and
       the idea that a network can report calibrated uncertainty seeded a large literature on Bayesian deep learning,
       safe exploration in reinforcement learning, and out-of-distribution detection. When people say a model "knows
       what it does not know," this is one of the foundational recipes.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Being Bayesian by Backprop)</b> &mdash; the cost function. The <b>variational free energy</b>
        / evidence lower bound, their <b>Equation 1</b>. This is the loss you transcribe and implement.</li>
        <li><b>&sect;3.1 (Proposition 1 and Equation 2)</b> &mdash; why a sampled (Monte-Carlo) estimate of the cost
        still gives an unbiased gradient, through the reparameterization trick. Equation 2 is the practical objective.</li>
        <li><b>&sect;3.2 (Gaussian variational posterior)</b> &mdash; the core mechanic: each weight is
        $w = \\mu + \\sigma \\odot \\epsilon$ with $\\sigma = \\log(1+\\exp(\\rho))$ (the <b>softplus</b>, kept
        positive). The boxed optimisation steps are exactly what you will code.</li>
        <li><b>&sect;3.3 (Scale mixture prior, Equation 7)</b> &mdash; the prior $P(\\mathbf{w})$ they put on weights.
        Skim the exact form; we use a simpler single Gaussian prior in code.</li>
        <li><b>&sect;5.2 (Regression curves)</b> &mdash; the 1-D toy you will reproduce: confidence intervals diverge
        where there is no data.</li>
       </ul>
       <p><b>Skim:</b> &sect;3.4 (the minibatch KL reweighting trick), &sect;5.1 (MNIST classification), and &sect;5.3
       (the reinforcement-learning bandit) unless you want those experiments.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a small network on a 1-D regression where data exists only in a <b>central band</b> of the
       $x$-axis &mdash; the far left and far right are empty. Each weight has a learned spread $\\sigma$, so at test
       time you can sample many networks and look at how much their predictions <i>disagree</i>. Where will that
       disagreement (the predictive spread) be <b>largest</b>: inside the data band, or out in the empty regions
       far from any training point? Write your guess and one sentence of reasoning.</p>
       <p>(Hint: in the data band, the likelihood term pins the weights down. Out where no data constrains the
       network, what keeps the sampled networks agreeing with each other?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the Bayesian weight you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Replace each ordinary weight tensor with <b>two</b> parameters: a mean <code>w_mu</code> and a raw
        spread <code>w_rho</code>. Recover a positive standard deviation with
        <code>sigma = softplus(w_rho)</code> &mdash; that is $\\sigma = \\log(1+\\exp(\\rho))$.</li>
        <li>TODO &mdash; in the forward pass, <b>sample</b> a weight:
        <code>w = w_mu + sigma * torch.randn_like(sigma)</code>. Why draw fresh
        <code>torch.randn_like</code> noise every forward pass rather than reusing one draw?</li>
        <li>TODO &mdash; write the loss. It is <b>two parts</b>: a likelihood cost (how badly the sampled net fits
        the data) plus a complexity cost (a Kullback&ndash;Leibler term pulling each weight's $(\\mu,\\sigma)$
        toward a simple prior). Which part grows when $\\sigma$ shrinks to zero?</li>
        <li>TODO &mdash; at test time, run the net many times and take the per-point standard deviation of the
        outputs. That is your predictive uncertainty band.</li>
       </ul>
       <p>Then build the ablation: clamp every $\\sigma$ to (almost) zero, turning each weight back into a single
       number, and re-measure the predictive band. Predict what happens to the uncertainty.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>The whole method rests on three moves: <b>(1)</b> give each weight a distribution, <b>(2)</b> sample it
       so backprop can train it, and <b>(3)</b> optimize one balanced cost.</p>
       <p><b>1. Each weight is a tiny Gaussian.</b> Replace the single number $w$ with a mean $\\mu$ and a standard
       deviation $\\sigma$. Together, all the $\\mu$ and $\\sigma$ form the <b>variational posterior</b>
       $q(\\mathbf{w}\\,|\\,\\theta)$ &mdash; our trainable approximation to the true (intractable) Bayesian
       posterior over weights. Here $\\theta = (\\mu, \\rho)$ are the numbers we actually store and learn. To keep
       $\\sigma$ positive without a constraint, the paper stores a raw number $\\rho$ and sets
       $\\sigma = \\log(1+\\exp(\\rho))$ &mdash; the <b>softplus</b> function, a smooth always-positive map
       (&sect;3.2).</p>
       <p><b>2. Sample with the reparameterization trick.</b> To run the network we need an actual weight, so we
       draw one. Naively sampling $w \\sim \\mathcal{N}(\\mu,\\sigma^2)$ blocks gradients &mdash; you cannot
       differentiate "through" a random draw. The fix (&sect;3.2): draw a <i>fixed</i> standard-normal noise
       $\\epsilon \\sim \\mathcal{N}(0, I)$ and build the weight deterministically,
       $w = \\mu + \\sigma \\cdot \\epsilon$. Now all the randomness lives in $\\epsilon$, and $w$ is a plain
       differentiable function of $\\mu$ and $\\sigma$, so ordinary backprop computes
       $\\partial w / \\partial \\mu$ and $\\partial w / \\partial \\sigma$.</p>
       <p><b>3. Optimize the variational free energy (the ELBO).</b> Training minimizes one cost
       $\\mathcal{F}(\\mathcal{D}, \\theta)$ with two parts (&sect;3, Equation 1): a <b>complexity cost</b>
       &mdash; the Kullback&ndash;Leibler divergence $\\text{KL}[\\,q(\\mathbf{w}|\\theta)\\,\\|\\,P(\\mathbf{w})\\,]$
       pulling the weight distribution toward a simple prior $P(\\mathbf{w})$ &mdash; minus a <b>likelihood
       reward</b> $\\mathbb{E}_{q}[\\log P(\\mathcal{D}|\\mathbf{w})]$, how well the sampled weights explain the
       data. We cannot evaluate that expectation exactly, so we replace it by a <b>Monte-Carlo</b> estimate: draw
       a few weight samples and average (&sect;3.1, Equation 2). Proposition 1 (&sect;3.1) shows the gradient of
       this sampled cost is still <b>unbiased</b> &mdash; it points, on average, the right way.</p>
       <p>The payoff: where data is plentiful, the likelihood term forces small $\\sigma$ &mdash; the weights are
       pinned down, predictions are confident. Where data is absent, only the prior speaks, the $\\sigma$ stay
       large, and sampled networks disagree &mdash; so predictive uncertainty <b>grows away from the data</b>
       (&sect;5.2).</p>`,
    architecture:
      `<p>Bayes by Backprop is not a new network topology &mdash; it is a <b>drop-in replacement for the weights</b> of
       any feed-forward net. The structure is best read as one Bayesian layer, then the loss it feeds.</p>
       <p><b>The Bayesian linear layer (&sect;3.2).</b> An ordinary linear layer of shape $n_{\\text{out}} \\times
       n_{\\text{in}}$ stores one weight matrix $W$ and one bias $b$. A Bayesian layer <b>doubles</b> the parameters:
       for every scalar weight it stores a mean $\\mu$ and a raw spread $\\rho$ (so two tensors $\\mu_W, \\rho_W$ of
       shape $n_{\\text{out}} \\times n_{\\text{in}}$, plus $\\mu_b, \\rho_b$ of shape $n_{\\text{out}}$). On each
       forward pass it (1) maps $\\rho$ to a positive $\\sigma = \\log(1+\\exp(\\rho))$, (2) draws fresh noise
       $\\epsilon \\sim \\mathcal{N}(0,I)$ of the same shape, (3) forms the sampled weight
       $w = \\mu + \\sigma\\circ\\epsilon$, and (4) applies the usual $W x + b$. It also exposes a $\\text{KL}(\\cdot)$
       method returning the closed-form Gaussian KL of its $(\\mu,\\sigma)$ against the prior.</p>
       <p><b>The network.</b> Stack these layers exactly like ordinary ones. The lesson uses
       $1 \\to 64 \\to 64 \\to 1$ with ReLU between the hidden layers, but the recipe is topology-agnostic &mdash; the
       paper's MNIST nets are deeper (e.g. two hidden layers of 400&ndash;1200 units, &sect;5.1). The whole network's
       KL is just the <b>sum</b> of its layers' KL terms.</p>
       <p><b>Data flow per training step.</b> input $x$ &rarr; sample all layer weights (one $\\epsilon$ draw per
       layer) &rarr; forward to a prediction &rarr; likelihood cost $-\\log P(\\mathcal{D}|\\mathbf{w})$ (for Gaussian
       regression, scaled squared error) &rarr; add the summed KL (optionally reweighted per minibatch, &sect;3.4)
       &rarr; one <code>.backward()</code> &rarr; Adam step on every $\\mu$ and $\\rho$. At <b>test time</b> the
       sampling does double duty: run the net $S$ times on the same input and the per-point standard deviation of the
       $S$ outputs is the <b>predictive uncertainty</b>.</p>`,
    symbols: [
      { sym: "$w$", desc: "a single <b>weight</b> of the network. In an ordinary network this is one fixed number; here it is a random draw from a small Gaussian." },
      { sym: "$\\mu$", desc: "the <b>mean</b> of a weight's distribution &mdash; its typical (most likely) value. One $\\mu$ per weight, and it is trainable." },
      { sym: "$\\sigma$", desc: "the <b>standard deviation</b> (spread) of a weight's distribution &mdash; how uncertain that weight is. Larger $\\sigma$ means less sure. One $\\sigma$ per weight." },
      { sym: "$\\rho$", desc: "the <b>raw parameter</b> we actually store for the spread. We map it to a positive $\\sigma$ via the softplus $\\sigma = \\log(1+\\exp(\\rho))$, so $\\sigma$ can never go negative (&sect;3.2)." },
      { sym: "$\\epsilon$", desc: "<b>standard-normal noise</b>, $\\epsilon \\sim \\mathcal{N}(0, I)$ (mean 0, variance 1). Drawn fresh each forward pass; it carries the randomness so the weight stays differentiable." },
      { sym: "$\\theta$", desc: "the full set of <b>variational parameters</b> $(\\mu, \\rho)$ across all weights &mdash; everything we train. Not to be confused with the weights $\\mathbf{w}$ themselves." },
      { sym: "$q(\\mathbf{w}\\,|\\,\\theta)$", desc: "the <b>variational posterior</b>: our trainable approximate distribution over all weights $\\mathbf{w}$, built from the per-weight Gaussians. \"Variational\" = we tune $\\theta$ to make $q$ a good stand-in for the true posterior." },
      { sym: "$P(\\mathbf{w})$", desc: "the <b>prior</b> over weights &mdash; a simple distribution chosen before seeing data (the paper uses a scale mixture of two Gaussians, &sect;3.3; we use a single Gaussian in code)." },
      { sym: "$P(\\mathcal{D}\\,|\\,\\mathbf{w})$", desc: "the <b>likelihood</b>: how probable the training data $\\mathcal{D}$ is under a given set of weights $\\mathbf{w}$. Higher means the weights fit the data better." },
      { sym: "$\\mathcal{D}$", desc: "the <b>training data</b> (all input&ndash;target pairs)." },
      { sym: "$f(\\mathbf{w},\\theta)$", desc: "the <b>per-sample cost</b> $\\log q(\\mathbf{w}|\\theta) - \\log P(\\mathbf{w}) - \\log P(\\mathcal{D}|\\mathbf{w})$ &mdash; one Monte-Carlo draw's contribution to the free energy $\\mathcal{F}$ (&sect;3.1)." },
      { sym: "$n$", desc: "the <b>number of Monte-Carlo samples</b> of the weights used to approximate the expectation in Eqn. 2 (the code uses 2)." },
      { sym: "$t(\\theta,\\epsilon)$", desc: "the <b>deterministic transform</b> that builds a weight from the parameters and the noise; here $t(\\theta,\\epsilon) = \\mu + \\sigma\\circ\\epsilon$. Used to state Proposition 1." },
      { sym: "$\\Delta_{\\mu},\\ \\Delta_{\\rho}$", desc: "the <b>gradients</b> of the cost with respect to the mean $\\mu$ and the raw spread $\\rho$ (Eqns. 3&ndash;4); the parameters step against these." },
      { sym: "$\\alpha$", desc: "the <b>learning rate</b> in the update $\\mu \\leftarrow \\mu - \\alpha\\Delta_{\\mu}$, $\\rho \\leftarrow \\rho - \\alpha\\Delta_{\\rho}$ (Eqns. 5&ndash;6)." },
      { sym: "$\\circ$", desc: "<b>elementwise (Hadamard) multiplication</b> &mdash; each weight's $\\sigma$ multiplies its own noise $\\epsilon$." },
      { sym: "$\\pi$", desc: "the <b>mixing weight</b> of the scale-mixture prior (Eqn. 7): the probability mass on the broad Gaussian vs the narrow one." },
      { sym: "$\\sigma_1,\\ \\sigma_2$", desc: "the two <b>prior standard deviations</b> in the scale mixture (Eqn. 7): $\\sigma_1$ broad, $\\sigma_2 \\ll 1$ a narrow spike around zero." },
      { sym: "$M$", desc: "the <b>number of minibatches</b> the data is split into for the KL reweighting scheme (&sect;3.4)." },
      { sym: "$\\mathcal{D}_i,\\ \\pi_i$", desc: "the $i$-th <b>minibatch</b> and its <b>KL weight</b> $\\pi_i = 2^{M-i}/(2^{M}-1)$, with $\\sum_i \\pi_i = 1$ (&sect;3.4)." },
      { sym: "“KL divergence”", desc: "Kullback&ndash;Leibler divergence, written $\\text{KL}[q\\,\\|\\,P]$: a non-negative number measuring how far the distribution $q$ is from the distribution $P$. Zero only when they are identical. Here it is the complexity cost." },
      { sym: "“ELBO”", desc: "the <b>evidence lower bound</b>: a quantity that lower-bounds the data's log-probability. Maximizing it (equivalently, minimizing the variational free energy $\\mathcal{F}$) is the training objective." },
      { sym: "“reparameterization”", desc: "rewriting a random draw $w \\sim \\mathcal{N}(\\mu,\\sigma^2)$ as a deterministic function of fixed noise, $w = \\mu + \\sigma\\epsilon$, so gradients can pass through the sample into $\\mu$ and $\\sigma$." }
    ],
    formula: `$$ \\mathcal{F}(\\mathcal{D}, \\theta) \\;=\\; \\underbrace{\\text{KL}\\big[\\,q(\\mathbf{w}\\,|\\,\\theta)\\;\\|\\;P(\\mathbf{w})\\,\\big]}_{\\text{complexity cost}} \\;-\\; \\underbrace{\\mathbb{E}_{q(\\mathbf{w}|\\theta)}\\!\\big[\\log P(\\mathcal{D}\\,|\\,\\mathbf{w})\\big]}_{\\text{likelihood cost}} $$
       <p>Eqn. 1, &sect;3 &mdash; the <b>variational free energy</b> (negative ELBO). The exact training objective: a KL complexity cost against the prior, minus the expected log-likelihood of the data.</p>

       $$ \\mathcal{F}(\\mathcal{D}, \\theta) \\;\\approx\\; \\sum_{i=1}^{n} \\log q(\\mathbf{w}^{(i)}\\,|\\,\\theta) \\;-\\; \\log P(\\mathbf{w}^{(i)}) \\;-\\; \\log P(\\mathcal{D}\\,|\\,\\mathbf{w}^{(i)}) $$
       <p>Eqn. 2, &sect;3.1 &mdash; the <b>Monte-Carlo cost</b>. The intractable expectation is replaced by an average over $n$ weight samples $\\mathbf{w}^{(i)} \\sim q(\\mathbf{w}|\\theta)$; write $f(\\mathbf{w},\\theta) = \\log q(\\mathbf{w}|\\theta) - \\log P(\\mathbf{w}) - \\log P(\\mathcal{D}|\\mathbf{w})$ for one sample's cost.</p>

       $$ \\frac{\\partial}{\\partial \\theta}\\, \\mathbb{E}_{q(\\mathbf{w}|\\theta)}\\!\\big[f(\\mathbf{w},\\theta)\\big] \\;=\\; \\mathbb{E}_{q(\\epsilon)}\\!\\left[\\frac{\\partial f(\\mathbf{w},\\theta)}{\\partial \\mathbf{w}}\\,\\frac{\\partial \\mathbf{w}}{\\partial \\theta} \\;+\\; \\frac{\\partial f(\\mathbf{w},\\theta)}{\\partial \\theta}\\right] $$
       <p>Proposition 1, &sect;3.1 &mdash; the <b>unbiased gradient estimator</b>. If a weight is written $\\mathbf{w} = t(\\theta, \\epsilon)$ with $\\epsilon \\sim q(\\epsilon)$ independent of $\\theta$, the derivative of the expectation equals the expectation of the derivative, so a sampled gradient is unbiased.</p>

       $$ \\mathbf{w} \\;=\\; \\mu \\;+\\; \\log(1+\\exp(\\rho))\\,\\circ\\,\\epsilon, \\qquad \\epsilon \\sim \\mathcal{N}(0, I) $$
       <p>&sect;3.2 &mdash; the <b>reparameterized Gaussian weight</b>. The spread is $\\sigma = \\log(1+\\exp(\\rho))$ (softplus, kept positive); $\\circ$ is elementwise multiply; the variational parameters are $\\theta = (\\mu, \\rho)$.</p>

       $$ \\Delta_{\\mu} \\;=\\; \\frac{\\partial f(\\mathbf{w},\\theta)}{\\partial \\mathbf{w}} + \\frac{\\partial f(\\mathbf{w},\\theta)}{\\partial \\mu}, \\qquad \\Delta_{\\rho} \\;=\\; \\frac{\\partial f(\\mathbf{w},\\theta)}{\\partial \\mathbf{w}}\\,\\frac{\\epsilon}{1+\\exp(-\\rho)} + \\frac{\\partial f(\\mathbf{w},\\theta)}{\\partial \\rho} $$
       <p>Eqns. 3&ndash;4, &sect;3.2 &mdash; the <b>gradient updates</b> for the mean and the raw spread. The shared factor $\\partial f/\\partial \\mathbf{w}$ "is exactly the gradients found by the usual backpropagation algorithm"; the rest are cheap chain-rule terms. Parameters then step $\\mu \\leftarrow \\mu - \\alpha\\Delta_{\\mu}$, $\\rho \\leftarrow \\rho - \\alpha\\Delta_{\\rho}$ (Eqns. 5&ndash;6).</p>

       $$ P(\\mathbf{w}) \\;=\\; \\prod_{j} \\Big[\\, \\pi\\,\\mathcal{N}(\\mathbf{w}_j \\,|\\, 0, \\sigma_1^2) \\;+\\; (1-\\pi)\\,\\mathcal{N}(\\mathbf{w}_j \\,|\\, 0, \\sigma_2^2) \\,\\Big] $$
       <p>Eqn. 7, &sect;3.3 &mdash; the <b>scale-mixture prior</b>. Each weight is independently drawn from a mix of two zero-mean Gaussians: a broad one ($\\sigma_1$) and a narrow spike ($\\sigma_2 \\ll 1$), with mixing weight $\\pi$. (Our code uses a single $\\mathcal{N}(0,1)$ for simplicity.)</p>

       $$ \\mathcal{F}_i^{\\pi}(\\mathcal{D}_i, \\theta) \\;=\\; \\pi_i\\,\\text{KL}\\big[q(\\mathbf{w}|\\theta)\\,\\|\\,P(\\mathbf{w})\\big] \\;-\\; \\mathbb{E}_{q(\\mathbf{w}|\\theta)}\\!\\big[\\log P(\\mathcal{D}_i|\\mathbf{w})\\big], \\qquad \\pi_i = \\frac{2^{M-i}}{2^{M}-1} $$
       <p>Eqns. 8&ndash;9, &sect;3.4 &mdash; the <b>minibatch KL reweighting</b>. Across $M$ minibatches with $\\pi \\in [0,1]^M$ and $\\sum_{i=1}^{M}\\pi_i = 1$, the per-batch costs sum to the full $\\mathcal{F}$ in expectation: $\\mathbb{E}_M[\\sum_i \\mathcal{F}_i^{\\pi}] = \\mathcal{F}(\\mathcal{D},\\theta)$. The geometric weights $\\pi_i$ lean on the prior early and the data later.</p>`,
    whatItDoes:
      `<p><b>Eqn. 1 (the objective).</b> The <b>variational free energy</b> (negative ELBO) is a tug-of-war between
       two terms. The <b>complexity cost</b> $\\text{KL}[q\\,\\|\\,P]$ measures how far the learned weight distribution
       $q$ has drifted from the prior $P$ &mdash; a regularizer that resists overconfident weights and lets the
       spreads $\\sigma$ stay <b>large</b> when nothing forces them smaller. The <b>likelihood cost</b>
       $-\\mathbb{E}_q[\\log P(\\mathcal{D}|\\mathbf{w})]$ rewards weights that explain the data; for Gaussian-noise
       regression it is the (sampled) squared error scaled by the noise. It pulls the $\\mu$ toward a good fit and
       shrinks $\\sigma$ wherever data pins the weights down.</p>
       <p><b>Eqn. 2 (making it computable).</b> The expectation $\\mathbb{E}_q[\\cdot]$ has no closed form, so we draw
       $n$ weight samples and average their per-sample cost $f(\\mathbf{w},\\theta)$. Crucially, the <i>same</i>
       sampled $\\mathbf{w}$ appears in all three log-terms, so the KL is estimated by Monte Carlo too &mdash; the
       method never needs a closed-form KL (though our simple Gaussian-vs-Gaussian code uses one).</p>
       <p><b>Proposition 1 (why the sampled gradient is trustworthy).</b> Naively, differentiating an expectation
       whose distribution depends on $\\theta$ is hard. Writing the weight as $\\mathbf{w} = t(\\theta,\\epsilon)$
       with $\\epsilon$ drawn from a fixed noise distribution moves the $\\theta$-dependence <i>inside</i> $f$, so the
       gradient of the expectation equals the expectation of the gradient. A single noisy draw is therefore an
       <b>unbiased</b> estimate of the true gradient &mdash; it points the right way on average.</p>
       <p><b>The reparameterized sample and Eqns. 3&ndash;4 (the actual updates).</b> Each weight is built
       deterministically as $\\mathbf{w} = \\mu + \\log(1+\\exp(\\rho))\\circ\\epsilon$. The gradients
       $\\Delta_{\\mu}, \\Delta_{\\rho}$ then share one factor, $\\partial f/\\partial \\mathbf{w}$, which is exactly
       what ordinary backprop already computes for the weight; the extra pieces (a $+1$ for $\\mu$, and the softplus
       derivative $\\epsilon/(1+e^{-\\rho})$ for $\\rho$) are cheap chain-rule factors. So "Bayes by Backprop" really
       is just backprop plus two scalar multiplies per weight.</p>
       <p><b>Eqn. 7 (the prior).</b> Rather than one Gaussian, the paper puts a <b>scale mixture</b> on each weight:
       a broad Gaussian ($\\sigma_1$) that permits large weights, plus a narrow spike ($\\sigma_2 \\ll 1$) that pulls
       most weights toward zero &mdash; a soft, differentiable "spike-and-slab" sparsity prior.</p>
       <p><b>Eqns. 8&ndash;9 (minibatching).</b> With minibatches the single whole-network KL must not be counted once
       per batch. The fix weights the KL by $\\pi_i$ on batch $i$, with $\\sum_i \\pi_i = 1$, so that across an epoch
       the reweighted batch costs sum (in expectation) to the full free energy. The geometric choice
       $\\pi_i = 2^{M-i}/(2^{M}-1)$ front-loads the prior (large $\\pi_1$) and lets the data dominate later batches.
       Our code uses the simpler full-batch $\\text{KL}/N$ scaling.</p>`,
    derivation:
      `<p>Where does Equation 1 come from? We want the true Bayesian posterior over weights,
       $P(\\mathbf{w}|\\mathcal{D})$, but it is intractable. So we pick a tractable family $q(\\mathbf{w}|\\theta)$
       (independent Gaussians) and tune $\\theta$ to make $q$ as close as possible to the true posterior. "As close
       as possible" means minimizing the KL divergence from $q$ to the posterior:</p>
       <p>$$ \\theta^{\\star} = \\arg\\min_{\\theta} \\; \\text{KL}\\big[\\,q(\\mathbf{w}|\\theta)\\;\\|\\;P(\\mathbf{w}|\\mathcal{D})\\,\\big]. $$</p>
       <p>Expand the posterior with Bayes' rule, $P(\\mathbf{w}|\\mathcal{D}) \\propto P(\\mathcal{D}|\\mathbf{w})\\,P(\\mathbf{w})$.
       Substituting and dropping the constant $\\log P(\\mathcal{D})$ (it does not depend on $\\theta$) turns that
       KL into exactly the variational free energy of Equation 1:</p>
       <p>$$ \\mathcal{F}(\\mathcal{D},\\theta) = \\text{KL}\\big[q(\\mathbf{w}|\\theta)\\,\\|\\,P(\\mathbf{w})\\big] - \\mathbb{E}_{q}\\big[\\log P(\\mathcal{D}|\\mathbf{w})\\big]. $$</p>
       <p>Minimizing $\\mathcal{F}$ over $\\theta$ is therefore the same as making $q$ match the true posterior.
       To get a gradient, the paper's <b>Proposition 1</b> (&sect;3.1) uses the reparameterization $w = \\mu + \\sigma\\epsilon$:
       moving the randomness into $\\epsilon$ lets the derivative pass inside the expectation, giving an
       <b>unbiased</b> Monte-Carlo gradient. In practice each weight sample's gradient
       $\\partial f / \\partial w$ "is exactly the gradient found by the usual backpropagation algorithm" (&sect;3.2)
       &mdash; backprop computes it for free; we only add the chain-rule factors that route it into $\\mu$ and
       $\\rho$.</p>`,
    example:
      `<p>Work the two core pieces by hand on a single weight: <b>(a)</b> sample it with the reparameterization
       trick, and <b>(b)</b> compute its KL complexity cost. Take $\\mu = 0.1$, raw spread $\\rho = -2.0$, and a
       fixed noise draw $\\epsilon = 0.5$. Use a standard-normal prior $P(w) = \\mathcal{N}(0, 1)$, so prior
       standard deviation $\\sigma_0 = 1$.</p>
       <ul class="steps">
        <li><b>Recover the spread.</b> $\\sigma = \\log(1+\\exp(\\rho)) = \\log(1 + e^{-2}) = \\log(1.13534)
        = 0.12693$. (Softplus keeps it positive.)</li>
        <li><b>Sample the weight.</b> $w = \\mu + \\sigma\\,\\epsilon = 0.1 + 0.12693 \\times 0.5 = 0.1 + 0.06346
        = 0.16346$. That is one differentiable draw of this weight.</li>
        <li><b>KL complexity cost</b> for one Gaussian weight against a $\\mathcal{N}(0,\\sigma_0^2)$ prior has the
        closed form $\\;\\log\\dfrac{\\sigma_0}{\\sigma} + \\dfrac{\\sigma^2 + \\mu^2}{2\\sigma_0^2} - \\dfrac12$.
        Plug in $\\sigma_0 = 1$, $\\sigma = 0.12693$, $\\mu = 0.1$:</li>
        <li>$\\log\\dfrac{1}{0.12693} = 2.0644$; &nbsp; $\\dfrac{0.12693^2 + 0.1^2}{2} = \\dfrac{0.016111 + 0.01}{2}
        = 0.013056$; &nbsp; so $\\text{KL} = 2.0644 + 0.013056 - 0.5 = 1.5774$.</li>
        <li><b>Read it.</b> The KL is positive: this weight's distribution is far from the prior, mostly because its
        spread $\\sigma = 0.127$ is much tighter than the prior's $\\sigma_0 = 1$ (the $\\log(\\sigma_0/\\sigma)$
        term dominates). The complexity cost would push $\\sigma$ back up unless data justifies the tightness.</li>
       </ul>
       <p>These exact numbers ($\\sigma = 0.12693$, $w = 0.16346$, $\\text{KL} = 1.577$) are recomputed in the
       notebook's first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build a Bayesian linear layer.</b> Compose with <code>torch.nn</code>: store two parameters per
        weight tensor, a mean <code>w_mu</code> and a raw spread <code>w_rho</code>; same for the bias. Recover
        $\\sigma = $ <code>softplus(w_rho)</code>.</li>
        <li><b>Sample in the forward pass.</b> Draw $\\epsilon \\sim \\mathcal{N}(0,I)$ with
        <code>torch.randn_like</code> and form $w = \\mu + \\sigma\\,\\epsilon$ (the reparameterization trick),
        then run the usual linear operation. Fresh noise every call.</li>
        <li><b>Add a KL method</b> to each layer: the closed-form Gaussian KL of every weight against the prior,
        summed.</li>
        <li><b>Stack layers</b> into a small network (1 input &rarr; 64 &rarr; 64 &rarr; 1, ReLU).</li>
        <li><b>Make 1-D data in a central band only</b>, leaving the edges empty (paper's regression target,
        &sect;5.2).</li>
        <li><b>Train on the ELBO:</b> likelihood cost (sampled mean-squared error scaled by the noise level) plus
        $\\text{KL}/N$ (the complexity cost, averaged over the $N$ data points). One <code>.backward()</code>, one
        Adam step (&sect;3.2).</li>
        <li><b>Measure predictive uncertainty:</b> at test time run the net many times, take the per-point standard
        deviation of the outputs, and compare it inside vs far from the data band. <b>Ablate</b> by clamping every
        $\\sigma \\to 0$ and re-measuring.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted), Bayes by Backprop gives "comparable performance to dropout" on MNIST and
       "improved generalization in non-linear regression." On MNIST (&sect;5.1) the paper reports test error in the
       <b>1.32&ndash;1.36%</b> range for the scale-mixture variant, versus <b>1.33&ndash;1.51%</b> for dropout and
       <b>1.83&ndash;1.88%</b> for plain stochastic gradient descent (quoted from &sect;5.1).</p>
       <p>The result this lesson reproduces is the <b>regression curves</b> (&sect;5.2). On the 1-D toy
       $y = x + 0.3\\sin(2\\pi(x{+}\\epsilon)) + 0.3\\sin(4\\pi(x{+}\\epsilon)) + \\epsilon$, the paper observes that
       "where there are no data, the confidence intervals diverge, reflecting there being many possible
       extrapolations" &mdash; whereas a standard network drives its variance to zero and extrapolates
       overconfidently (quoted/paraphrased from &sect;5.2).</p>
       <p><i>These are the paper's own statements, quoted from the abstract and &sect;5.1&ndash;5.2. The numbers in
       the CODEVIZ panel below are from our own tiny run on the 1-D regression task &mdash; not the paper's reported
       results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The plumbing already ships in PyTorch, so you <b>import</b>
       it and build only the novel part. <b>Import:</b> <code>torch.nn.Parameter</code> for the trainable tensors,
       <code>torch.nn.functional.linear</code> / <code>softplus</code> for the layer math, and
       <code>torch.optim.Adam</code>. <b>Build by hand:</b> the <b>variational Bayesian weight</b> &mdash; the
       per-weight mean and spread, the reparameterized sample $w = \\mu + \\sigma\\,\\epsilon$, the closed-form KL
       term, and the ELBO loss that combines KL with the likelihood. That is the paper's contribution; PyTorch has
       no "Bayesian linear layer" built in, so the sampling and the free-energy objective are yours to write. The
       general idea of a prior / posterior / KL is standard probability, recapped inline (this lesson has no
       separate concept owner).</p>`,
    pitfalls:
      `<ul>
        <li><b>Sampling without reparameterization.</b> If you draw <code>w = torch.normal(mu, sigma)</code>
        directly, the gradient cannot flow into <code>mu</code> and <code>sigma</code> &mdash; the random draw
        breaks the graph and the network never learns its spreads. <b>Fix:</b> build the weight as
        <code>mu + sigma * torch.randn_like(sigma)</code> so the randomness sits in detached noise.</li>
        <li><b>Letting $\\sigma$ go negative or training $\\sigma$ directly.</b> A standard deviation must be
        positive. <b>Fix:</b> store the raw $\\rho$ and pass it through <code>softplus</code>; never optimize
        $\\sigma$ as a free parameter.</li>
        <li><b>Mis-scaling the KL against the likelihood.</b> The likelihood cost sums over all $N$ data points but
        the KL is a single whole-network term. If you weight them wrong, either the KL crushes the fit (everything
        stays at the prior) or it vanishes (no uncertainty). <b>Fix:</b> use the KL <i>once per pass</i> and the
        summed likelihood, or scale the KL by $1/N$ as we do &mdash; and be consistent.</li>
        <li><b>Reusing one noise draw for the whole batch / epoch.</b> Each forward pass needs a fresh $\\epsilon$,
        or the Monte-Carlo estimate is biased and the spreads never get a proper gradient signal. <b>Fix:</b> draw
        new <code>randn_like</code> noise every call.</li>
        <li><b>Reading the predictive band from one forward pass.</b> A single sample is just one network; the
        uncertainty lives in the <i>spread across many samples</i>. <b>Fix:</b> run the net many times at test and
        take the per-point standard deviation.</li>
      </ul>`,
    recall: [
      "Write the variational free energy $\\mathcal{F}(\\mathcal{D},\\theta)$ (Eqn. 1) from memory and name its two terms.",
      "Write the reparameterized weight sample and say why it is used instead of sampling $w$ directly.",
      "Define $\\mu$, $\\sigma$, and $\\rho$, and give the map from $\\rho$ to $\\sigma$.",
      "Where is predictive uncertainty largest on the 1-D regression, and which term in $\\mathcal{F}$ lets it stay large there?"
    ],
    practice: [
      {
        q: `<b>The uncertainty ablation.</b> You have a trained Bayes-by-Backprop network whose predictive band
            widens far from the data. You now clamp every weight's raw spread to a very negative value
            (<code>w_rho.fill_(-30.0)</code>), so $\\sigma = $ <code>softplus(-30)</code> $\\approx 0$, and re-measure
            the predictive band. What did you just turn the network into, and what happens to the uncertainty far
            from the data?`,
        steps: [
          { do: `Compute $\\sigma$ after the clamp: <code>softplus(-30)</code> $\\approx 9\\times 10^{-14}$, effectively zero.`, why: `Every weight collapses to a single fixed number $w = \\mu + 0\\cdot\\epsilon = \\mu$, so the distribution over weights becomes a point.` },
          { do: `Sample the net many times and take the per-point standard deviation of the outputs.`, why: `With no spread in the weights, every forward pass produces the <i>same</i> output, so the cross-sample standard deviation is zero everywhere.` },
          { do: `Compare to before the clamp.`, why: `The Bayesian net's band grew far from data; the clamped net's band is flat zero &mdash; an ordinary, overconfident network.` }
        ],
        answer: `<p>Clamping $\\sigma \\to 0$ turns each weight back into a <b>single number</b> &mdash; an ordinary
                 deterministic network. Every forward pass is now identical, so the predictive standard deviation is
                 <b>zero everywhere</b>, including far from the data where it should be large. In our run the
                 far-from-data band collapses from $\\approx 0.26$ to $0.000000$. This is exactly the overconfident
                 extrapolation the paper contrasts against (&sect;5.2): the learned spreads $\\sigma$ are what carry
                 the uncertainty, and removing them removes the network's ability to say "I do not know here."</p>`
      },
      {
        q: `Why does the predictive band stay <b>narrow inside the data band</b> but <b>widen in the empty regions</b>,
            even though all weights share the same prior?`,
        steps: [
          { do: `Recall the two costs: likelihood (fit the data) and KL complexity (stay near the prior).`, why: `Inside the data band, fitting the points requires the network's output there to be pinned down, which forces the relevant weight spreads $\\sigma$ small. The likelihood term dominates.` },
          { do: `Reason about the empty regions: no data point constrains the output there.`, why: `Only the prior speaks, so the KL term keeps the spreads $\\sigma$ comparatively large; many different weight settings are equally consistent with the data.` },
          { do: `Translate weight spread into output spread: large $\\sigma$ on the weights means sampled networks disagree most where they are least constrained.`, why: `Predictive uncertainty is the spread of outputs across weight samples, so it grows exactly where the weights remain uncertain &mdash; far from data.` }
        ],
        answer: `<p>Because the data only constrains the network <i>where the data is</i>. In the central band the
                 likelihood cost forces the relevant weights to tight spreads, so sampled networks agree and the band
                 is narrow. In the empty regions no likelihood term pulls on the output, so the KL leaves those weight
                 spreads large and the sampled networks fan out &mdash; the band widens. Same prior everywhere; what
                 differs is how much data pins each region down. In our run the mean predictive standard deviation is
                 $\\approx 0.015$ inside the data versus $\\approx 0.26$ far away &mdash; about $17\\times$ wider.</p>`
      },
      {
        q: `In the worked example you had $\\mu = 0.1$, $\\rho = -2.0$ (so $\\sigma = 0.12693$), prior
            $\\mathcal{N}(0,1)$, giving a KL of $\\approx 1.577$. Suppose training instead drove this weight to a
            much larger spread, $\\rho = +2.0$. Compute the new $\\sigma$ and the new KL term. What does the change
            say about the complexity cost?`,
        steps: [
          { do: `New spread: $\\sigma = \\log(1+e^{2}) = \\log(8.389) = 2.1269$.`, why: `Softplus of a positive $\\rho$ gives a spread well above the prior's $\\sigma_0 = 1$.` },
          { do: `New KL $= \\log\\frac{1}{2.1269} + \\frac{2.1269^2 + 0.1^2}{2} - \\frac12 = (-0.7547) + 2.2675 - 0.5 = 1.0128.`, why: `Now the $(\\sigma^2)/2$ term grows and the $\\log(\\sigma_0/\\sigma)$ term goes negative; the KL is still positive but smaller than before.` },
          { do: `Compare 1.577 (tight, $\\sigma{=}0.127$) vs 1.013 (loose, $\\sigma{=}2.127$).`, why: `Both deviate from the prior, but a spread that is <i>too tight</i> is penalized more here than a spread somewhat larger than the prior &mdash; the KL is asymmetric in $\\sigma$.` }
        ],
        answer: `<p>With $\\rho = +2.0$: $\\sigma = \\log(1+e^{2}) = 2.1269$ and the KL term is
                 $\\log\\frac{1}{2.1269} + \\frac{2.1269^2 + 0.01}{2} - 0.5 = 1.0128$. So loosening this weight from
                 $\\sigma = 0.127$ to $\\sigma = 2.13$ actually <b>lowers</b> its complexity cost (1.577 &rarr;
                 1.013) here, because a very tight spread is far from the prior's $\\sigma_0 = 1$. The lesson: the KL
                 complexity cost wants each weight's spread to sit <i>near the prior's</i>, neither collapsed to zero
                 nor exploded &mdash; it is the likelihood term that earns the right to tighten $\\sigma$ where data
                 demands it.</p>`
      }
    ]
  });

  window.CODE["paper-bayes-by-backprop"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> linear layers with <code>nn.Parameter</code> / <code>F.linear</code>, then
       build the <b>novel</b> part by hand &mdash; a <b>Bayesian linear layer</b>. Each weight stores a mean
       <code>w_mu</code> and a raw spread <code>w_rho</code>; the spread is $\\sigma = $ <code>softplus(w_rho)</code>
       and the weight is sampled with the reparameterization trick
       <code>w = w_mu + sigma * torch.randn_like(sigma)</code> so backprop flows into both. Training minimizes the
       <b>variational free energy / ELBO</b> (Eqn. 1): a likelihood cost (sampled mean-squared error scaled by the
       noise) plus the closed-form Gaussian <b>KL</b> against a $\\mathcal{N}(0,1)$ prior, divided by $N$. We fit
       the paper's 1-D regression target (&sect;5.2) but give the network data only in a <b>central band</b>, so the
       edges are empty. The first cell recomputes the worked example
       ($\\sigma = 0.12693$, $w = 0.16346$, KL $= 1.577$). Then we measure predictive uncertainty (standard
       deviation across many weight samples) inside vs far from the data, and ablate by clamping $\\sigma\\to 0$.
       CPU, a few thousand fast iterations (about 5 seconds). Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, math, numpy as np
torch.manual_seed(0); np.random.seed(0)

# --- 0. Worked example: sample one weight + compute its KL term, by hand. ---
mu, rho, eps = torch.tensor(0.1), torch.tensor(-2.0), torch.tensor(0.5)
sigma = F.softplus(rho)                       # log(1+exp(rho))
w = mu + sigma*eps                            # reparameterization trick
s0 = 1.0                                       # prior std, prior = N(0,1)
kl = math.log(s0) - torch.log(sigma) + (sigma**2 + mu**2)/(2*s0**2) - 0.5
print("worked example: sigma=%.5f  w=%.5f  KL=%.4f" % (sigma.item(), w.item(), kl.item()))
# worked example: sigma=0.12693  w=0.16346  KL=1.5772


# --- 1. The NOVEL part: a Bayesian linear layer (mean + std per weight). ---
class BayesLinear(nn.Module):
    def __init__(self, n_in, n_out, prior_sigma=1.0):
        super().__init__()
        self.w_mu  = nn.Parameter(torch.empty(n_out, n_in).normal_(0, 0.1))
        self.w_rho = nn.Parameter(torch.full((n_out, n_in), -3.0))   # softplus(-3)~0.05
        self.b_mu  = nn.Parameter(torch.empty(n_out).normal_(0, 0.1))
        self.b_rho = nn.Parameter(torch.full((n_out,), -3.0))
        self.ps = prior_sigma
    def forward(self, x):
        w_sig, b_sig = F.softplus(self.w_rho), F.softplus(self.b_rho)
        w = self.w_mu + w_sig*torch.randn_like(w_sig)   # reparam: fresh noise each pass
        b = self.b_mu + b_sig*torch.randn_like(b_sig)
        return F.linear(x, w, b)
    def kl(self):                                         # closed-form Gaussian KL vs N(0, ps^2)
        def _k(mu, sig):
            return (math.log(self.ps) - torch.log(sig) + (sig**2 + mu**2)/(2*self.ps**2) - 0.5).sum()
        return _k(self.w_mu, F.softplus(self.w_rho)) + _k(self.b_mu, F.softplus(self.b_rho))

class BNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.l1, self.l2, self.l3 = BayesLinear(1,64), BayesLinear(64,64), BayesLinear(64,1)
    def forward(self, x):
        h = torch.relu(self.l1(x)); h = torch.relu(self.l2(h)); return self.l3(h)
    def kl(self): return self.l1.kl() + self.l2.kl() + self.l3.kl()

# --- 2. 1-D regression data in a CENTRAL BAND only (paper target, Sec 5.2). ---
def f(x): return x + 0.3*np.sin(2*np.pi*x) + 0.3*np.sin(4*np.pi*x)
N = 40
xt = np.random.uniform(-0.2, 0.6, (N,1)).astype(np.float32)
yt = (f(xt) + np.random.normal(0, 0.02, (N,1))).astype(np.float32)
X, Y = torch.tensor(xt), torch.tensor(yt)

# --- 3. Train on the ELBO / variational free energy (Eqn. 1). ---
net = BNN(); opt = torch.optim.Adam(net.parameters(), lr=0.01); noise = 0.02
for it in range(3000):
    opt.zero_grad()
    nll = sum(0.5*((net(X) - Y)**2).sum()/noise**2 for _ in range(2)) / 2   # likelihood cost (2 MC samples)
    loss = net.kl()/N + nll                                                  # complexity + likelihood
    loss.backward(); opt.step()

# --- 4. Predictive uncertainty = std of outputs across many weight samples. ---
def band(xs, S=200):
    xs = torch.tensor(xs.astype(np.float32))
    with torch.no_grad():
        samp = torch.stack([net(xs) for _ in range(S)], 0)
    return samp.mean(0).squeeze(-1).numpy(), samp.std(0).squeeze(-1).numpy()

grid = np.linspace(-1.5, 1.9, 60).reshape(-1,1)
m, s = band(grid)
in_mask  = (grid[:,0] > -0.2) & (grid[:,0] < 0.6)
far_mask = (grid[:,0] < -0.8) | (grid[:,0] > 1.2)
print("\\nin-data   mean predictive std = %.4f" % s[in_mask].mean())
print("far-data  mean predictive std = %.4f" % s[far_mask].mean())
print("ratio far/in = %.1fx  (uncertainty grows away from the data)" % (s[far_mask].mean()/s[in_mask].mean()))

# --- 5. ABLATION: clamp every sigma -> 0 (point estimate). Uncertainty must vanish. ---
with torch.no_grad():
    for p in [net.l1.w_rho, net.l1.b_rho, net.l2.w_rho, net.l2.b_rho, net.l3.w_rho, net.l3.b_rho]:
        p.fill_(-30.0)
_, s0_ab = band(grid)
print("\\nablation sigma->0: far-data mean std = %.6f  (overconfident: collapses)" % s0_ab[far_mask].mean())
# in-data   mean predictive std = 0.0149
# far-data  mean predictive std = 0.2595
# ratio far/in = 17.4x
# ablation sigma->0: far-data mean std = 0.000000
# (Our small run, not the paper's reported numbers. Exact values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-bayes-by-backprop"] = {
    question: "After training on data that lives only in a central band, how does the network's predictive uncertainty (std across weight samples) behave as we move away from the data?",
    charts: [
      {
        type: "line",
        title: "Predictive standard deviation vs input x — uncertainty grows where there is no data",
        xlabel: "input x  (training data only in the band -0.2 < x < 0.6)",
        ylabel: "predictive std across 200 weight samples",
        series: [
          {
            name: "predictive std (Bayes by Backprop)",
            color: "#7ee787",
            points: [[-1.500,0.5560],[-1.327,0.4538],[-1.097,0.3272],[-0.866,0.2200],[-0.636,0.1306],[-0.405,0.0654],[-0.175,0.0261],[0.056,0.0221],[0.286,0.0069],[0.517,0.0097],[0.747,0.0260],[0.978,0.0558],[1.208,0.0925],[1.439,0.1322],[1.669,0.1746],[1.900,0.2186]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A Bayesian network (1&rarr;64&rarr;64&rarr;1, each weight a learned mean + softplus(rho) std, sampled by the reparameterization trick) trained on the ELBO over 40 points drawn only from the band -0.2 &lt; x &lt; 0.6. We plot the per-point standard deviation of the output across 200 weight samples. Inside the data band the predictive std is tiny (~0.01-0.02): the likelihood cost pins those weights down. Move outward and it climbs steeply (to ~0.55 at x=-1.5, ~0.22 at x=1.9) &mdash; about 17x the in-data spread &mdash; because no data constrains the weights there, so sampled networks disagree. This is the paper's &sect;5.2 effect: where there are no data, the confidence intervals diverge. Clamping every sigma to 0 (the ablation) flattens this curve to 0 everywhere: an ordinary, overconfident network.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, math, numpy as np
torch.manual_seed(0); np.random.seed(0)

class BayesLinear(nn.Module):
    def __init__(self, n_in, n_out, ps=1.0):
        super().__init__()
        self.w_mu  = nn.Parameter(torch.empty(n_out, n_in).normal_(0, 0.1))
        self.w_rho = nn.Parameter(torch.full((n_out, n_in), -3.0))
        self.b_mu  = nn.Parameter(torch.empty(n_out).normal_(0, 0.1))
        self.b_rho = nn.Parameter(torch.full((n_out,), -3.0)); self.ps = ps
    def forward(self, x):
        ws, bs = F.softplus(self.w_rho), F.softplus(self.b_rho)
        w = self.w_mu + ws*torch.randn_like(ws); b = self.b_mu + bs*torch.randn_like(bs)
        return F.linear(x, w, b)
    def kl(self):
        k = lambda mu, s: (math.log(self.ps) - torch.log(s) + (s**2+mu**2)/(2*self.ps**2) - 0.5).sum()
        return k(self.w_mu, F.softplus(self.w_rho)) + k(self.b_mu, F.softplus(self.b_rho))

class BNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.l1,self.l2,self.l3 = BayesLinear(1,64),BayesLinear(64,64),BayesLinear(64,1)
    def forward(self,x):
        h=torch.relu(self.l1(x)); h=torch.relu(self.l2(h)); return self.l3(h)
    def kl(self): return self.l1.kl()+self.l2.kl()+self.l3.kl()

def f(x): return x + 0.3*np.sin(2*np.pi*x) + 0.3*np.sin(4*np.pi*x)
N=40; xt=np.random.uniform(-0.2,0.6,(N,1)).astype(np.float32)
yt=(f(xt)+np.random.normal(0,0.02,(N,1))).astype(np.float32)
X,Y=torch.tensor(xt),torch.tensor(yt)

net=BNN(); opt=torch.optim.Adam(net.parameters(),lr=0.01); noise=0.02
for it in range(3000):
    opt.zero_grad()
    nll=sum(0.5*((net(X)-Y)**2).sum()/noise**2 for _ in range(2))/2
    (net.kl()/N + nll).backward(); opt.step()

grid=np.linspace(-1.5,1.9,60).reshape(-1,1)
with torch.no_grad():
    samp=torch.stack([net(torch.tensor(grid.astype(np.float32))) for _ in range(200)],0)
s=samp.std(0).squeeze(-1).numpy()
idx=np.linspace(0,59,16).astype(int)
print("predictive std (x, std):")
for i in idx: print("  [%.3f,%.4f]"%(grid[i,0],s[i]))
# climbs from ~0.55 at x=-1.5 down to ~0.007 in the data band up to ~0.22 at x=1.9.
# Our small run, not the paper's number.`
  };
})();
