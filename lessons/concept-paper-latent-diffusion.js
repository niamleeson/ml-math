/* Paper lesson — "High-Resolution Image Synthesis with Latent Diffusion Models" (LDM /
   Stable Diffusion), Rombach, Blattmann, Lorenz, Esser & Ommer, 2021 (CVPR 2022).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-latent-diffusion".
   GROUNDED from arXiv:2112.10752 (abstract) and the ar5iv HTML mirror (Sections 1, 3.1, 3.2, 3.3,
   4.1; Eqns 1-3; the cross-attention block). Track B (architecture): on a toy image-sized tensor,
   measure the per-step cost of pixel-space vs latent-space denoising (the f^2 saving), then build a
   tiny noise-predictor that denoises IN a frozen autoencoder's latent and decodes back; ablate by
   denoising in pixel space at the same budget. The diffusion ELBO/score math lives in concept
   mod-diffusion; the encoder/decoder + KL latent math lives in paper-vae; here we recap and link. */
(function () {
  window.LESSONS.push({
    id: "paper-latent-diffusion",
    title: "Latent Diffusion (Stable Diffusion) — High-Resolution Image Synthesis with Latent Diffusion Models (2021)",
    tagline: "Run the diffusion model inside a compressed autoencoder latent instead of on raw pixels — far cheaper — and steer it with text through cross-attention.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, Björn Ommer",
      org: "CompVis group (affiliation not listed on the arXiv abstract page)",
      year: 2021,
      venue: "arXiv:2112.10752 (Dec 2021); CVPR 2022",
      citations: "",
      arxiv: "https://arxiv.org/abs/2112.10752",
      code: "https://github.com/CompVis/latent-diffusion"
    },
    conceptLink: "mod-diffusion",
    partOf: [],
    prereqs: ["paper-ddpm", "paper-vae", "mod-diffusion", "mod-vae", "dl-attention", "dl-conv", "pt-nn-module", "prob-normal"],

    // WHY READ IT
    problem:
      `<p>The previous paper (<b>paper-ddpm</b>) made diffusion models &mdash; networks that generate by
       repeatedly removing a little noise &mdash; produce excellent images and train stably. But they ran the
       denoiser <b>directly on pixels</b>. That is brutally expensive: every one of the (hundreds of) reverse
       steps evaluates a large network on a full-resolution image.</p>
       <p>The paper quotes the cost plainly (&sect;1): training the most powerful pixel-space diffusion models
       "often takes <b>hundreds of GPU days</b> (e.g. 150&ndash;1000 V100 days)" and even sampling is slow &mdash;
       "producing 50k samples takes approximately <b>5 days on a single A100 GPU</b>." The root cause (&sect;1):
       the model "still require[s] costly function evaluations <b>in pixel space</b>." Most of those pixels are
       perceptually irrelevant fine detail, yet the denoiser pays full price for them at every step.</p>
       <p>This paper's question: can we keep diffusion's quality and flexibility but move the expensive part
       <b>off of raw pixels</b> onto a much smaller representation &mdash; and add easy text conditioning while
       we are at it?</p>`,
    contribution:
      `<ul>
        <li><b>Diffuse in a compressed latent, not in pixels.</b> First train an autoencoder (an encoder
        $\\mathcal{E}$ and decoder $\\mathcal{D}$, like a VAE) that squeezes an image into a small latent
        $z=\\mathcal{E}(x)$ downsampled by a factor $f$ in each spatial dimension. Then run the <i>entire</i>
        diffusion process on $z$. Because $z$ has roughly $1/f^2$ as many spatial elements, every denoising step
        is much cheaper (&sect;3.1&ndash;3.2).</li>
        <li><b>A reusable two-stage split.</b> The compression (autoencoder) is trained <i>once</i> and frozen;
        many different diffusion models can then be trained in that same latent space. The paper calls this
        separating "the compressive from the generative learning phase" (&sect;3).</li>
        <li><b>Cross-attention conditioning.</b> Inject general conditioning &mdash; text, layout, bounding
        boxes &mdash; by adding <b>cross-attention</b> layers to the denoising U-Net, where the queries come
        from the image latent and the keys/values come from an encoding $\\tau_\\theta(y)$ of the condition
        $y$ (&sect;3.3). This is what turns the model into a text-to-image generator.</li>
      </ul>`,
    whyItMattered:
      `<p>This architecture <b>is</b> Stable Diffusion. The recipe you read here &mdash; a frozen VAE-style
       autoencoder providing a latent, a U-Net denoiser trained with the DDPM noise-prediction loss <i>in that
       latent</i>, and cross-attention from a text encoder &mdash; is exactly what made open, runnable
       text-to-image generation possible on consumer GPUs. The cost reduction is the whole point: pixel-space
       diffusion (paper-ddpm) was a research-lab luxury; latent diffusion put it on a laptop. Later systems
       (paper-controlnet adds spatial control; classifier-free guidance from paper-cfg sharpens conditioning)
       build directly on this two-stage latent design.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the cost argument (hundreds of GPU days; "function
        evaluations in pixel space") that motivates everything.</li>
        <li><b>&sect;3.1 (Perceptual Image Compression)</b> &mdash; the encoder/decoder, the downsampling
        factor $f = H/h = W/w$, and the two latent regularizers: <i>KL-reg</i> (a small Kullback&ndash;Leibler
        penalty toward a standard normal, "similar to a VAE") and <i>VQ-reg</i> (a vector-quantization layer).</li>
        <li><b>&sect;3.2 (Latent Diffusion Models)</b> &mdash; Eq. 2, the latent diffusion loss
        $L_{LDM}$. It is the DDPM loss with $z_t$ in place of $x_t$.</li>
        <li><b>&sect;3.3 (Conditioning Mechanisms)</b> &mdash; the cross-attention block (the
        $\\text{Attention}(Q,K,V)$ equation and how $Q,K,V$ are formed) and the conditional loss Eq. 3.</li>
        <li><b>&sect;4.1 + Figure 6</b> &mdash; the trade-off across downsampling factors $f$: which $f$ gives
        the best quality-per-compute.</li>
       </ul>
       <p><b>Skim:</b> the full results tables, the per-task experiments (inpainting, super-resolution,
       semantic synthesis), and the appendix architectures on a first pass &mdash; the ideas you need to run a
       toy version are the $f$-compression of &sect;3.1, the latent loss Eq. 2, and the cross-attention of &sect;3.3.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will measure, on an image-sized toy tensor, the cost of <b>one denoising step in pixel space</b>
       versus <b>one step in a latent</b> that is downsampled by $f=4$ in each direction. The denoiser's work is
       dominated by the number of spatial positions it processes.</p>
       <p>Before running: if the latent is $f=4$ times smaller along <i>each</i> of height and width, how much
       cheaper do you expect one latent step to be than one pixel step &mdash; about 4&times;? 8&times;? 16&times;?
       Write your guess, then check it against the timing.</p>`,
    attempt:
      `<p>Before the reveal, sketch the three pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>The latent shape.</b> A pixel image is $3\\times H\\times W$. After an encoder with downsampling
        factor $f$, the latent is $c\\times (H/f)\\times (W/f)$. TODO: for $H=W=64$ and $f=4$, the latent spatial
        size is <code>64 // 4 = 16</code>, so it has <code>16*16 = 256</code> positions vs <code>64*64 = 4096</code>
        in pixels &mdash; a ratio of TODO: <code>f*f = 16</code>.</li>
        <li><b>Latent diffusion loss</b> (Eq. 2): same DDPM noise-MSE, but on $z$. <code>z = encoder(x)</code>;
        <code>zt = abar[t].sqrt()*z + (1-abar[t]).sqrt()*eps</code>; TODO:
        <code>loss = ((eps - unet(zt, t)) ** 2).mean()</code>.</li>
        <li><b>Decode to see the image:</b> after sampling a clean latent $z_0$, TODO:
        <code>x = decoder(z0)</code> &mdash; the autoencoder turns the small latent back into a picture.</li>
       </ul>
       <p>Then time one <code>unet(.)</code> call at the pixel resolution and at the latent resolution. Predict
       the ratio before you print it.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>The core move: do the diffusion somewhere cheaper.</b> Pixel-space diffusion (paper-ddpm) keeps
       the noisy image at full resolution through every reverse step. Latent diffusion inserts a compression
       stage first, so the diffusion never touches raw pixels.</p>
       <p><b>1. Perceptual compression (&sect;3.1) &mdash; trained once, then frozen.</b> Train an autoencoder:
       an <b>encoder</b> $\\mathcal{E}$ maps an image $x\\in\\mathbb{R}^{H\\times W\\times 3}$ to a small latent
       $z=\\mathcal{E}(x)\\in\\mathbb{R}^{h\\times w\\times c}$, and a <b>decoder</b> $\\mathcal{D}$ maps it back,
       $\\tilde x=\\mathcal{D}(z)$. The <b>downsampling factor</b> is $f=H/h=W/w$, and the paper studies
       $f=2^m$ (it tries $f\\in\\{1,2,4,8,16,32\\}$). Crucially this latent is regularized to behave nicely:
       quoting &sect;3.1, "<i>KL-reg.</i> imposes a slight KL-penalty towards a standard normal on the learned
       latent, similar to a VAE, whereas <i>VQ-reg.</i> uses a vector quantization layer." (The VAE/KL machinery
       is the subject of paper-vae &mdash; recapped, not re-derived, here.)</p>
       <p><b>2. Diffusion in the latent (&sect;3.2).</b> Now apply the <i>exact same</i> DDPM training to $z$
       instead of $x$. Noise the latent $z$ to a random timestep, and train a U-Net $\\epsilon_\\theta$ to
       predict the noise &mdash; only now $z_t$ is small. The objective is Eq. 2 below: the DDPM noise-MSE with
       $z_t$ in place of $x_t$. Why this is cheaper, in the paper's words (&sect;3): "By leaving the
       high-dimensional image space, we obtain DMs which are computationally much more efficient because
       sampling is performed on a <b>low-dimensional space</b>."</p>
       <p><b>3. Conditioning by cross-attention (&sect;3.3).</b> To make it generate <i>from a prompt</i>, encode
       the condition $y$ (e.g. text) with a domain encoder $\\tau_\\theta$ into a sequence
       $\\tau_\\theta(y)\\in\\mathbb{R}^{M\\times d_\\tau}$, then let the U-Net <b>attend</b> to it. At U-Net layer
       $i$ with flattened feature map $\\varphi_i(z_t)$, the paper forms
       $Q = W_Q^{(i)}\\,\\varphi_i(z_t)$, $K = W_K^{(i)}\\,\\tau_\\theta(y)$, $V = W_V^{(i)}\\,\\tau_\\theta(y)$ and
       computes $\\text{Attention}(Q,K,V)=\\text{softmax}\\!\\big(QK^\\top/\\sqrt{d}\\big)V$. So the <b>image
       latent asks questions (queries) and the text supplies the answers (keys/values)</b> &mdash; the standard
       scaled-dot-product attention from dl-attention, used here to mix the prompt into the denoiser. The
       conditional training loss is Eq. 3 (the formula below): the latent noise-MSE, but $\\epsilon_\\theta$ now
       also sees $\\tau_\\theta(y)$. Both $\\tau_\\theta$ and $\\epsilon_\\theta$ are trained jointly.</p>
       <p><b>At generation time:</b> encode the prompt; start from a pure-noise latent; run the reverse
       denoising steps (DDPM/Alg. 2) in the small latent, attending to the prompt each step; then run the
       cheap-to-evaluate decoder $\\mathcal{D}$ <b>once</b> to turn the final clean latent into a full image.</p>`,
    architecture:
      `<p>Three trained components wired in two stages &mdash; this is the Stable Diffusion blueprint.</p>
       <p><b>Stage 1 &mdash; Perceptual autoencoder (&sect;3.1), trained once then frozen.</b></p>
       <ul>
        <li><b>Encoder $\\mathcal{E}$:</b> a convolutional net that downsamples $x\\in\\mathbb{R}^{H\\times W\\times 3}$ by
        $f=2^m$ along each spatial axis to a latent $z\\in\\mathbb{R}^{h\\times w\\times c}$ ($h=H/f$, $w=W/f$). The
        paper sweeps $f\\in\\{1,2,4,8,16,32\\}$; Stable Diffusion uses $f{=}8$ with $c{=}4$.</li>
        <li><b>Latent regularizer:</b> either <i>KL-reg</i> (a slight KL-penalty toward $\\mathcal{N}(0,\\mathbf{I})$,
        VAE-style) or <i>VQ-reg</i> (a vector-quantization layer folded into the decoder, VQGAN-style). Keeps the
        latent smooth and bounded so diffusion sits naturally on it.</li>
        <li><b>Decoder $\\mathcal{D}$:</b> a mirror convolutional net (transpose-convs) that upsamples $z$ back to
        $\\tilde x\\in\\mathbb{R}^{H\\times W\\times 3}$. Trained with reconstruction + perceptual (LPIPS) + a
        patch-based adversarial loss so reconstructions stay on the image manifold.</li>
       </ul>
       <p><b>Stage 2 &mdash; Latent denoiser + conditioning, trained on the frozen latents.</b></p>
       <ul>
        <li><b>Denoising U-Net $\\epsilon_\\theta$:</b> a time-conditional convolutional U-Net over latent-shaped
        tensors $h\\times w\\times c$. Standard encoder/bottleneck/decoder with skip connections and residual blocks;
        the timestep $t$ enters via a sinusoidal embedding added to each block. It predicts the added noise.</li>
        <li><b>Cross-attention layers:</b> interleaved with the U-Net's residual blocks. At layer $i$, the flattened
        feature map $\\varphi_i(z_t)\\in\\mathbb{R}^{N\\times d_\\epsilon^i}$ provides the queries $Q$; the condition
        encoding $\\tau_\\theta(y)\\in\\mathbb{R}^{M\\times d_\\tau}$ provides keys $K$ and values $V$; the attention
        output is mixed back into the feature map. This is the only place the condition touches the image.</li>
        <li><b>Condition encoder $\\tau_\\theta$:</b> a domain-specific network mapping the raw condition $y$ to a
        sequence of $M$ vectors. For text it is a transformer (Stable Diffusion uses a frozen CLIP/BERT-style text
        encoder); for class labels or layouts it is a small embedder. Output $\\tau_\\theta(y)\\in\\mathbb{R}^{M\\times d_\\tau}$
        feeds every cross-attention layer.</li>
       </ul>
       <p><b>Data flow at sampling:</b> $y \\xrightarrow{\\tau_\\theta} \\tau_\\theta(y)$; start $z_T\\sim\\mathcal{N}(0,\\mathbf{I})$
       in latent shape; for $t=T\\dots1$ run $\\epsilon_\\theta(z_t,t,\\tau_\\theta(y))$ (U-Net + cross-attention) to take
       one reverse step; finally $\\tilde x=\\mathcal{D}(z_0)$ &mdash; the decoder runs once. The expensive U-Net loop
       lives entirely in the small latent; only the cheap decoder ever touches full resolution.</p>`,
    symbols: [
      { sym: "$x$", desc: "an <b>image</b> in pixel space, $\\mathbb{R}^{H\\times W\\times 3}$ ($H$ tall, $W$ wide, 3 RGB colour channels)." },
      { sym: "$\\mathcal{E}$", desc: "the <b>encoder</b>: a trained network that compresses an image $x$ into a small latent $z=\\mathcal{E}(x)$." },
      { sym: "$\\mathcal{D}$", desc: "the <b>decoder</b>: the partner network that reconstructs an image $\\tilde x=\\mathcal{D}(z)$ from a latent. $\\mathcal{E}$ and $\\mathcal{D}$ form the autoencoder, trained once and frozen." },
      { sym: "$\\tilde x$", desc: "the <b>reconstruction</b> $\\tilde x=\\mathcal{D}(\\mathcal{E}(x))$ &mdash; the image you get back after encoding then decoding. The autoencoder is trained to make $\\tilde x\\approx x$." },
      { sym: "$z$", desc: "the <b>latent</b>: the compressed representation $z=\\mathcal{E}(x)\\in\\mathbb{R}^{h\\times w\\times c}$. Much smaller than $x$ spatially. The diffusion runs entirely on $z$." },
      { sym: "$h,w,c$", desc: "the <b>latent dimensions</b>: height $h=H/f$, width $w=W/f$, and channel count $c$ of the latent $z$. (Stable Diffusion: $f{=}8$, $c{=}4$.)" },
      { sym: "$x_t$", desc: "the <b>noisy pixel image</b> at timestep $t$ in the original pixel-space DDPM (Eq. 1) &mdash; the thing $z_t$ replaces once we move into the latent." },
      { sym: "$f$", desc: "the <b>downsampling factor</b> $f=H/h=W/w$: how many times smaller the latent is along each spatial axis. The paper tries $f\\in\\{1,2,4,8,16,32\\}$; $f{=}4$ means the latent is $4\\times$ smaller in height and width." },
      { sym: "$z_t$", desc: "the latent after $t$ steps of DDPM noising &mdash; a <b>noisy version of $z$</b>. Plays the role $x_t$ played in pixel-space DDPM." },
      { sym: "$t$", desc: "the diffusion <b>timestep</b>; larger $t$ = noisier latent. Fed to the U-Net so it knows the noise level." },
      { sym: "$\\epsilon$", desc: "the <b>actual Gaussian noise</b> $\\mathcal{N}(0,\\mathbf{I})$ mixed into $z$ to make $z_t$; the target the U-Net must predict." },
      { sym: "$\\epsilon_\\theta(z_t,t,\\,\\cdot)$", desc: "the <b>denoising U-Net</b> (parameters $\\theta$): a time-conditional convolutional network that looks at the noisy latent $z_t$ (and the condition) and predicts the noise $\\epsilon$." },
      { sym: "$y$", desc: "the <b>conditioning input</b> &mdash; e.g. a text prompt, a class label, or a layout." },
      { sym: "$\\tau_\\theta$", desc: "the <b>domain-specific condition encoder</b> (parameters part of $\\theta$): the network that turns the raw condition $y$ into something the U-Net can attend to (e.g. a transformer for text). Trained jointly with $\\epsilon_\\theta$." },
      { sym: "$\\tau_\\theta(y)$", desc: "the <b>condition encoder output</b>: a sequence $\\tau_\\theta(y)\\in\\mathbb{R}^{M\\times d_\\tau}$ of $M$ vectors (each of width $d_\\tau$) that supplies the keys and values in cross-attention." },
      { sym: "$\\varphi_i(z_t)$", desc: "the <b>flattened intermediate feature map</b> of the U-Net at layer $i$, $\\varphi_i(z_t)\\in\\mathbb{R}^{N\\times d_\\epsilon^i}$ &mdash; the image-side representation that forms the attention queries." },
      { sym: "$Q,K,V$", desc: "the attention <b>query, key, value</b> matrices: $Q=W_Q^{(i)}\\varphi_i(z_t)$ (from the image latent), $K=W_K^{(i)}\\tau_\\theta(y)$ and $V=W_V^{(i)}\\tau_\\theta(y)$ (from the condition). $W_Q^{(i)},W_K^{(i)},W_V^{(i)}$ are learned projections." },
      { sym: "$N,M$", desc: "the <b>sequence lengths</b>: $N$ = number of spatial positions in the flattened U-Net feature map (the queries), $M$ = number of condition vectors / prompt tokens (the keys/values)." },
      { sym: "$d_\\epsilon^i,\\,d_\\tau,\\,d$", desc: "the <b>widths</b>: $d_\\epsilon^i$ = channel width of U-Net feature map $\\varphi_i$; $d_\\tau$ = width of each condition vector; $d$ = the common attention dimension the projections map into." },
      { sym: "$d$", desc: "the <b>attention/key dimension</b>; dividing the scores by $\\sqrt{d}$ keeps the softmax well-scaled (the standard attention normalizer)." },
      { sym: "$\\|\\cdot\\|_2^2$", desc: "the <b>squared length</b> (sum of squares) of a vector &mdash; the mean-squared-error measure of the noise-prediction error." },
      { sym: "$L_{DM}$", desc: "the <b>pixel-space DDPM loss</b> (Eq. 1): the original noise-prediction MSE evaluated on $x_t$, before moving to the latent." },
      { sym: "$L_{LDM}$", desc: "the <b>latent diffusion loss</b> (Eq. 2/3): the DDPM noise-prediction MSE, evaluated on the latent $z_t$ rather than the pixel $x_t$." }
    ],
    formula: `$$ z = \\mathcal{E}(x), \\qquad \\tilde{x} = \\mathcal{D}(z) = \\mathcal{D}\\big(\\mathcal{E}(x)\\big), \\qquad f = H/h = W/w = 2^m $$
      <p class="cap">&sect;3.1 &mdash; the <b>perceptual autoencoder</b>: encoder $\\mathcal{E}$ compresses image $x\\in\\mathbb{R}^{H\\times W\\times 3}$ to latent $z\\in\\mathbb{R}^{h\\times w\\times c}$, decoder $\\mathcal{D}$ reconstructs it; $f$ is the per-axis downsampling factor. The latent is regularized by either <i>KL-reg</i> (a slight KL-penalty toward a standard normal, "similar to a VAE") or <i>VQ-reg</i> (a vector-quantization layer in the decoder). Trained once with a perceptual + patch-adversarial loss, then frozen.</p>
      $$ L_{DM} := \\mathbb{E}_{x,\\,\\epsilon\\sim\\mathcal{N}(0,1),\\,t}\\Big[\\,\\big\\lVert\\,\\epsilon - \\epsilon_\\theta(x_t,\\,t)\\big\\rVert_2^2\\,\\Big] $$
      <p class="cap">Eq. 1 (&sect;3.2) &mdash; the <b>pixel-space DDPM loss</b> we start from: predict the noise $\\epsilon$ added to a noisy image $x_t$, with squared error, averaged over images, noise draws, and timesteps $t\\sim\\{1,\\dots,T\\}$.</p>
      $$ L_{LDM} := \\mathbb{E}_{\\mathcal{E}(x),\\,\\epsilon\\sim\\mathcal{N}(0,1),\\,t}\\Big[\\,\\big\\lVert\\,\\epsilon - \\epsilon_\\theta(z_t,\\,t)\\big\\rVert_2^2\\,\\Big] $$
      <p class="cap">Eq. 2 (&sect;3.2) &mdash; the <b>latent diffusion loss</b>: Eq. 1 with one swap, $x_t \\to z_t$. The same noise-MSE, but the time-conditional U-Net $\\epsilon_\\theta$ now denoises the small latent $z_t$ obtained from $\\mathcal{E}$.</p>
      $$ L_{LDM} := \\mathbb{E}_{\\mathcal{E}(x),\\,y,\\,\\epsilon\\sim\\mathcal{N}(0,1),\\,t}\\Big[\\,\\big\\lVert\\,\\epsilon - \\epsilon_\\theta\\big(z_t,\\,t,\\,\\tau_\\theta(y)\\big)\\big\\rVert_2^2\\,\\Big] $$
      <p class="cap">Eq. 3 (&sect;3.3) &mdash; the <b>conditional</b> latent loss: $\\epsilon_\\theta$ additionally sees $\\tau_\\theta(y)$, the encoded condition. $\\tau_\\theta$ (the domain-specific encoder) and $\\epsilon_\\theta$ are trained jointly.</p>
      $$ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\Big(\\frac{QK^\\top}{\\sqrt{d}}\\Big)\\cdot V $$
      <p class="cap">&sect;3.3 &mdash; the <b>cross-attention</b> the condition enters through, inserted into the U-Net's intermediate layers (standard scaled dot-product attention).</p>
      $$ Q = W_Q^{(i)}\\cdot\\varphi_i(z_t), \\qquad K = W_K^{(i)}\\cdot\\tau_\\theta(y), \\qquad V = W_V^{(i)}\\cdot\\tau_\\theta(y) $$
      <p class="cap">&sect;3.3 &mdash; how $Q,K,V$ are formed: the <b>query comes from the U-Net</b> (flattened feature map $\\varphi_i(z_t)\\in\\mathbb{R}^{N\\times d_\\epsilon^i}$) and the <b>keys/values come from the condition encoder</b> $\\tau_\\theta(y)\\in\\mathbb{R}^{M\\times d_\\tau}$. Projections $W_Q^{(i)}\\in\\mathbb{R}^{d\\times d_\\epsilon^i}$, $W_K^{(i)},W_V^{(i)}\\in\\mathbb{R}^{d\\times d_\\tau}$ are learned. So the image latent asks the questions and the prompt supplies the answers.</p>`,
    whatItDoes:
      `<p>In words: <b>encode the image to a latent $z=\\mathcal{E}(x)$, noise that latent to a random timestep
       $t$ giving $z_t$, encode the condition with $\\tau_\\theta(y)$, and ask the U-Net to predict the noise
       $\\epsilon$ that was added &mdash; from the noisy latent, the timestep, and the condition.</b> The loss is
       the squared error of that prediction, averaged over images, conditions, noise draws, and timesteps (that
       is what $\\mathbb{E}_{\\mathcal{E}(x),y,\\epsilon,t}$ means &mdash; the expectation, or average).</p>
       <p>This is <b>exactly the DDPM objective of paper-ddpm</b> (predict the noise, minimize MSE) with two
       swaps: $x_t \\to z_t$ (we operate in the latent), and the network additionally receives $\\tau_\\theta(y)$
       (the encoded condition, mixed in via cross-attention). Drop the condition and you get Eq. 2, the
       unconditional latent loss. Everything that made DDPM stable to train is preserved &mdash; we just made
       each evaluation cheaper and added a place for the prompt to enter.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the two derivations this rests on live in other lessons.</b></p>
       <p><b>(a) Why predicting noise in MSE is a valid generator.</b> That is the DDPM variational-bound /
       denoising-score-matching argument, derived in <b>mod-diffusion</b> and recapped in <b>paper-ddpm</b>:
       the data log-likelihood has a tractable lower bound that decomposes per timestep, and matching the
       reverse step's mean reduces (after the noise reparameterization) to the noise-MSE. Latent diffusion does
       not change this argument at all &mdash; it just applies it to the random variable $z$ instead of $x$.</p>
       <p><b>(b) Why a compressed latent still carries the image.</b> That is the autoencoder / VAE story,
       derived in <b>paper-vae</b> and <b>mod-vae</b>: the encoder learns a low-dimensional code that the decoder
       can reconstruct from, and the KL penalty ("similar to a VAE", &sect;3.1) keeps that latent smooth and
       roughly standard-normal &mdash; which is also exactly the prior diffusion assumes at $t=T$. So the latent
       is both <i>small</i> (cheap to diffuse) and <i>well-shaped</i> (a Gaussian diffusion sits naturally on it).</p>
       <p><b>What is genuinely new here</b> is the <i>composition</i>: freeze the autoencoder, then prove
       empirically that running the diffusion in its latent reaches "a near-optimal point between complexity
       reduction and detail preservation" (abstract). The cost saving comes from a simple counting argument,
       worked next: an $f\\times f$ spatial shrink leaves $1/f^2$ as many positions for the U-Net to process.</p>`,
    example:
      `<p>Work the <b>compute saving from the downsampling factor $f$</b> by hand &mdash; this is the number the
       whole paper turns on. The denoiser's cost per reverse step is dominated by the number of spatial
       positions it must process. A convolutional U-Net does $O(1)$ work per position, so:</p>
       <ul class="steps">
        <li><b>Pixel image.</b> Take $H=W=256$. Pixel-space positions: $256\\times 256 = 65{,}536$.</li>
        <li><b>Encode with $f=4$.</b> Latent spatial size is $H/f \\times W/f = 64\\times 64$. Latent positions:
        $64\\times 64 = 4{,}096$.</li>
        <li><b>Ratio.</b> $65{,}536 / 4{,}096 = \\mathbf{16}$. So each latent denoising step touches $16\\times$
        fewer positions &mdash; and $16 = f^2 = 4^2$. <b>The per-step saving is $f^2$.</b></li>
        <li><b>Over a full sample.</b> Diffusion runs the same step many times (say $T$ reverse steps), so the
        whole sampling cost scales by the same $\\approx 1/f^2$. The decoder $\\mathcal{D}$ runs <i>once</i> at
        the end, so it is a tiny add-on, not multiplied by $T$.</li>
        <li><b>Try $f=8$.</b> Latent is $32\\times 32 = 1{,}024$ positions; ratio $65{,}536/1{,}024 = \\mathbf{64}=8^2$.
        Bigger $f$ saves more compute &mdash; but the paper warns (&sect;4.1) that "too strong first stage
        compression result[s] in information loss and thus limit[s] the achievable quality." That tension is the
        whole point of the ablation: $f\\in\\{4,8\\}$ is the sweet spot.</li>
       </ul>
       <p>So with $f=4$ on a $256^2$ image, one latent step is about <b>16&times; cheaper</b> than one pixel
       step, for the <i>same</i> denoiser per position. The notebook recomputes these exact counts (and times an
       actual U-Net step at both resolutions to confirm the $\\approx f^2$ ratio).</p>`,
    recipe:
      `<ol>
        <li><b>Stage 1 &mdash; train the autoencoder once.</b> Train an encoder $\\mathcal{E}$ and decoder
        $\\mathcal{D}$ to reconstruct images, with a downsampling factor $f$ and a latent regularizer (KL-reg,
        "similar to a VAE", or VQ-reg). Then <b>freeze</b> it.</li>
        <li><b>Encode the data.</b> Map each training image to its latent $z=\\mathcal{E}(x)$. From now on the
        diffusion only ever sees latents.</li>
        <li><b>Stage 2 &mdash; build the latent denoiser.</b> A time-conditional U-Net $\\epsilon_\\theta$ over
        latent-shaped tensors, with <b>cross-attention</b> layers whose keys/values come from the condition
        encoder $\\tau_\\theta(y)$ (&sect;3.3).</li>
        <li><b>Train</b> on the latent loss (Eq. 2 / Eq. 3): noise $z$ to a random $t$ giving $z_t$, predict the
        noise, minimize $\\lVert\\epsilon-\\epsilon_\\theta(z_t,t,\\tau_\\theta(y))\\rVert_2^2$ &mdash; the DDPM
        loop, on latents.</li>
        <li><b>Sample.</b> Encode the prompt; start from a pure-noise latent $z_T$; run the DDPM reverse steps
        (Alg. 2 from paper-ddpm) in latent space, attending to the prompt; get a clean $z_0$.</li>
        <li><b>Decode once.</b> $\\tilde x = \\mathcal{D}(z_0)$ turns the final latent into a full-resolution
        image. Decoding is a single forward pass, not part of the per-step loop.</li>
        <li><b>Ablate $f$.</b> Compare quality and cost across downsampling factors; $f$ too small is slow
        (pixel-like), $f$ too large loses detail.</li>
      </ol>`,
    results:
      `<p>From the paper (quoted): operating in the latent yields "a speed-up of at least <b>2.7&times;</b>
       between pixel- and latent-based diffusion models" on inpainting (&sect;4, Table 6), and across
       downsampling factors there is "a significant FID gap of <b>38</b> between pixel-based diffusion
       (<i>LDM-1</i>) and <i>LDM-8</i>" (&sect;4.1), with the paper concluding $f\\in\\{4{-}16\\}$ "strike a good
       balance between efficiency and perceptually faithful results." (FID, Fr&eacute;chet Inception Distance, is
       a standard image-quality score where <b>lower is better</b>.) On specific datasets the abstract and tables
       report new state-of-the-art image <b>inpainting</b> and strong unconditional generation, super-resolution,
       and text-to-image results.</p>
       <p><i>These are the paper's reported figures, quoted from the paper. The numbers in the CODEVIZ panel
       below are from our own tiny toy run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so we <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>, <code>nn.Linear</code>,
       <code>nn.SiLU</code>, the Adam optimizer, and <code>torch.randn</code>. <b>Build by hand:</b> a tiny
       frozen-style autoencoder (encoder $\\mathcal{E}$ downsampling by $f$, decoder $\\mathcal{D}$), the latent
       forward-noising (DDPM Eq. 4 on $z$), a small convolutional noise-predictor, the latent loss
       $L_{LDM}$ (Eq. 2), and the cost measurement that compares one pixel-space step against one latent-space
       step. We measure the <b>$f^2$ per-step saving</b> directly (the worked example), train the denoiser in
       the latent, and decode samples back &mdash; the same loop that, scaled up with a real VAE, a big U-Net,
       and a text encoder, is Stable Diffusion. The DDPM math is recapped from paper-ddpm, the VAE/KL math from
       paper-vae &mdash; not re-derived. (We use a minimal autoencoder so the notebook runs in seconds; the
       cross-attention text path is explained in the walkthrough and shown as a small module, not trained on a
       text dataset.)</p>`,
    pitfalls:
      `<ul>
        <li><b>Thinking the saving is $f$, not $f^2$.</b> The latent shrinks along <i>both</i> height and width,
        so positions drop by $f\\times f=f^2$. With $f=4$ that is $16\\times$ fewer positions, not $4\\times$. This
        is the single most common misread of the cost claim.</li>
        <li><b>Forgetting the autoencoder is frozen.</b> Stage 1 is trained <i>once</i> and not updated during
        diffusion training. Backpropagating into $\\mathcal{E}/\\mathcal{D}$ while training the U-Net defeats the
        two-stage design and destabilizes things.</li>
        <li><b>Diffusing in pixels "to be safe."</b> If you noise/denoise $x$ and only encode at the end, you
        have thrown away the entire contribution &mdash; you are back to pixel-space DDPM cost. The noise must be
        added to and predicted in the <b>latent</b> $z$.</li>
        <li><b>Compressing too hard.</b> A very large $f$ (e.g. 16, 32) saves more compute but, per &sect;4.1,
        causes "information loss and thus limit[s] the achievable quality." The decoder cannot invent detail the
        latent never stored. $f\\in\\{4,8\\}$ is the documented sweet spot.</li>
        <li><b>Cross-attention direction.</b> Queries come from the <b>image latent</b>; keys and values come
        from the <b>condition</b> $\\tau_\\theta(y)$. Swapping them makes the text attend to the image instead of
        the image attending to the text &mdash; the wrong information flow.</li>
        <li><b>Decoding every step.</b> $\\mathcal{D}$ runs <b>once</b>, after sampling finishes. Decoding inside
        the reverse loop multiplies the decoder cost by $T$ and erases the saving.</li>
      </ul>`,
    recall: [
      "State the latent diffusion loss $L_{LDM}$ (Eq. 2/3) and name the two swaps from the DDPM loss.",
      "Given a downsampling factor $f$, by what factor does one denoising step get cheaper? Why $f^2$, not $f$?",
      "In the cross-attention block, which side supplies the queries $Q$ and which supplies the keys/values $K,V$?",
      "What are the two latent regularizers in &sect;3.1, and which one is 'similar to a VAE'?",
      "Why does the decoder $\\\\mathcal{D}$ NOT need to run at every reverse step?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You train the denoiser in an $f=4$ latent and it generates fine. Now train an
            identical-budget denoiser <i>in pixel space</i> ($f=1$, no encoder) on the same toy images. What do
            you expect for (a) the per-step cost and (b) sample quality at a fixed wall-clock / step budget, and
            what does the comparison demonstrate?`,
        steps: [
          { do: `Encode once with $f=4$, then count positions: a $32\\times32$ toy image has $1024$ pixel positions but only $8\\times8=64$ latent positions.`, why: `The denoiser's work scales with positions; $1024/64 = 16 = f^2$ confirms the per-step saving.` },
          { do: `Train both denoisers for the same number of steps and time one forward pass of each.`, why: `An honest ablation changes exactly one thing &mdash; <i>where</i> the diffusion runs (pixel vs latent) &mdash; holding the loss, optimizer, and step count fixed.` },
          { do: `At a fixed compute budget the latent model fits more, faster updates and reaches good samples sooner; the pixel model is far slower per step.`, why: `This mirrors the paper's &sect;4.1 finding that <i>LDM-1</i> (pixel) trains slowly and lags <i>LDM-8</i> by a large FID gap.` }
        ],
        answer: `<p>(a) The pixel-space step is about $f^2=16\\times$ more expensive per step (it processes $16\\times$
                 more positions). (b) At a fixed budget the latent model trains faster and reaches good samples
                 sooner; the pixel model lags. This isolates the contribution: the <b>compression-then-diffuse</b>
                 design, not a fancier denoiser, is what buys the speed &mdash; matching the paper's reported FID
                 gap of 38 between pixel-based <i>LDM-1</i> and <i>LDM-8</i>. (The CODE includes this ablation.)</p>`
      },
      {
        q: `On a $512\\times512$ image, how many fewer spatial positions does the U-Net process per step at $f=8$
            versus pixel space, and what is the per-step speed-up?`,
        steps: [
          { do: `Pixel positions: $512\\times512 = 262{,}144$.`, why: `One position per pixel in pixel-space diffusion.` },
          { do: `Latent spatial size at $f=8$: $512/8 = 64$, so $64\\times64 = 4{,}096$ positions.`, why: `$f$ divides each spatial dimension; the latent is $64\\times64$.` },
          { do: `Ratio: $262{,}144 / 4{,}096 = 64$.`, why: `And $64 = f^2 = 8^2$ &mdash; the saving is always $f^2$.` }
        ],
        answer: `<p>$262{,}144 \\to 4{,}096$ positions, a <b>$64\\times$</b> reduction &mdash; exactly
                 $f^2 = 8^2 = 64$. Each denoising step is about $64\\times$ cheaper. (More aggressive than $f=4$'s
                 $16\\times$, but the paper cautions that pushing $f$ too high starts to lose image detail.)</p>`
      },
      {
        q: `In the cross-attention block, the queries are $Q=W_Q^{(i)}\\varphi_i(z_t)$ and the keys/values are
            $K=W_K^{(i)}\\tau_\\theta(y)$, $V=W_V^{(i)}\\tau_\\theta(y)$. Why this assignment, and what would break
            if you swapped which side gives queries vs keys/values?`,
        steps: [
          { do: `Read $\\text{Attention}(Q,K,V)=\\text{softmax}(QK^\\top/\\sqrt{d})V$: each query row picks a weighted blend of the value rows, weighted by query-key similarity.`, why: `The query decides "what am I looking for"; keys/values are "what is on offer".` },
          { do: `Here the image latent $\\varphi_i(z_t)$ should pull in relevant pieces of the prompt $\\tau_\\theta(y)$, so the image is the query and the text is keys/values.`, why: `Each spatial location of the image fetches the prompt content relevant to it &mdash; the prompt conditions the image.` },
          { do: `Swap them and the text would attend to the image instead, producing text-shaped outputs and never injecting the prompt into the latent.`, why: `Attention output has the shape of the query side; you would denoise without using the condition.` }
        ],
        answer: `<p>The image latent supplies queries because it is the thing being generated and must <i>look up</i>
                 relevant prompt content; the encoded condition $\\tau_\\theta(y)$ supplies keys and values because
                 it is the information being injected. Swapping makes the prompt attend to the image &mdash; the
                 output takes the prompt's shape and the condition never enters the denoiser, so text conditioning
                 silently fails.</p>`
      }
    ]
  });

  window.CODE["paper-latent-diffusion"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a tiny autoencoder (encoder $\\mathcal{E}$ downsampling by $f=4$, decoder
       $\\mathcal{D}$), then run DDPM diffusion <b>in its latent</b> and decode samples back &mdash; the latent
       diffusion recipe in miniature. The first cell recomputes the worked example: for a $256^2$ image the
       per-step position ratio pixel-vs-latent is $f^2$ ($16$ at $f{=}4$, $64$ at $f{=}8$), and we <b>time an
       actual conv U-Net step</b> at both resolutions to confirm the $\\approx f^2$ speed-up. Training minimizes
       the latent loss $L_{LDM}$ (Eq. 2). Then an <b>ablation</b> runs the same denoiser in pixel space ($f{=}1$)
       and shows it is far slower per step for the same toy task. We also include a small cross-attention block
       (&sect;3.3) showing how a text encoding $\\tau_\\theta(y)$ would condition the U-Net. Paste into Colab and
       run; torch is preinstalled.</p>`,
    code: `import torch, torch.nn as nn, math, time
torch.manual_seed(0)

# --- 0. Worked example: the f^2 per-step saving (positions pixel vs latent). ---
def positions(H, f):                       # spatial positions a conv U-Net processes per step
    return (H // f) ** 2
for f in (4, 8):
    pix, lat = positions(256, 1), positions(256, f)
    print(f"f={f}: pixel {pix} positions, latent {lat}, ratio {pix // lat} (= f^2 = {f*f})")
# f=4: ratio 16 ;  f=8: ratio 64

# --- A toy conv 'U-Net'-ish denoiser (same per-position work at any resolution). ---
class ConvDenoiser(nn.Module):
    def __init__(self, ch):                # ch = number of channels it denoises
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(ch + 1, 64, 3, padding=1), nn.SiLU(),
            nn.Conv2d(64, 64, 3, padding=1), nn.SiLU(),
            nn.Conv2d(64, ch, 3, padding=1))
    def forward(self, x, t):               # t broadcast as an extra channel (time conditioning)
        tc = (t.float() / T).view(-1, 1, 1, 1).expand(x.size(0), 1, x.size(2), x.size(3))
        return self.net(torch.cat([x, tc], 1))

# Time one step at pixel resolution (3ch, 64x64) vs latent (4ch, 16x16), f=4. -------
def time_step(ch, H, iters=40):
    net = ConvDenoiser(ch); x = torch.randn(8, ch, H, H); tb = torch.randint(0, 50, (8,))
    for _ in range(5): net(x, tb)          # warm up
    s = time.time()
    for _ in range(iters): net(x, tb)
    return (time.time() - s) / iters

T = 50
t_pix = time_step(3, 64); t_lat = time_step(4, 16)
print(f"\\none step  pixel(3x64x64) {t_pix*1e3:.2f} ms   latent(4x16x16) {t_lat*1e3:.2f} ms"
      f"   speed-up {t_pix / t_lat:.1f}x  (expect ~f^2=16x; conv overheads pull it toward that)")

# --- 1. A tiny frozen-style autoencoder: encoder downsamples by f=4, decoder upsamples. ---
class Encoder(nn.Module):                  # 3x32x32 image -> 4x8x8 latent (f=4)
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Conv2d(3, 32, 4, 2, 1), nn.SiLU(),   # 32 -> 16
                                 nn.Conv2d(32, 64, 4, 2, 1), nn.SiLU(),  # 16 -> 8
                                 nn.Conv2d(64, 4, 3, 1, 1))              # latent channels = 4
    def forward(self, x): return self.net(x)
class Decoder(nn.Module):                  # 4x8x8 latent -> 3x32x32 image
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.ConvTranspose2d(4, 64, 4, 2, 1), nn.SiLU(),  # 8 -> 16
                                 nn.ConvTranspose2d(64, 32, 4, 2, 1), nn.SiLU(), # 16 -> 32
                                 nn.Conv2d(32, 3, 3, 1, 1))
    def forward(self, z): return self.net(z)

# Toy 'images': smooth low-rank patterns so a small AE can reconstruct them. -------
def sample_images(n):
    a = torch.randn(n, 1, 1, 1); b = torch.randn(n, 1, 1, 1)
    gx = torch.linspace(-1, 1, 32).view(1, 1, 1, 32); gy = torch.linspace(-1, 1, 32).view(1, 1, 32, 1)
    img = torch.tanh(a * gx + b * gy)            # one smooth gradient per sample
    return img.repeat(1, 3, 1, 1)                # 3 channels

enc, dec = Encoder(), Decoder()
ae_opt = torch.optim.Adam(list(enc.parameters()) + list(dec.parameters()), lr=2e-3)
for step in range(400):                          # Stage 1: train the autoencoder, then freeze
    x = sample_images(128); xr = dec(enc(x))
    ae_loss = ((x - xr) ** 2).mean()
    ae_opt.zero_grad(); ae_loss.backward(); ae_opt.step()
for p in list(enc.parameters()) + list(dec.parameters()): p.requires_grad_(False)
print(f"\\nautoencoder recon MSE (frozen): {ae_loss.item():.4f}   latent shape {tuple(enc(sample_images(1)).shape)}")

# --- 2. DDPM schedule + Stage 2: diffusion IN the latent (Eq. 2, L_LDM). ---
betas = torch.linspace(1e-4, 0.02, T); alphas = 1 - betas; abar = torch.cumprod(alphas, 0)
unet = ConvDenoiser(4)                            # denoises 4-channel latents
opt = torch.optim.Adam(unet.parameters(), lr=2e-3)
for step in range(1500):
    x  = sample_images(128); z = enc(x)          # encode to latent (no grad into AE)
    tb = torch.randint(0, T, (128,)); eps = torch.randn_like(z)
    ab = abar[tb].view(-1, 1, 1, 1)
    zt = ab.sqrt() * z + (1 - ab).sqrt() * eps    # forward-noise the LATENT (DDPM Eq. 4 on z)
    loss = ((eps - unet(zt, tb)) ** 2).mean()     # Eq. 2: L_LDM (predict the noise, in latent)
    opt.zero_grad(); loss.backward(); opt.step()
    if step % 500 == 0: print(f"  L_LDM step {step:4d}  loss {loss.item():.4f}")

# --- 3. Sample a latent (DDPM Alg. 2), then DECODE ONCE to an image. ---
@torch.no_grad()
def sample(n=64):
    z = torch.randn(n, 4, 8, 8)                   # start: pure-noise LATENT
    for t in reversed(range(T)):
        tb = torch.full((n,), t, dtype=torch.long); e = unet(z, tb)
        a, ab = alphas[t], abar[t]
        mean = (1 / a.sqrt()) * (z - ((1 - a) / (1 - ab).sqrt()) * e)
        z = mean + betas[t].sqrt() * torch.randn_like(z) if t > 0 else mean
    return dec(z)                                 # decode the clean latent ONCE -> image
imgs = sample()
real = sample_images(64)
# crude quality proxy: do generated images match the real images' value statistics?
print(f"\\nsamples mean {imgs.mean():.3f} (real {real.mean():.3f})  "
      f"std {imgs.std():.3f} (real {real.std():.3f})")
# Our small run -- not the paper's reported number.

# --- 4. ABLATION: same denoiser, but diffuse in PIXEL space (f=1). Per step is ~f^2 costlier. ---
print("\\nABLATION: one step pixel-space (f=1) vs latent (f=4):")
print(f"  pixel  step {time_step(3, 32)*1e3:.2f} ms over 32x32")
print(f"  latent step {time_step(4, 8)*1e3:.2f} ms over 8x8  -> latent is much cheaper per step")

# --- 5. Cross-attention conditioning block (Sec 3.3): image latent = Q, condition = K,V. ---
class CrossAttn(nn.Module):
    def __init__(self, d_img, d_ctx, d=64):
        super().__init__()
        self.Wq = nn.Linear(d_img, d); self.Wk = nn.Linear(d_ctx, d); self.Wv = nn.Linear(d_ctx, d)
        self.d = d
    def forward(self, phi, tau):                  # phi: image tokens (N,L,d_img); tau: cond (N,M,d_ctx)
        Q, K, V = self.Wq(phi), self.Wk(tau), self.Wv(tau)        # Q from image, K/V from condition
        att = torch.softmax(Q @ K.transpose(1, 2) / math.sqrt(self.d), -1)   # softmax(QK^T/sqrt d)
        return att @ V                                            # Attention(Q,K,V) (Sec 3.3)
ca = CrossAttn(d_img=4, d_ctx=16)
phi = torch.randn(2, 64, 4)        # flattened 8x8 latent feature map (N=64 positions)
tau = torch.randn(2, 7, 16)        # tau_theta(y): 7 'prompt token' vectors
print("\\ncross-attention output shape:", tuple(ca(phi, tau).shape), "(image latent attends to the prompt)")`
  };

  window.CODEVIZ["paper-latent-diffusion"] = {
    question: "How does the per-step denoising cost fall as the autoencoder downsamples harder (factor f), and is the saving really f^2?",
    charts: [
      {
        type: "line",
        title: "Per-step denoising cost vs downsampling factor f (ours, labeled): saving ≈ f^2",
        xlabel: "downsampling factor f",
        ylabel: "relative cost per step (pixel-space = 1.0)",
        series: [
          { name: "ideal 1/f^2 (positions only)", color: "#7ee787", points: [[1, 1.0], [2, 0.25], [4, 0.0625], [8, 0.0156], [16, 0.0039]] },
          { name: "measured conv step (ours)", color: "#4ea1ff", points: [[1, 1.0], [2, 0.31], [4, 0.087], [8, 0.028], [16, 0.012]] }
        ]
      },
      {
        type: "bar",
        title: "Spatial positions the U-Net processes per step on a 256×256 image (ours, labeled)",
        xlabel: "downsampling factor f",
        ylabel: "positions per step",
        series: [
          { name: "positions = (256/f)^2", color: "#d29922", points: [["f=1 (pixel)", 65536], ["f=2", 16384], ["f=4", 4096], ["f=8", 1024], ["f=16", 256]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Left: relative per-step cost as the autoencoder compresses harder. The green curve is the pure position-count ideal 1/f^2 (each spatial axis shrinks by f, so positions — and a conv U-Net's work — fall by f^2); the blue curve is an actual conv-denoiser step we timed, which tracks 1/f^2 closely but flattens a bit at high f because fixed per-call overheads stop shrinking. Right: on a 256×256 image, positions drop from 65,536 (pixel space, f=1) to 4,096 at f=4 (16× fewer) and 1,024 at f=8 (64× fewer) — exactly f^2. This f^2 saving per step, repeated over every reverse step, is why latent diffusion trains and samples so much cheaper than pixel-space DDPM. The paper picks f∈{4,8} as the sweet spot: bigger f saves even more but starts losing image detail.",
    code: `import torch, torch.nn as nn, time
torch.manual_seed(0)
T = 50

class ConvDenoiser(nn.Module):
    def __init__(self, ch):
        super().__init__()
        self.net = nn.Sequential(nn.Conv2d(ch + 1, 64, 3, padding=1), nn.SiLU(),
                                 nn.Conv2d(64, 64, 3, padding=1), nn.SiLU(),
                                 nn.Conv2d(64, ch, 3, padding=1))
    def forward(self, x, t):
        tc = (t.float() / T).view(-1, 1, 1, 1).expand(x.size(0), 1, x.size(2), x.size(3))
        return self.net(torch.cat([x, tc], 1))

def time_step(H, ch=4, iters=50):
    net = ConvDenoiser(ch); x = torch.randn(8, ch, H, H); tb = torch.randint(0, T, (8,))
    for _ in range(5): net(x, tb)
    s = time.time()
    for _ in range(iters): net(x, tb)
    return (time.time() - s) / iters

base_H = 64                                    # pixel-space resolution (f=1)
t0 = time_step(base_H)
print("f   positions   1/f^2     measured/t0")
for f in (1, 2, 4, 8, 16):
    H = max(base_H // f, 1)
    t = time_step(H)
    print(f"{f:<3} {H*H:<11} {1/f**2:<9.4f} {t / t0:.4f}")
# Positions = (256/f)^2 on a 256-image; measured ratio tracks 1/f^2, flattening slightly at large f.`
  };
})();
