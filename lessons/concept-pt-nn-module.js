/* PyTorch (a complete course) — "Building models with torch.nn: nn.Module, layers, parameters".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-nn-module". */
(function () {
  window.LESSONS.push({
    id: "pt-nn-module",
    title: "Building models with torch.nn: nn.Module, layers, and parameters",
    tagline: "Subclass nn.Module, declare layers in __init__, wire them in forward, and PyTorch tracks every weight for you.",
    module: "PyTorch (a complete course)",
    prereqs: ["dl-forward-prop", "dl-neuron", "dl-init"],

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
        q: `A teammate's model trains but the hidden layer's weights never change &mdash; the loss barely moves. Their code creates the hidden layer like this: <code>def forward(self, x): h = nn.Linear(8, 8)(x); return self.out(h)</code>. What is wrong, and how do you fix it?`,
        steps: [
          { do: `Spot that the hidden <code>nn.Linear</code> is built inside <code>forward</code>, not in <code>__init__</code>.`, why: `Only layers assigned to <code>self</code> in <code>__init__</code> get registered; a layer created inside <code>forward</code> is a throwaway local.` },
          { do: `Realize the layer is recreated with fresh random weights on every forward pass and is absent from <code>model.parameters()</code>.`, why: `If it is not in <code>parameters()</code>, the optimizer never receives it, so its weights are never updated &mdash; and it is reset each call anyway.` },
          { do: `Move it to <code>__init__</code>: <code>self.hidden = nn.Linear(8, 8)</code>, then use <code>self.hidden(x)</code> in <code>forward</code>.`, why: `Now the layer is registered once, its weights persist, and the optimizer trains them.` }
        ],
        answer: `<p>The hidden layer is constructed <i>inside</i> <code>forward</code>, so it is never registered: it is missing from <code>model.parameters()</code> and the optimizer never updates it &mdash; worse, it is rebuilt with new random weights every call. <b>Define layers in <code>__init__</code>:</b> <code>self.hidden = nn.Linear(8, 8)</code>, and call <code>self.hidden(x)</code> in <code>forward</code>. Then it is registered once and trains normally.</p>`
      },
      {
        q: `You build an MLP and run it, but get <code>RuntimeError: Expected all tensors to be on the same device, but found at least two devices, cuda:0 and cpu</code>. You already did <code>x = x.to("cuda")</code>. What did you forget, and why does it matter?`,
        steps: [
          { do: `Note the input <code>x</code> is on the GPU (<code>cuda:0</code>) but something is still on the CPU.`, why: `The error fires whenever a layer's weights and the data it multiplies live on different devices.` },
          { do: `Check whether the model itself was moved.`, why: `Moving the input does not move the model; the <code>nn.Linear</code> weights stay on the CPU until you move the module.` },
          { do: `Add <code>model.to("cuda")</code> (or <code>device</code>) before the forward pass.`, why: `<code>model.to(device)</code> walks the module tree and moves every registered parameter to the GPU, so weights and input now match.` }
        ],
        answer: `<p>You moved the data but not the model. The input is on <code>cuda:0</code> while the layer weights are still on the CPU, and a matmul needs both operands on the same device. Call <code>model.to("cuda")</code> (it moves every registered parameter at once) <i>and</i> <code>x = x.to("cuda")</code>. A clean pattern is to pick one <code>device</code> up front and send both the model and every batch to it.</p>`
      },
      {
        q: `You want to confirm a freshly built MLP <code>Linear(10&rarr;32) &rarr; ReLU &rarr; Linear(32&rarr;2)</code> has the number of trainable parameters you expect. How do you compute it by hand, and how do you check it in code?`,
        steps: [
          { do: `Apply the per-linear-layer formula <code>in*out + out</code> to each <code>nn.Linear</code>.`, why: `A linear layer holds a weight matrix (<code>in*out</code> numbers) plus one bias per output (<code>out</code> numbers).` },
          { do: `First layer: 10*32 + 32 = 352. Second layer: 32*2 + 2 = 66. ReLU adds 0.`, why: `ReLU is a parameter-free activation, so it contributes nothing to the count.` },
          { do: `Sum to 418, then verify with <code>sum(p.numel() for p in model.parameters())</code>.`, why: `<code>p.numel()</code> counts the elements in each registered parameter tensor; summing over <code>parameters()</code> totals them.` }
        ],
        answer: `<p>Use <code>in*out + out</code> per linear layer. First layer: $10\\times32+32 = 352$. ReLU: $0$. Second layer: $32\\times2+2 = 66$. Total $= 418$. Check it with <code>sum(p.numel() for p in model.parameters())</code>, which iterates every registered weight tensor and sums their element counts &mdash; it should print <code>418</code>.</p>`
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
print("trainable parameters:", n_params)          # -> 235146
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
print("sequential parameters:", seq_params)       # -> 235146 (identical)
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
    question: "Where do an MLP's parameters actually live? Per-layer trainable-parameter count for the MLP Linear(784->256) -> ReLU -> Linear(256->128) -> ReLU -> Linear(128->10), computed with the formula in*out + out.",
    charts: [{
      type: "bars",
      title: "Trainable parameters per layer of a 784-256-128-10 MLP",
      xlabel: "layer",
      ylabel: "parameter count",
      labels: ["Linear 784->256", "ReLU", "Linear 256->128", "ReLU", "Linear 128->10"],
      values: [200960, 0, 32896, 0, 1290],
      valueLabels: ["200,960", "0", "32,896", "0", "1,290"],
      colors: ["#4ea1ff", "#8b949e", "#4ea1ff", "#8b949e", "#7ee787"]
    }],
    caption: "Real counts from in*out + out: Linear(784->256) = 784*256+256 = 200,960; Linear(256->128) = 256*128+128 = 32,896; Linear(128->10) = 128*10+10 = 1,290. ReLU has zero parameters. Total = 235,146 — the same number model.parameters() reports. The first layer dominates because it is widest at the input.",
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
print("total parameters:", sum(values))   # -> 235146

# (matches torch:  sum(p.numel() for p in model.parameters()))
import matplotlib.pyplot as plt
plt.bar(labels, values, color=["#4ea1ff","#8b949e","#4ea1ff","#8b949e","#7ee787"])
plt.ylabel("parameter count")
plt.title("Trainable parameters per layer of a 784-256-128-10 MLP")
plt.xticks(rotation=20)
plt.show()`
  };
})();
