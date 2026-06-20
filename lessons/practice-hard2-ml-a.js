/* =====================================================================
   PRACTICE PROBLEMS — MODULE 2 (Machine Learning), HARDER set 2.
   Owned lesson ids: ml-supervised, ml-loss, ml-cost, ml-gradient-descent,
   ml-linear-regression, ml-likelihood, ml-logistic-regression,
   ml-softmax, ml-glm.
   These ADD to set A and the first hard set. Each problem here is
   genuinely harder than the earlier ones and DISTINCT from them:
   multi-feature regression, regularized variants, MLE for more
   distributions, multi-class / temperature softmax, GD on non-quadratics,
   learning-rate analysis, cross-entropy gradients, GLM links.
   Notation matches lessons/02-ml.js. Logs are natural unless stated.
   Sigmoids/softmax/logs rounded to 2-3 dp (stated each time).
   ===================================================================== */
(function () {
  var P = window.PRACTICE;
  function add(id, probs) { P[id] = (P[id] || []).concat(probs); }

  /* ----------------------------------------------------------------
     ml-supervised: harder — generalization gap, bias/variance,
     k-NN, polynomial features, train/val/test splits, label noise.
  ---------------------------------------------------------------- */
  add("ml-supervised", [
    { q:`<p>A polynomial model $h_\\theta(x) = \\theta_0 + \\theta_1 x + \\theta_2 x^2$ has $\\theta = (1, -2, 0.5)$. Predict for $x = 4$.</p>`,
      steps:[
        {do:`Build the feature vector $(1, x, x^2) = (1, 4, 16)$.`, why:`A polynomial model is linear in these transformed features.`},
        {do:`Dot with $\\theta$: $1{\\cdot}1 + (-2){\\cdot}4 + 0.5{\\cdot}16 = 1 - 8 + 8 = 1$.`, why:`The hypothesis is still a weighted sum of features.`}
      ],
      answer:`$h_\\theta(4) = 1$` },

    { q:`<p>A 1-nearest-neighbor classifier is trained on points $(x, y)$: $(1, A), (4, B), (7, B)$. Classify a new point at $x = 3$.</p>`,
      steps:[
        {do:`Distances to training points: $|3-1| = 2$, $|3-4| = 1$, $|3-7| = 4$.`, why:`1-NN predicts the label of the single closest training point.`},
        {do:`The smallest distance is $1$ (point $x = 4$, label $B$), so predict $B$.`, why:`The nearest neighbor dictates the label.`}
      ],
      answer:`Class $B$ (nearest point is $x = 4$, distance $1$)` },

    { q:`<p>A model has training error $0.05$ and test error $0.30$. Is this high bias or high variance, and does adding more training data help most?</p>`,
      steps:[
        {do:`Low training error but high test error is a large generalization gap: high variance (overfitting).`, why:`The model fits training noise it cannot reproduce on new data.`},
        {do:`More training data most helps high variance.`, why:`Extra data constrains the flexible model and shrinks the gap.`}
      ],
      answer:`High variance; more training data helps most` },

    { q:`<p>A model has training error $0.28$ and test error $0.30$. Is this high bias or high variance, and does adding more data help?</p>`,
      steps:[
        {do:`Both errors are high and close together: high bias (underfitting).`, why:`The model is too simple to capture the pattern, so it errs even on training data.`},
        {do:`More data will NOT help much; a richer model (more features) is needed.`, why:`You cannot fix underfitting by adding examples to a too-weak model.`}
      ],
      answer:`High bias; more data does not help — use a richer model` },

    { q:`<p>You have $m = 1000$ examples. You use a $70/15/15$ train/validation/test split. How many examples are in each set?</p>`,
      steps:[
        {do:`Train $= 0.70 \\times 1000 = 700$.`, why:`The training set fits the model parameters.`},
        {do:`Validation $= 0.15 \\times 1000 = 150$; test $= 0.15 \\times 1000 = 150$.`, why:`Validation tunes hyperparameters; test gives the final unbiased estimate.`}
      ],
      answer:`Train $700$, validation $150$, test $150$` },

    { q:`<p>Two features measured on very different scales: $x_1 \\in [0, 1]$ and $x_2 \\in [0, 10000]$. Standardizing uses $x' = \\frac{x - \\mu}{\\sigma}$. For $x_2 = 7000$ with $\\mu_2 = 5000$, $\\sigma_2 = 2000$, find the standardized value.</p>`,
      steps:[
        {do:`$x' = \\frac{7000 - 5000}{2000} = \\frac{2000}{2000}$.`, why:`Subtract the mean, divide by the standard deviation.`},
        {do:`$= 1$.`, why:`The value sits one standard deviation above the mean; scaling lets both features matter equally.`}
      ],
      answer:`$x' = 1$` },

    { q:`<p>A rule $h_\\theta(x) = \\theta_1 x_1 + \\theta_2 x_2 + \\theta_3 x_3$ with $\\theta = (2, -1, 3)$ must predict for the data row $x = (5, 4, 1)$. Find the prediction.</p>`,
      steps:[
        {do:`Multiply pairwise: $2{\\cdot}5 = 10$, $-1{\\cdot}4 = -4$, $3{\\cdot}1 = 3$.`, why:`Each feature contributes weight times value.`},
        {do:`Add: $10 - 4 + 3 = 9$.`, why:`The hypothesis is the sum of weighted features.`}
      ],
      answer:`$h_\\theta(x) = 9$` },

    { q:`<p>A classifier predicts on $50$ test examples and gets $41$ correct. Report accuracy as a percentage and the error rate.</p>`,
      steps:[
        {do:`Accuracy $= 41/50 = 0.82 = 82\\%$.`, why:`Accuracy is the fraction of correct predictions.`},
        {do:`Error rate $= 1 - 0.82 = 0.18 = 18\\%$.`, why:`The error rate is the complement of accuracy.`}
      ],
      answer:`Accuracy $82\\%$, error rate $18\\%$` },

    { q:`<p>$k$-NN with $k = 3$. A query's three nearest neighbors have labels $A, B, A$. What is the predicted class, and why use odd $k$ for two classes?</p>`,
      steps:[
        {do:`Vote: $A$ appears twice, $B$ once, so predict $A$.`, why:`$k$-NN takes a majority vote over the $k$ closest points.`},
        {do:`Odd $k$ avoids ties in a two-class vote.`, why:`An even $k$ could split $k/2$ vs $k/2$ with no winner.`}
      ],
      answer:`Predict $A$; odd $k$ prevents two-class ties` },

    { q:`<p>A degree-9 polynomial is fit to $10$ training points and passes through every one (zero training error) but oscillates wildly between them. Name the failure and one fix.</p>`,
      steps:[
        {do:`Zero training error with wild between-point behavior is overfitting.`, why:`A degree-9 polynomial has enough freedom to interpolate $10$ points exactly, capturing noise.`},
        {do:`A fix: lower the degree or add regularization (penalize large weights).`, why:`Both reduce model flexibility so it tracks the signal, not the noise.`}
      ],
      answer:`Overfitting; fix by lowering degree or adding regularization` },

    { q:`<p>A spam dataset is imbalanced: $95\\%$ not-spam, $5\\%$ spam. A model that always predicts "not-spam" gets what accuracy, and why is accuracy misleading here?</p>`,
      steps:[
        {do:`Always predicting the majority class is right on $95\\%$ of examples, so accuracy $= 95\\%$.`, why:`The trivial classifier inherits the majority-class frequency.`},
        {do:`It catches zero spam, so accuracy hides total failure on the rare class.`, why:`With imbalance, use precision/recall or F1 instead of raw accuracy.`}
      ],
      answer:`$95\\%$ accuracy yet catches no spam — accuracy hides minority-class failure` },

    { q:`<p>Cross-validation: $5$-fold CV on $200$ examples. How many examples train and validate per fold, and how many models are trained total?</p>`,
      steps:[
        {do:`Each fold holds out $200/5 = 40$ for validation and trains on the other $160$.`, why:`$k$-fold CV rotates which fold is held out.`},
        {do:`One model per fold, so $5$ models are trained.`, why:`The validation scores are averaged across the $5$ folds.`}
      ],
      answer:`$160$ train / $40$ validate per fold; $5$ models total` }
  ]);

  /* ----------------------------------------------------------------
     ml-loss: harder — weighted/asymmetric loss, log-cosh, quantile
     (pinball) loss, focal loss intuition, MSE on multi-output,
     epsilon-insensitive loss, KL term.
  ---------------------------------------------------------------- */
  add("ml-loss", [
    { q:`<p>Weighted squared loss $L = \\frac{w}{2}(y - z)^2$ gives twice the weight to one example ($w = 2$). With $y = 6$, $z = 2$, find $L$.</p>`,
      steps:[
        {do:`Gap $y - z = 6 - 2 = 4$; squared $= 16$.`, why:`Start from the ordinary squared error.`},
        {do:`$L = \\frac{2}{2}\\times 16 = 16$.`, why:`The weight $w = 2$ scales the loss, emphasizing this example.`}
      ],
      answer:`$L = 16$` },

    { q:`<p>Quantile (pinball) loss for quantile $\\tau$ is $\\tau\\,r$ if $r = y - z \\ge 0$, else $(\\tau - 1)\\,r$. With $\\tau = 0.9$ and residual $r = -2$ (over-prediction), find the loss.</p>`,
      steps:[
        {do:`$r = -2 < 0$, so use $(\\tau - 1)r = (0.9 - 1)(-2)$.`, why:`The negative branch handles over-predictions.`},
        {do:`$= (-0.1)(-2) = 0.2$.`, why:`At $\\tau = 0.9$ over-prediction is penalized lightly; under-prediction would cost $0.9$ per unit.`}
      ],
      answer:`$L = 0.2$` },

    { q:`<p>Same pinball loss, $\\tau = 0.9$, but now under-prediction: residual $r = +2$. Find the loss and compare to the over-prediction case ($0.2$).</p>`,
      steps:[
        {do:`$r = 2 \\ge 0$, so use $\\tau r = 0.9 \\times 2 = 1.8$.`, why:`The positive branch penalizes under-prediction at the high quantile.`},
        {do:`$1.8 > 0.2$, so under-prediction costs $9\\times$ more.`, why:`A high $\\tau$ pushes predictions upward to avoid under-shooting.`}
      ],
      answer:`$L = 1.8$ (vs $0.2$) — asymmetric: under-prediction is far costlier` },

    { q:`<p>Epsilon-insensitive loss (used in SVR) is $\\max(0,\\ |y - z| - \\epsilon)$. With $\\epsilon = 0.5$, $y = 5$, $z = 5.3$, find the loss.</p>`,
      steps:[
        {do:`$|y - z| = |5 - 5.3| = 0.3$.`, why:`Measure the absolute error first.`},
        {do:`$\\max(0,\\ 0.3 - 0.5) = \\max(0, -0.2) = 0$.`, why:`Errors within the $\\epsilon$-tube are not penalized at all.`}
      ],
      answer:`$L = 0$ (inside the $\\epsilon = 0.5$ tube)` },

    { q:`<p>Multi-output squared loss sums over outputs: $L = \\frac{1}{2}\\sum_k (y_k - z_k)^2$. With targets $y = (3, 1)$ and predictions $z = (1, 2)$, find $L$.</p>`,
      steps:[
        {do:`Per-output gaps: $3 - 1 = 2$ and $1 - 2 = -1$; squares $4$ and $1$.`, why:`Treat each output dimension separately.`},
        {do:`$L = \\frac{1}{2}(4 + 1) = \\frac{5}{2} = 2.5$.`, why:`Sum the squared errors across outputs, then halve.`}
      ],
      answer:`$L = 2.5$` },

    { q:`<p>Focal loss down-weights easy examples: $L = -(1 - p)^\\gamma \\log p$ for a true positive. Compare the focal weight $(1 - p)^\\gamma$ at $\\gamma = 2$ for an easy example $p = 0.9$ versus a hard one $p = 0.5$.</p>`,
      steps:[
        {do:`Easy: $(1 - 0.9)^2 = 0.1^2 = 0.01$.`, why:`A confident correct prediction gets a tiny weight.`},
        {do:`Hard: $(1 - 0.5)^2 = 0.5^2 = 0.25$.`, why:`The uncertain example keeps a $25\\times$ larger weight, focusing training on it.`}
      ],
      answer:`Weights $0.01$ (easy) vs $0.25$ (hard) — focal loss emphasizes hard examples` },

    { q:`<p>Log-cosh loss is $L = \\log(\\cosh(r))$ with $r = y - z$, where $\\cosh(r) = \\frac{e^r + e^{-r}}{2}$. For $r = 0$, find $L$ and explain why log-cosh behaves like squared loss near $0$.</p>`,
      steps:[
        {do:`$\\cosh(0) = \\frac{1 + 1}{2} = 1$, so $L = \\log 1 = 0$.`, why:`A perfect prediction has zero loss.`},
        {do:`For small $r$, $\\cosh r \\approx 1 + \\frac{r^2}{2}$ and $\\log(1 + \\frac{r^2}{2}) \\approx \\frac{r^2}{2}$.`, why:`Near zero it matches squared loss but stays linear for large $r$, resisting outliers.`}
      ],
      answer:`$L = 0$; near $r = 0$ log-cosh $\\approx \\tfrac12 r^2$ (squared-loss-like)` },

    { q:`<p>Binary cross-entropy gradient with respect to probability $p$ is $\\frac{\\partial L}{\\partial p} = \\frac{p - y}{p(1 - p)}$. With $y = 1$ and $p = 0.8$, find it (3 dp).</p>`,
      steps:[
        {do:`Numerator $p - y = 0.8 - 1 = -0.2$; denominator $p(1-p) = 0.8 \\times 0.2 = 0.16$.`, why:`Plug into the gradient formula.`},
        {do:`$\\frac{-0.2}{0.16} = -1.25$.`, why:`Negative: increasing $p$ toward the true $1$ lowers the loss.`}
      ],
      answer:`$\\frac{\\partial L}{\\partial p} = -1.25$` },

    { q:`<p>Hinge loss with a margin and regularization: total $= \\max(0, 1 - y z) + \\frac{\\lambda}{2}\\lVert w \\rVert^2$. With $y = 1$, $z = 0.6$, $\\lambda = 0.1$, $\\lVert w \\rVert^2 = 4$, find the total loss.</p>`,
      steps:[
        {do:`Hinge part: $\\max(0,\\ 1 - 1{\\cdot}0.6) = \\max(0, 0.4) = 0.4$.`, why:`The point is inside the margin, so it is penalized.`},
        {do:`Reg part: $\\frac{0.1}{2}\\times 4 = 0.2$. Total $= 0.4 + 0.2 = 0.6$.`, why:`Add the margin penalty and the weight penalty.`}
      ],
      answer:`Total loss $= 0.6$` },

    { q:`<p>KL divergence between two distributions $\\mathrm{KL}(p \\Vert q) = \\sum_i p_i \\log\\frac{p_i}{q_i}$. With $p = (1, 0)$ and $q = (0.8, 0.2)$, find it (use $\\log 1.25 \\approx 0.223$, $0\\log 0 = 0$).</p>`,
      steps:[
        {do:`Term 1: $1 \\cdot \\log\\frac{1}{0.8} = \\log 1.25 \\approx 0.223$.`, why:`The first component carries all the mass of $p$.`},
        {do:`Term 2: $0 \\cdot \\log\\frac{0}{0.2} = 0$ (by convention). Total $\\approx 0.223$.`, why:`A zero $p_i$ contributes nothing; this equals the cross-entropy for a one-hot target.`}
      ],
      answer:`$\\mathrm{KL}(p\\Vert q) \\approx 0.223$` },

    { q:`<p>Cross-entropy with label smoothing replaces the hard target $1$ with $1 - \\epsilon$ and spreads $\\epsilon$ over the other class. For two classes, $\\epsilon = 0.1$, the smoothed target for the true class is what value?</p>`,
      steps:[
        {do:`True-class target $= 1 - \\epsilon = 1 - 0.1 = 0.9$.`, why:`Label smoothing keeps most mass on the true class.`},
        {do:`The other class gets $\\epsilon = 0.1$ (here the lone other class).`, why:`Soft targets discourage over-confident predictions and improve calibration.`}
      ],
      answer:`True-class target $= 0.9$ (other class $0.1$)` }
  ]);

  /* ----------------------------------------------------------------
     ml-cost: harder — L1 vs L2 penalty, normalized cost, weighted
     examples, logistic cost (cross-entropy averaged), bias-only
     optimum, cost surface curvature.
  ---------------------------------------------------------------- */
  add("ml-cost", [
    { q:`<p>L2-regularized cost $J = \\frac{1}{2m}\\sum (h - y)^2 + \\frac{\\lambda}{2m}\\sum_j \\theta_j^2$. Data cost $= 1.2$, $\\lambda = 4$, $\\theta = (3, -1)$ (penalize both), $m = 4$. Find $J$.</p>`,
      steps:[
        {do:`Weight norm: $\\sum_j \\theta_j^2 = 3^2 + (-1)^2 = 9 + 1 = 10$.`, why:`L2 sums the squared weights.`},
        {do:`Penalty $= \\frac{4}{2{\\cdot}4}\\times 10 = \\frac{4}{8}\\times 10 = 5$. Total $J = 1.2 + 5 = 6.2$.`, why:`Add data cost and the L2 penalty.`}
      ],
      answer:`$J = 6.2$` },

    { q:`<p>L1-regularized cost adds $\\frac{\\lambda}{m}\\sum_j |\\theta_j|$. With data cost $= 0.5$, $\\lambda = 2$, $\\theta = (3, -1, 0)$, $m = 2$, find the total $J$.</p>`,
      steps:[
        {do:`$\\sum_j |\\theta_j| = |3| + |{-1}| + |0| = 4$.`, why:`L1 sums the absolute values of the weights.`},
        {do:`Penalty $= \\frac{2}{2}\\times 4 = 4$. Total $J = 0.5 + 4 = 4.5$.`, why:`L1 encourages sparsity by penalizing magnitude linearly.`}
      ],
      answer:`$J = 4.5$` },

    { q:`<p>Logistic (cross-entropy) cost is $J = -\\frac{1}{m}\\sum [y\\log p + (1-y)\\log(1-p)]$. Two examples: $(y, p) = (1, 0.9)$ and $(0, 0.2)$. Find $J$ (use $\\log 0.9 \\approx -0.105$, $\\log 0.8 \\approx -0.223$, 3 dp).</p>`,
      steps:[
        {do:`Example 1 ($y=1$): $-\\log 0.9 \\approx 0.105$. Example 2 ($y=0$): $-\\log(1-0.2) = -\\log 0.8 \\approx 0.223$.`, why:`Each term keeps only the part matching its label.`},
        {do:`$J = \\frac{1}{2}(0.105 + 0.223) = \\frac{0.328}{2} \\approx 0.164$.`, why:`Average the per-example losses over $m = 2$.`}
      ],
      answer:`$J \\approx 0.164$` },

    { q:`<p>Weighted cost $J = \\frac{1}{\\sum w_i}\\sum_i w_i L_i$. Losses $L = (2, 8)$ with weights $w = (3, 1)$. Find the weighted average cost.</p>`,
      steps:[
        {do:`Weighted sum $= 3{\\cdot}2 + 1{\\cdot}8 = 6 + 8 = 14$; total weight $= 3 + 1 = 4$.`, why:`Each loss counts in proportion to its weight.`},
        {do:`$J = 14/4 = 3.5$.`, why:`Divide by the total weight, not the count.`}
      ],
      answer:`$J = 3.5$` },

    { q:`<p>For a bias-only model $h = b$ on data $y = (2, 6, 10)$, the cost $J(b) = \\frac{1}{2m}\\sum (b - y)^2$ is minimized at the mean. Find the optimal $b$ and the minimum cost ($m = 3$).</p>`,
      steps:[
        {do:`Optimal $b = \\bar y = (2 + 6 + 10)/3 = 6$.`, why:`A constant predictor's best value is the mean of the targets.`},
        {do:`Residuals at $b = 6$: $-4, 0, 4$; squares $16, 0, 16$. $J = \\frac{1}{6}(32) \\approx 5.333$.`, why:`Plug the mean back into the cost.`}
      ],
      answer:`$b = 6$, $J \\approx 5.333$` },

    { q:`<p>The cost $J(\\theta) = 3\\theta^2 - 12\\theta + 20$ is a parabola. Find the $\\theta$ that minimizes it (set $J'(\\theta) = 0$) and the minimum value.</p>`,
      steps:[
        {do:`$J'(\\theta) = 6\\theta - 12 = 0 \\Rightarrow \\theta = 2$.`, why:`The minimum of an upward parabola is where its derivative is zero.`},
        {do:`$J(2) = 3{\\cdot}4 - 12{\\cdot}2 + 20 = 12 - 24 + 20 = 8$.`, why:`Evaluate the cost at the optimum.`}
      ],
      answer:`$\\theta = 2$, minimum $J = 8$` },

    { q:`<p>Elastic net mixes L1 and L2: penalty $= \\lambda[\\alpha \\sum|\\theta_j| + (1-\\alpha)\\sum \\theta_j^2]$. With $\\lambda = 1$, $\\alpha = 0.5$, $\\theta = (2, -2)$, find the penalty.</p>`,
      steps:[
        {do:`L1 part: $\\sum|\\theta_j| = 2 + 2 = 4$. L2 part: $\\sum \\theta_j^2 = 4 + 4 = 8$.`, why:`Compute each norm separately.`},
        {do:`Penalty $= 1[0.5{\\cdot}4 + 0.5{\\cdot}8] = 2 + 4 = 6$.`, why:`Mix the two penalties with weight $\\alpha$.`}
      ],
      answer:`Penalty $= 6$` },

    { q:`<p>A regularized cost $J(\\theta) = (\\theta - 5)^2 + \\lambda \\theta^2$ has minimum at $\\theta^* = \\frac{5}{1 + \\lambda}$. Find $\\theta^*$ for $\\lambda = 0$, $\\lambda = 1$, and $\\lambda = 4$.</p>`,
      steps:[
        {do:`$\\lambda = 0$: $\\theta^* = 5/1 = 5$ (unregularized).`, why:`No penalty leaves the data optimum untouched.`},
        {do:`$\\lambda = 1$: $5/2 = 2.5$; $\\lambda = 4$: $5/5 = 1$.`, why:`Stronger regularization shrinks the estimate toward $0$.`}
      ],
      answer:`$\\theta^* = 5,\\ 2.5,\\ 1$ for $\\lambda = 0, 1, 4$` },

    { q:`<p>Convexity check: is $J(\\theta) = \\theta^4 - 4\\theta^2$ convex everywhere? Its second derivative is $12\\theta^2 - 8$. Evaluate at $\\theta = 0$ and state convexity there.</p>`,
      steps:[
        {do:`$J''(0) = 12{\\cdot}0 - 8 = -8 < 0$.`, why:`A negative second derivative means the curve bends downward.`},
        {do:`So $J$ is NOT convex at $\\theta = 0$; it has multiple minima.`, why:`Non-convex costs can trap gradient descent in local minima.`}
      ],
      answer:`Not convex ($J''(0) = -8 < 0$); it has local minima` },

    { q:`<p>Normalizing the cost: a sum-of-squares cost is $J_{\\text{sum}} = 240$ over $m = 60$ examples. Convert to mean squared cost $\\frac{1}{m}\\sum$ and to the $\\frac{1}{2m}\\sum$ convention.</p>`,
      steps:[
        {do:`Mean: $J_{\\text{sum}}/m = 240/60 = 4$.`, why:`Divide the sum by the number of examples.`},
        {do:`Half-mean: $\\frac{1}{2m}\\sum = 240/120 = 2$.`, why:`The $\\tfrac12$ convention halves it again to simplify gradients.`}
      ],
      answer:`Mean $= 4$; $\\frac{1}{2m}$ convention $= 2$` },

    { q:`<p>The optimal $\\theta$ does not move if you scale the whole cost by a positive constant. If $J_1(\\theta)$ is minimized at $\\theta = 3$, where is $J_2 = 10\\,J_1$ minimized, and does the minimum VALUE change?</p>`,
      steps:[
        {do:`Scaling by $10 > 0$ keeps the same minimizing $\\theta = 3$.`, why:`A positive scale preserves the location of the minimum.`},
        {do:`The minimum value is multiplied by $10$.`, why:`Only the height changes, not where the bottom sits — so a learning rate may need rescaling.`}
      ],
      answer:`Still $\\theta = 3$; the minimum value is $10\\times$ larger` }
  ]);

  /* ----------------------------------------------------------------
     ml-gradient-descent: harder — GD on non-quadratics, momentum,
     condition number, exact line search, normalized GD, sign of
     update, learning-rate decay, Newton step, clipping, Adagrad.
  ---------------------------------------------------------------- */
  add("ml-gradient-descent", [
    { q:`<p>Minimize $J(\\theta) = \\theta^4$, gradient $4\\theta^3$. From $\\theta_0 = 1$, $\\alpha = 0.1$, do one step.</p>`,
      steps:[
        {do:`Gradient at $\\theta = 1$: $4{\\cdot}1^3 = 4$.`, why:`The slope of a quartic grows with the cube of $\\theta$.`},
        {do:`$\\theta = 1 - 0.1{\\cdot}4 = 0.6$.`, why:`Step downhill; the flat bottom near $0$ makes later steps shrink fast.`}
      ],
      answer:`$\\theta = 0.6$` },

    { q:`<p>Momentum update: $v \\leftarrow \\beta v - \\alpha g$, then $\\theta \\leftarrow \\theta + v$. With $\\beta = 0.9$, previous $v = -1$, gradient $g = 2$, $\\alpha = 0.1$, $\\theta = 5$, find the new $v$ and $\\theta$.</p>`,
      steps:[
        {do:`$v = 0.9(-1) - 0.1(2) = -0.9 - 0.2 = -1.1$.`, why:`Momentum blends the past velocity with the new gradient.`},
        {do:`$\\theta = 5 + (-1.1) = 3.9$.`, why:`Accumulated velocity lets the update overshoot a plain gradient step, speeding descent.`}
      ],
      answer:`$v = -1.1$, $\\theta = 3.9$` },

    { q:`<p>For $J(\\theta) = \\frac{c}{2}\\theta^2$ (gradient $c\\theta$), the largest stable learning rate is $\\alpha < \\frac{2}{c}$. For $c = 8$, give the stability bound and check $\\alpha = 0.3$.</p>`,
      steps:[
        {do:`Bound: $\\alpha < 2/8 = 0.25$.`, why:`Beyond this the update factor $|1 - \\alpha c|$ exceeds $1$ and diverges.`},
        {do:`$0.3 > 0.25$, so $\\alpha = 0.3$ diverges.`, why:`The step overshoots and the iterates grow without bound.`}
      ],
      answer:`Stable for $\\alpha < 0.25$; $\\alpha = 0.3$ diverges` },

    { q:`<p>Exact line search on $J(\\theta) = \\frac{1}{2}\\theta^2$ from $\\theta_0 = 4$: choose $\\alpha$ to minimize $J(\\theta_0 - \\alpha g)$ along the gradient. The optimal $\\alpha$ here is $1$. Verify the step lands at $0$.</p>`,
      steps:[
        {do:`Gradient $g = \\theta_0 = 4$. Step: $\\theta = 4 - \\alpha{\\cdot}4$.`, why:`$\\nabla J = \\theta$ for this cost.`},
        {do:`With $\\alpha = 1$: $\\theta = 4 - 4 = 0$, the exact minimum.`, why:`For a simple quadratic, exact line search reaches the bottom in one step.`}
      ],
      answer:`$\\theta = 0$ (one exact-line-search step)` },

    { q:`<p>A condition number $\\kappa = \\frac{\\lambda_{\\max}}{\\lambda_{\\min}}$ governs GD speed. A cost has curvatures $\\lambda_{\\max} = 100$, $\\lambda_{\\min} = 4$. Find $\\kappa$ and state whether convergence is fast or slow.</p>`,
      steps:[
        {do:`$\\kappa = 100/4 = 25$.`, why:`The ratio of largest to smallest curvature.`},
        {do:`$\\kappa = 25 \\gg 1$, so convergence is slow (zig-zagging).`, why:`Ill-conditioned bowls force a tiny shared step size.`}
      ],
      answer:`$\\kappa = 25$; large, so convergence is slow` },

    { q:`<p>Newton's method steps $\\theta \\leftarrow \\theta - \\frac{J'(\\theta)}{J''(\\theta)}$. For $J(\\theta) = \\theta^2 - 6\\theta + 5$ ($J' = 2\\theta - 6$, $J'' = 2$) from $\\theta_0 = 0$, do one step.</p>`,
      steps:[
        {do:`$J'(0) = -6$, $J''(0) = 2$.`, why:`Compute the first and second derivatives at the current point.`},
        {do:`$\\theta = 0 - \\frac{-6}{2} = 0 + 3 = 3$.`, why:`Newton reaches the minimum of a quadratic in one step ($\\theta^* = 3$).`}
      ],
      answer:`$\\theta = 3$ (the exact minimum)` },

    { q:`<p>Learning-rate decay: $\\alpha_t = \\frac{\\alpha_0}{1 + k t}$ with $\\alpha_0 = 0.2$, $k = 1$. Find the learning rate at steps $t = 0, 1, 3$.</p>`,
      steps:[
        {do:`$t = 0$: $\\alpha = 0.2/(1 + 0) = 0.2$.`, why:`Start at the full rate.`},
        {do:`$t = 1$: $0.2/2 = 0.1$; $t = 3$: $0.2/4 = 0.05$.`, why:`Decaying $\\alpha$ takes big early steps then fine ones to settle.`}
      ],
      answer:`$\\alpha = 0.2,\\ 0.1,\\ 0.05$` },

    { q:`<p>Sign descent normalizes the gradient to $\\pm 1$ per coordinate: $\\theta \\leftarrow \\theta - \\alpha\\,\\text{sign}(g)$. With $g = (5, -0.1)$, $\\alpha = 0.1$, $\\theta = (2, 2)$, do one step.</p>`,
      steps:[
        {do:`$\\text{sign}(g) = (+1, -1)$.`, why:`Only the direction of each gradient component is used.`},
        {do:`$\\theta = (2, 2) - 0.1(1, -1) = (1.9,\\ 2.1)$.`, why:`Both coordinates move the same distance regardless of gradient magnitude.`}
      ],
      answer:`$\\theta = (1.9,\\ 2.1)$` },

    { q:`<p>Mini-batch GD with batch size $b = 32$ on $m = 6400$ examples. How many gradient steps make up one full epoch?</p>`,
      steps:[
        {do:`Steps per epoch $= m / b = 6400 / 32$.`, why:`Each step consumes one batch; an epoch is one full pass.`},
        {do:`$= 200$.`, why:`The dataset is split into $200$ mini-batches.`}
      ],
      answer:`$200$ steps per epoch` },

    { q:`<p>GD on a non-convex $J(\\theta) = \\theta^4 - 4\\theta^2$ ($J' = 4\\theta^3 - 8\\theta$). From $\\theta_0 = 0.5$, $\\alpha = 0.1$, do one step and say which minimum it heads toward (minima at $\\theta = \\pm\\sqrt{2}$).</p>`,
      steps:[
        {do:`$J'(0.5) = 4(0.125) - 8(0.5) = 0.5 - 4 = -3.5$.`, why:`Evaluate the gradient at the start.`},
        {do:`$\\theta = 0.5 - 0.1(-3.5) = 0.5 + 0.35 = 0.85$.`, why:`A negative gradient pushes $\\theta$ rightward, toward the positive minimum $+\\sqrt 2 \\approx 1.414$.`}
      ],
      answer:`$\\theta = 0.85$, heading to $+\\sqrt 2$` },

    { q:`<p>Gradient clipping caps the gradient norm at a threshold $c = 5$. A gradient $g = (6, 8)$ has norm $\\lVert g \\rVert = 10$. Find the clipped gradient $g \\cdot \\frac{c}{\\lVert g \\rVert}$.</p>`,
      steps:[
        {do:`Scale factor $= c/\\lVert g \\rVert = 5/10 = 0.5$.`, why:`Clipping rescales the gradient to have norm exactly $c$.`},
        {do:`Clipped $g = 0.5(6, 8) = (3, 4)$, with norm $\\sqrt{9 + 16} = 5$.`, why:`This prevents exploding-gradient blowups while keeping direction.`}
      ],
      answer:`Clipped gradient $= (3, 4)$ (norm $5$)` },

    { q:`<p>Adagrad scales the step by accumulated squared gradients: $\\theta \\leftarrow \\theta - \\frac{\\alpha}{\\sqrt{G} + \\epsilon} g$. With $\\alpha = 0.1$, accumulated $G = 16$, $\\epsilon \\approx 0$, gradient $g = 2$, $\\theta = 1$, do one step.</p>`,
      steps:[
        {do:`Effective rate $= \\frac{0.1}{\\sqrt{16}} = \\frac{0.1}{4} = 0.025$.`, why:`Frequently-updated parameters get smaller effective steps.`},
        {do:`$\\theta = 1 - 0.025{\\cdot}2 = 1 - 0.05 = 0.95$.`, why:`Adagrad adapts the rate per coordinate from its gradient history.`}
      ],
      answer:`$\\theta = 0.95$` }
  ]);

  /* ----------------------------------------------------------------
     ml-linear-regression: harder — weighted least squares, R^2,
     gradient-equals-zero derivation, multicollinearity, prediction
     intervals via residual variance, polynomial design matrix,
     centered solution, hat matrix, ridge shrinkage.
  ---------------------------------------------------------------- */
  add("ml-linear-regression", [
    { q:`<p>$R^2 = 1 - \\frac{SS_{res}}{SS_{tot}}$. A fit has residual sum of squares $SS_{res} = 8$ and total sum of squares $SS_{tot} = 40$. Find $R^2$ and interpret.</p>`,
      steps:[
        {do:`$R^2 = 1 - 8/40 = 1 - 0.2 = 0.8$.`, why:`$R^2$ is the fraction of variance the model explains.`},
        {do:`The model explains $80\\%$ of the variance in $y$.`, why:`Closer to $1$ means a better fit.`}
      ],
      answer:`$R^2 = 0.8$ (explains $80\\%$ of variance)` },

    { q:`<p>Weighted least squares solves $\\theta = (X^\\top W X)^{-1} X^\\top W y$. For one feature, $X^\\top W X = 20$ and $X^\\top W y = 60$. Find $\\theta$.</p>`,
      steps:[
        {do:`$\\theta = (20)^{-1}\\times 60 = 60/20$.`, why:`The scalar weighted normal equation is a ratio.`},
        {do:`$= 3$.`, why:`Weighting lets some examples count more, but the solve is the same shape.`}
      ],
      answer:`$\\theta = 3$` },

    { q:`<p>The normal equations come from setting the cost gradient to zero. For $J(\\theta) = \\frac{1}{2}\\lVert X\\theta - y \\rVert^2$, the gradient is $X^\\top(X\\theta - y)$. Set it to $0$ and solve for $\\theta$ symbolically.</p>`,
      steps:[
        {do:`$X^\\top(X\\theta - y) = 0 \\Rightarrow X^\\top X\\theta = X^\\top y$.`, why:`Distribute and move the $y$ term to the right.`},
        {do:`$\\theta = (X^\\top X)^{-1} X^\\top y$.`, why:`Left-multiply by the inverse of $X^\\top X$.`}
      ],
      answer:`$\\theta = (X^\\top X)^{-1} X^\\top y$` },

    { q:`<p>Fit $y = \\theta_0 + \\theta_1 x$ to $(0, 1), (1, 3), (2, 5), (3, 7)$. The points lie exactly on a line. Find $\\theta_0, \\theta_1$ by inspection and confirm the residuals are zero.</p>`,
      steps:[
        {do:`Slope: consecutive $y$ rise by $2$ as $x$ rises by $1$, so $\\theta_1 = 2$. At $x = 0$, $y = 1$, so $\\theta_0 = 1$.`, why:`Equal spacing reveals the exact line.`},
        {do:`Check $x = 3$: $1 + 2{\\cdot}3 = 7 = y$, residual $0$ everywhere.`, why:`A perfect linear fit has zero residual sum of squares.`}
      ],
      answer:`$\\theta_0 = 1,\\ \\theta_1 = 2$ (all residuals zero)` },

    { q:`<p>A polynomial fit uses design columns $[1, x, x^2]$. For $x = (1, 2)$, write the two rows of the design matrix $X$.</p>`,
      steps:[
        {do:`Row for $x = 1$: $[1,\\ 1,\\ 1^2] = [1, 1, 1]$.`, why:`Each column is bias, $x$, then $x^2$.`},
        {do:`Row for $x = 2$: $[1,\\ 2,\\ 2^2] = [1, 2, 4]$.`, why:`Polynomial regression is linear in these expanded features.`}
      ],
      answer:`$X = \\begin{bmatrix}1&1&1\\\\1&2&4\\end{bmatrix}$` },

    { q:`<p>Residual variance estimate is $\\hat\\sigma^2 = \\frac{SS_{res}}{m - p}$ ($p$ = number of fitted parameters). With $SS_{res} = 18$, $m = 8$ examples, $p = 2$, find $\\hat\\sigma^2$.</p>`,
      steps:[
        {do:`Degrees of freedom $= m - p = 8 - 2 = 6$.`, why:`Fitting $p$ parameters uses up $p$ degrees of freedom.`},
        {do:`$\\hat\\sigma^2 = 18/6 = 3$.`, why:`This unbiased estimate underlies prediction intervals.`}
      ],
      answer:`$\\hat\\sigma^2 = 3$` },

    { q:`<p>Two perfectly correlated features $x_2 = 2 x_1$ cause multicollinearity. If $\\theta = (1, 0)$ on $(x_1, x_2)$, give another $\\theta$ with the same prediction at $x_1 = 3$ (so $x_2 = 6$), showing $\\theta$ is not unique.</p>`,
      steps:[
        {do:`Prediction with $\\theta = (1, 0)$: $1{\\cdot}3 + 0{\\cdot}6 = 3$.`, why:`Here $x_2 = 2x_1 = 6$.`},
        {do:`$\\theta = (-1, 1)$ gives $-1{\\cdot}3 + 1{\\cdot}6 = 3$ — identical.`, why:`Collinear features let weights trade off freely, so no unique solution exists.`}
      ],
      answer:`$\\theta = (-1, 1)$ predicts the same; collinearity makes $\\theta$ non-unique` },

    { q:`<p>Centering $x$ at its mean decouples slope and intercept. For data with $\\bar x = 4$, the centered slope solves $\\theta_1 = \\frac{\\sum (x - \\bar x) y}{\\sum (x - \\bar x)^2}$. With numerator $30$ and denominator $12$, find $\\theta_1$.</p>`,
      steps:[
        {do:`$\\theta_1 = 30/12 = 2.5$.`, why:`The slope is covariance over variance of the centered $x$.`},
        {do:`After centering, $\\theta_0 = \\bar y$ separately.`, why:`Centering makes the two normal-equation rows independent.`}
      ],
      answer:`$\\theta_1 = 2.5$` },

    { q:`<p>Ridge solution for one feature is $\\theta = \\frac{X^\\top y}{X^\\top X + \\lambda}$. With $X^\\top X = 4$, $X^\\top y = 12$, trace the shrinkage: find $\\theta$ at $\\lambda = 0, 4, 12$.</p>`,
      steps:[
        {do:`$\\lambda = 0$: $12/4 = 3$.`, why:`No regularization recovers ordinary least squares.`},
        {do:`$\\lambda = 4$: $12/8 = 1.5$; $\\lambda = 12$: $12/16 = 0.75$.`, why:`Larger $\\lambda$ shrinks $\\theta$ steadily toward $0$.`}
      ],
      answer:`$\\theta = 3,\\ 1.5,\\ 0.75$ for $\\lambda = 0, 4, 12$` },

    { q:`<p>The hat matrix $H = X(X^\\top X)^{-1}X^\\top$ gives fitted values $\\hat y = H y$. For a single feature with $X^\\top X = 14$, $X = (1, 2, 3)^\\top$, find the $(1,1)$ entry $H_{11} = x_1 (X^\\top X)^{-1} x_1$ (3 dp).</p>`,
      steps:[
        {do:`$H_{11} = 1 \\cdot \\frac{1}{14} \\cdot 1 = \\frac{1}{14}$.`, why:`For one feature, $H_{ii} = x_i^2 / (X^\\top X)$.`},
        {do:`$\\approx 0.071$.`, why:`This leverage value measures how much point $1$ influences its own fit.`}
      ],
      answer:`$H_{11} = 1/14 \\approx 0.071$` },

    { q:`<p>Predict and find total squared error for $\\theta = (1, 2)$ (intercept, slope) on $(x, y) = (1, 4), (2, 5)$. Use $h = \\theta_0 + \\theta_1 x$.</p>`,
      steps:[
        {do:`Predictions: $h(1) = 1 + 2 = 3$, $h(2) = 1 + 4 = 5$.`, why:`Apply the affine model to each input.`},
        {do:`Residuals: $4 - 3 = 1$, $5 - 5 = 0$. Total squared error $= 1^2 + 0^2 = 1$.`, why:`Sum the squared residuals.`}
      ],
      answer:`Predictions $3, 5$; total squared error $= 1$` },

    { q:`<p>Adding a useless feature never increases training $R^2$ but can hurt test performance. If train $R^2$ rises from $0.80$ to $0.81$ after adding a feature while test $R^2$ falls from $0.78$ to $0.70$, what is happening?</p>`,
      steps:[
        {do:`Train $R^2$ rose a hair while test $R^2$ dropped sharply.`, why:`Extra parameters always fit training noise at least as well.`},
        {do:`This is overfitting from the added feature; prefer adjusted $R^2$ or a validation check.`, why:`Test performance, not train fit, is what matters.`}
      ],
      answer:`Overfitting — the new feature fits train noise but worsens test $R^2$` }
  ]);

  /* ----------------------------------------------------------------
     ml-likelihood: harder — MLE for geometric/uniform/categorical/
     binomial, MAP vs MLE, likelihood ratio, Fisher information,
     Laplace median, smoothing, Gaussian-MLE = least squares.
  ---------------------------------------------------------------- */
  add("ml-likelihood", [
    { q:`<p>The MLE of a geometric success probability is $\\hat p = \\frac{1}{\\bar x}$, where $\\bar x$ is the mean number of trials to first success. Trials observed: $2, 4, 6$. Find $\\hat p$.</p>`,
      steps:[
        {do:`Mean $\\bar x = (2 + 4 + 6)/3 = 4$.`, why:`Average the counts to the first success.`},
        {do:`$\\hat p = 1/4 = 0.25$.`, why:`Fewer trials on average implies a higher success probability.`}
      ],
      answer:`$\\hat p = 0.25$` },

    { q:`<p>For a uniform distribution on $[0, \\theta]$, the MLE of $\\theta$ is the largest observed value. Data: $3, 7, 5, 2$. Find $\\hat\\theta$.</p>`,
      steps:[
        {do:`The likelihood is zero unless $\\theta \\ge \\max(x_i)$, and shrinks as $\\theta$ grows.`, why:`Each point must lie inside $[0, \\theta]$, so $\\theta$ can be no smaller than the max.`},
        {do:`$\\hat\\theta = \\max(3, 7, 5, 2) = 7$.`, why:`The smallest feasible $\\theta$ maximizes the likelihood.`}
      ],
      answer:`$\\hat\\theta = 7$` },

    { q:`<p>A categorical MLE sets each class probability to its observed frequency. Counts: A appears $6$, B $3$, C $1$ (total $10$). Find $\\hat p_A, \\hat p_B, \\hat p_C$.</p>`,
      steps:[
        {do:`Total $= 6 + 3 + 1 = 10$.`, why:`Normalize counts to probabilities.`},
        {do:`$\\hat p_A = 6/10 = 0.6$, $\\hat p_B = 0.3$, $\\hat p_C = 0.1$.`, why:`The MLE of a categorical is the empirical distribution.`}
      ],
      answer:`$\\hat p = (0.6,\\ 0.3,\\ 0.1)$` },

    { q:`<p>MAP estimation adds a prior. A Beta$(2, 2)$ prior on a coin gives MAP $\\hat\\theta = \\frac{h + 1}{n + 2}$. With $h = 7$ heads in $n = 10$ flips, find the MAP estimate and compare to the MLE ($0.7$).</p>`,
      steps:[
        {do:`$\\hat\\theta_{MAP} = \\frac{7 + 1}{10 + 2} = \\frac{8}{12} \\approx 0.667$.`, why:`The Beta$(2,2)$ prior adds one pseudo-head and one pseudo-tail.`},
        {do:`$0.667 < 0.7$, so the prior pulls the estimate toward $0.5$.`, why:`MAP regularizes the MLE with prior belief.`}
      ],
      answer:`$\\hat\\theta_{MAP} \\approx 0.667$ (vs MLE $0.7$) — pulled toward $0.5$` },

    { q:`<p>A binomial likelihood for $h = 8$ heads in $n = 10$ is $L(\\theta) = \\binom{10}{8}\\theta^8(1-\\theta)^2$. The binomial coefficient does not affect the maximizer. Find the MLE $\\hat\\theta$.</p>`,
      steps:[
        {do:`The $\\binom{10}{8}$ is a constant in $\\theta$, so maximize $\\theta^8(1-\\theta)^2$.`, why:`Constants do not change where the maximum sits.`},
        {do:`$\\hat\\theta = h/n = 8/10 = 0.8$.`, why:`The binomial MLE is still the observed fraction of successes.`}
      ],
      answer:`$\\hat\\theta = 0.8$` },

    { q:`<p>Likelihood ratio test: model A gives the data log-likelihood $\\ell_A = -12$, model B gives $\\ell_B = -15$. The statistic is $2(\\ell_A - \\ell_B)$. Compute it and say which model fits better.</p>`,
      steps:[
        {do:`$2(\\ell_A - \\ell_B) = 2(-12 - (-15)) = 2(3) = 6$.`, why:`A positive statistic favors model A.`},
        {do:`Model A fits better (higher log-likelihood).`, why:`Less negative log-likelihood means more probable data.`}
      ],
      answer:`Statistic $= 6$; model A fits better` },

    { q:`<p>The Fisher information (curvature) of a Bernoulli is $I(\\theta) = \\frac{n}{\\theta(1-\\theta)}$. With $n = 100$ and $\\hat\\theta = 0.5$, compute $I$, and say where (near $0.5$ or $0/1$) the estimate is most precise.</p>`,
      steps:[
        {do:`$I(0.5) = \\frac{100}{0.5 \\times 0.5} = \\frac{100}{0.25} = 400$.`, why:`Higher information means a sharper likelihood peak.`},
        {do:`Information is LARGEST near $\\theta = 0$ or $1$ (small $\\theta(1-\\theta)$), so estimates are most precise there.`, why:`The denominator shrinks toward the edges.`}
      ],
      answer:`$I(0.5) = 400$; most precise near $\\theta = 0$ or $1$` },

    { q:`<p>A multinomial roll of a die $12$ times gives face counts $(2, 2, 1, 3, 1, 3)$. The MLE for face $4$ is its frequency. Find $\\hat p_4$.</p>`,
      steps:[
        {do:`Face $4$ occurred $3$ times out of $12$ rolls.`, why:`Each face's MLE is its count over the total.`},
        {do:`$\\hat p_4 = 3/12 = 0.25$.`, why:`Simplify the fraction.`}
      ],
      answer:`$\\hat p_4 = 0.25$` },

    { q:`<p>For Gaussian data with unknown mean $\\mu$, the negative log-likelihood (variance $1$) is $\\frac{1}{2}\\sum (x_i - \\mu)^2$ plus a constant — exactly squared-error cost. For data $1, 3, 5$, which $\\mu$ minimizes it, and why does this connect MLE to least squares?</p>`,
      steps:[
        {do:`Minimizing $\\sum (x_i - \\mu)^2$ gives $\\mu = \\bar x = (1+3+5)/3 = 3$.`, why:`The sum of squared deviations is smallest at the mean.`},
        {do:`So Gaussian MLE = least squares.`, why:`Maximizing a Gaussian likelihood is the same as minimizing squared error.`}
      ],
      answer:`$\\hat\\mu = 3$; Gaussian MLE equals least-squares` },

    { q:`<p>A Laplace (double-exponential) likelihood gives the median as its MLE for the location, not the mean. Data: $1, 2, 100$. Find the Laplace-MLE location and contrast with the Gaussian MLE.</p>`,
      steps:[
        {do:`Median of $1, 2, 100$ is the middle value $2$.`, why:`The Laplace MLE minimizes absolute error, solved by the median.`},
        {do:`Gaussian MLE would be the mean $(1 + 2 + 100)/3 \\approx 34.3$.`, why:`The median resists the outlier; the mean does not.`}
      ],
      answer:`Laplace MLE $= 2$ (median); Gaussian MLE $\\approx 34.3$` },

    { q:`<p>Add-one (Laplace) smoothing for a categorical avoids zero probabilities: $\\hat p_i = \\frac{c_i + 1}{N + K}$. With counts $c = (3, 0)$ ($N = 3$, $K = 2$ classes), find both smoothed probabilities.</p>`,
      steps:[
        {do:`Denominator $N + K = 3 + 2 = 5$.`, why:`Add one pseudo-count per class.`},
        {do:`$\\hat p_1 = (3+1)/5 = 0.8$, $\\hat p_2 = (0+1)/5 = 0.2$.`, why:`The unseen class gets a small nonzero probability instead of $0$.`}
      ],
      answer:`$\\hat p = (0.8,\\ 0.2)$` }
  ]);

  /* ----------------------------------------------------------------
     ml-logistic-regression: harder — odds ratios, two-step GD,
     boundary geometry, regularized logistic, calibration, Hessian
     curvature, custom threshold, precision, log-likelihood sign.
  ---------------------------------------------------------------- */
  add("ml-logistic-regression", [
    { q:`<p>A logistic weight $\\theta_j = \\ln 2 \\approx 0.693$ means a one-unit increase in $x_j$ multiplies the odds by $e^{\\theta_j}$. Find that odds multiplier.</p>`,
      steps:[
        {do:`Odds multiplier $= e^{\\theta_j} = e^{\\ln 2}$.`, why:`Logistic regression is linear in the log-odds, so a unit change scales the odds by $e^{\\theta_j}$.`},
        {do:`$= 2$.`, why:`Each unit of $x_j$ doubles the odds.`}
      ],
      answer:`Odds multiply by $2$` },

    { q:`<p>Two logistic GD steps. $\\theta = 0$ (one weight), example $(x, y) = (1, 1)$, $\\alpha = 1$, rule $\\theta \\leftarrow \\theta - \\alpha(\\sigma(\\theta x) - y)x$. Use $\\sigma(0) = 0.5$ and $\\sigma(0.5) \\approx 0.622$ (3 dp).</p>`,
      steps:[
        {do:`Step 1: $z = 0$, grad $= (0.5 - 1){\\cdot}1 = -0.5$, $\\theta = 0 - 1(-0.5) = 0.5$.`, why:`First step raises $\\theta$ toward the true $1$.`},
        {do:`Step 2: $z = 0.5$, $\\sigma(0.5) \\approx 0.622$, grad $= (0.622 - 1) = -0.378$, $\\theta = 0.5 + 0.378 = 0.878$.`, why:`The probability climbs, so the update shrinks — diminishing steps.`}
      ],
      answer:`$\\theta \\approx 0.878$ after two steps` },

    { q:`<p>The decision boundary of $\\theta = (\\theta_0, \\theta_1, \\theta_2) = (4, 3, -4)$ is the line $\\theta^\\top x = 0$. Its perpendicular distance from the origin is $\\frac{|\\theta_0|}{\\sqrt{\\theta_1^2 + \\theta_2^2}}$. Compute it.</p>`,
      steps:[
        {do:`$\\sqrt{\\theta_1^2 + \\theta_2^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.`, why:`This is the norm of the weight vector (excluding bias).`},
        {do:`Distance $= |4|/5 = 0.8$.`, why:`The bias divided by the weight norm gives the offset of the boundary from the origin.`}
      ],
      answer:`Distance $= 0.8$` },

    { q:`<p>Regularized logistic gradient adds $\\frac{\\lambda}{m}\\theta_j$ (not on the bias). With per-example gradient $(\\sigma - y)x_j = 0.3$, $\\lambda = 2$, $m = 4$, $\\theta_j = 1$, find the full gradient component.</p>`,
      steps:[
        {do:`Penalty term $= \\frac{\\lambda}{m}\\theta_j = \\frac{2}{4}\\times 1 = 0.5$.`, why:`L2 regularization pulls each weight toward $0$.`},
        {do:`Full gradient $= 0.3 + 0.5 = 0.8$.`, why:`Add the data gradient and the regularization gradient.`}
      ],
      answer:`Gradient component $= 0.8$` },

    { q:`<p>Combine evidence from two features. $\\theta = (\\theta_0, \\theta_1, \\theta_2) = (-1, 2, -1)$, $x = (1, 3, 2)$. Find $z$, then $\\sigma(z)$ using $\\sigma(3) \\approx 0.953$.</p>`,
      steps:[
        {do:`$z = -1{\\cdot}1 + 2{\\cdot}3 + (-1){\\cdot}2 = -1 + 6 - 2 = 3$.`, why:`Dot the weights with the augmented features.`},
        {do:`$\\sigma(3) \\approx 0.953$.`, why:`A large positive score gives high confidence in class $1$.`}
      ],
      answer:`$z = 3$, $\\sigma(z) \\approx 0.953$` },

    { q:`<p>Calibration: a well-calibrated model predicting $p = 0.7$ on $200$ examples should have about how many positives? If $160$ are actually positive, is it over- or under-confident?</p>`,
      steps:[
        {do:`Expected positives $= 0.7 \\times 200 = 140$.`, why:`Calibration means predicted probability matches observed frequency.`},
        {do:`Observed $160 > 140$, so the true rate ($0.8$) exceeds the predicted $0.7$: the model is under-confident.`, why:`It assigned too low a probability to the positive class.`}
      ],
      answer:`Expect $140$; observed $160$ means under-confident` },

    { q:`<p>The Hessian curvature of logistic loss for one example is $\\sigma(z)(1 - \\sigma(z))\\,x^2$. With $\\sigma(z) = 0.5$ and $x = 2$, find it, and say where (which $\\sigma$) curvature is largest.</p>`,
      steps:[
        {do:`$\\sigma(1-\\sigma)x^2 = 0.5{\\cdot}0.5{\\cdot}4 = 0.25 \\times 4 = 1$.`, why:`Plug in the values.`},
        {do:`Curvature $\\sigma(1-\\sigma)$ peaks at $\\sigma = 0.5$.`, why:`The loss is most curved (informative) where the model is most uncertain.`}
      ],
      answer:`Hessian $= 1$; curvature is largest at $\\sigma = 0.5$` },

    { q:`<p>Convert a predicted probability to a class with a custom threshold. A fraud model outputs $p = 0.4$. To catch more fraud you set the threshold to $0.3$. Is this example flagged as fraud?</p>`,
      steps:[
        {do:`Compare $p = 0.4$ to the threshold $0.3$.`, why:`Predict class $1$ when $p \\ge$ threshold.`},
        {do:`$0.4 > 0.3$, so flag it as fraud.`, why:`Lowering the threshold raises recall at the cost of more false positives.`}
      ],
      answer:`Yes — flagged ($0.4 \\ge 0.3$)` },

    { q:`<p>Log-likelihood of one logistic example is $y\\log\\sigma + (1-y)\\log(1-\\sigma)$. For $y = 1$, $\\sigma = 0.6$ (use $\\log 0.6 \\approx -0.511$), find it and its sign.</p>`,
      steps:[
        {do:`$y = 1$: keep $\\log\\sigma = \\log 0.6 \\approx -0.511$.`, why:`Only the $y\\log\\sigma$ term survives.`},
        {do:`The log-likelihood is $\\approx -0.511$ (negative).`, why:`Log-likelihoods of probabilities are always $\\le 0$; closer to $0$ is better.`}
      ],
      answer:`$\\approx -0.511$ (negative, as all log-likelihoods are)` },

    { q:`<p>A logistic model gives $P(y=1) = 0.75$. Find the odds, the log-odds (use $\\log 3 \\approx 1.099$), and confirm the score $z = \\log(\\text{odds})$.</p>`,
      steps:[
        {do:`Odds $= \\frac{0.75}{0.25} = 3$.`, why:`Odds are the ratio of the two class probabilities.`},
        {do:`Log-odds $z = \\log 3 \\approx 1.099$.`, why:`The score $z$ equals the natural log of the odds in logistic regression.`}
      ],
      answer:`Odds $= 3$, $z \\approx 1.099$` },

    { q:`<p>Precision from a confusion count: a model flags $50$ positives, of which $40$ are truly positive. Find precision, and connect it to the chosen probability threshold.</p>`,
      steps:[
        {do:`Precision $= \\frac{TP}{TP + FP} = \\frac{40}{50} = 0.8$.`, why:`Precision is the fraction of flagged items that are correct.`},
        {do:`Raising the threshold flags fewer, usually higher-precision, positives.`, why:`A stricter cutoff trades recall for precision.`}
      ],
      answer:`Precision $= 0.8$; a higher threshold raises precision` },

    { q:`<p>MLE for logistic regression maximizes $\\sum [y\\log\\sigma + (1-y)\\log(1-\\sigma)]$, equivalently minimizes cross-entropy. For one example $(x, y) = (2, 0)$ at $\\theta = 0$ ($\\sigma = 0.5$), is the gradient $(\\sigma - y)x$ positive or negative, and which way does $\\theta$ move?</p>`,
      steps:[
        {do:`Gradient $= (0.5 - 0){\\cdot}2 = 1 > 0$.`, why:`Predicted $0.5$ exceeds the true $0$, so the gradient is positive.`},
        {do:`$\\theta \\leftarrow \\theta - \\alpha(1)$ decreases $\\theta$, lowering $\\sigma$ toward $0$.`, why:`Descent moves opposite the positive gradient.`}
      ],
      answer:`Gradient $= +1$; $\\theta$ decreases to push $\\sigma$ toward $0$` }
  ]);

  /* ----------------------------------------------------------------
     ml-softmax: harder — log-softmax, temperature limits, perplexity,
     entropy, Jacobian (diag + off-diag), 5-class ties, sharpening,
     cross-entropy gradient direction, argmax vs softmax, LM loss.
  ---------------------------------------------------------------- */
  add("ml-softmax", [
    { q:`<p>Log-softmax is $\\log\\phi_i = z_i - \\log\\sum_j e^{z_j}$. For scores $(2, 0, 0)$ with $\\sum_j e^{z_j} = e^2 + 1 + 1 \\approx 9.389$, find $\\log\\phi_1$ (use $\\log 9.389 \\approx 2.240$, 3 dp).</p>`,
      steps:[
        {do:`$\\log\\phi_1 = z_1 - \\log\\sum_j e^{z_j} = 2 - 2.240$.`, why:`Log-softmax avoids computing the probability then logging it.`},
        {do:`$= -0.240$.`, why:`So $\\phi_1 = e^{-0.240} \\approx 0.787$; log-softmax is numerically stabler for the loss.`}
      ],
      answer:`$\\log\\phi_1 \\approx -0.240$` },

    { q:`<p>Temperature limit: as $T \\to \\infty$, softmax over $K$ classes approaches what distribution? For $K = 4$, give the limiting probability of each class.</p>`,
      steps:[
        {do:`Dividing scores by huge $T$ makes them all $\\approx 0$, so all exponentials are equal.`, why:`High temperature erases score differences.`},
        {do:`Each class $\\to 1/K = 1/4 = 0.25$ (uniform).`, why:`Infinite temperature yields maximum entropy.`}
      ],
      answer:`Uniform: each class $= 0.25$` },

    { q:`<p>Temperature limit the other way: as $T \\to 0^+$, softmax approaches what? For scores $(5, 2, 1)$, give the limiting distribution.</p>`,
      steps:[
        {do:`Dividing by tiny $T$ blows up score gaps, so the largest score dominates entirely.`, why:`Low temperature sharpens toward a hard max.`},
        {do:`Limit is $(1, 0, 0)$ — all mass on class $1$ (the argmax).`, why:`Zero temperature recovers the one-hot argmax.`}
      ],
      answer:`$(1, 0, 0)$ — the argmax (one-hot)` },

    { q:`<p>Perplexity of a predicted distribution on the true class is $e^{\\text{cross-entropy}}$. If the model assigns probability $0.25$ to the true class, the loss is $-\\log 0.25 \\approx 1.386$. Find the perplexity.</p>`,
      steps:[
        {do:`Perplexity $= e^{1.386}$.`, why:`Perplexity is the exponential of the cross-entropy.`},
        {do:`$= 1/0.25 = 4$.`, why:`It equals the reciprocal of the true-class probability — like being unsure among $4$ equally likely options.`}
      ],
      answer:`Perplexity $= 4$` },

    { q:`<p>Entropy of a softmax output $\\phi = (0.5, 0.5)$ is $-\\sum \\phi_i \\log \\phi_i$. Compute it (use $\\log 0.5 \\approx -0.693$).</p>`,
      steps:[
        {do:`$-[0.5\\log 0.5 + 0.5\\log 0.5] = -[0.5(-0.693) + 0.5(-0.693)]$.`, why:`Entropy measures the spread of the distribution.`},
        {do:`$= -(-0.693) = 0.693$.`, why:`A 50/50 split has the maximum entropy for two classes ($\\log 2$).`}
      ],
      answer:`Entropy $= 0.693$ (max for two classes)` },

    { q:`<p>Softmax Jacobian diagonal is $\\frac{\\partial \\phi_i}{\\partial z_i} = \\phi_i(1 - \\phi_i)$. With $\\phi_i = 0.2$, find this derivative.</p>`,
      steps:[
        {do:`$\\phi_i(1 - \\phi_i) = 0.2 \\times 0.8$.`, why:`This mirrors the sigmoid derivative for the diagonal term.`},
        {do:`$= 0.16$.`, why:`Off-diagonal terms are $-\\phi_i \\phi_j$; together they let gradients flow through softmax.`}
      ],
      answer:`$\\partial\\phi_i/\\partial z_i = 0.16$` },

    { q:`<p>Softmax off-diagonal Jacobian is $\\frac{\\partial \\phi_i}{\\partial z_j} = -\\phi_i \\phi_j$ for $i \\ne j$. With $\\phi_i = 0.2$, $\\phi_j = 0.5$, find it.</p>`,
      steps:[
        {do:`$-\\phi_i \\phi_j = -(0.2)(0.5)$.`, why:`Raising one class's score lowers the others' probabilities.`},
        {do:`$= -0.1$.`, why:`The negative sign shows the competition among classes.`}
      ],
      answer:`$\\partial\\phi_i/\\partial z_j = -0.1$` },

    { q:`<p>Five-class softmax with scores $(0, 0, 0, 0, \\ln 6)$. Note $e^{\\ln 6} = 6$. Find the probability of the top class and of one of the equal classes.</p>`,
      steps:[
        {do:`Exponentials: four $e^0 = 1$ and one $e^{\\ln 6} = 6$; sum $= 4 + 6 = 10$.`, why:`Add all exponentials.`},
        {do:`Top class $= 6/10 = 0.6$; each equal class $= 1/10 = 0.1$.`, why:`Divide each by the total; the four ties share evenly.`}
      ],
      answer:`Top $= 0.6$; each other $= 0.1$` },

    { q:`<p>Temperature $T = 0.5$ sharpens. Scores $(2, 1)$ become $(4, 2)$ after dividing by $T$. Using $e^4 \\approx 54.6$, $e^2 \\approx 7.39$, find $\\phi_1$ (3 dp) and compare to the $T = 1$ value $\\approx 0.731$.</p>`,
      steps:[
        {do:`Scaled scores $(4, 2)$: sum $= 54.6 + 7.39 = 61.99$.`, why:`Lower $T$ widens the score gap.`},
        {do:`$\\phi_1 = 54.6/61.99 \\approx 0.881$.`, why:`Sharper than the $T = 1$ value $0.731$ — low temperature concentrates probability.`}
      ],
      answer:`$\\phi_1 \\approx 0.881$ (sharper than $0.731$ at $T = 1$)` },

    { q:`<p>Cross-entropy gradient pushes mass to the true class. Softmax $\\phi = (0.2, 0.5, 0.3)$, true class $3$. Find the gradient $\\phi_i - \\mathbb{1}[i = 3]$ and identify which score will rise.</p>`,
      steps:[
        {do:`One-hot for class $3$ is $(0, 0, 1)$. Gradient $= (0.2, 0.5, 0.3 - 1) = (0.2, 0.5, -0.7)$.`, why:`Subtract the target from the prediction.`},
        {do:`$z_3$ has a negative gradient, so descent raises $z_3$ and hence $\\phi_3$.`, why:`Training moves probability toward the true class.`}
      ],
      answer:`Gradient $(0.2, 0.5, -0.7)$; $z_3$ rises` },

    { q:`<p>Argmax vs softmax: for scores $(3.0, 2.9)$ with $e^{3.0} \\approx 20.09$, $e^{2.9} \\approx 18.17$, find $\\phi_1$ (3 dp). Why might softmax be preferred over hard argmax during training?</p>`,
      steps:[
        {do:`Sum $= 20.09 + 18.17 = 38.26$; $\\phi_1 = 20.09/38.26 \\approx 0.525$.`, why:`Close scores give near-even probabilities.`},
        {do:`Softmax is differentiable, so gradients can flow; argmax is flat with zero gradient.`, why:`Training needs smooth gradients, not a hard pick.`}
      ],
      answer:`$\\phi_1 \\approx 0.525$; softmax is differentiable (argmax is not)` },

    { q:`<p>A language model predicts the next word among $50000$ classes. If the true word gets probability $0.01$, find the cross-entropy loss (use $\\log 0.01 \\approx -4.605$) and the per-word perplexity.</p>`,
      steps:[
        {do:`Loss $= -\\log 0.01 \\approx 4.605$.`, why:`Cross-entropy on the true class.`},
        {do:`Perplexity $= e^{4.605} = 1/0.01 = 100$.`, why:`The model is effectively choosing among $100$ equally likely words.`}
      ],
      answer:`Loss $\\approx 4.605$; perplexity $= 100$` }
  ]);

  /* ----------------------------------------------------------------
     ml-glm: harder — variance functions, dispersion, offset terms,
     gamma/negative-binomial/probit links, deviance, IRLS weight,
     mean-variance matching, concavity of the log-likelihood.
  ---------------------------------------------------------------- */
  add("ml-glm", [
    { q:`<p>In a GLM the variance is $\\mathrm{Var}(y) = a''(\\eta)$. For Poisson, $a(\\eta) = e^\\eta$, so $a''(\\eta) = e^\\eta = \\lambda$. Find the variance when the mean count is $\\lambda = 7$.</p>`,
      steps:[
        {do:`$a''(\\eta) = e^\\eta = \\lambda$.`, why:`The second derivative of the log-partition is the variance.`},
        {do:`$\\mathrm{Var}(y) = 7$.`, why:`For Poisson the variance equals the mean — a key GLM property.`}
      ],
      answer:`$\\mathrm{Var}(y) = 7$ (variance = mean)` },

    { q:`<p>The Bernoulli variance from the GLM is $a''(\\eta) = \\sigma(\\eta)(1 - \\sigma(\\eta)) = \\mu(1 - \\mu)$. Find the variance when $\\mu = 0.2$.</p>`,
      steps:[
        {do:`$\\mathrm{Var}(y) = \\mu(1 - \\mu) = 0.2 \\times 0.8$.`, why:`Differentiate the Bernoulli log-partition twice.`},
        {do:`$= 0.16$.`, why:`Variance is largest at $\\mu = 0.5$ and shrinks toward the extremes.`}
      ],
      answer:`$\\mathrm{Var}(y) = 0.16$` },

    { q:`<p>Poisson regression with an exposure offset: $\\log\\lambda = \\theta^\\top x + \\log(\\text{exposure})$. With $\\theta^\\top x = 0$ and exposure $= 5$, find the predicted count $\\lambda$.</p>`,
      steps:[
        {do:`$\\log\\lambda = 0 + \\log 5$, so $\\lambda = e^{\\log 5} = 5$.`, why:`The offset enters the linear predictor with a fixed coefficient of $1$.`},
        {do:`$\\lambda = 5$.`, why:`Offsets scale the rate by exposure (e.g. counts per person-year).`}
      ],
      answer:`$\\lambda = 5$` },

    { q:`<p>Gamma regression uses the log link: $\\mu = e^\\eta$. With $\\eta = \\theta^\\top x = \\ln 8$ ($e^{\\ln 8} = 8$), find the predicted positive mean.</p>`,
      steps:[
        {do:`$\\mu = e^\\eta = e^{\\ln 8}$.`, why:`The log link keeps the mean positive for skewed positive data like costs.`},
        {do:`$= 8$.`, why:`Gamma GLMs model positive, right-skewed outcomes.`}
      ],
      answer:`$\\mu = 8$` },

    { q:`<p>Deviance for a Poisson GLM contribution is $2[y\\log\\frac{y}{\\hat\\mu} - (y - \\hat\\mu)]$. For $y = 4$, $\\hat\\mu = 2$ (use $\\log 2 \\approx 0.693$), find this term (3 dp).</p>`,
      steps:[
        {do:`$y\\log\\frac{y}{\\hat\\mu} = 4\\log 2 \\approx 4 \\times 0.693 = 2.772$; $(y - \\hat\\mu) = 2$.`, why:`Plug into the deviance formula.`},
        {do:`$2[2.772 - 2] = 2(0.772) = 1.544$.`, why:`Deviance generalizes residual sum of squares to GLMs.`}
      ],
      answer:`Deviance term $\\approx 1.544$` },

    { q:`<p>The dispersion parameter $\\phi$ scales the variance: $\\mathrm{Var}(y) = \\phi\\,V(\\mu)$. Poisson assumes $\\phi = 1$. If the observed variance is $2.5\\,\\mu$, what is the estimated dispersion, and what does it signal?</p>`,
      steps:[
        {do:`$\\phi = \\mathrm{Var}(y)/V(\\mu) = 2.5\\mu / \\mu = 2.5$.`, why:`Divide observed variance by the model's variance function $V(\\mu) = \\mu$.`},
        {do:`$\\phi = 2.5 > 1$ signals overdispersion.`, why:`More variance than Poisson allows — use quasi-Poisson or negative binomial.`}
      ],
      answer:`$\\phi = 2.5$ (overdispersion)` },

    { q:`<p>The mean-variance link distinguishes GLM families. Match each variance function $V(\\mu)$ to its family: $V = 1$, $V = \\mu$, $V = \\mu(1-\\mu)$.</p>`,
      steps:[
        {do:`$V = 1$ is constant variance: Gaussian (linear regression).`, why:`Normal noise has variance independent of the mean.`},
        {do:`$V = \\mu$ is Poisson; $V = \\mu(1-\\mu)$ is Bernoulli.`, why:`Each family's variance is a fixed function of its mean.`}
      ],
      answer:`$V=1$ Gaussian, $V=\\mu$ Poisson, $V=\\mu(1-\\mu)$ Bernoulli` },

    { q:`<p>IRLS (iteratively reweighted least squares) uses a working weight that, at the canonical link, simplifies to $w = V(\\mu)$. For a Poisson at $\\mu = 3$, find the IRLS weight.</p>`,
      steps:[
        {do:`At the canonical link the working weight is $V(\\mu) = \\mu$ for Poisson.`, why:`The canonical link makes the weight equal the variance function.`},
        {do:`$w = \\mu = 3$.`, why:`Larger-mean observations carry more weight in the reweighted fit.`}
      ],
      answer:`IRLS weight $w = 3$` },

    { q:`<p>Negative-binomial regression handles overdispersed counts with mean $\\mu = e^\\eta$ but variance $\\mu + \\frac{\\mu^2}{r}$. With $\\mu = 4$ and dispersion $r = 2$, find the variance and compare to Poisson ($= \\mu$).</p>`,
      steps:[
        {do:`$\\mathrm{Var} = \\mu + \\frac{\\mu^2}{r} = 4 + \\frac{16}{2} = 4 + 8 = 12$.`, why:`The extra $\\mu^2/r$ term inflates variance beyond the mean.`},
        {do:`Poisson would give $\\mathrm{Var} = 4$, so this is $3\\times$ larger.`, why:`Negative binomial models extra-Poisson variation.`}
      ],
      answer:`$\\mathrm{Var} = 12$ (vs Poisson $4$)` },

    { q:`<p>Inverse link prediction with a non-canonical (probit) link. The probit GLM uses $\\mu = \\Phi(\\eta)$, the standard-normal CDF. For $\\eta = 0$, find $\\mu$ and compare to the logistic value $\\sigma(0)$.</p>`,
      steps:[
        {do:`$\\Phi(0) = 0.5$ (the normal CDF at its mean).`, why:`Half the standard-normal mass lies below $0$.`},
        {do:`This matches $\\sigma(0) = 0.5$; probit and logit agree at $\\eta = 0$ but differ in the tails.`, why:`Both are valid links for binary data.`}
      ],
      answer:`$\\mu = 0.5$ (same as $\\sigma(0)$)` },

    { q:`<p>A Poisson GLM with two features: $\\theta = (0.1, 0.3, -0.2)$ (bias, $x_1$, $x_2$), $x = (1, 4, 5)$. Find $\\eta$ then $\\lambda = e^\\eta$ (use $e^{0.3} \\approx 1.350$, 3 dp).</p>`,
      steps:[
        {do:`$\\eta = 0.1{\\cdot}1 + 0.3{\\cdot}4 + (-0.2){\\cdot}5 = 0.1 + 1.2 - 1.0 = 0.3$.`, why:`Compute the linear predictor including the bias.`},
        {do:`$\\lambda = e^{0.3} \\approx 1.350$.`, why:`The log link exponentiates to a positive expected count.`}
      ],
      answer:`$\\eta = 0.3$, $\\lambda \\approx 1.350$` },

    { q:`<p>Why does every canonical-link GLM have a concave (single-peaked) log-likelihood, making MLE easy? Give the one-sentence reason tied to the log-partition $a(\\eta)$.</p>`,
      steps:[
        {do:`The log-likelihood's curvature is $-a''(\\eta) = -\\mathrm{Var}(y) \\le 0$.`, why:`The second derivative of the log-partition is the (non-negative) variance.`},
        {do:`A non-positive second derivative means the log-likelihood is concave, so it has one global maximum.`, why:`Concavity guarantees gradient ascent / IRLS finds the unique MLE.`}
      ],
      answer:`Because curvature $= -\\mathrm{Var}(y) \\le 0$, the log-likelihood is concave with one global max` }
  ]);

})();
