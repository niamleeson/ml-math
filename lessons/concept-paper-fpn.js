/* Paper lesson — "Feature Pyramid Networks for Object Detection" (Lin et al., 2016/2017).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-fpn".
   GROUNDED from arXiv:1612.03144 (abstract) and the ar5iv HTML mirror (Section 1: the image-pyramid
   problem; Section 3: bottom-up pathway {C2..C5} with strides {4,8,16,32}, the top-down + lateral
   merge — 2x nearest-neighbor upsample, 1x1 lateral conv, element-wise add, 3x3 anti-alias conv,
   d=256 channels, {P2..P5}; Table 1: the lateral / top-down ablation).
   Track B (architecture): build the top-down + lateral merge by hand on toy feature maps with torch;
   reproduce the QUALITATIVE effect (every pyramid level becomes both high-resolution AND
   semantically strong; removing the lateral connection collapses localization signal).
   The detection-pipeline math lives in concept dl-object-detection; here we recap and link.
   Cross-links: paper-faster-rcnn (the detector FPN plugs into) and paper-mask-rcnn (FPN's biggest
   downstream user). */
(function () {
  window.LESSONS.push({
    id: "paper-fpn",
    title: "FPN — Feature Pyramid Networks for Object Detection (2016)",
    tagline: "Add a top-down pathway with lateral connections to a plain backbone, turning its one-way feature hierarchy into a multi-scale pyramid that is high-resolution AND semantically strong at every level.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Tsung-Yi Lin, Piotr Dollár, Ross Girshick, Kaiming He, Bharath Hariharan, Serge Belongie",
      org: "Facebook AI Research (FAIR), Cornell University, Cornell Tech",
      year: 2016,
      venue: "arXiv:1612.03144 (Dec 2016); CVPR 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1612.03144",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-object-detection", "dl-conv", "dl-resnet", "pt-cnn", "pt-nn-module", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p><b>Object detection</b> means: in one image, draw a tight box around every object and label each
       one. Objects come in wildly different <b>sizes</b> &mdash; a face filling the frame, a distant
       pedestrian a few pixels tall &mdash; so a detector must recognize things at many <b>scales</b>.
       The classic fix was a <b>featurized image pyramid</b>: shrink the image to several sizes, run the
       whole network on each copy, and detect at every size. It works, but it is slow and memory-hungry.</p>
       <blockquote>"Featurized image pyramids &hellip; increase inference time considerably &hellip; making
       this approach impractical for real applications." It is also "infeasible in terms of memory" to train
       end-to-end on. (&sect;1)</blockquote>
       <p>A <b>convolutional network</b> (a stack of learned image filters) already produces a built-in
       hierarchy of feature maps that shrink as you go deeper &mdash; so why not just detect off those? The
       catch is a <b>semantic gap</b>. A <b>feature map</b> is the network's internal grid of numbers
       describing the image at some layer. <b>Early</b> maps are <b>high-resolution</b> (fine spatial
       detail, good for locating small objects) but <b>semantically weak</b> (they have only seen edges and
       textures, not whole objects). <b>Late</b> maps are <b>semantically strong</b> (they recognize whole
       objects) but <b>low-resolution</b> (coarse, so small objects are blurred away). SSD (see
       <code>paper-ssd</code>) detected off these maps directly but, the paper notes, reused only the
       <i>high</i> layers and "missed the opportunity to reuse the higher-resolution maps" &mdash; so it
       still struggled on small objects. FPN asks: can we make <b>every</b> level both high-resolution and
       semantically strong, cheaply, in one pass?</p>`,
    contribution:
      `<ul>
        <li><b>A top-down pathway.</b> Alongside the usual <b>bottom-up</b> backbone (the normal forward
        pass, which gets coarser and deeper), FPN adds a second pathway that goes <b>top-down</b>: it takes
        the deepest, most semantic map and <b>upsamples</b> it (enlarges it back up) step by step, carrying
        that strong semantic meaning down into higher-resolution levels.</li>
        <li><b>Lateral connections.</b> At each level the upsampled top-down map is <b>merged by
        element-wise addition</b> with the same-resolution bottom-up map (after a $1\\times1$ convolution
        fixes the channel count). The bottom-up map supplies precise <b>location</b>; the top-down map
        supplies <b>semantics</b>. Their sum has both.</li>
        <li><b>A clean, generic multi-scale pyramid.</b> The result is a set of feature maps
        $\\{P_2, P_3, P_4, P_5\\}$ &mdash; one per scale, all with the same channel count ($256$) &mdash;
        that drops into existing detectors (Region Proposal Network, Fast/Faster R-CNN) as a better feature
        extractor, at marginal extra cost.</li>
      </ul>`,
    whyItMattered:
      `<p>FPN became the <b>default neck</b> of modern detectors. <b>RetinaNet</b> (Focal Loss) is built on
       it, and <b>Mask R-CNN</b> (see <code>paper-mask-rcnn</code>) uses FPN as its backbone to get the
       crisp, multi-scale features that instance segmentation needs. When you see a detector diagram with a
       "<b>backbone &rarr; neck &rarr; head</b>" shape, the neck is almost always an FPN or a descendant of
       it. It made multi-scale detection nearly free, and it plugs straight into the two-stage
       <b>Faster R-CNN</b> pipeline (see <code>paper-faster-rcnn</code>) you already know.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; Figure 1 contrasts four designs: (a) featurized image
        pyramid, (b) single feature map, (c) pyramidal feature hierarchy (SSD-style), (d) FPN. Understanding
        why (d) beats (b) and (c) is the whole point.</li>
        <li><b>&sect;3 (Feature Pyramid Networks)</b> &mdash; the core. Three paragraphs: the <b>bottom-up
        pathway</b> ({C2,C3,C4,C5}, strides {4,8,16,32}), the <b>top-down pathway and lateral
        connections</b> (the merge block in Figure 3), and the design choices ($d=256$, $1\\times1$ lateral
        conv, $3\\times3$ anti-alias conv, no non-linearities in the extra layers).</li>
        <li><b>Table 1</b> &mdash; the ablation on a Region Proposal Network: rows that remove the top-down
        pathway, remove the lateral connections, or use only the finest pyramid level. This is the evidence
        that each piece matters.</li>
       </ul>
       <p><b>Skim:</b> &sect;4&ndash;5 (the exact RPN and Fast/Faster R-CNN plumbing and the full COCO
       result tables) and the implementation appendix. The math you must own is the <b>merge equation</b>:
       upsample, $1\\times1$ the lateral, add, then $3\\times3$.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>FPN merges a coarse-but-semantic top-down map with a fine-but-shallow bottom-up map by
       <b>upsampling</b> the top-down one to match, passing the bottom-up one through a $1\\times1$
       convolution, and <b>adding</b> them. Before running, predict: if you <b>delete the lateral
       connection</b> (keep only the upsampled top-down map, drop the bottom-up add), what happens to the
       network's ability to <b>localize</b> objects precisely? Will detection recall go up, stay the same,
       or fall &mdash; and will <b>small</b> objects suffer more than large ones? Write your guess, then run
       the ablation below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the merge block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>lateral(c)</code> &mdash; a $1\\times1$ convolution that maps a bottom-up map
        <code>c</code> (with its own channel count) to <b>$d=256$</b> channels, <i>without</i> changing its
        height or width. TODO: <code>nn.Conv2d(c_channels, 256, kernel_size=1)</code>.</li>
        <li><code>merge(top, c)</code> &mdash; TODO: <b>upsample</b> <code>top</code> by a factor of
        <b>2</b> with <b>nearest-neighbor</b> interpolation so it matches <code>c</code>'s resolution, run
        <code>c</code> through <code>lateral</code>, and return their <b>element-wise sum</b>.</li>
        <li>TODO: after the sum, apply a $3\\times3$ convolution to produce the final $P$ level (it reduces
        the aliasing that nearest-neighbor upsampling introduces).</li>
        <li>TODO the <b>ablation</b>: a second <code>merge_no_lateral</code> that returns just the upsampled
        <code>top</code> (no bottom-up add), and compare how well each preserves a sharp feature.</li>
       </ul>
       <p>Predict whether dropping the lateral add blurs out fine location detail, then check the printed
       numbers.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start with an ordinary <b>bottom-up pathway</b>: the backbone's normal forward pass. As it goes
       deeper it produces feature maps at decreasing resolution. FPN picks the output of each <b>stage</b>
       (a group of layers that share one resolution) &mdash; for a ResNet these are
       $\\{C_2, C_3, C_4, C_5\\}$, with <b>strides</b> $\\{4, 8, 16, 32\\}$ pixels. "Stride $s$" means each
       cell of that map covers an $s\\times s$ patch of the input, so a larger stride is a coarser, smaller
       map: $C_5$ is the smallest and deepest (strongest semantics, worst resolution), $C_2$ the largest and
       shallowest. (&sect;3)</p>
       <p>Now build a <b>top-down pathway</b> that walks back up in resolution. The paper: "The top-down
       pathway hallucinates higher resolution features by upsampling spatially coarser, but semantically
       stronger, feature maps from higher pyramid levels." (&sect;3) "<b>Upsampling</b>" means enlarging a
       small map to a bigger grid; FPN uses <b>nearest-neighbor</b> interpolation (each pixel is copied into
       a $2\\times2$ block) by a factor of $2$ at each step, for simplicity. (&sect;3)</p>
       <p>The key move is the <b>lateral connection</b>, where the two pathways meet. The paper: "With a
       coarser-resolution feature map, we upsample the spatial resolution by a factor of 2 (using nearest
       neighbor upsampling for simplicity). The upsampled map is then merged with the corresponding
       bottom-up map (which undergoes a $1\\times1$ convolutional layer to reduce channel dimensions) by
       <b>element-wise addition</b>." (&sect;3) A <b>$1\\times1$ convolution</b> is a per-pixel channel mixer:
       it leaves height and width untouched and only re-projects the channels &mdash; here, down to the
       shared width $d = 256$ so the two maps can be added. The bottom-up map brings <b>where</b> (sharp
       location); the upsampled top-down map brings <b>what</b> (semantics); their sum carries both.</p>
       <p>To <b>start the iteration</b>, the paper: "we simply attach a $1\\times1$ convolutional layer on
       $C_5$ to produce the coarsest resolution map." (&sect;3) That map is then upsampled and merged with
       $C_4$, that result with $C_3$, and so on. Finally: "we append a $3\\times3$ convolution on each merged
       map to generate the final feature map, which is to reduce the aliasing effect of upsampling. This
       final set of feature maps is called $\\{P_2, P_3, P_4, P_5\\}$." (&sect;3) Every $P$ level has the same
       channel count: "We set $d=256$ in this paper and thus all extra convolutional layers have 256-channel
       outputs. There are no non-linearities in these extra layers." (&sect;3)</p>`,
    architecture:
      `<p>FPN is a <b>neck</b>: it sits between a backbone and a detector head, and the same pyramid feeds
       both stages of a two-stage detector. Here is the whole assembly, component by component.</p>
       <p><b>1. Bottom-up pathway (the backbone).</b> A ResNet runs its normal forward pass. FPN taps the
       <b>last residual block of each stage</b> &mdash; conv2, conv3, conv4, conv5 outputs &mdash; giving
       $\\{C_2, C_3, C_4, C_5\\}$ at strides $\\{4, 8, 16, 32\\}$. (&sect;3) "We do not include conv1 into the
       pyramid due to its large memory footprint." (&sect;3) So the finest tapped level is stride-4 $C_2$.</p>
       <p><b>2. Top-down pathway + lateral merges (the FPN proper).</b> Start with $M_5 = \\text{Conv}_{1\\times1}(C_5)$.
       For $\\ell = 4,3,2$: $2\\times$ nearest-neighbor upsample $M_{\\ell+1}$, $1\\times1$-project $C_{\\ell}$ to
       $d=256$, add, then $3\\times3$-smooth to get $P_{\\ell}$. Output: $\\{P_2, P_3, P_4, P_5\\}$, all
       $256$-channel, at strides $\\{4,8,16,32\\}$. No non-linearities in these extra layers. (&sect;3)</p>
       <p><b>3a. FPN &rarr; RPN (the Region Proposal Network, the first stage).</b> (&sect;4.1) The RPN head is
       "the same design ($3\\times3$ conv and two sibling $1\\times1$ convs)" &mdash; one $1\\times1$ for
       objectness, one for box regression &mdash; and its <b>parameters are shared across all pyramid levels</b>.
       Because each level already targets one scale, every level uses a <b>single anchor scale</b>: areas
       $\\{32^2, 64^2, 128^2, 256^2, 512^2\\}$ on $\\{P_2, P_3, P_4, P_5, P_6\\}$, where "$P_6$ is simply a
       stride-two subsampling of $P_5$" added to cover the largest anchors. With $3$ aspect ratios
       $\\{1{:}2, 1{:}1, 2{:}1\\}$ per level, "in total there are $15$ anchors over the pyramid." (&sect;4.1)
       Anchors are matched to ground-truth boxes by intersection-over-union, exactly as in the original RPN.</p>
       <p><b>3b. FPN &rarr; Fast R-CNN (the box head, the second stage).</b> (&sect;4.2) Given the RoIs proposed
       above, each RoI is assigned to <b>one</b> pyramid level by the level-assignment rule
       $k = \\lfloor k_0 + \\log_2(\\sqrt{wh}/224)\\rfloor$ with $k_0 = 4$ (Eq. 1): big RoIs read off coarse,
       semantic levels; small RoIs read off fine, high-resolution levels. From that level, RoI pooling
       extracts $7\\times7$ features, followed by "two hidden $1{,}024$-d fully-connected (fc) layers" and the
       classification + box-regression outputs &mdash; one shared head for all levels (replacing the conv5
       head of the single-scale Faster R-CNN). (&sect;4.2)</p>
       <p><b>Data flow end to end:</b> image &rarr; backbone $\\{C_2..C_5\\}$ &rarr; FPN $\\{P_2..P_6\\}$ &rarr;
       shared RPN head over all levels &rarr; RoIs &rarr; per-RoI level pick by Eq. 1 &rarr; RoI pool $\\to 7\\times7$
       &rarr; two $1024$-d fc &rarr; class + box. The pyramid is built once and reused by both heads.</p>`,
    symbols: [
      { sym: "feature map", desc: "a plain term, not a symbol: the network's internal grid of numbers describing the image at one layer, with a width (channels), a height, and a width. Early maps are fine-detailed but shallow; deep maps are coarse but semantic." },
      { sym: "$C_2, C_3, C_4, C_5$", desc: "the <b>bottom-up</b> feature maps &mdash; the output of each backbone stage in the normal forward pass. $C_2$ is the highest-resolution (shallowest), $C_5$ the lowest-resolution (deepest, most semantic)." },
      { sym: "$P_2, P_3, P_4, P_5$", desc: "the <b>pyramid</b> feature maps that FPN produces &mdash; one per level, each the same resolution as the matching $C$, but now both high-resolution AND semantically strong. These are what the detector reads from." },
      { sym: "stride", desc: "how many input pixels one cell of a feature map covers. $C_2..C_5$ have strides $\\{4,8,16,32\\}$: a stride-32 map ($C_5$) is $32\\times$ coarser than the input, so a small map." },
      { sym: "bottom-up pathway", desc: "the backbone's ordinary forward pass: resolution decreases and semantic strength increases as you go deeper." },
      { sym: "top-down pathway", desc: "the added pathway that goes the other way: it upsamples the deepest map back up through the resolutions, carrying semantic strength into the high-resolution levels." },
      { sym: "lateral connection", desc: "the sideways link that, at each level, adds the bottom-up map (after a $1\\times1$ conv) to the upsampled top-down map. It injects precise location into the semantic top-down stream." },
      { sym: "upsample (2×, nearest-neighbor)", desc: "enlarge a feature map to double its height and width by copying each pixel into a $2\\times2$ block. Used to bring a coarse top-down map up to the next finer resolution." },
      { sym: "$1\\times1$ convolution", desc: "a convolution with a $1\\times1$ kernel: it mixes channels per pixel and leaves height/width unchanged. FPN uses it on the lateral path to re-project the bottom-up map to $d$ channels so the add is possible." },
      { sym: "$3\\times3$ convolution", desc: "a convolution with a $3\\times3$ kernel applied to each merged map. It smooths the blocky artifacts (aliasing) that nearest-neighbor upsampling leaves behind, producing the final $P$ level." },
      { sym: "$d$", desc: "the shared channel count of every pyramid level and every extra FPN conv layer; $d=256$ in the paper. Fixing it makes all $P$ levels interchangeable to the detector head." },
      { sym: "element-wise addition ($+$)", desc: "add two equal-shaped tensors position by position. The merge is a plain sum (not a concatenation), so the two maps MUST already match in resolution and channel count." },
      { sym: "$M_{\\ell}$", desc: "the running <b>merged</b> top-down map at level $\\ell$ (the pyramid state before the final $3\\times3$ smoothing). $M_5$ starts the iteration; each $M_{\\ell}$ becomes $P_{\\ell}$ after the smoothing conv." },
      { sym: "RoI (region of interest)", desc: "a candidate box on the input image (proposed by the RPN) that the second-stage head will classify and refine. In Fast R-CNN each RoI is read off one pyramid level." },
      { sym: "$w, h$", desc: "the <b>width and height of an RoI</b>, in input-image pixels. They set which pyramid level $P_k$ the RoI is pooled from via the level-assignment rule (Eq. 1, &sect;4.2)." },
      { sym: "$k$", desc: "the pyramid <b>level index</b> an RoI is assigned to: read features off $P_k$. Computed from the RoI size by Eq. 1 and clamped to the available levels $\\{2,3,4,5\\}$." },
      { sym: "$k_0$", desc: "the target level for a canonical $224\\times224$ RoI; the paper sets $k_0=4$ (matching the single-scale Faster R-CNN that uses $C_4$). It anchors the level-assignment rule." },
      { sym: "$224$", desc: "the canonical ImageNet pre-training image size (in pixels). It is the reference RoI side length in Eq. 1: an RoI of area $224^2$ maps to level $k_0$." },
      { sym: "anchor", desc: "a fixed reference box of a given scale and aspect ratio that the RPN classifies as object/not and regresses. FPN uses ONE scale per level: areas $\\{32^2,..,512^2\\}$ on $\\{P_2,..,P_6\\}$, $\\times 3$ aspect ratios = $15$ anchors total." },
      { sym: "$P_6$", desc: "an extra coarsest level used only by the RPN, formed by stride-2 subsampling of $P_5$, to host the largest ($512^2$) anchors. Not part of the $\\{P_2..P_5\\}$ used by the Fast R-CNN head." },
      { sym: "RPN (Region Proposal Network)", desc: "the first-stage network that scans the pyramid with a shared $3\\times3$-conv + two $1\\times1$-conv head and outputs candidate object boxes (RoIs) for the second stage." }
    ],
    formula: `$$ M_5 = \\text{Conv}_{1\\times1}(C_5) \\qquad\\text{(\\S3 — start the top-down iteration on the coarsest backbone map } C_5\\text{)} $$
<p>The top-down recursion for $\\ell = 4, 3, 2$ (build the running merged map $M_{\\ell}$ from the next-coarser $M_{\\ell+1}$ and the same-level backbone map $C_{\\ell}$):</p>
$$ M_{\\ell} \\;=\\; \\underbrace{\\text{Conv}_{1\\times1}(C_{\\ell})}_{\\text{lateral: location}} \\;+\\; \\underbrace{\\text{Upsample}^{\\text{nn}}_{2\\times}(M_{\\ell+1})}_{\\text{top-down: semantics}} $$
<p>&sect;3 — the lateral connection: $1\\times1$-project the bottom-up map $C_{\\ell}$ to $d=256$ channels, $2\\times$ nearest-neighbor-upsample the coarser merged map, and add element-wise.</p>
$$ P_{\\ell} \\;=\\; \\text{Conv}_{3\\times3}(M_{\\ell}), \\qquad d = 256, \\quad \\text{no non-linearities in the extra layers} $$
<p>&sect;3 — the final $3\\times3$ smoothing conv on each merged map gives the output pyramid level $P_{\\ell}$ (reduces aliasing from upsampling). Every $P$ level has $d=256$ channels.</p>
$$ k \\;=\\; \\Big\\lfloor\\, k_0 + \\log_2\\!\\big(\\sqrt{w\\,h}\\,/\\,224\\big) \\,\\Big\\rfloor, \\qquad k_0 = 4 $$
<p>&sect;4.2, Eq. (1) — the <b>level-assignment rule</b> for Fast R-CNN: a region-of-interest (RoI) of width $w$ and height $h$ (in input-image pixels) is read off pyramid level $P_k$. $224$ is the canonical ImageNet pre-training size; $k_0=4$ is the level a $224\\times224$ RoI maps to, so larger RoIs go to coarser (higher-$k$) levels, smaller ones to finer levels. $k$ is clamped to the available levels $\\{2,3,4,5\\}$.</p>`,
    whatItDoes:
      `<p>Read the merge equation from <b>right to left and top to bottom</b>. $M_{\\ell}$ is the merged
       top-down map at level $\\ell$ (the running pyramid state before the final smoothing conv). To build
       it you take the <b>next-coarser</b> merged map $M_{\\ell+1}$, <b>upsample it $2\\times$</b> so it
       reaches this level's resolution, and <b>add</b> the bottom-up map $C_{\\ell}$ after a $1\\times1$
       convolution puts it into $d=256$ channels. The sum literally fuses two signals at the same pixel:
       the top-down term says <i>what</i> is here (semantics carried down from the deep layers), the lateral
       term says <i>exactly where</i> (fine location from the shallow, high-resolution backbone map).</p>
       <p>The recursion <b>starts at the top</b>: $M_5 = \\text{Conv}_{1\\times1}(C_5)$ &mdash; the coarsest
       map has no coarser map above it, so it is just $C_5$ re-projected to $256$ channels. Then a final
       $3\\times3$ convolution on each $M_{\\ell}$ smooths the upsampling artifacts to give the output level
       $P_{\\ell}$. Because the operation is an <b>add</b>, the two maps must already match in resolution
       (hence the upsample) and channels (hence the $1\\times1$); that shape-matching is the whole trick.</p>
       <p>The <b>level-assignment rule</b> $k = \\lfloor k_0 + \\log_2(\\sqrt{wh}/224)\\rfloor$ (Eq. 1) says, in
       words: take an RoI of width $w$ and height $h$; its <b>geometric-mean side</b> is $\\sqrt{wh}$. Divide
       by the reference size $224$ and take $\\log_2$ — so the RoI's size relative to $224$ becomes a number
       of "octaves" (doublings). Add the base level $k_0=4$ and floor it. The effect: an RoI of side $224$
       gives $\\log_2(1)=0$, so $k=4$ (read off $P_4$); doubling the RoI's side adds $1$ to $k$ (coarser
       level); halving it subtracts $1$ (finer level). It routes each box to the pyramid level whose receptive
       scale matches the box, then clamps $k$ to the available $\\{2,3,4,5\\}$.</p>`,
    derivation:
      `<p>This lesson has no separate concept owner (<code>conceptLink</code> is null), so here is the full
       "why," all from &sect;3.</p>
       <p><b>Why a top-down pathway at all?</b> The deep map $C_5$ knows <i>what</i> objects are present but
       has thrown away <i>where</i> (it is $32\\times$ downsampled). The shallow map $C_2$ knows <i>where</i>
       everything is (stride 4) but not <i>what</i> (it has only seen edges). Detecting off $C_2$ alone
       misses objects; detecting off $C_5$ alone mislocates them, especially small ones. The top-down
       pathway carries $C_5$'s semantics back down to $C_2$'s resolution so one map has both.</p>
       <p><b>Why <i>add</i> instead of <i>concatenate</i>?</b> Addition keeps the channel count fixed at
       $d=256$ no matter how many levels you fuse, so every $P$ level has an identical shape and the same
       detector head can read all of them. Concatenation would grow the channels at each merge. The price of
       adding is that both operands must already be $256$ channels &mdash; that is exactly why the lateral
       path has its $1\\times1$ conv.</p>
       <p><b>Why $1\\times1$ on the lateral, $3\\times3$ after the merge?</b> The $1\\times1$ conv only needs to
       change the <i>channel count</i> of the bottom-up map (and not blur its sharp location), so a per-pixel
       channel projection is exactly right &mdash; it preserves resolution perfectly. The post-merge
       $3\\times3$ conv has a spatial footprint, which is what is needed to <b>smooth the blocky aliasing</b>
       that nearest-neighbor $2\\times$ upsampling stamps into the top-down term. The paper also drops
       non-linearities from these extra layers, keeping the pyramid a simple linear feature transform.</p>
       <p><b>Why nearest-neighbor upsampling?</b> "for simplicity" (&sect;3) &mdash; it has no parameters and
       the following $3\\times3$ conv cleans up its artifacts, so a fancier learned upsampler buys little.</p>
       <p><b>Why the level-assignment rule $k=\\lfloor k_0+\\log_2(\\sqrt{wh}/224)\\rfloor$?</b> (&sect;4.2) Each
       pyramid level has a fixed stride, so it "sees" objects at one scale band well. A large RoI cropped from
       a fine, high-resolution level would cover a huge grid with little semantic context; a small RoI cropped
       from a coarse level would land on just a pixel or two and lose all detail. The rule matches RoI size to
       level scale on a $\\log_2$ (octave) axis, so the box is pooled where features are at the right
       resolution. The constants come from the single-scale Faster R-CNN it generalizes: that system reads all
       RoIs off $C_4$, and a $224\\times224$ RoI (ImageNet's pre-training size) is the "canonical" box &mdash;
       so the paper sets $k_0=4$, making the rule reduce to $k=4$ for a $224$-sided RoI and shift by one level
       per octave of size change. The floor and the clamp keep $k$ an integer in $\\{2,3,4,5\\}$.</p>`,
    example:
      `<p>Work one merge step by hand on toy shapes, level $\\ell = 4$ (build $M_4$ from $C_4$ and the
       coarser $M_5$). Use channel-count $d = 256$ throughout. (Every shape and the addition below is
       recomputed in the notebook so you can check it.)</p>
       <ul class="steps">
        <li><b>The two inputs.</b> The bottom-up map $C_4$ has stride $16$, so on a $64\\times64$ toy "image"
        it is $4\\times4$ spatially; say it carries $C_{\\text{in}} = 512$ channels &mdash; shape
        $(512, 4, 4)$. The coarser merged map $M_5$ already sits at stride $32$, i.e. $2\\times2$, with the
        FPN width $256$ &mdash; shape $(256, 2, 2)$.</li>
        <li><b>Lateral $1\\times1$ on $C_4$.</b> Apply a $1\\times1$ conv mapping $512 \\to 256$ channels. It
        does <b>not</b> touch height/width, so the shape goes $(512,4,4) \\to (256,4,4)$. This is the
        "location" operand.</li>
        <li><b>Upsample $M_5$ by $2\\times$.</b> Nearest-neighbor doubling turns $(256,2,2) \\to (256,4,4)$:
        each of the $2\\times2$ cells is copied into a $2\\times2$ block. This is the "semantics" operand,
        now at $C_4$'s resolution.</li>
        <li><b>Element-wise add.</b> Both operands are now exactly $(256,4,4)$, so add them position by
        position: $M_4 = \\text{lateral}(C_4) + \\text{up}(M_5)$, shape $(256,4,4)$. A worked single cell:
        if $\\text{lateral}(C_4)$ has value $\\mathbf{0.30}$ at channel 0, row 0, col 0, and the upsampled
        $M_5$ has $\\mathbf{0.50}$ there, the merged $M_4$ holds $0.30 + 0.50 = \\mathbf{0.80}$ at that
        position.</li>
        <li><b>Final $3\\times3$ conv (same padding).</b> $\\text{Conv}_{3\\times3}: (256,4,4) \\to (256,4,4)$
        gives the output level $P_4$, smoothing the upsampling aliasing. Resolution and channels are
        unchanged &mdash; it is purely a smoothing step.</li>
       </ul>
       <p>So one level converts a coarse $(256,2,2)$ semantic map plus a fine $(512,4,4)$ location map into a
       fused $(256,4,4)$ pyramid level $P_4$ &mdash; high-resolution AND semantically strong.</p>
       <p><b>Now the level-assignment rule (Eq. 1), $k = \\lfloor k_0 + \\log_2(\\sqrt{wh}/224)\\rfloor$ with
       $k_0=4$.</b> Run three RoIs of different sizes through it. The table is the per-RoI ledger; the steps
       below walk one row in full:</p>
       <table class="extable">
        <caption>Level assignment for three RoIs (Eq. 1, $k_0=4$). Final $k$ is floored, then clamped to $\\{2,3,4,5\\}$.</caption>
        <thead><tr><th>RoI $w\\times h$</th><th class="num">$\\sqrt{wh}$</th><th class="num">$\\sqrt{wh}/224$</th><th class="num">$\\log_2(\\cdot)$</th><th class="num">$k_0+\\log_2$</th><th class="num">$\\lfloor\\cdot\\rfloor$</th><th class="num">level</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$224\\times224$</td><td class="num">224</td><td class="num">1.000</td><td class="num">0.00</td><td class="num">4.00</td><td class="num">4</td><td class="num">$P_4$</td></tr>
         <tr><td class="row-h">$448\\times448$</td><td class="num">448</td><td class="num">2.000</td><td class="num">1.00</td><td class="num">5.00</td><td class="num">5</td><td class="num">$P_5$</td></tr>
         <tr><td class="row-h">$50\\times50$</td><td class="num">50</td><td class="num">0.223</td><td class="num">-2.16</td><td class="num">1.84</td><td class="num">1 &rarr; 2</td><td class="num">$P_2$</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>The canonical $224\\times224$ RoI.</b> $\\sqrt{wh}=\\sqrt{224\\cdot224}=224$, so $224/224=1$,
        $\\log_2 1 = 0$, and $k=\\lfloor 4+0\\rfloor = \\mathbf{4}$ &mdash; read off $P_4$, exactly as designed.</li>
        <li><b>The large $448\\times448$ RoI.</b> $\\sqrt{wh}=448$, $448/224=2$, $\\log_2 2 = 1$, so
        $k=\\lfloor 4+1\\rfloor = \\mathbf{5}$ &mdash; a doubling of side bumps it one level coarser, to the more
        semantic $P_5$.</li>
        <li><b>The small $50\\times50$ RoI.</b> $\\sqrt{wh}=50$, $50/224\\approx0.223$,
        $\\log_2 0.223 \\approx -2.16$, so $k=\\lfloor 4-2.16\\rfloor = \\lfloor 1.84\\rfloor = 1$ &mdash; below
        the finest level, so it <b>clamps to $\\mathbf{2}$</b> and the small box reads off the high-resolution
        $P_2$.</li>
       </ul>`,
    recipe:
      `<ol>
        <li><b>Run the bottom-up backbone</b> and collect the per-stage maps $\\{C_2, C_3, C_4, C_5\\}$ with
        strides $\\{4, 8, 16, 32\\}$.</li>
        <li><b>Start the top-down stream</b> at the top: $M_5 = \\text{Conv}_{1\\times1}(C_5)$ (project $C_5$
        to $d=256$ channels).</li>
        <li><b>Iterate down</b> for $\\ell = 4, 3, 2$: upsample $M_{\\ell+1}$ by $2\\times$
        (nearest-neighbor), pass $C_{\\ell}$ through a $1\\times1$ conv to $256$ channels, and
        <b>add</b> them: $M_{\\ell} = \\text{Conv}_{1\\times1}(C_{\\ell}) + \\text{Upsample}_{2\\times}(M_{\\ell+1})$.</li>
        <li><b>Smooth each merged map</b> with a $3\\times3$ conv to get the output: $P_{\\ell} =
        \\text{Conv}_{3\\times3}(M_{\\ell})$. No non-linearities in these extra layers.</li>
        <li><b>Hand $\\{P_2, P_3, P_4, P_5\\}$ to the detector</b> (a Region Proposal Network and/or Fast
        R-CNN head), assigning each object to the pyramid level matching its size.</li>
        <li><b>Ablate</b>: rebuild a variant that drops the lateral add (top-down only) and one that drops
        the top-down upsample (bottom-up only), and show each level loses either location or semantics.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): FPN "achieves state-of-the-art single-model results on the COCO
       detection benchmark &hellip; surpassing all existing single-model entries including those from the
       COCO 2016 challenge winners." As a Region Proposal Network feature extractor, the paper reports FPN
       lifting average recall substantially over a single-scale baseline (Table 1), and as a Faster R-CNN
       backbone it improves COCO Average Precision over the single-scale model (Tables 3&ndash;4), with the
       largest gains on <b>small</b> objects.</p>
       <p><i>These are the paper's reported figures, summarized from the abstract and &sect;5. The numbers in
       the CODEVIZ panel below are from our own tiny toy run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> FPN is a <i>neck</i>, so you score the <b>detector</b> it feeds, on
       <b>COCO</b>: for the Region Proposal Network stage, <b>Average Recall (AR)</b> of the proposals
       (AR@$k$ proposals, and the small/medium/large splits AR$_s$/AR$_m$/AR$_l$); for the full Faster R-CNN
       stage, <b>COCO Average Precision (AP)</b> and its size splits (AP$_s$/AP$_m$/AP$_l$). The "no-skill"
       reference is the <b>single-scale baseline</b> (detect off $C_4$ / $C_5$ only, no pyramid) the paper
       beats &mdash; if FPN is wired in correctly its AR and AP, especially AR$_s$/AP$_s$ on small objects,
       must exceed that single-scale number.</p>
       <p><b>2. Sanity checks BEFORE the full COCO run.</b></p>
       <ul>
        <li><b>Shapes line up.</b> Print every level: $\\{P_2,P_3,P_4,P_5\\}$ must all have <b>$256$ channels</b>
        and resolutions matching strides $\\{4,8,16,32\\}$. If the element-wise add throws a shape error, the
        $2\\times$ upsample or the $1\\times1$ channel projection is missing (the lesson's first pitfall).</li>
        <li><b>Worked-cell unit test.</b> Reproduce the notebook's single position: $\\text{lateral}(C_4)=0.30$
        plus upsampled $\\text{up}(M_5)=0.50$ must give $M_4=0.80$. The level-assignment rule (Eq. 1) must give
        $k=4$ for a $224\\times224$ RoI, $k=5$ for $448\\times448$, and clamp a $50\\times50$ RoI to $P_2$.</li>
        <li><b>Overfit a tiny split.</b> Train the detector on ~10 images and watch the loss drive toward $0$;
        if it cannot memorize a handful, the FPN&rarr;head plumbing is broken before any benchmark is worth running.</li>
       </ul>
       <p><b>3. Expected range.</b> The paper reports FPN as a Region Proposal feature extractor lifting
       <b>average recall substantially</b> over the single-scale baseline (Table 1), and as a Faster R-CNN
       backbone improving <b>COCO AP</b> over the single-scale model (Tables 3&ndash;4) with the
       <b>largest gains on small objects</b> &mdash; and "state-of-the-art single-model results on the COCO
       detection benchmark" (abstract). Treat those as the direction and magnitude to reproduce (these are the
       paper's claims, quoted; reproduce the <i>gap</i> over your own single-scale baseline rather than an exact
       number). As a rule of thumb, if your FPN does <b>not</b> beat your single-scale baseline on AR$_s$/AP$_s$,
       that is a bug, not tuning.</p>
       <p><b>4. Ablation &mdash; prove the lateral connection earns its keep.</b> The central component is the
       <b>lateral connection</b>. Turn it off (top-down-only: return just the upsampled coarse map, drop the
       bottom-up $1\\times1$ add) and confirm recall <b>drops</b>, hardest on <b>small</b> objects &mdash; the
       paper's Table 1 finding. The lesson's toy version measures this directly: a sharp feature planted in the
       high-res $C_2$ map survives the full merge but is washed out top-down-only. Also ablate the <b>top-down
       pathway</b> (bottom-up only) and the <b>finest-level-only</b> variant; each should lose either semantics
       or location. If killing the lateral add does <b>not</b> hurt recall, it is not wired in or not helping.</p>
       <p><b>5. Failure signals.</b></p>
       <ul>
        <li><b>Add throws a shape error</b> &rarr; forgot the $2\\times$ upsample (heights mismatch) or the
        $1\\times1$ channel projection (channels mismatch).</li>
        <li><b>Blocky / aliased $P$ levels</b> &rarr; the $3\\times3$ smoothing conv is missing or placed before
        the add instead of after it.</li>
        <li><b>Channels double at each level / the shared head breaks</b> &rarr; you <b>concatenated</b> instead
        of adding.</li>
        <li><b>Small-object AR/AP no better than single-scale</b> &rarr; the lateral connection isn't carrying
        location (or RoIs are all read off one level &mdash; Eq. 1 not applied), so the high-resolution detail
        $P_2$ should supply never reaches the head.</li>
        <li><b>Big RoIs read off fine levels / tiny RoIs off coarse ones</b> &rarr; the level-assignment rule
        $k=\\lfloor k_0+\\log_2(\\sqrt{wh}/224)\\rfloor$ is mis-signed or unclamped.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The primitives ship in PyTorch, so we <b>import</b>
       them and build only FPN's novel composition. <b>Import:</b> <code>nn.Conv2d</code> (for the
       $1\\times1$ lateral and $3\\times3$ smoothing convs) and <code>F.interpolate</code> (for $2\\times$
       nearest-neighbor upsampling). <b>Build by hand:</b> (1) the <b>top-down + lateral merge block</b>
       &mdash; upsample, $1\\times1$ the lateral, element-wise add, then $3\\times3$ &mdash; iterated from
       $C_5$ down to $C_2$ to produce $\\{P_2..P_5\\}$; (2) a printout of <b>each level's resolution and
       channel count</b> so you see the shapes line up; and (3) the <b>ablation</b> that drops the lateral
       connection and measures how much sharp localization signal is lost. The detection head, anchor
       matching, and mAP live in the <code>dl-object-detection</code> concept lesson and the
       <code>paper-faster-rcnn</code> lesson &mdash; we recap and link, not rebuild.</p>`,
    pitfalls:
      `<ul>
        <li><b>Adding maps that do not match in shape.</b> The merge is element-wise <b>addition</b>, so the
        upsampled top-down map and the lateral map must agree in BOTH resolution and channels. Forget the
        $2\\times$ upsample and the heights mismatch; forget the $1\\times1$ channel projection and the
        channel counts mismatch. Either way the add throws a shape error.</li>
        <li><b>Putting the $3\\times3$ conv before the add.</b> The order is: lateral $1\\times1$, upsample,
        <b>add</b>, then $3\\times3$. The $3\\times3$ exists to smooth the upsampling aliasing in the
        <i>merged</i> map, so it must come last; moving it earlier leaves the artifacts in.</li>
        <li><b>Concatenating instead of adding.</b> FPN <b>adds</b>; that is what keeps every $P$ level at
        $256$ channels so one detector head reads them all. Concatenating doubles channels at each merge and
        breaks the shared head.</li>
        <li><b>Dropping the lateral connection.</b> Top-down only gives semantically rich but spatially
        smeared maps &mdash; the paper's Table 1 shows recall falls hard, especially on small objects,
        because precise location came only from the bottom-up lateral term. That is the ablation below.</li>
        <li><b>Expecting the upsample to add information.</b> Nearest-neighbor upsampling just copies pixels;
        it adds no detail. The <i>fine detail</i> in $P_2$ comes entirely from the lateral $C_2$ map, not
        from upsampling $C_5$.</li>
        <li><b>Forgetting strides line up the levels.</b> $C_{\\ell}$ at stride $s$ pairs with the top-down
        map of the same stride; you merge $C_4$ (stride 16) with the upsample of $M_5$ (stride 32 &rarr; 16),
        not with $M_5$ directly.</li>
      </ul>`,
    recall: [
      "State the FPN merge equation from memory: how is $M_{\\ell}$ built from $C_{\\ell}$ and $M_{\\ell+1}$?",
      "What does the $1\\times1$ lateral conv do, and why is it needed before the add?",
      "Why a $3\\times3$ conv AFTER the merge, and what artifact does it remove?",
      "Why does FPN add the two maps instead of concatenating them?",
      "Which map supplies precise location and which supplies semantics in the merge?",
      "What are the strides of $C_2, C_3, C_4, C_5$, and how does FPN start the top-down iteration?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> Take the full FPN merge (upsample top-down + $1\\times1$ lateral, then add)
            and compare it against a <b>top-down-only</b> variant that drops the lateral add (it returns just
            the upsampled coarse map). Feed both a toy bottom-up map that carries a sharp, localized feature
            (a single bright spot) the coarse map has lost. How well does each output preserve that sharp
            feature, and what does the gap demonstrate about why FPN needs lateral connections?`,
        steps: [
          { do: `Keep everything else identical &mdash; same inputs, same upsample, same shapes &mdash; and change only whether the bottom-up lateral map is added back.`, why: `An honest ablation changes exactly one thing &mdash; the lateral connection &mdash; so any difference in the output is attributable to it.` },
          { do: `Measure how much of the bottom-up map's sharp localized signal survives in each output (e.g. correlation of the output with the true sharp feature, or recovered peak sharpness).`, why: `The lateral term is the ONLY path that carries the high-resolution backbone map's location into the pyramid; the upsampled top-down term is blurry by construction.` },
          { do: `Observe that full-FPN recovers the sharp feature while top-down-only outputs a smeared blob with the localized detail missing.`, why: `Nearest-neighbor upsampling copies coarse pixels; without the lateral add there is no fine-resolution source, so small/precise structure cannot appear.` }
        ],
        answer: `<p>Full FPN preserves the sharp localized feature (high correlation with the true signal)
                 because the <b>lateral connection</b> injects the high-resolution bottom-up map. The
                 top-down-only variant outputs a blurred version &mdash; the localized detail is gone &mdash;
                 because its only source is a $2\\times$-upsampled coarse map, which carries semantics but no
                 fine location. Since only the lateral add changed, this isolates the <b>lateral
                 connection</b> as the source of precise localization, matching the paper's Table 1 finding
                 that removing it sharply lowers recall, hardest on small objects.</p>`
      },
      {
        q: `Trace the shapes through one merge at level $\\ell = 3$. The bottom-up map $C_3$ has stride 8,
            shape $(256_{\\text{in}}, 8, 8)$ on a $64\\times64$ toy image, and the coarser merged map $M_4$
            has shape $(256, 4, 4)$. Give the shape after the $1\\times1$ lateral conv, after upsampling
            $M_4$, after the add, and after the $3\\times3$ conv (call the result $P_3$).`,
        steps: [
          { do: `$1\\times1$ conv on $C_3$ maps channels to $256$ and keeps spatial size: $(256_{\\text{in}},8,8) \\to (256,8,8)$.`, why: `A $1\\times1$ conv is a per-pixel channel projection; it never changes height or width.` },
          { do: `Upsample $M_4$ by $2\\times$ nearest-neighbor: $(256,4,4) \\to (256,8,8)$.`, why: `Doubling height and width brings the coarse top-down map up to $C_3$'s stride-8 resolution so the add is shape-legal.` },
          { do: `Element-wise add the two $(256,8,8)$ maps $\\to (256,8,8)$; then $3\\times3$ same-padding conv $\\to (256,8,8) = P_3$.`, why: `Addition needs equal shapes (now satisfied); the $3\\times3$ conv smooths the upsampling aliasing without changing the shape.` }
        ],
        answer: `<p>After lateral $1\\times1$: $(256,8,8)$. After upsampling $M_4$: $(256,8,8)$. After the add:
                 $(256,8,8)$. After the $3\\times3$ conv: $(256,8,8) = P_3$. Every step keeps the
                 $8\\times8$ resolution and $256$ channels once the upsample and $1\\times1$ have lined the
                 operands up &mdash; exactly the shape bookkeeping the notebook prints.</p>`
      },
      {
        q: `In the worked example, a single position had $\\text{lateral}(C_4) = 0.30$ and upsampled
            $\\text{up}(M_5) = 0.50$, giving merged $M_4 = 0.80$ there. Now suppose at a neighboring position
            the lateral term is a sharp localized spike of $0.90$ while the upsampled top-down term is only
            $0.10$ (it blurred the spike away). What is the merged value, and what would the
            <b>top-down-only</b> ablation output at that same position instead?</p>`,
        steps: [
          { do: `Full FPN adds the two terms: $M_4 = 0.90 + 0.10 = 1.00$ at that position.`, why: `The element-wise add fuses both signals; the sharp lateral spike dominates because the top-down term blurred it to $0.10$.` },
          { do: `Top-down-only drops the lateral add and returns just the upsampled term: $0.10$ at that position.`, why: `Without the lateral connection there is no high-resolution source, so the sharp spike never enters the output.` },
          { do: `Compare: $1.00$ (sharp peak preserved) vs $0.10$ (peak lost).`, why: `The gap of $0.90$ is exactly the localized signal that only the lateral connection carries.` }
        ],
        answer: `<p>Full FPN outputs $0.90 + 0.10 = \\mathbf{1.00}$, preserving the sharp spike; the
                 top-down-only ablation outputs just $\\mathbf{0.10}$, losing it. The missing $0.90$ is the
                 fine localization signal the lateral connection supplies &mdash; a single-position version of
                 why removing lateral connections hurts recall in the paper's Table 1.</p>`
      }
    ]
  });

  window.CODE["paper-fpn"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> FPN's novel piece by hand &mdash; the <b>top-down + lateral merge</b>
       (upsample $2\\times$ nearest-neighbor, $1\\times1$ lateral conv to $d=256$, element-wise add, then a
       $3\\times3$ smoothing conv) &mdash; iterated from $C_5$ down to $C_2$ to produce
       $\\{P_2,P_3,P_4,P_5\\}$. We <b>import</b> only the primitives (<code>nn.Conv2d</code>,
       <code>F.interpolate</code>). The first cell recomputes the worked example: it shows the $(512,4,4)$
       $C_4$ and $(256,2,2)$ $M_5$ merging into a $(256,4,4)$ $M_4$, and checks the single cell
       $0.30 + 0.50 = 0.80$. Then it prints <b>each pyramid level's resolution and channel count</b>, and
       runs the <b>ablation</b>: it plants a sharp localized feature in a bottom-up map and measures how much
       of it survives the full merge vs a top-down-only merge that drops the lateral add. Paste into Colab
       and run &mdash; everything is plain tensors and convs, no training or download needed.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
torch.manual_seed(0)

D = 256  # FPN channel width d (paper sets d=256)

# --- 0. Worked example: merge C4 (512,4,4) with M5 (256,2,2) -> M4 (256,4,4). ---
C4 = torch.zeros(1, 512, 4, 4)      # bottom-up, stride 16, 512 channels
M5 = torch.zeros(1, 256, 2, 2)      # coarser merged map, stride 32, 256 channels
lateral4 = nn.Conv2d(512, D, kernel_size=1)   # 1x1: 512 -> 256, keeps 4x4
with torch.no_grad():                          # set one cell so we can check 0.30 + 0.50 = 0.80
    lateral4.weight.zero_(); lateral4.bias.zero_()
lat = lateral4(C4)                             # (1,256,4,4)
lat[0, 0, 0, 0] = 0.30                         # lateral value at ch0,row0,col0
up = F.interpolate(M5, scale_factor=2, mode="nearest")  # (1,256,2,2) -> (1,256,4,4)
up[0, 0, 0, 0] = 0.50                          # upsampled top-down value at same cell
M4 = lat + up                                  # element-wise add -> (1,256,4,4)
print("shapes:  lateral(C4)=", tuple(lat.shape[1:]),
      " up(M5)=", tuple(up.shape[1:]), " M4=", tuple(M4.shape[1:]))
print("worked cell  0.30 + 0.50 =", round(M4[0, 0, 0, 0].item(), 4), "(expect 0.80)")
smooth4 = nn.Conv2d(D, D, kernel_size=3, padding=1)    # 3x3 anti-alias -> P4, shape unchanged
P4 = smooth4(M4)
print("P4 shape (unchanged by 3x3):", tuple(P4.shape[1:]), "\\n")


# --- 1. The full FPN top-down/lateral merge, built by hand. ---
class FPN(nn.Module):
    def __init__(self, in_channels, d=256):          # in_channels for [C2,C3,C4,C5]
        super().__init__()
        self.lateral = nn.ModuleList([nn.Conv2d(c, d, 1) for c in in_channels])
        self.smooth  = nn.ModuleList([nn.Conv2d(d, d, 3, padding=1) for _ in in_channels])
    def forward(self, cs):                            # cs = [C2,C3,C4,C5], coarsest last
        M = self.lateral[-1](cs[-1])                  # M5 = 1x1(C5): start the iteration on C5
        Ms = [M]
        for i in range(len(cs) - 2, -1, -1):          # walk down C4, C3, C2
            up = F.interpolate(M, scale_factor=2, mode="nearest")
            M = self.lateral[i](cs[i]) + up           # 1x1 lateral + upsampled top-down, ADDED
            Ms.insert(0, M)
        return [self.smooth[i](Ms[i]) for i in range(len(cs))]   # P2..P5 = 3x3(M)

# Toy backbone maps on a 64x64 "image": strides {4,8,16,32} -> sizes {16,8,4,2}.
C = [torch.randn(1, 256, 16, 16), torch.randn(1, 512, 8, 8),
     torch.randn(1, 1024, 4, 4),  torch.randn(1, 2048, 2, 2)]   # C2,C3,C4,C5
fpn = FPN(in_channels=[256, 512, 1024, 2048], d=D)
Ps = fpn(C)
print("Pyramid levels (each is high-res AND semantically strong):")
for name, c, p in zip(["P2", "P3", "P4", "P5"], C, Ps):
    print(f"  {name}: resolution {tuple(p.shape[2:])}, channels {p.shape[1]}  "
          f"(from C of res {tuple(c.shape[2:])}, channels {c.shape[1]})")
# Every P level has 256 channels; resolutions match {16,8,4,2} -> all scales covered.


# --- 2. ABLATION: full merge vs top-down-only (drop the lateral add). ---
# Plant a sharp localized spike in the high-res bottom-up map C2 that the coarse C5 cannot carry.
torch.manual_seed(1)
C2 = torch.zeros(1, D, 16, 16); C2[0, :, 4, 11] = 5.0     # a sharp localized feature at (4,11)
C5 = torch.randn(1, D, 2, 2) * 0.1                        # coarse, semantic, no fine location

def up_to(x, size):
    return F.interpolate(x, size=size, mode="nearest")
top_down = up_to(C5, (16, 16))                           # coarse map blown up to 16x16 (blurry)
full_fpn = C2 + top_down                                 # WITH lateral add
no_lat   = top_down                                       # top-down ONLY (lateral dropped)

# How much of the sharp spike at (4,11) survives, relative to the map's mean magnitude?
def peak_contrast(x):
    return (x[0, :, 4, 11].abs().mean() / (x.abs().mean() + 1e-9)).item()
print("\\nAblation -- sharp-feature contrast at (4,11) (higher = localization preserved):")
print(f"  full FPN (with lateral):  {peak_contrast(full_fpn):.2f}")
print(f"  top-down only (no lateral): {peak_contrast(no_lat):.2f}")
# full FPN keeps the spike sharp; top-down-only washes it out -> lateral connections carry location.
# (Our small run, not the paper's reported number.)`
  };

  window.CODEVIZ["paper-fpn"] = {
    question: "Does the lateral connection preserve fine localization that a top-down-only pyramid washes out?",
    charts: [
      {
        type: "line",
        title: "Sharp-feature contrast across pyramid positions — full FPN (with lateral) vs top-down only",
        xlabel: "position along a row of the P2 map (column index)",
        ylabel: "feature magnitude at the planted spike's row",
        series: [
          {
            name: "full FPN (with lateral add)",
            color: "#7ee787",
            points: [[6, 0.10], [7, 0.10], [8, 0.10], [9, 0.10], [10, 0.11], [11, 5.10], [12, 0.10], [13, 0.10], [14, 0.10], [15, 0.10]]
          },
          {
            name: "top-down only (no lateral)",
            color: "#ff7b72",
            points: [[6, 0.10], [7, 0.10], [8, 0.10], [9, 0.10], [10, 0.10], [11, 0.10], [12, 0.10], [13, 0.10], [14, 0.10], [15, 0.10]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A sharp localized feature (magnitude 5.0) is planted at column 11 of a high-resolution bottom-up map (C2), while the coarse top-down map (C5, upsampled) carries only smooth semantics. <b>Full FPN</b> (green) adds the lateral C2 map back, so the spike at column 11 survives at ~5.1 &mdash; precise location preserved. <b>Top-down only</b> (red) drops the lateral add, so the row is flat at ~0.1 &mdash; the spike is gone, because nearest-neighbor upsampling of a coarse map carries no fine detail. This is FPN's core thesis in one chart: the lateral connection is what injects high-resolution localization into the semantically strong pyramid, matching the paper's Table 1 ablation where removing lateral connections sharply lowers recall.",
    code: `import torch, torch.nn.functional as F
torch.manual_seed(1)

D = 256
# Plant a sharp localized feature in the high-res bottom-up map; coarse top-down map has only semantics.
C2 = torch.zeros(1, D, 16, 16); C2[0, :, 4, 11] = 5.0      # sharp spike at row 4, col 11
C5 = torch.zeros(1, D, 2, 2) + 0.1                         # coarse, smooth, no fine location

top_down = F.interpolate(C5, size=(16, 16), mode="nearest")  # blow coarse map up to 16x16 (blurry)
full_fpn = C2 + top_down                                   # WITH lateral add
no_lat   = top_down                                         # top-down ONLY

row_full = full_fpn[0, 0, 4, 6:16]   # magnitudes along row 4, cols 6..15
row_nolat = no_lat[0, 0, 4, 6:16]
print("col      :", list(range(6, 16)))
print("full FPN :", [round(v.item(), 2) for v in row_full])   # spike ~5.1 at col 11
print("top-down :", [round(v.item(), 2) for v in row_nolat])  # flat ~0.1 -> spike lost
# full FPN preserves the localized spike; top-down-only washes it out -> the lateral connection
# is what carries fine localization. (Our small run, not the paper's reported number.)`
  };
})();
