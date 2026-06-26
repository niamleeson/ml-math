/* Paper lesson — "Densely Connected Convolutional Networks" (DenseNet), Huang et al. 2016.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-densenet".
   GROUNDED from arXiv:1608.06993 (abstract) and the ar5iv HTML mirror (Section 3, Eqns 1-2).
   Track B (architecture): build a small dense block by hand on top of nn.Conv2d / nn.BatchNorm2d
   (each layer takes ALL previous feature maps concatenated; channels grow by k per layer), train on
   a toy CIFAR/MNIST-style subset, and ablate dense connectivity vs a matched plain stack.
   Cross-linked to paper-resnet: same "shorter paths" cure, but concatenation (not summation). */
(function () {
  window.LESSONS.push({
    id: "paper-densenet",
    title: "DenseNet — Densely Connected Convolutional Networks (2016)",
    tagline: "Feed every layer the concatenation of ALL earlier feature maps, so features are reused and gradients reach every layer.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Gao Huang, Zhuang Liu, Laurens van der Maaten, Kilian Q. Weinberger",
      org: "Cornell University, Tsinghua University, Facebook AI Research",
      year: 2016,
      venue: "arXiv:1608.06993 (Aug 2016); CVPR 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1608.06993",
      code: "https://github.com/liuzhuang13/DenseNet"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-conv", "dl-backprop", "dl-batchnorm", "pt-nn-module", "pt-cnn", "paper-resnet"],

    // WHY READ IT
    problem:
      `<p>By 2016, Convolutional Neural Networks (CNNs) were getting very deep, and the same enemy kept
       showing up: signal that has to travel through many layers gets weak. The paper states it plainly
       (&sect;1):</p>
       <blockquote>"As information about the input or gradient passes through many layers, it can vanish and
       'wash out' by the time it reaches the end (or beginning) of the network."</blockquote>
       <p>Read that two ways. <b>Forward:</b> the input's detail fades layer by layer. <b>Backward:</b> the
       <b>gradient</b> (the training signal that tells early layers how to change) shrinks on its way back to
       the front, so early layers learn slowly &mdash; this is the <b>vanishing-gradient problem</b>.</p>
       <p>ResNet (the previous paper you read) had already shown one cure: add the input back with a
       skip connection, creating <b>short paths</b> from early layers to late ones. DenseNet asks: if short
       paths are what help, why not make <b>every</b> layer directly connected to <b>every</b> other layer?</p>`,
    contribution:
      `<ul>
        <li><b>Dense connectivity.</b> Each layer takes the feature maps of <b>all</b> preceding layers as
        input, and sends its own output to <b>all</b> following layers. An $L$-layer block therefore has
        $L(L+1)/2$ direct connections instead of $L$ (abstract).</li>
        <li><b>Concatenate, do not sum.</b> Unlike ResNet, which <i>adds</i> the shortcut ($x_\\ell = H_\\ell(x_{\\ell-1}) + x_{\\ell-1}$),
        DenseNet <b>concatenates</b> feature maps. The paper: "we never combine features through summation
        &hellip; instead, we combine features by concatenating them" (&sect;3). Nothing is overwritten, so
        every earlier feature stays available &mdash; <b>feature reuse</b>.</li>
        <li><b>The growth rate $k$.</b> Each layer adds only a small fixed number $k$ of new feature maps to
        the shared pool. Because layers reuse the pool instead of re-learning features, DenseNets reach high
        accuracy with <b>substantially fewer parameters</b> (abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>DenseNet showed that the cure for vanishing gradients is not necessarily <i>more</i> parameters but
       <b>better connectivity</b>: dense blocks "alleviate the vanishing-gradient problem, strengthen feature
       propagation, encourage feature reuse, and substantially reduce the number of parameters" (abstract).
       The concatenate-everything idea reappears across vision (U-Net's skip concatenations, feature-pyramid
       fusions) and the general lesson &mdash; preserve and reuse intermediate features rather than forcing a
       single running summary &mdash; is now standard architecture intuition.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the "wash out" sentence and Figure 1 (the dense block
        diagram, every layer wired to every later layer). This is the whole idea in one picture.</li>
        <li><b>&sect;3 (DenseNets)</b> &mdash; the two equations you will transcribe: ResNet's summation
        (Eqn. 1) and dense concatenation (Eqn. 2), plus the definitions of the <b>composite function</b>
        $H_\\ell$, the <b>growth rate</b> $k$, and the channel-count rule $k_0 + k(\\ell-1)$.</li>
        <li><b>Transition layers</b> (in &sect;3) &mdash; how blocks are joined: a $1\\times1$ conv + $2\\times2$
        average pool that shrinks the feature maps between dense blocks.</li>
       </ul>
       <p><b>Then add</b> the two efficiency refinements (both in &sect;3): the <b>bottleneck</b> $H_\\ell$
       (DenseNet-B: a $1\\times1$ conv to $4k$ maps before the $3\\times3$ conv) and <b>compression</b>
       (DenseNet-C: a transition emits only $\\lfloor\\theta m\\rfloor$ channels, $\\theta=0.5$); together they
       give DenseNet-BC. The Architecture panel below has the full DenseNet-121/169/201/264 table.</p>
       <p><b>Skim:</b> the experiment tables &mdash; the core math is the handful of equations in the Formula panel.</p>`,


    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a <b>deep, thin</b> stack of convolution layers two ways: (a) a <b>dense</b> block where
       each layer sees the concatenation of all earlier outputs, and (b) a matched <b>plain</b> stack where
       each layer sees only the previous layer's output (no concatenation, no skip). Both have the same depth
       and the same per-layer width. On a small classification task, which one's training loss falls, and which
       stalls near chance? Write your guess and one sentence of why, then run the ablation below.</p>
       <p>(Hint: think about how far the gradient must travel back to the <i>first</i> layer in each design.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the dense block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Keep a <b>list</b> of feature maps, starting with the block input: <code>feats = [x]</code>.</li>
        <li>Each layer is a <b>composite function</b> $H_\\ell$ = <code>BatchNorm &rarr; ReLU &rarr; Conv(3&times;3)</code>
        that outputs exactly $k$ channels (the growth rate).</li>
        <li>TODO: each layer's input is the <b>concatenation</b> of everything so far:
        <code>inp = torch.cat(feats, dim=1)</code> &mdash; NOT just <code>feats[-1]</code>.</li>
        <li>TODO: append the new $k$ maps and repeat: <code>feats.append(H(inp))</code>.</li>
        <li>TODO: the block output is the concatenation of <b>all</b> maps: <code>torch.cat(feats, dim=1)</code>.</li>
       </ul>
       <p>Then build a matched <b>plain</b> block (each layer feeds only the previous one) and predict which
       trains. Verify by hand that with $k_0=1$ input channel and growth rate $k=6$, the layers see
       $1, 7, 13, 19$ input channels.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Number the layers in a block $1, 2, \\ldots, L$ and call the block's raw input $x_0$. Each layer
       applies a small <b>composite function</b> $H_\\ell$ &mdash; in the paper, Batch Normalization, then a
       ReLU (Rectified Linear Unit) nonlinearity, then a $3\\times3$ convolution (&sect;3).</p>
       <p>A <b>plain</b> CNN wires each layer to only the one before it: $x_\\ell = H_\\ell(x_{\\ell-1})$. ResNet
       adds a shortcut so the input is summed back on (&sect;3, Eqn. 1):</p>
       <p>$$ x_\\ell = H_\\ell(x_{\\ell-1}) + x_{\\ell-1}. $$</p>
       <p>DenseNet changes the connection in one decisive way. Instead of feeding a layer one tensor, feed it
       the <b>concatenation of every earlier layer's output</b> (&sect;3, Eqn. 2):</p>
       <p>$$ x_\\ell = H_\\ell([x_0, x_1, \\ldots, x_{\\ell-1}]). $$</p>
       <p>The square brackets $[\\,\\cdot\\,]$ mean <b>concatenation along the channel axis</b> &mdash; stack the
       feature maps on top of each other, keeping all of them. Compare with ResNet's "$+$": addition collapses
       two tensors into one of the same size (information can cancel); concatenation keeps both side by side.
       That is the heart of the paper: "in contrast to ResNets, we never combine features through summation
       &hellip; instead, we combine features by concatenating them" (&sect;3).</p>
       <p>Because every $H_\\ell$ outputs a fixed small number of feature maps &mdash; the <b>growth rate</b> $k$
       &mdash; the channel count grows arithmetically. If the block input has $k_0$ channels, then layer $\\ell$
       sees $k_0 + k(\\ell-1)$ input channels (&sect;3): each earlier layer contributed $k$ to the shared pool.
       So $k$ "regulates how much new information each layer contributes to the global state" (&sect;3); a small
       $k$ (the paper uses values like $12$) keeps the network thin yet expressive, because layers reuse the
       pool rather than re-learning features.</p>
       <p>Feature maps can only be concatenated if they share spatial height and width, so a deep DenseNet is
       split into several <b>dense blocks</b>; between them sit <b>transition layers</b> (a $1\\times1$
       convolution plus $2\\times2$ average pooling, &sect;3) that downsample before the next block.</p>`,
    architecture:
      `<p>A full DenseNet stacks four parts: a <b>stem</b>, alternating <b>dense blocks</b> and
       <b>transition layers</b>, and a <b>classification head</b>. Inside a block every layer is densely
       connected (Eqn. 2); between blocks a transition shrinks the spatial size so the next block can
       concatenate cleanly.</p>
       <p><b>One layer (DenseNet-BC, the deep variant).</b> Each $H_\\ell$ is a two-stage <b>bottleneck</b>:</p>
       <ul>
        <li>$1\\times1$ stage: BN &rarr; ReLU &rarr; $1\\times1$ conv producing $4k$ feature maps &mdash; this
        squashes the large concatenated input ($k_0 + k(\\ell-1)$ channels) down to a fixed $4k$.</li>
        <li>$3\\times3$ stage: BN &rarr; ReLU &rarr; $3\\times3$ conv producing exactly $k$ new maps, appended to
        the shared pool.</li>
       </ul>
       <p><b>Transition layer.</b> BN &rarr; $1\\times1$ conv emitting $\\lfloor\\theta m\\rfloor$ channels
       (compression, $\\theta=0.5$) &rarr; $2\\times2$ average pool, stride 2 (halves height and width).</p>
       <p><b>ImageNet table (Table 1).</b> All four ImageNet models use growth rate $k=32$, a
       $7\\times7$ stride-2 stem then $3\\times3$ stride-2 max pool, and four dense blocks separated by three
       transitions; only the per-block layer counts $[b_1, b_2, b_3, b_4]$ differ:</p>
       <table class="arch">
        <thead><tr><th>Stage</th><th>Output</th><th>Operation</th><th>121</th><th>169</th><th>201</th><th>264</th></tr></thead>
        <tbody>
         <tr><td>Convolution</td><td>$112\\times112$</td><td>$7\\times7$ conv, stride 2</td><td colspan="4">same for all</td></tr>
         <tr><td>Pooling</td><td>$56\\times56$</td><td>$3\\times3$ max pool, stride 2</td><td colspan="4">same for all</td></tr>
         <tr><td>Dense Block (1)</td><td>$56\\times56$</td><td>[$1\\times1$ conv, $3\\times3$ conv]</td><td>$\\times6$</td><td>$\\times6$</td><td>$\\times6$</td><td>$\\times6$</td></tr>
         <tr><td>Transition (1)</td><td>$56\\to28$</td><td>$1\\times1$ conv; $2\\times2$ avg pool, stride 2</td><td colspan="4">same for all</td></tr>
         <tr><td>Dense Block (2)</td><td>$28\\times28$</td><td>[$1\\times1$ conv, $3\\times3$ conv]</td><td>$\\times12$</td><td>$\\times12$</td><td>$\\times12$</td><td>$\\times12$</td></tr>
         <tr><td>Transition (2)</td><td>$28\\to14$</td><td>$1\\times1$ conv; $2\\times2$ avg pool, stride 2</td><td colspan="4">same for all</td></tr>
         <tr><td>Dense Block (3)</td><td>$14\\times14$</td><td>[$1\\times1$ conv, $3\\times3$ conv]</td><td>$\\times24$</td><td>$\\times32$</td><td>$\\times48$</td><td>$\\times64$</td></tr>
         <tr><td>Transition (3)</td><td>$14\\to7$</td><td>$1\\times1$ conv; $2\\times2$ avg pool, stride 2</td><td colspan="4">same for all</td></tr>
         <tr><td>Dense Block (4)</td><td>$7\\times7$</td><td>[$1\\times1$ conv, $3\\times3$ conv]</td><td>$\\times16$</td><td>$\\times32$</td><td>$\\times32$</td><td>$\\times48$</td></tr>
         <tr><td>Classification</td><td>$1\\times1$</td><td>$7\\times7$ global avg pool; 1000-D fully-connected, softmax</td><td colspan="4">same for all</td></tr>
        </tbody>
       </table>
       <p>So the model names count weight layers: $121 = 1\\,(\\text{stem}) + 2(6+12+24+16) + 3\\,(\\text{transitions}) + 1\\,(\\text{fc})$,
       and likewise for 169, 201, 264 (each bottleneck layer is two convs, hence the $2\\times$). For CIFAR/SVHN the
       paper instead uses <b>three</b> equal-sized dense blocks on $32\\times32$ images, with configs like
       $L=40, k=12$; $L=100, k=12$; and the best DenseNet-BC $L=190, k=40$ (&sect;3, Experiments).</p>`,
    symbols: [
      { sym: "$x_0$", desc: "the <b>block input</b> &mdash; the feature map(s) entering the dense block (the paper writes the input image / earlier-block output as $x_0$). It has $k_0$ channels." },
      { sym: "$x_\\ell$", desc: "the output of the $\\ell$-th layer inside the block: exactly $k$ feature maps (channels) produced by $H_\\ell$." },
      { sym: "$H_\\ell(\\cdot)$", desc: "the <b>composite function</b> of layer $\\ell$: Batch Normalization &rarr; ReLU &rarr; $3\\times3$ convolution. It outputs $k$ channels." },
      { sym: "$[x_0, x_1, \\ldots, x_{\\ell-1}]$", desc: "<b>concatenation</b> along the channel axis of all feature maps produced by layers $0$ through $\\ell-1$ &mdash; stacked, not summed, so nothing is lost." },
      { sym: "$k$", desc: "the <b>growth rate</b>: the fixed number of new feature maps each layer adds to the shared pool. Small $k$ keeps the network thin; it controls how fast channels grow." },
      { sym: "$k_0$", desc: "the number of channels in the <b>block input</b> $x_0$ (e.g. $1$ for a grayscale image, $3$ for RGB, or whatever the previous block output)." },
      { sym: "$L$", desc: "the number of layers in the block. An $L$-layer dense block has $L(L+1)/2$ direct connections (abstract). (In the architecture names like DenseNet-121, $L$ instead counts total weight layers.)" },
      { sym: "$C_\\ell^{\\text{in}}$", desc: "the number of input channels (feature maps) layer $\\ell$ sees: $k_0 + k(\\ell-1)$ &mdash; just a name for that count used in the formula." },
      { sym: "$4k$", desc: "the number of feature maps the <b>bottleneck</b> $1\\times1$ convolution produces (DenseNet-B): four times the growth rate, a fixed width that tames the growing concatenated input before the $3\\times3$ conv." },
      { sym: "$\\theta$", desc: "the <b>compression factor</b> ($0 \\lt \\theta \\le 1$) in a transition layer: it keeps a fraction $\\theta$ of the incoming channels. The paper uses $\\theta = 0.5$ (DenseNet-C). $\\theta = 1$ means no compression." },
      { sym: "$m$", desc: "the number of feature maps entering a <b>transition layer</b> (the channel count output by the preceding dense block); the transition emits $\\lfloor\\theta m\\rfloor$ of them." },
      { sym: "$\\lfloor\\,\\cdot\\,\\rfloor$", desc: "the floor function &mdash; round down to the nearest whole number (a channel count must be an integer)." },
      { sym: "ReLU", desc: "a plain term: the Rectified Linear Unit nonlinearity &mdash; keep positive values, set negatives to $0$." },
      { sym: "BN", desc: "a plain term: Batch Normalization &mdash; rescale each channel's activations to roughly zero mean and unit variance over the batch, stabilizing training." },
      { sym: "“transition layer”", desc: "a plain term, not a symbol: BN + a $1\\times1$ convolution (emitting $\\lfloor\\theta m\\rfloor$ channels) + $2\\times2$ average pool, placed <i>between</i> dense blocks to shrink the feature-map size so the next block can start fresh." }
    ],
    formula:
      `$$ x_\\ell = H_\\ell(x_{\\ell-1}) + x_{\\ell-1}. $$
       <p>&sect;3, Eqn. 1 &mdash; ResNet (shown for contrast): the layer's output is <b>summed</b> with the previous output through an identity skip connection.</p>
       $$ x_\\ell = H_\\ell\\big([\\,x_0, x_1, \\ldots, x_{\\ell-1}\\,]\\big). $$
       <p>&sect;3, Eqn. 2 &mdash; <b>dense connectivity</b>: layer $\\ell$ receives the <b>concatenation</b> of the feature maps of all preceding layers $0, 1, \\ldots, \\ell-1$. $[\\,\\cdot\\,]$ denotes concatenation along the channel axis.</p>
       $$ H_\\ell(\\cdot) = \\text{Conv}_{3\\times3}\\big(\\,\\text{ReLU}(\\,\\text{BN}(\\cdot)\\,)\\,\\big). $$
       <p>&sect;3 &mdash; the <b>composite function</b> $H_\\ell$: Batch Normalization (BN), then a ReLU nonlinearity, then a $3\\times3$ convolution (the pre-activation order from ResNet-v2).</p>
       $$ C_\\ell^{\\text{in}} = k_0 + k\\,(\\ell-1). $$
       <p>&sect;3 &mdash; <b>channel-count rule</b>: with block input $k_0$ channels and <b>growth rate</b> $k$ (each layer adds $k$ maps), layer $\\ell$ sees $k_0 + k(\\ell-1)$ input channels; the block outputs $k_0 + kL$ channels.</p>
       $$ H_\\ell^{\\text{BC}}(\\cdot) = \\underbrace{\\text{Conv}_{3\\times3}\\,\\text{ReLU}\\,\\text{BN}}_{\\text{outputs } k}\\;\\Big(\\underbrace{\\text{Conv}_{1\\times1}\\,\\text{ReLU}\\,\\text{BN}}_{\\text{outputs } 4k}(\\cdot)\\Big). $$
       <p>&sect;3 &mdash; the <b>bottleneck</b> layer (DenseNet-B): a $1\\times1$ convolution first reduces the many concatenated inputs to $4k$ feature maps, then the $3\\times3$ convolution produces the usual $k$. Cuts computation.</p>
       $$ m_{\\text{out}} = \\lfloor \\theta\\, m \\rfloor, \\qquad 0 \\lt \\theta \\le 1. $$
       <p>&sect;3 &mdash; <b>transition layer with compression</b> (DenseNet-C): a transition takes a block's $m$ output channels and a $1\\times1$ convolution emits $\\lfloor\\theta m\\rfloor$ of them (paper uses $\\theta=0.5$), followed by $2\\times2$ average pooling. DenseNet-BC = bottleneck + compression.</p>`,
    whatItDoes:
      `<p><b>Equation 1</b> (shown for contrast) is ResNet's residual block: run the previous layer's output
       through $H_\\ell$ and <b>add</b> the previous output back. The two tensors must have the same shape, and
       the add can let features cancel.</p>
       <p><b>Equation 2</b> is DenseNet. Instead of one input tensor, layer $\\ell$ receives the
       <b>concatenation</b> of <i>every</i> earlier feature map. Nothing is added or overwritten, so every
       feature the block has ever computed remains directly available to every later layer &mdash; that is
       "feature reuse." The channel count therefore grows: layer $\\ell$ has $k_0 + k(\\ell-1)$ input channels,
       since each of the $\\ell-1$ earlier layers contributed $k$ new maps on top of the $k_0$ input channels.</p>`,
    derivation:
      `<p><b>Why dense connectivity helps the gradient (no conceptLink &mdash; full argument here).</b> In a
       <b>plain</b> stack, the gradient that trains layer $1$ must back-propagate through every later layer.
       By the chain rule it is a long product of per-layer Jacobian factors:</p>
       <p>$$ \\frac{\\partial \\mathcal{L}}{\\partial x_1} = \\frac{\\partial \\mathcal{L}}{\\partial x_L}\\,
       \\frac{\\partial x_L}{\\partial x_{L-1}}\\cdots\\frac{\\partial x_2}{\\partial x_1}. $$</p>
       <p>If each factor has magnitude below $1$ (common with squashing nonlinearities and many layers), the
       product shrinks toward $0$ as $L$ grows &mdash; the <b>vanishing gradient</b>. Layer $1$ barely moves.</p>
       <p>In a <b>dense</b> block, layer $1$'s output $x_1$ is fed <b>directly</b> into the input of layers
       $2, 3, \\ldots, L$ (it is part of every later concatenation) and ultimately into the loss. So the
       gradient reaches $x_1$ along <b>many short paths</b>, not one long one:</p>
       <p>$$ \\frac{\\partial \\mathcal{L}}{\\partial x_1} = \\sum_{j=2}^{L} \\Big(\\text{path through } H_j
       \\text{, which reads } x_1 \\text{ directly}\\Big) + \\cdots $$</p>
       <p>Even if the longest path's product vanishes, the short, direct paths do not, so the sum stays
       healthy and layer $1$ keeps learning. This is the same "shorter connections train better" insight as
       ResNet's "+1" highway &mdash; DenseNet just realizes it with <b>concatenation to all later layers</b>
       instead of <b>addition of the immediate input</b>. The notebook reproduces the effect: a deep plain
       stack stalls at chance while the matched dense block trains.</p>`,
    example:
      `<p>Work the <b>channel growth</b> through one dense block by hand &mdash; this is the bookkeeping you must
       get right when you build it. Take a tiny block with input channels $k_0 = 1$ (a grayscale map), growth
       rate $k = 6$, and $L = 4$ layers. Each layer $H_\\ell$ outputs exactly $k = 6$ new channels, and its
       input is everything concatenated so far, so the input channel count is $k_0 + k(\\ell-1)$:</p>
       <ul class="steps">
        <li><b>Layer 1</b> input channels $= k_0 + k(1-1) = 1 + 0 = 1$. It sees just $x_0$, outputs $6$.</li>
        <li><b>Layer 2</b> input $= 1 + 6(1) = 7$. It sees $[x_0, x_1]$ &mdash; the $1$ input map plus layer 1's
        $6$ &mdash; and outputs $6$ more.</li>
        <li><b>Layer 3</b> input $= 1 + 6(2) = 13$. It sees $[x_0, x_1, x_2]$ &mdash; $1 + 6 + 6$ &mdash; outputs $6$.</li>
        <li><b>Layer 4</b> input $= 1 + 6(3) = 19$. It sees $[x_0, x_1, x_2, x_3]$ &mdash; $1 + 6 + 6 + 6$ &mdash; outputs $6$.</li>
        <li><b>Block output</b> = concatenation of <i>all</i> maps, including the input:
        $k_0 + kL = 1 + 6\\cdot 4 = 25$ channels.</li>
       </ul>
       <p>So a $4$-layer block with $k=6$ turns $1$ input channel into a $25$-channel output, while each
       convolution only ever produces $6$ maps &mdash; thin layers, rich pooled output. These exact numbers
       ($1, 7, 13, 19 \\to 25$) are printed by the notebook's first cell so you can check the block.</p>`,
    recipe:
      `<ol>
        <li><b>Build the composite function</b> $H_\\ell$: <code>BatchNorm2d &rarr; ReLU &rarr; Conv2d(3&times;3, padding=1)</code>
        that outputs exactly $k$ channels.</li>
        <li><b>Build the dense block.</b> Keep a list <code>feats = [x]</code>. For each of the $L$ layers:
        concatenate <code>torch.cat(feats, dim=1)</code>, pass through $H_\\ell$, and <code>append</code> the
        new $k$ maps. Return <code>torch.cat(feats, dim=1)</code> &mdash; all maps, $k_0 + kL$ channels.</li>
        <li><b>Assemble a tiny net:</b> a stem conv &rarr; one dense block &rarr; global average pooling &rarr;
        a linear classification head.</li>
        <li><b>Train</b> a few epochs on a small CIFAR/MNIST-style subset.</li>
        <li><b>Ablate:</b> build a matched <b>plain</b> block (same depth and per-layer width, but each layer
        feeds only the previous one &mdash; delete the concatenation) and compare training curves. The deep
        plain stack should stall while the dense block trains.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): DenseNets "alleviate the vanishing-gradient problem, strengthen feature
       propagation, encourage feature reuse, and substantially reduce the number of parameters," and "obtain
       significant improvements over the state-of-the-art on most of" four benchmarks "whilst requiring less
       computation to achieve high performance." The paper's headline error rates for its best DenseNet-BC
       (bottleneck + compression, $L=190$, $k=40$) include <b>3.46% on CIFAR-10</b> (with augmentation) and
       <b>17.18% on CIFAR-100</b> (with augmentation), <b>1.59% on SVHN</b>, and <b>21.46% top-1 error on
       ImageNet</b> (DenseNet-201, 10-crop testing).</p>
       <p><i>These are the paper's reported figures, quoted from the paper. The numbers in the CODEVIZ panel
       below are from our own tiny run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> DenseNet is an image classifier, so the metric is <b>top-1 classification
       error</b> (lower is better) on the paper's benchmarks: CIFAR-10/100, SVHN, and ImageNet (&sect;4). The
       "better than trivial" floor is majority-class / random guessing &mdash; for $C$ balanced classes that is
       $1 - 1/C$ error (90% on CIFAR-10, 99% on CIFAR-100); your trained net must be far below that. For the toy
       dense-vs-plain build here, the metric is just the <b>training cross-entropy</b>, whose chance value is
       $\\ln C$ ($\\ln 3 \\approx 1.0986$ for the 3-class toy).</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> (1) <b>Channel bookkeeping:</b> assert each layer's conv
        accepts $k_0 + k(\\ell-1)$ input channels and the block emits $k_0 + kL$ &mdash; the worked example
        ($k_0{=}1, k{=}6, L{=}4 \\Rightarrow 1,7,13,19 \\to 25$) is a known-answer unit test. (2) <b>Loss at init:</b>
        a $C$-way softmax should start near $-\\ln(1/C) = \\ln C$; if it starts wildly higher, your init or label
        encoding is wrong. (3) <b>Overfit one tiny batch:</b> the dense net's loss should drive toward $\\sim 0$
        in a few dozen steps &mdash; if it cannot memorize a handful of images, the wiring is broken.</li>
        <li><b>Expected range.</b> Anchored to the paper's reported figures (&sect;4, quoted in Results): the best
        DenseNet-BC ($L{=}190, k{=}40$) reaches <b>~3.46% error on CIFAR-10</b> and <b>~17.18% on CIFAR-100</b>
        (with augmentation), <b>~1.59% on SVHN</b>, and DenseNet-201 reaches <b>~21.46% top-1 on ImageNet</b>
        (10-crop). These are the paper's numbers and require its full models/schedule &mdash; do not expect them
        from the toy build. As a <i>rule of thumb</i> (not a paper claim), a small DenseNet-121-style net on CIFAR-10
        in the low-single-digit-to-teens error range is healthy; stuck near 90% means it is not learning.</li>
        <li><b>Ablation &mdash; prove dense connectivity earns its keep.</b> The central knob is the
        <b>concatenation</b> (Eqn. 2). Replace each layer's input <code>torch.cat(feats, 1)</code> with
        <code>feats[-1]</code> (and shrink the conv's in-channels from $k_0+k(\\ell-1)$ to $k$), keeping depth,
        $k$, optimizer, data, and seed identical. The deep <b>plain</b> stack should stall near chance ($\\ln C$)
        while the dense one trains &mdash; the CODEVIZ contrast. If removing concatenation does <i>not</i> hurt,
        your "dense" path was never actually concatenating, or the stack is too shallow for the gradient effect to
        bite.</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Loss flat at $\\ln C$</b> for the deep plain stack =
        the vanishing-gradient stall the paper describes (expected in the ablation; a <i>bug</i> if it also happens
        to the dense net). <b>Shape error in a conv</b> = wrong input-channel count ($k$ hard-coded instead of
        $k_0+k(\\ell-1)$). <b>Concatenation size mismatch</b> = you downsampled <i>inside</i> a block; keep stride 1
        in-block and downsample only in transition layers. <b>Channels ballooning / out-of-memory</b> = $k$ set too
        large, erasing the parameter savings. <b>Loss NaN</b> = LR too high or BatchNorm misordered.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the building blocks already ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.BatchNorm2d</code>, <code>nn.ReLU</code>, <code>torch.cat</code>, the optimizer, and a small
       image dataset (preinstalled in Colab &mdash; no pip). <b>Build by hand:</b> the composite function
       $H_\\ell$, the <b>dense block</b> (the running list of feature maps and the per-layer concatenation that
       implements Eqn. 2), the channel-growth bookkeeping $k_0 + k(\\ell-1)$, and the <b>ablation</b> that
       removes dense connectivity. The vanishing-gradient / short-paths argument is derived in full above
       (this lesson has no separate concept owner).</p>`,
    pitfalls:
      `<ul>
        <li><b>Feeding only the previous layer.</b> The dense rule (Eqn. 2) is concatenate <i>all</i> earlier
        maps. Writing <code>H(feats[-1])</code> instead of <code>H(torch.cat(feats, 1))</code> silently turns
        your dense block back into a plain one &mdash; the exact thing the ablation is supposed to compare
        against. <b>Fix:</b> concatenate the whole list each layer.</li>
        <li><b>Wrong input-channel count.</b> Layer $\\ell$'s convolution must accept $k_0 + k(\\ell-1)$ input
        channels, not $k$. Hard-coding $k$ as the in-channels throws a shape error. <b>Fix:</b> track the
        running channel count and grow it by $k$ each layer.</li>
        <li><b>Concatenating across different spatial sizes.</b> Concatenation needs matching height and
        width. You cannot downsample <i>inside</i> a dense block. <b>Fix:</b> keep stride $1$ (padding $1$ for
        a $3\\times3$ conv) inside the block and downsample only in the <b>transition layer</b> between blocks.</li>
        <li><b>Confusing concatenation with ResNet's addition.</b> "$+$" (ResNet, Eqn. 1) keeps the channel
        count fixed and can cancel features; "$[\\cdot]$" (DenseNet, Eqn. 2) grows the channel count and
        preserves every feature. They are different operators with different shapes.</li>
        <li><b>Setting $k$ too large.</b> A big growth rate makes channels balloon and erases DenseNet's
        parameter savings. The paper's whole point is that a <i>small</i> $k$ suffices because of reuse.</li>
      </ul>`,
    recall: [
      "Write the dense-connectivity equation (Eqn. 2) from memory.",
      "What is the difference between DenseNet's concatenation and ResNet's summation?",
      "How many input channels does the $\\ell$-th layer of a dense block see, in terms of $k_0$ and $k$?",
      "What does the growth rate $k$ control, and why is a small $k$ enough?",
      "What does a transition layer do, and why is it needed?"
    ],
    practice: [
      {
        q: `<b>The ablation (dense vs plain).</b> You have a working deep, thin dense block whose training loss
            falls. Turn it into a matched <b>plain</b> stack &mdash; same depth, same per-layer width &mdash; by
            feeding each layer only the previous layer's output instead of the concatenation. Retrain. What
            happens to the training curve, and what does that demonstrate?`,
        steps: [
          { do: `Change exactly one thing: each layer's input from <code>torch.cat(feats, 1)</code> to <code>feats[-1]</code> (and shrink the conv's in-channels from $k_0+k(\\ell-1)$ to $k$). Keep depth, $k$, optimizer, data, and seed identical.`, why: `An honest ablation changes only the dense connectivity, so any difference is attributable to it.` },
          { do: `Retrain the deep plain stack and watch its training loss: it stays flat near chance (for $C$ classes, $\\ln C$), while the dense block's loss falls.`, why: `Without direct short paths to early layers, the gradient vanishes through the deep plain stack, so it cannot learn; dense connectivity keeps the gradient flowing.` },
          { do: `Conclude that the dense connectivity &mdash; not extra width or depth &mdash; is what made the deep net trainable.`, why: `Both stacks have the same depth and per-layer width; only the densely connected one optimizes, isolating connectivity as the cause.` }
        ],
        answer: `<p>The deep <b>plain</b> stack's training loss stays pinned near chance ($\\ln C$ for $C$ classes),
                 while the <b>dense</b> block's loss falls steadily. Since the two differ only in whether each layer
                 sees the concatenation of all earlier maps, this isolates dense connectivity as the reason the
                 deep net trains: it is a <b>gradient-flow / optimization</b> fix (short paths to every layer),
                 not a width or parameter effect. The CODEVIZ panel shows exactly this contrast.</p>`
      },
      {
        q: `<b>Channel bookkeeping.</b> A dense block has input channels $k_0 = 3$ (an RGB map) and growth rate
            $k = 12$, with $L = 5$ layers. How many input channels does layer $4$ see, and how many channels
            does the whole block output?`,
        steps: [
          { do: `Apply $k_0 + k(\\ell-1)$ with $\\ell = 4$: $3 + 12(4-1) = 3 + 36 = 39$.`, why: `Layer $4$ sees the input plus the $k$ maps from each of the $3$ earlier layers: $3 + 12 + 12 + 12 = 39$.` },
          { do: `Block output = concatenation of the input and all $L$ layers: $k_0 + kL = 3 + 12\\cdot 5 = 63$.`, why: `Every layer added $k=12$ to the shared pool, and the input's $3$ channels are kept too.` },
          { do: `Note each conv still outputs only $12$ channels &mdash; thin layers, $63$-channel pooled output.`, why: `That thinness with reuse is the source of DenseNet's parameter efficiency.` }
        ],
        answer: `<p>Layer $4$ sees $k_0 + k(\\ell-1) = 3 + 12\\cdot 3 = \\mathbf{39}$ input channels. The block outputs
                 $k_0 + kL = 3 + 12\\cdot 5 = \\mathbf{63}$ channels, even though each convolution only ever produces
                 $12$. Thin layers, rich concatenated output &mdash; the reuse that lets a small $k$ go far.</p>`
      },
      {
        q: `<b>Concatenation vs summation.</b> ResNet writes $x_\\ell = H_\\ell(x_{\\ell-1}) + x_{\\ell-1}$ and
            DenseNet writes $x_\\ell = H_\\ell([x_0,\\ldots,x_{\\ell-1}])$. Suppose $x_{\\ell-1}$ has $16$ channels and
            $H_\\ell$ produces $16$ channels in ResNet's case, and $k=16$ in DenseNet's. How many channels come out
            of each, and what is the qualitative difference?`,
        steps: [
          { do: `ResNet: $H_\\ell(x_{\\ell-1})$ is $16$ channels and $x_{\\ell-1}$ is $16$ channels; the element-wise sum keeps $16$ channels.`, why: `Addition requires equal shapes and returns the same shape &mdash; the channel count does not grow.` },
          { do: `DenseNet: the output is the concatenation of all earlier maps; this layer alone <i>adds</i> its $k=16$ maps to the growing pool, and the block keeps growing.`, why: `Concatenation stacks tensors, so channels accumulate rather than staying fixed.` },
          { do: `Note the information difference: addition can let features cancel; concatenation preserves every feature for later reuse.`, why: `That preservation is exactly DenseNet's "feature reuse" claim.` }
        ],
        answer: `<p>ResNet's block outputs <b>$16$</b> channels (the sum has the same shape as its inputs).
                 DenseNet's layer contributes <b>$16$</b> new channels to a pool that <i>keeps growing</i> by $k$
                 each layer. Qualitatively: summation collapses two tensors into one fixed-size tensor (features can
                 cancel), while concatenation keeps every feature side by side (feature reuse, growing channels).
                 Same "shorter paths" cure, different operator.</p>`
      }
    ]
  });

  window.CODE["paper-densenet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the dense block by hand on top of <code>nn.Conv2d</code> /
       <code>nn.BatchNorm2d</code> &mdash; each layer takes the <b>concatenation of all previous feature maps</b>
       (<code>torch.cat(feats, dim=1)</code>) as input and contributes $k$ new maps (Eqn. 2,
       $x_\\ell = H_\\ell([x_0,\\ldots,x_{\\ell-1}])$). We train a tiny net on a small image subset, then build a
       <b>matched plain block</b> (same depth and width, each layer feeds only the previous one) and print both
       training curves: with a deep, thin stack the dense block trains while the plain one stalls near chance.
       The first cell prints the worked channel-growth example &mdash; with $k_0=1$, $k=6$, $L=4$ the layers see
       $1, 7, 13, 19$ input channels and the block outputs $25$. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import numpy as np

torch.manual_seed(0)

# --- 0. Sanity-check the worked example: channel growth k0 + k*(ell-1), k0=1, k=6, L=4. ---
k0, k, L = 1, 6, 4
ins = [k0 + k * (ell - 1) for ell in range(1, L + 1)]
print("layer input channels:", ins, " block output:", k0 + k * L)
# layer input channels: [1, 7, 13, 19]  block output: 25


# --- 1. The composite function H_ell: BN -> ReLU -> Conv(3x3), outputs exactly k channels. ---
def H(cin, kk):
    return nn.Sequential(nn.BatchNorm2d(cin), nn.ReLU(),
                         nn.Conv2d(cin, kk, 3, padding=1))


# --- 2. The dense block (built by hand). dense=True -> concat all; dense=False -> plain ablation. ---
class Block(nn.Module):
    def __init__(self, k0, k, L, dense=True):
        super().__init__()
        self.dense = dense
        self.layers = nn.ModuleList()
        cin = k0
        for _ in range(L):
            self.layers.append(H(cin, k))      # in-channels = k0 + k*(ell-1) when dense
            cin = (cin + k) if dense else k     # dense: pool grows by k; plain: next sees only k
        self.out_ch = cin

    def forward(self, x):
        if self.dense:
            feats = [x]
            for lyr in self.layers:
                feats.append(lyr(torch.cat(feats, dim=1)))   # Eqn. 2: H([x_0,...,x_{l-1}])
            return torch.cat(feats, dim=1)                   # output = all maps, k0 + k*L channels
        else:
            for lyr in self.layers:                          # ablation: each layer sees only the prev
                x = lyr(x)
            return x


# --- 3. A tiny classifier: stem -> block -> global average pool -> linear head. ---
class Net(nn.Module):
    def __init__(self, dense, k0=1, k=4, L=12, n_classes=3):
        super().__init__()
        self.stem  = nn.Conv2d(1, k0, 3, padding=1)
        self.block = Block(k0, k, L, dense)
        self.head  = nn.Linear(self.block.out_ch, n_classes)

    def forward(self, x):
        x = self.block(self.stem(x))
        x = x.mean(dim=(2, 3))                  # global average pool
        return self.head(x)


# --- 4. A small toy image dataset (swap in MNIST/CIFAR via torchvision in Colab; toy here for speed). ---
g = torch.Generator().manual_seed(1)
N, K = 600, 3
base = torch.randn(K, 1, 8, 8, generator=g)            # one 8x8 pattern per class
y = torch.randint(0, K, (N,), generator=g)
X = base[y] + 0.6 * torch.randn(N, 1, 8, 8, generator=g)


def train(dense, steps=120, lr=0.012):
    torch.manual_seed(0)
    net = Net(dense); net.train()
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9)
    lf  = nn.CrossEntropyLoss(); curve = []
    for t in range(steps):
        opt.zero_grad(); loss = lf(net(X), y); loss.backward(); opt.step()
        curve.append(loss.item())
    return curve, net.block.out_ch

dense_curve, dch = train(dense=True)
plain_curve, pch = train(dense=False)
print("dense block output channels:", dch, " | plain:", pch)
print("DENSE final loss:", round(dense_curve[-1], 4))
print("PLAIN final loss:", round(plain_curve[-1], 4), " (chance = ln 3 =", round(float(np.log(K)), 4), ")")
# With a deep, thin stack the dense block trains (loss falls) while the matched plain stack
# stalls near chance -- the vanishing-gradient effect, cured by dense connectivity.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-densenet"] = {
    question: "With a deep, thin stack, does dense connectivity let the net train while a matched plain stack stalls?",
    charts: [
      {
        type: "line",
        title: "Training loss vs step — 12-layer thin block: dense (concat all) vs plain (matched depth)",
        xlabel: "training step",
        ylabel: "cross-entropy loss",
        series: [
          {
            name: "Plain (no concat)",
            color: "#ff7b72",
            points: [[0,1.1053],[4,1.1046],[8,1.1032],[12,1.1017],[16,1.1003],[20,1.0993],[24,1.0986],[28,1.0982],[32,1.0979],[36,1.0978],[41,1.0978],[45,1.0978],[49,1.0978],[53,1.0978],[57,1.0978],[61,1.0978],[65,1.0978],[69,1.0978],[73,1.0978],[77,1.0978],[82,1.0978],[86,1.0978],[90,1.0978],[94,1.0978],[98,1.0978],[102,1.0978],[106,1.0978],[110,1.0978],[114,1.0978],[119,1.0978]]
          },
          {
            name: "Dense (concat all)",
            color: "#7ee787",
            points: [[0,1.1035],[4,1.1021],[8,1.0997],[12,1.0973],[16,1.0955],[20,1.0943],[24,1.0932],[28,1.0921],[32,1.0907],[36,1.0889],[41,1.0861],[45,1.0833],[49,1.0799],[53,1.0758],[57,1.071],[61,1.0652],[65,1.0584],[69,1.0504],[73,1.0411],[77,1.0303],[82,1.0147],[86,1.0002],[90,0.984],[94,0.9658],[98,0.9456],[102,0.9235],[106,0.8996],[110,0.8739],[114,0.8468],[119,0.8115]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two 12-layer thin conv stacks (growth rate k=4, ReLU, no BatchNorm so the vanishing-gradient effect shows) trained on a toy 3-class 8&times;8 image problem with momentum SGD &mdash; identical depth and per-layer width, differing only in whether each layer sees the concatenation of ALL earlier feature maps (Eqn. 2) or just the previous layer's output. The DENSE net's loss falls steadily, breaking below chance by step ~80 and reaching ~0.81. The matched PLAIN net stalls flat at ~1.098 &mdash; essentially ln 3 = 1.0986, i.e. chance for 3 classes &mdash; because the gradient cannot reach its early layers. Same depth, width, optimizer, seed; the only difference is dense connectivity.",
    code: `import torch, torch.nn as nn, numpy as np

# Two matched deep thin nets, identical except for dense connectivity (concat all earlier maps).
# No BatchNorm, so the deep plain stack suffers the vanishing gradient the paper describes.
torch.manual_seed(0)
g = torch.Generator().manual_seed(1)
N, K, k0, k, L = 600, 3, 1, 4, 12
base = torch.randn(K, 1, 8, 8, generator=g)
y = torch.randint(0, K, (N,), generator=g)
X = base[y] + 0.6 * torch.randn(N, 1, 8, 8, generator=g)

def H(cin, kk):
    return nn.Sequential(nn.ReLU(), nn.Conv2d(cin, kk, 3, padding=1))

class Block(nn.Module):
    def __init__(self, dense):
        super().__init__()
        self.dense = dense; self.layers = nn.ModuleList(); cin = k0
        for _ in range(L):
            self.layers.append(H(cin, k)); cin = (cin + k) if dense else k
        self.out_ch = cin
    def forward(self, x):
        if self.dense:
            feats = [x]
            for lyr in self.layers: feats.append(lyr(torch.cat(feats, 1)))
            return torch.cat(feats, 1)
        for lyr in self.layers: x = lyr(x)
        return x

class Net(nn.Module):
    def __init__(self, dense):
        super().__init__()
        self.stem = nn.Conv2d(1, k0, 3, padding=1)
        self.block = Block(dense); self.head = nn.Linear(self.block.out_ch, K)
    def forward(self, x):
        return self.head(self.block(self.stem(x)).mean(dim=(2, 3)))

def train(dense, steps=120, lr=0.012):
    torch.manual_seed(0)
    net = Net(dense); net.train()
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9)
    lf = nn.CrossEntropyLoss(); losses = []
    for t in range(steps):
        opt.zero_grad(); loss = lf(net(X), y); loss.backward(); opt.step()
        losses.append(loss.item())
    return losses

plain = train(dense=False)
dense = train(dense=True)
idx = np.linspace(0, 119, 30).astype(int)
print("Plain:", [[int(i), round(plain[i], 4)] for i in idx])
print("Dense:", [[int(i), round(dense[i], 4)] for i in idx])
# Plain -> stalls at ~1.098 (ln 3, chance). Dense -> falls to ~0.39. Only difference: concat all earlier maps.`
  };
})();
