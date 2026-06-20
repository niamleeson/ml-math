/* =====================================================================
   PRACTICE PROBLEMS — MODULE 2 (Machine Learning), HARDER set.
   Owned lesson ids: ml-supervised, ml-loss, ml-cost, ml-gradient-descent,
   ml-linear-regression, ml-likelihood, ml-logistic-regression,
   ml-softmax, ml-glm.
   These ADD to the existing set A. Each problem is harder than set A:
   multi-step gradient-descent traces, 2-feature normal equations,
   MLE for several distributions, multi-class softmax, cross-entropy
   gradients, GLM links. Notation matches lessons/02-ml.js.
   Sigmoids/softmax/logs rounded to 2-3 dp (stated each time).
   ===================================================================== */
(function () {
  var P = window.PRACTICE;
  function add(id, probs) { P[id] = (P[id] || []).concat(probs); }

  /* ----------------------------------------------------------------
     ml-supervised: harder — fitting two-parameter rules, multi-feature
     hypotheses, train/test reasoning.
  ---------------------------------------------------------------- */
  add("ml-supervised", [
    { q:`<p>Two-feature rule $h_\\theta(x) = \\theta_1 x_1 + \\theta_2 x_2$ with $\\theta_1 = 3, \\theta_2 = -2$. Predict for $x = (4, 5)$.</p>`,
      steps:[
        {do:`Multiply each feature by its weight: $3\\times 4 = 12$ and $-2\\times 5 = -10$.`, why:`Each feature contributes weight times value.`},
        {do:`Add: $12 + (-10) = 2$.`, why:`The hypothesis sums the weighted features.`}
      ],
      answer:`$h_\\theta(x) = 2$` },

    { q:`<p>A rule has the form $h_\\theta(x) = \\theta_0 + \\theta_1 x$. It must pass through $(x,y) = (1,5)$ and $(3,11)$. Find $\\theta_0$ and $\\theta_1$.</p>`,
      steps:[
        {do:`Slope from the two points: $\\theta_1 = \\frac{11-5}{3-1} = \\frac{6}{2} = 3$.`, why:`Two points fix a line; slope is rise over run.`},
        {do:`Use $(1,5)$: $5 = \\theta_0 + 3\\times 1 \\Rightarrow \\theta_0 = 2$.`, why:`Plug a known point in to solve for the intercept.`}
      ],
      answer:`$\\theta_0 = 2,\\ \\theta_1 = 3$` },

    { q:`<p>A model fits the training points perfectly but predicts badly on new data. Name this problem and say whether more or fewer model parameters typically cause it.</p>`,
      steps:[
        {do:`Perfect on training, poor on new data is <b>overfitting</b>.`, why:`The model memorized noise instead of the real pattern.`},
        {do:`More parameters (a more flexible model) typically cause it.`, why:`Extra flexibility lets the model bend to fit noise.`}
      ],
      answer:`Overfitting; caused by too many parameters (too much flexibility)` },

    { q:`<p>A rule $h_\\theta(x)=\\theta x$ must fit three points $(2,5),(4,9),(6,14)$ as best it can. The least-squares slope is $\\theta = \\frac{\\sum x y}{\\sum x^2}$. Compute it (round to 3 dp).</p>`,
      steps:[
        {do:`$\\sum xy = 2{\\cdot}5 + 4{\\cdot}9 + 6{\\cdot}14 = 10 + 36 + 84 = 130$.`, why:`Numerator pairs each feature with its answer.`},
        {do:`$\\sum x^2 = 4 + 16 + 36 = 56$.`, why:`Denominator is the sum of squared features.`},
        {do:`$\\theta = 130/56 \\approx 2.321$.`, why:`No single $\\theta$ hits all three points, so least squares balances them.`}
      ],
      answer:`$\\theta \\approx 2.321$` },

    { q:`<p>You have $m = 100$ labeled examples. You hold out $20$ for testing and train on the rest. Accuracy is $98\\%$ on training and $74\\%$ on test. What is $m$ for training, and what does the gap suggest?</p>`,
      steps:[
        {do:`Training $m = 80$ (the rest after holding out 20).`, why:`$m$ counts only the examples used to fit the model.`},
        {do:`High train but low test accuracy means the model overfits.`, why:`A large train/test gap signals memorization, not generalization.`}
      ],
      answer:`Training $m = 80$; the $98\\%$ vs $74\\%$ gap indicates overfitting` }
  ]);

  /* ----------------------------------------------------------------
     ml-loss: harder — MSE vs MAE vs Huber, cross-entropy on both
     labels, gradient of squared and cross-entropy loss.
  ---------------------------------------------------------------- */
  add("ml-loss", [
    { q:`<p>Squared loss is $L = \\frac{1}{2}(y-z)^2$. Treating $z$ as the variable, $\\frac{dL}{dz} = z - y$. At $y = 10$, $z = 7$, find the gradient and say which way to push $z$.</p>`,
      steps:[
        {do:`$\\frac{dL}{dz} = z - y = 7 - 10 = -3$.`, why:`The derivative of $\\frac12(y-z)^2$ with respect to $z$ is $z-y$.`},
        {do:`A negative gradient means raising $z$ lowers the loss; push $z$ up toward $10$.`, why:`Move opposite the gradient to decrease loss.`}
      ],
      answer:`Gradient $= -3$; increase $z$ toward $y = 10$` },

    { q:`<p>Compare squared loss $\\frac12(y-z)^2$ with absolute loss $|y-z|$ for an outlier with gap $y - z = 10$. Which penalizes more?</p>`,
      steps:[
        {do:`Squared: $\\frac12(10)^2 = 50$.`, why:`Squaring grows quadratically with the gap.`},
        {do:`Absolute: $|10| = 10$.`, why:`Absolute loss grows only linearly.`},
        {do:`$50 > 10$, so squared loss penalizes the outlier far more.`, why:`That is why squared loss is sensitive to outliers.`}
      ],
      answer:`Squared loss ($50$ vs $10$) penalizes the outlier more` },

    { q:`<p>Huber loss is $\\frac12 r^2$ when $|r|\\le \\delta$ and $\\delta|r| - \\frac12\\delta^2$ when $|r|>\\delta$, where $r = y - z$. With $\\delta = 1$ and residual $r = 3$, find the Huber loss.</p>`,
      steps:[
        {do:`$|r| = 3 > \\delta = 1$, so use the linear branch.`, why:`Beyond $\\delta$ Huber switches from quadratic to linear.`},
        {do:`$\\delta|r| - \\frac12\\delta^2 = 1{\\cdot}3 - \\frac12{\\cdot}1 = 3 - 0.5 = 2.5$.`, why:`Plug into the linear-branch formula.`}
      ],
      answer:`Huber loss $= 2.5$` },

    { q:`<p>Binary cross-entropy is $L = -[\\,y\\log p + (1-y)\\log(1-p)\\,]$ (natural log). For $y = 0$ and $p = 0.3$, find $L$ (round to 3 dp).</p>`,
      steps:[
        {do:`With $y = 0$ only the second term survives: $L = -\\log(1-p) = -\\log(0.7)$.`, why:`The $y\\log p$ term is multiplied by $y = 0$.`},
        {do:`$\\log(0.7) \\approx -0.357$, so $L \\approx 0.357$.`, why:`Predicting $0.3$ for a true $0$ gives a modest loss.`}
      ],
      answer:`$L \\approx 0.357$` },

    { q:`<p>For cross-entropy with $y = 1$, the loss is $-\\log p$. Two models give $p = 0.99$ and $p = 0.50$. Find both losses (3 dp) and the difference.</p>`,
      steps:[
        {do:`$-\\log(0.99) \\approx 0.010$.`, why:`A near-certain correct prediction is barely penalized.`},
        {do:`$-\\log(0.50) \\approx 0.693$.`, why:`A 50/50 guess on a true 1 costs $\\log 2$.`},
        {do:`Difference $\\approx 0.693 - 0.010 = 0.683$.`, why:`Confidence in the right answer matters a lot.`}
      ],
      answer:`$0.010$ vs $0.693$; difference $\\approx 0.683$` },

    { q:`<p>The cross-entropy gradient with respect to the score $z$ (where $p = \\sigma(z)$) simplifies to $\\frac{\\partial L}{\\partial z} = p - y$. With $p = 0.8$ and true $y = 1$, find this gradient and interpret its sign.</p>`,
      steps:[
        {do:`$\\frac{\\partial L}{\\partial z} = p - y = 0.8 - 1 = -0.2$.`, why:`This clean form comes from the sigmoid and log combining.`},
        {do:`Negative gradient: raising $z$ (hence $p$) lowers the loss, pushing $p$ toward the true $1$.`, why:`Move opposite the gradient to reduce loss.`}
      ],
      answer:`$p - y = -0.2$; increase the score to push $p$ toward $1$` }
  ]);

  /* ----------------------------------------------------------------
     ml-cost: harder — MSE with 1/m and 1/2m factors, two-feature cost,
     cost as a function of theta, regularization.
  ---------------------------------------------------------------- */
  add("ml-cost", [
    { q:`<p>Mean squared cost is $J(\\theta) = \\frac{1}{2m}\\sum_{i=1}^m (h_\\theta(x^{(i)}) - y^{(i)})^2$. Model $h_\\theta(x)=2x$, data $(1,1),(2,5),(3,7)$. Compute $J$ ($m = 3$).</p>`,
      steps:[
        {do:`Predictions: $2,4,6$. Residuals: $2-1=1$, $4-5=-1$, $6-7=-1$.`, why:`Residual is prediction minus truth.`},
        {do:`Sum of squares: $1^2 + (-1)^2 + (-1)^2 = 3$.`, why:`Square each residual and add.`},
        {do:`$J = \\frac{1}{2{\\cdot}3}\\times 3 = \\frac{3}{6} = 0.5$.`, why:`Divide by $2m = 6$.`}
      ],
      answer:`$J = 0.5$` },

    { q:`<p>Cost $J(\\theta) = \\frac{1}{2m}\\sum (h_\\theta(x^{(i)})-y^{(i)})^2$ with $h_\\theta(x) = \\theta x$. Data $(1,2),(2,2)$. Write $J$ as a function of $\\theta$, then evaluate at $\\theta = 1$.</p>`,
      steps:[
        {do:`Residuals: $\\theta{\\cdot}1 - 2 = \\theta - 2$ and $\\theta{\\cdot}2 - 2 = 2\\theta - 2$.`, why:`Keep $\\theta$ symbolic.`},
        {do:`$J(\\theta) = \\frac{1}{4}\\big[(\\theta-2)^2 + (2\\theta-2)^2\\big]$.`, why:`$2m = 4$ for two examples.`},
        {do:`At $\\theta = 1$: $\\frac14[(-1)^2 + 0^2] = \\frac14(1) = 0.25$.`, why:`Plug in $\\theta = 1$.`}
      ],
      answer:`$J(\\theta) = \\frac14[(\\theta-2)^2 + (2\\theta-2)^2]$; $J(1) = 0.25$` },

    { q:`<p>Two-feature model $h_\\theta(x) = \\theta_1 x_1 + \\theta_2 x_2$ with $\\theta = (1,2)$. Rows $(x_1,x_2,y)$: $(1,1,4)$ and $(2,0,1)$. Using $J = \\frac{1}{2m}\\sum (h-y)^2$, compute $J$ ($m = 2$).</p>`,
      steps:[
        {do:`Row 1: $h = 1{\\cdot}1 + 2{\\cdot}1 = 3$, residual $3 - 4 = -1$.`, why:`Dot the weights with the features.`},
        {do:`Row 2: $h = 1{\\cdot}2 + 2{\\cdot}0 = 2$, residual $2 - 1 = 1$.`, why:`Second example.`},
        {do:`$J = \\frac{1}{4}[(-1)^2 + 1^2] = \\frac{2}{4} = 0.5$.`, why:`Divide the squared-residual sum by $2m = 4$.`}
      ],
      answer:`$J = 0.5$` },

    { q:`<p>For $h_\\theta(x)=\\theta x$ on data $(1,1),(2,2),(3,3)$, the cost $J(\\theta) = \\frac{1}{2m}\\sum(\\theta x - y)^2$ is a parabola in $\\theta$. At what $\\theta$ is $J$ minimized, and what is $J$ there?</p>`,
      steps:[
        {do:`The data lie exactly on $y = x$, so $\\theta = 1$ fits every point.`, why:`Each $y^{(i)} = x^{(i)}$.`},
        {do:`At $\\theta = 1$ all residuals are $0$, so $J = 0$.`, why:`A perfect fit gives zero cost.`}
      ],
      answer:`$\\theta = 1$, $J = 0$` },

    { q:`<p>Regularized cost adds a penalty: $J = \\frac{1}{2m}\\sum(h-y)^2 + \\frac{\\lambda}{2m}\\theta^2$. With the unpenalized part $= 0.5$, $\\lambda = 2$, $\\theta = 3$, $m = 3$, find the total $J$.</p>`,
      steps:[
        {do:`Penalty $= \\frac{\\lambda}{2m}\\theta^2 = \\frac{2}{6}\\times 9 = \\frac{18}{6} = 3$.`, why:`The regularizer punishes large weights.`},
        {do:`Total $J = 0.5 + 3 = 3.5$.`, why:`Add the data cost and the penalty.`}
      ],
      answer:`$J = 3.5$` },

    { q:`<p>Cost A averages loss over $m = 4$ examples to $J_A = 2.0$. Cost B sums the same losses without averaging. What is $J_B$, and which formulation do learning curves usually plot?</p>`,
      steps:[
        {do:`Summed cost $J_B = m \\times J_A = 4 \\times 2.0 = 8.0$.`, why:`The mean times the count recovers the sum.`},
        {do:`Learning curves usually plot the averaged (mean) cost.`, why:`Averaging makes costs comparable across dataset sizes.`}
      ],
      answer:`$J_B = 8.0$; the averaged (mean) cost is usually plotted` }
  ]);

  /* ----------------------------------------------------------------
     ml-gradient-descent: harder — multi-step traces, two-parameter
     updates, linear/logistic GD with bias, convergence ranges.
  ---------------------------------------------------------------- */
  add("ml-gradient-descent", [
    { q:`<p>Minimize $J(\\theta)=\\theta^2$ from $\\theta_0 = 8$ with $\\alpha = 0.25$. Do THREE steps. (Note $\\theta_{k+1} = \\theta_k(1 - 2\\alpha) = 0.5\\,\\theta_k$.)</p>`,
      steps:[
        {do:`Step 1: $\\theta = 8 - 0.25(2{\\cdot}8) = 8 - 4 = 4$.`, why:`$\\nabla J = 2\\theta = 16$.`},
        {do:`Step 2: $\\theta = 4 - 0.25(8) = 2$.`, why:`Each step halves $\\theta$ since $1 - 2\\alpha = 0.5$.`},
        {do:`Step 3: $\\theta = 2 - 0.25(4) = 1$.`, why:`Halving again.`}
      ],
      answer:`$\\theta = 1$ after three steps ($8 \\to 4 \\to 2 \\to 1$)` },

    { q:`<p>Minimize $J(\\theta) = \\theta^2$ with $\\alpha = 1$ from $\\theta_0 = 3$. Do two steps and describe what happens.</p>`,
      steps:[
        {do:`Step 1: $\\theta = 3 - 1(2{\\cdot}3) = 3 - 6 = -3$.`, why:`Update rule $\\theta_{k+1} = \\theta_k(1-2\\alpha) = -\\theta_k$.`},
        {do:`Step 2: $\\theta = -3 - 1(2{\\cdot}(-3)) = -3 + 6 = 3$.`, why:`It flips sign each step.`},
        {do:`It oscillates $3 \\to -3 \\to 3$ forever, never converging.`, why:`$\\alpha = 1$ is exactly the divergence boundary here.`}
      ],
      answer:`Oscillates $3 \\to -3 \\to 3$; never converges (step size too large)` },

    { q:`<p>Two-parameter quadratic $J(a,b) = a^2 + 4b^2$. Gradient is $(2a, 8b)$. From $(a,b) = (2, 1)$ with $\\alpha = 0.1$, do one step.</p>`,
      steps:[
        {do:`Gradient at $(2,1)$: $(2{\\cdot}2,\\ 8{\\cdot}1) = (4, 8)$.`, why:`Partial derivatives in each coordinate.`},
        {do:`$a \\leftarrow 2 - 0.1{\\cdot}4 = 1.6$; $b \\leftarrow 1 - 0.1{\\cdot}8 = 0.2$.`, why:`Update each parameter against its own gradient.`}
      ],
      answer:`$(a,b) = (1.6,\\ 0.2)$` },

    { q:`<p>Linear regression with bias: $h_\\theta(x) = \\theta_0 + \\theta_1 x$. On one example the gradients are $\\frac{\\partial J}{\\partial\\theta_0} = (h-y)$ and $\\frac{\\partial J}{\\partial\\theta_1} = (h-y)x$. At $\\theta = (0,0)$, example $(x,y) = (2,4)$, $\\alpha = 0.1$, do one step.</p>`,
      steps:[
        {do:`Predict $h = 0 + 0{\\cdot}2 = 0$; error $h - y = 0 - 4 = -4$.`, why:`Evaluate the model at the current weights.`},
        {do:`Gradients: $\\partial_{\\theta_0} = -4$, $\\partial_{\\theta_1} = -4{\\cdot}2 = -8$.`, why:`Error, and error times feature.`},
        {do:`Update: $\\theta_0 = 0 - 0.1(-4) = 0.4$; $\\theta_1 = 0 - 0.1(-8) = 0.8$.`, why:`Step downhill for each parameter.`}
      ],
      answer:`$\\theta = (0.4,\\ 0.8)$` },

    { q:`<p>Batch gradient for $h_\\theta(x)=\\theta x$ is $\\nabla J = \\frac{1}{m}\\sum (h-y)x$. Data $(1,1),(2,2),(3,3)$, current $\\theta = 0$, $\\alpha = 0.1$. Do one step (round to 3 dp).</p>`,
      steps:[
        {do:`Predictions all $0$; errors $0-1=-1$, $0-2=-2$, $0-3=-3$.`, why:`$h = 0$ at $\\theta = 0$.`},
        {do:`$\\nabla J = \\frac{1}{3}[(-1){\\cdot}1 + (-2){\\cdot}2 + (-3){\\cdot}3] = \\frac{-14}{3} \\approx -4.667$.`, why:`Average of error times feature.`},
        {do:`$\\theta = 0 - 0.1(-4.667) \\approx 0.467$.`, why:`Move toward the true slope $1$.`}
      ],
      answer:`$\\theta \\approx 0.467$` },

    { q:`<p>Logistic regression gradient on one example is $\\nabla = (\\sigma(z) - y)x$ where $z = \\theta x$. At $\\theta = 0$, example $(x,y) = (1,1)$, $\\alpha = 1$. One step. (Note $\\sigma(0) = 0.5$.)</p>`,
      steps:[
        {do:`Score $z = 0{\\cdot}1 = 0$, so $\\sigma(0) = 0.5$.`, why:`Sigmoid at $0$ is exactly $0.5$.`},
        {do:`Gradient $= (0.5 - 1){\\cdot}1 = -0.5$.`, why:`Predicted probability minus true label, times feature.`},
        {do:`$\\theta = 0 - 1(-0.5) = 0.5$.`, why:`Increasing $\\theta$ raises $\\sigma(z)$ toward the true $1$.`}
      ],
      answer:`$\\theta = 0.5$` },

    { q:`<p>For $J(\\theta) = \\theta^2$ the update is $\\theta_{k+1} = \\theta_k(1 - 2\\alpha)$. For which range of $\\alpha > 0$ does gradient descent converge to $0$?</p>`,
      steps:[
        {do:`Convergence needs $|1 - 2\\alpha| < 1$.`, why:`Each step multiplies $\\theta$ by $1-2\\alpha$; it shrinks only if the factor's size is below $1$.`},
        {do:`$-1 < 1 - 2\\alpha < 1 \\Rightarrow 0 < \\alpha < 1$.`, why:`Solve the inequality for $\\alpha$.`}
      ],
      answer:`$0 < \\alpha < 1$` },

    { q:`<p>Minimize $J(\\theta) = (\\theta - 4)^2$, gradient $2(\\theta - 4)$, from $\\theta_0 = 0$, $\\alpha = 0.25$. Do TWO steps.</p>`,
      steps:[
        {do:`Step 1: $\\nabla = 2(0-4) = -8$; $\\theta = 0 - 0.25(-8) = 2$.`, why:`Move toward the minimum at $\\theta = 4$.`},
        {do:`Step 2: $\\nabla = 2(2-4) = -4$; $\\theta = 2 - 0.25(-4) = 3$.`, why:`Recompute the gradient at $\\theta = 2$ and step again.`}
      ],
      answer:`$\\theta = 3$ (approaching $4$)` },

    { q:`<p>Two features. $J(\\theta) = (\\theta_1 - 1)^2 + 10(\\theta_2 - 1)^2$, gradient $(2(\\theta_1-1),\\ 20(\\theta_2-1))$. From $(0,0)$ with $\\alpha = 0.05$, do one step. Which coordinate moves faster?</p>`,
      steps:[
        {do:`Gradient at $(0,0)$: $(2(-1),\\ 20(-1)) = (-2, -20)$.`, why:`Plug in $\\theta_1 = \\theta_2 = 0$.`},
        {do:`$\\theta_1 = 0 - 0.05(-2) = 0.1$; $\\theta_2 = 0 - 0.05(-20) = 1.0$.`, why:`Each coordinate uses its own gradient.`},
        {do:`$\\theta_2$ moved $10\\times$ farther; very different curvatures force a tiny shared $\\alpha$, slowing the flat direction.`, why:`Ill-conditioned bowls zig-zag and converge slowly.`}
      ],
      answer:`$\\theta = (0.1,\\ 1.0)$; $\\theta_2$ moves faster — unequal curvature slows convergence` },

    { q:`<p>SGD vs batch: a dataset has $m = 1{,}000{,}000$ examples. One batch-gradient step needs how many per-example gradient evaluations, versus one SGD step?</p>`,
      steps:[
        {do:`Batch uses all examples: $1{,}000{,}000$ gradient evaluations per step.`, why:`Batch averages the gradient over the whole dataset.`},
        {do:`SGD uses one example: $1$ evaluation per step.`, why:`SGD estimates the gradient from a single (noisy) sample.`}
      ],
      answer:`Batch: $1{,}000{,}000$ per step; SGD: $1$ per step` }
  ]);

  /* ----------------------------------------------------------------
     ml-linear-regression: harder — 2x2 normal equations, matrix
     inverse, intercept, residuals, ridge.
  ---------------------------------------------------------------- */
  add("ml-linear-regression", [
    { q:`<p>Solve $\\theta = (X^\\top X)^{-1}X^\\top y$ with $X^\\top X = \\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ and $X^\\top y = \\begin{bmatrix}3\\\\3\\end{bmatrix}$. (Inverse of $\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$ is $\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}$.)</p>`,
      steps:[
        {do:`Determinant $= 2{\\cdot}2 - 1{\\cdot}1 = 3$. Inverse $= \\frac{1}{3}\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$.`, why:`Apply the $2\\times 2$ inverse formula.`},
        {do:`$\\theta = \\frac{1}{3}\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}\\begin{bmatrix}3\\\\3\\end{bmatrix} = \\frac{1}{3}\\begin{bmatrix}3\\\\3\\end{bmatrix} = \\begin{bmatrix}1\\\\1\\end{bmatrix}$.`, why:`Multiply the inverse by $X^\\top y$.`}
      ],
      answer:`$\\theta = \\begin{bmatrix}1\\\\1\\end{bmatrix}$` },

    { q:`<p>Fit $y = \\theta_0 + \\theta_1 x$ to $(1,2),(2,3),(3,5)$ using $\\theta_1 = \\frac{\\sum (x-\\bar x)(y-\\bar y)}{\\sum (x-\\bar x)^2}$, $\\theta_0 = \\bar y - \\theta_1 \\bar x$ (round to 3 dp).</p>`,
      steps:[
        {do:`Means: $\\bar x = 2$, $\\bar y = (2+3+5)/3 \\approx 3.333$.`, why:`Center the data.`},
        {do:`Numerator $= (-1)(2-3.333) + 0 + (1)(5-3.333) = 1.333 + 1.667 = 3$. Denominator $= 1 + 0 + 1 = 2$.`, why:`Covariance over variance of $x$.`},
        {do:`$\\theta_1 = 3/2 = 1.5$; $\\theta_0 = 3.333 - 1.5{\\cdot}2 = 0.333$.`, why:`Slope then intercept.`}
      ],
      answer:`$\\theta_1 = 1.5,\\ \\theta_0 \\approx 0.333$` },

    { q:`<p>With the fit $\\theta_0 \\approx 0.333$, $\\theta_1 = 1.5$, predict $y$ at $x = 4$ and find the residual if the true $y$ is $7$ (round to 3 dp).</p>`,
      steps:[
        {do:`$\\hat y = 0.333 + 1.5{\\cdot}4 = 0.333 + 6 = 6.333$.`, why:`Apply the fitted line.`},
        {do:`Residual $= y - \\hat y = 7 - 6.333 = 0.667$.`, why:`Residual is truth minus prediction.`}
      ],
      answer:`$\\hat y \\approx 6.333$; residual $\\approx 0.667$` },

    { q:`<p>Two-feature data with an intercept column. $X = \\begin{bmatrix}1&1\\\\1&2\\\\1&3\\end{bmatrix}$, $y = \\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}$. Compute $X^\\top X$.</p>`,
      steps:[
        {do:`Top-left $= 1+1+1 = 3$ (sum of ones). Off-diagonal $= 1+2+3 = 6$ (sum of $x$).`, why:`$X^\\top X$ entries are dot products of columns.`},
        {do:`Bottom-right $= 1+4+9 = 14$ (sum of $x^2$). So $X^\\top X = \\begin{bmatrix}3&6\\\\6&14\\end{bmatrix}$.`, why:`Last column dotted with itself.`}
      ],
      answer:`$X^\\top X = \\begin{bmatrix}3&6\\\\6&14\\end{bmatrix}$` },

    { q:`<p>Continue: with $X^\\top X = \\begin{bmatrix}3&6\\\\6&14\\end{bmatrix}$ and $X^\\top y = \\begin{bmatrix}6\\\\14\\end{bmatrix}$, solve $\\theta = (X^\\top X)^{-1}X^\\top y$.</p>`,
      steps:[
        {do:`Determinant $= 3{\\cdot}14 - 6{\\cdot}6 = 42 - 36 = 6$. Inverse $= \\frac{1}{6}\\begin{bmatrix}14&-6\\\\-6&3\\end{bmatrix}$.`, why:`$2\\times 2$ inverse formula.`},
        {do:`$\\theta = \\frac{1}{6}\\begin{bmatrix}14{\\cdot}6 - 6{\\cdot}14\\\\-6{\\cdot}6 + 3{\\cdot}14\\end{bmatrix} = \\frac{1}{6}\\begin{bmatrix}0\\\\6\\end{bmatrix} = \\begin{bmatrix}0\\\\1\\end{bmatrix}$.`, why:`The data lie on $y = x$, so intercept $0$, slope $1$.`}
      ],
      answer:`$\\theta = \\begin{bmatrix}0\\\\1\\end{bmatrix}$ (intercept $0$, slope $1$)` },

    { q:`<p>Why might $(X^\\top X)^{-1}$ fail to exist, and what does it mean about the features?</p>`,
      steps:[
        {do:`The inverse fails when $X^\\top X$ is singular (determinant $0$).`, why:`Only invertible matrices have an inverse.`},
        {do:`That happens when columns of $X$ are linearly dependent — one feature is a combination of others.`, why:`Redundant (collinear) features give no unique best $\\theta$.`}
      ],
      answer:`When $X^\\top X$ is singular: features are linearly dependent (collinear)` },

    { q:`<p>Ridge regression adds $\\lambda I$: $\\theta = (X^\\top X + \\lambda I)^{-1}X^\\top y$. With scalar $X^\\top X = 8$, $X^\\top y = 16$, $\\lambda = 2$, find $\\theta$ and compare to the unregularized solution.</p>`,
      steps:[
        {do:`Unregularized: $\\theta = 16/8 = 2$.`, why:`Plain normal equation.`},
        {do:`Ridge: $\\theta = 16/(8+2) = 16/10 = 1.6$.`, why:`The $\\lambda$ shrinks the estimate toward $0$.`}
      ],
      answer:`$\\theta = 1.6$ (vs $2$ unregularized — ridge shrinks it)` },

    { q:`<p>Predict with a fitted two-feature model $\\theta = (0,\\ 1.5,\\ -0.5)$ (intercept, then two slopes) for input $x = (1, 4, 2)$ (first entry is the bias $1$).</p>`,
      steps:[
        {do:`$\\hat y = 0{\\cdot}1 + 1.5{\\cdot}4 + (-0.5){\\cdot}2$.`, why:`Dot weights with the augmented feature vector.`},
        {do:`$= 0 + 6 - 1 = 5$.`, why:`Sum the contributions.`}
      ],
      answer:`$\\hat y = 5$` }
  ]);

  /* ----------------------------------------------------------------
     ml-likelihood: harder — MLE for Gaussian, Poisson, exponential,
     Bernoulli via log-likelihood derivatives.
  ---------------------------------------------------------------- */
  add("ml-likelihood", [
    { q:`<p>The MLE of a Gaussian mean is the sample average. Data: $2, 4, 9$. Find $\\hat\\mu$.</p>`,
      steps:[
        {do:`$\\hat\\mu = \\frac{2 + 4 + 9}{3} = \\frac{15}{3}$.`, why:`Maximizing the Gaussian likelihood over $\\mu$ gives the mean.`},
        {do:`$= 5$.`, why:`Simplify.`}
      ],
      answer:`$\\hat\\mu = 5$` },

    { q:`<p>The MLE of a Gaussian variance (known mean) is $\\hat\\sigma^2 = \\frac{1}{n}\\sum (x_i - \\mu)^2$. Data $2,4,9$, mean $\\mu = 5$. Find $\\hat\\sigma^2$ (round to 3 dp).</p>`,
      steps:[
        {do:`Deviations: $2-5=-3$, $4-5=-1$, $9-5=4$. Squares: $9, 1, 16$.`, why:`Square each deviation from the mean.`},
        {do:`$\\hat\\sigma^2 = \\frac{9+1+16}{3} = \\frac{26}{3} \\approx 8.667$.`, why:`Average the squared deviations (divide by $n$, the MLE convention).`}
      ],
      answer:`$\\hat\\sigma^2 = 26/3 \\approx 8.667$` },

    { q:`<p>The MLE of a Poisson rate $\\lambda$ is the sample mean of the counts. Observed counts: $3, 1, 4, 0$. Find $\\hat\\lambda$.</p>`,
      steps:[
        {do:`Sum the counts: $3 + 1 + 4 + 0 = 8$.`, why:`The Poisson log-likelihood is maximized at the mean count.`},
        {do:`$\\hat\\lambda = 8/4 = 2$.`, why:`Divide by the number of observations.`}
      ],
      answer:`$\\hat\\lambda = 2$` },

    { q:`<p>For Poisson, the log-likelihood from one count $k$ is $\\ell = k\\log\\lambda - \\lambda$ (dropping a constant), with derivative $\\frac{k}{\\lambda} - 1$. Set it to $0$ to find the single-observation MLE.</p>`,
      steps:[
        {do:`Set $\\frac{k}{\\lambda} - 1 = 0 \\Rightarrow \\frac{k}{\\lambda} = 1$.`, why:`The maximum is where the derivative is zero.`},
        {do:`$\\lambda = k$.`, why:`The best rate equals the observed count.`}
      ],
      answer:`$\\hat\\lambda = k$` },

    { q:`<p>The MLE of an exponential rate is $\\hat\\lambda = \\frac{n}{\\sum x_i} = \\frac{1}{\\bar x}$. Waiting times: $2, 3, 5$ ($n = 3$). Find $\\hat\\lambda$.</p>`,
      steps:[
        {do:`Sum $= 2 + 3 + 5 = 10$, $n = 3$.`, why:`The exponential MLE is $n$ over the total.`},
        {do:`$\\hat\\lambda = 3/10 = 0.3$.`, why:`Equivalently $1/\\bar x = 1/3.333$.`}
      ],
      answer:`$\\hat\\lambda = 0.3$` },

    { q:`<p>A Bernoulli log-likelihood for $h$ heads in $n$ flips is $\\ell(\\theta) = h\\log\\theta + (n-h)\\log(1-\\theta)$, derivative $\\frac{h}{\\theta} - \\frac{n-h}{1-\\theta}$. Solve $\\frac{d\\ell}{d\\theta} = 0$ to show $\\hat\\theta = h/n$.</p>`,
      steps:[
        {do:`Set $\\frac{h}{\\theta} = \\frac{n-h}{1-\\theta}$ and cross-multiply: $h(1-\\theta) = (n-h)\\theta$.`, why:`Zero-derivative condition.`},
        {do:`$h - h\\theta = n\\theta - h\\theta \\Rightarrow h = n\\theta$, so $\\theta = h/n$.`, why:`The $h\\theta$ terms cancel.`}
      ],
      answer:`$\\hat\\theta = h/n$` },

    { q:`<p>Compare two Gaussians (variance $1$) for the single point $x = 3$: model A has mean $\\mu = 3$, model B has mean $\\mu = 0$. Likelihood $\\propto \\exp(-\\frac{(x-\\mu)^2}{2})$. Which assigns higher likelihood (3 dp)?</p>`,
      steps:[
        {do:`A: $\\exp(-\\frac{(3-3)^2}{2}) = \\exp(0) = 1$.`, why:`Mean matches the point exactly.`},
        {do:`B: $\\exp(-\\frac{(3-0)^2}{2}) = \\exp(-4.5) \\approx 0.011$.`, why:`The point is far from B's mean.`},
        {do:`$1 > 0.011$, so model A is more likely.`, why:`The Gaussian peaks at its mean.`}
      ],
      answer:`Model A ($1$ vs $\\approx 0.011$)` },

    { q:`<p>Two independent Bernoulli observations: one head, one tail. The likelihood is $L(\\theta) = \\theta(1-\\theta)$ with derivative $1 - 2\\theta$. Maximize it.</p>`,
      steps:[
        {do:`Set $\\frac{dL}{d\\theta} = 1 - 2\\theta = 0$.`, why:`The maximum is at the critical point.`},
        {do:`$\\theta = 1/2 = 0.5$.`, why:`One head and one tail is best explained by a fair coin, matching $h/n = 1/2$.`}
      ],
      answer:`$\\hat\\theta = 0.5$` }
  ]);

  /* ----------------------------------------------------------------
     ml-logistic-regression: harder — two-feature scores, decision
     boundaries, cross-entropy gradient, log-odds.
  ---------------------------------------------------------------- */
  add("ml-logistic-regression", [
    { q:`<p>Weights $\\theta = (\\theta_0,\\theta_1,\\theta_2) = (-3, 1, 1)$ with bias. For $x = (1, 2, 2)$ (first entry bias), find $z = \\theta^\\top x$, then $\\sigma(z)$ (use $\\sigma(1) \\approx 0.73$).</p>`,
      steps:[
        {do:`$z = -3{\\cdot}1 + 1{\\cdot}2 + 1{\\cdot}2 = -3 + 2 + 2 = 1$.`, why:`Dot the weights with the augmented features.`},
        {do:`$\\sigma(1) = \\frac{1}{1+e^{-1}} \\approx 0.73$.`, why:`Apply the sigmoid to $z = 1$.`}
      ],
      answer:`$z = 1$, $\\sigma(z) \\approx 0.73$` },

    { q:`<p>A logistic model has $\\theta = (-6, 2, 3)$ (bias, then $x_1, x_2$). Is the point $(x_1, x_2) = (2, 1)$ classified $1$ or $0$ (threshold $0.5$)?</p>`,
      steps:[
        {do:`Score $z = -6 + 2{\\cdot}2 + 3{\\cdot}1 = -6 + 4 + 3 = 1$.`, why:`Include the bias term.`},
        {do:`$z = 1 > 0$, so $\\sigma(z) > 0.5$: predict class $1$.`, why:`A positive score lands above the $0.5$ threshold.`}
      ],
      answer:`Class $1$ ($z = 1 > 0$)` },

    { q:`<p>The log-odds (logit) is $\\log\\frac{p}{1-p} = z$. If $p = 0.8$, find $z$ (natural log, round to 3 dp).</p>`,
      steps:[
        {do:`Odds $= \\frac{0.8}{0.2} = 4$.`, why:`Odds are probability over its complement.`},
        {do:`$z = \\log 4 \\approx 1.386$.`, why:`The logit is the natural log of the odds.`}
      ],
      answer:`$z \\approx 1.386$` },

    { q:`<p>Cross-entropy gradient for one example is $(\\sigma(z) - y)x$. With $\\sigma(z) = 0.7$, $y = 0$, and feature $x = 3$, find the gradient component.</p>`,
      steps:[
        {do:`$\\sigma(z) - y = 0.7 - 0 = 0.7$.`, why:`Predicted probability minus true label.`},
        {do:`Times the feature: $0.7 \\times 3 = 2.1$.`, why:`The gradient scales with the feature value.`}
      ],
      answer:`Gradient component $= 2.1$` },

    { q:`<p>One logistic GD step. $\\theta = 0$ (one weight, no bias), example $(x, y) = (2, 0)$, $\\alpha = 0.5$, rule $\\theta \\leftarrow \\theta - \\alpha(\\sigma(\\theta x) - y)x$. (Use $\\sigma(0) = 0.5$.)</p>`,
      steps:[
        {do:`Score $z = 0{\\cdot}2 = 0$, $\\sigma(0) = 0.5$.`, why:`Current weight gives a $0$ score.`},
        {do:`Gradient $= (0.5 - 0){\\cdot}2 = 1$.`, why:`Probability minus label, times feature.`},
        {do:`$\\theta = 0 - 0.5{\\cdot}1 = -0.5$.`, why:`A negative weight lowers $\\sigma$ toward the true $0$.`}
      ],
      answer:`$\\theta = -0.5$` },

    { q:`<p>Two examples, scores $z_1 = 2$ (true $y_1 = 1$) and $z_2 = -1$ (true $y_2 = 0$). Using $\\sigma(2) \\approx 0.88$, $\\sigma(-1) \\approx 0.27$, compute the total cross-entropy $-\\sum [y\\log\\sigma + (1-y)\\log(1-\\sigma)]$ (3 dp).</p>`,
      steps:[
        {do:`Example 1 ($y=1$): $-\\log(0.88) \\approx 0.128$.`, why:`Loss for a true 1 is $-\\log p$.`},
        {do:`Example 2 ($y=0$): $-\\log(1-0.27) = -\\log(0.73) \\approx 0.315$.`, why:`Loss for a true 0 is $-\\log(1-p)$.`},
        {do:`Total $\\approx 0.128 + 0.315 = 0.443$.`, why:`Cross-entropy sums over examples.`}
      ],
      answer:`Total $\\approx 0.443$` },

    { q:`<p>A logistic model. By how much does the log-odds change if a feature with weight $\\theta_j = 0.5$ increases by $2$ units? (Log-odds change $= \\theta_j \\Delta x_j$.)</p>`,
      steps:[
        {do:`Change in log-odds $= \\theta_j \\Delta x_j = 0.5 \\times 2 = 1$.`, why:`Each unit of a feature shifts the logit by its weight.`},
        {do:`So the log-odds rise by $1$ (the new logit is the old plus $1$).`, why:`Logistic regression is linear in the log-odds.`}
      ],
      answer:`Log-odds increase by $1$` },

    { q:`<p>For a 2-D logistic model with $\\theta = (\\theta_0, \\theta_1, \\theta_2) = (1, -2, 1)$, write the decision boundary $\\theta^\\top x = 0$ as $x_2$ in terms of $x_1$.</p>`,
      steps:[
        {do:`Boundary: $1 - 2x_1 + x_2 = 0$.`, why:`Set the score to zero (the $\\sigma = 0.5$ contour).`},
        {do:`Solve for $x_2$: $x_2 = 2x_1 - 1$.`, why:`Rearrange the linear equation.`}
      ],
      answer:`$x_2 = 2x_1 - 1$` }
  ]);

  /* ----------------------------------------------------------------
     ml-softmax: harder — three+ class softmax with real numbers,
     cross-entropy loss and gradient, numerical-stability shift,
     temperature scaling.
  ---------------------------------------------------------------- */
  add("ml-softmax", [
    { q:`<p>Three classes, scores $z = (1, 2, 3)$. Use $e^1 \\approx 2.718$, $e^2 \\approx 7.389$, $e^3 \\approx 20.086$. Find all three softmax probabilities (3 dp).</p>`,
      steps:[
        {do:`Sum $= 2.718 + 7.389 + 20.086 = 30.193$.`, why:`The shared denominator.`},
        {do:`$\\phi_1 = 2.718/30.193 \\approx 0.090$; $\\phi_2 = 7.389/30.193 \\approx 0.245$.`, why:`Each exponential over the total.`},
        {do:`$\\phi_3 = 20.086/30.193 \\approx 0.665$. Check: $0.090+0.245+0.665 = 1.000$.`, why:`Probabilities must sum to $1$.`}
      ],
      answer:`$\\phi \\approx (0.090,\\ 0.245,\\ 0.665)$` },

    { q:`<p>Softmax cross-entropy loss is $-\\log \\phi_c$ where $c$ is the true class. From $\\phi = (0.090, 0.245, 0.665)$ with true class $2$, find the loss (3 dp).</p>`,
      steps:[
        {do:`True class is $2$, so loss $= -\\log\\phi_2 = -\\log(0.245)$.`, why:`Cross-entropy uses the probability of the correct class.`},
        {do:`$\\log(0.245) \\approx -1.406$, so loss $\\approx 1.406$.`, why:`The model gave the right class only $0.245$, a sizable penalty.`}
      ],
      answer:`Loss $\\approx 1.406$` },

    { q:`<p>The softmax cross-entropy gradient with respect to score $z_i$ is $\\phi_i - \\mathbb{1}[i = c]$ (predicted minus one-hot). With $\\phi = (0.1, 0.2, 0.7)$ and true class $c = 1$, find the gradient vector.</p>`,
      steps:[
        {do:`One-hot for $c=1$ is $(1, 0, 0)$.`, why:`The target puts all mass on the true class.`},
        {do:`Gradient $= (0.1-1,\\ 0.2-0,\\ 0.7-0) = (-0.9,\\ 0.2,\\ 0.7)$.`, why:`Subtract the one-hot from the predicted probabilities.`}
      ],
      answer:`$(-0.9,\\ 0.2,\\ 0.7)$` },

    { q:`<p>Numerical stability: softmax is unchanged if you subtract the max score from every score. Scores $(10, 11, 12)$ — subtract $12$ to get $(-2, -1, 0)$. Find $\\phi_3$ using $e^{-2}\\approx 0.135$, $e^{-1}\\approx 0.368$, $e^0 = 1$ (3 dp).</p>`,
      steps:[
        {do:`Sum $= 0.135 + 0.368 + 1 = 1.503$.`, why:`Shifting by the max keeps the exponentials small and safe.`},
        {do:`$\\phi_3 = 1/1.503 \\approx 0.665$.`, why:`The largest original score still gets the largest probability.`}
      ],
      answer:`$\\phi_3 \\approx 0.665$` },

    { q:`<p>Four classes with scores $(0, 0, 0, \\ln 7)$. Note $e^{\\ln 7} = 7$. Find $\\phi_4$ exactly.</p>`,
      steps:[
        {do:`Exponentials: $e^0 = 1$ (three times) and $e^{\\ln 7} = 7$.`, why:`The log and exp cancel.`},
        {do:`Sum $= 1 + 1 + 1 + 7 = 10$. $\\phi_4 = 7/10 = 0.7$.`, why:`Divide the top score's exponential by the total.`}
      ],
      answer:`$\\phi_4 = 0.7$` },

    { q:`<p>A 3-class softmax outputs $\\phi = (0.5, 0.3, 0.2)$ with true class $1$. After one gradient step does $\\phi_1$ increase or decrease, and why?</p>`,
      steps:[
        {do:`The gradient $\\phi_i - \\mathbb{1}[i=c]$ for class 1 is $0.5 - 1 = -0.5 < 0$.`, why:`A negative gradient on $z_1$ means descent raises $z_1$.`},
        {do:`Raising $z_1$ raises its exponential and hence $\\phi_1$.`, why:`Softmax gives more probability to higher relative scores.`}
      ],
      answer:`$\\phi_1$ increases (training pushes mass toward the true class)` },

    { q:`<p>Two-class softmax with scores $(z, 0)$ equals the sigmoid. With $z = \\ln 3$ ($e^{\\ln 3} = 3$), find $\\phi_1$ and confirm it matches $\\sigma(\\ln 3)$.</p>`,
      steps:[
        {do:`$\\phi_1 = \\frac{e^{\\ln 3}}{e^{\\ln 3} + e^0} = \\frac{3}{3+1} = 0.75$.`, why:`Apply two-class softmax.`},
        {do:`$\\sigma(\\ln 3) = \\frac{1}{1+e^{-\\ln 3}} = \\frac{1}{1 + 1/3} = \\frac{3}{4} = 0.75$.`, why:`Sigmoid of the same score agrees.`}
      ],
      answer:`$\\phi_1 = 0.75$ (equals the sigmoid)` },

    { q:`<p>Temperature scaling divides scores by $T$ before softmax. Scores $(2, 0)$ with $T = 2$ become $(1, 0)$. Using $e^1 \\approx 2.718$, find $\\phi_1$, and say how higher $T$ affects sharpness (3 dp).</p>`,
      steps:[
        {do:`Scaled scores $(1, 0)$: $\\phi_1 = \\frac{2.718}{2.718 + 1} = \\frac{2.718}{3.718} \\approx 0.731$.`, why:`Divide scores by $T$, then softmax.`},
        {do:`Without scaling ($T=1$, scores $2,0$) $\\phi_1 \\approx 0.881$; higher $T$ makes the distribution flatter.`, why:`Larger $T$ shrinks score gaps, evening out probabilities.`}
      ],
      answer:`$\\phi_1 \\approx 0.731$; higher $T$ softens (flattens) the distribution` }
  ]);

  /* ----------------------------------------------------------------
     ml-glm: harder — canonical links, Poisson/exponential-family form,
     mean from log-partition derivative, link matching.
  ---------------------------------------------------------------- */
  add("ml-glm", [
    { q:`<p>For Poisson regression the canonical link is $\\eta = \\log\\lambda$, so $\\lambda = e^\\eta$. With $\\theta^\\top x = \\eta = \\ln 5$ ($e^{\\ln 5} = 5$), find the predicted mean count.</p>`,
      steps:[
        {do:`$\\lambda = e^\\eta = e^{\\ln 5}$.`, why:`The inverse link exponentiates the linear score.`},
        {do:`$= 5$.`, why:`Exp undoes the log.`}
      ],
      answer:`Predicted count $\\lambda = 5$` },

    { q:`<p>A Poisson GLM has $\\eta = \\theta^\\top x$ with $\\theta = (0.5, 0.2)$ and $x = (2, 5)$. Predict the mean count $\\lambda = e^\\eta$ (use $e^2 \\approx 7.389$).</p>`,
      steps:[
        {do:`$\\eta = 0.5{\\cdot}2 + 0.2{\\cdot}5 = 1 + 1 = 2$.`, why:`Linear score first.`},
        {do:`$\\lambda = e^2 \\approx 7.389$.`, why:`The exponential link gives a positive count.`}
      ],
      answer:`$\\lambda \\approx 7.389$` },

    { q:`<p>Show the Poisson $p(y;\\lambda) = \\frac{\\lambda^y e^{-\\lambda}}{y!}$ is in the exponential family $b(y)\\exp(\\eta\\,T(y) - a(\\eta))$. Identify $\\eta$, $T(y)$, $a(\\eta)$, $b(y)$.</p>`,
      steps:[
        {do:`Rewrite: $\\frac{1}{y!}\\exp(y\\log\\lambda - \\lambda)$.`, why:`$\\lambda^y = e^{y\\log\\lambda}$ and pull out the $1/y!$.`},
        {do:`Match: $\\eta = \\log\\lambda$, $T(y) = y$, $a(\\eta) = \\lambda = e^\\eta$, $b(y) = 1/y!$.`, why:`Compare term by term with the template.`}
      ],
      answer:`$\\eta = \\log\\lambda,\\ T(y) = y,\\ a(\\eta) = e^\\eta,\\ b(y) = 1/y!$` },

    { q:`<p>In a GLM the mean is $\\mu = a'(\\eta)$ (derivative of the log-partition). For Poisson $a(\\eta) = e^\\eta$. Find $\\mu$ at $\\eta = \\ln 4$ ($e^{\\ln 4} = 4$).</p>`,
      steps:[
        {do:`$a'(\\eta) = \\frac{d}{d\\eta}e^\\eta = e^\\eta$.`, why:`The derivative of $e^\\eta$ is itself.`},
        {do:`$\\mu = e^{\\ln 4} = 4$.`, why:`Evaluate at $\\eta = \\ln 4$; the mean equals $\\lambda$.`}
      ],
      answer:`$\\mu = 4$` },

    { q:`<p>For the Bernoulli GLM, $a(\\eta) = \\log(1 + e^\\eta)$ and $\\mu = a'(\\eta) = \\frac{e^\\eta}{1+e^\\eta}$. Confirm this equals the sigmoid and evaluate at $\\eta = 0$.</p>`,
      steps:[
        {do:`$\\frac{e^\\eta}{1+e^\\eta} = \\frac{1}{1+e^{-\\eta}}$ (divide top and bottom by $e^\\eta$).`, why:`Algebraic rearrangement gives the sigmoid.`},
        {do:`At $\\eta = 0$: $\\frac{1}{1+1} = 0.5$.`, why:`The Bernoulli mean is the success probability $\\phi$.`}
      ],
      answer:`Mean $= \\sigma(\\eta)$; at $\\eta = 0$ it is $0.5$` },

    { q:`<p>For a Gaussian GLM (linear regression), $a(\\eta) = \\frac{\\eta^2}{2}$ and $\\mu = a'(\\eta) = \\eta$. With $\\eta = \\theta^\\top x = 7$, find the predicted mean.</p>`,
      steps:[
        {do:`$a'(\\eta) = \\frac{d}{d\\eta}\\frac{\\eta^2}{2} = \\eta$.`, why:`The Gaussian log-partition's derivative is the identity.`},
        {do:`$\\mu = \\eta = 7$.`, why:`Linear regression predicts the natural parameter directly.`}
      ],
      answer:`$\\mu = 7$` },

    { q:`<p>The canonical link maps the mean $\\mu$ to $\\eta$. Match each model — linear, logistic, Poisson — to identity, logit, or log.</p>`,
      steps:[
        {do:`Linear: $\\eta = \\mu$ (identity link).`, why:`The Gaussian mean equals the natural parameter.`},
        {do:`Logistic: $\\eta = \\log\\frac{\\mu}{1-\\mu}$ (logit). Poisson: $\\eta = \\log\\mu$ (log).`, why:`Each canonical link inverts that family's mean function.`}
      ],
      answer:`Linear → identity, Logistic → logit, Poisson → log` },

    { q:`<p>A count GLM predicts $\\eta = -0.5$. Using the log link ($\\lambda = e^\\eta$), find the expected count (use $e^{-0.5} \\approx 0.607$, 3 dp). Why is $\\lambda > 0$ guaranteed?</p>`,
      steps:[
        {do:`$\\lambda = e^{-0.5} \\approx 0.607$.`, why:`Apply the inverse log link.`},
        {do:`$e^\\eta$ is positive for every real $\\eta$, so the predicted count is always positive.`, why:`The log link enforces a valid (non-negative) count mean.`}
      ],
      answer:`$\\lambda \\approx 0.607$; $e^\\eta > 0$ always, so counts stay positive` }
  ]);

})();
