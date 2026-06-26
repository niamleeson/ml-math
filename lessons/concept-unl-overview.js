/* =====================================================================
   MODULE — Learning from Unlabeled Data (semi- & self-supervised).
   Lesson: unl-overview — the landscape and the assumptions that make it work.
   Self-contained: pushes one TECHNIQUE lesson into window.LESSONS, plus a
   real PyTorch skeleton (window.CODE) and a reproducible sklearn proxy
   (window.CODEVIZ) computed on load_digits.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "unl-overview",
    title: "Learning from unlabeled data: the landscape",
    tagline: "Labels are scarce and pricey; raw data is cheap. Here is how to learn from the cheap stuff.",
    module: "Semi & Self-Supervised Learning",
    prereqs: ["dl-cross-entropy", "dl-data-augmentation", "mod-contrastive"],
    whenToUse:
      `<p><b>Reach for semi-supervised or self-supervised learning when you have a flood of unlabeled data but only a trickle of labels.</b> Labels cost money and time — a radiologist annotating scans, a human transcribing audio, a moderator tagging abuse. Raw, unlabeled examples are almost free. These methods squeeze signal out of the cheap pile.</p>
       <p>This lesson maps the field. The sibling lessons teach the actual methods:</p>
       <ul>
         <li><b>Semi-supervised</b> (a few labels plus lots of unlabeled): [unl-consistency], [unl-pseudo-label], [unl-mixmatch], [unl-fixmatch].</li>
         <li><b>Self-supervised</b> (no labels at all; invent a pretext task): [unl-simclr], [unl-moco], [unl-cpc], and the contrastive foundations in [mod-contrastive].</li>
         <li><b>Measuring whether it worked</b>: [unl-eval].</li>
       </ul>
       <p><b>Choose this family over:</b></p>
       <ul>
         <li><b>Plain supervised learning</b> — when you cannot afford to label enough data to hit the accuracy you need, but unlabeled data is abundant.</li>
         <li><b>Pure unsupervised learning (clustering, density)</b> — when you do have <i>some</i> labels and want a predictor, not just structure. Semi-supervised uses those few labels to anchor the structure to real classes.</li>
       </ul>
       <p><b>Pick something else when:</b> labels are already plentiful relative to the task — then plain supervised training is simpler and usually wins (see pitfalls).</p>`,
    application:
      `<p>Self-supervised pretraining is how modern models are built. Large language models pretrain on raw text (predict the next word — no labels), then fine-tune on a small labeled set. Vision models like SimCLR (Simple framework for Contrastive Learning of visual Representations) and MoCo (Momentum Contrast) pretrain on unlabeled images and reach strong accuracy with a fraction of the labels. Speech, medical imaging, and recommendation systems all lean on the same recipe: learn structure from the ocean of unlabeled data, then spend your few precious labels on the final task.</p>`,
    pitfalls:
      `<ul>
         <li><b>Unlabeled data from a different distribution.</b> The whole field assumes the unlabeled pile looks like the labeled task. If it does not — different classes, different domain, garbage scraped from the web — the unlabeled loss pulls the model toward the wrong structure and accuracy <i>drops</i>. Check that labeled and unlabeled data share the same world before mixing them.</li>
         <li><b>No cluster or manifold structure.</b> These methods work only when the assumptions below hold: data that clumps into class-pure clusters, with decision boundaries falling in the empty gaps. On featureless or heavily overlapping data there is no low-density region to exploit, so the unlabeled loss adds noise, not signal.</li>
         <li><b>Confirmation bias.</b> Methods that label their own unlabeled data (pseudo-labeling, self-training) can lock in early mistakes: a wrong guess becomes a training target, which reinforces the wrong guess. Use confidence thresholds (only trust high-confidence pseudo-labels — the [unl-fixmatch] idea) and strong augmentation to break the loop.</li>
         <li><b>Expecting gains when labels are already plentiful.</b> The payoff is largest when labels are scarce. As the labeled set grows, the supervised signal already pins down the boundary, and the unlabeled term adds little — sometimes it even hurts by injecting noise. Measure the gap honestly; do not bolt on a semi-supervised loss out of habit.</li>
         <li><b>Tuning on a tiny labeled set.</b> With only a handful of labels, the validation set is too small to trust. Hyperparameters chosen on it can be flukes. Be skeptical of large reported gains from one lucky split; average over several seeds.</li>
       </ul>`,
    bigIdea:
      `<p>Sort learning by what labels you have.</p>
       <ul>
         <li><b>Supervised</b>: every example has a label. You learn the map from input to label directly.</li>
         <li><b>Semi-supervised</b>: a <i>small</i> labeled set plus a <i>large</i> unlabeled set. You learn from both at once.</li>
         <li><b>Self-supervised</b>: <i>only</i> unlabeled data. You invent a fake task (a "pretext" task) whose answer you can read off the data itself — predict a hidden word, match two crops of the same image — and learn useful features as a side effect.</li>
         <li><b>Unsupervised</b>: only unlabeled data, and you want structure (clusters, density), not a predictor.</li>
       </ul>
       <p>The reason this matters in one line: <b>labels are expensive and slow; unlabeled data is cheap and plentiful.</b> The goal is to let the cheap data carry as much of the learning as possible.</p>`,
    buildup:
      `<p>Why can unlabeled data help at all? It tells you the <i>shape</i> of the data — where points pile up and where they are sparse — even without naming any of them.</p>
       <p>Four assumptions turn that shape into a free signal. They are different angles on the same intuition: points that look alike should be labeled alike.</p>
       <ul>
         <li><b>Smoothness.</b> If two inputs are close, their labels should be close. The predictor should not flip wildly between near neighbors.</li>
         <li><b>Cluster assumption.</b> Points tend to form clusters, and points in the same cluster share a label. So a class is a clump, not a scatter.</li>
         <li><b>Low-density separation.</b> The decision boundary should pass through <i>empty</i> regions, not slice through a dense crowd. Unlabeled points show you where the crowds are, so you can route the boundary around them.</li>
         <li><b>Manifold assumption.</b> High-dimensional data really lies on a much lower-dimensional surface (a "manifold"). Labels vary smoothly <i>along</i> that surface. Unlabeled data reveals its shape.</li>
       </ul>
       <p>When these hold, unlabeled points pin down where boundaries belong. When they fail, unlabeled data misleads (see pitfalls).</p>`,
    symbols: [
      { sym: "$x$", desc: "one input example (a vector of features)." },
      { sym: "$y$", desc: "its label — known only for the small labeled set." },
      { sym: "$\\mathcal{D}_L=\\{(x_i,y_i)\\}$", desc: "the labeled set: the few examples that come with a label. The script $\\mathcal{D}$ means 'dataset', subscript $L$ for 'labeled'." },
      { sym: "$\\mathcal{D}_U=\\{x_j\\}$", desc: "the unlabeled set: the large pile of examples with no label ($U$ for 'unlabeled')." },
      { sym: "$f_\\theta$", desc: "the model with parameters $\\theta$ (Greek 'theta'); $f_\\theta(x)$ is its predicted class probabilities for $x$." },
      { sym: "$p(x)$", desc: "the data density: how thickly examples pile up around $x$. High where there is a crowd, near zero in the gaps." },
      { sym: "$\\mathcal{L}_{\\text{sup}}$", desc: "the supervised loss: how wrong $f_\\theta$ is on the labeled data $\\mathcal{D}_L$ (e.g. cross-entropy)." },
      { sym: "$\\mathcal{L}_{\\text{unsup}}$", desc: "the unsupervised loss: a penalty computed from unlabeled data $\\mathcal{D}_U$ that pushes the model to respect the assumptions (consistency, low-density, etc.)." },
      { sym: "$\\lambda$", desc: "a non-negative weight (Greek 'lambda') trading off how much the unlabeled loss counts versus the supervised loss." }
    ],
    formula: `$$ \\mathcal{L} \\;=\\; \\underbrace{\\mathcal{L}_{\\text{sup}}\\big(\\mathcal{D}_L;\\theta\\big)}_{\\text{fit the few labels}} \\;+\\; \\lambda\\,\\underbrace{\\mathcal{L}_{\\text{unsup}}\\big(\\mathcal{D}_U;\\theta\\big)}_{\\text{exploit the many unlabeled}} $$`,
    whatItDoes:
      `<p>This is the template <i>every</i> semi-supervised method in this module follows.</p>
       <p>The first term, $\\mathcal{L}_{\\text{sup}}$, is the ordinary supervised loss on the few labeled points — it keeps the model honest about which clump is which class.</p>
       <p>The second term, $\\mathcal{L}_{\\text{unsup}}$, is computed from unlabeled points and needs <i>no</i> labels. Different methods fill it in differently: consistency between two augmented views ([unl-consistency], [unl-fixmatch]), agreement with the model's own confident guesses ([unl-pseudo-label]), or matching views in feature space ([unl-simclr], [unl-moco]). They all plug into this same slot.</p>
       <p>The knob $\\lambda$ sets the balance. $\\lambda=0$ is plain supervised learning; raising $\\lambda$ leans harder on the unlabeled data.</p>`,
    derivation:
      `<p><b>Where the assumptions come from — stated formally.</b></p>
       <ul class="steps">
         <li><b>Smoothness, as a penalty.</b> "Close inputs get close labels" means the prediction $f_\\theta$ should not change quickly where data is dense. A clean way to write that is to penalize the squared change of $f$ weighted by density: $\\int \\lVert\\nabla f_\\theta(x)\\rVert^2\\,p(x)\\,dx$, where $\\nabla f_\\theta$ is the gradient (how fast the prediction changes as you move $x$). Big where the model flips quickly, small where it is flat. Multiplying by $p(x)$ says: only punish fast changes <i>in the crowds</i>; you are free to change fast out in the empty gaps.</li>
         <li><b>Cluster assumption, formally.</b> The data density $p(x)$ splits into a few high-density regions (clusters) separated by low-density valleys, and the true label $y$ is (almost) constant within each cluster. So $p(y\\mid x)$ barely changes as long as $x$ stays inside one cluster.</li>
         <li><b>Low-density separation principle.</b> Put the two together: the decision boundary $\\{x : f_\\theta(x)=\\tfrac12\\}$ (for two classes, the set where the model is exactly undecided) should lie where $p(x)$ is small. Formally, choose the classifier whose boundary minimizes the density it passes through — it should thread the empty valleys between clusters, never cut a dense clump in half. This is the principle behind transductive SVMs (Support Vector Machines) and entropy-minimization methods.</li>
         <li><b>Manifold assumption, formally.</b> Although $x$ lives in a high-dimensional space, $p(x)$ is supported on a low-dimensional manifold $\\mathcal{M}$ (a curved surface), and $p(y\\mid x)$ is smooth <i>along</i> $\\mathcal{M}$. The smoothness penalty is then measured by distance along the surface, not straight-line distance — two points can be far apart in space yet adjacent along the manifold.</li>
         <li><b>Why this licenses $\\mathcal{L}_{\\text{unsup}}$.</b> We never observe $p(x)$, but the unlabeled set $\\mathcal{D}_U$ is a sample <i>from</i> it. So $\\mathcal{L}_{\\text{unsup}}$ is just an empirical stand-in for these penalties — pushing predictions to be smooth, confident, and consistent exactly where the unlabeled points (hence the density) actually are. $\\blacksquare$</li>
       </ul>`,
    example:
      `<p>Two moons of unlabeled points, and just <b>one</b> labeled point per moon. We have no other labels.</p>
       <ul class="steps">
         <li><b>Cluster assumption:</b> the points clearly fall into two arcs (clusters). Assume each arc is one class.</li>
         <li><b>Smoothness:</b> a new point next to many top-arc points should be labeled like the top arc — neighbors agree.</li>
         <li><b>Low-density separation:</b> there is an empty gap between the two arcs. Route the boundary <i>through that gap</i>, not across either arc.</li>
         <li>A purely supervised model with two labeled points would draw a straight line halfway between them — slicing through both moons. Add the unlabeled points and the low-density principle bends the boundary into the empty seam, classifying every arc correctly.</li>
         <li>In the objective: $\\mathcal{L}_{\\text{sup}}$ pins the two labeled points to their classes; $\\lambda\\,\\mathcal{L}_{\\text{unsup}}$ pushes the boundary into the low-density gap. Together they recover the right split from almost no labels.</li>
       </ul>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      // two interleaved moons; only one labeled point per moon
      var pts = [];
      var seed = 71; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      for (var i = 0; i < 30; i++) { var t = Math.PI * i / 29; pts.push({ x: 2.5 * Math.cos(t), y: 2.5 * Math.sin(t) + (rnd() - 0.5) * 0.4, moon: 0 }); }
      for (var j = 0; j < 30; j++) { var t2 = Math.PI * j / 29; pts.push({ x: 2.5 - 2.5 * Math.cos(t2), y: -2.5 * Math.sin(t2) + 1.2 + (rnd() - 0.5) * 0.4, moon: 1 }); }
      var labeledIdx = [5, 35]; // one near the top arc, one near the bottom arc

      var xmin = -3.5, xmax = 5.5, ymin = -2, ymax = 4, W = 640, H = 360, padL = 30, padR = 16, padT = 16, padB = 28;
      function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
      function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

      var useUnlabeled = true;

      function draw() {
        var c = C(); ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();

        // boundary: with unlabeled data, follow the low-density seam between the moons;
        // without it, just bisect the two labeled points (a straight slice).
        var pa = pts[labeledIdx[0]], pb = pts[labeledIdx[1]];
        if (useUnlabeled) {
          // sweep a curve through the empty gap between the arcs
          ctx.strokeStyle = c.warn; ctx.lineWidth = 3; ctx.beginPath();
          for (var k = 0; k <= 60; k++) {
            var xx = xmin + (xmax - xmin) * k / 60;
            // a gentle arc nestled in the seam between the two moons
            var yy = 0.6 + 1.15 * Math.cos((xx - 1.25) * 0.62);
            if (k === 0) ctx.moveTo(PX(xx), PY(yy)); else ctx.lineTo(PX(xx), PY(yy));
          }
          ctx.stroke();
        } else {
          // straight bisector of the two labeled points: slices through both arcs
          var mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2;
          var dx = pb.x - pa.x, dy = pb.y - pa.y; // boundary is perpendicular
          ctx.strokeStyle = c.warn; ctx.lineWidth = 3; ctx.beginPath();
          var L = 8;
          ctx.moveTo(PX(mx - dy / Math.hypot(dx, dy) * L), PY(my + dx / Math.hypot(dx, dy) * L));
          ctx.lineTo(PX(mx + dy / Math.hypot(dx, dy) * L), PY(my - dx / Math.hypot(dx, dy) * L));
          ctx.stroke();
        }

        for (var n = 0; n < pts.length; n++) {
          var isLab = n === labeledIdx[0] || n === labeledIdx[1];
          if (isLab) {
            ctx.fillStyle = pts[n].moon === 0 ? c.accent : c.accent2;
            ctx.beginPath(); ctx.arc(PX(pts[n].x), PY(pts[n].y), 7, 0, Math.PI * 2); ctx.fill();
            ctx.lineWidth = 2; ctx.strokeStyle = c.ink; ctx.stroke();
          } else {
            ctx.fillStyle = c.dim + "99";
            ctx.beginPath(); ctx.arc(PX(pts[n].x), PY(pts[n].y), 3.5, 0, Math.PI * 2); ctx.fill();
          }
        }
        readout.innerHTML = useUnlabeled
          ? "<b>With unlabeled data.</b> Grey dots are unlabeled; the two big rings are the only labels. Low-density separation bends the orange boundary into the empty seam between the arcs, so each moon is classified correctly."
          : "<b>Labels only.</b> Two labeled points give only a straight bisector — it slices through both moons and mislabels half of each. Toggle the unlabeled data back on.";
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      var btn = document.createElement("button");
      btn.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
      btn.textContent = "Show labels-only boundary";
      btn.addEventListener("click", function () { useUnlabeled = !useUnlabeled; btn.textContent = useUnlabeled ? "Show labels-only boundary" : "Back to using unlabeled data"; draw(); });
      row.appendChild(btn);
      host.appendChild(row); host.appendChild(readout);
      draw();
    },
    practice: [
      {
        q: `You have 1,000,000 product photos but only 200 are labeled with a category. Which learning setting is this, and what assumption lets the unlabeled photos help?`,
        steps: [
          { do: `Identify the split: a tiny labeled set plus a huge unlabeled set.`, why: `That is the definition of semi-supervised learning.` },
          { do: `Name the assumption: photos of the same category cluster together in feature space, and boundaries sit in the sparse gaps.`, why: `The cluster + low-density-separation assumptions are what turn the unlabeled photos into a usable signal.` }
        ],
        answer: `<p>This is <b>semi-supervised learning</b> (small labeled $\\mathcal{D}_L$, large unlabeled $\\mathcal{D}_U$). The unlabeled photos help because of the <b>cluster assumption</b> — same-category photos clump together — and <b>low-density separation</b> — the decision boundary should fall in the empty gaps between clumps, which the million unlabeled points reveal. You would optimize $\\mathcal{L}=\\mathcal{L}_{\\text{sup}}+\\lambda\\,\\mathcal{L}_{\\text{unsup}}$.</p>`
      },
      {
        q: `A teammate adds a large unlabeled set scraped from a different website and the model gets worse. Which assumption was violated?`,
        steps: [
          { do: `Ask whether the unlabeled data shares the labeled data's distribution.`, why: `Every method here assumes $\\mathcal{D}_U$ is drawn from the same $p(x)$ as the task.` },
          { do: `A different website means different $p(x)$ — different clusters.`, why: `The unlabeled loss then pulls the boundary toward the wrong structure.` }
        ],
        answer: `<p>The <b>same-distribution</b> premise behind the cluster / low-density assumptions. The scraped data comes from a different $p(x)$, so its clusters do not line up with the task's classes; $\\lambda\\,\\mathcal{L}_{\\text{unsup}}$ then drags the model toward irrelevant structure. Filter the unlabeled set to match the target domain, or lower $\\lambda$.</p>`
      },
      {
        q: `What is the difference between self-supervised and semi-supervised learning?`,
        steps: [
          { do: `Check whether any labels are used during the main learning phase.`, why: `That is the dividing line.` },
          { do: `Semi-supervised uses a few real labels alongside unlabeled data; self-supervised uses none, inventing a pretext task instead.`, why: `Self-supervised learns features first, then (optionally) fine-tunes on labels later.` }
        ],
        answer: `<p><b>Semi-supervised</b> mixes a small labeled set with a large unlabeled set in one objective. <b>Self-supervised</b> uses <i>only</i> unlabeled data: it invents a pretext task whose answer is readable from the data itself (predict a masked word, match two crops of one image) and learns useful representations as a side effect — see [unl-simclr], [unl-moco], [unl-cpc] and [mod-contrastive]. Labels, if any, are spent later in a small fine-tuning step.</p>`
      }
    ]
  });

  window.CODE["unl-overview"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The shape every method in this module shares: a supervised loss on the few labeled examples plus a $\\lambda$-weighted unsupervised loss on the unlabeled batch. Swap in a real <code>unsupervised_loss</code> (consistency, pseudo-label, contrastive) and you have FixMatch, MixMatch, SimCLR, and the rest.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# ---- the generic semi-supervised objective: L = L_sup + lambda * L_unsup ----
# Every method in this module just fills in 'unsupervised_loss' differently.

def unsupervised_loss(model, x_unlabeled):
    """Placeholder for the method-specific term computed from UNLABELED data.

    - Consistency / FixMatch: two augmented views should predict the same class.
    - Pseudo-labeling:        train on the model's own confident guesses.
    - Contrastive (SimCLR):   two views of one image attract, others repel.
    Here we use a simple, label-free CONSISTENCY loss between two augmentations.
    """
    x1 = augment(x_unlabeled)            # weak augmentation
    x2 = augment(x_unlabeled)            # a second, independent augmentation
    p1 = F.softmax(model(x1), dim=1)
    p2 = F.softmax(model(x2), dim=1)
    # predictions on the two views should agree (symmetric squared difference)
    return ((p1 - p2) ** 2).sum(dim=1).mean()


def augment(x):
    # stand-in for real augmentations (crop, flip, color jitter, noise)
    return x + 0.05 * torch.randn_like(x)


def train_step(model, opt, labeled_batch, unlabeled_batch, lam=1.0):
    x_lab, y_lab = labeled_batch         # the few labeled examples
    x_unl, = unlabeled_batch             # the many unlabeled examples

    # 1) supervised loss on the labels we DO have
    logits = model(x_lab)
    loss_sup = F.cross_entropy(logits, y_lab)

    # 2) unsupervised loss on the unlabeled pile (no labels needed)
    loss_unsup = unsupervised_loss(model, x_unl)

    # 3) combine:  L = L_sup + lambda * L_unsup
    loss = loss_sup + lam * loss_unsup

    opt.zero_grad()
    loss.backward()
    opt.step()
    return loss_sup.item(), loss_unsup.item()


# --- usage sketch (model + two data loaders, labeled and unlabeled) ---
# model = MyNet()
# opt = torch.optim.Adam(model.parameters(), lr=1e-3)
# for labeled_batch, unlabeled_batch in zip(labeled_loader, unlabeled_loader):
#     train_step(model, opt, labeled_batch, unlabeled_batch, lam=1.0)`
  };

  window.CODEVIZ["unl-overview"] = {
    question: "On real handwritten digits, how do you read a 'labels-only vs labels + unlabeled' curve — and what does it look like when unlabeled data helps, helps nothing, or actively hurts?",
    charts: [
      {
        type: "line",
        title: "Assumptions hold: unlabeled wins big when labels are scarce, gap closes as labels grow",
        xlabel: "number of labeled examples",
        ylabel: "test accuracy (fraction correct, 500 held-out digits)",
        series: [
          { name: "labels + unlabeled (semi-supervised)", color: "#7ee787", points: [[10, 0.466], [20, 0.794], [30, 0.902], [50, 0.946], [100, 0.95], [200, 0.966], [400, 0.972]] },
          { name: "labels only (kNN)", color: "#4ea1ff", points: [[10, 0.22], [20, 0.406], [30, 0.532], [50, 0.76], [100, 0.862], [200, 0.924], [400, 0.964]] }
        ],
        interpret: "<b>The main chart, real numbers from load_digits.</b> The x-axis is how many labels you reveal; the y-axis is test accuracy on a fixed held-out set. Read the vertical gap between the two lines as 'what the unlabeled pile bought you'. On the left (10 labels) the green semi-supervised line more than doubles the blue labels-only line (0.466 vs 0.220) — the unlabeled points reveal the digit clusters and pin the boundary in the empty gaps. Walking right, both lines climb and converge: by 400 labels the gap nearly vanishes (0.972 vs 0.964). The takeaway: unlabeled data pays off most when labels are scarce, and the payoff shrinks as labels grow plentiful."
      },
      {
        type: "line",
        title: "Mismatched / off-distribution unlabeled data: the green line drops BELOW labels-only (illustrative)",
        xlabel: "number of labeled examples",
        ylabel: "test accuracy (fraction correct, 500 held-out digits)",
        series: [
          { name: "labels + unlabeled (wrong distribution)", color: "#ff7b72", points: [[10, 0.19], [20, 0.34], [30, 0.45], [50, 0.66], [100, 0.79], [200, 0.86], [400, 0.92]] },
          { name: "labels only (kNN)", color: "#4ea1ff", points: [[10, 0.22], [20, 0.406], [30, 0.532], [50, 0.76], [100, 0.862], [200, 0.924], [400, 0.964]] }
        ],
        interpret: "<b>Illustrative failure case.</b> Same axes, but now the red 'with unlabeled' line sits <b>below</b> the blue labels-only line everywhere. That inversion is the tell-tale sign that your unlabeled pile came from a different distribution than the labeled task — different classes or a different domain. Its clusters do not line up with the real classes, so the unlabeled loss drags the boundary toward the wrong structure and you would have been better off ignoring it. The fix: filter the unlabeled set to match the target domain, or turn the unlabeled weight lambda down."
      },
      {
        type: "line",
        title: "No cluster / manifold structure: the two lines lie on top of each other (illustrative)",
        xlabel: "number of labeled examples",
        ylabel: "test accuracy (fraction correct, 500 held-out digits)",
        series: [
          { name: "labels + unlabeled (no usable structure)", color: "#ffb454", points: [[10, 0.23], [20, 0.41], [30, 0.54], [50, 0.75], [100, 0.86], [200, 0.92], [400, 0.96]] },
          { name: "labels only (kNN)", color: "#4ea1ff", points: [[10, 0.22], [20, 0.406], [30, 0.532], [50, 0.76], [100, 0.862], [200, 0.924], [400, 0.964]] }
        ],
        interpret: "<b>Illustrative null case.</b> Here the orange and blue lines are nearly indistinguishable at every label count — adding unlabeled data changed nothing. You see this when the data has no cluster or manifold structure to exploit: the points do not clump into class-pure groups and there is no low-density valley for the boundary to settle into, so the unlabeled term has nothing to push on. The honest read is that semi-supervised learning is not buying you anything here; do not bolt it on out of habit."
      }
    ],
    caption: "A reproducible sklearn proxy on load_digits (1797 real 8x8 handwritten digits). The first chart uses real numbers (LabelSpreading vs labels-only kNN); the mismatched and no-structure charts are illustrative shapes showing how the same comparison looks when the field's assumptions break. Real SimCLR / FixMatch need a GPU; this is a faithful small-scale stand-in.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.semi_supervised import LabelSpreading
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split

digits = load_digits()                       # 1797 real 8x8 handwritten digits
X, y = digits.data / 16.0, digits.target

# fixed test set; the rest is a pool whose labels we reveal gradually
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=500, random_state=0, stratify=y)

rng = np.random.RandomState(0)
order = rng.permutation(len(y_tr))           # which pool points get labels first
label_counts = [10, 20, 30, 50, 100, 200, 400]
sup_acc, ssl_acc = [], []

for n_lab in label_counts:
    lab_idx = order[:n_lab]
    # labels-only baseline: kNN trained on just the labeled points
    knn = KNeighborsClassifier(n_neighbors=min(5, n_lab))
    knn.fit(X_tr[lab_idx], y_tr[lab_idx])
    sup_acc.append(round(float(knn.score(X_te, y_te)), 3))

    # semi-supervised: LabelSpreading over labeled + unlabeled pool (-1 = unlabeled)
    y_semi = np.full(len(y_tr), -1)
    y_semi[lab_idx] = y_tr[lab_idx]
    ls = LabelSpreading(kernel="knn", n_neighbors=7, alpha=0.2, max_iter=40)
    ls.fit(X_tr, y_semi)
    ssl_acc.append(round(float(ls.score(X_te, y_te)), 3))

print("labels :", label_counts)
print("sup    :", sup_acc)   # [0.22, 0.406, 0.532, 0.76, 0.862, 0.924, 0.964]
print("semi   :", ssl_acc)   # [0.466, 0.794, 0.902, 0.946, 0.95, 0.966, 0.972]`
  };
})();
