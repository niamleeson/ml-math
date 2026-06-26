/* Per-lesson CODE VISUALIZATIONS — 05-linalg.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["la-matmul"] = {
  question: "How does each entry of a matrix product get computed, and what goes wrong with shape or order?",
  charts: [
    {
      type: "heatmap",
      title: "The product AB: each cell is one row-dot-column",
      rows: ["A row 1", "A row 2"],
      cols: ["B col 1", "B col 2"],
      matrix: [[19, 22], [43, 50]],
      showVals: true,
      interpret: "Rows label which row of A you used; columns label which column of B. The number in a cell is that row dotted with that column, e.g. top-left 19 = 1*5 + 2*7. Read any cell as 'row i of A meets column j of B'. These are the real computed entries of AB for A=[[1,2],[3,4]], B=[[5,6],[7,8]]."
    },
    {
      type: "bars",
      title: "Order matters: AB is not BA",
      labels: ["(1,1)", "(1,2)", "(2,1)", "(2,2)"],
      series: [
        { name: "AB", color: "#4ea1ff", points: [[0, 19], [1, 22], [2, 43], [3, 50]] },
        { name: "BA", color: "#ffb454", points: [[0, 23], [1, 34], [2, 31], [3, 46]] }
      ],
      interpret: "Each group is one position of the 2x2 result; blue is AB, orange is BA, with the same A and B. The bars differ at every position, so AB and BA are different matrices. Conclusion: matrix multiply is not commutative, so swapping factors (or dropping a transpose) silently changes the answer rather than erroring."
    },
    {
      type: "heatmap",
      title: "Shape mismatch: inner dimensions disagree, product undefined",
      rows: ["A row 1", "A row 2", "A row 3"],
      cols: ["B col 1", "B col 2"],
      matrix: [[0, 0], [0, 0], [0, 0]],
      showVals: false,
      interpret: "Illustrative: here A is 3x4 and B is 3x2, so the inner numbers (4 and 3) do not match. No cell can be filled because you cannot dot a length-4 row of A with a length-3 column of B. An empty/greyed grid like this stands for 'shape error' -- the most common matmul bug. Always print shapes: only (m x n)(n x p) is legal, giving m x p."
    }
  ],
  caption: "",
  code: "const A = [[1,2],[3,4]], B = [[5,6],[7,8]];\nconst AB = A.map(row => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));\nconsole.log(AB); // [[19,22],[43,50]] -- each cell is one row dotted with one column"
};

window.CODEVIZ["la-transpose"] = {
  question: "What does transposing actually move, and how do you spot the special cases (symmetric) and the classic order mistake?",
  charts: [
    {
      type: "heatmap",
      title: "Transpose flips across the diagonal: entry (i,j) goes to (j,i)",
      rows: ["row 1", "row 2", "row 3"],
      cols: ["col 1", "col 2"],
      matrix: [[1, 4], [2, 5], [3, 6]],
      showVals: true,
      interpret: "This is A transpose for A=[[1,2,3],[4,5,6]]: A was 2x3, so A-transpose is 3x2 (the shape flips). Read it against the original: the 3 that sat at A row 1 col 3 now sits here at row 3 col 1 -- indices swapped. Every off-diagonal value has crossed the main diagonal; the values themselves are unchanged."
    },
    {
      type: "heatmap",
      title: "Symmetric matrix: transpose changes nothing",
      rows: ["row 1", "row 2", "row 3"],
      cols: ["col 1", "col 2", "col 3"],
      matrix: [[2, 7, 5], [7, 3, 1], [5, 1, 9]],
      showVals: true,
      interpret: "Illustrative symmetric matrix: it is a mirror image across the diagonal, so entry (i,j) already equals entry (j,i) (the 7s, 5s, 1s come in matched pairs). Transposing it gives back the identical matrix: A-transpose = A. When you see this mirror symmetry, you can skip the transpose -- but only then; assuming symmetry on a non-symmetric matrix is a bug."
    },
    {
      type: "bars",
      title: "Reversal rule: (AB) transpose = B-transpose A-transpose, not A-transpose B-transpose",
      labels: ["(1,1)", "(1,2)", "(2,1)", "(2,2)"],
      series: [
        { name: "B-transpose A-transpose (correct)", color: "#7ee787", points: [[0, 2], [1, 4], [2, 1], [3, 3]] },
        { name: "A-transpose B-transpose (wrong)", color: "#ff7b72", points: [[0, 3], [1, 1], [2, 4], [3, 2]] }
      ],
      interpret: "Each group is one position of the result; green is the correct order B-transpose then A-transpose, red is the flipped order. Both use the same A=[[1,2],[3,4]], B=[[0,1],[1,0]]. Green matches (AB)-transpose=[[2,4],[1,3]]; red gives a different matrix. Takeaway: transposing a product reverses the factor order, like undoing socks-then-shoes -- get it backwards and the answer is silently wrong."
    }
  ],
  caption: "",
  code: "const A = [[1,2,3],[4,5,6]];\nconst At = A[0].map((_, j) => A.map(row => row[j]));\nconsole.log(At); // [[1,4],[2,5],[3,6]] -- entry (i,j) becomes (j,i); 2x3 becomes 3x2"
};

window.CODEVIZ["la-identity-diagonal"] = {
  question: "What does a diagonal matrix actually do to a shape — and how do you read it off the diagonal entries?",
  code: `// A diagonal matrix scales each axis independently.
// D = [[d1,0],[0,d2]] sends (x,y) -> (d1*x, d2*y).
const d1 = 2, d2 = 3;
const square = [[0,0],[1,0],[1,1],[0,1]];
const scaled = square.map(function (p) { return [d1*p[0], d2*p[1]]; });
// scaled = [[0,0],[2,0],[2,3],[0,3]] -> unit square becomes 2-wide, 3-tall.
// Area goes from 1 to d1*d2 = 6. The identity is just d1=d2=1 (no change).`,
  charts: [
    {
      type: "bars",
      title: "Diagonal D = diag(2, 3): each axis scaled on its own",
      labels: ["x-axis (d1)", "y-axis (d2)"],
      values: [2, 3],
      valueLabels: ["×2", "×3"],
      colors: ["#ffb454", "#c89bff"],
      interpret: "<b>Each bar is one diagonal entry</b> — how much that coordinate axis is stretched. The x-axis (orange) is multiplied by 2, the y-axis (purple) by 3, with <b>no mixing</b> between them because every off-diagonal entry is 0. A unit square therefore becomes a 2-by-3 rectangle, so the area is multiplied by 2×3 = 6. Read a diagonal matrix this way: one independent scale factor per axis."
    },
    {
      type: "bars",
      title: "Identity I = diag(1, 1): the 'do nothing' matrix",
      labels: ["x-axis", "y-axis"],
      values: [1, 1],
      valueLabels: ["×1", "×1"],
      colors: ["#7ee787", "#7ee787"],
      interpret: "<b>Every diagonal entry is exactly 1</b>, so both axes are scaled by 1 — nothing moves. This is the identity: Ix = x and AI = A. Recognise it as the flat, all-equal-to-one bar pattern (green = healthy / neutral). It is the matrix analogue of the number 1, and the baseline every other diagonal is measured against."
    },
    {
      type: "bars",
      title: "Uniform scale cI = diag(2, 2): same factor everywhere",
      labels: ["x-axis", "y-axis"],
      values: [2, 2],
      valueLabels: ["×2", "×2"],
      colors: ["#4ea1ff", "#4ea1ff"],
      interpret: "<b>All diagonal entries are equal to the same constant c = 2</b>, so this is c·I: a pure zoom. Every direction is stretched by the same amount, so shapes change size but never change proportions or direction — a circle stays a circle. When the bars are equal but above 1, you are looking at a uniform scaling, not a shape-distorting one. (Illustrative of the equal-entries case.)"
    },
    {
      type: "bars",
      title: "Singular diagonal D = diag(2, 0): one axis collapses",
      labels: ["x-axis (d1)", "y-axis (d2)"],
      values: [2, 0],
      valueLabels: ["×2", "×0"],
      colors: ["#ffb454", "#ff7b72"],
      interpret: "<b>A zero on the diagonal (red) flattens that whole axis to nothing.</b> The y-coordinate of every point is multiplied by 0, so the square is squashed onto a horizontal line — area becomes 0 and the map cannot be undone (no inverse, since 1/d2 = 1/0 blows up). Watch for any tiny or zero diagonal entry: it signals a singular or ill-conditioned matrix hiding in plain sight."
    }
  ]
};

window.CODEVIZ["la-inverse"] = {
  question: "The inverse undoes a matrix — but how can you SEE whether an undo is clean, shaky, or impossible?",
  code: `// A^-1 reverses A. Apply A, then A^-1, and you return to the start.
const A = [[2,1],[1,1]];
const det = A[0][0]*A[1][1] - A[0][1]*A[1][0]; // 2*1 - 1*1 = 1
// 2x2 inverse: swap a,d; negate b,c; divide by det.
const Ainv = [[ A[1][1]/det, -A[0][1]/det],
              [-A[1][0]/det,  A[0][0]/det]]; // [[1,-1],[-1,2]]
const v = [3,5];
const Av = [A[0][0]*v[0]+A[0][1]*v[1], A[1][0]*v[0]+A[1][1]*v[1]]; // [11,8]
const back = [Ainv[0][0]*Av[0]+Ainv[0][1]*Av[1],
              Ainv[1][0]*Av[0]+Ainv[1][1]*Av[1]]; // [3,5] = v again`,
  charts: [
    {
      type: "scatter",
      title: "Clean undo: A then A-inverse returns v exactly (det = 1)",
      xlabel: "x coordinate",
      ylabel: "y coordinate",
      groups: [
        { name: "v (start)", color: "#9aa7b4", points: [[3, 5]] },
        { name: "A·v (moved)", color: "#4ea1ff", points: [[11, 8]] },
        { name: "A-inv·(A·v) (back)", color: "#7ee787", points: [[3, 5]] }
      ],
      interpret: "<b>Each axis is a coordinate of the point.</b> Grey is the starting vector v = (3,5). Blue is where A sends it, (11,8) — A mixed the coordinates and moved it far. Green is the result of applying A-inverse to the blue point, and it lands <b>exactly back on grey</b>. That perfect return is what 'invertible' means: A-inverse·(A·v) = v, which is why x = A-inverse·b solves Ax = b."
    },
    {
      type: "bars",
      title: "Why this inverse is trustworthy: condition number is small",
      labels: ["det A", "condition number"],
      values: [1, 2.6],
      valueLabels: ["1.0", "≈2.6"],
      colors: ["#7ee787", "#7ee787"],
      interpret: "<b>The determinant (left) is comfortably non-zero, so an inverse exists; the condition number (right) is small, so it is stable.</b> A small condition number near 1 means input errors are barely amplified when you invert. This is the healthy case: green bars, det well away from 0, condition number low. Judge an inverse by conditioning, not just by det ≠ 0."
    },
    {
      type: "bars",
      title: "Near-singular: det tiny, condition number explodes",
      labels: ["det A", "condition number"],
      values: [0.02, 500],
      valueLabels: ["0.02", "≈500"],
      colors: ["#ffb454", "#ff7b72"],
      interpret: "<b>When det A (orange) is nearly 0 the inverse still exists on paper, but the condition number (red) blows up.</b> A huge condition number means A-inverse has enormous entries and tiny changes in the input swing the output wildly — the undo is numerically shaky and rounding error swamps the answer. The lesson: a non-zero but tiny determinant is a warning sign, so check conditioning before trusting an inverse. (Illustrative magnitudes.)"
    },
    {
      type: "scatter",
      title: "No inverse: a singular matrix collapses the plane to a line",
      xlabel: "x coordinate",
      ylabel: "y coordinate",
      groups: [
        { name: "original points", color: "#9aa7b4", points: [[1, 0], [0, 1], [1, 1], [2, 0]] },
        { name: "after singular A", color: "#ff7b72", points: [[1, 1], [1, 1], [2, 2], [2, 2]] }
      ],
      lines: [
        { color: "#ff7b72", dash: true, points: [[0, 0], [3, 3]] }
      ],
      interpret: "<b>A singular matrix (det = 0) flattens every point onto a single line (red dashed), destroying a whole dimension.</b> Distinct grey inputs are crushed onto overlapping red points on that line, so the information needed to tell them apart is gone — and once it is gone, nothing can recover it. That is exactly why <b>no inverse exists when det = 0</b>: the map is not reversible. (Illustrative collapse.)"
    }
  ]
};

window.CODEVIZ["la-determinant"] = {
  question: "What does the determinant tell you about how a matrix reshapes space?",
  charts: [
    {
      type: "scatter",
      title: "Healthy: det A = 5 stretches the unit square to a 5x-bigger parallelogram",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "unit-square corners", color: "#9aa7b4", points: [[0, 0], [1, 0], [1, 1], [0, 1]] },
        { name: "image corners", color: "#4ea1ff", points: [[0, 0], [3, 1], [4, 3], [1, 2]] }
      ],
      lines: [
        { name: "unit square (area 1)", color: "#9aa7b4", dash: true, points: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]] },
        { name: "image parallelogram (area 5)", color: "#4ea1ff", points: [[0, 0], [3, 1], [4, 3], [1, 2], [0, 0]] }
      ],
      interpret: "The grey dashed shape is the original unit square (area 1); the blue shape is where A=[[3,1],[1,2]] sends it. The two blue edges out of the origin are the columns of A. The blue region is 5x larger, and that factor IS det A = 5. <b>Read it as:</b> a determinant well above 0 means A spreads space out and is safely invertible."
    },
    {
      type: "scatter",
      title: "Singular: det B = 0 collapses the square onto a line",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "unit-square corners", color: "#9aa7b4", points: [[0, 0], [1, 0], [1, 1], [0, 1]] },
        { name: "image (all on one line)", color: "#ff7b72", points: [[0, 0], [2, 1], [6, 3], [4, 2]] }
      ],
      lines: [
        { name: "unit square (area 1)", color: "#9aa7b4", dash: true, points: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]] },
        { name: "image squashed to a line (area 0)", color: "#ff7b72", points: [[0, 0], [2, 1], [6, 3], [4, 2], [0, 0]] }
      ],
      interpret: "Here B=[[2,4],[1,2]] has parallel columns (4,2) is just 2x (2,1), so the square flattens onto a single line: area 0, det B = 0. <b>Read it as:</b> when the image has no thickness, the matrix lost a dimension, it is singular and cannot be undone. In floating point you will see a tiny det like 1e-16, not exact 0, so check the condition number instead."
    },
    {
      type: "scatter",
      title: "Flipped: det C = -2 (negative) mirrors the square as it scales",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "unit-square corners (CCW order)", color: "#9aa7b4", points: [[0, 0], [1, 0], [1, 1], [0, 1]] },
        { name: "image corners (CW order = flipped)", color: "#ffb454", points: [[0, 0], [1, 2], [2, 2], [1, 0]] }
      ],
      lines: [
        { name: "unit square (area 1)", color: "#9aa7b4", dash: true, points: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]] },
        { name: "image, area 2, orientation reversed", color: "#ffb454", points: [[0, 0], [1, 2], [2, 2], [1, 0], [0, 0]] }
      ],
      interpret: "C=[[1,1],[2,0]] has det = 1*0 - 1*2 = -2. The image has area |det| = 2, but the corner order reversed from counter-clockwise to clockwise, the shape was mirrored. <b>Read it as:</b> the size of det is the area scale; the sign is orientation. Negative means a flip. For a probability density you want |det| (or log|det|), because a literal negative det would give a negative volume."
    }
  ],
  caption: "Size of det = area-scale factor; sign = orientation; zero = collapse (singular).",
  code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[3., 1.], [1., 2.]])
det = np.linalg.det(A)                   # 5.0
square = np.array([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]])
image = square @ A.T                      # transform each corner

fig, ax = plt.subplots(figsize=(6, 5))
ax.plot(square[:, 0], square[:, 1], color='#9aa7b4',
        linestyle='--', label='unit square (area 1)')
ax.plot(image[:, 0], image[:, 1], color='#4ea1ff',
        label='image parallelogram (area ' + str(round(det)) + ')')
ax.scatter(image[:-1, 0], image[:-1, 1], color='#4ea1ff')
ax.set_title('|det A| = ' + str(round(det)))
ax.set_xlabel('x'); ax.set_ylabel('y'); ax.legend()
plt.tight_layout()
plt.show()`
};

window.CODEVIZ["la-cofactor"] = {
  question: "How do the signed cofactor terms combine into one determinant, and when does the recipe break down?",
  charts: [
    {
      type: "bars",
      title: "Healthy: expand along row 1, the three signed terms sum to det A = 7",
      labels: ["+ 2*det(4)", "- 0*det(10)", "+ 1*det(-1)", "det A"],
      values: [8, 0, -1, 7],
      valueLabels: ["+8", "0", "-1", "7"],
      colors: ["#4ea1ff", "#9aa7b4", "#ff7b72", "#7ee787"],
      interpret: "Each blue/red bar is one term of the expansion of A=[[2,0,1],[3,1,2],[1,0,4]] along row 1: the entry times its checkerboard sign times its 2x2 minor determinant. The grey bar is 0 because its entry is 0. The green bar is their sum, 8 + 0 + (-1) = 7, which equals numpy's det(A). <b>Read it as:</b> when the signed bars add up to the same det you get any other way, the +/-/+ pattern was tracked correctly."
    },
    {
      type: "heatmap",
      title: "Shortcut: a sparse line means only one term survives",
      rows: ["row 1", "row 2", "row 3", "row 4"],
      cols: ["col 1", "col 2 (only a 5)", "col 3", "col 4"],
      matrix: [[7, 0, 2, 4], [1, 5, 9, 3], [6, 0, 8, 2], [4, 0, 1, 5]],
      showVals: true,
      interpret: "Illustrative 4x4. Column 2 is all zeros except the single 5 in row 2. Expand along THAT column and every zero entry kills its term, so the whole determinant collapses to one signed term: (-1)^(2+2) * 5 * (the 3x3 minor). <b>Read it as:</b> always scan for the row or column with the most zeros and expand along it, you replace four 3x3 minors with one. Choosing a dense line instead just multiplies your hand-work."
    },
    {
      type: "line",
      title: "Why never for large n: cofactor cost (n!) explodes past LU (n^3)",
      xlabel: "matrix size n",
      ylabel: "operations (log10 scale)",
      series: [
        { name: "cofactor expansion ~ n! (red)", color: "#ff7b72", points: [[2, 0.30], [3, 0.78], [4, 1.38], [5, 2.08], [6, 2.86], [7, 3.70], [8, 4.61], [9, 5.56], [10, 6.56]] },
        { name: "LU factorization ~ n^3 (green)", color: "#7ee787", points: [[2, 0.90], [3, 1.43], [4, 1.81], [5, 2.10], [6, 2.33], [7, 2.53], [8, 2.71], [9, 2.86], [10, 3.00]] }
      ],
      interpret: "Illustrative. The y-axis is log10 of the operation count, so each step up is 10x more work. The red curve (cofactor expansion, about n! operations) starts below green but rockets past it, by n=10 it is roughly 10^6 ops vs LU's 10^3. <b>Read it as:</b> cofactor expansion is fine for the 2x2-to-4x4 hand and theory work this lesson is about, but for any real matrix the curves cross and you must switch to an LU-based det (what numpy does)."
    }
  ],
  caption: "Ideal: signed terms sum to det=7. Variants: sparse-line shortcut, and the n! cost blow-up that bans cofactors for large n.",
  code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[2, 0, 1], [3, 1, 2], [1, 0, 4]], dtype=float)
terms = []
for j in range(3):                        # expand along first row
    minor = np.delete(np.delete(A, 0, 0), j, 1)
    terms.append(((-1) ** j) * A[0, j] * np.linalg.det(minor))
detA = np.linalg.det(A)                    # 7.0

labels = ['+ 2*det(4)', '- 0*det(10)', '+ 1*det(-1)', 'det A']
vals = [round(t) for t in terms] + [round(detA)]
fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(labels, vals, color=['#4ea1ff', '#9aa7b4', '#ff7b72', '#7ee787'])
ax.axhline(0, color='#9aa7b4', linewidth=0.8)
ax.set_title('cofactor terms sum to det A = ' + str(round(detA)))
plt.tight_layout()
plt.show()`
};

window.CODEVIZ["la-trace"] = {
  question: "The trace is just the diagonal sum, so why does it also equal the sum of the eigenvalues?",
  charts: [
    {
      type: "bars",
      title: "Ideal: diagonal sum and eigenvalue sum land on the same trace = 11",
      series: [
        { name: "diagonal entries", color: "#4ea1ff", points: [["A11 = 2", 2], ["A22 = 3", 3], ["A33 = 6", 6]] },
        { name: "eigenvalues", color: "#c89bff", points: [["lambda 1", 0.68], ["lambda 2", 3.88], ["lambda 3", 6.44]] }
      ],
      labels: ["entry 1", "entry 2", "entry 3"],
      interpret: "<b>How to read it:</b> the height of each bar is one number; the two colours are two <i>different</i> sets of three numbers for the same matrix A. Blue bars are the diagonal entries (2, 3, 6); purple bars are the eigenvalues (0.68, 3.88, 6.44). Bar-by-bar they do not match, but each set <b>adds to 11</b>. <b>Conclude:</b> the trace (cheap diagonal sum) gives you the eigenvalue total for free, no eigen-solve needed."
    },
    {
      type: "bars",
      title: "Cyclic property: tr(AB) = tr(BA) even though AB and BA differ",
      labels: ["tr(A)", "tr(B)", "tr(AB)", "tr(BA)"],
      values: [5, 2, 6, 6],
      valueLabels: ["5", "2", "6", "6"],
      colors: ["#9aa7b4", "#9aa7b4", "#7ee787", "#7ee787"],
      interpret: "<b>How to read it:</b> each bar is the trace of one matrix. The two grey bars on the left are tr(A) and tr(B) for reference; the two green bars are tr(AB) and tr(BA). The green bars are <b>equal</b> (both 6) even though the products AB and BA are different matrices. <b>Conclude:</b> you may swap the order inside a trace, which is what lets you reorder a product into the cheaper shape before contracting."
    },
    {
      type: "bars",
      title: "Variant: a non-symmetric matrix with COMPLEX eigenvalues (illustrative)",
      labels: ["A11 = 1", "A22 = 1", "Re(lambda 1)", "Re(lambda 2)"],
      values: [1, 1, 1, 1],
      valueLabels: ["1", "1", "1+i", "1-i"],
      colors: ["#4ea1ff", "#4ea1ff", "#ffb454", "#ffb454"],
      interpret: "<b>What you might see:</b> for the non-symmetric matrix [[1,-1],[1,1]] the eigenvalues are the complex pair 1+i and 1-i. Each bar here plots only the <i>real part</i> (illustrative: the bars are height 1, the labels carry the imaginary parts). <b>How to read it:</b> the blue diagonal sums to 2; the orange real parts also sum to 2 because the imaginary parts (+i and -i) cancel. <b>Conclude:</b> trace = sum of eigenvalues still holds, but the eigenvalues are complex, so do not expect each one to be a real number you can read off the diagonal."
    }
  ],
  caption: "Diagonal sum, eigenvalue sum, and the cyclic tr(AB)=tr(BA) are three faces of the same trace.",
  code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[2., 1., 0.], [4., 3., 5.], [1., 0., 6.]])
diag = np.diag(A)                          # 2, 3, 6 -> trace 11
eigs = np.sort(np.linalg.eigvals(A).real)  # ~0.68, 3.88, 6.44

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
ax1.bar(['A11=2', 'A22=3', 'A33=6'], diag, color='#4ea1ff')
ax1.set_title('diagonal sums to trace = ' + str(int(diag.sum())))
ax2.bar(['lambda 1', 'lambda 2', 'lambda 3'], eigs, color='#c89bff')
ax2.set_title('eigenvalues sum to ' + str(round(eigs.sum())))
for ax, vals in [(ax1, diag), (ax2, eigs)]:
    for i, v in enumerate(vals):
        ax.text(i, v, str(round(v, 2)), ha='center', va='bottom')
plt.tight_layout()
plt.show()`
};

window.CODEVIZ["la-rank-independence"] = {
  question: "What does linear independence look like, and how do singular values reveal when the rank quietly drops?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: independent columns reach new directions; a dependent column lies on a line",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "independent: v1, v2 (full rank)", color: "#7ee787", points: [[1, 0], [0, 1]] },
        { name: "dependent: every vector on one line (rank drops)", color: "#ff7b72", points: [[1, 0.5], [2, 1], [3, 1.5]] }
      ],
      lines: [
        { name: "the line every dependent vector lies on", color: "#ff7b72", dash: true, points: [[0, 0], [3, 1.5]] }
      ],
      interpret: "<b>How to read it:</b> each dot is a column vector plotted by its (x, y) coordinates. Green dots point in two different directions, so they span the whole plane. Red dots all sit on the dashed red line through the origin, so they point the same way and add no new direction. <b>Conclude:</b> independent columns spread out (full rank); when one column is a combination of the others they collapse onto a line and the rank falls."
    },
    {
      type: "bars",
      title: "Singular values: full rank (all > 0) vs rank-deficient (one is exactly 0)",
      series: [
        { name: "full rank A", color: "#7ee787", points: [["sigma 1", 2.6], ["sigma 2", 1.0]] },
        { name: "rank-deficient B", color: "#ff7b72", points: [["sigma 1", 3.0], ["sigma 2", 0.0]] }
      ],
      labels: ["sigma 1", "sigma 2"],
      interpret: "<b>How to read it:</b> bar height is a singular value (the stretch along each independent direction), sorted largest first. Green: both bars are clearly above zero, so the matrix has 2 real directions = full rank. Red: the second bar is flat on zero, meaning one direction collapsed = rank 1. <b>Conclude:</b> count the non-zero singular values to get the rank. A zero singular value means the matrix is singular (det = 0, no inverse)."
    },
    {
      type: "bars",
      title: "Variant: NEAR-collinear features (illustrative) — tiny but non-zero singular value",
      labels: ["sigma 1", "sigma 2"],
      values: [3.0, 0.004],
      valueLabels: ["3.0", "0.004"],
      colors: ["#4ea1ff", "#ffb454"],
      interpret: "<b>What you might see:</b> two almost-duplicate features. The first singular value is large; the second is tiny but <i>not exactly zero</i> (illustrative 0.004). <b>How to read it:</b> an exact-rank test still reports full rank because nothing is zero, yet the huge ratio sigma1/sigma2 (the condition number) flags trouble. <b>Conclude:</b> in floating point you judge rank by thresholding small singular values, not by checking for exact zeros — near-collinearity makes X.T X ill-conditioned and the regression fit blows up just like true rank deficiency."
    }
  ],
  caption: "Independence spreads vectors into new directions; singular values count the real ones, and a tiny-but-nonzero one warns of near-collinearity.",
  code: `import numpy as np
import matplotlib.pyplot as plt

v1 = np.array([1., 0.])                    # independent basis vectors
v2 = np.array([0., 1.])
dep = np.array([[1, 0.5], [2, 1], [3, 1.5]])   # all on one line
A = np.column_stack([v1, v2, 2 * v1 + 3 * v2])
print('rank', np.linalg.matrix_rank(A))    # 2 of 3
print('singular values', np.linalg.svd(A, compute_uv=False))

fig, ax = plt.subplots(figsize=(6, 5))
ax.scatter([v1[0], v2[0]], [v1[1], v2[1]], color='#7ee787',
           s=80, label='independent: v1, v2')
ax.scatter(dep[:, 0], dep[:, 1], color='#ff7b72',
           s=80, label='dependent (rank drops)')
ax.plot([0, 3], [0, 1.5], color='#ff7b72', linestyle='--',
        label='line every dependent vector lies on')
ax.set_xlabel('x'); ax.set_ylabel('y'); ax.legend()
plt.tight_layout()
plt.show()`
};

window.CODEVIZ["la-psd"] = {
  question: "How do you READ whether a symmetric matrix is a bowl (PSD) or a saddle (not), from its quadratic form and its eigenvalues?",
  charts: [
    {
      type: "line",
      title: "PSD: quadratic form xᵀAx sliced along each eigen-axis (A = [[2,0],[0,1]])",
      xlabel: "position t along an eigen-axis (x = t·eigenvector)",
      ylabel: "value of the quadratic form xᵀAx",
      series: [
        { name: "along λ₁=2 axis: 2t²", color: "#7ee787",
          points: [[-2,8],[-1.5,4.5],[-1,2],[-0.5,0.5],[0,0],[0.5,0.5],[1,2],[1.5,4.5],[2,8]] },
        { name: "along λ₂=1 axis: 1t²", color: "#4ea1ff",
          points: [[-2,4],[-1.5,2.25],[-1,1],[-0.5,0.25],[0,0],[0.5,0.25],[1,1],[1.5,2.25],[2,4]] }
      ],
      interpret: "The x-axis walks a test point out from the origin along one eigenvector; the y-axis is the quadratic form xᵀAx there. Both curves are upward parabolas that touch zero only at the centre and rise everywhere else, because each eigenvalue is positive (slice value = λ·t²). When EVERY slice opens upward like this, the surface is a bowl: the matrix is <b>PSD</b>, and gradient descent on it lands at the single bottom."
    },
    {
      type: "bars",
      title: "PSD eigenvalue spectrum: all bars at or above zero",
      labels: ["λ₁", "λ₂"],
      values: [2, 1],
      colors: ["#7ee787", "#4ea1ff"],
      interpret: "Each bar is one eigenvalue. The shortcut test for PSD is exactly this: <b>no bar dips below zero</b>. Here both are positive, so the matrix is positive-definite (a strict bowl). A bar sitting exactly at zero would still be PSD but singular (a flat direction); a bar below zero would break PSD."
    },
    {
      type: "line",
      title: "NOT PSD (saddle): one slice bends DOWN — B = [[1,0],[0,-1]], λ = +1, -1",
      xlabel: "position t along an eigen-axis",
      ylabel: "value of the quadratic form xᵀBx",
      series: [
        { name: "along λ=+1 axis: +t²", color: "#7ee787",
          points: [[-2,4],[-1,1],[0,0],[1,1],[2,4]] },
        { name: "along λ=-1 axis: -t²", color: "#ff7b72",
          points: [[-2,-4],[-1.5,-2.25],[-1,-1],[-0.5,-0.25],[0,0],[0.5,-0.25],[1,-1],[1.5,-2.25],[2,-4]] }
      ],
      interpret: "Illustrative of a saddle. One slice (green) still curves up, but the red slice curves <b>down</b> below zero: feeding the second eigenvector into xᵀBx gives a negative number. A single negative direction is enough to fail PSD — you do not need all directions to be bad. The tell-tale sign is one parabola opening downward, mirroring the one negative eigenvalue."
    },
    {
      type: "bars",
      title: "Near-PSD with numerical noise: a tiny negative bar from rounding",
      labels: ["λ₁", "λ₂", "λ₃"],
      values: [4.0, 1.2, -0.001],
      valueLabels: ["4.0", "1.2", "-0.001"],
      colors: ["#7ee787", "#4ea1ff", "#ffb454"],
      interpret: "Illustrative. A covariance or kernel that <i>should</i> be PSD often comes back with one almost-zero eigenvalue that rounding pushed slightly negative (the amber bar). Read this not as 'not PSD' but as 'PSD up to noise': clip the tiny negative eigenvalue to zero, or add a small εI (jitter), and Cholesky will succeed again."
    }
  ],
  caption: "Read PSD two ways: every directional slice of xᵀAx opens upward (a bowl), equivalently every eigenvalue bar sits at or above zero.",
  code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[2.0, 0.0], [0.0, 1.0]])   # symmetric, PSD
lam, U = np.linalg.eigh(A)               # eigenvalues, orthonormal eigenvectors
print("eigenvalues:", lam)               # [1. 2.] -> all >= 0  => PSD

t = np.linspace(-2, 2, 9)
for i in range(2):                       # slice xAx along each eigen-axis
    x = np.outer(t, U[:, i])             # points x = t * eigenvector_i
    z = np.einsum('ti,ij,tj->t', x, A, x)  # quadratic form at each point
    plt.plot(t, z, label=f"lambda={lam[i]:.0f}")
plt.axhline(0, color='gray', lw=0.8)
plt.xlabel("t along an eigen-axis"); plt.ylabel("x^T A x")
plt.legend(); plt.show()`
};

window.CODEVIZ["la-spectral"] = {
  question: "How do you READ a symmetric matrix as rotate-stretch-rotate: a unit circle becoming an ellipse aligned to perpendicular eigen-axes?",
  charts: [
    {
      type: "scatter",
      title: "A = [[2,1],[1,2]]: unit circle → ellipse, eigen-axes perpendicular (λ = 3, 1)",
      xlabel: "x",
      ylabel: "y",
      groups: [],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[1,0],[0.866,0.5],[0.5,0.866],[0,1],[-0.5,0.866],[-0.866,0.5],[-1,0],[-0.866,-0.5],[-0.5,-0.866],[0,-1],[0.5,-0.866],[0.866,-0.5],[1,0]] },
        { color: "#4ea1ff", points: [[2,1],[2.232,1.866],[1.866,2.232],[1,2],[-0.134,1.232],[-1.232,0.134],[-2,-1],[-2.232,-1.866],[-1.866,-2.232],[-1,-2],[0.134,-1.232],[1.232,-0.134],[2,1]] },
        { color: "#ffb454", points: [[-2.121,-2.121],[2.121,2.121]] },
        { color: "#c89bff", points: [[0.707,-0.707],[-0.707,0.707]] }
      ],
      interpret: "Grey dashed = the unit circle (all directions, length 1). Blue = where A sends it: an ellipse. The orange line is the λ=3 eigen-axis — A stretches that direction 3×, so it is the ellipse's long axis; the purple line is the λ=1 axis, stretched 1× (unchanged), the short axis. The two axes meet at <b>90°</b>: that perpendicularity is the whole point of the spectral theorem, and it is why a symmetric matrix only stretches along clean axes and never shears."
    },
    {
      type: "bars",
      title: "The stretch factors are the eigenvalues (Λ in A = UΛUᵀ)",
      labels: ["λ₁ (long axis)", "λ₂ (short axis)"],
      values: [3, 1],
      colors: ["#ffb454", "#c89bff"],
      interpret: "Each bar is how much A stretches along its matching eigen-axis — these are the diagonal entries of Λ. The long ellipse axis is the bigger eigenvalue (3), the short axis the smaller (1). Reading off the ellipse's axis lengths and tilt recovers Λ and U directly; in PCA these bars are the variances along each principal direction."
    },
    {
      type: "scatter",
      title: "Repeated eigenvalue (λ = 2, 2): circle stays a circle, axes are ambiguous",
      xlabel: "x",
      ylabel: "y",
      groups: [],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[1,0],[0.707,0.707],[0,1],[-0.707,0.707],[-1,0],[-0.707,-0.707],[0,-1],[0.707,-0.707],[1,0]] },
        { color: "#7ee787", points: [[2,0],[1.414,1.414],[0,2],[-1.414,1.414],[-2,0],[-1.414,-1.414],[0,-2],[1.414,-1.414],[2,0]] }
      ],
      interpret: "Illustrative of A = 2·I. Both eigenvalues are equal, so the circle scales uniformly into a bigger circle — there is no long or short axis. The eigenvectors are then only defined up to rotation within the plane: any perpendicular pair works. Practical read: when eigenvalues tie, do NOT read meaning into the individual eigenvector directions a solver hands back."
    },
    {
      type: "scatter",
      title: "Singular case (λ = 2, 0): ellipse collapses onto a line — a flat direction",
      xlabel: "x",
      ylabel: "y",
      groups: [],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[1,0],[0.707,0.707],[0,1],[-0.707,0.707],[-1,0],[-0.707,-0.707],[0,-1],[0.707,-0.707],[1,0]] },
        { color: "#ff7b72", points: [[1.414,1.414],[1,1],[0,0],[-1,-1],[-1.414,-1.414]] }
      ],
      interpret: "Illustrative of A = [[1,1],[1,1]] (λ = 2 and 0). One eigenvalue is zero, so that eigen-axis is stretched by 0: the whole circle is flattened onto a single line through the origin (red), losing a dimension. This matrix is PSD but singular — the flat direction means it has no inverse, and Cholesky would fail there. A near-zero (not exactly zero) eigenvalue gives a razor-thin ellipse, the visual signature of an ill-conditioned matrix."
    }
  ],
  caption: "A symmetric A turns the unit circle into an ellipse: the perpendicular eigen-axes are the principal axes, and each eigenvalue is the stretch along its axis.",
  code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[2.0, 1.0], [1.0, 2.0]])   # symmetric
lam, U = np.linalg.eigh(A)               # eigenvalues, orthonormal eigenvectors
print("Lambda:", lam)                    # [1. 3.]
print("Uts U:", U.T @ U)                 # ~ identity => U is a rotation

th = np.linspace(0, 2*np.pi, 200)
circle = np.vstack([np.cos(th), np.sin(th)])   # unit circle
ellipse = A @ circle                           # A maps it to an ellipse

plt.plot(circle[0], circle[1], '--', color='gray', label='unit circle')
plt.plot(ellipse[0], ellipse[1], color='#4ea1ff', label='A . circle')
for i in range(2):                             # draw each eigen-axis, scaled by lambda
    v = U[:, i] * lam[i]
    plt.plot([-v[0], v[0]], [-v[1], v[1]], lw=2)
plt.gca().set_aspect('equal'); plt.legend(); plt.show()`
};

window.CODEVIZ["la-svd"] = {
  question: "How do you read a singular-value spectrum to decide how many components to keep -- and when does truncation fail?",
  charts: [
    {
      type: "bars",
      title: "Singular-value spectrum: fast decay, keep top-2 (rank-2)",
      labels: ["s1", "s2", "s3", "s4", "s5", "s6"],
      values: [10, 8, 4, 1.6, 0.6, 0.2],
      valueLabels: ["10.0", "8.0", "4.0", "1.6", "0.6", "0.2"],
      colors: ["#4ea1ff", "#4ea1ff", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      interpret: "Each bar is one singular value, sorted biggest-first left to right -- the stretch factor of one direction of the matrix. Blue bars (s1, s2) are the components you keep; grey ones you drop. Energy is the SUM OF SQUARES: keeping s1,s2 holds (100+64)/(100+64+16+2.56+0.36+0.04) = 164/182.96 = 89.6% of the matrix's energy, and the reconstruction error equals the first dropped value, s3 = 4.0. A spectrum that drops off a cliff like this is the ideal case: a few components carry almost everything, so a low-rank approximation compresses well."
    },
    {
      type: "line",
      title: "Cumulative energy vs rank kept (the same fast-decay case)",
      xlabel: "number of singular values kept (k)",
      ylabel: "fraction of energy kept (sum of squared s)",
      series: [
        { name: "energy kept", color: "#7ee787", points: [[0, 0], [1, 0.546], [2, 0.896], [3, 0.983], [4, 0.997], [5, 0.9998], [6, 1.0]] }
      ],
      interpret: "X-axis is how many singular values you keep; Y-axis is the cumulative fraction of energy (running sum of squared singular values, normalized to 1). The curve shoots up then flattens: the 'elbow' near k=2 to 3 is where extra components stop buying you much. Pick k at the elbow -- here k=3 already captures 98%. Reading this curve is how you choose rank without guessing: chase the knee, not the tail."
    },
    {
      type: "bars",
      title: "Slow/flat spectrum: no good low-rank approximation",
      labels: ["s1", "s2", "s3", "s4", "s5", "s6"],
      values: [10, 9.2, 8.5, 7.9, 7.3, 6.8],
      valueLabels: ["10.0", "9.2", "8.5", "7.9", "7.3", "6.8"],
      colors: ["#4ea1ff", "#4ea1ff", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
      interpret: "Illustrative. Here the bars barely shrink -- every direction stretches almost equally, so the matrix is genuinely high-rank (think near-random or full-rank noise). Keeping the top 2 (blue) now captures only about (100+85)/(sum) = 38% of the energy, and the first dropped value s3 = 8.5 is almost as big as s1. The flag to recognize: a nearly flat spectrum means truncation throws away real signal, so compression and denoising will hurt. You need most of the components."
    },
    {
      type: "bars",
      title: "One dominant spike: effectively rank-1",
      labels: ["s1", "s2", "s3", "s4", "s5", "s6"],
      values: [12, 0.5, 0.3, 0.2, 0.1, 0.05],
      valueLabels: ["12.0", "0.5", "0.3", "0.2", "0.1", "0.05"],
      colors: ["#4ea1ff", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      interpret: "Illustrative. A single tall bar then a flat floor of tiny values means the matrix is essentially rank-1: one direction (s1=12) carries nearly all the energy and the rest is noise. Keeping just k=1 already holds about 99.6% (144 / 144.4). Recognize this when one outer product u1*v1^T reconstructs almost the whole matrix -- common in strongly correlated data. The tiny tail values are the ones that, if you invert them for a pseudo-inverse, blow up noise; truncate them away."
    }
  ],
  caption: "",
  code: "const s = [10, 8, 4, 1.6, 0.6, 0.2]; // singular values, sorted desc\nconst sq = s.map(v => v * v);\nconst total = sq.reduce((a, b) => a + b, 0);\nconst k = 2;\nconst kept = sq.slice(0, k).reduce((a, b) => a + b, 0);\nconsole.log('energy kept', (100 * kept / total).toFixed(1) + '%'); // 89.6%\nconsole.log('reconstruction error = next sigma =', s[k]); // 4 (Eckart-Young)"
};

window.CODEVIZ["la-jacobian"] = {
  question: "How do you read the Jacobian's columns as a local linear map, and what does its determinant tell you about area and orientation?",
  charts: [
    {
      type: "scatter",
      title: "Jacobian columns at (1, 0.6): unit square -> parallelogram, det J = 5.44",
      xlabel: "output x",
      ylabel: "output y",
      groups: [
        { name: "J e1 (image of input x-axis)", color: "#4ea1ff", points: [[2, 1.2]] },
        { name: "J e2 (image of input y-axis)", color: "#7ee787", points: [[-1.2, 2]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]] },
        { color: "#4ea1ff", dash: false, points: [[0, 0], [2, 1.2], [0.8, 3.2], [-1.2, 2], [0, 0]] }
      ],
      interpret: "Real numbers for f(x,y) = (x^2 - y^2, 2xy) at (1, 0.6), where J = [[2x, -2y],[2y, 2x]] = [[2, -1.2],[1.2, 2]]. The dashed grey unit square is a tiny input patch; the blue parallelogram is where J sends it. Each ARROW is one column of J: the blue arrow is where the input x-direction lands, the green arrow where the input y-direction lands. The parallelogram's AREA equals det J = 2*2 - (-1.2)*1.2 = 5.44, so a tiny square's area is stretched by about 5.4x here. That area factor is the whole point of det J."
    },
    {
      type: "line",
      title: "det J grows away from the origin: det = 4(x^2 + y^2) along y = x",
      xlabel: "x (with y = x)",
      ylabel: "det J = local area-scaling factor",
      series: [
        { name: "det J", color: "#4ea1ff", points: [[0, 0], [0.25, 0.5], [0.5, 2], [0.75, 4.5], [1, 8], [1.25, 12.5], [1.5, 18]] }
      ],
      interpret: "Same map f(x,y) = (x^2 - y^2, 2xy), walking outward along the line y = x so det J = 4(x^2 + y^2) = 8x^2. Y-axis is how much the Jacobian stretches local area at that point. The curve rises steeply: near the origin area barely changes, but far out a tiny square balloons. Reading this: the Jacobian is a LOCAL map -- its stretch depends on WHERE you evaluate it, not a single global number. At x=1 the factor is 8; double the distance and it quadruples."
    },
    {
      type: "scatter",
      title: "Negative det: the map flips orientation (illustrative)",
      xlabel: "output x",
      ylabel: "output y",
      groups: [
        { name: "J e1", color: "#4ea1ff", points: [[1.5, 1]] },
        { name: "J e2", color: "#ffb454", points: [[1, -0.5]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]] },
        { color: "#ffb454", dash: false, points: [[0, 0], [1.5, 1], [2.5, 0.5], [1, -0.5], [0, 0]] }
      ],
      interpret: "Illustrative, with columns J e1 = (1.5, 1) and J e2 = (1, -0.5), so J = [[1.5, 1],[1, -0.5]] and det J = 1.5*(-0.5) - 1*1 = -1.75, a NEGATIVE determinant. In the input square you go from the x-axis (e1) to the y-axis (e2) counter-clockwise; in the image, going from the blue arrow (J e1) to the orange arrow (J e2) turns the other way -- the patch has been mirror-flipped. Recognize a negative det by this reversed turning order. |det J| = 1.75 is still the area factor (the patch's area); the SIGN tells you orientation was flipped (-) rather than preserved (+)."
    },
    {
      type: "scatter",
      title: "Singular Jacobian: det J near 0, the square collapses to a line",
      xlabel: "output x",
      ylabel: "output y",
      groups: [
        { name: "J e1", color: "#ff7b72", points: [[2, 1]] },
        { name: "J e2", color: "#ff7b72", points: [[4, 2]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]] },
        { color: "#ff7b72", dash: false, points: [[0, 0], [2, 1], [6, 3], [4, 2], [0, 0]] }
      ],
      interpret: "Illustrative. Here both columns of J point the SAME way -- J e2 = (4,2) is exactly 2x J e1 = (2,1), so they are parallel. The 'parallelogram' has zero area: the unit square is squashed flat onto a single line. That means det J = 0 -- a SINGULAR Jacobian. Recognize it when the column arrows line up (collapse to one direction). The local linear approximation loses a dimension, the map is non-invertible here, and Newton steps that solve J*delta = -f blow up. This is the robot-arm-fully-extended / non-invertible-flow-layer failure mode."
    }
  ],
  caption: "",
  code: "// f(x,y) = (x^2 - y^2, 2xy);  Jacobian J = [[2x, -2y],[2y, 2x]]\nfunction jacobian(x, y) { return [[2 * x, -2 * y], [2 * y, 2 * x]]; }\nconst J = jacobian(1, 0.6);            // [[2, -1.2], [1.2, 2]]\nconst det = J[0][0] * J[1][1] - J[0][1] * J[1][0];\nconsole.log('det J =', det.toFixed(2)); // 5.44 = local area-scaling factor\n// det J = 4(x^2 + y^2): a tiny square's area is multiplied by det J"
};

window.CODEVIZ["la-hessian"] = {
  question: "How do you read the curvature of a loss surface off the Hessian, and tell a convex bowl from a saddle or a flat valley?",
  charts: [
    {
      type: "heatmap",
      title: "Ideal: Hessian of f(x,y) = x^2 + xy + 2y^2, eigenvalues 1.59 and 4.41 (both > 0, convex)",
      rows: ["d/dx", "d/dy"],
      cols: ["d/dx", "d/dy"],
      matrix: [[2, 1], [1, 4]],
      showVals: true,
      interpret: "Each cell is a second derivative: cell (row i, col j) is how the slope in direction i changes as you move in direction j. The two diagonal cells (2 and 4) are the pure up/down curvatures along each axis; the off-diagonal 1's are the cross-curvature (the matrix is symmetric, so they match). The real diagnostic is the <b>eigenvalues</b> of this matrix: here they are 1.59 and 4.41, <b>both positive</b>, so every direction curves upward and the surface is a <b>convex bowl</b> with a single minimum."
    },
    {
      type: "line",
      title: "Ideal read-out: slice the surface through the minimum along each eigenvector",
      xlabel: "step away from the minimum (along one eigenvector)",
      ylabel: "function value (rise above the minimum)",
      series: [
        { name: "soft direction, eigenvalue 1.59", color: "#7ee787", points: [[-2, 3.17], [-1.5, 1.78], [-1, 0.79], [-0.5, 0.2], [0, 0], [0.5, 0.2], [1, 0.79], [1.5, 1.78], [2, 3.17]] },
        { name: "stiff direction, eigenvalue 4.41", color: "#4ea1ff", points: [[-2, 8.83], [-1.5, 4.97], [-1, 2.21], [-0.5, 0.55], [0, 0], [0.5, 0.55], [1, 2.21], [1.5, 4.97], [2, 8.83]] }
      ],
      interpret: "These are 1-D slices of the surface taken through the minimum, one per eigenvector. Both curves are upward parabolas (value = half the eigenvalue times step squared), so the bottom is a true minimum in <b>every</b> direction. The blue curve is steeper because its eigenvalue (4.41) is larger: that is the <b>stiff</b> direction. The green curve is gentler (eigenvalue 1.59): the <b>soft</b> direction. The ratio 4.41 / 1.59 = 2.8 is the condition number, telling you how lopsided the bowl is and how much plain gradient descent will zig-zag."
    },
    {
      type: "heatmap",
      title: "Variant 1 - Saddle: Hessian [[2,0],[0,-2]], eigenvalues +2 and -2 (indefinite, illustrative)",
      rows: ["d/dx", "d/dy"],
      cols: ["d/dx", "d/dy"],
      matrix: [[2, 0], [0, -2]],
      showVals: true,
      interpret: "This is the Hessian of g(x,y) = x^2 - y^2 (illustrative). The diagonal has <b>mixed signs</b>: +2 (curves up along x) and -2 (curves down along y). Its eigenvalues are +2 and -2, so the matrix is <b>indefinite</b> - neither PSD nor negative-definite. You recognise a saddle whenever the eigenvalues straddle zero: the point is a minimum along one direction and a maximum along another. A raw Newton step here can move <i>uphill</i>, so this is exactly where second-order optimisers need damping or eigenvalue clipping."
    },
    {
      type: "line",
      title: "Variant 1 - Saddle slices: up one way, down the other (illustrative)",
      xlabel: "step from the saddle point (along each axis)",
      ylabel: "function value",
      series: [
        { name: "x-axis, eigenvalue +2 (curves up)", color: "#7ee787", points: [[-2, 4], [-1.5, 2.25], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4]] },
        { name: "y-axis, eigenvalue -2 (curves down)", color: "#ff7b72", points: [[-2, -4], [-1.5, -2.25], [-1, -1], [-0.5, -0.25], [0, 0], [0.5, -0.25], [1, -1], [1.5, -2.25], [2, -4]] }
      ],
      interpret: "Illustrative slices through the saddle point. The green curve (positive eigenvalue) opens upward - move along x and the value rises. The red curve (negative eigenvalue) opens downward - move along y and the value falls. Because one slice goes up and the other goes down, the centre is <b>not a minimum</b>: it is a saddle. Telltale sign on a chart like this: the two slices through the same critical point bend in opposite directions."
    },
    {
      type: "line",
      title: "Variant 2 - Degenerate / flat valley: a zero eigenvalue gives a direction with no curvature (illustrative)",
      xlabel: "step from the critical point (along each eigenvector)",
      ylabel: "function value",
      series: [
        { name: "curved direction, eigenvalue 2 (a real bowl)", color: "#4ea1ff", points: [[-2, 4], [-1.5, 2.25], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4]] },
        { name: "flat direction, eigenvalue 0 (no curvature)", color: "#ffb454", points: [[-2, 0], [-1.5, 0], [-1, 0], [-0.5, 0], [0, 0], [0.5, 0], [1, 0], [1.5, 0], [2, 0]] }
      ],
      interpret: "Illustrative slices for a Hessian like [[2,0],[0,0]], eigenvalues 2 and 0. The blue slice is a normal upward bowl, but the amber slice is <b>perfectly flat</b>: its eigenvalue is 0, so the surface has <b>no curvature</b> there. This is a <b>positive semi-definite but singular</b> Hessian - still technically convex (nothing dips below the tangent), but the minimum is a whole flat valley, not a single point. The Hessian is singular, so Newton's H-inverse step blows up along the flat direction; this is the degenerate / under-determined case where you need regularisation (add a small lambda along the diagonal) to pin down a unique solution."
    }
  ],
  caption: "Read curvature off the Hessian's eigenvalues: all positive = convex bowl (ideal); mixed signs = saddle; a zero eigenvalue = a flat, degenerate direction.",
  code: `import numpy as np
import matplotlib.pyplot as plt

def f(v):
    x, y = v
    return x**2 + x*y + 2*y**2            # true Hessian [[2,1],[1,4]]

h = 1e-4
H = np.zeros((2, 2))
for i in range(2):                        # Hessian via finite differences
    for j in range(2):
        ei, ej = np.zeros(2), np.zeros(2); ei[i] = h; ej[j] = h
        H[i, j] = (f(ei+ej) - f(ei-ej) - f(-ei+ej) + f(-ei-ej)) / (4*h*h)
w, V = np.linalg.eigh(H)                   # both positive -> convex bowl
print('eigenvalues', w)                    # ~[1.59, 4.41]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
ax1.imshow(H, cmap='Blues')
for i in range(2):
    for j in range(2):
        ax1.text(j, i, str(round(H[i, j])), ha='center', va='center')
ax1.set_title('Hessian (finite differences)')
ax1.set_xticks([0, 1], ['d/dx', 'd/dy']); ax1.set_yticks([0, 1], ['d/dx', 'd/dy'])

t = np.linspace(-2, 2, 9)
for lam, col, name in [(w[0], '#7ee787', 'soft dir'), (w[1], '#4ea1ff', 'stiff dir')]:
    ax2.plot(t, 0.5 * lam * t**2, color=col, label=name + ' eig=' + str(round(lam, 2)))
ax2.set_xlabel('step along an eigenvector'); ax2.set_ylabel('function value'); ax2.legend()
plt.tight_layout()
plt.show()`
};
