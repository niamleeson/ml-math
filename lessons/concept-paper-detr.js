/* Paper lesson — "DETR: End-to-End Object Detection with Transformers",
   Carion, Massa, Synnaeve, Usunier, Kirillov, Zagoruyko (Facebook AI Research), 2020.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-detr".
   GROUNDED from arXiv:2005.12872 (abstract) and the ar5iv HTML mirror
   (Section 3.1 "Object detection set prediction loss": Eq. 1 bipartite matching, the matching cost
   L_match, Eq. 2 the Hungarian loss; Section 3.1.1 the box loss; Section 3.2 the architecture).
   Track B (architecture): build the Hungarian bipartite-matching cost + set loss on toy predicted vs
   ground-truth boxes with scipy.optimize.linear_sum_assignment; show the one-to-one matching; ablate
   Hungarian (one-to-one) vs greedy (which collides two boxes on one object -> needs NMS).
   Cross-links paper-transformer (the encoder-decoder DETR reuses) and paper-faster-rcnn (the anchor +
   NMS baseline DETR replaces). */
(function () {
  window.LESSONS.push({
    id: "paper-detr",
    title: "DETR — End-to-End Object Detection with Transformers (2020)",
    tagline: "Cast detection as direct set prediction: a CNN + transformer outputs a fixed set of boxes, matched to truth one-to-one by a Hungarian loss — no anchors, no NMS.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Nicolas Carion, Francisco Massa, Gabriel Synnaeve, Nicolas Usunier, Alexander Kirillov, Sergey Zagoruyko",
      org: "Facebook AI Research (FAIR)",
      year: 2020,
      venue: "arXiv:2005.12872 (May 2020); ECCV 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/2005.12872",
      code: "https://github.com/facebookresearch/detr"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-object-detection", "dl-attention", "mod-transformer", "dl-conv", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>Object detection</b> means drawing a box around every object in an image and labelling it. The
       detectors before this paper &mdash; covered in the <code>dl-object-detection</code> concept lesson and
       the <a><code>paper-faster-rcnn</code></a> lesson &mdash; never predicted the boxes directly. They first
       guessed thousands of <b>anchors</b> (a dense grid of pre-placed candidate boxes of fixed sizes), scored
       and nudged each one, and then ran <b>non-maximum suppression</b> (NMS &mdash; a clean-up step that
       deletes overlapping near-duplicate boxes, keeping one per object). The paper opens by naming this
       indirection (&sect;1):</p>
       <blockquote>"Modern detectors address this set prediction task in an indirect way, by defining surrogate
       regression and classification problems on a large set of proposals, anchors, or window centers. Their
       performance is significantly influenced by postprocessing steps to collapse near-duplicate predictions,
       by the design of the anchor sets and by the heuristics that assign target boxes to anchors." (&sect;1)</blockquote>
       <p>Read that carefully: three hand-designed pieces &mdash; anchors, the rules that assign each ground-truth
       box to an anchor, and the NMS that removes duplicates &mdash; sit between the network and the answer. Each
       is a heuristic you must tune. The real task is simply: <b>output the set of objects, each exactly once.</b>
       Detection is <b>set prediction</b>, and these detectors never treated it as such.</p>`,
    contribution:
      `<ul>
        <li><b>Detection as direct set prediction.</b> DETR (DEtection TRansformer) "views object detection as a
        direct set prediction problem" (abstract). It outputs a <i>fixed-size set</i> of $N$ predictions in one
        shot and is trained to make that set match the ground-truth objects directly.</li>
        <li><b>A set loss via bipartite matching.</b> The training signal is "a set-based global loss that forces
        unique predictions via bipartite matching" (abstract). A <b>Hungarian algorithm</b> finds the single best
        <b>one-to-one</b> pairing between the $N$ predictions and the true objects; the loss is then computed on
        those pairs. One-to-one matching is what removes the need for NMS &mdash; no two predictions are pushed
        toward the same object.</li>
        <li><b>A transformer encoder-decoder with object queries.</b> A convolutional backbone feeds a
        <a><code>paper-transformer</code></a> encoder-decoder. "Given a fixed small set of learned object queries,
        DETR reasons about the relations of the objects and the global image context to directly output the final
        set of predictions in parallel" (abstract). No anchors, no NMS, no specialized layers.</li>
      </ul>`,
    whyItMattered:
      `<p>DETR showed a detector could be conceptually simple end-to-end: a backbone, a standard transformer, and
       a matching loss &mdash; "does not require a specialized library, unlike many other modern detectors"
       (abstract) &mdash; while reaching "accuracy and run-time performance on par with the well-established and
       highly-optimized Faster R-CNN baseline" on COCO. It made <b>set prediction</b> a first-class framing for
       detection and seeded a large family of query-based detectors (Deformable DETR, DINO and others) that fixed
       its slow convergence and weak small-object performance. The core idea &mdash; a fixed set of learned
       queries matched one-to-one to targets &mdash; spread beyond boxes to segmentation, pose, and tracking.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Object detection set prediction loss)</b> &mdash; the heart of the paper. The bipartite
        matching <b>Eq. 1</b> ($\\hat\\sigma = \\arg\\min_\\sigma \\sum_i \\mathcal{L}_{\\text{match}}$), the
        matching cost $\\mathcal{L}_{\\text{match}}$, and the <b>Hungarian loss Eq. 2</b>. Read the sentence on why
        the cost uses a <i>probability</i> (not a log-probability) twice &mdash; it is the subtle bit.</li>
        <li><b>&sect;3.1.1 (Bounding box loss)</b> &mdash; the box term: an L1 distance plus a generalized-IoU
        loss, with $\\lambda$ weights.</li>
        <li><b>&sect;3.2 (DETR architecture)</b> and <b>Fig. 2</b> &mdash; the CNN backbone, the encoder, the
        decoder with $N$ learned <b>object queries</b>, and the shared prediction feed-forward networks (FFNs).</li>
        <li><b>Fig. 1</b> &mdash; the one-paragraph picture of the whole pipeline.</li>
       </ul>
       <p><b>Skim:</b> the COCO training schedule and augmentation details (&sect;4 / appendix), the panoptic
       segmentation extension (&sect;5), and the exact backbone tables &mdash; unless you need those numbers. The
       two ideas you must own are the <b>bipartite-matching set loss</b> and the <b>object-query decoder</b>.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You have 3 predicted boxes and 2 true objects. Suppose <i>one</i> predicted box is the best fit for
       <b>both</b> true objects (highest score and tightest box for each). Two strategies must assign predictions
       to objects:</p>
       <ul>
        <li><b>Greedy:</b> each true object independently grabs its single best prediction.</li>
        <li><b>Hungarian (one-to-one):</b> find the assignment of <i>distinct</i> predictions to objects that
        minimizes the total cost &mdash; no prediction may be used twice.</li>
       </ul>
       <p>Predict: will <b>greedy</b> ever assign the <i>same</i> prediction to both objects? Will
       <b>Hungarian</b>? Which one therefore produces a duplicate box that a later NMS step would have to delete?
       Write your guess, then run the ablation.</p>`,
    attempt:
      `<p>Before the reveal, sketch the matching. You are given an $N\\times M$ <b>cost matrix</b> $C$ where
       $C[i,j]$ is the cost of matching prediction $i$ to ground-truth object $j$. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>match_cost(probs, pred_boxes, gt_class, gt_boxes)</b> &mdash; build $C$. TODO: for each pair
        $(i,j)$ set $C[i,j] = -\\,p_i(\\text{class}_j) + \\lambda_{L1}\\,\\lVert b_i - b_j\\rVert_1$ &mdash; the
        <i>negative</i> probability the prediction gives to object $j$'s class, plus the L1 box distance. (Lower
        cost = better match. Note it is a probability, not its log.)</li>
        <li><b>hungarian(C)</b> &mdash; TODO: call <code>scipy.optimize.linear_sum_assignment(C)</code>; it
        returns row indices and column indices of the optimal <b>one-to-one</b> assignment.</li>
        <li><b>greedy(C)</b> &mdash; TODO: for each column $j$ (each true object), pick
        <code>argmin</code> over rows independently &mdash; objects do <i>not</i> coordinate, so two may pick the
        same row.</li>
       </ul>
       <p>Then build a cost matrix where one prediction is cheapest for both objects, and compare what the two
       functions return.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>The shape of the output.</b> DETR always emits a <i>fixed</i> set of $N$ predictions (the paper uses
       $N=100$), regardless of how many objects are actually in the image. Each prediction is a class label plus a
       box. Since most images have far fewer than $N$ objects, there is a special <b>"no object"</b> class,
       written $\\varnothing$, for the unused slots. So a prediction is "a dog here" or "nothing here." The job of
       training is to make exactly the right slots fire on the right objects, and the rest say $\\varnothing$.</p>
       <p><b>Step 1 &mdash; match predictions to truth (&sect;3.1).</b> You cannot compute a loss until you know
       which of the $N$ predictions is supposed to explain which true object. DETR does <i>not</i> use a
       hand-designed rule (the way anchor detectors assign each ground-truth box to whichever anchors overlap it).
       Instead it pads the ground-truth set to size $N$ with $\\varnothing$ entries and searches over <b>all
       one-to-one pairings</b> (permutations $\\sigma$) of predictions to these $N$ targets, picking the pairing
       $\\hat\\sigma$ of <i>lowest total cost</i> (Eq. 1). "This optimal assignment is computed efficiently with
       the <b>Hungarian algorithm</b>" (&sect;3.1) &mdash; a classic combinatorial algorithm for the cheapest
       one-to-one assignment in a cost matrix. <b>One-to-one</b> is the whole point: each true object claims
       exactly one prediction, so the network is never rewarded for predicting the same object twice. That is why
       no NMS is needed afterward.</p>
       <p><b>The matching cost (&sect;3.1).</b> The cost of pairing prediction $\\hat\\sigma(i)$ with true object
       $y_i$ rewards giving high probability to the correct class and drawing a box close to the true box. For a
       real object ($c_i \\neq \\varnothing$) it is $-\\hat p_{\\sigma(i)}(c_i) + \\mathcal{L}_{\\text{box}}$:
       the <i>negative</i> of the probability assigned to the right class (so more probability &rarr; lower cost),
       plus the box loss. A subtle but important choice: the matching uses the <b>probability</b>
       $\\hat p(c_i)$ directly, not $-\\log \\hat p(c_i)$. The paper says this is deliberate: "This makes the
       class prediction term commensurable to $\\mathcal{L}_{\\text{box}}(\\cdot,\\cdot)$, and we observed better
       empirical performances" (&sect;3.1) &mdash; a probability lives in $[0,1]$, the same scale as the box loss,
       whereas a log can blow up.</p>
       <p><b>Step 2 &mdash; the Hungarian loss (&sect;3.1, Eq. 2).</b> Once $\\hat\\sigma$ is fixed, train on those
       pairs with an ordinary loss: a <b>negative-log-likelihood</b> class term $-\\log \\hat p_{\\hat\\sigma(i)}(c_i)$
       (now the log <i>is</i> used, because we are optimizing, not just ranking) plus the box loss for the matched
       real objects. Slots matched to $\\varnothing$ get only the class term, and the paper "down-weight[s] the
       log-probability term when $c_i = \\varnothing$ by a factor 10" (&sect;3.1) to counter the fact that most of
       the $N$ slots are background.</p>
       <p><b>The box loss (&sect;3.1.1).</b> Unlike anchor detectors that regress an <i>offset</i> from an anchor,
       DETR predicts boxes directly, so a plain L1 distance would scale badly with box size. It combines L1 with a
       scale-invariant <b>generalized IoU</b> (Intersection-over-Union) loss:
       $\\mathcal{L}_{\\text{box}} = \\lambda_{\\text{iou}}\\,\\mathcal{L}_{\\text{iou}} + \\lambda_{L1}\\,\\lVert b_i - \\hat b\\rVert_1$.</p>
       <p><b>The architecture (&sect;3.2).</b> A <b>CNN backbone</b> (e.g. ResNet) turns the image into a grid of
       feature vectors. These are flattened (plus a positional encoding) and fed to a standard
       <a><code>paper-transformer</code></a> <b>encoder</b>, whose self-attention lets every image location see
       every other &mdash; global context. The <b>decoder</b> takes $N$ <b>object queries</b>: $N$ learned input
       vectors (learned positional embeddings), one per output slot. Through cross-attention to the encoded image,
       each query gathers what it needs and becomes one output embedding. A shared <b>prediction FFN</b>
       (feed-forward network) maps each output embedding to a box &mdash; "the normalized center coordinates,
       height and width of the box w.r.t. the input image" (&sect;3.2) &mdash; and a softmax class label (with the
       extra $\\varnothing$ class). All $N$ are produced <b>in parallel</b>.</p>`,
    architecture:
      `<p>DETR is three stages in a line &mdash; <b>CNN backbone &rarr; transformer encoder-decoder &rarr; prediction
       FFNs</b> &mdash; with <b>no anchors and no NMS</b> anywhere (&sect;3.2, Fig. 2).</p>
       <p><b>1. CNN backbone.</b> A ResNet (the paper uses ResNet-50 / ResNet-101) maps the input image
       $x_{\\text{img}}\\in\\mathbb{R}^{3\\times H_0\\times W_0}$ to a feature map
       $f\\in\\mathbb{R}^{C\\times H\\times W}$ with $C=2048$ channels and $H=H_0/32,\\ W=W_0/32$ (a $32\\times$ downsample).</p>
       <p><b>2. Transformer encoder.</b> A $1\\!\\times\\!1$ convolution reduces the channels from $C=2048$ to the
       transformer width $d=256$, giving $z_0\\in\\mathbb{R}^{d\\times H\\times W}$. The spatial grid is flattened into a
       sequence of length $H\\!\\cdot\\!W$ ($d$-dimensional tokens). A <b>fixed sine positional encoding</b> is added at
       each attention layer (the transformer is permutation-invariant, so position must be injected). The encoder is
       <b>6 layers</b>, each a standard multi-head self-attention block (8 heads) + feed-forward sublayer; self-attention
       lets every image location attend to every other &mdash; global context.</p>
       <p><b>3. Transformer decoder.</b> <b>6 layers</b>. Its inputs are $N=100$ <b>object queries</b>: $N$ learned
       positional embeddings (vectors in $\\mathbb{R}^d$), one per output slot, the same for every image. Each decoder
       layer does (a) <b>self-attention</b> across the $N$ queries &mdash; how DETR reasons about object relations and
       avoids two queries claiming one object &mdash; and (b) <b>cross-attention</b> from the queries into the encoder
       output. Unlike the original autoregressive transformer, DETR <b>decodes all $N$ queries in parallel</b> (one
       shot, not left-to-right). The output is $N$ embeddings of dimension $d$.</p>
       <p><b>4. Prediction FFN heads.</b> A <b>shared</b> head is applied to each of the $N$ output embeddings
       independently: a <b>3-layer perceptron with ReLU and hidden dimension $d$</b> predicts the normalized box
       $(c_x,c_y,w,h)\\in[0,1]^4$, and a single <b>linear layer + softmax</b> predicts the class label over the real
       classes plus the extra $\\varnothing$ (\\\"no object\\\") class. Result: a fixed set of $N$ (class, box) predictions,
       no post-processing.</p>
       <p><b>Auxiliary losses.</b> The paper adds the prediction FFNs + Hungarian loss after <i>every</i> decoder layer
       (shared-weight heads) to help training &mdash; \\\"auxiliary decoding losses\\\" (&sect;3.2).</p>`,
    symbols: [
      { sym: "$N$", desc: "the <b>fixed number of predictions</b> DETR always emits (paper uses $N=100$); larger than the max objects expected in any image." },
      { sym: "$y_i$", desc: "the $i$-th <b>ground-truth object</b>, a pair (class $c_i$, box $b_i$); the truth set is padded with $\\varnothing$ to size $N$." },
      { sym: "$\\hat y_{\\sigma(i)}$", desc: "the <b>prediction</b> assigned to target $i$ by permutation $\\sigma$ (a class distribution $\\hat p$ and a box $\\hat b$)." },
      { sym: "$\\sigma$", desc: "a <b>permutation</b> of $\\{1,\\dots,N\\}$ &mdash; one candidate one-to-one assignment of predictions to targets." },
      { sym: "$\\hat\\sigma$", desc: "the <b>optimal assignment</b>: the permutation of lowest total matching cost, found by the Hungarian algorithm (Eq. 1)." },
      { sym: "$\\mathfrak{S}_N$", desc: "the <b>set of all permutations</b> of $N$ items &mdash; the search space Eq. 1 minimizes over." },
      { sym: "$c_i$", desc: "the <b>class label</b> of target $i$; may be a real class or $\\varnothing$ (\\\"no object\\\")." },
      { sym: "$\\varnothing$", desc: "the special <b>\\\"no object\\\" class</b> for the slots that should predict nothing (most of the $N$)." },
      { sym: "$b_i,\\ \\hat b_{\\sigma(i)}$", desc: "the <b>true box</b> and the <b>predicted box</b>, each as normalized center+size $(c_x,c_y,w,h)$ in $[0,1]$." },
      { sym: "$\\hat p_{\\sigma(i)}(c_i)$", desc: "the <b>probability</b> the assigned prediction gives to target $i$'s true class &mdash; used directly in the matching cost (not its log)." },
      { sym: "$\\mathcal{L}_{\\text{match}}$", desc: "the <b>matching cost</b> of one pred-target pair: $-\\hat p(c_i) + \\mathcal{L}_{\\text{box}}$ for real objects; used only to <i>rank</i> assignments." },
      { sym: "$\\mathcal{L}_{\\text{Hungarian}}$", desc: "the <b>training loss</b> on the matched pairs: an NLL class term $-\\log\\hat p(c_i)$ plus the box loss (Eq. 2)." },
      { sym: "$\\mathcal{L}_{\\text{box}}$", desc: "the <b>box loss</b>: $\\lambda_{\\text{iou}}\\mathcal{L}_{\\text{iou}} + \\lambda_{L1}\\lVert b_i-\\hat b\\rVert_1$ &mdash; generalized-IoU plus L1 (&sect;3.1.1, Eq. 3)." },
      { sym: "$\\mathcal{L}_{\\text{iou}}$", desc: "the <b>generalized-IoU (GIoU) loss</b>, $1-\\text{GIoU}$ &mdash; a scale-invariant box overlap penalty (&sect;3.1.1)." },
      { sym: "$\\lambda_{\\text{iou}},\\,\\lambda_{L1}$", desc: "scalar <b>weights</b> balancing the IoU and L1 terms of the box loss (paper: $\\lambda_{\\text{iou}}=2,\\ \\lambda_{L1}=5$)." },
      { sym: "$\\lVert b_i-\\hat b\\rVert_1$", desc: "the <b>L1 distance</b> (sum of absolute differences) between the true and predicted box 4-vectors $(c_x,c_y,w,h)$." },
      { sym: "$b\\cap\\hat b,\\ b\\cup\\hat b$", desc: "the <b>intersection</b> and <b>union</b> areas of the true and predicted boxes; $\\lvert\\cdot\\rvert$ is area." },
      { sym: "$B(b,\\hat b)$", desc: "the <b>smallest enclosing box</b> that contains both $b$ and $\\hat b$ &mdash; the term that makes GIoU informative even when boxes do not overlap." },
      { sym: "$d$", desc: "the <b>transformer width</b> (embedding dimension), $d=256$ in the paper; also the FFN hidden size." },
      { sym: "$C,\\ H,\\ W$", desc: "the backbone feature map's <b>channels, height, width</b>: $C=2048$, $H=H_0/32$, $W=W_0/32$ for input size $H_0\\times W_0$." },
      { sym: "object query", desc: "a plain term: one of the $N$ <b>learned input vectors</b> to the decoder; each becomes one output slot (a learned positional embedding)." },
      { sym: "NMS", desc: "a plain term: <b>Non-Maximum Suppression</b> &mdash; a post-processing step that deletes overlapping duplicate boxes. DETR needs none." },
      { sym: "Hungarian algorithm", desc: "a plain term: a classic method that finds the minimum-cost <b>one-to-one</b> assignment in a cost matrix (here, predictions &harr; targets)." }
    ],
    formula: `$$ \\hat\\sigma \\;=\\; \\arg\\min_{\\sigma \\in \\mathfrak{S}_N} \\; \\sum_{i}^{N} \\mathcal{L}_{\\text{match}}\\big(y_i,\\, \\hat y_{\\sigma(i)}\\big) \\qquad\\text{(\\S3.1, Eq.\\,1 — optimal bipartite matching, solved by the Hungarian algorithm)} $$
              $$ \\mathcal{L}_{\\text{match}}\\big(y_i,\\hat y_{\\sigma(i)}\\big) \\;=\\; -\\,\\mathbb{1}_{\\{c_i\\neq\\varnothing\\}}\\,\\hat p_{\\sigma(i)}(c_i) \\;+\\; \\mathbb{1}_{\\{c_i\\neq\\varnothing\\}}\\,\\mathcal{L}_{\\text{box}}\\big(b_i,\\hat b_{\\sigma(i)}\\big) \\qquad\\text{(\\S3.1 — the per-pair matching cost: class probability + box loss)} $$
              $$ \\mathcal{L}_{\\text{Hungarian}}(y,\\hat y) \\;=\\; \\sum_{i=1}^{N} \\Big[\\, -\\log \\hat p_{\\hat\\sigma(i)}(c_i) \\;+\\; \\mathbb{1}_{\\{c_i\\neq\\varnothing\\}}\\,\\mathcal{L}_{\\text{box}}\\big(b_i,\\hat b_{\\hat\\sigma(i)}\\big) \\,\\Big] \\qquad\\text{(\\S3.1, Eq.\\,2 — the Hungarian/set training loss: class NLL + box loss)} $$
              $$ \\mathcal{L}_{\\text{box}}\\big(b_i,\\hat b_{\\sigma(i)}\\big) \\;=\\; \\lambda_{\\text{iou}}\\,\\mathcal{L}_{\\text{iou}}\\big(b_i,\\hat b_{\\sigma(i)}\\big) \\;+\\; \\lambda_{L1}\\,\\big\\lVert b_i - \\hat b_{\\sigma(i)} \\big\\rVert_1 \\qquad\\text{(\\S3.1.1, Eq.\\,3 — box loss: generalized-IoU term + L1 term; }\\lambda_{\\text{iou}}{=}2,\\ \\lambda_{L1}{=}5\\text{)} $$
              $$ \\mathcal{L}_{\\text{iou}}\\big(b_i,\\hat b_{\\sigma(i)}\\big) \\;=\\; 1 - \\left( \\frac{\\lvert b_i \\cap \\hat b_{\\sigma(i)} \\rvert}{\\lvert b_i \\cup \\hat b_{\\sigma(i)} \\rvert} \\;-\\; \\frac{\\big\\lvert B(b_i,\\hat b_{\\sigma(i)}) \\setminus (b_i \\cup \\hat b_{\\sigma(i)}) \\big\\rvert}{\\big\\lvert B(b_i,\\hat b_{\\sigma(i)}) \\big\\rvert} \\right) \\qquad\\text{(\\S3.1.1 — generalized IoU; }B(\\cdot,\\cdot)\\text{ is the smallest box enclosing both)} $$`,
    whatItDoes:
      `<p><b>Eq. 1 &mdash; the match.</b> Over <i>every</i> way $\\sigma$ to pair the $N$ predictions one-to-one
       with the $N$ (padded) targets, pick the pairing $\\hat\\sigma$ whose total cost is smallest. The indicator
       $\\mathbb{1}_{\\{c_i\\neq\\varnothing\\}}$ is $1$ for real objects and $0$ for the $\\varnothing$ padding, so
       padding slots add no box cost &mdash; only real objects pull a prediction toward themselves. This is the
       one place a <i>permutation</i> is searched; the Hungarian algorithm does it in polynomial time.</p>
       <p><b>The matching cost.</b> For a real target, the cost falls when the prediction (a) puts high probability
       $\\hat p(c_i)$ on the right class &mdash; hence the minus sign &mdash; and (b) draws a box close to the true
       one. Using the raw probability (not $-\\log$) keeps this term in $[0,1]$, "commensurable" with the box loss,
       so neither term dominates the ranking (&sect;3.1).</p>
       <p><b>Eq. 2 &mdash; the loss.</b> With the assignment $\\hat\\sigma$ now <i>fixed</i>, train as usual:
       penalize the negative log-likelihood of each target's true class under its matched prediction, and add the
       box loss for the real (non-$\\varnothing$) targets. Padding slots contribute only the class term &mdash;
       pushing those predictions toward "no object." Here the <b>log</b> appears because we are optimizing
       parameters, where log-likelihood gives well-behaved gradients; in the matching step we only needed to
       <i>rank</i>, so the bare probability was the better choice.</p>`,
    derivation:
      `<p><b>Why one-to-one matching removes NMS.</b> Anchor detectors let <i>many</i> anchors match one object
       (any anchor overlapping it enough is a positive), so several predictions converge on the same object and
       you must delete the duplicates with NMS afterward. DETR instead asks for a <b>bijection</b>: a permutation
       $\\sigma$ assigns each prediction to a <i>distinct</i> target, and each target to a <i>distinct</i>
       prediction. Under such an assignment, only one prediction is ever pushed toward a given object during
       training; the others are pushed toward $\\varnothing$. The network therefore <i>learns</i> not to fire twice
       on the same object &mdash; duplicate suppression is folded into the loss, not bolted on at inference. This
       is the precise mechanism behind the abstract's claim of "forc[ing] unique predictions via bipartite
       matching."</p>
       <p><b>Why the cost matrix + Hungarian, not greedy.</b> Greedy assignment (each object grabs its own best
       prediction) can hand the <i>same</i> prediction to two objects &mdash; a collision &mdash; which both
       leaves an object unexplained and creates a duplicate. The Hungarian algorithm minimizes the
       <i>total</i> cost subject to the one-to-one constraint, so it will pay a little more on one pair to keep the
       assignment a valid bijection. The cost matrix is exactly $C[i,j]=\\mathcal{L}_{\\text{match}}(y_j,\\hat y_i)$,
       and $\\arg\\min$ over permutations is the standard linear-assignment problem
       (<code>scipy.optimize.linear_sum_assignment</code>). The ablation below makes the greedy collision concrete.</p>
       <p>The transformer encoder-decoder that produces $\\hat p$ and $\\hat b$ is standard &mdash; we recap it from
       the <a><code>paper-transformer</code></a> lesson rather than re-derive attention here. DETR's novelty is the
       <b>loss</b> and the <b>object-query</b> framing, which is what we implement.</p>`,
    example:
      `<p>Work the matching by hand on a tiny instance: $N=3$ predictions, $M=2$ true objects (we leave the
       $\\varnothing$ padding implicit &mdash; any unmatched prediction is "no object"). Two real classes,
       $A$ and $B$. Each prediction gives a probability over $[A,B,\\varnothing]$ and a box; each object has a class
       and a box. Use $\\lambda_{L1}=1$ and L1 distance on the 4-vector $(c_x,c_y,w,h)$.</p>
       <p>Predictions $\\hat p$ and boxes; ground truth (object 0 is class $A$, object 1 is class $B$):</p>
       <p>$$ \\hat p = \\begin{bmatrix} 0.7 & 0.2 & 0.1 \\\\ 0.1 & 0.8 & 0.1 \\\\ 0.3 & 0.3 & 0.4 \\end{bmatrix}\\!,\\;
            \\hat b = \\begin{bmatrix} .20&.20&.10&.10 \\\\ .62&.55&.20&.20 \\\\ .50&.50&.30&.30 \\end{bmatrix}\\!,\\;
            b^{gt}=\\begin{bmatrix} .25&.25&.12&.12 \\\\ .60&.60&.18&.22 \\end{bmatrix} $$</p>
       <ul class="steps">
        <li><b>Build the cost matrix</b> $C[i,j] = -\\hat p_i(\\text{class}_j) + \\lVert \\hat b_i - b^{gt}_j\\rVert_1$.
        For example $C[0,0] = -0.70 + |.20-.25|+|.20-.25|+|.10-.12|+|.10-.12| = -0.70 + 0.14 = \\mathbf{-0.56}$.</li>
        <li><b>The full matrix</b> (rows = predictions, columns = objects $A,B$):
        $$ C = \\begin{bmatrix} -0.56 & \\;\\;0.80 \\\\ \\;\\;0.73 & -0.69 \\\\ \\;\\;0.56 & \\;\\;0.10 \\end{bmatrix} $$</li>
        <li><b>Run the Hungarian algorithm.</b> Compare the two valid one-to-one assignments of two distinct
        predictions to the two objects: $\\{0\\!\\to\\!A,\\,1\\!\\to\\!B\\}$ costs $-0.56 + (-0.69) = \\mathbf{-1.25}$;
        the swap $\\{0\\!\\to\\!B,\\,1\\!\\to\\!A\\}$ costs $0.80 + 0.73 = \\mathbf{+1.53}$ (using preds 2 is worse
        still). The minimum is $\\mathbf{-1.25}$.</li>
        <li><b>The matching.</b> $\\hat\\sigma$: prediction $0 \\to$ object $A$, prediction $1 \\to$ object $B$.
        Prediction $2$ is left unmatched &rarr; it is trained toward $\\varnothing$ ("no object"). One-to-one:
        each object got a <i>distinct</i> prediction.</li>
       </ul>
       <p>The notebook builds this exact $C$ and calls <code>scipy.optimize.linear_sum_assignment(C)</code>, which
       returns the pairing $[(0,0),(1,1)]$ with total cost $-1.25$ &mdash; matching the hand computation.</p>`,
    recipe:
      `<ol>
        <li><b>Backbone:</b> a CNN turns the image into a grid of feature vectors (we skip this in the toy &mdash;
        it ships in <code>torchvision</code>).</li>
        <li><b>Transformer encoder:</b> flatten the features + positional encoding; self-attention mixes global
        context (recapped from <a><code>paper-transformer</code></a>).</li>
        <li><b>Transformer decoder:</b> $N$ learned <b>object queries</b> cross-attend to the encoded image; each
        becomes one output embedding, all in parallel.</li>
        <li><b>Prediction FFNs:</b> per query, a softmax class (with $\\varnothing$) and a box
        $(c_x,c_y,w,h)$ normalized to $[0,1]$.</li>
        <li><b>Build the matching cost matrix</b> $C[i,j] = -\\hat p_i(c_j) + \\mathcal{L}_{\\text{box}}(\\hat b_i,b_j)$.</li>
        <li><b>Hungarian match:</b> <code>linear_sum_assignment(C)</code> &rarr; the optimal one-to-one $\\hat\\sigma$.</li>
        <li><b>Set loss (Eq. 2):</b> on matched pairs, NLL class + box loss; unmatched predictions &rarr;
        $\\varnothing$ (down-weighted &times;10). Backprop.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): DETR "demonstrates accuracy and run-time performance <b>on par with the
       well-established and highly-optimized Faster R-CNN baseline</b> on the challenging COCO object detection
       dataset," and "can be easily generalized to produce panoptic segmentation in a unified manner," where "it
       significantly outperforms competitive baselines." The paper also reports DETR is notably better on
       <i>large</i> objects (credited to the encoder's global attention) but weaker on small ones, and converges
       slowly &mdash; the two limitations the follow-up DETR variants targeted.</p>
       <p><i>These are the paper's reported, quoted claims. The numbers in the CODEVIZ panel below are from our own
       toy matching computation &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The plumbing &mdash; the CNN backbone and the transformer
       encoder-decoder &mdash; is standard (ResNet ships in <code>torchvision</code>; the transformer is recapped
       in <a><code>paper-transformer</code></a>), so we do <b>not</b> rebuild it. What we build by hand is DETR's
       actual contribution: the <b>bipartite-matching set loss</b>. We construct the matching <b>cost matrix</b>
       from toy predicted vs ground-truth boxes ($-\\hat p(\\text{class}) + $ L1 box distance), run the
       <b>Hungarian algorithm</b> via <code>scipy.optimize.linear_sum_assignment</code> to get the one-to-one
       assignment, recompute the Eq. 2 loss on the matched pairs, and run the <b>ablation</b>: Hungarian
       (one-to-one) vs a greedy per-object assignment that collides two objects onto one prediction &mdash;
       exactly the duplicate that NMS exists to clean up, and that one-to-one matching prevents.</p>`,
    pitfalls:
      `<ul>
        <li><b>Using $-\\log\\hat p$ in the <i>matching</i> cost.</b> The paper uses the bare probability
        $\\hat p(c_i)$ there, "to make the class term commensurable to $\\mathcal{L}_{\\text{box}}$" (&sect;3.1).
        The log appears only in the <i>training</i> loss (Eq. 2). Swapping them changes which assignment wins.</li>
        <li><b>Allowing many-to-one matching.</b> If two predictions can match one object, you are back to needing
        NMS. The assignment <b>must</b> be a bijection &mdash; that is what <code>linear_sum_assignment</code>
        guarantees and what greedy does not.</li>
        <li><b>Forgetting the $\\varnothing$ slots / their down-weighting.</b> Most of the $N$ predictions match
        $\\varnothing$; without the &times;10 down-weight (&sect;3.1) the background term swamps the loss.</li>
        <li><b>Plain L1 on raw box coordinates.</b> L1 alone scales with box size; DETR adds a scale-invariant
        generalized-IoU term (&sect;3.1.1). Boxes are normalized $(c_x,c_y,w,h)$, not corner pixels.</li>
        <li><b>Expecting fast convergence.</b> DETR famously needs a long schedule; do not read a quick toy run as
        the real training behaviour.</li>
      </ul>`,
    recall: [
      "Write Eq. 1 (the bipartite matching) and say what $\\hat\\sigma$ is.",
      "Why does the matching cost use $\\hat p(c_i)$ but the Hungarian loss use $-\\log\\hat p(c_i)$?",
      "Explain in one sentence why one-to-one matching removes the need for NMS.",
      "Name the two terms of the box loss $\\mathcal{L}_{\\text{box}}$ and why L1 alone is insufficient.",
      "What are the $N$ \\\"object queries,\\\" and what does each become after the decoder?"
    ],
    practice: [
      {
        q: `<b>The one-to-one ablation.</b> Build a $3\\times2$ cost matrix in which prediction $0$ is the cheapest
            (best) match for <i>both</i> objects. Run Hungarian and greedy. Which one assigns prediction $0$ to
            both objects, and what real-world artifact is that?`,
        steps: [
          { do: `Use $C = \\begin{bmatrix} -0.9 & -0.8 \\\\ 0.2 & 0.1 \\\\ 0.3 & 0.3 \\end{bmatrix}$: prediction $0$ has the lowest cost in <i>both</i> columns.`, why: `This is the collision case: a single prediction is the best fit for two distinct objects.` },
          { do: `Greedy: per object, take $\\arg\\min$ over rows independently &rarr; object 0 picks row 0, object 1 also picks row 0. Both objects grabbed prediction $0$.`, why: `Greedy lets objects choose without coordinating, so the same prediction can be reused &mdash; a duplicate.` },
          { do: `Hungarian: minimize total cost with distinct rows &rarr; $\\{0\\!\\to\\!\\text{obj}0,\\,1\\!\\to\\!\\text{obj}1\\}$, total $-0.9 + 0.1 = -0.8$.`, why: `The one-to-one constraint forbids reusing row 0, so it pays a bit more on object 1 to keep a valid bijection.` }
        ],
        answer: `<p><b>Greedy</b> assigns prediction $0$ to <i>both</i> objects &mdash; a collision. In a detector
                 that means two boxes pointing at the same object: exactly the duplicate that <b>NMS</b> exists to
                 delete (and object 1 is left explained by a reused box). <b>Hungarian</b> forbids this: it returns
                 $\\{0\\!\\to\\!\\text{obj}0,\\ 1\\!\\to\\!\\text{obj}1\\}$ at total cost $-0.8$, a valid one-to-one
                 assignment. Because training always uses such a bijection, DETR learns to fire once per object and
                 needs <b>no NMS</b>. The CODEVIZ panel shows this contrast.</p>`
      },
      {
        q: `Recompute one matching-cost entry by hand. Using the worked example's prediction $1$ and object $B$
            (object 1), with $\\lambda_{L1}=1$, compute $C[1,1]$. Prediction $1$: $\\hat p=[0.1,0.8,0.1]$,
            $\\hat b=(.62,.55,.20,.20)$; object $B$: class $=B$, $b^{gt}=(.60,.60,.18,.22)$.`,
        steps: [
          { do: `Class term: object $B$'s class is $B$ (index 1), so $-\\hat p_1(B) = -0.8$.`, why: `The matching cost rewards probability on the <i>true</i> class &mdash; negated, so more probability lowers cost.` },
          { do: `Box L1: $|.62-.60| + |.55-.60| + |.20-.18| + |.20-.22| = 0.02+0.05+0.02+0.02 = 0.11$.`, why: `L1 is the sum of absolute differences over the 4 box coordinates $(c_x,c_y,w,h)$.` },
          { do: `Sum: $C[1,1] = -0.8 + 0.11 = -0.69$.`, why: `Matching cost = (negative class probability) + (box loss).` }
        ],
        answer: `<p>$C[1,1] = -0.8 + 0.11 = \\mathbf{-0.69}$ &mdash; the most negative (best) entry in the matrix,
                 which is why prediction $1$ matches object $B$. This is exactly the value in the worked-example
                 matrix, and the notebook reproduces it.</p>`
      },
      {
        q: `Why does DETR use the raw probability $\\hat p(c_i)$ in the matching cost (Eq. 1) but the log
            $-\\log\\hat p(c_i)$ in the training loss (Eq. 2)? What goes wrong if you swap them?`,
        steps: [
          { do: `In matching you only need to <i>rank</i> assignments. A probability is in $[0,1]$, the same scale as the box loss, so neither term dominates the ranking.`, why: `The paper: "This makes the class prediction term commensurable to $\\mathcal{L}_{\\text{box}}$" (&sect;3.1).` },
          { do: `In the loss you <i>optimize</i> parameters; $-\\log\\hat p$ gives the standard cross-entropy gradient and strongly penalizes near-zero probability on the true class.`, why: `Log-likelihood is the well-behaved objective for gradient training; a bare probability has weak gradients near 0.` },
          { do: `If you put $-\\log\\hat p$ in the matching cost, a single very-confident-wrong prediction can produce a huge term that dominates the box distances and distorts the assignment.`, why: `An unbounded log term is not "commensurable" with the bounded box loss &mdash; the very thing the paper avoided.` }
        ],
        answer: `<p>Matching only ranks, so DETR uses the bounded probability $\\hat p(c_i)\\in[0,1]$ to keep it
                 "commensurable" with the box loss (&sect;3.1); training optimizes, so it uses $-\\log\\hat p$ for
                 well-behaved cross-entropy gradients. Swapping them lets an unbounded log term dominate the
                 assignment and "we observed better empirical performances" with the probability form (&sect;3.1).</p>`
      }
    ]
  });

  window.CODE["paper-detr"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build DETR's bipartite-matching set loss by hand</b> &mdash; the paper's actual
       contribution &mdash; without rebuilding the backbone or the transformer (those are standard; the
       transformer is recapped in the <code>paper-transformer</code> lesson). Cell 1 builds the worked-example
       cost matrix $C[i,j] = -\\hat p_i(c_j) + \\lVert \\hat b_i - b^{gt}_j\\rVert_1$ and runs
       <code>scipy.optimize.linear_sum_assignment</code>; it returns the pairing $[(0,0),(1,1)]$ with total cost
       $\\mathbf{-1.25}$, matching the hand computation, and leaves prediction 2 for "no object." Cell 2
       recomputes the Eq. 2 set loss on the matched pairs. Cell 3 is the <b>ablation</b>: a collision cost matrix
       where one prediction is best for both objects &mdash; greedy reuses it (a duplicate &rarr; would need NMS),
       Hungarian keeps the matching one-to-one. Paste into Colab and run.</p>`,
    code: `import numpy as np
from scipy.optimize import linear_sum_assignment

np.set_printoptions(precision=3, suppress=True)

# --- 1. The worked example: N=3 predictions, M=2 ground-truth objects. -------------
# Predicted class probabilities over [A, B, no-object] and boxes (cx, cy, w, h).
probs = np.array([[0.7, 0.2, 0.1],
                  [0.1, 0.8, 0.1],
                  [0.3, 0.3, 0.4]])
pred_boxes = np.array([[0.20, 0.20, 0.10, 0.10],
                       [0.62, 0.55, 0.20, 0.20],
                       [0.50, 0.50, 0.30, 0.30]])
gt_class = [0, 1]                                  # object 0 is class A, object 1 is class B
gt_boxes = np.array([[0.25, 0.25, 0.12, 0.12],
                     [0.60, 0.60, 0.18, 0.22]])
LAM_L1 = 1.0

def match_cost(probs, pred_boxes, gt_class, gt_boxes, lam_l1=1.0):
    N, M = len(pred_boxes), len(gt_boxes)
    C = np.zeros((N, M))
    for i in range(N):
        for j in range(M):
            cls = gt_class[j]
            l1 = np.abs(pred_boxes[i] - gt_boxes[j]).sum()   # box loss (toy: L1 only)
            C[i, j] = -probs[i, cls] + lam_l1 * l1           # -prob(true class) + box loss
    return C                                                  # NOTE: probability, not -log

C = match_cost(probs, pred_boxes, gt_class, gt_boxes, LAM_L1)
print("Cost matrix C (rows=preds, cols=gt A,B):\\n", C)
print("C[0,0] = -0.70 + 0.14 =", round(C[0, 0], 3))          # -0.56, the worked value

# Hungarian algorithm = optimal ONE-TO-ONE assignment (Eq. 1).
rows, cols = linear_sum_assignment(C)
print("\\nHungarian matching pred->gt:", list(zip(rows.tolist(), cols.tolist())))  # [(0,0),(1,1)]
print("total matching cost:", round(C[rows, cols].sum(), 3))                       # -1.25
unmatched = sorted(set(range(len(pred_boxes))) - set(rows.tolist()))
print("unmatched predictions (-> no-object):", unmatched)                          # [2]


# --- 2. The Hungarian set loss on the matched pairs (Eq. 2, toy). ------------------
EPS = 1e-9
cls_loss = 0.0
box_loss = 0.0
for i, j in zip(rows, cols):
    cls_loss += -np.log(probs[i, gt_class[j]] + EPS)                 # -log p(true class)
    box_loss += np.abs(pred_boxes[i] - gt_boxes[j]).sum()           # matched box loss
# unmatched predictions are pushed toward 'no-object' (index 2), down-weighted x10 in the paper
no_obj = sum(-0.1 * np.log(probs[i, 2] + EPS) for i in unmatched)
total = cls_loss + box_loss + no_obj
print("\\nset loss  -> class:", round(cls_loss, 3),
      " box:", round(box_loss, 3), " no-obj(x0.1):", round(no_obj, 3),
      " TOTAL:", round(total, 3))


# --- 3. ABLATION: Hungarian (one-to-one) vs greedy (collides) --------------------
# A cost matrix where prediction 0 is the cheapest match for BOTH objects.
C2 = np.array([[-0.9, -0.8],
               [ 0.2,  0.1],
               [ 0.3,  0.3]])
h_rows, h_cols = linear_sum_assignment(C2)
greedy = [(int(np.argmin(C2[:, j])), j) for j in range(C2.shape[1])]  # each obj picks its best pred
print("\\nABLATION on collision matrix C2:\\n", C2)
print("Hungarian:", list(zip(h_rows.tolist(), h_cols.tolist())),
      "-> distinct preds:", len(set(h_rows.tolist())))                # 2 distinct -> one-to-one
print("Greedy   :", greedy,
      "-> distinct preds:", len(set(p for p, _ in greedy)))           # 1 distinct -> COLLISION
print("Greedy reuses prediction 0 for both objects -> a DUPLICATE that NMS would delete.")
print("Hungarian forbids reuse -> no duplicate, no NMS needed. (Toy run, not the paper's COCO AP.)")`
  };

  window.CODEVIZ["paper-detr"] = {
    question: "When one prediction is the best match for two objects, does the assignment stay one-to-one (Hungarian) or collide (greedy)?",
    charts: [
      {
        type: "bar",
        title: "Distinct predictions used to cover 2 objects — Hungarian (one-to-one) vs greedy (collides)",
        xlabel: "assignment strategy",
        ylabel: "number of distinct predictions used (2 = no duplicate)",
        series: [
          {
            name: "distinct predictions used",
            color: "#7ee787",
            points: [["Hungarian (one-to-one)", 2], ["Greedy (per-object argmin)", 1]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported COCO AP. On a 3&times;2 cost matrix where prediction 0 is the cheapest match for BOTH objects, greedy (each object independently grabs its best prediction) uses only 1 distinct prediction &mdash; it assigns prediction 0 to both objects, a duplicate box that NMS would have to delete. The Hungarian algorithm (scipy linear_sum_assignment) enforces a one-to-one bijection and uses 2 distinct predictions, so no object is left unexplained and no duplicate is produced. This one-to-one matching is exactly why DETR (paper &sect;3.1) needs no non-maximum suppression.",
    code: `import numpy as np
from scipy.optimize import linear_sum_assignment

# Collision cost matrix: prediction 0 is the cheapest match for BOTH objects.
C2 = np.array([[-0.9, -0.8],
               [ 0.2,  0.1],
               [ 0.3,  0.3]])

h_rows, h_cols = linear_sum_assignment(C2)                 # one-to-one
greedy = [int(np.argmin(C2[:, j])) for j in range(C2.shape[1])]  # per-object argmin

hungarian_distinct = len(set(h_rows.tolist()))            # 2 -> no duplicate
greedy_distinct    = len(set(greedy))                     # 1 -> collision/duplicate
print("Hungarian distinct preds:", hungarian_distinct)    # 2
print("Greedy    distinct preds:", greedy_distinct)       # 1
# Greedy reuses prediction 0 for both objects (a duplicate NMS must delete);
# Hungarian's one-to-one bijection prevents it -> DETR needs no NMS.`
  };
})();
