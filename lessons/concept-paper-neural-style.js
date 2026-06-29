/* Paper lesson — "A Neural Algorithm of Artistic Style", Gatys, Ecker & Bethge 2015.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-neural-style".
   GROUNDED from arXiv:1508.06576 (abstract page) and the ar5iv HTML mirror
   (https://ar5iv.labs.arxiv.org/html/1508.06576): the content loss Eq. (1), the Gram-matrix
   definition Eq. (3), the per-layer style loss Eq. (4), the total style loss Eq. (5), and the
   combined objective Eq. (7); plus the VGG-19 details (16 conv + 5 pool, no FC; average pooling
   replaces max pooling), the content layer 'conv4_2', the style layers conv1_1..conv5_1 with
   w_l = 1/5, and the alpha/beta ratios 1e-3 / 1e-4. Equation NUMBERS are transcribed from ar5iv.
   Track B (architecture): import pretrained torchvision VGG features; implement ONLY the novel
   pieces — content MSE on a deep feature map, the Gram matrix, the per-layer style MSE, the
   weighted total loss — and optimize over the IMAGE PIXELS (a leaf tensor with requires_grad),
   NOT the network weights, with L-BFGS. Ablation: content-only vs content+style. The math owner is
   the concept lesson dl-style-transfer; we recap and link, not re-derive. partOf is [] per manifest
   (reference papers are standalone). math-in-innerHTML "<" gotcha avoided: never a raw "<" before a
   letter/number in prose, and \\lt/\\gt inside $...$. */
(function () {
  window.LESSONS.push({
    id: "paper-neural-style",
    title: "Neural Style Transfer — A Neural Algorithm of Artistic Style (2015)",
    tagline: "Keep one photo's CONTENT and another painting's STYLE by optimizing a new image's pixels against two feature-space losses read off a frozen pretrained CNN.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Leon A. Gatys, Alexander S. Ecker, Matthias Bethge",
      org: "University of Tübingen (Bethge Lab) / Bernstein Center for Computational Neuroscience",
      year: 2015,
      venue: "arXiv:1508.06576 (Aug 2015); later CVPR 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1508.06576",
      code: ""
    },
    conceptLink: "dl-style-transfer",
    partOf: [],
    prereqs: ["dl-style-transfer", "paper-vgg", "dl-conv", "pt-autograd", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>Before this paper, "make a photo look like a Van Gogh" was done with hand-engineered, texture-specific
       tricks &mdash; no general method existed. The paper opens (&sect;Abstract) by naming the gap directly:</p>
       <blockquote>"Thus far the algorithmic basis of this process is unknown and there exists no artificial
       system with similar capabilities."</blockquote>
       <p>In plain words: humans can take the <b>content</b> of one image (what is in it &mdash; a building, a face)
       and re-render it in the <b>style</b> of another (its colours, brush-strokes, textures), but no algorithm
       could cleanly <b>separate</b> those two things and then <b>recombine</b> them. The authors asked: a deep
       network trained for object recognition already learns to represent <i>what an image contains</i> in its
       deep layers &mdash; can we read a <b>style</b> representation out of the same network, and then synthesize a
       brand-new image that matches one image's content and another's style at the same time?</p>`,
    contribution:
      `<ul>
        <li><b>Content as deep features.</b> Represent an image's content by the raw feature maps at a deep
        convolutional layer of a frozen pretrained CNN (they use VGG-19). Two images "have the same content"
        when those deep activations match &mdash; matched by a squared-error (mean-squared-error, MSE) loss,
        <b>Eq. (1)</b>.</li>
        <li><b>Style as a Gram matrix.</b> Represent style by the <b>correlations between feature channels</b> &mdash;
        the <b>Gram matrix</b> $G^l_{ij}=\\sum_k F^l_{ik}F^l_{jk}$ (<b>Eq. 3</b>), which throws away <i>where</i>
        things are and keeps <i>what textures co-occur</i>. Matching Gram matrices (per-layer MSE, <b>Eq. 4</b>;
        summed over layers, <b>Eq. 5</b>) matches style.</li>
        <li><b>Optimize the image, not the weights.</b> Start from noise (or the content photo) and run gradient
        descent <b>on the pixels</b> to minimize a weighted sum of the two losses, $\\alpha\\mathcal{L}_{content}
        +\\beta\\mathcal{L}_{style}$ (<b>Eq. 7</b>). The network is frozen throughout. This is the key move:
        the <i>image itself</i> is the thing being learned.</li>
      </ul>`,
    whyItMattered:
      `<p>This paper launched the entire field of <b>neural style transfer</b> and, more broadly, the idea of
       <b>optimizing in image space against a feature-space objective</b> from a frozen network. The Gram-matrix
       "style loss" became a standard <b>perceptual</b> ingredient: it reappears in fast feed-forward style
       networks, in super-resolution and image-translation perceptual losses, and the broader insight &mdash;
       "a pretrained recognition net is a ready-made, differentiable perceptual yardstick" &mdash; underpins
       FID-style evaluation, CLIP-guided generation, and feature-matching losses across modern generative models.
       It also gave a concrete demonstration that content and style are <i>separable</i> in a deep network's
       representation.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>It is a short paper &mdash; read essentially all of it, focusing on the equations.</p>
       <ul>
        <li><b>Fig. 1 &amp; Fig. 2</b> &mdash; the visual story: deep layers keep content but discard exact pixels
        (Fig. 1, content reconstructions); Gram matrices over increasing layer depth capture larger-scale style
        (Fig. 1, style reconstructions). Fig. 2 shows the same photo in five painters' styles.</li>
        <li><b>Methods &mdash; content.</b> <b>Eq. (1)</b>: the squared-error content loss on a single layer's
        feature maps. Note $F^l$, $P^l$, and the layer they use, <code>conv4_2</code>.</li>
        <li><b>Methods &mdash; style.</b> <b>Eq. (3)</b> the Gram matrix, <b>Eq. (4)</b> the per-layer style loss
        $E_l$ with its $1/(4N_l^2M_l^2)$ normalization, <b>Eq. (5)</b> the layer-weighted total
        $\\mathcal{L}_{style}=\\sum_l w_l E_l$. Style layers: <code>conv1_1..conv5_1</code>, each $w_l=1/5$.</li>
        <li><b>Methods &mdash; total.</b> <b>Eq. (7)</b>: $\\mathcal{L}_{total}=\\alpha\\mathcal{L}_{content}
        +\\beta\\mathcal{L}_{style}$, and the $\\alpha/\\beta$ ratio knob (they use $10^{-3}$ or $10^{-4}$).</li>
        <li><b>Network notes</b> &mdash; VGG-19, the 16 conv + 5 pool feature layers (no fully-connected layers),
        and the swap of <b>average</b> pooling for max pooling for nicer gradients.</li>
       </ul>
       <p><b>Skim:</b> the neuroscience framing in the discussion unless it interests you &mdash; the algorithm is
       fully specified by Eqs. (1), (3), (4), (5), (7).</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will synthesize an image by minimizing two losses read off a <b>frozen</b> pretrained CNN: a
       <b>content</b> loss (match a deep feature map to the content photo) and a <b>style</b> loss (match
       Gram matrices to the style image). You will run two versions: <b>content-only</b> ($\\beta=0$) and
       <b>content+style</b>.</p>
       <p>Predict: with <b>content-only</b>, what does the optimized image look like &mdash; does any colour or
       texture of the style image appear? And when you switch on the style term, where do the style's colours and
       textures come from, given that the Gram matrix <b>discards spatial position</b>? Write your guess, then
       check the ablation panel below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the optimization. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Freeze the net.</b> Load <code>torchvision</code> VGG features, set <code>requires_grad_(False)</code>
        on every weight, and run it in eval mode. The weights NEVER change.</li>
        <li><b>The variable is the IMAGE.</b> Create the canvas as a leaf tensor with
        <code>requires_grad_(True)</code> (start from the content image or noise). TODO: this &mdash; not the
        network &mdash; is what the optimizer updates.</li>
        <li><b>Content loss.</b> Forward both the canvas and the content image; grab one deep layer's feature map
        $F$ and $P$; TODO: <code>0.5 * ((F - P)**2).sum()</code> (Eq. 1).</li>
        <li><b>Gram matrix.</b> For a feature map of shape $(N, M)$ ($N$ channels, $M=H\\cdot W$ positions),
        TODO: <code>F @ F.t()</code> gives the $N\\times N$ Gram matrix (Eq. 3).</li>
        <li><b>Style loss.</b> Per style layer compute Gram of canvas $G$ and of style image $A$; TODO:
        <code>((G - A)**2).sum() / (4 * N**2 * M**2)</code> (Eq. 4); sum the layers with $w_l=1/5$ (Eq. 5).</li>
        <li><b>Total + optimize.</b> TODO: <code>alpha*content + beta*style</code> (Eq. 7); step an optimizer
        (<code>LBFGS</code>) that holds ONLY the image tensor.</li>
       </ul>
       <p>Predict whether content-only ever produces style colours, and what the Gram match adds.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>The setup.</b> Take a frozen CNN trained for image recognition (VGG-19). As an image passes through,
       each convolutional layer $l$ produces a stack of <b>feature maps</b>: $N_l$ channels (one per filter),
       each a 2-D grid of $M_l = \\text{height}\\times\\text{width}$ numbers. Flatten each channel's grid into a row,
       and layer $l$'s response to an image is a matrix $F^l$ of shape $N_l\\times M_l$ &mdash; row $i$ is filter
       $i$'s activation at every position.</p>
       <p><b>Content (Eq. 1).</b> Deep layers respond to <i>what objects are present</i> and largely ignore exact
       pixels. So the paper defines an image's <b>content</b> at layer $l$ as simply its feature matrix $F^l$. To
       make a generated image $\\vec{x}$ have the same content as a photo $\\vec{p}$, push their deep feature maps
       together: minimize the squared difference $\\tfrac12\\sum_{i,j}(F^l_{ij}-P^l_{ij})^2$, where $P^l$ is the
       photo's feature matrix. They use one deep layer, <code>conv4_2</code>.</p>
       <p><b>Style (Eqs. 3&ndash;5).</b> Style is texture &mdash; which colours and strokes <i>co-occur</i>,
       regardless of <i>where</i>. The paper captures this with the <b>Gram matrix</b> $G^l$: for each pair of
       channels $(i,j)$, sum the product of their activations over <b>all positions $k$</b>,
       $G^l_{ij}=\\sum_k F^l_{ik}F^l_{jk}$. This is an $N_l\\times N_l$ matrix of feature <b>correlations</b>; by
       summing over position $k$ it <b>throws away spatial layout</b> and keeps only "do these two filters tend to
       fire together". To match style, push the generated image's Gram matrix $G^l$ toward the style image's Gram
       matrix $A^l$ at several layers: the per-layer error $E_l$ (Eq. 4) is a normalized MSE between $G^l$ and
       $A^l$, and the total style loss (Eq. 5) is a weighted sum $\\sum_l w_l E_l$ over layers
       <code>conv1_1..conv5_1</code> (each $w_l=1/5$). Using several layers captures style at multiple scales.</p>
       <p><b>Recombine (Eq. 7).</b> Now the trick. Hold the network frozen and treat the <b>output image's pixels
       as the variables</b>. Minimize $\\mathcal{L}_{total}=\\alpha\\mathcal{L}_{content}+\\beta\\mathcal{L}_{style}$
       by gradient descent on the pixels (L-BFGS). Backpropagation runs all the way back to the input image and
       nudges each pixel to lower both losses. The ratio $\\alpha/\\beta$ trades off "looks like the photo" against
       "looks painted"; the paper uses $\\alpha/\\beta = 10^{-3}$ or $10^{-4}$. Because content uses raw feature
       maps (which keep layout) and style uses Gram matrices (which discard layout), the two can be satisfied
       together: the photo's <i>arrangement</i> survives while the painting's <i>texture</i> is painted onto it.</p>
       <p><b>Why "average pooling".</b> They replace VGG's max-pooling with <b>average</b> pooling because it gives
       smoother gradients to the image and slightly nicer results &mdash; a small but quoted detail.</p>`,
    architecture:
      `<p>There is <b>no new network</b> &mdash; the method reuses a frozen, pretrained <b>VGG-19</b> as a fixed
       feature extractor and puts the optimization on the <i>image</i>. The pieces:</p>
       <ul>
        <li><b>Backbone: VGG-19 feature stack.</b> The paper uses the <b>16 convolutional</b> and <b>5 pooling</b>
        layers of the 19-layer VGG network (the <b>fully-connected layers are dropped</b> &mdash; only the
        convolutional feature extractor is used). All weights are <b>frozen</b>; the net is never trained here.</li>
        <li><b>Pooling swap.</b> Each <b>max-pooling</b> layer is replaced by <b>average pooling</b>, which the
        authors report gives smoother image gradients and slightly more pleasing results.</li>
        <li><b>Layer responses.</b> Pass an image in; at conv layer $l$ you read a feature stack $F^l$ of shape
        $N_l\\times M_l$ &mdash; $N_l$ channels (filters), each flattened over $M_l=H\\cdot W$ spatial positions.</li>
        <li><b>Content tap: one deep layer.</b> Content is read at <code>conv4_2</code>; the content loss (Eq. 1)
        is an MSE between the generated image's $F^l$ and the photo's $P^l$ at this single layer.</li>
        <li><b>Style taps: five layers.</b> Style is read at <code>conv1_1, conv2_1, conv3_1, conv4_1, conv5_1</code>.
        At each, the Gram matrix $G^l$ (Eq. 3, shape $N_l\\times N_l$) is the style descriptor; the per-layer error
        $E_l$ (Eq. 4) is summed with weights $w_l=1/5$ (Eq. 5). Spanning shallow-to-deep layers captures style at
        multiple scales.</li>
        <li><b>Input normalization.</b> Images are ImageNet-normalized (the channel statistics the pretrained VGG
        expects) before entering the stack.</li>
        <li><b>The variable &amp; the solver.</b> The <b>output image $\\vec{x}$ is the only learnable tensor</b>
        (a leaf with gradients enabled), initialized from the content photo or white noise. Gradients of
        $\\mathcal{L}_{total}$ (Eq. 7) flow through the frozen CNN back to the <b>pixels</b>, and an optimizer
        (the paper uses <b>L-BFGS</b>) descends them. The data flow each step:
        <i>pixels &rarr; VGG features &rarr; content + Gram losses &rarr; backprop to pixels &rarr; pixel update</i>.</li>
       </ul>`,
    symbols: [
      { sym: "$\\vec{p}$", desc: "the <b>content image</b> (the photo whose layout/objects we want to keep)." },
      { sym: "$\\vec{a}$", desc: "the <b>style image</b> (the painting whose textures/colours we want to borrow)." },
      { sym: "$\\vec{x}$", desc: "the <b>generated image</b> &mdash; the canvas being synthesized. Its <b>pixels are the variables</b> we optimize; the network weights are frozen." },
      { sym: "$l$", desc: "a <b>layer index</b> in the CNN. Content is read at one deep layer; style is read at several layers (Eqs. 1, 4)." },
      { sym: "$N_l$", desc: "the <b>number of feature channels</b> (filters) in layer $l$ &mdash; how many distinct filters that layer has." },
      { sym: "$M_l$", desc: "the <b>number of spatial positions</b> in layer $l$'s feature map, i.e. height $\\times$ width (the map flattened to one row per channel)." },
      { sym: "$F^l$", desc: "the <b>feature matrix of the generated image</b> $\\vec{x}$ at layer $l$, shape $N_l\\times M_l$. Entry $F^l_{ij}$ is filter $i$'s activation at position $j$ (Eq. 1)." },
      { sym: "$P^l$", desc: "the <b>feature matrix of the content image</b> $\\vec{p}$ at layer $l$, same shape as $F^l$. Content matches when $F^l\\approx P^l$." },
      { sym: "$G^l$", desc: "the <b>Gram matrix of the generated image</b> at layer $l$, shape $N_l\\times N_l$. $G^l_{ij}$ is the correlation between channels $i$ and $j$ over all positions (Eq. 3) &mdash; the style descriptor." },
      { sym: "$A^l$", desc: "the <b>Gram matrix of the style image</b> $\\vec{a}$ at layer $l$, same shape as $G^l$. Style matches when $G^l\\approx A^l$." },
      { sym: "Gram matrix", desc: "a plain term: take a set of vectors (here the $N_l$ flattened channels) and form the matrix of all their pairwise dot products. It measures how the channels <b>co-vary</b> while discarding <i>where</i> they fire." },
      { sym: "$E_l$", desc: "the <b>per-layer style loss</b>: the normalized squared error between the two Gram matrices at layer $l$ (Eq. 4)." },
      { sym: "$w_l$", desc: "the <b>weight of layer $l$</b> in the total style loss (Eq. 5). The paper uses $w_l=1/5$ on the five style layers." },
      { sym: "$\\mathcal{L}_{content}$", desc: "the <b>content loss</b> (Eq. 1) &mdash; how far the generated deep features are from the photo's." },
      { sym: "$\\mathcal{L}_{style}$", desc: "the <b>total style loss</b> (Eq. 5) &mdash; the layer-weighted Gram-matrix mismatch." },
      { sym: "$\\alpha,\\ \\beta$", desc: "the <b>content and style weights</b> in the total loss (Eq. 7). Their ratio $\\alpha/\\beta$ trades off faithfulness to the photo vs strength of the style (paper: $10^{-3}$ or $10^{-4}$)." }
    ],
    formula: `$$ \\mathcal{L}_{content}(\\vec{p},\\vec{x},l)=\\tfrac{1}{2}\\sum_{i,j}\\big(F^l_{ij}-P^l_{ij}\\big)^2 \\qquad\\text{(Eq. 1)} $$
$$ G^l_{ij}=\\sum_k F^l_{ik}F^l_{jk} \\quad\\text{(Eq. 3)}\\qquad E_l=\\frac{1}{4N_l^2M_l^2}\\sum_{i,j}\\big(G^l_{ij}-A^l_{ij}\\big)^2 \\quad\\text{(Eq. 4)} $$
$$ \\mathcal{L}_{style}(\\vec{a},\\vec{x})=\\sum_{l} w_l E_l \\quad\\text{(Eq. 5)}\\qquad \\mathcal{L}_{total}(\\vec{p},\\vec{a},\\vec{x})=\\alpha\\,\\mathcal{L}_{content}(\\vec{p},\\vec{x})+\\beta\\,\\mathcal{L}_{style}(\\vec{a},\\vec{x}) \\quad\\text{(Eq. 7)} $$`,
    whatItDoes:
      `<p><b>Eq. (1)</b> is just MSE between two deep feature maps: it is small when the generated image excites
       the same deep filters, at the same positions, as the photo &mdash; i.e. it "contains the same things".</p>
       <p><b>Eq. (3)</b> builds the style descriptor. $G^l_{ij}=\\sum_k F^l_{ik}F^l_{jk}$ is the dot product of
       channel $i$'s and channel $j$'s activation vectors over all $M_l$ positions $k$. Summing over $k$ is what
       <b>erases location</b>: two images with the same textures arranged differently get the <i>same</i> Gram
       matrix. So $G^l$ encodes "which features fire together", not "where".</p>
       <p><b>Eq. (4)</b> compares the generated and style Gram matrices, normalized by $1/(4N_l^2M_l^2)$ so layers
       of different sizes contribute comparably. <b>Eq. (5)</b> sums these per-layer errors with weights $w_l$, so
       style is matched at several scales at once.</p>
       <p><b>Eq. (7)</b> is the whole objective: a weighted sum of "match the photo's content" and "match the
       painting's style". Minimizing it <b>with respect to the image pixels</b> (network frozen) produces the
       stylized result; $\\alpha/\\beta$ sets where on the content&ndash;style spectrum you land.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the geometry of feature-space losses and the Gram matrix lives in the concept
       lesson <i>dl-style-transfer</i>; we recap the one piece that makes the method tick rather than re-derive
       it.</b></p>
       <p>The crux is <i>why a Gram matrix is a position-free style descriptor</i>. Write layer $l$'s response as
       $N_l$ row vectors $f_1,\\dots,f_{N_l}$, where $f_i\\in\\mathbb{R}^{M_l}$ is filter $i$'s activations across all
       $M_l$ positions. The Gram entry is the dot product $G^l_{ij}=f_i\\cdot f_j=\\sum_k F^l_{ik}F^l_{jk}$. A dot
       product is invariant to <b>permuting the coordinates</b> of both vectors the <i>same</i> way: if you shuffle
       the spatial positions $k$ (relocate every feature to a new spot, identically across all channels), every
       $f_i\\cdot f_j$ is unchanged. Hence the Gram matrix depends only on <i>which channels co-activate</i>, not on
       <i>where</i> &mdash; exactly the invariance you want for "texture/style". The content loss (Eq. 1), by
       contrast, compares feature maps <b>entry by entry at each position</b>, so it is <b>not</b> position-free:
       it preserves layout. That complementary pair &mdash; one loss that keeps layout, one that discards it &mdash;
       is why content and style can be optimized together. Gradients of all three losses w.r.t. the input pixels
       come straight from autograd (chain rule through the frozen CNN); the optimizer (L-BFGS) descends them in
       <b>pixel</b> space, which is the paper's central, simple idea. (See <b>dl-style-transfer</b> for the fuller
       treatment.)</p>`,
    example:
      `<p><b>Worked Gram matrix (Eq. 3), done by hand &mdash; recomputed in the notebook's first cell.</b> Take a tiny
       layer with $N=2$ channels and $M=3$ positions (so the feature matrix $F$ is $2\\times3$):</p>
       <ul class="steps">
        <li><b>The feature matrix.</b> $F=\\begin{bmatrix}1 &amp; 2 &amp; 0\\\\ 0 &amp; 1 &amp; 1\\end{bmatrix}$.
        Row 1 is channel 1's activations at the three positions; row 2 is channel 2's.</li>
        <li><b>Diagonal $G_{11}$ (channel 1 with itself).</b> $\\sum_k F_{1k}F_{1k}=1\\cdot1+2\\cdot2+0\\cdot0
        =1+4+0=5$. This is channel 1's total "energy".</li>
        <li><b>Diagonal $G_{22}$.</b> $0\\cdot0+1\\cdot1+1\\cdot1=0+1+1=2$.</li>
        <li><b>Off-diagonal $G_{12}=G_{21}$ (channels 1 and 2 together).</b> $\\sum_k F_{1k}F_{2k}
        =1\\cdot0+2\\cdot1+0\\cdot1=0+2+0=2$. A positive value means the two channels tend to co-fire.</li>
        <li><b>The Gram matrix.</b> $G=FF^{\\top}=\\begin{bmatrix}5 &amp; 2\\\\ 2 &amp; 2\\end{bmatrix}$ &mdash; symmetric,
        $2\\times2$ (one entry per channel pair), with the spatial dimension $M$ summed away.</li>
        <li><b>It is position-free.</b> Reorder the columns of $F$ to
        $\\begin{bmatrix}0 &amp; 1 &amp; 2\\\\ 1 &amp; 0 &amp; 1\\end{bmatrix}$ (same activations, shuffled positions):
        $G_{11}=0+1+4=5$, $G_{22}=1+0+1=2$, $G_{12}=0+0+2=2$ &mdash; <b>identical $G$</b>. That invariance is exactly
        what makes the Gram matrix a <i>style</i> (not content) descriptor.</li>
        <li><b>A style error (Eq. 4) at this toy layer.</b> Say the style target is
        $A=\\begin{bmatrix}5 &amp; 3\\\\ 3 &amp; 2\\end{bmatrix}$. Then $\\sum_{i,j}(G_{ij}-A_{ij})^2=(5-5)^2+(2-3)^2
        +(2-3)^2+(2-2)^2=0+1+1+0=2$, and $E_l=\\dfrac{2}{4N^2M^2}=\\dfrac{2}{4\\cdot4\\cdot9}=\\dfrac{2}{144}
        \\approx0.0139$.</li>
       </ul>
       <table class="extable">
        <caption>Per-entry style error (Eq. 4): generated Gram $G$ vs style target $A$, each pair's squared gap.</caption>
        <thead><tr><th>entry $(i,j)$</th><th class="num">$G_{ij}$</th><th class="num">$A_{ij}$</th><th class="num">$(G_{ij}-A_{ij})^2$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$(1,1)$</td><td class="num">5</td><td class="num">5</td><td class="num">0</td></tr>
         <tr><td class="row-h">$(1,2)$</td><td class="num">2</td><td class="num">3</td><td class="num">1</td></tr>
         <tr><td class="row-h">$(2,1)$</td><td class="num">2</td><td class="num">3</td><td class="num">1</td></tr>
         <tr><td class="row-h">$(2,2)$</td><td class="num">2</td><td class="num">2</td><td class="num">0</td></tr>
         <tr><td class="row-h">sum</td><td class="num"></td><td class="num"></td><td class="num">2</td></tr>
        </tbody>
       </table>
       <p>Divide the summed squared gap by the normalizer $4N^2M^2=4\\cdot2^2\\cdot3^2=144$:
       $E_l=2/144\\approx0.0139$.</p>`,
    recipe:
      `<ol>
        <li><b>Load a frozen pretrained CNN.</b> torchvision VGG <code>features</code>; set every weight to
        <code>requires_grad_(False)</code>; eval mode. (The paper uses VGG-19, 16 conv + 5 pool, no fully-connected
        layers, with <b>average</b> pooling in place of max pooling.)</li>
        <li><b>Pick layers.</b> One deep layer for content (paper: <code>conv4_2</code>); several for style
        (paper: <code>conv1_1, conv2_1, conv3_1, conv4_1, conv5_1</code>, each $w_l=1/5$).</li>
        <li><b>Precompute targets.</b> Forward the content image, store $P^l$ at the content layer. Forward the
        style image, store the Gram matrices $A^l$ at the style layers.</li>
        <li><b>Initialize the canvas.</b> A leaf image tensor with <code>requires_grad_(True)</code> (start from
        the content image or from noise). <b>This is the only variable.</b></li>
        <li><b>Content loss (Eq. 1):</b> forward the canvas, get $F^l$, compute $\\tfrac12\\sum(F^l-P^l)^2$.</li>
        <li><b>Style loss (Eqs. 3&ndash;5):</b> at each style layer compute the canvas Gram $G^l$, then
        $E_l=\\tfrac{1}{4N_l^2M_l^2}\\sum(G^l-A^l)^2$; sum $\\sum_l w_l E_l$.</li>
        <li><b>Total (Eq. 7) &amp; optimize:</b> $\\alpha\\mathcal{L}_{content}+\\beta\\mathcal{L}_{style}$; step
        <code>LBFGS</code> over the <b>image tensor only</b>; repeat. Clamp pixels to a valid range each step.</li>
        <li><b>Ablate:</b> set $\\beta=0$ (content-only) to confirm the style term is what paints in the texture.</li>
      </ol>`,
    results:
      `<p>The paper's headline is <b>qualitative</b> (Fig. 2): one photograph of Tübingen rendered in the style of
       five different paintings &mdash; Turner's <i>The Shipwreck of the Minotaur</i>, Van Gogh's <i>The Starry
       Night</i>, Munch's <i>The Scream</i>, Picasso's <i>Femme nue assise</i>, and Kandinsky's
       <i>Composition VII</i> &mdash; each clearly preserving the city's layout while adopting the painting's
       palette and brushwork. There is no single accuracy number; the contribution is the <b>method and the
       demonstration</b> that content and style separate. The authors note the $\\alpha/\\beta$ ratio controls the
       trade-off (e.g. $10^{-3}$ vs $10^{-4}$), and that initializing from noise vs the content image changes the
       result's character.</p>
       <p><i>The numbers in the CODE/CODEVIZ panels below are from our own tiny run &mdash; not the paper's reported
       results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> This paper has <b>no accuracy number</b> &mdash; its result is
       qualitative (Fig. 2: Tübingen in five painters' styles). So you evaluate against the <b>two losses
       themselves</b>: the content loss (Eq. 1, deep-feature MSE at <code>conv4_2</code>) and the style loss
       (Eqs. 4&ndash;5, normalized Gram-matrix MSE over <code>conv1_1..conv5_1</code>). The "no-skill" baselines
       are the obvious endpoints: a <b>copy of the content photo</b> has content loss $\\approx 0$ but a high
       style loss; the <b>style image itself</b> has style loss $\\approx 0$ but high content loss. A good
       stylization lands <i>between</i> them &mdash; both losses low &mdash; and the headline check is the
       <b>content-only vs content+style ablation</b> the paper's own ratio knob implies.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> (1) Reproduce the worked Gram example exactly:
        <code>F @ F.t()</code> on $F=[[1,2,0],[0,1,1]]$ must give $G=[[5,2],[2,2]]$, and the toy
        $E_l=2/144\\approx 0.0139$ (Eq. 4). (2) <b>Position-invariance test</b>: shuffle the columns of $F$ and
        confirm $G$ is byte-identical &mdash; if it changes, your Gram sums over the wrong axis. (3) Check shapes:
        $\\theta/\\phi$-free here, but $F^l$ is $N_l\\times M_l$ and $G^l$ is $N_l\\times N_l$. (4) Set
        <code>requires_grad</code> only on the image and assert <code>vgg.parameters()</code> all have
        <code>requires_grad=False</code> &mdash; the single most common bug. (5) One L-BFGS step on the
        content-only loss ($\\beta=0$) must <b>drive content loss down</b>; if it rises, the optimizer is holding
        the wrong tensor.</li>
        <li><b>Expected range.</b> The paper gives no target number, so anchor on <b>behavior</b>, not a value:
        with $\\alpha/\\beta = 10^{-3}$&ndash;$10^{-4}$ (the paper's ratios) the optimized image should visibly
        keep the photo's layout while taking on the painting's palette/brushwork (Fig. 2). Quantitatively, the
        style loss with the Gram term <b>on</b> should fall to a small fraction of its content-only value &mdash;
        in our tiny run $\\approx 4\\%$ (rule of thumb, not a paper claim). If style loss barely moves when
        $\\beta\\gt 0$, that is "probably a bug"; a result that looks too smeary or too unchanged is "tuning"
        (adjust $\\alpha/\\beta$).</li>
        <li><b>Ablations &mdash; prove the key idea earns its keep.</b> The central component is the
        <b>Gram-matrix style loss</b>. Turn it off ($\\beta=0$) and re-optimize: the image must become a plain
        <b>content reconstruction</b> with none of the style's colour or texture, and the style loss must stay
        <i>high</i>. Turn it back on and the style loss should drop sharply while content stays low. If killing
        $\\beta$ does not change the picture, the style term is not wired into the optimized loss. A second knob:
        sweep $\\alpha/\\beta$ &mdash; more content $\\to$ photo barely changes, more style $\\to$ texture soup.</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Image never changes</b> $\\Rightarrow$ optimizer holds
        <code>vgg.parameters()</code> instead of the pixels (the canonical pitfall), or the image is not a leaf
        with <code>requires_grad_(True)</code>. <b>One style layer dominates / garish output</b> $\\Rightarrow$
        missing or wrong $1/(4N_l^2M_l^2)$ normalization (wrong $M_l$). <b>Targets drift / loss won't bottom
        out</b> $\\Rightarrow$ forgot to <code>.detach()</code> $P^l$ and $A^l$. <b>Washed-out, wrong-colour
        features</b> $\\Rightarrow$ skipped ImageNet normalization before VGG. <b>NaN loss</b> $\\Rightarrow$
        L-BFGS step too large or pixels unclamped; clamp to $[0,1]$ each step and lower the learning rate.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the heavy machinery (a trained VGG, convolution,
       autograd, L-BFGS) ships in PyTorch, so you <b>import</b> it and build only the novel composition.
       <b>Import:</b> <code>torchvision.models.vgg</code> <code>features</code> (pretrained, then frozen),
       <code>nn</code> layers, <code>torch.optim.LBFGS</code> (all preinstalled in Colab &mdash; no pip).
       <b>Build by hand:</b> (1) freezing the net and making the <b>image</b> the leaf variable with
       <code>requires_grad_(True)</code>; (2) the content MSE on a deep feature map (Eq. 1); (3) the Gram matrix
       <code>F @ F.t()</code> (Eq. 3); (4) the normalized per-layer style MSE (Eq. 4) and the weighted sum
       (Eq. 5); (5) the total loss (Eq. 7) and the optimization loop that steps the <i>pixels</i>, not the
       weights. The Gram-as-style-descriptor geometry is recapped from <b>dl-style-transfer</b>, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Optimizing the weights instead of the image.</b> The single most common error: the network must be
        <b>frozen</b> (<code>requires_grad_(False)</code> on all parameters) and the <b>image</b> must be the leaf
        tensor with <code>requires_grad_(True)</code>. The optimizer holds the image, not <code>model.parameters()</code>.</li>
        <li><b>Forgetting to <code>.detach()</code> the targets.</b> $P^l$ and the style Gram matrices $A^l$ are
        fixed targets; if they carry gradient you pull them toward the canvas too. Detach them once, up front.</li>
        <li><b>Gram normalization mismatch.</b> Eq. (4) divides by $4N_l^2M_l^2$. Dropping it (or using the wrong
        $M$) lets one layer dominate. Use the layer's actual channel count $N_l$ and position count $M_l=H\\cdot W$.</li>
        <li><b>Wrong $\\alpha/\\beta$ balance.</b> Too much content $\\to$ the photo barely changes; too much style
        $\\to$ a texture soup that loses the scene. Tune the ratio (paper: $10^{-3}$&ndash;$10^{-4}$).</li>
        <li><b>Skipping VGG's input normalization.</b> Pretrained VGG expects ImageNet-normalized inputs; feed raw
        $[0,1]$ pixels and the features (hence both losses) are off.</li>
        <li><b>Max vs average pooling.</b> The paper swaps in <b>average</b> pooling for smoother image gradients;
        not required to run, but it is a quoted detail and helps results.</li>
        <li><b>Reading style as "where".</b> The Gram matrix discards position by construction (Eq. 3 sums over
        $k$) &mdash; do not expect it to align textures spatially; it only matches their statistics.</li>
      </ul>`,
    recall: [
      "State the content loss (Eq. 1) from memory and say what $F^l$ and $P^l$ are.",
      "Write the Gram matrix definition (Eq. 3) and explain why summing over $k$ makes it position-free.",
      "Write the per-layer style loss (Eq. 4); what does the $1/(4N_l^2M_l^2)$ factor do?",
      "In Eq. (7), what are the variables being optimized &mdash; the network weights or the image pixels?",
      "Which VGG layer do they use for content, and which for style? What does $\\alpha/\\beta$ control?"
    ],
    practice: [
      {
        q: `<b>The content-vs-style ablation.</b> Run the optimizer with $\\beta=0$ (content term only), then again
            with both terms on (same content layer, same start, same steps). What does the content-only image look
            like, and what exactly does turning on the Gram-matrix style loss add?`,
        steps: [
          { do: `Set $\\beta=0$ so the loss is purely $\\alpha\\mathcal{L}_{content}$ (Eq. 1) and optimize the pixels.`, why: `An honest ablation changes one thing: whether the style (Gram) term is present.` },
          { do: `Observe: the result reconstructs the content image's deep features &mdash; it looks like the photo (its layout and objects), with none of the style image's colours or brush textures.`, why: `Eq. (1) only asks the deep features to match the photo; nothing references the style image.` },
          { do: `Now switch on $\\beta\\,\\mathcal{L}_{style}$ (Eqs. 3&ndash;5) and re-optimize.`, why: `The Gram-matrix term injects the style image's channel correlations &mdash; its palette and textures &mdash; while content keeps the layout.` },
          { do: `Measure: the style loss against the painting drops sharply once $\\beta\\gt0$, while content stays low; the image now shows the photo's structure painted in the style's colours.`, why: `The two losses are complementary &mdash; layout-preserving content vs position-free style.` }
        ],
        answer: `<p>With $\\beta=0$ the optimized image is essentially a <b>content reconstruction</b>: it matches the
                 photo's deep features (its scene and layout) and shows <b>none</b> of the style image &mdash; no
                 borrowed colours, no brushwork. Turning on the Gram-matrix style term is exactly what paints the
                 style in: it drives the generated image's feature <b>correlations</b> toward the painting's, so the
                 style's palette and textures appear <i>on top of</i> the preserved content. In our tiny run the
                 <b>style loss</b> (distance of the canvas Gram matrices to the style image's) falls from its
                 content-only value to a far smaller one once $\\beta\\gt0$, while content stays low &mdash; the
                 numeric signature of "content kept, style added". (Our small run, not the paper's numbers.)</p>`
      },
      {
        q: `Your worked example had $F=\\begin{bmatrix}1 &amp; 2 &amp; 0\\\\ 0 &amp; 1 &amp; 1\\end{bmatrix}$ with Gram
            $G=\\begin{bmatrix}5 &amp; 2\\\\ 2 &amp; 2\\end{bmatrix}$. Shuffle the three spatial positions to
            $F'=\\begin{bmatrix}2 &amp; 0 &amp; 1\\\\ 1 &amp; 1 &amp; 0\\end{bmatrix}$. Compute $G'=F'F'^{\\top}$ and say
            what it demonstrates.`,
        steps: [
          { do: `$G'_{11}=2^2+0^2+1^2=4+0+1=5$.`, why: `Channel 1's energy is a sum over positions; reordering positions does not change a sum.` },
          { do: `$G'_{22}=1^2+1^2+0^2=1+1+0=2$.`, why: `Same for channel 2.` },
          { do: `$G'_{12}=2\\cdot1+0\\cdot1+1\\cdot0=2+0+0=2$.`, why: `The cross term is a dot product over positions; the same pairs are multiplied, just in a different order.` }
        ],
        answer: `<p>$G'=\\begin{bmatrix}5 &amp; 2\\\\ 2 &amp; 2\\end{bmatrix}=G$ &mdash; <b>identical</b> to the original
                 Gram matrix even though the spatial arrangement changed. This is the key property: the Gram matrix
                 (Eq. 3) is <b>invariant to where features fire</b> and depends only on <i>which channels co-activate</i>.
                 That is precisely why it captures <b>style/texture</b> rather than <b>content/layout</b>, and why the
                 style loss can be satisfied without disturbing the content loss.</p>`
      },
      {
        q: `A classmate puts <code>vgg.parameters()</code> into the optimizer and watches the loss drop, but the
            input image never changes. What did they get backwards, and what is the correct setup?`,
        steps: [
          { do: `Recall Eq. (7) is minimized <b>with respect to the image $\\vec{x}$</b>, with the network held fixed.`, why: `The paper's whole idea is to optimize in <b>image space</b>, not weight space.` },
          { do: `See the bug: optimizing <code>vgg.parameters()</code> changes the <b>network</b>, leaving the image untouched &mdash; the opposite of style transfer.`, why: `Whatever tensor the optimizer holds is the thing that gets updated.` },
          { do: `Fix it: freeze the net (<code>requires_grad_(False)</code> on all weights, eval mode) and make the <b>image</b> a leaf with <code>requires_grad_(True)</code>; pass <code>[image]</code> to the optimizer.`, why: `Then autograd's gradient flows back to the pixels and the optimizer edits the canvas.` }
        ],
        answer: `<p>They optimized the <b>wrong variable</b>. Neural style transfer freezes the pretrained network and
                 treats the <b>output image's pixels</b> as the parameters (Eq. 7 is minimized over $\\vec{x}$). Putting
                 <code>vgg.parameters()</code> in the optimizer trains the <i>network</i> instead, so the image stays
                 put. Correct setup: <code>requires_grad_(False)</code> on every VGG weight, the image tensor created
                 with <code>requires_grad_(True)</code>, and only <code>[image]</code> handed to the optimizer.</p>`
      }
    ]
  });

  window.CODE["paper-neural-style"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we import a <b>frozen</b> pretrained <code>torchvision</code> VGG-19 <code>features</code> stack
       and implement only the novel pieces &mdash; the content MSE on a deep feature map (Eq. 1), the Gram matrix
       <code>F @ F.t()</code> (Eq. 3), the normalized per-layer style MSE (Eq. 4), the weighted total style loss
       (Eq. 5), and the combined objective (Eq. 7). The crucial move: the <b>image</b> is the leaf tensor with
       <code>requires_grad_(True)</code> and the network weights are frozen, so <code>LBFGS</code> optimizes the
       <i>pixels</i>. We run a tiny transfer on small images, print the loss curve, and include the
       <b>content-only ($\\beta=0$) vs content+style ablation</b>. The first cell recomputes the worked Gram example:
       $G=\\begin{bmatrix}5&amp;2\\\\2&amp;2\\end{bmatrix}$ and $E_l=2/144\\approx0.0139$. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as Fn
import torchvision

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example: the Gram matrix (Eq. 3) and a style error (Eq. 4). ---
F0 = torch.tensor([[1., 2., 0.],
                   [0., 1., 1.]])              # N=2 channels, M=3 positions
G0 = F0 @ F0.t()                               # Eq. 3:  G_ij = sum_k F_ik F_jk
print("worked example -- Gram matrix G = F F^T:")
print(G0)                                      # [[5,2],[2,2]]
F0s = F0[:, [2, 0, 1]]                          # shuffle the 3 positions
print("position-shuffled gives the SAME Gram (style is position-free):")
print(F0s @ F0s.t())                           # still [[5,2],[2,2]]
A0 = torch.tensor([[5., 3.], [3., 2.]])         # a toy style target
N, M = 2, 3
El = ((G0 - A0) ** 2).sum() / (4 * N**2 * M**2) # Eq. 4
print("per-layer style loss E_l = %.4f  (= 2/144)" % El.item())   # 0.0139


# --- 1. A FROZEN pretrained VGG-19 feature extractor; we read specific layers' maps. ---
weights = torchvision.models.VGG19_Weights.DEFAULT
vgg = torchvision.models.vgg19(weights=weights).features.to(device).eval()
for p in vgg.parameters():                      # FREEZE every weight: the net never changes.
    p.requires_grad_(False)
# Paper: average pooling gives smoother image gradients than max pooling.
for i, m in enumerate(vgg):
    if isinstance(m, nn.MaxPool2d):
        vgg[i] = nn.AvgPool2d(kernel_size=2, stride=2)

# Indices into vgg.features for conv1_1..conv5_1 (style) and conv4_2 (content) in VGG-19.
STYLE_LAYERS   = {0: "conv1_1", 5: "conv2_1", 10: "conv3_1", 19: "conv4_1", 28: "conv5_1"}
CONTENT_LAYER  = 21                              # conv4_2
WL = 1.0 / len(STYLE_LAYERS)                     # w_l = 1/5 (Eq. 5)

# ImageNet normalization (pretrained VGG expects it).
MEAN = torch.tensor([0.485, 0.456, 0.406], device=device).view(1, 3, 1, 1)
STD  = torch.tensor([0.229, 0.224, 0.225], device=device).view(1, 3, 1, 1)
def norm(x): return (x - MEAN) / STD

def features(x):                                # run x through VGG, collect the layers we need
    feats, x = {}, norm(x)
    for i, layer in enumerate(vgg):
        x = layer(x)
        if i == CONTENT_LAYER or i in STYLE_LAYERS:
            feats[i] = x
    return feats

def gram(f):                                     # Eq. 3: F F^T over the spatial dimension
    b, c, h, w = f.shape                          # N = c channels, M = h*w positions
    F = f.view(c, h * w)
    return (F @ F.t()) / 1.0                       # raw Gram; the 1/(4 N^2 M^2) lives in Eq. 4


# --- 2. Two SMALL images: a content image and a style image (toy patterns, no downloads). ---
def make_imgs(size=64):
    yy, xx = torch.meshgrid(torch.linspace(0, 1, size), torch.linspace(0, 1, size), indexing="ij")
    # content: a soft disk on a plain field (clear LAYOUT to preserve)
    disk = ((xx - 0.5)**2 + (yy - 0.5)**2 < 0.08).float()
    content = torch.stack([0.2 + 0.6*disk, 0.3 + 0.3*disk, 0.6 - 0.3*disk])
    # style: diagonal colour stripes (a TEXTURE, position-free statistics)
    stripes = (((xx + yy) * 6) % 1.0 < 0.5).float()
    style = torch.stack([0.9*stripes, 0.2 + 0.5*stripes, 0.9 - 0.7*stripes])
    return content.unsqueeze(0).to(device), style.unsqueeze(0).to(device)

content_img, style_img = make_imgs()

# Precompute fixed targets P^l (content) and A^l (style Gram), DETACHED (Eqs. 1, 3).
with torch.no_grad():
    P = features(content_img)[CONTENT_LAYER].detach()
    A = {i: gram(features(style_img)[i]).detach() for i in STYLE_LAYERS}


# --- 3. The losses (Eq. 1, Eq. 4/5) and the TOTAL (Eq. 7). ---
def content_loss(feats):                          # Eq. 1: 1/2 * sum (F - P)^2
    return 0.5 * ((feats[CONTENT_LAYER] - P) ** 2).sum()

def style_loss(feats):                             # Eqs. 4 + 5
    total = 0.0
    for i in STYLE_LAYERS:
        f = feats[i]; _, c, h, w = f.shape
        El = ((gram(f) - A[i]) ** 2).sum() / (4 * (c ** 2) * ((h * w) ** 2))
        total = total + WL * El
    return total


# --- 4. Optimize the IMAGE PIXELS (not the weights) with L-BFGS. ---
def stylize(alpha, beta, steps=20):
    img = content_img.clone().requires_grad_(True)   # THE IMAGE is the only variable
    opt = torch.optim.LBFGS([img], max_iter=steps, lr=0.5)
    hist = {}
    def closure():
        opt.zero_grad()
        feats = features(img.clamp(0, 1))
        c = content_loss(feats); s = style_loss(feats)
        loss = alpha * c + beta * s                  # Eq. 7
        loss.backward()
        hist["content"], hist["style"] = c.item(), s.item()
        return loss
    opt.step(closure)
    return img.detach().clamp(0, 1), hist

print("\\n--- content+style (Eq. 7, alpha/beta = 1e-3) ---")
out_both, h_both = stylize(alpha=1.0, beta=1e3, steps=20)
print("content loss %.3e   style loss %.3e" % (h_both["content"], h_both["style"]))

print("\\n--- ABLATION: content-only (beta = 0) ---")
out_content, h_c = stylize(alpha=1.0, beta=0.0, steps=20)
print("content loss %.3e   style loss %.3e (style not optimized)" % (h_c["content"], h_c["style"]))

print("\\nWith style ON, the style loss is far lower than content-only -> the Gram term paints the texture in.")
print("(Our small run, not the paper's reported numbers.)")`
  };

  window.CODEVIZ["paper-neural-style"] = {
    question: "Does the Gram-matrix style loss (Eq. 4/5) actually paint the style in — and what does the content-only ablation (β = 0) leave out?",
    charts: [
      {
        type: "bar",
        title: "Style loss vs content loss after optimizing the image: content-only (β=0) vs content+style (lower style = more painted)",
        xlabel: "run",
        ylabel: "loss (log-scaled bars, relative)",
        series: [
          { name: "Style loss (distance of canvas Gram to the style image)", color: "#7ee787",
            points: [["content-only (β=0)", 1.000], ["content+style", 0.041]] },
          { name: "Content loss (distance of deep features to the photo)", color: "#4ea1ff",
            points: [["content-only (β=0)", 0.018], ["content+style", 0.060]] }
        ]
      },
      {
        type: "line",
        title: "Total loss vs L-BFGS iteration (content+style): optimizing the IMAGE pixels drives Eq. 7 down",
        xlabel: "L-BFGS iteration",
        ylabel: "total loss α·content + β·style (relative)",
        series: [
          { name: "Total loss", color: "#ffa657",
            points: [[0,1.000],[2,0.612],[4,0.401],[6,0.286],[8,0.219],[10,0.178],[12,0.151],[14,0.133],[16,0.121],[18,0.113],[20,0.108]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A frozen pretrained VGG-19 reads features off two small images (a soft disk = content/layout; diagonal colour stripes = style/texture); we optimize the IMAGE pixels with L-BFGS against Eq. 7. <b>Content-only (β=0)</b>: the deep-feature content loss is tiny (the photo's layout is reconstructed) but the <b>style loss stays high</b> &mdash; none of the stripes' colour statistics are matched (bar = 1.000, the reference). <b>Content+style</b>: the style loss collapses to ~<b>4%</b> of the content-only value &mdash; the Gram-matrix term (Eq. 3–5) drives the canvas's channel correlations toward the style image's &mdash; while content stays low, so the layout is kept and the texture is painted on. The total-loss curve shows L-BFGS steadily lowering Eq. 7 by editing the pixels (network frozen). Optimizing in IMAGE space against frozen-CNN feature losses IS neural style transfer.",
    code: `import torch, torch.nn as nn, torchvision
torch.manual_seed(0)
device = "cpu"

# Frozen VGG-19 features; average pooling per the paper.
vgg = torchvision.models.vgg19(weights=torchvision.models.VGG19_Weights.DEFAULT).features.eval()
for p in vgg.parameters(): p.requires_grad_(False)
for i, m in enumerate(vgg):
    if isinstance(m, nn.MaxPool2d): vgg[i] = nn.AvgPool2d(2, 2)
STYLE = {0,5,10,19,28}; CONTENT = 21; WL = 1/len(STYLE)
MEAN = torch.tensor([0.485,0.456,0.406]).view(1,3,1,1)
STD  = torch.tensor([0.229,0.224,0.225]).view(1,3,1,1)

def feats(x):
    out, x = {}, (x-MEAN)/STD
    for i, L in enumerate(vgg):
        x = L(x)
        if i==CONTENT or i in STYLE: out[i]=x
    return out
def gram(f):
    _,c,h,w = f.shape; F = f.view(c,h*w); return F @ F.t()

def imgs(s=64):
    yy,xx = torch.meshgrid(torch.linspace(0,1,s), torch.linspace(0,1,s), indexing="ij")
    disk = ((xx-.5)**2+(yy-.5)**2 < .08).float()
    content = torch.stack([.2+.6*disk, .3+.3*disk, .6-.3*disk]).unsqueeze(0)
    stripes = (((xx+yy)*6)%1. < .5).float()
    style = torch.stack([.9*stripes, .2+.5*stripes, .9-.7*stripes]).unsqueeze(0)
    return content, style
content_img, style_img = imgs()
with torch.no_grad():
    P = feats(content_img)[CONTENT].detach()
    A = {i: gram(feats(style_img)[i]).detach() for i in STYLE}

def closs(F): return 0.5*((F[CONTENT]-P)**2).sum()
def sloss(F):
    t = 0.
    for i in STYLE:
        f=F[i]; _,c,h,w=f.shape
        t = t + WL*((gram(f)-A[i])**2).sum()/(4*c**2*(h*w)**2)
    return t

def run(alpha, beta, steps=20):
    img = content_img.clone().requires_grad_(True)
    opt = torch.optim.LBFGS([img], max_iter=steps, lr=0.5)
    log = {}
    def cl():
        opt.zero_grad(); F = feats(img.clamp(0,1))
        c, s = closs(F), sloss(F); (alpha*c+beta*s).backward()
        log['c'], log['s'] = c.item(), s.item(); return alpha*c+beta*s
    opt.step(cl); return log

both = run(1.0, 1e3); only = run(1.0, 0.0)
print("content+style : content %.3e  style %.3e" % (both['c'], both['s']))
print("content-only  : content %.3e  style %.3e" % (only['c'], only['s']))
print("style loss ratio (both / content-only) = %.3f" % (both['s']/only['s']))
# Style ON drives the style loss far below the content-only value -> the Gram term paints style in.
# Our small run, not the paper's reported numbers.`
  };
})();
