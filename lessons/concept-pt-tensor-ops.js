/* =====================================================================
   PyTorch (a complete course) — Operating on tensors.
   id: pt-tensor-ops
   Self-contained lesson: window.LESSONS / window.CODE / window.CODEVIZ.
   CODE runs in Google Colab (torch preinstalled, runnable:false here).
   CODEVIZ computes real numbers with numpy (broadcasting matches torch).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "pt-tensor-ops",
    title: "Operating on tensors",
    tagline: "Add, multiply, broadcast, matmul, reduce, and reshape — the moves every model is built from.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["fnd-dot", "fnd-matrix", "dl-forward-prop"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>combine tensors with the five core verbs &mdash; elementwise math, broadcasting, matrix multiply, reductions, and reshaping &mdash; and tell <code>*</code> (elementwise) apart from <code>@</code> (matmul);</li>
<li>predict the output shape of a broadcast or a matmul <i>before</i> you run it, and use <code>keepdim=True</code> so a reduction can broadcast back (the softmax trick);</li>
<li>rearrange a tensor with <code>view</code> / <code>reshape</code> / <code>permute</code> / <code>unsqueeze</code> / <code>cat</code> / <code>stack</code>, and know why <code>view</code> fails on a non-contiguous tensor.</li>
</ul>
<p><b>The API you'll own:</b> <code>* / @ / torch.matmul / torch.bmm</code>, <code>torch.exp</code>, <code>sum/mean/max/argmax(dim=, keepdim=)</code>, <code>view/reshape/permute/unsqueeze/flatten/cat/stack</code>.</p>`,

    concept: `<p>A <b>tensor</b> is just an n-dimensional grid of numbers with a <b>shape</b> (its size along each axis, e.g. <code>(batch, features)</code>). Almost everything you do is one of <b>five verbs</b>: apply a function to each number, line two tensors up and combine them, multiply matrices, collapse an axis, or rearrange the grid. If you can do these fluently, you can read and write almost any model &mdash; a linear layer is <code>x @ W.T + b</code>, softmax is <code>exp</code> over a <code>sum(dim=-1, keepdim=True)</code>, a prediction is an <code>argmax(dim=-1)</code>, and reshaping glues the layers together (the forward math is <code>dl-forward-prop</code>).</p>
<p>The whole game is keeping <b>shapes</b> compatible, and two rules govern it:</p>
<ul>
<li><b>Broadcasting.</b> Line shapes up by their <i>trailing</i> (rightmost) dims. Two dims are compatible if they are equal, or one of them is 1; a size-1 dim is stretched to match, and missing leading dims count as 1. So <code>(3,1) + (1,4) &rarr; (3,4)</code>. PyTorch does this for free by setting that axis's memory stride to 0 &mdash; which is also why a wrong shape broadcasts <i>silently</i> instead of erroring.</li>
<li><b>Matmul.</b> <code>(m,k) @ (k,n) &rarr; (m,n)</code> &mdash; the inner <code>k</code> must match and cancels; the outer dims survive. <code>torch.bmm</code> does this per batch element: <code>(B,m,k) @ (B,k,n) &rarr; (B,m,n)</code>.</li>
</ul>
<p>PyTorch will happily run a mathematically-valid-but-wrong op, so <b>reading shapes is the real skill</b> &mdash; print <code>.shape</code> whenever a result looks off.</p>`,

    apiTable: [
      { sig: "a * b   /   a + b   /   torch.exp(a)", does: "Elementwise math &mdash; acts number-by-number and keeps the shape. <code>torch.relu(a)</code> is <code>max(a, 0)</code> elementwise.", snippet: "A * B          # same shape, number-by-number" },
      { sig: "a @ b   /   torch.matmul(a, b)", does: "Matrix multiply: <code>(m,k) @ (k,n) &rarr; (m,n)</code>. Every linear layer is one matmul.", snippet: "A @ C          # (2,3) @ (3,2) -> (2,2)" },
      { sig: "torch.bmm(a, b)", does: "Batch matrix multiply &mdash; one matmul per batch element: <code>(B,m,k) @ (B,k,n) &rarr; (B,m,n)</code>.", snippet: "torch.bmm(batch, w)   # (8,2,3)@(8,3,5)->(8,2,5)" },
      { sig: "x.sum/mean/max(dim=, keepdim=)", does: "Reduce along an axis &mdash; the <code>dim</code> you name collapses. <code>keepdim=True</code> leaves it size 1 to broadcast back.", snippet: "g.sum(dim=1, keepdim=True)   # (3,4) -> (3,1)" },
      { sig: "x.argmax(dim=-1)", does: "Index of the max along an axis &mdash; the predicted class from a row of logits.", snippet: "z.argmax(dim=-1)   # one class per row" },
      { sig: "x.view(*shape)", does: "Same data, new shape, sharing memory &mdash; but requires a <b>contiguous</b> tensor.", snippet: "x.view(2, 12)" },
      { sig: "x.reshape(*shape)", does: "Like <code>view</code> but copies into a fresh contiguous block when needed &mdash; the safe default.", snippet: "xp.reshape(-1)   # works after permute" },
      { sig: "x.permute(*dims) / x.transpose(a, b)", does: "Reorder axes. Result is non-contiguous, so a later <code>view</code> will fail &mdash; use <code>reshape</code>.", snippet: "x.permute(0, 2, 1)" },
      { sig: "x.unsqueeze(d) / x.squeeze() / x.flatten(d)", does: "Insert / remove a size-1 axis, or merge axes from <code>d</code> onward.", snippet: "x.unsqueeze(0)   # add a batch axis" },
      { sig: "torch.cat([..], dim=) / torch.stack([..], dim=)", does: "<code>cat</code> joins along an existing axis; <code>stack</code> adds a new one.", snippet: "torch.cat([x, x], dim=0)" }
    ],

    codeTour: [
      {
        explain: `<b>Broadcasting: <code>(3,1) + (1,4) &rarr; (3,4)</code>.</b> The column repeats across 4 columns and the row repeats down 3 rows, so cell <code>(i,j) = col[i] + row[j]</code>. Print all three shapes &mdash; this is the move that silently produces a wrong grid when you didn't mean it.`,
        code: `import torch\ntorch.manual_seed(0)\n\ncol = torch.tensor([[10.], [20.], [30.]])   # (3,1)\nrow = torch.tensor([[1., 2., 3., 4.]])      # (1,4)\ngrid = col + row\nprint("col", tuple(col.shape), "row", tuple(row.shape), "grid", tuple(grid.shape))\nprint(grid)`,
        output: `col (3, 1) row (1, 4) grid (3, 4)\ntensor([[11., 12., 13., 14.],\n        [21., 22., 23., 24.],\n        [31., 32., 33., 34.]])`
      },
      {
        explain: `<b>Elementwise <code>*</code> vs matrix multiply <code>@</code>.</b> <code>*</code> keeps the shape; <code>@</code> follows <code>(m,k)@(k,n)&rarr;(m,n)</code>, the inner dim cancelling. <code>torch.bmm</code> does a matmul per batch element &mdash; mixing up <code>*</code> and <code>@</code> is the #1 shape bug.`,
        code: `A = torch.arange(6.).reshape(2, 3)\nB = torch.ones(2, 3)\nprint("A * B ->", tuple((A * B).shape))\nC = torch.ones(3, 2)\nprint("A @ C ->", tuple((A @ C).shape))\nbatch = torch.randn(8, 2, 3)\nw     = torch.randn(8, 3, 5)\nprint("bmm   ->", tuple(torch.bmm(batch, w).shape))`,
        output: `A * B -> (2, 3)\nA @ C -> (2, 2)\nbmm   -> (8, 2, 5)`
      },
      {
        explain: `<b>Reductions and the <code>keepdim</code> trick.</b> <code>sum(dim=1)</code> collapses the columns to one value per row, giving shape <code>(3,)</code>; with <code>keepdim=True</code> it stays <code>(3,1)</code> so it can broadcast back &mdash; exactly how softmax divides each row by its sum. <code>argmax(dim=1)</code> gives the index of the max per row.`,
        code: `row_sum      = grid.sum(dim=1)\nrow_sum_keep = grid.sum(dim=1, keepdim=True)\nprint("sum dim=1         ->", tuple(row_sum.shape), row_sum.tolist())\nprint("sum dim=1 keepdim ->", tuple(row_sum_keep.shape))\nnormalized = grid / row_sum_keep            # (3,4)/(3,1) -> (3,4)\nprint("each row sums to 1 ->", normalized.sum(dim=1).tolist())\nprint("argmax dim=1       ->", grid.argmax(dim=1).tolist())`,
        output: `sum dim=1         -> (3,) [50.0, 90.0, 130.0]\nsum dim=1 keepdim -> (3, 1)\neach row sums to 1 -> [1.0, 1.0, 1.0]\nargmax dim=1       -> [3, 3, 3]`
      },
      {
        explain: `<b>Reshaping, and why <code>view</code> can fail.</b> A fresh tensor is contiguous, so <code>view</code> works. After <code>permute</code> the strides are scrambled and the data is no longer contiguous, so <code>view</code> refuses &mdash; <code>reshape</code> copies into a fresh contiguous block and succeeds.`,
        code: `x = torch.arange(24).reshape(2, 3, 4)\nprint("x.view(2,12)     ->", tuple(x.view(2, 12).shape))\nxp = x.permute(0, 2, 1)\nprint("permute          ->", tuple(xp.shape), "contiguous?", xp.is_contiguous())\ntry:\n    xp.view(-1)\nexcept RuntimeError:\n    print("xp.view(-1) FAILED -> use reshape")\nprint("xp.reshape(-1)   ->", tuple(xp.reshape(-1).shape))`,
        output: `x.view(2,12)     -> (2, 12)\npermute          -> (2, 4, 3) contiguous? False\nxp.view(-1) FAILED -> use reshape\nxp.reshape(-1)   -> (24,)`
      },
      {
        explain: `<b>The rest of the reshape toolkit.</b> <code>flatten(1)</code> merges every axis from dim 1 on; <code>unsqueeze(0)</code> inserts a size-1 batch axis; <code>cat</code> doubles an existing axis while <code>stack</code> adds a brand-new leading one. Knowing which one you want is half of shape debugging.`,
        code: `print("flatten(1)  ->", tuple(x.flatten(1).shape))\nprint("unsqueeze(0)->", tuple(x.unsqueeze(0).shape))\nprint("cat dim=0   ->", tuple(torch.cat([x, x], dim=0).shape))\nprint("stack dim=0 ->", tuple(torch.stack([x, x], dim=0).shape))`,
        output: `flatten(1)  -> (2, 12)\nunsqueeze(0)-> (1, 2, 3, 4)\ncat dim=0   -> (4, 3, 4)\nstack dim=0 -> (2, 2, 3, 4)`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom and read the printed shapes &mdash; that is where the bugs live:</p>
<ul>
<li>The broadcast prints <code>grid (3, 4)</code>: the <code>(3,1)</code> column and <code>(1,4)</code> row stretch into a 3&times;4 grid, top-left 11, bottom-right 34. PyTorch never copied &mdash; it set a stride to 0.</li>
<li><code>A * B -&gt; (2, 3)</code> keeps the shape; <code>A @ C -&gt; (2, 2)</code> shows the inner 3 cancelling. <code>bmm -&gt; (8, 2, 5)</code> is one matmul per batch element.</li>
<li><code>sum(dim=1)</code> gives <code>(3,)</code>, but with <code>keepdim=True</code> it stays <code>(3, 1)</code> &mdash; that is what lets <code>grid / row_sum_keep</code> broadcast back so each row sums to 1.</li>
<li>The permuted tensor reports <code>contiguous? False</code>, so <code>view(-1)</code> raises while <code>reshape(-1)</code> succeeds by copying &mdash; the canonical <code>view</code>-vs-<code>reshape</code> distinction.</li>
</ul>
<p>These are pure-shape operations, so there is no GPU or seed caveat for the printed shapes; the <code>randn</code> batch only affects the <code>bmm</code> values, not its shape.</p>`,

    cheatsheet: [
      { code: "A * B          /   A @ C", note: "elementwise (keeps shape) vs matmul (inner dim cancels)" },
      { code: "torch.bmm(a, b)", note: "batched matmul: (B,m,k)@(B,k,n)->(B,m,n)" },
      { code: "x.sum(dim=1) / x.mean(dim=0)", note: "dim is the axis that COLLAPSES" },
      { code: "x.sum(dim=1, keepdim=True)", note: "keep axis as size 1 so it broadcasts back (softmax)" },
      { code: "z.argmax(dim=-1)", note: "index of the max -> predicted class" },
      { code: "x.view(2, 12)   /   x.reshape(-1)", note: "view needs contiguous; reshape may copy" },
      { code: "x.permute(0, 2, 1)", note: "reorder axes -> non-contiguous (view will fail)" },
      { code: "x.unsqueeze(0) / x.flatten(1)", note: "add a size-1 axis / merge axes from dim 1" },
      { code: "torch.cat([x,x], 0) / torch.stack([x,x], 0)", note: "join existing axis / add a new axis" }
    ],

    deeper: `<p>These five verbs are the computational form of the linear algebra behind a network:</p>
<ul>
<li>matmul is the <a onclick="App.open('fnd-dot')">dot product</a> done in bulk &mdash; a <a onclick="App.open('fnd-matrix')">matrix</a> times a matrix;</li>
<li>a linear layer <code>x @ W.T + b</code> is one step of <a onclick="App.open('dl-forward-prop')">forward propagation</a>: a matmul (the weights) plus a broadcast-add (the bias);</li>
<li>softmax over classes &mdash; <code>exp</code> divided by a <code>sum(dim=-1, keepdim=True)</code> &mdash; turns logits into the probabilities that <a onclick="App.open('dl-cross-entropy')">cross-entropy</a> scores.</li>
</ul>
<p>The math lives in those lessons; here the point is that every one of them reduces to these tensor ops, and getting the shapes right is what makes them run.</p>`,

    whenToUse:
      `<p>Always. Every model is just tensor operations stacked up.</p>
       <ul>
         <li><b>Elementwise</b> ops (<code>+ - * /</code>, <code>torch.exp</code>, <code>torch.relu</code>) apply a function to each number.</li>
         <li><b>Broadcasting</b> lets a small tensor stretch to meet a big one — how a bias vector adds to a whole batch.</li>
         <li><b>Matrix multiply</b> (<code>@</code> / <code>torch.matmul</code> / <code>torch.bmm</code>) is the workhorse: every linear layer is one matmul.</li>
         <li><b>Reductions</b> (<code>sum</code>, <code>mean</code>, <code>max</code>, <code>argmax</code>) collapse an axis — a loss is a reduction, a prediction is an <code>argmax</code>.</li>
         <li><b>Reshaping</b> (<code>view</code>, <code>reshape</code>, <code>permute</code>, <code>squeeze</code>, <code>cat</code>) rearranges numbers without changing them — to line up shapes for the next op.</li>
       </ul>
       <p>If you can do these five things fluently, you can read and write almost any model.</p>`,

    application:
      `<p>A single linear layer is <code>x @ W.T + b</code>: a matmul, then a broadcast-add of the bias.</p>
       <p>Softmax over classes is <code>exp</code> (elementwise) divided by a <code>sum(dim=-1, keepdim=True)</code> (reduction + broadcast).</p>
       <p>A convolution flattens patches and matmuls. Attention is matmuls plus a softmax reduction.</p>
       <p>Getting a prediction out is <code>logits.argmax(dim=-1)</code>. Reshaping glues these layers together so the shapes fit.</p>`,

    pitfalls:
      `<ul>
         <li><b><code>*</code> is NOT <code>@</code>.</b> <code>*</code> multiplies element by element; <code>@</code> is matrix multiply. Mixing them up is the single most common shape bug. A <code>(2,3)*(2,3)</code> works but means something totally different from <code>(2,3)@(3,2)</code>.</li>
         <li><b>Broadcasting can SILENTLY give the wrong shape.</b> Adding a <code>(3,)</code> to a <code>(3,1)</code> gives a <code>(3,3)</code> grid — no error, just a wrong answer that poisons everything downstream. Always print <code>.shape</code> when a result looks off.</li>
         <li><b><code>view</code> fails on non-contiguous tensors.</b> After <code>permute</code> or <code>transpose</code> the memory is no longer laid out in order, so <code>x.view(...)</code> raises an error. Use <code>x.reshape(...)</code> (copies if needed) or <code>x.contiguous().view(...)</code>.</li>
         <li><b>Wrong <code>dim</code> in a reduction.</b> <code>sum(dim=0)</code> collapses rows; <code>sum(dim=1)</code> collapses columns. Pick the wrong axis and your loss averages over the wrong thing. For a batch you almost always reduce over the feature/class dim, not the batch dim.</li>
         <li><b>Forgetting <code>keepdim=True</code>.</b> A reduction drops the axis, so a later broadcast (e.g. dividing by a row-sum in softmax) breaks or misaligns. Keep the axis as size 1 so it broadcasts back cleanly.</li>
       </ul>`,

    bigIdea:
      `<p>A <b>tensor</b> is just an n-dimensional grid of numbers with a <b>shape</b> (its size along each axis, e.g. <code>(batch, features)</code>).</p>
       <p>Almost everything you do is one of five verbs: apply a function to each number, line two tensors up and combine them, multiply matrices, collapse an axis, or rearrange the grid.</p>
       <p>The whole game is keeping <b>shapes</b> compatible. PyTorch will happily run a mathematically-valid-but-wrong op, so reading shapes is the real skill.</p>`,

    buildup:
      `<p><b>Elementwise.</b> <code>a + b</code>, <code>a * b</code>, <code>torch.exp(a)</code> all act number-by-number and keep the shape. <code>torch.relu(a)</code> is just <code>max(a, 0)</code> elementwise.</p>
       <p><b>Broadcasting (the rule).</b> Line the shapes up by their <i>trailing</i> (rightmost) dims. Two dims are compatible if they are equal, or one of them is 1. A size-1 dim is <i>stretched</i> (repeated) to match. Missing leading dims are treated as 1. So <code>(3,1) + (1,4) → (3,4)</code>: the column repeats across 4 columns, the row repeats down 3 rows.</p>
       <p><b>Matrix multiply.</b> <code>(m,k) @ (k,n) → (m,n)</code> — the inner <code>k</code> must match. <code>torch.bmm</code> (batch matrix multiply) does this for a stack: <code>(B,m,k) @ (B,k,n) → (B,m,n)</code>. <code>matmul</code> also broadcasts leading batch dims.</p>
       <p><b>Reductions.</b> <code>x.sum(dim=1)</code> removes axis 1. Add <code>keepdim=True</code> to leave it as size 1 so it still broadcasts. <code>argmax(dim=-1)</code> returns the <i>index</i> of the max along the last axis — that is your predicted class.</p>
       <p><b>Reshaping.</b> <code>view</code> shares memory and needs a contiguous tensor; <code>reshape</code> may copy. <code>permute</code>/<code>transpose</code> reorder axes. <code>unsqueeze(d)</code> inserts a size-1 axis (handy to set up a broadcast); <code>squeeze</code> removes size-1 axes. <code>flatten</code> merges axes; <code>cat</code> joins along an existing axis, <code>stack</code> adds a new one.</p>`,

    symbols: [
      { sym: "$@$", desc: "matrix multiply (Python's <code>@</code> operator, same as <code>torch.matmul</code>)." },
      { sym: "$*$", desc: "elementwise multiply (number by number, NOT matrix multiply)." },
      { sym: "$\\text{dim}$", desc: "which axis an op runs along; 0 is the first axis, -1 the last." }
    ],

    formula: `$$(m,k)\\;@\\;(k,n)\\;\\rightarrow\\;(m,n)$$`,
    whatItDoes:
      `<p>The inner dimensions must match (<code>k</code> = <code>k</code>); they cancel, and the outer dims survive. This one shape rule is what every linear layer, attention block, and convolution obeys. If two shapes do not line up by this rule (for matmul) or the broadcasting rule (for elementwise), the op is wrong — even when it does not error.</p>`,

    derivation:
      `<p><b>Why broadcasting works without copying.</b> PyTorch does not physically repeat a size-1 axis. It sets the <i>stride</i> (the step in memory) for that axis to 0, so every index along it reads the same underlying value. That is why broadcasting is free — and why it can silently produce a big wrong tensor if the shapes were not what you intended.</p>
       <p><b>Why <code>view</code> can fail.</b> A tensor is a flat block of memory plus a shape and strides. <code>view</code> just hands you a new shape over the <i>same</i> flat block, so the data must already be in contiguous row-major order. After <code>permute</code> the strides are scrambled, the data is no longer contiguous, and <code>view</code> refuses. <code>reshape</code> falls back to copying into a fresh contiguous block when needed.</p>
       <p><b>Why <code>keepdim</code> matters.</b> Softmax needs <code>x - x.max(dim=-1, keepdim=True).values</code> and a divide by <code>sum(dim=-1, keepdim=True)</code>. Keeping the reduced axis at size 1 lets it broadcast back against the original tensor. Drop it and the shapes no longer line up.</p>`,

    example:
      `<p>Take a column <code>a = [[10],[20],[30]]</code> with shape <code>(3,1)</code> and a row <code>b = [[1,2,3,4]]</code> with shape <code>(1,4)</code>.</p>
       <p><code>a + b</code> broadcasts to <code>(3,4)</code>: the column repeats across 4 columns, the row repeats down 3 rows. Entry <code>(i,j)</code> is <code>a[i] + b[j]</code>, e.g. top-left <code>10+1=11</code>, bottom-right <code>30+4=34</code>.</p>
       <p>Now reduce: <code>grid.sum(dim=1, keepdim=True)</code> adds across each row, giving <code>[[50],[90],[130]]</code> with shape <code>(3,1)</code> — still a column, so it can broadcast again. Drop <code>keepdim</code> and you get a flat <code>(3,)</code> instead.</p>`,

    practice: [
      {
        q: `<b>Type this in Colab.</b> Make <code>A = torch.arange(6.).reshape(2, 3)</code> and <code>B = torch.ones(2, 3)</code>. Compute the elementwise product <code>A * B</code> and print its shape. Then make <code>C = torch.ones(3, 2)</code> and compute the matrix product <code>A @ C</code> and print its shape. Predict both shapes before running.`,
        steps: [
          { do: `Use <code>*</code> for elementwise and <code>@</code> for matmul.`, why: `They are different ops: <code>*</code> keeps the shape, <code>@</code> follows the matmul shape rule.` },
          { do: `Apply <code>(2,3) @ (3,2)</code>: the inner 3 cancels.`, why: `Inner dims must match; the outer dims <code>(2,2)</code> survive.` }
        ],
        answer: `<pre><code>A = torch.arange(6.).reshape(2, 3)
B = torch.ones(2, 3)
C = torch.ones(3, 2)
print((A * B).shape)   # torch.Size([2, 3])  elementwise keeps shape
print((A @ C).shape)   # torch.Size([2, 2])  inner 3 cancels</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Broadcast a column against a row. Build <code>col = torch.tensor([[10.],[20.],[30.]])</code> (shape <code>(3,1)</code>) and <code>row = torch.tensor([[1.,2.,3.,4.]])</code> (shape <code>(1,4)</code>), add them, and print the result and its shape. Predict the shape first.`,
        steps: [
          { do: `Add the <code>(3,1)</code> and <code>(1,4)</code> tensors directly.`, why: `Broadcasting stretches each size-1 axis to meet the other operand.` },
          { do: `Print <code>.shape</code> to verify it is <code>(3,4)</code>.`, why: `Cell <code>(i,j) = col[i] + row[j]</code>; printing shape catches a silent mis-broadcast.` }
        ],
        answer: `<pre><code>col = torch.tensor([[10.], [20.], [30.]])
row = torch.tensor([[1., 2., 3., 4.]])
grid = col + row
print(grid.shape)   # torch.Size([3, 4])
print(grid)
# tensor([[11., 12., 13., 14.],
#         [21., 22., 23., 24.],
#         [31., 32., 33., 34.]])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The silent-broadcast pitfall. You meant to add two length-3 vectors, but one is a row and one is a column: add <code>torch.tensor([1., 2., 3.])</code> (shape <code>(3,)</code>) to <code>torch.tensor([[10.],[20.],[30.]])</code> (shape <code>(3,1)</code>). Print the result shape — it is NOT <code>(3,)</code>. Explain in a comment what happened.`,
        steps: [
          { do: `Add the <code>(3,)</code> and <code>(3,1)</code> tensors and print <code>.shape</code>.`, why: `Broadcasting aligns trailing dims, turning this into a <code>(3,3)</code> grid — a wrong answer with no error.` },
          { do: `Note the fix: make both the same shape (e.g. flatten the column).`, why: `Printing shapes is the only way to catch a silent mis-broadcast.` }
        ],
        answer: `<pre><code>v   = torch.tensor([1., 2., 3.])          # (3,)
col = torch.tensor([[10.], [20.], [30.]]) # (3,1)
out = v + col
print(out.shape)   # torch.Size([3, 3])  -- a 3x3 grid, NOT (3,)!
print(out)
# tensor([[11., 12., 13.],
#         [21., 22., 23.],
#         [31., 32., 33.]])
# Fix: align shapes, e.g. v + col.flatten() -> tensor([11., 22., 33.])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Reduce over a chosen axis with and without <code>keepdim</code>. Make <code>g = torch.tensor([[1.,2.,3.,4.],[5.,6.,7.,8.],[9.,10.,11.,12.]])</code>. Print <code>g.sum(dim=1)</code> and its shape, then <code>g.sum(dim=1, keepdim=True)</code> and its shape.`,
        steps: [
          { do: `Sum across columns with <code>dim=1</code>.`, why: `<code>dim</code> is the axis that collapses; <code>dim=1</code> leaves one value per row.` },
          { do: `Add <code>keepdim=True</code> to retain the axis as size 1.`, why: `Keeping it as <code>(3,1)</code> lets the result broadcast back (the softmax-normalize trick).` }
        ],
        answer: `<pre><code>g = torch.tensor([[1.,2.,3.,4.],[5.,6.,7.,8.],[9.,10.,11.,12.]])
print(g.sum(dim=1))                 # tensor([10., 26., 42.])
print(g.sum(dim=1).shape)           # torch.Size([3])
print(g.sum(dim=1, keepdim=True))   # tensor([[10.],[26.],[42.]])
print(g.sum(dim=1, keepdim=True).shape)  # torch.Size([3, 1])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> A row-softmax in three lines. Take <code>g</code> from the previous task. Compute <code>e = torch.exp(g - g.max(dim=1, keepdim=True).values)</code>, then <code>probs = e / e.sum(dim=1, keepdim=True)</code>. Print <code>probs.shape</code> and <code>probs.sum(dim=1)</code> to confirm each row sums to 1.`,
        steps: [
          { do: `Subtract the per-row max with <code>keepdim=True</code> before <code>exp</code>.`, why: `Numerically stabilizes the exponent; <code>keepdim</code> keeps the <code>(3,1)</code> shape so it broadcasts back.` },
          { do: `Divide by the per-row sum (also <code>keepdim=True</code>).`, why: `Normalizes each row to a probability distribution summing to 1.` }
        ],
        answer: `<pre><code>e = torch.exp(g - g.max(dim=1, keepdim=True).values)
probs = e / e.sum(dim=1, keepdim=True)
print(probs.shape)         # torch.Size([3, 4])
print(probs.sum(dim=1))    # tensor([1., 1., 1.])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> A linear layer plus argmax prediction. Make a batch <code>x = torch.randn(4, 5)</code> (seed first) and a weight <code>W = torch.randn(5, 3)</code>. Compute <code>z = x @ W</code>, print <code>z.shape</code>, then <code>pred = z.argmax(dim=-1)</code> and print <code>pred</code> and <code>pred.shape</code>.`,
        steps: [
          { do: `Matmul <code>(4,5) @ (5,3)</code> to get scores <code>(4,3)</code>.`, why: `Every linear layer is a matmul; inner 5 cancels, leaving 3 class scores per example.` },
          { do: `Take <code>argmax(dim=-1)</code> over the class axis.`, why: `It returns the index of the top score per row — the predicted class; reducing <code>dim=0</code> would wrongly collapse the batch.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
x = torch.randn(4, 5)
W = torch.randn(5, 3)
z = x @ W
print(z.shape)              # torch.Size([4, 3])
pred = z.argmax(dim=-1)
print(pred)                # tensor([0, 1, 0, 1])
print(pred.shape)          # torch.Size([4])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The <code>view</code>-vs-<code>reshape</code> pitfall. Make <code>x = torch.arange(24).reshape(2, 3, 4)</code> and <code>xp = x.permute(0, 2, 1)</code>. Try <code>xp.view(-1)</code> in a <code>try/except</code> and print the failure, then show <code>xp.reshape(-1)</code> works and print its shape.`,
        steps: [
          { do: `Call <code>xp.view(-1)</code> on the permuted (non-contiguous) tensor.`, why: `<code>view</code> needs contiguous row-major memory; <code>permute</code> only reorders strides, so it raises.` },
          { do: `Fall back to <code>xp.reshape(-1)</code> (or <code>xp.contiguous().view(-1)</code>).`, why: `<code>reshape</code> copies into a fresh contiguous block when needed.` }
        ],
        answer: `<pre><code>x = torch.arange(24).reshape(2, 3, 4)
xp = x.permute(0, 2, 1)              # (2,4,3), non-contiguous
print(xp.is_contiguous())           # False
try:
    xp.view(-1)
except RuntimeError as err:
    print("view failed:", "not compatible" in str(err))  # view failed: True
print(xp.reshape(-1).shape)         # torch.Size([24])  reshape copies</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Reshape moves: build <code>x = torch.arange(24).reshape(2, 3, 4)</code>, then print the shapes of <code>x.flatten(1)</code>, <code>x.unsqueeze(0)</code>, <code>torch.cat([x, x], dim=0)</code>, and <code>torch.stack([x, x], dim=0)</code>. Predict each before running.`,
        steps: [
          { do: `Use <code>flatten(1)</code> and <code>unsqueeze(0)</code> to merge and insert axes.`, why: `<code>flatten(1)</code> merges axes from dim 1 on; <code>unsqueeze(0)</code> inserts a size-1 batch axis.` },
          { do: `Compare <code>cat</code> (joins an existing axis) with <code>stack</code> (adds a new one).`, why: `<code>cat</code> on dim 0 doubles that axis; <code>stack</code> adds a fresh leading axis of size 2.` }
        ],
        answer: `<pre><code>x = torch.arange(24).reshape(2, 3, 4)
print(x.flatten(1).shape)               # torch.Size([2, 12])
print(x.unsqueeze(0).shape)             # torch.Size([1, 2, 3, 4])
print(torch.cat([x, x], dim=0).shape)   # torch.Size([4, 3, 4])
print(torch.stack([x, x], dim=0).shape) # torch.Size([2, 2, 3, 4])</code></pre>`
      }
    ]
  });

  window.CODE["pt-tensor-ops"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Five demos in one cell: <b>broadcasting</b> a <code>(3,1)</code> column against a <code>(1,4)</code> row, the difference between <code>*</code> (elementwise) and <code>@</code> (matmul), a <b>reduction</b> over a chosen <code>dim</code> (with and without <code>keepdim</code>), and a tour of <b>reshaping</b> ops (<code>view</code> / <code>reshape</code> / <code>permute</code> / <code>unsqueeze</code>) with every shape printed. Paste into Colab and run — torch is preinstalled. Watch the printed shapes; that is where the bugs live.</p>`,
    code: `import torch

torch.manual_seed(0)

# ---- 1. BROADCASTING: (3,1) + (1,4) -> (3,4) ----
col = torch.tensor([[10.], [20.], [30.]])   # shape (3,1) -- a column
row = torch.tensor([[1., 2., 3., 4.]])      # shape (1,4) -- a row
grid = col + row                            # broadcasts: col repeats across cols, row down rows
print("col", tuple(col.shape), " row", tuple(row.shape), " grid", tuple(grid.shape))
print(grid)                                 # top-left 11, bottom-right 34

# ---- 2. ELEMENTWISE * vs MATRIX MULTIPLY @ ----
A = torch.arange(6.).reshape(2, 3)          # (2,3)
B = torch.ones(2, 3)                        # (2,3)
print("A * B (elementwise) ->", tuple((A * B).shape))   # (2,3): number-by-number
C = torch.ones(3, 2)                        # (3,2)
print("A @ C (matmul)      ->", tuple((A @ C).shape))   # (2,2): inner 3 cancels
# torch.matmul is the same as @; bmm does it per batch element:
batch = torch.randn(8, 2, 3)               # 8 matrices of (2,3)
w     = torch.randn(8, 3, 5)               # 8 matrices of (3,5)
print("bmm batch           ->", tuple(torch.bmm(batch, w).shape))  # (8,2,5)

# ---- 3. REDUCTION over a chosen dim, with / without keepdim ----
row_sum      = grid.sum(dim=1)                  # collapse columns -> (3,)
row_sum_keep = grid.sum(dim=1, keepdim=True)    # keep axis as 1 -> (3,1)
print("sum dim=1          ->", tuple(row_sum.shape), row_sum.tolist())
print("sum dim=1 keepdim  ->", tuple(row_sum_keep.shape))
# keepdim lets it broadcast back (this is exactly the softmax-normalize trick):
normalized = grid / row_sum_keep                # (3,4) / (3,1) -> (3,4), rows sum to 1
print("each row sums to 1 ->", normalized.sum(dim=1).tolist())
print("argmax over dim=1  ->", grid.argmax(dim=1).tolist())  # index of max per row

# ---- 4. RESHAPING: view / reshape / permute / unsqueeze ----
x = torch.arange(24).reshape(2, 3, 4)           # (2,3,4)
print("x                  ->", tuple(x.shape))
print("x.view(2, 12)      ->", tuple(x.view(2, 12).shape))      # contiguous: view ok
xp = x.permute(0, 2, 1)                          # (2,4,3): now non-contiguous
print("x.permute(0,2,1)   ->", tuple(xp.shape), "contiguous?", xp.is_contiguous())
try:
    xp.view(-1)                                  # fails: non-contiguous
except RuntimeError as e:
    print("xp.view(-1) FAILED -> use reshape/contiguous")
print("xp.reshape(-1)     ->", tuple(xp.reshape(-1).shape))     # (24,): reshape copies
print("x.flatten(1)       ->", tuple(x.flatten(1).shape))       # (2,12): merge last two axes
print("x.unsqueeze(0)     ->", tuple(x.unsqueeze(0).shape))     # (1,2,3,4): add batch axis
print("cat dim=0          ->", tuple(torch.cat([x, x], dim=0).shape))   # (4,3,4)
print("stack dim=0        ->", tuple(torch.stack([x, x], dim=0).shape)) # (2,2,3,4) new axis`
  };

  window.CODEVIZ["pt-tensor-ops"] = {
    question: "How do you READ a shape diagram — and how do you spot a broadcast that silently produced the WRONG grid?",
    charts: [
      {
        type: "heatmap",
        title: "Intended broadcast: (3,1) + (1,4) -> (3,4), cell = col[i] + row[j]",
        rows: ["col=10", "col=20", "col=30"],
        cols: ["row=1", "row=2", "row=3", "row=4"],
        matrix: [
          [11, 12, 13, 14],
          [21, 22, 23, 24],
          [31, 32, 33, 34]
        ],
        showVals: true,
        interpret: "<b>Read it as a grid of results.</b> Rows are the column tensor [10,20,30] (size-1 axis stretched across 4 columns); columns are the row tensor [1,2,3,4] (stretched down 3 rows). Each cell is col[i]+row[j], so the value climbs left-to-right and top-to-bottom: top-left 11, bottom-right 34. <b>This is the healthy case</b> — a 3x4 block where you genuinely wanted a 3x4 block. Real numbers (numpy broadcasting matches torch exactly)."
      },
      {
        type: "heatmap",
        title: "Silent mis-broadcast: (3,) + (3,1) -> (3,3), NOT the (3,) you meant",
        rows: ["col=10", "col=20", "col=30"],
        cols: ["v=1", "v=2", "v=3"],
        matrix: [
          [11, 12, 13],
          [21, 22, 23],
          [31, 32, 33]
        ],
        showVals: true,
        interpret: "<b>This is the failure mode to recognise.</b> You meant to add two length-3 vectors elementwise and expected a flat (3,). But a (3,) row aligns by trailing dims against a (3,1) column, so each stretches and you get a 3x3 grid with NO error. <b>Tell-tale sign:</b> the output is square and bigger than either input. If a result is a grid when you expected a line, you mis-broadcast. Fix: flatten the column so both are (3,). Real numbers."
      },
      {
        type: "bars",
        title: "Shape after each op: * keeps shape, @ cancels the inner dim",
        labels: ["(2,3)*(2,3)", "(2,3)@(3,2)", "(8,2,3) bmm (8,3,5)"],
        values: [6, 4, 80],
        valueLabels: ["(2,3) = 6", "(2,2) = 4", "(8,2,5) = 80"],
        colors: ["#7ee787", "#4ea1ff", "#c89bff"],
        interpret: "<b>Each bar is one operation; height is the element count of its output shape (printed on the bar).</b> Elementwise * (green) keeps the input shape (2,3), 6 elements. Matmul @ (blue) follows (m,k)@(k,n)->(m,n): the inner 3 cancels, leaving (2,2), 4 elements. Batched bmm (purple) does one matmul per batch element: (8,2,3) bmm (8,3,5) -> (8,2,5), 80 elements. <b>Read it as a shape check:</b> if you confuse * and @, the output shape and element count change — that mismatch is your bug. Real computed shapes."
      }
    ],
    caption: "",
    code: `import numpy as np

col = np.array([[10], [20], [30]])   # shape (3,1) -- a column
row = np.array([[1, 2, 3, 4]])       # shape (1,4) -- a row

grid = col + row                     # broadcasts to (3,4); matches torch exactly
print("grid shape", grid.shape)
print(grid)
# [[11 12 13 14]
#  [21 22 23 24]
#  [31 32 33 34]]

row_sum = grid.sum(axis=1)           # reduce over columns -> (3,)
print("row sums", row_sum)           # [ 50  90 130]

# row_sum keeping the axis (the softmax-normalize trick):
row_sum_keep = grid.sum(axis=1, keepdims=True)  # shape (3,1)
print("keepdims shape", row_sum_keep.shape)     # (3, 1)

# --- the two charts ---
import matplotlib.pyplot as plt
fig, ax = plt.subplots(1, 2, figsize=(10, 4))
im = ax[0].imshow(grid, cmap="viridis")
ax[0].set_xticks(range(4)); ax[0].set_xticklabels([1, 2, 3, 4])
ax[0].set_yticks(range(3)); ax[0].set_yticklabels([10, 20, 30])
ax[0].set_title("(3,1)+(1,4) -> (3,4)")
for i in range(3):
    for j in range(4):
        ax[0].text(j, i, grid[i, j], ha="center", va="center", color="w")
ax[1].bar(["row 0", "row 1", "row 2"], row_sum,
          color=["#4ea1ff", "#7ee787", "#c89bff"])
ax[1].set_title("grid.sum(dim=1) = [50, 90, 130]")
plt.show()`
  };
})();
