/* Paper lesson — "Image-to-Image Translation with Conditional Adversarial Networks" (pix2pix),
   Isola, Zhu, Zhou & Efros, 2016 (arXiv:1611.07004; CVPR 2017).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-pix2pix".
   GROUNDED from arXiv:1611.07004 — abstract page (title, authors, BAIR/UC Berkeley, CVPR 2017,
   first posted Nov 2016) and the ar5iv HTML mirror for the method:
     §3.1 Eq.(1) conditional-GAN objective, Eq.(3) L1 loss, Eq.(4) final combined objective (lambda=100),
     §3.2.1 U-Net generator with skip connections, §3.2.2 PatchGAN / Markovian discriminator (70x70),
     §1 the "Euclidean distance ... averaging all plausible outputs ... causes blurring" argument,
     §3.1 noise-as-dropout, §4.1 Table 1 FCN-scores ablation (L1 / cGAN / L1+cGAN on Cityscapes).
   Track B (architecture): build a U-Net generator + PatchGAN discriminator from nn.Conv2d; train on a
   toy PAIRED task (edges -> filled striped shapes) where the target is MULTIMODAL, so L1 alone hedges
   to gray (blur) and L1+GAN commits to a sharp pattern; then ABLATE the GAN term (L1 only). The
   minimax/JSD math lives in concept dl-gan; here we recap and cross-link paper-gan and paper-unet.
   conceptLink: dl-gan (per manifest). */
(function () {
  window.LESSONS.push({
    id: "paper-pix2pix",
    title: "pix2pix — Image-to-Image Translation with Conditional Adversarial Networks (2016)",
    tagline: "Turn one image into another (edges&rarr;photo, labels&rarr;street-scene) with a U-Net generator judged by a patch-wise GAN, plus an L1 term — one recipe for dozens of translation tasks.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Phillip Isola, Jun-Yan Zhu, Tinghui Zhou, Alexei A. Efros",
      org: "Berkeley AI Research (BAIR) Laboratory, UC Berkeley",
      year: 2016,
      venue: "arXiv:1611.07004 (Nov 2016); CVPR 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1611.07004",
      code: "https://github.com/phillipi/pix2pix"
    },
    conceptLink: "dl-gan",
    partOf: [],
    prereqs: ["paper-gan", "paper-unet", "dl-gan", "paper-cgan", "dl-conv", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>Lots of vision tasks are secretly the <b>same</b> task: take an input image and produce a
       corresponding output image &mdash; a <b>black-and-white photo &rarr; color</b>, a <b>map &rarr; aerial photo</b>,
       a <b>sketch of edges &rarr; a realistic object</b>, a <b>semantic label map &rarr; a street scene</b>. Before this
       paper each of these had its own hand-built model and its own hand-tuned loss. The authors call this family
       "image-to-image translation" and ask for <b>one</b> general recipe.</p>
       <p>The obvious recipe &mdash; train a convolutional net to copy the input toward the target by minimizing
       <b>pixel-wise Euclidean (L2) distance</b> &mdash; has a famous failure. From the introduction (&sect;1):</p>
       <blockquote>"If we &hellip; ask the CNN to minimize the Euclidean distance between predicted and ground truth
       pixels, it will tend to produce <b>blurry</b> results. This is because Euclidean distance is minimized by
       <b>averaging all plausible outputs</b>, which causes blurring."</blockquote>
       <p>In plain words: when several outputs are all reasonable (which exact shade? which exact texture?), a
       distance loss splits the difference and outputs their <b>average</b> &mdash; a smeared, washed-out image.
       The paper wants outputs that look <b>real</b>, which means committing to one sharp answer, not the average.</p>`,
    contribution:
      `<ul>
        <li><b>A general conditional-GAN framework for image-to-image translation.</b> Use a <b>conditional GAN</b>
        (the idea from <b>paper-cgan</b>): the generator $G$ maps an input image $x$ to an output image; the
        discriminator $D$ sees the <i>pair</i> $(x, \\text{output})$ and judges whether the output is a real
        translation <i>of that input</i> (&sect;3.1, Eq. 1). The same code handles many tasks &mdash; you just swap
        the dataset.</li>
        <li><b>L1 + adversarial loss (Eq. 4).</b> Keep an <b>L1</b> term (sum of absolute pixel differences) to pin
        the output near the ground truth and get the colors/low frequencies right, and add the <b>GAN</b> term to
        make it <b>sharp and realistic</b>. The L1 handles the "what", the GAN handles the "looks real" (&sect;3.1,
        with $\\lambda=100$).</li>
        <li><b>Two architectural choices that make it work: U-Net + PatchGAN.</b> A <b>U-Net</b> generator (skip
        connections from each encoder layer to the mirror decoder layer, &sect;3.2.1) so low-level structure shared
        between input and output (edges, position) shuttles straight across; and a <b>PatchGAN</b> discriminator
        (&sect;3.2.2) that judges realism on small <b>patches</b> (e.g. 70&times;70) instead of the whole image &mdash;
        smaller, faster, and a perfect division of labor with the L1 term.</li>
      </ul>`,
    whyItMattered:
      `<p>pix2pix made "image-to-image translation" a named, solved-in-general problem, and its three pieces
       &mdash; <b>conditional GAN on image pairs</b>, <b>L1 + adversarial loss</b>, and the <b>U-Net + PatchGAN</b>
       pair &mdash; became default building blocks. Its direct successor <b>CycleGAN</b> (<b>paper-cyclegan</b>,
       same lab) removes the need for <i>paired</i> data; the PatchGAN discriminator and the L1+GAN recipe reappear
       across later translation, super-resolution, and inpainting work. It is also the cleanest demonstration of a
       lesson that carries far beyond GANs: a <b>reconstruction loss</b> (L1) keeps you faithful while an
       <b>adversarial loss</b> keeps you sharp.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>Read the method and the loss ablation closely; skim the application gallery.</p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; read the "Euclidean distance &hellip; averaging &hellip; causes
        blurring" paragraph; it is the whole motivation for adding the GAN term.</li>
        <li><b>&sect;3.1 (Objective)</b> &mdash; the core. Three equations: <b>Eq.(1)</b> the conditional-GAN loss,
        <b>Eq.(3)</b> the L1 loss, <b>Eq.(4)</b> the combined objective with $\\lambda$. Also the note that they
        provide noise "only in the form of <b>dropout</b>" because the generator "simply learned to ignore" an
        input noise vector.</li>
        <li><b>&sect;3.2.1 (Generator: U-Net)</b> &mdash; the skip connections "between each layer $i$ and layer
        $n-i$"; cross-read <b>paper-unet</b>.</li>
        <li><b>&sect;3.2.2 (PatchGAN)</b> &mdash; the "Markovian" discriminator that "only penalizes structure at
        the scale of patches"; the 70&times;70 default and why patches suffice for high-frequency detail.</li>
        <li><b>&sect;4.1, Table 1</b> &mdash; the loss ablation (FCN-scores for L1 vs cGAN vs L1+cGAN on
        Cityscapes labels&rarr;photo). This is the experiment you reproduce qualitatively.</li>
       </ul>
       <p><b>Skim:</b> the large figure gallery of applications (&sect;4 onward) and the patch-size sweep table
       unless you want the full study.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train two image-to-image translators on a <b>paired</b> task where the input is an outline and
       the correct fill is <b>ambiguous</b> (several equally-valid textures could fill it). One translator is
       trained with <b>L1 only</b>; the other with <b>L1 + a PatchGAN</b>.</p>
       <p>Predict: which one produces a <b>sharp, decisive</b> fill, and which one hedges to a washed-out
       <b>gray average</b>? And <i>why</i> &mdash; what is it about a distance loss that makes it average when the
       target is ambiguous? Write your guess, then check the L1-only-vs-L1+GAN panel below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two nets and the combined loss. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>U-Net generator</b> $G$: an encoder that downsamples the input image, a decoder that upsamples back,
        and a <b>skip connection</b> that <code>cat</code>s each encoder feature map onto the matching decoder one.
        TODO: in <code>forward</code>, save <code>e1</code> on the way down and <code>torch.cat([up, e1], 1)</code>
        on the way up.</li>
        <li><b>PatchGAN discriminator</b> $D$: a small conv net whose input is the <b>concatenated pair</b>
        <code>cat([x, output], 1)</code> and whose output is a <b>grid</b> of real/fake logits (one per patch), not
        a single number. TODO: the final <code>nn.Conv2d</code> keeps spatial size &gt; 1.</li>
        <li><b>Discriminator step:</b> real pair $(x,y)$ &rarr; "real"; fake pair $(x, G(x))$ &rarr; "fake". TODO:
        <code>bce(D(x,y),1) + bce(D(x,G(x).detach()),0)</code>, averaged over the patch grid.</li>
        <li><b>Generator step:</b> fool $D$ <b>and</b> stay near the target. TODO:
        <code>bce(D(x,G(x)),1) + 100*L1(G(x),y)</code> (the $\\lambda=100$ from Eq. 4).</li>
        <li><b>Ablation:</b> drop the <code>bce(D(...),1)</code> term &rarr; pure L1 regression.</li>
       </ul>
       <p>Predict the interior <b>contrast</b> (how decisive the fill pixels are, $0$=gray, $1$=committed) for L1
       only vs L1+GAN.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>The setup.</b> We have <b>pairs</b> $(x, y)$: an input image $x$ (edges, a label map, a B&amp;W photo)
       and its correct output $y$ (the photo, the street scene, the color image). We want a generator $G$ that
       turns any $x$ into a plausible $y$.</p>
       <p><b>The conditional GAN (&sect;3.1).</b> This is the <b>paper-cgan</b> idea applied to images: the
       discriminator $D$ does not just see an output image &mdash; it sees the <b>pair</b> $(x, \\text{output})$ and
       must answer "is this a real <i>translation of $x$</i>?" So $G$ cannot win by producing a generically realistic
       image; it must produce one that <b>matches the specific input</b> $x$. That is the conditioning.</p>
       <p><b>Why also keep an L1 term (&sect;3.1).</b> A GAN alone makes things look real but is free to wander
       &mdash; it might output a realistic image that is the <i>wrong</i> translation. Adding an <b>L1</b> term
       $\\lVert y - G(x)\\rVert_1$ (the sum of absolute differences between the generated and true pixels) anchors
       the output to the actual ground truth. The authors found <b>L1</b> (absolute) is preferable to <b>L2</b>
       (squared) because it "encourages less blurring", but the deeper point is the division of labor: <b>L1
       captures the low frequencies</b> (overall colors, layout) correctly, leaving the GAN to supply only the
       <b>high frequencies</b> (sharp edges, texture).</p>
       <p><b>Why L1 alone blurs (&sect;1).</b> When several outputs are equally plausible (which exact texture fills
       this region?), the L1/L2 minimizer is a <b>central</b> value of all of them &mdash; an average &mdash; which
       for competing textures is a flat gray smear. The GAN term refuses averages: an averaged, blurry patch is
       easy to spot as fake, so $G$ is pushed to <b>commit</b> to one sharp, real-looking option.</p>
       <p><b>The two architecture choices.</b></p>
       <ul>
        <li><b>U-Net generator (&sect;3.2.1).</b> In translation, input and output "share a great deal of low-level
        information" &mdash; the edges line up, objects sit in the same place. So instead of forcing everything
        through a narrow bottleneck, the U-Net adds <b>skip connections between each layer $i$ and layer $n-i$</b>,
        letting that shared structure travel <b>straight across</b> the net. (This is the architecture of
        <b>paper-unet</b>.)</li>
        <li><b>PatchGAN discriminator (&sect;3.2.2).</b> Because L1 already enforces correctness at the coarse
        scale, the discriminator only needs to police <b>high-frequency</b> realism &mdash; and high-frequency
        structure is local. So $D$ runs on <b>$N\\times N$ patches</b> (default 70&times;70), classifying each patch
        real/fake and averaging. The authors call this a <b>Markovian</b> discriminator (it assumes pixels far apart
        are independent). It has far fewer parameters, runs faster, and applies to images of any size.</li>
       </ul>
       <p><b>The noise.</b> A vanilla GAN feeds in a random noise vector $z$ for variety. Here the authors report
       (&sect;3.1) that "the generator simply learned to <b>ignore the noise</b>", so they instead "provide noise
       only in the form of <b>dropout</b>, applied on several layers &hellip; at both training and test time."</p>`,
    architecture:
      `<p>pix2pix is two convolutional networks. The paper's appendix gives both as compact stacks, where
       <b>Ck</b> = a Convolution&ndash;BatchNorm&ndash;ReLU block with <b>k</b> output filters, and <b>CDk</b> = the
       same plus <b>Dropout</b> (50%). All convolutions are <b>4&times;4</b> with stride <b>2</b> (so each block halves
       or, transposed, doubles the spatial size). Operating resolution is <b>256&times;256</b>.</p>
       <p><b>Generator &mdash; U-Net (&sect;6.1.1).</b> An encoder that downsamples to a 1&times;1 bottleneck and a decoder
       that upsamples back, with a <b>skip connection</b> concatenating each encoder layer $i$ onto decoder layer
       $n-i$ (so every decoder block's input channels double).</p>
       <ul>
        <li><b>Encoder (8 down-blocks):</b> <code>C64 - C128 - C256 - C512 - C512 - C512 - C512 - C512</code>
        &mdash; 256&times;256 &rarr; 128 &rarr; 64 &rarr; 32 &rarr; 16 &rarr; 8 &rarr; 4 &rarr; 2 &rarr; 1. The first
        <code>C64</code> has <b>no BatchNorm</b>; all use LeakyReLU(0.2).</li>
        <li><b>Decoder (7 up-blocks + output):</b> <code>CD512 - CD512 - CD512 - C512 - C256 - C128 - C64</code>
        (the first three carry <b>dropout</b> as the noise source), each a <code>ConvTranspose2d</code> with ReLU,
        then a final transposed conv to the output channels followed by <b>Tanh</b> (pixels in $[-1,1]$). Because of
        the skips, each decoder block's input has <b>twice</b> the listed channels.</li>
       </ul>
       <p><b>Discriminator &mdash; 70&times;70 PatchGAN (&sect;6.1.2).</b> Input is the <b>concatenated pair</b>
       $(x,\\text{output})$ (so 6 channels for RGB). Stack <code>C64 - C128 - C256 - C512</code> (first <code>C64</code>
       no BatchNorm, all LeakyReLU(0.2)), then a final convolution to a <b>1-channel grid</b> of logits passed
       through a sigmoid &mdash; <b>no flatten, no fully-connected layer</b>. Each grid cell has a <b>70&times;70</b>
       receptive field, so it classifies one 70&times;70 patch real/fake; the loss averages over the grid. This is
       the <b>Markovian</b> assumption: pixels more than a patch apart are treated as independent. It has far fewer
       parameters than a full-image discriminator and runs on images of any size.</p>
       <p><b>Training (&sect;3.3).</b> Alternate one $D$ step and one $G$ step (standard GAN). Optimizer Adam,
       learning rate <b>2e-4</b>, momentum $\\beta_1=0.5$; minibatch SGD. $G$ minimizes
       $\\mathcal{L}_{cGAN}(G,D)+\\lambda\\,\\mathcal{L}_{L1}(G)$ while $D$ maximizes $\\mathcal{L}_{cGAN}$; dropout is
       left <b>on at test time</b> to inject noise.</p>
       <p><b>Our toy build (CODE below)</b> is a miniature of this: a 2-down/2-up U-Net (16&rarr;8&rarr;4 then back)
       with one <code>torch.cat</code> skip and dropout-as-noise, and a 3-layer PatchGAN emitting a 4&times;4 logit
       grid &mdash; the same shapes, scaled down to run on CPU.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input image</b> being translated (the edges, the label map, the grayscale photo). It is the <b>condition</b>: both $G$ and $D$ see it." },
      { sym: "$y$", desc: "the <b>ground-truth output image</b> &mdash; the correct translation of $x$ (the real photo, the color image)." },
      { sym: "$z$", desc: "the <b>noise</b> input that would give a vanilla GAN its variety. In pix2pix it is supplied as <b>dropout</b> rather than an explicit vector, because $G$ learned to ignore an input $z$." },
      { sym: "$G(x,z)$", desc: "the <b>generator</b>'s output: a U-Net that maps the input image $x$ (with dropout noise) to a generated output image. Written $G(x)$ once we fold the noise into dropout." },
      { sym: "$D(x,y)$", desc: "the <b>discriminator</b>'s score for a <b>pair</b>: it takes the input $x$ <b>and</b> a candidate output, and returns the probability the pair is a <b>real</b> $(x,y)$ translation rather than $(x, G(x))$. PatchGAN returns one such score <i>per patch</i>." },
      { sym: "$\\mathcal{L}_{cGAN}(G,D)$", desc: "the <b>conditional-GAN loss</b> (Eq. 1): the usual min-max game, but every term is conditioned on the input image $x$ &mdash; $D$ judges the pair $(x,\\cdot)$." },
      { sym: "$\\mathcal{L}_{GAN}(G,D)$", desc: "the <b>unconditional</b> GAN loss (Eq. 2): the same game but $D$ sees only the output, never the input $x$. Used as an ablation; pix2pix's objective uses the conditional Eq. 1 instead." },
      { sym: "$\\mathcal{L}_{L1}(G)$", desc: "the <b>L1 reconstruction loss</b> (Eq. 3): the expected <b>sum of absolute differences</b> $\\lVert y - G(x,z)\\rVert_1$ between the true and generated pixels. Pulls the output toward the ground truth." },
      { sym: "$\\lVert\\cdot\\rVert_1$", desc: "the <b>L1 norm</b>: add up the absolute values of all entries. For an image, the total absolute pixel-by-pixel difference. (Contrast L2, which squares first &mdash; L2 blurs more.)" },
      { sym: "$\\lambda$", desc: "the <b>weight</b> on the L1 term in the combined objective (Eq. 4). The paper uses $\\lambda = 100$ &mdash; the L1 term is heavily weighted relative to the GAN term." },
      { sym: "$\\mathbb{E}_{x,y}[\\cdot]$", desc: "an <b>expectation</b>: the average of the bracketed quantity over the dataset of real pairs $(x,y)$. In code, the mean over a minibatch." },
      { sym: "$G^* = \\arg\\min_G\\max_D$", desc: "the <b>solution</b>: $G^*$ is the generator that <b>minimizes</b> the objective after $D$ has been allowed to <b>maximize</b> the GAN part. The min-max is the adversarial game; $\\arg\\min_G$ means \"the $G$ that achieves the minimum\"." },
      { sym: "U-Net", desc: "a plain term: an encoder-decoder generator with <b>skip connections</b> from each encoder layer to the mirrored decoder layer, so shared low-level structure bypasses the bottleneck (see paper-unet)." },
      { sym: "PatchGAN", desc: "a plain term: a discriminator that classifies each $N\\times N$ <b>patch</b> of the (paired) image as real/fake and averages, instead of scoring the whole image once. Also called a <b>Markovian</b> discriminator." }
    ],
    formula: `$$ \\mathcal{L}_{cGAN}(G,D) = \\mathbb{E}_{x,y}\\big[\\log D(x,y)\\big] + \\mathbb{E}_{x,z}\\big[\\log\\big(1 - D(x,G(x,z))\\big)\\big] \\qquad\\text{(Eq. 1, \\S3.1)} $$
<p>The conditional-GAN objective: $D$ judges the <b>pair</b> $(x,\\cdot)$, so both terms are conditioned on the input image $x$.</p>
$$ \\mathcal{L}_{GAN}(G,D) = \\mathbb{E}_{y}\\big[\\log D(y)\\big] + \\mathbb{E}_{x,z}\\big[\\log\\big(1 - D(G(x,z))\\big)\\big] \\qquad\\text{(Eq. 2, \\S3.1)} $$
<p>The <b>unconditional</b> variant (used only in the ablation of \\S4.2): $D$ sees the output image alone, never the input $x$. pix2pix uses Eq. 1, not this.</p>
$$ \\mathcal{L}_{L1}(G) = \\mathbb{E}_{x,y,z}\\big[\\,\\lVert y - G(x,z)\\rVert_1\\,\\big] \\qquad\\text{(Eq. 3, \\S3.1)} $$
<p>The L1 reconstruction term: expected sum of absolute pixel differences between the true output $y$ and the generated $G(x,z)$. Anchors $G$ to the ground truth.</p>
$$ G^{*} = \\arg\\min_{G}\\max_{D}\\; \\mathcal{L}_{cGAN}(G,D) + \\lambda\\,\\mathcal{L}_{L1}(G) \\qquad\\text{(Eq. 4, \\S3.1,\\;}\\lambda=100\\text{)} $$
<p>The full objective: solve the adversarial min&ndash;max on the cGAN term <b>and</b> minimize $\\lambda=100$ times the L1 term &mdash; sharp (GAN) and faithful (L1) at once.</p>`,
    whatItDoes:
      `<p><b>Eq. 1</b> is the conditional-GAN game on <b>image pairs</b>. The first term
       $\\mathbb{E}_{x,y}[\\log D(x,y)]$ is large when $D$ confidently calls a <b>real</b> pair real
       ($D(x,y)\\to 1$). The second, $\\mathbb{E}_{x,z}[\\log(1-D(x,G(x,z)))]$, is large when $D$ confidently calls a
       <b>generated</b> pair fake ($D(x,G(x,z))\\to 0$). $D$ <b>maximizes</b> this (become a sharp "is this a real
       translation of $x$?" judge); $G$ wants the opposite &mdash; outputs that pass as real translations.</p>
       <p><b>Eq. 3</b> is plain regression: make the generated image's pixels close to the true image's pixels in
       absolute distance.</p>
       <p><b>Eq. 4</b> is the punchline: minimize the GAN loss <b>and</b> $\\lambda=100$ times the L1 loss together.
       L1 alone &rarr; faithful but blurry; GAN alone &rarr; sharp but free to be the wrong translation (and prone to
       artifacts); <b>their sum</b> &rarr; faithful <i>and</i> sharp. The GAN supplies the high-frequency realism
       that L1's averaging destroys, while L1 keeps the GAN honest about the overall content.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the core minimax / Jensen-Shannon math lives in the <i>dl-gan</i> concept lesson and
       is worked in full in <i>paper-gan</i>; pix2pix reuses it and adds the L1 term, so we focus on what is new.</b></p>
       <p><b>Why a distance loss averages (the blur).</b> Suppose, for a fixed input $x$, the conditional
       distribution of correct outputs $p(y\\mid x)$ has several modes (several plausible $y$'s). A single
       deterministic $G(x)$ must pick one value per pixel. The value that minimizes the <b>expected L2</b> distance
       is the <b>conditional mean</b> $\\mathbb{E}[y\\mid x]$; for L1 it is the <b>conditional median</b>. Either way
       it is a <i>central</i> value of all the plausible outputs &mdash; and the average of two competing sharp
       textures is a flat gray. That central value is exactly the "blurry" image the paper describes (&sect;1). No
       amount of training fixes it, because the blur <b>is</b> the optimum of that loss.</p>
       <p><b>Why the GAN term removes the blur.</b> The discriminator $D$ scores <b>realism</b>, and real images are
       sharp; an averaged, blurry patch is trivially classifiable as fake. So the adversarial loss assigns the blur
       a <b>high</b> cost that the L1 loss does not. To minimize the combined Eq. 4, $G$ must <b>commit</b> to one of
       the plausible modes (a sharp, real-looking output) rather than averaging them &mdash; while the L1 term, weak
       on which mode but strong on overall content, keeps that commitment near the truth. Formally, holding $x$
       fixed turns the cGAN part into an ordinary GAN between $p_{\\text{data}}(\\cdot\\mid x)$ and
       $p_g(\\cdot\\mid x)$, so the paper-gan result applies per input $x$ (this is the same "hold the condition
       fixed" argument as in <b>paper-cgan</b>).</p>`,
    example:
      `<p>Work the loss arithmetic by hand for one pixel and one patch (these are recomputed in the notebook's
       first cell). Pixels are scaled to $[-1,1]$ (the $\\tanh$ output range).</p>
       <ul class="steps">
        <li><b>L1 of one pixel.</b> Say the true pixel is $y=0.7$ and the generator outputs $G(x)=-0.3$. The L1
        contribution is $|\\,0.7-(-0.3)\\,| = |1.0| = 1.0$. With $\\lambda=100$, this single pixel contributes
        $100\\times 1.0 = 100$ to the weighted L1 term &mdash; L1 dominates the magnitude of the objective.</li>
        <li><b>Why ambiguity forces a hedge.</b> Suppose for one input $x$ the correct pixel is equally often
        $+1$ or $-1$ (two modes). The constant that minimizes expected L1 is the <b>median</b>, which here is
        anything in $[-1,+1]$ &mdash; and the symmetric choice is $0$ (mid-gray). Outputting $0$ costs L1
        $|0-(+1)|=1$ or $|0-(-1)|=1$ &mdash; the <b>same</b> as the true value would cost the other half the time, so
        L1 has no incentive to commit. That tie is the blur.</li>
        <li><b>The cGAN term on a pair.</b> If $D$ scores a <b>real</b> pair at $D(x,y)=0.9$, the first term is
        $\\log 0.9 = -0.1054$. If $D$ scores a <b>generated</b> pair at $D(x,G(x))=0.2$, the second term is
        $\\log(1-0.2)=\\log 0.8 = -0.2231$. $D$ wants both pushed up (toward $\\log 1 = 0$).</li>
        <li><b>PatchGAN equilibrium.</b> When $G$ matches the data, each patch is a coin-flip for $D$
        ($D\\to 0.5$), so each patch's binary-cross-entropy term settles at $-\\log 0.5 = \\log 2 = 0.6931$ &mdash; the
        same GAN plateau as before, now reached <i>per patch</i>. Watch for these numbers in the loss panel.</li>
       </ul>`,
    recipe:
      `<ol>
        <li><b>Make paired data</b> $(x, y)$: input image and its correct output. (We use edges &rarr; filled shape;
        the real paper uses labels&rarr;photo, B&amp;W&rarr;color, etc.)</li>
        <li><b>Build the U-Net generator</b> $G$: an encoder (a few stride-2 <code>nn.Conv2d</code> downsamplers)
        and a decoder (<code>nn.ConvTranspose2d</code> upsamplers), with a <b>skip connection</b> that
        <code>cat</code>s each saved encoder feature map onto the matching decoder one; <code>nn.Dropout</code> on a
        decoder layer plays the role of noise; a <code>nn.Tanh</code> output for pixels in $[-1,1]$.</li>
        <li><b>Build the PatchGAN discriminator</b> $D$: a small conv net whose input is the <b>concatenated pair</b>
        <code>cat([x, output], 1)</code>; its output is a <b>spatial grid</b> of logits (one per patch), not a
        single scalar.</li>
        <li><b>Discriminator step:</b> real pair &rarr; "real", generated pair &rarr; "fake". Minimize
        <code>bce(D(x,y),1) + bce(D(x,G(x).detach()),0)</code> averaged over the patch grid. <code>.detach()</code>
        stops this step from moving $G$.</li>
        <li><b>Generator step:</b> minimize <code>bce(D(x,G(x)),1) + lambda*L1(G(x),y)</code> with
        <code>lambda=100</code> (Eq. 4): fool the patch discriminator <i>and</i> stay near the ground truth.</li>
        <li><b>Test time:</b> run $G(x)$ (keep dropout on, per the paper, for a little variety).</li>
        <li><b>Ablate</b> to show what each term buys: train with <b>L1 only</b> (drop the GAN term) and with
        <b>GAN only</b> (drop L1); compare sharpness and faithfulness.</li>
      </ol>`,
    results:
      `<p>The paper applies one model to many tasks (labels&rarr;facades, B&amp;W&rarr;color, edges&rarr;photo,
       day&rarr;night, maps&harr;aerial, sketch&rarr;photo). The loss ablation is the result to know. On
       <b>Cityscapes labels&rarr;photo</b>, they score generated images with an off-the-shelf segmentation net
       (FCN-scores: higher = the generated street scene is more recognizable). From <b>Table 1, &sect;4.1</b>
       (quoting the reported numbers):</p>
       <blockquote>
        L1 &mdash; per-pixel acc. <b>0.42</b>, per-class acc. <b>0.15</b>, class IOU <b>0.11</b>.<br/>
        cGAN &mdash; <b>0.57</b>, <b>0.22</b>, <b>0.16</b>.<br/>
        L1+cGAN &mdash; <b>0.66</b>, <b>0.23</b>, <b>0.17</b>.
       </blockquote>
       <p>And the qualitative finding (around Fig. 4): "L1 alone leads to reasonable but blurry results &hellip; the
       cGAN alone &hellip; gives much sharper results but introduces visual artifacts" &mdash; the <b>combination</b>
       is both sharp and faithful, and scores highest. For perceptual realism they also ran human studies (Amazon
       Mechanical Turk "real vs fake"): on maps&rarr;aerial the model fooled participants <b>18.9%</b> of the time
       vs <b>0.8%</b> for an L1 baseline; on colorization <b>22.5%</b> on ImageNet (&sect;4).</p>
       <p><i>The numbers in the CODEVIZ panel below are from our own tiny run on a toy task &mdash; not the paper's
       reported results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> pix2pix produces images, so "working" is measured two ways. The paper's
       quantitative metric is the <b>FCN-score</b> on <b>Cityscapes labels&rarr;photo</b>: run an off-the-shelf
       segmentation net on the generated street scene and report <b>per-pixel accuracy, per-class accuracy, and
       class IOU</b> (higher = the fake scene is more recognizable). For a single-mode toy task a cheaper proxy is
       <b>interior sharpness</b> &mdash; the spatial standard deviation inside the shape ($0=$ flat gray blur,
       $\\approx$ target's std $=$ committed). The baselines to beat: the <b>L1-only</b> ablation
       (per-pixel acc. <b>0.42</b>, per-class <b>0.15</b>, IOU <b>0.11</b>) and <b>cGAN-only</b> (<b>0.57 / 0.22 /
       0.16</b>); the full <b>L1+cGAN</b> should top them (<b>0.66 / 0.23 / 0.17</b>, Table 1, &sect;4.1).</p>
       <p><b>2. Sanity checks BEFORE the full run.</b></p>
       <ul>
        <li><b>Replay the worked arithmetic</b> (notebook cell 0): $|0.7-(-0.3)|=1.0$, $100\\times1.0=100$,
        $\\log 0.9=-0.1054$, $\\log 0.8=-0.2231$, patch equilibrium $-\\log 0.5=0.6931$.</li>
        <li><b>Shapes.</b> $G$'s output matches the target ($1\\times H\\times W$, pixels in $[-1,1]$ from
        $\\tanh$); $D$'s output is a <b>spatial grid</b> of logits (e.g. $4\\times4$), <b>not</b> a single scalar &mdash;
        if it is $1\\times1$ you flattened the PatchGAN into a whole-image discriminator.</li>
        <li><b>$D$ sees the pair.</b> Assert $D$'s input has the concatenated channels of
        $\\text{cat}([x,\\text{output}])$ (e.g. 2 here, 6 for RGB); a single-image input loses the conditioning.</li>
        <li><b>GAN loss at init.</b> Before training, each patch is a coin-flip, so the BCE per patch sits near
        $-\\log 0.5 = \\log 2 \\approx 0.693$ &mdash; the same value a converged $D$ returns (rule of thumb).</li>
        <li><b>Overfit one pair.</b> With L1 on a <i>single</i> fixed pair the reconstruction loss should fall toward
        $0$; if it cannot, the U-Net (skips/upsampling) is mis-wired.</li>
       </ul>
       <p><b>3. Expected range.</b> On our toy ambiguous-fill task (not the paper), <b>L1-only</b> hedges to a flat
       gray &mdash; interior std collapses to $\\approx$<b>0.000</b> vs the target's <b>1.004</b> &mdash; and its L1
       loss parks at an irreducible floor $\\approx$<b>0.317</b> it cannot beat by averaging. <b>L1+PatchGAN</b>
       commits to one sharp stripe phase &mdash; interior std $\\approx$<b>1.004</b>, matching the target &mdash;
       and its L1 can dip below the floor (to $\\approx$<b>0.198</b>) by picking a single mode. On Cityscapes, anchor
       to Table 1: L1+cGAN $\\approx$<b>0.66</b> per-pixel acc. (&sect;4.1); being far under the L1-only <b>0.42</b>
       baseline is "probably a bug," small gaps are "tuning."</p>
       <p><b>4. Ablation &mdash; prove each term earns its keep.</b> The central knobs are the <b>two loss terms</b>.
       (a) Drop the <b>GAN term</b> (L1 only): outputs must go <b>blurry/gray</b> on the multimodal target and
       sharpness must <b>drop</b> (our run: std $1.004\\to0.000$) &mdash; this is the paper's headline ablation.
       (b) Drop the <b>L1 term</b> (GAN only): outputs stay sharp but drift in content / show artifacts and FCN-score
       falls. (c) Drop the <b>U-Net skips</b> or feed $D$ <b>only the output</b> (not the pair): faithfulness to the
       input collapses. If turning off the GAN does <i>not</i> reintroduce blur, the adversarial term was never
       wired into $G$'s step.</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Output is blurry/gray on an ambiguous target</b> &rarr; the GAN term is missing from $G$'s loss (or
        weighted to nothing); only L1 is acting, and L1's optimum on a multimodal target <i>is</i> the gray average.</li>
        <li><b>Sharp but wrong content / ignores the input</b> &rarr; $D$ is fed only the output (lost conditioning),
        or $\\lambda$ is too small so L1 cannot anchor faithfulness.</li>
        <li><b>$G$ loss won't go down and you panic</b> &rarr; expected: a converged PatchGAN parks each patch's BCE
        near $\\log 2\\approx0.693$, <i>not</i> $0$. Track the <b>L1</b> term and image quality, not the GAN term, for
        progress.</li>
        <li><b>Loss NaN / training diverges</b> &rarr; learning rate too high or missing <code>.detach()</code> on
        the fake in the $D$ step (the $D$ update leaks into $G$).</li>
        <li><b>$D$ separates real from fake instantly and $G$ never learns</b> &rarr; output range mismatch ($\\tanh$
        is $[-1,1]$; normalize targets to $[-1,1]$ or $D$ wins on scale alone).</li>
       </ul>
       <p><i>The toy numbers (std $0.000$ vs $1.004$, L1 floor $\\approx0.317$) are our small run; the Table 1 FCN-scores
       (0.42 / 0.57 / 0.66, &sect;4.1) and $\\lambda=100$ are the paper's. The init-loss and overfit-one-pair checks
       are rules of thumb.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b> them
       and build only the novel composition &mdash; here, the <b>U-Net generator</b>, the <b>PatchGAN
       discriminator</b>, and the <b>L1 + adversarial</b> objective. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.ConvTranspose2d</code>, <code>nn.LeakyReLU</code>/<code>nn.ReLU</code>, <code>nn.Dropout</code>,
       <code>nn.Tanh</code>, <code>nn.BCEWithLogitsLoss</code>, <code>nn.L1Loss</code>, and Adam. <b>Build by hand:</b>
       the U-Net <b>skip connection</b> (<code>torch.cat</code> of encoder onto decoder), the <b>paired</b> input to
       $D$ (<code>cat([x, output], 1)</code>), the <b>patch-grid</b> output of $D$ (no final flatten), the two
       alternating steps with <code>.detach()</code>, and the combined Eq. 4 loss with $\\lambda=100$. The
       minimax / JSD math is recapped from <b>dl-gan</b> and <b>paper-gan</b>; the U-Net itself is built fully in
       <b>paper-unet</b>; here we assemble them into the translation recipe and run the L1-vs-L1+GAN ablation.</p>`,
    pitfalls:
      `<ul>
        <li><b>Feeding $D$ only the output, not the pair.</b> If $D$ sees just $G(x)$ and not $(x, G(x))$, it can
        only check generic realism, not "is this the right translation of $x$" &mdash; you lose the conditioning.
        <b>Fix:</b> <code>cat([x, output], 1)</code> as $D$'s input (&sect;3.1).</li>
        <li><b>Flattening the PatchGAN to one number.</b> The point is a <b>grid</b> of per-patch judgments; a final
        <code>nn.Linear</code> to a scalar turns it back into a whole-image discriminator. <b>Fix:</b> keep the last
        layer convolutional with spatial size &gt; 1 and average the BCE over the grid.</li>
        <li><b>Dropping the L1 term (GAN only).</b> The output gets sharp but can drift to the wrong content / show
        artifacts. <b>Dropping the GAN term (L1 only)</b> gives the famous blur. You need <b>both</b>, with $\\lambda$
        weighting L1 heavily (paper uses $100$).</li>
        <li><b>Forgetting the U-Net skips.</b> A plain encoder-decoder squeezes everything through the bottleneck
        and loses the precise edges/positions shared with the input. <b>Fix:</b> <code>cat</code> the encoder maps
        onto the decoder (&sect;3.2.1; see paper-unet).</li>
        <li><b>Expecting an input noise vector $z$ to add variety.</b> The paper found $G$ ignores it; variety comes
        from <b>dropout</b> left on at test time (&sect;3.1).</li>
        <li><b>Reading GAN losses as "lower is better."</b> As always, a converged PatchGAN drives each patch's BCE
        toward $\\log 2\\approx 0.693$ (a per-patch coin flip), not $0$. Meanwhile the L1 term <i>does</i> keep
        decreasing &mdash; do not expect the GAN part to.</li>
        <li><b>Mismatched output range.</b> $\\tanh$ outputs $[-1,1]$; normalize images to $[-1,1]$ or $D$ separates
        real from fake on scale alone.</li>
      </ul>`,
    recall: [
      "Write the combined pix2pix objective (Eq. 4) from memory, name its two terms, and give $\\lambda$.",
      "Why does an L1 (or L2) loss alone produce blurry outputs when the target is ambiguous?",
      "What does the PatchGAN discriminator take as input, and what shape is its output?",
      "What is the skip connection in the U-Net generator, and what does it preserve?",
      "How is the noise $z$ supplied in pix2pix, and why not as an input vector?"
    ],
    practice: [
      {
        q: `<b>The loss ablation (the heart of the paper).</b> Take your working pix2pix on the ambiguous-fill task
            and train it three ways: <b>L1 only</b>, <b>GAN only</b>, and <b>L1 + GAN</b> (Eq. 4). Predict and then
            measure the interior contrast (how sharp/decisive the fill is, $0$=gray $\\approx$ blur, $1$=committed)
            and the faithfulness (does the output match the input's shape). Which term buys sharpness, which buys
            faithfulness, and why is the combination best?`,
        steps: [
          { do: `Train L1 only (drop the GAN term). On the ambiguous fill, the L1 minimizer is the median over the plausible textures.`, why: `When several outputs are valid, a distance loss outputs their central value &mdash; the average of competing sharp textures is a flat gray (the paper's blur, §1).` },
          { do: `Train GAN only (drop the L1 term). Output gets sharp but can drift in content / show artifacts.`, why: `The discriminator rewards realism, not faithfulness to this exact $x$; nothing anchors the output to the ground truth.` },
          { do: `Train L1 + GAN (Eq. 4, $\\lambda=100$). Measure interior contrast and shape match.`, why: `L1 supplies the low-frequency content (right shape/colors), the GAN supplies the high-frequency sharpness &mdash; the division of labor the paper describes.` },
          { do: `Conclude: GAN&rarr;sharpness, L1&rarr;faithfulness, sum&rarr;both; matches Table 1 where L1+cGAN scores highest.`, why: `This is the paper's central ablation, reproduced qualitatively on toy data.` }
        ],
        answer: `<p><b>L1 only blurs, L1+GAN commits.</b> In our toy run the <b>L1-only</b> generator hedges the
                 ambiguous fill toward a washed-out gray &mdash; its interior spatial std collapses to about
                 <b>0.000</b> (a flat constant, versus the target's <b>1.004</b>) &mdash; because the L1 optimum on a
                 multimodal target is a central (averaged) value. The <b>L1+PatchGAN</b> generator instead commits to
                 one sharp, real-looking stripe phase &mdash; interior std about <b>1.004</b>, matching the target
                 &mdash; while the heavily-weighted L1 term ($\\lambda=100$) keeps the overall shape correct. The
                 L1-only loss also plateaus at an irreducible floor (~<b>0.317</b>) it cannot beat by averaging,
                 whereas adding the GAN lets $G$ dip below it (~<b>0.198</b>) by picking a single mode. This is
                 exactly the paper's Table 1 story (L1+cGAN best): <b>the GAN term buys sharpness, the L1 term buys
                 faithfulness, and you want both.</b></p>` },
      {
        q: `Your worked example had a true pixel $y=0.7$ and an output $G(x)=-0.3$, so the L1 cost was
            $|0.7-(-0.3)|=1.0$ and $\\lambda$ times it was $100$. Now suppose for some input the correct pixel is
            equally likely $+1$ or $-1$. What constant output minimizes the expected L1 cost, what is that cost, and
            what does this say about why L1 alone blurs?`,
        steps: [
          { do: `The expected L1 for a constant $c$ is $\\tfrac12|c-1| + \\tfrac12|c+1|$.`, why: `Average the two equally-likely targets.` },
          { do: `This is minimized for any $c\\in[-1,1]$ (the median is not unique here); the symmetric pick is $c=0$, cost $\\tfrac12(1)+\\tfrac12(1)=1$.`, why: `L1's minimizer is the conditional median; with two symmetric modes the middle (gray) is optimal.` },
          { do: `So L1 has no reason to commit to $+1$ or $-1$ &mdash; it outputs the gray middle, which renders as blur.`, why: `The blur is the optimum of the loss, not a training failure &mdash; the GAN term is what penalizes it.` }
        ],
        answer: `<p>The expected L1 cost is $\\tfrac12|c-1|+\\tfrac12|c+1|$, minimized by the <b>median</b> &mdash; here
                 any $c\\in[-1,1]$, with the symmetric choice $c=0$ giving cost $1$. So when the target is ambiguous,
                 L1 is perfectly happy outputting the <b>gray middle</b> instead of committing to $+1$ or $-1$; that
                 central value is the blur. The GAN term breaks the tie, because a gray patch is easily flagged as
                 fake, forcing $G$ to pick one sharp mode.</p>` },
      {
        q: `Why does pix2pix make the discriminator judge the <b>pair</b> $(x, \\text{output})$ rather than just the
            output image, and what failure appears if you feed $D$ only the output?`,
        steps: [
          { do: `Recall the goal is translation: the output must correspond to <i>this</i> input $x$, not just look real.`, why: `A realistic photo that ignores the input label map is a wrong translation.` },
          { do: `Feeding $D$ the pair lets it check "is this a real $(x,y)$ correspondence?" &mdash; conditioning, as in paper-cgan.`, why: `Only the pair carries the information of whether output matches input.` },
          { do: `If $D$ sees only the output, it can be fooled by any realistic image; $G$ is free to ignore $x$ (mode collapse onto generic realistic outputs).`, why: `Without the pair, there is no pressure to respect the input &mdash; the L1 term alone must carry all faithfulness.` }
        ],
        answer: `<p>Because translation requires the output to <b>match the specific input</b> $x$, not merely look
                 real. Feeding $D$ the concatenated pair $(x,\\text{output})$ makes it a "is this a real correspondence
                 of $x$?" judge (the conditional GAN of paper-cgan). If $D$ sees only the output, any realistic image
                 passes and $G$ can ignore $x$ &mdash; you lose the conditioning and lean entirely on L1 for
                 faithfulness, which then blurs. The pair is what ties realism to the right input.</p>` }
    ]
  });

  window.CODE["paper-pix2pix"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we build the three pieces of pix2pix from <code>nn</code> primitives &mdash; a <b>U-Net
       generator</b> (encoder/decoder with a <code>torch.cat</code> <b>skip connection</b> and dropout-as-noise), a
       <b>PatchGAN discriminator</b> (input is the <b>pair</b> <code>cat([x, output])</code>; output is a
       <b>grid</b> of per-patch logits), and the <b>L1 + adversarial</b> objective of Eq. 4 with
       <code>lambda=100</code>. We train on a toy <b>paired</b> task &mdash; an outline (input) &rarr; the same disk
       <b>filled with stripes</b> (target) &mdash; but the stripe <b>phase is random</b>, so for one input there are
       several valid targets. That multimodality is exactly the regime where <b>L1 alone blurs</b> (it averages the
       phases to gray) and <b>L1+PatchGAN sharpens</b> (it commits to one phase). The key lines are the two
       alternating steps: $D$ minimizes <code>bce(D(x,y),1)+bce(D(x,G(x).detach()),0)</code> over the patch grid;
       $G$ minimizes <code>bce(D(x,G(x)),1)+100*L1(G(x),y)</code>. The first cell recomputes the worked example
       ($|0.7-(-0.3)|=1.0$, $100\\times1.0=100$, $\\log 0.9=-0.1054$, $\\log 0.8=-0.2231$, patch equilibrium
       $-\\log 0.5=0.6931$). We include the <b>ablation</b> (L1 only) so you can watch sharpness disappear. Paste
       into Colab and run (CPU is fine; torch/torchvision preinstalled &mdash; no pip).</p>`,
    code: `import torch, torch.nn as nn, numpy as np, math
torch.manual_seed(0); np.random.seed(0)

# --- 0. Sanity-check the worked example (loss arithmetic). ---
print("worked example:")
print("  L1 of one pixel |0.7-(-0.3)| = %.4f" % abs(0.7-(-0.3)))     # 1.0
print("  lambda * that = 100 * 1.0    = %.1f" % (100*abs(0.7-(-0.3))))# 100.0
print("  cGAN real term  log D (D=0.9)= %.4f" % math.log(0.9))        # -0.1054
print("  cGAN fake term  log(1-D) D=.2= %.4f" % math.log(1-0.2))      # -0.2231
print("  patch equilibrium -log 0.5   = %.4f" % (-math.log(0.5)))     # 0.6931

# --- 1. Toy PAIRED data: outline (input) -> disk filled with stripes (target). ---
# The stripe PHASE is random => several valid targets per input (multimodal).
H = 16; CY = CX = 8; R = 5
yy, xx = np.mgrid[0:H, 0:H]
DIST = np.sqrt((yy-CY)**2 + (xx-CX)**2); INSIDE = DIST <= R
OUTLINE = (INSIDE & (DIST > R-1.3)).astype(np.float32)
def make_pair():
    phase = np.random.randint(0, 2)                      # <- the multimodality
    stripes = ((xx + phase) % 2 == 0).astype(np.float32)
    filled = np.where(INSIDE, stripes, 0.0).astype(np.float32)
    return OUTLINE.copy(), filled
def batch(m):
    xs, ys = zip(*[make_pair() for _ in range(m)])
    x = torch.tensor(np.stack(xs)).view(m,1,H,H); y = torch.tensor(np.stack(ys)).view(m,1,H,H)
    return x*2-1, y*2-1                                   # to [-1,1] for tanh

# --- 2. U-Net generator: encoder/decoder + ONE skip connection + dropout-as-noise. ---
class UNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.d1 = nn.Sequential(nn.Conv2d(1,16,4,2,1),  nn.LeakyReLU(0.2))          # 16->8
        self.d2 = nn.Sequential(nn.Conv2d(16,32,4,2,1), nn.LeakyReLU(0.2))          # 8->4
        self.u1 = nn.Sequential(nn.ConvTranspose2d(32,16,4,2,1), nn.ReLU(),
                                nn.Dropout(0.5))                                     # 4->8 ; dropout = noise
        self.u2 = nn.Sequential(nn.ConvTranspose2d(32,1,4,2,1),  nn.Tanh())         # 8->16 ; in=32 after skip
    def forward(self, x):
        e1 = self.d1(x); e2 = self.d2(e1)
        d  = self.u1(e2)
        d  = torch.cat([d, e1], 1)                        # <- U-Net SKIP: encoder e1 onto decoder
        return self.u2(d)

# --- 3. PatchGAN discriminator: input is the PAIR (x, output); output is a GRID of logits. ---
class PatchD(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(2,16,4,2,1),  nn.LeakyReLU(0.2),    # in=2: concat(x, output)
            nn.Conv2d(16,32,4,2,1), nn.LeakyReLU(0.2),
            nn.Conv2d(32,1,3,1,1))                        # 4x4 grid of patch logits (NOT one scalar)
    def forward(self, x, y): return self.net(torch.cat([x, y], 1))

bce = nn.BCEWithLogitsLoss(); L1 = nn.L1Loss(); LAM = 100.0   # lambda=100 (Eq. 4)

def train(use_gan, steps=2500):
    torch.manual_seed(1)
    G = UNet(); optG = torch.optim.Adam(G.parameters(), lr=2e-3, betas=(0.5,0.999))
    if use_gan:
        D = PatchD(); optD = torch.optim.Adam(D.parameters(), lr=2e-3, betas=(0.5,0.999))
    for s in range(steps):
        x, y = batch(64)
        # (a) DISCRIMINATOR step: real pair "real", generated pair "fake" (per patch).
        if use_gan:
            fake = G(x).detach()                          # detach: this step must NOT move G
            dr, df = D(x, y), D(x, fake)
            lossD = bce(dr, torch.ones_like(dr)) + bce(df, torch.zeros_like(df))
            optD.zero_grad(); lossD.backward(); optD.step()
        # (b) GENERATOR step: fool D (if used) AND stay near the target -> Eq. 4.
        fake = G(x); lossL1 = L1(fake, y)
        if use_gan:
            dg = D(x, fake)
            lossG = bce(dg, torch.ones_like(dg)) + LAM*lossL1     # cGAN + lambda*L1
        else:
            lossG = LAM*lossL1                                    # ABLATION: L1 only
        optG.zero_grad(); lossG.backward(); optG.step()
        if s % 500 == 0:
            tag = "L1+GAN" if use_gan else "L1only"
            print("  [%s] step %4d  L1 %.4f" % (tag, s, lossL1.item()))
    return G

def show(G, title):
    torch.manual_seed(7); x, y = batch(1)
    with torch.no_grad(): out = G(x)[0,0]
    print(title)
    for r in range(H):
        print("".join(" .:-=+*#%@"[min(9,int(((out[r,c]+1)/2).clamp(0,1)*9))] for c in range(H)))

def sharp_std(G, n=2000):           # spatial STD inside the disk: 0=flat gray blur, ~1=committed stripes
    x, y = batch(n)
    with torch.no_grad(): out = G(x)
    mask = torch.tensor(INSIDE).view(1,1,H,H).expand(n,1,H,H).bool()
    vals = out[mask].view(n, -1)
    return vals.std(dim=1).mean().item()

print("\\n--- train L1 ONLY (ablation) ---");  Gl1  = train(use_gan=False)
print("\\n--- train L1 + PatchGAN (Eq. 4) ---"); Ggan = train(use_gan=True)
show(Gl1,  "\\nL1-only output  (expect washed-out / gray = blur):")
show(Ggan, "\\nL1+GAN output   (expect a committed sharp stripe fill):")
print("\\ninterior sharpness = spatial std inside the disk (0=gray blur, ~1=committed stripes):")
print("  L1 only  : %.3f   <- flat gray: averaged the two stripe phases (the blur)" % sharp_std(Gl1))
print("  L1 + GAN : %.3f   <- committed to one sharp phase (matches the target)"   % sharp_std(Ggan))
print("The GAN term buys SHARPNESS; the L1 term buys FAITHFULNESS (shape). Eq. 4 wants both.")
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-pix2pix"] = {
    question: "On a paired task with an ambiguous target, what does each loss term buy — does L1 alone blur, and does adding the PatchGAN make the output sharp?",
    charts: [
      {
        type: "bar",
        title: "Interior fill sharpness after training — spatial std inside the disk (≈1 = committed stripes, 0 = flat gray = blur)",
        xlabel: "loss used to train the generator",
        ylabel: "interior spatial std (target ≈ 1.004)",
        series: [
          { name: "sharpness (std)", color: "#7ee787",
            points: [["L1 only", 0.000], ["L1 + PatchGAN", 1.004]] }
        ]
      },
      {
        type: "line",
        title: "Generator L1 loss vs step — L1-only parks at an irreducible ≈0.317 floor; L1+PatchGAN dips below it by committing to one mode",
        xlabel: "training step",
        ylabel: "interior L1 loss",
        series: [
          { name: "L1 only", color: "#ff7b72",
            points: [[0,0.9049],[100,0.317],[200,0.3162],[300,0.3172],[400,0.3171],[500,0.3103],[600,0.3178],[700,0.3177],[800,0.3134],[900,0.3171],[1000,0.3164],[1100,0.3134],[1200,0.3158],[1300,0.3115],[1400,0.3188],[1500,0.3164],[1600,0.3182],[1700,0.3207],[1800,0.3164],[1900,0.3146],[2000,0.317],[2100,0.3189],[2200,0.3103],[2300,0.3176],[2400,0.3152]] },
          { name: "L1 + PatchGAN", color: "#4ea1ff",
            points: [[0,0.9038],[100,0.3348],[200,0.3376],[300,0.3187],[400,0.3179],[500,0.3268],[600,0.2874],[700,0.2579],[800,0.3367],[900,0.3757],[1000,0.356],[1100,0.3358],[1200,0.2969],[1300,0.3167],[1400,0.2572],[1500,0.2973],[1600,0.3263],[1700,0.3165],[1800,0.1982],[1900,0.3459],[2000,0.3067],[2100,0.297],[2200,0.3265],[2300,0.3264],[2400,0.2967]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A U-Net generator (encoder/decoder + a torch.cat skip connection + dropout-as-noise) and a PatchGAN discriminator (input = the pair cat[x,output]; output = a 4&times;4 grid of patch logits), built from nn.Conv2d, trained on a toy <b>paired</b> task: an outline (input) &rarr; the same disk filled with stripes (target), where the stripe <b>phase is random</b> &mdash; so for one input there are several valid targets (multimodal), exactly the regime of pix2pix Fig. 4. <b>L1 only</b> (ablation): the generator <b>averages</b> the competing phases to a flat gray &mdash; interior spatial std <b>0.000</b> vs the target's <b>1.004</b> &mdash; the paper's blur (&sect;1: \"averaging all plausible outputs causes blurring\"); its L1 loss parks at an irreducible <b>~0.317</b> floor it cannot beat. <b>L1 + PatchGAN</b> (Eq. 4, &lambda;=100): the GAN term refuses the gray average, so the generator <b>commits</b> to one sharp stripe phase &mdash; interior std <b>1.004</b>, matching the target &mdash; and its L1 can dip below the floor (to ~0.198) by picking a single mode. The ASCII renders in the notebook show it directly: L1-only is blank/gray inside the disk, L1+GAN draws crisp stripes. <b>The GAN term buys sharpness; the heavily-weighted L1 term keeps the shape faithful &mdash; just like Table 1, where L1+cGAN scores highest.</b>",
    code: `import torch, torch.nn as nn, numpy as np
torch.manual_seed(0); np.random.seed(0)

# Toy PAIRED task: outline (input) -> disk filled with stripes (target), stripe PHASE random
# => multimodal target. This is the regime where L1 blurs and the PatchGAN sharpens (pix2pix Fig.4).
H = 16; CY = CX = 8; R = 5
yy, xx = np.mgrid[0:H, 0:H]; DIST = np.sqrt((yy-CY)**2+(xx-CX)**2); INSIDE = DIST <= R
OUTLINE = (INSIDE & (DIST > R-1.3)).astype(np.float32)
def make_pair():
    phase = np.random.randint(0,2); stripes = ((xx+phase)%2==0).astype(np.float32)
    return OUTLINE.copy(), np.where(INSIDE, stripes, 0.0).astype(np.float32)
def batch(m):
    xs, ys = zip(*[make_pair() for _ in range(m)])
    return (torch.tensor(np.stack(xs)).view(m,1,H,H)*2-1,
            torch.tensor(np.stack(ys)).view(m,1,H,H)*2-1)

class UNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.d1=nn.Sequential(nn.Conv2d(1,16,4,2,1),nn.LeakyReLU(0.2))
        self.d2=nn.Sequential(nn.Conv2d(16,32,4,2,1),nn.LeakyReLU(0.2))
        self.u1=nn.Sequential(nn.ConvTranspose2d(32,16,4,2,1),nn.ReLU(),nn.Dropout(0.5))
        self.u2=nn.Sequential(nn.ConvTranspose2d(32,1,4,2,1),nn.Tanh())
    def forward(self,x):
        e1=self.d1(x); e2=self.d2(e1); d=self.u1(e2); d=torch.cat([d,e1],1); return self.u2(d)
class PatchD(nn.Module):
    def __init__(self):
        super().__init__()
        self.net=nn.Sequential(nn.Conv2d(2,16,4,2,1),nn.LeakyReLU(0.2),
                               nn.Conv2d(16,32,4,2,1),nn.LeakyReLU(0.2),nn.Conv2d(32,1,3,1,1))
    def forward(self,x,y): return self.net(torch.cat([x,y],1))

bce=nn.BCEWithLogitsLoss(); L1=nn.L1Loss(); LAM=100.0
def train(use_gan, steps=2500):
    torch.manual_seed(1); G=UNet(); optG=torch.optim.Adam(G.parameters(),lr=2e-3,betas=(0.5,0.999))
    if use_gan: D=PatchD(); optD=torch.optim.Adam(D.parameters(),lr=2e-3,betas=(0.5,0.999))
    hist=[]
    for s in range(steps):
        x,y=batch(64)
        if use_gan:
            fake=G(x).detach(); dr,df=D(x,y),D(x,fake)
            lossD=bce(dr,torch.ones_like(dr))+bce(df,torch.zeros_like(df))
            optD.zero_grad(); lossD.backward(); optD.step()
        fake=G(x); lossL1=L1(fake,y)
        lossG = bce(D(x,fake),torch.ones_like(D(x,fake)))+LAM*lossL1 if use_gan else LAM*lossL1
        optG.zero_grad(); lossG.backward(); optG.step()
        if s%100==0: hist.append((s,round(lossL1.item(),4)))
    return G,hist
def sharp_std(G,n=2000):              # spatial std inside the disk: 0=flat gray blur, ~1=committed stripes
    x,y=batch(n)
    with torch.no_grad(): out=G(x)
    mask=torch.tensor(INSIDE).view(1,1,H,H).expand(n,1,H,H).bool()
    return out[mask].view(n,-1).std(dim=1).mean().item()

Gl1,hl1=train(False); Ggan,hgan=train(True)
print("interior sharpness std (0=gray blur, ~1=committed): L1only %.3f  L1+GAN %.3f"
      % (sharp_std(Gl1), sharp_std(Ggan)))
print("L1-only L1 history :", hl1)
print("L1+GAN  L1 history :", hgan)
# L1 alone hedges the ambiguous fill to a flat gray (std ~0 = blur); L1+PatchGAN commits to one sharp phase (std ~1).`
  };
})();
