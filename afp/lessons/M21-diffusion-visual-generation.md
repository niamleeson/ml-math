# M21 · Diffusion & visual generation
> **Domain:** Domain 4 · Applied LLMs / GenAI · **Maps to:** Creative Intelligence · **Skip if you can already…** explain how a conditioned diffusion model generates an image/video.

## Overview

Diffusion models generate images and video by learning to undo noise. Training starts with real data and gradually corrupts it; generation starts from noise and repeatedly denoises. That simple reversal is why the math is central here: the forward noising equation tells you what the model is trained to predict, and classifier-free guidance tells you how text conditioning steers the sample.

For Creative Intelligence, this is the mental model behind text-to-image mockups, visual variant generation, storyboard/video generation, and creative editing tools. You do not need to run a giant image model to understand the mechanism: understand what gets noised, what the denoiser predicts, where the prompt enters, and why guidance trades diversity for prompt adherence.

**By the end you can answer:**
- What is the forward noising process, and how does the schedule $\bar\alpha_t$ control it?
- What does the reverse denoising model predict?
- How do you compute a forward-noised sample by hand?
- How do conditioning and classifier-free guidance steer generation?
- What is latent diffusion, and why generate in latent space?
- How does text-to-image or text-to-video generation work end-to-end?

Two sub-lessons:

- **M21.1 Forward & reverse diffusion** — the noise schedule and denoising target.
- **M21.2 Conditioning, guidance & latent/text-to-image** — text control, CFG, latent diffusion, and video.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M21-diffusion.ipynb" target="_blank" rel="noopener">▶ Open the runnable diffusion notebook (forward/reverse denoising, a tiny trained denoiser, conditioning, and classifier-free guidance) in Google Colab</a></p>

---

## M21.1 · Forward & reverse diffusion

**The idea.** The forward process gradually corrupts a clean sample $x_0$ into a noisy sample $x_t$.

**Everyday analogy.** Imagine starting with a clear photo and adding a little TV static again and again until only noise remains. That is the forward process: the photo is $x_0$, each static layer is injected noise, and the noise schedule controls how fast the picture disappears. Generation runs the movie backward: start from static and repeatedly wipe away the predicted noise until a picture emerges.

**Forward vs reverse, concretely.**

- **Forward diffusion:** during training, take a clean Creative Intelligence product image latent $x_0$ and inject known Gaussian noise at timestep $t$ to create $x_t$. Example: with $\bar\alpha_t=0.64$, the training row is still recognizably the original concept but partially corrupted, and the model is told the exact noise $\epsilon$ that was added.
- **Reverse diffusion:** during generation, start from random latent noise $x_T$ and repeatedly ask the denoiser what noise to remove. Example: for a prompt like "minimalist laptop ad, blue gradient," each reverse step makes the latent less like static and more like a coherent blue-background product mockup.

A variance schedule chooses small noise levels $\beta_1,\ldots,\beta_T$, with

$$\alpha_t = 1-\beta_t, \qquad \bar\alpha_t = \prod_{s=1}^t \alpha_s.$$

The closed-form forward noising distribution is

$$q(x_t\mid x_0) = \mathcal{N}\left(\sqrt{\bar\alpha_t}x_0,\ (1-\bar\alpha_t)I\right),$$

which can be sampled as

$$x_t = \sqrt{\bar\alpha_t}x_0 + \sqrt{1-\bar\alpha_t}\epsilon, \qquad \epsilon\sim\mathcal{N}(0,I).$$

So $\bar\alpha_t$ controls the remaining signal. If $\bar\alpha_t$ is near 1, $x_t$ mostly looks like $x_0$. If $\bar\alpha_t$ is near 0, $x_t$ is mostly noise.

**Hand computation.** If $x_0=2.0$, $\bar\alpha_t=0.64$, and $\epsilon=-0.5$:

$$x_t = \sqrt{0.64}\cdot2.0 + \sqrt{0.36}\cdot(-0.5) = 0.8\cdot2.0 + 0.6\cdot(-0.5)=1.3.$$

That is the training input at timestep $t$: a partially corrupted version of a clean data point, plus the known noise that was injected.

**What the reverse model predicts.** The denoiser is trained to infer the noise from the noisy sample and timestep, often with conditioning $c$ added later:

$$\epsilon_\theta(x_t,t) \approx \epsilon.$$

The training loss is commonly a noise-prediction mean squared error:

$$L = \lVert \epsilon - \epsilon_\theta(x_t,t) \rVert^2.$$

At generation time, sampling starts from random noise $x_T$ and steps backward. At each step, the model estimates the noise component, removes part of it, and produces a slightly cleaner sample. After many steps, noise becomes an image-like sample.

```python
# Toy diffusion sampling shape, not a production scheduler.
x = normal_noise(shape=image_latent_shape)
for t in reversed(range(T)):
    eps_hat = denoiser(x, timestep=t)
    x = scheduler_step_remove_noise(x, eps_hat, t)
image = decode_if_latent(x)
```

**Worked example — schedule too aggressive vs usable.** Imagine a 2-D point representing a simple creative thumbnail embedding. With a gentle schedule, early timesteps preserve structure: points from the same visual style remain near each other, just blurrier. With an aggressive schedule, $\bar\alpha_t$ collapses toward 0 in a few steps, destroying signal almost immediately. The model then receives inputs that are nearly pure noise for too much of training and has a harder denoising task.

A useful diagnostic is monotonic noise level:

```python
alpha_bar = cumulative_product(1 - beta)
assert alpha_bar[0] > alpha_bar[-1]
assert (1 - alpha_bar[10]) < (1 - alpha_bar[900])
```

Use diffusion when high-quality visual generation and controllability are worth iterative sampling cost. For low-latency classification or retrieval, a discriminative model is the wrong tool.

**You'll be able to say:** *"The forward process gradually corrupts data with Gaussian noise: $x_t$ is a mixture of the clean sample $x_0$ and random $\epsilon$, weighted by cumulative $\bar\alpha_t$. Training usually asks a denoiser to predict the injected noise $\epsilon$ from $x_t$ and timestep $t$. Sampling starts from noise and repeatedly applies learned reverse denoising steps."*

---

## M21.2 · Conditioning, guidance & latent/text-to-image

**The idea.** Unconditional diffusion learns to generate plausible samples. Creative tools need controlled samples: "a professional product image with blue background," "make this ad video more energetic," or "generate variants that keep the brand colors." Conditioning gives the denoiser extra information $c$, such as a text embedding, image embedding, mask, layout, or video context.

**Everyday analogy.** Think of a sketch artist slowly turning a smudged page into a finished drawing. Conditioning is the description you give them — "blue background, premium lighting, keep the laptop centered" — while guidance strength is how literally they obey it. Low guidance lets the artist improvise; high guidance pushes hard toward the prompt but can make the result stiff or unnatural.

$$\epsilon_\theta(x_t,t,c).$$

In text-to-image systems, a text encoder converts the prompt into embeddings. The denoiser uses those embeddings, often through cross-attention, while predicting noise. The prompt does not directly paint pixels; it changes the denoising vector at each step.

**Classifier-free guidance.** During training, the model sometimes sees the real condition and sometimes sees an empty condition. At sampling time, it can produce both a conditional and unconditional noise estimate:

- $\epsilon_{\text{cond}}$: denoising direction with the prompt;
- $\epsilon_{\text{uncond}}$: denoising direction without the prompt.

Classifier-free guidance combines them:

$$\hat\epsilon = \epsilon_{\text{uncond}} + w(\epsilon_{\text{cond}} - \epsilon_{\text{uncond}}).$$

The guidance scale $w$ controls prompt strength. With $\epsilon_{\text{uncond}}=0.4$, $\epsilon_{\text{cond}}=0.1$, and $w=7$:

$$\hat\epsilon = 0.4 + 7(0.1-0.4) = -1.7.$$

That shows both the power and danger of guidance: high $w$ can strongly push toward the prompt, but it can overshoot, producing artifacts, oversaturation, or lower diversity.

**Guidance levels, concretely.**

- **Low guidance scale:** with $w=1$ for "blue gradient, no text," the model nudges toward the prompt but still explores; one output may keep the laptop composition but use a gray background or add faint text-like marks. Use it when visual diversity and realism matter more than exact prompt obedience.
- **High guidance scale:** with $w=15$, the same prompt is enforced aggressively; outputs are more likely to be blue and text-free, but the gradient may become oversaturated and several variants may look nearly identical. Use it when prompt adherence matters, then watch for artifacts and mode collapse.

**Latent diffusion.** Pixel-space diffusion denoises full images. High-resolution pixels are expensive, so latent diffusion uses an autoencoder:

1. VAE encoder maps image $x$ to a smaller latent $z$.
2. Diffusion noising and denoising happen in latent space.
3. VAE decoder maps the final latent back to pixels.

This is why high-resolution generation becomes practical: the denoiser works on a compressed grid rather than every pixel. The tradeoff is that the VAE bottleneck can lose fine details or introduce reconstruction artifacts.

**Text-to-image pipeline.**

```python
prompt = "clean product photo, blue background, premium lighting"
text = text_encoder(prompt)
z = normal_noise(shape=latent_grid)

for t in reversed(range(T)):
    eps_uncond = denoiser(z, t, empty_text)
    eps_cond = denoiser(z, t, text)
    eps_hat = eps_uncond + guidance_scale * (eps_cond - eps_uncond)
    z = scheduler_step_remove_noise(z, eps_hat, t)

image = vae_decoder(z)
```

For Creative Intelligence, this pipeline can generate candidate visual variants, background alternatives, or storyboard frames. Human and policy review still matter: the model can create plausible but off-brand, misleading, or policy-unsafe content.

**Text-to-video.** Video diffusion extends the same denoising idea over space and time. Instead of one image latent grid, the model denoises frame tokens or spatiotemporal latents. The core difficulty is **temporal consistency**: the product, logo, person, or scene must remain coherent across frames while motion changes. Video systems may add temporal attention, motion modules, keyframe conditioning, or diffusion transformers (DiT-style token processing).

**Text-to-image vs text-to-video, concretely.**

- **Text-to-image:** generate one coherent creative mockup from a prompt, such as a single static "premium laptop on blue gradient" product image. The main checks are prompt adherence, visual quality, brand/policy safety, and image-level artifacts.
- **Text-to-video:** generate a sequence, such as a 6-second Instream storyboard where the laptop opens, the logo stays fixed, and lighting changes smoothly. The main added checks are temporal consistency, motion plausibility, flicker, and compute cost across frames.

**Worked example — guidance sweep for ad variants.** Generate ad-background concepts for the prompt "minimalist laptop ad, blue gradient, no text." At $w=1$, samples are diverse but some ignore the blue gradient. At $w=7$, most samples obey the prompt. At $w=15$, several samples become oversaturated and repetitive. The operating point is not "maximum guidance"; it is the scale that gives enough prompt adherence while preserving realism and diversity.

| Generation choice | Pick when | Watch out |
|---|---|---|
| Pixel-space diffusion | Teaching the core process or low-resolution data | Expensive at high resolution |
| Latent diffusion | High-resolution image generation with practical compute | VAE bottleneck can lose fine details |
| High CFG scale | Prompt adherence is more important than diversity | Oversaturation/artifacts/mode collapse |
| Lower CFG scale | Diversity and realism matter | Weaker prompt adherence |
| Video diffusion | Need generated motion over time | Temporal consistency and compute cost dominate |

**You'll be able to say:** *"Conditioning feeds the denoiser extra information such as a text embedding; classifier-free guidance combines conditional and unconditional denoising predictions to push samples toward the prompt. Latent diffusion first encodes images to a smaller latent grid, denoises there for speed and memory, then decodes to pixels. Text-to-image runs text encoder → latent denoising loop with guidance → decoder; video adds temporal dimensions and constraints so frames stay coherent."*

---

## Resources
- Lil'Log — What are Diffusion Models? (forward/reverse process math)
- HuggingFace — Diffusion Models course (DDPM/DDIM in code)
- fast.ai — Stable Diffusion (latent diffusion, guidance)

## Papers
- DDPM (Ho et al., 2020)
- Latent / Stable Diffusion (Rombach et al., 2022)
- Classifier-Free Guidance (Ho & Salimans, 2022)
- DiT (Peebles & Xie, 2023)
- Video Diffusion Models (Ho et al., 2022)
- Sora technical report (OpenAI, 2024)
