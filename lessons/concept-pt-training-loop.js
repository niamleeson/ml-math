/* =====================================================================
   PyTorch (a complete course) — the canonical TRAINING LOOP.
   Self-contained: pushes one lesson into window.LESSONS and one entry
   each into window.CODE and window.CODEVIZ.
   CODE runs in Google Colab (torch preinstalled). CODEVIZ numbers are
   real — produced by a tiny numpy logistic-regression run (see its code).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "pt-training-loop",
    title: "The PyTorch training loop",
    tagline: "The hand-written loop at the heart of every PyTorch project.",
    module: "PyTorch (a complete course)",
    prereqs: ["dl-backprop", "dl-optimizers", "dl-minibatch", "dl-cross-entropy", "dl-dropout", "dl-batchnorm", "dl-early-stopping"],

    whenToUse: `<p>Use this loop for <b>every model you train in PyTorch</b>. Unlike Keras <code>model.fit()</code>, PyTorch does not hide training behind one call. You write the loop yourself.</p>
<p>That is the point. You see every step. You can change any step. Need a custom loss schedule, two optimizers, gradient clipping, or odd logging? You just edit the loop. This template is the starting point you adapt for any task — classification, regression, vision, text.</p>`,

    application: `<p>This exact skeleton runs in real projects everywhere. A research script, a production training job, a fine-tuning run — all share the same shape: loop over epochs, loop over batches, do five steps per batch, then validate. Frameworks like PyTorch Lightning wrap this loop, but they run the same steps underneath.</p>`,

    pitfalls: `<ul>
<li><b>Forgetting <code>optimizer.zero_grad()</code>.</b> PyTorch <i>adds</i> new gradients to the old ones. Skip the reset and gradients pile up across batches, so every step is wrong. Call it before <code>loss.backward()</code> in every batch.</li>
<li><b>Forgetting <code>model.train()</code> / <code>model.eval()</code>.</b> Dropout and batch normalization behave differently in training vs evaluation. Train mode drops units and uses batch statistics; eval mode keeps all units and uses running statistics. Wrong mode = wrong numbers. Set <code>model.train()</code> before the train pass and <code>model.eval()</code> before validation.</li>
<li><b>No <code>torch.no_grad()</code> in validation.</b> Without it PyTorch builds the gradient graph you will never use, wasting memory and time. Wrap the whole validation pass in <code>with torch.no_grad():</code>.</li>
<li><b>Keeping <code>loss</code> instead of <code>loss.item()</code>.</b> The raw <code>loss</code> tensor still points at the whole computation graph. Sum those across batches and you hold every graph in memory — a slow leak. Accumulate <code>loss.item()</code> (a plain Python number) instead.</li>
<li><b>Not moving data to the device.</b> If the model is on the GPU (Graphics Processing Unit) but a batch is on the CPU (Central Processing Unit), you get a device-mismatch error. Call <code>x = x.to(device)</code> and <code>y = y.to(device)</code> each batch.</li>
<li><b>Computing accuracy with gradients on.</b> Counting correct predictions needs no gradients. Do it inside <code>torch.no_grad()</code> (or call <code>.detach()</code>) so you do not track that work.</li>
<li><b>Softmax before <code>CrossEntropyLoss</code>.</b> <code>nn.CrossEntropyLoss</code> expects raw logits and integer class labels — it applies softmax internally. Adding your own softmax double-counts it.</li>
</ul>`,

    bigIdea: `<p>Training a network is a simple cycle repeated many times: <b>guess, measure the error, find which way to nudge each weight, nudge.</b> The loop just runs that cycle over your data, again and again.</p>`,

    buildup: `<p>One pass over the whole dataset is an <b>epoch</b>. Inside an epoch you walk the data in small chunks called <b>batches</b>, handed to you by a <code>DataLoader</code>. For each batch you do five steps:</p>
<ol>
<li><code>optimizer.zero_grad()</code> — clear last batch's gradients.</li>
<li><code>pred = model(x)</code> — forward pass: the model's guess.</li>
<li><code>loss = criterion(pred, y)</code> — measure error against the true labels.</li>
<li><code>loss.backward()</code> — backprop: fill each weight's <code>.grad</code> with its slope.</li>
<li><code>optimizer.step()</code> — nudge every weight downhill using those slopes.</li>
</ol>
<p>After all batches, you run a <b>validation pass</b> on held-out data — no weight updates — to see how the model does on data it did not learn from. You print train and validation loss and accuracy each epoch to watch progress.</p>`,

    symbols: [
      { sym: "epoch", def: "one full pass over the entire training dataset" },
      { sym: "batch", def: "a small group of examples processed together in one step" },
      { sym: "criterion", def: "the loss function, e.g. nn.CrossEntropyLoss" },
      { sym: ".grad", def: "the slope of the loss with respect to a weight, filled by backward()" }
    ],

    derivation: `<p>The magic is <b>autograd</b>. As the forward pass runs, PyTorch quietly records every operation into a graph. When you call <code>loss.backward()</code>, it walks that graph backward and computes, for every weight, how much the loss would change if you tweaked it — the gradient. That gradient lands in each weight's <code>.grad</code>.</p>
<p><code>optimizer.step()</code> then reads those <code>.grad</code> values and updates the weights, e.g. plain SGD (Stochastic Gradient Descent) does <code>w -= lr * w.grad</code>. Because gradients <i>accumulate</i> by design (useful for some tricks), you must clear them with <code>zero_grad()</code> before the next batch.</p>
<p>The order matters: zero, forward, loss, backward, step. Forward builds the graph; backward fills the gradients; step uses them. See <code>dl-backprop</code> for the math and <code>dl-optimizers</code> for the update rules.</p>`,

    example: `<p>Take a 2-feature input <code>x</code> and a tiny linear model <code>y = Wx + b</code>. One batch: <code>zero_grad()</code> wipes <code>W.grad</code> and <code>b.grad</code> to zero. <code>pred = model(x)</code> gives a guess, say 0.3 when the label is 1. <code>loss = criterion(pred, y)</code> turns that gap into a number. <code>loss.backward()</code> fills <code>W.grad</code> and <code>b.grad</code> with slopes pointing uphill. <code>optimizer.step()</code> moves <code>W</code> and <code>b</code> a small step the other way, so next time the guess for this kind of input is closer to 1.</p>`,

    demo: function (host) {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var ink = g("--ink", "#e6edf3"), dim = g("--ink-dim", "#9aa7b4"), accent = g("--accent", "#4ea1ff"), accent2 = g("--accent-2", "#7ee787"), warn = g("--warn", "#ffb454"), border = g("--border", "#2a3340");

      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var out = document.createElement("div"); out.className = "out"; out.style.marginTop = "6px"; host.appendChild(out);
      var bar = document.createElement("div"); bar.style.marginTop = "8px"; host.appendChild(bar);

      // tiny 1-D problem: fit pred = w*x to data y = 2*x, plain SGD by hand.
      var xs = [-2, -1, 0, 1, 2], ys = xs.map(function (x) { return 2 * x; });
      var w, epoch, history, timer = null;
      function reset() {
        w = -1.5; epoch = 0; history = [];
        if (timer) { clearInterval(timer); timer = null; }
        draw();
      }
      function step() {
        // one epoch of full-batch gradient descent on MSE: grad = mean(2*(w*x - y)*x)
        var grad = 0, lossv = 0;
        for (var i = 0; i < xs.length; i++) {
          var p = w * xs[i], e = p - ys[i];
          grad += 2 * e * xs[i] / xs.length;
          lossv += e * e / xs.length;
        }
        w = w - 0.08 * grad;          // optimizer.step()
        epoch++;
        history.push({ w: w, loss: lossv });
        draw();
      }
      function draw() {
        var W = cv.width, H = cv.height, padL = 44, padR = 16, padT = 16, padB = 30;
        ctx.clearRect(0, 0, W, H);
        // loss curve panel
        var n = Math.max(1, history.length);
        var maxL = 1; for (var k = 0; k < history.length; k++) if (history[k].loss > maxL) maxL = history[k].loss;
        // axes
        ctx.strokeStyle = border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        ctx.fillStyle = dim; ctx.font = "12px sans-serif";
        ctx.fillText("loss", padL - 36, padT + 10);
        ctx.fillText("epoch", W - padR - 40, H - padB + 20);
        // plot loss
        if (history.length > 1) {
          ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath();
          for (var j = 0; j < history.length; j++) {
            var px = padL + (j / (n - 1 || 1)) * (W - padL - padR);
            var py = (H - padB) - (history[j].loss / maxL) * (H - padT - padB);
            if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        var cur = history.length ? history[history.length - 1].loss : 0;
        ctx.fillStyle = ink;
        out.innerHTML = "epoch " + epoch + " &mdash; w = " + w.toFixed(3) + " (target 2.000), loss = " + cur.toFixed(4);
      }
      function mkbtn(label, fn) {
        var b = document.createElement("button"); b.textContent = label;
        b.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
        b.onclick = fn; bar.appendChild(b); return b;
      }
      mkbtn("step 1 epoch", function () { step(); });
      mkbtn("run", function () { if (timer) return; timer = setInterval(function () { if (epoch >= 60) { clearInterval(timer); timer = null; return; } step(); }, 120); });
      mkbtn("reset", reset);
      reset();
    },

    practice: [
      {
        q: `Put these five per-batch steps in the correct order: <code>loss.backward()</code>, <code>optimizer.step()</code>, <code>pred = model(x)</code>, <code>optimizer.zero_grad()</code>, <code>loss = criterion(pred, y)</code>.`,
        steps: [
          { do: `Start by clearing old gradients.`, why: `Gradients accumulate; if you do not zero them, this batch's update mixes in the last batch's slopes.` },
          { do: `Forward pass to get the prediction, then compute the loss.`, why: `The forward pass builds the autograd graph that backward() will later walk.` },
          { do: `Call backward(), then step().`, why: `backward() fills each weight's .grad; step() uses those grads to update the weights.` }
        ],
        answer: `<code>zero_grad()</code> &rarr; <code>pred = model(x)</code> &rarr; <code>loss = criterion(pred, y)</code> &rarr; <code>loss.backward()</code> &rarr; <code>optimizer.step()</code>.`
      },
      {
        q: `Your validation loss looks fine on screen but the script slowly runs out of memory over many epochs. You accumulate the loss with <code>total += loss</code>. What is wrong and how do you fix it?`,
        steps: [
          { do: `Note that <code>loss</code> is a tensor still attached to its computation graph.`, why: `Summing it keeps a reference to every batch's graph, so none can be freed.` },
          { do: `Replace it with the scalar value.`, why: `<code>loss.item()</code> returns a plain Python float with no graph attached.` }
        ],
        answer: `Accumulate <code>loss.item()</code> instead of <code>loss</code>. Also wrap validation in <code>with torch.no_grad():</code> so no graph is built at all.`
      },
      {
        q: `You forgot to call <code>model.eval()</code> before validating a network that uses dropout. Why are your validation numbers unreliable?`,
        steps: [
          { do: `Recall what dropout does in training mode.`, why: `In train mode it randomly zeroes some activations each forward pass, so the same input gives different outputs.` },
          { do: `Realize validation should be deterministic.`, why: `<code>model.eval()</code> turns dropout off (and switches batch norm to running statistics), giving stable, fair numbers.` }
        ],
        answer: `Without <code>model.eval()</code>, dropout stays active during validation, so predictions are noisy and the loss/accuracy are not trustworthy. Call <code>model.eval()</code> first, then <code>model.train()</code> again before the next training epoch.`
      }
    ]
  });

  window.CODE["pt-training-loop"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A complete, runnable training loop on a small synthetic 2-class dataset. It builds the model, criterion, and optimizer, splits into train/validation <code>DataLoader</code>s, then runs the epoch/batch loop with <code>model.train()</code> / <code>model.eval()</code> and a <code>torch.no_grad()</code> validation pass. It prints train and validation loss and accuracy each epoch. Paste it into Google Colab and run — torch ships preinstalled there.</p>`,
    code: `import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader

torch.manual_seed(0)                       # reproducible
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- tiny synthetic 2-class dataset (two Gaussian blobs in 8-D) ---
N, D = 1000, 8
centers = torch.randn(2, D) * 2.0
y = torch.randint(0, 2, (N,))              # class labels 0 / 1
X = centers[y] + torch.randn(N, D)         # features near each class center

# train / validation split
ntr = 800
train_ds = TensorDataset(X[:ntr], y[:ntr])
val_ds   = TensorDataset(X[ntr:], y[ntr:])
train_dl = DataLoader(train_ds, batch_size=32, shuffle=True)
val_dl   = DataLoader(val_ds,   batch_size=64)

# --- model, loss, optimizer ---
model = nn.Sequential(
    nn.Linear(D, 32), nn.ReLU(), nn.Dropout(0.2),
    nn.Linear(32, 2),                      # raw logits (no softmax!)
).to(device)
criterion = nn.CrossEntropyLoss()          # expects logits + int labels
optimizer = torch.optim.Adam(model.parameters(), lr=1e-2)

def run_epoch(loader, train):
    model.train() if train else model.eval()   # dropout/batchnorm mode
    total_loss, correct, n = 0.0, 0, 0
    ctx = torch.enable_grad() if train else torch.no_grad()
    with ctx:
        for xb, yb in loader:
            xb, yb = xb.to(device), yb.to(device)   # move to device
            if train:
                optimizer.zero_grad()               # clear old grads
            pred = model(xb)                        # forward
            loss = criterion(pred, yb)              # measure error
            if train:
                loss.backward()                     # backprop
                optimizer.step()                    # update weights
            total_loss += loss.item() * len(xb)     # .item() -> no graph
            correct += (pred.argmax(1) == yb).sum().item()
            n += len(xb)
    return total_loss / n, correct / n

EPOCHS = 15
for epoch in range(1, EPOCHS + 1):
    tr_loss, tr_acc = run_epoch(train_dl, train=True)
    va_loss, va_acc = run_epoch(val_dl,   train=False)
    print(f"epoch {epoch:2d} | "
          f"train loss {tr_loss:.3f} acc {tr_acc:.3f} | "
          f"val loss {va_loss:.3f} acc {va_acc:.3f}")
`
  };

  window.CODEVIZ["pt-training-loop"] = {
    question: "Across epochs, does training loss keep falling while validation loss eventually turns back up?",
    charts: [{
      type: "line",
      title: "Train vs validation loss over epochs (the overfitting signal)",
      xlabel: "epoch", ylabel: "loss (cross-entropy)",
      series: [
        { name: "train loss", color: "#7ee787", points: [[1, 0.5385], [3, 0.3741], [5, 0.2892], [7, 0.2365], [9, 0.2002], [11, 0.1735], [13, 0.153], [15, 0.1367], [17, 0.1235], [19, 0.1126], [21, 0.1034], [23, 0.0956], [25, 0.0888], [27, 0.0829], [29, 0.0778], [31, 0.0732], [33, 0.0691], [35, 0.0655], [37, 0.0622], [39, 0.0592], [41, 0.0565], [43, 0.054], [45, 0.0517], [47, 0.0496], [49, 0.0477], [51, 0.0459], [53, 0.0443], [55, 0.0427], [57, 0.0413], [59, 0.0399], [61, 0.0387], [63, 0.0375], [65, 0.0363], [67, 0.0353], [69, 0.0343], [71, 0.0334], [73, 0.0325], [75, 0.0316], [77, 0.0308], [79, 0.0301], [81, 0.0293], [83, 0.0286], [85, 0.028], [87, 0.0273], [89, 0.0267], [91, 0.0262], [93, 0.0256], [95, 0.0251], [97, 0.0246], [99, 0.0241], [101, 0.0236], [103, 0.0232], [105, 0.0227], [107, 0.0223], [109, 0.0219], [111, 0.0215], [113, 0.0211], [115, 0.0208], [117, 0.0204], [119, 0.0201]] },
        { name: "validation loss", color: "#ff7b72", points: [[1, 0.6488], [3, 0.6041], [5, 0.5848], [7, 0.5761], [9, 0.5726], [11, 0.5721], [13, 0.5734], [15, 0.5757], [17, 0.5787], [19, 0.5822], [21, 0.5859], [23, 0.5897], [25, 0.5936], [27, 0.5976], [29, 0.6015], [31, 0.6054], [33, 0.6093], [35, 0.6131], [37, 0.6168], [39, 0.6205], [41, 0.6241], [43, 0.6276], [45, 0.631], [47, 0.6344], [49, 0.6377], [51, 0.6409], [53, 0.6441], [55, 0.6472], [57, 0.6502], [59, 0.6532], [61, 0.6561], [63, 0.6589], [65, 0.6617], [67, 0.6645], [69, 0.6671], [71, 0.6698], [73, 0.6724], [75, 0.6749], [77, 0.6774], [79, 0.6798], [81, 0.6822], [83, 0.6846], [85, 0.6869], [87, 0.6892], [89, 0.6914], [91, 0.6936], [93, 0.6958], [95, 0.6979], [97, 0.7], [99, 0.7021], [101, 0.7041], [103, 0.7061], [105, 0.7081], [107, 0.71], [109, 0.7119], [111, 0.7138], [113, 0.7157], [115, 0.7175], [117, 0.7193], [119, 0.7211]] }
      ]
    }],
    caption: "Real numbers from a tiny numpy logistic-regression run (30 training rows, 40 features of which only 3 carry signal, 300 validation rows). Train loss falls steadily toward 0.02 as the model memorizes the training set. Validation loss bottoms out around epoch 11 (about 0.572) then climbs back to 0.72 — the classic overfitting signal, and why you watch validation loss and stop early (see dl-early-stopping).",
    code: `import numpy as np

rng = np.random.RandomState(1)
d = 40                                 # 40 features...
ntr, nva = 30, 300                     # ...but tiny train set -> easy to overfit
w_true = np.zeros(d); w_true[:3] = [1.6, -1.4, 1.0]   # only 3 real signals

def make(n):
    X = rng.randn(n, d)
    logits = X @ w_true + 0.6 * rng.randn(n)
    return X, (logits > 0).astype(float)

Xtr, ytr = make(ntr)
Xva, yva = make(nva)
Xtr = np.hstack([Xtr, np.ones((ntr, 1))])   # bias column
Xva = np.hstack([Xva, np.ones((nva, 1))])

w = np.zeros(d + 1)
sig = lambda z: 1.0 / (1.0 + np.exp(-np.clip(z, -30, 30)))
def bce(X, y, w):
    p = np.clip(sig(X @ w), 1e-7, 1 - 1e-7)
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))

lr, epochs = 0.3, 120
train_loss, val_loss = [], []
for e in range(epochs):
    p = sig(Xtr @ w)
    grad = Xtr.T @ (p - ytr) / ntr      # logistic gradient
    w -= lr * grad                      # the "optimizer.step()"
    train_loss.append(bce(Xtr, ytr, w))
    val_loss.append(bce(Xva, yva, w))   # held-out: no weight update

# subsample to <= 60 points for the chart (every 2nd epoch)
es = range(0, epochs, 2)
print("train:", [(e + 1, round(train_loss[e], 4)) for e in es])
print("val  :", [(e + 1, round(val_loss[e], 4)) for e in es])
print("val min at epoch", int(np.argmin(val_loss)) + 1,
      "=", round(min(val_loss), 3))
`
  };
})();
