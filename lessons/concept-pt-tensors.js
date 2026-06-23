/* PyTorch (a complete course) — the tensor: PyTorch's core data structure.
   Concept lesson pushed into window.LESSONS; CODE + CODEVIZ keyed by id.
   CODE is real PyTorch meant to run in Google Colab (torch preinstalled; runnable:false here).
   CODEVIZ numbers are computed for real (bytes per dtype). */
(function () {
  window.LESSONS.push({
    id: "pt-tensors",
    title: "Tensors: PyTorch's core data structure",
    tagline: "A tensor is an n-dimensional array, like a numpy array but with GPU and autograd built in.",
    module: "PyTorch (a complete course)",
    prereqs: ["fnd-vector", "fnd-matrix"],
    whenToUse: `<p>Always. The tensor is the substrate of everything in PyTorch.</p>
<ul>
<li>Every piece of data you feed a model is a tensor: a batch of images, a sequence of token ids, a table of features.</li>
<li>Every weight and bias inside a model is a tensor.</li>
<li>Every intermediate result, loss value, and gradient is a tensor.</li>
</ul>
<p>If you know numpy, you already know most of this. A PyTorch tensor adds two things numpy lacks: it can live on a GPU (Graphics Processing Unit) for fast math, and it can track operations so PyTorch can compute gradients automatically (autograd).</p>`,
    application: `<p>In any real model: the input batch (shape <code>[batch, channels, height, width]</code> for images), the model parameters, and the loss are all tensors. You spend most of your PyTorch time shaping, moving, and indexing tensors. Get comfortable here and the rest of the course is mostly choosing which operations to apply.</p>`,
    pitfalls: `<ul>
<li><b><code>from_numpy</code> SHARES memory.</b> <code>torch.from_numpy(a)</code> and the numpy array <code>a</code> point at the same buffer. Mutating one changes the other. Same for <code>.numpy()</code> going the other way. Use <code>.clone()</code> (or <code>torch.tensor(a)</code>, which copies) if you want an independent tensor.</li>
<li><b>Default dtype surprise.</b> numpy defaults to <code>float64</code>; <code>torch.tensor([1.0, 2.0])</code> defaults to <code>float32</code>. Mixing them can silently upcast or raise a dtype error. Be explicit: <code>.to(torch.float32)</code>.</li>
<li><b>CPU/GPU device mismatch.</b> An operation between a tensor on <code>cuda</code> and one on <code>cpu</code> raises "Expected all tensors to be on the same device". Move both with <code>.to(device)</code>.</li>
<li><b>Gradients need floats.</b> Only floating-point tensors can have gradients. An <code>int64</code> tensor with <code>requires_grad=True</code> raises an error. Cast to float first.</li>
<li><b>Use <code>.item()</code> for a Python scalar.</b> A one-element tensor still prints like <code>tensor(3.)</code>. Call <code>.item()</code> to get the plain Python number <code>3.0</code>.</li>
</ul>`,
    bigIdea: `<p>A tensor is just a flat block of numbers in memory plus a small amount of bookkeeping: its <b>shape</b> (how many along each dimension), its <b>dtype</b> (what kind of number — <code>float32</code>, <code>int64</code>, <code>bool</code>), and its <b>device</b> (where the numbers live — <code>cpu</code> or <code>cuda</code>). Everything else is operations on that block.</p>`,
    buildup: `<p>Think of it as numpy arrays you already met in <i>fnd-vector</i> and <i>fnd-matrix</i>, extended:</p>
<ul>
<li>A 0-D tensor is a scalar (one number). A 1-D tensor is a vector. A 2-D tensor is a matrix. A 4-D tensor is a batch of color images.</li>
<li><code>.ndim</code> tells you how many dimensions; <code>.shape</code> gives the size along each; <code>.numel()</code> is the total number of elements.</li>
<li>The data is stored <b>contiguously</b> — one long row in memory. The shape just tells PyTorch how to walk that row. This is why <code>reshape</code> is usually free: the numbers do not move, only the bookkeeping changes.</li>
</ul>`,
    symbols: [],
    derivation: `<p><b>How creation, dtype, device, and shape fit together.</b></p>
<ul>
<li><b>Creation.</b> <code>torch.tensor(data)</code> copies a Python list or numpy array into a new tensor and infers the dtype. Factory functions build common patterns without you typing the numbers: <code>torch.zeros</code>, <code>torch.ones</code>, <code>torch.arange(0, 10)</code> (a range), <code>torch.randn</code> (standard-normal random), <code>torch.eye(3)</code> (identity matrix).</li>
<li><b>dtype.</b> The default for float data is <code>float32</code> — half the memory of <code>float64</code> and plenty of precision for deep learning. You can request others: <code>float64</code>, <code>int64</code>, <code>bool</code>. Convert with <code>.to(torch.float32)</code>.</li>
<li><b>device.</b> A tensor lives on the CPU by default. <code>x.to('cuda')</code> (or <code>x.to(device)</code>) copies it to the GPU; <code>x.cpu()</code> brings it back. All tensors in one operation must share a device.</li>
<li><b>Indexing.</b> Exactly numpy-style: <code>x[0]</code> first row, <code>x[:, 1]</code> second column, <code>x[1:3]</code> a slice, <code>x[x &gt; 0]</code> a boolean mask. Slicing returns a <i>view</i> sharing memory; fancy indexing copies.</li>
</ul>`,
    example: `<p>Build a 2-by-3 tensor of zeros, fill its first row, then inspect it:</p>
<ul>
<li><code>x = torch.zeros(2, 3)</code> &rarr; two rows, three columns, all <code>0.0</code>, dtype <code>float32</code>.</li>
<li><code>x[0] = torch.tensor([1.0, 2.0, 3.0])</code> &rarr; first row becomes <code>[1, 2, 3]</code>.</li>
<li><code>x.shape</code> is <code>torch.Size([2, 3])</code>, <code>x.ndim</code> is <code>2</code>, <code>x.numel()</code> is <code>6</code>, <code>x.dtype</code> is <code>torch.float32</code>, <code>x.device</code> is <code>cpu</code>.</li>
<li><code>x[0, 2].item()</code> returns the plain Python float <code>3.0</code>.</li>
</ul>`,
    practice: [
      {
        q: `You have a numpy array <code>a = np.array([1, 2, 3])</code> and run <code>t = torch.from_numpy(a)</code>. Then you do <code>t[0] = 99</code>. What is <code>a[0]</code> afterward, and why?`,
        steps: [
          { do: `Recall what <code>from_numpy</code> does to memory.`, why: `It wraps the same buffer; it does not copy.` },
          { do: `Mutate <code>t</code>, then read <code>a</code>.`, why: `Both names point at one block of numbers.` }
        ],
        answer: `<code>a[0]</code> is now <code>99</code>. <code>from_numpy</code> shares memory, so writing through the tensor also changes the numpy array. Use <code>torch.tensor(a)</code> or <code>t.clone()</code> if you need an independent copy.`
      },
      {
        q: `You write <code>w = torch.tensor([1, 2, 3], requires_grad=True)</code> and PyTorch raises an error. What is wrong and how do you fix it?`,
        steps: [
          { do: `Check the dtype of <code>[1, 2, 3]</code>.`, why: `Integer literals give an <code>int64</code> tensor.` },
          { do: `Recall which tensors can carry gradients.`, why: `Only floating-point tensors can require grad.` }
        ],
        answer: `Integers cannot have gradients. Make it a float: <code>torch.tensor([1.0, 2.0, 3.0], requires_grad=True)</code> (or add <code>dtype=torch.float32</code>).`
      },
      {
        q: `A loss tensor prints as <code>tensor(0.4231)</code>. You append it to a Python list every step to plot later, and memory grows each epoch. What is the fix?`,
        steps: [
          { do: `Notice the tensor still carries its autograd graph.`, why: `Keeping the tensor keeps the whole computation graph alive.` },
          { do: `Extract the plain number instead.`, why: `<code>.item()</code> returns a detached Python float.` }
        ],
        answer: `Store <code>loss.item()</code>, not <code>loss</code>. <code>.item()</code> pulls out a plain Python <code>float</code> and drops the reference to the graph, so old graphs can be freed.`
      }
    ]
  });

  window.CODE["pt-tensors"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>This runs in Google Colab (torch is preinstalled). It creates tensors several ways, prints each tensor's <code>shape</code>, <code>dtype</code>, and <code>device</code>, does a numpy round-trip that demonstrates the shared-memory aliasing, moves a tensor to the GPU if one is available, and finishes with numpy-style indexing and slicing.</p>`,
    code: `import torch
import numpy as np

torch.manual_seed(0)  # reproducible randn

# ---- CREATION: many ways to make a tensor ----
a = torch.tensor([[1.0, 2.0, 3.0],
                  [4.0, 5.0, 6.0]])   # from a Python list -> float32 by default
z = torch.zeros(2, 3)                 # all zeros
o = torch.ones(2, 3)                  # all ones
r = torch.arange(0, 12)               # 0,1,2,...,11  (a range, int64)
g = torch.randn(2, 3)                 # standard-normal random
I = torch.eye(3)                      # 3x3 identity matrix

print("a =\\n", a)
print("arange:", r)
print("identity:\\n", I)

# ---- SHAPE / DTYPE / DEVICE: the bookkeeping on every tensor ----
print("shape :", a.shape)             # torch.Size([2, 3])
print("ndim  :", a.ndim)              # 2
print("numel :", a.numel())           # 6 total elements
print("dtype :", a.dtype)             # torch.float32  (the default for floats)
print("device:", a.device)            # cpu

# ---- DTYPES: float32 default, and converting ----
i = torch.tensor([1, 2, 3])           # int literals -> int64
print("int tensor dtype :", i.dtype)  # torch.int64
f = i.to(torch.float32)               # cast to float32
print("after .to(float32):", f.dtype) # torch.float32
b = torch.tensor([1, 0, 2]).bool()    # nonzero -> True
print("bool tensor:", b)

# ---- NUMPY ROUND-TRIP + the SHARED-MEMORY gotcha ----
npy = np.array([1.0, 2.0, 3.0])       # numpy defaults to float64
t = torch.from_numpy(npy)             # SHARES the same memory buffer
print("from_numpy dtype:", t.dtype)   # torch.float64 (note: not float32!)
t[0] = 99.0                           # mutate the torch tensor...
print("numpy array is now:", npy)     # ...and the numpy array changed too: [99. 2. 3.]
safe = torch.tensor(npy)              # torch.tensor COPIES -> independent
back = a.numpy()                      # .numpy() also shares memory (CPU tensors)
print("back to numpy shape:", back.shape)

# ---- DEVICES: move to GPU if one is available ----
device = "cuda" if torch.cuda.is_available() else "cpu"
print("using device:", device)
a_dev = a.to(device)                  # copy onto the chosen device
print("a is on:", a_dev.device)
a_back = a_dev.cpu()                  # bring it back to CPU (e.g. before .numpy())

# ---- INDEXING / SLICING: numpy-like ----
print("first row      :", a[0])       # [1., 2., 3.]
print("second column  :", a[:, 1])    # [2., 5.]
print("top-left 2x2    :\\n", a[:2, :2])
print("positive mask  :", a[a > 3])   # boolean indexing -> [4., 5., 6.]
print("single element :", a[0, 2].item())  # .item() -> plain Python float 3.0
`
  };

  window.CODEVIZ["pt-tensors"] = {
    question: "How much memory does the same 1000-element tensor take in each dtype?",
    charts: [{
      type: "bars",
      title: "Memory for a 1000-element tensor by dtype",
      xlabel: "dtype",
      ylabel: "bytes",
      labels: ["float64", "float32 (default)", "float16", "int8"],
      values: [8000, 4000, 2000, 1000],
      valueLabels: ["8000", "4000", "2000", "1000"],
      colors: ["#ff7b72", "#4ea1ff", "#7ee787", "#c89bff"]
    }],
    caption: "Each element of a 1000-element tensor costs 8 bytes in float64, 4 in float32, 2 in float16, 1 in int8. PyTorch defaults to float32 (4000 bytes here) — half the memory of numpy's float64 default, with precision to spare for deep learning. Halving the dtype halves the memory.",
    code: `import numpy as np

n = 1000  # number of elements in the tensor
dtypes = ["float64", "float32", "float16", "int8"]
bytes_per = {"float64": 8, "float32": 4, "float16": 2, "int8": 1}

# total bytes = elements * bytes-per-element (this is exactly what tensor.element_size()
# times tensor.numel() reports in PyTorch)
totals = [n * bytes_per[d] for d in dtypes]
for d, t in zip(dtypes, totals):
    print(f"{d:8s}: {t} bytes")
# float64 : 8000 bytes
# float32 : 4000 bytes
# float16 : 2000 bytes
# int8    : 1000 bytes`
  };
})();
