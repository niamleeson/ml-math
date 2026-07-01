/* All ML — authored content for Part 10: Generative Models (10.1–10.19).
   Appends to window.ALLML_CONTENT. Numbers were computed by the Part 10 builder.
   LaTeX via String.raw; emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 10.1 Autoencoders ---------------- */
window.ALLML_CONTENT["10.1"] = {
  tagline: "Compress through a bottleneck, then reconstruct; generation begins by learning which information is worth preserving.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.1-autoencoders.ipynb",
  context: String.raw`
    <p>Lessons on linear algebra and optimization supply the encoder matrix, decoder matrix, and reconstruction loss; representation learning from earlier neural-network lessons explains why the hidden code can become a useful feature. This starts Part 10 by turning unsupervised structure into a compact latent space, which VAEs (10.2), flows (10.9), and latent diffusion (10.14) will make explicitly generative.</p>`,
  intuition: String.raw`
    <p>An autoencoder solves the concrete problem of copying data through a narrow passage. The naive copy machine learns the identity and discovers nothing; the bottleneck forces a decision about what variation matters. The design choice people gloss over is the loss: reconstruction loss rewards faithful recovery, not semantic usefulness, so the code becomes meaningful only because the architecture and data distribution make useless details expensive to carry.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>a bottleneck reconstruction map</b></p>
    <div class="formula-box">For input $x\in\mathbb{R}^2$, encoder $z=W_e x\in\mathbb{R}$, decoder $\hat x=W_d z\in\mathbb{R}^2$, and reconstruction loss $L=\frac{1}{2}\lVert x-\hat x\rVert_2^2$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>$x=(2,1)$ and $W_e=(0.8,0.6)$ give $z=2\cdot0.8+1\cdot0.6=2.200$</li>
      <li>Using tied decoder $W_d=(0.8,0.6)$ gives $\hat x=(2.200\cdot0.8,2.200\cdot0.6)=(1.760,1.320)$</li>
      <li>$L=\frac12((2-1.760)^2+(1-1.320)^2)=0.0800$</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Treating low reconstruction loss as proof of useful features.</b> The loss term only measures $x-\hat x$, so the code may preserve nuisance detail.</li>
      <li><b>Making the bottleneck too wide.</b> Then $z$ can carry an identity map and the mathematics never forces compression.</li>
      <li><b>Comparing losses across differently scaled features.</b> The squared term lets large-scale coordinates dominate the code.</li>
    </ul>`
};

/* ---------------- 10.2 Variational Autoencoders ---------------- */
window.ALLML_CONTENT["10.2"] = {
  tagline: "A VAE learns a smooth latent distribution by trading reconstruction accuracy against closeness to a prior.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.2-variational-autoencoders.ipynb",
  context: String.raw`
    <p>Autoencoders (10.1) provide the encoder-decoder skeleton, probability gives Gaussian latents and expectations, and KL divergence measures how far the encoder distribution drifts from a simple prior. The result enables controllable sampling, beta-VAE (10.3), and the latent spaces used by diffusion systems (10.14).</p>`,
  intuition: String.raw`
    <p>A plain autoencoder gives codes but not a reliable way to sample new ones. A VAE fixes that by making the encoder output a distribution rather than a point. The glossed-over design decision is the KL term: it deliberately damages perfect reconstruction so nearby latent points decode to related outputs, making the space smooth enough for generation.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>the evidence lower bound</b></p>
    <div class="formula-box">The encoder returns $q_\phi(z\mid x)=\mathcal{N}(\mu,\sigma^2)$, samples $z=\mu+\sigma\epsilon$ with $\epsilon\sim\mathcal{N}(0,1)$, and maximizes $\mathbb{E}_{q}[\log p_\theta(x\mid z)]-D_{KL}(q\|p)$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>$\sigma=\exp(0.5\cdot -0.7)=0.7047$</li>
      <li>$z=0.5+0.7047\cdot1.2=1.346$</li>
      <li>$D_{KL}=\frac12(0.5^2+\exp(-0.7)-1-(-0.7))=0.2233$</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting KL collapse to zero.</b> Then $z$ ignores $x$ and the decoder becomes a language model over reconstructions.</li>
      <li><b>Forgetting the reparameterization.</b> Sampling $z$ directly blocks low-variance gradients through $\mu$ and $\sigma$.</li>
      <li><b>Over-valuing sharp reconstructions.</b> The ELBO includes both reconstruction and KL, so visual sharpness alone is not the objective.</li>
    </ul>`
};

/* ---------------- 10.3 VAE variants (beta-VAE, VQ-VAE) ---------------- */
window.ALLML_CONTENT["10.3"] = {
  tagline: "VAE variants change the pressure on the latent code: beta-VAE separates factors, VQ-VAE makes codes discrete.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.3-vae-variants-beta-vae-vq-vae.ipynb",
  context: String.raw`
    <p>The VAE objective from 10.2 supplies the reconstruction-versus-KL trade. Information bottlenecks and clustering explain why changing that pressure can produce disentangled or discrete representations. These ideas feed tokenized image generation, latent diffusion (10.14), and conditional control (10.15).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a vanilla VAE often learns a usable but mushy latent space. beta-VAE turns up the price of information; VQ-VAE replaces continuous coordinates with nearest codebook entries. The design choice is not cosmetic: you choose whether the model should represent smooth factors, discrete symbols, or reconstruction detail.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>latent pressure in VAE variants</b></p>
    <div class="formula-box">beta-VAE minimizes $L=\text{recon}+\beta D_{KL}$; VQ-VAE replaces $z_e$ by $e_k$ where $k=\arg\min_j\lVert z_e-e_j\rVert_2$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>With recon $0.42$, KL $0.2483$, $\beta=1$ gives $L=0.6683$</li>
      <li>The same example with $\beta=4$ gives $L=0.42+4\cdot0.2483=1.413$</li>
      <li>For $z_e=(0.2,0.7)$, distance to $(0,1)$ is 0.3606 and to $(1,0)$ is 1.063, so the discrete code is $(0,1)$</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Turning beta up without checking reconstruction.</b> The $\beta D_{KL}$ term can erase information.</li>
      <li><b>Using too small a codebook.</b> nearest-neighbor quantization then creates high commitment loss and code collisions.</li>
      <li><b>Calling factors disentangled without interventions.</b> A lower KL does not prove semantic independence.</li>
    </ul>`
};

/* ---------------- 10.4 Restricted Boltzmann Machines & Deep Belief Nets ---------------- */
window.ALLML_CONTENT["10.4"] = {
  tagline: "RBMs define probability through energy; deep belief nets stack those energies into hierarchical latent features.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.4-restricted-boltzmann-machines-deep-belief-nets.ipynb",
  context: String.raw`
    <p>Log-linear models, sigmoid probabilities, and Markov chains are the prerequisites: an RBM uses an energy score, conditional Bernoulli updates, and sampling to learn hidden causes. This historical path leads directly to modern energy-based models (10.10) and to the idea that generation can be sampling from a learned landscape.</p>`,
  intuition: String.raw`
    <p>An RBM solves generation without an explicit decoder network. It assigns low energy to compatible visible-hidden pairs and high energy elsewhere. The subtle design decision is the missing visible-visible and hidden-hidden edges: removing them makes conditional updates factorize, so Gibbs sampling is practical even though the full partition function is not.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>energy-based binary latent variables</b></p>
    <div class="formula-box">$E(v,h)=-b^\top v-c^\top h-v^\top Wh$, and $p(v,h)=\exp(-E(v,h))/Z$ for binary $v\in\{0,1\}^D$, $h\in\{0,1\}^K$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>For $v=(1,0)$, $h=(1,1)$, the energy is $E=-0.7000$</li>
      <li>The unnormalized weight is $\exp(-E)=\exp(0.7000)=2.014$</li>
      <li>$p(h_j=1\mid v)$ is a sigmoid of $c_j+W_{:j}^\top v$, so hidden units update independently given the visible vector</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Ignoring the partition function.</b> unnormalized weights are not probabilities until divided by $Z$.</li>
      <li><b>Adding within-layer edges casually.</b> The conditional factorization that makes Gibbs updates simple disappears.</li>
      <li><b>Expecting contrastive divergence to be exact maximum likelihood.</b> Short chains bias the negative phase.</li>
    </ul>`
};

/* ---------------- 10.5 Generative Adversarial Networks ---------------- */
window.ALLML_CONTENT["10.5"] = {
  tagline: "A GAN learns by turning generation into a game between a sampler and a critic.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.5-generative-adversarial-networks.ipynb",
  context: String.raw`
    <p>Binary classification supplies the discriminator loss, neural-network optimization supplies alternating gradient steps, and distribution matching explains why fooling the discriminator can imply realistic samples. WGANs and conditional GANs (10.6), StyleGAN (10.7), and GAN evaluation (10.8) all modify this game.</p>`,
  intuition: String.raw`
    <p>A GAN addresses the pain that likelihoods can be hard to write for rich data. Instead of asking for a probability, it asks a discriminator to tell real from fake. The glossed-over choice is adversarial training itself: the generator receives a useful learning signal only through the discriminator, so the quality of the critic shapes the geometry of the generator update.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>the minimax generator-discriminator game</b></p>
    <div class="formula-box">GAN training solves $\min_G\max_D \mathbb{E}_{x\sim p_{data}}\log D(x)+\mathbb{E}_{z\sim p(z)}\log(1-D(G(z)))$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>If $D(x)=0.73$ on real data, the real term is $\log(0.73)=-0.3147$</li>
      <li>If $D(G(z))=0.41$, the fake term is $\log(1-0.41)=-0.5276$</li>
      <li>The discriminator objective contribution is their sum, -0.8423</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Training one player too far ahead.</b> if $D(G(z))$ saturates near 0, generator gradients become uninformative.</li>
      <li><b>Reading loss curves like likelihoods.</b> GAN objectives are game values, not calibrated sample probabilities.</li>
      <li><b>Mode collapse.</b> The generator can raise discriminator confusion while covering only a few modes.</li>
    </ul>`
};

/* ---------------- 10.6 GAN variants (DCGAN, WGAN, conditional) ---------------- */
window.ALLML_CONTENT["10.6"] = {
  tagline: "GAN variants change the architecture, distance, or conditioning signal to make the adversarial game usable.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.6-gan-variants-dcgan-wgan-conditional.ipynb",
  context: String.raw`
    <p>The vanilla GAN game from 10.5 is the base. Convolutions add image-like inductive bias, Wasserstein distance changes the critic signal, and conditioning injects labels or attributes. These modifications set up StyleGAN and CycleGAN (10.7) and make evaluation questions in 10.8 sharper.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that the original GAN game is fragile. DCGAN adds architectural bias, WGAN replaces a saturating classification signal with a transport-like distance, and conditional GANs tell the generator which mode to produce. The design decision is choosing what failure to fix: instability, geometry, or controllability.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>stabilizing and steering GAN training</b></p>
    <div class="formula-box">WGAN uses $\min_G\max_{\lVert f\rVert_L\le1}\mathbb{E}f(x)-\mathbb{E}f(G(z))$; conditional GANs use $G(z,y)$ and $D(x,y)$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>For one-dimensional means $0.2$ and $1.1$, a transport gap is $|0.2-1.1|=0.9000$</li>
      <li>For samples $(0,1,2)$ and $(0.5,1.5,2.5)$, critic mean difference is -0.5000</li>
      <li>$G(z,y)$ changes the target distribution by label, so the same noise can become different class-conditional samples</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Forgetting the Lipschitz constraint in WGAN.</b> without it the critic no longer estimates Wasserstein distance.</li>
      <li><b>Using convolution as decoration.</b> DCGAN works because weight sharing encodes local stationarity.</li>
      <li><b>Conditioning only the generator.</b> if $D$ cannot see $y$, it cannot penalize label mismatch.</li>
    </ul>`
};

/* ---------------- 10.7 StyleGAN & CycleGAN ---------------- */
window.ALLML_CONTENT["10.7"] = {
  tagline: "StyleGAN controls how features are drawn; CycleGAN learns translations when paired examples are unavailable.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.7-stylegan-cyclegan.ipynb",
  context: String.raw`
    <p>GAN training (10.5) supplies the adversarial pressure, conditional generation (10.6) supplies controllability, and perceptual structure explains why style and content can be separated. The same conditioning logic reappears in ControlNet (10.15) and style transfer (10.18).</p>`,
  intuition: String.raw`
    <p>The pain is control. A GAN can make plausible samples but not necessarily the sample you intended. StyleGAN injects style parameters into layers so coarse and fine factors can be steered; CycleGAN adds a return trip so unpaired domain translation cannot drift freely. The design choice is to constrain the mapping without requiring paired supervision.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>style control and cycle consistency</b></p>
    <div class="formula-box">Style modulation can be written $y=s\cdot x+b$. Cycle consistency uses $L_{cyc}=\lVert F(G(x))-x\rVert_1$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>With $x=2$, style scale $1.5$, bias $0.4$, the styled activation is $1.5\cdot2+0.4=3.400$</li>
      <li>The inverse map recovers $(3.400-0.4)/1.5=2.000$</li>
      <li>The cycle error is $|2-2.000|=0.0000$</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing style control with labels.</b> Style vectors modulate features continuously, not just categories.</li>
      <li><b>Dropping cycle loss in unpaired translation.</b> The adversarial term alone permits many content-destroying maps.</li>
      <li><b>Expecting perfect disentanglement.</b> layer-wise controls are useful biases, not proofs of independent factors.</li>
    </ul>`
};

/* ---------------- 10.8 GAN evaluation (FID, Inception Score) ---------------- */
window.ALLML_CONTENT["10.8"] = {
  tagline: "GAN evaluation asks two questions separately: are samples realistic, and do they cover the distribution?",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.8-gan-evaluation-fid-inception-score.ipynb",
  context: String.raw`
    <p>Probability, covariance, and KL divergence are the prerequisites. FID compares feature means and covariances; Inception Score compares confident conditional labels to diverse marginal labels. These metrics become cautionary tools for diffusion (10.12) and text-to-image systems (10.14).</p>`,
  intuition: String.raw`
    <p>The concrete pain is that GAN loss does not tell you sample quality. FID uses a feature-space Gaussian approximation to compare generated and real distributions. Inception Score rewards confident, diverse classifier predictions. The design decision is to evaluate distributions of generated samples, not individual favorites, because cherry-picked examples hide missing modes.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>distributional sample metrics</b></p>
    <div class="formula-box">$FID=\lVert m_r-m_g\rVert^2+\mathrm{Tr}(C_r+C_g-2(C_rC_g)^{1/2})$ and $IS=\exp(\mathbb{E}_x KL(p(y\mid x)\|p(y)))$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>With means $(0,0)$ and $(1,0.5)$ plus diagonal covariances, the toy FID is 1.336</li>
      <li>Softmax logits $(1.2,0.3,-0.4)$ give top class probability 0.6217</li>
      <li>Against a uniform marginal over three classes, the toy Inception contribution exponentiates to 1.215</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using IS on a domain unrelated to the classifier.</b> $p(y\mid x)$ then measures classifier bias, not sample quality.</li>
      <li><b>Forgetting covariance in FID.</b> matching means alone misses diversity collapse.</li>
      <li><b>Treating small FID differences as absolute truth.</b> Finite sample estimates and feature extractors both add noise.</li>
    </ul>`
};

/* ---------------- 10.9 Normalizing flows ---------------- */
window.ALLML_CONTENT["10.9"] = {
  tagline: "A flow generates by applying invertible transformations while exactly tracking density.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.9-normalizing-flows.ipynb",
  context: String.raw`
    <p>Change of variables from calculus is the core prerequisite, and neural networks provide flexible invertible maps. Flows contrast with VAEs (10.2), GANs (10.5), and diffusion (10.12) because they keep exact likelihoods. They also foreshadow flow matching (10.16).</p>`,
  intuition: String.raw`
    <p>The pain is the usual trade: easy sampling often loses likelihood, and exact likelihood often limits expressiveness. Flows choose invertibility so probability mass can be followed exactly through every layer. The design decision is accepting architectural constraints in exchange for a tractable Jacobian determinant.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>invertible density transformation</b></p>
    <div class="formula-box">If $y=f(x)$ is invertible, $\log p_Y(y)=\log p_X(x)-\log|\det J_f(x)|$. For $y=ax+t$ in two dimensions, $\log|\det J|=2\log|a|$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>With $x=(1.2,-0.7)$, $a=1.5$, $t=(0.3,-0.2)$, $y=(2.100,-1.250)$</li>
      <li>The log-determinant is $2\log(1.5)=0.8109$</li>
      <li>The density subtracts this log-determinant because stretching space lowers probability per unit volume</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using non-invertible layers.</b> The change-of-variables formula needs a one-to-one map.</li>
      <li><b>Ignoring the determinant sign.</b> density uses $|\det J|$, not just $\det J$.</li>
      <li><b>Making the transform expressive but determinant expensive.</b> exact likelihood becomes computationally impractical.</li>
    </ul>`
};

/* ---------------- 10.10 Energy-based models ---------------- */
window.ALLML_CONTENT["10.10"] = {
  tagline: "An energy-based model learns what should be low energy, then samples by moving downhill through that landscape.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.10-energy-based-models.ipynb",
  context: String.raw`
    <p>RBMs (10.4) are the discrete ancestor, while gradients and MCMC explain how samples move through an energy landscape. Score models (10.11) reuse the same idea locally by learning gradients of log density.</p>`,
  intuition: String.raw`
    <p>The concrete problem is modeling complex distributions without committing to an explicit decoder or invertible map. An EBM assigns a scalar energy to every point; lower energy means more plausible. The design decision is to learn an unnormalized score because the partition function is hard, then rely on contrastive samples to teach the model where energy should rise.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>unnormalized probability through energy</b></p>
    <div class="formula-box">$p_\theta(x)=\exp(-E_\theta(x))/Z_\theta$, where $Z_\theta=\int\exp(-E_\theta(x))dx$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>For energies $(0.2,1.1,2.0)$, $Z=\exp(-0.2)+\exp(-1.1)+\exp(-2.0)=1.287$</li>
      <li>The probability of the first state is $\exp(-0.2)/1.287=0.6362$</li>
      <li>Lowering one energy raises its probability but also changes $Z$, so all probabilities are coupled</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Forgetting $Z$.</b> energies rank states but are not normalized probabilities.</li>
      <li><b>Using weak negative samples.</b> The model only learns to raise energy where the sampler visits.</li>
      <li><b>Comparing energies across separately trained models.</b> Arbitrary offsets can change without changing probabilities.</li>
    </ul>`
};

/* ---------------- 10.11 Score-based models & SDEs ---------------- */
window.ALLML_CONTENT["10.11"] = {
  tagline: "Score models learn the direction back toward data after noise has blurred the distribution.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.11-score-based-models-sdes.ipynb",
  context: String.raw`
    <p>Energy gradients, Gaussian noise, and stochastic differential equations are the prerequisites. The score $
abla_x\log p_t(x)$ points toward higher density at each noise level, becoming the vector field used by diffusion (10.12) and classifier-free guidance (10.13).</p>`,
  intuition: String.raw`
    <p>The pain is that estimating a full density can be harder than estimating which way density increases. Score models learn that direction after corrupting data with many noise levels. The design decision is to train on noisy versions of data: without noise, the score may be undefined or unstable on low-dimensional data manifolds.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>learning gradients of log density</b></p>
    <div class="formula-box">The score is $s_\theta(x,t)\approx\nabla_x\log p_t(x)$. For $p_t(x)=\mathcal{N}(0,\sigma^2)$, the exact score is $-x/\sigma^2$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>With $\sigma=0.5$ and $x=-1$, the score is $-(-1)/0.25=4.000$</li>
      <li>With $x=1$, the score is $-1/0.25=-4.000$</li>
      <li>The two arrows point inward, so denoising moves both tails back toward high density</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Training at one noise level only.</b> The model lacks the path from pure noise back to data.</li>
      <li><b>Confusing score with probability.</b> it is a gradient direction, not a normalized density.</li>
      <li><b>Using steps that are too large in sampling.</b> The discretized SDE can overshoot the score field.</li>
    </ul>`
};

/* ---------------- 10.12 Diffusion models (DDPM) ---------------- */
window.ALLML_CONTENT["10.12"] = {
  tagline: "DDPMs learn to undo a carefully scheduled noising process, one small denoising step at a time.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.12-diffusion-models-ddpm.ipynb",
  context: String.raw`
    <p>Score models (10.11) provide the denoising direction, Gaussian algebra supplies the closed-form noisy sample, and neural nets predict noise or clean data. Classifier-free guidance (10.13) and latent diffusion (10.14) are direct extensions.</p>`,
  intuition: String.raw`
    <p>Diffusion solves generation by making the hard mapping from noise to data into many easy corrections. The forward process slowly destroys data with Gaussian noise; the model learns the reverse. The design choice is the noise schedule: too fast and learning becomes impossible, too slow and sampling becomes expensive.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>forward noising and learned denoising</b></p>
    <div class="formula-box">Forward noising uses $x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon$, with $\epsilon\sim\mathcal{N}(0,I)$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>With $x_0=2$, $\bar\alpha_t=0.64$, and $\epsilon=-0.5$, the signal term is $\sqrt{0.64}\cdot2=1.600$</li>
      <li>The noise term is $\sqrt{0.36}\cdot(-0.5)=-0.3000$</li>
      <li>The noisy value is their sum, $x_t=1.300$</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Predicting the wrong target.</b> noise, clean data, and velocity parameterizations imply different scaling.</li>
      <li><b>Using an inconsistent schedule at sampling time.</b> The reverse equations assume the same $\bar\alpha_t$ path.</li>
      <li><b>Judging a single denoising step visually.</b> quality comes from accumulated small corrections.</li>
    </ul>`
};

/* ---------------- 10.13 Classifier-free guidance ---------------- */
window.ALLML_CONTENT["10.13"] = {
  tagline: "Classifier-free guidance steers diffusion by extrapolating from unconditional toward conditional predictions.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.13-classifier-free-guidance.ipynb",
  context: String.raw`
    <p>DDPM sampling (10.12) supplies the denoising prediction, conditioning supplies text or labels, and vector arithmetic explains the extrapolation. This becomes a central knob in latent text-to-image systems (10.14) and ControlNet (10.15).</p>`,
  intuition: String.raw`
    <p>The pain is balancing fidelity to the prompt against sample realism. Classifier-free guidance trains one model to make both conditional and unconditional predictions, then amplifies the difference at sampling time. The design choice is extrapolation: guidance is not merely choosing the conditional prediction, it pushes past it, which is powerful and risky.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>conditional-unconditional score mixing</b></p>
    <div class="formula-box">With guidance scale $w$, $s_{guided}=s_{uncond}+w(s_{cond}-s_{uncond})$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>If $s_{uncond}=-0.4$, $s_{cond}=0.9$, their difference is 1.300</li>
      <li>With $w=3$, $s_{guided}=-0.4+3\cdot1.3=3.500$</li>
      <li>Because $w\gt1$, the guided score moves beyond the conditional score rather than stopping at it</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Turning guidance too high.</b> extrapolation can leave the data manifold and create artifacts.</li>
      <li><b>Forgetting unconditional dropout during training.</b> The model must learn both predictions.</li>
      <li><b>Comparing prompts at different guidance scales.</b> The score formula changes the effective objective.</li>
    </ul>`
};

/* ---------------- 10.14 Latent diffusion & text-to-image ---------------- */
window.ALLML_CONTENT["10.14"] = {
  tagline: "Latent diffusion performs denoising in a compressed representation, then decodes the result into pixels.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.14-latent-diffusion-text-to-image.ipynb",
  context: String.raw`
    <p>Autoencoders (10.1), VAEs (10.2), DDPMs (10.12), and classifier-free guidance (10.13) combine here. Text encoders provide conditioning, while the decoder turns latent samples back into images. ControlNet (10.15) adds more structured conditioning on top.</p>`,
  intuition: String.raw`
    <p>Pixel diffusion is expensive because every denoising step touches a huge image. Latent diffusion first compresses the image, runs diffusion in the smaller latent space, and decodes at the end. The design decision is where to spend modeling capacity: the autoencoder handles perceptual compression; the diffusion model handles semantic generation.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>diffusion in learned latent space</b></p>
    <div class="formula-box">An encoder maps $x\mapsto z$, diffusion samples $z_T\to z_0$, and a decoder maps $\hat x=D(z_0)$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>For $z=(1,-1)$ and decoder matrix $D=\begin{bmatrix}1&0.5\0.2&1\end{bmatrix}$, $\hat x=(0.5000,-0.8000)$</li>
      <li>The latent norm is $\sqrt{1^2+(-1)^2}=1.414$</li>
      <li>Operating on the two latent coordinates is cheaper than denoising a full pixel grid, but decoder errors become generation errors</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using a weak autoencoder.</b> compression artifacts become the ceiling for generated quality.</li>
      <li><b>Assuming text conditioning is magic.</b> Guidance still acts through the denoising prediction.</li>
      <li><b>Changing latent scale without retraining.</b> The diffusion schedule is calibrated to the latent distribution.</li>
    </ul>`
};

/* ---------------- 10.15 ControlNet & conditioning ---------------- */
window.ALLML_CONTENT["10.15"] = {
  tagline: "ControlNet adds a trainable conditioning path that can steer a frozen diffusion model without destroying it.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.15-controlnet-conditioning.ipynb",
  context: String.raw`
    <p>Latent diffusion (10.14) supplies the frozen generator, classifier-free guidance (10.13) supplies prompt steering, and residual networks explain how an added branch can influence layers. This enables pose, edge, depth, and layout control for generative systems.</p>`,
  intuition: String.raw`
    <p>The concrete pain is that text alone is too vague for spatial control. Fine-tuning the whole diffusion model can damage what it already knows. ControlNet copies parts of the network into a conditioning branch and injects residual features. The design decision is the zero-initialized residual: it starts as no change, then learns control safely.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>residual spatial conditioning</b></p>
    <div class="formula-box">A simple residual view is $h_{out}=h_{base}+r_{cond}(c)$, where $c$ is an edge map, pose, depth map, or other condition.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>If $h_{base}=(0.4,0.1)$ and $r_{cond}=(0.3,-0.2)$, then $h_{out}=(0.7000,-0.1000)$</li>
      <li>The residual magnitude is $\sqrt{0.3^2+(-0.2)^2}=0.3606$</li>
      <li>Starting that residual near zero preserves the base model before the conditioning branch learns useful corrections</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Injecting condition too late.</b> Early spatial structure may already be lost.</li>
      <li><b>Training without zero-like initialization.</b> The branch can immediately disrupt the frozen generator.</li>
      <li><b>Treating all conditions alike.</b> edges, depth, and pose constrain different layers and scales.</li>
    </ul>`
};

/* ---------------- 10.16 Consistency & flow-matching models ---------------- */
window.ALLML_CONTENT["10.16"] = {
  tagline: "These models learn a direct path from noise to data, reducing generation to fewer, larger steps.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.16-consistency-flow-matching-models.ipynb",
  context: String.raw`
    <p>Diffusion (10.12) gives a slow reverse process; normalizing flows (10.9) give invertible transformations. Flow matching learns velocities along a path, while consistency models learn predictions that agree across time. Video and 3D generation (10.19) often need these faster paths.</p>`,
  intuition: String.raw`
    <p>The pain is sampling cost. Diffusion may need many denoising steps. Flow matching says: pick a path between noise and data, then learn the velocity along it. Consistency says: predictions from different times on the same path should agree. The design choice is to learn the path geometry directly rather than only the local denoising score.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>learned transport paths</b></p>
    <div class="formula-box">For a linear path $x_t=(1-t)x_0+tx_1$, the flow-matching target velocity is $v=x_1-x_0$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>With $x_0=0$, $x_1=2$, and $t=0.3$, $x_t=0.7\cdot0+0.3\cdot2=0.6000$</li>
      <li>The target velocity is $v=2-0=2.000$</li>
      <li>A step of size $0.1$ moves to $x_t+0.1v=0.8000$</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Choosing a poor path.</b> The velocity field becomes hard even if endpoints are simple.</li>
      <li><b>Assuming one-step sampling is free.</b> Large steps amplify approximation error.</li>
      <li><b>Mixing diffusion and flow parameterizations without rescaling time.</b> their targets have different units.</li>
    </ul>`
};

/* ---------------- 10.17 Autoregressive generation (PixelCNN, WaveNet) ---------------- */
window.ALLML_CONTENT["10.17"] = {
  tagline: "Autoregressive models generate one variable at a time, multiplying simple conditional probabilities into a full joint distribution.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.17-autoregressive-generation-pixelcnn-wavenet.ipynb",
  context: String.raw`
    <p>Probability chain rules are the foundation; convolutions provide masked context in PixelCNN and causal context in WaveNet. This sequential factorization complements diffusion and flows by giving exact likelihood but slower sampling.</p>`,
  intuition: String.raw`
    <p>The concrete problem is modeling a high-dimensional object without inventing a global latent. Autoregressive generation chooses an ordering and predicts the next value from previous values. The design decision is the mask: the model must not see the future, because exact likelihood depends on each conditional using only earlier variables.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>factorized sequential likelihood</b></p>
    <div class="formula-box">$p(x_1,\ldots,x_D)=\prod_{i=1}^{D}p(x_i\mid x_{\lt i})$, so $\log p(x)=\sum_i\log p(x_i\mid x_{\lt i})$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>For conditional probabilities $(0.5,0.7,0.2)$, the sequence probability is $0.5\cdot0.7\cdot0.2=0.0700$</li>
      <li>The negative log-likelihood is $-\log0.5-\log0.7-\log0.2=2.659$</li>
      <li>A single small conditional probability can dominate the whole sequence cost</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Leaking future pixels or samples.</b> The likelihood is invalid if $x_i$ sees $x_{\gt i}$.</li>
      <li><b>Ignoring sampling speed.</b> exact likelihood comes with sequential generation.</li>
      <li><b>Treating ordering as neutral.</b> Different orderings change which dependencies are easy.</li>
    </ul>`
};

/* ---------------- 10.18 Neural style transfer ---------------- */
window.ALLML_CONTENT["10.18"] = {
  tagline: "Style transfer optimizes an image to keep content features while matching style-feature correlations.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.18-neural-style-transfer.ipynb",
  context: String.raw`
    <p>Convolutional feature maps provide content representations, linear algebra supplies Gram matrices, and gradient descent optimizes pixels directly. StyleGAN (10.7) and text-to-image systems (10.14) inherit the broader idea that content and style can be controlled separately.</p>`,
  intuition: String.raw`
    <p>The pain is that pixel-level similarity cannot express artistic style. Neural style transfer keeps high-level content activations close to one image while matching feature correlations from another. The glossed-over choice is the Gram matrix: it discards spatial position, so style becomes texture statistics rather than object layout.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>content loss plus Gram-style loss</b></p>
    <div class="formula-box">For feature matrix $F\in\mathbb{R}^{C\times N}$, the style Gram matrix is $G=FF^\top/N$; losses combine $L=\alpha L_{content}+\beta L_{style}$.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>For $F=\begin{bmatrix}1&2\3&4\end{bmatrix}$, $G_{11}=(1^2+2^2)/2=2.500$</li>
      <li>$G_{12}=(1\cdot3+2\cdot4)/2=5.500$</li>
      <li>$G_{22}=(3^2+4^2)/2=12.50$</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using pixel loss for style.</b> it preserves location rather than texture statistics.</li>
      <li><b>Setting $\beta$ too high.</b> Gram matching can overwhelm content activations.</li>
      <li><b>Comparing Gram matrices from mismatched layers.</b> Different layers encode different scales of style.</li>
    </ul>`
};

/* ---------------- 10.19 Video & 3D generation ---------------- */
window.ALLML_CONTENT["10.19"] = {
  tagline: "Video and 3D generation add consistency constraints across time, viewpoints, and geometry.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/10.19-video-3d-generation.ipynb",
  context: String.raw`
    <p>Diffusion and flow matching provide generative engines, while geometry, projection, and sequence modeling add the constraints that still images do not need. ControlNet (10.15) and latent diffusion (10.14) become building blocks for camera, depth, and motion control.</p>`,
  intuition: String.raw`
    <p>The concrete pain is that plausible frames are not enough. Video must stay coherent across time; 3D must remain consistent across views. The design decision is to model structure beyond independent images: trajectories, camera rays, depth, or 3D representations make different views agree because they share an underlying scene.</p>`,
  mathematics: String.raw`
    <p>The core object is <b>temporal and geometric consistency</b></p>
    <div class="formula-box">A toy motion model is $p_t=p_0+t v$ for 3D point $p_t\in\mathbb{R}^3$ and velocity $v\in\mathbb{R}^3$; projection then maps 3D state to frames.</div>
    <p>Each symbol has a job: the data object is shaped by the model, the loss or probability gives training a scalar target, and the generated sample is obtained by decoding, sampling, or stepping through the learned rule.</p>
    <ol class="work">
      <li>With $p_0=(0,0,0)$, $v=(1,0.5,0.2)$, and $t=3$, $p_3=(3.000,1.500,0.6000)$</li>
      <li>The speed is $\sqrt{1^2+0.5^2+0.2^2}=1.136$</li>
      <li>A generator that changes this latent trajectory independently per frame will flicker even if every frame looks sharp</li>
    </ol>
    <p>These numbers are small enough to audit by hand, but they carry the main lesson: generative modeling is never just making an output; it is choosing which mathematical pressure defines a believable output.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing frame quality alone.</b> no term ties $p_t$ or latent state across time.</li>
      <li><b>Ignoring camera geometry.</b> A 3D object can look inconsistent if projections are not shared.</li>
      <li><b>Using image metrics only.</b> Temporal flicker and view inconsistency may not change per-frame FID much.</li>
    </ul>`
};
