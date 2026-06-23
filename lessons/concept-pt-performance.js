/* PyTorch (a complete course) — "Making PyTorch FAST: compile, AMP, DataLoader, profiling".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-performance". */
(function () {
  window.LESSONS.push({
    id: "pt-performance",
    title: "Making PyTorch fast: torch.compile, mixed precision, DataLoader, and profiling",
    tagline: "Profile first, then speed up: one-line torch.compile, mixed precision, a well-fed GPU, and fewer CPU/GPU syncs.",
    module: "PyTorch (a complete course)",
    prereqs: ["pt-training-loop", "pt-nn-module", "dl-minibatch"],

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
        q: `Your model trains at 30% GPU utilization (per <code>nvidia-smi</code>) and an epoch is slow. Your DataLoader uses <code>num_workers=0</code> and you copy each batch with plain <code>batch.to("cuda")</code>. What is the bottleneck, and what two changes fix it?`,
        steps: [
          { do: `Read the symptom: low GPU utilization with a slow epoch.`, why: `A starved GPU sits idle waiting for the next batch &mdash; the bottleneck is data loading, not compute.` },
          { do: `Note <code>num_workers=0</code> means the main process loads batches serially with no overlap.`, why: `With zero workers the GPU waits while the CPU prepares each batch; nothing runs in parallel.` },
          { do: `Set <code>num_workers&gt;0</code> and <code>pin_memory=True</code>, and copy with <code>batch.to("cuda", non_blocking=True)</code>.`, why: `Worker subprocesses prefetch the next batches while the GPU computes the current one; pinned memory plus non_blocking lets the copy overlap too.` }
        ],
        answer: `<p>The GPU is <b>starving for data</b> &mdash; low utilization with a slow epoch is the signature of a data-loading bottleneck, and <code>num_workers=0</code> confirms it (batches load serially on the main process). Fix it two ways: (1) raise <code>num_workers</code> (e.g. to 4&ndash;8) and set <code>pin_memory=True</code> in the DataLoader so batches are prefetched in parallel into page-locked memory; (2) copy with <code>batch.to("cuda", non_blocking=True)</code> so the transfer overlaps compute. GPU utilization should jump and the epoch should shrink. See <code>pt-data</code> for the full pipeline.</p>`
      },
      {
        q: `A teammate added <code>model = torch.compile(model)</code> expecting a speedup, but training got <i>slower</i> and the log shows repeated "recompiling" messages. Their batch size varies every step (they drop the last partial batch sometimes, pad differently others). What is happening and how do they fix it?`,
        steps: [
          { do: `Recall <code>torch.compile</code> specializes the compiled graph on the input shapes it sees.`, why: `The fast path is a graph compiled for specific shapes; a new shape is a cache miss.` },
          { do: `Connect the varying batch size to the "recompiling" messages.`, why: `Each new batch shape triggers a fresh, expensive compilation, so they pay the compile cost over and over instead of reusing it.` },
          { do: `Make shapes stable (fixed batch size, <code>drop_last=True</code>, pad to a constant length) or pass <code>dynamic=True</code>.`, why: `Stable shapes let one compiled graph be reused; <code>dynamic=True</code> compiles a shape-flexible graph that tolerates variation.` }
        ],
        answer: `<p><code>torch.compile</code> compiles a graph specialized to the input <b>shapes</b>. Because the batch size keeps changing, every new shape is a cache miss that triggers another expensive recompile &mdash; so the model spends its time compiling, not training. Fix: keep shapes constant (fix the batch size, set <code>drop_last=True</code>, pad sequences to a fixed length), or compile with <code>torch.compile(model, dynamic=True)</code> to get one shape-flexible graph. Then the compile cost is paid once and the speedup shows up.</p>`
      },
      {
        q: `You want an effective batch size of 256 but only 64 fits in GPU memory. Without buying more hardware, how do you train as if the batch were 256, and what is the one detail people get wrong?`,
        steps: [
          { do: `Recognize this is what gradient accumulation is for.`, why: `Summing gradients over several small (micro) batches before stepping reproduces the gradient of one large batch.` },
          { do: `Run 4 micro-batches of 64, calling <code>.backward()</code> each (grads accumulate) and <code>optimizer.step()</code> + <code>zero_grad()</code> only after the 4th.`, why: `Because <code>4 × 64 = 256</code>, four accumulated micro-batch gradients equal one 256-sample gradient.` },
          { do: `Divide each micro-batch loss by 4 (the accumulation count) before <code>.backward()</code>.`, why: `Without the division the accumulated gradient is the sum, not the average, so it is 4× too large &mdash; this is the detail people forget.` }
        ],
        answer: `<p>Use <b>gradient accumulation</b>: process 4 micro-batches of 64 (since $4\\times64=256$), call <code>loss.backward()</code> after each so gradients accumulate, and only call <code>optimizer.step()</code> then <code>optimizer.zero_grad()</code> after the 4th. The detail people get wrong: <b>scale each micro-batch loss by <code>1/4</code></b> before <code>.backward()</code> &mdash; otherwise you accumulate the <i>sum</i> of four gradients instead of the average of a 256-batch, making the effective gradient (and learning rate) 4&times; too large. With the division, it matches a true batch of 256.</p>`
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
