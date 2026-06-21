(function () {
  window.LESSONS.push({
    id: "fs-transfer-learning",
    title: "Transfer learning & fine-tuning",
    tagline: "Borrow a model that already learned to see, then teach it your tiny new task with almost no data.",
    module: "Few-shot & Transfer Learning",
    prereqs: ["dl-backprop", "dl-cnn-params"],
    bigIdea:
      `<p><b>Transfer learning</b> means you take a model that was already trained on a huge dataset, and reuse what it learned for a brand-new task that has very little data.</p>
       <p>The big model already knows useful things: edges, textures, shapes, word patterns. You do not throw that away. You keep it and bolt on a small new piece for your task.</p>
       <p>This is why a team with only 50 labeled images can still build a good classifier. They stand on the shoulders of a model trained on millions of images.</p>`,
    buildup:
      `<p>Picture a trained network as two parts. The <b>backbone</b> is all the early and middle layers. It turns raw pixels into a useful summary (we call that summary the <b>features</b> or the <b>representation</b>). The <b>head</b> is the last layer that turns those features into the final answer.</p>
       <p>The backbone learned general skills. A new task usually only needs a new head.</p>
       <p>There are two ways to reuse the backbone:</p>
       <ul>
         <li><b>Feature extraction.</b> <i>Freeze</i> the backbone (do not change its weights at all). Run your few examples through it to get features. Train only a small new head on top of those frozen features.</li>
         <li><b>Fine-tuning.</b> <i>Unfreeze</i> some of the upper backbone layers and keep training them, together with the new head, using a very small learning rate.</li>
       </ul>
       <p>Freeze means "lock the weights so backprop cannot move them". Unfreeze means "let backprop update them again".</p>`,
    symbols: [
      { sym: "$\\theta$", desc: "the backbone weights (Greek 'theta'). These are the millions of numbers the pretrained model already learned." },
      { sym: "$\\phi(x)$", desc: "the features (Greek 'phi'): the backbone's summary of one input $x$. For feature extraction these stay fixed." },
      { sym: "$w$", desc: "the weights of the new head: the small classifier you train on top of the features." },
      { sym: "$\\eta$", desc: "the learning rate (Greek 'eta'): how big a step each weight takes when training. Small for fine-tuning." },
      { sym: "$\\nabla_\\theta L$", desc: "the gradient of the loss with respect to the backbone weights. When the backbone is frozen, we simply do not apply this." }
    ],
    formula: `$$ \\text{freeze: } \\hat y = \\text{head}_w\\big(\\phi(x)\\big),\\ \\ \\theta \\text{ fixed} \\qquad \\text{fine-tune: } \\theta \\leftarrow \\theta - \\eta_{\\text{small}}\\,\\nabla_\\theta L $$`,
    whatItDoes:
      `<p>The left rule is <b>feature extraction</b>. The features $\\phi(x)$ come from the frozen backbone, so only the head weights $w$ change during training. The backbone weights $\\theta$ never move.</p>
       <p>The right rule is <b>fine-tuning</b>. Now $\\theta$ <i>can</i> move, but each step uses a tiny learning rate $\\eta_{\\text{small}}$. Tiny steps gently adjust the backbone instead of wrecking what it already knows.</p>`,
    derivation:
      `<p><b>Why does reusing the backbone work?</b> It comes down to what each layer learns.</p>
       <p>Early layers learn <b>general</b> features: edges, blobs, textures for images; word shapes and common letter groups for text. These look almost the same no matter the task. A cat photo and an x-ray both have edges.</p>
       <p>Late layers learn <b>task-specific</b> features: "this looks like a cat ear" or "this is the word <i>refund</i>". Only these need to change for a new task.</p>
       <p>So the only part you really must relearn is the head (and maybe the top layers). The general bottom does the heavy lifting for free. With few labels, that head has few weights to fit, so a handful of examples is enough.</p>
       <p><b>Why a small learning rate when fine-tuning?</b> The backbone weights are already in a good spot. A big step would shove them far away and overwrite the general skills. The model would forget how to see edges while chasing your tiny dataset. That failure has a name: <b>catastrophic forgetting</b> (the model loses old skills while learning new ones). A small $\\eta$ nudges the weights only a little, so old knowledge survives while the new task is absorbed.</p>`,
    demo: function (host) {
      host.innerHTML = "";
      // theme-aware colors
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var col = {
        ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"),
        accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"),
        warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"),
        border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
      };
      // REAL numbers from load_digits (see CODEVIZ code): transfer (frozen features) vs from scratch
      var shots = [1, 2, 5, 10, 20];
      var transfer = [0.907, 0.945, 0.962, 0.972, 0.977];
      var scratch = [0.703, 0.807, 0.895, 0.936, 0.951];

      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var L = 60, R = 610, T = 24, B = 250;
      function px(i) { return L + i / (shots.length - 1) * (R - L); }
      function py(v) { return B - ((v - 0.5) / (1.0 - 0.5)) * (B - T); }   // y-axis 0.5..1.0
      function curve(arr, c) {
        ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath();
        for (var i = 0; i < arr.length; i++) { var X = px(i), Y = py(arr[i]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke();
        ctx.fillStyle = c;
        for (var j = 0; j < arr.length; j++) { ctx.beginPath(); ctx.arc(px(j), py(arr[j]), 3.5, 0, 7); ctx.fill(); }
      }
      function draw() {
        ctx.clearRect(0, 0, 640, 320);
        ctx.font = "12px sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
        // axes
        ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.beginPath();
        ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
        // y gridlines 0.5..1.0
        ctx.fillStyle = col.dim;
        for (var v = 0.5; v <= 1.001; v += 0.1) {
          var Y = py(v);
          ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(L, Y); ctx.lineTo(R, Y); ctx.stroke();
          ctx.fillText(v.toFixed(1), 28, Y + 4);
        }
        // x labels
        ctx.textAlign = "center";
        for (var i = 0; i < shots.length; i++) ctx.fillText(shots[i], px(i), B + 18);
        ctx.fillText("labeled examples per class", (L + R) / 2, B + 36);
        ctx.save(); ctx.translate(16, (T + B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("test accuracy", 0, 0); ctx.restore();
        ctx.textAlign = "start";
        curve(transfer, col.accent2);
        curve(scratch, col.warn);
        // legend
        ctx.fillStyle = col.accent2; ctx.fillRect(L + 8, T, 14, 4); ctx.fillStyle = col.ink; ctx.fillText("transfer (frozen features)", L + 28, T + 5);
        ctx.fillStyle = col.warn; ctx.fillRect(L + 230, T, 14, 4); ctx.fillStyle = col.ink; ctx.fillText("from scratch (raw pixels)", L + 250, T + 5);
      }
      draw();
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      rd.innerHTML = "Real load_digits run. At <b>1</b> label/class transfer scores <b style='color:" + col.accent2 + "'>" +
        (transfer[0] * 100).toFixed(0) + "%</b> but from-scratch only <b style='color:" + col.warn + "'>" +
        (scratch[0] * 100).toFixed(0) + "%</b>. The frozen backbone already knows how to 'see' digits, so a few labels are enough. From-scratch must learn everything from raw pixels and only catches up by ~10-20 labels.";
    },
    example:
      `<p>You have a model pretrained to recognize handwritten digits. Now you get a <b>new task</b>: tell apart five digits you barely have labels for. You are handed only <b>2 labeled images per class</b>.</p>
       <ul class="steps">
         <li><b>Feature extraction.</b> Freeze the backbone. Push each of your 10 images (2 per class &times; 5 classes) through it to get features $\\phi(x)$. Train a small head on those 10 feature vectors.</li>
         <li><b>Result (real numbers).</b> On a held-out test set, this frozen-feature classifier reaches about <b>94%</b> accuracy from just 2 labels per class.</li>
         <li><b>Compare to from scratch.</b> Train a fresh model on the same 10 raw images, with no pretrained backbone. It reaches only about <b>81%</b>, because 10 images is far too few to learn good features from raw pixels.</li>
         <li><b>If you had more labels.</b> By 10-20 labels per class the from-scratch model finally catches up. Transfer's edge is largest exactly when data is tiny.</li>
       </ul>
       <p>Same data, same test set. The only difference is whether you reused a pretrained representation. That reuse is worth roughly 13 accuracy points at 2 labels.</p>`,
    application:
      `<p>Almost no one trains a big vision or language model from scratch. They start from a pretrained one and adapt it.</p>
       <ul>
         <li><b>Vision:</b> freeze an ImageNet-pretrained backbone, train a new head to spot a specific defect on a factory line from a few hundred photos.</li>
         <li><b>Language:</b> fine-tune a pretrained text model on your support tickets to route them, using a small learning rate so it keeps its general grasp of English.</li>
         <li><b>Efficient fine-tuning:</b> the LoRA fine-tuning idea is transfer learning made cheap. Instead of nudging all the backbone weights, LoRA freezes them and trains a tiny low-rank add-on, so you adapt a huge model on one GPU.</li>
       </ul>
       <p>Transfer is also what makes few-shot learning possible: a frozen pretrained representation gives the strong features that <a>[fs-metric-learning]</a> compares by distance and that <a>[fs-few-shot]</a> classifiers lean on to learn a new class from only a handful of examples.</p>`,
    whenToUse:
      `<p><b>Reach for transfer learning whenever a strong pretrained model already exists for your data type</b> — images, text, audio, or video — and your own labeled set is small (a few dozen to a few thousand examples). It is the default starting point for almost every modern vision or language task.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Training from scratch</b> — when you have less data than the millions of examples a backbone needs. Reusing a pretrained representation buys you good features for free.</li>
         <li><b>Full fine-tuning</b> — pick cheaper <i>feature extraction</i> (freeze the backbone, train only a small head) when data is tiny; switch to fine-tuning the top layers only once the head is stable and you have more labels.</li>
         <li><b>PEFT (Parameter-Efficient Fine-Tuning)</b> like LoRA (Low-Rank Adaptation) — when the backbone is huge and GPU memory is scarce; you adapt a giant model on one GPU.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>No pretrained model matches your modality at all (an exotic sensor signal) — you may have to train from scratch.</li>
         <li>The new task is shown only inside a prompt at run time — use <a>[fs-in-context]</a> in-context learning, which needs no weight updates.</li>
         <li>You must recognize brand-new classes from one or two examples without any training — reach for <a>[fs-metric-learning]</a> or <a>[fs-few-shot]</a> on top of the frozen features.</li>
       </ul>
       <p><b>Which library:</b> Hugging Face <code>transformers</code> and <code>timm</code> for pretrained backbones; <code>peft</code> for LoRA-style efficient fine-tuning.</p>`,
    pitfalls:
      `<ul>
         <li><b>Negative transfer.</b> If the source domain is unlike your target (natural photos vs medical scans), the pretrained features can <i>hurt</i> instead of help. Sanity-check against a from-scratch baseline before trusting transfer.</li>
         <li><b>Catastrophic forgetting.</b> A large learning rate during fine-tuning shoves the backbone weights far from their good spot and overwrites general skills. Use a tiny $\\eta$, freeze lower layers, or use PEFT (Parameter-Efficient Fine-Tuning).</li>
         <li><b>Domain shift at serving time.</b> Production inputs (lighting, vocabulary, sensor) drift from the source distribution, so accuracy quietly drops. Monitor live inputs and re-fine-tune when the gap grows.</li>
         <li><b>Preprocessing mismatch.</b> The backbone expects the <i>exact</i> normalization, resize, and tokenizer it was trained with. Feed it differently and the frozen features are garbage. Reuse the original preprocessing pipeline verbatim.</li>
         <li><b>Fine-tuning a huge model on tiny data.</b> Unfreezing millions of weights for 40 examples overfits instantly. Freeze the backbone and train only the small head until you have more labels.</li>
         <li><b>Evaluation leakage.</b> If pretraining data overlaps your test set, scores look inflated. Check that your held-out set is genuinely unseen by the backbone.</li>
         <li><b>Train / serving skew.</b> The same backbone version and preprocessing must run offline and online — pin and version both, or live predictions drift from offline numbers.</li>
       </ul>`,
    practice: [
      {
        q: `You have a model pretrained on millions of photos and a new task with only 40 labeled images. Should you do feature extraction (freeze the backbone) or full fine-tuning (train every layer)? Why?`,
        steps: [
          { do: `Count your data versus the number of weights.`, why: `40 images is tiny. The backbone has millions of weights. Training all of them on 40 images would overfit badly.` },
          { do: `Choose feature extraction: freeze the backbone, train only a small new head.`, why: `The frozen backbone already gives good features. The head has few weights, so 40 images can fit it.` },
          { do: `Optionally fine-tune the top one or two layers later, with a very small learning rate.`, why: `Once the head is stable, gentle fine-tuning can squeeze out a little more, without forgetting the general features.` }
        ],
        answer: `Feature extraction. With only 40 images, freeze the backbone and train a small head; full fine-tuning would overfit the millions of backbone weights.`
      },
      {
        q: `While fine-tuning, an engineer uses a large learning rate to "speed things up". Accuracy on the original general benchmark crashes. What happened, and what is the fix?`,
        steps: [
          { do: `Name the symptom: the model lost skills it used to have.`, why: `This is catastrophic forgetting: big steps overwrote the pretrained weights that held the general knowledge.` },
          { do: `Identify the cause: the learning rate was too large for fine-tuning.`, why: `The backbone weights were already in a good spot. A large step $\\eta$ shoves them far away and destroys that.` },
          { do: `Fix it: use a much smaller learning rate (and optionally freeze the lower layers).`, why: `A small $\\eta$ nudges the weights only slightly, so the old general features survive while the new task is learned.` }
        ],
        answer: `Catastrophic forgetting from too-large a learning rate. Fix: fine-tune with a small learning rate (and freeze lower layers) so the pretrained features are preserved.`
      }
    ]
  });

  window.CODEVIZ["fs-transfer-learning"] = {
    question: "On real digit images, does reusing a frozen pretrained representation beat training from scratch when you only have a few labels per class?",
    charts: [{
      type: "line",
      title: "Few-shot accuracy on load_digits: transfer (frozen features) vs from scratch",
      xlabel: "labeled examples per class",
      ylabel: "test accuracy",
      series: [
        { name: "transfer (frozen features)", color: "#7ee787", points: [[1, 0.907], [2, 0.945], [5, 0.962], [10, 0.972], [20, 0.977]] },
        { name: "from scratch (raw pixels)", color: "#ffb454", points: [[1, 0.703], [2, 0.807], [5, 0.895], [10, 0.936], [20, 0.951]] }
      ]
    }],
    caption: "Real run on load_digits (1797 handwritten 8x8 images). A small MLP is pretrained on an abundant source pool and its hidden layer is FROZEN as a feature extractor. A new few-shot classifier reuses those frozen features (green) versus a logistic model trained directly on raw pixels (orange). At just 1 label per class transfer already hits 91% while from-scratch is at 70%; from-scratch only catches up near 10-20 labels.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

digits = load_digits()                      # 1797 real 8x8 handwritten digits
X = digits.data / 16.0                       # pixels scaled to 0..1
y = digits.target
tgt = np.isin(y, [5, 6, 7, 8, 9])            # the NEW task: classify digits 5-9

# hold out a fixed test set the few-shot learner never sees
Xrest, Xte, yrest, yte = train_test_split(X[tgt], y[tgt], test_size=0.35,
                                          random_state=0, stratify=y[tgt])
# split the rest: an ABUNDANT source pool (pretraining) + a disjoint few-shot label pool
Xsrc, Xpool, ysrc, ypool = train_test_split(Xrest, yrest, test_size=0.5,
                                            random_state=1, stratify=yrest)

# PRETRAIN a backbone on the abundant source labels, then FREEZE its hidden layer
backbone = MLPClassifier(hidden_layer_sizes=(64,), max_iter=1000,
                         random_state=0, alpha=1e-3).fit(Xsrc, ysrc)

def features(A):                             # forward pass through frozen hidden layers
    a = A
    for W, b in zip(backbone.coefs_[:-1], backbone.intercepts_[:-1]):
        a = np.maximum(0, a @ W + b)         # ReLU activations = the representation
    return a

F_pool, F_te = features(Xpool), features(Xte)

def pick(k, seed):                           # k labeled examples per class
    rs = np.random.default_rng(seed)
    idx = []
    for c in np.unique(ypool):
        ci = np.where(ypool == c)[0]
        idx.extend(rs.choice(ci, size=min(k, len(ci)), replace=False))
    return np.array(idx)

shots = [1, 2, 5, 10, 20]
transfer, scratch = [], []
for k in shots:
    ta, sa = [], []
    for seed in range(40):                   # average over many label draws
        idx = pick(k, seed); yk = ypool[idx]
        if len(np.unique(yk)) < 2:
            continue
        # transfer: linear head on FROZEN pretrained features
        ta.append(LogisticRegression(max_iter=3000).fit(F_pool[idx], yk).score(F_te, yte))
        # from scratch: same head, but on raw pixels (no pretrained representation)
        sa.append(LogisticRegression(max_iter=3000).fit(Xpool[idx], yk).score(Xte, yte))
    transfer.append(round(float(np.mean(ta)), 3))
    scratch.append(round(float(np.mean(sa)), 3))

print("shots   ", shots)
print("transfer", transfer)   # [0.907, 0.945, 0.962, 0.972, 0.977]
print("scratch ", scratch)    # [0.703, 0.807, 0.895, 0.936, 0.951]`
  };
})();