/* Paper lesson — "MobileNetV2: Inverted Residuals and Linear Bottlenecks", Sandler et al. 2018.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-mobilenetv2".
   GROUNDED from arXiv:1801.04381 (abstract) and the ar5iv HTML mirror
   (Sect. 3.1 manifold/linear-bottleneck argument; Sect. 3.2 inverted residual; Table 1 bottleneck
   operator; the block-cost expression h*w*d'*t(d'+k^2+d''); Eqn 1 depthwise-separable cost;
   Sect. 3.3 / Fig. 6a linear-vs-ReLU ablation; Sect. 6.1 / Table 4 ImageNet results).
   Track B (architecture): build the inverted-residual + linear-bottleneck block from nn.Conv2d,
   show its param/FLOP efficiency, and ABLATE linear bottleneck vs ReLU bottleneck on toy data. */
(function () {
  window.LESSONS.push({
    id: "paper-mobilenetv2",
    title: "MobileNetV2 — Inverted Residuals and Linear Bottlenecks (2018)",
    tagline: "Expand thin channels, filter cheaply, project back down with NO ReLU, and skip-connect the thin ends.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Mark Sandler, Andrew Howard, Menglong Zhu, Andrey Zhmoginov, Liang-Chieh Chen",
      org: "Google Inc.",
      year: 2018,
      venue: "CVPR 2018 (arXiv:1801.04381)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1801.04381",
      url: "https://arxiv.org/abs/1801.04381",
      code: "https://github.com/tensorflow/models/tree/master/research/slim/nets/mobilenet"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-conv", "pt-cnn", "pt-nn-module", "dl-batchnorm", "dl-resnet", "dl-activations", "paper-mobilenet"],

    // WHY READ IT
    problem:
      `<p>MobileNet&nbsp;V1 (see the <code>paper-mobilenet</code> lesson) already made convolutions cheap with the
       <b>depthwise-separable convolution</b> &mdash; a per-channel spatial filter (the <b>depthwise</b> step)
       followed by a $1\\times1$ channel mixer (the <b>pointwise</b> step). But V1 was still a plain stack: no
       <b>residual connections</b> (the ResNet trick of adding a layer's input back to its output so deep nets
       train), and every layer ran ReLU on every feature. This paper opens on a subtler problem (&sect;1, &sect;3.1):
       <b>where you put the ReLU matters</b>. A <b>ReLU</b> (Rectified Linear Unit: keep positives, zero negatives)
       throws away every negative value. In a <b>wide</b> layer that is fine &mdash; the information that fits
       through is spread over many channels. But in a <b>narrow</b> ("low-dimensional") layer, zeroing the
       negatives can collapse the data and <i>destroy</i> information you can never get back.</p>
       <p>So the question is: how do you keep layers thin (thin = cheap and small) <i>and</i> add residual
       connections <i>and</i> not let ReLU wreck the thin layers? MobileNetV2's answer is the <b>inverted residual
       with a linear bottleneck</b>.</p>`,
    contribution:
      `<ul>
        <li><b>The linear bottleneck.</b> Keep the channel count low at the block's two ends (the
        "bottleneck"), but make the final $1\\times1$ projection <b>linear</b> &mdash; <i>no</i> ReLU after it
        (&sect;3.2). The paper argues a ReLU on a thin layer destroys information, so the thin layers stay linear.</li>
        <li><b>The inverted residual.</b> A block goes thin &rarr; <b>expand</b> (a $1\\times1$ convolution that
        multiplies the channels by an expansion factor $t$) &rarr; depthwise filter the wide tensor &rarr;
        <b>project</b> back to thin. The <b>residual skip connection runs between the thin ends</b>, not the wide
        middle &mdash; the reverse ("inverted") of a normal ResNet block, which skips between its wide ends
        (&sect;3.2, abstract).</li>
        <li><b>A memory- and compute-efficient family.</b> Because the wide tensor only exists briefly inside the
        block and the data flowing between blocks is thin, MobileNetV2 reaches higher accuracy than V1 at
        <i>fewer</i> parameters and multiply-adds (Table&nbsp;4).</li>
      </ul>`,
    whyItMattered:
      `<p>The inverted-residual + linear-bottleneck block became the default building block for efficient vision.
       MobileNetV3, EfficientNet, and the "MBConv" blocks used throughout mobile and edge models are all this
       block with tweaks. The idea that <b>you should not put a ReLU on a low-dimensional layer</b> reshaped how
       people design narrow layers everywhere, and the thin-data-between-blocks design is why these nets are light
       on both compute and memory on a phone.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Linear Bottlenecks)</b> &mdash; the information argument: ReLU preserves a low-dimensional
        "manifold of interest" only if it lies in a low-dimensional subspace, so a non-linearity on a thin layer
        loses information. This is <i>why</i> the bottleneck is linear.</li>
        <li><b>&sect;3.2 (Inverted Residuals)</b> and <b>Table&nbsp;1</b> &mdash; the block: expand $1\\times1$ (ReLU6)
        &rarr; depthwise $3\\times3$ (ReLU6) &rarr; project $1\\times1$ (<b>linear</b>), with the shortcut between
        the thin bottlenecks. Table&nbsp;1 lists the exact operator sequence and shapes.</li>
        <li><b>The block-cost expression</b> in &sect;3.2 &mdash; $h\\cdot w\\cdot d'\\cdot t(d'+k^2+d'')$ &mdash; and
        <b>Eqn&nbsp;1</b> (the depthwise-separable cost it builds on).</li>
        <li><b>Fig.&nbsp;6(a)</b> (&sect;3.3 ablation) &mdash; linear bottleneck vs a ReLU bottleneck: the linear one
        wins, the paper's headline design check.</li>
        <li><b>Table&nbsp;4</b> (&sect;6.1) &mdash; ImageNet accuracy vs params vs multiply-adds against V1,
        ShuffleNet, NASNet.</li>
       </ul>
       <p><b>Skim:</b> &sect;5 (memory-efficient inference) and the detection/segmentation sections (&sect;6.2&ndash;6.3)
       unless you need SSDLite or DeepLab specifics.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>A block takes a <b>thin</b> tensor (say 6 channels), expands it to a wide one, filters it, and projects
       back to thin. The last step is a $1\\times1$ projection. Before reading: if you put a <b>ReLU</b> after that
       projection (which sits on the thin 6-channel layer), do you expect the network to do <i>better</i>,
       <i>about the same</i>, or <i>worse</i> than if the projection is <b>linear</b> (no ReLU)? Write your guess,
       then check it against the ablation &mdash; where the only difference between two otherwise identical nets is
       that one ReLUs its bottleneck and the other does not.</p>`,
    attempt:
      `<p>Before the reveal, sketch the block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>InvertedResidual(nn.Module)</code> from <code>in_ch</code> &rarr; <code>out_ch</code> with
        expansion factor <code>t=6</code> and a <code>stride</code>.</li>
        <li>TODO: the <b>expand</b> step &mdash; a $1\\times1$ <code>nn.Conv2d(in_ch, in_ch*t, 1, bias=False)</code>,
        then BatchNorm, then ReLU6. This widens the thin input to <code>in_ch*t</code> channels.</li>
        <li>TODO: the <b>depthwise</b> step &mdash; a $3\\times3$ <code>nn.Conv2d(hid, hid, 3, stride=stride,
        padding=1, groups=hid, bias=False)</code>, then BatchNorm, then ReLU6. (<code>groups=hid</code> filters
        each channel on its own &mdash; the depthwise trick from V1.)</li>
        <li>TODO: the <b>project</b> step &mdash; a $1\\times1$ <code>nn.Conv2d(hid, out_ch, 1, bias=False)</code>,
        then BatchNorm, and <b>NO ReLU</b> (the linear bottleneck).</li>
        <li>TODO: the <b>residual</b> &mdash; if <code>stride==1</code> and <code>in_ch==out_ch</code>, add the
        block's input back to its output. This shortcut runs between the thin bottleneck ends.</li>
       </ul>
       <p>Then build the <b>ablation</b> twin: the same block but with a ReLU6 added after the projection, and
       predict which net reaches higher test accuracy.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from where V1 left off. V1's depthwise-separable block does a per-channel $3\\times3$ filter then a
       $1\\times1$ mix, with a ReLU after each. MobileNetV2 reorganizes this into a block whose <b>input and output
       are thin</b> and whose <b>middle is wide</b> (&sect;3.2):</p>
       <ol>
        <li><b>Expand</b> &mdash; a $1\\times1$ convolution multiplies the channel count by the <b>expansion factor</b>
        $t$ (default $t=6$). A thin $d'$-channel input becomes a wide $t\\,d'$-channel tensor. Then BatchNorm + ReLU6.
        (The paper gives the example: 64 channels in, expand by 6 to 384, &sect;3.2.) <b>ReLU6</b> is just
        $\\min(\\max(0,x),6)$ &mdash; a ReLU capped at 6, chosen for robustness in low-precision (8-bit) inference
        (&sect;4).</li>
        <li><b>Depthwise filter</b> &mdash; a $3\\times3$ depthwise convolution (each of the $t\\,d'$ channels filtered
        on its own) does the spatial work on the <i>wide</i> tensor, where it is cheap per channel. Then BatchNorm
        + ReLU6. A stride here downsamples.</li>
        <li><b>Project (linear)</b> &mdash; a $1\\times1$ convolution maps the wide $t\\,d'$ channels back down to a
        thin $d''$-channel output, then BatchNorm and <b>no activation</b>. This is the <b>linear bottleneck</b>.</li>
        <li><b>Residual</b> &mdash; when the block keeps the same shape (stride&nbsp;1 and $d'=d''$), add the input
        back to the output. The skip thus connects the two <b>thin</b> ends &mdash; the "inverted" residual (a
        normal ResNet skip connects wide ends).</li>
       </ol>
       <p>Why is the projection linear? The paper's argument (&sect;3.1): the data of interest lives on a
       low-dimensional <b>manifold</b> (a curved surface) inside the channel space. A ReLU zeroes every negative
       coordinate; if the layer is <b>thin</b>, that collapse can fold or erase part of the manifold and the
       information is gone for good. ReLU only safely preserves such a manifold when it sits in a high-dimensional
       space (the wide middle, where the expand+depthwise ReLU6s live). So the rule is: <b>non-linearities on the
       wide layers, linear on the thin bottleneck.</b> The paper states that adding a non-linearity in the
       bottleneck "indeed hurts the performance by several percent" (&sect;3.2, &sect;3.3 / Fig.&nbsp;6a).</p>`,
    architecture:
      `<p><b>One block (Table&nbsp;1).</b> The inverted-residual bottleneck takes a thin $h\\times w\\times d'$ tensor
       and runs three layers, each $\\to$ BatchNorm:</p>
       <ul>
        <li><b>Expand</b> &mdash; $1\\times1$ conv, $d' \\to t\\,d'$ channels, then ReLU6. Output $h\\times w\\times t d'$.</li>
        <li><b>Depthwise</b> &mdash; $3\\times3$ depthwise conv (groups $= t d'$), stride $s$, then ReLU6. Output
        $\\tfrac{h}{s}\\times\\tfrac{w}{s}\\times t d'$. Stride $s\\!=\\!2$ halves the spatial size.</li>
        <li><b>Project (linear)</b> &mdash; $1\\times1$ conv, $t d' \\to d''$ channels, <b>no activation</b>. Output
        $\\tfrac{h}{s}\\times\\tfrac{w}{s}\\times d''$.</li>
        <li><b>Skip</b> &mdash; if $s\\!=\\!1$ and $d'\\!=\\!d''$, add the input back (thin-to-thin).</li>
       </ul>
       <p><b>Inverted vs classic residual.</b> A classic ResNet bottleneck goes <i>wide&nbsp;&rarr;&nbsp;narrow&nbsp;&rarr;&nbsp;wide</i>
       and skips between the <b>wide</b> ends, so the thick tensors must be kept in memory across the skip. The
       inverted block goes <i>narrow&nbsp;&rarr;&nbsp;wide&nbsp;&rarr;&nbsp;narrow</i> and skips between the <b>thin</b> ends:
       the wide tensor exists only briefly inside the block and never crosses a skip, so the data living between
       blocks (and on the residual path) is always thin &mdash; the source of V2's memory and compute savings
       (&sect;3.2, &sect;5).</p>
       <p><b>The full network (Table&nbsp;2).</b> A $224^2\\times3$ image flows through a stride-2 stem conv, then seven
       groups of bottleneck blocks (the row's first block uses the listed stride $s$, the rest stride&nbsp;1; $t$ is
       the per-group expansion, $c$ the output channels, $n$ the repeat count), then a $1\\times1$ conv to 1280
       channels, global average pool, and a linear classifier:</p>
       <table class="archtable">
        <thead><tr><th>Input</th><th>Operator</th><th>$t$</th><th>$c$</th><th>$n$</th><th>$s$</th></tr></thead>
        <tbody>
         <tr><td>$224^2\\times3$</td><td>conv2d $3\\times3$</td><td>&ndash;</td><td>32</td><td>1</td><td>2</td></tr>
         <tr><td>$112^2\\times32$</td><td>bottleneck</td><td>1</td><td>16</td><td>1</td><td>1</td></tr>
         <tr><td>$112^2\\times16$</td><td>bottleneck</td><td>6</td><td>24</td><td>2</td><td>2</td></tr>
         <tr><td>$56^2\\times24$</td><td>bottleneck</td><td>6</td><td>32</td><td>3</td><td>2</td></tr>
         <tr><td>$28^2\\times32$</td><td>bottleneck</td><td>6</td><td>64</td><td>4</td><td>2</td></tr>
         <tr><td>$14^2\\times64$</td><td>bottleneck</td><td>6</td><td>96</td><td>3</td><td>1</td></tr>
         <tr><td>$14^2\\times96$</td><td>bottleneck</td><td>6</td><td>160</td><td>3</td><td>2</td></tr>
         <tr><td>$7^2\\times160$</td><td>bottleneck</td><td>6</td><td>320</td><td>1</td><td>1</td></tr>
         <tr><td>$7^2\\times320$</td><td>conv2d $1\\times1$</td><td>&ndash;</td><td>1280</td><td>1</td><td>1</td></tr>
         <tr><td>$7^2\\times1280$</td><td>avgpool $7\\times7$</td><td>&ndash;</td><td>&ndash;</td><td>1</td><td>&ndash;</td></tr>
         <tr><td>$1\\times1\\times1280$</td><td>conv2d $1\\times1$ (classifier)</td><td>&ndash;</td><td>$k$</td><td>&ndash;</td><td>&ndash;</td></tr>
        </tbody>
       </table>
       <p>Every expansion uses $t=6$ except the very first bottleneck group, which uses $t=1$ (no expansion). The
       width multiplier and input-resolution knobs from V1 carry over to scale this table up or down (&sect;3.2,
       Table&nbsp;2). Our notebook builds a deliberately tiny version of this skeleton (a stem plus five
       inverted-residual blocks with 6&ndash;8-channel bottlenecks) to keep the toy run fast.</p>`,
    symbols: [
      { sym: "$d'$", desc: "the number of <b>input channels</b> to the block (the thin width coming in). Written $d_i$ in the paper." },
      { sym: "$d''$", desc: "the number of <b>output channels</b> of the block (the thin width going out). Written $d_j$ in the paper." },
      { sym: "$t$", desc: "the <b>expansion factor</b>: the $1\\times1$ expand layer multiplies the input channels to $t\\,d'$. Default $t=6$ across the network (&sect;3.2)." },
      { sym: "$k$", desc: "the depthwise <b>kernel size</b> (the side of the square filter window). MobileNetV2 uses $k=3$." },
      { sym: "$h,\\,w$", desc: "the <b>height and width</b> in pixels of the feature map the block operates on (its spatial size)." },
      { sym: "ReLU6", desc: "the activation $\\min(\\max(0,x),6)$: an ordinary ReLU (keep positives, zero negatives) whose output is also clamped at 6, chosen for robust 8-bit inference (&sect;4)." },
      { sym: "“expansion layer”", desc: "the first $1\\times1$ convolution; widens the thin input from $d'$ to $t\\,d'$ channels (with BatchNorm + ReLU6)." },
      { sym: "“(linear) bottleneck”", desc: "the thin layer at the block's ends. The final $1\\times1$ projection that lands on it has NO activation &mdash; that is what 'linear' means here." },
      { sym: "“inverted residual”", desc: "a residual block whose skip connection joins the THIN ends (around the wide middle), the reverse of a normal ResNet block that skips its wide ends." },
      { sym: "“manifold of interest”", desc: "the low-dimensional curved surface the meaningful data lies on inside the channel space; the paper's reason a ReLU on a thin layer can destroy information (&sect;3.1)." }
    ],
    formula: `$$ y \\;=\\; \\operatorname{ReLU6}(x) \\;=\\; \\min\\!\\big(\\max(0,\\,x),\\;6\\big) $$
      <p>The activation used everywhere a non-linearity appears (&sect;4): an ordinary ReLU clamped at 6, for robust 8-bit inference.</p>
      $$ \\text{cost(standard }k\\times k\\text{ conv)} \\;=\\; h\\cdot w\\cdot d'\\cdot d''\\cdot k^{2} $$
      <p>A full convolution that mixes all $d'$ inputs into all $d''$ outputs at every spatial position &mdash; the baseline V2 cuts down (&sect;2).</p>
      $$ \\text{cost(depthwise-separable, Eqn 1)} \\;=\\; h\\cdot w\\cdot d'\\,\\big(k^{2} + d''\\big) $$
      <p>MobileNetV1's block: a per-channel $k\\times k$ depthwise filter ($k^2$ term) plus a $1\\times1$ pointwise mix ($d''$ term). Cheaper than the standard conv by roughly a factor $k^2$ (&sect;2, Eqn&nbsp;1).</p>
      $$ \\text{Table 1 (bottleneck operator):}\\quad h\\times w\\times d' \\;\\xrightarrow[\\text{ReLU6}]{1\\times1}\\; h\\times w\\times t d' \\;\\xrightarrow[\\text{ReLU6}]{3\\times3\\text{ dw},\\,s}\\; \\tfrac{h}{s}\\times\\tfrac{w}{s}\\times t d' \\;\\xrightarrow[\\text{linear}]{1\\times1}\\; \\tfrac{h}{s}\\times\\tfrac{w}{s}\\times d'' $$
      <p>The exact operator-and-shape sequence of one inverted-residual block: expand $1\\times1$ (ReLU6) &rarr; depthwise $3\\times3$ stride $s$ (ReLU6) &rarr; project $1\\times1$ (LINEAR) (Table&nbsp;1, &sect;3.2).</p>
      $$ y \\;=\\; \\begin{cases} \\mathcal{F}(x) + x, & \\text{stride }s=1 \\text{ and } d'=d'' \\\\[2pt] \\mathcal{F}(x), & \\text{otherwise} \\end{cases} $$
      <p>The inverted residual: add the thin input $x$ back to the block output $\\mathcal{F}(x)$ only when the shapes match &mdash; the skip joins the two thin bottleneck ends (&sect;3.2).</p>
      $$ \\text{cost(inverted-residual block)} \\;=\\; \\underbrace{h\\cdot w\\cdot d'\\cdot t}_{\\text{wide tensor size}}\\;\\big(\\,\\underbrace{d'}_{\\text{expand }1\\times1}\\;+\\;\\underbrace{k^{2}}_{\\text{depthwise }k\\times k}\\;+\\;\\underbrace{d''}_{\\text{project }1\\times1}\\,\\big) $$
      <p>The total multiply-adds of one whole block: the wide-tensor size $h w d' t$ times the sum of the three steps' per-element costs (&sect;3.2).</p>`,
    whatItDoes:
      `<p>This counts the multiply-adds of one whole inverted-residual block (&sect;3.2). The shared factor
       $h\\cdot w\\cdot d'\\cdot t$ is the size of the wide intermediate tensor &mdash; spatial area $h\\cdot w$ times
       its $t\\,d'$ channels, with one $d'$ pulled out front. Inside the bracket are the three steps' per-element
       costs: the expand $1\\times1$ contributes $d'$ (it reads $d'$ input channels), the depthwise $k\\times k$
       contributes $k^2$ (its window, no channel mixing), and the project $1\\times1$ contributes $d''$ (it writes
       $d''$ output channels). Add them and multiply by the wide-tensor size. The block builds on the
       depthwise-separable cost of V1 (<b>Eqn&nbsp;1</b>: $h\\cdot w\\cdot d'(k^2+d'')$); the new $t$ and the extra
       expand term are the price of the expansion, bought back by keeping the data thin between blocks.</p>`,
    derivation:
      `<p>The expression is just the sum of three layer costs sharing the wide-tensor size. Recall a $1\\times1$
       convolution on an $h\\times w$ map from $a$ to $b$ channels costs $h\\cdot w\\cdot a\\cdot b$ multiply-adds, and
       a depthwise $k\\times k$ on $c$ channels costs $h\\cdot w\\cdot c\\cdot k^2$ (each channel its own filter, no
       mixing &mdash; the V1 result). The wide tensor has $t\\,d'$ channels. So:</p>
       <p><b>Expand</b> ($1\\times1$, $d'\\to t\\,d'$): $\\;h\\,w\\,d'\\,(t\\,d') = h\\,w\\,d'\\,t\\cdot d'$.</p>
       <p><b>Depthwise</b> ($k\\times k$ on $t\\,d'$ channels): $\\;h\\,w\\,(t\\,d')\\,k^2 = h\\,w\\,d'\\,t\\cdot k^2$.</p>
       <p><b>Project</b> ($1\\times1$, $t\\,d'\\to d''$): $\\;h\\,w\\,(t\\,d')\\,d'' = h\\,w\\,d'\\,t\\cdot d''$.</p>
       <p>Every term carries the common factor $h\\,w\\,d'\\,t$. Pull it out:</p>
       <p>$$ h\\,w\\,d'\\,t\\,\\big(d' + k^2 + d''\\big). $$</p>
       <p>That is the paper's block cost. (Strictly, the depthwise term should use the post-stride spatial size if
       the block downsamples; for stride&nbsp;1, $h\\,w$ is shared by all three. The lesson uses a stride-1 block so
       the algebra is exact.) This is self-contained &mdash; no separate concept lesson to defer to.</p>`,
    example:
      `<p>Work one stride-1 block by hand with paper-style numbers. Take a $14\\times14$ feature map ($h\\,w =
       196$), a thin bottleneck of $d'=24$ channels in and $d''=24$ out, expansion $t=6$, kernel $k=3$. So the
       wide middle has $t\\,d' = 6\\cdot24 = \\mathbf{144}$ channels.</p>
       <ul class="steps">
        <li><b>Expand</b> ($1\\times1$, $24\\to144$): $h\\,w\\,d'(t\\,d') = 196\\cdot24\\cdot144 = \\mathbf{677376}$ multiply-adds.</li>
        <li><b>Depthwise</b> ($3\\times3$ on 144 channels): $h\\,w\\,(t\\,d')\\,k^2 = 196\\cdot144\\cdot9 = \\mathbf{254016}$.</li>
        <li><b>Project</b> ($1\\times1$, $144\\to24$): $h\\,w\\,(t\\,d')\\,d'' = 196\\cdot144\\cdot24 = \\mathbf{677376}$.</li>
        <li><b>Block total</b>: $677376 + 254016 + 677376 = \\mathbf{1608768}$.</li>
        <li><b>Check with the closed form</b>: $h\\,w\\,d'\\,t(d'+k^2+d'') = 196\\cdot24\\cdot6\\cdot(24+9+24) =
        28224\\cdot57 = \\mathbf{1608768}$. Exact match.</li>
       </ul>
       <table class="extable">
        <caption>One stride-1 block ($14\\times14$, $d'=d''=24$, $t=6$, $k=3$), and the two baselines it is measured against.</caption>
        <thead><tr><th>operation</th><th>cost expression</th><th class="num">multiply-adds</th></tr></thead>
        <tbody>
         <tr><td class="row-h">expand $1\\times1$</td><td>$h\\,w\\,d'(t\\,d')$</td><td class="num">$677376$</td></tr>
         <tr><td class="row-h">depthwise $3\\times3$</td><td>$h\\,w\\,(t\\,d')\\,k^2$</td><td class="num">$254016$</td></tr>
         <tr><td class="row-h">project $1\\times1$</td><td>$h\\,w\\,(t\\,d')\\,d''$</td><td class="num">$677376$</td></tr>
         <tr><td class="row-h">inverted-residual block</td><td>$h\\,w\\,d'\\,t(d'+k^2+d'')$</td><td class="num">$1608768$</td></tr>
         <tr><td class="row-h">standard $3\\times3$ conv</td><td>$h\\,w\\,d'\\,d''\\,k^2$</td><td class="num">$1016064$</td></tr>
         <tr><td class="row-h">V1 separable block (Eqn 1)</td><td>$h\\,w\\,d'(k^2+d'')$</td><td class="num">$155232$</td></tr>
        </tbody>
       </table>
       <p>The baselines: a single ordinary $3\\times3$ conv doing $24\\to24$ costs $196\\cdot24\\cdot24\\cdot9 =
       \\mathbf{1016064}$, and V1's depthwise-separable block costs $196\\cdot24\\cdot(9+24) = 196\\cdot24\\cdot33 =
       \\mathbf{155232}$. The inverted-residual block costs more <i>per block</i> than either, because of the $t=6$
       expansion &mdash; but it carries a residual and a linear bottleneck, lets the whole network stay thinner
       between blocks, and so the <i>full</i> MobileNetV2 still ends up smaller and more accurate than V1
       (Table&nbsp;4). The notebook recomputes all of these.</p>`,
    recipe:
      `<ol>
        <li><b>Build the inverted-residual block</b> (<code>InvertedResidual</code>): expand $1\\times1$ &rarr;
        BatchNorm &rarr; ReLU6; depthwise $3\\times3$ (<code>groups=hid</code>, with <code>stride</code>) &rarr;
        BatchNorm &rarr; ReLU6; project $1\\times1$ &rarr; BatchNorm &rarr; <b>(no activation)</b>.</li>
        <li><b>Add the inverted residual</b>: if <code>stride==1</code> and <code>in_ch==out_ch</code>, return
        <code>x + block(x)</code>; otherwise just <code>block(x)</code>. The skip joins the thin ends.</li>
        <li><b>Stack a few blocks</b> with thin bottleneck widths and a small classifier head (global average pool
        then a linear layer) into a tiny MobileNetV2-style net.</li>
        <li><b>Build the ablation twin</b>: the identical net but with a ReLU6 added after every projection (a
        non-linear bottleneck). Keep depth, widths, optimizer, data, and seed identical.</li>
        <li><b>Train both</b> on toy data and compare test accuracy: the linear-bottleneck net should clearly beat
        the ReLU-bottleneck one &mdash; the paper's "non-linearity in the bottleneck hurts" result.</li>
      </ol>`,
    results:
      `<p>The paper's main ImageNet table (Table&nbsp;4, &sect;6.1) quotes MobileNetV2 at <b>72.0%</b> top-1 accuracy
       with <b>3.4M</b> parameters and <b>300M</b> multiply-adds, versus MobileNetV1 at <b>70.6%</b> with
       <b>4.2M</b> parameters and <b>575M</b> multiply-adds &mdash; <i>higher</i> accuracy at <i>fewer</i>
       parameters and roughly half the compute. It also lists ShuffleNet&nbsp;(1.5) at 71.5% / 3.4M / 292M and
       NASNet-A at 74.0% / 5.3M / 564M, and a wider MobileNetV2&nbsp;(1.4) at <b>74.7%</b> / 6.9M / 585M. On the
       design choice itself, the linear-bottleneck ablation (&sect;3.3, Fig.&nbsp;6a) shows that putting a
       non-linearity in the bottleneck "hurts the performance by several percent."</p>
       <p><i>These are the paper's reported figures, quoted from its tables. The numbers in the CODEVIZ panel below
       are from our own tiny run &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> The primary metric is <b>ImageNet top-1 classification accuracy</b>
        (single-crop), reported against <b>parameter count</b> and <b>multiply-adds</b> &mdash; this is an
        efficiency paper, so a number is only good <i>relative to its cost</i>. The "better than trivial"
        floor is $1/1000 = 0.1\\%$ (random guess on 1000 ImageNet classes); the real baseline to beat is
        <b>MobileNetV1 at 70.6% / 4.2M params / 575M mult-adds</b> (Table&nbsp;4) &mdash; V2 must reach higher
        accuracy at <i>fewer</i> of both. For your toy build the metric is test accuracy on the held-out split,
        floored at $1/K$ (here $1/12\\approx 8.3\\%$ for the 12-class toy task).</p>
       <p><b>2. Sanity checks before the full run.</b></p>
       <ul>
        <li><b>Shape trace.</b> Push one batch through a block and assert the operator sequence
        $h\\times w\\times d' \\to h\\times w\\times t d' \\to \\tfrac{h}{s}\\times\\tfrac{w}{s}\\times t d' \\to
        \\tfrac{h}{s}\\times\\tfrac{w}{s}\\times d''$ (Table&nbsp;1) &mdash; the wide middle must be exactly
        $t\\,d'$ channels.</li>
        <li><b>FLOP unit test.</b> Recompute the worked example ($14\\times14$, $d'=d''=24$, $t=6$, $k=3$) and
        assert the layer-sum $677376+254016+677376 = 1608768$ equals the closed form
        $h\\,w\\,d'\\,t(d'+k^2+d'')$. A known-answer check that your block matches &sect;3.2.</li>
        <li><b>Skip-gate check.</b> Assert the residual add fires <i>only</i> when <code>stride==1 and in_ch==out_ch</code>;
        a stride-2 or width-changing block must run without the skip (a shape mismatch there would crash).</li>
        <li><b>Overfit a single batch.</b> Train both nets on ~one batch and confirm the loss drops toward $0$;
        cross-entropy at init should sit near $-\\ln(1/K)$ ($\\approx 2.48$ for $K=12$). If it can't memorize a
        handful of examples, the block is mis-wired.</li>
       </ul>
       <p><b>3. Expected range.</b> The paper's anchor is <b>72.0% top-1 on ImageNet</b> (Table&nbsp;4,
        approximate, cited above) at 3.4M params / 300M mult-adds &mdash; you will not reproduce that on a toy
        run, so judge instead by the <i>gap</i>: the linear-bottleneck net should clearly beat its ReLU twin.
        In our small run the linear net hit ~0.77 and the ReLU net ~0.43 on the 12-class toy task (our numbers,
        not the paper's). As a rule of thumb (not a paper claim): a gap under a few points means the bottleneck
        isn't actually thin enough to expose the effect (widen less / make the task harder); the two nets landing
        identical means the ablation knob isn't wired.</p>
       <p><b>4. Ablation &mdash; prove the linear bottleneck earns its keep.</b> The central idea is the
        <b>linear (no-ReLU) projection on the thin bottleneck</b>. Turn it OFF by adding an <code>nn.ReLU6</code>
        after the project $1\\times1$'s BatchNorm (the <code>linear=False</code> twin), keeping depth, widths,
        $t$, optimizer, data, and seed identical &mdash; note both nets have the <i>same</i> parameter count (a
        ReLU adds none). Test accuracy must <b>drop</b>. If it doesn't, either the projection wasn't actually
        linear in the baseline (a stray activation) or your bottlenecks are too wide to feel the collapse. This
        is the paper's own &sect;3.3 / Fig.&nbsp;6a check that "a non-linearity in the bottleneck hurts."</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Accuracy stuck near $1/K$ (chance).</b> Net not learning &mdash; LR too low, frozen weights, or
        labels shuffled relative to inputs.</li>
        <li><b>Loss NaN.</b> LR too high (momentum amplifies it) or a missing BatchNorm; lower $\\varepsilon$
        and confirm every conv is followed by its BN.</li>
        <li><b>Block far more expensive than expected.</b> You dropped <code>groups=hid</code> on the depthwise
        conv, turning it into a full convolution on the wide tensor &mdash; the FLOP unit test catches this.</li>
        <li><b>Linear and ReLU twins tie.</b> The bottleneck isn't really linear (stray ReLU on the baseline) or
        not thin enough &mdash; the ablation can't show its effect.</li>
        <li><b>Runtime crash on the skip add.</b> A residual was added across a stride-2 / width-changing block;
        re-gate the add on <code>stride==1 and in_ch==out_ch</code>.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: convolutions, BatchNorm, and ReLU6 already ship in
       PyTorch, so you <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>
       (its <code>groups</code> argument gives the depthwise step), <code>nn.BatchNorm2d</code>,
       <code>nn.ReLU6</code>, and the optimizer. <b>Build by hand:</b> the inverted-residual block (expand &rarr;
       depthwise &rarr; <i>linear</i> project, with the thin-to-thin skip), the block-cost counting that confirms
       $h\\,w\\,d'\\,t(d'+k^2+d'')$, and the <b>ablation</b> that adds a ReLU6 on the bottleneck. The cost algebra
       and the manifold/linear-bottleneck argument are covered here in full (no separate concept lesson). For the
       depthwise-separable groundwork this builds on, see <code>paper-mobilenet</code>.</p>`,
    pitfalls:
      `<ul>
        <li><b>Putting a ReLU after the projection.</b> The whole point is that the bottleneck is <b>linear</b>:
        BatchNorm yes, activation no. Adding <code>nn.ReLU6</code> after the project $1\\times1$ turns it into a
        non-linear bottleneck and (per the paper, and the ablation here) costs several points of accuracy.
        <b>Fix:</b> only the expand and depthwise steps get ReLU6.</li>
        <li><b>Skipping the wrong layers.</b> The residual connects the <b>thin</b> input and output of the block
        (around the wide middle), and <i>only</i> when <code>stride==1</code> and <code>in_ch==out_ch</code> so the
        shapes match. Adding a skip across a downsampling or channel-changing block (mismatched shapes) crashes or
        needs a projection shortcut. <b>Fix:</b> gate the add on <code>stride==1 and in_ch==out_ch</code>.</li>
        <li><b>Forgetting <code>groups=hid</code> on the depthwise conv.</b> Without it the $3\\times3$ becomes a
        full convolution on the wide tensor &mdash; enormously more expensive and no longer depthwise.</li>
        <li><b>Confusing per-block cost with whole-net cost.</b> One inverted-residual block costs <i>more</i> than
        one V1 separable block (because of the $t$ expansion). MobileNetV2 wins at the <i>network</i> level by
        keeping the data thin between blocks; don't conclude the block is cheaper in isolation.</li>
        <li><b>Using plain ReLU instead of ReLU6.</b> The paper uses ReLU6 ($\\min(\\max(0,x),6)$) for low-precision
        robustness (&sect;4). Plain ReLU trains fine on toy data but is not the paper's choice; keep ReLU6 to match.</li>
      </ul>`,
    recall: [
      "Write the inverted-residual block cost $h\\,w\\,d'\\,t(d'+k^2+d'')$ from memory and name which step each bracket term is.",
      "Why is the bottleneck projection LINEAR (no ReLU)? State the manifold argument in one sentence.",
      "Between which layers does the inverted residual's skip connection run, and under what shape condition?",
      "What is ReLU6 and why did the paper pick it?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working tiny MobileNetV2 whose blocks use a <i>linear</i> bottleneck.
            Add a ReLU6 after every projection $1\\times1$ (making the bottleneck non-linear), keep everything else
            identical, and retrain. What happens to the parameter count and the test accuracy, and what does the
            comparison demonstrate?`,
        steps: [
          { do: `Change one thing only: add <code>nn.ReLU6</code> after the project conv's BatchNorm. Keep depth, bottleneck widths, expansion $t$, optimizer, data, and seed identical.`, why: `An honest ablation isolates the linear-vs-ReLU bottleneck; any accuracy gap is attributable to it alone.` },
          { do: `Note the parameter counts.`, why: `A ReLU has no parameters, so the two nets have the <b>same</b> parameter count &mdash; the difference is purely the activation, not capacity.` },
          { do: `Train both and compare test accuracy.`, why: `The linear-bottleneck net should clearly win &mdash; the paper's claim that a non-linearity in the thin bottleneck destroys information and hurts performance.` }
        ],
        answer: `<p>The two nets have <b>identical</b> parameter counts (a ReLU adds none), yet the linear-bottleneck
                 net reaches clearly <b>higher</b> test accuracy. In our run the linear bottleneck hit ~0.77 while
                 the ReLU bottleneck stalled at ~0.43 on a 12-class toy task with thin (6&ndash;8 channel)
                 bottlenecks. Because the only difference is the activation on the thin projection, this isolates
                 the linear bottleneck as the cause: a ReLU on a low-dimensional layer zeroes negatives and folds
                 away part of the data manifold, information the network cannot recover. That is exactly the
                 &sect;3.3 / Fig.&nbsp;6a result. The CODEVIZ panel shows the gap.</p>`
      },
      {
        q: `An inverted-residual block runs on a $7\\times7$ map with thin bottleneck $d'=d''=64$, expansion
            $t=6$, kernel $k=3$. Compute the wide-middle channel count and the block's multiply-adds, then compare
            to one ordinary $3\\times3$ convolution doing $64\\to64$ on the same map.`,
        steps: [
          { do: `Wide channels: $t\\,d' = 6\\cdot64 = 384$.`, why: `The expand $1\\times1$ multiplies the input channels by $t$ (the paper's own 64&rarr;384 example, &sect;3.2).` },
          { do: `Block cost: $h\\,w\\,d'\\,t(d'+k^2+d'') = 7\\cdot7\\cdot64\\cdot6\\,(64+9+64) = 18816\\cdot137$.`, why: `Plug into the closed-form block cost; the bracket is expand $d'$ + depthwise $k^2$ + project $d''$.` },
          { do: `Standard conv: $h\\,w\\,d'\\,d''\\,k^2 = 49\\cdot64\\cdot64\\cdot9$.`, why: `One full $3\\times3$ conv mixes all channels at every position.` }
        ],
        answer: `<p>The wide middle is $384$ channels. The block costs $18816\\cdot137 = \\mathbf{2{,}577{,}792}$
                 multiply-adds. A single standard $3\\times3$ conv ($64\\to64$) costs $49\\cdot64\\cdot64\\cdot9 =
                 \\mathbf{1{,}806{,}336}$. So this one block is actually a bit <i>more</i> expensive than one full
                 conv at these widths &mdash; the expansion is not free per block. The win is at the network scale:
                 the residual lets you go deeper and the linear bottleneck lets the data stay thin between blocks,
                 so the whole net beats V1 on accuracy-per-FLOP (Table&nbsp;4), even though an individual expanded
                 block is not the cheapest thing in isolation.</p>`
      },
      {
        q: `Why does the paper insist the bottleneck be <i>linear</i> but keep ReLU6 on the expand and depthwise
            layers? Give the information argument and say where the non-linearity is "safe."`,
        steps: [
          { do: `Recall ReLU zeroes all negatives &mdash; it is a hard, lossy fold of the space.`, why: `Information sent to the negative side of any channel is gone after a ReLU.` },
          { do: `Note the bottleneck is THIN (low-dimensional); the expand/depthwise tensors are WIDE.`, why: `In a thin layer the data manifold fills most of the few available dimensions, so a fold collapses it; in a wide layer the manifold has room and the fold can be 'undone' by other channels.` },
          { do: `Apply the paper's Lemma-1 intuition (&sect;3.1): ReLU preserves a manifold only if it lies in a low-dimensional subspace of a high-dimensional space.`, why: `That condition holds in the wide middle, not on the thin bottleneck.` }
        ],
        answer: `<p>A ReLU zeroes negatives, which can permanently destroy part of the low-dimensional <b>manifold of
                 interest</b> when the layer is <b>thin</b> &mdash; there are too few channels to route the lost
                 information around the fold. So the thin bottleneck projection is left <b>linear</b> (BatchNorm,
                 no activation). The non-linearity is "safe" only in the <b>wide</b> expand and depthwise layers,
                 where the manifold sits in a high-dimensional space with room to spare, so ReLU6 can add useful
                 non-linearity without collapsing the data (&sect;3.1). This is the &sect;3.2 design rule:
                 non-linearities on the wide layers, linear on the thin ones &mdash; and the ablation in this lesson
                 shows breaking it costs accuracy.</p>`
      }
    ]
  });

  window.CODE["paper-mobilenetv2"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the inverted-residual + linear-bottleneck block by hand on top of
       <code>nn.Conv2d</code> (expand $1\\times1$ &rarr; depthwise $3\\times3$ with <code>groups=hid</code> &rarr;
       <b>linear</b> project $1\\times1$, plus the thin-to-thin skip), then build the <b>ablation twin</b> that adds
       a ReLU6 on the bottleneck and compare test accuracy. The first cell recomputes the worked example &mdash;
       wide channels 144, expand 677376, depthwise 254016, project 677376, block total 1608768 =
       $h\\,w\\,d'\\,t(d'+k^2+d'')$. The headline lines are <code>nn.Conv2d(ci, ci*t, 1)</code> (expand),
       <code>nn.Conv2d(hid, hid, 3, groups=hid)</code> (depthwise), and <code>nn.Conv2d(hid, co, 1)</code> with
       <b>no</b> activation after it (linear bottleneck). Paste into Colab and run (torch/torchvision are
       preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Recompute the worked example: 14x14 map, d'=d''=24, t=6, k=3. ---
h = w = 14; dp = 24; dpp = 24; t = 6; k = 3
wide   = t * dp                                   # wide middle channels = 144
expand = h*w * dp * wide                          # 1x1  d'->t*d'
dwise  = h*w * wide * k*k                         # 3x3 depthwise on wide
proj   = h*w * wide * dpp                         # 1x1  t*d'->d''
block  = expand + dwise + proj
formula = h*w * dp * t * (dp + k*k + dpp)
print("wide channels =", wide)
print("expand =", expand, " depthwise =", dwise, " project =", proj, " block =", block)
print("closed form h*w*d'*t*(d'+k^2+d'') =", formula, " (match:", block == formula, ")")
# wide channels = 144
# expand = 677376  depthwise = 254016  project = 677376  block = 1608768
# closed form ... = 1608768  (match: True)


# --- 1. The inverted-residual + linear-bottleneck block (built by hand). ---
class InvertedResidual(nn.Module):
    # linear=True  -> bottleneck projection has NO activation (the paper's design)
    # linear=False -> ablation: ReLU6 on the thin bottleneck
    def __init__(self, in_ch, out_ch, t=6, stride=1, linear=True):
        super().__init__()
        hid = in_ch * t
        self.use_res = (stride == 1 and in_ch == out_ch)   # skip only when shapes match
        self.expand = nn.Conv2d(in_ch, hid, 1, bias=False);  self.bn1 = nn.BatchNorm2d(hid)
        self.dwise  = nn.Conv2d(hid, hid, 3, stride=stride, padding=1, groups=hid, bias=False)
        self.bn2    = nn.BatchNorm2d(hid)
        self.proj   = nn.Conv2d(hid, out_ch, 1, bias=False); self.bn3 = nn.BatchNorm2d(out_ch)
        self.act    = nn.ReLU6(inplace=True)
        self.linear = linear
    def forward(self, x):
        h = self.act(self.bn1(self.expand(x)))     # expand 1x1  + ReLU6
        h = self.act(self.bn2(self.dwise(h)))      # depthwise 3x3 + ReLU6
        h = self.bn3(self.proj(h))                 # project 1x1 -- LINEAR bottleneck (no ReLU)
        if not self.linear:
            h = self.act(h)                        # ablation: ReLU6 on the thin bottleneck
        if self.use_res:
            h = h + x                              # inverted residual: skip between thin ends
        return h


# --- 2. A tiny MobileNetV2-style net with thin bottlenecks (6 / 8 channels). ---
class TinyMNV2(nn.Module):
    def __init__(self, n_classes=12, linear=True):
        super().__init__()
        self.stem = nn.Sequential(nn.Conv2d(3, 6, 3, padding=1, bias=False),
                                  nn.BatchNorm2d(6), nn.ReLU6(inplace=True))
        self.b1 = InvertedResidual(6, 6, 6, 1, linear)   # stride1, same width -> has skip
        self.b2 = InvertedResidual(6, 6, 6, 1, linear)
        self.b3 = InvertedResidual(6, 8, 6, 2, linear)   # downsample + widen -> no skip
        self.b4 = InvertedResidual(8, 8, 6, 1, linear)
        self.b5 = InvertedResidual(8, 8, 6, 1, linear)
        self.head = nn.Linear(8, n_classes)
    def forward(self, x):
        x = self.b5(self.b4(self.b3(self.b2(self.b1(self.stem(x))))))
        return self.head(x.mean(dim=(2, 3)))             # global average pool -> classifier

def n_params(m): return sum(p.numel() for p in m.parameters())


# --- 3. Harder toy task: 12 noisy classes, so the thin bottleneck must carry real info. ---
g = torch.Generator().manual_seed(1)
Nimg, C, H, W, K = 900, 3, 16, 16, 12
y = torch.randint(0, K, (Nimg,), generator=g)
proto = torch.randn(K, C, H, W, generator=g)
X = proto[y] + 1.3 * torch.randn(Nimg, C, H, W, generator=g)
Xtr, ytr, Xte, yte = X[:700], y[:700], X[700:], y[700:]

def train(net, epochs=140, lr=0.05):
    torch.manual_seed(0)
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9, weight_decay=1e-4)
    lf  = nn.CrossEntropyLoss()
    for _ in range(epochs):
        net.train(); opt.zero_grad(); lf(net(Xtr), ytr).backward(); opt.step()
    net.eval()
    with torch.no_grad():
        return (net(Xte).argmax(1) == yte).float().mean().item()

linear_net = TinyMNV2(linear=True)    # paper's design: linear bottleneck
relu_net   = TinyMNV2(linear=False)   # ablation: ReLU6 bottleneck

acc_lin = train(linear_net)
acc_rel = train(relu_net)

print("\\n               params     test acc")
print("linear bottleneck  %5d     %.3f" % (n_params(linear_net), acc_lin))
print("ReLU   bottleneck  %5d     %.3f" % (n_params(relu_net), acc_rel))
print("same params (ReLU has none); linear bottleneck wins -- ReLU destroys info in the thin layer.")
# linear bottleneck ~0.77, ReLU bottleneck ~0.43 in our run (varies by hardware/seed;
# our small run, not the paper's reported number).`
  };

  window.CODEVIZ["paper-mobilenetv2"] = {
    question: "Does a LINEAR bottleneck beat a ReLU bottleneck when the bottleneck layers are thin?",
    charts: [
      {
        type: "bar",
        title: "Linear vs ReLU bottleneck — final test accuracy (identical nets, thin bottlenecks)",
        labels: ["linear bottleneck", "ReLU bottleneck"],
        values: [0.765, 0.43],
        colors: ["#7ee787", "#ff7b72"]
      },
      {
        type: "line",
        title: "Test accuracy vs epoch — linear vs ReLU bottleneck",
        xlabel: "epoch",
        ylabel: "test accuracy",
        series: [
          {
            name: "Linear bottleneck (paper)",
            color: "#7ee787",
            points: [[0,0.085],[14,0.115],[28,0.155],[42,0.395],[56,0.545],[70,0.66],[84,0.735],[98,0.745],[112,0.765],[126,0.765],[139,0.765]]
          },
          {
            name: "ReLU bottleneck (ablation)",
            color: "#ff7b72",
            points: [[0,0.095],[14,0.095],[28,0.1],[42,0.22],[56,0.365],[70,0.375],[84,0.38],[98,0.465],[112,0.435],[126,0.41],[139,0.43]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two identical tiny MobileNetV2-style nets (stem + five inverted-residual blocks, thin 6&ndash;8-channel bottlenecks, expansion t=6, ReLU6) on a noisy 12-class 3&times;16&times;16 toy task, trained with identical depth, widths, optimizer, and seed &mdash; the ONLY difference is whether the bottleneck projection is linear (no activation) or has a ReLU6. Both nets have the same parameter count (5910; a ReLU has none), yet the linear-bottleneck net reaches 0.765 test accuracy while the ReLU-bottleneck net stalls at 0.430. Putting a non-linearity on the thin bottleneck destroys information the network cannot recover &mdash; the same qualitative effect the paper reports in &sect;3.3 / Fig. 6a.",
    code: `import torch, torch.nn as nn

torch.manual_seed(0)
g = torch.Generator().manual_seed(1)
N, C, H, W, K = 900, 3, 16, 16, 12
y = torch.randint(0, K, (N,), generator=g)
proto = torch.randn(K, C, H, W, generator=g)
X = proto[y] + 1.3 * torch.randn(N, C, H, W, generator=g)
Xtr, ytr, Xte, yte = X[:700], y[:700], X[700:], y[700:]

class IR(nn.Module):   # inverted residual; linear=False -> ReLU6 on the bottleneck (ablation)
    def __init__(s, ci, co, t=6, stride=1, linear=True):
        super().__init__()
        hid = ci*t; s.use_res = (stride==1 and ci==co); s.linear = linear
        s.e=nn.Conv2d(ci,hid,1,bias=False); s.b1=nn.BatchNorm2d(hid)
        s.d=nn.Conv2d(hid,hid,3,stride=stride,padding=1,groups=hid,bias=False); s.b2=nn.BatchNorm2d(hid)
        s.p=nn.Conv2d(hid,co,1,bias=False); s.b3=nn.BatchNorm2d(co); s.a=nn.ReLU6(inplace=True)
    def forward(s, x):
        h=s.a(s.b1(s.e(x))); h=s.a(s.b2(s.d(h))); h=s.b3(s.p(h))   # project = LINEAR
        if not s.linear: h=s.a(h)
        if s.use_res: h=h+x
        return h

class Net(nn.Module):
    def __init__(s, linear=True):
        super().__init__()
        s.stem=nn.Sequential(nn.Conv2d(3,6,3,padding=1,bias=False),nn.BatchNorm2d(6),nn.ReLU6(inplace=True))
        s.b1=IR(6,6,6,1,linear); s.b2=IR(6,6,6,1,linear)
        s.b3=IR(6,8,6,2,linear); s.b4=IR(8,8,6,1,linear); s.b5=IR(8,8,6,1,linear)
        s.head=nn.Linear(8,K)
    def forward(s, x): return s.head(s.b5(s.b4(s.b3(s.b2(s.b1(s.stem(x)))))).mean(dim=(2,3)))

def nparams(m): return sum(p.numel() for p in m.parameters())
def train(net, epochs=140, lr=0.05):
    torch.manual_seed(0)
    opt=torch.optim.SGD(net.parameters(),lr=lr,momentum=0.9,weight_decay=1e-4)
    lf=nn.CrossEntropyLoss(); curve=[]
    for e in range(epochs):
        net.train(); opt.zero_grad(); lf(net(Xtr),ytr).backward(); opt.step()
        if e%14==0 or e==epochs-1:
            net.eval()
            with torch.no_grad(): curve.append((e, round((net(Xte).argmax(1)==yte).float().mean().item(),3)))
    return curve

lin, rel = Net(True), Net(False)
c_lin, c_rel = train(lin), train(rel)
print("params  lin=%d rel=%d (same; ReLU has none)" % (nparams(lin), nparams(rel)))
print("linear bottleneck curve:", c_lin)
print("ReLU   bottleneck curve:", c_rel)
# params lin=5910 rel=5910; linear reaches 0.765, ReLU stalls at 0.430 -- ReLU on the thin
# bottleneck destroys information. Our small run, not the paper's reported number.`
  };
})();
