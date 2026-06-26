/* Paper lesson — Dropout (Srivastava, Hinton, Krizhevsky, Sutskever, Salakhutdinov, JMLR 2014).
   Grounded from the official JMLR PDF: jmlr.org/papers/v15/srivastava14a
   (Section 2 Motivation, Section 4 Model Description eqs, Section 6 / Table 2 results).
   Track A (primitive): build dropout (inverted dropout) from scratch with raw torch, verify the
   expected-value property and train/eval behavior match nn.Dropout, then show overfitting reduction.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-dropout". */
(function () {
  window.LESSONS.push({
    id: "paper-dropout",
    title: "Dropout — A Simple Way to Prevent Neural Networks from Overfitting (2014)",
    tagline: "Randomly switch off a fraction of units each training step, so the network can't rely on any single unit and overfits less.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Nitish Srivastava, Geoffrey Hinton, Alex Krizhevsky, Ilya Sutskever, Ruslan Salakhutdinov",
      org: "University of Toronto",
      year: 2014,
      venue: "Journal of Machine Learning Research (JMLR), vol. 15, pp. 1929–1958",
      citations: "",
      arxiv: "",
      url: "https://jmlr.org/papers/v15/srivastava14a",
      code: ""
    },

    conceptLink: "dl-dropout",
    partOf: [],
    prereqs: ["dl-dropout", "dl-backprop", "ml-bias-variance", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A neural network is a stack of layers; each layer has many <b>units</b> (also
       called neurons &mdash; a unit just computes a weighted sum of its inputs and passes it through a
       nonlinearity). A big network has so many units and weights that it can <b>memorize</b> the training
       set: it drives the training error to near zero by fitting the noise, not the signal.</p>
       <p>This is <b>overfitting</b> &mdash; doing great on data it has seen and badly on new data. The paper
       names a specific mechanism: <b>co-adaptation</b>. Units learn to fix each other's mistakes
       <i>in concert</i>, forming brittle teams that only work together on the exact training examples and
       fall apart on new data (Section 2, Motivation). Before this paper the usual fixes were collecting
       more data, early stopping, or weight penalties &mdash; none cheap or fully effective.</p>`,

    contribution:
      `<p>The paper introduces one idea with two halves:</p>
       <ul>
         <li><b>Dropout at training time.</b> On every training step, each unit is kept with probability
         $p$ and <b>dropped</b> (output forced to zero) with probability $1-p$, independently. So each step
         trains a different randomly <b>thinned</b> sub-network. Because a unit can vanish at any moment, no
         unit can depend on a fixed partner &mdash; co-adaptation is broken (Section 4, Figure 3b).</li>
         <li><b>Weight scaling at test time.</b> At test time all units are present (no dropping), so each
         unit now receives, on average, $1/p$ times as much input as during training. To cancel that, the
         outgoing weights are scaled down: $W_{test} = p\\,W$ (Section 4). This makes one cheap deterministic
         network approximate the <b>average</b> of the exponentially many thinned sub-networks &mdash; an
         approximate <b>model ensemble</b> for the price of one.</li>
       </ul>
       <p>(Modern libraries fold the $p$ scaling into <i>training</i> instead &mdash; "inverted dropout";
       see the walkthrough.)</p>`,

    whyItMattered:
      `<p>Dropout became the default regularizer for fully-connected layers across vision, speech, text, and
       genetics. The paper reports it "improved generalization performance on <i>all</i> data sets compared
       to neural networks that did not use dropout" (Section 6). It is built into every major deep-learning
       framework as a one-line layer (<code>nn.Dropout</code>), inspired later variants (DropConnect,
       SpatialDropout, DropPath), and gave a second life as a Bayesian uncertainty estimate (MC&nbsp;Dropout,
       which leaves dropout on at test time to sample predictions).</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 2 (Motivation)</b> &mdash; the co-adaptation argument and the evolution/conspiracy
         analogies. This is <i>why</i> dropout helps.</li>
         <li><b>Section 4 (Model Description) and Figure 3</b> &mdash; the four equations that define dropout
         (the Bernoulli mask, the elementwise multiply, the test-time $W_{test}=pW$ rule). This is the whole
         method; everything else is justification and experiments.</li>
         <li><b>Section 6.1.1 and Table 2 (MNIST)</b> &mdash; the headline numbers: standard net vs dropout.</li>
       </ul>
       <p><b>Skim:</b> Sections 7&ndash;9 (analysis of features, sparsity, the effect of $p$ and data-set size)
       for intuition; the per-experiment hyperparameters in Appendix&nbsp;B are not needed to understand the idea.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will train the same network twice on the same small, noisy
       classification task &mdash; once with no dropout, once with dropout. The no-dropout net has enough
       capacity to memorize. Will its <b>training</b> loss end <i>lower</i> than the dropout net's? And will
       its <b>test</b> loss end <i>higher</i> (a bigger train&ndash;test gap)? Write down your guess, then read
       the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_dropout(x, p_drop, training)</code> using raw
       tensors, no <code>nn.Dropout</code>. Use the modern <b>inverted-dropout</b> convention, where
       <code>p_drop</code> is the probability of <i>dropping</i> a unit and <code>keep = 1 - p_drop</code>:</p>
       <ul>
         <li>If <code>not training</code> (eval mode): return <code>x</code> unchanged. <code># TODO</code></li>
         <li>If training: sample a 0/1 <b>mask</b> the shape of <code>x</code>, where each entry is 1 with
         probability <code>keep</code>. <code># TODO: mask = (torch.rand_like(x) &lt; keep).float()</code></li>
         <li>Apply it AND divide by <code>keep</code> so the expected value is unchanged:
         <code># TODO: return x * mask / keep</code>. The <code>/keep</code> is the inverted-dropout trick &mdash;
         it does the $1/p$ scaling at train time so <b>no</b> scaling is needed at test time.</li>
       </ul>
       <p>The CODE cell is the full reference. It checks two things against PyTorch: (1) in <b>eval</b> mode
       <code>my_dropout</code> and <code>nn.Dropout</code> are both the identity (exact
       <code>torch.allclose</code>), and (2) in <b>train</b> mode both <b>preserve the expected value</b> of
       the input over many masks &mdash; that statistical match is the proof your formula is right.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Dropout changes only the forward pass of a layer, and only during training.</p>
       <ol>
         <li><b>Standard layer (no dropout).</b> A unit computes
         $z_i^{(l+1)} = \\mathbf{w}_i^{(l+1)}\\mathbf{y}^{(l)} + b_i^{(l+1)}$ then applies an activation $f$:
         $y_i^{(l+1)} = f(z_i^{(l+1)})$. Here $\\mathbf{y}^{(l)}$ is the vector of outputs of layer $l$.</li>
         <li><b>Dropout layer (train).</b> Before passing $\\mathbf{y}^{(l)}$ on, draw a random 0/1 vector
         $\\mathbf{r}^{(l)}$ where each entry is 1 with probability $p$ (kept) and 0 with probability $1-p$
         (dropped). Multiply elementwise: $\\tilde{\\mathbf{y}}^{(l)} = \\mathbf{r}^{(l)} * \\mathbf{y}^{(l)}$.
         The thinned vector $\\tilde{\\mathbf{y}}^{(l)}$ &mdash; with some entries zeroed &mdash; is what feeds
         the next layer. A fresh mask is drawn for every training example / every step (Section 4).</li>
         <li><b>Test time.</b> Now all units are present, so a unit's incoming sum is on average $1/p$ times
         bigger than it was in training (a fraction $1-p$ of its inputs used to be zero). The paper fixes this
         by scaling the weights: $W_{test}^{(l)} = p\\,W^{(l)}$, and runs the network with <b>no</b> dropping.
         One deterministic network then approximates the average over all $2^{n}$ thinned sub-networks.</li>
       </ol>
       <p><b>Inverted dropout</b> (what PyTorch and this lesson implement) does the same thing more
       conveniently: instead of scaling by $p$ at <i>test</i>, it scales the kept units <i>up</i> by $1/p$ at
       <b>train</b> time. Then test time is a plain forward pass with nothing to change &mdash; the layer is
       simply skipped in eval mode. The two are mathematically equivalent; inverted dropout is preferred
       because the test path stays a clean, unscaled network. (In code we write the drop probability as
       <code>p_drop</code>, so the keep probability is $p = 1-p_{\\text{drop}}$ and we divide by $p$.)</p>`,

    architecture:
      `<p>Dropout is not a network of its own &mdash; it is a stateless <b>layer you insert between</b> existing
       layers. The host network is a standard feed-forward stack of $L$ hidden layers (Section 4): each layer
       $l$ holds a weight matrix $W^{(l)}$ and bias $\\mathbf{b}^{(l)}$, takes the previous layer's output vector
       $\\mathbf{y}^{(l)}$, computes $\\mathbf{z}^{(l+1)} = W^{(l+1)}\\mathbf{y}^{(l)} + \\mathbf{b}^{(l+1)}$, and
       applies an activation $f$. A dropout layer sits on the data path between two such layers (commonly right
       after a hidden layer's activation) and adds <b>no parameters</b> &mdash; only a hyperparameter $p$.</p>
       <p><b>Per-forward-pass data flow through one dropout layer (Figure 3b):</b></p>
       <ol>
         <li><b>In:</b> the activation vector $\\mathbf{y}^{(l)}$ of the layer above (dimension = that layer's width).</li>
         <li><b>Mask:</b> sample a same-shaped 0/1 vector $\\mathbf{r}^{(l)}$, each entry an independent
         Bernoulli($p$) draw. A new mask is sampled for every example / every step.</li>
         <li><b>Gate:</b> elementwise-multiply, $\\tilde{\\mathbf{y}}^{(l)} = \\mathbf{r}^{(l)} * \\mathbf{y}^{(l)}$,
         zeroing the dropped units. (Inverted dropout also divides the survivors by $p$ here.)</li>
         <li><b>Out:</b> the thinned vector $\\tilde{\\mathbf{y}}^{(l)}$, same dimension, fed to layer $l+1$'s linear map.</li>
       </ol>
       <p><b>Two execution modes share one set of weights:</b></p>
       <ul>
         <li><b>Train:</b> mask active &rarr; each step instantiates a different randomly thinned sub-network.
         Gradients flow only through the kept units; dropped units get zero gradient that step.</li>
         <li><b>Test:</b> mask removed, all units present; either scale the weights $W_{test}^{(l)} = p\\,W^{(l)}$
         (paper) or do nothing (inverted dropout). The result is one deterministic network approximating the
         average over all $2^{n}$ thinned sub-networks.</li>
       </ul>
       <p><b>Where it goes in the stack:</b> the paper's MNIST nets place dropout after each hidden layer with
       $p=0.5$ on hidden units and $p=0.8$ (drop 20%) on the inputs (Sections 6.1.1, 7.3). Dropout pairs well
       with max-norm: constrain each hidden unit's incoming weight vector to $\\lVert\\mathbf{w}\\rVert_2 \\le c$
       (Section 5.1), which let the paper reach 1.05% MNIST error.</p>`,

    symbols: [
      { sym: "unit (neuron)", desc: "one node in a layer: it computes a weighted sum of its inputs plus a bias, then applies a nonlinearity. A layer has many units." },
      { sym: "overfitting", desc: "fitting the training data's noise instead of its true pattern, so training error is low but test (new-data) error is high." },
      { sym: "co-adaptation", desc: "the failure mode dropout targets: units learn to depend on each other in brittle teams that only work on the training set." },
      { sym: "thinned network", desc: "the smaller sub-network you get on one training step after some units have been dropped (their outputs set to 0)." },
      { sym: "$p$", desc: "the keep (retention) probability: the chance a unit is KEPT on a given training step. In the paper $p$ is retention; in code below we instead pass the DROP probability p_drop, with keep $= 1-p_{\\text{drop}}$." },
      { sym: "$\\mathbf{y}^{(l)}$", desc: "the vector of outputs of layer $l$ (the inputs to layer $l+1$). $\\mathbf{y}^{(0)} = \\mathbf{x}$ is the network's input." },
      { sym: "$\\mathbf{r}^{(l)}$", desc: "the dropout mask for layer $l$: a vector of independent 0/1 Bernoulli draws, each 1 with probability $p$." },
      { sym: "Bernoulli($p$)", desc: "a coin flip that is 1 with probability $p$ and 0 with probability $1-p$ (here, kept vs dropped)." },
      { sym: "$*$", desc: "elementwise (Hadamard) product: multiply two vectors entry by entry. So $(\\mathbf{r}*\\mathbf{y})_j = r_j\\,y_j$." },
      { sym: "$\\tilde{\\mathbf{y}}^{(l)}$", desc: "the thinned (dropped) output vector $\\mathbf{r}^{(l)} * \\mathbf{y}^{(l)}$ that actually feeds the next layer during training." },
      { sym: "$\\mathbf{w}_i^{(l+1)}, b_i^{(l+1)}$", desc: "the incoming weight vector and bias of unit $i$ in layer $l+1$." },
      { sym: "$z_i^{(l+1)}, y_i^{(l+1)}$", desc: "unit $i$'s pre-activation (weighted sum) and post-activation output $f(z_i^{(l+1)})$." },
      { sym: "$f$", desc: "the activation function, e.g. the logistic sigmoid $f(x)=1/(1+e^{-x})$ or ReLU." },
      { sym: "$W_{test}^{(l)} = pW^{(l)}$", desc: "the test-time weight-scaling rule: multiply trained weights by the keep probability $p$ so the un-dropped test network matches the training-time expected input." },
      { sym: "$2^{n}$", desc: "the number of distinct thinned sub-networks hidden inside one net with $n$ droppable units (each unit is either kept or dropped). Dropout trains this whole family with shared weights; the scaled test net approximates their average." },
      { sym: "$\\mathbb{E}_{\\mathbf{r}}[\\cdot]$", desc: "expectation (average) over the random dropout mask $\\mathbf{r}$ &mdash; i.e. averaging an output over all the masks dropout could draw." }
    ],

    formula:
      `$$z_i^{(l+1)} = \\mathbf{w}_i^{(l+1)}\\mathbf{y}^{(l)} + b_i^{(l+1)},\\qquad
        y_i^{(l+1)} = f\\!\\left(z_i^{(l+1)}\\right)$$
       <p>Standard feed-forward layer, no dropout (Section 4): unit $i$'s pre-activation is the weighted sum of layer $l$'s outputs plus a bias, then an activation $f$.</p>
       $$r_j^{(l)} \\sim \\mathrm{Bernoulli}(p),\\qquad
        \\tilde{\\mathbf{y}}^{(l)} = \\mathbf{r}^{(l)} * \\mathbf{y}^{(l)}$$
       <p>Dropout, training (Section 4, Figure 3b): draw an independent 0/1 mask, one Bernoulli($p$) per unit, and elementwise-multiply ($*$) it into the layer's outputs to get the thinned vector $\\tilde{\\mathbf{y}}^{(l)}$ &mdash; a fresh mask each forward pass.</p>
       $$z_i^{(l+1)} = \\mathbf{w}_i^{(l+1)}\\tilde{\\mathbf{y}}^{(l)} + b_i^{(l+1)},\\qquad
        y_i^{(l+1)} = f\\!\\left(z_i^{(l+1)}\\right)$$
       <p>The thinned outputs $\\tilde{\\mathbf{y}}^{(l)}$ &mdash; not $\\mathbf{y}^{(l)}$ &mdash; feed the next layer (Section 4). Backprop runs only through this sampled sub-network.</p>
       $$W_{test}^{(l)} = p\\,W^{(l)}\\qquad(\\text{network run with no dropping})$$
       <p>Test-time weight scaling (Section 4, Figure 2): every unit is now present, so its incoming sum is on average $1/p$ too large; multiplying the outgoing weights by the keep probability $p$ restores the expected input the unit saw in training.</p>
       $$\\text{a net of } n \\text{ units } = \\text{ a collection of } 2^{n} \\text{ thinned sub-networks (shared weights)};\\quad
        \\mathbb{E}_{\\mathbf{r}}\\!\\left[\\,y_{\\text{train}}\\,\\right] = y_{\\text{test}}$$
       <p>Ensemble / model-averaging view (Section 1.1): a network with $n$ units is $2^{n}$ thinned sub-networks that share weights and are each trained rarely. The single scaled-weight test network is a cheap approximate <i>average</i> over all of them &mdash; its output equals the expected output under the dropout noise, one network for the price of an ensemble.</p>`,

    whatItDoes:
      `<p>The first line is an ordinary layer. The dropout lines insert a random 0/1 mask $\\mathbf{r}^{(l)}$
       and multiply it into the layer's outputs before they flow on, zeroing a random fraction of units each
       step. The test line scales the weights by $p$ so that, with every unit now present, each unit receives
       the same <i>expected</i> input it saw during training. (Section 4, Model Description.)</p>`,

    derivation:
      `<p>The full intuition for <i>why</i> randomly dropping units regularizes &mdash; the co-adaptation
       argument and the ensemble / model-averaging view &mdash; is developed in the <code>dl-dropout</code>
       concept lesson. Recap of the key algebra (the part the code verifies): let a unit's training output be
       $y$. With inverted dropout it is kept with probability $p$ and, when kept, scaled by $1/p$; when dropped
       it is $0$. Its expected value is therefore
       $\\mathbb{E}[\\tilde{y}] = p\\cdot(y/p) + (1-p)\\cdot 0 = y$ &mdash; <b>unchanged</b>. That is exactly why
       no test-time correction is needed under inverted dropout: train and test see the same expected
       activations. (The paper's original form instead keeps $y$ unscaled at train, giving
       $\\mathbb{E}=p\\,y$, and corrects it at test by $W_{test}=pW$.) See <code>dl-dropout</code> for the full
       treatment.</p>`,

    example:
      `<p><b>Worked numbers (the $1/(1-p)$ scaling).</b> Take a layer output vector
       $\\mathbf{y} = [2,\\,4,\\,6,\\,8]$ and inverted dropout with drop probability $p_{\\text{drop}} = 0.5$,
       so keep $p = 1 - 0.5 = 0.5$ and the scale is $1/p = 2$.</p>
       <ul>
         <li>Suppose the sampled mask keeps units 1, 3, 4 and drops unit 2: $\\mathbf{r} = [1,\\,0,\\,1,\\,1]$.</li>
         <li><b>Train output</b> $= \\mathbf{y} * \\mathbf{r} / p
         = [2,\\,0,\\,6,\\,8] \\times 2 = [\\,4,\\,0,\\,12,\\,16\\,]$. The kept units are doubled; the dropped
         one is 0.</li>
         <li><b>Why double?</b> Average over all masks. Each unit is kept with probability $0.5$, and when kept
         it is doubled. So $\\mathbb{E}[\\tilde{y}_1] = 0.5\\times(2\\times 2) + 0.5\\times 0 = 2$ &mdash; the
         original value. Same for every unit: $\\mathbb{E}[\\tilde{\\mathbf{y}}] = [2,4,6,8] = \\mathbf{y}$.</li>
         <li><b>Eval output</b> $= \\mathbf{y} = [2,\\,4,\\,6,\\,8]$ unchanged &mdash; dropout is skipped at test.</li>
       </ul>
       <p>The CODE cell recomputes the $[4,0,12,16]$ train output and the empirical mean over 200k masks
       ($\\approx [2,4,6,8]$), and checks both against PyTorch.</p>`,

    recipe:
      `<p><b>Inverted dropout as numbered steps (what you implement):</b></p>
       <ol>
         <li>Read the drop probability $p_{\\text{drop}}$; set keep $p = 1 - p_{\\text{drop}}$.</li>
         <li><b>Eval mode:</b> return the input unchanged. (No mask, no scaling.)</li>
         <li><b>Train mode:</b> sample a 0/1 mask the shape of the input, each entry 1 with probability $p$.</li>
         <li>Multiply the input by the mask (zero the dropped units).</li>
         <li>Divide by $p$ (scale kept units up by $1/p$) so the expected value is unchanged.</li>
         <li>Place a dropout layer between layers (commonly after the activation of each hidden layer); a fresh
         mask is drawn every forward pass.</li>
       </ol>`,

    results:
      `<p>Quoted from the paper. On <b>MNIST</b> (Section 6.1.1, Table 2), a standard fully-connected net gets
       <b>1.60%</b> test error; the same architecture with dropout gets <b>1.35%</b>, and dropout plus
       max-norm weight constraints reaches <b>1.05%</b>; a Deep Boltzmann Machine fine-tuned with dropout
       reaches the table's best <b>0.79%</b>. The abstract states dropout "significantly reduces overfitting
       and gives major improvements over other regularization methods." (Source: JMLR vol. 15, Table 2;
       jmlr.org/papers/v15/srivastava14a.) The numbers in the CODEVIZ below are our own small run, not these
       paper numbers.</p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> Dropout is a regularizer, so the metric is <b>test-set error</b>
       (and the <b>train&ndash;test gap</b> that measures overfitting). The paper's benchmark is <b>MNIST</b>
       classification test error (&sect;6.1.1, Table 2). The no-skill / baseline anchors: 10-class random guessing
       is <b>90% error</b>, and the meaningful baseline is the <b>same architecture without dropout</b>
       (<b>1.60%</b> test error, Table 2) &mdash; dropout must beat that. On our small noisy 2-class task the proxy
       metric is the <b>train&ndash;test loss gap</b>, with $50\\%$ accuracy as the chance floor.</p>
       <p><b>2. Sanity checks before the full run.</b> These are unit tests on the <code>my_dropout</code>
       primitive, before any training. (a) <b>Eval mode is the exact identity:</b>
       <code>torch.allclose(my_dropout(x,p,training=False), x)</code> &mdash; dropout must be a no-op at test.
       (b) <b>Expected value is preserved:</b> average <code>my_dropout</code> over many masks on a constant input
       (e.g. all-$3$); the per-column mean should return $\\approx$ the input ($\\approx 3$), since
       $\\mathbb{E}[\\tilde y]=p\\cdot(y/p)+(1-p)\\cdot 0=y$ &mdash; this is the proof the $1/p$ scaling is right.
       (c) <b>Match PyTorch:</b> both checks above should also hold against <code>nn.Dropout</code>. (d) Reproduce
       the worked example: $y=[2,4,6,8]$, mask $[1,0,1,1]$, $p_{\\text{drop}}=0.5$ gives train output
       $[4,0,12,16]$ and empirical mean $\\approx[2,4,6,8]$.</p>
       <p><b>3. Expected range.</b> On MNIST a correct dropout net should reach <b>$\\approx 1.35\\%$</b> test error
       vs <b>1.60%</b> without, and <b>$\\approx 1.05\\%$</b> with dropout + max-norm (Table 2, quoted in
       <b>Results</b> &mdash; the paper's numbers). On our small run the qualitative target is a <b>smaller
       train&ndash;test gap</b> with dropout ($\\approx 0.28$) than without ($\\approx 0.33$), with training loss
       slightly <i>higher</i> under dropout (rule-of-thumb, our run). If dropout makes test error <i>worse</i>,
       something is off (wrong mode at test, or $p$ inverted).</p>
       <p><b>4. Ablation &mdash; prove the key idea earns its keep.</b> The key knob is the <b>drop rate</b>
       $p_{\\text{drop}}$. Set it to <b>$0$</b> (dropout off) and retrain on the same data, everything else fixed:
       the training loss should fall <i>lower</i> but the test loss end <i>higher</i> and the train&ndash;test gap
       <b>grow</b> &mdash; the overfitting dropout was suppressing returns. If turning dropout off does <b>not</b>
       widen the gap, the mask is not actually being applied (or the task is too easy to overfit).</p>
       <p><b>5. Failure signals.</b> <b>Noisy, seed-dependent test predictions:</b> you forgot
       <code>model.eval()</code> &mdash; dropout is still randomly zeroing units at inference. <b>Test accuracy
       drops and activations look too small:</b> you omitted the <code>/keep</code> scale, so expected activations
       shrank by a factor $p$ &mdash; the expected-value check (sanity #2b) will fail. <b>Train loss stays high /
       net underfits:</b> drop rate too aggressive (the paper uses $\\approx 0.5$ for hidden units, $\\approx 0.2$
       drop for inputs). <b>Drop rate inverted</b> (dropping $80\\%$ instead of $20\\%$): $p$ vs $p_{\\text{drop}}$
       confusion &mdash; the paper's $p$ is the <i>keep</i> probability, PyTorch's and this code's is the
       <i>drop</i> probability.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships dropout as <code>nn.Dropout(p)</code> in one line (where
       <code>p</code> is the <i>drop</i> probability). Here you <b>build it from scratch</b> with raw tensors:
       sample the Bernoulli mask, zero the dropped units, and apply the inverted-dropout $1/p$ scaling at train
       time; skip it in eval mode. The payoff is the verification against PyTorch &mdash; eval mode is an exact
       <code>torch.allclose</code> (both are the identity), and train mode matches statistically (both preserve
       the expected value over many masks). Then we train a small net with vs without dropout to reproduce the
       paper's qualitative claim that dropout reduces overfitting.</p>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting <code>model.eval()</code>.</b> If you leave the model in training mode at test time,
         dropout keeps randomly zeroing units &mdash; predictions become noisy and depend on the random seed.
         Always switch to eval mode for inference. (Conversely, MC&nbsp;Dropout deliberately keeps it on to
         sample uncertainty.)</li>
         <li><b>$p$ means different things.</b> In the paper $p$ is the <b>keep</b> probability; in PyTorch's
         <code>nn.Dropout(p)</code> and in this lesson's code, <code>p</code>/<code>p_drop</code> is the
         <b>drop</b> probability. Mixing them up inverts the rate (drop 80% instead of 20%).</li>
         <li><b>Dropping the $1/p$ scale.</b> Omit the <code>/keep</code> and the expected activation shrinks by
         a factor $p$, so the test network sees inputs that are too small &mdash; the expected-value check
         fails and accuracy drops.</li>
         <li><b>Too much dropout.</b> A very high drop rate removes so much capacity each step that the net
         underfits (training loss stays high). The paper notes $p$ around $0.5$ for hidden units and $\\sim 0.8$
         keep ($0.2$ drop) for inputs as common defaults &mdash; a hyperparameter to tune.</li>
         <li><b>Expecting dropout to always lower training loss.</b> It usually <i>raises</i> training loss (it
         is a regularizer); the win shows up as a smaller train&ndash;test gap, not a lower training number.</li>
       </ul>`,

    recall: [
      "Write the train-time dropout equations from memory: $\\mathbf{r} \\sim \\mathrm{Bernoulli}(p)$ and $\\tilde{\\mathbf{y}} = \\mathbf{r} * \\mathbf{y}$.",
      "Under inverted dropout, why do you divide kept units by $p$ at train time, and what does that let you skip at test time?",
      "State the paper's original test-time rule, $W_{test} = ?$, and what it corrects for.",
      "What is co-adaptation, and how does randomly dropping units prevent it?"
    ],

    practice: [
      {
        q: `Apply inverted dropout with drop probability 0.2 (so keep $p=0.8$, scale $1/p=1.25$) to the vector $[5,10,15]$, with a mask that keeps units 1 and 3 and drops unit 2. What is the train output, and what is the eval output?`,
        steps: [
          { do: `Mask $\\mathbf{r}=[1,0,1]$; multiply: $[5,0,15]$.`, why: `Dropped unit's output becomes 0.` },
          { do: `Scale kept units by $1/p=1.25$: $[5\\times1.25,\\,0,\\,15\\times1.25]=[6.25,\\,0,\\,18.75]$.`, why: `Inverted-dropout $1/p$ scaling keeps the expected value unchanged.` },
          { do: `Eval mode: return the input unchanged, $[5,10,15]$.`, why: `Dropout is skipped at test time.` }
        ],
        answer: `Train output $=[6.25,\\,0,\\,18.75]$; eval output $=[5,10,15]$. Check the expectation of unit 1: $0.8\\times(5\\times1.25)+0.2\\times 0 = 5$, the original value.`
      },
      {
        q: `Ablation: in the CODE's small net, set the dropout rate to 0 (turn dropout off) and train on the same noisy data. What do you expect to happen to the training loss and the gap between training and test loss?`,
        steps: [
          { do: `Set $p_{\\text{drop}}=0$ so no units are dropped and no scaling is applied.`, why: `This removes the regularizer; the net trains at full capacity.` },
          { do: `Train and watch both training and test loss.`, why: `Dropout's effect shows up in the gap, not the training number alone.` },
          { do: `Compare to the dropout run (the CODEVIZ chart).`, why: `Same data, same architecture &mdash; only dropout differs.` }
        ],
        answer: `Without dropout the net memorizes more: in our small run (CODEVIZ) the training loss falls lower (~0.23 vs ~0.27 with dropout), but the test loss ends higher (~0.56 vs ~0.54) and its curve rises after an early dip &mdash; the train&ndash;test gap grows from ~0.28 (dropout) to ~0.33 (no dropout). This reproduces the paper's qualitative claim that dropout reduces overfitting. These are our small-run numbers, not the paper's.`
      },
      {
        q: `The paper's original dropout keeps activations unscaled at train and scales weights by $p$ at test ($W_{test}=pW$). Inverted dropout scales by $1/p$ at train and does nothing at test. Show the two give the same expected activation in both modes.`,
        steps: [
          { do: `Original, train: kept unit outputs $y$ with prob $p$, else $0$, so $\\mathbb{E}=py$. Test: weight scaled by $p$, unit always on, so output contribution $\\propto p\\cdot y$.`, why: `Train and test expectations both equal $py$ &mdash; consistent, but train activations are $p$-shrunk.` },
          { do: `Inverted, train: kept unit outputs $y/p$ with prob $p$, else $0$, so $\\mathbb{E}=p\\cdot(y/p)=y$. Test: unit always on, weight unscaled, output $y$.`, why: `Train and test expectations both equal $y$.` }
        ],
        answer: `Both schemes make the expected train activation equal the test activation; they differ only by an overall constant factor ($py$ vs $y$) that the next layer's weights absorb during training. Inverted dropout is preferred because the test path is an ordinary unscaled network &mdash; nothing to remember to rescale at inference.`
      }
    ]
  });

  window.CODE["paper-dropout"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build dropout (inverted dropout) from scratch with raw tensors: sample a Bernoulli keep-mask, zero the ` +
      `dropped units, and scale kept units by 1/keep at TRAIN time; skip it entirely in EVAL mode. Then verify ` +
      `against nn.Dropout two ways — eval mode is an exact torch.allclose (both are the identity), and train ` +
      `mode preserves the expected value over many masks (both ours and PyTorch's). Recompute the [2,4,6,8] ` +
      `worked example, then drop it into a 2-layer net. Runs in Colab (torch is preinstalled).`,
    code: `import torch, torch.nn as nn

torch.manual_seed(0)

def my_dropout(x, p_drop, training):
    """Inverted dropout from scratch — Section 4 of Srivastava et al. (2014).
    p_drop = probability of DROPPING a unit (same convention as nn.Dropout(p))."""
    if not training or p_drop == 0.0:
        return x                                  # EVAL: identity, dropout skipped
    keep = 1.0 - p_drop                           # retention probability p
    mask = (torch.rand_like(x) < keep).float()    # r ~ Bernoulli(keep)
    return x * mask / keep                         # zero dropped + scale kept by 1/p

# ---- ORACLE 1: eval mode is exactly the identity, same as nn.Dropout in eval ----
p = 0.5
x = torch.randn(8, 16)
ref = nn.Dropout(p)
ref.eval()
ok_eval = torch.allclose(my_dropout(x, p, training=False), ref(x))
print("allclose eval (both identity):", ok_eval)          # expect True

# ---- ORACLE 2: train mode preserves the expected value (over many masks) ----
torch.manual_seed(1)
big = torch.full((100000, 8), 3.0)                 # constant input, easy to average
mine_mean = my_dropout(big, p, training=True).mean(0)   # ~ 3.0 for every column
ref.train()
ref_mean = ref(big).mean(0)                        # PyTorch also preserves E[.]
print("my train E[.]   ~", mine_mean[:4].round(decimals=3).tolist())   # ~ [3,3,3,3]
print("nn train E[.]   ~", ref_mean[:4].round(decimals=3).tolist())    # ~ [3,3,3,3]
print("expected-value preserved:",
      torch.allclose(mine_mean, torch.full((8,), 3.0), atol=0.05),
      "| matches nn.Dropout:",
      torch.allclose(mine_mean, ref_mean, atol=0.05))

# ---- recompute the worked example: y=[2,4,6,8], p_drop=0.5, mask keeps [1,0,1,1] ----
y = torch.tensor([2., 4., 6., 8.])
mask = torch.tensor([1., 0., 1., 1.])
keep = 0.5
print("worked-example train out:", (y * mask / keep).tolist())   # [4, 0, 12, 16]
# empirical mean over 200k masks ~ original y
torch.manual_seed(2)
samp = torch.stack([my_dropout(y, 0.5, True) for _ in range(200000)]).mean(0)
print("empirical E[train out]  :", samp.round(decimals=2).tolist())  # ~ [2,4,6,8]

# ---- drop it into a 2-layer net (use it like a layer) ----
class Net(nn.Module):
    def __init__(self, p_drop=0.5):
        super().__init__()
        self.fc1 = nn.Linear(16, 32); self.fc2 = nn.Linear(32, 2); self.p = p_drop
    def forward(self, z):
        h = torch.relu(self.fc1(z))
        h = my_dropout(h, self.p, self.training)   # dropout after the hidden activation
        return self.fc2(h)

net = Net(); net.train()
print("net output shape:", net(torch.randn(5, 16)).shape)  # torch.Size([5, 2])`
  };

  window.CODEVIZ["paper-dropout"] = {
    question: "Train the same small 2-hidden-layer classifier on the same small, noisy task — once with no dropout, once with dropout. Does dropout reduce overfitting (a smaller gap between training and test loss)?",
    charts: [
      {
        type: "line",
        title: "Train vs test loss over epochs: no dropout (memorizes) vs dropout (regularizes)",
        xlabel: "epoch",
        ylabel: "loss (cross-entropy)",
        series: [
          {
            name: "No dropout — train",
            color: "#ff7b72",
            points: [[0,0.675],[20,0.416],[40,0.330],[60,0.302],[80,0.293],[100,0.281],[120,0.273],[140,0.265],[160,0.260],[180,0.270],[200,0.251],[220,0.247],[240,0.251],[260,0.235],[280,0.233],[299,0.228]]
          },
          {
            name: "No dropout — test",
            color: "#ffa198",
            points: [[0,0.715],[20,0.509],[40,0.459],[60,0.470],[80,0.501],[100,0.504],[120,0.501],[140,0.522],[160,0.534],[180,0.513],[200,0.533],[220,0.570],[240,0.567],[260,0.550],[280,0.553],[299,0.560]]
          },
          {
            name: "Dropout 0.3 — train",
            color: "#1f6feb",
            points: [[0,0.673],[20,0.447],[40,0.362],[60,0.324],[80,0.308],[100,0.301],[120,0.303],[140,0.291],[160,0.279],[180,0.278],[200,0.284],[220,0.289],[240,0.276],[260,0.267],[280,0.266],[299,0.265]]
          },
          {
            name: "Dropout 0.3 — test",
            color: "#7ee787",
            points: [[0,0.713],[20,0.545],[40,0.480],[60,0.456],[80,0.468],[100,0.479],[120,0.500],[140,0.509],[160,0.498],[180,0.509],[200,0.526],[220,0.543],[240,0.544],[260,0.539],[280,0.540],[299,0.544]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 2), not the paper's reported numbers. Same 2-hidden-layer ReLU net (256 units/layer), same small noisy 2-class task (200 training points, a circular decision boundary with 10% label flips), same learning rate and 300 epochs of mini-batch SGD — only dropout differs. WITHOUT dropout the training loss keeps falling to ~0.23 while the TEST loss dips to ~0.46 early then climbs back to ~0.56: classic overfitting, a train–test gap of ~0.33. WITH dropout 0.3 the training loss stays higher (~0.27, the net memorizes less) and the test loss ends lower (~0.54) and flatter, shrinking the gap to ~0.28. Dropout trades a little training fit for better generalization — exactly the paper's qualitative claim.",
    code: `import numpy as np

def make(n, seed):
    r = np.random.default_rng(seed); X = r.normal(0, 1, (n, 2))
    rad = np.sqrt((X**2).sum(1)); ytrue = (rad > 1.3).astype(float)   # circular boundary
    flip = r.random(n) < 0.10; y = np.where(flip, 1 - ytrue, ytrue)   # 10% label noise
    return X.astype(np.float64), y

Xtr, ytr = make(200, 1); Xte, yte = make(4000, 2)
def sig(z): return 1 / (1 + np.exp(-np.clip(z, -30, 30)))

def ce(P, X, y):
    W1,b1,W2,b2,W3,b3 = P
    a1 = np.maximum(X@W1+b1, 0); a2 = np.maximum(a1@W2+b2, 0)
    o = np.clip(sig(a2@W3+b3).ravel(), 1e-7, 1-1e-7)
    return float(-np.mean(y*np.log(o) + (1-y)*np.log(1-o)))

def train(p_drop, epochs=300, lr=0.05, h=256, bs=32, seed=2):
    r = np.random.default_rng(seed)
    W1=r.normal(0,0.3,(2,h)); b1=np.zeros(h); W2=r.normal(0,0.1,(h,h)); b2=np.zeros(h)
    W3=r.normal(0,0.1,(h,1)); b3=np.zeros(1); keep=1-p_drop; n=len(ytr)
    for ep in range(epochs):
        idx = r.permutation(n)
        for s in range(0, n, bs):
            b=idx[s:s+bs]; Xb=Xtr[b]; yb=ytr[b]; m=len(b)
            z1=Xb@W1+b1; a1=np.maximum(z1,0)
            if p_drop>0: m1=(r.random(a1.shape)>p_drop).astype(float); a1d=a1*m1/keep   # inverted dropout
            else: a1d=a1
            z2=a1d@W2+b2; a2=np.maximum(z2,0)
            if p_drop>0: m2=(r.random(a2.shape)>p_drop).astype(float); a2d=a2*m2/keep
            else: a2d=a2
            out=np.clip(sig(a2d@W3+b3).ravel(),1e-7,1-1e-7)
            d3=(out-yb).reshape(-1,1)/m; dW3=a2d.T@d3; db3=d3.sum(0); da2=d3@W3.T
            if p_drop>0: da2=da2*m2/keep
            dz2=da2*(z2>0); dW2=a1d.T@dz2; db2_=dz2.sum(0); da1=dz2@W2.T
            if p_drop>0: da1=da1*m1/keep
            dz1=da1*(z1>0); dW1=Xb.T@dz1; db1_=dz1.sum(0)
            W1-=lr*dW1; b1-=lr*db1_; W2-=lr*dW2; b2-=lr*db2_; W3-=lr*dW3; b3-=lr*db3
    P=(W1,b1,W2,b2,W3,b3); return ce(P,Xtr,ytr), ce(P,Xte,yte)

for pd in [0.0, 0.3]:
    tr, te = train(pd)
    print(f"p_drop={pd}: train {tr:.3f}  test {te:.3f}  gap {te-tr:.3f}")
# p_drop=0.0: train 0.228  test 0.560  gap 0.332  (overfits)
# p_drop=0.3: train 0.265  test 0.544  gap 0.279  (less overfitting)`
  };
})();