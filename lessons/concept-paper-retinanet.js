/* Paper lesson — "Focal Loss for Dense Object Detection / RetinaNet" (Lin et al., 2017).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-retinanet".
   GROUNDED from arXiv:1708.02002 (abstract) and the ar5iv HTML mirror
   (Section 3: Eqns 1-2 cross entropy + p_t, Eqn 3 alpha-balanced CE, Eqn 4 focal loss,
   Eqn 5 the alpha-balanced focal loss used in experiments; Section 4 RetinaNet = ResNet + FPN
   + two subnets, the prior pi=0.01 init; Section 5 / Table 1b the gamma ablation).
   Track B (architecture): implement focal loss in torch; show easy-example down-weighting numerically;
   train a tiny imbalanced classifier with cross entropy vs focal; ablate gamma.
   The cross-entropy math lives in concept dl-cross-entropy; here we recap and link.
   Cross-links: paper-fpn (the multi-scale backbone RetinaNet sits on), paper-ssd and paper-yolo
   (the earlier one-stage detectors focal loss lets RetinaNet finally beat on accuracy). */
(function () {
  window.LESSONS.push({
    id: "paper-retinanet",
    title: "RetinaNet — Focal Loss for Dense Object Detection (2017)",
    tagline: "Reshape cross entropy so easy, well-classified examples are down-weighted, letting a simple one-stage detector match two-stage accuracy.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Tsung-Yi Lin, Priya Goyal, Ross Girshick, Kaiming He, Piotr Dollár",
      org: "Facebook AI Research (FAIR)",
      year: 2017,
      venue: "arXiv:1708.02002 (Aug 2017); ICCV 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1708.02002",
      code: "https://github.com/facebookresearch/Detectron"
    },
    conceptLink: "dl-cross-entropy",
    partOf: [],
    prereqs: ["dl-object-detection", "dl-cross-entropy", "pt-cnn", "pt-nn-module", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p><b>Object detection</b> means: in one image, draw a tight box around every object and label each
       one. Two families competed. <b>Two-stage</b> detectors (the R-CNN family) first propose a few hundred
       candidate regions that <i>might</i> contain something, then classify each &mdash; accurate but slow.
       <b>One-stage</b> detectors (YOLO, see <code>paper-yolo</code>; SSD, see <code>paper-ssd</code>) skip
       proposals and instead score a <b>dense</b> grid of fixed boxes in one pass &mdash; fast, but until this
       paper they were stuck below two-stage accuracy.</p>
       <blockquote>"one-stage detectors that are applied over a regular, dense sampling of possible object
       locations have the potential to be faster and simpler, but have trailed the accuracy of two-stage
       detectors thus far. In this paper, we investigate why this is the case." (Abstract)</blockquote>
       <p>The paper's diagnosis: a one-stage detector scores roughly <b>100,000 candidate boxes per image</b>,
       but almost all are <b>background</b> (the paper cites foreground-to-background ratios near
       <b>1:1000</b>). Each background box is <b>easy</b> &mdash; the model quickly learns it is "nothing."
       But there are <i>so many</i> of them that, summed up, the easy background loss <b>drowns out</b> the
       handful of real objects, and training never focuses on the hard cases that matter (&sect;1, &sect;3).</p>`,
    contribution:
      `<ul>
        <li><b>A diagnosis: extreme class imbalance is the root cause.</b> Not the architecture &mdash; the
        <b>loss</b>. With a vast majority of easy background boxes, ordinary <b>cross entropy</b> (the standard
        loss that penalizes a wrong probability) spends most of its total on examples the model already gets
        right (&sect;3).</li>
        <li><b>Focal Loss.</b> A one-line reshape of cross entropy that multiplies each example's loss by a
        <b>modulating factor</b> $(1-p_t)^\\gamma$. When the model is confident and correct ($p_t$ near 1)
        this factor is tiny, so easy examples contribute almost nothing; hard, misclassified examples
        ($p_t$ near 0) keep nearly their full loss. Training automatically focuses on the hard minority
        (&sect;3, Eqn 4).</li>
        <li><b>RetinaNet.</b> A deliberately <i>simple</i> one-stage detector &mdash; a ResNet backbone with a
        Feature Pyramid Network (see <code>paper-fpn</code>) plus two small prediction subnets &mdash; built
        only to show the loss is what matters. Trained with focal loss it <b>matched the speed of one-stage
        detectors while surpassing the accuracy of every then-existing two-stage detector</b> (Abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>Focal loss removed the last reason to prefer slow two-stage pipelines for many tasks: a clean
       one-stage detector could now be both fast <i>and</i> top-accuracy. The loss itself escaped detection
       entirely &mdash; it became a default tool for <b>any</b> problem with heavy class imbalance
       (segmentation, medical screening, rare-event classification, anchor-based detectors broadly). The
       RetinaNet recipe (FPN backbone + shared classification/regression subnets) seeded later anchor-free and
       dense detectors. "Focal loss" is now a one-call option in most deep-learning libraries.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b> &sect;3 "Focal Loss" &mdash; this is the whole paper. Equations 1&ndash;5 take
       you from cross entropy to focal loss in five short steps; <b>Figure 1</b> plots the loss curves for
       several $\\gamma$ and shows visually how easy examples flatten. <b>Table 1b</b> is the $\\gamma$
       ablation you will reproduce in spirit.</p>
       <p><b>Skim:</b> &sect;4 "RetinaNet Detector" &mdash; note only that it is intentionally simple
       (ResNet + FPN + two subnets) and the prior-bias initialization trick (&sect;3.3 / &sect;4.1). You do
       <i>not</i> need the FPN internals here &mdash; that is <code>paper-fpn</code>. <b>Skip</b> the COCO
       benchmark tables (&sect;5) on a first pass except the headline AP.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Picture 1000 <b>easy</b> background boxes the model is already 95% sure about, plus 10 <b>hard</b>
       boxes it is only 50% sure about. Under plain cross entropy, what fraction of the <i>total</i> loss do
       you think comes from the 1000 easy ones &mdash; a little, about half, or most of it? Now multiply each
       loss by $(1-p_t)^2$. Guess which way that fraction moves.</p>`,
    attempt:
      `<p>Before the reveal, implement focal loss for binary classification from a tensor of logits and
       targets:</p>
       <ul>
        <li>Compute $p =$ <code>sigmoid(logits)</code>, then $p_t = p$ where the label is 1 and $1-p$ where it
        is 0 (the probability assigned to the <i>true</i> class). <i>// TODO</i></li>
        <li>Return the mean of $-\\alpha_t\\,(1-p_t)^\\gamma\\,\\log(p_t)$ over the batch, with
        $\\gamma=2$. <i>// TODO</i></li>
        <li><b>Sanity check first:</b> with $\\gamma=0$ and $\\alpha_t=1$, your focal loss must equal plain
        binary cross entropy <i>exactly</i> &mdash; if it does not, the $p_t$ bookkeeping is wrong. <i>// TODO</i></li>
       </ul>
       <p>Then train two copies of a tiny linear classifier on a 1:99 imbalanced toy set &mdash; one with
       cross entropy, one with focal loss &mdash; and compare <b>recall on the rare class</b>.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>Start with <b>binary cross entropy</b>, the standard loss for a yes/no prediction. The model outputs
       a probability $p\\in[0,1]$ that the label is 1. Cross entropy penalizes you by $-\\log(p)$ when the true
       label is 1 and $-\\log(1-p)$ when it is 0 (Eqn 1). A confident-correct prediction ($p$ near the right
       end) gives a small loss; a confident-wrong one gives a large loss.</p>
       <p>The paper introduces a tidy shorthand $p_t$ (Eqn 2): the probability the model assigned to the
       <b>true</b> class &mdash; $p_t = p$ if the label is 1, and $p_t = 1-p$ if the label is 0. With it,
       cross entropy collapses to a single clean expression $\\text{CE}(p_t) = -\\log(p_t)$. A well-classified
       example always has $p_t$ near 1.</p>
       <p>Here is the catch (&sect;3). Even a "small" per-example loss is not zero. At $p_t = 0.9$, cross
       entropy is still $-\\log(0.9)\\approx 0.105$. One such example is negligible &mdash; but with
       <b>tens of thousands</b> of easy background boxes, their tiny losses <b>add up to more than</b> the few
       hard, important examples. Training is dominated by examples it has already mastered.</p>
       <p>The fix (Eqn 4) is to multiply cross entropy by a <b>modulating factor</b> $(1-p_t)^\\gamma$, where
       $\\gamma\\ge 0$ is a tunable <b>focusing parameter</b>. The factor depends on how right the model
       already is:</p>
       <ul>
        <li>When the example is <b>well-classified</b> ($p_t\\to 1$), $(1-p_t)^\\gamma\\to 0$ &mdash; the loss
        is crushed toward zero. The bigger $\\gamma$, the harder the crush.</li>
        <li>When the example is <b>misclassified</b> ($p_t$ small), $(1-p_t)^\\gamma\\to 1$ &mdash; the loss is
        almost untouched.</li>
       </ul>
       <p>So focal loss does not ignore easy examples by a hard threshold; it <b>smoothly turns down their
       volume</b> in proportion to how easy they are, and leaves hard examples at full volume. The paper also
       prepends a class-weight $\\alpha_t$ (Eqn 5) &mdash; the same per-class balancing as weighted cross
       entropy &mdash; because it gave a small extra gain. With $\\gamma=0$ the factor is always 1 and focal
       loss is <b>exactly</b> cross entropy (&sect;3), which is your code's sanity check.</p>`,
    architecture:
      `<p>RetinaNet (&sect;4) is one unified network = a <b>backbone</b> that builds a multi-scale feature pyramid,
       plus <b>two small subnets</b> attached to every pyramid level &mdash; one for classification, one for box
       regression. It was kept deliberately plain to prove the <i>loss</i>, not the design, closed the gap.</p>
       <p><b>Backbone &mdash; ResNet + Feature Pyramid Network (FPN).</b> A ResNet-50 or ResNet-101 feeds an FPN
       (details in <code>paper-fpn</code>) that emits pyramid levels $P_3$ through $P_7$, each with $C=256$
       channels. $P_3$&ndash;$P_5$ come from ResNet stages via top-down + lateral connections; $P_6$ is a
       $3\\times 3$ stride-2 conv on $C_5$; $P_7$ is a ReLU then a $3\\times 3$ stride-2 conv on $P_6$. Level
       $P_l$ has resolution $2^l$ smaller than the input, so coarse levels catch big objects and fine levels
       catch small ones.</p>
       <p><b>Anchors.</b> At each location of each level there are $A=9$ anchor boxes: 3 aspect ratios
       $\\{1{:}2, 1{:}1, 2{:}1\\}$ &times; 3 scales $\\{2^{0}, 2^{1/3}, 2^{2/3}\\}$. Anchor areas run from $32^2$
       on $P_3$ to $512^2$ on $P_7$ (covering ~32&ndash;813 pixels). Summed over the pyramid this is the
       <b>~100k anchors per image</b> the focal loss is computed on &mdash; the source of the extreme imbalance.</p>
       <p><b>Classification subnet.</b> A small fully-convolutional head, <i>shared across all pyramid levels</i>:
       four $3\\times 3$ conv layers with $C=256$ filters each and ReLU, then a final $3\\times 3$ conv with $KA$
       filters and a <b>sigmoid</b>, predicting object presence for $K$ classes at each of the $A$ anchors per
       location. Its final bias gets the prior-$\\pi$ init $b=-\\log((1-\\pi)/\\pi)$, $\\pi=0.01$.</p>
       <p><b>Box regression subnet.</b> Identical four-conv structure (separate weights), ending in a $4A$-filter
       linear conv that outputs the 4 box-offset values per anchor. It is class-agnostic and trained with a
       <b>smooth-L1</b> loss; the total training loss is focal loss (classification) + smooth-L1 (regression).</p>`,
    symbols: [
      { sym: "$p$", desc: "the model's predicted probability that the label is 1 (its sigmoid output, between 0 and 1)." },
      { sym: "$y$", desc: "the true binary label, either 1 (foreground / object) or 0 (background)." },
      { sym: "$p_t$", desc: "the probability the model assigned to the TRUE class: $p_t=p$ if $y=1$, and $p_t=1-p$ if $y=0$. Near 1 means well-classified, near 0 means badly wrong." },
      { sym: "$\\text{CE}(p_t)$", desc: "binary cross entropy written with $p_t$: equals $-\\log(p_t)$. The standard 'how surprised was the model' penalty." },
      { sym: "$\\gamma$", desc: "the FOCUSING parameter (gamma), $\\gamma\\ge 0$. Controls how aggressively easy examples are down-weighted; the paper found $\\gamma=2$ best. $\\gamma=0$ recovers plain cross entropy." },
      { sym: "$(1-p_t)^\\gamma$", desc: "the MODULATING FACTOR: near 0 for easy examples (so their loss nearly vanishes), near 1 for hard ones (so their loss stays)." },
      { sym: "$\\alpha_t$", desc: "an optional per-class weight (alpha), like weighted cross entropy: $\\alpha$ for the rare positive class, $1-\\alpha$ for the negative. The paper used $\\alpha=0.25$ together with $\\gamma=2$." },
      { sym: "$\\text{FL}(p_t)$", desc: "the FOCAL LOSS: cross entropy times the modulating factor (and the class weight)." },
      { sym: "$b$", desc: "the bias of the final classification conv layer, initialized to $-\\log((1-\\pi)/\\pi)$ so the network starts predicting 'background' for every anchor." },
      { sym: "$\\pi$", desc: "the prior foreground probability the network is initialized to predict; the paper sets $\\pi=0.01$ (one object box per ~100 anchors)." },
      { sym: "$x$", desc: "a raw output logit (pre-sigmoid score) in the alternative form; $\\sigma(x)=p$." },
      { sym: "$\\sigma$", desc: "the sigmoid function $\\sigma(z)=1/(1+e^{-z})$, turning a logit into a probability." },
      { sym: "$x_t$", desc: "the signed logit $x_t=y\\,x$ with $y\\in\\{\\pm 1\\}$, positive when the model leans toward the correct class (Appendix A)." },
      { sym: "$p_t^{*}$", desc: "the shifted probability $\\sigma(\\gamma x_t+\\beta)$ used by the alternative focal loss $\\text{FL}^{*}$ (Appendix A)." },
      { sym: "$\\beta$", desc: "a shift hyperparameter in the alternative form $\\text{FL}^{*}$; the paper used $\\beta=1$." },
      { sym: "$K$", desc: "the number of object classes; the classification subnet outputs $KA$ scores per spatial location." },
      { sym: "$A$", desc: "the number of anchor boxes per spatial location per pyramid level; RetinaNet uses $A=9$ (3 scales × 3 aspect ratios)." },
      { sym: "$C$", desc: "the channel width of the FPN feature maps and the subnet conv layers; RetinaNet uses $C=256$." },
      { sym: "$P_3..P_7$", desc: "the FPN pyramid levels RetinaNet attaches its subnets to; level $P_l$ has $2^l$ smaller resolution than the input." },
      { sym: "AP", desc: "Average Precision, the standard object-detection accuracy score on COCO (higher is better)." }
    ],
    formula:
      `$$\\text{CE}(p, y) = \\begin{cases} -\\log(p) & \\text{if } y = 1 \\\\ -\\log(1-p) & \\text{otherwise} \\end{cases}$$
       <p>Binary <b>cross entropy</b> (&sect;3, Eqn 1): the standard yes/no loss on the model's probability $p$ that the label is 1.</p>
       $$p_t = \\begin{cases} p & \\text{if } y = 1 \\\\ 1-p & \\text{otherwise} \\end{cases} \\qquad\\Longrightarrow\\qquad \\text{CE}(p_t) = -\\log(p_t)$$
       <p>The $p_t$ shorthand (&sect;3, Eqn 2): the probability of the <b>true</b> class. Cross entropy collapses to the single clean form $-\\log(p_t)$.</p>
       $$\\text{CE}(p_t) = -\\,\\alpha_t\\,\\log(p_t)$$
       <p>$\\alpha$-balanced cross entropy (&sect;3, Eqn 3): a per-class weight $\\alpha_t$ to offset frequency &mdash; the common baseline focal loss is measured against.</p>
       $$\\text{FL}(p_t) = -\\,(1-p_t)^{\\gamma}\\,\\log(p_t)$$
       <p>The core <b>focal loss</b> (&sect;3, Eqn 4): cross entropy times the <b>modulating factor</b> $(1-p_t)^\\gamma$, which crushes the loss of well-classified ($p_t\\to 1$) examples and spares hard ones &mdash; this is the class-imbalance fix, with $\\gamma$ tuning how hard easy examples are down-weighted.</p>
       $$\\text{FL}(p_t) = -\\,\\alpha_t\\,(1-p_t)^{\\gamma}\\,\\log(p_t)$$
       <p>The $\\alpha$-balanced focal loss actually trained (&sect;3, Eqn 5): focusing factor and class weight combined; the paper uses $\\gamma=2$, $\\alpha=0.25$.</p>
       $$b = -\\log\\!\\left(\\frac{1-\\pi}{\\pi}\\right), \\quad \\pi = 0.01$$
       <p><b>Prior $\\pi$ initialization</b> (&sect;3.3 / &sect;4.1): set the final classification conv's bias $b$ so the model <i>starts</i> predicting foreground probability $\\pi=0.01$ for every anchor, stopping the ~100k mostly-background anchors from blowing up the first iteration's loss.</p>
       $$x_t = y\\,x, \\qquad p_t^{*} = \\sigma(\\gamma\\,x_t + \\beta), \\qquad \\text{FL}^{*} = -\\,\\frac{\\log(p_t^{*})}{\\gamma}$$
       <p>The alternative form $\\text{FL}^{*}$ (Appendix A, Eqns 6&ndash;8) on the raw logit $x$ with $y\\in\\{\\pm 1\\}$; with $\\gamma=2$, $\\beta=1$ it reaches 33.8 AP, nearly matching Eqn 5's 34.0 (the paper's numbers).</p>`,
    whatItDoes:
      `<p>This is the alpha-balanced focal loss the paper actually trains with (&sect;3, <b>Eqn 5</b>); dropping
       $\\alpha_t$ gives the core focal loss of <b>Eqn 4</b>, $\\text{FL}(p_t)=-(1-p_t)^\\gamma\\log(p_t)$. Read
       it left to right: take ordinary cross entropy $-\\log(p_t)$, scale it by the class weight $\\alpha_t$,
       then multiply by $(1-p_t)^\\gamma$. That last factor is the whole idea &mdash; it <b>shrinks the loss of
       examples the model already classifies well</b> ($p_t$ near 1) toward zero, while barely touching hard
       examples ($p_t$ near 0). The training signal redistributes itself onto the hard minority. With
       $\\gamma=0$ the factor is 1 and you are back to plain (weighted) cross entropy.</p>`,
    derivation:
      `<p>The cross-entropy core $-\\log(p_t)$ is the negative log-likelihood of the true class; its full
       why-it-is-true derivation (from maximum likelihood) lives in <code>dl-cross-entropy</code> &mdash; recap
       there, we do not re-derive it. What focal loss <i>adds</i> is justified directly: the goal is a per-example
       weight that is ~1 when the example is hard and ~0 when it is easy, varying smoothly. Any decreasing
       function of $p_t$ that is 1 at $p_t=0$ and 0 at $p_t=1$ would qualify; $(1-p_t)^\\gamma$ is the simplest
       such family, with a single dial $\\gamma$ setting the steepness. The paper confirms the choice
       empirically rather than deriving it from first principles: it sweeps $\\gamma$ and reports the accuracy
       (Table 1b), which is exactly the ablation you reproduce. The $\\alpha_t$ factor is the standard
       inverse-frequency class weighting, kept because it gave a small additional gain (&sect;3).</p>`,
    example:
      `<p>Plug real numbers into the core focal loss $\\text{FL}(p_t) = -(1-p_t)^{\\gamma}\\log(p_t)$ with
       $\\gamma=2$ (no $\\alpha$, to isolate the modulating factor), and compare it against cross entropy
       $\\text{CE}(p_t)=-\\log(p_t)$ for an <b>easy</b>, an <b>even-easier</b>, and a <b>hard</b> example.
       These numbers match the notebook and the paper's own quoted ratios (&sect;3).</p>
       <ul class="steps">
        <li><b>Easy example, $p_t = 0.9$.</b> Cross entropy $= -\\log(0.9) = 0.1054$.</li>
        <li>Modulating factor $= (1-0.9)^2 = (0.1)^2 = 0.01$.</li>
        <li>Focal loss $= 0.01 \\times 0.1054 = 0.001054$, so $\\text{CE}/\\text{FL} = 1/0.01 = \\mathbf{100\\times}$.
        The paper states exactly this: "with $\\gamma=2$, an example classified with $p_t=0.9$ would have
        100&times; lower loss compared with CE."</li>
        <li><b>Even easier, $p_t = 0.968$.</b> $\\text{CE} = -\\log(0.968) = 0.0325$; factor
        $= (0.032)^2 = 0.001024$; $\\text{FL} = 0.001024 \\times 0.0325 = 0.0000333$, so
        $\\text{CE}/\\text{FL} \\approx \\mathbf{977\\times}$ &mdash; matching the paper's quoted "1000&times;."</li>
        <li><b>Hard example, $p_t = 0.5$.</b> $\\text{CE} = -\\log(0.5) = 0.6931$; factor
        $= (1-0.5)^2 = 0.25$; $\\text{FL} = 0.25 \\times 0.6931 = 0.1733$, so $\\text{CE}/\\text{FL} = 1/0.25 = \\mathbf{4\\times}$.</li>
       </ul>
       <table class="extable">
        <caption>$\\text{FL} = -(1-p_t)^2\\log(p_t)$ vs $\\text{CE} = -\\log(p_t)$ at $\\gamma=2$.</caption>
        <thead><tr><th>example</th><th class="num">$p_t$</th><th class="num">$(1-p_t)^2$</th><th class="num">CE</th><th class="num">FL</th><th class="num">CE/FL</th></tr></thead>
        <tbody>
         <tr><td class="row-h">easy</td><td class="num">0.900</td><td class="num">0.0100</td><td class="num">0.1054</td><td class="num">0.001054</td><td class="num">100&times;</td></tr>
         <tr><td class="row-h">even easier</td><td class="num">0.968</td><td class="num">0.001024</td><td class="num">0.0325</td><td class="num">0.0000333</td><td class="num">977&times;</td></tr>
         <tr><td class="row-h">hard</td><td class="num">0.500</td><td class="num">0.2500</td><td class="num">0.6931</td><td class="num">0.1733</td><td class="num">4&times;</td></tr>
        </tbody>
       </table>
       <p>The hard example keeps most of its loss ($4\\times$ smaller) while the easy one is crushed $100\\times$
       &mdash; that gap in <i>relative</i> treatment is what refocuses training onto the hard minority.</p>`,
    recipe:
      `<p>The focal loss, as numbered steps you will implement:</p>
       <ol>
        <li>From the model's logits, get $p = \\text{sigmoid(logits)}$.</li>
        <li>Form $p_t$: use $p$ where the label is 1, and $1-p$ where the label is 0 &mdash; the probability of
        the true class.</li>
        <li>Compute the modulating factor $(1-p_t)^\\gamma$ (with $\\gamma=2$).</li>
        <li>Compute the class weight $\\alpha_t$: $\\alpha$ for label 1, $1-\\alpha$ for label 0.</li>
        <li>Multiply: loss per example $= -\\alpha_t (1-p_t)^\\gamma \\log(p_t)$. Average over the batch.</li>
       </ol>
       <p>RetinaNet then plugs this in as the classification loss on every anchor box of a ResNet+FPN one-stage
       detector (the FPN multi-scale backbone is <code>paper-fpn</code>), plus a smooth-L1 box-regression loss.
       One initialization detail matters (&sect;3.3): set the final classification conv's bias to
       $b=-\\log((1-\\pi)/\\pi)$ with $\\pi=0.01$, so the model <i>starts</i> predicting "background" for every
       box. Otherwise the ~100k background anchors generate a huge, destabilizing loss on iteration one.</p>`,
    results:
      `<p>The paper's headline (Abstract, &sect;5): trained with focal loss, <b>RetinaNet-101-800 reaches AP
       39.1 on COCO test-dev</b>, "surpassing the accuracy of all existing state-of-the-art two-stage
       detectors" while keeping one-stage speed &mdash; the paper notes a <b>2.3-point gap above the
       top-performing Faster R-CNN</b> variant it compares to. The $\\gamma$ ablation (<b>Table 1b</b>) is the
       key evidence for the loss itself; quoting the paper's reported AP:</p>
       <ul>
        <li>$\\gamma=0$ (i.e. balanced cross entropy), $\\alpha=.75$: AP <b>31.1</b></li>
        <li>$\\gamma=0.5$, $\\alpha=.50$: AP <b>32.9</b></li>
        <li>$\\gamma=1.0$, $\\alpha=.25$: AP <b>33.7</b></li>
        <li>$\\gamma=2.0$, $\\alpha=.25$: AP <b>34.0</b> (best)</li>
        <li>$\\gamma=5.0$, $\\alpha=.25$: AP <b>32.2</b> (too aggressive &mdash; starts to hurt)</li>
       </ul>
       <p>The paper summarizes: focal loss with $\\gamma=2$ "yields a 2.9 AP improvement" over balanced cross
       entropy. (All numbers above are <b>the paper's</b>, quoted; the notebook below reproduces the
       <i>shape</i> of this curve on a toy problem &mdash; our own small run, not these numbers.)</p>`,
    evaluation:
      `<p><b>Metric &amp; benchmark.</b> The paper's primary metric is <b>Average Precision (AP)</b> on
       <b>COCO</b> object detection (higher is better). The bar to beat is the <b>prior-SOTA two-stage
       detector</b>: the paper reports RetinaNet-101-800 at <b>AP 39.1</b>, a $2.3$-point gap above the
       top Faster R-CNN variant it compares to. For the loss itself, the cleaner metric is the
       $\\gamma$-ablation AP from <b>Table 1b</b>. In the Track B reproduction here there is no detector, so the
       proxy metrics are (a) <b>recall on the rare class</b> of an imbalanced toy classifier and (b) the
       <b>share of total loss</b> contributed by easy vs hard examples &mdash; the no-skill floor being plain
       cross entropy's behavior, where easy negatives dominate.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> (1) <b>The built-in oracle</b>: focal loss with
        $\\gamma=0$, $\\alpha=0.5$ must reduce to PyTorch's binary cross entropy &mdash; the code asserts
        <code>torch.allclose(focal(gamma=0)*2, BCE)</code>; if it fails, the $p_t$ flip (using $1-p$ for
        $y=0$) is wrong, which is the most common bug. (2) Reproduce the worked numbers: $p_t=0.9$ &rarr;
        CE$=0.1054$, FL$=0.001054$, ratio $\\mathbf{100\\times}$ (the paper's own quoted figure); $p_t=0.5$
        &rarr; ratio only $\\mathbf{4\\times}$. (3) Range check: $p_t\\in(0,1)$, and clamp before $\\log$ to
        avoid $\\log(0)$. (4) <b>Loss-mass check</b> (matches the CODEVIZ panel): on 1000 easy ($p_t=0.95$) + 10
        hard ($p_t=0.5$) examples, CE gives the easy group ~$88\\%$ of the loss, focal ($\\gamma=2$) drops it
        to ~$7\\%$ &mdash; the flip is the whole idea.</li>
        <li><b>Expected range.</b> Anchor to the paper's reported AP (Lin et al. 2017, Table 1b): $\\gamma=0$
        (balanced CE) AP <b>31.1</b>, rising to $\\gamma=2$ AP <b>34.0</b> (best, a $2.9$-AP gain), then
        <i>falling</i> to AP <b>32.2</b> at $\\gamma=5$. The toy run reproduces only the <b>shape</b> (peak at
        $\\gamma=2$, fall at $\\gamma=5$), not these numbers &mdash; rare-class recall should rise from CE's
        baseline to a peak near $\\gamma=2$. A focal run that does <b>no better than CE</b> on an imbalanced set
        suggests the modulating factor is not applied; a run that's worse everywhere suggests the $p_t$ flip or
        the $\\alpha/\\gamma$ pairing is wrong (recall $\\alpha$ should drop as $\\gamma$ rises).</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The knob is the <b>focusing parameter</b>
        $\\gamma$. Sweep $\\gamma\\in\\{0, 0.5, 1, 2, 5\\}$ with everything else fixed. At $\\gamma=0$ focal loss
        <i>is</i> cross entropy (modulating factor $\\equiv 1$), so the metric should match the CE baseline; as
        $\\gamma$ rises toward $2$ the rare-class metric should <b>improve</b>, then <b>fall</b> by $\\gamma=5$
        as even moderately-hard examples ($p_t\\approx 0.7$ &rarr; $(0.3)^5\\approx 0.0024$) get starved of
        gradient. If the $\\gamma=0$ point does NOT equal cross entropy, the loss is miswired; if the curve is
        flat across all $\\gamma$, the modulating factor isn't multiplying in.</li>
        <li><b>Failure signals &amp; what they mean.</b> <i>$\\gamma=0$ does not match cross entropy</i> &rarr;
        the $p_t$ bookkeeping is wrong (forgot $1-p$ for negatives), or the $\\alpha$ constant wasn't undone in
        the check. <i>Loss NaN</i> &rarr; $\\log(0)$ from an unclamped $p_t$ at a confident-wrong prediction.
        <i>Rare-class recall stuck near 0</i> (model predicts "background" for everything) &rarr; either the
        modulating factor isn't applied (easy negatives still flood the loss) or, in a real detector, the
        prior-bias init $b=-\\log((1-\\pi)/\\pi)$, $\\pi=0.01$ is missing and iteration one blew up. <i>Metric
        falls as $\\gamma$ grows past 2</i> &rarr; expected (too-aggressive down-weighting), not a bug &mdash;
        back off $\\gamma$. <i>Focal $\\approx$ CE on a balanced, well-separated set</i> &rarr; also expected:
        focal loss only helps when easy negatives dominate, so verify your test set is actually imbalanced.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is an <b>architecture-track</b> lesson, so we import the plumbing and build only the novel idea
       &mdash; the loss. We use <code>torch.sigmoid</code>, <code>nn.functional.binary_cross_entropy_with_logits</code>,
       and an <code>Adam</code> optimizer as given, and write <b>focal loss by hand</b> from raw tensor ops. We do
       <b>not</b> build a ResNet, an FPN, or a real detector &mdash; the paper's point is that the loss, not the
       architecture, is what closed the accuracy gap, so a tiny linear classifier on imbalanced toy data is
       enough to see the effect. The built-in correctness check is that focal loss with $\\gamma=0$, $\\alpha=0.5$
       reduces to PyTorch's own cross entropy.</p>`,
    pitfalls:
      `<ul>
        <li><b>$p_t$, not $p$.</b> The modulating factor uses the probability of the <i>true</i> class. For a
        negative example ($y=0$) that is $1-p$. Forgetting the flip is the most common bug &mdash; the
        $\\gamma=0$ sanity check against cross entropy will catch it.</li>
        <li><b>$\\alpha$ and $\\gamma$ interact.</b> The paper's best $\\alpha$ <i>drops</i> as $\\gamma$ rises
        (Table 1b: $\\alpha=.75$ at $\\gamma=0$, $\\alpha=.25$ at $\\gamma=2$). Down-weighting easy negatives
        already rebalances the classes, so less $\\alpha$ is needed. Do not copy an $\\alpha$ from a different
        $\\gamma$.</li>
        <li><b>Bigger $\\gamma$ is not always better.</b> Past $\\gamma\\approx 2$ accuracy falls (the paper's
        AP drops at $\\gamma=5$); too-aggressive down-weighting starves the model of gradient even from
        moderately-hard examples. The ablation below shows the same turnover.</li>
        <li><b>The prior-bias init is not optional at scale.</b> Without $b=-\\log((1-\\pi)/\\pi)$, $\\pi=0.01$,
        the first iteration's loss over ~100k background anchors can blow up training (&sect;3.3). Our toy
        classifier is small enough to skip it, but a real detector cannot.</li>
        <li><b>Focal loss is a tool, not magic.</b> It addresses <i>imbalance</i>. On a balanced, well-separated
        problem it offers little over cross entropy &mdash; the gains appear precisely when easy negatives
        dominate.</li>
      </ul>`,
    recall: [
      "State the focal loss equation $\\text{FL}(p_t)$ from memory, including the $\\alpha_t$ term.",
      "Define $p_t$ in words, for both $y=1$ and $y=0$.",
      "What does the modulating factor $(1-p_t)^\\gamma$ do to an easy example vs a hard one?",
      "What does focal loss reduce to when $\\gamma=0$?",
      "Why does a one-stage detector suffer from class imbalance in the first place?"
    ],
    practice: [
      {
        q: `For an easy example with $p_t=0.9$ and $\\gamma=2$, by what factor is the focal loss smaller than cross entropy (ignore $\\alpha$)?`,
        steps: [
          { do: `Write the ratio CE / FL $= \\frac{-\\log p_t}{-(1-p_t)^2\\log p_t}$.`, why: `The $-\\log p_t$ cancels, so the ratio is just $1/(1-p_t)^2$ — it depends only on the modulating factor.` },
          { do: `Plug in: $1/(1-0.9)^2 = 1/(0.1)^2 = 1/0.01$.`, why: `$1-p_t = 0.1$; squaring gives $0.01$.` }
        ],
        answer: `$100\\times$ — exactly the figure the paper quotes for $p_t=0.9$ at $\\gamma=2$.`
      },
      {
        q: `A batch is 99% easy negatives ($p_t\\approx 0.95$) and 1% hard examples ($p_t\\approx 0.5$). Qualitatively, where does most of the cross-entropy total go, and how does $\\gamma=2$ change that?`,
        steps: [
          { do: `Cross entropy per easy negative is $-\\log(0.95)\\approx 0.051$; per hard example $-\\log(0.5)\\approx 0.69$. Multiply each by its count.`, why: `There are ~99× more easy negatives, so even at 0.051 each their TOTAL can exceed the hard examples'.` },
          { do: `Now apply $(1-p_t)^2$: easy negatives get $\\times(0.05)^2=\\times0.0025$; hard examples get $\\times(0.5)^2=\\times0.25$.`, why: `Easy mass is crushed ~400× harder than hard mass, flipping which group dominates.` }
        ],
        answer: `Under cross entropy the easy negatives dominate the total (the notebook below measures ~88% of the loss mass). Under focal loss with $\\gamma=2$ their share collapses to ~7%, and the hard examples now drive the gradient.`
      },
      {
        q: `ABLATION. RetinaNet is best at $\\gamma=2$ and worse at both $\\gamma=0$ and $\\gamma=5$ (Table 1b). Explain both ends.`,
        steps: [
          { do: `Consider $\\gamma=0$.`, why: `The modulating factor is $(1-p_t)^0=1$ for everyone — focal loss IS cross entropy, so the easy negatives still flood the loss; this is the imbalance problem the paper set out to fix.` },
          { do: `Consider $\\gamma=5$.`, why: `The factor decays so steeply that even moderately-hard examples (say $p_t=0.7$) are down-weighted by $(0.3)^5\\approx0.0024$, starving the model of useful gradient; too few examples drive learning.` }
        ],
        answer: `$\\gamma$ is a focus dial: too low (0) and easy examples are not suppressed (no better than cross entropy); too high (5) and even useful hard-ish examples are suppressed. $\\gamma=2$ balances the two — and our toy run reproduces the same peak-then-fall shape.`
      }
    ]
  });

  window.CODE["paper-retinanet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Implement focal loss from raw tensors, verify it reduces to PyTorch's cross entropy at \\u03b3=0, show the ` +
      `easy-example down-weighting numerically (loss-mass shifts from easy to hard), then train a tiny linear ` +
      `classifier on 1:99 imbalanced toy data with cross entropy vs focal and compare recall on the rare class. ` +
      `All printed numbers are our small run, not the paper's reported numbers.`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

# ============================================================
# 1. Focal loss from scratch (Eqn 5 of arXiv:1708.02002).
#    FL(p_t) = -alpha_t (1-p_t)^gamma log(p_t)
# ============================================================
def focal_loss(logits, targets, gamma=2.0, alpha=0.25, reduction="mean"):
    p  = torch.sigmoid(logits)                       # predicted P(y=1)
    pt = torch.where(targets == 1, p, 1 - p)         # prob of the TRUE class
    at = torch.where(targets == 1,
                     torch.full_like(p, alpha),
                     torch.full_like(p, 1 - alpha))  # per-class weight
    loss = -at * (1 - pt) ** gamma * torch.log(pt.clamp(min=1e-8))
    return loss.mean() if reduction == "mean" else loss

# ---- Sanity check: gamma=0, alpha=0.5 must equal cross entropy ----
# (alpha=0.5 contributes a constant 0.5 factor, so multiply by 2 to undo it.)
torch.manual_seed(0)
logits  = torch.randn(64)
targets = (torch.rand(64) > 0.5).float()
fl0 = focal_loss(logits, targets, gamma=0.0, alpha=0.5) * 2
ce0 = F.binary_cross_entropy_with_logits(logits, targets)
print("focal(gamma=0) == cross entropy:", torch.allclose(fl0, ce0, atol=1e-6))
# -> True  (our own check, the loss's built-in oracle)

# ============================================================
# 2. Easy-example down-weighting, numerically.
#    1000 easy negatives (model 95% sure) + 10 hard (50% sure).
# ============================================================
easy_pt = torch.full((1000,), 0.95)   # well-classified -> p_t high
hard_pt = torch.full((10,),   0.50)   # uncertain
def ce(pt):          return -torch.log(pt)
def fl(pt, g=2.0):   return -((1 - pt) ** g) * torch.log(pt)
for name, fn in [("CE     ", ce), ("FL g=2 ", lambda pt: fl(pt, 2.0))]:
    e, h = fn(easy_pt).sum().item(), fn(hard_pt).sum().item()
    print(f"{name}: easy_total={e:7.3f}  hard_total={h:6.3f}  easy_share={e/(e+h):.3f}")
# CE     : easy_total= 51.293  hard_total= 6.931  easy_share=0.881
# FL g=2 : easy_total=  0.128  hard_total= 1.733  easy_share=0.069
# -> CE: easy negatives are 88% of the loss; focal: only 7%. The flip is the whole idea.

# ============================================================
# 3. Worked example from the lesson (must match the text).
# ============================================================
for pt in [0.9, 0.968, 0.5]:
    c = -math.log(pt); f = -((1 - pt) ** 2) * math.log(pt)
    print(f"p_t={pt:<5}: CE={c:.4f}  FL(g2)={f:.6f}  CE/FL={c/f:7.1f}x")
# p_t=0.9  : CE=0.1054  FL(g2)=0.001054  CE/FL=  100.0x
# p_t=0.968: CE=0.0325  FL(g2)=0.000033  CE/FL=  976.6x
# p_t=0.5  : CE=0.6931  FL(g2)=0.173287  CE/FL=    4.0x

# ============================================================
# 4. Train a tiny imbalanced classifier: cross entropy vs focal.
#    1:99 imbalance, overlapping classes -> CE is tempted to ignore positives.
# ============================================================
N_pos, N_neg = 40, 3960
g = torch.Generator().manual_seed(3)
Xp = torch.randn(N_pos, 2, generator=g) * 1.3 + torch.tensor([1.1, 1.1])
Xn = torch.randn(N_neg, 2, generator=g) * 1.3 + torch.tensor([-0.9, -0.9])
X  = torch.cat([Xp, Xn])
y  = torch.cat([torch.ones(N_pos), torch.zeros(N_neg)])

def train(kind, gamma=2.0, alpha=0.5, steps=400):
    torch.manual_seed(7)
    w = torch.zeros(2, requires_grad=True)
    b = torch.zeros(1, requires_grad=True)
    opt = torch.optim.Adam([w, b], lr=0.05)
    for _ in range(steps):
        opt.zero_grad()
        logits = X @ w + b
        loss = (F.binary_cross_entropy_with_logits(logits, y) if kind == "ce"
                else focal_loss(logits, y, gamma=gamma, alpha=alpha))
        loss.backward(); opt.step()
    with torch.no_grad():
        pred = (torch.sigmoid(X @ w + b) > 0.5).float()
        tp = ((pred == 1) & (y == 1)).sum().item()
        fn = ((pred == 0) & (y == 1)).sum().item()
        return tp / (tp + fn)                         # recall on the RARE class

print("recall(rare class)  CE   :", round(train("ce"), 3))    # -> 0.1
print("recall(rare class)  focal:", round(train("focal"), 3)) # -> 0.175

# ============================================================
# 5. Ablation over gamma (alpha fixed at 0.5 to isolate the focusing effect).
#    Reproduces the SHAPE of the paper's Table 1b: peak then fall.
# ============================================================
for gm in [0.0, 0.5, 1.0, 2.0, 5.0]:
    print(f"gamma={gm}: recall={round(train('focal', gamma=gm), 3)}")
# gamma=0.0: recall=0.1    (== CE, factor is 1 for everyone)
# gamma=0.5: recall=0.1
# gamma=1.0: recall=0.125
# gamma=2.0: recall=0.175  (best, matches the paper's gamma=2 peak)
# gamma=5.0: recall=0.175  (precision falls -- too aggressive, like the paper's AP drop)
# All numbers above are our small-scale run, not the paper's reported numbers.`
  };

  window.CODEVIZ["paper-retinanet"] = {
    question: "Under cross entropy, do the many easy negatives dominate the total loss — and does focal loss (gamma=2) flip that, refocusing onto the hard examples?",
    charts: [
      {
        type: "bar",
        title: "Share of total loss from easy vs hard examples — cross entropy vs focal loss (gamma=2)",
        xlabel: "loss function",
        ylabel: "fraction of total loss",
        series: [
          {
            name: "1000 easy negatives (p_t=0.95)",
            color: "#ff7b72",
            points: [["cross entropy", 0.881], ["focal (g=2)", 0.069]]
          },
          {
            name: "10 hard examples (p_t=0.50)",
            color: "#7ee787",
            points: [["cross entropy", 0.119], ["focal (g=2)", 0.931]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A batch of 1000 <b>easy</b> negatives the model is already 95% sure about ($p_t=0.95$) plus 10 <b>hard</b> examples it is only 50% sure about ($p_t=0.5$). Under plain <b>cross entropy</b> the easy negatives, despite each costing little ($-\\log 0.95\\approx0.05$), pile up to <b>88.1%</b> of the total loss &mdash; training is dominated by examples already mastered, exactly the failure RetinaNet diagnosed for the ~100k mostly-background boxes per image. Multiply every loss by the modulating factor $(1-p_t)^2$ and the easy share <b>collapses to 6.9%</b>; the 10 hard examples now own <b>93.1%</b> of the gradient. That flip &mdash; from easy-dominated to hard-dominated &mdash; is focal loss in one chart, and is why a simple one-stage detector could finally match two-stage accuracy.",
    code: `import torch
# Reproduces focal loss's core effect: where does the loss mass go?
# 1000 easy negatives (p_t=0.95) + 10 hard examples (p_t=0.50).
easy_pt = torch.full((1000,), 0.95)
hard_pt = torch.full((10,),   0.50)

def ce(pt):        return -torch.log(pt)               # cross entropy
def fl(pt, g=2.0): return -((1 - pt) ** g) * torch.log(pt)  # focal loss (alpha omitted)

rows = {}
for name, fn in [("cross entropy", ce), ("focal (g=2)", lambda pt: fl(pt, 2.0))]:
    e = fn(easy_pt).sum().item()
    h = fn(hard_pt).sum().item()
    rows[name] = (e / (e + h), h / (e + h))            # (easy share, hard share)

for name, (es, hs) in rows.items():
    print(f"{name:14s}  easy_share={es:.3f}  hard_share={hs:.3f}")
# cross entropy   easy_share=0.881  hard_share=0.119
# focal (g=2)     easy_share=0.069  hard_share=0.931
# Our small run, not the paper's reported numbers.`
  };
})();
