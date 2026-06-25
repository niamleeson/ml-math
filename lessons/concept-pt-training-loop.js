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
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["dl-backprop", "dl-optimizers", "dl-minibatch", "dl-cross-entropy", "dl-dropout", "dl-batchnorm", "dl-early-stopping"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>write the five-step per-batch update — <code>zero_grad</code> &rarr; forward &rarr; loss &rarr; <code>backward</code> &rarr; <code>step</code> — in the correct order, from memory;</li>
<li>wrap data in a <code>TensorDataset</code> + <code>DataLoader</code> and loop over epochs and batches, moving each batch to the device;</li>
<li>switch correctly between <code>model.train()</code> and <code>model.eval()</code>, wrap validation in <code>torch.no_grad()</code>, and accumulate <code>loss.item()</code> to track train/validation loss and accuracy.</li>
</ul>
<p><b>The API you'll own:</b> <code>optimizer.zero_grad</code>, <code>loss.backward</code>, <code>optimizer.step</code>, <code>model.train</code> / <code>model.eval</code>, <code>torch.no_grad</code>, <code>loss.item</code>, <code>.to(device)</code>, <code>DataLoader</code>.</p>`,

    concept: `<p>Unlike Keras' one-call <code>model.fit()</code>, PyTorch makes you <b>write the training loop yourself</b>. That is the point: you see every step and can change any of them — a custom loss schedule, two optimizers, gradient clipping, odd logging. The same skeleton runs in research scripts, production jobs, and fine-tuning runs; frameworks like PyTorch Lightning just wrap it.</p>
<p>Training is one simple cycle repeated many times: <b>guess, measure the error, find which way to nudge each weight, nudge.</b> One full pass over the data is an <b>epoch</b>; inside it you walk the data in small <b>batches</b> from a <code>DataLoader</code>. For each batch you run five steps in a fixed order:</p>
<ul>
<li><code>optimizer.zero_grad()</code> — clear last batch's gradients (PyTorch <i>accumulates</i> them by design);</li>
<li><code>pred = model(x)</code> — the forward pass builds the autograd graph (see <code>dl-forward-prop</code>);</li>
<li><code>loss = criterion(pred, y)</code> — score the guess against the labels (see <code>dl-cross-entropy</code>);</li>
<li><code>loss.backward()</code> — autograd walks the graph backward and fills each weight's <code>.grad</code> (see <code>dl-backprop</code>);</li>
<li><code>optimizer.step()</code> — nudge every weight downhill using those slopes (see <code>dl-optimizers</code>).</li>
</ul>
<p>After all batches you run a <b>validation pass</b> on held-out data with no weight updates — <code>model.eval()</code> plus <code>torch.no_grad()</code> — to see how the model does on data it never learned from (the early-stopping signal, <code>dl-early-stopping</code>).</p>`,

    apiTable: [
      { sig: "optimizer.zero_grad()", does: "Reset every parameter's <code>.grad</code> to zero. PyTorch <i>adds</i> new gradients onto old ones, so call this first in every batch.", snippet: "optimizer.zero_grad()" },
      { sig: "pred = model(x)", does: "Forward pass: the model's guess. This also records the autograd graph used by <code>backward()</code>.", snippet: "pred = model(xb)" },
      { sig: "loss = criterion(pred, y)", does: "Score the guess against the labels as one number. <code>nn.CrossEntropyLoss</code> wants raw logits + integer labels.", snippet: "loss = criterion(pred, yb)" },
      { sig: "loss.backward()", does: "Backpropagate: fill every weight's <code>.grad</code> with the slope of the loss.", snippet: "loss.backward()" },
      { sig: "optimizer.step()", does: "Update each weight using its <code>.grad</code>, e.g. plain SGD does <code>w -= lr * w.grad</code>.", snippet: "optimizer.step()" },
      { sig: "model.train() / model.eval()", does: "Switch dropout and batch-norm modes. Train mode drops units / uses batch stats; eval mode keeps all units / uses running stats.", snippet: "model.train()   # or model.eval()" },
      { sig: "with torch.no_grad():", does: "Disable graph building for the block — the validation-pass habit: less memory, faster.", snippet: "with torch.no_grad():\n    pred = model(xb)" },
      { sig: "loss.item()", does: "Pull out the plain Python number with no graph attached. Accumulate this, not the raw <code>loss</code> tensor.", snippet: "total += loss.item() * len(xb)" },
      { sig: "x.to(device) / model.to(device)", does: "Move tensors and the model to the same device. A CPU/GPU mismatch raises an error.", snippet: "xb, yb = xb.to(device), yb.to(device)" },
      { sig: "for xb, yb in loader:", does: "Iterate a <code>DataLoader</code>, which hands you batched, shuffled tensors one batch at a time.", snippet: "for xb, yb in train_dl:\n    ..." }
    ],

    codeTour: [
      {
        explain: `<b>Seed, device, and a tiny synthetic dataset.</b> Two Gaussian blobs in 8-D give a clean 2-class problem. We seed for reproducibility and pick the device once so every batch and the model agree on where they live.`,
        code: `import torch\nimport torch.nn as nn\nfrom torch.utils.data import TensorDataset, DataLoader\n\ntorch.manual_seed(0)\ndevice = "cuda" if torch.cuda.is_available() else "cpu"\n\nN, D = 1000, 8\ncenters = torch.randn(2, D) * 2.0\ny = torch.randint(0, 2, (N,))          # class labels 0 / 1\nX = centers[y] + torch.randn(N, D)     # features near each class center\nprint(X.shape, y.shape, device)`,
        output: `torch.Size([1000, 8]) torch.Size([1000]) cpu`
      },
      {
        explain: `<b>Split into train/validation DataLoaders.</b> Wrap the tensors in a <code>TensorDataset</code>, then a <code>DataLoader</code> per split. The train loader shuffles each epoch; the validation loader does not (a fixed, reproducible pass).`,
        code: `ntr = 800\ntrain_ds = TensorDataset(X[:ntr], y[:ntr])\nval_ds   = TensorDataset(X[ntr:], y[ntr:])\ntrain_dl = DataLoader(train_ds, batch_size=32, shuffle=True)\nval_dl   = DataLoader(val_ds,   batch_size=64)\nprint(len(train_ds), len(val_ds))`,
        output: `800 200`
      },
      {
        explain: `<b>Model, loss, optimizer.</b> A small MLP that outputs <b>raw logits</b> (no softmax — <code>CrossEntropyLoss</code> adds log-softmax itself). Move the model to the device. Adam adapts the step size per parameter.`,
        code: `model = nn.Sequential(\n    nn.Linear(D, 32), nn.ReLU(), nn.Dropout(0.2),\n    nn.Linear(32, 2),                  # raw logits (no softmax!)\n).to(device)\ncriterion = nn.CrossEntropyLoss()      # expects logits + int labels\noptimizer = torch.optim.Adam(model.parameters(), lr=1e-2)\nprint(model)`,
        output: `Sequential(\n  (0): Linear(in_features=8, out_features=32, bias=True)\n  (1): ReLU()\n  (2): Dropout(p=0.2, inplace=False)\n  (3): Linear(in_features=32, out_features=2, bias=True)\n)`
      },
      {
        explain: `<b>One reusable <code>run_epoch</code> helper.</b> It sets <code>train()</code> / <code>eval()</code> from the flag, picks <code>enable_grad()</code> vs <code>no_grad()</code>, runs the five-step update only when training, and accumulates <code>loss.item()</code> (the graph-free number) plus correct counts. It returns mean loss and accuracy.`,
        code: `def run_epoch(loader, train):\n    model.train() if train else model.eval()\n    total_loss, correct, n = 0.0, 0, 0\n    ctx = torch.enable_grad() if train else torch.no_grad()\n    with ctx:\n        for xb, yb in loader:\n            xb, yb = xb.to(device), yb.to(device)\n            if train:\n                optimizer.zero_grad()        # 1. clear old grads\n            pred = model(xb)                 # 2. forward\n            loss = criterion(pred, yb)       # 3. measure error\n            if train:\n                loss.backward()              # 4. backprop\n                optimizer.step()             # 5. update weights\n            total_loss += loss.item() * len(xb)   # .item() -> no graph\n            correct += (pred.argmax(1) == yb).sum().item()\n            n += len(xb)\n    return total_loss / n, correct / n`,
        output: `# (defines run_epoch — no output yet)`
      },
      {
        explain: `<b>The epoch loop.</b> Each epoch trains on the train loader, then validates on the held-out loader, printing both losses and accuracies. Train loss falls and accuracy climbs as the model learns to separate the two blobs.`,
        code: `EPOCHS = 15\nfor epoch in range(1, EPOCHS + 1):\n    tr_loss, tr_acc = run_epoch(train_dl, train=True)\n    va_loss, va_acc = run_epoch(val_dl,   train=False)\n    print(f"epoch {epoch:2d} | "\n          f"train loss {tr_loss:.3f} acc {tr_acc:.3f} | "\n          f"val loss {va_loss:.3f} acc {va_acc:.3f}")`,
        output: `epoch  1 | train loss 0.382 acc 0.851 | val loss 0.171 acc 0.955\nepoch  2 | train loss 0.180 acc 0.945 | val loss 0.112 acc 0.965\n...\nepoch 15 | train loss 0.071 acc 0.979 | val loss 0.069 acc 0.975\n(numbers approximate; loss falls and accuracy rises over the run)`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab and read each printed block against its note:</p>
<ul>
<li>The dataset block prints <code>torch.Size([1000, 8]) torch.Size([1000]) cpu</code> — 1000 samples of 8 features, 1000 labels, and the device you're on.</li>
<li>The split prints <code>800 200</code>, confirming 800 training and 200 validation samples.</li>
<li>The model print shows the four layers in order, ending in <code>Linear(..., out_features=2)</code> — two raw logits, no softmax.</li>
<li>The epoch loop prints one line per epoch. <b>Train loss falls</b> (roughly 0.38 &rarr; 0.07) and <b>accuracy rises</b> toward ~0.98; validation tracks close behind because the two blobs are easy to separate. That train/val gap is what you watch for overfitting (see <code>dl-early-stopping</code>).</li>
</ul>
<p>On a GPU runtime the device line reads <code>cuda</code> and training is faster, but the numbers are the same. Without <code>torch.manual_seed(0)</code> the exact per-epoch values will differ from a teammate's — seed first to match.</p>`,

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
        q: `<b>Type this in Colab.</b> Write the five-line training step in the correct order on a tiny model. With
            <code>torch.manual_seed(0)</code>, build <code>model = nn.Linear(3, 1)</code>,
            <code>opt = torch.optim.SGD(model.parameters(), lr=0.1)</code>, <code>crit = nn.MSELoss()</code>,
            <code>x = torch.randn(5, 3)</code>, <code>y = torch.randn(5, 1)</code>. Run exactly one batch:
            zero_grad &rarr; forward &rarr; loss &rarr; backward &rarr; step. Print the loss.`,
        steps: [
          { do: `Order it: <code>opt.zero_grad()</code>, <code>pred = model(x)</code>, <code>loss = crit(pred, y)</code>, <code>loss.backward()</code>, <code>opt.step()</code>.`, why: `Forward builds the autograd graph; backward fills <code>.grad</code>; step uses them — the order is load-bearing.` },
          { do: `Print <code>loss.item()</code> after the forward.`, why: `<code>.item()</code> pulls out the plain Python number with no graph attached.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
torch.manual_seed(0)
model = nn.Linear(3, 1)
opt = torch.optim.SGD(model.parameters(), lr=0.1)
crit = nn.MSELoss()
x = torch.randn(5, 3)
y = torch.randn(5, 1)

opt.zero_grad()          # 1. clear old grads
pred = model(x)          # 2. forward
loss = crit(pred, y)     # 3. measure error
loss.backward()          # 4. backprop -> fills .grad
opt.step()               # 5. update weights
print(round(loss.item(), 4))   # 1.0855</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Prove that forgetting <code>zero_grad()</code> corrupts training. Make
            <code>w = torch.zeros(1, requires_grad=True)</code> and <code>opt = torch.optim.SGD([w], lr=0.0)</code>.
            Loop 3 times: forward <code>loss = (w - 2.0).pow(2)</code>, <code>loss.backward()</code>, but NEVER call
            <code>zero_grad()</code>. Print <code>w.grad</code> each time and watch it pile up.`,
        steps: [
          { do: `Skip <code>opt.zero_grad()</code> inside the loop.`, why: `PyTorch ADDS each backward's gradient onto <code>.grad</code>, so it grows: -4, -8, -12.` },
          { do: `Use <code>lr=0.0</code> so <code>w</code> never changes and the grad is the same each backward.`, why: `It isolates the accumulation: only the missing reset changes the printed value.` }
        ],
        answer: `<pre><code>w = torch.zeros(1, requires_grad=True)
opt = torch.optim.SGD([w], lr=0.0)
for i in range(3):
    loss = (w - 2.0).pow(2)   # d/dw = 2(w-2) = -4 at w=0
    loss.backward()           # NO zero_grad -> accumulates
    print(w.grad)             # tensor([-4.]) tensor([-8.]) tensor([-12.])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Now fix it: same setup as above, but call <code>opt.zero_grad()</code> at the top
            of each iteration. Print <code>w.grad</code> each time and confirm it stays at <code>-4</code>.`,
        steps: [
          { do: `Add <code>opt.zero_grad()</code> before <code>loss.backward()</code>.`, why: `Resetting the grad to zero each step means each backward sees only its own gradient.` },
          { do: `Compare with the previous task's growing values.`, why: `The constant <code>-4</code> shows the reset is what keeps every update correct.` }
        ],
        answer: `<pre><code>w = torch.zeros(1, requires_grad=True)
opt = torch.optim.SGD([w], lr=0.0)
for i in range(3):
    opt.zero_grad()           # the fix
    loss = (w - 2.0).pow(2)
    loss.backward()
    print(w.grad)             # tensor([-4.]) tensor([-4.]) tensor([-4.])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show that <code>model.eval()</code> changes dropout behavior. Build
            <code>torch.manual_seed(0); m = nn.Dropout(0.5)</code> and <code>x = torch.ones(10)</code>. In
            <code>m.train()</code> mode, print <code>m(x)</code> twice (different each time, some zeros). Then call
            <code>m.eval()</code> and print <code>m(x)</code> (all ones — dropout off).`,
        steps: [
          { do: `Call the module in <code>.train()</code> then <code>.eval()</code> mode.`, why: `Train mode randomly zeroes half the units and scales the rest; eval mode passes the input through unchanged.` },
          { do: `Use a fixed input of ones so the effect is obvious.`, why: `Zeros appear only in train mode, proving why you must switch to eval for validation.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
m = nn.Dropout(0.5)
x = torch.ones(10)
m.train()
print(m(x))   # e.g. tensor([2.,0.,2.,2.,0.,...])  random zeros, survivors x2
print(m(x))   # different again
m.eval()
print(m(x))   # tensor([1.,1.,1.,1.,1.,1.,1.,1.,1.,1.])  dropout OFF</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show that <code>torch.no_grad()</code> stops graph building. Make
            <code>w = torch.ones(1, requires_grad=True)</code>. Compute <code>(w * 2).requires_grad</code> normally,
            then compute it inside <code>with torch.no_grad():</code>. Predict each before running, then verify.`,
        steps: [
          { do: `Read <code>.requires_grad</code> on the output tensor in both contexts.`, why: `Outside the block it is <code>True</code> (graph tracked); inside it is <code>False</code> (no graph).` },
          { do: `Wrap inference / validation in <code>torch.no_grad()</code>.`, why: `No graph means less memory and faster evaluation — the validation-pass habit.` }
        ],
        answer: `<pre><code>w = torch.ones(1, requires_grad=True)
print((w * 2).requires_grad)        # True
with torch.no_grad():
    print((w * 2).requires_grad)    # False  -- no graph built</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Move a model and a batch to the chosen device to avoid a mismatch. Set
            <code>device = "cuda" if torch.cuda.is_available() else "cpu"</code>. Put <code>model = nn.Linear(4, 2).to(device)</code>
            and a batch <code>x = torch.randn(16, 4)</code>. Run <code>model(x)</code> WITHOUT moving <code>x</code>
            (note the error on GPU), then move it with <code>x.to(device)</code> and run again.`,
        steps: [
          { do: `Build the device string once and <code>.to(device)</code> both model and data.`, why: `An op between a <code>cuda</code> tensor and a <code>cpu</code> tensor raises a device-mismatch error.` },
          { do: `Print <code>out.shape</code> after the corrected call.`, why: `A <code>(16, 2)</code> output confirms both operands now share a device.` }
        ],
        answer: `<pre><code>device = "cuda" if torch.cuda.is_available() else "cpu"
model = nn.Linear(4, 2).to(device)
x = torch.randn(16, 4)
# On GPU this raises:
#   RuntimeError: Expected all tensors to be on the same device
# out = model(x)
x = x.to(device)              # fix: move the batch too
out = model(x)
print(out.shape)              # torch.Size([16, 2])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Write a reusable <code>run_epoch(loader, train)</code> helper. With
            <code>torch.manual_seed(0)</code>, make a <code>TensorDataset</code> from <code>X = torch.randn(200, 8)</code>,
            <code>y = torch.randint(0, 2, (200,))</code>, a <code>DataLoader(batch_size=32, shuffle=True)</code>, a
            model <code>nn.Sequential(nn.Linear(8,16), nn.ReLU(), nn.Linear(16,2))</code>,
            <code>CrossEntropyLoss</code>, and <code>Adam</code>. The helper sets <code>train()/eval()</code>, wraps
            eval in <code>no_grad</code>, accumulates <code>loss.item()</code>, and returns mean loss + accuracy.`,
        steps: [
          { do: `Toggle <code>model.train()</code> / <code>model.eval()</code> and pick <code>enable_grad()</code> vs <code>no_grad()</code> by the <code>train</code> flag.`, why: `Train mode updates weights and builds the graph; eval mode skips both for correct, cheap validation.` },
          { do: `Accumulate <code>loss.item() * len(xb)</code>, not the raw <code>loss</code> tensor.`, why: `<code>.item()</code> drops the graph, avoiding the slow cross-epoch memory leak.` }
        ],
        answer: `<pre><code>from torch.utils.data import TensorDataset, DataLoader
torch.manual_seed(0)
X = torch.randn(200, 8); y = torch.randint(0, 2, (200,))
dl = DataLoader(TensorDataset(X, y), batch_size=32, shuffle=True)
model = nn.Sequential(nn.Linear(8, 16), nn.ReLU(), nn.Linear(16, 2))
crit = nn.CrossEntropyLoss(); opt = torch.optim.Adam(model.parameters(), lr=1e-2)

def run_epoch(loader, train):
    model.train() if train else model.eval()
    ctx = torch.enable_grad() if train else torch.no_grad()
    total, correct, n = 0.0, 0, 0
    with ctx:
        for xb, yb in loader:
            if train: opt.zero_grad()
            pred = model(xb)
            loss = crit(pred, yb)
            if train:
                loss.backward(); opt.step()
            total += loss.item() * len(xb)            # .item() -> no graph
            correct += (pred.argmax(1) == yb).sum().item()
            n += len(xb)
    return total / n, correct / n

print(run_epoch(dl, train=True))    # e.g. (0.70..., 0.55...)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Put it together: train the model from the previous task for 5 epochs, calling
            <code>run_epoch(dl, train=True)</code> each epoch and printing the epoch number, mean loss, and accuracy.
            Confirm the loss falls across epochs.`,
        steps: [
          { do: `Loop <code>for epoch in range(1, 6):</code> and call the helper.`, why: `An epoch is one full pass over the loader; repeating it drives learning.` },
          { do: `Print the returned loss and accuracy each epoch.`, why: `Watching loss fall (and accuracy rise) confirms the loop is wired correctly.` }
        ],
        answer: `<pre><code>for epoch in range(1, 6):
    loss, acc = run_epoch(dl, train=True)
    print(f"epoch {epoch}  loss {loss:.4f}  acc {acc:.3f}")
# epoch 1  loss 0.70..  acc 0.5..
# epoch 5  loss 0.55..  acc 0.7..   (loss falls, accuracy climbs)</code></pre>`
      }
    ],

    cheatsheet: [
      { code: "for epoch in range(EPOCHS):", note: "outer loop — one full pass over the data per epoch" },
      { code: "for xb, yb in loader:", note: "inner loop — one batch from the <code>DataLoader</code>" },
      { code: "optimizer.zero_grad()", note: "clear grads FIRST — PyTorch accumulates them" },
      { code: "pred = model(xb); loss = criterion(pred, yb)", note: "forward, then score against labels" },
      { code: "loss.backward(); optimizer.step()", note: "backprop fills <code>.grad</code>, then step updates weights" },
      { code: "model.train()  /  model.eval()", note: "set BEFORE the pass — dropout & batch-norm depend on it" },
      { code: "with torch.no_grad(): ...", note: "wrap validation — no graph, less memory, faster" },
      { code: "total += loss.item() * len(xb)", note: ".item() drops the graph — avoids the cross-epoch memory leak" },
      { code: "xb, yb = xb.to(device), yb.to(device)", note: "move every batch to the model's device" }
    ],

    deeper: `<p>The loop is the PyTorch <i>how</i>; the math behind each step lives in the concept lessons:</p>
<ul>
<li><a onclick="App.open('dl-backprop')">backpropagation</a> — what <code>loss.backward()</code> computes by walking the autograd graph;</li>
<li><a onclick="App.open('dl-optimizers')">optimizers</a> — the update rules <code>optimizer.step()</code> applies (SGD, momentum, Adam);</li>
<li><a onclick="App.open('dl-minibatch')">mini-batches</a> — why we update on small batches instead of the whole dataset;</li>
<li><a onclick="App.open('dl-early-stopping')">early stopping</a> — reading the validation curve to know when to stop.</li>
</ul>`
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
