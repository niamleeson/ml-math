(function () {
  window.LESSONS.push({
    id: "pt-autograd",
    title: "Autograd: PyTorch's automatic differentiation",
    tagline: "PyTorch records every operation, then computes all the gradients for you with one .backward() call.",
    module: "PyTorch (a complete course)",
    prereqs: ["dl-backprop", "dl-forward-prop", "fnd-chain", "fnd-gradient"],
    whenToUse:
      `<p><b>Autograd runs under every gradient-based model you will ever train in PyTorch.</b> Any time you call <code>loss.backward()</code> and then step an optimizer, autograd is the engine doing the work. You almost never call it by hand &mdash; but understanding it is the difference between debugging a training loop in minutes versus hours.</p>
       <p>You reach for autograd <i>directly</i> when you need a gradient that is not just "weights w.r.t. loss":</p>
       <ul>
         <li><b>Input gradients</b> &mdash; the gradient of the output w.r.t. the <i>input</i>, not the weights. This powers adversarial examples (nudge the input to fool the model) and saliency / explainability maps (which pixels mattered).</li>
         <li><b>Jacobians and Hessians</b> &mdash; <code>torch.autograd.functional.jacobian</code> / <code>hessian</code>, or second-order methods, all build on autograd.</li>
         <li><b>Custom physics / differentiable simulation</b> &mdash; anything where you want "the derivative of this whole computation" for free.</li>
       </ul>
       <p>Autograd <i>is</i> backprop, automated. The hand-cranked chain-rule sweep you learned in <code>dl-backprop</code> is exactly what <code>.backward()</code> executes &mdash; PyTorch just records the graph for you so you never write the sweep by hand.</p>`,
    application:
      `<p>In real model building autograd is invisible plumbing: you build a model with <code>nn.Module</code>, compute a <code>loss</code>, call <code>loss.backward()</code>, and read the gradients off each parameter's <code>.grad</code> so the optimizer can update them. The same engine is reused for transfer learning (freeze layers with <code>requires_grad=False</code>), for adversarial robustness research (gradients w.r.t. pixels), and for explainability (input-gradient saliency).</p>`,
    pitfalls:
      `<ul>
         <li><b>Gradients ACCUMULATE &mdash; this is the #1 PyTorch bug.</b> Each <code>.backward()</code> <i>adds into</i> <code>.grad</code> rather than replacing it. If you forget <code>optimizer.zero_grad()</code> (or <code>x.grad.zero_()</code>) at the top of the loop, gradients from every past step pile up and your model trains on garbage. <b>Fix:</b> zero the gradients every iteration before <code>backward()</code>.</li>
         <li><b>Calling <code>.backward()</code> twice on the same graph.</b> PyTorch frees the graph after the first backward to save memory, so a second call errors. <b>Fix:</b> pass <code>retain_graph=True</code> if you genuinely need a second backward &mdash; but usually the real fix is to recompute the forward pass.</li>
         <li><b>In-place ops corrupting the graph.</b> Operations like <code>x += 1</code>, <code>x.relu_()</code>, or <code>x[mask] = 0</code> can overwrite a value autograd needs for the backward pass, raising "a variable needed for gradient computation has been modified". <b>Fix:</b> use the out-of-place version (<code>x = x + 1</code>).</li>
         <li><b>Not wrapping inference in <code>torch.no_grad()</code>.</b> At evaluation / inference you do not need gradients, but autograd still builds the graph and holds onto activations &mdash; wasted memory and time. <b>Fix:</b> wrap eval code in <code>with torch.no_grad():</code>.</li>
         <li><b><code>.grad</code> is only populated on <i>leaf</i> tensors with <code>requires_grad=True</code>.</b> Intermediate (non-leaf) results have <code>grad=None</code> by default. <b>Fix:</b> call <code>.retain_grad()</code> on an intermediate tensor if you really need its gradient.</li>
         <li><b>Detaching when you should not.</b> <code>.detach()</code> cuts a tensor out of the graph, so no gradient flows back through it. Handy to freeze a teacher network &mdash; but if you accidentally detach part of your trainable path, those parameters silently stop learning.</li>
       </ul>`,
    bigIdea:
      `<p>When you do math on a tensor that has <code>requires_grad=True</code>, PyTorch quietly records each operation into a <b>computational graph</b> &mdash; a directed graph of who-was-computed-from-whom. The graph is <b>dynamic</b>: it is built fresh, on the fly, as your Python code runs. Loops, <code>if</code> branches, varying shapes &mdash; all fine, because the graph is whatever your code actually did this time.</p>
       <p>Calling <code>.backward()</code> on a scalar output walks that graph <i>backwards</i>, applying the chain rule at each node, and deposits the gradient into every leaf's <code>.grad</code>. That backward walk is exactly <b>reverse-mode automatic differentiation</b> &mdash; which is exactly backpropagation (see <code>dl-backprop</code>).</p>`,
    buildup:
      `<p>Three pieces make autograd work:</p>
       <ul>
         <li><b><code>requires_grad=True</code></b> on a leaf tensor says "track me &mdash; I am something we may want gradients for".</li>
         <li><b><code>grad_fn</code></b> &mdash; every tensor produced by a tracked operation carries a reference to the function that made it (e.g. <code>&lt;PowBackward0&gt;</code>, <code>&lt;AddBackward0&gt;</code>). These <code>grad_fn</code> links <i>are</i> the edges of the graph.</li>
         <li><b><code>.backward()</code></b> starts at the output and follows the <code>grad_fn</code> chain back to the leaves, multiplying local derivatives along the way (the chain rule), accumulating into each leaf's <code>.grad</code>.</li>
       </ul>`,
    symbols: [
      { sym: "requires_grad", desc: "a flag on a tensor; True means autograd tracks operations on it so it can later produce a gradient." },
      { sym: "grad_fn", desc: "the backward function attached to a tensor that an op produced; it encodes one edge of the computational graph. Leaf tensors you created have grad_fn = None." },
      { sym: ".backward()", desc: "runs reverse-mode autodiff from this (scalar) tensor back through the graph, filling in .grad on the leaves." },
      { sym: ".grad", desc: "where the accumulated gradient lands, on leaf tensors with requires_grad=True." }
    ],
    formula: `$$ y = x^3 + 2x \\quad\\Longrightarrow\\quad \\frac{dy}{dx} = 3x^2 + 2 $$`,
    whatItDoes:
      `<p>This is the tiny example we will hand-check against PyTorch. The function on the left is what we compute; the derivative on the right is the analytic answer the chain rule (or just the power rule) gives. At $x=2$ that derivative is $3\\cdot 2^2 + 2 = 14$ &mdash; and <code>x.grad</code> after <code>.backward()</code> reads exactly <code>14.0</code>.</p>`,
    derivation:
      `<p><b>How <code>.backward()</code> works under the API &mdash; it is reverse-mode autodiff (backprop).</b></p>
       <ul class="steps">
         <li>As Python runs <code>y = x**3 + 2*x</code>, autograd builds the graph node by node: a <code>PowBackward0</code> node for $x^3$, a <code>MulBackward0</code> for $2x$, and an <code>AddBackward0</code> that combines them into $y$. Each node stores what it needs to compute its local derivative.</li>
         <li><code>y.backward()</code> seeds the output gradient $\\tfrac{dy}{dy}=1$ and walks the graph in reverse. At <code>AddBackward0</code> the gradient $1$ flows unchanged to both inputs (derivative of a sum is $1$ to each).</li>
         <li>Through <code>PowBackward0</code> the local derivative of $x^3$ is $3x^2$; through the $2x$ branch the local derivative is $2$. Each branch multiplies the incoming $1$ by its local derivative.</li>
         <li>The two branches both end at the same leaf $x$, so their contributions <b>add</b>: $3x^2 + 2$. That is the chain rule summing over every path from $y$ back to $x$ &mdash; identical to the backprop sweep in <code>dl-backprop</code>, just executed automatically.</li>
         <li>The result lands in <code>x.grad</code>. At $x=2$: $3(4)+2 = 14$. $\\blacksquare$</li>
       </ul>
       <p><b>Why "accumulate"?</b> The final step <i>adds</i> into <code>x.grad</code> rather than overwriting it. That is deliberate &mdash; it lets you sum gradients over several backward passes (e.g. gradient accumulation across micro-batches). The cost is that you must <code>zero_grad()</code> between independent steps, or stale gradients pile up.</p>`,
    example:
      `<p>Let $x=2$ with <code>requires_grad=True</code>, and $y = x^3 + 2x$.</p>
       <ul class="steps">
         <li>Forward: $y = 2^3 + 2\\cdot 2 = 8 + 4 = 12$.</li>
         <li>Backward: $\\tfrac{dy}{dx} = 3x^2 + 2 = 3(4)+2 = 14$. So <code>x.grad</code> $= 14.0$.</li>
         <li>Now call <code>y2 = x**3 + 2*x; y2.backward()</code> <i>again</i> without zeroing. <code>x.grad</code> becomes $14 + 14 = 28$ &mdash; accumulation in action. Calling <code>x.grad.zero_()</code> first keeps it at $14$.</li>
       </ul>`,
    practice: [
      {
        q: `<b>Type this in Colab.</b> Hand-check autograd. Create <code>x = torch.tensor(2.0, requires_grad=True)</code>, compute <code>y = x**3 + 2*x</code>, call <code>y.backward()</code>, and print <code>x.grad</code>. Predict the value first using the derivative $3x^2+2$ at $x=2$.`,
        steps: [
          { do: `Set <code>requires_grad=True</code> on the leaf, then compute <code>y</code>.`, why: `Only tracked tensors build a graph that <code>.backward()</code> can walk.` },
          { do: `Call <code>y.backward()</code> and read <code>x.grad</code>.`, why: `Reverse-mode autodiff deposits $dy/dx = 3x^2+2 = 14$ into the leaf's <code>.grad</code>.` }
        ],
        answer: `<pre><code>x = torch.tensor(2.0, requires_grad=True)
y = x**3 + 2*x
y.backward()
print(x.grad)        # tensor(14.)   -- matches 3*2^2 + 2 = 14</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Inspect the graph. Create <code>x = torch.tensor(3.0, requires_grad=True)</code>, compute <code>y = x**2 + 5*x</code>, and print <code>y.grad_fn</code>. Then call <code>y.backward()</code> and print <code>x.grad</code>. Predict <code>x.grad</code> from $2x+5$ at $x=3$.`,
        steps: [
          { do: `Print <code>y.grad_fn</code> before backward.`, why: `A tracked op attaches a <code>grad_fn</code> (here <code>AddBackward0</code>) — the edge of the graph.` },
          { do: `Call <code>y.backward()</code> and read <code>x.grad</code>.`, why: `Autograd computes $2x+5 = 11$ at $x=3$.` }
        ],
        answer: `<pre><code>x = torch.tensor(3.0, requires_grad=True)
y = x**2 + 5*x
print(y.grad_fn)     # &lt;AddBackward0 object at 0x...&gt;
y.backward()
print(x.grad)        # tensor(11.)   -- 2*3 + 5 = 11</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The #1 pitfall: gradients accumulate. With <code>x = torch.tensor(2.0, requires_grad=True)</code>, run <code>y = x**3 + 2*x; y.backward()</code> THREE times in a loop WITHOUT zeroing, printing <code>x.grad</code> each time. Predict the three values before running.`,
        steps: [
          { do: `Re-run forward + <code>backward()</code> three times without zeroing.`, why: `<code>.backward()</code> ADDS into <code>.grad</code> rather than replacing it.` },
          { do: `Watch <code>x.grad</code> grow 14, 28, 42.`, why: `Each pass deposits the same gradient 14, so they pile up — this is the bug behind broken training loops.` }
        ],
        answer: `<pre><code>x = torch.tensor(2.0, requires_grad=True)
for i in range(3):
    y = x**3 + 2*x
    y.backward()
    print(x.grad)
# tensor(14.)
# tensor(28.)   -- accumulated!
# tensor(42.)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Now fix the accumulation. Repeat the previous loop but call <code>x.grad.zero_()</code> at the top of each iteration (after the first, since <code>.grad</code> starts as <code>None</code>). Print <code>x.grad</code> each time and confirm it stays 14.`,
        steps: [
          { do: `Zero the gradient before each <code>backward()</code> (guard the first <code>None</code>).`, why: `Zeroing clears stale gradients so each step sees only its own — in a model this is <code>optimizer.zero_grad()</code>.` },
          { do: `Confirm <code>x.grad</code> is 14 every iteration.`, why: `With a clean slate each pass, the gradient no longer piles up.` }
        ],
        answer: `<pre><code>x = torch.tensor(2.0, requires_grad=True)
for i in range(3):
    if x.grad is not None:
        x.grad.zero_()          # optimizer.zero_grad() in a real loop
    y = x**3 + 2*x
    y.backward()
    print(x.grad)
# tensor(14.)
# tensor(14.)   -- correct every time
# tensor(14.)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Calling <code>.backward()</code> twice on one graph. Create <code>x = torch.tensor(2.0, requires_grad=True)</code>, compute <code>y = x**3 + 2*x</code>, call <code>y.backward()</code>, then call <code>y.backward()</code> AGAIN inside a <code>try/except</code> and print the error. Then show <code>retain_graph=True</code> on the first call avoids it.`,
        steps: [
          { do: `Call <code>y.backward()</code> twice and catch the <code>RuntimeError</code>.`, why: `PyTorch frees the graph after the first backward to save memory, so a second call fails.` },
          { do: `Pass <code>retain_graph=True</code> on the first backward.`, why: `It keeps the graph alive so a genuine second backward can run.` }
        ],
        answer: `<pre><code>x = torch.tensor(2.0, requires_grad=True)
y = x**3 + 2*x
y.backward()
try:
    y.backward()                # graph already freed
except RuntimeError as err:
    print("backward twice failed:", "backward through the graph a second time" in str(err))
    # backward twice failed: True

x = torch.tensor(2.0, requires_grad=True)
y = x**3 + 2*x
y.backward(retain_graph=True)   # keep the graph
y.backward()                    # now this works
print(x.grad)                   # tensor(28.)  -- 14 + 14 (still accumulates)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Inference with <code>torch.no_grad()</code>. Create <code>x = torch.tensor(2.0, requires_grad=True)</code>. Inside <code>with torch.no_grad():</code> compute <code>z = x**3 + 2*x</code>. Print <code>z.requires_grad</code> and <code>z.grad_fn</code>. Predict both before running.`,
        steps: [
          { do: `Compute inside <code>with torch.no_grad():</code>.`, why: `It turns off graph construction, so the output is detached.` },
          { do: `Print <code>z.requires_grad</code> and <code>z.grad_fn</code>.`, why: `No graph means <code>requires_grad=False</code> and <code>grad_fn=None</code> — saving memory at inference.` }
        ],
        answer: `<pre><code>x = torch.tensor(2.0, requires_grad=True)
with torch.no_grad():
    z = x**3 + 2*x
print(z.requires_grad)   # False
print(z.grad_fn)         # None</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The float-only rule. Try <code>w = torch.tensor([1, 2, 3], requires_grad=True)</code> in a <code>try/except</code> and print the error. Then fix it with float values and confirm <code>w.requires_grad</code> and <code>w.dtype</code>.`,
        steps: [
          { do: `Attempt an int tensor with <code>requires_grad=True</code> and catch the error.`, why: `Only floating-point tensors can carry gradients, because gradients are real-valued.` },
          { do: `Use <code>[1.0, 2.0, 3.0]</code> (or <code>dtype=torch.float32</code>).`, why: `Floats can track grad; print <code>requires_grad</code> and <code>dtype</code> to confirm.` }
        ],
        answer: `<pre><code>try:
    w = torch.tensor([1, 2, 3], requires_grad=True)
except RuntimeError as err:
    print("int failed:", "floating point" in str(err))  # int failed: True
w = torch.tensor([1.0, 2.0, 3.0], requires_grad=True)
print(w.requires_grad)   # True
print(w.dtype)           # torch.float32</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> A one-step gradient descent by hand using autograd. Start <code>w = torch.tensor(5.0, requires_grad=True)</code>, define loss <code>L = (w - 3)**2</code>, call <code>L.backward()</code>, then update <code>w</code> by <code>w.data -= 0.1 * w.grad</code> inside <code>torch.no_grad()</code>. Print the gradient and the new <code>w</code>.`,
        steps: [
          { do: `Backprop the loss to get <code>w.grad</code>.`, why: `$dL/dw = 2(w-3) = 4$ at $w=5$ — the slope pointing uphill.` },
          { do: `Step downhill: <code>w.data -= 0.1 * w.grad</code>.`, why: `Subtracting a fraction of the gradient moves <code>w</code> toward the minimum at 3; this is one optimizer step done by hand.` }
        ],
        answer: `<pre><code>w = torch.tensor(5.0, requires_grad=True)
L = (w - 3)**2
L.backward()
print(w.grad)            # tensor(4.)   -- 2*(5-3)
with torch.no_grad():
    w -= 0.1 * w.grad     # gradient-descent step
print(w)                 # tensor(4.6000, requires_grad=True)  -- moved toward 3</code></pre>`
      }
    ]
  });

  window.CODE["pt-autograd"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A hand-checkable autograd walkthrough. We differentiate $y = x^3 + 2x$ at $x=2$, where the analytic derivative $3x^2+2 = 14$. Then we demonstrate the famous <b>gradient accumulation</b> gotcha and its <code>zero_grad</code> fix, and finish with a <code>torch.no_grad()</code> block. Runs as-is in Google Colab (torch is preinstalled).</p>`,
    code: `import torch

# --- 1. A leaf tensor we want gradients for ---
x = torch.tensor(2.0, requires_grad=True)

# --- 2. Compute something. PyTorch records a dynamic graph as we go. ---
y = x**3 + 2*x                      # y = 8 + 4 = 12
print("y          =", y.item())     # 12.0
print("y.grad_fn  =", y.grad_fn)    # <AddBackward0> : the graph edge that built y

# --- 3. Reverse-mode autodiff (backprop): fills x.grad ---
y.backward()
print("x.grad     =", x.grad.item())          # 14.0
print("analytic   =", (3*x.item()**2 + 2))    # 3*4 + 2 = 14.0  -> they match

# --- 4. GRADIENTS ACCUMULATE: backward ADDS into .grad ---
y2 = x**3 + 2*x
y2.backward()
print("after 2nd backward (no zero):", x.grad.item())  # 28.0  (14 + 14) -- the #1 bug!

# --- 5. The fix: zero the gradient before the next backward ---
x.grad.zero_()                      # in a model you'd call optimizer.zero_grad()
y3 = x**3 + 2*x
y3.backward()
print("after zero_grad + backward :", x.grad.item())   # 14.0  -- correct again

# --- 6. torch.no_grad(): stop tracking (inference / freezing) ---
with torch.no_grad():
    z = x**3 + 2*x                  # computed, but NO graph is built
print("z.requires_grad =", z.requires_grad)  # False -- saves memory at inference
print("z.grad_fn       =", z.grad_fn)         # None

# (.detach() does the same for a single tensor: x.detach() shares data but is graph-free)
`
  };

  window.CODEVIZ["pt-autograd"] = {
    question: "Does PyTorch's autograd actually compute the true derivative? Plot the autograd gradient of f(x)=x^3+2x against the analytic derivative 3x^2+2.",
    charts: [{
      type: "line",
      title: "Autograd gradient vs analytic derivative of f(x) = x^3 + 2x",
      xlabel: "x",
      ylabel: "df/dx",
      series: [
        { name: "analytic 3x^2+2", color: "#4ea1ff", points: [[-3, 29], [-2.8, 25.52], [-2.6, 22.28], [-2.4, 19.28], [-2.2, 16.52], [-2, 14], [-1.8, 11.72], [-1.6, 9.68], [-1.4, 7.88], [-1.2, 6.32], [-1, 5], [-0.8, 3.92], [-0.6, 3.08], [-0.4, 2.48], [-0.2, 2.12], [0, 2], [0.2, 2.12], [0.4, 2.48], [0.6, 3.08], [0.8, 3.92], [1, 5], [1.2, 6.32], [1.4, 7.88], [1.6, 9.68], [1.8, 11.72], [2, 14], [2.2, 16.52], [2.4, 19.28], [2.6, 22.28], [2.8, 25.52], [3, 29]] },
        { name: "torch autograd", color: "#ff7b72", points: [[-3, 29], [-2.8, 25.52], [-2.6, 22.28], [-2.4, 19.28], [-2.2, 16.52], [-2, 14], [-1.8, 11.72], [-1.6, 9.68], [-1.4, 7.88], [-1.2, 6.32], [-1, 5], [-0.8, 3.92], [-0.6, 3.08], [-0.4, 2.48], [-0.2, 2.12], [0, 2], [0.2, 2.12], [0.4, 2.48], [0.6, 3.08], [0.8, 3.92], [1, 5], [1.2, 6.32], [1.4, 7.88], [1.6, 9.68], [1.8, 11.72], [2, 14], [2.2, 16.52], [2.4, 19.28], [2.6, 22.28], [2.8, 25.52], [3, 29]] }
      ]
    }],
    caption: "The two curves lie exactly on top of each other: autograd's reverse-mode gradient equals the analytic derivative 3x^2+2 at every x. This validates that .backward() really is computing the calculus derivative (the V at x=0 bottoms out at the minimum slope of 2).",
    code: `import numpy as np
import torch

xs = np.linspace(-3, 3, 31)

# Analytic derivative of f(x) = x^3 + 2x  ->  3x^2 + 2
analytic = 3 * xs**2 + 2

# torch.autograd: differentiate the SAME function at each x and read x.grad
autograd = []
for xv in xs:
    x = torch.tensor(float(xv), requires_grad=True)
    y = x**3 + 2*x
    y.backward()
    autograd.append(x.grad.item())
autograd = np.array(autograd)

print("max abs difference:", np.max(np.abs(analytic - autograd)))  # ~0.0
for xv, a, g in zip(xs[::5], analytic[::5], autograd[::5]):
    print(f"x={xv:+.1f}  analytic={a:6.2f}  autograd={g:6.2f}")
`
  };
})();
