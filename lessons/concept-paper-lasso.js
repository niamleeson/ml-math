/* Paper lesson — "Regression Shrinkage and Selection via the Lasso", Robert Tibshirani,
   Journal of the Royal Statistical Society, Series B, vol. 58, no. 1, pp. 267-288 (1996). No arXiv.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-lasso".
   GROUNDED from the Wikipedia "Lasso (statistics)" article (which cites Tibshirani 1996 directly) for the
   constraint form, penalized form, and the orthonormal-case soft-threshold solution; and the
   "Proximal gradient methods for learning" article for the soft-threshold operator definition.
   paper.url points to a real, readable source. Track A (primitive): build Lasso via coordinate descent /
   soft-thresholding from scratch with raw torch tensors, and VERIFY the operator + a converged solution
   against a hand-computed reference with torch.allclose. The regularization math lives in concept
   ml-regularization; here we recap+apply and contrast L1 with ridge (L2). */
(function () {
  window.LESSONS.push({
    id: "paper-lasso",
    title: "Lasso — Regression Shrinkage and Selection via the Lasso (1996)",
    tagline: "Add an L1 penalty (the sum of absolute coefficient values) to least squares, and the fit both shrinks and selects: it drives whole coefficients to exactly zero, doing variable selection automatically.",
    module: "Papers · Classical ML",
    track: "primitive",
    paper: {
      authors: "Robert Tibshirani",
      org: "University of Toronto (Department of Statistics)",
      year: 1996,
      venue: "Journal of the Royal Statistical Society, Series B (Methodological), vol. 58, no. 1, pp. 267-288",
      citations: "",
      url: "https://en.wikipedia.org/wiki/Lasso_(statistics)",
      code: ""
    },
    conceptLink: "ml-regularization",
    partOf: [],
    prereqs: ["ml-linear-regression", "ml-regularization", "pt-tensors", "la-matrix-calculus"],

    // WHY READ IT
    problem:
      `<p>Ordinary least squares (OLS) regression &mdash; the method that fits a line or a plane by minimizing
       the sum of squared errors &mdash; has two long-standing weaknesses when you have many input variables
       (called <b>predictors</b> or <b>features</b>).</p>
       <ul>
        <li><b>Prediction accuracy.</b> OLS finds the coefficients that best fit the <i>training</i> data with no
        restraint. With many predictors it can fit noise, so the coefficients have low bias but high variance,
        and predictions on new data suffer.</li>
        <li><b>Interpretation.</b> OLS gives <i>every</i> predictor a nonzero coefficient. With dozens of inputs
        you want a small handful that matter most, but OLS will not hand you one &mdash; it keeps them all.</li>
       </ul>
       <p>The two classical fixes each solve only half the problem. <b>Subset selection</b> (keep some
       predictors, drop the rest) gives an interpretable model, but it is a discrete, all-or-nothing process:
       a tiny change in the data can flip a variable in or out, which makes the result unstable.
       <b>Ridge regression</b> (add a penalty on the sum of <i>squared</i> coefficients, the L2 penalty) is
       stable and improves accuracy, but it <i>shrinks</i> every coefficient toward zero without ever making
       one exactly zero &mdash; so it never simplifies the model. The paper asks: can one method get the
       stability of ridge <i>and</i> the variable selection of subset selection at the same time?</p>`,
    contribution:
      `<ul>
        <li><b>The lasso.</b> ("Least Absolute Shrinkage and Selection Operator.") Fit least squares subject to
        a budget on the <b>sum of the absolute values</b> of the coefficients &mdash; the L1 norm
        $\\sum_j |\\beta_j| \\le t$. That single change makes the method <i>continuously shrink</i> coefficients
        (like ridge) while also setting some of them <b>exactly to zero</b> (like subset selection). One knob,
        $t$, slides smoothly between "keep everything" and "keep nothing."</li>
        <li><b>Shrinkage and selection in one estimator.</b> As you tighten the budget $t$, predictors drop out
        one by one. The lasso therefore produces interpretable, sparse models automatically &mdash; no separate
        discrete search.</li>
        <li><b>A clean geometric and computational picture.</b> The paper explains <i>why</i> the absolute-value
        constraint (a diamond / cross-polytope with corners on the axes) produces exact zeros, whereas the
        ridge constraint (a smooth ball) never does.</li>
       </ul>`,
    whyItMattered:
      `<p>The lasso is one of the most-used ideas in modern statistics and machine learning. The L1 penalty
       became the standard tool for <b>sparse</b> modeling: when you have far more candidate features than you
       can keep (text features, genomics, sensors), the L1 penalty does the feature selection for you while it
       fits. It launched a large family of methods &mdash; the elastic net (L1 + L2 combined), the group lasso,
       compressed sensing, sparse coding &mdash; and the <b>coordinate descent</b> and <b>soft-thresholding</b>
       machinery you build in this lesson is exactly how production solvers (for example scikit-learn's
       <code>Lasso</code>) fit it today. Any time you see "L1 regularization" or "an L1 penalty for sparsity,"
       you are looking at this paper's idea.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>The definition (Section 2).</b> The lasso estimate: minimize the residual sum of squares subject
        to $\\sum_j |\\beta_j| \\le t$. This one constraint is the whole paper. Understand what $t$ does.</li>
        <li><b>The orthonormal special case.</b> When the predictors are uncorrelated and scaled
        (mathematically, the design satisfies $X^\\top X = I$, the identity matrix), the lasso solution has a
        clean closed form: take each OLS coefficient and apply <b>soft-thresholding</b>. This is the equation you
        verify by hand and in code. Contrast it with the ridge formula (a uniform shrink) in the same case.</li>
        <li><b>The geometry figure</b> (the diamond-versus-circle picture). The L1 constraint region is a
        diamond with sharp corners on the axes; the least-squares contours tend to first touch it at a corner,
        and a corner is a point where some coefficients are exactly zero. That picture <i>is</i> the intuition
        for why L1 selects and L2 does not.</li>
       </ul>
       <p><b>Skim:</b> the prostate-cancer and other data examples, the standard-error / Bayesian sections, and
       the original "shooting"-style algorithm. The modern way to compute the lasso &mdash; cyclic coordinate
       descent with soft-thresholding, which you implement here &mdash; is cleaner than the 1996 algorithm and
       reaches the same solution.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will run two penalized fits on the same data as you crank the penalty strength up from zero:
       <b>ridge</b> (penalize the sum of <i>squared</i> coefficients) and the <b>lasso</b> (penalize the sum of
       <i>absolute</i> coefficients). Before you run anything, predict: as the penalty grows very large, which
       method's coefficients become <b>exactly zero</b>, and which only <i>approach</i> zero without ever
       reaching it? Write one sentence of reasoning.</p>
       <p>(Hint: think about the shape of the penalty near zero. The squared penalty $\\beta^2$ is flat at the
       origin &mdash; its slope vanishes as $\\beta \\to 0$, so it stops pushing. The absolute-value penalty
       $|\\beta|$ has a constant slope right up to zero &mdash; it keeps pushing all the way in. Which one can
       therefore pin a coefficient at exactly zero?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the one operator the whole algorithm rests on: the <b>soft-thresholding</b>
       function. It takes a number $z$ and a threshold $\\gamma \\ge 0$ and pulls $z$ toward zero by
       $\\gamma$, clipping at zero so it cannot overshoot. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>If $z \\gt \\gamma$: output $z - \\gamma$. (Example: $z=3,\\ \\gamma=1 \\Rightarrow$ <b>?</b>)</li>
        <li>If $z \\lt -\\gamma$: output $z + \\gamma$. (Example: $z=-2,\\ \\gamma=1 \\Rightarrow$ <b>?</b>)</li>
        <li>If $|z| \\le \\gamma$: output $0$. (Example: $z=0.5,\\ \\gamma=1 \\Rightarrow$ <b>?</b>)</li>
       </ul>
       <p>In one line: $S(z,\\gamma) = \\operatorname{sign}(z)\\,\\max(|z|-\\gamma,\\,0)$. The coordinate-descent
       lasso is just this operator applied to one coefficient at a time, in a loop, until nothing changes.
       Solve the three examples, then check them against the worked numbers below.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from ordinary least squares. We have $N$ training rows, each with $p$ predictors collected in a
       matrix $X$ (one row per example, one column per predictor), and a target vector $y$. OLS picks the
       coefficient vector $\\beta$ that minimizes the <b>residual sum of squares</b>, the total squared gap
       between the prediction $X\\beta$ and the truth $y$.</p>
       <p><b>The lasso changes the rules by adding a budget.</b> It minimizes the same squared error, but only
       among coefficient vectors whose absolute values add up to no more than a fixed budget $t$:
       $\\sum_{j=1}^{p} |\\beta_j| \\le t$. That sum of absolute values is the <b>L1 norm</b>, written
       $\\|\\beta\\|_1$. Shrinking $t$ forces the coefficients to "spend" their budget carefully; the cheapest
       way to satisfy a tight budget is to set the least-useful coefficients to <b>exactly zero</b> and spend
       the budget on the ones that reduce error most. That is selection.</p>
       <p><b>The equivalent penalty form.</b> Instead of a hard budget $t$, you can add a penalty term and
       minimize, for some penalty strength $\\lambda \\ge 0$ (called <b>lambda</b>):
       residual sum of squares $+\\ \\lambda \\sum_j |\\beta_j|$. Every budget $t$ corresponds to some
       $\\lambda$ and vice versa; large $\\lambda$ is the same as small $t$ (a tight budget). We use the
       $\\lambda$ form because it makes the coordinate-descent update fall out cleanly.</p>
       <p><b>Why exact zeros?</b> Picture the constraint region $\\|\\beta\\|_1 \\le t$ in two dimensions: it is a
       diamond with sharp corners sitting on the axes. The least-squares error has elliptical contour lines; the
       solution is where the smallest ellipse first touches the diamond. Because the diamond has corners poking
       out on the axes, that first touch usually lands <i>on a corner</i> &mdash; and a corner is a point where
       one coordinate is exactly zero. The ridge constraint $\\sum_j \\beta_j^2 \\le t$ is a smooth circle with
       no corners, so its first touch is almost never on an axis; ridge shrinks but keeps every coefficient
       nonzero.</p>
       <p><b>The clean special case (orthonormal predictors).</b> When the predictors are uncorrelated and
       standardized &mdash; mathematically $X^\\top X = I$, the identity matrix, meaning each predictor has unit
       length and is at right angles to the others &mdash; the lasso has a one-line solution. Take each OLS
       coefficient $\\hat\\beta_j^{\\,\\text{OLS}}$ and pass it through soft-thresholding with threshold tied to
       $\\lambda$: $\\hat\\beta_j = S(\\hat\\beta_j^{\\,\\text{OLS}},\\,\\gamma)$. Coefficients smaller than the
       threshold collapse to zero; larger ones are pulled toward zero by the threshold amount. Ridge, in the
       same case, instead multiplies every coefficient by the same constant factor &mdash; a uniform shrink that
       never hits zero.</p>
       <p><b>Coordinate descent &mdash; how we actually compute it.</b> For general (correlated) predictors there
       is no one-line answer, but a simple loop works. Cycle through the coefficients one at a time. To update
       coefficient $j$, freeze all the others, compute the <b>partial residual</b> &mdash; how far off the
       prediction is once you remove feature $j$'s current contribution &mdash; correlate feature $j$ with it to
       get a number $\\rho_j$, and set $\\beta_j = S(\\rho_j,\\,\\lambda)$ (then divide by feature $j$'s squared
       length, which is $1$ for standardized features). Repeat the full sweep until the coefficients stop
       moving. Each single-coordinate step is exactly the orthonormal soft-threshold solution, which is why the
       loop is so short.</p>`,
    architecture:
      `<p>The lasso is an <b>estimator plus a solver</b>, not a layered network. Its "architecture" is the
       per-iteration coordinate-descent procedure that turns the L1-penalized objective into a sequence of
       one-line soft-threshold updates.</p>
       <p><b>Inputs / preprocessing.</b> A design matrix $X$ ($N$ rows $\\times\\ p$ columns) and target $y$.
       Center each feature column to mean $0$ and scale it (and center $y$), so every feature's squared length is
       the same and the single threshold $\\gamma$ is applied fairly across coefficients.</p>
       <p><b>State.</b> One coefficient vector $\\beta \\in \\mathbb{R}^p$, initialized to $0$ (all features off).</p>
       <p><b>One coordinate update</b> (the repeated building block), for feature $j$:</p>
       <ol>
        <li><b>Partial residual</b> &mdash; remove feature $j$'s current contribution from the error:
        $r^{(j)} = y - X\\beta + X_{:,j}\\,\\beta_j$.</li>
        <li><b>Correlate</b> feature $j$ with that residual: $\\rho_j = \\tfrac{1}{N}\\,X_{:,j}^\\top r^{(j)}$.</li>
        <li><b>Soft-threshold</b> and write back: $\\beta_j \\leftarrow S(\\rho_j,\\,\\lambda)\\ /\\ (\\text{feature }j\\text{'s squared length})$,
        where the squared length is $1$ for standardized features.</li>
       </ol>
       <p><b>Sweep and convergence.</b> Apply the update to $j = 1,\\dots,p$ in turn (one full <i>sweep</i>), then
       repeat sweeps until $\\beta$ stops moving. Each single step is exactly the orthonormal closed form
       $S(\\hat\\beta_j^{\\,\\text{OLS}},\\gamma)$ applied to the partial residual, which is why the loop is so
       short and why it provably converges to the lasso solution.</p>
       <p><b>Output / path.</b> The fitted sparse $\\beta$ at a given $\\lambda$. Sweeping $\\lambda$ from $0$ upward
       and recording $\\beta$ each time traces the <b>coefficient paths</b> &mdash; the curves along which features
       drop to exactly zero one by one (the CODEVIZ panel). The original 1996 paper solved the same problem with a
       quadratic-programming / "shooting" routine; coordinate descent reaches the identical optimum more simply.</p>`,
    symbols: [
      { sym: "$N$", desc: "the number of training examples (rows of the data)." },
      { sym: "$p$", desc: "the number of predictors / features (columns of the design matrix $X$)." },
      { sym: "$X$", desc: "the <b>design matrix</b>: $N$ rows, $p$ columns. Row $i$, column $j$ is the value of feature $j$ for example $i$. We assume features are <b>standardized</b> (each column shifted to mean $0$ and scaled to a consistent length)." },
      { sym: "$y$", desc: "the target vector: the true value we are trying to predict for each of the $N$ examples." },
      { sym: "$\\beta$", desc: "the coefficient vector $(\\beta_1,\\dots,\\beta_p)$ &mdash; one weight per feature. $\\beta_j$ is how much feature $j$ contributes to the prediction; the lasso wants many of these to be exactly $0$." },
      { sym: "$\\hat\\beta_j^{\\,\\text{OLS}}$", desc: "the ordinary-least-squares coefficient for feature $j$ &mdash; the unpenalized best fit (\"hat\" means an estimated value)." },
      { sym: "$\\|\\beta\\|_1$", desc: "the <b>L1 norm</b>: the sum of absolute coefficient values, $\\sum_j |\\beta_j|$. (The subscript $1$ marks it as the L1, or sum-of-absolute-values, norm.)" },
      { sym: "$\\|\\beta\\|_2^2$", desc: "the squared <b>L2 norm</b>: the sum of <i>squared</i> coefficient values, $\\sum_j \\beta_j^2$. This is the ridge penalty &mdash; shown only for contrast." },
      { sym: "$t$", desc: "the lasso <b>budget</b>: the largest the L1 norm is allowed to be. Small $t$ = tight budget = more coefficients forced to zero." },
      { sym: "$\\lambda$", desc: "the penalty strength (<b>lambda</b>) in the equivalent penalized form. Large $\\lambda$ pushes harder toward zero and is equivalent to a small budget $t$." },
      { sym: "$S(z,\\gamma)$", desc: "the <b>soft-thresholding operator</b>: pull the number $z$ toward zero by the threshold $\\gamma$, and clip at zero so it cannot cross. Equals $\\operatorname{sign}(z)\\max(|z|-\\gamma,0)$." },
      { sym: "$\\gamma$", desc: "the threshold fed to $S$ &mdash; the amount each value is pulled toward zero. It is tied to the penalty strength: in the orthonormal formula above $\\gamma = N\\lambda$, while in the per-coordinate update on mean-scaled (RSS divided by $N$) standardized features it reduces to $\\gamma = \\lambda$." },
      { sym: "$\\rho_j$", desc: "the correlation between feature $j$ and the <b>partial residual</b> (the leftover error after removing feature $j$'s current contribution). It is what gets soft-thresholded in the coordinate-descent update." },
      { sym: "$(\\,\\cdot\\,)_+$", desc: "the <b>positive part</b>: $\\max(\\,\\cdot\\,,\\,0)$. Keeps a value if positive, otherwise returns $0$." },
      { sym: "$\\operatorname{sign}(z)$", desc: "the sign of $z$: $+1$ if positive, $-1$ if negative, $0$ if zero. It records the direction so $S$ can pull toward zero from either side." }
    ],
    formula: `$$ \\hat\\beta \\;=\\; \\arg\\min_{\\beta}\\ \\tfrac{1}{N}\\,\\|y - X\\beta\\|_2^2 \\quad \\text{subject to}\\quad \\|\\beta\\|_1 = \\sum_{j=1}^{p} |\\beta_j| \\;\\le\\; t $$
<p class="cap">Lasso, <b>constraint form</b> (Tibshirani 1996, §2): minimize the (mean) residual sum of squares subject to an L1 budget $t$ on the coefficients. Set $t$ large and the constraint is inactive (plain OLS); shrink $t$ and coefficients are forced to zero.</p>
$$ \\hat\\beta \\;=\\; \\arg\\min_{\\beta\\in\\mathbb{R}^p}\\ \\left\\{\\ \\tfrac{1}{N}\\,\\|y - X\\beta\\|_2^2 \\;+\\; \\lambda\\,\\|\\beta\\|_1\\ \\right\\}, \\qquad \\lambda \\ge 0 $$
<p class="cap"><b>Lagrangian / penalized form</b> (§2): the budget $t$ is replaced by a penalty of strength $\\lambda$. Every $t$ corresponds to some $\\lambda$ (the map is data-dependent); large $\\lambda$ ≡ small $t$.</p>
$$ S(z,\\gamma) \\;=\\; \\operatorname{sign}(z)\\,\\max\\!\\bigl(|z|-\\gamma,\\ 0\\bigr) \\;=\\; \\operatorname{sign}(z)\\,\\bigl(|z|-\\gamma\\bigr)_+ $$
<p class="cap"><b>Soft-thresholding operator</b>: pull $z$ toward zero by the threshold $\\gamma$, and clip at zero so it cannot cross. The only nonlinearity in the whole algorithm.</p>
$$ \\text{(orthonormal design, } X^\\top X = I)\\qquad \\hat\\beta_j \\;=\\; S\\!\\left(\\hat\\beta_j^{\\,\\text{OLS}},\\ \\gamma\\right) \\;=\\; \\operatorname{sign}\\!\\left(\\hat\\beta_j^{\\,\\text{OLS}}\\right)\\bigl(\\,|\\hat\\beta_j^{\\,\\text{OLS}}| - \\gamma\\,\\bigr)_+, \\qquad \\gamma = N\\lambda $$
<p class="cap"><b>Lasso, orthonormal solution</b>: each lasso coefficient is its OLS value soft-thresholded by $\\gamma = N\\lambda$. Coefficients with $|\\hat\\beta_j^{\\,\\text{OLS}}| \\le \\gamma$ become <b>exactly zero</b> (selection); the rest are pulled toward zero by $\\gamma$ (shrinkage).</p>
$$ \\text{(ridge, orthonormal design)}\\qquad \\hat\\beta_j^{\\,\\text{ridge}} \\;=\\; \\frac{\\hat\\beta_j^{\\,\\text{OLS}}}{1 + N\\lambda} $$
<p class="cap"><b>Ridge contrast (L2)</b>: the same OLS coefficient is multiplied by a single shrink factor $1/(1+N\\lambda)\\lt 1$ — a <b>uniform shrink</b> applied to every coefficient that approaches but <b>never reaches exactly zero</b>, so ridge shrinks but never selects.</p>`,
    whatItDoes:
      `<p><b>The constraint form (Section 2 of the paper)</b> says: among all coefficient vectors whose absolute
       values sum to at most $t$, pick the one with the smallest squared prediction error. The budget $t$ is the
       only knob. Set $t$ huge and the constraint does nothing &mdash; you get plain OLS. Shrink $t$ and the fit
       must give up budget, which it does by zeroing the least-useful coefficients first. That is how a single
       continuous knob performs variable selection.</p>
       <p><b>The orthonormal solution</b> shows the mechanism in its cleanest form. When predictors are
       uncorrelated and standardized, each lasso coefficient is just its OLS value pushed through
       soft-thresholding: if the OLS coefficient is smaller in size than the threshold $\\gamma$, it becomes
       <b>exactly zero</b>; otherwise it is pulled toward zero by $\\gamma$. Compare ridge in the same case,
       which multiplies every coefficient by a constant factor $1/(1+\\lambda')$ &mdash; a uniform shrink that
       <i>never</i> reaches zero. Same goal (control overfitting), opposite behavior at zero: L1 selects, L2
       only shrinks.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the full penalty theory lives in the ml-regularization concept lesson.</b> The
       one derivation you should own here is <b>why the orthonormal lasso solution is soft-thresholding</b>,
       because that single-coordinate result is the engine of the whole algorithm.</p>
       <p>Take one coordinate. With standardized, uncorrelated features the objective splits into independent
       per-coefficient pieces, each of the form (constant aside) $\\tfrac{1}{2}(\\beta_j - c)^2 + \\lambda
       |\\beta_j|$, where $c=\\hat\\beta_j^{\\,\\text{OLS}}$ is the OLS coefficient. We minimize over $\\beta_j$.</p>
       <ul>
        <li><b>Where $\\beta_j \\gt 0$:</b> the term $|\\beta_j| = \\beta_j$ is smooth, so set the derivative to
        zero: $(\\beta_j - c) + \\lambda = 0 \\Rightarrow \\beta_j = c - \\lambda$. Valid only when this is
        positive, i.e. $c \\gt \\lambda$.</li>
        <li><b>Where $\\beta_j \\lt 0$:</b> $|\\beta_j| = -\\beta_j$, so $(\\beta_j - c) - \\lambda = 0
        \\Rightarrow \\beta_j = c + \\lambda$. Valid only when $c \\lt -\\lambda$.</li>
        <li><b>At $\\beta_j = 0$:</b> the absolute value has a kink (no single derivative); the minimum stays
        pinned at $0$ whenever $|c| \\le \\lambda$, because the penalty's slope ($\\pm\\lambda$) is steep enough
        to cancel the squared term's pull. This kink is exactly what lets L1 produce <b>hard zeros</b> &mdash;
        the smooth squared (ridge) penalty has zero slope at the origin, so it can never hold a coefficient at
        zero.</li>
       </ul>
       <p>Stitching the three cases together gives $\\beta_j = \\operatorname{sign}(c)\\,(|c|-\\lambda)_+ =
       S(c,\\lambda)$ &mdash; the soft-thresholding operator. The coordinate-descent algorithm applies this same
       one-coordinate rule repeatedly (using the partial residual in place of $c$) until the whole vector stops
       changing. The general (non-orthonormal) optimality conditions and the budget-versus-$\\lambda$
       correspondence are derived in the <b>ml-regularization</b> concept lesson; we apply them here.</p>`,
    example:
      `<p><b>Soft-thresholding by hand</b>, with threshold $\\gamma = 1$. Apply
       $S(z,\\gamma) = \\operatorname{sign}(z)\\,(|z|-\\gamma)_+$ to each value:</p>
       <ul class="steps">
        <li>$z = 3$: $|z|-\\gamma = 2 \\gt 0$, sign $+$, so $S = +2$. (Pulled toward zero by $1$.)</li>
        <li>$z = -2$: $|z|-\\gamma = 1 \\gt 0$, sign $-$, so $S = -1$. (Pulled toward zero by $1$.)</li>
        <li>$z = 0.5$: $|z|-\\gamma = -0.5 \\lt 0$, positive part is $0$, so $S = \\mathbf{0}$. (Killed.)</li>
        <li>$z = -0.5$: $|z|-\\gamma = -0.5 \\lt 0 \\Rightarrow S = \\mathbf{0}$. (Killed.)</li>
        <li>$z = 0$: $S = 0$.</li>
       </ul>
       <p>So $S([3,-2,0.5,-0.5,0],\\,1) = [2,-1,0,0,0]$. The two small values are zeroed; the two large ones are
       shrunk by exactly $1$. This is the verified reference vector in the notebook.</p>
       <p><b>A converged lasso fit by hand (orthonormal case).</b> Plant a noiseless signal with OLS
       coefficients $\\hat\\beta^{\\,\\text{OLS}} = [4,\\,-3,\\,0.7]$ on uncorrelated standardized predictors,
       and use $\\lambda = 1$. The closed-form answer is just soft-thresholding:
       $S([4,-3,0.7],\\,1) = [4-1,\\ -(3-1),\\ 0]= [\\mathbf{3},\\,\\mathbf{-2},\\,\\mathbf{0}]$. The small
       coefficient $0.7$ (below the threshold $1$) is dropped; the other two shrink by $1$. The notebook runs
       coordinate descent from scratch and confirms it converges to this exact vector with
       <code>torch.allclose</code>.</p>`,
    recipe:
      `<ol>
        <li><b>Standardize.</b> Center each feature column to mean $0$ and scale it; center $y$. (Then each
        feature's squared length is the same, which simplifies the update.)</li>
        <li><b>Define the operator.</b> $S(z,\\gamma) = \\operatorname{sign}(z)\\,\\max(|z|-\\gamma,0)$ &mdash; the
        soft-threshold. This is the only nonlinearity in the algorithm.</li>
        <li><b>Initialize</b> $\\beta = 0$ (all coefficients off).</li>
        <li><b>Coordinate sweep.</b> For each feature $j$ in turn: compute the <b>partial residual</b>
        $r^{(j)} = y - X\\beta + X_{:,j}\\,\\beta_j$ (the error with feature $j$ removed); correlate:
        $\\rho_j = \\tfrac{1}{N}\\,X_{:,j}^\\top r^{(j)}$; update $\\beta_j = S(\\rho_j,\\,\\lambda)$ (divided by
        feature $j$'s squared length, $=1$ when standardized).</li>
        <li><b>Repeat</b> the full sweep until the coefficients stop moving (convergence).</li>
        <li><b>Verify (Track A).</b> On orthonormal predictors, check the converged vector equals the
        closed-form $S(\\hat\\beta^{\\,\\text{OLS}},\\lambda)$ with <code>torch.allclose</code> &mdash; your
        from-scratch solver IS the lasso.</li>
        <li><b>Trace the path.</b> Sweep $\\lambda$ from $0$ upward and record each coefficient. Watch them hit
        exactly zero one by one &mdash; the lasso doing selection.</li>
      </ol>`,
    results:
      `<p>The paper's central qualitative claim is that the lasso <b>simultaneously shrinks and selects</b>:
       as the budget $t$ tightens, coefficients are driven to exactly zero one at a time, yielding sparse,
       interpretable models, while ridge regression in the same setting shrinks all coefficients but keeps them
       nonzero. On real data sets in the paper (for example a prostate-cancer study), the lasso produced models
       using only a subset of the predictors with competitive prediction error.</p>
       <p><i>The paper reports its accuracy results on its own data sets with its own setup. The numbers in the
       CODE / CODEVIZ below are from our own small synthetic run &mdash; they illustrate the qualitative effect
       (coefficients hitting exactly zero as $\\lambda$ grows), not the paper's reported numbers.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track A (primitive)</b> paper: the idea &mdash; an L1-penalized least-squares solver via
       coordinate descent / soft-thresholding &mdash; is something modern libraries ship as one call
       (scikit-learn's <code>Lasso</code>), so we <b>build it from scratch with raw torch tensors</b> and prove
       it is correct. <b>Build by hand:</b> the soft-thresholding operator, the coordinate-descent loop with the
       partial-residual update, and the $\\lambda$-path that shows coefficients going to exactly zero.
       <b>Verify (the payoff):</b> two <code>torch.allclose</code> checks &mdash; (1) the operator matches a
       hand-computed reference vector $[2,-1,0,0,0]$, and (2) on orthonormal predictors the from-scratch
       coordinate-descent solution equals the closed-form $S(\\hat\\beta^{\\,\\text{OLS}},\\lambda)$. We
       <b>import</b> only basic tensor math (no <code>nn</code>, no autograd needed &mdash; the update is a
       direct formula). The general penalty theory is recapped from the ml-regularization concept lesson, not
       re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to standardize.</b> The L1 penalty treats every coefficient with the same threshold,
        so a feature measured in large units (and thus a small coefficient) is penalized unfairly versus one in
        small units. <b>Fix:</b> center and scale every feature column (and center $y$) before fitting, so the
        penalty is applied on a common footing.</li>
        <li><b>Confusing soft-thresholding with hard-thresholding.</b> Hard-thresholding keeps a value
        <i>unchanged</i> if it is above the threshold and zeroes it otherwise. Soft-thresholding <i>also shrinks</i>
        the survivors by $\\gamma$. The lasso uses <b>soft</b>: $S(3,1)=2$, not $3$.</li>
        <li><b>Expecting ridge to give zeros.</b> Ridge (L2) shrinks every coefficient toward zero but never
        reaches it, because the squared penalty has zero slope at the origin. If you need exact zeros / variable
        selection, you need the L1 penalty &mdash; this is the whole point of the paper.</li>
        <li><b>Reading $\\lambda$ and $t$ as independent knobs.</b> They are two views of the same control:
        large $\\lambda$ in the penalty form equals small $t$ (a tight budget) in the constraint form. Turning
        one up is turning the other down.</li>
        <li><b>Not iterating to convergence on correlated features.</b> The one-coordinate soft-threshold is
        exact only for orthonormal predictors. For correlated ones you must <b>sweep repeatedly</b> until the
        coefficients stop changing; a single pass is not the answer.</li>
      </ul>`,
    recall: [
      "State the lasso objective in constraint form (what is minimized, and what is the constraint).",
      "Write the soft-thresholding operator $S(z,\\gamma)$ and evaluate $S(0.5, 1)$ and $S(-2, 1)$.",
      "In the orthonormal case, give the lasso coefficient in terms of the OLS coefficient.",
      "Why does the L1 (lasso) penalty produce exact zeros while the L2 (ridge) penalty does not?",
      "Describe one coordinate-descent update: what is the partial residual, and what do you do with it?"
    ],
    practice: [
      {
        q: `<b>The L1-vs-L2 ablation.</b> You have a working coordinate-descent lasso. Replace the L1 update
            (soft-thresholding) with the ridge (L2) update, which in the orthonormal case multiplies each OLS
            coefficient by $1/(1+\\lambda)$ instead of soft-thresholding it. Fit both on the same standardized
            data across a grid of penalty strengths and count, for each method, how many coefficients are exactly
            zero. What do you expect, and what does it show about the paper's claim?`,
        steps: [
          { do: `For each $\\lambda$, run the lasso (soft-threshold update) and the ridge (uniform-shrink update) on the identical data.`, why: `Holding the data and penalty grid fixed isolates the penalty <i>shape</i> (L1 vs L2) as the only variable.` },
          { do: `Count exact zeros (coefficients with $|\\beta_j| \\lt 10^{-8}$) for each method at each $\\lambda$.`, why: `Sparsity is the quantity the paper claims distinguishes the two: the lasso selects, ridge does not.` },
          { do: `Observe the lasso's zero-count rises as $\\lambda$ grows, while ridge's stays at $0$ (no exact zeros, just smaller numbers).`, why: `The L1 kink at the origin can pin coefficients at zero; the smooth L2 penalty has vanishing slope there and never does.` }
        ],
        answer: `<p>The <b>lasso drives an increasing number of coefficients to exactly zero</b> as $\\lambda$
                 grows, while <b>ridge keeps all of them nonzero</b> (merely smaller). Because the only thing that
                 changed is the penalty shape &mdash; absolute value versus square &mdash; the difference isolates
                 L1's non-differentiable kink at the origin as the cause of selection. That is exactly the paper's
                 claim: the lasso shrinks <i>and</i> selects; ridge only shrinks. The CODEVIZ panel shows the
                 lasso's coefficient paths reaching zero one by one.</p>`
      },
      {
        q: `Apply soft-thresholding with $\\gamma = 1$ to the OLS coefficient vector
            $\\hat\\beta^{\\,\\text{OLS}} = [4,\\,-3,\\,0.7]$ (orthonormal predictors), by hand. Which coefficient
            is selected out (set to zero), and what is the resulting lasso fit?`,
        steps: [
          { do: `$S(4,1) = \\operatorname{sign}(4)\\,(|4|-1)_+ = 4-1 = 3$.`, why: `Above the threshold, so shrunk toward zero by exactly $\\gamma=1$.` },
          { do: `$S(-3,1) = \\operatorname{sign}(-3)\\,(|-3|-1)_+ = -(3-1) = -2$.`, why: `Magnitude $3 \\gt 1$, so it survives but is pulled toward zero by $1$; sign preserved.` },
          { do: `$S(0.7,1) = \\operatorname{sign}(0.7)\\,(|0.7|-1)_+ = (0.7-1)_+ = 0$.`, why: `Magnitude $0.7 \\lt 1$, so the positive part is zero &mdash; this coefficient is selected out.` }
        ],
        answer: `<p>The lasso fit is $[\\,3,\\,-2,\\,0\\,]$. The third coefficient ($0.7$, below the threshold
                 $1$) is <b>set to exactly zero</b> &mdash; selected out &mdash; while the other two shrink toward
                 zero by $1$. This is the verified converged solution: the notebook's coordinate descent reaches
                 this same vector from scratch and confirms it with <code>torch.allclose</code>.</p>`
      },
      {
        q: `In the penalized form, the lasso minimizes (residual sum of squares) $+\\ \\lambda\\sum_j|\\beta_j|$.
            What happens to the fitted coefficients as $\\lambda \\to 0$, and as $\\lambda \\to \\infty$? Connect
            each limit to the budget $t$ in the constraint form.`,
        steps: [
          { do: `As $\\lambda \\to 0$, the penalty vanishes, so we minimize pure squared error.`, why: `With no penalty the lasso reduces to ordinary least squares &mdash; every coefficient is its unpenalized OLS value.` },
          { do: `As $\\lambda \\to \\infty$, the penalty dominates, so the cheapest objective sets all coefficients to zero.`, why: `Any nonzero coefficient incurs an arbitrarily large penalty, so the minimizer is the all-zero vector.` },
          { do: `Match to $t$: small $\\lambda$ = large budget $t$ (loose), large $\\lambda$ = small budget $t$ (tight, eventually $t=0$).`, why: `$\\lambda$ and $t$ are inverse views of the same control.` }
        ],
        answer: `<p>As $\\lambda \\to 0$ the lasso becomes ordinary least squares (no shrinkage, all coefficients
                 at their OLS values &mdash; equivalent to a very large budget $t$). As $\\lambda \\to \\infty$ all
                 coefficients are driven to <b>exactly zero</b> (equivalent to budget $t=0$). In between, raising
                 $\\lambda$ (tightening $t$) zeroes coefficients one at a time, tracing the sparse path the paper
                 is famous for.</p>`
      }
    ]
  });

  window.CODE["paper-lasso"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track A: we <b>build the lasso from scratch</b> with raw torch tensors &mdash; no <code>nn</code>, no
       autograd, just the direct coordinate-descent / soft-thresholding update. Cell 1 defines the
       soft-thresholding operator and <b>verifies it</b> against a hand-computed reference vector
       $[2,-1,0,0,0]$ with <code>torch.allclose</code>. Cell 2 builds orthonormal predictors (so the lasso has
       the exact closed form $S(\\hat\\beta^{\\,\\text{OLS}},\\lambda)$), runs our from-scratch coordinate
       descent, and <b>verifies</b> that it converges to that closed form &mdash; the payoff: "my solver IS the
       lasso." Cell 3 traces the coefficient paths as $\\lambda$ grows on a small correlated design, printing the
       real numbers so you watch coefficients hit <b>exactly zero</b> one by one. Paste into Colab and run.</p>`,
    code: `import torch
torch.set_printoptions(precision=6, sci_mode=False)
torch.manual_seed(0)

# --- 1. Soft-thresholding operator: S(z, g) = sign(z) * max(|z| - g, 0). ---
def soft_threshold(z, g):
    return torch.sign(z) * torch.clamp(z.abs() - g, min=0.0)

# Verify against a HAND-COMPUTED reference: S([3,-2,0.5,-0.5,0], 1) = [2,-1,0,0,0].
z   = torch.tensor([3.0, -2.0, 0.5, -0.5, 0.0])
ref = torch.tensor([2.0, -1.0, 0.0,  0.0, 0.0])      # worked by hand in the lesson
mine = soft_threshold(z, 1.0)
print("soft-threshold:", mine.tolist())
print("allclose to hand reference [2,-1,0,0,0]:", torch.allclose(mine, ref, atol=1e-7))


# --- 2. Lasso by coordinate descent, from scratch (no nn, no autograd). ---
def lasso_cd(X, y, lam, n_iter=500):
    N, P = X.shape
    b = torch.zeros(P, dtype=X.dtype)
    col_ss = (X * X).sum(0) / N                       # feature squared length (= 1 if standardized)
    for _ in range(n_iter):
        for j in range(P):
            r_j = y - X @ b + X[:, j] * b[j]          # partial residual: error w/o feature j
            rho = (X[:, j] * r_j).sum() / N           # correlate feature j with it
            b[j] = soft_threshold(rho, lam) / col_ss[j]
    return b

# Orthonormal predictors so X^T X / N = I  ->  lasso has the EXACT closed form S(b_ols, lam).
N, P = 50, 3
Q, _ = torch.linalg.qr(torch.randn(N, P, dtype=torch.float64))
X = Q * (N ** 0.5)                                    # columns orthonormal, X^T X / N = I
y = X @ torch.tensor([4.0, -3.0, 0.7], dtype=torch.float64)   # plant OLS coeffs [4, -3, 0.7]

b_ols    = (X.t() @ y) / N                            # OLS = X^T y / N here
b_cd     = lasso_cd(X, y, lam=1.0)                    # our from-scratch coordinate descent
b_closed = soft_threshold(b_ols, 1.0)                 # closed form: soft-threshold the OLS coeffs
print("\\nOLS coeffs        :", [round(v,4) for v in b_ols.tolist()])
print("coordinate descent:", [round(v,4) for v in b_cd.tolist()])
print("closed-form S(bols):", [round(v,4) for v in b_closed.tolist()])
print("allclose CD vs closed form:", torch.allclose(b_cd, b_closed, atol=1e-8))
# -> our solver converges to [3, -2, 0]: the 0.7 coefficient (< threshold 1) is selected out.


# --- 3. Coefficient paths: drive lambda up, watch coefficients hit EXACTLY zero. ---
torch.manual_seed(1)
Xv = torch.randn(40, 5, dtype=torch.float64)
Xv = (Xv - Xv.mean(0)) / Xv.std(0)                    # standardize features
true_b = torch.tensor([3.0, -2.0, 0.0, 1.5, 0.0], dtype=torch.float64)  # only 3 are real
yv = Xv @ true_b + 0.1 * torch.randn(40, dtype=torch.float64)
yv = yv - yv.mean()

print("\\nlambda |   b1      b2      b3      b4      b5   | nonzero")
for lam in [0.0, 0.1, 0.3, 0.6, 1.0, 1.5, 2.5]:
    b = lasso_cd(Xv, yv, lam, n_iter=2000)
    nz = int((b.abs() > 1e-8).sum())
    print(f"{lam:5.2f}  | " + " ".join(f"{v:7.3f}" for v in b.tolist()) + f"  |   {nz}")
# Our small run: the two true-zero features (b3, b5) are killed first at lam=0.1;
# nonzero count drops 5 -> 3 -> 2 -> 1 as lambda grows. This is OUR run, not the paper's number.`
  };

  window.CODEVIZ["paper-lasso"] = {
    question: "As the L1 penalty strength (lambda) grows, do the lasso's coefficients shrink continuously to EXACTLY zero, one by one (variable selection)?",
    charts: [
      {
        type: "line",
        title: "Lasso coefficient paths — each coefficient vs penalty strength lambda",
        xlabel: "lambda (penalty strength)",
        ylabel: "fitted coefficient",
        series: [
          { name: "b1 (true 3.0)",  color: "#7ee787", points: [[0.0,3.0161],[0.1,2.9321],[0.3,2.7672],[0.6,2.5199],[1.0,2.1901],[1.5,1.7637],[2.5,0.7713]] },
          { name: "b2 (true -2.0)", color: "#79c0ff", points: [[0.0,-1.9936],[0.1,-1.8965],[0.3,-1.678],[0.6,-1.3504],[1.0,-0.9135],[1.5,-0.385],[2.5,0.0]] },
          { name: "b3 (true 0.0)",  color: "#ff7b72", points: [[0.0,-0.0356],[0.1,0.0],[0.3,0.0],[0.6,0.0],[1.0,0.0],[1.5,0.0],[2.5,0.0]] },
          { name: "b4 (true 1.5)",  color: "#d2a8ff", points: [[0.0,1.501],[0.1,1.3881],[0.3,1.1715],[0.6,0.8466],[1.0,0.4134],[1.5,0.0],[2.5,0.0]] },
          { name: "b5 (true 0.0)",  color: "#ffa657", points: [[0.0,-0.0117],[0.1,0.0],[0.3,0.0],[0.6,0.0],[1.0,0.0],[1.5,0.0],[2.5,0.0]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's number. From-scratch coordinate-descent lasso on a 40-row, 5-feature standardized synthetic design whose true coefficients are [3, -2, 0, 1.5, 0] (two features are genuinely irrelevant). As lambda grows, coefficients shrink continuously and hit EXACTLY zero one at a time: the two true-zero features (b3, b5) are selected out first (at lambda=0.1), then b4 at lambda=1.5, then b2 by lambda=2.5 — the nonzero count drops 5 -> 3 -> 2 -> 1. This is the paper's qualitative claim (shrink AND select); ridge regression on the same data would shrink these toward zero but never reach it. Numbers printed by the CODE cell above.",
    code: `import torch
torch.manual_seed(1)

def soft_threshold(z, g):
    return torch.sign(z) * torch.clamp(z.abs() - g, min=0.0)

def lasso_cd(X, y, lam, n_iter=2000):
    N, P = X.shape; b = torch.zeros(P, dtype=X.dtype)
    css = (X*X).sum(0)/N
    for _ in range(n_iter):
        for j in range(P):
            r = y - X@b + X[:,j]*b[j]
            b[j] = soft_threshold((X[:,j]*r).sum()/N, lam) / css[j]
    return b

X = torch.randn(40, 5, dtype=torch.float64)
X = (X - X.mean(0)) / X.std(0)                     # standardize
y = X @ torch.tensor([3.,-2.,0.,1.5,0.], dtype=torch.float64) + 0.1*torch.randn(40, dtype=torch.float64)
y = y - y.mean()

for lam in [0.0, 0.1, 0.3, 0.6, 1.0, 1.5, 2.5]:
    b = lasso_cd(X, y, lam)
    print(f"lam={lam:4.2f}  coeffs={[round(v,4) for v in b.tolist()]}  nonzero={int((b.abs()>1e-8).sum())}")
# Our small run:
# lam=0.00  [3.0161,-1.9936,-0.0356,1.501,-0.0117]   nonzero=5
# lam=0.10  [2.9321,-1.8965,0.0,1.3881,0.0]          nonzero=3
# lam=0.30  [2.7672,-1.678,0.0,1.1715,0.0]           nonzero=3
# lam=0.60  [2.5199,-1.3504,0.0,0.8466,0.0]          nonzero=3
# lam=1.00  [2.1901,-0.9135,0.0,0.4134,0.0]          nonzero=3
# lam=1.50  [1.7637,-0.385,0.0,0.0,0.0]              nonzero=2
# lam=2.50  [0.7713,0.0,0.0,0.0,0.0]                 nonzero=1`
  };
})();
