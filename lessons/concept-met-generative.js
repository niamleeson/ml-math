/* =====================================================================
   MODULE — Metrics & Evaluation (measuring models, data & statistics).
   Lesson: met-generative — how do you score things a model GENERATES (images)?
   Self-contained: one BEGINNER concept lesson into window.LESSONS, plus a
   real torchmetrics + from-scratch Fréchet-distance CODE block, and a
   reproducible numpy CODEVIZ that computes a real FID-style distance on
   load_digits (PCA features stand in for an Inception network).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-generative",
    title: "Scoring what a model generates (images)",
    tagline: "When a model invents a picture, there is no single right answer — so we compare the whole pile of fakes to the pile of real ones.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["mod-vae", "dl-cnn-params", "prob-normal"],
    whenToUse:
      `<p><b>Pick the metric by the question you are asking.</b> Generated images have no ground-truth label to check against, so each metric measures a different kind of "good".</p>
       <ul>
         <li><b>FID (Fréchet Inception Distance)</b> — the default for <i>quality and diversity together</i> of a generator (GAN, diffusion model). Lower is better. Reach for it first.</li>
         <li><b>KID (Kernel Inception Distance)</b> — same goal as FID but it behaves better on <i>small sample sizes</i> and gives an unbiased number. Use it when you cannot generate tens of thousands of images.</li>
         <li><b>IS (Inception Score)</b> — a quick, real-data-free sanity check of "are the images sharp and varied across classes". Use it as a rough signal only; prefer FID/KID for real comparisons.</li>
         <li><b>Precision &amp; Recall (and Density &amp; Coverage)</b> — when you want to split "good" into two numbers: <i>fidelity</i> (do fakes look real?) versus <i>diversity</i> (do they cover the whole range of real images?). Use these to diagnose <i>why</i> FID is high.</li>
         <li><b>PSNR, SSIM, MS-SSIM, LPIPS</b> — for <i>reconstruction</i> tasks (denoising, super-resolution, autoencoders) where there <i>is</i> a target image and you compare the output to it pixel-by-pixel or perceptually.</li>
         <li><b>NLL / bits-per-dimension</b> — for <i>likelihood models</i> (VAEs, normalizing flows, autoregressive models) that report how probable the real data is under the model.</li>
         <li><b>CLIPScore</b> — for <i>text-to-image</i>: does the generated picture match the prompt that asked for it?</li>
       </ul>
       <p><b>Avoid:</b> using IS to compare two generators of the same class of images (it is blind to variety <i>within</i> a class), and using PSNR alone when you care how a human perceives quality (it rewards blur).</p>`,
    application:
      `<p>These are the numbers in every modern image-generation paper and leaderboard. A GAN (Generative Adversarial Network) or diffusion model is reported with its FID on a benchmark like CIFAR-10 or ImageNet; text-to-image systems (Stable Diffusion, DALL·E) add CLIPScore to show the picture matches the prompt. Image-restoration teams (phone-camera denoising, medical-scan super-resolution, video upscaling) track PSNR and SSIM against a clean target, and increasingly LPIPS because it tracks human judgement. Likelihood models (VAEs, flows) are compared by bits-per-dimension. Precision/recall and density/coverage are how teams diagnose a generator that "looks fine but only ever draws three faces" — high fidelity, low diversity.</p>`,
    pitfalls:
      `<ul>
         <li><b>FID is sensitive to sample size and preprocessing.</b> Computing FID on a few hundred images gives an inflated number; the standard is tens of thousands. Resizing, JPEG compression, and the exact image-resampling library all shift FID, so two papers' FIDs are only comparable if computed the same way. <i>Fix:</i> fix the sample count (e.g. 50,000), the resize method, and the feature network, and report them. Use KID when you genuinely have few samples — it is unbiased.</li>
         <li><b>IS is blind to intra-class diversity and ignores the real data entirely.</b> A generator that emits one perfect dog per class scores a great IS while producing almost no variety, and IS never looks at your real images at all, so it cannot catch a generator drifting away from the true distribution. <i>Fix:</i> use FID/KID, which compare directly against real data, and add precision/recall to see fidelity-vs-diversity.</li>
         <li><b>PSNR poorly matches human perception.</b> It is just a function of mean squared error, so a slightly blurry image (low error spread over many pixels) can beat a sharp image with a tiny misalignment — yet humans clearly prefer the sharp one. <i>Fix:</i> report SSIM/MS-SSIM (structure-aware) and LPIPS (learned to match human judgements) alongside PSNR, never PSNR alone.</li>
         <li><b>Metric gaming.</b> Optimizing a generator directly on FID or CLIPScore can produce images that score well but look wrong (adversarial textures, prompt keywords stamped into the image). <i>Fix:</i> keep a held-out human evaluation; treat these numbers as proxies, not the goal.</li>
       </ul>`,
    bigIdea:
      `<p>For a classifier you can check each prediction against a known label. For a <b>generator</b> there is no label — a newly invented face is not "right" or "wrong", it is just a new face. So you cannot score one image in isolation.</p>
       <p><b>The core trick:</b> compare the whole <i>distribution</i> of generated samples to the whole <i>distribution</i> of real ones. "Distribution" just means the cloud of all your images viewed as points. If the cloud of fakes sits right on top of the cloud of reals — same center, same spread, same shape — the generator is good.</p>
       <p>One catch: comparing clouds of raw pixels is meaningless (shifting an image one pixel changes every number but not what it depicts). So first we push each image through a fixed, pretrained vision network and keep an inner layer's output — a short vector of <b>features</b> that captures "what is in the image". We compare the two clouds <i>in that feature space</i>. That single idea — distribution-distance in a feature space — is the engine behind FID, KID, IS, and precision/recall.</p>`,
    buildup:
      `<p>Let us name every metric in the family and what each one measures.</p>
       <ul>
         <li><b>IS (Inception Score).</b> Push each fake through an Inception classifier. A <i>good single image</i> should get a confident, peaked label guess (it clearly looks like <i>something</i>). The <i>whole batch</i> should use many labels (variety). IS rewards both, but only looks at the fakes — never at your real data.</li>
         <li><b>FID (Fréchet Inception Distance).</b> Take Inception features of the real set and of the fake set. Summarize each cloud by its mean (center) and covariance (spread and shape), pretend each is a bell curve, and measure the distance between the two bell curves with the Fréchet formula. Lower = the fakes' cloud matches the reals'.</li>
         <li><b>KID (Kernel Inception Distance).</b> Same features, but instead of assuming bell curves it uses a kernel two-sample test (the Maximum Mean Discrepancy, MMD). It needs no bell-curve assumption, is unbiased, and is steadier on small samples.</li>
         <li><b>Precision &amp; Recall for generators.</b> Split quality into two. <b>Precision = fidelity</b>: what fraction of fakes land inside the real cloud (look real?). <b>Recall = diversity</b>: what fraction of the real cloud is covered by fakes (did we reproduce the full range?). <b>Density &amp; Coverage</b> are a more robust re-do of the same two ideas, less fooled by outliers.</li>
         <li><b>LPIPS (Learned Perceptual Image Patch Similarity).</b> A learned distance between <i>two</i> images: run both through a network, compare feature maps. It tracks human "do these look alike?" judgement far better than pixel difference. Lower = more similar.</li>
         <li><b>PPL (Perceptual Path Length).</b> Uses LPIPS to measure how <i>smooth</i> a generator's latent space is: take two nearby latent codes, generate both, and see how much LPIPS-distance the image moves. Small, even steps = a well-behaved generator.</li>
         <li><b>PSNR (Peak Signal-to-Noise Ratio).</b> For reconstruction: a log-scaled inverse of mean squared error between output and target. Higher = closer. Simple, but blur-friendly.</li>
         <li><b>SSIM (Structural Similarity) and MS-SSIM (Multi-Scale SSIM).</b> Compare two images on luminance, contrast, and structure in local windows, in $[0,1]$ (1 = identical). MS-SSIM does it at several resolutions. Closer to human perception than PSNR.</li>
         <li><b>NLL (Negative Log-Likelihood) / bits-per-dimension.</b> For likelihood models: how improbable the real data is under the model, averaged. Dividing by the number of pixels-times-channels and converting to base-2 gives bits-per-dimension, a fair cross-dataset unit.</li>
         <li><b>CLIPScore.</b> For text-to-image: embed the prompt and the generated image with CLIP (Contrastive Language–Image Pretraining) and take their cosine similarity. Higher = the image matches the words.</li>
       </ul>`,
    symbols: [
      { sym: "$\\mu_r,\\ \\mu_g$", desc: "the mean (center of mass) of the real and generated feature clouds. Greek 'mu'. Subscript $r$ = real, $g$ = generated." },
      { sym: "$\\Sigma_r,\\ \\Sigma_g$", desc: "the covariance matrices of the two clouds (capital Greek 'Sigma') — they describe each cloud's spread and shape, i.e. how the features vary together." },
      { sym: "$\\operatorname{Tr}$", desc: "the trace: the sum of a matrix's diagonal entries. Here it totals up the spread terms." },
      { sym: "$(\\Sigma_r\\Sigma_g)^{1/2}$", desc: "the matrix square root of the product of the two covariances — a matrix $M$ with $M\\,M=\\Sigma_r\\Sigma_g$. It captures how the two clouds' spreads overlap." },
      { sym: "$\\phi(x)$", desc: "the feature vector of image $x$: push $x$ through a fixed pretrained network and read an inner layer (Greek 'phi'). Distances are measured on $\\phi$, not raw pixels." },
      { sym: "$p(y\\mid x)$", desc: "the label distribution a classifier assigns to image $x$ — used by the Inception Score; a peaked $p(y\\mid x)$ means a clearly recognizable image." },
      { sym: "$D_{\\mathrm{KL}}$", desc: "the Kullback–Leibler (KL) divergence: a one-directional 'distance' between two probability distributions, used inside IS." },
      { sym: "$\\mathrm{MSE}$", desc: "Mean Squared Error: the average of (output pixel minus target pixel) squared. PSNR is built from it." },
      { sym: "$\\mathrm{MAX}_I$", desc: "the largest possible pixel value (255 for 8-bit images, or 1.0 for normalized) — the 'peak signal' in PSNR." }
    ],
    formula: `$$ \\mathrm{FID}=\\lVert \\mu_r-\\mu_g\\rVert^2 \\;+\\; \\operatorname{Tr}\\!\\Big(\\Sigma_r+\\Sigma_g-2\\,(\\Sigma_r\\Sigma_g)^{1/2}\\Big) $$
$$ \\mathrm{IS}=\\exp\\!\\Big(\\mathbb{E}_x\\,D_{\\mathrm{KL}}\\big(p(y\\mid x)\\,\\Vert\\,p(y)\\big)\\Big) \\qquad \\mathrm{PSNR}=10\\,\\log_{10}\\!\\frac{\\mathrm{MAX}_I^{\\,2}}{\\mathrm{MSE}} $$`,
    whatItDoes:
      `<p><b>FID (top line)</b> measures the distance between two feature clouds modelled as bell curves. The first piece, $\\lVert \\mu_r-\\mu_g\\rVert^2$, is how far apart their <i>centers</i> are (are the fakes, on average, in the right place?). The second piece, the trace term, compares their <i>spreads and shapes</i> — it is zero only when $\\Sigma_r=\\Sigma_g$. Add them: FID is 0 when the clouds match exactly and grows as they drift apart. Lower is better.</p>
       <p><b>IS (bottom left)</b> rewards two things at once. $D_{\\mathrm{KL}}\\big(p(y\\mid x)\\,\\Vert\\,p(y)\\big)$ is large when one image's label guess $p(y\\mid x)$ is sharp (confident) but the average over all images $p(y)$ is flat (the batch spans many classes). Averaging and exponentiating gives a single number; higher is "better" — but note it never touches your real data.</p>
       <p><b>PSNR (bottom right)</b> turns reconstruction error into decibels: small $\\mathrm{MSE}$ (output close to target) makes the fraction large, so PSNR is high. The $\\log_{10}$ compresses a huge range into a readable 20–40 dB scale.</p>`,
    derivation:
      `<p><b>Why the FID formula is the right distance.</b></p>
       <ul class="steps">
         <li><b>Model each cloud as a bell curve.</b> We summarize the real features by a Gaussian (multivariate normal — see [prob-normal]) with mean $\\mu_r$ and covariance $\\Sigma_r$, and the fakes by $\\mu_g,\\Sigma_g$. Two numbers per cloud (a center and a spread) is a compact, fair summary.</li>
         <li><b>Use a distance that respects geometry.</b> The natural distance between two probability distributions that also respects how points move is the <b>2-Wasserstein</b> (or Fréchet) distance — informally, the least total work to slide one cloud onto the other. For two Gaussians it has a closed form.</li>
         <li><b>That closed form is the FID formula.</b> The work splits into moving the center, $\\lVert \\mu_r-\\mu_g\\rVert^2$, plus reshaping the spread, $\\operatorname{Tr}\\!\\big(\\Sigma_r+\\Sigma_g-2(\\Sigma_r\\Sigma_g)^{1/2}\\big)$. The cross term $(\\Sigma_r\\Sigma_g)^{1/2}$ is exactly what makes it 0 when the two covariances are equal. So FID = squared distance between the two Gaussians under this metric. $\\blacksquare$</li>
         <li><b>Why features, not pixels.</b> A 1-pixel shift changes every raw pixel yet leaves "what the image shows" untouched. Inception features $\\phi(x)$ are nearly unchanged by such nuisance shifts, so distances in feature space track <i>content</i>, which is what we want to compare.</li>
       </ul>`,
    example:
      `<p>A tiny 1-D version so the FID formula is concrete (real features are high-dimensional, but the arithmetic is the same idea).</p>
       <ul class="steps">
         <li>Say a single feature of the <b>real</b> images has mean $\\mu_r=10$ and variance $\\Sigma_r=4$ (so standard deviation 2).</li>
         <li>The <b>generated</b> images have mean $\\mu_g=12$ and variance $\\Sigma_g=9$ (standard deviation 3): slightly off-center and more spread out.</li>
         <li>Center term: $\\lVert \\mu_r-\\mu_g\\rVert^2=(10-12)^2=4$.</li>
         <li>Spread term (1-D, so the matrix square root is just an ordinary square root): $\\Sigma_r+\\Sigma_g-2\\sqrt{\\Sigma_r\\Sigma_g}=4+9-2\\sqrt{36}=13-12=1$.</li>
         <li>$\\mathrm{FID}=4+1=5$. If the fakes matched the reals exactly ($\\mu_g=10,\\ \\Sigma_g=4$) both terms would be 0, giving the best possible $\\mathrm{FID}=0$.</li>
       </ul>
       <p>The CODEVIZ below runs this exact computation in 10 dimensions on real handwritten digits.</p>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      // deterministic Gaussian sampler (Box-Muller)
      var seed = 7; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      function randn() { var u = Math.max(rnd(), 1e-9), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

      // a real 1-D cloud of "real" features, fixed
      var real = []; for (var i = 0; i < 250; i++) real.push(10 + 2 * randn());
      var muR = 10, sdR = 2;

      var shift = 2.0;   // how far the generated mean drifts
      var spread = 3.0;  // generated standard deviation

      function fid1d(muG, sdG) {
        var center = (muR - muG) * (muR - muG);
        var spreadTerm = sdR * sdR + sdG * sdG - 2 * Math.sqrt(sdR * sdR * sdG * sdG);
        return center + spreadTerm;
      }

      var xmin = 2, xmax = 22, W = 640, H = 360, padL = 30, padR = 16, padT = 16, padB = 30;
      function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }

      function curveY(x, mu, sd) { var z = (x - mu) / sd; return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI)); }

      function draw() {
        var c = C(); ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        var baseY = H - padB, scale = 1800;
        // real cloud dots
        ctx.fillStyle = c.accent2 + "cc";
        for (var i = 0; i < real.length; i++) { ctx.beginPath(); ctx.arc(PX(real[i]), baseY - 4, 2.2, 0, Math.PI * 2); ctx.fill(); }
        // real bell curve
        function bell(mu, sd, col) {
          ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
          for (var x = xmin; x <= xmax; x += 0.1) { var px = PX(x), py = baseY - curveY(x, mu, sd) * scale; if (x === xmin) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
          ctx.stroke();
        }
        bell(muR, sdR, c.accent2);
        var muG = muR + shift, sdG = spread;
        bell(muG, sdG, c.warn);
        var f = fid1d(muG, sdG);
        readout.innerHTML = "<b>Green = real feature cloud, orange = generated.</b> Drag the sliders to move/spread the fakes. " +
          "Center gap squared = " + (shift * shift).toFixed(2) + ", spread term = " + (sdR * sdR + sdG * sdG - 2 * Math.sqrt(sdR * sdR * sdG * sdG)).toFixed(2) +
          ", so <b>FID = " + f.toFixed(2) + "</b>. FID is 0 only when the orange curve sits exactly on the green one.";
      }

      function slider(label, min, max, val, step, cb) {
        var row = document.createElement("div"); row.style.margin = "6px 0"; row.style.fontSize = "13px";
        var lab = document.createElement("span"); lab.textContent = label + " "; lab.style.color = "var(--ink-dim)";
        var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = val; inp.style.verticalAlign = "middle";
        inp.addEventListener("input", function () { cb(parseFloat(inp.value)); draw(); });
        row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
      }
      slider("generated mean drift", 0, 8, shift, 0.1, function (v) { shift = v; });
      slider("generated spread (std dev)", 0.5, 6, spread, 0.1, function (v) { spread = v; });
      host.appendChild(readout);
      draw();
    },
    practice: [
      {
        q: `Your diffusion model's images look crisp and realistic, but a reviewer says "it only ever draws the same five faces." FID is mediocre. Which two-number diagnostic explains what is happening, and what would the numbers look like?`,
        steps: [
          { do: `Recall that FID mixes fidelity and diversity into one score, so it cannot tell you which is the problem.`, why: `You need a metric that separates the two.` },
          { do: `Use precision (fidelity) and recall (diversity), or density and coverage.`, why: `Precision asks "do fakes look real?", recall asks "do fakes cover the full real range?".` }
        ],
        answer: `<p>Use <b>precision &amp; recall</b> (or the more robust <b>density &amp; coverage</b>). "Crisp and realistic" means the fakes land inside the real cloud, so <b>precision (fidelity) is high</b>. "Only five faces" means they cover just a sliver of the real range, so <b>recall (diversity) is low</b>. FID is mediocre precisely because it averages a great fidelity with a poor diversity into one middling number — these two metrics reveal the split.</p>`
      },
      {
        q: `You are denoising photos and have the clean target for each one. A teammate ranks methods by PSNR only and picks a model that produces visibly blurry results. Why did PSNR mislead, and which metrics should be added?`,
        steps: [
          { do: `Recall PSNR is a function of mean squared error.`, why: `Blur spreads small errors over many pixels, keeping MSE low.` },
          { do: `A sharp image with a tiny misalignment can have higher MSE than a blurry one.`, why: `So PSNR can rank blur above sharpness, against human preference.` }
        ],
        answer: `<p>PSNR is just rescaled $\\mathrm{MSE}$, and blur keeps MSE low while destroying detail, so PSNR rewards it. A sharp output that is off by a hair can score <i>worse</i>. Add <b>SSIM / MS-SSIM</b> (Structural / Multi-Scale Structural Similarity), which compare local structure, and <b>LPIPS</b> (Learned Perceptual Image Patch Similarity), which was trained to match human judgement. Reporting all three avoids the blur trap.</p>`
      },
      {
        q: `Real feature cloud: mean 5, variance 1. Generated cloud: mean 8, variance 1. Compute the FID (treat features as 1-D).`,
        steps: [
          { do: `Center term: square the difference of means.`, why: `$\\lVert\\mu_r-\\mu_g\\rVert^2=(5-8)^2=9$.` },
          { do: `Spread term: $\\Sigma_r+\\Sigma_g-2\\sqrt{\\Sigma_r\\Sigma_g}=1+1-2\\sqrt{1}=0$.`, why: `Equal variances make the spread term vanish.` }
        ],
        answer: `<p>$\\mathrm{FID}=9+0=\\mathbf{9}$. The clouds have identical spread (variance 1 each, so the spread term is 0), and the whole distance comes from the centers being 3 apart: $(5-8)^2=9$. Move the generated mean to 5 and FID drops to 0.</p>`
      }
    ]
  });

  window.CODE["met-generative"] = {
    lib: "torchmetrics",
    runnable: false,
    explain: `<p>A from-scratch Fréchet distance (so you see the exact math) plus the real production functions from <code>torchmetrics.image</code>: FID, Inception Score, SSIM, PSNR, and LPIPS. In practice you call the torchmetrics classes — they download the pretrained Inception/feature network and handle batching for you.</p>`,
    code: `import numpy as np
from scipy.linalg import sqrtm

# ---------- from-scratch Frechet (FID) distance between two feature clouds ----------
def frechet_distance(feats_real, feats_fake):
    """FID = ||mu_r - mu_g||^2 + Tr(S_r + S_g - 2*(S_r S_g)^{1/2}).

    feats_*: arrays of shape (n_images, n_features), e.g. Inception activations.
    Lower is better; 0 means the two clouds match exactly.
    """
    mu_r, mu_g = feats_real.mean(0), feats_fake.mean(0)
    S_r = np.cov(feats_real, rowvar=False)
    S_g = np.cov(feats_fake, rowvar=False)

    diff = mu_r - mu_g
    covmean = sqrtm(S_r @ S_g)          # matrix square root of the product
    if np.iscomplexobj(covmean):        # numerical fuzz can add tiny imaginary parts
        covmean = covmean.real
    return float(diff @ diff + np.trace(S_r + S_g - 2 * covmean))


# ---------- the real torchmetrics API practitioners actually call ----------
import torch
from torchmetrics.image.fid import FrechetInceptionDistance
from torchmetrics.image.inception import InceptionScore
from torchmetrics.image import (
    StructuralSimilarityIndexMeasure,        # SSIM
    PeakSignalNoiseRatio,                     # PSNR
)
from torchmetrics.image.lpip import LearnedPerceptualImagePatchSimilarity

# images are uint8 tensors of shape (N, 3, H, W) for FID/IS
real = torch.randint(0, 255, (64, 3, 299, 299), dtype=torch.uint8)
fake = torch.randint(0, 255, (64, 3, 299, 299), dtype=torch.uint8)

# FID: quality + diversity of a generator (lower is better)
fid = FrechetInceptionDistance(feature=2048, normalize=False)
fid.update(real, real=True)
fid.update(fake, real=False)
print("FID:", fid.compute().item())

# Inception Score: sharpness + cross-class variety (higher is better; ignores real data)
iscore = InceptionScore()
iscore.update(fake)
mean_is, std_is = iscore.compute()
print("IS:", mean_is.item(), "+/-", std_is.item())

# --- reconstruction metrics: compare an output to its known target (float in [0,1]) ---
out    = torch.rand(8, 3, 128, 128)
target = torch.rand(8, 3, 128, 128)

ssim = StructuralSimilarityIndexMeasure(data_range=1.0)   # 1.0 = identical
print("SSIM:", ssim(out, target).item())

psnr = PeakSignalNoiseRatio(data_range=1.0)               # decibels; higher = closer
print("PSNR:", psnr(out, target).item())

# LPIPS: learned PERCEPTUAL distance (lower = more similar); inputs in [-1, 1]
lpips = LearnedPerceptualImagePatchSimilarity(net_type="alex", normalize=True)
print("LPIPS:", lpips(out, target).item())

# KID lives at torchmetrics.image.kid.KernelInceptionDistance (unbiased; better on small samples).
# CLIPScore lives at torchmetrics.multimodal.clip_score.CLIPScore (text-to-image match).`
  };

  window.CODEVIZ["met-generative"] = {
    question: "What does each generative metric actually measure — and what do the healthy and broken versions of each chart look like? See FID split into its mean and covariance terms, watch FID fall to 0 as the fakes approach the real stats, read fidelity-vs-diversity off precision/recall, and learn the failure shapes you will actually meet.",
    charts: [
      {
        type: "bars",
        title: "FID = ||mu_r-mu_g||^2 + Tr(S_r+S_g-2(S_r S_g)^1/2): the two terms add up",
        xlabel: "the two pieces of the FID formula, then their sum",
        ylabel: "contribution to FID (lower = closer)",
        labels: ["mean term", "covariance term", "FID total"],
        values: [13.0, 2.0, 15.0],
        valueLabels: ["13.0", "2.0", "15.0"],
        colors: ["#4ea1ff", "#c89bff", "#ffb454"],
        interpret: "FID is just two non-negative pieces added together, and this chart shows their sizes. The blue <b>mean term</b> (13.0) is how far the fake cloud's center sits from the real center; the purple <b>covariance term</b> (2.0) is how differently the two clouds are spread/shaped. Orange is their sum, the <b>FID = 15.0</b>. The reading: here the damage is mostly <b>wrong center</b>, not wrong spread — so the fakes are systematically off-target rather than too narrow or too wide. Lower bars are better; both are 0 only when the clouds match exactly."
      },
      {
        type: "line",
        title: "Healthy: FID drops to 0 as the generated cloud approaches the real stats",
        xlabel: "fraction of the way from a bad generator to the real distribution",
        ylabel: "FID (lower = better)",
        series: [{
          name: "FID",
          color: "#7ee787",
          points: [[0, 31.25], [0.25, 17.58], [0.5, 7.81], [0.75, 1.95], [1.0, 0.0]]
        }],
        interpret: "This is a training curve as it should look. The x-axis is how close the generator's statistics are to the real data (0 = far off, 1 = matched); the y-axis is FID. The curve <b>slides smoothly down to 0</b> and flattens — exactly 0 when the fakes match the reals. Read a real FID-vs-step plot the same way: <b>monotone decrease toward a floor = healthy training</b>. The curve gets steeper near the left (a bad generator improves fast) and flattens near the right (the last bit of FID is the hardest to remove)."
      },
      {
        type: "line",
        title: "Variant — FID plateaus high: generator stops improving (illustrative)",
        xlabel: "training step",
        ylabel: "FID (lower = better)",
        series: [{
          name: "FID stuck",
          color: "#ffb454",
          points: [[0, 120], [1, 70], [2, 48], [3, 42], [4, 40], [5, 39.5], [6, 39.5]]
        }],
        interpret: "A failure you will actually meet (numbers illustrative). FID falls at first, then <b>flattens out far above 0</b> and never reaches a good value. Read it as: the generator learned the easy structure but is <b>stuck</b> — mode collapse, too-small a model, or a learning rate that needs dropping. The tell is the <b>high flat tail</b>: if your FID stops at 40 instead of trending toward single digits, more steps will not help. Compare to the healthy curve above, which keeps descending toward 0."
      },
      {
        type: "line",
        title: "Variant — FID diverges: training destabilises (illustrative)",
        xlabel: "training step",
        ylabel: "FID (lower = better)",
        series: [{
          name: "FID blowing up",
          color: "#ff7b72",
          points: [[0, 90], [1, 55], [2, 38], [3, 45], [4, 80], [5, 140], [6, 210]]
        }],
        interpret: "The GAN-instability signature (numbers illustrative). FID improves for a while, then <b>turns around and climbs</b> — often sharply. Read it as: the generator and discriminator fell out of balance (or the LR is too high), so image quality is now <b>getting worse</b> every step. The lesson: <b>watch the trend, not the best point</b> — checkpoint at the minimum (here ~step 2) and stop, because the curve after it is pure regression. An ever-rising tail means restart with a lower learning rate or a fix to the training dynamics."
      },
      {
        type: "bars",
        title: "Precision (fidelity) vs recall (diversity) for three generators",
        xlabel: "blue = precision (do fakes look real?), green = recall (do fakes cover the range?)",
        ylabel: "fraction (0 to 1)",
        labels: ["lowdiv prec", "lowdiv rec", "lowfid prec", "lowfid rec", "good prec", "good rec"],
        values: [1.0, 0.46, 0.14, 0.28, 0.88, 1.0],
        valueLabels: ["1.00", "0.46", "0.14", "0.28", "0.88", "1.00"],
        colors: ["#4ea1ff", "#7ee787", "#4ea1ff", "#7ee787", "#4ea1ff", "#7ee787"],
        interpret: "Read this in <b>blue/green pairs</b>, one pair per generator. Blue = precision (fidelity: do the fakes look real?); green = recall (diversity: do the fakes cover the full real range?). The <b>low-diversity</b> generator is blue-high/green-low (1.00 / 0.46) — its few faces look real but it ignores most of the range. The <b>low-fidelity</b> one is low/low (0.14 / 0.28) — fakes land off the real manifold. The <b>good</b> one has both bars tall (0.88 / 1.00). This split is exactly what a single FID number hides: a tall-blue/short-green pair is the classic mode-collapse fingerprint."
      },
      {
        type: "bars",
        title: "Inception Score = exp(E_x KL(p(y|x) || p(y))): rewards confident AND varied",
        xlabel: "generator type (3 classes, so the best possible IS is 3.0)",
        ylabel: "Inception Score (higher = better)",
        labels: ["confident + varied", "all one class", "blurry/unsure"],
        values: [2.02, 1.0, 1.01],
        valueLabels: ["2.02", "1.00", "1.01"],
        colors: ["#7ee787", "#ff7b72", "#ffb454"],
        interpret: "Inception Score wants <b>both</b> sharp single images <b>and</b> variety across the batch; this chart shows what each failure does to it. The green generator is confident <i>and</i> spans all 3 classes, so IS is high (2.02, near the max of 3). The red one emits <b>all one class</b> — no variety — so IS collapses to 1.00. The orange one is <b>blurry/unsure</b> (flat label guesses) and also scores ~1.01. The trap to remember: IS only looks at the fakes, <b>never at your real data</b>, so a high IS does not prove the fakes resemble reality — always pair it with FID."
      }
    ],
    caption: "Charts 1, 5 and 6 use concrete hand-computable numbers; the three FID-vs-step curves (2 healthy, 3-4 variants) are illustrative shapes you learn to recognise on a training plot. (1) FID term split: real cloud mu_r=[10,5], S_r=diag(4,1); a bad generator mu_g=[12,8], S_g=diag(9,4) gives mean term 13.0 + covariance term 2.0 = FID 15.0. (5) Precision/recall via k-NN manifolds: low-diversity 1.00/0.46, low-fidelity 0.14/0.28, good 0.88/1.00. (6) Inception Score over 3 classes: confident+varied 2.02, all-one-class 1.00, blurry 1.01 (max = 3.0).",
    code: `import numpy as np
from scipy.linalg import sqrtm

# ---------- (1) FID term-by-term, concrete 2-D Gaussian features ----------
mu_r = np.array([10.0, 5.0]); S_r = np.diag([4.0, 1.0])   # real cloud
def fid(mu_g, S_g):
    covmean = sqrtm(S_r @ S_g)
    if np.iscomplexobj(covmean): covmean = covmean.real
    mean_term = float((mu_r - mu_g) @ (mu_r - mu_g))
    cov_term  = float(np.trace(S_r + S_g - 2 * covmean))
    return mean_term, cov_term, mean_term + cov_term
print("FID terms:", fid(np.array([12.0, 8.0]), np.diag([9.0, 4.0])))  # 13.0 2.0 15.0

# ---------- (2) FID falls as the generator approaches the real stats ----------
mu_far, sd_far = np.array([13.0, 9.0]), np.array([4.0, 2.5])
sd_r = np.sqrt(np.diag(S_r))
for t in [0.0, 0.25, 0.5, 0.75, 1.0]:
    mu_g = (1 - t) * mu_far + t * mu_r
    sd_g = (1 - t) * sd_far + t * sd_r
    print("t=", t, "FID=", round(fid(mu_g, np.diag(sd_g ** 2))[2], 2))
# 31.25 -> 17.58 -> 7.81 -> 1.95 -> 0.0

# ---------- (3) precision (fidelity) & recall (diversity) via k-NN manifolds ----------
def radii(pts, k=3):
    return np.array([np.sort(np.linalg.norm(pts - p, axis=1))[k] for p in pts])
def inside(query, pts, R):
    return np.array([np.any(np.linalg.norm(pts - q, axis=1) <= R) for q in query])
def prec_recall(real, fake):
    Rr, Rf = radii(real), radii(fake)
    return inside(fake, real, Rr).mean(), inside(real, fake, Rf).mean()
np.random.seed(1)
real     = np.random.normal(0, 1.0, (50, 2))
lowdiv   = np.random.normal(0, 0.3, (50, 2))               # tight cluster
lowfid   = np.random.normal(0, 1.0, (50, 2)) + [2.5, 2.5]  # off the manifold
good     = np.random.normal(0, 1.0, (50, 2))
for name, g in [("lowdiv", lowdiv), ("lowfid", lowfid), ("good", good)]:
    p, r = prec_recall(real, g)
    print(name, "precision=", round(p, 2), "recall=", round(r, 2))
# lowdiv 1.00/0.46   lowfid 0.14/0.28   good 0.88/1.00

# ---------- (4) Inception Score = exp(E_x KL(p(y|x) || p(y))) ----------
def inception_score(pyx):
    pyx = np.array(pyx); py = pyx.mean(0)
    kls = [np.sum(row * np.log(row / py)) for row in pyx]
    return float(np.exp(np.mean(kls)))
varied = [[.9, .05, .05], [.05, .9, .05], [.05, .05, .9]]   # confident + varied
oneclass = [[.9, .05, .05]] * 3                              # confident, no variety
blurry = [[.4, .35, .25], [.3, .4, .3], [.3, .3, .4]]        # unsure
print("IS varied=", round(inception_score(varied), 2),
      "oneclass=", round(inception_score(oneclass), 2),
      "blurry=", round(inception_score(blurry), 2))           # 2.02 1.00 1.01`
  };
})();
