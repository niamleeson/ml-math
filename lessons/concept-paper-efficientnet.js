/* Paper lesson — "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks",
   Tan & Le 2019.  Self-contained: lesson + CODE + CODEVIZ merged by id "paper-efficientnet".
   GROUNDED from arXiv:1905.11946 (ar5iv HTML mirror): §3 (problem, Eqns 1-2), §3.3 + §4
   (compound scaling, Eqn 3, grid-search coefficients alpha/beta/gamma), Observations 1-2,
   Figure 8 / Table 7 (ablation).  Track B (architecture): we do not retrain ImageNet; we
   implement the SCALING ARITHMETIC and the FLOPS accounting on a tiny net, then ABLATE
   single-dimension scaling vs compound scaling.  conceptLink is null (no concept owner). */
(function () {
  window.LESSONS.push({
    id: "paper-efficientnet",
    title: "EfficientNet — Rethinking Model Scaling for Convolutional Neural Networks (2019)",
    tagline: "Scale a network's depth, width, and input resolution together with one dial φ instead of one at a time.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Mingxing Tan, Quoc V. Le",
      org: "Google Research, Brain Team",
      year: 2019,
      venue: "arXiv:1905.11946 (May 2019); ICML 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1905.11946",
      code: "https://github.com/tensorflow/tpu/tree/master/models/official/efficientnet"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-conv", "pt-cnn", "pt-nn-module", "dl-resnet", "paper-resnet", "dl-activations"],

    // WHY READ IT
    problem:
      `<p>Once you have a good Convolutional Neural Network (CNN), you usually want a bigger, more accurate
       version of it. There are three knobs to turn:</p>
       <ul>
        <li><b>Depth</b> &mdash; how many layers the network stacks (more layers, written $d$).</li>
        <li><b>Width</b> &mdash; how many channels each layer has (wider feature maps, written $w$).</li>
        <li><b>Resolution</b> &mdash; how many pixels the input image has (e.g. 224&times;224 vs 320&times;320,
        written $r$).</li>
       </ul>
       <p>Before this paper, people almost always turned <b>one</b> knob. The paper says it plainly (&sect;1):</p>
       <blockquote>"it is common to scale only one of these factors &ndash; depth, width, and image size. Though it
       is possible to scale two or three dimensions arbitrarily, arbitrary scaling requires tedious manual
       tuning and still often yields sub-optimal accuracy and efficiency."</blockquote>
       <p>Turning one knob hits diminishing returns fast, and turning all three "by hand" means a giant search
       with no principle. The question the paper asks: is there a <b>principled</b> way to grow all three at
       once?</p>`,
    contribution:
      `<ul>
        <li><b>Compound scaling.</b> Grow depth, width, and resolution <i>together</i>, governed by a single
        number $\\phi$ (the <b>compound coefficient</b>, a Greek letter "phi" you just read as one dial). The
        three knobs move in fixed proportions to each other.</li>
        <li><b>A balance constraint.</b> The proportions are not arbitrary: they obey
        $\\alpha\\cdot\\beta^2\\cdot\\gamma^2\\approx 2$, which makes the total compute (FLOPS) grow in a
        predictable, controlled way as you increase $\\phi$.</li>
        <li><b>The EfficientNet family.</b> One small baseline net (<b>EfficientNet-B0</b>) plus one set of
        proportions, scaled up by $\\phi$, gives a whole family <b>B0&hellip;B7</b> &mdash; each more accurate
        and far cheaper than hand-designed nets of the same accuracy.</li>
      </ul>`,
    whyItMattered:
      `<p>EfficientNet became a go-to CNN backbone: a principled "one dial" recipe replaced ad-hoc scaling, and
       the B0&ndash;B7 family hit strong accuracy at a fraction of the compute of earlier nets. The same
       "scale all dimensions in fixed proportion" idea carried into later work (EfficientNetV2,
       EfficientDet for detection) and shaped how people think about trading accuracy against cost.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Problem Formulation)</b> &mdash; Eqn. 1 (a ConvNet as a stack of stages) and Eqn. 2
        (scaling written as a constrained optimization: maximize accuracy subject to a compute budget).</li>
        <li><b>&sect;3.2 (Scaling Dimensions)</b> &mdash; <b>Observation 1</b> (each single dimension helps but
        saturates) and the single-dimension plots (Fig. 3).</li>
        <li><b>&sect;3.3 (Compound Scaling)</b> &mdash; <b>Observation 2</b> (balance all three) and the key
        equation <b>Eqn. 3</b> with the $\\alpha\\cdot\\beta^2\\cdot\\gamma^2\\approx 2$ constraint. This is the
        whole paper in one box.</li>
        <li><b>&sect;4 (EfficientNet Architecture)</b> &mdash; the two-STEP recipe and the grid-search values
        $\\alpha=1.2,\\ \\beta=1.1,\\ \\gamma=1.15$.</li>
        <li><b>Fig. 8 / Table 7 (ablation)</b> &mdash; compound scaling vs scaling a single dimension at the
        same FLOPS.</li>
       </ul>
       <p><b>Skim:</b> the exact B0 layer table (Table 1) and the transfer-learning results (&sect;5.2) unless
       you need them. The math you must own is one equation (Eqn. 3) and one constraint.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You have a fixed extra compute budget &mdash; say you are allowed to <b>double</b> the FLOPS (floating
       point operations, a proxy for cost). You can spend it <b>all on depth</b> (more layers), <b>all on
       width</b> (more channels), <b>all on resolution</b> (bigger images), or <b>split it across all three</b>.
       Which do you expect to give the best accuracy at that same doubled budget? Write your guess and one
       sentence of reasoning, then run the ablation below.</p>
       <p>(Hint: think about what a deeper network "sees" if the image stays tiny, and what a high-resolution
       image needs in order to be useful.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the arithmetic you will implement. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Pick a compound coefficient, e.g. <code>phi = 2</code>.</li>
        <li>Use the paper's coefficients <code>alpha = 1.2, beta = 1.1, gamma = 1.15</code>.</li>
        <li>TODO: compute the three multipliers &mdash; <code>d = alpha**phi</code>,
        <code>w = beta**phi</code>, <code>r = gamma**phi</code> (Eqn. 3).</li>
        <li>TODO: estimate the compute multiplier. A convolution's FLOPS scale like
        $d\\cdot w^2\\cdot r^2$, so the net's FLOPS grow by roughly
        <code>d * w**2 * r**2 == (alpha * beta**2 * gamma**2)**phi</code>. Check it is close to
        <code>2**phi</code>.</li>
        <li>TODO: build an <b>ablation</b> &mdash; spend the <i>same</i> compute budget on depth alone, and
        compare the parameter/FLOPS profile to the compound split.</li>
       </ul>
       <p>Predict whether splitting the budget three ways or pouring it all into one dimension lands a "nicer"
       network for the same cost.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start with how the paper describes a CNN (&sect;3.1, Eqn. 1). A ConvNet is a chain of <b>stages</b>;
       stage $i$ repeats one layer pattern $\\mathcal{F}_i$ a total of $L_i$ times, on a feature map of height
       $H_i$, width $W_i$, and $C_i$ channels. Writing $\\bigodot$ for "compose these stages in order":</p>
       <p>$$ \\mathcal{N} = \\bigodot_{i=1\\ldots s}\\ \\mathcal{F}_i^{L_i}\\big(X_{\\langle H_i, W_i, C_i\\rangle}\\big). $$</p>
       <p>Now <b>scaling</b> just means multiplying three of those quantities by factors (&sect;3.1, Eqn. 2):
       <b>depth</b> multiplies every $L_i$ by $d$, <b>width</b> multiplies every channel count $C_i$ by $w$,
       and <b>resolution</b> multiplies the spatial size $H_i, W_i$ by $r$. The paper frames the goal as a
       constrained optimization: pick $d, w, r$ to <b>maximize accuracy</b> subject to staying under a target
       memory and a target FLOPS (compute) budget.</p>
       <p>Two facts from the paper drive the method:</p>
       <p><b>Observation 1 (&sect;3.2):</b> <i>"Scaling up any dimension of network width, depth, or resolution
       improves accuracy, but the accuracy gain diminishes for bigger models."</i> So any single knob, turned
       alone, runs out of steam.</p>
       <p><b>Observation 2 (&sect;3.3):</b> <i>"In order to pursue better accuracy and efficiency, it is critical
       to balance all dimensions of network width, depth, and resolution during ConvNet scaling."</i> The
       intuition: a bigger input image (higher $r$) has more, finer detail; to use it you want <b>more layers</b>
       (higher $d$) so the network's receptive field can cover the larger image, and <b>more channels</b>
       (higher $w$) to represent the extra fine-grained patterns. Turning one knob without the others wastes the
       budget.</p>
       <p>The <b>compound scaling method</b> (&sect;3.3, Eqn. 3) bakes that balance into a single dial $\\phi$:
       each knob is a fixed base raised to the power $\\phi$, and the bases obey one constraint. Pick the bases
       once by a small grid search; then turning $\\phi$ up grows all three knobs together in the right
       proportion.</p>
       <p><b>Why the constraint is $\\alpha\\cdot\\beta^2\\cdot\\gamma^2$ (the FLOPS accounting).</b> The cost of a
       convolution scales <i>linearly</i> with depth (twice the layers, twice the work) but <i>quadratically</i>
       with width and with resolution (the paper: the FLOPS of a regular convolution are proportional to
       $d,\\ w^2,\\ r^2$). Width is squared because a conv layer connects every input channel to every output
       channel; resolution is squared because an image has area (height &times; width). So scaling by
       $(d, w, r) = (\\alpha^\\phi, \\beta^\\phi, \\gamma^\\phi)$ multiplies total FLOPS by
       $(\\alpha\\cdot\\beta^2\\cdot\\gamma^2)^\\phi$. Forcing $\\alpha\\cdot\\beta^2\\cdot\\gamma^2\\approx 2$
       makes the compute grow by about $2^\\phi$ &mdash; one clean rule: <b>add 1 to $\\phi$, roughly double the
       FLOPS.</b></p>`,
    architecture:
      `<p>Compound scaling needs a <b>good baseline</b> to scale. The authors do not hand-design it: they run a
       <b>multi-objective neural architecture search</b> (the same search space as MnasNet) that optimizes both
       accuracy and compute via the objective $\\text{ACC}(m)\\times[\\text{FLOPS}(m)/T]^{\\,w}$ with $w=-0.07$
       and a target $T = 400$M FLOPS (&sect;4). The search returns <b>EfficientNet-B0</b>.</p>
       <p><b>The B0 building block: MBConv (mobile inverted bottleneck).</b> Each main stage is built from
       <b>MBConv</b> blocks &mdash; an inverted residual from MobileNetV2 with an added <b>squeeze-and-excitation
       (SE)</b> channel-attention step. One MBConv block does: <b>(1) expand</b> the channels by a factor (the
       number after "MBConv": <code>MBConv1</code> = expand &times;1, <code>MBConv6</code> = expand &times;6) with a
       1&times;1 convolution; <b>(2) depthwise convolution</b> (a $k\\times k$ filter applied per-channel, far
       cheaper than a full conv; $k\\in\\{3,5\\}$ in B0); <b>(3) SE</b> &mdash; pool to one value per channel, learn
       per-channel gates, reweight the channels; <b>(4) project</b> back down to the output channels with a
       1&times;1 convolution; plus a <b>residual skip</b> when input and output shapes match.</p>
       <p><b>EfficientNet-B0 (Table 1), input $224\\times224$, 9 stages top to bottom:</b></p>
       <table class="arch">
        <tr><th>Stage</th><th>Operator</th><th>Resolution</th><th>Channels</th><th>Layers</th></tr>
        <tr><td>1</td><td>Conv 3&times;3</td><td>224&times;224</td><td>32</td><td>1</td></tr>
        <tr><td>2</td><td>MBConv1, k3&times;3</td><td>112&times;112</td><td>16</td><td>1</td></tr>
        <tr><td>3</td><td>MBConv6, k3&times;3</td><td>112&times;112</td><td>24</td><td>2</td></tr>
        <tr><td>4</td><td>MBConv6, k5&times;5</td><td>56&times;56</td><td>40</td><td>2</td></tr>
        <tr><td>5</td><td>MBConv6, k3&times;3</td><td>28&times;28</td><td>80</td><td>3</td></tr>
        <tr><td>6</td><td>MBConv6, k5&times;5</td><td>14&times;14</td><td>112</td><td>3</td></tr>
        <tr><td>7</td><td>MBConv6, k5&times;5</td><td>14&times;14</td><td>192</td><td>4</td></tr>
        <tr><td>8</td><td>MBConv6, k3&times;3</td><td>7&times;7</td><td>320</td><td>1</td></tr>
        <tr><td>9</td><td>Conv 1&times;1 &amp; Pooling &amp; FC</td><td>7&times;7</td><td>1280</td><td>1</td></tr>
       </table>
       <p>B0 has about <b>5.3M parameters and 0.39B FLOPS</b> and reaches <b>77.1% ImageNet top-1</b> (&sect;4 /
       Table 2). The two stage-1/stage-9 "stem and head" convolutions bracket seven MBConv stages; spatial size
       halves at each downsampling stage (224 &rarr; 112 &rarr; 56 &rarr; 28 &rarr; 14 &rarr; 7) while channels
       grow (32 &rarr; 320 &rarr; 1280).</p>
       <p><b>B0 &rarr; B7: the family.</b> The two-step recipe scales this one baseline. <b>STEP 1</b> fixes
       $\\phi=1$ and grid-searches the proportions once, giving $\\alpha=1.2,\\ \\beta=1.1,\\ \\gamma=1.15$.
       <b>STEP 2</b> holds those fixed and dials $\\phi$ up: $\\phi$ from $1$ to $7$ produces
       <b>EfficientNet-B1 &hellip; B7</b>. Each step multiplies every stage's layer count by $d=\\alpha^\\phi$
       (rounded to whole layers) and every channel count by $w=\\beta^\\phi$, and enlarges the input resolution by
       $r=\\gamma^\\phi$ &mdash; so the input grows from B0's $224$ px (e.g. $\\sim240$ at B1, $\\sim260$ at B2,
       $\\sim300$ at B3, on up toward $\\sim600$ at B7, following $224\\cdot\\gamma^\\phi$). The block structure
       (which MBConv, which kernel) is unchanged; only depth, width, and resolution scale. The top of the family,
       <b>B7</b>, reaches <b>84.3% top-1, while being 8.4&times; smaller and 6.1&times; faster than the best prior
       ConvNet</b> (Abstract).</p>`,
    symbols: [
      { sym: "$\\mathcal{N}$", desc: "the whole <b>network</b> (the ConvNet), written as a composition of its stages." },
      { sym: "$\\bigodot$", desc: "<b>compose in order</b>: chain the stages back-to-back, output of one feeding the next." },
      { sym: "$\\mathcal{F}_i$", desc: "the <b>layer pattern of stage $i$</b> (e.g. its convolutional block); repeated $L_i$ times within the stage." },
      { sym: "$L_i$", desc: "the <b>number of layers</b> (repeats) in stage $i$. <b>Depth</b> scaling multiplies every $L_i$." },
      { sym: "$H_i, W_i$", desc: "the <b>height and width</b> (spatial size) of stage $i$'s feature map. <b>Resolution</b> scaling multiplies these." },
      { sym: "$C_i$", desc: "the <b>number of channels</b> in stage $i$'s feature map. <b>Width</b> scaling multiplies this." },
      { sym: "$d$", desc: "the <b>depth multiplier</b>: how many times more layers, $d = \\alpha^\\phi$." },
      { sym: "$w$", desc: "the <b>width multiplier</b>: how many times more channels, $w = \\beta^\\phi$." },
      { sym: "$r$", desc: "the <b>resolution multiplier</b>: how many times bigger the input image (per side), $r = \\gamma^\\phi$." },
      { sym: "$\\phi$", desc: "the <b>compound coefficient</b> (“phi”): the single dial the user turns. Larger $\\phi$ = bigger, more accurate, more expensive network." },
      { sym: "$\\alpha, \\beta, \\gamma$", desc: "the fixed <b>base proportions</b> for depth, width, resolution (“alpha, beta, gamma”), found by a small grid search ($\\alpha=1.2,\\ \\beta=1.1,\\ \\gamma=1.15$ for EfficientNet)." },
      { sym: "FLOPS", desc: "a plain term: <b>FLoating-point OPerationS</b>, the count of multiply/add operations &mdash; a hardware-independent proxy for how expensive the network is to run." },
      { sym: "$\\alpha\\cdot\\beta^2\\cdot\\gamma^2 \\approx 2$", desc: "the <b>balance constraint</b>: the per-step FLOPS growth factor is held near $2$, so each $+1$ in $\\phi$ roughly doubles the compute." }
    ],
    formula: `$$ \\mathcal{N} \\;=\\; \\bigodot_{i=1\\ldots s}\\ \\mathcal{F}_i^{L_i}\\big(X_{\\langle H_i,\\,W_i,\\,C_i\\rangle}\\big) $$
<p class="cap">A ConvNet as a chain of $s$ stages; stage $i$ repeats its layer pattern $\\mathcal{F}_i$ a total of $L_i$ times on a feature map of size $H_i\\times W_i$ with $C_i$ channels (Eqn. 1, \\S3.1).</p>
$$ \\max_{d,\\,w,\\,r}\\ \\ \\text{Accuracy}\\big(\\mathcal{N}(d,w,r)\\big) $$
$$ \\text{s.t. } \\ \\mathcal{N}(d,w,r) = \\bigodot_{i=1\\ldots s}\\ \\hat{\\mathcal{F}}_i^{\\,d\\cdot\\hat{L}_i}\\big(X_{\\langle r\\cdot\\hat{H}_i,\\ r\\cdot\\hat{W}_i,\\ w\\cdot\\hat{C}_i\\rangle}\\big) $$
$$ \\text{Memory}(\\mathcal{N}) \\le \\text{target\\_memory}, \\qquad \\text{FLOPS}(\\mathcal{N}) \\le \\text{target\\_flops} $$
<p class="cap">Model scaling as a constrained optimization: pick one depth/width/resolution triple $(d,w,r)$ that maximizes accuracy of the FIXED baseline $\\hat{\\mathcal{F}}_i,\\hat{L}_i,\\hat{H}_i,\\hat{W}_i,\\hat{C}_i$, subject to memory and compute (FLOPS) budgets (Eqn. 2, \\S3.1).</p>
$$ \\text{depth: } d = \\alpha^{\\phi} \\qquad \\text{width: } w = \\beta^{\\phi} \\qquad \\text{resolution: } r = \\gamma^{\\phi} $$
$$ \\text{s.t. } \\ \\alpha\\cdot\\beta^{2}\\cdot\\gamma^{2} \\approx 2, \\qquad \\alpha \\ge 1,\\ \\beta \\ge 1,\\ \\gamma \\ge 1 $$
<p class="cap">The compound scaling rule: one dial $\\phi$ raises three fixed bases, so $(d,w,r)$ grow in locked proportion; the balance constraint pins the per-step compute growth near $2$ (Eqn. 3, \\S3.3). Grid search gives $\\alpha=1.2,\\ \\beta=1.1,\\ \\gamma=1.15$ (\\S4).</p>
$$ \\text{FLOPS multiplier} \\;=\\; d\\cdot w^{2}\\cdot r^{2} \\;=\\; \\alpha^{\\phi}\\cdot(\\beta^{\\phi})^{2}\\cdot(\\gamma^{\\phi})^{2} \\;=\\; \\big(\\alpha\\cdot\\beta^{2}\\cdot\\gamma^{2}\\big)^{\\phi} \\;\\approx\\; 2^{\\phi} $$
<p class="cap">FLOPS scaling (\\S3.3): a regular convolution's cost is linear in depth ($d$) but quadratic in width ($w^2$) and resolution ($r^2$); doubling depth doubles FLOPS, doubling width OR resolution quadruples them. Under the constraint, total compute grows by about $2^\\phi$ &mdash; each $+1$ in $\\phi$ roughly doubles the FLOPS.</p>`,
    whatItDoes:
      `<p>The equation says: <b>turn one dial $\\phi$, and all three knobs move together</b>. Depth becomes
       $\\alpha^\\phi$ times deeper, width $\\beta^\\phi$ times wider, resolution $\\gamma^\\phi$ times larger.
       Because each is the same exponent $\\phi$ on its own fixed base, the three grow in a <b>locked
       proportion</b> &mdash; never one without the others.</p>
       <p>The constraint $\\alpha\\cdot\\beta^2\\cdot\\gamma^2\\approx 2$ controls the <b>cost</b>: since FLOPS
       scale like $d\\cdot w^2\\cdot r^2 = (\\alpha\\cdot\\beta^2\\cdot\\gamma^2)^\\phi$, holding that product
       near $2$ means the network's compute grows by about $2^\\phi$. The conditions $\\alpha,\\beta,\\gamma\\ge1$
       just say "scaling only grows things, never shrinks them."</p>`,
    derivation:
      `<p><b>Why the cost multiplier is $(\\alpha\\cdot\\beta^2\\cdot\\gamma^2)^\\phi$.</b> Take one convolutional
       layer. Its FLOPS are (roughly) the number of output positions times the work per position:</p>
       <p>$$ \\text{FLOPS}_{\\text{layer}} \\ \\propto \\ \\underbrace{(H\\cdot W)}_{\\text{output area}} \\ \\cdot\\
        \\underbrace{C_{\\text{in}}\\cdot C_{\\text{out}}}_{\\text{channel pairs}} \\ \\cdot\\
        \\underbrace{k^2}_{\\text{kernel}}. $$</p>
       <p>Now apply the three multipliers and track each factor:</p>
       <ul class="steps">
        <li><b>Depth ($d$):</b> $d$ times as many such layers &rArr; total FLOPS scale by $d$ &mdash;
        <b>linear</b>.</li>
        <li><b>Resolution ($r$):</b> height and width each scale by $r$, so the area $H\\cdot W$ scales by
        $r^2$ &mdash; <b>quadratic</b>.</li>
        <li><b>Width ($w$):</b> both $C_{\\text{in}}$ and $C_{\\text{out}}$ scale by $w$, so the channel-pair
        term $C_{\\text{in}}\\cdot C_{\\text{out}}$ scales by $w^2$ &mdash; <b>quadratic</b>.</li>
       </ul>
       <p>Multiply the three independent factors: total FLOPS scale by $d\\cdot w^2\\cdot r^2$. Substitute
       Eqn. 3 ($d=\\alpha^\\phi,\\ w=\\beta^\\phi,\\ r=\\gamma^\\phi$):</p>
       <p>$$ d\\cdot w^2\\cdot r^2 \\;=\\; \\alpha^\\phi\\cdot(\\beta^\\phi)^2\\cdot(\\gamma^\\phi)^2
        \\;=\\; \\big(\\alpha\\cdot\\beta^2\\cdot\\gamma^2\\big)^{\\phi}. $$</p>
       <p>So if you force $\\alpha\\cdot\\beta^2\\cdot\\gamma^2\\approx 2$, the cost is $\\approx 2^\\phi$ &mdash;
       exactly the clean "each $+1$ in $\\phi$ doubles the FLOPS" rule the paper wanted. The constraint is not a
       guess; it falls straight out of the FLOPS accounting. (There is no separate concept lesson for this
       arithmetic, so we derive it in full here.)</p>`,
    example:
      `<p>Work the paper's own coefficients by hand. EfficientNet uses $\\alpha=1.2$, $\\beta=1.1$, $\\gamma=1.15$
       (the grid-search result in &sect;4). First <b>check the constraint</b>:</p>
       <ul class="steps">
        <li>$\\beta^2 = 1.1^2 = 1.21$, and $\\gamma^2 = 1.15^2 = 1.3225$.</li>
        <li>$\\alpha\\cdot\\beta^2\\cdot\\gamma^2 = 1.2 \\times 1.21 \\times 1.3225 = 1.9203\\ldots \\approx 2.$
        ✓ (close to $2$, as required.)</li>
       </ul>
       <p>Now <b>scale to $\\phi = 2$</b> (about the EfficientNet-B2 level). Apply Eqn. 3 to each knob:</p>
       <table class="extable">
        <caption>One dial $\\phi = 2$, three knobs (Eqn. 3), with $\\alpha=1.2,\\ \\beta=1.1,\\ \\gamma=1.15$.</caption>
        <thead>
         <tr><th>knob</th><th>base</th><th>multiplier $= \\text{base}^\\phi$</th><th class="num">value</th><th class="num">FLOPS contribution</th></tr>
        </thead>
        <tbody>
         <tr><td class="row-h">depth $d$</td><td>$\\alpha=1.2$</td><td>$1.2^2$</td><td class="num">1.4400</td><td class="num">$d = 1.4400$ (linear)</td></tr>
         <tr><td class="row-h">width $w$</td><td>$\\beta=1.1$</td><td>$1.1^2$</td><td class="num">1.2100</td><td class="num">$w^2 = 1.4641$ (squared)</td></tr>
         <tr><td class="row-h">resolution $r$</td><td>$\\gamma=1.15$</td><td>$1.15^2$</td><td class="num">1.3225</td><td class="num">$r^2 = 1.7490$ (squared)</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Read the multipliers.</b> $d = 1.44$ (~44% more layers), $w = 1.21$ (~21% more channels),
        $r = 1.3225$ (~32% bigger per side). From B0's $224$ px that is $224 \\times 1.3225 \\approx 296$ px.</li>
        <li><b>Cost check.</b> FLOPS multiplier $= d\\cdot w^2\\cdot r^2
        = 1.4400 \\times 1.4641 \\times 1.7490 \\approx 3.687$ (multiply the last column).</li>
        <li><b>Compare to the rule.</b> $2^\\phi = 2^2 = 4$ &mdash; close; the small gap is because the product
        $\\alpha\\beta^2\\gamma^2 = 1.92$, not exactly $2$ (indeed $1.92^2 \\approx 3.687$).</li>
       </ul>
       <p>So one dial ($\\phi=2$) turned into "44% deeper, 21% wider, 32% higher resolution, ~3.7&times; the
       compute." These exact numbers are recomputed in the notebook's first cell so you can check the
       arithmetic by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build (or take) a small baseline net B0</b> at $\\phi = 0$: depth $d=1$, width $w=1$,
        resolution $r=1$. (EfficientNet's B0 was itself found by neural architecture search; here we use any
        tiny CNN as the stand-in.)</li>
        <li><b>STEP 1 &mdash; find the proportions.</b> Fix $\\phi=1$ ("assume twice the resources") and do a
        small grid search over $\\alpha,\\beta,\\gamma$ subject to $\\alpha\\cdot\\beta^2\\cdot\\gamma^2\\approx2$.
        The paper's result: $\\alpha=1.2,\\ \\beta=1.1,\\ \\gamma=1.15$.</li>
        <li><b>STEP 2 &mdash; scale up.</b> Hold $\\alpha,\\beta,\\gamma$ fixed and dial $\\phi$ up to get
        $d=\\alpha^\\phi,\\ w=\\beta^\\phi,\\ r=\\gamma^\\phi$. $\\phi=1\\ldots7$ gives EfficientNet-B1&hellip;B7.</li>
        <li><b>Apply the multipliers</b> to the baseline: round $d\\times L_i$ to whole layers per stage, scale
        each channel count by $w$, and feed images resized by $r$.</li>
        <li><b>Ablate:</b> spend the <i>same</i> FLOPS budget on a single dimension (all depth, or all width, or
        all resolution) and compare to the compound split &mdash; compound should win at equal cost.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): <b>"Our EfficientNet-B7 achieves state-of-the-art 84.3% top-1 accuracy on
       ImageNet, while being 8.4x smaller and 6.1x faster on inference than the best existing ConvNet."</b> The
       baseline <b>EfficientNet-B0</b> reaches <b>77.1% top-1</b> with about <b>5.3M parameters and 0.39B
       FLOPS</b> (&sect;4 / Table 2). The <b>ablation</b> (Fig. 8 / Table 7) shows compound scaling beats
       scaling any single dimension &mdash; the paper reports up to about <b>2.5% higher accuracy at the same
       FLOPS</b>.</p>
       <p><i>These are the paper's reported figures, quoted from the abstract and &sect;4. The numbers in the
       CODEVIZ panel below are from our own tiny arithmetic/training run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> This Track-B build does <b>not</b> retrain ImageNet; what you can
       check exactly is the <b>scaling arithmetic and FLOPS accounting</b>. The primary metric is the
       <b>measured FLOPS multiplier vs $\\phi$</b> on your toy net &mdash; count real conv/linear multiply-adds
       at each $\\phi$ and divide by the $\\phi=0$ baseline. The target it must track is the predicted
       $(\\alpha\\beta^2\\gamma^2)^\\phi \\approx 2^\\phi$. The "no-skill" reference is treating all three knobs
       as linear (so you'd wrongly predict $\\alpha\\beta\\gamma$ per step): if your measured curve matches that
       instead of $\\approx 2^\\phi$, the quadratic width/resolution terms are mis-counted. The paper's own
       benchmark is <b>ImageNet top-1</b> (B0 <b>77.1%</b>, B7 <b>84.3%</b>), with the ablation measured at
       <b>equal FLOPS</b>.</p>
       <p><b>Sanity checks BEFORE any scaling sweep.</b> (i) Constraint check: assert
       $\\alpha\\cdot\\beta^2\\cdot\\gamma^2 = 1.2\\times 1.21\\times 1.3225 \\approx 1.92$ (close to $2$).
       (ii) Worked-example check: <code>scale(2)</code> must return $d=1.44,\\ w=1.21,\\ r=1.3225$, and
       $d\\,w^2 r^2 \\approx 3.687$ (vs $2^2 = 4$). (iii) Identity check: <code>scale(0)</code> $= (1,1,1)$ and
       the built net at $\\phi=0$ must equal the baseline exactly. (iv) Counter check: hand-compute FLOPS for a
       single <code>Conv2d</code> ($C_{\\text{in}}C_{\\text{out}}k^2 \\cdot H_{\\text{out}}W_{\\text{out}}$) and
       confirm the hook-based counter agrees on one layer before trusting the whole net.</p>
       <p><b>Expected range.</b> A correct counter should give a measured multiplier of roughly
       <b>$1.00,\\ 1.9,\\ 4.4,\\ 8.2\\times$</b> at $\\phi = 0,1,2,3$ &mdash; sitting a touch <i>under</i>
       $1,2,4,8$ because the base is $1.92 \\lt 2$. (These toy-net numbers are a rule of thumb for this build,
       not a paper claim.) If your ratios land far from $\\approx 2^\\phi$ (e.g. $1,2,3,4$ &mdash; linear, or
       $1,4,16$ &mdash; over-squared), it's an arithmetic bug, not tuning. The accuracy claims you can only
       quote, not reproduce: B0 $77.1\\%$, B7 $84.3\\%$, and up to $\\sim 2.5\\%$ accuracy gain for compound at
       equal FLOPS (Fig. 8 / Table 7).</p>
       <p><b>Ablation &mdash; prove compound scaling earns its keep.</b> The central idea is <b>balancing all
       three dimensions</b>. Spend the <i>same</i> FLOPS budget (e.g. $\\phi=2$, $\\approx 4\\times$) on a single
       knob &mdash; depth-only ($d = (\\alpha\\beta^2\\gamma^2)^\\phi$, $w=r=1$), width-only, or resolution-only
       &mdash; and compare. At equal FLOPS the single-dim variants land lopsided cost/shape profiles (width-only
       explodes parameters via $w^2$; resolution-only adds almost none), and on a real training run the paper
       reports compound wins by up to $\\sim 2.5\\%$ accuracy. If single-dim scaling matched compound, balance
       wouldn't matter &mdash; contradicting Observation 2.</p>
       <p><b>Failure signals &amp; what they mean.</b> <b>Measured multiplier grows linearly</b> ($1,2,3,4$) =
       you scaled width/resolution but only multiplied FLOPS by $w$ and $r$ instead of $w^2$ and $r^2$.
       <b>Multiplier explodes</b> ($1,4,16$) = you squared depth too, or squared the resolution side-length
       twice. <b>Built net doesn't match the baseline at $\\phi=0$</b> = an off-by-one in layer rounding
       (<code>round(L*d)</code> must give $L$ when $d=1$). <b>Channel counts come out non-multiples / tiny</b> =
       forgot the <code>round_ch</code> snap-to-8 or applied $w$ to layers instead of channels. <b>Resolution
       wrong by a square factor</b> = treated $r$ as a per-pixel (area) multiplier instead of per-side. In the
       CODEVIZ panel a correct build is the green measured curve hugging the blue $2^\\phi$ line; a broken FLOPS
       count diverges from it.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper, and the headline result is an ImageNet-scale training
       run we will <b>not</b> reproduce. What we <i>can</i> own exactly is the <b>scaling arithmetic and the
       FLOPS accounting</b>, which is the paper's actual contribution. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.BatchNorm2d</code>, <code>nn.AdaptiveAvgPool2d</code>, and a FLOPS/parameter counter we write in
       a few lines. <b>Build by hand:</b> a <code>scale(phi)</code> function implementing Eqn. 3, a tiny
       baseline CNN whose per-stage depths and channel counts get multiplied by $d$ and $w$, and the
       <b>ablation</b> that pours an equal FLOPS budget into a single dimension. We verify the FLOPS multiplier
       matches $(\\alpha\\beta^2\\gamma^2)^\\phi$, and recompute the worked example. The FLOPS derivation is done
       in full in this lesson (no separate concept owner).</p>`,
    pitfalls:
      `<ul>
        <li><b>Squaring width AND resolution, but not depth.</b> The single most common arithmetic slip is
        treating all three the same. Depth is <b>linear</b> in FLOPS ($d$); width and resolution are
        <b>quadratic</b> ($w^2$ and $r^2$). That is exactly why the constraint is
        $\\alpha\\cdot\\beta^2\\cdot\\gamma^2$ and not $\\alpha\\cdot\\beta\\cdot\\gamma$.</li>
        <li><b>Resolution scales per side, not per pixel.</b> $r$ multiplies the side length; the pixel count
        (and the area term in FLOPS) scales by $r^2$. Going from 224 to 320 px is $r\\approx1.43$, which is
        $r^2\\approx2.04\\times$ the pixels.</li>
        <li><b>Forgetting to round depth to whole layers.</b> $d\\times L_i$ rarely lands on an integer; you
        must round to a valid layer count per stage. The compute estimate uses the real $d$, but the built net
        uses the rounded layers.</li>
        <li><b>Misreading $\\phi$ as the FLOPS multiplier.</b> $\\phi$ is the <i>exponent</i>. The FLOPS
        multiplier is $\\approx 2^\\phi$ (so $\\phi=3$ is about $8\\times$, not $3\\times$).</li>
        <li><b>Grid-searching $\\alpha,\\beta,\\gamma$ at large $\\phi$.</b> The paper searches the proportions
        <b>once</b> at $\\phi=1$ (cheap), then fixes them and only dials $\\phi$. Re-searching at every size
        would be the "tedious manual tuning" the method exists to avoid.</li>
      </ul>`,
    recall: [
      "Write the compound-scaling equation (Eqn. 3) and its constraint from memory.",
      "Why is the constraint $\\alpha\\cdot\\beta^2\\cdot\\gamma^2$ and not $\\alpha\\cdot\\beta\\cdot\\gamma$?",
      "Define $\\phi$, $d$, $w$, $r$ in one sentence each.",
      "State Observation 2 in your own words.",
      "If $\\phi$ goes from 2 to 3, by roughly what factor does the FLOPS budget grow?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a fixed budget of about <b>2&times;</b> the baseline FLOPS. Compare
            spending it as compound scaling ($\\phi=1$ with the paper's $\\alpha,\\beta,\\gamma$) versus pouring
            it <b>all into depth</b>. What are the depth/width/resolution multipliers in each case, and why does
            the compound split tend to win at equal cost?`,
        steps: [
          { do: `Compound, $\\phi=1$: $d=1.2^1=1.2$, $w=1.1^1=1.1$, $r=1.15^1=1.15$. Check cost: $d\\,w^2 r^2 = 1.2\\times1.21\\times1.3225 \\approx 1.92 \\approx 2$.`, why: `One dial moves all three knobs in the balanced proportion the constraint enforces, landing right on the ~2&times; budget.` },
          { do: `Depth-only at the same ~2&times; budget: with $w=r=1$, the cost is just $d$, so $d\\approx2$ (twice as many layers) and $w=r=1$.`, why: `Depth is linear in FLOPS, so the whole 2&times; budget buys one knob: 2&times; depth, nothing for width or resolution.` },
          { do: `Reason about it: the depth-only net feeds the same tiny image into a much deeper stack; Observation 1 says one knob saturates, and Observation 2 says balance is critical.`, why: `Extra layers can't extract detail the small input never had; the compound net adds resolution AND the depth/width to use it.` }
        ],
        answer: `<p><b>Compound ($\\phi=1$):</b> $d=1.2,\\ w=1.1,\\ r=1.15$ (every knob nudged up, total cost
                 $\\approx2\\times$). <b>Depth-only:</b> $d\\approx2,\\ w=1,\\ r=1$ (all budget on layers). At the
                 <i>same</i> FLOPS the compound split usually wins because a single dimension saturates
                 (Observation 1) and balancing all three is what pays off (Observation 2): a deeper net on a
                 still-tiny image has little new signal to extract, while the compound net raises resolution and
                 adds the depth/width needed to exploit it. The paper's Fig. 8 / Table 7 shows up to ~2.5% higher
                 accuracy for compound at equal FLOPS. The CODEVIZ panel reproduces this cost-vs-split contrast on
                 a toy net.</p>`
      },
      {
        q: `Verify the balance constraint and the cost rule for the paper's coefficients. With
            $\\alpha=1.2,\\ \\beta=1.1,\\ \\gamma=1.15$, (a) confirm $\\alpha\\cdot\\beta^2\\cdot\\gamma^2\\approx2$,
            and (b) compute the FLOPS multiplier at $\\phi=3$ and compare it to $2^3$.`,
        steps: [
          { do: `Constraint: $\\beta^2=1.21$, $\\gamma^2=1.3225$, so $\\alpha\\beta^2\\gamma^2 = 1.2\\times1.21\\times1.3225 \\approx 1.920$.`, why: `The grid search targets $\\approx2$; $1.92$ is within the paper's tolerance.` },
          { do: `Cost at $\\phi=3$: FLOPS multiplier $=(\\alpha\\beta^2\\gamma^2)^\\phi = 1.920^3 \\approx 7.08$.`, why: `From the derivation, total FLOPS scale by $(\\alpha\\beta^2\\gamma^2)^\\phi$, not by $\\phi$ itself.` },
          { do: `Compare: $2^3 = 8$. The estimate $7.08$ is a bit under $8$ because the base is $1.92$, slightly below $2$.`, why: `Holding the product near $2$ makes "$+1$ in $\\phi$ ≈ double the FLOPS" hold approximately, not exactly.` }
        ],
        answer: `<p>(a) $\\alpha\\cdot\\beta^2\\cdot\\gamma^2 = 1.2\\times1.21\\times1.3225 \\approx 1.92 \\approx 2$
                 ✓. (b) At $\\phi=3$ the FLOPS multiplier is $1.92^3 \\approx 7.1$, close to $2^3=8$. The small
                 shortfall is exactly because the base is $1.92$ rather than $2$. This is the "each $+1$ in $\\phi$
                 roughly doubles the compute" rule, made concrete.</p>`
      },
      {
        q: `A teammate scales a CNN by setting $w=2$ (double the channels), leaving $d=r=1$, and is surprised the
            FLOPS go up about <b>4&times;</b>, not 2&times;. Explain the factor of 4, and what the compound method
            would have done with that same ~4&times; budget.`,
        steps: [
          { do: `Width touches both ends of every conv: input channels $\\times2$ and output channels $\\times2$.`, why: `A conv connects every input channel to every output channel, so the channel-pair count is $C_{in}\\cdot C_{out}$.` },
          { do: `So the FLOPS scale by $w^2 = 2^2 = 4$, not $w=2$.`, why: `Width is quadratic in FLOPS — that $w^2$ term is why $\\beta$ is squared in the constraint.` },
          { do: `Compound at the matching budget: $(\\alpha\\beta^2\\gamma^2)^\\phi \\approx 2^\\phi = 4$ means $\\phi=2$, giving $d=1.44,\\ w=1.21,\\ r=1.32$.`, why: `The same ~4&times; compute, but split across all three knobs in the balanced proportion.` }
        ],
        answer: `<p>Doubling width multiplies <i>both</i> the input- and output-channel counts, and a conv's cost
                 depends on their product $C_{in}\\cdot C_{out}$, so FLOPS scale by $w^2 = 4$, not $2$. That $w^2$
                 is precisely why $\\beta$ is squared in $\\alpha\\cdot\\beta^2\\cdot\\gamma^2$. With the same
                 ~4&times; budget, compound scaling uses $\\phi=2$: $d=1.44,\\ w=1.21,\\ r=1.32$ &mdash; a balanced
                 growth rather than 4&times; the compute poured into channels alone.</p>`
      }
    ]
  });

  window.CODE["paper-efficientnet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: the paper's headline is an ImageNet run we do <b>not</b> reproduce; the real contribution we
       <i>can</i> own is the <b>scaling arithmetic + FLOPS accounting</b>. We write <code>scale(phi)</code> for
       Eqn. 3 ($d=\\alpha^\\phi,\\ w=\\beta^\\phi,\\ r=\\gamma^\\phi$), build a tiny baseline CNN whose per-stage
       layer counts and channel widths get multiplied by $d$ and $w$, and <b>count its real FLOPS and
       parameters</b> with a few-line counter (using <code>nn.Conv2d</code> shapes). We verify the measured
       FLOPS multiplier matches $(\\alpha\\beta^2\\gamma^2)^\\phi \\approx 2^\\phi$, recompute the worked example
       ($\\phi=2 \\to d=1.44,\\ w=1.21,\\ r=1.3225$), and run the <b>ablation</b>: spend the same budget on
       depth-only vs compound and compare. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# ===================================================================
# 0. The compound-scaling rule (Eqn. 3) + the worked example.
# ===================================================================
ALPHA, BETA, GAMMA = 1.2, 1.1, 1.15            # paper's grid-search result (sec.4)
print("constraint  alpha*beta^2*gamma^2 =",
      round(ALPHA * BETA**2 * GAMMA**2, 4), "  (target ~2)")

def scale(phi):
    """Eqn. 3: depth d=alpha^phi, width w=beta^phi, resolution r=gamma^phi."""
    d = ALPHA ** phi
    w = BETA  ** phi
    r = GAMMA ** phi
    return d, w, r

d, w, r = scale(2)                              # the lesson's worked example, phi=2
print("phi=2 ->  d =", round(d,4), " w =", round(w,4), " r =", round(r,4))
print("  -> ~%d%% more layers, ~%d%% more channels, ~%d%% bigger per side"
      % (round((d-1)*100), round((w-1)*100), round((r-1)*100)))
flops_mult = d * w**2 * r**2                    # depth linear, width & resolution quadratic
print("  predicted FLOPS multiplier d*w^2*r^2 =", round(flops_mult,3),
      " vs 2^phi =", 2**2)
# constraint alpha*beta^2*gamma^2 = 1.9203 ; phi=2 -> d=1.44 w=1.21 r=1.3225 ; FLOPS~3.687


# ===================================================================
# 1. A tiny baseline CNN (our stand-in for "B0", phi=0).
#    Per-stage (out_channels, num_layers); width multiplies channels,
#    depth multiplies num_layers, resolution sets the input size.
# ===================================================================
BASE_STAGES = [(24, 2), (48, 2), (96, 3)]       # (channels, layers) at phi=0
BASE_RES    = 48                                 # baseline input side (px)

def round_ch(c, w):                              # keep channels a multiple of 8
    return max(8, int(round(c * w / 8)) * 8)

def build(phi=0.0, depth_only=False, res_only=False, width_only=False):
    d, w, r = scale(phi)
    if depth_only:  d, w, r = (ALPHA*BETA**2*GAMMA**2)**phi, 1.0, 1.0   # all budget -> depth
    if width_only:  w = ((ALPHA*BETA**2*GAMMA**2)**phi) ** 0.5; d, r = 1.0, 1.0
    if res_only:    r = ((ALPHA*BETA**2*GAMMA**2)**phi) ** 0.5; d, w = 1.0, 1.0
    layers, in_ch = [], 3
    for ch, L in BASE_STAGES:
        out_ch  = round_ch(ch, w)
        n_layer = max(1, int(round(L * d)))      # depth multiplier, rounded to whole layers
        for j in range(n_layer):
            stride = 2 if j == 0 else 1          # downsample once per stage
            layers += [nn.Conv2d(in_ch, out_ch, 3, stride=stride, padding=1, bias=False),
                       nn.BatchNorm2d(out_ch), nn.ReLU(inplace=True)]
            in_ch = out_ch
    net = nn.Sequential(*layers, nn.AdaptiveAvgPool2d(1),
                        nn.Flatten(), nn.Linear(in_ch, 10))
    res = max(8, int(round(BASE_RES * r)))
    return net, res

# --- A few-line FLOPS counter for Conv2d + Linear (multiply-adds). ---
def count(net, res):
    flops, params = 0, sum(p.numel() for p in net.parameters())
    x = torch.zeros(1, 3, res, res)
    hooks = []
    def conv_hook(m, inp, out):
        nonlocal flops
        oh, ow = out.shape[2], out.shape[3]
        flops += m.in_channels * m.out_channels * m.kernel_size[0] * m.kernel_size[1] * oh * ow
    def lin_hook(m, inp, out):
        nonlocal flops
        flops += m.in_features * m.out_features
    for m in net.modules():
        if isinstance(m, nn.Conv2d):  hooks.append(m.register_forward_hook(conv_hook))
        if isinstance(m, nn.Linear):  hooks.append(m.register_forward_hook(lin_hook))
    net.eval()
    with torch.no_grad(): net(x)
    for h in hooks: h.remove()
    return flops, params

# ===================================================================
# 2. Measure FLOPS as we dial phi -> does the multiplier track 2^phi?
# ===================================================================
base_net, base_res = build(phi=0.0)
base_flops, base_params = count(base_net, base_res)
print("\\nbaseline (phi=0):  res=%d  FLOPS=%.2fM  params=%.2fM"
      % (base_res, base_flops/1e6, base_params/1e6))

print("\\nphi  res   FLOPS(M)  measured_x  predicted 2^phi")
for phi in [0, 1, 2, 3]:
    net, res = build(phi=phi)
    f, p = count(net, res)
    print("%2d  %4d   %7.2f    %6.2fx      %5.2f"
          % (phi, res, f/1e6, f/base_flops, 2**phi))
# measured ~ 1.00x, 1.92x, 4.38x, 8.24x  vs  predicted 1, 2, 4, 8 -> tracks ~2^phi.


# ===================================================================
# 3. ABLATION: same compute budget (phi=2 -> ~4x), compound vs single-dim.
# ===================================================================
print("\\nABLATION at phi=2 (same ~4x FLOPS budget):")
for name, kw in [("compound  ", {}),
                 ("depth-only", {"depth_only": True}),
                 ("width-only", {"width_only": True}),
                 ("res-only  ", {"res_only":   True})]:
    net, res = build(phi=2, **kw)
    f, p = count(net, res)
    print("  %s  res=%3d  FLOPS=%6.2fM  params=%6.3fM"
          % (name, res, f/1e6, p/1e6))
# Same FLOPS budget, but compound spreads it across depth+width+resolution;
# the single-dim variants spend it all on one knob (note how params explode for
# width-only and how depth-only/res-only leave channels tiny). This is OUR small
# run -- the paper's accuracy comparison (Fig.8/Table 7) needs full ImageNet training.`
  };

  window.CODEVIZ["paper-efficientnet"] = {
    question: "At a fixed compute (FLOPS) budget, how does compound scaling split the budget across depth/width/resolution vs pouring it all into one dimension?",
    charts: [
      {
        type: "line",
        title: "Measured FLOPS multiplier vs φ (our toy net) tracks ≈ 2^φ",
        xlabel: "compound coefficient φ",
        ylabel: "FLOPS multiplier (× baseline)",
        series: [
          {
            name: "measured (our net)",
            color: "#7ee787",
            points: [[0, 1.0], [1, 1.92], [2, 4.38], [3, 8.24]]
          },
          {
            name: "predicted 2^φ",
            color: "#79c0ff",
            points: [[0, 1.0], [1, 2.0], [2, 4.0], [3, 8.0]]
          }
        ]
      },
      {
        type: "bar",
        title: "Same φ=2 budget: where do the parameters go? (compound vs single-dim)",
        xlabel: "scaling strategy",
        ylabel: "parameters (millions)",
        series: [
          {
            name: "params (M)",
            color: "#d2a8ff",
            points: [["compound", 0.544], ["depth-only", 1.042], ["width-only", 0.918], ["resolution-only", 0.246]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Top: as we dial the compound coefficient φ on a small 3-stage CNN, the measured FLOPS multiplier (green: ~1.00, 1.92, 4.38, 8.24×) climbs right along ≈ 2^φ (blue: 1, 2, 4, 8) — sitting a touch under because the base α·β²·γ² = 1.92, just below 2. Bottom: at a fixed φ=2 (≈ 4× FLOPS) budget, the four strategies land very different parameter counts. Compound (0.54M) splits the spend across depth, width AND resolution — and is the leanest of the three that keep channels meaningful. The single-dimension ablations dump it all on one knob: depth-only (1.04M) stacks many extra conv layers, width-only (0.92M) widens every layer (channels cost ~w²), and resolution-only (0.25M) buys none of those — it just enlarges the image, so it adds almost no parameters but spends its FLOPS on bigger feature maps. We do not retrain ImageNet here, so we show the cost/shape split, not accuracy; the paper's accuracy win for compound is Fig. 8 / Table 7.",
    code: `import torch
import torch.nn as nn

# Reproduce the scaling arithmetic + FLOPS accounting on a toy 3-stage CNN.
ALPHA, BETA, GAMMA = 1.2, 1.1, 1.15
BASE_STAGES = [(24, 2), (48, 2), (96, 3)]
BASE_RES, PROD = 48, ALPHA * BETA**2 * GAMMA**2     # PROD = 1.9203...

def scale(phi): return ALPHA**phi, BETA**phi, GAMMA**phi
def round_ch(c, w): return max(8, int(round(c * w / 8)) * 8)

def build(phi, mode="compound"):
    d, w, r = scale(phi)
    if mode == "depth": d, w, r = PROD**phi, 1.0, 1.0
    if mode == "width": w = (PROD**phi)**0.5; d = r = 1.0
    if mode == "res":   r = (PROD**phi)**0.5; d = w = 1.0
    layers, in_ch = [], 3
    for ch, L in BASE_STAGES:
        out_ch  = round_ch(ch, w)
        n_layer = max(1, int(round(L * d)))
        for j in range(n_layer):
            stride = 2 if j == 0 else 1
            layers += [nn.Conv2d(in_ch, out_ch, 3, stride=stride, padding=1, bias=False),
                       nn.BatchNorm2d(out_ch), nn.ReLU(inplace=True)]
            in_ch = out_ch
    net = nn.Sequential(*layers, nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(in_ch, 10))
    return net, max(8, int(round(BASE_RES * r)))

def count(net, res):
    flops = [0]; params = sum(p.numel() for p in net.parameters()); hooks = []
    def ch(m, i, o): flops[0] += m.in_channels*m.out_channels*m.kernel_size[0]*m.kernel_size[1]*o.shape[2]*o.shape[3]
    def lh(m, i, o): flops[0] += m.in_features*m.out_features
    for m in net.modules():
        if isinstance(m, nn.Conv2d): hooks.append(m.register_forward_hook(ch))
        if isinstance(m, nn.Linear): hooks.append(m.register_forward_hook(lh))
    net.eval()
    with torch.no_grad(): net(torch.zeros(1, 3, res, res))
    for h in hooks: h.remove()
    return flops[0], params

bf, _ = count(*build(0))
print("FLOPS multiplier vs phi:")
for phi in [0, 1, 2, 3]:
    f, _ = count(*build(phi))
    print("  phi=%d  measured=%.2fx  predicted 2^phi=%d" % (phi, f/bf, 2**phi))

print("\\nphi=2 budget split (params in M):")
for mode in ["compound", "depth", "width", "res"]:
    net, res = build(2, mode); f, p = count(net, res)
    print("  %-9s res=%d FLOPS=%.2fM params=%.3fM" % (mode, res, f/1e6, p/1e6))
# measured: phi=0->1.00x, 1->1.92x, 2->4.38x, 3->8.24x (tracks ~2^phi, base 1.92<2).
# params(M): compound 0.544, depth 1.042, width 0.918, res 0.246.
# Our small run -- cost/shape only; the paper's accuracy comparison needs ImageNet.`
  };
})();
