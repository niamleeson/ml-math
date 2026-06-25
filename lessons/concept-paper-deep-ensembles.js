/* Paper lesson — "Simple and Scalable Predictive Uncertainty Estimation using
   Deep Ensembles", Lakshminarayanan, Pritzel, Blundell, NeurIPS 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-deep-ensembles".
   GROUNDED from arXiv:1612.01474 (abstract page) and the ar5iv HTML mirror
   (Sec 2.2.1 Gaussian negative-log-likelihood loss with mean+variance head;
   Sec 2.3 adversarial training / fast gradient sign method; Sec 2.4 ensemble as a
   uniformly-weighted mixture and the mean/variance combination; Algorithm 1; the
   recommended defaults M=5 and epsilon=1% of the input range).
   Track B (architecture): compose a tiny multi-layer perceptron with torch.nn whose
   head outputs a mean and a variance, train M of them from DIFFERENT random inits with
   the Gaussian NLL loss, then average their predictive distributions. */
(function () {
  window.LESSONS.push({
    id: "paper-deep-ensembles",
    title: "Deep Ensembles — Simple and Scalable Predictive Uncertainty Estimation using Deep Ensembles (2017)",
    tagline: "Train a handful of probabilistic networks from different random starts and average them — you get honest, well-calibrated uncertainty, no Bayesian machinery.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Balaji Lakshminarayanan, Alexander Pritzel, Charles Blundell",
      org: "DeepMind",
      year: 2017,
      venue: "arXiv:1612.01474 (Dec 2016); NeurIPS (NIPS) 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1612.01474",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-likelihood", "pt-nn-module", "pt-autograd", "ml-gradient-descent", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p>A plain neural network outputs a single prediction and no honest sense of <b>how sure it is</b>.
       <b>Predictive uncertainty</b> means: a number the model attaches to each prediction saying "I might be
       off by about this much." We want that number to be <b>well-calibrated</b> — when the model says it is
       70% sure, it should be right about 70% of the time. We also want it to <b>grow</b> when we feed the model
       inputs far from anything it trained on (called <b>out-of-distribution</b>, abbreviated OOD: data drawn
       from a different distribution than the training data). A plain network does neither. It will confidently
       predict nonsense on inputs it has never seen.</p>
       <p>Before this paper, the standard fix was a <b>Bayesian neural network</b> — a network that learns a
       whole probability distribution over its weights instead of a single setting, so predictions come with
       spread. From the abstract:</p>
       <blockquote>"Bayesian NNs, which learn a distribution over weights, are currently the state-of-the-art
       for estimating predictive uncertainty; however these require significant modifications to the training
       procedure and are computationally expensive compared to standard (non-Bayesian) NNs." (Abstract)</blockquote>
       <p>The open question: can we get the same good uncertainty <b>without</b> the Bayesian machinery — with
       something simple, parallel, and easy to tune?</p>`,
    contribution:
      `<ul>
        <li><b>Each network predicts a distribution, not a point.</b> For regression the network has <b>two</b>
        outputs — a predicted mean $\\mu(x)$ and a predicted variance $\\sigma^2(x)$ — and is trained by
        the <b>Gaussian negative log-likelihood</b> (NLL = negative log-likelihood: minus the log-probability the
        model assigns to the true target). This lets one network express "I am unsure here" by predicting a large
        variance.</li>
        <li><b>Ensemble of randomly-initialized networks.</b> Train $M$ such networks (the paper recommends
        $M = 5$), each from a <b>different random starting weight setting</b> and a different shuffle of the data.
        Different starts settle into different solutions; where they <i>disagree</i>, the ensemble is uncertain.</li>
        <li><b>Optional adversarial training</b> to smooth the predictive distributions (Section 2.3), and a
        simple rule to <b>average the members into one predictive distribution</b> (Section 2.4). No distribution
        over weights, no variational inference, no Markov-chain sampling — just train a few nets and average.</li>
      </ul>`,
    whyItMattered:
      `<p>Deep Ensembles became the <b>go-to baseline</b> for uncertainty in deep learning, and in many later
       benchmarks the one to beat. It showed that a strikingly simple recipe — a probabilistic head plus a few
       independent runs — matches or beats much more elaborate Bayesian methods on calibration and on flagging
       out-of-distribution inputs. Because the members are independent, training and prediction <b>parallelize</b>
       trivially. The lasting lesson: much of a neural network's useful uncertainty comes from the <b>disagreement
       between equally-good solutions</b> that different random starts find. (Compare with
       <b>paper-mc-dropout</b>, an alternative that gets uncertainty from a <i>single</i> network by keeping
       dropout on at test time and sampling — cheaper, but the spread comes from one model, not a true
       ensemble of independently-trained ones.)</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.2.1 (Training criterion for regression)</b> — the two-output head (mean and variance)
        and the <b>Gaussian negative-log-likelihood</b> loss. This is <b>Equation 1</b>, the equation you
        transcribe and implement. Note the detail that variance is forced positive with the <b>softplus</b>
        function (defined below) plus a tiny floor for numerical stability.</li>
        <li><b>&sect;2.3 (Adversarial training)</b> — the optional trick of also training on slightly
        perturbed inputs built with the <b>fast gradient sign method</b>, to smooth the predictive distribution.</li>
        <li><b>&sect;2.4 (Ensembles: training and prediction)</b> — how the $M$ members are combined: treat
        them as a uniformly-weighted mixture, then approximate it by a single Gaussian. These are the
        mean/variance combination formulas you transcribe.</li>
        <li><b>Algorithm 1</b> — the whole recipe in a few lines: initialize $M$ nets, train each
        independently (optionally with the adversarial term), then combine at test time.</li>
       </ul>
       <p><b>Skim:</b> the classification experiments and the ImageNet scaling results unless you want them; the
       regression story in &sect;2.2.1 + &sect;2.4 is the core you will reproduce.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train one probabilistic network and an ensemble of $M = 5$ of them on a one-dimensional
       regression task where the training inputs live <b>only</b> in a band, say $x \\in [-3, 3]$. Then you will
       ask both for their predicted standard deviation (the square root of the predicted variance — a
       plain measure of spread) on a grid that runs <b>well outside</b> that band, out to $x = 7$.</p>
       <p>As you move away from the training band, what happens to each one's reported uncertainty? Will the
       <b>single</b> network's predicted spread grow, shrink, or stay flat far from the data? Will the
       <b>ensemble</b>'s? Write your guess and one sentence of reasoning before running.</p>
       <p>(Hint: a single network's variance head is itself just a function it fit on the training band — it
       was never told what to do outside. The ensemble's spread has a second source: the members can
       <i>disagree</i>.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the recipe you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Probabilistic head.</b> Make the network output <b>two</b> numbers per input. The first is the
        mean $\\mu(x)$. The second is passed through <code>softplus</code> (then a tiny constant added) to give a
        positive variance $\\sigma^2(x)$. <i># why must the variance be forced positive?</i></li>
        <li><b>Loss.</b> TODO — write the <b>Gaussian negative-log-likelihood</b> for a target $y$:
        <code>0.5*log(var) + (y-mu)**2/(2*var)</code>, averaged over the batch. <i># the constant term is
        dropped — it does not depend on the weights.</i></li>
        <li><b>Ensemble.</b> Train $M = 5$ copies, each with a <b>different random seed</b> (different initial
        weights and data order). TODO — what makes the members differ if the data is the same?</li>
        <li><b>Combine.</b> TODO — average the members' means; then combine their variances <b>and</b> means
        into the ensemble variance (the formula from &sect;2.4, below). Why is it not enough to just average the
        variances?</li>
       </ul>
       <p>Then build the single-network baseline (one member, $M = 1$) and compare the two far from the data.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The recipe has three pieces: a <b>probabilistic network</b>, an <b>ensemble</b> of them, and a rule to
       <b>combine</b> them.</p>
       <p><b>1. Each network predicts a Gaussian (&sect;2.2.1).</b> Instead of outputting one number, the network
       outputs two: a mean $\\mu_\\theta(x)$ and a variance $\\sigma_\\theta^2(x)$, where $\\theta$ is the
       network's weights. We treat the true target $y$ as a sample from a Gaussian (a bell-curve probability
       distribution) centered at $\\mu_\\theta(x)$ with spread $\\sigma_\\theta^2(x)$. We then train the network to
       make the observed targets as <b>probable</b> as possible under that Gaussian — i.e. we minimize the
       <b>negative log-likelihood</b>. A point the network can predict well it covers with a <i>small</i>
       variance; a point it cannot, it admits with a <i>large</i> variance. The variance output is forced
       positive by the <b>softplus</b> function $\\text{softplus}(z) = \\log(1 + e^{z})$ (which is always
       greater than zero), plus a tiny floor like $10^{-6}$ for numerical safety (&sect;2.2.1).</p>
       <p><b>2. Train M of them from different starts (&sect;2.4, Algorithm 1).</b> Initialize $M$ networks with
       <b>different random weights</b> and train each independently on the data (shuffled differently). Random
       initialization is the entire source of diversity: the paper found it enough, and simpler than fancier
       schemes. The recommended default is $M = 5$. Because the members never talk to each other, you can train
       them fully in parallel.</p>
       <p><b>3. Combine them into one predictive distribution (&sect;2.4).</b> Treat the $M$ members as a
       <b>uniformly-weighted mixture</b> (each member gets weight $1/M$) and approximate that mixture by a single
       Gaussian whose mean and variance match the mixture's. The ensemble mean is just the average of the member
       means. The ensemble variance has <b>two</b> parts: the average of the members' own variances (each member's
       admitted uncertainty) <b>plus</b> the spread of the member means around the average (how much the members
       <i>disagree</i>). That second part is what makes uncertainty grow on out-of-distribution inputs: far from
       the training data, independently-trained members extrapolate differently, so their means fan out and the
       ensemble variance climbs — even if each member alone is overconfident.</p>
       <p><b>Optional: adversarial training (&sect;2.3).</b> Build a slightly perturbed copy of each input with the
       <b>fast gradient sign method</b> — nudge every input feature by a small $\\epsilon$ in the direction that
       <i>increases</i> the loss — and train on the original and the perturbed input together. This smooths the
       predictive distribution. The recommended $\\epsilon$ is about 1% of the input range.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input</b> to the network (here a single number, the one-dimensional regression input)." },
      { sym: "$y$", desc: "the <b>true target</b> we want to predict for input $x$." },
      { sym: "$\\theta$", desc: "the <b>weights</b> of one network. Each ensemble member $m$ has its own weights $\\theta_m$." },
      { sym: "$\\mu_\\theta(x)$", desc: "the network's <b>predicted mean</b> for input $x$ — its best single guess of $y$. The first of the two outputs." },
      { sym: "$\\sigma_\\theta^2(x)$", desc: "the network's <b>predicted variance</b> for input $x$ — how spread-out it thinks the target is, i.e. how unsure it is. The second output, forced positive. (Variance = the square of the standard deviation; standard deviation = the typical distance from the mean.)" },
      { sym: "$p_\\theta(y \\mid x)$", desc: "the <b>probability</b> the network assigns to target $y$ given $x$: a Gaussian (bell curve) with mean $\\mu_\\theta(x)$ and variance $\\sigma_\\theta^2(x)$." },
      { sym: "NLL", desc: "<b>negative log-likelihood</b>: minus the logarithm of $p_\\theta(y\\mid x)$. Small NLL means the model assigned high probability to the true target. Minimizing it is the training goal." },
      { sym: "softplus", desc: "the function $\\log(1 + e^{z})$ — a smooth way to turn any real number $z$ into a <b>positive</b> one. Used so the predicted variance can never be zero or negative." },
      { sym: "$M$", desc: "the <b>number of networks</b> in the ensemble. The paper recommends $M = 5$." },
      { sym: "$\\mu_*(x)$", desc: "the <b>ensemble mean</b>: the average of the $M$ member means — the ensemble's overall best guess." },
      { sym: "$\\sigma_*^2(x)$", desc: "the <b>ensemble variance</b>: the combined spread of the mixture of $M$ members — the ensemble's overall uncertainty." },
      { sym: "$\\epsilon$", desc: "the <b>adversarial step size</b>: how far each input feature is nudged in the fast gradient sign method. Default about 1% of the input range (&sect;2.3)." }
    ],
    formula: `$$ -\\log p_\\theta(y_n \\mid x_n) = \\frac{\\log \\sigma_\\theta^2(x_n)}{2} + \\frac{(y_n - \\mu_\\theta(x_n))^2}{2\\,\\sigma_\\theta^2(x_n)} + \\text{constant} \\quad\\text{(Eqn. 1, \\S2.2.1)} $$
                $$ \\mu_*(x) = \\frac{1}{M}\\sum_{m=1}^{M} \\mu_{\\theta_m}(x), \\qquad
                   \\sigma_*^2(x) = \\frac{1}{M}\\sum_{m=1}^{M}\\Big(\\sigma_{\\theta_m}^2(x) + \\mu_{\\theta_m}^2(x)\\Big) - \\mu_*^2(x) \\quad\\text{(\\S2.4)} $$`,
    whatItDoes:
      `<p><b>The loss</b> (top, the paper's <b>Equation 1</b>, &sect;2.2.1) is the Gaussian negative
       log-likelihood for one example. Read the two terms. The second term, $(y - \\mu)^2 / (2\\sigma^2)$,
       is the squared error between the prediction and the target, <b>divided by the variance</b> — so a
       confident prediction (small $\\sigma^2$) that is wrong is punished hard. The first term,
       $\\tfrac{1}{2}\\log\\sigma^2$, is a penalty for <b>claiming a large variance</b>. These two pull against
       each other: the network cannot escape a hard example just by predicting a huge variance, because the
       $\\log\\sigma^2$ term charges it for that. The balance point is honest uncertainty. (The constant does not
       depend on the weights, so we drop it in code.)</p>
       <p><b>The combination</b> (bottom, &sect;2.4) merges the $M$ members. The ensemble mean $\\mu_*$ is just the
       average of the member means. The ensemble variance $\\sigma_*^2$ is the average of "each member's variance
       plus its mean squared," minus the ensemble mean squared. Algebra (below) shows this equals
       <b>(average of member variances) + (variance of the member means)</b>. The first piece is the uncertainty
       each member already admits; the second is the <b>disagreement</b> between members. That second piece is
       the engine of out-of-distribution uncertainty.</p>`,
    derivation:
      `<p><b>Why the loss.</b> A Gaussian (bell curve) with mean $\\mu$ and variance $\\sigma^2$ assigns to a value
       $y$ the probability density
       $p(y) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}}\\,\\exp\\!\\big(-\\tfrac{(y-\\mu)^2}{2\\sigma^2}\\big)$. Take the
       negative logarithm (logarithm turns the product into a sum and the exponential into its argument):</p>
       <p>$$ -\\log p(y) = \\tfrac{1}{2}\\log\\sigma^2 + \\frac{(y-\\mu)^2}{2\\sigma^2} + \\tfrac{1}{2}\\log(2\\pi). $$</p>
       <p>The last term $\\tfrac{1}{2}\\log(2\\pi)$ is the "constant" in Equation 1 — it does not contain the
       weights, so minimizing over $\\theta$ ignores it. That is exactly &sect;2.2.1's Equation 1. (If you fix
       $\\sigma^2$ to a constant, only the $(y-\\mu)^2$ term survives and you are back to ordinary mean-squared
       error — so this loss is a strict generalization that also <i>learns</i> how unsure to be.)</p>
       <p><b>Why the variance combination has two parts.</b> For a uniform mixture of $M$ Gaussians, the mixture
       mean is $\\mu_* = \\tfrac{1}{M}\\sum_m \\mu_m$ and the mixture's second moment (average of "$\\,$value
       squared$\\,$") is $\\tfrac{1}{M}\\sum_m (\\sigma_m^2 + \\mu_m^2)$, because each member contributes
       $\\mathbb{E}[Y^2] = \\sigma_m^2 + \\mu_m^2$. Variance equals second moment minus mean squared, giving
       exactly the &sect;2.4 formula
       $\\sigma_*^2 = \\tfrac{1}{M}\\sum_m(\\sigma_m^2 + \\mu_m^2) - \\mu_*^2$. Now group the terms:</p>
       <p>$$ \\sigma_*^2 = \\underbrace{\\tfrac{1}{M}\\sum_m \\sigma_m^2}_{\\text{avg member variance}}
          \\;+\\; \\underbrace{\\Big(\\tfrac{1}{M}\\sum_m \\mu_m^2 - \\mu_*^2\\Big)}_{\\text{variance of the member means}}. $$</p>
       <p>The second bracket is the spread of the member means around their average — the
       <b>disagreement</b> term. On in-distribution inputs the members agree, so it is near zero and the ensemble
       variance is just the average member variance. On out-of-distribution inputs the members extrapolate
       differently, the means fan out, and this term blows up — which is why ensemble uncertainty grows away
       from the data while a single net's need not.</p>`,
    example:
      `<p>Two tiny worked numbers, both recomputed in the notebook's first cell.</p>
       <p><b>(A) Gaussian NLL for one prediction.</b> Suppose for some input the network predicts mean
       $\\mu = 2.0$ and variance $\\sigma^2 = 0.5$, and the true target is $y = 3.0$. Plug into Equation 1
       (dropping the constant):</p>
       <ul class="steps">
        <li><b>First term</b> $\\tfrac{1}{2}\\log\\sigma^2 = \\tfrac{1}{2}\\log(0.5) = \\tfrac{1}{2}\\cdot
        (-0.693147) = -0.346574$. (The logarithm here is the natural logarithm, base $e$.)</li>
        <li><b>Second term</b> $\\dfrac{(y-\\mu)^2}{2\\sigma^2} = \\dfrac{(3.0 - 2.0)^2}{2\\cdot 0.5}
        = \\dfrac{1}{1} = 1.0$.</li>
        <li><b>Sum</b> $= -0.346574 + 1.0 = \\mathbf{0.653426}$. That is the loss for this one example. If the
        network had instead claimed it was very sure ($\\sigma^2 = 0.05$), the second term would jump to
        $\\frac{1}{0.1} = 10.0$ — ten times the penalty — punishing the overconfident wrong guess.</li>
       </ul>
       <p><b>(B) Combine two members (&sect;2.4).</b> Member 1 predicts $\\mu_1 = 2.0,\\ \\sigma_1^2 = 0.5$;
       member 2 predicts $\\mu_2 = 4.0,\\ \\sigma_2^2 = 1.0$. With $M = 2$:</p>
       <ul class="steps">
        <li><b>Ensemble mean</b> $\\mu_* = \\tfrac{1}{2}(2.0 + 4.0) = \\mathbf{3.0}$.</li>
        <li><b>Average of $(\\sigma_m^2 + \\mu_m^2)$</b> $= \\tfrac{1}{2}\\big[(0.5 + 2.0^2) + (1.0 + 4.0^2)\\big]
        = \\tfrac{1}{2}\\big[(0.5 + 4) + (1.0 + 16)\\big] = \\tfrac{1}{2}(4.5 + 17.0) = 10.75$.</li>
        <li><b>Ensemble variance</b> $\\sigma_*^2 = 10.75 - \\mu_*^2 = 10.75 - 3.0^2 = 10.75 - 9.0 = \\mathbf{1.75}$.</li>
       </ul>
       <p>Sanity check the two parts: average member variance $= \\tfrac{1}{2}(0.5 + 1.0) = 0.75$; spread of the
       means $= \\tfrac{1}{2}(2.0^2 + 4.0^2) - 3.0^2 = 10.0 - 9.0 = 1.0$; and $0.75 + 1.0 = 1.75$. The
       <b>disagreement</b> piece ($1.0$) here outweighs the members' own variances ($0.75$) — exactly the
       effect that lets ensembles flag inputs where members diverge.</p>`,
    recipe:
      `<ol>
        <li><b>Build the probabilistic model</b> with <code>torch.nn</code>: a tiny multi-layer perceptron
        (1 input &rarr; 50 &rarr; 50 &rarr; <b>2</b> outputs, ReLU activations). Split the two outputs into a mean
        and a variance; pass the variance through <code>softplus</code> and add $10^{-6}$ (&sect;2.2.1).</li>
        <li><b>Loss = Gaussian negative log-likelihood</b> (Equation 1): mean over the batch of
        <code>0.5*log(var) + (y-mu)**2/(2*var)</code>.</li>
        <li><b>(Optional) adversarial term (&sect;2.3):</b> build $x' = x + \\epsilon\\,\\text{sign}(\\nabla_x
        \\text{loss})$ with the fast gradient sign method and add the loss on $x'$.</li>
        <li><b>Train $M = 5$ members</b>, each from a <b>different random seed</b> (different initial weights and
        data order), independently. This is the only source of diversity.</li>
        <li><b>Combine at test time (&sect;2.4):</b> $\\mu_* = \\tfrac{1}{M}\\sum_m \\mu_m$ and
        $\\sigma_*^2 = \\tfrac{1}{M}\\sum_m(\\sigma_m^2 + \\mu_m^2) - \\mu_*^2$.</li>
        <li><b>Evaluate:</b> on a grid that runs outside the training band, compare the ensemble's predicted
        standard deviation against a <b>single</b> member's. <b>Ablate</b> by setting $M = 1$ (no ensemble) to
        see the uncertainty stop growing out-of-distribution.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the method "produces well-calibrated uncertainty estimates which are as good
       or better than approximate Bayesian NNs," and on dataset shift "is able to express higher uncertainty on
       out-of-distribution examples." The abstract also reports they "demonstrate the scalability of our method by
       evaluating predictive uncertainty estimates on ImageNet."</p>
       <p>The recommended defaults are stated as <b>$M = 5$</b> networks and adversarial step
       <b>$\\epsilon = 1\\%$ of the input range</b> (&sect;3.1 / Algorithm 1, quoted).</p>
       <p><i>These are the paper's own statements, quoted from the abstract and the method sections. The numbers in
       the CODEVIZ panel below are from our own tiny one-dimensional run — not the paper's reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The pieces already ship in PyTorch, so you <b>import</b>
       them and build only the novel recipe. <b>Import:</b> <code>nn.Linear</code>, <code>nn.ReLU</code> for the
       multi-layer perceptron, <code>torch.nn.functional.softplus</code> for the positive variance,
       <code>torch.autograd.grad</code> for the adversarial perturbation, and <code>torch.optim.Adam</code>.
       <b>Build by hand:</b> the <b>two-output probabilistic head</b>, the <b>Gaussian negative-log-likelihood
       loss</b> (Equation 1) — note PyTorch also ships <code>nn.GaussianNLLLoss</code>, but we write it out so
       the equation is visible — the <b>different-seed ensemble</b>, and the <b>mixture combination</b>
       of &sect;2.4. The whole contribution is the recipe, not any one layer.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to force the variance positive.</b> If the second output is used raw, it can go
        negative or zero, and $\\log\\sigma^2$ or the division by $\\sigma^2$ explodes into NaN (not-a-number).
        <b>Fix:</b> pass it through <code>softplus</code> and add a small floor like $10^{-6}$ (&sect;2.2.1).</li>
        <li><b>Combining variances by simple averaging.</b> $\\sigma_*^2$ is <b>not</b>
        $\\tfrac{1}{M}\\sum_m \\sigma_m^2$. You must add the <b>disagreement of the means</b> (the second term of
        &sect;2.4), or you throw away exactly the part that makes ensembles flag out-of-distribution inputs.</li>
        <li><b>Using the same seed for every member.</b> If all members start from identical weights and see the
        data in the same order, they converge to the same solution and never disagree — your "ensemble" behaves
        like one net. <b>Fix:</b> a different random seed per member.</li>
        <li><b>Expecting a single net's variance to grow out-of-distribution.</b> The variance head is just a
        function fit on the training band; outside it, it can do anything — often it <i>shrinks</i>, making the
        net overconfident exactly where it should be unsure. That failure is the whole reason to ensemble.</li>
        <li><b>Reading the loss as plain mean-squared error.</b> The $\\log\\sigma^2$ term matters: it stops the
        network from dodging hard points by declaring an enormous variance. Drop it and the variance runs away.</li>
      </ul>`,
    recall: [
      "Write the Gaussian negative-log-likelihood loss (Eqn. 1) from memory, including the $\\log\\sigma^2$ term.",
      "Write the ensemble mean $\\mu_*$ and variance $\\sigma_*^2$ combination (&sect;2.4), and name the two parts of $\\sigma_*^2$.",
      "Why does ensemble uncertainty grow on out-of-distribution inputs while a single net's may not?",
      "What forces the predicted variance to stay positive, and what is the only source of diversity among members?"
    ],
    practice: [
      {
        q: `<b>The single-net ablation.</b> You have a working ensemble of $M = 5$. Set $M = 1$ (use one member as
            the whole predictor) and look at the predicted standard deviation far outside the training band. Which
            term of the &sect;2.4 variance did you just zero out, and what do you expect to happen to the
            out-of-distribution uncertainty?`,
        steps: [
          { do: `Recall the two parts of $\\sigma_*^2$: the average member variance, and the variance of the member means (the disagreement).`, why: `With $M=1$ there is only one mean, so the disagreement term $\\tfrac{1}{M}\\sum_m\\mu_m^2 - \\mu_*^2$ is exactly zero.` },
          { do: `Conclude what is left: only that single member's own predicted variance $\\sigma_1^2(x)$ — a function it fit on the training band.`, why: `Outside the band the variance head was never trained, so it can shrink, leaving the prediction overconfident where it should be unsure.` },
          { do: `Run it and compare the std at $x=7$ for $M=1$ versus $M=5$.`, why: `The ensemble's std climbs away from the data; the single net's does not — the disagreement term is what was doing the work.` }
        ],
        answer: `<p>You zeroed out the <b>disagreement term</b> — the variance of the member means. With $M=1$
                 the ensemble variance collapses to the lone member's own $\\sigma_1^2(x)$, which is just a fitted
                 function with no obligation to grow outside the training band. In our run the single net's
                 predicted std actually <b>shrinks</b> away from the data (it grows overconfident out-of-distribution),
                 while the ensemble's std <b>rises</b> sharply. The growth of uncertainty far from the data comes
                 almost entirely from members disagreeing — the thing a single network cannot do.</p>`
      },
      {
        q: `In the worked example, member 1 predicted $\\mu_1=2.0,\\ \\sigma_1^2=0.5$ and member 2 predicted
            $\\mu_2=4.0,\\ \\sigma_2^2=1.0$, giving ensemble variance $\\sigma_*^2 = 1.75$. Now suppose the two
            members <b>agree</b>: both predict $\\mu = 3.0$ (same variances). Recompute $\\sigma_*^2$. What does
            the change tell you?`,
        steps: [
          { do: `Ensemble mean: $\\mu_* = \\tfrac{1}{2}(3.0+3.0)=3.0$ — unchanged.`, why: `Both means are now 3.0.` },
          { do: `Average of $(\\sigma_m^2+\\mu_m^2)$: $\\tfrac{1}{2}[(0.5+9)+(1.0+9)] = \\tfrac{1}{2}(9.5+10.0)=9.75$.`, why: `Each $\\mu_m^2 = 3.0^2 = 9$ now.` },
          { do: `Ensemble variance: $9.75 - 3.0^2 = 9.75 - 9.0 = 0.75$.`, why: `The disagreement term vanished; only the average member variance $\\tfrac{1}{2}(0.5+1.0)=0.75$ remains.` }
        ],
        answer: `<p>$\\sigma_*^2 = 0.75$, down from $1.75$. When the members agree, the disagreement term is exactly
                 zero and the ensemble variance is just the average of the members' own variances ($0.75$). The
                 missing $1.0$ in the original example was pure disagreement. This is the mechanism in miniature:
                 agreement $\\Rightarrow$ low ensemble uncertainty; disagreement $\\Rightarrow$ high — which is
                 precisely what you want as inputs drift away from the training data.</p>`
      },
      {
        q: `Why does the Gaussian negative-log-likelihood loss keep the network from "cheating" on a hard example
            by predicting an enormous variance, and how does that differ from plain mean-squared error?`,
        steps: [
          { do: `Write the loss for one example: $\\tfrac{1}{2}\\log\\sigma^2 + \\frac{(y-\\mu)^2}{2\\sigma^2}$.`, why: `Two competing terms: a data-fit term divided by variance, and a penalty for large variance.` },
          { do: `Imagine sending $\\sigma^2 \\to \\infty$ to kill the data-fit term.`, why: `The second term $\\frac{(y-\\mu)^2}{2\\sigma^2}\\to 0$, but the first term $\\tfrac{1}{2}\\log\\sigma^2\\to+\\infty$ — the penalty dominates, so a huge variance is bad too.` },
          { do: `Compare with mean-squared error, which is only $(y-\\mu)^2$ with $\\sigma^2$ fixed.`, why: `Plain MSE has no variance to tune and no $\\log\\sigma^2$ term, so it cannot express or be penalized for confidence.` }
        ],
        answer: `<p>The $\\tfrac{1}{2}\\log\\sigma^2$ term charges the network for claiming a large variance, so it
                 cannot escape a hard point by declaring itself maximally unsure — doing so sends the loss to
                 $+\\infty$. The balance between "fit the target" (second term) and "don't over-claim variance"
                 (first term) is what produces <b>honest</b>, calibrated uncertainty. Plain mean-squared error is
                 the special case where the variance is fixed to a constant: only the $(y-\\mu)^2$ term survives,
                 and the model has no way to say how sure it is. The Gaussian NLL strictly generalizes MSE by
                 <i>learning</i> the variance too.</p>`
      }
    ]
  });

  window.CODE["paper-deep-ensembles"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny multi-layer perceptron with <code>nn.Linear</code> /
       <code>nn.ReLU</code> whose head outputs <b>two</b> numbers — a mean and a variance (variance forced
       positive with <code>softplus</code>, &sect;2.2.1) — then build the <b>novel recipe</b> by hand: train
       $M = 5$ members from <b>different random seeds</b> with the <b>Gaussian negative-log-likelihood</b> loss
       (Equation 1) and an optional adversarial term (&sect;2.3, fast gradient sign method), and combine them
       with the &sect;2.4 mixture formulas. We fit a one-dimensional regression whose training inputs live only in
       $x\\in[-3,3]$, then ask both the ensemble and a single member for their predicted standard deviation on a
       grid out to $x=7$. The first cell recomputes the worked examples: single-prediction Gaussian NLL
       $\\mu{=}2,\\sigma^2{=}0.5,y{=}3 \\Rightarrow 0.6534$, and combining two members
       $\\Rightarrow \\mu_*{=}3.0,\\sigma_*^2{=}1.75$. CPU, a few hundred fast epochs per member. Paste into
       Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
import math, numpy as np

# --- 0. Sanity-check the worked examples. ---
# (A) Gaussian NLL for one prediction: mu=2.0, var=0.5, y=3.0 (Eqn. 1, drop constant).
mu, var, y = 2.0, 0.5, 3.0
nll = 0.5*math.log(var) + (y-mu)**2/(2*var)
print("worked (A): 0.5*log(0.5)=%.6f  (3-2)^2/(2*0.5)=%.6f  NLL=%.6f" % (
      0.5*math.log(var), (y-mu)**2/(2*var), nll))
# worked (A): 0.5*log(0.5)=-0.346574  (3-2)^2/(2*0.5)=1.000000  NLL=0.653426

# (B) Combine two members (Sec 2.4): m1=(2.0,0.5), m2=(4.0,1.0), M=2.
mus, vrs, M = [2.0, 4.0], [0.5, 1.0], 2
mu_star = sum(mus)/M
var_star = sum(v + m*m for v, m in zip(vrs, mus))/M - mu_star**2
print("worked (B): mu*=%.2f  var*=%.2f" % (mu_star, var_star))
# worked (B): mu*=3.00  var*=1.75


# --- 1. The probabilistic model: 1 -> 50 -> 50 -> 2 outputs (mean, variance). ---
def make_net():
    return nn.Sequential(nn.Linear(1, 50), nn.ReLU(),
                         nn.Linear(50, 50), nn.ReLU(),
                         nn.Linear(50, 2))         # 2 outputs: mean, raw-variance

def split(out):
    mean = out[:, :1]
    variance = F.softplus(out[:, 1:]) + 1e-6       # positivity (Sec 2.2.1)
    return mean, variance

def gaussian_nll(mean, variance, target):          # Eqn. 1, mean over batch
    return (0.5*torch.log(variance) + (target-mean)**2/(2*variance)).mean()

# --- 2. Training data: inputs ONLY in [-3, 3]; uncertainty should grow OUTSIDE. ---
def truef(x): return np.sin(x) + 0.1*x
np.random.seed(0)
xtr = np.random.uniform(-3, 3, (80, 1)).astype(np.float32)
ytr = (truef(xtr) + np.random.normal(0, 0.1, (80, 1))).astype(np.float32)
Xtr, Ytr = torch.tensor(xtr), torch.tensor(ytr)

# --- 3. Train ONE member, from its own seed, with optional adversarial term (Sec 2.3). ---
def train_member(seed, adversarial=True, eps=0.08):
    torch.manual_seed(seed); np.random.seed(seed)
    net = make_net(); opt = torch.optim.Adam(net.parameters(), lr=0.01)
    for _ in range(300):
        opt.zero_grad()
        X = Xtr.clone().requires_grad_(True)
        m, v = split(net(X)); loss = gaussian_nll(m, v, Ytr)
        if adversarial:                            # fast gradient sign method
            g = torch.autograd.grad(loss, X, retain_graph=True)[0]
            Xadv = (X + eps*torch.sign(g)).detach()
            ma, va = split(net(Xadv)); loss = loss + gaussian_nll(ma, va, Ytr)
        loss.backward(); opt.step()
    return net

# --- 4. The ENSEMBLE: M=5 members from DIFFERENT seeds (the only source of diversity). ---
M = 5
members = [train_member(s) for s in range(M)]
single  = members[0]                               # the M=1 ablation baseline

# --- 5. Combine via the Sec 2.4 mixture formulas. ---
def predict(nets, X):
    ms, vs = [], []
    with torch.no_grad():
        for n in nets:
            m, v = split(n(X)); ms.append(m); vs.append(v)
    ms, vs = torch.stack(ms), torch.stack(vs)
    mu_s = ms.mean(0)
    var_s = (vs + ms**2).mean(0) - mu_s**2         # avg var + disagreement of means
    return mu_s.squeeze(1).numpy(), var_s.squeeze(1).numpy()

# --- 6. Compare ensemble vs single net far OUTSIDE the training band. ---
xte = np.linspace(-7, 7, 57).astype(np.float32).reshape(-1, 1)
Xte = torch.tensor(xte); xg = xte.squeeze(1)
_, var_e = predict(members, Xte); std_e = np.sqrt(var_e)
_, var_s = predict([single],  Xte); std_s = np.sqrt(var_s)
inside  = np.abs(xg) <= 3.0
outside = np.abs(xg) >= 5.0
print("\\nMean predicted std  (training inputs only in [-3,3]):")
print("  ENSEMBLE (M=5): inside=%.3f  outside=%.3f  ratio=%.2f" % (
      std_e[inside].mean(), std_e[outside].mean(), std_e[outside].mean()/std_e[inside].mean()))
print("  SINGLE   (M=1): inside=%.3f  outside=%.3f  ratio=%.2f" % (
      std_s[inside].mean(), std_s[outside].mean(), std_s[outside].mean()/std_s[inside].mean()))
# ENSEMBLE (M=5): inside=0.116  outside=0.219  ratio=1.89   <- uncertainty GROWS away from data
# SINGLE   (M=1): inside=0.112  outside=0.059  ratio=0.53   <- single net SHRINKS: overconfident OOD
# (Our small run, not the paper's reported numbers. Exact values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-deep-ensembles"] = {
    question: "As inputs move AWAY from the training band ([-3,3]), how does each method's predicted uncertainty behave — a 5-member deep ensemble vs a single probabilistic network?",
    charts: [
      {
        type: "line",
        title: "Predicted standard deviation vs input x — deep ensemble (M=5) vs single net (training data only in [-3,3])",
        xlabel: "input x  (training inputs confined to the shaded band [-3, 3])",
        ylabel: "predicted standard deviation (uncertainty)",
        series: [
          {
            name: "Deep ensemble (M=5)",
            color: "#7ee787",
            points: [[-7,0.164],[-6,0.168],[-5,0.129],[-4,0.104],[-3,0.102],[-2,0.112],[-1,0.141],[0,0.124],[1,0.086],[2,0.115],[3,0.123],[4,0.159],[5,0.206],[6,0.279],[7,0.357]]
          },
          {
            name: "Single net (M=1)",
            color: "#ff7b72",
            points: [[-7,0.033],[-6,0.046],[-5,0.065],[-4,0.087],[-3,0.101],[-2,0.105],[-1,0.136],[0,0.122],[1,0.090],[2,0.109],[3,0.117],[4,0.103],[5,0.088],[6,0.071],[7,0.057]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny multi-layer perceptron (1&rarr;50&rarr;50&rarr;2, ReLU) with a mean+variance head trained by the Gaussian negative-log-likelihood loss (Eqn. 1) and adversarial training (Sec 2.3). Training inputs live ONLY in [-3,3]; we plot the predicted standard deviation across [-7,7]. The deep ensemble (M=5, different random seeds, combined by the Sec 2.4 mixture formula) sees its uncertainty GROW as x leaves the band — climbing from ~0.11 inside to ~0.36 at x=7 (outside/inside ratio 1.89). The single net does the OPPOSITE: its predicted std SHRINKS away from the data (ratio 0.53), i.e. it is overconfident exactly where it has no evidence. The growth comes from the disagreement term: independently-trained members extrapolate differently outside the training band. (The left tail is noisier than the right — a small-run seed artifact; the qualitative ensemble-grows / single-shrinks effect is robust.)",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, math, numpy as np

def make_net(): return nn.Sequential(nn.Linear(1,50), nn.ReLU(),
                                     nn.Linear(50,50), nn.ReLU(), nn.Linear(50,2))
def split(o):
    m = o[:, :1]; v = F.softplus(o[:, 1:]) + 1e-6; return m, v
def gnll(m, v, y): return (0.5*torch.log(v) + (y-m)**2/(2*v)).mean()
def truef(x): return np.sin(x) + 0.1*x

np.random.seed(0)
xtr = np.random.uniform(-3,3,(80,1)).astype(np.float32)
ytr = (truef(xtr)+np.random.normal(0,0.1,(80,1))).astype(np.float32)
Xtr, Ytr = torch.tensor(xtr), torch.tensor(ytr)

def train_member(seed, eps=0.08):                    # different seed per member
    torch.manual_seed(seed); np.random.seed(seed)
    net = make_net(); opt = torch.optim.Adam(net.parameters(), lr=0.01)
    for _ in range(300):
        opt.zero_grad(); X = Xtr.clone().requires_grad_(True)
        m, v = split(net(X)); loss = gnll(m, v, Ytr)
        g = torch.autograd.grad(loss, X, retain_graph=True)[0]   # FGSM (Sec 2.3)
        Xa = (X + eps*torch.sign(g)).detach()
        ma, va = split(net(Xa)); (loss + gnll(ma, va, Ytr)).backward(); opt.step()
    return net

members = [train_member(s) for s in range(5)]        # M=5
single  = members[0]

def predict(nets, X):
    ms, vs = [], []
    with torch.no_grad():
        for n in nets:
            m, v = split(n(X)); ms.append(m); vs.append(v)
    ms, vs = torch.stack(ms), torch.stack(vs)
    mu = ms.mean(0); var = (vs + ms**2).mean(0) - mu**2   # Sec 2.4 combination
    return np.sqrt(var.squeeze(1).numpy())

xg = np.linspace(-7,7,15).astype(np.float32).reshape(-1,1)
std_e = predict(members, torch.tensor(xg))
std_s = predict([single], torch.tensor(xg))
print("x        :", [round(float(v),0) for v in xg.squeeze(1)])
print("ensemble :", [round(float(v),3) for v in std_e])
print("single   :", [round(float(v),3) for v in std_s])
# ensemble : [0.164, 0.168, 0.129, 0.104, 0.102, 0.112, 0.141, 0.124, 0.086,
#             0.115, 0.123, 0.159, 0.206, 0.279, 0.357]   <- grows toward x=7
# single   : [0.033, 0.046, 0.065, 0.087, 0.101, 0.105, 0.136, 0.122, 0.090,
#             0.109, 0.117, 0.103, 0.088, 0.071, 0.057]   <- shrinks away from data
# Our small run, not the paper's number.`
  };
})();
