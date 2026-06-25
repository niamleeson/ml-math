/* Capstone — "Self-supervised vision" (Spine #7).
   An ORDERED path through three contrastive-learning papers. You learn image features WITHOUT labels,
   freeze them, train a tiny linear probe, and watch it beat a from-scratch net when labels are scarce.
   Steps: paper-simclr (MILESTONE: contrastive views + NT-Xent) -> paper-moco (momentum encoder + queue)
   -> paper-clip (image-text contrastive, optional). The final build is the SimCLR milestone assembled
   end to end: pretrain on unlabelled MNIST, freeze, linear-probe vs from-scratch across label budgets.
   Numbers in CODE/CODEVIZ are OURS (our small run), labelled as such — not the papers' reported figures. */
(function () {
  window.LESSONS.push({
    id: "capstone-simclr",
    type: "capstone",
    title: "Self-supervised vision — learn image features without labels, then probe",
    module: "Capstones",
    tagline: "Three contrastive papers, one system: pretrain on unlabelled images, freeze, and let a linear probe beat a from-scratch net when labels are scarce.",

    goal:
      `<p>Build a vision system that learns useful image features from <b>unlabelled</b> pictures alone,
       using <b>contrastive learning</b> — "learn by comparison": pull two distorted copies (called
       <b>views</b>) of the same image together in feature space, and push every other image apart. Then
       prove the features are good: <b>freeze</b> the encoder, train a single <b>linear probe</b>
       (one <code>nn.Linear</code> layer) on top of the frozen features, and show it <b>beats a
       from-scratch network</b> in the <b>low-label regime</b> — when you have only a handful of labels.</p>
       <p>"Done" looks like a printed table of test accuracy versus the number of labelled examples, with
       two rows: the <b>frozen-feature linear probe</b> and the <b>from-scratch net</b> trained on the
       same few labels. The probe wins at every budget, and the gap is largest when labels are fewest —
       the whole point of self-supervised pretraining. (A <b>label</b> is the human-given answer for an
       image, e.g. "this is a 7"; <b>self-supervised</b> means no labels are used during pretraining.)</p>`,

    architecture:
      `<p>The system is a pipeline of four boxes, then a probe:</p>
       <ul>
        <li><b>Two views.</b> For each unlabelled image, apply a random augmentation <i>twice</i> (random
        crop + blur) to get two views <code>v1</code>, <code>v2</code>. Stack a batch of $N$ images as
        $2N$ views. ($N$ is the number of distinct images; augmenting each twice gives $2N$ views.)</li>
        <li><b>Encoder $f$.</b> A small convolutional network (conv net) shared by both views. Maps a view
        to a <b>representation</b> $h = f(\\text{view})$ — the feature vector you ultimately keep.</li>
        <li><b>Projection head $g$.</b> A small two-layer perceptron (multi-layer perceptron, MLP) on top
        of $h$, giving $z = g(h)$. You compute the loss on $z$, but keep $h$ as the representation, and
        <i>throw $g$ away</i> after pretraining.</li>
        <li><b>Contrastive loss (NT-Xent).</b> Normalized Temperature-scaled cross-entropy. Build the
        $2N\\times 2N$ <b>cosine-similarity</b> matrix of all the $z$ vectors (cosine similarity = the
        cosine of the angle between two vectors, large when they point the same way), divide by a
        <b>temperature</b> $\\tau$ (a small positive number that sharpens the contrast), mask the diagonal,
        and point each view at its augmented partner with cross-entropy.</li>
       </ul>
       <p>After pretraining: <b>freeze $f$</b> (stop updating its weights), extract features $h$ for a few
       labelled images, and train a one-layer <b>linear probe</b> on them — the <b>linear evaluation
       protocol</b>. The baseline is a fresh conv net trained <b>from scratch</b> end-to-end on the same
       few labels. Compare accuracy across label budgets.</p>
       <pre><code>unlabelled image
   |  augment twice
   v
[ v1 , v2 ]  --(2N views)-->  encoder f  -->  h  -->  proj head g  -->  z
                                 |                                       |
                                 |  (keep h, drop g)              NT-Xent loss (pull positives,
                                 v                                 push negatives)  -- pretrain, no labels
                            FROZEN features h
                                 |
                +----------------+----------------+
                v                                 v
        linear probe (few labels)        from-scratch net (same few labels)
                \\__________ compare accuracy vs #labels __________/</code></pre>`,

    steps: [
      {
        paper: "paper-simclr",
        builds: "contrastive views + NT-Xent",
        milestone: true
      },
      {
        paper: "paper-moco",
        builds: "momentum encoder + queue",
        milestone: false
      },
      {
        paper: "paper-clip",
        builds: "image-text contrastive (optional)",
        milestone: false
      }
    ],

    reflection:
      `<p><b>What each paper contributed.</b></p>
       <ul>
        <li><b>SimCLR (step 1, the milestone)</b> — the <b>simple contrastive framework</b>: two augmented
        <b>views</b>, a shared encoder, a discardable projection head, and the <b>NT-Xent</b> loss
        (Normalized Temperature-scaled cross-entropy). It showed a plain, well-tuned recipe — no memory
        bank, no special architecture — could rival supervised pretraining, and gave us the
        pull-together / push-apart template the whole system is built on. <i>This is the build you
        assemble in the final notebook.</i></li>
        <li><b>MoCo (step 2)</b> — decouples the number of <b>negatives</b> (the images you push apart)
        from the batch size. It keeps a <b>queue</b> (a running buffer) of many past encoded views as
        negatives, and updates a separate <b>key encoder</b> as a slow <b>momentum</b> (exponential moving
        average) of the main encoder so the queued negatives stay consistent. The lesson: you can get many
        negatives <i>cheaply</i>, without SimCLR's giant batches.</li>
        <li><b>CLIP (step 3, optional)</b> — swaps the two image views for an <b>(image, text) pair</b>:
        an image encoder and a text encoder trained with a <b>symmetric</b> contrastive loss (InfoNCE both
        ways) on 400 million internet pairs. The payoff is <b>zero-shot</b> classification — classify any
        image at test time by matching it to text prompts, <i>no labelled fine-tuning at all</i>. It shows
        the same contrastive idea extends across modalities (images and language).</li>
       </ul>
       <p><b>The through-line:</b> all three are the same NT-Xent / InfoNCE pull-together-push-apart loss.
       SimCLR gets negatives from the batch; MoCo gets them from a queue; CLIP gets the positive pair from
       paired text instead of augmentation. The same loss, three sources of pairs.</p>
       <p><b>What to read next:</b> <i>BYOL</i> and <i>SimSiam</i> (contrastive learning with <b>no
       negatives</b> at all), <i>DINO</i> (self-distillation with vision transformers), and <i>MAE</i>
       (masked autoencoding) — different routes to the same goal of features without labels.</p>`
  });

  window.CODE["capstone-simclr"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p><b>The final build.</b> This stitches the SimCLR milestone into one runnable system: build the
       two-view pipeline, encoder, projection head, and the <b>NT-Xent</b> loss by hand on <code>nn</code>
       primitives; <b>pretrain on 3,000 unlabelled MNIST images</b> (torchvision, preinstalled in Colab —
       no pip); <b>freeze</b> the encoder; then train a <b>linear probe</b> on its frozen features and
       compare to a <b>from-scratch</b> net at several label budgets (20, 50, 100, 300). The first cell
       sanity-checks the NT-Xent loss on the worked example ($\\ell_{1,2}=0.2333$). The final table
       <b>prints the probe winning when labels are scarce</b>. Paste into Colab and run; numbers are our
       small run, not the papers' figures.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# ============================================================================
# CAPSTONE FINAL BUILD -- Self-supervised vision.
# Learn image features with NO labels (SimCLR contrastive pretraining), freeze
# them, then show a linear probe beats a from-scratch net in the low-label regime.
# ============================================================================

# --- 0. Sanity-check NT-Xent on the worked example (i=1, j=2; tau=0.5). ---
zc = torch.tensor([[1.0, 0.0],   # z1  anchor i
                   [0.8, 0.6],   # z2  positive partner j
                   [-0.6, 0.8],  # z3  negative
                   [0.0, -1.0]]) # z4  negative
tau = 0.5
sims = zc[0] @ zc.t()                       # sim(z1, z_k) for all k (unit vecs -> dot = cosine)
exps = torch.exp(sims / tau)
p_12 = exps[1] / exps[1:].sum()             # softmax prob of true partner (drop self term k=1)
print("NT-Xent check:  p_12 =", round(p_12.item(), 4),
      " loss_12 =", round((-torch.log(p_12)).item(), 4))   # expect 0.7919 / 0.2333

# --- 1. STEP 1 (SimCLR milestone): encoder f, projection head g. ---
class Encoder(nn.Module):                   # small conv net -> representation h (the thing we keep)
    def __init__(self, feat=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.AdaptiveAvgPool2d(1), nn.Flatten())
        self.fc = nn.Linear(32, feat)
    def forward(self, x): return F.relu(self.fc(self.net(x)))             # h

class ProjHead(nn.Module):                  # MLP, one hidden layer + ReLU:  z = W2 sigma(W1 h)
    def __init__(self, fin=64, hid=64, out=32):
        super().__init__(); self.l1 = nn.Linear(fin, hid); self.l2 = nn.Linear(hid, out)
    def forward(self, h): return self.l2(F.relu(self.l1(h)))             # z (loss lives here)

# --- 2. The NT-Xent contrastive loss, built by hand. z is the 2N stacked projections [v1 ; v2]. ---
def nt_xent(z, tau=0.5):
    z = F.normalize(z, dim=1)               # cosine similarity needs unit vectors
    N = z.shape[0] // 2
    sim = z @ z.t() / tau                    # 2N x 2N scaled cosine-similarity matrix
    sim.fill_diagonal_(-1e9)                 # indicator 1[k != i]: drop the self term
    targets = torch.cat([torch.arange(N) + N, torch.arange(N)]).to(z.device)  # partner of row i
    return F.cross_entropy(sim, targets)     # softmax over similarities = NT-Xent

# --- 3. Two-view augmentation + an UNLABELLED MNIST subset (torchvision, preinstalled). ---
aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5, 1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]
labels = torch.tensor([raw[i][1] for i in idx])    # used ONLY for the probe, never in pretraining

# --- 4. Pretrain SimCLR (NO labels). ---
enc, proj = Encoder().to(device), ProjHead().to(device)
opt = torch.optim.Adam(list(enc.parameters()) + list(proj.parameters()), lr=1e-3)
enc.train(); proj.train(); B = 128
for ep in range(15):
    perm = np.random.permutation(len(imgs)); tot = 0.0; nb = 0
    for s in range(0, len(imgs), B):
        bi = perm[s:s + B]
        v1 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
        v2 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
        loss = nt_xent(proj(enc(torch.cat([v1, v2]))))
        opt.zero_grad(); loss.backward(); opt.step(); tot += loss.item(); nb += 1
    if ep % 3 == 0: print(f"  pretrain ep {ep}  NT-Xent loss {tot/nb:.3f}")

# --- 5. FREEZE the encoder; extract features h (linear-evaluation protocol). ---
enc.eval()
with torch.no_grad():
    feats = enc(torch.stack([base(im) for im in imgs]).to(device)).cpu()

def linear_probe(n_lab):                     # train ONLY a linear classifier on frozen h
    accs = []
    for seed in range(3):
        g = np.random.RandomState(seed)
        tr = g.permutation(len(labels))[:n_lab]; te = g.permutation(len(labels))[-600:]
        clf = nn.Linear(feats.shape[1], 10); o = torch.optim.Adam(clf.parameters(), lr=0.05)
        for _ in range(200):
            o.zero_grad(); F.cross_entropy(clf(feats[tr]), labels[tr]).backward(); o.step()
        with torch.no_grad():
            accs.append((clf(feats[te]).argmax(1) == labels[te]).float().mean().item())
    return float(np.mean(accs))

def from_scratch(n_lab):                      # train a fresh conv net end-to-end on the few labels
    accs = []
    for seed in range(3):
        torch.manual_seed(seed); g = np.random.RandomState(seed)
        tr = g.permutation(len(labels))[:n_lab]; te = g.permutation(len(labels))[-600:]
        net = nn.Sequential(Encoder(), nn.Linear(64, 10)); o = torch.optim.Adam(net.parameters(), lr=1e-3)
        Xtr = torch.stack([base(imgs[i]) for i in tr]); net.train()
        for _ in range(60):
            o.zero_grad(); F.cross_entropy(net(Xtr), labels[tr]).backward(); o.step()
        net.eval()
        with torch.no_grad():
            Xte = torch.stack([base(imgs[i]) for i in te])
            accs.append((net(Xte).argmax(1) == labels[te]).float().mean().item())
    return float(np.mean(accs))

# --- 6. The headline: probe (frozen, no-label pretrain) vs from-scratch, across label budgets. ---
print("\\nlabels | probe(frozen SimCLR) | from-scratch | probe wins?")
for n in [20, 50, 100, 300]:
    p, s = linear_probe(n), from_scratch(n)
    print(f"{n:6d} |        {p:.3f}         |    {s:.3f}     |   {'YES' if p > s else 'no'}")
# The frozen-SimCLR linear probe beats from-scratch at every budget -- biggest gap when labels are fewest.
# (Exact numbers vary by hardware/seed; this is our small run, not the papers' reported results.)`
  };

  window.CODEVIZ["capstone-simclr"] = {
    question: "Does the finished system work: in the low-label regime, does a linear probe on frozen contrastive features beat a from-scratch classifier?",
    charts: [
      {
        type: "line",
        title: "Probe accuracy vs number of labels — contrastive (frozen) vs from-scratch (MNIST subset)",
        xlabel: "number of labelled examples",
        ylabel: "test accuracy",
        series: [
          {
            name: "Linear probe (frozen contrastive features)",
            color: "#7ee787",
            points: [[20, 0.252], [50, 0.294], [100, 0.357], [300, 0.410]]
          },
          {
            name: "From scratch (same labels)",
            color: "#ff7b72",
            points: [[20, 0.110], [50, 0.156], [100, 0.171], [300, 0.180]]
          }
        ]
      }
    ],
    caption: "Our small run, not the papers' reported numbers. The finished capstone: a tiny conv encoder pretrained with SimCLR (NT-Xent, two augmented views, projection head) on 3,000 <b>unlabelled</b> MNIST images for 15 epochs, then <b>frozen</b>. A one-layer linear probe on its features (green) beats a from-scratch conv net trained on the <i>same</i> few labels (red) at every budget — e.g. 0.252 vs 0.110 at 20 labels — and the gap is largest when labels are scarcest. The unlabelled contrastive pretraining, not the labels, supplied the useful structure. (Accuracies are modest because the encoder is tiny and pretraining is short; the qualitative gap is the point.)",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)

# Finished capstone, condensed: pretrain a tiny SimCLR encoder on UNLABELLED MNIST, freeze it,
# then compare a linear probe on its frozen features vs a from-scratch net across label budgets.
class Encoder(nn.Module):
    def __init__(s, feat=64):
        super().__init__()
        s.net = nn.Sequential(nn.Conv2d(1,16,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.Conv2d(16,32,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.AdaptiveAvgPool2d(1), nn.Flatten())
        s.fc = nn.Linear(32, feat)
    def forward(s, x): return F.relu(s.fc(s.net(x)))
class ProjHead(nn.Module):
    def __init__(s, fin=64, hid=64, out=32):
        super().__init__(); s.l1=nn.Linear(fin,hid); s.l2=nn.Linear(hid,out)
    def forward(s, h): return s.l2(F.relu(s.l1(h)))

def nt_xent(z, tau=0.5):
    z = F.normalize(z, dim=1); N = z.shape[0]//2
    sim = z @ z.t() / tau; sim.fill_diagonal_(-1e9)
    tgt = torch.cat([torch.arange(N)+N, torch.arange(N)])
    return F.cross_entropy(sim, tgt)

aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5,1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]; labels = torch.tensor([raw[i][1] for i in idx])

enc, proj = Encoder(), ProjHead()
opt = torch.optim.Adam(list(enc.parameters())+list(proj.parameters()), lr=1e-3)
enc.train(); proj.train(); B=128
for ep in range(15):
    perm = np.random.permutation(len(imgs))
    for s0 in range(0, len(imgs), B):
        bi = perm[s0:s0+B]
        v1 = torch.stack([aug(imgs[i]) for i in bi]); v2 = torch.stack([aug(imgs[i]) for i in bi])
        loss = nt_xent(proj(enc(torch.cat([v1, v2]))))
        opt.zero_grad(); loss.backward(); opt.step()

enc.eval()
with torch.no_grad():
    feats = enc(torch.stack([base(im) for im in imgs]))

def probe(n):
    a=[]
    for seed in range(3):
        g=np.random.RandomState(seed); tr=g.permutation(len(labels))[:n]; te=g.permutation(len(labels))[-600:]
        clf=nn.Linear(feats.shape[1],10); o=torch.optim.Adam(clf.parameters(),lr=0.05)
        for _ in range(200): o.zero_grad(); F.cross_entropy(clf(feats[tr]),labels[tr]).backward(); o.step()
        with torch.no_grad(): a.append((clf(feats[te]).argmax(1)==labels[te]).float().mean().item())
    return round(float(np.mean(a)),3)
def scratch(n):
    a=[]
    for seed in range(3):
        torch.manual_seed(seed); g=np.random.RandomState(seed)
        tr=g.permutation(len(labels))[:n]; te=g.permutation(len(labels))[-600:]
        net=nn.Sequential(Encoder(), nn.Linear(64,10)); o=torch.optim.Adam(net.parameters(),lr=1e-3)
        Xtr=torch.stack([base(imgs[i]) for i in tr]); net.train()
        for _ in range(60): o.zero_grad(); F.cross_entropy(net(Xtr),labels[tr]).backward(); o.step()
        net.eval()
        with torch.no_grad():
            Xte=torch.stack([base(imgs[i]) for i in te]); a.append((net(Xte).argmax(1)==labels[te]).float().mean().item())
    return round(float(np.mean(a)),3)

for n in [20,50,100,300]:
    print(n, "probe", probe(n), "scratch", scratch(n))
# probe (frozen contrastive features) > from-scratch at every budget; biggest gap at the fewest labels.`
  };
})();
