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
    module: "PyTorch (a complete course)",
    prereqs: ["fnd-dot", "fnd-matrix", "dl-forward-prop"],

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
        q: `You have <code>x</code> of shape <code>(32, 784)</code> (a batch of 32 flattened images) and a weight <code>W</code> of shape <code>(784, 10)</code>. Write the linear layer output and give its shape.`,
        steps: [
          { do: `Use matmul, not elementwise: <code>z = x @ W</code>.`, why: `A linear layer is a matrix multiply; <code>*</code> would try elementwise and fail (shapes differ).` },
          { do: `Apply the matmul shape rule: <code>(32,784) @ (784,10)</code>, inner 784 matches and cancels.`, why: `Inner dims must match; outer dims survive.` }
        ],
        answer: `<code>z = x @ W</code> has shape <code>(32, 10)</code> — 10 class scores for each of the 32 images.`
      },
      {
        q: `Those scores <code>z</code> are <code>(32, 10)</code>. Turn them into a predicted class per image.`,
        steps: [
          { do: `Reduce over the class axis (the last one): <code>pred = z.argmax(dim=-1)</code>.`, why: `<code>argmax</code> returns the index of the largest score; the class axis is dim -1, not the batch axis.` }
        ],
        answer: `<code>pred = z.argmax(dim=-1)</code> has shape <code>(32,)</code> — one integer class label per image. Reducing over <code>dim=0</code> by mistake would collapse the batch, which is wrong.`
      },
      {
        q: `You ran <code>y = x.permute(0, 2, 1)</code> and then <code>y.view(-1)</code> raised an error. Why, and what fixes it?`,
        steps: [
          { do: `Recall <code>permute</code> reorders axes by changing strides, leaving the tensor non-contiguous.`, why: `<code>view</code> needs contiguous row-major memory; permuted data is not.` },
          { do: `Use <code>y.reshape(-1)</code> or <code>y.contiguous().view(-1)</code>.`, why: `<code>reshape</code> copies when needed; <code>.contiguous()</code> makes a fresh ordered copy first.` }
        ],
        answer: `<code>view</code> fails on the non-contiguous permuted tensor. Use <code>y.reshape(-1)</code> (or <code>y.contiguous().view(-1)</code>).`
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
    question: "When a (3,1) column broadcasts against a (1,4) row, what (3,4) grid comes out — and what do the per-row sums look like?",
    charts: [
      {
        type: "heatmap",
        title: "Broadcasting (3,1) + (1,4) -> (3,4): every cell is col[i] + row[j]",
        rows: ["col=10", "col=20", "col=30"],
        cols: ["row=1", "row=2", "row=3", "row=4"],
        matrix: [
          [11, 12, 13, 14],
          [21, 22, 23, 24],
          [31, 32, 33, 34]
        ],
        showVals: true
      },
      {
        type: "bars",
        title: "Reduction: grid.sum(dim=1) — add across each row of the grid",
        labels: ["row 0 (10+...)", "row 1 (20+...)", "row 2 (30+...)"],
        values: [50, 90, 130],
        valueLabels: ["50", "90", "130"],
        colors: ["#4ea1ff", "#7ee787", "#c89bff"]
      }
    ],
    caption: "Real numbers (numpy broadcasting matches torch exactly). The column [10,20,30] repeats across 4 columns and the row [1,2,3,4] repeats down 3 rows, so cell (i,j)=col[i]+row[j]: top-left 11, bottom-right 34. Summing each row over dim=1 gives [50, 90, 130] — the bars. With keepdim=True that stays shape (3,1) and can broadcast back; without it, it collapses to a flat (3,).",
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
