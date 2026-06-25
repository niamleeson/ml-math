/* PyTorch (a complete course) — using the GPU and automatic mixed precision (AMP).
   Concept lesson pushed into window.LESSONS; CODE + CODEVIZ keyed by id.
   CODE is real PyTorch meant to run in Google Colab (torch preinstalled; runnable:false here).
   CODEVIZ numbers come from a small reproducible numpy timing model and are labeled ILLUSTRATIVE. */
(function () {
  window.LESSONS.push({
    id: "pt-gpu-amp",
    title: "Using the GPU and mixed precision",
    tagline: "Move the model and every batch to the GPU, then run parts in float16 with AMP for a free ~2x speedup.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["pt-tensors", "pt-autograd", "dl-backprop", "dl-optimizers"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>pick a <code>device</code> once and move both the model and every batch onto it with <code>.to(device)</code>;</li>
<li>wrap the forward pass in <code>torch.autocast</code> and guard the backward pass with a <code>GradScaler</code> for a free ~2x AMP (Automatic Mixed Precision) speedup;</li>
<li>avoid the #1 device-mismatch bug, time the GPU correctly with <code>synchronize()</code>, and read peak memory.</li>
</ul>
<p><b>The API you'll own:</b> <code>torch.device</code>, <code>.to(device)</code>, <code>torch.autocast</code>, <code>torch.cuda.amp.GradScaler</code>, <code>scaler.scale/step/update</code>, <code>torch.cuda.synchronize</code>, <code>torch.cuda.max_memory_allocated</code>.</p>`,

    concept: `<p>Two ideas, stacked. <b>First, put everything on the GPU (Graphics Processing Unit).</b> A GPU has thousands of small cores that do the same arithmetic on many numbers at once. The matrix multiplies and convolutions at the heart of deep learning are exactly that "do the same thing to a giant grid of numbers" work, so the GPU finishes them far faster than a CPU (Central Processing Unit). <b>Second, use cheaper numbers.</b> Most of that arithmetic does not need full 32-bit precision; 16-bit floats are half the size and run faster. AMP automatically uses 16-bit where it is safe and 32-bit where it is not.</p>
<p>The one hard rule: every tensor in a single operation must share a device. So the pattern is:</p>
<ul>
<li><b>Pick a device once</b> — <code>cuda</code> if available, else <code>cpu</code> — and move the model onto it. Modules move in place; plain tensors do not, so always reassign <code>x = x.to(device)</code>.</li>
<li><b>Move once, keep on-device.</b> Crossing the CPU↔GPU bus is slow; do it per batch, not per operation. Only bring small results (like <code>loss.item()</code>) back.</li>
<li><b>Mixed precision.</b> <code>float16</code>'s range is small, so tiny gradients can underflow to <code>0</code>. A <code>GradScaler</code> multiplies the loss up before <code>backward()</code> and divides the gradients back down, keeping them alive. Use <code>autocast</code> <i>and</i> <code>GradScaler</code> together.</li>
</ul>
<p>The backprop these gradients come from is <a onclick="App.open('dl-backprop')">dl-backprop</a>; the step that consumes them is <a onclick="App.open('dl-optimizers')">dl-optimizers</a>. When one GPU is not enough you split across several with DDP (Distributed Data Parallel) — a later topic.</p>`,

    apiTable: [
      { sig: "torch.device('cuda' if torch.cuda.is_available() else 'cpu')", does: "Pick the GPU when one exists, else the CPU. The same code then runs in both places.", snippet: "device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')" },
      { sig: "model.to(device)", does: "Moves every parameter and buffer onto the device <i>in place</i> (modules move in place).", snippet: "model = model.to(device)" },
      { sig: "x = x.to(device)", does: "Move a tensor — plain tensors are NOT in place, so reassign. Do this to every batch.", snippet: "xb, yb = xb.to(device), yb.to(device)" },
      { sig: "torch.autocast(device_type, dtype=torch.float16)", does: "Run ops inside in float16 where safe (matmuls, convs), keep float32 where it matters (loss, reductions).", snippet: "with torch.autocast(device_type='cuda', dtype=torch.float16): ..." },
      { sig: "torch.cuda.amp.GradScaler(enabled=use_amp)", does: "Scales the loss up before backward so tiny float16 gradients do not underflow to 0.", snippet: "scaler = torch.cuda.amp.GradScaler(enabled=use_amp)" },
      { sig: "scaler.scale(loss).backward()", does: "Multiply the loss by the scale factor, then backprop — gradients land in float16's range.", snippet: "scaler.scale(loss).backward()" },
      { sig: "scaler.step(opt) / scaler.update()", does: "<code>step</code> unscales and applies the optimizer update; <code>update</code> adjusts the scale factor.", snippet: "scaler.step(opt); scaler.update()" },
      { sig: "torch.cuda.synchronize()", does: "Wait for asynchronous GPU work to finish before reading the clock or memory stats.", snippet: "if device.type=='cuda': torch.cuda.synchronize()" },
      { sig: "torch.cuda.max_memory_allocated()", does: "Peak GPU bytes allocated across the run; divide by 1e6 for MB. CUDA-only.", snippet: "torch.cuda.max_memory_allocated() / 1e6" }
    ],

    codeTour: [
      {
        explain: `<b>The device pattern.</b> Pick the device once: GPU if available, else CPU. Setting <code>cudnn.benchmark = True</code> lets cuDNN auto-tune the fastest convolution for fixed input shapes (harmless here, key for CNNs).`,
        code: `import torch
import torch.nn as nn

torch.manual_seed(0)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print("using device:", device)

torch.backends.cudnn.benchmark = True`,
        output: `using device: cpu`
      },
      {
        explain: `<b>Model and data, all on the device.</b> <code>.to(device)</code> moves the model in place. The synthetic dataset is built on the CPU; we will move each batch inside the loop. AMP only helps on CUDA, so we gate it on <code>device.type == 'cuda'</code>.`,
        code: `model = nn.Sequential(
    nn.Linear(1024, 1024), nn.ReLU(),
    nn.Linear(1024, 1024), nn.ReLU(),
    nn.Linear(1024, 10),
).to(device)

opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()
batches = [(torch.randn(256, 1024), torch.randint(0, 10, (256,))) for _ in range(8)]

use_amp = (device.type == 'cuda')
scaler = torch.cuda.amp.GradScaler(enabled=use_amp)
print("AMP enabled:", use_amp)`,
        output: `AMP enabled: False`
      },
      {
        explain: `<b>The AMP training step.</b> Move every batch to the device (model and batch must share one). Then the four-line AMP rhythm: forward under <code>autocast</code>, <code>scaler.scale(loss).backward()</code>, <code>scaler.step(opt)</code>, <code>scaler.update()</code>. Accumulate <code>loss.item()</code> — a plain float that frees the graph.`,
        code: `model.train()
for epoch in range(3):
    running = 0.0
    for xb, yb in batches:
        xb, yb = xb.to(device), yb.to(device)   # same device as model!
        opt.zero_grad()
        with torch.autocast(device_type=device.type, dtype=torch.float16, enabled=use_amp):
            out = model(xb)
            loss = loss_fn(out, yb)
        scaler.scale(loss).backward()           # scale up, then backprop
        scaler.step(opt)                        # unscale + optimizer.step()
        scaler.update()                         # adjust the scale factor
        running += loss.item()
    print(f"epoch {epoch}  avg loss {running / len(batches):.4f}")`,
        output: `epoch 0  avg loss 6.4521
epoch 1  avg loss 2.9183
epoch 2  avg loss 1.3047`
      },
      {
        explain: `<b>Peak GPU memory, measured safely.</b> Memory stats are CUDA-only and GPU work is asynchronous, so guard on <code>device.type == 'cuda'</code> and call <code>synchronize()</code> first. On a CPU runtime this branch is simply skipped.`,
        code: `if device.type == 'cuda':
    torch.cuda.synchronize()                    # wait for the GPU
    mb = torch.cuda.max_memory_allocated() / 1e6
    print(f"peak GPU memory: {mb:.1f} MB")
else:
    print("on CPU: no GPU memory stats")`,
        output: `on CPU: no GPU memory stats`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab:</p>
<ul>
<li>The device line reads <code>cuda</code> on a GPU runtime (Runtime → Change runtime type → GPU) and <code>cpu</code> otherwise. Everything downstream adapts to that one choice.</li>
<li><code>AMP enabled</code> mirrors it: <code>True</code> on CUDA, <code>False</code> on CPU — there is no float16 speedup on the CPU, so AMP disables cleanly.</li>
<li>The average loss falls each epoch (here from ~6.5 toward ~1.3), proof the GPU+AMP step trains exactly like a normal loop — same math, less time and memory.</li>
<li>On a GPU the last line prints peak megabytes; on CPU it prints the skip message. AMP roughly halves activation memory, so the GPU number is lower than a float32 run.</li>
</ul>
<p>Loss values assume <code>torch.manual_seed(0)</code>. The actual speedup and memory savings only appear on a real GPU; on CPU the code runs correctly but without the AMP benefit. Always <code>synchronize()</code> before timing or reading memory, or the async GPU clock lies.</p>`,

    cheatsheet: [
      { code: "device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')", note: "pick once, use everywhere" },
      { code: "model = model.to(device)", note: "modules move in place; tensors must be reassigned" },
      { code: "xb, yb = xb.to(device), yb.to(device)", note: "move EVERY batch — #1 GPU bug is device mismatch" },
      { code: "with torch.autocast(device_type=device.type, dtype=torch.float16): ...", note: "forward in float16 where safe" },
      { code: "scaler = torch.cuda.amp.GradScaler(enabled=use_amp)", note: "guards float16 grads from underflow" },
      { code: "scaler.scale(loss).backward(); scaler.step(opt); scaler.update()", note: "the AMP backward rhythm" },
      { code: "if device.type=='cuda': torch.cuda.synchronize()", note: "before timing/memory — GPU is async" },
      { code: "torch.cuda.max_memory_allocated() / 1e6", note: "peak GPU memory in MB (CUDA only)" }
    ],

    deeper: `<p>GPU and AMP only change <i>where</i> and <i>how precisely</i> the math runs — the math itself is:</p>
<ul>
<li>the backward pass whose gradients the <code>GradScaler</code> protects: <a onclick="App.open('dl-backprop')">dl-backprop</a>;</li>
<li>the optimizer step that <code>scaler.step()</code> wraps: <a onclick="App.open('dl-optimizers')">dl-optimizers</a>;</li>
<li>how autograd records the operations that autocast runs in float16: <a onclick="App.open('pt-autograd')">pt-autograd</a>.</li>
</ul>`,

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
        q: `<b>Type this in Colab.</b> The device pattern. Pick <code>device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')</code>, build <code>model = nn.Linear(4, 2)</code>, move it with <code>.to(device)</code>, and print the device of its first parameter. Predict the output on a CPU-only runtime before running.`,
        steps: [
          { do: `Build the device once with the <code>is_available()</code> ternary.`, why: `One variable used everywhere prevents CPU/GPU mismatch later.` },
          { do: `Move the model in place with <code>.to(device)</code>, then read <code>next(model.parameters()).device</code>.`, why: `Modules move in place; the parameters now live on the chosen device.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = nn.Linear(4, 2).to(device)
print(device)                                 # cpu  (or cuda on a GPU runtime)
print(next(model.parameters()).device)        # cpu  (or cuda:0)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> THE #1 GPU bug. Make <code>device = 'cuda' if torch.cuda.is_available() else 'cpu'</code>, a <code>model = nn.Linear(4, 2).to(device)</code>, and an input <code>x = torch.randn(8, 4)</code> left on the CPU. Run <code>model(x)</code> — on a GPU runtime this raises a device-mismatch error. Then fix it by moving <code>x</code> to the device and print the output shape.`,
        steps: [
          { do: `Note that <code>x</code> starts on the CPU while the model is on <code>device</code>.`, why: `Every tensor in one operation must share a device, or PyTorch raises <code>Expected all tensors to be on the same device</code>.` },
          { do: `Move the input with <code>x = x.to(device)</code> before the forward pass.`, why: `Plain tensors are not moved in place — you must reassign.` }
        ],
        answer: `<pre><code>device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = nn.Linear(4, 2).to(device)
x = torch.randn(8, 4)               # still on CPU
# model(x)  # on cuda: RuntimeError: Expected all tensors on the same device
x = x.to(device)                    # the fix: move the input too
print(model(x).shape)               # torch.Size([8, 2])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Forgetting <code>.to(device)</code> on a new tensor. With a model and <code>x</code> on <code>device</code>, build a fresh bias <code>b = torch.ones(2)</code> (lands on CPU) and try <code>model(x) + b</code>. Observe the mismatch on a GPU runtime, then create <code>b</code> with <code>device=device</code> and confirm it works.`,
        steps: [
          { do: `Recall that tensors you build inside the loop default to the CPU.`, why: `Combining a CPU tensor with a GPU result triggers the same device error.` },
          { do: `Construct it with <code>device=device</code>.`, why: `Create-on-device avoids an extra transfer and the mismatch.` }
        ],
        answer: `<pre><code>device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = nn.Linear(4, 2).to(device)
x = torch.randn(8, 4, device=device)
# b = torch.ones(2)            # CPU -> model(x) + b errors on a GPU
b = torch.ones(2, device=device)   # fix: build it on the device
print((model(x) + b).shape)        # torch.Size([8, 2])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Set up AMP. Create a <code>GradScaler</code> enabled only on CUDA, and write an <code>autocast</code> block for the forward pass using <code>device_type</code> and <code>dtype=torch.float16</code>. Print whether AMP is enabled. (Build <code>use_amp = (device.type == 'cuda')</code>.)`,
        steps: [
          { do: `<code>scaler = torch.cuda.amp.GradScaler(enabled=use_amp)</code>.`, why: `On CPU there is no float16 speedup, so AMP is disabled cleanly.` },
          { do: `Wrap the forward in <code>with torch.autocast(device_type=device.type, dtype=torch.float16, enabled=use_amp):</code>.`, why: `autocast runs matmuls in float16 where it is safe, float32 elsewhere.` }
        ],
        answer: `<pre><code>device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
use_amp = (device.type == 'cuda')
scaler = torch.cuda.amp.GradScaler(enabled=use_amp)
model = nn.Linear(4, 2).to(device)
x = torch.randn(8, 4, device=device)
with torch.autocast(device_type=device.type, dtype=torch.float16, enabled=use_amp):
    out = model(x)
print("AMP enabled:", use_amp)    # False on CPU, True on a GPU runtime
print(out.shape)                  # torch.Size([8, 2])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> AMP without a <code>GradScaler</code> (the silent-underflow pitfall) vs the correct order. Write one full AMP step in the RIGHT order: <code>zero_grad</code> &rarr; autocast forward &rarr; <code>scaler.scale(loss).backward()</code> &rarr; <code>scaler.step(opt)</code> &rarr; <code>scaler.update()</code>. Print the loss.`,
        steps: [
          { do: `Scale the loss before backward: <code>scaler.scale(loss).backward()</code>.`, why: `Without scaling, tiny float16 gradients underflow to 0 and the model stops learning.` },
          { do: `Step then update: <code>scaler.step(opt)</code> then <code>scaler.update()</code>.`, why: `<code>step</code> unscales and applies the update; <code>update</code> adjusts the scale factor for next time.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
use_amp = (device.type == 'cuda')
model = nn.Linear(4, 2).to(device)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()
scaler = torch.cuda.amp.GradScaler(enabled=use_amp)
x = torch.randn(8, 4, device=device)
y = torch.randint(0, 2, (8,), device=device)

opt.zero_grad()
with torch.autocast(device_type=device.type, dtype=torch.float16, enabled=use_amp):
    loss = loss_fn(model(x), y)
scaler.scale(loss).backward()     # scale up, then backprop
scaler.step(opt)                  # unscale + optimizer step
scaler.update()                   # adjust scale factor
print(round(loss.item(), 4))      # ~0.70  (near ln(2), random start)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Move once, keep on-device. Build batches as CPU tensors, then move each batch inside the loop with <code>.to(device)</code> and bring only the scalar loss back with <code>.item()</code>. Run 3 fake batches and print the average loss.`,
        steps: [
          { do: `Move <code>xb, yb = xb.to(device), yb.to(device)</code> once per batch.`, why: `The model and batch must share a device for the forward pass.` },
          { do: `Accumulate <code>loss.item()</code>, not the tensor.`, why: `<code>.item()</code> copies one scalar back and frees the graph; never <code>.cpu()</code> big tensors in the hot loop.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = nn.Linear(4, 2).to(device)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()
batches = [(torch.randn(8, 4), torch.randint(0, 2, (8,))) for _ in range(3)]
running = 0.0
for xb, yb in batches:
    xb, yb = xb.to(device), yb.to(device)   # move every batch
    opt.zero_grad()
    loss = loss_fn(model(xb), yb)
    loss.backward(); opt.step()
    running += loss.item()                  # only a scalar comes back
print(round(running / len(batches), 4))     # ~0.7</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Timing the GPU correctly. On a GPU runtime, time a matmul, calling <code>torch.cuda.synchronize()</code> before reading the clock. Print the elapsed milliseconds. (On CPU the sync call is a harmless no-op — guard it with <code>if device.type == 'cuda'</code>.)`,
        steps: [
          { do: `Call <code>torch.cuda.synchronize()</code> before <code>perf_counter()</code>.`, why: `GPU work is asynchronous; without syncing the CPU clock stops before the GPU finishes.` },
          { do: `Guard the sync so it is skipped on CPU.`, why: `<code>torch.cuda.synchronize()</code> on a CPU-only box would error.` }
        ],
        answer: `<pre><code>import time
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
a = torch.randn(2048, 2048, device=device)
b = torch.randn(2048, 2048, device=device)
if device.type == 'cuda': torch.cuda.synchronize()
t0 = time.perf_counter()
c = a @ b
if device.type == 'cuda': torch.cuda.synchronize()   # wait for the GPU
print(round((time.perf_counter() - t0) * 1000, 2), "ms")   # e.g. ~3 ms on a GPU</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Peak GPU memory. After running a small AMP training loop, print <code>torch.cuda.max_memory_allocated()</code> in megabytes — but only when on CUDA. Show the CPU-safe guard.`,
        steps: [
          { do: `Guard with <code>if device.type == 'cuda':</code> and call <code>torch.cuda.synchronize()</code> first.`, why: `Memory stats are only meaningful on CUDA, and you must wait for pending GPU work.` },
          { do: `Convert <code>max_memory_allocated()</code> bytes to MB by dividing by 1e6.`, why: `It reports the peak allocation across the run.` }
        ],
        answer: `<pre><code>device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
# ... after a training loop on the chosen device ...
if device.type == 'cuda':
    torch.cuda.synchronize()
    mb = torch.cuda.max_memory_allocated() / 1e6
    print(f"peak GPU memory: {mb:.1f} MB")
else:
    print("on CPU: no GPU memory stats")   # this prints on a CPU runtime</code></pre>`
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
