/* Paper lesson — "Fast R-CNN", Ross Girshick 2015.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-fast-rcnn".
   GROUNDED from arXiv:1504.08083 (abstract) and the ar5iv HTML mirror
   (Section 2.1 RoI pooling; Section 2.3 multi-task loss, Eqns 1-3; Section 5.1 ablation).
   Track B (architecture): build the RoI-pooling layer + the multi-task (classification +
   smooth-L1 bbox) head by hand on toy tensors, verify RoI pooling against
   torchvision.ops.roi_pool, and ablate single-task vs multi-task. Cross-links paper-rcnn
   (shares conv computation; RoI pooling replaces the per-region forward pass). */
(function () {
  window.LESSONS.push({
    id: "paper-fast-rcnn",
    title: "Fast R-CNN — Fast Region-based Convolutional Network (2015)",
    tagline: "Run the convolutions ONCE for the whole image, then pool each region from the shared feature map and train classifier + box regressor together in one pass.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Ross Girshick",
      org: "Microsoft Research",
      year: 2015,
      venue: "arXiv:1504.08083 (Apr 2015); ICCV 2015",
      citations: "",
      arxiv: "https://arxiv.org/abs/1504.08083",
      code: "https://github.com/rbgirshick/fast-rcnn"
    },
    conceptLink: "dl-object-detection",
    partOf: [],
    prereqs: ["dl-object-detection", "dl-pooling", "dl-cross-entropy", "paper-alexnet"],

    // WHY READ IT
    problem:
      `<p>The previous paper, <b>R-CNN</b> (Region-based Convolutional Neural Network), worked but was
       painfully slow. It took a set of ~2000 candidate boxes (<b>region proposals</b> &mdash; rectangles in
       the image that <i>might</i> contain an object, produced by an external algorithm), <b>cropped each one
       out of the image, resized it, and ran the whole Convolutional Neural Network (CNN) on it
       separately</b>. Two thousand near-identical forward passes per image &mdash; the convolutions over the
       overlapping crops are recomputed again and again.</p>
       <p>R-CNN was also <b>not a single model</b>. It trained in stages: fine-tune the CNN, then train
       separate Support Vector Machines (SVMs) for classification, then train box regressors &mdash; and the
       CNN features had to be written to disk in between. The paper sums up the cost:</p>
       <blockquote>"Fast R-CNN trains the very deep VGG16 network 9&times; faster than R-CNN, is 213&times;
       faster at test-time" (Abstract). The slowness came from "computation is not shared" across proposals
       and from a "multi-stage pipeline" (&sect;1).</blockquote>`,
    contribution:
      `<ul>
        <li><b>One shared convolutional pass per image.</b> Run the CNN over the <i>whole</i> image
        <b>once</b> to get a single feature map. Every region proposal then reads its features <i>from that
        shared map</i> &mdash; the expensive convolutions are computed once and reused, not 2000 times.</li>
        <li><b>The RoI (Region of Interest) pooling layer.</b> A new layer that takes a region's rectangle
        on the feature map &mdash; any height and width &mdash; and pools it down to a <b>fixed</b>
        $H\\times W$ grid (e.g. $7\\times7$), so a fully-connected head can accept regions of any size.</li>
        <li><b>One network, one loss.</b> Classification and bounding-box regression are two heads on the
        same network, trained <b>jointly</b> with a single <b>multi-task loss</b> in one stage &mdash;
        no SVMs, no disk caches, no separate regressor training.</li>
      </ul>`,
    whyItMattered:
      `<p>Sharing the convolution and folding everything into one trainable network became the template for
       modern detectors. The very next paper, <b>Faster R-CNN</b>, replaced the external proposal algorithm
       with a learned <b>Region Proposal Network</b> bolted onto the same shared feature map &mdash; making the
       whole detector end-to-end. RoI pooling (and its successor RoI Align in <b>Mask R-CNN</b>) and the
       <b>smooth-L1</b> box loss introduced here are still standard parts in two-stage detectors today.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; why R-CNN is slow ("computation is not shared", multi-stage
        training). This is the whole motivation.</li>
        <li><b>&sect;2.1 (The RoI pooling layer)</b> &mdash; the one-paragraph definition of how an
        $h\\times w$ region is pooled into a fixed $H\\times W$ grid. You will implement exactly this.</li>
        <li><b>&sect;2.3 (Multi-task loss)</b> &mdash; Equations 1, 2, 3: the combined loss, the box loss, and
        the smooth-L1 function. These are the equations you transcribe and code.</li>
        <li><b>Fig. 1</b> &mdash; the architecture: image &rarr; conv feature map &rarr; per-RoI pooling
        &rarr; fully-connected layers &rarr; two sibling heads (softmax class + box regressor).</li>
        <li><b>&sect;5.1 ("Does multi-task training help?")</b> &mdash; the ablation you will reproduce.</li>
       </ul>
       <p><b>Skim:</b> &sect;3-4 (truncated SVD for speed, the detailed VOC tables) and the timing tables
       unless you want the exact mAP numbers. The core ideas are two short subsections: &sect;2.1 and
       &sect;2.3.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train the same small detection head <b>two</b> ways: (a) <b>multi-task</b> &mdash;
       classification loss <i>and</i> the smooth-L1 box loss together; (b) <b>single-task</b> &mdash;
       classification loss only (box head still present but its loss is switched off). When you then measure
       <i>classification</i> accuracy, do you expect multi-task training to make the classifier <b>better</b>,
       <b>worse</b>, or <b>unchanged</b> vs training classification alone? Write your guess and one sentence of
       reasoning, then run the ablation below.</p>
       <p>(Hint: the paper&rsquo;s &sect;5.1 is titled "Does multi-task training help?")</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>roi_pool(fmap, roi, H, W)</code>: split the RoI&rsquo;s $h\\times w$ rectangle into an
        $H\\times W$ grid of sub-windows of size $\\approx h/H \\times w/W$. TODO: for each grid cell, take the
        <b>max</b> over its sub-window. Return the $H\\times W$ output (per channel).</li>
        <li><code>smooth_l1(x)</code>: TODO &mdash; return $0.5x^2$ when $|x|\\lt 1$, else $|x|-0.5$.</li>
        <li><code>multitask_loss</code>: TODO &mdash; $L_\\text{cls} + \\lambda\\,[u\\ge 1]\\,L_\\text{loc}$.
        Switch the box term off for the single-task ablation by setting $\\lambda=0$.</li>
       </ul>
       <p>Then train both versions on toy regions and predict which classifier ends up more accurate.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>The big move: share the convolution.</b> Instead of cropping 2000 region proposals out of the
       image and running the CNN on each, Fast R-CNN runs the convolutional layers over the <i>whole image
       once</i>, producing a single <b>feature map</b> (a stack of channels, each a small grid summarizing the
       image). Each region proposal is just a rectangle; we project it onto this feature map and read its
       features from there. The heavy convolution happens <b>once</b> and is reused by every region.</p>
       <p><b>The problem that creates, and RoI pooling&rsquo;s fix.</b> Region proposals come in all shapes
       and sizes, so each one maps to a feature-map rectangle of a different height $h$ and width $w$. But the
       fully-connected classification layers downstream need a <b>fixed-size</b> input. The <b>RoI pooling
       layer</b> (&sect;2.1) bridges this. The paper states it plainly:</p>
       <blockquote>"RoI max pooling works by dividing the $h\\times w$ RoI window into an $H\\times W$ grid of
       sub-windows of approximate size $h/H\\times w/W$ and then max-pooling the values in each sub-window into
       the corresponding output grid cell." (&sect;2.1)</blockquote>
       <p>So a region of any size becomes a fixed $H\\times W$ output (e.g. $7\\times7$). It is just max-pooling,
       but with the <i>window size adapted per region</i> so the output grid is always the same shape. It is
       done independently for each feature channel.</p>
       <p><b>Two heads, one loss.</b> The fixed-size pooled features flow through a couple of fully-connected
       layers, then split into two <b>sibling output heads</b>: (1) a <b>softmax</b> over $K+1$ classes (the
       $K$ object classes plus a "background" class), giving a probability vector $p$; and (2) a
       <b>bounding-box regressor</b> that outputs four numbers $t^u=(t_x,t_y,t_w,t_h)$ per class &mdash; small
       corrections that nudge the proposal box to fit the object better. Both heads are trained at once by a
       single <b>multi-task loss</b> (&sect;2.3) that adds the classification log-loss and the box-regression
       loss.</p>
       <p><b>The box loss uses smooth-L1, not squared error.</b> For regression the paper uses a
       <b>smooth-L1</b> function: it behaves like squared error ($\\tfrac12 x^2$) for small errors but like
       absolute error ($|x|-\\tfrac12$) once the error grows past 1. The paper calls it "a robust $L_1$ loss
       that is less sensitive to outliers than the $L_2$ loss used in R-CNN and SPPnet" and notes that with
       plain $L_2$, "training &hellip; can require careful tuning of learning rates in order to prevent
       exploding gradients" (&sect;2.3).</p>`,
    architecture:
      `<p>Fast R-CNN is a <b>single-stage network</b> (Fig. 1). Data flows top to bottom; the convolutional
       trunk runs <b>once per image</b> and every RoI branches off the shared feature map.</p>
       <ol>
        <li><b>Input.</b> One whole image, plus a set of <b>object proposals</b> (RoIs) from an external
        algorithm (e.g. Selective Search) &mdash; given, not learned in this paper.</li>
        <li><b>Convolutional backbone (shared, run once).</b> Several conv + max-pool layers (e.g. VGG16&rsquo;s
        13 conv layers) map the $H_\\text{img}\\times W_\\text{img}\\times3$ image to one <b>conv feature map</b>
        of shape $H_f\\times W_f\\times C$ (for VGG16, $C=512$, downsampled by a stride of 16).</li>
        <li><b>RoI projection.</b> Each proposal box is scaled by the backbone stride onto the feature map,
        becoming an $h\\times w$ rectangle of feature cells (different $h,w$ per RoI).</li>
        <li><b>RoI pooling layer (&sect;2.1).</b> Each $h\\times w$ RoI is max-pooled into a <b>fixed</b>
        $H\\times W$ grid (VGG16 uses $7\\times7$), independently per channel &rarr; an $H\\times W\\times C$
        tensor of identical shape for every RoI.</li>
        <li><b>Fully-connected layers (shared head).</b> Flatten to $H\\,W\\,C$ and pass through two FC layers
        (VGG16: two $4096$-wide FCs, each + ReLU) &rarr; the per-RoI feature vector $\\phi$.</li>
        <li><b>Two sibling output heads</b> (both read $\\phi$):
          <ul>
            <li><b>Classification head:</b> FC $\\to$ <b>softmax</b> over $K{+}1$ classes &rarr; $p\\in\\mathbb{R}^{K+1}$.</li>
            <li><b>Bounding-box regression head:</b> FC $\\to$ $4K$ outputs &rarr; per-class offsets
            $t^u=(t_x,t_y,t_w,t_h)$.</li>
          </ul>
        </li>
       </ol>
       <p><b>Training</b> backpropagates the single multi-task loss (Eqn. 1) through both heads, the FC layers,
       <i>and</i> the conv backbone end-to-end &mdash; one network, one stage, no SVMs or disk caches. (For
       test-time speed &sect;3 optionally compresses the big FC layers with <b>truncated SVD</b>, factoring an
       FC weight matrix into two smaller ones; this is an inference optimization, not part of the model
       definition.)</p>`,
    symbols: [
      { sym: "$p = (p_0,\\dots,p_K)$", desc: "the <b>softmax probability vector</b> over $K+1$ classes the classifier head outputs for a region ($K$ object classes plus class $0$ = background). $p_u$ is the probability assigned to the true class $u$." },
      { sym: "$u$", desc: "the <b>true class label</b> of the region (an integer). By convention $u=0$ is the catch-all <b>background</b> class; $u\\ge 1$ means a real object." },
      { sym: "$t^u = (t_x,t_y,t_w,t_h)$", desc: "the <b>predicted bounding-box regression offsets</b> for class $u$: scale-invariant shifts of the box center ($t_x,t_y$) and log-space adjustments of width/height ($t_w,t_h$)." },
      { sym: "$v = (v_x,v_y,v_w,v_h)$", desc: "the <b>ground-truth regression targets</b> for class $u$ &mdash; the four numbers the box regressor should predict (normalized to zero mean, unit variance in the paper)." },
      { sym: "$L_\\text{cls}(p,u)$", desc: "the <b>classification loss</b>: the log loss for the true class, $L_\\text{cls} = -\\log p_u$. (This is the cross-entropy of a one-hot label.)" },
      { sym: "$L_\\text{loc}(t^u,v)$", desc: "the <b>localization (box-regression) loss</b>: the sum of smooth-L1 over the four coordinates, $\\sum_{i\\in\\{x,y,w,h\\}}\\text{smooth}_{L_1}(t^u_i - v_i)$ (Eqn. 2)." },
      { sym: "$\\lambda$", desc: "the <b>balancing weight</b> between the two losses. The paper uses $\\lambda=1$ in all experiments (after normalizing the targets $v$)." },
      { sym: "$[u\\ge 1]$", desc: "the <b>Iverson bracket</b>: equals $1$ when $u\\ge 1$ (a real object) and $0$ when $u=0$ (background). It <b>switches off the box loss for background regions</b>, which have no ground-truth box." },
      { sym: "$\\text{smooth}_{L_1}(x)$", desc: "the <b>smooth-L1 / Huber-like</b> function: $0.5x^2$ if $|x|\\lt 1$, else $|x|-0.5$ (Eqn. 3). Quadratic near $0$, linear in the tails." },
      { sym: "$h\\times w$ / $H\\times W$", desc: "the RoI&rsquo;s rectangle size on the feature map ($h$ rows, $w$ cols) and the <b>fixed pooled output</b> size ($H$ rows, $W$ cols, e.g. $7\\times7$)." },
      { sym: "$x_{c,r,s}$ / $y_{c,i,j}$", desc: "in the RoI-pool formula: $x_{c,r,s}$ is the feature-map value at channel $c$, row $r$, col $s$ (inside the RoI); $y_{c,i,j}$ is the pooled output at channel $c$, output-grid cell $(i,j)$." },
      { sym: "$\\text{bin}(i,j)$", desc: "the half-open sub-window of feature-map cells that output cell $(i,j)$ maxes over &mdash; rows $[\\lfloor i\\,h/H\\rfloor,\\lfloor(i{+}1)h/H\\rfloor)$, cols $[\\lfloor j\\,w/W\\rfloor,\\lfloor(j{+}1)w/W\\rfloor)$ (the $\\lfloor\\cdot\\rfloor$ floor is the coordinate quantization)." },
      { sym: "$\\phi$", desc: "the <b>fully-connected feature vector</b> for a RoI: the flattened $H\\times W$ pooled features after the shared fully-connected layers. Both sibling heads read from $\\phi$." },
      { sym: "$W_\\text{cls},b_\\text{cls}$ / $W_\\text{box}^{u},b_\\text{box}^{u}$", desc: "the <b>weights and biases</b> of the two sibling heads: the classifier ($W_\\text{cls}\\in\\mathbb{R}^{(K+1)\\times\\dim\\phi}$) and the per-class box regressor ($W_\\text{box}^{u}\\in\\mathbb{R}^{4\\times\\dim\\phi}$, a separate $4{\\times}\\dim\\phi$ block for each object class $u$)." },
      { sym: "$K$ / $K+1$", desc: "$K$ = number of <b>object classes</b>; $K{+}1$ adds the background class, so the softmax is over $K{+}1$ outputs and the regressor has $4K$ outputs (four per object class)." },
      { sym: "“RoI”", desc: "a plain term: <b>Region of Interest</b> &mdash; one candidate box (region proposal) projected onto the shared feature map." }
    ],
    formula: `$$ y_{c,i,j} \\;=\\; \\max_{(r,s)\\,\\in\\,\\text{bin}(i,j)} x_{c,r,s}, \\qquad \\text{bin}(i,j)=\\Big[\\big\\lfloor i\\tfrac{h}{H}\\big\\rfloor,\\big\\lfloor (i{+}1)\\tfrac{h}{H}\\big\\rfloor\\Big)\\times\\Big[\\big\\lfloor j\\tfrac{w}{W}\\big\\rfloor,\\big\\lfloor (j{+}1)\\tfrac{w}{W}\\big\\rfloor\\Big) $$
<p class="cap">RoI max pooling (&sect;2.1): each output cell $(i,j)$ of the fixed $H\\times W$ grid is the max over its sub-window of size $\\approx h/H\\times w/W$ inside the $h\\times w$ RoI, done independently per channel $c$.</p>
$$ p \\;=\\; \\operatorname{softmax}(W_\\text{cls}\\,\\phi + b_\\text{cls}) \\in \\mathbb{R}^{K+1}, \\qquad t^u \\;=\\; W_\\text{box}^{u}\\,\\phi + b_\\text{box}^{u} \\;=\\; (t^u_x,t^u_y,t^u_w,t^u_h) $$
<p class="cap">The two sibling heads (&sect;2): a softmax classifier over $K{+}1$ classes and a per-class bounding-box regressor (four numbers for each of the $K$ object classes), both fed the same fully-connected feature $\\phi$.</p>
$$ L(p,u,t^u,v) \\;=\\; L_\\text{cls}(p,u) \\;+\\; \\lambda\\,[u\\ge 1]\\,L_\\text{loc}(t^u,v) \\qquad\\text{(Eqn. 1, } L_\\text{cls}(p,u)=-\\log p_u\\text{)} $$
<p class="cap">The multi-task loss (Eqn. 1): classification log-loss plus, for non-background RoIs only, the box-regression loss weighted by $\\lambda$.</p>
$$ L_\\text{loc}(t^u,v) = \\!\\!\\sum_{i\\in\\{x,y,w,h\\}}\\!\\!\\text{smooth}_{L_1}(t^u_i - v_i) \\;\\;\\text{(Eqn. 2)}, \\qquad \\text{smooth}_{L_1}(x)=\\begin{cases}0.5\\,x^2 & |x|\\lt 1\\\\[2pt]|x|-0.5 & \\text{otherwise}\\end{cases}\\;\\;\\text{(Eqn. 3)} $$
<p class="cap">The localization loss (Eqn. 2) sums smooth-L1 (Eqn. 3) over the four box coordinates; smooth-L1 is quadratic for $|x|\\lt 1$ and linear beyond, capping the gradient at $\\pm1$.</p>`,
    whatItDoes:
      `<p><b>Equation 1</b> is the heart of the paper: one loss for the whole detector. Add the
       <b>classification</b> log-loss $L_\\text{cls}(p,u)=-\\log p_u$ (penalizes giving the true class a low
       probability) to the <b>box-regression</b> loss $L_\\text{loc}$, weighted by $\\lambda$. The Iverson
       bracket $[u\\ge 1]$ multiplies the box term by $0$ for background regions ($u=0$) &mdash; background has
       no object box to fit, so it contributes only classification loss.</p>
       <p><b>Equation 2</b> spells out the box loss: run each of the four coordinate errors $t^u_i - v_i$
       through <b>smooth-L1</b> and sum. <b>Equation 3</b> is smooth-L1 itself: it is a parabola
       ($\\tfrac12 x^2$) for small errors so the gradient shrinks gently near the target, but switches to a
       straight line ($|x|-\\tfrac12$) for large errors so a single badly-off coordinate cannot blow up the
       gradient. That bounded tail is what stops the "exploding gradients" R-CNN&rsquo;s $L_2$ box loss
       suffered.</p>`,
    derivation:
      `<p><b>Why smooth-L1 and not squared error?</b> Compare the two box-loss choices coordinate-by-coordinate.
       Plain squared error $\\tfrac12 x^2$ has derivative $x$: an outlier with $x=10$ pushes a gradient of
       $10$, ten times the gradient of a typical small error &mdash; one wild coordinate dominates the update
       and can make training diverge. Smooth-L1 fixes the tail. Differentiate Eqn. 3:</p>
       <p>$$ \\frac{d}{dx}\\,\\text{smooth}_{L_1}(x) = \\begin{cases} x & |x|\\lt 1 \\\\ \\operatorname{sign}(x) & \\text{otherwise.}\\end{cases} $$</p>
       <p>For small errors ($|x|\\lt 1$) the gradient is $x$ &mdash; it shrinks toward $0$ as you near the
       target, just like squared error, giving a gentle final approach. For large errors the gradient is
       capped at $\\pm 1$: an outlier of $x=10$ contributes a gradient of magnitude $1$, not $10$. So no single
       far-off coordinate can dominate &mdash; this is exactly the robustness the paper means by "less
       sensitive to outliers." The function is also <b>continuous and has a continuous first derivative</b> at
       the join $|x|=1$ (both pieces give value $0.5$ and slope $\\pm1$ there), so it is smooth to optimize.</p>
       <p>The classification term $L_\\text{cls}=-\\log p_u$ is ordinary cross-entropy &mdash; its full
       derivation (softmax + negative log-likelihood) lives in the <b>dl-cross-entropy</b> concept lesson; we
       reuse it here rather than re-deriving.</p>`,
    example:
      `<p>Two short worked computations &mdash; both are recomputed in the notebook so you can check them.</p>
       <p><b>(A) RoI pooling on a toy $4\\times4$ feature map.</b> Take the single-channel feature map</p>
       <p>$$ \\begin{bmatrix}1&3&2&4\\\\5&6&1&2\\\\7&2&8&3\\\\0&9&4&1\\end{bmatrix}. $$</p>
       <p>Let the RoI (region of interest) be the whole $4\\times4$ window ($h=4$ rows, $w=4$ cols), pooled to a
       fixed $H\\times W = 2\\times2$ grid. Each output cell covers a $2\\times2$ sub-window ($h/H = w/W = 2$); take
       the <b>max</b> (largest value) of each:</p>
       <ul class="steps">
        <li>top-left sub-window $\\begin{bmatrix}1&3\\\\5&6\\end{bmatrix}\\to \\max = 6$.</li>
        <li>top-right $\\begin{bmatrix}2&4\\\\1&2\\end{bmatrix}\\to \\max = 4$.</li>
        <li>bottom-left $\\begin{bmatrix}7&2\\\\0&9\\end{bmatrix}\\to \\max = 9$.</li>
        <li>bottom-right $\\begin{bmatrix}8&3\\\\4&1\\end{bmatrix}\\to \\max = 8$.</li>
       </ul>
       <table class="extable">
        <caption>Each output cell $(i,j)$ = max over its sub-window. Pooled output is a fixed $2\\times2$.</caption>
        <thead><tr><th>output cell</th><th>sub-window values</th><th class="num">max</th></tr></thead>
        <tbody>
          <tr><td class="row-h">$(0,0)$ top-left</td><td>$1,3,5,6$</td><td class="num">6</td></tr>
          <tr><td class="row-h">$(0,1)$ top-right</td><td>$2,4,1,2$</td><td class="num">4</td></tr>
          <tr><td class="row-h">$(1,0)$ bottom-left</td><td>$7,2,0,9$</td><td class="num">9</td></tr>
          <tr><td class="row-h">$(1,1)$ bottom-right</td><td>$8,3,4,1$</td><td class="num">8</td></tr>
        </tbody>
       </table>
       <p>Pooled output $= \\begin{bmatrix}6&4\\\\9&8\\end{bmatrix}$ &mdash; a fixed $2\\times2$, whatever the
       region&rsquo;s original size.</p>
       <p><b>(B) The multi-task loss (Eqns 1-3).</b> Suppose the true class is $u=1$ (a real object, so the switch
       $[u\\ge 1]=1$), the classifier gave it probability $p_u = 0.6$, the predicted box offsets are
       $t^u=(0.2,\\,-0.1,\\,0.5,\\,-2.0)$ and the targets are $v=(0,0,0,0)$. Use $\\lambda=1$ (the term that balances
       the two losses). Since $v=0$, each coordinate error is just $t^u_i$. Run each through
       $\\text{smooth}_{L_1}(x)=0.5x^2$ if $|x|\\lt 1$, else $|x|-0.5$:</p>
       <table class="extable">
        <caption>Box loss (Eqn. 2): smooth-L1 of each coordinate error, then summed.</caption>
        <thead><tr><th>coord</th><th class="num">error $x$</th><th class="num">branch</th><th class="num">$\\text{smooth}_{L_1}(x)$</th></tr></thead>
        <tbody>
          <tr><td class="row-h">$t_x$</td><td class="num">0.2</td><td class="num">$0.5(0.2)^2$</td><td class="num">0.020</td></tr>
          <tr><td class="row-h">$t_y$</td><td class="num">-0.1</td><td class="num">$0.5(0.1)^2$</td><td class="num">0.005</td></tr>
          <tr><td class="row-h">$t_w$</td><td class="num">0.5</td><td class="num">$0.5(0.5)^2$</td><td class="num">0.125</td></tr>
          <tr><td class="row-h">$t_h$</td><td class="num">-2.0</td><td class="num">$|{-}2|-0.5$</td><td class="num">1.500</td></tr>
          <tr><td class="row-h"><b>$L_\\text{loc}$ total</b></td><td class="num"></td><td class="num"></td><td class="num"><b>1.650</b></td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Classification:</b> $L_\\text{cls} = -\\log p_u = -\\log 0.6 \\approx 0.5108$.</li>
        <li><b>Box total</b> (Eqn. 2): $L_\\text{loc}=0.020+0.005+0.125+1.500 = 1.65$.</li>
        <li><b>Combine</b> (Eqn. 1): $L = L_\\text{cls} + \\lambda[u\\ge1]L_\\text{loc} = 0.5108 + 1\\cdot 1 \\cdot 1.65 = \\mathbf{2.1608}$.</li>
       </ul>
       <p>Notice the worst coordinate ($-2.0$) added only $1.5$, not $\\tfrac12(2)^2=2$ &mdash; the linear tail
       already softened it.</p>`,
    recipe:
      `<ol>
        <li><b>Shared conv pass.</b> Run the convolutional backbone over the whole image once &rarr; one
        feature map (channels &times; grid).</li>
        <li><b>Project each RoI</b> onto the feature map as an $h\\times w$ rectangle (from the region
        proposals).</li>
        <li><b>RoI pool</b> each RoI to a fixed $H\\times W$: split into an $H\\times W$ grid of
        $\\approx h/H \\times w/W$ sub-windows and <b>max</b> each (per channel) &mdash; &sect;2.1.</li>
        <li><b>Shared head:</b> flatten the $H\\times W$ features through a couple of fully-connected layers.</li>
        <li><b>Two sibling heads:</b> a <b>softmax</b> over $K+1$ classes, and a <b>box regressor</b> emitting
        $t^u=(t_x,t_y,t_w,t_h)$ per class.</li>
        <li><b>One multi-task loss</b> (Eqn. 1): $L_\\text{cls} + \\lambda[u\\ge1]L_\\text{loc}$, with smooth-L1
        in $L_\\text{loc}$ &mdash; backprop through both heads and the shared layers at once.</li>
        <li><b>Ablate:</b> set $\\lambda=0$ (single-task: classification only) and compare classification
        accuracy &mdash; &sect;5.1.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "Fast R-CNN trains the very deep VGG16 network <b>9&times; faster</b> than
       R-CNN, is <b>213&times; faster at test-time</b>, and achieves a higher mAP on PASCAL VOC 2012."
       (mAP = mean Average Precision, the standard detection accuracy score.) On the multi-task ablation
       (&sect;5.1, "Does multi-task training help?"), the paper reports that multi-task training improves
       <i>classification</i> accuracy over training for classification alone &mdash; a consistent positive
       effect of roughly $+0.8$ to $+1.1$ mAP points across the networks they tested, and stage-wise training
       underperformed multi-task training throughout.</p>
       <p><i>These are the paper&rsquo;s reported figures, quoted from the abstract and &sect;5.1. The numbers
       in the CODEVIZ panel below are from our own tiny run &mdash; not the paper&rsquo;s results.</i></p>`,

    evaluation:
      `<p><b>Metric &amp; benchmark.</b> Fast R-CNN's headline metric is <b>mAP</b> (mean Average Precision) on
       PASCAL VOC detection, plus train/test wall-clock speed. Two "trivial" baselines define progress: for accuracy,
       the prior R-CNN/SPPnet mAP it had to match-or-beat; for speed, R-CNN's own timings (the paper reports
       <b>9&times;</b> faster training and <b>213&times;</b> faster test-time on VGG16, Abstract). For the two
       components you build here, the checks are sharper: RoI pooling is verified <i>exactly</i> (an oracle match, not
       a benchmark), and the multi-task idea is measured by <b>classification accuracy</b> with vs without the box
       loss (&sect;5.1).</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> RoI pooling: reproduce the worked $4\\times4\\to2\\times2$ example
        ($\\begin{smallmatrix}6&amp;4\\\\9&amp;8\\end{smallmatrix}$) and assert
        <code>torch.allclose(mine, torchvision.ops.roi_pool(...))</code> &mdash; a known-answer unit test against the
        oracle; check the output is always $H\\times W$ for RoIs of different $h,w$. smooth-L1: confirm the worked loss
        $L_\\text{cls}=0.5108$, $L_\\text{loc}=1.65$, $L=2.1608$, and that the function is continuous at $|x|=1$ (both
        branches give $0.5$). Check the $[u\\ge1]$ switch zeros the box loss for background ($u=0$). Loss at init for
        the $K{+}1$-way softmax should be $\\approx \\ln(K{+}1)$ (here $\\ln 5\\approx1.609$) &mdash; the theoretical
        value for uniform predictions.</li>
        <li><b>Expected range.</b> RoI pooling must match torchvision <i>exactly</i> (allclose True) &mdash; anything
        else is a binning/quantization bug, not tuning. For the &sect;5.1 ablation on toy data (our numbers, seed
        fixed, not the paper's): multi-task ($\\lambda=1$) classification accuracy $\\approx 0.5525$ vs single-task
        ($\\lambda=0$) $\\approx 0.5250$ &mdash; a small but consistent edge to multi-task. Anchor the paper's claim
        separately (cite, do not adopt as your own): multi-task helped classification by roughly $+0.8$ to $+1.1$ mAP
        across networks (&sect;5.1). A multi-task run that is clearly <i>worse</i> than single-task signals a bug;
        the two being within noise is expected on this tiny toy.</li>
        <li><b>Ablation &mdash; prove the central idea earns its keep.</b> This paper's central training claim is that
        the <i>joint multi-task loss</i> helps. The knob is $\\lambda$: train with $\\lambda=1$ (cls + smooth-L1 box)
        and again with $\\lambda=0$ (classification only, box head present but its loss off), <b>everything else
        identical</b> (data, depth, optimizer, seed), and confirm multi-task classification accuracy $\\ge$
        single-task (&sect;5.1). If turning the box loss off does <i>not</i> drop accuracy, the box gradient is not
        reaching the shared trunk (e.g. you detached it, or the $[u\\ge1]$ mask zeroed everything).</li>
        <li><b>Failure signals &amp; what they mean.</b> RoI-pool allclose False &rarr; box-coordinate convention
        mismatch (torchvision expects inclusive $x2,y2$ in feature coords) or floor/quantization off-by-one. Box loss
        explodes / gradients NaN &rarr; you used $L_2$ instead of smooth-L1 (the unbounded tail the paper warns about,
        &sect;2.3), or did not normalize the targets $v$ so $\\lambda=1$ no longer balances the terms. Regressor learns
        garbage on background &rarr; you dropped the $[u\\ge1]$ switch and trained boxes on label-less background RoIs.
        Multi-task no better than single-task with a correct build &rarr; toy too easy / box target uninformative,
        not necessarily a bug. Re-running the conv per region instead of pooling from one shared map &rarr; you have
        reimplemented R-CNN and lost the whole speed contribution.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.CrossEntropyLoss</code>, the optimizer, and &mdash; as the <b>oracle</b> &mdash;
       <code>torchvision.ops.roi_pool</code> to check your hand-written RoI pooling. <b>Build by hand:</b>
       the RoI-pooling layer (split the $h\\times w$ window into the $H\\times W$ grid and max each sub-window),
       the <b>smooth-L1</b> function (Eqn. 3), the <b>multi-task loss</b> (Eqn. 1, with the
       $[u\\ge1]$ switch), and the <b>ablation</b> ($\\lambda=0$). The cross-entropy derivation is reused from
       the dl-cross-entropy concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the $[u\\ge 1]$ switch.</b> Background regions ($u=0$) have no ground-truth box. If
        you let them contribute $L_\\text{loc}$ you train the regressor on meaningless targets. <b>Fix:</b>
        multiply the box loss by $[u\\ge 1]$ so background regions add only classification loss.</li>
        <li><b>Using $L_2$ (squared error) for the box loss.</b> A single outlier coordinate then drives a huge
        gradient ($x$ grows without bound) and training can diverge &mdash; the very problem the paper cites.
        <b>Fix:</b> use smooth-L1 (Eqn. 3); its tail gradient is capped at $\\pm1$.</li>
        <li><b>RoI pooling with a fixed window instead of an adaptive one.</b> The sub-window size is
        $\\approx h/H \\times w/W$ &mdash; it <i>depends on the region&rsquo;s size</i> so the output is always
        $H\\times W$. Using one fixed kernel for every region defeats the whole point.</li>
        <li><b>Coordinate rounding (quantization).</b> $h/H$ rarely divides evenly, so sub-window edges get
        rounded to integer feature-map cells. That is fine for RoI pooling here; just be consistent (this
        rounding is exactly what RoI Align later removes for masks).</li>
        <li><b>Re-running the conv per region.</b> The point of the paper is the <i>shared</i> pass: one conv
        over the image, then read every RoI from the same map. Cropping and re-convolving each region is R-CNN
        again.</li>
        <li><b>Mismatched $\\lambda$ without normalizing targets.</b> The paper sets $\\lambda=1$ <i>after</i>
        normalizing $v$ to zero mean / unit variance. Skip the normalization and $\\lambda=1$ no longer
        balances the two losses.</li>
      </ul>`,
    recall: [
      "Write the multi-task loss (Eqn. 1) from memory, including the $[u\\ge 1]$ term.",
      "Define $\\text{smooth}_{L_1}(x)$ (Eqn. 3) and say what its gradient is for large $|x|$.",
      "In one sentence, what does the RoI pooling layer do and why is it needed?",
      "What does the Iverson bracket $[u\\ge 1]$ accomplish, and what is class $u=0$?",
      "Why does Fast R-CNN run the convolutions only once per image?"
    ],
    practice: [
      {
        q: `<b>The ablation (&sect;5.1).</b> You have a working detection head trained multi-task
            (classification + smooth-L1 box loss). Set $\\lambda=0$ so the box loss is switched off
            (single-task: classification only), retrain, and measure <i>classification</i> accuracy. What do
            you expect, and what does the result demonstrate?`,
        steps: [
          { do: `Change exactly one thing: set $\\lambda = 0$ in the multi-task loss (the box head still exists, but its loss no longer affects the shared layers). Keep data, depth, optimizer, and seed identical.`, why: `An honest ablation isolates the multi-task signal: any difference in classification accuracy is attributable to the box loss being present or absent.` },
          { do: `Retrain and compare classification accuracy of the multi-task ($\\lambda=1$) vs single-task ($\\lambda=0$) runs.`, why: `The paper&rsquo;s &sect;5.1 reports multi-task training <i>improves</i> classification over training it alone, because the box-regression signal shapes the shared features.` },
          { do: `Conclude whether the shared representation benefits from learning both tasks at once.`, why: `If multi-task wins, the auxiliary box loss acts as a useful regularizer/extra signal on the shared trunk.` }
        ],
        answer: `<p>The <b>multi-task</b> classifier should match or beat the single-task one: in the paper&rsquo;s
                 &sect;5.1 ("Does multi-task training help?") multi-task training improves classification
                 accuracy by roughly $+0.8$ to $+1.1$ mAP. Since the two runs differ only in $\\lambda$
                 ($1$ vs $0$), this isolates the box-regression loss as the cause &mdash; the extra task shapes
                 the shared features and helps classification. The CODEVIZ panel reproduces this contrast on
                 toy data (our numbers, not the paper&rsquo;s).</p>`
      },
      {
        q: `A region proposal maps to a $6\\times8$ rectangle on the feature map, and you must RoI-pool it to
            $H\\times W = 3\\times2$. What is each sub-window&rsquo;s size, and how many input cells does each
            output value max over?`,
        steps: [
          { do: `Sub-window height $= h/H = 6/3 = 2$; width $= w/W = 8/2 = 4$.`, why: `&sect;2.1: the $h\\times w$ window is split into an $H\\times W$ grid of sub-windows of approximate size $h/H\\times w/W$.` },
          { do: `Each output cell maxes over a $2\\times4$ block of feature-map cells.`, why: `RoI max pooling takes the maximum value inside each sub-window into the corresponding output cell.` },
          { do: `The output is a fixed $3\\times2$ grid regardless of the region&rsquo;s original size.`, why: `That fixed size is exactly what lets the downstream fully-connected head accept any region.` }
        ],
        answer: `<p>Each sub-window is $h/H \\times w/W = 2\\times4$ feature-map cells, so each of the
                 $3\\times2 = 6$ output values is the <b>max over 8 cells</b>. The output is a fixed $3\\times2$
                 grid no matter the region&rsquo;s input size &mdash; that is the point of RoI pooling.</p>`
      },
      {
        q: `In the worked example the worst coordinate error was $-2.0$ and contributed $1.5$ to $L_\\text{loc}$.
            What would plain squared error $\\tfrac12 x^2$ have contributed for that coordinate, and why does
            the paper prefer smooth-L1?`,
        steps: [
          { do: `Squared error: $\\tfrac12(-2.0)^2 = \\tfrac12\\cdot 4 = 2.0$.`, why: `Squared error grows quadratically, so a large error is penalized much more heavily than the linear tail.` },
          { do: `Smooth-L1 (Eqn. 3, $|x|\\ge1$ branch): $|{-2.0}| - 0.5 = 1.5$.`, why: `Once $|x|\\ge 1$ smooth-L1 is linear, so it caps how fast the loss &mdash; and its gradient &mdash; grows.` },
          { do: `Compare gradients: squared error gives $|x|=2$; smooth-L1 gives $\\operatorname{sign}(x)=\\pm1$.`, why: `The capped gradient means one badly-off coordinate cannot dominate the update &mdash; no exploding gradients.` }
        ],
        answer: `<p>Squared error would contribute $\\tfrac12(2)^2 = 2.0$ (vs smooth-L1&rsquo;s $1.5$), and its
                 gradient would be $2$ (vs smooth-L1&rsquo;s capped $\\pm1$). The paper prefers smooth-L1 because
                 it is "less sensitive to outliers than the $L_2$ loss" &mdash; the bounded tail gradient
                 prevents the exploding gradients that an unbounded $L_2$ box loss can cause.</p>`
      }
    ]
  });

  window.CODE["paper-fast-rcnn"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the two novelties by hand &mdash; the <b>RoI pooling</b> layer and the
       <b>multi-task</b> (classification + smooth-L1 box) loss &mdash; then verify and ablate. The first cell
       recomputes the worked $4\\times4\\to2\\times2$ RoI-pool example and the multi-task-loss example
       ($L=2.1608$). We then check our RoI pooling against the <b>oracle</b>,
       <code>torchvision.ops.roi_pool</code>, with <code>torch.allclose</code>. Finally we train a tiny
       detection head two ways &mdash; multi-task ($\\lambda=1$) and single-task ($\\lambda=0$) &mdash; and print
       both classification accuracies (the &sect;5.1 ablation). Paste into Colab and run (torch/torchvision are
       preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.ops import roi_pool   # the ORACLE we check our hand-written pooling against

torch.manual_seed(0)

# --- 0a. Worked example A: RoI-pool a 4x4 feature map to 2x2 (whole map is the RoI). ---
fmap = torch.tensor([[1.,3,2,4],
                     [5.,6,1,2],
                     [7.,2,8,3],
                     [0.,9,4,1]])

def roi_pool_manual(fm, y0, x0, h, w, H, W):
    # Split the h x w window into an H x W grid; max each sub-window (one channel).
    out = torch.zeros(H, W)
    for i in range(H):
        for j in range(W):
            ys = y0 + (i * h) // H;  ye = y0 + ((i + 1) * h) // H
            xs = x0 + (j * w) // W;  xe = x0 + ((j + 1) * w) // W
            out[i, j] = fm[ys:ye, xs:xe].max()
    return out

pooled = roi_pool_manual(fmap, 0, 0, 4, 4, 2, 2)
print("worked RoI-pool 2x2:\\n", pooled.tolist())   # [[6, 4], [9, 8]]

# --- 0b. Worked example B: the multi-task loss L = Lcls + lambda*[u>=1]*Lloc. ---
def smooth_l1(x):
    a = x.abs()
    return torch.where(a < 1.0, 0.5 * x * x, a - 0.5)   # Eqn. 3

pu = torch.tensor(0.6)
Lcls = -torch.log(pu)                                   # -log p_u  = 0.5108
t = torch.tensor([0.2, -0.1, 0.5, -2.0]); v = torch.zeros(4)
Lloc = smooth_l1(t - v).sum()                           # Eqn. 2    = 1.65
u = 1; lam = 1.0
L = Lcls + lam * (1.0 if u >= 1 else 0.0) * Lloc        # Eqn. 1
print("Lcls=%.4f  Lloc=%.4f  L=%.4f" % (Lcls, Lloc, L))  # 0.5108  1.6500  2.1608

# --- 1. Verify our RoI pooling against torchvision.ops.roi_pool (the oracle). ---
# torchvision expects feat (N,C,Hf,Wf) and boxes as [batch_idx, x1, y1, x2, y2] in feature
# coords, where x2/y2 are the INCLUSIVE max cell index. The 4x4 map spans indices 0..3, so the
# whole-map RoI is [0, 0, 3, 3] -- this makes torchvision's binning match our h/H split.
feat  = fmap.view(1, 1, 4, 4)
boxes = torch.tensor([[0., 0., 0., 3., 3.]])            # whole map, [b, x1,y1,x2,y2] (inclusive)
ref   = roi_pool(feat, boxes, output_size=(2, 2), spatial_scale=1.0)[0, 0]
mine  = roi_pool_manual(fmap, 0, 0, 4, 4, 2, 2)
print("torchvision roi_pool:\\n", ref.tolist())
print("allclose(mine, torchvision.ops.roi_pool):", torch.allclose(mine, ref))
# allclose(mine, torchvision.ops.roi_pool): True   -> our RoI pooling IS torchvision's.

# --- 2. A tiny detection head, trained two ways: multi-task vs single-task (the 5.1 ablation). ---
# Toy "regions": NOISY pooled features, plus a CLEAN per-class characteristic box. The box task
# pulls the shared trunk toward class structure, so it helps classification (measured on a held-out
# test set). Box loss is ignored for background (u=0) via the [u>=1] switch.
g = torch.Generator().manual_seed(0)
Din, K, Ntr, Nte = 12, 4, 180, 400        # K real classes (labels 1..K); 0 = background
centers     = torch.randn(K + 1, Din, generator=g)         # class feature centers
box_centers = torch.randn(K + 1, 4,   generator=g) * 4.0   # each class's characteristic box

def make(n):                                               # one batch of toy regions
    y = torch.randint(0, K + 1, (n,), generator=g)
    X = centers[y]     + torch.randn(n, Din, generator=g) * 2.0   # VERY noisy features
    V = box_centers[y] + torch.randn(n, 4,   generator=g) * 0.2   # clean per-class box target
    return X, y, (y >= 1).float().unsqueeze(1), V

Xtr, ytr, obj_tr, Vtr = make(Ntr)
Xte, yte, _, _        = make(Nte)          # held-out test set for the accuracy we report

class Head(nn.Module):
    def __init__(self):
        super().__init__()
        self.trunk = nn.Sequential(nn.Linear(Din, 24), nn.ReLU())   # SHARED trunk
        self.cls   = nn.Linear(24, K + 1)          # softmax over K+1 classes
        self.box   = nn.Linear(24, 4)              # bbox regressor t^u
    def forward(self, x):
        f = self.trunk(x)
        return self.cls(f), self.box(f)

def train(lmbda, steps=150, lr=0.05):
    torch.manual_seed(1)
    net = Head(); opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9)
    ce  = nn.CrossEntropyLoss()
    for _ in range(steps):
        opt.zero_grad()
        logits, t = net(Xtr)
        Lcls = ce(logits, ytr)                                     # Eqn. 1 classification term
        Lloc = (obj_tr * smooth_l1(t - Vtr)).sum(1).mean()         # Eqn. 2, switched by [u>=1]
        (Lcls + lmbda * Lloc).backward(); opt.step()               # Eqn. 1
    with torch.no_grad():
        return (net(Xte)[0].argmax(1) == yte).float().mean().item()

acc_multi  = train(lmbda=1.0)     # multi-task: classification + box loss
acc_single = train(lmbda=0.0)     # single-task ABLATION: classification only
print("test classification acc  single-task (lambda=0):  %.4f" % acc_single)  # ~0.5250
print("test classification acc  multi-task  (lambda=1):  %.4f" % acc_multi)   # ~0.5525
print("multi-task helps classification:", acc_multi >= acc_single)            # True
# Multi-task >= single-task here, reproducing 5.1's qualitative effect.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-fast-rcnn"] = {
    question: "Does adding the smooth-L1 box-regression loss (multi-task) improve classification accuracy vs training the classifier alone (single-task)? (§5.1)",
    charts: [
      {
        type: "bar",
        title: "Classification accuracy — multi-task (λ=1) vs single-task (λ=0), toy detection head",
        xlabel: "training setup",
        ylabel: "classification accuracy",
        series: [
          {
            name: "classification accuracy",
            color: "#7ee787",
            points: [["Single-task (λ=0)", 0.525], ["Multi-task (λ=1)", 0.5525]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. One toy detection head (12-d NOISY pooled features, 4 classes incl. background, shared trunk) trained 150 SGD steps two ways — identical except for λ in the multi-task loss (Eqn. 1). Each class also has a CLEAN characteristic box, so the smooth-L1 box task pulls the shared trunk toward class structure. Held-out test accuracy: with the box loss ON (λ=1) it is 0.5525 vs 0.5250 with it OFF (λ=0) — the auxiliary box-regression task helps the classifier, reproducing the qualitative effect of §5.1 (\"Does multi-task training help?\"). Same data, trunk, optimizer, seed; the only difference is λ.",
    code: `import torch, torch.nn as nn
# Reproduce §5.1's qualitative effect on toy data: multi-task (cls + smooth-L1 box) vs single-task (cls only).
# Features are noisy; each class has a clean characteristic box, so the box task helps the shared trunk.
g = torch.Generator().manual_seed(0)
Din, K, Ntr, Nte = 12, 4, 180, 400
centers     = torch.randn(K + 1, Din, generator=g)
box_centers = torch.randn(K + 1, 4,   generator=g) * 4.0
def make(n):
    y = torch.randint(0, K + 1, (n,), generator=g)
    X = centers[y]     + torch.randn(n, Din, generator=g) * 2.0    # noisy features
    V = box_centers[y] + torch.randn(n, 4,   generator=g) * 0.2    # clean per-class box
    return X, y, (y >= 1).float().unsqueeze(1), V
Xtr, ytr, obj_tr, Vtr = make(Ntr)
Xte, yte, _, _        = make(Nte)

def smooth_l1(x):
    a = x.abs(); return torch.where(a < 1.0, 0.5 * x * x, a - 0.5)

class Head(nn.Module):
    def __init__(self):
        super().__init__()
        self.trunk = nn.Sequential(nn.Linear(Din, 24), nn.ReLU())
        self.cls = nn.Linear(24, K + 1); self.box = nn.Linear(24, 4)
    def forward(self, x):
        f = self.trunk(x); return self.cls(f), self.box(f)

def train(lmbda, steps=150, lr=0.05):
    torch.manual_seed(1)
    net = Head(); opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9)
    ce = nn.CrossEntropyLoss()
    for _ in range(steps):
        opt.zero_grad(); logits, t = net(Xtr)
        loss = ce(logits, ytr) + lmbda * (obj_tr * smooth_l1(t - Vtr)).sum(1).mean()
        loss.backward(); opt.step()
    with torch.no_grad():
        return (net(Xte)[0].argmax(1) == yte).float().mean().item()

print("single-task (lambda=0):", round(train(0.0), 4))   # 0.525
print("multi-task  (lambda=1):", round(train(1.0), 4))   # 0.5525`
  };
})();
