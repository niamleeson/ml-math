(function () {
  window.LESSONS.push({
    id: "unl-consistency",
    title: "Consistency regularization",
    tagline: "A good model should not change its mind when you nudge the input. Make that a training signal and unlabeled data starts teaching.",
    module: "Learning from Unlabeled Data (semi- & self-supervised)",
    prereqs: ["unl-overview", "dl-data-augmentation", "dl-cross-entropy", "dl-backprop"],
    bigIdea:
      `<p><b>Consistency regularization</b> is the backbone of modern semi-supervised learning (learning from a few labels plus a flood of unlabeled data).</p>
       <p>The whole idea fits in one sentence: a model's prediction should be <b>invariant</b> to small perturbations of the input or of the model itself. "Invariant" means it should stay the same.</p>
       <p>Rotate a photo a little, add a touch of noise, drop a few neurons — a cat is still a cat. So the model's two predictions should agree. We do not need the label to know that. We just need the same image, perturbed two ways.</p>
       <p>That gives us a free training signal on <i>unlabeled</i> data: predict twice, punish the disagreement.</p>`,
    buildup:
      `<p>You already met data augmentation [dl-data-augmentation]: make extra training copies by rotating, cropping, or jittering images, so the model sees more variety.</p>
       <p>Consistency regularization reuses that exact machinery, but for a new purpose. Instead of attaching the <i>known</i> label to each augmented copy, it asks: do two augmented copies of the <i>same</i> (possibly unlabeled) image get the same prediction?</p>
       <p>We build a family of methods on this one idea. Each is a small variation on "predict twice, agree":</p>
       <ul>
         <li><b>&Pi;-model</b> ("Pi-model"): run the same image through the network <b>twice</b> in the same step (different augmentation and dropout each time), and push the two outputs together.</li>
         <li><b>Temporal Ensembling</b>: instead of a second live pass, compare today's prediction to a running average of the network's <i>past</i> predictions for that image.</li>
         <li><b>Mean Teacher</b>: keep a second copy of the network whose weights are a slow running average (the "teacher"); the live "student" is trained to match the teacher.</li>
         <li><b>UDA (Unsupervised Data Augmentation)</b>: make one view <b>weakly</b> augmented and one <b>strongly</b> augmented, and force the strong view's prediction toward the weak view's.</li>
         <li><b>VAT (Virtual Adversarial Training)</b>: instead of a random nudge, find the <i>worst</i> tiny nudge and demand consistency even there.</li>
       </ul>
       <p>These set up the next two lessons, which combine consistency with pseudo-labeling: [unl-mixmatch] and [unl-fixmatch].</p>`,
    symbols: [
      { sym: "$x$", desc: "one input example (e.g. an image). It may be labeled or unlabeled; consistency works on both." },
      { sym: "$f(x)$", desc: "the model's predicted distribution over classes for input $x$ — a vector of probabilities that sum to 1." },
      { sym: "$\\delta$", desc: "a small perturbation (Greek 'delta') added to the input: a bit of noise, a small shift, or an augmentation." },
      { sym: "$f(x+\\delta)$", desc: "the prediction for the perturbed input. We want it to match $f(x)$." },
      { sym: "$\\lVert\\cdot\\rVert^2$", desc: "the squared length of a vector. Here it measures how far apart the two predictions are; 0 means they agree exactly." },
      { sym: "$\\mathbb{E}$", desc: "the expectation (average) — here, averaged over the data and over the random perturbations $\\delta$." },
      { sym: "$\\mathcal{L}_{\\text{cons}}$", desc: "the consistency loss: the average disagreement between the two predictions. Training drives it down." },
      { sym: "$\\theta_t$", desc: "the student's weights at training step $t$ — the live network we update with backprop [dl-backprop]." },
      { sym: "$\\theta'_t$", desc: "the teacher's weights at step $t$ — a slow running average of the student's weights." },
      { sym: "$\\alpha$", desc: "the EMA (Exponential Moving Average) decay, a number near 1 (e.g. 0.99): how much of the old teacher we keep each step." }
    ],
    formula: `$$ \\mathcal{L}_{\\text{cons}} = \\mathbb{E}\\,\\big\\lVert f(x+\\delta) - f(x) \\big\\rVert^2 \\qquad\\quad \\theta'_t = \\alpha\\,\\theta'_{t-1} + (1-\\alpha)\\,\\theta_t $$`,
    whatItDoes:
      `<p><b>Left equation — the consistency loss.</b> Take an input $x$. Make a perturbed version $x+\\delta$. Predict both. The loss is the squared distance between the two predicted distributions, averaged over data and over the random perturbation. When the model agrees with itself, the distance is 0 and there is no loss. When it flip-flops, the loss is large and backprop pushes the predictions together. No label is needed anywhere in this term.</p>
       <p>The squared distance $\\lVert\\cdot\\rVert^2$ is the common choice (it is the MSE, Mean Squared Error, between the two probability vectors). An alternative is the KL (Kullback-Leibler) divergence between the two predicted distributions, which measures the same "how different are these two probability vectors" but in information units; UDA and VAT use the KL form.</p>
       <p><b>Right equation — the EMA teacher update.</b> The teacher's new weights are a blend: keep a fraction $\\alpha$ (say 99%) of the old teacher and mix in a sliver $(1-\\alpha)$ of the current student. The teacher therefore moves slowly and smoothly, like a heavy ball trailing the student. Because it averages over many recent student states, its predictions are steadier and a little more accurate — a better target to be consistent with than the jittery student itself.</p>`,
    derivation:
      `<p><b>Why consistency works — the manifold (cluster) assumption.</b></p>
       <ul class="steps">
         <li>Real data does not fill all of input space. Images of digits live on a thin, curved sheet (a "manifold") inside the huge space of all pixel grids.</li>
         <li>A small, label-preserving perturbation ($\\delta$) moves $x$ a tiny step <i>along</i> that sheet — still a valid image of the same class.</li>
         <li>The classes are assumed to be separated by gaps where data is sparse (the cluster assumption). So the decision boundary should sit in those empty gaps, not cut through a dense blob of one class.</li>
         <li>Demanding $f(x+\\delta) \\approx f(x)$ for many unlabeled points forces the model to be <b>flat</b> across each dense region. A boundary slicing through a cluster would make nearby points disagree, which the consistency loss punishes.</li>
         <li>So the loss pushes the boundary <i>out</i> of the dense regions and into the low-density gaps — exactly where a good boundary belongs. The handful of labels then just picks which side is which.</li>
       </ul>
       <p><b>Why an EMA teacher instead of a second live pass?</b> Self-training has a chicken-and-egg risk: if the model trains to match its own current output, errors reinforce themselves (confirmation bias). The EMA teacher breaks the loop. Averaging weights over many steps is like ensembling many past models for free; the averaged model is smoother and usually more accurate, so it gives a cleaner target. Temporal Ensembling does the same averaging on <i>predictions</i>; Mean Teacher does it on <i>weights</i>, which updates every step instead of once per epoch and scales to large datasets. $\\blacksquare$</p>`,
    example:
      `<p>One unlabeled image, 3 classes. The student sees a strongly-augmented view; the teacher sees a weakly-augmented view. Use the squared-distance (MSE) consistency loss.</p>
       <ul class="steps">
         <li>Teacher prediction (weak view): $f' = [0.7,\\ 0.2,\\ 0.1]$ — fairly confident it is class 1.</li>
         <li>Student prediction (strong view): $f = [0.5,\\ 0.3,\\ 0.2]$ — the heavy augmentation blurred it, so the student is less sure.</li>
         <li>Differences per class: $0.5-0.7=-0.2$, &nbsp; $0.3-0.2=+0.1$, &nbsp; $0.2-0.1=+0.1$.</li>
         <li>Consistency loss: $\\lVert f-f'\\rVert^2 = (-0.2)^2 + (0.1)^2 + (0.1)^2 = 0.04 + 0.01 + 0.01 = 0.06$.</li>
         <li>Backprop on this 0.06 nudges the <i>student</i> toward the teacher's $[0.7, 0.2, 0.1]$. The teacher is held fixed for the loss (stop-gradient); it only changes through the EMA update.</li>
         <li>EMA update with $\\alpha = 0.99$: each teacher weight becomes $\\theta' \\leftarrow 0.99\\,\\theta' + 0.01\\,\\theta$. If a weight had teacher value $2.00$ and student value $2.50$, the new teacher value is $0.99(2.00) + 0.01(2.50) = 1.98 + 0.025 = 2.005$ — it crept just $0.005$ toward the student.</li>
       </ul>
       <p>So the student learns to predict the teacher's steadier answer on an image nobody labeled, and the teacher inches toward the improving student. Repeat over a flood of unlabeled images and the decision boundary settles into the low-density gaps.</p>`,
    application:
      `<p>Consistency regularization is how you squeeze a few thousand labels into the accuracy of tens of thousands. It powers medical imaging (labels need a radiologist, unlabeled scans are plentiful), speech recognition, and the semi-supervised image classifiers that report near-fully-supervised accuracy on CIFAR-10 with only 250 labels.</p>
       <p>Mean Teacher's EMA-weight trick escaped its original setting and is now everywhere: it is the standard "target network" in self-supervised methods (BYOL, DINO, MoCo) and a common stabilizer in reinforcement learning. Whenever you see a slowly-updated "teacher" or "target" copy of a network, this is the idea.</p>`,
    whenToUse:
      `<p><b>Reach for consistency regularization when you have a small labeled set and a large pool of unlabeled examples from the same distribution</b>, and you can define a perturbation that preserves the label. It is the default semi-supervised tool for images, audio, and other inputs with good, cheap augmentations.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Training on labels only</b> — when unlabeled data is abundant and labels are expensive; consistency turns that free data into a real accuracy gain.</li>
         <li><b>Plain self-training / pseudo-labeling alone</b> — when you want a smoother, less brittle signal. Consistency regularizes the <i>whole</i> prediction surface, not just confident points. (The strongest methods, [unl-fixmatch], combine both.)</li>
         <li><b>Pure self-supervised pretraining</b> [unl-overview] — when your unlabeled and labeled data are the same task and you want to use the few labels <i>during</i> training, not just fine-tune afterward.</li>
       </ul>
       <p><b>Pick a different approach when:</b></p>
       <ul>
         <li>You have no good label-preserving augmentation (some tabular or graph data) — the consistency signal is then weak or misleading; try VAT, which builds its own perturbation, or a different method.</li>
         <li>The unlabeled data is from a different distribution than the labeled data — consistency will happily enforce agreement on the wrong manifold.</li>
         <li>You already have plenty of labels — supervised training is simpler and the unlabeled signal adds little.</li>
       </ul>
       <p><b>In practice:</b> start with <b>Mean Teacher</b> or <b>UDA</b>; both are robust. Use weak augmentation for the target view and strong augmentation for the student view, ramp the unlabeled loss weight up slowly, and set the EMA decay $\\alpha$ around $0.99$&ndash;$0.999$.</p>`,
    pitfalls:
      `<ul>
         <li><b>Ramping the unlabeled weight up too fast.</b> Early in training the model is random, so its "consistency target" is noise; weighting it heavily teaches the model to agree on garbage. Start the unlabeled-loss weight near 0 and ramp it up with a smooth schedule (a sigmoid or Gaussian ramp over the first several epochs).</li>
         <li><b>A teacher that collapses.</b> Nothing in the consistency loss forbids the trivial solution "predict the same class for everything" — two identical constant outputs agree perfectly (loss 0). Keep the supervised loss on the few labels active, add entropy minimization or confidence thresholding, and never let the unlabeled term dominate.</li>
         <li><b>Augmentations too weak — no signal.</b> If $x+\\delta$ is nearly identical to $x$, the two predictions trivially match and the model learns nothing new. The perturbation must be strong enough to actually challenge the model.</li>
         <li><b>Augmentations too strong — label-destroying.</b> Crop away the digit, or rotate a 6 into a 9, and the "same label" assumption breaks; you now train the model to give the wrong answer. Keep augmentations label-preserving, and prefer the asymmetric setup (weak view as the target, strong view as the student) so the target stays trustworthy.</li>
         <li><b>Confirmation bias.</b> When the student is trained toward its own (or a too-fast teacher's) wrong predictions, the errors reinforce and amplify. A slow EMA teacher, confidence thresholds, and keeping the labeled loss in the mix all break this feedback loop.</li>
         <li><b>Forgetting the stop-gradient on the teacher.</b> The consistency loss must flow gradients into the <i>student</i> only; if you also backprop into the teacher (or the target view), the model can cheat by moving the target instead of fixing the prediction. Detach the teacher's output.</li>
       </ul>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // Show student vs EMA-teacher predicted distributions over 3 classes, and the consistency loss.
      var st = { t0: 0.7, t1: 0.2, s0: 0.5, s1: 0.3, alpha: 0.99 };
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 260; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      function bars(x0, vals, col, lbl) {
        var c = C(), bw = 38, gap = 14, base = 200, h = 150;
        for (var i = 0; i < 3; i++) {
          var bx = x0 + i * (bw + gap), bh = vals[i] * h;
          ctx.fillStyle = col; ctx.fillRect(bx, base - bh, bw, bh);
          ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
          ctx.fillText("c" + (i + 1), bx + bw / 2, base + 14);
          ctx.fillStyle = c.ink; ctx.fillText(vals[i].toFixed(2), bx + bw / 2, base - bh - 8);
        }
        ctx.fillStyle = col; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(lbl, x0 + (3 * bw + 2 * gap) / 2, 36);
      }
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, 640, 260);
        var t = [st.t0, st.t1, Math.max(0, 1 - st.t0 - st.t1)];
        var s = [st.s0, st.s1, Math.max(0, 1 - st.s0 - st.s1)];
        bars(60, t, c.accent2, "teacher f(x), weak aug");
        bars(380, s, c.accent, "student f(x+δ), strong aug");
        var loss = 0; for (var i = 0; i < 3; i++) loss += (s[i] - t[i]) * (s[i] - t[i]);
        ctx.fillStyle = loss > 0.02 ? c.warn : c.accent2; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("‖student − teacher‖² = " + loss.toFixed(3) + (loss > 0.02 ? "  (backprop pushes student → teacher)" : "  (they agree)"), 320, 236);
        ctx.textAlign = "start";
        return loss;
      }
      function slider(label, key, min, max, step) {
        var row = document.createElement("div"); row.style.margin = "6px 0";
        var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label;
        var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
        inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); render(); });
        row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
      }
      slider("teacher P(class 1)", "t0", 0, 1, 0.01);
      slider("teacher P(class 2)", "t1", 0, 1, 0.01);
      slider("student P(class 1)", "s0", 0, 1, 0.01);
      slider("student P(class 2)", "s1", 0, 1, 0.01);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function render() {
        var loss = draw();
        rd.innerHTML = "Drag the student's prediction away from the teacher's and the consistency loss grows. Training drives it back to 0 — without ever using a label. The teacher (green) is the slow EMA copy; the student (blue) is the live network.";
      }
      render();
    },
    practice: [
      {
        q: `An unlabeled image gives teacher prediction $f' = [0.6, 0.3, 0.1]$ and student prediction $f = [0.4, 0.4, 0.2]$ over 3 classes. Find the squared-distance (MSE) consistency loss.`,
        steps: [
          { do: `Subtract the two distributions class by class: $0.4-0.6$, $0.4-0.3$, $0.2-0.1$.`, why: `The consistency loss measures how far apart the two predicted probability vectors are, component by component.` },
          { do: `Square each difference and add them up.`, why: `$\\lVert f - f'\\rVert^2$ is the sum of squared differences — 0 only when the two predictions match exactly.` }
        ],
        answer: `<p>Differences: $-0.2,\\ +0.1,\\ +0.1$. Squares: $0.04,\\ 0.01,\\ 0.01$. Loss $= 0.04 + 0.01 + 0.01 = 0.06$. It is positive, so backprop nudges the student toward the teacher's $[0.6, 0.3, 0.1]$. No label was used anywhere.</p>`
      },
      {
        q: `The teacher's weight is currently $\\theta' = 3.0$ and the student's is $\\theta = 4.0$. With EMA decay $\\alpha = 0.99$, what is the teacher's weight after one update? Why is the teacher's value better than just copying the student?`,
        steps: [
          { do: `Apply $\\theta'_t = \\alpha\\,\\theta'_{t-1} + (1-\\alpha)\\,\\theta_t = 0.99(3.0) + 0.01(4.0)$.`, why: `The EMA keeps 99% of the old teacher and mixes in 1% of the current student, so the teacher moves slowly.` },
          { do: `Reason about what averaging over many steps gives you.`, why: `A running average of many recent student weights is like an ensemble of past models — smoother and usually more accurate.` }
        ],
        answer: `<p>$\\theta'_t = 0.99(3.0) + 0.01(4.0) = 2.97 + 0.04 = 3.01$. The teacher crept just $0.01$ toward the student. Because the teacher averages over many past student states, its predictions are steadier and a little more accurate than any single noisy student step — so it is a cleaner target to be consistent with, which helps avoid confirmation bias.</p>`
      },
      {
        q: `Your semi-supervised model collapses: it predicts the same class for every input, and the consistency loss is near 0. What two things went wrong, and how do you fix them?`,
        steps: [
          { do: `Notice that two identical constant outputs agree perfectly.`, why: `The consistency loss alone has a trivial minimizer — predict a constant — so it cannot be the only signal.` },
          { do: `Check the balance between the labeled loss and the unlabeled (consistency) loss.`, why: `If the unlabeled term is ramped up too fast or weighted too heavily, it overpowers the few labels that pin down the real classes.` }
        ],
        answer: `<p>(1) The consistency loss has a degenerate solution — a constant prediction has 0 disagreement — so it must be combined with the supervised loss on the few labels, plus confidence thresholding or entropy minimization. (2) The unlabeled weight was likely ramped up too fast, drowning the labeled signal. Fix it by keeping the labeled loss active and ramping the unlabeled weight up slowly with a sigmoid/Gaussian schedule, and use a slow EMA teacher so the target does not chase the collapse.</p>`
      }
    ]
  });

  window.CODE["unl-consistency"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>One <b>Mean Teacher</b> training step. The student forwards a strongly-augmented input; the EMA teacher forwards a weakly-augmented input with gradients off. The loss is supervised cross-entropy on the few labels plus a ramped MSE/KL consistency loss between student and teacher; after the student step, the teacher weights are updated by EMA. This needs a GPU and a real dataset — it is the lesson's Colab notebook, not the in-browser engine.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# ---- a toy classifier; swap in any backbone (ResNet, etc.) ----
def make_model(num_classes=10):
    return nn.Sequential(
        nn.Flatten(),
        nn.Linear(64, 128), nn.ReLU(),
        nn.Dropout(0.3),                 # dropout = a free per-pass perturbation
        nn.Linear(128, num_classes),
    )

student = make_model().cuda()
teacher = make_model().cuda()
teacher.load_state_dict(student.state_dict())     # start identical
for p in teacher.parameters():
    p.requires_grad_(False)                       # teacher is never backpropped

opt = torch.optim.Adam(student.parameters(), lr=1e-3)

EMA_DECAY = 0.99      # alpha in theta' = alpha*theta' + (1-alpha)*theta
RAMP_EPOCHS = 30      # ramp the unlabeled weight up slowly (avoid early garbage)
MAX_CONS_W = 10.0     # final weight on the consistency loss

def ema_update(student, teacher, alpha):
    with torch.no_grad():
        for ps, pt in zip(student.parameters(), teacher.parameters()):
            pt.mul_(alpha).add_(ps, alpha=1 - alpha)     # theta' = a*theta' + (1-a)*theta

def consistency_weight(epoch):
    # Gaussian ramp-up: 0 at start, MAX_CONS_W after RAMP_EPOCHS
    import math
    r = min(1.0, epoch / RAMP_EPOCHS)
    return MAX_CONS_W * math.exp(-5.0 * (1.0 - r) ** 2)

def train_step(x_lab, y_lab, x_unlab, weak_aug, strong_aug, epoch):
    # ---- supervised term on the few labels (weak aug on labeled data) ----
    logit_lab = student(weak_aug(x_lab))
    loss_sup = F.cross_entropy(logit_lab, y_lab)

    # ---- consistency term on unlabeled data ----
    # teacher sees the WEAK view; student sees the STRONG view
    with torch.no_grad():
        t_logits = teacher(weak_aug(x_unlab))
        t_prob = F.softmax(t_logits, dim=1)          # target distribution (detached)
    s_logits = student(strong_aug(x_unlab))
    s_prob = F.softmax(s_logits, dim=1)

    # MSE form of the consistency loss: E|| f(x+delta) - f(x) ||^2
    loss_cons = F.mse_loss(s_prob, t_prob)
    # (KL form used by UDA / VAT, equivalent intent:)
    # loss_cons = F.kl_div(F.log_softmax(s_logits, 1), t_prob, reduction="batchmean")

    w = consistency_weight(epoch)
    loss = loss_sup + w * loss_cons

    opt.zero_grad()
    loss.backward()
    opt.step()
    ema_update(student, teacher, EMA_DECAY)          # teacher trails the student
    return loss_sup.item(), loss_cons.item(), w`
  };

  window.CODEVIZ["unl-consistency"] = {
    question: "On real digit images with only a handful of labels, does using the UNLABELED data lift test accuracy over training on labels alone?",
    charts: [{
      type: "line", title: "Test accuracy vs label budget: labels-only vs label-spreading (uses unlabeled data)",
      xlabel: "number of labeled training digits", ylabel: "test accuracy",
      series: [
        { name: "labels only (supervised)", color: "#ff7b72", points: [[10, 0.431], [20, 0.702], [40, 0.826], [80, 0.863], [160, 0.907]] },
        { name: "with unlabeled (LabelSpreading)", color: "#7ee787", points: [[10, 0.570], [20, 0.917], [40, 0.928], [80, 0.894], [160, 0.956]] }
      ]
    }],
    caption: "Real load_digits experiment. Train on N labeled digits; the supervised model (red) uses only those N, while LabelSpreading (green) also propagates labels across the ~1250 UNLABELED training digits through a k-NN (k-Nearest Neighbors) graph. Label propagation IS consistency under the manifold assumption: it forces nearby points to agree. With just 20 labels the unlabeled data lifts accuracy from 0.70 to 0.92. This is a faithful small-scale proxy for the augmentation-consistency effect — real Mean Teacher / UDA need a GPU, augmentations, and a deep network, but the payoff (few labels + unlabeled beats labels-only) is the same.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.semi_supervised import LabelSpreading
from sklearn.metrics import accuracy_score

digits = load_digits()                       # 1797 real 8x8 handwritten digits
X = digits.data / 16.0                         # pixels scaled to 0..1
y = digits.target
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)

budgets = [10, 20, 40, 80, 160]
sup, semi = [], []
rng = np.random.RandomState(0)
for n in budgets:
    perm = rng.permutation(len(ytr))
    lab = perm[:n]                             # n labeled indices

    # baseline: supervised model on the n labels ONLY
    clf = LogisticRegression(max_iter=2000).fit(Xtr[lab], ytr[lab])
    sup.append(round(accuracy_score(yte, clf.predict(Xte)), 3))

    # semi-supervised: keep ALL train rows; mark the rest unlabeled (-1)
    yt = np.full(len(ytr), -1)
    yt[lab] = ytr[lab]
    ls = LabelSpreading(kernel="knn", n_neighbors=7, alpha=0.2).fit(Xtr, yt)
    semi.append(round(accuracy_score(yte, ls.predict(Xte)), 3))

print("budgets:", budgets)
print("labels only      :", sup)    # [0.431, 0.702, 0.826, 0.863, 0.907]
print("with unlabeled    :", semi)  # [0.570, 0.917, 0.928, 0.894, 0.956]`
  };
})();
