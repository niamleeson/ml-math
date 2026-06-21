/* =====================================================================
   MODULE 5 — LINEAR ALGEBRA: per-lesson CODE VISUALIZATIONS.
   One window.CODEVIZ entry per lesson id in 05-linalg.js (13 lessons).
   Numbers are REAL: produced by running the matching code in
   code-05-linalg.js through python3 + numpy.linalg, then embedded.
   Chart types: heatmap | bars | scatter | line.
   Colors: blue #4ea1ff, green #7ee787, amber #ffb454, red #ff7b72, purple #c89bff.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "la-matmul": {
    question: "Where does each entry of A @ B come from, and why is AB different from BA?",
    charts: [
      {
        type: "heatmap",
        title: "A @ B  (each cell = one row of A dotted with one column of B)",
        rows: ["row 1", "row 2"],
        cols: ["col 1", "col 2"],
        matrix: [[19, 22], [43, 50]],
        showVals: true
      },
      {
        type: "heatmap",
        title: "B @ A  (different result: matrix multiply is not commutative)",
        rows: ["row 1", "row 2"],
        cols: ["col 1", "col 2"],
        matrix: [[23, 34], [31, 46]],
        showVals: true
      }
    ],
    caption: "A @ B and B @ A are both valid 2x2 products but hold different numbers, so order matters.",
    code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
AB = A @ B           # 19,22 / 43,50
BA = B @ A           # 23,34 / 31,46

fig, axes = plt.subplots(1, 2, figsize=(8, 4))
for ax, M, title in zip(axes, [AB, BA], ['A @ B', 'B @ A']):
    ax.imshow(M, cmap='Blues')
    for i in range(2):
        for j in range(2):
            ax.text(j, i, str(M[i, j]), ha='center', va='center')
    ax.set_title(title)
    ax.set_xticks([0, 1]); ax.set_yticks([0, 1])
plt.tight_layout()
plt.show()`
  },

  "la-transpose": {
    question: "What does flipping a matrix across its diagonal do to its shape and entries?",
    charts: [
      {
        type: "heatmap",
        title: "A  (2 rows x 3 cols)",
        rows: ["row 1", "row 2"],
        cols: ["col 1", "col 2", "col 3"],
        matrix: [[1, 2, 3], [4, 5, 6]],
        showVals: true
      },
      {
        type: "heatmap",
        title: "A.T  (3 rows x 2 cols): entry (i,j) becomes (j,i)",
        rows: ["row 1", "row 2", "row 3"],
        cols: ["col 1", "col 2"],
        matrix: [[1, 4], [2, 5], [3, 6]],
        showVals: true
      }
    ],
    caption: "Transpose turns the 2x3 grid into a 3x2 grid; row 1 of A becomes column 1 of A.T.",
    code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[1, 2, 3], [4, 5, 6]])    # 2x3
At = A.T                                 # 3x2: entry (i,j) -> (j,i)

fig, axes = plt.subplots(1, 2, figsize=(8, 4))
for ax, M, title in zip(axes, [A, At], ['A (2x3)', 'A.T (3x2)']):
    ax.imshow(M, cmap='Blues')
    for i in range(M.shape[0]):
        for j in range(M.shape[1]):
            ax.text(j, i, str(M[i, j]), ha='center', va='center')
    ax.set_title(title)
    ax.set_xticks(range(M.shape[1])); ax.set_yticks(range(M.shape[0]))
plt.tight_layout()
plt.show()`
  },

  "la-identity-diagonal": {
    question: "How does a diagonal matrix D scale a vector compared to the do-nothing identity?",
    charts: [
      {
        type: "heatmap",
        title: "D = diag(2, 3, 5)  (off-diagonal entries are zero)",
        rows: ["axis 1", "axis 2", "axis 3"],
        cols: ["axis 1", "axis 2", "axis 3"],
        matrix: [[2, 0, 0], [0, 3, 0], [0, 0, 5]],
        showVals: true
      },
      {
        type: "bars",
        title: "D scales each coordinate of x = (4, 5, 6) independently",
        labels: ["x1 times 2", "x2 times 3", "x3 times 5"],
        values: [8, 15, 30],
        valueLabels: ["8", "15", "30"],
        colors: ["#4ea1ff", "#7ee787", "#ffb454"]
      }
    ],
    caption: "Each diagonal entry stretches one axis on its own: D @ (4,5,6) = (8,15,30).",
    code: `import numpy as np
import matplotlib.pyplot as plt

d = np.array([2., 3., 5.])
D = np.diag(d)                  # diag(2,3,5)
x = np.array([4., 5., 6.])
scaled = D @ x                  # 8, 15, 30

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
ax1.imshow(D, cmap='Blues')
for i in range(3):
    for j in range(3):
        ax1.text(j, i, str(int(D[i, j])), ha='center', va='center')
ax1.set_title('D = diag(2, 3, 5)')
labels = ['x1 times 2', 'x2 times 3', 'x3 times 5']
ax2.bar(labels, scaled, color=['#4ea1ff', '#7ee787', '#ffb454'])
for i, v in enumerate(scaled):
    ax2.text(i, v, str(int(v)), ha='center', va='bottom')
ax2.set_title('D scales each coordinate')
plt.tight_layout()
plt.show()`
  },

  "la-inverse": {
    question: "How does A-inverse undo A, returning a vector to exactly where it started?",
    charts: [
      {
        type: "scatter",
        title: "A moves v; A-inverse maps the result back onto v",
        xlabel: "x",
        ylabel: "y",
        groups: [
          { name: "v (start)", color: "#7ee787", points: [[3, 5]] },
          { name: "A.v (moved)", color: "#4ea1ff", points: [[11, 8]] }
        ],
        lines: [
          { name: "apply A", color: "#4ea1ff", points: [[3, 5], [11, 8]] },
          { name: "apply A-inverse (back to v)", color: "#c89bff", dash: true, points: [[11, 8], [3, 5]] }
        ]
      },
      {
        type: "heatmap",
        title: "A-inverse of A = [[2,1],[1,1]]",
        rows: ["row 1", "row 2"],
        cols: ["col 1", "col 2"],
        matrix: [[1, -1], [-1, 2]],
        showVals: true
      }
    ],
    caption: "A sends v=(3,5) to (11,8); A-inverse carries (11,8) straight back to (3,5), so A-inverse(A.v)=v.",
    code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[2., 1.], [1., 1.]])
Ainv = np.linalg.inv(A)          # [[1,-1],[-1,2]]
v = np.array([3., 5.])
Av = A @ v                       # (11, 8)
back = Ainv @ Av                 # back to (3, 5)

fig, ax = plt.subplots(figsize=(6, 5))
ax.scatter(*v, color='#7ee787', s=80, label='v (start)')
ax.scatter(*Av, color='#4ea1ff', s=80, label='A.v (moved)')
ax.plot([v[0], Av[0]], [v[1], Av[1]], color='#4ea1ff', label='apply A')
ax.plot([Av[0], back[0]], [Av[1], back[1]], color='#c89bff',
        linestyle='--', label='apply A-inverse')
ax.set_xlabel('x'); ax.set_ylabel('y'); ax.legend()
plt.tight_layout()
plt.show()`
  },

  "la-determinant": {
    question: "Why is det(A) the factor by which A scales area?",
    charts: [
      {
        type: "scatter",
        title: "Unit square (area 1) becomes a parallelogram of area |det A| = 5",
        xlabel: "x",
        ylabel: "y",
        groups: [
          { name: "unit-square corners", color: "#9aa7b4", points: [[0, 0], [1, 0], [1, 1], [0, 1]] },
          { name: "image corners", color: "#4ea1ff", points: [[0, 0], [3, 1], [4, 3], [1, 2]] }
        ],
        lines: [
          { name: "unit square (area 1)", color: "#9aa7b4", dash: true, points: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]] },
          { name: "image parallelogram (area 5)", color: "#4ea1ff", points: [[0, 0], [3, 1], [4, 3], [1, 2], [0, 0]] }
        ]
      }
    ],
    caption: "A=[[3,1],[1,2]] sends the area-1 unit square to a parallelogram of area 5, which equals det A.",
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
  },

  "la-cofactor": {
    question: "How do the signed cofactor terms along the first row sum to the determinant?",
    charts: [
      {
        type: "heatmap",
        title: "A with checkerboard signs (+ - + along the first row used for expansion)",
        rows: ["row 1 (+,-,+)", "row 2", "row 3"],
        cols: ["col 1", "col 2", "col 3"],
        matrix: [[2, 0, 1], [3, 1, 2], [1, 0, 4]],
        showVals: true
      },
      {
        type: "bars",
        title: "Cofactor terms (sign * entry * minor-det) sum to det A = 7",
        labels: ["+ 2*det4", "- 0*det10", "+ 1*det(-1)", "det A"],
        values: [8, 0, -1, 7],
        valueLabels: ["8", "0", "-1", "7"],
        colors: ["#4ea1ff", "#9aa7b4", "#ff7b72", "#7ee787"]
      }
    ],
    caption: "Expanding along row 1: 8 + 0 + (-1) = 7, matching numpy det(A) = 7.",
    code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[2, 0, 1], [3, 1, 2], [1, 0, 4]], dtype=float)
terms = []
for j in range(3):                        # expand along first row
    minor = np.delete(np.delete(A, 0, 0), j, 1)
    terms.append(((-1) ** j) * A[0, j] * np.linalg.det(minor))
detA = np.linalg.det(A)                    # 7.0

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
ax1.imshow(A, cmap='Blues')
for i in range(3):
    for j in range(3):
        ax1.text(j, i, str(int(A[i, j])), ha='center', va='center')
ax1.set_title('A with cofactor signs')
labels = ['+ 2*det4', '- 0*det10', '+ 1*det(-1)', 'det A']
vals = [round(t) for t in terms] + [round(detA)]
ax2.bar(labels, vals, color=['#4ea1ff', '#9aa7b4', '#ff7b72', '#7ee787'])
ax2.set_title('cofactor terms sum to det A')
plt.tight_layout()
plt.show()`
  },

  "la-trace": {
    question: "Why does the trace (sum of the diagonal) equal the sum of the eigenvalues?",
    charts: [
      {
        type: "bars",
        title: "Diagonal entries of A: they sum to the trace = 11",
        labels: ["A[0,0]=2", "A[1,1]=3", "A[2,2]=6"],
        values: [2, 3, 6],
        valueLabels: ["2", "3", "6"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff"]
      },
      {
        type: "bars",
        title: "Eigenvalues of A: a different set of numbers that sum to the same 11",
        labels: ["lambda 1", "lambda 2", "lambda 3"],
        values: [0.6806, 3.8767, 6.4427],
        valueLabels: ["0.68", "3.88", "6.44"],
        colors: ["#c89bff", "#c89bff", "#c89bff"]
      }
    ],
    caption: "Diagonal (2,3,6) and eigenvalues (0.68,3.88,6.44) look different but both add to 11 = trace.",
    code: `import numpy as np
import matplotlib.pyplot as plt

A = np.array([[2., 1., 0.], [4., 3., 5.], [1., 0., 6.]])
diag = np.diag(A)                          # 2, 3, 6 -> trace 11
eigs = np.sort(np.linalg.eigvals(A).real)  # ~0.68, 3.88, 6.44

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
ax1.bar(['A[0,0]=2', 'A[1,1]=3', 'A[2,2]=6'], diag, color='#4ea1ff')
ax1.set_title('diagonal sums to trace = ' + str(int(diag.sum())))
ax2.bar(['lambda 1', 'lambda 2', 'lambda 3'], eigs, color='#c89bff')
ax2.set_title('eigenvalues sum to ' + str(round(eigs.sum())))
for ax, vals in [(ax1, diag), (ax2, eigs)]:
    for i, v in enumerate(vals):
        ax.text(i, v, str(round(v, 2)), ha='center', va='bottom')
plt.tight_layout()
plt.show()`
  },

  "la-rank-independence": {
    question: "What does it look like when columns are independent versus collapsed onto a line?",
    charts: [
      {
        type: "scatter",
        title: "Independent columns spread out (rank 3) vs a dependent column on a line",
        xlabel: "x",
        ylabel: "y",
        groups: [
          { name: "independent: v1, v2 (full rank)", color: "#7ee787", points: [[1, 0], [0, 1]] },
          { name: "dependent: collapsed on a line (rank drops)", color: "#ff7b72", points: [[1, 0.5], [2, 1], [3, 1.5]] }
        ],
        lines: [
          { name: "the line every dependent vector lies on", color: "#ff7b72", dash: true, points: [[0, 0], [3, 1.5]] }
        ]
      }
    ],
    caption: "When v3 = 2*v1 + 3*v2 the columns add no new direction, so rank falls to 2 of 3 and det = 0.",
    code: `import numpy as np
import matplotlib.pyplot as plt

v1 = np.array([1., 0.])                    # independent basis vectors
v2 = np.array([0., 1.])
# dependent set: every vector lies on one line through the origin
dep = np.array([[1, 0.5], [2, 1], [3, 1.5]])
A = np.column_stack([v1, v2, 2 * v1 + 3 * v2])
print('rank', np.linalg.matrix_rank(A))    # 2 of 3

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
  },

  "la-psd": {
    question: "How do the eigenvalues of a PSD matrix differ from those of an indefinite one?",
    charts: [
      {
        type: "bars",
        title: "Eigenvalues of M = A.T A: all at least 0, so M is positive semi-definite",
        labels: ["lambda 1", "lambda 2", "lambda 3"],
        values: [0.1121, 0.8556, 4.9885],
        valueLabels: ["0.11", "0.86", "4.99"],
        colors: ["#7ee787", "#7ee787", "#7ee787"]
      },
      {
        type: "bars",
        title: "For contrast: a general symmetric matrix has negative eigenvalues (not PSD)",
        labels: ["lambda 1", "lambda 2", "lambda 3"],
        values: [-4.9768, -1.4693, 0.4504],
        valueLabels: ["-4.98", "-1.47", "0.45"],
        colors: ["#ff7b72", "#ff7b72", "#7ee787"]
      }
    ],
    caption: "Every eigenvalue of A.T A is non-negative (PSD); a random symmetric matrix can dip below zero.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(0)

A = rng.standard_normal((4, 3))
M = A.T @ A                                 # symmetric PSD
psd = np.linalg.eigvalsh(M)                 # all >= 0

B = rng.standard_normal((3, 3))
S = B + B.T                                 # symmetric, indefinite
indef = np.linalg.eigvalsh(S)              # some negative

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
ax1.bar(['lambda 1', 'lambda 2', 'lambda 3'], psd, color='#7ee787')
ax1.set_title('eigenvalues of A.T A (PSD)')
colors = ['#ff7b72' if v < 0 else '#7ee787' for v in indef]
ax2.bar(['lambda 1', 'lambda 2', 'lambda 3'], indef, color=colors)
ax2.set_title('symmetric but indefinite')
ax2.axhline(0, color='#9aa7b4', linewidth=0.8)
plt.tight_layout()
plt.show()`
  },

  "la-spectral": {
    question: "What do the eigenvalues and principal axes of a symmetric matrix tell us about data?",
    charts: [
      {
        type: "bars",
        title: "Eigenvalues of a random symmetric 3x3 matrix (real, can be negative)",
        labels: ["lambda 1", "lambda 2", "lambda 3"],
        values: [-3.2749, -0.6819, 1.7294],
        valueLabels: ["-3.27", "-0.68", "1.73"],
        colors: ["#ff7b72", "#ff7b72", "#7ee787"]
      },
      {
        type: "scatter",
        title: "Data spread, with covariance eigenvectors drawn as principal axes",
        xlabel: "x",
        ylabel: "y",
        groups: [
          { name: "data points", color: "#4ea1ff", points: [[-0.77, 0], [-0.3, -0.81], [-1.65, -0.66], [0.8, 0.72], [-0.69, -0.22], [-0.16, 0.19], [1.3, 0.61], [0.7, 0.68], [1.4, 0.62], [-2.44, -0.8], [-3.41, -2.38], [-1.25, -0.34], [2.25, 0.86], [-1.21, -0.2], [-1.15, -0.87], [-1.29, -1.23], [-1.57, -0.85], [2.21, 1.03], [1.92, 0.47], [2.78, 1.62], [-2.04, -1.24], [1.24, 1.04], [0.9, -0.26]] }
        ],
        lines: [
          { name: "major axis (large eigenvalue)", color: "#ffb454", points: [[3.439, 1.84], [-3.439, -1.84]] },
          { name: "minor axis (small eigenvalue)", color: "#c89bff", points: [[-0.419, 0.783], [0.419, -0.783]] }
        ]
      }
    ],
    caption: "The covariance eigenvectors point along the data's spread; the long amber axis carries the larger eigenvalue.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(0)

B = rng.standard_normal((3, 3))
S = B + B.T                                 # random symmetric
eigs = np.linalg.eigvalsh(S)               # real, can be negative

X = rng.standard_normal((200, 2)) @ np.array([[2, 1], [0, 0.5]])
cov = np.cov(X.T)
w, V = np.linalg.eigh(cov)                  # principal axes
order = np.argsort(w)[::-1]
w, V = w[order], V[:, order]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
colors = ['#ff7b72' if v < 0 else '#7ee787' for v in eigs]
ax1.bar(['lambda 1', 'lambda 2', 'lambda 3'], eigs, color=colors)
ax1.set_title('eigenvalues of symmetric S')
ax2.scatter(X[:, 0], X[:, 1], color='#4ea1ff', s=10)
for k, c in zip(range(2), ['#ffb454', '#c89bff']):
    axis = V[:, k] * 2 * np.sqrt(w[k])
    ax2.plot([-axis[0], axis[0]], [-axis[1], axis[1]], color=c, linewidth=2)
ax2.set_xlabel('x'); ax2.set_ylabel('y'); ax2.set_title('principal axes')
plt.tight_layout()
plt.show()`
  },

  "la-svd": {
    question: "How fast do the singular values decay, and how does that bound the rank-k reconstruction error?",
    charts: [
      {
        type: "bars",
        title: "Singular values of A (decaying): sigma 1 dominates",
        labels: ["sigma 1", "sigma 2", "sigma 3"],
        values: [2.2335, 0.925, 0.3348],
        valueLabels: ["2.23", "0.93", "0.33"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff"]
      },
      {
        type: "line",
        title: "Reconstruction error drops as we keep more singular values (rank k)",
        xlabel: "rank k kept",
        ylabel: "Frobenius error ||A - A_k||",
        series: [
          { name: "error vs k", color: "#7ee787", points: [[0, 2.4405], [1, 0.9837], [2, 0.3348], [3, 0]] }
        ]
      }
    ],
    caption: "Keeping more singular values shrinks the error; at k=1 the leftover error equals the next singular value, 0.93.",
    code: `import numpy as np
import matplotlib.pyplot as plt
rng = np.random.default_rng(0)

A = rng.standard_normal((4, 3))
U, s, Vt = np.linalg.svd(A, full_matrices=False)   # singular values decay

errors = []
for k in range(len(s) + 1):                         # rank-k reconstruction
    Ak = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]
    errors.append(np.linalg.norm(A - Ak))           # Frobenius error

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
ax1.bar(['sigma 1', 'sigma 2', 'sigma 3'], s, color='#4ea1ff')
ax1.set_title('singular values (decaying)')
ax2.plot(range(len(errors)), errors, marker='o', color='#7ee787')
ax2.set_xlabel('rank k kept'); ax2.set_ylabel('||A - A_k||')
ax2.set_title('reconstruction error vs rank')
plt.tight_layout()
plt.show()`
  },

  "la-jacobian": {
    question: "What local parallelogram do the Jacobian columns span, and why is its area det J = r?",
    charts: [
      {
        type: "scatter",
        title: "Jacobian columns at (r=2, theta=0.6) span a parallelogram of area det J = 2",
        xlabel: "x",
        ylabel: "y",
        groups: [
          { name: "origin", color: "#9aa7b4", points: [[0, 0]] }
        ],
        lines: [
          { name: "column 1 of J (d/dr)", color: "#4ea1ff", points: [[0, 0], [0.8253, 0.5646]] },
          { name: "column 2 of J (d/dtheta)", color: "#c89bff", points: [[0, 0], [-1.1293, 1.6507]] },
          { name: "local parallelogram (area = r = 2)", color: "#7ee787", dash: true, points: [[0, 0], [0.8253, 0.5646], [-0.304, 2.2153], [-1.1293, 1.6507], [0, 0]] }
        ]
      }
    ],
    caption: "The Jacobian's two columns span a tiny parallelogram whose area det J = 2 equals r, the polar change-of-variables factor.",
    code: `import numpy as np
import matplotlib.pyplot as plt

r, t = 2.0, 0.6
J = np.array([[np.cos(t), -r * np.sin(t)],   # polar -> Cartesian Jacobian
              [np.sin(t),  r * np.cos(t)]])
detJ = np.linalg.det(J)                       # equals r = 2
c1, c2 = J[:, 0], J[:, 1]                      # the two columns
para = np.array([[0, 0], c1, c1 + c2, c2, [0, 0]])

fig, ax = plt.subplots(figsize=(6, 5))
ax.plot(para[:, 0], para[:, 1], color='#7ee787', linestyle='--',
        label='parallelogram (area = r = ' + str(round(detJ)) + ')')
ax.quiver(0, 0, c1[0], c1[1], angles='xy', scale_units='xy', scale=1,
          color='#4ea1ff', label='column 1 (d/dr)')
ax.quiver(0, 0, c2[0], c2[1], angles='xy', scale_units='xy', scale=1,
          color='#c89bff', label='column 2 (d/dtheta)')
ax.set_xlabel('x'); ax.set_ylabel('y'); ax.legend()
plt.tight_layout()
plt.show()`
  },

  "la-hessian": {
    question: "How do the Hessian and its eigenvalues distinguish a convex bowl from a saddle?",
    charts: [
      {
        type: "heatmap",
        title: "Hessian of f(x,y) = x^2 + xy + 2y^2 (from finite differences)",
        rows: ["d/dx", "d/dy"],
        cols: ["d/dx", "d/dy"],
        matrix: [[2, 1], [1, 4]],
        showVals: true
      },
      {
        type: "line",
        title: "Both Hessian eigenvalues positive means a convex bowl (up) vs a saddle (down)",
        xlabel: "step along an axis",
        ylabel: "function value",
        series: [
          { name: "convex bowl (positive eig)", color: "#7ee787", points: [[-2, 4], [-1.5, 2.25], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4]] },
          { name: "saddle direction (negative eig)", color: "#ff7b72", points: [[-2, -4], [-1.5, -2.25], [-1, -1], [-0.5, -0.25], [0, 0], [0.5, -0.25], [1, -1], [1.5, -2.25], [2, -4]] }
        ]
      }
    ],
    caption: "The Hessian [[2,1],[1,4]] has eigenvalues 1.59 and 4.41, both positive, so f curves up like a bowl (convex).",
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
w = np.linalg.eigvalsh(H)                  # both positive -> convex

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
ax1.imshow(H, cmap='Blues')
for i in range(2):
    for j in range(2):
        ax1.text(j, i, str(round(H[i, j])), ha='center', va='center')
ax1.set_title('Hessian (finite differences)')
ax1.set_xticks([0, 1], ['d/dx', 'd/dy']); ax1.set_yticks([0, 1], ['d/dx', 'd/dy'])
t = np.linspace(-2, 2, 9)
ax2.plot(t, w[0]/2 * t**2, color='#7ee787', label='convex bowl (positive eig)')
ax2.plot(t, -w[0]/2 * t**2, color='#ff7b72', label='saddle direction')
ax2.set_xlabel('step along an axis'); ax2.set_ylabel('function value'); ax2.legend()
plt.tight_layout()
plt.show()`
  }

});
