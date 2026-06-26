(function () {
  window.LESSONS.push({
    id: "unl-pseudo-label",
    title: "Pseudo-labeling & entropy minimization",
    tagline: "Let the model label its own unlabeled data, keep only the predictions it is sure about, and train on those.",
    module: "Semi & Self-Supervised Learning",
    prereqs: ["unl-overview", "dl-cross-entropy"],
    bigIdea:
      `<p>You have a few labeled examples and a mountain of <b>unlabeled</b> ones. <b>Pseudo-labeling</b> (also called <b>self-training</b>) is the simplest way to use that mountain.</p>
       <p>The recipe is a loop: (1) train on the labels you have, (2) run the model on the unlabeled data, (3) for the examples where the model is <b>very confident</b>, pretend its guess is the true label, (4) add those "pseudo-labeled" examples to the training set and retrain.</p>
       <p>The deep reason it can work: a good classifier should be <b>confident</b>, and the boundary between classes should sit in an <b>empty region</b> where few points live. Pushing predictions to be confident on unlabeled data is the same as pushing the boundary out of dense clusters. This is called <b>low-density separation</b>.</p>
       <p>The deep reason it can fail: the model is grading its own homework. If it labels an unlabeled point wrong but confidently, that mistake becomes a training target and the model learns to repeat it. This self-reinforcing error is <b>confirmation bias</b>, and it is the central danger of the whole method.</p>`,
    buildup:
      `<p>Start from the overview's setup [unl-overview]: a small labeled set and a large unlabeled set drawn from the same world.</p>
       <p>The model outputs a probability for each class, a vector $p = (p_1, \\dots, p_C)$ that sums to 1 (a softmax). Two numbers from that vector drive everything here.</p>
       <ul>
         <li>The <b>top probability</b> $\\max_c p_c$: how sure the model is about its best guess. We only trust a pseudo-label when this clears a threshold $\\tau$.</li>
         <li>The <b>entropy</b> $-\\sum_c p_c \\log p_c$: how spread-out the prediction is. High entropy = unsure (probability smeared across classes). Low entropy = confident (one class near 1).</li>
       </ul>
       <p>Two views of the same idea. <b>Hard pseudo-labeling</b> turns the top guess into a one-hot target and trains with cross-entropy toward it [dl-cross-entropy] — but only for examples above the threshold. <b>Entropy minimization</b> instead adds a soft penalty that simply pushes <i>every</i> unlabeled prediction to be sharper. We will see they are two faces of the same low-density-separation goal.</p>`,
    symbols: [
      { sym: "$x$", desc: "an unlabeled input (an image, a sentence, a row of features)." },
      { sym: "$p = (p_1,\\dots,p_C)$", desc: "the model's predicted probabilities over the $C$ classes for $x$. They are all $\\ge 0$ and sum to 1 (a softmax output)." },
      { sym: "$C$", desc: "the number of classes." },
      { sym: "$p_c$", desc: "the predicted probability of class $c$." },
      { sym: "$\\max_c p_c$", desc: "the largest entry of $p$: the model's confidence in its best guess." },
      { sym: "$\\hat{y}$", desc: "the pseudo-label: the class the model is most sure of, $\\hat{y} = \\arg\\max_c p_c$ (the index of the biggest probability). 'Hard' because it is a single class, not a spread." },
      { sym: "$\\tau$", desc: "the confidence threshold (Greek 'tau'), a number like 0.95. We only keep a pseudo-label when $\\max_c p_c \\gt  \\tau$." },
      { sym: "$\\mathbb{1}[\\,\\cdot\\,]$", desc: "the indicator: 1 if the condition inside is true, 0 if false. It switches an unlabeled example on or off depending on whether it cleared the threshold." },
      { sym: "$H(p)$", desc: "the entropy of the prediction, $-\\sum_c p_c \\log p_c$. It is 0 when one class has probability 1, and largest when all classes are equally likely." },
      { sym: "$\\log$", desc: "the natural logarithm. $\\log$ of a number near 1 is near 0; $\\log$ of a tiny number is a big negative." }
    ],
    formula: `$$ \\mathcal{L}_u = \\frac{1}{|U|}\\sum_{x \\in U} \\mathbb{1}\\!\\big[\\max_c p_c \\gt  \\tau\\big]\\; \\Big(\\!-\\!\\log p_{\\hat{y}}\\Big), \\qquad \\hat{y} = \\arg\\max_c p_c $$`,
    whatItDoes:
      `<p>Read the pseudo-label loss $\\mathcal{L}_u$ piece by piece. $U$ is the unlabeled set; we average over it.</p>
       <ul>
         <li>For each unlabeled $x$, the model predicts $p$. Its best guess is class $\\hat{y}$, with probability $\\max_c p_c$.</li>
         <li>The gate $\\mathbb{1}[\\max_c p_c \\gt  \\tau]$ is 1 only if that confidence beats the threshold $\\tau$. Below $\\tau$ the example contributes nothing — it is too uncertain to trust.</li>
         <li>When the gate is open, the term $-\\log p_{\\hat{y}}$ is exactly <b>cross-entropy toward the hard label $\\hat{y}$</b> [dl-cross-entropy]. It pushes $p_{\\hat{y}}$ up toward 1, making the model commit harder to its own guess.</li>
       </ul>
       <p>The full training loss is the supervised loss on real labels plus this unlabeled term: $\\mathcal{L} = \\mathcal{L}_\\text{sup} + \\lambda\\,\\mathcal{L}_u$, where $\\lambda$ weights how much we lean on pseudo-labels (often ramped up slowly so the model is decent before it starts trusting itself).</p>
       <p><b>The entropy-minimization view.</b> Instead of a hard threshold, add $\\lambda \\sum_{x \\in U} H(p)$ to the loss, with $H(p) = -\\sum_c p_c \\log p_c$. Minimizing entropy pushes every unlabeled prediction toward a single confident class. Training on a confident hard pseudo-label is essentially a thresholded, one-hot approximation of this same penalty: both say "be sure on unlabeled data," which drives the decision boundary into low-density regions.</p>`,
    derivation:
      `<p><b>Why confidence equals low-density separation.</b></p>
       <ul class="steps">
         <li>Entropy $H(p) = -\\sum_c p_c \\log p_c$ is maximized when the prediction is flat ($p_c = 1/C$ for all $c$) and minimized (equal to 0) when one class has all the mass.</li>
         <li>A point gets a flat, high-entropy prediction precisely when it sits <i>near the decision boundary</i>, where the model cannot decide. A point deep inside a cluster gets a sharp, low-entropy prediction.</li>
         <li>So minimizing average entropy over unlabeled data pushes the boundary <b>away</b> from where the points are. The boundary settles into the gaps between clusters — the low-density regions. This is the <b>low-density separation</b> assumption: real class boundaries live where data is sparse.</li>
         <li>Hard pseudo-labeling is the discrete cousin. Replacing $H(p)$ with $-\\log p_{\\hat{y}}$ for confident examples is like rounding the soft target to one-hot and only acting where the model is already sure. Both reward sharpness; the threshold $\\tau$ just refuses to act until sharpness is high enough to be (hopefully) trustworthy. $\\blacksquare$</li>
       </ul>
       <p><b>Why this assumption can be wrong.</b> Low-density separation only helps if the true boundary really does sit in a low-density gap. When two classes overlap, the densest region <i>is</i> the boundary, and confidently labeling points there bakes in errors — the seed of confirmation bias.</p>`,
    example:
      `<p>Three classes ($C = 3$), threshold $\\tau = 0.9$. The model predicts on two unlabeled images.</p>
       <ul class="steps">
         <li>Image A: $p = (0.97, 0.02, 0.01)$. Top probability $\\max_c p_c = 0.97 \\gt  0.9$, so the gate opens. Pseudo-label $\\hat{y} = 1$ (class with the 0.97). Loss term $-\\log(0.97) = 0.030$ — small, and it nudges $p_1$ even closer to 1. Entropy $H = -(0.97\\log 0.97 + 0.02\\log 0.02 + 0.01\\log 0.01) = 0.16$, low: a confident prediction.</li>
         <li>Image B: $p = (0.45, 0.40, 0.15)$. Top probability $\\max_c p_c = 0.45 \\lt  0.9$, so the gate stays shut and B is ignored this round. Its entropy $H = 0.99$ is high — the model is torn between classes 1 and 2, exactly the kind of borderline guess we must not trust yet.</li>
       </ul>
       <p>As training proceeds and the model sharpens, B's top probability may climb past $\\tau$ and it joins the training set. The threshold is a patience knob: act only on the sure ones, and let confidence grow before committing.</p>`,
    application:
      `<p>Pseudo-labeling is everywhere labels are scarce but raw data is cheap. It powered early semi-supervised image classification, and its confidence-thresholded form is the engine inside modern methods: <a onclick="App.open('unl-fixmatch')">FixMatch</a> builds its whole loss on confidence-thresholded pseudo-labels of weakly-augmented images, and <a onclick="App.open('unl-mixmatch')">MixMatch</a> combines sharpened pseudo-labels with mixup. In speech and text it bootstraps recognizers and taggers from a small seed set; in industry it routinely turns a few thousand human labels plus millions of unlabeled logs into a usable model.</p>`,
    whenToUse:
      `<p><b>Reach for pseudo-labeling when you have a small labeled set, a large pool of unlabeled data from the same distribution, and a base model already good enough to be right most of the time on the easy cases.</b> It is the cheapest semi-supervised method to add: no new architecture, just a confidence gate and a second loss term.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Labels-only training</b> — when unlabeled data is plentiful and the labeled set alone underfits. Confident pseudo-labels can extend the effective training set for free.</li>
         <li><b>Pure <a onclick="App.open('unl-consistency')">consistency regularization</a></b> — when you want an explicit, interpretable target (the hard class) rather than only matching predictions across augmentations. In practice the strongest methods (<a onclick="App.open('unl-fixmatch')">FixMatch</a>) fuse both.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>The base model is weak or poorly calibrated — its confident mistakes will dominate and confirmation bias will sink you. Get the supervised baseline strong first.</li>
         <li>The unlabeled data is from a different distribution than your labels — pseudo-labels will systematically drift.</li>
         <li>You can cheaply get more real labels — a few hundred true labels usually beat any amount of self-training.</li>
       </ul>
       <p><b>In practice:</b> ramp the unlabeled weight $\\lambda$ up over time, set a high threshold $\\tau$ (0.9–0.95), and watch the class balance of accepted pseudo-labels.</p>`,
    pitfalls:
      `<ul>
         <li><b>Confirmation bias (the big one).</b> The model trains on its own guesses, so a confident mistake becomes a target and gets reinforced. Errors compound across rounds. Fixes: a high threshold $\\tau$, strong augmentation so the model can't just memorize, weighting the unlabeled loss low early, and checking accuracy on a held-out labeled set every round — stop if it drops.</li>
         <li><b>Threshold too low.</b> A small $\\tau$ lets in uncertain, often-wrong pseudo-labels. The training set fills with noise and accuracy can collapse. Symptom: huge numbers of accepted pseudo-labels but falling validation accuracy.</li>
         <li><b>Threshold too high.</b> If $\\tau$ is near 1, almost nothing clears the gate, no unlabeled example is used, and you are back to labels-only — all risk avoided, but also all benefit.</li>
         <li><b>Class imbalance in accepted pseudo-labels.</b> The model is more confident on easy / majority classes, so those dominate the pseudo-labeled set while hard / minority classes are starved. The model then skews even further toward the easy classes. Fix: per-class thresholds or balancing the accepted set (this is exactly the gap class-adaptive methods close).</li>
         <li><b>Uncalibrated confidence.</b> The threshold trusts $\\max_c p_c$ as if it were a real probability. Modern networks are often <b>overconfident</b> — they output 0.99 while being right only 80% of the time — so a fixed $\\tau$ admits far more wrong labels than you think. Calibrate (temperature scaling) or validate the accept-accuracy before trusting the gate.</li>
       </ul>`,
    practice: [
      {
        q: `Two classes, threshold $\\tau = 0.9$. The model predicts $p = (0.93, 0.07)$ on an unlabeled image. Does it get a pseudo-label, what is it, and what is the loss term?`,
        steps: [
          { do: `Find the top probability $\\max_c p_c$ and compare it to $\\tau$.`, why: `The gate $\\mathbb{1}[\\max_c p_c > \\tau]$ decides whether this example is used at all.` },
          { do: `If the gate is open, the pseudo-label is $\\hat{y} = \\arg\\max_c p_c$ — the index of the biggest probability.`, why: `Hard pseudo-labeling commits to the single most likely class.` },
          { do: `Compute the cross-entropy term $-\\log p_{\\hat{y}}$.`, why: `That is the loss the example contributes, pushing $p_{\\hat{y}}$ toward 1.` }
        ],
        answer: `<p>$\\max_c p_c = 0.93 \\gt  0.9$, so the gate opens. The pseudo-label is $\\hat{y} = 1$ (class 1, the 0.93). The loss term is $-\\log(0.93) = 0.073$. It is small and positive, nudging the model to be even surer of class 1 on this image.</p>`
      },
      {
        q: `Explain, in plain words, why pushing predictions on unlabeled data to be confident (low entropy) tends to move the decision boundary into a low-density region — and when this backfires.`,
        steps: [
          { do: `Recall what high vs low entropy means about where a point sits.`, why: `High-entropy points are near the boundary (model is torn); low-entropy points are deep inside a cluster.` },
          { do: `Ask what minimizing entropy over all unlabeled points does to the boundary.`, why: `Forcing confidence on every point repels the boundary from where points actually are.` },
          { do: `Consider the case where two classes genuinely overlap.`, why: `If the densest region is the true boundary, demanding confidence there is forcing wrong, overconfident calls.` }
        ],
        answer: `<p>A point near the boundary gets a torn, high-entropy prediction; a point inside a cluster gets a confident, low-entropy one. Minimizing entropy demands confidence everywhere, which pushes the boundary out of the dense clusters and into the empty gaps between them — the low-density-separation idea. It backfires when classes truly overlap: then the densest area <i>is</i> the boundary, and forcing confident labels there bakes in errors. Those confident mistakes become training targets, which is the start of confirmation bias.</p>`
      }
    ]
  });

  window.CODE["unl-pseudo-label"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>One pseudo-labeling training step. We forward the unlabeled batch, take a softmax, keep only the examples whose top probability beats the threshold $\\tau$, build a hard (argmax) target for those, and add their cross-entropy to the ordinary supervised loss. This confidence-gated pseudo-label loss is the exact core that <a onclick="App.open('unl-fixmatch')">FixMatch</a> later wraps with weak/strong augmentation.</p>`,
    code: `import torch
import torch.nn.functional as F

def pseudo_label_step(model, x_labeled, y_labeled, x_unlabeled,
                      optimizer, tau=0.95, lambda_u=1.0):
    """One semi-supervised step: supervised loss + confidence-gated pseudo-label loss."""
    model.train()

    # ---- supervised term on the real labels ----
    logits_l = model(x_labeled)                       # (B_l, C)
    loss_sup = F.cross_entropy(logits_l, y_labeled)

    # ---- pseudo-label term on the unlabeled batch ----
    with torch.no_grad():                             # don't backprop through target creation
        logits_u = model(x_unlabeled)                 # (B_u, C)
        probs_u = F.softmax(logits_u, dim=1)          # predicted class probabilities p
        max_p, y_hat = probs_u.max(dim=1)             # top prob max_c p_c and argmax y_hat
        mask = (max_p > tau).float()                  # 1[max_c p_c > tau] : keep confident ones

    # forward AGAIN with grad so the pseudo-label loss can train the model
    logits_u_grad = model(x_unlabeled)                # (B_u, C)
    # per-example cross-entropy to the HARD pseudo-label y_hat, then gate by the mask
    ce_u = F.cross_entropy(logits_u_grad, y_hat, reduction="none")  # -log p_{y_hat}
    loss_u = (mask * ce_u).sum() / (mask.sum() + 1e-8)             # average over kept examples

    loss = loss_sup + lambda_u * loss_u               # total loss
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    kept = int(mask.sum().item())                     # how many unlabeled examples were trusted
    return loss.item(), loss_sup.item(), loss_u.item(), kept

# --- optional: the soft entropy-minimization alternative to the hard gate ---
def entropy_min_loss(logits_unlabeled):
    """-sum_c p_c log p_c, averaged: pushes every prediction to be confident (low entropy)."""
    p = F.softmax(logits_unlabeled, dim=1)
    log_p = F.log_softmax(logits_unlabeled, dim=1)    # numerically stable log p
    return -(p * log_p).sum(dim=1).mean()             # mean entropy over the batch`
  };

  window.CODEVIZ["unl-pseudo-label"] = {
    question: "How do you READ a pseudo-labeling diagnostic? The accuracy-vs-threshold curve and the class-balance bars tell you whether the confidence gate is helping or quietly feeding the model its own mistakes.",
    charts: [
      {
        type: "line",
        title: "Ideal: accuracy vs threshold has a sweet spot then collapses (load_digits, 40 labels, mean of 8 splits)",
        xlabel: "confidence threshold tau",
        ylabel: "test accuracy",
        series: [
          { name: "self-training", color: "#4ea1ff", points: [[0.40, 0.877], [0.50, 0.869], [0.60, 0.843], [0.70, 0.792], [0.80, 0.652], [0.90, 0.839], [0.95, 0.839], [0.99, 0.839]] },
          { name: "labels-only baseline", color: "#9aa7b4", points: [[0.40, 0.839], [0.99, 0.839]] }
        ],
        interpret: "<b>Read it left to right.</b> X is the confidence gate tau; Y is held-out test accuracy; grey is the labels-only baseline (no pseudo-labels). The blue curve rises <i>above</i> grey at low tau (0.40-0.50, the sweet spot: many mostly-correct pseudo-labels), then <b>dips below</b> grey in the 0.70-0.80 band (the accepted set has become a biased, noisier subset — confirmation bias), then snaps back onto grey at 0.90+ (almost nothing clears the gate, so you are back to labels-only). <b>Conclusion:</b> the best tau is where blue sits highest above grey; a curve that dips under grey is the warning sign that the gate is admitting confident mistakes."
      },
      {
        type: "line",
        title: "Variant - threshold too low: pseudo-labels are noise, accuracy falls below baseline everywhere (illustrative)",
        xlabel: "confidence threshold tau",
        ylabel: "test accuracy",
        series: [
          { name: "self-training", color: "#ff7b72", points: [[0.40, 0.61], [0.50, 0.66], [0.60, 0.72], [0.70, 0.78], [0.80, 0.82], [0.90, 0.838], [0.95, 0.839], [0.99, 0.839]] },
          { name: "labels-only baseline", color: "#9aa7b4", points: [[0.40, 0.839], [0.99, 0.839]] }
        ],
        interpret: "<b>Illustrative shape</b> for a weak or poorly-calibrated base model. Here the red curve stays <i>under</i> the grey baseline at every low-to-mid tau and only recovers as tau approaches 1 (where the gate stops admitting anything). The lesson: when the whole curve lives below baseline, pseudo-labeling is actively hurting — every accepted label is more likely noise than signal. <b>Conclusion:</b> raise tau or fix the supervised baseline first; here self-training never beats just using the 40 real labels."
      },
      {
        type: "bars",
        title: "Variant - class imbalance in accepted pseudo-labels (illustrative, 10 digit classes)",
        labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        values: [210, 230, 60, 45, 195, 30, 205, 25, 40, 35],
        colors: ["#7ee787", "#7ee787", "#ffb454", "#ffb454", "#7ee787", "#ff7b72", "#7ee787", "#ff7b72", "#ffb454", "#ff7b72"],
        interpret: "<b>Illustrative bar chart</b> of how many pseudo-labels were accepted for each digit class. Each bar is one class; tall green bars are easy classes the model is confident on, short red bars are hard classes that rarely clear the gate. A <b>healthy</b> accepted set would have bars of roughly equal height; this lopsided shape means the model feeds itself mostly easy classes and starves the hard ones, so it skews even further toward what it already knows. <b>Conclusion:</b> if your accepted-label counts look like this, the headline accuracy hides a per-class collapse — fix with per-class thresholds or class balancing."
      }
    ],
    caption: "How to read pseudo-labeling diagnostics: the threshold curve (ideal sweet-spot vs all-noise) plus the per-class acceptance bars. Real FixMatch/MixMatch need a GPU; the main curve is a faithful small-scale sklearn proxy.",
    code: `import warnings; warnings.filterwarnings("ignore")
import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.semi_supervised import SelfTrainingClassifier

digits = load_digits()                       # 1797 real 8x8 handwritten digits
X, y = digits.data / 16.0, digits.target     # pixels scaled to 0..1
thresholds = [0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.95, 0.99]
make = lambda: LogisticRegression(max_iter=200)   # calibrated-ish softmax base

acc = np.zeros(len(thresholds)); base = []
for seed in range(8):                        # average over 8 stratified splits
    Xtr, Xte, ytr, yte = train_test_split(
        X, y, test_size=0.30, random_state=seed, stratify=y)
    rng = np.random.RandomState(seed)
    y_mixed = np.full(ytr.shape, -1)         # -1 marks "unlabeled" for sklearn
    for c in range(10):                      # keep only 4 real labels per class = 40
        ci = np.where(ytr == c)[0]; rng.shuffle(ci); y_mixed[ci[:4]] = c

    m = y_mixed != -1                        # labels-only baseline
    base.append(make().fit(Xtr[m], y_mixed[m]).score(Xte, yte))

    for j, tau in enumerate(thresholds):     # self-train at each confidence threshold
        st = SelfTrainingClassifier(make(), threshold=tau, max_iter=10)
        st.fit(Xtr, y_mixed)                 # iteratively pseudo-labels the unlabeled pool
        acc[j] += st.score(Xte, yte)
acc /= 8

print("baseline:", round(float(np.mean(base)), 3))
for tau, a in zip(thresholds, acc):          # the exact plotted numbers
    print(f"tau={tau:.2f} acc={a:.3f}")`
  };
})();
