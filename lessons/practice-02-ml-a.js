/* =====================================================================
   PRACTICE PROBLEMS — MODULE 2 (Machine Learning), set A.
   Owned lesson ids: ml-supervised, ml-loss, ml-cost, ml-gradient-descent,
   ml-linear-regression, ml-likelihood, ml-logistic-regression,
   ml-softmax, ml-glm.
   Each id has EXACTLY 10 problems, easy -> hard.
   Notation matches lessons/02-ml.js.
   ===================================================================== */
(function () {
  Object.assign(window.PRACTICE, {

    /* ----------------------------------------------------------------
       ml-supervised: training set, regression vs classification,
       hypothesis h_theta(x), predict with a learned rule.
    ---------------------------------------------------------------- */
    "ml-supervised": [
      { q:`<p>You predict a house's price (in dollars) from its size. Is this <b>regression</b> or <b>classification</b>?</p>`,
        steps:[
          {do:`The answer $y$ is a price, which is a number.`, why:`Regression means the output is a number.`},
          {do:`So this is regression.`, why:`Classification would need a category, not a number.`}
        ],
        answer:`Regression` },

      { q:`<p>You predict whether an email is spam or not spam. Is this <b>regression</b> or <b>classification</b>?</p>`,
        steps:[
          {do:`The answer $y$ is "spam" or "not spam", a category.`, why:`Classification means the output is a category.`},
          {do:`So this is classification.`, why:`There is no number to predict, only a label.`}
        ],
        answer:`Classification` },

      { q:`<p>A training set has these pairs: $(x^{(1)},y^{(1)}),(x^{(2)},y^{(2)}),(x^{(3)},y^{(3)}),(x^{(4)},y^{(4)})$. What is $m$?</p>`,
        steps:[
          {do:`$m$ counts the example pairs.`, why:`$m$ is how many training examples you have.`},
          {do:`Count them: there are 4 pairs.`, why:`The labels go from $(1)$ to $(4)$.`}
        ],
        answer:`$m = 4$` },

      { q:`<p>A learned rule is $h_\\theta(x) = 200x$ (price = 200 per sq ft). Predict the price for a $1500$ sq ft house.</p>`,
        steps:[
          {do:`Plug in $x = 1500$: $h_\\theta(1500) = 200 \\times 1500$.`, why:`The hypothesis turns an input into a prediction.`},
          {do:`$200 \\times 1500 = 300000$.`, why:`Just multiply.`}
        ],
        answer:`$h_\\theta(1500) = 300000$` },

      { q:`<p>The rule is $h_\\theta(x) = 5x + 3$. Predict the output for input $x = 4$.</p>`,
        steps:[
          {do:`Plug in $x = 4$: $5 \\times 4 + 3$.`, why:`Substitute the input into the rule.`},
          {do:`$20 + 3 = 23$.`, why:`Multiply first, then add.`}
        ],
        answer:`$h_\\theta(4) = 23$` },

      { q:`<p>You predict tomorrow's temperature in degrees. Regression or classification? What is $y$?</p>`,
        steps:[
          {do:`Temperature is a number (like $21.5$ degrees).`, why:`A numeric output means regression.`},
          {do:`So it is regression, and $y$ is the temperature value.`, why:`$y$ is the true answer for an example.`}
        ],
        answer:`Regression; $y$ is the temperature (a number)` },

      { q:`<p>You classify a photo as cat, dog, or bird. Is this regression or classification? How many classes are there?</p>`,
        steps:[
          {do:`The answer is one of three labels: cat, dog, bird.`, why:`Labels (categories) mean classification.`},
          {do:`There are 3 classes.`, why:`Count the distinct categories.`}
        ],
        answer:`Classification; 3 classes` },

      { q:`<p>Training pairs $(x,y)$: $(1,3),(2,5),(3,7)$. Each $y$ follows $y = 2x + 1$. Predict $y$ for a new $x = 5$.</p>`,
        steps:[
          {do:`Check the pattern: $2(1)+1=3$, $2(2)+1=5$, $2(3)+1=7$. It fits.`, why:`A good rule matches the training answers.`},
          {do:`Apply $h_\\theta(x)=2x+1$ at $x=5$: $2\\times 5 + 1 = 11$.`, why:`Use the learned rule on the new input.`}
        ],
        answer:`$h_\\theta(5) = 11$` },

      { q:`<p>A spam label is written as $y = 1$ for spam and $y = 0$ for not spam. An email is spam. What is $y^{(i)}$, and is the task regression or classification?</p>`,
        steps:[
          {do:`Spam means $y^{(i)} = 1$.`, why:`The label is encoded as a number, but it still names a category.`},
          {do:`The output is a category (spam vs not), so it is classification.`, why:`Using 0/1 does not make it regression; the answer is still a class.`}
        ],
        answer:`$y^{(i)} = 1$; classification` },

      { q:`<p>You have $m = 3$ examples with inputs $x^{(1)}=2, x^{(2)}=4, x^{(3)}=6$ and answers $y^{(1)}=6, y^{(2)}=12, y^{(3)}=18$. Find a rule $h_\\theta(x)=\\theta x$ that fits, then predict $y$ for $x = 10$.</p>`,
        steps:[
          {do:`Each answer is 3 times the input: $6/2=3$, $12/4=3$, $18/6=3$.`, why:`A constant ratio means $\\theta = 3$ fits all examples.`},
          {do:`So $h_\\theta(x) = 3x$. At $x = 10$: $3 \\times 10 = 30$.`, why:`Use the fitted rule on the new input.`}
        ],
        answer:`$\\theta = 3$, so $h_\\theta(10) = 30$` }
    ],

    /* ----------------------------------------------------------------
       ml-loss: least-squared loss L(z,y) = (1/2)(y-z)^2.
       Plus hinge-loss and cross-entropy taste at the hard end.
    ---------------------------------------------------------------- */
    "ml-loss": [
      { q:`<p>True value $y = 5$, prediction $z = 5$. Find the least-squared loss $L = \\frac{1}{2}(y-z)^2$.</p>`,
        steps:[
          {do:`Gap: $y - z = 5 - 5 = 0$.`, why:`The loss measures the gap between truth and prediction.`},
          {do:`$L = \\frac{1}{2}(0)^2 = 0$.`, why:`A perfect prediction has zero loss.`}
        ],
        answer:`$L = 0$` },

      { q:`<p>True value $y = 10$, prediction $z = 8$. Find $L = \\frac{1}{2}(y-z)^2$.</p>`,
        steps:[
          {do:`Gap: $10 - 8 = 2$.`, why:`Subtract prediction from truth.`},
          {do:`$L = \\frac{1}{2}(2)^2 = \\frac{1}{2}\\times 4 = 2$.`, why:`Square the gap, then halve it.`}
        ],
        answer:`$L = 2$` },

      { q:`<p>True value $y = 7$, prediction $z = 10$. Find $L = \\frac{1}{2}(y-z)^2$.</p>`,
        steps:[
          {do:`Gap: $7 - 10 = -3$.`, why:`The gap can be negative.`},
          {do:`$L = \\frac{1}{2}(-3)^2 = \\frac{1}{2}\\times 9 = 4.5$.`, why:`Squaring removes the minus sign.`}
        ],
        answer:`$L = 4.5$` },

      { q:`<p>True value $y = 300$, prediction $z = 280$. Find $L = \\frac{1}{2}(y-z)^2$.</p>`,
        steps:[
          {do:`Gap: $300 - 280 = 20$.`, why:`Subtract.`},
          {do:`$L = \\frac{1}{2}(20)^2 = \\frac{1}{2}\\times 400 = 200$.`, why:`Square then halve.`}
        ],
        answer:`$L = 200$` },

      { q:`<p>For $y = 6$, prediction A is $z = 4$ and prediction B is $z = 8$. Which has the larger least-squared loss?</p>`,
        steps:[
          {do:`A: gap $6-4=2$, $L=\\frac{1}{2}(2)^2 = 2$.`, why:`Compute each loss.`},
          {do:`B: gap $6-8=-2$, $L=\\frac{1}{2}(-2)^2 = 2$.`, why:`Squaring makes both gaps count the same.`},
          {do:`They are equal: both $L = 2$.`, why:`Equal-sized gaps give equal loss.`}
        ],
        answer:`Equal: both $L = 2$` },

      { q:`<p>If the gap $y - z$ doubles from $2$ to $4$, how does the least-squared loss change?</p>`,
        steps:[
          {do:`Gap $2$: $L = \\frac{1}{2}(2)^2 = 2$.`, why:`Start value.`},
          {do:`Gap $4$: $L = \\frac{1}{2}(4)^2 = 8$.`, why:`Doubled gap.`},
          {do:`$8 / 2 = 4$, so the loss grew 4 times.`, why:`Squaring means double the gap gives four times the loss.`}
        ],
        answer:`Loss grows 4 times (from $2$ to $8$)` },

      { q:`<p>A correct label is $y = +1$. The model's raw score is $z = 0.3$. Hinge loss is $\\max(0,\\,1 - yz)$. Find it.</p>`,
        steps:[
          {do:`Compute $yz = (+1)(0.3) = 0.3$.`, why:`Hinge loss uses the score times the true label.`},
          {do:`$1 - yz = 1 - 0.3 = 0.7$.`, why:`The margin shortfall.`},
          {do:`$\\max(0, 0.7) = 0.7$.`, why:`The point is inside the margin, so it is penalized.`}
        ],
        answer:`Hinge loss $= 0.7$` },

      { q:`<p>A correct label is $y = +1$. The model's score is $z = 2$. Hinge loss is $\\max(0,\\,1 - yz)$. Find it.</p>`,
        steps:[
          {do:`$yz = (+1)(2) = 2$.`, why:`Score times true label.`},
          {do:`$1 - yz = 1 - 2 = -1$.`, why:`The margin is comfortably met.`},
          {do:`$\\max(0, -1) = 0$.`, why:`A confident, correct prediction gets zero hinge loss.`}
        ],
        answer:`Hinge loss $= 0$` },

      { q:`<p>True label $y = 1$. The model predicts probability $p = 0.8$. Cross-entropy loss is $-\\log(p)$ (natural log). Find it. Round to 3 decimals.</p>`,
        steps:[
          {do:`Since $y = 1$, loss $= -\\log(0.8)$.`, why:`Cross-entropy for label 1 punishes a low predicted probability.`},
          {do:`$\\log(0.8) \\approx -0.223$, so $-\\log(0.8) \\approx 0.223$.`, why:`Probability $0.8$ is fairly close to 1, so the loss is small.`}
        ],
        answer:`$\\approx 0.223$` },

      { q:`<p>True label $y = 1$. The model predicts $p = 0.2$. Cross-entropy loss is $-\\log(p)$. Find it (round to 3 decimals) and compare with $p = 0.8$.</p>`,
        steps:[
          {do:`Loss $= -\\log(0.2)$.`, why:`Label is 1, so we use $-\\log(p)$.`},
          {do:`$\\log(0.2) \\approx -1.609$, so loss $\\approx 1.609$.`, why:`Compute the natural log.`},
          {do:`$1.609 &gt; 0.223$.`, why:`A confidently wrong prediction is punished far more than a confidently right one.`}
        ],
        answer:`$\\approx 1.609$ (much larger than $0.223$)` }
    ],

    /* ----------------------------------------------------------------
       ml-cost: J(theta) = sum of per-example losses.
    ---------------------------------------------------------------- */
    "ml-cost": [
      { q:`<p>Per-example losses are $3$ and $5$. Find the cost $J(\\theta) = \\sum_i L_i$.</p>`,
        steps:[
          {do:`Add the losses: $3 + 5$.`, why:`Cost is the total loss over all examples.`},
          {do:`$3 + 5 = 8$.`, why:`Just sum.`}
        ],
        answer:`$J(\\theta) = 8$` },

      { q:`<p>Three examples have losses $200, 50, 0$. Find the cost $J(\\theta)$.</p>`,
        steps:[
          {do:`Sum: $200 + 50 + 0$.`, why:`Add every example's loss.`},
          {do:`$= 250$.`, why:`Total over the dataset.`}
        ],
        answer:`$J(\\theta) = 250$` },

      { q:`<p>Cost was $J = 8$ from losses $3$ and $5$. A better $\\theta$ cuts the second loss to $1$. What is the new cost?</p>`,
        steps:[
          {do:`New losses: $3$ and $1$.`, why:`Only the second loss changed.`},
          {do:`$J = 3 + 1 = 4$.`, why:`Lower loss means lower cost.`}
        ],
        answer:`$J(\\theta) = 4$` },

      { q:`<p>Two examples. Truths $y^{(1)}=5, y^{(2)}=8$. Predictions $z^{(1)}=4, z^{(2)}=10$. Using $L=\\frac{1}{2}(y-z)^2$, find the cost.</p>`,
        steps:[
          {do:`Example 1: gap $5-4=1$, $L_1 = \\frac{1}{2}(1)^2 = 0.5$.`, why:`Compute each loss with the squared-loss formula.`},
          {do:`Example 2: gap $8-10=-2$, $L_2 = \\frac{1}{2}(-2)^2 = 2$.`, why:`Squaring handles the negative gap.`},
          {do:`$J = 0.5 + 2 = 2.5$.`, why:`Sum the per-example losses.`}
        ],
        answer:`$J(\\theta) = 2.5$` },

      { q:`<p>Model $h_\\theta(x) = 2x$. Data: $(x,y) = (1,2),(2,5)$. Using $L=\\frac{1}{2}(y-z)^2$, find the cost.</p>`,
        steps:[
          {do:`Predict: $h(1)=2$, $h(2)=4$.`, why:`Apply the model to each input.`},
          {do:`Losses: $\\frac{1}{2}(2-2)^2 = 0$ and $\\frac{1}{2}(5-4)^2 = 0.5$.`, why:`Squared loss per example.`},
          {do:`$J = 0 + 0.5 = 0.5$.`, why:`Add them.`}
        ],
        answer:`$J(\\theta) = 0.5$` },

      { q:`<p>Three examples have losses $4, 4, 4$. What is the cost? What is the average loss per example?</p>`,
        steps:[
          {do:`Cost: $4 + 4 + 4 = 12$.`, why:`Sum all losses.`},
          {do:`Average: $12 / 3 = 4$.`, why:`Divide the total by the number of examples.`}
        ],
        answer:`$J = 12$; average $= 4$` },

      { q:`<p>Model $h_\\theta(x) = 3x$. Data: $(1,3),(2,6),(3,10)$. Using $L=\\frac{1}{2}(y-z)^2$, find the cost.</p>`,
        steps:[
          {do:`Predict: $3,6,9$.`, why:`Apply $h(x)=3x$.`},
          {do:`Losses: $\\frac{1}{2}(0)^2=0$, $\\frac{1}{2}(0)^2=0$, $\\frac{1}{2}(10-9)^2=0.5$.`, why:`Only the third example is off.`},
          {do:`$J = 0 + 0 + 0.5 = 0.5$.`, why:`Sum the losses.`}
        ],
        answer:`$J(\\theta) = 0.5$` },

      { q:`<p>Model A has cost $J = 12$. Model B has cost $J = 7$. Which model fits the data better?</p>`,
        steps:[
          {do:`Compare: $7 &lt; 12$.`, why:`Lower cost means less total error.`},
          {do:`Model B fits better.`, why:`Training aims to make the cost as small as possible.`}
        ],
        answer:`Model B (lower cost)` },

      { q:`<p>Model $h_\\theta(x) = \\theta x$ with $\\theta = 1$. Data: $(1,2),(2,2)$. Using $L=\\frac{1}{2}(y-z)^2$, find the cost.</p>`,
        steps:[
          {do:`Predict: $h(1)=1$, $h(2)=2$.`, why:`Apply $h(x)=x$.`},
          {do:`Losses: $\\frac{1}{2}(2-1)^2 = 0.5$ and $\\frac{1}{2}(2-2)^2 = 0$.`, why:`Squared loss per point.`},
          {do:`$J = 0.5 + 0 = 0.5$.`, why:`Sum the losses.`}
        ],
        answer:`$J(\\theta) = 0.5$` },

      { q:`<p>Compare two models on data $(1,2),(2,4)$ using $L=\\frac{1}{2}(y-z)^2$. Model A: $h(x)=2x$. Model B: $h(x)=x+1$. Which has lower cost?</p>`,
        steps:[
          {do:`Model A predicts $2,4$. Losses: $\\frac{1}{2}(0)^2 = 0$, $\\frac{1}{2}(0)^2 = 0$. $J_A = 0$.`, why:`Model A fits both points exactly.`},
          {do:`Model B predicts $2,3$. Losses: $\\frac{1}{2}(2-2)^2 = 0$, $\\frac{1}{2}(4-3)^2 = 0.5$. $J_B = 0.5$.`, why:`Model B misses the second point.`},
          {do:`$J_A = 0 &lt; J_B = 0.5$.`, why:`Lower cost wins.`}
        ],
        answer:`Model A ($J = 0$)` }
    ],

    /* ----------------------------------------------------------------
       ml-gradient-descent: theta <- theta - alpha * grad J.
    ---------------------------------------------------------------- */
    "ml-gradient-descent": [
      { q:`<p>Minimize $J(\\theta)=\\theta^2$. Start at $\\theta = 5$ with learning rate $\\alpha = 0.1$. Do one gradient-descent step.</p>`,
        steps:[
          {do:`Gradient: $\\nabla J = 2\\theta = 2 \\times 5 = 10$.`, why:`The derivative of $\\theta^2$ is $2\\theta$; it points uphill.`},
          {do:`Update: $\\theta \\leftarrow 5 - 0.1 \\times 10 = 5 - 1 = 4$.`, why:`Step opposite the gradient (downhill) by the learning rate.`}
        ],
        answer:`$\\theta = 4$` },

      { q:`<p>Minimize $J(\\theta)=\\theta^2$. Start at $\\theta = 3$ with $\\alpha = 0.5$. Do one step.</p>`,
        steps:[
          {do:`Gradient: $\\nabla J = 2 \\times 3 = 6$.`, why:`Derivative of $\\theta^2$ is $2\\theta$.`},
          {do:`Update: $\\theta \\leftarrow 3 - 0.5 \\times 6 = 3 - 3 = 0$.`, why:`One big step lands at the minimum.`}
        ],
        answer:`$\\theta = 0$` },

      { q:`<p>Minimize $J(\\theta)=\\theta^2$. Start at $\\theta = 4$, $\\alpha = 0.1$. Do TWO steps.</p>`,
        steps:[
          {do:`Step 1: $\\nabla J = 2\\times 4 = 8$, so $\\theta \\leftarrow 4 - 0.1\\times 8 = 3.2$.`, why:`First downhill step.`},
          {do:`Step 2: $\\nabla J = 2\\times 3.2 = 6.4$, so $\\theta \\leftarrow 3.2 - 0.1\\times 6.4 = 2.56$.`, why:`Recompute the gradient at the new point, then step again.`}
        ],
        answer:`$\\theta = 2.56$` },

      { q:`<p>Minimize $J(\\theta)=\\theta^2$. Start at $\\theta = -6$, $\\alpha = 0.1$. Do one step.</p>`,
        steps:[
          {do:`Gradient: $\\nabla J = 2 \\times (-6) = -12$.`, why:`The gradient is negative on the left side of the bowl.`},
          {do:`Update: $\\theta \\leftarrow -6 - 0.1\\times(-12) = -6 + 1.2 = -4.8$.`, why:`Subtracting a negative moves $\\theta$ right, toward zero.`}
        ],
        answer:`$\\theta = -4.8$` },

      { q:`<p>Minimize $J(\\theta) = (\\theta - 3)^2$. Its gradient is $2(\\theta - 3)$. Start at $\\theta = 0$, $\\alpha = 0.5$. Do one step.</p>`,
        steps:[
          {do:`Gradient: $2(0 - 3) = -6$.`, why:`The minimum is at $\\theta = 3$; the gradient points away from it.`},
          {do:`Update: $\\theta \\leftarrow 0 - 0.5\\times(-6) = 0 + 3 = 3$.`, why:`The step moves straight to the minimum at $3$.`}
        ],
        answer:`$\\theta = 3$` },

      { q:`<p>Why does gradient descent <i>subtract</i> the gradient instead of adding it?</p>`,
        steps:[
          {do:`The gradient $\\nabla J$ points in the uphill direction (cost grows fastest).`, why:`That is the definition of the gradient.`},
          {do:`We want to lower the cost, so we move the opposite way: subtract the gradient.`, why:`Going downhill reduces $J(\\theta)$.`}
        ],
        answer:`To go downhill (lower cost), step opposite the uphill gradient.` },

      { q:`<p>Minimize $J(\\theta)=\\theta^2$ from $\\theta = 1$. Compare $\\alpha = 0.1$ vs $\\alpha = 2$ for one step.</p>`,
        steps:[
          {do:`Gradient at $\\theta=1$: $2\\times 1 = 2$.`, why:`Same gradient for both.`},
          {do:`$\\alpha=0.1$: $\\theta \\leftarrow 1 - 0.1\\times 2 = 0.8$. Closer to $0$.`, why:`A small step makes steady progress.`},
          {do:`$\\alpha=2$: $\\theta \\leftarrow 1 - 2\\times 2 = -3$. Farther from $0$.`, why:`A too-large step overshoots and the cost gets worse.`}
        ],
        answer:`$\\alpha=0.1 \\Rightarrow \\theta=0.8$ (good); $\\alpha=2 \\Rightarrow \\theta=-3$ (overshoots)` },

      { q:`<p>Linear regression cost gradient for one feature is $\\nabla J = (h_\\theta(x) - y)\\,x$, with $h_\\theta(x)=\\theta x$. At $\\theta = 0$, data $(x,y)=(2,6)$, $\\alpha = 0.1$. Do one step.</p>`,
        steps:[
          {do:`Predict: $h_\\theta(2) = 0 \\times 2 = 0$.`, why:`Apply the model at the current $\\theta$.`},
          {do:`Gradient: $(0 - 6)\\times 2 = -12$.`, why:`Error times the feature.`},
          {do:`Update: $\\theta \\leftarrow 0 - 0.1\\times(-12) = 1.2$.`, why:`Step downhill; $\\theta$ moves toward the true slope $3$.`}
        ],
        answer:`$\\theta = 1.2$` },

      { q:`<p>Two parameters. $\\nabla J = \\begin{bmatrix}4\\\\-2\\end{bmatrix}$ at $\\theta = \\begin{bmatrix}1\\\\1\\end{bmatrix}$, $\\alpha = 0.5$. Do one step.</p>`,
        steps:[
          {do:`Scale the gradient: $0.5\\times\\begin{bmatrix}4\\\\-2\\end{bmatrix} = \\begin{bmatrix}2\\\\-1\\end{bmatrix}$.`, why:`Multiply the whole gradient by the learning rate.`},
          {do:`Subtract: $\\begin{bmatrix}1\\\\1\\end{bmatrix} - \\begin{bmatrix}2\\\\-1\\end{bmatrix} = \\begin{bmatrix}-1\\\\2\\end{bmatrix}$.`, why:`Update each parameter the same way at once.`}
        ],
        answer:`$\\theta = \\begin{bmatrix}-1\\\\2\\end{bmatrix}$` },

      { q:`<p>Minimize $J(\\theta)=\\theta^2$ from $\\theta = 10$, $\\alpha = 0.1$. Do THREE steps and describe the trend.</p>`,
        steps:[
          {do:`Step 1: $\\theta \\leftarrow 10 - 0.1\\times 20 = 8$.`, why:`$\\nabla J = 2\\times 10 = 20$.`},
          {do:`Step 2: $\\theta \\leftarrow 8 - 0.1\\times 16 = 6.4$.`, why:`$\\nabla J = 2\\times 8 = 16$.`},
          {do:`Step 3: $\\theta \\leftarrow 6.4 - 0.1\\times 12.8 = 5.12$.`, why:`$\\theta$ keeps shrinking toward $0$, the minimum.`}
        ],
        answer:`$\\theta = 5.12$ (steadily approaching $0$)` }
    ],

    /* ----------------------------------------------------------------
       ml-linear-regression: h=theta^T x and theta=(X^T X)^{-1} X^T y.
    ---------------------------------------------------------------- */
    "ml-linear-regression": [
      { q:`<p>Weights $\\theta = \\begin{bmatrix}2\\\\3\\end{bmatrix}$, features $x = \\begin{bmatrix}1\\\\4\\end{bmatrix}$. Predict $h_\\theta(x) = \\theta^\\top x$.</p>`,
        steps:[
          {do:`Dot product: $2\\times 1 + 3\\times 4$.`, why:`$\\theta^\\top x$ multiplies matching entries and adds.`},
          {do:`$= 2 + 12 = 14$.`, why:`Sum the products.`}
        ],
        answer:`$h_\\theta(x) = 14$` },

      { q:`<p>Weights $\\theta = \\begin{bmatrix}1\\\\-2\\end{bmatrix}$, features $x = \\begin{bmatrix}3\\\\5\\end{bmatrix}$. Predict $\\theta^\\top x$.</p>`,
        steps:[
          {do:`$1\\times 3 + (-2)\\times 5$.`, why:`Dot product of weights and features.`},
          {do:`$= 3 - 10 = -7$.`, why:`Add the products.`}
        ],
        answer:`$h_\\theta(x) = -7$` },

      { q:`<p>With a bias term, $\\theta = \\begin{bmatrix}1\\\\2\\end{bmatrix}$ and $x = \\begin{bmatrix}1\\\\3\\end{bmatrix}$ (first entry is the bias, always $1$). Predict $\\theta^\\top x$.</p>`,
        steps:[
          {do:`$1\\times 1 + 2\\times 3$.`, why:`The bias term ($x_0 = 1$) lets the line have an intercept.`},
          {do:`$= 1 + 6 = 7$.`, why:`Sum the products.`}
        ],
        answer:`$h_\\theta(x) = 7$` },

      { q:`<p>One feature. $X^\\top X = 14$ and $X^\\top y = 28$. Solve $\\theta = (X^\\top X)^{-1}X^\\top y$.</p>`,
        steps:[
          {do:`Inverse of a single number $14$ is $1/14$.`, why:`For a $1\\times 1$ matrix, the inverse is the reciprocal.`},
          {do:`$\\theta = 28 / 14 = 2$.`, why:`Multiply by the reciprocal.`}
        ],
        answer:`$\\theta = 2$` },

      { q:`<p>One feature. $X^\\top X = 10$ and $X^\\top y = 30$. Solve $\\theta = (X^\\top X)^{-1}X^\\top y$.</p>`,
        steps:[
          {do:`$\\theta = 30 / 10$.`, why:`Reciprocal of $10$ times $30$.`},
          {do:`$= 3$.`, why:`The best-fit slope is $3$.`}
        ],
        answer:`$\\theta = 3$` },

      { q:`<p>Data $(x,y) = (1,2),(2,4),(3,6)$ as a column $X$ and column $y$. Compute $X^\\top X$ and $X^\\top y$, then $\\theta$.</p>`,
        steps:[
          {do:`$X^\\top X = 1{\\cdot}1 + 2{\\cdot}2 + 3{\\cdot}3 = 1 + 4 + 9 = 14$.`, why:`Sum of squares of the feature column.`},
          {do:`$X^\\top y = 1{\\cdot}2 + 2{\\cdot}4 + 3{\\cdot}6 = 2 + 8 + 18 = 28$.`, why:`Dot product of feature and answer columns.`},
          {do:`$\\theta = 28 / 14 = 2$.`, why:`The line $y = 2x$ fits exactly.`}
        ],
        answer:`$\\theta = 2$` },

      { q:`<p>The fitted model is $h_\\theta(x) = \\theta^\\top x$ with $\\theta = \\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}$. Predict for $x = \\begin{bmatrix}1\\\\1\\\\1\\end{bmatrix}$.</p>`,
        steps:[
          {do:`$1\\times 1 + 2\\times 1 + 3\\times 1$.`, why:`Dot product with all-ones features.`},
          {do:`$= 1 + 2 + 3 = 6$.`, why:`Sum the weights.`}
        ],
        answer:`$h_\\theta(x) = 6$` },

      { q:`<p>Data $(x,y) = (1,3),(2,6),(3,9)$ as columns. Use the normal equations to find $\\theta$, then predict for $x = 5$.</p>`,
        steps:[
          {do:`$X^\\top X = 1 + 4 + 9 = 14$.`, why:`Sum of squared features.`},
          {do:`$X^\\top y = 1{\\cdot}3 + 2{\\cdot}6 + 3{\\cdot}9 = 3 + 12 + 27 = 42$.`, why:`Dot product of features with answers.`},
          {do:`$\\theta = 42 / 14 = 3$. Predict $h_\\theta(5) = 3\\times 5 = 15$.`, why:`The line $y = 3x$ fits; apply it at $x = 5$.`}
        ],
        answer:`$\\theta = 3$, $h_\\theta(5) = 15$` },

      { q:`<p>A diagonal $X^\\top X = \\begin{bmatrix}2&0\\\\0&5\\end{bmatrix}$ and $X^\\top y = \\begin{bmatrix}4\\\\10\\end{bmatrix}$. Find $\\theta = (X^\\top X)^{-1}X^\\top y$.</p>`,
        steps:[
          {do:`Inverse of a diagonal matrix flips each diagonal entry: $(X^\\top X)^{-1} = \\begin{bmatrix}1/2&0\\\\0&1/5\\end{bmatrix}$.`, why:`For a diagonal matrix, invert each diagonal number.`},
          {do:`Multiply: $\\theta = \\begin{bmatrix}\\tfrac12\\times 4+0\\times 10\\\\0\\times 4+\\tfrac15\\times 10\\end{bmatrix} = \\begin{bmatrix}2+0\\\\0+2\\end{bmatrix} = \\begin{bmatrix}2\\\\2\\end{bmatrix}$.`, why:`Dot each row with the vector. The off-diagonal $0$s drop out, so each parameter solves independently.`}
        ],
        answer:`$\\theta = \\begin{bmatrix}2\\\\2\\end{bmatrix}$` },

      { q:`<p>Why can linear regression use the closed form $\\theta = (X^\\top X)^{-1}X^\\top y$ instead of gradient descent?</p>`,
        steps:[
          {do:`The squared-error cost is a smooth bowl with exactly one bottom.`, why:`A convex cost has a single global minimum.`},
          {do:`Setting its gradient to zero gives this formula, which jumps straight to that bottom.`, why:`No iterative stepping is needed when an exact solution exists.`}
        ],
        answer:`The cost is a convex bowl, so the gradient-equals-zero condition has one exact closed-form solution.` }
    ],

    /* ----------------------------------------------------------------
       ml-likelihood: L(theta)=product of probabilities; MLE = fraction.
    ---------------------------------------------------------------- */
    "ml-likelihood": [
      { q:`<p>A coin is flipped $4$ times: H, H, H, T. By maximum likelihood, what is the best heads-probability $\\theta$?</p>`,
        steps:[
          {do:`Count heads: $3$ of $4$ flips.`, why:`The MLE for a coin is the observed fraction of heads.`},
          {do:`$\\theta = 3/4 = 0.75$.`, why:`This $\\theta$ makes the observed data most probable.`}
        ],
        answer:`$\\theta = 0.75$` },

      { q:`<p>A coin shows $7$ heads in $10$ flips. By maximum likelihood, find $\\theta$.</p>`,
        steps:[
          {do:`Fraction of heads: $7/10$.`, why:`MLE for a coin is just the heads fraction.`},
          {do:`$\\theta = 0.7$.`, why:`This best explains the data.`}
        ],
        answer:`$\\theta = 0.7$` },

      { q:`<p>Two independent coin flips both land heads. With heads-probability $\\theta = 0.5$, what is the likelihood of this data?</p>`,
        steps:[
          {do:`Independent events multiply: $L = 0.5 \\times 0.5$.`, why:`The likelihood of all the data is the product of each event's probability.`},
          {do:`$= 0.25$.`, why:`Two heads at probability $0.5$ each.`}
        ],
        answer:`$L = 0.25$` },

      { q:`<p>Data: H, T, H with heads-probability $\\theta = 0.6$. Find the likelihood $L(\\theta)$.</p>`,
        steps:[
          {do:`$P(H)=0.6$, $P(T)=0.4$, $P(H)=0.6$.`, why:`Tails has probability $1-\\theta = 0.4$.`},
          {do:`$L = 0.6 \\times 0.4 \\times 0.6 = 0.144$.`, why:`Multiply the per-flip probabilities.`}
        ],
        answer:`$L = 0.144$` },

      { q:`<p>For $7$ heads in $10$ flips, $L(\\theta)=\\theta^7(1-\\theta)^3$ (times a constant). Compare $\\theta = 0.5$ and $\\theta = 0.7$.</p>`,
        steps:[
          {do:`$\\theta=0.5$: $0.5^7 \\times 0.5^3 = 0.5^{10} \\approx 0.00098$.`, why:`Plug into the likelihood formula.`},
          {do:`$\\theta=0.7$: $0.7^7 \\times 0.3^3 \\approx 0.0823 \\times 0.027 \\approx 0.00222$.`, why:`Compute the other candidate.`},
          {do:`$0.00222 &gt; 0.00098$, so $\\theta = 0.7$ is more likely.`, why:`Higher likelihood means it explains the data better.`}
        ],
        answer:`$\\theta = 0.7$ (higher likelihood, $\\approx 0.00222$)` },

      { q:`<p>Why do we maximize the <b>log</b>-likelihood $\\log L(\\theta)$ instead of $L(\\theta)$ itself?</p>`,
        steps:[
          {do:`$L(\\theta)$ is a product of many small probabilities, which is awkward.`, why:`Products underflow and are hard to differentiate.`},
          {do:`$\\log$ turns the product into a sum, and is increasing, so the same $\\theta$ wins.`, why:`Maximizing the log gives the same answer, with easier math.`}
        ],
        answer:`Log turns the product into a sum and keeps the same maximizing $\\theta$.` },

      { q:`<p>Data: H, H. Likelihood is $L(\\theta) = \\theta^2$. Its log-likelihood is $\\ell(\\theta) = 2\\log\\theta$. As $\\theta$ rises toward $1$, does $\\ell$ rise or fall?</p>`,
        steps:[
          {do:`$\\log\\theta$ increases as $\\theta$ increases.`, why:`Log is an increasing function.`},
          {do:`So $\\ell(\\theta) = 2\\log\\theta$ rises, peaking at $\\theta = 1$.`, why:`Two heads are most likely when heads is certain ($\\theta = 1$).`}
        ],
        answer:`It rises; the maximum is at $\\theta = 1$.` },

      { q:`<p>Out of $20$ emails, $5$ are spam. By maximum likelihood, estimate $P(\\text{spam})$.</p>`,
        steps:[
          {do:`Spam fraction: $5/20$.`, why:`MLE for a yes/no rate is the observed proportion.`},
          {do:`$= 0.25$.`, why:`Simplify the fraction.`}
        ],
        answer:`$P(\\text{spam}) = 0.25$` },

      { q:`<p>A log-likelihood for a coin is $\\ell(\\theta) = 3\\log\\theta + 1\\log(1-\\theta)$ (3 heads, 1 tail). Its derivative is $\\frac{3}{\\theta} - \\frac{1}{1-\\theta}$. Set it to $0$ and solve for $\\theta$.</p>`,
        steps:[
          {do:`Set $\\frac{3}{\\theta} = \\frac{1}{1-\\theta}$.`, why:`The maximum is where the derivative equals zero.`},
          {do:`Cross-multiply: $3(1-\\theta) = \\theta \\Rightarrow 3 - 3\\theta = \\theta \\Rightarrow 3 = 4\\theta$.`, why:`Solve the equation.`},
          {do:`$\\theta = 3/4 = 0.75$.`, why:`Matches the heads fraction $3/4$, as expected.`}
        ],
        answer:`$\\theta = 0.75$` },

      { q:`<p>Roll a die $5$ times and see the face "6" exactly $2$ times. By maximum likelihood (treating "6" vs "not 6" as a coin), estimate $P(6)$.</p>`,
        steps:[
          {do:`Count sixes: $2$ out of $5$ rolls.`, why:`Treat each roll as a yes/no event for "6".`},
          {do:`$P(6) = 2/5 = 0.4$.`, why:`MLE is the observed fraction, even if it differs from the fair $1/6$.`}
        ],
        answer:`$P(6) = 0.4$` }
    ],

    /* ----------------------------------------------------------------
       ml-logistic-regression: g(z)=1/(1+e^{-z}); P(y=1|x)=g(theta^T x).
    ---------------------------------------------------------------- */
    "ml-logistic-regression": [
      { q:`<p>Compute the sigmoid $g(z) = \\frac{1}{1+e^{-z}}$ at $z = 0$.</p>`,
        steps:[
          {do:`$e^{-0} = e^0 = 1$.`, why:`Anything to the power $0$ is $1$.`},
          {do:`$g(0) = \\frac{1}{1+1} = 0.5$.`, why:`A score of $0$ gives a 50/50 probability.`}
        ],
        answer:`$g(0) = 0.5$` },

      { q:`<p>Compute $g(z) = \\frac{1}{1+e^{-z}}$ at $z = 2$. Use $e^{-2} \\approx 0.135$. Round to 2 decimals.</p>`,
        steps:[
          {do:`$1 + e^{-2} = 1 + 0.135 = 1.135$.`, why:`Plug $e^{-2}$ into the denominator.`},
          {do:`$g(2) = \\frac{1}{1.135} \\approx 0.88$.`, why:`A positive score gives a probability above $0.5$.`}
        ],
        answer:`$g(2) \\approx 0.88$` },

      { q:`<p>Compute $g(z)$ at $z = -2$. Use $e^{2} \\approx 7.389$. Round to 2 decimals.</p>`,
        steps:[
          {do:`$e^{-(-2)} = e^{2} \\approx 7.389$.`, why:`The exponent flips sign: $-z = 2$.`},
          {do:`$g(-2) = \\frac{1}{1 + 7.389} = \\frac{1}{8.389} \\approx 0.12$.`, why:`A negative score gives a probability below $0.5$.`}
        ],
        answer:`$g(-2) \\approx 0.12$` },

      { q:`<p>A model has score $z = \\theta^\\top x = 2$ for an email. Predict the probability of spam, and decide spam or not (threshold $0.5$). Use $g(2)\\approx 0.88$.</p>`,
        steps:[
          {do:`$P(\\text{spam}) = g(2) \\approx 0.88$.`, why:`The sigmoid turns the score into a probability.`},
          {do:`$0.88 &gt; 0.5$, so predict spam.`, why:`Above the threshold means class 1.`}
        ],
        answer:`$P \\approx 0.88$; predict spam` },

      { q:`<p>Weights $\\theta = \\begin{bmatrix}1\\\\2\\end{bmatrix}$, features $x = \\begin{bmatrix}1\\\\-1\\end{bmatrix}$. Find the score $z = \\theta^\\top x$, then $g(z)$. Use $e^{1}\\approx 2.718$.</p>`,
        steps:[
          {do:`$z = 1\\times 1 + 2\\times(-1) = 1 - 2 = -1$.`, why:`Compute the linear score first.`},
          {do:`$g(-1) = \\frac{1}{1+e^{1}} = \\frac{1}{1+2.718} \\approx 0.27$.`, why:`Apply the sigmoid to $z = -1$.`}
        ],
        answer:`$z = -1$, $g(z) \\approx 0.27$` },

      { q:`<p>If $P(y=1\\mid x) = 0.88$, what is $P(y=0\\mid x)$?</p>`,
        steps:[
          {do:`The two probabilities must add to $1$.`, why:`For a yes/no problem, the classes cover everything.`},
          {do:`$P(y=0) = 1 - 0.88 = 0.12$.`, why:`Subtract from $1$.`}
        ],
        answer:`$P(y=0\\mid x) = 0.12$` },

      { q:`<p>At which score $z$ does logistic regression switch its prediction from class $0$ to class $1$ (threshold $0.5$)?</p>`,
        steps:[
          {do:`The threshold $0.5$ happens when $g(z) = 0.5$.`, why:`That is the boundary between the two classes.`},
          {do:`$g(z) = 0.5$ exactly when $z = 0$.`, why:`The sigmoid passes through $0.5$ at $z = 0$.`}
        ],
        answer:`$z = 0$` },

      { q:`<p>Two emails have scores $z_1 = 3$ and $z_2 = -1$. Use $g(3)\\approx 0.95$ and $g(-1)\\approx 0.27$. Which is more likely spam?</p>`,
        steps:[
          {do:`Email 1: $g(3) \\approx 0.95$.`, why:`A large positive score gives high spam probability.`},
          {do:`Email 2: $g(-1) \\approx 0.27$.`, why:`A negative score gives low spam probability.`},
          {do:`$0.95 &gt; 0.27$, so email 1 is more likely spam.`, why:`Higher probability wins.`}
        ],
        answer:`Email 1 ($\\approx 0.95$)` },

      { q:`<p>With a bias, $\\theta = \\begin{bmatrix}-1\\\\1\\end{bmatrix}$ and $x = \\begin{bmatrix}1\\\\1\\end{bmatrix}$ (first entry is bias). Find $z = \\theta^\\top x$ and $g(z)$.</p>`,
        steps:[
          {do:`$z = -1\\times 1 + 1\\times 1 = 0$.`, why:`The bias $-1$ cancels the feature contribution $+1$.`},
          {do:`$g(0) = 0.5$.`, why:`Score $0$ means the model is exactly unsure.`}
        ],
        answer:`$z = 0$, $g(z) = 0.5$` },

      { q:`<p>True label $y = 1$, model probability $g(z) = 0.9$. The logistic (cross-entropy) loss for $y=1$ is $-\\log(g(z))$. Find it (natural log, round to 3 decimals).</p>`,
        steps:[
          {do:`Loss $= -\\log(0.9)$.`, why:`For label $1$, the loss punishes a low predicted probability.`},
          {do:`$\\log(0.9) \\approx -0.105$, so loss $\\approx 0.105$.`, why:`A confident, correct prediction has small loss.`}
        ],
        answer:`$\\approx 0.105$` }
    ],

    /* ----------------------------------------------------------------
       ml-softmax: phi_i = exp(s_i) / sum_j exp(s_j).
    ---------------------------------------------------------------- */
    "ml-softmax": [
      { q:`<p>Two classes have scores $0$ and $0$. Find the softmax probabilities.</p>`,
        steps:[
          {do:`Exponentiate: $e^0 = 1$ for both.`, why:`Softmax raises $e$ to each score.`},
          {do:`Sum $= 1 + 1 = 2$. Each probability $= 1/2 = 0.5$.`, why:`Equal scores give equal probabilities.`}
        ],
        answer:`$\\phi_1 = 0.5,\\ \\phi_2 = 0.5$` },

      { q:`<p>Three classes have scores $2, 1, 0$. Exponentiate each. Use $e^2 \\approx 7.39$, $e^1 \\approx 2.72$, $e^0 = 1$. Find the sum (the softmax denominator).</p>`,
        steps:[
          {do:`$e^2 \\approx 7.39$, $e^1 \\approx 2.72$, $e^0 = 1$.`, why:`Raise $e$ to each score to make them positive.`},
          {do:`Sum $= 7.39 + 2.72 + 1 = 11.11$.`, why:`This denominator is shared by all classes.`}
        ],
        answer:`Sum $\\approx 11.11$` },

      { q:`<p>Scores $2, 1, 0$ with $e^2\\approx 7.39$, $e^1\\approx 2.72$, $e^0=1$, sum $\\approx 11.11$. Find $\\phi_1$ (class 1). Round to 2 decimals.</p>`,
        steps:[
          {do:`$\\phi_1 = \\frac{e^2}{\\text{sum}} = \\frac{7.39}{11.11}$.`, why:`Divide this class's exponential by the total.`},
          {do:`$\\approx 0.67$.`, why:`The largest score gets the largest probability.`}
        ],
        answer:`$\\phi_1 \\approx 0.67$` },

      { q:`<p>Same scores $2,1,0$ (sum $\\approx 11.11$). Find $\\phi_2$ and $\\phi_3$. Round to 2 decimals.</p>`,
        steps:[
          {do:`$\\phi_2 = \\frac{2.72}{11.11} \\approx 0.24$.`, why:`Class 2's exponential over the total.`},
          {do:`$\\phi_3 = \\frac{1}{11.11} \\approx 0.09$.`, why:`Class 3's exponential over the total.`}
        ],
        answer:`$\\phi_2 \\approx 0.24,\\ \\phi_3 \\approx 0.09$` },

      { q:`<p>The softmax probabilities came out $0.67, 0.24, 0.09$. Check they are valid, and name the predicted class.</p>`,
        steps:[
          {do:`Sum: $0.67 + 0.24 + 0.09 = 1.00$.`, why:`Softmax probabilities must add to $1$.`},
          {do:`The largest is $0.67$ (class 1).`, why:`The predicted class is the one with the biggest probability.`}
        ],
        answer:`Valid (sum $= 1$); predict class 1` },

      { q:`<p>Two classes with scores $1$ and $0$. Use $e^1 \\approx 2.72$, $e^0 = 1$. Find both softmax probabilities (2 decimals).</p>`,
        steps:[
          {do:`Sum $= 2.72 + 1 = 3.72$.`, why:`Add the exponentials.`},
          {do:`$\\phi_1 = 2.72/3.72 \\approx 0.73$, $\\phi_2 = 1/3.72 \\approx 0.27$.`, why:`Each exponential over the total.`}
        ],
        answer:`$\\phi_1 \\approx 0.73,\\ \\phi_2 \\approx 0.27$` },

      { q:`<p>If you add the same constant $5$ to every softmax score, do the probabilities change? Try scores $1,0$ vs $6,5$.</p>`,
        steps:[
          {do:`$1,0$: $\\phi_1 = \\frac{e^1}{e^1+e^0} = \\frac{2.72}{3.72} \\approx 0.73$.`, why:`Baseline probabilities.`},
          {do:`$6,5$: $\\frac{e^6}{e^6+e^5} = \\frac{e^1}{e^1+e^0} \\approx 0.73$ (the shared $e^5$ cancels).`, why:`Adding a constant multiplies top and bottom by the same factor.`},
          {do:`Same result.`, why:`Softmax only cares about score differences, not their absolute size.`}
        ],
        answer:`No change ($\\phi_1 \\approx 0.73$ either way)` },

      { q:`<p>Three classes, scores $0,0,0$. Find each softmax probability.</p>`,
        steps:[
          {do:`$e^0 = 1$ for all three.`, why:`Equal scores exponentiate equally.`},
          {do:`Sum $= 3$, each $= 1/3 \\approx 0.33$.`, why:`Equal scores split the probability evenly.`}
        ],
        answer:`Each $\\approx 0.33$` },

      { q:`<p>Two classes with scores $z$ and $0$. Show softmax reduces to the sigmoid $\\frac{1}{1+e^{-z}}$ for class 1.</p>`,
        steps:[
          {do:`$\\phi_1 = \\frac{e^z}{e^z + e^0} = \\frac{e^z}{e^z + 1}$.`, why:`Apply the softmax formula with two classes.`},
          {do:`Divide top and bottom by $e^z$: $\\frac{1}{1 + e^{-z}}$.`, why:`This is exactly the sigmoid.`}
        ],
        answer:`$\\phi_1 = \\frac{1}{1+e^{-z}}$ (the sigmoid)` },

      { q:`<p>Three classes, scores $3, 1, 1$. Use $e^3 \\approx 20.09$, $e^1 \\approx 2.72$. Find $\\phi_1$ (2 decimals) and the predicted class.</p>`,
        steps:[
          {do:`Exponentials: $20.09, 2.72, 2.72$. Sum $= 25.53$.`, why:`Raise $e$ to each score and add.`},
          {do:`$\\phi_1 = 20.09 / 25.53 \\approx 0.79$.`, why:`The top score dominates.`},
          {do:`Largest probability is $\\phi_1$, so predict class 1.`, why:`Highest probability wins.`}
        ],
        answer:`$\\phi_1 \\approx 0.79$; predict class 1` }
    ],

    /* ----------------------------------------------------------------
       ml-glm: exponential family / which distribution -> which model.
    ---------------------------------------------------------------- */
    "ml-glm": [
      { q:`<p>In a GLM, which distribution gives ordinary <b>linear regression</b>?</p>`,
        steps:[
          {do:`Linear regression predicts a real number with Gaussian noise.`, why:`The output is continuous and bell-shaped around the prediction.`},
          {do:`So the distribution is the Normal (Gaussian).`, why:`Plugging the Normal into the GLM template yields linear regression.`}
        ],
        answer:`The Normal (Gaussian) distribution` },

      { q:`<p>In a GLM, which distribution gives <b>logistic regression</b>?</p>`,
        steps:[
          {do:`Logistic regression handles yes/no outcomes.`, why:`The output is a single $0$ or $1$.`},
          {do:`So the distribution is the Bernoulli.`, why:`Plugging Bernoulli into the GLM template yields the sigmoid / logistic model.`}
        ],
        answer:`The Bernoulli distribution` },

      { q:`<p>You want to predict the <b>count</b> of website visits per hour. Which GLM distribution fits?</p>`,
        steps:[
          {do:`Counts are non-negative whole numbers ($0,1,2,\\dots$).`, why:`Continuous Normal and yes/no Bernoulli do not fit counts.`},
          {do:`The Poisson distribution models counts.`, why:`Poisson regression is the GLM for count data.`}
        ],
        answer:`The Poisson distribution` },

      { q:`<p>In the GLM template $p(y;\\eta) = b(y)\\,\\exp(\\eta\\,T(y) - a(\\eta))$, what do we set the natural parameter $\\eta$ equal to?</p>`,
        steps:[
          {do:`A GLM connects the distribution to a linear score of the features.`, why:`That linear part is what makes it "linear".`},
          {do:`We set $\\eta = \\theta^\\top x$.`, why:`The natural parameter equals the dot product of weights and features.`}
        ],
        answer:`$\\eta = \\theta^\\top x$` },

      { q:`<p>The Bernoulli is $p(y;\\phi) = \\phi^y (1-\\phi)^{1-y}$. Rewrite it as $\\exp(\\,?\\,)$ using $\\log$, to match the exponential-family shape.</p>`,
        steps:[
          {do:`Take the log: $y\\log\\phi + (1-y)\\log(1-\\phi)$.`, why:`Log turns the product of powers into a sum.`},
          {do:`Exponentiate back: $p = \\exp\\big(y\\log\\frac{\\phi}{1-\\phi} + \\log(1-\\phi)\\big)$.`, why:`Group the $y$ terms to expose the natural parameter.`}
        ],
        answer:`$p = \\exp\\big(y\\log\\tfrac{\\phi}{1-\\phi} + \\log(1-\\phi)\\big)$` },

      { q:`<p>From the Bernoulli GLM, the natural parameter is $\\eta = \\log\\frac{\\phi}{1-\\phi}$. Solve for $\\phi$ in terms of $\\eta$.</p>`,
        steps:[
          {do:`Exponentiate: $e^{\\eta} = \\frac{\\phi}{1-\\phi}$.`, why:`Undo the log.`},
          {do:`Solve: $\\phi = \\frac{e^{\\eta}}{1+e^{\\eta}} = \\frac{1}{1+e^{-\\eta}}$.`, why:`Rearranging gives the sigmoid of $\\eta$.`}
        ],
        answer:`$\\phi = \\frac{1}{1+e^{-\\eta}}$ (the sigmoid)` },

      { q:`<p>A GLM sets $\\eta = \\theta^\\top x$ and, for the Bernoulli, $\\phi = \\frac{1}{1+e^{-\\eta}}$. With $\\theta=\\begin{bmatrix}1\\\\1\\end{bmatrix}$, $x=\\begin{bmatrix}1\\\\1\\end{bmatrix}$, find $\\phi$ (use $e^{-2}\\approx 0.135$, 2 decimals).</p>`,
        steps:[
          {do:`$\\eta = 1\\times 1 + 1\\times 1 = 2$.`, why:`The natural parameter is the linear score.`},
          {do:`$\\phi = \\frac{1}{1+e^{-2}} = \\frac{1}{1.135} \\approx 0.88$.`, why:`Apply the sigmoid to $\\eta = 2$.`}
        ],
        answer:`$\\phi \\approx 0.88$` },

      { q:`<p>For linear regression as a GLM, the prediction is the distribution's mean and $\\eta = \\theta^\\top x$ maps directly to it. With $\\theta=\\begin{bmatrix}2\\\\3\\end{bmatrix}$, $x=\\begin{bmatrix}1\\\\2\\end{bmatrix}$, predict the mean.</p>`,
        steps:[
          {do:`$\\eta = 2\\times 1 + 3\\times 2 = 8$.`, why:`Compute the linear score.`},
          {do:`For the Normal, the mean equals $\\eta$, so the prediction is $8$.`, why:`Linear regression's prediction is the natural parameter itself.`}
        ],
        answer:`Prediction $= 8$` },

      { q:`<p>In the exponential-family form $p(y;\\eta)=b(y)\\exp(\\eta\\,T(y)-a(\\eta))$, what role does $a(\\eta)$ play?</p>`,
        steps:[
          {do:`$a(\\eta)$ is subtracted inside the exponent for every $y$.`, why:`It scales the whole distribution.`},
          {do:`It is the normalizer (log-partition) that makes the probabilities sum to $1$.`, why:`A valid distribution must total $1$.`}
        ],
        answer:`$a(\\eta)$ is the normalizer (log-partition) ensuring probabilities sum to $1$.` },

      { q:`<p>Why is the GLM useful? Give the one-sentence reason that links linear, logistic, and Poisson regression.</p>`,
        steps:[
          {do:`All three compute a linear score $\\eta = \\theta^\\top x$.`, why:`The linear part is shared.`},
          {do:`They differ only in which exponential-family distribution they attach to that score.`, why:`Swap the distribution (Normal, Bernoulli, Poisson) and you get a different model from one framework.`}
        ],
        answer:`One framework: a shared linear score $\\theta^\\top x$ plus a swappable exponential-family distribution.` }
    ]

  });
})();

