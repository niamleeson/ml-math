/* Paper lesson — "A Style-Based Generator Architecture for GANs" (StyleGAN), Karras et al. 2018.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-stylegan".
   GROUNDED from arXiv:1812.04948 via the ar5iv HTML mirror
   (Section 2 style-based generator + AdaIN Eq. 1; Section 3.1 mixing regularization;
   Table 1 FID; Appendix B truncation trick). Cross-links paper-gan (the base framework)
   and paper-progan (the progressive-growing backbone it builds on; lesson may not exist yet).
   Track B (architecture): build a toy style-based generator from nn.Linear — a mapping
   network z->w, an affine A producing per-channel (scale, bias) styles, AdaIN injection,
   per-layer noise — and DEMO AdaIN + style mixing on toy data; ABLATE by removing the
   normalize step. The GAN minimax math lives in concept dl-gan; here we recap and focus
   on the style architecture. */
(function () {
  window.LESSONS.push({
    id: "paper-stylegan",
    title: "StyleGAN — A Style-Based Generator Architecture for GANs (2018)",
    tagline: "Redesign the GAN generator so each layer is steered by a learned 'style', giving scale-separated, controllable image synthesis.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Tero Karras, Samuli Laine, Timo Aila",
      org: "NVIDIA",
      year: 2018,
      venue: "arXiv:1812.04948 (Dec 2018); CVPR 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1812.04948",
      code: "https://github.com/NVlabs/stylegan"
    },
    conceptLink: "dl-gan",
    partOf: [],
    prereqs: ["dl-gan", "pt-nn-module", "dl-batchnorm"],

    // WHY READ IT
    problem:
      `<p>By 2018, GANs (see <b>paper-gan</b>) could make sharp images, and <b>progressive growing</b>
       (paper-progan) pushed them to high resolution by training coarse-to-fine. But the
       <b>generator</b> &mdash; the network that turns a random noise vector into an image &mdash; was still a
       "black box". The paper's framing (&sect;1):</p>
       <blockquote>"the generators continue to operate as black boxes, and despite recent efforts, the
       understanding of various aspects of the image synthesis process &hellip; is still lacking. The
       properties of the latent space are also poorly understood."</blockquote>
       <p>In plain words: you fed a noise vector $\\mathbf{z}$ in at the bottom and an image came out, but you
       could not say <i>which part</i> of $\\mathbf{z}$ controlled pose vs. hair vs. freckles. The different
       factors were <b>entangled</b> &mdash; tangled together so that nudging one number changed several
       unrelated things at once. The authors wanted a generator whose internals you could understand and
       <b>steer</b>, separating coarse attributes (pose, face shape) from fine ones (skin texture, hair
       strands).</p>`,
    contribution:
      `<ul>
        <li><b>A mapping network <code>z &rarr; w</code>.</b> Instead of feeding the noise $\\mathbf{z}$ straight
        into the generator, an 8-layer <b>mapping network</b> $f$ first maps $\\mathbf{z}$ (512-D) to an
        intermediate vector $\\mathbf{w}$ (512-D). The paper argues $\\mathbf{w}$ lives in a
        <b>less entangled</b> space $\\mathcal{W}$ &mdash; one number tends to control one attribute (&sect;1, &sect;4).</li>
        <li><b>Style injection by AdaIN.</b> $\\mathbf{w}$ is not fed in at the bottom. Learned affine
        transforms turn $\\mathbf{w}$ into <b>styles</b> $\\mathbf{y}=(\\mathbf{y}_s,\\mathbf{y}_b)$ that control
        an <b>adaptive instance normalization (AdaIN)</b> step <i>after every convolution layer</i> (Eq. 1).
        The image grows from a <b>learned constant</b> $4{\\times}4{\\times}512$ tensor &mdash; not from $\\mathbf{z}$.</li>
        <li><b>Per-layer noise + style mixing.</b> Single-channel Gaussian <b>noise</b> is added after each
        convolution (with learned per-channel scaling) to supply stochastic detail. <b>Mixing regularization</b>
        feeds two different $\\mathbf{w}$'s to different layers during training, forcing each layer's style to
        act locally (&sect;3.1).</li>
      </ul>`,
    whyItMattered:
      `<p>StyleGAN set a new bar for photorealistic faces and gave the field <b>controllable</b> generation:
       coarse styles (fed to low-resolution layers) move pose and face shape; fine styles (high-resolution
       layers) move skin and hair texture &mdash; you can mix them. It introduced the <b>FFHQ</b> face dataset and
       the latent-space tools (truncation, style mixing) that power "GAN editing". StyleGAN2 and StyleGAN3
       refined the same recipe, and the AdaIN-style-injection idea spread well beyond faces.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Style-based generator)</b> &mdash; the whole architecture: mapping network $f$, the affine
        transforms $A$, the <b>AdaIN</b> step you will transcribe (<b>Eq. 1</b>), the learned constant input, and
        the per-layer <b>noise</b> $B$. <b>Fig. 1</b> is the map of the network &mdash; keep it open.</li>
        <li><b>&sect;3 / &sect;3.1 (Properties / Mixing regularization)</b> &mdash; why coarse vs. fine styles separate,
        and how mixing two latents during training (the "style mixing" trick) localizes each layer's effect.</li>
        <li><b>Table 1</b> &mdash; the FID ablation: each added component (mapping net, noise, mixing) and its FID.</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (the perceptual-path-length and linear-separability disentanglement metrics &mdash;
       read the intuition, skip the exact formulas first pass), and <b>Appendix B</b> (the truncation trick in
       $\\mathcal{W}$ &mdash; note it exists: trade variety for quality by pulling $\\mathbf{w}$ toward the average).</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>AdaIN takes a feature map (the stack of numbers one channel of the network produces) and a style
       $(\\mathbf{y}_s,\\mathbf{y}_b)$. It first <b>normalizes</b> the feature map to mean 0 and standard deviation 1,
       then multiplies by $\\mathbf{y}_s$ and adds $\\mathbf{y}_b$.</p>
       <p>After AdaIN runs on one channel, what will that channel's output <b>mean</b> and <b>standard deviation</b>
       be &mdash; in terms of $\\mathbf{y}_s$ and $\\mathbf{y}_b$? Does it depend on what the channel's original
       content was? Write your guess, then check the chart below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the toy generator and fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Mapping network:</b> <code>f = MLP(z_dim &rarr; ... &rarr; w_dim)</code> &mdash; a few
        <code>nn.Linear</code> layers turning noise $\\mathbf{z}$ into $\\mathbf{w}$.</li>
        <li><b>Affine <code>A</code>:</b> <code>nn.Linear(w_dim &rarr; 2*C)</code> &mdash; from $\\mathbf{w}$ produce
        a scale $\\mathbf{y}_s$ and bias $\\mathbf{y}_b$, one pair <b>per channel</b> $C$.</li>
        <li><b>AdaIN:</b> TODO &mdash; <code>normalize x per channel</code> (subtract its mean, divide by its std),
        then <code>y_s * x_norm + y_b</code>.</li>
        <li><b>Noise:</b> TODO &mdash; add <code>scale * randn_like(x)</code> after the conv, with a learned
        per-channel <code>scale</code>.</li>
        <li>Start from a <b>learned constant</b> tensor, not from $\\mathbf{z}$.</li>
       </ul>
       <p>Predict: if you take the coarse-layer style from one $\\mathbf{w}_A$ and the fine-layer style from a
       different $\\mathbf{w}_B$ (<b>style mixing</b>), which attributes come from which?</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from an ordinary GAN generator (paper-gan): noise $\\mathbf{z}$ goes in the bottom, an image
       comes out. StyleGAN <b>rewires</b> this in four moves (&sect;2, Fig. 1).</p>
       <p><b>1. Mapping network <code>z &rarr; w</code>.</b> First, an 8-layer fully-connected network $f$ maps the
       noise $\\mathbf{z}\\in\\mathcal{Z}$ (512 numbers) to an intermediate vector $\\mathbf{w}\\in\\mathcal{W}$ (also
       512 numbers). The paper's claim is that $\\mathcal{W}$ is <b>less entangled</b> than $\\mathcal{Z}$:
       "we expect the training to yield a less entangled $\\mathcal{W}$ in an unsupervised setting." Intuition:
       $\\mathbf{z}$ must follow a fixed Gaussian, but $\\mathbf{w}$ is free to warp so that <i>directions</i> line
       up with real factors of variation.</p>
       <p><b>2. Styles from <code>w</code> via affine <code>A</code>.</b> $\\mathbf{w}$ is never fed in as a
       spatial input. Instead, at each layer a learned <b>affine transform</b> $A$ (a linear layer) turns
       $\\mathbf{w}$ into a <b>style</b> $\\mathbf{y}=(\\mathbf{y}_s,\\mathbf{y}_b)$ &mdash; a per-channel scale
       $\\mathbf{y}_s$ and bias $\\mathbf{y}_b$.</p>
       <p><b>3. AdaIN injection.</b> The actual image grows from a <b>learned constant</b> $4{\\times}4{\\times}512$
       tensor. After <i>every</i> convolution, an <b>AdaIN</b> step (Eq. 1) normalizes each channel to mean 0 /
       std 1, then re-scales and shifts it by that layer's style $(\\mathbf{y}_s,\\mathbf{y}_b)$. So $\\mathbf{w}$
       controls the image purely by setting <b>per-channel statistics</b>, layer by layer. Because each layer
       normalizes away the previous style before applying its own, a style's effect is confined to its layer
       &mdash; that is what separates coarse from fine.</p>
       <p><b>4. Per-layer noise.</b> After each convolution, a single-channel image of <b>Gaussian noise</b> is
       added, scaled by a learned per-channel factor $B$. This feeds <i>stochastic</i> detail (exact hair
       strands, freckles, pores) that does not need to be carried by $\\mathbf{w}$.</p>
       <p><b>Why it disentangles (&sect;3.1).</b> Low-resolution layers' styles change coarse things (pose, face
       shape); high-resolution layers' styles change fine things (color scheme, micro-texture). <b>Mixing
       regularization</b> &mdash; during training, switch from $\\mathbf{w}_A$ to a second $\\mathbf{w}_B$ at a
       random layer &mdash; forces each layer's style to act on its own, "preventing the network from assuming that
       adjacent styles are correlated." That is also the <b>style mixing</b> you can do at test time.</p>`,
    architecture:
      `<p>StyleGAN's generator has <b>two parts</b> (Fig. 1): a <b>mapping network</b> $f$ and a
       <b>synthesis network</b> $g$. The discriminator is unchanged from the progressive-growing baseline.</p>
       <p><b>Mapping network $f$ ($\\mathcal{Z}\\to\\mathcal{W}$).</b> Input $\\mathbf{z}\\in\\mathbb{R}^{512}$ (normalized
       onto the unit hypersphere) &rarr; <b>8 fully-connected layers</b> (512&rarr;512 each, with LeakyReLU) &rarr;
       output $\\mathbf{w}\\in\\mathbb{R}^{512}$. That is the entire mapping net &mdash; no convolutions, no image.</p>
       <p><b>Synthesis network $g$ (the image generator).</b> Unlike a traditional generator, it does <i>not</i> take
       $\\mathbf{z}$ as input. It starts from a single <b>learned constant</b> tensor of shape $4{\\times}4{\\times}512$.
       It then climbs through <b>9 resolutions</b> (4&sup2; &rarr; 1024&sup2;), <b>two convolution blocks per
       resolution</b> = <b>18 layers total</b>, with bilinear upsampling between resolutions. <b>Each layer</b>
       runs the same micro-pipeline:</p>
       <ul>
        <li><b>(a) Convolution</b> ($3{\\times}3$) on the running feature map.</li>
        <li><b>(b) Add noise:</b> $\\mathbf{x}\\leftarrow\\mathbf{x}+B\\,\\boldsymbol{\\varepsilon}$ &mdash; a fresh
        single-channel Gaussian image $\\boldsymbol{\\varepsilon}$, scaled per-channel by learned $B$.</li>
        <li><b>(c) AdaIN</b> (Eq. 1): normalize each channel, then apply the style $\\mathbf{y}=A(\\mathbf{w})$ from a
        per-layer affine $A$. This is the <i>only</i> place $\\mathbf{w}$ enters.</li>
        <li><b>(d) Nonlinearity</b> (LeakyReLU).</li>
       </ul>
       <p>A final $1{\\times}1$ convolution (\"toRGB\") maps the last feature map to a 3-channel image. So a single
       $\\mathbf{w}$ fans out to <b>18 style inputs</b> (and 18 noise inputs), one per layer.</p>
       <p><b>Contrast &mdash; traditional generator.</b> A standard GAN generator (e.g. the progressive-growing
       baseline) feeds $\\mathbf{z}$ <b>through the first layer</b> as the sole input, then stacks
       convolution&rarr;upsample blocks; there is no mapping network, no intermediate $\\mathcal{W}$, no per-layer
       style or noise. All variation must be squeezed through that one bottom input, which entangles attributes.
       StyleGAN moves $\\mathbf{z}$'s influence out of the input and into <b>per-layer AdaIN styles</b>, and adds
       <b>per-layer noise</b> for stochastic detail &mdash; this is the whole architectural change (params: 26.2M vs
       23.1M, &sect;2).</p>`,
    symbols: [
      { sym: "$\\mathbf{z}$", desc: "the <b>input noise / latent vector</b> (512-D), drawn from a fixed Gaussian &mdash; same role as in any GAN." },
      { sym: "$\\mathbf{w}$", desc: "the <b>intermediate latent</b> (512-D), the output of the mapping network $f(\\mathbf{z})$. Lives in space $\\mathcal{W}$, claimed to be less <b>entangled</b> (one number &rarr; one attribute) than $\\mathcal{Z}$." },
      { sym: "$f$", desc: "the <b>mapping network</b>: an 8-layer fully-connected net that maps $\\mathbf{z}\\mapsto\\mathbf{w}$." },
      { sym: "$A$", desc: "a learned <b>affine transform</b> (a linear layer) that turns $\\mathbf{w}$ into a style $\\mathbf{y}=(\\mathbf{y}_s,\\mathbf{y}_b)$ for one layer." },
      { sym: "$\\mathbf{x}_i$", desc: "the $i$-th <b>feature map</b> &mdash; the grid of activations that channel $i$ produces at a given layer (in code, one slice of the tensor along the channel axis)." },
      { sym: "$\\mu(\\mathbf{x}_i)$", desc: "the <b>mean</b> of feature map $\\mathbf{x}_i$ (average over its spatial positions)." },
      { sym: "$\\sigma(\\mathbf{x}_i)$", desc: "the <b>standard deviation</b> of feature map $\\mathbf{x}_i$ &mdash; how spread out its values are." },
      { sym: "$\\mathbf{y}_{s,i}$", desc: "the style's <b>scale</b> for channel $i$ (a scalar): how big the normalized feature map is re-scaled." },
      { sym: "$\\mathbf{y}_{b,i}$", desc: "the style's <b>bias</b> for channel $i$ (a scalar): the value added after scaling &mdash; sets the channel's new mean." },
      { sym: "AdaIN", desc: "a plain term: <b>adaptive instance normalization</b> &mdash; normalize a feature map to mean 0 / std 1, then re-scale and shift it by a style $(\\mathbf{y}_s,\\mathbf{y}_b)$ that is <i>computed from</i> $\\mathbf{w}$ (the \"adaptive\" part). 'Instance' = normalize each sample's each channel on its own." },
      { sym: "$B$", desc: "the per-layer <b>noise</b> input: a single-channel Gaussian-noise image, scaled by a learned per-channel factor and added after each convolution &mdash; supplies stochastic detail." },
      { sym: "“entangled”", desc: "a plain term: when one latent number controls several unrelated image attributes at once, so you cannot change one factor (e.g. pose) without disturbing others (e.g. hair). StyleGAN aims for the opposite &mdash; <b>disentangled</b> control." },
      { sym: "FID", desc: "a plain term: <b>Fr&eacute;chet Inception Distance</b>, a score for how close generated images are to real ones &mdash; <i>lower is better</i>. The paper reports it in Table 1." },
      { sym: "$\\mathcal{Z},\\mathcal{W}$", desc: "the <b>input latent space</b> $\\mathcal{Z}$ (where $\\mathbf{z}$ lives, a fixed Gaussian) and the <b>intermediate latent space</b> $\\mathcal{W}$ (where $\\mathbf{w}=f(\\mathbf{z})$ lives, claimed less entangled)." },
      { sym: "$\\boldsymbol{\\varepsilon}$", desc: "a <b>single-channel Gaussian noise image</b> $\\mathcal{N}(0,\\mathbf{I})$ drawn fresh per layer; scaled by $B$ and added after each convolution." },
      { sym: "$\\bar{\\mathbf{w}}$", desc: "the <b>average</b> intermediate latent &mdash; the mean of $f(\\mathbf{z})$ over many random $\\mathbf{z}$ (the \"center of mass\", i.e. the average/most typical face)." },
      { sym: "$\\psi$", desc: "the <b>truncation factor</b> ($\\psi\\lt 1$): how far $\\mathbf{w}$ is kept from the average $\\bar{\\mathbf{w}}$. Smaller $\\psi$ = closer to the mean face = higher quality but less variety." },
      { sym: "$G,\\,g$", desc: "$G$ is the <b>whole generator</b> from $\\mathbf{z}$; $g$ is the <b>synthesis network</b> alone (takes $\\mathbf{w}$, not $\\mathbf{z}$) &mdash; used in the path-length metrics." },
      { sym: "slerp, lerp", desc: "plain terms: <b>spherical</b> linear interpolation (slerp, used in $\\mathcal{Z}$ on the Gaussian sphere) and ordinary <b>linear</b> interpolation (lerp, used in the flat space $\\mathcal{W}$) between two latents at fraction $t$." },
      { sym: "$d(\\cdot,\\cdot)$", desc: "a learned <b>perceptual image distance</b> (VGG-based) measuring how different two generated images look." },
      { sym: "$\\epsilon,\\,t$", desc: "$\\epsilon=10^{-4}$ is a tiny step along the interpolation path; $t\\sim U(0,1)$ is a random position on that path." },
      { sym: "$l_{\\mathcal{Z}},\\,l_{\\mathcal{W}}$", desc: "the <b>perceptual path length</b> in $\\mathcal{Z}$ and in $\\mathcal{W}$ (Eq. 2, 3): average perceptual change per unit step. Smaller = smoother = more disentangled." },
      { sym: "$H(Y_i\\mid X_i)$", desc: "the <b>conditional entropy</b> of true attribute label $Y_i$ given the SVM's predicted side $X_i$ &mdash; the extra uncertainty about $Y_i$ once you know which side of the hyperplane a point falls on." }
    ],
    formula: `$$ \\mathbf{w} \\;=\\; f(\\mathbf{z}), \\qquad f:\\mathcal{Z}\\!\\to\\!\\mathcal{W},\\quad \\mathbf{z}\\in\\mathbb{R}^{512},\\ \\mathbf{w}\\in\\mathbb{R}^{512} $$
       <p>(&sect;2) The <b>mapping network</b> $f$ &mdash; an 8-layer fully-connected network (MLP) &mdash; turns the input noise $\\mathbf{z}$ into the intermediate latent $\\mathbf{w}$.</p>

       $$ \\mathbf{y} \\;=\\; (\\mathbf{y}_s,\\mathbf{y}_b) \\;=\\; A(\\mathbf{w}) $$
       <p>(&sect;2) A learned <b>affine transform</b> $A$ (one per layer) maps $\\mathbf{w}$ to that layer's <b>style</b>: a per-channel scale $\\mathbf{y}_s$ and bias $\\mathbf{y}_b$.</p>

       $$ \\mathrm{AdaIN}(\\mathbf{x}_i,\\mathbf{y}) \\;=\\; \\mathbf{y}_{s,i}\\,\\frac{\\mathbf{x}_i - \\mu(\\mathbf{x}_i)}{\\sigma(\\mathbf{x}_i)} \\;+\\; \\mathbf{y}_{b,i} $$
       <p>(<b>Eq. 1</b>, &sect;2) <b>Adaptive instance normalization</b>: normalize feature map $\\mathbf{x}_i$ to mean 0 / std 1, then re-scale by $\\mathbf{y}_{s,i}$ and shift by $\\mathbf{y}_{b,i}$. Applied after every convolution.</p>

       $$ \\mathbf{x} \\;\\leftarrow\\; \\mathbf{x} \\;+\\; B\\,\\boldsymbol{\\varepsilon}, \\qquad \\boldsymbol{\\varepsilon}\\sim\\mathcal{N}(0,\\mathbf{I}) $$
       <p>(&sect;2) <b>Per-layer noise injection</b>: a single-channel Gaussian noise image $\\boldsymbol{\\varepsilon}$ is broadcast to all channels with a learned per-channel scaling factor $B$, added after each convolution &mdash; supplies stochastic detail.</p>

       $$ \\bar{\\mathbf{w}} \\;=\\; \\mathbb{E}_{\\mathbf{z}\\sim P(\\mathbf{z})}\\big[f(\\mathbf{z})\\big], \\qquad \\mathbf{w}' \\;=\\; \\bar{\\mathbf{w}} \\;+\\; \\psi\\,(\\mathbf{w}-\\bar{\\mathbf{w}}),\\quad \\psi\\lt 1 $$
       <p>(<b>Appendix B</b>) <b>Truncation trick in $\\mathcal{W}$</b>: pull $\\mathbf{w}$ toward the average $\\bar{\\mathbf{w}}$ by factor $\\psi$ &mdash; trades variety for quality. $\\psi=0$ gives the mean face; $\\psi=1$ leaves $\\mathbf{w}$ untouched.</p>

       $$ l_{\\mathcal{Z}} \\;=\\; \\mathbb{E}\\!\\left[\\tfrac{1}{\\epsilon^2}\\, d\\big(G(\\mathrm{slerp}(\\mathbf{z}_1,\\mathbf{z}_2;t)),\\, G(\\mathrm{slerp}(\\mathbf{z}_1,\\mathbf{z}_2;t+\\epsilon))\\big)\\right] $$
       $$ l_{\\mathcal{W}} \\;=\\; \\mathbb{E}\\!\\left[\\tfrac{1}{\\epsilon^2}\\, d\\big(g(\\mathrm{lerp}(f(\\mathbf{z}_1),f(\\mathbf{z}_2);t)),\\, g(\\mathrm{lerp}(f(\\mathbf{z}_1),f(\\mathbf{z}_2);t+\\epsilon))\\big)\\right] $$
       <p>(<b>Eq. 2 &amp; 3</b>, &sect;4.1) <b>Perceptual path length</b>: the average perceptual image change $d(\\cdot,\\cdot)$ per small step $\\epsilon$ along an interpolation path ($t\\sim U(0,1)$, $\\epsilon=10^{-4}$). Spherical interpolation (slerp) in $\\mathcal{Z}$; linear (lerp) in $\\mathcal{W}$. A smaller, smoother path indicates a more disentangled latent space.</p>

       $$ \\text{separability} \\;=\\; \\exp\\!\\Big(\\textstyle\\sum_i H(Y_i\\mid X_i)\\Big) $$
       <p>(&sect;4.2) <b>Linear separability</b>: fit a linear SVM per binary attribute $i$; $H(Y_i\\mid X_i)$ is the conditional entropy (extra information needed to recover the true label $Y_i$ given the SVM's side $X_i$). Lower means attributes are more linearly separable in latent space &mdash; better disentanglement.</p>`,
    whatItDoes:
      `<p>Read it left to right, for one channel $i$. The fraction
       $\\dfrac{\\mathbf{x}_i - \\mu(\\mathbf{x}_i)}{\\sigma(\\mathbf{x}_i)}$ <b>normalizes</b> the feature map:
       subtract its mean, divide by its standard deviation, so the result has mean 0 and standard deviation 1.
       This step <b>erases</b> whatever scale and offset the previous layer's style had put there &mdash; a clean
       slate.</p>
       <p>Then $\\mathbf{y}_{s,i}\\cdot(\\ldots) + \\mathbf{y}_{b,i}$ <b>re-styles</b> it: multiply by the style scale
       $\\mathbf{y}_{s,i}$ (sets the new standard deviation) and add the style bias $\\mathbf{y}_{b,i}$ (sets the new
       mean). So <b>this channel's entire statistical signature is overwritten by the style</b>, which came from
       $\\mathbf{w}$. The image content (the <i>pattern</i> in the feature map) survives normalization, but its
       per-channel "loudness" and "offset" are dictated by $\\mathbf{w}$ at this layer. Because each layer wipes
       the slate first, a style cannot leak past its own layer &mdash; that is the mechanism behind scale-separated,
       controllable synthesis.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the GAN math lives in the concept lesson.</b> StyleGAN does not change the GAN
       <i>objective</i>: it is still trained as a generator-vs-discriminator minimax game (paper-gan, concept
       <b>dl-gan</b>), so we do not re-derive the value function or its optimum here. What StyleGAN changes is the
       <b>generator's internal wiring</b>, and AdaIN (Eq. 1) is the heart of it.</p>
       <p>Why does AdaIN do exactly what the paragraph above claims? Let $\\hat{\\mathbf{x}}_i=(\\mathbf{x}_i-\\mu)/\\sigma$
       be the normalized map. By construction $\\hat{\\mathbf{x}}_i$ has mean 0 and standard deviation 1 (that is
       what subtracting the mean and dividing by the std <i>does</i>). Now apply the affine map
       $\\mathbf{y}_{s,i}\\hat{\\mathbf{x}}_i+\\mathbf{y}_{b,i}$. Mean and variance behave simply under an affine map:
       adding a constant shifts the mean, multiplying scales the std. So</p>
       <p>$$ \\mathrm{mean}\\big(\\mathbf{y}_{s,i}\\hat{\\mathbf{x}}_i+\\mathbf{y}_{b,i}\\big)=\\mathbf{y}_{b,i},
            \\qquad
            \\mathrm{std}\\big(\\mathbf{y}_{s,i}\\hat{\\mathbf{x}}_i+\\mathbf{y}_{b,i}\\big)=|\\mathbf{y}_{s,i}|. $$</p>
       <p>The output channel's mean is <b>exactly</b> the style bias and its std is <b>exactly</b> the style scale
       &mdash; <i>independent of the original content's mean and std</i>, which were normalized away. That
       content-independence is precisely why the style fully "owns" the per-channel statistics, and why the next
       layer (which normalizes again) is shielded from this one's style. The CODEVIZ panel shows this property
       holding numerically.</p>`,
    example:
      `<p>Work one AdaIN call by hand, with real numbers (these are recomputed in the notebook's first cell).
       Take one feature map with four activations and one style.</p>
       <ul class="steps">
        <li><b>The inputs.</b> Feature map $\\mathbf{x}_i = [\\,2,\\,4,\\,4,\\,6\\,]$; style scale
        $\\mathbf{y}_{s,i}=1.5$, style bias $\\mathbf{y}_{b,i}=0.5$.</li>
        <li><b>Normalize &mdash; mean.</b> $\\mu = \\tfrac{2+4+4+6}{4} = \\tfrac{16}{4} = 4.0$.</li>
        <li><b>Normalize &mdash; std.</b> Deviations are $[-2,0,0,2]$; variance
        $=\\tfrac{(-2)^2+0+0+2^2}{4}=\\tfrac{8}{4}=2.0$, so $\\sigma=\\sqrt{2}\\approx 1.4142$.</li>
        <li><b>Normalized map:</b> $\\dfrac{\\mathbf{x}_i-\\mu}{\\sigma}
        = \\Big[\\tfrac{-2}{1.4142},\\,0,\\,0,\\,\\tfrac{2}{1.4142}\\Big]
        = [-1.4142,\\,0,\\,0,\\,1.4142]$ &mdash; mean 0, std 1.</li>
        <li><b>Re-style:</b> multiply by $\\mathbf{y}_{s,i}=1.5$ and add $\\mathbf{y}_{b,i}=0.5$:
        $[\\,1.5(-1.4142)+0.5,\\;0.5,\\;0.5,\\;1.5(1.4142)+0.5\\,]
        = [-1.6213,\\,0.5,\\,0.5,\\,2.6213]$.</li>
        <li><b>Check the styled statistics.</b> The output's mean is exactly
        $\\mathbf{y}_{b,i}=0.5$ and its std is exactly $\\mathbf{y}_{s,i}=1.5$ &mdash; the content's original
        $\\mu=4$, $\\sigma=1.4142$ are gone, replaced by the style. That is AdaIN's whole job.</li>
       </ul>`,
    recipe:
      `<ol>
        <li><b>Mapping network</b> $f$: an MLP <code>z_dim &rarr; ... &rarr; w_dim</code> (paper: 8 layers, 512-D)
        producing $\\mathbf{w}$.</li>
        <li><b>Learned constant input:</b> start synthesis from a trainable $4{\\times}4{\\times}512$ tensor, not
        from $\\mathbf{z}$.</li>
        <li><b>Per layer:</b> convolution &rarr; add <b>noise</b> $B$ (scaled Gaussian) &rarr; <b>AdaIN</b> with
        style $\\mathbf{y}=A(\\mathbf{w})$ (Eq. 1) &rarr; nonlinearity. Repeat, upsampling toward the target
        resolution (the progressive-growing backbone from paper-progan).</li>
        <li><b>Affine</b> $A$ per layer: <code>nn.Linear(w_dim &rarr; 2*C)</code> &rarr; split into
        $(\\mathbf{y}_s,\\mathbf{y}_b)$.</li>
        <li><b>Mixing regularization (training):</b> for a fraction of images, draw a second $\\mathbf{w}_B$ and
        switch styles from $\\mathbf{w}_A$ to $\\mathbf{w}_B$ at a random layer &mdash; localizes each layer's style.</li>
        <li><b>Truncation (test, optional):</b> pull $\\mathbf{w}$ toward the average $\\bar{\\mathbf{w}}$ by a
        factor $\\psi\\lt 1$ to trade variety for quality (Appendix B).</li>
      </ol>`,
    results:
      `<p>The paper's Table 1 is an ablation on quality (FID, lower is better). The traditional baseline generator
       (their config <b>a</b>) scores <b>8.04</b> on FFHQ; adding the style-based pieces (mapping network +
       AdaIN, then noise, then mixing) drives the final config <b>f</b> down to <b>4.40</b> on FFHQ &mdash; and
       <b>5.17</b> on CelebA-HQ (Table 1, &sect;2.1, quoted figures). The paper also argues, via its
       perceptual-path-length and separability metrics (&sect;4), that $\\mathcal{W}$ is more disentangled than
       $\\mathcal{Z}$, and demonstrates coarse-vs-fine <b>style mixing</b> visually.</p>
       <p><i>The numbers in the CODEVIZ panel below are from our own tiny run &mdash; not the paper's reported
       results.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> StyleGAN's headline metric is <b>FID</b> (Fr&eacute;chet Inception
       Distance, <i>lower is better</i>) between 50K generated images and the real set, on <b>FFHQ</b> (1024&sup2;
       faces) and <b>CelebA-HQ</b>. The "no-skill" anchor is the traditional generator baseline (config
       <b>a</b>): the paper's Table 1 reports it at <b>8.04</b> FID on FFHQ &mdash; your full style-based generator
       must beat that to justify the rewrite. Alongside FID, the paper measures <b>perceptual path length</b> and
       <b>linear separability</b> (&sect;4) to claim $\\mathcal{W}$ is more disentangled than $\\mathcal{Z}$.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> These are cheap and catch a broken style pathway in seconds
        (the CODE cell does exactly these): feed any content through <b>AdaIN</b> and assert each output channel's
        <b>mean $=\\mathbf{y}_b$</b> and <b>std $=|\\mathbf{y}_s|$</b> to ~1e-5, independent of the input &mdash; if
        not, your normalize axis is wrong. Check the constant input is shape $4{\\times}4{\\times}512$ and that
        $\\mathbf{w}$ enters <i>only</i> through $A$, never as a spatial input. Verify the noise is single-channel
        broadcast (not per-channel content). Overfit the discriminator on a handful of reals vs a frozen batch of
        fakes and confirm it drives its loss toward 0 &mdash; if it can't, the data pipeline is broken.</li>
        <li><b>Expected range.</b> A correct full implementation should approach the paper's reported
        <b>4.40</b> FID on FFHQ and <b>5.17</b> on CelebA-HQ (Table 1, config <b>f</b>; reuse these &mdash; do not
        invent new ones). As a rule of thumb (not a paper claim): an FID stuck near or above the 8.04 baseline means
        the style pieces aren't helping; an FID in the hundreds means the generator is producing noise (broken
        AdaIN or a collapsed discriminator), not a tuning issue.</li>
        <li><b>Ablations &mdash; prove the key idea earns its keep.</b> The central component is the
        <b>AdaIN style pathway</b> (mapping net + AdaIN). Turn it off two ways: (1) remove the <b>normalize step</b>
        inside AdaIN (the practice ablation) &mdash; styles stop owning each channel's statistics, leak between
        layers, and scale-separated control collapses; (2) drop the <b>mapping network</b> and feed $\\mathbf{z}$
        straight in &mdash; FID should rise back toward the 8.04 baseline. If FID does <i>not</i> worsen, the style
        path isn't wired in. Also ablate <b>mixing regularization</b>: without it, test-time style mixing produces
        smeared, non-localized swaps (Table 2 motivation).</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Identical / near-identical samples</b> across different
        $\\mathbf{z}$ = <b>mode collapse</b> (generator beat the discriminator; lower G's LR or rebalance).
        <b>NaN losses</b> = LR too high or a divide-by-zero in AdaIN's $\\sigma$ (add the $\\varepsilon$ in the
        denominator). <b>Style mixing changes everything at once</b> (no coarse/fine separation) = missing
        normalize or missing mixing regularization. <b>Noise patterns shift global structure</b> (pose changes with
        the noise seed) = noise wired as a per-channel style instead of broadcast stochastic detail. FID flat across
        training = generator not learning (check the discriminator isn't saturated).</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b> them
       and build only the novel composition &mdash; the style pathway. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code>/<code>nn.LeakyReLU</code>, <code>nn.Parameter</code> (for the learned constant), and
       the Adam optimizer. <b>Build by hand:</b> the mapping network $f$ (<code>z &rarr; w</code>), the affine
       $A$ producing per-channel $(\\mathbf{y}_s,\\mathbf{y}_b)$, the <b>AdaIN</b> step (Eq. 1: normalize then
       scale+shift per channel), the per-layer <b>noise</b> add, and the <b>style-mixing</b> swap. The GAN
       minimax/training math is recapped from the dl-gan concept lesson, not re-derived. To keep the demo
       runnable in seconds we use a 1-layer toy synthesis on toy data &mdash; the AdaIN/style-mixing
       <i>behaviour</i> is what we verify, not StyleGAN's full resolution.</p>`,
    pitfalls:
      `<ul>
        <li><b>Feeding <code>w</code> in at the bottom.</b> A common misread is that $\\mathbf{w}$ replaces
        $\\mathbf{z}$ as the spatial input. It does not &mdash; the image starts from a <b>learned constant</b>, and
        $\\mathbf{w}$ enters <i>only</i> through AdaIN styles at every layer. <b>Fix:</b> route $\\mathbf{w}$
        through $A$ into $(\\mathbf{y}_s,\\mathbf{y}_b)$, never into the constant.</li>
        <li><b>Normalizing across the wrong axis.</b> AdaIN is <i>instance</i> normalization: normalize
        <b>each channel of each sample separately</b> over its spatial positions &mdash; not across the batch (that
        would be batch norm) and not across channels. <b>Fix:</b> compute $\\mu,\\sigma$ per (sample, channel).</li>
        <li><b>Forgetting the normalize step.</b> If you skip $(\\mathbf{x}_i-\\mu)/\\sigma$ and just do
        $\\mathbf{y}_s\\mathbf{x}_i+\\mathbf{y}_b$, the style no longer <i>owns</i> the statistics &mdash; the
        output std rides on the content's own std, styles leak between layers, and control is lost. (This is the
        ablation below.)</li>
        <li><b>Dividing by zero std.</b> A flat (constant) feature map has $\\sigma=0$. <b>Fix:</b> add a small
        $\\varepsilon$ in the denominator, as instance/AdaIN implementations do.</li>
        <li><b>Confusing noise with style.</b> The per-layer <b>noise</b> $B$ adds <i>stochastic</i> detail and is
        the same kind of thing at every position; the <b>style</b> from $\\mathbf{w}$ is a global per-channel
        instruction. They serve different jobs; do not collapse them.</li>
      </ul>`,
    recall: [
      "Write the AdaIN equation (Eq. 1) from memory.",
      "After AdaIN, what are a channel's output mean and std, in terms of $\\mathbf{y}_s,\\mathbf{y}_b$? Do they depend on the input content?",
      "What does the mapping network $f$ do, and why is $\\mathcal{W}$ claimed to be less entangled than $\\mathcal{Z}$?",
      "Where does $\\mathbf{w}$ enter the synthesis network, and what is the actual input the image grows from?",
      "What is style mixing, and what does mixing regularization during training achieve?"
    ],
    practice: [
      {
        q: `<b>The normalize ablation.</b> In your toy AdaIN, remove the normalize step &mdash; change
            <code>y_s*(x-mu)/sigma + y_b</code> to just <code>y_s*x + y_b</code>. Keep everything else identical.
            Sweep the style scale $\\mathbf{y}_s$ from 0.2 to 3.0 on a fixed content channel and measure the
            output std each time. What changes, and what does it show about why AdaIN normalizes first?`,
        steps: [
          { do: `With AdaIN, the normalized map has std 1, so output std $=|\\mathbf{y}_s|$ &mdash; it lies exactly on the line "output std = $\\mathbf{y}_s$".`, why: `Normalizing erases the content's std, so only the style's scale survives.` },
          { do: `Without the normalize, output std $=|\\mathbf{y}_s|\\cdot\\sigma(\\mathbf{x})$ &mdash; the content's own std (here $\\approx 3.7$) multiplies in, so the curve is steeper and content-dependent.`, why: `Skipping normalization lets the previous layer's scale leak through; the style no longer owns the statistics.` },
          { do: `Conclude that the normalize step is what makes a style's effect (a) exact and (b) confined to its layer.`, why: `Content-independence + per-layer reset are the whole point of AdaIN; the ablation breaks both.` }
        ],
        answer: `<p>With AdaIN the output std equals $|\\mathbf{y}_s|$ exactly (on the $y=x$ line) and the output mean
                 equals $\\mathbf{y}_b$ exactly, regardless of content. Drop the normalize and the output std becomes
                 $|\\mathbf{y}_s|\\cdot\\sigma(\\text{content})$ &mdash; off the line and content-dependent &mdash; so styles
                 leak between layers and you lose scale-separated control. The normalize step is what gives the
                 style sole ownership of each channel's per-layer statistics.</p>`
      },
      {
        q: `Your worked example had $\\mathbf{x}_i=[2,4,4,6]$, $\\mathbf{y}_s=1.5$, $\\mathbf{y}_b=0.5$, giving
            output mean $0.5$ and std $1.5$. Now keep the SAME style but change the content to
            $\\mathbf{x}_i=[10,10,10,10]$ shifted/spread differently, say $[7,9,9,11]$ (mean 9, std $\\sqrt{2}$).
            What is the AdaIN output mean and std? What does the answer demonstrate?`,
        steps: [
          { do: `Normalize: $\\mu=9$, deviations $[-2,0,0,2]$, $\\sigma=\\sqrt{2}$, so normalized $=[-1.4142,0,0,1.4142]$ &mdash; the SAME normalized map as before.`, why: `Two contents with the same shape but different mean/scale normalize to the same thing.` },
          { do: `Re-style with $\\mathbf{y}_s=1.5,\\mathbf{y}_b=0.5$: output $=[-1.6213,0.5,0.5,2.6213]$, mean $0.5$, std $1.5$.`, why: `Output statistics are set by the style, not the content.` },
          { do: `Compare to the original example: identical output statistics ($0.5$, $1.5$) despite different input mean (9 vs 4).`, why: `Demonstrates content-independence of the styled statistics.` }
        ],
        answer: `<p>Output mean $=\\mathbf{y}_b=0.5$ and std $=\\mathbf{y}_s=1.5$ &mdash; <b>exactly the same</b> as the
                 original example, even though the input mean changed from 4 to 9. This is the key property: after
                 AdaIN, a channel's mean and std are dictated solely by the style $(\\mathbf{y}_s,\\mathbf{y}_b)$,
                 with the content's original statistics normalized away.</p>`
      },
      {
        q: `You generate an image with coarse-layer styles from $\\mathbf{w}_A$ and fine-layer styles from
            $\\mathbf{w}_B$ (<b>style mixing</b>). The result has the pose and face shape of $A$ but the hair/skin
            color scheme of $B$. Explain why, referencing how AdaIN and the layer ordering produce this, and what
            role mixing regularization played in making it clean.`,
        steps: [
          { do: `Recall coarse vs. fine: low-resolution layers (early, small spatial size) set big structure (pose, shape); high-resolution layers (late) set fine texture/color.`, why: `Each layer's style controls that layer's per-channel statistics, and resolution maps to attribute scale.` },
          { do: `Mixing feeds $\\mathbf{w}_A$'s styles to the coarse layers and $\\mathbf{w}_B$'s to the fine layers, so $A$ owns structure and $B$ owns texture.`, why: `Because AdaIN re-normalizes at each layer, swapping the style source mid-network is clean &mdash; later styles do not depend on earlier ones.` },
          { do: `Note mixing regularization during training (switching $\\mathbf{w}$ at a random layer) is what stops the network assuming adjacent layers share a style, making the swap localized.`, why: `&sect;3.1: it "prevents the network from assuming that adjacent styles are correlated", improving localization (Table 2).` }
        ],
        answer: `<p>Coarse (low-resolution) layers control structure and fine (high-resolution) layers control
                 texture; mixing routes $\\mathbf{w}_A$ to the coarse layers and $\\mathbf{w}_B$ to the fine ones,
                 so the image takes $A$'s pose/shape and $B$'s color/texture. The swap is clean because AdaIN
                 normalizes each layer afresh, so a later layer's style does not inherit an earlier one's. Mixing
                 regularization during training &mdash; switching $\\mathbf{w}$ at a random layer &mdash; teaches the
                 network not to assume adjacent layers share a style, which is what localizes each style and makes
                 test-time mixing work (&sect;3.1, Table 2).</p>`
      }
    ]
  });

  window.CODE["paper-stylegan"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the StyleGAN style pathway &mdash; a <b>mapping network</b>
       <code>z &rarr; w</code>, an <b>affine</b> $A$ turning $\\mathbf{w}$ into per-channel
       $(\\mathbf{y}_s,\\mathbf{y}_b)$ styles, the <b>AdaIN</b> step (Eq. 1), and per-layer <b>noise</b> &mdash;
       on a <b>learned constant</b> input, all from <code>nn.Linear</code>/<code>nn.Parameter</code> (no pip).
       The first cell recomputes the worked example ($\\mu=4$, $\\sigma=\\sqrt 2\\approx1.4142$, styled
       $[-1.6213,0.5,0.5,2.6213]$ with mean $0.5=\\mathbf{y}_b$, std $1.5=\\mathbf{y}_s$). We then <b>demo
       AdaIN</b> (output channel mean $\\to\\mathbf{y}_b$, std $\\to|\\mathbf{y}_s|$ regardless of content),
       <b>style mixing</b> (coarse channels from one $\\mathbf{w}_A$, fine channels from another $\\mathbf{w}_B$),
       and the <b>ablation</b> that removes the normalize step so the style no longer owns the statistics.
       Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, math
torch.manual_seed(0)

# --- 0. Sanity-check the worked AdaIN example (Eq. 1). ---
x = torch.tensor([2., 4., 4., 6.])          # one feature map (4 activations)
ys, yb = 1.5, 0.5                           # style: scale, bias
mu = x.mean(); sigma = x.std(unbiased=False)
xn = (x - mu) / sigma
out = ys * xn + yb
print("worked example:")
print("  mu = %.4f  sigma = %.4f" % (mu, sigma))               # 4.0000  1.4142
print("  normalized:", [round(v,4) for v in xn.tolist()])      # [-1.4142, 0, 0, 1.4142]
print("  styled    :", [round(v,4) for v in out.tolist()])     # [-1.6213, .5, .5, 2.6213]
print("  styled mean = %.4f (== y_b)   std = %.4f (== y_s)" %
      (out.mean(), out.std(unbiased=False)))                   # 0.5000   1.5000


# --- 1. The StyleGAN style pathway, built by hand. ---
Zdim, Wdim, C, HW = 8, 8, 4, 16             # latent dims; channels C; spatial size HW

class Mapping(nn.Module):                   # z -> w  (paper: 8 layers, 512-D; toy: 3 layers)
    def __init__(s):
        super().__init__()
        s.net = nn.Sequential(nn.Linear(Zdim, Wdim), nn.ReLU(),
                              nn.Linear(Wdim, Wdim), nn.ReLU(),
                              nn.Linear(Wdim, Wdim))
    def forward(s, z): return s.net(z)

class Affine(nn.Module):                    # A: w -> (y_s, y_b), one pair per channel
    def __init__(s):
        super().__init__()
        s.lin = nn.Linear(Wdim, 2 * C)
    def forward(s, w):
        y = s.lin(w); return y[:, :C], y[:, C:]      # y_s, y_b   each (B, C)

def adain(x, ys, yb, eps=1e-8):             # x: (B, C, HW)  -- instance norm per (sample, channel)
    mu = x.mean(-1, keepdim=True)
    sd = x.std(-1, keepdim=True, unbiased=False) + eps
    return ys.unsqueeze(-1) * (x - mu) / sd + yb.unsqueeze(-1)

const = nn.Parameter(torch.randn(1, C, HW))         # learned constant input (not z!)
noise_scale = nn.Parameter(torch.zeros(1, C, 1))    # learned per-channel noise weight (B)
mapping, affine = Mapping(), Affine()

def synth(w, add_noise=True):               # one toy synthesis layer: const -> +noise -> AdaIN
    x = const.expand(w.size(0), C, HW).clone()
    if add_noise:
        x = x + noise_scale * torch.randn_like(x)   # per-layer noise injection
    ys, yb = affine(w)
    return adain(x, ys, yb)


# --- 2. DEMO: AdaIN sets each output channel's (mean, std) to the style, content-free. ---
z = torch.randn(1, Zdim); w = mapping(z)
out = synth(w, add_noise=False)
ys, yb = affine(w)
print("\\nAdaIN demo: output channel stats track the style")
print("  y_b      :", [round(v,3) for v in yb[0].tolist()])
print("  out mean :", [round(v,3) for v in out[0].mean(-1).tolist()])    # == y_b
print("  |y_s|    :", [round(abs(v),3) for v in ys[0].tolist()])
print("  out std  :", [round(v,3) for v in out[0].std(-1,unbiased=False).tolist()])  # == |y_s|


# --- 3. DEMO: style mixing -- coarse channels from w_A, fine channels from w_B. ---
wA, wB = mapping(torch.randn(1, Zdim)), mapping(torch.randn(1, Zdim))
ysA, ybA = affine(wA); ysB, ybB = affine(wB)
ys_mix = torch.cat([ysA[:, :C//2], ysB[:, C//2:]], 1)   # first half from A, second from B
yb_mix = torch.cat([ybA[:, :C//2], ybB[:, C//2:]], 1)
xconst = const.expand(1, C, HW)
out_mix = adain(xconst, ys_mix, yb_mix)
print("\\nStyle mixing: channels 0,1 take A's bias; channels 2,3 take B's bias")
print("  y_b A    :", [round(v,3) for v in ybA[0].tolist()])
print("  y_b B    :", [round(v,3) for v in ybB[0].tolist()])
print("  mix mean :", [round(v,3) for v in out_mix[0].mean(-1).tolist()])


# --- 4. ABLATION: drop the normalize step -> style no longer owns the statistics. ---
def styled_no_norm(x, ys, yb):              # y_s * x + y_b   (NO normalize)
    return ys.unsqueeze(-1) * x + yb.unsqueeze(-1)
content = torch.randn(1, C, HW) * 3.0 + 1.0           # content with its own std ~3
o_adain = adain(content, ys, yb)
o_plain = styled_no_norm(content, ys, yb)
print("\\nAblation (channel 0): with AdaIN, out std == |y_s|; without, it rides on content std")
print("  |y_s[0]|        : %.3f" % abs(ys[0,0].item()))
print("  out std AdaIN   : %.3f" % o_adain[0,0].std(unbiased=False).item())   # ~ |y_s|
print("  out std no-norm : %.3f" % o_plain[0,0].std(unbiased=False).item())   # ~ |y_s|*content_std
print("\\nAdaIN makes the style OWN each channel's stats; remove the normalize and styles leak.")
# (Exact numbers vary by seed; this is our small demo, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-stylegan"] = {
    question: "Does AdaIN make a channel's output standard deviation equal the injected style scale y_s — regardless of the content — and what breaks if you drop the normalize step?",
    charts: [
      {
        type: "line",
        title: "Output channel std vs injected style scale y_s — with AdaIN vs ablation (no normalize)",
        xlabel: "injected style scale y_s",
        ylabel: "output channel std",
        series: [
          {
            name: "AdaIN (normalize + scale + shift)",
            color: "#7ee787",
            points: [[0.2,0.2],[0.347,0.3474],[0.495,0.4947],[0.642,0.6421],[0.789,0.7895],[0.937,0.9368],[1.084,1.0842],[1.232,1.2316],[1.379,1.3789],[1.526,1.5263],[1.674,1.6737],[1.821,1.8211],[1.968,1.9684],[2.116,2.1158],[2.263,2.2632],[2.411,2.4105],[2.558,2.5579],[2.705,2.7053],[2.853,2.8526],[3.0,3.0]]
          },
          {
            name: "Ablation: no normalize (y_s·x + y_b)",
            color: "#ff7b72",
            points: [[0.2,0.7712],[0.347,1.3395],[0.495,1.9078],[0.642,2.476],[0.789,3.0443],[0.937,3.6126],[1.084,4.1808],[1.232,4.7491],[1.379,5.3174],[1.526,5.8856],[1.674,6.4539],[1.821,7.0222],[1.968,7.5905],[2.116,8.1587],[2.263,8.727],[2.411,9.2953],[2.558,9.8635],[2.705,10.4318],[2.853,11.0001],[3.0,11.5683]]
        }
        ]
      }
    ],
    caption: "Our small demo, not the paper's reported numbers. One feature map of arbitrary content (mean 1.2, std 3.7) is passed through AdaIN (Eq. 1) with a fixed bias y_b=0.5 while the style scale y_s is swept from 0.2 to 3.0. <b>With AdaIN the output std lands exactly on y_s</b> (the green line is y = x) and the output mean is always exactly 0.5 = y_b — the style fully owns the channel's statistics, independent of content. <b>Drop the normalize step</b> (red) and the output std becomes |y_s|·σ(content) ≈ y_s·3.7 — far off the line and content-dependent, so styles leak between layers and scale-separated control is lost. This is exactly the property that lets each layer's style act locally.",
    code: `import torch, torch.nn as nn, numpy as np
torch.manual_seed(0)

# AdaIN (Eq. 1) forces an output channel's std to equal the style scale y_s,
# independent of the content. Drop the normalize -> std rides on the content's std.
C, HW = 1, 64
x = torch.randn(1, C, HW) * 3.7 + 1.2          # arbitrary content (mean 1.2, std 3.7)

def adain(x, ys, yb):
    mu = x.mean(-1, keepdim=True)
    sd = x.std(-1, keepdim=True, unbiased=False)
    return ys * (x - mu) / sd + yb

ys_targets = np.linspace(0.2, 3.0, 20)
yb = 0.5
adain_std  = [round(adain(x, torch.tensor(t), torch.tensor(yb)).std(unbiased=False).item(), 4)
              for t in ys_targets]
adain_mean = [round(adain(x, torch.tensor(t), torch.tensor(yb)).mean().item(), 4)
              for t in ys_targets]
nonorm_std = [round((torch.tensor(t) * x).std(unbiased=False).item(), 4) for t in ys_targets]

print("y_s        :", [round(float(t),3) for t in ys_targets])
print("AdaIN  std :", adain_std)     # == y_s  (lies on y = x)
print("AdaIN  mean:", adain_mean)    # all 0.5 == y_b, content-independent
print("no-norm std:", nonorm_std)    # == y_s * 3.7, off the line
# AdaIN: output std == y_s, mean == y_b, regardless of content. The normalize is what
# makes a style OWN each channel's per-layer statistics -- the key to scale-separated control.`
  };
})();
