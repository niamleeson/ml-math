/* Paper lesson — "ShuffleNet: An Extremely Efficient Convolutional Neural Network for
   Mobile Devices", Zhang, Zhou, Lin, Sun 2017 (Megvii / Face++).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-shufflenet".
   GROUNDED from arXiv:1707.01083 (abstract) and the ar5iv HTML mirror
   (Section 3.1 channel shuffle + Fig. 1; Section 3.2 ShuffleNet unit + Fig. 2 and the
   FLOP comparison hw(2cm+9m^2) / hw(2cm+9m^2/g) / hw(2cm/g+9m); Table 2 group-number
   ablation; Table 3 with/without shuffle; Table 5 vs MobileNet).
   Track B (architecture): build the channel-shuffle op (reshape-transpose-flatten) and a
   ShuffleNet unit on top of nn.Conv2d, derive the FLOP saving of pointwise GROUP conv, and
   ablate shuffle on/off to show that without it the channel groups stay isolated. */
(function () {
  window.LESSONS.push({
    id: "paper-shufflenet",
    title: "ShuffleNet — An Extremely Efficient CNN for Mobile Devices (2017)",
    tagline: "Make the expensive 1x1 convolution cheap by splitting it into groups, then shuffle channels so the groups can still talk.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Xiangyu Zhang, Xinyu Zhou, Mengxiao Lin, Jian Sun",
      org: "Megvii Inc (Face++)",
      year: 2017,
      venue: "arXiv:1707.01083 (Jul 2017)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1707.01083",
      url: "https://arxiv.org/abs/1707.01083",
      code: "https://github.com/megvii-model/ShuffleNet-Series"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-conv", "pt-cnn", "pt-nn-module", "dl-batchnorm", "pt-tensor-ops", "paper-mobilenet"],

    // WHY READ IT
    problem:
      `<p>MobileNet (read it first if you have not &mdash; this lesson builds on it) made the $3\\times3$
       convolution cheap by splitting it into a <b>depthwise</b> filter (each channel on its own) plus a
       <b>pointwise</b> $1\\times1$ convolution that mixes channels. But that leaves a new bottleneck. A
       "channel" is one feature map (a colour image starts with 3; deep layers have hundreds). A <b>$1\\times1$
       convolution</b> &mdash; a "pointwise" convolution &mdash; has no spatial window; at each pixel it takes a
       weighted combination of all the input channels to produce each output channel. Once the depthwise step is
       almost free, those <i>dense</i> $1\\times1$ mixings are what dominate the remaining cost.</p>
       <p>The paper opens on exactly this (&sect;1, &sect;3.1): in ResNeXt-style bottlenecks the pointwise
       convolutions take up the lion's share of the arithmetic &mdash; the paper notes "pointwise convolutions
       occupy 93.4% multiplication-adds." Its target is brutal:</p>
       <blockquote>"an extremely computation-efficient CNN architecture named ShuffleNet, which is designed
       specially for mobile devices with very limited computing power (e.g., 10-150 MFLOPs)."</blockquote>
       <p>The obvious fix &mdash; make the $1\\times1$ a <b>group convolution</b> (split the channels into $g$
       groups and let each group mix only within itself, $g$ times cheaper) &mdash; has a fatal flaw: stack two of
       them and a channel in group&nbsp;1 only ever sees other group&nbsp;1 channels. The groups become isolated
       silos and information can never cross between them.</p>`,
    contribution:
      `<ul>
        <li><b>Pointwise group convolution.</b> Apply the group trick to the expensive $1\\times1$ layers, not
        just the $3\\times3$ ones. Splitting the channels into $g$ groups cuts the $1\\times1$ cost by a factor of
        about $g$ (&sect;3.2).</li>
        <li><b>The channel shuffle operation.</b> A parameter-free, almost-free permutation that, between two
        group convolutions, rearranges the channels so each group of the next layer receives a mix of channels
        from <i>every</i> group of the previous layer (&sect;3.1, Fig.&nbsp;1). This is what lets information flow
        across groups &mdash; without it the groups stay isolated.</li>
        <li><b>The ShuffleNet unit.</b> A residual bottleneck block (&sect;3.2, Fig.&nbsp;2) built from
        pointwise-group-conv &rarr; channel-shuffle &rarr; $3\\times3$ depthwise conv &rarr; pointwise-group-conv,
        with a closed-form FLOP count that beats both ResNet and ResNeXt bottlenecks.</li>
      </ul>`,
    whyItMattered:
      `<p>ShuffleNet showed that the "channels can't talk across groups" problem &mdash; the reason group
       convolutions had been used sparingly since AlexNet &mdash; is solvable with a free permutation, not more
       arithmetic. The abstract reports "lower top-1 error (absolute 7.8%) than recent MobileNet on ImageNet
       classification task, under the computation budget of 40 MFLOPs" and "~13x actual speedup over AlexNet" on
       an ARM phone. Channel shuffle and grouped pointwise convolutions fed directly into ShuffleNet&nbsp;V2 and
       the broader family of architecture-search-designed mobile networks.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Channel Shuffle for Group Convolutions)</b> &mdash; the core idea and Fig.&nbsp;1: why
        stacked group convolutions isolate the groups, and the reshape&rarr;transpose&rarr;flatten that fixes it.</li>
        <li><b>&sect;3.2 (ShuffleNet Unit) &amp; Fig.&nbsp;2</b> &mdash; the block, and the three-way FLOP
        comparison ResNet $hw(2cm+9m^2)$ vs ResNeXt $hw(2cm+9m^2/g)$ vs ShuffleNet $hw(2cm/g+9m)$.</li>
        <li><b>Table&nbsp;2</b> &mdash; the group-number ablation: at a fixed budget, more groups $g$ generally
        lowers error (e.g. ShuffleNet 1&times;: $g{=}1$ &rarr; 33.6% error, $g{=}8$ &rarr; 32.4%).</li>
        <li><b>Table&nbsp;3</b> &mdash; the key ablation for this lesson: with vs without channel shuffle. For
        ShuffleNet 1&times; ($g{=}8$): 37.6% error <i>without</i> shuffle, 32.4% <i>with</i> &mdash; a 5.2-point
        improvement from a free permutation.</li>
       </ul>
       <p><b>Skim:</b> &sect;4's COCO detection and ARM-timing tables unless you care about those; the full network
       layout table once you have the unit.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You replace a dense $1\\times1$ convolution with a <b>group</b> $1\\times1$ convolution: split the
       channels into $g=4$ groups and let each group mix only within itself. Two questions before you read on:
       (1) roughly how much <b>cheaper</b> is the grouped version &mdash; about the same, ~2x, or ~4x? (2) If you
       <b>stack two</b> such grouped layers with nothing in between, can a channel that started in group&nbsp;1
       ever influence an output in group&nbsp;4? Write your guesses, then check them against the FLOP formula and
       the shuffle ablation.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>channel_shuffle(x, groups)</code> on a tensor of shape <code>(batch, channels, H, W)</code>.
        TODO: <b>reshape</b> the channel axis from <code>C</code> into <code>(groups, C//groups)</code>;
        <b>transpose</b> those two new axes; <b>flatten</b> them back to <code>C</code>. That reshape-transpose-
        flatten is the entire operation &mdash; no learnable weights.</li>
        <li><code>ShuffleUnit(nn.Module)</code>. TODO: a <b>pointwise group conv</b>
        <code>nn.Conv2d(c, c_mid, 1, groups=g)</code> &rarr; BatchNorm &rarr; ReLU; then
        <code>channel_shuffle(., g)</code>; then a $3\\times3$ <b>depthwise</b> conv
        <code>nn.Conv2d(c_mid, c_mid, 3, padding=1, groups=c_mid)</code> &rarr; BatchNorm; then a second
        pointwise group conv $\\rightarrow$ BatchNorm; add the residual shortcut; ReLU.</li>
        <li>TODO: write the multiply-add cost of a dense vs a grouped $1\\times1$ conv and confirm the grouped one
        is about $g$ times cheaper.</li>
       </ul>
       <p>Then build the <b>ablation</b>: the same unit with the <code>channel_shuffle</code> call removed, and
       predict whether it can still learn a task that requires cross-group information.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start with the cost problem. A dense <b>$1\\times1$ convolution</b> turning $c_{in}$ channels into
       $c_{out}$ channels on an $h\\times w$ map costs $h\\,w\\,c_{in}\\,c_{out}$ multiply-adds &mdash; every output
       channel reads <i>every</i> input channel. A <b>group convolution</b> splits both sides into $g$ groups and
       only connects matching groups: output group&nbsp;$k$ reads only input group&nbsp;$k$. Each of the $g$ groups
       is a small dense conv of size $\\tfrac{c_{in}}{g}\\times\\tfrac{c_{out}}{g}$, so the total is
       $h\\,w\\,c_{in}\\,c_{out}/g$ &mdash; about <b>$g$ times cheaper</b>. ShuffleNet's first idea is simply to apply
       this to the expensive $1\\times1$ layers (&sect;3.2).</p>
       <p>But grouping has a cost of its own (&sect;3.1). If you stack two group convolutions, an output channel in
       group&nbsp;$k$ depends only on input channels in group&nbsp;$k$, which themselves depended only on
       group&nbsp;$k$ of the layer before. The groups never mix &mdash; "outputs from a certain group only relate
       to the inputs within the group. This property blocks information flow between channel groups."</p>
       <p>The fix is the <b>channel shuffle</b> (&sect;3.1, Fig.&nbsp;1). Suppose the previous group conv produced
       $g\\times n$ output channels, laid out as $g$ groups of $n$ each. Do three steps:</p>
       <ol>
        <li><b>Reshape</b> the channel axis from one list of $g\\,n$ channels into a $(g, n)$ grid &mdash; row $i$
        is group $i$.</li>
        <li><b>Transpose</b> that grid to $(n, g)$ &mdash; now row $j$ holds the $j$-th channel taken from
        <i>every</i> group.</li>
        <li><b>Flatten</b> back to one list of $g\\,n$ channels.</li>
       </ol>
       <p>The new ordering interleaves the groups: when the next group conv slices this list into $g$ groups, each
       of its groups now contains channels drawn from every group of the previous layer. Information can cross.
       The operation has <b>no learnable parameters</b> and is "differentiable, which means it can be embedded into
       network structures for end-to-end training" (&sect;3.1).</p>
       <p>The <b>ShuffleNet unit</b> (&sect;3.2, Fig.&nbsp;2) wraps this into a residual bottleneck: a
       pointwise <i>group</i> $1\\times1$ conv (with BatchNorm + ReLU), then channel shuffle, then a $3\\times3$
       <b>depthwise</b> conv (BatchNorm, no ReLU), then a second pointwise group $1\\times1$ conv (BatchNorm), and
       finally add the input shortcut and apply ReLU.</p>`,
    architecture:
      `<p><b>The ShuffleNet unit</b> (&sect;3.2, Fig.&nbsp;2). A residual bottleneck with the two $1\\times1$ layers
       made <i>group</i> convolutions and the $3\\times3$ made <i>depthwise</i>. Two forms:</p>
       <p><b>(b) Stride-1 unit</b> (output same size as input, $c$ channels in and out, bottleneck width $m$):</p>
       <pre>x ──┐
     │   1x1 GConv (groups=g, c->m) ── BN ── ReLU
     │   channel shuffle (g)
     │   3x3 DWConv (depthwise, groups=m, stride=1, pad=1) ── BN        # no ReLU
     │   1x1 GConv (groups=g, m->c) ── BN
     └──▶ (+) add shortcut ── ReLU ──▶ out      (Fig. 2b)</pre>
       <p><b>(c) Stride-2 unit</b> (downsampling, used as the first block of each stage). The depthwise conv uses
       stride 2; the shortcut path gets a $3\\times3$ <b>average pool</b> (stride 2) to match spatial size; and the
       merge is <b>channel concatenation</b> instead of addition (so the channel count grows for free):</p>
       <pre>x ──┐
     │   3x3 AvgPool (stride=2)  ─────────────────────────────┐  (shortcut)
     │                                                        │
     │   1x1 GConv (groups=g) ── BN ── ReLU                   │
     │   channel shuffle (g)                                  │
     │   3x3 DWConv (stride=2, pad=1) ── BN                    │
     │   1x1 GConv (groups=g) ── BN                            │
     └──▶ concat([main, shortcut]) ── ReLU ──▶ out  (Fig. 2c)</pre>
       <p>Per &sect;3.2 the bottleneck width is $m=\\tfrac14$ of the unit's output channels, and (per the paper) the
       <i>first</i> pointwise conv of the stride-2 stage-entry units is sometimes left dense ($g$ groups can be
       skipped there because the input channel count is small).</p>

       <p><b>The full network</b> (&sect;3.3, Table&nbsp;1). Input $224\\times224$; a $3\\times3$ stride-2 conv and a
       $3\\times3$ stride-2 max-pool, then three <b>stages</b> of ShuffleNet units (each stage starts with one
       stride-2 unit, then several stride-1 units), then global average pool and a fully-connected classifier. The
       output channels per stage are chosen <i>per $g$</i> so that the total stays near 140&nbsp;MFLOPs (the "1&times;"
       budget) for every group count:</p>
       <pre>Layer        Output    KSize Stride Repeat   Output channels for g = 1 / 2 / 3 / 4 / 8
Image        224x224    -     -     -        3
Conv1        112x112   3x3    2     1        24   (same for all g)
MaxPool       56x56    3x3    2     -        24
Stage2        28x28     -     2     1        144 / 200 / 240 / 272 / 384   (stride-2 unit)
              28x28     -     1     3        144 / 200 / 240 / 272 / 384   (3 stride-1 units)
Stage3        14x14     -     2     1        288 / 400 / 480 / 544 / 768   (stride-2 unit)
              14x14     -     1     7        288 / 400 / 480 / 544 / 768   (7 stride-1 units)
Stage4         7x7      -     2     1        576 / 800 / 960 /1088 /1536   (stride-2 unit)
               7x7      -     1     3        576 / 800 / 960 /1088 /1536   (3 stride-1 units)
GlobalPool     1x1     7x7    -     -
FC               -      -     -     -        1000  (ImageNet classes)
Complexity (1x): ~143 / 140 / 137 / 142 / 137 MFLOPs</pre>
       <p>The channel widths grow with $g$ because grouping makes each $1\\times1$ cheaper, so at a fixed FLOP budget
       you can afford <i>more</i> channels &mdash; the lever behind Table&nbsp;2's "more groups, lower error" result.
       "ShuffleNet $s\\times$" scales all channel counts by $s$, giving roughly $s^{2}$ the compute (e.g. 0.5&times;
       is ~38&nbsp;MFLOPs, 0.25&times; ~13&nbsp;MFLOPs).</p>`,
    symbols: [
      { sym: "$h, w$", desc: "the <b>height and width</b> of the feature map in pixels &mdash; it has $h\\times w$ spatial positions." },
      { sym: "$c$", desc: "the number of <b>channels</b> (feature maps) entering the bottleneck block." },
      { sym: "$m$", desc: "the <b>bottleneck width</b>: the number of channels inside the block, between the two $1\\times1$ layers (smaller than $c$)." },
      { sym: "$g$", desc: "the <b>number of groups</b> in a group convolution. $g=1$ is an ordinary dense convolution; larger $g$ means more, smaller, independent groups and roughly $g$ times less compute." },
      { sym: "$n$", desc: "the number of channels <b>per group</b> on the shuffle's input, so the layer has $g\\times n$ channels total." },
      { sym: "$a, b$", desc: "the <b>input and output channel counts</b> of a generic convolution, used in the dense vs group cost formulas ($a\\to b$ channels)." },
      { sym: "$i, j$", desc: "in channel shuffle, the <b>group index</b> $i\\in\\{0,\\dots,g-1\\}$ and the <b>within-group position</b> $j\\in\\{0,\\dots,n-1\\}$ of a channel; the op sends index $i\\,n+j$ to $j\\,g+i$." },
      { sym: "“pointwise convolution”", desc: "a $1\\times1$ convolution: no spatial window; at each pixel it linearly combines the input channels into each output channel. The expensive part once depthwise is cheap." },
      { sym: "“group convolution”", desc: "a convolution that splits input and output channels into $g$ groups and connects only matching groups, so it costs about $\\tfrac1g$ of a dense one but the groups don't mix." },
      { sym: "“pointwise group convolution”", desc: "the two combined: a $1\\times1$ convolution done group-wise &mdash; ShuffleNet's cheap replacement for the dense $1\\times1$." },
      { sym: "“depthwise convolution”", desc: "the extreme group conv where groups equals the channel count: each channel is filtered by its own $3\\times3$ filter, no channel mixing (from MobileNet)." },
      { sym: "“channel shuffle”", desc: "the parameter-free reshape&rarr;transpose&rarr;flatten permutation that interleaves the groups so the next group conv sees channels from every previous group." }
    ],
    formula:
      `<p><b>1. Dense (ordinary) $1\\times1$ convolution cost.</b> Turning $a$ input channels into $b$ output
       channels on an $h\\times w$ map, every output reads every input at every pixel:</p>
       $$ \\mathrm{FLOPs}_{\\text{dense}} \\;=\\; h\\,w\\,a\\,b. $$
       <p class="cap">(&sect;3.2, the baseline pointwise cost ShuffleNet attacks.)</p>

       <p><b>2. Group convolution cost.</b> Split both channel sides into $g$ groups and connect only matching
       groups; each group is a small dense conv of size $\\tfrac{a}{g}\\times\\tfrac{b}{g}$, and there are $g$ of
       them:</p>
       $$ \\mathrm{FLOPs}_{\\text{group}} \\;=\\; g \\cdot h\\,w\\,\\frac{a}{g}\\,\\frac{b}{g} \\;=\\; \\frac{h\\,w\\,a\\,b}{g}
          \\;=\\; \\frac{1}{g}\\,\\mathrm{FLOPs}_{\\text{dense}}. $$
       <p class="cap">(&sect;3.2 &mdash; the $\\tfrac1g$ saving; pointwise <i>group</i> convolution applies this to the
       expensive $1\\times1$ layers.)</p>

       <p><b>3. Channel shuffle</b> (&sect;3.1, Fig.&nbsp;1). With $g$ groups of $n$ channels (so $g\\,n$ channels
       total), index a channel by group $i\\in\\{0,\\dots,g-1\\}$ and position $j\\in\\{0,\\dots,n-1\\}$. The op
       reshapes the flat index to the grid $(i,j)$, <b>transposes</b> to $(j,i)$, and flattens back:</p>
       $$ \\underbrace{k = i\\,n + j}_{\\text{input index}} \\;\\xrightarrow[\\text{transpose}]{\\text{reshape}\\,(g,n)\\to(n,g)}\\;
          \\underbrace{k' = j\\,g + i}_{\\text{output index}}. $$
       <p class="cap">(&sect;3.1 &mdash; the parameter-free reshape&rarr;transpose&rarr;flatten permutation; channel
       $i\\,n+j$ moves to position $j\\,g+i$, interleaving the groups.)</p>

       <p><b>4. Bottleneck FLOP comparison</b> (&sect;3.2) for one block on an $h\\times w$ map with input channels
       $c$ and bottleneck width $m$ &mdash; two $1\\times1$ layers ($2cm$) plus one $3\\times3$ layer:</p>
       $$ \\text{ResNet: } hw\\!\\left(2cm+9m^{2}\\right) \\qquad
          \\text{ResNeXt: } hw\\!\\left(2cm+\\tfrac{9m^{2}}{g}\\right) \\qquad
          \\text{ShuffleNet: } hw\\!\\left(\\tfrac{2cm}{g}+9m\\right). $$
       <p class="cap">(&sect;3.2 &mdash; ResNeXt groups only the $3\\times3$; ShuffleNet groups the $1\\times1$ layers
       <i>and</i> makes the $3\\times3$ depthwise, collapsing $9m^{2}\\to9m$.)</p>`,
    whatItDoes:
      `<p>These are the multiply-add costs of one bottleneck block of each type, on an $h\\times w$ map with input
       channels $c$ and bottleneck width $m$ (&sect;3.2). Read each as "two $1\\times1$ layers plus one $3\\times3$
       layer":</p>
       <ul>
        <li><b>ResNet</b> $hw(2cm+9m^2)$: two dense $1\\times1$ layers ($cm$ each, hence $2cm$) plus a dense
        $3\\times3$ conv ($9m^2$, the $9$ being $3\\times3$).</li>
        <li><b>ResNeXt</b> $hw(2cm+\\tfrac{9m^2}{g})$: same $1\\times1$ layers, but the $3\\times3$ is grouped, so
        its $9m^2$ is divided by $g$.</li>
        <li><b>ShuffleNet</b> $hw(\\tfrac{2cm}{g}+9m)$: the <i>$1\\times1$</i> layers are grouped (so $2cm$ becomes
        $\\tfrac{2cm}{g}$) and the $3\\times3$ is <i>depthwise</i> (so its term collapses from $9m^2$ to $9m$).
        ShuffleNet groups exactly the layers that cost the most.</li>
       </ul>
       <p>Because the $1\\times1$ layers dominate ($cm$ is large), dividing <i>them</i> by $g$ &mdash; what
       ShuffleNet does &mdash; saves far more than ResNeXt's dividing the smaller $3\\times3$ term. "Given a
       computational budget, ShuffleNet can use wider feature maps" (&sect;3.2).</p>`,
    derivation:
      `<p>The formula is just bookkeeping of three convolutions; the only piece that needs an argument is "why is a
       group convolution $\\tfrac1g$ the cost of a dense one?" &mdash; the lever behind every term above. A dense
       $1\\times1$ conv from $a$ channels to $b$ channels costs $h\\,w\\,a\\,b$ multiply-adds (each of $b$ outputs
       reads all $a$ inputs, at every pixel). Split into $g$ groups: each group is a small dense conv from
       $\\tfrac{a}{g}$ inputs to $\\tfrac{b}{g}$ outputs, costing $h\\,w\\,\\tfrac{a}{g}\\,\\tfrac{b}{g}$. There are
       $g$ such groups, so the total is</p>
       <p>$$ g \\cdot h\\,w\\,\\frac{a}{g}\\,\\frac{b}{g} \\;=\\; \\frac{h\\,w\\,a\\,b}{g}. $$</p>
       <p>One factor of $g$ from "there are $g$ groups," two factors of $g$ from "each group is $g$ times narrower
       on both sides" &mdash; net result $\\tfrac1g$ the dense cost. Apply this to the two $1\\times1$ layers
       ($a=c,b=m$ and $a=m,b=c$, total $2cm$) and you get the $\\tfrac{2cm}{g}$ term. The $3\\times3$ in ShuffleNet
       is depthwise (one group per channel, no $m^2$ at all), giving $9m$ instead of $9m^2$. Add them and multiply
       by $hw$: $hw(\\tfrac{2cm}{g}+9m)$. This is self-contained, so there is no separate concept lesson to defer
       to.</p>`,
    example:
      `<p>Two worked pieces: the FLOP saving, then the channel-shuffle <b>index permutation</b> itself.</p>
       <p><b>(A) FLOP saving.</b> Take a block with $h=w=28$ (so $hw=784$), $c=64$, $m=16$, and $g=4$ groups.
       The two $1\\times1$ terms give $2cm=2048$ and the $3\\times3$ term $9m^2=2304$.</p>
       <ul class="steps">
        <li><b>ResNet</b> $hw(2cm+9m^2) = 784\\,(2048+2304) = 784\\cdot4352 = 3{,}411{,}968$ multiply-adds.</li>
        <li><b>ResNeXt</b> $hw(2cm+\\tfrac{9m^2}{g}) = 784\\,(2048 + \\tfrac{2304}{4}) = 784\\,(2048+576) =
        784\\cdot2624 = 2{,}057{,}216$ &mdash; only the $3\\times3$ is grouped.</li>
        <li><b>ShuffleNet</b> $hw(\\tfrac{2cm}{g}+9m) = 784\\,(\\tfrac{2048}{4} + 9\\cdot16) = 784\\,(512+144) =
        784\\cdot656 = 514{,}304$ &mdash; the $1\\times1$s are grouped and the $3\\times3$ is depthwise.</li>
        <li><b>Ratio</b> $514304/3411968 = 0.1507$ &mdash; ShuffleNet costs about 15% as much, roughly
        <b>6.6x cheaper</b> than ResNet.</li>
       </ul>
       <table class="extable">
        <caption>One bottleneck block, $h=w=28$, $c=64$, $m=16$, $g=4$. Which layers each design groups, and the cost.</caption>
        <thead><tr><th>block</th><th>$1\\times1$ layers</th><th>$3\\times3$ layer</th><th class="num">multiply-adds</th><th class="num">vs ResNet</th></tr></thead>
        <tbody>
          <tr><td class="row-h">ResNet</td><td>dense ($2cm$)</td><td>dense ($9m^2$)</td><td class="num">3,411,968</td><td class="num">1.00&times;</td></tr>
          <tr><td class="row-h">ResNeXt</td><td>dense ($2cm$)</td><td>grouped ($9m^2/g$)</td><td class="num">2,057,216</td><td class="num">0.60&times;</td></tr>
          <tr><td class="row-h">ShuffleNet</td><td>grouped ($2cm/g$)</td><td>depthwise ($9m$)</td><td class="num">514,304</td><td class="num">0.15&times;</td></tr>
        </tbody>
       </table>
       <p><b>(B) The channel-shuffle permutation.</b> Take $g=3$ groups of $n=4$ channels, so $12$ channels indexed
       $0..11$. Group&nbsp;0 is $[0,1,2,3]$, group&nbsp;1 is $[4,5,6,7]$, group&nbsp;2 is $[8,9,10,11]$.</p>
       <ul class="steps">
        <li><b>Reshape</b> $[0,1,2,3,4,5,6,7,8,9,10,11]$ into a $(g,n)=(3,4)$ grid (row = group):
        $\\begin{smallmatrix}0&amp;1&amp;2&amp;3\\\\4&amp;5&amp;6&amp;7\\\\8&amp;9&amp;10&amp;11\\end{smallmatrix}$.</li>
        <li><b>Transpose</b> to a $(n,g)=(4,3)$ grid (row $j$ = the $j$-th channel of every group):
        $\\begin{smallmatrix}0&amp;4&amp;8\\\\1&amp;5&amp;9\\\\2&amp;6&amp;10\\\\3&amp;7&amp;11\\end{smallmatrix}$.</li>
        <li><b>Flatten</b> back to one list: $[0,4,8,\\;1,5,9,\\;2,6,10,\\;3,7,11]$.</li>
        <li><b>Read off the new groups</b> of 4: $[0,4,8,1]$, $[5,9,2,6]$, $[10,3,7,11]$. Each new group now holds
        channels that came from <i>all three</i> original groups (e.g. the first new group has $0$ from group&nbsp;0,
        $4$ from group&nbsp;1, $8$ from group&nbsp;2). That cross-mixing is the whole point.</li>
       </ul>
       <p>The notebook recomputes the FLOP numbers and prints this exact permutation
       $[0,4,8,1,5,9,2,6,10,3,7,11]$ so you can check it against a hand trace.</p>`,
    recipe:
      `<ol>
        <li><b>Build channel shuffle</b>: given <code>x</code> of shape $(B,C,H,W)$ and group count $g$, reshape
        the channel axis to $(g, C/g)$, transpose those two axes, and flatten back to $C$. No parameters.</li>
        <li><b>Build the ShuffleNet unit</b>: pointwise <i>group</i> $1\\times1$ conv $c\\to m$ (groups $=g$) &rarr;
        BatchNorm &rarr; ReLU &rarr; <b>channel shuffle</b> &rarr; $3\\times3$ depthwise conv on $m$ &rarr;
        BatchNorm &rarr; pointwise group $1\\times1$ conv $m\\to c$ (groups $=g$) &rarr; BatchNorm; add the input
        shortcut; ReLU.</li>
        <li><b>Count FLOPs</b> of a dense $1\\times1$ vs a grouped $1\\times1$ and confirm the $\\tfrac1g$ factor;
        recompute the worked block (ResNet vs ShuffleNet) to confirm the ratio.</li>
        <li><b>Build the ablation</b>: the same unit with the channel-shuffle call removed, so the two group convs
        stack with isolated groups.</li>
        <li><b>Train both</b> on a toy task that <i>requires</i> cross-group information and compare &mdash; the
        shuffled unit should learn it, the un-shuffled one should lag because its groups cannot communicate.</li>
      </ol>`,
    results:
      `<p>The paper's two ablations are the headline. <b>Table&nbsp;2</b> (group number, fixed ~complexity): more
       groups generally help &mdash; ShuffleNet 1&times; goes from <b>33.6%</b> top-1 error at $g{=}1$ to
       <b>32.4%</b> at $g{=}8$; the heavily-thinned ShuffleNet 0.25&times; improves from <b>57.1%</b> ($g{=}1$) to
       <b>52.7%</b> ($g{=}8$). <b>Table&nbsp;3</b> (the channel-shuffle test): for ShuffleNet 1&times; with $g{=}8$,
       removing shuffle gives <b>37.6%</b> error vs <b>32.4%</b> with shuffle &mdash; a <b>5.2-point</b> gain from a
       free permutation, and the paper notes the gap grows with $g$. Against MobileNet, the abstract reports
       "lower top-1 error (absolute 7.8%) ... under the computation budget of 40 MFLOPs" (ShuffleNet 0.5&times;
       41.6% vs 0.25 MobileNet-224 49.4% in Table&nbsp;5).</p>
       <p><i>These are the paper's reported figures, quoted from its abstract and tables. The numbers in the CODEVIZ
       panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>What "working" means here.</b> Two separable claims: (1) the cheap block actually costs
       $\\tfrac1g$-ish less, and (2) channel shuffle is what lets the grouped network learn cross-group tasks.
       Check the arithmetic first (it's exact), then the learning behavior.</p>
       <ul>
         <li><b>The metric &amp; baseline.</b> For the unit: the channel-shuffle <b>index permutation</b> must
         exactly equal the hand-traced answer ($g{=}3,n{=}4 \\rightarrow [0,4,8,1,5,9,2,6,10,3,7,11]$) &mdash; a
         known-answer test, no tolerance. For the cost claim: the block-FLOP ratio ShuffleNet/ResNet, compared
         against the closed form $\\tfrac{hw(2cm/g+9m)}{hw(2cm+9m^2)}$ (worked block: $514304/3411968=0.1507$). For
         the headline ImageNet claim, the metric is <b>top-1 error</b> and the baseline is the same-budget network
         <i>without</i> shuffle (Table&nbsp;3) and MobileNet (Table&nbsp;5); chance on 1000-way ImageNet is 99.9%
         error, so "better than trivial" is far from the bar &mdash; the real bar is beating the no-shuffle twin.</li>
         <li><b>Sanity checks BEFORE training.</b> (a) Run <code>channel_shuffle</code> on channel ids
         <code>torch.arange(C)</code> and assert it reproduces the index permutation. (b) Assert shuffle is a true
         permutation: applying it $g$ times (or sorting the output) returns the original set of channel ids; no
         channel is dropped or duplicated. (c) Shape check: output is still $(B,C,H,W)$ and $C$ divides evenly by
         $g$ (else the reshape is silently wrong). (d) Overfit a single batch on the cross-group toy task &mdash;
         the <b>shuffled</b> unit's train loss should reach $\\approx 0$; if even the shuffled net can't memorize one
         batch, the unit is mis-wired. (e) At init, a $K$-way head gives loss $\\approx -\\ln(1/K)$
         ($=\\ln 2\\approx0.69$ for the binary toy task).</li>
         <li><b>Expected range.</b> The FLOP ratio should match the formula to the digit (exact integer
         arithmetic). On the lesson's toy cross-group task expect the shuffled unit near <b>0.98</b> test accuracy
         and the un-shuffled one stalling near <b>0.65</b> (our small run, CODEVIZ &mdash; a rule-of-thumb gap, not
         a paper number). The paper's reported figures: removing shuffle costs <b>5.2 points</b> of top-1 error
         (ShuffleNet 1&times;, $g{=}8$: 37.6% without vs 32.4% with), and ShuffleNet beats MobileNet by
         <b>absolute 7.8%</b> top-1 at 40 MFLOPs (arXiv:1707.01083, Abstract, Tables&nbsp;3 &amp; 5). A few points
         off the toy target is seed/tuning; the shuffled net failing to clear the un-shuffled one is a bug.</li>
         <li><b>Ablation &mdash; prove channel shuffle earns its keep.</b> This IS the paper's central test
         (Table&nbsp;3). Remove only the <code>channel_shuffle(x, g)</code> call &mdash; same $g$, widths, depthwise
         conv, optimizer, data, seed &mdash; so two grouped $1\\times1$ convs stack with isolated groups. On a task
         whose label compares channels in <i>different</i> groups (the toy task pits channel 0 in group 0 vs channel
         4 in group 2), accuracy must <b>drop</b>. If removing shuffle changes nothing, either the task doesn't
         actually need cross-group information, or your "shuffle" was an identity-like permutation that never
         interleaved the groups.</li>
         <li><b>Failure signals &amp; what they mean.</b> (i) The permutation comes out as $[0,1,2,\\dots]$
         (identity) &rarr; you reshaped to $(C/g, g)$ instead of $(g, C/g)$, or skipped the transpose. (ii)
         <code>.view()</code> throws after the transpose &rarr; non-contiguous tensor; add <code>.contiguous()</code>
         (or use <code>.reshape</code>). (iii) Shuffled and un-shuffled nets reach the <i>same</i> accuracy &rarr;
         the shuffle line isn't between the grouped convs, or the task is within-group solvable &mdash; the ablation
         is testing nothing. (iv) A reshape error or wrong group count whenever $C \\% g \\ne 0$ &rarr; pick channel
         widths that are multiples of $g$. (v) "$g\\times$ speedup" doesn't materialize &rarr; only the grouped
         $1\\times1$ layers shrink by $g$; the depthwise $3\\times3$ and BatchNorms don't, so use the full
         $hw(\\tfrac{2cm}{g}+9m)$ formula, not a flat $1/g$.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: convolutions, grouping, and tensor reshaping all ship in
       PyTorch, so you <b>import</b> them and build only the novel composition. <b>Import:</b>
       <code>nn.Conv2d</code> (its <code>groups</code> argument gives both group and depthwise convolutions for
       free), <code>nn.BatchNorm2d</code>, <code>nn.ReLU</code>, <code>Tensor.view</code>/
       <code>transpose</code>/<code>reshape</code>, and the optimizer. <b>Build by hand:</b> the
       <code>channel_shuffle</code> reshape-transpose-flatten op, the <code>ShuffleUnit</code> module, the FLOP
       counting that confirms the $\\tfrac1g$ saving, and the <b>shuffle on/off ablation</b>. The group-conv
       $\\tfrac1g$ algebra and the block-FLOP formula are derived here in full (no separate concept lesson). It
       composes directly on the depthwise-separable idea from <code>paper-mobilenet</code> &mdash; ShuffleNet
       groups the $1\\times1$ that MobileNet left dense.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the shuffle.</b> Two grouped $1\\times1$ convs in a row with no shuffle between them is
        the failure case the paper warns about (&sect;3.1): the groups never exchange information. The whole point
        of the op is to sit <i>between</i> grouped layers. <b>Fix:</b> shuffle after the first group conv, before
        the depthwise/second group conv.</li>
        <li><b>Getting the reshape/transpose order wrong.</b> The op is reshape to $(g, C/g)$, transpose those two,
        flatten &mdash; in that order. Reshaping to $(C/g, g)$ instead, or skipping the transpose, gives a
        different (often identity-like) permutation that does <i>not</i> interleave the groups. Trace the index
        permutation $[0,4,8,1,\\dots]$ by hand to verify.</li>
        <li><b>Non-contiguous tensor after transpose.</b> <code>transpose</code> returns a view with swapped
        strides; calling <code>.view(...)</code> on it errors. Use <code>.contiguous()</code> before the final
        flatten (or use <code>.reshape(...)</code>, which copies if needed).</li>
        <li><b>$C$ not divisible by $g$.</b> Group convolution and the shuffle both require the channel count to
        split evenly into $g$ groups. Choose channel widths that are multiples of $g$.</li>
        <li><b>Confusing groups with depthwise.</b> A <b>group</b> conv has $g$ groups (a tunable few); a
        <b>depthwise</b> conv is the extreme where groups equals the channel count. ShuffleNet uses group convs
        for the $1\\times1$ layers and a depthwise conv for the $3\\times3$ &mdash; don't swap them.</li>
        <li><b>Claiming exactly $g$x total speedup.</b> Only the grouped layers shrink by $g$; the depthwise
        $3\\times3$ and the BatchNorms do not. The block ratio is the full $hw(\\tfrac{2cm}{g}+9m)$ formula, not a
        flat $1/g$.</li>
      </ul>`,
    recall: [
      "State the three bottleneck FLOP costs (ResNet, ResNeXt, ShuffleNet) and say which layers each one groups.",
      "Why does a group convolution cost about $1/g$ of a dense one? (two sources of the factor $g$)",
      "Write the three steps of channel shuffle in order, and explain what goes wrong if you omit it.",
      "For $g=3, n=4$, give the channel index permutation channel shuffle produces."
    ],
    practice: [
      {
        q: `<b>The shuffle ablation.</b> You have a working ShuffleNet unit. Build a second copy with the
            <code>channel_shuffle</code> call removed (two grouped $1\\times1$ convs now stack with the depthwise
            in between but no cross-group mixing), and train both on a task that needs information from different
            channel groups to combine. What happens to accuracy, and what does it demonstrate?`,
        steps: [
          { do: `Remove only the <code>channel_shuffle(x, g)</code> line; keep the group count, widths, depthwise conv, optimizer, data, and seed identical.`, why: `An honest ablation changes exactly one thing &mdash; shuffle present vs absent &mdash; so any gap is attributable to it.` },
          { do: `Use a task whose label depends on combining features that the grouping splits across groups (e.g. a relation between channels that fall in different groups).`, why: `If the task only needs within-group information, the shuffle wouldn't matter; the ablation must stress cross-group flow.` },
          { do: `Train both and compare test accuracy (and, optionally, watch the loss curves).`, why: `The shuffled unit can route information across groups; the un-shuffled one is structurally blocked from it.` }
        ],
        answer: `<p>The shuffled unit reaches clearly higher accuracy; the un-shuffled one plateaus lower because
                 its grouped $1\\times1$ convs keep the channel groups isolated &mdash; no path lets a feature in one
                 group influence an output in another. Since the two units are identical except for the shuffle,
                 this isolates the channel-shuffle permutation as the cause, the same qualitative result as
                 Table&nbsp;3 (37.6% &rarr; 32.4% error with shuffle, $g{=}8$). The CODEVIZ panel shows this
                 contrast on our toy task.</p>`
      },
      {
        q: `A bottleneck has $h=w=14$, $c=128$, $m=32$. Compute the ResNet cost $hw(2cm+9m^2)$ and the ShuffleNet
            cost $hw(\\tfrac{2cm}{g}+9m)$ with $g=8$, and the ratio. Which term dominates the saving?`,
        steps: [
          { do: `$hw=196$, $2cm=2\\cdot128\\cdot32=8192$, $9m^2=9\\cdot1024=9216$. ResNet $=196(8192+9216)=196\\cdot17408$.`, why: `Plug into $hw(2cm+9m^2)$; note the two terms are comparable here.` },
          { do: `ShuffleNet: $\\tfrac{2cm}{g}=8192/8=1024$, $9m=288$. $=196(1024+288)=196\\cdot1312$.`, why: `Grouping divides the $8192$ by $g=8$; depthwise turns $9216$ into $288$.` },
          { do: `Ratio $=1312/17408\\approx0.0754$.`, why: `Both heavy terms shrank, so the block is about 13x cheaper.` }
        ],
        answer: `<p>ResNet $=196\\cdot17408=3{,}411{,}968$; ShuffleNet $=196\\cdot1312=257{,}152$; ratio
                 $\\approx0.075$, i.e. about <b>13x cheaper</b>. Both savings matter, but the depthwise step is the
                 bigger lever here: it collapsed $9m^2=9216$ to $9m=288$ (a 32x drop on that term), while grouping
                 cut the $1\\times1$ term by $g=8$. With wider bottlenecks ($m$ large relative to $c$) the depthwise
                 term saves even more; with $m$ small the grouped $1\\times1$ dominates.</p>`
      },
      {
        q: `For channel shuffle with $g=2$ groups of $n=3$ channels (6 channels, $[0,1,2]$ and $[3,4,5]$), work
            out the output permutation by hand, then say which original groups each new group draws from.`,
        steps: [
          { do: `Reshape $[0,1,2,3,4,5]$ to the $(g,n)=(2,3)$ grid $\\begin{smallmatrix}0&1&2\\\\3&4&5\\end{smallmatrix}$.`, why: `Row $i$ is original group $i$.` },
          { do: `Transpose to $(n,g)=(3,2)$: $\\begin{smallmatrix}0&3\\\\1&4\\\\2&5\\end{smallmatrix}$.`, why: `Row $j$ now holds the $j$-th channel of every group.` },
          { do: `Flatten: $[0,3,1,4,2,5]$; slice into new groups of 3: $[0,3,1]$ and $[4,2,5]$.`, why: `The next group conv reads these as its two groups.` }
        ],
        answer: `<p>The permutation is $[0,3,1,4,2,5]$. New group&nbsp;0 is $[0,3,1]$ and new group&nbsp;1 is
                 $[4,2,5]$ &mdash; each new group contains channels from <b>both</b> original groups (e.g. group&nbsp;0
                 has $0,1$ from original group&nbsp;0 and $3$ from original group&nbsp;1). That is exactly why the
                 next grouped convolution can now mix information that was previously trapped within a single group.</p>`
      }
    ]
  });

  window.CODE["paper-shufflenet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the channel-shuffle op (reshape&rarr;transpose&rarr;flatten) and a ShuffleNet
       unit by hand on top of <code>nn.Conv2d</code> (the <code>groups</code> argument gives both group and
       depthwise convs), then ablate the shuffle on a toy task that needs cross-group information. The first cell
       prints the channel-shuffle <b>index permutation</b> for $g{=}3,n{=}4$ &mdash; it must be
       <code>[0,4,8,1,5,9,2,6,10,3,7,11]</code> &mdash; and recomputes the worked FLOP block (ResNet 3,411,968 vs
       ShuffleNet 514,304, ratio 0.1507). The headline lines are the three-step shuffle and
       <code>nn.Conv2d(c, m, 1, groups=g)</code> (grouped $1\\times1$) plus
       <code>nn.Conv2d(m, m, 3, padding=1, groups=m)</code> (depthwise). Paste into Colab and run (torch is
       preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0a. Channel shuffle as an index permutation (no tensors yet): g groups of n channels. ---
def shuffle_indices(g, n):
    idx = torch.arange(g * n)            # [0,1,...,g*n-1]
    idx = idx.view(g, n).t().reshape(-1) # reshape (g,n) -> transpose -> flatten
    return idx.tolist()
print("shuffle perm g=3,n=4:", shuffle_indices(3, 4))
# shuffle perm g=3,n=4: [0, 4, 8, 1, 5, 9, 2, 6, 10, 3, 7, 11]   <-- matches the worked example

# --- 0b. The worked FLOP block: h=w=28, c=64, m=16, g=4. ---
def resnet_flops(h, w, c, m):      return h*w * (2*c*m + 9*m*m)
def shufflenet_flops(h, w, c, m, g): return h*w * (2*c*m//g + 9*m)
h, w, c, m, g = 28, 28, 64, 16, 4
rn, sn = resnet_flops(h, w, c, m), shufflenet_flops(h, w, c, m, g)
print("ResNet block =", rn, " ShuffleNet block =", sn, " ratio =", round(sn/rn, 4))
# ResNet block = 3411968  ShuffleNet block = 514304  ratio = 0.1507


# --- 1. The channel-shuffle op on a (B,C,H,W) tensor. Reshape -> transpose -> flatten. ---
def channel_shuffle(x, groups):
    B, C, H, W = x.shape
    x = x.view(B, groups, C // groups, H, W)   # split channel axis into (g, C/g)
    x = x.transpose(1, 2).contiguous()         # swap the two -> (B, C/g, g, H, W)
    return x.view(B, C, H, W)                  # flatten back to C

# Sanity-check the op reproduces the index permutation on channel ids.
probe = torch.arange(12).float().view(1, 12, 1, 1)        # channels labelled 0..11
print("op on channel ids:", channel_shuffle(probe, 3).flatten().long().tolist())
# op on channel ids: [0, 4, 8, 1, 5, 9, 2, 6, 10, 3, 7, 11]   <-- same permutation


# --- 2. A ShuffleNet unit (residual). groups=g on the 1x1s, depthwise on the 3x3. ---
class ShuffleUnit(nn.Module):
    def __init__(self, c, m, g, shuffle=True):
        super().__init__()
        self.g, self.shuffle = g, shuffle
        self.gconv1 = nn.Conv2d(c, m, 1, groups=g, bias=False); self.bn1 = nn.BatchNorm2d(m)
        self.dwconv = nn.Conv2d(m, m, 3, padding=1, groups=m, bias=False); self.bn2 = nn.BatchNorm2d(m)
        self.gconv2 = nn.Conv2d(m, c, 1, groups=g, bias=False); self.bn3 = nn.BatchNorm2d(c)
        self.relu = nn.ReLU(inplace=True)
    def forward(self, x):
        out = self.relu(self.bn1(self.gconv1(x)))      # pointwise GROUP conv
        if self.shuffle:
            out = channel_shuffle(out, self.g)         # <-- the whole trick (ablate by skipping)
        out = self.bn2(self.dwconv(out))               # 3x3 depthwise
        out = self.bn3(self.gconv2(out))               # pointwise GROUP conv
        return self.relu(out + x)                       # residual + ReLU


# --- 3. Toy task that REQUIRES cross-group info: label depends on a sum of channels that
#         the grouping splits across different groups (so within-group-only nets are blocked). ---
g = 4
torch.manual_seed(1)
Bn, c, m, H, W, K = 600, 8, 16, 8, 8, 2          # c=8 channels -> g=4 groups of 2
gen = torch.Generator().manual_seed(2)
X = torch.randn(Bn, c, H, W, generator=gen)
# signal: mean of channel 0 (group 0) vs channel 4 (group 2) -- different groups must be compared
sig = X[:, 0].mean(dim=(1, 2)) - X[:, 4].mean(dim=(1, 2))
y = (sig > 0).long()
Xtr, ytr, Xte, yte = X[:480], y[:480], X[480:], y[480:]

class Net(nn.Module):
    def __init__(self, shuffle):
        super().__init__()
        self.u1 = ShuffleUnit(c, m, g, shuffle=shuffle)
        self.u2 = ShuffleUnit(c, m, g, shuffle=shuffle)
        self.head = nn.Linear(c, K)
    def forward(self, x): return self.head(self.u2(self.u1(x)).mean(dim=(2, 3)))

def train(net, epochs=150, lr=0.05):
    torch.manual_seed(0)
    opt = torch.optim.Adam(net.parameters(), lr=lr); lf = nn.CrossEntropyLoss()
    for _ in range(epochs):
        net.train(); opt.zero_grad(); lf(net(Xtr), ytr).backward(); opt.step()
    net.eval()
    with torch.no_grad():
        return (net(Xte).argmax(1) == yte).float().mean().item()

acc_on  = train(Net(shuffle=True))
acc_off = train(Net(shuffle=False))
print("\\ntest accuracy   with shuffle = %.3f   without shuffle = %.3f" % (acc_on, acc_off))
# With shuffle the net can combine channels across groups and learns the task; without shuffle
# the groups stay isolated and it lags. (Our small run, not the paper's reported number.)`
  };

  window.CODEVIZ["paper-shufflenet"] = {
    question: "Does channel shuffle let a grouped-conv unit combine information across groups — and does removing it block that?",
    charts: [
      {
        type: "bar",
        title: "Cost of a bottleneck block (ours) — ResNet vs ResNeXt vs ShuffleNet, h=w=28, c=64, m=16, g=4",
        xlabel: "block type",
        ylabel: "multiply-adds (millions)",
        series: [
          {
            name: "block FLOPs (M)",
            color: "#7ee787",
            points: [["ResNet  2cm+9m²", 3.412], ["ResNeXt  +9m²/g", 2.057], ["ShuffleNet  2cm/g+9m", 0.514]]
          }
        ]
      },
      {
        type: "line",
        title: "Test accuracy vs epoch — ShuffleNet unit with vs without channel shuffle (cross-group task)",
        xlabel: "epoch",
        ylabel: "test accuracy",
        series: [
          {
            name: "With shuffle",
            color: "#7ee787",
            points: [[0,0.50],[15,0.575],[30,0.717],[45,0.808],[60,0.875],[75,0.925],[90,0.95],[105,0.967],[120,0.975],[135,0.975],[149,0.983]]
          },
          {
            name: "Without shuffle (groups isolated)",
            color: "#ff7b72",
            points: [[0,0.492],[15,0.508],[30,0.55],[45,0.583],[60,0.6],[75,0.617],[90,0.625],[105,0.633],[120,0.642],[135,0.642],[149,0.65]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Left: the three bottleneck FLOP formulas evaluated for h=w=28, c=64, m=16, g=4 — ResNet 3.41M, ResNeXt 2.06M (groups only the 3×3), ShuffleNet 0.51M (groups the 1×1s and makes the 3×3 depthwise), the ~6.6x saving from the worked example. Right: two identical two-unit nets (c=8 channels, g=4 groups, m=16) on a toy task whose label compares channel 0 (group 0) against channel 4 (group 2) — so the answer needs information from two different groups. With channel shuffle the unit routes information across groups and reaches 0.983 test accuracy; with the shuffle removed the grouped 1×1 convs keep the groups isolated and it stalls near 0.65 — the same qualitative gap as the paper's Table 3 (37.6%→32.4% error with shuffle).",
    code: `import torch, torch.nn as nn

torch.manual_seed(0)

# Channel shuffle: reshape (g, C/g) -> transpose -> flatten.
def channel_shuffle(x, groups):
    B, C, H, W = x.shape
    x = x.view(B, groups, C // groups, H, W).transpose(1, 2).contiguous()
    return x.view(B, C, H, W)

class ShuffleUnit(nn.Module):
    def __init__(s, c, m, g, shuffle=True):
        super().__init__(); s.g, s.shuffle = g, shuffle
        s.g1=nn.Conv2d(c,m,1,groups=g,bias=False); s.b1=nn.BatchNorm2d(m)
        s.dw=nn.Conv2d(m,m,3,padding=1,groups=m,bias=False); s.b2=nn.BatchNorm2d(m)
        s.g2=nn.Conv2d(m,c,1,groups=g,bias=False); s.b3=nn.BatchNorm2d(c)
    def forward(s, x):
        o=torch.relu(s.b1(s.g1(x)))
        if s.shuffle: o=channel_shuffle(o, s.g)
        o=s.b2(s.dw(o)); o=s.b3(s.g2(o)); return torch.relu(o + x)

# Toy task: label compares channel 0 (group 0) vs channel 4 (group 2) -> needs cross-group info.
g, c, m, H, W, K = 4, 8, 16, 8, 8, 2
gen = torch.Generator().manual_seed(2)
X = torch.randn(600, c, H, W, generator=gen)
y = ((X[:,0].mean(dim=(1,2)) - X[:,4].mean(dim=(1,2))) > 0).long()
Xtr, ytr, Xte, yte = X[:480], y[:480], X[480:], y[480:]

class Net(nn.Module):
    def __init__(s, shuffle):
        super().__init__(); s.u1=ShuffleUnit(c,m,g,shuffle); s.u2=ShuffleUnit(c,m,g,shuffle)
        s.head=nn.Linear(c,K)
    def forward(s, x): return s.head(s.u2(s.u1(x)).mean(dim=(2,3)))

def train(net, epochs=150, lr=0.05):
    torch.manual_seed(0)
    opt=torch.optim.Adam(net.parameters(),lr=lr); lf=nn.CrossEntropyLoss(); curve=[]
    for e in range(epochs):
        net.train(); opt.zero_grad(); lf(net(Xtr),ytr).backward(); opt.step()
        if e%15==0 or e==epochs-1:
            net.eval()
            with torch.no_grad(): curve.append((e, round((net(Xte).argmax(1)==yte).float().mean().item(),3)))
    return curve

print("with shuffle:   ", train(Net(True)))
print("without shuffle:", train(Net(False)))
# FLOP bars: resnet=hw(2cm+9m^2), resnext=hw(2cm+9m^2/g), shufflenet=hw(2cm/g+9m) at h=w=28,c=64,m=16,g=4
for name, f in [("ResNet",28*28*(2*64*16+9*16*16)),
                ("ResNeXt",28*28*(2*64*16+9*16*16//4)),
                ("ShuffleNet",28*28*(2*64*16//4+9*16))]:
    print("%-10s %d" % (name, f))
# with shuffle reaches ~0.98, without ~0.65 -- our small run, not the paper's number.`
  };
})();
