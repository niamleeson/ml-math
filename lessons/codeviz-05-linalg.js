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
    caption: "A @ B and B @ A are both valid 2x2 products but hold different numbers, so order matters."
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
    caption: "Transpose turns the 2x3 grid into a 3x2 grid; row 1 of A becomes column 1 of A.T."
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
    caption: "Each diagonal entry stretches one axis on its own: D @ (4,5,6) = (8,15,30)."
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
    caption: "A sends v=(3,5) to (11,8); A-inverse carries (11,8) straight back to (3,5), so A-inverse(A.v)=v."
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
    caption: "A=[[3,1],[1,2]] sends the area-1 unit square to a parallelogram of area 5, which equals det A."
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
    caption: "Expanding along row 1: 8 + 0 + (-1) = 7, matching numpy det(A) = 7."
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
    caption: "Diagonal (2,3,6) and eigenvalues (0.68,3.88,6.44) look different but both add to 11 = trace."
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
    caption: "When v3 = 2*v1 + 3*v2 the columns add no new direction, so rank falls to 2 of 3 and det = 0."
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
    caption: "Every eigenvalue of A.T A is non-negative (PSD); a random symmetric matrix can dip below zero."
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
    caption: "The covariance eigenvectors point along the data's spread; the long amber axis carries the larger eigenvalue."
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
    caption: "Keeping more singular values shrinks the error; at k=1 the leftover error equals the next singular value, 0.93."
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
    caption: "The Jacobian's two columns span a tiny parallelogram whose area det J = 2 equals r, the polar change-of-variables factor."
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
    caption: "The Hessian [[2,1],[1,4]] has eigenvalues 1.59 and 4.41, both positive, so f curves up like a bowl (convex)."
  }

});
