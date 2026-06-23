/* PyTorch (a complete course) — using the GPU and automatic mixed precision (AMP).
   Concept lesson pushed into window.LESSONS; CODE + CODEVIZ keyed by id.
   CODE is real PyTorch meant to run in Google Colab (torch preinstalled; runnable:false here).
   CODEVIZ numbers come from a small reproducible numpy timing model and are labeled ILLUSTRATIVE. */
(function () {
  window.LESSONS.push({
    id: "pt-gpu-amp",
    title: "Using the GPU and mixed precision",
    tagline: "Move the model and every batch to the GPU, then run parts in float16 with AMP for a free ~2x speedup.",
    module: "PyTorch (a complete course)",
    prereqs: ["pt-tensors", "pt-autograd", "dl-backprop", "dl-optimizers"],
    whenToUse: `<p>Reach for the GPU (Graphics Processing Unit) the moment training feels slow, which is almost any non-trivial model.</p>
<ul>
<li><b>Use a GPU</b> for anything bigger than a toy: a convolutional network, a transformer, or even a wide multi-layer perceptron on real data. The GPU does the matrix multiplies (matmuls) and convolutions that dominate deep learning many times faster than the CPU (Central Processing Unit).</li>
<li><b>Use AMP (Automatic Mixed Precision)</b> for nearly all modern GPU training. It runs the heavy math in 16-bit floating point instead of 32-bit, giving roughly a 2x speedup and about half the memory, with little to no accuracy loss. On any recent GPU it is close to a free win.</li>
<li><b>Stay on the CPU</b> only for tiny models, quick debugging, or when no GPU is available. In Google Colab, switch to a GPU runtime first (Runtime &rarr; Change runtime type &rarr; GPU).</li>
</ul>`,
    application: `<p>Every real training run starts with two lines: pick a <code>device</code>, then move the model onto it. From then on, every batch you pull from the DataLoader gets <code>.to(device)</code> before it touches the model. Wrap the forward pass in <code>torch.autocast</code> and the backward pass in a <code>GradScaler</code>, and the same training loop now runs about twice as fast on half the memory. This is the standard setup behind essentially every GPU model you will train.</p>`,
    pitfalls: `<ul>
<li><b>Model on GPU but data on CPU (the #1 GPU bug).</b> If the model is on <code>cuda</code> and the input batch is still on <code>cpu</code> (or the reverse), PyTorch raises <code>RuntimeError: Expected all tensors to be on the same device</code>. Fix: move <i>both</i> the model and <i>every</i> batch with <code>.to(device)</code>.</li>
<li><b>Forgetting <code>.to(device)</code> on a new tensor.</b> A tensor you create inside the loop (a mask, a constant, a target you built by hand) starts on the CPU. Combine it with a GPU tensor and you get the same device-mismatch error. Create it with <code>device=device</code> or move it.</li>
<li><b>Needless transfers inside the loop.</b> Sprinkling <code>.cpu()</code> or <code>.cuda()</code> on tensors every step copies data back and forth across the slow CPU&harr;GPU link and can erase the GPU's speed advantage. Move data onto the device <i>once</i> and keep it there; only bring small results (like <code>loss.item()</code>) back to the CPU.</li>
<li><b>AMP without a GradScaler.</b> In float16, small gradients can underflow to exactly <code>0</code> and the model stops learning. The <code>GradScaler</code> multiplies the loss up before backward and divides the gradients back down afterward, keeping them in range. Use <code>torch.autocast</code> <i>and</i> <code>GradScaler</code> together.</li>
<li><b>Running out of GPU memory.</b> A <code>CUDA out of memory</code> error means the batch plus activations do not fit. Fix: reduce the batch size, turn on AMP (it roughly halves activation memory), or free large tensors you no longer need.</li>
<li><b>Timing the GPU without <code>torch.cuda.synchronize()</code>.</b> GPU work runs asynchronously, so the CPU clock can stop before the GPU finishes. Call <code>torch.cuda.synchronize()</code> before reading the timer, or your measured times are wrong.</li>
</ul>`,
    bigIdea: `<p>Two ideas, stacked. <b>First, put everything on the GPU.</b> A GPU has thousands of small cores that do the same arithmetic on many numbers at once. The matmuls and convolutions at the heart of deep learning are exactly that kind of "do the same thing to a giant grid of numbers" work, so the GPU finishes them far faster than a CPU. <b>Second, use cheaper numbers.</b> Most of that arithmetic does not need full 32-bit precision; 16-bit floats are half the size and run faster on the GPU's specialized units. AMP automatically uses 16-bit where it is safe and 32-bit where it is not.</p>`,
    buildup: `<p>Build it up in layers:</p>
<ul>
<li><b>The device.</b> A tensor lives somewhere: <code>cpu</code> or <code>cuda</code> (an NVIDIA GPU). The one rule is that every tensor in a single operation must share a device. So we pick one device up front and move the model and the data to it.</li>
<li><b>Why the GPU is fast.</b> A CPU has a handful of powerful cores tuned for sequential work. A GPU has thousands of simpler cores built for <b>massive parallelism</b> &mdash; the same operation across a huge array at once. A matmul of two large matrices is millions of independent multiply-adds, perfect for that.</li>
<li><b>The cost of transfers.</b> Moving data between CPU memory and GPU memory crosses a relatively slow bus. One transfer is cheap; thousands per epoch are not. The habit is: <i>move once, keep it on-device.</i></li>
<li><b>Mixed precision.</b> "Precision" is how many bits a number uses. <code>float32</code> is 32 bits; <code>float16</code> (half precision) is 16. Half-precision math is faster and uses half the memory, but its range is small, so gradients can vanish. AMP mixes the two: 16-bit for the bulk math, 32-bit for the sensitive parts, plus a <code>GradScaler</code> to protect the gradients.</li>
</ul>`,
    symbols: [],
    whatItDoes: `<p>The whole pattern in one place: choose a device, move the model and every batch onto it, and run the step under AMP with a scaler guarding the gradients.</p>`,
    derivation: `<p><b>How the pieces work under the API.</b></p>
<ul>
<li><b>The device pattern.</b> <code>device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')</code> picks the GPU when one exists and falls back to the CPU otherwise. The same code then runs in both places &mdash; great for developing on a laptop and training on a GPU.</li>
<li><b>Moving the model.</b> <code>model.to(device)</code> moves every parameter and buffer onto the device <i>in place</i> (modules are moved in place; plain tensors are not, so always reassign: <code>x = x.to(device)</code>).</li>
<li><b>Moving the data.</b> Inside the loop, <code>xb, yb = xb.to(device), yb.to(device)</code> copies each batch over. The model and the batch now share a device, so the forward pass is legal.</li>
<li><b>autocast.</b> <code>with torch.autocast(device_type='cuda', dtype=torch.float16):</code> tells PyTorch to run the operations inside it in float16 where that is safe (matmuls, convolutions) and keep float32 where it matters (reductions, the loss). You do not cast anything by hand.</li>
<li><b>GradScaler.</b> Float16 cannot represent very small numbers, so tiny gradients would become <code>0</code>. The scaler multiplies the loss by a large factor before <code>backward()</code> (so gradients land in float16's range), then unscales them before the optimizer step. <code>scaler.update()</code> adjusts the factor over time. This is what keeps AMP from quietly breaking training.</li>
<li><b><code>cudnn.benchmark</code>.</b> Setting <code>torch.backends.cudnn.benchmark = True</code> lets cuDNN (NVIDIA's deep-learning library) auto-tune the fastest convolution algorithm for your fixed input shapes. It costs a brief warmup, then speeds up every later step. Leave it off if your input sizes change every batch.</li>
<li><b>Beyond one GPU.</b> When a single GPU is not enough, you split work across several with DDP (Distributed Data Parallel) &mdash; a forward-link covered in a later lesson.</li>
</ul>`,
    example: `<p>Turn a CPU step into a fast GPU+AMP step:</p>
<ul>
<li><b>Setup.</b> <code>device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')</code>, then <code>model.to(device)</code> and <code>scaler = torch.cuda.amp.GradScaler()</code>.</li>
<li><b>Per batch.</b> <code>xb, yb = xb.to(device), yb.to(device)</code> &rarr; data joins the model on the GPU.</li>
<li><b>The step.</b> <code>opt.zero_grad()</code>; then <code>with torch.autocast(device_type='cuda', dtype=torch.float16): out = model(xb); loss = loss_fn(out, yb)</code>; then <code>scaler.scale(loss).backward()</code>, <code>scaler.step(opt)</code>, <code>scaler.update()</code>.</li>
<li><b>Result.</b> Same math, same final accuracy, roughly half the time and half the memory &mdash; because the heavy matmuls now run in float16 on the GPU and the scaler keeps the gradients alive.</li>
</ul>`,
    practice: [
      {
        q: `Your model is on the GPU (<code>model.to(device)</code> with <code>device='cuda'</code>), but training crashes on the first batch with <code>RuntimeError: Expected all tensors to be on the same device, but found at least two devices, cuda:0 and cpu</code>. What did you forget?`,
        steps: [
          { do: `Ask where the input batch lives.`, why: `DataLoader hands you CPU tensors by default.` },
          { do: `Compare the batch's device to the model's device.`, why: `Every tensor in one operation must share a device.` }
        ],
        answer: `You moved the model but not the data. Add <code>xb, yb = xb.to(device), yb.to(device)</code> at the top of the loop so the batch is on <code>cuda</code> too. This device mismatch is the most common GPU bug.`
      },
      {
        q: `You switch on AMP with <code>torch.autocast</code> but skip the <code>GradScaler</code>, calling plain <code>loss.backward()</code>. Training runs without error, yet the loss stops improving and the model barely learns. Why, and what is the fix?`,
        steps: [
          { do: `Recall float16's limited range.`, why: `Very small numbers underflow to exactly 0 in float16.` },
          { do: `Think about what happens to tiny gradients.`, why: `Zeroed gradients mean the optimizer makes no real update.` }
        ],
        answer: `Small float16 gradients underflow to <code>0</code>, so the weights barely move. Wrap the backward pass in a scaler: <code>scaler.scale(loss).backward(); scaler.step(opt); scaler.update()</code>. The scaler multiplies the loss up before backward so gradients stay in float16's range, then unscales them for the step.`
      },
      {
        q: `Inside your training loop you call <code>.cpu()</code> on the model output and <code>.cuda()</code> on a freshly built tensor on every step. Training is barely faster on the GPU than on the CPU. What is going on?`,
        steps: [
          { do: `Identify what crosses the CPU&harr;GPU bus each step.`, why: `Each <code>.cpu()</code>/<code>.cuda()</code> is a memory copy across a slow link.` },
          { do: `Count how many such copies happen per epoch.`, why: `Thousands of round-trips can dominate the runtime.` }
        ],
        answer: `The per-step transfers are eating the speedup. Move data onto the device <i>once</i> and keep it there; build new tensors with <code>device=device</code>; and only bring small scalars back, e.g. <code>loss.item()</code>. Avoid <code>.cpu()</code>/<code>.cuda()</code> in the hot loop.`
      }
    ]
  });

  window.CODE["pt-gpu-amp"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>This runs in Google Colab on a GPU runtime (Runtime &rarr; Change runtime type &rarr; GPU; torch is preinstalled). It sets up the device, moves a small model and a synthetic dataset onto it, and runs the AMP training step: <code>torch.autocast</code> for the forward pass and a <code>GradScaler</code> guarding the backward pass. It falls back to the CPU cleanly if no GPU is present, and prints the device, a few losses, and the peak GPU memory used.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# ---- 1) THE DEVICE PATTERN: GPU if available, else CPU ----
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print("using device:", device)

# Speed up convolutions when input shapes are fixed (harmless here; key for CNNs).
torch.backends.cudnn.benchmark = True

# ---- 2) A SMALL MODEL + SYNTHETIC DATA, all on the device ----
model = nn.Sequential(
    nn.Linear(1024, 1024), nn.ReLU(),
    nn.Linear(1024, 1024), nn.ReLU(),
    nn.Linear(1024, 10),
).to(device)                       # MOVE THE MODEL (in place; parameters now on 'device')

opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()    # expects raw logits + integer class labels

# fake dataset: 8 batches of 256 examples, 1024 features, 10 classes
batches = [(torch.randn(256, 1024), torch.randint(0, 10, (256,))) for _ in range(8)]

# AMP only helps on CUDA; enable it exactly when we are on a GPU.
use_amp = (device.type == 'cuda')
scaler = torch.cuda.amp.GradScaler(enabled=use_amp)   # prevents float16 grad underflow

# ---- 3) THE AMP TRAINING STEP ----
model.train()
for epoch in range(3):
    running = 0.0
    for xb, yb in batches:
        xb, yb = xb.to(device), yb.to(device)         # MOVE EVERY BATCH (same device as model!)

        opt.zero_grad()                               # clear last step's grads

        # autocast: run the forward pass in float16 where it is safe
        with torch.autocast(device_type=device.type, dtype=torch.float16, enabled=use_amp):
            out = model(xb)                           # logits, shape [256, 10]
            loss = loss_fn(out, yb)

        scaler.scale(loss).backward()                 # scale up, then backprop
        scaler.step(opt)                              # unscale + optimizer.step()
        scaler.update()                               # adjust the scale factor

        running += loss.item()                        # .item(): a plain float, frees the graph
    print(f"epoch {epoch}  avg loss {running / len(batches):.4f}")

# ---- 4) PEAK GPU MEMORY (only meaningful on CUDA) ----
if device.type == 'cuda':
    torch.cuda.synchronize()                          # wait for the GPU before measuring
    mb = torch.cuda.max_memory_allocated() / 1e6
    print(f"peak GPU memory: {mb:.1f} MB")
`
  };

  window.CODEVIZ["pt-gpu-amp"] = {
    question: "How do training-step time and memory compare for CPU, GPU (FP32), and GPU + AMP?",
    charts: [
      {
        type: "bars",
        title: "Training-step time (lower is better) — illustrative",
        xlabel: "configuration",
        ylabel: "ms per step",
        labels: ["CPU (FP32)", "GPU (FP32)", "GPU + AMP"],
        values: [169.3, 9.4, 4.9],
        valueLabels: ["169.3", "9.4", "4.9"],
        colors: ["#ff7b72", "#4ea1ff", "#7ee787"]
      },
      {
        type: "bars",
        title: "Training-step memory (lower is better) — illustrative",
        xlabel: "configuration",
        ylabel: "relative memory (FP32 = 100)",
        labels: ["CPU (FP32)", "GPU (FP32)", "GPU + AMP"],
        values: [100, 100, 55],
        valueLabels: ["100", "100", "55"],
        colors: ["#ff7b72", "#4ea1ff", "#7ee787"]
      }
    ],
    caption: "Illustrative numbers. The CPU FP32 time is a real numpy measurement of the same matmul-heavy step; the GPU times apply typical matmul speedups (GPU ~18x over this CPU; AMP ~1.9x over GPU FP32), and memory uses the rough rule that AMP roughly halves activation memory. The shape is what matters: the GPU collapses step time, and AMP cuts it again while using about half the memory. FP32 means 32-bit floats; AMP (Automatic Mixed Precision) runs the heavy math in 16-bit.",
    code: `import numpy as np, time

# We MEASURE the CPU FP32 step for real (numpy stands in for the CPU), then derive
# plausible GPU and AMP numbers from typical matmul speedup factors. Labeled illustrative.
rng = np.random.default_rng(0)
B, D = 256, 1024
X  = rng.standard_normal((B, D)).astype(np.float32)
W1 = rng.standard_normal((D, D)).astype(np.float32)
W2 = rng.standard_normal((D, D)).astype(np.float32)

def step():
    h = np.maximum(X @ W1, 0.0)   # linear + ReLU
    return (h @ W2).sum()         # second linear

for _ in range(3): step()          # warmup
N = 20
t0 = time.perf_counter()
for _ in range(N): step()
cpu_ms = (time.perf_counter() - t0) / N * 1000   # measured

gpu_fp32_ms = cpu_ms / 18.0        # GPU ~18x faster on dense matmuls (typical)
gpu_amp_ms  = gpu_fp32_ms / 1.9    # AMP ~1.9x faster than FP32 on tensor cores

print("time ms/step:", [round(cpu_ms, 1), round(gpu_fp32_ms, 1), round(gpu_amp_ms, 1)])
# -> e.g. [169.3, 9.4, 4.9]

# memory: FP32 baseline = 100; AMP keeps float16 activations -> ~0.55x
print("relative memory:", [100, 100, 55])`
  };
})();
