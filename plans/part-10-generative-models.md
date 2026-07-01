# Part 10 — Generative Models

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F9 (Generative).

### 10.1 — Autoencoders   [notebook: 10.1-autoencoders.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Image compression and denoising — encoder bottleneck for `x=(2,1)` with `W_e=(0.8,0.6)` gives lesson code `z=2.200`; reconstruction error uses `0.5||x-x_hat||^2`.
2. Anomaly screening in sensors — flag samples with high reconstruction error; threshold is illustrative, e.g. `L > 0.50` under the lesson loss.
3. Search/recommendation embeddings — store the bottleneck code instead of raw features; lesson compresses 2 input coordinates to 1 latent coordinate.
4. Medical image cleanup — compare before/after by reconstruction loss; lesson warning says low loss alone can preserve nuisance detail.
5. Pretraining features for small classifiers — reuse `z=2.200` as the learned representation; cite lesson bottleneck map rather than a production accuracy claim.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `fit_linear_autoencoder()` + verify lesson encoder `z=2.200` and reconstruction loss `0.5||x-x_hat||^2` on a 1-D gaussian toy.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: reconstruction error across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: low reconstruction loss mistaken for useful features; reproduce nuisance-preserving face reconstructions, then fix with a narrower/regularized code and feature-scale checks.
- Notes: delete copied unused template helpers/assert-only cells; CPU-only, tiny.

### 10.2 — Variational Autoencoders   [notebook: 10.2-variational-autoencoders.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Synthetic tabular records — sample from a smooth latent prior; lesson reparameterization with log variance `-0.7` gives `sigma=0.7047`.
2. Molecule/protein latent search — optimize in `z` space while keeping `D_KL(q||p)` near the prior; numbers are lesson ELBO terms, not production yields.
3. Image interpolation tools — nearby latent points should decode similarly; lesson says KL deliberately damages perfect reconstruction to make sampling reliable.
4. Missing-data imputation — sample multiple plausible reconstructions; illustrative uncertainty uses `z=mu+0.7047*epsilon` from the lesson.
5. Compression for latent diffusion — VAE-style latents feed later text-to-image systems; cite lesson tradeoff between reconstruction and KL.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `vae_elbo()` + verify `sigma=exp(0.5*-0.7)=0.7047`, reparameterization, and ELBO reconstruction-minus-KL on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: reconstruction error plus reported KL, summarized as ELBO/NLL proxy across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: KL collapse to zero; reproduce a decoder ignoring `z`, then fix with KL warmup/free-bits and show nonzero latent use.
- Notes: delete dead template code; CPU-only, tiny.

### 10.3 — VAE variants (beta-VAE, VQ-VAE)   [notebook: 10.3-vae-variants-beta-vae-vq-vae.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Disentangled factor demos — beta-VAE raises latent pressure; lesson `recon=0.42`, `KL=0.2483`, `beta=1` gives `L=0.6683`.
2. Tokenized image generation — VQ-VAE maps continuous encodings to nearest codebook entries; nearest-neighbor distances are illustrative and re-derived in the notebook.
3. Low-bit compression — discrete codes replace dense latents; codebook size is a concrete knob, with too-small codebooks causing lesson code collisions.
4. Controllable sliders in design tools — beta changes information price; lesson `beta=4` gives `0.42+4*0.2483=1.4132`.
5. Audio/image codec prototypes — VQ commitment loss tracks quantization quality; cite lesson warning that small codebooks raise commitment loss.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `beta_vae_or_vq_loss()` + verify `L=0.6683` at `beta=1` and `L=1.4132` at `beta=4` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: reconstruction error across all rungs, with KL or quantization commitment as a secondary trace
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: beta too high erases information / codebook too small causes collisions; reproduce blurry or repeated faces, then fix by reducing beta or enlarging the codebook.
- Notes: delete dead template helpers; CPU-only, tiny.

### 10.4 — Restricted Boltzmann Machines & Deep Belief Nets   [notebook: 10.4-restricted-boltzmann-machines-deep-belief-nets.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Binary image patch generation — RBM energy ranks visible-hidden pairs; lesson example has `E=-0.7000` and unnormalized weight `exp(0.7000)=2.014`.
2. Collaborative filtering history — binary user/item preferences map naturally to visible units; probabilities still require the partition function `Z`.
3. Feature pretraining for classifiers — stacked energies become hierarchical latent features; improvement numbers are not in lesson, so notebook keeps them illustrative.
4. Missing-bit imputation — Gibbs updates resample hidden/visible bits; lesson factorization relies on no within-layer edges.
5. Sampling diagnostics — contrastive divergence chain length is concrete; lesson warns short chains bias the negative phase.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `rbm_energy_and_gibbs()` + verify `E=-0.7000`, unnormalized weight `2.014`, and partition-normalized probabilities on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: NLL proxy / reconstruction error from one-step Gibbs across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: short contrastive-divergence chains treated as exact maximum likelihood; reproduce biased face samples, then fix with longer tiny chains and negative-phase diagnostics.
- Notes: delete dead template code; CPU-only, tiny.

### 10.5 — Generative Adversarial Networks   [notebook: 10.5-generative-adversarial-networks.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Photorealistic image synthesis prototypes — discriminator real score `D(x)=0.73` gives lesson term `log(0.73)=-0.3147`.
2. Data augmentation for rare classes — fake score `D(G(z))=0.41` gives `log(1-0.41)=log(0.59)=-0.5276`.
3. Simulation-to-real visual variation — use two-sample distance, not GAN loss as likelihood; lesson warns game values are not calibrated probabilities.
4. Creative asset generation — coverage matters; lesson pitfall is mode collapse where a few modes can still fool `D`.
5. Privacy-preserving synthetic examples — report distribution coverage; any privacy threshold is illustrative because lesson gives no privacy guarantee.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `tiny_gan_game()` + verify lesson minimax terms `log(0.73)=-0.3147` and `log(0.59)=-0.5276` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: 2-sample distance across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: mode collapse; reproduce repeated face-like samples, then fix with minibatch diversity/noise or WGAN-style regularization.
- Notes: simulate with small NumPy/sklearn critics where possible; delete dead template code; CPU-only, tiny.

### 10.6 — GAN variants (DCGAN, WGAN, conditional)   [notebook: 10.6-gan-variants-dcgan-wgan-conditional.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Label-controlled image generation — conditional `G(z,y)` targets a requested class; if `D` cannot see `y`, lesson says label mismatch is unpenalized.
2. Stable image GAN training — WGAN transport gap for 1-D means `0.2` and `1.1` is `|0.2-1.1|=0.9000`.
3. Medical/satellite image synthesis — DCGAN convolutions encode local stationarity; numbers are illustrative small-kernel counts in notebook.
4. Class-balanced augmentation — condition on class labels; report one 2-sample distance per class rather than one global loss.
5. Training diagnostics dashboards — Lipschitz penalty/clipping is a concrete knob; lesson says without it the critic no longer estimates Wasserstein distance.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `conditional_wgan_toy()` + verify lesson transport gap `0.9000` and show conditioning enters both `G(z,y)` and `D(x,y)`.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: 2-sample distance across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: missing Lipschitz constraint or conditioning only the generator; reproduce unstable/mislabeled faces, then fix with clipping/gradient penalty and conditional discriminator input.
- Notes: tiny CPU WGAN/conditional simulation; delete dead template code.

### 10.7 — StyleGAN & CycleGAN   [notebook: 10.7-stylegan-cyclegan.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Face attribute editing — style modulation `y=s*x+b` with `x=2`, `s=1.5`, `b=0.4` gives lesson activation `3.400`.
2. Product image recoloring — continuous style vectors steer texture, not just labels; lesson says style control is not proof of factors.
3. Unpaired domain translation — CycleGAN uses `L_cyc=||F(G(x))-x||_1`; an illustrative return error of `0.2` is directly re-derived.
4. Synthetic-to-real adaptation — cycle loss prevents content-destroying maps; lesson says adversarial alone permits many wrong translations.
5. Creative filter tools — layer-wise controls provide useful biases; no external disentanglement number is claimed.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `style_mod_and_cycle_loss()` + verify `1.5*2+0.4=3.400` and an L1 cycle-consistency calculation on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: reconstruction/cycle-consistency error across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: dropping cycle loss in unpaired translation; reproduce identity/content drift on faces, then fix by adding cycle consistency.
- Notes: use toy style transforms, not GPU StyleGAN; delete dead template code; CPU-only.

### 10.8 — GAN evaluation (FID, Inception Score)   [notebook: 10.8-gan-evaluation-fid-inception-score.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Model-release scorecards — FID compares feature means/covariances; lesson toy FID is `1.336`.
2. Sample-diversity monitoring — Inception Score uses `exp(E KL(p(y|x)||p(y)))`; classifier-domain mismatch invalidates it.
3. A/B comparison of generators — a small FID difference is not absolute truth; lesson cites finite-sample and feature-extractor noise.
4. Mode-collapse detection — matching means alone misses covariance/diversity; lesson says forgetting covariance is a pitfall.
5. Domain-specific generative QA — replace Inception features for non-ImageNet domains; any threshold is illustrative.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `fid_and_is()` + verify lesson toy FID `1.336` and a small softmax/KL Inception Score calculation on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: 2-sample distance, using FID-style feature distance across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: using IS on an unrelated classifier or over-reading tiny FID differences; reproduce a misleading score, then fix with domain features and bootstrap error bars.
- Notes: delete dead template code; CPU-only, tiny.

### 10.9 — Normalizing flows   [notebook: 10.9-normalizing-flows.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Exact-likelihood anomaly detection — affine flow with `x=(1.2,-0.7)`, `a=1.5`, `t=(0.3,-0.2)` gives `y=(2.100,-1.250)`.
2. Density estimation for tabular simulation — lesson log determinant is `2*log(1.5)=0.8109`, which directly adjusts log density.
3. Invertible image compression — use reversible transforms; lesson warns non-invertible layers break change of variables.
4. Physics/simulation posteriors — exact density enables NLL comparisons, but determinant cost is the computational bottleneck.
5. Audio waveform likelihood models — sampling and scoring use the same invertible map; any speed number is illustrative.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `affine_flow_logprob()` + verify `y=(2.100,-1.250)` and `log|det J|=0.8109` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: NLL across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: using non-invertible layers or ignoring `|det J|`; reproduce invalid face likelihoods, then fix with invertible affine/coupling blocks and determinant checks.
- Notes: small NumPy/sklearn flow only; delete dead template code; CPU-only.

### 10.10 — Energy-based models   [notebook: 10.10-energy-based-models.ipynb]   (family: F9, gap)

**Lesson — Real World Applications (5):**
1. Outlier scoring — energy values rank plausibility; lesson energies `(0.2,1.1,2.0)` give `Z=1.287` and first-state probability `0.6362`.
2. Image denoising by gradient steps — move samples downhill in energy; step size is illustrative and shown in notebook.
3. Product configuration constraints — low energy encodes compatible combinations; lesson warns arbitrary offsets block cross-model comparisons.
4. Negative-sample mining — train by raising energy on sampled negatives; lesson says weak negatives teach only where the sampler visits.
5. Score-model bridge — EBMs connect to gradients of log density in 10.11; cite lesson unnormalized `p_theta(x)=exp(-E)/Z`.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `energy_to_probability_and_sampler()` + verify `Z=1.287` and `p(first)=0.6362` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: NLL proxy / energy-ranked 2-sample distance across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: weak negative samples; reproduce faces with low energy only near visited negatives, then fix with replay/stronger Langevin negatives.
- Notes: gap topic; lesson body may need authoring before notebook can cite beyond the existing thin content; delete dead template code; CPU-only.

### 10.11 — Score-based models & SDEs   [notebook: 10.11-score-based-models-sdes.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Denoising image generators — score points toward higher density; lesson `sigma=0.5`, `x=-1` gives score `4.000`.
2. Molecular conformation sampling — learned gradients move noisy states toward valid structures; probabilities are not directly normalized.
3. Audio restoration — multi-noise-level scores define the path back to clean data; single-level training is a lesson pitfall.
4. Scientific inverse problems — SDE steps refine noisy observations; step sizes are illustrative and must avoid overshoot.
5. Diffusion pretraining diagnostics — compare score signs: lesson `x=1` gives score `-4.000` under `N(0,0.25)`.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `gaussian_score_and_langevin()` + verify scores `4.000` at `x=-1` and `-4.000` at `x=1` for `sigma=0.5`.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: 2-sample distance across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: training at one noise level only or sampling with too-large steps; reproduce overshot face samples, then fix with a noise ladder and smaller predictor-corrector steps.
- Notes: tiny score field, no SDE solver dependency unless already present; delete dead template code.

### 10.12 — Diffusion models (DDPM)   [notebook: 10.12-diffusion-models-ddpm.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Text/image generation backbones — forward noising with `x0=2`, `alpha_bar=0.64`, `epsilon=-0.5` gives signal `1.600`.
2. Image restoration/inpainting — same formula adds noise then learns reverse corrections; noise term is `sqrt(0.36)*(-0.5)=-0.300`.
3. Scientific simulation priors — sample by many small denoising steps; lesson says quality comes from accumulated corrections.
4. Data augmentation with controlled corruption — resulting noisy value is `x_t=1.600-0.300=1.300` in the lesson toy.
5. Audio generation — schedule consistency matters; changing sampling `alpha_bar` without retraining is a named pitfall.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `ddpm_forward_reverse_toy()` + verify signal `1.600`, noise `-0.300`, and `x_t=1.300` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: reconstruction/denoising error across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: inconsistent schedule or wrong prediction target; reproduce poor face denoising, then fix by matching the training/sampling `alpha_bar` path and target scaling.
- Notes: simulate DDPM with tiny arrays, no GPU; delete dead template code.

### 10.13 — Classifier-free guidance   [notebook: 10.13-classifier-free-guidance.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Prompt adherence controls in text-to-image — lesson `s_uncond=-0.4`, `s_cond=0.9` gives difference `1.300`.
2. Brand-safe creative generation — guidance scale trades prompt fidelity and realism; with `w=3`, guided score is `3.500`.
3. Class-conditional image synthesis — train with unconditional dropout; lesson says without it the model lacks both predictions.
4. Product photography generation — compare prompts at the same `w`; lesson says changing `w` changes the effective objective.
5. Audio/text conditioning — high guidance is illustrative risk; lesson warning is leaving the data manifold and creating artifacts.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `cfg_mix_scores()` + verify `s_guided=-0.4+3*(1.3)=3.500` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: 2-sample distance across all rungs, with conditional-hit rate as a displayed auxiliary value
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: guidance too high; reproduce artifact-like face samples, then fix by sweeping `w` and selecting the best realism/condition tradeoff.
- Notes: tiny conditional score simulation; delete dead template code.

### 10.14 — Latent diffusion & text-to-image   [notebook: 10.14-latent-diffusion-text-to-image.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Text-to-image systems — encoder maps pixels to latents, diffusion samples `z_T -> z_0`, decoder returns images; lesson decoder gives `x_hat=(0.5000,-0.8000)`.
2. Low-cost image generation — latent dimension is smaller than pixels; lesson example decodes 2 latent numbers into 2 output numbers for inspection.
3. Creative editing — text conditioning acts through the denoising prediction, not magic; cite lesson pitfall.
4. Image compression plus generation — latent norm for `z=(1,-1)` is `sqrt(2)=1.414` before decoding.
5. Enterprise asset variation — generated quality is capped by autoencoder artifacts; any business threshold is illustrative.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `latent_autoencoder_plus_denoise()` + verify lesson decode `z=(1,-1) -> x_hat=(0.5000,-0.8000)` and latent norm `1.414`.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: reconstruction/denoising error across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: weak autoencoder or changed latent scale; reproduce artifact-ceiling faces, then fix by calibrating/scaling the latent and improving tiny autoencoder reconstruction.
- Notes: use PCA/tiny autoencoder latent diffusion simulation; delete dead template code; CPU-only.

### 10.15 — ControlNet & conditioning   [notebook: 10.15-controlnet-conditioning.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Pose-guided human image generation — residual conditioning adds to frozen features; lesson `h_base=(0.4,0.1)` plus `r=(0.3,-0.2)` gives `(0.7000,-0.1000)`.
2. Edge-to-image tools — edges constrain spatial layout; condition type changes which layers/scales matter.
3. Depth-guided product rendering — residual magnitude `sqrt(0.3^2+(-0.2)^2)=0.3606` is re-derived from lesson numbers.
4. Layout-controlled ad creatives — zero-like initialization prevents immediate disruption of the base generator.
5. Medical/satellite controlled synthesis — inject condition early enough; lesson says late injection loses spatial structure.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `residual_conditioned_generator()` + verify `h_out=(0.7000,-0.1000)` and residual norm `0.3606` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: reconstruction/control error across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: injecting condition too late or without zero-like initialization; reproduce uncontrolled faces, then fix with early residual conditioning initialized near zero.
- Notes: simulate ControlNet residual branch, no diffusion GPU; delete dead template code.

### 10.16 — Consistency & flow-matching models   [notebook: 10.16-consistency-flow-matching-models.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Fast image generation — flow matching learns a velocity along a path; lesson `x0=0`, `x1=2`, `t=0.3` gives `x_t=0.6000`.
2. Video generation acceleration — fewer larger steps reduce cost; lesson warns one-step sampling amplifies approximation error.
3. 3D generation paths — learned transport connects noise to data; target velocity in lesson is `v=2.000`.
4. Distilled diffusion samplers — consistency means predictions agree across time; exact speedup numbers are illustrative.
5. Scientific surrogate sampling — one Euler step of size `0.1` gives lesson `0.6000+0.1*2=0.8000`.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `flow_matching_path_and_step()` + verify `x_t=0.6000`, `v=2.000`, and next step `0.8000` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: 2-sample distance across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: poor path choice or too-large one-step sampling; reproduce distorted faces, then fix with a smoother path and smaller multi-step integration.
- Notes: tiny flow-field simulation; delete dead template code.

### 10.17 — Autoregressive generation (PixelCNN, WaveNet)   [notebook: 10.17-autoregressive-generation-pixelcnn-wavenet.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. PixelCNN image likelihood — chain rule multiplies conditionals; lesson probabilities `(0.5,0.7,0.2)` give sequence probability `0.0700`.
2. WaveNet audio synthesis — causal masks prevent future leakage; lesson says seeing `x_{>i}` invalidates likelihood.
3. Text/token generation — NLL from the lesson example is `-log(0.0700)=2.659`.
4. Compression/coding — exact likelihood supports bits-per-dimension; any bit threshold is illustrative from NLL.
5. Music/time-series sample generation — sampling is sequential and slow; lesson warns exact likelihood comes with generation cost.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `autoregressive_logprob_and_sample()` + verify `0.5*0.7*0.2=0.0700` and NLL `2.659` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: NLL across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: leaking future pixels/samples; reproduce artificially low face NLL with leakage, then fix masked/causal conditioning.
- Notes: use raster-order tiny arrays, not heavy PixelCNN/WaveNet; delete dead template code.

### 10.18 — Neural style transfer   [notebook: 10.18-neural-style-transfer.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Artistic photo filters — Gram style matrix for `F=[[1,2],[3,4]]` gives lesson `G_11=(1^2+2^2)/2=2.500`.
2. Brand texture transfer — cross-correlation `G_12=(1*3+2*4)/2=5.500` captures style statistics.
3. Video style prototyping — content loss preserves structure; lesson warns pixel loss preserves location rather than texture.
4. Product mockups — style weight `beta` is a concrete knob; too high overwhelms content activations.
5. Dataset augmentation — layer choice changes style scale; lesson says mismatched layers are not comparable.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `gram_style_loss()` + verify `G_11=2.500`, `G_12=5.500`, and `L=alpha L_content+beta L_style` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: reconstruction/content-plus-style error across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: setting `beta` too high or using pixel loss for style; reproduce content-washed faces, then fix by balancing content and Gram-style losses.
- Notes: use small feature matrices/PCA features instead of pretrained CNN downloads; delete dead template code; CPU-only.

### 10.19 — Video & 3D generation   [notebook: 10.19-video-3d-generation.ipynb]   (family: F9)

**Lesson — Real World Applications (5):**
1. Video generation — temporal model `p_t=p_0+t v` with `p0=(0,0,0)`, `v=(1,0.5,0.2)`, `t=3` gives `p3=(3.000,1.500,0.6000)`.
2. 3D object generation — shared geometry/camera projections keep views consistent; lesson warns independent images can look inconsistent.
3. Motion-controlled creative tools — speed from lesson velocity is `sqrt(1^2+0.5^2+0.2^2)=1.136`.
4. Autonomous-driving simulation — per-frame quality is insufficient; temporal flicker may not change per-frame FID.
5. AR/VR asset generation — camera rays/depth constrain views; any frame-count budget is illustrative because lesson gives the geometry formula, not production scale.

**Notebook plan:**
- Family: F9 Generative
- Concept built once (D1): `temporal_geometric_generator()` + verify `p3=(3.000,1.500,0.6000)` and speed `1.136` on D1.
- Datasets D1–D5: D1 1-D gaussian · D2 2-D two-moons · D3 mixture · D4 sklearn digits · D5 faces (Olivetti) — all subsampled/tiny, CPU
- Metric: reconstruction/consistency error across all rungs
- Closing viz: (a) generated-sample panels per rung (b) metric-vs-complexity curve
- Pitfall on D5: optimizing frame quality alone or ignoring camera geometry; reproduce flickering/inconsistent face panels, then fix with temporal/geometric consistency loss.
- Notes: simulate video/3D as tiny transformed image sequences, no GPU; delete dead template code.
