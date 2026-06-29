/* PyTorch — "What PyTorch is and the mental model: tensors + autograd + nn, run eagerly".
   The front door to the PyTorch course. Self-contained: lesson + CODE + CODEVIZ merged by id "pt-intro". */
(function () {
  window.LESSONS.push({
    id: "pt-intro",
    title: "PyTorch: tensors, autograd, and neural nets that run as you write them",
    tagline: "A Python library where every operation runs immediately (eager / define-by-run), so you build, debug, and train models with ordinary Python — which is why research lives here.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["dl-forward-prop", "dl-backprop", "dl-optimizers", "fnd-gradient"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>explain PyTorch's three pillars &mdash; tensors, autograd, and <code>torch.nn</code> &mdash; and why <b>eager execution</b> (define-by-run) makes a model just an ordinary Python program you can print and debug;</li>
<li>write the five-line "hello world": import torch, pick a <code>device</code>, make tensors and run an op that executes immediately, and run a one-layer <code>nn.Linear</code> forward pass;</li>
<li>name the standard five-step workflow (tensors &rarr; model &rarr; loss + optimizer &rarr; training loop &rarr; eval) that every later <code>pt-*</code> lesson expands.</li>
</ul>
<p><b>The API you'll own:</b> <code>torch.__version__</code>, <code>torch.cuda.is_available()</code>, <code>torch.tensor</code>, <code>.to(device)</code>, <code>torch.manual_seed</code>, <code>nn.Linear</code>.</p>`,

    concept: `<p><b>PyTorch is three ideas wearing one coat.</b> A deep-learning framework is just: (1) <b>tensors</b> &mdash; a fast n-dimensional number array (think NumPy) that can also run on a <b>GPU (Graphics Processing Unit)</b> and remember the operations performed on it; (2) <b>automatic differentiation (autograd)</b> &mdash; given any computation you wrote, it computes the gradient of the result with respect to every input, which is <code>dl-backprop</code> done for you automatically; and (3) <b>neural-network building blocks</b> (<code>torch.nn</code>) &mdash; ready-made layers, activations, and losses you snap together, plus optimizers (<code>torch.optim</code>) that apply the gradient updates.</p>
<p>The trait that ties them together is <b>eager execution</b>, also called <b>define-by-run</b>: each line of your model runs the moment Python reaches it, and the computation graph is built on the fly. There is no separate "compile the graph, then feed it data" phase. That is why you can <code>print</code> intermediate values, use ordinary <code>if</code> statements and loops inside a model, and debug with a normal Python debugger. The model <i>is</i> the Python program, with nothing hidden &mdash; the single biggest reason PyTorch took over research.</p>
<p><b>The standard workflow every later lesson follows.</b> Almost every PyTorch program, from a two-line toy to a billion-parameter model, has the same five-part skeleton:</p>
<ol>
<li><b>Tensors</b> &mdash; load data and weights as tensors, move them to a <code>device</code> (the forward math is <code>dl-forward-prop</code>);</li>
<li><b>Model</b> &mdash; subclass <code>nn.Module</code>, declare layers, write <code>forward</code>;</li>
<li><b>Loss + optimizer</b> &mdash; say "this is wrong by X" and "nudge the weights" (math in <code>dl-cross-entropy</code>, <code>dl-optimizers</code>);</li>
<li><b>Training loop</b> &mdash; forward, loss, <code>zero_grad</code>, <code>backward</code>, <code>step</code>;</li>
<li><b>Eval</b> &mdash; <code>model.eval()</code> inside <code>torch.no_grad()</code> on held-out data.</li>
</ol>
<p>Keep this skeleton in your head and the whole course hangs on it.</p>`,

    apiTable: [
      { sig: "torch.__version__", does: "The installed PyTorch version string &mdash; the first thing you print to confirm the import worked.", snippet: "print(torch.__version__)   # e.g. 2.5.1+cu121" },
      { sig: "torch.cuda.is_available()", does: "Returns <code>True</code> if a usable <b>GPU</b> is attached. Use it to pick a <code>device</code>.", snippet: "torch.cuda.is_available()  # True on a GPU runtime" },
      { sig: "device = 'cuda' if ... else 'cpu'", does: "Build ONE device string up front and use it everywhere &mdash; the habit that prevents CPU/GPU mismatch.", snippet: "device = 'cuda' if torch.cuda.is_available() else 'cpu'" },
      { sig: "torch.tensor(data)", does: "Make a tensor from a Python list/number. Each op on it runs <i>immediately</i> (eager).", snippet: "a = torch.tensor([1., 2., 3.])" },
      { sig: "t.to(device) / .cuda() / .cpu()", does: "Return a copy of the tensor on another device. Reassign the result to keep it.", snippet: "a = a.to(device)" },
      { sig: "torch.manual_seed(n)", does: "Seed the random number generator so weight init, shuffling, and dropout are reproducible.", snippet: "torch.manual_seed(0)" },
      { sig: "nn.Linear(in_features, out_features)", does: "A fully-connected layer computing <code>y = Wx + b</code>; the one-line model in the teaser.", snippet: "model = nn.Linear(3, 1).to(device)" },
      { sig: "model(x)", does: "Run a forward pass &mdash; call the module (never <code>model.forward(x)</code>).", snippet: "y = model(x); y.item()" },
      { sig: "t.numpy() / torch.from_numpy(a)", does: "Bridge to and from NumPy at the data boundary (CPU tensors share the buffer).", snippet: "c.numpy(); torch.from_numpy(np.array([5., 6.]))" }
    ],

    codeTour: [
      {
        explain: `<b>Version and hardware check.</b> Every PyTorch session opens the same way: import torch, confirm the version, ask whether a GPU is present with <code>torch.cuda.is_available()</code>, and pick ONE <code>device</code> string to reuse everywhere. Seed the RNG so the run is reproducible.`,
        code: `import torch\nimport torch.nn as nn\n\nprint("PyTorch version:", torch.__version__)\nprint("CUDA available :", torch.cuda.is_available())\ndevice = "cuda" if torch.cuda.is_available() else "cpu"\nprint("Using device   :", device)\ntorch.manual_seed(0)`,
        output: `PyTorch version: 2.5.1+cu121\nCUDA available : False\nUsing device   : cpu`
      },
      {
        explain: `<b>Make tensors and run an op &mdash; eager execution.</b> <code>a + b</code> runs the instant Python reaches it; the result <code>c</code> exists immediately, so you can print it on the spot. No graph to compile, no session to open.`,
        code: `a = torch.tensor([1.0, 2.0, 3.0])\nb = torch.ones(3)\nc = a + b                 # runs NOW\nprint("a + b =", c)\nprint("shape :", c.shape, "| dtype:", c.dtype)`,
        output: `a + b = tensor([2., 3., 4.])\nshape : torch.Size([3]) | dtype: torch.float32`
      },
      {
        explain: `<b>Move to the chosen device.</b> <code>.to(device)</code> places a tensor on the GPU (or leaves it on the CPU). Reassign the result &mdash; <code>.to(...)</code> returns a new tensor rather than moving in place.`,
        code: `a = a.to(device)\nprint("a is now on:", a.device)`,
        output: `a is now on: cpu`
      },
      {
        explain: `<b>The five-line model teaser.</b> <code>nn.Linear(3, 1)</code> is a tiny layer computing <code>y = Wx + b</code>. Move it to the same device as the input, then call <code>model(x)</code> (never <code>model.forward(x)</code>) to run a forward pass. The exact number depends on the seeded random init.`,
        code: `model = nn.Linear(in_features=3, out_features=1).to(device)\nx = torch.tensor([1.0, 2.0, 3.0], device=device)\ny = model(x)\nprint("model(x) =", round(y.item(), 4))`,
        output: `model(x) = 0.8865`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab and read each printed line against its note:</p>
<ul>
<li>The first block prints the version and <code>Using device : cpu</code> &mdash; on a GPU runtime that last line reads <code>cuda</code> and <code>CUDA available : True</code> instead.</li>
<li><code>a + b = tensor([2., 3., 4.])</code> proves eager execution: the sum exists the instant you call it, with no compile step, and prints with shape <code>torch.Size([3])</code> and dtype <code>torch.float32</code>.</li>
<li><code>a is now on: cpu</code> confirms the device move; on a GPU it reads <code>cuda:0</code>.</li>
<li>The final <code>model(x) = ...</code> is one forward pass through a one-output linear layer; the exact value depends on the seeded random weights, so a teammate who also ran <code>torch.manual_seed(0)</code> sees the same number. Without the seed it changes every run.</li>
</ul>`,

    cheatsheet: [
      { code: "import torch; import torch.nn as nn", note: "the two imports every script starts with" },
      { code: "torch.__version__", note: "confirm the install / CUDA build" },
      { code: "device = 'cuda' if torch.cuda.is_available() else 'cpu'", note: "pick the device ONCE, reuse everywhere" },
      { code: "torch.manual_seed(0)", note: "reproducible init / shuffling / dropout" },
      { code: "c = a + b", note: "ops run immediately (eager / define-by-run)" },
      { code: "a = a.to(device)", note: "move a tensor &mdash; reassign the result!" },
      { code: "model = nn.Linear(3, 1).to(device)", note: "a one-line model: y = Wx + b" },
      { code: "y = model(x)", note: "forward pass &mdash; call model(x), NOT model.forward(x)" },
      { code: "c.numpy() / torch.from_numpy(arr)", note: "NumPy bridge at the data boundary" }
    ],

    deeper: `<p>Each pillar of PyTorch has its own concept lesson behind the API:</p>
<ul>
<li>tensors are <a onclick="App.open('fnd-vector')">vectors</a> and <a onclick="App.open('fnd-matrix')">matrices</a> extended to n axes;</li>
<li>a forward pass is <a onclick="App.open('dl-forward-prop')">forward propagation</a>, and the <code>nn.Linear</code> layer is one <a onclick="App.open('dl-neuron')">neuron</a> layer's worth of <code>Wx + b</code>;</li>
<li>autograd's <code>.backward()</code> is <a onclick="App.open('dl-backprop')">backpropagation</a> automated, resting on the <a onclick="App.open('fnd-chain')">chain rule</a> and the <a onclick="App.open('fnd-gradient')">gradient</a>;</li>
<li>the optimizer step uses the update rules in <a onclick="App.open('dl-optimizers')">optimizers</a>.</li>
</ul>
<p>Whenever the <i>math</i> behind a workflow step matters, this course points you back to those <code>dl-*</code>/<code>fnd-*</code> lessons rather than re-deriving it &mdash; here the focus is HOW to do it in PyTorch.</p>`,

    whenToUse:
      `<p><b>Reach for PyTorch when you want full control and fast iteration.</b> It is the default for
       research, for any <i>custom</i> model (a new layer, a new loss, an unusual training loop), and for
       most new deep-learning projects today. Because every operation runs the instant you call it
       (<b>eager execution</b>), you debug a model the same way you debug any Python: print a tensor,
       step through with a debugger, drop a breakpoint in the middle of the network.</p>
       <ul>
         <li><b>Use PyTorch when:</b> you are doing research or writing a paper; you need a custom model,
         layer, or loss; you are starting a new deep-learning project and want the largest ecosystem of
         examples and pretrained models; or you simply want to <i>see and touch</i> every tensor as it flows.</li>
         <li><b>Prefer a high-level wrapper (Keras, fast.ai, PyTorch Lightning) when:</b> the model is a
         standard architecture and you want a short, batteries-included path &mdash; less boilerplate, fewer
         knobs. Lightning sits <i>on top of</i> PyTorch, so you keep PyTorch underneath.</li>
         <li><b>Consider JAX when:</b> you want a purely <b>functional</b> style (no hidden mutable state),
         aggressive just-in-time compilation, and first-class <b>TPU (Tensor Processing Unit)</b> support &mdash;
         common in some research labs. The trade is a steeper, more mathematical mental model.</li>
       </ul>
       <p>Rule of thumb: <b>start in PyTorch.</b> It is the lingua franca &mdash; if a paper has code, it is
       most likely PyTorch &mdash; and you can always wrap it in Lightning later for less boilerplate.</p>`,

    application:
      `<p>PyTorch is the workhorse of modern deep learning. The large language models, vision models, and
       diffusion image generators you have heard of are overwhelmingly built and trained in it.</p>
       <ul>
         <li><b>Research and prototyping.</b> Its define-by-run nature means a new idea is a few lines of
         ordinary Python away &mdash; the reason it dominates academic and industrial research.</li>
         <li><b>Production training.</b> Companies train huge models on many <b>GPUs (Graphics Processing
         Units)</b> with PyTorch's distributed tooling, then export or serve the result.</li>
         <li><b>Fine-tuning and transfer learning.</b> The Hugging Face ecosystem (transformers, diffusers)
         is PyTorch-first, so adapting a pretrained model to your data is a well-trodden path.</li>
       </ul>
       <p><b>This course's map &mdash; the sibling <code>pt-*</code> lessons.</b> This lesson is the front door;
       the standard workflow below names every stop, and each stop is its own lesson:</p>
       <ol>
         <li><b>Tensors</b> (<code>pt-tensors</code>) &mdash; the n-dimensional array, like a NumPy array that
         can live on a GPU and remember how it was computed.</li>
         <li><b>Autograd</b> (<code>pt-autograd</code>) &mdash; automatic differentiation: PyTorch records your
         operations and computes gradients for you. This is <code>dl-backprop</code> made automatic.</li>
         <li><b>Building models</b> with <code>nn.Module</code> (<code>pt-nn-module</code>) &mdash; how layers,
         parameters, and a <code>forward</code> method package a network. The math is <code>dl-forward-prop</code>.</li>
         <li><b>Loss + optimizer</b> (<code>pt-loss-optim</code>) &mdash; how you say "this is wrong by X" and
         "nudge the weights." The math is <code>dl-cross-entropy</code> and <code>dl-optimizers</code>.</li>
         <li><b>The training loop</b> (<code>pt-training-loop</code>) &mdash; the five lines repeated every step:
         forward, loss, <code>zero_grad</code>, <code>backward</code>, <code>step</code>.</li>
         <li><b>Data</b> with <code>Dataset</code> / <code>DataLoader</code> (<code>pt-data</code>),
         <b>GPU and devices</b> (<code>pt-gpu</code>), <b>convolutional nets</b> (<code>pt-cnn</code>, math in
         <code>dl-conv</code>), <b>saving and loading</b> (<code>pt-save-load</code>), and <b>deployment /
         export</b> (<code>pt-deploy</code>).</li>
       </ol>
       <p>Follow them in order for a guided course, or jump to the one you need. Whenever the <i>math</i> behind a
       step matters, this course points you back to the <code>dl-*</code> concept lessons instead of re-deriving it.</p>`,

    pitfalls:
      `<ul>
         <li><b>Expecting it to feel exactly like NumPy.</b> Tensors look like NumPy arrays and share much of the
         API, but two things are different and will bite you: a tensor can carry an <b>autograd</b> history (so a
         seemingly innocent operation builds a computation graph), and a tensor lives on a specific <b>device</b>
         (CPU or GPU). Fix: keep both facts in mind &mdash; use <code>torch.no_grad()</code> when you do not want a
         graph, and track which device each tensor is on.</li>
         <li><b>Forgetting <code>.to(device)</code>.</b> You move the model to the GPU but leave the input batch on
         the CPU (or vice versa). Fix: send <i>both</i> model and every input tensor to the same
         <code>device</code> &mdash; <code>model.to(device)</code> and <code>x = x.to(device)</code>.</li>
         <li><b>Mixing CPU and GPU tensors.</b> An operation between a tensor on the GPU and one on the CPU throws
         <code>Expected all tensors to be on the same device</code>. Fix: pick one device up front, move everything
         there, and never assume a freshly created tensor is on the GPU (new tensors default to the CPU).</li>
         <li><b>Not setting seeds.</b> Random weight initialization, shuffling, and dropout all use randomness, so
         two runs differ and a result is hard to reproduce. Fix: set <code>torch.manual_seed(0)</code> (and the
         NumPy / Python seeds) at the top of the script when you need reproducibility.</li>
         <li><b>Forgetting <code>optimizer.zero_grad()</code> in the loop.</b> PyTorch <i>accumulates</i> gradients
         by design, so if you skip zeroing them every step they pile up and training goes haywire. (You will meet
         this and the rest of the loop in <code>pt-training-loop</code>.) Fix: zero the gradients before each
         <code>backward()</code>.</li>
       </ul>`,

    bigIdea:
      `<p><b>PyTorch is three ideas wearing one coat.</b> Strip it down and a deep-learning framework is just:</p>
       <ol>
         <li><b>Tensors</b> &mdash; a fast, n-dimensional number array (think NumPy) that can also run on a
         <b>GPU</b> and remember the operations performed on it.</li>
         <li><b>Automatic differentiation (autograd)</b> &mdash; the machinery that, given any computation you wrote,
         computes the gradient of the result with respect to every input. This is <code>dl-backprop</code> done for
         you, automatically, for arbitrary code.</li>
         <li><b>Neural-network building blocks</b> (<code>torch.nn</code>) &mdash; ready-made layers, activations,
         and losses you snap together into a model, plus optimizers (<code>torch.optim</code>) that apply the
         gradient updates.</li>
       </ol>
       <p>The trait that ties them together and defines PyTorch's personality is <b>eager execution</b>, also called
       <b>define-by-run</b>: each line of your model runs the moment Python reaches it, and the computation graph is
       built on the fly as it runs. There is no separate "compile the graph, then feed it data" phase. That is why
       you can <code>print</code> intermediate values, use ordinary <code>if</code> statements and loops inside a
       model, and debug with a normal Python debugger. Define-by-run is the single biggest reason PyTorch took over
       research: the model <i>is</i> the Python program, with nothing hidden.</p>`,

    buildup:
      `<p><b>A short history, because it explains the "eager" obsession.</b></p>
       <p><b>1. The old split: static graph vs. eager.</b> Early <b>TensorFlow</b> (Google, 2015) used a
       <i>static</i> computation graph: you first <i>described</i> the whole network as a graph, then ran data
       through that fixed graph in a separate session. Fast to optimize and deploy, but painful to debug &mdash; you
       could not just print a value mid-network, because at definition time no numbers existed yet.</p>
       <p><b>2. PyTorch's bet (2016): define-by-run.</b> PyTorch (Meta / Facebook AI Research) made the graph
       <i>dynamic</i> &mdash; it is built as the code runs, op by op. Suddenly a model was just a Python function you
       could step through. Researchers loved it, and PyTorch rapidly became the default in academia.</p>
       <p><b>3. Everyone converged on eager.</b> The lesson was learned: TensorFlow 2 (2019) switched to eager
       execution by default, and PyTorch added optional compilation (<code>torch.compile</code>) for speed. So today
       <i>both</i> major frameworks are eager-first; the historical war is largely over, and PyTorch's mindshare in
       research is the lasting legacy.</p>
       <p><b>4. Where JAX fits.</b> <b>JAX</b> (Google, 2018) is the other modern choice. It is <b>functional</b>:
       you write pure functions with no hidden state and apply transformations (<code>grad</code>, <code>jit</code>,
       <code>vmap</code>) to them. It compiles aggressively and shines on <b>TPUs</b>. The trade is a more
       mathematical, less imperative feel. For most people most of the time, PyTorch's imperative style is the gentler
       on-ramp &mdash; which is exactly why this course teaches it.</p>
       <p><b>5. The GPU story, briefly.</b> A <b>GPU</b> was built to color millions of screen pixels in parallel.
       Training a neural net is mostly large matrix multiplications &mdash; also millions of small operations that can
       run at once &mdash; so the same hardware that draws video-game frames also trains networks tens to hundreds of
       times faster than a <b>CPU (Central Processing Unit)</b>. PyTorch lets you move any tensor or model onto the
       GPU with <code>.to("cuda")</code> (CUDA is NVIDIA's GPU computing platform), and that single move is often the
       difference between an experiment that finishes overnight and one that finishes in minutes.</p>`,

    symbols: [],

    derivation:
      `<p><b>The standard workflow every later lesson follows.</b> Almost every PyTorch program, from a two-line toy
       to a billion-parameter model, has the same five-part skeleton. Learn it once here; each part becomes its own
       lesson.</p>
       <ul class="steps">
         <li><b>1. Tensors &mdash; get the data in.</b> Load or create your inputs and targets as tensors, and move
         them to the chosen <code>device</code>. A tensor is the universal currency: data, weights, gradients, and
         outputs are all tensors. (Lesson: <code>pt-tensors</code>.)</li>
         <li><b>2. Model &mdash; define the network.</b> Subclass <code>nn.Module</code>, declare your layers in
         <code>__init__</code>, and write a <code>forward</code> method that maps input to output. This is forward
         propagation (<code>dl-forward-prop</code>) expressed as Python. (Lesson: <code>pt-nn-module</code>.)</li>
         <li><b>3. Loss + optimizer &mdash; define the goal and the update.</b> Pick a loss (how wrong the prediction
         is) and an optimizer (how to nudge the weights down the gradient). The loss math lives in
         <code>dl-cross-entropy</code>; the update rules in <code>dl-optimizers</code>. (Lesson:
         <code>pt-loss-optim</code>.)</li>
         <li><b>4. Training loop &mdash; repeat until good.</b> For each batch: run the forward pass, compute the
         loss, <code>optimizer.zero_grad()</code>, <code>loss.backward()</code> (autograd fills in every gradient via
         <code>dl-backprop</code>), then <code>optimizer.step()</code> (apply the update). Those five lines <i>are</i>
         training. (Lesson: <code>pt-training-loop</code>.)</li>
         <li><b>5. Eval &mdash; check on held-out data.</b> Switch to <code>model.eval()</code>, wrap the pass in
         <code>torch.no_grad()</code>, and measure accuracy or loss on data the model never trained on. (Lesson:
         <code>pt-data</code> covers the train/test split that makes this honest.) $\\blacksquare$</li>
       </ul>
       <p>Every <code>pt-*</code> lesson is a deep dive into one of these five steps (plus practical concerns like the
       GPU, data loading, and saving). Keep this skeleton in your head and the whole course hangs on it.</p>`,

    example:
      `<p>The same "hello world", but with the arithmetic worked out. We add two tensors, then run one
        <code>nn.Linear(3, 1)</code> forward pass — which computes $y = Wx + b$ — with concrete numbers.</p>
       <p><b>Step 1 — the eager add.</b> <code>a = torch.tensor([1., 2., 3.])</code> and <code>b = torch.ones(3)</code>,
        then <code>a + b</code> runs the instant Python reaches it (eager / define-by-run):</p>
       <ul class="steps">
         <li><b>Element 0.</b> $1 + 1 = 2$.</li>
         <li><b>Element 1.</b> $2 + 1 = 3$.</li>
         <li><b>Element 2.</b> $3 + 1 = 4$.</li>
         <li><b>Result.</b> <code>a + b = [2., 3., 4.]</code> — exists immediately, nothing to compile.</li>
       </ul>
       <p><b>Step 2 — the forward pass.</b> Say the seeded layer has weights $W = [0.2, -0.5, 0.4]$ and bias
        $b = 0.1$ (illustrative — the real values come from <code>torch.manual_seed(0)</code>). For input
        $x = [1, 2, 3]$, the layer computes $y = Wx + b = \\sum_i W_i x_i + b$:</p>
       <table class="extable">
         <caption>$y = Wx + b$ — one weight&times;input product per row</caption>
         <thead><tr><th>$i$</th><th class="num">$W_i$</th><th class="num">$x_i$</th><th class="num">$W_i x_i$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">0</td><td class="num">0.2</td><td class="num">1</td><td class="num">0.2</td></tr>
           <tr><td class="row-h">1</td><td class="num">-0.5</td><td class="num">2</td><td class="num">-1.0</td></tr>
           <tr><td class="row-h">2</td><td class="num">0.4</td><td class="num">3</td><td class="num">1.2</td></tr>
           <tr><td class="row-h">sum</td><td class="num"></td><td class="num"></td><td class="num">0.4</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Weighted sum.</b> $0.2 + (-1.0) + 1.2 = 0.4$.</li>
         <li><b>Add the bias.</b> $y = 0.4 + 0.1 = 0.5$ — a single number, the layer's one output.</li>
         <li><b>The skeleton.</b> Add a loss, an optimizer, and a loop around <code>model(x)</code> and you have
         training — the five steps the rest of the course unpacks.</li>
       </ul>`,

    practice: [
      {
        q: `<b>Type this in Colab.</b> Import torch, then print three things: <code>torch.__version__</code>, <code>torch.cuda.is_available()</code>, and a <code>device</code> string set to <code>"cuda"</code> if a GPU is present else <code>"cpu"</code>. Use this <code>device</code> variable everywhere in the rest of the session.`,
        steps: [
          { do: `Check for a GPU with <code>torch.cuda.is_available()</code>.`, why: `It returns a boolean telling you whether a CUDA GPU runtime is attached.` },
          { do: `Pick the device once: <code>device = "cuda" if torch.cuda.is_available() else "cpu"</code>.`, why: `One variable reused everywhere prevents CPU/GPU mismatch errors later.` }
        ],
        answer: `<pre><code>import torch
print(torch.__version__)              # e.g. 2.5.1+cu121
print(torch.cuda.is_available())      # True on a GPU runtime, else False
device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)                         # cuda  (on a GPU runtime) or cpu</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Create <code>a = torch.tensor([1.0, 2.0, 3.0])</code> and <code>b = torch.ones(3)</code>, then compute <code>c = a + b</code>. Predict <code>c</code> and <code>c.shape</code> before running, then print both to verify.`,
        steps: [
          { do: `Add the two 1-D tensors with <code>a + b</code>.`, why: `The op runs immediately (eager execution), so the result exists the instant you call it.` },
          { do: `Print <code>c</code> and <code>c.shape</code>.`, why: `Verifies the elementwise sum and that the shape is unchanged at <code>(3,)</code>.` }
        ],
        answer: `<pre><code>a = torch.tensor([1.0, 2.0, 3.0])
b = torch.ones(3)
c = a + b
print(c)            # tensor([2., 3., 4.])
print(c.shape)      # torch.Size([3])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Demonstrate eager execution: build <code>x = torch.arange(4.)</code>, compute <code>y = x * x</code>, then <code>print("mid-graph:", y)</code> on the very next line, then compute <code>z = y.sum()</code> and print <code>z</code>. Notice you can print the intermediate <code>y</code> without compiling anything.`,
        steps: [
          { do: `Print the intermediate tensor <code>y</code> right after computing it.`, why: `Eager / define-by-run means real numbers exist at every line, so a plain <code>print</code> sees them.` },
          { do: `Reduce with <code>y.sum()</code> and print it.`, why: `Shows the chain of ops each ran as Python reached it, no session or graph step.` }
        ],
        answer: `<pre><code>x = torch.arange(4.)        # tensor([0., 1., 2., 3.])
y = x * x
print("mid-graph:", y)      # mid-graph: tensor([0., 1., 4., 9.])
z = y.sum()
print(z)                    # tensor(14.)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Make a tensor on the chosen device and move it back to the CPU. Set <code>device</code> as before, create <code>t = torch.ones(2, 2, device=device)</code>, print <code>t.device</code>, then <code>t = t.to("cpu")</code> and print <code>t.device</code> again.`,
        steps: [
          { do: `Create with <code>device=device</code>, then read <code>t.device</code>.`, why: `Confirms the tensor was placed on the GPU (or CPU) you selected.` },
          { do: `Move with <code>t.to("cpu")</code> and reassign.`, why: `<code>.to(...)</code> returns a tensor on the new device; you must reassign to keep it.` }
        ],
        answer: `<pre><code>device = "cuda" if torch.cuda.is_available() else "cpu"
t = torch.ones(2, 2, device=device)
print(t.device)        # cuda:0 on a GPU runtime, else cpu
t = t.to("cpu")
print(t.device)        # cpu</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Reproduce the famous device-mismatch error, then fix it. Create <code>w = torch.ones(3, device=device)</code> and <code>x = torch.ones(3)</code> (note: no device, so CPU). Try <code>w + x</code> on a GPU runtime and read the error; then fix it by moving <code>x</code> to <code>device</code> and print the sum.`,
        steps: [
          { do: `Add a GPU tensor to a CPU tensor and read the <code>RuntimeError</code>.`, why: `An op between tensors on different devices is forbidden — this is the #1 beginner error.` },
          { do: `Move both to one device: <code>x = x.to(device)</code>, then add.`, why: `Once every operand shares a device, the op is legal.` }
        ],
        answer: `<pre><code>w = torch.ones(3, device=device)
x = torch.ones(3)                 # defaults to CPU
# On a GPU runtime, w + x raises:
# RuntimeError: Expected all tensors to be on the same device,
#   but found at least two devices, cuda:0 and cpu!
x = x.to(device)                  # fix: move x to the same device
print(w + x)                      # tensor([2., 2., 2.], device='cuda:0') on GPU
# On a CPU-only runtime both are already cpu and it just works.</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show that random init is reproducible with a seed. Call <code>torch.manual_seed(0)</code> then <code>print(torch.randn(3))</code>. Re-seed with <code>torch.manual_seed(0)</code> and print again — confirm you get the identical numbers.`,
        steps: [
          { do: `Set the seed with <code>torch.manual_seed(0)</code> before sampling.`, why: `Fixes the RNG so the same draws come out every run — essential for reproducible experiments.` },
          { do: `Re-seed and re-sample.`, why: `Resetting the seed rewinds the RNG, so the second draw matches the first.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
print(torch.randn(3))   # tensor([ 1.5410, -0.2934, -2.1788])
torch.manual_seed(0)
print(torch.randn(3))   # tensor([ 1.5410, -0.2934, -2.1788])  identical</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Build the five-line model teaser. Create <code>model = torch.nn.Linear(3, 1)</code> on the device, make an input <code>x = torch.tensor([1.0, 2.0, 3.0], device=device)</code>, run a forward pass <code>y = model(x)</code>, and print <code>y.shape</code> and <code>y.item()</code>. Predict the output shape first.`,
        steps: [
          { do: `Move the model to the same device with <code>.to(device)</code>.`, why: `The layer's weights and the input must be on one device for the forward pass.` },
          { do: `Call <code>model(x)</code> (not <code>model.forward(x)</code>).`, why: `Calling the module runs the forward pass plus hooks; <code>nn.Linear(3,1)</code> maps 3 inputs to 1 output.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"
model = torch.nn.Linear(3, 1).to(device)
x = torch.tensor([1.0, 2.0, 3.0], device=device)
y = model(x)
print(y.shape)     # torch.Size([1])  -- one output
print(y.item())    # a single float, e.g. -1.2353 (depends on seeded init)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Convert a tensor to a NumPy array and back. Create <code>c = torch.tensor([2.0, 3.0, 4.0])</code>, print <code>c.numpy()</code> and its type, then wrap a NumPy array back into a tensor with <code>torch.from_numpy(np.array([5.0, 6.0]))</code> and print it.`,
        steps: [
          { do: `Bridge to NumPy with <code>.numpy()</code>.`, why: `CPU tensors share their buffer with NumPy, so interop is cheap and common at the data boundary.` },
          { do: `Wrap a NumPy array with <code>torch.from_numpy(...)</code>.`, why: `Brings external array data into PyTorch as a tensor.` }
        ],
        answer: `<pre><code>import numpy as np
c = torch.tensor([2.0, 3.0, 4.0])
arr = c.numpy()
print(arr, type(arr))                 # [2. 3. 4.] <class 'numpy.ndarray'>
t = torch.from_numpy(np.array([5.0, 6.0]))
print(t)                              # tensor([5., 6.], dtype=torch.float64)</code></pre>`
      }
    ]
  });

  window.CODE["pt-intro"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The PyTorch "hello world", written to run in <b>Google Colab</b> (where <code>torch</code> ships
      preinstalled &mdash; no install needed). It does the five things every PyTorch session starts with:
      <code>import torch</code> and print the version; check for a <b>GPU (Graphics Processing Unit)</b> with
      <code>torch.cuda.is_available()</code> and pick a <code>device</code>; make a couple of tensors and run an
      operation (which executes <i>immediately</i> &mdash; that is eager execution); move a tensor to the GPU if one
      is present; and finally a five-line <code>nn.Linear</code> model forward pass as a teaser for the rest of the
      course. <code>runnable</code> is off because the in-browser engine has no <code>torch</code>; paste this into
      Colab to run it.</p>`,
    code: `# Colab note: torch is preinstalled — no pip install needed. Just run this cell.
import torch
import torch.nn as nn

# ============================================================
# 1. VERSION + HARDWARE CHECK
#    torch.cuda.is_available() -> True if a GPU is present and usable.
#    Pick ONE device string and use it everywhere (avoids CPU/GPU mismatch).
# ============================================================
print("PyTorch version:", torch.__version__)        # e.g. 2.x.x
print("CUDA available :", torch.cuda.is_available()) # True on a GPU runtime
device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using device   :", device)
if device == "cuda":
    print("GPU name       :", torch.cuda.get_device_name(0))

# Set a seed so results are reproducible (random init, shuffling, dropout all use RNG).
torch.manual_seed(0)

# ============================================================
# 2. MAKE A COUPLE OF TENSORS AND DO AN OP
#    Each line runs IMMEDIATELY (eager / define-by-run) — no graph to compile,
#    no session to open. You can print any intermediate value on the spot.
# ============================================================
a = torch.tensor([1.0, 2.0, 3.0])   # a 1-D tensor (like a NumPy array)
b = torch.ones(3)                    # tensor([1., 1., 1.])
c = a + b                            # runs NOW -> tensor([2., 3., 4.])
print("a + b =", c)
print("shape :", c.shape, "| dtype:", c.dtype)

# Tensors interoperate with NumPy, but remember: a tensor can carry an autograd
# history AND lives on a specific device — two things a NumPy array does not.
print("as numpy:", c.numpy())

# ============================================================
# 3. MOVE TO THE GPU IF ONE IS AVAILABLE
#    .to(device) places the tensor on the chosen device.
# ============================================================
a = a.to(device)
print("a is now on:", a.device)      # cpu, or cuda:0 on a GPU runtime

# ============================================================
# 4. A FIVE-LINE LINEAR MODEL — FORWARD PASS (a teaser)
#    nn.Linear(3, 1) computes y = W x + b. Move the model to the SAME device.
#    This is the whole "model" step of the standard workflow, in one layer.
# ============================================================
model = nn.Linear(in_features=3, out_features=1).to(device)
x = torch.tensor([1.0, 2.0, 3.0], device=device)   # one input on the right device
y = model(x)                                        # forward pass — runs immediately
print("model(x) =", y.item())                       # a single predicted number

# That's the skeleton: tensors -> model -> (add a loss + optimizer + loop) -> train.
# The rest of the course unpacks each step.`
  };

  window.CODEVIZ["pt-intro"] = {
    question: "What does 'training' actually look like — and how do you read the loss curve to tell a healthy run from a broken one? Full-batch gradient descent fitting y = 2x + 1, the same loop PyTorch automates with autograd + an optimizer.",
    charts: [
      {
        type: "line",
        title: "Healthy: loss falls then flattens at the noise floor (real run, lr 0.3)",
        xlabel: "epoch",
        ylabel: "mean squared error (loss)",
        series: [
          {
            name: "MSE loss",
            color: "#7ee787",
            points: [[0, 2.2537], [1, 0.9552], [2, 0.5339], [3, 0.332], [4, 0.215], [5, 0.1429], [6, 0.0978], [7, 0.0694], [8, 0.0515], [9, 0.0403], [10, 0.0332], [11, 0.0287], [12, 0.0259], [13, 0.0241], [14, 0.023], [15, 0.0223], [16, 0.0218], [17, 0.0216], [18, 0.0214], [19, 0.0213], [20, 0.0212], [21, 0.0212], [22, 0.0211], [23, 0.0211], [24, 0.0211], [25, 0.0211], [26, 0.0211], [27, 0.0211], [28, 0.0211], [29, 0.0211], [30, 0.0211], [31, 0.0211], [32, 0.0211], [33, 0.0211], [34, 0.0211], [35, 0.0211], [36, 0.0211], [37, 0.0211], [38, 0.0211], [39, 0.0211]]
          }
        ],
        interpret: "X is the epoch (one full pass of the optimizer); Y is the loss, how wrong the model is — lower is better. Read the shape: a steep drop early (the optimizer is taking big useful steps) that bends into a flat floor near 0.021. That floor is the leftover noise in the data, not a bug — the model has learned everything learnable. A curve that falls smoothly and levels off like this is the healthy result you want; here the recovered w=1.89, b=1.00 match the true 2.0 and 1.0. These are real computed numbers."
      },
      {
        type: "line",
        title: "Variant — learning rate too high: loss oscillates / explodes (illustrative)",
        xlabel: "epoch",
        ylabel: "mean squared error (loss)",
        series: [
          {
            name: "MSE loss (lr too high)",
            color: "#ff7b72",
            points: [[0, 2.25], [1, 3.8], [2, 1.6], [3, 6.5], [4, 2.4], [5, 12.0], [6, 4.0], [7, 28.0], [8, 9.0], [9, 70.0], [10, 22.0], [11, 180.0]]
          }
        ],
        interpret: "Same axes, but the curve zig-zags up and down and the peaks keep growing instead of settling. This is the classic too-large learning-rate signature: each step overshoots the bottom of the valley and lands further up the other side, so the loss bounces and can run away toward infinity (often printing NaN). If you see this, lower the learning rate (e.g. 0.3 to 0.03). Illustrative shape."
      },
      {
        type: "line",
        title: "Variant — learning rate too low: barely moves, never converges (illustrative)",
        xlabel: "epoch",
        ylabel: "mean squared error (loss)",
        series: [
          {
            name: "MSE loss (lr too low)",
            color: "#ffb454",
            points: [[0, 2.25], [1, 2.21], [2, 2.17], [3, 2.14], [4, 2.10], [5, 2.07], [6, 2.04], [7, 2.01], [8, 1.98], [9, 1.95], [10, 1.92], [11, 1.90], [12, 1.87], [13, 1.85], [14, 1.83], [15, 1.81]]
          }
        ],
        interpret: "Here the loss does drop, but in a long slow crawl that is nowhere near the 0.021 floor after the same number of epochs. The near-flat, gently-sloping line means the steps are tiny — the learning rate is too small, so training would take enormously long to finish. The fix is the opposite of the case above: raise the learning rate (or train far longer). Don't confuse this with the healthy flat tail — this line is still high and never bent down sharply. Illustrative shape."
      }
    ],
    caption: "Three runs of the same y = 2x + 1 fit, read off the loss curve. Green is the real healthy run (lr 0.3): a sharp drop that flattens at the noise floor. The two coloured variants show what a bad learning rate looks like — too high makes the loss oscillate and explode (red), too low makes it crawl and never converge (orange) — both illustrative but qualitatively honest. In PyTorch you watch exactly this curve every run; autograd computes the gradients (gw, gb) for you instead of deriving them by hand as below.",
    code: `import numpy as np

# ---- A tiny training loop done by hand (this is what PyTorch automates) ----
np.random.seed(0)
N = 64
x = np.linspace(-1, 1, N)
y_true = 2.0 * x + 1.0 + 0.15 * np.random.randn(N)   # line y = 2x + 1 + noise

w, b = 0.0, 0.0       # parameters PyTorch would store in nn.Linear
lr = 0.3              # learning rate (optimizer step size)
epochs = 40
losses = []
for ep in range(epochs):
    yhat = w * x + b                 # FORWARD pass  -> model(x)
    err  = yhat - y_true
    loss = np.mean(err ** 2)         # MSE LOSS      -> loss = criterion(yhat, y)
    losses.append(round(float(loss), 4))
    # BACKWARD: hand-derived gradients. In PyTorch, loss.backward() does this
    # automatically via autograd — no calculus by hand.
    gw = 2 * np.mean(err * x)
    gb = 2 * np.mean(err)
    # STEP: gradient-descent update -> optimizer.step()
    w -= lr * gw
    b -= lr * gb

print("recovered w, b:", round(w, 3), round(b, 3))   # -> 1.889 1.002
print("loss[0], loss[-1]:", losses[0], losses[-1])    # -> 2.2537 0.0211
points = [[ep, l] for ep, l in enumerate(losses)]
print(points)   # the (epoch, loss) pairs plotted above`
  };
})();
