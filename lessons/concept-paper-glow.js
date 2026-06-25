/* Paper lesson — "Glow: Generative Flow with Invertible 1x1 Convolutions", Kingma & Dhariwal 2018.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-glow".
   GROUNDED from arXiv:1807.03039 (abstract) and the ar5iv HTML mirror: Eqs. 6-7 (change of variables /
   log-likelihood objective), Table 1 (the three components of one flow step: actnorm §3.1, invertible
   1x1 convolution §3.2, affine coupling §3.3 — forward / reverse / log-det each), Eqs. 9-11 (1x1-conv
   log-det = h*w*log|det W|, and the LU-decomposition variant), Table 2 (bits/dimension results).
   Track B (architecture): build one full Glow step (actnorm + invertible 1x1 conv + affine coupling)
   on top of nn.Conv2d, stack K of them, train by maximizing the exact log-likelihood on a tiny toy
   "image" distribution, and ABLATE the 1x1 conv (the paper's novel part). The change-of-variables math
   lives in concept mod-normalizing-flows; here we recap and link. Glow builds directly on Real NVP
   (paper-realnvp) — same affine coupling, new actnorm + learned 1x1 permutation. */
(function () {
  window.LESSONS.push({
    id: "paper-glow",
    title: "Glow — Generative Flow with Invertible 1×1 Convolutions (2018)",
    tagline: "A normalizing flow whose channel-shuffling step is a learned, invertible 1×1 convolution — a generalization of a fixed channel permutation, with a cheap log-determinant — giving sharp, exact-likelihood image synthesis.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Diederik P. Kingma, Prafulla Dhariwal",
      org: "OpenAI",
      year: 2018,
      venue: "arXiv:1807.03039 (Jul 2018); NeurIPS 2018",
      citations: "",
      arxiv: "https://arxiv.org/abs/1807.03039",
      code: "https://github.com/openai/glow"
    },
    conceptLink: "mod-normalizing-flows",
    partOf: [],
    prereqs: ["mod-normalizing-flows", "mod-vae", "dl-conv", "dl-backprop", "la-determinant", "prob-normal", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>A <b>normalizing flow</b> is a generative model built from <b>invertible</b> transforms: pass a
       simple base sample (a standard Gaussian) through a chain of reversible layers to get data, and because
       every layer can be undone you can compute the <i>exact</i> probability of any data point (unlike
       Generative Adversarial Networks and Variational Autoencoders, which only approximate it). The previous
       landmark flow, <b>Real NVP</b> (<b>paper-realnvp</b>), made this practical with <b>affine coupling
       layers</b> &mdash; layers that transform half the variables using the other half, so the Jacobian (the
       matrix of all partial derivatives, whose determinant measures how much the layer stretches space) is
       triangular and its determinant is cheap.</p>
       <p>But coupling only ever transforms <i>half</i> the channels at a time. To let every channel
       eventually influence every other, Real NVP shuffles the channel order between layers using a
       <b>fixed</b> permutation (just reversing the order). That fixed shuffle is arbitrary and limits how
       well the flow mixes information. The paper's question: can we <b>learn</b> the channel-shuffling step
       instead, while keeping its log-determinant cheap to compute, and does that make flow-based image
       generation good enough to rival the sharpest models?</p>`,
    contribution:
      `<ul>
        <li><b>The invertible 1&times;1 convolution (&sect;3.2)</b> &mdash; the headline idea. A 1&times;1
        convolution with $c$ input and $c$ output channels is just multiplying the channel vector at each
        pixel by a learned $c\\times c$ matrix $W$. It <b>generalizes a fixed channel permutation</b>: a
        permutation is the special case where $W$ is a permutation matrix, but here $W$ is learned. Its
        log-determinant has a clean closed form (Eq. 9), so it slots into the flow objective for free.</li>
        <li><b>Actnorm (&sect;3.1)</b> &mdash; an "activation normalization" layer: a learned per-channel
        scale and bias, <b>initialized</b> so that the layer's outputs have zero mean and unit variance on
        the first minibatch (<i>data-dependent initialization</i>). It replaces batch normalization, which is
        unreliable with the tiny per-GPU batches flows use.</li>
        <li><b>A clean three-part flow step.</b> Glow defines one step of flow as
        <b>actnorm &rarr; invertible 1&times;1 convolution &rarr; affine coupling</b> (Table 1), stacked in a
        multi-scale architecture. The result: state-of-the-art log-likelihood among flows, and the first
        demonstration that a likelihood-trained flow can synthesize and smoothly manipulate sharp,
        high-resolution faces.</li>
      </ul>`,
    whyItMattered:
      `<p>Glow showed that flows &mdash; models with <b>exact</b>, tractable likelihood and a fast single-pass
       sampler &mdash; could produce sharp, high-resolution images (256&times;256 faces) and support
       semantic interpolation, narrowing the visual-quality gap to Generative Adversarial Networks. The
       invertible 1&times;1 convolution became a standard flow building block (reused in Flow++, WaveGlow for
       audio, and later flow models). It is also a clean teaching example of the trade-off at the heart of
       flows: every layer must be invertible <i>and</i> have a tractable Jacobian determinant.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 / Eqs. 6&ndash;7</b> &mdash; the change-of-variables log-likelihood objective: the
        log-probability of data is the base log-probability plus the sum of per-layer log-determinants. This
        is what the whole model maximizes.</li>
        <li><b>Table 1</b> &mdash; the single most important page: for each of the three components (actnorm,
        invertible 1&times;1 conv, affine coupling) it gives the <b>forward function</b>, the <b>reverse
        function</b>, and the <b>log-determinant</b>. Memorize this table.</li>
        <li><b>&sect;3.2 / Eqs. 9&ndash;11</b> &mdash; the invertible 1&times;1 convolution and its
        log-determinant $h\\cdot w\\cdot\\log|\\det W|$ (Eq. 9), plus the optional LU decomposition (Eqs.
        10&ndash;11) that drops the cost from $O(c^3)$ to $O(c)$.</li>
       </ul>
       <p><b>Skim:</b> the multi-scale "squeeze/split" plumbing (&sect;3, inherited from Real NVP), and the
       large-image qualitative results &mdash; the math you need to build a working Glow is Eqs. 6&ndash;9
       plus Table 1.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a tiny Glow on a 2-channel toy "image" distribution where the two channels are
       strongly correlated, and stack a few flow steps. The key question: the <b>invertible 1&times;1
       convolution</b> is what lets the channels mix. <b>Predict:</b> if you <i>remove</i> the 1&times;1
       convolution (so channels never mix across steps), will the model's fit &mdash; measured in
       <b>bits per dimension</b> (the negative log-likelihood rescaled to bits; <i>lower is better</i>)
       &mdash; get worse, stay the same, or improve?</p>`,
    attempt:
      `<p>Before the reveal, implement one <b>step of flow</b> from Table 1 on top of <code>nn.Conv2d</code>:</p>
       <ol>
        <li><b>Actnorm:</b> learnable per-channel log-scale <code>logs</code> and bias <code>b</code>;
        forward <code>y = exp(logs) * x + b</code>; log-det <code>h*w*sum(logs)</code>. Initialize
        <code>logs</code>, <code>b</code> from the first batch so outputs are zero-mean/unit-variance.</li>
        <li><b>Invertible 1&times;1 conv:</b> a learnable $c\\times c$ matrix <code>W</code> (start from a
        random rotation); forward multiplies each pixel's channel vector by <code>W</code>; log-det is
        <code>h*w*logdet(W)</code> (Eq. 9).</li>
        <li><b>Affine coupling:</b> split channels into <code>xa, xb</code>; a small conv net reads
        <code>xb</code> and outputs <code>(logs, t)</code>; <code>ya = exp(logs)*xa + t</code>,
        <code>yb = xb</code>; log-det is <code>sum(logs)</code>.</li>
       </ol>
       <p>Stack $K$ steps, add the standard-Gaussian base log-prob, maximize the total (Eq. 7). Then ablate:
       drop the 1&times;1 conv and compare bits/dimension.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Glow is a normalizing flow: a stack of invertible layers $f$ that maps data $x$ to a latent $z$
       with a simple density $p_z$ (a standard Gaussian). To train it you maximize the <b>exact</b>
       log-likelihood of the data, which the change-of-variables formula writes as the base log-probability
       plus a correction for how much each layer stretches space.</p>
       <p><b>The correction is a log-determinant.</b> When an invertible layer maps inputs to outputs, the
       density rescales by the absolute determinant of the layer's <b>Jacobian</b> (the matrix of partial
       derivatives of outputs with respect to inputs). So for a stack, the log-density of $x$ is
       $\\log p_z(z)$ plus the sum, over layers, of $\\log|\\det(\\text{Jacobian})|$ (Eq. 7). The whole design
       game is: pick layers that are (a) invertible and (b) have a Jacobian determinant you can compute
       cheaply.</p>
       <p><b>One step of flow has three parts (Table 1), applied in this order:</b></p>
       <ol>
        <li><b>Actnorm</b> (activation normalization). A per-channel affine map: $y = s \\odot x + b$, with
        learned scale $s$ and bias $b$ ($\\odot$ means element-wise multiply, broadcast across the
        $h\\times w$ pixels). Because the same $s$ multiplies all $h\\cdot w$ spatial positions of a channel,
        its log-determinant is $h\\cdot w\\cdot\\sum\\log|s|$. The parameters are <i>initialized from the first
        minibatch</i> so the outputs start zero-mean and unit-variance &mdash; a stand-in for batch
        normalization that works even with batch size 1.</li>
        <li><b>Invertible 1&times;1 convolution</b> &mdash; the new idea. At every pixel, multiply the length-$c$
        channel vector by a learned $c\\times c$ matrix $W$: $y_{i,j} = W x_{i,j}$. This is exactly a
        1&times;1 convolution with $c$ in- and out-channels. It <b>generalizes the fixed channel permutation</b>
        Real NVP used between coupling layers: a permutation is the case where $W$ is a 0/1 permutation
        matrix; here $W$ is learned and can be any invertible matrix. Inverting the layer just multiplies by
        $W^{-1}$. Its log-determinant (Eq. 9) is $h\\cdot w\\cdot\\log|\\det W|$ &mdash; the same $W$ acts at
        every one of the $h\\cdot w$ pixels, so the per-pixel $\\log|\\det W|$ is summed $h\\cdot w$ times.</li>
        <li><b>Affine coupling</b> (from Real NVP). Split the channels in half, $x_a$ and $x_b$. Feed $x_b$
        through a small network to get a per-element scale $\\log s$ and shift $t$; set
        $y_a = \\exp(\\log s)\\odot x_a + t$ and $y_b = x_b$ (the second half passes through unchanged). Because
        $y_b$ is just a copy and $y_a$ depends on $x_a$ only through a diagonal scaling, the Jacobian is
        triangular and its log-determinant is simply $\\sum \\log s$. To invert: recompute $\\log s, t$ from the
        unchanged $y_b$, then undo the scale-and-shift on $y_a$.</li>
       </ol>
       <p>The three log-determinants add up; sum them across all $K$ steps (and the multi-scale levels) and
       add $\\log p_z(z)$ to get the exact $\\log p(x)$ you maximize. The 1&times;1 convolution is the cheap,
       <i>learned</i> mixing that lets information flow between the coupling halves &mdash; the paper's
       contribution.</p>`,
    symbols: [
      { sym: "$x$", desc: "a data point (an image): a tensor of $c$ channels by $h\\times w$ pixels." },
      { sym: "$z$", desc: "the latent code, $z = f(x)$: the data run all the way forward through the flow, living in a simple standard-Gaussian space." },
      { sym: "$p_z(z)$", desc: "the base density: the standard-Gaussian probability of the latent $z$." },
      { sym: "$p_\\theta(x)$", desc: "the model's probability of the data point $x$ — the thing we maximize (here $\\theta$ are all learnable parameters)." },
      { sym: "$h, w, c$", desc: "the height, width, and number of channels of the feature map at a layer." },
      { sym: "$x_{i,j}$", desc: "the length-$c$ vector of channel values at one spatial position (pixel) $(i,j)$." },
      { sym: "Jacobian", desc: "the matrix of all partial derivatives of a layer's outputs with respect to its inputs; its determinant measures the local volume change the layer applies." },
      { sym: "$\\det$", desc: "determinant of a square matrix: the signed factor by which it scales volume. $|\\det|$ is its absolute value." },
      { sym: "$\\log|\\det W|$", desc: "the log of the absolute determinant of the 1×1-conv matrix $W$ — the per-pixel volume-change of that layer." },
      { sym: "$s, b$", desc: "actnorm's learned per-channel scale and bias." },
      { sym: "$W$", desc: "the learned $c\\times c$ matrix of the invertible 1×1 convolution (generalizes a channel permutation matrix)." },
      { sym: "$\\odot$", desc: "element-wise (Hadamard) multiplication." },
      { sym: "$\\log s, t$", desc: "the per-element log-scale and shift the coupling network produces from the unchanged half." },
      { sym: "bits/dimension", desc: "negative log-likelihood divided by the number of values in $x$ and converted to base-2 bits — the standard flow score; lower means the model assigns higher probability to the data." }
    ],
    formula: `$$ \\log p_\\theta(x) \\;=\\; \\log p_z(z) \\;+\\; \\sum_{i=1}^{K} \\log\\left|\\det\\left(\\frac{d\\,h_i}{d\\,h_{i-1}}\\right)\\right| \\qquad\\text{(Eq. 7)} \\qquad\\quad \\log\\left|\\det W\\right|_{\\text{1x1 conv}} = h\\cdot w\\cdot\\log|\\det W| \\quad\\text{(Eq. 9)} $$`,
    whatItDoes:
      `<p>The first equation (Eq. 7) is the training objective: the exact log-probability of a data point is
       the base Gaussian log-probability of its latent $z$, plus the sum over the $K$ layers of each layer's
       log-determinant (where $h_i$ is the activation after layer $i$, so $dh_i/dh_{i-1}$ is that layer's
       Jacobian). Each term is "how much did this layer stretch space, in log units."</p>
       <p>The second equation (Eq. 9) is the log-determinant of the new layer. Multiplying every pixel's
       channel vector by the same $c\\times c$ matrix $W$ changes local volume by $|\\det W|$ <i>per pixel</i>;
       since there are $h\\cdot w$ pixels, the total log-determinant is $h\\cdot w\\cdot\\log|\\det W|$. That is one
       small determinant, not a giant one &mdash; which is why the layer is cheap.</p>`,
    derivation:
      `<p>The change-of-variables formula &mdash; why a density rescales by the absolute Jacobian determinant
       under an invertible map &mdash; is derived in full in the concept lesson
       <b>mod-normalizing-flows</b> (it conserves probability mass: where a map spreads points apart the
       density thins, where it squeezes them the density piles up). Here we recap the two facts Glow needs:</p>
       <ul>
        <li><b>Determinants of a chain multiply, so logs add.</b> For a stack $f = f_K \\circ \\dots \\circ f_1$,
        $\\det(\\text{Jacobian of }f) = \\prod_i \\det(\\text{Jacobian of }f_i)$, hence the <i>sum</i> of logs in
        Eq. 7. This is why we can build a complex flow from simple, individually-tractable layers.</li>
        <li><b>Why the 1&times;1 conv log-det is $h\\cdot w\\cdot\\log|\\det W|$.</b> The layer applies the
        <i>same</i> matrix $W$ independently at each of the $h\\cdot w$ pixels. Its full Jacobian is therefore
        block-diagonal with $h\\cdot w$ identical $c\\times c$ blocks $W$. The determinant of a block-diagonal
        matrix is the product of the block determinants, $(\\det W)^{hw}$, so the log-determinant is
        $h\\cdot w\\cdot\\log|\\det W|$ &mdash; exactly Eq. 9. (The optional LU decomposition $W = P\\,L(U+\\mathrm{diag}(s))$
        in Eqs. 10&ndash;11 makes $\\log|\\det W| = \\sum\\log|s|$, dropping the cost from $O(c^3)$ to $O(c)$.)</li>
       </ul>`,
    example:
      `<p><b>Worked numbers for the 1&times;1-convolution log-determinant (Eq. 9).</b> Take a $2$-channel
       feature map of size $h=4$, $w=4$ (so $16$ pixels), and the learned mixing matrix</p>
       $$ W = \\begin{pmatrix} 2 & 0 \\\\ 1 & 3 \\end{pmatrix}. $$
       <p><b>Step 1 — determinant of $W$.</b> For a $2\\times2$ matrix $\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc$,
       so $\\det W = (2)(3) - (0)(1) = 6$.</p>
       <p><b>Step 2 — per-pixel log.</b> $\\log|\\det W| = \\log 6 \\approx 1.791759$.</p>
       <p><b>Step 3 — sum over all pixels (Eq. 9).</b> The same $W$ acts at all $h\\cdot w = 16$ pixels, so the
       layer's log-determinant is $h\\cdot w\\cdot\\log|\\det W| = 16 \\times 1.791759 \\approx 28.668$.</p>
       <p><b>Contrast with actnorm.</b> If actnorm used scale $s=(2,\\,0.5)$, its log-determinant would be
       $h\\cdot w\\cdot\\sum\\log|s| = 16\\,(\\log 2 + \\log 0.5) = 16\\times 0 = 0$ &mdash; because $2\\times 0.5=1$
       preserves volume. The notebook recomputes all three numbers and they match.</p>`,
    recipe:
      `<p>One <b>step of flow</b> (Table 1), then the full model:</p>
       <ol>
        <li><b>Actnorm:</b> $y = s\\odot x + b$; accumulate log-det $h\\cdot w\\cdot\\sum\\log|s|$. Initialize
        $s,b$ from the first batch (zero-mean, unit-variance outputs).</li>
        <li><b>Invertible 1&times;1 conv:</b> $y_{i,j} = W x_{i,j}$; accumulate log-det $h\\cdot w\\cdot\\log|\\det W|$.</li>
        <li><b>Affine coupling:</b> split $x \\to (x_a, x_b)$; $(\\log s, t) = \\text{NN}(x_b)$;
        $y_a = \\exp(\\log s)\\odot x_a + t$, $y_b = x_b$; accumulate log-det $\\sum\\log s$.</li>
        <li><b>Stack</b> $K$ such steps (and, for images, a multi-scale squeeze/split between levels).</li>
        <li><b>Objective:</b> add the standard-Gaussian base log-prob $\\log p_z(z)$ to the summed log-dets to
        get the exact $\\log p_\\theta(x)$ (Eq. 7); maximize it (minimize bits/dimension).</li>
        <li><b>Sample</b> by drawing $z\\sim\\mathcal N(0,I)$ and running every step's <i>reverse</i> function.</li>
       </ol>`,
    results:
      `<p>The paper reports test-set <b>bits/dimension</b> (lower is better) and finds Glow matches or beats
       Real NVP on every benchmark (Table 2): CIFAR-10 <b>3.35</b>, ImageNet 32&times;32 <b>4.09</b>,
       ImageNet 64&times;64 <b>3.81</b>, and LSUN bedroom/tower/church <b>2.38 / 2.46 / 2.67</b>. It also
       trains on 5-bit CelebA-HQ 256&times;256 at <b>1.03</b> bits/dimension (Table 3) and shows sharp face
       synthesis and smooth attribute interpolation. (All quoted from the paper; the numbers in our CODEVIZ
       below are our own tiny run, not the paper's.)</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is <b>Track B (architecture)</b>: we use <code>nn.Conv2d</code> for the coupling network but
       <b>build the three flow components by hand</b> &mdash; actnorm, the invertible 1&times;1 convolution
       (with its $h\\cdot w\\cdot\\log|\\det W|$ log-det), and the affine coupling layer &mdash; plus the
       change-of-variables objective (Eq. 7). We train on a tiny 2-channel toy "image" distribution so it
       runs in seconds, print the worked-example numbers, and run the <b>ablation</b> that deletes the
       1&times;1 convolution. The change-of-variables proof itself lives in <b>mod-normalizing-flows</b>;
       the affine coupling layer is shared with <b>paper-realnvp</b> &mdash; Glow's novelty is actnorm + the
       learned 1&times;1 mixing.</p>`,
    pitfalls:
      `<ul>
        <li><b>The 1&times;1 conv must stay invertible.</b> If $W$ drifts to a singular matrix, $\\det W\\to 0$
        and $\\log|\\det W|\\to-\\infty$. Initializing $W$ as a random <i>rotation</i> (an orthogonal matrix,
        $\\det=\\pm1$) keeps it well-conditioned at the start; the paper's LU parameterization guarantees it
        stays invertible.</li>
        <li><b>Actnorm initialization is data-dependent.</b> $s,b$ are set from the <i>first</i> minibatch so
        outputs are zero-mean/unit-variance; if you skip this, training can be unstable. Do it once, then
        treat $s,b$ as ordinary parameters.</li>
        <li><b>Don't confuse the two log-dets.</b> Actnorm's is $h\\cdot w\\cdot\\sum\\log|s|$ (a per-channel
        scale); the 1&times;1 conv's is $h\\cdot w\\cdot\\log|\\det W|$ (a full $c\\times c$ matrix). Both carry
        the $h\\cdot w$ factor because the operation repeats at every pixel.</li>
        <li><b>Coupling only transforms half the channels per step.</b> Without the 1&times;1 conv (or a
        permutation) between steps, the same half is always passed through unchanged and the model cannot
        fit channel correlations &mdash; exactly what the ablation demonstrates.</li>
        <li><b>Bits/dimension, not raw log-likelihood.</b> Report negative-log-likelihood divided by the
        number of values and converted to bits, so models of different sizes are comparable.</li>
       </ul>`,
    recall: [
      "State the change-of-variables log-likelihood objective (Eq. 7) from memory.",
      "Write the log-determinant of the invertible 1×1 convolution and explain the $h\\cdot w$ factor.",
      "Name the three components of one step of flow, in order, and give each one's log-det.",
      "In what sense is the invertible 1×1 convolution a generalization of a channel permutation?",
      "Why does actnorm use data-dependent initialization?"
    ],
    practice: [
      {
        q: `A 1×1 convolution layer has channel-mixing matrix $W=\\begin{pmatrix}1&2\\\\0&4\\end{pmatrix}$ acting on a feature map of size $h=2$, $w=3$. What is its log-determinant (Eq. 9)?`,
        steps: [
          { do: `Compute $\\det W$ for the triangular matrix: product of the diagonal, $1\\times 4 = 4$.`, why: `For a triangular matrix the determinant is the product of the diagonal entries.` },
          { do: `Take the per-pixel log: $\\log 4 \\approx 1.386294$.`, why: `Eq. 9 needs $\\log|\\det W|$ per pixel.` },
          { do: `Multiply by $h\\cdot w = 2\\times 3 = 6$.`, why: `The same $W$ acts at all 6 pixels; the Jacobian is block-diagonal with 6 identical blocks, so logs add 6 times.` }
        ],
        answer: `$h\\cdot w\\cdot\\log|\\det W| = 6\\times\\log 4 \\approx 6\\times 1.386294 = 8.3178$.`
      },
      {
        q: `Actnorm uses per-channel scale $s=(4,\\,0.25)$ on a feature map with $h=w=2$. What is its log-determinant, and what does the value tell you?`,
        steps: [
          { do: `Sum the per-channel logs: $\\log 4 + \\log 0.25 = 1.386294 + (-1.386294) = 0$.`, why: `Actnorm's log-det is $h\\cdot w\\cdot\\sum\\log|s|$ (Table 1).` },
          { do: `Multiply by $h\\cdot w = 4$: $4\\times 0 = 0$.`, why: `Same per-pixel repetition as the 1×1 conv.` }
        ],
        answer: `Log-det $= 0$. Because $4\\times 0.25 = 1$, this actnorm preserves total volume — it stretches one channel and compresses the other by the exact reciprocal.`
      },
      {
        q: `ABLATION. In the notebook, deleting the invertible 1×1 convolution from every step makes the held-out bits/dimension go UP (worse). Explain why, mechanistically.`,
        steps: [
          { do: `Recall that affine coupling leaves one half of the channels ($y_b = x_b$) unchanged each step.`, why: `Coupling can only transform variables conditioned on the untouched half.` },
          { do: `Note that, without the 1×1 conv (or a permutation) between steps, it is always the SAME half that is left unchanged.`, why: `The 1×1 conv is what re-mixes channels so a different combination is transformed next step.` },
          { do: `Conclude the model can never apply a learned transform to the always-passed-through channel, so it cannot capture the correlation between the two channels in the toy data.`, why: `Our toy data has strongly correlated channels; fitting them requires mixing.` }
        ],
        answer: `Without the 1×1 conv the channels never mix, so one channel stays effectively a plain Gaussian and the model under-fits the channel correlation — the exact-likelihood objective reports this as higher (worse) bits/dimension. This is the paper's motivation for the learned 1×1 convolution.`
      }
    ]
  });

  window.CODE["paper-glow"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build one full step of flow</b> by hand &mdash; actnorm, the invertible 1&times;1
       convolution (with its $h\\cdot w\\cdot\\log|\\det W|$ log-det), and the affine coupling layer &mdash; on
       top of <code>nn.Conv2d</code>, stack $K=4$ of them, and train by maximizing the exact
       change-of-variables log-likelihood (Eq. 7) on a tiny 4-channel toy "image" distribution whose
       channels are correlated in two pairs (so fitting it <i>requires</i> channel mixing). It runs in
       seconds. The first cell recomputes the worked example
       ($W=[[2,0],[1,3]]$, $h=w=4 \\Rightarrow \\log\\!\\det = 16\\log 6 \\approx 28.668$; actnorm $s=(2,0.5)
       \\Rightarrow 0$). We <b>print bits/dimension</b> (lower is better) as it improves. Finally the
       <b>ablation</b> deletes the 1&times;1 convolution (channels never mix) and shows bits/dimension gets
       worse. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, math
torch.manual_seed(0)

# --- 0. Sanity-check the worked example: 1x1-conv log-det = h*w*log|det W| (Eq. 9). ---
W0 = torch.tensor([[2.0, 0.0], [1.0, 3.0]])     # det = 2*3 - 0*1 = 6
h, w = 4, 4
print("det(W) =", torch.det(W0).item())                         # 6.0
print("1x1-conv log-det h*w*log|det W| =",
      round((h * w * torch.log(torch.abs(torch.det(W0)))).item(), 4))   # 16*log6 ~ 28.6682
s_demo = torch.tensor([2.0, 0.5])               # actnorm scale: 2 * 0.5 = 1 -> volume preserved
print("actnorm log-det h*w*sum(log|s|) =",
      round((h * w * torch.log(torch.abs(s_demo)).sum()).item(), 4))    # 0.0


# --- 1. A tiny 4-channel toy "image" whose channels are correlated in TWO separate pairs. ---
# Fitting this needs the model to MIX channels, so the 1x1 conv matters (see the ablation).
C, H, Wd = 4, 4, 4
Mcorr = torch.tensor([[1.0, 0.9, 0.0, 0.0], [0.9, 1.0, 0.0, 0.0],
                      [0.0, 0.0, 1.0, -0.9], [0.0, 0.0, -0.9, 1.0]])
Lchol = torch.linalg.cholesky(Mcorr)            # mix independent factors into correlated channels
def sample_data(n):
    z = torch.randn(n, C, H, Wd)
    return torch.einsum('ij,njhw->nihw', Lchol, z)


# --- 2. The three flow components, BUILT BY HAND (Table 1). ---
class ActNorm(nn.Module):                       # y = exp(logs)*x + b ; log-det = h*w*sum(logs)
    def __init__(self, C):
        super().__init__()
        self.logs = nn.Parameter(torch.zeros(1, C, 1, 1))
        self.b    = nn.Parameter(torch.zeros(1, C, 1, 1))
        self.inited = False
    def forward(self, x):
        if not self.inited:                     # data-dependent init from the first batch
            with torch.no_grad():
                m = x.mean([0, 2, 3], keepdim=True)
                v = x.std([0, 2, 3], keepdim=True) + 1e-6
                self.b.data = -m / v; self.logs.data = -torch.log(v)
            self.inited = True
        return torch.exp(self.logs) * x + self.b, H * Wd * self.logs.sum()

class Inv1x1(nn.Module):                         # y_ij = W x_ij ; log-det = h*w*log|det W| (Eq. 9)
    def __init__(self, C):
        super().__init__()
        Q, _ = torch.linalg.qr(torch.randn(C, C))    # start from a rotation (det = +-1, invertible)
        self.W = nn.Parameter(Q)
    def forward(self, x):
        y = torch.einsum('ij,njhw->nihw', self.W, x)
        return y, H * Wd * torch.slogdet(self.W)[1]

class AffineCoupling(nn.Module):                 # split; (logs,t)=NN(xb); ya=exp(logs)*xa+t; yb=xb
    def __init__(self, C, hid=32):
        super().__init__()
        self.net = nn.Sequential(nn.Conv2d(C // 2, hid, 3, padding=1), nn.ReLU(),
                                 nn.Conv2d(hid, hid, 1), nn.ReLU(),
                                 nn.Conv2d(hid, C, 3, padding=1))
        self.net[-1].weight.data.zero_(); self.net[-1].bias.data.zero_()   # start as identity
    def forward(self, x):
        xa, xb = x.chunk(2, 1)
        logs, t = self.net(xb).chunk(2, 1)
        logs = torch.tanh(logs)                  # stabilize the scale
        y = torch.cat([torch.exp(logs) * xa + t, xb], 1)
        return y, logs.sum([1, 2, 3])            # coupling log-det = sum(logs)


# --- 3. One step of flow = actnorm -> 1x1 conv -> coupling. use_1x1 toggles the ablation. ---
class Glow(nn.Module):
    def __init__(self, C, K=4, use_1x1=True):
        super().__init__()
        self.use_1x1 = use_1x1
        self.an = nn.ModuleList([ActNorm(C) for _ in range(K)])
        self.iv = nn.ModuleList([Inv1x1(C) for _ in range(K)])
        self.co = nn.ModuleList([AffineCoupling(C) for _ in range(K)])
    def forward(self, x):
        ld = 0
        for k in range(len(self.an)):
            x, l = self.an[k](x); ld = ld + l
            if self.use_1x1:
                x, l = self.iv[k](x); ld = ld + l    # ablation OFF -> channels never mix
            x, l = self.co[k](x); ld = ld + l
        logpz = (-0.5 * x ** 2 - 0.5 * math.log(2 * math.pi)).sum([1, 2, 3])
        return logpz + ld                        # exact log p(x) per sample (Eq. 7)

def bits_per_dim(model, x):                      # NLL / #values / log(2)  (lower is better)
    return (-model(x) / x[0].numel() / math.log(2)).mean()

def train(use_1x1=True, steps=1500):
    torch.manual_seed(0)
    m = Glow(C, K=4, use_1x1=use_1x1)
    opt = torch.optim.Adam(m.parameters(), 1e-3)
    for i in range(steps):
        loss = -m(sample_data(256)).mean() / (C * H * Wd)
        opt.zero_grad(); loss.backward(); opt.step()
        if i % 300 == 0 or i == steps - 1:
            with torch.no_grad():
                print(f"  step {i:4d}  bits/dim {bits_per_dim(m, sample_data(1000)).item():.4f}")
    return m

print("\\nTRAIN with invertible 1x1 conv (channels mix):")
m_on = train(use_1x1=True)
print("\\nABLATION: no 1x1 conv (channels never mix):")
m_off = train(use_1x1=False)

test = sample_data(2000)
with torch.no_grad():
    print(f"\\nFINAL held-out bits/dim WITH 1x1 conv : {bits_per_dim(m_on, test).item():.4f}")
    print(f"FINAL held-out bits/dim NO   1x1 conv : {bits_per_dim(m_off, test).item():.4f}")
# WITH the learned 1x1 conv the channels mix and the model fits the correlation -> lower (better)
# bits/dim. WITHOUT it, one half is always passed through and the fit is worse.
# (Our small run -- not the paper's reported number.)`
  };

  window.CODEVIZ["paper-glow"] = {
    question: "Does the learned invertible 1×1 convolution actually help? Compare bits/dimension (lower is better) over training, with the 1×1 conv ON vs. ablated OFF.",
    charts: [
      {
        type: "line",
        title: "Bits/dimension over training (ours, labeled): 1×1 conv ON beats the ablation",
        xlabel: "training step",
        ylabel: "held-out bits/dimension (lower is better)",
        series: [
          { name: "with invertible 1×1 conv", color: "#7ee787", points: [[0,1.6185],[200,1.4547],[400,1.4521],[600,1.449],[800,1.4513],[1000,1.4455],[1200,1.4497],[1400,1.446],[1600,1.4447],[1800,1.453],[1999,1.4513]] },
          { name: "ablation: no 1×1 conv", color: "#ff7b72", points: [[0,2.0458],[200,2.0552],[400,2.0454],[600,2.0468],[800,2.0493],[1000,2.0431],[1200,2.0467],[1400,2.0473],[1600,2.0422],[1800,2.0521],[1999,2.0467]] }
        ]
      }
    ],
    caption: "Our small run (PyTorch, seed 0), not the paper's reported numbers. A 4-step Glow (each step: actnorm → invertible 1×1 conv → affine coupling) trained by maximizing the exact change-of-variables log-likelihood (Eq. 7) on a tiny 4-channel toy 'image' whose channels are correlated in two pairs. Green = the full model; red = the ablation with the invertible 1×1 convolution deleted, so the same channel-halves are always passed through and the channels never mix. With the 1×1 conv the model fits the cross-channel correlation and settles at ≈1.45 bits/dimension; without it, it is stuck ≈0.6 bits/dim worse at ≈2.05 — the gap is the learned channel mixing the paper's 1×1 convolution buys you. (Lower bits/dimension is better.)",
    code: `import torch, torch.nn as nn, math
torch.manual_seed(0)
# Same tiny Glow as the CODE cell; here we LOG held-out bits/dimension every 100 steps for both
# runs (1x1 conv ON vs. ablated OFF) and plot the two curves. Lower is better.
# Reproduces: ON settles ~1.45 bits/dim; OFF is stuck ~2.05 (the channels can never mix).
# (Numbers are our small run, not the paper's reported bits/dimension.)
#
# --- worked example (matches the lesson): 1x1-conv log-det = h*w*log|det W| ---
W0 = torch.tensor([[2.0, 0.0], [1.0, 3.0]]); h, w = 4, 4
print("det(W) =", torch.det(W0).item(),
      " h*w*log|det W| =", round((h*w*torch.log(torch.abs(torch.det(W0)))).item(), 4))  # 6.0  28.6682

C, H, Wd = 4, 4, 4
Mcorr = torch.tensor([[1.0, 0.9, 0.0, 0.0], [0.9, 1.0, 0.0, 0.0],
                      [0.0, 0.0, 1.0, -0.9], [0.0, 0.0, -0.9, 1.0]])
Lchol = torch.linalg.cholesky(Mcorr)
def sample_data(n):
    z = torch.randn(n, C, H, Wd)
    return torch.einsum('ij,njhw->nihw', Lchol, z)

class ActNorm(nn.Module):
    def __init__(self, C):
        super().__init__()
        self.logs = nn.Parameter(torch.zeros(1, C, 1, 1)); self.b = nn.Parameter(torch.zeros(1, C, 1, 1))
        self.inited = False
    def forward(self, x):
        if not self.inited:
            with torch.no_grad():
                m = x.mean([0,2,3], keepdim=True); v = x.std([0,2,3], keepdim=True) + 1e-6
                self.b.data = -m/v; self.logs.data = -torch.log(v)
            self.inited = True
        return torch.exp(self.logs)*x + self.b, H*Wd*self.logs.sum()

class Inv1x1(nn.Module):
    def __init__(self, C):
        super().__init__(); Q, _ = torch.linalg.qr(torch.randn(C, C)); self.W = nn.Parameter(Q)
    def forward(self, x):
        return torch.einsum('ij,njhw->nihw', self.W, x), H*Wd*torch.slogdet(self.W)[1]

class AffineCoupling(nn.Module):
    def __init__(self, C, hid=32):
        super().__init__()
        self.net = nn.Sequential(nn.Conv2d(C//2, hid, 3, padding=1), nn.ReLU(),
                                 nn.Conv2d(hid, hid, 1), nn.ReLU(), nn.Conv2d(hid, C, 3, padding=1))
        self.net[-1].weight.data.zero_(); self.net[-1].bias.data.zero_()
    def forward(self, x):
        xa, xb = x.chunk(2, 1); logs, t = self.net(xb).chunk(2, 1); logs = torch.tanh(logs)
        return torch.cat([torch.exp(logs)*xa + t, xb], 1), logs.sum([1,2,3])

class Glow(nn.Module):
    def __init__(self, C, K=4, use_1x1=True):
        super().__init__(); self.use_1x1 = use_1x1
        self.an = nn.ModuleList([ActNorm(C) for _ in range(K)])
        self.iv = nn.ModuleList([Inv1x1(C) for _ in range(K)])
        self.co = nn.ModuleList([AffineCoupling(C) for _ in range(K)])
    def forward(self, x):
        ld = 0
        for k in range(len(self.an)):
            x, l = self.an[k](x); ld = ld + l
            if self.use_1x1: x, l = self.iv[k](x); ld = ld + l
            x, l = self.co[k](x); ld = ld + l
        logpz = (-0.5*x**2 - 0.5*math.log(2*math.pi)).sum([1,2,3])
        return logpz + ld

def bpd(m, x): return (-m(x)/x[0].numel()/math.log(2)).mean()

def train(use_1x1=True, steps=2000):
    torch.manual_seed(0); m = Glow(C, 4, use_1x1); opt = torch.optim.Adam(m.parameters(), 1e-3); curve = []
    for i in range(steps):
        loss = -m(sample_data(256)).mean()/(C*H*Wd)
        opt.zero_grad(); loss.backward(); opt.step()
        if i % 100 == 0 or i == steps-1:
            with torch.no_grad(): curve.append((i, round(bpd(m, sample_data(2000)).item(), 4)))
    return curve

print("curve_on  =", train(use_1x1=True))
print("curve_off =", train(use_1x1=False))`
  };
})();
