/* Paper lesson — Group Normalization (Wu & He, 2018).
   Grounded from arXiv:1803.08494 (ar5iv HTML; abstract + Section 3.1, Eq. 1, 2, 7; Section 4.1, Table 2).
   Track A (primitive): build GroupNorm from scratch, verify with torch.allclose vs nn.GroupNorm.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-groupnorm". */
(function () {
  window.LESSONS.push({
    id: "paper-groupnorm",
    title: "Group Normalization — Group Normalization (2018)",
    tagline: "Normalize each example over a GROUP of its channels — not over the batch — so accuracy stays stable even when the batch is tiny.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Yuxin Wu, Kaiming He",
      org: "Facebook AI Research (FAIR)",
      year: 2018,
      venue: "ICCV 2018 (arXiv:1803.08494)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1803.08494",
      code: ""
    },

    conceptLink: "dl-batchnorm",
    partOf: [],
    prereqs: ["dl-batchnorm", "dl-backprop", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Batch Normalization (BN) normalizes each feature using statistics computed
       <b>across the mini-batch</b> &mdash; the small group of examples processed together in one step. To get
       a reliable mean and variance, BN needs the batch to be reasonably large.</p>
       <p><b>What breaks.</b> Many important tasks force a <b>tiny batch</b>: object detection and segmentation
       use high-resolution images that barely fit a handful per graphics card; video models are even hungrier.
       When the batch shrinks to 2 or 4, BN's per-batch statistics become <b>noisy and unrepresentative</b>, and
       accuracy degrades sharply. The paper opens by showing that BN's error "increases rapidly when the batch
       size becomes smaller" (Abstract). BN also behaves differently between training (batch stats) and inference
       (fixed running stats), which is awkward when the two regimes do not match.</p>`,

    contribution:
      `<p>The paper introduces a normalization that does not use the batch at all:</p>
       <ul>
         <li><b>Group Normalization (GN).</b> For each example on its own, split that example's channels into a
         fixed number of <b>groups</b>, and normalize over each group (all the pixels of the channels in that
         group). ("Channel" = one feature map of a convolution layer; "pixel" = one spatial location in a feature
         map.) Because no statistic is shared across examples, GN is <b>independent of the batch size</b>.</li>
         <li><b>A single knob, the group count $G$.</b> GN generalizes two earlier methods: with $G=1$ it becomes
         Layer Normalization (one group = all channels); with $G=C$ (one channel per group) it becomes Instance
         Normalization. Picking $G$ in between (default $G=32$) is what makes GN work well (Section 3.1).</li>
         <li><b>Same train and inference behavior.</b> GN computes its statistics the same way at train and test
         time, so there are no running statistics to maintain and no train/test mismatch.</li>
       </ul>`,

    whyItMattered:
      `<p>GN gave the small-batch regime a normalization that just works. The headline: on ImageNet with a
       ResNet-50, GN's error is "10.6% lower than its BN counterpart" at batch size 2 (Abstract), while GN's
       accuracy is essentially flat from batch size 32 down to 2. That made GN the default normalizer for
       detection and segmentation models (where batches are tiny) and a common choice in video and generative
       models. It is the batch-independent cousin of the BatchNorm lesson and a sibling of the LayerNorm lesson
       &mdash; all three share the same normalize-then-scale-and-shift skeleton, differing only in <i>which set of
       numbers</i> they average over.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract and Figure 1</b> &mdash; the one-picture summary: BN/LN/IN/GN differ only in which
         cells of the (batch, channel, height, width) tensor they pool together. The error-vs-batch-size curve
         is the whole motivation.</li>
         <li><b>Section 3.1, "Group Normalization", Equations 1, 2, and 7</b> &mdash; the four-line method. Eq. 7
         is the only part unique to GN: it defines the group of channels each pixel averages over.</li>
         <li><b>Section 4.1 and Table 2</b> &mdash; the ImageNet ResNet-50 numbers as batch size drops from 32 to 2.</li>
       </ul>
       <p><b>Skim:</b> the COCO detection / Kinetics video experiments (Section 4.2&ndash;4.3) for the qualitative
       point that GN wins wherever batches are small. You do not need their training schedules.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will train the same tiny convolutional classifier on the same toy
       data at several batch sizes &mdash; once with a <code>BatchNorm2d</code> layer, once with a
       <code>GroupNorm</code> layer. As the batch size shrinks from 32 down to 2, what happens to each one's
       final loss? Will BN's loss <b>rise</b> as the batch gets tiny while GN's stays <b>flat</b>? Write your
       guess, then look at the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_groupnorm(x, G, gamma, beta, eps)</code> using raw
       tensors, no <code>nn.GroupNorm</code>. Input <code>x</code> has shape <code>(N, C, H, W)</code>
       (batch, channels, height, width):</p>
       <ul>
         <li>Reshape the channels into groups: <code># TODO: xg = x.view(N, G, C//G, H, W)</code>. Each example
         now has $G$ groups, each holding $C/G$ channels.</li>
         <li>Per example, per group, compute the mean and the <b>biased</b> variance over the last three axes
         (the $C/G$ channels and all $H\\times W$ pixels): <code># TODO: mu, var over dims (2,3,4)</code>. Keep
         dims so they broadcast back.</li>
         <li>Normalize: <code># TODO: xg = (xg - mu) / sqrt(var + eps)</code>, then reshape back to
         <code>(N, C, H, W)</code>.</li>
         <li>Scale and shift <b>per channel</b>: <code># TODO: return xhat * gamma + beta</code> with
         <code>gamma, beta</code> shaped <code>(1, C, 1, 1)</code>.</li>
       </ul>
       <p>The CODE cell is the full reference, including the <code>torch.allclose</code> check against
       <code>nn.GroupNorm</code> &mdash; that passing check proves your formula is exactly right.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Every normalization layer in this family does the same three things &mdash; center, scale, then learn a
       new center and scale &mdash; and differs <b>only in which numbers it averages over</b>. Picture the
       activation tensor with four axes: $N$ (which example in the batch), $C$ (which channel), and $H,W$ (the
       spatial grid). For one output value, the question is: <i>which other values do I pool with to get my mean
       and variance?</i></p>
       <ul>
         <li><b>BatchNorm</b> pools over $N$, $H$, $W$ for a fixed channel &mdash; it reaches <i>across examples</i>.
         That is why it needs a big batch.</li>
         <li><b>LayerNorm</b> pools over $C$, $H$, $W$ for a fixed example &mdash; all channels together, no batch.</li>
         <li><b>InstanceNorm</b> pools over $H$, $W$ for a fixed example <i>and</i> a fixed channel.</li>
         <li><b>GroupNorm</b> splits the $C$ channels into $G$ equal groups and pools over $H$, $W$ <i>and the
         $C/G$ channels of one group</i>, for a fixed example. No axis touches $N$, so the batch size is irrelevant.</li>
       </ul>
       <p>Concretely, GN does this for each example:</p>
       <ol>
         <li><b>Group the channels.</b> With $C$ channels and $G$ groups, channels $0\\ldots C/G-1$ form group 0,
         the next $C/G$ form group 1, and so on.</li>
         <li><b>Mean and variance per group.</b> For a group, average all its numbers &mdash; every pixel of every
         channel in the group &mdash; to get one mean $\\mu_i$ and one variance.</li>
         <li><b>Normalize.</b> Subtract that group's mean and divide by its standard deviation
         $\\sqrt{\\sigma_i^2+\\epsilon}$. Now each group has mean $0$, variance $\\approx 1$.</li>
         <li><b>Scale and shift per channel.</b> Multiply by a learned $\\gamma$ and add a learned $\\beta$, one
         pair <b>per channel</b> (not per group), so the layer can recover any output it needs.</li>
       </ol>
       <p>Because steps 1&ndash;3 never look at other examples, GN gives the same answer whether the batch holds
       256 images or 1 &mdash; train and test included.</p>`,

    architecture:
      `<p><b>GN as a layer (per-group channel normalization).</b> A GroupNorm layer is parameterized by two numbers
       &mdash; the channel count $C$ (fixed by the preceding conv) and the group count $G$ (a hyperparameter,
       default 32, with $C$ divisible by $G$) &mdash; plus two learned vectors $\\gamma,\\beta\\in\\mathbb{R}^{C}$.
       It is a drop-in replacement for a BatchNorm layer and carries <b>no running statistics buffer</b>, since it
       never aggregates across examples. The forward pass is the few-line reshape&ndash;reduce&ndash;reshape the
       paper highlights:</p>
       <ol>
         <li><b>Input.</b> An activation tensor of shape $(N,C,H,W)$ from the previous conv layer.</li>
         <li><b>Reshape into groups.</b> View it as $(N,G,C/G,H,W)$ &mdash; the $C$ channels are split into $G$
         contiguous groups of $C/G$ channels each. This grouping is the only structural difference from the other
         three normalizers.</li>
         <li><b>Reduce.</b> Compute mean $\\mu$ and biased variance $\\sigma^2$ over axes $(2,3,4)$ &mdash; the
         $C/G$ channels and the $H\\times W$ pixels &mdash; keeping axes $(N,G)$. This yields one $(\\mu,\\sigma)$
         per example per group, i.e. $N\\cdot G$ statistics, each pooled over $m=(C/G)\\,H\\,W$ values.</li>
         <li><b>Normalize and reshape back.</b> $\\hat{x}=(x-\\mu)/\\sqrt{\\sigma^2+\\epsilon}$, broadcasting the
         per-group statistics; then view back to $(N,C,H,W)$.</li>
         <li><b>Per-channel affine.</b> Multiply by $\\gamma$ and add $\\beta$, each reshaped to $(1,C,1,1)$ so the
         scale/shift is applied <b>per channel</b>, not per group &mdash; $C$ scales and $C$ shifts total.</li>
       </ol>
       <p>Cost is one reduction over the activations and a $\\Theta(C)$ affine; no parameters or buffers grow with
       the batch. In a network, GN slots wherever BatchNorm would go &mdash; typically conv &rarr; GN &rarr; ReLU
       inside a ResNet block &mdash; and the identical code path runs at train and test time.</p>`,

    symbols: [
      { sym: "channel", desc: "one feature map produced by a convolution layer (e.g. an edge detector's output grid). A conv layer with $C$ channels outputs $C$ such grids per image." },
      { sym: "pixel", desc: "one spatial location $(h,w)$ inside a feature map; a channel of size $H\\times W$ has $H\\cdot W$ pixels." },
      { sym: "$N$", desc: "the batch axis: which example in the mini-batch. GN never averages over this axis, which is why it is batch-size-independent." },
      { sym: "$C$", desc: "the number of channels in the layer." },
      { sym: "$H,W$", desc: "the height and width of each feature map (the spatial grid)." },
      { sym: "$G$", desc: "the number of groups the channels are split into (default 32). Each group holds $C/G$ channels." },
      { sym: "$i$", desc: "an index naming one output value, written as coordinates $(i_N,i_C,i_H,i_W)$ &mdash; its example, channel, and spatial position." },
      { sym: "$\\mathcal{S}_i$", desc: "the set of values pooled together to normalize output $i$ &mdash; 'S' for set. For GN it is every pixel of every channel in $i$'s group, within $i$'s own example." },
      { sym: "$x_i$", desc: "the raw activation value at index $i$ before normalizing." },
      { sym: "$m$", desc: "the number of values in $\\mathcal{S}_i$; for GN, $m = (C/G)\\cdot H\\cdot W$ (the group's channels times the spatial size)." },
      { sym: "$\\mu_i$", desc: "the mean of the values in $\\mathcal{S}_i$ (the group's center)." },
      { sym: "$\\sigma_i$", desc: "the standard deviation of $\\mathcal{S}_i$ (with $\\epsilon$ added inside the square root); measures the group's spread." },
      { sym: "$\\epsilon$", desc: "epsilon, a tiny constant (e.g. $10^{-5}$) added inside the square root so we never divide by zero." },
      { sym: "$\\hat{x}_i$", desc: "the normalized value: $x_i$ re-centered and re-scaled to mean 0, variance about 1 within its group." },
      { sym: "$\\gamma,\\beta$", desc: "the learned per-channel scale and shift, applied after normalizing, trained by gradient descent &mdash; same role as in BatchNorm." }
    ],

    formula:
      `$$\\hat{x}_i=\\frac{1}{\\sigma_i}\\,(x_i-\\mu_i)\\qquad\\text{(Eq. 1, the generic normalize step)}$$
       Generic step every method in this family shares: re-center by the set mean and re-scale by the set standard deviation.
       $$\\mu_i=\\frac{1}{m}\\sum_{k\\in\\mathcal{S}_i}x_k,\\qquad
        \\sigma_i=\\sqrt{\\frac{1}{m}\\sum_{k\\in\\mathcal{S}_i}(x_k-\\mu_i)^2+\\epsilon}\\qquad\\text{(Eq. 2)}$$
       Mean and standard deviation are taken over the <b>pooling set</b> $\\mathcal{S}_i$, whose size is $m=\\lvert\\mathcal{S}_i\\rvert$. The whole identity of a normalization method is the single choice of $\\mathcal{S}_i$ below.
       $$\\mathcal{S}_i=\\{\\,k \\mid k_C=i_C\\,\\}\\qquad\\text{(Eq. 3, BatchNorm: same channel, pool over } N,H,W)$$
       BatchNorm: fix the channel, pool over all examples and spatial positions &mdash; the only choice that reaches across the batch.
       $$\\mathcal{S}_i=\\{\\,k \\mid k_N=i_N\\,\\}\\qquad\\text{(Eq. 4, LayerNorm: same example, pool over } C,H,W)$$
       LayerNorm: fix the example, pool over all of its channels and pixels &mdash; one group spanning every channel.
       $$\\mathcal{S}_i=\\{\\,k \\mid k_N=i_N,\\;k_C=i_C\\,\\}\\qquad\\text{(Eq. 5, InstanceNorm: same example and channel, pool over } H,W)$$
       InstanceNorm: fix the example <i>and</i> the channel, pool over only the spatial grid &mdash; each channel normalized alone.
       $$\\mathcal{S}_i=\\Big\\{\\,k \\;\\Big|\\; k_N=i_N,\\;\\Big\\lfloor\\tfrac{k_C}{C/G}\\Big\\rfloor=\\Big\\lfloor\\tfrac{i_C}{C/G}\\Big\\rfloor\\,\\Big\\}\\qquad\\text{(Eq. 7, GroupNorm: same example and channel-group)}$$
       GroupNorm: fix the example and pool over $H,W$ and the $C/G$ channels of one group; integer-dividing the channel index by the group width $C/G$ selects the group. With $G=1$ this is LayerNorm; with $G=C$ it is InstanceNorm; $G=32$ (default) sits between.
       $$y_i=\\gamma\\,\\hat{x}_i+\\beta\\qquad\\text{(Eq. 6, learned per-channel scale and shift)}$$
       Same affine restore step as BatchNorm: one learned $\\gamma,\\beta$ pair <b>per channel</b>, applied after normalizing.`,

    whatItDoes:
      `<p>Equations 1 and 2 are the generic normalize step shared by the whole family: center by the set mean
       $\\mu_i$ and divide by the set standard deviation $\\sigma_i$. The entire identity of a method is then the
       single choice of pooling set $\\mathcal{S}_i$. BatchNorm (Eq. 3) fixes the channel and pools across the
       batch ($k_C=i_C$); LayerNorm (Eq. 4) fixes the example and pools all its channels ($k_N=i_N$);
       InstanceNorm (Eq. 5) fixes both ($k_N=i_N,k_C=i_C$). <b>GroupNorm (Eq. 7)</b> keeps the same example
       ($k_N=i_N$) and the same <b>group</b> of channels &mdash; two channels fall in one group when
       $\\lfloor k_C/(C/G)\\rfloor$ equals $\\lfloor i_C/(C/G)\\rfloor$, i.e. integer-dividing the channel index by
       the group width gives the same group number (Section 3.1). The final learned per-channel $\\gamma,\\beta$
       (Eq. 6) then restore the layer's full expressive power.</p>`,

    derivation:
      `<p>Why normalizing to mean 0 / variance 1 (before the learned $\\gamma,\\beta$) stabilizes training &mdash;
       and the gradient through $\\mu$, $\\sigma$, $\\hat{x}$, $\\gamma$, $\\beta$ &mdash; is derived in the
       <code>dl-batchnorm</code> concept lesson; GN reuses exactly that backward pass, only over a different
       index set $\\mathcal{S}_i$. The one new idea here is purely <i>which numbers go into the average</i>: GN
       drops the $N$ (batch) axis that BN pools over and instead pools the spatial positions of a group of
       $C/G$ channels. Because the set $\\mathcal{S}_i$ contains no values from other examples, the per-example
       statistics &mdash; and therefore the layer's output for that example &mdash; do not change with the batch
       size. That single fact is the paper's whole advantage over BN.</p>`,

    example:
      `<p><b>Worked numbers</b> (one image, $C=4$ channels, $G=2$ groups so $C/G=2$ channels per group, spatial
       size $H\\times W=1\\times 2$, $\\epsilon$ tiny enough to ignore). Take group 0 = channels 0 and 1, with
       values channel&nbsp;0 $=[1,3]$ and channel&nbsp;1 $=[5,7]$. The pooling set $\\mathcal{S}$ for group 0 is
       all four of these numbers, so $m=4$.</p>
       <ul class="steps">
         <li><b>Mean</b> (Eq. 2): $\\mu=(1+3+5+7)/4 = 16/4 = 4$.</li>
         <li><b>Variance</b> (Eq. 2, biased, divide by $m=4$): $\\sigma^2=\\big((1-4)^2+(3-4)^2+(5-4)^2+(7-4)^2\\big)/4=(9+1+1+9)/4=5$.</li>
         <li><b>Std</b>: $\\sigma=\\sqrt{5}\\approx 2.236$.</li>
         <li><b>Normalize</b> (Eq. 1): subtract $\\mu$ then divide by $\\sigma$, cell by cell &mdash; see the table.</li>
         <li><b>Scale &amp; shift</b> (Eq. 6): with $\\gamma=1,\\beta=0$ the output equals $\\hat{x}$ unchanged.</li>
       </ul>
       <table class="extable">
        <caption>Group 0's four values normalized: $\\hat{x}=(x-\\mu)/\\sigma$ with $\\mu=4,\\;\\sigma\\approx 2.236$.</caption>
        <thead><tr><th>cell</th><th class="num">$x$</th><th class="num">$x-\\mu$</th><th class="num">$\\hat{x}$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">ch0, pix0</td><td class="num">$1$</td><td class="num">$-3$</td><td class="num">$-1.342$</td></tr>
         <tr><td class="row-h">ch0, pix1</td><td class="num">$3$</td><td class="num">$-1$</td><td class="num">$-0.447$</td></tr>
         <tr><td class="row-h">ch1, pix0</td><td class="num">$5$</td><td class="num">$1$</td><td class="num">$0.447$</td></tr>
         <tr><td class="row-h">ch1, pix1</td><td class="num">$7$</td><td class="num">$3$</td><td class="num">$1.342$</td></tr>
        </tbody>
       </table>
       <p>So $\\hat{x}=[-1.342,\\,-0.447,\\,0.447,\\,1.342]$ &mdash; mean $0$, variance $\\approx 1$ within the group.
       The CODE cell recomputes these exact numbers and checks the whole layer against
       <code>nn.GroupNorm(2, 4)</code>.</p>`,

    recipe:
      `<p><b>Group Normalization as numbered steps (Eq. 1, 2, 7):</b></p>
       <ol>
         <li>Reshape activations $(N,C,H,W)$ into $(N,G,C/G,H,W)$ &mdash; split channels into $G$ groups.</li>
         <li>For each example and each group, compute the mean $\\mu_i$ over the group's channels and pixels.</li>
         <li>Compute the biased variance $\\sigma_i^2$ over the same set (divide by $m=(C/G)HW$).</li>
         <li>Normalize: $\\hat{x}=(x-\\mu_i)/\\sqrt{\\sigma_i^2+\\epsilon}$; reshape back to $(N,C,H,W)$.</li>
         <li>Scale and shift per channel: $y=\\gamma\\hat{x}+\\beta$ with $\\gamma,\\beta$ of shape $(1,C,1,1)$.</li>
         <li>Same path at train and test &mdash; no running statistics.</li>
       </ol>`,

    results:
      `<p>Quoted from the paper: on ImageNet with ResNet-50, "GN can outperform its BN counterpart for small
       batch sizes" (Abstract). Table 2 (Section 4.1) reports validation error as the batch size drops: BN
       degrades from <b>23.6% at batch size 32</b> to <b>34.7% at batch size 2</b>, while GN stays at
       <b>24.1%</b> across that range &mdash; so at batch size 2 GN's error is "10.6% lower than its BN
       counterpart" (Abstract). (Source: arXiv:1803.08494, Abstract and Table 2.)</p>`,

    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> GN is a layer, not a model &mdash; so "working" has two levels. (a)
       <b>Layer correctness:</b> the metric is whether <code>torch.allclose(my_gn(x), nn.GroupNorm(G,C)(x), atol=1e-6)</code>
       returns <code>True</code>. The trivial baseline is "off by a constant scale/shift" &mdash; close but not allclose.
       (b) <b>System metric:</b> top-1/top-5 validation error on the paper's ImageNet ResNet-50 setup as the batch size
       shrinks; the "no-skill" reference is BatchNorm's own error at the SAME batch size, which GN must match at large
       batch and beat at tiny batch.</p>
       <ul>
         <li><b>2. Sanity checks BEFORE the full run.</b> Check output shape equals input $(N,C,H,W)$. Per example and
         per group, the normalized $\\hat{x}$ (before $\\gamma,\\beta$) must have mean $\\approx 0$ and variance
         $\\approx 1$ &mdash; assert <code>xhat.view(N,G,-1).mean(-1)</code> is near 0 and <code>.var(-1, unbiased=False)</code>
         near 1. Recompute the worked $[1,3,5,7]$ group by hand and confirm $\\hat{x}=[-1.342,-0.447,0.447,1.342]$.
         Feed a single example alone vs inside a batch and confirm <b>identical</b> output (the batch-independence
         property). All of these are cheap and catch a broken build before any training.</li>
         <li><b>3. Expected range.</b> The allclose must pass to <code>atol=1e-6</code> &mdash; anything larger means a
         real formula bug (wrong axes, unbiased variance), not numerical noise. For the system, anchor to the paper's
         Table 2 (arXiv:1803.08494): GN $\\approx$ <b>24.1%</b> error roughly flat from batch 32 down to 2, while BN
         goes <b>23.6% &rarr; 34.7%</b> over the same range. As a rule of thumb (not a paper claim), if your GN error
         <i>also</i> climbs steeply as the batch shrinks, the batch axis has leaked into the reduction.</li>
         <li><b>4. Ablation &mdash; prove grouping earns its keep.</b> The central knob is the group count $G$ and the
         fact that no axis touches $N$. Two ablations: (i) swap GN for BatchNorm and re-run the batch-size sweep &mdash;
         the tiny-batch error must DROP for GN and RISE for BN (our toy run: BN $0.058\\!\\to\\!0.137$, GN flat $\\approx0.083$);
         (ii) set $G=1$ (LayerNorm) and $G=C$ (InstanceNorm) and confirm accuracy degrades vs the default $G=32$ &mdash;
         if all three tie, grouping isn't doing anything and $G$ is likely mis-wired.</li>
         <li><b>5. Failure signals.</b> <b>allclose fails by a constant factor</b> &rarr; used unbiased variance
         (divide by $m-1$ instead of $m$) or wrong $\\epsilon$. <b>Output changes when batch size changes</b> &rarr; the
         reduction includes axis $N$ &mdash; it has become BatchNorm-like. <b>Shape/constructor error</b> &rarr; $C$ not
         divisible by $G$. <b>$\\gamma,\\beta$ have no effect or wrong count</b> &rarr; applied per group instead of per
         channel (must be $(1,C,1,1)$). <b>Tiny-batch accuracy still collapses</b> like the BN curve in the CODEVIZ chart
         &rarr; you are normalizing over the batch, the exact failure GN exists to remove.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>nn.GroupNorm(G, C)</code> in one line. Here you
       <b>build it from scratch</b> with raw tensors: reshape into groups, per-example per-group mean/variance,
       normalize, then per-channel scale/shift. The payoff is the
       <code>torch.allclose(my_gn(x), nn.GroupNorm(G, C)(x))</code> check &mdash; if it passes, your formula is
       provably identical to PyTorch's. There are no running statistics to build, because GN does not use the
       batch.</p>`,

    pitfalls:
      `<ul>
         <li><b>Wrong reduction axes.</b> GN averages over the group's channels <i>and</i> all spatial pixels, but
         <b>never</b> over the batch axis $N$. Accidentally including $N$ turns it back into something
         BatchNorm-like and reintroduces batch dependence.</li>
         <li><b>$C$ must be divisible by $G$.</b> The groups are equal-sized, so $C/G$ must be a whole number.
         <code>nn.GroupNorm</code> raises an error otherwise; match its constraint.</li>
         <li><b>$\\gamma,\\beta$ are per channel, not per group.</b> There are $C$ scales and $C$ shifts, broadcast
         as $(1,C,1,1)$ &mdash; one per channel, applied after the group normalization.</li>
         <li><b>Biased variance.</b> Like BN's train path, GN normalizes with the <b>biased</b> variance (divide by
         $m$, not $m-1$). Use <code>unbiased=False</code> or the allclose fails.</li>
         <li><b>Confusing the special cases.</b> $G=1$ is LayerNorm (all channels in one group); $G=C$ is
         InstanceNorm (one channel per group). The default $G=32$ sits between them &mdash; that is the regime the
         paper recommends.</li>
       </ul>`,

    recall: [
      "Which tensor axes does GroupNorm average over, and which one does it deliberately NOT touch?",
      "Write the normalize step from memory: $\\hat{x}=(x-\\mu_i)/\\sqrt{\\sigma_i^2+\\epsilon}$.",
      "What does $\\mathcal{S}_i$ (Eq. 7) contain for GroupNorm?",
      "What does GN reduce to when $G=1$, and when $G=C$?",
      "Why is GN's accuracy stable as the batch size shrinks while BN's degrades?"
    ],

    practice: [
      {
        q: `Normalize one GroupNorm group with values $[2,4,6,8]$ ($m=4$), then apply $\\gamma=2,\\beta=1$. (Ignore $\\epsilon$.)`,
        steps: [
          { do: `Mean: $\\mu=(2+4+6+8)/4=5$.`, why: `Center of the group's pooled values.` },
          { do: `Variance: $\\sigma^2=((2-5)^2+(4-5)^2+(6-5)^2+(8-5)^2)/4=(9+1+1+9)/4=5$; std $\\approx 2.236$.`, why: `Biased spread (divide by $m=4$).` },
          { do: `Normalize: $[(2-5),(4-5),(6-5),(8-5)]/2.236=[-1.342,-0.447,0.447,1.342]$.`, why: `Mean 0, variance ~1 within the group.` },
          { do: `Scale/shift: $2\\cdot[-1.342,-0.447,0.447,1.342]+1=[-1.683,0.106,1.894,3.683]$.`, why: `Learned per-channel $\\gamma,\\beta$.` }
        ],
        answer: `$\\hat{x}=[-1.342,-0.447,0.447,1.342]$, output $=[-1.683,0.106,1.894,3.683]$. Same normalized shape as the $[1,3,5,7]$ example &mdash; GN is invariant to the group's original center and scale.`
      },
      {
        q: `Ablation: train the tiny conv net with GroupNorm and with BatchNorm at batch sizes 32 and 2. What do you expect for each as the batch shrinks?`,
        steps: [
          { do: `Run BN at batch size 32, then at batch size 2; record the final loss each time.`, why: `BN's statistics come from the batch, so they get noisy when the batch is tiny.` },
          { do: `Run GN at batch size 32, then at batch size 2.`, why: `GN's statistics are per example, so the batch size should not matter.` },
          { do: `Compare the two curves (the CODEVIZ chart).`, why: `Same net, same data, same steps &mdash; only the normalizer and batch size differ.` }
        ],
        answer: `BN's loss rises sharply as the batch shrinks (in our small run, ~0.058 at batch 32 to ~0.137 at batch 2), while GN stays roughly flat (~0.083 at every batch size). At batch size 2 GN now beats BN. This reproduces the paper's qualitative claim: GN is stable across batch sizes where BN degrades.`
      },
      {
        q: `Why does GroupNorm give the SAME output for an example whether the batch holds 256 images or just 1?`,
        steps: [
          { do: `Look at the pooling set $\\mathcal{S}_i$ (Eq. 7): it requires $k_N=i_N$.`, why: `Every value averaged shares the example's own batch index.` },
          { do: `Note that no value from any other example ever enters $\\mu_i$ or $\\sigma_i$.`, why: `So the statistics depend only on this one example's activations.` }
        ],
        answer: `Because $\\mathcal{S}_i$ is confined to the example's own channels and pixels, the mean and variance &mdash; and thus the normalized output &mdash; are computed entirely within that one example. Other examples in the batch have no effect, so the result is identical for any batch size, and train and test behave the same.`
      }
    ]
  });

  window.CODE["paper-groupnorm"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build GroupNorm from scratch with raw tensors: reshape channels into G groups, take per-example ` +
      `per-group mean/variance, normalize, then scale (gamma) and shift (beta) per channel. Prove it is ` +
      `identical to PyTorch with torch.allclose vs nn.GroupNorm(G, C), recompute the [1,3,5,7] worked ` +
      `example, and drop it into a tiny conv net. Runs in Colab (torch is preinstalled).`,
    code: `import torch, torch.nn as nn

torch.manual_seed(0)

class MyGroupNorm(nn.Module):
    """GroupNorm from scratch — Wu & He (2018), Eq. 1, 2, 7."""
    def __init__(self, num_groups, num_channels, eps=1e-5):
        super().__init__()
        assert num_channels % num_groups == 0, "C must be divisible by G"
        self.G, self.C, self.eps = num_groups, num_channels, eps
        self.gamma = nn.Parameter(torch.ones(num_channels))   # per-channel scale
        self.beta  = nn.Parameter(torch.zeros(num_channels))  # per-channel shift

    def forward(self, x):                          # x: (N, C, H, W)
        N, C, H, W = x.shape
        xg = x.view(N, self.G, C // self.G, H, W)              # split channels into G groups (Eq. 7)
        mu  = xg.mean(dim=(2, 3, 4), keepdim=True)             # per-example, per-group mean  (Eq. 2)
        var = xg.var(dim=(2, 3, 4), unbiased=False, keepdim=True)  # biased variance /m       (Eq. 2)
        xg  = (xg - mu) / torch.sqrt(var + self.eps)           # normalize                    (Eq. 1)
        xhat = xg.view(N, C, H, W)
        return xhat * self.gamma.view(1, C, 1, 1) + self.beta.view(1, C, 1, 1)  # scale & shift per channel

# ---- THE ORACLE: my GN must equal nn.GroupNorm ----
N, C, H, W, G = 4, 8, 5, 5, 2
x = torch.randn(N, C, H, W)
mine = MyGroupNorm(G, C)
ref  = nn.GroupNorm(G, C)         # same default eps=1e-5, gamma=1, beta=0
print("allclose:", torch.allclose(mine(x), ref(x), atol=1e-6))   # expect True

# ---- recompute the worked example: 1 image, C=4, G=2, group0 = ch0[1,3], ch1[5,7] ----
gn = MyGroupNorm(2, 4)
xe = torch.tensor([[[[1., 3.]], [[5., 7.]], [[0., 0.]], [[0., 0.]]]])  # (1,4,1,2)
print("worked xhat group0:", gn(xe)[0, :2].flatten().tolist())   # ~ [-1.342, -0.447, 0.447, 1.342]

# ---- GN is batch-size-independent: same example -> same output in any batch ----
one  = MyGroupNorm(G, C); one.eval()
xa = x[:1]                                  # a single example
big = one(x)[0]                             # its output inside a batch of 4
solo = one(xa)[0]                           # its output alone
print("same in batch of 4 vs 1:", torch.allclose(big, solo, atol=1e-6))  # expect True

# ---- drop it into a tiny conv net ----
net = nn.Sequential(nn.Conv2d(3, 8, 3, padding=1), MyGroupNorm(2, 8), nn.ReLU(),
                    nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(8, 2))
print("net output shape:", net(torch.randn(5, 3, 8, 8)).shape)   # torch.Size([5, 2])`
  };

  window.CODEVIZ["paper-groupnorm"] = {
    question: "Train the same tiny conv classifier on the same toy data at shrinking batch sizes, with a BatchNorm layer vs a GroupNorm layer — does BN's error rise as the batch gets tiny while GN stays flat?",
    charts: [
      {
        type: "line",
        title: "Final loss vs batch size: GroupNorm (flat) vs BatchNorm (rises as batch shrinks)",
        xlabel: "batch size (decreasing →)",
        ylabel: "final loss (cross-entropy on full set)",
        series: [
          {
            name: "GroupNorm",
            color: "#7ee787",
            points: [[32, 0.0831], [16, 0.0831], [8, 0.0823], [4, 0.0851], [2, 0.0869]]
          },
          {
            name: "BatchNorm",
            color: "#ff7b72",
            points: [[32, 0.0581], [16, 0.0563], [8, 0.0568], [4, 0.0720], [2, 0.1372]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (PyTorch, seed 0), not the paper's reported numbers. Same tiny conv classifier, same toy data, same 60 steps, only the normalizer and batch size differ. With a large batch (32) BatchNorm is slightly better, but as the batch shrinks to 4 then 2 its loss climbs steeply (0.058 → 0.137) because its per-batch statistics get noisy. GroupNorm's loss is essentially flat (~0.083 at every batch size) because its statistics are computed per example, independent of the batch — so at batch size 2 GN now wins. This mirrors the paper's Table 2 trend (BN 23.6%→34.7% from batch 32 to 2, GN flat at 24.1%).",
    code: `import torch, torch.nn as nn

def make_data(n=512):
    g = torch.Generator().manual_seed(7)
    X = torch.randn(n, 3, 8, 8, generator=g)
    y = (X[:, 0].mean(dim=(1, 2)) > 0).long()   # label from channel-0 patch mean
    X[y == 1] += 0.6
    return X, y

def run(norm, bs, steps=60, lr=0.1):
    torch.manual_seed(0)
    nlayer = nn.BatchNorm2d(8) if norm == "bn" else nn.GroupNorm(4, 8)
    net = nn.Sequential(nn.Conv2d(3, 8, 3, padding=1), nlayer, nn.ReLU(),
                        nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(8, 2))
    opt = torch.optim.SGD(net.parameters(), lr=lr)
    lossf = nn.CrossEntropyLoss()
    X, y = make_data()
    net.train()
    g = torch.Generator().manual_seed(123)
    for _ in range(steps):
        idx = torch.randint(0, X.shape[0], (bs,), generator=g)
        opt.zero_grad()
        loss = lossf(net(X[idx]), y[idx]); loss.backward(); opt.step()
    net.eval()
    with torch.no_grad():
        return round(lossf(net(X), y).item(), 4)

print("bs   BN      GN")
for bs in [32, 16, 8, 4, 2]:
    print(f"{bs:<4} {run('bn', bs):.4f}  {run('gn', bs):.4f}")
# BN: 0.0581 0.0563 0.0568 0.0720 0.1372  (rises as batch shrinks)
# GN: 0.0831 0.0831 0.0823 0.0851 0.0869  (flat)`
  };
})();
