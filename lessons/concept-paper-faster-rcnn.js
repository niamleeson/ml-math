/* Paper lesson — "Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks"
   Ren, He, Girshick & Sun, 2015.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-faster-rcnn".
   GROUNDED from arXiv:1506.01497 via the ar5iv HTML mirror (abstract; Section 3 "Faster R-CNN";
   Section 3.1 "Region Proposal Networks" incl. Eq 1 multi-task loss and Eq 2 box parametrization;
   Section 3.1.1 anchors; Section 3.1.2 labeling/loss; Section 3.2 4-step training; Section 3.3
   implementation details; Table II ablation).
   Track B (architecture): build anchor generation + the RPN head (3x3 conv -> 1x1 cls + 1x1 reg) by
   hand on top of nn.Conv2d, run it on a toy feature map, decode one anchor's box delta, and ABLATE
   the multiple-anchor design (k=1 vs k=9). The detector / IoU / box-regression intuition is owned by
   concept dl-object-detection (recap+link, not re-derived). */
(function () {
  window.LESSONS.push({
    id: "paper-faster-rcnn",
    title: "Faster R-CNN — Towards Real-Time Object Detection with Region Proposal Networks (2015)",
    tagline: "Make region proposals nearly free: a tiny conv net (the RPN) slides over the shared feature map and predicts object boxes directly, replacing the slow Selective Search step.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Shaoqing Ren, Kaiming He, Ross Girshick, Jian Sun",
      org: "Microsoft Research",
      year: 2015,
      venue: "arXiv:1506.01497 (Jun 2015); NeurIPS (NIPS) 2015; TPAMI 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1506.01497",
      code: "https://github.com/ShaoqingRen/faster_rcnn"
    },
    conceptLink: "dl-object-detection",
    partOf: [],
    prereqs: ["dl-object-detection", "dl-conv", "dl-receptive-field", "pt-cnn", "pt-nn-module", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p><b>Object detection</b> means drawing a box around every object in an image and naming it. The R-CNN
       family did this in two stages: first <b>propose</b> a few thousand candidate boxes that might contain
       something, then <b>classify</b> each candidate. <b>Fast R-CNN</b> (the previous paper) made the
       classify stage fast by running the convolutional network <i>once</i> over the whole image and reading
       each candidate's features straight out of the shared feature map.</p>
       <p>That left one slow step exposed (&sect;1). The candidate boxes still came from <b>Selective Search</b>
       &mdash; a hand-engineered, CPU-bound algorithm that merges super-pixels into ~2,000 region proposals
       per image. The paper measures it as the new bottleneck: Selective Search takes about <b>2 seconds per
       image on a CPU</b>, while the detection network itself runs in a fraction of a second on a GPU. So the
       proposals, not the detector, now dominate the clock. The paper's question: can we make the proposal
       step nearly free by computing it <i>on the GPU, from the features the detector already extracted</i>?</p>`,
    contribution:
      `<ul>
        <li><b>The Region Proposal Network (RPN).</b> A small <b>fully convolutional</b> network that slides
        over the shared convolutional feature map and, at every position, predicts whether an object is there
        (an <b>objectness</b> score) and how to nudge a reference box around it (&sect;3.1). It replaces
        Selective Search.</li>
        <li><b>Anchors.</b> At each feature-map location the RPN places $k$ reference boxes of fixed scales and
        shapes (<b>anchors</b>) and predicts a correction relative to each. This lets one $1\\times1$ conv
        predict boxes of many sizes and aspect ratios, and makes the predictor <b>translation-invariant</b>
        (&sect;3.1.1).</li>
        <li><b>Feature sharing.</b> The RPN and the Fast R-CNN detector share the <i>same</i> backbone
        convolutions, so proposals are "nearly cost-free" (abstract). The paper trains them to share via a
        <b>4-step alternating</b> scheme (&sect;3.2).</li>
      </ul>`,
    whyItMattered:
      `<p>Faster R-CNN made the whole detector a single, end-to-end, GPU-trainable network &mdash; "5fps
       (including all steps) on a GPU" with VGG-16 (abstract) &mdash; and removed the last hand-engineered
       piece. The anchor idea it introduced became the backbone of nearly every detector that followed:
       SSD, YOLOv2/v3, RetinaNet, and Mask R-CNN all place anchors on a feature map and regress boxes from
       them. The RPN you build here is the direct ancestor of those. Cross-link: this paper is the third in
       the line &mdash; <b>R-CNN</b> (propose + classify, slow), <b>Fast R-CNN</b> (share the conv pass, but
       still Selective Search for proposals), and <b>Faster R-CNN</b> (this one), which adds the RPN so the
       proposals come from the network itself.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Region Proposal Networks)</b> &mdash; the whole idea: the $n\\times n$ sliding window
        ($n=3$), the intermediate feature, and the two sibling $1\\times1$ conv layers (<b>cls</b> and
        <b>reg</b>). Figure 3 is the picture to keep open.</li>
        <li><b>&sect;3.1.1 (Anchors)</b> &mdash; $k=9$ anchors (3 scales &times; 3 aspect ratios), what
        translation invariance buys, and the $2k$ / $4k$ output dimensions.</li>
        <li><b>&sect;3.1.2 (Loss Function), Eq 1 and Eq 2</b> &mdash; the multi-task loss and the box
        parametrization. These are the equations you transcribe and implement.</li>
        <li><b>&sect;3.2 (Sharing Features), the 4-Step Alternating Training</b> &mdash; how RPN and Fast
        R-CNN come to share one backbone.</li>
        <li><b>Table II</b> &mdash; the ablation that matters: RPN proposals (300/image) match or beat
        Selective Search (2,000/image) on PASCAL VOC 2007.</li>
       </ul>
       <p><b>Skim:</b> the SPPnet/Fast R-CNN recap (covered by our <b>paper-fast-rcnn</b> and
       <b>dl-object-detection</b> lessons), the per-class detection tables, and the COCO numbers unless you
       want to reproduce the paper.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>The RPN places $k=9$ anchors at <i>every</i> feature-map location &mdash; 3 scales &times; 3 aspect
       ratios &mdash; and outputs one box prediction <i>per anchor</i>. You will build a tiny RPN and then run
       the <b>ablation</b>: shrink $k$ to $1$ (a single square anchor per location, so a single box output)
       and ask one feature cell to cover <i>three overlapping objects of different shapes</i> at once &mdash;
       a square, a wide one, and a tall one.</p>
       <p>With $k=9$ the cell emits nine boxes, so each object can be assigned its own anchor; with $k=1$ the
       cell emits a single box that has to serve all three. Will the single-anchor RPN fit all three boxes as
       well as the 9-anchor RPN? Write your guess and one sentence of reasoning, then run it.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>generate_anchors(stride, scales, ratios)</code>: for one feature-map cell, produce the $k$
        anchor boxes. <b>TODO:</b> the cell at grid position $(i,j)$ has center $((j{+}0.5)\\,\\text{stride},
        (i{+}0.5)\\,\\text{stride})$ in image pixels; for each (scale, ratio) pair compute width
        $w=\\text{scale}\\sqrt{\\text{ratio}}$ and height $h=\\text{scale}/\\sqrt{\\text{ratio}}$ so area
        $=\\text{scale}^2$. Tile these over every cell.</li>
        <li><code>RPNHead</code>: a $3\\times3$ <code>nn.Conv2d</code> (the sliding window) + ReLU, then two
        sibling $1\\times1$ convs &mdash; a <b>cls</b> conv with $2k$ outputs (object vs not, per anchor) and a
        <b>reg</b> conv with $4k$ outputs (the four box deltas per anchor). <b>TODO:</b> wire those three
        convs.</li>
        <li><code>decode(anchor, delta)</code>: turn a predicted delta $(t_x,t_y,t_w,t_h)$ into a box by
        <b>inverting Eq 2</b>: $x = t_x w_a + x_a$, $y = t_y h_a + y_a$, $w = w_a e^{t_w}$, $h = h_a e^{t_h}$.</li>
       </ul>
       <p>Then run the model once with $k=9$ and once with $k=1$ (the ablation), fitting three different-shaped
       objects at one cell. Predict which fits all three better.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The RPN is a small network that turns a shared feature map into a list of candidate object boxes,
       each with an "is there an object here?" score. Four steps (&sect;3.1).</p>
       <p><b>1. Share the backbone, then slide a tiny window.</b> The detector already ran a deep CNN over the
       image to get a feature map of size $W\\times H$ with $C$ channels (for example, the last conv layer of
       VGG-16). The RPN slides a small $n\\times n$ network over this map; the paper uses $n=3$. At each
       position it reads the $3\\times3$ patch of features and maps it to one lower-dimensional vector (256-d
       for the ZF backbone, 512-d for VGG), followed by a ReLU (&sect;3.1). Because this "slide a $3\\times3$
       then project" is the same at every location, it is just <b>two convolutions</b>: a $3\\times3$ conv then
       $1\\times1$ convs &mdash; the whole RPN is <b>fully convolutional</b>.</p>
       <p><b>2. Place $k$ anchors at each location (&sect;3.1.1).</b> A single $1\\times1$ predictor can only
       output a fixed number of boxes per location, but objects come in many sizes and shapes. The fix:
       define $k$ reference boxes &mdash; <b>anchors</b> &mdash; centered at the sliding-window position, each
       with its own scale and aspect ratio. The paper uses $k=9$: 3 scales (box areas $128^2$, $256^2$,
       $512^2$ pixels) &times; 3 aspect ratios ($1{:}1$, $1{:}2$, $2{:}1$) (&sect;3.3). The RPN never predicts
       a box from scratch; it predicts a <i>nudge</i> relative to each anchor. Since the anchors move with the
       window, the predictor is <b>translation-invariant</b>: shift the object, and the same prediction shifts
       with it (&sect;3.1.1).</p>
       <p><b>3. Two sibling outputs: cls and reg (&sect;3.1).</b> From the intermediate feature, two
       $1\\times1$ conv layers branch off. The <b>cls</b> (classification) layer outputs $2k$ scores &mdash;
       for each of the $k$ anchors, an object-vs-background pair (the <b>objectness</b>). The <b>reg</b>
       (regression) layer outputs $4k$ numbers &mdash; for each anchor, the four box deltas
       $(t_x,t_y,t_w,t_h)$ that say how to move and resize that anchor to fit the object.</p>
       <p><b>4. Label anchors and train with a multi-task loss (&sect;3.1.2).</b> To train, each anchor gets a
       label from its <b>Intersection-over-Union (IoU)</b> with the ground-truth boxes (IoU = area of overlap
       &divide; area of union). An anchor is <b>positive</b> if it has IoU $\\gt 0.7$ with some ground-truth
       box (or is the best-overlapping anchor for a box), and <b>negative</b> if its IoU is $\\lt 0.3$ with all
       of them; in-between anchors are ignored. The loss (Eq 1) sums a classification term over all sampled
       anchors and a box-regression term <i>only over the positive ones</i>. Then the RPN's top-scoring boxes
       become the proposals fed to the Fast R-CNN detector, and a 4-step scheme (&sect;3.2) trains the two to
       share one backbone.</p>`,
    architecture:
      `<p>Faster R-CNN is one network with a <b>shared backbone</b> feeding <b>two heads</b> &mdash; the RPN
       (proposes boxes) and the Fast R-CNN detector (classifies + refines them). Data flows top to bottom.</p>
       <p><b>1. Shared backbone (the conv trunk).</b> An ImageNet-pretrained CNN &mdash; <b>ZF</b> (5 conv
       layers, 256-d) or <b>VGG-16</b> (13 conv layers, 512-d) &mdash; runs <i>once</i> over the whole image.
       The image's shorter side is rescaled to <b>s=600</b> pixels (&sect;3.3); the trunk's total stride is
       <b>16</b>, so a $600$-px image yields a feature map of about $W\\times H \\approx 38\\times50$ cells with
       $C$ channels ($256$ for ZF, $512$ for VGG). This single feature map feeds <i>both</i> heads &mdash; that
       sharing is what makes proposals "nearly cost-free".</p>
       <p><b>2. RPN head (branch A).</b> Slide an $n\\times n$ ($n{=}3$) conv over the feature map &rarr; ReLU
       &rarr; an intermediate vector ($256$-d ZF / $512$-d VGG) per location. Two sibling $1\\times1$ convs
       branch off: <b>cls</b> ($2k$ channels = objectness object/background per anchor) and <b>reg</b> ($4k$
       channels = the four deltas $(t_x,t_y,t_w,t_h)$ per anchor), with $k=9$ anchors (3 scales $128^2,256^2,
       512^2$ &times; 3 ratios $1{:}1,1{:}2,2{:}1$) per cell &mdash; about $WHk\\approx17{,}000$ anchors total.
       Decode (inverse of Eq 2), score, apply <b>NMS</b> at IoU $0.7$, and keep the top proposals (~$2{,}000$
       train, ~$300$ test).</p>
       <p><b>3. RoI pooling (the join).</b> Each RPN proposal is projected onto the <i>same</i> shared feature
       map and <b>RoI-pooled</b> into a fixed $H'\\times W'$ (e.g. $7\\times7$) grid &mdash; so a box of any size
       becomes a fixed-length feature vector that the detector head can consume (this is the Fast R-CNN
       mechanism this paper reuses).</p>
       <p><b>4. Fast R-CNN head (branch B).</b> The pooled feature goes through two fully-connected layers, then
       two sibling outputs: a <b>softmax</b> over the $C{+}1$ object classes (the actual category, plus
       background) and a <b>per-class box regressor</b> (a second $(t_x,t_y,t_w,t_h)$ that refines the proposal).
       So the RPN says <i>where</i> (objectness + coarse box), the detector says <i>what</i> (class + fine box).
       "The RPN module tells the Fast R-CNN module where to look" (&sect;3).</p>
       <p><b>4-step alternating training (&sect;3.2)</b> &mdash; how the two heads come to share one backbone:</p>
       <ul>
        <li><b>Step 1.</b> Train the <b>RPN</b> alone end-to-end, backbone initialized from ImageNet.</li>
        <li><b>Step 2.</b> Train a <b>separate Fast R-CNN</b> detector on step-1's proposals, its backbone also
        ImageNet-initialized &mdash; <i>no sharing yet</i> (the two have separate conv trunks at this point).</li>
        <li><b>Step 3.</b> Re-init the RPN from the <b>detector's backbone</b>, <b>freeze the shared conv
        layers</b>, and fine-tune only the RPN-specific layers &mdash; now both share that backbone.</li>
        <li><b>Step 4.</b> Keep the shared conv layers <b>frozen</b> and fine-tune only the <b>Fast R-CNN-specific
        layers</b>. The result is one unified network with shared features.</li>
       </ul>`,
    symbols: [
      { sym: "$W \\times H$", desc: "the <b>width</b> and <b>height</b> of the shared convolutional feature map (in feature cells, not image pixels). The RPN slides over these $WH$ positions." },
      { sym: "$C$", desc: "the number of <b>channels</b> in the shared feature map (e.g. 512 for VGG-16's last conv layer)." },
      { sym: "$n$", desc: "the side length of the RPN's sliding window over the feature map; the paper uses $n=3$ (a $3\\times3$ conv)." },
      { sym: "$k$", desc: "the number of <b>anchors</b> placed at each location. Default $k=9$ = 3 scales &times; 3 aspect ratios." },
      { sym: "anchor", desc: "a <b>reference box</b> of fixed scale and aspect ratio, centered at the sliding-window position. The RPN predicts a correction <i>relative to</i> the anchor, not an absolute box." },
      { sym: "$x_a,\\,y_a,\\,w_a,\\,h_a$", desc: "an anchor's <b>center</b> $(x_a,y_a)$ and its <b>width</b> and <b>height</b>, in image pixels." },
      { sym: "$x,\\,y,\\,w,\\,h$", desc: "the <b>predicted</b> box's center, width, height (no subscript / superscript) &mdash; the box the RPN proposes." },
      { sym: "$x^\\ast,\\,y^\\ast,\\,w^\\ast,\\,h^\\ast$", desc: "the <b>ground-truth</b> box's center, width, height (the star denotes ground truth)." },
      { sym: "$t_i = (t_x,t_y,t_w,t_h)$", desc: "the 4 <b>predicted deltas</b> for anchor $i$: how to shift and rescale the anchor (Eq 2). $t_x,t_y$ shift the center; $t_w,t_h$ scale the size in log space." },
      { sym: "$t_i^\\ast$", desc: "the 4 <b>target deltas</b> for anchor $i$ &mdash; the deltas that would turn the anchor exactly into its matched ground-truth box (Eq 2, starred forms)." },
      { sym: "$p_i$", desc: "the RPN's predicted <b>objectness probability</b> for anchor $i$ (how likely it contains an object)." },
      { sym: "$p_i^\\ast$", desc: "the ground-truth label for anchor $i$: $1$ if it is a positive (object) anchor, $0$ if negative." },
      { sym: "IoU", desc: "<b>Intersection-over-Union</b>: area of overlap &divide; area of union of two boxes. Used to label anchors: positive if IoU $\\gt 0.7$, negative if $\\lt 0.3$ (&sect;3.1.2)." },
      { sym: "objectness", desc: "a plain term: the score for &lsquo;is <i>any</i> object here?&rsquo; (object vs background), <i>not</i> which class &mdash; the class comes later from the Fast R-CNN detector." },
      { sym: "$L_\\text{cls}$", desc: "the <b>classification loss</b>: log loss over the two classes object vs background (&sect;3.1.2)." },
      { sym: "$L_\\text{reg}$", desc: "the <b>box-regression loss</b>: $R(t_i - t_i^\\ast)$ with $R$ the robust <b>smooth-L1</b> function (small-error squared, large-error linear)." },
      { sym: "$N_\\text{cls},\\,N_\\text{reg}$", desc: "normalizers for the two loss terms: $N_\\text{cls}$ = mini-batch size (256), $N_\\text{reg}$ = number of anchor locations (~2,400) (&sect;3.1.2)." },
      { sym: "$\\lambda$", desc: "the <b>balancing weight</b> between the two loss terms; the paper sets $\\lambda=10$ so the cls and reg terms are roughly equally weighted (&sect;3.1.2)." }
    ],
    formula: `$$ L(\\{p_i\\},\\{t_i\\}) = \\frac{1}{N_\\text{cls}}\\sum_i L_\\text{cls}(p_i,\\,p_i^\\ast) \\;+\\; \\lambda\\,\\frac{1}{N_\\text{reg}}\\sum_i p_i^\\ast\\, L_\\text{reg}(t_i,\\,t_i^\\ast) \\quad\\text{(Eq 1, \\S 3.1.2)} $$
$$ t_x = \\frac{x - x_a}{w_a},\\quad t_y = \\frac{y - y_a}{h_a},\\quad t_w = \\log\\frac{w}{w_a},\\quad t_h = \\log\\frac{h}{h_a} \\quad\\text{(Eq 2, predicted)} $$
$$ t_x^\\ast = \\frac{x^\\ast - x_a}{w_a},\\quad t_y^\\ast = \\frac{y^\\ast - y_a}{h_a},\\quad t_w^\\ast = \\log\\frac{w^\\ast}{w_a},\\quad t_h^\\ast = \\log\\frac{h^\\ast}{h_a} \\quad\\text{(Eq 2, target)} $$`,
    whatItDoes:
      `<p><b>Equation 1 (the multi-task loss).</b> Train the RPN to do two jobs at once. The <b>first term</b>
       is classification: for every sampled anchor $i$, push its objectness $p_i$ toward its label $p_i^\\ast$
       (object or background), averaged over the mini-batch ($N_\\text{cls}$). The <b>second term</b> is box
       regression: make the predicted deltas $t_i$ match the target deltas $t_i^\\ast$. The factor $p_i^\\ast$
       in front is the key gate &mdash; it is $1$ only for positive anchors, so <b>we only learn to refine
       boxes that actually contain an object</b>; background anchors contribute nothing to the box loss
       (you cannot fit a box to "nothing"). $\\lambda=10$ balances the two terms.</p>
       <p><b>Equation 2 (the box parametrization).</b> The RPN never outputs raw pixel coordinates. Instead it
       outputs four <i>relative</i> numbers. $t_x,t_y$ are the center shift measured <b>in units of the anchor's
       own width/height</b> (so $t_x=0.5$ means "move right by half an anchor width"). $t_w,t_h$ are the size
       change in <b>log space</b> (so $t_w=0$ means "keep the width", $t_w=\\log 2$ means "double it"). Working
       relative to the anchor and in log-scale keeps the targets small and well-behaved no matter how big the
       object is &mdash; that is why it is easy to learn.</p>`,
    derivation:
      `<p><b>Why predict deltas relative to an anchor, not raw coordinates (recap; the detector/IoU/box-
       regression intuition lives in <b>dl-object-detection</b>).</b> A network output is unbounded, but image
       coordinates have a fixed range and objects span a huge range of sizes. If you regressed raw pixels, a
       small relative error on a large box and on a small box would look identical to the loss, even though one
       is far worse. Equation 2 fixes this by <b>normalizing</b>: divide the center offset by the anchor's
       size, and take the <i>log</i> of the size ratio. Now the targets are roughly unit-scale and
       scale-invariant, so the same small weights work for a $40$-pixel face and a $400$-pixel car. The
       <i>inverse</i> of Eq 2 is the decode you apply at test time:
       $x = t_x w_a + x_a,\\; y = t_y h_a + y_a,\\; w = w_a e^{t_w},\\; h = h_a e^{t_h}$ &mdash; that
       $e^{t_w}$ undoes the $\\log$, guaranteeing the predicted width is always positive.</p>
       <p><b>Why anchors make it translation-invariant (&sect;3.1.1).</b> Because the same $k$ anchors are
       laid down at every location and the predicting convs share weights across locations, an object and its
       shifted copy produce the same prediction, just shifted. So one small set of weights handles objects
       anywhere in the image &mdash; far fewer parameters than predicting an absolute box per location, and it
       cannot overfit to "objects only appear here."</p>`,
    example:
      `<p><b>One location, one anchor, one delta</b> &mdash; the numbers the notebook recomputes. Take a feature
       map with stride $16$ (each cell covers a $16\\times16$ pixel block). Consider grid cell $(i,j)=(1,1)$.</p>
       <ul class="steps">
        <li><b>Anchor center.</b> Cell $(1,1)$ has center $((j{+}0.5)\\cdot16,\\,(i{+}0.5)\\cdot16) =
        (1.5\\cdot16,\\,1.5\\cdot16) = (24,\\,24)$ in image pixels. So $x_a=24,\\;y_a=24$.</li>
        <li><b>The 3 aspect-ratio anchors</b> at one scale (take area $=64^2=4096$), using
        $w_a=\\text{scale}\\sqrt{r}$ (width) and $h_a=\\text{scale}/\\sqrt{r}$ (height), where $r$ is the aspect ratio:</li>
       </ul>
       <table class="extable">
        <caption>Three anchors at one scale ($\\text{scale}=64$). All keep area $\\approx 4096$ pixels.</caption>
        <thead><tr><th>ratio $r$</th><th class="num">$w_a$</th><th class="num">$h_a$</th><th class="num">area $w_a h_a$</th></tr></thead>
        <tbody>
          <tr><td class="row-h">$1{:}1$ ($r{=}1$)</td><td class="num">64.00</td><td class="num">64.00</td><td class="num">4096</td></tr>
          <tr><td class="row-h">$1{:}2$ ($r{=}0.5$)</td><td class="num">45.25</td><td class="num">90.51</td><td class="num">4096</td></tr>
          <tr><td class="row-h">$2{:}1$ ($r{=}2$)</td><td class="num">90.51</td><td class="num">45.25</td><td class="num">4096</td></tr>
        </tbody>
       </table>
       <p><b>Pick the $1{:}1$ anchor</b> $x_a=24,\\,y_a=24,\\,w_a=64,\\,h_a=64$ and apply a predicted delta
       $t=(t_x,t_y,t_w,t_h)=(0.5,\\,-0.25,\\,0.2,\\,0.0)$ via the inverse of Eq 2:</p>
       <ul class="steps">
        <li>$x = t_x w_a + x_a = 0.5\\cdot64 + 24 = 32 + 24 = 56$.</li>
        <li>$y = t_y h_a + y_a = -0.25\\cdot64 + 24 = -16 + 24 = 8$.</li>
        <li>$w = w_a e^{t_w} = 64\\cdot e^{0.2} = 64\\cdot 1.2214 = 78.17$.</li>
        <li>$h = h_a e^{t_h} = 64\\cdot e^{0} = 64\\cdot 1 = 64$.</li>
       </ul>
       <table class="extable">
        <caption>Anchor &rarr; proposed box, after the delta $(0.5,-0.25,0.2,0)$.</caption>
        <thead><tr><th></th><th class="num">center $x$</th><th class="num">center $y$</th><th class="num">width $w$</th><th class="num">height $h$</th></tr></thead>
        <tbody>
          <tr><td class="row-h">anchor</td><td class="num">24</td><td class="num">24</td><td class="num">64.00</td><td class="num">64.00</td></tr>
          <tr><td class="row-h">proposed box</td><td class="num">56</td><td class="num">8</td><td class="num">78.17</td><td class="num">64.00</td></tr>
        </tbody>
       </table>
       <p>So $t_x=0.5$ moved the center right by half an anchor width, $t_w=0.2$ grew the width by
       $e^{0.2}\\approx22\\%$, and $t_h=0$ left the height untouched. Every one of these numbers is recomputed in
       the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Run the shared backbone.</b> Pass the image through the CNN once to get a $W\\times H\\times C$
        feature map (we use a toy random feature map to focus on the RPN).</li>
        <li><b>Generate anchors.</b> At each of the $WH$ cells, place $k$ anchors: for each (scale, ratio) pair
        set $w=\\text{scale}\\sqrt{r},\\,h=\\text{scale}/\\sqrt{r}$, centered at the cell's image-pixel center.
        That gives $WHk$ anchors total ($k=9$ by default).</li>
        <li><b>RPN head.</b> A $3\\times3$ conv + ReLU (the sliding window), then two $1\\times1$ convs: a
        <b>cls</b> conv with $2k$ outputs (objectness per anchor) and a <b>reg</b> conv with $4k$ outputs (the
        four deltas per anchor) (&sect;3.1).</li>
        <li><b>Label anchors (training).</b> Positive if IoU $\\gt 0.7$ with a ground-truth box (or the best
        match for that box); negative if IoU $\\lt 0.3$ with all; ignore the rest (&sect;3.1.2).</li>
        <li><b>Loss (Eq 1).</b> Log-loss on objectness over a 256-anchor mini-batch + smooth-L1 box loss on
        the <i>positive</i> anchors only, weighted by $\\lambda=10$.</li>
        <li><b>Decode + propose (test).</b> Invert Eq 2 to turn each anchor+delta into a box; keep the
        top-scoring ones (the paper keeps ~300 after non-max suppression) and hand them to Fast R-CNN.</li>
        <li><b>Share features (&sect;3.2).</b> 4-step alternating training so RPN and Fast R-CNN use one
        backbone.</li>
      </ol>`,
    results:
      `<p>From Table II (quoted): on PASCAL VOC 2007 test, the RPN with shared features and just
       <b>300 proposals</b> per image reaches <b>59.9%</b> mAP (mean Average Precision), matching/beating
       <b>Selective Search</b> with <b>2,000 proposals</b> at <b>58.7%</b> mAP &mdash; fewer, better proposals.
       From the abstract: with VGG-16 the full system runs at <b>5fps on a GPU including all steps</b>, and
       achieves state-of-the-art accuracy on PASCAL VOC 2007, 2012 and MS COCO with only 300 proposals per
       image. (mAP = the detection accuracy measure; higher is better.)</p>
       <p><i>These are the paper's reported figures, quoted from the abstract/Table II. The numbers in the CODE
       and CODEVIZ panels below are from our own tiny toy-feature-map run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>1. The metric &amp; benchmark.</b> The end-to-end number is <b>mAP</b> (mean Average Precision) on
       <b>PASCAL VOC 2007 test</b> &mdash; the paper's setup (Table II). But the RPN has its own proxy metric you
       should track first: <b>proposal recall vs. number of proposals</b> (what fraction of ground-truth objects
       has some proposal with IoU $\\ge 0.5$). The "no-skill" floor is a <b>fixed sliding-window / no-learning</b>
       proposer at the same proposal count; the bar to beat is <b>Selective Search</b>, which the paper reports at
       <b>58.7%</b> mAP with 2,000 proposals.</p>
       <ul>
        <li><b>2. Sanity checks before the full run.</b> (a) <b>Shapes:</b> cls output is $(B,2k,H,W)$ and reg is
        $(B,4k,H,W)$ &mdash; with $k=9$ that is 18 and 36 channels; getting 2 and 4 means you dropped the $k$.
        (b) <b>Anchor count</b> $=WHk$ &mdash; for a $50\\times38$ map, $17{,}100$. (c) <b>Decode round-trip:</b>
        encode a known box to deltas with Eq 2, decode it back, and confirm you recover the box to floating
        point &mdash; this catches a missing $\\exp$ or a wrong anchor-unit divide. (d) <b>Overfit one cell:</b>
        the toy fit (assign one anchor per target, smooth-L1) should drive box loss to <b>~0</b> in a few hundred
        steps; if it plateaus, the head or the target encoding is wrong. (e) <b>cls loss at init</b> $\\approx
        -\\ln(1/2)=0.69$ for the 2-way objectness softmax (rule of thumb).</li>
        <li><b>3. Expected range.</b> A correct full system should land near the paper's <b>59.9%</b> mAP on VOC
        2007 with 300 RPN proposals (Table II) &mdash; matching/beating Selective Search at 58.7%. These are the
        paper's reported figures, approximate targets to aim at; our toy run reports no mAP (random feature map,
        no backbone). Being a few points under is tuning (anchor scales, NMS threshold, sample ratio); being
        $\\gt 20$ points under, or near random recall, means a wiring bug.</li>
        <li><b>4. Ablation &mdash; prove the key idea earns its keep.</b> The central knob is the <b>anchor set</b>.
        Drop $k=9$ to <b>$k=1$</b> (a single square anchor) and the per-cell box loss must <b>rise</b> &mdash; in
        our toy run it plateaus around <b>0.06</b> while $k=9$ falls to ~0, because one box output cannot fit a
        square, a wide, and a tall object at once (&sect;3.1.1). On the full detector, collapsing to 1 anchor (or
        removing the multi-scale/aspect set) should drop proposal recall and mAP; if it does not, your anchors are
        not actually feeding distinct predictions.</li>
        <li><b>5. Failure signals &amp; what they mean.</b> <b>Recall flat near the no-learning floor</b> &rarr;
        anchors centered at the origin instead of each cell's center $((j{+}0.5)\\,\\text{stride},(i{+}0.5)\\,
        \\text{stride})$, breaking translation invariance. <b>Negative or exploding widths</b> &rarr; you added
        $t_w$ instead of applying $e^{t_w}$ in decode. <b>Box loss won't fall</b> &rarr; you trained the regressor
        on background anchors (forgot the $p_i^\\ast$ gate) or mismatched the target encoding. <b>cls perfect but
        boxes garbage</b> &rarr; the reg branch is not connected to the loss, or you read RPN objectness as a class
        score (it is object-vs-background only; the class comes from the Fast R-CNN head).</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code> (the $3\\times3$ sliding
       window and the two $1\\times1$ heads), <code>nn.ReLU</code>, the optimizer, and
       <code>F.smooth_l1_loss</code> / <code>F.cross_entropy</code> for the loss. <b>Build by hand:</b> the
       <b>anchor generator</b> (the $WHk$ reference boxes), the <b>RPN head</b> wiring (one $3\\times3$ + two
       siblings of width $2k$ and $4k$), the <b>decode</b> that inverts Eq 2, and the
       <b>$k=9$-vs-$k=1$ ablation</b>. We do <i>not</i> re-derive IoU, non-max suppression, or the general
       box-regression idea &mdash; those live in <b>dl-object-detection</b>; here we recap and link. We use a
       toy random feature map (no real backbone training) so the focus stays on the RPN and anchors.</p>`,
    pitfalls:
      `<ul>
        <li><b>Gating the box loss by $p_i^\\ast$.</b> Equation 1's second term multiplies by $p_i^\\ast$, so the
        box-regression loss applies <i>only to positive anchors</i>. Train the regressor on background anchors
        and you are fitting boxes to non-objects &mdash; the loss is meaningless and training degrades.</li>
        <li><b>Forgetting log-space for size.</b> $t_w,t_h$ are $\\log$ ratios, so you must <b>exponentiate</b>
        when decoding ($w = w_a e^{t_w}$). Skipping the $\\exp$ (or doing $w = w_a + t_w$) produces wrong, and
        possibly negative, widths.</li>
        <li><b>Center shift is in anchor units.</b> $t_x = (x-x_a)/w_a$ is divided by the anchor <i>width</i>
        (and $t_y$ by the height), not by a constant. Decode with $x = t_x w_a + x_a$, not $x = t_x + x_a$.</li>
        <li><b>cls is $2k$, reg is $4k$ &mdash; per anchor.</b> The two heads output a value <i>for every one of
        the $k$ anchors</i> at each location. Sizing them to $2$ and $4$ (forgetting the $k$) collapses all
        anchors into one prediction.</li>
        <li><b>objectness is not the class.</b> The RPN only says object-vs-background. The object's actual
        category comes later from the Fast R-CNN head. Treating RPN scores as class scores is a common
        misread.</li>
        <li><b>Anchors must move with the cell.</b> Each cell's anchors are centered at <i>that cell's</i>
        image-pixel center $((j{+}0.5)\\cdot\\text{stride},\\,(i{+}0.5)\\cdot\\text{stride})$. Centering all
        anchors at the origin breaks the translation-invariance the design relies on.</li>
      </ul>`,
    recall: [
      "Write Eq 1 (the RPN multi-task loss) from memory. Why is the box term multiplied by $p_i^\\ast$?",
      "State the four decode formulas (inverse of Eq 2). Why is the size change in log/exp space?",
      "What are the cls and reg layer output dimensions, and why $2k$ and $4k$?",
      "Define an anchor, and give the default $k$ and its 3 scales &times; 3 aspect ratios.",
      "How is an anchor labeled positive vs negative? (the IoU thresholds)"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> One feature cell faces three overlapping objects of different shapes &mdash; a
            square, a wide one, a tall one. Your RPN with $k=9$ anchors fits all three. Shrink to $k=1$ (one
            square anchor per cell, so one box output) and refit. What happens to the total box loss, and what
            does that show about why the RPN needs <i>multiple</i> anchors?`,
        steps: [
          { do: `Set the anchor set to a single $1{:}1$ square per cell ($k=1$); keep the feature map, head, optimizer, the three targets, and the seed otherwise identical.`, why: `An honest ablation changes exactly one thing &mdash; the anchor count/shapes &mdash; so any difference is attributable to it.` },
          { do: `Refit and compare the summed box-regression loss over the three targets: $k=9$ drops to ~0 (each shape gets its own anchor); $k=1$ plateaus high (~0.06).`, why: `Each anchor's reg head produces ONE box. With $k=9$ a near-right-shape anchor exists for each object; with $k=1$ the cell has a single box output that is pulled toward square, wide, AND tall at once &mdash; an average that fits none (&sect;3.1.1).` },
          { do: `Conclude the multiple anchors, not extra capacity, let one location predict several differently-shaped boxes; the gap is what they are worth.`, why: `Both runs share the head and fitting; only the anchor set differs, isolating it as the cause.` }
        ],
        answer: `<p>With $k=1$ the cell has a single box output, but three differently-shaped targets pull its
                 predicted deltas in conflicting directions &mdash; the best it can do is an average box that
                 fits none of them, so the summed smooth-L1 loss plateaus high (in our run ~0.06). With $k=9$
                 each object is assigned a distinct anchor whose shape is already close, so all three are fit and
                 the total loss falls to ~0. This is precisely why &sect;3.1.1 places $k$ anchors per location:
                 a single $1\\times1$ predictor can only emit a fixed number of boxes per cell, so to detect
                 several objects of different sizes/shapes at the same position you need several anchors. Since
                 the two runs differ only in the anchor set, the gap isolates the multi-anchor design. The
                 CODEVIZ panel shows it.</p>`
      },
      {
        q: `A feature map is $W\\times H = 50\\times38$ and the RPN uses $k=9$ anchors. How many anchors are
            placed over the image? What are the output channel counts of the cls and reg $1\\times1$ conv
            layers? (Per &sect;3.1 / 3.1.1.)`,
        steps: [
          { do: `Total anchors $= W\\,H\\,k = 50\\times38\\times9$.`, why: `Each of the $WH$ feature cells gets $k$ anchors (&sect;3.1.1: "there are $WHk$ anchors in total").` },
          { do: `Compute: $50\\times38 = 1900$ cells; $1900\\times9 = 17{,}100$ anchors.`, why: `Just multiply the grid size by the per-cell anchor count.` },
          { do: `cls conv: $2k = 18$ output channels; reg conv: $4k = 36$ output channels.`, why: `cls emits an object/background pair per anchor ($2k$); reg emits the four deltas per anchor ($4k$) (&sect;3.1).` }
        ],
        answer: `<p>$WHk = 50\\times38\\times9 = 17{,}100$ anchors. The cls $1\\times1$ conv has $2k = 18$ output
                 channels (object-vs-background per anchor) and the reg $1\\times1$ conv has $4k = 36$ output
                 channels (the four box deltas per anchor). The spatial size of both output maps stays
                 $50\\times38$ &mdash; one prediction vector per cell.</p>`
      },
      {
        q: `An anchor is $x_a{=}100,\\,y_a{=}80,\\,w_a{=}128,\\,h_a{=}64$. The RPN predicts deltas
            $t=(t_x,t_y,t_w,t_h)=(0,\\,0.5,\\,0,\\,\\log 2)$. Decode the proposed box (center, width, height),
            using the inverse of Eq 2.`,
        steps: [
          { do: `Center $x = t_x w_a + x_a = 0\\cdot128 + 100 = 100$; $y = t_y h_a + y_a = 0.5\\cdot64 + 80 = 32 + 80 = 112$.`, why: `Center shift is in anchor-size units: $t_y=0.5$ moves down by half the anchor height (Eq 2 inverse).` },
          { do: `Width $w = w_a e^{t_w} = 128\\cdot e^{0} = 128$; height $h = h_a e^{t_h} = 64\\cdot e^{\\log 2} = 64\\cdot 2 = 128$.`, why: `Size change is in log space, so decoding exponentiates; $e^{\\log 2}=2$ doubles the height.` },
          { do: `Report the box: center $(100,112)$, size $128\\times128$.`, why: `Combining the decoded center and size gives the proposed box.` }
        ],
        answer: `<p>Center $(x,y) = (100,\\,112)$: $t_x=0$ leaves $x$ at $100$; $t_y=0.5$ shifts $y$ down by half
                 the anchor height ($0.5\\cdot64=32$) to $112$. Size $w\\times h = 128\\times128$: $t_w=0$ keeps
                 the width at $128$; $t_h=\\log 2$ doubles the height to $128$. So a $128\\times64$ anchor became
                 a $128\\times128$ box, shifted down by 32 pixels &mdash; the $\\log/\\exp$ parametrization makes
                 "double the height" a clean $t_h=\\log 2$.</p>`
      }
    ]
  });

  window.CODE["paper-faster-rcnn"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the anchor generator and the RPN head by hand, then <b>import</b>
       <code>nn.Conv2d</code> for the $3\\times3$ sliding window and the two $1\\times1$ sibling heads (cls of
       width $2k$, reg of width $4k$). We run the RPN on a <b>toy random feature map</b> (so the focus is the
       RPN, not backbone training), and <b>decode one anchor's box delta</b> &mdash; the first cell reproduces
       the worked example exactly: anchor $(24,24,64,64)$ + delta $(0.5,-0.25,0.2,0)$ &rarr; box centered at
       $(56,8)$ of size $\\approx78.17\\times64$. We then run a small fitting loop where <b>one cell must cover
       three overlapping objects of different shapes</b> (square, wide, tall) and an <b>ablation</b> ($k=9$ vs
       $k=1$): with $k=9$ each shape gets its own anchor and the total box loss drops to ~0, but $k=1$'s single
       box output cannot be all three shapes at once, so its loss plateaus high (~0.06). Paste into Colab and
       run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

torch.manual_seed(0)

# === 0. Worked example: decode ONE anchor + delta (inverse of Eq 2). ===
xa, ya, wa, ha = 24.0, 24.0, 64.0, 64.0          # the 1:1 anchor at feature cell (1,1), stride 16
tx, ty, tw, th = 0.5, -0.25, 0.2, 0.0            # a predicted delta
x = tx * wa + xa                                  # 0.5*64 + 24 = 56
y = ty * ha + ya                                  # -0.25*64 + 24 = 8
w = wa * math.exp(tw)                             # 64*e^0.2 = 78.17
h = ha * math.exp(th)                             # 64*e^0   = 64
print("decoded box  center=(%.2f, %.2f)  size=%.2f x %.2f" % (x, y, w, h))   # (56.00, 8.00) 78.17 x 64.00

# The 3 aspect-ratio anchors at one scale (area = 64^2 = 4096), w=scale*sqrt(r), h=scale/sqrt(r):
scale = 64.0
for r in [1.0, 0.5, 2.0]:                         # 1:1, 1:2, 2:1
    aw, ah = scale * math.sqrt(r), scale / math.sqrt(r)
    print("ratio %3.1f -> w=%.2f h=%.2f (area %.0f)" % (r, aw, ah, aw * ah))

# === 1. Anchor generator: place k anchors at every feature-map cell. ===
def generate_anchors(Wf, Hf, stride, scales, ratios):
    anchors = []
    for i in range(Hf):
        for j in range(Wf):
            cx, cy = (j + 0.5) * stride, (i + 0.5) * stride          # cell center in image pixels
            for s in scales:
                for r in ratios:
                    aw, ah = s * math.sqrt(r), s / math.sqrt(r)      # area = s^2
                    anchors.append([cx, cy, aw, ah])                 # (x_a, y_a, w_a, h_a)
    return torch.tensor(anchors)                                     # (Wf*Hf*k, 4)

# === 2. The RPN head: 3x3 conv (slide) -> 1x1 cls (2k) + 1x1 reg (4k). ===
class RPNHead(nn.Module):
    def __init__(self, C, k, mid=64):
        super().__init__()
        self.conv = nn.Conv2d(C, mid, 3, padding=1)    # the n=3 sliding window (Sec 3.1)
        self.cls  = nn.Conv2d(mid, 2 * k, 1)           # 2k objectness scores per location
        self.reg  = nn.Conv2d(mid, 4 * k, 1)           # 4k box deltas per location
    def forward(self, feat):                           # feat: (B, C, Hf, Wf)
        t = F.relu(self.conv(feat))
        return self.cls(t), self.reg(t)                # (B,2k,Hf,Wf), (B,4k,Hf,Wf)

# === 3. Decode predicted deltas -> boxes (inverse of Eq 2), vectorized. ===
def decode(anchors, deltas):                           # anchors,(N,4) ; deltas,(N,4)=(tx,ty,tw,th)
    xa, ya, wa, ha = anchors.unbind(1)
    tx, ty, tw, th = deltas.unbind(1)
    x = tx * wa + xa
    y = ty * ha + ya
    w = wa * torch.exp(tw)
    h = ha * torch.exp(th)
    return torch.stack([x, y, w, h], dim=1)

# === 4. Toy fitting demo + ABLATION (k=9 vs k=1). ===
# One feature cell faces THREE overlapping objects of different shapes: square, wide, tall.
# Each anchor outputs ONE box, so k=9 can assign one anchor per object; k=1 has only ONE box
# output for the cell and cannot match all three at once -- that is what anchors buy (Sec 3.1.1).
Wf = Hf = 1; stride = 16; C = 8
feat = torch.randn(1, C, Hf, Wf)
targets = torch.tensor([[24.0, 24.0, 64.0, 64.0],      # square (1:1)
                        [24.0, 24.0, 96.0, 48.0],      # wide   (2:1)
                        [24.0, 24.0, 48.0, 96.0]])     # tall   (1:2)

def encode_target(anchor, gt):                         # Eq 2 (target deltas)
    xa, ya, wa, ha = anchor
    x, y, w, h = gt
    return torch.tensor([(x - xa) / wa, (y - ya) / ha,
                         math.log(w / wa), math.log(h / ha)])

def assign(anchors, gts):                              # each gt -> closest-aspect-ratio anchor
    idx = []
    for gt in gts:
        gr = (gt[2] / gt[3]).item()
        idx.append(min(range(len(anchors)),
                       key=lambda a: abs((anchors[a,2]/anchors[a,3]).item() - gr)))
    return idx

def run(scales, ratios, steps=360):
    torch.manual_seed(0)
    k = len(scales) * len(ratios)
    anchors = generate_anchors(Wf, Hf, stride, scales, ratios)        # (k,4)
    idx = assign(anchors, targets)                                    # positive anchor per target
    t_stars = [encode_target(anchors[idx[g]], targets[g]) for g in range(len(targets))]
    head = RPNHead(C, k)
    opt = torch.optim.Adam(head.parameters(), lr=5e-3)
    for _ in range(steps):
        _, reg = head(feat); reg = reg.view(k, 4)                    # (k,4)
        # box loss = sum over the positive anchors, one per target (Eq 1's reg term, p*=1 anchors)
        loss = sum(F.smooth_l1_loss(reg[idx[g]], t_stars[g]) for g in range(len(targets)))
        opt.zero_grad(); loss.backward(); opt.step()
    return loss.item(), idx

loss9, idx9 = run([48.0, 64.0, 96.0], [0.5, 1.0, 2.0])               # k=9
loss1, idx1 = run([64.0], [1.0])                                      # k=1 (single square) -- ABLATION
print("\\nk=9: anchors-per-target", idx9, " total box loss %.4f" % loss9)
print("k=1: anchors-per-target", idx1, " total box loss %.4f" % loss1)
# k=9 assigns a distinct anchor to each shape -> loss ~0. k=1 forces all three targets onto the
# SAME single box output -> it cannot be square AND wide AND tall, so loss plateaus high (~0.06).
# (Our small toy run, not the paper's reported number.)`
  };

  window.CODEVIZ["paper-faster-rcnn"] = {
    question: "When one feature cell faces three overlapping objects of different shapes (square, wide, tall), does an RPN with k=9 anchors fit them all with lower total box loss than the same RPN restricted to k=1 (a single square anchor, so a single box output)?",
    charts: [
      {
        type: "line",
        title: "Toy RPN total box-regression (smooth-L1) loss vs training step — k=9 anchors vs k=1 (ablation)",
        xlabel: "training step",
        ylabel: "total smooth-L1 box loss (3 targets)",
        series: [
          {
            name: "k=9 (3 scales x 3 ratios)",
            color: "#7ee787",
            points: [[0,0.176],[50,0.0002],[100,0.0],[150,0.0],[200,0.0],[250,0.0],[300,0.0],[350,0.0]]
          },
          {
            name: "k=1 (single square anchor, ablation)",
            color: "#ff7b72",
            points: [[0,0.163],[50,0.0608],[100,0.0606],[150,0.0606],[200,0.0606],[250,0.0606],[300,0.0606],[350,0.0606]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. One feature cell faces THREE overlapping toy objects of different shapes — square (1:1), wide (2:1), tall (1:2). Each anchor's reg head outputs ONE box, so we assign one positive anchor per object and sum their smooth-L1 box losses (Eq 2 targets). WITH k=9 anchors (green) each shape gets its own distinct anchor, so all three are fit and total loss drops to ~0. The ABLATION (red, k=1, a single 1:1 square anchor) gives the cell only ONE box output: it cannot be square AND wide AND tall at once, so the loss plateaus around 0.06. Same head, optimizer, targets, and seed; the only difference is the anchor set — which is exactly the why-many-anchors role Sec 3.1.1 gives them: predict k boxes per location to cover multiple sizes/shapes.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, math
torch.manual_seed(0)

def generate_anchors(Wf, Hf, stride, scales, ratios):
    out = []
    for i in range(Hf):
        for j in range(Wf):
            cx, cy = (j + 0.5) * stride, (i + 0.5) * stride
            for s in scales:
                for r in ratios:
                    out.append([cx, cy, s * math.sqrt(r), s / math.sqrt(r)])
    return torch.tensor(out)

class RPNHead(nn.Module):
    def __init__(self, C, k, mid=64):
        super().__init__()
        self.conv = nn.Conv2d(C, mid, 3, padding=1)
        self.reg  = nn.Conv2d(mid, 4 * k, 1)          # 4k box deltas
    def forward(self, x): return self.reg(F.relu(self.conv(x)))

Wf = Hf = 1; stride = 16; C = 8
feat = torch.randn(1, C, Hf, Wf)
# Three overlapping targets of different shapes at the SAME cell: square, wide, tall.
targets = torch.tensor([[24.,24.,64.,64.], [24.,24.,96.,48.], [24.,24.,48.,96.]])

def encode(anchor, gt):
    xa, ya, wa, ha = anchor; x, y, w, h = gt
    return torch.tensor([(x-xa)/wa, (y-ya)/ha, math.log(w/wa), math.log(h/ha)])

def assign(anchors, gts):                              # each gt -> closest-aspect-ratio anchor
    out = []
    for gt in gts:
        gr = (gt[2]/gt[3]).item()
        out.append(min(range(len(anchors)), key=lambda a: abs((anchors[a,2]/anchors[a,3]).item()-gr)))
    return out

def curve(scales, ratios, steps=360):
    torch.manual_seed(0)
    k = len(scales) * len(ratios)
    anchors = generate_anchors(Wf, Hf, stride, scales, ratios)
    idx = assign(anchors, targets)                                   # positive anchor per target
    t_stars = [encode(anchors[idx[g]], targets[g]) for g in range(len(targets))]
    head = RPNHead(C, k); opt = torch.optim.Adam(head.parameters(), lr=5e-3); hist = []
    for s in range(steps):
        reg = head(feat).view(k, 4)
        loss = sum(F.smooth_l1_loss(reg[idx[g]], t_stars[g]) for g in range(len(targets)))
        opt.zero_grad(); loss.backward(); opt.step()
        if s % 50 == 0: hist.append(round(loss.item(), 4))
    return hist

print("k=9:", curve([48.,64.,96.], [0.5,1.,2.]))      # -> ~0 (one anchor per shape)
print("k=1:", curve([64.], [1.]))                      # -> plateaus ~0.06 (one box can't be 3 shapes)
# k=9 assigns a distinct anchor to each shape; k=1's single box output can't fit square+wide+tall.
# Our toy run, not the paper's number.`
  };
})();
