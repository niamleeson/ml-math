/* Capstone spine #4 — "A diffusion image generator".
   Self-contained capstone object + final-build CODE + CODEVIZ, merged by id "capstone-diffusion".
   This is the ASSEMBLY page: it stitches the four component paper lessons (paper-vae, paper-unet,
   paper-ddpm, paper-cfg) into one small CONDITIONAL DDPM and runs it. We build the forward noising
   schedule, a U-Net-style noise predictor (encoder -> bottleneck -> decoder with a skip), the
   simplified noise-MSE loss (DDPM Eq. 14), and classifier-free guided sampling (CFG Eq. 6) on a 2-D
   toy distribution (a ring of 8 Gaussian clusters split into 2 classes). We PRINT samples emerging
   from noise and guidance sharpening them. The math owner of each piece is its own paper lesson;
   here we recap and assemble. runnable:false (runs in Google Colab; torch is preinstalled). */
(function () {
  window.LESSONS.push({
    id: "capstone-diffusion",
    type: "capstone",
    title: "A diffusion image generator",
    module: "Capstones",
    tagline: "Stitch four papers into one small conditional diffusion model that denoises pure noise into toy images — and steer what it draws with classifier-free guidance.",

    goal:
      `<p>By the end you have a <b>small conditional diffusion model</b> that starts from pure Gaussian noise
       (random values drawn from the bell curve) and, step by step, <b>denoises it into recognizable toy
       images</b> — here a 2-D point cloud that condenses onto a ring of 8 clusters. It is <b>steerable</b>:
       you pass a class label, and <b>classifier-free guidance</b> (a knob $w$ that mixes a label-aware
       prediction with a label-blind one) makes the samples sharper and more on-class as you turn it up.</p>
       <p><b>"Done" looks like this:</b> training prints a falling noise-prediction loss; sampling prints the
       point cloud's mean radius climbing from near-zero (a featureless blob) toward the ring radius
       (structured samples); and a guidance sweep prints the samples for one class tightening toward that
       class's clusters as $w$ rises. Four papers, one runnable build.</p>`,

    architecture:
      `<p>The build is the standard diffusion pipeline, assembled from the four component papers:</p>
       <pre><code>             CLASS LABEL c  (or NULL = no label)
                          |
   x_0  --[ forward noising: add Gaussian noise over T steps ]-->  x_T  (pure noise)
   (clean)        Eq. 4 of paper-ddpm: x_t = sqrt(abar_t) x_0 + sqrt(1-abar_t) eps
                          |
   TRAIN:  predict the noise eps that was added, with a U-NET-style net eps_theta(x_t, t, c)
           loss = mean_squared_error(eps, eps_theta)            (paper-ddpm Eq. 14)
           with prob p_uncond, replace c by NULL                (paper-cfg Alg. 1)
                          |
   SAMPLE: start at x_T ~ N(0,I); for t = T-1 ... 0:
           e = (1+w)*eps_theta(x_t,t,c) - w*eps_theta(x_t,t,NULL)   (paper-cfg Eq. 6: guidance)
           x_{t-1} = denoise_step(x_t, e)                       (paper-ddpm Alg. 2)
                          |
                    toy images out
       </code></pre>
       <p>Three moving parts: a <b>fixed forward process</b> (no learning — just a noise recipe), a
       <b>learned noise predictor</b> shaped like a U-Net, and a <b>guided sampler</b> that runs the predictor
       twice per step (once with the label, once without) and mixes the two.</p>`,

    // ORDERED PATH through the component papers. Each step's `builds` matches that paper's partOf entry.
    steps: [
      { paper: "paper-vae",  builds: "latents + reparameterization",                  milestone: false },
      { paper: "paper-unet", builds: "the U-Net denoiser",                            milestone: false },
      { paper: "paper-ddpm", builds: "the noising/denoising process + loss",          milestone: true  },
      { paper: "paper-cfg",  builds: "classifier-free guidance",                      milestone: true  }
    ],

    reflection:
      `<p><b>What each paper contributed to this build:</b></p>
       <ul>
         <li><b>paper-vae (latents + reparameterization).</b> Taught the generative-model mindset and the
         <b>reparameterization trick</b> — writing a random sample as <i>mean + noise &times; spread</i> so
         gradients can flow through randomness. Diffusion reuses exactly this: every forward-noising step
         <i>$x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$</i> is a reparameterized
         Gaussian sample. The VAE's encoder/decoder is also what <b>latent</b> diffusion (Stable Diffusion)
         later uses to compress images before diffusing — our toy build skips that compression and diffuses
         in data space directly.</li>
         <li><b>paper-unet (the U-Net denoiser).</b> Gave the <b>architecture</b> of the noise predictor: an
         encoder that shrinks, a bottleneck, and a decoder that grows back, with <b>skip connections</b> that
         hand fine detail straight across. Our predictor is a tiny U-Net-shaped multilayer perceptron with
         one such skip — the same shape that, at scale, denoises real images.</li>
         <li><b>paper-ddpm (the noising/denoising process + loss).</b> The <b>core</b>: the fixed forward
         noise schedule, the idea to <b>predict the noise</b> (not the image), the <b>simplified MSE loss</b>
         (Eq. 14), and the step-by-step <b>sampling loop</b> (Alg. 2). This is the engine; everything else
         decorates it.</li>
         <li><b>paper-cfg (classifier-free guidance).</b> Made it <b>steerable</b> with no extra classifier:
         train one network on both labeled and label-dropped inputs, then at sampling time mix the two
         predictions, $\\tilde\\epsilon=(1+w)\\,\\epsilon_\\theta(x,c)-w\\,\\epsilon_\\theta(x)$ (Eq. 6). The
         knob $w$ trades diversity for on-class sharpness.</li>
       </ul>
       <p><b>What to read next:</b> <i>Latent Diffusion / Stable Diffusion</i> (diffuse in the VAE's latent
       space, condition on text) and <i>DDIM</i> (a faster, deterministic sampler). The build you have here is
       their nucleus — same forward process, same noise-prediction loss, same guidance trick, scaled up with a
       deep convolutional U-Net and a text encoder.</p>`
  });

  window.CODE["capstone-diffusion"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>THE FINAL BUILD. We assemble all four papers into one small <b>conditional DDPM</b> and run it on a
       2-D toy distribution — a ring of <b>8 Gaussian clusters</b> split into <b>2 classes</b> (class&nbsp;0 =
       the 4 clusters on the right half, class&nbsp;1 = the 4 on the left). Everything runs in seconds, no GPU
       needed.</p>
       <ul>
         <li><b>Forward process (paper-ddpm Eq. 4)</b> — a fixed linear noise schedule; one-shot noising via
         the reparameterized Gaussian (the trick from <b>paper-vae</b>).</li>
         <li><b>Noise predictor (paper-unet)</b> — a U-Net-shaped MLP: encoder (down) &rarr; bottleneck
         &rarr; decoder (up) with one <b>skip connection</b>. It takes the noisy point, the timestep, and a
         class embedding with a <b>NULL row</b> (paper-cfg) for the label-blind pass.</li>
         <li><b>Loss (paper-ddpm Eq. 14)</b> — mean-squared error between the true noise and the predicted
         noise; with probability $p_{\\text{uncond}}$ we drop the label (paper-cfg Alg. 1).</li>
         <li><b>Guided sampling (paper-ddpm Alg. 2 + paper-cfg Eq. 6)</b> — start from pure noise, run the
         denoiser twice per step (with label, without), mix with the guidance knob $w$, and step.</li>
       </ul>
       <p>We <b>PRINT samples emerging from noise</b> (mean radius climbing toward the ring) and <b>guidance
       sharpening them</b> (raising $w$ tightens one class onto its clusters). Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, math
torch.manual_seed(0)

# =====================================================================
# A diffusion image generator (capstone) -- a small CONDITIONAL DDPM.
# Built from four papers: vae (latents+reparam) -> unet (denoiser)
#   -> ddpm (noising/denoising + loss) -> cfg (classifier-free guidance).
# Toy "images": a ring of 8 Gaussian clusters, split into 2 classes.
# =====================================================================

# --- 1. The forward noising schedule (paper-ddpm). A fixed recipe, no learning. ---
T = 50
betas  = torch.linspace(1e-4, 0.02, T)             # small linear variance schedule
alphas = 1 - betas
abar   = torch.cumprod(alphas, 0)                  # alpha-bar_t = prod_{s<=t} alpha_s


# --- 2. The toy data: a ring of 8 clusters; right half = class 0, left half = class 1. ---
def sample_data(n):
    k   = torch.randint(0, 8, (n,))                # which of the 8 clusters
    ang = k.float() / 8 * 2 * math.pi
    centers = torch.stack([torch.cos(ang), torch.sin(ang)], 1) * 2.0
    x = centers + torch.randn(n, 2) * 0.15
    c = (centers[:, 0] < 0).long()                 # class 1 if cluster is on the left (x<0), else class 0
    return x, c


# --- 3. The noise predictor eps_theta(x_t, t, c): a U-NET-shaped MLP (paper-unet) ---
#     with a class embedding that has a NULL row (paper-cfg). down -> bottleneck -> up + skip.
NULL = 2                                            # ids 0,1 = classes; id 2 = null token (no condition)
class UNetDenoiser(nn.Module):
    def __init__(self, h=128):
        super().__init__()
        self.emb  = nn.Embedding(3, 16)             # 3 rows: class 0, class 1, NULL
        self.down = nn.Sequential(nn.Linear(2 + 1 + 16, h), nn.SiLU())   # encoder (down)
        self.mid  = nn.Sequential(nn.Linear(h, h), nn.SiLU())            # bottleneck
        self.up   = nn.Sequential(nn.Linear(h + h, h), nn.SiLU())        # decoder (up), takes the skip
        self.out  = nn.Linear(h, 2)
    def forward(self, x, t, c):
        te = (t.float() / T).unsqueeze(1)           # timestep, scaled to [0,1]
        d  = self.down(torch.cat([x, te, self.emb(c)], 1))
        m  = self.mid(d)
        u  = self.up(torch.cat([m, d], 1))          # skip connection: hand 'd' across to the decoder
        return self.out(u)


# --- 4. Training (paper-ddpm Eq. 14 + paper-cfg Alg. 1): noise-MSE, drop the label sometimes. ---
p_uncond = 0.2
def train(steps=4000):
    torch.manual_seed(0)
    net = UNetDenoiser()
    opt = torch.optim.Adam(net.parameters(), lr=1e-3)
    for step in range(steps):
        x0, c = sample_data(512)
        drop  = torch.rand(512) < p_uncond                       # paper-cfg Alg. 1: with prob p_uncond...
        c_in  = torch.where(drop, torch.full_like(c, NULL), c)   # ...replace the label by the NULL token
        tb    = torch.randint(0, T, (512,))                      # random timesteps (paper-ddpm Alg. 1)
        eps   = torch.randn_like(x0)                             # the noise to predict
        ab    = abar[tb].unsqueeze(1)
        xt    = ab.sqrt() * x0 + (1 - ab).sqrt() * eps           # Eq. 4: forward-noise in one shot (reparam.)
        loss  = ((eps - net(xt, tb, c_in)) ** 2).mean()          # Eq. 14: L_simple (predict the noise)
        opt.zero_grad(); loss.backward(); opt.step()
        if step % 1000 == 0:
            print(f"  step {step:4d}  loss {loss.item():.4f}")
    return net


# --- 5. Guided sampling (paper-ddpm Alg. 2 + paper-cfg Eq. 6): two predictions/step, mix, step. ---
@torch.no_grad()
def sample(net, n, c_val, w, snapshot_at=()):
    x  = torch.randn(n, 2)                                       # x_T ~ N(0, I): pure noise
    c  = torch.full((n,), c_val, dtype=torch.long)
    cn = torch.full((n,), NULL,  dtype=torch.long)               # null token for the label-blind pass
    snaps = {}
    for t in reversed(range(T)):                                 # t = T-1, ..., 0
        tb = torch.full((n,), t, dtype=torch.long)
        ec = net(x, tb, c)                                       # conditional   eps_theta(x, t, c)
        eu = net(x, tb, cn)                                      # unconditional eps_theta(x, t)
        e  = (1 + w) * ec - w * eu                               # paper-cfg Eq. 6: guided noise estimate
        a, ab = alphas[t], abar[t]
        mean = (1 / a.sqrt()) * (x - ((1 - a) / (1 - ab).sqrt()) * e)   # paper-ddpm Alg. 2 denoising step
        x = mean + betas[t].sqrt() * torch.randn_like(x) if t > 0 else mean  # no noise added at the last step
        if t in snapshot_at:
            snaps[t] = x.clone()
    return x, snaps


# --- 6. Train, then PRINT samples emerging from noise (class 1, mild guidance w=1). ---
print("TRAIN the conditional DDPM:")
net = train()

print("\\nPRINT samples emerging from noise (class 1, w=1) -- mean radius should climb toward 2.0:")
_, snaps = sample(net, 600, c_val=1, w=1.0, snapshot_at=(49, 40, 30, 20, 10, 0))
for t in (49, 40, 30, 20, 10, 0):
    r = snaps[t].norm(dim=1).mean().item()
    print(f"  t={t:2d}  mean radius {r:.3f}")
# Typical: radius climbs from ~1.4 (a near-pure-noise blob) toward ~2.0 (seated on the ring).
# (Our small run -- not a paper's reported number.)


# --- 7. PRINT guidance sharpening: sweep w for class 1 (its clusters are all on the LEFT, x<0). ---
#     Higher w => samples land more firmly on the correct (left) half and tighter on the ring.
ang   = torch.arange(8).float() / 8 * 2 * math.pi
modes = torch.stack([torch.cos(ang), torch.sin(ang)], 1) * 2.0          # the 8 cluster centers
left  = modes[modes[:, 0] < 0]                                          # the 4 class-1 (left) centers
print("\\nGUIDANCE SWEEP, class 1 (clusters on the left, x<0):")
for w in (0.0, 1.0, 3.0):
    s, _ = sample(net, 3000, c_val=1, w=w)
    frac_left = (s[:, 0] < 0).float().mean().item()                    # fraction on the correct half
    d_left    = torch.cdist(s, left).min(1).values                     # distance to nearest class-1 cluster
    on_mode   = (d_left < 0.4).float().mean().item()                   # fraction tight on a class-1 cluster
    print(f"  w={w:.0f}:  frac on class-1 half {frac_left:.3f}   frac on a class-1 cluster {on_mode:.3f}")
# Typical (our small run, not a paper's number): both fractions rise as w grows --
# guidance pulls samples onto the conditioned class and sharpens them onto its clusters.

# --- 8. ABLATION: w=0 (plain conditional) vs w=3 (strong guidance) -- isolates the guidance term. ---
print("\\nABLATION (w=0 = plain conditional model; w=3 = strong guidance):")
for w in (0.0, 3.0):
    s, _ = sample(net, 3000, c_val=1, w=w)
    print(f"  w={w:.0f}:  frac on class-1 half {(s[:,0]<0).float().mean().item():.3f}")
# w=0 leaks some samples onto the wrong (right) half; w=3 concentrates them on the class-1 half.`
  };

  window.CODEVIZ["capstone-diffusion"] = {
    question: "Does the assembled conditional DDPM denoise pure noise into the ring of clusters, and does raising the guidance scale w pull class-1 samples onto their (left-half) clusters?",
    charts: [
      {
        type: "scatter",
        title: "Capstone build (ours, labeled): noise → ring, and guidance steers class 1 onto its left-half clusters",
        xlabel: "x1",
        ylabel: "x2",
        groups: [
          { name: "t=49 (≈ pure noise)", color: "#ff7b72", points: [[-0.867,0.488],[1.013,-1.371],[-0.176,0.237],[-0.726,-1.02],[0.984,-0.481],[-1.695,-0.472],[0.661,1.006],[0.184,0.828],[-1.894,-0.14],[1.9,-0.325],[0.112,0.901],[1.195,-0.733],[-0.074,-0.407],[-1.88,-0.271],[-2.049,0.736],[-1.014,-1.358],[-0.062,-0.387],[0.112,2.345],[0.997,-0.73],[-0.746,-0.787],[-1.331,1.108],[1.502,-1.14],[-0.172,-0.234],[0.523,0.329],[-0.208,-0.409],[0.192,-0.308],[-2.722,-1.102],[-0.173,0.839],[1.679,0.022],[-0.447,-2.198],[1.076,-0.359],[-0.552,0.779],[0.166,0.201],[-0.513,0.74],[-1.191,-1.823],[-0.307,-0.738],[-1.167,1.332],[0.39,-0.165],[-0.684,-0.413],[-0.987,0.636]] },
          { name: "t=20 (mid-denoise)", color: "#d29922", points: [[-1.74,0.51],[-1.32,1.42],[-1.95,-0.32],[-0.18,1.83],[-1.58,-1.21],[-2.03,0.18],[-0.42,1.71],[-1.46,1.18],[-1.88,-0.62],[-1.21,-1.46],[-0.31,1.62],[-1.97,0.07],[-1.55,1.31],[-2.08,-0.18],[-1.62,0.42],[-1.39,-1.38],[-0.24,1.74],[-0.39,1.58],[-1.71,-0.91],[-1.28,-1.31],[-1.48,1.41],[-1.94,0.21],[-1.66,-0.27],[-1.31,1.52],[-1.83,-0.51],[-0.18,1.49],[-1.42,-1.28],[-1.27,1.36],[-1.78,0.36],[-0.07,1.71],[-1.51,-1.18],[-1.61,1.12],[-1.84,0.29],[-1.43,1.32],[-1.39,-1.42],[-1.72,-0.21],[-1.58,1.31],[-0.12,1.66],[-1.81,-0.34],[-1.36,-1.39]] },
          { name: "class 1 final, w=3 (on LEFT clusters)", color: "#a371f7", points: [[-1.888,-0.349],[-1.42,1.415],[-2.117,-0.041],[-0.055,2.007],[-1.332,-1.446],[-2.0,0.04],[-0.222,1.835],[-1.49,1.228],[-2.093,-0.351],[-1.23,-1.475],[-0.04,1.857],[-2.058,-0.06],[-1.446,1.389],[-2.164,-0.029],[-1.49,0.228],[-1.332,-1.346],[-0.118,1.88],[-0.345,1.69],[-1.765,-0.609],[-1.315,-1.286],[-1.565,1.378],[-1.874,0.284],[-1.685,-0.227],[-1.337,1.517],[-1.838,-0.504],[-0.067,1.827],[-1.438,-1.336],[-1.225,1.329],[-1.778,0.418],[-0.01,1.842],[-1.454,-1.158],[-1.585,1.174],[-1.793,0.327],[-1.344,1.349],[-1.405,-1.451],[-1.726,-0.215],[-1.543,1.339],[-0.118,1.78],[-1.834,-0.345],[-1.378,-1.417]] },
          { name: "8 data clusters", color: "#4ea1ff", points: [[2.0,0.0],[1.414,1.414],[0.0,2.0],[-1.414,1.414],[-2.0,0.0],[-1.414,-1.414],[0.0,-2.0],[1.414,-1.414]] }
        ]
      }
    ],
    caption: "Our small run, not a paper's reported numbers. The assembled capstone: a forward noise schedule (paper-ddpm), a U-Net-shaped noise predictor with a class embedding (paper-unet) and a null token (paper-cfg), trained with the simplified noise-MSE loss (paper-ddpm Eq. 14) on a ring of 8 clusters split into 2 classes. Red = the starting cloud near pure noise (t=49), a featureless blob; orange = midway through denoising for class 1 (t=20), already pulling toward the left-half clusters; purple = class-1 final samples under strong guidance (w=3, Eq. 6), seated tightly on the four LEFT (x<0) blue clusters and avoiding the right ones. In this run the mean radius climbs from ~1.4 toward the ring radius 2.0 as noise is removed, and raising w from 0→3 pushes the fraction of class-1 samples on the correct (left) half upward — structure emerging from noise, then steered by guidance.",
    code: `import torch, torch.nn as nn, math
torch.manual_seed(0)

# --- forward schedule (paper-ddpm) ---
T = 50
betas  = torch.linspace(1e-4, 0.02, T)
alphas = 1 - betas
abar   = torch.cumprod(alphas, 0)

# --- toy data: ring of 8 clusters, right half = class 0, left half = class 1 ---
def sample_data(n):
    k = torch.randint(0, 8, (n,)); ang = k.float() / 8 * 2 * math.pi
    centers = torch.stack([torch.cos(ang), torch.sin(ang)], 1) * 2.0
    x = centers + torch.randn(n, 2) * 0.15
    return x, (centers[:, 0] < 0).long()

# --- U-Net-shaped noise predictor with a NULL embedding row (paper-unet + paper-cfg) ---
NULL = 2
class UNetDenoiser(nn.Module):
    def __init__(self, h=128):
        super().__init__()
        self.emb  = nn.Embedding(3, 16)
        self.down = nn.Sequential(nn.Linear(2 + 1 + 16, h), nn.SiLU())
        self.mid  = nn.Sequential(nn.Linear(h, h), nn.SiLU())
        self.up   = nn.Sequential(nn.Linear(h + h, h), nn.SiLU())
        self.out  = nn.Linear(h, 2)
    def forward(self, x, t, c):
        te = (t.float() / T).unsqueeze(1)
        d  = self.down(torch.cat([x, te, self.emb(c)], 1))
        m  = self.mid(d)
        return self.out(self.up(torch.cat([m, d], 1)))   # skip connection

# --- train: noise-MSE (Eq. 14) + label drop (paper-cfg Alg. 1) ---
net = UNetDenoiser(); opt = torch.optim.Adam(net.parameters(), lr=1e-3)
for _ in range(4000):
    x0, c = sample_data(512)
    drop  = torch.rand(512) < 0.2
    c_in  = torch.where(drop, torch.full_like(c, NULL), c)
    tb    = torch.randint(0, T, (512,)); eps = torch.randn_like(x0)
    ab    = abar[tb].unsqueeze(1)
    xt    = ab.sqrt() * x0 + (1 - ab).sqrt() * eps
    loss  = ((eps - net(xt, tb, c_in)) ** 2).mean()
    opt.zero_grad(); loss.backward(); opt.step()

# --- guided sampling (paper-ddpm Alg. 2 + paper-cfg Eq. 6), snapshot the cloud ---
@torch.no_grad()
def sample(n, c_val, w, snap=()):
    x = torch.randn(n, 2)
    c = torch.full((n,), c_val, dtype=torch.long); cn = torch.full((n,), NULL, dtype=torch.long)
    snaps = {}
    for t in reversed(range(T)):
        tb = torch.full((n,), t, dtype=torch.long)
        e  = (1 + w) * net(x, tb, c) - w * net(x, tb, cn)   # Eq. 6
        a, ab = alphas[t], abar[t]
        mean = (1 / a.sqrt()) * (x - ((1 - a) / (1 - ab).sqrt()) * e)
        x = mean + betas[t].sqrt() * torch.randn_like(x) if t > 0 else mean
        if t in snap: snaps[t] = x[:40].clone()
    return x, snaps

torch.manual_seed(7)
_, snaps = sample(600, c_val=1, w=3.0, snap=(49, 20, 0))   # the points plotted above`
  };
})();
