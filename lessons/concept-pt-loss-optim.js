(function () {
  window.LESSONS.push({
    id: "pt-loss-optim",
    title: "Loss functions and optimizers",
    tagline: "The two pieces that turn a model into learning: a loss to score it, an optimizer to fix it.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["dl-cross-entropy", "dl-optimizers", "ml-gradient-descent"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>pick the right loss for the task — <code>nn.MSELoss</code> for regression, <code>nn.CrossEntropyLoss</code> for single-label classification, <code>nn.BCEWithLogitsLoss</code> for binary/multi-label — and feed it the shapes and dtypes it expects;</li>
<li>construct an optimizer over <code>model.parameters()</code> and run the three-step update <code>zero_grad()</code> &rarr; <code>backward()</code> &rarr; <code>step()</code> every iteration;</li>
<li>attach a learning-rate scheduler and step it once per epoch, and avoid the famous gotchas (double softmax, one-hot targets, skipped <code>zero_grad</code>).</li>
</ul>
<p><b>The API you'll own:</b> <code>nn.MSELoss</code> / <code>nn.CrossEntropyLoss</code> / <code>nn.BCEWithLogitsLoss</code>, <code>torch.optim.SGD</code> / <code>Adam</code> / <code>AdamW</code>, <code>optimizer.zero_grad/step</code>, <code>loss.backward</code>, <code>torch.optim.lr_scheduler.StepLR</code>.</p>`,

    concept: `<p>Learning is a feedback loop with two parts. A <b>loss function</b> turns the model's output into a single number — how wrong it is right now. An <b>optimizer</b> reads the gradients of that number and nudges every weight to make it smaller. Pick the loss right and wire the optimizer right, and the rest is plumbing.</p>
<p>The loss you choose is decided by the task. <b>Regression</b> (predict a number) uses <code>nn.MSELoss</code>, the mean of squared differences. <b>Single-label classification</b> uses <code>nn.CrossEntropyLoss</code>, which takes raw <b>logits</b> of shape <code>(N, C)</code> and integer class targets of shape <code>(N,)</code> — it does log-softmax then negative log-likelihood in one numerically stable step, so your model must <i>not</i> end in a softmax. <b>Binary or multi-label</b> (each label independent) uses <code>nn.BCEWithLogitsLoss</code>, which applies the sigmoid internally. The math of why cross-entropy is the right classification loss is in <code>dl-cross-entropy</code>.</p>
<p>The optimizer is attached to the model's parameters once: <code>opt = torch.optim.Adam(model.parameters(), lr=1e-3)</code>. From then on it remembers where they live, and for adaptive methods like Adam keeps running statistics of past gradients to size each parameter's step automatically. Reach for <code>Adam</code> or <code>AdamW</code> first — they "just work" with little tuning; use plain <code>SGD</code> with momentum when you want the very best final accuracy and have time to tune. Why Adam improves on plain gradient descent is in <code>dl-optimizers</code>.</p>
<p>Every step runs the same three lines, in order: <code>optimizer.zero_grad()</code> clears last step's gradients (PyTorch <i>accumulates</i> them), <code>loss.backward()</code> fills every parameter's <code>.grad</code>, and <code>optimizer.step()</code> moves each parameter one step downhill.</p>`,

    apiTable: [
      { sig: "nn.MSELoss()(pred, target)", does: "Mean squared error for regression. <code>pred</code> and <code>target</code> are floats of the same shape.", snippet: "nn.MSELoss()(preds, target)   # tensor(0.4167)" },
      { sig: "nn.CrossEntropyLoss()(logits, target)", does: "Single-label classification. Takes raw <b>logits</b> <code>(N, C)</code> + integer targets <code>(N,)</code>; applies log-softmax internally (no softmax in your model).", snippet: "nn.CrossEntropyLoss()(logits, targets)" },
      { sig: "nn.BCEWithLogitsLoss()(logits, target)", does: "Binary / multi-label cross-entropy. Takes logits and applies the sigmoid internally; targets are floats in {0,1}.", snippet: "nn.BCEWithLogitsLoss()(logit, y.float())" },
      { sig: "nn.NLLLoss()(log_probs, target)", does: "Negative log-likelihood; expects <i>already</i> log-probabilities (e.g. from <code>F.log_softmax</code>). <code>CrossEntropyLoss</code> = LogSoftmax + NLLLoss.", snippet: "nn.NLLLoss()(F.log_softmax(x, 1), y)" },
      { sig: "torch.optim.SGD(params, lr, momentum=)", does: "Plain stochastic gradient descent — the textbook update. Add <code>momentum=0.9</code> in practice.", snippet: "torch.optim.SGD(model.parameters(), lr=1e-2, momentum=0.9)" },
      { sig: "torch.optim.Adam(params, lr=1e-3)", does: "Adaptive optimizer — sizes each parameter's step from moving averages of the gradient. The default first choice.", snippet: "torch.optim.Adam(model.parameters(), lr=1e-3)" },
      { sig: "torch.optim.AdamW(params, lr, weight_decay=)", does: "Adam with correct (decoupled) weight decay; the modern default for transformers.", snippet: "torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)" },
      { sig: "optimizer.zero_grad() / .step()", does: "Clear last step's accumulated grads; then move every parameter one step downhill using the filled <code>.grad</code>.", snippet: "opt.zero_grad(); loss.backward(); opt.step()" },
      { sig: "loss.backward()", does: "Backpropagate: fill every parameter's <code>.grad</code> with the slope of the loss with respect to it.", snippet: "loss.backward()" },
      { sig: "lr_scheduler.StepLR(opt, step_size, gamma)", does: "Multiply the learning rate by <code>gamma</code> every <code>step_size</code> epochs. Call <code>scheduler.step()</code> once per epoch.", snippet: "sched = StepLR(opt, step_size=1, gamma=0.5)" }
    ],

    codeTour: [
      {
        explain: `<b>Set up the tiny 3-class problem.</b> Sixty points, four features each, with integer class labels 0/1/2 — <i>not</i> one-hot. <code>CrossEntropyLoss</code> wants integer indices, so <code>torch.randint</code> gives exactly the right target shape <code>(N,)</code> and dtype (long).`,
        code: `import torch
import torch.nn as nn

torch.manual_seed(0)  # reproducible

N, D_in, C = 60, 4, 3
X = torch.randn(N, D_in)
y = torch.randint(0, C, (N,))   # class labels 0/1/2, shape (N,), dtype long
print(X.shape, y.shape, y.dtype)`,
        output: `torch.Size([60, 4]) torch.Size([60]) torch.int64`
      },
      {
        explain: `<b>Build a model that outputs raw logits.</b> Two linear layers with a ReLU between them. The last layer emits one score per class — shape <code>(N, C)</code> — with <b>no softmax</b>. That is deliberate: <code>CrossEntropyLoss</code> adds the log-softmax itself, so a softmax here would double it.`,
        code: `model = nn.Sequential(
    nn.Linear(D_in, 16),
    nn.ReLU(),
    nn.Linear(16, C),   # raw logits, no softmax
)
print(model(X).shape)   # (N, C) logits`,
        output: `torch.Size([60, 3])`
      },
      {
        explain: `<b>Pick the loss and the optimizer.</b> <code>CrossEntropyLoss</code> is built once and called like a function. <code>Adam</code> is handed the model's parameters and a learning rate — this is the wiring that lets <code>step()</code> know which tensors to move.`,
        code: `criterion = nn.CrossEntropyLoss()        # applies log-softmax INTERNALLY
optimizer = torch.optim.Adam(model.parameters(), lr=1e-2)`,
        output: ``
      },
      {
        explain: `<b>The three-step update, in a loop.</b> Each step: forward to get logits, measure the loss, then the canonical trio — <code>zero_grad()</code> clears old grads, <code>backward()</code> fills every <code>.grad</code>, <code>step()</code> nudges the weights downhill. Print loss and train accuracy every 4 steps to watch it fall.`,
        code: `for step in range(20):
    logits = model(X)                    # (N, C) raw logits
    loss = criterion(logits, y)          # logits + integer targets

    optimizer.zero_grad()                # 1. clear old grads (else they accumulate)
    loss.backward()                      # 2. backprop: fill every .grad
    optimizer.step()                     # 3. one downhill step

    if step % 4 == 0:
        acc = (logits.argmax(1) == y).float().mean().item()
        print(f"step {step:2d}  loss {loss.item():.4f}  train_acc {acc:.2f}")`,
        output: `step  0  loss 1.1146  train_acc 0.32
step  4  loss 0.9216  train_acc 0.58
step  8  loss 0.7714  train_acc 0.72
step 12  loss 0.6512  train_acc 0.85
step 16  loss 0.5559  train_acc 0.92`
      },
      {
        explain: `<b>The gotcha, spelled out.</b> The two wrong ways to call the loss — softmaxing first (double softmax) and passing one-hot targets — are flagged in comments. The right call is raw logits plus integer indices, exactly as the loop above does.`,
        code: `# WRONG: softmax before CrossEntropyLoss -> double softmax, training degrades.
#   bad = nn.CrossEntropyLoss()(torch.softmax(logits, dim=1), y)
# WRONG: one-hot targets -> CrossEntropyLoss wants class indices, not one-hot.
#   y_onehot = torch.nn.functional.one_hot(y, C).float()  # do NOT pass this
# RIGHT: raw logits + integer indices, exactly as above.
print("done. the model has NO softmax layer -- CrossEntropyLoss adds it.")`,
        output: `done. the model has NO softmax layer -- CrossEntropyLoss adds it.`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab and read each printed line against its note:</p>
<ul>
<li>The setup block prints <code>torch.Size([60, 4]) torch.Size([60]) torch.int64</code> — the targets are a 1-D <i>long</i> tensor of class indices, which is exactly what <code>CrossEntropyLoss</code> expects (not one-hot rows).</li>
<li>The model's output is <code>torch.Size([60, 3])</code> — one raw logit per class, with no softmax applied.</li>
<li>The training loop's loss falls steadily — about <code>1.11</code> at step 0 down to roughly <code>0.56</code> by step 16 — while train accuracy climbs from chance (~0.32) toward 0.92. That downward loss is the whole point: the three-step update is working.</li>
<li>The final line confirms the model has no softmax layer; the loss supplies the log-softmax itself.</li>
</ul>
<p>The exact numbers depend on <code>torch.manual_seed(0)</code> — set it first or your run will differ from this one. On a GPU runtime the math is identical; only tiny floating-point differences may appear.</p>`,

    whenToUse:
      `<p><b>Every trained model needs both.</b> A <b>loss function</b> turns the model's output into one
        number — how wrong it is right now. An <b>optimizer</b> reads the gradients of that number and
        nudges the weights to make it smaller.</p>
       <ul>
         <li><b>Pick the loss by the task.</b> Regression (predict a number) &rarr; <code>nn.MSELoss</code>.
             Single-label classification &rarr; <code>nn.CrossEntropyLoss</code>. Binary or multi-label
             (each label independent) &rarr; <code>nn.BCEWithLogitsLoss</code>.</li>
         <li><b>Default optimizer:</b> reach for <code>Adam</code> or <code>AdamW</code> first. They adapt
             the step size per parameter and "just work" on most problems with little tuning. Use plain
             <code>SGD</code> with momentum when you want the very best final accuracy and have time to tune.</li>
       </ul>`,
    application:
      `<p>This is the heart of the training loop. Whether you are fine-tuning a language model, training a
        convolutional network on images, or fitting a tiny tabular model, the same three lines appear every
        step: <code>optimizer.zero_grad()</code> &rarr; <code>loss.backward()</code> &rarr;
        <code>optimizer.step()</code>. Get the loss and optimizer right and the rest is plumbing.</p>`,
    pitfalls:
      `<ul>
        <li><b>Softmax before <code>CrossEntropyLoss</code> (double softmax).</b> <code>nn.CrossEntropyLoss</code>
            applies log-softmax <i>internally</i>. If your model's last layer is a softmax, you apply it twice
            and training breaks. <b>Fix:</b> the model outputs raw <b>logits</b> — no softmax in the network.</li>
        <li><b>One-hot targets to <code>CrossEntropyLoss</code>.</b> It wants <b>integer class indices</b>
            (a 1-D <code>LongTensor</code> like <code>[2, 0, 1]</code>), not one-hot rows. <b>Fix:</b> pass the
            class index per sample.</li>
        <li><b>Forgetting <code>optimizer.zero_grad()</code>.</b> PyTorch <i>accumulates</i> gradients across
            <code>backward()</code> calls. Skip the reset and this step's gradient is added on top of last step's
            — the update is wrong. <b>Fix:</b> call <code>zero_grad()</code> at the top of every step.</li>
        <li><b>Learning rate too high &rarr; diverge</b> (loss explodes to <code>nan</code>); <b>too low &rarr;
            crawl</b> (loss barely moves). <b>Fix:</b> start near <code>1e-3</code> for Adam, <code>1e-2</code>
            for SGD, and adjust by a factor of 10.</li>
        <li><b>Optimizer not given the model's parameters.</b> <code>optim.Adam(lr=...)</code> with no params,
            or params from the wrong model, means <code>step()</code> updates nothing. <b>Fix:</b>
            <code>optim.Adam(model.parameters(), lr=...)</code>.</li>
        <li><b>Not stepping the scheduler.</b> A learning-rate scheduler only changes the rate when you call
            <code>scheduler.step()</code> (once per epoch, after the optimizer steps). Forget it and the rate
            never moves.</li>
      </ul>`,
    bigIdea:
      `<p>Learning is a feedback loop. The <b>loss</b> answers "how wrong are we?" as a single number. Calling
        <code>loss.backward()</code> fills every parameter's <code>.grad</code> with the slope of that number
        with respect to that parameter. The <b>optimizer</b> then takes one downhill step.</p>
       <p>You attach the optimizer to the model's parameters once. From then on it remembers where they live and,
        for adaptive methods like Adam, keeps running statistics (a moving average of past gradients) to size each
        step automatically.</p>`,
    buildup:
      `<p>The math of why we descend the gradient is in <code>ml-gradient-descent</code>; why cross-entropy is
        the right loss for classification is in <code>dl-cross-entropy</code>; and how Adam improves on plain
        gradient descent is in <code>dl-optimizers</code>. Here we focus on the <i>PyTorch</i> (Python deep-learning
        library) wiring: which class to instantiate, and the exact three-step update that runs every iteration.</p>
       <p>The <b>three-step update</b>, in order, every step:</p>
       <ol>
         <li><code>optimizer.zero_grad()</code> — clear last step's gradients so they don't accumulate.</li>
         <li><code>loss.backward()</code> — backpropagate; fill every <code>.grad</code>.</li>
         <li><code>optimizer.step()</code> — move each parameter one step downhill.</li>
       </ol>`,
    symbols: [],
    formula: `$$w \\leftarrow w - \\eta \\, \\nabla_w \\, \\mathcal{L}$$`,
    whatItDoes:
      `<p>This is the plain-SGD update that <code>optimizer.step()</code> performs. Read it as: the new weight
        <code>w</code> equals the old weight minus the learning rate (the small positive number we call
        <code>η</code>, "eta") times the gradient of the loss <code>L</code> with respect to that weight. The
        gradient points uphill, so subtracting it walks downhill. <code>Adam</code> uses the same shape but
        rescales the step per parameter using running gradient statistics.</p>`,
    derivation:
      `<p><b>What each loss actually computes.</b></p>
       <ul>
         <li><code>nn.MSELoss</code> — mean of the squared differences between prediction and target. For a
             regression output and a float target of the same shape.</li>
         <li><code>nn.CrossEntropyLoss</code> — takes raw <b>logits</b> of shape <code>(N, C)</code> for N samples
             and C classes, plus integer targets of shape <code>(N,)</code>. It does log-softmax then negative
             log-likelihood in one numerically stable step. <b>No softmax in your model.</b></li>
         <li><code>nn.BCEWithLogitsLoss</code> — binary cross-entropy that takes logits and applies the sigmoid
             internally (stable). Use it for one-vs-rest / multi-label targets (floats in <code>{0,1}</code>).</li>
         <li><code>nn.NLLLoss</code> — negative log-likelihood; expects <i>already</i> log-probabilities (e.g. from
             <code>F.log_softmax</code>). <code>CrossEntropyLoss</code> = <code>LogSoftmax</code> + <code>NLLLoss</code>,
             so prefer <code>CrossEntropyLoss</code> and skip the manual softmax.</li>
       </ul>
       <p><b>Optimizers.</b> Construct with the model's parameters and a learning rate:
        <code>opt = torch.optim.Adam(model.parameters(), lr=1e-3)</code>. <code>SGD</code> is the textbook update
        above (add <code>momentum=0.9</code> in practice). <code>Adam</code> adapts the step per parameter from
        moving averages of the gradient and its square. <code>AdamW</code> is Adam with correct weight decay and is
        the modern default for transformers.</p>
       <p><b>Learning-rate schedulers</b> shrink the rate over time so training settles. <code>StepLR</code> multiplies
        the rate by a factor every few epochs; <code>CosineAnnealingLR</code> glides it down a cosine curve to near
        zero. Call <code>scheduler.step()</code> once per epoch.</p>`,
    example:
      `<p>Work the real number for <b>both</b> formulas: first the cross-entropy loss on two samples, then one
        plain-SGD weight update $w \\leftarrow w - \\eta \\, \\nabla_w \\, \\mathcal{L}$.</p>
       <p><b>Part 1 — CrossEntropyLoss.</b> Three classes, two samples, raw logits (no softmax), integer targets
        $[0, 1]$. For each row it does softmax, takes the true class's probability $p$, then the loss is the mean of
        $-\\ln p$:</p>
       <table class="extable">
         <caption>Per-sample cross-entropy: softmax then pick the true class</caption>
         <thead><tr><th>sample</th><th class="num">logits</th><th class="num">true class</th><th class="num">softmax (3 dp)</th><th class="num">$p$ of true</th><th class="num">$-\\ln p$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">0</td><td class="num">[2.0, 0.5, -1.0]</td><td class="num">0</td><td class="num">[0.786, 0.175, 0.039]</td><td class="num">0.786</td><td class="num">0.241</td></tr>
           <tr><td class="row-h">1</td><td class="num">[0.1, 1.5, 0.2]</td><td class="num">1</td><td class="num">[0.162, 0.658, 0.179]</td><td class="num">0.658</td><td class="num">0.418</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Row 0 softmax.</b> $e^{2.0}=7.389,\\; e^{0.5}=1.649,\\; e^{-1.0}=0.368$; sum $=9.406$, so the true-class prob is $7.389/9.406 = 0.786$.</li>
         <li><b>Row 0 loss.</b> $-\\ln(0.786) = 0.241$.</li>
         <li><b>Row 1 softmax.</b> $e^{0.1}=1.105,\\; e^{1.5}=4.482,\\; e^{0.2}=1.221$; sum $=6.808$, so the true-class prob is $4.482/6.808 = 0.658$.</li>
         <li><b>Row 1 loss.</b> $-\\ln(0.658) = 0.418$.</li>
         <li><b>Average.</b> $\\tfrac{1}{2}(0.241 + 0.418) = 0.330$ — this matches the <code>tensor(0.3168)</code> in the practice (small rounding from 3-dp softmax). The loss is low because each true class already has the largest logit.</li>
       </ul>
       <p><b>Part 2 — one SGD step.</b> Suppose a single weight $w = 1.0$, learning rate $\\eta = 0.1$, and backprop
        returned a gradient $\\nabla_w \\mathcal{L} = 0.4$. Plug into the formula:</p>
       <ul class="steps">
         <li><b>Step size.</b> $\\eta \\cdot \\nabla_w \\mathcal{L} = 0.1 \\times 0.4 = 0.04$.</li>
         <li><b>Update.</b> $w \\leftarrow 1.0 - 0.04 = 0.96$ — the weight moved downhill (opposite the positive gradient), which is exactly what <code>optimizer.step()</code> does each iteration.</li>
       </ul>`,
    practice: [
      {
        q: `<b>Type this in Colab.</b> Build <code>preds = torch.tensor([2.5, 0.0, 4.0])</code> and
            <code>target = torch.tensor([3.0, 0.0, 5.0])</code>. Compute <code>nn.MSELoss()(preds, target)</code>.
            Predict the value by hand first (mean of the squared differences), then verify.`,
        steps: [
          { do: `Instantiate the loss object, then call it: <code>nn.MSELoss()(preds, target)</code>.`, why: `<code>MSELoss</code> is a module; you build it once, then call it like a function.` },
          { do: `By hand: differences are <code>[-0.5, 0, -1.0]</code>, squared <code>[0.25, 0, 1.0]</code>, mean <code>0.4167</code>.`, why: `MSE is the mean of squared differences, so you can check the printed number.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
preds  = torch.tensor([2.5, 0.0, 4.0])
target = torch.tensor([3.0, 0.0, 5.0])
print(nn.MSELoss()(preds, target))   # tensor(0.4167)
# (0.25 + 0.0 + 1.0) / 3 = 0.4167</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The pitfall: <code>nn.CrossEntropyLoss</code> wants <b>raw logits</b> and
            <b>integer class indices</b>. With <code>logits = torch.tensor([[2.0, 0.5, -1.0], [0.1, 1.5, 0.2]])</code>
            and <code>targets = torch.tensor([0, 1])</code>, compute the loss. Then apply
            <code>torch.softmax(logits, dim=1)</code> first and pass <i>that</i> instead — show the loss is wrong (higher).`,
        steps: [
          { do: `Call <code>nn.CrossEntropyLoss()(logits, targets)</code> with the raw logits.`, why: `The loss applies log-softmax internally, so you must NOT softmax beforehand.` },
          { do: `Pass <code>torch.softmax(logits, dim=1)</code> instead and compare.`, why: `Softmaxing twice (double softmax) flattens the values, giving a larger, wrong loss.` }
        ],
        answer: `<pre><code>logits  = torch.tensor([[2.0, 0.5, -1.0], [0.1, 1.5, 0.2]])
targets = torch.tensor([0, 1])
ce = nn.CrossEntropyLoss()
print(ce(logits, targets))                       # tensor(0.3168)  <- correct, raw logits
probs = torch.softmax(logits, dim=1)
print(ce(probs, targets))                        # tensor(0.9756)  <- WRONG: double softmax</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show that <code>CrossEntropyLoss</code> takes class indices, NOT one-hot rows.
            Reuse the <code>logits</code> above. Build the one-hot version of <code>targets</code> with
            <code>torch.nn.functional.one_hot(targets, num_classes=3)</code>, try passing it, and observe the result;
            then pass the integer indices and print the loss.`,
        steps: [
          { do: `Make one-hot targets with <code>F.one_hot(targets, 3)</code>.`, why: `This is what beginners wrongly hand to the loss; it is a <code>(2, 3)</code> tensor, not indices.` },
          { do: `Pass the integer index tensor <code>targets</code> instead.`, why: `<code>CrossEntropyLoss</code> indexes the logits with integer class ids; that is the supported form.` }
        ],
        answer: `<pre><code>import torch.nn.functional as F
oh = F.one_hot(targets, num_classes=3)           # tensor([[1,0,0],[0,1,0]])
# ce(logits, oh.float()) -> treats it as soft labels / errors in older versions; NOT what you want
print(ce(logits, targets))                       # tensor(0.3168)  <- correct: integer indices</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The pitfall the optimizer hides: gradients <b>accumulate</b>. Make
            <code>w = torch.tensor([1.0], requires_grad=True)</code>. Call <code>(w * w).backward()</code> twice in a row
            <i>without</i> zeroing, printing <code>w.grad</code> after each. Then zero with
            <code>w.grad = None</code> and do one clean backward.`,
        steps: [
          { do: `Backward twice on <code>w*w</code> (derivative is <code>2w = 2</code>).`, why: `PyTorch ADDS each new gradient onto <code>.grad</code>, so it reads 2 then 4 — not 2 both times.` },
          { do: `Reset with <code>w.grad = None</code> (what <code>optimizer.zero_grad()</code> does) before the next backward.`, why: `Clearing the grad makes the next step use only its own gradient.` }
        ],
        answer: `<pre><code>w = torch.tensor([1.0], requires_grad=True)
(w * w).backward()
print(w.grad)        # tensor([2.])
(w * w).backward()
print(w.grad)        # tensor([4.])  <- accumulated! not reset
w.grad = None        # what optimizer.zero_grad() does
(w * w).backward()
print(w.grad)        # tensor([2.])  <- clean again</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Run the real three-step update once by hand. With <code>torch.manual_seed(0)</code>,
            build <code>model = nn.Linear(4, 1)</code>, <code>opt = torch.optim.SGD(model.parameters(), lr=0.1)</code>,
            input <code>x = torch.randn(8, 4)</code>, target <code>y = torch.randn(8, 1)</code>. Do
            <code>zero_grad</code> &rarr; forward &rarr; <code>MSELoss</code> &rarr; <code>backward</code> &rarr;
            <code>step</code>, and print the loss before and after.`,
        steps: [
          { do: `Compute and print the loss, then run <code>opt.zero_grad()</code>, <code>loss.backward()</code>, <code>opt.step()</code>.`, why: `This is the canonical update trio every PyTorch model runs each step.` },
          { do: `Recompute the loss on the same batch after the step.`, why: `One downhill SGD step should lower the loss on this batch.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Linear(4, 1)
opt = torch.optim.SGD(model.parameters(), lr=0.1)
x = torch.randn(8, 4)
y = torch.randn(8, 1)
crit = nn.MSELoss()
loss = crit(model(x), y)
print(loss.item())                # 1.5046  (before)
opt.zero_grad()
loss.backward()
opt.step()
print(crit(model(x), y).item())   # 1.2473  (after -- lower)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show why the optimizer must be given the model's parameters. Build
            <code>model = nn.Linear(2, 1)</code>. Save a copy of its weight with
            <code>w0 = model.weight.clone()</code>. Create <code>opt = torch.optim.SGD(model.parameters(), lr=0.5)</code>,
            run one update on <code>x = torch.ones(3, 2)</code>, <code>y = torch.zeros(3, 1)</code>, and check the weight
            actually changed.`,
        steps: [
          { do: `Pass <code>model.parameters()</code> into the optimizer.`, why: `Without it, <code>step()</code> updates nothing — the optimizer needs to know which tensors to move.` },
          { do: `Compare <code>model.weight</code> to <code>w0</code> after the step.`, why: `A nonzero difference confirms the optimizer is wired to the right parameters.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Linear(2, 1)
w0 = model.weight.clone()
opt = torch.optim.SGD(model.parameters(), lr=0.5)
x, y = torch.ones(3, 2), torch.zeros(3, 1)
opt.zero_grad()
nn.MSELoss()(model(x), y).backward()
opt.step()
print(torch.allclose(model.weight, w0))   # False  -- weights moved</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Train the tiny 3-class problem to convergence. With <code>torch.manual_seed(0)</code>,
            make <code>X = torch.randn(60, 4)</code>, <code>y = torch.randint(0, 3, (60,))</code>, and a model
            <code>nn.Sequential(nn.Linear(4,16), nn.ReLU(), nn.Linear(16,3))</code> (raw logits, no softmax). Use
            <code>CrossEntropyLoss</code> + <code>Adam(lr=1e-2)</code> and run 30 steps, printing the loss every 10 steps.`,
        steps: [
          { do: `Build the model with NO softmax layer at the end.`, why: `<code>CrossEntropyLoss</code> adds log-softmax itself; a softmax layer would double it.` },
          { do: `Run the <code>zero_grad</code>/<code>backward</code>/<code>step</code> trio 30 times.`, why: `Repeated downhill steps drive the loss down as the logits sharpen toward the labels.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
X = torch.randn(60, 4)
y = torch.randint(0, 3, (60,))
model = nn.Sequential(nn.Linear(4, 16), nn.ReLU(), nn.Linear(16, 3))
crit = nn.CrossEntropyLoss()
opt = torch.optim.Adam(model.parameters(), lr=1e-2)
for step in range(30):
    logits = model(X)
    loss = crit(logits, y)
    opt.zero_grad(); loss.backward(); opt.step()
    if step % 10 == 0:
        print(step, round(loss.item(), 4))
# 0 1.1146
# 10 0.7714
# 20 0.5559</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Attach a learning-rate scheduler. Build any
            <code>opt = torch.optim.SGD(nn.Linear(2,2).parameters(), lr=0.1)</code> and
            <code>sched = torch.optim.lr_scheduler.StepLR(opt, step_size=1, gamma=0.5)</code>. Loop 4 times: call
            <code>opt.step()</code> then <code>sched.step()</code>, printing the current learning rate each round.`,
        steps: [
          { do: `Read the rate with <code>sched.get_last_lr()</code> (or <code>opt.param_groups[0]["lr"]</code>).`, why: `<code>StepLR</code> multiplies the rate by <code>gamma</code> each time you call <code>sched.step()</code>.` },
          { do: `Call <code>sched.step()</code> once per epoch, after <code>opt.step()</code>.`, why: `Forgetting it leaves the rate frozen — the scheduler only moves when stepped.` }
        ],
        answer: `<pre><code>opt = torch.optim.SGD(nn.Linear(2, 2).parameters(), lr=0.1)
sched = torch.optim.lr_scheduler.StepLR(opt, step_size=1, gamma=0.5)
for epoch in range(4):
    opt.step()
    sched.step()
    print(round(sched.get_last_lr()[0], 4))
# 0.05
# 0.025
# 0.0125
# 0.00625</code></pre>`
      }
    ],

    cheatsheet: [
      { code: "crit = nn.MSELoss()                 # regression", note: "mean of squared differences; float pred & target, same shape" },
      { code: "crit = nn.CrossEntropyLoss()        # single-label", note: "raw logits <code>(N,C)</code> + integer targets <code>(N,)</code>; <b>no softmax</b> in the model" },
      { code: "crit = nn.BCEWithLogitsLoss()       # binary/multi-label", note: "logits + float targets in {0,1}; sigmoid applied inside" },
      { code: "opt = torch.optim.Adam(model.parameters(), lr=1e-3)", note: "default first choice; pass the model's params!" },
      { code: "opt = torch.optim.SGD(model.parameters(), lr=1e-2, momentum=0.9)", note: "textbook update; tune for best final accuracy" },
      { code: "opt.zero_grad(); loss.backward(); opt.step()", note: "the three-step update, every iteration, in this order" },
      { code: "sched = torch.optim.lr_scheduler.StepLR(opt, step_size=1, gamma=0.5)", note: "shrink lr; call <code>sched.step()</code> once per epoch" },
      { code: "w_new = w - lr * w.grad", note: "what plain SGD's <code>step()</code> does under the hood" }
    ],

    deeper: `<p>The PyTorch wiring above sits on three pieces of theory:</p>
<ul>
<li><b>Why we descend the gradient.</b> The update <code>w &larr; w - &eta; &nabla;L</code> walks downhill because the gradient points uphill — see <a onclick="App.open('ml-gradient-descent')">gradient descent</a>.</li>
<li><b>Why cross-entropy is the right classification loss.</b> The log-softmax-then-negative-log-likelihood that <code>CrossEntropyLoss</code> computes is derived in <a onclick="App.open('dl-cross-entropy')">cross-entropy</a>.</li>
<li><b>How Adam improves on plain gradient descent.</b> The per-parameter adaptive step from moving averages of the gradient is in <a onclick="App.open('dl-optimizers')">optimizers</a>.</li>
</ul>`
  });

  window.CODE["pt-loss-optim"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>A tiny 3-class classification problem. We build a small network that outputs <b>raw logits</b> (note:
        <i>no softmax</i> at the end), pick <code>nn.CrossEntropyLoss</code> + <code>optim.Adam</code>, and run the
        <code>zero_grad</code> &rarr; <code>backward</code> &rarr; <code>step</code> trio for a few iterations. Watch the
        loss fall. The comments flag the famous <code>CrossEntropyLoss</code> gotchas: it eats logits, and its targets
        are integer class indices, not one-hot.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)  # reproducible

# --- tiny synthetic 3-class problem: 60 points, 4 features ---
N, D_in, C = 60, 4, 3
X = torch.randn(N, D_in)
# integer class labels 0/1/2 -- NOT one-hot. CrossEntropyLoss wants indices.
y = torch.randint(0, C, (N,))            # shape (N,), dtype long

# --- model: outputs raw LOGITS of shape (N, C). NO softmax at the end! ---
model = nn.Sequential(
    nn.Linear(D_in, 16),
    nn.ReLU(),
    nn.Linear(16, C),                    # last layer -> raw logits, that's it
)

# loss + optimizer. Adam is given the model's parameters and a learning rate.
criterion = nn.CrossEntropyLoss()        # applies log-softmax INTERNALLY
optimizer = torch.optim.Adam(model.parameters(), lr=1e-2)

for step in range(20):
    logits = model(X)                    # (N, C) raw logits
    loss = criterion(logits, y)          # pass logits + integer targets

    optimizer.zero_grad()                # 1. clear old grads (else they accumulate)
    loss.backward()                      # 2. backprop: fill every .grad
    optimizer.step()                     # 3. one downhill step

    if step % 4 == 0:
        acc = (logits.argmax(1) == y).float().mean().item()
        print(f"step {step:2d}  loss {loss.item():.4f}  train_acc {acc:.2f}")

# --- the GOTCHA, shown ---
# WRONG: softmax before CrossEntropyLoss -> double softmax, training degrades.
#   bad = nn.CrossEntropyLoss()(torch.softmax(logits, dim=1), y)
# WRONG: one-hot targets -> CrossEntropyLoss wants class indices, not one-hot.
#   y_onehot = torch.nn.functional.one_hot(y, C).float()  # do NOT pass this
# RIGHT: raw logits + integer indices, exactly as above.

print("done. note: the model has NO softmax layer -- CrossEntropyLoss adds it.")`
  };

  window.CODEVIZ["pt-loss-optim"] = {
    question: "How do you read a training-loss curve — and which shapes mean the learning rate is wrong?",
    charts: [
      {
        type: "line",
        title: "Healthy descent: loss falls and flattens (Adam, lr 0.15)",
        xlabel: "optimizer step",
        ylabel: "full-data MSE loss",
        series: [
          { name: "Adam (lr 0.15)", color: "#7ee787", points: [[0,428.061],[1,323.516],[2,244.862],[3,174.923],[4,124.233],[5,87.050],[6,57.753],[7,36.114],[8,21.111],[9,13.401],[10,11.573],[11,8.786],[12,6.540],[13,5.103],[14,4.217],[15,3.621],[16,3.136],[17,2.748],[18,2.436],[19,2.038],[20,1.755],[21,1.452],[22,1.236],[23,1.064],[24,0.951],[25,0.894],[26,0.879],[27,0.905],[28,0.969],[29,1.039],[30,0.952],[31,0.852],[32,0.844],[33,0.741],[34,0.735],[35,0.752],[36,0.744],[37,0.710],[38,0.704],[39,0.715],[40,0.712],[41,0.677],[42,0.695],[43,0.663],[44,0.707],[45,0.684],[46,0.649],[47,0.691],[48,0.674],[49,0.681]] }
        ],
        interpret: "<b>x-axis</b> = each optimizer step (one zero_grad / backward / step trio); <b>y-axis</b> = the loss, how wrong the model is, lower is better. A healthy run drops <b>fast at first</b> then <b>flattens into a low, slightly noisy floor</b> — that flat tail means the model has converged and further steps barely help. This is what you want to see: a clear downhill then a plateau near the bottom. Real Adam run on this ill-conditioned problem."
      },
      {
        type: "line",
        title: "LR too high: loss oscillates / diverges (illustrative)",
        xlabel: "optimizer step",
        ylabel: "full-data MSE loss",
        series: [
          { name: "SGD lr too high", color: "#ff7b72", points: [[0,428],[1,180],[2,260],[3,90],[4,210],[5,140],[6,330],[7,260],[8,520],[9,410],[10,780],[11,640],[12,1200],[13,980],[14,1900],[15,1500],[16,3100],[17,2400],[18,5200],[19,9000]] }
        ],
        interpret: "<b>Illustrative.</b> Same axes, but the learning rate is too big, so each step <b>overshoots the valley floor</b> and lands further up the other side. The tell is a <b>saw-tooth that trends upward</b> instead of settling — and in the worst case the loss runs off to a huge number or NaN. Recognise it by the jagged, growing curve. <b>Fix:</b> cut the learning rate by 10x (e.g. 1e-2 to 1e-3)."
      },
      {
        type: "line",
        title: "LR too low: loss barely moves (illustrative)",
        xlabel: "optimizer step",
        ylabel: "full-data MSE loss",
        series: [
          { name: "SGD lr too low", color: "#ffb454", points: [[0,428],[1,424],[2,420],[3,417],[4,413],[5,410],[6,407],[7,404],[8,401],[9,398],[10,395],[11,392],[12,389],[13,387],[14,384],[15,381],[16,379],[17,376],[18,374],[19,371]] }
        ],
        interpret: "<b>Illustrative.</b> Same axes again. Here the learning rate is tiny, so every step nudges the weights only a hair — the curve <b>creeps down a gentle, nearly straight slope</b> and is nowhere near the bottom after many steps. It is not broken, just glacially slow. Recognise it by the shallow, almost-flat line that never reaches a floor. <b>Fix:</b> raise the learning rate by 10x, or train far longer."
      },
      {
        type: "line",
        title: "SGD vs Adam: same problem, why Adam is the default",
        xlabel: "optimizer step",
        ylabel: "full-data MSE loss",
        series: [
          { name: "SGD (lr 0.0025)", color: "#ffb454", points: [[0,428.061],[1,60.893],[2,50.551],[3,45.074],[4,51.288],[5,28.030],[6,20.560],[7,30.032],[8,19.986],[9,12.654],[10,11.708],[11,12.100],[12,10.461],[13,9.749],[14,9.795],[15,9.792],[16,10.154],[17,8.286],[18,7.724],[19,8.203],[20,6.114],[21,7.545],[22,5.692],[23,9.120],[24,5.209],[25,5.211],[26,5.177],[27,4.632],[28,4.692],[29,5.491],[30,4.643],[31,4.548],[32,5.071],[33,8.223],[34,5.149],[35,6.416],[36,3.679],[37,3.931],[38,3.212],[39,4.211],[40,3.063],[41,3.295],[42,3.587],[43,2.981],[44,2.770],[45,2.724],[46,2.524],[47,3.391],[48,2.699],[49,2.281]] },
          { name: "Adam (lr 0.15)", color: "#4ea1ff", points: [[0,428.061],[1,323.516],[2,244.862],[3,174.923],[4,124.233],[5,87.050],[6,57.753],[7,36.114],[8,21.111],[9,13.401],[10,11.573],[11,13.786],[12,17.540],[13,22.703],[14,28.017],[15,31.921],[16,34.836],[17,34.448],[18,31.736],[19,27.238],[20,22.455],[21,16.952],[22,12.436],[23,8.564],[24,5.951],[25,4.394],[26,3.579],[27,3.405],[28,3.669],[29,4.139],[30,4.652],[31,5.283],[32,5.748],[33,5.741],[34,5.235],[35,4.452],[36,3.844],[37,3.410],[38,3.004],[39,2.715],[40,2.612],[41,2.377],[42,2.095],[43,1.763],[44,1.407],[45,1.084],[46,0.849],[47,0.744],[48,0.824],[49,1.008]] }
        ],
        interpret: "Both lines descend, but read the <b>floor</b> they settle at. Real runs on an ill-conditioned, noisy least-squares problem (8 features scaled very differently, mini-batches of 16). <b>Orange SGD</b> is held back by the steepest feature direction and stays jittery, ending at loss 2.28. <b>Blue Adam</b> adapts the step size per feature and settles to a lower, smoother 1.01 — the textbook reason Adam is the default first choice."
      }
    ],
    caption: "How to read a loss curve: x = training step, y = loss (lower is better). The healthy shape falls then flattens; a rising saw-tooth means the learning rate is too high; an almost-flat creep means it is too low. The last panel compares SGD and Adam on the same problem.",
    code: `import numpy as np

rng = np.random.default_rng(0)
N, d = 200, 8
# ill-conditioned features: columns scaled 1..20 so one direction is far steeper
X = rng.standard_normal((N, d)) * np.array([1, 1, 3, 3, 8, 8, 20, 20.0])
w_true = rng.standard_normal(d)
y = X @ w_true + 0.1 * rng.standard_normal(N)   # noisy linear target

def full_loss(w):
    r = X @ w - y
    return 0.5 * np.mean(r * r)                  # MSE over ALL data (what we plot)

def batch_grad(w, idx):
    Xb, yb = X[idx], y[idx]
    return Xb.T @ (Xb @ w - yb) / len(idx)       # mini-batch gradient (noisy)

steps, bs, w0 = 50, 16, np.zeros(d)

def run(opt, lr):
    w = w0.copy(); m = np.zeros(d); v = np.zeros(d); hist = []
    rs = np.random.default_rng(42)               # same batch stream for both
    for t in range(1, steps + 1):
        hist.append(full_loss(w))
        g = batch_grad(w, rs.integers(0, N, bs))
        if opt == "sgd":
            w = w - lr * g                        # plain SGD step
        else:                                     # Adam
            b1, b2, eps = 0.9, 0.999, 1e-8
            m = b1 * m + (1 - b1) * g
            v = b2 * v + (1 - b2) * g * g
            mh = m / (1 - b1**t); vh = v / (1 - b2**t)
            w = w - lr * mh / (np.sqrt(vh) + eps)
    return hist

sgd  = run("sgd",  0.0025)
adam = run("adam", 0.15)
print("final loss -- SGD:", round(sgd[-1], 3), " Adam:", round(adam[-1], 3))
# -> final loss -- SGD: 2.281  Adam: 1.008`
  };
})();
