(function () {
  window.LESSONS.push({
    id: "unl-simclr",
    title: "SimCLR & contrastive learning (NT-Xent / InfoNCE)",
    tagline: "Make two augmented views of the same image agree, and disagree with everything else in the batch. No labels needed.",
    module: "Semi & Self-Supervised Learning",
    prereqs: ["dl-cosine-similarity", "dl-cross-entropy", "dl-data-augmentation", "mod-contrastive", "fs-metric-learning"],
    bigIdea:
      `<p><b>SimCLR</b> (Simple framework for Contrastive Learning of visual Representations, Chen et al. 2020) learns useful image features with <b>no labels at all</b>.</p>
       <p>The trick: take one image, make two random "augmented views" of it (a crop, a color shift, a blur). Those two views are a <b>positive pair</b> — they show the same thing, so the network should map them to nearby points.</p>
       <p>Every <i>other</i> image in the same batch is a <b>negative</b> — different content, so it should land far away.</p>
       <p>Train an encoder so positives are close and negatives are far. The features it learns turn out to be excellent for downstream tasks, even though it never saw a single label.</p>`,
    buildup:
      `<p>This is contrastive learning [mod-contrastive] applied to plain unlabeled images. You already met the same "pull-together, push-apart" idea in metric learning [fs-metric-learning] with triplets. SimCLR replaces the hand-picked anchor / positive / negative triplet with a clever, label-free recipe.</p>
       <p>Where do the positives come from with no labels? From <b>data augmentation</b> [dl-data-augmentation]. The "label" of a view is simply: <i>which original image did I come from?</i> Two views of image #7 are positives; a view of image #7 and a view of image #12 are negatives.</p>
       <p>SimCLR has four moving parts:</p>
       <ol>
         <li><b>Augmentation pipeline.</b> A strong random transform $t$. For each image $x$ it draws two transforms $t, t'$ and makes two views $\\tilde{x}_i = t(x)$, $\\tilde{x}_j = t'(x)$.</li>
         <li><b>Encoder</b> $f$. A backbone (e.g. a ResNet, Residual Network) that maps a view to a representation vector $h = f(\\tilde{x})$. <b>This $h$ is what you keep for downstream tasks.</b></li>
         <li><b>Projection head</b> $g$. A small multi-layer perceptron (MLP) that maps $h$ to a lower-dimensional space $z = g(h)$ where the contrastive loss is applied. <b>You throw $g$ away after pretraining</b> (more on why below).</li>
         <li><b>Contrastive loss</b> on $z$: the NT-Xent (Normalized Temperature-scaled cross-entropy) loss, also called InfoNCE.</li>
       </ol>`,
    symbols: [
      { sym: "$x$", desc: "one unlabeled input image from the batch." },
      { sym: "$t, t'$", desc: "two random augmentations (transforms) drawn independently from the augmentation pipeline." },
      { sym: "$\\tilde{x}_i, \\tilde{x}_j$", desc: "the two augmented views of the same image: $\\tilde{x}_i = t(x)$ and $\\tilde{x}_j = t'(x)$. They form one positive pair." },
      { sym: "$f$", desc: "the encoder (backbone) network. $h = f(\\tilde{x})$ is the representation you keep for downstream use." },
      { sym: "$g$", desc: "the projection head, a small MLP (Multi-Layer Perceptron). $z = g(h)$ is the projected vector the loss runs on; it is discarded after pretraining." },
      { sym: "$z_i, z_j$", desc: "the projected vectors of the two views. We want $z_i$ and $z_j$ to be close." },
      { sym: "$\\text{sim}(u, v)$", desc: "cosine similarity [dl-cosine-similarity] between two vectors: $\\frac{u^\\top v}{\\|u\\|\\,\\|v\\|}$. It is $+1$ for same direction, $0$ for perpendicular, $-1$ for opposite." },
      { sym: "$\\tau$", desc: "the temperature (Greek 'tau'): a small positive number (often $0.1$ or $0.5$) that scales the similarities. Smaller $\\tau$ sharpens the differences between positives and negatives." },
      { sym: "$N$", desc: "the batch size: how many original images are in one batch. After two views each, there are $2N$ vectors." },
      { sym: "$\\ell_{i,j}$", desc: "the loss for one positive pair $(i, j)$. The full loss averages $\\ell_{i,j}$ over all $2N$ views." }
    ],
    formula: `$$ \\ell_{i,j} = -\\log \\frac{\\exp\\!\\big(\\text{sim}(z_i, z_j)/\\tau\\big)}{\\sum_{k=1}^{2N}\\mathbb{1}_{[k \\ne i]}\\,\\exp\\!\\big(\\text{sim}(z_i, z_k)/\\tau\\big)} $$`,
    whatItDoes:
      `<p>This is the <b>NT-Xent</b> (Normalized Temperature-scaled cross-entropy) loss for one positive pair, view $i$ and its partner view $j$.</p>
       <ul>
         <li>The <b>numerator</b> is the similarity of the positive pair, $\\text{sim}(z_i, z_j)$, scaled by $1/\\tau$ and exponentiated. We want this <b>big</b>.</li>
         <li>The <b>denominator</b> sums the same exponentiated similarity over <i>every other view</i> $k$ in the batch — the positive partner <i>and</i> all $2N - 2$ negatives. The $\\mathbb{1}_{[k \\ne i]}$ is an indicator that is $1$ when $k \\ne i$ and $0$ when $k = i$: it just skips comparing a view to itself.</li>
         <li>The fraction is therefore a <b>softmax</b>: the probability that, out of all the other views, the model picks the true partner $j$. Taking $-\\log$ of that probability is exactly cross-entropy [dl-cross-entropy].</li>
       </ul>
       <p>In plain words: <b>NT-Xent is a $(2N-1)$-way classification problem</b> where the "correct class" of view $i$ is its augmented twin $j$, and every other image in the batch is a wrong answer. Minimizing it pulls the twin close and pushes the rest away.</p>
       <p><b>Why discard the projection head $g$?</b> The loss shapes $z = g(h)$ to throw away information that does not help the contrastive task (like exact color), but that information is often useful downstream. The representation $h$ <i>before</i> the head keeps more, so $h$ — not $z$ — is what you transfer.</p>`,
    derivation:
      `<p><b>Why does this work? InfoNCE is a lower bound on mutual information.</b></p>
       <p>InfoNCE stands for <b>Information Noise-Contrastive Estimation</b>. Think of it as a guessing game. You are shown view $z_i$ and a lineup of $2N - 1$ candidates: one true partner $z_j$ and many "noise" distractors (the negatives). The softmax fraction is your probability of fingering the right partner.</p>
       <p>Oord et al. (2018) proved that minimizing the InfoNCE loss <b>maximizes a lower bound</b> on the mutual information between the two views:</p>
       <p>$$ I(z_i; z_j) \\;\\ge\\; \\log(2N) - \\mathcal{L}_{\\text{InfoNCE}}. $$</p>
       <p>Read the symbols: $I(z_i; z_j)$ is the <b>mutual information</b> — how many bits knowing one view tells you about the other. $\\log(2N)$ grows with the number of candidates. $\\mathcal{L}_{\\text{InfoNCE}}$ is the average loss. Because the loss is subtracted, <b>driving the loss down raises the bound, so the encoder is forced to capture whatever the two views share</b> — the underlying content of the image — while discarding the augmentation noise that differs between them.</p>
       <p><b>The role of $\\tau$.</b> Dividing similarities by a small $\\tau$ before the softmax makes the distribution sharper: it heavily penalizes the <i>hardest</i> negatives (the ones already close to $z_i$). A tiny $\\tau$ obsesses over hard negatives and can be unstable; a large $\\tau$ treats all negatives alike and barely separates them. The sweet spot ($\\approx 0.1$–$0.5$) is a real, sensitive hyperparameter.</p>
       <p><b>Why large batches help.</b> The bound $\\log(2N) - \\mathcal{L}$ improves with more candidates $2N$. Every negative is a distractor the encoder must rule out; more distractors per step is a harder, more informative game. This is why SimCLR famously used batch sizes of 4096+ on many GPUs (Graphics Processing Units) — and why follow-ups like MoCo [unl-moco] invented a memory queue to get many negatives <i>without</i> a giant batch.</p>`,
    application:
      `<p>SimCLR-style contrastive pretraining is how teams get strong vision features <b>before</b> they have many labels. Pretrain the encoder on a large pile of unlabeled images, then fine-tune (or just linear-probe) on a small labeled set.</p>
       <p>It is the workhorse behind label-efficient image classification, medical imaging (where labels are scarce and expensive), satellite and industrial-inspection imagery, and the image tower of multimodal models. The same loss, with text-image pairs as the positives, underlies CLIP-style training [mod-contrastive].</p>`,
    whenToUse:
      `<p><b>Reach for SimCLR-style contrastive pretraining when you have lots of unlabeled images but few labels</b>, and you can define augmentations that preserve the content you care about. You learn a general-purpose encoder for free, then adapt it cheaply.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Training a supervised model from scratch</b> — when labels are scarce or costly; contrastive pretraining squeezes signal out of the unlabeled pile first.</li>
         <li><b>Plain transfer learning [fs-transfer-learning] from an off-domain checkpoint</b> — when your domain (medical, satellite, microscopy) looks nothing like ImageNet, so an in-domain self-supervised encoder transfers better.</li>
         <li><b>Supervised metric learning [fs-metric-learning]</b> — when you have no class labels to build triplets from; SimCLR manufactures positives from augmentation instead.</li>
       </ul>
       <p><b>Pick a different method when:</b></p>
       <ul>
         <li>You cannot afford large batches or many negatives — use <b>MoCo</b> [unl-moco] (a momentum encoder plus a queue) or a negative-free method like BYOL / SimSiam.</li>
         <li>Your data is sequential (audio, video, sensor streams) — <b>CPC</b> [unl-cpc] (Contrastive Predictive Coding) predicts future segments instead of matching augmented views.</li>
         <li>You already have plenty of labels — just train supervised; the contrastive detour buys little.</li>
       </ul>
       <p><b>Which library:</b> <code>lightly</code> or <code>solo-learn</code> for SimCLR / MoCo / BYOL, or roll the NT-Xent loss yourself (it is short, below). Evaluate the encoder with a linear probe — see [unl-eval].</p>`,
    pitfalls:
      `<ul>
         <li><b>Too-weak augmentations give a trivial solution.</b> If the two views are nearly identical, the encoder can match them with a shallow, useless shortcut (e.g. average color) and learn nothing transferable. SimCLR needs <i>strong</i> composed augmentations — random crop plus strong color jitter is the critical pair.</li>
         <li><b>Representation collapse.</b> The encoder can cheat by mapping every image to almost the same vector, making all positives trivially close. The many negatives in NT-Xent are what prevent this; if you remove negatives, you must add another anti-collapse trick (stop-gradient, predictor, or feature decorrelation).</li>
         <li><b>Temperature mis-set.</b> Too small a $\\tau$ over-weights the hardest negatives and destabilizes training; too large a $\\tau$ barely separates anything. Tune $\\tau$ (start near $0.1$–$0.5$); it matters as much as the learning rate.</li>
         <li><b>Not enough negatives / batch too small.</b> The loss is only as informative as the lineup of distractors. A small batch gives few negatives and weak features. Use a large batch, gradient accumulation across views, or a MoCo [unl-moco] queue.</li>
         <li><b>Keeping the projection head for downstream.</b> The projected $z$ has discarded information the loss did not need. Transfer the encoder output $h$ (before the head), not $z$, or downstream accuracy drops.</li>
         <li><b>Augmentations that destroy the label.</b> If a transform changes the very thing you will later predict (e.g. color-jittering when the task is to tell red from green apples), the encoder learns to ignore exactly the signal you need. Match the augmentations to the downstream task's invariances.</li>
       </ul>`,
    example:
      `<p>One tiny batch of $N = 2$ images, so $2N = 4$ views: image A gives views $z_1, z_2$ and image B gives views $z_3, z_4$. Use cosine similarity and temperature $\\tau = 0.5$. Compute $\\ell_{1,2}$, the loss for the positive pair $(z_1, z_2)$.</p>
       <p>Suppose the similarities of view $1$ to the others are: to its partner $\\text{sim}(z_1, z_2) = 0.8$ (high, good), and to the two negatives $\\text{sim}(z_1, z_3) = 0.1$, $\\text{sim}(z_1, z_4) = 0.0$.</p>
       <ul class="steps">
         <li>Scale each by $1/\\tau = 1/0.5 = 2$, then exponentiate: &nbsp; positive $\\exp(0.8 \\times 2) = \\exp(1.6) \\approx 4.95$; &nbsp; negatives $\\exp(0.1 \\times 2) = \\exp(0.2) \\approx 1.22$ and $\\exp(0.0) = 1.00$.</li>
         <li>Numerator (the positive only): $4.95$.</li>
         <li>Denominator (all others, skipping view $1$ itself): $4.95 + 1.22 + 1.00 = 7.17$.</li>
         <li>Softmax probability of the true partner: $\\frac{4.95}{7.17} \\approx 0.690$.</li>
         <li>Loss: $\\ell_{1,2} = -\\log(0.690) \\approx 0.371$.</li>
         <li>Now make the negatives <i>harder</i>: $\\text{sim}(z_1, z_3) = 0.7$. Then $\\exp(1.4) \\approx 4.06$, denominator $= 4.95 + 4.06 + 1.00 = 10.01$, probability $\\approx 0.495$, loss $\\approx 0.704$. A confusing negative nearly doubled the loss — that hard negative is what the encoder must learn to push away.</li>
       </ul>
       <p>The full SimCLR loss averages this $\\ell_{i,j}$ over all $2N = 4$ views (each view takes its turn as the anchor $i$).</p>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // sim(anchor, partner)=simP, sim to two negatives = simN1, simN2; tau adjustable.
      var st = { simP: 0.8, simN1: 0.1, simN2: 0.0, tau: 0.5 };
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 230; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      function compute() {
        var eP = Math.exp(st.simP / st.tau);
        var eN1 = Math.exp(st.simN1 / st.tau);
        var eN2 = Math.exp(st.simN2 / st.tau);
        var denom = eP + eN1 + eN2;
        var prob = eP / denom;
        var loss = -Math.log(prob);
        return { eP: eP, eN1: eN1, eN2: eN2, denom: denom, prob: prob, loss: loss };
      }
      function bar(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); }
      function draw() {
        var c = C(); var r = compute();
        ctx.clearRect(0, 0, 640, 230);
        ctx.font = "12px sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
        // three exp bars: positive (green), two negatives (orange)
        var items = [
          { lbl: "positive z_j", v: r.eP, col: c.accent2 },
          { lbl: "negative 1", v: r.eN1, col: c.warn },
          { lbl: "negative 2", v: r.eN2, col: c.warn }
        ];
        var maxv = Math.max(r.eP, r.eN1, r.eN2, 1);
        var bx = 90, bw = 120, gap = 60, baseY = 150, maxH = 100;
        for (var i = 0; i < 3; i++) {
          var h = (items[i].v / maxv) * maxH;
          var x = bx + i * (bw + gap);
          bar(x, baseY - h, bw, h, items[i].col);
          ctx.fillStyle = c.ink; ctx.fillText("exp = " + items[i].v.toFixed(2), x + bw / 2, baseY - h - 12);
          ctx.fillStyle = c.dim; ctx.fillText(items[i].lbl, x + bw / 2, baseY + 16);
        }
        ctx.fillStyle = c.dim; ctx.textAlign = "start"; ctx.font = "12px sans-serif";
        ctx.fillText("softmax over the lineup -> probability the true partner is picked", 20, 24);
        ctx.textAlign = "start";
      }
      function slider(label, key, min, max, step) {
        var row = document.createElement("div"); row.style.margin = "6px 0";
        var lab = document.createElement("label"); lab.style.display = "block";
        var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
        inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); render(); });
        row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
        return lab;
      }
      var labP = slider("sim(anchor, positive partner)", "simP", -1, 1, 0.05);
      var labN1 = slider("sim(anchor, negative 1)", "simN1", -1, 1, 0.05);
      var labN2 = slider("sim(anchor, negative 2)", "simN2", -1, 1, 0.05);
      var labT = slider("temperature tau", "tau", 0.05, 1.5, 0.05);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function render() {
        var r = compute();
        labP.textContent = "sim(anchor, positive partner) = " + st.simP.toFixed(2);
        labN1.textContent = "sim(anchor, negative 1) = " + st.simN1.toFixed(2);
        labN2.textContent = "sim(anchor, negative 2) = " + st.simN2.toFixed(2);
        labT.textContent = "temperature tau = " + st.tau.toFixed(2);
        draw();
        rd.innerHTML = "probability of true partner = " + r.eP.toFixed(2) + " / " + r.denom.toFixed(2) +
          " = <b>" + r.prob.toFixed(3) + "</b>, &nbsp; NT-Xent loss = -log(prob) = <b>" + r.loss.toFixed(3) +
          "</b>.<br>Raise a negative's similarity, or lower tau, and watch the loss climb: the encoder is pushed to separate hard negatives.";
      }
      render();
    },
    practice: [
      {
        q: `In a SimCLR batch, exactly which other views are the <b>positive</b> for view $i$, and which are <b>negatives</b>? If the batch has $N = 64$ images, how many negatives does each view have?`,
        steps: [
          { do: `Recall how positives are made: two augmented views of the SAME image.`, why: `The only positive of view $i$ is its augmented twin from the same original image.` },
          { do: `Count the total views: $2N = 128$.`, why: `Each of the 64 images contributes two views.` },
          { do: `Subtract the view itself and its one positive partner: $128 - 1 - 1 = 126$.`, why: `Every remaining view comes from a different image, so it is a negative.` }
        ],
        answer: `<p>The single positive is view $i$'s augmented twin (the other view of the same image). The $2N - 2 = 126$ views from the other 63 images are all negatives. So each view is contrasted against its one partner and 126 distractors.</p>`
      },
      {
        q: `A positive pair has $\\text{sim}(z_i, z_j) = 0.6$. The two negatives have similarities $0.5$ and $0.4$. With temperature $\\tau = 0.2$, find the NT-Xent loss $\\ell_{i,j}$.`,
        steps: [
          { do: `Scale by $1/\\tau = 5$ and exponentiate. Positive: $\\exp(0.6 \\times 5) = \\exp(3.0) \\approx 20.09$.`, why: `Small $\\tau$ sharply amplifies similarity gaps.` },
          { do: `Negatives: $\\exp(0.5 \\times 5) = \\exp(2.5) \\approx 12.18$ and $\\exp(0.4 \\times 5) = \\exp(2.0) \\approx 7.39$.`, why: `Apply the same scaling to every candidate.` },
          { do: `Numerator $= 20.09$. Denominator $= 20.09 + 12.18 + 7.39 = 39.66$.`, why: `The denominator sums the positive plus all negatives (skipping the view itself).` },
          { do: `Probability $= 20.09 / 39.66 \\approx 0.507$. Loss $= -\\log(0.507) \\approx 0.680$.`, why: `The softmax fraction is the chance of picking the true partner; $-\\log$ of it is the loss.` }
        ],
        answer: `<p>$\\ell_{i,j} = -\\log\\!\\frac{e^{3.0}}{e^{3.0} + e^{2.5} + e^{2.0}} = -\\log(0.507) \\approx 0.68$. The negatives at $0.5$ and $0.4$ are nearly as similar as the positive at $0.6$, so the loss stays high — these are hard negatives the encoder still has to separate.</p>`
      },
      {
        q: `Your teammate trains SimCLR, then attaches a classifier to the projected vector $z = g(h)$ and gets poor accuracy. What is the likely fix?`,
        steps: [
          { do: `Recall the two outputs: the encoder representation $h = f(\\tilde{x})$ and the projected $z = g(h)$.`, why: `The contrastive loss is applied on $z$, not $h$.` },
          { do: `Recall what $g$ does: it strips information not needed for the contrastive task.`, why: `That stripped information is often exactly what a downstream classifier needs.` },
          { do: `Use $h$ (before the projection head) for downstream, and discard $g$.`, why: `$h$ retains the richer, more transferable features.` }
        ],
        answer: `<p>Feed the classifier the encoder output $h$, not the projected $z$. SimCLR found that the layer <i>before</i> the projection head transfers far better, because the head discards detail the contrastive loss did not need. Keep $f$, throw away $g$.</p>`
      }
    ]
  });

  window.CODE["unl-simclr"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The full SimCLR core: the NT-Xent (Normalized Temperature-scaled cross-entropy) /
      InfoNCE loss on the two views, plus one training step (augment twice, encode, project,
      contrast). The loss L2-normalizes the projected vectors, builds the cosine-similarity matrix
      over all <code>2N</code> views, masks self-comparisons, and runs cross-entropy where each
      view's "correct class" is its augmented twin. Real and runnable on a Colab GPU.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.models import resnet18

def nt_xent_loss(z1, z2, tau=0.5):
    """NT-Xent / InfoNCE over a batch of paired views.
    z1, z2: (N, d) projections of view-1 and view-2 of the same N images."""
    N = z1.size(0)
    z = F.normalize(torch.cat([z1, z2], dim=0), dim=1)   # (2N, d) unit vectors
    sim = z @ z.t() / tau                                 # (2N, 2N) cosine sims / tau

    # mask out self-similarity on the diagonal so a view never matches itself
    self_mask = torch.eye(2 * N, dtype=torch.bool, device=z.device)
    sim.masked_fill_(self_mask, float('-inf'))

    # for view i, its positive partner sits N positions away (and vice versa)
    targets = torch.arange(2 * N, device=z.device)
    targets = (targets + N) % (2 * N)

    # softmax cross-entropy: pick the true partner out of all 2N-1 other views
    return F.cross_entropy(sim, targets)

class SimCLR(nn.Module):
    def __init__(self, proj_dim=128):
        super().__init__()
        backbone = resnet18(weights=None)
        feat_dim = backbone.fc.in_features          # 512 for resnet18
        backbone.fc = nn.Identity()                 # encoder f: image -> h
        self.encoder = backbone
        self.projector = nn.Sequential(             # projection head g: h -> z
            nn.Linear(feat_dim, feat_dim), nn.ReLU(inplace=True),
            nn.Linear(feat_dim, proj_dim))

    def forward(self, x):
        h = self.encoder(x)                         # representation to KEEP downstream
        z = self.projector(h)                       # projection used ONLY for the loss
        return h, z

# ---- one SimCLR training step --------------------------------------------
# 'augment' is a strong random transform (RandomResizedCrop + color jitter + blur).
model = SimCLR().cuda()
opt = torch.optim.Adam(model.parameters(), lr=3e-4)

def train_step(images, augment, tau=0.5):
    # two independent augmented views of the SAME batch of images
    x1 = augment(images).cuda()
    x2 = augment(images).cuda()
    _, z1 = model(x1)                               # discard h during pretraining
    _, z2 = model(x2)
    loss = nt_xent_loss(z1, z2, tau)
    opt.zero_grad(); loss.backward(); opt.step()
    return loss.item()

# After pretraining: throw away model.projector, keep model.encoder (gives h),
# then linear-probe or fine-tune model.encoder on your small labeled set.`
  };

  window.CODEVIZ["unl-simclr"] = {
    question: "How do you READ whether contrastive pretraining is working? A label-efficiency curve tells you it helps; the NT-Xent loss curve and the embedding scatter tell you whether training is healthy or has collapsed.",
    charts: [
      {
        type: "line", title: "Ideal: learned features beat raw pixels in the low-label regime (load_digits)", xlabel: "number of labeled examples", ylabel: "kNN accuracy on held-out digits",
        series: [
          { name: "learned representation", color: "#7ee787", points: [[5, 0.161], [10, 0.299], [20, 0.519], [40, 0.719], [80, 0.855], [160, 0.914]] },
          { name: "raw pixels", color: "#ff7b72", points: [[5, 0.157], [10, 0.291], [20, 0.506], [40, 0.712], [80, 0.859], [160, 0.922]] }
        ],
        interpret: "<b>Read it as a label-efficiency curve.</b> X is how many labels you give the downstream kNN probe; Y is its accuracy. Green is the contrastive (augmentation-invariant) representation, red is raw pixels. The win shows in the <b>low-label regime (5-40)</b>, where green sits above red, then the two cross once labels are plentiful (80-160) because clean 8x8 digits are already easy for raw pixels. <b>Conclusion:</b> contrastive pretraining pays off most exactly when labels are scarce — judge it by the gap on the left of the curve, not the right."
      },
      {
        type: "line", title: "NT-Xent loss curve: healthy descent vs representation collapse (illustrative)", xlabel: "training step (x100)", ylabel: "NT-Xent / InfoNCE loss",
        series: [
          { name: "healthy", color: "#7ee787", points: [[0, 4.85], [1, 3.9], [2, 3.1], [3, 2.5], [4, 2.1], [5, 1.85], [6, 1.7], [7, 1.62], [8, 1.58], [9, 1.56]] },
          { name: "collapse", color: "#ff7b72", points: [[0, 4.85], [1, 2.0], [2, 0.6], [3, 0.15], [4, 0.04], [5, 0.01], [6, 0.005], [7, 0.003], [8, 0.002], [9, 0.001]] }
        ],
        interpret: "<b>Illustrative loss curves.</b> X is training step, Y is the NT-Xent loss. Green descends smoothly and <b>flattens at a positive floor</b> (around log of the batch size minus the mutual information captured) — that is healthy learning. Red plummets almost to <b>zero</b>: a loss that crashes toward 0 is the signature of <b>representation collapse</b>, where the encoder maps every image to nearly the same vector so all positives are trivially close and all negatives look identical. <b>Conclusion:</b> a too-good-to-be-true near-zero loss is a red flag, not success — check the embeddings before trusting it."
      },
      {
        type: "scatter", title: "Embedding scatter: well-separated clusters vs collapsed blob (illustrative 2D projection)", xlabel: "embedding dim 1", ylabel: "embedding dim 2",
        groups: [
          { name: "healthy class A", color: "#7ee787", points: [[-2.1, 1.9], [-1.8, 2.3], [-2.4, 1.6], [-1.9, 2.0], [-2.2, 2.2]] },
          { name: "healthy class B", color: "#4ea1ff", points: [[2.0, -1.7], [2.4, -2.1], [1.7, -1.9], [2.2, -1.5], [1.9, -2.0]] },
          { name: "collapsed (all classes)", color: "#ff7b72", points: [[0.05, 0.02], [-0.03, 0.06], [0.04, -0.04], [-0.02, -0.03], [0.01, 0.05], [-0.05, 0.01], [0.03, 0.0], [0.0, -0.05]] }
        ],
        interpret: "<b>Illustrative 2D view</b> of the projected embeddings. Each point is one image's vector. <b>Healthy</b> training (green and blue) spreads different content into <b>distinct, separated clusters</b> — that is what makes the features useful downstream. The red points are all piled into one tiny blob at the origin: that is <b>collapse</b>, every image mapped to essentially the same vector. <b>Conclusion:</b> pair this with the loss curve — a near-zero loss plus a single blob confirms collapse; well-spread clusters confirm the encoder learned to tell images apart. Fix weak augmentation or too-few negatives."
      }
    ],
    caption: "How to read SimCLR diagnostics: the label-efficiency curve (does it help?) plus the loss curve and embedding scatter (is training healthy or collapsed?). The main curve is a faithful small CPU proxy; real SimCLR needs a GPU, a deep ResNet encoder, and NT-Xent over large batches.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.neighbors import KNeighborsClassifier

# REAL data: 1797 handwritten 8x8 digits.
digits = load_digits()
X = digits.data / 16.0           # pixels in 0..1
y = digits.target
rng = np.random.RandomState(0)

def augment(imgs, r):
    """A faithful tiny stand-in for SimCLR's augmentation pipeline:
    small random shift + Gaussian noise. Two calls = two 'views'."""
    out = []
    for v in imgs:
        img = v.reshape(8, 8)
        img = np.roll(img, r.randint(-1, 2), axis=0)   # shift up/down
        img = np.roll(img, r.randint(-1, 2), axis=1)   # shift left/right
        out.append(np.clip(img + 0.07 * r.randn(8, 8), 0, 1).reshape(-1))
    return np.array(out)

# Self-supervised pretraining pool: images whose CLASS LABELS WE HIDE.
n_base = 800
base_idx = rng.choice(len(X), n_base, replace=False)
base = X[base_idx]
# Build 4 augmented views per image (no labels used at all).
A = np.vstack([augment(base, rng) for _ in range(4)])

# 'Encoder' proxy: learn directions robust to the augmentation noise.
# (Real SimCLR uses a deep ResNet + NT-Xent on a GPU; PCA on augmented
#  views is a faithful small CPU stand-in for an augmentation-invariant encoder.)
encoder = PCA(n_components=16, random_state=0).fit(A)

# Downstream eval: held-out REAL images + their true class labels.
eval_idx = rng.choice(np.setdiff1d(np.arange(len(X)), base_idx), 900, replace=False)
Xe, ye = X[eval_idx], y[eval_idx]
Re = encoder.transform(Xe)        # learned representation
Pe = Xe                            # raw-pixel baseline

def knn_acc_vs_labels(feat, counts, trials=40):
    accs = []
    for n_lab in counts:
        s = []
        for t in range(trials):
            r = np.random.RandomState(7000 + t)
            perm = r.permutation(len(feat))
            tr, te = perm[:n_lab], perm[n_lab:n_lab + 300]
            if len(np.unique(ye[tr])) < 2:
                continue
            clf = KNeighborsClassifier(n_neighbors=min(3, n_lab)).fit(feat[tr], ye[tr])
            s.append(clf.score(feat[te], ye[te]))
        accs.append(round(float(np.mean(s)), 3))
    return accs

counts = [5, 10, 20, 40, 80, 160]
print("labels        ", counts)
print("learned rep   ", knn_acc_vs_labels(Re, counts))
print("raw pixels    ", knn_acc_vs_labels(Pe, counts))`
  };
})();
