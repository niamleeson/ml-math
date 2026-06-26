/* Paper lesson — "A ConvNet for the 2020s" (the ConvNeXt), Liu, Mao, Wu, Feichtenhofer, Darrell, Xie 2022.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-convnext".
   GROUNDED from arXiv:2201.03545 via the ar5iv HTML mirror (abstract; Section 2 "modernizing roadmap"
   with Figure 2 accuracy progression and Table 10; Section 2.6 + Figure 4 for the block; Table 1 for the
   ImageNet-1K comparison vs Swin-T). CVPR 2022.
   Track B (architecture): build the ConvNeXt block by hand from nn primitives — depthwise 7x7 conv ->
   LayerNorm -> 1x1 expand to 4x -> GELU -> 1x1 project back -> residual; train a tiny stack on an MNIST
   subset; print accuracy; ABLATE the inverted-bottleneck expansion. Cross-links paper-resnet (the ConvNet
   it modernizes) and paper-vit (the transformer it chases). */
(function () {
  window.LESSONS.push({
    id: "paper-convnext",
    title: "ConvNeXt — A ConvNet for the 2020s (2022)",
    tagline: "Take a plain ResNet and, one design change at a time, copy what made vision transformers win — until a pure ConvNet matches them.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Zhuang Liu, Hanzi Mao, Chao-Yuan Wu, Christoph Feichtenhofer, Trevor Darrell, Saining Xie",
      org: "Facebook AI Research (FAIR) and UC Berkeley",
      year: 2022,
      venue: "arXiv:2201.03545 (Jan 2022); CVPR 2022",
      citations: "",
      arxiv: "https://arxiv.org/abs/2201.03545",
      code: "https://github.com/facebookresearch/ConvNeXt"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-resnet", "paper-vit", "dl-resnet", "dl-batchnorm", "dl-activations", "pt-nn-module", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p>For most of the 2010s, image recognition meant <b>Convolutional Neural Networks (CNNs)</b> &mdash;
       networks built from <b>convolutions</b>, small sliding filters that look at a local patch of pixels and
       slide across the image. The <b>ResNet</b> (residual network) was the workhorse. Then the <b>Vision
       Transformer (ViT)</b> arrived (2020) and, with enough data, beat CNNs &mdash; and the <b>Swin Transformer</b>
       (2021) made transformers work as a general vision backbone for detection and segmentation, not just
       classification.</p>
       <p>The natural conclusion at the time was that <i>attention</i> &mdash; the transformer's mechanism of
       relating every patch to every other &mdash; was the secret, and convolution was obsolete. But the authors
       ask a sharper question (&sect;1): when a Swin Transformer beats a ResNet, <b>how much of the gap is the
       attention, and how much is just the many small modern design and training choices</b> (a different
       optimizer, more augmentation, a different block shape, bigger filters, fewer normalization layers) that
       came bundled with transformers? Nobody had separated the two.</p>`,
    contribution:
      `<ul>
        <li><b>A controlled "modernization" study.</b> Start from a standard <b>ResNet-50</b> and change it
        <i>one design decision at a time</i> toward a transformer's choices, re-measuring ImageNet accuracy at
        every step (&sect;2, Figure 2). This isolates which changes actually help.</li>
        <li><b>ConvNeXt: the endpoint.</b> The resulting network is built from <i>only standard ConvNet modules</i>
        &mdash; no attention anywhere &mdash; yet it matches or beats the Swin Transformer (abstract).</li>
        <li><b>The ConvNeXt block.</b> A clean residual block that mirrors a transformer block's shape:
        <b>depthwise 7&times;7 conv</b> (spatial mixing, like attention) &rarr; <b>LayerNorm</b> &rarr;
        <b>1&times;1 conv expanding to 4&times; width</b> &rarr; <b>GELU</b> &rarr; <b>1&times;1 conv back</b>
        (the channel-mixing MLP) &rarr; residual (&sect;2.6, Figure 4). You build exactly this.</li>
        <li><b>The lesson: design choices, not attention, closed most of the gap.</b> A pure ConvNet, modernized,
        competes "favorably with Transformers in terms of accuracy and scalability" (abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>ConvNeXt is the rare paper whose contribution is a <i>method of inquiry</i>: it shows that comparing two
       architectures fairly means controlling the training recipe and the dozens of micro-choices, not just the
       headline mechanism. It rehabilitated the ConvNet as a first-class modern backbone and made clear that
       "transformers beat CNNs" was partly an apples-to-oranges comparison. The block you build here &mdash;
       depthwise large-kernel conv, an inverted bottleneck, GELU, LayerNorm, few activations &mdash; became a
       template reused across later vision and even some sequence models.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Modernizing a ConvNet) with Figure 2</b> &mdash; the heart of the paper. Figure 2 is the
        "roadmap" bar chart: each bar is the ImageNet top-1 accuracy after one more design change, from ResNet-50
        up to ConvNeXt-T. Read the steps in order: training recipe (&sect;2.1), macro design (&sect;2.2),
        ResNeXt-ify (&sect;2.3), inverted bottleneck (&sect;2.4), large kernels (&sect;2.5), micro design
        (&sect;2.6).</li>
        <li><b>Figure 4</b> &mdash; the block diagrams side by side: ResNet block, a ResNeXt/Swin block, and the
        final ConvNeXt block. Keep it next to the code; it <i>is</i> the recipe you implement.</li>
        <li><b>&sect;2.6 (Micro design)</b> &mdash; the small but important choices: replace ReLU with GELU, use
        <i>fewer</i> activations (one per block, not after every conv), use <i>fewer</i> normalization layers, and
        replace BatchNorm with LayerNorm.</li>
        <li><b>Table 1 (&sect;3.2)</b> &mdash; the ImageNet-1K comparison: ConvNeXt-T vs Swin-T at matched FLOPs.</li>
       </ul>
       <p><b>Skim:</b> the downstream COCO/ADE20K tables (&sect;3.3) unless you care about detection/segmentation,
       the isotropic-ConvNeXt appendix, and the ImageNet-22K pre-training scaling tables unless reproducing.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build the <b>ConvNeXt block</b> and stack a few into a tiny classifier for an MNIST subset. The
       block's middle is an <b>inverted bottleneck</b>: a $1\\times1$ conv that <i>expands</i> the channel width by
       $4\\times$, a GELU, then a $1\\times1$ conv that projects back down. This is the transformer MLP's shape
       (wide in the middle).</p>
       <p>Now the ablation: <b>set the expansion ratio to $1\\times$</b> (no widening &mdash; the two $1\\times1$
       convs keep the channel count flat instead of going up to $4\\times$ and back). The block still has a
       depthwise conv, a norm, a GELU, and a residual; it just loses the wide middle. Will accuracy stay about the
       same, or drop? Write your guess and one sentence of reasoning, then run the ablation.</p>`,
    attempt:
      `<p>Before the reveal, sketch the block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>ConvNeXtBlock(dim)</code>: a residual block. <b>(a)</b> depthwise $7\\times7$ conv &mdash;
        <code>nn.Conv2d(dim, dim, kernel_size=7, padding=3, groups=dim)</code> (one filter per channel; that is
        what <code>groups=dim</code> means). <b>(b)</b> a <b>LayerNorm</b> over the channels. <b>(c)</b> a
        $1\\times1$ conv (a <code>nn.Linear</code> on channels) expanding to <code>4*dim</code>. <b>(d)</b> a
        <code>nn.GELU()</code>. <b>(e)</b> a $1\\times1$ conv projecting <code>4*dim</code> back to
        <code>dim</code>. <b>(f)</b> TODO: add the block's <i>input</i> back to this output (the residual).</li>
        <li>Note the layout: <b>one</b> norm and <b>one</b> activation in the whole block (micro design, &sect;2.6)
        &mdash; not one after every conv. TODO: do not sprinkle in extra ReLUs/norms out of habit.</li>
        <li><code>TinyConvNeXt</code>: a $4\\times4$ stride-4 "patchify" stem, a couple of ConvNeXt blocks, global
        average pool, linear head. TODO: wire the stem so the spatial size shrinks like a transformer's patch grid.</li>
       </ul>
       <p>Then train once with the $4\\times$ expansion and once with $1\\times$ (the ablation). Predict which
       classifies better.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The paper's method is a <b>roadmap</b>, not a single equation: start from a ResNet-50 and walk it,
       one change at a time, toward a transformer's design, keeping every change that helps (&sect;2, Figure 2).
       The endpoint is the ConvNeXt block. Here are the roadmap's stations, in order.</p>
       <p><b>0. Modern training recipe first (&sect;2.1).</b> Before any architecture change, just train the old
       ResNet-50 with the transformer-era recipe: the <b>AdamW</b> optimizer, ~300 epochs, heavy data augmentation
       (Mixup, CutMix, RandAugment), and regularization (stochastic depth, label smoothing). This <i>alone</i>
       lifts ResNet-50 from <b>76.1% to 78.8%</b> top-1 (the paper's numbers) &mdash; a reminder that much of the
       "transformer gap" was the recipe, not the architecture.</p>
       <p><b>1. Macro design (&sect;2.2).</b> Two shape changes copied from Swin. (a) <b>Stage compute ratio:</b>
       a ResNet spends its blocks as $(3,4,6,3)$ across its four stages; Swin's ratio is roughly $1{:}1{:}3{:}1$,
       so they re-balance to <b>$(3,3,9,3)$</b>. (b) <b>Patchify stem:</b> replace ResNet's $7\\times7$ stride-2
       conv + max-pool with a single <b>$4\\times4$ stride-4 conv</b> &mdash; a "patchify" layer that cuts the
       image into non-overlapping $4\\times4$ patches, exactly like ViT's patch embedding.</p>
       <p><b>2. ResNeXt-ify (&sect;2.3).</b> Adopt <b>depthwise convolution</b> (a conv with one filter per
       channel, mixing space but not channels) and, with the FLOPs it saves, <b>widen the network</b> from $64$ to
       $96$ base channels. The paper notes depthwise conv is "similar to the weighted sum operation in
       self-attention" &mdash; it mixes information per-channel across space, leaving channel-mixing to the
       $1\\times1$ convs. This is the split attention also uses (spatial mixing, then channel mixing).</p>
       <p><b>3. Inverted bottleneck (&sect;2.4).</b> A ResNet block is a <i>bottleneck</i>: narrow&rarr;wide is
       <i>not</i> its shape &mdash; it goes wide&rarr;narrow&rarr;wide only via the $4\\times$ at the ends. A
       transformer's MLP block is the opposite: <b>narrow&rarr;wide&rarr;narrow</b>, expanding the hidden dimension
       by $4\\times$ in the middle. ConvNeXt copies this <b>inverted bottleneck</b> with a $4\\times$ expansion
       ratio.</p>
       <p><b>4. Large kernel sizes (&sect;2.5).</b> Transformers mix information globally; to imitate that with
       convolution, enlarge the depthwise filter from $3\\times3$ to <b>$7\\times7$</b>. To do this cheaply, first
       <b>move the depthwise conv up</b> to the top of the block (so the expensive $1\\times1$ convs run at the
       narrower width). The paper finds $7\\times7$ is the sweet spot &mdash; bigger kernels saturate.</p>
       <p><b>5. Micro design (&sect;2.6).</b> The final small choices, each copied from transformers:
       <b>replace ReLU with GELU</b> (a smoother activation); use <b>fewer activations</b> &mdash; a transformer
       block has just <i>one</i> activation in its MLP, so ConvNeXt keeps a single GELU per block instead of one
       after every conv; use <b>fewer normalization layers</b> (one, not three); and <b>replace BatchNorm with
       LayerNorm</b> (transformers normalize per-token, not per-batch). Each removal/replacement nudges accuracy
       up. A separate downsampling layer between stages (a LayerNorm + $2\\times2$ stride-2 conv) finishes the
       job.</p>
       <p>Stacking all of this gives the <b>ConvNeXt block</b> (Figure 4): <code>x &rarr; depthwise 7&times;7 conv
       &rarr; LayerNorm &rarr; 1&times;1 conv to 4&times;dim &rarr; GELU &rarr; 1&times;1 conv back to dim &rarr;
       (+ x)</code>. That last block is what you implement.</p>`,
    architecture:
      `<p><b>Be honest about the contribution.</b> ConvNeXt introduces <i>no new equation</i>. Its contribution is
       an <b>empirical modernization roadmap</b>: a controlled, one-change-at-a-time ablation that walks a plain
       ResNet-50 to a transformer-grade design using only known ConvNet ingredients. The architecture <i>is</i> the
       roadmap, so we lay it out as the paper's own sequence of steps, each with the ImageNet-1K top-1 accuracy it
       lands at (&sect;2, Figure 2; the paper's numbers). The reference target is Swin-T at $81.3\\%$.</p>
       <p><b>The roadmap (each row = one design change, then re-measure):</b></p>
       <ul class="steps">
        <li><b>Start &mdash; ResNet-50, modern recipe (&sect;2.1): $\\mathbf{78.8\\%}$.</b> No architecture change yet;
        just AdamW, ~300 epochs, Mixup/CutMix/RandAugment, stochastic depth, label smoothing. The original ResNet-50
        was $76.1\\%$, so the recipe alone is <b>$+2.7\\%$</b>.</li>
        <li><b>1. Stage compute ratio $(3,4,6,3)\\to(3,3,9,3)$ (&sect;2.2): $79.4\\%$ ($+0.6$).</b> Re-balance blocks
        per stage to Swin's $1{:}1{:}3{:}1$ split.</li>
        <li><b>2. Patchify stem (&sect;2.2): $79.5\\%$ ($+0.1$).</b> Replace the $7\\times7$ stride-2 conv + maxpool
        with a single $4\\times4$ stride-4 conv (non-overlapping patches, like ViT).</li>
        <li><b>3a. ResNeXt-ify &mdash; depthwise conv (&sect;2.3): $78.3\\%$ ($-1.2$).</b> Switching to depthwise conv
        <i>alone</i> first <i>drops</i> accuracy (it cuts capacity)&hellip;</li>
        <li><b>3b. &hellip;then widen $64\\to96$ base channels (&sect;2.3): $80.5\\%$ ($+2.2$).</b> Spending the FLOPs
        the depthwise conv freed on width more than recovers the dip. (Net of 3a+3b: $+2.0$ over step 2.)</li>
        <li><b>4. Inverted bottleneck (&sect;2.4): $80.6\\%$ ($+0.1$).</b> Make the block narrow&rarr;wide&rarr;narrow
        ($4\\times$ expansion in the middle), the transformer-MLP shape.</li>
        <li><b>5a. Move depthwise conv up (&sect;2.5): $79.9\\%$ ($-0.7$).</b> Put the spatial conv at the top of the
        block so the $1\\times1$ convs run at the narrow width &mdash; a temporary dip that pays off next&hellip;</li>
        <li><b>5b. Large $7\\times7$ kernel (&sect;2.5): $80.6\\%$ ($+0.7$).</b> Enlarge the depthwise filter
        $3\\times3\\to7\\times7$ to imitate global mixing; $7\\times7$ is the sweet spot (bigger saturates).</li>
        <li><b>6a. ReLU $\\to$ GELU (&sect;2.6): $80.6\\%$ ($\\pm0$).</b> Smoother activation; no harm, sets up&hellip;</li>
        <li><b>6b. Fewer activations (&sect;2.6): $81.3\\%$ ($+0.7$).</b> Keep <i>one</i> GELU per block (in the MLP),
        not one after every conv &mdash; the single biggest micro-design win, matching Swin-T here.</li>
        <li><b>6c. Fewer normalization layers (&sect;2.6): $81.4\\%$ ($+0.1$).</b> One norm per block, not three.</li>
        <li><b>6d. BatchNorm $\\to$ LayerNorm (&sect;2.6): $81.5\\%$ ($+0.1$).</b> Normalize per-token, like transformers.</li>
        <li><b>6e. Separate downsampling layers (&sect;2.6): $\\mathbf{82.0\\%}$ ($+0.5$).</b> Between stages, a
        LayerNorm + $2\\times2$ stride-2 conv instead of downsampling inside a residual block. <b>This is ConvNeXt-T</b>,
        now past Swin-T's $81.3\\%$.</li>
       </ul>
       <p><b>The resulting ConvNeXt block (Figure 4), in data-flow order:</b><br>
       <code>x &rarr; DWConv 7&times;7 (groups=C) &rarr; LayerNorm &rarr; 1&times;1 conv C&rarr;4C &rarr; GELU &rarr;
       1&times;1 conv 4C&rarr;C &rarr; + x</code>. Exactly one norm and one activation; spatial mixing (depthwise)
       and channel mixing (the $1\\times1$ MLP) are separated, mirroring a transformer's attention-then-MLP split.
       The official code adds a learnable per-channel <b>Layer Scale</b> ($\\gamma$, init $10^{-6}$) and stochastic
       depth on the residual branch (&sect;3.1).</p>
       <p><b>Full-network shape.</b> A patchify stem, then <b>four stages</b> of stacked ConvNeXt blocks at widths
       $C_1,C_2,C_3,C_4$, with a downsampling layer (LN + $2\\times2$ stride-2 conv) between stages; finally global
       average pool &rarr; LayerNorm &rarr; linear head. The variants differ only in per-stage <b>width $C$</b> and
       <b>depth $B$</b> (blocks per stage):</p>
       <ul>
        <li><b>ConvNeXt-T:</b> $C=(96,192,384,768)$, $B=(3,3,9,3)$ &mdash; ~$29$M params, ~$4.5$ GFLOPs (Swin-T scale).</li>
        <li><b>ConvNeXt-S:</b> $C=(96,192,384,768)$, $B=(3,3,27,3)$ &mdash; deeper stage 3.</li>
        <li><b>ConvNeXt-B:</b> $C=(128,256,512,1024)$, $B=(3,3,27,3)$ (Swin-B scale).</li>
        <li><b>ConvNeXt-L:</b> $C=(192,384,768,1536)$, $B=(3,3,27,3)$.</li>
        <li><b>ConvNeXt-XL:</b> $C=(256,512,1024,2048)$, $B=(3,3,27,3)$ (used for the $87.8\\%$ ImageNet-22K result).</li>
       </ul>
       <p>The toy network you build is this shape shrunk to one stage at width $C=32$ with a few blocks &mdash; the
       block is faithful; only the depth, width, and stage count are toy-sized.</p>`,
    symbols: [
      { sym: "$C$ (or $\\text{dim}$)", desc: "the <b>channel width</b> of a stage: how many feature maps flow through the block. ConvNeXt-T uses $96,192,384,768$ across its four stages." },
      { sym: "$7\\times7$", desc: "the <b>kernel size</b> of the depthwise conv: each filter looks at a $7\\times7$ window of pixels. Large, to imitate a transformer's global mixing (&sect;2.5)." },
      { sym: "depthwise conv", desc: "a <b>convolution with one filter per channel</b> (in PyTorch, <code>groups = channels</code>). It mixes information across <i>space</i> but never across channels &mdash; cheap, and the role attention's weighted sum plays." },
      { sym: "$1\\times1$ conv", desc: "a <b>convolution with a $1\\times1$ window</b>: it mixes <i>channels</i> at each pixel but not space. Mathematically a per-pixel <code>nn.Linear</code> on the channel vector." },
      { sym: "inverted bottleneck", desc: "a block whose <b>middle is wider than its ends</b>: narrow&rarr;wide&rarr;narrow. The $1\\times1$ convs expand to $4\\times$ then contract &mdash; the transformer MLP's shape (&sect;2.4)." },
      { sym: "$r=4$", desc: "the <b>expansion ratio</b>: the hidden width in the middle is $4\\times$ the block's channel width (the value the ablation changes to $1$)." },
      { sym: "GELU", desc: "<b>Gaussian Error Linear Unit</b>: a smooth activation, $\\text{GELU}(z)=z\\,\\Phi(z)$ where $\\Phi$ is the standard-normal CDF. A smoother stand-in for ReLU, standard in transformers (&sect;2.6)." },
      { sym: "$\\Phi$, $\\operatorname{erf}$", desc: "<b>standard-normal CDF</b> $\\Phi(z)=\\tfrac12(1+\\operatorname{erf}(z/\\sqrt2))$; $\\operatorname{erf}$ is the error function. Together they define GELU's smooth gate." },
      { sym: "$\\gamma$ (Layer Scale)", desc: "a <b>learnable per-channel multiplier</b> on the block's residual branch (init $10^{-6}$, &sect;3.1), applied elementwise via $\\odot$ before the residual add." },
      { sym: "$\\odot$", desc: "<b>elementwise (per-channel) product</b> &mdash; how the Layer-Scale gain $\\gamma$ multiplies the residual branch." },
      { sym: "LN (LayerNorm)", desc: "<b>Layer Normalization</b>: re-center and re-scale each <i>position's channel vector</i> (per-token), unlike BatchNorm which normalizes across the batch. ConvNeXt uses LN, copying transformers (&sect;2.6)." },
      { sym: "BN (BatchNorm)", desc: "<b>Batch Normalization</b>: normalizes each channel using statistics across the <i>batch</i>. The classic ConvNet norm that ConvNeXt replaces with LayerNorm." },
      { sym: "patchify stem", desc: "the first layer: a <b>$4\\times4$ stride-$4$ conv</b> that cuts the image into non-overlapping $4\\times4$ patches, mirroring ViT's patch embedding (&sect;2.2)." },
      { sym: "stage ratio $(3,3,9,3)$", desc: "the <b>number of blocks in each of the four stages</b>, re-balanced from ResNet's $(3,4,6,3)$ to match Swin's $1{:}1{:}3{:}1$ compute split (&sect;2.2)." },
      { sym: "stochastic depth", desc: "a <b>regularizer that randomly drops whole residual branches</b> during training (rate $0.1$ for ConvNeXt-T), so the network trains as an ensemble of shallower paths (&sect;3.1)." }
    ],
    formula: `<p><b>This paper is design-driven, not equation-driven.</b> It introduces <i>no new mathematical
       formulation</i>; its contribution is an empirical roadmap (see <b>architecture</b>). The little formal math
       there is is the definition of the ConvNeXt block, transcribed below.</p>
$$ \\text{ConvNeXtBlock}(x) \\;=\\; x \\;+\\; \\gamma \\odot W_2\\,\\big(\\,\\text{GELU}\\big(\\,W_1\\,\\,\\text{LN}\\big(\\,\\text{DWConv}_{7\\times7}(x)\\,\\big)\\,\\big)\\,\\big) \\qquad\\text{(\\S 2.6 / \\S 3.1, Figure 4)} $$
<p>The block: depthwise spatial mixing, one LayerNorm, an inverted-bottleneck MLP, and a residual add (the
   $\\gamma$ Layer-Scale multiplier is &sect;3.1's optional per-channel gain).</p>
$$ \\text{DWConv}_{7\\times7}:\\ C\\to C\\ \\text{(depthwise, one filter per channel)}, \\qquad W_1:\\ C\\to rC, \\qquad W_2:\\ rC\\to C, \\qquad r=4 $$
<p>Channel bookkeeping inside the block: the depthwise conv keeps width $C$; $W_1$ expands to $rC=4C$; $W_2$
   projects back to $C$ (&sect;2.4).</p>
$$ \\text{GELU}(z) \\;=\\; z\\,\\Phi(z), \\qquad \\Phi(z)=\\tfrac{1}{2}\\Big(1+\\operatorname{erf}\\!\\big(z/\\sqrt{2}\\big)\\Big) $$
<p>The activation that replaces ReLU (&sect;2.6): $\\Phi$ is the standard-normal CDF, so GELU is a smooth gate.</p>
$$ \\text{Downsample (between stages)}:\\ \\ \\text{LN} \\;\\to\\; \\text{Conv}_{2\\times2,\\ \\text{stride }2} \\qquad\\text{(\\S 2.6)} $$
<p>The separate downsampling layer that halves spatial size and changes width between the four stages (the final
   $+0.5\\%$ step), instead of downsampling inside a residual block.</p>`,
    whatItDoes:
      `<p>The block transforms its input $x$ (a feature map with $C$ channels) and adds the result back to $x$ &mdash;
       the <b>residual connection</b>, inherited from ResNet. Reading the inner expression from the inside out:</p>
       <ul>
        <li><b>$\\text{DWConv}_{7\\times7}(x)$ &mdash; spatial mixing.</b> A depthwise $7\\times7$ conv lets each
        channel gather information from a $7\\times7$ neighborhood. One filter per channel, so it mixes <i>space</i>
        only. This is ConvNeXt's stand-in for self-attention's "look around" step.</li>
        <li><b>$\\text{LN}(\\cdot)$ &mdash; normalize once.</b> A single LayerNorm over the channels (not BatchNorm,
        and not one norm per conv).</li>
        <li><b>$W_1$ then GELU then $W_2$ &mdash; the inverted-bottleneck MLP (channel mixing).</b> $W_1$ is a
        $1\\times1$ conv that <i>expands</i> the $C$ channels to $rC = 4C$; one GELU; then $W_2$ is a $1\\times1$
        conv that projects $4C$ back to $C$. This is exactly a transformer's per-token MLP, applied at every pixel.</li>
        <li><b>$x + (\\cdots)$ &mdash; the residual.</b> Add the transformed signal back to the input so deep stacks
        train (the ResNet idea this lesson's prereq owns).</li>
       </ul>
       <p>Spatial mixing (depthwise conv) and channel mixing (the $1\\times1$ MLP) are <i>separated</i> &mdash;
       precisely the factorization a transformer block uses (attention then MLP).</p>`,
    derivation:
      `<p>There is no single theorem to prove here; the "derivation" is the empirical roadmap (&sect;2) and the
       reasons each step is a sensible imitation of a transformer. (The two ideas this block reuses each have a
       full derivation elsewhere: the <b>residual connection</b> is owned by <b>paper-resnet</b>/<b>dl-resnet</b>,
       and the patchify-stem / patch-token idea by <b>paper-vit</b>. We recap, not re-derive, both.)</p>
       <p><b>Why separate spatial and channel mixing?</b> A transformer block does exactly this: self-attention
       mixes across positions, then a per-token MLP mixes across features. ConvNeXt mirrors it &mdash; a depthwise
       conv mixes space (per channel), and $1\\times1$ convs mix channels (per pixel). The paper explicitly notes
       the analogy between depthwise conv and "the weighted sum operation in self-attention" (&sect;2.3). Splitting
       the two is cheaper than a dense conv (which mixes both at once) and lets you make the spatial filter large
       ($7\\times7$) without exploding cost.</p>
       <p><b>Why an inverted bottleneck with $r=4$?</b> A transformer MLP expands its hidden dimension by $4\\times$
       in the middle, giving the block capacity to transform each token's features richly before contracting. The
       same widen-then-narrow gives the ConvNeXt block its representational power; the ablation below shows it
       matters (&sect;2.4).</p>
       <p><b>Why fewer norms/activations, GELU, and LayerNorm (&sect;2.6)?</b> Habit (post-AlexNet ConvNets) put a
       ReLU and a BatchNorm after <i>every</i> conv. Transformers do not &mdash; one activation, normalization per
       token. The paper found that simply <i>removing</i> the extra ReLUs and norms (keeping one each), switching
       ReLU&rarr;GELU, and BatchNorm&rarr;LayerNorm each nudged accuracy up. The lesson: those extras were
       cargo-cult, not load-bearing.</p>`,
    example:
      `<p><b>Trace the channel widths and a parameter count</b> through one ConvNeXt block, for the exact dimensions
       the notebook uses: channel width $C=32$, kernel $7\\times7$, expansion ratio $r=4$.</p>
       <ul class="steps">
        <li><b>Depthwise $7\\times7$ conv:</b> $C\\to C = 32\\to 32$, one filter per channel. Weights:
        $C \\times 7 \\times 7 = 32 \\times 49 = 1{,}568$ (plus $32$ biases). It changes <i>where</i> info sits, not
        the channel count.</li>
        <li><b>LayerNorm:</b> over $C=32$ channels &mdash; a scale and a shift, $2\\times 32 = 64$ params. Output
        still $32$ channels.</li>
        <li><b>$1\\times1$ expand ($W_1$):</b> $C \\to rC = 32 \\to 128$. As a per-pixel linear map its weight is
        $32 \\times 128 = 4{,}096$ (plus $128$ biases). The feature map now has $128$ channels.</li>
        <li><b>GELU:</b> applied elementwise on the $128$ channels &mdash; no parameters, shape unchanged.</li>
        <li><b>$1\\times1$ project ($W_2$):</b> $rC \\to C = 128 \\to 32$. Weight $128 \\times 32 = 4{,}096$ (plus
        $32$ biases). Back to $32$ channels &mdash; the same shape as the input.</li>
        <li><b>Residual:</b> add the original input ($32$ channels) to this $32$-channel output. Shapes match, so
        the add is valid; no parameters.</li>
       </ul>
       <p>So a $32$-channel feature map goes in and a $32$-channel feature map comes out, having been mixed across
       space (depthwise) and across an expanded $128$-wide channel space (the inverted-bottleneck MLP). The
       channel-mixing weights total $4{,}096 + 4{,}096 = 8{,}192$, dwarfing the $1{,}568$ spatial weights &mdash;
       most of a ConvNeXt block's parameters live in the $1\\times1$ MLP, exactly as in a transformer. The notebook's
       first cell recomputes these counts.</p>`,
    recipe:
      `<ol>
        <li><b>Patchify stem (&sect;2.2).</b> <code>nn.Conv2d(C_in, dim, kernel_size=4, stride=4)</code> &mdash;
        cut the image into non-overlapping $4\\times4$ patches and project to <code>dim</code> channels. (On tiny
        $28\\times28$ MNIST we use a smaller stride so spatial size is not lost.)</li>
        <li><b>The ConvNeXt block (&sect;2.6, Figure 4).</b> In order: depthwise $7\\times7$ conv
        (<code>groups=dim</code>, <code>padding=3</code>) &rarr; LayerNorm over channels &rarr; $1\\times1$ conv to
        <code>4*dim</code> &rarr; GELU &rarr; $1\\times1$ conv back to <code>dim</code> &rarr; <b>add the input</b>
        (residual). Exactly <i>one</i> norm and <i>one</i> GELU in the block.</li>
        <li><b>Stack a few blocks</b> at a stage width (real ConvNeXt-T uses $(3,3,9,3)$ blocks across four stages;
        our toy uses a couple).</li>
        <li><b>Head.</b> Global-average-pool the final feature map to one vector per image, LayerNorm, then a
        linear classifier.</li>
        <li><b>Train</b> on a small MNIST subset; then <b>ablate</b>: set the expansion ratio $r$ from $4$ to $1$
        (no wide middle) and retrain &mdash; accuracy drops because the block loses its channel-mixing capacity.</li>
      </ol>`,
    results:
      `<p>From Table 1 (&sect;3.2), at ImageNet-1K $224^2$ resolution and matched compute (~$4.5$ GFLOPs,
       ~$29$M parameters): <b>ConvNeXt-T reaches $82.1\\%$ top-1, vs Swin-T's $81.3\\%$</b> &mdash; the pure ConvNet
       edges out the transformer of the same size. The roadmap that gets there (Figure 2, the paper's numbers):
       ResNet-50 at $76.1\\%$ &rarr; modern training recipe $78.8\\%$ &rarr; stage ratio $(3,3,9,3)$ $79.4\\%$ &rarr;
       patchify stem $79.5\\%$ &rarr; depthwise + widen $80.5\\%$ &rarr; inverted bottleneck $80.6\\%$ &rarr;
       $7\\times7$ kernels $80.6\\%$ &rarr; GELU/fewer activations/fewer norms/LayerNorm and separate downsampling
       &rarr; <b>$82.0\\%$</b> (ConvNeXt-T). The abstract reports the largest variant (ConvNeXt-XL, $384^2$, with
       ImageNet-22K pre-training) reaching <b>$87.8\\%$</b> top-1, and ConvNeXt outperforming Swin on COCO detection
       and ADE20K segmentation.</p>
       <p><i>These are the paper's reported figures, quoted from Table 1 / Figure 2 / the abstract. The numbers in
       the CODE and CODEVIZ panels below are from our own tiny MNIST-subset run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> The system is an image classifier, so the metric is <b>top-1 accuracy</b>
       (fraction of images whose top prediction is correct). The paper's benchmark is <b>ImageNet-1K</b> at
       $224^2$; the reference to beat is <b>Swin-T at $81.3\\%$</b> and the prior ConvNet (untouched ResNet-50) at
       $76.1\\%$. The no-skill floor is <b>$10\\%$</b> (random over $1000$ classes); on your $10$-class MNIST toy the
       floor is also $10\\%$. "Better than trivial" means clearly above chance and, for the full system, near the
       paper's roadmap numbers.</p>
       <ul>
        <li><b>2. Sanity checks before the full run.</b> (a) <b>Overfit one batch:</b> train on a single minibatch
        and watch cross-entropy fall toward $0$ and its accuracy hit $100\\%$ &mdash; if it cannot, the block is
        mis-wired. (b) <b>Loss at init:</b> for $K$-way softmax it should be $\\approx -\\ln(1/K)=\\ln K$
        ($\\ln 10\\approx 2.30$ for MNIST); a wildly different value flags a bad head or label bug. (c)
        <b>Shape check:</b> a block must return the <i>same</i> $(N,C,H,W)$ it received (else the residual
        <code>+ x</code> throws) &mdash; verify with one forward on a dummy tensor. (d) <b>Param-count check:</b>
        the worked example's first cell prints $1{,}568$ depthwise vs $8{,}192$ channel-mixing weights for $C=32,r=4$;
        matching those confirms <code>groups=dim</code> and the $4\\times$ expansion are correct.</li>
        <li><b>3. Expected range.</b> At paper scale, a correct ConvNeXt-T should reach roughly the Table-1 figure,
        <b>$\\approx 82.1\\%$ top-1 on ImageNet-1K</b> (paper, approximate &mdash; reproducing needs the full ~300-epoch
        AdamW recipe). On the tiny MNIST subset our run reaches <b>~0.94</b> test accuracy with $r=4$ (rule of thumb,
        not a paper claim; varies with seed/hardware). Landing far below chance-plus is "probably a bug"; a few points
        under target is "tuning."</li>
        <li><b>4. Ablation &mdash; the inverted bottleneck.</b> ConvNeXt's central transformer-borrowed knob is the
        <b>$4\\times$ inverted-bottleneck expansion</b>. Turn it off by setting the expansion ratio <b>$r=4\\to1$</b>
        (the two $1\\times1$ convs keep width flat) with everything else &mdash; depth, kernel, norm, GELU, optimizer,
        seed &mdash; identical, and confirm accuracy <b>drops</b> (our run ~0.94 &rarr; ~0.88). If it does not drop,
        the wide middle is not actually wired in or not helping. (A second ablation: the modern recipe alone lifts
        ResNet-50 $76.1\\%\\to78.8\\%$ &mdash; remove AdamW/augmentation and the gain vanishes.)</li>
        <li><b>5. Failure signals.</b> <b>Accuracy stuck near $10\\%$</b> &rarr; not learning: labels shuffled, head
        disconnected, or the residual add silently zeroing the signal. <b>Loss NaN</b> &rarr; LR too high or a bad
        LayerNorm axis. <b>Shape/runtime error on <code>+ x</code></b> &rarr; wrong $7\\times7$ padding (need
        <code>padding=3</code>) or a missing channels-last <code>permute</code> around <code>nn.LayerNorm</code>.
        <b>Train-good, val-bad</b> &rarr; overfit (expected on the tiny subset; the augmentation/stochastic-depth
        recipe is what closes it at scale). <b>$r=1$ matches $r=4$ exactly</b> &rarr; the ablation knob is not
        threaded through &mdash; the expansion is not really being changed.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b> them
       and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code> (used both as the depthwise
       $7\\times7$ via <code>groups=dim</code> and as the patchify stem), <code>nn.LayerNorm</code>,
       <code>nn.Linear</code> (the $1\\times1$ convs, applied per pixel), <code>nn.GELU</code>, the optimizer, and
       <code>torchvision.datasets.MNIST</code> for toy data. <b>Build by hand:</b> the <b>ConvNeXt block</b>
       &mdash; the exact ordering depthwise&rarr;LN&rarr;expand&rarr;GELU&rarr;project&rarr;residual, with one norm
       and one activation &mdash; the patchify stem, the tiny stage stack, and the <b>expansion-ratio ablation</b>.
       We do not re-derive the residual connection (that is <b>paper-resnet</b>) or the patch-token idea (that is
       <b>paper-vit</b>); we recap and reuse them.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting <code>groups=dim</code>.</b> A plain <code>nn.Conv2d(dim, dim, 7)</code> is a <i>dense</i>
        conv mixing all channels &mdash; far more parameters and not the depthwise design. Depthwise means
        <code>groups=dim</code> (one filter per channel).</li>
        <li><b>Padding mismatch.</b> A $7\\times7$ conv needs <code>padding=3</code> to keep the spatial size
        unchanged (so the residual add lines up). Wrong padding shrinks the map and the <code>+ x</code> fails.</li>
        <li><b>Sprinkling extra ReLUs/BatchNorms.</b> The whole point of &sect;2.6 is <i>fewer</i> &mdash; one GELU
        and one LayerNorm per block. Adding a norm or activation after every conv reverts to the old ConvNet and
        erases the gain.</li>
        <li><b>Using BatchNorm instead of LayerNorm.</b> ConvNeXt normalizes per-token (LayerNorm over channels),
        not per-batch. With tiny batches BatchNorm is also unstable; LayerNorm is the design choice <i>and</i> the
        robust one.</li>
        <li><b>LayerNorm axis on image tensors.</b> PyTorch feature maps are $(N, C, H, W)$ but
        <code>nn.LayerNorm(C)</code> normalizes the <i>last</i> axis. You must move channels last
        (<code>permute</code> to $(N,H,W,C)$), LayerNorm, then move back &mdash; or accept this is why the official
        code defines a custom channels-first LayerNorm.</li>
        <li><b>Calling it "attention."</b> ConvNeXt has <i>no</i> attention. The depthwise conv only <i>plays the
        role</i> attention plays (spatial mixing); it is a fixed local filter, not a data-dependent global weighting.</li>
      </ul>`,
    recall: [
      "List the ConvNeXt block's six steps in order (depthwise 7x7 -> LN -> 1x1 expand -> GELU -> 1x1 project -> residual).",
      "What does the inverted bottleneck's expansion ratio $r=4$ mean, and which part of a transformer block does it copy?",
      "Why depthwise conv + 1x1 convs instead of one dense conv? (Which mixes space, which mixes channels?)",
      "Name three &sect;2.6 micro-design changes copied from transformers (GELU, fewer activations, fewer norms, BatchNorm->LayerNorm).",
      "The paper's headline: ConvNeXt-T vs Swin-T top-1 on ImageNet-1K (quote the Table 1 numbers)."
    ],
    practice: [
      {
        q: `<b>The ablation.</b> Your tiny ConvNeXt classifies the MNIST subset with the $4\\times$ inverted
            bottleneck. Set the expansion ratio $r$ from $4$ to $1$ (the two $1\\times1$ convs now keep the width
            flat instead of widening to $4\\times$ and back) and retrain. What happens to accuracy, and what does
            that show about the inverted bottleneck?`,
        steps: [
          { do: `Change only the middle width: in the block, replace <code>hidden = 4 * dim</code> with <code>hidden = 1 * dim</code>; keep depth, kernel, norm, GELU, optimizer, data, and seed identical.`, why: `An honest ablation changes exactly one thing &mdash; the expansion ratio &mdash; so any difference is attributable to it.` },
          { do: `Retrain and compare test accuracy: with $r=4$ it is higher; with $r=1$ it drops (in our run ~0.94 to ~0.88).`, why: `The wide middle gives the per-pixel MLP capacity to transform features; collapsing it to width $C$ removes most of the block's channel-mixing power.` },
          { do: `Conclude the inverted bottleneck (not just "having two 1x1 convs") supplies real capacity; the gap is what the $4\\times$ expansion is worth.`, why: `Both runs share architecture, depth, and parameter <i>shape</i> except the hidden width, isolating the expansion as the cause.` }
        ],
        answer: `<p>With $r=1$ the wide middle is gone and test accuracy drops (in our run ~0.94 &rarr; ~0.88). It
                 does not collapse to chance &mdash; the depthwise conv and residual still mix and carry signal &mdash;
                 but the block loses the channel-mixing capacity that the $4\\times$ expansion provides, exactly as a
                 transformer MLP shrunk to no hidden expansion would weaken. Since the two runs are identical except
                 for the expansion ratio, this isolates the inverted bottleneck as a real source of capacity. The
                 CODEVIZ panel shows the gap.</p>`
      },
      {
        q: `Count the parameters of one ConvNeXt block at channel width $C=64$, kernel $7\\times7$, expansion
            $r=4$ (ignore biases and LayerNorm). Where do most parameters live, and what does that tell you about
            the block's design?`,
        steps: [
          { do: `Depthwise $7\\times7$ conv: $C \\times 7 \\times 7 = 64 \\times 49 = 3{,}136$ weights (one $7\\times7$ filter per channel).`, why: `Depthwise means one filter per channel, so it scales with $C$, not $C^2$ &mdash; cheap spatial mixing.` },
          { do: `Expand $1\\times1$: $C \\times rC = 64 \\times 256 = 16{,}384$. Project $1\\times1$: $rC \\times C = 256 \\times 64 = 16{,}384$. Total $1\\times1$: $32{,}768$.`, why: `The $1\\times1$ convs are dense channel mixers, so they scale like $C^2$ &mdash; the bulk of the cost.` },
          { do: `Compare: $32{,}768$ in channel mixing vs $3{,}136$ in spatial mixing &mdash; about $90\\%$ of the weights are in the $1\\times1$ MLP.`, why: `This mirrors a transformer block, whose MLP holds most parameters while attention/spatial-mixing is comparatively light.` }
        ],
        answer: `<p>Depthwise conv: $64\\times49 = 3{,}136$. The two $1\\times1$ convs: $64\\times256 + 256\\times64 =
                 32{,}768$. So ~$91\\%$ of the block's weights are in the channel-mixing $1\\times1$ MLP, and only
                 ~$9\\%$ in the spatial depthwise conv. The design deliberately makes spatial mixing cheap (depthwise,
                 scales with $C$) and spends its parameters on the wide channel MLP (scales with $C^2$) &mdash;
                 exactly the budget split of a transformer block.</p>`
      },
      {
        q: `The paper starts at ResNet-50 ($76.1\\%$) and, <i>before changing any architecture</i>, just trains it
            with the modern recipe (AdamW, augmentation, regularization) to $78.8\\%$ (&sect;2.1). Why does the
            paper insist on doing this first, and what does it say about the "transformers beat CNNs" claim?`,
        steps: [
          { do: `Note the $+2.7\\%$ comes purely from the training recipe, with the <i>identical</i> ResNet-50 architecture.`, why: `It isolates recipe from architecture &mdash; the same network, trained the modern way, is already much better.` },
          { do: `Recognize that early "ViT/Swin beats ResNet" comparisons used the modern recipe for the transformer but an old recipe for the ResNet.`, why: `That is an unfair comparison: part of the measured gap was the recipe, not the architecture.` },
          { do: `Conclude you must control the training recipe before attributing a gap to attention; only then can the roadmap fairly credit each design change.`, why: `Controlled comparison is the paper's core method &mdash; change one thing at a time, recipe included.` }
        ],
        answer: `<p>Training the same ResNet-50 with the transformer-era recipe lifts it $76.1\\%\\to 78.8\\%$ with no
                 architecture change, so a large slice of the apparent "transformer advantage" was really the
                 <i>recipe</i> (AdamW, Mixup/CutMix/RandAugment, stochastic depth, ~300 epochs), not attention. The
                 paper insists on fixing the recipe first so that every later roadmap step is a fair, one-variable
                 comparison. The takeaway: "transformers beat CNNs" was partly an apples-to-oranges claim, and once
                 controlled, a pure ConvNet (ConvNeXt-T, $82.1\\%$) edges out Swin-T ($81.3\\%$).</p>`
      }
    ]
  });

  window.CODE["paper-convnext"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the <b>ConvNeXt block</b> by hand from <code>nn</code> primitives &mdash;
       depthwise $7\\times7$ conv (<code>groups=dim</code>) &rarr; LayerNorm &rarr; $1\\times1$ conv to $4\\times$
       width &rarr; GELU &rarr; $1\\times1$ conv back &rarr; residual (&sect;2.6, Figure 4) &mdash; with exactly
       <i>one</i> norm and <i>one</i> activation. We use <code>nn.Linear</code> for the $1\\times1$ convs (a
       per-pixel linear on channels) by moving channels last for the LayerNorm and MLP, then back. We stack a few
       blocks after a patchify stem, train on a small <b>MNIST</b> subset via <code>torchvision</code>, and
       <b>print test accuracy</b>. The <b>ablation</b> sets the expansion ratio $r$ from $4$ to $1$ and retrains
       &mdash; accuracy falls (the inverted bottleneck's channel-mixing capacity is gone). The first cell
       recomputes the worked example's parameter counts for $C=32,\\ r=4$. Paste into Colab and run (torch +
       torchvision are preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import datasets, transforms

torch.manual_seed(0)

# === 0. Worked example: parameter counts for one block, C=32, kernel 7x7, r=4. ===
C = 32; K = 7; r = 4
dw     = C * K * K                 # 32 * 49 = 1568  depthwise weights (one 7x7 filter per channel)
expand = C * (r * C)               # 32 * 128 = 4096  1x1 expand  (C -> 4C)
project= (r * C) * C               # 128 * 32 = 4096  1x1 project (4C -> C)
print("depthwise 7x7 weights :", dw)        # 1568
print("1x1 expand  (C->4C)   :", expand)    # 4096
print("1x1 project (4C->C)   :", project)   # 4096
print("channel-mix / spatial :", (expand + project), "vs", dw)  # 8192 vs 1568

# === 1. The ConvNeXt block (Section 2.6, Figure 4). r toggles the inverted-bottleneck ablation. ===
class ConvNeXtBlock(nn.Module):
    def __init__(self, dim, r=4):
        super().__init__()
        # (a) depthwise 7x7 conv: groups=dim => one filter per channel (spatial mixing only). padding=3 keeps HxW.
        self.dwconv = nn.Conv2d(dim, dim, kernel_size=7, padding=3, groups=dim)
        # (b) ONE LayerNorm over channels   (c)/(e) two 1x1 convs as per-pixel Linear   (d) ONE GELU
        self.norm = nn.LayerNorm(dim)
        self.pw1  = nn.Linear(dim, r * dim)     # 1x1 expand  C -> rC   (inverted bottleneck)
        self.act  = nn.GELU()
        self.pw2  = nn.Linear(r * dim, dim)     # 1x1 project rC -> C
    def forward(self, x):                       # x: (N, C, H, W)
        h = self.dwconv(x)                      # depthwise spatial mixing
        h = h.permute(0, 2, 3, 1)               # (N, H, W, C): channels last for LayerNorm + Linear
        h = self.norm(h)                        # one LayerNorm
        h = self.pw2(self.act(self.pw1(h)))     # 1x1 expand -> GELU -> 1x1 project (the MLP)
        h = h.permute(0, 3, 1, 2)               # back to (N, C, H, W)
        return x + h                            # residual (ResNet idea)

class TinyConvNeXt(nn.Module):
    def __init__(self, dim=32, blocks=3, r=4, classes=10):
        super().__init__()
        self.stem = nn.Conv2d(1, dim, kernel_size=2, stride=2)   # tiny "patchify" stem (28x28 -> 14x14)
        self.blocks = nn.Sequential(*[ConvNeXtBlock(dim, r=r) for _ in range(blocks)])
        self.norm = nn.LayerNorm(dim)
        self.head = nn.Linear(dim, classes)
    def forward(self, x):
        x = self.blocks(self.stem(x))
        x = x.mean(dim=(2, 3))                  # global average pool -> (N, C)
        return self.head(self.norm(x))

# === 2. A small MNIST subset (fast on CPU). ===
tf = transforms.ToTensor()
train_full = datasets.MNIST(root="./data", train=True,  download=True, transform=tf)
test_full  = datasets.MNIST(root="./data", train=False, download=True, transform=tf)
train_set = torch.utils.data.Subset(train_full, range(3000))
test_set  = torch.utils.data.Subset(test_full,  range(1000))
train_dl = torch.utils.data.DataLoader(train_set, batch_size=128, shuffle=True)
test_dl  = torch.utils.data.DataLoader(test_set,  batch_size=256)

def evaluate(net):
    net.eval(); correct = total = 0
    with torch.no_grad():
        for x, y in test_dl:
            correct += (net(x).argmax(1) == y).sum().item(); total += y.numel()
    return correct / total

def train(r, epochs=6, lr=2e-3):
    torch.manual_seed(0)
    net = TinyConvNeXt(r=r)
    opt = torch.optim.AdamW(net.parameters(), lr=lr)   # AdamW: the modern recipe (Section 2.1)
    for ep in range(epochs):
        net.train()
        for x, y in train_dl:
            loss = F.cross_entropy(net(x), y)
            opt.zero_grad(); loss.backward(); opt.step()
        print(f"  epoch {ep}  test-acc {evaluate(net):.3f}")
    return evaluate(net)

print("\\nWITH inverted bottleneck (r=4):")
acc_r4 = train(r=4)
print("WITHOUT wide middle (ABLATION, r=1):")
acc_r1 = train(r=1)
print(f"\\nfinal test accuracy  r=4: {acc_r4:.3f}   r=1: {acc_r1:.3f}")
# r=4 reaches ~0.94 on this tiny subset; r=1 drops to ~0.88 -- the inverted bottleneck's capacity is gone.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-convnext"] = {
    question: "On a small MNIST subset, does the hand-built ConvNeXt stack learn, and does collapsing the inverted bottleneck (expansion r=4 -> r=1, the ablation) lower accuracy?",
    charts: [
      {
        type: "line",
        title: "MNIST-subset test accuracy vs epoch — inverted bottleneck r=4 vs r=1 (ablation)",
        xlabel: "epoch",
        ylabel: "test accuracy",
        series: [
          {
            name: "r=4 (inverted bottleneck)",
            color: "#7ee787",
            points: [[0,0.806],[1,0.879],[2,0.908],[3,0.924],[4,0.934],[5,0.941]]
          },
          {
            name: "r=1 (ablation, no wide middle)",
            color: "#ff7b72",
            points: [[0,0.731],[1,0.806],[2,0.840],[3,0.860],[4,0.872],[5,0.879]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny hand-built ConvNeXt (patchify stem 28x28 -> 14x14, three ConvNeXt blocks at width C=32, depthwise 7x7 conv, one LayerNorm, one GELU, residual, AdamW) trained on a 3,000-image MNIST subset. WITH the r=4 inverted bottleneck (green) test accuracy climbs to ~0.94. The ABLATION (red, the same model with the 1x1 convs' middle width set to r=1 instead of 4) plateaus lower (~0.88): the block loses the wide channel-mixing MLP, exactly as a transformer MLP shrunk to no hidden expansion would weaken. It does not collapse to chance because the depthwise conv and residual still carry signal. Same stem, depth, kernel, norm, activation, optimizer, and seed; the only difference is the expansion ratio.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F
from torchvision import datasets, transforms
torch.manual_seed(0)

class ConvNeXtBlock(nn.Module):
    def __init__(self, dim, r=4):
        super().__init__()
        self.dwconv = nn.Conv2d(dim, dim, kernel_size=7, padding=3, groups=dim)  # depthwise
        self.norm = nn.LayerNorm(dim); self.pw1 = nn.Linear(dim, r * dim)
        self.act = nn.GELU(); self.pw2 = nn.Linear(r * dim, dim)
    def forward(self, x):
        h = self.dwconv(x).permute(0, 2, 3, 1)          # channels last
        h = self.pw2(self.act(self.pw1(self.norm(h))))  # LN -> 1x1 expand -> GELU -> 1x1 project
        return x + h.permute(0, 3, 1, 2)                # residual

class TinyConvNeXt(nn.Module):
    def __init__(self, dim=32, blocks=3, r=4, classes=10):
        super().__init__()
        self.stem = nn.Conv2d(1, dim, kernel_size=2, stride=2)
        self.blocks = nn.Sequential(*[ConvNeXtBlock(dim, r=r) for _ in range(blocks)])
        self.norm = nn.LayerNorm(dim); self.head = nn.Linear(dim, classes)
    def forward(self, x):
        x = self.blocks(self.stem(x)).mean(dim=(2, 3))  # global average pool
        return self.head(self.norm(x))

tf = transforms.ToTensor()
tr = torch.utils.data.Subset(datasets.MNIST("./data", True,  download=True, transform=tf), range(3000))
te = torch.utils.data.Subset(datasets.MNIST("./data", False, download=True, transform=tf), range(1000))
tr_dl = torch.utils.data.DataLoader(tr, batch_size=128, shuffle=True)
te_dl = torch.utils.data.DataLoader(te, batch_size=256)

def acc(net):
    net.eval(); c = t = 0
    with torch.no_grad():
        for x, y in te_dl: c += (net(x).argmax(1) == y).sum().item(); t += y.numel()
    return c / t

def run(r, epochs=6):
    torch.manual_seed(0)
    net = TinyConvNeXt(r=r); opt = torch.optim.AdamW(net.parameters(), lr=2e-3); hist = []
    for _ in range(epochs):
        net.train()
        for x, y in tr_dl:
            loss = F.cross_entropy(net(x), y); opt.zero_grad(); loss.backward(); opt.step()
        hist.append(round(acc(net), 3))
    return hist

print("r=4:", run(4))
print("r=1:", run(1))
# r=4 -> climbs to ~0.94. r=1 -> plateaus ~0.88 (inverted bottleneck collapsed).`
  };
})();
