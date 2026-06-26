/* PyTorch (a complete course) — the tensor: PyTorch's core data structure.
   Concept lesson pushed into window.LESSONS; CODE + CODEVIZ keyed by id.
   CODE is real PyTorch meant to run in Google Colab (torch preinstalled; runnable:false here).
   CODEVIZ numbers are computed for real (bytes per dtype). */
(function () {
  window.LESSONS.push({
    id: "pt-tensors",
    title: "Tensors: PyTorch's core data structure",
    tagline: "A tensor is an n-dimensional array, like a numpy array but with GPU and autograd built in.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["fnd-vector", "fnd-matrix"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>create tensors from Python lists and with the <code>zeros</code> / <code>ones</code> / <code>arange</code> / <code>randn</code> factories, and read their <code>.shape</code>, <code>.dtype</code>, and <code>.device</code>;</li>
<li>reshape, index, and slice a tensor and know what shape comes out before you run it;</li>
<li>move a tensor between CPU and GPU, and convert to and from NumPy knowing exactly when memory is shared.</li>
</ul>
<p><b>The API you'll own:</b> <code>torch.tensor</code>, <code>torch.zeros/ones/arange/randn/eye</code>, <code>.reshape</code>, <code>.to(device)</code>, <code>.numpy()</code> / <code>torch.from_numpy</code>.</p>`,

    concept: `<p>A <b>tensor</b> is PyTorch's one and only data structure: an n-dimensional grid of numbers, just like a NumPy array. A single value is a 0-D tensor, a list of values is 1-D, a table is 2-D, and a batch of colour images is 4-D with shape <code>[batch, channels, height, width]</code>. <i>Everything</i> in PyTorch is a tensor — your input data, every weight in the model, every gradient, and the final loss.</p>
<p>A tensor differs from a NumPy array in two ways that matter for the rest of this course:</p>
<ul>
<li><b>It can live on a GPU (Graphics Processing Unit).</b> Call <code>.to("cuda")</code> and the same arithmetic runs on the graphics card — often tens of times faster for the big matrix multiplies in a network.</li>
<li><b>It can remember how it was computed.</b> Give it <code>requires_grad=True</code> and PyTorch records every operation so it can later compute gradients automatically. That recording is <b>autograd</b>, the subject of <code>pt-autograd</code>.</li>
</ul>
<p>Three properties define any tensor, and you will check them constantly while debugging:</p>
<ul>
<li><b>shape</b> — the size along each axis (a <code>[2, 3]</code> tensor has 2 rows, 3 columns);</li>
<li><b>dtype</b> — the number type. <code>float32</code> for almost all model math; <code>int64</code> for indices and class labels;</li>
<li><b>device</b> — where it physically lives: <code>cpu</code> or <code>cuda</code>.</li>
</ul>`,

    apiTable: [
      { sig: "torch.tensor(data)", does: "Build a tensor from a Python list or number. The dtype is inferred — decimals give <code>float32</code>, whole numbers give <code>int64</code>.", snippet: "torch.tensor([[1., 2.], [3., 4.]])" },
      { sig: "torch.zeros(*shape) / ones / full", does: "A tensor of the given shape filled with 0, 1, or a constant. The everyday way to allocate.", snippet: "torch.zeros(2, 3)        # 2x3 of 0.0" },
      { sig: "torch.arange(n) / linspace(a, b, n)", does: "Evenly spaced 1-D values: like Python <code>range</code>, or <code>n</code> points from <code>a</code> to <code>b</code>.", snippet: "torch.arange(5)          # [0,1,2,3,4]" },
      { sig: "torch.randn(*shape)", does: "Random values from a standard normal — the usual test data. Seed it for reproducibility.", snippet: "torch.manual_seed(0)\ntorch.randn(3, 4)" },
      { sig: "t.shape / t.dtype / t.device", does: "The three properties you sanity-check on every tensor: size per axis, number type, location.", snippet: "t.shape                  # torch.Size([3, 4])" },
      { sig: "t.reshape(*shape)", does: "Same data, new shape. Use <code>-1</code> to let PyTorch infer one axis (often to flatten).", snippet: "x.reshape(3, 4); x.reshape(-1)" },
      { sig: "t.mean(dim=) / sum(dim=) / max(dim=)", does: "Reduce along an axis. The <code>dim</code> you name is the one that <i>collapses</i>.", snippet: "x.mean(dim=0)            # one mean per column" },
      { sig: "t.to(device) / .cpu() / .cuda()", does: "Return a copy of the tensor on another device. Reassign the result to keep it.", snippet: "t = t.to('cuda')" },
      { sig: "t.numpy() / torch.from_numpy(a)", does: "Bridge to and from NumPy. The two share memory unless you <code>.clone()</code>.", snippet: "torch.from_numpy(np.ones(3))" }
    ],

    codeTour: [
      {
        explain: `<b>Import and make your first tensor.</b> <code>torch.tensor</code> turns a nested Python list into a 2-D tensor. The decimal points matter: they make it a <code>float32</code> tensor, the default for model math. Always glance at the printed <code>shape</code>, <code>dtype</code>, <code>device</code> line.`,
        code: `import torch\n\nx = torch.tensor([[1., 2., 3.],\n                  [4., 5., 6.]])\nprint(x)\nprint(x.shape, x.dtype, x.device)`,
        output: `tensor([[1., 2., 3.],\n        [4., 5., 6.]])\ntorch.Size([2, 3]) torch.float32 cpu`
      },
      {
        explain: `<b>The factory functions.</b> You rarely type numbers by hand. These build common tensors directly. Watch the dtype: <code>arange</code> gives integers (<code>int64</code>), while <code>zeros</code>/<code>ones</code> give floats.`,
        code: `zeros = torch.zeros(2, 3)\nones  = torch.ones(2, 3)\nseq   = torch.arange(6)        # 0..5\nprint(zeros.shape, ones.shape)\nprint(seq, seq.dtype)`,
        output: `torch.Size([2, 3]) torch.Size([2, 3])\ntensor([0, 1, 2, 3, 4, 5]) torch.int64`
      },
      {
        explain: `<b>Reshape — same data, new shape.</b> <code>reshape</code> rearranges the six values into a new layout; <code>-1</code> means "you work out this axis." The element count never changes, so a reshape that doesn't multiply out will raise.`,
        code: `x = torch.arange(6)\nprint(x.reshape(2, 3))\nprint(x.reshape(3, 2))\nprint(x.reshape(-1).shape)      # flatten back to 1-D`,
        output: `tensor([[0, 1, 2],\n        [3, 4, 5]])\ntensor([[0, 1],\n        [2, 3],\n        [4, 5]])\ntorch.Size([6])`
      },
      {
        explain: `<b>Index and slice — exactly like NumPy.</b> The first index is the row axis; <code>:</code> keeps a whole axis while you pick along another. This is how you pull a row, a column, or a sub-block out of a batch of data.`,
        code: `g = torch.arange(16).reshape(4, 4)\nprint(g[1])         # row 1\nprint(g[:, 2])      # column 2\nprint(g[:2, :2])    # top-left 2x2 block`,
        output: `tensor([4, 5, 6, 7])\ntensor([ 2,  6, 10, 14])\ntensor([[0, 1],\n        [4, 5]])`
      },
      {
        explain: `<b>Device and the NumPy bridge.</b> Build the device string once and use it everywhere — that one habit prevents most CPU/GPU errors later. <code>from_numpy</code> shares memory with the array, so writing through the tensor also changes the array; call <code>.clone()</code> when you need an independent copy.`,
        code: `import numpy as np\ndevice = 'cuda' if torch.cuda.is_available() else 'cpu'\nt = torch.ones(3, device=device)\nprint(t.device)\n\na = np.array([1, 2, 3])\nshared = torch.from_numpy(a)\nshared[0] = 99\nprint(a)            # the array changed too`,
        output: `cpu\n[99  2  3]`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab and read each printed line against its note:</p>
<ul>
<li>The first block prints a 2&times;3 grid and the line <code>torch.Size([2, 3]) torch.float32 cpu</code> — that triple (shape, dtype, device) is what you sanity-check on every tensor.</li>
<li><code>arange(6)</code> prints with dtype <code>torch.int64</code>, a reminder that integer factories are <i>not</i> floats — this is what later breaks gradient code that expects <code>float32</code>.</li>
<li>Every reshape keeps exactly six elements; only the brackets move. If a reshape ever raises, the element counts don't match.</li>
<li>The final block prints <code>[99  2  3]</code> for the NumPy array even though you only wrote to the tensor — direct proof the buffer is shared.</li>
</ul>
<p>On a GPU runtime the device line reads <code>cuda:0</code> instead of <code>cpu</code>. If random examples don't match a teammate's, set <code>torch.manual_seed(0)</code> first.</p>`,

    cheatsheet: [
      { code: "x = torch.tensor([1., 2., 3.])", note: "from a list; decimals → float32" },
      { code: "torch.zeros(2,3) / ones / arange(n) / randn(2,3)", note: "factory tensors" },
      { code: "x.shape, x.dtype, x.device", note: "the three things to always check" },
      { code: "x.reshape(3, 4)   /   x.reshape(-1)", note: "new shape / flatten (-1 infers an axis)" },
      { code: "x[1], x[:, 2], x[:2, :2]", note: "row, column, sub-block" },
      { code: "x.mean(dim=0) / x.sum(dim=1)", note: "reduce along an axis (dim collapses)" },
      { code: "x = x.to(device)", note: "move to cpu/cuda — reassign the result!" },
      { code: "torch.from_numpy(a) / x.numpy()", note: "NumPy bridge — shares memory; .clone() to break it" },
      { code: "torch.manual_seed(0)", note: "reproducible randomness" }
    ],

    deeper: `<p>A tensor is just the computational form of math objects you already know:</p>
<ul>
<li>a 1-D tensor is a <a onclick="App.open('fnd-vector')">vector</a>;</li>
<li>a 2-D tensor is a <a onclick="App.open('fnd-matrix')">matrix</a>;</li>
<li>3-D and beyond simply add more axes (an "n-way array").</li>
</ul>
<p>Deep learning lives on tensors because a forward pass is a chain of matrix multiplications and elementwise functions (see <code>dl-forward-prop</code>), and those are exactly the operations a GPU runs in parallel across thousands of cores. Get fluent at shaping and moving tensors and the rest of the course is mostly choosing which operation to apply.</p>`,
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
        q: `<b>Type this in Colab.</b> Create three tensors and print each one's <code>.shape</code> and <code>.dtype</code>: (a) a 2&times;3 tensor of zeros in <code>float32</code>; (b) a 1-D tensor holding 0,1,2,3,4 built with <code>torch.arange</code>; (c) a 3&times;3 identity matrix.`,
        steps: [
          { do: `Use the dedicated constructors instead of typing numbers by hand.`, why: `<code>torch.zeros</code>, <code>torch.arange</code>, and <code>torch.eye</code> create these shapes directly.` },
          { do: `Pass <code>dtype=torch.float32</code> to (a) and read <code>.dtype</code> on each.`, why: `<code>arange</code> defaults to <code>int64</code>; only by printing dtype do you see the difference.` }
        ],
        answer: `<pre><code>import torch
a = torch.zeros(2, 3, dtype=torch.float32)
b = torch.arange(5)            # tensor([0, 1, 2, 3, 4])
c = torch.eye(3)
for t in (a, b, c):
    print(t.shape, t.dtype)
# torch.Size([2, 3]) torch.float32
# torch.Size([5]) torch.int64
# torch.Size([3, 3]) torch.float32</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Make a 1-D tensor of the numbers 0..11 with <code>torch.arange</code>, reshape it to 3&times;4, then to 4&times;3, then flatten it back to 1-D. Print the shape at each step.`,
        steps: [
          { do: `Start from <code>torch.arange(12)</code>.`, why: `It gives the twelve values you will rearrange.` },
          { do: `Chain <code>.reshape(3, 4)</code>, <code>.reshape(4, 3)</code>, <code>.reshape(-1)</code>.`, why: `<code>-1</code> tells PyTorch to infer the remaining dimension, which flattens it.` }
        ],
        answer: `<pre><code>x = torch.arange(12)
print(x.shape)              # torch.Size([12])
x = x.reshape(3, 4)
print(x.shape)              # torch.Size([3, 4])
x = x.reshape(4, 3)
print(x.shape)              # torch.Size([4, 3])
x = x.reshape(-1)
print(x.shape)              # torch.Size([12])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Build a 4&times;4 tensor of 0..15 (use <code>torch.arange(16).reshape(4, 4)</code>). Then slice out: row index 1; column index 2; and the top-left 2&times;2 block. Print each.`,
        steps: [
          { do: `Index rows with <code>x[1]</code> and columns with <code>x[:, 2]</code>.`, why: `The first index is the row axis; <code>:</code> keeps every row while picking one column.` },
          { do: `Slice both axes for the block: <code>x[:2, :2]</code>.`, why: `<code>:2</code> means indices 0 and 1 on each axis.` }
        ],
        answer: `<pre><code>x = torch.arange(16).reshape(4, 4)
print(x[1])        # tensor([4, 5, 6, 7])
print(x[:, 2])     # tensor([ 2,  6, 10, 14])
print(x[:2, :2])   # tensor([[0, 1],
                   #         [4, 5]])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Create a column vector of shape <code>(3, 1)</code> holding 1,2,3 and a row vector of shape <code>(1, 4)</code> holding 10,20,30,40. Add them. Before you run it, predict the output shape; then verify with <code>.shape</code>.`,
        steps: [
          { do: `Reshape <code>torch.tensor([1,2,3])</code> to <code>(3, 1)</code> and <code>torch.tensor([10,20,30,40])</code> to <code>(1, 4)</code>.`, why: `Broadcasting stretches a size-1 axis to match the other operand.` },
          { do: `Add them; the result broadcasts to <code>(3, 4)</code>.`, why: `Each of the 3 rows pairs with each of the 4 columns.` }
        ],
        answer: `<pre><code>col = torch.tensor([1, 2, 3]).reshape(3, 1)
row = torch.tensor([10, 20, 30, 40]).reshape(1, 4)
out = col + row
print(out.shape)   # torch.Size([3, 4])
print(out)
# tensor([[11, 21, 31, 41],
#         [12, 22, 32, 42],
#         [13, 23, 33, 43]])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Make a 3&times;4 tensor of random values with <code>torch.randn(3, 4)</code>. Compute the mean of each <i>column</i> and the sum of each <i>row</i>. (Hint: reductions take a <code>dim</code> argument.)`,
        steps: [
          { do: `Set a seed first with <code>torch.manual_seed(0)</code>.`, why: `So your numbers match a teammate's and the run is reproducible.` },
          { do: `Use <code>x.mean(dim=0)</code> for column means and <code>x.sum(dim=1)</code> for row sums.`, why: `<code>dim</code> is the axis that <i>collapses</i>: <code>dim=0</code> collapses rows, leaving one value per column.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
x = torch.randn(3, 4)
print(x.mean(dim=0).shape)   # torch.Size([4])  one mean per column
print(x.sum(dim=1).shape)    # torch.Size([3])  one sum per row
print(x.mean(dim=0))
print(x.sum(dim=1))</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Pick a device string (<code>"cuda"</code> if a GPU is available, else <code>"cpu"</code>). Create a <code>float32</code> tensor on that device, print its <code>.device</code>, move it to the CPU, and print <code>.device</code> again.`,
        steps: [
          { do: `Build the device string once: <code>device = "cuda" if torch.cuda.is_available() else "cpu"</code>.`, why: `One variable used everywhere prevents CPU/GPU mismatch errors later.` },
          { do: `Create with <code>device=device</code>, then call <code>.to("cpu")</code>.`, why: `<code>.to(...)</code> returns a tensor on the requested device; reassign to keep it.` }
        ],
        answer: `<pre><code>device = "cuda" if torch.cuda.is_available() else "cpu"
t = torch.ones(2, 2, dtype=torch.float32, device=device)
print(t.device)        # cuda:0 on a GPU runtime, else cpu
t = t.to("cpu")
print(t.device)        # cpu</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Create <code>a = np.array([1, 2, 3])</code> and <code>t = torch.from_numpy(a)</code>. Set <code>t[0] = 99</code> and print <code>a</code> &mdash; notice they share memory. Then make an <i>independent</i> copy and show that mutating it does <b>not</b> touch <code>a</code>.`,
        steps: [
          { do: `Mutate through the tensor, then print the numpy array.`, why: `<code>from_numpy</code> wraps the same buffer, so <code>a[0]</code> becomes 99 too.` },
          { do: `Make a copy with <code>t.clone()</code> (or <code>torch.tensor(a)</code>) and mutate that instead.`, why: `<code>clone()</code> allocates new memory, breaking the link to <code>a</code>.` }
        ],
        answer: `<pre><code>import numpy as np
a = np.array([1, 2, 3])
t = torch.from_numpy(a)
t[0] = 99
print(a)            # [99  2  3]  -- shared memory!
indep = t.clone()
indep[1] = 0
print(a)            # [99  2  3]  -- unchanged this time</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Try to create <code>w = torch.tensor([1, 2, 3], requires_grad=True)</code> and observe the error. Then fix it so <code>w</code> is a float tensor that requires gradients, and print <code>w.requires_grad</code> and <code>w.dtype</code>.`,
        steps: [
          { do: `Run the broken line and read the error.`, why: `Integer tensors cannot carry gradients, so PyTorch raises a <code>RuntimeError</code>.` },
          { do: `Make the values floats: <code>[1.0, 2.0, 3.0]</code> (or pass <code>dtype=torch.float32</code>).`, why: `Only floating-point tensors can require grad, because gradients are real-valued.` }
        ],
        answer: `<pre><code># Broken: RuntimeError -- only float tensors can require grad
# w = torch.tensor([1, 2, 3], requires_grad=True)

w = torch.tensor([1.0, 2.0, 3.0], requires_grad=True)
print(w.requires_grad)   # True
print(w.dtype)           # torch.float32</code></pre>`
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
    question: "How do you READ a dtype-memory chart — and how do you recognise the two ways dtype bites you (silent upcast, integer overflow)?",
    charts: [
      {
        type: "bars",
        title: "Healthy: memory of a 1000-element tensor by dtype",
        xlabel: "dtype",
        ylabel: "bytes",
        labels: ["float64", "float32 (default)", "float16", "int8"],
        values: [8000, 4000, 2000, 1000],
        valueLabels: ["8000", "4000", "2000", "1000"],
        colors: ["#ff7b72", "#4ea1ff", "#7ee787", "#c89bff"],
        interpret: "<b>Bars = total bytes, height = bytes-per-element times 1000.</b> float64 costs 8 bytes/element (8000), float32 4 (4000), float16 2 (2000), int8 1 (1000). <b>Read it as: each step down the list halves memory.</b> PyTorch defaults to float32 (blue) — half of numpy's float64 default (red), with precision to spare for deep learning. This is the picture you want: you chose the dtype, so you control the cost. Real computed numbers (element_size x numel)."
      },
      {
        type: "bars",
        title: "Pitfall A: numpy round-trip silently UPCASTS to float64 (2x memory)",
        xlabel: "what you expected vs what you got",
        ylabel: "bytes",
        labels: ["expected float32", "got float64 (from_numpy)"],
        values: [4000, 8000],
        valueLabels: ["4000", "8000 (2x!)"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "<b>Recognise it by the bar that's TWICE as tall as you expected.</b> numpy defaults to float64, so torch.from_numpy(np_array) inherits float64, not float32. You think you have a 4000-byte tensor (green) but you actually have 8000 (red) — and later ops may silently upcast or raise a dtype error. <b>Tell-tale:</b> print .dtype and see float64 where you wanted float32. Fix: .to(torch.float32). Illustrative bars, real byte counts."
      },
      {
        type: "bars",
        title: "Pitfall B: int8 OVERFLOW — value 200 wraps to -56, no error",
        xlabel: "value you stored vs value int8 holds",
        ylabel: "stored value",
        labels: ["wanted 100", "wanted 200", "wanted 300"],
        values: [100, -56, 44],
        valueLabels: ["100 ok", "-56 (wrapped!)", "44 (wrapped!)"],
        colors: ["#7ee787", "#ff7b72", "#ff7b72"],
        interpret: "<b>Recognise it by values that go NEGATIVE or jump downward as inputs grow.</b> int8 only holds -128..127. Storing 100 is fine (green); 200 wraps to 200-256 = -56 and 300 wraps to 300-256 = 44 (red) — silently, no error. <b>Tell-tale:</b> sums or counts that should be large come out small or negative. The tiny memory win of int8 costs you range. Use int8 only for data you know stays in [-128,127]. Real wrap-around arithmetic."
      }
    ],
    caption: "",
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
