(function () {
  window.LESSONS.push({
    id: "pt-autograd",
    title: "Autograd: PyTorch's automatic differentiation",
    tagline: "PyTorch records every operation, then computes all the gradients for you with one .backward() call.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["dl-backprop", "dl-forward-prop", "fnd-chain", "fnd-gradient"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>set <code>requires_grad=True</code> on a leaf tensor, run a forward computation, call <code>.backward()</code>, and read the gradient off <code>.grad</code> &mdash; and hand-check it against the analytic derivative;</li>
<li>explain the dynamic computation graph: how <code>grad_fn</code> links record each op and how <code>.backward()</code> walks them in reverse (reverse-mode autodiff = backprop);</li>
<li>diagnose the famous gotchas: gradients <i>accumulate</i> (so you must <code>zero_grad</code>), a graph is freed after one backward (<code>retain_graph</code>), and <code>torch.no_grad()</code> turns tracking off at inference.</li>
</ul>
<p><b>The API you'll own:</b> <code>requires_grad</code>, <code>.backward()</code>, <code>.grad</code>, <code>grad_fn</code>, <code>.grad.zero_()</code>, <code>retain_graph=True</code>, <code>torch.no_grad()</code>, <code>.detach()</code>.</p>`,

    concept: `<p>When you do math on a tensor that has <code>requires_grad=True</code>, PyTorch quietly records each operation into a <b>computational graph</b> &mdash; a directed graph of who-was-computed-from-whom. The graph is <b>dynamic</b>: it is built fresh, on the fly, as your Python code runs, so loops, <code>if</code> branches, and varying shapes are all fine &mdash; the graph is whatever your code actually did this time.</p>
<p>Calling <code>.backward()</code> on a scalar output walks that graph <i>backwards</i>, applying the <a onclick="App.open('fnd-chain')">chain rule</a> at each node, and deposits the gradient into every leaf's <code>.grad</code>. That backward walk is <b>reverse-mode automatic differentiation</b> &mdash; which is exactly <a onclick="App.open('dl-backprop')">backpropagation</a>, automated. You almost never call it by hand, but understanding it is the difference between debugging a training loop in minutes versus hours.</p>
<p>Three pieces make it work:</p>
<ul>
<li><b><code>requires_grad=True</code></b> on a leaf tensor says "track me &mdash; I am something we may want gradients for";</li>
<li><b><code>grad_fn</code></b> &mdash; every tensor produced by a tracked op carries a reference to the function that made it (<code>&lt;PowBackward0&gt;</code>, <code>&lt;AddBackward0&gt;</code>); these links <i>are</i> the edges of the graph;</li>
<li><b><code>.backward()</code></b> starts at the output and follows the <code>grad_fn</code> chain back to the leaves, multiplying local derivatives along the way and accumulating into each leaf's <code>.grad</code>.</li>
</ul>
<p>The running example: $y = x^3 + 2x$, whose derivative is $3x^2 + 2$. At $x = 2$ that is $3\\cdot 4 + 2 = 14$ &mdash; and <code>x.grad</code> reads exactly <code>14.0</code>.</p>`,

    apiTable: [
      { sig: "torch.tensor(v, requires_grad=True)", does: "Make a leaf tensor autograd will track. Must be <b>floating-point</b> &mdash; ints cannot carry gradients.", snippet: "x = torch.tensor(2.0, requires_grad=True)" },
      { sig: "y = f(x)", does: "Any op on a tracked tensor builds graph nodes and gives the result a <code>grad_fn</code>.", snippet: "y = x**3 + 2*x" },
      { sig: "y.grad_fn", does: "The backward function that produced <code>y</code> &mdash; one edge of the graph. Leaves have <code>None</code>.", snippet: "y.grad_fn   # <AddBackward0 object ...>" },
      { sig: "y.backward()", does: "Run reverse-mode autodiff from this scalar back through the graph, filling each leaf's <code>.grad</code>.", snippet: "y.backward()" },
      { sig: "x.grad", does: "Where the accumulated gradient lands, on leaf tensors with <code>requires_grad=True</code>.", snippet: "x.grad      # tensor(14.)" },
      { sig: "x.grad.zero_()", does: "Clear stale gradients &mdash; gradients ADD up, so zero before each backward (this is <code>optimizer.zero_grad()</code>).", snippet: "x.grad.zero_()" },
      { sig: "y.backward(retain_graph=True)", does: "Keep the graph alive so a genuine second backward can run; otherwise the graph is freed after the first.", snippet: "y.backward(retain_graph=True)" },
      { sig: "with torch.no_grad():", does: "Turn off graph construction for the block &mdash; inference / parameter updates; the output is detached.", snippet: "with torch.no_grad():\n    w -= 0.1 * w.grad" },
      { sig: "x.detach()", does: "Return a tensor sharing the data but cut out of the graph &mdash; freezes that path (no gradient flows back).", snippet: "frozen = x.detach()" }
    ],

    codeTour: [
      {
        explain: `<b>A leaf tensor and a forward computation.</b> Set <code>requires_grad=True</code> so PyTorch tracks operations on <code>x</code>. As Python runs <code>x**3 + 2*x</code> it builds the graph node by node; the result <code>y</code> carries a <code>grad_fn</code> (here <code>AddBackward0</code>), the edge that built it.`,
        code: `import torch\n\nx = torch.tensor(2.0, requires_grad=True)\ny = x**3 + 2*x                      # y = 8 + 4 = 12\nprint("y         =", y.item())\nprint("y.grad_fn =", y.grad_fn)`,
        output: `y         = 12.0\ny.grad_fn = <AddBackward0 object at 0x7f...>`
      },
      {
        explain: `<b>Backward &mdash; reverse-mode autodiff fills <code>.grad</code>.</b> <code>y.backward()</code> seeds <code>dy/dy = 1</code> and walks the graph in reverse, multiplying local derivatives. The result in <code>x.grad</code> matches the analytic derivative $3x^2 + 2 = 14$ at $x = 2$.`,
        code: `y.backward()\nprint("x.grad   =", x.grad.item())\nprint("analytic =", 3*x.item()**2 + 2)`,
        output: `x.grad   = 14.0\nanalytic = 14.0`
      },
      {
        explain: `<b>The #1 gotcha: gradients ACCUMULATE.</b> A second <code>backward()</code> on a freshly recomputed <code>y</code> <i>adds into</i> <code>x.grad</code> rather than replacing it &mdash; so it becomes <code>14 + 14 = 28</code>. This pile-up is the bug behind countless broken training loops.`,
        code: `y2 = x**3 + 2*x\ny2.backward()\nprint("after 2nd backward (no zero):", x.grad.item())`,
        output: `after 2nd backward (no zero): 28.0`
      },
      {
        explain: `<b>The fix: zero the gradient first.</b> <code>x.grad.zero_()</code> clears the stale value so the next backward sees a clean slate and lands on <code>14</code> again. In a real model this single line is <code>optimizer.zero_grad()</code> at the top of the loop.`,
        code: `x.grad.zero_()                      # optimizer.zero_grad() in a model\ny3 = x**3 + 2*x\ny3.backward()\nprint("after zero_grad + backward :", x.grad.item())`,
        output: `after zero_grad + backward : 14.0`
      },
      {
        explain: `<b>Inference with <code>torch.no_grad()</code>.</b> Inside the block PyTorch builds no graph, so the output has <code>requires_grad=False</code> and <code>grad_fn=None</code> &mdash; saving memory and time at evaluation. (<code>.detach()</code> does the same for a single tensor.)`,
        code: `with torch.no_grad():\n    z = x**3 + 2*x              # computed, but NO graph is built\nprint("z.requires_grad =", z.requires_grad)\nprint("z.grad_fn       =", z.grad_fn)`,
        output: `z.requires_grad = False\nz.grad_fn       = None`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom and check each line against the calculus:</p>
<ul>
<li><code>y = 12.0</code> is the forward value $2^3 + 2\\cdot2$; <code>y.grad_fn</code> being an <code>AddBackward0</code> object proves a graph was recorded (a leaf would show <code>None</code>).</li>
<li><code>x.grad = 14.0</code> equals the hand-derived <code>analytic = 14.0</code> &mdash; direct proof that <code>.backward()</code> computes the true derivative $3x^2 + 2$.</li>
<li><code>after 2nd backward (no zero): 28.0</code> shows accumulation: the same gradient 14 added on top of itself. This is the famous bug.</li>
<li>After <code>x.grad.zero_()</code> the value is back to <code>14.0</code> &mdash; the fix, which in a model is <code>optimizer.zero_grad()</code>.</li>
<li>The <code>no_grad</code> block prints <code>False</code> and <code>None</code>: no graph was built, so there is nothing to differentiate.</li>
</ul>
<p>There is no randomness here, so no seed is needed and the numbers are identical on CPU and GPU; only the <code>grad_fn</code> object's memory address in the printout varies.</p>`,

    cheatsheet: [
      { code: "x = torch.tensor(2.0, requires_grad=True)", note: "track a leaf (must be float)" },
      { code: "y = x**3 + 2*x", note: "ops build the graph; y gets a grad_fn" },
      { code: "y.backward()", note: "reverse-mode autodiff -> fills x.grad" },
      { code: "x.grad", note: "the gradient lands here (on leaves)" },
      { code: "x.grad.zero_()", note: "gradients ACCUMULATE -> zero before each backward" },
      { code: "y.backward(retain_graph=True)", note: "keep the graph for a 2nd backward" },
      { code: "with torch.no_grad(): ...", note: "no graph at inference -> saves memory" },
      { code: "x.detach()", note: "cut a tensor out of the graph (freeze a path)" }
    ],

    deeper: `<p>Autograd is the engine that automates the math from these lessons:</p>
<ul>
<li><code>.backward()</code> <i>is</i> <a onclick="App.open('dl-backprop')">backpropagation</a> &mdash; the hand-cranked chain-rule sweep, executed for you;</li>
<li>each node multiplies a local derivative via the <a onclick="App.open('fnd-chain')">chain rule</a>, and contributions from every path back to a leaf <a onclick="App.open('fnd-gradient')">sum into its gradient</a>;</li>
<li>the forward pass it records is <a onclick="App.open('dl-forward-prop')">forward propagation</a> &mdash; autograd just remembers it so the backward walk has a graph to follow.</li>
</ul>
<p>That is why "autograd = backprop, automated": the calculus is the <code>dl-*</code> theory; PyTorch's contribution is recording the graph so you never write the sweep by hand.</p>`,
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
      `<p>Let $x=2$ with <code>requires_grad=True</code>, and $y = x^3 + 2x$ (so $\\tfrac{dy}{dx} = 3x^2 + 2$).</p>
       <ul class="steps">
         <li>Forward: $y = 2^3 + 2\\cdot 2 = 8 + 4 = 12$.</li>
         <li>Backward seeds $\\tfrac{dy}{dy} = 1$, splits at the sum: the $x^3$ branch gives $3x^2 = 3\\cdot 2^2 = 12$, the $2x$ branch gives $2$.</li>
         <li>The two branches hit the same leaf $x$, so they <b>add</b>: $\\tfrac{dy}{dx} = 12 + 2 = 14$. So <code>x.grad</code> $= 14.0$ &mdash; exactly the analytic derivative.</li>
       </ul>
       <p>Now call <code>backward()</code> three times in a row, recomputing $y$ each time, to see what gradients <i>accumulate</i> means &mdash; with and without <code>x.grad.zero_()</code>:</p>
       <table class="extable">
         <caption>Value sitting in <code>x.grad</code> after each <code>backward()</code> (each pass deposits 14)</caption>
         <thead><tr><th>backward call</th><th class="num">no zero_grad</th><th class="num">with zero_grad</th></tr></thead>
         <tbody>
           <tr><td class="row-h">1st</td><td class="num">14</td><td class="num">14</td></tr>
           <tr><td class="row-h">2nd</td><td class="num">28</td><td class="num">14</td></tr>
           <tr><td class="row-h">3rd</td><td class="num">42</td><td class="num">14</td></tr>
         </tbody>
       </table>
       <p>Without zeroing the same $14$ piles up: $14,\\ 14{+}14{=}28,\\ 28{+}14{=}42$ &mdash; the #1 PyTorch bug. Calling <code>x.grad.zero_()</code> before each pass clears the slate, so it stays $14$ every time.</p>`,
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
    question: "Does autograd really compute the true derivative — and what do its famous gotchas look like as a picture?",
    charts: [
      {
        type: "line",
        title: "Healthy: autograd gradient lands exactly on the analytic derivative",
        xlabel: "x",
        ylabel: "df/dx",
        series: [
          { name: "analytic 3x^2+2", color: "#4ea1ff", points: [[-3, 29], [-2.8, 25.52], [-2.6, 22.28], [-2.4, 19.28], [-2.2, 16.52], [-2, 14], [-1.8, 11.72], [-1.6, 9.68], [-1.4, 7.88], [-1.2, 6.32], [-1, 5], [-0.8, 3.92], [-0.6, 3.08], [-0.4, 2.48], [-0.2, 2.12], [0, 2], [0.2, 2.12], [0.4, 2.48], [0.6, 3.08], [0.8, 3.92], [1, 5], [1.2, 6.32], [1.4, 7.88], [1.6, 9.68], [1.8, 11.72], [2, 14], [2.2, 16.52], [2.4, 19.28], [2.6, 22.28], [2.8, 25.52], [3, 29]] },
          { name: "torch autograd", color: "#7ee787", points: [[-3, 29], [-2.8, 25.52], [-2.6, 22.28], [-2.4, 19.28], [-2.2, 16.52], [-2, 14], [-1.8, 11.72], [-1.6, 9.68], [-1.4, 7.88], [-1.2, 6.32], [-1, 5], [-0.8, 3.92], [-0.6, 3.08], [-0.4, 2.48], [-0.2, 2.12], [0, 2], [0.2, 2.12], [0.4, 2.48], [0.6, 3.08], [0.8, 3.92], [1, 5], [1.2, 6.32], [1.4, 7.88], [1.6, 9.68], [1.8, 11.72], [2, 14], [2.2, 16.52], [2.4, 19.28], [2.6, 22.28], [2.8, 25.52], [3, 29]] }
        ],
        interpret: "<b>x-axis</b> is the input x; <b>y-axis</b> is the slope df/dx. The blue line is hand-derived calculus (3x^2+2); the green line is what <code>.backward()</code> read off <code>x.grad</code> at each x. They sit perfectly on top of each other — that overlap is the whole point: autograd is computing the <i>exact</i> derivative, not an approximation. Both curves dip to a minimum of 2 at x=0 (the +2 term) and rise as the x^2 term grows. Real computed numbers."
      },
      {
        type: "line",
        title: "The #1 bug: gradients ACCUMULATE if you don't zero_grad",
        xlabel: "number of backward() calls (no zero_grad)",
        ylabel: "value sitting in x.grad",
        series: [
          { name: "with zero_grad (correct)", color: "#7ee787", points: [[1, 14], [2, 14], [3, 14], [4, 14], [5, 14]] },
          { name: "no zero_grad (buggy)", color: "#ff7b72", points: [[1, 14], [2, 28], [3, 42], [4, 56], [5, 70]] }
        ],
        interpret: "<b>x-axis</b> counts how many times you call <code>.backward()</code> on the same x; <b>y-axis</b> is the value left in <code>x.grad</code>. The correct gradient is always 14 (green, flat). But <code>.backward()</code> <i>adds into</i> <code>.grad</code> instead of replacing it, so without <code>zero_grad</code> the red line climbs 14, 28, 42, 56, 70 — a straight line through the origin. If you ever see your gradient growing in lock-step with the iteration count, you forgot <code>optimizer.zero_grad()</code>. Real computed numbers."
      },
      {
        type: "bars",
        title: "no_grad / detach: gradient flow is cut — x.grad stays empty",
        labels: ["normal backward", "inside no_grad()", "after .detach()"],
        values: [14, 0, 0],
        valueLabels: ["14.0", "None", "None"],
        colors: ["#7ee787", "#9aa7b4", "#9aa7b4"],
        interpret: "Each bar is the gradient that reaches the leaf x after a forward pass done three different ways. <b>Left (green):</b> a normal tracked forward, so <code>.backward()</code> deposits 14. <b>Middle / right (grey):</b> the forward ran inside <code>torch.no_grad()</code> or on a <code>.detach()</code>-ed tensor, so no graph was built and there is nothing to differentiate — <code>x.grad</code> is never filled (None, drawn as 0). Grey = no gradient on purpose. This is the inference / frozen-path case: a zero bar here is correct, not a bug. Illustrative of the two ways tracking gets switched off."
      }
    ],
    caption: "Ideal plus the two gotchas every PyTorch user hits: the gradient matches calculus exactly, it piles up if you skip zero_grad, and it vanishes under no_grad/detach.",
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
