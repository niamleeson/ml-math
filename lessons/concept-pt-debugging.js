/* PyTorch (a complete course) — "Debugging PyTorch: the errors everyone hits, and a method".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-debugging". */
(function () {
  window.LESSONS.push({
    id: "pt-debugging",
    title: "Debugging PyTorch: the errors everyone hits, and a method to find them",
    tagline: "Most of your PyTorch time is debugging — so learn the greatest-hits errors, their fixes, and one method: overfit a single batch first.",
    module: "PyTorch (a complete course)",
    prereqs: ["pt-tensor-ops", "pt-autograd", "pt-nn-module", "dl-cross-entropy", "dl-optimizers"],

    whenToUse:
      `<p><b>Constantly.</b> Writing a PyTorch model is the easy part; getting it to actually train is where the time
       goes. The same handful of errors hit everyone &mdash; a shape that does not line up, a tensor on the wrong
       device, a loss that turns into <code>NaN</code> (Not a Number), or a loss that simply refuses to fall. This
       lesson is the field guide: for each one, the <b>symptom</b> you see, the <b>cause</b> underneath, and the
       <b>fix</b>.</p>
       <ul>
         <li><b>Reach for the overfit-one-batch test</b> before <i>every</i> real training run. Take one small batch,
         train on it alone, and check the loss can be driven to nearly zero. If it can, your model, loss, and
         optimizer are wired correctly. If it cannot, the bug is in the model or loss &mdash; stop tuning the learning
         rate and go fix the wiring.</li>
         <li><b>Reach for shape/dtype/device prints</b> the instant you hit a <code>RuntimeError</code>. Most PyTorch
         errors are answered by printing <code>x.shape</code>, <code>x.dtype</code>, and <code>x.device</code> at the
         line that failed.</li>
         <li><b>Reach for <code>torch.autograd.set_detect_anomaly(True)</code></b> when a <code>NaN</code> or an
         in-place error appears and you cannot see where it came from &mdash; it points to the exact operation.</li>
       </ul>
       <p>The skill is not memorizing every message; it is having a <b>routine</b>: set a seed, overfit one batch,
       print shapes and devices, check gradient norms. Work the routine and the bug usually announces itself.</p>`,

    application:
      `<p>This is the daily reality of building any model in PyTorch.</p>
       <ul>
         <li><b>New architecture, first run.</b> The shape errors come out immediately; printing shapes through the
         forward pass finds the bad dimension in seconds.</li>
         <li><b>Moving to a Graphics Processing Unit (GPU).</b> The device-mismatch error is almost guaranteed on the
         first GPU run; the fix is moving <i>both</i> model and data with <code>.to(device)</code>.</li>
         <li><b>Loss not improving.</b> Before blaming the model, you rule out the cheap causes: a missing
         <code>optimizer.zero_grad()</code>, a learning rate that is too low, the wrong loss function, misaligned
         labels, or the model left in <code>eval()</code> mode.</li>
         <li><b>Unstable training.</b> When the loss spikes to <code>NaN</code>, you clip gradients, lower the learning
         rate, and check the inputs for bad values &mdash; the standard triage.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Shape mismatch &mdash; <code>mat1 and mat2 shapes cannot be multiplied (BxN and MxK)</code>.</b>
         <i>Cause:</i> the feature dimension going into an <code>nn.Linear</code> does not match its
         <code>in_features</code> &mdash; very often you forgot to <code>flatten</code> a convolutional feature map, or
         used the wrong flatten size. <i>Fix:</i> print the tensor's shape right before the failing layer, then set
         <code>in_features</code> (or your <code>view</code>/<code>reshape</code>) to match. Matrix multiply needs the
         inner dimensions equal: <code>(B, N)</code> times <code>(N, K)</code>.</li>
         <li><b>Device mismatch &mdash; <code>Expected all tensors to be on the same device, but found at least two
         devices, cuda:0 and cpu</code>.</b> <i>Cause:</i> you moved one of the model or the data to the GPU but not the
         other. <i>Fix:</i> pick one <code>device</code> up front and send <i>both</i> &mdash;
         <code>model.to(device)</code> and <code>x = x.to(device)</code> (and the targets) for every batch.</li>
         <li><b>Loss is <code>NaN</code>.</b> <i>Cause:</i> exploding gradients, a <code>log(0)</code> (e.g. taking the
         log of a probability that hit exactly 0), a division by zero, or a learning rate so high the weights blow up.
         <i>Fix:</i> lower the learning rate, clip gradients with
         <code>torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm)</code>, check inputs for
         <code>NaN</code>/<code>inf</code> with <code>torch.isnan(x).any()</code>, and turn on
         <code>torch.autograd.set_detect_anomaly(True)</code> to find the operation that produced it.</li>
         <li><b>Loss is NOT decreasing.</b> <i>Cause (in order of how often):</i> you forgot
         <code>optimizer.zero_grad()</code> so gradients accumulate; the learning rate is too low; you are minimizing
         the wrong loss; the labels are misaligned with the inputs; or the model is stuck in <code>eval()</code> mode
         (so dropout/batchnorm behave wrong) or you forgot <code>loss.backward()</code> / <code>optimizer.step()</code>
         entirely. <i>Fix:</i> overfit one batch &mdash; if even that will not drop to ~0, the bug is in the wiring,
         not the data.</li>
         <li><b><code>nn.CrossEntropyLoss</code> errors.</b> <i>Cause:</i> it expects <b>raw logits</b> (do
         <b>not</b> apply <code>softmax</code> yourself) and <b>integer class indices</b> of shape <code>(N,)</code>,
         not one-hot vectors and not floats. Passing already-softmaxed probabilities, one-hot targets, or
         <code>float</code> labels gives wrong losses or a dtype error. <i>Fix:</i> feed
         <code>logits</code> of shape <code>(N, C)</code> and <code>targets</code> of dtype <code>long</code> with
         values in <code>[0, C-1]</code>.</li>
         <li><b>In-place op breaks autograd &mdash; <code>a leaf Variable that requires grad is being used in an
         in-place operation</code>.</b> <i>Cause:</i> you modified a tensor that autograd needs for the backward pass
         in place (e.g. <code>x += 1</code>, <code>x.relu_()</code>, or writing into a parameter directly).
         <i>Fix:</i> use the out-of-place version (<code>x = x + 1</code>, <code>torch.relu(x)</code>); for manual
         weight edits wrap them in <code>with torch.no_grad():</code>.</li>
         <li><b>DataLoader worker crashes.</b> <i>Cause:</i> an exception inside your <code>Dataset.__getitem__</code>
         (a bad file path, a wrong index, a non-tensor return) surfaces as a confusing worker traceback; on Windows and
         in notebooks, <code>num_workers &gt; 0</code> without a <code>if __name__ == "__main__":</code> guard fails to
         spawn. <i>Fix:</i> set <code>num_workers=0</code> to get the real traceback in the main process, fix the
         <code>__getitem__</code>, then turn workers back up.</li>
         <li><b>Silent broadcasting bug &mdash; no error, wrong answer.</b> <i>Cause:</i> shapes that <i>broadcast</i>
         instead of matching: subtracting predictions of shape <code>(N, 1)</code> from targets of shape
         <code>(N,)</code> quietly produces an <code>(N, N)</code> tensor, so your loss is computed over a whole
         outer-product grid. There is no exception &mdash; just a loss that will not train. <i>Fix:</i> print the
         shape of the loss's operands; squeeze or reshape so they match exactly before combining.</li>
       </ul>`,

    bigIdea:
      `<p>PyTorch errors feel random until you see they come from a <b>small, fixed set</b> of mismatches:
       <b>shapes</b> that do not line up, <b>devices</b> that disagree, <b>dtypes</b> that are wrong, or
       <b>gradients</b> that are missing, exploding, or never zeroed. Almost every message maps to one of these.</p>
       <p>So the cure is not memorizing messages &mdash; it is a <b>routine</b> that exposes the mismatch:
       <b>set a seed</b> (so the bug is reproducible), <b>overfit a single batch</b> (separates wiring bugs from data
       bugs), <b>print shapes, dtypes, and devices</b> at the failing line, and <b>check gradient norms</b> (zero means
       no learning signal; huge means it is about to explode). When the routine still hides the source, turn on
       <code>set_detect_anomaly(True)</code> and let PyTorch point at the operation.</p>`,

    buildup:
      `<p>The debugging method, in order:</p>
       <ol>
         <li><b>Set a seed.</b> <code>torch.manual_seed(0)</code> makes the failure repeat every run, so you are
         chasing one bug, not a moving target.</li>
         <li><b>Overfit a single batch.</b> Grab one small batch and loop on it alone. A correct model+loss+optimizer
         drives that loss to nearly zero. <b>If it cannot, the bug is in the model or the loss</b> &mdash; not the data,
         not the learning rate.</li>
         <li><b>Print shapes, dtypes, devices.</b> At the line that errors, print <code>x.shape</code>,
         <code>x.dtype</code>, <code>x.device</code> for every tensor involved. Most <code>RuntimeError</code>s answer
         themselves here.</li>
         <li><b>Check gradient norms.</b> After <code>loss.backward()</code>, look at
         <code>p.grad.norm()</code> per parameter (or the total norm). All zero &rarr; no signal is reaching the
         weights (often a detached graph or a missing <code>requires_grad</code>). Exploding &rarr; lower the learning
         rate or clip.</li>
         <li><b>Turn on anomaly detection.</b> <code>torch.autograd.set_detect_anomaly(True)</code> makes the backward
         pass report the exact forward operation that produced a <code>NaN</code> or an illegal in-place edit. It is
         slow, so use it only while hunting.</li>
       </ol>`,

    symbols: [
      { sym: "<code>x.shape</code>", desc: "the size of each dimension; the first thing to print on any RuntimeError." },
      { sym: "<code>x.dtype</code>", desc: "the element type (e.g. <code>float32</code>, <code>long</code>); CrossEntropy targets must be <code>long</code>." },
      { sym: "<code>x.device</code>", desc: "<code>cpu</code> or <code>cuda:0</code>; mismatches between model and data are the classic GPU error." },
      { sym: "<code>optimizer.zero_grad()</code>", desc: "clears <code>.grad</code> before <code>backward()</code>; forgetting it makes gradients accumulate across steps." },
      { sym: "<code>set_detect_anomaly(True)</code>", desc: "makes the backward pass name the operation that produced a NaN or an in-place violation." },
      { sym: "<code>clip_grad_norm_</code>", desc: "caps the total gradient norm; the standard guard against exploding gradients that cause NaN loss." }
    ],

    derivation:
      `<p><b>Why \"overfit one batch\" is the sharpest test.</b></p>
       <ul class="steps">
         <li>A neural network has far more parameters than a single batch has examples, so a correctly wired model can
         <i>memorize</i> that batch &mdash; drive its training loss to nearly zero. This is normally a sign of
         overfitting; here we <b>want</b> it, as a diagnostic.</li>
         <li>If the loss <b>does</b> reach ~0 on one batch, then the forward pass, the loss function, the
         <code>backward()</code> path, and the optimizer step are all connected correctly. Any remaining problem is
         about <i>generalization</i> (data, regularization, learning rate) &mdash; not wiring.</li>
         <li>If the loss <b>cannot</b> reach ~0 on one batch, the signal is not flowing: a detached graph, a tensor
         with <code>requires_grad=False</code>, a wrong loss, labels misaligned with inputs, or a missing
         <code>zero_grad</code>/<code>backward</code>/<code>step</code>. Checking gradient norms then localizes it
         &mdash; all-zero grads mean the loss does not depend on the parameters at all.</li>
         <li>Because it uses one tiny batch, the test runs in seconds and rules out an entire class of bugs before you
         ever pay for a full training run.</li>
       </ul>`,

    example:
      `<p>A silent broadcasting bug, made concrete. Suppose predictions are shape <code>(4, 1)</code> and targets are
       shape <code>(4,)</code>, and you write <code>err = pred - target</code> for a mean-squared-error loss.</p>
       <ul class="steps">
         <li>PyTorch broadcasts <code>(4, 1)</code> against <code>(4,)</code> &rarr; it lines up the last axes,
         stretching <code>(4, 1)</code> and <code>(1, 4)</code> into an <code>(4, 4)</code> result &mdash; an
         <b>outer-product grid</b> of every prediction minus every target.</li>
         <li>No error is raised. <code>err.mean()</code> averages 16 wrong differences instead of 4 right ones, so the
         loss is meaningless and the model will not train.</li>
         <li>The fix is to make shapes match: <code>pred = pred.squeeze(1)</code> (now <code>(4,)</code>) or
         <code>target = target.unsqueeze(1)</code> (now <code>(4, 1)</code>). Printing
         <code>(pred - target).shape</code> exposes the bug instantly &mdash; you expected <code>(4,)</code> or
         <code>(4, 1)</code>, not <code>(4, 4)</code>.</li>
       </ul>`,

    practice: [
      {
        q: `<b>Type this in Colab.</b> Reproduce the classic shape-mismatch error, then read it. Make <code>x = torch.randn(16, 20)</code> and <code>layer = nn.Linear(10, 4)</code>, call <code>layer(x)</code> inside a <code>try/except RuntimeError</code>, and print the first line of the message. Then print <code>x.shape</code> and build a correctly-sized layer that works.`,
        steps: [
          { do: `Wrap the failing call in <code>try/except RuntimeError</code> and print <code>str(e).splitlines()[0]</code>.`, why: `Catching and reading the message is the first debugging move; the error names the mismatched matrix shapes.` },
          { do: `Print <code>x.shape</code>, then set <code>in_features</code> to the last dim (20).`, why: `<code>nn.Linear</code> needs <code>in_features</code> to equal the input's last dimension — printing the shape reveals the right number.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
x = torch.randn(16, 20)
bad = nn.Linear(10, 4)
try:
    bad(x)
except RuntimeError as e:
    print(str(e).splitlines()[0])
    # mat1 and mat2 shapes cannot be multiplied (16x20 and 10x4)
print(x.shape)                          # torch.Size([16, 20]) -> in_features must be 20
good = nn.Linear(20, 4)
print(good(x).shape)                    # torch.Size([16, 4])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Run the overfit-one-batch sanity check. Build <code>model = nn.Sequential(nn.Linear(20, 32), nn.ReLU(), nn.Linear(32, 3))</code>, a fixed batch <code>xb = torch.randn(16, 20)</code> and <code>yb = torch.randint(0, 3, (16,))</code> (seed 0), and train on that ONE batch for 200 Adam steps with <code>nn.CrossEntropyLoss</code>. Print the loss every 50 steps. Predict: can it reach ~0?`,
        steps: [
          { do: `Loop <code>zero_grad()</code> &rarr; <code>logits = model(xb)</code> &rarr; <code>loss</code> &rarr; <code>backward()</code> &rarr; <code>step()</code> on the same batch.`, why: `A correctly wired model can memorize one batch, driving its loss to ~0 — that proves the wiring is right.` },
          { do: `Predict: yes, it reaches ~0; if it cannot, the bug is in the model or loss.`, why: `The overfit-one-batch test separates wiring bugs from data/regularization/learning-rate issues.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Sequential(nn.Linear(20, 32), nn.ReLU(), nn.Linear(32, 3))
opt = torch.optim.Adam(model.parameters(), lr=1e-2)
loss_fn = nn.CrossEntropyLoss()
xb = torch.randn(16, 20)
yb = torch.randint(0, 3, (16,))

for step in range(200):
    opt.zero_grad()
    loss = loss_fn(model(xb), yb)
    loss.backward(); opt.step()
    if step % 50 == 0:
        print(step, round(loss.item(), 4))
print("final:", round(loss.item(), 5))   # ~0.0 -> wiring is correct</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Make NaN loss happen on purpose. Train the same tiny model with an absurd learning rate <code>lr=1e6</code> for a few steps and print the loss each step until it becomes non-finite. Use <code>torch.isfinite(loss)</code> to detect it and stop.`,
        steps: [
          { do: `Set a huge <code>lr</code> so the weights blow up, and guard with <code>torch.isfinite(loss)</code>.`, why: `Too-high a learning rate is the most common NaN cause; the finite check catches it the instant it appears.` },
          { do: `Break out of the loop on the first non-finite loss.`, why: `Training past a NaN is pointless — the standard triage is to stop, lower the lr, and/or clip gradients.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Sequential(nn.Linear(20, 32), nn.ReLU(), nn.Linear(32, 3))
opt = torch.optim.Adam(model.parameters(), lr=1e6)   # absurdly high
loss_fn = nn.CrossEntropyLoss()
xb = torch.randn(16, 20); yb = torch.randint(0, 3, (16,))

for step in range(20):
    opt.zero_grad()
    loss = loss_fn(model(xb), yb)
    loss.backward(); opt.step()
    print(step, loss.item())
    if not torch.isfinite(loss):
        print("non-finite loss -> stop; lower lr / clip grads")  # fires within a few steps
        break</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Debug a missing gradient. Create <code>w = torch.randn(3, requires_grad=True)</code>, then <code>x = w.detach() * 2</code>, then <code>loss = (x ** 2).sum()</code>, call <code>loss.backward()</code> and print <code>w.grad</code>. Predict the result, then fix it so <code>w.grad</code> is not <code>None</code>.`,
        steps: [
          { do: `Backprop through a graph that contains <code>.detach()</code> and inspect <code>w.grad</code>.`, why: `<code>detach()</code> cuts the graph, so no gradient flows back to <code>w</code> and <code>w.grad</code> stays <code>None</code>.` },
          { do: `Remove the <code>.detach()</code> so the graph connects loss to <code>w</code>.`, why: `A <code>None</code> grad almost always means the loss does not depend on the parameter through a tracked graph.` }
        ],
        answer: `<pre><code>w = torch.randn(3, requires_grad=True)
x = w.detach() * 2            # detach CUTS the graph
loss = (x ** 2).sum()
loss.backward()
print(w.grad)                # None  -- no gradient reached w

w = torch.randn(3, requires_grad=True)
x = w * 2                     # FIX: keep w in the graph
loss = (x ** 2).sum()
loss.backward()
print(w.grad)                # tensor([...]) -- real gradients now</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Reproduce the <code>nn.CrossEntropyLoss</code> double-softmax pitfall as code. With seed 0 and <code>logits = torch.randn(5, 3)</code>, <code>y = torch.tensor([0, 2, 1, 0, 1])</code>, compute the loss on (a) the raw logits and (b) <code>logits.softmax(dim=1)</code>. Print both. Which is correct?`,
        steps: [
          { do: `Pass raw logits to <code>nn.CrossEntropyLoss</code> — never pre-softmaxed.`, why: `CrossEntropyLoss applies <code>log_softmax</code> internally; feeding probabilities softmaxes twice and shrinks the gradient.` },
          { do: `Compare the two loss values.`, why: `The pre-softmaxed version gives a different, wrong loss — showing why you must feed logits.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
loss_fn = nn.CrossEntropyLoss()
logits = torch.randn(5, 3)
y = torch.tensor([0, 2, 1, 0, 1])         # long class indices, shape (5,)

print(round(loss_fn(logits, y).item(), 4))                  # CORRECT (raw logits)
print(round(loss_fn(logits.softmax(dim=1), y).item(), 4))   # WRONG (double softmax)
# The two values differ; only the first uses the intended log_softmax once.</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Expose the silent broadcasting bug. With <code>pred = torch.randn(4, 1)</code> and <code>target = torch.randn(4)</code> (seed 0), print <code>(pred - target).shape</code>. Predict it BEFORE running. Then fix the shapes two ways and print the corrected shape.`,
        steps: [
          { do: `Print the shape of <code>pred - target</code> and predict it first.`, why: `<code>(4,1)</code> broadcasts against <code>(4,)</code> to <code>(4,4)</code> — an outer-product grid, with no error raised.` },
          { do: `Fix with <code>pred.squeeze(1)</code> or <code>target.unsqueeze(1)</code>.`, why: `Matching the shapes exactly gives the intended elementwise difference instead of a silent 16-element grid.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
pred = torch.randn(4, 1)
target = torch.randn(4)
print((pred - target).shape)              # torch.Size([4, 4])  -- silently WRONG!
print((pred.squeeze(1) - target).shape)   # torch.Size([4])
print((pred - target.unsqueeze(1)).shape) # torch.Size([4, 1])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Trigger and fix the in-place autograd error. Make <code>w = torch.randn(3, requires_grad=True)</code> and try <code>w += 1</code> inside a <code>try/except RuntimeError</code>; print the first line. Then do the same edit safely under <code>torch.no_grad()</code> and print <code>w</code>.`,
        steps: [
          { do: `Attempt the in-place <code>w += 1</code> on a leaf that requires grad and catch the error.`, why: `In-place edits on a leaf tensor autograd is tracking corrupt the backward graph, so PyTorch raises.` },
          { do: `Repeat inside <code>with torch.no_grad():</code> (or use out-of-place <code>w = w + 1</code>).`, why: `<code>no_grad</code> tells autograd not to track the edit, making manual weight updates legal.` }
        ],
        answer: `<pre><code>w = torch.randn(3, requires_grad=True)
try:
    w += 1
except RuntimeError as e:
    print(str(e).splitlines()[0])
    # a leaf Variable that requires grad is being used in an in-place operation.
with torch.no_grad():            # FIX: untracked edit
    w += 1
print(w.requires_grad)           # True -- still a leaf that requires grad, edit ok</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Print shapes, dtypes, and devices through a forward pass — the cheapest debug tool. Build <code>model = nn.Sequential(nn.Linear(20, 8), nn.ReLU(), nn.Linear(8, 3))</code>, make <code>xb = torch.randn(16, 20)</code> (seed 0), and print <code>xb.shape</code>, <code>xb.dtype</code>, <code>xb.device</code>, then the logits' shape after the forward.`,
        steps: [
          { do: `Print <code>.shape</code>, <code>.dtype</code>, <code>.device</code> of the input before the forward.`, why: `Most <code>RuntimeError</code>s answer themselves once you see the three attributes at the failing line.` },
          { do: `Print the output shape after <code>model(xb)</code>.`, why: `Confirming the output shape <code>(16, 3)</code> verifies the layers line up end to end.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Sequential(nn.Linear(20, 8), nn.ReLU(), nn.Linear(8, 3))
xb = torch.randn(16, 20)
print(xb.shape, xb.dtype, xb.device)   # torch.Size([16, 20]) torch.float32 cpu
logits = model(xb)
print(logits.shape)                    # torch.Size([16, 3])</code></pre>`
      }
    ]
  });

  window.CODE["pt-debugging"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A hands-on debugging toolkit you can run top to bottom in Google Colab (torch ships preinstalled). It
      <b>reproduces a real shape-mismatch error and fixes it</b>; shows the <b>overfit-one-batch sanity check</b> (train
      on a single batch until the loss collapses to ~0); demonstrates <b>printing shapes, dtypes, devices, and gradient
      norms</b>; turns on <code>torch.autograd.set_detect_anomaly(True)</code>; and adds a <b>NaN-loss guard</b> that
      stops and reports instead of silently training on garbage. <code>runnable</code> is off because the in-browser
      engine has no PyTorch &mdash; paste it into Colab to run.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)                       # STEP 1 of the method: make bugs reproducible
device = "cuda" if torch.cuda.is_available() else "cpu"

# ============================================================
# A) REPRODUCE A SHAPE MISMATCH, THEN FIX IT
#    Symptom: "mat1 and mat2 shapes cannot be multiplied".
# ============================================================
x = torch.randn(16, 20)                    # batch of 16, 20 features each
bad_layer = nn.Linear(10, 4)               # WRONG: expects 10 in-features, gets 20
try:
    bad_layer(x)
except RuntimeError as e:
    print("CAUGHT shape error:", str(e).splitlines()[0])
    # FIX: print the shape, then size the layer to match.
    print("x.shape =", tuple(x.shape))     # -> (16, 20)  => in_features must be 20
good_layer = nn.Linear(20, 4)              # in_features now matches x's last dim
print("fixed output shape:", tuple(good_layer(x).shape))   # -> (16, 4)

# ============================================================
# B) A TINY MODEL + THE OVERFIT-ONE-BATCH SANITY CHECK
#    If the loss can't reach ~0 on ONE batch, the bug is in
#    the model/loss, not the data or the learning rate.
# ============================================================
model = nn.Sequential(nn.Linear(20, 32), nn.ReLU(), nn.Linear(32, 3)).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-2)
loss_fn = nn.CrossEntropyLoss()            # expects LOGITS + LONG class indices

# one fixed batch (note: data must go to the SAME device as the model)
xb = torch.randn(16, 20, device=device)
yb = torch.randint(0, 3, (16,), device=device)   # class indices in [0, 2], dtype long

# Print shapes / dtypes / devices BEFORE the loop — the cheapest debug tool there is.
print("xb:", tuple(xb.shape), xb.dtype, xb.device)
print("yb:", tuple(yb.shape), yb.dtype, yb.device)   # long, same device

for step in range(200):
    optimizer.zero_grad()                  # clear grads — forgetting this is the #1 "loss won't move" bug
    logits = model(xb)                     # raw logits, shape (16, 3) — NO softmax before CrossEntropyLoss
    loss = loss_fn(logits, yb)
    loss.backward()
    optimizer.step()
    if step % 50 == 0:
        # STEP 4: gradient-norm check. ~0 => no signal reaching weights; huge => about to explode.
        total_norm = sum(p.grad.norm().item() ** 2 for p in model.parameters()) ** 0.5
        print(f"step {step:3d}  loss {loss.item():.4f}  grad_norm {total_norm:.3f}")
print("overfit-one-batch final loss:", round(loss.item(), 5), "(should be ~0 -> wiring is correct)")

# ============================================================
# C) NaN-LOSS GUARD + ANOMALY DETECTION
#    Catch a NaN the instant it appears and find the op that made it.
# ============================================================
torch.autograd.set_detect_anomaly(True)    # slow; turn on only while hunting a NaN / in-place bug

def guarded_step(logits, target):
    loss = loss_fn(logits, target)
    if not torch.isfinite(loss):           # NaN or inf guard
        raise FloatingPointError(f"non-finite loss {loss.item()} — lower lr / clip grads / check inputs")
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)  # guard against exploding grads
    return loss

optimizer.zero_grad()
loss = guarded_step(model(xb), yb)
optimizer.step()
print("guarded step ok, loss:", round(loss.item(), 4))

# ============================================================
# D) THE SILENT BROADCASTING BUG (no error, wrong answer)
# ============================================================
pred = torch.randn(4, 1)                    # shape (4, 1)
target = torch.randn(4)                     # shape (4,)
wrong = (pred - target)                      # broadcasts to (4, 4) — silently WRONG
right = (pred.squeeze(1) - target)           # shapes match -> (4,)
print("broadcast shapes -> wrong:", tuple(wrong.shape), " right:", tuple(right.shape))

# ============================================================
# E) IN-PLACE OP THAT BREAKS AUTOGRAD (and the fix)
# ============================================================
w = torch.randn(3, requires_grad=True)
try:
    w += 1                                   # in-place on a leaf that requires grad -> RuntimeError
except RuntimeError as e:
    print("CAUGHT in-place error:", str(e).splitlines()[0])
with torch.no_grad():                        # FIX: edit weights inside no_grad (or use out-of-place w = w + 1)
    w += 1
print("in-place fix ok, w mean:", round(w.mean().item(), 3))`
  };

  window.CODEVIZ["pt-debugging"] = {
    question: "Forgetting optimizer.zero_grad() makes gradients accumulate across steps. What does that do to the training-loss curve, compared with the correctly-zeroed run?",
    charts: [{
      type: "line",
      title: "Buggy (forgot zero_grad) vs fixed training loss on a tiny regression",
      xlabel: "epoch",
      ylabel: "mean squared error",
      series: [
        { name: "buggy (grads accumulate)", color: "#ff7b72", points: [[0, 4.573], [2, 1.048], [5, 2.587], [7, 4.561], [10, 0.403], [13, 3.729], [15, 3.374], [18, 1.107], [20, 3.205], [23, 2.162], [26, 2.353], [28, 2.882], [31, 2.056], [33, 2.882], [36, 1.729], [39, 3.096]] },
        { name: "fixed (zero_grad each step)", color: "#7ee787", points: [[0, 4.573], [2, 2.009], [5, 0.601], [7, 0.276], [10, 0.092], [13, 0.035], [15, 0.022], [18, 0.013], [20, 0.011], [23, 0.01], [26, 0.01], [28, 0.01], [31, 0.01], [33, 0.01], [36, 0.009], [39, 0.009]] }
      ]
    }],
    caption: "Real numbers from a numpy simulation of fitting y = 2x + 1. Both runs start at the same loss (4.573). The fixed run clears gradients each step and slides smoothly to ~0.009. The buggy run never clears them, so each step's update carries the sum of all past gradients — it overshoots, bounces between ~0.4 and ~4.6, and never converges.",
    code: `import numpy as np

# Tiny linear regression: fit y = 2x + 1 by gradient descent.
# FIXED run zeroes the gradient each step; BUGGY run never does
# (it accumulates every past gradient — exactly what forgetting
#  optimizer.zero_grad() does in PyTorch).
rng = np.random.default_rng(0)
N = 64
x = rng.normal(0, 1, N)
y = 2.0 * x + 1.0 + rng.normal(0, 0.1, N)

def grads(w, b):
    err = (w * x + b) - y
    loss = np.mean(err ** 2)
    return loss, 2 * np.mean(err * x), 2 * np.mean(err)

lr, EPOCHS = 0.1, 40

# FIXED: fresh gradient each step
w, b, fixed = 0.0, 0.0, []
for _ in range(EPOCHS):
    loss, gw, gb = grads(w, b); fixed.append(loss)
    w -= lr * gw; b -= lr * gb

# BUGGY: gradients accumulate (zero_grad forgotten)
w, b, accw, accb, buggy = 0.0, 0.0, 0.0, 0.0, []
for _ in range(EPOCHS):
    loss, gw, gb = grads(w, b); buggy.append(loss)
    accw += gw; accb += gb            # never cleared
    w -= lr * accw; b -= lr * accb

idx = [0,2,5,7,10,13,15,18,20,23,26,28,31,33,36,39]
print("fixed:", [(i, round(fixed[i], 3)) for i in idx])
print("buggy:", [(i, round(buggy[i], 3)) for i in idx])

import matplotlib.pyplot as plt
plt.plot(buggy, color="#ff7b72", label="buggy (grads accumulate)")
plt.plot(fixed, color="#7ee787", label="fixed (zero_grad each step)")
plt.xlabel("epoch"); plt.ylabel("mean squared error")
plt.title("Buggy (forgot zero_grad) vs fixed training loss")
plt.legend(); plt.show()`
  };
})();
