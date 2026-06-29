(function () {
  window.LESSONS.push({
    id: "unl-fixmatch",
    title: "FixMatch: confidence-thresholded pseudo-labels meet consistency",
    tagline: "Guess a label from a weak view; if you are sure enough, train a strong view to match it.",
    module: "Semi & Self-Supervised Learning",
    prereqs: ["dl-cross-entropy", "dl-data-augmentation", "dl-conv", "mod-contrastive"],
    bigIdea:
      `<p><b>FixMatch</b> (Sohn et al., 2020) is the method that beat the complicated ones by being simple. It learns from a pile of unlabeled images with one short rule.</p>
       <p>For each unlabeled image, make a <b>weakly augmented</b> copy (a small flip or shift). Ask the model what it is. If the model is <i>very</i> sure — its top probability clears a high bar $\\tau$ (for example 0.95) — write down that top guess as a fake "hard" label, called a <b>pseudo-label</b>.</p>
       <p>Then make a <b>strongly augmented</b> copy of the same image (heavy distortion). Train the model so its prediction on that hard copy matches the pseudo-label from the easy copy.</p>
       <p>That single move fuses three older ideas: <b>weak/strong augmentation</b>, <b>confidence-thresholded pseudo-labels</b> [unl-pseudo-label], and <b>consistency regularization</b> [unl-consistency] — into one loss. It needs no second network and no complicated schedule, yet on CIFAR-10 (a 10-class image benchmark) it reaches about 94% accuracy with only <b>40 labeled images</b> — four per class.</p>`,
    buildup:
      `<p>Two earlier ideas set this up. Read them side by side.</p>
       <ul>
         <li><b>Pseudo-labeling</b> [unl-pseudo-label]: let the model label its own unlabeled data, then train on those guesses. The danger is that early guesses are wrong, and the model reinforces its own mistakes.</li>
         <li><b>Consistency regularization</b> [unl-consistency]: the prediction should not change when you perturb the input. Augment an image two ways; push the two predictions together.</li>
       </ul>
       <p>FixMatch's insight is to combine them with an <b>asymmetry</b>. The label comes from the <i>easy</i> (weakly augmented) view, where the model is most trustworthy. The thing being trained is the <i>hard</i> (strongly augmented) view, which forces the model to generalize. A high <b>confidence threshold</b> $\\tau$ filters out the shaky guesses, so the model only teaches itself on cases it is already confident about.</p>
       <p>It also relates to <b>MixMatch</b> [unl-mixmatch], an earlier method that averaged predictions over several augmentations and "sharpened" the result into a soft target. FixMatch drops the averaging and the soft target: one weak view, one hard <b>argmax</b> label, one threshold. Simpler, and it matched or beat MixMatch.</p>
       <p>Two augmentation strengths appear throughout. <b>Weak</b> = random horizontal flip plus a small random shift. <b>Strong</b> = RandAugment or CTAugment (Control Theory Augment): a stack of aggressive, randomly chosen transforms (rotate, shear, posterize, contrast) plus Cutout. The two must differ a lot, or there is nothing for consistency to enforce.</p>`,
    symbols: [
      { sym: "$x_b$", desc: "one unlabeled image, the $b$-th in the batch." },
      { sym: "$\\text{weak}(x_b)$", desc: "a weakly augmented copy of $x_b$: a random flip and a small shift only." },
      { sym: "$\\text{strong}(x_b)$", desc: "a strongly augmented copy of $x_b$: heavy RandAugment / CTAugment distortion plus Cutout." },
      { sym: "$p(y \\mid \\cdot)$", desc: "the model's predicted probability distribution over the classes for a given input. It is a list of numbers that sum to 1, one per class." },
      { sym: "$q_b$", desc: "the prediction on the weak view: $q_b = p(y \\mid \\text{weak}(x_b))$. The full probability vector." },
      { sym: "$\\max(q_b)$", desc: "the largest entry of $q_b$: the model's confidence in its single best guess for the weak view." },
      { sym: "$\\hat{q}_b$", desc: "the pseudo-label: the class index of the best guess, $\\hat{q}_b = \\arg\\max q_b$. A single hard class, not a distribution." },
      { sym: "$\\tau$", desc: "the confidence threshold (Greek 'tau'), e.g. 0.95. We only use an unlabeled image if $\\max(q_b) \\ge \\tau$." },
      { sym: "$\\mathbb{1}(\\cdot)$", desc: "the indicator function: it is 1 when the condition inside is true, and 0 when it is false. Here it is the keep/drop switch for each image." },
      { sym: "$H(p, q)$", desc: "the cross-entropy [dl-cross-entropy] between a target $p$ and a prediction $q$. It is small when $q$ puts high probability on the class that $p$ points to." },
      { sym: "$B$", desc: "the number of <i>labeled</i> images in the batch." },
      { sym: "$\\mu$", desc: "the ratio of unlabeled to labeled images per batch (Greek 'mu'), so there are $\\mu B$ unlabeled images. FixMatch uses a large $\\mu$, e.g. 7, to learn mostly from unlabeled data." },
      { sym: "$\\lambda_u$", desc: "the weight on the unlabeled loss (Greek 'lambda'): how much the unlabeled term counts against the supervised term. FixMatch uses $\\lambda_u = 1$." }
    ],
    formula: `$$ \\mathcal{L}_u = \\frac{1}{\\mu B} \\sum_{b=1}^{\\mu B} \\mathbb{1}\\!\\big(\\max(q_b) \\ge \\tau\\big)\\; H\\!\\big(\\hat{q}_b,\\; p(y \\mid \\text{strong}(x_b))\\big), \\qquad q_b = p(y \\mid \\text{weak}(x_b)),\\;\\; \\hat{q}_b = \\arg\\max q_b $$`,
    whatItDoes:
      `<p>Read the unlabeled loss $\\mathcal{L}_u$ one piece at a time, for a single unlabeled image $x_b$.</p>
       <ul>
         <li>$q_b = p(y \\mid \\text{weak}(x_b))$: run the easy view through the model. Get a probability over classes.</li>
         <li>$\\max(q_b)$: how confident is the best guess? If it clears the bar $\\tau$, keep this image; otherwise the indicator $\\mathbb{1}(\\cdot)$ is 0 and the image contributes nothing this step.</li>
         <li>$\\hat{q}_b = \\arg\\max q_b$: turn the best guess into a single hard class. This is the pseudo-label. (Hardening to one class is what separates FixMatch from MixMatch's soft target.)</li>
         <li>$p(y \\mid \\text{strong}(x_b))$: run the <i>hard</i> view through the same model. Get a second probability.</li>
         <li>$H(\\hat{q}_b, \\cdot)$: cross-entropy [dl-cross-entropy] between the hard pseudo-label and the strong-view prediction. Minimizing it pushes the strong view to agree with the easy view's confident guess.</li>
         <li>$\\frac{1}{\\mu B}\\sum$: average this over all $\\mu B$ unlabeled images in the batch.</li>
       </ul>
       <p>The full training loss adds the ordinary supervised loss on the few real labels:</p>
       $$ \\mathcal{L} = \\mathcal{L}_s + \\lambda_u \\, \\mathcal{L}_u, \\qquad \\mathcal{L}_s = \\frac{1}{B} \\sum_{b=1}^{B} H\\big(y_b,\\; p(y \\mid \\text{weak}(x_b))\\big) $$
       <p>where $\\mathcal{L}_s$ is plain cross-entropy on the labeled images (weakly augmented). So the model learns from real labels and from its own confident guesses at the same time.</p>`,
    derivation:
      `<p><b>Why hard labels with a high threshold work.</b></p>
       <ul class="steps">
         <li>Pseudo-labeling on raw outputs reinforces the model's mistakes: a wrong-but-confident guess becomes a training target and the error compounds. This is <b>confirmation bias</b>.</li>
         <li>The threshold $\\tau$ is a filter against that. Only images where the model is already very sure (over $\\tau$) become targets, so the pseudo-labels are mostly correct. Early in training almost nothing clears the bar, so the unlabeled loss is near zero and the model trains on real labels first. The unlabeled signal switches on gradually as the model improves — a self-paced curriculum, with no schedule to tune.</li>
         <li>Using $\\arg\\max$ (a hard label) instead of the soft probability is itself a form of <b>sharpening</b>: it is the limit of MixMatch's [unl-mixmatch] temperature-sharpening as the temperature goes to 0. A hard target says "be very sure", which pairs naturally with the high-confidence gate.</li>
         <li>The asymmetry is the key. The target is read off the <b>weak</b> view (most reliable), and the loss trains the <b>strong</b> view (hardest). So the model must give the same confident answer even after heavy distortion — exactly the consistency [unl-consistency] objective, now anchored to a clean pseudo-label.</li>
         <li>Net effect: $\\mathcal{L}_u$ is a consistency loss whose target is a confidence-filtered hard pseudo-label. One term, three ideas. $\\blacksquare$</li>
       </ul>`,
    example:
      `<p>Two unlabeled images, 3 classes [cat, dog, bird], threshold $\\tau = 0.95$. We read the weak-view confidence $\\max(q_b)$, gate on $\\tau$, and only the kept image pays a loss.</p>
       <table class="extable">
         <caption>Weak-view prediction $q_b$, keep/drop gate, and resulting loss</caption>
         <thead><tr><th>image</th><th class="num">cat</th><th class="num">dog</th><th class="num">bird</th><th class="num">$\\max(q_b)$</th><th>$\\ge\\tau$?</th><th>$\\mathbb{1}$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">A (confident)</td><td class="num">0.97</td><td class="num">0.02</td><td class="num">0.01</td><td class="num">0.97</td><td>yes</td><td class="num">1</td></tr>
           <tr><td class="row-h">B (shaky)</td><td class="num">0.55</td><td class="num">0.40</td><td class="num">0.05</td><td class="num">0.55</td><td>no</td><td class="num">0</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li>Image A: confidence $0.97 \\ge 0.95$, so $\\mathbb{1}(\\cdot) = 1$ — keep it. Pseudo-label $\\hat{q}_b = \\arg\\max q_b = $ class 0 (cat).</li>
         <li>Strong view of A (rotated, sheared, Cutout) through the same model: $p(y \\mid \\text{strong}) = [0.6,\\ 0.3,\\ 0.1]$ — the distortion made it less sure.</li>
         <li>Cross-entropy to the hard pseudo-label (cat): $H = -\\log(0.6) \\approx 0.51$. This loss pushes the strong-view "cat" probability up toward 1.</li>
         <li>Image B: confidence $0.55 \\lt 0.95$, so $\\mathbb{1}(\\cdot) = 0$ — it contributes <b>nothing</b> this step. The threshold quietly dropped a guess the model was not sure about.</li>
       </ul>
       <p>That is the whole unlabeled step: keep the confident ones, harden their guess, and make the distorted view match.</p>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // weak-view confidence (top prob) and threshold are draggable.
      var st = { conf: 0.97, tau: 0.95 };
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 220; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, 640, 220);
        // build a 3-class weak-view distribution: top = conf, rest split.
        var rest = (1 - st.conf) / 2;
        var probs = [st.conf, rest, rest];
        var names = ["cat", "dog", "bird"];
        var keep = st.conf >= st.tau;
        var x0 = 40, y0 = 30, bw = 120, gap = 40, maxH = 110;
        ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillStyle = c.dim; ctx.fillText("weak-view prediction qₕ", x0 + 1.5 * bw + gap, y0 - 12);
        for (var i = 0; i < 3; i++) {
          var h = probs[i] * maxH;
          var bx = x0 + i * (bw + gap), by = y0 + (maxH - h) + 16;
          var top = i === 0;
          ctx.fillStyle = top ? (keep ? c.accent2 : c.warn) : c.panel;
          ctx.fillRect(bx, by, bw, h);
          ctx.strokeStyle = c.border; ctx.strokeRect(bx, by, bw, h);
          ctx.fillStyle = c.ink; ctx.fillText(names[i] + " " + probs[i].toFixed(2), bx + bw / 2, y0 + maxH + 34);
        }
        // threshold line across the chart
        var ty = y0 + (maxH - st.tau * maxH) + 16;
        ctx.strokeStyle = c.purple; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(x0 - 10, ty); ctx.lineTo(x0 + 3 * bw + 2 * gap + 10, ty); ctx.stroke();
        ctx.setLineDash([]); ctx.lineWidth = 1;
        ctx.fillStyle = c.purple; ctx.textAlign = "left"; ctx.fillText("τ = " + st.tau.toFixed(2), x0 + 3 * bw + 2 * gap + 14, ty + 4);
        ctx.textAlign = "left";
      }
      function slider(label, key, min, max, step) {
        var row = document.createElement("div"); row.style.margin = "6px 0";
        var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label;
        var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
        inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); render(); });
        row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
      }
      slider("weak-view confidence  max(qₕ)", "conf", 0.34, 1.0, 0.01);
      slider("confidence threshold  τ", "tau", 0.5, 0.99, 0.01);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function render() {
        draw();
        var keep = st.conf >= st.tau;
        rd.innerHTML = keep
          ? "max(qₕ) = " + st.conf.toFixed(2) + " ≥ τ = " + st.tau.toFixed(2) + ": <b>kept</b>. Pseudo-label = argmax = <b>cat</b>. The strong view is now trained (cross-entropy) to predict cat."
          : "max(qₕ) = " + st.conf.toFixed(2) + " &lt; τ = " + st.tau.toFixed(2) + ": <b>dropped</b>. The indicator is 0, so this image contributes nothing this step.";
      }
      render();
    },
    application:
      `<p>FixMatch is the default starting point for semi-supervised image classification when labels are scarce and unlabeled images are plentiful. On CIFAR-10 it reaches roughly 94% test accuracy with only 40 labeled images (4 per class), and stays strong down to even fewer labels — results that earlier, more complex methods needed far more labels to match.</p>
       <p>The recipe has been carried into medical imaging (label a few scans, exploit thousands of unlabeled ones), audio and speech (FixMatch-style consistency on spectrograms), and is the conceptual backbone of later methods like FlexMatch (per-class adaptive thresholds) and FreeMatch. Anywhere labeling is the bottleneck and a strong augmentation pipeline exists, it is a strong first thing to try.</p>`,
    whenToUse:
      `<p><b>Reach for FixMatch when you have very few labels but lots of unlabeled images of the same kind</b>, a single network you can train end to end, and access to a strong augmentation pipeline (RandAugment / CTAugment). It is the simplest method that delivers near-fully-supervised accuracy in the few-label regime.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Plain pseudo-labeling</b> [unl-pseudo-label] — the confidence threshold plus the weak/strong split guard against confirmation bias that wrecks naive self-training.</li>
         <li><b>MixMatch</b> [unl-mixmatch] and other multi-component methods — FixMatch drops the prediction averaging, soft sharpening, and MixUp, yet matches or beats them. Fewer moving parts to tune.</li>
         <li><b>Pure consistency regularization</b> [unl-consistency] — the high-confidence hard pseudo-label gives the consistency loss a clean, decisive target instead of chasing a soft moving one.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>The data is tabular or lacks meaningful augmentations — there is no "strong vs weak" view to build, so the core mechanism has nothing to act on. Use a graph-based method like LabelSpreading instead.</li>
         <li>You have <i>no</i> labels at all — that is self-supervised pretraining (contrastive [mod-contrastive] / masked modeling), not semi-supervised FixMatch.</li>
         <li>Classes are severely imbalanced — a single global threshold $\\tau$ accepts mostly the easy majority class; reach for FlexMatch's per-class thresholds.</li>
       </ul>
       <p><b>Libraries:</b> the reference TensorFlow code from the authors, plus PyTorch reimplementations and the <code>USB</code> (Unified Semi-supervised learning Benchmark) and <code>Semilearn</code> toolkits.</p>`,
    pitfalls:
      `<ul>
         <li><b>Threshold too high too early.</b> With $\\tau = 0.95$ and an untrained model, almost nothing clears the bar, so $\\mathcal{L}_u \\approx 0$ and the unlabeled data sits idle. This is usually fine (the model warms up on labels first), but if it never turns on, lower $\\tau$ or check that the supervised loss is actually learning.</li>
         <li><b>Threshold too low.</b> A low $\\tau$ accepts shaky guesses, including wrong ones, and the model trains on its own mistakes — <b>confirmation bias</b>. Accuracy can collapse. Keep $\\tau$ high (0.9–0.95) and let the curriculum self-pace.</li>
         <li><b>Weak and strong augmentations too similar.</b> If the strong view barely differs from the weak view, the consistency loss is trivially satisfied and teaches nothing. The strong pipeline must be genuinely aggressive (RandAugment + Cutout); the weak one must stay mild (flip + shift).</li>
         <li><b>Class imbalance among accepted pseudo-labels.</b> A global $\\tau$ tends to accept the easy, frequent classes first, so the pseudo-label set skews toward them and rare classes are starved. Monitor the per-class count of accepted pseudo-labels; use FlexMatch-style per-class thresholds if it is lopsided.</li>
         <li><b>No real strong-augmentation pipeline.</b> FixMatch's gains depend on RandAugment / CTAugment. Swapping in only flips and crops as "strong" augmentation removes most of the benefit. Budget for a proper augmentation stack.</li>
         <li><b>Tiny labeled batch, huge unlabeled ratio.</b> With $\\mu$ as large as 7, an unstable supervised signal lets bad pseudo-labels dominate. Make sure the few labels are clean and the supervised term $\\mathcal{L}_s$ stays healthy.</li>
       </ul>`,
    practice: [
      {
        q: `Unlabeled image, 4 classes, $\\tau = 0.95$. Weak-view prediction $q_b = [0.96,\\ 0.02,\\ 0.01,\\ 0.01]$. Is it kept, and what is the pseudo-label?`,
        steps: [
          { do: `Find $\\max(q_b)$, the largest probability.`, why: `That is the model's confidence in its single best guess on the easy view.` },
          { do: `Compare it to $\\tau = 0.95$ via the indicator $\\mathbb{1}(\\max(q_b) \\ge \\tau)$.`, why: `The image is used only if confidence clears the threshold; otherwise it contributes nothing.` },
          { do: `If kept, take $\\hat{q}_b = \\arg\\max q_b$, the index of that largest entry.`, why: `The pseudo-label is the single hard class, not the whole distribution.` }
        ],
        answer: `<p>$\\max(q_b) = 0.96$. Since $0.96 \\ge 0.95$, the indicator is 1, so the image is <b>kept</b>. The pseudo-label is $\\hat{q}_b = \\arg\\max q_b = $ class 0 (the first entry). The strong-augmented view of this image is then trained, by cross-entropy, to predict class 0.</p>`
      },
      {
        q: `Why does FixMatch read the pseudo-label from the WEAK view but apply the loss on the STRONG view? What would break if you swapped them?`,
        steps: [
          { do: `Recall which view the model predicts most reliably.`, why: `Mild augmentation keeps the image close to its true form, so the confident guess is more likely correct.` },
          { do: `Recall what the consistency loss is trying to force.`, why: `We want the prediction to survive heavy distortion, which only pushes the model to generalize if the target view is hard.` }
        ],
        answer: `<p>The weak view is the most trustworthy, so its confident guess makes the cleanest pseudo-label. The strong view is the hardest, so forcing it to match teaches the model to generalize through heavy distortion — that is the consistency [unl-consistency] payoff. If you swapped them, you would read the label off a badly distorted image (often wrong, polluting the target) and train on an easy image (no generalization pressure). Both effects are lost, and confirmation bias gets worse.</p>`
      }
    ]
  });

  window.CODE["unl-fixmatch"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The FixMatch training step. A batch holds a few labeled images and many unlabeled ones; each unlabeled image is forwarded twice (weak and strong views). The supervised cross-entropy on the labels and the confidence-masked consistency loss on the unlabeled data are summed. This is the real method (runs on a Colab GPU); the in-browser engine has no PyTorch, so it is shown, not executed.</p>`,
    code: `import torch
import torch.nn.functional as F

def fixmatch_step(model, x_lab, y_lab, x_weak, x_strong,
                  tau=0.95, lambda_u=1.0):
    """One FixMatch optimization step.
      x_lab    : [B,  C,H,W]  weakly-augmented LABELED images
      y_lab    : [B]          their true labels
      x_weak   : [muB,C,H,W]  WEAKLY-augmented unlabeled images
      x_strong : [muB,C,H,W]  STRONGLY-augmented copies of the SAME images
    Returns the scalar total loss (call .backward() on it).
    """
    # ---- supervised term: plain cross-entropy on the few real labels ----
    logits_lab = model(x_lab)
    loss_s = F.cross_entropy(logits_lab, y_lab)

    # ---- weak view: build the pseudo-labels (no gradient through this) ----
    with torch.no_grad():
        logits_weak = model(x_weak)
        q = F.softmax(logits_weak, dim=1)        # q_b = p(y | weak(x_b))
        max_q, pseudo = q.max(dim=1)             # confidence and argmax label
        mask = (max_q >= tau).float()            # 1{ max(q_b) >= tau }

    # ---- strong view: train it to match the hard pseudo-label ----
    logits_strong = model(x_strong)              # gradients flow here
    # per-example cross-entropy H(pseudo_b, p(y | strong(x_b)))
    ce = F.cross_entropy(logits_strong, pseudo, reduction="none")
    loss_u = (ce * mask).mean()                  # average over the muB images

    # ---- total loss = supervised + lambda_u * unlabeled ----
    loss = loss_s + lambda_u * loss_u
    return loss, mask.mean()                      # also report the kept fraction


# --- usage sketch (RandAugment provides the strong augmentation) ---
# for (x_lab, y_lab), (x_uw, x_us) in zip(labeled_loader, unlabeled_loader):
#     loss, kept = fixmatch_step(model, x_lab, y_lab, x_uw, x_us, tau=0.95)
#     optimizer.zero_grad(); loss.backward(); optimizer.step()
#     # 'kept' rises from ~0 early (nothing clears tau) toward ~1 as the model improves`
  };

  window.CODEVIZ["unl-fixmatch"] = {
    question: "FixMatch's central knob is the confidence threshold tau. How should a self-trained classifier's accuracy move as you sweep that threshold — and what do the unhealthy sweeps look like?",
    charts: [
      {
        type: "line", title: "Healthy sweep: self-training beats labels-only in a mid-tau window (real load_digits, 40 labels)", xlabel: "confidence threshold τ", ylabel: "test accuracy",
        series: [
          { name: "self-training (FixMatch idea)", color: "#7ee787", points: [[0.50, 0.894], [0.60, 0.881], [0.70, 0.856], [0.80, 0.661], [0.90, 0.867], [0.95, 0.867], [0.99, 0.867]] },
          { name: "labels-only baseline", color: "#9aa7b4", points: [[0.50, 0.867], [0.60, 0.867], [0.70, 0.867], [0.80, 0.867], [0.90, 0.867], [0.95, 0.867], [0.99, 0.867]] }
        ],
        interpret: "<b>Real numbers</b> from scikit-learn's SelfTrainingClassifier on load_digits (1797 real 8x8 digit images, 40 labels). X is the confidence threshold τ; Y is held-out accuracy. The grey flat line is the labels-only baseline (0.867) — it ignores τ. The green line is self-training: at a moderate τ (0.50-0.60) confident pseudo-labels lift it <b>above</b> baseline (0.89 vs 0.87); the 0.80 dip is a single noisy run admitting some wrong guesses; at high τ (0.90+) almost nothing clears the bar so it collapses back onto the baseline. <b>Read it as:</b> there is a useful mid-τ window, and very high τ wastes the unlabeled data."
      },
      {
        type: "line", title: "Confirmation-bias collapse: τ too low admits wrong pseudo-labels (illustrative)", xlabel: "confidence threshold τ", ylabel: "test accuracy",
        series: [
          { name: "self-training", color: "#ff7b72", points: [[0.50, 0.62], [0.60, 0.70], [0.70, 0.80], [0.80, 0.86], [0.90, 0.87], [0.95, 0.867], [0.99, 0.867]] },
          { name: "labels-only baseline", color: "#9aa7b4", points: [[0.50, 0.867], [0.60, 0.867], [0.70, 0.867], [0.80, 0.867], [0.90, 0.867], [0.95, 0.867], [0.99, 0.867]] }
        ],
        interpret: "<b>Illustrative</b> failure shape (not the real run). When the model is shaky and τ is set low, the gate lets in many <i>wrong</i> guesses; the model trains on its own mistakes and the red curve sits <b>below</b> the grey baseline at low τ, climbing back to baseline only as τ rises and filters the junk out. <b>Recognise it</b> by a curve that is worst on the left and improves as τ increases — the opposite of a free lunch. The cure is to raise τ (FixMatch uses 0.95) so only confident, mostly-correct pseudo-labels are kept."
      },
      {
        type: "line", title: "Threshold-starved: τ so high the unlabeled data never switches on (illustrative)", xlabel: "confidence threshold τ", ylabel: "test accuracy",
        series: [
          { name: "self-training", color: "#ffb454", points: [[0.50, 0.90], [0.60, 0.895], [0.70, 0.89], [0.80, 0.88], [0.90, 0.871], [0.95, 0.868], [0.99, 0.867]] },
          { name: "labels-only baseline", color: "#9aa7b4", points: [[0.50, 0.867], [0.60, 0.867], [0.70, 0.867], [0.80, 0.867], [0.90, 0.867], [0.95, 0.867], [0.99, 0.867]] }
        ],
        interpret: "<b>Illustrative.</b> Here the gain is real at low τ but the curve slides monotonically back to baseline as τ tightens: by τ=0.99 essentially no unlabeled image clears the bar, so the unlabeled loss is ~0 and you are training on the 40 labels alone. <b>Recognise it</b> by a curve that touches the grey baseline at the right edge and only separates from it on the left. <b>Conclude:</b> if your accepted-pseudo-label count is near zero, τ is too high — lower it or train the supervised head longer so more images become confident."
      }
    ],
    caption: "The main panel is real scikit-learn output; the two variants are illustrative shapes of the same sweep gone wrong. All isolate FixMatch's central mechanism — confidence-thresholded pseudo-labeling — on a CPU. Real FixMatch on CIFAR-10 with a CNN, RandAugment, and a GPU is the full method this proxy stands in for.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.semi_supervised import SelfTrainingClassifier

digits = load_digits()                         # 1797 real 8x8 handwritten digits
X, y = digits.data / 16.0, digits.target        # pixels scaled to 0..1
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.3, random_state=1, stratify=y)

# keep only 40 labels (4 per class); mark the rest unlabeled with -1
rng = np.random.RandomState(0)
lab_idx = []
for c in range(10):
    ci = rng.permutation(np.where(y_tr == c)[0])
    lab_idx += list(ci[:4])
lab_idx = np.array(lab_idx)
y_semi = y_tr.copy()
unlab = np.ones(len(y_tr), dtype=bool); unlab[lab_idx] = False
y_semi[unlab] = -1                              # SelfTrainingClassifier ignores -1

def base():                                    # confident base estimator
    return LogisticRegression(C=1.0, max_iter=2000)

# labels-only baseline: train on the 40 labels alone
baseline = base().fit(X_tr[lab_idx], y_tr[lab_idx]).score(X_te, y_te)

# sweep the confidence threshold = FixMatch's tau
for t in [0.50, 0.60, 0.70, 0.80, 0.90, 0.95, 0.99]:
    st = SelfTrainingClassifier(base(), threshold=t, max_iter=100)
    st.fit(X_tr, y_semi)                        # uses labels + pseudo-labels >= t
    acc = st.score(X_te, y_te)
    print("tau=%.2f  self-train=%.3f  baseline=%.3f" % (t, acc, baseline))`
  };
})();
