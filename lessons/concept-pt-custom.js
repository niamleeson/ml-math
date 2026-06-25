/* PyTorch (a complete course) — "Extending PyTorch: custom layers, losses, and autograd Functions".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-custom". */
(function () {
  window.LESSONS.push({
    id: "pt-custom",
    title: "Extending PyTorch: custom layers, losses, and autograd Functions",
    tagline: "Write your own nn.Module layer with learnable nn.Parameters, a custom loss function, and — when you need a hand-written gradient — a torch.autograd.Function verified by gradcheck.",
    module: "PyTorch (a complete course)",
    prereqs: ["pt-nn-module", "pt-autograd", "dl-backprop"],

    whenToUse:
      `<p>PyTorch ships hundreds of layers and losses. Most of the time you should just use the built-ins.
       You reach for the <b>extension points</b> in this lesson only when the built-ins do not cover what you need.
       There are three levels, from easy to advanced:</p>
       <ul>
         <li><b>A custom layer (an <code>nn.Module</code> subclass).</b> Reach for this when you want a reusable
         block with its own <i>learnable weights</i>. You hold the weights as <code>nn.Parameter</code> tensors,
         write the math in <code>forward</code> using ordinary differentiable torch operations, and <b>autograd
         computes the backward pass for free</b>. Building your own <code>Linear</code> is the classic example.</li>
         <li><b>A custom loss.</b> A loss is just a function (or a tiny <code>nn.Module</code>) that takes the
         prediction and target and returns one scalar. As long as you build it from differentiable torch ops,
         you write <i>only</i> the forward formula &mdash; again autograd handles the backward automatically.</li>
         <li><b>A custom autograd Function (<code>torch.autograd.Function</code>).</b> This is the heavy tool.
         Reach for it only when you need to <i>hand-write the gradient</i>: a non-standard or more numerically
         stable derivative, a faster fused backward, an operation that is not differentiable as written, or a
         wrapper around non-PyTorch code (NumPy, C++, a simulator). You write an explicit <code>forward</code>
         and <code>backward</code>, and verify the math with <code>torch.autograd.gradcheck</code>.</li>
       </ul>
       <p>Rule of thumb: <b>if you can express your idea with differentiable torch ops, write a plain
       <code>nn.Module</code> or function and let autograd do the rest.</b> Only drop down to
       <code>torch.autograd.Function</code> when you must own the backward pass yourself.</p>`,

    application:
      `<p>These three patterns show up constantly once you go past stock architectures:</p>
       <ul>
         <li><b>Custom layers</b> are how research blocks are shipped: a new attention variant, a gated unit, a
         custom normalization &mdash; each is an <code>nn.Module</code> with <code>nn.Parameter</code> weights.</li>
         <li><b>Custom losses</b> encode the objective you actually care about: a weighted or focal loss for
         class imbalance, a contrastive or triplet loss for embeddings, a physics-informed penalty, or simply
         a hand-rolled mean-squared error.</li>
         <li><b>Custom autograd Functions</b> power efficiency tricks and special gradients: the
         straight-through estimator for quantization, gradient reversal for domain adaptation, fused kernels
         that compute forward and backward together, and bridges to external simulators or solvers.</li>
         <li><b>Registered buffers</b> (<code>register_buffer</code>) hold non-learnable state that must still
         travel with the model &mdash; a running mean in batch normalization, a fixed positional-encoding table,
         or a mask &mdash; so it moves with <code>model.to(device)</code> and is saved in the checkpoint.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Using a plain tensor instead of <code>nn.Parameter</code>.</b> If you write
         <code>self.weight = torch.randn(...)</code> the tensor is <i>not</i> registered, so it is missing from
         <code>model.parameters()</code> and <b>the optimizer never trains it</b>. Wrap it:
         <code>self.weight = nn.Parameter(torch.randn(...))</code> &mdash; that both registers it and sets
         <code>requires_grad=True</code>.</li>
         <li><b>Using non-differentiable ops and expecting a gradient.</b> Operations like rounding, argmax, or
         indexing by a computed integer have no usable gradient; autograd will hand back zeros or an error. When
         you need a gradient through such a step, write a <code>torch.autograd.Function</code> and define the
         backward yourself (e.g. a straight-through estimator).</li>
         <li><b>Getting the <code>backward</code> math wrong.</b> A hand-written backward is just code, and code
         has bugs. <b>Always verify with <code>torch.autograd.gradcheck</code></b>, which compares your analytic
         gradient against a numerical finite-difference estimate.</li>
         <li><b>Forgetting double precision for <code>gradcheck</code>.</b> Finite differences need the headroom
         of 64-bit floats. Run gradcheck on <code>float64</code> (<code>.double()</code>) inputs with
         <code>requires_grad=True</code>, or it will report spurious mismatches.</li>
         <li><b>Forgetting <code>ctx.save_for_backward</code>.</b> The <code>backward</code> needs the inputs (or
         intermediate values) the gradient formula depends on. Save them in <code>forward</code> with
         <code>ctx.save_for_backward(...)</code> and read them back via <code>ctx.saved_tensors</code>; recomputing
         or capturing them in a closure is a common source of bugs.</li>
         <li><b>In-place ops in a custom <code>forward</code>.</b> Modifying a saved tensor in place (e.g.
         <code>x.relu_()</code> or <code>x += ...</code>) can corrupt the values <code>backward</code> relies on
         and trip autograd's version checks. Return a fresh tensor instead.</li>
         <li><b>Returning the wrong number of gradients from <code>backward</code>.</b> <code>backward</code> must
         return one gradient per input to <code>forward</code> (and <code>None</code> for non-tensor or
         non-differentiable inputs), in the same order. A mismatch raises an error.</li>
       </ul>`,

    bigIdea:
      `<p>PyTorch is extensible at three layers, and the trick is knowing how far down you must go.</p>
       <p><b>Most of the time you never touch the backward pass.</b> If your idea is built from differentiable
       torch operations &mdash; matrix multiplies, additions, exponentials, comparisons that route gradients &mdash;
       then writing the <code>forward</code> is enough. Autograd recorded every op into a graph and will replay it
       in reverse to get exact gradients. A custom layer and a custom loss are exactly this: you supply the
       forward formula and learnable <code>nn.Parameter</code>s, and the gradient comes for free.</p>
       <p><b>Only when autograd cannot help</b> &mdash; a non-differentiable step, a smarter gradient, external
       code &mdash; do you write a <code>torch.autograd.Function</code> with an explicit <code>forward</code> and
       <code>backward</code>. Then <i>you</i> are the gradient, so you check it with <code>gradcheck</code>.</p>`,

    buildup:
      `<p>Build up from the easy case to the hard one:</p>
       <ol>
         <li><b>Custom layer.</b> Subclass <code>nn.Module</code>, create weights as <code>nn.Parameter</code> in
         <code>__init__</code>, and implement the math in <code>forward</code> with ordinary torch ops. From-scratch
         <code>Linear</code>: <code>x @ W.t() + b</code>.</li>
         <li><b>Custom loss.</b> Write a function (or tiny <code>nn.Module</code>) that returns a scalar built from
         differentiable ops, e.g. <code>((pred - target) ** 2).mean()</code>. Autograd backpropagates it.</li>
         <li><b>Non-learnable state.</b> Hold fixed buffers with <code>self.register_buffer("name", tensor)</code>
         so they move with the module and save in the checkpoint &mdash; but are not trained.</li>
         <li><b>Custom autograd Function.</b> Subclass <code>torch.autograd.Function</code> with static
         <code>forward(ctx, ...)</code> and <code>backward(ctx, grad_output)</code>. Save what you need with
         <code>ctx.save_for_backward</code>, return one gradient per input, expose it via <code>.apply</code>, and
         confirm the math with <code>torch.autograd.gradcheck</code>.</li>
       </ol>`,

    symbols: [
      { sym: "<code>nn.Parameter(t)</code>", desc: "wraps a tensor as a learnable weight; assigning it to <code>self</code> registers it so the optimizer trains it (<code>requires_grad=True</code> automatically)." },
      { sym: "<code>register_buffer(name, t)</code>", desc: "registers non-learnable state (a running mean, a mask): moves with <code>model.to(device)</code> and is saved, but never updated by the optimizer." },
      { sym: "<code>torch.autograd.Function</code>", desc: "base class for an op with a hand-written forward and backward; subclass it when you need to own the gradient." },
      { sym: "<code>ctx.save_for_backward(*t)</code>", desc: "stashes the tensors that <code>backward</code> will need; read them back via <code>ctx.saved_tensors</code>." },
      { sym: "<code>Fn.apply(x)</code>", desc: "how you actually call a custom Function (never call <code>forward</code> directly); <code>.apply</code> records it on the autograd graph." },
      { sym: "<code>torch.autograd.gradcheck</code>", desc: "verifies your <code>backward</code> by comparing the analytic gradient against a numerical finite-difference estimate; use <code>float64</code> inputs." }
    ],

    formula: `$$\\text{Linear: } y = xW^{\\top} + b \\qquad\\Longrightarrow\\qquad \\frac{\\partial \\mathcal{L}}{\\partial W} = \\left(\\frac{\\partial \\mathcal{L}}{\\partial y}\\right)^{\\top} x,\\quad \\frac{\\partial \\mathcal{L}}{\\partial x} = \\frac{\\partial \\mathcal{L}}{\\partial y}\\, W$$`,
    whatItDoes:
      `<p>For a custom linear layer you usually do <b>not</b> write these derivatives &mdash; you write only the
       forward <code>x @ W.t() + b</code> and autograd derives the rest. The formulas show what autograd computes
       under the hood: the gradient with respect to the weight $W$ is the upstream gradient times the input, and
       the gradient passed back to the input is the upstream gradient times $W$. Here $\\mathcal{L}$ is the scalar
       loss, $\\frac{\\partial \\mathcal{L}}{\\partial y}$ is the gradient flowing in from the next layer, and the
       transpose $\\top$ just lines the matrix shapes up.</p>`,

    derivation:
      `<p><b>How a custom autograd Function plugs into the graph.</b></p>
       <ul class="steps">
         <li>In the <b>forward</b> pass, your static <code>forward(ctx, x)</code> runs and returns the output.
         Anything <code>backward</code> later needs &mdash; here the input <code>x</code> &mdash; is stored with
         <code>ctx.save_for_backward(x)</code>. The <code>ctx</code> object is a per-call scratchpad that lives
         until backward.</li>
         <li>Autograd records a node in the graph that points at your Function. It does <b>not</b> look inside your
         forward; from autograd's view your op is a black box with a known backward.</li>
         <li>In the <b>backward</b> pass, autograd calls <code>backward(ctx, grad_output)</code>, handing you
         <code>grad_output</code> = $\\frac{\\partial \\mathcal{L}}{\\partial \\text{output}}$, the gradient of the
         final loss with respect to your op's output. You read the saved tensors from
         <code>ctx.saved_tensors</code> and return $\\frac{\\partial \\mathcal{L}}{\\partial \\text{input}}$ by the
         chain rule &mdash; one gradient per input to <code>forward</code>.</li>
         <li>For $f(x)=x^2$ the local derivative is $2x$, so by the chain rule the input gradient is
         <code>grad_output * 2 * x</code>. <b>If you get this expression wrong, training silently goes wrong</b> &mdash;
         which is exactly why <code>gradcheck</code> exists: it perturbs each input by a tiny $\\varepsilon$,
         measures the numerical slope, and compares it to what your <code>backward</code> returns.</li>
       </ul>`,

    example:
      `<p>A from-scratch linear layer, the "hello world" of custom modules:</p>
       <ul class="steps">
         <li><code>class MyLinear(nn.Module)</code> with
         <code>self.W = nn.Parameter(torch.randn(out, in))</code> and
         <code>self.b = nn.Parameter(torch.zeros(out))</code>.</li>
         <li><code>forward(self, x)</code> returns <code>x @ self.W.t() + self.b</code> &mdash; pure differentiable
         torch ops, so no backward to write.</li>
         <li>Because <code>W</code> and <code>b</code> are <code>nn.Parameter</code>s, they appear in
         <code>model.parameters()</code> and the optimizer updates them. Swap <code>nn.Parameter</code> for a plain
         <code>torch.randn</code> and the layer would simply never learn.</li>
         <li>A matching custom loss is just
         <code>def my_mse(pred, target): return ((pred - target) ** 2).mean()</code> &mdash; one scalar, fully
         differentiable, no backward needed.</li>
       </ul>`,

    practice: [
      {
        q: `<b>Type this in Colab.</b> Write a <code>MyLinear(nn.Module)</code> from scratch: in <code>__init__</code> hold <code>self.W = nn.Parameter(torch.randn(out, in_) * 0.1)</code> and <code>self.b = nn.Parameter(torch.zeros(out))</code>; in <code>forward</code> return <code>x @ self.W.t() + self.b</code>. Instantiate <code>MyLinear(4, 3)</code>, run a <code>(2, 4)</code> input through it, and print the output shape. Use seed 0.`,
        steps: [
          { do: `Subclass <code>nn.Module</code>, call <code>super().__init__()</code> first, and store weights as <code>nn.Parameter</code>.`, why: `<code>nn.Parameter</code> registers the tensor so it lands in <code>parameters()</code> and the optimizer trains it.` },
          { do: `Implement the math with plain differentiable ops in <code>forward</code>.`, why: `<code>x @ W.t() + b</code> is differentiable, so autograd builds the backward pass for free — no hand-written gradient.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
torch.manual_seed(0)

class MyLinear(nn.Module):
    def __init__(self, in_, out):
        super().__init__()
        self.W = nn.Parameter(torch.randn(out, in_) * 0.1)
        self.b = nn.Parameter(torch.zeros(out))
    def forward(self, x):
        return x @ self.W.t() + self.b

layer = MyLinear(4, 3)
print(layer(torch.randn(2, 4)).shape)   # torch.Size([2, 3])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Build the famous pitfall: a layer that stores its weight as a plain tensor <code>self.W = torch.randn(3, 4)</code> instead of an <code>nn.Parameter</code>. Print <code>list(layer.named_parameters())</code>. Predict: is the weight in there? Then fix it with <code>nn.Parameter</code> and reprint.`,
        steps: [
          { do: `Print <code>named_parameters()</code> with the plain-tensor version.`, why: `A bare tensor assigned to <code>self</code> is NOT registered, so it is missing from <code>parameters()</code> and the optimizer never trains it.` },
          { do: `Wrap it in <code>nn.Parameter(...)</code> and reprint.`, why: `<code>nn.Parameter</code> registers it and sets <code>requires_grad=True</code>, so now it appears and will train.` }
        ],
        answer: `<pre><code>class Bad(nn.Module):
    def __init__(self):
        super().__init__()
        self.W = torch.randn(3, 4)        # plain tensor -> NOT registered
print(list(Bad().named_parameters()))     # []  -- empty! optimizer sees nothing

class Good(nn.Module):
    def __init__(self):
        super().__init__()
        self.W = nn.Parameter(torch.randn(3, 4))
print([n for n, _ in Good().named_parameters()])   # ['W']</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Write a custom loss as a plain function <code>my_mse(pred, target)</code> returning <code>((pred - target) ** 2).mean()</code>. On <code>pred = torch.randn(8, 3)</code> and <code>target = torch.randn(8, 3)</code> (seed 0), print your loss next to <code>nn.MSELoss()(pred, target)</code> and confirm they match.`,
        steps: [
          { do: `Build the loss from differentiable torch ops only.`, why: `A loss is just a scalar-returning function; if it is differentiable, autograd backpropagates it with no extra code.` },
          { do: `Compare against the built-in <code>nn.MSELoss</code>.`, why: `It confirms your hand-rolled formula matches PyTorch's reduction (mean over all elements).` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
def my_mse(pred, target):
    return ((pred - target) ** 2).mean()

pred   = torch.randn(8, 3)
target = torch.randn(8, 3)
print(float(my_mse(pred, target)))            # e.g. 1.8945
print(float(nn.MSELoss()(pred, target)))      # identical value</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Implement a <code>torch.autograd.Function</code> named <code>Square</code> for $f(x)=x^2$: in <code>forward</code> save <code>x</code> with <code>ctx.save_for_backward(x)</code> and return <code>x * x</code>; in <code>backward</code> return <code>grad_output * 2 * x</code>. Call it via <code>Square.apply</code> on <code>x = torch.tensor([3.0], requires_grad=True)</code>, backprop, and print <code>x.grad</code>. Predict the value first.`,
        steps: [
          { do: `Define static <code>forward(ctx, x)</code> and <code>backward(ctx, grad_output)</code>, calling the op via <code>.apply</code>.`, why: `<code>.apply</code> records the op on the autograd graph; calling <code>forward</code> directly bypasses autograd.` },
          { do: `Predict the gradient: $\\tfrac{d}{dx}x^2 = 2x$, so at $x=3$ it is $6$.`, why: `Verifying the hand-written backward against the known derivative is the whole point of owning the gradient.` }
        ],
        answer: `<pre><code>class Square(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x):
        ctx.save_for_backward(x)
        return x * x
    @staticmethod
    def backward(ctx, grad_output):
        (x,) = ctx.saved_tensors
        return grad_output * 2 * x

x = torch.tensor([3.0], requires_grad=True)
y = Square.apply(x)
y.backward()
print(x.grad)        # tensor([6.])  -- 2*x at x=3</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Verify the <code>Square</code> Function's backward with <code>torch.autograd.gradcheck</code>. Make a <code>float64</code> input with <code>requires_grad=True</code> and print the result. Then change the backward to a WRONG formula (<code>grad_output * x</code>) and show gradcheck now fails.`,
        steps: [
          { do: `Run <code>torch.autograd.gradcheck(Square.apply, (x,))</code> on a <code>.double()</code> input.`, why: `Finite differences need 64-bit headroom; on float32 gradcheck reports spurious mismatches.` },
          { do: `Break the backward (return <code>grad_output * x</code>) and rerun.`, why: `gradcheck compares analytic vs numerical gradient and raises on a wrong derivative — catching the bug before training.` }
        ],
        answer: `<pre><code>x = torch.randn(5, dtype=torch.float64, requires_grad=True)
print(torch.autograd.gradcheck(Square.apply, (x,)))   # True  -- correct backward

class BadSquare(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x):
        ctx.save_for_backward(x); return x * x
    @staticmethod
    def backward(ctx, grad_output):
        (x,) = ctx.saved_tensors
        return grad_output * x          # WRONG: should be 2*x
try:
    torch.autograd.gradcheck(BadSquare.apply, (x,))
except Exception as e:
    print("gradcheck FAILED:", type(e).__name__)   # raises -> bug caught</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> In an <code>nn.Module</code>, register a fixed lookup table with <code>self.register_buffer("table", torch.arange(6.0).reshape(2, 3))</code>. Print <code>list(m.named_parameters())</code>, <code>list(m.named_buffers())</code>, and <code>list(m.state_dict().keys())</code>. Predict which lists contain <code>table</code>.`,
        steps: [
          { do: `Use <code>register_buffer</code> for non-learnable state that must travel with the model.`, why: `A buffer moves with <code>model.to(device)</code> and is saved in <code>state_dict</code>, but the optimizer ignores it.` },
          { do: `Predict: <code>table</code> is in buffers and state_dict, NOT in parameters.`, why: `Only <code>nn.Parameter</code>s show up in <code>parameters()</code>; a buffer is deliberately excluded so it is never trained.` }
        ],
        answer: `<pre><code>class M(nn.Module):
    def __init__(self):
        super().__init__()
        self.register_buffer("table", torch.arange(6.0).reshape(2, 3))

m = M()
print([n for n, _ in m.named_parameters()])   # []          -- not trained
print([n for n, _ in m.named_buffers()])      # ['table']   -- registered state
print(list(m.state_dict().keys()))            # ['table']   -- checkpointed</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show why <code>nn.Parameter</code> matters end-to-end. Train your <code>MyLinear(4, 3)</code> (from the first task) to fit <code>Y = X @ true_W.t() + true_b</code> for 200 Adam steps with your <code>my_mse</code> loss; print the loss every 50 steps. Use seeds so the run is reproducible.`,
        steps: [
          { do: `Pass <code>model.parameters()</code> to <code>torch.optim.Adam</code> and run the train loop.`, why: `Because <code>W</code> and <code>b</code> are <code>nn.Parameter</code>s they are in <code>parameters()</code>, so the optimizer can update them.` },
          { do: `Call <code>zero_grad()</code> before each <code>backward()</code>.`, why: `Gradients accumulate by default; clearing them keeps each step's update correct so the loss drops to near zero.` }
        ],
        answer: `<pre><code>torch.manual_seed(1)
X = torch.randn(64, 4)
true_W, true_b = torch.randn(3, 4), torch.randn(3)
Y = X @ true_W.t() + true_b

model = MyLinear(4, 3)
opt = torch.optim.Adam(model.parameters(), lr=0.1)
for step in range(200):
    opt.zero_grad()
    loss = my_mse(model(X), Y)
    loss.backward(); opt.step()
    if step % 50 == 0:
        print(step, round(loss.item(), 4))
# 0  large; loss falls each block
print("final:", round(my_mse(model(X), Y).item(), 5))   # near 0.0</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Demonstrate the non-differentiable pitfall. Take <code>x = torch.tensor([1.7], requires_grad=True)</code>, compute <code>y = torch.round(x)</code>, backprop <code>y</code>, and print <code>x.grad</code>. Predict the gradient before running, then explain in a comment why a custom Function would be needed for a usable gradient.`,
        steps: [
          { do: `Backprop through <code>torch.round</code> and inspect <code>x.grad</code>.`, why: `Rounding has zero derivative almost everywhere, so autograd hands back a zero gradient — no learning signal.` },
          { do: `Note the fix: a custom <code>autograd.Function</code> with a straight-through estimator.`, why: `When you need a gradient through a non-differentiable step, you must hand-write the backward yourself.` }
        ],
        answer: `<pre><code>x = torch.tensor([1.7], requires_grad=True)
y = torch.round(x)
y.backward()
print(x.grad)        # tensor([0.])  -- round has zero gradient -> no signal
# Fix: a torch.autograd.Function whose backward passes grad_output through
#      unchanged (a straight-through estimator).</code></pre>`
      }
    ]
  });

  window.CODE["pt-custom"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>All three extension points in one runnable script. <b>(1)</b> A from-scratch <code>MyLinear</code>
      layer holds its weight and bias as <code>nn.Parameter</code>s and registers a non-learnable
      <code>call_count</code> buffer with <code>register_buffer</code> &mdash; we confirm both show up correctly in
      <code>parameters()</code> versus <code>state_dict()</code>. <b>(2)</b> A custom loss is just a function of
      differentiable torch ops; we check it equals <code>nn.MSELoss</code>. <b>(3)</b> A
      <code>torch.autograd.Function</code> (a custom square <code>x^2</code>) writes an explicit
      <code>forward</code>/<code>backward</code>, saves its input with <code>ctx.save_for_backward</code>, and is
      verified with <code>torch.autograd.gradcheck</code> on <code>float64</code> inputs. Finally we train the
      custom layer with the custom loss for a few steps so you see the loss fall. <code>runnable</code> is off
      because the in-browser engine has no PyTorch; paste this into Google Colab (torch ships preinstalled) to run
      it.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)                          # reproducible weights and data

# ============================================================
# 1. A CUSTOM LAYER: a from-scratch Linear.
#    Weights are nn.Parameter (so they TRAIN); a counter is a
#    register_buffer (non-learnable state that still saves/moves).
# ============================================================
class MyLinear(nn.Module):
    def __init__(self, in_features, out_features):
        super().__init__()                    # MUST be first
        # nn.Parameter -> registered + requires_grad=True -> the optimizer trains it.
        self.weight = nn.Parameter(torch.randn(out_features, in_features) * 0.1)
        self.bias   = nn.Parameter(torch.zeros(out_features))
        # A buffer: NON-learnable state. Moves with .to(device), saved in state_dict,
        # but never updated by the optimizer.
        self.register_buffer("call_count", torch.zeros(1))

    def forward(self, x):
        self.call_count += 1                  # buffer bookkeeping
        return x @ self.weight.t() + self.bias    # pure differentiable ops -> autograd backward for free

layer = MyLinear(4, 3)
print("params (trained):", [name for name, _ in layer.named_parameters()])
#   -> ['weight', 'bias']                     (call_count is NOT here)
print("buffers (not trained):", [name for name, _ in layer.named_buffers()])
#   -> ['call_count']
print("state_dict keys:", list(layer.state_dict().keys()))
#   -> ['weight', 'bias', 'call_count']       (buffer IS saved)

# ============================================================
# 2. A CUSTOM LOSS: just a function returning a scalar.
#    Built from differentiable torch ops -> autograd handles backward.
# ============================================================
def my_mse(pred, target):
    return ((pred - target) ** 2).mean()

pred   = torch.randn(8, 3)
target = torch.randn(8, 3)
print("my_mse vs nn.MSELoss:",
      float(my_mse(pred, target)),
      float(nn.MSELoss()(pred, target)))      # identical

# ============================================================
# 3. A CUSTOM AUTOGRAD FUNCTION: square, with a HAND-WRITTEN gradient.
#    Use this when you need to own the backward (non-standard /
#    more efficient gradient, or to wrap non-PyTorch code).
# ============================================================
class Square(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x):
        ctx.save_for_backward(x)              # backward needs x for d/dx(x^2)=2x
        return x * x

    @staticmethod
    def backward(ctx, grad_output):
        (x,) = ctx.saved_tensors
        return grad_output * 2 * x            # chain rule: dL/dx = dL/dy * 2x

square = Square.apply                          # call via .apply, NOT Square.forward

# Verify the backward math. gradcheck needs float64 inputs + requires_grad.
gx = torch.randn(5, dtype=torch.float64, requires_grad=True)
ok = torch.autograd.gradcheck(square, (gx,), eps=1e-6, atol=1e-4)
print("gradcheck passed:", ok)                # -> True (our 2x backward is correct)

# ============================================================
# 4. TRAIN the custom layer with the custom loss for a few steps.
# ============================================================
torch.manual_seed(1)
X = torch.randn(64, 4)
true_W = torch.randn(3, 4); true_b = torch.randn(3)
Y = X @ true_W.t() + true_b                    # the target the layer should learn

model = MyLinear(4, 3)
opt = torch.optim.Adam(model.parameters(), lr=0.1)   # only weight & bias are passed
for step in range(200):
    opt.zero_grad()                            # clear old grads (they accumulate!)
    loss = my_mse(model(X), Y)                 # custom loss; autograd backprops it
    loss.backward()
    opt.step()
    if step % 50 == 0:
        print(f"step {step:3d}  loss {loss.item():.4f}")
print("final loss:", round(my_mse(model(X), Y).item(), 5))   # near 0
print("forward calls counted by buffer:", int(model.call_count.item()))`
  };

  window.CODEVIZ["pt-custom"] = {
    question: "Is the hand-written backward of a custom autograd Function correct? For Square (f(x)=x^2), plot the analytic gradient our backward returns (2x) against a numerical finite-difference gradient across x — gradcheck's idea, by hand.",
    charts: [{
      type: "line",
      title: "Custom Function backward (2x) vs numerical gradient of f(x) = x^2",
      xlabel: "x",
      ylabel: "df/dx",
      series: [
        { name: "analytic backward 2x", color: "#4ea1ff", points: [[-3, -6], [-2.8, -5.6], [-2.6, -5.2], [-2.4, -4.8], [-2.2, -4.4], [-2, -4], [-1.8, -3.6], [-1.6, -3.2], [-1.4, -2.8], [-1.2, -2.4], [-1, -2], [-0.8, -1.6], [-0.6, -1.2], [-0.4, -0.8], [-0.2, -0.4], [0, 0], [0.2, 0.4], [0.4, 0.8], [0.6, 1.2], [0.8, 1.6], [1, 2], [1.2, 2.4], [1.4, 2.8], [1.6, 3.2], [1.8, 3.6], [2, 4], [2.2, 4.4], [2.4, 4.8], [2.6, 5.2], [2.8, 5.6], [3, 6]] },
        { name: "numerical (finite diff)", color: "#ff7b72", points: [[-3, -6], [-2.8, -5.6], [-2.6, -5.2], [-2.4, -4.8], [-2.2, -4.4], [-2, -4], [-1.8, -3.6], [-1.6, -3.2], [-1.4, -2.8], [-1.2, -2.4], [-1, -2], [-0.8, -1.6], [-0.6, -1.2], [-0.4, -0.8], [-0.2, -0.4], [0, 0], [0.2, 0.4], [0.4, 0.8], [0.6, 1.2], [0.8, 1.6], [1, 2], [1.2, 2.4], [1.4, 2.8], [1.6, 3.2], [1.8, 3.6], [2, 4], [2.2, 4.4], [2.4, 4.8], [2.6, 5.2], [2.8, 5.6], [3, 6]] }
      ]
    }],
    caption: "The two curves lie exactly on top of each other: the analytic gradient our Square.backward returns (2x) matches the numerical finite-difference gradient at every x (max difference ~1e-11). This is precisely what torch.autograd.gradcheck automates — if the hand-written backward were wrong, the red curve would peel away from the blue line.",
    code: `import numpy as np

xs = np.linspace(-3, 3, 31)

# Analytic gradient our custom Square.backward returns:  d/dx (x^2) = 2x
analytic = 2 * xs

# Numerical gradient via central finite differences (what gradcheck does):
#   f'(x) ~= (f(x+h) - f(x-h)) / (2h)
h = 1e-4
f = lambda x: x ** 2
numerical = (f(xs + h) - f(xs - h)) / (2 * h)

print("max abs difference:", np.max(np.abs(analytic - numerical)))   # ~1e-11
for xv, a, n in zip(xs[::5], analytic[::5], numerical[::5]):
    print(f"x={xv:+.1f}  analytic={a:+6.3f}  numerical={n:+6.3f}")

import matplotlib.pyplot as plt
plt.plot(xs, analytic, color="#4ea1ff", label="analytic backward 2x", linewidth=3)
plt.plot(xs, numerical, color="#ff7b72", label="numerical (finite diff)", linestyle="--")
plt.xlabel("x"); plt.ylabel("df/dx")
plt.title("Custom Function backward (2x) vs numerical gradient of f(x) = x^2")
plt.legend(); plt.show()`
  };
})();
