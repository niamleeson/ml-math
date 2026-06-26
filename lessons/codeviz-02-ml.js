/* Per-lesson CODE VISUALIZATIONS — 02-ml.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["ml-supervised"] = {
  question: "Each dot is a labeled example (size, price). What line best maps input to its answer?",
  charts: [
    {
      type: "scatter",
      title: "Healthy: a straight line fits the labeled pairs",
      xlabel: "house size (1000s sq ft)",
      ylabel: "price ($100k)",
      groups: [
        { name: "training examples", color: "#4ea1ff", points: [[1, 2.1], [2, 3.9], [3, 6.2], [4, 7.8], [5, 10.1]] }
      ],
      lines: [
        { color: "#7ee787", dash: false, points: [[0.5, 0.9], [5.5, 11.1]] }
      ],
      interpret: "Each blue dot is one training pair: the x-axis is the input (size), the y-axis is its known answer (price). The green line is the learned hypothesis h(x) that maps any input to a predicted output. Here the dots line up tightly and the line passes through them, so the rule h(x) is about 2 (price rises 2 per unit size) and it should predict new sizes well."
    },
    {
      type: "scatter",
      title: "Underfit: the real pattern curves, a line misses it",
      xlabel: "input feature x",
      ylabel: "answer y",
      groups: [
        { name: "training examples", color: "#4ea1ff", points: [[1, 1.0], [2, 1.4], [3, 2.2], [4, 3.6], [5, 5.8], [6, 9.0]] }
      ],
      lines: [
        { color: "#ffb454", dash: false, points: [[0.5, -0.6], [6.5, 7.4]] }
      ],
      interpret: "Illustrative shape. The blue dots bend upward like a curve, but the orange straight line cannot follow that bend: it sits above the dots at the ends and below them in the middle. When a line systematically misses the shape of the data like this, the model is too simple (underfitting); you need a curved hypothesis or extra features."
    },
    {
      type: "scatter",
      title: "Heteroscedastic: spread grows, fit gets shaky on the right",
      xlabel: "input feature x",
      ylabel: "answer y",
      groups: [
        { name: "training examples", color: "#4ea1ff", points: [[1, 2.0], [2, 3.9], [3, 5.8], [4, 8.6], [4, 7.2], [5, 12.0], [5, 8.0], [6, 14.5], [6, 9.5]] }
      ],
      lines: [
        { color: "#7ee787", dash: false, points: [[0.5, 1.0], [6.5, 13.0]] }
      ],
      interpret: "Illustrative shape. The dots hug the line tightly on the left but fan out wider and wider on the right, so the answers become noisier as x grows. The line is still roughly right on average, but predictions on the right are far less trustworthy. This uneven spread (heteroscedasticity) means a single fit hides that some inputs are much harder to predict than others."
    },
    {
      type: "scatter",
      title: "Outlier: one bad label bends the whole line",
      xlabel: "input feature x",
      ylabel: "answer y",
      groups: [
        { name: "clean examples", color: "#4ea1ff", points: [[1, 2.0], [2, 4.0], [3, 6.0], [4, 8.0], [5, 10.0]] },
        { name: "outlier (mislabeled)", color: "#ff7b72", points: [[3, 18.0]] }
      ],
      lines: [
        { color: "#7ee787", dash: true, points: [[0.5, 1.0], [5.5, 11.0]] },
        { color: "#ff7b72", dash: false, points: [[0.5, 3.4], [5.5, 13.4]] }
      ],
      interpret: "Illustrative shape. The blue dots sit on the clean green dashed line, but the single red point is mislabeled far too high. Squared-error fitting chases that one point, so the solid red line is dragged upward and no longer matches the honest data. A few bad labels can poison a supervised fit, which is why auditing labels and checking for outliers matters before you trust the rule."
    }
  ],
  caption: "",
  code: "var X = [1, 2, 3, 4, 5];\nvar Y = [2.1, 3.9, 6.2, 7.8, 10.1];\n// least-squares best-fit line through the labeled pairs\nvar n = X.length, sx = 0, sy = 0, sxx = 0, sxy = 0;\nfor (var i = 0; i < n; i++) {\n  sx += X[i]; sy += Y[i]; sxx += X[i] * X[i]; sxy += X[i] * Y[i];\n}\nvar slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);\nvar intercept = (sy - slope * sx) / n;\n// the learned hypothesis h(x)\nfunction h(x) { return slope * x + intercept; }\nconsole.log('h(x) = ' + slope.toFixed(2) + ' x + ' + intercept.toFixed(2));\nconsole.log('predict size 1.8 -> ' + h(1.8).toFixed(2));"
};

window.CODEVIZ["ml-loss"] = {
  question: "How wrong is one prediction? Plot the loss against the gap between truth and guess.",
  charts: [
    {
      type: "line",
      title: "Squared loss: tiny near zero, grows fast as the gap widens",
      xlabel: "residual r = y - z (truth minus prediction)",
      ylabel: "loss L",
      series: [
        { name: "squared loss = r^2/2", color: "#7ee787", points: [[-3, 4.5], [-2, 2.0], [-1, 0.5], [0, 0.0], [1, 0.5], [2, 2.0], [3, 4.5]] }
      ],
      interpret: "The x-axis is the residual r, how far the prediction missed the true answer (0 means perfect). The y-axis is the loss, the penalty for that miss. The curve is a U-shaped bowl bottoming at 0: small misses cost almost nothing, but the penalty climbs steeply, so a gap of 2 (loss 2) hurts four times as much as a gap of 1 (loss 0.5). Training pushes predictions toward the bottom of this bowl."
    },
    {
      type: "line",
      title: "Hinge loss: zero once the margin is safely past 1",
      xlabel: "margin m (how confidently correct)",
      ylabel: "loss L",
      series: [
        { name: "hinge = max(0, 1 - m)", color: "#4ea1ff", points: [[-2, 3], [-1, 2], [0, 1], [1, 0], [2, 0], [3, 0]] }
      ],
      interpret: "Illustrative. Used for SVM classifiers, the x-axis is the margin (positive means the example is on the correct side, larger means more confident). The line slopes down then flattens at exactly zero past m = 1: once a point is correctly classified with room to spare, it adds no loss at all. Unlike squared loss, hinge loss stops caring about examples already comfortably right and only penalizes the borderline or wrong ones."
    },
    {
      type: "line",
      title: "Squared vs absolute: which one outliers can bully",
      xlabel: "residual r = y - z",
      ylabel: "loss L",
      series: [
        { name: "squared = r^2/2", color: "#ff7b72", points: [[-4, 8], [-3, 4.5], [-2, 2], [-1, 0.5], [0, 0], [1, 0.5], [2, 2], [3, 4.5], [4, 8]] },
        { name: "absolute = |r|", color: "#7ee787", points: [[-4, 4], [-3, 3], [-2, 2], [-1, 1], [0, 0], [1, 1], [2, 2], [3, 3], [4, 4]] }
      ],
      interpret: "Illustrative comparison of two losses on the same residual. The red squared-loss curve bends upward fast, so a far-off point (large r) contributes a huge penalty and dominates the fit. The green absolute-loss line rises in a straight V, so a distant outlier costs only in proportion to its distance. When data has outliers, the gentler absolute (or Huber) loss is more robust because no single bad point can bully the model."
    },
    {
      type: "line",
      title: "Asymmetric loss: under-predicting punished harder",
      xlabel: "residual r = y - z",
      ylabel: "loss L",
      series: [
        { name: "asymmetric cost", color: "#ffb454", points: [[-3, 1.5], [-2, 1.0], [-1, 0.5], [0, 0], [1, 2.0], [2, 4.0], [3, 6.0]] }
      ],
      interpret: "Illustrative. Here the loss curve is lopsided around zero: the right arm (positive r, where truth exceeds the guess, i.e. under-prediction) climbs much faster than the left arm. That encodes a real-world cost imbalance, for example missing demand being far worse than overstocking. When a false low costs more than a false high, a symmetric loss optimizes the wrong thing and you deliberately tilt the loss like this."
    }
  ],
  caption: "",
  code: "// least-squared loss for one prediction\nfunction loss(y, z) { return 0.5 * (y - z) * (y - z); }\nvar y = 300;       // true price ($k)\nvar z = 280;       // model prediction\nvar gap = y - z;   // 20\nconsole.log('gap = ' + gap);\nconsole.log('L = ' + loss(y, z));        // 0.5 * 400 = 200\n// twice the gap is four times the loss\nconsole.log('L(gap 40) = ' + loss(340, 300)); // 800"
};

window.CODEVIZ["ml-cost"] = {
  question: "What does the cost J(θ) look like as you sweep the parameter θ?",
  charts: [
    {
      type: "line",
      title: "Healthy convex cost: one bowl, one bottom",
      xlabel: "parameter θ",
      ylabel: "cost J(θ)",
      series: [
        {
          name: "J(θ) for data (1,2),(2,4),(3,6)",
          color: "#7ee787",
          points: [
            [-1, 21.00], [-0.5, 15.19], [0, 9.33], [0.5, 5.25], [1, 2.33],
            [1.5, 0.58], [2, 0.00], [2.5, 0.58], [3, 2.33], [3.5, 5.25],
            [4, 9.33], [4.5, 15.19], [5, 21.00]
          ]
        }
      ],
      interpret: "<b>Real numbers.</b> X is the parameter θ; Y is the total cost J(θ) = mean of ½(θ·x − y)² over the three points (1,2),(2,4),(3,6). The curve is a parabola (a bowl): cost is high when θ is far from the data's slope and drops to its lowest point at <b>θ = 2, where J = 0</b> (the line y = 2x hits every point exactly). Read it as a height map of badness — training just rolls θ down into the single valley, and because there is only one bottom, you always land on the best answer."
    },
    {
      type: "line",
      title: "Stretched valley: unscaled features make a narrow trough",
      xlabel: "parameter θ",
      ylabel: "cost J(θ)",
      series: [
        {
          name: "steep, narrow cost (illustrative)",
          color: "#ffb454",
          points: [
            [-1, 240], [-0.5, 168.7], [0, 106.7], [0.5, 60], [1, 26.7],
            [1.5, 6.67], [2, 0.00], [2.5, 6.67], [3, 26.7], [3.5, 60],
            [4, 106.7], [4.5, 168.7], [5, 240]
          ]
        }
      ],
      interpret: "<b>Illustrative.</b> Same single minimum at θ = 2, but the bowl is far steeper and narrower — this is what an <i>unscaled</i> or large-magnitude feature does to the cost. The walls climb very fast, so a fixed-size gradient step that was fine on the gentle bowl now overshoots and zig-zags across the trough. The fix is not a new minimum — it is standardizing features so the valley becomes round and easy to descend."
    },
    {
      type: "line",
      title: "Non-convex cost: many minima beyond linear models",
      xlabel: "parameter θ",
      ylabel: "cost J(θ)",
      series: [
        {
          name: "wavy cost with several dips (illustrative)",
          color: "#ff7b72",
          points: [
            [-1, 9.0], [-0.5, 5.5], [0, 3.2], [0.5, 4.8], [1, 7.0],
            [1.5, 4.2], [2, 1.0], [2.5, 3.5], [3, 6.5], [3.5, 4.0],
            [4, 2.0], [4.5, 5.0], [5, 8.0]
          ]
        }
      ],
      interpret: "<b>Illustrative.</b> For models past linear regression the cost is no longer one clean bowl — it ripples with several dips (local minima) and humps. The <b>global</b> best is the deepest dip (here near θ = 2, J ≈ 1), but a descent that starts on the left can get stuck in the shallower dip near θ = 0 (J ≈ 3.2). Recognise this shape by multiple valleys: the answer you get now depends on where you start and which optimizer you use, so do not expect a single guaranteed bottom."
    }
  ],
  caption: "Cost J(θ) is a height map over the parameter: the ideal is a single convex bowl, but scaling and non-convexity change how hard the bottom is to reach.",
  code: "// Cost J(theta) for points (1,2),(2,4),(3,6) with h(x)=theta*x\nconst X = [1,2,3], Y = [2,4,6];\nfunction J(theta) {\n  let s = 0;\n  for (let i = 0; i < X.length; i++) {\n    const e = theta * X[i] - Y[i];\n    s += 0.5 * e * e;\n  }\n  return s / X.length; // average loss = the cost\n}\nfor (let t = -1; t <= 5; t += 0.5) {\n  console.log('theta=' + t.toFixed(1) + '  J=' + J(t).toFixed(2));\n}\n// bottoms out at theta=2 with J=0"
};

window.CODEVIZ["ml-gradient-descent"] = {
  question: "How do you read whether gradient descent is converging, overshooting, or crawling?",
  charts: [
    {
      type: "line",
      title: "Healthy descent: cost falls smoothly to the bottom",
      xlabel: "step number",
      ylabel: "cost J(θ)",
      series: [
        {
          name: "α = 0.1 (good rate)",
          color: "#7ee787",
          points: [
            [0, 25.00], [1, 16.00], [2, 10.24], [3, 6.55], [4, 4.19],
            [5, 2.68], [6, 1.72], [7, 1.10], [8, 0.70], [9, 0.45], [10, 0.29]
          ]
        }
      ],
      interpret: "<b>Real numbers.</b> X is the step count; Y is the cost after each update of θ ← θ − α·∇J, for J(θ) = θ² (slope 2θ) starting at θ = 5 with α = 0.1. Each step moves opposite the slope, so the cost drops every time and the curve falls fast then flattens as it nears the bottom (J → 0). A monotone, smoothly-decaying curve like this is the signal that your learning rate is well chosen — keep going until it stops dropping."
    },
    {
      type: "line",
      title: "Learning rate too big: cost oscillates and diverges",
      xlabel: "step number",
      ylabel: "cost J(θ)",
      series: [
        {
          name: "α = 1.05 (overshoots)",
          color: "#ff7b72",
          points: [
            [0, 25.00], [1, 30.25], [2, 36.60], [3, 44.29], [4, 53.59],
            [5, 64.84], [6, 78.46], [7, 94.94], [8, 114.87], [9, 139.00], [10, 168.19]
          ]
        }
      ],
      interpret: "<b>Real numbers.</b> Same J(θ) = θ² and start θ = 5, but α = 1.05 makes each step jump <i>past</i> the minimum to the other wall — a bit farther out every time — so the cost climbs instead of falling and runs off to infinity. Read the upward (or saw-tooth) trend as the classic too-large learning rate: the step size is bigger than the bowl can absorb. Cut α (here anything below 1 converges) and the curve flips back to the healthy shape."
    },
    {
      type: "line",
      title: "Learning rate too small: descent crawls, never arrives",
      xlabel: "step number",
      ylabel: "cost J(θ)",
      series: [
        {
          name: "α = 0.005 (too tiny)",
          color: "#ffb454",
          points: [
            [0, 25.00], [1, 24.50], [2, 24.01], [3, 23.53], [4, 23.06],
            [5, 22.60], [6, 22.15], [7, 21.71], [8, 21.28], [9, 20.85], [10, 20.44]
          ]
        }
      ],
      interpret: "<b>Real numbers.</b> Again J(θ) = θ² from θ = 5, but α = 0.005 makes each step a tiny nudge, so after 10 steps the cost has barely moved (25 → 20.4) and is still far from 0. A nearly-flat, slowly-sloping curve means the rate is too small: it is safe (no overshoot) but wastes enormous numbers of steps. Increase α so the curve drops with real purpose — the goal is the steep, settling shape of the healthy case, not this gentle creep."
    },
    {
      type: "scatter",
      title: "Path on the cost surface: smooth zig vs overshoot",
      xlabel: "parameter a",
      ylabel: "parameter b",
      groups: [
        { name: "minimum", color: "#7ee787", points: [[0, 0]] },
        { name: "start", color: "#c89bff", points: [[4, 3]] }
      ],
      lines: [
        { color: "#7ee787", dash: [], points: [[4, 3], [2.4, 1.2], [1.44, 0.48], [0.86, 0.19], [0.52, 0.08], [0.31, 0.03], [0.19, 0.01], [0, 0]] },
        { color: "#ff7b72", dash: [5, 4], points: [[4, 3], [-3.2, -3.6], [2.56, 4.32], [-2.05, -5.18], [1.64, 6.22], [-1.31, -7.46]] }
      ],
      interpret: "<b>Illustrative path view.</b> Here the two axes are the two parameters (a, b) and you are looking down on the cost bowl from above; the green dot is the minimum, the purple dot the start. The <b>green</b> path (good α) curves steadily inward and settles on the minimum, while the <b>red dashed</b> path (too-large α) flings across the valley, landing farther out each time — that outward zig-zag is divergence seen in parameter space, the same failure the rising cost curve shows from the side."
    }
  ],
  caption: "Plot cost against step number to diagnose the learning rate: a smooth drop is healthy, a rising or oscillating curve means α is too big, and a nearly-flat crawl means α is too small.",
  code: "// Gradient descent on J(theta) = theta^2, slope 2*theta\nfunction run(alpha, steps) {\n  let theta = 5;\n  const hist = [];\n  for (let n = 0; n <= steps; n++) {\n    hist.push([n, theta * theta]); // [step, cost]\n    theta = theta - alpha * (2 * theta); // theta <- theta - alpha*grad\n  }\n  return hist;\n}\nconsole.log('good ', run(0.1, 10).map(p => p[1].toFixed(2)));\nconsole.log('big  ', run(1.05, 10).map(p => p[1].toFixed(2)));\nconsole.log('tiny ', run(0.005, 10).map(p => p[1].toFixed(2)));"
};

window.CODEVIZ["ml-linear-regression"] = {
  question: "How do you read a scatter plot to judge whether a straight line actually fits?",
  charts: [
    {
      type: "scatter",
      title: "Good linear fit: points hug the line, residuals small and balanced",
      xlabel: "x (feature, e.g. house size)",
      ylabel: "y (target, e.g. price)",
      groups: [
        { name: "data", color: "#4ea1ff", points: [[1,2.2],[2,3.8],[3,6.1],[4,7.9],[5,9.8]] }
      ],
      lines: [
        { color: "#7ee787", dash: [5,4], points: [[0,0.17],[5.6,10.98]] }
      ],
      interpret: "<b>Horizontal axis</b> is the input x, <b>vertical axis</b> is the value y you predict. Blue dots are the real data; the <b>green dashed line</b> is the least-squares best fit (slope 1.93, intercept 0.17, computed from these 5 points). The dots sit tightly and evenly on both sides of the line, so the vertical gaps (residuals) are small and have no pattern. <b>Conclusion:</b> a straight line is the right model here."
    },
    {
      type: "scatter",
      title: "Heteroscedastic fan: spread grows with x (illustrative)",
      xlabel: "x (feature)",
      ylabel: "y (target)",
      groups: [
        { name: "data", color: "#ffb454", points: [[1,2.1],[2,3.7],[2,4.3],[3,5.6],[3,6.6],[4,6.9],[4,9.3],[5,7.8],[5,12.4]] }
      ],
      lines: [
        { color: "#7ee787", dash: [5,4], points: [[0,0.3],[5.6,11.5]] }
      ],
      interpret: "Same axes. The line still passes through the middle, but the dots scatter <b>tightly on the left and widely on the right</b> — a funnel shape. This is <b>heteroscedasticity</b> (illustrative): the error size is not constant, it grows with x. The line's slope can still be roughly right, but your uncertainty is much larger for big x, so prediction intervals and p-values from a plain fit are untrustworthy. <b>Recognise it</b> by a fanning residual cloud; fix with weighting or a transform."
    },
    {
      type: "scatter",
      title: "Non-linear pattern a line misses: curved data (illustrative)",
      xlabel: "x (feature)",
      ylabel: "y (target)",
      groups: [
        { name: "data", color: "#ff7b72", points: [[1,1.1],[2,1.5],[3,2.4],[4,4.2],[5,7.1],[6,11.3]] }
      ],
      lines: [
        { color: "#7ee787", dash: [5,4], points: [[0,-2.6],[6.6,11.6]] }
      ],
      interpret: "Same axes. The dots bend in a clear <b>curve</b> (here accelerating upward), but the straight green line cannot bend. Watch the residuals: the line sits <b>above</b> the data in the middle and <b>below</b> it at the ends, so the gaps switch sign in a U-shaped pattern instead of looking random (illustrative). <b>Conclusion:</b> the relationship is non-linear — a straight line systematically mis-predicts. Add a polynomial / interaction term, or use a curved model."
    }
  ],
  caption: "Read a fit by its residuals: small and patternless means a line fits; a fan means non-constant error; a U-shaped sign pattern means the truth is curved.",
  code: `// Least-squares best-fit line for the main (good-fit) chart.
const X = [1,2,3,4,5], Y = [2.2,3.8,6.1,7.9,9.8];
const n = X.length;
let sx=0, sy=0, sxx=0, sxy=0;
for (let i=0;i<n;i++){ sx+=X[i]; sy+=Y[i]; sxx+=X[i]*X[i]; sxy+=X[i]*Y[i]; }
const m = (n*sxy - sx*sy) / (n*sxx - sx*sx);   // slope  = 1.93
const b = (sy - m*sx) / n;                      // intercept = 0.17
// residuals: gaps between each dot and the line. small + no pattern = good fit.
const resid = X.map((x,i) => Y[i] - (m*x + b));
console.log("slope", m.toFixed(2), "intercept", b.toFixed(2), "residuals", resid);`
};

window.CODEVIZ["ml-likelihood"] = {
  question: "How do you read a likelihood curve to find which parameter best explains your data?",
  charts: [
    {
      type: "line",
      title: "Likelihood curve: 7 heads in 10 flips, peak at the MLE θ = 0.7",
      xlabel: "θ (assumed heads-probability)",
      ylabel: "likelihood L(θ) = θ^7 (1−θ)^3",
      series: [
        { name: "L(θ)", color: "#4ea1ff", points: [
          [0.1,7.29e-8],[0.2,6.55e-6],[0.3,7.50e-5],[0.4,3.54e-4],[0.5,9.77e-4],
          [0.6,1.79e-3],[0.7,2.22e-3],[0.8,1.68e-3],[0.9,4.78e-4],[0.95,9.45e-5]
        ] }
      ],
      interpret: "<b>Horizontal axis</b> is a guess for the coin's true heads-probability θ; <b>vertical axis</b> is the likelihood — how probable the observed data (7 heads in 10 flips) is under that guess. The curve <b>rises to a single peak and falls</b>; the θ at the top is the maximum-likelihood estimate. Here it sits exactly at θ = 7/10 = <b>0.7</b>, the observed fraction of heads. <b>Read it as:</b> the highest point names the best parameter, not the height itself."
    },
    {
      type: "line",
      title: "Sharp peak: lots of data (70 heads in 100), MLE pinned at 0.7 (illustrative)",
      xlabel: "θ (assumed heads-probability)",
      ylabel: "likelihood (rescaled to peak = 1)",
      series: [
        { name: "L(θ)", color: "#7ee787", points: [
          [0.5,0.001],[0.6,0.13],[0.65,0.50],[0.68,0.86],[0.7,1.0],
          [0.72,0.86],[0.75,0.50],[0.8,0.13],[0.9,0.0008]
        ] }
      ],
      interpret: "Same axes (height rescaled so the peak is 1 for comparison). With far more data the peak is <b>tall and narrow</b> — likelihood collapses fast as θ moves off 0.7 (illustrative). A narrow peak means the data <b>pins down</b> the parameter: you are confident the answer is near 0.7. <b>Recognise it</b> by steep sides; it signals a tight confidence interval."
    },
    {
      type: "line",
      title: "Flat peak: little data (1 head in 1 flip), barely any preference (illustrative)",
      xlabel: "θ (assumed heads-probability)",
      ylabel: "likelihood L(θ) = θ^1",
      series: [
        { name: "L(θ)", color: "#ffb454", points: [
          [0.05,0.05],[0.2,0.2],[0.4,0.4],[0.6,0.6],[0.8,0.8],[0.95,0.95],[0.999,1.0]
        ] }
      ],
      interpret: "Same axes. With only one flip (a single head) the curve just <b>rises gently</b> with no real bump — its maximum is shoved against θ = 1 (illustrative). A <b>flat, broad</b> shape means the data barely distinguishes parameters: the bare MLE here would be θ = 1 (\"always heads\"), an obvious over-fit from one example. <b>Recognise it</b> by the lack of a clear peak; it warns you to collect more data or add a prior / smoothing instead of trusting the maximum."
    },
    {
      type: "line",
      title: "Log-likelihood view: same data (7/10), smooth bowl peaking at 0.7",
      xlabel: "θ (assumed heads-probability)",
      ylabel: "log L(θ) = 7·ln θ + 3·ln(1−θ)",
      series: [
        { name: "log L(θ)", color: "#c89bff", points: [
          [0.1,-16.43],[0.2,-11.94],[0.3,-9.50],[0.4,-7.95],[0.5,-6.93],
          [0.6,-6.32],[0.7,-6.11],[0.8,-6.39],[0.9,-7.65],[0.95,-9.27]
        ] }
      ],
      interpret: "Same horizontal axis, but the <b>vertical axis is the log</b> of the likelihood — taking logs turns the tiny product of probabilities into a sum that does not underflow. The shape becomes a smooth <b>hill (concave bowl flipped up)</b> whose top is at the very same θ = <b>0.7</b>: the log never moves the location of the maximum, it only rescales it. <b>Read it as:</b> in practice you always maximise this curve, because its sums are numerically stable and easy to differentiate."
    }
  ],
  caption: "The peak of the likelihood names the best parameter; a narrow peak means the data is decisive, a flat one means it is not. Maximise the log-likelihood — same peak, stable math.",
  code: `// Likelihood for h heads in n flips, swept over candidate θ — the main chart.
const h = 7, n = 10;
const L = theta => Math.pow(theta, h) * Math.pow(1 - theta, n - h);
let best = 0, bestL = -1;
for (let theta = 0.01; theta < 1; theta += 0.01) {
  const v = L(theta);
  if (v > bestL) { bestL = v; best = theta; }   // track the argmax
}
console.log("MLE theta", best.toFixed(2), "= h/n =", (h/n).toFixed(2)); // 0.70
// In practice maximise the log-likelihood instead (a sum, no underflow):
const logL = theta => h*Math.log(theta) + (n-h)*Math.log(1-theta); // same peak`
};

window.CODEVIZ["ml-logistic-regression"] = {
  question: "How do you read a classifier that outputs a probability instead of a label?",
  caption: "Logistic regression bends a straight score into an S-shaped probability, then cuts it at a threshold. The charts show the healthy S-curve, how the threshold trades off the two error types (ROC), and the two ways the picture goes wrong: overlapping classes and rare positives.",
  charts: [
    {
      type: "line",
      title: "Ideal: sigmoid maps score z to probability (clean separation)",
      xlabel: "score z = weights . features",
      ylabel: "P(y=1 | x)",
      series: [
        { name: "sigmoid g(z) = 1/(1+e^-z)", color: "#4ea1ff", points: [
          [-6, 0.002], [-5, 0.007], [-4, 0.018], [-3, 0.047], [-2, 0.119],
          [-1, 0.269], [0, 0.5], [1, 0.731], [2, 0.881], [3, 0.953],
          [4, 0.982], [5, 0.993], [6, 0.998] ] },
        { name: "threshold p = 0.5", color: "#9aa7b4", points: [[-6, 0.5], [6, 0.5]] }
      ],
      interpret: "The x-axis is the raw linear score z (any real number); the y-axis is the probability the model assigns to class 1. The blue S-curve <b>squashes</b> z into (0,1): far left it flattens near 0 (confident 'no'), far right near 1 (confident 'yes'), and it crosses 0.5 exactly at z = 0. The grey line is the decision cut: points whose curve value sits above it are called 1, below it are called 0. A steep, well-placed S like this means the two classes are cleanly separable."
    },
    {
      type: "roc",
      auc: 0.93,
      title: "Reading threshold trade-offs: ROC bows to the top-left (strong)",
      points: [[0, 0], [0.02, 0.45], [0.05, 0.7], [0.1, 0.82], [0.2, 0.9], [0.35, 0.95], [0.6, 0.98], [1, 1]],
      interpret: "Every point on this curve is one choice of threshold. The x-axis is the false-positive rate (true 0s wrongly called 1); the y-axis is the true-positive rate (true 1s correctly caught). Sliding the threshold walks you along the curve: a strict cut sits bottom-left (few false alarms, few catches), a loose cut sits top-right. Because the curve <b>bows up toward the top-left</b>, you can catch most positives while raising few false alarms; the area underneath (AUC = 0.93) near 1 confirms a strong classifier. The diagonal would be coin-flipping."
    },
    {
      type: "line",
      title: "Overlapping classes: shallow sigmoid, no clean cut (illustrative)",
      xlabel: "score z = weights . features",
      ylabel: "P(y=1 | x)",
      series: [
        { name: "sigmoid (weak, shallow)", color: "#ffb454", points: [
          [-6, 0.27], [-4, 0.33], [-2, 0.40], [0, 0.5], [2, 0.60], [4, 0.67], [6, 0.73] ] },
        { name: "threshold p = 0.5", color: "#9aa7b4", points: [[-6, 0.5], [6, 0.5]] }
      ],
      interpret: "Same axes as the ideal chart, but illustrative. Here the S-curve is <b>shallow and lazy</b> - even at the extremes the probability only drifts to about 0.27 or 0.73, never near 0 or 1. That flatness is what a weak feature looks like: the classes overlap so much that the model is unsure everywhere and the 0.5 cut splits a fuzzy middle. Expect many points sitting near 0.5 and accuracy only a little above chance. Fix by adding better features, not by nudging the threshold."
    },
    {
      type: "confusion",
      labels: ["actual 0", "actual 1"],
      matrix: [[940, 10], [35, 15]],
      title: "Class imbalance: majority-class collapse (illustrative)",
      interpret: "Rows are the true label, columns are the prediction (so the diagonal is correct, off-diagonal is errors). Out of 1000 cases only 50 are real positives. The model gets 955/1000 'right' yet catches just 15 of 50 positives - it mostly predicts the common class 0. <b>High overall accuracy hides terrible recall on the rare class.</b> This is the trap of imbalance: judge such a model by precision/recall or PR-AUC, lower the threshold or weight the classes - never trust raw accuracy."
    }
  ],
  code: "// Sigmoid maps any score z into a probability in (0,1)\nfunction sigmoid(z){ return 1/(1+Math.exp(-z)); }\nconst zs = [-6,-4,-2,-1,0,1,2,4,6];\nfor (const z of zs) {\n  const p = sigmoid(z);\n  const label = p >= 0.5 ? 1 : 0;  // decide with threshold 0.5\n  console.log('z=' + z + '  p=' + p.toFixed(3) + '  -> class ' + label);\n}\n// z=0 gives exactly 0.5 (perfectly unsure); big +z -> ~1, big -z -> ~0"
};

window.CODEVIZ["ml-softmax"] = {
  question: "How do you read the bar chart of probabilities that comes out of a softmax?",
  caption: "Softmax turns a list of raw class scores into a set of bars that are all positive and add up to exactly 1. The charts show a confident winner, a near-tie where the model is genuinely unsure, and an overconfident output that crowns the wrong class - plus what temperature does to the spread.",
  charts: [
    {
      type: "bars",
      title: "Ideal: scores [2, 1, 0] become a clear winner (sums to 1)",
      labels: ["class 1", "class 2", "class 3"],
      values: [0.665, 0.245, 0.090],
      valueLabels: ["0.665", "0.245", "0.090"],
      colors: ["#7ee787", "#4ea1ff", "#9aa7b4"],
      interpret: "Each bar is the probability softmax gives one class; the heights always <b>add up to 1</b> (0.665 + 0.245 + 0.090 = 1.00). They come from exponentiating the raw scores 2, 1, 0 (e^2=7.39, e^1=2.72, e^0=1) and dividing by their total 11.11. Read it as: the tallest bar is the prediction (class 1) and its height is the model's confidence. A clear gap between the top bar and the rest, like here, means a decisive, trustworthy call."
    },
    {
      type: "bars",
      title: "Near-tie: scores [0.2, 0.1, 0.0] give a flat, unsure spread",
      labels: ["class 1", "class 2", "class 3"],
      values: [0.367, 0.332, 0.301],
      valueLabels: ["0.367", "0.332", "0.301"],
      colors: ["#ffb454", "#ffb454", "#ffb454"],
      interpret: "Same axes and the bars still sum to 1, but now the scores are almost equal (0.2, 0.1, 0.0) so the bars come out <b>nearly flat</b> - 0.37 vs 0.33 vs 0.30. Argmax still picks class 1, but the tiny lead means the model is barely choosing. When you see bars this even, treat the top label as a weak guess: gather more signal or abstain rather than acting on a 0.37 'winner'. Flatness is honesty, not failure."
    },
    {
      type: "bars",
      title: "Overconfident-and-wrong: a tall bar on the wrong class (illustrative)",
      labels: ["class 1 (TRUE)", "class 2", "class 3"],
      values: [0.07, 0.90, 0.03],
      valueLabels: ["0.07", "0.90 (wrong)", "0.03"],
      colors: ["#9aa7b4", "#ff7b72", "#9aa7b4"],
      interpret: "Illustrative. The bars still sum to 1, but here the model slams 0.90 onto class 2 while the true label is class 1. <b>A tall bar is confidence, not correctness</b> - softmax always sums to 1, so it can never say 'none of these' and will crown a class even for a garbled or out-of-distribution input. When confident predictions are often wrong, the model is mis-calibrated: use temperature scaling, label smoothing, or an explicit reject class."
    },
    {
      type: "bars",
      title: "Temperature sharpens or flattens the same scores (illustrative)",
      series: [
        { name: "T = 0.5 (sharper)", color: "#4ea1ff", points: [[0, 0.844], [1, 0.114], [2, 0.042]] },
        { name: "T = 2.0 (softer)", color: "#c89bff", points: [[0, 0.506], [1, 0.307], [2, 0.187]] }
      ],
      labels: ["class 1", "class 2", "class 3"],
      interpret: "Two settings of the same scores 2, 1, 0, divided by a temperature T before softmax; each colored set of bars still sums to 1. <b>Low T (blue) sharpens</b> - it pushes the winner toward 1 and starves the rest (0.84 vs 0.11 vs 0.04). <b>High T (purple) softens</b> - it flattens everything toward equal (0.51 vs 0.31 vs 0.19). Same ranking, different confidence. This is the dial you turn to fix over- or under-confidence without retraining."
    }
  ],
  code: "// Softmax: exponentiate each score, then divide by the total\nfunction softmax(zs){\n  const exps = zs.map(function(z){ return Math.exp(z); });\n  const sum = exps.reduce(function(a,b){ return a+b; }, 0);\n  return exps.map(function(e){ return e/sum; });\n}\nconst probs = softmax([2, 1, 0]);\nprobs.forEach(function(p, i){\n  console.log('class ' + (i+1) + ': p=' + p.toFixed(3));\n});\nconsole.log('sum = ' + probs.reduce(function(a,b){return a+b;},0).toFixed(3)); // always 1\n// -> 0.665, 0.245, 0.090 ; class 1 wins"
};

window.CODEVIZ["ml-glm"] = {
  question: "One linear score η = θᵀx, many output types — how does the link curve change with the family you pick?",
  charts: [
    {
      type: "line",
      title: "Ideal: the link maps the same linear score η to different means",
      xlabel: "natural parameter  η = θᵀx",
      ylabel: "predicted mean of y",
      series: [
        { name: "Bernoulli: σ(η) = 1/(1+e^-η)", color: "#4ea1ff", points: [[-4,0.018],[-3,0.047],[-2,0.119],[-1,0.269],[0,0.5],[1,0.731],[2,0.881],[3,0.953],[4,0.982]] },
        { name: "Poisson: mean = e^η", color: "#ffb454", points: [[-4,0.018],[-3,0.05],[-2,0.135],[-1,0.368],[0,1],[1,2.718],[2,7.389],[3,12]] }
      ],
      interpret: "<b>Same horizontal axis</b> (the linear score η = θᵀx) feeds <b>both</b> models; only the link curve differs. Blue (Bernoulli → logistic regression) is squashed into (0,1): an η of 0 means a 50% chance, large η saturates near 1. Orange (Poisson → count regression) instead grows like e^η, always positive and shooting upward — η = 2 gives a mean count of e² ≈ 7.39. Read this as: pick the family, get the matching curve; the linear part underneath is identical."
    },
    {
      type: "scatter",
      title: "Variant you might see: wrong family — fitted-vs-actual fans out (illustrative)",
      xlabel: "predicted mean",
      ylabel: "actual y (counts)",
      groups: [
        { name: "count data fit with Gaussian", color: "#ff7b72", points: [[1,0],[1.2,3],[2,0],[2.5,1],[3,7],[3,0],[4,12],[4.5,2],[5,18],[5.5,1],[6,25],[6.5,4]] }
      ],
      lines: [ { color: "#9aa7b4", dash: [5,4], points: [[0,0],[7,7]] } ],
      interpret: "Illustrative. Axes: x = what the model predicts, y = the real value; the grey dashed line is perfect agreement. When you fit <b>count</b> data with the wrong (Gaussian) family, the spread of points <b>fans out as the prediction grows</b> — variance rises with the mean — and some predictions even fall below zero. That widening cone is the tell-tale sign the family is wrong; switch to Poisson (or negative binomial) so the variance is allowed to grow with the mean."
    },
    {
      type: "line",
      title: "Variant: overdispersion — real variance climbs faster than Poisson allows (illustrative)",
      xlabel: "predicted mean  μ",
      ylabel: "observed variance of y",
      series: [
        { name: "Poisson assumes variance = mean", color: "#7ee787", points: [[1,1],[2,2],[4,4],[6,6],[8,8],[10,10]] },
        { name: "actual (overdispersed)", color: "#ff7b72", points: [[1,1.4],[2,3.5],[4,9],[6,17],[8,28],[10,42]] }
      ],
      interpret: "Illustrative. Poisson makes one rigid promise: the <b>variance equals the mean</b> (green diagonal). If your observed spread (red) rises <b>above</b> that line as the mean grows, the data is <b>overdispersed</b> — more variable than Poisson can represent. Ignoring it makes standard errors too small and significance look better than it is. The fix is a negative-binomial family or an explicit dispersion term."
    }
  ],
  caption: "A GLM is one linear score η = θᵀx passed through a family-specific link to a mean; the family you choose must match how the target's variance behaves.",
  code: `// Same linear score eta; the family picks the link that maps eta -> mean.
const eta = [-4,-3,-2,-1,0,1,2,3,4];
const sigmoid = e => 1/(1+Math.exp(-e));   // Bernoulli link -> logistic regression
const poisson = e => Math.exp(e);          // Poisson link  -> count regression
const bernoulliMean = eta.map(e => [e, sigmoid(e)]);
const poissonMean   = eta.map(e => [e, poisson(e)]);
console.log("eta=2 -> Bernoulli", sigmoid(2).toFixed(3), " Poisson", poisson(2).toFixed(3));
// -> Bernoulli 0.881 (a probability)   Poisson 7.389 (a mean count)`
};

window.CODEVIZ["ml-svm"] = {
  question: "Many lines separate two classes — which one does the SVM pick, and how do you spot the support vectors?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: widest street, boundary down the middle, support vectors on the edges",
      xlabel: "feature x1",
      ylabel: "feature x2",
      groups: [
        { name: "class -1", color: "#4ea1ff", points: [[1,1.5],[1.6,0.9],[1.1,2.4],[2.2,1.2],[2.6,2.2]] },
        { name: "class +1", color: "#7ee787", points: [[5,5.2],[5.8,4.6],[4.6,5.8],[6,5],[4.4,4.4]] }
      ],
      lines: [
        { color: "#ffb454", dash: [], points: [[0,6],[7,-1]] },
        { color: "#9aa7b4", dash: [5,4], points: [[0,7],[7,0]] },
        { color: "#9aa7b4", dash: [5,4], points: [[0,5],[7,-2]] }
      ],
      interpret: "Axes are the two features. The solid orange line is the <b>decision boundary</b> (w·x = b); the two grey dashed lines are the <b>margins</b> (w·x = b ± 1). The SVM doesn't just separate the colours — it pushes the boundary so the empty <b>street between the dashed lines is as wide as possible</b>. The points that land right on a dashed edge are the <b>support vectors</b>; they alone fix the line, and you could delete every other point without moving it."
    },
    {
      type: "scatter",
      title: "Variant: overlapping classes — soft margin lets a few points cross (illustrative)",
      xlabel: "feature x1",
      ylabel: "feature x2",
      groups: [
        { name: "class -1", color: "#4ea1ff", points: [[1,1.5],[1.6,0.9],[2.2,1.2],[2.6,2.2],[3.4,3.1]] },
        { name: "class +1", color: "#7ee787", points: [[5,5.2],[5.8,4.6],[4.6,5.8],[6,5],[2.9,2.6]] }
      ],
      lines: [
        { color: "#ffb454", dash: [], points: [[0,6],[7,-1]] },
        { color: "#9aa7b4", dash: [5,4], points: [[0,7],[7,0]] },
        { color: "#9aa7b4", dash: [5,4], points: [[0,5],[7,-2]] }
      ],
      interpret: "Illustrative. Same axes and lines, but now the classes <b>overlap</b> — no straight line separates them cleanly. A real SVM uses the <b>hinge loss</b> with a budget C to permit a few violations: notice the blue point near (3.4,3.1) and the green point near (2.9,2.6) sitting <b>inside or across the street</b>. This is the normal, healthy case for messy data; a small C tolerates more crossings for a wider, smoother street, a large C fights to exclude them and risks overfitting."
    },
    {
      type: "line",
      title: "Variant: margin width is 2/‖w‖ — smaller weights mean a wider street",
      xlabel: "weight length  ‖w‖",
      ylabel: "margin width  2/‖w‖",
      series: [
        { name: "margin = 2/‖w‖", color: "#c89bff", points: [[0.5,4],[1,2],[1.5,1.333],[2,1],[3,0.667],[4,0.5]] }
      ],
      interpret: "This explains <b>why</b> the objective minimizes ‖w‖. The x-axis is the length of the weight vector; the y-axis is the resulting margin width, which equals exactly 2/‖w‖. The curve <b>falls steeply</b>: at ‖w‖ = 1 the street is 2 units wide, but forcing ‖w‖ = 2 shrinks it to 1. So 'minimize ½‖w‖²' is literally 'make the street as wide as possible' — the two are the same goal read from opposite ends."
    }
  ],
  caption: "An SVM picks the separating line that maximizes the margin (width 2/‖w‖); only the support vectors on the margin edges define it, and overlapping data is handled by a soft (hinge) margin.",
  code: `// The margin width is 2/||w||, so shrinking ||w|| widens the street.
const w = [1, 1];                                  // weight vector
const norm = Math.sqrt(w[0]*w[0] + w[1]*w[1]);     // ||w||
const marginWidth = 2 / norm;
console.log("||w|| =", norm.toFixed(3), " margin width =", marginWidth.toFixed(3));
// ||w|| = 1.414  margin width = 1.414
// Double the weights -> half the street:
const norm2 = Math.sqrt(4*w[0]*w[0] + 4*w[1]*w[1]);
console.log("2x weights -> margin", (2/norm2).toFixed(3));  // 0.707`
};

window.CODEVIZ["ml-kernels"] = {
  question: "How does lifting data with a feature map turn a tangled problem into a straight-line one, and how do you read a kernel's similarity and pick its width?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: lift x to z = x^2 makes the inner class separable by one straight line",
      xlabel: "input feature x",
      ylabel: "lifted feature z = x squared",
      groups: [
        {
          name: "inner class (|x| < 1.3)",
          color: "#7ee787",
          points: [[-0.8,0.64],[-0.4,0.16],[0,0],[0.4,0.16],[0.8,0.64],[1.2,1.44]]
        },
        {
          name: "outer class (|x| > 1.3)",
          color: "#4ea1ff",
          points: [[-2.8,7.84],[-2.4,5.76],[-2,4],[-1.6,2.56],[1.6,2.56],[2,4],[2.4,5.76],[2.8,7.84]]
        }
      ],
      lines: [
        { color: "#ffb454", dash: [6,4], points: [[-3,1.69],[3,1.69]] }
      ],
      interpret: "The x-axis is the raw feature; the y-axis is the new feature z = x squared we built from it. On the raw line alone (just the x-axis) the green inner class sits BETWEEN the blue outer class, so no single threshold splits them. After lifting, green points have low z (near 0) and blue points have high z, so the orange dashed line z = 1.69 cleanly separates them. Conclude: a curved boundary in the original space becomes a straight boundary in the lifted space -- that is exactly what a kernel buys you."
    },
    {
      type: "line",
      title: "Gaussian kernel: K = exp(-d^2 / (2*sigma^2)) as a function of distance d, sigma = 1",
      xlabel: "distance between points d = ||x - z||",
      ylabel: "kernel similarity K(x, z)",
      series: [
        {
          name: "K vs distance (sigma = 1)",
          color: "#7ee787",
          points: [[0,1],[0.25,0.9692],[0.5,0.8825],[0.75,0.7548],[1,0.6065],[1.25,0.4578],[1.5,0.3247],[1.75,0.2163],[2,0.1353],[2.25,0.0796],[2.5,0.0439],[2.75,0.0228],[3,0.0111],[3.5,0.0022],[4,0.0003]]
        }
      ],
      interpret: "The x-axis is how far apart two points are; the y-axis is the kernel's similarity score. Read the curve: it starts at exactly 1 when the points coincide (d = 0) and decays smoothly toward 0 as they separate -- at d = 2 it is already exp(-2) = 0.135. So the kernel is a smooth similarity bump: nearby points score high, distant points score near zero. Conclude: a kernel SVM labels a new point by a weighted vote of the training points it is similar to, and sigma sets how quickly that influence fades."
    },
    {
      type: "line",
      title: "VARIANT -- sigma too SMALL (illustrative): spiky kernel, each point only similar to itself -> overfit",
      xlabel: "distance between points d = ||x - z||",
      ylabel: "kernel similarity K(x, z)",
      series: [
        {
          name: "sigma = 0.3 (too narrow)",
          color: "#ff7b72",
          points: [[0,1],[0.1,0.9460],[0.2,0.8007],[0.3,0.6065],[0.4,0.4111],[0.5,0.2494],[0.6,0.1353],[0.7,0.0657],[0.8,0.0286],[0.9,0.0111],[1,0.0039],[1.2,0.0003],[1.5,0],[2,0]]
        }
      ],
      interpret: "Illustrative, same formula with a tiny sigma = 0.3. The similarity collapses to near 0 almost immediately -- by d = 1 it is essentially zero, so every point is similar only to itself. Read it: the model memorizes each training point as its own island, producing a wiggly boundary that hugs the noise. Conclude: too small a width (equivalently a large gamma) overfits -- great training accuracy, poor generalization. This is the classic high-variance failure of an RBF kernel."
    },
    {
      type: "line",
      title: "VARIANT -- sigma too LARGE (illustrative): flat kernel, everything looks similar -> underfit",
      xlabel: "distance between points d = ||x - z||",
      ylabel: "kernel similarity K(x, z)",
      series: [
        {
          name: "sigma = 4 (too wide)",
          color: "#ffb454",
          points: [[0,1],[0.5,0.9961],[1,0.9692],[1.5,0.9321],[2,0.8825],[2.5,0.8226],[3,0.7548],[3.5,0.6817],[4,0.6065],[5,0.4578],[6,0.3247],[7,0.2163],[8,0.1353]]
        }
      ],
      interpret: "Illustrative, with a large sigma = 4. The curve barely drops -- even points 4 units apart still score above 0.6. Read it: every example looks similar to every other, so the kernel smears all the structure into one blob and the boundary becomes almost flat. Conclude: too large a width (small gamma) underfits -- the model cannot bend enough to follow the classes. Sigma must be tuned by cross-validation between this blurry extreme and the spiky one above."
    },
    {
      type: "heatmap",
      title: "VARIANT -- Gram matrix K(x_i, x_j) for 6 points (Gaussian, sigma = 1): the n-by-n object an SVM stores",
      rows: ["x=-2.4", "x=-1.6", "x=-0.4", "x=0.4", "x=1.6", "x=2.4"],
      cols: ["x=-2.4", "x=-1.6", "x=-0.4", "x=0.4", "x=1.6", "x=2.4"],
      matrix: [
        [1, 0.726, 0.135, 0.020, 0, 0],
        [0.726, 1, 0.487, 0.135, 0.002, 0],
        [0.135, 0.487, 1, 0.726, 0.135, 0.020],
        [0.020, 0.135, 0.726, 1, 0.487, 0.135],
        [0, 0.002, 0.135, 0.487, 1, 0.726],
        [0, 0, 0.020, 0.135, 0.726, 1]
      ],
      showVals: true,
      interpret: "Each cell is the kernel between two training points -- row point versus column point. Read it: the diagonal is all 1s (every point is identical to itself), and values fade to 0 as you move off the diagonal to far-apart pairs. The bright band near the diagonal shows which points are neighbors. Conclude: this whole table (the Gram matrix) is what a kernel SVM actually works with -- it never builds the lifted features, only these pairwise similarities. Note its size is n-by-n, which is why kernels blow up in memory on large datasets."
    }
  ],
  caption: "Chart 1 lifts the 1-D inner/outer data to z = x squared, where one straight line z = 1.69 separates the classes that were tangled on the raw line. Chart 2 reads the Gaussian kernel as a similarity that falls from 1 to 0 with distance. The two variants show the width sigma mistuned -- too small spikes into overfitting, too large flattens into underfitting -- and the last is the Gram matrix of pairwise similarities the solver stores. Real numbers throughout; the mistuned-sigma curves are illustrative but use the exact kernel formula.",
  code: `import numpy as np

# Chart 1: 1-D data, inner class |x|<1.3 vs outer, lifted to z = x**2
xs = np.round(np.arange(-2.8, 2.81, 0.4), 2)
cls = (np.abs(xs) < 1.3).astype(int)   # 1 = inner (green), 0 = outer (blue)
z = xs**2                              # the feature map phi(x) = x**2
boundary = 1.69                        # a single line z=1.69 separates inner from outer
print("inner z:", z[cls==1], "max", z[cls==1].max())   # all below 1.69
print("outer z:", z[cls==0], "min", z[cls==0].min())   # all above 1.69

# Chart 2: Gaussian (RBF) kernel as a function of distance, sigma=1
def K(d, sigma):
    return np.exp(-(d**2) / (2*sigma**2))
d = np.linspace(0, 4, 17)
print("K(0)=", K(0,1), " K(2)=", K(2,1))   # 1.0  and  exp(-2)=0.135

# Chart 5: full Gram matrix for a handful of points
pts = np.array([-2.4,-1.6,-0.4,0.4,1.6,2.4])
G = K(np.abs(pts[:,None] - pts[None,:]), 1.0)
print(np.round(G, 3))   # 1s on the diagonal, fading off-diagonal`
};

window.CODEVIZ["ml-gda"] = {
  question: "How does modeling each class as a bell-shaped cloud give you a decision boundary, and what does that boundary look like for shared vs per-class spread, overlap, and non-Gaussian data?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: two Gaussian blobs, shared covariance -> a LINEAR boundary (LDA)",
      xlabel: "feature x1",
      ylabel: "feature x2",
      groups: [
        {
          name: "class 0 (mean 2.28, 2.38)",
          color: "#4ea1ff",
          points: [[2,2.5],[2.6,1.8],[1.6,2.2],[2.2,3.0],[3.0,2.4]]
        },
        {
          name: "class 1 (mean 6.28, 6.38)",
          color: "#ff7b72",
          points: [[6,6.5],[6.6,5.8],[5.6,6.2],[6.2,7.0],[7.0,6.4]]
        }
      ],
      lines: [
        { color: "#7ee787", dash: [], points: [[2.28,2.38],[6.28,6.38]] },
        { color: "#ffb454", dash: [6,4], points: [[2.83,8.33],[8.33,2.83]] }
      ],
      interpret: "Each axis is one feature; each colored cloud is one class's data, modeled as a Gaussian bell. The green line joins the two class means (2.28,2.38) and (6.28,6.38); the orange dashed line is the decision boundary -- it is the perpendicular bisector of that join. Read it: a new point is labeled by whichever mean's bell explains it better, and because the two classes share the same covariance shape, that boundary comes out perfectly STRAIGHT. Conclude: shared-covariance GDA is Linear Discriminant Analysis (LDA), giving one flat dividing line."
    },
    {
      type: "bars",
      title: "Classify a 135 cm person: class-conditional density at x=135 (adult mu=170, child mu=130, sigma=20)",
      labels: ["p(x | child)", "p(x | adult)", "posterior p(child | x)"],
      values: [0.969, 0.216, 0.818],
      valueLabels: ["0.969", "0.216", "0.82"],
      colors: ["#7ee787", "#4ea1ff", "#c89bff"],
      interpret: "The first two bars are how well each class's bell curve explains a 135 cm height -- the child bell (mean 130) scores 0.969, the adult bell (mean 170) only 0.216. The third bar applies Bayes' rule with equal priors: 0.969 / (0.969 + 0.216) = 0.82. Read it: the nearer mean wins, and Bayes turns the two raw densities into an actual probability. Conclude: GDA predicts CHILD with 82 percent confidence -- the densities rank the classes, Bayes normalizes them into a probability you can act on."
    },
    {
      type: "scatter",
      title: "VARIANT -- per-class covariance (QDA, illustrative): clouds differ in shape -> CURVED boundary",
      xlabel: "feature x1",
      ylabel: "feature x2",
      groups: [
        {
          name: "class 0 (tight, round)",
          color: "#4ea1ff",
          points: [[2,2.2],[2.4,2.6],[1.7,2.4],[2.2,1.8],[2.6,2.1],[1.9,1.9]]
        },
        {
          name: "class 1 (wide, stretched)",
          color: "#ff7b72",
          points: [[5,5.5],[6.5,4.2],[7.5,6.8],[4.2,6.5],[8,5],[5.5,7.5],[6.8,3.8]]
        }
      ],
      lines: [
        { color: "#ffb454", dash: [6,4], points: [[1.0,7.5],[2.2,5.2],[3.4,3.6],[4.6,2.6],[5.8,2.1]] }
      ],
      interpret: "Illustrative. Here the two classes have DIFFERENT covariances -- class 0 is a tight round cloud, class 1 is a wide stretched one. Because the spreads no longer match, the boundary (orange dashed) bends into a CURVE that wraps around the tight class. Read it: this is Quadratic Discriminant Analysis (QDA); fitting a separate Sigma per class buys a curved boundary. Conclude: QDA is more flexible than LDA but needs more data per class to estimate each covariance, or it overfits."
    },
    {
      type: "scatter",
      title: "VARIANT -- overlapping blobs (illustrative): means close, spreads wide -> uncertain boundary",
      xlabel: "feature x1",
      ylabel: "feature x2",
      groups: [
        {
          name: "class 0",
          color: "#4ea1ff",
          points: [[3,4],[3.8,5.2],[4.5,3.5],[2.5,4.8],[4,4.5],[5,5],[3.5,3.2],[4.8,4.2]]
        },
        {
          name: "class 1",
          color: "#ff7b72",
          points: [[5,5],[4.2,4.2],[5.5,6],[4,5.5],[6,4.8],[3.5,5],[5.2,4],[4.5,6]]
        }
      ],
      lines: [
        { color: "#ffb454", dash: [6,4], points: [[2,6.8],[7,3.2]] }
      ],
      interpret: "Illustrative. The two class means are close and the bells are wide, so the clouds OVERLAP heavily in the middle. The boundary still exists, but many points fall on the wrong side of it. Read it: in the overlap zone the two densities are nearly equal, so the posterior p(y | x) sits near 0.5 -- the model is honestly unsure. Conclude: GDA does not fail loudly here, it just returns low-confidence predictions; expect modest accuracy and treat near-0.5 posteriors as 'don't know' rather than forcing a label."
    },
    {
      type: "scatter",
      title: "VARIANT -- non-Gaussian class (illustrative): a banana/skewed cloud breaks the bell assumption",
      xlabel: "feature x1",
      ylabel: "feature x2",
      groups: [
        {
          name: "class 1 (curved, non-Gaussian)",
          color: "#ff7b72",
          points: [[1,5],[2,3.2],[3,2.1],[4,1.6],[5,1.6],[6,2.1],[7,3.2],[8,5],[4.5,1.55],[3.5,1.75]]
        },
        {
          name: "class 0 (compact)",
          color: "#4ea1ff",
          points: [[4,4.5],[4.5,5],[3.5,4.8],[4.2,4.2],[4.8,4.6],[4,5]]
        }
      ],
      lines: [
        { color: "#9aa7b4", dash: [3,3], points: [[4.5,5.5],[4.5,1.4]] }
      ],
      interpret: "Illustrative. Class 1 forms a curved banana shape -- it is NOT a bell cloud, so a single Gaussian fits it badly: GDA's estimated mean lands in the empty center of the curve and its single ellipse cannot follow the bend. Read it: the grey line marks where GDA's bell would wrongly place its center, right where there are no class-1 points. Conclude: when a class is skewed, multimodal, or curved, the Gaussian assumption is violated -- transform the features or switch to a more flexible model (logistic regression, trees, kernel methods)."
    }
  ],
  caption: "Chart 1 is the ideal GDA picture: two Gaussian blobs sharing one covariance give a straight (LDA) boundary -- the perpendicular bisector of the class means, computed from the demo's points. Chart 2 works the height example with real numbers, showing how class-conditional densities plus Bayes yield an 82 percent posterior. The three variants are illustrative but honest: per-class covariance bends the boundary (QDA), overlap drives posteriors toward 0.5, and a non-Gaussian cloud breaks the bell assumption entirely.",
  code: `import numpy as np

# Chart 1: two classes, shared covariance -> linear (LDA) boundary
c0 = np.array([[2,2.5],[2.6,1.8],[1.6,2.2],[2.2,3.0],[3.0,2.4]])
c1 = np.array([[6,6.5],[6.6,5.8],[5.6,6.2],[6.2,7.0],[7.0,6.4]])
mu0, mu1 = c0.mean(0), c1.mean(0)
print("mu0", np.round(mu0,2), "mu1", np.round(mu1,2))  # (2.28,2.38) (6.28,6.38)
mid = (mu0 + mu1) / 2                 # boundary passes through the midpoint
# boundary is perpendicular to (mu1-mu0): all x with (mu1-mu0) . (x-mid) = 0

# Chart 2: classify a 135 cm person, equal priors, sigma=20
def gauss(x, mu, sg):
    return np.exp(-((x-mu)**2) / (2*sg**2))   # density up to a constant
px_child = gauss(135, 130, 20)        # ~0.969
px_adult = gauss(135, 170, 20)        # ~0.216
post_child = px_child / (px_child + px_adult)   # Bayes, equal priors -> 0.82
print(round(px_child,3), round(px_adult,3), round(post_child,2))`
};

window.CODEVIZ["ml-naive-bayes"] = {
  question: "How do per-word likelihoods and the prior combine into a class decision — and how do you spot when the math breaks?",
  charts: [
    {
      type: "bars",
      title: "Healthy posterior: two spam words multiply into near-certainty",
      labels: ["P(spam | words)", "P(ham | words)"],
      values: [0.982, 0.018],
      valueLabels: ["0.982", "0.018"],
      colors: ["#ff7b72", "#7ee787"],
      interpret: "<b>How to read it:</b> each bar is the final class probability after multiplying the word likelihoods and folding in the prior, then normalising so the two bars sum to 1. Real numbers from the lesson: spam score = prior 0.4 x 0.8 x 0.5 = 0.16, ham score = 0.6 x 0.1 x 0.05 = 0.003, normalised gives 0.982 vs 0.018. <b>Conclude:</b> two independent 'spammy' words each weak on their own multiplied into a confident spam call. A tall single bar like this is the canonical healthy decision."
    },
    {
      type: "bars",
      title: "Zero-frequency trap: one unseen word zeroes the whole product",
      labels: ["spam score", "ham score"],
      values: [0.0, 0.003],
      valueLabels: ["0.000", "0.003"],
      colors: ["#ff7b72", "#7ee787"],
      interpret: "<b>How to read it (illustrative):</b> same setup, but now one word was never seen in spam during training, so P(word | spam) = 0. Multiplying by 0 collapses the entire spam score to exactly 0 no matter how spammy the other words were. <b>Recognise it:</b> a bar that snaps to a hard zero (not just small) whenever a single new word appears. <b>Fix:</b> Laplace add-one smoothing so no probability is ever exactly 0; this is the most common naive-Bayes bug."
    },
    {
      type: "scatter",
      title: "Miscalibration: confident outputs that are not true probabilities",
      xlabel: "predicted P(spam)",
      ylabel: "actual fraction that are spam",
      groups: [
        { name: "naive Bayes bins", color: "#ffb454", points: [[0.05, 0.18], [0.2, 0.34], [0.5, 0.5], [0.8, 0.68], [0.95, 0.82]] }
      ],
      lines: [
        { color: "#7ee787", dash: [5, 4], points: [[0, 0], [1, 1]] }
      ],
      interpret: "<b>How to read it (illustrative):</b> a calibration plot. The x-axis is the probability the model claims; the y-axis is how often those cases are actually spam. The green dashed diagonal is perfect calibration. <b>Recognise it:</b> the orange points form an S that is flatter than the diagonal — when the model says 0.95 only ~0.82 are really spam, and when it says 0.05 the truth is ~0.18. <b>Conclude:</b> naive Bayes outputs are pushed toward 0 and 1 by the independence assumption, so treat them as scores, not trustworthy probabilities, unless you calibrate."
    }
  ],
  caption: "Naive Bayes multiplies per-feature likelihoods and the prior, then normalises. Watch for zero-frequency collapse and over-confident, mis-calibrated outputs.",
  code: [
    "// Naive Bayes: prior x product of per-word likelihoods, then normalise",
    "const prior = 0.4;                 // P(spam)",
    "const wordsSpam = [0.8, 0.5];      // P(word_i | spam)",
    "const wordsHam  = [0.1, 0.05];     // P(word_i | not spam)",
    "const mul = a => a.reduce((p, v) => p * v, 1);",
    "let spam = prior * mul(wordsSpam);        // 0.16",
    "let ham  = (1 - prior) * mul(wordsHam);   // 0.003",
    "const pSpam = spam / (spam + ham);        // ~0.982",
    "console.log(pSpam.toFixed(3));"
  ].join("\n")
};

window.CODEVIZ["ml-trees"] = {
  question: "As a decision tree grows deeper, when does it stop learning the real boundary and start memorising noise?",
  charts: [
    {
      type: "line",
      title: "Depth vs accuracy: train keeps rising, validation peaks then falls",
      xlabel: "tree depth",
      ylabel: "accuracy",
      series: [
        { name: "train accuracy", color: "#4ea1ff", points: [[1, 0.74], [2, 0.83], [3, 0.9], [4, 0.94], [5, 0.97], [6, 0.99], [7, 1.0], [8, 1.0]] },
        { name: "validation accuracy", color: "#7ee787", points: [[1, 0.72], [2, 0.81], [3, 0.87], [4, 0.86], [5, 0.82], [6, 0.78], [7, 0.75], [8, 0.74]] }
      ],
      interpret: "<b>How to read it:</b> x-axis is how many yes/no questions deep the tree may go; y-axis is accuracy. Blue is the data the tree trained on, green is held-out data. <b>Recognise the shape:</b> blue climbs all the way to 100% (a deep tree can memorise every point), but green rises, peaks around depth 3, then drops. <b>Conclude:</b> the best depth is where validation peaks (~3 here); the widening gap past it is the tell-tale sign of overfitting. Numbers are illustrative but match the lesson's depth-1 underfit / depth-6+ overfit behaviour."
    },
    {
      type: "bars",
      title: "Why a split is chosen: Gini impurity drops after a good split",
      labels: ["parent (mixed)", "left child", "right child"],
      values: [0.5, 0.32, 0.32],
      valueLabels: ["0.50", "0.32", "0.32"],
      colors: ["#ffb454", "#7ee787", "#7ee787"],
      interpret: "<b>How to read it:</b> each bar is Gini impurity, 0 = perfectly pure (all one class), 0.5 = a 50/50 mix. From the lesson: a 5-buy/5-no parent has Gini 1 - (0.5^2 + 0.5^2) = 0.50; splitting on 'age > 30' yields two children each at 0.32. <b>Conclude:</b> the tree picks the split that lowers the weighted child impurity the most. Falling bars (orange parent to green children) mean a useful, class-separating question; bars that do not drop mean the split was worthless."
    },
    {
      type: "scatter",
      title: "Underfit boundary (depth 1): one straight cut misses the curve",
      xlabel: "feature x",
      ylabel: "feature y",
      groups: [
        { name: "class 0", color: "#4ea1ff", points: [[0.1, 0.2], [0.3, 0.15], [0.5, 0.25], [0.7, 0.6], [0.85, 0.75], [0.2, 0.35]] },
        { name: "class 1", color: "#7ee787", points: [[0.15, 0.7], [0.35, 0.8], [0.55, 0.85], [0.75, 0.4], [0.9, 0.3], [0.45, 0.78]] }
      ],
      lines: [
        { color: "#ff7b72", dash: [], points: [[0, 0.55], [1, 0.55]] }
      ],
      interpret: "<b>How to read it (illustrative):</b> the true class boundary is a wave, but a depth-1 tree can draw only ONE axis-aligned cut (red line). Several green points sit below it and blue points above it on the misclassified side. <b>Recognise it:</b> a single flat step that obviously ignores the data's curvature, with low accuracy on BOTH train and validation. <b>Conclude:</b> too simple, it underfits; increase depth to let the staircase track the real boundary."
    },
    {
      type: "scatter",
      title: "Overfit boundary (depth 8): tiny boxes wrap individual noisy points",
      xlabel: "feature x",
      ylabel: "feature y",
      groups: [
        { name: "class 0", color: "#4ea1ff", points: [[0.1, 0.2], [0.3, 0.15], [0.5, 0.25], [0.55, 0.82], [0.85, 0.75]] },
        { name: "class 1 (one noisy)", color: "#7ee787", points: [[0.15, 0.7], [0.35, 0.8], [0.75, 0.4], [0.9, 0.3], [0.52, 0.27]] }
      ],
      lines: [
        { color: "#ff7b72", dash: [4, 3], points: [[0.48, 0.18], [0.48, 0.35], [0.6, 0.35], [0.6, 0.18], [0.48, 0.18]] }
      ],
      interpret: "<b>How to read it (illustrative):</b> a deep tree keeps splitting until it isolates even a single mislabeled point. The red dashed rectangle is a leaf carved out just to capture one noisy green point sitting in a blue region. <b>Recognise it:</b> many tiny, jagged rectangles each containing one or two points, near-100% train accuracy but worse validation accuracy. <b>Conclude:</b> the tree memorised noise; prune it (limit max_depth, raise min_samples_leaf) or move to an ensemble."
    }
  ],
  caption: "Trees split to lower Gini impurity. Validation accuracy peaks at a moderate depth; too shallow underfits, too deep memorises noise.",
  code: [
    "// Gini impurity of a group, and the drop a split produces",
    "const gini = grp => {",
    "  const n = grp.length, n1 = grp.filter(c => c === 1).length;",
    "  const p = n1 / n;",
    "  return 1 - (p * p + (1 - p) * (1 - p));",
    "};",
    "const parent = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0];   // 5 buy / 5 no -> 0.50",
    "const left = [1, 1, 1, 1, 0];                     // age > 30  -> 0.32",
    "const right = [1, 0, 0, 0, 0];                    // age <= 30 -> 0.32",
    "const weighted = (left.length * gini(left) + right.length * gini(right)) / parent.length;",
    "console.log('drop:', (gini(parent) - weighted).toFixed(3));  // positive = good split"
  ].join("\n")
};

window.CODEVIZ["ml-ensembles"] = {
  question: "How does combining many weak trees beat one strong tree?",
  charts: [
    {
      type: "line",
      title: "Bagging: ensemble variance drops as 1/T",
      xlabel: "number of trees T",
      ylabel: "prediction variance",
      series: [
        { name: "single tree", color: "#9aa7b4", points: [[1,2],[5,2],[10,2],[20,2],[30,2],[40,2],[50,2]] },
        { name: "forest (sigma^2 / T)", color: "#7ee787", points: [[1,2],[2,1],[5,0.4],[10,0.2],[20,0.1],[30,0.067],[40,0.05],[50,0.04]] }
      ],
      interpret: "<b>How to read it:</b> x is the number of trees averaged, y is how much the prediction wobbles (variance). Real numbers here use single-tree variance 2, so the forest curve is exactly 2/T. The grey line is flat because one tree never gets steadier; the green curve plunges then flattens. <b>Conclude:</b> averaging independent trees cuts variance fast at first, with diminishing returns past ~20 trees."
    },
    {
      type: "line",
      title: "Correlated trees: variance plateaus above zero",
      xlabel: "number of trees T",
      ylabel: "prediction variance",
      series: [
        { name: "independent (ideal)", color: "#7ee787", points: [[1,2],[5,0.4],[10,0.2],[20,0.1],[50,0.04]] },
        { name: "correlated trees", color: "#ff7b72", points: [[1,2],[5,1.3],[10,1.15],[20,1.07],[50,1.02]] }
      ],
      interpret: "<b>Illustrative shapes.</b> Same axes as before. The green curve assumes trees disagree, so variance keeps falling. The red curve is what you get when trees are nearly identical (e.g. you forgot to sample features/rows): it flattens out at a high floor instead of approaching zero. <b>Recognise it:</b> adding trees stops helping early. The fix is more randomness so trees decorrelate."
    },
    {
      type: "line",
      title: "Boosting without a brake: test error turns back up",
      xlabel: "boosting rounds T",
      ylabel: "error",
      series: [
        { name: "train error", color: "#4ea1ff", points: [[0,0.5],[20,0.25],[50,0.12],[100,0.05],[150,0.02],[200,0.005]] },
        { name: "test error", color: "#ffb454", points: [[0,0.5],[20,0.28],[50,0.18],[80,0.15],[120,0.17],[200,0.24]] }
      ],
      interpret: "<b>Illustrative shapes.</b> x is boosting rounds (trees added in sequence), y is error. Boosting keeps fitting, so blue train error marches toward zero. But orange test error bottoms out around round 80, then climbs as the model memorises noise. <b>Conclude:</b> unlike bagging, boosting can overfit; stop at the test-error minimum (early stopping) and use a small learning rate."
    }
  ],
  caption: "Bagging averages independent trees to cut variance; boosting adds trees in sequence and must be reined in.",
  code: "// Bagging variance reduction: averaging T independent trees\nconst sigma2 = 2;            // variance of a single tree's prediction\nconst Ts = [1, 5, 10, 20, 50];\nfor (const T of Ts) {\n  const ensembleVar = sigma2 / T;   // variance of the averaged forest\n  console.log('T=' + T + '  forest variance = ' + ensembleVar.toFixed(3));\n}\n// T=1 -> 2.000, T=10 -> 0.200, T=50 -> 0.040\n// More (decorrelated) trees => steadier forest."
};

window.CODEVIZ["ml-knn"] = {
  question: "How do you read a k-NN plot, and how does k change the answer?",
  charts: [
    {
      type: "scatter",
      title: "k-NN vote: the query takes its neighbors' majority class",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "class 0 (blue)", color: "#4ea1ff", points: [[2,2],[3,2.5],[2.5,3.5],[3.5,3],[1.5,3],[4.5,4]] },
        { name: "class 1 (green)", color: "#7ee787", points: [[7,7],[6,6.5],[7.5,6],[6.5,7.5],[8,7],[5,5]] },
        { name: "query (?)", color: "#c89bff", points: [[5,4.5]] }
      ],
      interpret: "<b>How to read it:</b> each axis is a feature; colour is the known class; the purple point is the new query we must label. With k=3 the three closest stored points to (5, 4.5) are (4.5, 4) class 0, (5, 5) class 1 and (3.5, 3) class 0. <b>Conclude:</b> 2 votes class 0 vs 1 vote class 1, so k-NN predicts class 0. The prediction depends entirely on which points sit nearest."
    },
    {
      type: "line",
      title: "Choosing k: the U-shaped error curve",
      xlabel: "k (number of neighbors)",
      ylabel: "validation error",
      series: [
        { name: "validation error", color: "#7ee787", points: [[1,0.22],[3,0.14],[5,0.11],[7,0.10],[9,0.12],[15,0.16],[25,0.23],[50,0.34]] }
      ],
      interpret: "<b>Illustrative shape.</b> x is how many neighbors vote, y is error on held-out data. Tiny k (left) overfits noise so error is high; huge k (right) averages over far-away, irrelevant points and underfits, so error climbs again. <b>Conclude:</b> pick k at the bottom of the U (here around k=7) by cross-validation, not the extremes."
    },
    {
      type: "scatter",
      title: "Unscaled features: distance is hijacked by the big-range axis",
      xlabel: "weight in grams (range ~1000)",
      ylabel: "height in meters (range ~2)",
      groups: [
        { name: "class A", color: "#4ea1ff", points: [[100,1.6],[120,1.9],[140,1.5],[160,1.8]] },
        { name: "class B", color: "#ffb454", points: [[800,1.6],[820,1.9],[840,1.5],[860,1.8]] },
        { name: "query (?)", color: "#c89bff", points: [[150,1.75]] }
      ],
      interpret: "<b>Illustrative.</b> x (grams) spans hundreds while y (meters) spans ~2. Euclidean distance is then almost entirely the gram difference; the height axis is invisible to k-NN. <b>Recognise it:</b> one axis has a vastly larger range than the other. The query is correctly nearest the blue class only because grams dominate by luck. <b>Fix:</b> standardize every feature so each contributes fairly to distance."
    }
  ],
  caption: "k-NN labels a query by its nearest stored points; k controls smoothness and unscaled features distort 'nearest'.",
  code: "// k-NN vote for a query point\nconst data = [\n  {x:2,y:2,c:0},{x:4.5,y:4,c:0},{x:3.5,y:3,c:0},\n  {x:7,y:7,c:1},{x:5,y:5,c:1},{x:6,y:6.5,c:1}\n];\nconst q = {x:5, y:4.5}, k = 3;\nconst dist = p => Math.hypot(p.x - q.x, p.y - q.y);\nconst nearest = [...data].sort((a,b) => dist(a) - dist(b)).slice(0, k);\nlet v0 = 0, v1 = 0;\nfor (const p of nearest) (p.c === 0 ? v0++ : v1++);\nconsole.log('votes: class0=' + v0 + ' class1=' + v1 + ' -> predict ' + (v1 > v0 ? 1 : 0));"
};

window.CODEVIZ["ml-bias-variance"] = {
  question: "As a model gets more complex, why does test error fall then rise?",
  charts: [
    {
      type: "line",
      title: "The U-curve: bias falls, variance rises, total dips in the middle",
      xlabel: "model complexity (polynomial degree)",
      ylabel: "error",
      series: [
        { name: "bias squared", color: "#4ea1ff", points: [[1,0.90],[2,0.57],[3,0.41],[4,0.28],[5,0.21],[6,0.18],[7,0.16],[8,0.15],[9,0.14]] },
        { name: "variance", color: "#7ee787", points: [[1,0.07],[2,0.14],[3,0.25],[4,0.40],[5,0.60],[6,0.85],[7,1.13],[8,1.45],[9,1.83]] },
        { name: "total error", color: "#ffb454", points: [[1,0.97],[2,0.71],[3,0.66],[4,0.68],[5,0.81],[6,1.03],[7,1.29],[8,1.60],[9,1.97]] }
      ],
      interpret: "<b>x-axis</b> = how flexible the model is (here, polynomial degree); <b>y-axis</b> = error. The blue <b>bias squared</b> line keeps falling: more flexible models can bend to the true pattern. The green <b>variance</b> line keeps rising: flexible models also chase noise. Their sum, the orange <b>total error</b>, makes a <b>U</b> — it dips to a minimum (here near degree 2-3) then climbs. <b>Conclusion:</b> pick the complexity at the bottom of the U; left of it you underfit, right of it you overfit."
    },
    {
      type: "scatter",
      title: "Underfit (high bias): a straight line cannot bend to the data",
      xlabel: "x",
      ylabel: "y",
      groups: [ { name: "data", color: "#4ea1ff", points: [[0,0.6],[0.6,1.4],[1.2,1.5],[1.8,1.3],[2.4,0.7],[3.0,0.0],[3.6,-0.3],[4.2,0.1],[4.8,0.9],[5.4,1.4]] } ],
      lines: [
        { color: "#9aa7b4", dash: [4,4], points: [[0,1.4],[1.2,1.5],[2.4,0.7],[3.6,-0.3],[4.8,0.9],[5.4,1.4]] },
        { color: "#ff7b72", dash: [], points: [[0,0.9],[5.4,0.6]] }
      ],
      interpret: "Illustrative. Blue dots are the data, the grey dashed line is the true wavy pattern, the red line is a degree-1 fit. The red line is nearly flat and <b>misses every bend</b> — it is too simple to follow the curve. This is <b>high bias / underfitting</b>: error is large even on the training data. <b>Recognise it</b> when the fit looks too straight or too smooth for the data, and both training and test error are high. <b>Fix:</b> add capacity (higher degree, more features, less regularization)."
    },
    {
      type: "scatter",
      title: "Overfit (high variance): a wiggly curve chases every noisy point",
      xlabel: "x",
      ylabel: "y",
      groups: [ { name: "data", color: "#4ea1ff", points: [[0,0.6],[0.6,1.4],[1.2,1.5],[1.8,1.3],[2.4,0.7],[3.0,0.0],[3.6,-0.3],[4.2,0.1],[4.8,0.9],[5.4,1.4]] } ],
      lines: [
        { color: "#9aa7b4", dash: [4,4], points: [[0,1.4],[1.2,1.5],[2.4,0.7],[3.6,-0.3],[4.8,0.9],[5.4,1.4]] },
        { color: "#ff7b72", dash: [], points: [[0,0.6],[0.3,1.3],[0.6,1.4],[0.9,1.0],[1.2,1.5],[1.5,1.7],[1.8,1.3],[2.1,0.9],[2.4,0.7],[2.7,0.2],[3.0,0.0],[3.3,-0.4],[3.6,-0.3],[3.9,0.0],[4.2,0.1],[4.5,0.5],[4.8,0.9],[5.1,1.3],[5.4,1.4]] }
      ],
      interpret: "Illustrative. Same data and true pattern (grey dashed). Now the red curve is a high-degree fit that <b>passes through almost every dot</b>, wiggling sharply between them. It memorised the noise instead of the smooth pattern. This is <b>high variance / overfitting</b>: training error is tiny but the curve would swing wildly on a fresh sample. <b>Recognise it</b> when the fit is jagged and training error is far below test error. <b>Fix:</b> reduce capacity, add regularization, or collect more data."
    },
    {
      type: "line",
      title: "What you actually plot: training vs test error reveal the regime",
      xlabel: "model complexity (polynomial degree)",
      ylabel: "error",
      series: [
        { name: "training error", color: "#7ee787", points: [[1,0.88],[2,0.55],[3,0.38],[4,0.22],[5,0.12],[6,0.06],[7,0.03],[8,0.015],[9,0.01]] },
        { name: "test error", color: "#ff7b72", points: [[1,0.97],[2,0.71],[3,0.66],[4,0.68],[5,0.81],[6,1.03],[7,1.29],[8,1.60],[9,1.97]] }
      ],
      interpret: "Illustrative but realistic. Green is error on the data the model trained on; red is error on held-out test data. Green <b>always falls</b> as complexity grows (a flexible model can memorise its own data), so it never warns you. Red traces the U from the first chart. <b>The gap between the two curves is the tell:</b> a small gap with high error = underfit (left); a tiny green and a rising red = overfit (right). <b>Conclusion:</b> never judge complexity by training error alone — pick the degree where the red test curve bottoms out."
    }
  ],
  caption: "Each chart self-explains below it.",
  code: "// Bias-variance: total test error = bias^2 + variance (+ fixed noise)\n// Sweep model complexity and watch the U-curve form.\nconst bias2    = d => 1.3 / (d + 0.7);      // falls as model gets flexible\nconst variance = d => 0.05 + 0.022*d*d;     // rises as model gets flexible\nfor (let degree = 1; degree <= 9; degree++) {\n  const b = bias2(degree), v = variance(degree), total = b + v;\n  console.log('degree', degree, 'bias2', b.toFixed(3), 'var', v.toFixed(3), 'total', total.toFixed(3));\n}\n// total dips to a minimum in the middle, then climbs: the bias-variance U."
};

window.CODEVIZ["ml-learning-theory"] = {
  question: "How fast does the gap between training and true error shrink as you add data?",
  charts: [
    {
      type: "line",
      title: "Generalization gap decays like 1 over the square root of m",
      xlabel: "sample size m (number of training examples)",
      ylabel: "gap (true error minus training error)",
      series: [
        { name: "gap = 1/sqrt(m)", color: "#4ea1ff", points: [[1,1.000],[4,0.500],[9,0.333],[16,0.250],[25,0.200],[49,0.143],[100,0.100],[200,0.071],[300,0.058],[400,0.050],[500,0.045]] }
      ],
      interpret: "<b>x-axis</b> = how many training examples you have; <b>y-axis</b> = the generalization gap, i.e. how much worse the model does on new data than on its training data. The curve falls steeply at first (going from 25 to 100 examples roughly halves the gap) then <b>flattens</b>. <b>Conclusion:</b> more data always helps close the gap, but with diminishing returns — because the gap shrinks like 1/sqrt(m), getting it 10x smaller needs about 100x the data."
    },
    {
      type: "line",
      title: "Training vs true error converge as m grows",
      xlabel: "sample size m",
      ylabel: "error rate",
      series: [
        { name: "training error", color: "#7ee787", points: [[5,0.04],[10,0.07],[25,0.10],[50,0.12],[100,0.13],[200,0.135],[400,0.14],[500,0.14]] },
        { name: "true error", color: "#ff7b72", points: [[5,0.55],[10,0.40],[25,0.27],[50,0.21],[100,0.18],[200,0.16],[400,0.15],[500,0.145]] }
      ],
      interpret: "Illustrative. Green is error on the training set, red is the true error on unseen data. With <b>few examples</b> the model nearly memorises them (low green) yet fails on new data (high red) — a big gap. As m grows the two curves <b>squeeze together</b>: green drifts up a little, red drops a lot, both approaching the same floor. <b>Recognise this</b> as the healthy picture learning theory promises: enough data makes training error a trustworthy estimate of true error."
    },
    {
      type: "line",
      title: "More flexible models (higher VC dimension) need more data",
      xlabel: "sample size m",
      ylabel: "gap (true error minus training error)",
      series: [
        { name: "simple model (low VC)", color: "#7ee787", points: [[10,0.32],[25,0.20],[50,0.14],[100,0.10],[200,0.071],[400,0.050],[500,0.045]] },
        { name: "flexible model (high VC)", color: "#ff7b72", points: [[10,0.80],[25,0.55],[50,0.42],[100,0.32],[200,0.24],[400,0.18],[500,0.16]] }
      ],
      interpret: "Illustrative. Both curves decay with more data, but the red <b>flexible</b> model (high VC, or Vapnik-Chervonenkis, dimension = more ways to fit) sits well above the green <b>simple</b> one at every sample size. A richer model class has more ways to fool itself on small data, so it needs <b>far more examples</b> to reach the same small gap. <b>Conclusion:</b> this is the formal backing for 'prefer the simplest model that fits' — complexity is something you pay for in data."
    },
    {
      type: "line",
      title: "Warning: data closes the gap but never fixes bias",
      xlabel: "sample size m",
      ylabel: "error rate",
      series: [
        { name: "training error (too-simple model)", color: "#7ee787", points: [[5,0.28],[25,0.34],[100,0.37],[300,0.38],[500,0.39]] },
        { name: "true error (too-simple model)", color: "#ff7b72", points: [[5,0.52],[25,0.44],[100,0.40],[300,0.39],[500,0.39]] }
      ],
      interpret: "Illustrative failure mode. Here the gap <b>does</b> close — green and red meet — exactly as theory predicts. But they meet at a <b>high error floor</b> (about 0.39), not zero. The model is too simple (high bias), so even infinite data only makes training error a good estimate of a <b>bad</b> true error. <b>Recognise this</b> when both curves flatten high and together: adding data has stopped helping. <b>Fix:</b> this is a bias problem, not a data problem — use a richer model class."
    }
  ],
  caption: "Each chart self-explains below it.",
  code: "// Learning theory: the generalization gap shrinks like 1/sqrt(m).\n// gap = true error - training error.\nfor (const m of [1, 4, 25, 100, 400]) {\n  const gap = 1 / Math.sqrt(m);\n  console.log('m =', m, ' gap approx', gap.toFixed(4));\n}\n// Steep at first, then flat: 10x less gap costs about 100x the data."
};

window.CODEVIZ["ml-kmeans"] = {
  question: "The wine dataset has 178 wines from 3 cultivars. Can k-means rediscover the groups from the chemistry alone, and how do you READ the result?",
  charts: [
    {
      type: "scatter",
      title: "Healthy: k=3 finds the three real cultivars (wine chemistry, PCA view)",
      xlabel: "PCA component 1",
      ylabel: "PCA component 2",
      groups: [
        { name: "cluster 1", color: "#4ea1ff", points: [[-2.85,-2.89],[-1.87,-0.90],[-3.19,-1.85],[-3.45,-1.43],[-2.80,-1.67],[-2.79,-1.08],[-4.04,-1.36],[-2.79,-2.53],[-3.14,-1.88],[-3.31,-1.44],[-3.45,1.31],[-2.56,-2.49],[-2.62,2.50],[-1.93,-1.14],[-2.00,-0.29]] },
        { name: "cluster 2", color: "#7ee787", points: [[0.46,0.39],[1.72,-1.52],[-0.93,-2.11],[0.66,0.44],[0.76,-1.61],[2.40,4.84],[1.79,-0.27],[0.61,0.16],[0.62,0.64],[-0.37,0.11],[0.39,1.08],[-0.54,-1.32],[1.43,-1.97],[1.35,-1.28],[-0.78,-2.12]] },
        { name: "cluster 3", color: "#c89bff", points: [[3.11,1.57],[4.42,1.42],[6.44,-3.58],[7.68,-3.08],[4.68,-0.97],[4.76,3.01],[4.81,-3.03],[4.15,0.77],[2.71,-4.44],[5.49,-4.17],[6.06,-0.76],[2.24,-2.69],[3.52,-3.86],[4.21,1.18],[6.23,-1.39]] }
      ],
      lines: [],
      interpret: "<b>Each axis is a PCA (Principal Component Analysis) combination of the 13 chemical measurements</b> — they squeeze the data down to a 2-D picture you can plot. Every dot is one wine; its <b>colour is the cluster k-means assigned it to</b>, found from chemistry alone with no labels. Three tight, well-separated blobs means the algorithm cleanly recovered the three real cultivars. Read it as: tight, far-apart colours = a good clustering you can trust."
    },
    {
      type: "line",
      title: "Healthy: elbow bends sharply at k=3 (pick this k)",
      xlabel: "k (number of clusters)",
      ylabel: "inertia (total squared distance to centroid)",
      series: [
        { name: "inertia", color: "#7ee787", points: [[1,820],[2,430],[3,250],[4,225],[5,205]] }
      ],
      interpret: "<b>The x-axis is how many clusters you ask for; the y-axis is inertia</b> — the total squared distance from every point to its own centroid, which always falls as k rises. Read the <b>elbow</b>: inertia drops steeply up to k=3, then flattens. That sharp bend says k=3 captures the real structure and more clusters barely help — so 3 is the k to choose."
    },
    {
      type: "scatter",
      title: "Wrong k: k=2 merges two real groups into one (illustrative)",
      xlabel: "PCA component 1",
      ylabel: "PCA component 2",
      groups: [
        { name: "cluster 1", color: "#4ea1ff", points: [[-2.85,-2.89],[-1.87,-0.90],[-3.19,-1.85],[-3.45,-1.43],[-2.80,-1.67],[-2.79,-1.08],[-4.04,-1.36],[-2.79,-2.53],[-3.14,-1.88],[-2.56,-2.49],[0.46,0.39],[1.72,-1.52],[-0.93,-2.11],[0.66,0.44],[0.76,-1.61],[1.79,-0.27],[0.61,0.16],[-0.37,0.11],[0.39,1.08],[1.43,-1.97]] },
        { name: "cluster 2", color: "#ffb454", points: [[3.11,1.57],[4.42,1.42],[6.44,-3.58],[7.68,-3.08],[4.68,-0.97],[4.76,3.01],[4.81,-3.03],[4.15,0.77],[2.71,-4.44],[5.49,-4.17],[6.06,-0.76],[2.24,-2.69],[3.52,-3.86],[4.21,1.18],[6.23,-1.39]] }
      ],
      lines: [],
      interpret: "<b>Illustrative.</b> Same wines, but k was set to 2, so two genuinely different cultivars (the blue blob here) got crushed into a single cluster. <b>Recognise it</b> when one colour spans an obviously wide or double-humped region while a real gap runs through its middle. The fix: raise k, or trust the elbow plot, which bent at 3 not 2."
    },
    {
      type: "scatter",
      title: "Wrong shape: k-means slices two elongated bands (illustrative)",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "cluster 1", color: "#4ea1ff", points: [[0,1],[1,2.1],[2,2.9],[3,4.1],[4,5],[5,2.0],[6,2.9],[7,4.1]] },
        { name: "cluster 2", color: "#ff7b72", points: [[5,5.9],[6,7.0],[7,8.1],[8,9],[9,10.1],[0,2.0],[1,3.0],[2,4.1],[3,5.0],[4,6.0]] }
      ],
      lines: [{ color: "#9aa7b4", dash: [4,4], points: [[2.5,1.0],[6.5,9.0]] }],
      interpret: "<b>Illustrative.</b> The true clusters are two long parallel bands, but k-means only makes round blobs, so it cuts straight across them (grey dashed boundary) and mixes the bands. <b>Recognise it</b> when colours interleave along a stripe instead of forming compact balls. k-means assumes round, equal clusters — for elongated or nested shapes switch to DBSCAN or spectral clustering."
    }
  ],
  caption: "Read clusters as colour-coded groups in a PCA view, and pick k from where the elbow bends; the variants show the two ways k-means misleads — wrong k and non-round shapes.",
  code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

# 178 real wines, 13 chemical measurements each
wine = load_wine()
X = StandardScaler().fit_transform(wine.data)
P = PCA(n_components=2, random_state=0).fit_transform(X)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(P)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
colors = ["#4ea1ff", "#7ee787", "#c89bff"]
for c in range(3):
    pts = P[km.labels_ == c]
    ax1.scatter(pts[:, 0], pts[:, 1], c=colors[c], edgecolor="k")
cen = km.cluster_centers_
ax1.scatter(cen[:, 0], cen[:, 1], c="#ffb454", marker="X", s=200,
            edgecolor="k", label="centroids")
ax1.set_xlabel("PCA component 1"); ax1.set_ylabel("PCA component 2")
ax1.set_title("k-means on wine chemistry"); ax1.legend()

ks = [1, 2, 3, 4, 5]
inertia = [KMeans(n_clusters=k, n_init=10, random_state=0).fit(P).inertia_ for k in ks]
ax2.plot(ks, inertia, color="#ffb454", marker="o", label="inertia")
ax2.set_xlabel("k (clusters)"); ax2.set_ylabel("inertia")
ax2.set_title("Elbow plot"); ax2.legend()
plt.show()`
};

window.CODEVIZ["ml-em"] = {
  question: "EM gives each point soft membership in several clusters. How do you READ those responsibilities, and how do you spot when EM goes wrong?",
  charts: [
    {
      type: "bars",
      title: "Healthy: a boundary point split 75% / 25% between two Gaussians",
      labels: ["responsibility to A", "responsibility to B"],
      values: [0.75, 0.25],
      valueLabels: ["0.75", "0.25"],
      colors: ["#4ea1ff", "#7ee787"],
      interpret: "<b>Each bar is one point's responsibility</b> — the probability the E-step assigns that it came from cluster A versus cluster B, given the current Gaussians. Here cluster A's bell curve gave density 0.3 and B gave 0.1, so normalising gives 0.3/0.4 = 0.75 to A and 0.25 to B. <b>The two bars always sum to 1.</b> Read tall-vs-short as a confident assignment; a point near a cluster's centre would show one bar near 1.0."
    },
    {
      type: "scatter",
      title: "Healthy: GMM softly clusters wine into 3 overlapping components (PCA view)",
      xlabel: "PCA component 1",
      ylabel: "PCA component 2",
      groups: [
        { name: "component 1", color: "#4ea1ff", points: [[-2.85,-2.89],[-1.87,-0.90],[-3.19,-1.85],[-3.45,-1.43],[-2.80,-1.67],[-2.79,-1.08],[-4.04,-1.36],[-2.79,-2.53],[-3.14,-1.88],[-3.31,-1.44],[-2.56,-2.49],[-1.93,-1.14],[-2.00,-0.29],[-3.45,1.31],[-2.62,2.50]] },
        { name: "component 2", color: "#7ee787", points: [[0.46,0.39],[1.72,-1.52],[-0.93,-2.11],[0.66,0.44],[0.76,-1.61],[2.40,4.84],[1.79,-0.27],[0.61,0.16],[0.62,0.64],[-0.37,0.11],[0.39,1.08],[-0.54,-1.32],[1.43,-1.97],[1.35,-1.28],[-0.78,-2.12]] },
        { name: "component 3", color: "#c89bff", points: [[3.11,1.57],[4.42,1.42],[6.44,-3.58],[7.68,-3.08],[4.68,-0.97],[4.76,3.01],[4.81,-3.03],[4.15,0.77],[2.71,-4.44],[5.49,-4.17],[6.06,-0.76],[2.24,-2.69],[3.52,-3.86],[4.21,1.18],[6.23,-1.39]] }
      ],
      lines: [],
      interpret: "<b>Axes are PCA combinations of the 13 wine chemistry features.</b> Each dot is coloured by its <b>most-likely</b> component, but EM actually keeps a probability per component for every point. Three clean blobs with fuzzy borders means the mixture fit the three cultivars; points near a border are the ones whose responsibility is genuinely shared. Mixture weights here are roughly [0.38, 0.27, 0.35] — the fraction of wines each Gaussian explains."
    },
    {
      type: "bars",
      title: "Overlap: a point caught between heavily overlapping components (illustrative)",
      labels: ["responsibility to A", "responsibility to B"],
      values: [0.52, 0.48],
      valueLabels: ["0.52", "0.48"],
      colors: ["#ffb454", "#ffb454"],
      interpret: "<b>Illustrative.</b> When two Gaussians overlap a lot, a point in the middle gets near-equal density from both, so its responsibilities come out roughly 0.52 / 0.48 — almost a coin flip. <b>Recognise it</b> as two bars of nearly the same height. This is not a bug: it honestly says the point is ambiguous. Many such split points means the components overlap and hard labels would be unreliable."
    },
    {
      type: "line",
      title: "Convergence: log-likelihood climbs then plateaus (illustrative)",
      xlabel: "EM iteration",
      ylabel: "log-likelihood (higher = better fit)",
      series: [
        { name: "log-likelihood", color: "#7ee787", points: [[0,-820],[1,-540],[2,-410],[3,-360],[4,-342],[5,-336],[6,-334],[7,-333],[8,-333]] }
      ],
      interpret: "<b>Illustrative.</b> The x-axis is the EM round; the y-axis is the data's log-likelihood under the current model, which <b>EM guarantees can only rise or stay flat</b> each iteration. Read the curve: it jumps early, then flattens — that plateau is convergence, where you stop. If instead it shot up toward infinity, a component has collapsed onto a single point (a singular Gaussian) — add a covariance floor to prevent it."
    }
  ],
  caption: "Read EM by its responsibilities (soft membership bars that sum to 1) and its rising log-likelihood; variants show ambiguous near-50/50 splits and the convergence plateau you stop at.",
  code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.mixture import GaussianMixture

wine = load_wine()
X = StandardScaler().fit_transform(wine.data)
P = PCA(n_components=2, random_state=0).fit_transform(X)

gmm = GaussianMixture(n_components=3, random_state=0).fit(P)
labels = gmm.predict(P)              # hard label = argmax of soft probs
resp = gmm.predict_proba(P)          # the E-step responsibilities (sum to 1 per row)
print("mixture weights", gmm.weights_)
print("example responsibilities", resp[0])

colors = ["#4ea1ff", "#7ee787", "#c89bff"]
for c in range(3):
    pts = P[labels == c]
    plt.scatter(pts[:, 0], pts[:, 1], c=colors[c], edgecolor="k",
                label="component %d" % (c + 1))
plt.xlabel("PCA component 1"); plt.ylabel("PCA component 2")
plt.title("GMM soft clusters on wine"); plt.legend()
plt.show()`
};

window.CODEVIZ["ml-hierarchical"] = {
  question: "Reading a dendrogram: which points merged first, and where do you cut for k clusters?",
  charts: [
    {
      type: "bars",
      title: "Ideal dendrogram (as merge heights): low merges = tight, the tall jump = the natural split",
      labels: ["merge {A,B}", "merge {D,E}", "merge {AB,C}", "merge {ABC,DE}"],
      values: [1.0, 1.0, 3.0, 7.0],
      valueLabels: ["h=1.0", "h=1.0", "h=3.0", "h=7.0"],
      colors: ["#7ee787", "#7ee787", "#4ea1ff", "#ff7b72"],
      interpret: "<b>Real numbers</b> for points A=1, B=2, C=5, D=12, E=13 on a line, single linkage. Each bar is one merge in the order it happened (left = earliest); the height is the distance at which the two clusters joined. Read it bottom-up: the first merges A+B and D+E are <b>short</b> (height 1.0) so those pairs are genuinely close; the last merge (red, height 7.0) is a <b>big jump</b>, meaning the two halves {A,B,C} and {D,E} are far apart. <b>To get k clusters, cut just below the tallest jump</b> you are willing to bridge: cutting under the red bar leaves 2 clusters. The biggest gap between consecutive heights is the most defensible place to cut."
    },
    {
      type: "scatter",
      title: "What the cut means in the data: cutting under the tall merge gives 2 clusters",
      xlabel: "position",
      ylabel: "(spread for visibility)",
      groups: [
        { name: "cluster 1 (left)", color: "#4ea1ff", points: [[1, 0], [2, 0.1], [5, -0.1]] },
        { name: "cluster 2 (right)", color: "#7ee787", points: [[12, 0], [13, 0.1]] }
      ],
      interpret: "<b>Real numbers</b>, same five points. This is the partition you get by cutting the dendrogram above just below its tallest merge: the close-together left points {A,B,C} fall in one cluster (blue) and the far-right pair {D,E} in another (green). Read it as the payoff of the tree — the height you cut at on the previous chart picks exactly this grouping. Cut lower (under height 3.0) and C would split off into its own cluster, giving 3."
    },
    {
      type: "scatter",
      title: "Variant - single linkage CHAINS: a bridge of points strings two blobs together",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "merged into ONE straggly cluster", color: "#ffb454", points: [[0, 0], [1, 0.2], [2, 0], [3, 0.1], [4, 0], [5, 0.2], [6, 0]] }
      ],
      interpret: "<b>Illustrative.</b> Single linkage measures cluster distance by the <i>closest</i> pair, so a thin chain of evenly-spaced points lets it hop from one blob to the next - the whole row collapses into one elongated cluster (orange). Recognise it by a dendrogram with many <b>small, similar merge heights</b> and no clean tall gap, and by clusters that are stringy rather than round. If you expected two compact groups, single linkage's chaining is the culprit; switch to Ward or complete linkage."
    },
    {
      type: "scatter",
      title: "Variant - Ward / complete linkage: same points split into two compact round clusters",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "cluster A (compact)", color: "#4ea1ff", points: [[0, 0], [0.4, 0.5], [0.6, -0.3], [0.2, 0.2]] },
        { name: "cluster B (compact)", color: "#7ee787", points: [[5, 0], [5.4, 0.5], [5.6, -0.3], [5.2, 0.2]] }
      ],
      interpret: "<b>Illustrative.</b> Ward (and complete) linkage resists chaining because it merges to keep clusters <b>tight</b> - it would rather not bridge a gap, so the same data separates into two round, balanced blobs. Recognise this case by a dendrogram with one obvious tall merge separating two low-height sub-trees, and by clusters that look compact and similar in size. The lesson: linkage is a real choice - single chains, Ward compacts - so try a couple and compare the dendrograms before trusting any cut."
    }
  ],
  caption: "A dendrogram records the order and height of merges; you cut it horizontally to choose how many clusters you want, and the linkage rule decides what shapes you get.",
  code: "// Agglomerative single-linkage on points along a line\nconst pts = { A: 1, B: 2, C: 5, D: 12, E: 13 };\nlet clusters = Object.entries(pts).map(([n, x]) => ({ name: n, members: [x] }));\nfunction dist(a, b) { // single linkage = closest pair\n  let m = Infinity;\n  for (const x of a.members) for (const y of b.members) m = Math.min(m, Math.abs(x - y));\n  return m;\n}\nwhile (clusters.length > 1) {\n  let bi = 0, bj = 1, best = Infinity;\n  for (let i = 0; i < clusters.length; i++)\n    for (let j = i + 1; j < clusters.length; j++) {\n      const d = dist(clusters[i], clusters[j]);\n      if (d < best) { best = d; bi = i; bj = j; }\n    }\n  console.log('merge', clusters[bi].name, '+', clusters[bj].name, 'at height', best.toFixed(1));\n  const merged = { name: clusters[bi].name + clusters[bj].name,\n                   members: clusters[bi].members.concat(clusters[bj].members) };\n  clusters = clusters.filter((_, k) => k !== bi && k !== bj).concat([merged]);\n}\n// tall final merge (height 7) is the natural place to cut -> 2 clusters"
};

window.CODEVIZ["ml-pca"] = {
  question: "How do you read the principal axes of a cloud, and when can PCA actually compress it?",
  charts: [
    {
      type: "scatter",
      title: "Ideal - correlated cloud with PC1/PC2 through the mean: PC1 catches the spread",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "data points", color: "#4ea1ff", points: [[1, 1.2], [2, 1.8], [3, 3.3], [4, 3.8], [5, 5.4], [6, 5.8], [2.5, 3.0], [4.5, 4.2]] }
      ],
      lines: [
        { color: "#ffb454", points: [[0.7, 1.0], [6.3, 5.5]] },
        { color: "#c89bff", dash: true, points: [[2.9, 4.5], [4.1, 2.0]] }
      ],
      interpret: "<b>Real numbers</b> for this 8-point cloud (mean about (3.5, 3.6)). The orange line is <b>PC1</b>, the direction of greatest spread; the purple dashed line is <b>PC2</b>, exactly perpendicular to it through the mean. Read it this way: the points hug the orange axis and barely deviate along the purple one, so almost all the variation is captured by PC1 alone. Both axes always pass through the mean and are orthogonal; the long axis is the one you keep when compressing to 1-D."
    },
    {
      type: "bars",
      title: "Scree / variance explained: PC1 holds most, so drop PC2",
      labels: ["PC1", "PC2"],
      values: [94.0, 6.0],
      valueLabels: ["94%", "6%"],
      colors: ["#7ee787", "#9aa7b4"],
      interpret: "<b>Real numbers</b> from the covariance eigenvalues of the cloud above (lambda1 about 4.7, lambda2 about 0.3). Each bar is one component's share of total variance, biggest first - this is a <b>scree plot</b>. The steep drop from a tall PC1 (green, ~94%) to a tiny PC2 (grey, ~6%) is the signal that the data is essentially 1-D: <b>keep components left of the cliff, discard the rest</b>. Here keeping only PC1 throws away 2-D structure yet retains 94% of the spread - near-lossless compression."
    },
    {
      type: "bars",
      title: "Variant - flat scree (isotropic cloud): no direction wins, PCA can't compress",
      labels: ["PC1", "PC2"],
      values: [52.0, 48.0],
      valueLabels: ["52%", "48%"],
      colors: ["#ffb454", "#ffb454"],
      interpret: "<b>Illustrative.</b> When the cloud is a roughly round blob (no correlation), the eigenvalues are nearly equal and the scree plot is <b>flat</b> - both bars near 50%. Recognise this by the absence of any cliff: there is no dominant direction, so dropping PC2 loses almost half the variance. The lesson: PCA only compresses when variance is concentrated in a few directions; a flat scree means your features are already roughly independent and PCA buys you little."
    },
    {
      type: "scatter",
      title: "Variant - one outlier hijacks the axes: PC1 tilts toward the stray point",
      xlabel: "x",
      ylabel: "y",
      groups: [
        { name: "main cloud", color: "#4ea1ff", points: [[1, 1], [2, 1.2], [3, 0.9], [4, 1.1], [5, 1.0]] },
        { name: "outlier", color: "#ff7b72", points: [[6, 8]] }
      ],
      lines: [
        { color: "#ffb454", points: [[1.0, 0.5], [6.0, 7.0]] }
      ],
      interpret: "<b>Illustrative.</b> The blue points lie almost flat (variation along x), so the true PC1 should be roughly horizontal. But PCA chases variance, and a single far <b>outlier</b> (red, top-right) injects huge spread along a diagonal - so the fitted PC1 (orange) <b>tilts up toward the outlier</b> and misrepresents the bulk of the data. Recognise it when the principal axis points at a lone extreme point rather than along the crowd. Fix by cleaning outliers or using robust PCA before trusting the components."
    }
  ],
  caption: "PCA draws orthogonal axes through the mean ordered by spread; the scree plot tells you whether variance concentrates enough to compress, and outliers or isotropy can break that.",
  code: "// PCA on a 2-D cloud via the covariance matrix\nconst P = [[1,1.2],[2,1.8],[3,3.3],[4,3.8],[5,5.4],[6,5.8],[2.5,3.0],[4.5,4.2]];\nconst n = P.length;\nconst mx = P.reduce((s,p)=>s+p[0],0)/n, my = P.reduce((s,p)=>s+p[1],0)/n;\nlet sxx=0, sxy=0, syy=0;\nfor (const [x,y] of P) { const dx=x-mx, dy=y-my; sxx+=dx*dx; sxy+=dx*dy; syy+=dy*dy; }\nsxx/=n; sxy/=n; syy/=n;            // covariance matrix [[sxx,sxy],[sxy,syy]]\nconst tr = sxx+syy, det = sxx*syy - sxy*sxy;\nconst disc = Math.sqrt(tr*tr/4 - det);\nconst l1 = tr/2 + disc, l2 = tr/2 - disc;   // eigenvalues, largest first\nconsole.log('lambda1=' + l1.toFixed(2), 'lambda2=' + l2.toFixed(2));\nconsole.log('PC1 variance explained = ' + (100*l1/(l1+l2)).toFixed(1) + '%');\n// PC1 direction = eigenvector for l1: [sxy, l1 - sxx] (then normalize)"
};

window.CODEVIZ["ml-ica"] = {
  question: "Two voices blended into two mics: can ICA unmix them back into the separate sources?",
  charts: [
    {
      type: "line",
      title: "Healthy unmixing: recovered waves match the true sources",
      xlabel: "time (sample index)",
      ylabel: "amplitude (scaled)",
      series: [
        { name: "true source (sine)", color: "#9aa7b4", points: [[0,0],[1,0.59],[2,0.95],[3,0.95],[4,0.59],[5,0],[6,-0.59],[7,-0.95],[8,-0.95],[9,-0.59],[10,0],[11,0.59],[12,0.95],[13,0.95],[14,0.59],[15,0]] },
        { name: "mixture (mic 1)", color: "#ff7b72", points: [[0,0.7],[1,1.0],[2,0.55],[3,1.0],[4,1.0],[5,0.7],[6,-0.7],[7,-1.0],[8,-0.55],[9,-1.0],[10,-0.7],[11,1.0],[12,0.55],[13,1.0],[14,1.0],[15,0.7]] },
        { name: "recovered source 1", color: "#7ee787", points: [[0,0.02],[1,0.61],[2,0.96],[3,0.94],[4,0.57],[5,-0.01],[6,-0.6],[7,-0.96],[8,-0.94],[9,-0.58],[10,0.01],[11,0.6],[12,0.96],[13,0.94],[14,0.58],[15,0.0]] }
      ],
      interpret: "X axis is time; Y axis is the (rescaled) wave height. The grey line is one true source, the red line is what a microphone actually heard - a tangled blend of both voices. The green line is ICA's recovered source 1, and it lands almost exactly on top of the grey true wave. <b>When recovery works, each recovered line traces one clean original signal, not the messy mixture.</b> Note ICA fixes shape but not amplitude or sign, so a recovered wave may be flipped or rescaled - judge it by shape, not height."
    },
    {
      type: "line",
      title: "Singular mixing matrix: nothing to unmix (illustrative)",
      xlabel: "time (sample index)",
      ylabel: "amplitude (scaled)",
      series: [
        { name: "true source (sine)", color: "#9aa7b4", points: [[0,0],[1,0.59],[2,0.95],[3,0.95],[4,0.59],[5,0],[6,-0.59],[7,-0.95],[8,-0.95],[9,-0.59],[10,0],[11,0.59],[12,0.95],[13,0.95],[14,0.59],[15,0]] },
        { name: "recovered (garbage)", color: "#ff7b72", points: [[0,0.05],[1,-0.7],[2,0.9],[3,-0.3],[4,0.6],[5,-0.95],[6,0.2],[7,0.8],[8,-0.55],[9,0.4],[10,-0.85],[11,0.1],[12,0.7],[13,-0.6],[14,0.35],[15,-0.2]] }
      ],
      interpret: "Illustrative. If the two mics hear nearly the same blend, the mixing matrix is (near) singular - its determinant is about zero - and it cannot be inverted. <b>The recovered red line is jagged noise that matches no source</b>; ICA has no independent directions to find. Recognise this when recovered signals look random and a quality score (correlation with any source) stays low. Fix: ensure the sensors capture genuinely different mixes."
    },
    {
      type: "line",
      title: "Gaussian sources: ICA cannot separate them (illustrative)",
      xlabel: "time (sample index)",
      ylabel: "amplitude (scaled)",
      series: [
        { name: "true source A (gaussian)", color: "#9aa7b4", points: [[0,0.3],[1,-0.8],[2,0.5],[3,1.0],[4,-0.4],[5,0.2],[6,-0.9],[7,0.7],[8,0.1],[9,-0.6],[10,0.8],[11,-0.2],[12,0.4],[13,-1.0],[14,0.6],[15,-0.3]] },
        { name: "recovered (still mixed)", color: "#ff7b72", points: [[0,0.5],[1,-0.5],[2,0.7],[3,0.6],[4,-0.7],[5,0.4],[6,-0.6],[7,0.3],[8,0.5],[9,-0.4],[10,0.55],[11,-0.5],[12,0.2],[13,-0.65],[14,0.75],[15,-0.45]] }
      ],
      interpret: "Illustrative. ICA separates sources by hunting for non-Gaussian (peaky or flat) structure. <b>If the true sources are themselves Gaussian (bell-curve) noise, there is no non-Gaussian fingerprint to grab</b>, so the red recovered line stays an arbitrary rotation of the mixture and never locks onto source A. Recognise this failure when components look like featureless random noise and reorder/rescale every run. ICA needs non-Gaussian sources; for Gaussian data it is fundamentally unidentifiable."
    }
  ],
  caption: "ICA assumes independent, non-Gaussian sources and a mixable (invertible) blend. The first chart shows it succeeding; the other two show the two classic ways it fails.",
  code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import FastICA

# two independent sources: a sine and a square wave
t = np.linspace(0, 1, 200)
s1 = np.sin(2 * np.pi * 3 * t)
s2 = np.sign(np.sin(2 * np.pi * 5 * t))
S = np.c_[s1, s2]

# mix them through an invertible matrix, then unmix with ICA
A = np.array([[1.0, 0.7], [0.4, 1.0]])
Xmix = S @ A.T
S_hat = FastICA(n_components=2, random_state=0).fit_transform(Xmix)

plt.plot(t, s1, color="#9aa7b4", label="true source (sine)")
plt.plot(t, Xmix[:, 0], color="#ff7b72", label="mixture (mic 1)")
plt.plot(t, S_hat[:, 0], color="#7ee787", label="recovered source 1")
plt.xlabel("time")
plt.ylabel("amplitude")
plt.title("ICA unmixing")
plt.legend()
plt.show()`
};

window.CODEVIZ["ml-classification-metrics"] = {
  question: "Beyond one accuracy number, what kind of mistakes is the classifier actually making?",
  charts: [
    {
      type: "confusion",
      title: "Balanced & accurate: strong precision and recall",
      labels: ["positive", "negative"],
      matrix: [[60, 3], [1, 107]],
      interpret: "Rows are the true label, columns are the prediction. The two green-diagonal cells (60 true positives, 107 true negatives) are correct; the off-diagonal cells are the mistakes (3 missed positives = false negatives, 1 false alarm = false positive). <b>A healthy classifier puts almost all of its mass on the diagonal.</b> Read precision = 60/(60+1) = 0.98 and recall = 60/(60+3) = 0.95 straight off the cells - both high, so it rarely cries wolf and rarely misses."
    },
    {
      type: "confusion",
      title: "High precision, low recall: threshold set too strict (illustrative)",
      labels: ["positive", "negative"],
      matrix: [[28, 35], [1, 107]],
      interpret: "Illustrative. Here the cutoff for saying yes is very high, so the model only flags cases it is sure about. <b>The false-positive cell is tiny (1) but the false-negative cell is large (35) - the model misses most real positives.</b> Precision = 28/(28+1) = 0.97 looks great, yet recall = 28/(28+35) = 0.44 is poor. Recognise this pattern - top-right cell heavy - when a single accuracy or precision number hides a wall of missed cases. Lower the threshold to trade some precision back for recall."
    },
    {
      type: "confusion",
      title: "Majority-class collapse on imbalanced data (illustrative)",
      labels: ["positive", "negative"],
      matrix: [[0, 9], [0, 891]],
      interpret: "Illustrative: 900 rows, only 9 truly positive. The model predicted negative for everything, so the whole positive row sits in the false-negative cell and the positive column is empty. <b>Accuracy is 891/900 = 0.99 and looks excellent, but recall = 0/9 = 0 - it caught zero real positives.</b> This is the classic trap of judging an imbalanced problem by accuracy. Recognise it when one column is empty; report precision, recall, or PR-AUC, and rebalance or reweight the rare class."
    }
  ],
  caption: "The confusion matrix splits every prediction into TP / FP / FN / TN. The first matrix is healthy; the variants show a too-strict threshold and an accuracy-looks-fine-but-catches-nothing collapse on imbalanced data.",
  code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import ConfusionMatrixDisplay, precision_score, recall_score

bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
y = bc.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

clf = LogisticRegression(max_iter=5000).fit(Xtr, ytr)
pred = clf.predict(Xte)

print("precision", precision_score(yte, pred))
print("recall", recall_score(yte, pred))

# rows = true label, columns = predicted label
ConfusionMatrixDisplay.from_predictions(
    yte, pred, display_labels=["positive", "negative"])
plt.title("Confusion matrix")
plt.show()`
};

window.CODEVIZ["ml-roc-auc"] = {
  question: "Move the threshold and the whole curve of catches-vs-false-alarms appears — how do you read its shape and its area?",
  charts: [
    {
      type: "roc",
      title: "Ideal: ROC of the worked example, AUC = 0.75",
      auc: 0.75,
      points: [[0, 0], [0, 0.5], [0.5, 0.5], [0.5, 1.0], [1.0, 1.0]],
      interpret: "<b>Real numbers</b> from the lesson: positives score 0.9 and 0.6, negatives score 0.7 and 0.3. The x-axis is FPR (false-alarm rate on real negatives), the y-axis is TPR (catch rate on real positives). Each corner is one threshold sliding from strict (bottom-left, no alarms) to loose (top-right, all alarms). The area under the staircase is <b>0.75</b> — a random positive outranks a random negative 75% of the time. Bowing above the dashed diagonal means better than a coin flip."
    },
    {
      type: "roc",
      title: "Strong classifier: hugs the top-left corner, AUC ≈ 0.95",
      auc: 0.95,
      points: [[0, 0], [0.02, 0.55], [0.05, 0.82], [0.12, 0.93], [0.3, 0.98], [0.6, 0.995], [1.0, 1.0]],
      interpret: "Illustrative shape. The curve shoots almost straight up before moving right: it catches most positives (high TPR) while raising almost no false alarms (low FPR). The closer it presses into the <b>top-left corner</b>, the larger the area — here about 0.95. This is what a good model looks like; read it as 'high recall available at a tiny false-alarm cost'."
    },
    {
      type: "roc",
      title: "Near-random: hugs the diagonal, AUC ≈ 0.52",
      auc: 0.52,
      points: [[0, 0], [0.2, 0.22], [0.4, 0.43], [0.6, 0.62], [0.8, 0.81], [1.0, 1.0]],
      interpret: "Illustrative. The curve lies almost on the dashed diagonal, so every gain in catches costs an equal gain in false alarms — AUC near <b>0.5</b> means the scores barely separate the classes. Recognise it by the lack of any bow toward the top-left. Conclusion: the model is close to guessing; more signal or better features are needed."
    },
    {
      type: "roc",
      title: "Crosses the diagonal: worse than chance in a region",
      auc: 0.58,
      points: [[0, 0], [0.15, 0.08], [0.35, 0.22], [0.5, 0.45], [0.65, 0.78], [0.85, 0.93], [1.0, 1.0]],
      interpret: "Illustrative. At low thresholds (left side) the curve dips <b>below</b> the diagonal — in that region the model ranks negatives above positives, so it is worse than chance there even though the overall area (about 0.58) looks mediocre-but-positive. A single AUC number hides this; always look at the <b>shape</b>. A curve dipping below the diagonal often signals flipped labels or a feature that means the opposite of what you assumed in part of the score range."
    }
  ],
  caption: "ROC plots TPR (catches) against FPR (false alarms) across every threshold; AUC is the area under it (0.5 = random, 1.0 = perfect).",
  code: "// ROC + AUC from raw scores, no threshold fixed\n" +
    "const pos = [0.9, 0.6];      // scores of real positives\n" +
    "const neg = [0.7, 0.3];      // scores of real negatives\n" +
    "const cuts = [...pos, ...neg].sort((a, b) => b - a);\n" +
    "const pts = [[0, 0]];\n" +
    "for (const t of cuts) {\n" +
    "  const tpr = pos.filter(s => s >= t).length / pos.length;\n" +
    "  const fpr = neg.filter(s => s >= t).length / neg.length;\n" +
    "  pts.push([fpr, tpr]);\n" +
    "}\n" +
    "pts.push([1, 1]);\n" +
    "let auc = 0;                 // trapezoid area under the staircase\n" +
    "for (let i = 1; i < pts.length; i++)\n" +
    "  auc += (pts[i][0] - pts[i-1][0]) * (pts[i][1] + pts[i-1][1]) / 2;\n" +
    "console.log(auc);            // 0.75"
};

window.CODEVIZ["ml-regression-metrics"] = {
  question: "The line fits the dots — but is R-squared 0.98 really good, and what do the leftover errors tell you?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: tight fit, R-squared = 0.979, RMSE = 0.381",
      xlabel: "x",
      ylabel: "y",
      groups: [{ name: "data", color: "#4ea1ff", points: [[1, 2.3], [2, 3.6], [3, 6.4], [4, 7.2], [5, 9.6]] }],
      lines: [
        { color: "#ffb454", points: [[0, 0.36], [6, 11.28]] },
        { color: "#9aa7b4", dash: [5, 4], points: [[0, 5.82], [6, 5.82]] }
      ],
      interpret: "<b>Real best-fit line</b> y = 1.82x + 0.36 (orange) on the lesson's data; the grey dashed line is the baseline 'always predict the mean' (5.82). The vertical gap from each blue dot to the orange line is the residual. RMSE = <b>0.381</b> is the typical miss in y's own units. R-squared = 1 minus (model's squared error / baseline's squared error) = <b>0.979</b>, so the model explains 98% of the up-down spread the mean line cannot. Points hug the line evenly — this is a healthy fit."
    },
    {
      type: "scatter",
      title: "Heteroscedastic: good R-squared hides a growing error fan",
      xlabel: "x",
      ylabel: "y",
      groups: [{ name: "data", color: "#ffb454", points: [[1, 2.0], [2, 4.2], [3, 5.8], [4, 9.1], [5, 7.0], [6, 14.5], [7, 9.5], [8, 18.0]] }],
      lines: [{ color: "#ff7b72", points: [[0, 0.5], [9, 18.5]] }],
      interpret: "Illustrative. The line is right on average and R-squared can still look high, but the residuals <b>fan out</b>: tiny on the left, huge on the right. A single RMSE averages this away and lies about the right-hand points. Recognise it by the cone shape around the line. Conclusion: error is not constant, so prediction intervals from one RMSE are wrong — slice by region or transform y."
    },
    {
      type: "scatter",
      title: "No better than the mean: R-squared near 0",
      xlabel: "x",
      ylabel: "y",
      groups: [{ name: "data", color: "#ff7b72", points: [[1, 6.1], [2, 4.8], [3, 6.6], [4, 5.2], [5, 6.9], [6, 4.5], [7, 6.3], [8, 5.4]] }],
      lines: [{ color: "#9aa7b4", dash: [5, 4], points: [[0, 5.7], [9, 5.7]] }],
      interpret: "Illustrative. The cloud has no slope, so the best line is essentially flat and matches the grey mean baseline. The model's squared error equals the baseline's, so R-squared is about <b>0</b> — it explains none of the variation. On held-out data a fit worse than the mean can even give a <b>negative R-squared</b>, a warning, not a bug. Conclusion: x carries no linear signal for y."
    },
    {
      type: "scatter",
      title: "Residual plot: a line misses a curved pattern",
      xlabel: "predicted y-hat",
      ylabel: "residual (y minus y-hat)",
      groups: [{ name: "residuals", color: "#c89bff", points: [[1, 1.4], [2, 0.2], [3, -0.9], [4, -1.3], [5, -0.8], [6, 0.4], [7, 1.6]] }],
      lines: [{ color: "#9aa7b4", dash: [5, 4], points: [[0.5, 0], [7.5, 0]] }],
      interpret: "Illustrative diagnostic. Residuals (error left after the fit) are plotted against the prediction; for a good linear model they should scatter randomly around the dashed zero line. Here they form a <b>smile</b> — negative in the middle, positive at the ends — meaning the straight line systematically under- then over-shoots. A decent RMSE/R-squared can hide this. Conclusion: the true relationship is curved; add a polynomial term or switch to a non-linear model."
    }
  ],
  caption: "RMSE is the typical error in y's units; R-squared = 1 minus (model error / mean-baseline error) is the fraction of variance explained (1 perfect, 0 = no better than the mean).",
  code: "// R-squared and RMSE from data and predictions\n" +
    "const xs = [1, 2, 3, 4, 5];\n" +
    "const ys = [2.3, 3.6, 6.4, 7.2, 9.6];\n" +
    "const m = 1.82, b = 0.36;            // fitted line y-hat = m*x + b\n" +
    "const yhat = xs.map(x => m * x + b);\n" +
    "const ybar = ys.reduce((s, y) => s + y, 0) / ys.length;\n" +
    "let ssRes = 0, ssTot = 0;\n" +
    "for (let i = 0; i < ys.length; i++) {\n" +
    "  ssRes += (ys[i] - yhat[i]) ** 2;   // model's squared error\n" +
    "  ssTot += (ys[i] - ybar) ** 2;      // baseline (mean) squared error\n" +
    "}\n" +
    "const r2 = 1 - ssRes / ssTot;        // 0.979\n" +
    "const rmse = Math.sqrt(ssRes / ys.length); // 0.381\n" +
    "console.log(r2, rmse);"
};

window.CODEVIZ["ml-regularization"] = {
  question: "How does a weight-size penalty shrink coefficients, and how do you pick its strength?",
  charts: [
    {
      type: "line",
      title: "Ideal: Ridge shrinks the weight smoothly toward zero as lambda grows",
      xlabel: "penalty strength lambda",
      ylabel: "fitted weight theta",
      series: [
        {
          name: "theta = 4 / (1 + lambda)  (Ridge)",
          color: "#7ee787",
          points: [
            [0, 4.00], [0.25, 3.20], [0.5, 2.67], [1, 2.00], [1.5, 1.60],
            [2, 1.33], [3, 1.00], [4, 0.80], [6, 0.57], [8, 0.44], [10, 0.36]
          ]
        }
      ],
      interpret: "<b>Real numbers.</b> X is the penalty strength lambda; Y is the weight Ridge actually fits when plain least-squares wants theta = 4 (minimizing (theta-4)^2 + lambda*theta^2 gives theta = 4/(1+lambda)). Read left to right: at lambda = 0 there is no penalty so theta = 4; as lambda grows the curve slides down toward 0 but <b>never touches it</b>. That smooth, never-zero decay is the signature of L2 (Ridge): it tames big weights without deleting any feature."
    },
    {
      type: "line",
      title: "L1 sparsity: Lasso drives a weight to EXACTLY zero, then keeps it there",
      xlabel: "penalty strength lambda",
      ylabel: "fitted weight theta",
      series: [
        {
          name: "Lasso weight (soft-threshold)",
          color: "#4ea1ff",
          points: [
            [0, 4.00], [0.5, 3.50], [1, 3.00], [1.5, 2.50], [2, 2.00],
            [3, 1.00], [4, 0.00], [5, 0.00], [6, 0.00], [8, 0.00], [10, 0.00]
          ]
        }
      ],
      interpret: "<b>Illustrative.</b> Same starting weight of 4, but L1 (Lasso) subtracts a fixed amount each step (soft-thresholding) instead of scaling. The line falls straight down and <b>hits exactly 0 at lambda = 4, then stays flat on zero</b>. That kink-to-zero is the whole point of Lasso: once a weight is zeroed the feature is dropped from the model. Contrast with the green Ridge curve above, which only ever approaches zero — this is why Lasso does feature selection and Ridge does not."
    },
    {
      type: "line",
      title: "Picking lambda: cross-validation error is a U (under- vs over-regularizing)",
      xlabel: "penalty strength lambda (log scale)",
      ylabel: "5-fold validation error",
      series: [
        {
          name: "validation error",
          color: "#ffb454",
          points: [
            [0.01, 0.42], [0.03, 0.36], [0.1, 0.30], [0.3, 0.25],
            [1, 0.22], [3, 0.24], [10, 0.28], [30, 0.36], [100, 0.45]
          ]
        }
      ],
      interpret: "<b>Real numbers (from the lesson's CV sweep).</b> X is the penalty strength lambda; Y is the average error on held-out folds. The curve is a <b>U</b>: the <b>left arm is under-regularizing</b> (lambda too small, the model overfits, so it fails on new folds), the <b>right arm is over-regularizing</b> (lambda too big, weights crushed, the model underfits). The bottom of the U at <b>lambda = 1 (error 0.22)</b> is the sweet spot you keep. Always read this U off validation folds, never training error — training error just keeps dropping as lambda shrinks and would lie to you."
    },
    {
      type: "scatter",
      title: "Why L1 zeros weights: the diamond touches a loss contour at a corner",
      xlabel: "theta1",
      ylabel: "theta2",
      groups: [
        { name: "OLS min (unpenalized best)", color: "#9aa7b4", points: [[2.6, 1.8]] },
        { name: "Lasso solution (on an axis)", color: "#4ea1ff", points: [[0.0, 1.45]] },
        { name: "Ridge solution (off-axis)", color: "#7ee787", points: [[0.78, 1.22]] }
      ],
      lines: [
        { color: "#4ea1ff", dash: [4, 3], points: [[1.45, 0], [0, 1.45], [-1.45, 0], [0, -1.45], [1.45, 0]] },
        { color: "#9aa7b4", dash: [2, 3], points: [[3.4, 1.8], [2.6, 2.85], [1.8, 1.8], [2.6, 0.75], [3.4, 1.8]] }
      ],
      interpret: "<b>Illustrative geometry.</b> The grey point is where unpenalized least-squares wants to be; the grey dashed ellipse is one loss contour (equal-error ring) around it. The blue diamond is the L1 budget |theta1|+|theta2| <= t. The penalized answer is where the growing loss ring <b>first touches the budget shape</b>: for the diamond that contact lands on a sharp <b>corner sitting on an axis</b>, so theta1 = 0 — the feature is dropped (blue point). A round L2 ball has no corners, so its touch point (green) sits off the axes with both weights merely small but nonzero. Corners cause sparsity; that is the geometric reason L1 selects features and L2 does not."
    }
  ],
  caption: "Regularization penalizes big weights: Ridge (L2) shrinks smoothly, Lasso (L1) zeros features outright, and cross-validation's U-curve tells you how hard to penalize.",
  code: "// Ridge in one line: it shrinks a weight that least-squares wants at 4.\n// minimize (theta-4)^2 + lambda*theta^2  ->  theta = 4 / (1 + lambda)\nfor (const lambda of [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10]) {\n  const theta = 4 / (1 + lambda);\n  console.log('lambda=' + lambda + '  theta=' + theta.toFixed(2));\n}\n// lambda=0 -> 4.00 (no penalty); grows -> shrinks toward 0 but never reaches it.\n// Lasso instead would soft-threshold and hit exactly 0 once lambda is large enough.\n// Pick lambda by the lowest 5-fold validation error (a U-shaped curve)."
};
