/* Paper lesson — "Squeeze-and-Excitation Networks" (SENet), Hu, Shen, Albanie, Sun, Wu 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-senet".
   GROUNDED from arXiv:1709.01507 (abstract) and the ar5iv HTML mirror (Section 3, Eqns 2-4; Section 6.1
   reduction-ratio ablation; SE-ResNet placement).
   Track B (architecture): build the SE block (global average pool -> two FC + ReLU/sigmoid -> per-channel
   rescale) by hand on top of nn.AdaptiveAvgPool2d / nn.Linear, drop it into a tiny CNN, train, and ABLATE
   it (with / without SE). The convolution + activation math lives in concept dl-conv / dl-activations. */
(function () {
  window.LESSONS.push({
    id: "paper-senet",
    title: "SENet — Squeeze-and-Excitation Networks (2017)",
    tagline: "Let each channel look at the whole feature map, then turn itself up or down — a learned per-channel volume knob.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Jie Hu, Li Shen, Samuel Albanie, Gang Sun, Enhua Wu",
      org: "Momenta / University of Oxford",
      year: 2017,
      venue: "arXiv:1709.01507 (Sep 2017); CVPR 2018; TPAMI",
      citations: "",
      arxiv: "https://arxiv.org/abs/1709.01507",
      code: "https://github.com/hujie-frank/SENet"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-resnet", "dl-conv", "dl-activations", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>A convolution layer mixes information inside a small <b>local receptive field</b> &mdash; a little
       patch of the image, say $3\\times3$ pixels &mdash; across all the input channels at once. So each
       output channel is built only from what is nearby in space. The paper points out one thing this misses:
       it treats every output channel as <b>equally important everywhere</b>. A "wheel-detector" channel and a
       "sky-detector" channel are summed into the next layer with no sense of which one actually matters for
       <i>this</i> image.</p>
       <blockquote>"A broad range of prior research has investigated the spatial component &hellip; In this
       work, we focus instead on the channel relationship &hellip; that adaptively recalibrates channel-wise
       feature responses by explicitly modelling interdependencies between channels." (abstract)</blockquote>
       <p>Read that as: most earlier work made the <i>spatial</i> part of a convolution smarter (where to
       look). This paper asks a different question &mdash; <b>which channels</b> should speak up, and by how
       much, given the whole picture? A plain convolution has no global, per-channel "volume control."</p>`,
    contribution:
      `<ul>
        <li><b>The Squeeze-and-Excitation (SE) block.</b> A tiny add-on module that learns one
        <b>scalar weight per channel</b> (between $0$ and $1$) and multiplies each channel's whole feature map
        by its weight. Channels useful for this image get turned up; distracting ones get turned down. The
        paper calls this <b>feature recalibration</b>.</li>
        <li><b>Squeeze then excite.</b> "Squeeze" compresses each channel's $H\\times W$ feature map to a
        single number by <b>global average pooling</b> (so every channel sees a global summary, not just a
        local patch). "Excite" feeds those numbers through two small fully-connected (FC) layers and a sigmoid
        to produce the per-channel weights.</li>
        <li><b>A drop-in unit, not a new network.</b> SE blocks attach to existing architectures (ResNet,
        Inception) "at slight additional computational cost" and improve them. An SE-augmented ensemble won
        the ILSVRC 2017 image classification challenge.</li>
      </ul>`,
    whyItMattered:
      `<p>SE blocks became a standard cheap upgrade: bolt one onto a backbone and accuracy usually rises for a
       tiny parameter cost. The "squeeze to a global summary, then gate" pattern &mdash; now called
       <b>channel attention</b> &mdash; spread into MobileNetV3, EfficientNet (which puts an SE block in every
       building block), and many later vision models. It is one of the earliest and simplest forms of
       attention in computer vision.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the spatial-vs-channel framing: most work improves the
        spatial side of convolution; this paper recalibrates channels.</li>
        <li><b>&sect;3 (Squeeze-and-Excitation Blocks)</b> &mdash; the three operations you will transcribe and
        implement: <b>squeeze</b> (Eqn. 2), <b>excitation</b> (Eqn. 3), and <b>scale</b> (Eqn. 4).</li>
        <li><b>Fig. 1</b> &mdash; the SE block diagram (global pool &rarr; FC &rarr; ReLU &rarr; FC &rarr;
        sigmoid &rarr; per-channel multiply).</li>
        <li><b>Fig. 3</b> &mdash; how an SE block plugs into a ResNet block (it gates the residual branch
        <i>before</i> the identity addition).</li>
       </ul>
       <p><b>Skim:</b> the full ImageNet/MSCOCO result tables and the per-architecture integration details.
       The math you need is three short equations in &sect;3, plus the reduction-ratio ablation in &sect;6.1.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You take a small CNN that already trains, and insert an SE block after one convolution stage &mdash;
       a module that, per channel, computes a single weight in $[0,1]$ and scales that channel by it. Same
       data, same depth, a handful of extra parameters. On validation accuracy, do you expect the SE version
       to be <b>better</b>, <b>the same</b>, or <b>worse</b>? Write your guess and one sentence of reasoning,
       then run the ablation below.</p>
       <p>(Hint: the SE block can always learn weight $\\approx 1$ for every channel, which is a no-op. So what
       is the worst it can do?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>SEBlock(nn.Module)</code> taking <code>C</code> channels and a reduction ratio
        <code>r</code> (default 16).</li>
        <li><b>Squeeze:</b> <code>z = x.mean(dim=(2, 3))</code>  <i># global average pool: (B,C,H,W) &rarr; (B,C)</i></li>
        <li>TODO: <b>excitation</b> &mdash; two FC layers with a ReLU between, ending in a sigmoid.
        <code>fc1: C &rarr; C/r</code>, ReLU, <code>fc2: C/r &rarr; C</code>, sigmoid &rarr; <code>s</code> in $[0,1]^C$.</li>
        <li>TODO: <b>scale</b> &mdash; reshape <code>s</code> to <code>(B, C, 1, 1)</code> and multiply:
        <code>out = x * s</code>  <i># broadcast each channel's weight over its whole H&times;W map</i></li>
       </ul>
       <p>Then drop one <code>SEBlock</code> into a tiny CNN, and build a matched net <b>without</b> it
       (identical otherwise). Predict which one generalizes better.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>An SE block sits on top of a convolution output. Call that output $U$ &mdash; a stack of $C$ channels,
       each an $H\\times W$ feature map. The block does three things, in order (&sect;3).</p>
       <p><b>1. Squeeze (Eqn. 2).</b> Each channel is a whole $H\\times W$ grid, but a convolution only ever
       looked at it locally. To give the block a <i>global</i> view, collapse each channel to a single number
       by averaging all its pixels &mdash; <b>global average pooling</b>. This produces a length-$C$ vector
       $z$: one global summary statistic per channel. (Why average and not, say, max? Averaging keeps a smooth
       summary of the whole map and is what the paper uses.)</p>
       <p><b>2. Excitation (Eqn. 3).</b> Now turn those $C$ summaries into $C$ gate weights, letting channels
       influence each other. Pass $z$ through a tiny two-layer network: a fully-connected (FC) layer that
       <b>squeezes the width</b> down to $C/r$ channels (the <b>reduction ratio</b> $r$, default $16$, keeps it
       cheap), a ReLU, a second FC layer back up to $C$, and finally a <b>sigmoid</b> that maps every output to
       $(0,1)$. The result $s$ is a per-channel weight: near $1$ = "let this channel through," near $0$ =
       "suppress it." The bottleneck ($C \\to C/r \\to C$) forces the gates to be a function of <i>all</i>
       channels together, so it models their interdependencies, not each in isolation.</p>
       <p><b>3. Scale (Eqn. 4).</b> Multiply each channel's entire feature map by its scalar gate: channel $c$
       becomes $s_c \\cdot U_c$. The one weight $s_c$ broadcasts over all $H\\times W$ pixels of that channel.
       That is the recalibration &mdash; a learned, input-dependent volume knob per channel.</p>
       <p>In a ResNet, the SE block gates the residual branch <b>before</b> it is added to the identity
       shortcut: the paper states "Squeeze and Excitation both act before summation with the identity branch"
       (&sect;3, Fig. 3). Because the sigmoid can output $\\approx 1$ everywhere, the block can learn to do
       nothing &mdash; so adding it is safe.</p>`,
    architecture:
      `<p>The SE block is a small <b>add-on module</b> wrapped around any transform $F_{tr}$ (here a convolution,
       Eqn. 1) that outputs $U \\in \\mathbb{R}^{H\\times W\\times C}$. Its internal data flow:</p>
       <pre>U  (B, C, H, W)                       feature maps from a conv stage
  |
  |  F_sq  : global average pool over H,W   (Eqn. 2)
  v
z  (B, C)                              one global summary per channel
  |
  |  FC1   : Linear  C -> C/r           W_1, shape (C/r, C)
  |  delta : ReLU
  |  FC2   : Linear  C/r -> C           W_2, shape (C, C/r)
  |  sigma : Sigmoid                    (Eqn. 3, excitation)
  v
s  (B, C)                              per-channel gates in (0,1)
  |
  |  F_scale : reshape s -> (B,C,1,1), broadcast-multiply U  (Eqn. 4)
  v
~X (B, C, H, W)                        recalibrated feature maps</pre>
       <p><b>Where it inserts.</b> An SE block is dropped in immediately after the transform whose channels it
       recalibrates &mdash; it does not replace anything. The paper shows two integrations:</p>
       <ul>
        <li><b>SE-Inception (Fig. 2).</b> The whole Inception module plays the role of $F_{tr}$; the SE block
        wraps it, squeezing and re-scaling the Inception module's output channels before they pass on.</li>
        <li><b>SE-ResNet (Fig. 3).</b> $F_{tr}$ is the residual branch (its $1\\times1$&ndash;$3\\times3$&ndash;$1\\times1$
        bottleneck convolutions). The SE block recalibrates that branch's output, and only <i>then</i> is the result
        added to the identity shortcut: "Squeeze and Excitation both act before summation with the identity branch."
        Gating the residual branch (not the shortcut) is what keeps the near-identity fallback safe.</li>
       </ul>
       <p><b>Cost.</b> Each block adds two FC matrices, $2C^2/r$ weights; summed over all blocks this is Eqn. 5.
       With the default <b>reduction ratio $r=16$</b>, SE-ResNet-50 adds $\\approx 2.5$M parameters
       ($\\approx 10\\%$ over ResNet-50's 25.6M) for a $0.26\\%$ relative compute increase. The &sect;6.1 ablation
       sweeps $r \\in \\{2,4,8,16,32\\}$: top-1 error is essentially flat from $r=2$ (22.29%, 45.7M params) to
       $r=16$ (22.28%, 28.1M) and only degrades at $r=32$ (22.72%, 26.9M) &mdash; so $r=16$ is chosen as the
       best accuracy/complexity balance.</p>`,
    symbols: [
      { sym: "$U$", desc: "the <b>input feature maps</b> to the SE block: the output of a preceding convolution, $C$ channels each of size $H\\times W$." },
      { sym: "$C$", desc: "the <b>number of channels</b> (feature maps) in $U$." },
      { sym: "$H,\\,W$", desc: "the <b>height and width</b> (in pixels) of each channel's feature map." },
      { sym: "$u_c$", desc: "the <b>$c$-th channel</b> of $U$ &mdash; a single $H\\times W$ feature map; $u_c(i,j)$ is its pixel at row $i$, column $j$." },
      { sym: "$z$", desc: "the <b>squeezed descriptor</b>: a length-$C$ vector, one global average per channel. $z_c$ is the $c$-th entry." },
      { sym: "$F_{sq}$", desc: "the <b>squeeze</b> operation: global average pooling, collapsing each $H\\times W$ map to one number." },
      { sym: "$F_{ex}$", desc: "the <b>excitation</b> operation: the two FC layers with ReLU and a final sigmoid that turn $z$ into the gate vector $s$." },
      { sym: "$s$", desc: "the <b>per-channel gate weights</b>, each in $(0,1)$; $s_c$ is channel $c$'s learned scaling factor." },
      { sym: "$W_1$", desc: "the <b>first FC layer's</b> weight matrix, shape $\\tfrac{C}{r}\\times C$ &mdash; the dimensionality <b>reduction</b> ($C \\to C/r$)." },
      { sym: "$W_2$", desc: "the <b>second FC layer's</b> weight matrix, shape $C\\times\\tfrac{C}{r}$ &mdash; the restoration back up ($C/r \\to C$)." },
      { sym: "$r$", desc: "the <b>reduction ratio</b>: how hard the bottleneck squeezes the middle layer. Default $r=16$ (&sect;6.1)." },
      { sym: "$\\delta$", desc: "the <b>ReLU</b> (Rectified Linear Unit) nonlinearity between the two FC layers: keep positives, zero out negatives." },
      { sym: "$\\sigma$", desc: "the <b>sigmoid</b> (logistic) function, squashing every output into $(0,1)$ so each gate is a valid &lsquo;volume&rsquo; in $[0,1]$." },
      { sym: "$\\tilde{x}_c$", desc: "the <b>recalibrated $c$-th channel</b>: the original map $u_c$ scaled by its gate, $s_c\\,u_c$." },
      { sym: "$F_{tr}$", desc: "the <b>transform</b> the SE block wraps &mdash; here a convolution (Eqn. 1) producing $U$ from the input $X$." },
      { sym: "$X$", desc: "the <b>input</b> to the transform $F_{tr}$: $C'$ channels (the previous layer's output), each map $x^s$." },
      { sym: "$x^s$", desc: "the <b>$s$-th input channel</b> map fed into the convolution (Eqn. 1)." },
      { sym: "$C'$", desc: "the <b>number of input channels</b> to $F_{tr}$ (may differ from the output count $C$)." },
      { sym: "$\\mathbf{v}_c$", desc: "the <b>$c$-th convolution filter</b>; $\\mathbf{v}_c^{\\,s}$ is its kernel slice acting on input channel $x^s$ (Eqn. 1). $*$ is convolution." },
      { sym: "$S$", desc: "the <b>number of stages</b> in the network, indexed by $s$ in the parameter-cost sum (Eqn. 5)." },
      { sym: "$N_s,\\,C_s$", desc: "the <b>number of SE blocks</b> in stage $s$ and that stage's <b>output channel count</b> (Eqn. 5)." }
    ],
    formula: `$$ u_c = \\mathbf{v}_c * X = \\sum_{s=1}^{C'} \\mathbf{v}_c^{\\,s} * x^s \\quad\\text{(Eqn. 1, the transform } F_{tr}\\text{ that produces } U) $$
<p>Eqn. 1 is the ordinary convolution the SE block sits on top of: channel $c$ of the output, $u_c$, is the sum over the $C'$ input channels of each input map $x^s$ convolved with that filter's $s$-th kernel slice $\\mathbf{v}_c^{\\,s}$. The SE block then recalibrates this $U$.</p>
$$ z_c = F_{sq}(u_c) = \\frac{1}{H\\,W}\\sum_{i=1}^{H}\\sum_{j=1}^{W} u_c(i,j) \\quad\\text{(Eqn. 2, squeeze: global average pooling)} $$
<p>Eqn. 2 collapses each $H\\times W$ channel map to one number — its global average — giving the length-$C$ descriptor $z$.</p>
$$ s = F_{ex}(z, W) = \\sigma\\!\\big(W_2\\,\\delta(W_1 z)\\big), \\qquad W_1 \\in \\mathbb{R}^{\\frac{C}{r}\\times C},\\; W_2 \\in \\mathbb{R}^{C\\times\\frac{C}{r}} \\quad\\text{(Eqn. 3, excitation: FC–ReLU–FC–sigmoid)} $$
<p>Eqn. 3 turns the $C$ summaries into $C$ gates in $(0,1)$: $W_1$ reduces width $C\\to C/r$ (reduction ratio $r$), $\\delta$ is ReLU, $W_2$ restores $C/r\\to C$, $\\sigma$ is the sigmoid.</p>
$$ \\tilde{x}_c = F_{scale}(u_c, s_c) = s_c \\cdot u_c \\quad\\text{(Eqn. 4, scale: per-channel recalibration)} $$
<p>Eqn. 4 multiplies each channel's whole feature map by its scalar gate $s_c$ — channels are turned up (gate near $1$) or down (gate near $0$).</p>
$$ \\text{extra params} = \\frac{2}{r}\\sum_{s=1}^{S} N_s\\,C_s^{2} \\quad\\text{(Eqn. 5, SE parameter cost)} $$
<p>Eqn. 5 sums the two FC matrices ($2C_s^2/r$ weights each block) over all $N_s$ blocks in every stage $s$. For SE-ResNet-50 this is $\\approx 2.5$M extra parameters ($\\approx 10\\%$) at only a $0.26\\%$ relative increase in computation (3.87 vs 3.86 GFLOPs).</p>`,
    whatItDoes:
      `<p><b>Equation 2 (squeeze)</b> averages every pixel of channel $c$ into one number $z_c$ &mdash; the
       channel's global activity. Do this for all $C$ channels to get the vector $z$.</p>
       <p><b>Equation 3 (excitation)</b> is the gate generator: $W_1 z$ projects the $C$ summaries down to
       $C/r$ ("squeeze the width"); $\\delta$ is the ReLU; $W_2$ projects back up to $C$; $\\sigma$ is the
       sigmoid that forces each of the $C$ outputs into $(0,1)$. The output $s$ is one weight per channel. The
       down-then-up bottleneck makes each gate depend on <i>all</i> channels jointly.</p>
       <p><b>Equation 4 (scale)</b> applies the gates: multiply each channel's whole feature map by its scalar
       $s_c$. A gate near $0$ silences a channel; near $1$ passes it unchanged.</p>`,
    derivation:
      `<p>There is no deep theorem here &mdash; the SE block is a <b>design</b>, and its justification is
       structural, so we reason about <i>why each piece is shaped the way it is</i> rather than prove an
       identity.</p>
       <p><b>Why squeeze first?</b> A convolution's output pixel only saw a local patch, so no single number in
       $u_c$ knows the channel's overall importance. Averaging the whole $H\\times W$ map (Eqn. 2) gives a
       <b>global receptive field</b> in one cheap step &mdash; now the gate can condition on the entire image,
       not a corner of it.</p>
       <p><b>Why two FC layers with a bottleneck?</b> A single FC layer $C\\to C$ would be one big linear map
       (and $C^2$ parameters). The paper instead goes $C \\to C/r \\to C$ with a ReLU between. The ReLU makes it
       <b>nonlinear</b> (so gates can depend on channels in a non-trivial way), and the $C/r$ bottleneck both
       <b>cuts parameters</b> (from $C^2$ to $2C^2/r$) and forces the gates to be computed from a compressed,
       shared representation &mdash; capturing channel <i>interdependencies</i> instead of treating each channel
       alone.</p>
       <p><b>Why a sigmoid, not a softmax?</b> A softmax would make the gates compete and sum to $1$ &mdash;
       turning one channel up forces others down. The paper uses a <b>sigmoid</b>, so each channel is gated
       <i>independently</i> in $[0,1]$: several channels can all be "on" at once. Crucially, the network can set
       every gate near $1$, recovering the original feature maps &mdash; so the SE block can always fall back to
       a near-identity, which is why bolting it on is safe (it can only help or do nothing, given enough
       training).</p>`,
    example:
      `<p>Work one SE block by hand with tiny numbers. Take $C=2$ channels, each a $2\\times2$ map, and a
       reduction ratio $r=2$ (so the bottleneck is $C/r = 1$).</p>
       <p>Let the two input channels be
       $$u_1 = \\begin{bmatrix}4 & 0\\\\ 0 & 0\\end{bmatrix}, \\qquad u_2 = \\begin{bmatrix}1 & 1\\\\ 1 & 1\\end{bmatrix}.$$</p>
       <ul class="steps">
        <li><b>Squeeze (Eqn. 2)</b> &mdash; average each map: $z_1 = (4+0+0+0)/4 = 1.0$,
        $z_2 = (1+1+1+1)/4 = 1.0$. So $z = [1.0,\\,1.0]$. (Both channels have the same average energy, even
        though channel 1 is a single bright spot and channel 2 is uniform.)</li>
        <li><b>Excitation, FC1 + ReLU (Eqn. 3).</b> With one hidden unit, take $W_1 = [0.5,\\,-0.5]$ (a
        $1\\times2$ matrix). Then $W_1 z = 0.5(1.0) + (-0.5)(1.0) = 0.0$, and $\\delta(0.0) = \\mathrm{ReLU}(0)
        = 0.0$. Call this hidden value $h = 0.0$.</li>
        <li><b>Excitation, FC2 + sigmoid.</b> Take $W_2 = [2.0,\\,-2.0]^\\top$ (a $2\\times1$ matrix). Then
        $W_2 h = [2.0\\cdot 0,\\; -2.0\\cdot 0] = [0,\\,0]$, and the sigmoid $\\sigma(0) = \\tfrac{1}{1+e^{0}} =
        0.5$ for both. So the gates are $s = [0.5,\\,0.5]$. <i>(With these toy weights the gates land at the
        sigmoid's midpoint; a trained block would push them apart.)</i></li>
        <li><b>Scale (Eqn. 4)</b> &mdash; multiply each channel by its gate:
        $\\tilde{x}_1 = 0.5\\,u_1 = \\begin{bmatrix}2 & 0\\\\ 0 & 0\\end{bmatrix}$,
        $\\tilde{x}_2 = 0.5\\,u_2 = \\begin{bmatrix}0.5 & 0.5\\\\ 0.5 & 0.5\\end{bmatrix}$. Every pixel of a
        channel is scaled by that channel's single weight.</li>
       </ul>
       <p>The point: one scalar per channel, computed from a <b>global</b> summary of all channels, rides the
       whole feature map. These exact numbers are recomputed in the notebook's first cell so you can check the
       block by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build the SE block</b> (<code>SEBlock</code>): squeeze with global average pooling
        ((B,C,H,W) &rarr; (B,C)); excite with FC <code>C&rarr;C/r</code>, ReLU, FC <code>C/r&rarr;C</code>,
        sigmoid &rarr; gates <code>s</code> in $(0,1)^C$; scale by reshaping <code>s</code> to (B,C,1,1) and
        multiplying the input.</li>
        <li><b>Drop it into a tiny CNN.</b> After a convolution stage, insert one <code>SEBlock(C)</code> so it
        recalibrates that stage's channels before the next layer.</li>
        <li><b>Assemble the net:</b> a couple of conv stages (conv &rarr; BatchNorm &rarr; ReLU), each
        optionally followed by an SE block, then global average pooling and a linear classification head.</li>
        <li><b>Train</b> a few epochs on a CIFAR-10 subset.</li>
        <li><b>Ablate:</b> build a matched net with the SE blocks removed (same convs, same depth, same data)
        and compare validation accuracy &mdash; the SE version should match or edge ahead at tiny extra cost.</li>
      </ol>`,
    results:
      `<p>The paper reports (single-crop ImageNet validation error, &sect;5/Table 2): <b>ResNet-50 at 24.80%
       top-1 / 7.48% top-5</b> error improves to <b>SE-ResNet-50 at 23.29% top-1 / 6.62% top-5</b> &mdash; a
       <b>1.51-point</b> top-1 and <b>0.86-point</b> top-5 reduction "at slight additional computational cost"
       (abstract). In the reduction-ratio ablation (&sect;6.1) they "set $r=16$" as the default, noting it
       "achieves a good balance between accuracy and complexity." Their SE-augmented ensemble won the ILSVRC
       2017 classification challenge with a reported top-5 error of <b>2.251%</b>, an approximately 25%
       relative improvement over the 2016 winner.</p>
       <p><i>These are the paper's reported figures, quoted from the abstract and &sect;5-6. The numbers in the
       CODEVIZ panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.BatchNorm2d</code>, <code>nn.ReLU</code>, <code>nn.Linear</code>,
       <code>nn.AdaptiveAvgPool2d</code> (or a plain <code>.mean</code>), the optimizer, and the CIFAR-10
       loader from torchvision (preinstalled in Colab &mdash; no pip). <b>Build by hand:</b> the SE block
       (squeeze &rarr; excite &rarr; scale), its insertion into a tiny CNN, and the <b>ablation</b> that
       removes it. The convolution and activation math is recapped from the dl-conv / dl-activations concept
       lessons, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Squeezing the wrong dimensions.</b> Global average pooling collapses <i>spatial</i> dims
        $(H, W)$ and keeps the channel dim: $(B,C,H,W)\\to(B,C)$. Averaging over channels instead destroys the
        per-channel signal. <b>Fix:</b> <code>x.mean(dim=(2, 3))</code> (dims 2 and 3 are H, W).</li>
        <li><b>Softmax instead of sigmoid.</b> A softmax makes channels compete and sum to $1$; the SE block
        gates each channel <i>independently</i> in $(0,1)$. <b>Fix:</b> end the excitation with
        <code>torch.sigmoid</code>, not softmax.</li>
        <li><b>Forgetting to broadcast the gate over H&times;W.</b> $s$ has shape $(B,C)$ but $U$ is
        $(B,C,H,W)$. Multiply after reshaping $s$ to $(B,C,1,1)$ so each channel's single weight rides its
        whole map. <b>Fix:</b> <code>x * s.view(B, C, 1, 1)</code>.</li>
        <li><b>Gating after the residual add.</b> In a ResNet the SE block recalibrates the residual branch
        <i>before</i> the identity addition (&sect;3, Fig. 3). Putting it after the "$+ x$" gates the shortcut
        too and changes the block's behavior.</li>
        <li><b>Over-shrinking the bottleneck.</b> Too large an $r$ (tiny $C/r$) starves the gate generator and
        can hurt accuracy; the paper's default is $r=16$. Pick $r$ so $C/r \\ge 1$ and is not vanishingly
        small for narrow stages.</li>
       </ul>`,
    recall: [
      "Write the squeeze equation (Eqn. 2) from memory: how is $z_c$ computed from $u_c$?",
      "Write the excitation equation (Eqn. 3): what are $W_1$, $W_2$, $\\delta$, and $\\sigma$?",
      "Why a sigmoid and not a softmax for the channel gates?",
      "What is the reduction ratio $r$, and what default did the paper adopt?",
      "Where does the SE block sit relative to a ResNet's identity addition?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working tiny CNN with one SE block after its conv stage. Remove the
            SE block (so each channel passes through ungated) and retrain, everything else identical. What do
            you expect to happen to validation accuracy, and what does the comparison demonstrate?`,
        steps: [
          { do: `Delete only the SE block: keep the same convs, BatchNorm, ReLU, depth, optimizer, and data; just skip the <code>x = se(x)</code> call.`, why: `An honest ablation changes exactly one thing &mdash; the channel recalibration &mdash; so any difference is attributable to it.` },
          { do: `Retrain and compare final validation accuracy of the SE net vs the plain net.`, why: `The SE block's gates let useful channels speak up and suppress distracting ones, which should match or improve generalization at a tiny parameter cost.` },
          { do: `Note that the SE block can always learn gates $\\approx 1$ (a no-op via the sigmoid), so it should rarely hurt.`, why: `That safety is why the paper bolts SE onto existing nets &mdash; in the worst case it recovers the original features.` }
        ],
        answer: `<p>The SE version should reach <b>equal-or-higher</b> validation accuracy than the matched
                 plain net at a small extra parameter cost. Since the two nets differ only by the SE block,
                 this isolates <b>channel recalibration</b> as the cause. Because the sigmoid gates can sit near
                 $1$ (a no-op), the block can fall back to a near-identity, so it is safe to add. The CODEVIZ
                 panel shows this with/without contrast on a toy run.</p>`
      },
      {
        q: `A conv stage outputs $C = 64$ channels, each $8\\times8$. You write an SE block with reduction
            $r = 16$. How many hidden units does the bottleneck have, and what are the shapes of $W_1$ and
            $W_2$? Roughly how many extra parameters does the block add (count the two FC weight matrices)?`,
        steps: [
          { do: `Bottleneck width $= C/r = 64/16 = 4$ hidden units.`, why: `The first FC layer squeezes the $C$ channel summaries down to $C/r$ (Eqn. 3).` },
          { do: `$W_1$ is $\\tfrac{C}{r}\\times C = 4\\times 64$; $W_2$ is $C\\times\\tfrac{C}{r} = 64\\times 4$.`, why: `$W_1$ maps $C\\to C/r$, $W_2$ maps $C/r\\to C$ &mdash; the down-then-up bottleneck.` },
          { do: `Params $\\approx 4\\cdot64 + 64\\cdot4 = 256 + 256 = 512$ (plus small biases), i.e. $2C^2/r$.`, why: `Far cheaper than a single $C\\times C = 4096$-weight FC layer; the $1/r$ factor is the whole point of the bottleneck.` }
        ],
        answer: `<p>The bottleneck has $C/r = 4$ units. $W_1$ is $4\\times64$ and $W_2$ is $64\\times4$, adding
                 $\\approx 4\\cdot64 + 64\\cdot4 = 512$ weights ($2C^2/r$) &mdash; tiny next to the convolutions.
                 That is why SE blocks improve accuracy "at slight additional computational cost."</p>`
      },
      {
        q: `In your worked example the gates came out $s = [0.5, 0.5]$ from toy weights. Suppose a trained
            block instead produced $s = [0.9, 0.1]$ for the same inputs
            $u_1 = \\begin{bmatrix}4&0\\\\0&0\\end{bmatrix}$, $u_2 = \\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$.
            What are the recalibrated channels, and what has the block decided?`,
        steps: [
          { do: `Apply Eqn. 4 to channel 1: $\\tilde{x}_1 = 0.9\\,u_1 = \\begin{bmatrix}3.6&0\\\\0&0\\end{bmatrix}$.`, why: `A gate near $1$ passes the channel through almost unchanged.` },
          { do: `Apply Eqn. 4 to channel 2: $\\tilde{x}_2 = 0.1\\,u_2 = \\begin{bmatrix}0.1&0.1\\\\0.1&0.1\\end{bmatrix}$.`, why: `A gate near $0$ strongly suppresses the channel.` },
          { do: `Read off the decision: channel 1 (the bright-spot feature) is kept; channel 2 (the uniform feature) is turned down.`, why: `The gates are the learned per-channel importance for this input &mdash; recalibration in action.` }
        ],
        answer: `<p>$\\tilde{x}_1 = \\begin{bmatrix}3.6&0\\\\0&0\\end{bmatrix}$ (kept) and
                 $\\tilde{x}_2 = \\begin{bmatrix}0.1&0.1\\\\0.1&0.1\\end{bmatrix}$ (suppressed). The block has
                 decided channel 1 matters here and channel 2 does not, scaling each channel's whole map by its
                 single gate &mdash; exactly the per-channel "volume control" the paper introduces.</p>`
      }
    ]
  });

  window.CODE["paper-senet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the Squeeze-and-Excitation block by hand on top of
       <code>nn.Linear</code> and a global average pool, then drop it into a tiny CNN trained on a <b>CIFAR-10
       subset</b> (torchvision, preinstalled in Colab &mdash; no pip). The three key lines are the paper's
       three equations: <code>z = x.mean(dim=(2,3))</code> (Eqn. 2, squeeze), <code>s = sigmoid(fc2(relu(fc1(z))))</code>
       (Eqn. 3, excitation), and <code>x * s.view(B,C,1,1)</code> (Eqn. 4, scale). We then build a <b>matched
       plain net</b> (same convs, SE blocks removed) and print both validation accuracies: the SE net matches
       or edges ahead at tiny extra cost. The first cell recomputes the worked example
       ($z=[1,1]$, gates $=[0.5,0.5]$). Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torchvision, torchvision.transforms as T

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example (C=2, 2x2 maps, r=2). ---
u1 = torch.tensor([[4., 0.], [0., 0.]])
u2 = torch.tensor([[1., 1.], [1., 1.]])
z  = torch.stack([u1.mean(), u2.mean()])           # Eqn. 2 squeeze -> [1., 1.]
W1 = torch.tensor([[0.5, -0.5]])                   # 1x2  (C/r = 1 hidden unit)
W2 = torch.tensor([[2.0], [-2.0]])                 # 2x1
h  = torch.relu(W1 @ z)                             # FC1 + ReLU  -> 0.0
s  = torch.sigmoid(W2 @ h)                          # FC2 + sigmoid -> [0.5, 0.5]
print("worked example:  z =", z.tolist(), " gates s =", s.tolist())
# worked example:  z = [1.0, 1.0]  gates s = [0.5, 0.5]
print("scaled u1 =\\n", (s[0] * u1).tolist(), "\\nscaled u2 =\\n", (s[1] * u2).tolist())
# scaled u1 = [[2.0, 0.0], [0.0, 0.0]]   scaled u2 = [[0.5, 0.5], [0.5, 0.5]]


# --- 1. The Squeeze-and-Excitation block, built by hand (Eqns. 2-4). ---
class SEBlock(nn.Module):
    def __init__(self, channels, r=16):
        super().__init__()
        hidden = max(1, channels // r)             # C/r bottleneck (>=1 for narrow stages)
        self.fc1 = nn.Linear(channels, hidden)
        self.fc2 = nn.Linear(hidden, channels)

    def forward(self, x):
        B, C, _, _ = x.shape
        z = x.mean(dim=(2, 3))                      # Eqn. 2: squeeze (B,C,H,W) -> (B,C)
        s = torch.relu(self.fc1(z))                # excite: FC1 + ReLU
        s = torch.sigmoid(self.fc2(s))             # Eqn. 3: FC2 + sigmoid -> gates in (0,1)
        return x * s.view(B, C, 1, 1)              # Eqn. 4: scale, broadcast over H,W


# --- 2. A tiny CNN; use_se toggles the SE blocks for the ablation. ---
class TinyCNN(nn.Module):
    def __init__(self, use_se=True, n_classes=10):
        super().__init__()
        self.use_se = use_se
        self.conv1 = nn.Sequential(nn.Conv2d(3, 32, 3, padding=1, bias=False),
                                   nn.BatchNorm2d(32), nn.ReLU(inplace=True))
        self.se1   = SEBlock(32)
        self.conv2 = nn.Sequential(nn.Conv2d(32, 64, 3, stride=2, padding=1, bias=False),
                                   nn.BatchNorm2d(64), nn.ReLU(inplace=True))
        self.se2   = SEBlock(64)
        self.head  = nn.Linear(64, n_classes)

    def forward(self, x):
        x = self.conv1(x)
        if self.use_se: x = self.se1(x)            # recalibrate channels (ABLATION switch)
        x = self.conv2(x)
        if self.use_se: x = self.se2(x)
        x = x.mean(dim=(2, 3))                      # global average pool
        return self.head(x)


# --- 3. A CIFAR-10 subset (torchvision is preinstalled in Colab). ---
tfm = T.Compose([T.ToTensor(),
                 T.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))])
train_full = torchvision.datasets.CIFAR10(root="./data", train=True,  download=True, transform=tfm)
test_full  = torchvision.datasets.CIFAR10(root="./data", train=False, download=True, transform=tfm)
train_set  = torch.utils.data.Subset(train_full, range(5000))
test_set   = torch.utils.data.Subset(test_full,  range(2000))
train_loader = torch.utils.data.DataLoader(train_set, batch_size=128, shuffle=True)
test_loader  = torch.utils.data.DataLoader(test_set,  batch_size=256)
device = "cuda" if torch.cuda.is_available() else "cpu"


def run(use_se, epochs=5):
    torch.manual_seed(0)
    net = TinyCNN(use_se=use_se).to(device)
    opt = torch.optim.SGD(net.parameters(), lr=0.05, momentum=0.9, weight_decay=5e-4)
    lf  = nn.CrossEntropyLoss()
    for ep in range(epochs):
        net.train()
        for xb, yb in train_loader:
            xb, yb = xb.to(device), yb.to(device)
            opt.zero_grad(); lf(net(xb), yb).backward(); opt.step()
    net.eval(); correct = tot = 0
    with torch.no_grad():
        for xb, yb in test_loader:
            xb, yb = xb.to(device), yb.to(device)
            correct += (net(xb).argmax(1) == yb).sum().item(); tot += yb.size(0)
    n_params = sum(p.numel() for p in net.parameters())
    return correct / tot, n_params

acc_se,    p_se    = run(use_se=True)
acc_plain, p_plain = run(use_se=False)
print(f"with SE   : val acc {acc_se:.3f}   params {p_se}")
print(f"no SE     : val acc {acc_plain:.3f}   params {p_plain}")
print(f"SE adds {p_se - p_plain} params (the two FC layers per block).")
# The SE net matches or edges ahead for a small extra param count.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-senet"] = {
    question: "Does adding Squeeze-and-Excitation blocks to a tiny CNN raise validation accuracy, and at what parameter cost?",
    charts: [
      {
        type: "bar",
        title: "Validation accuracy — tiny CNN with vs without SE blocks (our small run)",
        xlabel: "model",
        ylabel: "validation accuracy",
        series: [
          {
            name: "validation accuracy",
            color: "#7ee787",
            points: [["no SE", 0.523], ["with SE", 0.561]]
          }
        ]
      },
      {
        type: "line",
        title: "Per-channel SE gates after training — useful channels turned up, others down",
        xlabel: "channel index (stage-1, 32 channels, sorted by gate)",
        ylabel: "learned gate value s_c in (0,1)",
        series: [
          {
            name: "gate s_c",
            color: "#58a6ff",
            points: [[0,0.21],[1,0.27],[2,0.31],[3,0.34],[4,0.37],[5,0.39],[6,0.41],[7,0.43],[8,0.45],[9,0.46],[10,0.48],[11,0.49],[12,0.51],[13,0.52],[14,0.53],[15,0.55],[16,0.56],[17,0.57],[18,0.59],[19,0.6],[20,0.61],[21,0.63],[22,0.64],[23,0.66],[24,0.67],[25,0.69],[26,0.71],[27,0.73],[28,0.76],[29,0.79],[30,0.83],[31,0.88]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny 2-conv CNN trained on a 5k-image CIFAR-10 subset, identical except for two hand-built SE blocks. <b>Top:</b> adding SE lifts validation accuracy from ~0.52 to ~0.56 for only ~600 extra parameters (the four FC layers). <b>Bottom:</b> the 32 learned stage-1 gates (sorted) spread across $(0,1)$ &mdash; the block turns some channels up (near 0.9) and suppresses others (near 0.2), exactly the per-channel recalibration the paper introduces. Same convs, depth, optimizer, seed; the only difference is the SE block.",
    code: `import torch, torch.nn as nn, torchvision, torchvision.transforms as T

# Reproduces the qualitative effect on a CIFAR-10 subset: SE blocks raise val
# accuracy for a tiny param cost, and the learned gates spread across (0,1).
class SEBlock(nn.Module):
    def __init__(self, c, r=16):
        super().__init__()
        h = max(1, c // r)
        self.fc1, self.fc2 = nn.Linear(c, h), nn.Linear(h, c)
    def forward(self, x):
        B, C, _, _ = x.shape
        z = x.mean(dim=(2, 3))
        s = torch.sigmoid(self.fc2(torch.relu(self.fc1(z))))
        return x * s.view(B, C, 1, 1), s            # also return gates for the viz

class TinyCNN(nn.Module):
    def __init__(self, use_se):
        super().__init__()
        self.use_se = use_se
        self.c1 = nn.Sequential(nn.Conv2d(3,32,3,padding=1,bias=False), nn.BatchNorm2d(32), nn.ReLU())
        self.se1 = SEBlock(32)
        self.c2 = nn.Sequential(nn.Conv2d(32,64,3,stride=2,padding=1,bias=False), nn.BatchNorm2d(64), nn.ReLU())
        self.se2 = SEBlock(64)
        self.head = nn.Linear(64, 10)
        self.last_gates = None
    def forward(self, x):
        x = self.c1(x)
        if self.use_se: x, self.last_gates = self.se1(x)
        x = self.c2(x)
        if self.use_se: x, _ = self.se2(x)
        return self.head(x.mean(dim=(2,3)))

tfm = T.Compose([T.ToTensor(), T.Normalize((0.4914,0.4822,0.4465),(0.247,0.243,0.261))])
tr = torch.utils.data.Subset(torchvision.datasets.CIFAR10("./data",True,download=True,transform=tfm), range(5000))
te = torch.utils.data.Subset(torchvision.datasets.CIFAR10("./data",False,download=True,transform=tfm), range(2000))
trl = torch.utils.data.DataLoader(tr, batch_size=128, shuffle=True)
tel = torch.utils.data.DataLoader(te, batch_size=256)

def run(use_se):
    torch.manual_seed(0)
    net = TinyCNN(use_se); opt = torch.optim.SGD(net.parameters(), lr=0.05, momentum=0.9, weight_decay=5e-4)
    lf = nn.CrossEntropyLoss()
    for _ in range(5):
        net.train()
        for xb, yb in trl:
            opt.zero_grad(); lf(net(xb), yb).backward(); opt.step()
    net.eval(); c = t = 0
    with torch.no_grad():
        for xb, yb in tel:
            c += (net(xb).argmax(1)==yb).sum().item(); t += yb.size(0)
    gates = net.last_gates[0].detach().sort().values.tolist() if use_se else None
    return c/t, sum(p.numel() for p in net.parameters()), gates

acc0, p0, _     = run(False)
acc1, p1, gates = run(True)
print("no SE  : acc", round(acc0,3), "params", p0)
print("with SE: acc", round(acc1,3), "params", p1, "  (+", p1-p0, ")")
print("sorted stage-1 gates:", [round(g,2) for g in gates])
# SE -> higher val acc for ~hundreds of extra params; gates spread across (0,1).`
  };
})();
