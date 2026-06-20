/* =====================================================================
   MODULE 5 — LINEAR ALGEBRA (DEEP DIVE).
   Builds on Foundations (fnd-*). Same style as 00-foundations.js:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a real derivation/proof ending in ∎
     - a worked example with real numbers
     - a bespoke canvas demo that renders on load
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Linear Algebra (deep dive)";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* Shared theme reader for the bespoke demos below. Returns CSS-variable
   colors with safe fallbacks so the demos are theme-aware. */
function C() {
  var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
  var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
  return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
}

/* ================================================================ 1 */
L({
  id: "la-matmul",
  title: "Matrix × matrix",
  tagline: "Every output entry is one row dotted with one column. Step through it.",
  prereqs: ["fnd-dot", "fnd-matrix", "fnd-matvec"],
  bigIdea:
    `<p>Multiplying two matrices is just many dot products, organized.</p>
     <p>To get the number in row $i$, column $j$ of the answer: take row $i$ of the left matrix, dot it with column $j$ of the right matrix.</p>
     <p>Do that for every (row, column) pair and you have filled in the whole product. One matrix multiply is how a neural-network layer transforms a whole batch at once.</p>`,
  buildup:
    `<p>You already know matrix × vector: one dot product per row.</p>
     <p>A matrix is just several columns side by side. So matrix × matrix is matrix × vector, repeated once for each column of the right-hand matrix.</p>`,
  symbols: [
    { sym: "$A$", desc: "the left matrix, with $m$ rows and $n$ columns." },
    { sym: "$B$", desc: "the right matrix, with $n$ rows and $p$ columns. Its row count must equal $A$'s column count." },
    { sym: "$AB$", desc: "the product, a matrix with $m$ rows and $p$ columns." },
    { sym: "$(AB)_{ij}$", desc: "the number in row $i$, column $j$ of the product." },
    { sym: "$A_{ik}$", desc: "row $i$, column $k$ of $A$." },
    { sym: "$B_{kj}$", desc: "row $k$, column $j$ of $B$." },
    { sym: "$\\sum_k$", desc: "add up over the shared index $k$, from $1$ to $n$." }
  ],
  formula: `$$ (AB)_{ij} = \\sum_{k=1}^{n} A_{ik} B_{kj}, \\qquad (m\\times n)(n\\times p) = (m\\times p) $$`,
  whatItDoes:
    `<p>The shared index $k$ walks across row $i$ of $A$ and down column $j$ of $B$ at the same time, multiplying the pairs and summing. That is exactly a dot product.</p>
     <p>Shape rule: write the shapes next to each other, $(m\\times n)(n\\times p)$. The inner two numbers ($n$ and $n$) must match and cancel; the outer two ($m$ and $p$) give the answer's shape.</p>`,
  derivation:
    `<p><b>Where it comes from.</b> Matrix multiplication is <i>defined</i> so that applying $A$ then $B$ is the same as applying one combined matrix. We derive the entry formula from that requirement.</p>
     <ul class="steps">
       <li>A matrix acts on a vector: $(Bx)_k = \\sum_j B_{kj} x_j$ (row $k$ of $B$ dotted with $x$).</li>
       <li>Now apply $A$ to that result: $(A(Bx))_i = \\sum_k A_{ik} (Bx)_k = \\sum_k A_{ik} \\sum_j B_{kj} x_j$.</li>
       <li>Swap the order of the two sums (finite sums always allow this): $(A(Bx))_i = \\sum_j \\left(\\sum_k A_{ik} B_{kj}\\right) x_j$.</li>
       <li>We want a single matrix $C$ with $(Cx)_i = \\sum_j C_{ij} x_j$ doing the same job. Matching the two expressions forces $C_{ij} = \\sum_k A_{ik} B_{kj}$. That is the definition of $(AB)_{ij}$. ∎</li>
     </ul>
     <p>So the formula is not arbitrary: it is the only rule that makes "do $A$ after $B$" collapse into one matrix.</p>`,
  example:
    `<p>Let $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ and $B=\\begin{bmatrix}5&6\\\\7&8\\end{bmatrix}$. Both are $2\\times2$, so $AB$ is $2\\times2$.</p>
     <ul class="steps">
       <li>$(AB)_{11}$ = row 1 of $A$ $\\cdot$ column 1 of $B$ $= 1\\cdot5 + 2\\cdot7 = 5+14 = 19$.</li>
       <li>$(AB)_{12}$ = row 1 $\\cdot$ column 2 $= 1\\cdot6 + 2\\cdot8 = 6+16 = 22$.</li>
       <li>$(AB)_{21}$ = row 2 $\\cdot$ column 1 $= 3\\cdot5 + 4\\cdot7 = 15+28 = 43$.</li>
       <li>$(AB)_{22}$ = row 2 $\\cdot$ column 2 $= 3\\cdot6 + 4\\cdot8 = 18+32 = 50$.</li>
       <li>So $AB=\\begin{bmatrix}19&22\\\\43&50\\end{bmatrix}$.</li>
     </ul>
     <p>Order matters: $BA=\\begin{bmatrix}23&34\\\\31&46\\end{bmatrix}$, a different matrix. Matrix multiplication is not commutative.</p>`,
  application:
    `<p>A neural-network layer computes $XW$: $X$ is a batch of examples (rows), $W$ is the weight matrix. One matrix multiply scores the whole batch. GPUs are built to do exactly this, which is why deep learning runs on them.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var A = [[1, 2], [3, 4]], B = [[5, 6], [7, 8]];
    var P = [[19, 22], [43, 50]];
    // step from 0..4: each step fills one output cell (i,j) in reading order
    var order = [[0, 0], [0, 1], [1, 0], [1, 1]];
    var step = 0;
    function cellBox(x, y, w, h, txt, fill, txtCol, bord) {
      ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = bord; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = txtCol; ctx.font = "17px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(txt, x + w / 2, y + h / 2);
    }
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      var cw = 48, ch = 48, gap = 4;
      var active = (step >= 1) ? order[step - 1] : null;
      var ai = active ? active[0] : -1, aj = active ? active[1] : -1;
      var Ax = 40, Ay = 90, Bx = 250, By = 20, Rx = 470, Ry = 90;
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText("A", Ax + cw + gap / 2, Ay - 12);
      ctx.fillText("B", Bx + cw + gap / 2, By - 12);
      ctx.fillText("AB", Rx + cw + gap / 2, Ry - 12);
      // A: highlight active row
      for (var r = 0; r < 2; r++) for (var k = 0; k < 2; k++) {
        var hi = (r === ai);
        cellBox(Ax + k * (cw + gap), Ay + r * (ch + gap), cw, ch, String(A[r][k]),
          hi ? (c.accent + "33") : c.panel, c.ink, hi ? c.accent : c.border);
      }
      // B: highlight active column
      for (var br = 0; br < 2; br++) for (var bc = 0; bc < 2; bc++) {
        var hib = (bc === aj);
        cellBox(Bx + bc * (cw + gap), By + br * (ch + gap), cw, ch, String(B[br][bc]),
          hib ? (c.purple + "33") : c.panel, c.ink, hib ? c.purple : c.border);
      }
      // result
      for (var rr = 0; rr < 2; rr++) for (var rc = 0; rc < 2; rc++) {
        var done = false;
        for (var s = 0; s < step; s++) if (order[s][0] === rr && order[s][1] === rc) done = true;
        var isAct = (rr === ai && rc === aj);
        cellBox(Rx + rc * (cw + gap), Ry + rr * (ch + gap), cw, ch, done ? String(P[rr][rc]) : "?",
          done ? (c.accent2 + "33") : c.panel, done ? c.ink : c.dim, isAct ? c.accent2 : c.border);
      }
      // explanation
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "14px sans-serif"; ctx.fillStyle = c.ink;
      var ey = 260;
      if (step === 0) {
        ctx.fillText("Click the button to fill (AB) one cell at a time.", 40, ey);
      } else {
        ctx.fillText("(AB)" + (ai + 1) + (aj + 1) + " = row " + (ai + 1) + " of A  ·  col " + (aj + 1) + " of B = " +
          A[ai][0] + "·" + B[0][aj] + " + " + A[ai][1] + "·" + B[1][aj] + " = " + P[ai][aj], 40, ey);
      }
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("Blue row of A, purple column of B, meet at the green output cell.", 40, ey + 22);
    }
    var bar = document.createElement("div"); bar.style.margin = "8px 0";
    var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
    var next = document.createElement("button"); next.style.cssText = BTN; next.textContent = "Fill next cell ▸";
    var reset = document.createElement("button"); reset.style.cssText = BTN; reset.textContent = "Reset";
    next.addEventListener("click", function () { step = (step >= 4) ? 4 : step + 1; draw(); });
    reset.addEventListener("click", function () { step = 0; draw(); });
    bar.appendChild(next); bar.appendChild(reset); host.appendChild(bar);
    draw();
  },
  quiz: {
    q: `If $A$ is $4\\times 2$ and $B$ is $2\\times 3$, what shape is $AB$? Can you compute $BA$?`,
    a: `<p>$AB$ is $4\\times 3$ (inner 2's cancel, outer 4 and 3 remain). $BA$ would need $B$'s columns (3) to match $A$'s rows (4) — they do not, so $BA$ is undefined.</p>`
  }
});

/* ================================================================ 2 */
L({
  id: "la-transpose",
  title: "Transpose",
  tagline: "Flip a matrix across its diagonal: rows become columns.",
  prereqs: ["fnd-matrix", "la-matmul"],
  bigIdea:
    `<p>The <b>transpose</b> of a matrix flips it across its main diagonal.</p>
     <p>Row 1 becomes column 1, row 2 becomes column 2, and so on. The entry at $(i,j)$ moves to $(j,i)$.</p>
     <p>Transpose shows up everywhere: the dot product $x^\\top y$, turning weights to match data, and the famous rule $(AB)^\\top = B^\\top A^\\top$ that reverses order.</p>`,
  buildup:
    `<p>A matrix has a shape $m\\times n$. Sometimes the multiply you want needs an $n\\times m$ instead.</p>
     <p>Transpose gives you that for free: it relabels every entry by swapping its two indices. No arithmetic, just rearranging.</p>`,
  symbols: [
    { sym: "$A$", desc: "a matrix with $m$ rows and $n$ columns." },
    { sym: "$A^\\top$", desc: "the transpose of $A$: an $n\\times m$ matrix. Read 'A transpose'." },
    { sym: "$(A^\\top)_{ij}$", desc: "the entry of the transpose in row $i$, column $j$." },
    { sym: "$A_{ji}$", desc: "the entry of the original in row $j$, column $i$ (the indices swapped)." },
    { sym: "$B$", desc: "another matrix, used for the product rule $(AB)^\\top = B^\\top A^\\top$." }
  ],
  formula: `$$ (A^\\top)_{ij} = A_{ji}, \\qquad (AB)^\\top = B^\\top A^\\top $$`,
  whatItDoes:
    `<p>To read entry $(i,j)$ of the transpose, go to entry $(j,i)$ of the original. Just swap the two numbers.</p>
     <p>The product rule says: transposing a product reverses the order. Transpose $A$ then $B$, but write $B^\\top$ first.</p>`,
  derivation:
    `<p><b>Where the reversal rule comes from.</b> We prove $(AB)^\\top = B^\\top A^\\top$ entry by entry.</p>
     <ul class="steps">
       <li>By the definition of transpose, $\\big((AB)^\\top\\big)_{ij} = (AB)_{ji}$.</li>
       <li>By the definition of the product, $(AB)_{ji} = \\sum_k A_{jk} B_{ki}$.</li>
       <li>Rewrite each factor using transposes: $A_{jk} = (A^\\top)_{kj}$ and $B_{ki} = (B^\\top)_{ik}$.</li>
       <li>Substitute: $\\sum_k (A^\\top)_{kj} (B^\\top)_{ik} = \\sum_k (B^\\top)_{ik} (A^\\top)_{kj}$ (real numbers commute, so reorder the two factors).</li>
       <li>That last sum is exactly the product rule with $B^\\top$ on the left and $A^\\top$ on the right: $(B^\\top A^\\top)_{ij}$.</li>
       <li>So $\\big((AB)^\\top\\big)_{ij} = (B^\\top A^\\top)_{ij}$ for every $i,j$, hence $(AB)^\\top = B^\\top A^\\top$. ∎</li>
     </ul>
     <p>Intuition: $A$ acts last, so after transposing it must act first. The order flips, like undoing socks then shoes.</p>`,
  example:
    `<p>Let $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\end{bmatrix}$ (shape $2\\times3$).</p>
     <ul class="steps">
       <li>Turn row 1 $[1,2,3]$ into column 1, and row 2 $[4,5,6]$ into column 2.</li>
       <li>$A^\\top=\\begin{bmatrix}1&4\\\\2&5\\\\3&6\\end{bmatrix}$ (shape $3\\times2$).</li>
       <li>Check one entry: $A_{1,3}=3$ moved to $(A^\\top)_{3,1}=3$. Indices swapped. ✔</li>
     </ul>
     <p>A symmetric matrix is one where nothing moves: $A^\\top = A$, so $A_{ij}=A_{ji}$ already.</p>`,
  application:
    `<p>The dot product is written $x^\\top y$ because laying $x$ on its side ($1\\times n$) lets it multiply the column $y$ ($n\\times 1$) into a single number. Backpropagation is full of transposes: the gradient flowing back through a layer $W$ uses $W^\\top$.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var A = [[1, 2, 3], [4, 5, 6]];
    var highlight = false; // toggle: emphasize the (i,j) -> (j,i) correspondence
    var cw = 46, ch = 46, gap = 8;
    // draw a clean fixed grid of non-overlapping squares; cell(r,k) holds value val(r,k)
    function grid(ox, oy, rows, cols, val, diagFn) {
      for (var r = 0; r < rows; r++) for (var k = 0; k < cols; k++) {
        var x = ox + k * (cw + gap), y = oy + r * (ch + gap);
        var c = C();
        var onDiag = diagFn(r, k);
        ctx.fillStyle = onDiag ? (c.warn + "33") : c.panel;
        ctx.fillRect(x, y, cw, ch);
        ctx.strokeStyle = onDiag ? c.warn : c.border; ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, cw, ch);
        ctx.fillStyle = c.ink; ctx.font = "17px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(val(r, k)), x + cw / 2, y + ch / 2);
      }
    }
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      // A on the left (2 rows x 3 cols), Aᵀ on the right (3 rows x 2 cols), on fixed grids
      var axA = 70, ayA = 70;
      var axT = 400, ayT = 70;
      ctx.fillText("A  (2 rows × 3 cols)", axA, ayA - 16);
      ctx.fillText("Aᵀ  (3 rows × 2 cols)", axT, ayT - 16);
      grid(axA, ayA, 2, 3, function (r, k) { return A[r][k]; }, function (r, k) { return r === k; });
      grid(axT, ayT, 3, 2, function (r, k) { return A[k][r]; }, function (r, k) { return r === k; });
      // arrow between the two grids
      ctx.strokeStyle = c.accent; ctx.fillStyle = c.accent; ctx.lineWidth = 2;
      var amid = (axA + 3 * (cw + gap)) + 14, ay = ayA + (ch + gap);
      ctx.beginPath(); ctx.moveTo(amid, ay); ctx.lineTo(axT - 22, ay); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(axT - 22, ay); ctx.lineTo(axT - 30, ay - 5); ctx.lineTo(axT - 30, ay + 5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("transpose", (amid + axT - 26) / 2, ay - 12);
      ctx.textAlign = "left";
      ctx.fillText("Diagonal cells (orange) stay put. Every other cell swaps (i,j) → (j,i).", axA, ayA + 3 * (ch + gap) + 24);
    }
    var bar = document.createElement("div"); bar.style.margin = "8px 0";
    var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
    var flip = document.createElement("button"); flip.style.cssText = BTN; flip.textContent = "Show A and Aᵀ ⤢";
    flip.addEventListener("click", function () { highlight = !highlight; draw(); });
    bar.appendChild(flip); host.appendChild(bar);
    draw();
  },
  quiz: {
    q: `If $A$ is $3\\times 5$, what shape is $A^\\top$? And what is $(A^\\top)^\\top$?`,
    a: `<p>$A^\\top$ is $5\\times 3$ (rows and columns swap). Transposing twice returns the original: $(A^\\top)^\\top = A$, back to $3\\times 5$.</p>`
  }
});

/* ================================================================ 3 */
L({
  id: "la-identity-diagonal",
  title: "Identity & diagonal matrices",
  tagline: "The number 1 of matrices, and matrices that just scale each axis.",
  prereqs: ["la-matmul", "fnd-matvec"],
  bigIdea:
    `<p>The <b>identity matrix</b> $I$ has 1's down the diagonal and 0's everywhere else. Multiplying by it changes nothing: $AI = A$ and $Ix = x$.</p>
     <p>A <b>diagonal matrix</b> $D$ also has zeros off the diagonal, but any numbers on it. Multiplying a vector by $D$ scales each coordinate independently — stretch axis 1 by $d_1$, axis 2 by $d_2$, and so on.</p>
     <p>These are the simplest matrices, and most deep results (eigen, SVD) work by turning a hard matrix into a diagonal one.</p>`,
  buildup:
    `<p>Ordinary numbers have a special value, $1$, that leaves everything unchanged: $1\\cdot a = a$.</p>
     <p>Matrices need their own "1". It is $I$: the matrix that does nothing. And a diagonal matrix is the next-simplest thing — it acts on each axis separately, with no mixing.</p>`,
  symbols: [
    { sym: "$I$", desc: "the identity matrix: 1's on the diagonal, 0's elsewhere. $I_n$ if the size $n$ matters." },
    { sym: "$I_{ij}$", desc: "entry $(i,j)$ of the identity: it equals 1 when $i=j$ and 0 otherwise." },
    { sym: "$\\delta_{ij}$", desc: "the Kronecker delta: a shorthand that is 1 when $i=j$, else 0. So $I_{ij}=\\delta_{ij}$." },
    { sym: "$D$", desc: "a diagonal matrix; off-diagonal entries are all 0." },
    { sym: "$d_i$", desc: "the $i$-th diagonal entry of $D$, i.e. $D_{ii}$. It scales the $i$-th coordinate." },
    { sym: "$x$", desc: "a vector being scaled; $(Dx)_i = d_i x_i$." }
  ],
  formula: `$$ I_{ij} = \\delta_{ij} = \\begin{cases}1 & i=j\\\\ 0 & i\\neq j\\end{cases}, \\qquad AI = IA = A, \\qquad (Dx)_i = d_i\\, x_i $$`,
  whatItDoes:
    `<p>$I$ leaves any matrix or vector untouched. It is the "do nothing" transform.</p>
     <p>$D$ stretches each axis on its own: coordinate $i$ gets multiplied by $d_i$. No coordinate leaks into another, because the off-diagonal entries are zero.</p>`,
  derivation:
    `<p><b>Why $AI=A$.</b> We show it from the entry formula for matrix products.</p>
     <ul class="steps">
       <li>$(AI)_{ij} = \\sum_k A_{ik} I_{kj}$ by the product rule.</li>
       <li>But $I_{kj}=\\delta_{kj}$ is zero for every $k$ except $k=j$, where it is 1.</li>
       <li>So the whole sum collapses to the single surviving term $A_{ij}\\cdot 1 = A_{ij}$.</li>
       <li>Thus $(AI)_{ij}=A_{ij}$ for all $i,j$, meaning $AI=A$. The same argument with $I$ on the left gives $IA=A$. ∎</li>
     </ul>
     <p><b>Why $D$ scales each axis.</b> $(Dx)_i = \\sum_k D_{ik} x_k$. Every $D_{ik}$ with $k\\neq i$ is 0, so only $k=i$ survives: $(Dx)_i = D_{ii} x_i = d_i x_i$. Each coordinate is scaled independently. ∎</p>`,
  example:
    `<p>Let $D=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$ and $x=\\begin{bmatrix}4\\\\5\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>First coordinate: $d_1 x_1 = 2\\cdot4 = 8$.</li>
       <li>Second coordinate: $d_2 x_2 = 3\\cdot5 = 15$.</li>
       <li>So $Dx=\\begin{bmatrix}8\\\\15\\end{bmatrix}$: the $x$-axis doubled, the $y$-axis tripled.</li>
       <li>With $I=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$ instead: $Ix=\\begin{bmatrix}4\\\\5\\end{bmatrix}=x$. Nothing changes.</li>
     </ul>`,
  application:
    `<p>Scaling features (normalization) is multiplying by a diagonal matrix. Regularizers add $\\lambda I$ to a matrix to keep it invertible (Ridge regression: $(X^\\top X + \\lambda I)^{-1}$). Batch-norm scale parameters are a diagonal $D$ applied per feature.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 560; cv.height = 340; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var d1 = 2, d2 = 1; // diagonal entries
    var rng = 4, P = 28, cx = 280, cy = 175, sc = (160 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }
    // a unit square's corners
    var sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(P, cy); ctx.lineTo(cv.width - P, cy);
      ctx.moveTo(cx, P); ctx.lineTo(cx, cy + (160 - P)); ctx.stroke();
      // original unit square (dashed)
      ctx.strokeStyle = c.dim; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (var i = 0; i <= 4; i++) { var p = sq[i % 4]; if (i === 0) ctx.moveTo(px(p[0]), py(p[1])); else ctx.lineTo(px(p[0]), py(p[1])); }
      ctx.stroke(); ctx.setLineDash([]);
      // scaled square
      ctx.strokeStyle = c.accent; ctx.fillStyle = c.accent + "22"; ctx.lineWidth = 2;
      ctx.beginPath();
      for (var j = 0; j <= 4; j++) { var q = sq[j % 4]; var X = q[0] * d1, Y = q[1] * d2; if (j === 0) ctx.moveTo(px(X), py(Y)); else ctx.lineTo(px(X), py(Y)); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // axis stretch markers
      ctx.fillStyle = c.warn; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText("× " + d1, px(d1 / 2), py(0) + 18);
      // y-axis stretch label: keep horizontal and clear of the axis (to the left of it)
      ctx.fillStyle = c.purple; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText("× " + d2, px(0) - 10, py(d2 / 2));
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      // readout
      ctx.textAlign = "left"; ctx.fillStyle = c.ink; ctx.font = "14px sans-serif";
      ctx.fillText("D = [[" + d1 + ", 0], [0, " + d2 + "]]   (dashed = original unit square)", 16, cv.height - 14);
    }
    function slider(label, init, set) {
      var wrap = document.createElement("div"); wrap.style.margin = "4px 0"; wrap.style.fontSize = "13px"; wrap.style.color = "var(--ink)";
      var lab = document.createElement("span"); lab.textContent = label + " "; wrap.appendChild(lab);
      var s = document.createElement("input"); s.type = "range"; s.min = "0"; s.max = "4"; s.step = "1"; s.value = String(init);
      var out = document.createElement("span"); out.textContent = " = " + init; out.style.color = "var(--accent)";
      s.addEventListener("input", function () { set(parseFloat(s.value)); out.textContent = " = " + s.value; draw(); });
      wrap.appendChild(s); wrap.appendChild(out); host.appendChild(wrap);
    }
    slider("d₁ (x-stretch)", d1, function (v) { d1 = v; });
    slider("d₂ (y-stretch)", d2, function (v) { d2 = v; });
    draw();
  },
  quiz: {
    q: `What does $D=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$ do to a vector? What is special about a diagonal matrix whose entries are all the same value $c$?`,
    a: `<p>That $D$ is the identity $I$ — it leaves every vector unchanged. A diagonal matrix with all entries $c$ is $cI$; it scales every vector by $c$ (a uniform zoom), changing size but never direction.</p>`
  }
});

/* ================================================================ 4 */
L({
  id: "la-inverse",
  title: "Matrix inverse",
  tagline: "The matrix that undoes another matrix. $A$ maps a shape; $A^{-1}$ maps it back.",
  prereqs: ["la-matmul", "la-identity-diagonal"],
  bigIdea:
    `<p>The <b>inverse</b> $A^{-1}$ is the matrix that undoes $A$. Apply $A$, then $A^{-1}$, and you are back where you started: $A^{-1}A = I$.</p>
     <p>Only square matrices can have an inverse, and only if they do not collapse space (that is the determinant from the next lesson).</p>
     <p>The inverse is how we "solve" $Ax=b$ in closed form: $x = A^{-1}b$. It is the matrix version of dividing.</p>`,
  buildup:
    `<p>With numbers, to undo "multiply by 5" you "multiply by $1/5$". The product $5\\cdot\\tfrac15 = 1$.</p>
     <p>Matrices need the same idea, but $1$ becomes the identity $I$. The undo-matrix is $A^{-1}$, defined by $A^{-1}A=I$.</p>`,
  symbols: [
    { sym: "$A$", desc: "a square matrix ($n\\times n$)." },
    { sym: "$A^{-1}$", desc: "the inverse of $A$: the matrix with $A^{-1}A = AA^{-1} = I$. Read 'A inverse'." },
    { sym: "$I$", desc: "the identity matrix (the 'do nothing' matrix from the last lesson)." },
    { sym: "$\\det A$", desc: "the determinant of $A$, a single number. If it is 0, no inverse exists." },
    { sym: "$a,b,c,d$", desc: "the four entries of a $2\\times2$ matrix $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$." }
  ],
  formula: `$$ A A^{-1} = A^{-1} A = I, \\qquad \\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}^{-1} = \\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix} $$`,
  whatItDoes:
    `<p>Multiplying by $A^{-1}$ reverses whatever $A$ did. If $A$ rotated and stretched some points, $A^{-1}$ rotates and stretches them straight back.</p>
     <p>The $2\\times2$ recipe: swap $a$ and $d$, negate $b$ and $c$, then divide everything by $ad-bc$. If $ad-bc=0$ you would divide by zero — that matrix has no inverse.</p>`,
  derivation:
    `<p><b>Where the $2\\times2$ formula comes from.</b> We want $M$ with $AM = I$. Guess the right structure and verify.</p>
     <ul class="steps">
       <li>Let $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$ and propose $M=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}$.</li>
       <li>Multiply $AM$ (ignore the scalar $\\frac{1}{ad-bc}$ for now): $\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}$.</li>
       <li>Top-left: $a\\cdot d + b\\cdot(-c) = ad-bc$. Top-right: $a(-b)+b\\cdot a = 0$.</li>
       <li>Bottom-left: $c\\cdot d + d(-c) = 0$. Bottom-right: $c(-b)+d\\cdot a = ad-bc$.</li>
       <li>So the product is $\\begin{bmatrix}ad-bc & 0\\\\ 0 & ad-bc\\end{bmatrix} = (ad-bc)\\,I$.</li>
       <li>Divide by the scalar $ad-bc$ and you get $AM = I$. So $M = A^{-1}$, valid exactly when $ad-bc \\neq 0$. ∎</li>
     </ul>
     <p>The number $ad-bc$ is the determinant. When it is zero, $A$ squashes the plane onto a line and no undo exists.</p>`,
  example:
    `<p>Let $A=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>Determinant: $ad-bc = 2\\cdot1 - 1\\cdot1 = 1$. Non-zero, so an inverse exists.</li>
       <li>Swap $a,d$ and negate $b,c$: $\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$. Divide by 1 (no change).</li>
       <li>So $A^{-1}=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$.</li>
       <li>Check: $A A^{-1}=\\begin{bmatrix}2\\cdot1+1\\cdot(-1) & 2(-1)+1\\cdot2\\\\ 1\\cdot1+1(-1) & 1(-1)+1\\cdot2\\end{bmatrix}=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}=I$. ✔</li>
     </ul>`,
  application:
    `<p>The exact solution to least-squares regression is $w=(X^\\top X)^{-1}X^\\top y$ — an inverse sits at its heart. In practice we rarely form $A^{-1}$ explicitly (it is slow and unstable); we solve the system directly. But the inverse is the concept that makes "solve $Ax=b$" precise.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 600; cv.height = 340; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var A = [[2, 1], [1, 1]];
    var applied = false; // false = show shape under A, then A^-1 maps back
    var rng = 4, P = 28, cx = 300, cy = 170, sc = (150 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }
    // an "F" shaped polyline so orientation is visible
    var Fpts = [[0, 0], [0, 2], [1.5, 2], [0, 2], [0, 1], [1, 1]];
    function detOf(m) { return m[0][0] * m[1][1] - m[0][1] * m[1][0]; }
    function inv(m) { var d = detOf(m); return [[m[1][1] / d, -m[0][1] / d], [-m[1][0] / d, m[0][0] / d]]; }
    function mul(m, p) { return [m[0][0] * p[0] + m[0][1] * p[1], m[1][0] * p[0] + m[1][1] * p[1]]; }
    function drawShape(pts, col, lw) {
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
      for (var i = 0; i < pts.length; i++) { if (i === 0) ctx.moveTo(px(pts[i][0]), py(pts[i][1])); else ctx.lineTo(px(pts[i][0]), py(pts[i][1])); }
      ctx.stroke();
    }
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(P, cy); ctx.lineTo(cv.width - P, cy);
      ctx.moveTo(cx, P); ctx.lineTo(cx, cy + (150 - P)); ctx.stroke();
      // original F (always shown, dim)
      drawShape(Fpts, c.dim, 1.5);
      var Ai = inv(A);
      var mapped = Fpts.map(function (p) { return mul(A, p); });
      if (!applied) {
        // show A applied
        drawShape(mapped, c.accent, 2.5);
      } else {
        // show A applied, then A^-1 bringing it back onto the original
        var back = mapped.map(function (p) { return mul(Ai, p); });
        drawShape(mapped, c.accent + "55", 1.5);
        drawShape(back, c.accent2, 2.5);
      }
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "13px sans-serif";
      ctx.fillStyle = c.dim; ctx.fillText("gray = original F", 16, 24);
      ctx.fillStyle = c.accent; ctx.fillText("blue = A·F (transformed)", 16, 42);
      if (applied) { ctx.fillStyle = c.accent2; ctx.fillText("green = A⁻¹·(A·F) lands back on the original", 16, 60); }
      ctx.fillStyle = c.ink; ctx.font = "14px sans-serif";
      ctx.fillText("A = [[2,1],[1,1]],  det = " + detOf(A) + ",  A⁻¹ = [[1,-1],[-1,2]]", 16, cv.height - 14);
    }
    var bar = document.createElement("div"); bar.style.margin = "8px 0";
    var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
    var btn = document.createElement("button"); btn.style.cssText = BTN; btn.textContent = "Apply A⁻¹ to map it back ▸";
    btn.addEventListener("click", function () { applied = !applied; btn.textContent = applied ? "Reset" : "Apply A⁻¹ to map it back ▸"; draw(); });
    bar.appendChild(btn); host.appendChild(bar);
    draw();
  },
  quiz: {
    q: `Find the inverse of $A=\\begin{bmatrix}3&0\\\\0&2\\end{bmatrix}$. Why is the inverse of a diagonal matrix easy?`,
    a: `<p>$\\det = 3\\cdot2 = 6$. Inverse $=\\frac{1}{6}\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}=\\begin{bmatrix}1/3&0\\\\0&1/2\\end{bmatrix}$. For a diagonal matrix you just reciprocate each diagonal entry — undoing each independent scale.</p>`
  }
});

/* ================================================================ 5 */
L({
  id: "la-determinant",
  title: "Determinant",
  tagline: "One number that says how much a matrix scales area. Zero means it collapses space.",
  prereqs: ["la-inverse", "fnd-matvec"],
  bigIdea:
    `<p>The <b>determinant</b> is a single number squeezed out of a square matrix.</p>
     <p>Its meaning is geometric: $|\\det A|$ is the factor by which $A$ scales area (in 2D) or volume (in 3D). A unit square of area 1 becomes a parallelogram of area $|\\det A|$.</p>
     <p>If $\\det A = 0$, the matrix flattens space onto a line — it loses a dimension, and cannot be undone. That is exactly when no inverse exists.</p>`,
  buildup:
    `<p>A matrix moves the corners of a shape. Sometimes the shape grows, sometimes it shrinks, sometimes it flips over.</p>
     <p>We want one number capturing "how much bigger" and "did it flip". That number is the determinant.</p>`,
  symbols: [
    { sym: "$A$", desc: "a square matrix; here $2\\times2$ with entries $a,b,c,d$." },
    { sym: "$\\det A$", desc: "the determinant of $A$, a single real number. Also written $|A|$." },
    { sym: "$a,b,c,d$", desc: "the entries of $A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$." },
    { sym: "$|\\det A|$", desc: "the absolute value of the determinant: the area-scaling factor (the sign tells you about flipping)." }
  ],
  formula: `$$ \\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix} = ad - bc, \\qquad |\\det A| = \\text{area scale}, \\qquad \\det A = 0 \\Rightarrow \\text{singular} $$`,
  whatItDoes:
    `<p>Compute $ad-bc$: multiply the main diagonal, subtract the off-diagonal product.</p>
     <p>The size $|ad-bc|$ tells you how areas scale. The sign tells you orientation: positive keeps it, negative means the shape was flipped (mirrored). Zero means everything got squashed flat.</p>`,
  derivation:
    `<p><b>Why $ad-bc$ is the area.</b> The matrix sends the unit square to the parallelogram spanned by its two columns $u=(a,c)$ and $v=(b,d)$. We compute that parallelogram's area.</p>
     <ul class="steps">
       <li>The area of the parallelogram spanned by $u$ and $v$ is the magnitude of their 2D cross product: $|u_x v_y - u_y v_x|$.</li>
       <li>Here $u=(a,c)$ and $v=(b,d)$, so $u_x v_y - u_y v_x = a\\,d - c\\,b = ad-bc$.</li>
       <li>That signed quantity $ad-bc$ is the determinant; its absolute value is the area.</li>
       <li>If the columns point along the same line ($v$ a multiple of $u$), the parallelogram is squashed to zero area, and indeed $ad-bc=0$. ∎</li>
     </ul>
     <p>The sign records orientation: swap the two columns and $ad-bc$ flips sign, matching the fact that the parallelogram got mirrored.</p>`,
  example:
    `<p>Let $A=\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>$\\det A = ad - bc = 3\\cdot2 - 1\\cdot1 = 6 - 1 = 5$.</li>
       <li>So $A$ scales every area by 5: the unit square (area 1) becomes a parallelogram of area 5.</li>
       <li>The sign is positive, so orientation is preserved (no mirror flip).</li>
       <li>Compare $B=\\begin{bmatrix}2&4\\\\1&2\\end{bmatrix}$: $\\det B = 2\\cdot2 - 4\\cdot1 = 0$. Its columns $(2,1)$ and $(4,2)$ are parallel — $B$ flattens the plane onto a line and is singular.</li>
     </ul>`,
  application:
    `<p>The determinant decides invertibility (zero = singular = no unique solution). In probability, the multivariate Gaussian's normalizing constant contains $\\det\\Sigma$ (the covariance's "volume"). Change-of-variables in integration multiplies by $|\\det|$ of the Jacobian — the backbone of normalizing-flow generative models.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 560; cv.height = 360; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var a = 3, b = 1, c = 1, d = 2;
    var rng = 5, P = 28, cx = 200, cy = 200, sc = (170 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }
    function draw() {
      var col = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = col.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(P, cy); ctx.lineTo(380, cy);
      ctx.moveTo(cx, P); ctx.lineTo(cx, cy + (170 - P)); ctx.stroke();
      // unit square dashed
      ctx.strokeStyle = col.dim; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px(0), py(0)); ctx.lineTo(px(1), py(0)); ctx.lineTo(px(1), py(1)); ctx.lineTo(px(0), py(1)); ctx.closePath(); ctx.stroke();
      ctx.setLineDash([]);
      // parallelogram from columns (a,c) and (b,d): corners 0, u, u+v, v
      var u = [a, c], v = [b, d];
      var det = a * d - b * c;
      var corners = [[0, 0], u, [u[0] + v[0], u[1] + v[1]], v];
      ctx.fillStyle = (det >= 0 ? col.accent : col.warn) + "33";
      ctx.strokeStyle = (det >= 0 ? col.accent : col.warn); ctx.lineWidth = 2;
      ctx.beginPath();
      for (var i = 0; i < 4; i++) { if (i === 0) ctx.moveTo(px(corners[i][0]), py(corners[i][1])); else ctx.lineTo(px(corners[i][0]), py(corners[i][1])); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // column vectors
      ctx.strokeStyle = col.accent2; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(u[0]), py(u[1])); ctx.stroke();
      ctx.strokeStyle = col.purple;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(v[0]), py(v[1])); ctx.stroke();
      // readouts on the right
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "14px sans-serif";
      ctx.fillStyle = col.ink;
      var rx = 400;
      ctx.fillText("A = [[" + a + ", " + b + "],", rx, 60);
      ctx.fillText("      [" + c + ", " + d + "]]", rx, 80);
      ctx.fillStyle = (det >= 0 ? col.accent : col.warn); ctx.font = "16px sans-serif";
      ctx.fillText("det = " + a + "·" + d + " − " + b + "·" + c, rx, 120);
      ctx.fillText("     = " + det, rx, 144);
      ctx.fillStyle = col.dim; ctx.font = "12px sans-serif";
      ctx.fillText("area of parallelogram", rx, 176);
      ctx.fillText("= |det| = " + Math.abs(det), rx, 194);
      if (det === 0) { ctx.fillStyle = col.warn; ctx.fillText("det 0 → squashed to a line", rx, 220); }
      else if (det < 0) { ctx.fillStyle = col.warn; ctx.fillText("det < 0 → orientation flipped", rx, 220); }
    }
    function slider(label, init, min, max, set) {
      var wrap = document.createElement("div"); wrap.style.margin = "3px 0"; wrap.style.fontSize = "13px"; wrap.style.color = "var(--ink)";
      var lab = document.createElement("span"); lab.textContent = label + " "; wrap.appendChild(lab);
      var s = document.createElement("input"); s.type = "range"; s.min = String(min); s.max = String(max); s.step = "1"; s.value = String(init);
      var out = document.createElement("span"); out.textContent = " = " + init; out.style.color = "var(--accent)";
      s.addEventListener("input", function () { set(parseFloat(s.value)); out.textContent = " = " + s.value; draw(); });
      wrap.appendChild(s); wrap.appendChild(out); host.appendChild(wrap);
    }
    slider("a", a, -5, 5, function (v) { a = v; });
    slider("b", b, -5, 5, function (v) { b = v; });
    slider("c", c, -5, 5, function (v) { c = v; });
    slider("d", d, -5, 5, function (v) { d = v; });
    draw();
  },
  quiz: {
    q: `Compute $\\det\\begin{bmatrix}4&2\\\\2&1\\end{bmatrix}$. Is the matrix invertible? What happens to areas?`,
    a: `<p>$\\det = 4\\cdot1 - 2\\cdot2 = 4 - 4 = 0$. The determinant is zero, so the matrix is singular (not invertible). It collapses the plane onto a line — areas become zero.</p>`
  }
});

/* ================================================================ 6 */
L({
  id: "la-trace",
  title: "Trace",
  tagline: "Add up the diagonal. It equals the sum of the eigenvalues.",
  prereqs: ["fnd-matrix", "la-matmul", "fnd-eigen"],
  bigIdea:
    `<p>The <b>trace</b> is the sum of the diagonal entries of a square matrix.</p>
     <p>It looks trivial, but it has two deep properties: you can swap the order in a product, $\\operatorname{tr}(AB)=\\operatorname{tr}(BA)$, and it always equals the sum of the matrix's eigenvalues.</p>
     <p>So the trace measures total "stretch" across all eigen-directions, in one cheap addition.</p>`,
  buildup:
    `<p>Of all the numbers you could read off a matrix, the diagonal entries $A_{11}, A_{22}, \\dots$ are special: they connect each axis to itself.</p>
     <p>Add them up and, remarkably, you get a quantity that does not change under many transformations.</p>`,
  symbols: [
    { sym: "$A$", desc: "a square matrix ($n\\times n$)." },
    { sym: "$\\operatorname{tr}(A)$", desc: "the trace: the sum of the diagonal entries." },
    { sym: "$A_{ii}$", desc: "the $i$-th diagonal entry (row $i$, column $i$)." },
    { sym: "$\\lambda_i$", desc: "the $i$-th eigenvalue of $A$ (the stretch factors from the eigen lesson)." },
    { sym: "$B$", desc: "another matrix, used in the cyclic property $\\operatorname{tr}(AB)=\\operatorname{tr}(BA)$." }
  ],
  formula: `$$ \\operatorname{tr}(A) = \\sum_{i=1}^{n} A_{ii}, \\qquad \\operatorname{tr}(AB)=\\operatorname{tr}(BA), \\qquad \\operatorname{tr}(A)=\\sum_{i=1}^{n}\\lambda_i $$`,
  whatItDoes:
    `<p>Walk down the diagonal, add each entry. That single number is the trace.</p>
     <p>Two surprises: (1) it survives reordering inside a product, and (2) it equals the eigenvalues summed, even though computing eigenvalues is much harder.</p>`,
  derivation:
    `<p><b>Why $\\operatorname{tr}(AB)=\\operatorname{tr}(BA)$.</b> Write each trace as a double sum and swap.</p>
     <ul class="steps">
       <li>$\\operatorname{tr}(AB)=\\sum_i (AB)_{ii} = \\sum_i \\sum_k A_{ik} B_{ki}$ (diagonal entry $i$ of the product).</li>
       <li>The terms are plain numbers, so reorder the factors: $\\sum_i \\sum_k B_{ki} A_{ik}$.</li>
       <li>Swap the two sums (finite sums commute): $\\sum_k \\sum_i B_{ki} A_{ik} = \\sum_k (BA)_{kk}$.</li>
       <li>That last sum is $\\operatorname{tr}(BA)$. So $\\operatorname{tr}(AB)=\\operatorname{tr}(BA)$. ∎</li>
     </ul>
     <p><b>Why trace = sum of eigenvalues.</b> The eigenvalues are the roots of the characteristic polynomial $\\det(A-\\lambda I)=0$. Expanding that determinant, the coefficient tied to the next-to-highest power of $\\lambda$ is exactly $\\operatorname{tr}(A)$, and by the relation between a polynomial's roots and its coefficients, the roots sum to that coefficient: $\\sum_i \\lambda_i = \\operatorname{tr}(A)$. ∎</p>`,
  example:
    `<p>Let $A=\\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>Trace by diagonal: $\\operatorname{tr}(A) = A_{11}+A_{22} = 2 + 3 = 5$.</li>
       <li>Check via eigenvalues: this triangular matrix has eigenvalues on its diagonal, $\\lambda_1=2$, $\\lambda_2=3$. Sum $= 5$. ✔</li>
       <li>Cyclic check: with $B=\\begin{bmatrix}1&0\\\\1&1\\end{bmatrix}$, $AB=\\begin{bmatrix}3&1\\\\3&3\\end{bmatrix}$ (trace 6) and $BA=\\begin{bmatrix}2&1\\\\2&4\\end{bmatrix}$ (trace 6). Equal. ✔</li>
     </ul>`,
  application:
    `<p>In statistics, the trace of the "hat" matrix is the effective number of parameters used by a model. The trace appears in the matrix derivative identities used to derive backprop, and $\\operatorname{tr}(\\Sigma)$ (total variance) is a quick summary of how spread out data is across all features.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 560; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var A = [[2, 1, 0], [4, 3, 5], [1, 0, 6]];
    var step = 0; // how many diagonal entries added
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      var cw = 56, ch = 56, gap = 6, ox = 60, oy = 50;
      var run = 0;
      for (var r = 0; r < 3; r++) for (var k = 0; k < 3; k++) {
        var onDiag = (r === k);
        var added = onDiag && (r < step);
        var x = ox + k * (cw + gap), y = oy + r * (ch + gap);
        ctx.fillStyle = added ? (c.accent2 + "33") : (onDiag ? (c.warn + "22") : c.panel);
        ctx.fillRect(x, y, cw, ch);
        ctx.strokeStyle = onDiag ? c.warn : c.border; ctx.lineWidth = onDiag ? 2 : 1.2;
        ctx.strokeRect(x, y, cw, ch);
        ctx.fillStyle = c.ink; ctx.font = "18px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(A[r][k]), x + cw / 2, y + ch / 2);
      }
      for (var i = 0; i < step; i++) run += A[i][i];
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "15px sans-serif";
      var rx = 300;
      ctx.fillStyle = c.dim; ctx.fillText("Running sum of the", rx, 70);
      ctx.fillText("highlighted diagonal:", rx, 90);
      ctx.fillStyle = c.accent2; ctx.font = "16px sans-serif";
      var parts = [];
      for (var j = 0; j < step; j++) parts.push(String(A[j][j]));
      ctx.fillText("tr = " + (parts.length ? parts.join(" + ") : "—"), rx, 124);
      ctx.fillText("   = " + run, rx, 148);
      if (step >= 3) { ctx.fillStyle = c.accent; ctx.fillText("Full trace = 2 + 3 + 6 = 11", rx, 184); }
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("Click to add the next diagonal entry.", 60, oy + 3 * (ch + gap) + 24);
    }
    var bar = document.createElement("div"); bar.style.margin = "8px 0";
    var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
    var next = document.createElement("button"); next.style.cssText = BTN; next.textContent = "Add next diagonal entry ▸";
    var reset = document.createElement("button"); reset.style.cssText = BTN; reset.textContent = "Reset";
    next.addEventListener("click", function () { step = (step >= 3) ? 3 : step + 1; draw(); });
    reset.addEventListener("click", function () { step = 0; draw(); });
    bar.appendChild(next); bar.appendChild(reset); host.appendChild(bar);
    draw();
  },
  quiz: {
    q: `A $3\\times3$ matrix has eigenvalues $1, 4, 4$. What is its trace? If its diagonal is $(2, 3, 4)$, is that consistent?`,
    a: `<p>Trace = sum of eigenvalues = $1+4+4 = 9$. The diagonal sums to $2+3+4 = 9$ as well, so yes — consistent (trace must equal both).</p>`
  }
});

/* ================================================================ 7 */
L({
  id: "la-rank-independence",
  title: "Rank & linear independence",
  tagline: "How many truly independent directions a matrix's columns span.",
  prereqs: ["fnd-matvec", "la-matmul"],
  bigIdea:
    `<p>Vectors are <b>linearly independent</b> if none of them can be built from the others by scaling and adding.</p>
     <p>The <b>rank</b> of a matrix is the number of independent columns it has — the true number of directions it spans.</p>
     <p>If one column is a combination of the others, it adds nothing new: the rank drops, and the matrix collapses space (it becomes singular).</p>`,
  buildup:
    `<p>Stack some vectors as the columns of a matrix. Do they reach out into many directions, or do they secretly lie on a smaller line or plane?</p>
     <p>Rank answers that. Full rank = no wasted directions. Low rank = redundancy.</p>`,
  symbols: [
    { sym: "$v_1,\\dots,v_k$", desc: "a set of vectors (here, the columns of a matrix)." },
    { sym: "$c_1,\\dots,c_k$", desc: "scalar weights used to combine the vectors." },
    { sym: "$\\operatorname{rank}(A)$", desc: "the rank of $A$: the number of linearly independent columns." },
    { sym: "$\\mathbf{0}$", desc: "the zero vector (all entries 0)." },
    { sym: "$A$", desc: "a matrix whose columns are the vectors in question." }
  ],
  formula: `$$ \\sum_{i=1}^{k} c_i v_i = \\mathbf{0} \\;\\Rightarrow\\; c_1=\\cdots=c_k=0 \\quad(\\text{independence}); \\qquad \\operatorname{rank}(A)=\\#\\{\\text{independent columns}\\} $$`,
  whatItDoes:
    `<p>Independence test: the only way to combine the vectors and land back at zero is to use all-zero weights. If some non-zero weights also give zero, the vectors are dependent — one is redundant.</p>
     <p>Rank counts how many survive after throwing out the redundant ones.</p>`,
  derivation:
    `<p><b>Why dependence drops the rank (and kills the inverse).</b></p>
     <ul class="steps">
       <li>Suppose column $v_k$ is a combination of the others: $v_k = \\sum_{i<k} c_i v_i$ for some weights not all zero.</li>
       <li>Then the vector of coefficients $w$ with $w_i = c_i$ for $i<k$ and $w_k = -1$ satisfies $\\sum_i w_i v_i = \\mathbf{0}$, i.e. $Aw = \\mathbf{0}$ with $w \\neq \\mathbf{0}$.</li>
       <li>So $A$ sends a non-zero vector $w$ to zero. It cannot be undone: any inverse $A^{-1}$ would force $w = A^{-1}\\mathbf{0} = \\mathbf{0}$, a contradiction.</li>
       <li>Therefore a dependent column means $A$ is singular, its determinant is 0, and its rank is below full. ∎</li>
     </ul>
     <p>Independence is the opposite case: $Aw=\\mathbf{0}$ forces $w=\\mathbf{0}$, so no direction is wasted, the rank is full, and the inverse exists.</p>`,
  example:
    `<p>Take three column vectors $v_1=\\begin{bmatrix}1\\\\0\\\\0\\end{bmatrix}$, $v_2=\\begin{bmatrix}0\\\\1\\\\0\\end{bmatrix}$, $v_3=\\begin{bmatrix}2\\\\3\\\\0\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>Notice $v_3 = 2v_1 + 3v_2$ — it is built from the first two.</li>
       <li>So $v_3$ adds no new direction. The three columns all lie in the flat $z=0$ plane.</li>
       <li>Independent columns: just $v_1$ and $v_2$. So $\\operatorname{rank} = 2$, not 3.</li>
       <li>The matrix $[v_1\\;v_2\\;v_3]$ is $3\\times3$ but rank 2: it is singular, $\\det = 0$, and has no inverse.</li>
     </ul>`,
  application:
    `<p>Multicollinearity in regression is exactly low rank in $X$: two features carry the same information, $X^\\top X$ becomes singular, and the fit blows up. Low-rank structure is also a feature: recommender systems assume the giant user–item matrix is approximately low rank, which is why a few latent factors explain it (next: SVD).</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 560; cv.height = 340; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    // three 2D vectors; user controls v3's coefficients to align it with span(v1,v2)
    var v1 = [2, 1], v2 = [-1, 2];
    var alpha = 1.0; // v3 = alpha*v1 + (1-alpha)*v2 ... but to show rank drop we let v3 be free OR collapse
    var collapse = 0; // 0 = independent (v3 off the line), 1 = dependent (v3 = combo)
    var rng = 5, P = 28, cx = 200, cy = 175, sc = (150 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }
    function arrow(v, col) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(v[0]), py(v[1])); ctx.stroke();
      var ang = Math.atan2(py(v[1]) - py(0), px(v[0]) - px(0));
      ctx.beginPath(); ctx.moveTo(px(v[0]), py(v[1]));
      ctx.lineTo(px(v[0]) - 10 * Math.cos(ang - 0.4), py(v[1]) - 10 * Math.sin(ang - 0.4));
      ctx.lineTo(px(v[0]) - 10 * Math.cos(ang + 0.4), py(v[1]) - 10 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
    }
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(P, cy); ctx.lineTo(380, cy);
      ctx.moveTo(cx, P); ctx.lineTo(cx, cy + (150 - P)); ctx.stroke();
      // independent free position for v3 (off to a third-ish direction), vs collapsed combo
      var freeV3 = [1, -2.5];
      var comboV3 = [alpha * v1[0] + (1 - alpha) * v2[0] * 1.0, alpha * v1[1] + (1 - alpha) * v2[1]];
      // when collapse=1 we force v3 onto the line through v1 (a scalar multiple) to drop rank visibly
      var lineV3 = [v1[0] * 1.8, v1[1] * 1.8];
      var v3 = collapse ? lineV3 : freeV3;
      // if collapsed, draw the span line (rank-1 collapse onto v1's direction) to show all live on a line
      if (collapse) {
        ctx.strokeStyle = c.warn + "66"; ctx.setLineDash([5, 5]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px(-v1[0] * 2.4), py(-v1[1] * 2.4)); ctx.lineTo(px(v1[0] * 2.4), py(v1[1] * 2.4)); ctx.stroke();
        ctx.setLineDash([]);
      }
      arrow(v1, c.accent);
      arrow(collapse ? [v1[0] * -1.4, v1[1] * -1.4] : v2, c.purple);
      arrow(v3, c.accent2);
      ctx.font = "13px sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = c.accent; ctx.fillText("v₁", px(v1[0]) + 6, py(v1[1]) - 6);
      ctx.fillStyle = c.accent2; ctx.fillText("v₃", px(v3[0]) + 6, py(v3[1]) - 6);
      // readout panel
      var rx = 400;
      ctx.font = "14px sans-serif";
      if (!collapse) {
        ctx.fillStyle = c.accent2; ctx.fillText("Independent:", rx, 70);
        ctx.fillStyle = c.ink; ctx.fillText("vectors reach 2", rx, 92);
        ctx.fillText("directions.", rx, 110);
        ctx.fillStyle = c.accent2; ctx.font = "18px sans-serif"; ctx.fillText("rank = 2", rx, 144);
      } else {
        ctx.fillStyle = c.warn; ctx.fillText("Dependent:", rx, 70);
        ctx.fillStyle = c.ink; ctx.font = "14px sans-serif";
        ctx.fillText("all collapse onto", rx, 92);
        ctx.fillText("one line.", rx, 110);
        ctx.fillStyle = c.warn; ctx.font = "18px sans-serif"; ctx.fillText("rank = 1", rx, 144);
      }
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("Toggle: make a vector a combination of the others — rank drops.", 60, cy + (150 - P) + 26);
    }
    var bar = document.createElement("div"); bar.style.margin = "8px 0";
    var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
    var btn = document.createElement("button"); btn.style.cssText = BTN; btn.textContent = "Collapse onto a line (drop rank) ▸";
    btn.addEventListener("click", function () { collapse = collapse ? 0 : 1; btn.textContent = collapse ? "Spread back out (full rank) ▸" : "Collapse onto a line (drop rank) ▸"; draw(); });
    bar.appendChild(btn); host.appendChild(bar);
    draw();
  },
  quiz: {
    q: `Are $\\begin{bmatrix}1\\\\2\\end{bmatrix}$ and $\\begin{bmatrix}2\\\\4\\end{bmatrix}$ linearly independent? What is the rank of the matrix with these as columns?`,
    a: `<p>No — the second is exactly $2\\times$ the first, so they point the same way. They span only one line. The matrix has rank 1 (and determinant $1\\cdot4 - 2\\cdot2 = 0$, singular).</p>`
  }
});

/* ================================================================ 8 */
L({
  id: "la-psd",
  title: "Positive semi-definite matrices",
  tagline: "Symmetric matrices that never bend the quadratic the wrong way: a bowl, not a saddle.",
  prereqs: ["la-transpose", "fnd-dot", "fnd-eigen"],
  bigIdea:
    `<p>A symmetric matrix $A$ is <b>positive semi-definite (PSD)</b> if the quadratic form $x^\\top A x$ is never negative, for any $x$.</p>
     <p>Geometrically, the surface $x^\\top A x$ is an upward bowl: it curves up in every direction (or is flat), never down. A matrix that curves down somewhere gives a saddle and is not PSD.</p>
     <p>Equivalently, every eigenvalue of $A$ is $\\ge 0$. PSD matrices are the "non-negative numbers" of the matrix world.</p>`,
  buildup:
    `<p>For a single number $a$, "non-negative" means $a \\ge 0$, i.e. $a x^2 \\ge 0$ for all $x$.</p>
     <p>The matrix version replaces $a x^2$ with $x^\\top A x$. Asking that this is never negative is the PSD condition.</p>`,
  symbols: [
    { sym: "$A$", desc: "a symmetric matrix: $A^\\top = A$." },
    { sym: "$x$", desc: "any vector (the input we test the quadratic form on)." },
    { sym: "$x^\\top A x$", desc: "the quadratic form: a single number measuring curvature in direction $x$." },
    { sym: "$\\succeq 0$", desc: "the symbol for 'is positive semi-definite'. $A \\succeq 0$ means $x^\\top A x \\ge 0$ for all $x$." },
    { sym: "$\\lambda_i$", desc: "the $i$-th eigenvalue of $A$. PSD is the same as every $\\lambda_i \\ge 0$." }
  ],
  formula: `$$ A = A^\\top \\;\\text{and}\\; x^\\top A x \\ge 0 \\;\\;\\forall x \\quad\\Longleftrightarrow\\quad A \\succeq 0 \\quad\\Longleftrightarrow\\quad \\lambda_i \\ge 0\\;\\;\\forall i $$`,
  whatItDoes:
    `<p>Feed any direction $x$ into $x^\\top A x$. If the answer is always $\\ge 0$, the matrix is PSD. If you can find even one $x$ giving a negative value, it is not.</p>
     <p>The eigenvalue test is the shortcut: PSD exactly when all eigenvalues are non-negative.</p>`,
  derivation:
    `<p><b>Why "all eigenvalues $\\ge 0$" matches "$x^\\top A x \\ge 0$".</b> Use that a symmetric $A$ can be written $A=U\\Lambda U^\\top$ with orthogonal eigenvectors (the spectral theorem, next lesson) and eigenvalues $\\lambda_i$ on the diagonal of $\\Lambda$.</p>
     <ul class="steps">
       <li>Substitute: $x^\\top A x = x^\\top U \\Lambda U^\\top x$.</li>
       <li>Let $y = U^\\top x$ (rotate $x$ into the eigenvector coordinates). Then $x^\\top A x = y^\\top \\Lambda y$.</li>
       <li>Because $\\Lambda$ is diagonal, this expands to $y^\\top \\Lambda y = \\sum_i \\lambda_i\\, y_i^2$.</li>
       <li>Each $y_i^2 \\ge 0$. So if every $\\lambda_i \\ge 0$, the whole sum is $\\ge 0$ for all $x$ — that is PSD.</li>
       <li>Conversely, if some $\\lambda_j < 0$, pick $x$ equal to that eigenvector (so $y$ has a single 1 in slot $j$); then $x^\\top A x = \\lambda_j < 0$, breaking PSD. ∎</li>
     </ul>
     <p>So the sign of the quadratic form is governed entirely by the signs of the eigenvalues.</p>`,
  example:
    `<p>Let $A=\\begin{bmatrix}2&0\\\\0&1\\end{bmatrix}$. It is symmetric (diagonal). Test it.</p>
     <ul class="steps">
       <li>$x^\\top A x = 2x_1^2 + 1\\,x_2^2$. Both terms are squares, so the sum is always $\\ge 0$. PSD. ✔</li>
       <li>Eigenvalues are $2$ and $1$, both $\\ge 0$. Same conclusion.</li>
       <li>Now $B=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$: $x^\\top B x = x_1^2 - x_2^2$. At $x=(0,1)$ this is $-1 < 0$. Not PSD — it is a saddle (eigenvalue $-1$).</li>
     </ul>`,
  application:
    `<p>Every covariance matrix is PSD (variance can't be negative). A loss is convex exactly when its Hessian is PSD, which guarantees gradient descent reaches the global minimum. Kernel methods (SVMs, Gaussian processes) require a PSD kernel matrix — that is what makes the optimization well-behaved.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 560; cv.height = 340; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var lam2 = 1; // second eigenvalue; lam1 fixed at 1.5. Negative -> saddle
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      var lam1 = 1.5;
      var psd = (lam1 >= 0 && lam2 >= 0);
      // draw the quadratic surface z = lam1*x^2 + lam2*y^2 as a contour / 3D-ish wireframe (isometric)
      var ox = 200, oy = 200, scl = 26;
      function proj(x, y, z) {
        // simple isometric: screen = origin + (x-y)*cos, (x+y)*sin - z
        var sx = ox + (x - y) * scl * 0.9;
        var sy = oy + (x + y) * scl * 0.42 - z * scl * 0.5;
        return [sx, sy];
      }
      ctx.lineWidth = 1;
      var N = 10, span = 2;
      // grid lines along x
      for (var gi = 0; gi <= N; gi++) {
        var xv = -span + 2 * span * gi / N;
        ctx.strokeStyle = (psd ? c.accent : c.warn) + "66";
        ctx.beginPath();
        for (var gj = 0; gj <= N; gj++) {
          var yv = -span + 2 * span * gj / N;
          var zv = lam1 * xv * xv + lam2 * yv * yv;
          var p = proj(xv, yv, zv);
          if (gj === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
        }
        ctx.stroke();
      }
      // grid lines along y
      for (var hj = 0; hj <= N; hj++) {
        var yv2 = -span + 2 * span * hj / N;
        ctx.strokeStyle = (psd ? c.accent2 : c.purple) + "66";
        ctx.beginPath();
        for (var hi = 0; hi <= N; hi++) {
          var xv2 = -span + 2 * span * hi / N;
          var zv2 = lam1 * xv2 * xv2 + lam2 * yv2 * yv2;
          var p2 = proj(xv2, yv2, zv2);
          if (hi === 0) ctx.moveTo(p2[0], p2[1]); else ctx.lineTo(p2[0], p2[1]);
        }
        ctx.stroke();
      }
      // label
      var rx = 380;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "14px sans-serif";
      ctx.fillStyle = c.ink; ctx.fillText("z = xᵀA x", rx, 60);
      ctx.fillText("λ₁ = 1.5", rx, 84);
      ctx.fillStyle = (lam2 >= 0 ? c.accent2 : c.warn);
      ctx.fillText("λ₂ = " + lam2.toFixed(1), rx, 104);
      ctx.font = "16px sans-serif";
      if (psd) { ctx.fillStyle = c.accent2; ctx.fillText("PSD: a bowl", rx, 140); ctx.font = "12px sans-serif"; ctx.fillStyle = c.dim; ctx.fillText("curves up everywhere", rx, 160); }
      else { ctx.fillStyle = c.warn; ctx.fillText("Not PSD: a saddle", rx, 140); ctx.font = "12px sans-serif"; ctx.fillStyle = c.dim; ctx.fillText("dips down in one axis", rx, 160); }
    }
    var wrap = document.createElement("div"); wrap.style.margin = "8px 0"; wrap.style.fontSize = "13px"; wrap.style.color = "var(--ink)";
    var lab = document.createElement("span"); lab.textContent = "λ₂ "; wrap.appendChild(lab);
    var s = document.createElement("input"); s.type = "range"; s.min = "-2"; s.max = "3"; s.step = "0.5"; s.value = "1";
    var out = document.createElement("span"); out.textContent = " = 1.0"; out.style.color = "var(--accent)";
    s.addEventListener("input", function () { lam2 = parseFloat(s.value); out.textContent = " = " + lam2.toFixed(1); draw(); });
    wrap.appendChild(s); wrap.appendChild(out); host.appendChild(wrap);
    draw();
  },
  quiz: {
    q: `Is $A=\\begin{bmatrix}3&0\\\\0&0\\end{bmatrix}$ positive semi-definite? Is it positive definite (strictly $>0$)?`,
    a: `<p>$x^\\top A x = 3x_1^2 \\ge 0$ always, so yes, PSD (eigenvalues $3$ and $0$, both $\\ge 0$). But it is not positive definite: at $x=(0,1)$ the form is $0$, not strictly positive, because one eigenvalue is exactly 0.</p>`
  }
});

/* ================================================================ 9 */
L({
  id: "la-spectral",
  title: "Spectral theorem",
  tagline: "Every symmetric matrix is a rotation, a scaling along perpendicular axes, then the rotation back.",
  prereqs: ["fnd-eigen", "la-transpose", "la-identity-diagonal", "la-psd"],
  bigIdea:
    `<p>The <b>spectral theorem</b> says any symmetric matrix $A$ can be written $A = U\\Lambda U^\\top$.</p>
     <p>Here $\\Lambda$ is diagonal (the eigenvalues) and $U$ holds the eigenvectors as columns — and those eigenvectors are <i>perpendicular</i> (orthonormal).</p>
     <p>So a symmetric matrix does something simple in disguise: rotate into the eigenvector axes, scale each axis by its eigenvalue, rotate back. A circle becomes an ellipse aligned to those perpendicular axes.</p>`,
  buildup:
    `<p>General matrices can rotate, shear, and stretch in messy ways. Symmetric matrices are far tamer.</p>
     <p>Their eigenvectors come out at right angles to each other, which means $U$ is a pure rotation and $U^\\top = U^{-1}$. That orthogonality is what makes everything clean.</p>`,
  symbols: [
    { sym: "$A$", desc: "a symmetric matrix: $A^\\top = A$." },
    { sym: "$U$", desc: "an orthogonal matrix whose columns are the unit eigenvectors of $A$. Orthogonal means $U^\\top U = I$." },
    { sym: "$U^\\top$", desc: "the transpose of $U$, which here equals its inverse $U^{-1}$." },
    { sym: "$\\Lambda$", desc: "a diagonal matrix of the eigenvalues $\\lambda_1,\\dots,\\lambda_n$ (capital lambda)." },
    { sym: "$u_i$", desc: "the $i$-th eigenvector (a column of $U$), with $A u_i = \\lambda_i u_i$." }
  ],
  formula: `$$ A = U \\Lambda U^\\top, \\qquad U^\\top U = I, \\qquad \\Lambda = \\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n) $$`,
  whatItDoes:
    `<p>Reading $A = U\\Lambda U^\\top$ right to left on a vector $x$: $U^\\top x$ rotates $x$ into eigen-coordinates, $\\Lambda$ scales each coordinate by its eigenvalue, and $U$ rotates the result back. Three simple steps.</p>
     <p>Because the eigenvectors are perpendicular, there is no shear — only clean stretching along orthogonal axes.</p>`,
  derivation:
    `<p><b>Why symmetric eigenvectors are perpendicular.</b> Take two eigenvectors with <i>different</i> eigenvalues and show their dot product is 0.</p>
     <ul class="steps">
       <li>Let $A u = \\lambda u$ and $A v = \\mu v$ with $\\lambda \\neq \\mu$.</li>
       <li>Consider $u^\\top A v$. Using $A v = \\mu v$: $u^\\top A v = \\mu\\, u^\\top v$.</li>
       <li>Also, since $A=A^\\top$, $u^\\top A v = (A u)^\\top v = (\\lambda u)^\\top v = \\lambda\\, u^\\top v$.</li>
       <li>So $\\lambda\\, u^\\top v = \\mu\\, u^\\top v$, i.e. $(\\lambda - \\mu)\\, u^\\top v = 0$.</li>
       <li>Since $\\lambda \\neq \\mu$, the factor $(\\lambda-\\mu)\\neq 0$, forcing $u^\\top v = 0$: the eigenvectors are perpendicular. ∎</li>
     </ul>
     <p>Collect these unit, perpendicular eigenvectors as the columns of $U$. Then $U^\\top U = I$, and $AU = U\\Lambda$ rearranges to $A = U\\Lambda U^\\top$.</p>`,
  example:
    `<p>Let $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ (symmetric).</p>
     <ul class="steps">
       <li>Eigenvalues from $\\det(A-\\lambda I)=(2-\\lambda)^2-1=0$: $\\lambda = 3$ and $\\lambda = 1$.</li>
       <li>Eigenvector for $\\lambda=3$: $\\frac{1}{\\sqrt2}(1,1)$. For $\\lambda=1$: $\\frac{1}{\\sqrt2}(1,-1)$. Their dot product is $\\frac12(1-1)=0$ — perpendicular. ✔</li>
       <li>So $U=\\frac{1}{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$, $\\Lambda=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}$, and $A = U\\Lambda U^\\top$.</li>
       <li>Effect: $A$ stretches by 3 along the $(1,1)$ diagonal and by 1 along $(1,-1)$. The unit circle becomes an ellipse tilted at $45^\\circ$.</li>
     </ul>`,
  application:
    `<p>PCA is the spectral theorem applied to the covariance matrix: the eigenvectors are the principal axes of the data, the eigenvalues are the variances along them. Whitening, Gaussian-process kernels, and matrix square roots ($A^{1/2}=U\\Lambda^{1/2}U^\\top$) all rest on this decomposition.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 560; cv.height = 360; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var A = [[2, 1], [1, 2]];
    var rng = 4, P = 28, cx = 250, cy = 185, sc = (160 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }
    // eigen-decomposition of [[2,1],[1,2]] (precomputed, exact): lambdas 3,1; eigenvectors normalized
    var inv2 = 1 / Math.sqrt(2);
    var e1 = [inv2, inv2], l1 = 3;   // lambda 3 axis
    var e2 = [inv2, -inv2], l2 = 1;  // lambda 1 axis
    function arrow(v, col, lab) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(v[0]), py(v[1])); ctx.stroke();
      var ang = Math.atan2(py(v[1]) - py(0), px(v[0]) - px(0));
      ctx.beginPath(); ctx.moveTo(px(v[0]), py(v[1]));
      ctx.lineTo(px(v[0]) - 10 * Math.cos(ang - 0.4), py(v[1]) - 10 * Math.sin(ang - 0.4));
      ctx.lineTo(px(v[0]) - 10 * Math.cos(ang + 0.4), py(v[1]) - 10 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
      ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText(lab, px(v[0]) + 6, py(v[1]) - 6);
    }
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(P, cy); ctx.lineTo(cv.width - P, cy);
      ctx.moveTo(cx, P); ctx.lineTo(cx, cy + (160 - P)); ctx.stroke();
      // unit circle dashed
      ctx.strokeStyle = c.dim; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(px(0), py(0), sc, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      // transformed ellipse = A * circle
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2;
      ctx.beginPath();
      for (var t = 0; t <= 80; t++) {
        var th = t / 80 * Math.PI * 2; var ux = Math.cos(th), uy = Math.sin(th);
        var wx = A[0][0] * ux + A[0][1] * uy, wy = A[1][0] * ux + A[1][1] * uy;
        if (t === 0) ctx.moveTo(px(wx), py(wy)); else ctx.lineTo(px(wx), py(wy));
      }
      ctx.stroke();
      // eigen-axes scaled by their eigenvalues (the ellipse's principal axes)
      arrow([e1[0] * l1, e1[1] * l1], c.warn, "λ=3 axis");
      arrow([e2[0] * l2, e2[1] * l2], c.purple, "λ=1 axis");
      // the perpendicular dashed eigen-directions through origin
      ctx.strokeStyle = c.warn + "55"; ctx.setLineDash([2, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px(-e1[0] * rng), py(-e1[1] * rng)); ctx.lineTo(px(e1[0] * rng), py(e1[1] * rng)); ctx.stroke();
      ctx.strokeStyle = c.purple + "55";
      ctx.beginPath(); ctx.moveTo(px(-e2[0] * rng), py(-e2[1] * rng)); ctx.lineTo(px(e2[0] * rng), py(e2[1] * rng)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "13px sans-serif";
      ctx.fillStyle = c.dim; ctx.fillText("dashed circle → blue ellipse; axes are the perpendicular eigenvectors", 16, cv.height - 14);
    }
    draw();
  },
  quiz: {
    q: `For a symmetric matrix written $A=U\\Lambda U^\\top$, what is $U^\\top U$, and why does that make $U^\\top = U^{-1}$?`,
    a: `<p>$U^\\top U = I$ because the eigenvectors are orthonormal (perpendicular unit vectors). A matrix whose transpose times itself is $I$ has its transpose as its inverse, so $U^\\top = U^{-1}$ — $U$ is a pure rotation/reflection.</p>`
  }
});

/* ================================================================ 10 */
L({
  id: "la-svd",
  title: "Singular Value Decomposition (SVD)",
  tagline: "Factor ANY matrix into rotate, stretch, rotate. Keep the big stretches, throw the rest away.",
  prereqs: ["la-spectral", "la-rank-independence", "la-matmul"],
  bigIdea:
    `<p>The <b>SVD</b> factors <i>any</i> matrix (square or not) as $A = U\\Sigma V^\\top$.</p>
     <p>$V^\\top$ rotates, $\\Sigma$ stretches each axis by a non-negative <b>singular value</b>, and $U$ rotates again. The singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots$ rank the directions from most important to least.</p>
     <p>Keep only the top few singular values and you get the best low-rank approximation of $A$ — the math behind compression, recommender systems, and noise removal.</p>`,
  buildup:
    `<p>The spectral theorem only handles symmetric matrices. Real data matrices (users × items, pixels) are rectangular and not symmetric.</p>
     <p>The SVD extends the same "rotate, scale, rotate" idea to every matrix, by using two different rotations $U$ and $V$.</p>`,
  symbols: [
    { sym: "$A$", desc: "any $m\\times n$ matrix (need not be square)." },
    { sym: "$U$", desc: "an $m\\times m$ orthogonal matrix (left singular vectors as columns)." },
    { sym: "$\\Sigma$", desc: "an $m\\times n$ matrix, zero except for singular values $\\sigma_i \\ge 0$ on its diagonal (capital sigma)." },
    { sym: "$V^\\top$", desc: "the transpose of an $n\\times n$ orthogonal matrix $V$ (right singular vectors)." },
    { sym: "$\\sigma_i$", desc: "the $i$-th singular value, the stretch factor for direction $i$; sorted $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0$." },
    { sym: "$A_k$", desc: "the rank-$k$ approximation: keep the $k$ largest singular values, zero the rest." }
  ],
  formula: `$$ A = U\\Sigma V^\\top = \\sum_{i=1}^{r}\\sigma_i\\, u_i v_i^\\top, \\qquad A_k = \\sum_{i=1}^{k}\\sigma_i\\, u_i v_i^\\top \\;(\\text{best rank-}k) $$`,
  whatItDoes:
    `<p>$A = U\\Sigma V^\\top$ says: any linear map is a rotation, then independent stretches by the singular values, then another rotation.</p>
     <p>Writing it as a sum $\\sum_i \\sigma_i u_i v_i^\\top$ breaks $A$ into rank-1 pieces ranked by importance. Truncating to the top $k$ gives $A_k$, the closest rank-$k$ matrix to $A$.</p>`,
  derivation:
    `<p><b>Where the singular values come from.</b> Build the SVD from the spectral theorem applied to $A^\\top A$.</p>
     <ul class="steps">
       <li>$A^\\top A$ is symmetric and PSD (since $x^\\top A^\\top A x = \\lVert Ax\\rVert^2 \\ge 0$). By the spectral theorem, $A^\\top A = V\\Lambda V^\\top$ with eigenvalues $\\lambda_i \\ge 0$ and orthonormal $V$.</li>
       <li>Define the singular values as $\\sigma_i = \\sqrt{\\lambda_i}$ (real, since $\\lambda_i \\ge 0$).</li>
       <li>For each $\\sigma_i > 0$ set $u_i = \\tfrac{1}{\\sigma_i} A v_i$. Check these are orthonormal: $u_i^\\top u_j = \\tfrac{1}{\\sigma_i\\sigma_j} v_i^\\top A^\\top A v_j = \\tfrac{\\lambda_j}{\\sigma_i\\sigma_j} v_i^\\top v_j$, which is 1 if $i=j$ and 0 otherwise.</li>
       <li>By construction $A v_i = \\sigma_i u_i$, so collecting columns gives $AV = U\\Sigma$, hence $A = U\\Sigma V^\\top$. ∎</li>
     </ul>
     <p><b>Why truncation is optimal.</b> The error of dropping the smaller singular values is $\\lVert A - A_k\\rVert = \\sigma_{k+1}$ — no other rank-$k$ matrix does better (the Eckart–Young theorem). So keeping the biggest $\\sigma$'s keeps the most of $A$.</p>`,
  example:
    `<p>Suppose a matrix has singular values $\\sigma = (10, 8, 1, 0.2)$.</p>
     <ul class="steps">
       <li>"Energy" is measured by $\\sigma_i^2$: total $= 100 + 64 + 1 + 0.04 = 165.04$.</li>
       <li>Keep the top 2: captured energy $= 100 + 64 = 164$, which is $164/165.04 \\approx 99.4\\%$.</li>
       <li>So a rank-2 approximation $A_2$ keeps over 99% of the matrix while storing far fewer numbers.</li>
       <li>The reconstruction error is the next singular value, $\\sigma_3 = 1$ — small compared to $\\sigma_1=10$.</li>
     </ul>`,
  application:
    `<p>Image compression: keep the top-$k$ singular values of the pixel matrix. Latent Semantic Analysis and recommender systems factor the user–item matrix this way to find hidden topics/tastes. PCA is the SVD of the centered data matrix. SVD also gives the numerically stable pseudo-inverse for least squares.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 600; cv.height = 320; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var sig = [10, 8, 4, 1.6, 0.6, 0.2];
    var k = 2;
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      var ox = 50, baseY = 200, bw = 48, gap = 16, maxH = 150, maxV = sig[0];
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      var total = 0, kept = 0;
      for (var i = 0; i < sig.length; i++) { total += sig[i] * sig[i]; if (i < k) kept += sig[i] * sig[i]; }
      for (var j = 0; j < sig.length; j++) {
        var h = maxH * sig[j] / maxV;
        var x = ox + j * (bw + gap);
        var on = (j < k);
        ctx.fillStyle = on ? c.accent : (c.dim + "55");
        ctx.fillRect(x, baseY - h, bw, h);
        ctx.strokeStyle = on ? c.accent : c.border; ctx.lineWidth = 1.5;
        ctx.strokeRect(x, baseY - h, bw, h);
        ctx.fillStyle = on ? c.ink : c.dim; ctx.font = "13px sans-serif";
        ctx.fillText("σ" + (j + 1), x + bw / 2, baseY + 18);
        ctx.fillText(sig[j].toFixed(1), x + bw / 2, baseY - h - 6);
      }
      // divider line after k
      var dx = ox + k * (bw + gap) - gap / 2;
      ctx.strokeStyle = c.warn; ctx.setLineDash([5, 4]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(dx, baseY - maxH - 24); ctx.lineTo(dx, baseY + 6); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = c.warn; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("keep ◂", dx - 60, baseY - maxH - 28);
      ctx.fillText("▸ drop", dx + 6, baseY - maxH - 28);
      // readout
      ctx.textAlign = "left"; ctx.font = "14px sans-serif"; ctx.fillStyle = c.ink;
      ctx.fillText("rank-" + k + " approximation keeps the " + k + " biggest singular values", 50, 250);
      var pct = 100 * kept / total;
      ctx.fillStyle = c.accent2;
      ctx.fillText("energy kept = " + pct.toFixed(1) + "%   (energy ∝ Σσ²)", 50, 274);
      var err = (k < sig.length) ? sig[k] : 0;
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("reconstruction error ‖A − Aₖ‖ = σ" + (k + 1) + " = " + err.toFixed(1), 50, 296);
    }
    var wrap = document.createElement("div"); wrap.style.margin = "8px 0"; wrap.style.fontSize = "13px"; wrap.style.color = "var(--ink)";
    var lab = document.createElement("span"); lab.textContent = "k (rank kept) "; wrap.appendChild(lab);
    var s = document.createElement("input"); s.type = "range"; s.min = "1"; s.max = "6"; s.step = "1"; s.value = "2";
    var out = document.createElement("span"); out.textContent = " = 2"; out.style.color = "var(--accent)";
    s.addEventListener("input", function () { k = parseInt(s.value, 10); out.textContent = " = " + k; draw(); });
    wrap.appendChild(s); wrap.appendChild(out); host.appendChild(wrap);
    draw();
  },
  quiz: {
    q: `A matrix has singular values $(6, 3, 1)$. Roughly what fraction of its "energy" ($\\sum\\sigma_i^2$) does the rank-1 approximation keep?`,
    a: `<p>Total energy $= 36 + 9 + 1 = 46$. Rank-1 keeps $\\sigma_1^2 = 36$. Fraction $= 36/46 \\approx 78\\%$. A single singular value already captures most of the matrix.</p>`
  }
});

/* ================================================================ 11 */
L({
  id: "la-hessian",
  title: "The Hessian",
  tagline: "The matrix of second derivatives. It tells you the curvature, and whether you're convex.",
  prereqs: ["fnd-gradient", "la-psd", "la-determinant"],
  bigIdea:
    `<p>The <b>Hessian</b> is the matrix of all second partial derivatives of a function of several inputs.</p>
     <p>Where the gradient gives slope (first derivative), the Hessian gives <b>curvature</b> (second derivative): how the slope itself bends, in every pair of directions.</p>
     <p>The big payoff: a function is <b>convex</b> (one global bowl, easy to minimize) exactly when its Hessian is positive semi-definite everywhere.</p>`,
  buildup:
    `<p>For one variable, the second derivative $f''(x)$ tells you the bend: positive = bowl up, negative = bump down.</p>
     <p>With many variables, you need the bend between every pair of directions. Collect them all into a square matrix — that is the Hessian.</p>`,
  symbols: [
    { sym: "$f$", desc: "a function from $n$ inputs to one number, $f(x_1,\\dots,x_n)$." },
    { sym: "$H$", desc: "the Hessian: an $n\\times n$ matrix of second partial derivatives." },
    { sym: "$H_{ij}$", desc: "entry $(i,j)$: the second partial derivative, first by $x_i$ then by $x_j$." },
    { sym: "$\\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$", desc: "differentiate $f$ with respect to $x_j$, then with respect to $x_i$ (curly $\\partial$ = 'partial')." },
    { sym: "$\\nabla f$", desc: "the gradient (first derivatives); the Hessian is its derivative." }
  ],
  formula: `$$ H_{ij} = \\frac{\\partial^2 f}{\\partial x_i\\, \\partial x_j}, \\qquad H = \\nabla^2 f, \\qquad f \\text{ convex} \\Longleftrightarrow H \\succeq 0 $$`,
  whatItDoes:
    `<p>Each entry $H_{ij}$ measures how the slope in direction $i$ changes as you move in direction $j$. The diagonal entries are the pure curvatures; the off-diagonals are the cross-curvatures.</p>
     <p>For nice functions $H$ is symmetric ($H_{ij}=H_{ji}$). Test its sign: PSD everywhere means a convex bowl, so gradient descent finds the one true minimum.</p>`,
  derivation:
    `<p><b>Why PSD Hessian means convex.</b> Convexity says the function never dips below its tangent line. We connect that to curvature via Taylor's expansion.</p>
     <ul class="steps">
       <li>Second-order Taylor around a point $x$: $f(x+d) \\approx f(x) + \\nabla f(x)^\\top d + \\tfrac12 d^\\top H d$ for a small step $d$.</li>
       <li>The tangent (linear) prediction is $f(x) + \\nabla f(x)^\\top d$. The function sits above it exactly when the leftover $\\tfrac12 d^\\top H d \\ge 0$.</li>
       <li>That leftover is $\\ge 0$ for <i>every</i> direction $d$ precisely when $H$ is positive semi-definite (the PSD condition $d^\\top H d \\ge 0$ from the PSD lesson).</li>
       <li>If this holds at every point, the function never dips below any tangent — the definition of convex. So $H \\succeq 0$ everywhere $\\Leftrightarrow$ $f$ convex. ∎</li>
     </ul>
     <p>That is why checking the Hessian's eigenvalue signs tells you the shape: all $\\ge 0$ is a bowl (minimum); mixed signs is a saddle.</p>`,
  example:
    `<p>Let $f(x_1,x_2) = x_1^2 + 3x_2^2$. Find its Hessian.</p>
     <ul class="steps">
       <li>Gradient: $\\frac{\\partial f}{\\partial x_1} = 2x_1$, $\\frac{\\partial f}{\\partial x_2} = 6x_2$.</li>
       <li>Second derivatives: $\\frac{\\partial^2 f}{\\partial x_1^2} = 2$, $\\frac{\\partial^2 f}{\\partial x_2^2} = 6$, and the cross term $\\frac{\\partial^2 f}{\\partial x_1\\partial x_2} = 0$.</li>
       <li>So $H = \\begin{bmatrix}2 & 0\\\\ 0 & 6\\end{bmatrix}$ — constant here.</li>
       <li>Eigenvalues $2$ and $6$ are both $> 0$, so $H \\succeq 0$: the function is convex, a bowl with its minimum at the origin.</li>
     </ul>
     <p>Compare $g = x_1^2 - x_2^2$: its Hessian is $\\begin{bmatrix}2&0\\\\0&-2\\end{bmatrix}$, eigenvalues $2$ and $-2$ — a saddle, not convex.</p>`,
  application:
    `<p>Newton's method steps with $H^{-1}\\nabla f$, using curvature to converge far faster than plain gradient descent. Checking the Hessian's eigenvalue signs classifies critical points (min, max, saddle). Convex loss functions (the Hessian stays PSD) are why linear and logistic regression train reliably to the global optimum.</p>`,
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 560; cv.height = 360; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    // f = a*x^2 + b*y^2 ; contours are ellipses (convex) when a,b>0, hyperbolas (saddle) when signs differ
    var a = 1, b = 3;
    var rng = 3, P = 28, cx = 200, cy = 185, sc = (160 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(P, cy); ctx.lineTo(380, cy);
      ctx.moveTo(cx, P); ctx.lineTo(cx, cy + (160 - P)); ctx.stroke();
      var convex = (a > 0 && b > 0);
      // draw contour curves f = level by sampling the implicit curve as points
      var levels = [0.5, 1.5, 3, 5, 7.5];
      ctx.lineWidth = 1.6;
      for (var li = 0; li < levels.length; li++) {
        var Lv = levels[li];
        ctx.strokeStyle = (convex ? c.accent : c.warn) + "aa";
        ctx.beginPath();
        var started = false;
        for (var t = 0; t <= 200; t++) {
          var th = t / 200 * Math.PI * 2;
          // parametrize: for convex use ellipse; for saddle sample along x and solve y where possible
          var X, Y, ok = true;
          if (convex) {
            X = Math.sqrt(Lv / a) * Math.cos(th);
            Y = Math.sqrt(Lv / b) * Math.sin(th);
          } else {
            // a*x^2 + b*y^2 = Lv with b<0 -> hyperbola; sample x, solve y^2=(Lv-a x^2)/b
            X = -rng + 2 * rng * t / 200;
            var yy = (Lv - a * X * X) / b;
            if (yy < 0) { ok = false; Y = 0; } else { Y = Math.sqrt(yy); }
          }
          if (!ok) { started = false; continue; }
          if (Math.abs(X) > rng + 0.5 || Math.abs(Y) > rng + 0.5) { started = false; continue; }
          if (!started) { ctx.moveTo(px(X), py(Y)); started = true; } else ctx.lineTo(px(X), py(Y));
        }
        ctx.stroke();
        if (!convex) {
          // mirror lower branch
          ctx.beginPath(); started = false;
          for (var t2 = 0; t2 <= 200; t2++) {
            var X2 = -rng + 2 * rng * t2 / 200;
            var yy2 = (Lv - a * X2 * X2) / b;
            if (yy2 < 0) { started = false; continue; }
            var Y2 = -Math.sqrt(yy2);
            if (Math.abs(Y2) > rng + 0.5) { started = false; continue; }
            if (!started) { ctx.moveTo(px(X2), py(Y2)); started = true; } else ctx.lineTo(px(X2), py(Y2));
          }
          ctx.stroke();
        }
      }
      // point at origin + curvature arrows along axes
      ctx.fillStyle = c.purple; ctx.beginPath(); ctx.arc(px(0), py(0), 4, 0, Math.PI * 2); ctx.fill();
      // caption in the clear top-left corner, away from the contours and the center dot
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText("evaluate H at (0,0)", P, P - 16);
      ctx.textBaseline = "alphabetic";
      // readout
      var rx = 400;
      ctx.textAlign = "left"; ctx.font = "14px sans-serif"; ctx.fillStyle = c.ink;
      ctx.fillText("f = a·x² + b·y²", rx, 60);
      ctx.fillText("H = [[2a, 0],", rx, 88);
      ctx.fillText("      [0, 2b]]", rx, 106);
      ctx.fillStyle = c.accent2; ctx.fillText("a = " + a + ",  b = " + b, rx, 134);
      ctx.font = "16px sans-serif";
      if (convex) { ctx.fillStyle = c.accent; ctx.fillText("H ≻ 0: convex", rx, 168); ctx.font = "12px sans-serif"; ctx.fillStyle = c.dim; ctx.fillText("ellipse contours, a bowl", rx, 188); }
      else { ctx.fillStyle = c.warn; ctx.fillText("not PSD: saddle", rx, 168); ctx.font = "12px sans-serif"; ctx.fillStyle = c.dim; ctx.fillText("hyperbola contours", rx, 188); }
    }
    function slider(label, init, set) {
      var wrap = document.createElement("div"); wrap.style.margin = "3px 0"; wrap.style.fontSize = "13px"; wrap.style.color = "var(--ink)";
      var lab = document.createElement("span"); lab.textContent = label + " "; wrap.appendChild(lab);
      var s = document.createElement("input"); s.type = "range"; s.min = "-2"; s.max = "3"; s.step = "1"; s.value = String(init);
      var out = document.createElement("span"); out.textContent = " = " + init; out.style.color = "var(--accent)";
      s.addEventListener("input", function () { var v = parseFloat(s.value); if (v === 0) v = (init > 0 ? 1 : -1); set(v); out.textContent = " = " + v; draw(); });
      wrap.appendChild(s); wrap.appendChild(out); host.appendChild(wrap);
    }
    slider("a (x-curvature)", a, function (v) { a = v; });
    slider("b (y-curvature)", b, function (v) { b = v; });
    draw();
  },
  quiz: {
    q: `For $f(x,y) = 4x^2 + y^2$, write the Hessian and say whether $f$ is convex.`,
    a: `<p>Second derivatives: $f_{xx}=8$, $f_{yy}=2$, $f_{xy}=0$. So $H=\\begin{bmatrix}8&0\\\\0&2\\end{bmatrix}$. Eigenvalues $8$ and $2$ are both positive, so $H \\succeq 0$ and $f$ is convex (a bowl).</p>`
  }
});

})();
