/* Paper lesson — mixup: Beyond Empirical Risk Minimization (Zhang, Cisse, Dauphin, Lopez-Paz, 2017).
   Grounded from arXiv:1710.09412 (ar5iv HTML mirror). Section 2 "From Empirical Risk Minimization to mixup":
   the empirical risk is eq (1); mixup builds virtual examples x~ = lam*x_i + (1-lam)*x_j,
   y~ = lam*y_i + (1-lam)*y_j with lam ~ Beta(alpha,alpha). Vicinal Risk Minimization (VRM) framing.
   Section 3: CIFAR-10 / ImageNet error rates, alpha in [0.1,0.4], corrupted-label + adversarial robustness.
   Track A (primitive): implement mixup from scratch with raw tensors, train a small classifier with vs
   without mixup, show better generalization + smaller gen-gap + less overconfidence + alpha ablation.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-mixup". */
(function () {
  window.LESSONS.push({
    id: "paper-mixup",
    title: "mixup — mixup: Beyond Empirical Risk Minimization (2017)",
    tagline: "Train on blended pairs of examples: feed the network a weighted average of two inputs and the same weighted average of their labels, and it generalizes better and behaves more smoothly between classes.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Hongyi Zhang, Moustapha Cisse, Yann N. Dauphin, David Lopez-Paz",
      org: "MIT and Facebook AI Research (FAIR)",
      year: 2017,
      venue: "arXiv:1710.09412 (later ICLR 2018)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1710.09412",
      code: "https://github.com/facebookresearch/mixup-cifar10"
    },

    conceptLink: null,
    partOf: [],
    prereqs: ["dl-data-augmentation", "ml-regularization", "dl-cross-entropy", "ml-bias-variance", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> The standard way to train a classifier is <b>empirical risk minimization (ERM)</b>:
       collect a finite training set of $n$ labeled examples, and adjust the model so that its average loss
       <i>on exactly those $n$ points</i> is as small as possible. ("Risk" here just means expected loss;
       "empirical" means measured on the sample you have, not the true population.) A <b>loss</b> is a number
       saying how wrong a prediction is.</p>
       <p><b>What was broken.</b> Driving the loss to near zero on the training points does not guarantee good
       behavior <i>between</i> them. The paper's introduction flags two well-known failures of ERM-trained deep
       networks: (1) they <b>memorize</b> rather than generalize &mdash; a large network can fit even randomly
       <i>corrupted</i> labels, so low training loss says little about test accuracy; and (2) they are
       <b>fragile</b> &mdash; tiny, carefully chosen input perturbations (adversarial examples) flip predictions,
       because the model is confident and jagged right up to the training points but says nothing principled
       about the space in between. The model only "knows" the exact points it saw; the gaps between classes are
       left to chance.</p>`,

    contribution:
      `<p>The paper introduces <b>mixup</b>, a one-paragraph training rule that regularizes the model to behave
       <i>linearly between examples</i> (Section 2):</p>
       <ul>
         <li><b>Train on convex combinations of pairs.</b> Instead of feeding the network a real example, feed it
         a weighted blend of two random training examples &mdash; and crucially, give it the <i>same weighted
         blend of their labels</i> as the target. A 70%/30% mix of a cat image and a dog image is labeled
         "0.7 cat, 0.3 dog."</li>
         <li><b>A data-agnostic vicinal distribution.</b> The paper frames this as <b>Vicinal Risk Minimization
         (VRM)</b>: rather than only the $n$ points, train on a cloud of virtual points in their
         <i>vicinity</i>. mixup's vicinity is "draw two points and interpolate," which needs no domain knowledge
         &mdash; it works for images, text, speech, tabular data.</li>
         <li><b>Essentially free.</b> It adds a few lines of code and no measurable compute, yet improves
         generalization, robustness to corrupted labels, and robustness to adversarial examples (Section 3).</li>
       </ul>`,

    whyItMattered:
      `<p>mixup became a standard, almost-default augmentation for training image classifiers and is a routine
       ingredient in strong training recipes (it is built into libraries such as <code>timm</code> and the
       torchvision transforms). It launched a family of "mix" augmentations &mdash; <b>CutMix</b> (paste a patch
       of one image onto another), <b>Manifold Mixup</b> (interpolate hidden activations), and more &mdash; and is
       widely used in semi-supervised learning. Its core message, that a model should interpolate sensibly
       between training examples rather than memorize them, reframed how people think about regularization.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 2 ("From Empirical Risk Minimization to mixup")</b> &mdash; the whole method. The ERM
         empirical-risk definition is eq (1); the mixup construction $\\tilde{x}=\\lambda x_i+(1-\\lambda)x_j$,
         $\\tilde{y}=\\lambda y_i+(1-\\lambda)y_j$ with $\\lambda\\sim\\mathrm{Beta}(\\alpha,\\alpha)$ follows, with
         the VRM framing.</li>
         <li><b>Figure 1</b> &mdash; (a) the few-line PyTorch snippet; (b) a 2D illustration that mixup makes the
         decision boundary between two classes smoother and the confidence transition more gradual.</li>
         <li><b>Section 3.1 / 3.2 (Tables/Figures)</b> &mdash; the CIFAR-10 and ImageNet error improvements, and
         the recommendation that $\\alpha\\in[0.1,0.4]$.</li>
       </ul>
       <p><b>Skim:</b> Sections 3.4 and 3.5 (robustness to <i>corrupted labels</i> and to <i>adversarial
       examples</i>) for the qualitative result that mixup helps both. You do not need every table &mdash; the
       takeaways are "smaller test error, smaller generalization gap, more robust," not a single headline
       number.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will train the <i>same</i> tiny classifier twice on a small toy
       2-class problem &mdash; once with plain ERM, once with mixup &mdash; and compare on a large held-out test
       set. Both will reach 100% <i>training</i> accuracy. Will mixup's <i>test</i> accuracy be higher, equal, or
       lower? When you read off each model's mean predicted confidence on test points, will mixup be <i>more</i>
       or <i>less</i> confident than ERM? And will mixup's gap between train and test accuracy be larger or
       smaller? Write your guesses, then check the worked example and CODEVIZ.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write the mixup batch transform from scratch in raw torch. Given a
       batch of inputs <code>x</code> and one-hot labels <code>y</code>:</p>
       <ul>
         <li><code># TODO: lam = numpy.random.beta(alpha, alpha)</code> &mdash; one mixing weight in $[0,1]$ drawn
         from the Beta distribution.</li>
         <li><code># TODO: idx = torch.randperm(batch_size)</code> &mdash; a shuffled index to pair each example
         with another from the same batch.</li>
         <li><code># TODO: x_mix = lam*x + (1-lam)*x[idx]</code> &mdash; blend the inputs.</li>
         <li><code># TODO: y_mix = lam*y + (1-lam)*y[idx]</code> &mdash; blend the one-hot labels the same way.</li>
       </ul>
       <p>Then train with <code>cross_entropy</code> against the <i>soft</i> blended target <code>y_mix</code>.
       The CODE cell below is the full reference, including the with-vs-without comparison and the $\\alpha$
       ablation &mdash; that is what proves mixup is doing the work, not luck.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>mixup changes <i>what you train on</i>, not the network. Start from ordinary ERM: you have $n$ examples
       $(x_i,y_i)$, where each label $y_i$ is a <b>one-hot vector</b> (all zeros except a 1 in the true class's
       slot), and you minimize the average loss on those $n$ points. mixup replaces each training point with a
       freshly mixed one:</p>
       <ol>
         <li><b>Pick two examples at random.</b> Take $(x_i,y_i)$ and $(x_j,y_j)$ &mdash; in practice, pair each
         example in a mini-batch with another example from the same batch via a random shuffle.</li>
         <li><b>Draw a mixing weight.</b> Sample $\\lambda$ from a $\\mathrm{Beta}(\\alpha,\\alpha)$ distribution
         &mdash; a distribution on the interval $[0,1]$. The single knob $\\alpha$ controls its shape: small
         $\\alpha$ (like 0.2) pushes $\\lambda$ toward 0 or 1, so most mixes are <i>mild</i> (mostly one image);
         $\\alpha=1$ makes $\\lambda$ uniform on $[0,1]$; large $\\alpha$ concentrates $\\lambda$ near $0.5$, so
         mixes are <i>aggressive</i> (half-and-half blends).</li>
         <li><b>Blend the inputs.</b> Form $\\tilde{x}=\\lambda x_i+(1-\\lambda)x_j$ &mdash; a pixel-by-pixel
         weighted average of the two inputs (a "convex combination": weights $\\lambda$ and $1-\\lambda$ are
         non-negative and sum to 1).</li>
         <li><b>Blend the labels the SAME way.</b> Form $\\tilde{y}=\\lambda y_i+(1-\\lambda)y_j$ &mdash; a soft
         target like $[0.7, 0.3]$ instead of a hard one-hot. This is the key idea: the supervision admits "this
         is part one class, part the other."</li>
         <li><b>Train normally on $(\\tilde{x},\\tilde{y})$.</b> Use the same loss (cross-entropy against the soft
         target) and optimizer. New mixes are drawn every batch.</li>
       </ol>
       <p><b>Why this helps (the paper's framing).</b> Asking the model to predict $\\lambda y_i+(1-\\lambda)y_j$
       on the blended input $\\lambda x_i+(1-\\lambda)x_j$ encourages it to behave <b>linearly between training
       examples</b>: as you slide from example $i$ to example $j$, the model's confidence should slide too,
       instead of jumping. That is a smoothness/regularization prior. It is an instance of <b>Vicinal Risk
       Minimization</b>: train not just on the $n$ points but on a cloud of interpolated points around them, so
       the model is forced to give sane answers in the gaps it never literally saw.</p>`,

    architecture:
      `<p>mixup adds <b>no layers and no parameters</b> &mdash; it is a one-block data transform inserted between
       the data loader and the loss. The network $f$ is whatever classifier you already have (the paper uses
       PreAct ResNet-18, WideResNet-28-10, ResNet-50/101); mixup only changes the $(\\tilde{x},\\tilde{y})$ pair
       fed in. The per-batch data flow (Figure 1a):</p>
       <ol>
         <li><b>Input.</b> A mini-batch of $B$ real inputs $X$ (e.g. shape $B\\times C\\times H\\times W$ for images)
         and one-hot labels $Y$ (shape $B\\times K$ for $K$ classes).</li>
         <li><b>Sample one weight.</b> Draw a single scalar $\\lambda\\sim\\mathrm{Beta}(\\alpha,\\alpha)$ for the
         whole batch (the reference recipe). $\\alpha$ is the only added hyperparameter.</li>
         <li><b>Pair the batch with itself.</b> Generate a random permutation of the $B$ indices to get partner
         inputs $X'$ and partner labels $Y'$ &mdash; no second data loader needed.</li>
         <li><b>Blend (the mixup block).</b> $\\tilde{X}=\\lambda X+(1-\\lambda)X'$ and
         $\\tilde{Y}=\\lambda Y+(1-\\lambda)Y'$ &mdash; the same $\\lambda$ on inputs and labels, computed
         elementwise; output shapes are identical to the inputs.</li>
         <li><b>Forward + loss.</b> $\\tilde{X}\\to f\\to$ logits; soft-target cross-entropy
         $-\\sum_k \\tilde{Y}_k\\log\\mathrm{softmax}(f(\\tilde{X}))_k$ against the blended label.</li>
         <li><b>Backward + step.</b> Standard backprop and optimizer step through $f$ unchanged. A fresh $\\lambda$
         and a fresh permutation are drawn every batch.</li>
       </ol>
       <p><b>Train vs. test asymmetry.</b> The mixup block is active <i>only at training time</i>; at evaluation
       the network runs on real, un-mixed inputs with the ordinary forward pass. Net cost over ERM: one Beta draw,
       one permutation, and two elementwise blends per batch &mdash; negligible compute, no extra weights.</p>`,

    symbols: [
      { sym: "$(x_i,y_i)$", desc: "a training example: input $x_i$ (e.g. an image as a vector of pixels) and its label $y_i$ as a one-hot vector (all zeros, a single 1 in the true class slot)." },
      { sym: "$n$", desc: "the number of training examples." },
      { sym: "$\\tilde{x}$", desc: "x-tilde: a virtual (mixed) input — the weighted blend $\\lambda x_i+(1-\\lambda)x_j$ of two real inputs." },
      { sym: "$\\tilde{y}$", desc: "y-tilde: the matching virtual (soft) label — the same weighted blend $\\lambda y_i+(1-\\lambda)y_j$ of the two one-hot labels. Its entries are non-negative and sum to 1." },
      { sym: "$\\lambda$", desc: "lambda: the mixing weight, a number in $[0,1]$. $\\lambda=1$ gives back example $i$ exactly; $\\lambda=0$ gives example $j$; $\\lambda=0.5$ is a half-and-half blend." },
      { sym: "$\\mathrm{Beta}(\\alpha,\\alpha)$", desc: "the Beta distribution on $[0,1]$ with both shape parameters equal to $\\alpha$. It is the source of the random $\\lambda$. Symmetric about $0.5$ because the two parameters are equal." },
      { sym: "$\\alpha$", desc: "alpha: the single mixup hyperparameter ($\\alpha\\gt0$). Small $\\alpha$ → $\\lambda$ near 0 or 1 (mild mixing); $\\alpha=1$ → $\\lambda$ uniform; large $\\alpha$ → $\\lambda$ near 0.5 (strong mixing). The paper recommends $\\alpha\\in[0.1,0.4]$." },
      { sym: "$f$", desc: "the model / classifier being trained; $f(x)$ is its prediction on input $x$." },
      { sym: "$\\ell(\\cdot,\\cdot)$", desc: "the per-example loss (e.g. cross-entropy): how wrong a prediction is versus the target." },
      { sym: "$P(x,y)$", desc: "the true (unknown) joint data distribution that examples are really drawn from." },
      { sym: "$R(f)$", desc: "the expected (true) risk $\\int \\ell(f(x),y)\\,\\mathrm{d}P(x,y)$ — average loss over the true distribution $P$; what we actually want small but cannot compute." },
      { sym: "$\\delta(\\cdot)$", desc: "the Dirac delta: a unit spike of probability mass placed exactly at one point and zero everywhere else." },
      { sym: "$P_\\delta(x,y)$", desc: "the empirical distribution: $\\frac1n\\sum_i\\delta(x=x_i,y=y_i)$ — a spike of mass $1/n$ on each training point, nothing in between." },
      { sym: "$R_\\delta(f)$", desc: "the empirical risk $\\frac1n\\sum_i \\ell(f(x_i),y_i)$ that ERM minimizes (paper eq (1)) — $R(f)$ evaluated against $P_\\delta$." },
      { sym: "$\\nu(\\cdot\\mid x_i,y_i)$", desc: "a vicinity distribution: probability spread in a small region around training point $(x_i,y_i)$, replacing its Dirac spike." },
      { sym: "$P_\\nu(\\tilde{x},\\tilde{y})$", desc: "the VRM smoothed data distribution $\\frac1n\\sum_i\\nu(\\tilde{x},\\tilde{y}\\mid x_i,y_i)$ — the empirical distribution with each spike replaced by a vicinity." },
      { sym: "$\\mu(\\tilde{x},\\tilde{y}\\mid x_i,y_i)$", desc: "mixup's specific vicinity distribution: a Beta-weighted interpolation between $(x_i,y_i)$ and every other point $(x_j,y_j)$ (Section 2)." },
      { sym: "$\\mathbb{E}_{\\lambda}[\\cdot]$", desc: "the expectation (average) over the random mixing weight $\\lambda\\sim\\mathrm{Beta}(\\alpha,\\alpha)$." },
      { sym: "$B$ / $K$", desc: "$B$ = the mini-batch size (number of examples per batch); $K$ = the number of classes (length of each one-hot label vector)." },
      { sym: "ERM", desc: "Empirical Risk Minimization: minimize average loss on exactly the $n$ training points (integrate the loss against the spiky $P_\\delta$). The baseline mixup improves on." },
      { sym: "VRM", desc: "Vicinal Risk Minimization: minimize average loss against the smoothed $P_\\nu$ — a 'vicinity' cloud of virtual points around each training point, not only the points themselves. mixup is one such vicinity (interpolate two points)." },
      { sym: "convex combination", desc: "a weighted average $\\lambda a+(1-\\lambda)b$ with $\\lambda\\in[0,1]$: the weights are non-negative and add to 1, so the result lies on the segment between $a$ and $b$." }
    ],

    formula:
      `<p><b>The mixup construction (Section 2) &mdash; what the network actually trains on:</b></p>
       $$\\tilde{x}=\\lambda\\,x_i+(1-\\lambda)\\,x_j,\\qquad \\tilde{y}=\\lambda\\,y_i+(1-\\lambda)\\,y_j,\\qquad \\lambda\\sim\\mathrm{Beta}(\\alpha,\\alpha)$$
       <p>Section 2: $(x_i,y_i)$ and $(x_j,y_j)$ are two examples drawn at random from the training data,
       $\\lambda\\in[0,1]$. Take the <i>same</i> $\\lambda$-weighted blend of both inputs and one-hot labels.</p>
       <p><b>The objective being replaced &mdash; ERM (Section 2).</b> The learner wants the <i>expected</i> (true)
       risk, an integral over the unknown data distribution $P$:</p>
       $$R(f)=\\int \\ell\\bigl(f(x),\\,y\\bigr)\\,\\mathrm{d}P(x,y)$$
       <p>Section 2: $P$ is unknown, so it is approximated by the <b>empirical distribution</b> $P_\\delta$, which
       places a Dirac spike of mass $\\tfrac1n$ on each training point and zero elsewhere:</p>
       $$P_\\delta(x,y)=\\frac1n\\sum_{i=1}^{n}\\delta(x=x_i,\\;y=y_i)$$
       <p>Section 2 (eq 1): integrating $R(f)$ against $P_\\delta$ gives the <b>empirical risk</b> that ERM minimizes
       &mdash; average loss on exactly the $n$ points:</p>
       $$R_\\delta(f)=\\frac1n\\sum_{i=1}^{n}\\ell\\bigl(f(x_i),\\,y_i\\bigr)$$
       <p><b>The Vicinal Risk Minimization (VRM) view that mixup adopts (Section 2).</b> VRM replaces each Dirac
       spike with a <i>vicinity distribution</i> $\\nu$ spread around the point, giving a smoothed data
       distribution:</p>
       $$P_\\nu(\\tilde{x},\\tilde{y})=\\frac1n\\sum_{i=1}^{n}\\nu\\bigl(\\tilde{x},\\tilde{y}\\mid x_i,y_i\\bigr)$$
       <p>Section 2: minimizing loss against samples from $P_\\nu$ is VRM. mixup's specific, data-agnostic choice of
       vicinity is "draw a second point $x_j$ and a weight $\\lambda$, then interpolate":</p>
       $$\\mu(\\tilde{x},\\tilde{y}\\mid x_i,y_i)=\\frac1n\\sum_{j=1}^{n}\\mathbb{E}_{\\lambda}\\Bigl[\\delta\\bigl(\\tilde{x}=\\lambda x_i+(1-\\lambda)x_j,\\;\\tilde{y}=\\lambda y_i+(1-\\lambda)y_j\\bigr)\\Bigr],\\qquad \\lambda\\sim\\mathrm{Beta}(\\alpha,\\alpha)$$
       <p>Section 2: this is the mixup vicinity. So ERM (integrate against the spiky $P_\\delta$) versus VRM
       (integrate against the smoothed $P_\\nu$/$\\mu$) is exactly the contrast mixup turns on: the only change is
       <i>which distribution you draw training points from</i>.</p>`,

    whatItDoes:
      `<p>The top pair of equations (Section 2) says: to make one training example, pick two real examples, draw a
       random weight $\\lambda$ from $\\mathrm{Beta}(\\alpha,\\alpha)$, and take the <i>same</i> $\\lambda$-weighted
       average of both the inputs and the one-hot labels. The blended input $\\tilde{x}$ is a partial picture of
       both; the blended label $\\tilde{y}$ is a soft target like $[0.7,0.3]$ that admits partial membership. You
       then minimize the ordinary loss on these virtual $(\\tilde{x},\\tilde{y})$ pairs instead of on the raw
       points (eq (1)). Because new $\\lambda$ and new pairs are drawn every batch, the model sees a continuum of
       interpolations and is pushed to vary its predictions smoothly between classes.</p>`,

    derivation:
      `<p>This lesson has no separate concept owner (<code>conceptLink</code> is null), so here is the full "why
       it is a sensible objective." mixup is an instance of <b>Vicinal Risk Minimization</b>. ERM minimizes the
       average loss against the <i>empirical</i> data distribution $P_\\delta$, which places a spike (a Dirac
       delta) exactly on each of the $n$ training points and zero mass everywhere else &mdash; that is why the
       model only ever gets feedback at those exact points (paper eq (1)).</p>
       <p>VRM (Chapelle et al., 2000, cited by the paper) replaces each spike with a small <i>vicinity
       distribution</i> $\\nu$ spread around the point, giving a smoothed data distribution
       $P_\\nu(\\tilde{x},\\tilde{y})=\\frac1n\\sum_{i}\\nu(\\tilde{x},\\tilde{y}\\mid x_i,y_i)$. You then minimize
       loss against samples from $P_\\nu$. Classic data augmentation is a vicinity that applies label-preserving
       transforms (crops, flips) &mdash; but it keeps the label fixed and needs domain knowledge.</p>
       <p>mixup's contribution is a specific, <i>generic</i> vicinity: the virtual point is a convex combination of
       <i>two</i> training points, and &mdash; unlike a crop &mdash; the label is mixed too. Concretely, draw
       $\\lambda\\sim\\mathrm{Beta}(\\alpha,\\alpha)$ and set $\\tilde{x}=\\lambda x_i+(1-\\lambda)x_j$,
       $\\tilde{y}=\\lambda y_i+(1-\\lambda)y_j$. Minimizing loss over this vicinity is equivalent to asking the
       model $f$ to satisfy, approximately, $f(\\lambda x_i+(1-\\lambda)x_j)\\approx\\lambda y_i+(1-\\lambda)y_j$:
       behave <i>linearly</i> along the segment joining any two training inputs. Linearity is a strong but simple
       inductive bias &mdash; the simplest possible behavior in the gaps &mdash; which reduces the model's
       tendency to oscillate or be overconfident between classes. There is no closed-form "proof it is optimal";
       its justification is this prior plus the empirical wins in Section 3.</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; one mixed example and its mixed loss, on a 2-class problem. Take two
       training examples (using tiny 2D inputs for clarity):</p>
       <ul>
         <li>Example $i$ is class 0: input $x_i=[0,\\,2]$, one-hot label $y_i=[1,\\,0]$.</li>
         <li>Example $j$ is class 1: input $x_j=[3,\\,1]$, one-hot label $y_j=[0,\\,1]$.</li>
         <li>Drawn mixing weight: $\\lambda=0.7$.</li>
       </ul>
       <p><b>Blend the input:</b> $\\tilde{x}=0.7\\,[0,2]+0.3\\,[3,1]=[0.7\\cdot0+0.3\\cdot3,\\;0.7\\cdot2+0.3\\cdot1]
       =\\mathbf{[0.9,\\,1.7]}$.</p>
       <p><b>Blend the label:</b> $\\tilde{y}=0.7\\,[1,0]+0.3\\,[0,1]=\\mathbf{[0.7,\\,0.3]}$ &mdash; a soft target,
       "70% class 0, 30% class 1."</p>
       <p><b>Mixed loss.</b> Suppose the model outputs class probabilities $p=[0.6,\\,0.4]$ on $\\tilde{x}$. The
       cross-entropy against the soft target is $\\ell=-\\sum_k \\tilde{y}_k\\log p_k
       =-(0.7\\ln 0.6+0.3\\ln 0.4)$. Since $-\\ln 0.6=0.5108$ and $-\\ln 0.4=0.9163$:
       $\\ell=0.7(0.5108)+0.3(0.9163)=\\mathbf{0.6325}$.</p>
       <p>Notice the mixed cross-entropy equals
       $\\lambda\\,\\ell(p,\\text{class }0)+(1-\\lambda)\\,\\ell(p,\\text{class }1)$ &mdash; the same $\\lambda$-weighted
       average of the two single-class losses ($0.7\\cdot0.5108+0.3\\cdot0.9163=0.6325$). That identity (linearity
       of cross-entropy in the soft label) is exactly how mixup is implemented in practice. The CODE cell
       recomputes all of these and prints them.</p>`,

    recipe:
      `<p><b>mixup, as numbered steps</b> &mdash; one training batch:</p>
       <ol>
         <li>Take a mini-batch of inputs $X$ and one-hot labels $Y$.</li>
         <li>Draw one $\\lambda\\sim\\mathrm{Beta}(\\alpha,\\alpha)$ for the whole batch (the paper's default).</li>
         <li>Form a random pairing: shuffle the batch indices to get a permutation, giving partner inputs
         $X'$ and partner labels $Y'$.</li>
         <li>Blend: $\\tilde{X}=\\lambda X+(1-\\lambda)X'$ and $\\tilde{Y}=\\lambda Y+(1-\\lambda)Y'$.</li>
         <li>Forward $\\tilde{X}$ through the network, compute cross-entropy against the soft target $\\tilde{Y}$,
         backpropagate, and step the optimizer.</li>
         <li>Repeat with a fresh $\\lambda$ and fresh pairing every batch. Evaluate on <i>real</i> (un-mixed)
         data.</li>
       </ol>`,

    results:
      `<p>The paper evaluates mixup against ERM across image classification and robustness (Section 3). Quoted
       data points: on <b>CIFAR-10</b>, a PreAct ResNet-18 improves from <b>5.6%</b> (ERM) to <b>4.2%</b> error,
       and a WideResNet-28-10 from <b>3.8%</b> to <b>2.7%</b>. On <b>ImageNet-2012</b>, a ResNet-50 (90 epochs)
       improves from <b>23.5%</b> to <b>23.3%</b> top-1 error, and ResNet-101 from <b>22.1%</b> to <b>21.5%</b>.
       The paper recommends $\\alpha\\in[0.1,0.4]$ (larger $\\alpha$ underfits). On <i>robustness</i>: under 50%
       randomly corrupted labels, mixup (large $\\alpha$) reaches <b>12.7%</b> test error versus ERM's
       <b>44.6%</b> (Section 3.4); and it roughly halves error under FGSM white-box adversarial attack
       (Section 3.5). (Source: arXiv:1710.09412.) The CODEVIZ numbers below are our own small run, not the
       paper's reported results.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> mixup is a tiny data transform &mdash; a few lines. Here you <b>build it
       from scratch</b> with raw tensors: draw $\\lambda$ from <code>numpy.random.beta(alpha, alpha)</code>,
       permute the batch with <code>torch.randperm</code>, and form $\\lambda X+(1-\\lambda)X'$ and
       $\\lambda Y+(1-\\lambda)Y'$. There is no PyTorch layer to <code>allclose</code> against (mixup is an
       <i>objective change</i>, not a layer), so the oracle here is the <b>qualitative effect on toy data</b>:
       train the <i>same</i> small classifier with vs without mixup and show mixup's test accuracy is higher and
       its train-vs-test gap smaller. The CODE also verifies the worked-example identity
       (mixed cross-entropy $=\\lambda\\ell_0+(1-\\lambda)\\ell_1$) numerically and runs the $\\alpha$ ablation.
       Autograd handles all gradients; you only write the mix.</p>`,

    pitfalls:
      `<ul>
         <li><b>Mix the label too.</b> The single most common mistake: blending only the inputs but keeping a hard
         one-hot label. mixup's whole point is the matching soft target $\\tilde{y}=\\lambda y_i+(1-\\lambda)y_j$.
         Mixing inputs alone just injects noise.</li>
         <li><b>One $\\lambda$ per batch, not per element.</b> The paper draws a single $\\lambda$ for the whole
         mini-batch and pairs the batch with a shuffled copy of itself. (Per-example $\\lambda$ also works but is
         not the reference recipe.)</li>
         <li><b>Cross-entropy must accept a soft target.</b> The standard "label = an integer class index" loss
         cannot take $[0.7,0.3]$. Use the soft-label form $-\\sum_k \\tilde{y}_k\\log p_k$ (equivalently the
         $\\lambda$-weighted sum of two hard-label losses).</li>
         <li><b>Evaluate on real data.</b> Mixing is for <i>training</i> only. Measure accuracy on un-mixed test
         examples.</li>
         <li><b>$\\alpha$ too large underfits.</b> Big $\\alpha$ pushes $\\lambda$ toward $0.5$, so nearly every
         example is a hard 50/50 blend; the paper notes (and our ablation shows) this <i>hurts</i> &mdash;
         $\\alpha\\in[0.1,0.4]$ is the sweet spot.</li>
         <li><b>$\\alpha$ is not $\\lambda$.</b> $\\alpha$ is the fixed shape knob of the Beta distribution;
         $\\lambda$ is the random weight drawn from it each batch.</li>
       </ul>`,

    recall: [
      "State the mixup construction from memory: $\\tilde{x}=\\lambda x_i+(1-\\lambda)x_j$, $\\tilde{y}=\\lambda y_i+(1-\\lambda)y_j$, $\\lambda\\sim\\mathrm{Beta}(\\alpha,\\alpha)$.",
      "Why must the label be mixed, not just the input?",
      "Define ERM in one sentence, and say what VRM adds.",
      "What does the hyperparameter $\\alpha$ control, and what range does the paper recommend?",
      "Show that the mixed cross-entropy equals $\\lambda\\,\\ell_0+(1-\\lambda)\\,\\ell_1$."
    ],

    practice: [
      {
        q: `Mix example $i$ = (input $[1,4]$, label class 0 = $[1,0]$) with example $j$ = (input $[5,0]$, label class 1 = $[0,1]$) using $\\lambda=0.25$. Give $\\tilde{x}$ and $\\tilde{y}$, and say which class the soft label leans toward.`,
        steps: [
          { do: `Blend the input: $\\tilde{x}=0.25[1,4]+0.75[5,0]$.`, why: `Same convex combination applied componentwise.` },
          { do: `Compute: $[0.25\\cdot1+0.75\\cdot5,\\;0.25\\cdot4+0.75\\cdot0]=[4.0,\\,1.0]$.`, why: `Weighted average of the two inputs.` },
          { do: `Blend the label: $\\tilde{y}=0.25[1,0]+0.75[0,1]=[0.25,\\,0.75]$.`, why: `The label uses the SAME $\\lambda$.` }
        ],
        answer: `$\\tilde{x}=[4.0,\\,1.0]$ and $\\tilde{y}=[0.25,\\,0.75]$. With $\\lambda=0.25$ the blend is mostly example $j$, so the soft label leans toward class 1 (0.75).`
      },
      {
        q: `With the soft label $\\tilde{y}=[0.7,0.3]$ from the worked example, a model predicts $p=[0.9,0.1]$. Compute the mixed cross-entropy loss. Is it smaller or larger than against $p=[0.6,0.4]$ (which gave 0.6325)?`,
        steps: [
          { do: `Mixed CE $=-(0.7\\ln 0.9+0.3\\ln 0.1)$.`, why: `Cross-entropy against the soft target.` },
          { do: `$-\\ln 0.9=0.1054$, $-\\ln 0.1=2.3026$.`, why: `Per-class losses.` },
          { do: `$0.7(0.1054)+0.3(2.3026)=0.0738+0.6908=0.7646$.`, why: `$\\lambda$-weighted sum.` }
        ],
        answer: `Loss $\\approx 0.7646$ — larger than 0.6325. Even though $p=[0.9,0.1]$ is more confident about class 0, the soft target wants $0.3$ mass on class 1; over-committing to class 0 is penalized. This is exactly how mixup discourages overconfidence.`
      },
      {
        q: `Ablation: in the CODE, sweep $\\alpha\\in\\{0.1, 0.2, 0.4, 1.0, 4.0\\}$ and also run plain ERM, training the same classifier each time and recording test accuracy. What shape do you expect, and what does it tell you about $\\alpha$?`,
        steps: [
          { do: `Fix the network, data, seed, and optimizer; vary only $\\alpha$ (with ERM = no mixup as the floor).`, why: `Isolate $\\alpha$ as the single variable.` },
          { do: `Recall what $\\alpha$ does to $\\lambda$: small $\\alpha$ → mild mixes near the originals; large $\\alpha$ → aggressive 50/50 mixes.`, why: `Connect the knob to the strength of the augmentation.` },
          { do: `Read off test accuracy across the sweep and compare to ERM.`, why: `See whether more mixing keeps helping.` }
        ],
        answer: `An inverted-U: mixup beats ERM across a wide range, peaking at small-to-moderate $\\alpha$ and then degrading as $\\alpha$ grows. In our small run (CODEVIZ — our numbers, not the paper's) ERM is 0.935, $\\alpha=0.1$ and $\\alpha=0.4$ reach ~0.9725, and $\\alpha=4.0$ falls back to ~0.954. Too much mixing (every example a hard 50/50 blend) makes the task too hard and underfits — matching the paper's recommendation of $\\alpha\\in[0.1,0.4]$.`
      }
    ]
  });

  window.CODE["paper-mixup"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build mixup from scratch: draw lambda ~ Beta(alpha,alpha), permute the batch, and form ` +
      `x~ = lam*x + (1-lam)*x[idx], y~ = lam*y + (1-lam)*y[idx]. Verify the worked-example identity ` +
      `(mixed CE == lam*CE0 + (1-lam)*CE1) numerically. Then train the SAME tiny classifier on a small toy ` +
      `2-class problem twice — plain ERM vs mixup — and print test accuracy, the train-vs-test gap, and mean ` +
      `confidence (mixup should generalize better and be less overconfident). Finally sweep alpha. ` +
      `Runs in Colab (torch is preinstalled).`,
    code: `import numpy as np, torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0); np.random.seed(0)

# ---- the worked example: one mixed example + mixed loss (Section 2) ----
xi = torch.tensor([0.,2.]); yi = torch.tensor([1.,0.])   # class 0
xj = torch.tensor([3.,1.]); yj = torch.tensor([0.,1.])   # class 1
lam = 0.7
x_tilde = lam*xi + (1-lam)*xj
y_tilde = lam*yi + (1-lam)*yj
print("x~ =", x_tilde.tolist(), " y~ =", y_tilde.tolist())   # [0.9,1.7] [0.7,0.3]
p = torch.tensor([0.6,0.4])                                  # model's predicted probs on x~
mixed_ce = -(y_tilde * p.log()).sum()
ce0, ce1 = -p[0].log(), -p[1].log()
print("mixed CE =", round(mixed_ce.item(),4),
      " lam*CE0+(1-lam)*CE1 =", round((lam*ce0+(1-lam)*ce1).item(),4))   # both 0.6325

# ---- mixup FROM SCRATCH (the few-line transform) ----
def mixup_batch(x, y, alpha):
    lam = float(np.random.beta(alpha, alpha))     # one lambda per batch
    idx = torch.randperm(x.size(0))               # random pairing within the batch
    x_mix = lam*x + (1-lam)*x[idx]
    y_mix = lam*y + (1-lam)*y[idx]                # mix the LABEL too — the whole point
    return x_mix, y_mix

# ---- toy 2-class problem: tiny train set, large test set ----
def make_data(n, seed):
    r = np.random.default_rng(seed)
    t0 = r.uniform(0, np.pi, n)
    X0 = np.stack([np.cos(t0), np.sin(t0)], 1) + r.normal(0, .18, (n,2))
    t1 = r.uniform(0, np.pi, n)
    X1 = np.stack([1-np.cos(t1), .4-np.sin(t1)], 1) + r.normal(0, .18, (n,2))
    X = np.vstack([X0, X1]); y = np.array([0]*n + [1]*n)
    return torch.tensor(X, dtype=torch.float32), torch.tensor(y)

Xtr, ytr = make_data(30, 1)      # small -> room for mixup to help
Xte, yte = make_data(400, 99)
Ytr = F.one_hot(ytr, 2).float()

def make_net():
    return nn.Sequential(nn.Linear(2,16), nn.ReLU(),
                         nn.Linear(16,16), nn.ReLU(), nn.Linear(16,2))

def soft_ce(logits, soft_target):
    return -(soft_target * F.log_softmax(logits, 1)).sum(1).mean()

def train(use_mixup, alpha=0.2, steps=4000, lr=0.3, seed=1):
    torch.manual_seed(seed); np.random.seed(seed)
    net = make_net(); opt = torch.optim.SGD(net.parameters(), lr=lr)
    for _ in range(steps):
        if use_mixup: xb, yb = mixup_batch(Xtr, Ytr, alpha)
        else:         xb, yb = Xtr, Ytr
        opt.zero_grad(); soft_ce(net(xb), yb).backward(); opt.step()
    return net

@torch.no_grad()
def report(net, tag):
    tr = (net(Xtr).argmax(1)==ytr).float().mean().item()
    pte = F.softmax(net(Xte),1); te = (pte.argmax(1)==yte).float().mean().item()
    print(f"{tag:14s} train={tr:.3f} test={te:.3f} gap={tr-te:+.3f} "
          f"mean_conf={pte.max(1).values.mean().item():.3f}")

print("\\n--- ERM vs mixup (same net, data, seed) ---")
report(train(False),          "ERM")
report(train(True, alpha=0.2),"mixup a=0.2")

print("\\n--- alpha ablation (test accuracy) ---")
report(train(False), "ERM (no mixup)")
for a in [0.1, 0.2, 0.4, 1.0, 4.0]:
    report(train(True, alpha=a), f"mixup a={a}")`
  };

  window.CODEVIZ["paper-mixup"] = {
    question: "Does training the SAME tiny classifier with mixup (vs plain ERM) generalize better on a small toy 2-class problem — and how does the mixup strength alpha trade off?",
    charts: [
      {
        type: "bar",
        title: "Test accuracy: ERM vs mixup (same net, data, seed; small train set, 800-point test set)",
        xlabel: "training method",
        ylabel: "test accuracy",
        series: [
          { name: "test accuracy", color: "#7ee787", points: [["ERM", 0.935], ["mixup a=0.2", 0.970]] }
        ]
      },
      {
        type: "bar",
        title: "Train-vs-test generalization gap (lower = generalizes better)",
        xlabel: "training method",
        ylabel: "train acc - test acc",
        series: [
          { name: "gen. gap", color: "#ff7b72", points: [["ERM", 0.065], ["mixup a=0.2", 0.030]] }
        ]
      },
      {
        type: "line",
        title: "alpha ablation: test accuracy vs mixup strength alpha (ERM shown as alpha=0)",
        xlabel: "alpha (0 = no mixup / ERM)",
        ylabel: "test accuracy",
        series: [
          { name: "mixup test accuracy", color: "#79c0ff",
            points: [[0.0, 0.935], [0.1, 0.9725], [0.2, 0.970], [0.4, 0.9725], [1.0, 0.9688], [4.0, 0.9538]] }
        ]
      }
    ],
    caption: "Our small-scale run (torch + numpy, seeds fixed), not the paper's reported numbers. A tiny 2->16->16->2 MLP is trained on a small toy 2-class problem (30 points/class) and tested on 800 held-out points; everything except the training method is held fixed. LEFT: mixup (alpha=0.2) lifts test accuracy from 0.935 (ERM) to 0.970, even though BOTH reach 100% train accuracy. MIDDLE: mixup roughly halves the train-vs-test generalization gap (0.065 -> 0.030) and is less overconfident on test points (mean predicted confidence drops from 0.989 to 0.959), i.e. a smoother, better-calibrated boundary. RIGHT: the alpha sweep is an inverted-U — mixup beats ERM (alpha=0) across a wide range, peaks for small-to-moderate alpha (~0.1-0.4), then degrades by alpha=4.0 (0.954) as nearly-50/50 blends make the task too hard and underfit. This reproduces the paper's QUALITATIVE claims (better generalization, smaller gap, alpha in [0.1,0.4]); the magnitudes are ours.",
    code: `import numpy as np, torch
import torch.nn as nn, torch.nn.functional as F

def make_data(n, seed):
    r = np.random.default_rng(seed)
    t0 = r.uniform(0, np.pi, n); X0 = np.stack([np.cos(t0), np.sin(t0)],1)+r.normal(0,.18,(n,2))
    t1 = r.uniform(0, np.pi, n); X1 = np.stack([1-np.cos(t1), .4-np.sin(t1)],1)+r.normal(0,.18,(n,2))
    return (torch.tensor(np.vstack([X0,X1]),dtype=torch.float32),
            torch.tensor(np.array([0]*n+[1]*n)))

Xtr,ytr = make_data(30,1); Xte,yte = make_data(400,99)
Ytr = F.one_hot(ytr,2).float()

def mixup_batch(x,y,a):
    lam=float(np.random.beta(a,a)); idx=torch.randperm(x.size(0))
    return lam*x+(1-lam)*x[idx], lam*y+(1-lam)*y[idx]

def train(use_mixup, alpha=0.2, steps=4000, lr=0.3, seed=1):
    torch.manual_seed(seed); np.random.seed(seed)
    net = nn.Sequential(nn.Linear(2,16),nn.ReLU(),nn.Linear(16,16),nn.ReLU(),nn.Linear(16,2))
    opt = torch.optim.SGD(net.parameters(), lr=lr)
    for _ in range(steps):
        xb,yb = mixup_batch(Xtr,Ytr,alpha) if use_mixup else (Xtr,Ytr)
        opt.zero_grad(); (-(yb*F.log_softmax(net(xb),1)).sum(1).mean()).backward(); opt.step()
    return net

@torch.no_grad()
def stats(net):
    tr=(net(Xtr).argmax(1)==ytr).float().mean().item()
    te=(net(Xte).argmax(1)==yte).float().mean().item()
    return round(tr,4), round(te,4)

print("ERM   ", stats(train(False)))            # (1.0, 0.935)
print("mixup ", stats(train(True, alpha=0.2)))  # (1.0, 0.97)
print("alpha sweep test acc:")
print(" ERM ", stats(train(False))[1])
for a in [0.1,0.2,0.4,1.0,4.0]:
    print(f" a={a}", stats(train(True, alpha=a))[1])`
  };
})();
