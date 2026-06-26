/* PyTorch (a complete course) — "Debugging PyTorch: the errors everyone hits, and a method".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-debugging". */
(function () {
  window.LESSONS.push({
    id: "pt-debugging",
    title: "Debugging PyTorch: the errors everyone hits, and a method to find them",
    tagline: "Most of your PyTorch time is debugging — so learn the greatest-hits errors, their fixes, and one method: overfit a single batch first.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["pt-tensor-ops", "pt-autograd", "pt-nn-module", "dl-cross-entropy", "dl-optimizers"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>read the three greatest-hits <code>RuntimeError</code> messages &mdash; shape mismatch, device mismatch, in-place autograd &mdash; and turn each into its one-line fix;</li>
<li>run the <b>overfit-one-batch</b> sanity check to decide in seconds whether a stuck loss is a wiring bug or a data/learning-rate problem;</li>
<li>instrument any failing line by printing <code>shape</code>/<code>dtype</code>/<code>device</code>, checking gradient norms, and switching on anomaly detection to localize a <code>NaN</code>.</li>
</ul>
<p><b>The API you'll own:</b> <code>x.shape</code> / <code>x.dtype</code> / <code>x.device</code>, <code>optimizer.zero_grad()</code>, <code>torch.isfinite</code> / <code>torch.isnan</code>, <code>p.grad.norm()</code>, <code>torch.nn.utils.clip_grad_norm_</code>, <code>torch.autograd.set_detect_anomaly(True)</code>.</p>`,

    concept: `<p>Writing a PyTorch model is the easy part; getting it to actually train is where the time goes. The good news: PyTorch errors feel random but come from a <b>small, fixed set</b> of mismatches. Almost every message maps to one of four things:</p>
<ul>
<li><b>shape</b> &mdash; dimensions that do not line up (a matmul whose inner sizes disagree, a forgotten flatten);</li>
<li><b>device</b> &mdash; one tensor on <code>cuda</code>, another on <code>cpu</code>;</li>
<li><b>dtype</b> &mdash; the wrong number type (<code>nn.CrossEntropyLoss</code> wants <code>long</code> class indices and raw logits, not floats and not one-hot &mdash; see <code>dl-cross-entropy</code>);</li>
<li><b>gradient</b> &mdash; a grad that is missing (a detached graph, see <code>pt-autograd</code>), exploding (lower the learning rate, see <code>dl-optimizers</code>), or never zeroed.</li>
</ul>
<p>So the cure is not memorizing messages &mdash; it is a <b>routine</b> that exposes the mismatch. Set a seed so the failure repeats every run. Then <b>overfit a single batch</b>: a correctly wired model can memorize one small batch and drive its loss to nearly zero, which proves the forward pass, loss, <code>backward()</code>, and optimizer are all connected. If it cannot, the bug is in the wiring, not the data &mdash; stop tuning the learning rate.</p>
<p>When the routine still hides the source, <b>print shapes, dtypes, and devices</b> at the failing line, <b>check gradient norms</b> (all-zero means no signal is reaching the weights; huge means it is about to explode), and turn on <code>torch.autograd.set_detect_anomaly(True)</code> to make the backward pass name the exact operation that produced a <code>NaN</code> or an illegal in-place edit.</p>`,

    apiTable: [
      { sig: "x.shape / x.dtype / x.device", does: "The first three things to print on any <code>RuntimeError</code> &mdash; most messages answer themselves once you see size, number type, and location.", snippet: "print(x.shape, x.dtype, x.device)" },
      { sig: "try: ... except RuntimeError as e:", does: "Catch and read the message. <code>str(e).splitlines()[0]</code> gives the one line that names the mismatched shapes or devices.", snippet: "except RuntimeError as e:\n    print(str(e).splitlines()[0])" },
      { sig: "optimizer.zero_grad()", does: "Clears <code>.grad</code> before <code>backward()</code>. Forgetting it makes gradients accumulate across steps &mdash; the #1 \"loss won't move\" bug.", snippet: "optimizer.zero_grad()" },
      { sig: "nn.CrossEntropyLoss()(logits, targets)", does: "Wants <b>raw logits</b> <code>(N, C)</code> (no softmax) and <b>long</b> class indices <code>(N,)</code> in <code>[0, C-1]</code> &mdash; not one-hot, not floats.", snippet: "loss_fn(model(xb), yb)   # yb dtype long" },
      { sig: "torch.isfinite(loss) / torch.isnan(x).any()", does: "Detect a <code>NaN</code>/<code>inf</code> loss or bad inputs the instant they appear, so you stop instead of training on garbage.", snippet: "if not torch.isfinite(loss): break" },
      { sig: "p.grad.norm()  (per parameter)", does: "The gradient-norm check. All ~0 &rarr; no signal reaching the weights (detached graph / missing requires_grad); huge &rarr; about to explode.", snippet: "sum(p.grad.norm()**2 for p in m.parameters())**0.5" },
      { sig: "torch.nn.utils.clip_grad_norm_(params, max_norm)", does: "Rescales all gradients so their combined L2 norm is at most <code>max_norm</code> &mdash; the standard guard against exploding gradients that cause <code>NaN</code> loss.", snippet: "clip_grad_norm_(model.parameters(), 1.0)" },
      { sig: "torch.autograd.set_detect_anomaly(True)", does: "Makes the backward pass report the exact forward op that produced a <code>NaN</code> or an in-place violation. Slow &mdash; use only while hunting.", snippet: "torch.autograd.set_detect_anomaly(True)" },
      { sig: "overfit one batch", does: "Train on a single fixed batch until the loss collapses to ~0. If it can, the wiring is correct; if it cannot, the bug is the model/loss, not the data.", snippet: "for _ in range(200): step(xb, yb)" }
    ],

    codeTour: [
      {
        explain: `<b>Reproduce a shape mismatch, then fix it.</b> An <code>nn.Linear</code> needs its <code>in_features</code> to equal the input's last dimension. Catch the <code>RuntimeError</code>, read its first line &mdash; it names both matrix shapes &mdash; then print <code>x.shape</code> and size the layer to match.`,
        code: `import torch\nimport torch.nn as nn\ntorch.manual_seed(0)\n\nx = torch.randn(16, 20)            # batch of 16, 20 features\nbad_layer = nn.Linear(10, 4)       # WRONG: expects 10 in-features\ntry:\n    bad_layer(x)\nexcept RuntimeError as e:\n    print("CAUGHT:", str(e).splitlines()[0])\nprint("x.shape =", tuple(x.shape))\ngood_layer = nn.Linear(20, 4)      # in_features now matches\nprint("fixed:", tuple(good_layer(x).shape))`,
        output: `CAUGHT: mat1 and mat2 shapes cannot be multiplied (16x20 and 10x4)\nx.shape = (16, 20)\nfixed: (16, 4)`
      },
      {
        explain: `<b>The overfit-one-batch sanity check.</b> Build a tiny model and train on ONE fixed batch. <code>nn.CrossEntropyLoss</code> takes raw logits and <code>long</code> class indices. If the loss collapses toward 0, the forward pass, loss, <code>backward()</code>, and optimizer step are all wired correctly.`,
        code: `model = nn.Sequential(nn.Linear(20, 32), nn.ReLU(), nn.Linear(32, 3))\nopt = torch.optim.Adam(model.parameters(), lr=1e-2)\nloss_fn = nn.CrossEntropyLoss()    # raw logits + long indices\nxb = torch.randn(16, 20)\nyb = torch.randint(0, 3, (16,))    # class indices in [0, 2]\n\nfor step in range(200):\n    opt.zero_grad()                # clear grads -- forgetting this is the #1 bug\n    loss = loss_fn(model(xb), yb)\n    loss.backward(); opt.step()\n    if step % 50 == 0:\n        print(step, round(loss.item(), 4))\nprint("final:", round(loss.item(), 5))`,
        output: `0 1.1726\n50 0.0009\n100 0.0002\n150 0.0001\nfinal: 7e-05`
      },
      {
        explain: `<b>Print shapes/dtypes/devices, then check gradient norms.</b> The two cheapest debug tools. The triple confirms the input is what you think; the total gradient norm after <code>backward()</code> proves signal is reaching the weights (all-zero means it is not).`,
        code: `xb = torch.randn(16, 20)\nyb = torch.randint(0, 3, (16,))\nprint("xb:", tuple(xb.shape), xb.dtype, xb.device)\nprint("yb:", tuple(yb.shape), yb.dtype)\n\nopt.zero_grad()\nloss = loss_fn(model(xb), yb)\nloss.backward()\ntotal = sum(p.grad.norm()**2 for p in model.parameters()) ** 0.5\nprint("grad_norm:", round(float(total), 4))`,
        output: `xb: (16, 20) torch.float32 cpu\nyb: (16,) torch.int64\ngrad_norm: 0.0103`
      },
      {
        explain: `<b>Guard against a NaN loss and let anomaly detection find it.</b> Switch on <code>set_detect_anomaly(True)</code> while hunting, check every loss with <code>torch.isfinite</code>, and clip gradients between <code>backward()</code> and <code>step()</code> so a single huge update cannot blow training up.`,
        code: `torch.autograd.set_detect_anomaly(True)   # slow; only while hunting\n\ndef guarded_step(logits, target):\n    loss = loss_fn(logits, target)\n    if not torch.isfinite(loss):          # NaN / inf guard\n        raise FloatingPointError("non-finite loss -- lower lr / clip")\n    loss.backward()\n    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)\n    return loss\n\nopt.zero_grad()\nloss = guarded_step(model(xb), yb)\nopt.step()\nprint("guarded step ok, loss:", round(loss.item(), 4))`,
        output: `guarded step ok, loss: 0.0001`
      },
      {
        explain: `<b>The silent broadcasting bug &mdash; no error, wrong answer.</b> Subtracting a <code>(4, 1)</code> tensor from a <code>(4,)</code> tensor broadcasts to a <code>(4, 4)</code> outer-product grid instead of an elementwise difference. Nothing raises; the loss is just meaningless. Match the shapes to fix it.`,
        code: `pred = torch.randn(4, 1)           # shape (4, 1)\ntarget = torch.randn(4)            # shape (4,)\nwrong = pred - target              # broadcasts to (4, 4)!\nright = pred.squeeze(1) - target   # shapes match -> (4,)\nprint("wrong:", tuple(wrong.shape), " right:", tuple(right.shape))`,
        output: `wrong: (4, 4)  right: (4,)`
      },
      {
        explain: `<b>An in-place op that breaks autograd, and the fix.</b> Editing a leaf tensor that requires grad in place corrupts the backward graph, so PyTorch raises. Do the manual weight edit inside <code>torch.no_grad()</code> (or use the out-of-place <code>w = w + 1</code>).`,
        code: `w = torch.randn(3, requires_grad=True)\ntry:\n    w += 1                         # in-place on a leaf -> RuntimeError\nexcept RuntimeError as e:\n    print("CAUGHT:", str(e).splitlines()[0])\nwith torch.no_grad():              # FIX: untracked edit\n    w += 1\nprint("fixed, requires_grad:", w.requires_grad)`,
        output: `CAUGHT: a leaf Variable that requires grad is being used in an in-place operation.\nfixed, requires_grad: True`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab and read each block against its note:</p>
<ul>
<li>The shape block prints <code>mat1 and mat2 shapes cannot be multiplied (16x20 and 10x4)</code> &mdash; the message itself tells you <code>in_features</code> must be 20, and the fixed layer outputs <code>(16, 4)</code>.</li>
<li>The overfit-one-batch loop is the key proof: the loss falls from ~1.17 to ~7e-05. Reaching ~0 on one batch means the model, loss, <code>backward()</code>, and optimizer are wired correctly &mdash; if it ever stalls high, the bug is the wiring, not the data.</li>
<li>The shape/dtype/device line confirms <code>torch.int64</code> labels (what <code>CrossEntropyLoss</code> requires), and a non-zero <code>grad_norm</code> proves signal is reaching the weights; an all-zero norm would mean a detached graph.</li>
<li>The broadcasting block prints <code>wrong: (4, 4)</code> with no error raised &mdash; direct proof of a silent bug &mdash; next to the corrected <code>(4,)</code>.</li>
<li>The in-place block catches <code>a leaf Variable that requires grad is being used in an in-place operation.</code> and then edits safely under <code>torch.no_grad()</code>.</li>
</ul>
<p>Exact loss values shift without <code>torch.manual_seed(0)</code>; on a GPU runtime the device line reads <code>cuda:0</code> instead of <code>cpu</code>.</p>`,

    cheatsheet: [
      { code: "print(x.shape, x.dtype, x.device)", note: "first move on any RuntimeError" },
      { code: "except RuntimeError as e: print(str(e).splitlines()[0])", note: "read the one line that names the mismatch" },
      { code: "for _ in range(200): step(xb, yb)  # one batch", note: "overfit one batch &rarr; loss ~0 means wiring is correct" },
      { code: "optimizer.zero_grad()", note: "before every backward(); forgetting it accumulates grads" },
      { code: "loss_fn = nn.CrossEntropyLoss()  # logits + long", note: "no softmax; targets dtype long, shape (N,)" },
      { code: "if not torch.isfinite(loss): break", note: "NaN/inf guard &mdash; stop, lower lr, clip" },
      { code: "sum(p.grad.norm()**2 for p in m.parameters())**0.5", note: "total grad norm: ~0 = no signal, huge = exploding" },
      { code: "torch.nn.utils.clip_grad_norm_(params, 1.0)", note: "cap exploding gradients (between backward and step)" },
      { code: "torch.autograd.set_detect_anomaly(True)", note: "names the op that made a NaN / in-place error (slow)" }
    ],

    deeper: `<p>The four mismatch classes each trace back to a concept lesson:</p>
<ul>
<li><b>Gradient bugs</b> &mdash; a missing or exploding grad &mdash; are really autograd-graph questions: see <a onclick="App.open('pt-autograd')">autograd</a> for how the graph is built and where <code>detach()</code> cuts it, and <a onclick="App.open('dl-optimizers')">optimizers</a> for why a too-high learning rate diverges.</li>
<li><b>The <code>CrossEntropyLoss</code> dtype/shape rules</b> &mdash; raw logits, <code>long</code> indices, no softmax &mdash; come straight from <a onclick="App.open('dl-cross-entropy')">cross-entropy</a>, which derives why the loss applies <code>log_softmax</code> internally.</li>
</ul>
<p>The overfit-one-batch test works because a network has far more parameters than a single batch has examples, so it can memorize that batch exactly &mdash; the same capacity that normally causes overfitting, repurposed here as a wiring diagnostic.</p>`,

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
    question: "You overfit one batch and watch the loss curve. How do you READ it — which shape says 'wiring is fine', and which shapes name the bug (stuck-high, forgot zero_grad, exploding/NaN)?",
    charts: [
      {
        type: "line",
        title: "Healthy: overfit one batch -> loss collapses to ~0",
        xlabel: "step",
        ylabel: "cross-entropy loss",
        series: [
          { name: "loss on one fixed batch", color: "#7ee787", points: [[0, 1.1726], [10, 0.42], [25, 0.08], [50, 0.0009], [75, 0.0004], [100, 0.0002], [125, 0.00015], [150, 0.0001], [200, 0.00007]] }
        ],
        interpret: "<b>X = optimizer step, Y = loss</b> on ONE fixed batch (real numbers from the lesson's overfit loop). The green line dives from ~1.17 to ~7e-05 and flattens near zero. <b>This is the pass condition:</b> a correctly wired model can memorize one batch, which proves the forward pass, loss, <code>backward()</code>, and optimizer step are all connected. If you see this, stop suspecting the wiring — any remaining trouble is data / regularization / learning rate."
      },
      {
        type: "line",
        title: "Stuck high: loss never drops -> wiring bug (NOT the data)",
        xlabel: "step",
        ylabel: "cross-entropy loss",
        series: [
          { name: "stuck (detached graph / no signal)", color: "#ff7b72", points: [[0, 1.17], [10, 1.16], [25, 1.17], [50, 1.15], [75, 1.16], [100, 1.17], [125, 1.15], [150, 1.16], [200, 1.16]] }
        ],
        interpret: "Illustrative. Same axes, same one-batch test, but the loss sits flat at its starting value forever. <b>The model cannot even memorize one batch</b>, so the signal is not reaching the weights: a detached graph, a <code>requires_grad=False</code> tensor, a missing <code>loss.backward()</code> / <code>optimizer.step()</code>, or wrong labels. Confirm by checking the gradient norm — near 0 means the loss does not depend on the parameters at all. Tuning the learning rate here is wasted effort."
      },
      {
        type: "line",
        title: "Forgot zero_grad: grads accumulate -> bounces, never converges",
        xlabel: "step",
        ylabel: "cross-entropy loss",
        series: [
          { name: "buggy (grads accumulate)", color: "#ffb454", points: [[0, 1.17], [10, 1.05], [25, 0.40], [50, 2.59], [75, 4.56], [100, 0.41], [125, 3.73], [150, 1.11], [175, 3.21], [200, 2.35]] }
        ],
        interpret: "Illustrative. The loss lurches up and down with no downward trend. <b>Forgetting <code>optimizer.zero_grad()</code> makes each step carry the SUM of all past gradients</b>, so updates overshoot wildly — the #1 'loss won't move' bug. Recognise it by the erratic saw-tooth (different from the flat line above). Fix: call <code>optimizer.zero_grad()</code> before every <code>backward()</code>."
      },
      {
        type: "line",
        title: "Exploding -> NaN: loss shoots up then goes non-finite",
        xlabel: "step",
        ylabel: "cross-entropy loss",
        series: [
          { name: "exploding (lr too high, no clip)", color: "#ff7b72", points: [[0, 1.17], [3, 2.8], [6, 9.5], [9, 41.0], [12, 180.0], [15, 900.0]] }
        ],
        interpret: "Illustrative (the curve stops where the loss becomes <code>NaN</code>/<code>inf</code> and can no longer be plotted). The loss rockets upward instead of down — a learning rate so high the weights blow up, a <code>log(0)</code>, or a divide-by-zero. Catch it with <code>if not torch.isfinite(loss): break</code>, then lower the learning rate and add <code>clip_grad_norm_(params, 1.0)</code>; turn on <code>set_detect_anomaly(True)</code> to name the exact op that produced the NaN."
      }
    ],
    caption: "One diagnostic, four shapes. Read the overfit-one-batch loss curve: a clean collapse to ~0 (green) means the wiring is correct; a flat line means no signal is reaching the weights (wiring bug); an erratic saw-tooth means gradients are accumulating (forgot zero_grad); an upward blow-up to NaN means exploding gradients (lower lr, clip). The healthy curve uses real numbers from the lesson's loop; the three failure curves are illustrative but qualitatively honest.",
    code: `import torch
import torch.nn as nn

# The HEALTHY overfit-one-batch curve: train on ONE fixed batch and
# watch the loss collapse to ~0. That collapse is the pass condition --
# it proves the forward pass, loss, backward(), and optimizer are wired.
torch.manual_seed(0)
model = nn.Sequential(nn.Linear(20, 32), nn.ReLU(), nn.Linear(32, 3))
opt = torch.optim.Adam(model.parameters(), lr=1e-2)
loss_fn = nn.CrossEntropyLoss()           # raw logits + long indices
xb = torch.randn(16, 20)
yb = torch.randint(0, 3, (16,))           # class indices in [0, 2]

steps, losses = [], []
for step in range(201):
    opt.zero_grad()                       # forgetting this -> the saw-tooth variant
    loss = loss_fn(model(xb), yb)
    loss.backward(); opt.step()
    if step in (0, 10, 25, 50, 75, 100, 125, 150, 200):
        steps.append(step); losses.append(round(loss.item(), 5))
        print(step, round(loss.item(), 5))
print("final:", round(loss.item(), 5), "(~0 -> wiring is correct)")

import matplotlib.pyplot as plt
plt.plot(steps, losses, color="#7ee787", label="loss on one fixed batch")
plt.xlabel("step"); plt.ylabel("cross-entropy loss")
plt.title("Healthy: overfit one batch -> loss collapses to ~0")
plt.legend(); plt.show()`
  };
})();
