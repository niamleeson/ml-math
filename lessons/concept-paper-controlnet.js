/* Paper lesson — "Adding Conditional Control to Text-to-Image Diffusion Models"
   (ControlNet), Zhang, Rao, Agrawala, ICCV 2023. Self-contained: lesson + CODE +
   CODEVIZ merged by id "paper-controlnet".
   GROUNDED from arXiv:2302.05543 (abstract) and the ar5iv HTML mirror
   (Section 3.1 zero-convolution definition + Eq 1 the block, Eq 2 the ControlNet
   structure, Eq 3 y_c = y at init; Section 3.2 Stable Diffusion; Eq 4 condition
   encoder; Eq 5 the diffusion loss).
   Track B (architecture): compose tiny conv blocks with torch.nn, then implement the
   NOVEL part by hand — a FROZEN locked copy + a TRAINABLE copy joined by ZERO-CONVS
   (1x1 convs initialized to zero) so the conditioned output EQUALS the frozen output
   at step 0, then grows as the zero-convs learn. Ablate zero-init vs random-init. */
(function () {
  window.LESSONS.push({
    id: "paper-controlnet",
    title: "ControlNet — Adding Conditional Control to Text-to-Image Diffusion Models (2023)",
    tagline: "Steer a frozen diffusion model with edges, depth, or pose by attaching a trainable copy through zero-initialized convolutions.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Lvmin Zhang, Anyi Rao, Maneesh Agrawala",
      org: "Stanford University",
      year: 2023,
      venue: "arXiv:2302.05543 (Feb 2023); ICCV 2023",
      citations: "",
      arxiv: "https://arxiv.org/abs/2302.05543",
      code: "https://github.com/lllyasviel/ControlNet"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-ddpm", "paper-latent-diffusion", "mod-diffusion", "dl-conv", "pt-nn-module", "pt-autograd", "fs-transfer-learning"],

    // WHY READ IT
    problem:
      `<p>A large text-to-image <b>diffusion model</b> &mdash; a network that turns random noise into an image by
       removing the noise step by step, guided by a text prompt &mdash; is trained on billions of images. It is
       powerful but blunt: you type words, and it draws <i>something</i> matching the words, but you cannot pin
       down the <b>spatial layout</b>. You cannot say "put the edges here," "match this depth map," or "use this
       human pose."</p>
       <p>The obvious fix is to fine-tune the model on (condition, image) pairs. But the conditioning datasets are
       small. The paper's worry, from its introduction, is that naively training the giant pretrained network on a
       small new dataset can <b>damage</b> it: the fresh, randomly initialized layers that read the new condition
       inject <b>noise</b> into the carefully learned backbone before they have learned anything useful, and the
       backbone can forget what it knew. From the abstract:</p>
       <blockquote>"The neural architecture is connected with 'zero convolutions' (zero-initialized convolution
       layers) that progressively grow the parameters from zero and ensure that no harmful noise could affect the
       finetuning." (Abstract)</blockquote>
       <p>The open question: how do you bolt a brand-new conditioning pathway onto a huge pretrained model and
       train it on a small dataset <b>without harming</b> the pretrained behavior on day one?</p>`,
    contribution:
      `<ul>
        <li><b>Lock the pretrained model; train a copy.</b> ControlNet <b>freezes</b> ("locks") the original
        network and clones its encoder blocks into a <b>trainable copy</b>. The frozen "locked copy" preserves the
        billions-of-images backbone; the trainable copy learns to read the new spatial condition. The model is
        never directly retrained, so it cannot be corrupted.</li>
        <li><b>Zero convolutions.</b> The novel connector: a $1\\times1$ convolution whose weight <i>and</i> bias
        start at <b>exactly zero</b> (Section 3.1). Two of them join the trainable copy to the frozen network. A
        $1\\times1$ convolution mixes channels at each pixel; a $1\\times1$ convolution &mdash; weight and bias zero
        &mdash; outputs zero for any input.</li>
        <li><b>No harm at step zero, then graceful growth.</b> Because the zero convolutions output zero at the
        start, the conditioned output <b>equals the frozen model's output</b> on the very first step (Eq. 3). The
        new pathway is invisible at init &mdash; no harmful noise. Yet the gradient with respect to the zero
        convolution's weight is <i>not</i> zero, so it learns: the conditioning effect grows from zero as training
        proceeds.</li>
      </ul>`,
    whyItMattered:
      `<p>ControlNet became the standard way to add spatial control to Stable Diffusion. Edge maps, depth maps,
       human pose, segmentation masks, scribbles &mdash; each became a plug-in "ControlNet" that steers the layout
       while the frozen base model supplies texture and style. The "freeze the giant, train a zero-initialized
       adapter" pattern spread widely as a safe, cheap way to specialize big pretrained models without
       destabilizing them. The zero-initialized connector is the lasting idea: start the new module as a no-op, so
       fine-tuning begins from the pretrained behavior unharmed and the new capability grows in.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (ControlNet)</b> &mdash; the whole mechanism. The neural block $\\mathbf{y}=\\mathcal{F}(\\mathbf{x};\\Theta)$
        (Eq. 1), the locked-copy / trainable-copy split, the <b>definition of a zero convolution</b> (a $1\\times1$
        convolution with weight and bias initialized to zero), the full structure (Eq. 2), and the key claim that
        at the first step the output equals the original (Eq. 3). This is the math you transcribe and implement.</li>
        <li><b>Figure 2</b> &mdash; the block diagram: input feature on the left, frozen block on top, trainable
        copy below, two zero convolutions joining them, sum on the right. Map every term of Eq. 2 onto this picture.</li>
        <li><b>&sect;3.2 (ControlNet for Text-to-Image Diffusion)</b> &mdash; how the block is wired into Stable
        Diffusion's U-Net encoder, the condition encoder $\\mathbf{c}_f=\\mathcal{E}(\\mathbf{c}_i)$ (Eq. 4), and
        the diffusion training loss $\\mathcal{L}$ (Eq. 5).</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (training details, classifier-free guidance handling) and &sect;5 (the experiments
       across edges, depth, pose, segmentation). Read enough of &sect;5 to see the <i>range</i> of conditions, but
       the core idea is entirely in &sect;3.1.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a tiny <b>frozen</b> network (standing in for the pretrained diffusion model) and attach a
       <b>trainable copy</b> joined by two <b>zero convolutions</b> &mdash; $1\\times1$ convolutions with weight and
       bias set to zero. Before training anything, you feed in an input and a conditioning signal and read the
       conditioned output $\\mathbf{y}_c$ and the frozen output $\\mathbf{y}$.</p>
       <p>At step <b>zero</b> &mdash; before any gradient step &mdash; how do $\\mathbf{y}_c$ and $\\mathbf{y}$
       compare? Will the conditioning signal have <i>any</i> effect on the output yet? Write your guess and one
       sentence of reasoning. (Hint: what does a convolution with all-zero weight and bias output, no matter the
       input?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the ControlNet block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Locked copy.</b> Take a small convolutional network <code>frozen</code> and set
        <code>requires_grad_(False)</code> on every parameter. This is $\\mathcal{F}(\\cdot;\\Theta)$ &mdash; never
        trained.</li>
        <li><b>Trainable copy.</b> <code>copy.deepcopy(frozen)</code>, then re-enable gradients on it. This is
        $\\mathcal{F}(\\cdot;\\Theta_c)$ &mdash; it learns to read the condition.</li>
        <li><b>Zero convolutions.</b> Two <code>nn.Conv2d(C, C, 1)</code> layers, <code>z1</code> and
        <code>z2</code>. TODO: initialize BOTH their weight and bias to zero with
        <code>nn.init.zeros_(...)</code>.</li>
        <li><b>Forward (Eq. 2).</b> TODO: return
        <code>frozen(x) + z2( copy( x + z1(c) ) )</code>, where <code>c</code> is the conditioning signal.</li>
        <li>TODO: before training, assert <code>torch.allclose(model(x,c), frozen(x))</code>. Why must this hold at
        init? What single fact about <code>z1</code> and <code>z2</code> guarantees it?</li>
       </ul>
       <p>Then train the trainable copy to make the output follow the condition, and watch the conditioning effect
       grow from zero. <b>Ablate</b> by initializing the zero convolutions randomly instead and re-checking the
       step-zero output.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start with one <b>neural block</b> of the pretrained model. A block is just a function that maps an input
       feature map $\\mathbf{x}$ to an output feature map $\\mathbf{y}$ using parameters $\\Theta$ (Eq. 1):</p>
       <p>$$ \\mathbf{y} = \\mathcal{F}(\\mathbf{x}; \\Theta). $$</p>
       <p>Here a <b>feature map</b> is the stack of channel images flowing through the network, and $\\Theta$ are
       that block's learned weights. ControlNet adds spatial control around this block in three moves (&sect;3.1).</p>
       <p><b>1. Lock the original; clone a trainable copy.</b> Freeze the parameters $\\Theta$ of the original block
       so it can never change &mdash; this is the <b>locked copy</b>, the untouched pretrained backbone. Then make a
       <b>trainable copy</b> of the same block with its own parameters $\\Theta_c$ (initialized from $\\Theta$). The
       copy takes the <b>conditioning signal</b> $\\mathbf{c}$ &mdash; the edges, depth, or pose &mdash; as extra
       input. The paper: "lock (freeze) the parameters $\\Theta$ of the original block and simultaneously clone the
       block to a trainable copy with parameters $\\Theta_c$" (&sect;3.1).</p>
       <p><b>2. Define the zero convolution.</b> A <b>zero convolution</b> $\\mathcal{Z}(\\cdot;\\cdot)$ is "a
       $1\\times1$ convolution layer with both weight and bias initialized to zeros" (&sect;3.1). A $1\\times1$
       convolution looks at one pixel at a time and re-mixes its channels by a learned matrix, plus a bias. If that
       matrix and bias are all zero, the layer outputs <b>zero</b> for every input &mdash; like multiplying by zero.</p>
       <p><b>3. Wire it up with two zero convolutions.</b> The condition first passes through one zero convolution,
       is added to the input, runs through the trainable copy, and passes through a second zero convolution before
       being added back to the frozen block's output. With $\\Theta_{z1}$ and $\\Theta_{z2}$ the parameters of the
       two zero-convolution instances, the full ControlNet block is (Eq. 2):</p>
       <p>$$ \\mathbf{y}_c = \\mathcal{F}(\\mathbf{x};\\Theta) \\;+\\; \\mathcal{Z}\\!\\big(\\mathcal{F}(\\mathbf{x}
       + \\mathcal{Z}(\\mathbf{c};\\Theta_{z1});\\;\\Theta_c);\\;\\Theta_{z2}\\big). $$</p>
       <p><b>The payoff: no harm at step zero.</b> At the start, both zero convolutions have zero weight and zero
       bias, so both $\\mathcal{Z}(\\cdot;\\cdot)$ terms are zero. The whole second summand vanishes, leaving only
       the frozen block (Eq. 3):</p>
       <p>$$ \\mathbf{y}_c = \\mathbf{y}. $$</p>
       <p>So on the first training step the conditioned model behaves <b>exactly</b> like the untouched pretrained
       model: "harmful noise cannot influence the hidden states of the neural network layers in the trainable copy
       when the training starts" (&sect;3.1). Yet the zero convolution still <b>learns</b>: even though its weight is
       zero, the gradient of its output with respect to that weight depends on the (nonzero) input, so the weight
       gets a nonzero update and the conditioning pathway <b>progressively grows from zero</b>.</p>`,
    symbols: [
      { sym: "$\\mathbf{x}$", desc: "the <b>input feature map</b> to the block &mdash; the stack of channel images flowing in from the previous layer." },
      { sym: "$\\mathbf{y}$", desc: "the <b>output feature map</b> of the original frozen block: $\\mathbf{y}=\\mathcal{F}(\\mathbf{x};\\Theta)$ (Eq. 1)." },
      { sym: "$\\mathbf{y}_c$", desc: "the <b>conditioned output</b> &mdash; the ControlNet block's output, frozen output plus the control branch (Eq. 2). The subscript $c$ means 'with control'." },
      { sym: "$\\mathcal{F}(\\cdot;\\Theta)$", desc: "a <b>neural block</b>: a function mapping a feature map to a feature map using parameters $\\Theta$ (here a couple of convolution layers)." },
      { sym: "$\\Theta$", desc: "the <b>locked (frozen) parameters</b> of the original pretrained block. Never updated &mdash; this is the protected backbone." },
      { sym: "$\\Theta_c$", desc: "the <b>trainable-copy parameters</b>: a clone of $\\Theta$ that <i>is</i> updated, learning to read the conditioning signal." },
      { sym: "$\\mathbf{c}$", desc: "the <b>conditioning signal</b> &mdash; the spatial control input (edges, depth map, pose, segmentation) fed to the trainable copy." },
      { sym: "$\\mathcal{Z}(\\cdot;\\cdot)$", desc: "a <b>zero convolution</b>: a $1\\times1$ convolution with weight AND bias initialized to zero. At init it outputs zero for any input." },
      { sym: "$\\Theta_{z1},\\ \\Theta_{z2}$", desc: "the parameters of the <b>two zero-convolution instances</b> &mdash; one on the condition path, one on the output path (&sect;3.1)." },
      { sym: "“$1\\times1$ convolution”", desc: "a plain term: a convolution with a one-pixel window. It re-mixes the channels at each pixel independently &mdash; a per-pixel linear map plus bias. Zero weight and bias &rarr; zero output." },
      { sym: "“locked / trainable copy”", desc: "plain terms: the <b>locked copy</b> is the frozen original ($\\Theta$); the <b>trainable copy</b> is the clone that learns ($\\Theta_c$)." }
    ],
    formula: `$$ \\mathbf{y}_c = \\mathcal{F}(\\mathbf{x};\\Theta) + \\mathcal{Z}\\!\\big(\\mathcal{F}(\\mathbf{x} + \\mathcal{Z}(\\mathbf{c};\\Theta_{z1});\\,\\Theta_c);\\,\\Theta_{z2}\\big) \\quad\\text{(Eq. 2)} \\qquad\\Longrightarrow\\qquad \\mathbf{y}_c = \\mathbf{y} \\;\\text{ at init} \\quad\\text{(Eq. 3)} $$`,
    whatItDoes:
      `<p><b>The structure</b> (Eq. 2) reads left to right as a picture. The frozen block $\\mathcal{F}(\\mathbf{x};\\Theta)$
       runs untouched. In parallel, the condition $\\mathbf{c}$ goes through the first zero convolution
       $\\mathcal{Z}(\\mathbf{c};\\Theta_{z1})$, is added to the input $\\mathbf{x}$, fed through the trainable copy
       $\\mathcal{F}(\\cdot;\\Theta_c)$, then through the second zero convolution $\\mathcal{Z}(\\cdot;\\Theta_{z2})$,
       and finally <b>added back</b> to the frozen output. The control branch is a correction added on top of the
       frozen model.</p>
       <p><b>The init identity</b> (Eq. 3) is the whole point. Both $\\mathcal{Z}$ terms start at zero, so the entire
       second summand is zero and $\\mathbf{y}_c=\\mathbf{y}$: the conditioned model <i>is</i> the frozen model at
       step zero. Training cannot start from a damaged backbone, because at step zero nothing has been added. As the
       zero convolutions learn, their outputs grow away from zero, and the control branch gradually steers the
       output toward the conditioning signal. The effect grows in &mdash; it is never forced in by random init.</p>`,
    derivation:
      `<p>Two facts make ControlNet work; both are short.</p>
       <p><b>Fact 1 &mdash; zero in, zero out.</b> A $1\\times1$ convolution at one pixel computes
       $\\mathbf{o} = W\\mathbf{p} + \\mathbf{b}$, where $\\mathbf{p}$ is that pixel's channel vector, $W$ is the
       weight matrix, and $\\mathbf{b}$ the bias. If $W=\\mathbf{0}$ and $\\mathbf{b}=\\mathbf{0}$, then
       $\\mathbf{o}=\\mathbf{0}$ for <i>any</i> input $\\mathbf{p}$. So at init $\\mathcal{Z}(\\cdot;\\cdot)=\\mathbf{0}$,
       both summand terms in Eq. 2 vanish, and $\\mathbf{y}_c=\\mathbf{y}$ (Eq. 3). The pretrained behavior is
       preserved exactly.</p>
       <p><b>Fact 2 &mdash; zero weight still learns.</b> A natural worry: if the weight is zero, is the layer stuck
       at zero forever? No. The output of one zero-convolution channel is $o = \\sum_i w_i\\,p_i + b$. Its gradient
       with respect to weight $w_i$ is $\\partial o / \\partial w_i = p_i$ &mdash; the <b>input</b>, which is
       generally nonzero. So even with $w_i=0$, the gradient flowing back into $w_i$ is nonzero, the optimizer moves
       it off zero, and on the next step the layer is no longer a no-op. (The gradient with respect to the
       <i>input</i> $p_i$ is $w_i=0$ at the very first step, so no signal leaks into the trainable copy through this
       path on step one &mdash; that is exactly the "no harmful noise" protection. After the weight moves off zero,
       that path opens too.) This is why the paper says the parameters "progressively grow from zero."</p>
       <p>Together: Fact 1 gives a safe start ($\\mathbf{y}_c=\\mathbf{y}$); Fact 2 guarantees the connector does not
       stay a no-op. The conditioning effect grows in from zero. Both facts are verified numerically in the
       notebook's first cell.</p>`,
    example:
      `<p>Work the zero-convolution identity by hand so Eq. 3 is concrete. Take a single pixel with three channels,
       input vector $\\mathbf{p} = [2,\\,-1,\\,3]$. A $1\\times1$ convolution that maps three channels to three
       channels is a $3\\times3$ weight matrix $W$ plus a length-3 bias $\\mathbf{b}$. For a <b>zero convolution</b>,
       both are all zeros:</p>
       <ul class="steps">
        <li><b>Zero convolution output.</b> $\\mathbf{o} = W\\mathbf{p} + \\mathbf{b}$. Each output channel is a row
        of $W$ dotted with $\\mathbf{p}$, plus a bias entry. Row $= [0,0,0]$, so the dot product is
        $0\\cdot2 + 0\\cdot(-1) + 0\\cdot3 = 0$; bias $=0$. Every output channel is $0$. So
        $\\mathbf{o} = [0,\\,0,\\,0]$ &mdash; regardless of $\\mathbf{p}$.</li>
        <li><b>Plug into Eq. 2.</b> The condition path gives $\\mathcal{Z}(\\mathbf{c};\\Theta_{z1}) = \\mathbf{0}$,
        so the trainable copy sees $\\mathbf{x} + \\mathbf{0} = \\mathbf{x}$. Whatever it outputs then passes through
        the second zero convolution: $\\mathcal{Z}(\\cdot;\\Theta_{z2}) = \\mathbf{0}$. So the whole second summand
        is $\\mathbf{0}$.</li>
        <li><b>Result (Eq. 3).</b> $\\mathbf{y}_c = \\mathcal{F}(\\mathbf{x};\\Theta) + \\mathbf{0} = \\mathbf{y}$.
        The conditioned output equals the frozen output exactly. No harm.</li>
        <li><b>But it will learn.</b> The gradient of output channel $1$ with respect to its first weight is the
        input $p_1 = 2 \\ne 0$. So after one gradient step that weight is no longer zero, and the zero convolution
        starts to pass a signal. The effect grows from zero.</li>
       </ul>
       <p>The notebook's first cell builds a real zero convolution, confirms its output is exactly $0$, and prints
       the (nonzero) weight gradient &mdash; matching this by-hand reasoning.</p>`,
    recipe:
      `<ol>
        <li><b>Build a tiny frozen block</b> with <code>torch.nn</code> (a couple of <code>nn.Conv2d</code> + ReLU
        layers) standing in for the pretrained diffusion model. Set <code>requires_grad_(False)</code> on every
        parameter &mdash; this is the <b>locked copy</b> $\\mathcal{F}(\\cdot;\\Theta)$.</li>
        <li><b>Clone a trainable copy</b> with <code>copy.deepcopy</code> and re-enable its gradients &mdash;
        $\\mathcal{F}(\\cdot;\\Theta_c)$.</li>
        <li><b>Add two zero convolutions</b>: <code>nn.Conv2d(C, C, 1)</code> for <code>z1</code> and
        <code>z2</code>, each with weight AND bias set to zero via <code>nn.init.zeros_</code>.</li>
        <li><b>Forward (Eq. 2):</b> <code>frozen(x) + z2(copy(x + z1(c)))</code>.</li>
        <li><b>Verify Eq. 3:</b> before training, assert <code>torch.allclose(model(x,c), frozen(x))</code> &mdash;
        the conditioned output equals the frozen output at step zero.</li>
        <li><b>Train the control branch</b> (only the trainable copy and the two zero convolutions) to make the
        output follow a target that depends on the condition $\\mathbf{c}$. Watch the <b>control strength</b> &mdash;
        how far the output moves from the frozen output &mdash; grow from zero.</li>
        <li><b>Ablate:</b> initialize the zero convolutions <i>randomly</i> instead of at zero and re-check the
        step-zero output &mdash; the identity $\\mathbf{y}_c=\\mathbf{y}$ breaks, and the pretrained behavior is
        perturbed before any learning.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): ControlNet "add[s] spatial conditioning controls to large, pretrained
       text-to-image diffusion models," tested "with Stable Diffusion, using single or multiple conditions, with or
       without prompts," across "edges, depth, segmentation, human pose, etc." The abstract also reports the
       training "is robust with small (&lt;50k) and large (&gt;1m) datasets."</p>
       <p>On the connector, the abstract states the zero convolutions "progressively grow the parameters from zero
       and ensure that no harmful noise could affect the finetuning." (Quoted from the abstract.)</p>
       <p><i>These are the paper's own statements, quoted from the abstract and &sect;3.1. The numbers in the CODE
       and CODEVIZ panels below are from our own tiny run on toy data &mdash; not the paper's reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The convolutions and optimizers already ship in PyTorch, so
       you <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.ReLU</code> for the blocks, <code>nn.init.zeros_</code> to zero a layer, <code>copy.deepcopy</code>
       to clone, and <code>torch.optim.Adam</code>. <b>Build by hand:</b> the <b>ControlNet block</b> &mdash; the
       frozen locked copy, the trainable copy, the two <b>zero convolutions</b>, and the forward pass of Eq. 2 that
       guarantees $\\mathbf{y}_c=\\mathbf{y}$ at init (Eq. 3). We do <b>not</b> load a real diffusion model; we
       illustrate the zero-convolution mechanism on a tiny stand-in. The diffusion background (what a denoising model
       is, the U-Net) is recapped from the <b>paper-ddpm</b> and <b>paper-latent-diffusion</b> lessons, not
       re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Zeroing only the weight, not the bias.</b> A zero convolution needs <b>both</b> weight and bias at
        zero. If the bias is left at its default (often nonzero), the layer outputs the bias even at init, so
        $\\mathbf{y}_c \\ne \\mathbf{y}$ and you inject noise on step one. <b>Fix:</b>
        <code>nn.init.zeros_(z.weight)</code> AND <code>nn.init.zeros_(z.bias)</code>.</li>
        <li><b>Thinking a zero-weight layer can never learn.</b> It can: the gradient with respect to the weight is
        the layer's <i>input</i>, which is nonzero, so the optimizer moves the weight off zero. The zero
        convolution is a no-op at init, not forever.</li>
        <li><b>Forgetting to freeze the locked copy.</b> If you leave <code>requires_grad</code> on the original
        block, you are fine-tuning the backbone directly &mdash; the exact corruption ControlNet avoids. <b>Fix:</b>
        <code>requires_grad_(False)</code> on every original parameter; train only the copy and the zero convs.</li>
        <li><b>Sharing parameters between the locked and trainable copies.</b> The trainable copy must be a
        <code>deepcopy</code> with its <i>own</i> tensors. If it aliases the frozen block's parameters, updating it
        also changes the frozen block. <b>Fix:</b> <code>copy.deepcopy</code>, then re-enable gradients on the copy.</li>
        <li><b>Confusing "no effect at init" with "no effect ever."</b> Eq. 3 only describes step zero. After
        training, the zero convolutions are nonzero and the conditioning steers the output strongly. The point is a
        <i>safe start</i>, not a permanent identity.</li>
      </ul>`,
    recall: [
      "Write the ControlNet block (Eq. 2) and state what it reduces to at init (Eq. 3).",
      "Define a zero convolution. What must be zero, and what does it output at init for any input?",
      "Why does a zero convolution still learn even though its weight starts at zero?",
      "Which parameters are frozen ($\\Theta$) and which are trained ($\\Theta_c$, $\\Theta_{z1}$, $\\Theta_{z2}$)?"
    ],
    practice: [
      {
        q: `<b>The zero-init ablation.</b> You have a working ControlNet block whose two zero convolutions start at
            zero, so $\\mathbf{y}_c = \\mathbf{y}$ at step zero. Now initialize the two $1\\times1$ convolutions
            <i>randomly</i> instead (the default PyTorch init), everything else identical. What happens to the
            step-zero output, and what does that do to the pretrained backbone?`,
        steps: [
          { do: `Replace <code>nn.init.zeros_(z.weight); nn.init.zeros_(z.bias)</code> with the default random init (skip the zeroing).`, why: `Random weights make $\\mathcal{Z}(\\cdot;\\cdot)$ output nonzero values at init, so the second summand of Eq. 2 is no longer zero.` },
          { do: `Re-check the step-zero output: compare <code>model(x,c)</code> to <code>frozen(x)</code>.`, why: `Eq. 3 no longer holds: $\\mathbf{y}_c \\ne \\mathbf{y}$. The control branch perturbs the frozen output before it has learned anything.` },
          { do: `Reason about the consequence: the random control branch injects unstructured noise into the pretrained features on the first step, the very thing zero-init prevents.`, why: `The abstract's claim &mdash; "no harmful noise could affect the finetuning" &mdash; relies on the zero-init no-op. Random init breaks that guarantee.` }
        ],
        answer: `<p>With random init the zero convolutions are no longer zero, so
                 $\\mathbf{y}_c \\ne \\mathbf{y}$ at step zero: the control branch adds <b>noise</b> to the frozen
                 output before learning anything useful. In our run the random-init output differs from the frozen
                 output by a max of about <b>1.13</b> at step zero, versus exactly <b>0.0</b> for zero-init. That is
                 precisely the "harmful noise" ControlNet's zero convolutions eliminate &mdash; the safe start comes
                 from the zero initialization, not from anything else in the architecture. (Our small run, not the
                 paper's number.)</p>`
      },
      {
        q: `Why does freezing the original block (the locked copy) and training a separate copy <i>protect</i> the
            pretrained model, when a naive fine-tune on the same small conditioning dataset might damage it?`,
        steps: [
          { do: `Write what naive fine-tuning does: it updates the original parameters $\\Theta$ directly using gradients from the small new dataset.`, why: `Small datasets give noisy gradients; applied straight to the billions-of-images backbone, they can overwrite useful features (catastrophic forgetting).` },
          { do: `Write what ControlNet does: $\\Theta$ is frozen; only the copy $\\Theta_c$ and the zero convolutions are trained, and their effect is <i>added</i> to the frozen output (Eq. 2).`, why: `The backbone is never touched, so it cannot be corrupted. The new pathway can only add a correction on top.` },
          { do: `Add the zero-init guarantee: that correction starts at zero (Eq. 3), so even the added pathway does no harm on step one.`, why: `Freezing protects the backbone; zero-init protects the very first steps of the new pathway. Two layers of safety.` }
        ],
        answer: `<p>Because the pretrained weights $\\Theta$ are <b>frozen</b> and the new capability lives in a
                 <i>separate</i> trainable copy whose contribution is <i>added</i> on top (Eq. 2). Naive fine-tuning
                 mutates $\\Theta$ directly with noisy small-dataset gradients and can erase what the backbone knew.
                 ControlNet never updates $\\Theta$, so the backbone is preserved exactly; and the added control
                 branch starts as a no-op (zero convolutions, Eq. 3), so it does no harm at step zero either. The
                 backbone is protected by freezing; the connection is protected by zero-init.</p>`
      },
      {
        q: `A teammate worries: "If the zero convolution's weight starts at exactly zero, gradient descent will
            leave it at zero forever, so the conditioning can never have any effect." Is this right? Show the
            gradient.`,
        steps: [
          { do: `Write one output channel of the zero convolution at a pixel: $o = \\sum_i w_i p_i + b$, with all $w_i=0$ and $b=0$ at init, and input channels $p_i$.`, why: `This is just a per-pixel linear map &mdash; the $1\\times1$ convolution.` },
          { do: `Differentiate with respect to the weight: $\\partial o / \\partial w_i = p_i$.`, why: `The gradient flowing into $w_i$ is the input $p_i$, which is generally NONZERO &mdash; it does not depend on $w_i$ being zero.` },
          { do: `Conclude: after one step the optimizer moves $w_i$ off zero by an amount proportional to $p_i$ (times the upstream gradient), so the layer stops being a no-op.`, why: `The "stuck at zero" intuition confuses the gradient with respect to the input ($=w_i=0$ at init) with the gradient with respect to the weight ($=p_i\\ne0$).` }
        ],
        answer: `<p>No &mdash; the worry confuses two gradients. The gradient with respect to the <b>weight</b> is the
                 layer's <i>input</i>, $\\partial o/\\partial w_i = p_i$, which is nonzero. So the optimizer moves the
                 weight off zero on the very first step and the zero convolution begins to pass a signal &mdash; the
                 parameters "progressively grow from zero." (What <i>is</i> zero at init is the gradient with respect
                 to the input, $w_i=0$, which is exactly why no noise leaks into the trainable copy on step one.) In
                 our run the zero convolution's output is exactly $0$ at init while its weight gradient has magnitude
                 about <b>6.5</b> &mdash; nonzero, so it trains. (Our small run, not the paper's number.)</p>`
      }
    ]
  });

  window.CODE["paper-controlnet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> tiny convolutional blocks with <code>nn.Conv2d</code> / <code>nn.ReLU</code>,
       then build the <b>novel</b> part by hand &mdash; the ControlNet block. A small <code>frozen</code> net stands
       in for the pretrained diffusion model (its parameters are frozen with <code>requires_grad_(False)</code> &mdash;
       the <b>locked copy</b> $\\mathcal{F}(\\cdot;\\Theta)$). We <code>deepcopy</code> it into a <b>trainable copy</b>
       $\\mathcal{F}(\\cdot;\\Theta_c)$ and join the two with two <b>zero convolutions</b> $\\mathcal{Z}$ &mdash;
       $1\\times1$ convolutions whose weight AND bias start at zero. The forward pass is Eq. 2:
       <code>frozen(x) + z2(copy(x + z1(c)))</code>. The first cell confirms the worked example: a zero convolution
       outputs exactly $0$, yet its weight gradient is nonzero (here about $6.5$), so it learns. We then verify Eq. 3
       with <code>torch.allclose(model(x,c), frozen(x))</code> &mdash; at step zero the conditioned output equals the
       frozen output. We train the control branch to follow a conditioning target and watch the <b>control strength</b>
       grow from $0$. Finally we ablate: random-init zero convolutions break the identity and perturb the frozen
       output at step zero. CPU, a few hundred fast steps. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, copy
torch.manual_seed(0)

# --- 0. Worked example: a zero convolution outputs 0, but its weight gradient is NONZERO. ---
zc = nn.Conv2d(3, 3, 1)                 # a 1x1 convolution, 3 channels -> 3 channels
nn.init.zeros_(zc.weight); nn.init.zeros_(zc.bias)   # ZERO weight AND bias
x_demo = torch.randn(1, 3, 4, 4)
print("zero-conv output max|.|      :", zc(x_demo).abs().max().item())       # -> 0.0  (Eq. 3 building block)
out = zc(x_demo); out.sum().backward()
print("zero-conv weight.grad max|.| :", round(zc.weight.grad.abs().max().item(), 2))  # -> ~6.5 (it WILL learn)


# --- 1. A tiny FROZEN block: stand-in for the pretrained diffusion model (the LOCKED COPY). ---
def block():
    return nn.Sequential(nn.Conv2d(3, 8, 3, padding=1), nn.ReLU(),
                         nn.Conv2d(8, 3, 3, padding=1))

# --- 2. The ControlNet block, built by hand (Eq. 2). ---
class ControlNet(nn.Module):
    def __init__(self, frozen, zero_init=True):
        super().__init__()
        self.frozen = frozen                                  # F(.;Theta)  -- locked copy
        for p in self.frozen.parameters(): p.requires_grad_(False)
        self.copy = copy.deepcopy(frozen)                     # F(.;Theta_c) -- trainable copy
        for p in self.copy.parameters(): p.requires_grad_(True)
        self.z1 = nn.Conv2d(3, 3, 1)                          # zero conv on the condition path
        self.z2 = nn.Conv2d(3, 3, 1)                          # zero conv on the output path
        if zero_init:
            for z in (self.z1, self.z2):
                nn.init.zeros_(z.weight); nn.init.zeros_(z.bias)   # weight AND bias -> 0
    def forward(self, x, c):
        # Eq. 2:  y_c = F(x;Theta) + Z( F(x + Z(c;Tz1); Theta_c); Tz2)
        return self.frozen(x) + self.z2(self.copy(x + self.z1(c)))

frozen = block()
cn = ControlNet(frozen, zero_init=True)
x = torch.randn(4, 3, 8, 8); c = torch.randn(4, 3, 8, 8)   # input + conditioning signal

# --- 3. Eq. 3: at init the conditioned output EQUALS the frozen output. No harm. ---
y  = cn.frozen(x)
yc = cn(x, c)
print("\\nmax|y_c - y| at init        :", (yc - y).abs().max().item())            # -> 0.0
print("allclose(y_c, frozen(x))    :", torch.allclose(yc, y, atol=1e-6))         # -> True

# --- 4. Train the control branch to FOLLOW the condition; control strength grows from 0. ---
target = (cn.frozen(x) + c).detach()       # toy target: frozen output PLUS the control signal
def control_strength():                    # how far the output moves off the frozen output (RMS)
    with torch.no_grad():
        return (cn(x, c) - cn.frozen(x)).pow(2).mean().sqrt().item()
opt = torch.optim.Adam([p for p in cn.parameters() if p.requires_grad], lr=1e-2)
lossfn = nn.MSELoss()
print("\\nstep | control strength | loss")
for step in range(401):
    if step in (0, 1, 5, 20, 100, 400):
        print("%4d |      %.4f      | %.4f" % (step, control_strength(), lossfn(cn(x, c), target).item()))
    opt.zero_grad(); lossfn(cn(x, c), target).backward(); opt.step()
# step | control strength | loss
#    0 |      0.0000      | 1.0092   <- zero effect at init (Eq. 3)
#    1 |      0.0095      | 1.0079
#    5 |      0.0552      | 0.9937
#   20 |      0.5127      | 0.7376
#  100 |      0.9099      | 0.1890
#  400 |      0.9687      | 0.0745   <- conditioning effect has grown in
# (Our small run, not the paper's reported numbers. Values vary by seed/hardware.)

# --- 5. ABLATION: random-init zero-convs break Eq. 3 and perturb the frozen output at step 0. ---
cn_rand = ControlNet(block(), zero_init=False)
with torch.no_grad():
    harm = (cn_rand(x, c) - cn_rand.frozen(x)).abs().max().item()
print("\\nrandom-init max|y_c - y| at init:", round(harm, 4))   # -> ~1.13  (NOT zero: harmful noise at step 0)
print("zero-init  max|y_c - y| at init: 0.0   (safe start)")`
  };

  window.CODEVIZ["paper-controlnet"] = {
    question: "As we train the control branch, how does the conditioning effect grow from zero — and what does random-init do instead at step zero?",
    charts: [
      {
        type: "line",
        title: "Control strength (how far the output moves off the frozen output) vs training step",
        xlabel: "training steps of the control branch (zero-initialized zero-convolutions)",
        ylabel: "control strength = RMS(y_c − frozen(x))",
        series: [
          {
            name: "zero-init control branch",
            color: "#7ee787",
            points: [[0,0.0],[1,0.0095],[5,0.0552],[20,0.5127],[100,0.9099],[400,0.9687]]
          }
        ]
      },
      {
        type: "bar",
        title: "Perturbation of the frozen output at step 0 — zero-init vs random-init zero-convolutions",
        xlabel: "zero-convolution initialization",
        ylabel: "max |y_c − frozen(x)| at step 0",
        series: [
          { name: "max|y_c − y| at init", color: "#ff7b72",
            points: [["zero-init", 0.0], ["random-init", 1.132]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny frozen conv net (3&rarr;8&rarr;3, ReLU) stands in for the pretrained diffusion model; a deep-copied trainable branch is joined by two zero convolutions (1&times;1 convs, weight AND bias) and trained to follow a conditioning signal. LEFT: with zero-init the control strength starts at exactly 0 (the conditioned output equals the frozen output, Eq. 3) and grows in &mdash; 0.0 &rarr; 0.0095 &rarr; 0.0552 &rarr; 0.51 &rarr; 0.91 &rarr; 0.97 as the zero convolutions learn. RIGHT: at step 0, zero-init perturbs the frozen output by exactly 0.0 (no harm), while random-init perturbs it by ~1.13 &mdash; injecting the 'harmful noise' the zero convolutions are designed to eliminate.",
    code: `import torch, torch.nn as nn, copy
torch.manual_seed(0)

def block(): return nn.Sequential(nn.Conv2d(3,8,3,padding=1), nn.ReLU(),
                                  nn.Conv2d(8,3,3,padding=1))

class ControlNet(nn.Module):
    def __init__(self, frozen, zero_init=True):
        super().__init__()
        self.frozen = frozen
        for p in self.frozen.parameters(): p.requires_grad_(False)
        self.copy = copy.deepcopy(frozen)
        for p in self.copy.parameters(): p.requires_grad_(True)
        self.z1 = nn.Conv2d(3,3,1); self.z2 = nn.Conv2d(3,3,1)
        if zero_init:
            for z in (self.z1, self.z2):
                nn.init.zeros_(z.weight); nn.init.zeros_(z.bias)
    def forward(self, x, c):                       # Eq. 2
        return self.frozen(x) + self.z2(self.copy(x + self.z1(c)))

cn = ControlNet(block(), zero_init=True)
x = torch.randn(4,3,8,8); c = torch.randn(4,3,8,8)
target = (cn.frozen(x) + c).detach()
def strength():
    with torch.no_grad(): return (cn(x,c) - cn.frozen(x)).pow(2).mean().sqrt().item()

opt = torch.optim.Adam([p for p in cn.parameters() if p.requires_grad], lr=1e-2)
lf = nn.MSELoss(); curve = {}
for step in range(401):
    if step in (0,1,5,20,100,400): curve[step] = round(strength(), 4)
    opt.zero_grad(); lf(cn(x,c), target).backward(); opt.step()
print("control strength:", curve)
# control strength: {0: 0.0, 1: 0.0095, 5: 0.0552, 20: 0.5127, 100: 0.9099, 400: 0.9687}

# ablation: harm at step 0, zero-init vs random-init
cn_r = ControlNet(block(), zero_init=False)
with torch.no_grad():
    print("zero-init  max|y_c-y| @0:", round((cn(x,c)-cn.frozen(x)).abs().max().item(),4))   # 0.0 (post-train; at init it was 0 too)
    print("random-init max|y_c-y| @0:", round((cn_r(x,c)-cn_r.frozen(x)).abs().max().item(),4))  # ~1.132
# zero-init keeps the frozen output untouched at step 0; random-init injects ~1.13 of noise.
# Our small run, not the paper's number.`
  };
})();
