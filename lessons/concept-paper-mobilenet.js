/* Paper lesson — "MobileNets: Efficient Convolutional Neural Networks for Mobile Vision
   Applications", Howard et al. 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-mobilenet".
   GROUNDED from arXiv:1704.04861 (abstract) and the ar5iv HTML mirror (Section 3.1, Eqns 2,4,5
   and the reduction-ratio expression; Table 4 ablation).
   Track B (architecture): build the depthwise-separable convolution (depthwise + pointwise 1x1)
   by hand on top of nn.Conv2d, derive the FLOP/param reduction, and ablate full conv vs separable. */
(function () {
  window.LESSONS.push({
    id: "paper-mobilenet",
    title: "MobileNets — Efficient CNNs for Mobile Vision Applications (2017)",
    tagline: "Split a normal convolution into a per-channel filter plus a 1x1 mixer, cutting compute 8-9x.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Andrew G. Howard, Menglong Zhu, Bo Chen, Dmitry Kalenichenko, Weijun Wang, Tobias Weyand, Marco Andreetto, Hartwig Adam",
      org: "Google",
      year: 2017,
      venue: "arXiv:1704.04861 (Apr 2017)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1704.04861",
      url: "https://arxiv.org/abs/1704.04861",
      code: "https://github.com/tensorflow/models/tree/master/research/slim/nets/mobilenet"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-conv", "pt-cnn", "pt-nn-module", "dl-batchnorm"],

    // WHY READ IT
    problem:
      `<p>By 2017 the most accurate image models (VGG, GoogLeNet, ResNet) were also <b>heavy</b>: billions of
       multiply-add operations and tens of millions of weights per image. That is fine on a server with a big
       graphics card, but a phone, a drone, or a smart camera has a tiny battery and a small chip. The paper
       opens on exactly this gap (&sect;1):</p>
       <blockquote>"The general trend has been to make deeper and more complicated networks in order to achieve
       higher accuracy. However, these advances to improve accuracy are not necessarily making networks more
       efficient with respect to size and speed."</blockquote>
       <p>The bottleneck is the ordinary <b>convolution</b>. A convolution is the basic CNN operation: it slides
       a small stack of learnable filters over the image and, at every position, mixes <i>all</i> input channels
       at once to produce <i>every</i> output channel. Doing both jobs &mdash; spatial filtering AND cross-channel
       mixing &mdash; in one shot is what makes it expensive. (A "channel" here is one feature map: a colour image
       starts with 3 channels; deeper layers have dozens or hundreds.)</p>`,
    contribution:
      `<ul>
        <li><b>The depthwise-separable convolution as a building block.</b> Replace one standard convolution
        with two cheaper steps: a <b>depthwise</b> convolution that filters each input channel on its own (no
        cross-channel mixing), followed by a <b>pointwise</b> $1\\times1$ convolution that mixes the channels.
        Same job, far less arithmetic.</li>
        <li><b>A clean cost analysis.</b> The paper shows in closed form (&sect;3.1) that this split costs a
        fraction $\\tfrac{1}{N} + \\tfrac{1}{D_K^2}$ of a standard convolution &mdash; "between 8 to 9 times less
        computation" for the $3\\times3$ filters MobileNet uses, "at only a small reduction in accuracy."</li>
        <li><b>Two shrink knobs.</b> A <b>width multiplier</b> $\\alpha$ that thins every layer's channel count
        and a <b>resolution multiplier</b> $\\rho$ that shrinks the input image &mdash; two simple dials to trade
        accuracy for speed without redesigning the network.</li>
      </ul>`,
    whyItMattered:
      `<p>The depthwise-separable convolution became the standard way to build small, fast vision models.
       MobileNet&nbsp;V2 and V3, ShuffleNet, EfficientNet, and most "edge" CNNs are built on this same split.
       The trick now ships as a one-line option in every framework (set <code>groups=in_channels</code> on a
       convolution to get the depthwise half), and it is why on-device photo, face, and scene models can run in
       real time on a phone.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Depthwise Separable Convolution)</b> &mdash; the whole math of the lesson. The four
        cost equations (standard, eqn&nbsp;2; depthwise, eqn&nbsp;4; separable sum, eqn&nbsp;5) and the
        reduction-ratio expression $\\tfrac{1}{N}+\\tfrac{1}{D_K^2}$ are here.</li>
        <li><b>Fig. 2 &amp; 3</b> &mdash; the picture: one fat standard filter (Fig. 2a) split into a depthwise
        filter (Fig. 2b) plus a $1\\times1$ pointwise filter (Fig. 2c); and the BatchNorm+ReLU block (Fig. 3).</li>
        <li><b>Table 1</b> &mdash; the full MobileNet body, to see how the dw/pw pair repeats.</li>
        <li><b>Table 4</b> &mdash; the key ablation: full-convolution MobileNet vs the depthwise-separable one
        (the accuracy-vs-cost trade you will reproduce in miniature).</li>
       </ul>
       <p><b>Skim:</b> &sect;4's many application tables (detection, face attributes, geo-localization) unless you
       care about a specific task; the $\\alpha$/$\\rho$ sweep tables (&sect;4) once you have the idea.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>A standard $3\\times3$ convolution turning $M=32$ input channels into $N=64$ output channels does
       spatial filtering and channel mixing together. The depthwise-separable version does them in two steps.
       Before reading the formula: roughly how much <b>cheaper</b> do you expect the two-step version to be for
       $3\\times3$ filters &mdash; about the same, ~2x, ~5x, or ~10x? And will it cost you a <i>large</i> or a
       <i>small</i> amount of accuracy? Write your guess, then check it against the worked numbers and the
       ablation.</p>`,
    attempt:
      `<p>Before the reveal, sketch the block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>DepthwiseSeparable(nn.Module)</code> taking <code>in_ch</code> &rarr; <code>out_ch</code>.</li>
        <li>TODO: the <b>depthwise</b> step &mdash; a $3\\times3$ <code>nn.Conv2d(in_ch, in_ch, 3, padding=1,
        groups=in_ch, bias=False)</code>. The <code>groups=in_ch</code> is the whole trick: it forces each input
        channel to be filtered by its own filter, with <b>no</b> cross-channel mixing. Then BatchNorm + ReLU.</li>
        <li>TODO: the <b>pointwise</b> step &mdash; a $1\\times1$ <code>nn.Conv2d(in_ch, out_ch, 1, bias=False)</code>
        that mixes channels at each pixel. Then BatchNorm + ReLU.</li>
        <li>TODO: write the multiply-add cost of each step and confirm the ratio to a standard conv is
        $\\tfrac{1}{N} + \\tfrac{1}{D_K^2}$.</li>
       </ul>
       <p>Then build a matched <b>full-convolution</b> net (replace each separable block with one ordinary
       $3\\times3$ conv) and predict the accuracy and parameter-count gap.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start with what a <b>standard convolution</b> actually does. It has a bank of $N$ filters; each filter
       is a little $D_K\\times D_K$ window that spans <i>all</i> $M$ input channels. To produce one output pixel
       in one output channel, it multiplies-and-sums over $D_K\\times D_K\\times M$ numbers. It does this for every
       one of the $N$ output channels and every one of the $D_F\\times D_F$ output positions. Multiply those
       together and the cost is $D_K\\cdot D_K\\cdot M\\cdot N\\cdot D_F\\cdot D_F$ (&sect;3.1, eqn&nbsp;2). Notice it
       is doing two things at once: <b>filtering</b> (the spatial $D_K\\times D_K$ window) and <b>combining</b>
       channels (summing across all $M$ inputs into each of $N$ outputs).</p>
       <p>The paper's idea is to <b>factor those two jobs apart</b> (&sect;3.1):</p>
       <ol>
        <li><b>Depthwise convolution</b> &mdash; do only the spatial filtering. Give each input channel its own
        single $D_K\\times D_K$ filter and keep the channels separate (no mixing). There are $M$ channels, each
        filtered once, so the cost drops the $N$ factor entirely: $D_K\\cdot D_K\\cdot M\\cdot D_F\\cdot D_F$
        (eqn&nbsp;4). The output still has $M$ channels.</li>
        <li><b>Pointwise convolution</b> &mdash; now do only the channel mixing, with a $1\\times1$ convolution.
        A $1\\times1$ filter has no spatial window ($D_K=1$); at each pixel it just takes a weighted combination
        of the $M$ channels to produce each of the $N$ outputs. Its cost is $M\\cdot N\\cdot D_F\\cdot D_F$.</li>
       </ol>
       <p>Run them back to back and you get the same shape of output as the original standard convolution
       (filtered, then mixed into $N$ channels) &mdash; this two-step combo is the <b>depthwise-separable
       convolution</b>. Its total cost is the sum (eqn&nbsp;5):
       $D_K\\cdot D_K\\cdot M\\cdot D_F\\cdot D_F + M\\cdot N\\cdot D_F\\cdot D_F$. In MobileNet, each depthwise and
       each pointwise layer is followed by <b>Batch Normalization</b> (a per-channel rescale that stabilizes
       training) and a <b>ReLU</b> (Rectified Linear Unit: keep positives, zero negatives), as shown in
       Fig.&nbsp;3.</p>`,
    architecture:
      `<p>The full <b>MobileNet body</b> (Table&nbsp;1) is one ordinary $3\\times3$ convolution at the front, then
       <b>13 depthwise-separable blocks</b>, then average-pool &rarr; fully-connected &rarr; softmax. Each
       "Conv dw" row is a depthwise filter and the "Conv" $1\\times1$ row right below it is its pointwise mixer;
       that dw + pw pair is one separable block. Down-sampling is done by stride-2 depthwise convs (and the
       first conv), which halve the spatial side; channel counts double as resolution halves. Every conv
       (depthwise and pointwise) is followed by BatchNorm + ReLU (Fig.&nbsp;3) &mdash; omitted from the table for
       brevity. Counting the dw rows below gives 13 separable blocks (one of them written as "5&times;" at the
       $14\\times14$ stage).</p>
       <table class="arch">
        <thead><tr><th>Type / Stride</th><th>Filter shape</th><th>Input size</th></tr></thead>
        <tbody>
         <tr><td>Conv / s2</td><td>$3\\times3\\times3\\times32$</td><td>$224\\times224\\times3$</td></tr>
         <tr><td>Conv dw / s1</td><td>$3\\times3\\times32$ dw</td><td>$112\\times112\\times32$</td></tr>
         <tr><td>Conv / s1</td><td>$1\\times1\\times32\\times64$</td><td>$112\\times112\\times32$</td></tr>
         <tr><td>Conv dw / s2</td><td>$3\\times3\\times64$ dw</td><td>$112\\times112\\times64$</td></tr>
         <tr><td>Conv / s1</td><td>$1\\times1\\times64\\times128$</td><td>$56\\times56\\times64$</td></tr>
         <tr><td>Conv dw / s1</td><td>$3\\times3\\times128$ dw</td><td>$56\\times56\\times128$</td></tr>
         <tr><td>Conv / s1</td><td>$1\\times1\\times128\\times128$</td><td>$56\\times56\\times128$</td></tr>
         <tr><td>Conv dw / s2</td><td>$3\\times3\\times128$ dw</td><td>$56\\times56\\times128$</td></tr>
         <tr><td>Conv / s1</td><td>$1\\times1\\times128\\times256$</td><td>$28\\times28\\times128$</td></tr>
         <tr><td>Conv dw / s1</td><td>$3\\times3\\times256$ dw</td><td>$28\\times28\\times256$</td></tr>
         <tr><td>Conv / s1</td><td>$1\\times1\\times256\\times256$</td><td>$28\\times28\\times256$</td></tr>
         <tr><td>Conv dw / s2</td><td>$3\\times3\\times256$ dw</td><td>$28\\times28\\times256$</td></tr>
         <tr><td>Conv / s1</td><td>$1\\times1\\times256\\times512$</td><td>$14\\times14\\times256$</td></tr>
         <tr><td>$5\\times$ Conv dw / s1</td><td>$3\\times3\\times512$ dw</td><td>$14\\times14\\times512$</td></tr>
         <tr><td>$5\\times$ Conv / s1</td><td>$1\\times1\\times512\\times512$</td><td>$14\\times14\\times512$</td></tr>
         <tr><td>Conv dw / s2</td><td>$3\\times3\\times512$ dw</td><td>$14\\times14\\times512$</td></tr>
         <tr><td>Conv / s1</td><td>$1\\times1\\times512\\times1024$</td><td>$7\\times7\\times512$</td></tr>
         <tr><td>Conv dw / s2</td><td>$3\\times3\\times1024$ dw</td><td>$7\\times7\\times1024$</td></tr>
         <tr><td>Conv / s1</td><td>$1\\times1\\times1024\\times1024$</td><td>$7\\times7\\times1024$</td></tr>
         <tr><td>Avg Pool / s1</td><td>Pool $7\\times7$</td><td>$7\\times7\\times1024$</td></tr>
         <tr><td>FC / s1</td><td>$1024\\times1000$</td><td>$1\\times1\\times1024$</td></tr>
         <tr><td>Softmax / s1</td><td>Classifier</td><td>$1\\times1\\times1000$</td></tr>
        </tbody>
       </table>
       <p>So the model is: 1 standard conv + 13 separable blocks (each = depthwise + pointwise) = 27 conv
       layers, plus the pooling/FC/softmax head. The width multiplier $\\alpha$ scales every channel count in
       this table by $\\alpha$; the resolution multiplier $\\rho$ scales every "Input size" spatial dimension by
       $\\rho$.</p>`,
    symbols: [
      { sym: "$D_K$", desc: "the <b>kernel size</b>: the side length of the square filter window. MobileNet uses $D_K = 3$ (a $3\\times3$ filter)." },
      { sym: "$M$", desc: "the number of <b>input channels</b> (input feature maps) fed into the convolution." },
      { sym: "$N$", desc: "the number of <b>output channels</b> the convolution produces." },
      { sym: "$D_F$", desc: "the <b>spatial size</b> of the feature map (its width and height in pixels, assumed square). The map has $D_F\\times D_F$ positions." },
      { sym: "“standard convolution”", desc: "the ordinary CNN convolution: one bank of $N$ filters, each spanning all $M$ input channels, doing spatial filtering AND channel mixing together." },
      { sym: "“depthwise convolution”", desc: "spatial filtering only: each of the $M$ input channels gets its own single filter; channels are NOT mixed. Output keeps $M$ channels. (In code: a conv with <code>groups</code> equal to the channel count.)" },
      { sym: "“pointwise convolution”", desc: "channel mixing only: a $1\\times1$ convolution that, at each pixel, linearly combines the $M$ channels into each of the $N$ outputs. No spatial window." },
      { sym: "“depthwise-separable convolution”", desc: "the depthwise step followed by the pointwise step &mdash; the paper's building block that replaces one standard convolution." },
      { sym: "$\\alpha$", desc: "the <b>width multiplier</b> ($0\\lt\\alpha\\le1$): thins every layer, turning $M\\to\\alpha M$ and $N\\to\\alpha N$. Cost scales by $\\alpha^2$." },
      { sym: "$\\rho$", desc: "the <b>resolution multiplier</b> ($0\\lt\\rho\\le1$): shrinks the input image, turning $D_F\\to\\rho D_F$. Cost scales by $\\rho^2$." }
    ],
    formula: `$$ \\mathbf{G}_{k,l,n} = \\sum_{i,j,m} \\mathbf{K}_{i,j,m,n}\\cdot \\mathbf{F}_{k+i-1,\\,l+j-1,\\,m} $$
       <p>What one standard convolution computes (&sect;3.1, eqn&nbsp;1): output pixel $(k,l)$ of output channel $n$ sums the kernel $\\mathbf{K}$ against the input $\\mathbf{F}$ over the spatial window $(i,j)$ AND all input channels $m$.</p>
       $$ D_K\\cdot D_K\\cdot M\\cdot N\\cdot D_F\\cdot D_F $$
       <p>Cost of that standard convolution in multiply-adds (&sect;3.1, eqn&nbsp;2): kernel area $\\times$ input channels $\\times$ output channels $\\times$ feature-map area.</p>
       $$ \\hat{\\mathbf{G}}_{k,l,m} = \\sum_{i,j} \\hat{\\mathbf{K}}_{i,j,m}\\cdot \\mathbf{F}_{k+i-1,\\,l+j-1,\\,m} $$
       <p>The depthwise convolution (&sect;3.1, eqn&nbsp;3): each input channel $m$ gets its own single filter $\\hat{\\mathbf{K}}$; there is no sum over channels, so channels are filtered but never mixed.</p>
       $$ D_K\\cdot D_K\\cdot M\\cdot D_F\\cdot D_F $$
       <p>Cost of the depthwise step (&sect;3.1, eqn&nbsp;4): the $N$ factor is gone &mdash; only $M$ channels, each filtered once.</p>
       $$ D_K\\cdot D_K\\cdot M\\cdot D_F\\cdot D_F \\;+\\; M\\cdot N\\cdot D_F\\cdot D_F $$
       <p>Cost of the full <b>depthwise-separable</b> convolution (&sect;3.1, eqn&nbsp;5): the depthwise step (left) plus the $1\\times1$ pointwise step $M\\cdot N\\cdot D_F\\cdot D_F$ (right) that does the channel mixing.</p>
       $$ \\frac{D_K\\cdot D_K\\cdot M\\cdot D_F\\cdot D_F + M\\cdot N\\cdot D_F\\cdot D_F}{D_K\\cdot D_K\\cdot M\\cdot N\\cdot D_F\\cdot D_F} \\;=\\; \\frac{1}{N} + \\frac{1}{D_K^{2}} $$
       <p>The reduction ratio (&sect;3.1): separable cost over standard cost. Almost everything cancels, leaving $\\tfrac1N+\\tfrac1{D_K^2}$ &mdash; "8 to 9 times less computation" for the $3\\times3$ filters MobileNet uses.</p>
       $$ D_K\\cdot D_K\\cdot \\alpha M\\cdot D_F\\cdot D_F \\;+\\; \\alpha M\\cdot \\alpha N\\cdot D_F\\cdot D_F $$
       <p>With the <b>width multiplier</b> $\\alpha$ (&sect;3.3, eqn&nbsp;6): every channel count $M,N$ is thinned to $\\alpha M,\\alpha N$ ($0\\lt\\alpha\\le1$). The pointwise term has two $\\alpha$ factors, so cost scales by roughly $\\alpha^2$.</p>
       $$ D_K\\cdot D_K\\cdot \\alpha M\\cdot \\rho D_F\\cdot \\rho D_F \\;+\\; \\alpha M\\cdot \\alpha N\\cdot \\rho D_F\\cdot \\rho D_F $$
       <p>Adding the <b>resolution multiplier</b> $\\rho$ (&sect;3.3, eqn&nbsp;7): the feature-map side $D_F$ is shrunk to $\\rho D_F$ ($0\\lt\\rho\\le1$). The two $\\rho$ factors scale cost by $\\rho^2$. Together $\\alpha$ and $\\rho$ dial total cost by about $\\alpha^2\\rho^2$.</p>`,
    whatItDoes:
      `<p>The top is the cost of the cheap two-step version (eqn&nbsp;5); the bottom is the cost of the standard
       convolution it replaces (eqn&nbsp;2). Divide and almost everything cancels &mdash; the shared
       $M\\cdot D_F\\cdot D_F$ factors disappear &mdash; leaving the paper's reduction ratio
       $\\tfrac{1}{N} + \\tfrac{1}{D_K^{2}}$ (&sect;3.1). It says the separable convolution costs that fraction of
       the original. For MobileNet's $3\\times3$ filters ($D_K=3$, so $\\tfrac{1}{D_K^2}=\\tfrac{1}{9}$) and the
       large channel counts deep in the net ($N$ in the hundreds, so $\\tfrac{1}{N}$ is tiny), the ratio is close
       to $\\tfrac{1}{9}$ &mdash; the paper's "8 to 9 times less computation."</p>`,
    derivation:
      `<p>The cancellation is the whole proof. Take the ratio of separable cost (eqn&nbsp;5) to standard cost
       (eqn&nbsp;2):</p>
       <p>$$ \\frac{D_K^2\\, M\\, D_F^2 \\;+\\; M\\, N\\, D_F^2}{D_K^2\\, M\\, N\\, D_F^2}. $$</p>
       <p>Split the single fraction into its two terms (each term over the common denominator):</p>
       <p>$$ \\frac{D_K^2\\, M\\, D_F^2}{D_K^2\\, M\\, N\\, D_F^2} \\;+\\; \\frac{M\\, N\\, D_F^2}{D_K^2\\, M\\, N\\, D_F^2}. $$</p>
       <p>In the <b>first</b> term, $D_K^2$, $M$, and $D_F^2$ all cancel, leaving $\\tfrac{1}{N}$ (this is the
       depthwise part's share). In the <b>second</b> term, $M$, $N$, and $D_F^2$ cancel, leaving
       $\\tfrac{1}{D_K^2}$ (the pointwise part's share). Add them:</p>
       <p>$$ \\frac{1}{N} + \\frac{1}{D_K^2}. $$</p>
       <p>That is exactly the paper's expression. The two-step factorization saves the most when channels are
       many ($\\tfrac{1}{N}\\to0$) and the kernel is reasonably large ($\\tfrac{1}{D_K^2}$ small but fixed at
       $\\tfrac19$ for $3\\times3$). This is self-contained algebra, so there is no separate concept lesson to
       defer to.</p>`,
    example:
      `<p>Work one layer by hand with small numbers. Take a $3\\times3$ convolution on an $8\\times8$ feature map
       that turns $M=3$ input channels into $N=4$ output channels: so $D_K=3$, $M=3$, $N=4$, $D_F=8$.</p>
       <ul class="steps">
        <li><b>Standard convolution</b> (eqn&nbsp;2): $D_K\\cdot D_K\\cdot M\\cdot N\\cdot D_F\\cdot D_F =
        3\\cdot3\\cdot3\\cdot4\\cdot8\\cdot8 = 9\\cdot12\\cdot64 = \\mathbf{6912}$ multiply-adds.</li>
        <li><b>Depthwise step</b> (eqn&nbsp;4): $D_K\\cdot D_K\\cdot M\\cdot D_F\\cdot D_F =
        3\\cdot3\\cdot3\\cdot8\\cdot8 = 9\\cdot3\\cdot64 = \\mathbf{1728}$. (Note the $N$ is gone.)</li>
        <li><b>Pointwise step</b> ($1\\times1$): $M\\cdot N\\cdot D_F\\cdot D_F = 3\\cdot4\\cdot8\\cdot8 =
        12\\cdot64 = \\mathbf{768}$.</li>
        <li><b>Separable total</b> (eqn&nbsp;5): $1728 + 768 = \\mathbf{2496}$ multiply-adds.</li>
        <li><b>Ratio</b>: $2496 / 6912 = \\mathbf{0.3611}$ &mdash; the separable version costs about 36% as much,
        i.e. roughly <b>2.8x cheaper</b>. Check it against the formula:
        $\\tfrac{1}{N} + \\tfrac{1}{D_K^2} = \\tfrac14 + \\tfrac19 = 0.25 + 0.1111 = \\mathbf{0.3611}$. Exact match.</li>
       </ul>
       <p>Here the saving is "only" 2.8x because $N=4$ is small, so $\\tfrac1N=0.25$ dominates. Deep in a real
       MobileNet $N$ is in the hundreds, $\\tfrac1N\\to0$, and the ratio approaches $\\tfrac19\\approx0.11$ &mdash;
       the 8-9x the paper quotes. The notebook recomputes all five of these numbers so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build the depthwise-separable block</b> (<code>DepthwiseSeparable</code>): a $3\\times3$ depthwise
        conv (<code>groups=in_ch</code>) &rarr; BatchNorm &rarr; ReLU, then a $1\\times1$ pointwise conv &rarr;
        BatchNorm &rarr; ReLU. This pair replaces one standard $3\\times3$ convolution.</li>
        <li><b>Stack a couple of these blocks</b> with a small linear classification head (global average pool
        then a linear layer) into a tiny MobileNet-style net.</li>
        <li><b>Build the matched full-convolution net</b>: same channel widths and depth, but each separable
        block swapped for one ordinary $3\\times3$ <code>nn.Conv2d</code> (+ BatchNorm + ReLU).</li>
        <li><b>Count and compare</b> the parameters and the multiply-adds of the two nets &mdash; confirm the
        separable one is several times smaller and cheaper.</li>
        <li><b>Train both</b> a little on toy data and compare test accuracy: the separable net should land
        close to the full-conv one (the "small reduction in accuracy" trade).</li>
      </ol>`,
    results:
      `<p>The paper's headline ablation (Table&nbsp;4, "Depthwise Separable vs Full Convolution MobileNet")
       quotes: the full-convolution MobileNet reaches <b>71.7%</b> ImageNet accuracy using <b>4866</b> million
       multiply-adds and <b>29.3</b> million parameters, while the depthwise-separable MobileNet reaches
       <b>70.6%</b> using only <b>569</b> million multiply-adds and <b>4.2</b> million parameters. So separating
       the convolution costs about <b>1 percentage point</b> of accuracy while cutting compute ~8.6x and
       parameters ~7x. Against bigger models (Table&nbsp;8): VGG-16 is quoted at 71.5% with 15300M mult-adds and
       138M parameters &mdash; MobileNet nearly matches it at a tiny fraction of the cost.</p>
       <p><i>These are the paper's reported figures, quoted from its tables. The numbers in the CODEVIZ panel
       below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> MobileNet is a <i>cost/accuracy trade</i>, so you report three
       numbers together: <b>top-1 accuracy</b> (the paper uses ImageNet), <b>multiply-adds</b>, and
       <b>parameter count</b> &mdash; for the depthwise-separable net <i>versus</i> a matched full-convolution
       net (same depth/widths). The baselines from the paper's Table&nbsp;4 ablation: full-conv MobileNet
       <b>71.7%</b> at <b>4866</b>M mult-adds / <b>29.3</b>M params, vs depthwise-separable <b>70.6%</b> at
       <b>569</b>M / <b>4.2</b>M &mdash; about <b>1 point</b> of accuracy for ~8.6x compute and ~7x parameter
       savings. "Better than trivial" for a $K$-class head is accuracy $\\gt 1/K$ (random guessing).</p>
       <ul>
        <li><b>Sanity checks before training.</b> (1) Recompute the worked example: $D_K{=}3,M{=}3,N{=}4,D_F{=}8$
        gives standard $6912$, depthwise $1728$, pointwise $768$, separable $2496$, ratio $0.3611$ &mdash; and
        confirm it equals $\\tfrac1N+\\tfrac1{D_K^2}=\\tfrac14+\\tfrac19$. If your counted ratio doesn't match the
        closed form, your cost ledger is wrong. (2) Shape test: a <code>DepthwiseSeparable(in,out)</code> block
        on a $C{\\times}H{\\times}W$ input must return $out{\\times}H{\\times}W$ (padding keeps $D_F$). (3) Confirm
        the depthwise conv has <code>groups=in_ch</code> &mdash; check its weight tensor has $in\\_ch$ (not
        $in\\_ch^2$) filters; that single fact is what buys the saving. (4) Overfit a tiny batch and watch the
        loss reach ~0, so the block can actually learn.</li>
        <li><b>Expected range.</b> The separable net should reach <i>near</i> the full-conv net's accuracy &mdash;
        the paper's ~1-point gap on ImageNet; our toy run is $0.942$ separable vs $1.000$ full-conv. A few points
        below full-conv is the expected trade; collapsing to chance ($\\approx 1/K$) is a bug. The cost reduction
        should be <i>several-fold</i> but <i>not</i> a flat 9x on a small net: the first stage has only $M{=}3$
        input channels where $\\tfrac1N$ dominates, so expect ~5-7x (our run: 5.1x params, 6.9x mult-adds). The
        full 8-9x is the deep-layer limit where $N$ is in the hundreds.</li>
        <li><b>Ablation &mdash; prove the factorization earns its keep.</b> The central idea is splitting the
        convolution. Swap each depthwise-separable block for one ordinary $3\\times3$ <code>nn.Conv2d</code>
        (everything else identical) and re-measure: parameters and mult-adds should jump several-fold while
        accuracy barely moves &mdash; reproducing Table&nbsp;4. If the separable net's cost is <i>not</i> far
        lower, you almost certainly dropped <code>groups=in_ch</code> and built two standard convs.</li>
        <li><b>Failure signals &amp; what they mean.</b> <i>No cost saving vs full-conv</i> &rarr; missing
        <code>groups=in_ch</code> (the depthwise conv is secretly mixing channels). <i>Accuracy far below
        full-conv (near $1/K$)</i> &rarr; BatchNorm/ReLU misplaced, or <code>bias=False</code> with no BatchNorm
        so the layer has no offset (put BN+ReLU after <i>both</i> the depthwise and pointwise conv, Fig.&nbsp;3).
        <i>Reported "9x" but measured ~3x</i> &rarr; you're on a shallow/narrow layer where small $N$ makes
        $\\tfrac1N$ dominate &mdash; not a bug, the expected limit. <i>Params and FLOPs shrink by the same
        ratio</i> &rarr; you conflated the two ledgers; FLOPs carry the extra $D_F^2$ factor and shrink
        differently.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the convolution primitive already ships in PyTorch, so
       you <b>import</b> it and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code> (its
       <code>groups</code> argument gives you the depthwise behaviour for free), <code>nn.BatchNorm2d</code>,
       <code>nn.ReLU</code>, and the optimizer. <b>Build by hand:</b> the depthwise-separable block (depthwise
       <code>groups=in_ch</code> conv + pointwise $1\\times1$ conv, each with BatchNorm + ReLU), the cost
       counting that confirms the $\\tfrac1N+\\tfrac1{D_K^2}$ ratio, and the <b>ablation</b> that swaps the block
       for one full convolution. The reduction-ratio algebra is derived here in full (no separate concept
       lesson).</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting <code>groups=in_ch</code> on the depthwise conv.</b> Without it,
        <code>nn.Conv2d(in_ch, in_ch, 3)</code> is a <i>full</i> conv that mixes channels &mdash; you lose all
        the savings and have built two standard convs in a row. The <code>groups=in_ch</code> is what makes each
        channel filtered independently. <b>Fix:</b> always pass <code>groups=in_ch</code> for the depthwise step.</li>
        <li><b>Expecting exactly 9x everywhere.</b> The ratio is $\\tfrac1N+\\tfrac1{D_K^2}$, so on the
        <i>first</i> layers where $N$ is small (e.g. $N=4$ in the worked example, or the 3-channel image input),
        $\\tfrac1N$ dominates and the saving is only ~2-3x. The 8-9x figure is the deep-layer limit where
        $N$ is large. <b>Don't</b> claim a flat 9x for a whole small net.</li>
        <li><b>Counting parameters but reporting it as FLOPs (or vice-versa).</b> Parameters
        ($D_K^2 M + MN$ for the separable block) and multiply-adds (those times $D_F^2$) shrink by different
        ratios because the spatial size $D_F^2$ multiplies the compute but not the weight count. Keep the two
        ledgers separate.</li>
        <li><b>Putting BatchNorm/ReLU in the wrong place.</b> The paper applies BatchNorm + ReLU after
        <i>both</i> the depthwise and the pointwise conv (Fig.&nbsp;3), not just at the end. Collapsing them into
        one activation changes the block.</li>
        <li><b>Dropping the bias but forgetting BatchNorm.</b> The convs use <code>bias=False</code> because the
        following BatchNorm supplies its own shift. If you remove the bias and also skip BatchNorm, the layer
        has no offset at all.</li>
      </ul>`,
    recall: [
      "Write the standard-convolution cost (eqn 2) and the separable-convolution cost (eqn 5) from memory.",
      "State the reduction ratio and explain which two terms it splits into.",
      "What does the <code>groups=in_ch</code> argument do in the depthwise convolution?",
      "Why is the saving only ~2-3x on the first layers but ~9x deep in the net?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working tiny MobileNet whose blocks are depthwise-separable. Replace
            each separable block with a single standard $3\\times3$ convolution (same in/out channels), keeping
            everything else identical, and retrain. What happens to the parameter count, the compute, and the
            test accuracy &mdash; and what does the comparison demonstrate?`,
        steps: [
          { do: `Swap only the block type: each <code>DepthwiseSeparable(c_in, c_out)</code> becomes one <code>nn.Conv2d(c_in, c_out, 3, padding=1)</code> + BatchNorm + ReLU. Keep depth, widths, optimizer, data, and seed identical.`, why: `An honest ablation changes exactly one thing &mdash; standard vs separable convolution &mdash; so any difference is attributable to it.` },
          { do: `Print parameters and multiply-adds for both nets.`, why: `The separable net should have several times fewer of each, matching the $\\tfrac1N+\\tfrac1{D_K^2}$ prediction.` },
          { do: `Train both and compare test accuracy.`, why: `The separable net should land close to the full-conv net &mdash; the paper's "small reduction in accuracy" for a large cost saving.` }
        ],
        answer: `<p>The full-convolution net has several times <b>more</b> parameters and multiply-adds, yet only
                 a <b>small</b> accuracy edge over the depthwise-separable net. In our run the separable net used
                 ~5x fewer parameters and ~7x fewer convolution multiply-adds while reaching ~0.94 vs ~1.00 test
                 accuracy. Since the two nets are identical except for the convolution type, this isolates the
                 factorization as the cause: most of the cost of a standard convolution is buying very little
                 accuracy, exactly the trade Table&nbsp;4 reports. The CODEVIZ panel shows this contrast.</p>`
      },
      {
        q: `A $3\\times3$ convolution deep in a network turns $M=128$ channels into $N=256$ channels on a
            $14\\times14$ feature map. Compute the standard cost, the separable cost, and the ratio, and say how
            close it is to the "9x" headline.`,
        steps: [
          { do: `Standard (eqn 2): $3\\cdot3\\cdot128\\cdot256\\cdot14\\cdot14 = 9\\cdot128\\cdot256\\cdot196$.`, why: `Plug $D_K=3, M=128, N=256, D_F=14$ into eqn 2.` },
          { do: `Separable (eqn 5): depthwise $3\\cdot3\\cdot128\\cdot196$ plus pointwise $128\\cdot256\\cdot196$.`, why: `Eqn 5 is the depthwise cost (no $N$) plus the pointwise $1\\times1$ cost.` },
          { do: `Ratio (the shortcut): $\\tfrac1N+\\tfrac1{D_K^2} = \\tfrac1{256}+\\tfrac19 \\approx 0.0039 + 0.1111 = 0.115$.`, why: `The cancellation means you never need the big products &mdash; the ratio depends only on $N$ and $D_K$.` }
        ],
        answer: `<p>The ratio is $\\tfrac1{256}+\\tfrac19 \\approx 0.115$, i.e. the separable version costs about
                 <b>11.5%</b> of the standard one &mdash; roughly <b>8.7x cheaper</b>, right in the paper's
                 "8 to 9 times" range. Because $N=256$ is large, the $\\tfrac1N$ term is nearly negligible and the
                 ratio is dominated by $\\tfrac1{D_K^2}=\\tfrac19$. Concretely the standard cost is about
                 $57.8$M and the separable cost about $6.7$M multiply-adds.</p>`
      },
      {
        q: `Your worked example had $D_K=3, M=3, N=4, D_F=8$, giving standard cost 6912 and separable cost 2496
            (ratio 0.3611). Why is this saving so much smaller than the 9x quoted for the rest of the network,
            and what single change to the numbers would push the ratio toward $\\tfrac19$?`,
        steps: [
          { do: `Read the ratio: $\\tfrac1N+\\tfrac1{D_K^2} = \\tfrac14+\\tfrac19$. The $\\tfrac14$ term is from the small $N=4$.`, why: `With few output channels, $\\tfrac1N$ is large and dominates the ratio, capping the saving.` },
          { do: `Imagine raising $N$ to, say, 256 while keeping $D_K=3$: $\\tfrac1{256}+\\tfrac19 \\approx 0.115$.`, why: `As $N$ grows, $\\tfrac1N\\to0$ and the ratio falls to $\\tfrac1{D_K^2}=\\tfrac19$.` },
          { do: `Note $D_K$ is fixed at 3 in MobileNet, so the only free knob here is the channel count $N$.`, why: `The kernel-size term $\\tfrac1{D_K^2}$ is the floor; the channel term is what varies layer to layer.` }
        ],
        answer: `<p>Because $N=4$ is tiny, the $\\tfrac1N=0.25$ term swamps the $\\tfrac19$ term, so the ratio is
                 $0.3611$ (only ~2.8x cheaper) rather than ~$0.11$. Increasing the <b>output-channel count $N$</b>
                 drives $\\tfrac1N\\to0$ and pushes the ratio toward $\\tfrac1{D_K^2}=\\tfrac19$ &mdash; the 8-9x
                 saving. That is why the headline figure applies to the deep, wide layers of the network, not the
                 narrow first ones.</p>`
      }
    ]
  });

  window.CODE["paper-mobilenet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the depthwise-separable convolution by hand on top of <code>nn.Conv2d</code>
       (the <code>groups=in_ch</code> argument is the depthwise trick), then build a matched <b>full-convolution</b>
       net and compare parameters, multiply-adds, and test accuracy on toy images. The first cell recomputes the
       worked example &mdash; standard 6912, depthwise 1728, pointwise 768, separable 2496, ratio 0.3611 =
       $\\tfrac14+\\tfrac19$. The headline line is <code>nn.Conv2d(c, c, 3, padding=1, groups=c, bias=False)</code>
       (depthwise) followed by <code>nn.Conv2d(c, out, 1, bias=False)</code> (pointwise). Paste into Colab and
       run (torch/torchvision are preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Recompute the lesson's worked example: DK=3, M=3, N=4, DF=8. ---
def conv_cost(dk, m, n, df):  # standard conv multiply-adds (eqn 2)
    return dk*dk * m * n * df*df
def sep_cost(dk, m, n, df):   # depthwise (eqn 4) + pointwise 1x1 (eqn 5)
    return dk*dk * m * df*df  +  m * n * df*df

DK, M, N, DF = 3, 3, 4, 8
std = conv_cost(DK, M, N, DF)
dw  = DK*DK * M * DF*DF
pw  = M * N * DF*DF
sep = sep_cost(DK, M, N, DF)
print("worked example  standard =", std, " depthwise =", dw, " pointwise =", pw, " separable =", sep)
print("ratio sep/std   =", round(sep/std, 4), "   formula 1/N + 1/DK^2 =", round(1/N + 1/DK**2, 4))
# worked example  standard = 6912  depthwise = 1728  pointwise = 768  separable = 2496
# ratio sep/std   = 0.3611    formula 1/N + 1/DK^2 = 0.3611


# --- 1. The depthwise-separable block (built by hand). The 'groups=in_ch' is the whole trick. ---
class DepthwiseSeparable(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        # depthwise: each input channel filtered on its own (groups=in_ch), no channel mixing
        self.dw   = nn.Conv2d(in_ch, in_ch, 3, padding=1, groups=in_ch, bias=False)
        self.bn_d = nn.BatchNorm2d(in_ch)
        # pointwise: 1x1 conv that mixes channels in_ch -> out_ch
        self.pw   = nn.Conv2d(in_ch, out_ch, 1, bias=False)
        self.bn_p = nn.BatchNorm2d(out_ch)
        self.relu = nn.ReLU(inplace=True)
    def forward(self, x):
        x = self.relu(self.bn_d(self.dw(x)))   # filter each channel
        x = self.relu(self.bn_p(self.pw(x)))   # then mix channels
        return x

# A matched FULL standard conv block (the ablation): one ordinary 3x3 conv instead of the split.
class StandardConv(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, 3, padding=1, bias=False)
        self.bn   = nn.BatchNorm2d(out_ch)
        self.relu = nn.ReLU(inplace=True)
    def forward(self, x):
        return self.relu(self.bn(self.conv(x)))


# --- 2. Two tiny matched nets: separable vs full convolution (same widths/depth). ---
class TinyNet(nn.Module):
    def __init__(self, Block, n_classes=5):
        super().__init__()
        self.b1 = Block(3, 16)
        self.b2 = Block(16, 32)
        self.head = nn.Linear(32, n_classes)
    def forward(self, x):
        x = self.b2(self.b1(x))
        x = x.mean(dim=(2, 3))          # global average pool
        return self.head(x)

def n_params(m): return sum(p.numel() for p in m.parameters())


# --- 3. Toy 5-class image data (no download needed): each class is a noisy prototype pattern. ---
g = torch.Generator().manual_seed(1)
Nimg, C, H, W, K = 600, 3, 16, 16, 5
y = torch.randint(0, K, (Nimg,), generator=g)
proto = torch.randn(K, C, H, W, generator=g)
X = proto[y] + 0.7 * torch.randn(Nimg, C, H, W, generator=g)
Xtr, ytr, Xte, yte = X[:480], y[:480], X[480:], y[480:]

def train(net, epochs=120, lr=0.08):
    torch.manual_seed(0)
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9, weight_decay=1e-4)
    lf  = nn.CrossEntropyLoss()
    for _ in range(epochs):
        net.train(); opt.zero_grad(); loss = lf(net(Xtr), ytr); loss.backward(); opt.step()
    net.eval()
    with torch.no_grad():
        return (net(Xte).argmax(1) == yte).float().mean().item()

sep_net = TinyNet(DepthwiseSeparable)
std_net = TinyNet(StandardConv)

# Multiply-adds of the two conv stages on a 16x16 map (padding keeps DF=16).
DFm = 16
std_flops = conv_cost(3, 3, 16, DFm) + conv_cost(3, 16, 32, DFm)
sep_flops = sep_cost(3, 3, 16, DFm)  + sep_cost(3, 16, 32, DFm)

acc_sep = train(sep_net)
acc_std = train(std_net)

print("\\n              params      conv mult-adds   test acc")
print("separable   %7d      %12d     %.3f" % (n_params(sep_net), sep_flops, acc_sep))
print("full conv   %7d      %12d     %.3f" % (n_params(std_net), std_flops, acc_std))
print("reduction   %5.1fx fewer  %9.1fx fewer" % (n_params(std_net)/n_params(sep_net),
                                                  std_flops/sep_flops))
# separable ~5x fewer params, ~7x fewer mult-adds, accuracy close to the full-conv net.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-mobilenet"] = {
    question: "Does a depthwise-separable net reach near full-conv accuracy at a fraction of the params/FLOPs?",
    charts: [
      {
        type: "bar",
        title: "Full conv vs depthwise-separable — cost vs accuracy (matched tiny net)",
        xlabel: "metric",
        ylabel: "ratio of separable to full conv (lower = cheaper); accuracy shown as fraction",
        series: [
          {
            name: "depthwise-separable / full-conv",
            color: "#7ee787",
            points: [["params (ratio)", 0.194], ["conv mult-adds (ratio)", 0.145], ["full-conv test acc", 1.000], ["separable test acc", 0.942]]
          }
        ]
      },
      {
        type: "line",
        title: "Test accuracy vs epoch — full conv vs depthwise-separable",
        xlabel: "epoch",
        ylabel: "test accuracy",
        series: [
          {
            name: "Full conv",
            color: "#ff7b72",
            points: [[0,0.25],[8,0.467],[16,0.667],[24,0.808],[32,0.85],[40,0.95],[48,0.983],[56,1.0],[72,1.0],[88,1.0],[104,1.0],[119,1.0]]
          },
          {
            name: "Depthwise-separable",
            color: "#7ee787",
            points: [[0,0.183],[8,0.25],[16,0.383],[24,0.492],[32,0.425],[40,0.567],[48,0.783],[56,0.867],[72,0.85],[88,0.667],[104,0.908],[119,0.942]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two matched tiny nets (two conv stages, 3&rarr;16&rarr;32 channels, BatchNorm + ReLU) on a toy 5-class 3&times;16&times;16 image task, trained with identical depth, widths, optimizer, and seed &mdash; the only difference is standard conv vs depthwise-separable conv. The separable net uses 5.1x fewer parameters (1030 vs 5301) and 6.9x fewer convolution multiply-adds (187k vs 1.29M) while reaching 0.942 test accuracy vs the full-conv net's 1.000 &mdash; a small accuracy reduction for a large cost saving, the same qualitative trade as the paper's Table 4. (The ~7x rather than ~9x reduction is because the first stage only has M=3 input channels, where the depthwise saving is limited.)",
    code: `import torch, torch.nn as nn

torch.manual_seed(0)
g = torch.Generator().manual_seed(1)
N, C, H, W, K = 600, 3, 16, 16, 5
y = torch.randint(0, K, (N,), generator=g)
proto = torch.randn(K, C, H, W, generator=g)
X = proto[y] + 0.7 * torch.randn(N, C, H, W, generator=g)
Xtr, ytr, Xte, yte = X[:480], y[:480], X[480:], y[480:]

def conv_cost(dk, m, n, df): return dk*dk*m*n*df*df            # standard (eqn 2)
def sep_cost(dk, m, n, df):  return dk*dk*m*df*df + m*n*df*df  # depthwise + pointwise (eqn 5)

class Sep(nn.Module):   # depthwise (groups=in) + pointwise 1x1, each with BN + ReLU
    def __init__(s, ci, co):
        super().__init__()
        s.dw=nn.Conv2d(ci,ci,3,padding=1,groups=ci,bias=False); s.bd=nn.BatchNorm2d(ci)
        s.pw=nn.Conv2d(ci,co,1,bias=False); s.bp=nn.BatchNorm2d(co)
    def forward(s, x):
        x=torch.relu(s.bd(s.dw(x))); return torch.relu(s.bp(s.pw(x)))

class Std(nn.Module):   # one ordinary 3x3 conv + BN + ReLU (the ablation)
    def __init__(s, ci, co):
        super().__init__(); s.c=nn.Conv2d(ci,co,3,padding=1,bias=False); s.b=nn.BatchNorm2d(co)
    def forward(s, x): return torch.relu(s.b(s.c(x)))

class Net(nn.Module):
    def __init__(s, Block):
        super().__init__(); s.b1=Block(3,16); s.b2=Block(16,32); s.head=nn.Linear(32,K)
    def forward(s, x): return s.head(s.b2(s.b1(x)).mean(dim=(2,3)))

def nparams(m): return sum(p.numel() for p in m.parameters())
def train(net, epochs=120, lr=0.08):
    torch.manual_seed(0)
    opt=torch.optim.SGD(net.parameters(),lr=lr,momentum=0.9,weight_decay=1e-4)
    lf=nn.CrossEntropyLoss(); curve=[]
    for e in range(epochs):
        net.train(); opt.zero_grad(); loss=lf(net(Xtr),ytr); loss.backward(); opt.step()
        if e%8==0 or e==epochs-1:
            net.eval()
            with torch.no_grad(): curve.append((e, round((net(Xte).argmax(1)==yte).float().mean().item(),3)))
    return curve

sep, std = Net(Sep), Net(Std)
c_sep, c_std = train(sep), train(std)
DF=16
sf = conv_cost(3,3,16,DF)+conv_cost(3,16,32,DF)
pf = sep_cost(3,3,16,DF)+sep_cost(3,16,32,DF)
print("params  std=%d sep=%d  (%.1fx fewer)" % (nparams(std), nparams(sep), nparams(std)/nparams(sep)))
print("flops   std=%d sep=%d  (%.1fx fewer)" % (sf, pf, sf/pf))
print("full-conv acc curve:  ", c_std)
print("separable acc curve:  ", c_sep)
# params std=5301 sep=1030 (5.1x fewer); flops std=1290240 sep=187136 (6.9x fewer)
# full conv reaches 1.000, separable reaches 0.942 -- small accuracy drop, big cost saving.`
  };
})();
