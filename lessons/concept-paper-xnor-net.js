/* Paper lesson — "XNOR-Net: ImageNet Classification Using Binary Convolutional
   Neural Networks", Rastegari, Ordonez, Redmon, Farhadi, 2016.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-xnor-net".
   GROUNDED from arXiv:1603.05279 (abstract) and the ar5iv HTML mirror
   (Section 3.1 Binary-Weight-Networks: Eqns 2, 4, 6; Section 3.2 XNOR-Networks: Eqns 7, 11).
   Track B (architecture): compose with torch.nn; implement the novel binary-weight
   convolution with the optimal scale alpha = mean(|W|), and the XNOR + popcount
   equivalence for a binary dot product. */
(function () {
  window.LESSONS.push({
    id: "paper-xnor-net",
    title: "XNOR-Net — ImageNet Classification Using Binary Convolutional Neural Networks (2016)",
    tagline: "Replace weights with their signs, but scale by the mean magnitude alpha = mean(|W|) — and convolution becomes XNOR plus popcount.",
    module: "Papers · Efficiency & Compression",
    track: "architecture",
    paper: {
      authors: "Mohammad Rastegari, Vicente Ordonez, Joseph Redmon, Ali Farhadi",
      org: "Allen Institute for AI (AI2) and University of Washington",
      year: 2016,
      venue: "arXiv:1603.05279 (Mar 2016); ECCV 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1603.05279",
      code: "https://github.com/allenai/XNOR-Net"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-conv", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>A trained Convolutional Neural Network (CNN) stores millions of weights as 32-bit floating-point
       numbers, and every convolution is a pile of floating-point multiply-add operations. That is fine on a
       Graphics Processing Unit (GPU) in a data center, but heavy for a phone or an embedded chip: it eats
       memory and battery, and floating-point multiplication is slow on a plain Central Processing Unit (CPU).</p>
       <p>The paper asks a blunt question (&sect;1): what if every weight were just <b>+1 or &minus;1</b>?
       A single bit instead of 32. Memory drops by about 32&times;. And if the <i>inputs</i> are binary too,
       the most expensive part of a convolution &mdash; the multiply-accumulate &mdash; can be done with
       bit operations (<b>XNOR</b> and <b>popcount</b>) instead of floating-point arithmetic.</p>
       <p>The catch is accuracy. Naively rounding each weight to its sign throws away its <i>magnitude</i>,
       and the network falls apart. The paper's contribution is a cheap fix that recovers most of that lost
       magnitude with a single number per filter.</p>`,
    contribution:
      `<ul>
        <li><b>Binary-Weight-Networks.</b> Each real weight filter $W$ is approximated by a binary filter
        $B = \\mathrm{sign}(W)$ times a single positive <b>scaling factor</b> $\\alpha$. The paper derives the
        <i>optimal</i> $\\alpha$ in closed form: $\\alpha = \\mathrm{mean}(|W|)$, the average absolute weight
        (&sect;3.1, Eqn. 6). This one number is what makes binary weights actually work.</li>
        <li><b>XNOR-Networks.</b> Binarize the <i>inputs</i> too. Then a dot product between two sign vectors
        is just an <b>XNOR</b> followed by a <b>popcount</b> (count of set bits), scaled by per-filter and
        per-location factors (&sect;3.2, Eqn. 11). Convolution becomes bitwise.</li>
        <li><b>Real-time CNNs on a CPU.</b> The abstract reports XNOR-Networks give "58x faster convolutional
        operations and 32x memory savings," enabling "running state-of-the-art networks on CPUs (rather than
        GPUs) in real-time."</li>
      </ul>`,
    whyItMattered:
      `<p>XNOR-Net is a landmark in <b>model compression and quantization</b>. It showed that a 1-bit network
       need not be hopeless if you keep a real-valued <i>scale</i>, and the "scale by mean magnitude" trick
       reappears across later quantization work. It is also a clean teaching example of a recurring pattern:
       approximate an expensive operation, then add back the single cheapest correction that recovers most of
       the lost accuracy.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Binary-Weight-Networks)</b> &mdash; the objective $J(B,\\alpha)=\\lVert W-\\alpha B\\rVert^2$
        (Eqn. 2) and the two-line solution: $B=\\mathrm{sign}(W)$ (Eqn. 4) and $\\alpha=\\frac{1}{n}\\lVert W\\rVert_{\\ell 1}=\\mathrm{mean}(|W|)$ (Eqn. 6). This is the whole idea.</li>
        <li><b>&sect;3.2 (XNOR-Networks)</b> &mdash; the binary dot-product objective (Eqn. 7) and the binary
        convolution result $I * W \\approx (\\mathrm{sign}(I) \\circledast \\mathrm{sign}(W)) \\odot K\\alpha$
        (Eqn. 11), where $\\circledast$ is "convolution using XNOR and bitcount operations."</li>
        <li><b>Fig. 2</b> &mdash; the block diagram showing where the binarization and the scales sit.</li>
       </ul>
       <p><b>Skim:</b> the full network-training procedure (binarize on the forward pass, keep real-valued
       weights for the gradient update) and the exact ImageNet tables unless you want the headline numbers.
       The math you must own is three short equations in &sect;3.1.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Take a real convolution filter $W$ and approximate it two ways. Method A: just take the sign of every
       weight, $\\mathrm{sign}(W)$ (values become $\\pm1$). Method B: take the sign <b>and</b> multiply by one
       positive number $\\alpha$, the average absolute weight. Both keep only 1 bit per weight; B adds a single
       shared scale.</p>
       <p>Which approximation is closer to the original $W$ &mdash; and by how much? Write a guess for the
       relative error of each, then run the panel below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the binary-weight convolution you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>alpha = W.abs().mean(dim=(1,2,3), keepdim=True)</code>  <i># Eqn. 6, one scale per output filter</i></li>
        <li><code>B = torch.sign(W)</code>  <i># Eqn. 4, the binary filter (+1 / -1)</i></li>
        <li>TODO: convolve the input with the <b>binary</b> filter, then multiply the result by <code>alpha</code>
        &mdash; <code>out = F.conv2d(x, B, ...) * alpha</code>. This is $\\alpha\\,(I * B)$.</li>
        <li>TODO: compare to the full-precision <code>F.conv2d(x, W, ...)</code> and to the <b>naive</b> version
        with no scale (<code>alpha = 1</code>). Predict which is closest.</li>
       </ul>
       <p>Then write the XNOR check: encode $\\pm1$ as bits ($+1\\to1$, $-1\\to0$), and verify that a sign-vector
       dot product equals <code>2 * popcount(XNOR) - n</code>.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>Step 1 &mdash; binary weights with a scale (&sect;3.1).</b> Take one weight filter and flatten it to
       a vector $W$ with $n$ entries. We want to replace it by a binary vector $B$ (each entry $+1$ or
       $-1$) times one positive scalar $\\alpha$, so that $W \\approx \\alpha B$. "Best" means minimizing the
       squared error</p>
       <p>$$ J(B,\\alpha) = \\lVert W - \\alpha B \\rVert^2 \\qquad\\text{(Eqn. 2).} $$</p>
       <p>Expand it: $J = \\alpha^2\\, B^{\\top}B - 2\\alpha\\, W^{\\top}B + W^{\\top}W$. Since every entry of $B$
       is $\\pm1$, $B^{\\top}B = n$ is fixed, and $W^{\\top}W$ does not depend on $B$ or $\\alpha$. So minimizing
       $J$ over $B$ is the same as <b>maximizing</b> $W^{\\top}B$ (Eqn. 4). Each term $W_i B_i$ is largest when
       $B_i$ has the same sign as $W_i$, so</p>
       <p>$$ B = \\mathrm{sign}(W). $$</p>
       <p><b>Step 2 &mdash; the optimal scale (&sect;3.1).</b> With $B$ fixed, $J$ is a simple upward parabola in
       $\\alpha$. Set the derivative to zero: $\\frac{\\partial J}{\\partial \\alpha} = 2\\alpha n - 2 W^{\\top}B = 0$,
       so $\\alpha = W^{\\top}B / n$. Plugging in $B = \\mathrm{sign}(W)$ gives $W^{\\top}\\mathrm{sign}(W) = \\sum_i |W_i|$,
       hence</p>
       <p>$$ \\alpha = \\frac{1}{n}\\sum_i |W_i| = \\mathrm{mean}(|W|) \\qquad\\text{(Eqn. 6).} $$</p>
       <p>In plain English: <b>the best scale is the average magnitude of the weights.</b> It rescales the
       $\\pm1$ filter so its overall "size" matches the original. This single number is the difference between
       a binary net that works and one that does not.</p>
       <p><b>Step 3 &mdash; binarize the inputs too (&sect;3.2).</b> If the input patch $X$ is also approximated as
       $\\beta\\,\\mathrm{sign}(X)$ with its own positive scale $\\beta$, then a dot product of the real vectors
       becomes a dot product of two sign vectors times $\\beta\\alpha$:</p>
       <p>$$ X^{\\top}W \\approx \\beta\\alpha\\,\\big(\\mathrm{sign}(X)^{\\top}\\mathrm{sign}(W)\\big). $$</p>
       <p>A dot product of two $\\pm1$ vectors counts agreements minus disagreements. Encode $+1$ as bit $1$ and
       $-1$ as bit $0$. Then "agree" is exactly the <b>XNOR</b> of the two bits, and counting agreements is a
       <b>popcount</b> (number of $1$ bits). If $p$ bits agree out of $n$, the dot product is
       $p - (n-p) = 2p - n$. So the costly multiply-accumulate collapses to one XNOR and one popcount, then a
       scale. Over a whole feature map this is the binary convolution (Eqn. 11):</p>
       <p>$$ I * W \\approx (\\mathrm{sign}(I) \\circledast \\mathrm{sign}(W)) \\odot K\\alpha, $$</p>
       <p>where $\\circledast$ is convolution done with XNOR and bitcount, and $K$ holds the per-location input
       scales $\\beta$.</p>`,
    architecture:
      `<p>The novel building block is a single <b>binarized convolutional layer</b>, plus a deliberate
       <b>reordering</b> of the operations inside a CNN block (§3.2, "Block Structure", Fig. 1).</p>
       <p><b>A normal CNN block</b> runs the operations in this order:</p>
       <p style="text-align:center"><code>Convolution &rarr; BatchNorm &rarr; Activation &rarr; Pooling</code></p>
       <p><b>An XNOR-Net block</b> reorders them to <code>B&ndash;A&ndash;C&ndash;P</code>:</p>
       <p style="text-align:center"><code>BatchNorm &rarr; BinActiv (binarize input) &rarr; BinConv (binary convolution) &rarr; Pooling</code></p>
       <p>Two reasons for the reorder:</p>
       <ul>
        <li><b>BatchNorm first.</b> Normalizing to zero mean before binarizing means thresholding at $0$ (the
        sign function) splits the data near its center, so fewer values are misclassified by the sign &mdash;
        less quantization error.</li>
        <li><b>Pooling last (after the convolution), not on binary values.</b> Max-pooling a $\\pm1$ tensor is
        nearly useless: most windows contain a $+1$, so the pooled output is almost all $+1$ and information is
        lost. Pooling the real-valued convolution output instead keeps that information.</li>
       </ul>
       <p><b>Inside the binarized layer (the data flow):</b></p>
       <ol>
        <li><b>BatchNorm</b> the real input feature map $I$ (channels $c$, spatial $w\\times h$).</li>
        <li><b>Binarize the input:</b> $\\mathrm{sign}(I)$ gives a $\\pm1$ tensor; separately compute the
        per-location input scales $K = A * k$ from $A=\\tfrac{1}{c}\\sum_i|I_{:,:,i}|$ (Eqn. 11 setup). $K$ is
        computed <i>once</i> and reused across all output filters.</li>
        <li><b>Binarize the weights:</b> $B=\\mathrm{sign}(W)$ (Eqn. 4) with one scale $\\alpha=\\mathrm{mean}(|W|)$
        per output filter (Eqn. 6). These are stored as 1 bit each (32&times; memory saving).</li>
        <li><b>Binary convolution:</b> slide $\\mathrm{sign}(W)$ over $\\mathrm{sign}(I)$ using
        <b>XNOR + popcount</b> ($\\circledast$) instead of multiply-add, then multiply by $K\\alpha$
        (Eqn. 11). The expensive inner product is now bit operations &mdash; the source of the $58\\times$
        speedup.</li>
        <li><b>Pool</b> the real-valued result, then feed the next block.</li>
       </ol>
       <p>Stacking these blocks turns a standard network (the paper uses AlexNet and ResNet-18 on ImageNet)
       into a binary network. Training keeps a <b>real-valued copy</b> of every weight: the forward pass
       binarizes, but gradients update the underlying floats (a straight-through estimator), because
       $\\mathrm{sign}$ has zero gradient almost everywhere.</p>`,
    symbols: [
      { sym: "$W$", desc: "the <b>real-valued weight filter</b>, flattened to a vector of $n$ numbers." },
      { sym: "$n$", desc: "the <b>number of weights</b> in the filter (its length once flattened)." },
      { sym: "$B$", desc: "the <b>binary filter</b>: each entry is $+1$ or $-1$. The paper's optimal choice is $B=\\mathrm{sign}(W)$." },
      { sym: "$\\mathrm{sign}(\\cdot)$", desc: "the <b>sign function</b>: returns $+1$ for a positive number and $-1$ for a negative one. Throws away magnitude, keeps direction." },
      { sym: "$\\alpha$", desc: "the <b>weight scaling factor</b>: one positive number per filter that rescales $B$ back toward $W$. Optimal value is $\\mathrm{mean}(|W|)$." },
      { sym: "$|W_i|$", desc: "the <b>absolute value</b> (magnitude, sign removed) of weight $i$." },
      { sym: "$\\mathrm{mean}(|W|)$", desc: "the <b>average of the absolute weights</b>: add up $|W_i|$ for all $i$ and divide by $n$." },
      { sym: "$J(B,\\alpha)$", desc: "the <b>reconstruction error</b> being minimized: the squared distance $\\lVert W-\\alpha B\\rVert^2$ between the real filter and its scaled binary copy." },
      { sym: "$\\lVert\\cdot\\rVert^2$", desc: "the <b>squared length</b> of a vector: the sum of the squares of its entries." },
      { sym: "$\\lVert W\\rVert_{\\ell 1}$", desc: "the <b>L1 norm</b> of $W$: the sum of the absolute values, $\\sum_i |W_i|$. So $\\alpha=\\tfrac{1}{n}\\lVert W\\rVert_{\\ell 1}$." },
      { sym: "$W^{\\top}B$", desc: "the <b>dot product</b> of $W$ and $B$: multiply entry by entry and add up." },
      { sym: "$X$", desc: "the <b>input patch</b> (the slice of the input a filter sees), as a real-valued vector." },
      { sym: "$\\beta$", desc: "the <b>input scaling factor</b>: the average magnitude of the input patch, the input's analogue of $\\alpha$." },
      { sym: "$\\circledast$", desc: "<b>binary convolution</b>: the same sliding dot product as normal convolution, but computed with XNOR and bitcount instead of floating-point multiply-add." },
      { sym: "$\\odot$", desc: "<b>element-wise multiply</b> (the Hadamard product): multiply two arrays position by position." },
      { sym: "$K$", desc: "the array of <b>per-location input scales</b> $\\beta$, one per output position, computed by averaging absolute input values over each window." },
      { sym: "$\\oplus$", desc: "<b>multiplication-free convolution</b> (Eqn. 1): convolution with a $\\pm1$ filter, so each multiply becomes an add or subtract." },
      { sym: "$I$", desc: "the <b>full input feature map</b> to a layer: a tensor with $c$ channels and spatial size $w\\times h$. ($X$ is one flattened patch of it.)" },
      { sym: "$H$", desc: "the <b>binary input sign vector</b>, $H=\\mathrm{sign}(X)$: the input's analogue of $B$ (each entry $\\pm1$)." },
      { sym: "$C$", desc: "the <b>elementwise sign-product</b> $\\mathrm{sign}(X)\\odot\\mathrm{sign}(W)=H\\odot B$ (Eqn. 9): the binary part of the input&times;weight approximation." },
      { sym: "$\\gamma$", desc: "the <b>combined scale</b> $\\gamma=\\beta\\alpha$ (Eqn. 10): the product of the input scale $\\beta$ and the weight scale $\\alpha$." },
      { sym: "$A$", desc: "the <b>channel-averaged absolute input</b>, $A=\\tfrac{1}{c}\\sum_i|I_{:,:,i}|$: a 2D map of the average input magnitude across channels." },
      { sym: "$k$", desc: "the <b>averaging filter</b> with every entry $k_{ij}=1/(wh)$: convolving $A$ with it spreads the input scale over each window to build $K$." },
      { sym: "$c$", desc: "the <b>number of input channels</b> of the feature map." },
      { sym: "$w, h$", desc: "the <b>width and height</b> of the convolution window (so $N_W = wh$ for a single channel)." },
      { sym: "$S$", desc: "the <b>speedup factor</b> $S=\\tfrac{64\\,cN_W}{cN_W+64}$: how much faster the bitwise convolution is than floating-point ($\\approx 62.27\\times$ theory, $58\\times$ measured)." },
      { sym: "$N_W, N_I$", desc: "the <b>number of weight elements per filter</b> ($N_W$) and <b>output locations</b> ($N_I$) — they count the operations in the speedup formula." },
      { sym: "XNOR", desc: "a plain term, not a symbol: a bit operation that returns $1$ when its two input bits are <b>equal</b>, else $0$ &mdash; it detects sign agreement." },
      { sym: "popcount", desc: "a plain term: <b>population count</b>, the number of $1$ bits in a value &mdash; used here to count how many signs agreed." }
    ],
    formula:
      `<p>$$ I * W \\approx (I \\oplus B)\\,\\alpha \\qquad\\text{(§3.1, Eqn. 1)} $$</p>
       <p>The whole binary-weight idea in one line: a real convolution is approximated by a multiplication-free convolution $\\oplus$ with a $\\pm1$ filter $B$, then a single scale $\\alpha$.</p>
       <p>$$ J(B,\\alpha) = \\lVert W - \\alpha B \\rVert^2 \\qquad\\text{(§3.1, Eqn. 2)} $$</p>
       <p>The objective: pick the binary filter $B$ and one positive scale $\\alpha$ that best reconstruct the real filter $W$ in squared error.</p>
       <p>$$ B^{*} = \\operatorname*{arg\\,max}_{B}\\,\\{W^{\\top}B\\}\\;\\;\\text{s.t. } B\\in\\{+1,-1\\}^{n} \\;\\;\\Longrightarrow\\;\\; B^{*} = \\mathrm{sign}(W) \\qquad\\text{(§3.1, Eqn. 4)} $$</p>
       <p>The optimal binary filter is just the elementwise sign of $W$: matching signs maximizes the overlap $W^{\\top}B$, which is what minimizing the error reduces to.</p>
       <p>$$ \\alpha^{*} = \\frac{1}{n}\\lVert W\\rVert_{\\ell 1} = \\mathrm{mean}(|W|) \\qquad\\text{(§3.1, Eqn. 6)} $$</p>
       <p>The optimal scale is the average absolute weight — the cheapest possible correction (one number per filter) and provably the best one.</p>
       <p>$$ \\lVert X\\odot W - \\beta\\alpha\\,H\\odot B\\rVert \\;\\;\\text{minimized over } H,B\\in\\{+1,-1\\}^{n},\\;\\beta,\\alpha\\in\\mathbb{R}^{+} \\qquad\\text{(§3.2, Eqn. 7)} $$</p>
       <p>Binarize the input too: approximate the elementwise product $X\\odot W$ by two sign vectors $H,B$ times two scales $\\beta$ (input) and $\\alpha$ (weight).</p>
       <p>$$ C^{*} = \\mathrm{sign}(X)\\odot\\mathrm{sign}(W) = H^{*}\\odot B^{*}, \\qquad \\gamma^{*} \\approx \\Big(\\tfrac{1}{n}\\lVert X\\rVert_{\\ell 1}\\Big)\\Big(\\tfrac{1}{n}\\lVert W\\rVert_{\\ell 1}\\Big) = \\beta^{*}\\alpha^{*} \\qquad\\text{(§3.2, Eqns. 9–10)} $$</p>
       <p>Solving Eqn. 7: the optimal signs are the two sign vectors, and the optimal combined scale is the product of the two mean magnitudes $\\beta^{*}\\alpha^{*}$.</p>
       <p>$$ I * W \\approx \\big(\\mathrm{sign}(I) \\circledast \\mathrm{sign}(W)\\big) \\odot K\\alpha \\qquad\\text{(§3.2, Eqn. 11)} $$</p>
       <p>The full XNOR convolution: $\\circledast$ is convolution done with <b>XNOR + bitcount (popcount)</b> instead of floating-point multiply-add; $K$ holds the per-location input scales $\\beta$ and $\\alpha$ the weight scale.</p>
       <p>$$ A = \\frac{1}{c}\\sum_{i}|I_{:,:,i}|,\\qquad K = A * k,\\quad k_{ij}=\\frac{1}{wh} \\qquad\\text{(§3.2, how } K \\text{ is built)} $$</p>
       <p>$K$ is computed once per layer: average the absolute input across the $c$ channels to get $A$, then convolve with an averaging filter $k$ (all entries $1/(wh)$) so each output location gets its own input scale $\\beta$.</p>
       <p>$$ S = \\frac{c\\,N_{W}N_{I}}{\\tfrac{1}{64}c\\,N_{W}N_{I} + N_{I}} = \\frac{64\\,c\\,N_{W}}{c\\,N_{W} + 64} \\qquad\\text{(§3.2, speedup)} $$</p>
       <p>The speedup argument: a CPU does 64 binary ops per clock, so the bitwise convolution is $\\approx 64\\times$ cheaper per operation. With $c=256$ channels and a $3\\times3$ filter ($N_{W}=9$) this gives a theoretical $62.27\\times$, and the paper measures $58\\times$ in one convolution. Memory drops $32\\times$ (1 bit per weight instead of a 32-bit float).</p>`,
    whatItDoes:
      `<p><b>Equation 2</b> states the goal: find the binary filter $B$ and the single scale $\\alpha$ whose
       scaled product $\\alpha B$ is as close as possible (in squared error) to the real filter $W$.</p>
       <p><b>Equation 4</b> solves for $B$: take the sign of each weight. Matching the sign maximizes the
       overlap $W^{\\top}B$, which is what minimizing the error reduces to.</p>
       <p><b>Equation 6</b> solves for $\\alpha$: it is the average absolute weight, $\\mathrm{mean}(|W|)$.
       This is the cheapest possible correction &mdash; one number &mdash; and it is provably the best scale.
       Without it (i.e. $\\alpha=1$, plain $\\mathrm{sign}(W)$) the approximation is far worse, which the CODEVIZ
       panel makes concrete.</p>`,
    derivation:
      `<p>The whole derivation is short, so here it is in full (this lesson has no separate concept owner).
       Start from Eqn. 2 and expand the squared norm:</p>
       <p>$$ J(B,\\alpha) = \\lVert W-\\alpha B\\rVert^2 = W^{\\top}W - 2\\alpha\\, W^{\\top}B + \\alpha^2\\, B^{\\top}B. $$</p>
       <p><b>Solve for $B$.</b> Every entry of $B$ is $\\pm1$, so $B^{\\top}B = n$ is a constant, and $W^{\\top}W$
       has no $B$ in it. The only $B$-dependent term is $-2\\alpha\\,W^{\\top}B$. With $\\alpha\\gt0$, minimizing
       $J$ means <b>maximizing</b> $W^{\\top}B = \\sum_i W_i B_i$ (Eqn. 4). Each product $W_i B_i$ is biggest when
       $B_i$ shares the sign of $W_i$, so the maximizer is $B = \\mathrm{sign}(W)$.</p>
       <p><b>Solve for $\\alpha$.</b> Fix $B=\\mathrm{sign}(W)$. Now $J(\\alpha) = n\\alpha^2 - 2\\alpha\\,W^{\\top}B + W^{\\top}W$
       is an upward parabola in $\\alpha$. Differentiate and set to zero:</p>
       <p>$$ \\frac{\\partial J}{\\partial \\alpha} = 2n\\alpha - 2\\,W^{\\top}B = 0 \\;\\Longrightarrow\\; \\alpha = \\frac{W^{\\top}B}{n}. $$</p>
       <p>Finally $W^{\\top}\\mathrm{sign}(W) = \\sum_i W_i\\,\\mathrm{sign}(W_i) = \\sum_i |W_i|$, because a number
       times its own sign is its absolute value. Dividing by $n$ gives Eqn. 6:
       $\\alpha = \\frac{1}{n}\\sum_i |W_i| = \\mathrm{mean}(|W|)$. The mean magnitude is the best scale.</p>`,
    example:
      `<p>Work the formula on a tiny filter so the numbers are checkable. Let
       $W = [\\,0.8,\\,-0.5,\\,0.3,\\,-0.9,\\,0.2,\\,-0.4\\,]$, so $n = 6$.</p>
       <ul class="steps">
        <li><b>Binary filter</b> (Eqn. 4): $B = \\mathrm{sign}(W) = [\\,+1,\\,-1,\\,+1,\\,-1,\\,+1,\\,-1\\,]$.</li>
        <li><b>Optimal scale</b> (Eqn. 6): sum of magnitudes is
        $0.8+0.5+0.3+0.9+0.2+0.4 = 3.1$. Divide by $n=6$:
        $\\alpha = 3.1 / 6 = 0.51\\overline{6}$.</li>
        <li><b>Error WITH the scale.</b> $\\alpha B = [\\,0.5167,\\,-0.5167,\\,0.5167,\\,-0.5167,\\,0.5167,\\,-0.5167\\,]$.
        Squared error $\\lVert W-\\alpha B\\rVert^2 \\approx (0.283)^2+(0.017)^2+(0.217)^2+(0.383)^2+(0.317)^2+(0.117)^2 \\approx 0.388$.</li>
        <li><b>Error WITHOUT the scale</b> (naive sign, $\\alpha=1$): $\\lVert W-\\mathrm{sign}(W)\\rVert^2
        = (0.2)^2+(0.5)^2+(0.7)^2+(0.1)^2+(0.8)^2+(0.6)^2 = 1.79$.</li>
        <li><b>Verdict.</b> The scaled version's error $0.388$ is about <b>4.6&times; smaller</b> than the naive
        $1.79$. The one number $\\alpha=\\mathrm{mean}(|W|)$ did that.</li>
       </ul>
       <p>These exact values ($\\alpha=0.5167$, errors $0.388$ vs $1.79$) are recomputed in the notebook's first
       cell so you can check them by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Binary-weight conv.</b> Given a real filter $W$: compute one scale per output filter
        $\\alpha = \\mathrm{mean}(|W|)$ (Eqn. 6) and the binary filter $B=\\mathrm{sign}(W)$ (Eqn. 4). The
        approximate convolution is $\\alpha\\,(I * B)$ &mdash; convolve with the $\\pm1$ filter, then scale.</li>
        <li><b>Wrap it as an <code>nn.Module</code></b> that holds a real-valued weight, binarizes it on the
        forward pass, and applies the scale. Keep the real weight for training; binarize only when running.</li>
        <li><b>XNOR check.</b> For a dot product of two sign vectors, encode $+1\\to1$, $-1\\to0$, and verify
        $\\text{dot} = 2\\cdot\\mathrm{popcount}(\\mathrm{XNOR}) - n$ &mdash; the bitwise route to the same answer.</li>
        <li><b>Ablate the scale.</b> Compare reconstruction error of $\\alpha\\,\\mathrm{sign}(W)$ versus plain
        $\\mathrm{sign}(W)$ on a real weight tensor. The scaled version wins &mdash; that is the paper's point.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "The classification accuracy with a Binary-Weight-Network version of
       AlexNet is only 2.9% less than the full-precision AlexNet (in top-1 measure)." XNOR-Networks give
       "58x faster convolutional operations and 32x memory savings," and on ImageNet "outperform" earlier
       binary methods (BinaryConnect, BinaryNet) "by large margins &hellip; more than 16% in top-1 accuracy."</p>
       <p><i>These are the paper's reported figures, quoted from the abstract. The numbers in the CODEVIZ panel
       below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> Two layers of evaluation. (1) For the <i>building block</i>: the
       <b>relative reconstruction error</b> $\\lVert W-\\alpha B\\rVert/\\lVert W\\rVert$ of a binarized filter
       &mdash; cheap, deterministic, and the thing the lesson measures. The "no-skill" baseline is plain
       $\\mathrm{sign}(W)$ with $\\alpha=1$ (magnitude thrown away); the scaled version must beat it. (2) For the
       <i>network</i>: ImageNet <b>top-1 / top-5 accuracy</b>, the paper's own benchmark on AlexNet and
       ResNet-18, with full-precision accuracy as the ceiling and random ($1/1000$) as the floor.</p>
       <p><b>Sanity checks before any training run.</b></p>
       <ul>
         <li><b>Known-answer unit test (the worked example).</b> For $W=[0.8,-0.5,0.3,-0.9,0.2,-0.4]$ verify
         $\\alpha=\\mathrm{mean}(|W|)=3.1/6\\approx0.5167$, squared error <b>$0.388$ with the scale</b> vs
         <b>$1.79$ without</b> (Eqns. 4, 6). If these don't match, the scale formula is wrong.</li>
         <li><b>XNOR/popcount identity.</b> On a small $\\pm1$ vector confirm the bitwise route equals the float
         dot product: $\\text{dot}=2\\cdot\\mathrm{popcount}(\\mathrm{XNOR})-n$ (encode $+1\\to1,-1\\to0$). A
         flipped mapping flips the sign &mdash; catch it here.</li>
         <li><b>Shape/scale checks.</b> $\\alpha$ is computed <i>per output filter</i>
         (<code>W.abs().mean(dim=(1,2,3))</code>), so it has one entry per output channel and every entry is
         $\\gt0$; $B=\\mathrm{sign}(W)$ contains only $\\pm1$.</li>
         <li><b>$\\alpha$ is the minimizer.</b> Sweep $\\alpha$ around $\\mathrm{mean}(|W|)$ and confirm the
         reconstruction error is a parabola bottoming exactly there (any other scale, including $1.0$, is strictly
         worse &mdash; Eqn. 6).</li>
       </ul>
       <p><b>Expected range.</b> For the block, the scaled binary filter should beat naive sign (our toy CODEVIZ
       run: relative error $0.6704$ for plain sign $\\to0.6104$ one global $\\alpha\\to0.6006$ per-filter
       $\\alpha$ &mdash; our own small numbers, not the paper's). For the full network the anchor is the abstract:
       a Binary-Weight-Network AlexNet is <b>only 2.9% below full-precision top-1</b>, and XNOR-Networks beat
       BinaryConnect/BinaryNet by <b>more than 16% top-1</b> on ImageNet (arXiv:1603.05279, abstract). Rule of
       thumb (not a paper claim): binary-weight (real inputs) should land within a few % of full precision; the
       fully-binary XNOR variant drops more &mdash; a much larger gap means a bug, not just quantization cost.</p>
       <p><b>Ablation &mdash; prove the scale earns its keep.</b> The paper's central knob is the per-filter
       $\\alpha=\\mathrm{mean}(|W|)$. Turn it OFF (set $\\alpha=1$, i.e. plain $\\mathrm{sign}(W)$) and the
       reconstruction error must <b>rise</b> (our run: $0.60\\to0.67$); end-to-end, accuracy must drop. If killing
       $\\alpha$ changes nothing, the scale isn't actually being applied in the forward pass. Second ablation:
       per-filter vs one global $\\alpha$ &mdash; per-filter should be at least as good.</p>
       <p><b>Failure signals &amp; what they mean.</b></p>
       <ul>
         <li><b>Accuracy near random ($\\approx0.1\\%$ on ImageNet) / loss not falling</b> &rarr; magnitude lost:
         $\\alpha$ dropped or applied as a global scalar where per-filter is needed, or sign convention flipped.</li>
         <li><b>Reconstruction error doesn't improve over plain sign</b> &rarr; $\\alpha$ computed but not
         multiplied back in, or computed over the wrong dims.</li>
         <li><b>Training won't learn / gradients all zero</b> &rarr; you back-propagated through
         $\\mathrm{sign}$ (zero gradient almost everywhere); you must keep a real-valued weight and use the
         straight-through estimator, binarizing only inside <code>forward</code>.</li>
         <li><b>XNOR dot product off by a constant</b> &rarr; wrong bit encoding ($+1\\to1,-1\\to0$ required) or
         using $\\mathrm{popcount}$ alone instead of $2\\cdot\\mathrm{popcount}-n$.</li>
         <li><b>Expected 58&times; speedup not seen</b> &rarr; that figure needs a real bit-packed XNOR kernel; a
         float <code>conv2d</code> on a $\\pm1$ filter shows the <i>accuracy</i> effect only, not wall-clock time.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the convolution primitive ships in PyTorch, so you
       <b>import</b> it and implement only the novel binarization. <b>Import:</b>
       <code>torch.nn.functional.conv2d</code> / <code>nn.Conv2d</code>, <code>torch.sign</code>,
       <code>torch.norm</code>. <b>Build by hand:</b> the scale $\\alpha=\\mathrm{mean}(|W|)$ (Eqn. 6), the binary
       filter $B=\\mathrm{sign}(W)$ (Eqn. 4), the binary-weight convolution $\\alpha\\,(I*B)$, the XNOR + popcount
       equivalence for a binary dot product, and the <b>ablation</b> that drops the scale. The closed-form
       derivation of $\\alpha$ is given in full above &mdash; this lesson has no separate concept owner.</p>`,
    pitfalls:
      `<ul>
        <li><b>Dropping the scale.</b> Plain $\\mathrm{sign}(W)$ with no $\\alpha$ destroys magnitude and the
        approximation error explodes (our run: relative error $0.67$ vs $0.60$ with the scale). <b>Fix:</b>
        always multiply by $\\alpha=\\mathrm{mean}(|W|)$.</li>
        <li><b>One global scale instead of per-filter.</b> The paper computes $\\alpha$ <i>per filter</i> (one
        number per output channel), not one number for the whole tensor. Per-filter is at least as good and
        usually better. <b>Fix:</b> <code>W.abs().mean(dim=(1,2,3), keepdim=True)</code>.</li>
        <li><b>Forgetting to keep real weights for training.</b> $\\mathrm{sign}$ has zero gradient almost
        everywhere, so you cannot back-propagate through it directly. The paper binarizes on the forward pass
        but updates the underlying <i>real-valued</i> weights (a straight-through estimator). <b>Fix:</b> store
        a float weight; binarize only inside <code>forward</code>.</li>
        <li><b>Sign convention in the XNOR trick.</b> The bit encoding must be $+1\\to1$, $-1\\to0$; then
        agreements are XNOR and the dot product is $2\\cdot\\mathrm{popcount}-n$. Mixing up the mapping flips the
        sign. <b>Fix:</b> test on a small vector against the plain $\\pm1$ dot product.</li>
        <li><b>Expecting 58&times; speed in PyTorch.</b> The 58&times; figure needs a real bit-packed XNOR
        kernel; a float <code>conv2d</code> on a $\\pm1$ filter shows the <i>accuracy</i> effect, not the speed.
        Our CODEVIZ measures approximation error, not wall-clock time.</li>
      </ul>`,
    recall: [
      "Write the optimal scale $\\alpha$ from memory (Eqn. 6).",
      "Why is $B=\\mathrm{sign}(W)$ the best binary filter?",
      "For a dot product of two $\\pm1$ vectors, express it using popcount of an XNOR.",
      "Why does plain $\\mathrm{sign}(W)$ without $\\alpha$ approximate $W$ so poorly?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a real conv weight tensor. Approximate it as $\\alpha\\,\\mathrm{sign}(W)$
            with $\\alpha=\\mathrm{mean}(|W|)$, and also as plain $\\mathrm{sign}(W)$ (set $\\alpha=1$). Compare the
            reconstruction error. What does the gap show?`,
        steps: [
          { do: `Compute the per-filter scale <code>alpha = W.abs().mean(dim=(1,2,3), keepdim=True)</code> (Eqn. 6) and the binary filter <code>B = torch.sign(W)</code>.`, why: `These are the paper's optimal $\\alpha$ and $B$ &mdash; the scaled binary copy $\\alpha B$ of the real filter.` },
          { do: `Measure relative error <code>norm(W - alpha*B)/norm(W)</code>, then again with <code>alpha=1</code>.`, why: `The only change is the scale, so any difference is attributable to $\\alpha$ alone &mdash; an honest ablation.` },
          { do: `Observe the scaled version's error is smaller (our run: ~0.60 vs ~0.67).`, why: `The mean-magnitude scale rebuilds the filter's overall size that plain sign threw away.` }
        ],
        answer: `<p>The scaled binary filter has lower reconstruction error than plain $\\mathrm{sign}(W)$ (our
                 small run: relative error ~0.60 with the scale vs ~0.67 without). Since the only difference is
                 $\\alpha=\\mathrm{mean}(|W|)$, this isolates the scale as the reason binary weights approximate the
                 real filter well &mdash; exactly the paper's claim. It is one number per filter, and it is the
                 provably optimal one.</p>`
      },
      {
        q: `Two sign vectors $x=[+1,-1,-1,+1]$ and $w=[+1,+1,-1,-1]$. Compute their dot product the normal way,
            then via XNOR and popcount, and show they agree.`,
        steps: [
          { do: `Normal dot product: $x^{\\top}w = (1)(1)+(-1)(1)+(-1)(-1)+(1)(-1) = 1-1+1-1 = 0$.`, why: `A $\\pm1$ dot product counts agreements minus disagreements; here 2 agree, 2 disagree, net 0.` },
          { do: `Encode $+1\\to1$, $-1\\to0$: $x_b=[1,0,0,1]$, $w_b=[1,1,0,0]$. XNOR (equal bits): $[1,0,1,0]$, popcount $=2$.`, why: `XNOR returns 1 exactly where the signs agree; popcount counts those agreements ($p=2$).` },
          { do: `Recover the dot product: $2p - n = 2\\cdot2 - 4 = 0$. Matches.`, why: `With $p$ agreements out of $n$, agreements minus disagreements is $p-(n-p)=2p-n$.` }
        ],
        answer: `<p>Both routes give $0$. The bitwise route &mdash; XNOR then popcount then $2p-n$ &mdash; reproduces
                 the floating-point dot product exactly, with no multiplications. That is why XNOR-Networks can do
                 the convolution's multiply-accumulate as bit operations (&sect;3.2).</p>`
      },
      {
        q: `Your worked example had $W=[0.8,-0.5,0.3,-0.9,0.2,-0.4]$ with $\\alpha=0.5167$ giving squared error
            $0.388$, while naive sign gave $1.79$. Suppose someone "improves" things by using $\\alpha=1.0$
            instead. Does the error go up or down, and why is $\\mathrm{mean}(|W|)$ special?`,
        steps: [
          { do: `Compute error at $\\alpha=1$: $\\lVert W-\\mathrm{sign}(W)\\rVert^2 = 1.79$ (the naive case).`, why: `$\\alpha=1$ is exactly plain sign with no rescaling.` },
          { do: `Recall $J(\\alpha)=n\\alpha^2-2\\alpha\\sum|W_i|+\\sum W_i^2$ is an upward parabola minimized at $\\alpha=\\frac{1}{n}\\sum|W_i|$.`, why: `Eqn. 6: any $\\alpha$ other than the mean magnitude gives a strictly larger error.` },
          { do: `So $\\alpha=1$ (here $1.79$) is worse than $\\alpha=0.5167$ (here $0.388$).`, why: `$0.5167$ sits at the bottom of the parabola; moving away to $1.0$ climbs back up the curve.` }
        ],
        answer: `<p>The error goes <b>up</b> at $\\alpha=1.0$ (back to $1.79$). The error as a function of $\\alpha$
                 is an upward parabola whose minimum is at $\\alpha=\\mathrm{mean}(|W|)=0.5167$ (Eqn. 6). Any other
                 scale &mdash; including $1.0$ &mdash; is strictly worse. That is what "optimal" means here: not just
                 a heuristic, but the exact minimizer of the reconstruction error.</p>`
      }
    ]
  });

  window.CODE["paper-xnor-net"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>import</b> <code>F.conv2d</code> and build only the novel binarization. A
       <code>BinaryWeightConv2d</code> module holds a real weight, then on the forward pass computes the scale
       $\\alpha=\\mathrm{mean}(|W|)$ per filter (Eqn. 6), the binary filter $B=\\mathrm{sign}(W)$ (Eqn. 4), and
       returns $\\alpha\\,(I * B)$. We print the relative error of three approximations of a real weight tensor
       &mdash; naive sign, one global scale, and the paper's per-filter scale &mdash; so the scaled versions
       beat naive sign. The first cell recomputes the worked example ($\\alpha=0.5167$, errors $0.388$ vs
       $1.79$). A final cell verifies the XNOR + popcount equivalence $\\text{dot}=2\\,\\mathrm{popcount}-n$.
       Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# --- 0. Sanity-check the worked example: alpha = mean(|W|), error with vs without scale. ---
W6 = torch.tensor([0.8, -0.5, 0.3, -0.9, 0.2, -0.4])
B6 = torch.sign(W6)
alpha6 = W6.abs().mean()                       # Eqn. 6
err_scaled = ((W6 - alpha6 * B6) ** 2).sum()   # ||W - alpha*sign(W)||^2
err_naive  = ((W6 - B6) ** 2).sum()            # ||W - sign(W)||^2  (alpha = 1)
print("worked example:  alpha =", round(alpha6.item(), 4),
      " err(scaled) =", round(err_scaled.item(), 4),
      " err(naive) =", round(err_naive.item(), 4))
# worked example:  alpha = 0.5167  err(scaled) = 0.3883  err(naive) = 1.79


# --- 1. Binary-weight convolution as an nn.Module (Eqns 4 and 6). ---
class BinaryWeightConv2d(nn.Module):
    def __init__(self, in_ch, out_ch, k=3, stride=1, padding=1, binarize=True):
        super().__init__()
        self.weight   = nn.Parameter(torch.randn(out_ch, in_ch, k, k) * 0.1)
        self.stride   = stride
        self.padding  = padding
        self.binarize = binarize

    def forward(self, x):
        W = self.weight
        if not self.binarize:                          # full-precision baseline
            return F.conv2d(x, W, stride=self.stride, padding=self.padding)
        alpha = W.abs().mean(dim=(1, 2, 3), keepdim=True)   # Eqn. 6: one scale per filter
        B     = torch.sign(W)                               # Eqn. 4: the +/-1 filter
        out   = F.conv2d(x, B, stride=self.stride, padding=self.padding)
        return out * alpha.view(1, -1, 1, 1)                # alpha * (I * B)


# --- 2. Approximation error of a real conv weight tensor: which binarization is closest? ---
W = torch.randn(8, 4, 3, 3)                     # a real filter bank: 8 out, 4 in, 3x3
def rel_err(approx):                            # ||W - approx|| / ||W||
    return (torch.norm(W - approx) / torch.norm(W)).item()

sign_only  = torch.sign(W)                                          # alpha = 1
global_a   = W.abs().mean() * torch.sign(W)                         # one scale for whole tensor
alpha_f    = W.abs().mean(dim=(1, 2, 3), keepdim=True)              # per-filter (the paper)
per_filter = alpha_f * torch.sign(W)

print("rel err  sign() only       :", round(rel_err(sign_only),  4))   # ~0.6704
print("rel err  global alpha      :", round(rel_err(global_a),   4))   # ~0.6104
print("rel err  per-filter alpha  :", round(rel_err(per_filter), 4))   # ~0.6006
# The scaled versions beat naive sign(); per-filter alpha = mean(|W|) is best.
# (Our small run, not the paper's reported number.)


# --- 3. XNOR + popcount == dot product of two sign vectors. ---
torch.manual_seed(1)
x = torch.sign(torch.randn(64))                 # +1 / -1
w = torch.sign(torch.randn(64))
dot = (x * w).sum().item()                       # the normal way
xb, wb  = (x > 0).int(), (w > 0).int()           # encode +1 -> 1, -1 -> 0
popcount = (xb == wb).int().sum().item()         # XNOR then popcount
n = x.numel()
print("dot =", dot, " | 2*popcount - n =", 2 * popcount - n,
      " (popcount =", popcount, ", n =", n, ")")
# dot = 0.0  | 2*popcount - n = 0   ->  the bitwise route matches exactly.`
  };

  window.CODEVIZ["paper-xnor-net"] = {
    question: "Approximating a real conv weight tensor with 1 bit per weight: how much does the scale alpha = mean(|W|) reduce the error versus naive sign()?",
    charts: [
      {
        type: "bar",
        title: "Relative reconstruction error ||W - approx|| / ||W|| by binarization method",
        xlabel: "method",
        ylabel: "relative error (lower is better)",
        series: [
          {
            name: "relative error",
            color: "#7ee787",
            points: [["sign() only (alpha=1)", 0.6704], ["one global alpha", 0.6104], ["per-filter alpha (paper)", 0.6006]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A real conv weight tensor (8 out, 4 in, 3x3, standard-normal) approximated with 1 bit per weight three ways. Plain sign() (alpha=1) has relative error 0.6704. Adding ONE global scale alpha=mean(|W|) drops it to 0.6104; the paper's PER-FILTER alpha=mean(|W|) per output channel (Eqn. 6) is best at 0.6006. The single mean-magnitude number recovers a chunk of the error that plain sign() threw away &mdash; and per-filter is the provably optimal scale. The remaining error is the irreducible cost of 1-bit weights.",
    code: `import torch

# Approximation error of a real weight tensor under three 1-bit binarizations.
# Reproduces the qualitative effect: the scale alpha = mean(|W|) beats naive sign().
torch.manual_seed(0)
W = torch.randn(8, 4, 3, 3)                       # a real conv filter bank

def rel_err(approx):
    return (torch.norm(W - approx) / torch.norm(W)).item()

sign_only  = torch.sign(W)                         # alpha = 1 (no scale)
global_a   = W.abs().mean() * torch.sign(W)        # one scale for the whole tensor
alpha_f    = W.abs().mean(dim=(1, 2, 3), keepdim=True)   # Eqn. 6, per output filter
per_filter = alpha_f * torch.sign(W)

print("sign() only       :", round(rel_err(sign_only),  4))   # 0.6704
print("one global alpha  :", round(rel_err(global_a),   4))   # 0.6104
print("per-filter alpha  :", round(rel_err(per_filter), 4))   # 0.6006
# Lower is better. The mean-magnitude scale recovers error that plain sign() lost.`
  };
})();
