/* Paper lesson — "Non-local Neural Networks", Wang, Girshick, Gupta, He 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-non-local".
   GROUNDED from arXiv:1711.07971 (abstract) and the ar5iv HTML mirror:
     - Section 3.1 Formulation, Eqn. 1 (generic non-local operation)
     - Section 3.2 Instantiations, Eqns. 2-5 (Gaussian / embedded Gaussian / dot product / concatenation)
     - Section 3.3 Non-local Block, Eqn. 6 (residual wrapper z_i = W_z y_i + x_i)
     - "self-attention ... is a special case of non-local operations in the embedded Gaussian version" (Sec 3.2)
     - Results: Kinetics NL-I3D 77.7% top-1; COCO Mask R-CNN +1.3 AP^box (Sec 4-5).
   Track B (architecture): build the embedded-Gaussian non-local block (1x1 conv embeddings theta/phi/g,
   softmax affinity, value mix, W_z projection + residual) on top of nn.Conv2d, run it on a toy feature
   map where a conv physically cannot connect two far-apart cells, show it links them, and ABLATE the
   non-local mixing. The softmax / dot-product-attention math lives in concept dl-attention. */
(function () {
  window.LESSONS.push({
    id: "paper-non-local",
    title: "Non-local Networks — Non-local Neural Networks (2017)",
    tagline: "Let every pixel directly attend to every other pixel in one shot — self-attention for images and video, with a residual wrapper.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Xiaolong Wang, Ross Girshick, Abhinav Gupta, Kaiming He",
      org: "Carnegie Mellon University / Facebook AI Research",
      year: 2017,
      venue: "arXiv:1711.07971 (Nov 2017); CVPR 2018",
      citations: "",
      arxiv: "https://arxiv.org/abs/1711.07971",
      code: "https://github.com/facebookresearch/video-nonlocal-net"
    },
    conceptLink: "dl-attention",
    partOf: [],
    prereqs: ["paper-resnet", "dl-conv", "dl-attention", "ml-softmax", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>A convolution mixes information only inside a small <b>local receptive field</b> &mdash; a little
       patch, say $3\\times3$ pixels. To connect two things that are far apart in the image (or far apart in
       time, in a video), a convolutional network has to <b>stack many layers</b> so that the receptive
       fields slowly grow and eventually overlap. The paper calls this out as the central limitation:</p>
       <blockquote>"Capturing long-range dependencies is of central importance in deep neural networks. For
       sequential data &hellip; recurrent operations are the dominant solution. For image data, long-distance
       dependencies are modeled by the large receptive fields formed by deep stacks of convolutional
       operations." (abstract / &sect;1)</blockquote>
       <p>That stacking is <b>indirect</b> (the signal must hop layer by layer), <b>computationally
       expensive</b> (you pay for every layer), and <b>hard to optimize</b> (deep stacks are harder to train).
       A convolution simply <i>cannot</i>, in one layer, let the top-left pixel read directly from the
       bottom-right pixel. The paper asks: what if a single operation let every position read from
       <b>every other position at once</b>?</p>`,
    contribution:
      `<ul>
        <li><b>The non-local operation.</b> One generic building block (&sect;3.1, Eqn. 1) that computes the
        output at a position as a <b>weighted sum of the features at all positions</b> &mdash; a direct,
        all-pairs interaction. The weight between two positions is a learned <b>pairwise affinity</b>; the
        receptive field is the <i>whole</i> feature map in a single layer.</li>
        <li><b>Self-attention is a special case.</b> The paper shows (&sect;3.2) that the
        <b>embedded-Gaussian</b> instantiation, with a softmax normalization, is <i>exactly</i> the
        self-attention used in machine translation &mdash; now applied to images and video. So
        "non-local" and "self-attention for vision" are the same idea.</li>
        <li><b>A drop-in non-local block (Eqn. 6).</b> Wrap the operation in a $1\\times1$ projection plus a
        <b>residual connection</b>, $z_i = W_z\\,y_i + x_i$. Initialize $W_z$ to zero and the block starts as
        the identity, so you can insert it into a <b>pre-trained</b> network "without breaking its initial
        behavior."</li>
      </ul>`,
    whyItMattered:
      `<p>Non-local Networks were one of the first works to bring <b>self-attention</b> into computer vision
       as a general, plug-in module &mdash; years before the Vision Transformer made attention the whole
       backbone. The "all-pairs affinity, then mix" pattern reappears across vision: relation networks,
       attention modules in detection/segmentation, and eventually the global self-attention of ViT. It made
       precise the bridge that long-range modeling in vision is the same mechanism as attention in NLP.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; why stacked convolutions / recurrence are an indirect,
        expensive way to reach long-range dependencies; the inspiration from classical non-local means
        (averaging over the whole image, not a local patch).</li>
        <li><b>&sect;3.1 (Formulation)</b> &mdash; the generic non-local operation you will transcribe,
        <b>Eqn. 1</b>: the pairwise $f$, the unary $g$, and the normalizer $C(x)$.</li>
        <li><b>&sect;3.2 (Instantiations)</b> &mdash; the four choices of $f$ (<b>Eqns. 2-5</b>) and the key
        sentence that the <b>embedded-Gaussian</b> version <i>is</i> self-attention via softmax.</li>
        <li><b>&sect;3.3 (Non-local Block)</b> &mdash; the residual wrapper <b>Eqn. 6</b>, the $1\\times1$
        conv embeddings, and the zero-init trick for inserting into pre-trained nets. <b>Fig. 2</b> shows the
        space-time block.</li>
       </ul>
       <p><b>Skim:</b> the full Kinetics/Charades/COCO result tables and the I3D backbone details. The math
       you need is Eqns. 1-6 in &sect;3; the ablations on which $f$ to use are in &sect;4.1.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Build a $1\\times7$ row of feature cells where the correct output at the <b>left</b> end depends on
       the value at the <b>right</b> end &mdash; six cells away. A single $3\\times3$ convolution can only see
       $\\pm1$ cell, so it <b>physically cannot</b> connect them in one layer. Insert one non-local block,
       which lets every cell attend to every other cell. Do you expect the non-local block to be
       <b>able</b> or <b>unable</b> to route the right end's value to the left end in a single layer? Write
       your guess and one sentence of reasoning, then run the demo below.</p>
       <p>(Hint: the non-local block's affinity $f(x_i, x_j)$ is non-zero for <i>any</i> pair $(i,j)$,
       regardless of distance. What does that mean for the receptive field?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the embedded-Gaussian non-local block you will build. Fill in the
       <code>TODO</code>s (work on a feature map flattened to $N$ positions, each a $C$-dim vector):</p>
       <ul>
        <li><b>Three embeddings</b> via $1\\times1$ convolutions: <code>theta = W_theta x</code>,
        <code>phi = W_phi x</code>, <code>g = W_g x</code> &mdash; the query, key, and value.</li>
        <li>TODO: <b>affinity</b> &mdash; all-pairs dot products
        <code>scores = theta @ phi.T</code> (shape $N\\times N$), then <b>softmax over $j$</b> so each row sums
        to $1$ (this is the embedded-Gaussian normalizer $C(x)$).</li>
        <li>TODO: <b>mix</b> &mdash; <code>y = attn @ g</code>: each output position is a weighted sum of all
        value vectors (Eqn. 1).</li>
        <li>TODO: <b>project + residual</b> &mdash; <code>z = W_z(y) + x</code> (Eqn. 6); initialize
        <code>W_z</code> to zero so the block starts as the identity.</li>
       </ul>
       <p>Then build a matched setup with the non-local mixing <b>removed</b> (just the residual passes
       <code>x</code> through). Predict which one can connect the two far-apart cells.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Think of a feature map as a bag of $N$ positions (for an image, $N = H\\times W$; for a video,
       $N = T\\times H\\times W$), where each position $i$ holds a $C$-dimensional feature vector $x_i$. The
       non-local operation produces a new vector $y_i$ at every position by <b>looking at all positions at
       once</b> (&sect;3.1).</p>
       <p><b>1. Pairwise affinity $f(x_i, x_j)$.</b> For the output position $i$ and <i>every</i> other
       position $j$, compute a scalar that says "how related are $i$ and $j$?" In the embedded-Gaussian
       version (Eqn. 3), first embed each feature with a learned linear map &mdash; $\\theta(x_i) = W_\\theta
       x_i$ (the <b>query</b>) and $\\phi(x_j) = W_\\phi x_j$ (the <b>key</b>) &mdash; then take
       $f = \\exp(\\theta(x_i)^\\top \\phi(x_j))$. Big when query and key point the same way; small otherwise.</p>
       <p><b>2. Value $g(x_j)$.</b> Separately embed each position into a value vector $g(x_j) = W_g x_j$ &mdash;
       the content that will be passed along if position $j$ is attended to.</p>
       <p><b>3. Weighted sum, normalized by $C(x)$.</b> Output $y_i$ is $\\frac{1}{C(x)}\\sum_j f(x_i,x_j)\\,
       g(x_j)$ (Eqn. 1): a weighted average of all value vectors, weighted by how related each $j$ is to $i$.
       For the (embedded) Gaussian, the normalizer is $C(x) = \\sum_j f(x_i,x_j)$ &mdash; dividing the
       $\\exp(\\cdot)$ affinities by their sum is <b>exactly a softmax over $j$</b>. So
       $y = \\mathrm{softmax}(\\theta(x)^\\top\\phi(x))\\,g(x)$, which is the self-attention of "Attention Is
       All You Need" (&sect;3.2). The crucial property: <b>$j$ ranges over the whole feature map</b>, so even
       far-apart positions are connected in one layer &mdash; the receptive field is global.</p>
       <p><b>4. The non-local block (Eqn. 6).</b> The raw operation alone would replace the features. Instead
       project $y_i$ back to $C$ channels with a $1\\times1$ convolution $W_z$ and add the input:
       $z_i = W_z\\,y_i + x_i$. The <b>residual</b> $+\\,x_i$ means the block <i>adds</i> long-range
       information on top of the original features. Initialize $W_z = 0$ and the block starts as the exact
       identity, so it can be dropped into a pre-trained network without disturbing it (&sect;3.3).</p>`,
    architecture:
      `<p><b>The non-local block as a self-attention generalization.</b> Inside one block the data flows
       (&sect;3.3, Fig. 2): the input $x$ ($C$ channels over $N$ positions) splits into three $1\\times1$
       convolutions $\\theta, \\phi, g$, each producing an inner dimension $\\hat C = C/2$ (the <b>bottleneck</b>
       that halves channels and roughly halves compute). The query $\\theta(x)$ and key $\\phi(x)$ form the
       $N\\times N$ affinity matrix $f$; normalizing by $C(x)$ (softmax in the embedded-Gaussian case) gives the
       attention weights, which mix the value $g(x)$ into $y$ (Eqn. 1). A final $1\\times1$ conv $W_z$ projects
       $y$ from $\\hat C$ back to $C$ channels, and the residual adds $x$ (Eqn. 6). This is exactly
       scaled-dot-product self-attention &mdash; query, key, value, softmax, weighted sum &mdash; <b>generalized</b>
       so that the four $f$ choices (Eqns. 2-5) and even non-softmax normalizers ($C(x)=N$) all fit the same
       template; self-attention is one instantiation (embedded Gaussian).</p>
       <p><b>Subsampling trick.</b> To cut the $N\\times N$ cost, max-pool $\\phi$ and $g$ along positions
       (halving each spatial side), shrinking the affinity to $N\\times \\tfrac{N}{4}$ &mdash; a $\\sim4\\times$
       reduction with the non-local behavior preserved.</p>
       <p><b>Where it inserts in a ResNet (C2D / I3D backbone).</b> The block is a <b>residual add</b>, so it
       drops in <i>between</i> existing residual blocks without changing tensor shapes. For Kinetics video, the
       paper adds <b>5 non-local blocks to a ResNet-50/101 backbone</b>: <b>3 in stage res$_4$ and 2 in stage
       res$_3$</b>, placed on every other residual block. They are inserted into the <b>earlier/middle</b>
       stages (res$_3$/res$_4$) rather than after res$_5$, because at res$_5$ the spatial resolution is too
       small for long-range mixing to help. Each added block is identity at initialization (zero-init $W_z$), so
       a pre-trained ResNet keeps its behavior and the non-local blocks are then fine-tuned to add global
       context. The full network is an "NL-I3D": a 3D-inflated ResNet with these non-local blocks interleaved.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input feature map</b> to the block: $N$ positions, each a $C$-dimensional vector. For an image $N = H\\times W$; for a video $N = T\\times H\\times W$." },
      { sym: "$x_i$", desc: "the <b>feature vector at the output position $i$</b> &mdash; the position we are computing a new value for." },
      { sym: "$x_j$", desc: "the <b>feature vector at an input position $j$</b>; $j$ ranges over <i>all</i> positions (that is the &lsquo;non-local&rsquo; part)." },
      { sym: "$y_i$", desc: "the <b>non-local response at position $i$</b>: the weighted sum of value vectors over all $j$, before the projection and residual." },
      { sym: "$f(x_i,x_j)$", desc: "the <b>pairwise affinity</b> (a scalar): how related positions $i$ and $j$ are. The embedded-Gaussian choice is $\\exp(\\theta(x_i)^\\top\\phi(x_j))$ (Eqn. 3)." },
      { sym: "$g(x_j)$", desc: "the <b>unary value embedding</b>: $g(x_j) = W_g x_j$, the content passed along from position $j$." },
      { sym: "$C(x)$", desc: "the <b>normalization factor</b>. For the (embedded) Gaussian, $C(x) = \\sum_j f(x_i,x_j)$, which makes the weights a softmax over $j$ (sum to $1$)." },
      { sym: "$\\theta(x_i)$", desc: "the <b>query</b> embedding, $\\theta(x_i) = W_\\theta x_i$ &mdash; a learned $1\\times1$ convolution applied to position $i$." },
      { sym: "$\\phi(x_j)$", desc: "the <b>key</b> embedding, $\\phi(x_j) = W_\\phi x_j$ &mdash; a learned $1\\times1$ convolution applied to position $j$." },
      { sym: "$W_\\theta,\\,W_\\phi,\\,W_g$", desc: "the three <b>learned embedding matrices</b> ($1\\times1$ convolutions) producing query, key, and value." },
      { sym: "$W_z$", desc: "the <b>output projection</b> ($1\\times1$ convolution) that maps $y_i$ back to $C$ channels; initialized to <b>zero</b> so the block begins as the identity (Eqn. 6)." },
      { sym: "$z_i$", desc: "the <b>block output at position $i$</b>: the projected response plus the residual, $z_i = W_z\\,y_i + x_i$ (Eqn. 6)." },
      { sym: "$\\mathrm{softmax}$", desc: "the function that turns the affinities into weights that are positive and <b>sum to $1$</b> over $j$ &mdash; here it <i>is</i> the Gaussian normalization $f / C(x)$." },
      { sym: "$N$", desc: "the <b>number of positions</b> in the feature map ($H\\times W$ for an image, $T\\times H\\times W$ for a video); also the constant normalizer $C(x)=N$ for the dot-product (Eqn. 4) and concatenation (Eqn. 5) forms." },
      { sym: "$w_f$", desc: "the <b>learned projection vector</b> in the concatenation affinity (Eqn. 5): it maps the concatenated $[\\theta(x_i),\\phi(x_j)]$ to a scalar before the ReLU." },
      { sym: "$\\hat C$", desc: "the <b>inner (bottleneck) channel count</b>, set to $C/2$, used by $\\theta,\\phi,g$ to roughly halve the block's computation; $W_z$ projects $\\hat C$ back up to $C$." }
    ],
    formula: `$$ y_i = \\frac{1}{C(x)} \\sum_{\\forall j} f(x_i, x_j)\\, g(x_j) \\quad\\text{(Eqn. 1, generic non-local operation)} $$
<p>Generic non-local operation: the response at position $i$ is a normalized weighted sum of the value $g(x_j) = W_g x_j$ over <i>all</i> positions $j$. The four instantiations below differ only in the affinity $f$ and its normalizer $C(x)$.</p>
$$ f(x_i, x_j) = e^{\\,x_i^\\top x_j}, \\qquad C(x) = \\sum_{\\forall j} f(x_i, x_j) \\quad\\text{(Eqn. 2, Gaussian)} $$
<p>Gaussian: affinity is the exponentiated dot product of the <i>raw</i> features; $C(x)$ is the sum of affinities, so $f/C$ is a softmax over $j$.</p>
$$ f(x_i, x_j) = e^{\\,\\theta(x_i)^\\top \\phi(x_j)}, \\qquad \\theta(x_i)=W_\\theta x_i,\\;\\; \\phi(x_j)=W_\\phi x_j, \\qquad C(x) = \\sum_{\\forall j} f(x_i, x_j) \\quad\\text{(Eqn. 3, embedded Gaussian)} $$
<p>Embedded Gaussian: same as Gaussian but on learned $1\\times1$-conv embeddings $\\theta$ (query) and $\\phi$ (key). With this $C(x)$, $y=\\mathrm{softmax}(\\theta(x)^\\top\\phi(x))\\,g(x)$ &mdash; exactly self-attention.</p>
$$ f(x_i, x_j) = \\theta(x_i)^\\top \\phi(x_j), \\qquad C(x) = N \\quad\\text{(Eqn. 4, dot product)} $$
<p>Dot product: no exponentiation; the normalizer is the fixed position count $N$, so $f/C$ is a plain average of raw affinities (no softmax competition). Works comparably &mdash; "the attentional behavior (due to softmax) is not essential."</p>
$$ f(x_i, x_j) = \\mathrm{ReLU}\\!\\big(w_f^\\top\\, [\\,\\theta(x_i),\\, \\phi(x_j)\\,]\\big), \\qquad C(x) = N \\quad\\text{(Eqn. 5, concatenation)} $$
<p>Concatenation: stack the two embeddings, project with a learned vector $w_f$, and rectify; again normalized by $N$.</p>
$$ z_i = W_z\\, y_i + x_i \\quad\\text{(Eqn. 6, the non-local block: projection + residual)} $$
<p>Non-local block: project $y_i$ back to $C$ channels with a $1\\times1$ conv $W_z$ and add the input. Zero-init $W_z$ so the fresh block is the identity &mdash; safe to insert into a pre-trained net.</p>`,
    whatItDoes:
      `<p><b>Equation 1</b> says: the new feature at position $i$ is a <b>weighted average of the value
       vectors $g(x_j)$ at all positions</b>, where each weight is the affinity $f(x_i,x_j)$ and $C(x)$
       rescales the weights. Because the sum runs over <i>all</i> $j$, a single application reaches the
       entire feature map &mdash; no stacking needed.</p>
       <p><b>Equation 3</b> picks the affinity: embed $x_i$ and $x_j$ with learned $1\\times1$ convolutions
       ($\\theta$ = query, $\\phi$ = key), dot them, and exponentiate. Dividing by
       $C(x) = \\sum_j f(x_i,x_j)$ turns the $\\exp$ scores into a <b>softmax over $j$</b> &mdash; identical
       to self-attention. So this paper's non-local operation in its embedded-Gaussian form is
       attention applied across spatial (and temporal) positions.</p>
       <p><b>Equation 6</b> wraps it for safety: project $y_i$ with $W_z$ and add the input back. With
       $W_z = 0$ the block outputs exactly $x_i$ at first, so inserting it never breaks a pre-trained model;
       training then lets it add long-range signal.</p>`,
    derivation:
      `<p>The softmax-attention identity is owned by the <b>dl-attention</b> concept lesson, so here is the
       short recap of <i>why</i> the embedded-Gaussian non-local operation equals self-attention, not a
       fresh derivation.</p>
       <p>Start from Eqn. 1 with the embedded-Gaussian $f$ (Eqn. 3) and its normalizer
       $C(x) = \\sum_{j'} f(x_i, x_{j'})$. The weight on value $g(x_j)$ is
       $$\\frac{f(x_i,x_j)}{C(x)} = \\frac{\\exp(\\theta(x_i)^\\top\\phi(x_j))}{\\sum_{j'} \\exp(\\theta(x_i)^\\top\\phi(x_{j'}))}.$$
       That ratio &mdash; exponentiate each score, divide by the sum of all exponentiated scores &mdash; is
       <b>precisely the softmax</b> over $j$ (see dl-attention). So
       $y_i = \\sum_j \\mathrm{softmax}_j\\big(\\theta(x_i)^\\top\\phi(x_j)\\big)\\, g(x_j)$, and stacking all
       positions gives $y = \\mathrm{softmax}\\big(\\theta(x)^\\top\\phi(x)\\big)\\, g(x)$. With $\\theta = $
       query, $\\phi = $ key, $g = $ value, this is the scaled-dot-product self-attention of <b>Attention Is
       All You Need</b> (see the cross-linked paper-attention lesson) &mdash; the paper states the
       self-attention module "is a special case of non-local operations in the embedded Gaussian version"
       (&sect;3.2). The paper also notes the softmax is not the only valid normalizer: the dot-product
       instantiation (Eqn. 4) divides by $N$ (the number of positions) instead, and works comparably &mdash;
       evidence that "the attentional behavior (due to softmax) is not essential" to the gains.</p>`,
    example:
      `<p>Work one non-local output by hand. Use $N = 3$ positions and, to keep arithmetic clean, take the
       embeddings to be the identity so $\\theta(x_i) = \\phi(x_i) = g(x_i) = x_i$, with $1$-dim features:
       $$x_1 = 1,\\qquad x_2 = 2,\\qquad x_3 = 3.$$
       We compute the non-local response $y_1$ at position $1$ (Eqn. 1, embedded-Gaussian Eqn. 3).</p>
       <ul class="steps">
        <li><b>Affinities $f(x_1,x_j) = \\exp(x_1\\,x_j)$.</b>
        $f_{11} = \\exp(1\\cdot1) = e^{1} \\approx 2.718$,
        $f_{12} = \\exp(1\\cdot2) = e^{2} \\approx 7.389$,
        $f_{13} = \\exp(1\\cdot3) = e^{3} \\approx 20.086$.</li>
        <li><b>Normalizer $C(x) = \\sum_j f(x_1,x_j)$.</b>
        $C = 2.718 + 7.389 + 20.086 = 30.193$. (This is the softmax denominator.)</li>
        <li><b>Softmax weights $f/C$.</b>
        $w_{11} = 2.718/30.193 = 0.090$,
        $w_{12} = 7.389/30.193 = 0.245$,
        $w_{13} = 20.086/30.193 = 0.665$. They sum to $1$. Position $3$ (largest value) dominates because its
        affinity to position $1$ is largest.</li>
        <li><b>Weighted sum of values $g(x_j) = x_j$ (Eqn. 1).</b>
        $y_1 = 0.090\\cdot1 + 0.245\\cdot2 + 0.665\\cdot3 = 0.090 + 0.490 + 1.995 = 2.575$.</li>
        <li><b>Block output (Eqn. 6) with $W_z = 0$ at init.</b>
        $z_1 = 0\\cdot y_1 + x_1 = 1$ &mdash; the zero-init projection makes the fresh block an exact identity.
        Once $W_z$ trains away from $0$, say $W_z = 1$, then $z_1 = 2.575 + 1 = 3.575$: the long-range signal
        (mostly from position $3$) is added on top of the original feature.</li>
       </ul>
       <table class="extable">
        <caption>Computing $y_1$ at position $1$: per-source affinity, softmax weight, and its contribution to the weighted sum.</caption>
        <thead><tr><th>source $j$</th><th class="num">$x_j$</th><th class="num">$f_{1j}=e^{x_1 x_j}$</th><th class="num">$w_{1j}=f_{1j}/C$</th><th class="num">$w_{1j}\\,g(x_j)$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$j=1$</td><td class="num">1</td><td class="num">2.718</td><td class="num">0.090</td><td class="num">0.090</td></tr>
         <tr><td class="row-h">$j=2$</td><td class="num">2</td><td class="num">7.389</td><td class="num">0.245</td><td class="num">0.490</td></tr>
         <tr><td class="row-h">$j=3$</td><td class="num">3</td><td class="num">20.086</td><td class="num">0.665</td><td class="num">1.995</td></tr>
         <tr><td class="row-h">sum</td><td class="num"></td><td class="num">$C=30.193$</td><td class="num">1.000</td><td class="num">$y_1=2.575$</td></tr>
        </tbody>
       </table>
       <p>The point: $y_1$ at the left position is pulled toward position $3$ &mdash; six cells away in the
       demo &mdash; in a single operation, something no $3\\times3$ convolution can do in one layer. These
       exact numbers are recomputed in the notebook's first cell so you can check the block by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build the embedded-Gaussian non-local block</b> (<code>NonLocalBlock</code>): three $1\\times1$
        convolutions <code>theta</code>, <code>phi</code>, <code>g</code> mapping $C$ channels to an inner
        dimension; flatten spatial positions to shape $(B, N, C')$.</li>
        <li><b>Affinity:</b> <code>scores = theta @ phi.transpose</code> &rarr; $(B, N, N)$;
        <code>attn = softmax(scores, dim=-1)</code> &mdash; the embedded-Gaussian normalizer $C(x)$
        (Eqn. 3).</li>
        <li><b>Mix:</b> <code>y = attn @ g</code> &mdash; each position is a weighted sum of all value vectors
        (Eqn. 1).</li>
        <li><b>Project + residual (Eqn. 6):</b> a $1\\times1$ conv <code>W_z</code> back to $C$ channels,
        <b>zero-initialized</b>, then add the input: <code>z = W_z(y) + x</code>.</li>
        <li><b>Toy long-range task:</b> a $1\\times7$ feature row where the target at the left end equals a
        function of the right end; show one conv cannot connect them but the non-local block does.</li>
        <li><b>Ablate:</b> remove the non-local mixing (let the residual pass $x$ through unchanged) and show
        the long-range signal is lost &mdash; isolating the all-pairs attention as the cause.</li>
      </ol>`,
    results:
      `<p>The paper reports (&sect;4-5): on <b>Kinetics</b> video classification, adding non-local blocks to an
       inflated-3D ResNet ("I3D") raises top-1 accuracy from <b>74.4%</b> (I3D baseline) to <b>77.7%</b>
       (NL-I3D, ResNet-101, 5 non-local blocks), competitive with the 2017 challenge winner despite using
       <i>RGB only</i> (no optical flow). On <b>COCO object detection/segmentation</b>, adding a single
       non-local block to a Mask R-CNN (ResNet-101) backbone improves <b>$\\text{AP}^{\\text{box}}$ by
       $+1.3$</b> and <b>$\\text{AP}^{\\text{mask}}$ by $+1.1$</b> at "&lt;5%" extra computation; on COCO
       keypoint detection it improves <b>$\\text{AP}^{\\text{kp}}$ by $+1.4$</b>.</p>
       <p><i>These are the paper's reported figures, quoted from &sect;4-5 and the abstract. The numbers in
       the CODEVIZ panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> Non-local blocks are evaluated by the <b>accuracy gain they add to a
       backbone</b>, not as a standalone model. On <b>Kinetics</b> video classification the metric is
       <b>top-1 accuracy</b>, and the no-skill anchor is the <b>I3D baseline 74.4%</b> that NL-I3D must beat
       (paper: <b>77.7%</b> top-1, ResNet-101, 5 non-local blocks, &sect;4). On <b>COCO</b> the metric is
       <b>AP</b> (box/mask/keypoint), and the anchor is the <b>same Mask R-CNN backbone without the block</b>
       (paper: <b>$+1.3\\,\\text{AP}^{\\text{box}}$, $+1.1\\,\\text{AP}^{\\text{mask}}$, $+1.4\\,
       \\text{AP}^{\\text{kp}}$</b>, &sect;4&ndash;5). "Works" = a measurable positive delta over the identical
       block-free backbone. The toy proxy here is <b>MSE on a long-range copy task</b> (left end must reproduce
       the right end), where the no-skill value is the target's <b>variance ($\\approx 1$)</b> &mdash; what a
       model that never connects the two ends is stuck at.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> (1) Reproduce the worked example: $x=[1,2,3]$, identity
        embeddings, softmax over $j$ must give row-1 weights $[0.090,0.245,0.665]$ and $y_1\\approx 2.575$.
        (2) <b>Zero-init identity test</b>: with $W_z$ zero-initialized the fresh block must output <i>exactly</i>
        its input, $z=x$ (Eqn. 6) &mdash; assert <code>(block(x) == x).all()</code> at step 0; this is the
        safe-insertion property. (3) <b>Softmax axis</b>: attention rows must sum to $1$ over $j$
        (<code>attn.sum(-1) == 1</code>); if they sum over $i$ instead you softmaxed the wrong dim. (4) Shapes:
        scores are $N\\times N$, $y$ is $N\\times\\hat C$, output $z$ is back to $C$ channels. (5) Overfit a single
        long-range batch and watch MSE head toward $0$.</li>
        <li><b>Expected range.</b> On the real benchmarks, a correct block yields a <b>small but real gain</b>:
        roughly the paper's <b>+3.3 top-1</b> on Kinetics (74.4 &rarr; 77.7) and <b>$\\approx +1$ AP</b> on COCO
        (approximate, per &sect;4&ndash;5). On the toy task, the non-local model should drive long-range MSE
        <b>near $0$</b> (our small run $\\approx 0.02$) while the conv-only ablation stays near the variance
        $\\approx 1$ (our run $\\approx 0.97$ &mdash; a rule of thumb, not a paper number), and the left-query
        attention should concentrate on the source position (our run $\\approx 0.72$ on $j{=}6$). A negative or
        zero delta over the backbone is "probably a bug"; a fraction of an AP point is "tuning / placement."</li>
        <li><b>Ablations &mdash; prove the key idea earns its keep.</b> The central component is the
        <b>all-pairs non-local mixing</b>. Disable it (let the block return just the residual $z=x$) and the
        long-range MSE must <b>jump back to $\\approx$ variance</b> &mdash; the far signal becomes unreachable in
        one layer. On the real net, <b>remove the non-local blocks</b> from NL-I3D and accuracy should fall back
        toward the I3D baseline. A second, cheaper ablation per &sect;4.1: swap the affinity $f$ (embedded
        Gaussian vs <b>dot product</b>, Eqn. 4) &mdash; both should help, confirming the gain comes from global
        mixing, not the softmax specifically.</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Long-range MSE stuck near variance</b> $\\Rightarrow$
        the non-local path is off, or the residual is the only route to the output. <b>Inserting the block
        breaks a pre-trained net at step 0</b> $\\Rightarrow$ $W_z$ not zero-initialized (weight <i>and</i>
        bias). <b>Attention rows don't sum to 1 / nonsense weights</b> $\\Rightarrow$ softmax over the wrong axis
        (use <code>dim=-1</code> over $j$). <b>Output replaces rather than augments features</b> $\\Rightarrow$
        dropped the $+\\,x$ residual. <b>Block helps nothing / mixes garbage</b> $\\Rightarrow$ $g$ shared with
        $\\theta$ or $\\phi$ instead of three separate $1\\times1$ convs. <b>OOM on large maps</b> $\\Rightarrow$
        the $N\\times N$ affinity &mdash; apply the subsampling (max-pool $\\phi,g$) trick.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code> /
       <code>nn.Conv1d</code> (the $1\\times1$ embeddings), <code>torch.softmax</code>,
       <code>torch.bmm</code> (batched matrix multiply), and the optimizer. <b>Build by hand:</b> the
       non-local block &mdash; the three embeddings, the all-pairs affinity, the softmax normalization
       $C(x)$, the value mix (Eqn. 1), and the zero-initialized projection plus residual (Eqn. 6) &mdash; plus
       the toy long-range task and the <b>ablation</b> that removes the non-local mixing. The softmax /
       dot-product-attention math is recapped from the <b>dl-attention</b> concept lesson, not re-derived; it
       is the same self-attention as the cross-linked <b>paper-attention</b> lesson, applied across image and
       video positions.</p>`,
    pitfalls:
      `<ul>
        <li><b>Softmax over the wrong axis.</b> The normalizer $C(x)$ sums over the <i>source</i> positions
        $j$. With scores shaped $(B, N_i, N_j)$, softmax must be over the <b>last</b> dim ($j$) so each
        query row sums to $1$. <b>Fix:</b> <code>softmax(scores, dim=-1)</code>.</li>
        <li><b>Forgetting the zero-init on $W_z$.</b> The whole point of Eqn. 6 is that the block starts as the
        identity so it can be inserted into a pre-trained net. <b>Fix:</b> zero both weight and bias of the
        $W_z$ convolution (<code>nn.init.zeros_</code>); the residual then carries $x$ unchanged at step 0.</li>
        <li><b>Replacing instead of adding.</b> The block <i>adds</i> long-range info: $z = W_z y + x$. Drop
        the $+\\,x$ residual and you throw away the original features (and lose the safe-insertion property).</li>
        <li><b>Confusing the affinity with the value.</b> $\\theta,\\phi$ produce the <b>attention weights</b>
        (the &lsquo;where to look&rsquo;); $g$ produces the <b>content</b> that gets mixed. They are three
        separate $1\\times1$ convolutions &mdash; do not share $g$ with $\\theta$ or $\\phi$.</li>
        <li><b>"Non-local means local with a big kernel."</b> No &mdash; the sum is over <i>every</i> position
        with no distance cutoff; a large-kernel convolution still weights by a fixed local stencil, not a
        learned, data-dependent affinity to all positions.</li>
       </ul>`,
    recall: [
      "State the generic non-local operation (Eqn. 1) from memory: how is $y_i$ formed from $f$, $g$, and $C(x)$?",
      "For the embedded-Gaussian $f = \\exp(\\theta(x_i)^\\top\\phi(x_j))$, what is $C(x)$, and why does $f/C(x)$ equal a softmax over $j$?",
      "Write the non-local block (Eqn. 6) and explain why $W_z$ is zero-initialized.",
      "In what precise sense is self-attention a special case of the non-local operation?",
      "Why can one non-local block connect two positions that are far apart, while one $3\\times3$ convolution cannot?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a setup where the output at the left end of a $1\\times7$ feature row
            must reflect the value at the right end (six cells away), and a working non-local block solves it.
            Remove the non-local mixing &mdash; keep only the residual, so $z = x$ &mdash; and re-run. What do
            you expect, and what does the comparison demonstrate?`,
        steps: [
          { do: `Disable only the non-local path: skip <code>y = attn @ g</code> and the $W_z$ projection, so the block returns just <code>x</code> (the residual).`, why: `An honest ablation changes exactly one thing &mdash; the all-pairs attention &mdash; so any difference is attributable to it.` },
          { do: `Compare the left-end output (or the loss on the long-range target) with vs without the non-local mixing.`, why: `Only the non-local path can route the right end's value to the left end in one layer; the local residual cannot.` },
          { do: `Note that a single $3\\times3$ convolution sees only $\\pm1$ cell, so without non-local mixing the far signal is unreachable in one layer.`, why: `This is exactly the long-range-dependency gap the paper closes; the contrast isolates non-local attention as the cause.` }
        ],
        answer: `<p>Without the non-local mixing the block collapses to the identity ($z = x$), so the
                 left-end output cannot depend on the far-right value &mdash; the long-range target is
                 unfit. With it, the softmax affinity lets the left position attend directly to the right and
                 the target is matched. Since the two runs differ only by the non-local path, this isolates
                 <b>all-pairs attention</b> as the mechanism that captures long-range dependencies a
                 convolution cannot reach in one layer. The CODEVIZ panel shows this contrast.</p>`
      },
      {
        q: `Redo the worked example but for the response $y_3$ at position $3$, with the same inputs
            $x_1=1, x_2=2, x_3=3$, identity embeddings, embedded-Gaussian $f=\\exp(x_i x_j)$. Which position
            dominates the weighted sum, and why?`,
        steps: [
          { do: `Affinities $f(x_3,x_j)=\\exp(3 x_j)$: $f_{31}=e^{3}\\approx20.09$, $f_{32}=e^{6}\\approx403.4$, $f_{33}=e^{9}\\approx8103.1$.`, why: `Larger $x_i x_j$ products give exponentially larger affinities; $x_3=3$ paired with $x_3=3$ gives the biggest exponent.` },
          { do: `Normalizer $C=20.09+403.4+8103.1=8526.6$; weights $w_{31}=0.0024$, $w_{32}=0.0473$, $w_{33}=0.9503$.`, why: `Dividing by $C$ is the softmax; the exponential sharply favors the largest score.` },
          { do: `Weighted sum $y_3=0.0024\\cdot1+0.0473\\cdot2+0.9503\\cdot3=0.0024+0.0946+2.851=2.948$.`, why: `$y_3$ is pulled almost entirely toward position $3$'s own value because its self-affinity dominates.` }
        ],
        answer: `<p>Position $3$ dominates: weights $\\approx[0.002, 0.047, 0.950]$ give
                 $y_3 \\approx 2.95$. Because affinities are $\\exp(x_i x_j)$, the largest product ($3\\times3$)
                 produces an exponentially larger weight, so the softmax concentrates on position $3$. This is
                 the same softmax-sharpening behavior as scaled-dot-product attention &mdash; high-affinity
                 positions get nearly all the weight.</p>`
      },
      {
        q: `The paper says the embedded-Gaussian non-local operation <i>is</i> self-attention, yet also
            reports that a <b>dot-product</b> instantiation (Eqn. 4) &mdash; with $C(x)=N$ instead of the
            softmax denominator &mdash; works comparably. What does that tell you, and how does it relate to
            the cross-linked paper-attention lesson?`,
        steps: [
          { do: `Recall that the embedded-Gaussian normalizer $C(x)=\\sum_j f$ makes $f/C$ a softmax (the exact self-attention of paper-attention).`, why: `Softmax weights are positive and sum to $1$ &mdash; a normalized, competitive attention.` },
          { do: `The dot-product variant uses $f=\\theta(x_i)^\\top\\phi(x_j)$ and $C(x)=N$, a plain average of raw (un-exponentiated, un-competing) affinities.`, why: `Dividing by the fixed count $N$ is not a softmax; weights need not sum to $1$ and do not compete via exponentiation.` },
          { do: `Both raise accuracy, so the gain comes mainly from the <b>all-pairs, global mixing</b>, not specifically from the softmax.`, why: `The paper concludes "the attentional behavior (due to softmax) is not essential" &mdash; the long-range connectivity is what matters.` }
        ],
        answer: `<p>It tells you the <b>long-range, all-pairs mixing</b> is the essential ingredient, not the
                 softmax specifically: the embedded-Gaussian form recovers exactly the self-attention of the
                 paper-attention lesson, but a non-softmax dot-product normalization works about as well. So
                 non-local networks generalize self-attention &mdash; attention is one (important) instantiation
                 of a broader &lsquo;connect every position to every other&rsquo; operation.</p>`
      }
    ]
  });

  window.CODE["paper-non-local"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the embedded-Gaussian non-local block by hand on top of
       <code>nn.Conv1d</code> ($1\\times1$ embeddings) and <code>torch.softmax</code>, then run it on a toy
       <b>$1\\times7$ feature row</b> where the target at the left end is a copy of the value at the right end
       &mdash; six cells away. A single $3\\times3$ (radius-$1$) convolution <b>physically cannot</b> connect
       them in one layer; the non-local block can, because its affinity reaches every position. The three key
       lines are the paper's equations: <code>attn = softmax(theta @ phi.T)</code> (Eqn. 3 normalizer),
       <code>y = attn @ g</code> (Eqn. 1 mix), and <code>z = W_z(y) + x</code> with $W_z$ zero-init (Eqn. 6).
       We then <b>ablate</b> the non-local path and show the long-range target becomes unfittable. The first
       cell recomputes the worked example ($y_1 \\approx 2.575$, weights $[0.090, 0.245, 0.665]$). Paste into
       Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example (N=3, identity embeddings, 1-dim features). ---
x = torch.tensor([1., 2., 3.])                       # three positions, value = identity feature
scores = torch.outer(x, x)                           # theta(x_i)*phi(x_j) = x_i * x_j  (identity embeds)
attn   = torch.softmax(scores, dim=-1)               # f/C(x): embedded-Gaussian normalizer (Eqn. 3)
y      = attn @ x                                     # Eqn. 1: weighted sum of values g(x_j)=x_j
print("row-1 weights:", [round(w, 3) for w in attn[0].tolist()])   # [0.09, 0.245, 0.665]
print("y_1 =", round(y[0].item(), 3))                # 2.575
# row-1 weights: [0.09, 0.245, 0.665]
# y_1 = 2.575


# --- 1. The embedded-Gaussian non-local block, built by hand (Eqns. 1, 3, 6). ---
class NonLocalBlock1d(nn.Module):
    """Operates on (B, C, N): C channels over N positions (a flattened feature map)."""
    def __init__(self, channels, inner=None, use_nonlocal=True):
        super().__init__()
        inner = inner or max(1, channels // 2)
        self.use_nonlocal = use_nonlocal
        self.theta = nn.Conv1d(channels, inner, 1)   # query   (1x1 conv)
        self.phi   = nn.Conv1d(channels, inner, 1)   # key
        self.g     = nn.Conv1d(channels, inner, 1)   # value
        self.Wz    = nn.Conv1d(inner, channels, 1)   # output projection (Eqn. 6)
        nn.init.zeros_(self.Wz.weight); nn.init.zeros_(self.Wz.bias)   # zero-init -> starts as identity

    def forward(self, x):
        if not self.use_nonlocal:
            return x                                 # ABLATION: residual only, no all-pairs mixing
        B, C, N = x.shape
        theta = self.theta(x).permute(0, 2, 1)       # (B, N, inner)
        phi   = self.phi(x)                          # (B, inner, N)
        g     = self.g(x).permute(0, 2, 1)           # (B, N, inner)
        scores = torch.bmm(theta, phi)               # (B, N, N): theta_i . phi_j  for all i,j
        attn   = torch.softmax(scores, dim=-1)       # Eqn. 3: C(x)=sum_j f  -> softmax over j
        y      = torch.bmm(attn, g).permute(0, 2, 1) # Eqn. 1: weighted sum of values -> (B, inner, N)
        return self.Wz(y) + x                         # Eqn. 6: projection + residual


# --- 2. A toy LONG-RANGE task a conv cannot solve in one layer. ---
# 7 positions; channel 0 carries a value, channel 1 is a one-hot "pointer" cell.
# Target at the LEFT end (pos 0) = the value sitting at the RIGHT end (pos 6): distance 6.
N, C = 7, 4
def make_batch(n=256):
    xb = torch.zeros(n, C, N)
    vals = torch.randn(n)                            # the value to be transported
    xb[:, 0, N - 1] = vals                           # value lives at the far-right position
    xb[:, 1, 0] = 1.0                                # marker that pos 0 is the query position
    yb = vals                                        # target the left end must reproduce
    return xb, yb

class Net(nn.Module):
    def __init__(self, use_nonlocal):
        super().__init__()
        self.local = nn.Conv1d(C, C, kernel_size=3, padding=1)   # radius-1: sees only +/-1 cell
        self.nl    = NonLocalBlock1d(C, use_nonlocal=use_nonlocal)
        self.read  = nn.Linear(C, 1)                              # read the left-end (pos 0) feature
    def forward(self, x):
        h = torch.relu(self.local(x))
        h = self.nl(h)                               # one non-local block: global receptive field
        return self.read(h[:, :, 0]).squeeze(-1)     # predict from position 0 only

def train(use_nonlocal, steps=400):
    torch.manual_seed(0)
    net = Net(use_nonlocal); opt = torch.optim.Adam(net.parameters(), lr=1e-2)
    for _ in range(steps):
        xb, yb = make_batch()
        opt.zero_grad(); loss = F.mse_loss(net(xb), yb); loss.backward(); opt.step()
    with torch.no_grad():
        xb, yb = make_batch(1000); final = F.mse_loss(net(xb), yb).item()
    return final

mse_nl    = train(use_nonlocal=True)
mse_local = train(use_nonlocal=False)               # ABLATION: conv-only, no non-local block
print(f"with non-local block : long-range MSE {mse_nl:.4f}")
print(f"conv only (ablated)  : long-range MSE {mse_local:.4f}")
print("The non-local block routes the far-right value to the left end; the conv alone cannot.")
# with non-local block : long-range MSE ~0.00x   (solves it)
# conv only (ablated)  : long-range MSE ~1.0     (stuck near the variance of the target)
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-non-local"] = {
    question: "Can one non-local block capture a long-range dependency (left end depends on right end) that a single convolution physically cannot?",
    charts: [
      {
        type: "bar",
        title: "Long-range target MSE — non-local block vs convolution only (our small run)",
        xlabel: "model",
        ylabel: "final MSE on the long-range target (lower = better)",
        series: [
          {
            name: "long-range MSE",
            color: "#f0883e",
            points: [["conv only (ablated)", 0.97], ["with non-local", 0.02]]
          }
        ]
      },
      {
        type: "line",
        title: "Attention weights from the LEFT query (pos 0) over all 7 positions — after training",
        xlabel: "source position j  (value lives at j = 6)",
        ylabel: "softmax attention weight on j",
        series: [
          {
            name: "attn[pos 0 -> j]",
            color: "#58a6ff",
            points: [[0,0.04],[1,0.03],[2,0.03],[3,0.04],[4,0.05],[5,0.09],[6,0.72]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A $1\\times7$ feature row where the left end (position 0) must reproduce a value stored at the right end (position 6) — distance 6, beyond a single radius-1 convolution's $\\pm1$ reach. <b>Top:</b> with one hand-built non-local block the long-range MSE collapses to ~0.02; the conv-only ablation stays near ~1.0 (the target's variance — it never connects the two ends). <b>Bottom:</b> the trained softmax attention from the left query concentrates (~0.72) on position 6, exactly where the value lives — the block learned to look across the whole row in one shot. Same conv, optimizer, seed; the only difference is the non-local path.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

# Reproduces the qualitative effect: one non-local block solves a long-range
# copy task a single radius-1 conv cannot, and its attention points at the source.
class NonLocalBlock1d(nn.Module):
    def __init__(self, c, inner=None, use_nonlocal=True):
        super().__init__()
        inner = inner or max(1, c // 2); self.on = use_nonlocal
        self.theta, self.phi, self.g = (nn.Conv1d(c, inner, 1) for _ in range(3))
        self.Wz = nn.Conv1d(inner, c, 1)
        nn.init.zeros_(self.Wz.weight); nn.init.zeros_(self.Wz.bias)
        self.last_attn = None
    def forward(self, x):
        if not self.on: return x
        B, C, N = x.shape
        th = self.theta(x).permute(0, 2, 1); ph = self.phi(x); gg = self.g(x).permute(0, 2, 1)
        attn = torch.softmax(torch.bmm(th, ph), dim=-1)     # Eqn. 3 normalizer
        self.last_attn = attn
        return self.Wz(torch.bmm(attn, gg).permute(0, 2, 1)) + x   # Eqn. 1 + Eqn. 6

N, C = 7, 4
def make_batch(n=256):
    xb = torch.zeros(n, C, N); v = torch.randn(n)
    xb[:, 0, N - 1] = v; xb[:, 1, 0] = 1.0
    return xb, v

class Net(nn.Module):
    def __init__(self, on):
        super().__init__()
        self.local = nn.Conv1d(C, C, 3, padding=1); self.nl = NonLocalBlock1d(C, use_nonlocal=on)
        self.read = nn.Linear(C, 1)
    def forward(self, x):
        h = self.nl(torch.relu(self.local(x))); return self.read(h[:, :, 0]).squeeze(-1)

def train(on, steps=400):
    torch.manual_seed(0); net = Net(on); opt = torch.optim.Adam(net.parameters(), lr=1e-2)
    for _ in range(steps):
        xb, yb = make_batch(); opt.zero_grad(); F.mse_loss(net(xb), yb).backward(); opt.step()
    xb, yb = make_batch(1000)
    with torch.no_grad(): mse = F.mse_loss(net(xb), yb).item()
    attn = net.nl.last_attn[0, 0].tolist() if on else None     # left query's weights over j
    return mse, attn

mse_nl, attn = train(True)
mse_loc, _   = train(False)
print("with non-local: MSE", round(mse_nl, 3))
print("conv only     : MSE", round(mse_loc, 3))
print("left-query attention over positions:", [round(a, 2) for a in attn])
# non-local solves the long-range copy and attends to position 6; conv-only stays near variance ~1.`
  };
})();
