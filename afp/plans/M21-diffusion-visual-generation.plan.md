# Module Plan — M21 · Diffusion & visual generation

| Field | Value |
|---|---|
| Domain | Domain 4 · Applied LLMs / GenAI |
| Skip if you can already… | explain how a conditioned diffusion model generates an image/video |
| Maps to (projects) | Creative Intelligence |
| Primary structure(s) | S1 Model |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
Diffusion models generate by learning to reverse a gradual noising process. This module keeps the
real math because it is central: first the forward schedule and denoising target, then conditioning,
guidance, latent diffusion, and the text-to-image/video pipeline.

- M21.1 · Forward & reverse diffusion
- M21.2 · Conditioning, guidance & latent/text-to-image

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is the forward noising process, and how does the schedule ᾱ_t control it? → M21.1
- What does the reverse denoising model predict? → M21.1
- How do you compute a forward-noised sample by hand? → M21.1
- How do conditioning and classifier-free guidance steer generation? → M21.2
- What is latent diffusion, and why generate in latent space? → M21.2
- How does text-to-image or text-to-video generation work end-to-end? → M21.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Forward noising q(x_t | x_0), beta/alpha schedule, cumulative ᾱ_t **ƒ**
- Reparameterized noised sample x_t = sqrt(ᾱ_t)x_0 + sqrt(1-ᾱ_t)ε **ƒ**
- Reverse denoiser; predicting noise ε_θ(x_t, t, c) **ƒ**; sampling loop
- Conditioning: text/image/video/context conditioning; cross-attention; unconditional branch
- Classifier-free guidance (CFG) **ƒ**; guidance scale and quality/diversity tradeoff
- Latent diffusion: VAE encoder/decoder, denoise in compressed latent space
- Text-to-image/video pipeline; temporal consistency for video; diffusion transformers (DiT)

## Sub-lessons

### M21.1 · Forward & reverse diffusion  —  [S1 Model, ⚑]
- **Makes answerable:** the forward noising process; schedule ᾱ_t; what the reverse denoiser predicts; a forward-noised sample by hand.
- **You'll be able to say:** "The forward process gradually corrupts data with Gaussian noise: x_t is a mixture of the clean sample x_0 and random ε, weighted by cumulative ᾱ_t. Training usually asks a denoiser to predict the injected noise ε from x_t and timestep t. Sampling starts from noise and repeatedly applies the learned reverse denoising steps."
- **Concepts:** q(x_t | x_0) **ƒ**; beta/alpha/ᾱ schedule **ƒ**; x_t reparameterization **ƒ**; denoiser predicts ε **ƒ**.
- **Key Idea focus:** formulation + when to use diffusion: high-quality generation when iterative denoising cost is acceptable and controllability/quality matter.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced. Compute ᾱ_t, add noise to 1-D/2-D points, inspect how signal-to-noise falls, then sketch reverse denoising.
- **Notebook:** Yes — 1-D/2-D toy forward+reverse diffusion in numpy; add Gaussian noise over timesteps, show the ᾱ schedule, denoise a toy distribution with a simple learned/analytic score-like predictor; `assert` variance/noise level increases with t. Break case = too aggressive beta schedule that destroys signal in very few steps.
- **Real numbers to cite:** if x_0=2.0, ᾱ_t=0.64, and ε=-0.5, then x_t=sqrt(0.64)·2 + sqrt(0.36)·(-0.5)=1.3; this is a hand-checkable forward-noised sample.

### M21.2 · Conditioning, guidance & latent/text-to-image  —  [S1 Model, ⚑]
- **Makes answerable:** conditioning + classifier-free guidance; latent diffusion and why latent space; text-to-image/video end-to-end.
- **You'll be able to say:** "Conditioning feeds the denoiser extra information such as a text embedding; classifier-free guidance combines conditional and unconditional denoising predictions to push samples toward the prompt. Latent diffusion first encodes images to a smaller latent grid, denoises there for speed/memory, then decodes to pixels. Text-to-image runs text encoder → latent denoising loop with guidance → decoder; video adds temporal dimensions/constraints so frames stay coherent."
- **Concepts:** conditioning, cross-attention, CFG **ƒ**, guidance scale, latent diffusion, VAE latent space, text-to-image/video pipeline, DiT/video diffusion.
- **Key Idea focus:** model wiring: where text enters, why unconditional predictions are trained, and why latent space makes high-resolution generation practical.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced. Compare unconditional vs conditional denoising vectors, sweep guidance scale, then place VAE/text encoder/denoiser/decoder in the end-to-end pipeline.
- **Notebook:** No separate image-model notebook; extend M21.1 with a toy conditional 2-D Gaussian and CFG-style vector interpolation if desired. Do not download image/video models.
- **Real numbers to cite:** CFG often written ε_guided = ε_uncond + s(ε_cond - ε_uncond); with ε_uncond=0.4, ε_cond=0.1, s=7, ε_guided=-1.7, showing how high guidance can overshoot.

## Coverage check
All 6 module questions are answered: forward schedule, reverse denoiser, and hand noising → M21.1; conditioning, CFG, latent diffusion, and text-to-image/video → M21.2. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Generation choice | Pick when | Watch out |
|---|---|---|
| Pixel-space diffusion | Teaching the core process or low-resolution data | Expensive at high resolution |
| Latent diffusion | High-resolution image generation with practical compute | VAE bottleneck can lose fine details |
| High CFG scale | Prompt adherence is more important than diversity | Oversaturation/artifacts/mode collapse |
| Lower CFG scale | Diversity and realism matter | Weaker prompt adherence |
| Video diffusion | Need generated motion over time | Temporal consistency and compute cost dominate |

## Resources (from the guide)
- Lil'Log — What are Diffusion Models? (forward/reverse process math)
- HuggingFace — Diffusion Models course (DDPM/DDIM in code)
- fast.ai — Stable Diffusion (latent diffusion, guidance)

## SOTA papers (from the guide)
- DDPM (Ho et al., 2020)
- Latent / Stable Diffusion (Rombach et al., 2022)
- Classifier-Free Guidance (Ho & Salimans, 2022)
- DiT (Peebles & Xie, 2023)
- Video Diffusion Models (Ho et al., 2022)
- Sora technical report (OpenAI, 2024)

## Notes / caveats
- This module has genuine central math; keep the diffusion formulas and hand computation.
- The notebook must be CPU-first and toy/numpy only. Do not download Stable Diffusion, video models, or image checkpoints.
- Keep video discussion conceptual: extend the same denoising idea to time/space tokens and temporal consistency rather than trying to reproduce Sora.
