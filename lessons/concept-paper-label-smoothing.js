/* Paper lesson — Label Smoothing, from "Rethinking the Inception Architecture for Computer Vision"
   (Szegedy, Vanhoucke, Ioffe, Shlens, Wojna; 2015). Grounded from arXiv:1512.00567, Section 7
   "Model Regularization via Label Smoothing": the smoothed target q'(k|x)=(1-eps)*delta_{k,y}+eps*u(k),
   the uniform case q'(k)=(1-eps)*delta_{k,y}+eps/K, the cross-entropy decomposition
   H(q',p)=(1-eps)H(q,p)+eps*H(u,p) with H(u,p)=D_KL(u||p)+H(u), and the ImageNet settings (K=1000,
   eps=0.1, ~0.2% absolute top-1/top-5 improvement).
   Track A (primitive): build label smoothing from scratch — replace the one-hot target with the smoothed
   target and compute cross-entropy by hand — and verify torch.allclose vs nn.CrossEntropyLoss(label_smoothing=eps).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-label-smoothing". */
(function () {
  window.LESSONS.push({
    id: "paper-label-smoothing",
    title: "Label Smoothing — Rethinking the Inception Architecture (2015)",
    tagline: "Stop training the network to be 100% certain: replace the hard one-hot target with a softened target that keeps a little probability mass on every wrong class, which curbs over-confident logits and improves calibration.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Christian Szegedy, Vincent Vanhoucke, Sergey Ioffe, Jonathon Shlens, Zbigniew Wojna",
      org: "Google Inc. / University College London",
      year: 2015,
      venue: "arXiv:1512.00567 (later CVPR 2016)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1512.00567",
      code: ""
    },

    conceptLink: null,
    partOf: [],
    prereqs: ["ml-softmax", "dl-cross-entropy", "met-calibration", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A classifier ends in a <b>softmax</b>: it turns the network's raw output scores
       (the <b>logits</b> &mdash; one un-normalized number per class) into a probability for each class that
       sums to 1. ("Logit" = the pre-softmax score; a bigger logit for a class means more belief in it.) We
       train it by <b>cross-entropy</b> against a <b>one-hot target</b>: the correct class gets probability
       $1$, every other class gets probability $0$. (One-hot = a vector of all zeros except a single $1$ at
       the true label's position.)</p>
       <p><b>What was broken.</b> Section 7 of the paper points out that pushing the predicted probability of
       the true class toward exactly $1$ is impossible to reach with a finite logit and is actively harmful.
       To make the true class's softmax output approach $1$, the network must drive its logit
       <i>infinitely far above</i> the others. That has two bad effects the paper names: (1) it encourages
       <b>over-fitting</b> &mdash; the model memorizes by inflating one logit rather than learning a robust
       boundary; and (2) it makes the model <b>over-confident</b>, encouraging the largest logit to become
       so much larger than the rest that the model "reduces the ability to adapt" and generalizes worse. In
       short: a one-hot target tells the network to be infinitely certain, which is neither achievable nor
       desirable.</p>`,

    contribution:
      `<p>The paper introduces <b>label-smoothing regularization (LSR)</b> (Section 7):</p>
       <ul>
         <li><b>A softened target.</b> Replace the one-hot target with a mixture: keep most of the mass on the
         true class but sprinkle a small fixed amount $\\epsilon$ ("epsilon", a small positive number like
         $0.1$) uniformly across <i>all</i> $K$ classes. So the true class gets $1-\\epsilon+\\epsilon/K$ and
         each other class gets $\\epsilon/K$ instead of $0$.</li>
         <li><b>A regularizer with one knob.</b> $\\epsilon$ is a single hyper-parameter (a value you choose,
         not learn). At $\\epsilon=0$ you recover ordinary one-hot training; larger $\\epsilon$ smooths more.
         It needs no extra parameters and costs essentially nothing.</li>
         <li><b>An interpretation.</b> They show the smoothed loss splits into the usual cross-entropy plus a
         term that penalizes the prediction for straying from the uniform distribution &mdash; i.e. it
         discourages the network from putting all its confidence on one class.</li>
       </ul>`,

    whyItMattered:
      `<p>Label smoothing became a standard, almost-free trick in the classification toolbox. It is built into
       <b>PyTorch</b> as <code>nn.CrossEntropyLoss(label_smoothing=...)</code> and is used when training
       large image models (Inception, ResNet recipes, EfficientNet) and Transformers &mdash; the original
       <b>Transformer</b> ("Attention Is All You Need") trained its translation model with label smoothing
       $\\epsilon=0.1$. Beyond a small accuracy bump, later work showed it produces <b>better-calibrated</b>
       models: the confidence the model reports lines up more closely with how often it is actually right,
       which matters whenever a downstream decision depends on the probability, not just the top class.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 7 ("Model Regularization via Label Smoothing")</b> &mdash; this is the whole idea, ~1
         page. It defines the ground-truth distribution $q(k|x)$, the smoothed distribution
         $q'(k|x)=(1-\\epsilon)\\delta_{k,y}+\\epsilon u(k)$, the uniform special case
         $q'(k)=(1-\\epsilon)\\delta_{k,y}+\\epsilon/K$, and the cross-entropy decomposition.</li>
         <li>The two sentences explaining <i>why</i> one-hot is bad: it is unreachable with finite logits and
         it encourages over-confidence / over-fitting.</li>
       </ul>
       <p><b>Skim:</b> the rest of the paper is about the Inception-v2/v3 architecture (factorized
       convolutions, grid-size reduction, the auxiliary classifier discussion). For this lesson you only need
       Section 7; the architecture is a separate topic. Note the headline number is small &mdash; "a
       consistent improvement of about 0.2% absolute" on ImageNet top-1 and top-5 &mdash; so do not expect a
       dramatic accuracy jump; the bigger story is calibration.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> Take $K=5$ classes and smoothing $\\epsilon=0.1$. The true class used
       to have target $1.0$ and the others $0.0$. After smoothing, what is the target on the true class &mdash;
       is it exactly $0.9$, or slightly more? And what does each of the four wrong classes get? Second guess:
       if you train two identical networks, one with $\\epsilon=0$ and one with $\\epsilon=0.1$, which one
       will end up reporting a <i>higher</i> probability for its predicted class on the training data &mdash;
       and is the more-confident one necessarily better? Write your guesses, then check the worked example
       and the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Build label smoothing from scratch in raw torch and verify it
       against PyTorch. Steps:</p>
       <ul>
         <li><code># TODO: onehot = F.one_hot(targets, K).float()</code> &mdash; the hard target, a $1$ at the
         true class.</li>
         <li><code># TODO: smooth = (1 - eps) * onehot + eps / K</code> &mdash; the smoothed target from
         Section 7 (uniform case): shrink the one-hot by $1-\\epsilon$, then add $\\epsilon/K$ to <i>every</i>
         entry.</li>
         <li><code># TODO: logp = F.log_softmax(logits, dim=1)</code> then
         <code># TODO: loss = -(smooth * logp).sum(1).mean()</code> &mdash; cross-entropy of the smoothed
         target against the predicted log-probabilities, averaged over the batch.</li>
       </ul>
       <p>The CODE cell below is the full reference, including
       <code>torch.allclose(my_loss, nn.CrossEntropyLoss(label_smoothing=eps)(logits, targets))</code> &mdash;
       that passing check proves your from-scratch smoothed loss IS PyTorch's built-in one.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start with how we normally train a classifier. For one training example with true label $y$, the
       <b>ground-truth distribution</b> over the $K$ classes is one-hot: $q(k)=1$ when $k=y$ and $q(k)=0$
       otherwise. The network outputs a predicted distribution $p(k)$ via softmax over its logits. We minimize
       the <b>cross-entropy</b> $H(q,p)=-\\sum_k q(k)\\log p(k)$, which with one-hot $q$ is just
       $-\\log p(y)$: push the predicted probability of the true class up.</p>
       <ol>
         <li><b>Spot the problem.</b> $-\\log p(y)$ is minimized only as $p(y)\\to1$, and $p(y)\\to1$ requires
         the true-class logit to go to $+\\infty$ relative to the others (softmax never quite reaches $1$ with
         finite scores). So the gradient keeps pushing the gap between the correct logit and the rest ever
         wider &mdash; the model grows over-confident and over-fits.</li>
         <li><b>Soften the target.</b> Mix the one-hot $q$ with a fixed reference distribution $u(k)$ (the
         paper uses the <b>uniform</b> distribution $u(k)=1/K$). The new target is
         $q'(k)=(1-\\epsilon)\\,q(k)+\\epsilon\\,u(k)$. Concretely, the true class gets
         $(1-\\epsilon)\\cdot1+\\epsilon/K = 1-\\epsilon+\\epsilon/K$ and every other class gets
         $0+\\epsilon/K=\\epsilon/K$.</li>
         <li><b>Train against the soft target.</b> Now minimize $H(q',p)$. Because the target itself assigns a
         little mass to every class, the loss is minimized at a <i>finite</i> set of logits &mdash; the model
         is rewarded for keeping the true logit only finitely above the others, not infinitely. That caps the
         confidence.</li>
       </ol>
       <p><b>Why this is "regularization."</b> The paper rewrites the smoothed cross-entropy as
       $H(q',p)=(1-\\epsilon)H(q,p)+\\epsilon H(u,p)$ &mdash; the ordinary loss plus an extra term that, since
       $H(u,p)=D_{\\mathrm{KL}}(u\\,\\|\\,p)+H(u)$, penalizes the prediction $p$ for drifting away from the
       uniform distribution $u$. ($D_{\\mathrm{KL}}$ is the <b>Kullback-Leibler divergence</b>, a non-negative
       measure of how far one distribution is from another; it is $0$ only when they match.) So label smoothing
       literally adds "stay a bit closer to uniform" as a soft constraint, which is exactly a pull against
       over-confidence.</p>`,

    architecture:
      `<p><b>Where it plugs in.</b> Label smoothing is <i>not</i> a layer or a block &mdash; it is a one-line
       change to the <b>training loss / target</b> at the classifier's <b>softmax cross-entropy head</b>.
       The network is untouched: it still ends in a linear layer producing $K$ logits
       $z=[z_1,\\dots,z_K]$, still applies softmax $p(k)=e^{z_k}/\\sum_i e^{z_i}$, and still computes
       cross-entropy against a target. The <i>only</i> thing that changes is which target vector you feed
       that cross-entropy.</p>
       <ol>
         <li><b>Forward pass &mdash; unchanged.</b> Inputs &rarr; (any backbone: convolutions, Transformer
         blocks, an MLP, whatever) &rarr; final linear head &rarr; logits $z\\in\\mathbb{R}^{K}$ &rarr;
         softmax &rarr; predicted distribution $p$. No new parameters, no new layers, no change to the
         model's shape.</li>
         <li><b>Target construction &mdash; the one modification.</b> Instead of the one-hot target
         $\\delta_{k,y}$, build the smoothed target $q'(k)=(1-\\epsilon)\\delta_{k,y}+\\epsilon/K$ (uniform
         reference $u(k)=1/K$). This is a cheap elementwise op on the label vector with no learnable
         parameters.</li>
         <li><b>Loss head.</b> Compute $H(q',p)=-\\sum_k q'(k)\\log p(k)$ &mdash; the same cross-entropy
         operator, just fed $q'$ in place of the one-hot. The backward gradient at the logits keeps its
         familiar form $\\partial\\ell/\\partial z_k = p(k)-q'(k)$; it now subtracts the smoothed target,
         which is what stops the true logit from being pushed infinitely high.</li>
       </ol>
       <p><b>Net effect on the pipeline.</b> Training: swap one-hot &rarr; smoothed target at the loss.
       <b>Inference: completely unchanged</b> &mdash; you deploy the same softmax classifier. Because it
       touches only the target distribution, the same line drops into <i>any</i> architecture that ends in
       a softmax cross-entropy (Inception, ResNet, Transformer), which is why it reads as a regularizer
       against over-confidence rather than a model-structure change. In PyTorch the entire "architecture
       delta" collapses to one argument: <code>nn.CrossEntropyLoss(label_smoothing=eps)</code>.</p>`,

    symbols: [
      { sym: "$K$", desc: "the number of classes (e.g. 1000 for ImageNet, 5 in our toy example)." },
      { sym: "$y$", desc: "the index of the true class for a given training example." },
      { sym: "$k$", desc: "a running index over the classes, $k=1,\\dots,K$." },
      { sym: "$q(k)$", desc: "the original ground-truth distribution over classes: one-hot, so $q(y)=1$ and $q(k)=0$ for $k\\neq y$." },
      { sym: "$\\delta_{k,y}$", desc: "the Kronecker delta: equals $1$ when $k=y$ and $0$ otherwise. It is just the one-hot indicator, so $q(k)=\\delta_{k,y}$." },
      { sym: "$p(k)$", desc: "the model's predicted probability for class $k$, the softmax of the logits." },
      { sym: "logit", desc: "the network's raw pre-softmax score for a class; a larger logit means more belief. Softmax exponentiates and normalizes the logits into probabilities." },
      { sym: "$\\epsilon$", desc: "epsilon: the smoothing strength, a small chosen constant (the paper uses $0.1$). At $\\epsilon=0$ you get ordinary one-hot training." },
      { sym: "$u(k)$", desc: "the fixed reference distribution mixed in. The paper uses the uniform distribution $u(k)=1/K$ (every class equally likely)." },
      { sym: "$q'(k)$", desc: "the smoothed target distribution: $q'(k)=(1-\\epsilon)q(k)+\\epsilon u(k)$. With uniform $u$, the true class gets $1-\\epsilon+\\epsilon/K$ and each other class gets $\\epsilon/K$." },
      { sym: "$H(q,p)$", desc: "cross-entropy of target $q$ against prediction $p$: $-\\sum_k q(k)\\log p(k)$. The standard classification loss." },
      { sym: "$D_{\\mathrm{KL}}(u\\,\\|\\,p)$", desc: "Kullback-Leibler divergence: a non-negative measure of how far prediction $p$ is from the reference $u$; zero only when $p=u$." },
      { sym: "$H(u)$", desc: "the entropy of the fixed uniform distribution $u$ — a constant (it does not depend on the model), so it does not affect the gradients." },
      { sym: "calibration", desc: "whether the probability a model reports matches how often it is actually correct at that confidence. A model that says '90% sure' should be right ~90% of the time." }
    ],

    formula:
      `<p><b>Smoothed target (Section 7), general and uniform special case:</b></p>
       $$q'(k\\,|\\,x)=(1-\\epsilon)\\,\\delta_{k,y}+\\epsilon\\,u(k)
         \\qquad\\Longrightarrow\\qquad
         q'(k)=(1-\\epsilon)\\,\\delta_{k,y}+\\frac{\\epsilon}{K}$$
       <p><b>The loss, and its regularizer decomposition (Section 7):</b></p>
       $$H(q',p)=-\\sum_{k=1}^{K} q'(k)\\log p(k)
         =(1-\\epsilon)\\,H(q,p)+\\epsilon\\,H(u,p),\\qquad
         H(u,p)=D_{\\mathrm{KL}}(u\\,\\|\\,p)+H(u)$$`,

    whatItDoes:
      `<p>The first equation builds the new training target: take the one-hot vector, scale it down by
       $1-\\epsilon$, then add $\\epsilon/K$ to every class. The true class ends up at $1-\\epsilon+\\epsilon/K$
       and the wrong classes at $\\epsilon/K$ each &mdash; a slightly fuzzy label instead of a hard $1$ vs $0$.
       The second equation is the loss computed against that soft target, and its rewrite shows <i>why</i> it
       regularizes: it equals the ordinary cross-entropy (weighted by $1-\\epsilon$) plus an $\\epsilon$-weighted
       term that, through the $D_{\\mathrm{KL}}(u\\,\\|\\,p)$ piece, pulls the prediction toward uniform. That pull
       is what prevents the model from driving one logit infinitely high &mdash; it caps confidence and improves
       calibration.</p>`,

    derivation:
      `<p>This lesson owns the math (<code>conceptLink</code> is null), so here is the full why. First, why
       one-hot is unreachable. With softmax, $p(y)=e^{z_y}/\\sum_k e^{z_k}$ where $z_k$ are the logits.
       $p(y)=1$ would require $e^{z_y}$ to dominate the sum completely, i.e. $z_y - z_k \\to +\\infty$ for all
       $k\\neq y$. Minimizing $-\\log p(y)$ therefore has no finite minimizer &mdash; the gradient never stops
       pushing the logit gap wider. That unbounded push is the over-confidence the paper warns about.</p>
       <p><b>Now derive the decomposition.</b> Plug the smoothed target into cross-entropy:</p>
       $$H(q',p)=-\\sum_k q'(k)\\log p(k)=-\\sum_k\\big[(1-\\epsilon)q(k)+\\epsilon u(k)\\big]\\log p(k).$$
       <p>Split the sum by linearity:</p>
       $$=-(1-\\epsilon)\\sum_k q(k)\\log p(k)\\;-\\;\\epsilon\\sum_k u(k)\\log p(k)
         =(1-\\epsilon)\\,H(q,p)+\\epsilon\\,H(u,p).$$
       <p>So the smoothed loss is a convex blend of the original loss $H(q,p)$ and a new term $H(u,p)$. Finally
       expand that new term. By definition of KL divergence,
       $D_{\\mathrm{KL}}(u\\,\\|\\,p)=\\sum_k u(k)\\log\\frac{u(k)}{p(k)}=\\sum_k u(k)\\log u(k)-\\sum_k u(k)\\log p(k)
       =-H(u)+H(u,p)$, hence $H(u,p)=D_{\\mathrm{KL}}(u\\,\\|\\,p)+H(u)$. Since $H(u)$ is a constant (it depends
       only on the fixed $u$, not on the model), minimizing the extra term is the same as minimizing
       $D_{\\mathrm{KL}}(u\\,\\|\\,p)$ &mdash; i.e. pulling the prediction $p$ toward the uniform $u$. That is the
       regularizer: "do your job, but stay a little humble (closer to uniform)."</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; $K=5$ classes, true label $y=2$ (0-indexed), smoothing $\\epsilon=0.1$,
       so the sprinkled mass per class is $\\epsilon/K=0.1/5=0.02$.</p>
       <p><b>1) Build the smoothed target</b> $q'(k)=(1-\\epsilon)\\delta_{k,y}+\\epsilon/K$:</p>
       <ul class="steps">
         <li><b>True class ($k=2$):</b> $(1-0.1)\\cdot1+0.02 = 0.9+0.02 = \\mathbf{0.92}$.</li>
         <li><b>Each other class ($k\\neq2$):</b> $(1-0.1)\\cdot0+0.02 = \\mathbf{0.02}$.</li>
         <li><b>Check it sums to 1:</b> $0.92 + 4(0.02) = 0.92 + 0.08 = 1.000$. (Note the true class is
         $0.92$, not $0.90$: it keeps its own share $\\epsilon/K$ of the sprinkled mass.)</li>
       </ul>
       <p><b>2) Compute the loss</b> for logits $z=[1,\\,0,\\,3,\\,0,\\,0]$. Softmax (denominator
       $e^1+e^0+e^3+e^0+e^0 = 2.718+1+20.086+1+1 = 25.804$) gives the per-class numbers in the table; the
       two losses are then weighted sums of $\\log p(k)$:</p>
       <table class="extable">
        <caption>Per-class breakdown for $z=[1,0,3,0,0]$, $y=2$, $\\epsilon=0.1$. The smoothed loss is $-\\sum_k q'(k)\\log p(k)$; plain CE only charges the $k{=}2$ row.</caption>
        <thead><tr><th>class $k$</th><th class="num">$z_k$</th><th class="num">$p(k)$</th><th class="num">$\\log p(k)$</th><th class="num">one-hot $q$</th><th class="num">smoothed $q'$</th><th class="num">$q'(k)\\log p(k)$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">0</td><td class="num">1</td><td class="num">0.1053</td><td class="num">&minus;2.251</td><td class="num">0</td><td class="num">0.02</td><td class="num">&minus;0.0450</td></tr>
         <tr><td class="row-h">1</td><td class="num">0</td><td class="num">0.0387</td><td class="num">&minus;3.251</td><td class="num">0</td><td class="num">0.02</td><td class="num">&minus;0.0650</td></tr>
         <tr><td class="row-h">2 (true)</td><td class="num">3</td><td class="num">0.7784</td><td class="num">&minus;0.251</td><td class="num">1</td><td class="num">0.92</td><td class="num">&minus;0.2309</td></tr>
         <tr><td class="row-h">3</td><td class="num">0</td><td class="num">0.0387</td><td class="num">&minus;3.251</td><td class="num">0</td><td class="num">0.02</td><td class="num">&minus;0.0650</td></tr>
         <tr><td class="row-h">4</td><td class="num">0</td><td class="num">0.0387</td><td class="num">&minus;3.251</td><td class="num">0</td><td class="num">0.02</td><td class="num">&minus;0.0650</td></tr>
        </tbody>
       </table>
       <ul class="steps">
         <li><b>Plain cross-entropy</b> ($\\epsilon=0$, one-hot): only the true-class row counts,
         $-\\log p(2)=-(-0.251)=\\mathbf{0.2505}$.</li>
         <li><b>Smoothed loss</b> ($\\epsilon=0.1$): negate the sum of the last column,
         $-(-0.0450-0.0650-0.2309-0.0650-0.0650) = -(-0.4709) = \\mathbf{0.4705}$.</li>
       </ul>
       <p>The smoothed loss ($0.4705$) is larger than the plain loss ($0.2505$) here because the soft target also
       charges the model for not putting mass on the other classes &mdash; that extra charge is the
       regularization pressure. The CODE cell recomputes this target and both losses and prints them; the
       smoothed value matches <code>nn.CrossEntropyLoss(label_smoothing=0.1)</code> exactly.</p>`,

    recipe:
      `<p><b>Label smoothing, as numbered steps</b> &mdash; for a batch of logits (shape $N\\times K$) and
       integer targets (length $N$):</p>
       <ol>
         <li>Build the one-hot target from the integer labels: $\\delta$, shape $N\\times K$.</li>
         <li>Smooth it: $q' = (1-\\epsilon)\\,\\delta + \\epsilon/K$ (the $\\epsilon/K$ is added to every entry).</li>
         <li>Get predicted log-probabilities: $\\log p = \\text{log\\_softmax}(\\text{logits})$.</li>
         <li>Cross-entropy of the soft target: $\\ell = -\\sum_k q'(k)\\log p(k)$ per example.</li>
         <li>Average over the batch: $\\mathcal{L} = \\text{mean}(\\ell)$.</li>
       </ol>
       <p>In PyTorch this whole recipe is one call: <code>nn.CrossEntropyLoss(label_smoothing=eps)</code>,
       which takes the raw logits and integer targets directly.</p>`,

    results:
      `<p>On ImageNet (ILSVRC 2012) the paper used $K=1000$ classes, uniform $u(k)=1/1000$, and $\\epsilon=0.1$,
       and reports (Section 7) "a consistent improvement of about <b>0.2% absolute</b> both for the top-1 error
       and the top-5 error." (Source: arXiv:1512.00567.) So the accuracy effect is modest; the lasting value is
       the regularization / calibration behavior. The CODEVIZ numbers below are our own small run, not the
       paper's reported results.</p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> Two metrics, because the paper's whole point is that accuracy barely moves while <i>calibration</i> does. (1) <b>Top-1 / top-5 error</b> on the classification benchmark &mdash; on ImageNet ($K=1000$, $\\epsilon=0.1$) the paper reports only "a consistent improvement of about <b>0.2% absolute</b>" on both top-1 and top-5 (Section 7). (2) <b>Calibration</b> &mdash; the gap between the model's mean reported confidence and its actual accuracy (expected calibration error). The no-skill baseline is the $\\epsilon=0$ one-hot model trained identically; smoothing must <i>not</i> hurt accuracy and should <i>shrink</i> the confidence-minus-accuracy gap. A pure no-information baseline errs at $1 - 1/K$ (random guessing).</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> First, the from-scratch loss must be <i>provably</i> PyTorch's: <code>torch.allclose(my_smoothed_ce(logits, y, eps), nn.CrossEntropyLoss(label_smoothing=eps)(logits, y), atol=1e-6)</code> must return <code>True</code> &mdash; this is the Track A payoff and the single most important gate. Check the smoothed target sums to exactly $1$ and that the true class is $1-\\epsilon+\\epsilon/K$ (not $1-\\epsilon$): for $K=5, \\epsilon=0.1, y=2$ the vector must be $[0.02, 0.02, 0.92, 0.02, 0.02]$. Reproduce the worked losses: plain CE $\\approx 0.2505$, smoothed $\\approx 0.4705$ on logits $[1,0,3,0,0]$. At $\\epsilon=0$ the smoothed loss must collapse <i>exactly</i> onto plain cross-entropy.</li>
        <li><b>Expected range.</b> The allclose check is binary &mdash; pass or you have a bug. For training effects, anchor to the paper: accuracy should move only $\\sim 0.2\\%$ (Section 7), so a <i>large</i> accuracy swing in either direction is "probably a bug," not the smoothing. In the lesson's toy run (our numbers, not the paper's): $\\epsilon=0$ gives acc $0.635$ / mean-conf $0.711$ / gap $+0.076$, while $\\epsilon=0.1$ gives acc $0.637$ / mean-conf $0.669$ / gap $+0.032$. Rule of thumb: expect mean confidence to <i>drop</i> by a few points and the gap to roughly halve, at essentially unchanged accuracy.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The knob <i>is</i> $\\epsilon$. Train the identical net (same seed, data, optimizer) at $\\epsilon=0$ vs $\\epsilon=0.1$ and confirm the $\\epsilon=0.1$ model reports <b>lower mean predicted-class confidence</b> and a <b>smaller confidence-minus-accuracy gap</b>; if confidence does <i>not</i> drop, the smoothed target never reached the loss (you smoothed the logits instead of the target, or $\\epsilon$ is silently $0$). Sweep $\\epsilon \\in \\{0, 0.05, 0.1, 0.2\\}$: confidence should fall monotonically while accuracy stays flat then degrades once over-smoothed.</li>
        <li><b>Failure signals &amp; what they mean.</b> <code>allclose</code> fails &rarr; you used $\\epsilon/(K-1)$ on the off-classes (true class wrong as $1-\\epsilon$), or computed <code>log(softmax(x))</code> instead of <code>log_softmax(x)</code> (numerically unstable, breaks the match). Accuracy <i>drops</i> noticeably &rarr; $\\epsilon$ too large (over-smoothing pulls everything toward uniform). Confidence unchanged between $\\epsilon=0$ and $\\epsilon=0.1$ &rarr; smoothing not applied to the target. Smoothed loss looks "worse" (higher number) than plain &rarr; expected, not a failure: the soft target charges for off-class mass, so compare like-for-like, never raw loss values across $\\epsilon$. The CODEVIZ gap chart is the diagnostic: if the $\\epsilon=0.1$ gap bar is not shorter than the $\\epsilon=0$ bar, the regularizer is not engaged.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as
       <code>nn.CrossEntropyLoss(label_smoothing=eps)</code> in one argument. Here you <b>build it from
       scratch</b> with raw tensors: construct the smoothed target $q'=(1-\\epsilon)\\,\\text{onehot}+\\epsilon/K$,
       take <code>log_softmax</code> of the logits, and compute $-\\sum_k q'(k)\\log p(k)$ averaged over the
       batch. The payoff is the <code>torch.allclose(my_loss, nn.CrossEntropyLoss(label_smoothing=eps)(...))</code>
       check &mdash; if it passes, your from-scratch smoothed loss is provably identical to PyTorch's built-in.
       Autograd differentiates your formula for free; you only write the forward computation. The
       qualitative payoff (the ablation) is showing that $\\epsilon=0.1$ produces <i>less</i> over-confident
       logits and better calibration than $\\epsilon=0$.</p>`,

    pitfalls:
      `<ul>
         <li><b>The true class is $1-\\epsilon+\\epsilon/K$, not $1-\\epsilon$.</b> A common off-by-a-bit error
         is to set the true class to $0.9$ and the rest to $\\epsilon/(K-1)$. The paper's uniform scheme adds
         $\\epsilon/K$ to <i>every</i> class including the true one, so the true class is $0.92$ (for $K=5,
         \\epsilon=0.1$) and the soft target sums to exactly $1$.</li>
         <li><b>Smooth the target, not the logits.</b> Label smoothing changes the <i>target distribution</i>;
         the softmax over logits is unchanged. Do not also soften the predictions.</li>
         <li><b>Use <code>log_softmax</code>, not <code>log(softmax)</code>.</b> Computing
         <code>log(softmax(x))</code> separately is numerically unstable; <code>F.log_softmax</code> is the
         stable fused version PyTorch uses internally, so it is also what makes the allclose pass.</li>
         <li><b>Smoothing raises the reported loss.</b> A smoothed loss is numerically larger than plain
         cross-entropy even when the prediction is good (it charges for the off-class mass). Do not read the
         higher number as "worse model" &mdash; compare like-for-like.</li>
         <li><b>$\\epsilon$ is a hyper-parameter.</b> Too large over-smooths (everything drifts toward uniform,
         hurting accuracy); $0.1$ is the paper's value and a common default. It is not learned.</li>
       </ul>`,

    recall: [
      "State the smoothed target from memory: $q'(k)=(1-\\epsilon)\\delta_{k,y}+\\epsilon/K$.",
      "For $K=5$, $\\epsilon=0.1$, true label given: write the full target vector and check it sums to 1.",
      "Define $\\delta_{k,y}$ and $u(k)$ in words.",
      "Write the decomposition $H(q',p)=(1-\\epsilon)H(q,p)+\\epsilon H(u,p)$ and say which term is the regularizer.",
      "Explain in one sentence why a one-hot target pushes logits to be over-confident.",
      "What does label smoothing tend to improve besides accuracy? (calibration)"
    ],

    practice: [
      {
        q: `With $K=4$ and $\\epsilon=0.2$, true label $y=0$, write the smoothed target vector and verify it sums to 1.`,
        steps: [
          { do: `Compute $\\epsilon/K = 0.2/4 = 0.05$.`, why: `Every class — including the true one — gets this added.` },
          { do: `True class: $(1-0.2)\\cdot1 + 0.05 = 0.8 + 0.05 = 0.85$.`, why: `Scale the one-hot by $1-\\epsilon$, then add $\\epsilon/K$.` },
          { do: `Each other class: $0 + 0.05 = 0.05$.`, why: `One-hot is 0 there, so only the sprinkled $\\epsilon/K$ remains.` }
        ],
        answer: `Target $=[0.85,\\,0.05,\\,0.05,\\,0.05]$, which sums to $0.85+3(0.05)=1.0$. Note the true class is $0.85$, not $0.80$.`
      },
      {
        q: `Why does the smoothed cross-entropy have a finite minimizer in the logits, while plain one-hot cross-entropy does not?`,
        steps: [
          { do: `Plain: minimizing $-\\log p(y)$ needs $p(y)\\to1$, which needs $z_y - z_k \\to +\\infty$.`, why: `Softmax reaches 1 only in the infinite-logit limit.` },
          { do: `Smoothed: the target assigns $\\epsilon/K\\gt0$ to every class, so the loss is minimized when $p$ matches $q'$, i.e. $p(y)=1-\\epsilon+\\epsilon/K\\lt1$.`, why: `Matching a soft target requires only finite logits.` },
          { do: `Therefore the gradient stops pushing once $p\\approx q'$.`, why: `There is an attainable optimum.` }
        ],
        answer: `One-hot demands $p(y)=1$, attainable only at infinite logit gaps, so training keeps inflating the true logit — over-confidence. The smoothed target's optimum is $p(y)=1-\\epsilon+\\epsilon/K\\lt1$, a finite logit configuration, so the model settles at bounded confidence. That bounded optimum is exactly the regularizing effect.`
      },
      {
        q: `Ablation: train the same tiny classifier twice — once with $\\epsilon=0$ (one-hot) and once with $\\epsilon=0.1$ — and compare (a) the mean confidence of the predicted class and (b) calibration on held-out data. What changes, and what does not?`,
        steps: [
          { do: `Fix seed, data, architecture and optimizer; vary only the loss's <code>label_smoothing</code> between 0 and 0.1.`, why: `Isolate smoothing as the single variable.` },
          { do: `After training, on a test set record the mean top-class probability (confidence) and the expected calibration error (gap between confidence and accuracy).`, why: `Over-confidence and calibration are the claimed effects.` },
          { do: `Compare: the $\\epsilon=0.1$ model should report lower, less extreme confidence and smaller calibration error, at similar accuracy.`, why: `The regularizer caps confidence without necessarily changing the top-1 decision.` }
        ],
        answer: `In our small run (see CODEVIZ — our numbers, not the paper's) the $\\epsilon=0$ model is over-confident — mean predicted-class probability $0.711$ while it is right only $63.5\\%$ of the time, a $+0.076$ gap — while $\\epsilon=0.1$ pulls mean confidence down to $0.669$, much closer to its $63.7\\%$ accuracy (gap $+0.032$). Test accuracy is essentially unchanged. What changed: confidence/calibration. What did not: the architecture, the data, and (largely) the top-1 accuracy — mirroring the paper's small ~0.2% accuracy effect but visible calibration benefit.`
      }
    ]
  });

  window.CODE["paper-label-smoothing"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build label smoothing from scratch with raw torch: construct the smoothed target ` +
      `q' = (1-eps)*onehot + eps/K, take log_softmax of the logits, and compute -(q'*logp).sum(1).mean(). ` +
      `Prove it IS PyTorch's by torch.allclose(my_loss, nn.CrossEntropyLoss(label_smoothing=eps)(logits, y)). ` +
      `Recompute the worked example (K=5, y=2, eps=0.1; plain loss 0.2505, smoothed 0.4705), then run the ` +
      `eps=0 vs eps=0.1 ablation showing smoothing curbs over-confident logits and improves calibration. ` +
      `Runs in Colab (torch is preinstalled).`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# ---- Label smoothing from scratch (Section 7 of Szegedy et al., 2015, uniform case) ----
def my_smoothed_ce(logits, targets, eps):
    K = logits.size(1)
    onehot = F.one_hot(targets, K).float()          # delta_{k,y}
    smooth = (1.0 - eps) * onehot + eps / K          # q'(k) = (1-eps)*onehot + eps/K
    logp = F.log_softmax(logits, dim=1)              # stable log-softmax
    return -(smooth * logp).sum(dim=1).mean()        # H(q', p), averaged over batch

# ---- THE ORACLE: must equal nn.CrossEntropyLoss(label_smoothing=eps) ----
N, K, eps = 8, 5, 0.1
logits = torch.randn(N, K)
targets = torch.randint(0, K, (N,))

mine = my_smoothed_ce(logits, targets, eps)
torchs = nn.CrossEntropyLoss(label_smoothing=eps)(logits, targets)
print("mine   :", mine.item())
print("torch  :", torchs.item())
print("allclose(mine, nn.CrossEntropyLoss(label_smoothing)):",
      torch.allclose(mine, torchs, atol=1e-6))       # expect True

# ---- recompute the worked example: K=5, true label y=2, eps=0.1 ----
z = torch.tensor([[1., 0., 3., 0., 0.]])
y = torch.tensor([2])
onehot = F.one_hot(y, 5).float()
qprime = (1 - 0.1) * onehot + 0.1 / 5
print("smoothed target:", qprime.tolist())           # [[0.02,0.02,0.92,0.02,0.02]]
print("plain CE  (eps=0)   :", F.cross_entropy(z, y).item())                # ~0.2505
print("smoothed  (eps=0.1) :", my_smoothed_ce(z, y, 0.1).item())            # ~0.4705

# ---- ABLATION: eps=0 vs eps=0.1 -> confidence & calibration on a toy problem ----
# 3-class toy data: three OVERLAPPING Gaussian blobs (noise=1.6 makes the task hard
# enough that confidence and accuracy can diverge -> over-confidence is visible).
torch.manual_seed(1)
def make_data(n):
    centers = torch.tensor([[1.2,1.2],[-1.2,1.2],[0.,-1.2]])
    ys = torch.randint(0, 3, (n,))
    X = centers[ys] + 1.6 * torch.randn(n, 2)
    return X, ys
Xtr, ytr = make_data(600)
Xte, yte = make_data(600)

def train(eps, steps=600):
    torch.manual_seed(2)                              # identical init for both
    net = nn.Sequential(nn.Linear(2,64), nn.ReLU(), nn.Linear(64,3))
    opt = torch.optim.Adam(net.parameters(), lr=0.03)
    lossf = nn.CrossEntropyLoss(label_smoothing=eps)
    for _ in range(steps):
        opt.zero_grad(); lossf(net(Xtr), ytr).backward(); opt.step()
    with torch.no_grad():
        p = F.softmax(net(Xte), dim=1)
        conf, pred = p.max(dim=1)
        acc = (pred == yte).float().mean().item()
        mean_conf = conf.mean().item()
        ece = (mean_conf - acc)                       # simple confidence-minus-accuracy gap
    return acc, mean_conf, ece

for e in [0.0, 0.1]:
    acc, mc, ece = train(e)
    print(f"eps={e}: test acc {acc:.3f}, mean confidence {mc:.3f}, conf-acc gap {ece:+.3f}")
# expect (similar accuracy, but different confidence):
#   eps=0.0: acc ~0.635, mean conf ~0.711, gap +0.076  (over-confident)
#   eps=0.1: acc ~0.637, mean conf ~0.669, gap +0.032  (better calibrated)`
  };

  window.CODEVIZ["paper-label-smoothing"] = {
    question: "Does label smoothing (eps=0.1) curb over-confident logits and improve calibration versus one-hot (eps=0), at similar accuracy — on a toy 3-class problem with everything else held fixed?",
    charts: [
      {
        type: "bar",
        title: "Test accuracy vs mean predicted-class confidence (our run, 3-class toy)",
        xlabel: "training loss",
        ylabel: "value (0-1)",
        series: [
          { name: "test accuracy", color: "#79c0ff", points: [["eps=0", 0.635], ["eps=0.1", 0.637]] },
          { name: "mean confidence", color: "#ff7b72", points: [["eps=0", 0.711], ["eps=0.1", 0.669]] }
        ]
      },
      {
        type: "bar",
        title: "Over-confidence gap (mean confidence minus accuracy) — smaller is better-calibrated",
        xlabel: "training loss",
        ylabel: "confidence - accuracy",
        series: [
          { name: "conf - acc gap", color: "#d2a8ff", points: [["eps=0", 0.076], ["eps=0.1", 0.032]] }
        ]
      }
    ],
    caption: "Our small-scale run (torch 2.8, seed fixed), not the paper's reported numbers. The two losses reach essentially the SAME test accuracy (0.635 vs 0.637) — mirroring the paper's small ~0.2% absolute accuracy effect on ImageNet. But the one-hot model (eps=0) is over-confident: it reports a mean predicted-class probability of 0.711 while being right only 63.5% of the time, a +0.076 confidence-minus-accuracy gap. Label smoothing (eps=0.1) pulls mean confidence down to 0.669, much closer to the true 63.7% accuracy (gap shrinks to +0.032) — exactly the over-confidence/calibration effect Section 7 predicts. The blobs overlap (noise 1.6), so the task is genuinely hard, which is what lets confidence and accuracy diverge. Numbers vary slightly by torch version; the qualitative result (eps=0 over-confident, eps=0.1 better calibrated at equal accuracy) is the point.",
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(1)
def make_data(n):                                     # overlapping blobs -> hard task
    centers = torch.tensor([[1.2,1.2],[-1.2,1.2],[0.,-1.2]])
    ys = torch.randint(0, 3, (n,))
    return centers[ys] + 1.6*torch.randn(n,2), ys
Xtr, ytr = make_data(600); Xte, yte = make_data(600)

def train(eps, steps=600):
    torch.manual_seed(2)                              # identical init
    net = nn.Sequential(nn.Linear(2,64), nn.ReLU(), nn.Linear(64,3))
    opt = torch.optim.Adam(net.parameters(), lr=0.03)
    lossf = nn.CrossEntropyLoss(label_smoothing=eps)
    for _ in range(steps):
        opt.zero_grad(); lossf(net(Xtr), ytr).backward(); opt.step()
    with torch.no_grad():
        conf, pred = F.softmax(net(Xte),1).max(1)
        acc = (pred==yte).float().mean().item()
        return round(acc,3), round(conf.mean().item(),3), round(conf.mean().item()-acc,3)

for e in [0.0, 0.1]:
    acc, mc, gap = train(e)
    print(f"eps={e}: acc {acc}, mean_conf {mc}, conf-acc gap {gap:+}")
# eps=0.0: acc 0.635, mean_conf 0.711, gap +0.076   (over-confident)
# eps=0.1: acc 0.637, mean_conf 0.669, gap +0.032   (better calibrated)`
  };
})();
