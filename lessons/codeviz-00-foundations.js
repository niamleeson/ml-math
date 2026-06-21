/* Per-lesson CODE VISUALIZATIONS for Module 0 — Foundations.
   Each entry visualizes what that lesson's NumPy code actually computes.
   Numbers come from running lessons/code-00-foundations.js with NumPy.
   Rendered by the shared canvas chart engine; merged by lesson id. */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "fnd-vector": {
    question: "What does the house vector [1500, 3, 10] look like, and how long is it?",
    charts: [
      {
        type: "scatter",
        title: "Vector x = [3, 2] drawn as an arrow from the origin",
        xlabel: "x1",
        ylabel: "x2",
        groups: [
          { name: "tip of x", color: "#4ea1ff", points: [[3, 2]] }
        ],
        lines: [
          { name: "x", color: "#4ea1ff", points: [[0, 0], [3, 2]] },
          { name: "x-leg", color: "#ffb454", dash: true, points: [[0, 0], [3, 0]] },
          { name: "y-leg", color: "#7ee787", dash: true, points: [[3, 0], [3, 2]] }
        ]
      },
      {
        type: "bars",
        title: "Entries of the house vector x = [1500, 3, 10]",
        labels: ["x0 size", "x1 bedrooms", "x2 age"],
        values: [1500, 3, 10],
        valueLabels: ["1500", "3", "10"],
        colors: ["#4ea1ff", "#7ee787", "#ffb454"]
      }
    ],
    caption: "A vector is an ordered list of numbers; drawn as an arrow it has horizontal and vertical legs, and the code reads each entry by position."
  },

  "fnd-dot": {
    question: "Does the dot product tell you whether two vectors agree?",
    charts: [
      {
        type: "bars",
        title: "Dot product of [1,0] with three directions: agree, perpendicular, oppose",
        labels: ["same dir [3,0]", "perp [0,5]", "opposite [-4,0]"],
        values: [3, 0, -4],
        valueLabels: ["+3", "0", "-4"],
        colors: ["#7ee787", "#9aa7b4", "#ff7b72"]
      },
      {
        type: "scatter",
        title: "Vectors a = [3,1] and b = [1,3], cosine similarity = 0.6",
        xlabel: "x1",
        ylabel: "x2",
        groups: [
          { name: "a tip", color: "#4ea1ff", points: [[3, 1]] },
          { name: "b tip", color: "#c89bff", points: [[1, 3]] }
        ],
        lines: [
          { name: "a", color: "#4ea1ff", points: [[0, 0], [3, 1]] },
          { name: "b", color: "#c89bff", points: [[0, 0], [1, 3]] }
        ]
      }
    ],
    caption: "Positive dot product means vectors agree (+3), zero means perpendicular, negative means they oppose (-4); a and b give cosine 0.6."
  },

  "fnd-matrix": {
    question: "How is a dataset of houses laid out as a matrix?",
    charts: [
      {
        type: "heatmap",
        title: "Matrix A: 3 houses (rows) by 2 features (cols)",
        rows: ["house 1", "house 2", "house 3"],
        cols: ["size", "bedrooms"],
        matrix: [
          [1500, 3],
          [900, 2],
          [2200, 4]
        ],
        showVals: true
      }
    ],
    caption: "A matrix is a grid; here each row is one house and each column is one feature, so A has shape 3 rows by 2 columns."
  },

  "fnd-matvec": {
    question: "What price does A @ x give for each house?",
    charts: [
      {
        type: "bars",
        title: "Ax = price per house (each row of A dotted with weights x)",
        labels: ["house 1 [1500,3]", "house 2 [900,2]"],
        values: [330000, 200000],
        valueLabels: ["330000", "200000"],
        colors: ["#4ea1ff", "#7ee787"]
      }
    ],
    caption: "Matrix times vector does one dot product per row: house 1 scores 330000 and house 2 scores 200000, both at once."
  },

  "fnd-norm": {
    question: "How big is x = [3, -4], and how far apart are two vectors?",
    charts: [
      {
        type: "bars",
        title: "Two sizes of x = [3, -4]: L2 (straight line) vs L1 (city blocks)",
        labels: ["L2 norm", "L1 norm"],
        values: [5, 7],
        valueLabels: ["5", "7"],
        colors: ["#4ea1ff", "#ffb454"]
      },
      {
        type: "scatter",
        title: "x = [3, -4] as a right triangle: hypotenuse is the L2 length 5",
        xlabel: "x1",
        ylabel: "x2",
        groups: [
          { name: "tip", color: "#4ea1ff", points: [[3, -4]] }
        ],
        lines: [
          { name: "x (L2 = 5)", color: "#4ea1ff", points: [[0, 0], [3, -4]] },
          { name: "leg a = 3", color: "#ffb454", dash: true, points: [[0, 0], [3, 0]] },
          { name: "leg b = -4", color: "#c89bff", dash: true, points: [[3, 0], [3, -4]] }
        ]
      }
    ],
    caption: "L2 squares-sums-roots to give straight-line length 5; L1 sums absolute values to give 7; the legs 3 and 4 make the hypotenuse 5."
  },

  "fnd-derivative": {
    question: "Why is the slope of x squared equal to 2x?",
    charts: [
      {
        type: "line",
        title: "f(x) = x squared with its tangent line at x = 1.5 (slope = 3)",
        xlabel: "x",
        ylabel: "f(x)",
        series: [
          { name: "f(x) = x^2", color: "#4ea1ff", points: [[-3, 9], [-2.5, 6.25], [-2, 4], [-1.5, 2.25], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4], [2.5, 6.25], [3, 9]] },
          { name: "tangent at x=1.5", color: "#ffb454", points: [[-0.5, -3.75], [3, 6.75]] }
        ]
      },
      {
        type: "bars",
        title: "Exact derivative 2x at three points (slope = 0 at the bowl bottom)",
        labels: ["x = -2", "x = 0", "x = 3"],
        values: [-4, 0, 6],
        valueLabels: ["-4", "0", "6"],
        colors: ["#ff7b72", "#9aa7b4", "#7ee787"]
      }
    ],
    caption: "The derivative is the tangent slope; the code confirms it is 2x, so -4 at x=-2, flat 0 at the minimum x=0, and +6 at x=3."
  },

  "fnd-gradient": {
    question: "Does stepping opposite the gradient walk downhill toward the minimum?",
    charts: [
      {
        type: "scatter",
        title: "Gradient descent on f = x^2 + y^2: 5 steps toward min (0,0)",
        xlabel: "x",
        ylabel: "y",
        groups: [
          { name: "descent points", color: "#4ea1ff", points: [[3, 4], [2.4, 3.2], [1.92, 2.56], [1.536, 2.048], [1.2288, 1.6384], [0.983, 1.3107]] },
          { name: "minimum", color: "#7ee787", points: [[0, 0]] }
        ],
        lines: [
          { name: "path", color: "#ffb454", points: [[3, 4], [2.4, 3.2], [1.92, 2.56], [1.536, 2.048], [1.2288, 1.6384], [0.983, 1.3107]] }
        ]
      },
      {
        type: "line",
        title: "Loss f going down each step (learning rate 0.1)",
        xlabel: "step",
        ylabel: "f value",
        series: [
          { name: "f", color: "#4ea1ff", points: [[0, 25], [1, 16], [2, 10.24], [3, 6.5536], [4, 4.1943], [5, 2.6844]] }
        ]
      }
    ],
    caption: "Each step subtracts the gradient, sliding the point from (3,4) toward (0,0) while the loss falls from 25 down to about 2.68."
  },

  "fnd-chain": {
    question: "Does the chain rule give the right slope for z = (3x) squared?",
    charts: [
      {
        type: "bars",
        title: "Chain rule dz/dx = (outer 2y) times (inner 3) = 18x",
        labels: ["x = -1", "x = 0.5", "x = 1"],
        values: [-18, 9, 18],
        valueLabels: ["-18", "9", "18"],
        colors: ["#ff7b72", "#7ee787", "#4ea1ff"]
      },
      {
        type: "line",
        title: "Slope of z = (3x)^2 is the straight line 18x",
        xlabel: "x",
        ylabel: "dz/dx",
        series: [
          { name: "dz/dx = 18x", color: "#c89bff", points: [[-1, -18], [-0.5, -9], [0, 0], [0.5, 9], [1, 18]] }
        ]
      }
    ],
    caption: "Multiplying the inner slope 3 by the outer slope 2y gives 18x, matching the numeric check: -18, 9, 18 at x = -1, 0.5, 1."
  },

  "fnd-eigen": {
    question: "Does A stretch its eigenvectors without rotating them?",
    charts: [
      {
        type: "scatter",
        title: "Eigenvectors of A = diag(2,3) stay on their axis; A@[1,1] tilts off",
        xlabel: "x1",
        ylabel: "x2",
        groups: [
          { name: "A @ [1,0] = [2,0]", color: "#4ea1ff", points: [[2, 0]] },
          { name: "A @ [0,1] = [0,3]", color: "#7ee787", points: [[0, 3]] },
          { name: "A @ [1,1] = [2,3]", color: "#ff7b72", points: [[2, 3]] }
        ],
        lines: [
          { name: "eigenline x (x2=0)", color: "#4ea1ff", dash: true, points: [[0, 0], [3, 0]] },
          { name: "eigenline y (x1=0)", color: "#7ee787", dash: true, points: [[0, 0], [0, 3.5]] },
          { name: "[1,1] before", color: "#9aa7b4", dash: true, points: [[0, 0], [1, 1]] },
          { name: "A @ [1,1] after", color: "#ff7b72", points: [[0, 0], [2, 3]] }
        ]
      },
      {
        type: "bars",
        title: "Eigenvalues of A: stretch factors along each eigenvector",
        labels: ["lambda 1 (x axis)", "lambda 2 (y axis)"],
        values: [2, 3],
        valueLabels: ["2", "3"],
        colors: ["#4ea1ff", "#7ee787"]
      }
    ],
    caption: "Eigenvectors [1,0] and [0,1] only stretch (by 2 and 3) and stay on their lines, while a generic vector [1,1] maps to [2,3] and tilts to a new direction."
  }

});
