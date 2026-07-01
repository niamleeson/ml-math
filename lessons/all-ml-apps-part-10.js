/* All ML — Part 10 applications (5 each). Loaded after content-part-10.js, before all-ml-register.js.
   Assignment is self-creating so a missing content entry (e.g. a gap topic) can't crash the file. */

/* ---- _apps-part10-A.js ---- */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["10.1"] = window.ALLML_CONTENT["10.1"] || {};
(window.ALLML_CONTENT["10.1"] = window.ALLML_CONTENT["10.1"] || {}).applications = [
  {
    title: "Image compression and denoising",
    background: "<p>An autoencoder stores an image through a bottleneck and decodes it back, so compression and denoising share the same reconstruction objective.</p>",
    numbers: "<p>For the lesson vector $x=(2,1)$ and encoder $W_e=(0.8,0.6)$, the code is $z=2\\cdot0.8+1\\cdot0.6=2.200$. With tied decoder $W_d=(0.8,0.6)$, $\\hat x=(1.760,1.320)$ and $L=\\frac12((2-1.760)^2+(1-1.320)^2)=0.0800$.</p>"
  },
  {
    title: "Anomaly screening in sensors",
    background: "<p>Sensor streams can be flagged when normal-pattern reconstructions fail, because unusual inputs tend to produce larger residuals.</p>",
    numbers: "<p>Using the lesson loss, an illustrative alert threshold $L\\gt0.50$ is more than six times the worked normal loss $0.0800$, so it would not flag the example but would flag a reconstruction with squared residual sum above $1.00$.</p>"
  },
  {
    title: "Search and recommendation embeddings",
    background: "<p>The bottleneck code can be indexed instead of the full input, giving a compact representation for nearest-neighbor search.</p>",
    numbers: "<p>The lesson compresses two raw coordinates into one latent coordinate: $(2,1)\\mapsto z=2.200$. That is a $2:1$ coordinate reduction before any downstream index is built.</p>"
  },
  {
    title: "Medical image cleanup",
    background: "<p>Image cleanup uses reconstruction loss to compare noisy inputs and denoised outputs, but clinical usefulness requires more than low pixel error.</p>",
    numbers: "<p>The lesson warning is visible numerically: the loss only sees $x-\\hat x$. A nuisance-preserving reconstruction with residuals $(0.24,-0.32)$ still gets $L=0.0800$, so low loss alone does not prove semantic cleanup.</p>"
  },
  {
    title: "Pretraining features for small classifiers",
    background: "<p>Autoencoder codes can initialize or feed a classifier when labels are scarce, because the unsupervised bottleneck has already summarized input variation.</p>",
    numbers: "<p>The reusable feature in the lesson is the scalar $z=2.200$. A classifier that consumes $z$ instead of $(2,1)$ sees one learned feature, not two raw features.</p>"
  }
];

window.ALLML_CONTENT["10.2"] = window.ALLML_CONTENT["10.2"] || {};
(window.ALLML_CONTENT["10.2"] = window.ALLML_CONTENT["10.2"] || {}).applications = [
  {
    title: "Synthetic tabular records",
    background: "<p>A VAE samples from a smooth prior and decodes plausible records, making it useful for small synthetic tabular demonstrations.</p>",
    numbers: "<p>The lesson posterior has log variance $-0.7$, so $\\sigma=\\exp(0.5\\cdot-0.7)=0.7047$. With illustrative $\\mu=0.5$ and $\\epsilon=1.2$, the sampled latent is $z=0.5+0.7047\\cdot1.2=1.346$.</p>"
  },
  {
    title: "Molecule or protein latent search",
    background: "<p>Latent search changes $z$ while the KL term keeps candidates near a decodable prior rather than arbitrary coordinates.</p>",
    numbers: "<p>For the lesson values, $D_{KL}=\\frac12(0.5^2+\\exp(-0.7)-1+0.7)=0.2233$. This is the numeric pressure that discourages wandering too far from the prior.</p>"
  },
  {
    title: "Image interpolation tools",
    background: "<p>Interpolating between nearby latent points is useful only when the VAE has paid the KL cost to make the latent space smooth.</p>",
    numbers: "<p>The lesson sample scale $0.7047$ means changing $\\epsilon$ by $1.0$ changes $z$ by $0.7047$. That gives a concrete interpolation step size in latent space.</p>"
  },
  {
    title: "Missing-data imputation",
    background: "<p>Instead of filling one deterministic value, a VAE can sample several plausible imputations from the posterior.</p>",
    numbers: "<p>Using $z=\\mu+0.7047\\epsilon$, choosing $\\epsilon=-1,0,1$ gives illustrative latents $-0.2047$, $0.5000$, and $1.2047$ around the same input.</p>"
  },
  {
    title: "Compression for latent diffusion",
    background: "<p>VAE-style latents are the compression layer used before later generative sampling systems operate in latent space.</p>",
    numbers: "<p>If the reconstruction NLL proxy is $0.42$ and the lesson KL is $0.2233$, the negative ELBO proxy is $0.42+0.2233=0.6433$, showing the reconstruction and sampling tradeoff.</p>"
  }
];

window.ALLML_CONTENT["10.3"] = window.ALLML_CONTENT["10.3"] || {};
(window.ALLML_CONTENT["10.3"] = window.ALLML_CONTENT["10.3"] || {}).applications = [
  {
    title: "Disentangled factor demos",
    background: "<p>beta-VAE demonstrations raise the price of information in the latent code to encourage simpler factors.</p>",
    numbers: "<p>With lesson values recon $0.42$, KL $0.2483$, and $\\beta=1$, the loss is $0.42+1\\cdot0.2483=0.6683$.</p>"
  },
  {
    title: "Tokenized image generation",
    background: "<p>VQ-VAE turns continuous image encodings into discrete codebook tokens that later generative models can model as symbols.</p>",
    numbers: "<p>For $z_e=(0.2,0.7)$, distance to code $(0,1)$ is $\\sqrt{0.2^2+(-0.3)^2}=0.3606$, smaller than the distance $1.063$ to $(1,0)$, so the selected token is $(0,1)$.</p>"
  },
  {
    title: "Low-bit compression",
    background: "<p>A finite codebook is a compression knob: fewer entries reduce storage but increase collisions and commitment loss.</p>",
    numbers: "<p>An illustrative codebook with 16 entries carries $\\log_2(16)=4$ bits per token. Reducing it to 2 entries carries only $1$ bit and makes collisions much more likely.</p>"
  },
  {
    title: "Controllable sliders in design tools",
    background: "<p>The beta parameter acts like an information-price slider that trades reconstruction detail against latent regularity.</p>",
    numbers: "<p>Using the lesson values with $\\beta=4$ gives $0.42+4\\cdot0.2483=1.4132$, more than double the $0.6683$ loss at $\\beta=1$.</p>"
  },
  {
    title: "Audio and image codec prototypes",
    background: "<p>VQ commitment loss measures how costly it is to snap encoder outputs to a discrete codebook.</p>",
    numbers: "<p>The lesson nearest-code residual from $(0.2,0.7)$ to $(0,1)$ has squared length $0.2^2+(-0.3)^2=0.1300$, the value a commitment term would penalize up to its weight.</p>"
  }
];

window.ALLML_CONTENT["10.4"] = window.ALLML_CONTENT["10.4"] || {};
(window.ALLML_CONTENT["10.4"] = window.ALLML_CONTENT["10.4"] || {}).applications = [
  {
    title: "Binary image patch generation",
    background: "<p>RBMs model binary visible patches with hidden causes, assigning low energy to compatible visible-hidden pairs.</p>",
    numbers: "<p>The lesson pair has $E=-0.7000$, so its unnormalized weight is $\\exp(-E)=\\exp(0.7000)=2.014$ before division by the partition function $Z$.</p>"
  },
  {
    title: "Collaborative filtering history",
    background: "<p>Binary user-item preferences naturally match RBM visible units, while hidden units represent latent taste factors.</p>",
    numbers: "<p>If two visible-hidden configurations had unnormalized weights $2.014$ and $1.000$, their normalized probabilities within just that illustrative two-state subset would be $2.014/(2.014+1.000)=0.6682$ and $0.3318$.</p>"
  },
  {
    title: "Feature pretraining for classifiers",
    background: "<p>Stacking RBMs was a historical way to initialize deep networks with hierarchical binary features.</p>",
    numbers: "<p>For hidden probability $p(h_j=1\\mid v)=\\sigma(c_j+W_{:j}^\\top v)$, an illustrative activation input $0.3$ gives $\\sigma(0.3)=0.5744$.</p>"
  },
  {
    title: "Missing-bit imputation",
    background: "<p>Gibbs updates resample hidden bits from visibles and visibles from hidden bits, letting missing binary entries be filled stochastically.</p>",
    numbers: "<p>The no-within-layer structure means each visible probability is computed independently given $h$. If a bit has probability $0.5744$, its expected imputed value over 100 draws is about $57.44$ ones.</p>"
  },
  {
    title: "Sampling diagnostics",
    background: "<p>Contrastive divergence is cheap, but short chains bias the negative phase, so chain length is a diagnostic knob.</p>",
    numbers: "<p>The notebook contrasts CD-1 with a longer tiny chain. Even without claiming exact likelihood, the lesson weight $2.014$ reminds us that unnormalized scores become probabilities only after all relevant states contribute to $Z$.</p>"
  }
];

window.ALLML_CONTENT["10.5"] = window.ALLML_CONTENT["10.5"] || {};
(window.ALLML_CONTENT["10.5"] = window.ALLML_CONTENT["10.5"] || {}).applications = [
  {
    title: "Photorealistic image synthesis prototypes",
    background: "<p>A GAN replaces explicit likelihood with a game in which a discriminator scores real and generated samples.</p>",
    numbers: "<p>If the discriminator gives a real example $D(x)=0.73$, the lesson real term is $\\log(0.73)=-0.3147$.</p>"
  },
  {
    title: "Data augmentation for rare classes",
    background: "<p>Generated examples can augment rare classes, but distribution coverage must be measured because the GAN objective itself is not a calibrated likelihood.</p>",
    numbers: "<p>For fake score $D(G(z))=0.41$, the lesson fake term is $\\log(1-0.41)=\\log(0.59)=-0.5276$.</p>"
  },
  {
    title: "Simulation-to-real visual variation",
    background: "<p>GANs can add visual variation to simulations, but evaluation should compare sample distributions rather than read the game value as probability.</p>",
    numbers: "<p>The lesson discriminator contribution is $-0.3147+(-0.5276)=-0.8423$, a game score rather than an NLL.</p>"
  },
  {
    title: "Creative asset generation",
    background: "<p>Creative generation needs diversity, not just plausible individual samples, because repeated modes reduce campaign usefulness.</p>",
    numbers: "<p>An illustrative generator that covers only 2 of 10 modes has coverage $2/10=0.20$ even if several samples receive convincing discriminator scores.</p>"
  },
  {
    title: "Privacy-preserving synthetic examples",
    background: "<p>Synthetic examples are sometimes proposed for privacy, but the lesson gives no privacy guarantee, so reporting coverage and memorization checks is required.</p>",
    numbers: "<p>If 40 generated samples contain only 5 unique nearest training prototypes, the unique-prototype ratio is $5/40=0.125$, a warning sign for memorization or collapse.</p>"
  }
];

window.ALLML_CONTENT["10.6"] = window.ALLML_CONTENT["10.6"] || {};
(window.ALLML_CONTENT["10.6"] = window.ALLML_CONTENT["10.6"] || {}).applications = [
  {
    title: "Label-controlled image generation",
    background: "<p>Conditional GANs make the requested label visible to the generator and discriminator so label mismatch can be penalized.</p>",
    numbers: "<p>If the generator receives $y$ but the discriminator sees only $x$, a 30 percent label mismatch rate is invisible to $D(x)$. With $D(x,y)$, the same $0.30$ mismatch becomes measurable.</p>"
  },
  {
    title: "Stable image GAN training",
    background: "<p>WGAN replaces a saturating classifier signal with a transport-style critic constrained to be Lipschitz.</p>",
    numbers: "<p>The lesson one-dimensional transport gap between means $0.2$ and $1.1$ is $|0.2-1.1|=0.9000$.</p>"
  },
  {
    title: "Medical and satellite image synthesis",
    background: "<p>DCGAN-style convolutions encode local stationarity, which is useful when neighboring pixels share structure.</p>",
    numbers: "<p>An illustrative $3\\times3$ convolution with 16 input channels and 32 output channels has $3\\cdot3\\cdot16\\cdot32=4608$ weights, much fewer than a dense layer over all pixels.</p>"
  },
  {
    title: "Class-balanced augmentation",
    background: "<p>Conditional generation can request underrepresented classes and report quality per class rather than hiding failures in one global score.</p>",
    numbers: "<p>If class A has distance $0.20$ and class B has distance $0.80$, the average $0.50$ hides the worse conditional failure for class B.</p>"
  },
  {
    title: "Training diagnostics dashboards",
    background: "<p>WGAN diagnostics should include clipping or gradient penalty checks, because without the constraint the critic no longer estimates Wasserstein distance.</p>",
    numbers: "<p>Clipping an illustrative critic weight from $4.0$ to $0.2$ reduces its scale by $4.0/0.2=20$, showing how unconstrained critics can inflate gaps.</p>"
  }
];

window.ALLML_CONTENT["10.7"] = window.ALLML_CONTENT["10.7"] || {};
(window.ALLML_CONTENT["10.7"] = window.ALLML_CONTENT["10.7"] || {}).applications = [
  {
    title: "Face attribute editing",
    background: "<p>Style modulation changes feature activations through continuous scale and bias controls rather than only through class labels.</p>",
    numbers: "<p>The lesson activation is $y=sx+b=1.5\\cdot2+0.4=3.400$.</p>"
  },
  {
    title: "Product image recoloring",
    background: "<p>Style vectors can steer texture or color attributes while retaining product content when the latent mapping is controlled.</p>",
    numbers: "<p>Changing only the bias from $0.4$ to $0.7$ in the lesson formula changes the activation from $3.400$ to $1.5\\cdot2+0.7=3.700$, a $0.300$ style shift.</p>"
  },
  {
    title: "Unpaired domain translation",
    background: "<p>CycleGAN supports translation when paired before-and-after examples are unavailable by requiring the translated sample to map back.</p>",
    numbers: "<p>The cycle term is $L_{cyc}=\\lVert F(G(x))-x\\rVert_1$. An illustrative return error of $0.2$ contributes exactly $0.2$ before multiplying by the cycle weight.</p>"
  },
  {
    title: "Synthetic-to-real adaptation",
    background: "<p>Cycle consistency discourages content-destroying maps that could still satisfy an adversarial target-domain critic.</p>",
    numbers: "<p>If adversarial-only drift gives return error $0.9$ and adding cycle loss gives $0.2$, the reduction is $(0.9-0.2)/0.9=0.7778$.</p>"
  },
  {
    title: "Creative filter tools",
    background: "<p>Layer-wise style controls provide useful creative biases, but they are not proof of independent semantic factors.</p>",
    numbers: "<p>For a three-layer illustrative style vector with shifts $(0.3,0.1,0.0)$, the control norm is $\\sqrt{0.3^2+0.1^2+0^2}=0.3162$.</p>"
  }
];

/* ---- _apps-part10-B.js ---- */
(window.ALLML_CONTENT["10.8"] = window.ALLML_CONTENT["10.8"] || {}).applications = [
  { title: "Model-release scorecards", background: "<p>Generative model launches need a compact realism-and-coverage check before human review. FID is useful because it compares feature means and covariances rather than individual pixels.</p>", numbers: "<p>The lesson toy has means $(0,0)$ and $(1,0.5)$ plus diagonal covariances, giving $FID=1.336$. That value is re-derived from $\\lVert m_r-m_g\\rVert^2+\\mathrm{Tr}(C_r+C_g-2(C_rC_g)^{1/2})$.</p>" },
  { title: "Sample-diversity monitoring", background: "<p>Inception Score was introduced to catch samples that are both confidently classifiable and diverse across classes. It is a monitoring signal, not a universal truth.</p>", numbers: "<p>For lesson logits $(1.2,0.3,-0.4)$, softmax gives top probability $0.6217$. Against a uniform three-class marginal, the contribution exponentiates to $IS=1.215$.</p>" },
  { title: "A/B comparison of generators", background: "<p>Teams often compare two checkpoints with FID before spending review time. The lesson warning is that finite samples and feature extractors add noise.</p>", numbers: "<p>If one run reports illustrative FID $1.336$ and another $1.330$, the gap is only $0.006$. The notebook therefore pairs the score with a bootstrap interval before treating the difference as real.</p>" },
  { title: "Mode-collapse detection", background: "<p>A collapsed generator can match the average image while losing diversity. FID's covariance term is designed to reveal that failure mode.</p>", numbers: "<p>Matching only the means would keep $\\lVert m_r-m_g\\rVert^2$ small. The full lesson formula adds $\\mathrm{Tr}(C_r+C_g-2(C_rC_g)^{1/2})$, so covariance collapse still increases the score.</p>" },
  { title: "Domain-specific generative QA", background: "<p>Medical, audio, and business-document generators should not be judged by an unrelated ImageNet classifier. The feature extractor must match the domain.</p>", numbers: "<p>The lesson's $0.6217$ top class probability is meaningful only for the classifier's label space. In the notebook, domain PCA features replace mismatched pseudo-labels for D4 and D5.</p>" }
];
(window.ALLML_CONTENT["10.9"] = window.ALLML_CONTENT["10.9"] || {}).applications = [
  { title: "Exact-likelihood anomaly detection", background: "<p>Flows are attractive for anomaly detection because each sample receives an exact density under an invertible map. Low likelihood can flag unusual records.</p>", numbers: "<p>With $x=(1.2,-0.7)$, $a=1.5$, and $t=(0.3,-0.2)$, the affine flow gives $y=(2.100,-1.250)$, exactly as the lesson computes.</p>" },
  { title: "Tabular simulation with density control", background: "<p>Invertible transforms can model tabular features while preserving a tractable likelihood. The determinant tells how the transform stretches volume.</p>", numbers: "<p>For the two-dimensional affine map, $\\log|\\det J|=2\\log(1.5)=0.8109$. The transformed log density subtracts $0.8109$ because stretching lowers probability per unit volume.</p>" },
  { title: "Invertible image compression", background: "<p>Reversible image transforms keep enough information to reconstruct the input. This is why the lesson warns against non-invertible layers.</p>", numbers: "<p>If a D5 digit feature vector is projected from 10 PCA dimensions to 5, the inverse is undefined. The notebook contrasts that invalid projection with a coupling block whose reconstruction error should be near zero.</p>" },
  { title: "Physics and simulation posteriors", background: "<p>Simulation workflows need both sampling and likelihood for posterior checks. Flows provide both when Jacobian determinants remain cheap.</p>", numbers: "<p>The same $0.8109$ determinant correction is added or subtracted every time the affine map is scored. For many coupling layers, those log-determinants sum layer by layer.</p>" },
  { title: "Audio waveform likelihood models", background: "<p>Autoregressive and flow-like audio models use invertible transformations to score waveforms and generate new samples. The core requirement is a valid inverse.</p>", numbers: "<p>The lesson's $y=(2.100,-1.250)$ can be inverted as $x=(y-t)/1.5=(1.2,-0.7)$. That exact round trip is the property the notebook checks on D5.</p>" }
];
(window.ALLML_CONTENT["10.10"] = window.ALLML_CONTENT["10.10"] || {}).applications = [
  { title: "Outlier scoring", background: "<p>Energy-based models rank states by plausibility without requiring a normalized probability at scoring time. Lower energy means more plausible under the model.</p>", numbers: "<p>For energies $(0.2,1.1,2.0)$, $Z=\\exp(-0.2)+\\exp(-1.1)+\\exp(-2.0)=1.287$. The first state's probability is $\\exp(-0.2)/1.287=0.6362$.</p>" },
  { title: "Image denoising by energy descent", background: "<p>Denoising can be framed as moving a noisy sample downhill on an energy landscape while keeping enough noise to avoid bad local minima.</p>", numbers: "<p>An illustrative Langevin update is $x_{k+1}=x_k-\\eta\\nabla E(x_k)+\\sqrt{2\\eta}\\xi$. With $\\eta=0.03$, the deterministic part moves $3\%$ of the local energy gradient per step.</p>" },
  { title: "Product configuration constraints", background: "<p>Compatibility systems can encode valid configurations as low energy and invalid combinations as high energy. The model ranks options rather than directly predicting one label.</p>", numbers: "<p>Adding the same offset to all energies changes neither $Z$-normalized probabilities nor rankings within one model. That is why the lesson warns not to compare raw energies across separately trained models.</p>" },
  { title: "Negative-sample mining", background: "<p>EBMs learn by lowering data energy and raising negative-sample energy. Weak negatives fail because the model only learns where the sampler visits.</p>", numbers: "<p>The notebook compares a 3-step weak chain with a 120-step replay-like chain. The stronger chain should expose higher-energy D5 negatives and a larger separation from real samples.</p>" },
  { title: "Bridge to score models", background: "<p>Score models inherit the local-gradient view of EBMs. Instead of normalizing $p_\\theta(x)$, they learn directions of increasing log density.</p>", numbers: "<p>From $p_\\theta(x)=\\exp(-E_\\theta(x))/Z_\\theta$, the score is $\\nabla_x\\log p_\\theta(x)=-\\nabla_xE_\\theta(x)$ because $Z_\\theta$ does not depend on $x$.</p>" }
];
(window.ALLML_CONTENT["10.11"] = window.ALLML_CONTENT["10.11"] || {}).applications = [
  { title: "Denoising image generators", background: "<p>Score models learn the vector field that points noisy samples back toward high-density data. Diffusion samplers use that field repeatedly.</p>", numbers: "<p>For $p_t(x)=\\mathcal{N}(0,0.5^2)$ and $x=-1$, the score is $-(-1)/0.25=4.000$, so the update points rightward toward the center.</p>" },
  { title: "Molecular conformation sampling", background: "<p>Generated conformations can be refined by learned gradients that point toward valid structures. The score is a direction, not a normalized probability.</p>", numbers: "<p>The lesson's opposite point $x=1$ gives score $-1/0.25=-4.000$. Equal magnitude and opposite sign show how the field pulls both tails inward.</p>" },
  { title: "Audio restoration", background: "<p>Restoring noisy audio needs scores at multiple noise levels, from heavily corrupted signals down to fine detail. Training at one level misses the path.</p>", numbers: "<p>The notebook uses a noise ladder such as $1.2,0.7,0.35,0.18$. Removing the high-noise levels is the ablation that should worsen the D5 two-sample distance.</p>" },
  { title: "Scientific inverse problems", background: "<p>Inverse problems can combine an observation constraint with score-based prior steps. Step size matters because discretized SDE updates can overshoot.</p>", numbers: "<p>If the local score magnitude is the lesson value $4.000$, a step size $0.05$ moves $0.2$ units before noise. A step size $0.5$ would move $2.0$ units and likely overshoot.</p>" },
  { title: "Diffusion pretraining diagnostics", background: "<p>Before expensive sampling, teams can test whether a score model gets simple signs and scales right. A wrong sign means denoising moves away from data.</p>", numbers: "<p>The sanity check is the lesson pair: $s(-1,0.5)=4.000$ and $s(1,0.5)=-4.000$. Any implementation that returns the same sign for both is broken.</p>" }
];
(window.ALLML_CONTENT["10.12"] = window.ALLML_CONTENT["10.12"] || {}).applications = [
  { title: "Text and image generation backbones", background: "<p>DDPMs underpin many modern generators by learning to reverse a known Gaussian noising process. The forward equation is auditable before any neural net is trained.</p>", numbers: "<p>With $x_0=2$, $\\bar\\alpha_t=0.64$, and $\\epsilon=-0.5$, the signal term is $\\sqrt{0.64}\\cdot2=1.600$.</p>" },
  { title: "Image restoration and inpainting", background: "<p>The same noising formula supports restoration tasks: corrupt an image, then learn small reverse corrections back to clean structure.</p>", numbers: "<p>The lesson noise term is $\\sqrt{0.36}\\cdot(-0.5)=-0.300$. Adding it to the signal gives the noisy value $x_t=1.300$.</p>" },
  { title: "Scientific simulation priors", background: "<p>DDPM sampling can act as a learned prior for complex simulation states. Quality comes from accumulated small corrections, not one visual step.</p>", numbers: "<p>The notebook's reverse check solves $x_0=(x_t-\\sqrt{1-\\bar\\alpha_t}\\epsilon)/\\sqrt{\\bar\\alpha_t}$. Plugging $1.300$, $-0.5$, and $0.64$ recovers $2.000$.</p>" },
  { title: "Controlled data augmentation", background: "<p>Forward noising gives a calibrated corruption knob for augmentation. Larger noise levels should be matched by the reverse model's schedule.</p>", numbers: "<p>The lesson has signal $1.600$ and noise $-0.300$, so $x_t=1.600-0.300=1.300$. Changing $\\bar\\alpha_t$ changes both coefficients.</p>" },
  { title: "Audio generation", background: "<p>Audio diffusion also depends on schedule consistency. Sampling with a different schedule than training changes the implied reverse equation.</p>", numbers: "<p>If the forward path used $\\bar\\alpha_t=0.64$ but sampling pretends a different value, the denominator $\\sqrt{\\bar\\alpha_t}$ is wrong. The notebook reproduces that D5 scale error.</p>" }
];
(window.ALLML_CONTENT["10.13"] = window.ALLML_CONTENT["10.13"] || {}).applications = [
  { title: "Prompt adherence controls", background: "<p>Classifier-free guidance gives users a knob for how strongly generation follows a prompt or label. The knob is vector extrapolation in score space.</p>", numbers: "<p>With $s_{uncond}=-0.4$ and $s_{cond}=0.9$, the difference is $1.300$. That is the direction guidance amplifies.</p>" },
  { title: "Brand-safe creative generation", background: "<p>Creative systems can increase guidance to match brand constraints, but excessive guidance can harm realism. The score formula exposes the tradeoff.</p>", numbers: "<p>At $w=3$, $s_{guided}=-0.4+3\\cdot1.3=3.500$. Because $w\\gt1$, the guided score moves beyond the conditional score.</p>" },
  { title: "Class-conditional image synthesis", background: "<p>Classifier-free guidance requires a model that knows both conditional and unconditional predictions. Unconditional dropout during training creates that ability.</p>", numbers: "<p>If dropout probability were illustratively $10\%$, about 1 in 10 training examples would teach the unconditional branch. Without those examples, $s_{uncond}$ in the formula is not learned.</p>" },
  { title: "Product photography generation", background: "<p>Comparing prompts is only fair at the same guidance scale because changing the scale changes the effective objective. The lesson calls this out as a pitfall.</p>", numbers: "<p>Using the lesson numbers, $w=1$ gives $0.9$, while $w=3$ gives $3.500$. The prompt did not change, but the score target did.</p>" },
  { title: "Audio and text conditioning", background: "<p>Guidance applies beyond images wherever a conditional and unconditional denoising prediction can be formed. High guidance remains an artifact risk.</p>", numbers: "<p>The notebook sweeps illustrative $w$ values $0,1,2,5,9$ on D5 and reports both two-sample distance and conditional-hit rate. The best setting balances both, not just hit rate.</p>" }
];

/* ---- _apps-part10-C.js ---- */
(window.ALLML_CONTENT["10.14"] = window.ALLML_CONTENT["10.14"] || {}).applications = [
  { title: "Text-to-image systems", background: "<p>Modern text-to-image stacks encode pixels into a latent, denoise the latent under text conditioning, then decode back to pixels.</p>", numbers: "<p>Using the lesson decoder, $z=(1,-1)$ and $D=\\begin{bmatrix}1&0.5\\\\0.2&1\\end{bmatrix}$ produce $\\hat{x}=D z=(0.5000,-0.8000)$.</p>" },
  { title: "Low-cost image generation", background: "<p>Latent diffusion reduces the object that the sampler must denoise, which is why compressed representations matter for interactive generation.</p>", numbers: "<p>The lesson example denoises two latent coordinates before decoding two output coordinates, so the auditable latent computation is $2$ numbers rather than a full pixel grid.</p>" },
  { title: "Creative editing", background: "<p>Prompt edits steer the denoising prediction in latent space; the text condition is not a separate magic renderer.</p>", numbers: "<p>If the latent is still $z=(1,-1)$, the conditioning must ultimately change the denoised $z_0$ before the same decoder can alter $\\hat{x}$.</p>" },
  { title: "Compression plus generation", background: "<p>Autoencoder quality sets the ceiling for generated quality because every sampled latent must pass through the decoder.</p>", numbers: "<p>The lesson latent has norm $\\lVert z\\rVert_2=\\sqrt{1^2+(-1)^2}=1.414$, a scale the diffusion schedule must respect.</p>" },
  { title: "Enterprise asset variation", background: "<p>Teams can generate asset variants from compact latents, but production thresholds should account for decoder artifacts.</p>", numbers: "<p>An illustrative review threshold could flag variants whose reconstruction error exceeds the baseline that already maps $z=(1,-1)$ to $(0.5000,-0.8000)$.</p>" }
];

(window.ALLML_CONTENT["10.15"] = window.ALLML_CONTENT["10.15"] || {}).applications = [
  { title: "Pose-guided human image generation", background: "<p>ControlNet-style branches add pose residuals to frozen generator features so pose control does not overwrite the base model.</p>", numbers: "<p>The lesson residual gives $h_{out}=(0.4,0.1)+(0.3,-0.2)=(0.7000,-0.1000)$.</p>" },
  { title: "Edge-to-image tools", background: "<p>Edges constrain spatial layout early, while the frozen model supplies learned visual detail.</p>", numbers: "<p>The residual path contributes $0.3$ to the first feature and $-0.2$ to the second, showing that control is directional rather than a scalar prompt boost.</p>" },
  { title: "Depth-guided product rendering", background: "<p>Depth maps provide geometry-like conditions, but the branch must be scaled so it guides rather than destroys features.</p>", numbers: "<p>The lesson residual magnitude is $\\sqrt{0.3^2+(-0.2)^2}=0.3606$, a concrete size for the control signal.</p>" },
  { title: "Layout-controlled ad creatives", background: "<p>Zero-like initialization lets a conditioned branch start close to the frozen generator and learn residual corrections gradually.</p>", numbers: "<p>At exact zero residual, $h_{out}=h_{base}=(0.4,0.1)$; after learning the lesson residual, it becomes $(0.7000,-0.1000)$.</p>" },
  { title: "Medical and satellite controlled synthesis", background: "<p>Structured conditions such as masks, edges, and depth have different scales and should enter layers that still preserve spatial information.</p>", numbers: "<p>If injection is delayed until only the two lesson features remain, the entire condition is compressed to a $0.3606$ residual vector.</p>" }
];

(window.ALLML_CONTENT["10.16"] = window.ALLML_CONTENT["10.16"] || {}).applications = [
  { title: "Fast image generation", background: "<p>Flow matching learns velocities along paths from noise to data, enabling fewer sampling steps than long diffusion chains.</p>", numbers: "<p>For $x_0=0$, $x_1=2$, and $t=0.3$, the lesson path gives $x_t=(1-0.3)0+0.3\\cdot2=0.6000$.</p>" },
  { title: "Video generation acceleration", background: "<p>Video systems benefit from fewer denoising steps, but large steps can amplify velocity errors across many frames.</p>", numbers: "<p>The lesson target velocity is $v=x_1-x_0=2.000$; an overly large step would multiply this error at every frame.</p>" },
  { title: "3D generation paths", background: "<p>Transport paths can connect simple latent noise to geometric or multiview data representations.</p>", numbers: "<p>With the lesson velocity $v=2.000$, moving by step size $0.1$ changes the state by $0.1\\cdot2=0.2000$.</p>" },
  { title: "Distilled diffusion samplers", background: "<p>Consistency models teach predictions at different times to agree, creating faster samplers from slower teachers.</p>", numbers: "<p>The lesson's next state is $0.6000+0.1\\cdot2=0.8000$, illustrating one consistency target after a small Euler step.</p>" },
  { title: "Scientific surrogate sampling", background: "<p>Cheap surrogate samplers are useful when each target sample is expensive, provided the path is physically meaningful.</p>", numbers: "<p>An illustrative audit can compare a model's predicted velocity to the lesson target $2.000$ and report absolute velocity error.</p>" }
];

(window.ALLML_CONTENT["10.17"] = window.ALLML_CONTENT["10.17"] || {}).applications = [
  { title: "PixelCNN image likelihood", background: "<p>Masked convolutions implement the chain rule so pixels are predicted from previous pixels only.</p>", numbers: "<p>The lesson conditionals $(0.5,0.7,0.2)$ multiply to $0.5\\cdot0.7\\cdot0.2=0.0700$.</p>" },
  { title: "WaveNet audio synthesis", background: "<p>Causal convolutions prevent future audio samples from leaking into the current prediction.</p>", numbers: "<p>If the third conditional is only $0.2$, it contributes $-\\log(0.2)=1.609$ to the sequence NLL.</p>" },
  { title: "Text and token generation", background: "<p>Token generators use the same left-to-right likelihood factorization as image and audio autoregressive models.</p>", numbers: "<p>The lesson NLL is $-\\log(0.0700)=2.659$, equal to summing $-\\log0.5-\\log0.7-\\log0.2$.</p>" },
  { title: "Compression and coding", background: "<p>Exact likelihoods translate into coding costs, so autoregressive models can be evaluated with bits or nats per dimension.</p>", numbers: "<p>The lesson sequence cost $2.659$ nats is $2.659/\\log 2=3.836$ illustrative bits for the three-symbol sequence.</p>" },
  { title: "Music and time-series sample generation", background: "<p>Sequential sampling handles temporal dependencies naturally but is slower because each new value waits for previous values.</p>", numbers: "<p>For the lesson's three conditionals, sampling requires three ordered probability evaluations before the full probability $0.0700$ is known.</p>" }
];

(window.ALLML_CONTENT["10.18"] = window.ALLML_CONTENT["10.18"] || {}).applications = [
  { title: "Artistic photo filters", background: "<p>Neural style transfer preserves content activations while matching feature correlations from an artwork or style image.</p>", numbers: "<p>For $F=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$, $G_{11}=(1^2+2^2)/2=2.500$.</p>" },
  { title: "Brand texture transfer", background: "<p>Brands can transfer texture statistics, colors, or patterns without copying exact pixel locations.</p>", numbers: "<p>The lesson cross-correlation is $G_{12}=(1\\cdot3+2\\cdot4)/2=5.500$, a style statistic rather than a pixel match.</p>" },
  { title: "Video style prototyping", background: "<p>Style prototypes need content preservation across frames; pixel-only style losses preserve locations rather than texture.</p>", numbers: "<p>The same Gram matrix has $G_{22}=(3^2+4^2)/2=12.50$, showing how channel energy contributes to style.</p>" },
  { title: "Product mockups", background: "<p>The style weight $\\beta$ controls whether the output keeps product structure or is overwhelmed by texture.</p>", numbers: "<p>The lesson combines losses as $L=\\alpha L_{content}+\\beta L_{style}$, so doubling illustrative $\\beta$ doubles the style contribution.</p>" },
  { title: "Dataset augmentation", background: "<p>Gram-style perturbations can diversify small datasets, but layer choice changes the scale of style being matched.</p>", numbers: "<p>If a layer uses the lesson $2\\times2$ feature matrix, its Gram entries are $(2.500,5.500,12.50)$ and should not be compared directly to another layer's scale.</p>" }
];

(window.ALLML_CONTENT["10.19"] = window.ALLML_CONTENT["10.19"] || {}).applications = [
  { title: "Video generation", background: "<p>Video generators need temporal latent trajectories so neighboring frames agree about motion.</p>", numbers: "<p>With $p_0=(0,0,0)$, $v=(1,0.5,0.2)$, and $t=3$, the lesson gives $p_3=(3.000,1.500,0.6000)$.</p>" },
  { title: "3D object generation", background: "<p>Shared geometry and camera projection keep generated views consistent across angles.</p>", numbers: "<p>The same 3D point at $t=3$ has coordinates $(3.000,1.500,0.6000)$ before projection, so every view should share that state.</p>" },
  { title: "Motion-controlled creative tools", background: "<p>Advertisers can control motion paths, but frame quality alone does not guarantee coherent movement.</p>", numbers: "<p>The lesson speed is $\\sqrt{1^2+0.5^2+0.2^2}=1.136$, a scalar summary of the velocity.</p>" },
  { title: "Autonomous-driving simulation", background: "<p>Simulated agents and objects require temporal consistency because flicker can break downstream perception even if individual frames look sharp.</p>", numbers: "<p>An illustrative consistency check can compare consecutive projected states from $p_t=p_0+t v$ rather than only per-frame image scores.</p>" },
  { title: "AR and VR asset generation", background: "<p>AR and VR assets rely on camera rays and depth so the same object remains stable as the viewer moves.</p>", numbers: "<p>If $t$ advances from $0$ to $3$, the lesson trajectory moves by $3v=(3.000,1.500,0.6000)$ in shared 3D space.</p>" }
];

