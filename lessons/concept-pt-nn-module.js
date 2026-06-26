/* PyTorch (a complete course) — "Building models with torch.nn: nn.Module, layers, parameters".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-nn-module". */
(function () {
  window.LESSONS.push({
    id: "pt-nn-module",
    title: "Building models with torch.nn: nn.Module, layers, and parameters",
    tagline: "Subclass nn.Module, declare layers in __init__, wire them in forward, and PyTorch tracks every weight for you.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["dl-forward-prop", "dl-neuron", "dl-init"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>build a model by subclassing <code>nn.Module</code> &mdash; call <code>super().__init__()</code>, declare layers in <code>__init__</code>, wire them in <code>forward</code> &mdash; and run it with <code>model(x)</code> (never <code>model.forward(x)</code>);</li>
<li>count a model's trainable parameters two ways: by hand with <code>in*out + out</code> per <code>nn.Linear</code>, and with <code>sum(p.numel() for p in model.parameters())</code>;</li>
<li>read a model's structure and checkpoint keys (<code>print(model)</code>, <code>state_dict()</code>), and build the same straight stack with <code>nn.Sequential</code>.</li>
</ul>
<p><b>The API you'll own:</b> <code>nn.Module</code>, <code>super().__init__()</code>, <code>nn.Linear</code>, <code>nn.ReLU</code>, <code>forward</code>, <code>model.parameters()</code> / <code>named_parameters()</code>, <code>state_dict()</code>, <code>nn.Sequential</code>, <code>model.apply</code>.</p>`,

    concept: `<p>An <code>nn.Module</code> bundles two things: the <b>state</b> (its weight tensors, called parameters) and the <b>computation</b> (how to turn an input into an output). You define both in one class, and the pattern never changes: <b>declare the layers in <code>__init__</code></b>, then <b>describe the data flow in <code>forward</code></b>. PyTorch does the rest &mdash; it finds every parameter, tracks gradients, and lets you save, load, and move the whole model with one call.</p>
<p>The magic is <b>auto-registration</b>. <code>nn.Module</code> overrides Python's attribute assignment: when you write <code>self.fc1 = nn.Linear(4, 8)</code>, the base class notices the value is a <code>Module</code> and records it in an internal registry. That is exactly why layers must live on <code>self</code> in <code>__init__</code> &mdash; a layer built inside <code>forward</code> is never assigned to <code>self</code>, so it is never registered, never appears in <code>model.parameters()</code>, and <b>never trains</b>. <code>model.parameters()</code> walks that registry and yields every parameter tensor; each has <code>requires_grad=True</code>, so <code>loss.backward()</code> fills its <code>.grad</code> and the optimizer (which you handed <code>model.parameters()</code>) updates it.</p>
<p>Two more rules follow from this:</p>
<ul>
<li><b>Call <code>model(x)</code>, not <code>model.forward(x)</code>.</b> <code>model(x)</code> invokes <code>nn.Module.__call__</code>, which runs registered hooks and respects train/eval mode <i>around</i> your <code>forward</code>; calling <code>.forward</code> directly skips all of that.</li>
<li><b>Start with <code>nn.Sequential</code> for a straight chain</b> &mdash; layer, then layer, with one input and output &mdash; and graduate to subclassing the moment the data flow stops being a single line (skip connections, branching, multiple inputs).</li>
</ul>
<p>The running example is a two-layer Multi-Layer Perceptron (MLP), <code>Linear(784&rarr;256) &rarr; ReLU &rarr; Linear(256&rarr;10)</code> &mdash; the math is <a onclick="App.open('dl-forward-prop')">forward propagation</a>.</p>`,

    apiTable: [
      { sig: "class Net(nn.Module):", does: "Subclass the base class for every model and layer. Your network <i>is</i> a Python class.", snippet: "class MLP(nn.Module): ..." },
      { sig: "super().__init__()", does: "MUST be the first line of <code>__init__</code> &mdash; it sets up the registries; skip it and assignment errors.", snippet: "def __init__(self):\n    super().__init__()" },
      { sig: "self.fc = nn.Linear(in_f, out_f)", does: "A fully-connected layer: weight of shape <code>(out, in)</code> plus bias of length <code>out</code>. Assigning to <code>self</code> registers it.", snippet: "self.fc1 = nn.Linear(784, 256)" },
      { sig: "nn.ReLU()", does: "A parameter-free activation, <code>max(0, z)</code> &mdash; adds nonlinearity with zero weights.", snippet: "self.relu = nn.ReLU()" },
      { sig: "def forward(self, x):", does: "Define the data flow: input tensor in, output tensor out. PyTorch calls it via <code>model(x)</code>.", snippet: "return self.fc2(self.relu(self.fc1(x)))" },
      { sig: "model(x)", does: "Run a forward pass <i>plus</i> hooks and train/eval machinery. Never call <code>model.forward(x)</code>.", snippet: "logits = model(x)" },
      { sig: "model.parameters() / named_parameters()", does: "Iterate every registered weight tensor (with names) &mdash; what you hand to an optimizer.", snippet: "sum(p.numel() for p in model.parameters())" },
      { sig: "model.state_dict()", does: "Ordered dict mapping each parameter name to its tensor &mdash; the contents of a checkpoint.", snippet: "list(model.state_dict().keys())" },
      { sig: "nn.Sequential(*layers)", does: "Glue a straight chain of layers without writing a class &mdash; one input, one output.", snippet: "nn.Sequential(nn.Linear(784,256), nn.ReLU(), nn.Linear(256,10))" },
      { sig: "model.apply(fn)", does: "Walk every submodule and run <code>fn</code> on it &mdash; the usual way to (re)initialize weights.", snippet: "model.apply(init_weights)" }
    ],

    codeTour: [
      {
        explain: `<b>Subclass <code>nn.Module</code> and declare the layers.</b> <code>super().__init__()</code> comes first to set up the registries; then each <code>nn.Linear</code> / <code>nn.ReLU</code> assigned to <code>self</code> is auto-registered. <code>forward</code> wires them into the data flow. <code>print(model)</code> shows the module tree.`,
        code: `import torch\nimport torch.nn as nn\n\ntorch.manual_seed(0)\n\nclass MLP(nn.Module):\n    def __init__(self, in_dim=784, hidden=256, out_dim=10):\n        super().__init__()\n        self.fc1 = nn.Linear(in_dim, hidden)\n        self.relu = nn.ReLU()\n        self.fc2 = nn.Linear(hidden, out_dim)\n    def forward(self, x):\n        return self.fc2(self.relu(self.fc1(x)))\n\nmodel = MLP()\nprint(model)`,
        output: `MLP(\n  (fc1): Linear(in_features=784, out_features=256, bias=True)\n  (relu): ReLU()\n  (fc2): Linear(in_features=256, out_features=10, bias=True)\n)`
      },
      {
        explain: `<b>Parameters are auto-registered.</b> <code>model.parameters()</code> yields every registered weight tensor; here the total is <code>784*256+256 + 256*10+10 = 203530</code>. Each parameter has <code>requires_grad=True</code>, and <code>state_dict()</code> names them &mdash; that naming is what a checkpoint saves.`,
        code: `n_params = sum(p.numel() for p in model.parameters())\nprint("trainable parameters:", n_params)\nprint("fc1.weight requires_grad:", model.fc1.weight.requires_grad)\nprint("state_dict keys:", list(model.state_dict().keys()))`,
        output: `trainable parameters: 203530\nfc1.weight requires_grad: True\nstate_dict keys: ['fc1.weight', 'fc1.bias', 'fc2.weight', 'fc2.bias']`
      },
      {
        explain: `<b>A forward pass &mdash; call the module.</b> A batch of 8 inputs of 784 features each maps to <code>(8, 10)</code> logits. Use <code>model(x)</code>, never <code>model.forward(x)</code>, so the hooks and train/eval machinery run around your <code>forward</code>.`,
        code: `x = torch.randn(8, 784)\nlogits = model(x)               # NOT model.forward(x)\nprint("output shape:", logits.shape)`,
        output: `output shape: torch.Size([8, 10])`
      },
      {
        explain: `<b>The same network as <code>nn.Sequential</code>.</b> For a straight stack you can skip the class entirely. Same layers mean the same registered parameters, so the count is identical (<code>203530</code>) and the output shape matches.`,
        code: `seq = nn.Sequential(\n    nn.Linear(784, 256),\n    nn.ReLU(),\n    nn.Linear(256, 10),\n)\nprint("sequential parameters:", sum(p.numel() for p in seq.parameters()))\nprint("sequential output:", seq(x).shape)`,
        output: `sequential parameters: 203530\nsequential output: torch.Size([8, 10])`
      },
      {
        explain: `<b>Controlling weight initialization.</b> <code>model.apply(fn)</code> walks every submodule; here we re-init each <code>nn.Linear</code> with Kaiming-normal weights and zero biases. Confirm <code>fc1.bias</code> is now all zeros &mdash; the math behind a good init is <code>dl-init</code>.`,
        code: `def init_weights(m):\n    if isinstance(m, nn.Linear):\n        nn.init.kaiming_normal_(m.weight, nonlinearity="relu")\n        nn.init.zeros_(m.bias)\n\nmodel.apply(init_weights)\nprint("fc1.bias all zeros:", bool(torch.all(model.fc1.bias == 0)))`,
        output: `fc1.bias all zeros: True`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom and read each printout against its note:</p>
<ul>
<li><code>print(model)</code> shows the module tree &mdash; <code>fc1</code>, <code>relu</code>, <code>fc2</code> &mdash; proving all three layers were registered (a layer built in <code>forward</code> would be absent).</li>
<li><code>trainable parameters: 203530</code> matches the by-hand sum <code>(784*256+256) + (256*10+10)</code>; <code>requires_grad: True</code> confirms the optimizer will update them; the four <code>state_dict</code> keys are exactly what a checkpoint stores.</li>
<li><code>output shape: torch.Size([8, 10])</code> &mdash; a batch of 8 turned into 8 rows of 10 logits, proving the forward wiring is correct.</li>
<li>The <code>nn.Sequential</code> version prints the <i>same</i> <code>203530</code> and <code>(8, 10)</code> &mdash; same layers, same parameters.</li>
<li><code>fc1.bias all zeros: True</code> shows <code>model.apply</code> reached every submodule and re-initialized it.</li>
</ul>
<p>The structure and counts are deterministic. The actual weight <i>values</i> depend on <code>torch.manual_seed(0)</code> and are identical on CPU and GPU given the same seed; without the seed, init differs every run.</p>`,

    cheatsheet: [
      { code: "class Net(nn.Module): ...", note: "every model subclasses nn.Module" },
      { code: "super().__init__()", note: "FIRST line of __init__ (sets up registration)" },
      { code: "self.fc = nn.Linear(in, out)", note: "declare layers on self in __init__ -> registered" },
      { code: "def forward(self, x): return ...", note: "the data flow; PyTorch calls it via model(x)" },
      { code: "logits = model(x)", note: "forward pass &mdash; NOT model.forward(x)" },
      { code: "sum(p.numel() for p in model.parameters())", note: "count trainable params (in*out + out per Linear)" },
      { code: "list(model.state_dict().keys())", note: "named weight tensors -> what a checkpoint stores" },
      { code: "nn.Sequential(L1, nn.ReLU(), L2)", note: "quick straight stack, no class" },
      { code: "model.apply(init_fn)", note: "walk every submodule (e.g. re-init weights)" }
    ],

    deeper: `<p>An <code>nn.Module</code> is the code form of the network math:</p>
<ul>
<li>each <code>nn.Linear</code> is a layer of <a onclick="App.open('dl-neuron')">neurons</a> computing <code>Wx + b</code>, and stacking them with a <code>ReLU</code> between is <a onclick="App.open('dl-forward-prop')">forward propagation</a>;</li>
<li>the registered parameters carry <code>requires_grad=True</code> so <a onclick="App.open('dl-backprop')">backprop</a> can fill their <code>.grad</code> &mdash; autograd (<code>pt-autograd</code>) is the engine, the optimizer the updater;</li>
<li>how those weights start out &mdash; Kaiming/Xavier &mdash; is the subject of <a onclick="App.open('dl-init')">weight initialization</a>, which is why <code>model.apply</code> with <code>nn.init.*</code> matters.</li>
</ul>
<p>The class packages the math; the registries are what let one <code>.parameters()</code> call, one <code>.backward()</code>, and one <code>.to(device)</code> drive the whole network at once.</p>`,

    whenToUse:
      `<p><b>This is the foundation of every PyTorch model you will ever write.</b> The class
       <code>nn.Module</code> is the base class for all neural-network parts in PyTorch &mdash; a single layer,
       a block, or a whole network. You almost always build a model by <i>subclassing</i> it.</p>
       <ul>
         <li><b>Reach for an <code>nn.Module</code> subclass when</b> the computation has any custom logic: skip
         connections, multiple inputs or outputs, branching, or anything that is more than a straight stack. You get
         a real Python class, so you can put any code you like in <code>forward</code>.</li>
         <li><b>Reach for <code>nn.Sequential</code> when</b> the model is just a straight chain &mdash; layer, then
         layer, then layer &mdash; with one input and one output. It is the quick way to glue a few layers together
         without writing a class at all.</li>
       </ul>
       <p>Rule of thumb: <b>start with <code>nn.Sequential</code> for simple stacks; graduate to subclassing
       <code>nn.Module</code> the moment the data flow stops being a single straight line.</b> Everything else in
       PyTorch &mdash; optimizers, saving and loading, moving to a Graphics Processing Unit (GPU) &mdash; is built to
       work on an <code>nn.Module</code>, so this lesson is the gateway to the rest of the course.</p>`,

    application:
      `<p>You will not build a serious PyTorch model without this.</p>
       <ul>
         <li><b>Every architecture is an <code>nn.Module</code>.</b> A ResNet, a Transformer, a tiny
         Multi-Layer Perceptron (MLP) &mdash; all are subclasses, often built from smaller <code>nn.Module</code>
         blocks nested inside.</li>
         <li><b>Optimizers read the parameters from it.</b> You hand <code>model.parameters()</code> to an optimizer
         (such as <code>torch.optim.Adam</code>) and it knows exactly which tensors to update.</li>
         <li><b>Saving and loading uses its <code>state_dict()</code>.</b> A checkpoint is just the model's dictionary
         of named weight tensors written to disk.</li>
         <li><b>Moving to a device is one call.</b> <code>model.to("cuda")</code> walks the module tree and moves
         every registered parameter to the GPU at once.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting <code>super().__init__()</code>.</b> The very first line of your <code>__init__</code> must
         be <code>super().__init__()</code>. It sets up the bookkeeping that registers your layers. Skip it and you
         get an error like <code>cannot assign module before Module.__init__() call</code>.</li>
         <li><b>Defining layers OUTSIDE <code>__init__</code>.</b> Only layers assigned to <code>self</code> inside
         <code>__init__</code> are <b>registered</b> &mdash; that is, tracked by the module. A layer created on the
         fly inside <code>forward</code> (e.g. <code>nn.Linear(...)</code> called each forward pass) is <i>not</i> in
         <code>model.parameters()</code>, so the optimizer never sees it and <b>it never trains</b>.</li>
         <li><b>Calling <code>model.forward(x)</code> directly.</b> Always call <code>model(x)</code>. The
         <code>__call__</code> wrapper runs <code>forward</code> <i>plus</i> registered hooks and the train/eval
         machinery; calling <code>.forward</code> yourself silently skips all of that.</li>
         <li><b>Not moving the model to the device.</b> If the input is on the GPU but the model is on the
         Central Processing Unit (CPU) you get <code>Expected all tensors to be on the same device</code>. Move both:
         <code>model.to(device)</code> and <code>x = x.to(device)</code>.</li>
         <li><b>Mismatched layer in/out dimensions.</b> The <code>out_features</code> of one
         <code>nn.Linear</code> must equal the <code>in_features</code> of the next. A mismatch throws a shape error
         like <code>mat1 and mat2 shapes cannot be multiplied</code> at the forward pass.</li>
         <li><b>Sharing a layer when you meant separate ones.</b> Writing <code>self.fc1 = self.fc2 = nn.Linear(...)</code>
         (or reusing one layer object in two places) makes them the <i>same</i> weights. If you wanted two independent
         layers, construct two <code>nn.Linear</code> objects.</li>
       </ul>`,

    bigIdea:
      `<p>An <code>nn.Module</code> bundles two things: the <b>state</b> (its weight tensors, called parameters) and
       the <b>computation</b> (how to turn an input into an output). You define both in one class.</p>
       <p>The pattern never changes: <b>declare the layers in <code>__init__</code></b>, then <b>describe the data
       flow in <code>forward</code></b>. PyTorch does the rest &mdash; it finds every parameter, tracks gradients,
       and lets you save, load, and move the whole model with one call.</p>`,

    buildup:
      `<p>Three steps build any model:</p>
       <ol>
         <li>Subclass <code>nn.Module</code> and call <code>super().__init__()</code> first.</li>
         <li>Create your layers as attributes on <code>self</code> &mdash; e.g.
         <code>self.fc1 = nn.Linear(in, hidden)</code>. Assigning an <code>nn.Module</code> (or an
         <code>nn.Parameter</code>) to <code>self</code> auto-<b>registers</b> it.</li>
         <li>Write <code>forward(self, x)</code>: take the input tensor, push it through the layers, return the
         output. Then call the model as <code>model(x)</code> &mdash; never <code>model.forward(x)</code>.</li>
       </ol>`,

    symbols: [
      { sym: "<code>nn.Module</code>", desc: "the base class for every model and layer; you subclass it." },
      { sym: "<code>__init__</code>", desc: "the constructor; create and register your layers here (after <code>super().__init__()</code>)." },
      { sym: "<code>forward</code>", desc: "defines the computation: input tensor in, output tensor out. PyTorch calls it for you via <code>model(x)</code>." },
      { sym: "<code>nn.Linear(in, out)</code>", desc: "a fully-connected layer; holds a weight matrix of shape (out, in) plus a bias of length out." },
      { sym: "<code>model.parameters()</code>", desc: "an iterator over all registered weight tensors; each is an autograd tensor with <code>requires_grad=True</code>." },
      { sym: "<code>model.state_dict()</code>", desc: "an ordered dictionary mapping each parameter's name to its tensor &mdash; what you save to and load from a checkpoint." }
    ],

    derivation:
      `<p><b>How auto-registration actually works.</b></p>
       <ul class="steps">
         <li><code>nn.Module</code> overrides Python's attribute assignment (<code>__setattr__</code>). When you write
         <code>self.fc1 = nn.Linear(4, 8)</code>, the base class notices the value is a <code>Module</code> and
         records it in an internal registry of <b>submodules</b>; an <code>nn.Parameter</code> goes into a registry
         of <b>parameters</b>.</li>
         <li>This is exactly why layers must live in <code>__init__</code> on <code>self</code>: a plain local
         variable, or a layer built inside <code>forward</code>, is never assigned to <code>self</code>, so it is
         never registered and never trained.</li>
         <li><code>model.parameters()</code> walks that registry tree recursively and yields every parameter tensor.
         Each one has <code>requires_grad=True</code>, so when you call <code>loss.backward()</code> autograd fills in
         its <code>.grad</code>, and the optimizer (which you handed <code>model.parameters()</code>) updates it.</li>
         <li>Calling <code>model(x)</code> invokes <code>nn.Module.__call__</code>, which runs any registered
         forward-pre hooks, then your <code>forward</code>, then forward hooks &mdash; and respects the current
         train/eval mode. Calling <code>model.forward(x)</code> jumps straight to your method and skips all of that,
         which is why it is discouraged.</li>
       </ul>`,

    example:
      `<p>A two-layer MLP that maps a length-4 input to 3 outputs, with a hidden layer of 8 units:</p>
       <p><code>Linear(4&rarr;8) &rarr; ReLU &rarr; Linear(8&rarr;3)</code>.</p>
       <ul class="steps">
         <li>First layer parameters: weight matrix of shape (8, 4) = 32 numbers, plus a bias of length 8 =
         8 numbers &rarr; <b>40</b>.</li>
         <li>The Rectified Linear Unit (ReLU) has <b>no</b> parameters &mdash; it is just <code>max(0, z)</code>.</li>
         <li>Second layer: weight (3, 8) = 24, plus bias of length 3 = 3 &rarr; <b>27</b>.</li>
         <li>Total trainable parameters: $40 + 27 = 67$. The formula per linear layer is
         $\\text{in} \\times \\text{out} + \\text{out}$ (the <code>+out</code> is the bias).</li>
       </ul>`,

    practice: [
      {
        q: `<b>Type this in Colab.</b> Define a minimal <code>nn.Module</code> subclass <code>Net</code> with one layer <code>self.fc = nn.Linear(4, 2)</code> declared in <code>__init__</code> (call <code>super().__init__()</code> first) and a <code>forward</code> that returns <code>self.fc(x)</code>. Instantiate it and <code>print(model)</code>.`,
        steps: [
          { do: `Call <code>super().__init__()</code> as the first line of <code>__init__</code>.`, why: `It sets up the bookkeeping that registers layers; skipping it raises an error.` },
          { do: `Declare the layer on <code>self</code>, then use it in <code>forward</code>.`, why: `Only layers assigned to <code>self</code> are registered and trained.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(4, 2)
    def forward(self, x):
        return self.fc(x)

model = Net()
print(model)
# Net(
#   (fc): Linear(in_features=4, out_features=2, bias=True)
# )</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Reproduce the famous <code>super().__init__()</code> pitfall. Write a subclass that assigns <code>self.fc = nn.Linear(4, 2)</code> WITHOUT calling <code>super().__init__()</code> first. Instantiate it inside a <code>try/except</code> and print the error. Then fix it and confirm it constructs.`,
        steps: [
          { do: `Omit <code>super().__init__()</code> and assign a layer to <code>self</code>.`, why: `The registration machinery is not set up yet, so assigning a Module fails.` },
          { do: `Add <code>super().__init__()</code> as the first line to fix it.`, why: `It initializes the parameter/submodule registries before any layer is assigned.` }
        ],
        answer: `<pre><code>class Broken(nn.Module):
    def __init__(self):
        self.fc = nn.Linear(4, 2)     # no super().__init__() yet!
    def forward(self, x):
        return self.fc(x)

try:
    Broken()
except AttributeError as err:
    print("failed:", "Module.__init__()" in str(err))   # failed: True

class Fixed(nn.Module):
    def __init__(self):
        super().__init__()            # the fix
        self.fc = nn.Linear(4, 2)
    def forward(self, x):
        return self.fc(x)
print(Fixed())   # constructs fine</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Build the canonical MLP <code>Linear(784&rarr;256) &rarr; ReLU &rarr; Linear(256&rarr;10)</code> as an <code>nn.Module</code> subclass (seed first with <code>torch.manual_seed(0)</code>). Run a forward pass on <code>x = torch.randn(8, 784)</code> and print the output shape. Predict the shape first.`,
        steps: [
          { do: `Stack two <code>nn.Linear</code> layers with a <code>ReLU</code> between them.`, why: `The hidden width 256 connects the layers; ReLU adds nonlinearity with no parameters.` },
          { do: `Call <code>model(x)</code> (never <code>model.forward(x)</code>).`, why: `Calling the module runs hooks plus <code>forward</code>; a batch of 8 maps to <code>(8, 10)</code> logits.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(256, 10)
    def forward(self, x):
        return self.fc2(self.relu(self.fc1(x)))

model = MLP()
x = torch.randn(8, 784)
logits = model(x)
print(logits.shape)     # torch.Size([8, 10])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Count the trainable parameters of that MLP two ways. Compute by hand with <code>in*out + out</code> per layer, then verify with <code>sum(p.numel() for p in model.parameters())</code>. Predict the total before running.`,
        steps: [
          { do: `Apply <code>in*out + out</code> to each <code>nn.Linear</code>.`, why: `A linear layer is a weight matrix (<code>in*out</code>) plus one bias per output (<code>out</code>).` },
          { do: `Sum with <code>p.numel()</code> over <code>model.parameters()</code>.`, why: `It iterates every registered weight tensor and totals their element counts.` }
        ],
        answer: `<pre><code># By hand, in*out + out per linear layer (ReLU has 0):
#   fc1: 784*256 + 256 = 200960
#   fc2: 256*10  + 10  =   2570
#   total              = 203530
n = sum(p.numel() for p in model.parameters())
print(n)                # 203530
print(n == 200960 + 2570)   # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show that a layer built inside <code>forward</code> is NOT registered. Define a model whose <code>forward</code> does <code>h = nn.Linear(4, 4)(x)</code> (a throwaway), with only <code>self.out = nn.Linear(4, 2)</code> in <code>__init__</code>. Print the names from <code>model.named_parameters()</code> and note the in-<code>forward</code> layer is absent.`,
        steps: [
          { do: `List <code>[name for name, _ in model.named_parameters()]</code>.`, why: `Only layers assigned to <code>self</code> in <code>__init__</code> appear; the in-<code>forward</code> layer never registers.` },
          { do: `Observe only <code>out.*</code> entries are present.`, why: `The throwaway <code>nn.Linear</code> is rebuilt with new random weights each call and the optimizer never sees it.` }
        ],
        answer: `<pre><code>class Leaky(nn.Module):
    def __init__(self):
        super().__init__()
        self.out = nn.Linear(4, 2)
    def forward(self, x):
        h = nn.Linear(4, 4)(x)      # throwaway -- NOT registered
        return self.out(h)

model = Leaky()
print([name for name, _ in model.named_parameters()])
# ['out.weight', 'out.bias']   -- the in-forward Linear is missing!</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The same network with <code>nn.Sequential</code>. Build <code>seq = nn.Sequential(nn.Linear(784, 256), nn.ReLU(), nn.Linear(256, 10))</code>, run it on <code>x = torch.randn(8, 784)</code>, and confirm its parameter count matches the subclassed MLP (203530).`,
        steps: [
          { do: `Stack the layers in <code>nn.Sequential</code>.`, why: `For a straight chain it glues layers without writing a class.` },
          { do: `Count with <code>sum(p.numel() for p in seq.parameters())</code>.`, why: `Same layers mean the same registered parameters and identical count.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
seq = nn.Sequential(nn.Linear(784, 256), nn.ReLU(), nn.Linear(256, 10))
x = torch.randn(8, 784)
print(seq(x).shape)                                  # torch.Size([8, 10])
print(sum(p.numel() for p in seq.parameters()))      # 203530</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Peek at the checkpoint keys and confirm parameters track gradients. For the subclassed MLP, print <code>list(model.state_dict().keys())</code> and <code>model.fc1.weight.requires_grad</code>. Predict both before running.`,
        steps: [
          { do: `Read <code>model.state_dict().keys()</code>.`, why: `It names every registered weight tensor — what a checkpoint stores.` },
          { do: `Check <code>model.fc1.weight.requires_grad</code>.`, why: `Registered parameters default to <code>requires_grad=True</code> so autograd fills their <code>.grad</code>.` }
        ],
        answer: `<pre><code>print(list(model.state_dict().keys()))
# ['fc1.weight', 'fc1.bias', 'fc2.weight', 'fc2.bias']
print(model.fc1.weight.requires_grad)   # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Reproduce a layer-size-mismatch error. Build <code>nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(64, 2))</code> (note: 32 &ne; 64), run it on <code>torch.randn(5, 10)</code> inside a <code>try/except</code>, and print the error. Then fix the second layer's <code>in_features</code> to 32 and print the output shape.`,
        steps: [
          { do: `Wire <code>out_features=32</code> into <code>in_features=64</code> and run.`, why: `The forward matmul needs matching dims; a mismatch raises a shape error.` },
          { do: `Change the second layer to <code>nn.Linear(32, 2)</code>.`, why: `Each layer's <code>out_features</code> must equal the next layer's <code>in_features</code>.` }
        ],
        answer: `<pre><code>bad = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(64, 2))
x = torch.randn(5, 10)
try:
    bad(x)
except RuntimeError as err:
    print("mismatch:", "cannot be multiplied" in str(err))   # mismatch: True

good = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 2))
print(good(x).shape)      # torch.Size([5, 2])</code></pre>`
      }
    ]
  });

  window.CODE["pt-nn-module"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The canonical PyTorch model pattern, built <b>two ways</b>. First we subclass <code>nn.Module</code>:
      declare the layers in <code>__init__</code> (after <code>super().__init__()</code>) and wire them in
      <code>forward</code>. We instantiate it, <code>print(model)</code> to see its structure, count its trainable
      parameters with <code>sum(p.numel() for p in model.parameters())</code>, peek at the keys of
      <code>state_dict()</code>, and run a forward pass on a random batch by calling <code>model(x)</code> (never
      <code>model.forward(x)</code>). Then we build the <i>same</i> network with <code>nn.Sequential</code> &mdash; the
      quick way for a straight stack &mdash; and confirm it has an identical parameter count. <code>runnable</code> is
      off because the in-browser engine has no PyTorch; paste this into Google Colab (torch ships preinstalled) to run
      it.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)                      # reproducible weights and input

# ============================================================
# 1. AN MLP BY SUBCLASSING nn.Module
#    Layers live in __init__ (so they are REGISTERED);
#    the data flow lives in forward.
# ============================================================
class MLP(nn.Module):
    def __init__(self, in_dim=784, hidden=256, out_dim=10):
        super().__init__()               # MUST be first: sets up registration
        self.fc1 = nn.Linear(in_dim, hidden)   # registered weight + bias
        self.relu = nn.ReLU()                  # parameter-free activation
        self.fc2 = nn.Linear(hidden, out_dim)  # registered weight + bias

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x                          # raw logits (no softmax here)

model = MLP()
print(model)                              # prints the module tree

# ------------------------------------------------------------
# Parameters are auto-registered: each is an autograd tensor.
# ------------------------------------------------------------
n_params = sum(p.numel() for p in model.parameters())
print("trainable parameters:", n_params)          # -> 203530
print("fc1.weight requires_grad:",
      model.fc1.weight.requires_grad)             # -> True
print("state_dict keys:", list(model.state_dict().keys()))
#   -> ['fc1.weight', 'fc1.bias', 'fc2.weight', 'fc2.bias']

# ------------------------------------------------------------
# A forward pass on a random batch of 8 examples.
# CALL THE MODEL, not .forward(): model(x) runs hooks + forward.
# ------------------------------------------------------------
x = torch.randn(8, 784)                   # batch of 8, 784 features each
logits = model(x)                         # NOT model.forward(x)
print("output shape:", logits.shape)      # -> torch.Size([8, 10])

# ============================================================
# 2. THE SAME MLP AS nn.Sequential (quick stack, no class)
#    Use this when the model is just a straight chain.
# ============================================================
seq = nn.Sequential(
    nn.Linear(784, 256),
    nn.ReLU(),
    nn.Linear(256, 10),
)
seq_params = sum(p.numel() for p in seq.parameters())
print("sequential parameters:", seq_params)       # -> 203530 (identical)
print("sequential output:", seq(x).shape)         # -> torch.Size([8, 10])

# ------------------------------------------------------------
# Weight initialization: override the defaults if you want.
# (nn.Linear already inits sensibly; this shows how to control it.)
# ------------------------------------------------------------
def init_weights(m):
    if isinstance(m, nn.Linear):
        nn.init.kaiming_normal_(m.weight, nonlinearity="relu")
        nn.init.zeros_(m.bias)

model.apply(init_weights)                 # walks every submodule
print("after re-init, fc1.bias is all zeros:",
      bool(torch.all(model.fc1.bias == 0)))        # -> True`
  };

  window.CODEVIZ["pt-nn-module"] = {
    question: "Where do a model's parameters actually live? Read a per-layer parameter bar chart — and spot which layer dominates.",
    charts: [
      {
        type: "bars",
        title: "Trainable parameters per layer of a 784-256-128-10 MLP",
        xlabel: "layer",
        ylabel: "parameter count",
        labels: ["Linear 784->256", "ReLU", "Linear 256->128", "ReLU", "Linear 128->10"],
        values: [200960, 0, 32896, 0, 1290],
        valueLabels: ["200,960", "0", "32,896", "0", "1,290"],
        colors: ["#4ea1ff", "#8b949e", "#4ea1ff", "#8b949e", "#7ee787"],
        interpret: "<b>Each bar is one layer; bar height = how many trainable numbers (weights + biases) that layer holds</b>, from in*out + out. Real counts: Linear(784->256) = 784*256+256 = 200,960; Linear(256->128) = 32,896; Linear(128->10) = 1,290; the two grey ReLU bars are <b>zero</b> because an activation has no weights. The first bar towers over the rest: the layer touching the 784-wide input owns ~86% of the model. Total = 235,146, exactly what sum(p.numel() for p in model.parameters()) reports."
      },
      {
        type: "bars",
        title: "Variant: wide-tail MLP, last layer dominates (illustrative)",
        xlabel: "layer",
        ylabel: "parameter count",
        labels: ["Linear 64->128", "ReLU", "Linear 128->256", "ReLU", "Linear 256->1000"],
        values: [8320, 0, 33024, 0, 257000],
        valueLabels: ["8,320", "0", "33,024", "0", "257,000"],
        colors: ["#4ea1ff", "#8b949e", "#4ea1ff", "#8b949e", "#ffb454"],
        interpret: "<b>Illustrative</b> but the formula is real. Same chart type, opposite shape: a network that <b>fans out to a 1000-class output</b> piles most of its weights into the <b>last</b> layer (256*1000+1000 = 257,000). Read it the same way — tallest bar = where the parameters live — but here the cost is at the output, not the input. The lesson: a single very wide layer (input OR output) dominates the budget."
      },
      {
        type: "bars",
        title: "Variant: all the params hide in a bias-only / scale layer (illustrative)",
        xlabel: "layer",
        ylabel: "parameter count",
        labels: ["Linear 512->512", "ReLU", "BatchNorm (512)", "Linear 512->512"],
        values: [262656, 0, 1024, 262656],
        valueLabels: ["262,656", "0", "1,024", "262,656"],
        colors: ["#4ea1ff", "#8b949e", "#7ee787", "#4ea1ff"],
        interpret: "<b>Illustrative.</b> Two equal-width Linear layers carry the bulk, but notice the small green <b>BatchNorm</b> bar is <b>not zero</b> (512 scales + 512 shifts = 1,024). The takeaway when reading these charts: a near-flat bar can still be non-zero — normalization and embedding layers hold learnable parameters too, so don't assume only Linear/Conv layers count. Always cross-check the bars against sum(p.numel() ...)."
      }
    ],
    caption: "How to read a per-layer parameter chart: each bar = one layer, height = its trainable-parameter count (in*out + out for Linear), grey = parameter-free activations. The tallest bar tells you where the model's weight budget lives — usually the widest Linear layer.",
    code: `import numpy as np

# An MLP described as a list of (in_features, out_features) for each Linear,
# with parameter-free ReLU activations in between.
linears = [(784, 256), (256, 128), (128, 10)]

labels, values = [], []
for (in_f, out_f) in linears:
    params = in_f * out_f + out_f        # weight matrix (in*out) + bias (out)
    labels.append(f"Linear {in_f}->{out_f}")
    values.append(params)
    labels.append("ReLU")                # activation between Linear layers...
    values.append(0)                     # ...has zero parameters
labels, values = labels[:-1], values[:-1]   # drop trailing ReLU after last Linear

for lab, v in zip(labels, values):
    print(f"{lab:18s} {v:>8d}")
print("total parameters:", sum(values))   # -> 203530

# (matches torch:  sum(p.numel() for p in model.parameters()))
import matplotlib.pyplot as plt
plt.bar(labels, values, color=["#4ea1ff","#8b949e","#4ea1ff","#8b949e","#7ee787"])
plt.ylabel("parameter count")
plt.title("Trainable parameters per layer of a 784-256-128-10 MLP")
plt.xticks(rotation=20)
plt.show()`
  };
})();
