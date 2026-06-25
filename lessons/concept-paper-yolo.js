/* Paper lesson — "You Only Look Once: Unified, Real-Time Object Detection" (YOLO), Redmon et al. 2015.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-yolo".
   GROUNDED from arXiv:1506.02640 via the ar5iv HTML mirror (Section 2: grid + tensor;
   Eqn. 1 class-specific confidence; Section 2.2 Eqn. 3 multi-part loss; Section 2.3 NMS).
   Track B (architecture): implement the S×S grid prediction, decode one cell's box, compute
   IoU, and run non-max suppression on a toy example with plain tensors. IoU math lives in the
   dl-object-detection concept; here we recap it. */
(function () {
  window.LESSONS.push({
    id: "paper-yolo",
    title: "YOLO — You Only Look Once: Unified, Real-Time Object Detection (2015)",
    tagline: "Detect every object in one network pass by predicting a grid of boxes plus classes at once.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Joseph Redmon, Santosh Divvala, Ross Girshick, Ali Farhadi",
      org: "University of Washington, Allen Institute for AI, Facebook AI Research",
      year: 2015,
      venue: "arXiv:1506.02640 (Jun 2015); CVPR 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1506.02640",
      code: "https://pjreddie.com/darknet/yolo/"
    },
    conceptLink: "dl-object-detection",
    partOf: [],
    prereqs: ["dl-object-detection", "dl-conv", "pt-cnn", "dl-cross-entropy"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the best object detectors worked in <b>stages</b>. <b>Object detection</b> means
       drawing a box around every object in an image and labelling each box with a class (e.g. "dog",
       "car"). The leading systems &mdash; the R-CNN family &mdash; first proposed thousands of candidate
       regions, then ran a classifier on each region one at a time, then cleaned up the boxes with separate
       steps. The paper sums up the cost (&sect;1):</p>
       <blockquote>"These complex pipelines are slow and hard to optimize because each individual component
       must be trained separately."</blockquote>
       <p>Slow means not real-time: you could not run them on a live video stream. Hard to optimize means
       the parts (region proposer, classifier, box refiner) were tuned in isolation rather than end to end
       toward the one thing you care about &mdash; detection accuracy.</p>`,
    contribution:
      `<ul>
        <li><b>Detection as one regression problem.</b> The paper reframes detection so that "a single
        neural network predicts bounding boxes and class probabilities directly from full images in one
        evaluation" (&sect;1). No region proposals, no per-region classifier &mdash; one forward pass.</li>
        <li><b>The grid output.</b> Split the image into an $S \\times S$ grid; each cell predicts $B$
        boxes (each a position, size, and a confidence) plus one set of class probabilities. The whole
        prediction is a single fixed-size tensor.</li>
        <li><b>Real-time speed, globally reasoned.</b> Because it sees the whole image at once, YOLO uses
        global context (fewer false positives on background) and runs in real time &mdash; the paper reports
        "45 frames per second" for the base model and "155 frames per second" for Fast YOLO (abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>YOLO launched the <b>single-stage detector</b> family &mdash; one network, one pass, boxes and
       classes out the other end. SSD, RetinaNet, and the later YOLO versions all build on this "predict a
       dense grid in one shot" idea. It made fast, on-device, and live-video detection practical, and the
       grid-of-predictions design is still the mental model for most real-time detectors today.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Unified Detection)</b> &mdash; the $S \\times S$ grid, the $B$ boxes per cell, the
        five numbers per box $(x, y, w, h, \\text{confidence})$, and the output-tensor shape
        $S \\times S \\times (B \\cdot 5 + C)$. This is the whole representation.</li>
        <li><b>Eqn. 1</b> &mdash; how a box's class probability and its confidence multiply into one
        <b>class-specific confidence score</b> at test time.</li>
        <li><b>&sect;2.2, Eqn. 3</b> &mdash; the multi-part loss you will transcribe: why coordinates are
        up-weighted ($\\lambda_{\\text{coord}}$), why empty-cell confidence is down-weighted
        ($\\lambda_{\\text{noobj}}$), and why width/height use square roots.</li>
        <li><b>Fig. 2</b> &mdash; the picture of the grid, the per-cell boxes, and the class map.</li>
       </ul>
       <p><b>Skim:</b> &sect;2.1 (the exact 24-conv-layer Darknet architecture &mdash; you will import
       convolutions, not hand-build that table), and the experiments (&sect;4) unless you want the VOC
       comparison numbers. The math you need is Eqn. 1, Eqn. 3, and the grid description.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>YOLO's grid lets <b>each cell</b> predict $B$ boxes, and after decoding, the same object is often
       covered by several overlapping boxes (neighbouring cells all fire). Before reading on, guess: what
       cheap, training-free step turns those many overlapping boxes into <b>one box per object</b>? And do
       you expect skipping that step to hurt accuracy a little or a lot?</p>
       <p>(Hint: the paper says this step "adds 2-3% in mAP" &mdash; mAP = mean Average Precision, the
       standard detection accuracy score.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the three functions you will implement. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>decode_cell(pred, row, col, S)</code>: a cell predicts $(x, y, w, h)$ where $x, y$ are
        offsets <i>inside</i> the cell (0..1) and $w, h$ are fractions of the whole image. TODO: convert to
        absolute image coordinates &mdash; $x_{\\text{img}} = (\\text{col} + x) / S$, and the box width is
        just $w$ (already image-relative).</li>
        <li><code>iou(boxA, boxB)</code>: intersection area &divide; union area. TODO: clamp the overlap
        width/height at $0$ so disjoint boxes give IoU $= 0$.</li>
        <li><code>nms(boxes, scores, thr)</code>: <b>non-max suppression</b>. TODO: repeatedly take the
        highest-scoring box, then drop every remaining box whose IoU with it exceeds <code>thr</code>.</li>
       </ul>
       <p>Predict the output of NMS on three boxes where two overlap heavily and one is off on its own.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>YOLO turns the whole detection problem into predicting <b>one tensor</b>. Here is the chain, from
       the paper's &sect;2.</p>
       <p><b>1. The grid.</b> "Our system divides the input image into an $S \\times S$ grid" (&sect;2). If
       the centre of an object falls in a grid cell, that cell is the one responsible for detecting it.</p>
       <p><b>2. What each cell predicts.</b> "Each grid cell predicts $B$ bounding boxes and confidence
       scores for those boxes" (&sect;2). Every box is <b>five numbers</b>: $x, y, w, h$, and a confidence.
       The $(x, y)$ are the box <b>centre</b>, given as an offset inside the cell (so they live in $0..1$);
       $w, h$ are the box width and height as a fraction of the whole image. The <b>confidence</b> is
       defined as $\\Pr(\\text{Object}) * \\text{IOU}_{\\text{pred}}^{\\text{truth}}$ &mdash; "how confident
       the model is that the box contains an object and also how accurate it thinks the box is." If no
       object is in the cell, confidence should be $0$.</p>
       <p><b>3. Class probabilities.</b> "Each grid cell also predicts $C$ conditional class probabilities,
       $\\Pr(\\text{Class}_i \\mid \\text{Object})$" (&sect;2). These are conditioned on a box being present,
       and the paper predicts <i>one</i> set per cell &mdash; shared across that cell's $B$ boxes.</p>
       <p><b>4. The output tensor.</b> Stacking that up, "these predictions are encoded as an
       $S \\times S \\times (B * 5 + C)$ tensor" (&sect;2). For Pascal VOC the paper uses $S = 7$, $B = 2$,
       $C = 20$, giving a $7 \\times 7 \\times 30$ tensor &mdash; the entire output of the network.</p>
       <p><b>5. Test-time score.</b> At test time the cell's class probability is multiplied by each box's
       confidence to get a <b>class-specific confidence</b> per box (Eqn. 1, below). These scores feed a
       final <b>non-maximal suppression</b> (NMS) step that removes duplicate boxes for the same object
       (&sect;2.3): "non-maximal suppression&hellip; adds 2-3% in mAP."</p>
       <p><b>6. Training.</b> The whole tensor is trained with one <b>multi-part squared-error loss</b>
       (Eqn. 3, &sect;2.2) that handles coordinates, sizes, confidence, and classes together &mdash; so the
       single network is optimized end to end for detection.</p>`,
    symbols: [
      { sym: "$S$", desc: "the grid is $S \\times S$ cells across the image. The paper uses $S = 7$ for Pascal VOC." },
      { sym: "$B$", desc: "the number of bounding boxes each cell predicts. The paper uses $B = 2$." },
      { sym: "$C$", desc: "the number of object classes. Pascal VOC has $C = 20$." },
      { sym: "$x, y$", desc: "the predicted box <b>centre</b>, as an offset <i>inside</i> its cell (each in $0..1$). To plot the box you add the cell's row/column and divide by $S$." },
      { sym: "$w, h$", desc: "the box <b>width</b> and <b>height</b>, as a fraction of the whole image's width/height (each in $0..1$)." },
      { sym: "confidence $C_i$ / $\\hat{C}_i$", desc: "a box's <b>objectness</b> score, defined as $\\Pr(\\text{Object}) * \\text{IOU}$. The hat $\\hat{C}_i$ is the network's prediction; $C_i$ is the target. The paper overloads the letter $C$ for both the class count and confidence &mdash; the subscript $i$ marks confidence." },
      { sym: "$\\text{IOU}_{\\text{pred}}^{\\text{truth}}$", desc: "<b>Intersection over Union</b>: the overlap area of the predicted and true box divided by their combined (union) area. $1$ = perfect overlap, $0$ = no overlap." },
      { sym: "$\\Pr(\\text{Class}_i \\mid \\text{Object})$", desc: "the cell's <b>conditional class probability</b>: given that a box here holds an object, the chance it is class $i$. Predicted once per cell." },
      { sym: "$p_i(c)$ / $\\hat{p}_i(c)$", desc: "the class probability for class $c$ in cell $i$: target $p_i(c)$ vs predicted $\\hat{p}_i(c)$." },
      { sym: "$\\mathbb{1}_{i}^{\\text{obj}}$", desc: "an <b>indicator</b> (1 or 0): 1 if an object's centre falls in cell $i$, else 0. Switches on the class loss for that cell." },
      { sym: "$\\mathbb{1}_{ij}^{\\text{obj}}$", desc: "indicator: 1 if box $j$ of cell $i$ is the one <b>responsible</b> for an object (the box with the highest current IoU to the ground truth), else 0." },
      { sym: "$\\mathbb{1}_{ij}^{\\text{noobj}}$", desc: "indicator: 1 if box $j$ of cell $i$ is <i>not</i> responsible for any object (a background box), else 0." },
      { sym: "$\\lambda_{\\text{coord}}$", desc: "weight that <b>up-weights</b> the coordinate loss so localization matters more. The paper sets $\\lambda_{\\text{coord}} = 5$." },
      { sym: "$\\lambda_{\\text{noobj}}$", desc: "weight that <b>down-weights</b> the confidence loss for the many empty boxes, so they do not overwhelm training. The paper sets $\\lambda_{\\text{noobj}} = 0.5$." },
      { sym: "NMS", desc: "<b>non-maximal suppression</b>: a post-processing step that keeps the highest-scoring box and deletes lower-scoring boxes that overlap it too much &mdash; one box per object." },
      { sym: "mAP", desc: "<b>mean Average Precision</b>: the standard single-number object-detection accuracy score (higher is better)." }
    ],
    formula: `$$
\\begin{aligned}
\\lambda_{\\text{coord}} &\\sum_{i=0}^{S^2}\\sum_{j=0}^{B} \\mathbb{1}_{ij}^{\\text{obj}} \\Big[(x_i-\\hat{x}_i)^2 + (y_i-\\hat{y}_i)^2\\Big] \\\\
+\\;\\lambda_{\\text{coord}} &\\sum_{i=0}^{S^2}\\sum_{j=0}^{B} \\mathbb{1}_{ij}^{\\text{obj}} \\Big[(\\sqrt{w_i}-\\sqrt{\\hat{w}_i})^2 + (\\sqrt{h_i}-\\sqrt{\\hat{h}_i})^2\\Big] \\\\
+\\;& \\sum_{i=0}^{S^2}\\sum_{j=0}^{B} \\mathbb{1}_{ij}^{\\text{obj}} (C_i-\\hat{C}_i)^2 \\;+\\; \\lambda_{\\text{noobj}} \\sum_{i=0}^{S^2}\\sum_{j=0}^{B} \\mathbb{1}_{ij}^{\\text{noobj}} (C_i-\\hat{C}_i)^2 \\\\
+\\;& \\sum_{i=0}^{S^2} \\mathbb{1}_{i}^{\\text{obj}} \\sum_{c\\,\\in\\,\\text{classes}} (p_i(c)-\\hat{p}_i(c))^2
\\end{aligned}
\\qquad\\text{(Eqn. 3, \\S2.2)}
$$
$$ \\Pr(\\text{Class}_i \\mid \\text{Object}) * \\Pr(\\text{Object}) * \\text{IOU}_{\\text{pred}}^{\\text{truth}} = \\Pr(\\text{Class}_i) * \\text{IOU}_{\\text{pred}}^{\\text{truth}} \\qquad\\text{(Eqn. 1)} $$`,
    whatItDoes:
      `<p><b>Eqn. 3</b> is one sum-of-squared-errors loss with five terms, all over the grid. <b>Line 1</b>
       penalizes the box-centre error $(x, y)$, but only for the box <i>responsible</i> for an object
       ($\\mathbb{1}_{ij}^{\\text{obj}}$), and up-weighted by $\\lambda_{\\text{coord}} = 5$. <b>Line 2</b>
       does the same for size, but on $\\sqrt{w}, \\sqrt{h}$ &mdash; the square root makes a fixed error
       matter <i>more on small boxes than large ones</i> (&sect;2.2: "our error metric should reflect that
       small deviations in large boxes matter less than in small boxes"). <b>Line 3</b> pushes a responsible
       box's confidence toward its true IoU. <b>Line 4</b> pushes background boxes' confidence toward $0$,
       but down-weighted by $\\lambda_{\\text{noobj}} = 0.5$ because most cells are empty and would otherwise
       dominate. <b>Line 5</b> is the per-cell class loss, switched on only when the cell holds an object.</p>
       <p><b>Eqn. 1</b> is the test-time score: multiply the cell's class probability by the box's confidence
       to get a single <b>class-specific confidence</b> for that box &mdash; "both the probability of that
       class appearing in the box and how well the predicted box fits the object" (&sect;2). These are the
       scores NMS ranks.</p>`,
    derivation:
      `<p><b>Short recap &mdash; IoU is owned by the concept lesson.</b> The one piece of real math inside
       YOLO's prediction is <b>Intersection over Union</b>, which scores how well two boxes overlap:</p>
       <p>$$ \\text{IoU} = \\frac{\\text{area of overlap}}{\\text{area of union}} = \\frac{|A \\cap B|}{|A| + |B| - |A \\cap B|}. $$</p>
       <p>The overlap is a rectangle: its width is $\\max(0,\\, \\min(\\text{right edges}) - \\max(\\text{left
       edges}))$ and likewise for height; multiply for area. The union is the two areas minus that overlap
       (so it is not double-counted). IoU is $1$ when the boxes coincide and $0$ when they are disjoint.
       YOLO uses IoU twice: as the <i>target</i> for a box's confidence (line 3 of the loss), and as the
       overlap test inside NMS. The full IoU walkthrough &mdash; with the interactive box demo &mdash; lives
       in the <b>dl-object-detection</b> concept lesson; we only recap it here.</p>
       <p>The loss itself needs no derivation beyond "squared error on every predicted number, with two
       hand-chosen weights and a square root on sizes," all motivated in &sect;2.2 and reproduced above.</p>`,
    example:
      `<p>Work one cell's box, an IoU, and a tiny NMS by hand &mdash; the notebook recomputes every number.</p>
       <p><b>Step 1 &mdash; decode one cell's box.</b> Use a $S = 7$ grid. Cell (row $3$, col $2$) predicts
       offset centre $x = 0.6$, $y = 0.4$, and size $w = 0.30$, $h = 0.20$ (image-relative). Convert the
       centre to absolute image coordinates (each in $0..1$):</p>
       <ul class="steps">
        <li>$x_{\\text{img}} = (\\text{col} + x)/S = (2 + 0.6)/7 = 2.6/7 \\approx 0.371$.</li>
        <li>$y_{\\text{img}} = (\\text{row} + y)/S = (3 + 0.4)/7 = 3.4/7 \\approx 0.486$.</li>
        <li>Width/height stay image-relative: $w = 0.30$, $h = 0.20$. So the box spans
        $x \\in [0.371 - 0.15,\\; 0.371 + 0.15] = [0.221,\\, 0.521]$ and
        $y \\in [0.486 - 0.10,\\; 0.486 + 0.10] = [0.386,\\, 0.586]$.</li>
       </ul>
       <p><b>Step 2 &mdash; IoU of two boxes.</b> Box P = $[0.221, 0.386, 0.521, 0.586]$ (the one we just
       decoded) and a neighbour box Q = $[0.271, 0.386, 0.571, 0.586]$ (shifted right by $0.05$). Same
       height, equal $w = 0.30$, $h = 0.20$, so each area is $0.30 \\times 0.20 = 0.06$.</p>
       <ul class="steps">
        <li>Overlap width $= \\min(0.521, 0.571) - \\max(0.221, 0.271) = 0.521 - 0.271 = 0.250$.</li>
        <li>Overlap height $= \\min(0.586, 0.586) - \\max(0.386, 0.386) = 0.586 - 0.386 = 0.200$.</li>
        <li>Intersection $= 0.250 \\times 0.200 = 0.050$. Union $= 0.06 + 0.06 - 0.05 = 0.07$.</li>
        <li>$\\text{IoU} = 0.050 / 0.070 \\approx 0.714$.</li>
       </ul>
       <p><b>Step 3 &mdash; NMS on three boxes.</b> Scores: P $= 0.90$, Q $= 0.75$, and a far-off box
       R $= 0.80$ that overlaps neither (IoU with both $= 0$). Use NMS threshold $0.5$.</p>
       <ul class="steps">
        <li>Sort by score: P (0.90), R (0.80), Q (0.75). <b>Keep P</b> (highest).</li>
        <li>Compare the rest to P: IoU(P, Q) $= 0.714 \\gt 0.5$ &rarr; <b>drop Q</b>. IoU(P, R) $= 0 \\le 0.5$
        &rarr; R survives.</li>
        <li>Next highest survivor is R: nothing left to compare. <b>Keep R</b>.</li>
        <li>Result: $\\{P, R\\}$ &mdash; the duplicate Q is gone, the separate object R is kept.</li>
       </ul>`,
    recipe:
      `<ol>
        <li><b>Lay the grid.</b> Treat the network output as an $S \\times S \\times (B \\cdot 5 + C)$
        tensor: each cell holds $B$ boxes (5 numbers each) and $C$ class scores.</li>
        <li><b>Decode each box.</b> For cell (row, col): centre $x_{\\text{img}} = (\\text{col}+x)/S$,
        $y_{\\text{img}} = (\\text{row}+y)/S$; width/height are already image-relative; build corner
        coordinates $[x_1, y_1, x_2, y_2]$.</li>
        <li><b>Score each box.</b> Multiply the box confidence by the cell's class probabilities (Eqn. 1)
        to get a class-specific confidence; threshold out the low ones.</li>
        <li><b>Compute IoU</b> between candidate boxes (overlap area &divide; union area; clamp overlap at 0).</li>
        <li><b>Non-max suppression.</b> Repeatedly take the top-scoring box, keep it, and remove every box
        whose IoU with it exceeds the threshold; repeat on what remains.</li>
        <li><b>Ablate:</b> run detection <i>without</i> NMS and count the duplicate boxes per object to see
        what NMS removes.</li>
      </ol>`,
    results:
      `<p>From the paper (quoted): the base network "processes images in real-time at 45 frames per second"
       and "Fast YOLO processes an astounding 155 frames per second while still achieving double the mAP of
       other real-time detectors" (abstract). On NMS specifically: "Non-maximal suppression can be used to
       fix these multiple detections. While not critical to performance as it is for R-CNN, non-maximal
       suppression adds 2-3% in mAP" (&sect;2.3). YOLO also "makes less than half the number of background
       errors compared to Fast R-CNN" (abstract) thanks to seeing the whole image at once.</p>
       <p><i>These are the paper's reported figures, quoted from the abstract and &sect;2.3. Every number in
       the CODEVIZ panel below is from our own toy run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The heavy plumbing &mdash; convolutions that turn an
       image into the grid tensor &mdash; already ships in PyTorch, so you <b>import</b> it and build only the
       novel reasoning on top. <b>Import:</b> <code>nn.Conv2d</code> and friends (a tiny conv stem that
       outputs an $S \\times S \\times (B \\cdot 5 + C)$ tensor). <b>Build by hand:</b> the <b>decode</b>
       (cell offsets &rarr; absolute box corners), the <b>IoU</b>, the <b>class-specific confidence</b>
       (Eqn. 1), and <b>non-max suppression</b> &mdash; the actual ideas of the paper &mdash; plus the
       <b>ablation</b> that turns NMS off. We do not retrain Darknet on VOC; instead we feed a hand-built
       toy grid so the decode/IoU/NMS numbers are exactly the worked example and you can check them. The IoU
       formula is recapped from the dl-object-detection concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to add the cell offset.</b> The predicted $x, y$ are offsets <i>inside</i> a cell
        ($0..1$), not image coordinates. <b>Fix:</b> $x_{\\text{img}} = (\\text{col}+x)/S$ before plotting or
        computing IoU &mdash; otherwise every box piles up in the top-left.</li>
        <li><b>Mixing up which numbers are image-relative.</b> $w, h$ are already fractions of the whole
        image; only $x, y$ need the cell offset. Dividing $w, h$ by $S$ too shrinks every box.</li>
        <li><b>Not clamping the IoU overlap at zero.</b> For disjoint boxes the raw overlap width or height
        goes negative; multiply two negatives and you get a phantom positive intersection. <b>Fix:</b>
        <code>max(0, ...)</code> on both overlap dimensions.</li>
        <li><b>Treating the square-root in the loss as optional.</b> $(\\sqrt{w}-\\sqrt{\\hat w})^2$ is
        deliberate (&sect;2.2): it makes the same pixel error cost more on small boxes. Using raw $w, h$
        under-penalizes errors on small objects.</li>
        <li><b>Confusing the two confidences.</b> A box's <i>confidence</i> is objectness
        ($\\Pr(\\text{Object})*\\text{IoU}$). The <i>class-specific confidence</i> (Eqn. 1) is that times the
        class probability. NMS ranks the <b>class-specific</b> scores, not raw objectness.</li>
        <li><b>Letting empty cells dominate.</b> Most of the $S^2 \\cdot B$ boxes contain no object; without
        $\\lambda_{\\text{noobj}} = 0.5$ their confidence loss swamps the gradient and pushes all confidences
        to $0$.</li>
      </ul>`,
    recall: [
      "State the output-tensor shape $S \\times S \\times (B \\cdot 5 + C)$ and the VOC values that make it $7\\times7\\times30$.",
      "Write the class-specific confidence score (Eqn. 1) from memory.",
      "Define $\\lambda_{\\text{coord}}$ and $\\lambda_{\\text{noobj}}$ and say why each is set the way it is.",
      "Explain in one sentence what non-max suppression does and why YOLO needs it."
    ],
    practice: [
      {
        q: `<b>Decode a cell.</b> On a $S=7$ grid, cell (row $1$, col $5$) predicts centre offset
            $x=0.2$, $y=0.8$ and size $w=0.14$, $h=0.28$. Give the box's absolute centre and its corner
            coordinates $[x_1,y_1,x_2,y_2]$.`,
        steps: [
          { do: `Centre: $x_{\\text{img}}=(5+0.2)/7=5.2/7\\approx0.743$, $y_{\\text{img}}=(1+0.8)/7=1.8/7\\approx0.257$.`, why: `$x,y$ are offsets inside the cell; add the column/row and divide by $S$ to get image coordinates.` },
          { do: `Half-sizes: $w/2=0.07$, $h/2=0.14$ (already image-relative).`, why: `Width/height are fractions of the whole image, so they are not divided by $S$.` },
          { do: `Corners: $x_1=0.743-0.07=0.673$, $x_2=0.743+0.07=0.813$; $y_1=0.257-0.14=0.117$, $y_2=0.257+0.14=0.397$.`, why: `A box centred at $(x,y)$ with width $w$, height $h$ spans $[x-w/2,x+w/2]\\times[y-h/2,y+h/2]$.` }
        ],
        answer: `<p>Centre $\\approx(0.743,\\,0.257)$; corners
                 $[x_1,y_1,x_2,y_2]\\approx[0.673,\\,0.117,\\,0.813,\\,0.397]$. The cell offset moves the box
                 to the right side of the image; $w,h$ stay image-relative.</p>`
      },
      {
        q: `<b>IoU.</b> Box A $=[0.20,0.20,0.50,0.60]$ and box B $=[0.30,0.30,0.60,0.70]$ (all
            $[x_1,y_1,x_2,y_2]$). Compute their IoU.`,
        steps: [
          { do: `Areas: $A=(0.50-0.20)(0.60-0.20)=0.30\\times0.40=0.12$; $B=(0.60-0.30)(0.70-0.30)=0.30\\times0.40=0.12$.`, why: `Box area is width times height from the corners.` },
          { do: `Overlap width $=\\min(0.50,0.60)-\\max(0.20,0.30)=0.50-0.30=0.20$; overlap height $=\\min(0.60,0.70)-\\max(0.20,0.30)=0.60-0.30=0.30$.`, why: `The intersection rectangle runs from the larger left/top edge to the smaller right/bottom edge; clamp at 0 if negative.` },
          { do: `Intersection $=0.20\\times0.30=0.06$; union $=0.12+0.12-0.06=0.18$; IoU $=0.06/0.18\\approx0.333$.`, why: `Union subtracts the shared area so it is not counted twice.` }
        ],
        answer: `<p>$\\text{IoU}=0.06/0.18=1/3\\approx0.333$. They overlap moderately &mdash; below a typical
                 NMS threshold of $0.5$, so NMS would keep both as separate detections.</p>`
      },
      {
        q: `<b>The NMS ablation.</b> You run the toy detector and get four boxes for what is really two
            objects: two boxes tightly overlapping object 1 (scores $0.92$ and $0.81$, IoU $0.78$) and two
            tightly overlapping object 2 (scores $0.88$ and $0.70$, IoU $0.65$); cross-object IoUs are $0$.
            With NMS threshold $0.5$: how many boxes survive WITH NMS vs WITHOUT, and what does that show?`,
        steps: [
          { do: `WITHOUT NMS: keep all four boxes.`, why: `No suppression step runs, so every above-threshold detection is reported &mdash; including the duplicates.` },
          { do: `WITH NMS: keep $0.92$ (top), drop $0.81$ (IoU $0.78\\gt0.5$ with it); then keep $0.88$, drop $0.70$ (IoU $0.65\\gt0.5$).`, why: `NMS keeps the highest-scoring box per cluster and removes overlapping lower-scoring boxes.` },
          { do: `Result: 2 boxes with NMS, 4 without &mdash; one clean box per object vs doubled detections.`, why: `The paper notes NMS "adds 2-3% in mAP" by removing exactly these duplicates (&sect;2.3).` }
        ],
        answer: `<p><b>With NMS: 2 boxes; without: 4.</b> NMS collapses each over-counted cluster to its
                 single best box, so each object is reported once. Turning NMS off doubles the detections
                 here &mdash; the ablation reproduces, on toy data, why the paper keeps NMS (it "adds 2-3%
                 in mAP"). The CODEVIZ panel shows this count drop.</p>`
      }
    ]
  });

  window.CODE["paper-yolo"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>import</b> a tiny conv stem (<code>nn.Conv2d</code>) that emits an
       $S \\times S \\times (B\\cdot5+C)$ grid tensor, then <b>build by hand</b> the four ideas of the paper:
       <b>decode</b> a cell's box (offset &rarr; absolute corners), <b>IoU</b>, the <b>class-specific
       confidence</b> (Eqn. 1), and <b>non-max suppression</b>. To make the numbers checkable we overwrite
       the conv output with the lesson's worked grid, so the first cells reproduce the worked example exactly:
       decoded box corners, $\\text{IoU}\\approx0.714$, and NMS keeping $\\{P,R\\}$. Then we run the
       <b>ablation</b> &mdash; detection with vs without NMS &mdash; and print the box counts. Paste into
       Colab and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)
S, B, C = 7, 2, 20          # Pascal VOC grid: 7x7 cells, 2 boxes/cell, 20 classes

# --- 0. A tiny conv stem that outputs the S x S x (B*5 + C) grid tensor (imported plumbing). ---
class TinyYOLOHead(nn.Module):
    def __init__(self, S, B, C):
        super().__init__()
        self.S, self.depth = S, B * 5 + C
        self.net = nn.Sequential(
            nn.Conv2d(3, 16, 3, stride=2, padding=1), nn.ReLU(),   # 448 -> 224
            nn.AdaptiveAvgPool2d(S),                               # -> S x S
            nn.Conv2d(16, self.depth, 1))                          # -> depth channels
    def forward(self, x):
        return self.net(x).permute(0, 2, 3, 1)   # (1, S, S, B*5+C)

head = TinyYOLOHead(S, B, C)
img  = torch.rand(1, 3, 448, 448)               # one 448x448 image (paper's input size)
grid = head(img)
print("grid tensor shape:", tuple(grid.shape), " (expect (1, 7, 7, 30))")

# --- 1. Decode one cell's box: offsets (x,y in 0..1) + image-relative (w,h) -> absolute corners. ---
def decode_cell(x, y, w, h, row, col, S):
    xc = (col + x) / S                          # add column offset, normalize by grid
    yc = (row + y) / S                          # add row offset
    return [xc - w/2, yc - h/2, xc + w/2, yc + h/2]   # [x1, y1, x2, y2]

P = decode_cell(0.6, 0.4, 0.30, 0.20, row=3, col=2, S=S)
print("decoded P [x1,y1,x2,y2] =", [round(v, 3) for v in P])
# decoded P = [0.221, 0.386, 0.521, 0.586]

# --- 2. IoU = overlap / union (clamp overlap at 0). Recap of dl-object-detection. ---
def iou(a, b):
    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])
    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0.0, ix2 - ix1) * max(0.0, iy2 - iy1)
    areaA = (a[2]-a[0]) * (a[3]-a[1]); areaB = (b[2]-b[0]) * (b[3]-b[1])
    union = areaA + areaB - inter
    return inter / union if union > 0 else 0.0

Q = [0.271, 0.386, 0.571, 0.586]                # neighbour box shifted right by 0.05
print("IoU(P, Q) =", round(iou(P, Q), 3), " (expect ~0.714, prints 0.715 at 3dp)")

# --- 3. Class-specific confidence (Eqn. 1): box confidence * cell class prob. ---
def class_conf(box_conf, class_probs):
    return [box_conf * p for p in class_probs]
print("class-specific scores =", [round(s, 3) for s in class_conf(0.9, [0.8, 0.1, 0.1])])
# = [0.72, 0.09, 0.09]  -> the box's score for each class

# --- 4. Non-max suppression: keep top score, drop boxes overlapping it above threshold. ---
def nms(boxes, scores, thr=0.5):
    order = sorted(range(len(boxes)), key=lambda i: scores[i], reverse=True)
    keep = []
    while order:
        i = order.pop(0); keep.append(i)
        order = [j for j in order if iou(boxes[i], boxes[j]) <= thr]
    return keep

R = [0.80, 0.80, 0.95, 0.95]                    # a far-off, non-overlapping box
boxes  = [P, Q, R]; scores = [0.90, 0.75, 0.80]
print("NMS keeps indices:", nms(boxes, scores, thr=0.5), " (expect [0, 2] -> P and R; Q dropped)")

# --- 5. ABLATION: detection WITH vs WITHOUT NMS -> count boxes per object. ---
# Two objects, each covered by 2 overlapping boxes (duplicates).
obj1a = [0.20,0.20,0.50,0.60]; obj1b = [0.22,0.22,0.52,0.62]   # cluster 1 (IoU high)
obj2a = [0.60,0.20,0.90,0.60]; obj2b = [0.62,0.22,0.92,0.62]   # cluster 2 (IoU high)
ab_boxes  = [obj1a, obj1b, obj2a, obj2b]
ab_scores = [0.92, 0.81, 0.88, 0.70]
print("\\nWITHOUT NMS: boxes kept =", len(ab_boxes), " (4 -> objects double-counted)")
print("WITH    NMS: boxes kept =", len(nms(ab_boxes, ab_scores, thr=0.5)),
      " (2 -> one clean box per object)")
# Our toy run, not the paper's number. The paper reports NMS "adds 2-3% in mAP" (Sec 2.3).`
  };

  window.CODEVIZ["paper-yolo"] = {
    question: "How many boxes survive per object WITH non-max suppression vs WITHOUT, as more duplicate boxes pile up?",
    charts: [
      {
        type: "bar",
        title: "Boxes reported for 2 true objects: without NMS vs with NMS (our toy run)",
        xlabel: "duplicate boxes generated per object",
        ylabel: "boxes reported",
        series: [
          { name: "Without NMS", color: "#ff7b72", points: [["1×", 2], ["2×", 4], ["3×", 6], ["4×", 8]] },
          { name: "With NMS (thr 0.5)", color: "#7ee787", points: [["1×", 2], ["2×", 2], ["3×", 2], ["4×", 2]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two true objects, each covered by an increasing number of tightly overlapping duplicate boxes (1× to 4× per object). WITHOUT non-max suppression the reported-box count grows with every duplicate (2, 4, 6, 8) &mdash; the same object detected many times. WITH NMS (IoU threshold 0.5) it stays pinned at 2 &mdash; exactly one box per object &mdash; because each cluster collapses to its single highest-scoring box. This is the duplicate-removal the paper credits with '2-3% in mAP' (&sect;2.3).",
    code: `# Reproduce the qualitative effect: NMS collapses each duplicate cluster to one box.
def iou(a, b):
    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])
    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0.0, ix2 - ix1) * max(0.0, iy2 - iy1)
    aA = (a[2]-a[0])*(a[3]-a[1]); aB = (b[2]-b[0])*(b[3]-b[1])
    u = aA + aB - inter
    return inter / u if u > 0 else 0.0

def nms(boxes, scores, thr=0.5):
    order = sorted(range(len(boxes)), key=lambda i: scores[i], reverse=True)
    keep = []
    while order:
        i = order.pop(0); keep.append(i)
        order = [j for j in order if iou(boxes[i], boxes[j]) <= thr]
    return keep

centers = [(0.35, 0.40), (0.75, 0.40)]    # two true objects
without, with_nms = [], []
for dup in range(1, 5):                   # 1x .. 4x duplicate boxes per object
    boxes, scores = [], []
    for k, (cx, cy) in enumerate(centers):
        for d in range(dup):
            off = 0.01 * d                # tiny jitter -> high mutual IoU
            boxes.append([cx-0.15+off, cy-0.20+off, cx+0.15+off, cy+0.20+off])
            scores.append(0.9 - 0.05*d - 0.01*k)
    without.append(len(boxes))
    with_nms.append(len(nms(boxes, scores, thr=0.5)))
print("duplicates per object :", [1, 2, 3, 4])
print("boxes WITHOUT NMS     :", without)   # [2, 4, 6, 8]
print("boxes WITH    NMS     :", with_nms)  # [2, 2, 2, 2]
# Our toy run, not the paper's number.`
  };
})();
