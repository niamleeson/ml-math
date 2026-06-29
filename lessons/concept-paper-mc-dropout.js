/* Paper lesson — "Dropout as a Bayesian Approximation: Representing Model
   Uncertainty in Deep Learning" (MC Dropout), Gal & Ghahramani, ICML 2016.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-mc-dropout".
   GROUNDED from arXiv:1506.02142 (abstract) and the ar5iv HTML mirror
   (Section 3: dropout as approximate variational inference in a deep Gaussian
   process; Section 4 "Obtaining Model Uncertainty": Eq. 6 predictive mean,
   the following predictive-variance expression, and the term "MC dropout").
   Track B (architecture): compose a tiny multi-layer perceptron with torch.nn,
   then implement the NOVEL part — keep dropout ON at test time and run T
   stochastic forward passes; the mean is the prediction, the spread across
   passes is a model-uncertainty estimate. We reproduce the qualitative effect:
   uncertainty is LOW where training data is dense, HIGH far from the data. */
(function () {
  window.LESSONS.push({
    id: "paper-mc-dropout",
    title: "MC Dropout — Dropout as a Bayesian Approximation: Representing Model Uncertainty in Deep Learning (2016)",
    tagline: "Leave dropout ON at test time, run the network many times, and the spread of the answers measures how unsure the model is.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Yarin Gal, Zoubin Ghahramani",
      org: "University of Cambridge",
      year: 2016,
      venue: "arXiv:1506.02142 (Jun 2015); ICML 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1506.02142",
      code: "https://github.com/yaringal/DropoutUncertaintyExps"
    },
    conceptLink: "dl-dropout",
    partOf: [],
    prereqs: ["dl-dropout", "pt-nn-module", "pt-autograd", "ml-gradient-descent", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p>A standard neural network gives you <i>one</i> answer for each input, and no honest sense of how
       much to trust it. Ask a trained regression network for the value at a point far from anything it saw
       in training and it will still hand you a confident-looking number. It cannot say "I do not know here."
       That missing signal &mdash; <b>model uncertainty</b> (also called <i>epistemic</i> uncertainty: the
       uncertainty that comes from not having seen enough data) &mdash; is exactly what you need before you
       act on a prediction.</p>
       <p><b>Bayesian</b> models &mdash; models that keep a whole distribution over their weights instead of a
       single setting &mdash; do give that uncertainty. But on a deep network they have historically been
       slow and awkward to fit. From the abstract:</p>
       <blockquote>"Bayesian models offer a mathematically grounded framework to reason about model uncertainty,
       but usually come with a prohibitive computational cost." (Abstract)</blockquote>
       <p>The open question the paper answers: can we get this uncertainty out of an <b>ordinary</b> dropout
       network we already trained &mdash; with no new model, no new loss, almost no extra cost?</p>`,
    contribution:
      `<ul>
        <li><b>A new theory: dropout training is approximate Bayesian inference.</b> The paper proves that a
        deep network trained with <b>dropout</b> (randomly zeroing units during training) is mathematically an
        approximation to a <b>deep Gaussian process</b> &mdash; a principled Bayesian model. Section 3 states a
        network "with dropout applied before every weight layer, is mathematically equivalent to an
        approximation to the probabilistic deep Gaussian process."</li>
        <li><b>A free uncertainty estimate: MC dropout.</b> A direct consequence: keep dropout turned ON at
        test time and run the network $T$ times. Each run zeroes a different random set of units, so you get
        $T$ slightly different answers. Their <b>average</b> is the prediction; their <b>spread</b> (variance)
        is a model-uncertainty estimate. The paper names this "MC dropout" (MC = Monte Carlo, meaning
        "estimated by random sampling"), Section 4.</li>
        <li><b>It costs almost nothing.</b> No retraining, no extra parameters, no change to the architecture.
        You reuse a network you already have and just run it more than once at test time.</li>
      </ul>`,
    whyItMattered:
      `<p>MC dropout became the default cheap way to get uncertainty out of a deep network. Because it needs no
       change to training and no new model, practitioners bolted it onto existing networks across medical
       imaging, autonomous driving, and active learning (choosing which examples to label next by picking the
       ones the model is least sure about). It reframed dropout &mdash; until then seen only as a
       regularizer &mdash; as an approximate Bayesian method, and it kicked off a long line of work on cheap
       deep uncertainty (including deep ensembles, which compare against it as the baseline). The lasting idea:
       the randomness you already trained with can, at test time, tell you what the model does not know.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Dropout as a Bayesian Approximation)</b> &mdash; the theoretical claim: the dropout
        training objective equals (up to a constant) the variational objective that fits a deep Gaussian
        process. You do not need every line of the algebra; grasp the conclusion that training-with-dropout
        <i>is already</i> approximate Bayesian inference.</li>
        <li><b>&sect;4 (Obtaining Model Uncertainty)</b> &mdash; the part you will implement. The predictive
        mean as an average of $T$ stochastic forward passes (their <b>Equation 6</b>), and the predictive
        variance expression that follows it. This is MC dropout.</li>
        <li><b>The experiments</b> on regression and on MNIST (Modified National Institute of Standards and
        Technology handwritten-digit dataset) &mdash; look at the figures where uncertainty grows as inputs
        move away from the training data.</li>
       </ul>
       <p><b>Skim:</b> the deep-Gaussian-process derivation details and the reinforcement-learning section at
       the end, unless you want them. The one thing to take from the theory: at test time you must keep
       dropout <b>ON</b> (most code turns it off), because the random masks are what generate the sample
       spread you measure.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a small network with dropout on a 1-D regression problem whose training inputs live in
       two bands, roughly $x \\in [-4, -1.5]$ and $x \\in [1.5, 4]$ &mdash; nothing outside that range. Then you
       keep dropout ON and run the network $T = 200$ times at each test input, and measure the <b>standard
       deviation</b> (the spread, in the same units as the output) of the $200$ answers.</p>
       <p>Question: how does that spread compare <i>inside</i> the data range (say near $x = 3$) versus <i>far
       outside</i> it (say near $x = 7$)? Will it be about the same everywhere, or will it grow as you leave the
       data? Write your guess and one sentence of why.</p>`,
    attempt:
      `<p>Before the reveal, sketch the MC-dropout test-time loop. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Build a small multi-layer perceptron with <code>nn.Linear</code>, <code>nn.ReLU</code>, and
        <code>nn.Dropout(p)</code> between layers. Train it normally with mean-squared-error loss (dropout ON
        during training, as usual).</li>
        <li><b>At test time:</b> TODO &mdash; do NOT call <code>net.eval()</code>. Keep the network in
        <code>net.train()</code> mode so <code>nn.Dropout</code> stays active.  <i># this is the whole trick</i></li>
        <li>For one test input, run <code>net(x)</code> inside a loop $T$ times, collecting $T$ outputs into a
        list. Each run uses a fresh random dropout mask, so the outputs differ.</li>
        <li>TODO &mdash; the <b>prediction</b> is the mean of the $T$ outputs; the <b>uncertainty</b> is their
        variance (or standard deviation). Compute both.</li>
        <li>TODO &mdash; why must dropout be ON here? What single number would you get for the uncertainty if
        you used <code>net.eval()</code> instead?</li>
       </ul>
       <p>Then sweep the test input across and beyond the data range and watch how the spread changes.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The method has two halves: a <b>theory</b> (why dropout is secretly Bayesian) and a tiny
       <b>procedure</b> (how to read uncertainty off it). You implement the procedure; you only need the gist
       of the theory.</p>
       <p><b>The theory (&sect;3), in plain words.</b> A Bayesian network does not commit to one weight setting;
       it keeps a <i>distribution</i> over weights and averages predictions over that distribution. Fitting that
       distribution exactly is expensive. <b>Variational inference</b> is the standard shortcut: pick a simple,
       easy-to-sample family of weight distributions, then tune it to be as close as possible to the true
       Bayesian one (formally, minimise the <b>Kullback&ndash;Leibler divergence</b> &mdash; a measure of how
       different two distributions are). The paper's result: the family "multiply each weight column by an
       independent on/off random switch" is <i>exactly</i> what dropout does, and the dropout training loss is
       (up to a constant) the variational objective for fitting a deep Gaussian process. So a network you
       trained with dropout has <b>already</b> done approximate Bayesian inference &mdash; the on/off switches
       are its approximate posterior over weights.</p>
       <p><b>The procedure (&sect;4): MC dropout.</b> If the random dropout masks are a sample from the weight
       distribution, then to predict the Bayesian way you simply <b>sample masks and average</b>. Keep dropout
       ON and push the same test input $\\mathbf{x}^*$ through the network $T$ times. Pass $t$ draws weight
       matrices $\\widehat{\\mathbf{W}}_1^t, \\ldots, \\widehat{\\mathbf{W}}_L^t$ (the original weights with that
       run's random mask applied) and produces output $\\hat{\\mathbf{y}}^*$. Then:</p>
       <ul>
        <li><b>Prediction = the mean</b> of the $T$ outputs (their Equation 6). Averaging the random runs
        approximates the Bayesian predictive mean.</li>
        <li><b>Uncertainty = the variance</b> of the $T$ outputs (plus a small constant term $\\tau^{-1}$).
        Where the runs agree, the spread is small &mdash; the model is confident. Where the masks send the
        answer all over the place, the spread is large &mdash; the model is unsure.</li>
       </ul>
       <p><b>Why uncertainty grows far from data.</b> Near training points, the network has been pinned down:
       however the mask falls, it must reproduce the seen targets, so the $T$ runs land close together (small
       spread). Far from any training point nothing pins the output down, so different masks pull it in
       different directions and the $T$ runs scatter widely (large spread). That scatter is the model telling
       you it is extrapolating.</p>`,
    architecture:
      `<p>There is no new <i>network</i> &mdash; the architecture is an ordinary dropout multi-layer perceptron.
       The contribution is the <b>test-time procedure</b> layered on top of it. Component by component:</p>
       <ul>
        <li><b>Trained network ($L$ weight layers).</b> A standard feed-forward net of $L$ layers, with
        <code>nn.Dropout</code> applied <i>before every weight layer</i> at rate $p$. Layer $i$ holds a learned
        weight matrix $\\mathbf{M}_i$ of size $K_i \\times K_{i-1}$ and a nonlinearity $\\sigma$. Trained once with
        the usual dropout objective $\\mathcal{L}_{\\text{dropout}}$ &mdash; nothing special.</li>
        <li><b>Mask sampler (the posterior $q$).</b> At each forward pass, every column $j$ of every $\\mathbf{M}_i$
        is kept or zeroed by an independent draw $z_{i,j}\\sim\\mathrm{Bernoulli}(p_i)$, giving a sampled weight
        set $\\widehat{\\mathbf{W}}_1^t,\\ldots,\\widehat{\\mathbf{W}}_L^t$. One mask draw = one sample from the
        approximate weight posterior.</li>
        <li><b>The MC loop ($T$ passes).</b> For a test input $\\mathbf{x}^*$, run the network $T$ times, each with
        a fresh mask draw, collecting outputs $\\hat{\\mathbf{y}}^*_1,\\ldots,\\hat{\\mathbf{y}}^*_T$. Dropout must
        stay <b>ON</b> (in PyTorch: keep <code>net.train()</code>, do not call <code>net.eval()</code>).</li>
        <li><b>Aggregator.</b> Reduce the $T$ outputs to a <b>mean</b> (the prediction, Eq. 6) and a
        <b>variance / standard deviation</b> (the uncertainty), optionally adding the precision term
        $\\tau^{-1}\\mathbf{I}_D$ for data noise.</li>
       </ul>
       <p><b>Per-test-input procedure:</b> (1) put net in train mode so dropout is active; (2) loop $t = 1\\ldots T$,
       sampling a mask and running one forward pass each time; (3) stack the $T$ outputs; (4) take their mean as
       the prediction and their spread as the uncertainty. Training cost is unchanged; test cost is $T\\times$ a
       normal forward pass.</p>`,
    symbols: [
      { sym: "$\\mathbf{x}^*$", desc: "a <b>test input</b> &mdash; a new point where we want a prediction and an uncertainty." },
      { sym: "$\\mathbf{y}^*$", desc: "the (unknown) <b>output</b> at the test input; $\\hat{\\mathbf{y}}^*$ is the network's predicted output." },
      { sym: "$T$", desc: "the <b>number of stochastic forward passes</b> &mdash; how many times we run the network with dropout ON. Larger $T$ gives a smoother estimate; the paper uses values such as a few dozen to a few thousand." },
      { sym: "$\\widehat{\\mathbf{W}}_i^t$", desc: "the <b>masked weight matrix</b> of layer $i$ on forward pass $t$: the trained weights with that pass's random dropout mask applied. Each of the $T$ passes uses a different random mask." },
      { sym: "$\\hat{\\mathbf{y}}^*(\\mathbf{x}^*, \\widehat{\\mathbf{W}}_1^t, \\ldots, \\widehat{\\mathbf{W}}_L^t)$", desc: "the network's <b>output on pass $t$</b>: feed $\\mathbf{x}^*$ through the network using that pass's masked weights. $L$ is the number of weight layers." },
      { sym: "$\\frac{1}{T}\\sum_{t=1}^{T}$", desc: "an <b>average over the $T$ passes</b> &mdash; the Monte Carlo (random-sampling) estimate." },
      { sym: "$\\tau$", desc: "the <b>model precision</b>: a positive number set by the user (tied to the observation-noise level and weight decay). Its reciprocal $\\tau^{-1}$ is added to the variance to account for noise in the data itself. In our small demo we report only the run-to-run spread and omit this constant." },
      { sym: "$\\mathbf{I}_D$", desc: "the <b>identity matrix</b> of size $D$ (the output dimension); $\\tau^{-1}\\mathbf{I}_D$ just adds the constant $\\tau^{-1}$ to each output's variance." },
      { sym: "$\\mathbb{E}$", desc: "<b>expected value</b> (a probability-weighted average). $\\mathbb{E}_{q}(\\mathbf{y}^*)$ is the predictive mean under the dropout distribution $q$." },
      { sym: "“variance / standard deviation”", desc: "plain terms: <b>variance</b> is the average squared distance of the $T$ outputs from their mean; <b>standard deviation</b> is its square root, in the same units as the output. Either one measures the spread &mdash; the uncertainty." },
      { sym: "$\\mathcal{L}_{\\text{dropout}}$", desc: "the <b>dropout training objective</b> (Eq. 1): the loss you actually minimise when training with dropout." },
      { sym: "$N$", desc: "the <b>number of training examples</b>; $\\frac{1}{N}\\sum_i$ averages the per-example loss." },
      { sym: "$E(\\mathbf{y}_i, \\hat{\\mathbf{y}}_i)$", desc: "the <b>per-example loss</b> between the true target $\\mathbf{y}_i$ and the network's output $\\hat{\\mathbf{y}}_i$ (e.g. squared error)." },
      { sym: "$\\lambda$", desc: "the <b>weight-decay</b> coefficient &mdash; the strength of the $L_2$ penalty on the weights. Also enters the precision $\\tau$." },
      { sym: "$\\mathbf{W}_i, \\mathbf{b}_i$", desc: "the <b>weight matrix and bias</b> of layer $i$; $\\lVert\\cdot\\rVert_2^2$ is the sum of their squared entries (the $L_2$ norm squared)." },
      { sym: "$L$", desc: "the <b>number of weight layers</b> in the network." },
      { sym: "$\\mathbf{M}_i$", desc: "the <b>learned (variational) weight matrix</b> of layer $i$, size $K_i \\times K_{i-1}$. Dropout multiplies it by a random column mask to produce the masked weights $\\widehat{\\mathbf{W}}_i$." },
      { sym: "$z_{i,j}$", desc: "an <b>on/off Bernoulli switch</b> for column $j$ of layer $i$: $1$ keeps the column, $0$ zeroes it. $z_{i,j}\\sim\\mathrm{Bernoulli}(p_i)$." },
      { sym: "$K_i$", desc: "the <b>number of units</b> (columns) in layer $i$." },
      { sym: "$\\boldsymbol{\\omega}$", desc: "the <b>full set of (random) network weights</b> $\\{\\mathbf{W}_i\\}$; $q(\\boldsymbol{\\omega})$ is the dropout approximate posterior over them and $p(\\boldsymbol{\\omega})$ the prior." },
      { sym: "$q(\\boldsymbol{\\omega}), p(\\boldsymbol{\\omega})$", desc: "the <b>approximate posterior</b> $q$ (induced by dropout) and the <b>prior</b> $p$ over weights." },
      { sym: "$\\mathrm{KL}(q \\,\\Vert\\, p)$", desc: "the <b>Kullback&ndash;Leibler divergence</b> &mdash; a non-negative measure of how far $q$ is from $p$; the regulariser in the variational objective." },
      { sym: "$\\mathbf{X}, \\mathbf{Y}$", desc: "the <b>training inputs and targets</b> (all of them, stacked); $p(\\mathbf{Y}\\mid\\mathbf{X}, \\boldsymbol{\\omega})$ is the data likelihood." },
      { sym: "$\\mathbf{K}(\\mathbf{x}, \\mathbf{y})$", desc: "the <b>covariance function</b> of the deep Gaussian process the dropout network approximates: it measures how correlated the outputs at inputs $\\mathbf{x}$ and $\\mathbf{y}$ are." },
      { sym: "$\\sigma(\\cdot)$", desc: "the network's <b>nonlinearity</b> (activation function), e.g. ReLU; it appears inside the GP covariance integral." },
      { sym: "$\\mathbf{w}, b$", desc: "a single <b>weight vector and bias</b> integrated over their prior $p(\\mathbf{w})p(b)$ inside the GP covariance." },
      { sym: "$p$", desc: "the dropout <b>keep-probability</b> (a unit is kept with probability $p$); also a factor in the precision $\\tau$." },
      { sym: "$l$", desc: "the <b>prior length-scale</b> &mdash; how far apart inputs must be before their outputs decorrelate; a factor in $\\tau$." },
      { sym: "$\\operatorname{logsumexp}$", desc: "<b>log-of-sum-of-exponentials</b>, $\\log\\sum_t e^{(\\cdot)_t}$ &mdash; a numerically stable way to average likelihoods across the $T$ passes." }
    ],
    formula: `$$ \\mathcal{L}_{\\text{dropout}} \\;:=\\; \\frac{1}{N}\\sum_{i=1}^{N} E\\big(\\mathbf{y}_i, \\hat{\\mathbf{y}}_i\\big) \\;+\\; \\lambda \\sum_{i=1}^{L} \\big(\\lVert \\mathbf{W}_i \\rVert_2^2 + \\lVert \\mathbf{b}_i \\rVert_2^2\\big) $$
<p class="cap">The ordinary dropout training objective (&sect;2, Eq. 1): average per-example loss $E$ plus $L_2$ weight decay $\\lambda$. Nothing Bayesian on its face.</p>

$$ \\mathbf{W}_i \\;=\\; \\mathbf{M}_i \\cdot \\mathrm{diag}\\big([\\,z_{i,j}\\,]_{j=1}^{K_i}\\big), \\qquad z_{i,j} \\sim \\mathrm{Bernoulli}(p_i) $$
<p class="cap">The variational distribution $q(\\boldsymbol{\\omega})$ over weights (&sect;3): each weight matrix is a learned matrix $\\mathbf{M}_i$ with whole columns randomly switched off by Bernoulli draws $z_{i,j}$ &mdash; this <i>is</i> dropout, recast as sampling weights.</p>

$$ -\\!\\int q(\\boldsymbol{\\omega})\\,\\log p(\\mathbf{Y}\\mid\\mathbf{X}, \\boldsymbol{\\omega})\\, d\\boldsymbol{\\omega} \\;+\\; \\mathrm{KL}\\big(q(\\boldsymbol{\\omega}) \\,\\Vert\\, p(\\boldsymbol{\\omega})\\big) $$
<p class="cap">The variational objective (&sect;3, Eq. 3): an expected negative log-likelihood plus the Kullback&ndash;Leibler divergence of $q$ from the prior. The paper's core result: minimising this over $q$ is, up to a constant, the same as minimising $\\mathcal{L}_{\\text{dropout}}$ &mdash; so a dropout network minimises the KL to a deep Gaussian process.</p>

$$ \\mathbf{K}(\\mathbf{x}, \\mathbf{y}) \\;=\\; \\int p(\\mathbf{w})\\,p(b)\\,\\sigma(\\mathbf{w}^{\\top}\\mathbf{x} + b)\\,\\sigma(\\mathbf{w}^{\\top}\\mathbf{y} + b)\\, d\\mathbf{w}\\, db $$
<p class="cap">The deep Gaussian process covariance (&sect;3) that the dropout network approximates: integrate the product of nonlinearities $\\sigma$ over the weight/bias prior. The network's nonlinearity is exactly this $\\sigma$.</p>

$$ \\mathbb{E}_{q(\\mathbf{y}^*\\mid\\mathbf{x}^*)}(\\mathbf{y}^*) \\;\\approx\\; \\frac{1}{T}\\sum_{t=1}^{T} \\hat{\\mathbf{y}}^*\\!\\big(\\mathbf{x}^*, \\widehat{\\mathbf{W}}_1^t, \\ldots, \\widehat{\\mathbf{W}}_L^t\\big) $$
<p class="cap">The predictive mean (&sect;4, Eq. 6): average $T$ stochastic forward passes, each with a fresh dropout mask. This is "MC dropout."</p>

$$ \\mathrm{Var}_{q(\\mathbf{y}^*\\mid\\mathbf{x}^*)}(\\mathbf{y}^*) \\;\\approx\\; \\tau^{-1}\\mathbf{I}_D \\;+\\; \\frac{1}{T}\\sum_{t=1}^{T} \\hat{\\mathbf{y}}^{*\\top}\\hat{\\mathbf{y}}^* \\;-\\; \\mathbb{E}(\\mathbf{y}^*)^{\\top}\\,\\mathbb{E}(\\mathbf{y}^*) $$
<p class="cap">The predictive variance (&sect;4): the sample second moment of the $T$ outputs minus the squared mean (the sample variance), plus the data-noise term $\\tau^{-1}\\mathbf{I}_D$.</p>

$$ \\tau \\;=\\; \\frac{p\\,l^2}{2N\\lambda} $$
<p class="cap">The model precision (&sect;4, Eq. 7) that sets $\\tau^{-1}$: built from the dropout keep-probability $p$, prior length-scale $l$, dataset size $N$, and weight-decay $\\lambda$. It ties the Bayesian noise term back to the quantities you already chose when training.</p>

$$ \\log p(\\mathbf{y}^*\\mid\\mathbf{x}^*, \\mathbf{X}, \\mathbf{Y}) \\;\\approx\\; \\operatorname*{logsumexp}_{t=1}^{T}\\!\\Big(\\!-\\tfrac{1}{2}\\tau\\lVert \\mathbf{y}^* - \\hat{\\mathbf{y}}^*_t \\rVert^2\\Big) - \\log T - \\tfrac{1}{2}\\log 2\\pi - \\tfrac{1}{2}\\log \\tau^{-1} $$
<p class="cap">The predictive log-likelihood (&sect;4, Eq. 8) used to score regression: a $\\log\\sum\\exp$ over the $T$ passes, the metric the paper reports improving over prior methods.</p>`,
    whatItDoes:
      `<p><b>The first line (Equation 6)</b> is the prediction: run the network $T$ times with dropout ON and
       <b>average</b> the outputs. Each pass uses a different random mask $\\widehat{\\mathbf{W}}_i^t$, so the
       average smooths over the masks &mdash; it approximates what a true Bayesian network would predict by
       integrating over all weight settings.</p>
       <p><b>The second line</b> is the uncertainty: it is the ordinary <b>sample variance</b> of those same
       $T$ outputs (the average of $\\hat{\\mathbf{y}}^{*\\top}\\hat{\\mathbf{y}}^*$ minus the squared mean &mdash;
       exactly "mean of the squares minus the square of the mean"), plus a constant $\\tau^{-1}$ for the noise
       baked into the data. The paper notes (&sect;4) this "is equivalent to performing $T$ stochastic forward
       passes through the network and averaging the results." For a scalar output the variance term reduces to
       the plain variance of the $T$ numbers; we report its square root, the <b>standard deviation</b>, as the
       uncertainty. Big spread means the masks disagree means the model is unsure.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the mechanics of dropout itself live in the dl-dropout concept lesson; here we
       only justify why averaging masked runs gives a Bayesian prediction.</b></p>
       <p>A Bayesian network predicts by integrating its output over the posterior distribution of weights
       $q(\\boldsymbol{\\omega})$ &mdash; an average of the network's answer, weighted by how plausible each
       weight setting is:</p>
       <p>$$ \\mathbb{E}_{q}(\\mathbf{y}^*) = \\int \\hat{\\mathbf{y}}^*(\\mathbf{x}^*, \\boldsymbol{\\omega})\\,
       q(\\boldsymbol{\\omega})\\, d\\boldsymbol{\\omega}. $$</p>
       <p>That integral is intractable in general. The Monte Carlo trick is: if we can <b>draw samples</b>
       $\\boldsymbol{\\omega}^t \\sim q(\\boldsymbol{\\omega})$, the integral is approximated by the sample mean,
       $\\frac{1}{T}\\sum_{t=1}^{T}\\hat{\\mathbf{y}}^*(\\mathbf{x}^*, \\boldsymbol{\\omega}^t)$, and this estimate
       gets better as $T$ grows. The paper's &sect;3 result is that for a dropout network the approximate
       posterior $q(\\boldsymbol{\\omega})$ is precisely "the trained weights times an independent on/off random
       mask." So <b>applying dropout once = one sample $\\boldsymbol{\\omega}^t$.</b> Running the network $T$
       times with dropout ON draws $T$ samples; averaging them gives Equation 6, and their sample variance
       gives the predictive variance. The uncertainty is therefore just the spread you would compute for any
       $T$ numbers &mdash; the only new idea is that <i>leaving dropout ON makes those numbers a posterior
       sample.</i></p>`,
    example:
      `<p>Work the mean and variance across a few MC-dropout passes by hand, for one input. Take the final
       hidden layer of a tiny network at one test point: 4 hidden activations $h = [1, 2, 3, 4]$, output weights
       all equal to $1$, and no bias, so the output is just the sum of the kept hidden values. Use dropout rate
       $p = 0.5$, which keeps each unit with probability $0.5$. PyTorch uses <b>inverted dropout</b>: it scales
       kept activations by $\\tfrac{1}{1-p} = 2$ so the average activation is unchanged. Run $T = 4$ passes; each
       pass keeps a different random pair of the 4 units.</p>
       <table class="extable">
        <caption>$T=4$ stochastic forward passes over $h=[1,2,3,4]$. Output $=$ (sum of kept units) $\\times 2$.</caption>
        <thead><tr><th>pass $t$</th><th>units kept</th><th class="num">kept sum</th><th class="num">$\\times\\,2$ = output $\\hat{y}_t$</th><th class="num">$(\\hat{y}_t-\\bar{y})^2$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">1</td><td>$[1,2]$</td><td class="num">3</td><td class="num">6</td><td class="num">16</td></tr>
         <tr><td class="row-h">2</td><td>$[2,3]$</td><td class="num">5</td><td class="num">10</td><td class="num">0</td></tr>
         <tr><td class="row-h">3</td><td>$[1,4]$</td><td class="num">5</td><td class="num">10</td><td class="num">0</td></tr>
         <tr><td class="row-h">4</td><td>$[3,4]$</td><td class="num">7</td><td class="num">14</td><td class="num">16</td></tr>
         <tr><td class="row-h"><b>mean / sum</b></td><td></td><td class="num"></td><td class="num"><b>10.0</b></td><td class="num"><b>32</b></td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Predictive mean</b> (Eq. 6) $= \\tfrac{1}{4}(6 + 10 + 10 + 14) = \\tfrac{40}{4} = 10.0$ (the output
        column's mean).</li>
        <li><b>Deviations from the mean.</b> $[6-10,\\,10-10,\\,10-10,\\,14-10] = [-4, 0, 0, 4]$; squared
        $[16, 0, 0, 16]$ (the last column), summing to $32$.</li>
        <li><b>Predictive variance</b> (sample variance, ignoring the constant $\\tau^{-1}$)
        $= \\tfrac{32}{4} = 8.0$.</li>
        <li><b>Standard deviation</b> (the spread we report) $= \\sqrt{8.0} \\approx 2.83$.</li>
       </ul>
       <p>So this input's prediction is $10.0$ with an uncertainty of about $\\pm 2.83$. Two inputs can share the
       same mean yet differ wildly in spread &mdash; that spread is the whole point. These exact numbers
       ($[6, 10, 10, 14] \\to$ mean $10.0$, variance $8.0$, std $\\approx 2.83$) are recomputed in the notebook's
       first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build the model</b> with <code>torch.nn</code>: a small multi-layer perceptron
        ($1 \\to 100 \\to 100 \\to 1$, ReLU) with <code>nn.Dropout(p)</code> after each hidden ReLU (we use
        $p = 0.2$).</li>
        <li><b>Make a 1-D regression problem with a gap.</b> Draw training inputs only from two bands,
        $x \\in [-4, -1.5]$ and $x \\in [1.5, 4]$, with targets $y = \\sin(1.5x)$ plus a little noise. Nothing is
        sampled outside $[-4, 4]$.</li>
        <li><b>Train normally</b> with mean-squared-error loss and Adam (dropout ON during training, as usual).</li>
        <li><b>MC dropout at test time:</b> keep the network in <code>net.train()</code> mode so dropout stays
        active, then for each test input run $T = 200$ forward passes and stack the outputs.</li>
        <li><b>Read off mean and uncertainty:</b> the per-input <b>mean</b> across the $T$ passes is the
        prediction; the per-input <b>standard deviation</b> across the passes is the uncertainty.</li>
        <li><b>Sweep $x$ across and beyond $[-4, 4]$</b> and plot the uncertainty. <b>Ablate</b> by switching to
        <code>net.eval()</code> (dropout OFF): all $T$ passes become identical and the uncertainty collapses to
        zero everywhere &mdash; the signal is gone.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the framework casts "dropout training in deep neural networks (NNs) as
       approximate Bayesian inference in deep Gaussian processes," giving "tools to model uncertainty with
       dropout NNs &mdash; extracting information from existing models that has been thrown away so far," and
       the authors "show a considerable improvement in predictive log-likelihood and RMSE compared to existing
       state-of-the-art methods."</p>
       <p>The paper's regression figures show the predictive uncertainty growing as test inputs move away from
       the training data, which is the qualitative effect we reproduce.</p>
       <p><i>These are the paper's own statements, quoted from the abstract. The specific numbers in the CODE
       and CODEVIZ panels below are from our own tiny run on a 1-D regression problem &mdash; not the paper's
       reported results.</i></p>`,
    evaluation:
      `<p><b>Metric &amp; benchmark.</b> Two things to score. (1) <b>Predictive accuracy:</b> the MC-dropout
       <i>mean</i> (Eq. 6) should match a normal trained network's predictions &mdash; report <b>RMSE</b> on a
       held-out set, and <b>predictive log-likelihood</b> (Eq. 8, the metric the paper reports improving over
       prior methods). (2) <b>Uncertainty quality:</b> the real claim is that the <i>spread</i> tracks where
       data is missing &mdash; measure the mean predictive <b>standard deviation in-data vs in the
       extrapolation tails</b> and check the ratio is well above 1. The "better than trivial" baseline for the
       uncertainty is a <b>constant std</b> (same spread everywhere): a useful estimate must rise where the
       network leaves the training range.</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> (1) <b>Recompute the worked example</b> &mdash; outputs
        $[6,10,10,14]\\to$ mean $10.0$, variance $8.0$, std $\\approx 2.83$; the first code cell does this.
        (2) <b>Dropout really is ON at test time:</b> run the same input twice in <code>net.train()</code> and
        confirm the two outputs <b>differ</b> &mdash; if they are identical you are silently in eval mode.
        (3) <b>The eval()-gives-zero check:</b> the same $T$ passes under <code>net.eval()</code> must give
        std exactly $0$ (the notebook prints $0.000000$) &mdash; a positive value there means dropout did not
        switch off, i.e. it was never on. (4) <b>$T$ is large enough:</b> the mean and std should stabilise as
        you raise $T$; with $T=200$ they should barely move on a re-run.</li>
        <li><b>Expected range.</b> The paper's own claims (abstract) are qualitative for our setting &mdash;
        "a considerable improvement in predictive log-likelihood and RMSE compared to existing state-of-the-art
        methods," and figures where uncertainty <b>grows as inputs move away from the training data</b>. That
        rising-spread shape is the target; we have no single paper number to hit. In our 1-D run the mean std
        is about <b>0.10 in-data</b> and about <b>0.40 in the extrapolation tails</b> (roughly $4\\times$) &mdash;
        treat the $\\approx 4\\times$ as an approximate rule of thumb, not a paper claim. A ratio near $1$
        (flat std) is "probably a bug or near-zero dropout"; a ratio of a few is the expected effect.</li>
        <li><b>Ablation &mdash; prove the random masks are the source of the signal.</b> The central knob is
        <b>keeping dropout ON at test time</b>. Switch the $T$ passes to <code>net.eval()</code> (everything
        else identical): the std must <b>collapse to $0$ everywhere</b>, including far outside the data. If the
        uncertainty does <i>not</i> drop to zero, dropout was not actually active in the train-mode passes
        either &mdash; so the spread you saw was an artifact. A second knob: shrink the dropout rate $p$ toward
        $0$ and confirm the in-data/extrapolation std gap shrinks too.</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Std is $0$ (or constant) everywhere:</b> you called
        <code>net.eval()</code> for the passes &mdash; the number-one mistake &mdash; or the dropout rate is
        near zero / dropout is in the wrong place. <b>Std flat but nonzero, no rise in the tails:</b> too few
        passes (raise $T$), or the network barely fit the data. <b>The mean prediction is noisy / unstable
        across re-runs:</b> $T$ too small. <b>A wide interpolation GAP between two clusters shows little
        uncertainty:</b> expected &mdash; MC dropout reliably flags <i>extrapolation</i> outside the range, not
        every interior hole, so do not read a quiet gap as a broken estimate.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the building blocks already ship in PyTorch, so you
       <b>import</b> them and add only the novel idea. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code>, <code>nn.Dropout</code> for the multi-layer perceptron, <code>nn.MSELoss</code>,
       and <code>torch.optim.Adam</code>. <b>Build by hand (the contribution):</b> the test-time MC-dropout
       loop &mdash; keep the network in <code>net.train()</code> so <code>nn.Dropout</code> stays ON, run $T$
       stochastic forward passes per input, and turn them into a <b>mean</b> (the prediction, Eq. 6) and a
       <b>standard deviation</b> (the uncertainty). PyTorch will not do this for you: its default
       <code>net.eval()</code> turns dropout off and gives one deterministic answer with no spread. The
       mechanics of dropout itself are recapped from the <b>dl-dropout</b> concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Calling <code>net.eval()</code> at test time.</b> This is the number-one mistake. <code>eval()</code>
        turns <code>nn.Dropout</code> OFF, so every one of the $T$ passes is identical, the variance is exactly
        $0$, and you get no uncertainty at all. <b>Fix:</b> keep the network in <code>net.train()</code> for the
        MC-dropout passes (but still wrap them in <code>torch.no_grad()</code> &mdash; you want no gradients,
        just the stochastic forward outputs).</li>
        <li><b>Too few passes.</b> With small $T$ the mean and variance are noisy estimates. Use enough passes
        (dozens to hundreds) that the numbers stabilise; we use $T = 200$.</li>
        <li><b>Expecting a wide interpolation GAP to show high uncertainty.</b> MC dropout most reliably flags
        <b>extrapolation</b> &mdash; inputs outside the training <i>range</i>. A ReLU network can still
        interpolate confidently <i>across</i> a hole between two data clusters, so a gap in the middle may show
        only mildly raised uncertainty. The robust, reproducible effect (and the one we measure) is: low spread
        inside the data range, sharply rising spread as you leave it. Do not over-claim that every empty region
        lights up.</li>
        <li><b>Forgetting the data-noise term.</b> The full predictive variance adds $\\tau^{-1}$ for
        observation noise. Our demo reports only the run-to-run spread (the <i>model</i> uncertainty) and omits
        this constant &mdash; fine for showing the qualitative shape, but it is not the complete predictive
        variance.</li>
        <li><b>Dropout in the wrong places / rate too small.</b> The theory wants dropout before weight layers;
        a vanishingly small rate gives a vanishingly small spread. If uncertainty looks flat everywhere, check
        that dropout is actually active and the rate is not near zero.</li>
      </ul>`,
    recall: [
      "Write the MC-dropout predictive mean (Eq. 6) from memory and say what each of the $T$ passes is.",
      "What is the single most important thing you must do differently from normal inference at test time?",
      "Where is the predictive uncertainty (the spread) LOW and where is it HIGH, and why?",
      "If you call <code>net.eval()</code> for the $T$ passes, what value does the uncertainty take, and why?"
    ],
    practice: [
      {
        q: `<b>The eval() ablation.</b> You have a working MC-dropout setup that keeps the network in
            <code>net.train()</code> for the $T$ passes. Switch it to <code>net.eval()</code> (everything else
            identical) and re-measure the uncertainty. What happens to the spread across the $T$ passes, and
            why?`,
        steps: [
          { do: `Recall what <code>net.eval()</code> does to <code>nn.Dropout</code>: it turns dropout OFF (no units are zeroed; activations pass through unscaled).`, why: `In eval mode dropout is the identity, so the network becomes deterministic for a fixed input.` },
          { do: `Run the $T$ forward passes in eval mode and look at the outputs: all $T$ outputs are byte-for-byte identical.`, why: `With no random mask, the same input always yields the same output, so there is nothing to vary across passes.` },
          { do: `Compute the variance / standard deviation of $T$ identical numbers.`, why: `The variance of a list of identical values is exactly $0$ &mdash; the uncertainty signal vanishes.` }
        ],
        answer: `<p>In <code>net.eval()</code> mode dropout is OFF, so all $T$ forward passes return the
                 <i>same</i> number. Their variance is exactly $0$ and the standard deviation is $0$ everywhere
                 &mdash; including far outside the training data, where you most wanted a warning. The whole
                 uncertainty estimate collapses. This is exactly why MC dropout's defining instruction is "keep
                 dropout ON at test time": the random masks are the source of the spread you measure.</p>`
      },
      {
        q: `Why is the MC-dropout uncertainty <b>low</b> near the training data and <b>high</b> far outside the
            data range, even though it is the same network with the same dropout rate everywhere?`,
        steps: [
          { do: `Think about a test point sitting on top of training points. During training, however the mask fell, the network was pushed to reproduce the seen target there.`, why: `The output near data is constrained by the loss, so different masks must all give nearly the same answer &mdash; small spread.` },
          { do: `Now think about a test point far outside the training range. No training point ever constrained the output there.`, why: `Nothing pins the output down, so different masks send it in different directions &mdash; large spread.` },
          { do: `Connect spread to uncertainty: spread across masks is the predictive variance, and masks are posterior samples (&sect;3).`, why: `A large posterior sample spread is precisely the model saying "many weight settings consistent with my training disagree here" &mdash; epistemic uncertainty.` }
        ],
        answer: `<p>The dropout masks are samples from the model's approximate weight posterior. Where training
                 data pins the output down, every mask must reproduce it, so the $T$ runs agree &mdash; small
                 spread, low uncertainty. Where no data constrains the output (outside the training range),
                 different masks pull the answer in different directions, so the $T$ runs scatter &mdash; large
                 spread, high uncertainty. Same network, same rate; the difference is whether the data
                 constrained that region. In our run the mean standard deviation is about $0.10$ inside the data
                 range and about $0.40$ in the extrapolation tails &mdash; roughly four times larger.</p>`
      },
      {
        q: `In the worked example you had hidden activations $h = [1, 2, 3, 4]$, output weights all $1$, dropout
            $p = 0.5$ (inverted-dropout scale $2$), and the four passes kept $[1,2]$, $[2,3]$, $[1,4]$, $[3,4]$,
            giving outputs $[6, 10, 10, 14]$ with mean $10.0$ and variance $8.0$. Suppose a different input gives
            four passes with outputs $[9, 11, 9, 11]$ instead. Compute its mean and standard deviation, and say
            which input the model is more confident about.`,
        steps: [
          { do: `Mean of $[9, 11, 9, 11]$: $\\tfrac{1}{4}(9+11+9+11) = \\tfrac{40}{4} = 10.0$.`, why: `Same predictive mean as the first input ($10.0$), so the point estimate is identical.` },
          { do: `Deviations from the mean: $[-1, 1, -1, 1]$; squared $[1, 1, 1, 1]$; variance $= \\tfrac{4}{4} = 1.0$; standard deviation $= \\sqrt{1.0} = 1.0$.`, why: `The four outputs are tightly clustered, so the spread is small.` },
          { do: `Compare spreads: first input std $\\approx 2.83$, second input std $= 1.0$.`, why: `Same mean, very different uncertainty &mdash; the spread, not the mean, carries the confidence.` }
        ],
        answer: `<p>The second input has mean $10.0$ and standard deviation $1.0$ &mdash; the <i>same</i>
                 prediction as the first input but a much smaller spread ($1.0$ versus $\\approx 2.83$). The
                 model is therefore <b>more confident</b> about the second input. This is the heart of MC
                 dropout: two inputs can share a prediction yet differ in trustworthiness, and only the
                 across-pass spread reveals it.</p>`
      }
    ]
  });

  window.CODE["paper-mc-dropout"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a small multi-layer perceptron with <code>nn.Linear</code> /
       <code>nn.ReLU</code> / <code>nn.Dropout</code>, train it normally, then build the <b>novel</b> part by
       hand &mdash; <b>MC dropout</b> at test time. We make a 1-D regression problem whose training inputs live
       only in two bands ($x \\in [-4, -1.5]$ and $x \\in [1.5, 4]$, target $y = \\sin(1.5x)$), so points with
       $|x| \\gt 4$ are pure extrapolation. After training, we keep the network in <code>net.train()</code> so
       <code>nn.Dropout</code> stays ON, then run $T = 200$ stochastic forward passes per input: the
       per-input <b>mean</b> is the prediction (Eq. 6), the per-input <b>standard deviation</b> is the
       uncertainty. The first cell recomputes the worked example ($[6, 10, 10, 14] \\to$ mean $10.0$, variance
       $8.0$, std $\\approx 2.83$). CPU, well under a minute. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn
import numpy as np
torch.manual_seed(1); np.random.seed(1)

# --- 0. Sanity-check the worked example: MC dropout mean/variance over 4 passes by hand. ---
# 4 hidden activations h=[1,2,3,4], output weights all 1, no bias. Dropout p=0.5 -> inverted
# scale 1/(1-p)=2. Four masks keep [1,2], [2,3], [1,4], [3,4]; output = (sum of kept) * 2.
h = np.array([1., 2., 3., 4.]); scale = 2.0
masks = [np.array([1,1,0,0]), np.array([0,1,1,0]),
         np.array([1,0,0,1]), np.array([0,0,1,1])]
outs = np.array([ (h * m * scale).sum() for m in masks ])
print("worked example: outs =", list(outs))
print("  predictive mean =", outs.mean(),
      " variance =", outs.var(), " std = %.4f" % outs.std())
# worked example: outs = [6.0, 10.0, 10.0, 14.0]
#   predictive mean = 10.0  variance = 8.0  std = 2.8284


# --- 1. The model: a small multi-layer perceptron with dropout, composed with torch.nn. ---
P = 0.2
def make_net():
    return nn.Sequential(nn.Linear(1, 100), nn.ReLU(), nn.Dropout(P),
                         nn.Linear(100, 100), nn.ReLU(), nn.Dropout(P),
                         nn.Linear(100, 1))

# --- 2. A 1-D regression problem with NO data outside [-4, 4] (so |x|>4 is extrapolation). ---
def f(x): return np.sin(1.5 * x)
xa = np.random.uniform(-4.0, -1.5, 50)
xb = np.random.uniform( 1.5,  4.0, 50)
xtr = np.concatenate([xa, xb]).astype(np.float32)
ytr = (f(xtr) + 0.03 * np.random.randn(len(xtr))).astype(np.float32)
Xtr = torch.tensor(xtr).unsqueeze(1); Ytr = torch.tensor(ytr).unsqueeze(1)

# --- 3. Train normally (dropout ON during training, as usual). ---
net = make_net()
opt = torch.optim.Adam(net.parameters(), lr=5e-3, weight_decay=1e-5)
lossf = nn.MSELoss()
net.train()
for epoch in range(1500):
    opt.zero_grad(); loss = lossf(net(Xtr), Ytr); loss.backward(); opt.step()
print("\\nfinal train loss: %.5f" % loss.item())

# --- 4. MC DROPOUT (the novel part): keep dropout ON, T stochastic forward passes. ---
def mc_dropout(net, x, T=200):
    net.train()                                  # <-- dropout STAYS ON (do NOT call net.eval())
    with torch.no_grad():
        preds = torch.stack([net(x) for _ in range(T)], dim=0)   # (T, N, 1)
    return preds.mean(0), preds.std(0)           # predictive mean (Eq. 6), uncertainty

# --- 5. Compare uncertainty INSIDE the data range vs FAR outside it. ---
for xq in [-3.0, 3.0, 7.0, -7.0]:
    mean, std = mc_dropout(net, torch.tensor([[xq]]))
    tag = "in-data    " if abs(xq) <= 4 else "extrapolate"
    print("  x=%5.1f (%s): pred=%6.3f  uncertainty(std)=%.4f" % (
          xq, tag, mean.item(), std.item()))

# final train loss: ~0.0216
#   x= -3.0 (in-data    ): pred=~0.89   uncertainty(std)=~0.112   <- low: data is dense here
#   x=  3.0 (in-data    ): pred=~-0.93  uncertainty(std)=~0.107   <- low
#   x=  7.0 (extrapolate): pred=~-0.24  uncertainty(std)=~0.403   <- HIGH: far from any data
#   x= -7.0 (extrapolate): pred=~-0.32  uncertainty(std)=~0.413   <- HIGH
# (Our small run, not the paper's reported numbers. Exact values vary by seed/hardware.)

# --- 6. Ablation: net.eval() turns dropout OFF -> all T passes identical -> uncertainty = 0. ---
net.eval()
with torch.no_grad():
    e = torch.stack([net(torch.tensor([[7.0]])) for _ in range(200)], 0)
print("\\nablation net.eval() at x=7.0: std across 200 passes = %.6f (signal gone)" % e.std().item())
# ablation net.eval() at x=7.0: std across 200 passes = 0.000000 (signal gone)`
  };

  window.CODEVIZ["paper-mc-dropout"] = {
    question: "As the test input moves from inside the training data range out to where no data was seen, how does MC dropout's predictive uncertainty (std across T=200 passes) change?",
    charts: [
      {
        type: "line",
        title: "MC dropout uncertainty vs input x — low where data is dense, high far from data",
        xlabel: "test input x  (training data lives only in [-4,-1.5] and [1.5,4])",
        ylabel: "uncertainty: std of T=200 stochastic passes",
        series: [
          {
            name: "predictive std (uncertainty)",
            color: "#d2a8ff",
            points: [[-8,0.52],[-7.2,0.424],[-6.4,0.353],[-5.6,0.28],[-4.8,0.19],[-4,0.137],[-3.2,0.119],[-2.4,0.086],[-1.6,0.113],[-0.8,0.094],[0,0.096],[0.8,0.103],[1.6,0.123],[2.4,0.086],[3.2,0.116],[4,0.137],[4.8,0.196],[5.6,0.3],[6.4,0.32],[7.2,0.404],[8,0.448]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A small multi-layer perceptron (1&rarr;100&rarr;100&rarr;1, ReLU, dropout p=0.2) trained on a 1-D regression problem whose inputs live only in x in [-4,-1.5] and [1.5,4] (target y=sin(1.5x)). At test time we keep dropout ON and run T=200 stochastic forward passes per input; the plotted value is the standard deviation of those 200 outputs. Across the data range (roughly |x|&le;4) the std stays low (~0.09-0.14): the passes agree because the training targets pin the output down. As x leaves the data range the std climbs steeply (to ~0.4-0.5 by |x|=7-8): with nothing to constrain it, different dropout masks scatter the output. Mean std is ~0.10 in-data vs ~0.40 in the extrapolation tails &mdash; roughly 4x higher. That rising spread is the model flagging that it is extrapolating.",
    code: `import torch, torch.nn as nn, numpy as np
torch.manual_seed(1); np.random.seed(1)

# 1-D regression, data only in two bands; nothing outside [-4, 4].
def f(x): return np.sin(1.5 * x)
xtr = np.concatenate([np.random.uniform(-4.0,-1.5,50),
                      np.random.uniform( 1.5, 4.0,50)]).astype(np.float32)
ytr = (f(xtr) + 0.03*np.random.randn(len(xtr))).astype(np.float32)
Xtr = torch.tensor(xtr).unsqueeze(1); Ytr = torch.tensor(ytr).unsqueeze(1)

P = 0.2
net = nn.Sequential(nn.Linear(1,100), nn.ReLU(), nn.Dropout(P),
                    nn.Linear(100,100), nn.ReLU(), nn.Dropout(P),
                    nn.Linear(100,1))
opt = torch.optim.Adam(net.parameters(), lr=5e-3, weight_decay=1e-5); lf = nn.MSELoss()
net.train()
for e in range(1500):
    opt.zero_grad(); lf(net(Xtr), Ytr).backward(); opt.step()

# MC dropout: keep dropout ON, T=200 passes across a grid of inputs.
net.train(); T = 200
grid = torch.linspace(-8, 8, 161).unsqueeze(1)
with torch.no_grad():
    preds = torch.stack([net(grid) for _ in range(T)], 0)   # (T, 161, 1)
mean = preds.mean(0).squeeze(1).numpy()
std  = preds.std(0).squeeze(1).numpy()
xs = np.linspace(-8, 8, 161)

indata = std[((xs>=-4)&(xs<=-1.5)) | ((xs>=1.5)&(xs<=4))]
extrap = std[(xs<=-6) | (xs>=6)]
print("mean std IN-DATA   : %.3f" % indata.mean())
print("mean std EXTRAPOL  : %.3f" % extrap.mean())
sel = list(range(0, 161, 8))
print([[round(float(xs[i]),1), round(float(std[i]),3)] for i in sel])
# mean std IN-DATA   : 0.105
# mean std EXTRAPOL  : 0.397
# std stays ~0.09-0.14 inside the data range and climbs to ~0.4-0.5 past |x|=7.
# Our small run, not the paper's number.`
  };
})();
