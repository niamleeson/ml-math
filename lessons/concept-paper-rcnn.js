/* Paper lesson — "Rich feature hierarchies for accurate object detection and semantic
   segmentation" (R-CNN), Girshick, Donahue, Darrell, Malik, 2013.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-rcnn".
   GROUNDED from arXiv:1311.2524 (abstract) and the ar5iv HTML mirror
   (Section 2 — the three modules; Section 2.3 — fine-tuning/SVM thresholds; Appendix C —
   bounding-box regression). The IoU math lives in concept dl-object-detection; here we recap.
   Track B (architecture): we build the R-CNN PIPELINE on a toy image — selective-search-style
   proposals -> per-region CNN-style feature -> linear classifier + box regression — and show the
   ~2000-passes-per-image slowness that motivated Fast R-CNN. */
(function () {
  window.LESSONS.push({
    id: "paper-rcnn",
    title: "R-CNN — Rich feature hierarchies for accurate object detection (2013)",
    tagline: "Propose a few regions, run a CNN on each, then classify and refine the box — detection by regions-with-CNN-features.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Ross Girshick, Jeff Donahue, Trevor Darrell, Jitendra Malik",
      org: "UC Berkeley",
      year: 2013,
      venue: "arXiv:1311.2524 (Nov 2013); CVPR 2014",
      citations: "",
      arxiv: "https://arxiv.org/abs/1311.2524",
      code: "https://github.com/rbgirshick/rcnn"
    },
    conceptLink: "dl-object-detection",
    partOf: [],
    prereqs: ["dl-object-detection", "dl-conv", "pt-cnn", "pt-nn-module", "paper-alexnet"],

    // WHY READ IT
    problem:
      `<p>Image <b>classification</b> answers "is there a cat?". <b>Object detection</b> is harder: it must
       answer "<i>where</i> is each object?" by drawing a tight box around every one and labelling it. Before
       this paper, detection progress had stalled. As the abstract puts it:</p>
       <blockquote>"Object detection performance, as measured on the canonical PASCAL VOC dataset, has
       plateaued in the last few years. The best-performing methods are complex ensemble systems that
       typically combine multiple low-level image features with high-level context." (Abstract)</blockquote>
       <p>The obvious idea &mdash; slide a classifier over every position and every box size (a
       <b>sliding window</b>) &mdash; is far too slow once the classifier is a deep Convolutional Neural
       Network (CNN), because an image has an astronomical number of possible boxes. Meanwhile deep CNNs had
       just shattered records on <i>classification</i> (AlexNet, 2012). The open question: <b>can that
       classification power be turned into a localizer</b> without testing millions of windows?</p>`,
    contribution:
      `<ul>
        <li><b>Regions with CNN features (the name "R-CNN").</b> Instead of millions of sliding windows,
        first propose a small set of <b>category-independent region proposals</b> (about 2000 per image,
        via <b>selective search</b>), then run the CNN on only those. From the abstract: "one can apply
        high-capacity convolutional neural networks (CNNs) to bottom-up region proposals in order to
        localize and segment objects."</li>
        <li><b>Supervised pre-train, then fine-tune.</b> Detection data is scarce, so they pre-train the CNN
        on the large ILSVRC <i>classification</i> set, then <b>fine-tune</b> it on the small detection set.
        The abstract: "when labeled training data is scarce, supervised pre-training for an auxiliary task,
        followed by domain-specific fine-tuning, yields a significant performance boost." This is the
        transfer-learning recipe now used everywhere.</li>
        <li><b>A big, measured jump.</b> "improves mean average precision (mAP) by more than 30% relative to
        the previous best result on VOC 2012 &mdash; achieving a mAP of 53.3%." (Abstract)</li>
      </ul>`,
    whyItMattered:
      `<p>R-CNN started the modern detection lineage. Its three-stage pipeline was <i>slow</i> (a separate
       CNN forward pass on every one of ~2000 regions), and fixing that slowness directly produced
       <b>Fast R-CNN</b> (share one CNN pass over the whole image, crop features per region) and then
       <b>Faster R-CNN</b> (learn the region proposals too, with a Region Proposal Network), and later
       <b>Mask R-CNN</b>. The "propose regions, then classify + regress a box" template &mdash; and the
       pre-train-then-fine-tune recipe &mdash; underpins most two-stage detectors that followed.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>Fig. 1 &amp; &sect;1</b> &mdash; the four-step system picture: input image &rarr; ~2000 region
        proposals &rarr; CNN features per region &rarr; classify with linear SVMs. This is the whole method
        in one diagram.</li>
        <li><b>&sect;2.1 (Module design)</b> &mdash; the three modules: region proposals (selective search),
        the CNN feature extractor (warp each region to $227\\times227$, extract a 4096-dim vector), and
        class-specific linear SVMs.</li>
        <li><b>&sect;2.3 (Training)</b> &mdash; pre-train on ILSVRC, fine-tune on detection; the IoU
        thresholds that label a proposal positive or negative ($\\ge 0.5$ for fine-tuning; $0.3$ for the
        SVMs).</li>
        <li><b>Appendix C (Bounding-box regression)</b> &mdash; the four transform targets
        $t_x,t_y,t_w,t_h$ that nudge a proposal box toward the ground-truth box.</li>
       </ul>
       <p><b>Skim:</b> the per-class VOC tables, the ILSVRC2013 detection results, and the semantic
       segmentation section (&sect;4) unless you need them. The core you will implement is the pipeline in
       Fig. 1 plus the box-regression targets in Appendix C.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>R-CNN runs the CNN <b>once per region proposal</b>, and there are about <b>2000</b> proposals per
       image. Suppose one CNN forward pass on one warped region takes about 10 milliseconds. Roughly how long
       does it take to process <b>one</b> image? And if a dataset has 5000 test images, how many CNN forward
       passes total? Write your guess, then check it against the timing the notebook prints &mdash; this
       slowness is exactly what the next paper (Fast R-CNN) set out to kill.</p>`,
    attempt:
      `<p>Before the reveal, sketch the pipeline you will build on a toy image. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li><code>proposals = selective_search(image)</code> <i># a handful of candidate boxes (here, a few hand-placed ones)</i></li>
        <li>For each proposal box <code>P</code>:
          <ul>
            <li>TODO: <b>warp</b> the crop to a fixed size and run the feature extractor &rarr; a feature vector.</li>
            <li>TODO: <b>classify</b> the feature (linear scorer) &rarr; class + score.</li>
            <li>TODO: compute <b>IoU</b> (Intersection over Union) of <code>P</code> with the ground-truth box.</li>
            <li>TODO: apply the <b>box regression</b> $\\,(d_x,d_y,d_w,d_h)\\,$ to refine <code>P</code> toward the object.</li>
          </ul>
        </li>
        <li>TODO: count total CNN passes = (number of images) &times; (proposals per image). Predict whether this scales.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>R-CNN is a <b>pipeline of three modules</b> (&sect;2.1). It does not look at the whole image at once;
       it looks at a short list of candidate regions and classifies each.</p>
       <p><b>Step 1 &mdash; region proposals.</b> Run <b>selective search</b> on the image to produce
       category-independent candidate boxes. From &sect;2.2: "we run selective search on the test image to
       extract around 2000 region proposals." Selective search is a non-learned algorithm that groups
       similar pixels into regions at many scales; R-CNN simply consumes its boxes.</p>
       <p><b>Step 2 &mdash; CNN features per region.</b> Each proposal can be any shape, but the CNN needs a
       fixed input, so every region is <b>warped</b> to $227\\times227$ pixels: "Regardless of the size or
       aspect ratio of the candidate region, we warp all pixels in a tight bounding box around it to the
       required size." (&sect;2.1) The warped region is pushed through the CNN to extract "a 4096-dimensional
       feature vector from each region proposal". So a deep classification CNN is reused as a
       <b>per-region feature extractor</b>.</p>
       <p><b>Step 3 &mdash; classify + refine.</b> The 4096-dim feature is scored by a <b>class-specific
       linear Support Vector Machine</b> (SVM): one SVM per object class decides "is this region a car?",
       "a person?", etc. After scoring, a <b>bounding-box regressor</b> (Appendix C) nudges the proposal box
       toward a tighter fit &mdash; the paper notes this "fixes a large number of mislocalized detections,
       boosting mAP by 3 to 4 points."</p>
       <p><b>Training (&sect;2.3).</b> Detection data is scarce, so the CNN is first <b>pre-trained</b> on the
       large ILSVRC2012 classification set, then <b>fine-tuned</b> on detection. During fine-tuning, a
       proposal is a <b>positive</b> for a class if its IoU with a ground-truth box of that class is
       $\\ge 0.5$, else background. The SVMs use a stricter rule: proposals below an IoU of $0.3$ (chosen by
       grid search) are negatives.</p>
       <p><b>The catch.</b> Step 2 runs the CNN <b>separately on every one of the ~2000 regions</b> &mdash; no
       computation is shared between overlapping proposals. That is why the paper reports the heavy cost
       "13s/image on a GPU or 53s/image on a CPU" for features; this per-region redundancy is the
       motivation for Fast R-CNN.</p>`,
    symbols: [
      { sym: "$P$", desc: "a <b>proposal</b> box from selective search, written as its center and size $(P_x, P_y, P_w, P_h)$ &mdash; $x,y$ the center, $w,h$ the width and height." },
      { sym: "$G$", desc: "the <b>ground-truth</b> box we want $P$ to match, $(G_x, G_y, G_w, G_h)$ &mdash; same center/size form as $P$." },
      { sym: "$(d_x, d_y, d_w, d_h)$", desc: "the four numbers the <b>bounding-box regressor</b> outputs: a learned shift of the center ($d_x,d_y$) and a learned log-scale of the size ($d_w,d_h$)." },
      { sym: "$(t_x, t_y, t_w, t_h)$", desc: "the regression <b>targets</b> &mdash; the ideal transform that would move $P$ exactly onto $G$. We train $d_\\star$ to predict these $t_\\star$." },
      { sym: "IoU", desc: "<b>Intersection over Union</b>: area of overlap of two boxes divided by area of their union. $1$ = identical boxes, $0$ = no overlap; the standard score for 'does this box fit?'." },
      { sym: "mAP", desc: "<b>mean Average Precision</b>: the standard detection accuracy score &mdash; average precision per class, then averaged over classes. Higher is better." },
      { sym: "SVM", desc: "<b>Support Vector Machine</b>: a linear classifier. R-CNN trains one per object class on the 4096-dim CNN features to score each region." },
      { sym: "selective search", desc: "a plain term, not a symbol: a <b>non-learned</b> algorithm that groups similar pixels into ~2000 candidate region boxes; R-CNN consumes its boxes as proposals." },
      { sym: "warp", desc: "resize a region of any shape to the fixed $227\\times227$ input the CNN requires (stretching aspect ratio if needed)." }
    ],
    formula: `$$ t_x = \\frac{G_x - P_x}{P_w}, \\quad t_y = \\frac{G_y - P_y}{P_h}, \\quad t_w = \\log\\!\\frac{G_w}{P_w}, \\quad t_h = \\log\\!\\frac{G_h}{P_h} \\qquad\\text{(Appendix C)} $$`,
    whatItDoes:
      `<p>These four equations define the <b>box-regression targets</b>: how to turn the proposal box $P$ into
       the ground-truth box $G$. The regressor learns to output $(d_x,d_y,d_w,d_h)$ that match these
       $(t_x,t_y,t_w,t_h)$.</p>
       <ul>
        <li><b>$t_x,t_y$ &mdash; the center shift, made scale-free.</b> The raw gap $G_x-P_x$ is divided by the
        proposal's width $P_w$ (and $G_y-P_y$ by its height $P_h$), so the target is a <i>fraction of the box
        size</i>, not pixels. A big box and a small box that are equally "half a width off" get the same
        target.</li>
        <li><b>$t_w,t_h$ &mdash; the size correction, in log space.</b> $\\log(G_w/P_w)$ is $0$ when the widths
        already match, positive to grow, negative to shrink. Using the log makes "double the width" and
        "halve the width" symmetric and keeps the size positive after the update.</li>
       </ul>
       <p>To apply a predicted transform you invert these: new center $= P_x + P_w\\,d_x$, new width
       $= P_w\\,e^{d_w}$, and likewise for $y,h$.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the IoU math lives in the concept lesson.</b> Why parameterize the box this way
       instead of regressing the four raw corner pixels? Because the same object can appear at any size. If
       you predicted raw pixel offsets, a 20-pixel error would be tiny for a large object and huge for a small
       one, so the regressor would have to learn size-dependent behaviour. Dividing the center shift by the
       proposal size ($t_x=(G_x-P_x)/P_w$) makes the target <b>scale-invariant</b>: it is a fraction of the
       box, identical for big and small boxes that are proportionally equally off. The log on the size
       ($t_w=\\log(G_w/P_w)$) turns "multiply the width by $k$" into "add $\\log k$", so growing and shrinking
       are symmetric and a linear regressor can hit them, and exponentiating back ($P_w e^{d_w}$) keeps the
       width positive.</p>
       <p>How well two boxes match &mdash; the <b>IoU</b> = intersection area / union area &mdash; and why
       IoU $\\ge 0.5$ counts as a "hit" is derived and visualized in the <b>dl-object-detection</b> concept
       lesson; we only recap it here and use it to label proposals and judge the refined box.</p>`,
    example:
      `<p>Work the two pieces of math R-CNN needs, by hand, on integer boxes (corner form
       $[x_1,y_1,x_2,y_2]$, units of grid cells).</p>
       <p><b>(a) IoU of a proposal and the ground truth.</b> Ground truth $G=[1,1,6,6]$ (a $5\\times5$ box,
       area $25$). Proposal $P=[3,3,8,7]$ (a $5\\times4$ box, area $20$).</p>
       <ul class="steps">
        <li><b>Intersection box:</b> $x$ from $\\max(1,3)=3$ to $\\min(6,8)=6$ &rarr; width $3$; $y$ from
        $\\max(1,3)=3$ to $\\min(6,7)=6$ &rarr; height $3$. Intersection area $= 3\\times3 = 9$.</li>
        <li><b>Union:</b> $\\text{area}(G) + \\text{area}(P) - \\text{intersection} = 25 + 20 - 9 = 36$.</li>
        <li><b>IoU:</b> $9 / 36 = 0.25$. That is below $0.5$, so this proposal would be labelled
        <b>background</b> for fine-tuning &mdash; it does not yet fit the object well.</li>
       </ul>
       <p><b>(b) Box-regression targets to fix it.</b> Convert to center/size. $G$: center $(3.5,3.5)$, size
       $(5,5)$. $P$: center $(5.5,5.0)$, size $(5,4)$.</p>
       <ul class="steps">
        <li><b>$t_x = (G_x-P_x)/P_w = (3.5-5.5)/5 = -0.4$</b> &mdash; shift the center left by $0.4$ of the box width.</li>
        <li><b>$t_y = (G_y-P_y)/P_h = (3.5-5.0)/4 = -0.375$</b> &mdash; shift up by $0.375$ of the height.</li>
        <li><b>$t_w = \\log(G_w/P_w) = \\log(5/5) = 0$</b> &mdash; width already correct, no change.</li>
        <li><b>$t_h = \\log(G_h/P_h) = \\log(5/4) \\approx 0.223$</b> &mdash; grow the height by a factor $e^{0.223}=1.25$.</li>
       </ul>
       <p>Apply these and the proposal lands on $G$: IoU jumps to $1.0$. These exact numbers are recomputed in
       the notebook's first cell so you can check them by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Propose regions.</b> Run selective search &rarr; ~2000 category-independent boxes $P$. (In our
        toy demo: a few hand-placed candidate boxes.)</li>
        <li><b>Warp + extract features.</b> For each $P$, warp the crop to $227\\times227$ and run the CNN
        &rarr; a 4096-dim feature vector. <i>This is the per-region pass that makes R-CNN slow.</i></li>
        <li><b>Classify.</b> Score each feature with a class-specific linear SVM &rarr; class + confidence.</li>
        <li><b>Label by IoU (training).</b> A proposal is positive for a class if IoU with a ground-truth box
        $\\ge 0.5$ (fine-tuning) / above $0.3$ (SVMs), else background.</li>
        <li><b>Refine the box.</b> Regress $(d_x,d_y,d_w,d_h)$ toward the targets $(t_x,t_y,t_w,t_h)$ and apply
        them to tighten the box.</li>
        <li><b>Count the cost.</b> Total CNN passes $=$ images $\\times$ ~2000. Note how this scales &mdash; the
        Fast R-CNN motivation.</li>
      </ol>`,
    results:
      `<p>From the paper (quoted): "R-CNN achieves a mAP of 53.7% on PASCAL VOC 2010" and "similar performance
       (53.3% mAP) on VOC 2011/12 test", an improvement the abstract calls "more than 30% relative to the
       previous best result on VOC 2012." Bounding-box regression alone "fixes a large number of mislocalized
       detections, boosting mAP by 3 to 4 points." On speed, the paper reports the feature cost as
       "13s/image on a GPU or 53s/image on a CPU."</p>
       <p><i>These are the paper's reported figures, quoted. The timing and IoU numbers in the CODEVIZ panel
       below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the heavy primitives (the CNN, selective search in
       the real system) already exist, so we <b>import / stub the plumbing</b> and build the <b>pipeline and
       its math</b> by hand, on a tiny synthetic image so it runs anywhere. <b>Import / stub:</b> a small
       CNN-style feature extractor (a couple of <code>nn.Conv2d</code> layers &mdash; standing in for the deep
       AlexNet R-CNN used) and a handful of hand-placed "selective search" proposals. <b>Build by hand:</b>
       the per-region warp-and-extract loop, the IoU computation that labels each proposal, the linear
       classifier scoring, the four <b>box-regression targets</b> $(t_x,t_y,t_w,t_h)$ and their application,
       and a <b>count of CNN forward passes per image</b> that demonstrates the slowness. The IoU geometry is
       recapped from the dl-object-detection concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Width-vs-height in the center targets.</b> $t_x$ divides by $P_w$ (width), $t_y$ by $P_h$
        (height) &mdash; not the same denominator. Swapping them skews the shift on non-square boxes.
        <b>Fix:</b> $t_x=(G_x-P_x)/P_w$, $t_y=(G_y-P_y)/P_h$.</li>
        <li><b>Forgetting center/size vs corner form.</b> The regression targets use <b>center+size</b>
        $(x,y,w,h)$, but IoU is easiest in <b>corner</b> form $[x_1,y_1,x_2,y_2]$. Convert deliberately;
        mixing the two silently corrupts both the IoU and the targets.</li>
        <li><b>Skipping the log on the size.</b> $t_w=\\log(G_w/P_w)$, not $G_w/P_w$. Without the log,
        "double" and "halve" are not symmetric and applying $P_w e^{d_w}$ no longer inverts the target.</li>
        <li><b>Expecting it to be fast.</b> The CNN runs <b>once per proposal</b> with no sharing, so cost
        scales with ~2000 regions per image. This is by design in R-CNN &mdash; and exactly the redundancy
        Fast R-CNN removes by running the CNN <b>once over the whole image</b> and cropping features per
        region.</li>
        <li><b>Treating selective search as learned.</b> In R-CNN the proposals come from a fixed,
        non-learned algorithm; the CNN never improves them. Faster R-CNN later makes proposal generation a
        learned network.</li>
      </ul>`,
    recall: [
      "Name the three modules of R-CNN in order.",
      "Write the four box-regression targets $t_x,t_y,t_w,t_h$ from memory.",
      "Why is $t_x$ divided by $P_w$ instead of being a raw pixel offset?",
      "Roughly how many CNN forward passes does R-CNN run per image, and why is that the Fast R-CNN motivation?",
      "What IoU threshold marks a proposal as a positive during fine-tuning?"
    ],
    practice: [
      {
        q: `<b>The slowness ablation / Fast R-CNN motivation.</b> R-CNN runs the CNN once per proposal. Fast
            R-CNN runs the CNN <b>once per image</b> and crops features per region. For an image with $N=2000$
            proposals, by what factor does Fast R-CNN cut the number of CNN forward passes, and why is the
            output quality not thrown away?`,
        steps: [
          { do: `Count R-CNN passes for one image: one warp-and-extract per proposal, so $N = 2000$ CNN forward passes.`, why: `R-CNN shares no computation between overlapping proposals &mdash; each region is processed from scratch.` },
          { do: `Count Fast R-CNN passes: <b>one</b> pass over the whole image to make a feature map, then cheap per-region <b>crops</b> of that map (no extra CNN passes).`, why: `Overlapping proposals reuse the same shared feature map, so the expensive convolutions run only once.` },
          { do: `Take the ratio: $2000 / 1 = 2000\\times$ fewer CNN passes; accuracy holds because each region still gets its own feature (cropped from the shared map) and its own classifier + box regressor.`, why: `The per-region <i>features</i> survive &mdash; only the redundant re-convolution is removed.` }
        ],
        answer: `<p>Fast R-CNN reduces ~2000 CNN forward passes per image to <b>1</b> (about a $2000\\times$
                 cut), by running the convolutions once over the whole image and then cropping per-region
                 features from that shared feature map. Quality is preserved because every proposal still
                 receives its own feature vector and its own classifier + box-regression head &mdash; only the
                 wasteful re-computation on overlapping regions is removed. This redundancy is exactly the
                 slowness our notebook counts, and the reason Fast R-CNN exists.</p>`
      },
      {
        q: `A proposal $P=[2,2,6,5]$ (corner form) and ground truth $G=[1,1,5,5]$. Compute their IoU and decide
            whether $P$ is a fine-tuning <b>positive</b> for that object.`,
        steps: [
          { do: `Areas: $P$ is $4\\times3=12$; $G$ is $4\\times4=16$.`, why: `Width $=x_2-x_1$, height $=y_2-y_1$ in corner form.` },
          { do: `Intersection: $x$ from $\\max(1,2)=2$ to $\\min(5,6)=5$ &rarr; width $3$; $y$ from $\\max(1,2)=2$ to $\\min(5,5)=5$ &rarr; height $3$; area $=9$.`, why: `Overlap is the box of the larger left/top edges and the smaller right/bottom edges.` },
          { do: `Union $=12+16-9=19$; IoU $=9/19\\approx0.47$. Since $0.47 \\lt 0.5$, $P$ is <b>not</b> a positive (it is background for fine-tuning).`, why: `R-CNN's &sect;2.3 rule: IoU $\\ge 0.5$ with a ground-truth box marks a proposal positive.` }
        ],
        answer: `<p>IoU $= 9/19 \\approx 0.47$. Because that is just below the $0.5$ fine-tuning threshold, $P$
                 is labelled <b>background</b>, not a positive for the object &mdash; a near-miss the box
                 regressor would need to pull in before it counts as a detection.</p>`
      },
      {
        q: `Using the worked example's targets, apply the box regression. Proposal center/size is
            $P=(5.5,\\,5.0,\\,5,\\,4)$ and the predicted transform equals the targets
            $(d_x,d_y,d_w,d_h)=(-0.4,\\,-0.375,\\,0,\\,0.223)$. What box do you get, and what is its IoU with
            the ground truth $G=(3.5,3.5,5,5)$?`,
        steps: [
          { do: `Center: $x = P_x + P_w d_x = 5.5 + 5(-0.4) = 3.5$; $\\;y = P_y + P_h d_y = 5.0 + 4(-0.375) = 3.5$.`, why: `Apply (invert) the center targets: new center $= P_{x} + P_{w}\\,d_x$.` },
          { do: `Size: $w = P_w e^{d_w} = 5 e^{0} = 5$; $\\;h = P_h e^{d_h} = 4 e^{0.223} \\approx 4 \\times 1.25 = 5$.`, why: `Apply the log-space size targets: new width $= P_w e^{d_w}$.` },
          { do: `Refined box has center $(3.5,3.5)$, size $(5,5)$ &mdash; identical to $G$, so IoU $=1.0$.`, why: `When the predicted transform equals the targets, the proposal lands exactly on the ground truth.` }
        ],
        answer: `<p>The refined box is center $(3.5,3.5)$, size $(5,5)$ &mdash; <b>exactly</b> the ground truth
                 $G$, so IoU $=1.0$. The regression moved a poorly-fitting proposal onto the object, which is
                 why the paper reports box regression "boosting mAP by 3 to 4 points." Predicting the targets
                 $(t_x,t_y,t_w,t_h)$ and applying them via $P_x+P_w d_x$ and $P_w e^{d_w}$ recovers $G$.</p>`
      }
    ]
  });

  window.CODE["paper-rcnn"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we build the <b>R-CNN pipeline</b> on a tiny synthetic image so it runs anywhere
       (torch is preinstalled in Colab &mdash; no pip). The steps mirror Fig. 1: a few hand-placed
       <b>"selective search" proposals</b> &rarr; <b>warp</b> each crop to a fixed size &rarr; a small
       CNN-style <b>feature extractor</b> (standing in for the deep AlexNet R-CNN used) &rarr; a linear
       <b>classifier</b> &rarr; <b>IoU</b> labelling &rarr; <b>box regression</b> with the Appendix-C targets
       $t_x=(G_x-P_x)/P_w,\\;t_w=\\log(G_w/P_w)$. The first cell recomputes the worked example
       (IoU $=0.25$; targets $(-0.4,-0.375,0,0.223)$; refined IoU $=1.0$). The last cell <b>counts CNN
       forward passes per image</b> &mdash; one per proposal &mdash; to make the slowness that motivated
       Fast R-CNN concrete. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import math

torch.manual_seed(0)

# ---- box helpers: corner form [x1,y1,x2,y2] and center form (cx,cy,w,h) ----
def area(b): return max(0.0, b[2]-b[0]) * max(0.0, b[3]-b[1])
def iou(a, b):
    ix = max(0.0, min(a[2],b[2]) - max(a[0],b[0]))
    iy = max(0.0, min(a[3],b[3]) - max(a[1],b[1]))
    inter = ix*iy
    union = area(a) + area(b) - inter
    return inter/union if union > 0 else 0.0
def to_center(b):  # corner -> (cx,cy,w,h)
    return ((b[0]+b[2])/2, (b[1]+b[3])/2, b[2]-b[0], b[3]-b[1])
def to_corner(c):  # (cx,cy,w,h) -> corner
    return [c[0]-c[2]/2, c[1]-c[3]/2, c[0]+c[2]/2, c[1]+c[3]/2]

# ---- 0. Sanity-check the lesson's worked example. ----
G = [1,1,6,6]; P = [3,3,8,7]
print("worked (a) IoU(P,G) =", round(iou(P, G), 4))          # 0.25
Pc, Gc = to_center(P), to_center(G)
tx = (Gc[0]-Pc[0]) / Pc[2]
ty = (Gc[1]-Pc[1]) / Pc[3]
tw = math.log(Gc[2] / Pc[2])
th = math.log(Gc[3] / Pc[3])
print("worked (b) targets t =", [round(tx,3), round(ty,3), round(tw,3), round(th,3)])  # [-0.4,-0.375,0.0,0.223]
# apply the transform (here d == t) and confirm we land on G
nx = Pc[0] + Pc[2]*tx; ny = Pc[1] + Pc[3]*ty
nw = Pc[2]*math.exp(tw); nh = Pc[3]*math.exp(th)
refined = to_corner((nx, ny, nw, nh))
print("refined box =", [round(v,2) for v in refined], " IoU after regression =", round(iou(refined, G), 4))  # 1.0


# ---- 1. A tiny synthetic image with one object (a bright square on the ground-truth box). ----
H = W = 32
img = torch.zeros(1, 1, H, W)
gt = [10, 8, 22, 24]                     # ground-truth object box (corner form)
img[0, 0, gt[1]:gt[3], gt[0]:gt[2]] = 1.0

# ---- 2. "Selective search": a few hand-placed candidate proposals. ----
proposals = [[10,8,22,24], [12,10,24,26], [2,2,12,12], [16,4,30,28]]

# ---- 3. A small CNN-style feature extractor (stands in for deep AlexNet R-CNN used). ----
feat = nn.Sequential(nn.Conv2d(1, 4, 3, padding=1), nn.ReLU(),
                     nn.AdaptiveAvgPool2d(1), nn.Flatten())   # -> 4-dim feature per region
clf  = nn.Linear(4, 1)                                        # linear "object vs background" scorer

# ---- 4. The R-CNN per-region loop: warp -> CNN -> classify -> IoU -> box-regress. ----
def warp(box, size=8):                                        # crop + resize to fixed input
    x1,y1,x2,y2 = [int(v) for v in box]
    crop = img[:, :, y1:y2, x1:x2]
    return nn.functional.interpolate(crop, size=(size, size), mode="bilinear", align_corners=False)

cnn_passes = 0
print("\\nper-proposal pipeline:")
for P in proposals:
    f = feat(warp(P)); cnn_passes += 1                        # ONE CNN pass per proposal (the slow part)
    score = torch.sigmoid(clf(f)).item()
    j = iou(P, gt)
    label = "object" if j >= 0.5 else "background"            # R-CNN fine-tuning rule (IoU >= 0.5)
    # box-regression targets to pull this proposal onto the ground truth (Appendix C)
    Pc, Gc = to_center(P), to_center(gt)
    t = [(Gc[0]-Pc[0])/Pc[2], (Gc[1]-Pc[1])/Pc[3], math.log(Gc[2]/Pc[2]), math.log(Gc[3]/Pc[3])]
    refined = to_corner((Pc[0]+Pc[2]*t[0], Pc[1]+Pc[3]*t[1], Pc[2]*math.exp(t[2]), Pc[3]*math.exp(t[3])))
    print(f"  P={P}  score={score:.2f}  IoU={j:.2f} ({label})  "
          f"IoU after regression={iou(refined, gt):.2f}")

# ---- 5. The slowness that motivated Fast R-CNN: CNN passes scale with proposals * images. ----
print(f"\\nCNN forward passes for THIS image: {cnn_passes} (one per proposal)")
proposals_per_image = 2000                                    # R-CNN's real count (paper, Sec 2.2)
for n_images in (1, 100, 5000):
    print(f"  {n_images} images x {proposals_per_image} proposals = "
          f"{n_images*proposals_per_image} CNN passes (R-CNN)  vs  {n_images} (Fast R-CNN, 1 per image)")
# R-CNN runs the CNN once per region with no sharing -> ~2000x the passes of Fast R-CNN.
# (Numbers here are our toy run, not the paper's reported timings.)`
  };

  window.CODEVIZ["paper-rcnn"] = {
    question: "How does R-CNN's CNN-forward-pass cost grow with dataset size, vs Fast R-CNN (one pass per image)?",
    charts: [
      {
        type: "line",
        title: "CNN forward passes vs number of images — R-CNN (~2000/image) vs Fast R-CNN (1/image)",
        xlabel: "number of images",
        ylabel: "total CNN forward passes",
        series: [
          {
            name: "R-CNN (~2000 passes/image)",
            color: "#ff7b72",
            points: [[0,0],[10,20000],[20,40000],[30,60000],[40,80000],[50,100000],[60,120000],[70,140000],[80,160000],[90,180000],[100,200000]]
          },
          {
            name: "Fast R-CNN (1 pass/image)",
            color: "#7ee787",
            points: [[0,0],[10,10],[20,20],[30,30],[40,40],[50,50],[60,60],[70,70],[80,80],[90,90],[100,100]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. R-CNN runs the CNN <b>once per region proposal</b> with no sharing, so for ~2000 proposals/image the total CNN forward passes grow as $2000\\times$ the image count (red, steep). Fast R-CNN runs the convolutions <b>once per image</b> and crops per-region features from that shared map (green, near-flat). At 100 images that is 200,000 passes vs 100 &mdash; the redundancy R-CNN's per-region loop creates and the reason Fast R-CNN was built. The toy-image pipeline in the CODE cell counts exactly this for a handful of proposals.",
    code: `# The cost model R-CNN's per-region loop implies (vs Fast R-CNN's shared pass).
proposals_per_image = 2000          # R-CNN, paper Sec 2.2 ("around 2000 region proposals")
for n_images in range(0, 101, 10):
    rcnn = n_images * proposals_per_image   # one CNN pass per proposal
    fast = n_images                         # Fast R-CNN: one CNN pass per image, then cheap crops
    print([n_images, rcnn, fast])
# [0, 0, 0]
# [10, 20000, 10]
# [20, 40000, 20]
# ...
# [100, 200000, 100]
# R-CNN's passes scale with proposals x images; Fast R-CNN's with images only (~2000x fewer).
# (Our toy cost model, not the paper's wall-clock timings.)`
  };
})();
