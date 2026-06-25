/* Paper lesson — "Deep Residual Learning for Image Recognition" (ResNet), He et al. 2015.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-resnet".
   GROUNDED from arXiv:1512.03385 (abstract) and the ar5iv HTML mirror (Section 3, Eqns 1-2).
   Track B (architecture): build the residual block + skip + stage stacking by hand on top of
   nn.Conv2d / nn.BatchNorm2d. The gradient-highway math lives in concept dl-resnet; here we recap. */
(function () {
  window.LESSONS.push({
    id: "paper-resnet",
    title: "ResNet — Deep Residual Learning for Image Recognition (2015)",
    tagline: "Add a layer's input back to its output, so networks hundreds of layers deep finally train.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
      org: "Microsoft Research",
      year: 2015,
      venue: "arXiv:1512.03385 (Dec 2015); CVPR 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1512.03385",
      code: "https://github.com/KaimingHe/deep-residual-networks"
    },
    conceptLink: "dl-resnet",
    partOf: [
      { capstone: "capstone-image-classifier", step: 6, builds: "the residual block + small ResNet" },
      { capstone: "capstone-mini-gpt", step: 5, builds: "residual connections in the transformer block" }
    ],
    prereqs: ["dl-resnet", "dl-conv", "dl-backprop", "dl-batchnorm", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>Before this paper, "go deeper" had stopped working. People expected that adding more layers to a
       Convolutional Neural Network (CNN) should never hurt &mdash; in the worst case the extra layers could
       just copy their input (the <b>identity</b> mapping) and match the shallower net. In practice the
       opposite happened. The paper calls this the <b>degradation problem</b>:</p>
       <blockquote>"with the network depth increasing, accuracy gets saturated &hellip; and then degrades
       rapidly. Unexpectedly, such degradation is not caused by overfitting, and adding more layers to a
       suitably deep model leads to higher training error." (&sect;1)</blockquote>
       <p>Read that carefully: the <i>training</i> error gets <i>worse</i>. That rules out overfitting
       (which lowers training error and only widens the test gap). The deep plain network simply could not be
       <b>optimized</b> &mdash; a stack of nonlinear layers finds it surprisingly hard to learn even the
       do-nothing identity mapping.</p>`,
    contribution:
      `<ul>
        <li><b>Residual learning.</b> Instead of asking a block to learn the whole target mapping
        $H(x)$, ask it to learn only the <b>residual</b> $F(x) = H(x) - x$, then add the input back:
        output $= F(x) + x$. If "do nothing" is best, the block just drives $F(x)$ to $0$ &mdash; easy.</li>
        <li><b>The shortcut connection.</b> The "$+ x$" is a parameter-free wire (the <b>identity
        shortcut</b>) that carries the input around the block. When channel count or spatial size changes,
        a $1\\times1$ convolution (the <b>projection shortcut</b>) reshapes it first.</li>
        <li><b>Extreme depth that actually trains.</b> They built and trained networks up to
        <b>152 layers</b> on ImageNet (and analyzed 100- and 1000-layer nets on CIFAR-10), which plain
        stacks could not match.</li>
      </ul>`,
    whyItMattered:
      `<p>Residual blocks became the default way to build deep vision models: ResNet-50 / ResNet-101
       backbones power image classification, detection, and segmentation across the field. The same "$+ x$"
       trick was carried into the <b>Transformer</b> &mdash; every attention and feed-forward sub-layer is
       wrapped in a residual connection &mdash; so this one idea quietly sits under most of today's large
       models, language ones included.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the degradation plot (Fig. 1): a 56-layer plain net has
        <i>higher</i> training error than a 20-layer one. This is the whole motivation.</li>
        <li><b>&sect;3.1 (Residual Learning)</b> &mdash; the residual reformulation $F(x)=H(x)-x$ and why
        learning a near-identity is easier as a residual.</li>
        <li><b>&sect;3.2 (Identity Mapping by Shortcuts)</b> &mdash; the two equations (building block and
        projection shortcut) you will transcribe and implement.</li>
        <li><b>Fig. 2</b> &mdash; the building-block diagram (two layers + the curved skip arrow).</li>
       </ul>
       <p><b>Skim:</b> &sect;3.3-3.4 (exact ImageNet/CIFAR layer tables), and the detection/localization
       sections (&sect;4) unless you care about COCO. The math you need is two short equations in &sect;3.2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Take a plain CNN that trains fine at, say, 20 layers. Now stack it <b>much</b> deeper &mdash; 50+
       layers &mdash; with no skip connections. On the <i>training</i> set, do you expect the deeper plain
       net to reach <b>lower</b>, <b>equal</b>, or <b>higher</b> loss than the shallower one? Write down your
       guess and one sentence of reasoning, then run the ablation below.</p>
       <p>(Hint: "it could always copy the shallow net via identity layers" is the intuition the paper shows
       is <i>wrong in practice</i>.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>BasicBlock(nn.Module)</code> with <code>conv1 &rarr; bn1 &rarr; relu &rarr; conv2 &rarr; bn2</code>.</li>
        <li>Save the input: <code>identity = x</code>  <i># the shortcut, a.k.a. x</i></li>
        <li>TODO: if <code>stride != 1</code> or <code>in_channels != out_channels</code>, build a
        <b>projection shortcut</b> = a $1\\times1$ <code>nn.Conv2d</code> (+ BatchNorm) and set
        <code>identity = self.proj(x)</code>.</li>
        <li>TODO: combine the two paths &mdash; <code>out = relu(out + identity)</code>  <i># add FIRST, then ReLU</i></li>
       </ul>
       <p>Then stack a handful of these into a tiny ResNet and a matched <b>plain</b> net (identical depth,
       but delete the "<code>+ identity</code>"). Predict which one trains.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The paper reformulates what a stack of layers is asked to learn. Call the input to a block $x$ and
       the mapping you ultimately want $H(x)$. A plain block tries to learn $H(x)$ directly. A residual block
       instead has its layers compute a <b>residual function</b> $F(x) = H(x) - x$, and then the architecture
       adds the input back on (&sect;3.1):</p>
       <p>$$ H(x) = F(x) + x. $$</p>
       <p>Same target, different parameterization &mdash; but the optimization landscape is far friendlier.
       If the ideal mapping is close to the identity (common in deep nets, where many layers should change
       little), the layers only have to nudge $F(x)$ near $0$ rather than learn a perfect identity from
       scratch.</p>
       <p>Concretely (&sect;3.2), a two-weight block computes $F = W_2\\,\\sigma(W_1 x)$, where $\\sigma$ is the
       ReLU (Rectified Linear Unit) nonlinearity. The shortcut performs $F + x$ by <b>element-wise
       addition</b>, and a second ReLU is applied <i>after</i> the addition. In a CNN the weights $W_1, W_2$
       are convolutions and each is followed by Batch Normalization. So the block is
       conv &rarr; BatchNorm &rarr; ReLU &rarr; conv &rarr; BatchNorm, then <b>+ x</b>, then ReLU.</p>
       <p>When the block keeps the same shape, the shortcut is a bare wire. When it changes the number of
       channels or downsamples (stride $\\gt 1$), the input no longer matches the output shape, so a small
       $1\\times1$ convolution $W_s$ is placed on the shortcut to reshape it first.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input</b> vector (or feature map) fed into the block &mdash; and the value carried, unchanged, along the shortcut." },
      { sym: "$y$", desc: "the <b>output</b> of the block (before the final ReLU in the paper's Eqn. 1 notation): the residual plus the shortcut." },
      { sym: "$H(x)$", desc: "the <b>desired underlying mapping</b> the block should ultimately compute, input to output." },
      { sym: "$F(x,\\{W_i\\})$", desc: "the <b>residual function</b> the layers actually learn: $F = H(x) - x$. The $\\{W_i\\}$ are the block's learnable weights (here two convolutions)." },
      { sym: "$\\{W_i\\}$", desc: "the set of weight layers inside the block (the paper uses two: $F = W_2\\,\\sigma(W_1 x)$)." },
      { sym: "$\\sigma$", desc: "the <b>ReLU</b> (Rectified Linear Unit) nonlinearity: keep positives, zero out negatives." },
      { sym: "$+\\,x$", desc: "the <b>identity shortcut</b> (skip connection): the block's input added back, parameter-free, so the layers only learn the residual." },
      { sym: "$W_s$", desc: "the <b>projection shortcut</b>: a learnable linear map (a $1\\times1$ convolution) used only when $x$ and $F$ have different shapes, to match dimensions." },
      { sym: "“degradation problem”", desc: "a plain term, not a symbol: a deeper plain network reaching <i>higher training error</i> than a shallower one &mdash; an <b>optimization</b> failure, not overfitting." }
    ],
    formula: `$$ \\mathbf{y} = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + \\mathbf{x} \\qquad\\text{(Eqn. 1)} \\qquad\\qquad \\mathbf{y} = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + W_s\\,\\mathbf{x} \\quad\\text{(Eqn. 2)} $$`,
    whatItDoes:
      `<p><b>Equation 1</b> is the residual building block: run the input $x$ through the block's weight layers
       to get the residual $\\mathcal{F}(x,\\{W_i\\})$, then <b>add the input back</b>. (A final ReLU,
       $\\sigma(y)$, is applied after the addition.) The "$+ x$" is free &mdash; no parameters &mdash; so the
       layers only have to learn the <i>correction</i> on top of "leave the input alone."</p>
       <p><b>Equation 2</b> is the same idea when shapes differ: the paper notes "the dimensions of $x$ and
       $\\mathcal{F}$ must be equal in Eqn.(1). If this is not the case &hellip; we can perform a linear
       projection $W_s$ by the shortcut connections to match the dimensions." So $W_s x$ reshapes the input
       (a $1\\times1$ conv) before the add.</p>`,
    derivation:
      `<p><b>Short recap &mdash; full math in the concept lesson.</b> The reason a deep residual stack trains
       while a plain one stalls is the gradient. Write the block (dropping the final ReLU, as is standard for
       this argument) as $y = x + F(x)$ and differentiate the output with respect to the input:</p>
       <p>$$ \\frac{\\partial y}{\\partial x} = 1 + \\frac{\\partial F(x)}{\\partial x}. $$</p>
       <p>That leading <b>"+1"</b> is a clean gradient highway: during back-propagation the gradient is
       multiplied by $(1 + \\partial F/\\partial x)$ instead of just $\\partial F/\\partial x$, so even when
       $\\partial F/\\partial x$ is tiny the gradient still passes through nearly undamped. Stack many blocks
       and the gradient flows from output to input along that highway instead of vanishing to $0$.</p>
       <p>The vanishing-gradient setup, the per-layer Jacobian product, and the gradient-norm-vs-depth
       experiment are derived in full in the <b>dl-resnet</b> concept lesson &mdash; head there for the
       "+1 highway" math; we only recap it here.</p>`,
    example:
      `<p>Work one block by hand with tiny vectors so the "$+ x$" is concrete. Let the block's input be
       $x = [0.5,\\,-0.3]$, and suppose its two weight layers compute the residual
       $F(x) = z = [-0.2,\\,0.1]$. Take $\\sigma$ to be ReLU.</p>
       <ul class="steps">
        <li><b>Add the shortcut</b> (Eqn. 1): $y = F(x) + x = [-0.2 + 0.5,\\;\\; 0.1 + (-0.3)] = [0.3,\\,-0.2]$.</li>
        <li><b>Apply the final ReLU</b>: $\\sigma(y) = \\mathrm{ReLU}([0.3,\\,-0.2]) = [0.3,\\,0.0]$.</li>
        <li><b>See what the skip bought you.</b> The first component is $0.3$: the input's $0.5$ plus the
        small residual $-0.2$. The shortcut <b>kept the $0.5$ alive</b> &mdash; the layers only had to supply
        the little correction. Without the skip the block would have output $\\mathrm{ReLU}([-0.2,\\,0.1]) =
        [0.0,\\,0.1]$, throwing the input's signal away.</li>
       </ul>
       <p>These exact numbers are recomputed in the notebook's first cell so you can check the block by
       running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build the residual block</b> (<code>BasicBlock</code>): conv &rarr; BatchNorm &rarr; ReLU
        &rarr; conv &rarr; BatchNorm. Save <code>identity = x</code>. If channels or stride change, route the
        identity through a $1\\times1$ <b>projection</b> conv (+ BatchNorm). Combine: <code>out = relu(out + identity)</code>.</li>
        <li><b>Stack blocks into stages.</b> A stage is several blocks at one channel width; the first block
        of a new stage downsamples (stride 2) and doubles channels, so its shortcut is a projection.</li>
        <li><b>Assemble the net:</b> a stem conv, then a few stages, then global average pooling and a linear
        classification head.</li>
        <li><b>Train</b> a few epochs on a CIFAR-10 subset.</li>
        <li><b>Ablate:</b> build a matched <b>plain</b> net (same depth, delete "<code>+ identity</code>")
        and compare training curves &mdash; the deep plain net should lag or stall.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): residual nets were evaluated "with a depth of up to 152 layers&mdash;8x
       deeper than VGG nets but still having lower complexity." Their headline number: <b>"An ensemble of
       these residual nets achieves 3.57% error on the ImageNet test set. This result won the 1st place on
       the ILSVRC 2015 classification task."</b> They also report a "28% relative improvement on the COCO
       object detection dataset" from the deeper representations, and analysis on CIFAR-10 "with 100 and 1000
       layers."</p>
       <p><i>These are the paper's reported figures, quoted from the abstract. The numbers in the CODEVIZ
       panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.BatchNorm2d</code>, <code>nn.ReLU</code>, the optimizer, and the CIFAR-10 loader from
       torchvision (preinstalled in Colab &mdash; no pip). <b>Build by hand:</b> the residual block (with the
       skip and the $1\\times1$ projection when shapes change), the stacking of blocks into stages, and the
       <b>ablation</b> that removes the skip. The "+1" highway gradient math is recapped from the dl-resnet
       concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the projection when dimensions differ.</b> The add is element-wise, so $x$ and
        $F(x)$ must share shape. If a block changes channels (e.g. 16&rarr;32) or downsamples (stride 2), an
        identity wire will not fit. <b>Fix:</b> put a $1\\times1$ convolution ($W_s$, Eqn. 2) on the shortcut
        to match channels and stride.</li>
        <li><b>Adding after the wrong activation.</b> The paper adds first, then applies the final ReLU:
        $\\sigma(F(x) + x)$. Squashing each path separately and then adding breaks the clean identity path.
        <b>Fix:</b> <code>out = relu(out + identity)</code>, in that order.</li>
        <li><b>BatchNorm placement.</b> Put BatchNorm after each convolution and <i>before</i> the addition
        (conv &rarr; BN, then add, then ReLU); the second conv's BN should not sit on the shortcut. Misplacing
        it puts the two summed paths on different scales and destabilizes training.</li>
        <li><b>Misreading degradation as overfitting.</b> A deeper plain net with <i>higher training error</i>
        is an optimization failure, not overfitting (overfitting keeps training error low). Reaching for
        dropout or more data is the wrong fix &mdash; skip connections are.</li>
        <li><b>Expecting deeper to be automatically better.</b> Residuals make depth <i>safe</i>, not
        automatically <i>more accurate</i>; add depth only while validation improves.</li>
      </ul>`,
    recall: [
      "Write the residual block equation (Eqn. 1) from memory.",
      "What does the identity shortcut do for the gradient during back-propagation?",
      "When do you need a projection shortcut $W_s$ instead of an identity wire?",
      "Why is the degradation problem NOT overfitting?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working tiny ResNet whose deep version trains well. Remove the
            single line <code>+ identity</code> from the block (turning it into a matched plain net of the
            same depth) and retrain. What happens to the <i>training</i> curve, and what does that
            demonstrate?`,
        steps: [
          { do: `Delete only the skip: change <code>out = relu(out + identity)</code> to <code>out = relu(out)</code>; keep depth, width, optimizer, and data identical.`, why: `An honest ablation changes exactly one thing &mdash; the residual connection &mdash; so any difference is attributable to it.` },
          { do: `Retrain and watch the deep plain net's training loss: it falls slowly, plateaus high, or oscillates, while the residual version dropped fast and stayed low.`, why: `Without the "+1" highway the gradient to early layers is weak, so the deep plain stack cannot optimize &mdash; the degradation problem reproduced on toy data.` },
          { do: `Conclude that the skip, not extra parameters, is what made the deep net trainable.`, why: `Both nets have the same layers and parameter count; only the residual one optimizes, isolating the skip as the cause.` }
        ],
        answer: `<p>The deep <b>plain</b> net's training loss lags badly &mdash; it stays high and noisy while
                 the residual net converges. Since the two nets are identical except for the "<code>+ identity</code>",
                 this isolates the skip connection as the reason deep nets train: it is an
                 <b>optimization</b> fix (the degradation problem), not a parameter-count or regularization
                 effect. The CODEVIZ panel shows exactly this contrast.</p>`
      },
      {
        q: `A block takes a 16-channel, 8&times;8 feature map and must output a 32-channel, 4&times;4 map
            (it downsamples and doubles channels). You write <code>out = relu(out + x)</code> and it errors.
            Why, and how do you fix the shortcut?`,
        steps: [
          { do: `Check shapes: <code>out</code> is (32, 4, 4) but <code>x</code> is (16, 8, 8); element-wise add needs equal shapes.`, why: `The shortcut and main path must match in channels and spatial size to be summed.` },
          { do: `Build a projection shortcut: a $1\\times1$ <code>nn.Conv2d(16, 32, kernel_size=1, stride=2)</code> (+ BatchNorm), and set <code>identity = self.proj(x)</code>.`, why: `Eqn. 2's $W_s$: the $1\\times1$ conv with stride 2 maps 16&rarr;32 channels and halves the spatial size, matching <code>out</code>.` },
          { do: `Now add the projected identity and apply ReLU.`, why: `Shapes agree, so $\\sigma(F(x) + W_s x)$ is well-defined.` }
        ],
        answer: `<p>The identity wire cannot be added because the shapes differ (16&times;8&times;8 vs
                 32&times;4&times;4). Replace it with a <b>projection shortcut</b> (Eqn. 2): a $1\\times1$
                 convolution with stride 2 mapping 16&rarr;32 channels, so $W_s x$ matches the block's output
                 and the residual sum works.</p>`
      },
      {
        q: `Your worked example had $x = [0.5, -0.3]$ and residual $F(x) = [-0.2, 0.1]$, giving block output
            $[0.3, 0.0]$. Suppose instead the layers learned $F(x) = [0, 0]$. What does the block output, and
            why is that the "safe fallback" the paper relies on?`,
        steps: [
          { do: `Plug into Eqn. 1: $y = F(x) + x = [0,0] + [0.5,-0.3] = [0.5,-0.3]$.`, why: `With a zero residual the block reduces to the identity plus the final activation.` },
          { do: `Apply the final ReLU: $\\mathrm{ReLU}([0.5,-0.3]) = [0.5, 0.0]$.`, why: `The positive component passes; the negative is clipped &mdash; but the input's signal $0.5$ survives.` },
          { do: `Note that driving $F$ to zero is trivial for the layers (just push the weights small), so the network can always recover a near-identity block.`, why: `That is why adding depth can never make optimization strictly worse: the extra blocks can opt out by learning $F=0$.` }
        ],
        answer: `<p>With $F(x)=[0,0]$ the block outputs $\\mathrm{ReLU}([0.5,-0.3]) = [0.5, 0.0]$ &mdash; it just
                 passes the input through. Learning $F=0$ is easy (small weights), so a residual block can
                 cheaply become a near-identity. That free "do nothing safely" option is exactly what a deep
                 <i>plain</i> stack struggles to learn, and why residual depth is safe.</p>`
      }
    ]
  });

  window.CODE["paper-resnet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the residual block and the stage-stacking by hand on top of
       <code>nn.Conv2d</code> / <code>nn.BatchNorm2d</code>, then train a small ResNet on a <b>CIFAR-10
       subset</b> (torchvision, preinstalled in Colab &mdash; no pip). The key line is
       <code>out = self.relu(out + identity)</code> &mdash; Eqn. 1, $y = F(x) + x$ &mdash; with a $1\\times1$
       <b>projection shortcut</b> (Eqn. 2) whenever channels or stride change. We then build a <b>matched
       plain net</b> (same depth, no skips) and print both training curves: the residual net trains, the deep
       plain net lags. The first cell recomputes the worked example $[0.5,-0.3] + [-0.2,0.1] \\to$ ReLU
       $\\to [0.3,0.0]$. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision, torchvision.transforms as T

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example: y = F(x) + x, then ReLU. ---
x   = torch.tensor([0.5, -0.3])
Fx  = torch.tensor([-0.2, 0.1])          # what the two layers compute (the residual)
y   = Fx + x                              # Eqn. 1: add the shortcut
out = torch.relu(y)
print("worked example:  sum =", y.tolist(), " ReLU =", out.tolist())
# worked example:  sum = [0.30000001192092896, -0.19999998807907104]  ReLU = [0.30000001192092896, 0.0]


# --- 1. The residual block (built by hand). skip=True -> ResNet; skip=False -> plain ablation. ---
class BasicBlock(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1, skip=True):
        super().__init__()
        self.skip  = skip
        self.conv1 = nn.Conv2d(in_ch, out_ch, 3, stride=stride, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(out_ch)
        self.conv2 = nn.Conv2d(out_ch, out_ch, 3, stride=1, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(out_ch)
        self.relu  = nn.ReLU(inplace=True)
        # Projection shortcut (Eqn. 2, W_s): only when shape changes.
        self.proj = None
        if stride != 1 or in_ch != out_ch:
            self.proj = nn.Sequential(
                nn.Conv2d(in_ch, out_ch, 1, stride=stride, bias=False),
                nn.BatchNorm2d(out_ch))

    def forward(self, x):
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))   # conv -> BN -> ReLU
        out = self.bn2(self.conv2(out))            # conv -> BN  (F(x))
        if self.skip:                              # the ablation switch
            if self.proj is not None:
                identity = self.proj(x)            # W_s x  when dims differ
            out = out + identity                   # Eqn. 1: F(x) + x
        return self.relu(out)                      # second nonlinearity AFTER the add


# --- 2. Stack blocks into stages -> a small ResNet (or plain net if skip=False). ---
class SmallResNet(nn.Module):
    def __init__(self, blocks_per_stage=3, skip=True, n_classes=10):
        super().__init__()
        self.stem = nn.Sequential(nn.Conv2d(3, 16, 3, padding=1, bias=False),
                                  nn.BatchNorm2d(16), nn.ReLU(inplace=True))
        def stage(in_ch, out_ch, stride):
            layers = [BasicBlock(in_ch, out_ch, stride, skip)]
            layers += [BasicBlock(out_ch, out_ch, 1, skip) for _ in range(blocks_per_stage - 1)]
            return nn.Sequential(*layers)
        self.stage1 = stage(16, 16, 1)
        self.stage2 = stage(16, 32, 2)             # downsample + double channels -> projection
        self.stage3 = stage(32, 64, 2)
        self.head   = nn.Linear(64, n_classes)

    def forward(self, x):
        x = self.stem(x)
        x = self.stage3(self.stage2(self.stage1(x)))
        x = x.mean(dim=(2, 3))                      # global average pool
        return self.head(x)


# --- 3. A CIFAR-10 subset (torchvision is preinstalled in Colab). ---
tfm = T.Compose([T.ToTensor(),
                 T.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))])
full = torchvision.datasets.CIFAR10(root="./data", train=True, download=True, transform=tfm)
subset = torch.utils.data.Subset(full, range(4000))     # small + fast
loader = torch.utils.data.DataLoader(subset, batch_size=128, shuffle=True)
device = "cuda" if torch.cuda.is_available() else "cpu"


def train(skip, epochs=4, depth=3):
    torch.manual_seed(0)
    net = SmallResNet(blocks_per_stage=depth, skip=skip).to(device)
    opt = torch.optim.SGD(net.parameters(), lr=0.05, momentum=0.9, weight_decay=5e-4)
    lf  = nn.CrossEntropyLoss()
    net.train(); curve = []
    for ep in range(epochs):
        tot = 0.0; nb = 0
        for xb, yb in loader:
            xb, yb = xb.to(device), yb.to(device)
            opt.zero_grad(); loss = lf(net(xb), yb); loss.backward(); opt.step()
            tot += loss.item(); nb += 1
        curve.append(tot / nb)
        print(f"  epoch {ep}  train loss {curve[-1]:.4f}")
    return curve

print("RESIDUAL net (skip=True):")
res_curve = train(skip=True)
print("PLAIN net (skip=False, ABLATION  -- same depth, no '+ identity'):")
plain_curve = train(skip=False)

print("\\nResidual train loss per epoch:", [round(c, 4) for c in res_curve])
print("Plain    train loss per epoch:", [round(c, 4) for c in plain_curve])
# The residual curve falls faster and lower; the matched plain net lags -- the degradation effect.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-resnet"] = {
    question: "At depth, does the training loss fall for a residual net vs a matched plain net (same depth, no skip)?",
    charts: [
      {
        type: "line",
        title: "Training loss vs step — 50-block net: residual vs plain (matched depth)",
        xlabel: "training step",
        ylabel: "cross-entropy loss",
        series: [
          {
            name: "Plain (no skip)",
            color: "#ff7b72",
            points: [[0,1.1355],[4,1.1239],[8,1.1201],[12,1.0992],[16,0.9067],[20,0.817],[24,0.555],[28,0.3789],[32,0.2156],[36,0.1718],[41,0.1471],[45,0.3117],[49,0.3615],[53,0.3167],[57,0.2938],[61,0.5754],[65,0.3955],[69,0.2154],[73,0.1991],[77,0.1014],[82,0.0441],[86,0.059],[90,0.0157],[94,0.0402],[98,0.0085],[102,0.0868],[106,1.1743],[110,0.3247],[114,0.2551],[119,0.1818]]
          },
          {
            name: "Residual (+ x)",
            color: "#7ee787",
            points: [[0,2.288],[4,0.0006],[8,0.0025],[12,0.0001],[16,0.0],[20,0.0],[24,0.0],[28,0.0],[32,0.0],[36,0.0],[41,0.0],[45,0.0],[49,0.0],[53,0.0],[57,0.0],[61,0.0],[65,0.0],[69,0.0],[73,0.0],[77,0.0],[82,0.0],[86,0.0],[90,0.0],[94,0.0],[98,0.0],[102,0.0],[106,0.0],[110,0.0],[114,0.0],[119,0.0]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two 50-block fully-connected nets (width 32, BatchNorm, ReLU) trained on a toy 3-class problem with momentum SGD &mdash; identical except for the residual '+ x'. The RESIDUAL net collapses to ~0 loss within ~5 steps and stays converged. The matched PLAIN net (same depth, skip removed) lags badly: it crawls down, plateaus, and spikes back up (e.g. to ~1.17 at step 106), never settling &mdash; the degradation effect from removing the skip. Same depth, width, optimizer, seed; the only difference is the '+ identity'.",
    code: `import torch, torch.nn as nn, numpy as np

# Two matched deep nets, identical except for the residual skip. Reproduces the
# qualitative effect on toy data (degradation when the skip is removed).
N, K, n, D = 256, 3, 32, 50
g = torch.Generator().manual_seed(1)
y = torch.randint(0, K, (N,), generator=g)
centers = torch.randn(K, n, generator=g) * 2.0
X = centers[y] + torch.randn(N, n, generator=g) * 0.5

class Block(nn.Module):
    def __init__(self, n, residual):
        super().__init__()
        self.fc = nn.Linear(n, n, bias=False)
        self.bn = nn.BatchNorm1d(n)
        self.residual = residual
    def forward(self, x):
        out = self.bn(self.fc(x))
        return torch.relu(out + x if self.residual else out)   # the only difference

class Net(nn.Module):
    def __init__(self, residual):
        super().__init__()
        self.stem   = nn.Linear(n, n)
        self.blocks = nn.Sequential(*[Block(n, residual) for _ in range(D)])
        self.head   = nn.Linear(n, K)
    def forward(self, x):
        return self.head(self.blocks(torch.relu(self.stem(x))))

def train(residual, steps=120, lr=0.03):
    torch.manual_seed(0)
    net = Net(residual); net.train()
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9)
    lf  = nn.CrossEntropyLoss(); losses = []
    for t in range(steps):
        opt.zero_grad(); loss = lf(net(X), y); loss.backward(); opt.step()
        losses.append(loss.item())
    return losses

plain = train(residual=False)
resid = train(residual=True)
idx = np.linspace(0, 119, 30).astype(int)
print("Plain   :", [[int(i), round(plain[i], 4)] for i in idx])
print("Residual:", [[int(i), round(resid[i], 4)] for i in idx])
# Residual -> ~0 within ~5 steps and stays there.
# Plain    -> crawls, plateaus, spikes back to ~1.17 around step 106 (degradation).`
  };
})();
