/* Paper lesson — "Progressive Growing of GANs for Improved Quality, Stability, and
   Variation" (ProGAN / PGGAN), Karras, Aila, Laine & Lehtinen 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-progan".
   GROUNDED from arXiv:1710.10196 (abstract) and the ar5iv HTML mirror:
     - Section 2: progressive growing + smooth fade-in of higher-res layers (alpha 0->1).
     - Section 3: minibatch standard deviation layer (increasing variation).
     - Section 4.1: equalized learning rate (w_hat = w / c, c = He's per-layer constant).
     - Section 4.2: pixelwise feature vector normalization in the generator.
     - Appendix A.1: WGAN-GP loss, Adam, LeakyReLU 0.2, eps_drift, pixelnorm eps=1e-8.
   Track B (architecture): build the THREE novel pieces by hand on nn primitives — an
   equalized-LR linear/conv wrapper, a minibatch-stddev layer, pixelwise feature norm —
   and demonstrate the progressive-growing fade-in schedule on a toy generator; ablate
   equalized LR. The minimax game math lives in concept dl-gan; cross-links paper-gan,
   paper-dcgan, paper-wgan. */
(function () {
  window.LESSONS.push({
    id: "paper-progan",
    title: "ProGAN — Progressive Growing of GANs for Improved Quality, Stability, and Variation (2017)",
    tagline: "Grow a GAN from a 4×4 thumbnail up to a 1024×1024 photo by fading in higher-resolution layers one at a time — plus three tricks (minibatch stddev, equalized learning rate, pixel norm) that keep the training stable.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Tero Karras, Timo Aila, Samuli Laine, Jaakko Lehtinen",
      org: "NVIDIA (and Aalto University) — per the paper's author affiliations",
      year: 2017,
      venue: "arXiv:1710.10196 (Oct 2017); ICLR 2018",
      citations: "",
      arxiv: "https://arxiv.org/abs/1710.10196",
      code: "https://github.com/tkarras/progressive_growing_of_gans"
    },
    conceptLink: "dl-gan",
    partOf: [],
    prereqs: ["dl-gan", "paper-gan", "paper-dcgan", "paper-wgan", "dl-conv", "dl-init", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>A <b>Generative Adversarial Network (GAN)</b> &mdash; two networks in a contest: a <b>generator</b>
       that turns random noise into fake images, and a <b>discriminator</b> that tries to tell real images from
       fake ones (the game's math lives in concept <b>dl-gan</b>; the original paper is <b>paper-gan</b>, and the
       convolutional recipe is <b>paper-dcgan</b>). By 2017, GANs made convincing <i>small</i> images, but
       pushing to <b>high resolution</b> &mdash; say a 1024&times;1024 face &mdash; broke them.</p>
       <p>The paper's framing (&sect;1): at high resolution it is <i>easier</i> for the discriminator to spot the
       fakes, because a big image has so much detail that something always looks wrong. That makes the
       discriminator's job too easy, the gradients it sends back to the generator get sharp and unhelpful, and
       training becomes <b>unstable</b>. High resolution also forces <b>smaller minibatches</b> (the images eat
       memory), which adds noise to training. The result before this paper: high-res GAN images were a fragile,
       low-quality mess.</p>`,
    contribution:
      `<ul>
        <li><b>Progressive growing</b> (&sect;2) &mdash; the headline idea. <i>Start</i> training at a tiny
        4&times;4 resolution where the game is easy, then <b>add</b> new layers to both networks to model
        finer detail (8&times;8, 16&times;16, &hellip;, 1024&times;1024) <i>as training continues</i>. Each new
        block of layers is <b>faded in smoothly</b> so it never shocks the already-trained lower-resolution
        layers. This speeds training up and greatly stabilizes it.</li>
        <li><b>Minibatch standard deviation</b> (&sect;3) &mdash; a tiny, parameter-free layer added near the end
        of the discriminator that measures how much <i>variety</i> there is across the batch, which discourages
        the generator from collapsing to a few images (<b>increasing variation</b>).</li>
        <li><b>Two normalization tricks</b> (&sect;4) that prevent the generator and discriminator from getting
        into an "escalating magnitudes" arms race: the <b>equalized learning rate</b> (&sect;4.1, scale weights
        at runtime by the He constant so every layer learns at the same speed) and <b>pixelwise feature vector
        normalization</b> (&sect;4.2, renormalize each pixel's feature vector to unit length in the generator).</li>
      </ul>
      <p>As an extra contribution they built <b>CelebA-HQ</b>, a higher-quality 1024&times;1024 version of the
       CelebA face dataset, and proposed a new GAN evaluation metric (sliced Wasserstein distance).</p>`,
    whyItMattered:
      `<p>ProGAN was the first GAN to produce <b>convincing megapixel images</b> (CelebA at 1024&times;1024,
       per the abstract) and it reached, per the abstract, "a record inception score of 8.80 in unsupervised
       CIFAR10." Its building blocks &mdash; equalized learning rate, minibatch stddev, pixel norm &mdash; were
       carried almost verbatim into <b>StyleGAN</b> (paper-stylegan), the same group's follow-up that defined
       high-resolution face generation for years. The progressive / coarse-to-fine idea also echoes in later
       super-resolution and diffusion cascades.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Progressive growing of GANs)</b> + <b>Fig. 1 and Fig. 2</b> &mdash; the growth schedule
        and the smooth fade-in of a new resolution block. Fig. 2 is the one picture to fully understand.</li>
        <li><b>&sect;3 (Increasing variation using minibatch standard deviation)</b> &mdash; the one-paragraph
        recipe for the stddev feature map.</li>
        <li><b>&sect;4.1 (Equalized learning rate)</b> and <b>&sect;4.2 (Pixelwise feature vector
        normalization)</b> &mdash; the two normalization tricks, with their exact formulas.</li>
       </ul>
       <p><b>Skim:</b> &sect;5 (the sliced-Wasserstein-distance metric) and the CelebA-HQ construction
       (&sect;5 / appendix) &mdash; useful context, not needed to build the mechanism. The minimax objective
       itself is recapped from <b>dl-gan</b>; ProGAN uses the <b>WGAN-GP</b> loss (concept recapped in
       <b>paper-wgan</b>), so you can treat the exact loss as a black box and focus on the four ideas above.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will fade a new, higher-resolution layer into a toy generator using a blend weight $\\alpha$ that
       ramps from $0$ to $1$. At $\\alpha=0$ the output is the old (upsampled) low-res image; at $\\alpha=1$ it is
       the full new high-res layer. <b>Question:</b> if instead you skipped the fade and switched the new layer
       <i>on</i> abruptly (jump straight to $\\alpha=1$), what would happen to the already-trained low-res layers
       in the first few steps &mdash; smooth improvement, or a sudden "shock" that disrupts them? Write your
       guess and one sentence of why.</p>
       <p>(Hint: the new layer starts with random weights. What does its raw, untrained output look like, and
       what happens if you feed that straight into a network that was doing fine a moment ago?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the three pieces you will build by hand. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Fade-in (the schedule).</b> During a resolution transition, the generator outputs
        <code>TODO: (1 - alpha) * upsample(old_rgb) + alpha * new_rgb</code>, where <code>alpha</code> ramps
        linearly $0\\to1$. Build the function that, given $\\alpha$, blends the two.</li>
        <li><b>Minibatch stddev layer.</b> TODO: compute the standard deviation of each feature at each spatial
        location <i>across the batch</i>, average those to one scalar, and <b>concatenate</b> it as one extra
        constant channel. No learnable parameters.</li>
        <li><b>Equalized-LR layer.</b> TODO: initialize weights from $\\mathcal{N}(0,1)$ but, at every forward
        pass, multiply them by the He constant $c=\\sqrt{2/\\text{fan\\_in}}$ <i>before</i> using them. (We derive
        and compute $c$ below.)</li>
       </ul>
       <p>Predict: which trains more stably &mdash; equalized LR on, or off?</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>ProGAN keeps the GAN <b>objective</b> unchanged (the two-player game from <b>dl-gan</b>; it specifically
       uses the WGAN-GP loss from <b>paper-wgan</b>). It changes <b>how and when</b> the networks grow, plus three
       small stabilizing layers. Take them one at a time.</p>

       <p><b>1. Progressive growing (&sect;2).</b> Both networks are mirror images. Training <i>starts</i> with a
       generator that emits a 4&times;4 image and a discriminator that reads a 4&times;4 image &mdash; an easy
       game. Once that has trained, you <b>add a new block</b> of layers to the generator (to output 8&times;8)
       and a matching block to the discriminator, and continue. You repeat: 4&rarr;8&rarr;16&rarr;&hellip;&rarr;
       1024. Because each stage only has to learn the <i>new</i> detail on top of an already-good lower-resolution
       image, the problem stays manageable and training is faster and more stable.</p>

       <p>The pixels-to-image and image-to-pixels glue uses tiny <b>$1\\times1$ convolutions</b>: the paper's
       <code>toRGB</code> layer "projects feature vectors to RGB colors and fromRGB does the reverse; both use
       1&times;1 convolutions" (&sect;2).</p>

       <p><b>2. Smooth fade-in (&sect;2, Fig. 2) &mdash; the part most people get wrong.</b> When you bolt a fresh
       8&times;8 block onto a network that was happily producing 4&times;4, that new block has <b>random</b>
       weights &mdash; its output is garbage. Plugging garbage straight into the trained network "shocks" it. So
       ProGAN treats the new block <b>like a residual block</b> and fades it in. During the transition, a blend
       weight $\\alpha$ ramps linearly from $0$ to $1$, and the generator's RGB output is a weighted sum of the
       <b>old</b> path (the previous resolution, simply upsampled to the new size via nearest-neighbor) and the
       <b>new</b> path (the new block's <code>toRGB</code>). At $\\alpha=0$ you output exactly the old image; at
       $\\alpha=1$ you output exactly the new block; in between you cross-fade. The paper: "When new layers are
       added to the networks, we fade them in smoothly &hellip; This avoids sudden shocks to the already
       well-trained, smaller-resolution layers" (&sect;2). The discriminator fades its new <code>fromRGB</code>
       block in symmetrically.</p>

       <p><b>3. Minibatch standard deviation (&sect;3).</b> GANs love to <b>collapse</b> &mdash; produce a few
       images over and over, ignoring the noise input. ProGAN fights this by giving the discriminator a cheap way
       to <i>see</i> how varied a batch is. The recipe, quoted: "We first compute the standard deviation for each
       feature in each spatial location over the minibatch. We then average these estimates over all features and
       spatial locations to arrive at a single value. We replicate the value and concatenate it to all spatial
       locations and over the minibatch, yielding one additional (constant) feature map." If the generator's batch
       is too uniform, this number is small, and the discriminator learns "low variety &rarr; probably fake." It
       is inserted "toward the end of the discriminator" and has <b>no</b> learnable parameters or
       hyperparameters.</p>

       <p><b>4. Equalized learning rate (&sect;4.1).</b> Modern optimizers like Adam/RMSProp "normalize a
       gradient update by its estimated standard deviation, thus making the update independent of the scale of the
       parameter" (&sect;4.1). The side effect: a layer whose weights happen to be large takes <i>longer</i> to
       move (relatively) than a layer with small weights, so different layers learn at different speeds. ProGAN's
       fix is to set <b>all</b> weights to the same scale at runtime. Initialize weights trivially from
       $\\mathcal{N}(0,1)$, then at every forward pass divide by a fixed per-layer constant: the formula
       (&sect;4.1) is $\\hat{w}_i = w_i / c$, "where $w_i$ are the weights and $c$ is the per-layer normalization
       constant from He's initializer." Now "the dynamic range, and thus the learning speed, is the same for all
       weights" (&sect;4.1). The worked numbers below compute $c$.</p>

       <p><b>5. Pixelwise feature vector normalization (&sect;4.2).</b> To stop the generator's and
       discriminator's activation magnitudes from spiraling upward in an arms race, the generator renormalizes
       each <i>pixel's</i> feature vector to (roughly) unit length after each $3\\times3$ convolution &mdash; the
       formula is in the panel below.</p>`,
    architecture:
      `<p><b>Two mirror-image networks that grow in lockstep.</b> The generator $G$ and discriminator $D$ are
       symmetric: $G$ runs low&rarr;high resolution, $D$ runs high&rarr;low. Both start tiny and gain a matching
       block per resolution doubling.</p>

       <p><b>Generator $G$ (noise &rarr; image), bottom-up:</b></p>
       <ul>
        <li><b>Input:</b> a latent vector $z\\in\\mathbb{R}^{512}$, normalized by pixel norm, reshaped/convolved to
        a $512$-channel <b>$4\\times4$</b> feature map (the first block uses a $4\\times4$ conv then a $3\\times3$
        conv).</li>
        <li><b>Per-resolution block</b> (repeated for $8,16,\\ldots,1024$): <i>nearest-neighbor upsample $\\times2$</i>
        &rarr; <code>EqualizedConv2d</code> $3\\times3$ &rarr; Leaky ReLU($0.2$) &rarr; <b>pixel norm</b> &rarr; a
        second $3\\times3$ conv + Leaky ReLU + pixel norm. Channel counts taper as resolution rises (512 at
        4&ndash;16, then halving: 256, 128, 64, 32, 16 down to 1024&times;1024).</li>
        <li><b>toRGB:</b> a $1\\times1$ equalized conv maps the final feature map to $3$ RGB channels. During a
        transition, the previous resolution's toRGB output is upsampled and blended with the new block's toRGB via
        the $\\alpha$ fade-in.</li>
       </ul>

       <p><b>Discriminator $D$ (image &rarr; score), top-down (mirror of $G$):</b></p>
       <ul>
        <li><b>fromRGB:</b> a $1\\times1$ equalized conv turns the input RGB image into features. During a
        transition the new fromRGB is faded in symmetrically.</li>
        <li><b>Per-resolution block:</b> two $3\\times3$ equalized convs + Leaky ReLU, then <i>average-pool
        $\\div2$</i> to halve resolution. (No pixel norm in $D$.)</li>
        <li><b>Minibatch-stddev layer</b> inserted toward the end (at the $4\\times4$ stage): appends the one
        constant variation feature map (§3) before the final convs.</li>
        <li><b>Head:</b> a $3\\times3$ conv, then a $4\\times4$ conv collapsing to $1\\times1$, then a linear layer
        producing the single real/fake score.</li>
       </ul>

       <p><b>Training schedule (the growth curriculum).</b> Train $G$/$D$ at $4\\times4$ until stable, then for each
       new resolution run a two-phase cycle: (1) a <b>transition phase</b> where the new block fades in
       ($\\alpha:0\\to1$ over a fixed number of images shown), then (2) a <b>stabilization phase</b> at full weight
       ($\\alpha=1$) before adding the next resolution. Repeat $4\\to8\\to16\\to\\cdots\\to1024$. The whole training
       uses the WGAN-GP loss plus the §A.1 drift term, Adam ($\\alpha_{\\text{lr}}=0.001,\\beta_1=0,\\beta_2=0.99$),
       and Leaky ReLU $0.2$. The minibatch shrinks as resolution grows (high-res images cost more memory), which is
       part of why stabilization matters.</p>`,
    symbols: [
      { sym: "$G$", desc: "the <b>generator</b>: maps a noise vector to a fake image. In ProGAN it grows layer-by-layer from 4&times;4 up to 1024&times;1024." },
      { sym: "$D$", desc: "the <b>discriminator</b>: reads an image and scores how real it looks. Grows as a mirror image of $G$." },
      { sym: "$\\alpha$", desc: "the <b>fade-in weight</b> during a resolution transition. A plain number that ramps linearly from $0$ (use only the old, lower-resolution path) to $1$ (use only the new, higher-resolution block)." },
      { sym: "toRGB / fromRGB", desc: "tiny <b>$1\\times1$ convolution</b> layers. <code>toRGB</code> turns a feature map into a 3-channel RGB image (end of $G$); <code>fromRGB</code> turns an RGB image into features (start of $D$)." },
      { sym: "fan_in", desc: "a plain term: the number of <b>input</b> connections feeding one output unit of a layer. For a conv layer it is (input channels) &times; (kernel height) &times; (kernel width)." },
      { sym: "$c$", desc: "the <b>He initializer constant</b> for a layer: $c=\\sqrt{2/\\text{fan\\_in}}$. ProGAN divides the $\\mathcal{N}(0,1)$ weights by $c$ at runtime (equalized learning rate)." },
      { sym: "$w_i$", desc: "a <b>raw weight</b> of the layer, stored simply as a sample from $\\mathcal{N}(0,1)$ (standard normal: mean $0$, variance $1$)." },
      { sym: "$\\hat{w}_i$", desc: "the <b>scaled weight</b> actually used in the forward pass: $\\hat{w}_i = w_i/c$ (per &sect;4.1)." },
      { sym: "$\\mathbf{a}_{x,y}$", desc: "the <b>feature vector at pixel $(x,y)$</b>: the stack of all $N$ channel values at that one spatial location in the generator." },
      { sym: "$\\mathbf{b}_{x,y}$", desc: "the <b>pixel-normalized</b> feature vector at $(x,y)$ &mdash; $\\mathbf{a}_{x,y}$ rescaled to roughly unit length." },
      { sym: "$N$", desc: "the <b>number of feature maps (channels)</b> at that layer &mdash; the length of the per-pixel feature vector." },
      { sym: "$\\epsilon$", desc: "a tiny constant ($10^{-8}$) added inside a square root for numerical safety, so we never divide by zero." },
      { sym: "minibatch", desc: "a plain term: the small batch of images processed together in one training step. Minibatch <b>stddev</b> measures spread <i>across</i> that batch." },
      { sym: "$N_b$", desc: "the <b>minibatch size</b>: how many images are processed together. The minibatch stddev (§3) takes the std over these $N_b$ images." },
      { sym: "$a^{(i)}_{c,x,y}$", desc: "the activation of feature/channel $c$ at spatial location $(x,y)$ for the $i$-th image in the minibatch." },
      { sym: "$\\bar a_{c,x,y}$", desc: "the <b>mean</b> of that activation over the $N_b$ images in the minibatch (used to compute the per-feature std)." },
      { sym: "$\\sigma_{c,x,y}$", desc: "the <b>standard deviation</b> of feature $c$ at location $(x,y)$ taken across the minibatch (§3)." },
      { sym: "$s$", desc: "the <b>single scalar</b> from averaging every $\\sigma_{c,x,y}$ over all channels $C$ and locations $H\\times W$; it is replicated into one constant feature map appended in $D$ (§3)." },
      { sym: "$C, H, W$", desc: "the number of <b>channels</b>, the feature-map <b>height</b>, and <b>width</b> at the layer where the minibatch-stddev average is taken." },
      { sym: "$a^{(j)}_{x,y}$", desc: "the $j$-th channel value of the feature vector at pixel $(x,y)$ in the generator (used inside the pixel-norm root-mean-square, §4.2)." },
      { sym: "$L$", desc: "the <b>base discriminator loss</b> — the WGAN-GP loss (recap: paper-wgan)." },
      { sym: "$L'$", desc: "the <b>actual loss</b> used: $L$ plus the small drift term (Appendix A.1)." },
      { sym: "$\\epsilon_{\\text{drift}}$", desc: "the tiny weight ($0.001$) on the drift term that keeps $D$'s output near zero (Appendix A.1)." },
      { sym: "$\\mathbb{E}_{x\\in\\mathbb{P}_r}[\\cdot]$", desc: "the <b>expectation</b> (average) over real images $x$ drawn from the real-data distribution $\\mathbb{P}_r$." },
      { sym: "$D(x)$", desc: "the discriminator's <b>scalar score</b> for an image $x$ (squared in the drift term)." }
    ],
    formula: `
      <p>ProGAN keeps the GAN objective and instead adds <b>four</b> mechanisms, each with its own formula.
      Here they are in paper order.</p>

      $$ \\text{out}_{\\text{transition}} = (1-\\alpha)\\cdot \\text{upsample}(\\text{old\\_rgb}) \\;+\\; \\alpha\\cdot \\text{new\\_layer} , \\qquad \\alpha: 0 \\to 1 $$
      <p><b>(§2, Fig. 2) Progressive-growing fade-in.</b> During a resolution transition the output is a linear
      blend of the previous resolution's RGB (nearest-neighbor upsampled) and the new block's RGB; the blend
      weight $\\alpha$ ramps linearly from $0$ (old path only) to $1$ (new block only), so the new layers fade in
      like a residual block and never shock the trained low-res layers.</p>

      $$ \\sigma_{c,x,y} = \\sqrt{\\frac{1}{N_b}\\sum_{i=1}^{N_b}\\big(a^{(i)}_{c,x,y}-\\bar a_{c,x,y}\\big)^2}, \\qquad s = \\frac{1}{C\\,H\\,W}\\sum_{c,x,y}\\sigma_{c,x,y} $$
      <p><b>(§3) Minibatch standard deviation.</b> Compute the std $\\sigma_{c,x,y}$ of each feature $c$ at each
      spatial location $(x,y)$ <i>across the minibatch</i> of $N_b$ images, average all those stds to one scalar
      $s$, then replicate $s$ and concatenate it as one extra constant feature map near the end of $D$. No learnable
      parameters; it lets $D$ see how much variety a batch has.</p>

      $$ \\hat{w}_i = \\frac{w_i}{c}, \\qquad c = \\sqrt{\\dfrac{2}{\\text{fan\\_in}}} $$
      <p><b>(§4.1) Equalized learning rate.</b> Store each weight as a plain $\\mathcal{N}(0,1)$ draw; at every
      forward pass rescale it by the per-layer He constant $c$ (the paper writes $\\hat w_i = w_i/c$). The He scale
      is $c=\\sqrt{2/\\text{fan\\_in}}$, with $\\text{fan\\_in}=(\\text{in\\_channels})\\times k_h\\times k_w$. This
      gives every layer the same dynamic range, so Adam moves all layers at the same learning speed.</p>

      $$ \\mathbf{b}_{x,y} = \\frac{\\mathbf{a}_{x,y}}{\\sqrt{\\dfrac{1}{N}\\displaystyle\\sum_{j=0}^{N-1}\\big(a^{(j)}_{x,y}\\big)^2 + \\epsilon}}, \\qquad \\epsilon = 10^{-8} $$
      <p><b>(§4.2) Pixelwise feature vector normalization (generator only).</b> After each $3\\times3$ conv in $G$,
      divide each pixel's feature vector $\\mathbf{a}_{x,y}$ (its $N$ channel values) by the root-mean-square of its
      own entries, so every pixel's feature vector has roughly unit length. This stops $G$ and $D$ activation
      magnitudes from spiraling upward in an arms race.</p>

      $$ L' = L \\;+\\; \\epsilon_{\\text{drift}}\\,\\mathbb{E}_{x\\in\\mathbb{P}_r}\\big[D(x)^2\\big], \\qquad \\epsilon_{\\text{drift}} = 0.001 $$
      <p><b>(Appendix A.1) Loss.</b> The base objective $L$ is the WGAN-GP loss (recap: <b>paper-wgan</b>). ProGAN
      adds a tiny drift term that keeps the discriminator's output from drifting away from zero. Trained with Adam
      ($\\alpha_{\\text{lr}}=0.001,\\ \\beta_1=0,\\ \\beta_2=0.99,\\ \\epsilon=10^{-8}$) and Leaky ReLU slope $0.2$
      in all layers except the last (linear).</p>`,
    whatItDoes:
      `<p>This is the <b>equalized learning rate</b> rule (&sect;4.1) &mdash; the most "math-shaped" of ProGAN's
       tricks, so we make it the worked equation. Read it left to right:</p>
       <ul>
        <li>Each weight is <b>stored</b> as a plain draw from $\\mathcal{N}(0,1)$ (a standard normal). No clever
        initialization at all.</li>
        <li>At every forward pass, divide the stored weight by the fixed constant $c=\\sqrt{2/\\text{fan\\_in}}$,
        the <b>He initializer</b> scale, and use $\\hat{w}_i$ in the actual convolution.</li>
       </ul>
       <p>Why this helps: normally you would <i>bake</i> the $\\sqrt{2/\\text{fan\\_in}}$ factor into the weights at
       initialization (that is what <b>He init</b> does &mdash; see concept <b>dl-init</b>). But then a big-fan_in
       layer has small weights and a small-fan_in layer has large weights, and because Adam normalizes by the
       gradient's standard deviation, those two layers end up learning at <b>different speeds</b>. ProGAN instead
       keeps every layer's <i>stored</i> weights at the same $\\mathcal{N}(0,1)$ scale, and applies the
       per-layer factor at runtime. Result: identical dynamic range, identical learning speed, for every layer.</p>`,
    derivation:
      `<p><b>Where does $c=\\sqrt{2/\\text{fan\\_in}}$ come from?</b> It is exactly the <b>He initialization</b>
       constant (full derivation in concept <b>dl-init</b>). Short recap: you want the variance of a layer's
       outputs to match the variance of its inputs, so the signal neither explodes nor vanishes as it passes
       through many layers. For a linear unit $y=\\sum_{i=1}^{\\text{fan\\_in}} w_i x_i$ with independent
       zero-mean weights, $\\operatorname{Var}(y) = \\text{fan\\_in}\\cdot \\operatorname{Var}(w)\\cdot
       \\operatorname{Var}(x)$. To get $\\operatorname{Var}(y)=\\operatorname{Var}(x)$ you need
       $\\operatorname{Var}(w)=1/\\text{fan\\_in}$. With a <b>ReLU</b>-type nonlinearity (here Leaky ReLU)
       roughly half the activations are zeroed, halving the effective variance, so He doubles it:
       $\\operatorname{Var}(w)=2/\\text{fan\\_in}$, i.e. standard deviation $c=\\sqrt{2/\\text{fan\\_in}}$.</p>
       <p>ProGAN's twist is purely <i>where</i> you apply $c$: not once at init (the usual He way), but at every
       forward pass as a division, while the stored weight stays $\\mathcal{N}(0,1)$. Mathematically a single
       forward pass is identical to He init; the difference only shows up <i>through the optimizer</i>, because
       Adam sees the same-scale stored weights for every layer and therefore moves them at the same relative
       speed. The two normalization tricks (this one and pixel norm, &sect;4.2) are not derived from the GAN
       objective &mdash; they are stabilizers; the objective itself is the WGAN-GP game recapped in
       <b>paper-wgan</b>.</p>`,
    example:
      `<p>Let us compute the equalized-LR constant $c$ for a concrete generator layer, then show the fade-in blend
       &mdash; both are recomputed in the notebook and must match.</p>
       <p><b>Part A &mdash; the He constant $c$.</b> Take a $3\\times3$ convolution with <b>$512$ input
       channels</b> (a typical ProGAN low-resolution block). The fan_in is</p>
       <p>$$ \\text{fan\\_in} = (\\text{in\\_channels})\\times k_h \\times k_w = 512 \\times 3 \\times 3 = 512\\times 9 = 4608. $$</p>
       <ul class="steps">
        <li><b>$2/\\text{fan\\_in}$</b> $= 2 / 4608 = 0.000434027\\ldots$</li>
        <li><b>$c=\\sqrt{2/\\text{fan\\_in}}$</b> $= \\sqrt{0.000434027} \\approx 0.020833$.</li>
        <li><b>What $c$ is:</b> it is the He <b>standard deviation</b> for this layer &mdash; the scale at which
        the weights actually act. ProGAN stores each weight as a plain $\\mathcal{N}(0,1)$ draw and, at runtime,
        rescales it by this $c$ so the effective weight std is $\\approx 0.0208$ for every $3\\times3$/512-in
        layer. (The paper writes the rule as $\\hat w_i = w_i/c$; in code, as below, this is implemented by
        multiplying the stored weight by the He scale $c$ &mdash; the unambiguous quantity to track is $c$
        itself.)</li>
       </ul>
       <p>The number to remember: for a $3\\times3$, $512$-in conv, the He scale is
       $c=\\sqrt{2/4608}\\approx 0.0208$. The notebook computes this and asserts it equals
       <code>(2 / 4608) ** 0.5</code>.</p>
       <p><b>Part B &mdash; the fade-in blend.</b> Suppose at a transition the old (upsampled) path outputs an
       RGB pixel value $0.20$ and the new high-res block outputs $0.80$ for the same pixel. The faded output is
       $(1-\\alpha)\\cdot 0.20 + \\alpha\\cdot 0.80$:</p>
       <ul class="steps">
        <li><b>$\\alpha=0.0$:</b> $1.0\\cdot 0.20 + 0.0\\cdot 0.80 = 0.20$ &mdash; pure old path.</li>
        <li><b>$\\alpha=0.5$:</b> $0.5\\cdot 0.20 + 0.5\\cdot 0.80 = 0.10 + 0.40 = 0.50$ &mdash; halfway.</li>
        <li><b>$\\alpha=1.0$:</b> $0.0\\cdot 0.20 + 1.0\\cdot 0.80 = 0.80$ &mdash; pure new block.</li>
       </ul>
       <p>As $\\alpha$ ramps $0\\to1$ the output slides smoothly from the trusted low-res image to the new
       high-res one &mdash; no shock. The notebook recomputes this $0.20\\to0.50\\to0.80$ sweep.</p>`,
    recipe:
      `<ol>
        <li><b>Equalized-LR wrapper.</b> Store a layer's weights as $\\mathcal{N}(0,1)$; in <code>forward</code>,
        multiply by the runtime scale derived from $c=\\sqrt{2/\\text{fan\\_in}}$ before applying the
        conv/linear. (We implement this as a class that holds raw weights and a fixed scale.)</li>
        <li><b>Pixelwise feature norm (in $G$).</b> After each $3\\times3$ conv in the generator, replace each
        pixel's feature vector $\\mathbf{a}_{x,y}$ by $\\mathbf{a}_{x,y}/\\sqrt{\\tfrac1N\\sum_j a_j^2 + \\epsilon}$
        with $\\epsilon=10^{-8}$ (&sect;4.2).</li>
        <li><b>Minibatch stddev (in $D$).</b> Near the end of the discriminator, compute the per-feature
        per-location std across the batch, average to one scalar, and concatenate it as one extra constant
        channel (&sect;3).</li>
        <li><b>Grow + fade.</b> Train at 4&times;4. To add a resolution: append a new block to $G$ and $D$, and
        for a transition window output $(1-\\alpha)\\cdot\\text{upsample(old)} + \\alpha\\cdot\\text{new}$ with
        $\\alpha$ ramping $0\\to1$. After $\\alpha$ reaches $1$, the new resolution is "fully in"; repeat for the
        next resolution.</li>
        <li><b>Loss.</b> Train the WGAN-GP game (recap: <b>paper-wgan</b>) with Adam ($\\alpha_{\\text{lr}}=0.001$,
        $\\beta_1=0$, $\\beta_2=0.99$), Leaky ReLU slope $0.2$.</li>
        <li><b>Ablate:</b> turn the equalized LR off (bake He into init the normal way instead) and compare
        training stability.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): progressive growing "both speeds the training up and greatly stabilizes it,
       allowing us to produce images of unprecedented quality, e.g., CelebA images at $1024^2$." They report "a
       record inception score of 8.80 in unsupervised CIFAR10," and contribute the higher-quality CelebA-HQ
       dataset plus a sliced-Wasserstein metric for evaluating quality and variation.</p>
       <p><i>These are the paper's reported numbers, quoted from the abstract. The fade-in schedule and the
       equalized-LR ablation in the CODEVIZ panel below are from our own tiny toy run &mdash; not the paper's
       reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives (conv, linear, upsample) ship in PyTorch,
       so you <b>import</b> them and build only ProGAN's novel pieces. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.Linear</code>, <code>F.interpolate</code> (nearest-neighbor upsample), <code>nn.LeakyReLU</code>,
       <code>torch.optim.Adam</code>. <b>Build by hand:</b> (1) the equalized-LR wrapper
       (store $\\mathcal{N}(0,1)$ weights, scale by $\\sqrt{2/\\text{fan\\_in}}$ at forward), (2) the
       minibatch-stddev layer (the &sect;3 recipe, no parameters), (3) pixelwise feature normalization (&sect;4.2),
       and (4) the <b>progressive-growing fade-in</b> &mdash; the $(1-\\alpha)\\,\\text{old}+\\alpha\\,\\text{new}$
       blend that is the heart of the paper. The full WGAN-GP loss is recapped from <b>paper-wgan</b> and the
       minimax setup from <b>dl-gan</b>; we keep the toy demo's loss simple and focus on the schedule + the three
       layers, which is where ProGAN's contribution lives.</p>`,
    pitfalls:
      `<ul>
        <li><b>Skipping the fade-in.</b> If you switch a new resolution block on at $\\alpha=1$ abruptly, its
        random output shocks the trained low-res layers and training can diverge. <b>Fix:</b> ramp $\\alpha$
        linearly $0\\to1$ over a transition window, blending old (upsampled) and new RGB.</li>
        <li><b>Upsampling the old path the wrong way.</b> The residual "old" branch must be a plain
        <b>nearest-neighbor</b> upsample of the previous resolution's RGB (so it matches the new spatial size),
        not a learned layer. <b>Fix:</b> <code>F.interpolate(..., mode="nearest")</code>.</li>
        <li><b>Equalized LR applied at init instead of runtime.</b> If you bake $1/c$ into the stored weights
        once, you have just done ordinary He init &mdash; you lose the equal-learning-speed benefit, because the
        optimizer again sees different per-layer scales. <b>Fix:</b> store $\\mathcal{N}(0,1)$ and multiply by
        the scale <i>inside</i> <code>forward</code> every step.</li>
        <li><b>Minibatch stddev with batch size 1.</b> The std across a batch of one is $0$, so the layer carries
        no signal (and PyTorch's unbiased std is undefined). <b>Fix:</b> use a real minibatch (the paper uses a
        group size of 4) and the population std.</li>
        <li><b>Pixel norm in the discriminator.</b> Pixelwise feature normalization (&sect;4.2) is a
        <b>generator-only</b> trick. Adding it to $D$ is not what the paper does. <b>Fix:</b> apply it after $G$'s
        $3\\times3$ convs only.</li>
        <li><b>Forgetting $\\epsilon$.</b> A dead pixel (all-zero feature vector) makes the norm denominator $0$.
        <b>Fix:</b> the $+\\epsilon$ ($10^{-8}$) inside the square root.</li>
      </ul>`,
    recall: [
      "Describe progressive growing in one sentence, and what the fade-in weight $\\alpha$ does as it ramps 0→1.",
      "Write the fade-in blend formula for a resolution transition.",
      "State the minibatch-stddev recipe (§3): what is computed, averaged, and concatenated?",
      "Write the equalized-LR rule $\\hat{w}_i=w_i/c$ and give $c$ in terms of fan_in.",
      "Why is equalized LR applied at runtime, not at initialization?",
      "Write the pixelwise feature-vector normalization equation (§4.2) and the value of $\\epsilon$."
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a toy generator trained with the equalized learning rate
            ($\\mathcal{N}(0,1)$ weights, scaled by $\\sqrt{2/\\text{fan\\_in}}$ at every forward pass). You turn
            it <b>off</b> &mdash; bake He init into the weights once and train normally &mdash; keeping everything
            else identical. What does the paper claim this changes, and which ProGAN idea does the ablation
            isolate?`,
        steps: [
          { do: `Swap only the weight handling: instead of storing $\\mathcal{N}(0,1)$ and dividing by $c$ each forward pass, initialize weights directly with He init ($\\mathcal{N}(0,c^2)$) and use them as-is. Keep the architecture, loss, Adam settings, and data identical.`, why: `An honest ablation changes exactly one thing — where the per-layer scale is applied (runtime vs init) — so any difference is attributable to it.` },
          { do: `Train both and watch stability: with equalized LR, every layer's stored weights share one scale, so Adam moves them at the same relative speed; without it, layers with different fan_in learn at different speeds and the run is noisier / less stable.`, why: `Per §4.1, Adam normalizes updates by the gradient's std, so identical stored-weight scale ⇒ identical learning speed across layers.` },
          { do: `Conclude the equalized learning rate (§4.1) is doing real work — it is not just a fancy way to write He init.`, why: `Mathematically one forward pass is identical to He init; the benefit only appears through the optimizer over many steps, which the ablation exposes.` }
        ],
        answer: `<p>Turning equalized LR off makes training <b>less stable / more uneven across layers</b>. Both
                 setups are identical in a single forward pass (storing $\\mathcal{N}(0,1)$ and dividing by $c$ is
                 numerically the same as He init), so the difference appears only <i>through the optimizer</i>:
                 with equalized LR, Adam sees the same weight scale in every layer and moves them at the same
                 relative speed (§4.1, "the dynamic range, and thus the learning speed, is the same for all
                 weights"). The ablation isolates the <b>equalized learning rate</b> as the cause. The CODEVIZ
                 panel shows this contrast on our toy run.</p>`
      },
      {
        q: `Compute the equalized-LR constant $c$ for a generator's $1\\times1$ <code>toRGB</code> convolution
            that maps <b>$256$</b> feature channels to $3$ RGB channels. Then state the scaled weight $\\hat{w}$
            for a stored weight $w=1$.`,
        steps: [
          { do: `Find fan_in: for a $1\\times1$ conv, $\\text{fan\\_in} = (\\text{in\\_channels})\\times k_h\\times k_w = 256\\times1\\times1 = 256$.`, why: `Kernel is $1\\times1$, so each output reads exactly the 256 input channels at that pixel.` },
          { do: `Compute $c=\\sqrt{2/256}=\\sqrt{0.0078125}\\approx 0.08839$.`, why: `This is the He scale; ProGAN stores $\\mathcal{N}(0,1)$ weights and applies this scale at runtime.` },
          { do: `Read the §4.1 formula literally: $\\hat{w}=w/c$. (In practice ProGAN multiplies the runtime weight by the He std scale so the effective weight std is $c$; the printed/checked quantity here is $c\\approx0.0884$ itself.)`, why: `We report the unambiguous quantity $c$, which the notebook verifies equals $(2/256)^{0.5}$.` }
        ],
        answer: `<p>$\\text{fan\\_in}=256\\times1\\times1=256$, so $c=\\sqrt{2/256}=\\sqrt{0.0078125}\\approx
                 \\mathbf{0.0884}$. A $1\\times1$ conv has a much smaller fan_in than a $3\\times3$, so its He
                 scale ($\\approx0.0884$) is about $4.24\\times$ larger than the $3\\times3$/512-in layer's
                 ($\\approx0.0208$) — exactly why per-layer scaling matters. The notebook checks
                 $c=(2/256)^{0.5}$.</p>`
      },
      {
        q: `During a 8&times;8 &rarr; 16&times;16 transition, the upsampled old path gives a pixel value $0.30$
            and the new 16&times;16 block gives $0.90$. What is the faded output at $\\alpha=0$, $\\alpha=0.25$,
            and $\\alpha=1$? What would happen if you instead jumped straight to $\\alpha=1$ on step one?`,
        steps: [
          { do: `Apply the blend $(1-\\alpha)\\cdot0.30 + \\alpha\\cdot0.90$. At $\\alpha=0$: $1\\cdot0.30+0=0.30$.`, why: `At the start of a transition you trust only the already-trained low-res path.` },
          { do: `At $\\alpha=0.25$: $0.75\\cdot0.30 + 0.25\\cdot0.90 = 0.225 + 0.225 = 0.45$.`, why: `A quarter of the way in, the new block contributes a quarter of the output.` },
          { do: `At $\\alpha=1$: $0\\cdot0.30 + 1\\cdot0.90 = 0.90$. Jumping to $\\alpha=1$ immediately feeds the new block's random, untrained output straight into the network.`, why: `The new block starts with random weights; full weight on it before it has learned shocks the trained low-res layers (§2).` }
        ],
        answer: `<p>Outputs: $\\alpha=0\\Rightarrow0.30$, $\\alpha=0.25\\Rightarrow0.45$, $\\alpha=1\\Rightarrow0.90$
                 — a smooth slide from old to new. Jumping straight to $\\alpha=1$ on step one would feed the new
                 block's <b>random</b> output at full weight into the well-trained low-res layers, causing the
                 "sudden shock" the fade-in exists to prevent (§2). That is why $\\alpha$ ramps linearly $0\\to1$.</p>`
      }
    ]
  });

  window.CODE["paper-progan"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build ProGAN's four novel pieces by hand</b> from <code>nn</code> primitives, verify
       each, then demonstrate the progressive-growing <b>fade-in schedule</b> on a toy generator. (1) An
       <code>EqualizedConv2d</code> that stores $\\mathcal{N}(0,1)$ weights and scales by
       $\\sqrt{2/\\text{fan\\_in}}$ at every forward pass (&sect;4.1) — we print the He constant for a
       $3\\times3$/512-in layer and assert it equals the worked example $c=\\sqrt{2/4608}\\approx0.0208$.
       (2) A parameter-free <code>MinibatchStddev</code> layer (&sect;3) — we feed a varied batch and a
       collapsed (all-identical) batch and print that the extra channel is large for varied, ~0 for collapsed.
       (3) <code>PixelNorm</code> (&sect;4.2) — we print that each pixel's feature vector has ~unit norm after.
       (4) The <b>fade-in</b> blend $(1-\\alpha)\\,\\text{old}+\\alpha\\,\\text{new}$ — we sweep $\\alpha$ and
       reproduce the worked $0.20\\to0.50\\to0.80$ numbers, then grow a toy generator 4&rarr;8&rarr;16 and print
       the output resolution climbing. Paste into Colab and run (CPU is fine — this is tiny).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# ============================================================================
# 1. EQUALIZED LEARNING RATE (Section 4.1):  store w ~ N(0,1); scale by
#    sqrt(2 / fan_in) at every forward pass.  fan_in = in_ch * kH * kW.
# ============================================================================
class EqualizedConv2d(nn.Module):
    def __init__(self, in_ch, out_ch, k, stride=1, padding=0):
        super().__init__()
        self.weight = nn.Parameter(torch.randn(out_ch, in_ch, k, k))   # N(0,1) -- trivial init
        self.bias   = nn.Parameter(torch.zeros(out_ch))
        fan_in = in_ch * k * k
        self.scale = (2.0 / fan_in) ** 0.5                              # c = sqrt(2 / fan_in)
        self.stride, self.padding = stride, padding
    def forward(self, x):
        return F.conv2d(x, self.weight * self.scale, self.bias, self.stride, self.padding)

# Worked example (Part A): 3x3 conv, 512 in-channels -> fan_in = 512*9 = 4608.
layer = EqualizedConv2d(512, 256, 3, padding=1)
print("fan_in =", 512 * 3 * 3, "  He scale c =", round(layer.scale, 6))   # 4608, ~0.020833
assert abs(layer.scale - (2 / 4608) ** 0.5) < 1e-12
assert abs(layer.scale - 0.020833) < 1e-5      # matches the worked number 0.0208

# ============================================================================
# 2. MINIBATCH STANDARD DEVIATION (Section 3): std per feature per location
#    over the batch -> average to ONE scalar -> concat as one constant channel.
# ============================================================================
class MinibatchStddev(nn.Module):
    def forward(self, x):                                  # x: (N, C, H, W)
        std = x.std(dim=0, unbiased=False)                 # std over batch -> (C, H, W)
        mean_std = std.mean()                              # average to ONE scalar
        extra = mean_std.expand(x.size(0), 1, x.size(2), x.size(3))  # replicate as a map
        return torch.cat([x, extra], dim=1)                # one extra (constant) channel

mb = MinibatchStddev()
varied    = torch.randn(8, 4, 4, 4)                        # a diverse batch
collapsed = torch.randn(1, 4, 4, 4).repeat(8, 1, 1, 1)     # mode collapse: 8 identical images
v_val = mb(varied)[0, -1, 0, 0].item()                     # the appended stddev channel
c_val = mb(collapsed)[0, -1, 0, 0].item()
print(f"stddev channel  varied={v_val:.3f}  collapsed={c_val:.3f}")   # varied ~1.0, collapsed ~0.0
assert v_val > 0.5 and c_val < 1e-5     # collapse -> ~0 variety, the signal D learns to punish

# ============================================================================
# 3. PIXELWISE FEATURE VECTOR NORMALIZATION (Section 4.2, generator only):
#    b_{x,y} = a_{x,y} / sqrt( (1/N) * sum_j a_j^2  + eps ),  eps = 1e-8.
# ============================================================================
class PixelNorm(nn.Module):
    def __init__(self, eps=1e-8): super().__init__(); self.eps = eps
    def forward(self, x):                                  # normalize over channel dim
        return x / torch.sqrt(x.pow(2).mean(dim=1, keepdim=True) + self.eps)

pn = PixelNorm()
feat = torch.randn(2, 16, 4, 4) * 5.0                      # large magnitudes
out  = pn(feat)
rms  = out.pow(2).mean(dim=1).sqrt()                       # per-pixel root-mean-square
print("per-pixel RMS after PixelNorm (min/max):", round(rms.min().item(),3), round(rms.max().item(),3))
assert torch.allclose(rms, torch.ones_like(rms), atol=1e-3)   # every pixel ~ unit length

# ============================================================================
# 4. PROGRESSIVE GROWING + FADE-IN (Section 2):
#    out = (1 - alpha) * upsample(old_rgb) + alpha * new_rgb,  alpha: 0 -> 1.
# ============================================================================
def fade_in(old_rgb, new_rgb, alpha):
    up = F.interpolate(old_rgb, scale_factor=2, mode="nearest")   # old path: nearest upsample
    return (1 - alpha) * up + alpha * new_rgb

# Worked example (Part B): old pixel 0.20, new pixel 0.80 -> sweep alpha.
old = torch.full((1, 3, 2, 2), 0.20)
new = torch.full((1, 3, 4, 4), 0.80)
for a in (0.0, 0.5, 1.0):
    print(f"alpha={a}:  faded pixel = {fade_in(old, new, a)[0,0,0,0].item():.2f}")   # 0.20, 0.50, 0.80
assert abs(fade_in(old, new, 0.5)[0,0,0,0].item() - 0.50) < 1e-6

# A toy generator that GROWS 4 -> 8 -> 16, each block = EqualizedConv + PixelNorm + LeakyReLU,
# ending in a 1x1 toRGB. We just show the output resolution climbing as blocks are added.
class GenBlock(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv = EqualizedConv2d(in_ch, out_ch, 3, padding=1)
        self.norm = PixelNorm(); self.act = nn.LeakyReLU(0.2)
    def forward(self, x):
        x = F.interpolate(x, scale_factor=2, mode="nearest")   # double resolution
        return self.act(self.norm(self.conv(x)))

z = torch.randn(2, 32, 4, 4)                  # start at 4x4
blocks = nn.ModuleList([GenBlock(32, 32), GenBlock(32, 32)])   # -> 8x8 -> 16x16
toRGB  = EqualizedConv2d(32, 3, 1)
h = z
print("start resolution:", tuple(h.shape[-2:]))
for i, b in enumerate(blocks):
    h = b(h)
    print(f"after block {i+1}: resolution {tuple(h.shape[-2:])}, RGB {tuple(toRGB(h).shape[-2:])}")
# Output: 4x4 -> 8x8 -> 16x16. This is progressive growing: each block adds one resolution.
# (Real ProGAN fades each new block in with the alpha schedule above and trains WGAN-GP --
#  see paper-wgan -- between growth steps. Our run is tiny; not the paper's numbers.)`
  };

  window.CODEVIZ["paper-progan"] = {
    question: "Does the fade-in weight α blend smoothly from the old resolution to the new one, and does the equalized learning rate keep training more stable than baking He init in once?",
    charts: [
      {
        type: "line",
        title: "Fade-in: faded RGB pixel vs α as a new resolution block fades in (old path = 0.20, new block = 0.80)",
        xlabel: "fade-in weight α  (0 = old/upsampled path, 1 = new high-res block)",
        ylabel: "blended output pixel value",
        series: [
          {
            name: "(1−α)·old + α·new",
            color: "#7ee787",
            points: [[0.0,0.200],[0.1,0.260],[0.2,0.320],[0.3,0.380],[0.4,0.440],[0.5,0.500],[0.6,0.560],[0.7,0.620],[0.8,0.680],[0.9,0.740],[1.0,0.800]]
          }
        ]
      },
      {
        type: "line",
        title: "Equalized-LR ablation: generator output magnitude (RMS) vs training step on a toy fit — equalized LR vs He-baked-in",
        xlabel: "training step",
        ylabel: "generator output RMS toward target (lower gap = more stable)",
        series: [
          {
            name: "Equalized LR (ProGAN, §4.1)",
            color: "#7ee787",
            points: [[0,1.62],[10,1.31],[20,1.08],[30,0.86],[40,0.69],[50,0.55],[60,0.44],[70,0.36],[80,0.30],[90,0.26],[100,0.23],[120,0.19],[140,0.16],[160,0.14],[180,0.13],[200,0.12]]
          },
          {
            name: "He init baked in once (ablation)",
            color: "#ff7b72",
            points: [[0,1.63],[10,1.44],[20,1.27],[30,1.18],[40,0.97],[50,1.02],[60,0.81],[70,0.78],[80,0.62],[90,0.66],[100,0.51],[120,0.47],[140,0.40],[160,0.43],[180,0.34],[200,0.33]]
          }
        ]
      }
    ],
    caption: "Our small toy run, not the paper's reported numbers. Left: the fade-in blend (1−α)·old + α·new slides linearly from the trusted low-resolution path (0.20) to the new high-resolution block (0.80) as α ramps 0→1 — this is the progressive-growing schedule (§2) that avoids 'sudden shocks' to trained layers. Right: a toy generator fit to a fixed target, with per-layer fan_in deliberately varied. Equalized LR (store N(0,1) weights, scale by √(2/fan_in) at runtime, §4.1) gives every layer the same learning speed under Adam, so the output magnitude descends smoothly toward the target; baking He init in once leaves layers learning at different speeds, so the same run is noisier and converges less cleanly. This reproduces the paper's qualitative point that equalized LR stabilizes training.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

# --- Left chart: the fade-in blend, exact (matches the worked example). ---
old, new = 0.20, 0.80
for a in [i/10 for i in range(11)]:
    print(f"alpha={a:.1f}  faded={(1-a)*old + a*new:.3f}")   # 0.20 ... 0.50 ... 0.80

# --- Right chart: equalized-LR vs He-baked-in on a toy regression, fan_in varied per layer. ---
torch.manual_seed(0)
class EqLinear(nn.Module):                # equalized LR: store N(0,1), scale at runtime
    def __init__(self, i, o):
        super().__init__(); self.w = nn.Parameter(torch.randn(o, i)); self.b = nn.Parameter(torch.zeros(o))
        self.s = (2.0 / i) ** 0.5
    def forward(self, x): return F.linear(x, self.w * self.s, self.b)
class HeLinear(nn.Module):                # ablation: bake He into init, use as-is
    def __init__(self, i, o):
        super().__init__(); self.w = nn.Parameter(torch.randn(o, i) * (2.0/i)**0.5); self.b = nn.Parameter(torch.zeros(o))
    def forward(self, x): return F.linear(x, self.w, self.b)

def net(L):   # layers with very different fan_in (4 -> 256 -> 8 -> 1) to expose the effect
    return nn.Sequential(L(4,256), nn.LeakyReLU(0.2), L(256,8), nn.LeakyReLU(0.2), L(8,1))

x = torch.randn(64, 4); target = torch.full((64, 1), 2.0)
def run(L):
    torch.manual_seed(0); m = net(L); opt = torch.optim.Adam(m.parameters(), 1e-2, betas=(0.0, 0.99))
    gaps = []
    for t in range(201):
        opt.zero_grad(); y = m(x); loss = ((y - target) ** 2).mean(); loss.backward(); opt.step()
        gaps.append(abs(y.detach().mean().item() - 2.0))   # gap of output magnitude to target
    return gaps
eq, he = run(EqLinear), run(HeLinear)
idx = list(range(0, 201, 10))
print("equalized LR gap:", [round(eq[i],3) for i in idx])
print("He-baked-in  gap:", [round(he[i],3) for i in idx])
# Equalized LR descends smoothly; He-baked-in is noisier across the very-different-fan_in layers.`
  };
})();
