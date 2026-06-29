(function () {
  window.LESSONS.push({
    id: "unl-eval",
    title: "Evaluating self-supervised representations",
    tagline: "You trained an encoder on unlabeled data. How do you actually tell if its representation is any good?",
    module: "Semi & Self-Supervised Learning",
    prereqs: ["fs-transfer-learning", "ml-classification-metrics"],
    whenToUse:
      `<p><b>Reach for these protocols whenever you have an encoder trained on unlabeled data</b> — from a contrastive method like <a>[unl-simclr]</a> or <a>[unl-moco]</a>, a predictive method like <a>[unl-cpc]</a>, or a masked-prediction model — and you need a number that says "this representation is better than that one". You are <i>not</i> training a product model here; you are <b>measuring representation quality</b> so you can pick the best pretraining recipe before spending real labeling money.</p>
       <p><b>Use each protocol for what it measures:</b></p>
       <ul>
         <li><b>Linear probe</b> — when you want a clean, cheap, reproducible score that isolates the frozen encoder. It is the standard headline number for SSL (Self-Supervised Learning) papers.</li>
         <li><b>Fine-tune</b> — when you care about the best <i>downstream</i> accuracy you can squeeze out with a small label budget, and you are willing to let the encoder change.</li>
         <li><b>kNN (k-Nearest Neighbors)</b> — when you want a hyperparameter-free probe of whether the feature <i>geometry</i> already groups same-class points together.</li>
         <li><b>Label-fraction (semi-supervised) curves</b> — when the real question is label efficiency: how few labels you need to reach a target accuracy.</li>
         <li><b>Transfer</b> — when you need to know the representation generalizes beyond its pretraining dataset, to new datasets and tasks.</li>
       </ul>
       <p><b>Pick a different tool when:</b> you only care about one fixed downstream task and have plenty of labels — then just train that task end-to-end and measure it directly; representation-quality protocols are a <i>proxy</i> you reach for when labels are scarce or you must compare encoders.</p>`,
    application:
      `<p>Every modern self-supervised paper lives or dies on these numbers.</p>
       <ul>
         <li><b>Vision:</b> ImageNet <b>linear-probe top-1</b> accuracy is the headline metric for SimCLR, MoCo, BYOL, and DINO. DINO additionally reports a <b>kNN</b> classifier straight on its frozen features because it needs no training at all.</li>
         <li><b>Label efficiency:</b> papers report fine-tuning accuracy at <b>1% and 10% of ImageNet labels</b> to show the encoder needs few labels to shine.</li>
         <li><b>Transfer benchmarks:</b> a frozen encoder is scored across a suite of other datasets (VTAB for vision, GLUE-style tasks for language) to prove the features are general, not memorized.</li>
         <li><b>Speech / NLP:</b> wav2vec 2.0 and BERT-style models report downstream accuracy after fine-tuning with a small labeled set — the same label-fraction idea in another modality.</li>
       </ul>`,
    pitfalls:
      `<ul>
         <li><b>Linear probe and fine-tune can disagree.</b> A probe rewards <i>linear</i> separability of the frozen features; fine-tuning can reshape a mediocre encoder into a good one. An encoder that loses on the probe can win after fine-tuning, and vice-versa. Report <b>both</b>, and never rank encoders on a single protocol.</li>
         <li><b>Fine-tuning can wash out a bad encoder.</b> With enough labels and a large learning rate, fine-tuning drifts far from the pretrained weights — so a strong fine-tune score may reflect the <i>labels</i>, not the representation. Keep the label budget small and the learning rate gentle if you want to credit pretraining.</li>
         <li><b>Tuning the probe unfairly inflates the score.</b> Sweeping the probe's regularization (the inverse-strength $C$, weight decay) on the test set, or per-encoder, leaks information and lets a weak encoder "catch up". Fix the probe's hyperparameters on a held-out validation split, identically for every encoder.</li>
         <li><b>kNN is sensitive to feature scaling and the metric.</b> Unnormalized features let a few high-variance dimensions dominate the distance. Standardize or $L_2$-normalize features (cosine distance) before kNN, and report which $k$ you used.</li>
         <li><b>Evaluating only on the pretraining classes overstates quality.</b> If the probe's classes are exactly what the encoder was nudged toward, the score measures memorization, not general structure. Always include a <b>transfer</b> task on held-out classes or a different dataset.</li>
         <li><b>Small validation sets make label-fraction curves noisy.</b> At 1% labels you may have only a handful of examples per class, so one unlucky draw swings the number several points. <b>Average over many random label draws</b> (and seeds) and show the spread, or the curve is meaningless.</li>
         <li><b>Preprocessing mismatch silently corrupts features.</b> The frozen encoder expects the exact normalization / resize / tokenizer it was trained with. Feed it anything else and the "representation" you probe is garbage. Reuse the pretraining preprocessing verbatim.</li>
       </ul>`,
    bigIdea:
      `<p>Self-supervised training gives you an <b>encoder</b> $f$: it turns a raw input $x$ into a feature vector $z=f(x)$. There were no labels in training, so accuracy never appeared. The question remains: <b>is $z$ a good representation?</b></p>
       <p>"Good" means the features make the real downstream task <i>easy</i> — same-class inputs land near each other, classes are separable, and few labels are needed to read the answer off the features.</p>
       <p>We measure this with a small set of standard protocols. The cleanest one <b>freezes the encoder</b> and lets only a tiny classifier touch the labels. If a simple classifier on top already works, the encoder did the hard work.</p>`,
    buildup:
      `<p>Think of the encoder as a fixed map from inputs to a feature space, and the evaluation as asking how usable that space is. Four standard ways to ask:</p>
       <ul>
         <li><b>Linear probe.</b> Freeze the encoder. Extract features $z=f(x)$ for the labeled set. Train a single linear classifier (one <code>nn.Linear</code> or a logistic regression) on top. Its test accuracy is the probe score. Because the only trainable weights are linear and the features are frozen, the score reflects <i>the representation</i>, not a powerful head.</li>
         <li><b>Fine-tune.</b> Unfreeze the encoder and adapt the whole network with a small number of labels and a gentle learning rate. This measures the best downstream accuracy reachable when the encoder is allowed to change.</li>
         <li><b>kNN (k-Nearest Neighbors).</b> No training at all. To classify a test point, find its $k$ nearest labeled features and vote. This directly probes the <i>geometry</i>: are same-class points already close?</li>
         <li><b>Label-fraction (semi-supervised) curves.</b> Repeat the probe using 1%, 10%, 100% of the labels and plot accuracy against the labeled fraction. A good representation is steep on the left — high accuracy from very few labels.</li>
       </ul>
       <p>"Freeze" means lock the encoder weights so gradients cannot move them. "Probe" means a deliberately weak classifier whose job is only to <i>read out</i> what the frozen features already encode.</p>`,
    symbols: [
      { sym: "$f$", desc: "the frozen encoder learned from unlabeled data. It maps an input $x$ to a feature vector." },
      { sym: "$z = f(x)$", desc: "the feature (representation) of input $x$: a $d$-dimensional vector. For a linear probe and kNN, the encoder is frozen, so $z$ never changes during evaluation." },
      { sym: "$W, b$", desc: "the weights and bias of the linear probe — the only parameters trained in the linear-probe protocol." },
      { sym: "$y_i$", desc: "the true label of example $i$, available only for the small labeled subset." },
      { sym: "$\\mathcal{N}_k(z)$", desc: "the set of $k$ nearest labeled features to $z$ (Greek 'N' for neighborhood), under a distance such as cosine or Euclidean." },
      { sym: "$\\rho$", desc: "the labeled fraction (Greek 'rho'): the share of the training set whose labels we use, e.g. $\\rho=0.01$ for 1%." },
      { sym: "$A(\\rho)$", desc: "the label-efficiency curve: test accuracy of a protocol when trained on a fraction $\\rho$ of the labels." }
    ],
    formula: `$$ \\text{linear probe: } \\hat y(x)=\\arg\\max_c\\big(W\\,f(x)+b\\big)_c,\\ \\ f \\text{ frozen} \\qquad \\text{kNN: } \\hat y(x)=\\operatorname{mode}\\big\\{\\,y_j : z_j\\in\\mathcal{N}_k(f(x))\\,\\big\\} $$`,
    whatItDoes:
      `<p>The left rule is the <b>linear probe</b>. We compute the frozen feature $f(x)$, apply a single linear layer $W f(x)+b$, and take the highest-scoring class. Only $W$ and $b$ are trained on the labels; $f$ is locked. So whatever accuracy you get is attributable to how linearly separable the frozen features already are.</p>
       <p>The right rule is <b>kNN</b>. We embed the test point, gather its $k$ nearest labeled feature vectors $\\mathcal{N}_k$, and take the majority vote of their labels. There is <i>nothing to train</i> — the score is a pure statement about the feature geometry.</p>`,
    derivation:
      `<p><b>Why does a frozen linear probe isolate representation quality?</b></p>
       <ul class="steps">
         <li>The model's prediction is the composition $g\\circ f$: an encoder $f$ followed by a classifier head $g$.</li>
         <li>If we let $g$ be <b>anything</b> (a deep, nonlinear head) and train it freely, a powerful head could extract a good answer even from a poor $f$. The score would then measure the head, not the encoder — we would be fooled.</li>
         <li>So we cripple the head: restrict $g$ to be <b>linear</b>, $g(z)=Wz+b$. A linear map cannot manufacture new structure; it can only take a weighted combination of the dimensions $f$ already produced.</li>
         <li>And we <b>freeze</b> $f$ so gradients never reshape it. Now the only way the probe can score well is if $f$ already placed the classes into a <i>linearly separable</i> arrangement. The accuracy is therefore a property of $f$ alone. $\\blacksquare$</li>
       </ul>
       <p><b>Why the label-efficiency curve.</b> Define $A(\\rho)$ as the probe (or fine-tune) accuracy using a fraction $\\rho$ of labels. A strong representation needs few labels to separate the classes, so $A(\\rho)$ rises <b>steeply</b> at small $\\rho$ and plateaus early. A weak one (e.g. raw pixels) climbs slowly because the classifier must compensate for poor features with more data. Comparing two encoders by their whole $A(\\rho)$ curve — not one point — exposes exactly this label-efficiency gap.</p>
       <p><b>Why kNN complements the probe.</b> A linear probe asks "is there a <i>hyperplane</i> separating the classes?". kNN asks "are same-class points <i>locally</i> clustered?". They can disagree: features can be locally clustered yet globally tangled (kNN wins), or linearly separable yet not tightly clustered (probe wins). Reporting both gives a fuller picture of the geometry.</p>`,
    example:
      `<p>Two encoders, A and B, both pretrained on unlabeled images; we have very few labels. We score each one three ways. The numbers are illustrative, chosen to show how the protocols can disagree.</p>
       <table class="extable">
         <caption>Test accuracy (%) by protocol — winner of each row in bold</caption>
         <thead><tr><th>protocol</th><th class="num">encoder A</th><th class="num">encoder B</th><th>what it measures</th></tr></thead>
         <tbody>
           <tr><td class="row-h">linear probe (frozen)</td><td class="num"><b>78</b></td><td class="num">71</td><td>linear separability of frozen features</td></tr>
           <tr><td class="row-h">kNN ($k=5$, frozen)</td><td class="num"><b>74</b></td><td class="num">73</td><td>local clustering of the geometry</td></tr>
           <tr><td class="row-h">fine-tune</td><td class="num">80</td><td class="num"><b>82</b></td><td>best accuracy once the encoder can adapt</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Linear probe.</b> Freeze each encoder, extract features, train one logistic layer. A (78) beats B (71): A's frozen features are more linearly separable.</li>
         <li><b>kNN.</b> No training — vote among the 5 nearest labeled features. A (74) and B (73) are nearly tied: B's geometry is locally about as clustered as A's.</li>
         <li><b>Fine-tune.</b> Unfreeze and adapt with the same few labels. The rank flips: B (82) edges A (80). B's mediocre <i>frozen</i> features hid an encoder that adapts well once unlocked.</li>
         <li><b>Reading it.</b> Deploy frozen, pick A; plan to fine-tune, pick B. Any single protocol would have sent you the wrong way — which is why papers report several.</li>
       </ul>`,
    demo: function (host) {
      host.innerHTML = "";
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var col = {
        ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"),
        accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"),
        warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"),
        border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
      };
      // REAL numbers from the CODEVIZ run on load_digits (see CODEVIZ code below).
      var fracs = [1, 5, 10, 25, 100];        // label fraction in percent
      var probe = [0.807, 0.927, 0.934, 0.956, 0.969];
      var knn = [0.235, 0.882, 0.927, 0.954, 0.972];
      var scratch = [0.640, 0.840, 0.883, 0.922, 0.954];

      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 330; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var L = 60, R = 610, T = 24, B = 256;
      function px(i) { return L + i / (fracs.length - 1) * (R - L); }
      function py(v) { return B - ((v - 0.2) / (1.0 - 0.2)) * (B - T); }   // y-axis 0.2..1.0
      function curve(arr, c) {
        ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath();
        for (var i = 0; i < arr.length; i++) { var X = px(i), Y = py(arr[i]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke();
        ctx.fillStyle = c;
        for (var j = 0; j < arr.length; j++) { ctx.beginPath(); ctx.arc(px(j), py(arr[j]), 3.5, 0, 7); ctx.fill(); }
      }
      ctx.clearRect(0, 0, 640, 330);
      ctx.font = "12px sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
      ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      ctx.fillStyle = col.dim;
      for (var v = 0.2; v <= 1.001; v += 0.2) {
        var Y = py(v);
        ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(L, Y); ctx.lineTo(R, Y); ctx.stroke();
        ctx.fillText(v.toFixed(1), 28, Y + 4);
      }
      ctx.textAlign = "center";
      for (var i = 0; i < fracs.length; i++) ctx.fillText(fracs[i] + "%", px(i), B + 18);
      ctx.fillText("label fraction (frozen encoder = pretrained MLP features)", (L + R) / 2, B + 36);
      ctx.save(); ctx.translate(16, (T + B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("test accuracy", 0, 0); ctx.restore();
      ctx.textAlign = "start";
      curve(probe, col.accent2);
      curve(knn, col.accent);
      curve(scratch, col.warn);
      ctx.fillStyle = col.accent2; ctx.fillRect(L + 8, T, 14, 4); ctx.fillStyle = col.ink; ctx.fillText("linear probe (frozen)", L + 28, T + 5);
      ctx.fillStyle = col.accent; ctx.fillRect(L + 180, T, 14, 4); ctx.fillStyle = col.ink; ctx.fillText("kNN (frozen)", L + 200, T + 5);
      ctx.fillStyle = col.warn; ctx.fillRect(L + 320, T, 14, 4); ctx.fillStyle = col.ink; ctx.fillText("from scratch (raw pixels)", L + 340, T + 5);

      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      rd.innerHTML = "Real load_digits run. At just <b>1%</b> of labels the frozen-feature linear probe scores <b style='color:" + col.accent2 + "'>" +
        (probe[0] * 100).toFixed(0) + "%</b> while a classifier trained on raw pixels reaches only <b style='color:" + col.warn + "'>" +
        (scratch[0] * 100).toFixed(0) + "%</b> — the frozen representation is far more <b>label-efficient</b>, and its edge is largest exactly where labels are scarce. " +
        "kNN <b style='color:" + col.accent + "'>" + (knn[0] * 100).toFixed(0) +
        "%</b> collapses at 1% because there are too few labeled neighbors to vote with — a real pitfall of kNN at tiny label budgets — but it recovers fast and even leads by 100% labels.";
    },
    practice: [
      {
        q: `Encoder A beats encoder B on the linear probe, but B beats A after full fine-tuning. Which encoder is "better", and what does each result tell you?`,
        steps: [
          { do: `Recall what the linear probe measures.`, why: `It freezes the encoder and trains only a linear head, so it scores the linear separability of the frozen features. A's frozen features are more linearly separable.` },
          { do: `Recall what fine-tuning measures.`, why: `It unfreezes the encoder, so it scores the best accuracy reachable when the weights can adapt. B's encoder reshapes into something better once unlocked.` },
          { do: `Decide by deployment plan, not by one number.`, why: `If you will deploy frozen features, A is better. If you will fine-tune, B is better. Neither protocol is "the truth" alone.` }
        ],
        answer: `It depends on how you will use the encoder. A has more linearly separable frozen features (deploy A if frozen); B adapts better when fine-tuned (deploy B if fine-tuning). Report both, because they answer different questions.`
      },
      {
        q: `Your 1%-label point on the label-fraction curve jumps around by several accuracy points each time you rerun. Is the encoder unstable? What should you do?`,
        steps: [
          { do: `Diagnose the source of the noise.`, why: `At 1% labels there are only a handful of examples per class. One unlucky random draw of which examples are labeled can swing the score a lot — this is sampling noise, not encoder instability.` },
          { do: `Average over many random label draws and seeds.`, why: `Reporting the mean over (say) 30 draws plus the spread turns a noisy single number into a stable estimate of $A(\\rho)$.` },
          { do: `Use a large, fixed test set.`, why: `A small validation set adds its own noise; a big held-out set sharpens every point on the curve.` }
        ],
        answer: `It's sampling noise from tiny labeled subsets, not an unstable encoder. Average accuracy over many random label draws (and seeds), report the spread, and evaluate on a large fixed test set.`
      }
    ]
  });

  window.CODE["unl-eval"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The standard <b>linear-probe</b> protocol: freeze a pretrained encoder, extract features once, and train a single <code>nn.Linear</code> on the labels — only the linear head learns. A hyperparameter-free <b>kNN (k-Nearest Neighbors)</b> evaluation on the same frozen features is included for comparison.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# ----- a pretrained, FROZEN encoder (from SimCLR / MoCo / etc.) -----
encoder = build_pretrained_encoder()      # e.g. a ResNet trunk, returns (B, d) features
encoder.eval()
for p in encoder.parameters():            # FREEZE: no gradients flow into the encoder
    p.requires_grad_(False)

device = "cuda"
encoder.to(device)

@torch.no_grad()
def extract_features(loader):
    """Run the frozen encoder once; cache features + labels."""
    feats, labels = [], []
    for x, y in loader:
        z = encoder(x.to(device))         # (B, d) representation
        feats.append(z.cpu()); labels.append(y)
    return torch.cat(feats), torch.cat(labels)

Ztr, ytr = extract_features(train_loader)  # frozen features for the labeled set
Zte, yte = extract_features(test_loader)

# =================== 1) LINEAR PROBE ===================
num_classes = int(ytr.max()) + 1
probe = nn.Linear(Ztr.size(1), num_classes).to(device)   # the ONLY trainable weights
opt = torch.optim.SGD(probe.parameters(), lr=1e-2, momentum=0.9, weight_decay=0.0)

Ztr_d, ytr_d = Ztr.to(device), ytr.to(device)
for epoch in range(100):                  # train only the linear head on frozen features
    opt.zero_grad()
    logits = probe(Ztr_d)                  # W . z + b
    loss = F.cross_entropy(logits, ytr_d)
    loss.backward()
    opt.step()

with torch.no_grad():
    pred = probe(Zte.to(device)).argmax(1).cpu()
    linear_probe_acc = (pred == yte).float().mean().item()
print(f"linear-probe accuracy: {linear_probe_acc:.3f}")

# =================== 2) kNN EVALUATION ===================
def knn_eval(Ztr, ytr, Zte, yte, k=20, temperature=0.07):
    """Cosine-similarity weighted k-NN on FROZEN features (DINO-style)."""
    Ztr = F.normalize(Ztr, dim=1)         # L2-normalize -> cosine distance
    Zte = F.normalize(Zte, dim=1)
    C = int(ytr.max()) + 1
    correct = 0
    for i in range(Zte.size(0)):
        sims = Zte[i] @ Ztr.t()           # (Ntrain,) cosine similarities
        vals, idx = sims.topk(k)          # k nearest neighbors
        w = (vals / temperature).exp()    # closer neighbors vote stronger
        votes = torch.zeros(C)
        votes.index_add_(0, ytr[idx], w)  # weighted class votes
        correct += int(votes.argmax() == yte[i])
    return correct / Zte.size(0)

knn_acc = knn_eval(Ztr, ytr, Zte, yte, k=20)
print(f"kNN (k=20) accuracy:   {knn_acc:.3f}")

# To run a SEMI-SUPERVISED label-fraction curve, repeat the linear probe
# above on a random 1% / 10% / 100% subset of (Ztr, ytr), averaging over
# several seeds, and plot accuracy vs the labeled fraction.`
  };

  window.CODEVIZ["unl-eval"] = {
    question: "On real digit images, how do you read a label-efficiency curve to tell a good frozen representation from a useless one — and what does it look like when the probe and fine-tune disagree, or when the 1% point is just noise?",
    charts: [
      {
        type: "line",
        title: "Healthy label-efficiency: frozen probe / kNN vs from-scratch (computed)",
        xlabel: "label fraction (%)",
        ylabel: "test accuracy",
        series: [
          { name: "linear probe (frozen)", color: "#7ee787", points: [[1, 0.807], [5, 0.927], [10, 0.934], [25, 0.956], [100, 0.969]] },
          { name: "kNN (frozen)", color: "#4ea1ff", points: [[1, 0.235], [5, 0.882], [10, 0.927], [25, 0.954], [100, 0.972]] },
          { name: "from scratch (raw pixels)", color: "#ffb454", points: [[1, 0.640], [5, 0.840], [10, 0.883], [25, 0.922], [100, 0.954]] }
        ],
        interpret: "<b>The ideal, computed on load_digits.</b> X is the fraction of labels revealed (1% to 100%); Y is test accuracy. A good representation is <i>steep on the left</i>: the green frozen linear probe already hits 81% at 1% labels while the orange from-scratch baseline reaches only 64%. The vertical gap between green and orange at small X is the label-efficiency win — it is biggest where labels are scarce and shrinks toward 100%, where everyone has enough data. <b>Conclusion:</b> green sitting above orange on the left = the frozen features did real work. The blue kNN curve crashing to 24% at 1% is a separate kNN pitfall (too few labeled neighbors to vote with), not an encoder failure — it recovers by 5%."
      },
      {
        type: "line",
        title: "Useless encoder: frozen features no better than raw pixels (illustrative)",
        xlabel: "label fraction (%)",
        ylabel: "test accuracy",
        series: [
          { name: "linear probe (frozen)", color: "#ff7b72", points: [[1, 0.61], [5, 0.83], [10, 0.87], [25, 0.91], [100, 0.95]] },
          { name: "from scratch (raw pixels)", color: "#ffb454", points: [[1, 0.640], [5, 0.840], [10, 0.883], [25, 0.922], [100, 0.954]] }
        ],
        interpret: "<b>Illustrative failure mode.</b> Same axes, but the red frozen-probe curve lies on top of (or just below) the orange from-scratch baseline at every label fraction. The pretraining bought you <i>nothing</i>: a linear probe on these frozen features is no more label-efficient than training on raw pixels. <b>How to recognise it:</b> no left-side gap — the frozen curve never pulls clear of from-scratch, especially at 1-10% labels where a good encoder should shine. <b>Conclusion:</b> the representation failed; the encoder did not place classes into a linearly separable arrangement, so reconsider the pretraining recipe."
      },
      {
        type: "bars",
        title: "Probe vs fine-tune disagree: rank flips between protocols (illustrative)",
        labels: ["Encoder A", "Encoder B"],
        series: [
          { name: "linear probe (frozen)", color: "#7ee787", points: [[0, 0.78], [1, 0.71]] },
          { name: "fine-tune", color: "#c89bff", points: [[0, 0.80], [1, 0.82]] }
        ],
        interpret: "<b>Illustrative — why one number can mislead.</b> Two encoders, two protocols. On the frozen <i>linear probe</i> (green) A wins (0.78 vs 0.71): A's frozen features are more linearly separable. But after <i>fine-tuning</i> (purple) the rank flips and B wins (0.82 vs 0.80): B's mediocre frozen features hid an encoder that reshapes well once unlocked. <b>How to recognise it:</b> the taller bar switches encoders when you switch protocol. <b>Conclusion:</b> there is no single 'better' encoder — pick A if you will deploy frozen features, B if you will fine-tune, and always report both protocols."
      },
      {
        type: "line",
        title: "Noisy 1% point: too few label draws make it swing (illustrative)",
        xlabel: "label fraction (%)",
        ylabel: "probe accuracy (1 unlucky draw vs averaged)",
        series: [
          { name: "single random draw (noisy)", color: "#ff7b72", points: [[1, 0.66], [5, 0.90], [10, 0.93], [25, 0.955], [100, 0.969]] },
          { name: "averaged over many draws", color: "#7ee787", points: [[1, 0.807], [5, 0.927], [10, 0.934], [25, 0.956], [100, 0.969]] }
        ],
        interpret: "<b>Illustrative — a measurement artefact, not an encoder problem.</b> Both curves are the same frozen probe; the red one uses a single random choice of which 1% of points get labels, the green averages over many draws. At 1% there are only a handful of examples per class, so one unlucky draw drops the red point several points below the stable green estimate; by 25-100% labels the two agree. <b>How to recognise it:</b> the left end jumps around when you rerun, while the right end is steady. <b>Conclusion:</b> it is sampling noise — average over many random label draws and seeds and report the spread before trusting any low-label point."
      }
    ],
    caption: "Reproducible sklearn proxy on load_digits (1797 real 8x8 handwritten digits). A small MLP is pretrained on an abundant source pool and its hidden layer is FROZEN as the encoder — a stand-in for a self-supervised encoder. The first chart is the computed ideal (probe / kNN / from-scratch, each averaged over 15 random label draws); the rest are illustrative cases — a useless encoder, a probe-vs-fine-tune rank flip, and a noisy low-label point — that teach you how to read these curves. Each chart's interpret box explains how to read it.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

digits = load_digits()                       # 1797 real 8x8 handwritten digits
X = digits.data / 16.0                        # pixels scaled to 0..1
y = digits.target

# hold out a fixed test set both protocols are judged on
Xrest, Xte, yrest, yte = train_test_split(X, y, test_size=0.30,
                                          random_state=0, stratify=y)
# split the rest: an ABUNDANT source pool (pretraining) + a disjoint label pool
Xsrc, Xpool, ysrc, ypool = train_test_split(Xrest, yrest, test_size=0.6,
                                            random_state=1, stratify=yrest)

# PRETRAIN a small MLP on the abundant source labels, then FREEZE its hidden layer
# (stands in for a self-supervised encoder trained on unlabeled data)
bb = MLPClassifier(hidden_layer_sizes=(64,), max_iter=600,
                   random_state=0, alpha=1e-3).fit(Xsrc, ysrc)

def features(A):                             # forward pass through the FROZEN hidden layer
    a = A
    for W, b in zip(bb.coefs_[:-1], bb.intercepts_[:-1]):
        a = np.maximum(0, a @ W + b)         # ReLU activations = the representation
    return a

Fpool, Fte = features(Xpool), features(Xte)
sc = StandardScaler().fit(Fpool)             # scale features for kNN (distance is scale-sensitive)
Fpool_s, Fte_s = sc.transform(Fpool), sc.transform(Fte)

fracs = [0.01, 0.05, 0.10, 0.25, 1.00]
probe, knn, scratch = [], [], []
for f in fracs:
    pa, ka, sa = [], [], []
    for seed in range(15):                    # average over many label draws
        rs = np.random.default_rng(seed)
        idx = []                              # stratified labeled subset of fraction f
        for c in np.unique(ypool):
            ci = np.where(ypool == c)[0]
            k = max(1, int(round(f * len(ci))))
            idx.extend(rs.choice(ci, size=min(k, len(ci)), replace=False))
        idx = np.array(idx); yk = ypool[idx]
        if len(np.unique(yk)) < 2:
            continue
        # LINEAR PROBE: logistic head on FROZEN MLP features
        pa.append(LogisticRegression(max_iter=400, solver="liblinear").fit(Fpool[idx], yk).score(Fte, yte))
        # kNN on the same frozen features
        kk = min(5, len(idx))
        ka.append(KNeighborsClassifier(n_neighbors=kk).fit(Fpool_s[idx], yk).score(Fte_s, yte))
        # FROM SCRATCH: logistic on raw pixels (no frozen representation)
        sa.append(LogisticRegression(max_iter=400, solver="liblinear").fit(Xpool[idx], yk).score(Xte, yte))
    probe.append(round(float(np.mean(pa)), 3))
    knn.append(round(float(np.mean(ka)), 3))
    scratch.append(round(float(np.mean(sa)), 3))

print("fracs  ", [int(f * 100) for f in fracs])  # [1, 5, 10, 25, 100]
print("probe  ", probe)    # [0.807, 0.927, 0.934, 0.956, 0.969]
print("knn    ", knn)      # [0.235, 0.882, 0.927, 0.954, 0.972]
print("scratch", scratch)  # [0.640, 0.840, 0.883, 0.922, 0.954]`
  };
})();
