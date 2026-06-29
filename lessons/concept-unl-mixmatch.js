(function () {
  window.LESSONS.push({
    id: "unl-mixmatch",
    title: "MixMatch: one loss that mixes labeled and guessed-label data",
    tagline: "Guess a label for each unlabeled image, sharpen the guess, then MixUp everything into one clean supervised + consistency loss.",
    module: "Semi & Self-Supervised Learning",
    prereqs: ["dl-cross-entropy", "dl-data-augmentation", "dl-conv"],
    bigIdea:
      `<p>You have a few labeled images and a big pile of unlabeled ones. <b>MixMatch</b> (Berthelot et al., 2019) is a recipe that turns that pile into useful training signal with one combined loss.</p>
       <p>The trick is to <i>guess</i> a soft label for each unlabeled image, make that guess a little more confident (<b>sharpen</b> it), and then blend labeled and guessed-label images together with <b>MixUp</b> so the network never sees a hard boundary between "real label" and "guess".</p>
       <p>It folds together two earlier ideas you have already met: consistency training [unl-consistency] (the model should agree across augmentations) and pseudo-labeling [unl-pseudo-label] (treat a confident prediction as a label). MixMatch is the clean, single-loss unification of both.</p>`,
    buildup:
      `<p>The recipe runs on one mini-batch at a time and has four steps.</p>
       <ol>
         <li><b>Guess a label by averaging augmentations.</b> Take an unlabeled image, make $K$ random augmentations [dl-data-augmentation] of it (small crops, flips), run all $K$ through the network, and <b>average</b> the $K$ predicted probability distributions. Averaging cancels the noise from any single augmentation, so the average is a steadier guess than any one view.</li>
         <li><b>Sharpen the guess.</b> The averaged guess is often timid (mass spread over several classes). <b>Sharpening</b> with a temperature $T\\lt 1$ pushes mass toward the most likely class, nudging the guess toward a confident target without forcing it all the way to a hard label.</li>
         <li><b>MixUp everything.</b> Concatenate the labeled batch (with real labels) and the unlabeled batch (with sharpened guessed labels), shuffle, and form <b>MixUp</b> pairs: each training example becomes a convex blend $\\lambda x_1+(1-\\lambda)x_2$ of two images, with its target the same blend of the two labels. Now every example is part real, part guessed.</li>
         <li><b>One combined loss.</b> Supervised <b>cross-entropy</b> [dl-cross-entropy] on the mixed examples that came from the labeled batch, plus a <b>consistency</b> term (squared error between predicted and guessed distributions) on the ones that came from the unlabeled batch. Add them with a weight $\\lambda_U$.</li>
       </ol>
       <p>Forward to the sequel: FixMatch [unl-fixmatch] later showed you can drop the averaging-and-sharpening and the MixUp, and instead pair a <i>weak</i> augmentation's confident hard pseudo-label with a <i>strong</i> augmentation's prediction. MixMatch is the richer ancestor; FixMatch is the stripped-down descendant.</p>`,
    symbols: [
      { sym: "$x$", desc: "an unlabeled input image." },
      { sym: "$K$", desc: "the number of random augmentations made of each unlabeled image (the paper uses $K=2$)." },
      { sym: "$p$", desc: "a predicted probability distribution over the classes: a list of numbers that are each at least 0 and sum to 1." },
      { sym: "$p_c$", desc: "the predicted probability for class $c$ (one entry of $p$)." },
      { sym: "$\\bar{p}$", desc: "the average of the $K$ predicted distributions for one image's $K$ augmentations: the guessed label before sharpening." },
      { sym: "$T$", desc: "the sharpening temperature, a number with $0\\lt T\\le 1$. Smaller $T$ makes the guess more confident; $T=1$ leaves it unchanged; $T\\to 0$ collapses it to a one-hot (all mass on one class)." },
      { sym: "$\\lambda$", desc: "the MixUp blend weight, drawn from a Beta distribution. $\\lambda$ near 1 means the blend is mostly the first image; near 0 means mostly the second (Greek 'lambda')." },
      { sym: "$\\alpha$", desc: "the shape parameter of the Beta distribution that $\\lambda$ is drawn from (Greek 'alpha'). It controls how strong the mixing is." },
      { sym: "$\\tilde{x}$", desc: "a MixUp-blended image: the convex combination $\\lambda x_1+(1-\\lambda)x_2$ of two inputs." },
      { sym: "$\\mathcal{L}_X$", desc: "the supervised loss: cross-entropy on the mixed examples that came from the labeled batch." },
      { sym: "$\\mathcal{L}_U$", desc: "the unlabeled (consistency) loss: mean squared error between the model's prediction and the guessed distribution, on examples from the unlabeled batch." },
      { sym: "$\\lambda_U$", desc: "the weight on the unlabeled loss, ramped up from 0 during training (Greek 'lambda', subscript U)." }
    ],
    formula: `$$ \\text{Sharpen}(p,T)_c=\\frac{p_c^{1/T}}{\\sum_j p_j^{1/T}}, \\qquad \\tilde{x}=\\lambda x_1+(1-\\lambda)x_2,\\ \\ \\lambda\\sim\\text{Beta}(\\alpha,\\alpha), \\qquad \\mathcal{L}=\\mathcal{L}_X+\\lambda_U\\,\\mathcal{L}_U $$`,
    whatItDoes:
      `<p>Read the three pieces left to right.</p>
       <ul>
         <li><b>Sharpening.</b> $\\text{Sharpen}(p,T)_c=p_c^{1/T}/\\sum_j p_j^{1/T}$ raises every probability to the power $1/T$ and then renormalizes so the result still sums to 1. With $T=1$ the power is 1 and nothing changes. With $T\\lt 1$ the power $1/T$ is bigger than 1, which stretches large probabilities up and squashes small ones down — the distribution gets <i>peakier</i>. As $T\\to 0$ the power blows up and all the mass piles onto the single largest class, a one-hot guess.</li>
         <li><b>MixUp.</b> $\\tilde{x}=\\lambda x_1+(1-\\lambda)x_2$ blends two images pixel-by-pixel, and the target is the same blend of their two label vectors. $\\lambda$ is drawn from $\\text{Beta}(\\alpha,\\alpha)$, which (for small $\\alpha$) usually lands near 0 or 1, so most blends are gentle. This forces the network to behave smoothly <i>between</i> examples, which regularizes it and stops it from trusting any single guessed label too hard.</li>
         <li><b>Combined loss.</b> $\\mathcal{L}=\\mathcal{L}_X+\\lambda_U\\mathcal{L}_U$. $\\mathcal{L}_X$ is ordinary cross-entropy on the labeled-origin examples; $\\mathcal{L}_U$ is squared error pulling the model's prediction toward the sharpened guess on the unlabeled-origin examples. The knob $\\lambda_U$ says how much we trust those guesses; it starts at 0 (guesses are garbage early) and ramps up.</li>
       </ul>
       <p>Why squared error and not cross-entropy for $\\mathcal{L}_U$? The guessed target is itself uncertain. Mean squared error is bounded and far less punishing than cross-entropy when the guess is wrong, so a bad pseudo-label does less damage. That is a deliberate safety choice.</p>`,
    derivation:
      `<p><b>Why sharpening is "minimum-entropy" pressure.</b> A core belief of semi-supervised learning is that decision boundaries should fall in low-density regions, which means the model should be confident (low entropy) on unlabeled points. Entropy is $-\\sum_c p_c\\log p_c$ and is largest when $p$ is flat. Sharpening lowers that entropy directly: pushing $T$ below 1 makes $\\bar{p}$ peakier, so the guessed target the model is trained toward is more confident. Training the prediction to match a sharpened target is a soft way of minimizing entropy without ever computing the entropy gradient.</p>
       <p><b>Why averaging $K$ augmentations first.</b> Each augmentation gives a slightly different, noisy prediction. If $\\bar{p}=\\frac{1}{K}\\sum_{k} p^{(k)}$ averages $K$ of them, the random part of the noise partly cancels (the average of several noisy estimates has lower variance than any one), so the guess you then sharpen is more reliable. Sharpening a <i>cleaner</i> average means you commit confidently to a guess that is more likely right.</p>
       <p><b>Why MixUp on top.</b> Pseudo-labels are wrong some of the time. Training hard on a wrong label memorizes the mistake. MixUp blends each example with a random other one, so no single (possibly wrong) target is ever presented at full strength; the network is trained on a smear of targets instead. This is what keeps confirmation bias — the model reinforcing its own early mistakes — in check. $\\blacksquare$</p>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // a fixed timid distribution over 6 classes; slider sweeps T
      var base = [0.05, 0.35, 0.10, 0.04, 0.38, 0.08];
      var st = { T: 1.0 };
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      function sharpen(p, T) {
        var q = p.map(function (v) { return Math.pow(v, 1.0 / T); });
        var z = q.reduce(function (a, b) { return a + b; }, 0);
        return q.map(function (v) { return v / z; });
      }
      function entropy(p) { var e = 0; for (var i = 0; i < p.length; i++) { if (p[i] > 1e-9) e -= p[i] * Math.log(p[i]); } return e; }
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, 640, 300);
        var q = sharpen(base, st.T);
        var n = base.length, bw = 70, x0 = 60, y0 = 230, maxh = 170;
        ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 - 10, y0); ctx.lineTo(x0 + n * bw + 4, y0); ctx.stroke();
        ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        for (var i = 0; i < n; i++) {
          var h = q[i] * maxh;
          var top = base.indexOf(Math.max.apply(null, base));
          ctx.fillStyle = i === top ? c.accent2 : c.accent;
          ctx.fillRect(x0 + i * bw, y0 - h, bw - 14, h);
          ctx.fillStyle = c.ink; ctx.font = "12px sans-serif";
          ctx.fillText(q[i].toFixed(3), x0 + i * bw + (bw - 14) / 2, y0 - h - 6);
          ctx.fillStyle = c.dim; ctx.fillText("class " + i, x0 + i * bw + (bw - 14) / 2, y0 + 16);
        }
        ctx.textAlign = "start";
        ctx.fillStyle = c.dim; ctx.font = "13px sans-serif";
        ctx.fillText("T = " + st.T.toFixed(2) + "   entropy = " + entropy(q).toFixed(3) + " (lower = more confident)", 60, 28);
        return q;
      }
      var row = document.createElement("div"); row.style.margin = "8px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "sharpening temperature T (drag toward 0 to sharpen)";
      var inp = document.createElement("input"); inp.type = "range"; inp.min = 0.05; inp.max = 1.0; inp.step = 0.05; inp.value = 1.0;
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
      function render() {
        var q = draw();
        rd.innerHTML = "Start: a timid guess split between class 1 (0.35) and class 4 (0.38). As you lower T, Sharpen(p,T) raises each probability to the power 1/T and renormalizes, piling mass onto the winning <b>class 4</b>. At T=" + st.T.toFixed(2) + " the winner is now <b>" + q[4].toFixed(3) + "</b>. Too low a T commits hard to that single guess — dangerous if the winner is wrong.";
      }
      inp.addEventListener("input", function () { st.T = parseFloat(inp.value); render(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row); host.appendChild(rd);
      render();
    },
    example:
      `<p>Sharpen a timid 3-class guess $p=[0.5,\\,0.3,\\,0.2]$ with temperature $T=0.5$, so the power is $1/T=2$.</p>
       <ul class="steps">
         <li>Raise each entry to the power 2: $0.5^2=0.25$, $0.3^2=0.09$, $0.2^2=0.04$.</li>
         <li>Sum them: $0.25+0.09+0.04=0.38$.</li>
         <li>Renormalize (divide each by 0.38): $0.25/0.38\\approx0.658$, $0.09/0.38\\approx0.237$, $0.04/0.38\\approx0.105$.</li>
         <li>So $\\text{Sharpen}(p,0.5)\\approx[0.658,\\,0.237,\\,0.105]$. The top class climbed from 0.50 to 0.66 and the laggards shrank: the guess is now more confident, exactly as intended.</li>
       </ul>
       <table class="extable">
         <caption>Sharpening, class by class ($T=0.5$, power $1/T=2$).</caption>
         <thead><tr><th>class</th><th class="num">$p_c$</th><th class="num">$p_c^{2}$</th><th class="num">$p_c^{2}/0.38$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">1</td><td class="num">0.50</td><td class="num">0.25</td><td class="num">0.658</td></tr>
           <tr><td class="row-h">2</td><td class="num">0.30</td><td class="num">0.09</td><td class="num">0.237</td></tr>
           <tr><td class="row-h">3</td><td class="num">0.20</td><td class="num">0.04</td><td class="num">0.105</td></tr>
           <tr><td class="row-h">sum</td><td class="num">1.00</td><td class="num">0.38</td><td class="num">1.000</td></tr>
         </tbody>
       </table>
       <p>Now one MixUp step on the labeled side. Image $x_1$ has one-hot label $[1,0,0]$, image $x_2$ has the sharpened guessed label $[0.658,0.237,0.105]$, and we draw $\\lambda=0.7$. The blended target is the same convex combination of the two label vectors, computed entry by entry below; the blended image is $\\tilde{x}=0.7\\,x_1+0.3\\,x_2$.</p>
       <ul class="steps">
         <li>Class 1: $0.7\\cdot 1 + 0.3\\cdot 0.658 = 0.700 + 0.197 = 0.897$.</li>
         <li>Class 2: $0.7\\cdot 0 + 0.3\\cdot 0.237 = 0 + 0.071 = 0.071$.</li>
         <li>Class 3: $0.7\\cdot 0 + 0.3\\cdot 0.105 = 0 + 0.032 = 0.032$.</li>
       </ul>
       <table class="extable">
         <caption>MixUp of the two targets, $\\lambda=0.7$.</caption>
         <thead><tr><th>class</th><th class="num">$x_1$ label</th><th class="num">$x_2$ guess</th><th class="num">$0.7\\,x_1+0.3\\,x_2$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">1</td><td class="num">1.000</td><td class="num">0.658</td><td class="num">0.897</td></tr>
           <tr><td class="row-h">2</td><td class="num">0.000</td><td class="num">0.237</td><td class="num">0.071</td></tr>
           <tr><td class="row-h">3</td><td class="num">0.000</td><td class="num">0.105</td><td class="num">0.032</td></tr>
         </tbody>
       </table>
       <p>The network is trained on that mixture target $[0.897,\\,0.071,\\,0.032]$, never on either label at full strength.</p>`,
    application:
      `<p>MixMatch and its successors are how you train an image classifier when labels are scarce but raw images are cheap — exactly the situation in medical imaging (a radiologist's time is the bottleneck), industrial defect detection, satellite imagery, and content moderation. On CIFAR-10 the paper reached strong accuracy with only 250 labels by leaning on tens of thousands of unlabeled images.</p>
       <p>The same recipe underpins the modern semi-supervised toolbox (MixMatch, ReMixMatch, FixMatch) that production teams reach for before paying to label more data.</p>`,
    whenToUse:
      `<p><b>Reach for MixMatch-style semi-supervised learning when you have a small labeled set and a large unlabeled set from the same distribution</b>, and labeling more is expensive. It shines on image classification where cheap augmentations (crops, flips) are meaningful and the classes are balanced enough that confident guesses are usually right.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Plain supervised training on the few labels</b> — when the unlabeled pile is large and on-distribution, MixMatch typically beats labels-only by a wide margin at the same label budget.</li>
         <li><b>Self-training / pseudo-labeling alone</b> [unl-pseudo-label] — MixMatch's averaging, sharpening, and MixUp make the guessed labels steadier and curb confirmation bias, so it is usually more robust than raw pseudo-labeling.</li>
         <li><b>FixMatch</b> [unl-fixmatch] — pick FixMatch when you want a simpler pipeline (weak/strong augmentation + a confidence threshold, no MixUp); pick MixMatch when its soft-target blending helps on your data.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>The unlabeled data is off-distribution (different classes or domain) — guessed labels will be wrong and pollute training.</li>
         <li>Augmentations are not label-preserving for your task — sharpening a guess built from bad augmentations amplifies the error.</li>
         <li>You actually have enough labels — plain supervised training is simpler and may match it.</li>
       </ul>
       <p><b>Which library:</b> there is no one-call sklearn equivalent; the method is implemented in PyTorch (the original code, plus reimplementations in libraries like <code>TorchSSL</code>).</p>`,
    pitfalls:
      `<ul>
         <li><b>Ramping the unlabeled weight $\\lambda_U$ too fast.</b> Early in training the guessed labels are nonsense, so a large $\\lambda_U$ teaches the model garbage. Ramp $\\lambda_U$ up from 0 over many steps so the network first learns from real labels, then gradually trusts its guesses.</li>
         <li><b>Sharpening temperature too low.</b> A tiny $T$ collapses every guess to a near one-hot. When the guessed winner is wrong, the model is now trained hard on a confident mistake (confirmation bias). Keep $T$ moderate (the paper uses $T=0.5$); never push it to 0.</li>
         <li><b>Wrong MixUp Beta parameter $\\alpha$.</b> Too large an $\\alpha$ makes $\\lambda$ cluster near 0.5, so every example is a 50/50 mush and the targets get muddy. Too small and MixUp barely mixes. Tune $\\alpha$ (commonly around 0.75) and remember MixMatch takes $\\max(\\lambda,1-\\lambda)$ so the first image stays dominant.</li>
         <li><b>Heavy compute from $K$ augmentations.</b> Every unlabeled image is forward-passed $K$ times just to guess its label, on top of the supervised pass. With large $K$ and big unlabeled batches this multiplies the per-step cost; budget the GPU time and keep $K$ small ($K=2$).</li>
         <li><b>Distribution mismatch between labeled and unlabeled sets.</b> If the unlabeled pool contains classes the labeled set never shows, guessed labels are systematically wrong. Filter the unlabeled pool to the same label space, or move to ReMixMatch's distribution alignment.</li>
         <li><b>Batch-norm statistics leaking across the two streams.</b> Running labeled and unlabeled batches through shared batch normalization can skew the running statistics. Many implementations process them carefully (or use separate statistics) to avoid this.</li>
       </ul>`,
    practice: [
      {
        q: `Sharpen the guess $p=[0.6,\\,0.4]$ with temperature $T=0.5$. What do you get?`,
        steps: [
          { do: `Find the power: $1/T = 1/0.5 = 2$.`, why: `Sharpening raises each probability to the power $1/T$.` },
          { do: `Raise each entry to the power 2: $0.6^2 = 0.36$, $0.4^2 = 0.16$.`, why: `Bigger probabilities grow faster than small ones, which makes the distribution peakier.` },
          { do: `Renormalize: divide each by the sum $0.36 + 0.16 = 0.52$.`, why: `A probability distribution must still sum to 1 after sharpening.` }
        ],
        answer: `<p>$0.36/0.52 \\approx 0.692$ and $0.16/0.52 \\approx 0.308$, so $\\text{Sharpen}(p,0.5) \\approx [0.692,\\,0.308]$. The top class rose from 0.60 to 0.69 — more confident, but not collapsed to a hard 1.0, which is the point of using $T=0.5$ rather than $T\\to 0$.</p>`
      },
      {
        q: `Why does MixMatch average $K$ augmented predictions <i>before</i> sharpening, instead of sharpening a single prediction?`,
        steps: [
          { do: `Recall each augmentation produces a slightly different, noisy distribution.`, why: `A random crop or flip perturbs the prediction a little each time.` },
          { do: `Recall that averaging several noisy estimates reduces their variance.`, why: `The random fluctuations partly cancel, leaving a steadier estimate.` },
          { do: `Note that sharpening commits confidently to whatever it is given.`, why: `If you sharpen a noisy single guess, you commit hard to that noise.` }
        ],
        answer: `<p>Averaging the $K$ distributions cancels much of the per-augmentation noise, so $\\bar{p}$ is a more reliable guess than any single view. Sharpening then commits confidently to a <i>cleaner</i> target, which is more likely correct. Sharpening one noisy prediction would instead lock the model onto whatever random error that single augmentation produced.</p>`
      },
      {
        q: `A teammate sets the unlabeled-loss weight $\\lambda_U$ to its full value from step 1 of training. What goes wrong, and what is the fix?`,
        steps: [
          { do: `Ask what the guessed labels look like at step 1.`, why: `At the start the network is barely trained, so its predicted distributions are nearly random.` },
          { do: `Trace what a large $\\lambda_U$ does to those guesses.`, why: `$\\lambda_U$ scales how strongly the consistency loss pulls predictions toward the guessed labels.` }
        ],
        answer: `<p>At step 1 the guesses are essentially random, so a full-strength $\\mathcal{L}_U$ trains the model hard to match noise — it learns garbage and may never recover. The fix is to <b>ramp $\\lambda_U$ up from 0</b> over many training steps, so the model first learns from the real labeled data and only gradually starts trusting its own (now better) guesses.</p>`
      }
    ]
  });

  /* === ReMixMatch follow-up is woven into the teaching text below === */
  window.LESSONS[window.LESSONS.length - 1].buildup +=
    `<p><b>ReMixMatch</b> (Berthelot et al., 2020) refines this recipe with two additions. <b>Distribution alignment</b> nudges the average of the model's guessed labels to match the (known or estimated) class distribution of the labeled data, which stops the model from drifting toward predicting a few easy classes. <b>Augmentation anchoring</b> replaces the average-of-$K$ guess with a target computed from one <i>weakly</i> augmented view, then trains several <i>strongly</i> augmented views to match that single anchor — a cleaner, more aggressive form of consistency that directly inspired FixMatch [unl-fixmatch].</p>`;

  window.CODE["unl-mixmatch"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The full MixMatch step for one mini-batch: guess labels by averaging <code>K</code> augmentations
      and sharpening, MixUp the labeled and pseudo-labeled batches, then the combined
      cross-entropy + mean-squared-error loss. This is faithful PyTorch (it needs a GPU and a real
      model/augmenter), not pseudocode.</p>`,
    code: `import torch
import torch.nn.functional as F

def sharpen(p, T):
    # p: (B, C) averaged guessed distribution ; raise to 1/T and renormalize
    pt = p ** (1.0 / T)
    return pt / pt.sum(dim=1, keepdim=True)

def mixup(x1, p1, x2, p2, alpha):
    # convex blend of inputs and of their (soft) labels; keep first sample dominant
    lam = torch.distributions.Beta(alpha, alpha).sample().to(x1.device)
    lam = torch.max(lam, 1.0 - lam)
    x = lam * x1 + (1.0 - lam) * x2
    p = lam * p1 + (1.0 - lam) * p2
    return x, p

def mixmatch_step(model, augment, x_l, y_l, x_u,
                  K=2, T=0.5, alpha=0.75, lambda_u=75.0, num_classes=10):
    # x_l: labeled images ; y_l: int labels ; x_u: unlabeled images
    model.train()
    y_l_onehot = F.one_hot(y_l, num_classes).float()

    # --- step 1+2: guess a label by averaging K augmentations, then sharpen ---
    with torch.no_grad():
        u_aug = [augment(x_u) for _ in range(K)]           # K random augmentations
        logits = [model(u) for u in u_aug]
        avg = sum(F.softmax(l, dim=1) for l in logits) / K  # average distribution
        q = sharpen(avg, T)                                 # sharpened guessed label
        q = q.detach()

    # build the two streams: labeled (real one-hot) + unlabeled views (guessed q)
    xb_l, pb_l = x_l, y_l_onehot
    xb_u = torch.cat(u_aug, dim=0)
    pb_u = torch.cat([q for _ in range(K)], dim=0)

    # --- step 3: MixUp everything against a shuffled copy of the pooled batch ---
    all_x = torch.cat([xb_l, xb_u], dim=0)
    all_p = torch.cat([pb_l, pb_u], dim=0)
    perm = torch.randperm(all_x.size(0), device=all_x.device)
    mx, mp = mixup(all_x, all_p, all_x[perm], all_p[perm], alpha)

    n_l = xb_l.size(0)
    mx_l, mp_l = mx[:n_l], mp[:n_l]      # mixed examples whose first source was labeled
    mx_u, mp_u = mx[n_l:], mp[n_l:]      # mixed examples whose first source was unlabeled

    # --- step 4: supervised cross-entropy + unlabeled MSE consistency ---
    logits_l = model(mx_l)
    loss_x = -(mp_l * F.log_softmax(logits_l, dim=1)).sum(dim=1).mean()  # soft cross-entropy

    probs_u = F.softmax(model(mx_u), dim=1)
    loss_u = F.mse_loss(probs_u, mp_u)                                   # consistency (MSE)

    return loss_x + lambda_u * loss_u    # backward() + optimizer.step() on this`
  };

  window.CODEVIZ["unl-mixmatch"] = {
    question: "What does sharpening do to a predicted distribution as you cool the temperature — and what does the unlabeled-data payoff look like when it works versus when it backfires?",
    charts: [
      {
        type: "bars",
        title: "Healthy sharpening: a REAL ambiguous digit (true label 6) gets peakier as T drops (1, 0.5, 0.25)",
        xlabel: "class (T=1 blue, T=0.5 orange, T=0.25 purple)", ylabel: "probability",
        labels: ["1 @T1", "6 @T1", "1 @T.5", "6 @T.5", "1 @T.25", "6 @T.25"],
        values: [0.352, 0.377, 0.418, 0.480, 0.426, 0.561],
        valueLabels: ["0.352", "0.377", "0.418", "0.480", "0.426", "0.561"],
        colors: ["#4ea1ff", "#4ea1ff", "#ffb454", "#ffb454", "#c89bff", "#c89bff"],
        interpret: "<b>Real numbers.</b> Each bar is a probability; bars are grouped by temperature (blue T=1, orange T=0.5, purple T=0.25), showing only the two contenders, class 1 and the true class 6. At T=1 (no sharpening) it is a near-tie: 0.352 vs 0.377. As T cools, Sharpen raises each probability to the power 1/T and renormalizes, so the <b>winner (class 6) climbs</b> 0.377 → 0.480 → 0.561 while the runner-up class 1 stalls. <b>Read it as:</b> sharpening makes the guessed target more confident <i>in the direction it already leaned</i>, and here that direction is correct (6), so it helps."
      },
      {
        type: "bars",
        title: "Sharpening backfires: a WRONG winner gets locked in as T drops (illustrative)",
        xlabel: "class (T=1 blue, T=0.5 orange, T=0.25 purple)", ylabel: "probability",
        labels: ["wrong @T1", "true @T1", "wrong @T.5", "true @T.5", "wrong @T.25", "true @T.25"],
        values: [0.40, 0.36, 0.55, 0.30, 0.74, 0.18],
        valueLabels: ["0.40", "0.36", "0.55", "0.30", "0.74", "0.18"],
        colors: ["#ff7b72", "#9aa7b4", "#ff7b72", "#9aa7b4", "#ff7b72", "#9aa7b4"],
        interpret: "<b>Illustrative</b> (the danger case). Same axes, but now the model's top guess (red) is the <i>wrong</i> class and the true class (grey) is just behind. Sharpening cannot know that: it just amplifies the leader, so as T cools the wrong class is driven 0.40 → 0.55 → 0.74 toward a near one-hot while the truth is crushed. <b>Recognise it</b> when low-T training makes accuracy <i>fall</i>: you are committing hard to confident mistakes — confirmation bias. <b>Cure:</b> keep T moderate (the paper uses 0.5, never 0) and average K augmentations first so the leader is more often the true class."
      },
      {
        type: "line",
        title: "Healthy payoff: labels + unlabeled (LabelSpreading) beats labels-only at every budget (real load_digits)",
        xlabel: "number of labeled examples", ylabel: "test accuracy",
        series: [
          { name: "labels only (logistic)", color: "#9aa7b4", points: [[10, 0.469], [20, 0.766], [40, 0.864], [80, 0.907], [160, 0.927]] },
          { name: "labels + unlabeled (LabelSpreading)", color: "#7ee787", points: [[10, 0.594], [20, 0.914], [40, 0.947], [80, 0.952], [160, 0.980]] }
        ],
        interpret: "<b>Real numbers.</b> X is the number of real labels; Y is test accuracy. The grey line uses only the labels; the green line also exploits the unlabeled pool. Green sits <b>above</b> grey everywhere and the gap is widest where labels are scarcest (0.914 vs 0.766 at 20 labels), then both converge as labels become plentiful. <b>Read it as:</b> when unlabeled data is on-distribution, leaning on it buys you accuracy you would otherwise have to pay for with more labels — exactly the regime MixMatch targets."
      },
      {
        type: "line",
        title: "Off-distribution backfire: unlabeled pool hurts when its labels are wrong (illustrative)",
        xlabel: "number of labeled examples", ylabel: "test accuracy",
        series: [
          { name: "labels only (logistic)", color: "#9aa7b4", points: [[10, 0.469], [20, 0.766], [40, 0.864], [80, 0.907], [160, 0.927]] },
          { name: "labels + unlabeled (mismatched pool)", color: "#ff7b72", points: [[10, 0.40], [20, 0.62], [40, 0.74], [80, 0.84], [160, 0.90]] }
        ],
        interpret: "<b>Illustrative</b> (not the real run). When the unlabeled pool is off-distribution — extra classes, a domain shift — the guessed labels are systematically wrong, so the red curve sits <b>below</b> the grey labels-only line: the unlabeled data is actively dragging the model down. <b>Recognise it</b> by semi-supervised <i>underperforming</i> the labels-only baseline. <b>Conclude:</b> filter the unlabeled pool to the same label space (or use ReMixMatch-style distribution alignment) before trusting it; more labels eventually close the gap as the model relies less on the bad guesses."
      }
    ],
    caption: "Panels 1 and 3 are real numpy + scikit-learn numbers; panels 2 and 4 are illustrative shapes of the same mechanisms gone wrong. Together they isolate two ideas inside MixMatch — sharpening and the unlabeled-data payoff — plus their failure modes. The full MixMatch with K augmentations, MixUp, and a deep network needs a GPU.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.linear_model import LogisticRegression
from sklearn.semi_supervised import LabelSpreading

d = load_digits()                       # 1797 real 8x8 handwritten digits
X = d.data / 16.0                        # pixel intensities scaled to 0..1
y = d.target

# ---- panel 1: sharpening a real ambiguous softmax ----
clf = LogisticRegression(max_iter=2000, C=1.0).fit(X[:1500], y[:1500])
probs = clf.predict_proba(X[1500:])
ent = -(probs * np.log(probs + 1e-12)).sum(1)   # entropy of each held-out prediction
i = 1500 + int(np.argsort(ent)[-15])            # pick a high-entropy (ambiguous) digit
p = clf.predict_proba(X[i:i+1])[0]              # its predicted distribution
def sharpen(p, T):
    q = p ** (1.0 / T)
    return q / q.sum()
print("true label", y[i])
for T in [1.0, 0.5, 0.25]:
    s = sharpen(p, T)
    print("T=%.2f  class1=%.3f  class6=%.3f" % (T, s[1], s[6]))

# ---- panel 2: semi-supervised vs labels-only across label budgets ----
rng = np.random.RandomState(1)
perm = rng.permutation(len(y))
Xtr, ytr = X[perm[:1400]], y[perm[:1400]]
Xte, yte = X[perm[1400:]], y[perm[1400:]]
for nl in [10, 20, 40, 80, 160]:
    sup = LogisticRegression(max_iter=2000).fit(Xtr[:nl], ytr[:nl]).score(Xte, yte)
    yl = np.copy(ytr); yl[nl:] = -1             # mask all but first nl as unlabeled
    ls = LabelSpreading(kernel="knn", n_neighbors=7, alpha=0.2).fit(Xtr, yl)
    print("labels=%d  labels-only=%.3f  +unlabeled=%.3f" % (nl, sup, ls.score(Xte, yte)))`
  };
})();
