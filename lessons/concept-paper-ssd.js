/* Paper lesson — "SSD: Single Shot MultiBox Detector" (Liu et al., 2015/2016).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-ssd".
   GROUNDED from arXiv:1512.02325 (abstract) and the ar5iv HTML mirror (Section 2: Eqn 4 default-box
   scales, the matching strategy in 2.2.1, and the MultiBox loss in 2.2.2).
   Track B (architecture): build multi-scale default-box generation + matching by hand; reproduce the
   QUALITATIVE effect (multi-scale boxes catch both small and large objects; a single scale misses one).
   The detection-pipeline math lives in concept dl-object-detection; here we recap and link.
   Cross-links: paper-yolo (single-stage, single-scale grid) and paper-faster-rcnn (two-stage anchors). */
(function () {
  window.LESSONS.push({
    id: "paper-ssd",
    title: "SSD — Single Shot MultiBox Detector (2015)",
    tagline: "Tile fixed default boxes over feature maps at several scales, and in one pass predict a class and a box offset for each.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Wei Liu, Dragomir Anguelov, Dumitru Erhan, Christian Szegedy, Scott Reed, Cheng-Yang Fu, Alexander C. Berg",
      org: "UNC Chapel Hill, Zoox, Google, University of Michigan",
      year: 2015,
      venue: "arXiv:1512.02325 (Dec 2015); ECCV 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1512.02325",
      code: "https://github.com/weiliu89/caffe/tree/ssd"
    },
    conceptLink: "dl-object-detection",
    partOf: [],
    prereqs: ["dl-object-detection", "dl-conv", "pt-cnn", "pt-nn-module", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p><b>Object detection</b> means: in one image, draw a tight box around every object and label each
       one. Before SSD, the accurate way to do this was a <b>two-stage</b> pipeline (the R-CNN family, see
       the <code>paper-faster-rcnn</code> lesson): stage one proposes a few hundred candidate regions that
       <i>might</i> contain something, stage two crops and re-classifies each. That worked well but was slow,
       because the network runs many times per image and the two stages are wired together awkwardly.</p>
       <blockquote>"Current state-of-the-art object detection systems &hellip; hypothesize bounding boxes,
       resample pixels or features for each box, and apply a high-quality classifier. &hellip; Although
       accurate, these approaches have been too computationally intensive for embedded systems and, even with
       high-end hardware, too slow for real-time applications." (&sect;1)</blockquote>
       <p>The single-stage alternative of the day, <b>YOLO</b> (see <code>paper-yolo</code>), was fast but
       predicted boxes from a single coarse grid, so it struggled with small objects and with objects whose
       shapes did not fit that one grid. SSD asks: can we get YOLO's one-pass speed <i>and</i> Faster R-CNN's
       accuracy, by predicting at <b>several scales at once</b>?</p>`,
    contribution:
      `<ul>
        <li><b>Default boxes (anchors) tiled over the feature map.</b> At every cell of a convolutional
        feature map SSD lays down a small fixed set of <b>default boxes</b> of preset shapes (aspect ratios)
        and sizes. For each default box the network predicts one <b>class score per category</b> and four
        numbers that <b>offset</b> the box to fit the real object. No separate proposal stage.</li>
        <li><b>Multi-scale prediction from multiple feature maps.</b> SSD attaches these predictors to several
        feature maps of decreasing resolution. A high-resolution early map (many small cells) detects
        <b>small</b> objects; a low-resolution late map (few large cells) detects <b>large</b> ones. One
        forward pass covers many object sizes &mdash; the "single shot" in the name.</li>
        <li><b>One simple training loss.</b> A single objective combines a <b>softmax classification</b> loss
        with a <b>smooth-L1 localization</b> loss over the matched default boxes, plus <b>hard negative
        mining</b> so the huge majority of background boxes do not swamp the signal.</li>
      </ul>`,
    whyItMattered:
      `<p>SSD made fast, accurate, single-stage detection mainstream. Its "predict at several feature-map
       scales from fixed anchors" recipe became a template: <b>RetinaNet</b> (with Focal Loss) and the
       <b>Feature Pyramid Network (FPN)</b> are direct descendants, and the modern single-stage detectors
       (the later YOLO versions, EfficientDet) all inherit the multi-scale-anchor idea. When you hear
       "anchor-based one-stage detector," SSD is the archetype.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the speed/accuracy argument against two-stage proposals.</li>
        <li><b>&sect;2.1 (Model)</b> &mdash; the multi-scale feature maps and how default boxes tile each one
        (Fig. 1 and Fig. 2 show the 8&times;8 and 4&times;4 maps with their boxes).</li>
        <li><b>&sect;2.2 (Training)</b> &mdash; the four sub-parts you will implement: the <b>matching
        strategy</b> (&sect;2.2.1), the <b>training objective</b> / MultiBox loss (&sect;2.2.2, Eqns 1&ndash;3),
        the <b>scale &amp; aspect-ratio formula</b> for default boxes (Eqn 4 in "Choosing scales and aspect
        ratios"), and <b>hard negative mining</b> (&sect;2.2.4).</li>
       </ul>
       <p><b>Skim:</b> &sect;3 (the exact VGG-16 backbone layer table and the PASCAL VOC / COCO result tables)
       and the data-augmentation appendix &mdash; useful but not needed to understand the core idea. The math
       you must own is Eqn 4 (box sizes) and Eqns 1&ndash;3 (the loss).</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Suppose you tile default boxes at <b>only one scale</b> &mdash; say medium-sized boxes on a coarse
       grid. You then test on images containing both <b>tiny</b> objects and <b>large</b> objects. Before
       running, predict: for which object sizes will a default box actually <b>match</b> a ground-truth box
       (overlap enough to be a positive example)? Will single-scale boxes catch tiny objects, large objects,
       both, or neither? Write your guess, then run the ablation below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>make_default_boxes(grid, side)</code> &mdash; for a feature map of size
        <code>grid&times;grid</code>, place one box of side <code>side</code> at each cell center.
        TODO: the center of cell <code>(i, j)</code> is <code>((j+0.5)/grid, (i+0.5)/grid)</code>
        (normalized to 0&ndash;1). Return boxes as <code>(cx, cy, w, h)</code>.</li>
        <li><code>match(default_boxes, gt_boxes)</code> &mdash; TODO: compute the <b>IoU</b> (Intersection over
        Union, a.k.a. Jaccard overlap) between every default box and every ground-truth box; mark a default
        box <b>positive</b> if its best IoU with some ground truth exceeds <b>0.5</b>.</li>
        <li>TODO build <b>multi-scale</b> boxes by concatenating a <i>coarse</i> set of big boxes with a
        <i>fine</i> set of small boxes, and compare matching coverage against a single scale alone.</li>
       </ul>
       <p>Predict which object sizes each box set covers, then check against the printed recall.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>SSD runs a convolutional network once and reads predictions off <b>several feature maps</b> of
       different resolutions. Think of the backbone as producing a stack of grids: an early grid is large
       (say 8&times;8 cells), later grids shrink (4&times;4, 2&times;2, &hellip;). A large grid has many small
       cells &mdash; each cell "sees" a small patch of the image, so it is good at spotting <b>small</b>
       objects. A small grid has a few large cells, each seeing a big patch &mdash; good for <b>large</b>
       objects. (&sect;2.1)</p>
       <p>At every cell of every chosen grid, SSD places a handful of <b>default boxes</b> (also called
       <b>anchors</b>) &mdash; fixed rectangles of preset sizes and shapes, centered on that cell. For each
       default box the network outputs, via a small $3\\times3$ convolution: (a) a <b>class score</b> for each
       of the $C$ object categories plus one "background" score, and (b) <b>four offset numbers</b>
       $(\\Delta cx, \\Delta cy, \\Delta w, \\Delta h)$ that nudge the default box &mdash; shifting its center
       and resizing it &mdash; so it hugs the real object. The default box is the <i>starting guess</i>; the
       network only has to learn the small correction. (&sect;2.1)</p>
       <p>How big should the default boxes at each grid be? SSD sets the <b>scale</b> (the box side as a
       fraction of the image) to grow linearly from the first feature map to the last, so early maps get small
       boxes and late maps get big ones (Eqn 4). At each scale it also makes boxes of several <b>aspect
       ratios</b> (tall, square, wide) so different object shapes have a close-fitting default. (&sect;2.2,
       "Choosing scales and aspect ratios")</p>
       <p>During training, every ground-truth object must be assigned to the default boxes responsible for it.
       This is the <b>matching strategy</b> (&sect;2.2.1): a default box is a <b>positive</b> for a ground
       truth if their <b>Jaccard overlap</b> (IoU) is high enough (threshold 0.5); each ground truth is also
       guaranteed its single best-overlapping box. Every unmatched default box is a <b>negative</b>
       (background). The whole thing is trained with one loss that sums a <b>localization</b> term (how wrong
       the offsets are) and a <b>confidence</b> term (how wrong the class scores are), normalized by the
       number of matched boxes. (&sect;2.2.2)</p>`,
    symbols: [
      { sym: "default box (anchor)", desc: "a plain term, not a symbol: a fixed rectangle of preset size and shape, centered on a feature-map cell, used as the starting guess for a detection." },
      { sym: "IoU / Jaccard overlap", desc: "<b>Intersection over Union</b>: area of overlap between two boxes divided by area of their union. 0 means disjoint, 1 means identical. SSD calls a default box a positive match when this exceeds 0.5." },
      { sym: "$s_k$", desc: "the <b>scale</b> of default boxes at feature-map level $k$: the box's side length as a fraction of the whole image (so $s_k = 0.2$ means a box one-fifth of the image wide)." },
      { sym: "$s_{\\min},\\, s_{\\max}$", desc: "the smallest and largest default-box scales, $0.2$ and $0.9$ in the paper &mdash; the boxes on the first map are $0.2$ of the image, on the last $0.9$." },
      { sym: "$m$", desc: "the number of feature maps used for prediction (the count of grids you read boxes off)." },
      { sym: "$a_r$", desc: "the <b>aspect ratio</b> (width-to-height) of a default box; SSD uses $a_r \\in \\{1, 2, 3, \\tfrac{1}{2}, \\tfrac{1}{3}\\}$ (square, two wide, two tall)." },
      { sym: "$w_k^a,\\, h_k^a$", desc: "the <b>width and height</b> of the default box at level $k$ with aspect ratio $a_r$: $w = s_k\\sqrt{a_r}$, $h = s_k/\\sqrt{a_r}$." },
      { sym: "$s'_k$", desc: "an <b>extra square box</b> added for aspect ratio $1$ at each level, with scale $s'_k = \\sqrt{s_k\\, s_{k+1}}$ &mdash; a size halfway (geometric mean) between this level and the next, giving 6 boxes per cell." },
      { sym: "$|f_k|$", desc: "the side length (in cells) of feature map $k$; cell $(i,j)$ has its box center at $\\big((j{+}0.5)/|f_k|,\\,(i{+}0.5)/|f_k|\\big)$." },
      { sym: "$x_{ij}^p$", desc: "the <b>match indicator</b>: $1$ if default box $i$ is matched to ground-truth box $j$ of class $p$, else $0$." },
      { sym: "$N$", desc: "the <b>number of matched default boxes</b> (positives); the loss is divided by $N$ to average. If $N = 0$ the loss is set to $0$." },
      { sym: "$L_{\\text{conf}},\\, L_{\\text{loc}}$", desc: "the <b>confidence loss</b> (softmax over class scores) and the <b>localization loss</b> (smooth-L1 over box offsets)." },
      { sym: "$\\alpha$", desc: "the weight balancing the two loss terms; set to $1$ by cross-validation in the paper." },
      { sym: "$l,\\, g,\\, d$", desc: "the <b>predicted</b> box ($l$), the <b>ground-truth</b> box ($g$), and the <b>default</b> box ($d$); offsets are predicted relative to $d$." }
    ],
    formula: `$$ s_k = s_{\\min} + \\frac{s_{\\max} - s_{\\min}}{m - 1}\\,(k - 1), \\quad k \\in [1, m] \\qquad\\text{(Eqn. 4)} $$
$$ w_k^a = s_k\\sqrt{a_r}, \\qquad h_k^a = \\frac{s_k}{\\sqrt{a_r}} \\qquad\\text{(box width/height per aspect ratio)} $$
$$ L(x,c,l,g) = \\frac{1}{N}\\Big( L_{\\text{conf}}(x,c) + \\alpha\\, L_{\\text{loc}}(x,l,g) \\Big) \\qquad\\text{(Eqn. 1, the MultiBox loss)} $$`,
    whatItDoes:
      `<p><b>Eqn 4</b> sets the default-box <b>size</b> at each feature-map level. It spaces the scales
       <b>evenly</b> from $s_{\\min}=0.2$ (smallest boxes, on the first/highest-resolution map) up to
       $s_{\\max}=0.9$ (largest boxes, on the last map). Plug in the level number $k$ and you get the box side
       as a fraction of the image. The <b>width/height</b> formulas then stretch that square box into the
       chosen aspect ratios: a fixed area $s_k^2$ reshaped into wide ($a_r{=}2,3$) or tall ($a_r{=}\\tfrac12,
       \\tfrac13$) rectangles by multiplying/dividing by $\\sqrt{a_r}$.</p>
       <p><b>Eqn 1</b> is the single training loss. It adds the <b>confidence</b> loss (are the class scores
       right?) to $\\alpha$ times the <b>localization</b> loss (are the box offsets right?), then divides by
       $N$, the number of matched default boxes, so the loss is an <b>average over positives</b>. Localization
       is only counted for matched boxes; background boxes contribute only to confidence. Setting
       $\\alpha = 1$ weights the two equally.</p>`,
    derivation:
      `<p><b>Short recap &mdash; full detection-pipeline math in the concept lesson.</b> Two pieces deserve a
       quick "why."</p>
       <p><b>Why $\\sqrt{a_r}$ for width/height.</b> We want every aspect-ratio box at a given level to enclose
       the <i>same area</i> $s_k^2$, just reshaped. Set $w = s_k\\sqrt{a_r}$ and $h = s_k/\\sqrt{a_r}$. Then the
       area is $w\\,h = s_k\\sqrt{a_r}\\cdot s_k/\\sqrt{a_r} = s_k^2$ (the $\\sqrt{a_r}$ cancels), and the
       width-to-height ratio is $w/h = a_r$ exactly. So $\\sqrt{a_r}$ is the unique split that fixes both the
       area and the ratio.</p>
       <p><b>Why divide the loss by $N$.</b> The number of matched (positive) default boxes varies wildly from
       image to image. Dividing the total localization + confidence loss by $N$ turns it into an <i>average
       per matched box</i>, so an image with many objects does not dominate the gradient over an image with
       few. (&sect;2.2.2)</p>
       <p>The IoU / matching mechanics, why background boxes vastly outnumber positives (hence hard negative
       mining), and how smooth-L1 offsets decode to pixel boxes are derived in full in the
       <b>dl-object-detection</b> concept lesson &mdash; head there for the pipeline; we only recap here.</p>`,
    example:
      `<p>Work the default-box geometry and one match by hand, with $m = 4$ feature-map levels,
       $s_{\\min} = 0.2$, $s_{\\max} = 0.9$. (These exact numbers are recomputed in the notebook so you can
       check them.)</p>
       <ul class="steps">
        <li><b>Scales (Eqn 4).</b> The even spacing step is $\\frac{0.9 - 0.2}{4 - 1} = \\frac{0.7}{3} =
        0.2333$. So $s_1 = 0.2$, $s_2 = 0.2 + 0.2333 = 0.4333$, $s_3 = 0.6667$, $s_4 = 0.9$. Boxes grow from
        $0.2$ of the image (level 1, for small objects) to $0.9$ (level 4, for large ones).</li>
        <li><b>Aspect-ratio boxes at level 2</b> ($s_2 = 0.4333$). For $a_r = 1$: $w = h = 0.4333$. For
        $a_r = 2$: $w = 0.4333\\sqrt{2} = 0.6128$, $h = 0.4333/\\sqrt{2} = 0.3064$ (wide). For
        $a_r = \\tfrac12$: $w = 0.3064$, $h = 0.6128$ (tall). Check the area is preserved:
        $0.6128 \\times 0.3064 = 0.1877 = 0.4333^2$. The extra $a_r{=}1$ box uses
        $s'_2 = \\sqrt{s_2\\, s_3} = \\sqrt{0.4333 \\times 0.6667} = 0.5375$.</li>
        <li><b>Centers on a $2\\times2$ grid.</b> Cell $(i,j)$ has center $\\big((j{+}0.5)/2,\\,(i{+}0.5)/2\\big)$,
        giving the four points $(0.25,0.25),\\,(0.75,0.25),\\,(0.25,0.75),\\,(0.75,0.75)$.</li>
        <li><b>One match (IoU).</b> Take the square $a_r{=}1$ box of side $0.4333$ at center
        $(0.75,0.75)$ &mdash; corners $(0.533,0.533,0.967,0.967)$ &mdash; against a ground-truth box of size
        $0.5{\\times}0.5$ centered at $(0.75,0.75)$ &mdash; corners $(0.5,0.5,1.0,1.0)$. The overlap rectangle
        is $(0.533,0.533,0.967,0.967)$ with area $0.434^2 = 0.1877$; the union is
        $0.4333^2 + 0.5^2 - 0.1877 = 0.1877 + 0.25 - 0.1877 = 0.25$. So $\\text{IoU} = 0.1877/0.25 \\approx
        \\mathbf{0.751}$, which is $\\gt 0.5$ &mdash; a <b>positive match</b>. The other three centers overlap
        the ground truth not at all (IoU $= 0$), so this is the best-jaccard box for that object.</li>
       </ul>`,
    recipe:
      `<ol>
        <li><b>Generate default boxes</b> per feature-map level: from Eqn 4 get the scale $s_k$, then for each
        aspect ratio $a_r$ build $(w,h) = (s_k\\sqrt{a_r},\\, s_k/\\sqrt{a_r})$; tile one box of each shape at
        every cell center $\\big((j{+}0.5)/|f_k|,\\,(i{+}0.5)/|f_k|\\big)$. Stack the boxes from all levels &mdash;
        that is the <b>multi-scale</b> set.</li>
        <li><b>Predict</b> with a $3\\times3$ conv on each feature map: per default box, $C{+}1$ class scores and
        4 offsets.</li>
        <li><b>Match</b> (&sect;2.2.1): compute IoU of every default box against every ground truth; mark a box
        positive if best IoU $\\gt 0.5$ (and force each ground truth's best box positive). The rest are
        background.</li>
        <li><b>Hard negative mining</b> (&sect;2.2.4): keep only the highest-confidence-loss negatives so that
        negatives:positives is at most $3{:}1$.</li>
        <li><b>Loss</b> (Eqn 1): average over matched boxes the softmax confidence loss plus $\\alpha{=}1$ times
        the smooth-L1 localization loss; backprop.</li>
        <li><b>Ablate</b>: rebuild the default-box set with a <b>single scale</b> only and recompute matching
        coverage &mdash; small (or large) objects lose their matches.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "For $300\\times300$ input, SSD achieves $72.1\\%$ mAP on VOC2007 test at
       $58$ FPS on a Nvidia Titan X and for $500\\times500$ input, SSD achieves $75.1\\%$ mAP, outperforming a
       comparable state of the art Faster R-CNN model." (mAP = mean Average Precision, the standard detection
       accuracy metric; FPS = frames per second.) The abstract adds that the approach "is easy to train and
       straightforward to integrate into systems that require a detection component."</p>
       <p><i>These are the paper's reported figures, quoted from the abstract. The numbers in the CODEVIZ panel
       below are from our own tiny toy run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The primitives ship in PyTorch, so we <b>import</b>
       them and build only SSD's novel composition. <b>Import:</b> <code>nn.Conv2d</code> for the prediction
       heads, the optimizer, and standard tensor ops. <b>Build by hand:</b> (1) the <b>multi-scale
       default-box generator</b> (Eqn 4 scales + the $\\sqrt{a_r}$ width/height + cell-center tiling), (2) the
       <b>IoU / Jaccard matching</b> at threshold 0.5, and (3) the <b>ablation</b> that swaps the multi-scale
       box set for a single scale and shows objects of the off-scale size stop matching. The full detection
       pipeline (decoding offsets to pixel boxes, non-max suppression, mAP) is recapped from the
       dl-object-detection concept lesson, not rebuilt.</p>`,
    pitfalls:
      `<ul>
        <li><b>Confusing the default box with the prediction.</b> The network does <i>not</i> output the box
        directly &mdash; it outputs an <b>offset</b> from a fixed default box. Forget that and your decoded
        boxes land in the wrong place. The default box is the anchor; the 4 offsets move it.</li>
        <li><b>Using one scale for all objects.</b> SSD's whole point is multi-scale. Tile boxes at a single
        size and objects much larger or smaller than that size will never reach IoU $\\gt 0.5$, so they get no
        positive match and are never learned &mdash; exactly the ablation below.</li>
        <li><b>Swapping width and height in $\\sqrt{a_r}$.</b> Width is $s_k\\sqrt{a_r}$, height is
        $s_k/\\sqrt{a_r}$. Flip them and your "wide" boxes become tall; the area still equals $s_k^2$ so it can
        pass a quick sanity check while silently mis-shaping every box.</li>
        <li><b>Forgetting hard negative mining.</b> The overwhelming majority of default boxes are background.
        Train on all of them and the confidence loss is dominated by easy negatives; the model predicts
        "background" for everything. Keep negatives:positives at $\\le 3{:}1$.</li>
        <li><b>Center indexing off by half a cell.</b> The cell center is $\\big((j{+}0.5)/|f_k|\\big)$, not
        $j/|f_k|$. Dropping the $+0.5$ shifts every default box toward the top-left corner, quietly lowering
        every IoU.</li>
      </ul>`,
    recall: [
      "Write the default-box scale formula (Eqn 4) from memory and state $s_{\\min}, s_{\\max}$.",
      "Given scale $s_k$ and aspect ratio $a_r$, what are the box width and height? Why $\\sqrt{a_r}$?",
      "What makes a default box a positive match to a ground-truth box?",
      "Why does SSD read predictions from several feature maps instead of one?",
      "Write the MultiBox loss (Eqn 1) and say what dividing by $N$ does."
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a multi-scale default-box set (coarse big boxes + fine small boxes)
            that matches both small and large objects. Replace it with <b>coarse boxes only</b> (a single
            large scale) and recompute matching coverage on a test set of small and large objects. What
            happens to each object size, and what does that demonstrate about why SSD is multi-scale?`,
        steps: [
          { do: `Keep everything else identical &mdash; same test objects, same IoU&gt;0.5 rule &mdash; and change only the default-box set from multi-scale to coarse-only.`, why: `An honest ablation changes exactly one thing &mdash; the set of scales &mdash; so any difference in coverage is attributable to it.` },
          { do: `Measure the fraction of ground-truth objects that get at least one matched default box (recall), split by small vs large.`, why: `A box can only train an object it actually matches; recall is the geometric ceiling on what the detector can ever learn.` },
          { do: `Observe that coarse-only boxes match large objects but score ~0 on small ones; the fine scale is what recovers the small objects.`, why: `A big default box never reaches IoU&gt;0.5 with a tiny ground-truth box, so small objects go unmatched without a small-scale map.` }
        ],
        answer: `<p>With coarse-only boxes, <b>large</b> objects still match (decent recall) but <b>small</b>
                 objects collapse to ~0 recall &mdash; no default box overlaps them enough. Adding back the
                 fine scale restores the small-object matches while leaving large ones untouched. Since only
                 the box-scale set changed, this isolates <b>multi-scale default boxes</b> as the reason SSD
                 handles objects of many sizes &mdash; the core contribution. The CODEVIZ panel shows exactly
                 this: coarse-only catches large, fine-only catches small, multi-scale catches both.</p>`
      },
      {
        q: `Using $m = 4$, $s_{\\min} = 0.2$, $s_{\\max} = 0.9$, compute the four default-box scales
            $s_1, \\ldots, s_4$. Then give the width and height of the $a_r = 2$ box at level 3.`,
        steps: [
          { do: `Find the step: $(s_{\\max} - s_{\\min})/(m-1) = (0.9 - 0.2)/3 = 0.2333$.`, why: `Eqn 4 spaces the scales evenly; the step is the gap between consecutive levels.` },
          { do: `Add the step: $s_1 = 0.2$, $s_2 = 0.4333$, $s_3 = 0.6667$, $s_4 = 0.9$.`, why: `$s_k = s_{\\min} + \\text{step}\\cdot(k-1)$, so each level is one step larger.` },
          { do: `At level 3, $s_3 = 0.6667$, $a_r = 2$: $w = 0.6667\\sqrt{2} = 0.9428$, $h = 0.6667/\\sqrt{2} = 0.4714$.`, why: `$w = s_k\\sqrt{a_r}$, $h = s_k/\\sqrt{a_r}$; area $= w h = 0.6667^2 = 0.4445$ is preserved.` }
        ],
        answer: `<p>$s_1 = 0.2,\\ s_2 = 0.4333,\\ s_3 = 0.6667,\\ s_4 = 0.9$. The level-3 $a_r{=}2$ box is
                 $w = 0.9428$, $h = 0.4714$ (a wide box), with area $0.4445 = s_3^2$. These match the
                 notebook's first cell.</p>`
      },
      {
        q: `Your worked example matched a square default box of side $0.4333$ at center $(0.75,0.75)$ to a
            $0.5\\times0.5$ ground truth at the same center, giving IoU $\\approx 0.751$. Now shrink the ground
            truth to $0.15\\times0.15$ (a small object) at $(0.75,0.75)$, keeping the same default box. Roughly
            what is the new IoU, and is it still a positive match?`,
        steps: [
          { do: `The small ground truth ($0.15\\times0.15$, area $0.0225$) sits entirely inside the big default box ($0.4333\\times0.4333$, area $0.1877$), so intersection $=$ the small box's area $= 0.0225$.`, why: `When one box is fully contained in the other, the intersection equals the smaller area.` },
          { do: `Union $=$ big area $+$ small area $-$ intersection $= 0.1877 + 0.0225 - 0.0225 = 0.1877$.`, why: `The contained box adds no new area to the union beyond the big box.` },
          { do: `IoU $= 0.0225 / 0.1877 \\approx 0.12$, which is well below $0.5$ &mdash; NOT a positive match.`, why: `A big default box swallows a tiny object but overlaps it by only a small fraction of the union; IoU stays low.` }
        ],
        answer: `<p>IoU $\\approx 0.0225/0.1877 \\approx \\mathbf{0.12}$ &mdash; far below the $0.5$ threshold, so
                 the big default box does <b>not</b> match the small object. This is precisely why SSD needs a
                 <b>fine, small-scale feature map</b>: only a small default box can reach IoU $\\gt 0.5$ with a
                 small ground truth. One scale cannot cover both sizes &mdash; the multi-scale motivation in a
                 single calculation.</p>`
      }
    ]
  });

  window.CODE["paper-ssd"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> SSD's two novel pieces by hand &mdash; the <b>multi-scale default-box
       generator</b> (Eqn 4 scales + the $\\sqrt{a_r}$ width/height + cell-center tiling) and the <b>IoU /
       Jaccard matching</b> at threshold 0.5 &mdash; then run the <b>ablation</b> that swaps the multi-scale
       box set for a single scale. The first cell recomputes the worked example: scales
       $s_1{=}0.2,\\,s_2{=}0.4333,\\,s_3{=}0.6667,\\,s_4{=}0.9$, the level-2 aspect-ratio boxes (area preserved
       at $s_k^2$), and the IoU $\\approx 0.751$ match. Then we measure matching <b>recall</b> (fraction of
       ground-truth objects that get a matched default box) for small vs large objects under coarse-only,
       fine-only, and multi-scale box sets. Paste into Colab and run &mdash; everything is plain tensors, no
       training or download needed.</p>`,
    code: `import torch, math
torch.manual_seed(0)

# --- 0. Worked example: default-box scales (Eqn 4), aspect-ratio boxes, and one IoU match. ---
s_min, s_max, m = 0.2, 0.9, 4
scales = [round(s_min + (s_max - s_min) / (m - 1) * (k - 1), 4) for k in range(1, m + 1)]
print("scales s_k (k=1..4):", scales)          # [0.2, 0.4333, 0.6667, 0.9]

sk = scales[1]                                   # level 2
for a in (1, 2, 3, 0.5, 1/3):
    w, h = sk * math.sqrt(a), sk / math.sqrt(a)
    print(f"  ar={a:.3f}:  w={w:.4f}  h={h:.4f}  area={w*h:.4f}  (= s_k^2 = {sk**2:.4f})")
s_extra = math.sqrt(scales[1] * scales[2])       # extra ar=1 box: sqrt(s_k * s_{k+1})
print(f"  extra ar=1 box side s'_k = sqrt(s2*s3) = {s_extra:.4f}")

def corners(b):                                  # (cx,cy,w,h) -> (x1,y1,x2,y2)
    cx, cy, w, h = b[..., 0], b[..., 1], b[..., 2], b[..., 3]
    return torch.stack([cx - w/2, cy - h/2, cx + w/2, cy + h/2], -1)

def iou_matrix(a, b):                            # a:(N,4) b:(M,4) in (cx,cy,w,h)
    a, b = corners(a)[:, None], corners(b)[None]
    ix1 = torch.max(a[..., 0], b[..., 0]); iy1 = torch.max(a[..., 1], b[..., 1])
    ix2 = torch.min(a[..., 2], b[..., 2]); iy2 = torch.min(a[..., 3], b[..., 3])
    inter = (ix2 - ix1).clamp(min=0) * (iy2 - iy1).clamp(min=0)
    aa = (a[..., 2]-a[..., 0]) * (a[..., 3]-a[..., 1])
    ba = (b[..., 2]-b[..., 0]) * (b[..., 3]-b[..., 1])
    return inter / (aa + ba - inter + 1e-9)

db = torch.tensor([[0.75, 0.75, sk, sk]])        # square ar=1 box at (0.75,0.75)
gt = torch.tensor([[0.75, 0.75, 0.5, 0.5]])      # ground truth 0.5x0.5
print("worked-example IoU (expect ~0.751):", round(iou_matrix(db, gt).item(), 4))


# --- 1. Multi-scale default-box generator (built by hand). ---
def make_default_boxes(grid, side):
    """One square box of size 'side' at each cell center of a grid x grid feature map."""
    boxes = []
    for i in range(grid):
        for j in range(grid):
            boxes.append([(j + 0.5) / grid, (i + 0.5) / grid, side, side])  # cell center
    return torch.tensor(boxes)

db_coarse = make_default_boxes(3, 0.55)          # few big boxes  -> large objects
db_fine   = make_default_boxes(6, 0.22)          # many small boxes -> small objects
db_multi  = torch.cat([db_coarse, db_fine])      # SSD: both scales at once


# --- 2. A test set of objects: 150 small (0.2) + 150 large (0.55), random positions. ---
torch.manual_seed(1)
def gen(n, size):
    out = []
    for _ in range(n):
        cx = torch.rand(1).item() * (1 - size) + size / 2
        cy = torch.rand(1).item() * (1 - size) + size / 2
        out.append([cx, cy, size, size])
    return torch.tensor(out)
small, large = gen(150, 0.20), gen(150, 0.55)
all_obj = torch.cat([small, large])


# --- 3. Matching recall: fraction of ground-truth objects with a matched default box (IoU>0.5). ---
def recall(boxes, gts, thr=0.5):
    best_iou_per_gt = iou_matrix(boxes, gts).max(0).values   # best default box per ground truth
    return (best_iou_per_gt > thr).float().mean().item()

print("\\nMatching recall (IoU>0.5), purely geometric:")
for name, dbset in [("coarse-only", db_coarse), ("fine-only", db_fine), ("multi-scale", db_multi)]:
    print(f"  {name:12s}  small={recall(dbset, small):.3f}  "
          f"large={recall(dbset, large):.3f}  all={recall(dbset, all_obj):.3f}")
# coarse-only   small=0.000  large=0.487  all=0.243   <- misses ALL small objects
# fine-only     small=0.413  large=0.000  all=0.207   <- misses ALL large objects
# multi-scale   small=0.413  large=0.487  all=0.450   <- catches BOTH (the SSD effect)
# (Our small run, not the paper's reported number.)`
  };

  window.CODEVIZ["paper-ssd"] = {
    question: "Do multi-scale default boxes match both small and large objects, where a single scale matches only one size?",
    charts: [
      {
        type: "bar",
        title: "Default-box matching recall (IoU>0.5) by object size — coarse-only vs fine-only vs multi-scale",
        xlabel: "default-box set",
        ylabel: "fraction of objects with a matched box",
        series: [
          {
            name: "small objects (0.20)",
            color: "#7ee787",
            points: [["coarse-only", 0.000], ["fine-only", 0.413], ["multi-scale", 0.413]]
          },
          {
            name: "large objects (0.55)",
            color: "#ff7b72",
            points: [["coarse-only", 0.487], ["fine-only", 0.000], ["multi-scale", 0.487]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. 300 toy objects (150 small at scale 0.20, 150 large at 0.55) at random positions, matched against three default-box sets by IoU&gt;0.5: a coarse 3&times;3 grid of big boxes (side 0.55), a fine 6&times;6 grid of small boxes (side 0.22), and their union. <b>Coarse-only</b> catches large objects (0.487) but ZERO small ones &mdash; a big box never overlaps a tiny object enough. <b>Fine-only</b> is the mirror image: small 0.413, large 0.000. <b>Multi-scale</b> catches both (small 0.413, large 0.487), lifting overall recall from ~0.24 to 0.45. This is SSD's core thesis in one chart: predicting from several feature-map scales is what lets one pass cover objects of many sizes.",
    code: `import torch
torch.manual_seed(0)

# Reproduces SSD's qualitative multi-scale effect: a single default-box scale covers
# only one object size; the multi-scale union covers both. Purely geometric (matching).
def make_default_boxes(grid, side):
    return torch.tensor([[(j + 0.5) / grid, (i + 0.5) / grid, side, side]
                         for i in range(grid) for j in range(grid)])

def corners(b):
    cx, cy, w, h = b[..., 0], b[..., 1], b[..., 2], b[..., 3]
    return torch.stack([cx - w/2, cy - h/2, cx + w/2, cy + h/2], -1)

def iou_matrix(a, b):
    a, b = corners(a)[:, None], corners(b)[None]
    ix1 = torch.max(a[..., 0], b[..., 0]); iy1 = torch.max(a[..., 1], b[..., 1])
    ix2 = torch.min(a[..., 2], b[..., 2]); iy2 = torch.min(a[..., 3], b[..., 3])
    inter = (ix2 - ix1).clamp(min=0) * (iy2 - iy1).clamp(min=0)
    aa = (a[..., 2]-a[..., 0]) * (a[..., 3]-a[..., 1])
    ba = (b[..., 2]-b[..., 0]) * (b[..., 3]-b[..., 1])
    return inter / (aa + ba - inter + 1e-9)

db_coarse = make_default_boxes(3, 0.55)
db_fine   = make_default_boxes(6, 0.22)
db_multi  = torch.cat([db_coarse, db_fine])

torch.manual_seed(1)
def gen(n, size):
    return torch.tensor([[torch.rand(1).item() * (1 - size) + size/2,
                          torch.rand(1).item() * (1 - size) + size/2, size, size]
                         for _ in range(n)])
small, large = gen(150, 0.20), gen(150, 0.55)

def recall(boxes, gts, thr=0.5):
    return (iou_matrix(boxes, gts).max(0).values > thr).float().mean().item()

for name, db in [("coarse-only", db_coarse), ("fine-only", db_fine), ("multi-scale", db_multi)]:
    print(f"{name:12s}  small={recall(db, small):.3f}  large={recall(db, large):.3f}")
# coarse-only   small=0.000  large=0.487
# fine-only     small=0.413  large=0.000
# multi-scale   small=0.413  large=0.487   (catches both -> the SSD effect)`
  };
})();
