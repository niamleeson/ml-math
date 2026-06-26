/* Per-lesson CODE VISUALIZATIONS — 00-foundations.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["fnd-vector"] = {
  question: "A vector is just a list of numbers — but how do you read one in a chart?",
  caption: "A vector is an ordered list of numbers. Below: the same idea drawn the ways you will actually meet it.",
  charts: [
    {
      type: "bars",
      title: "Ideal: one house as a feature vector [1500, 3, 10]",
      labels: ["size (sq ft)", "bedrooms", "age (yrs)"],
      values: [1500, 3, 10],
      valueLabels: ["1500", "3", "10"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff"],
      interpret: "<b>Each bar is one entry of the vector</b>, in a fixed order: position 1 is size, 2 is bedrooms, 3 is age. The x-axis names the feature; the bar height is that feature's value. Read this as x = [1500, 3, 10] with n = 3. The order is part of the meaning — entry 2 must be bedrooms for every example, or the model learns garbage."
    },
    {
      type: "bars",
      title: "What you'll often see: raw scales make 'size' swallow the rest",
      labels: ["size (sq ft)", "bedrooms", "age (yrs)"],
      values: [1500, 3, 10],
      valueLabels: ["1500", "3 (tiny!)", "10 (tiny!)"],
      colors: ["#ffb454", "#ff7b72", "#ff7b72"],
      interpret: "Same vector, but now you can <b>see the trap</b>: on a shared axis, size = 1500 dwarfs bedrooms = 3 and age = 10, whose bars are nearly invisible (red). Anything that uses magnitude — distance, gradients — will be dominated by the big feature and ignore the small ones. The fix is standardizing (zero mean, unit variance) before training. Illustrative of the unscaled-feature pitfall."
    },
    {
      type: "bars",
      title: "Same vector, standardized: comparable scales (z-scores)",
      labels: ["size (sq ft)", "bedrooms", "age (yrs)"],
      values: [0.8, -0.5, 1.2],
      valueLabels: ["+0.8", "-0.5", "+1.2"],
      colors: ["#7ee787", "#7ee787", "#7ee787"],
      interpret: "After standardizing, every entry is a <b>z-score</b>: how many standard deviations above or below the feature's mean. Now all three bars live on one comparable scale, positives above the line and negatives below, so no single feature drowns out the others. This is the healthy version of the chart above — illustrative z-scores, not raw units."
    },
    {
      type: "scatter",
      title: "Geometric view: the vector [3, 2] as an arrow with x/y legs",
      xlabel: "x1 (first entry)",
      ylabel: "x2 (second entry)",
      groups: [
        { name: "vector tip [3, 2]", color: "#4ea1ff", points: [[3, 2]] }
      ],
      lines: [
        { color: "#4ea1ff", dash: false, points: [[0, 0], [3, 2]] },
        { color: "#ffb454", dash: true, points: [[0, 0], [3, 0]] },
        { color: "#7ee787", dash: true, points: [[3, 0], [3, 2]] }
      ],
      interpret: "A 2-number vector is a <b>point in the plane</b>, or an arrow from the origin to it. The blue arrow ends at (3, 2); the dashed orange leg is the first entry (x1 = 3, go right) and the dashed green leg is the second (x2 = 2, go up). The arrow's length is the norm, sqrt(3*3 + 2*2) = 3.606. This is why 'similar' vectors point the same way — direction and length both carry meaning."
    },
    {
      type: "heatmap",
      title: "Many vectors stacked = a dataset (3 houses x 3 features)",
      rows: ["house 1", "house 2", "house 3"],
      cols: ["size", "bedrooms", "age"],
      matrix: [
        [1500, 3, 10],
        [900, 2, 40],
        [2200, 4, 5]
      ],
      showVals: true,
      interpret: "Each <b>row is one example's vector</b>; each column is one feature held in the same slot across all rows. Stack many vectors and you get a matrix — the universal dataset shape. Notice the 'size' column glows brightest only because its raw numbers are largest, not because it matters most; that colour bias is exactly the scaling pitfall, now visible across a whole table. Illustrative values."
    }
  ],
  code: [
    "import numpy as np",
    "",
    "# one house as a feature vector: order is fixed and meaningful",
    "x = np.array([1500, 3, 10])   # [size_sqft, bedrooms, age_yrs]",
    "print('vector:', x, ' n =', x.shape[0])",
    "",
    "# raw scales differ wildly -> 'size' dominates anything magnitude-based",
    "print('L2 norm (length):', np.linalg.norm(x))",
    "",
    "# fix: standardize so every entry is a comparable z-score",
    "mean = x.mean(); std = x.std()",
    "z = (x - mean) / std",
    "print('standardized:', np.round(z, 2))"
  ].join("\n")
};

window.CODEVIZ["fnd-dot"] = {
  question: "One number says how much two vectors agree. How do you read that number off a picture?",
  caption: "",
  charts: [
    {
      type: "line",
      title: "The agreement curve: dot product vs angle between two unit vectors",
      xlabel: "angle between the vectors (degrees)",
      ylabel: "dot product (for unit-length vectors)",
      series: [
        {
          name: "a · b",
          color: "#4ea1ff",
          points: [
            [0, 1.0], [30, 0.87], [45, 0.71], [60, 0.5], [90, 0.0],
            [120, -0.5], [135, -0.71], [150, -0.87], [180, -1.0]
          ]
        },
        {
          name: "zero line",
          color: "#9aa7b4",
          points: [[0, 0], [180, 0]]
        }
      ],
      interpret: "Real numbers here: both vectors have length 1, so the dot product equals the cosine of the angle between them. <b>Left side (small angle)</b> the curve is high and positive: the vectors point the same way and agree. <b>At 90 degrees</b> it crosses zero (the grey line): the vectors are orthogonal, unrelated. <b>Right side (large angle)</b> it goes negative: the vectors oppose. Read the height as 'how much they agree', and the sign as 'agree (+) vs disagree (-)'."
    },
    {
      type: "scatter",
      title: "Aligned vectors: positive dot product (they agree)",
      xlabel: "x component",
      ylabel: "y component",
      groups: [
        { name: "a = [3, 1]", color: "#4ea1ff", points: [[3, 1]] },
        { name: "b = [2, 1]", color: "#c89bff", points: [[2, 1]] }
      ],
      lines: [
        { color: "#4ea1ff", points: [[0, 0], [3, 1]] },
        { color: "#c89bff", points: [[0, 0], [2, 1]] }
      ],
      interpret: "Real numbers: a · b = 3 times 2 plus 1 times 1 = 7, a big positive value. The two arrows leave the origin pointing into nearly the <b>same direction</b> (a small angle between them). Whenever you see two vectors crowding into the same quadrant like this, expect a large positive dot product: they agree. This is the case behind a confident 'yes' from a linear model."
    },
    {
      type: "scatter",
      title: "Orthogonal vectors: dot product is exactly zero (unrelated)",
      xlabel: "x component",
      ylabel: "y component",
      groups: [
        { name: "a = [3, 0]", color: "#4ea1ff", points: [[3, 0]] },
        { name: "b = [0, 3]", color: "#c89bff", points: [[0, 3]] }
      ],
      lines: [
        { color: "#4ea1ff", points: [[0, 0], [3, 0]] },
        { color: "#c89bff", points: [[0, 0], [0, 3]] }
      ],
      interpret: "Real numbers: a · b = 3 times 0 plus 0 times 3 = 0. The arrows meet at a <b>right angle</b> (90 degrees). A dot product of exactly zero is the signal for 'orthogonal / unrelated' — not 'opposite'. When two arrows form an L shape like this, their dot product vanishes no matter how long they are. This is why zero means independent directions, not disagreement."
    },
    {
      type: "scatter",
      title: "Opposing vectors: negative dot product (they disagree)",
      xlabel: "x component",
      ylabel: "y component",
      groups: [
        { name: "a = [3, 1]", color: "#4ea1ff", points: [[3, 1]] },
        { name: "b = [-3, -1]", color: "#ff7b72", points: [[-3, -1]] }
      ],
      lines: [
        { color: "#4ea1ff", points: [[0, 0], [3, 1]] },
        { color: "#ff7b72", points: [[0, 0], [-3, -1]] }
      ],
      interpret: "Real numbers: a · b = 3 times -3 plus 1 times -1 = -10, a clearly negative value. The two arrows shoot off in <b>opposite directions</b> (angle near 180 degrees), so every matching pair multiplies to a negative and the sum goes negative. When you see arrows pointing roughly against each other like this, read it as disagreement — the same way a negative feature weight pushes a prediction down."
    }
  ],
  code: [
    "import numpy as np",
    "",
    "# Same three cases the diagrams show, with real numbers.",
    "a = np.array([3, 1])",
    "for name, b in [('aligned', [2, 1]), ('orthogonal', [0, 3]), ('opposing', [-3, -1])]:",
    "    b = np.array(b)",
    "    dot = a @ b                       # multiply matching entries, then sum",
    "    cos = dot / (np.linalg.norm(a) * np.linalg.norm(b))",
    "    angle = np.degrees(np.arccos(np.clip(cos, -1, 1)))",
    "    print(name, 'dot =', dot, ' angle =', round(angle, 1), 'deg')",
    "# aligned  -> positive dot, small angle (agree)",
    "# orthogonal -> dot 0, 90 deg (unrelated)",
    "# opposing -> negative dot, ~180 deg (disagree)"
  ].join("\n")
};

window.CODEVIZ["fnd-matrix"] = {
  question: "If a matrix is just a heatmap of its entries, what does the picture tell you?",
  caption: "Each chart below is a matrix drawn as a coloured grid. The cell label is the entry value; the colour just makes the pattern jump out.",
  charts: [
    {
      type: "heatmap",
      title: "The dataset matrix: 3 houses (rows) by 2 features (columns)",
      rows: ["house 1", "house 2", "house 3"],
      cols: ["size", "bedrooms"],
      matrix: [
        [1500, 3],
        [900, 2],
        [2200, 4]
      ],
      showVals: true,
      interpret: "This is the 3x2 house matrix from the lesson, drawn as a grid. <b>Rows are examples</b> (the three houses), <b>columns are features</b> (size, bedrooms). Read a cell by row then column: the cell at row 2, column 1 is A(2,1) = 900, house 2's size. The colour scale is dominated by the size column because 1500 dwarfs a bedroom count of 3, which is exactly why you standardise features before feeding a matrix to a model."
    },
    {
      type: "heatmap",
      title: "Shape variant: a tall matrix (many rows, few columns)",
      rows: ["ex 1", "ex 2", "ex 3", "ex 4", "ex 5", "ex 6"],
      cols: ["feat 1", "feat 2"],
      matrix: [
        [1, 0],
        [0, 1],
        [1, 1],
        [0, 0],
        [1, 0],
        [0, 1]
      ],
      showVals: true,
      interpret: "Illustrative. A real ML dataset is usually <b>tall and thin</b>: thousands of rows (examples) and a handful of columns (features), so m is much bigger than n. Recognise it by the shape alone, a long vertical strip. The lesson's '1000 houses with 3 numbers' is a 1000x3 matrix of exactly this kind. Same idea as chart 1, just more rows."
    },
    {
      type: "heatmap",
      title: "Structure variant: identity matrix (diagonal of 1s, 0s elsewhere)",
      rows: ["row 1", "row 2", "row 3"],
      cols: ["col 1", "col 2", "col 3"],
      matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      showVals: true,
      interpret: "Illustrative. Not every matrix is raw data. The <b>identity matrix</b> has 1s only on the main diagonal (top-left to bottom-right) and 0s everywhere else, so you see a clean diagonal stripe. It is square (rows = columns) and acts like the number 1 for matrices: multiplying by it changes nothing. Spotting a special pattern in the grid tells you the matrix has a job, not just data."
    },
    {
      type: "heatmap",
      title: "Sign variant: a weight matrix with positive and negative entries",
      rows: ["out 1", "out 2"],
      cols: ["in 1", "in 2", "in 3"],
      matrix: [
        [0.8, -0.5, 0.2],
        [-0.3, 0.6, -0.9]
      ],
      showVals: true,
      interpret: "Illustrative. A neural-network layer's <b>weight matrix</b> mixes positive and negative numbers. Here positive cells push their input up and negative cells push it down, so colour now carries sign, not just size. This is a 2x3 matrix (2 outputs, 3 inputs); the same row-by-column reading still holds, the entry at row 1, column 2 is -0.5. Honest shapes, made-up weights."
    }
  ],
  code: [
    "import numpy as np",
    "",
    "# Three houses, two features each (size, bedrooms) -> a 3x2 matrix.",
    "A = np.array([",
    "    [1500, 3],",
    "    [900,  2],",
    "    [2200, 4],",
    "])",
    "",
    "print('shape:', A.shape)        # (3, 2)  -> 3 rows, 2 columns",
    "print('A[1, 0]:', A[1, 0])      # 900  -> row 2, col 1 (0-based in code)",
    "print('row 3:', A[2])           # [2200 4] -> house 3"
  ].join("\n")
};

window.CODEVIZ["fnd-matvec"] = {
  question: "A matrix times a vector moves a point. Apply it to every corner of the unit square and you see what the matrix DOES to space itself.",
  charts: [
    {
      type: "scatter",
      title: "Ideal: scaling (the demo's A = [[2,0],[0,1]])",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "before (unit square)", color: "#9aa7b4", points: [[0,0],[1,0],[1,1],[0,1]] },
        { name: "after Ax", color: "#7ee787", points: [[0,0],[2,0],[2,1],[0,1]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0,0],[1,0],[1,1],[0,1],[0,0]] },
        { color: "#7ee787", dash: false, points: [[0,0],[2,0],[2,1],[0,1],[0,0]] }
      ],
      interpret: "Each dot is one corner of a little square. Grey is the square before; green is where A=[[2,0],[0,1]] sends it. A multiplies the x part by 2 and leaves y alone, so the square stretches twice as wide and keeps its height. Real numbers: corner [1,1] goes to [2,1] (row 1 dot [1,1] = 2*1+0*1 = 2; row 2 dot = 0*1+1*1 = 1). <b>Read it as:</b> the matrix is a recipe for moving every point the same way at once."
    },
    {
      type: "scatter",
      title: "Variant 1 - rotation: the square spins, size unchanged",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "before", color: "#9aa7b4", points: [[0,0],[1,0],[1,1],[0,1]] },
        { name: "after (rotate 45 deg)", color: "#4ea1ff", points: [[0,0],[0.71,0.71],[0,1.41],[-0.71,0.71]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0,0],[1,0],[1,1],[0,1],[0,0]] },
        { color: "#4ea1ff", dash: false, points: [[0,0],[0.71,0.71],[0,1.41],[-0.71,0.71],[0,0]] }
      ],
      interpret: "A rotation matrix [[cos,-sin],[sin,cos]] turns every point around the origin by the same angle. Here 45 degrees: corner [1,0] swings up to about [0.71,0.71]. The square tilts but its side lengths and right angles are untouched - lengths and angles are preserved. <b>How to recognise it:</b> the after shape is the same size and shape as before, just turned. These show up in graphics and in any transform that re-orients without resizing."
    },
    {
      type: "scatter",
      title: "Variant 2 - shear: square slides into a parallelogram (illustrative)",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "before", color: "#9aa7b4", points: [[0,0],[1,0],[1,1],[0,1]] },
        { name: "after (shear)", color: "#ffb454", points: [[0,0],[1,0],[2,1],[1,1]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0,0],[1,0],[1,1],[0,1],[0,0]] },
        { color: "#ffb454", dash: false, points: [[0,0],[1,0],[2,1],[1,1],[0,0]] }
      ],
      interpret: "Illustrative shear matrix [[1,1],[0,1]]: x gets pushed sideways by an amount that grows with y, while y stays put. The bottom edge (y=0) does not move, but the top edge slides right - corner [0,1] becomes [1,1] and [1,1] becomes [2,1]. <b>How to recognise it:</b> the square turns into a leaning parallelogram with one pair of edges still flat. Right angles are destroyed even though no point is scaled up or down."
    },
    {
      type: "scatter",
      title: "Variant 3 - projection: 2D square collapses onto a line (illustrative)",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "before", color: "#9aa7b4", points: [[0,0],[1,0],[1,1],[0,1]] },
        { name: "after (project onto x-axis)", color: "#ff7b72", points: [[0,0],[1,0],[1,0],[0,0]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0,0],[1,0],[1,1],[0,1],[0,0]] },
        { color: "#ff7b72", dash: false, points: [[0,0],[1,0]] }
      ],
      interpret: "Illustrative projection matrix [[1,0],[0,0]]: it keeps x and zeroes out y, so every point drops straight down onto the x-axis. The whole square flattens into the segment from [0,0] to [1,0] - corners [0,1] and [1,1] both land on the axis. <b>How to recognise it:</b> the after shape has lower dimension than before (a 2D area becomes a 1D line). Information is lost and the move cannot be undone, because many different points map to the same spot."
    }
  ],
  caption: "",
  code: `// Matrix x vector = move a point. Apply A to every corner of the unit square.
const A = [[2, 0], [0, 1]];               // scaling: x doubles, y unchanged
const square = [[0,0],[1,0],[1,1],[0,1]]; // corners of the unit square

function apply(M, v) {                      // M times v, one dot product per row
  return [
    M[0][0]*v[0] + M[0][1]*v[1],            // row 1 dot v
    M[1][0]*v[0] + M[1][1]*v[1]             // row 2 dot v
  ];
}

const moved = square.map(p => apply(A, p));
console.log(moved); // [[0,0],[2,0],[2,1],[0,1]] - the square is now twice as wide
`
};

window.CODEVIZ["fnd-norm"] = {
  question: "How big is x = [3, -4], and how does that 'size' change when you swap the norm?",
  charts: [
    {
      type: "bars",
      title: "Same x = [3, -4], three norms: L1 = 7, L2 = 5, L-infinity = 4",
      labels: ["L1 (sum |xi|)", "L2 (straight line)", "L-inf (max |xi|)"],
      values: [7, 5, 4],
      valueLabels: ["7", "5", "4"],
      colors: ["#ffb454", "#4ea1ff", "#c89bff"],
      interpret: "<b>Bar height is the 'size' of the very same vector under three different rulers.</b> L1 adds the absolute values (3+4=7), L2 is the Pythagorean hypotenuse (sqrt(9+16)=5), and L-infinity keeps only the largest entry (4). They always order L1 >= L2 >= L-inf, because spreading the size across both legs (L1) costs the most and counting only the biggest leg (L-inf) costs the least. <b>Conclusion: 'how big' is not one number until you say which norm.</b>"
    },
    {
      type: "scatter",
      title: "Ideal: x = [3, -4] as a right triangle, hypotenuse is the L2 length 5",
      xlabel: "x1",
      ylabel: "x2",
      groups: [
        { name: "tip x", color: "#4ea1ff", points: [[3, -4]] }
      ],
      lines: [
        { name: "x (L2 = 5)", color: "#4ea1ff", points: [[0, 0], [3, -4]] },
        { name: "leg a = 3", color: "#ffb454", dash: true, points: [[0, 0], [3, 0]] },
        { name: "leg b = -4", color: "#c89bff", dash: true, points: [[3, 0], [3, -4]] }
      ],
      interpret: "<b>Read this as Pythagoras made visible.</b> The orange leg (length 3) and purple leg (length 4) are the two components of x; the blue arrow is the vector itself and its length is the hypotenuse. Square the legs, add (9 + 16 = 25), square-root: the L2 norm is exactly 5 (real computed value). <b>The L1 norm is the two dashed legs walked end to end, 3 + 4 = 7</b> -- you cannot cut the corner, so L1 is longer than the diagonal."
    },
    {
      type: "scatter",
      title: "Variant -- L2 unit ball: the circle of all points with length 1 (illustrative)",
      xlabel: "x1",
      ylabel: "x2",
      groups: [
        { name: "axis tips (norm 1)", color: "#7ee787", points: [[1, 0], [0, 1], [-1, 0], [0, -1]] }
      ],
      lines: [
        { name: "L2 = 1 boundary", color: "#4ea1ff", points: [[1, 0], [0.924, 0.383], [0.707, 0.707], [0.383, 0.924], [0, 1], [-0.383, 0.924], [-0.707, 0.707], [-0.924, 0.383], [-1, 0], [-0.924, -0.383], [-0.707, -0.707], [-0.383, -0.924], [0, -1], [0.383, -0.924], [0.707, -0.707], [0.924, -0.383], [1, 0]] }
      ],
      interpret: "<b>A 'unit ball' is every vector whose norm equals 1 -- the shape tells you what the norm treats as 'the same size'.</b> For L2 it is a perfect circle (illustrative, traced from cos/sin): a point on the diagonal like [0.707, 0.707] has the exact same L2 length as [1, 0]. The smooth, corner-free boundary is why L2 / Ridge regularization shrinks weights gently toward zero but rarely makes any one exactly zero."
    },
    {
      type: "scatter",
      title: "Variant -- L1 unit ball: a diamond, corners on the axes (illustrative)",
      xlabel: "x1",
      ylabel: "x2",
      groups: [
        { name: "corners (on axes)", color: "#ffb454", points: [[1, 0], [0, 1], [-1, 0], [0, -1]] }
      ],
      lines: [
        { name: "L1 = 1 boundary", color: "#ffb454", points: [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]] }
      ],
      interpret: "<b>Same 'all points of size 1' question, now under L1 (sum of absolute values) -- the answer is a diamond.</b> Its sharp corners sit exactly on the axes, where one coordinate is 0 (illustrative shape). That is the whole intuition for L1 / LASSO: the pointy corners poke out, so an optimizer pushed against this ball tends to land on a corner and zero out a feature. <b>Recognise a diamond and think 'sparsity / feature selection'.</b>"
    },
    {
      type: "scatter",
      title: "Variant -- L-infinity unit ball: a square, only the largest entry counts (illustrative)",
      xlabel: "x1",
      ylabel: "x2",
      groups: [
        { name: "corners (both = 1)", color: "#c89bff", points: [[1, 1], [-1, 1], [-1, -1], [1, -1]] }
      ],
      lines: [
        { name: "L-inf = 1 boundary", color: "#c89bff", points: [[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]] }
      ],
      interpret: "<b>Under L-infinity the size is just the biggest absolute entry, so 'size 1' means no coordinate exceeds 1 -- an axis-aligned square (illustrative).</b> The corner [1, 1] is allowed because each entry is still 1, even though its L2 length is sqrt(2). The flat sides reaching out to the corners are why the L-infinity ball is the largest of the three and why this norm shows up as a worst-case / max-deviation bound. <b>Square = 'only the worst coordinate matters'.</b>"
    }
  ],
  caption: "One vector has many 'sizes': the bars show L1=7, L2=5, L-inf=4 for x=[3,-4], and the unit balls (circle, diamond, square) show what each norm calls 'length 1'.",
  code: `import numpy as np

x = np.array([3.0, -4.0])
l1  = np.linalg.norm(x, ord=1)        # 7.0  sum of absolute values
l2  = np.linalg.norm(x)               # 5.0  straight-line (Pythagoras)
linf = np.linalg.norm(x, ord=np.inf)  # 4.0  largest absolute entry

print("L1 =", l1, " L2 =", l2, " Linf =", linf)
# always ordered:  L1 >= L2 >= Linf
assert l1 >= l2 >= linf`
};

window.CODEVIZ["fnd-derivative"] = {
  question: "How do you read a slope off a curve, and what do the different cases look like?",
  charts: [
    {
      type: "line",
      title: "Ideal: positive slope, tangent at x = 1.5 (slope = 2x = 3)",
      xlabel: "x",
      ylabel: "f(x)",
      series: [
        { name: "f(x) = x^2", color: "#4ea1ff", points: [[-3, 9], [-2.5, 6.25], [-2, 4], [-1.5, 2.25], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4], [2.5, 6.25], [3, 9]] },
        { name: "tangent at x=1.5", color: "#ffb454", points: [[0, -2.25], [3, 6.75]] }
      ],
      interpret: "The blue curve is the function; the x-axis is the input, the y-axis is the output. The orange straight line just touches the curve at x = 1.5 and matches its steepness there: that line IS the slope. It tilts up to the right, so the slope is <b>positive</b> (here 2x = 3) and the output grows as you nudge x up. Read any tangent the same way: which way it tilts and how steeply tells you the sign and size of the derivative."
    },
    {
      type: "line",
      title: "Zero slope at the minimum: tangent at x = 0 is flat (slope = 0)",
      xlabel: "x",
      ylabel: "f(x)",
      series: [
        { name: "f(x) = x^2", color: "#4ea1ff", points: [[-3, 9], [-2.5, 6.25], [-2, 4], [-1.5, 2.25], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4], [2.5, 6.25], [3, 9]] },
        { name: "tangent at x=0", color: "#7ee787", points: [[-3, 0], [3, 0]] }
      ],
      interpret: "At the bottom of the bowl the tangent is <b>perfectly flat</b> (horizontal), so the slope is exactly 0: nudging x left or right barely changes the output. A flat tangent is the signal for a stationary point. Caution: zero slope alone does not prove a minimum, it could also be a maximum or a saddle, so you check the curvature. Here the curve bends upward on both sides, confirming a minimum."
    },
    {
      type: "line",
      title: "Negative slope: tangent at x = -2 tilts down (slope = 2x = -4)",
      xlabel: "x",
      ylabel: "f(x)",
      series: [
        { name: "f(x) = x^2", color: "#4ea1ff", points: [[-3, 9], [-2.5, 6.25], [-2, 4], [-1.5, 2.25], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4], [2.5, 6.25], [3, 9]] },
        { name: "tangent at x=-2", color: "#ff7b72", points: [[-3, 8], [0, -4]] }
      ],
      interpret: "Now the tangent tilts <b>down</b> to the right, so the slope is <b>negative</b> (2x = -4): as x increases the output falls. To make the output smaller you would step in the direction the slope points away from, which is exactly how gradient descent walks downhill. The same parabola gives a positive slope on the right and a negative slope on the left, mirror images across the flat bottom."
    },
    {
      type: "line",
      title: "Steep vs flat: same curve, different slopes (illustrative comparison)",
      xlabel: "x",
      ylabel: "f(x)",
      series: [
        { name: "f(x) = x^2", color: "#4ea1ff", points: [[-3, 9], [-2.5, 6.25], [-2, 4], [-1.5, 2.25], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4], [2.5, 6.25], [3, 9]] },
        { name: "flat-ish tangent at x=0.5 (slope 1)", color: "#7ee787", points: [[-1, -0.75], [2, 2.25]] },
        { name: "steep tangent at x=3 (slope 6)", color: "#ffb454", points: [[1.5, 0], [3, 9]] }
      ],
      interpret: "This overlays two tangents to show that slope <b>magnitude</b> grows as you move away from the bottom. The green line near x = 0.5 is gently tilted (slope 1: small change), while the orange line at x = 3 is steep (slope 6: large change). The numbers are real (2x at x=0.5 and x=3), the lines are drawn illustratively. Takeaway: a steeper tangent means the output is more sensitive to the input there, which in training means a bigger gradient step."
    }
  ],
  caption: "The tangent's tilt is the derivative: positive (up-right), zero (flat at the minimum), or negative (down-right), and its steepness is the size of the slope.",
  code: `import numpy as np
import matplotlib.pyplot as plt

xs = np.linspace(-3, 3, 13)
f = xs ** 2                       # the bowl

# tangent at x0 has slope 2*x0 (the derivative of x^2)
x0 = 1.5
slope = 2 * x0                    # = 3, positive: tilts up to the right
tangent = x0 ** 2 + slope * (xs - x0)

plt.plot(xs, f, color="C0", label="f(x) = x^2")
plt.plot(xs, tangent, color="orange", label="tangent at x=1.5 (slope 3)")
plt.xlabel("x"); plt.ylabel("f(x)")
plt.ylim(-4, 9); plt.legend()
plt.title("x^2 and its tangent slope")
plt.show()`
};

window.CODEVIZ["fnd-gradient"] = {
  question: "Does stepping opposite the gradient walk downhill toward the minimum?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: gradient descent on f = x^2 + y^2 walks to min (0,0)",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "descent points", color: "#7ee787", points: [[3, 4], [2.4, 3.2], [1.92, 2.56], [1.536, 2.048], [1.2288, 1.6384], [0.98304, 1.31072]] },
        { name: "minimum", color: "#4ea1ff", points: [[0, 0]] }
      ],
      lines: [
        { color: "#ffb454", points: [[3, 4], [2.4, 3.2], [1.92, 2.56], [1.536, 2.048], [1.2288, 1.6384], [0.98304, 1.31072]] }
      ],
      interpret: "Axes are the two inputs x and y; the bowl f = x^2 + y^2 has its lowest point (blue star) at (0,0). Each green dot is the point after one step, and the orange line is the path. The gradient at any point is [2x, 2y] (points straight away from the center, uphill), so stepping along <b>minus</b> the gradient slides each green dot steadily inward toward the minimum. A path that marches smoothly downhill like this, never overshooting, is what a well-chosen step size looks like."
    },
    {
      type: "line",
      title: "Ideal: loss f falls smoothly every step (step size 0.1)",
      xlabel: "step",
      ylabel: "f value",
      series: [
        { name: "f", color: "#7ee787", points: [[0, 25], [1, 16], [2, 10.24], [3, 6.5536], [4, 4.1943], [5, 2.6844]] }
      ]
    , interpret: "Horizontal axis is the step number; vertical axis is the value of f (the error) at that step. The curve drops monotonically from 25 toward 0 and flattens as the slope gets gentler near the bottom. A smooth, always-decreasing curve like this is the healthy signature of descent: every step opposite the gradient made things better. These are real computed numbers from the run on the left."
    },
    {
      type: "line",
      title: "Step too large: loss oscillates and blows up (illustrative)",
      xlabel: "step",
      ylabel: "f value",
      series: [
        { name: "f", color: "#ff7b72", points: [[0, 1], [1, 1.44], [2, 2.07], [3, 2.99], [4, 4.3], [5, 6.19]] }
      ]
    , interpret: "Same axes (step number vs error), but here the step size is too big, so each step jumps <b>past</b> the minimum to the far wall of the bowl, landing higher than before. The loss climbs instead of falling and the spacing widens, the classic sawtooth/explosion of a learning rate set too high. Illustrative shape, but qualitatively honest: when you see error growing or bouncing bigger each step, shrink the step size."
    },
    {
      type: "scatter",
      title: "Step too large: path overshoots and spirals outward (illustrative)",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "diverging points", color: "#ff7b72", points: [[0.8, 0.6], [-0.88, -0.66], [0.97, 0.73], [-1.06, -0.8], [1.17, 0.88]] },
        { name: "minimum", color: "#4ea1ff", points: [[0, 0]] }
      ],
      lines: [
        { color: "#ffb454", points: [[0.8, 0.6], [-0.88, -0.66], [0.97, 0.73], [-1.06, -0.8], [1.17, 0.88]] }
      ],
      interpret: "Axes are x and y again, with the true minimum at the blue star. Because the step overshoots, the point flips to the opposite side of (0,0) each step and lands a little farther out, so the path zig-zags and spirals <b>away</b> from the center instead of in. Illustrative points, but the pattern is the tell-tale sign of an unstable step size: the direction (minus the gradient) is correct, the magnitude is not."
    },
    {
      type: "line",
      title: "Stuck on a plateau: gradient near zero, loss barely moves (illustrative)",
      xlabel: "step",
      ylabel: "f value",
      series: [
        { name: "f", color: "#ffb454", points: [[0, 4.0], [1, 3.98], [2, 3.965], [3, 3.955], [4, 3.949], [5, 3.946]] }
      ]
    , interpret: "Step number vs error, but on a nearly flat region the gradient is tiny, so minus-gradient steps are tiny too and the curve crawls almost horizontally well above the true minimum. A long flat stretch like this (or a curve that stalls at a saddle point, where the surface is flat in one direction) means progress has stalled, not that you have converged. Illustrative numbers; in practice momentum, a larger step, or noise from stochastic gradients helps escape such plateaus."
    }
  ],
  caption: "The healthy run (green) steps opposite the gradient and slides from (3,4) to near (0,0) while f falls from 25 to about 2.68; the red and orange variants show what too-large a step (oscillate/diverge) and a flat plateau (stall) look like instead.",
  code: `import numpy as np

# gradient descent on f = x^2 + y^2 from (3, 4)
p = np.array([3.0, 4.0])
lr = 0.1
path = [p.copy()]
losses = [float(p @ p)]
for _ in range(5):
    grad = 2 * p                  # gradient of x^2 + y^2 is [2x, 2y]
    p = p - lr * grad             # step OPPOSITE the gradient (downhill)
    path.append(p.copy())
    losses.append(float(p @ p))

print(np.array(path))
print(losses)                     # 25 -> ... -> ~2.68, smooth descent`
};

window.CODEVIZ["fnd-chain"] = {
  question: "Multiply the local slopes: what does the chain rule give for z = (3x)^2, and what happens when you stack the product across many layers?",
  charts: [
    {
      type: "line",
      title: "Ideal: chain rule recovers the true slope dz/dx = 18x",
      xlabel: "x",
      ylabel: "dz/dx",
      series: [
        { name: "dz/dx = outer(2*3x) times inner(3) = 18x", color: "#7ee787", points: [[-1, -18], [-0.5, -9], [0, 0], [0.5, 9], [1, 18]] }
      ],
      interpret: "The horizontal axis is the input x; the vertical axis is the overall rate dz/dx. For z = (3x)^2 the chain rule multiplies the outer slope 2*(3x) = 6x by the inner slope 3, giving 18x. The straight green line through the origin is exactly that product, and it matches a hand check at x = 1 (slope 18). <b>Read it as: the whole-chain slope is the product of the two step slopes, evaluated at the right point.</b>"
    },
    {
      type: "bars",
      title: "One link of the chain: overall slope = outer slope times inner slope",
      labels: ["outer 2y at x=1", "inner dy/dx", "product dz/dx"],
      values: [6, 3, 18],
      valueLabels: ["6", "3", "18"],
      colors: ["#4ea1ff", "#c89bff", "#7ee787"],
      interpret: "Each bar is one factor in the chain rule at x = 1, where y = 3x = 3. The outer step contributes slope 2y = 6 (blue), the inner step contributes slope 3 (purple), and their <b>product</b> is the green bar, 6 times 3 = 18. The takeaway: you multiply local slopes, you never add them, and the green bar would change if either factor did."
    },
    {
      type: "line",
      title: "Variant - exploding gradient: every layer slope > 1, product blows up (illustrative)",
      xlabel: "layer depth (number of links multiplied)",
      ylabel: "running product of slopes",
      series: [
        { name: "each local slope = 1.5", color: "#ff7b72", points: [[0, 1], [1, 1.5], [2, 2.25], [3, 3.38], [4, 5.06], [5, 7.59], [6, 11.39], [7, 17.09], [8, 25.63], [9, 38.44], [10, 57.67]] }
      ],
      interpret: "Illustrative. The horizontal axis is how deep you are in the chain (how many links you have multiplied); the vertical axis is the running product of their slopes. When every local slope is just above 1 (here 1.5), the product grows exponentially with depth - 10 layers reach about 58. <b>You recognise this as exploding gradients: a steep upward curve. It means weight updates blow up and training diverges; clip the gradient or scale the weights down.</b>"
    },
    {
      type: "line",
      title: "Variant - vanishing gradient: every layer slope < 1, product collapses to ~0 (illustrative)",
      xlabel: "layer depth (number of links multiplied)",
      ylabel: "running product of slopes",
      series: [
        { name: "each local slope = 0.6", color: "#ffb454", points: [[0, 1], [1, 0.6], [2, 0.36], [3, 0.22], [4, 0.13], [5, 0.078], [6, 0.047], [7, 0.028], [8, 0.017], [9, 0.010], [10, 0.006]] }
      ],
      interpret: "Illustrative. Same axes as above: chain depth versus the running product of slopes. When every local slope is below 1 (here 0.6 - the kind of value a saturated sigmoid hands back) the product shrinks toward zero, reaching about 0.006 after 10 links. <b>You recognise this as the vanishing gradient: the curve hugs zero after a few layers, so early layers get almost no signal and stop learning. Fixes are ReLU-style activations, normalization, and residual connections that keep local slopes near 1.</b>"
    },
    {
      type: "line",
      title: "Variant - healthy deep chain: local slopes near 1, product stays usable (illustrative)",
      xlabel: "layer depth (number of links multiplied)",
      ylabel: "running product of slopes",
      series: [
        { name: "each local slope = 0.95", color: "#7ee787", points: [[0, 1], [1, 0.95], [2, 0.90], [3, 0.86], [4, 0.81], [5, 0.77], [6, 0.74], [7, 0.70], [8, 0.66], [9, 0.63], [10, 0.60]] }
      ],
      interpret: "Illustrative, and the case you want. With local slopes kept close to 1 (here 0.95), the product drifts down only gently - still about 0.6 after 10 links rather than collapsing. <b>You recognise a healthy chain by a nearly flat, slowly decaying curve: gradients survive all the way to the early layers, so the whole network can train. This is what normalization and residual connections are engineered to produce.</b>"
    }
  ],
  caption: "The chain rule multiplies the local slope of every step. The ideal/bars charts verify it on z = (3x)^2 (true slope 18x); the three deep-chain variants show why that product is the crux of training - it explodes, vanishes, or stays healthy depending on whether local slopes sit above, below, or near 1.",
  code: `import numpy as np

# z = (3x)^2 through y = 3x, chain rule dz/dx = (2y)*3 = 18x
x = np.array([-1.0, -0.5, 0.0, 0.5, 1.0])
y = 3 * x
outer = 2 * y          # dz/dy
inner = 3              # dy/dx
dz_dx = outer * inner  # = 18x  -> [-18, -9, 0, 9, 18]

# stacking the product across a deep chain of identical local slopes
depth = np.arange(0, 11)
for s in (1.5, 0.6, 0.95):
    product = s ** depth   # running product of slopes per layer
    print(s, np.round(product, 4))
`
};

window.CODEVIZ["fnd-eigen"] = {
  question: "Which directions does a matrix only stretch, and which does it rotate?",
  caption: "Each chart shows a vector before (grey) and after (coloured) the matrix acts. If after is a scaled copy of before, the direction survived and the vector is an eigenvector; if it tilts to a new angle, it is not.",
  charts: [
    {
      type: "scatter",
      title: "Ideal: A = diag(2,3) stretches the two eigen-axes, tilts everything else",
      xlabel: "x1",
      ylabel: "x2",
      groups: [
        { name: "z=[1,0] before", color: "#9aa7b4", points: [[1, 0]] },
        { name: "Az=[2,0] (lambda=2)", color: "#4ea1ff", points: [[2, 0]] },
        { name: "z=[0,1] before", color: "#9aa7b4", points: [[0, 1]] },
        { name: "Az=[0,3] (lambda=3)", color: "#7ee787", points: [[0, 3]] },
        { name: "z=[1,1] before", color: "#9aa7b4", points: [[1, 1]] },
        { name: "Az=[2,3] (tilted)", color: "#ff7b72", points: [[2, 3]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0, 0], [1, 0]] },
        { color: "#4ea1ff", points: [[0, 0], [2, 0]] },
        { color: "#9aa7b4", dash: true, points: [[0, 0], [0, 1]] },
        { color: "#7ee787", points: [[0, 0], [0, 3]] },
        { color: "#9aa7b4", dash: true, points: [[0, 0], [1, 1]] },
        { color: "#ff7b72", points: [[0, 0], [2, 3]] }
      ],
      interpret: "Real numbers for A = [[2,0],[0,3]]. The x-axis and y-axis are this matrix's two <b>eigenvectors</b>: A sends [1,0] to [2,0] (same flat direction, twice as long, eigenvalue 2) and [0,1] to [0,3] (same upward direction, three times as long, eigenvalue 3). The grey dashed [1,1] is an <b>ordinary</b> direction: A maps it to [2,3], a steeper angle, so it rotated and is not an eigenvector. Read it as: blue and green arrows lie on top of their grey before-arrows, the red one swings off."
    },
    {
      type: "scatter",
      title: "Variant: eigenvalue > 1 stretches the eigenvector (longer, same way)",
      xlabel: "x1",
      ylabel: "x2",
      groups: [
        { name: "z before", color: "#9aa7b4", points: [[1.5, 1.5]] },
        { name: "Az = 2z (lambda=2)", color: "#4ea1ff", points: [[3, 3]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0, 0], [1.5, 1.5]] },
        { color: "#4ea1ff", points: [[0, 0], [3, 3]] }
      ],
      interpret: "Illustrative direction, exact arithmetic. Here z is an eigenvector with <b>eigenvalue 2</b>, so Az sits on the very same ray, just twice as far out. Recognise this case by: before and after arrows point the same way, after is the longer one. A bigger-than-1 eigenvalue means that direction is <b>amplified</b> by the matrix; in PCA this is the high-variance direction the data spreads along most."
    },
    {
      type: "scatter",
      title: "Variant: eigenvalue between 0 and 1 shrinks the eigenvector",
      xlabel: "x1",
      ylabel: "x2",
      groups: [
        { name: "z before", color: "#9aa7b4", points: [[3, 0]] },
        { name: "Az = 0.5z (lambda=0.5)", color: "#ffb454", points: [[1.5, 0]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0, 0], [3, 0]] },
        { color: "#ffb454", points: [[0, 0], [1.5, 0]] }
      ],
      interpret: "Illustrative direction, exact arithmetic. Same eigenvector idea, but the <b>eigenvalue is 0.5</b>: Az points the same way as z yet is only half as long. Spot it by: after arrow is shorter than before but still collinear (on the same line). A fractional eigenvalue is a <b>contracting</b> direction; if an eigenvalue were exactly 0 the matrix would flatten that whole direction onto the origin."
    },
    {
      type: "scatter",
      title: "Variant: negative eigenvalue flips the eigenvector to the opposite side",
      xlabel: "x1",
      ylabel: "x2",
      groups: [
        { name: "z before", color: "#9aa7b4", points: [[2, 0]] },
        { name: "Az = -1.5z (lambda=-1.5)", color: "#c89bff", points: [[-3, 0]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0, 0], [2, 0]] },
        { color: "#c89bff", points: [[0, 0], [-3, 0]] }
      ],
      interpret: "Illustrative direction, exact arithmetic. A <b>negative eigenvalue</b> (here -1.5) still keeps z on the same line, but Az points the <b>opposite way</b> and is 1.5 times as long. This still counts as an eigenvector: the line through the origin is preserved even though the arrow flips end-for-end. Recognise it by: before and after arrows are anti-parallel (180 degrees apart) along one straight line through 0."
    },
    {
      type: "scatter",
      title: "Variant: a NON-eigenvector rotates to a new direction (no lambda exists)",
      xlabel: "x1",
      ylabel: "x2",
      groups: [
        { name: "z=[2,1] before", color: "#9aa7b4", points: [[2, 1]] },
        { name: "Az=[4,3] (rotated)", color: "#ff7b72", points: [[4, 3]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[0, 0], [2, 1]] },
        { color: "#ff7b72", points: [[0, 0], [4, 3]] }
      ],
      interpret: "Real numbers for A = [[2,0],[0,3]] acting on z = [2,1]: Az = [4,3], the tilted red arrow. The key signal is that <b>before and after do NOT lie on one line</b>: [2,1] points shallow (slope 1/2), the result [4,3] points steeper (slope 3/4), so the direction changed. No single number lambda turns [2,1] into [4,3], so this is <b>not</b> an eigenvector. This is the common case: almost every direction gets rotated, which is exactly what makes the few eigen-directions special."
    }
  ],
  code: [
    "import numpy as np",
    "",
    "A = np.array([[2.0, 0.0], [0.0, 3.0]])",
    "vals, vecs = np.linalg.eig(A)   # eigenvalues [2., 3.]",
    "",
    "# An eigen-axis only stretches; a generic vector tilts.",
    "z_eig = np.array([1.0, 0.0])    # eigenvector (x-axis)",
    "z_gen = np.array([1.0, 1.0])    # ordinary direction",
    "",
    "Az_eig = A @ z_eig              # [2, 0] = 2 * z_eig  -> same direction",
    "Az_gen = A @ z_gen              # [2, 3]            -> new direction",
    "",
    "print('eigenvalues:', vals)",
    "print('Az_eig == 2*z_eig:', np.allclose(Az_eig, 2 * z_eig))  # True",
    "print('Az_gen parallel to z_gen:', np.allclose(np.cross(Az_gen, z_gen), 0))  # False"
  ].join("\n")
};
