/* Paper lesson — "Mask R-CNN", He, Gkioxari, Dollar, Girshick (FAIR), 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-mask-rcnn".
   GROUNDED from arXiv:1703.06870 (abstract) and the ar5iv HTML mirror
   (Section 3 "Mask R-CNN": multi-task loss; the "RoIAlign" subsection; Section 4.2 Table 2c ablation).
   Track B (architecture): build RoIAlign (bilinear, no quantization) and RoIPool on a toy feature map,
   show the sub-pixel alignment difference, and run the align-vs-pool ablation. Cross-links Faster R-CNN:
   Mask R-CNN = Faster R-CNN + a parallel per-RoI mask branch (small FCN) + RoIAlign. */
(function () {
  window.LESSONS.push({
    id: "paper-mask-rcnn",
    title: "Mask R-CNN — Mask R-CNN (2017)",
    tagline: "Add a small per-region mask network to Faster R-CNN, and fix its pixel misalignment with RoIAlign.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Kaiming He, Georgia Gkioxari, Piotr Dollar, Ross Girshick",
      org: "Facebook AI Research (FAIR)",
      year: 2017,
      venue: "arXiv:1703.06870 (Mar 2017); ICCV 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1703.06870",
      code: "https://github.com/facebookresearch/Detectron"
    },
    conceptLink: "dl-object-detection",
    partOf: [],
    prereqs: ["dl-object-detection", "dl-conv", "dl-backprop", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p><b>Object detection</b> draws a box around each thing in an image and labels it. <b>Instance
       segmentation</b> goes further: it labels <i>every pixel</i> that belongs to each object, telling two
       overlapping people apart pixel-by-pixel. Before this paper, the leading detector
       <b>Faster R-CNN</b> &mdash; covered in the <code>dl-object-detection</code> concept lesson &mdash; gave
       you boxes and class labels but no per-object masks.</p>
       <p>The natural fix is to bolt a small pixel-labeling network onto each detected region. But there was a
       hidden landmine. Faster R-CNN crops each region's features with an operation called <b>RoIPool</b>
       (Region-of-Interest Pooling). RoIPool <b>rounds</b> the region's floating-point coordinates to whole
       feature-map cells before cropping. The paper names this the problem (&sect;3, "RoIAlign"):</p>
       <blockquote>"RoIPool &hellip; performs quantization &hellip; These quantizations introduce misalignments
       between the RoI and the extracted features. While this may not impact classification, which is robust to
       small translations, it has a large negative effect on predicting pixel-accurate masks." (&sect;3)</blockquote>
       <p>Read that carefully: rounding the box a fraction of a pixel barely changes a class label, but it
       smears a mask. To predict <i>pixels</i>, you must stop rounding.</p>`,
    contribution:
      `<ul>
        <li><b>A parallel mask branch.</b> Mask R-CNN "extends Faster R-CNN by adding a branch for predicting
        an object mask in parallel with the existing branch for bounding box recognition" (abstract). The mask
        branch is a <b>small FCN</b> (Fully Convolutional Network &mdash; a network of only convolutions that
        outputs a spatial map) "applied to each RoI, predicting a segmentation mask in a pixel-to-pixel
        manner" (&sect;3).</li>
        <li><b>RoIAlign.</b> A drop-in replacement for RoIPool that "avoid[s] any quantization of the RoI
        boundaries or bins (<i>i.e.</i>, we use x/16 instead of [x/16])" and reads features with <b>bilinear
        interpolation</b>, fixing the misalignment (&sect;3, "RoIAlign").</li>
        <li><b>Decoupled mask and class.</b> The mask branch outputs one independent binary mask <i>per
        class</i> using a <b>per-pixel sigmoid</b>, so mask prediction does not compete across classes. The
        classification branch alone picks the label (&sect;3).</li>
      </ul>`,
    whyItMattered:
      `<p>Mask R-CNN became the standard instance-segmentation framework and a workhorse backbone for years
       &mdash; "simple to train and adds only a small overhead to Faster R-CNN, running at 5 fps" (abstract),
       yet topping every track of the COCO challenge. Its design also "generalize[s] &hellip; e.g., allowing
       us to estimate human poses" by swapping the mask branch's targets to keypoints (abstract).
       <b>RoIAlign</b> in particular became the default way to crop region features whenever spatial precision
       matters, and the framework's two-stage "detect then refine per region" recipe carried into much of the
       detection literature that followed.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Mask R-CNN), the multi-task loss</b> &mdash; the one-line equation
        $L = L_{cls} + L_{box} + L_{mask}$ and the crucial sentence that $L_{mask}$ is defined <i>only</i> on
        the mask for the ground-truth class.</li>
        <li><b>&sect;3, the "RoIAlign" paragraph</b> &mdash; the heart of the paper: how bilinear sampling at
        un-rounded coordinates replaces RoIPool's two roundings. Read this twice.</li>
        <li><b>&sect;3, "Mask Representation"</b> &mdash; the mask branch is an FCN emitting a
        $K\\!\\times\\! m\\!\\times\\! m$ output ($K$ classes, each an $m\\times m$ binary mask), with per-pixel
        sigmoid, not softmax.</li>
        <li><b>Fig. 3</b> &mdash; the RoIAlign diagram (the dashed grid, the sample dots, the bilinear arrows).</li>
        <li><b>&sect;4.2, Table 2c</b> &mdash; the RoIAlign-vs-RoIPool ablation. This is the number that proves
        alignment matters.</li>
       </ul>
       <p><b>Skim:</b> the exact backbone/FPN tables (&sect;4), the human-pose experiments (&sect;5), and the
       Cityscapes results &mdash; unless you care about those benchmarks. The ideas you must own are two:
       the parallel mask branch and RoIAlign.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Take one output bin of a cropped region. Now slide the region right by a <b>fraction of a pixel</b>
       &mdash; 0.1, 0.2, &hellip; up to a full pixel &mdash; and watch the value that lands in that bin. For
       <b>RoIPool</b> (which rounds coordinates to whole cells) and for <b>RoIAlign</b> (which samples at the
       exact coordinate with bilinear interpolation), predict the shape of each curve as the shift grows.</p>
       <p>Will RoIPool's value (a) move smoothly, (b) stay frozen then jump in steps, or (c) jitter randomly?
       Will RoIAlign's value move smoothly? Write your guess, then run the ablation below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two cropping operators on a single feature map. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li><b>bilinear(F, y, x)</b> &mdash; sample feature map <code>F</code> at a <i>continuous</i> location.
        Take the four integer neighbours <code>(y0,x0),(y0,x1),(y1,x0),(y1,x1)</code>; let
        <code>dx = x - x0</code>, <code>dy = y - y0</code>; TODO: return the weighted blend
        $(1\\!-\\!dx)(1\\!-\\!dy)\\,v_{00} + dx(1\\!-\\!dy)\\,v_{01} + (1\\!-\\!dx)dy\\,v_{10} + dx\\,dy\\,v_{11}$.</li>
        <li><b>roi_align(F, roi, out)</b> &mdash; split the (un-rounded) RoI into an
        <code>out</code>&times;<code>out</code> grid of bins; TODO: for each bin, call <code>bilinear</code>
        at the bin's <i>center</i> &mdash; <b>no rounding anywhere</b>.</li>
        <li><b>roi_pool(F, roi, out)</b> &mdash; TODO: first <code>floor</code> the RoI corners to integers
        (quantization #1), then for each bin take the <code>max</code> over the cells it covers (quantization
        #2). This is the operator RoIAlign replaces.</li>
       </ul>
       <p>Then sweep a sub-pixel shift through both and predict which one tracks the shift smoothly.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from <b>Faster R-CNN</b>, the two-stage detector this paper builds on (recapped in the
       <code>dl-object-detection</code> concept lesson). Stage one, a <b>Region Proposal Network</b>, suggests
       candidate boxes. Stage two crops each box's features from the shared convolutional feature map and runs
       two small heads: one <b>classifies</b> the box, one <b>regresses</b> (refines) its coordinates. Mask
       R-CNN keeps all of that and adds a <b>third head in parallel</b>: a mask branch.</p>
       <p><b>The mask branch (&sect;3, "Mask Representation").</b> It is a small FCN that takes the cropped
       region features and outputs a $K\\times m\\times m$ tensor: for each of the $K$ classes, an $m\\times m$
       grid of mask scores (the paper uses $m=14$ or $28$). Each score goes through a <b>per-pixel sigmoid</b>,
       turning it into an independent "is this pixel inside the object?" probability. Crucially, the masks for
       different classes <b>do not compete</b> &mdash; there is no softmax across classes. The classification
       head alone decides the label $k$; then you simply read off the $k$-th mask. The paper calls this
       <b>decoupling mask and class prediction</b>, and shows it beats the usual per-pixel softmax.</p>
       <p><b>RoIAlign (&sect;3, "RoIAlign") &mdash; the fix.</b> The mask branch needs the cropped features to
       line up with the image pixel-accurately. RoIPool ruined that with two roundings: it rounds the RoI's
       float coordinates to the feature grid, then rounds again when splitting the RoI into pooling bins. Each
       rounding shifts features by up to a cell &mdash; on a stride-16 feature map, up to 16 image pixels.
       RoIAlign removes <b>both</b> roundings. It keeps the RoI's exact floating-point coordinates, lays the
       bin boundaries at their exact (fractional) positions, picks sampling points inside each bin, and reads
       the feature value at each point with <b>bilinear interpolation</b> &mdash; a smooth weighted average of
       the four nearest grid values. No rounding means the cropped features stay aligned with the image.</p>
       <p><b>Bilinear interpolation, concretely.</b> To read the feature map $F$ at a continuous location
       $(y,x)$, take the four surrounding integer grid points and blend them by how close $(y,x)$ is to each.
       If $x_0=\\lfloor x\\rfloor$, $y_0=\\lfloor y\\rfloor$, $dx = x-x_0$, $dy = y-y_0$, the value is the
       distance-weighted average in the formula below. When $(y,x)$ sits exactly on a grid point this returns
       that point; off-grid it slides smoothly between neighbours &mdash; which is exactly why a sub-pixel
       shift of the RoI produces a sub-pixel change in the output instead of a sudden jump.</p>`,
    symbols: [
      { sym: "$L$", desc: "the total <b>multi-task loss</b> minimized during training &mdash; the sum of the three head losses below." },
      { sym: "$L_{cls}$", desc: "the <b>classification loss</b>: how wrong the class label is for the region (inherited unchanged from Faster R-CNN)." },
      { sym: "$L_{box}$", desc: "the <b>bounding-box regression loss</b>: how wrong the refined box coordinates are (also inherited from Faster R-CNN)." },
      { sym: "$L_{mask}$", desc: "the <b>mask loss</b>: the average <b>binary cross-entropy</b> (per-pixel sigmoid) over the predicted mask, defined <i>only</i> on the mask for the ground-truth class." },
      { sym: "$K$", desc: "the number of object <b>classes</b>; the mask branch emits one $m\\times m$ mask per class, so a $K\\times m\\times m$ output." },
      { sym: "$m$", desc: "the mask <b>resolution</b>: each per-class mask is an $m\\times m$ grid (the paper uses $m=14$ or $28$)." },
      { sym: "$F$", desc: "the shared convolutional <b>feature map</b> that regions are cropped from (one channel in our toy; many in practice)." },
      { sym: "$(y,x)$", desc: "a <b>continuous</b> sampling location on $F$ (row $y$, column $x$); RoIAlign keeps it fractional, RoIPool rounds it." },
      { sym: "$dx,\\,dy$", desc: "the <b>fractional offsets</b> of the sample point from its lower-left grid neighbour: $dx=x-\\lfloor x\\rfloor$, $dy=y-\\lfloor y\\rfloor$ &mdash; the bilinear blend weights." },
      { sym: "$v_{00},v_{01},v_{10},v_{11}$", desc: "the four <b>grid-neighbour feature values</b> around $(y,x)$: top-left, top-right, bottom-left, bottom-right." },
      { sym: "RoIPool", desc: "a plain term: <b>Region-of-Interest Pooling</b> &mdash; crops region features by <i>rounding</i> RoI coordinates to whole cells (the source of misalignment)." },
      { sym: "RoIAlign", desc: "a plain term: this paper's crop &mdash; <i>no rounding</i>, reads features by <b>bilinear interpolation</b> at exact coordinates." },
      { sym: "FCN", desc: "a plain term: <b>Fully Convolutional Network</b> &mdash; a net of only convolutions that outputs a spatial map (here, the per-RoI mask)." }
    ],
    formula: `$$ L = L_{cls} + L_{box} + L_{mask} \\qquad\\text{(\\S3, the multi-task loss)} $$
              $$ F(y,x) = (1-dx)(1-dy)\\,v_{00} + dx\\,(1-dy)\\,v_{01} + (1-dx)\\,dy\\,v_{10} + dx\\,dy\\,v_{11} \\qquad\\text{(bilinear sample, \\S3 RoIAlign)} $$`,
    whatItDoes:
      `<p><b>Top line &mdash; the multi-task loss (&sect;3).</b> Mask R-CNN trains all three heads at once by
       adding their losses. $L_{cls}$ and $L_{box}$ are exactly Faster R-CNN's. The new term $L_{mask}$ is
       "the average binary cross-entropy loss" over the mask, and the paper's key subtlety: "For an RoI
       associated with ground-truth class $k$, $L_{mask}$ is only defined on the $k$-th mask (other mask
       outputs do not contribute to the loss)." So each class's mask is learned independently, with a
       <b>per-pixel sigmoid</b> &mdash; never a softmax across classes.</p>
       <p><b>Bottom line &mdash; the bilinear sample (&sect;3, RoIAlign).</b> To read the feature map at a
       fractional location, blend its four integer neighbours, weighting each by how close the sample is to it.
       The four weights $(1\\!-\\!dx)(1\\!-\\!dy)$, $dx(1\\!-\\!dy)$, $(1\\!-\\!dx)dy$, $dx\\,dy$ always sum to
       $1$. Because this is a smooth function of $(y,x)$, moving the RoI by a sub-pixel amount moves the output
       by a sub-pixel amount &mdash; that smoothness is the alignment RoIPool's rounding destroyed.</p>`,
    derivation:
      `<p><b>Why bilinear interpolation removes the misalignment.</b> RoIPool maps a continuous coordinate $x$
       to a feature value by first rounding: it reads cell $\\lfloor x/16 \\rfloor$ on a stride-16 map. That is
       a <b>step function</b> of $x$ &mdash; it stays flat across a whole cell, then jumps. So two RoIs whose
       true positions differ by, say, $0.4$ of a cell get the <i>identical</i> crop, and an RoI straddling a
       cell boundary snaps to one side. The features no longer sit where the object is. For class labels (which
       are translation-robust) this is survivable; for pixel masks it is fatal.</p>
       <p>RoIAlign replaces the step function with the bilinear blend $F(y,x)$ in the formula. Hold the four
       neighbours fixed and vary $x$ across one cell: $dx$ runs from $0$ to $1$, so $F$ moves <b>linearly</b>
       from the left neighbour to the right neighbour &mdash; a continuous ramp, not a step. Differentiate:
       $\\partial F/\\partial x = (v_{01}-v_{00})(1-dy) + (v_{11}-v_{10})\\,dy$, a finite, non-zero slope. So a
       sub-pixel change in the RoI's position produces a proportional, sub-pixel change in the sampled feature.
       That continuity is exactly what keeps the crop aligned with the image &mdash; and, as a bonus, makes the
       crop differentiable, so gradients flow back through the sampling coordinates during training.</p>
       <p>The detection/proposal machinery this sits inside &mdash; anchors, the Region Proposal Network, the
       box-regression targets &mdash; lives in the <code>dl-object-detection</code> concept lesson; we recap it
       rather than re-derive it here.</p>`,
    example:
      `<p>Read one feature map at one fractional location by hand, then see what RoIPool would have done. Take
       a $4\\times4$ single-channel feature map (rows are $y$, columns are $x$, both 0-indexed):</p>
       <p>$$ F = \\begin{bmatrix} 1 & 2 & 3 & 4 \\\\ 5 & 6 & 7 & 8 \\\\ 9 & 10 & 11 & 12 \\\\ 13 & 14 & 15 & 16 \\end{bmatrix} $$</p>
       <p>Sample at the continuous location $(y,x) = (2.7,\\,1.3)$ &mdash; a point RoIAlign would not round.</p>
       <ul class="steps">
        <li><b>Find the four neighbours.</b> $x_0=\\lfloor 1.3\\rfloor=1$, $y_0=\\lfloor 2.7\\rfloor=2$, so the
        corners are $(2,1),(2,2),(3,1),(3,2)$: $v_{00}=F[2,1]=10$, $v_{01}=F[2,2]=11$, $v_{10}=F[3,1]=14$,
        $v_{11}=F[3,2]=15$.</li>
        <li><b>Fractional offsets.</b> $dx = 1.3-1 = 0.3$, $\\;dy = 2.7-2 = 0.7$.</li>
        <li><b>Blend along $x$ (top and bottom rows).</b>
        top $= (1-0.3)\\cdot 10 + 0.3\\cdot 11 = 10.3$; bottom $= (1-0.3)\\cdot 14 + 0.3\\cdot 15 = 14.3$.</li>
        <li><b>Blend along $y$.</b> $F(2.7,1.3) = (1-0.7)\\cdot 10.3 + 0.7\\cdot 14.3 = 3.09 + 10.01 = \\mathbf{13.1}$.</li>
        <li><b>What RoIPool would do.</b> It rounds first: $(2.7,1.3)\\to(\\lfloor 2.7\\rfloor,\\lfloor 1.3\\rfloor)=(2,1)$,
        reading $F[2,1]=\\mathbf{10}$ &mdash; the value at the rounded corner, ignoring that the true point sits
        $70\\%$ of the way toward the next row. The $13.1$-vs-$10$ gap <i>is</i> the misalignment.</li>
       </ul>
       <p>The notebook recomputes $13.1$ both by hand and via <code>torch.nn.functional.grid_sample</code>
       (PyTorch's bilinear sampler) so you can check it.</p>`,
    recipe:
      `<ol>
        <li><b>Build bilinear sampling</b> (<code>bilinear(F, y, x)</code>): four neighbours, offsets
        $dx,dy$, return the weighted blend. <b>No rounding.</b></li>
        <li><b>Build RoIAlign</b> (<code>roi_align</code>): keep the RoI's float corners, split into an
        <code>out</code>&times;<code>out</code> grid of bins, sample each bin's center with
        <code>bilinear</code>.</li>
        <li><b>Build RoIPool</b> (<code>roi_pool</code>): <code>floor</code> the RoI corners (rounding #1),
        then <code>max</code>-pool each bin over the integer cells it covers (rounding #2).</li>
        <li><b>The alignment demo:</b> slide the RoI right in sub-pixel steps; record one output bin from each
        operator. RoIAlign tracks the shift smoothly; RoIPool stays frozen then jumps &mdash; a staircase.</li>
        <li><b>The ablation:</b> measure how much each operator's crop changes per unit of sub-pixel shift.
        RoIPool's flat-then-jump response is the misalignment; RoIAlign's smooth ramp is the fix. (For a full
        mask-AP ablation you would train both inside a detector; we reproduce the underlying cause on toy
        data.)</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): Mask R-CNN "outperforms all existing, single-model entries on every task,
       including the COCO 2016 challenge winners" and runs "at 5 fps." The <b>RoIAlign ablation</b> is the
       number to remember: in &sect;4.2 (Table 2c, ResNet-50-C4, stride 16) replacing RoIPool with RoIAlign
       <b>"improves AP by about 3 points,"</b> and the paper reports the gain is even larger on the coarser
       stride-32 features &mdash; "misalignments &hellip; have a large negative effect" without it.</p>
       <p><i>These are the paper's reported figures, quoted. The numbers in the CODEVIZ panel below are from
       our own toy computation &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The full detector's plumbing &mdash; backbone, Region
       Proposal Network, anchors, the class and box heads &mdash; is standard Faster R-CNN (and ships in
       <code>torchvision.models.detection</code>); we do <b>not</b> rebuild it. What we build by hand is the
       paper's spatial contribution and the demonstration that it matters: <b>RoIAlign</b> (bilinear sampling,
       no quantization), <b>RoIPool</b> (the rounding baseline) for contrast, and the <b>ablation</b> that
       sweeps a sub-pixel shift to expose RoIPool's staircase versus RoIAlign's smooth ramp. We verify our
       bilinear sample against <code>torch.nn.functional.grid_sample</code>. The detection scaffolding
       (anchors, proposals, box targets) is recapped from the <code>dl-object-detection</code> concept lesson,
       not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Rounding anywhere inside RoIAlign.</b> The whole point is "x/16 instead of [x/16]." If you
        <code>floor</code> the RoI corners, or snap bin boundaries to integers, you have re-created RoIPool.
        <b>Fix:</b> keep every coordinate floating-point until the bilinear read.</li>
        <li><b>Using softmax across classes for the mask.</b> The paper uses a <b>per-pixel sigmoid</b> with
        one independent mask per class and trains $L_{mask}$ only on the ground-truth class's mask. A softmax
        makes classes compete and (per the paper) hurts. <b>Fix:</b> sigmoid + binary cross-entropy, per
        class.</li>
        <li><b>Letting the mask branch pick the label.</b> Class and mask are <b>decoupled</b>: the
        classification head chooses $k$; you then read the $k$-th mask. Don't argmax over the mask channels to
        get a class.</li>
        <li><b>Confusing instance with semantic segmentation.</b> Mask R-CNN gives <i>one mask per detected
        instance</i> (two people &rarr; two masks), not one label map over the image. The per-RoI design is
        what makes instances separable.</li>
        <li><b>Mismatched bilinear convention.</b> Different libraries place pixel centers and corners
        differently (<code>align_corners</code> in PyTorch). If your toy value disagrees with
        <code>grid_sample</code>, it is almost always this convention &mdash; match it before blaming the
        math.</li>
      </ul>`,
    recall: [
      "Write the multi-task loss $L$ from memory and name what each term scores.",
      "What two roundings does RoIPool do, and which one(s) does RoIAlign remove?",
      "State the bilinear-sample formula and explain why its weights sum to 1.",
      "Why does the mask branch use a per-pixel sigmoid (per class) instead of a softmax across classes?",
      "On a stride-16 feature map, how many image pixels can a one-cell rounding shift the features by?"
    ],
    practice: [
      {
        q: `<b>The alignment ablation.</b> You have working <code>roi_align</code> and <code>roi_pool</code>.
            Slide one RoI right in steps of $0.1$ feature-cell and read the top-left output bin from each.
            What shape does each curve take, and what does the contrast prove?`,
        steps: [
          { do: `Hold the RoI's size fixed and add a sub-pixel offset $s \\in \\{0, 0.1, \\dots, 1.0\\}$ to its $x$-corners; recompute both crops at each $s$.`, why: `Changing only the sub-pixel position isolates the alignment behaviour &mdash; everything else is identical.` },
          { do: `Plot the top-left bin's value vs $s$. RoIAlign rises smoothly and almost linearly; RoIPool stays flat across part of a cell, then jumps by a whole step.`, why: `Bilinear sampling is continuous in the coordinate, so its output ramps; RoIPool rounds the coordinate, so its output is a step function &mdash; flat, then a jump.` },
          { do: `Conclude that RoIPool discards sub-pixel position (the misalignment) while RoIAlign preserves it.`, why: `The staircase means many distinct true positions collapse to the same crop &mdash; exactly the effect the paper says ruins masks.` }
        ],
        answer: `<p><b>RoIAlign</b> traces a smooth, near-linear ramp; <b>RoIPool</b> traces a staircase &mdash;
                 it stays frozen for part of a cell, then jumps a full step. In our toy run the RoIAlign bin
                 climbs $5.0 \\to 6.0$ in even $0.1$ increments as the shift grows, while the RoIPool bin sits
                 at $4.0$ for the first half-cell, then snaps to $5.0$ and holds. Since only the sub-pixel
                 position changed, this isolates RoIPool's rounding as the cause of misalignment &mdash; the
                 staircase collapses many true positions to one crop, which is fatal for pixel-accurate masks.
                 The CODEVIZ panel shows exactly this contrast.</p>`
      },
      {
        q: `Repeat the worked example at a <i>different</i> point. Using the same $4\\times4$ matrix $F$,
            bilinearly sample at $(y,x)=(1.5,\\,2.5)$. Then state what RoIPool would read.`,
        steps: [
          { do: `Neighbours: $x_0=2,y_0=1$, so $(1,2),(1,3),(2,2),(2,3)$ give $v_{00}=F[1,2]=7$, $v_{01}=F[1,3]=8$, $v_{10}=F[2,2]=11$, $v_{11}=F[2,3]=12$; offsets $dx=0.5,dy=0.5$.`, why: `$\\lfloor 2.5\\rfloor=2$, $\\lfloor 1.5\\rfloor=1$; the fractional parts are both $0.5$.` },
          { do: `Blend: top $=0.5\\cdot7+0.5\\cdot8=7.5$, bottom $=0.5\\cdot11+0.5\\cdot12=11.5$, then $0.5\\cdot7.5+0.5\\cdot11.5=9.5$.`, why: `With $dx=dy=0.5$ all four weights equal $0.25$, so the sample is the plain average of the four neighbours: $(7+8+11+12)/4=9.5$.` },
          { do: `RoIPool rounds $(1.5,2.5)\\to(1,2)$ and reads $F[1,2]=7$.`, why: `Flooring both coordinates throws away the half-cell offset, landing on the top-left corner only.` }
        ],
        answer: `<p>Bilinear gives $F(1.5,2.5)=\\mathbf{9.5}$ &mdash; the average of the four surrounding values
                 $7,8,11,12$, since the point sits exactly at the center of its cell ($dx=dy=0.5$, all weights
                 $0.25$). RoIPool would instead read the rounded corner $F[1,2]=\\mathbf{7}$. The $2.5$ gap is
                 the misalignment, again caused purely by rounding.</p>`
      },
      {
        q: `The mask branch outputs a $K\\times m\\times m$ tensor. For an RoI whose ground-truth class is
            $k=3$, which slice does $L_{mask}$ use, and why is the per-class, sigmoid design better than a
            single softmax mask?`,
        steps: [
          { do: `$L_{mask}$ is computed only on channel $k=3$ &mdash; the $3$-rd $m\\times m$ mask &mdash; with per-pixel binary cross-entropy; the other $K-1$ mask channels get no gradient from this RoI.`, why: `The paper: "$L_{mask}$ is only defined on the $k$-th mask (other mask outputs do not contribute to the loss)."` },
          { do: `Each channel is an independent "inside this object?" map via sigmoid, so classes don't compete for a pixel.`, why: `A softmax across classes would force the masks to sum to one per pixel, coupling mask shape to class scoring.` },
          { do: `The classification head separately picks the label; at test time you read that label's mask channel.`, why: `Decoupling mask from class means a wrong-but-close class still yields a sensible shape, and mask learning is not tangled with classification.` }
        ],
        answer: `<p>$L_{mask}$ uses <b>only the $k=3$ channel</b> (per-pixel sigmoid + binary cross-entropy); the
                 other channels are ignored for that RoI. This <b>decoupling</b> &mdash; one independent mask per
                 class, the class chosen by the classification head &mdash; means masks don't compete across
                 classes the way a per-pixel softmax would force them to. The paper reports this design
                 improves mask quality over the softmax alternative.</p>`
      }
    ]
  });

  window.CODE["paper-mask-rcnn"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build RoIAlign and RoIPool by hand</b> on one toy feature map and expose the alignment
       difference &mdash; the paper's spatial contribution &mdash; without rebuilding the whole detector
       (Faster R-CNN's backbone, Region Proposal Network and heads are standard and ship in
       <code>torchvision</code>). The first cell recomputes the worked example: bilinearly sampling the
       $4\\times4$ matrix at $(2.7,1.3)$ gives $\\mathbf{13.1}$, checked against PyTorch's
       <code>grid_sample</code>; RoIPool would round to $10$. We then crop one RoI two ways and, in the
       <b>ablation</b>, sweep a sub-pixel shift: RoIAlign ramps smoothly, RoIPool steps. Paste into Colab and
       run.</p>`,
    code: `import torch
import torch.nn.functional as F
import numpy as np

torch.manual_seed(0)

# --- 0. Worked example: bilinear sample of a 4x4 map at the un-rounded point (y=2.7, x=1.3). ---
Fm = torch.tensor([[ 1.,  2.,  3.,  4.],
                   [ 5.,  6.,  7.,  8.],
                   [ 9., 10., 11., 12.],
                   [13., 14., 15., 16.]])

def bilinear(M, y, x):
    H, W = M.shape
    x0 = int(np.floor(x)); y0 = int(np.floor(y))
    x0 = max(0, min(W - 2, x0)); y0 = max(0, min(H - 2, y0))
    x1, y1 = x0 + 1, y0 + 1
    dx, dy = x - x0, y - y0                       # fractional offsets (NO rounding of x,y)
    return (M[y0, x0] * (1 - dx) * (1 - dy) + M[y0, x1] * dx * (1 - dy) +
            M[y1, x0] * (1 - dx) * dy       + M[y1, x1] * dx * dy)

by_hand = bilinear(Fm, 2.7, 1.3)
print("bilinear(2.7, 1.3) by hand =", round(float(by_hand), 4))   # 13.1

# Verify against PyTorch's bilinear sampler. grid_sample wants normalized coords in [-1,1].
def norm(p, N): return 2 * p / (N - 1) - 1
grid = torch.tensor([[[[norm(1.3, 4), norm(2.7, 4)]]]])           # (x, y) order, align_corners=True
gs = F.grid_sample(Fm.view(1, 1, 4, 4), grid, mode="bilinear", align_corners=True)
print("grid_sample             =", round(gs.item(), 4))           # 13.1  -> matches
print("RoIPool would read floor (2,1) =", float(Fm[2, 1]))        # 10.0  -> the misalignment


# --- 1. RoIAlign vs RoIPool on a toy 8x8 ramp feature map. ---
H = W = 8
yy, xx = torch.meshgrid(torch.arange(W).float(), torch.arange(H).float(), indexing="ij")
feat = (xx + yy)                                                  # smooth ramp, easy to read

def roi_align(M, roi, out):
    x1, y1, x2, y2 = roi
    bw, bh = (x2 - x1) / out, (y2 - y1) / out
    o = torch.zeros(out, out)
    for i in range(out):
        for j in range(out):
            cy = y1 + bh * (i + 0.5)                              # bin center, fractional
            cx = x1 + bw * (j + 0.5)
            o[i, j] = bilinear(M, cy, cx)                         # NO rounding
    return o

def roi_pool(M, roi, out):
    x1, y1, x2, y2 = [int(np.floor(v)) for v in roi]             # rounding #1: floor RoI
    bw, bh = (x2 - x1) / out, (y2 - y1) / out
    o = torch.zeros(out, out)
    for i in range(out):
        for j in range(out):
            ys = int(np.floor(y1 + i * bh)); ye = max(ys + 1, int(np.ceil(y1 + (i + 1) * bh)))
            xs = int(np.floor(x1 + j * bw)); xe = max(xs + 1, int(np.ceil(x1 + (j + 1) * bw)))
            o[i, j] = M[ys:ye, xs:xe].max()                      # rounding #2: integer bins
    return o

roi = (1.5, 1.5, 6.5, 5.5)                                       # NOT grid-aligned
print("\\nRoIAlign 2x2:\\n", roi_align(feat, roi, 2))
print("RoIPool  2x2:\\n", roi_pool(feat, roi, 2))


# --- 2. ABLATION: slide the RoI right by sub-pixel steps; read one output bin from each. ---
base = (1.5, 1.5, 5.5, 5.5)
shifts = [round(0.1 * k, 1) for k in range(11)]
a_vals, p_vals = [], []
for s in shifts:
    r = (base[0] + s, base[1], base[2] + s, base[3])
    a_vals.append(round(float(roi_align(feat, r, 2)[0, 0]), 3))
    p_vals.append(round(float(roi_pool(feat, r, 2)[0, 0]), 3))
print("\\nshift   :", shifts)
print("RoIAlign:", a_vals)    # smooth ramp 5.0 -> 6.0
print("RoIPool :", p_vals)    # staircase: stuck at 4.0, then jumps to 5.0
# RoIAlign tracks the sub-pixel shift; RoIPool quantizes it away -> the misalignment Mask R-CNN fixes.
# (Numbers from this toy run, not the paper's reported COCO AP.)`
  };

  window.CODEVIZ["paper-mask-rcnn"] = {
    question: "As an RoI slides by sub-pixel amounts, does the cropped feature track the shift (RoIAlign) or snap in steps (RoIPool)?",
    charts: [
      {
        type: "line",
        title: "One output bin vs sub-pixel RoI shift — RoIAlign (smooth) vs RoIPool (staircase)",
        xlabel: "RoI horizontal shift (feature cells)",
        ylabel: "value in the top-left output bin",
        series: [
          {
            name: "RoIPool (rounds)",
            color: "#ff7b72",
            points: [[0.0,4.0],[0.1,4.0],[0.2,4.0],[0.3,4.0],[0.4,4.0],[0.5,5.0],[0.6,5.0],[0.7,5.0],[0.8,5.0],[0.9,5.0],[1.0,5.0]]
          },
          {
            name: "RoIAlign (bilinear)",
            color: "#7ee787",
            points: [[0.0,5.0],[0.1,5.1],[0.2,5.2],[0.3,5.3],[0.4,5.4],[0.5,5.5],[0.6,5.6],[0.7,5.7],[0.8,5.8],[0.9,5.9],[1.0,6.0]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported COCO AP. One RoI on a toy 8&times;8 ramp feature map is slid right in steps of 0.1 feature-cell; we read the top-left 2&times;2 output bin from each operator. RoIAlign (bilinear, no rounding) ramps smoothly and linearly from 5.0 to 6.0 &mdash; it preserves the sub-pixel position. RoIPool (which floors the RoI to whole cells) is a staircase: frozen at 4.0 for the first half-cell, then it snaps to 5.0 and holds &mdash; many distinct true positions collapse to one crop. That collapsed sub-pixel information is the misalignment RoIAlign removes (paper &sect;4.2: RoIAlign improves mask AP by ~3 points).",
    code: `import torch, numpy as np

# Toy 8x8 ramp feature map; one RoI slid right in sub-pixel steps. Reproduces the
# qualitative alignment effect: RoIAlign tracks the shift, RoIPool quantizes it away.
H = W = 8
yy, xx = torch.meshgrid(torch.arange(W).float(), torch.arange(H).float(), indexing="ij")
feat = xx + yy

def bilinear(M, y, x):
    x0 = max(0, min(W - 2, int(np.floor(x)))); y0 = max(0, min(H - 2, int(np.floor(y))))
    dx, dy = x - x0, y - y0
    return (M[y0, x0]*(1-dx)*(1-dy) + M[y0, x0+1]*dx*(1-dy) +
            M[y0+1, x0]*(1-dx)*dy   + M[y0+1, x0+1]*dx*dy)

def align_bin(roi):                                   # top-left bin center, no rounding
    x1, y1, x2, y2 = roi
    return float(bilinear(feat, y1 + (y2 - y1) / 4, x1 + (x2 - x1) / 4))

def pool_bin(roi):                                    # floor RoI, max over integer cells
    x1, y1, x2, y2 = [int(np.floor(v)) for v in roi]
    bw, bh = (x2 - x1) / 2, (y2 - y1) / 2
    ys, ye = int(np.floor(y1)), max(int(np.floor(y1)) + 1, int(np.ceil(y1 + bh)))
    xs, xe = int(np.floor(x1)), max(int(np.floor(x1)) + 1, int(np.ceil(x1 + bw)))
    return float(feat[ys:ye, xs:xe].max())

base = (1.5, 1.5, 5.5, 5.5)
shifts = [round(0.1 * k, 1) for k in range(11)]
print("shift   :", shifts)
print("RoIAlign:", [round(align_bin((base[0]+s, base[1], base[2]+s, base[3])), 3) for s in shifts])
print("RoIPool :", [round(pool_bin((base[0]+s, base[1], base[2]+s, base[3])), 3) for s in shifts])
# RoIAlign -> 5.0..6.0 smooth.  RoIPool -> 4.0 (x6) then 5.0 (staircase).`
  };
})();
