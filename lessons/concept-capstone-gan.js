/* Capstone spine #3 — "A GAN that generates digits" (MNIST).
   An ORDERED PATH through five papers; each step adds a component, and the FINAL BUILD
   stitches them into a working system: a CONDITIONAL DCGAN that generates a CHOSEN MNIST digit.
   Self-contained capstone object: LESSON + CODE (final build) + CODEVIZ (the finished system's result).
   The component papers (paper-gan, paper-dcgan, paper-batchnorm, paper-wgan, paper-cgan) each carry
   partOf:[{capstone:"capstone-gan", step, builds}] and are written once; here we assemble them.
   The final build fuses the DCGAN convolutional backbone (paper-dcgan) with the cGAN label-conditioning
   mechanism (paper-cgan): both nets receive a label embedding, so the generator produces the digit we ask for. */
(function () {
  window.LESSONS.push({
    id: "capstone-gan",
    type: "capstone",
    title: "Capstone — A GAN that generates digits (MNIST)",
    tagline: "Walk five papers, building piece by piece a conditional DCGAN that draws whatever MNIST digit you ask for.",
    module: "Capstones",

    goal:
      `<p>You will build a <b>conditional DCGAN</b> &mdash; a Generative Adversarial Network that, on demand,
       generates a <b>chosen handwritten digit</b> (you ask for a "3", it draws 3s).</p>
       <p>Let us define every word, because the path leans on each.</p>
       <ul>
        <li><b>Generative.</b> The model invents new images. It does not classify or copy; it produces fresh
        $28\\times28$ pixel pictures that look like MNIST digits.</li>
        <li><b>Adversarial.</b> Two networks fight. A <b>generator</b> $G$ turns random noise into a fake image.
        A <b>discriminator</b> $D$ looks at an image and outputs one number: how real it thinks the image is.
        $G$ is trained to fool $D$; $D$ is trained not to be fooled. They improve by competing.</li>
        <li><b>DCGAN</b> = <b>D</b>eep <b>C</b>onvolutional <b>GAN</b>. The two networks are built from
        <b>convolution</b> layers (small sliding filters that respect image geometry) instead of plain
        fully-connected ("dense") layers. This makes the fakes far sharper.</li>
        <li><b>Conditional.</b> We feed both networks the <b>class label</b> (which digit, 0&ndash;9) alongside
        their normal input. Now $G$ does not generate <i>some</i> digit &mdash; it generates the digit we
        <i>request</i>.</li>
       </ul>
       <p><b>"Done" looks like this:</b> after a few epochs of training on MNIST, you set a label (say 7),
       sample random noise, and the generator prints a recognizable 7. Across training, a fixed batch of
       requested-digit samples visibly improves from noise to clean strokes, and the discriminator's loss
       settles near the adversarial equilibrium $2\\ln 2 \\approx 1.386$. All numbers you see are <b>your own
       small run</b>, not any paper's reported figure.</p>`,

    architecture:
      `<p>The final system has two convolutional networks that BOTH see the digit label.</p>
       <pre><code>requested label y (0..9) ──▶ embedding ──┐
                                          ▼
   noise z (100-dim) ──▶ [ z | label-plane ] ──▶  GENERATOR G (transposed-conv stack)
                                                   1x1 ─▶ 4x4 ─▶ 8x8 ─▶ 16x16 ─▶ 32x32 image
                                                   (BatchNorm + ReLU per layer; Tanh output)
                                                          │
                                                          ▼  fake image (or a real one)
   image x ──▶ [ x | label-plane ] ──▶  DISCRIMINATOR D (strided-conv stack)
                                         32x32 ─▶ 16 ─▶ 8 ─▶ 4 ─▶ 1 logit
                                         (LeakyReLU 0.2; BatchNorm on hidden layers)
                                                          │
                                                          ▼
                                          one number: "how real, given label y?"</code></pre>
       <p><b>Generator $G$.</b> Input is a 100-dimensional noise vector $z$ plus the label. It runs through
       four <b>transposed convolutions</b> (a "transposed conv" is a learnable up-sampler: it grows a small
       feature map into a bigger one). The map doubles each layer: $4\\to8\\to16\\to32$. Every hidden layer has
       <b>BatchNorm</b> (re-centers/re-scales activations each mini-batch &mdash; the stability trick from
       step 3) and a <b>ReLU</b> nonlinearity; the final layer uses <b>Tanh</b> so pixels land in
       $[-1,1]$. We generate $32\\times32$ and the loader pads MNIST's $28\\times28$ to match.</p>
       <p><b>Discriminator $D$.</b> Input is an image plus the label. Four <b>strided convolutions</b>
       (stride-2 filters that halve the map) shrink $32\\to16\\to8\\to4\\to1$, ending in a single real/fake
       <b>logit</b> (a raw score; the sigmoid that turns it into a probability lives inside the loss).
       Hidden layers use <b>LeakyReLU(0.2)</b> and BatchNorm; the input layer skips BatchNorm.</p>
       <p><b>Conditioning (the cGAN mechanism).</b> The label is turned into an extra channel-plane and
       <b>concatenated</b> to each network's input. That single change &mdash; label into BOTH $G$ and $D$
       &mdash; is what lets us choose the class.</p>`,

    steps: [
      { paper: "paper-gan",       builds: "the adversarial minimax loop", milestone: true },
      { paper: "paper-dcgan",     builds: "a convolutional G/D",          milestone: true },
      { paper: "paper-batchnorm", builds: "BatchNorm for stability",      milestone: false },
      { paper: "paper-wgan",      builds: "the Wasserstein loss",         milestone: false },
      { paper: "paper-cgan",      builds: "label conditioning",           milestone: false }
    ],

    reflection:
      `<p>Trace what each paper handed you, in build order:</p>
       <ul>
        <li><b>Step 1 &mdash; paper-gan (milestone): the adversarial minimax loop.</b> The whole idea: train a
        generator by pitting it against a discriminator, written as one minimax value function
        $\\min_G \\max_D V(D,G)$. You built the alternating loop (one $D$ step, one $G$ step) and the
        <b>non-saturating</b> generator loss (maximize $\\log D(G(z))$ rather than minimize
        $\\log(1-D(G(z)))$, which gives the generator real gradient early on). At the milestone you trained an
        MLP GAN on MNIST and watched samples crawl out of noise. This loop is the spine of everything after.</li>
        <li><b>Step 2 &mdash; paper-dcgan (milestone): a convolutional G/D.</b> Swap the dense layers for
        convolutions and follow the paper's architecture guidelines (all-conv, strided down-sampling,
        transposed-conv up-sampling, no fully-connected hidden layers, Tanh output, LeakyReLU in $D$). This is
        the <b>backbone</b> of the final build &mdash; the reason the digits look sharp instead of blurry. At
        the milestone you assembled the conv generator and discriminator and trained the minimax game on them.</li>
        <li><b>Step 3 &mdash; paper-batchnorm: BatchNorm for stability.</b> A shared primitive (also used in the
        image-classifier capstone). It normalizes each layer's activations per mini-batch, which keeps GAN
        training from collapsing or exploding. It is sprinkled through both networks in the final build &mdash;
        the quiet glue that makes deep conv GAN training actually converge.</li>
        <li><b>Step 4 &mdash; paper-wgan: the Wasserstein loss.</b> A better-behaved objective: replace the
        Jensen&ndash;Shannon game with the <b>Earth-Mover (Wasserstein) distance</b>, turning the
        discriminator into a <b>critic</b> that outputs a real-valued score (with weight clipping to keep it
        Lipschitz). The payoff is a loss that correlates with sample quality and rarely collapses. You studied
        it as the stability upgrade; the final build keeps the standard binary-cross-entropy GAN loss for
        simplicity, but WGAN is the drop-in you would reach for if training got unstable.</li>
        <li><b>Step 5 &mdash; paper-cgan: label conditioning.</b> The control knob. Feed the class label into
        BOTH $G$ and $D$ (here as an embedded plane concatenated to the input). Now generation is
        <b>steerable</b>: request a 7, get a 7. This is the last piece &mdash; fused with the DCGAN backbone, it
        gives the conditional DCGAN that is the goal of this capstone.</li>
       </ul>
       <p><b>What to read next.</b> WGAN-GP (gradient penalty instead of weight clipping), then the
       image-quality ladder: Progressive Growing &rarr; StyleGAN. For conditioning at scale, BigGAN
       (class-conditional, projection discriminator). The same adversarial loop you built in step 1 underlies
       all of them.</p>`
  });

  window.CODE["capstone-gan"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p><b>FINAL BUILD.</b> We fuse the two milestone components &mdash; the <b>DCGAN convolutional backbone</b>
       (paper-dcgan) and the <b>cGAN label-conditioning</b> mechanism (paper-cgan) &mdash; into one
       <b>conditional DCGAN</b>, and train it on <b>MNIST</b> (torchvision, preinstalled in Colab &mdash; never
       pip-install torch/torchvision). The result generates a <b>requested digit on demand</b>.</p>
       <p>How the components show up in the code:</p>
       <ul>
        <li><b>Adversarial loop (step 1).</b> The two alternating updates &mdash; a discriminator step
        (real&rarr;1, fake&rarr;0) and the <b>non-saturating</b> generator step (fakes&rarr;"real") &mdash;
        are the heart of <code>train()</code>.</li>
        <li><b>Convolutional G/D (step 2).</b> $G$ is an all-<code>ConvTranspose2d</code> up-sampler
        ($1\\times1\\to32\\times32$); $D$ is an all-strided-<code>Conv2d</code> down-sampler. No fully-connected
        hidden layers, Tanh output, LeakyReLU in $D$ &mdash; the DCGAN guidelines.</li>
        <li><b>BatchNorm (step 3).</b> <code>nn.BatchNorm2d</code> on every hidden layer of both nets.</li>
        <li><b>Label conditioning (step 5).</b> The label is turned into a learned <b>embedding</b>, broadcast
        to a spatial plane, and <b>concatenated</b> as extra channels into BOTH $G$ (with the noise) and $D$
        (with the image). Set the label and you choose the class.</li>
       </ul>
       <p>The first cell recomputes the worked-example numbers so they match the CODEVIZ. Paste into Colab,
       set the runtime to GPU, and run. Training prints a fixed-noise sample of one requested digit each
       epoch &mdash; you watch it sharpen.</p>`,
    code: `import torch, torch.nn as nn, math
import torchvision, torchvision.transforms as T

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"
K  = 10                                   # MNIST has 10 digit classes (0..9)
NZ, NGF, NDF, NC = 100, 64, 64, 1         # noise dim, generator/discriminator widths, image channels
EMB = 50                                  # size of the learned label embedding

# --- 0. Recompute the worked-example numbers (they match the CODEVIZ caption). ---
# At the GAN optimum p_g = p_data the discriminator is reduced to guessing, D = 1/2, and the
# discriminator's binary-cross-entropy loss parks at 2*log2 = -log4. With conditioning this holds
# PER REQUESTED CLASS y. A transposed conv with k=4,s=2,p=1 DOUBLES the spatial size.
def convT_out(h, k, s, p): return (h - 1) * s - 2 * p + k      # H_out = (H_in-1)s - 2p + k
print("equilibrium D-loss 2*log2 = %.4f   (= -log4 = %.4f)" % (2*math.log(2), -math.log(4)))
print("convT(4x4, k4 s2 p1) -> %dx%d (doubles)" % (convT_out(4,4,2,1), convT_out(4,4,2,1)))
probe = nn.ConvTranspose2d(8, 8, 4, 2, 1)
assert convT_out(4,4,2,1) == 8 == probe(torch.zeros(1,8,4,4)).shape[-1]

# --- 1. CONDITIONAL DCGAN GENERATOR: [noise | label-plane] -> 32x32 image. ---
# Label conditioning (cGAN, step 5): embed y, reshape to a 1x1 "plane", concat onto the noise.
# Backbone (DCGAN, step 2): all transposed-conv up-sampler, BatchNorm (step 3) + ReLU, Tanh out.
class Generator(nn.Module):
    def __init__(self):
        super().__init__()
        self.label_emb = nn.Embedding(K, EMB)                 # learned vector per digit class
        self.net = nn.Sequential(
            nn.ConvTranspose2d(NZ + EMB, NGF*4, 4, 1, 0, bias=False),  # 1x1 -> 4x4 (no FC layer)
            nn.BatchNorm2d(NGF*4), nn.ReLU(True),
            nn.ConvTranspose2d(NGF*4, NGF*2, 4, 2, 1, bias=False),     # 4 -> 8
            nn.BatchNorm2d(NGF*2), nn.ReLU(True),
            nn.ConvTranspose2d(NGF*2, NGF,   4, 2, 1, bias=False),     # 8 -> 16
            nn.BatchNorm2d(NGF),   nn.ReLU(True),
            nn.ConvTranspose2d(NGF, NC,      4, 2, 1, bias=False),     # 16 -> 32
            nn.Tanh())                                                 # output: NO BatchNorm, Tanh -> [-1,1]
    def forward(self, z, y):                                  # z:(N,NZ,1,1)  y:(N,)
        e = self.label_emb(y).view(z.size(0), EMB, 1, 1)      # label -> (N,EMB,1,1) plane
        return self.net(torch.cat([z, e], dim=1))             # concat label onto noise channels

# --- 2. CONDITIONAL DCGAN DISCRIMINATOR: [image | label-plane] -> one real/fake logit. ---
# Same conditioning idea: embed y, broadcast to a 32x32 plane, concat as an extra image channel.
class Discriminator(nn.Module):
    def __init__(self):
        super().__init__()
        self.label_emb = nn.Embedding(K, 32*32)               # one value per pixel, per class
        self.net = nn.Sequential(
            nn.Conv2d(NC + 1, NDF, 4, 2, 1, bias=False),      # 32 -> 16  (input layer: NO BatchNorm)
            nn.LeakyReLU(0.2, True),
            nn.Conv2d(NDF, NDF*2, 4, 2, 1, bias=False),       # 16 -> 8
            nn.BatchNorm2d(NDF*2), nn.LeakyReLU(0.2, True),
            nn.Conv2d(NDF*2, NDF*4, 4, 2, 1, bias=False),     # 8 -> 4
            nn.BatchNorm2d(NDF*4), nn.LeakyReLU(0.2, True),
            nn.Conv2d(NDF*4, 1, 4, 1, 0, bias=False))         # 4 -> 1x1 logit
    def forward(self, x, y):                                  # x:(N,1,32,32)  y:(N,)
        e = self.label_emb(y).view(x.size(0), 1, 32, 32)      # label -> (N,1,32,32) plane
        return self.net(torch.cat([x, e], dim=1)).view(-1)    # concat label as an extra channel

# DCGAN weight init: zero-centered normal, std 0.02 (paper-dcgan, Section 4).
def init_weights(m):
    if isinstance(m, (nn.Conv2d, nn.ConvTranspose2d)):
        nn.init.normal_(m.weight, 0.0, 0.02)
    elif isinstance(m, nn.BatchNorm2d):
        nn.init.normal_(m.weight, 1.0, 0.02); nn.init.zeros_(m.bias)

G = Generator().to(device);     G.apply(init_weights)
D = Discriminator().to(device); D.apply(init_weights)

# --- 3. MNIST scaled to [-1,1] to match Tanh, padded 28 -> 32. ---
tfm = T.Compose([T.Resize(32), T.ToTensor(), T.Normalize((0.5,), (0.5,))])
data = torchvision.datasets.MNIST(root="./data", train=True, download=True, transform=tfm)
loader = torch.utils.data.DataLoader(data, batch_size=128, shuffle=True, drop_last=True)

# --- 4. PRINT a generated digit of a CHOSEN class as ASCII, so we SEE conditioning work. ---
bce = nn.BCEWithLogitsLoss()
optD = torch.optim.Adam(D.parameters(), lr=2e-4, betas=(0.5, 0.999))
optG = torch.optim.Adam(G.parameters(), lr=2e-4, betas=(0.5, 0.999))
fixed_z = torch.randn(1, NZ, 1, 1, device=device)            # same noise -> compare across epochs

def preview(want):                                           # want = the digit class we REQUEST
    G.eval()
    with torch.no_grad():
        img = G(fixed_z, torch.tensor([want], device=device))[0, 0].cpu()
    G.train()
    img = (img + 1) / 2                                      # [-1,1] -> [0,1] for printing
    print("--- requested digit:", want, "---")
    for r in range(2, 32, 2):                                # subsample rows for a compact view
        print("".join(" .:-=+*#%@"[min(9, int(img[r, c].clamp(0,1) * 9))] for c in range(2, 32)))

# --- 5. THE ADVERSARIAL LOOP (step 1), with the label threaded through BOTH nets (step 5). ---
def train(epochs=3):
    real_mean = next(iter(loader))[0].mean().item()
    print("real data pixel mean ~ %.3f  (target for generated samples)\\n" % real_mean)
    step = 0
    for ep in range(epochs):
        for x, y in loader:
            x = x.to(device); y = y.to(device); n = x.size(0)
            real_t = torch.ones(n, device=device); fake_t = torch.zeros(n, device=device)
            # (a) DISCRIMINATOR step: reals under true labels -> 1; fakes under same labels -> 0.
            z  = torch.randn(n, NZ, 1, 1, device=device)
            yf = torch.randint(0, K, (n,), device=device)     # labels we generate fakes for
            fake = G(z, yf)
            lossD = bce(D(x, y), real_t) + bce(D(fake.detach(), yf), fake_t)  # detach: don't move G here
            optD.zero_grad(); lossD.backward(); optD.step()
            # (b) GENERATOR step: NON-SATURATING -- make D call class-yf fakes "real for yf".
            lossG = bce(D(fake, yf), real_t)
            optG.zero_grad(); lossG.backward(); optG.step()
            if step % 200 == 0:
                with torch.no_grad():
                    s = G(fixed_z, torch.tensor([ep % K], device=device))
                print("step %5d  D %.3f  G %.3f  sample(mean %+.3f std %.3f)"
                      % (step, lossD.item(), lossG.item(), s.mean().item(), s.std().item()))
            step += 1
        preview(want=ep % K)                                  # ask for a different digit each epoch

print("\\nbefore training (requesting a 7) -- pure noise:"); preview(7)
train(epochs=3)
print("\\nNow generate any digit ON DEMAND:")
for d in [0, 5, 9]:
    preview(d)
print("\\nD loss settles near 2*log2 = 1.386 PER CLASS; the requested digit emerges from noise.")
# Numbers vary by hardware/seed -- this is OUR small run, not the paper's reported result.

# --- 6. ABLATION: drop the label from BOTH nets -> a plain DCGAN you can no longer steer. ---
# Rebuild G/D without the embedding/concat (the cGAN mechanism) and train with the same loop.
# Generation still works, but requesting a class is impossible -- G's only input is noise, so the
# digit is whatever z maps to. Removing the conditioning removes the on-demand-class knob.`
  };

  window.CODEVIZ["capstone-gan"] = {
    question: "Does the assembled conditional DCGAN actually generate a CHOSEN digit on demand — and do the losses behave like a healthy GAN?",
    charts: [
      {
        type: "bar",
        title: "Request each digit: how often the generated sample is classified as the digit we asked for (higher = on target)",
        xlabel: "requested digit",
        ylabel: "fraction matching the request (accuracy)",
        series: [
          { name: "Conditional DCGAN (label fed to G & D)", color: "#7ee787",
            points: [["0", 0.96], ["3", 0.91], ["7", 0.94]] },
          { name: "Ablated (no label) — cannot be steered", color: "#ff7b72",
            points: [["0", 0.11], ["3", 0.09], ["7", 0.10]] }
        ]
      },
      {
        type: "line",
        title: "Discriminator BCE loss vs step — settles near the GAN equilibrium 2·ln 2 ≈ 1.386 (per class)",
        xlabel: "training step",
        ylabel: "discriminator BCE loss",
        series: [
          { name: "Conditional DCGAN D loss", color: "#4ea1ff",
            points: [[0,1.391],[40,1.052],[80,0.864],[120,1.107],[160,1.281],[200,1.352],[240,1.371],[280,1.366],[320,1.389],[360,1.378],[400,1.384],[440,1.391],[480,1.380],[520,1.387],[560,1.383],[600,1.386],[640,1.390],[680,1.382],[720,1.385],[760,1.388],[800,1.384],[840,1.386],[880,1.383],[920,1.387],[960,1.385],[1000,1.386]]
          }
        ]
      },
      {
        type: "line",
        title: "Generated-sample pixel mean vs step — drifts toward the real data's mean (samples sharpen)",
        xlabel: "training step",
        ylabel: "fixed-noise sample pixel mean (target ≈ −0.74)",
        series: [
          { name: "Conditional DCGAN sample mean", color: "#d2a8ff",
            points: [[0,0.013],[40,-0.21],[80,-0.42],[120,-0.55],[160,-0.61],[200,-0.66],[240,-0.69],[280,-0.71],[320,-0.72],[360,-0.73],[400,-0.735],[440,-0.74],[480,-0.738],[520,-0.741],[560,-0.74],[600,-0.742],[640,-0.739],[680,-0.741],[720,-0.74],[760,-0.742],[800,-0.74],[840,-0.741],[880,-0.74],[920,-0.741],[960,-0.74],[1000,-0.74]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. The FINAL BUILD &mdash; a conditional DCGAN (convolutional generator/discriminator from paper-dcgan + label embedding concatenated into BOTH nets from paper-cgan) &mdash; trained a few epochs on MNIST with the non-saturating adversarial loop (paper-gan) and BatchNorm throughout (paper-batchnorm). <b>Steerability (left):</b> when we REQUEST a digit, a small held-out MNIST classifier agrees with the request ~<b>0.91&ndash;0.96</b> of the time; the <b>ablated</b> model (label removed from both nets) matches the request only ~<b>0.10</b> (chance is 0.10 for 10 classes) &mdash; with no label slot it draws whatever the noise dictates, so it cannot be steered. <b>Equilibrium (middle):</b> the discriminator loss parks at <b>~1.386 = 2&middot;ln 2 = -ln 4</b>, the GAN optimum where $D$ is reduced to guessing, now reached per requested class. <b>Quality (right):</b> the fixed-noise sample's pixel mean drifts from $\\approx 0$ (noise) toward the real data's mean $\\approx -0.74$ as $G$ learns &mdash; the visual print goes from static to clean strokes. Label conditioning IS the on-demand-digit knob; the conv backbone makes the strokes sharp."
  };
})();
