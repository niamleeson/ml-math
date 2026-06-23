/* PyTorch — "What PyTorch is and the mental model: tensors + autograd + nn, run eagerly".
   The front door to the PyTorch course. Self-contained: lesson + CODE + CODEVIZ merged by id "pt-intro". */
(function () {
  window.LESSONS.push({
    id: "pt-intro",
    title: "PyTorch: tensors, autograd, and neural nets that run as you write them",
    tagline: "A Python library where every operation runs immediately (eager / define-by-run), so you build, debug, and train models with ordinary Python — which is why research lives here.",
    module: "PyTorch (a complete course)",
    prereqs: ["dl-forward-prop", "dl-backprop", "dl-optimizers", "fnd-gradient"],

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
      `<p>A complete "hello world" in five small moves &mdash; the shape of every PyTorch program in miniature.</p>
       <ul class="steps">
         <li><b>Import and check the hardware.</b> <code>import torch</code>, then
         <code>torch.cuda.is_available()</code> tells you whether a GPU is present. Set
         <code>device = "cuda" if torch.cuda.is_available() else "cpu"</code> once, and use that variable everywhere.</li>
         <li><b>Make two tensors and do an op.</b> <code>a = torch.tensor([1., 2., 3.])</code> and
         <code>b = torch.ones(3)</code>; then <code>a + b</code> runs <i>immediately</i> (eager) and gives
         <code>[2., 3., 4.]</code> &mdash; no graph to compile, no session to open. You can <code>print</code> it on
         the spot.</li>
         <li><b>Move to the GPU if there is one.</b> <code>a = a.to(device)</code> places the tensor on the chosen
         device. On a GPU-enabled machine the same arithmetic now runs on the GPU.</li>
         <li><b>A five-line model.</b> <code>model = torch.nn.Linear(3, 1)</code> is a tiny linear layer
         (three inputs, one output) &mdash; it computes $y = Wx + b$. Calling <code>model(a)</code> runs a forward
         pass and returns one number. That is the entire "model" step in one line.</li>
         <li><b>That is the skeleton.</b> Add a loss, an optimizer, and a loop around <code>model(a)</code> and you
         have training &mdash; exactly the five steps above, which the rest of the course unpacks.</li>
       </ul>`,

    practice: [
      {
        q: `A teammate coming from TensorFlow 1 asks why, in PyTorch, they can put a plain Python <code>print(x)</code> in the middle of their model's <code>forward</code> method and actually see numbers. What is the one-word property that makes this work, and what does it mean?`,
        steps: [
          { do: `Recall how PyTorch executes a model's operations.`, why: `PyTorch runs each operation the moment Python reaches it, rather than building a graph to run later.` },
          { do: `Name the property: eager execution (define-by-run).`, why: `Because the graph is built as the code runs, real numbers exist at every line, so a normal print sees them.` },
          { do: `Contrast with old static-graph TensorFlow 1.`, why: `There the graph was defined first and run later in a session, so at definition time no numbers existed to print.` }
        ],
        answer: `<p>The property is <b>eager execution</b> (also called <b>define-by-run</b>): every operation runs immediately as Python reaches it, building the computation graph on the fly. Because real values exist at every line, an ordinary <code>print</code>, breakpoint, or <code>if</code> works inside the model. Old static-graph TensorFlow 1 defined the whole graph first and only produced numbers later in a separate session, which is why you could not just print mid-network. This define-by-run feel is the main reason PyTorch dominates research.</p>`
      },
      {
        q: `You write <code>model = model.to("cuda")</code> at the top of your script, but the first batch crashes with <code>Expected all tensors to be on the same device, but found at least two devices, cuda and cpu</code>. What did you forget, and what is the general rule?`,
        steps: [
          { do: `Read the error: two devices are involved, cuda and cpu.`, why: `An operation is mixing a tensor on the GPU with a tensor on the CPU, which PyTorch forbids.` },
          { do: `Check where the input batch lives.`, why: `You moved the model to the GPU but a freshly loaded input tensor defaults to the CPU, so they mismatch.` },
          { do: `Move the inputs to the same device as the model.`, why: `<code>x = x.to(device)</code> (and the targets too) puts every tensor on one device so the operation is legal.` }
        ],
        answer: `<p>You moved the <b>model</b> to the GPU but left the <b>input batch on the CPU</b>. New tensors default to the CPU, so the forward pass tried to combine a GPU weight with a CPU input. The general rule: pick one <code>device</code> up front and send <i>everything</i> there &mdash; <code>model.to(device)</code> <b>and</b> <code>x = x.to(device)</code> (and the targets). Mixing CPU and GPU tensors is one of the most common PyTorch errors.</p>`
      },
      {
        q: `Your friend wants to fit a standard, off-the-shelf image classifier as fast as possible with minimal code, while you are inventing a brand-new attention variant for a paper. Which tools fit each of you, and why?`,
        steps: [
          { do: `Characterize the friend's task: a standard architecture, wants minimal boilerplate.`, why: `A high-level wrapper hides the training loop and gives a short, batteries-included path for common models.` },
          { do: `Characterize your task: a novel custom component for research.`, why: `Research needs full control and easy debugging of every tensor, which raw PyTorch's eager style gives.` },
          { do: `Match each person to a tool.`, why: `Friend -> Keras / fast.ai / PyTorch Lightning; you -> raw PyTorch (and Lightning still sits on PyTorch if wanted).` }
        ],
        answer: `<p>Your friend's job is a <b>standard model with minimal code</b>, so a high-level wrapper &mdash; <b>Keras</b>, <b>fast.ai</b>, or <b>PyTorch Lightning</b> &mdash; is the fast path; it hides the loop and the boilerplate. Your job is a <b>novel custom component for a paper</b>, where you want to see and touch every tensor and debug freely, so <b>raw PyTorch</b> with its eager, define-by-run style fits best. Note these are not opposites: Lightning runs <i>on top of</i> PyTorch, so you can always start in plain PyTorch and add a wrapper later. (JAX would be the pick only if you specifically wanted a functional style or heavy TPU use.)</p>`
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
    question: "What does 'training' actually look like? A tiny model's loss falling over epochs — the curve you watch in every PyTorch run. Here: full-batch gradient descent fitting a line y = 2x + 1, the same loop PyTorch automates with autograd + an optimizer.",
    charts: [
      {
        type: "line",
        title: "Training loss falling over epochs — tiny linear fit (real run)",
        xlabel: "epoch",
        ylabel: "mean squared error (loss)",
        series: [
          {
            name: "MSE loss",
            color: "#7ee787",
            points: [[0, 2.2537], [1, 0.9552], [2, 0.5339], [3, 0.332], [4, 0.215], [5, 0.1429], [6, 0.0978], [7, 0.0694], [8, 0.0515], [9, 0.0403], [10, 0.0332], [11, 0.0287], [12, 0.0259], [13, 0.0241], [14, 0.023], [15, 0.0223], [16, 0.0218], [17, 0.0216], [18, 0.0214], [19, 0.0213], [20, 0.0212], [21, 0.0212], [22, 0.0211], [23, 0.0211], [24, 0.0211], [25, 0.0211], [26, 0.0211], [27, 0.0211], [28, 0.0211], [29, 0.0211], [30, 0.0211], [31, 0.0211], [32, 0.0211], [33, 0.0211], [34, 0.0211], [35, 0.0211], [36, 0.0211], [37, 0.0211], [38, 0.0211], [39, 0.0211]]
          }
        ]
      }
    ],
    caption: "Real numbers from the numpy code below. A linear model y = w*x + b is fit to data generated from y = 2x + 1 + noise using full-batch gradient descent (learning rate 0.3). The loss starts at 2.25 and falls to 0.0211 — the leftover noise floor — by epoch ~20, then flattens. This falling-then-flattening curve is exactly what you watch when training any PyTorch model; the recovered parameters end at w=1.89, b=1.00, close to the true 2.0 and 1.0. In PyTorch you write this loop in five lines and let autograd compute the gradients (gw, gb) for you instead of deriving them by hand as we do here.",
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
