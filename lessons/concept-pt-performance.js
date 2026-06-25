/* PyTorch (a complete course) — "Making PyTorch FAST: compile, AMP, DataLoader, profiling".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-performance". */
(function () {
  window.LESSONS.push({
    id: "pt-performance",
    title: "Making PyTorch fast: torch.compile, mixed precision, DataLoader, and profiling",
    tagline: "Profile first, then speed up: one-line torch.compile, mixed precision, a well-fed GPU, and fewer CPU/GPU syncs.",
    module: "PyTorch (a complete course)",
    template: "pytorch",
    prereqs: ["pt-training-loop", "pt-nn-module", "dl-minibatch"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>profile a real training run with <code>torch.profiler</code> and read the top operators by time, so you optimize the stage that is actually slow;</li>
<li>apply the cheap wins in order — <code>torch.compile(model)</code>, a well-fed <code>DataLoader</code> (<code>num_workers</code>, <code>pin_memory</code>, <code>non_blocking</code>), and <code>torch.no_grad()</code> at inference — and prove each one helped;</li>
<li>remove the two silent throughput killers: per-step host/device syncs (<code>.item()</code> in the hot loop) and Python loops over the batch, and use gradient accumulation for a large effective batch on small memory.</li>
</ul>
<p><b>The API you'll own:</b> <code>torch.compile</code>, <code>torch.profiler.profile</code>, <code>torch.no_grad</code>, <code>torch.backends.cudnn.benchmark</code>, <code>DataLoader(num_workers=, pin_memory=)</code>, <code>.to(device, non_blocking=True)</code>, <code>loss.detach()</code> vs <code>.item()</code>.</p>`,

    concept: `<p>Training speed is a <b>pipeline</b>: load a batch on the CPU (Central Processing Unit), copy it to the GPU (Graphics Processing Unit), then run the forward and backward pass on the GPU. The whole thing runs only as fast as its slowest, un-overlapped stage — so making PyTorch fast is mostly about <b>removing stalls</b> so every stage stays busy. The setup of that pipeline is the subject of <code>pt-training-loop</code> and <code>pt-data</code>; this lesson is the <i>tuning</i> view: which knob to turn, in what order, and how to prove it helped.</p>
<p>One rule governs everything here: <b>profile first.</b> Run the real workload through <code>torch.profiler</code>, find the actual bottleneck, then fix <i>that</i>. Most "obvious" guesses are wrong — people tune the matrix multiply when the GPU is actually starving for data. Optimize a <i>working</i> model, never a broken one.</p>
<p>Every speedup is one of two moves:</p>
<ul>
<li><b>Do less work.</b> Lower precision with mixed precision / AMP (Automatic Mixed Precision — see <code>pt-gpu-amp</code>) shrinks the cost of each operation; a fused, compiled graph via <code>torch.compile</code> shrinks the <i>number</i> of operations.</li>
<li><b>Waste less time.</b> Overlap data loading with compute (more <code>num_workers</code>, <code>pin_memory</code>, <code>non_blocking=True</code> copies), avoid host/device syncs in the hot loop, and use a batch big enough to fill the GPU (see <code>dl-minibatch</code>).</li>
</ul>
<p>Because these attack <i>different</i> stages of the pipeline, their speedups multiply rather than overlap — which is exactly why stacking them pays off.</p>`,

    apiTable: [
      { sig: "torch.profiler.profile(activities=...)", does: "Records per-operator CPU and CUDA time. Print <code>key_averages().table(...)</code> to see the real bottleneck — <b>do this before optimizing anything</b>.", snippet: "with profile(activities=acts) as prof:\n    one_step(xb, yb)" },
      { sig: "torch.compile(model)", does: "PyTorch 2.x: traces and JIT (Just-In-Time) compiles the model's graph into fused, optimized kernels. One line, often a large speedup; the first call compiles.", snippet: "model = torch.compile(model)" },
      { sig: "torch.backends.cudnn.benchmark = True", does: "For <i>fixed</i> input sizes, cuDNN benchmarks and caches its fastest convolution algorithm. A free win when shapes don't change.", snippet: "torch.backends.cudnn.benchmark = True" },
      { sig: "torch.no_grad()", does: "Disables autograd graph construction. Wrap inference in it to skip the memory and time of tracking gradients.", snippet: "with torch.no_grad():\n    out = model(x)" },
      { sig: "DataLoader(num_workers=, pin_memory=)", does: "<code>num_workers&gt;0</code> prefetches batches in parallel so the GPU never waits; <code>pin_memory=True</code> page-locks host memory for fast async copies.", snippet: "DataLoader(ds, num_workers=4, pin_memory=True)" },
      { sig: "x.to(device, non_blocking=True)", does: "Copies a tensor to the GPU asynchronously instead of stalling the host. Only overlaps when the source is in pinned memory.", snippet: "xb = xb.to(device, non_blocking=True)" },
      { sig: "loss.detach()  vs  loss.item()", does: "<code>.item()</code> forces a host/device sync every call; <code>.detach()</code> keeps the running total on the GPU. Accumulate with <code>detach</code>, <code>.item()</code> once at the end.", snippet: "running += loss.detach()   # not .item()" },
      { sig: "loss = loss / accum_steps; loss.backward()", does: "Gradient accumulation: sum gradients over several micro-batches, dividing each loss by <code>accum_steps</code>, then step once — the math of one big batch on small memory.", snippet: "loss = loss_fn(out, yb) / accum_steps\nloss.backward()" },
      { sig: "opt.zero_grad(set_to_none=True)", does: "Clears gradients before the next step; <code>set_to_none=True</code> is cheaper than writing zeros.", snippet: "opt.zero_grad(set_to_none=True)" }
    ],

    codeTour: [
      {
        explain: `<b>Set the free win and build the model.</b> <code>cudnn.benchmark = True</code> lets cuDNN cache its fastest algorithm when input shapes are fixed. We pick a device once and build a tiny synthetic dataset and model so the tour runs fast on Colab's free tier.`,
        code: `import torch\nimport torch.nn as nn\n\ntorch.manual_seed(0)\ndevice = "cuda" if torch.cuda.is_available() else "cpu"\ntorch.backends.cudnn.benchmark = True   # free win for FIXED input sizes\n\nN, D, C = 4096, 256, 10\nX = torch.randn(N, D)\ny = torch.randint(0, C, (N,))\nmodel = nn.Sequential(nn.Linear(D, 512), nn.ReLU(), nn.Linear(512, C)).to(device)\nloss_fn = nn.CrossEntropyLoss()\nopt = torch.optim.Adam(model.parameters(), lr=1e-3)\nprint("device:", device, "| params:", sum(p.numel() for p in model.parameters()))`,
        output: `device: cpu | params: 136714`
      },
      {
        explain: `<b>Profile first — measure before you optimize.</b> Wrap a handful of steps in <code>torch.profiler.profile</code> and print the top operators by time. The table tells you whether the cost is in the forward, the backward, or data movement. The exact rows depend on your hardware (CPU vs GPU), so treat the layout, not the millisecond values, as canonical.`,
        code: `from torch.profiler import profile, record_function, ProfilerActivity\n\ndef one_step(xb, yb):\n    xb = xb.to(device, non_blocking=True)\n    yb = yb.to(device, non_blocking=True)\n    opt.zero_grad(set_to_none=True)\n    with record_function("forward"):\n        loss = loss_fn(model(xb), yb)\n    with record_function("backward"):\n        loss.backward()\n    opt.step()\n    return loss\n\nxb, yb = X[:256], y[:256]\nacts = [ProfilerActivity.CPU] + ([ProfilerActivity.CUDA] if device == "cuda" else [])\nwith profile(activities=acts, record_shapes=True) as prof:\n    for _ in range(5):\n        one_step(xb, yb)\nsort_key = "cuda_time_total" if device == "cuda" else "cpu_time_total"\nprint(prof.key_averages().table(sort_by=sort_key, row_limit=5))`,
        output: `-------------------  ------------  ------------  ------------\n               Name    Self CPU %      Self CPU    # of Calls\n-------------------  ------------  ------------  ------------\n           backward        38.1%       7.412ms             5\n            forward        29.7%       5.770ms             5\n         aten::addmm       18.4%       3.580ms            30\n          aten::relu        6.2%       1.205ms             5\n     Optimizer.step        7.6%       1.480ms             5\n-------------------  ------------  ------------  ------------\nSelf CPU time total: 19.447ms`
      },
      {
        explain: `<b>torch.compile — one line, fused graph.</b> A tracer captures <code>forward</code> as a single graph and a backend compiler fuses adjacent ops into fewer, faster kernels. The first call compiles (slow); every later call reuses the compiled graph, so warm it up once.`,
        code: `model = torch.compile(model)        # PyTorch 2.x\n_ = one_step(xb, yb)                 # triggers the one-time compile\nprint("compiled and warmed up")`,
        output: `compiled and warmed up`
      },
      {
        explain: `<b>An efficient DataLoader keeps the GPU fed.</b> <code>num_workers&gt;0</code> prefetches batches in parallel with compute; <code>pin_memory</code> page-locks host memory so the CPU&rarr;GPU copy can overlap; <code>drop_last</code> keeps a fixed batch shape (which also avoids <code>torch.compile</code> recompiles).`,
        code: `from torch.utils.data import DataLoader, TensorDataset\n\nloader = DataLoader(\n    TensorDataset(X, y),\n    batch_size=64, shuffle=True,\n    num_workers=4,\n    pin_memory=(device == "cuda"),\n    drop_last=True,           # fixed batch shape -> no recompiles\n)\nprint("batches per epoch:", len(loader))   # 4096 // 64`,
        output: `batches per epoch: 64`
      },
      {
        explain: `<b>Gradient accumulation + no per-step sync.</b> Sum gradients over <code>accum_steps</code> micro-batches (dividing each loss by <code>accum_steps</code> so accumulation equals an <i>average</i>), then step once — the statistics of a large batch on small memory. Accumulate the running loss with <code>.detach()</code> so it stays on the GPU, and call <code>.item()</code> exactly once at the end.`,
        code: `accum_steps = 4               # effective batch = 64 * 4 = 256\nopt.zero_grad(set_to_none=True)\nrunning = torch.zeros((), device=device)   # on-device: no per-step sync\n\nfor i, (xb, yb) in enumerate(loader):\n    xb = xb.to(device, non_blocking=True)\n    yb = yb.to(device, non_blocking=True)\n    loss = loss_fn(model(xb), yb) / accum_steps   # scale -> average, not sum\n    loss.backward()                                # grads ACCUMULATE\n    running += loss.detach()                       # stays on GPU; no .item() here\n    if (i + 1) % accum_steps == 0:\n        opt.step()\n        opt.zero_grad(set_to_none=True)\n    if i >= 4 * accum_steps:\n        break\nprint("avg micro-batch loss:", round((running / (i + 1)).item(), 4))`,
        output: `avg micro-batch loss: 0.5793`
      }
    ],

    expected: `<p>Run the tour top to bottom in Colab and read each printed line against its note:</p>
<ul>
<li>The setup line confirms the <code>device</code> (<code>cpu</code> on a free runtime, <code>cuda</code> on a GPU one) and the parameter count — a sanity check that the model built.</li>
<li>The profiler table is the most important output: read the top rows by self time to find the bottleneck before you touch anything. The exact operators and millisecond values are <b>GPU- and hardware-dependent</b> — on a CPU runtime you sort by <code>cpu_time_total</code>, on a GPU by <code>cuda_time_total</code> — so use it as a relative ranking, not an absolute benchmark.</li>
<li><code>compiled and warmed up</code> appears only after the <i>first</i> call finishes compiling; that first call is deliberately slow, and later calls reuse the graph.</li>
<li><code>batches per epoch: 64</code> is <code>4096 // 64</code> with <code>drop_last=True</code> — proof the loader is dividing the data into fixed-shape batches.</li>
<li>The final averaged loss is a small finite number; the point is that it printed <i>once</i>, from a single end-of-loop <code>.item()</code>, instead of fifty per-step syncs.</li>
</ul>
<p>If your numbers don't match a teammate's, set <code>torch.manual_seed(0)</code> first; throughput figures in particular depend heavily on your GPU, model, and data.</p>`,

    cheatsheet: [
      { code: "with profile(activities=acts) as prof: ...", note: "<b>profile first</b> — print <code>prof.key_averages().table(...)</code>" },
      { code: "model = torch.compile(model)", note: "one line; first call compiles, then reuses the graph" },
      { code: "torch.backends.cudnn.benchmark = True", note: "free win for fixed input sizes" },
      { code: "with torch.no_grad(): out = model(x)", note: "inference: skip the autograd graph" },
      { code: "DataLoader(ds, num_workers=4, pin_memory=True)", note: "feed the GPU — prefetch + fast async copies" },
      { code: "xb = xb.to(device, non_blocking=True)", note: "async copy; only overlaps with pinned memory" },
      { code: "running += loss.detach()", note: "accumulate on-device; <code>.item()</code> once at the end" },
      { code: "loss = loss_fn(out, y) / accum_steps", note: "gradient accumulation — divide so it's an average" },
      { code: "opt.zero_grad(set_to_none=True)", note: "cheaper than zeroing the grads" }
    ],

    deeper: `<p>Two of these knobs have their own concept lessons where the mechanics live:</p>
<ul>
<li><a onclick="App.open('pt-gpu-amp')">mixed precision (AMP)</a> — how half precision stays fast while a <code>GradScaler</code> keeps full-precision accumulation stable;</li>
<li><a onclick="App.open('pt-data')">the Dataset / DataLoader pipeline</a> — how batches are built and fed, the stage <code>num_workers</code> and <code>pin_memory</code> tune;</li>
<li><a onclick="App.open('pt-training-loop')">the training loop</a> — the loop these optimizations wrap around;</li>
<li><a onclick="App.open('dl-minibatch')">mini-batch gradient descent</a> — why batch size matters for both statistics and GPU utilization.</li>
</ul>
<p>This lesson is the tuning view stitched on top of those: profile, then do-less-work and waste-less-time until the pipeline has no idle stage.</p>`,

    whenToUse:
      `<p><b>Reach for this lesson when training is slow or expensive</b> &mdash; a step takes too long, an epoch
       drags, or your Graphics Processing Unit (GPU) cloud bill is climbing. It is also the lesson to read
       <b>before you scale up</b>: doubling the model or the dataset multiplies every inefficiency you already have.</p>
       <ul>
         <li><b>The one rule that governs everything here: measure first.</b> Profile the real run, find the actual
         bottleneck, then fix <i>that</i>. Most "obvious" guesses are wrong &mdash; people tune the matmul when the
         GPU is actually starving for data.</li>
         <li><b>The cheap wins, roughly in order:</b> wrap the model in <code>torch.compile</code> (one line),
         turn on mixed precision (Automatic Mixed Precision, AMP), and make sure the DataLoader keeps the GPU fed.
         These stack &mdash; each multiplies the throughput of the last.</li>
         <li><b>When NOT to bother:</b> if the run already finishes fast enough, or if you are still debugging
         correctness. Optimize a <i>working</i> model, not a broken one.</li>
       </ul>
       <p>For the math and mechanics behind two of these knobs, see the sibling lessons <code>pt-gpu-amp</code>
       (how mixed precision keeps half-precision fast and full-precision stable) and <code>pt-data</code>
       (the <code>Dataset</code> / <code>DataLoader</code> pipeline). This lesson is the <i>tuning</i> view: which
       knob to turn, in what order, and how to prove it helped.</p>`,

    application:
      `<p>Performance tuning shows up at every stage of real model building.</p>
       <ul>
         <li><b>Training large models.</b> <code>torch.compile</code> plus AMP is now standard for transformers and
         large Convolutional Neural Networks (CNNs) &mdash; often a 1.5&times; to 2&times; speedup for two lines of code.</li>
         <li><b>Keeping expensive GPUs busy.</b> A rented A100 costs the same whether it is at 95% utilization or 20%.
         An efficient DataLoader (<code>num_workers</code>, <code>pin_memory</code>, prefetch) and
         <code>non_blocking=True</code> transfers keep it fed so you are not paying for idle silicon.</li>
         <li><b>Fitting a bigger effective batch.</b> When the batch you want will not fit in memory,
         <b>gradient accumulation</b> lets you sum gradients over several small batches before stepping &mdash; the
         same math as one large batch.</li>
         <li><b>Finding the real bottleneck.</b> The PyTorch Profiler (<code>torch.profiler</code>) tells you where the
         time actually goes &mdash; data loading, the forward pass, a single slow operator, or host/device syncs &mdash;
         so you optimize the thing that matters.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Optimizing without profiling.</b> The classic mistake: you guess the bottleneck, spend a day tuning it,
         and throughput barely moves &mdash; because the real cost was somewhere else. <b>Always profile first</b> with
         <code>torch.profiler</code> and read the top ops by time before changing anything.</li>
         <li><b>Python loops over the batch.</b> Looping in Python over each example (or each element) drops you off the
         fast C++/Compute Unified Device Architecture (CUDA) path and serializes the work. <b>Vectorize:</b> do it as one
         tensor operation over the whole batch. A batched matmul is hundreds of times faster than a Python <code>for</code>.</li>
         <li><b>Data loading starving the GPU.</b> If <code>num_workers=0</code>, the main process loads each batch
         while the GPU sits idle. The tell-tale sign is <b>low GPU utilization</b> (check <code>nvidia-smi</code>).
         Fix: raise <code>num_workers</code> and set <code>pin_memory=True</code> so loading overlaps compute.</li>
         <li><b>Syncing every step.</b> Calling <code>loss.item()</code>, <code>.cpu()</code>, or <code>print(tensor)</code>
         every iteration forces the GPU to finish and hand a value back to the Central Processing Unit (CPU) &mdash; a
         <b>host/device sync</b> that stalls the pipeline. Accumulate on-device and only <code>.item()</code> once at the
         end of an epoch (e.g. for logging).</li>
         <li><b><code>torch.compile</code> recompiling on changing shapes.</b> Compile specializes on input shapes. If your
         batch size or sequence length keeps changing, it recompiles repeatedly and you lose the win. Use fixed shapes
         (pad/bucket), or pass <code>dynamic=True</code> to compile a shape-flexible graph.</li>
         <li><b>Tiny batches under-using the GPU.</b> A GPU is a wide parallel machine; a batch of 4 leaves most of it
         idle. Use the largest batch that fits, and use gradient accumulation if you need a still-larger effective batch.</li>
         <li><b>Ignoring <code>pin_memory</code> / <code>non_blocking</code>.</b> Without pinned (page-locked) host memory
         and <code>non_blocking=True</code>, the CPU&rarr;GPU copy is synchronous and cannot overlap with compute. Together
         they let the transfer happen in the background.</li>
       </ul>`,

    bigIdea:
      `<p>Training speed is a <b>pipeline</b>: load a batch on the CPU &rarr; copy it to the GPU &rarr; run forward and
       backward on the GPU. The whole thing runs at the speed of its slowest, un-overlapped stage. Making PyTorch fast
       is mostly about <b>removing stalls</b> so every stage stays busy.</p>
       <p>Two complementary moves: <b>do less work</b> (lower precision via AMP, a fused/compiled graph via
       <code>torch.compile</code>) and <b>waste less time</b> (overlap data loading with compute, avoid host/device
       syncs, use a big enough batch). And before any of it: <b>profile</b>, so you spend effort on the stage that is
       actually slow.</p>`,

    buildup:
      `<p>A practical tuning order, each step measured against the last:</p>
       <ol>
         <li><b>Profile the baseline.</b> Run <code>torch.profiler</code> for a few steps and print the top ops by time.
         Note whether the cost is in data loading, compute, or syncs.</li>
         <li><b>Free wins.</b> Set <code>torch.backends.cudnn.benchmark = True</code> for fixed input sizes (cuDNN
         &mdash; the CUDA Deep Neural Network library &mdash; picks its fastest algorithm). Wrap the model:
         <code>model = torch.compile(model)</code>.</li>
         <li><b>Mixed precision.</b> Run the forward/backward under <code>torch.autocast</code> with a
         <code>GradScaler</code> (see <code>pt-gpu-amp</code>). Half precision is faster and uses less memory.</li>
         <li><b>Feed the GPU.</b> Raise <code>num_workers</code>, set <code>pin_memory=True</code>, and move batches with
         <code>.to(device, non_blocking=True)</code> so loading overlaps compute.</li>
         <li><b>Stop syncing.</b> Accumulate loss on-device; call <code>.item()</code> once per epoch, not per step.</li>
         <li><b>Bigger effective batch.</b> If memory is the limit, use gradient accumulation.</li>
       </ol>`,

    symbols: [
      { sym: "<code>torch.compile(model)</code>", desc: "PyTorch 2.x: traces and Just-In-Time (JIT) compiles the model's graph into fused, optimized kernels. One line, often a large speedup." },
      { sym: "<code>cudnn.benchmark</code>", desc: "when True and input sizes are fixed, cuDNN benchmarks and caches the fastest convolution algorithm for those shapes." },
      { sym: "<code>num_workers</code>", desc: "DataLoader subprocesses that prepare batches in parallel with GPU compute, so the GPU never waits on the CPU." },
      { sym: "<code>pin_memory</code>", desc: "page-locked host memory; required for fast, overlappable (non_blocking) CPU→GPU transfers." },
      { sym: "<code>non_blocking=True</code>", desc: "lets a CPU→GPU copy run asynchronously in the background instead of stalling the host." },
      { sym: "<code>torch.profiler</code>", desc: "the PyTorch Profiler: records per-operator CPU and CUDA time so you can find the real bottleneck." }
    ],

    formula: `$$\\text{loss}_{\\text{scaled}} = \\frac{1}{N}\\sum_{i=1}^{N}\\ell_i,\\qquad \\text{step every } N \\text{ micro-batches}$$`,
    whatItDoes:
      `<p>This is the <b>gradient-accumulation</b> identity. Here $\\ell_i$ is the loss on micro-batch $i$, and $N$ is
       how many small (micro) batches you sum before taking one optimizer step. Dividing each micro-batch loss by $N$
       before <code>.backward()</code> makes the accumulated gradient equal the gradient of one big batch of $N$ times
       the size &mdash; so you get the statistics of a large batch without the memory of one. ($\\sum$ means "sum over",
       and the bar over the sum is the average.)</p>`,

    derivation:
      `<p><b>What <code>torch.compile</code> does under the hood.</b></p>
       <ul class="steps">
         <li>Plain "eager" PyTorch runs your model one operation at a time: each <code>+</code>, <code>relu</code>,
         <code>matmul</code> launches its own GPU kernel. Lots of small launches means lots of overhead and lots of
         reading/writing intermediate tensors to memory.</li>
         <li><code>torch.compile</code> uses a tracer (TorchDynamo) to capture your <code>forward</code> as a single
         <b>graph</b> of operations, then a backend compiler (TorchInductor) <b>fuses</b> adjacent ops into one kernel
         and generates optimized code. Fewer launches, less memory traffic, faster.</li>
         <li>The first call is slow &mdash; it compiles &mdash; then later calls reuse the compiled graph. This is why a
         changing input shape hurts: a new shape triggers a fresh compile.</li>
       </ul>
       <p><b>Why AMP and a fed GPU stack on top.</b> AMP shrinks the per-op cost (half precision); compile shrinks the
       number of ops; and overlapped data loading removes the idle gaps between batches. They attack different parts of
       the pipeline, so their speedups multiply rather than overlap &mdash; which is exactly what the chart below shows.</p>`,

    example:
      `<p>A concrete sync trap. Suppose each training step you write
       <code>running += loss.item()</code> just to keep a running total.</p>
       <ul class="steps">
         <li><code>loss</code> lives on the GPU and may not be finished computing yet. <code>.item()</code> forces the
         CPU to <b>wait</b> for the GPU, copy one number back, and only then continue &mdash; a host/device sync, every
         single step.</li>
         <li>The fix: keep the total on the GPU &mdash; <code>running += loss.detach()</code> &mdash; and call
         <code>.item()</code> <b>once</b>, at the end of the epoch, when you actually want to log the number.</li>
         <li>On a fast model the per-step sync can cost more than the backward pass itself. Removing it is free speed.</li>
       </ul>`,

    practice: [
      {
        q: `<b>Type this in Colab.</b> Show that <code>torch.no_grad()</code> matters at inference. Build <code>model = nn.Sequential(nn.Linear(10, 5))</code> and <code>x = torch.randn(4, 10)</code> (seed 0). Run the forward pass once normally and once inside <code>with torch.no_grad():</code>, and print <code>out.requires_grad</code> for each.`,
        steps: [
          { do: `Run the same forward outside and inside <code>torch.no_grad()</code>.`, why: `<code>no_grad</code> disables autograd graph construction, so at inference you skip the memory and time cost of tracking gradients.` },
          { do: `Print <code>out.requires_grad</code> in each case.`, why: `It is <code>True</code> normally and <code>False</code> under no_grad — proving the graph is not being built.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
torch.manual_seed(0)
model = nn.Sequential(nn.Linear(10, 5))
x = torch.randn(4, 10)

out1 = model(x)
print(out1.requires_grad)        # True  -- graph built (wasteful at inference)
with torch.no_grad():
    out2 = model(x)
print(out2.requires_grad)        # False -- no graph, less memory/time</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Time a Python-loop sum over a batch versus a vectorized one. For <code>x = torch.randn(10000, 64)</code> (seed 0), compute row sums two ways: a Python <code>for</code> loop appending <code>x[i].sum()</code>, and <code>x.sum(dim=1)</code>. Use <code>time.perf_counter()</code> and print both durations, then confirm the results match with <code>torch.allclose</code>.`,
        steps: [
          { do: `Time both approaches with <code>time.perf_counter()</code>.`, why: `Python-level loops drop off the fast vectorized path and serialize the work — the vectorized op is dramatically faster.` },
          { do: `Verify equality with <code>torch.allclose</code>.`, why: `Same answer, far less time: the lesson is to vectorize over the batch, never loop element by element.` }
        ],
        answer: `<pre><code>import time
torch.manual_seed(0)
x = torch.randn(10000, 64)

t0 = time.perf_counter()
loop = torch.stack([x[i].sum() for i in range(x.shape[0])])
t_loop = time.perf_counter() - t0

t0 = time.perf_counter()
vec = x.sum(dim=1)
t_vec = time.perf_counter() - t0

print(f"loop: {t_loop*1e3:.1f} ms, vec: {t_vec*1e3:.3f} ms")  # vec is much faster
print(torch.allclose(loop, vec))                               # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Demonstrate the <code>.item()</code> hot-loop sync trap as code. Given a tensor loss each step, accumulate a running total TWO ways: <code>running += loss.item()</code> (Python float) versus <code>running += loss.detach()</code> (stays a tensor). Use a list of 3 fake losses <code>[torch.tensor(2.0), torch.tensor(1.0), torch.tensor(0.5)]</code> and print the type of each running total.`,
        steps: [
          { do: `Accumulate with <code>loss.detach()</code> and only call <code>.item()</code> once at the end.`, why: `On a GPU, <code>.item()</code> forces a host/device sync every step; keeping the total on-device avoids the stall.` },
          { do: `Print <code>type(running)</code> for each.`, why: `The <code>.item()</code> total is a Python float (synced each step); the <code>.detach()</code> total stays a tensor until you sync once.` }
        ],
        answer: `<pre><code>losses = [torch.tensor(2.0), torch.tensor(1.0), torch.tensor(0.5)]

# BAD: .item() every step -> a host/device sync each iteration on GPU
running_bad = 0.0
for loss in losses:
    running_bad += loss.item()
print(type(running_bad), running_bad)      # &lt;class 'float'&gt; 3.5

# GOOD: stay on-device, sync ONCE at the end
running_good = torch.zeros(())
for loss in losses:
    running_good += loss.detach()
print(type(running_good), running_good.item())  # &lt;class 'torch.Tensor'&gt; 3.5</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Implement gradient accumulation and verify the averaging detail. For <code>model = nn.Linear(4, 1)</code> (seed 0), micro-batch <code>x = torch.randn(8, 4)</code>, <code>y = torch.randn(8, 1)</code>, with <code>accum_steps = 4</code>: do 4 backward passes of <code>loss / accum_steps</code> WITHOUT stepping, then print the gradient norm. Compare it to backprop on the full 4&times; data at once.`,
        steps: [
          { do: `Divide each micro-batch loss by <code>accum_steps</code> before <code>backward()</code>, accumulating grads.`, why: `Without the division you accumulate the SUM, not the average — the gradient (and effective lr) is <code>accum_steps</code>x too large.` },
          { do: `Compare to one backward over the concatenated 4&times; batch.`, why: `Done right, accumulated micro-batch grads equal the gradient of one big batch.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Linear(4, 1)
x = torch.randn(8, 4); y = torch.randn(8, 1)
accum_steps = 4

# Accumulate 4 identical micro-batches, scaling each loss by 1/accum_steps
model.zero_grad()
for _ in range(accum_steps):
    loss = ((model(x) - y) ** 2).mean() / accum_steps
    loss.backward()
g_accum = model.weight.grad.norm().item()

# One backward over the full 4x batch (same data repeated)
model.zero_grad()
X = x.repeat(accum_steps, 1); Y = y.repeat(accum_steps, 1)
((model(X) - Y) ** 2).mean().backward()
g_full = model.weight.grad.norm().item()

print(round(g_accum, 5), round(g_full, 5))   # equal -> averaging is correct</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Build an efficient DataLoader. Wrap <code>TensorDataset(torch.randn(256, 10), torch.randint(0, 3, (256,)))</code> in a <code>DataLoader</code> with <code>batch_size=64</code>, <code>num_workers=2</code>, <code>pin_memory=False</code>, <code>drop_last=True</code>. Iterate once and print how many batches you get and the shape of the first batch's inputs. Predict the batch count.`,
        steps: [
          { do: `Set <code>num_workers&gt;0</code> so worker subprocesses prefetch batches in parallel with compute.`, why: `With <code>num_workers=0</code> the GPU waits while the main process loads each batch — the classic starvation bottleneck.` },
          { do: `Predict the batch count: <code>256 // 64 = 4</code> with <code>drop_last=True</code>.`, why: `<code>drop_last</code> keeps a fixed batch shape, which also avoids <code>torch.compile</code> recompiles.` }
        ],
        answer: `<pre><code>from torch.utils.data import DataLoader, TensorDataset
torch.manual_seed(0)
ds = TensorDataset(torch.randn(256, 10), torch.randint(0, 3, (256,)))
loader = DataLoader(ds, batch_size=64, num_workers=2,
                    pin_memory=False, drop_last=True)
batches = list(loader)
print(len(batches))            # 4   (256 // 64, last partial dropped)
print(batches[0][0].shape)     # torch.Size([64, 10])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Move a batch to the chosen device with an asynchronous copy. Pick <code>device = "cuda" if torch.cuda.is_available() else "cpu"</code>, make <code>xb = torch.randn(64, 10)</code>, and copy it with <code>xb.to(device, non_blocking=True)</code>. Print the result's <code>.device</code>. Explain in a comment what <code>non_blocking=True</code> needs to actually help.`,
        steps: [
          { do: `Copy with <code>.to(device, non_blocking=True)</code>.`, why: `<code>non_blocking=True</code> lets the CPU&rarr;GPU transfer run in the background instead of stalling the host.` },
          { do: `Note it only overlaps when the source is in pinned (<code>pin_memory</code>) host memory.`, why: `Without pinned memory the copy is synchronous anyway, so DataLoader <code>pin_memory=True</code> is the partner setting.` }
        ],
        answer: `<pre><code>device = "cuda" if torch.cuda.is_available() else "cpu"
xb = torch.randn(64, 10)
xb = xb.to(device, non_blocking=True)
print(xb.device)        # cuda:0 on a GPU runtime, else cpu
# non_blocking=True only overlaps the copy when xb is in pinned host memory
# (DataLoader pin_memory=True), otherwise the transfer is synchronous.</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Apply <code>torch.compile</code> and confirm it still produces the same numbers. Build <code>model = nn.Sequential(nn.Linear(10, 10), nn.ReLU(), nn.Linear(10, 3))</code> (seed 0), get <code>out_eager = model(x)</code> for <code>x = torch.randn(8, 10)</code>, then <code>compiled = torch.compile(model)</code> and compare <code>compiled(x)</code> with <code>torch.allclose(..., atol=1e-5)</code>.`,
        steps: [
          { do: `Wrap with <code>torch.compile(model)</code> — one line, no other code changes.`, why: `It traces and fuses the graph into optimized kernels; the first call compiles, later calls reuse it.` },
          { do: `Compare compiled vs eager output with <code>torch.allclose</code>.`, why: `Compilation is a speed optimization, not a math change — the outputs must match (up to tiny numerical noise).` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Sequential(nn.Linear(10, 10), nn.ReLU(), nn.Linear(10, 3))
x = torch.randn(8, 10)
out_eager = model(x)

compiled = torch.compile(model)        # PyTorch 2.x; first call compiles
out_compiled = compiled(x)
print(torch.allclose(out_eager, out_compiled, atol=1e-5))   # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Put it together: a small profiled-style training step that avoids the sync trap. Build <code>model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 3))</code>, an Adam optimizer, and loop 50 steps over fixed <code>xb/yb</code> (seed 0), accumulating <code>running</code> with <code>loss.detach()</code> and calling <code>.item()</code> only once at the end. Print the final averaged loss.`,
        steps: [
          { do: `Accumulate the loss on-device with <code>running += loss.detach()</code> inside the loop.`, why: `Calling <code>.item()</code> every step forces a host/device sync; detaching keeps it on the GPU.` },
          { do: `Call <code>.item()</code> exactly once, after the loop.`, why: `One sync at the end (for logging) instead of fifty in the hot loop — free speed on a real GPU.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 3))
opt = torch.optim.Adam(model.parameters(), lr=1e-2)
loss_fn = nn.CrossEntropyLoss()
xb = torch.randn(16, 10); yb = torch.randint(0, 3, (16,))

running = torch.zeros(())
for _ in range(50):
    opt.zero_grad()
    loss = loss_fn(model(xb), yb)
    loss.backward(); opt.step()
    running += loss.detach()           # stays on-device; NO per-step .item()
print("avg loss:", round((running / 50).item(), 4))   # one sync at the end</code></pre>`
      }
    ]
  });

  window.CODE["pt-performance"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A speed-tuning tour you can paste into Google Colab (a GPU runtime makes the wins visible). We
      <b>profile first</b> with <code>torch.profiler</code> and print the top operators by self-CUDA time &mdash; the
      rule is measure before you optimize. Then we apply the stack: <code>torch.backends.cudnn.benchmark = True</code>
      for fixed input sizes, one-line <code>model = torch.compile(model)</code>, an efficient DataLoader
      (<code>num_workers</code>, <code>pin_memory=True</code>, <code>prefetch_factor</code>) with
      <code>non_blocking=True</code> transfers, and a <b>gradient-accumulation</b> loop for a large effective batch.
      For the mixed-precision (AMP) details that pair with this, see the <code>pt-gpu-amp</code> lesson;
      <code>runnable</code> is off because the in-browser engine has no PyTorch.</p>`,
    code: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from torch.profiler import profile, record_function, ProfilerActivity

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# ------------------------------------------------------------
# 0. FREE WIN for FIXED input sizes: let cuDNN pick its fastest
#    convolution algorithm and cache it. (Only helps when the
#    input shape does not change between steps.)
# ------------------------------------------------------------
torch.backends.cudnn.benchmark = True

# A tiny synthetic dataset + model so this runs fast on free Colab.
N, D, C = 4096, 256, 10
X = torch.randn(N, D)
y = torch.randint(0, C, (N,))
model = nn.Sequential(nn.Linear(D, 512), nn.ReLU(), nn.Linear(512, C)).to(device)
loss_fn = nn.CrossEntropyLoss()                 # expects raw logits + class indices
opt = torch.optim.Adam(model.parameters(), lr=1e-3)

# ============================================================
# 1. PROFILE FIRST. Measure before you optimize. Record a few
#    steps and print the top ops by total CUDA (or CPU) time.
# ============================================================
def one_step(xb, yb):
    xb = xb.to(device, non_blocking=True)       # async copy (needs pin_memory)
    yb = yb.to(device, non_blocking=True)
    opt.zero_grad(set_to_none=True)             # set_to_none is cheaper than zeroing
    with record_function("forward"):
        out = model(xb)
        loss = loss_fn(out, yb)
    with record_function("backward"):
        loss.backward()
    opt.step()
    return loss

xb, yb = X[:256], y[:256]
acts = [ProfilerActivity.CPU] + ([ProfilerActivity.CUDA] if device == "cuda" else [])
with profile(activities=acts, record_shapes=True) as prof:
    for _ in range(5):                          # a handful of steps is enough
        one_step(xb, yb)
sort_key = "cuda_time_total" if device == "cuda" else "cpu_time_total"
print(prof.key_averages().table(sort_by=sort_key, row_limit=8))   # <- the bottleneck

# ============================================================
# 2. torch.compile: one line, JIT-compiles + fuses the graph.
#    First call compiles (slow); later calls reuse the graph.
# ============================================================
model = torch.compile(model)                    # PyTorch 2.x
_ = one_step(xb, yb)                            # triggers the one-time compile
print("compiled and warmed up")

# ============================================================
# 3. EFFICIENT DATALOADER: keep the GPU fed.
#    num_workers > 0 prefetches batches in parallel; pin_memory
#    enables fast, overlappable non_blocking transfers.
# ============================================================
loader = DataLoader(
    TensorDataset(X, y),
    batch_size=64,
    shuffle=True,
    num_workers=4,            # subprocesses prepare batches while the GPU computes
    pin_memory=(device == "cuda"),   # page-locked host memory -> fast async copies
    prefetch_factor=2,        # each worker stages 2 batches ahead
    persistent_workers=True,  # don't respawn workers every epoch
    drop_last=True,           # fixed batch shape -> no torch.compile recompiles
)

# ============================================================
# 4. GRADIENT ACCUMULATION: large EFFECTIVE batch on small memory.
#    accum_steps micro-batches of 64 act like one batch of 64*accum.
#    KEY: divide each micro-batch loss by accum_steps (average, not sum).
# ============================================================
accum_steps = 4               # effective batch = 64 * 4 = 256
opt.zero_grad(set_to_none=True)
running = torch.zeros((), device=device)        # accumulate ON-DEVICE: no per-step sync

for i, (xb, yb) in enumerate(loader):
    xb = xb.to(device, non_blocking=True)
    yb = yb.to(device, non_blocking=True)
    loss = loss_fn(model(xb), yb) / accum_steps  # scale so accumulation = average
    loss.backward()                              # grads ACCUMULATE across micro-batches
    running += loss.detach()                     # stays on GPU; do NOT .item() here
    if (i + 1) % accum_steps == 0:               # step once per accum_steps micro-batches
        opt.step()
        opt.zero_grad(set_to_none=True)
    if i >= 4 * accum_steps:                      # short demo run
        break

# Sync to the CPU ONCE, only when we actually need the number to print.
print("avg micro-batch loss:", (running / (i + 1)).item())`
  };

  window.CODEVIZ["pt-performance"] = {
    question: "How much faster does each optimization make training? Training throughput (samples/sec) for baseline vs +AMP vs +torch.compile vs +more DataLoader workers, with each speedup stacking on the previous. ILLUSTRATIVE numbers from a small reproducible model.",
    charts: [{
      type: "bars",
      title: "Training throughput stacks up with each optimization (illustrative)",
      xlabel: "configuration (each adds to the previous)",
      ylabel: "throughput (samples / sec)",
      labels: ["baseline", "+ AMP", "+ torch.compile", "+ more workers"],
      values: [2500, 4500, 6300, 7245],
      valueLabels: ["2,500", "4,500", "6,300", "7,245"],
      colors: ["#8b949e", "#4ea1ff", "#7ee787", "#f2cc60"]
    }],
    caption: "Illustrative throughput from a small reproducible model: a baseline of 2,500 samples/sec, then stacked speedups of 1.8x (AMP), 1.4x (torch.compile), and 1.15x (more DataLoader workers) — plausible per-step factors, not a measured benchmark. They MULTIPLY because each attacks a different stage of the pipeline (per-op precision, op count, idle data-loading gaps), giving ~2.9x end to end. Real numbers depend heavily on your GPU, model, and data; the point is the stacking, so always profile your own run.",
    code: `import numpy as np

# Reproducible, ILLUSTRATIVE model of how throughput stacks.
# Each optimization multiplies the previous throughput by a plausible
# per-step speedup factor (not a measured benchmark on your hardware).
baseline_sps = 2500.0          # samples/sec for an un-optimized training loop
speedups = {                   # each factor stacks on the running total
    "+ AMP":            1.80,  # mixed precision: faster per-op (half precision)
    "+ torch.compile":  1.40,  # fused/compiled graph: fewer kernel launches
    "+ more workers":   1.15,  # DataLoader no longer starves the GPU
}

labels = ["baseline"]
values = [baseline_sps]
cur = baseline_sps
for name, factor in speedups.items():
    cur *= factor              # speedups MULTIPLY (different pipeline stages)
    labels.append(name)
    values.append(round(cur))

for lab, v in zip(labels, values):
    print(f"{lab:18s} {v:8.0f} samples/sec")
print("end-to-end speedup:", round(values[-1] / values[0], 2), "x")
# -> baseline 2500, +AMP 4500, +torch.compile 6300, +more workers 7245 (2.9x)

import matplotlib.pyplot as plt
plt.bar(labels, values, color=["#8b949e", "#4ea1ff", "#7ee787", "#f2cc60"])
plt.ylabel("throughput (samples / sec)")
plt.title("Training throughput stacks up with each optimization (illustrative)")
plt.show()`
  };
})();
