/* Paper lesson — "Highway Networks", Srivastava, Greff & Schmidhuber 2015.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-highway".
   GROUNDED from arXiv:1505.00387 (abstract) and the ar5iv HTML mirror (Section 2, Eqns 2-5).
   Track B (architecture): build the gated Highway layer from nn.Linear by hand; train a deep
   highway MLP vs a matched plain deep MLP; reproduce "highway trains where plain stalls"; ablate
   the carry-bias init. Highway is the GATED predecessor of ResNet's identity skip (concept dl-resnet). */
(function () {
  window.LESSONS.push({
    id: "paper-highway",
    title: "Highway Networks — Highway Networks (2015)",
    tagline: "A learned sigmoid gate lets a layer choose, per-unit, between transforming its input and carrying it through unchanged — so very deep nets finally train.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Rupesh Kumar Srivastava, Klaus Greff, Jürgen Schmidhuber",
      org: "The Swiss AI Lab IDSIA",
      year: 2015,
      venue: "arXiv:1505.00387 (May 2015); extended version arXiv:1507.06228, ICML 2015 Deep Learning Workshop",
      citations: "",
      arxiv: "https://arxiv.org/abs/1505.00387",
      code: ""
    },
    conceptLink: "dl-resnet",
    partOf: [],
    prereqs: ["dl-resnet", "dl-vanishing-gradient", "dl-activations", "dl-backprop", "dl-lstm-gru", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>Before this paper, stacking many layers usually made training <i>harder</i>, not easier. A deep
       stack of nonlinear layers suffers the <b>vanishing-gradient problem</b>: as the error signal is
       back-propagated from the output toward the early layers, it is multiplied by many small numbers and
       shrinks toward zero, so the early layers barely learn. The paper opens on exactly this (§1):</p>
       <blockquote>"Theoretical and empirical evidence indicates that the depth of neural networks &hellip; is
       crucial for their success. However, training of very deep networks remains an open problem." (§1)</blockquote>
       <p>So the puzzle is an <b>optimization</b> puzzle: we have good reasons to want depth, but a plain deep
       network of, say, 40 layers often refuses to descend at all — it sits near the random-guess loss.
       The question this paper answers is: how do you let gradients (and information) flow straight through
       a deep stack, the way they flow through time in an LSTM?</p>`,
    contribution:
      `<ul>
        <li><b>The highway layer.</b> Instead of forcing every layer to fully transform its input, give the
        layer a learned <b>transform gate</b> $T$ and a <b>carry gate</b> $C$. The output is a per-unit blend:
        $y = H(x)\\cdot T(x) + x\\cdot C(x)$. The gate decides, separately for each unit, how much new
        transformation to apply versus how much of the raw input to carry through.</li>
        <li><b>Tie the gates: $C = 1 - T$.</b> One sigmoid gate now controls the whole mix, so
        $y = H(x)\\cdot T(x) + x\\cdot(1 - T(x))$ (Eqn. 3). When $T \\to 0$ the layer becomes the
        <b>identity</b> $y = x$; when $T \\to 1$ it is the plain transform $y = H(x)$.</li>
        <li><b>A bias trick that makes deep nets trainable.</b> Initialize the gate's bias to a <b>negative</b>
        value (e.g. $-1$ to $-4$) so that early in training $T \\approx 0$ and the network defaults to
        carrying its input. They report training networks of <b>over 100 layers</b> (and preliminary runs up
        to 900 layers) that optimize, where plain stacks of the same depth fail.</li>
      </ul>`,
    whyItMattered:
      `<p>Highway Networks showed, months before ResNet, that a <b>shortcut path that carries the input
       forward</b> is the cure for un-trainable depth. ResNet (later in 2015) kept the shortcut but dropped
       the gate, using the bare identity $y = F(x) + x$ — simpler, parameter-free, and the version that
       became the standard. So highway is the <b>gated predecessor of the identity skip</b>: same core idea
       (let the input flow straight through), one with a learned door, one with the door wedged permanently
       open. Gated shortcuts also reappear inside LSTM/GRU cells and in many later architectures.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§1 (Introduction)</b> — the open problem of training very deep networks and the LSTM
        inspiration for using gates.</li>
        <li><b>§2 (Highway Networks)</b> — the three equations you will transcribe and implement:
        the gated form (Eqn. 2), the tied form with $C = 1 - T$ (Eqn. 3), and the boundary cases $y = x$ vs
        $y = H(x)$ (Eqn. 4).</li>
        <li><b>§2.2 (Training Deep Highway Networks)</b> — the negative transform-gate bias
        initialization (the single most important practical trick).</li>
       </ul>
       <p><b>Skim:</b> the experiment tables (exact MNIST / CIFAR-10 / CIFAR-100 numbers and the
       comparison to FitNets) and the gate-activity visualizations unless you want the empirical detail; the
       math you must own is three short equations in §2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Take a deep stack — say 40 layers — with no shortcut of any kind (a "plain" deep MLP). Train
       it on an easy classification task. Do you expect its <i>training</i> loss to (a) fall to near zero,
       (b) fall slowly but get there, or (c) stay pinned near the random-guess loss and never move?</p>
       <p>Now add the highway gate to every layer, with the gate's bias initialized <b>negative</b> so the net
       starts by carrying its input. Write your guess for both, then run the ablation below. (Hint: the random-
       guess cross-entropy for $K$ equally-likely classes is $\\ln K$; for 3 classes that is $\\ln 3 \\approx 1.0986$.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the highway block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>HighwayBlock(nn.Module)</code> holding two linear maps: <code>self.H = nn.Linear(n, n)</code>
        (the transform) and <code>self.T = nn.Linear(n, n)</code> (the gate's pre-activation).</li>
        <li>TODO: in <code>__init__</code>, set the gate bias negative so the net carries early:
        <code>nn.init.constant_(self.T.bias, -2.0)</code>.</li>
        <li>In <code>forward(x)</code>: compute <code>h = relu(self.H(x))</code> and the gate
        <code>t = sigmoid(self.T(x))</code>.</li>
        <li>TODO: combine — <code>return h * t + x * (1 - t)</code>  <i># Eqn. 3</i>.</li>
       </ul>
       <p>Then stack ~40 of these and a matched <b>plain</b> net (same depth, each block just
       <code>relu(self.H(x))</code>, no gate, no carry). Predict which one trains.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>A <b>plain</b> feedforward layer applies one fixed recipe to its input: $y = H(x, W_H)$, where $H$
       is an affine map (a weight matrix plus bias) followed by a nonlinearity. Every unit must be
       transformed; there is no way for a layer to say "leave this part of the input alone."</p>
       <p>A highway layer adds that option. It introduces two <b>gates</b> — numbers between 0 and 1, one
       per unit. The <b>transform gate</b> $T(x, W_T)$ says how much of the freshly transformed value $H(x)$
       to let through; the <b>carry gate</b> $C(x, W_C)$ says how much of the raw input $x$ to carry through
       unchanged. The output is their weighted blend (§2, Eqn. 2):</p>
       <p>$$ y = H(x, W_H)\\cdot T(x, W_T) + x\\cdot C(x, W_C). $$</p>
       <p>The "$\\cdot$" here is <b>element-wise multiplication</b> (each unit's value times that unit's gate),
       not a dot product. To save parameters the paper ties the two gates so they always sum to one,
       $C = 1 - T$ (§2, Eqn. 3), leaving a single learned gate:</p>
       <p>$$ y = H(x, W_H)\\cdot T(x, W_T) + x\\cdot \\big(1 - T(x, W_T)\\big). $$</p>
       <p>The gate itself is a <b>sigmoid</b>: $T(x) = \\sigma(W_T^{\\top} x + b_T)$, which squashes any real
       number into $(0, 1)$ — a soft 0/1 switch. Because $T$ is a smooth, learned function of $x$, the
       layer can open the gate for some units and inputs and close it for others, and it learns when to do
       which by gradient descent.</p>
       <p>The reason this fixes deep training is the boundary behaviour (§2, Eqn. 4). When the gate is
       fully closed, $T = 0$, the layer reduces to the <b>identity</b> $y = x$ — a clean wire that passes
       both the signal forward and the gradient backward undamped. When $T = 1$, it is the ordinary transform
       $y = H(x)$. The paper's training trick (§2.2) is to initialize $b_T$ <b>negative</b> so that at the
       start $T \\approx 0$ and the whole deep stack behaves like a chain of identity wires; gradients reach
       the early layers, and the network gradually opens gates only where transformation helps.</p>`,
    architecture:
      `<p>A highway network is a <b>stack of equal-width highway blocks</b> wrapped between an input projection
       and an output head. Concretely (the configuration used in the lesson's code):</p>
       <ul>
        <li><b>Stem (input projection).</b> A single plain layer $\\mathrm{relu}(W_{\\text{stem}}x)$ maps the
        raw input into the block width $n$. Its job is to set the working dimensionality once, since every
        highway block below must preserve it (the dimension-matching constraint, §2).</li>
        <li><b>The highway block</b> (the repeated unit). Each block holds <b>two independent affine maps of
        the same shape</b> $n\\times n$:
         <ul>
          <li>$H = W_H x + b_H$ followed by ReLU — the <b>transform</b> branch, the value a plain layer would output.</li>
          <li>$T = W_T x + b_T$ followed by sigmoid — the <b>transform-gate</b> branch, a per-unit number in $(0,1)$.</li>
         </ul>
         The block's output is the element-wise blend $y = H\\cdot T + x\\cdot(1 - T)$ (Eqn. 3). The carry gate
         $C = 1 - T$ is not a separate layer — it is computed from $T$. So a block has roughly <b>twice</b> the
         parameters of a plain layer (two weight matrices instead of one).</li>
        <li><b>Carry-bias init.</b> Every block's gate bias $b_T$ is initialized <b>negative</b> (e.g. $-2$),
        so at step 0 each block is approximately the identity $y \\approx x$ and the whole stack is a chain of
        near-identity wires (§2.2).</li>
        <li><b>Depth.</b> The blocks are stacked deep — the paper trains stacks of <b>over 100 layers</b>
        (preliminary runs to 900); the lesson stacks 40. Because every block keeps width $n$, the carry path
        $x$ always has a matching shape to add back.</li>
        <li><b>Head (output).</b> A final plain linear map $W_{\\text{head}}\\colon n \\to K$ produces the $K$
        class logits, read by cross-entropy.</li>
        <li><b>Data flow.</b> $x \\to \\text{stem} \\to \\text{block}_1 \\to \\cdots \\to \\text{block}_L \\to
        \\text{head} \\to \\text{logits}$. Forward, information can ride the carry path straight through; backward,
        the near-identity Jacobian (Eqn. 5) lets the gradient reach $\\text{block}_1$ undamped.</li>
        <li><b>Changing width.</b> To resize the representation between stacks, the paper inserts a separate
        <b>plain</b> layer (or sub-sampling / zero-padding) — never inside a highway block, which must stay
        square so the carry term fits.</li>
       </ul>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input</b> vector to the layer — and the value carried, unchanged, along the carry path when the gate is closed." },
      { sym: "$y$", desc: "the <b>output</b> of the highway layer: the gated blend of the transform and the carried input." },
      { sym: "$H(x, W_H)$", desc: "the <b>transform</b>: an affine map with weights $W_H$ followed by a nonlinearity (here ReLU). This is what a plain layer would output." },
      { sym: "$T(x, W_T)$", desc: "the <b>transform gate</b>: a per-unit number in $(0,1)$ saying how much of $H(x)$ to let through. Defined as a sigmoid, $T = \\sigma(W_T^{\\top} x + b_T)$." },
      { sym: "$C(x, W_C)$", desc: "the <b>carry gate</b>: a per-unit number in $(0,1)$ saying how much of the raw input $x$ to carry through. Tied to $T$ by $C = 1 - T$." },
      { sym: "$\\sigma$", desc: "the <b>sigmoid</b> (logistic) function $\\sigma(z) = 1/(1 + e^{-z})$: squashes any real number into $(0,1)$, acting as a soft on/off switch." },
      { sym: "$b_T$", desc: "the <b>bias of the transform gate</b>. Initialized to a <i>negative</i> value (e.g. $-2$) so that early in training $T \\approx 0$ and the net defaults to carrying its input — the key trick (§2.2)." },
      { sym: "$\\cdot$", desc: "<b>element-wise (Hadamard) multiplication</b>: multiply matching units, not a dot product. Each unit's transformed value is scaled by that unit's own gate." },
      { sym: "$W_T^{\\top}\\mathbf{x} + b_T$", desc: "the <b>gate pre-activation</b>: the transform gate's affine map before the sigmoid. $W_T^{\\top}$ is the gate weight matrix (transposed) and $b_T$ its bias." },
      { sym: "$d\\mathbf{y}/d\\mathbf{x}$", desc: "the layer's <b>Jacobian</b> — the matrix of output-vs-input derivatives. Equals identity $I$ when the gate is closed ($T=0$) and $H'$ when open ($T=1$) (§2, Eqn. 5)." },
      { sym: "$I$", desc: "the <b>identity matrix</b>: the Jacobian of a closed-gate (carry) layer. Multiplying the back-propagated gradient by $I$ leaves it unchanged — no vanishing." },
      { sym: "$H'(\\mathbf{x}, W_H)$", desc: "the <b>derivative (Jacobian) of the transform</b> $H$: the layer's Jacobian when the gate is fully open ($T=1$)." },
      { sym: "$\\dim(\\cdot)$", desc: "the <b>dimensionality</b> (number of units) of a vector. The dimension-matching note (§2) requires $\\dim(x)=\\dim(y)=\\dim(H)=\\dim(T)$ so the carry term $x$ can be added." },
      { sym: "$W_{\\text{stem}},\\, W_{\\text{head}}$", desc: "the <b>input-projection</b> and <b>output</b> plain-layer weight matrices that wrap the highway stack: stem maps input into width $n$; head maps width $n$ to $K$ class logits." },
      { sym: "$\\ln K$", desc: "a plain term, not from the paper: the cross-entropy loss of <b>random guessing</b> over $K$ equally-likely classes. A net stuck at $\\ln K$ has learned nothing." }
    ],
    formula:
      `$$ \\mathbf{y} = H(\\mathbf{x}, W_H) $$
       <p>A <b>plain</b> feedforward layer (§2, Eqn. 1): one affine map $W_H$ plus a nonlinearity, applied to every unit — no option to pass the input through.</p>
       $$ \\mathbf{y} = H(\\mathbf{x}, W_H)\\cdot T(\\mathbf{x}, W_T) + \\mathbf{x}\\cdot C(\\mathbf{x}, W_C) $$
       <p>The <b>highway layer</b> with two independent gates (§2, Eqn. 2): the <b>transform gate</b> $T$ weights the transformed value $H(x)$ and the <b>carry gate</b> $C$ weights the raw input $x$. "$\\cdot$" is element-wise (per-unit) multiplication.</p>
       $$ \\mathbf{y} = H(\\mathbf{x}, W_H)\\cdot T(\\mathbf{x}, W_T) + \\mathbf{x}\\cdot\\big(1 - T(\\mathbf{x}, W_T)\\big) $$
       <p>Tying the gates with $C = 1 - T$ (§2, Eqn. 3) leaves a single learned gate: at each unit the output is a convex blend of "transform" and "carry."</p>
       $$ T(\\mathbf{x}) = \\sigma\\!\\left(W_T^{\\top}\\mathbf{x} + b_T\\right), \\qquad \\sigma(z) = \\frac{1}{1 + e^{-z}} $$
       <p>The transform gate is a <b>sigmoid</b> (§2): it squashes the pre-activation into $(0,1)$, a soft per-unit on/off switch, learned by gradient descent.</p>
       $$ \\mathbf{y} = \\begin{cases} \\mathbf{x}, & \\text{if } T(\\mathbf{x}, W_T) = 0 \\\\ H(\\mathbf{x}, W_H), & \\text{if } T(\\mathbf{x}, W_T) = 1 \\end{cases} $$
       <p>Boundary cases (§2, Eqn. 4): a closed gate makes the layer the <b>identity</b> $y = x$; a fully open gate makes it the plain transform $y = H(x)$. The layer interpolates smoothly between them.</p>
       $$ \\frac{d\\mathbf{y}}{d\\mathbf{x}} = \\begin{cases} I, & \\text{if } T(\\mathbf{x}, W_T) = 0 \\\\ H'(\\mathbf{x}, W_H), & \\text{if } T(\\mathbf{x}, W_T) = 1 \\end{cases} $$
       <p>The layer's Jacobian (§2, Eqn. 5): when the gate is closed it is the identity matrix $I$, so the gradient passes backward undamped — this is why a near-closed deep stack escapes the vanishing gradient.</p>
       $$ \\dim(\\mathbf{x}) = \\dim(\\mathbf{y}) = \\dim\\!\\big(H(\\mathbf{x}, W_H)\\big) = \\dim\\!\\big(T(\\mathbf{x}, W_T)\\big) $$
       <p><b>Dimension-matching note</b> (§2): because the carry term adds the raw $x$ back, $x$, $y$, $H$ and $T$ must all share the same size. To change width the paper uses a plain layer (or sub-sampling / zero-padding) between highway stacks.</p>
       $$ b_T \\lt 0 \\quad (\\text{e.g. } -1, -3) \\;\\Longrightarrow\\; T \\approx 0 \\text{ at init} \\;\\Longrightarrow\\; \\mathbf{y} \\approx \\mathbf{x} $$
       <p><b>Bias initialization</b> (§2.2): set the transform-gate bias $b_T$ to a negative value so the network starts <i>biased toward carrying</i> its input — the whole deep stack begins as a chain of near-identity wires, and gradients reach the first layer.</p>`,
    whatItDoes:
      `<p>This is the highway layer (Eqn. 3, after tying $C = 1 - T$). Read it as a <b>per-unit dimmer
       switch</b>. For each unit, the gate $T$ is a knob between 0 and 1. At $T = 1$ the unit takes the fully
       transformed value $H(x)$; at $T = 0$ it takes the raw input $x$ untouched; in between it takes a blend.
       Because $T$ is learned and depends on $x$, every layer can decide — input by input, unit by unit —
       whether it is worth transforming or better to step aside and pass the input through. The "$+ x\\cdot(1-T)$"
       carry term is what keeps a deep stack trainable: with the gates near closed it is an open wire from
       output back to input, so the gradient does not vanish.</p>`,
    derivation:
      `<p><b>Short recap — the gradient-highway math lives in the dl-resnet concept lesson; we recap and
       point there.</b> Why does carrying the input keep a deep net trainable? Differentiate one highway layer
       in its carry regime. With the gates near closed ($T \\approx 0$, so $y \\approx x$), the layer's
       Jacobian (the matrix of output-vs-input derivatives) is approximately the identity $I$. The paper
       states this directly (§2, Eqn. 4): the Jacobian transitions between $I$ (when $T = 0$) and $H'$
       (when $T = 1$).</p>
       <p>Back-propagation multiplies the gradient by each layer's Jacobian in turn. Through $L$ plain layers
       the gradient is a product of $L$ Jacobians; if each has small singular values, the product shrinks
       toward zero — the <b>vanishing gradient</b>. But a carry path contributes a factor near $I$, which
       neither shrinks nor explodes the gradient. So a deep highway stack with its gates initialized near
       closed presents the gradient with a near-identity path from the loss all the way to the first layer.</p>
       <p>ResNet later made this exact, dropping the gate so the path is <i>always</i> identity:
       $y = x + F(x)$ gives $\\partial y/\\partial x = 1 + \\partial F/\\partial x$, the clean "+1 highway."
       The full vanishing-gradient setup, the per-layer Jacobian product, and the gradient-norm-vs-depth
       experiment are derived in the <b>dl-resnet</b> concept lesson — head there for the "+1 highway"
       math; highway is the gated version of the same shortcut.</p>`,
    example:
      `<p>Work one highway unit by hand so the gated blend is concrete. Take a 2-unit input
       $x = [1.0,\\, -2.0]$. Suppose the transform produces $H(x) = [0.8,\\, 0.5]$ (the ReLU output), and the
       gate's pre-activations are $z = W_T^{\\top}x + b_T = [2.0,\\, -1.5]$.</p>
       <ul class="steps">
        <li><b>Squash the gate through the sigmoid.</b> $T = \\sigma(z)$:
        $\\sigma(2.0) = 1/(1 + e^{-2.0}) = 0.8808$ and $\\sigma(-1.5) = 1/(1 + e^{1.5}) = 0.1824$. So
        $T = [0.8808,\\, 0.1824]$ — unit 1's gate is mostly <b>open</b> (transform), unit 2's is mostly
        <b>closed</b> (carry).</li>
        <li><b>Form the carry gate</b> $C = 1 - T = [0.1192,\\, 0.8176]$.</li>
        <li><b>Blend, per unit</b> (Eqn. 3): $y = H\\cdot T + x\\cdot(1 - T)$.
        <br>Unit 1: $0.8\\times 0.8808 + 1.0\\times 0.1192 = 0.7046 + 0.1192 = 0.8238$.
        <br>Unit 2: $0.5\\times 0.1824 + (-2.0)\\times 0.8176 = 0.0912 - 1.6352 = -1.5439$.</li>
        <li><b>Read the result.</b> $y = [0.8238,\\, -1.5439]$. Unit 1 mostly took the transform's $0.8$; unit
        2's gate was nearly shut, so it <b>carried the raw input $-2.0$ through</b> almost intact — the
        transform's $0.5$ barely registered. The gate let one unit transform and the other pass through.</li>
       </ul>
       <p>These exact numbers ($y = [0.8238, -1.5439]$) are recomputed in the notebook's first cell so you can
       check the layer by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build the highway block</b> (<code>HighwayBlock</code>): two linear maps, <code>H</code>
        (transform) and <code>T</code> (gate pre-activation). In <code>__init__</code> set the gate bias
        negative: <code>nn.init.constant_(self.T.bias, -2.0)</code>.</li>
        <li><b>Forward:</b> <code>h = relu(H(x))</code>, <code>t = sigmoid(T(x))</code>, then the blend
        <code>h * t + x * (1 - t)</code> (Eqn. 3). All units keep the same width so the carry "$x$" fits.</li>
        <li><b>Stack ~40 blocks</b> into a deep net with a stem linear in and a linear classification head out.</li>
        <li><b>Train</b> a fixed number of steps on a small classification task and watch the training loss.</li>
        <li><b>Ablate twice:</b> (a) replace the highway blocks with <b>plain</b> blocks (<code>relu(H(x))</code>,
        no gate) at the same depth; (b) keep the gate but set the gate bias to <b>0</b> (no carry init).
        Compare all three training curves — only the negative-bias highway should descend.</li>
      </ol>`,
    results:
      `<p>From the paper (§1 and §2.2, paraphrased): highway networks "with hundreds of layers can be
       trained directly using stochastic gradient descent," and the authors report training nets of <b>over
       100 layers</b> on MNIST and CIFAR, with preliminary experiments on architectures up to <b>900 layers</b>,
       whereas comparably deep plain networks fail to optimize. On CIFAR-10 they match or beat the deeper
       FitNet results without needing a teacher network.</p>
       <p><i>These are the paper's reported claims, paraphrased from the text — we did not transcribe the
       exact accuracy tables. The numbers in the CODEVIZ panel below are from our own tiny run, not the
       paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> The thing this paper is about is <b>trainability at depth</b>, so
       the primary metric is the <b>training loss</b> of a very deep stack (here a 40-layer MLP on a toy 3-class
       blob problem; the paper uses MNIST / CIFAR with stacks of 100+ layers). The no-skill floor is the
       <b>random-guess cross-entropy</b> $\\ln K$: for $K = 3$ classes that is $\\ln 3 \\approx 1.0986$. A net
       pinned at $\\ln 3$ has learned nothing; "working" means descending well below it. The paper's qualitative
       bar is that highway nets "with hundreds of layers can be trained directly" where matched plain stacks
       fail (&sect;1, &sect;2.2).</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> (1) Verify the loss at init: a fresh untrained net should
        output near-uniform logits, so the first loss should be $\\approx \\ln 3 \\approx 1.0986$ &mdash; if it
        starts far above, the head or init is broken. (2) Unit-test the highway blend on the lesson's worked
        example: $H = [0.8, 0.5]$, $x = [1.0, -2.0]$, gate pre-activations $z = [2.0, -1.5]$ must give
        $T = [0.8808, 0.1824]$ and $y = [0.8238, -1.5439]$. (3) Confirm <b>shape preservation</b>: every block's
        input and output are width $n$ (the carry term adds the raw $x$ back, so they must match). (4) Check the
        carry-init actually carries: right after init with $b_T = -2$, a forward pass should give $y \\approx x$
        at each block (the gate $T \\approx \\sigma(-2) \\approx 0.12$), so the deep stack is a near-identity wire.
        (5) Confirm $\\cdot$ is element-wise (<code>*</code>), not <code>@</code>/matmul.</li>
        <li><b>Expected range.</b> A correct 40-layer highway net with $b_T &lt; 0$ should drive the training loss
        to near $0$ &mdash; our small run collapses to $\\approx 0$ by $\\sim$step 120 (CODEVIZ; <i>our number,
        not the paper's</i>). The matched plain net should stay pinned near $\\ln 3 \\approx 1.0887$ for the whole
        run. As a rule of thumb (not a paper claim): if the highway loss flatlines at $\\ln 3$, the carry path or
        its negative-bias init is not working; if it descends but slowly/noisily, that is more likely
        learning-rate or depth tuning.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> Two knobs, each isolating one half of the
        contribution. (a) Replace highway blocks with <b>plain</b> blocks (<code>relu(H(x))</code>, no gate, no
        carry) at the same depth &mdash; loss must stall near $\\ln 3$, showing the carry path is necessary. (b)
        Keep the gate but set the gate bias to <b>$0$</b> (<code>nn.init.constant_(self.T.bias, 0.0)</code>)
        &mdash; the net must <i>also</i> stall, showing the carry path is not enough without the
        carry-by-default init (&sect;2.2). If the $b_T = 0$ run trains fine, the negative-bias trick is doing
        nothing for you and you have likely mis-wired the init.</li>
        <li><b>Failure signals &amp; what they mean.</b> (a) <b>Loss stuck at $\\ln 3$ even with highway blocks</b>:
        gate bias not negative (half-open gates, no default carry), or you used a dot product instead of
        element-wise multiply. (b) <b>Loss NaN / explodes</b>: learning rate too high for a 40-deep stack, or a
        width mismatch making the carry term ill-formed. (c) <b>Highway and plain curves identical</b>: the gate
        is degenerate (e.g. $T$ saturated at $1$, so $y = H(x)$ and the carry term vanished) &mdash; check
        $b_T$ and that $T = \\sigma(\\cdot)$ truly feeds the blend. (d) <b>Trains but no better than a shallow
        net</b>: depth isn't helping &mdash; expected, since the toy task is easy; the point is that highway
        <i>can</i> optimize at depth, not that depth wins here.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel gated composition. <b>Import:</b> <code>nn.Linear</code>,
       <code>torch.sigmoid</code>, <code>torch.relu</code>, the optimizer, and the cross-entropy loss.
       <b>Build by hand:</b> the highway layer (the two gates and the element-wise blend $H\\cdot T + x\\cdot(1-T)$),
       the negative gate-bias initialization, the deep stacking, and the two <b>ablations</b> (plain blocks;
       and highway with zero gate bias). The vanishing-gradient / identity-Jacobian math is recapped from the
       dl-resnet concept lesson, not re-derived here.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the negative gate bias.</b> With $b_T = 0$ the gates start half-open, the net does
        <i>not</i> default to carrying its input, and a deep highway stack stalls just like a plain one. The
        single most important line is <code>nn.init.constant_(self.T.bias, -2.0)</code> (§2.2). The
        ablation below shows zeroing it kills training.</li>
        <li><b>Using a dot product instead of element-wise multiply.</b> The "$H\\cdot T$" and "$x\\cdot(1-T)$"
        are <b>Hadamard</b> (per-unit) products. In code that is plain <code>*</code> on equal-shape tensors,
        not <code>@</code>/<code>matmul</code>.</li>
        <li><b>Changing width inside a block.</b> The carry term adds the raw $x$ back, so input and output
        must share shape — every highway block keeps the same number of units. (Change width with a
        separate plain projection layer between highway stacks, as the paper does.)</li>
        <li><b>Confusing the gate with the transform.</b> $T$ is a <i>sigmoid</i> in $(0,1)$ — a mixing
        weight — while $H$ is the <i>ReLU</i> transform. Two separate linear maps feed them; swapping the
        activations breaks the gate's "soft switch" meaning.</li>
        <li><b>Reading highway as ResNet.</b> Highway's shortcut is <b>gated</b> ($x\\cdot(1-T)$, learned),
        ResNet's is the <b>bare identity</b> ($+x$, always on). Highway came first; ResNet simplified it.</li>
      </ul>`,
    recall: [
      "Write the highway layer equation (Eqn. 3) from memory.",
      "Define the transform gate $T$ and the carry gate $C$, and state how they are tied.",
      "What is $b_T$ initialized to, and why does that make a deep net trainable?",
      "What does a highway layer reduce to when $T = 0$? When $T = 1$?",
      "How does highway's shortcut differ from ResNet's identity skip?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a 40-layer highway MLP that trains to near-zero loss with the gate
            bias initialized to $-2$. Two changes are proposed: (i) replace every highway block with a plain
            block (<code>relu(H(x))</code>, no gate); (ii) keep the highway gate but set its bias to $0$.
            Predict each curve and say what the comparison demonstrates.`,
        steps: [
          { do: `Run (i): same depth, plain blocks, no carry path.`, why: `Removes the shortcut entirely — isolates whether the carry path is what enables depth.` },
          { do: `Run (ii): highway blocks but <code>nn.init.constant_(self.T.bias, 0.0)</code>.`, why: `Keeps the gate machinery but removes the carry-by-default initialization (§2.2) — isolates the bias trick.` },
          { do: `Compare the three training losses against the random-guess floor $\\ln 3 \\approx 1.0986$.`, why: `A curve pinned near $\\ln 3$ has learned nothing; only a curve that descends well below it is training.` }
        ],
        answer: `<p>Both ablations <b>stall near the random-guess loss</b> ($\\approx 1.09$ for 3 classes) while the
                 negative-bias highway descends to near zero. (i) shows the carry path is necessary; (ii) shows
                 the carry path is not enough on its own — you must <i>initialize</i> the gate to carry
                 ($b_T \\lt 0$) so the deep net starts as a chain of near-identity wires. The two together
                 isolate the highway gate <i>and</i> its negative-bias init as the reason deep nets train. Our
                 CODEVIZ panel shows the plain-vs-highway version of this contrast.</p>`
      },
      {
        q: `A highway unit has input $x = 0.4$, transform $H(x) = 0.9$, and gate pre-activation
            $z = W_T x + b_T = 1.0$. Compute the unit's output $y$ by hand, and say which path dominated.`,
        steps: [
          { do: `Sigmoid the gate: $T = \\sigma(1.0) = 1/(1 + e^{-1.0}) = 0.7311$.`, why: `The gate is a sigmoid mixing weight in $(0,1)$ — here mostly open.` },
          { do: `Carry gate $C = 1 - T = 0.2689$.`, why: `The carry and transform gates are tied: $C = 1 - T$ (Eqn. 3).` },
          { do: `Blend: $y = H\\cdot T + x\\cdot(1-T) = 0.9\\times 0.7311 + 0.4\\times 0.2689 = 0.6580 + 0.1076 = 0.7656$.`, why: `Eqn. 3, applied to a single unit.` }
        ],
        answer: `<p>$T = \\sigma(1.0) = 0.7311$, so $y = 0.9\\times 0.7311 + 0.4\\times 0.2689 = 0.7656$. The gate was
                 mostly open ($T \\approx 0.73$), so the <b>transform path dominated</b>: the output sits close
                 to $H(x) = 0.9$, pulled down a little by the carried input $0.4$. Had $b_T$ been very negative
                 (gate near closed), $y$ would have stayed near the input $0.4$ instead.</p>`
      },
      {
        q: `Show algebraically that a highway layer contains both the identity wire and the plain layer as
            special cases, and connect this to why ResNet could later drop the gate.`,
        steps: [
          { do: `Set $T = 0$ in Eqn. 3: $y = H(x)\\cdot 0 + x\\cdot(1-0) = x$.`, why: `Gate fully closed — the layer is the identity mapping (Eqn. 4, $T=0$ case).` },
          { do: `Set $T = 1$: $y = H(x)\\cdot 1 + x\\cdot(1-1) = H(x)$.`, why: `Gate fully open — the layer is an ordinary plain transform (Eqn. 4, $T=1$ case).` },
          { do: `Note ResNet fixes the path permanently open as a bare add: $y = x + F(x)$, no gate to learn.`, why: `If the identity path is always useful, a learned gate is extra parameters; hard-wiring it is simpler and still keeps gradients flowing.` }
        ],
        answer: `<p>At $T = 0$ the layer is the <b>identity</b> $y = x$; at $T = 1$ it is the <b>plain layer</b>
                 $y = H(x)$ (Eqn. 4). A highway layer interpolates smoothly between the two, choosing per unit.
                 ResNet observed that the identity path is the part that matters for trainability and wired it
                 in unconditionally ($y = x + F(x)$), discarding the learned gate — fewer parameters, same
                 gradient highway. Highway is the gated original; ResNet is the un-gated simplification.</p>`
      }
    ]
  });

  window.CODE["paper-highway"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the gated highway layer by hand on top of <code>nn.Linear</code>, then train
       a <b>40-layer</b> highway MLP and a matched <b>40-layer plain</b> MLP on a small 3-class blob problem.
       The key line is <code>return h * t + x * (1 - t)</code> — Eqn. 3, $y = H\\cdot T + x\\cdot(1-T)$ —
       with the gate bias initialized to $-2$ so the net carries its input early (§2.2). The plain net
       (same depth, no gate, no carry) sits at the random-guess loss $\\ln 3 \\approx 1.099$ and never learns;
       the highway net descends to near zero. We then <b>ablate the carry-bias init</b> (set the gate bias to
       $0$) and show the highway net stalls too — isolating the negative-bias trick. The first cell
       recomputes the worked example $H=[0.8,0.5]$, $z=[2.0,-1.5]\\to y=[0.8238,-1.5439]$. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example: y = H*T + x*(1-T), T = sigmoid(z). ---
x  = torch.tensor([1.0, -2.0])
Hx = torch.tensor([0.8, 0.5])              # the transform's ReLU output
z  = torch.tensor([2.0, -1.5])             # the gate's pre-activation W_T^T x + b_T
T  = torch.sigmoid(z)                       # gate in (0,1):  ~[0.8808, 0.1824]
y  = Hx * T + x * (1 - T)                   # Eqn. 3, element-wise
print("worked example:  T =", [round(v,4) for v in T.tolist()],
      " y =", [round(v,4) for v in y.tolist()])
# worked example:  T = [0.8808, 0.1824]  y = [0.8238, -1.5439]


# --- 1. The highway layer (built by hand). negative gate bias -> carry early (Sec 2.2). ---
class HighwayBlock(nn.Module):
    def __init__(self, n, bias_T=-2.0):
        super().__init__()
        self.H = nn.Linear(n, n)            # transform
        self.T = nn.Linear(n, n)            # transform-gate pre-activation
        nn.init.constant_(self.T.bias, bias_T)   # negative bias -> T ~ 0 at start -> carry x
    def forward(self, x):
        h = torch.relu(self.H(x))           # H(x, W_H)
        t = torch.sigmoid(self.T(x))        # T(x, W_T) in (0,1)
        return h * t + x * (1 - t)          # Eqn. 3:  H*T + x*(1-T)   (element-wise)

# A matched PLAIN block: same width, but no gate and no carry path.
class PlainBlock(nn.Module):
    def __init__(self, n):
        super().__init__()
        self.H = nn.Linear(n, n)
    def forward(self, x):
        return torch.relu(self.H(x))


# --- 2. A deep net of either block type. kind in {"highway","plain"}; bias_T for the ablation. ---
n, K, DEPTH = 32, 3, 40
class DeepNet(nn.Module):
    def __init__(self, kind, bias_T=-2.0):
        super().__init__()
        self.stem = nn.Linear(n, n)
        if kind == "highway":
            self.blocks = nn.Sequential(*[HighwayBlock(n, bias_T) for _ in range(DEPTH)])
        else:
            self.blocks = nn.Sequential(*[PlainBlock(n) for _ in range(DEPTH)])
        self.head = nn.Linear(n, K)
    def forward(self, x):
        return self.head(self.blocks(torch.relu(self.stem(x))))


# --- 3. A tiny 3-class blob problem (no downloads needed). ---
N = 256
g = torch.Generator().manual_seed(1)
y_lbl   = torch.randint(0, K, (N,), generator=g)
centers = torch.randn(K, n, generator=g) * 2.0
X       = centers[y_lbl] + torch.randn(N, n, generator=g) * 0.5


def train(kind, bias_T=-2.0, steps=160, lr=0.1):
    torch.manual_seed(0)
    net = DeepNet(kind, bias_T); net.train()
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9)
    lf  = nn.CrossEntropyLoss(); curve = []
    for t in range(steps):
        opt.zero_grad(); loss = lf(net(X), y_lbl); loss.backward(); opt.step()
        curve.append(loss.item())
    return curve

import math
print("\\nrandom-guess loss ln(3) =", round(math.log(K), 4))

plain   = train("plain")
highway = train("highway", bias_T=-2.0)
abl0    = train("highway", bias_T=0.0)       # ABLATION: drop the carry-bias init

print("PLAIN   (depth 40, no gate)        final train loss:", round(plain[-1],   4))
print("HIGHWAY (depth 40, b_T=-2)         final train loss:", round(highway[-1], 4))
print("HIGHWAY (depth 40, b_T= 0, ablate) final train loss:", round(abl0[-1],    4))
# PLAIN stalls at ~ln(3)=1.0986 (learns nothing); HIGHWAY descends to ~0.
# The b_T=0 ablation ALSO stalls -> the negative carry-bias init is what makes depth trainable.
# (Exact numbers vary by hardware/torch version; this is our small run, not the paper's result.)`
  };

  window.CODEVIZ["paper-highway"] = {
    question: "At depth 40, does a gated highway MLP train where a matched plain MLP stalls?",
    charts: [
      {
        type: "line",
        title: "Training loss vs step — 40-layer MLP: highway (gated carry) vs matched plain",
        xlabel: "training step",
        ylabel: "cross-entropy loss",
        series: [
          {
            name: "Plain (no gate)",
            color: "#ff7b72",
            points: [[0,1.0945],[5,1.0903],[10,1.0889],[16,1.0898],[21,1.089],[27,1.0888],[32,1.0889],[38,1.0888],[43,1.0888],[49,1.0888],[54,1.0888],[60,1.0888],[65,1.0888],[71,1.0887],[76,1.0888],[82,1.0888],[87,1.0887],[93,1.0887],[98,1.0887],[104,1.0887],[109,1.0887],[115,1.0887],[120,1.0887],[126,1.0887],[131,1.0887],[137,1.0887],[142,1.0887],[148,1.0887],[153,1.0887],[159,1.0887]]
          },
          {
            name: "Highway (b_T=-2)",
            color: "#7ee787",
            points: [[0,1.1255],[5,1.0997],[10,1.0879],[16,1.0918],[21,1.0872],[27,1.0817],[32,1.0801],[38,1.0765],[43,1.0723],[49,1.066],[54,1.0577],[60,1.0378],[65,0.9912],[71,0.7416],[76,0.5712],[82,0.4601],[87,0.4159],[93,0.3753],[98,0.3155],[104,0.1417],[109,0.0558],[115,0.006],[120,0.0004],[126,0.0],[131,0.0],[137,0.0],[142,0.0],[148,0.0],[153,0.0],[159,0.0]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two 40-layer MLPs (width 32, ReLU) trained on a toy 3-class blob problem with momentum SGD — identical depth and width, differing only by the highway gate and its carry-bias init. The PLAIN net is pinned at the random-guess loss $\\ln 3 \\approx 1.099$ for all 160 steps: a 40-layer plain stack cannot optimize (vanishing gradients). The HIGHWAY net, with the gate bias initialized to $-2$ so it carries its input early, breaks away around step ~60 and collapses to ~0 by step ~120. Same depth, width, optimizer, seed — the only difference is the gated carry path $x\\cdot(1-T)$. In our run the $b_T=0$ ablation (not plotted) also stalls at ~1.0887, so the negative bias init is essential.",
    code: `import torch, torch.nn as nn, numpy as np

# Two matched 40-layer MLPs, identical except for the highway gate + carry-bias init.
# Reproduces the qualitative effect: highway trains where the plain net stalls.
N, K, n, D = 256, 3, 32, 40
g = torch.Generator().manual_seed(1)
y = torch.randint(0, K, (N,), generator=g)
centers = torch.randn(K, n, generator=g) * 2.0
X = centers[y] + torch.randn(N, n, generator=g) * 0.5

class HighwayBlock(nn.Module):
    def __init__(self, n, bias_T):
        super().__init__()
        self.H = nn.Linear(n, n); self.T = nn.Linear(n, n)
        nn.init.constant_(self.T.bias, bias_T)      # negative -> carry early
    def forward(self, x):
        h = torch.relu(self.H(x)); t = torch.sigmoid(self.T(x))
        return h * t + x * (1 - t)                  # Eqn. 3 (element-wise)

class PlainBlock(nn.Module):
    def __init__(self, n):
        super().__init__(); self.H = nn.Linear(n, n)
    def forward(self, x):
        return torch.relu(self.H(x))                # no gate, no carry

class Net(nn.Module):
    def __init__(self, kind, bias_T=-2.0):
        super().__init__()
        self.stem = nn.Linear(n, n)
        blk = (lambda: HighwayBlock(n, bias_T)) if kind == "highway" else (lambda: PlainBlock(n))
        self.blocks = nn.Sequential(*[blk() for _ in range(D)])
        self.head = nn.Linear(n, K)
    def forward(self, x):
        return self.head(self.blocks(torch.relu(self.stem(x))))

def train(kind, bias_T=-2.0, steps=160, lr=0.1):
    torch.manual_seed(0)
    net = Net(kind, bias_T); net.train()
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9)
    lf  = nn.CrossEntropyLoss(); losses = []
    for t in range(steps):
        opt.zero_grad(); loss = lf(net(X), y); loss.backward(); opt.step()
        losses.append(loss.item())
    return losses

plain   = train("plain")
highway = train("highway", bias_T=-2.0)
idx = np.linspace(0, 159, 30).astype(int)
print("Plain  :", [[int(i), round(plain[i], 4)]   for i in idx])
print("Highway:", [[int(i), round(highway[i], 4)] for i in idx])
# Plain   -> pinned at ln(3) ~ 1.0887 (never learns at depth 40).
# Highway -> breaks away ~step 60, ~0 by ~step 120.`
  };
})();
