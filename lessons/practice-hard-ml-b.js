/* =====================================================================
   PRACTICE — MODULE 2 (Machine Learning), set B, HARDER tier.
   Owned ids: ml-svm, ml-kernels, ml-gda, ml-naive-bayes, ml-trees,
              ml-ensembles, ml-knn, ml-bias-variance, ml-learning-theory.
   Appended (concat) onto the existing set-B problems. Harder, multi-step.
   Same conventions: every step has do + why; tiny numbers; double backslashes.
   ===================================================================== */
(function(){ var P=window.PRACTICE; function add(id,probs){P[id]=(P[id]||[]).concat(probs);}

  /* ---------------- ml-svm ---------------- */
  add("ml-svm", [
    { q:`<p>A 2D SVM has $w=(3,4)$ and bias $b=10$. Compute (a) the geometric margin half-width $1/\\lVert w\\rVert$ and (b) the full street width $2/\\lVert w\\rVert$.</p>`,
      steps:[
        {do:`$\\lVert w\\rVert = \\sqrt{3^2+4^2} = \\sqrt{25} = 5$.`, why:`The norm is the root of the summed squares.`},
        {do:`Half-width $= 1/\\lVert w\\rVert = 1/5 = 0.2$.`, why:`A support vector sits one unit of score away; in distance that is $1/\\lVert w\\rVert$.`},
        {do:`Full width $= 2/\\lVert w\\rVert = 2/5 = 0.4$.`, why:`The street spans both margins, so double the half-width.`}
      ],
      answer:`Half-width $=0.2$; full width $=0.4$.` },

    { q:`<p>The signed distance of a point $x$ to the boundary is $\\frac{w^\\top x - b}{\\lVert w\\rVert}$. With $w=(1,2)$, $b=1$, and $x=(2,2)$, find that distance.</p>`,
      steps:[
        {do:`Score $= w^\\top x - b = (1)(2)+(2)(2) - 1 = 6 - 1 = 5$.`, why:`Compute the raw linear score first.`},
        {do:`$\\lVert w\\rVert = \\sqrt{1^2+2^2} = \\sqrt5 \\approx 2.236$.`, why:`Divide the score by the norm to convert it to a true distance.`},
        {do:`Distance $= 5/\\sqrt5 = \\sqrt5 \\approx 2.236$.`, why:`Simplify $5/\\sqrt5 = \\sqrt5$.`}
      ],
      answer:`Distance $=\\sqrt5 \\approx 2.236$ (positive side).` },

    { q:`<p>1D hard-margin SVM. The nearest $-1$ point is at $x=2$, the nearest $+1$ point at $x=6$. Find $w$ and $b$ (scalars) so both sit exactly on their margins, i.e. $w x - b = \\mp 1$.</p>`,
      steps:[
        {do:`Two equations: $w(2)-b=-1$ and $w(6)-b=+1$.`, why:`Support vectors satisfy the margin equalities $\\pm 1$.`},
        {do:`Subtract: $w(6-2)=2$, so $4w=2$, $w=0.5$.`, why:`Eliminating $b$ leaves the slope.`},
        {do:`Back-substitute: $0.5(2)-b=-1 \\Rightarrow 1-b=-1 \\Rightarrow b=2$.`, why:`Solve for the bias from either equation.`}
      ],
      answer:`$w=0.5$, $b=2$ (boundary at $x=4$, margin width $2/0.5=4$).` },

    { q:`<p>Soft-margin SVM minimizes $\\tfrac12\\lVert w\\rVert^2 + C\\sum_i \\xi_i$. One point has slack $\\xi=0.6$ with $C=10$; another has $\\xi=0$. If $\\lVert w\\rVert^2 = 4$, compute the total objective contribution from these terms (one violating point).</p>`,
      steps:[
        {do:`Margin term: $\\tfrac12\\lVert w\\rVert^2 = \\tfrac12(4) = 2$.`, why:`Half the squared norm is the width-penalty part.`},
        {do:`Slack penalty: $C\\sum\\xi_i = 10(0.6+0) = 6$.`, why:`Each unit of slack costs $C$; only one point violates.`},
        {do:`Total $= 2 + 6 = 8$.`, why:`Add the margin and slack parts.`}
      ],
      answer:`Objective $= 8$ (margin $2$ + slack $6$).` },

    { q:`<p>The SVM dual prediction is $f(x)=\\sum_i \\alpha_i y_i\\,(x_i^\\top x) - b$. Two support vectors: $\\alpha_1=2,y_1=+1,x_1=(1,0)$ and $\\alpha_2=1,y_2=-1,x_2=(0,1)$. With $b=0$, classify $x=(1,1)$.</p>`,
      steps:[
        {do:`Term 1: $\\alpha_1 y_1 (x_1^\\top x) = 2(+1)\\big((1)(1)+(0)(1)\\big) = 2(1)=2$.`, why:`Weight the dot product by $\\alpha y$ for each support vector.`},
        {do:`Term 2: $\\alpha_2 y_2 (x_2^\\top x) = 1(-1)\\big((0)(1)+(1)(1)\\big) = -1$.`, why:`Same for the second support vector; the $-1$ label flips the sign.`},
        {do:`$f = 2 + (-1) - 0 = 1 &gt; 0$.`, why:`Sum and subtract $b$; a positive score is class $+1$.`}
      ],
      answer:`Class $+1$ (score $f=1$).` },

    { q:`<p>KKT conditions: a point is a support vector only if its constraint is active, $y_i(w^\\top x_i - b)=1$. Given $w=(2,0)$, $b=1$, which of $A=(1,5)$ [label $+1$] and $B=(3,0)$ [label $+1$] is a support vector?</p>`,
      steps:[
        {do:`Point $A$: $y\\,(w^\\top x - b) = (+1)\\big((2)(1)+(0)(5)-1\\big) = 2-1 = 1$.`, why:`Functional margin exactly $1$ means the constraint is tight.`},
        {do:`Point $B$: $(+1)\\big((2)(3)+0-1\\big) = 6-1 = 5$.`, why:`A margin of $5 &gt; 1$ means the point is well inside its side, slack-free.`},
        {do:`Only $A$ achieves margin $1$.`, why:`Support vectors are exactly the points lying on the margin.`}
      ],
      answer:`$A$ is the support vector; $B$ is not (margin $5$).` },

    { q:`<p>Two boundaries separate the same two points $x=2$ (label $-1$) and $x=6$ (label $+1$). Boundary P uses slope $w=1$, boundary Q uses $w=0.5$, both placed so the points sit on the margins. Which gives the larger geometric margin, and is the smaller-slope choice feasible?</p>`,
      steps:[
        {do:`Functional margin needs $w(6)-b\\ge 1$ and $-(w(2)-b)\\ge 1$; adding forces $w(6-2)\\ge 2$, so $w \\ge 0.5$.`, why:`The points are distance $4$ apart, capping how small $w$ can be.`},
        {do:`P ($w=1$): margin $= 1/\\lVert w\\rVert = 1$. Q ($w=0.5$): margin $= 1/0.5 = 2$.`, why:`Smaller feasible $w$ gives a wider geometric margin.`},
        {do:`Both satisfy $w\\ge0.5$, and Q hits the minimum $w$.`, why:`The hard-margin SVM picks the smallest feasible $w$, which is Q.`}
      ],
      answer:`Q (margin $2$ vs $1$); Q is the optimal max-margin solution.` },

    { q:`<p>A soft-margin point of class $+1$ has score $w^\\top x - b = 0.3$. Its hinge loss is $\\max(0,\\,1 - y(w^\\top x - b))$. Compute the hinge loss and say whether the point is correctly classified.</p>`,
      steps:[
        {do:`Functional margin: $y(w^\\top x - b) = (+1)(0.3) = 0.3$.`, why:`Multiply the label by the score.`},
        {do:`Hinge $= \\max(0,\\,1 - 0.3) = 0.7$.`, why:`Margin is below $1$, so the point is penalized though on the right side.`},
        {do:`Score $0.3 &gt; 0$, so the predicted sign is $+1$ — correct.`, why:`Hinge loss can be positive even for correctly classified points inside the margin.`}
      ],
      answer:`Hinge loss $=0.7$; correctly classified but margin-violating.` },

    { q:`<p>Increasing the penalty $C$ in a soft-margin SVM. As $C\\to\\infty$, what happens to slack and the margin? As $C\\to 0$?</p>`,
      steps:[
        {do:`Large $C$ heavily penalizes any $\\xi_i$, forcing $\\xi_i\\to 0$.`, why:`The slack term dominates, so the SVM tolerates almost no violations (hard margin).`},
        {do:`That demands a narrower street that separates all points, raising variance.`, why:`Fitting every point tightly overfits more.`},
        {do:`Small $C$ ignores slack, allowing a wide margin with many violations.`, why:`The $\\tfrac12\\lVert w\\rVert^2$ term dominates, favoring a smooth, high-bias boundary.`}
      ],
      answer:`Large $C$: little slack, narrow margin, more overfit. Small $C$: wide margin, more slack, more underfit.` },

    { q:`<p>Reconstruct $w$ from dual coefficients for a 1D SVM with support vectors $x_1=-1$ (label $-1$) and $x_2=+1$ (label $+1$). The max-margin solution satisfies $w(1)-b=1$ and $w(-1)-b=-1$. Solve for $w,b$, then find $\\alpha$ in $w=\\sum_i \\alpha_i y_i x_i$ with $\\alpha_1=\\alpha_2=\\alpha$.</p>`,
      steps:[
        {do:`Add the equations: $-2b=0$, so $b=0$; subtract: $2w=2$, so $w=1$.`, why:`Two support vectors pin down both $w$ and $b$.`},
        {do:`Dual form: $w=\\alpha_1 y_1 x_1 + \\alpha_2 y_2 x_2 = \\alpha(-1)(-1) + \\alpha(+1)(+1) = 2\\alpha$.`, why:`The weight vector is a label-weighted sum of support vectors.`},
        {do:`Set $2\\alpha = w = 1$, so $\\alpha = 0.5$.`, why:`Match the dual reconstruction to the primal $w$.`}
      ],
      answer:`$w=1$, $b=0$, $\\alpha_1=\\alpha_2=0.5$.` }
  ]);

  /* ---------------- ml-kernels ---------------- */
  add("ml-kernels", [
    { q:`<p>Build the $2\\times2$ Gram (kernel) matrix for the linear kernel $K(x,z)=x^\\top z$ over points $x_1=(1,0)$, $x_2=(1,1)$. Give all four entries.</p>`,
      steps:[
        {do:`$K_{11}=x_1^\\top x_1 = 1+0 = 1$; $K_{22}=x_2^\\top x_2 = 1+1 = 2$.`, why:`Diagonal entries are each point's squared norm.`},
        {do:`$K_{12}=x_1^\\top x_2 = (1)(1)+(0)(1) = 1$.`, why:`Off-diagonal is the dot product of the two points.`},
        {do:`Symmetry gives $K_{21}=K_{12}=1$.`, why:`A kernel matrix is always symmetric.`}
      ],
      answer:`$K=\\begin{bmatrix}1&1\\\\1&2\\end{bmatrix}$.` },

    { q:`<p>A valid kernel's Gram matrix must be positive semidefinite (all eigenvalues $\\ge 0$). Is $K=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$ a valid kernel matrix? Use eigenvalues $\\lambda = (\\text{trace}\\pm\\sqrt{\\text{trace}^2-4\\det})/2$.</p>`,
      steps:[
        {do:`Trace $=1+1=2$, determinant $=(1)(1)-(2)(2) = 1-4 = -3$.`, why:`A negative determinant of a $2\\times2$ symmetric matrix signals a negative eigenvalue.`},
        {do:`Eigenvalues $= (2\\pm\\sqrt{4-4(-3)})/2 = (2\\pm\\sqrt{16})/2 = (2\\pm4)/2 = 3, -1$.`, why:`Solve the characteristic equation.`},
        {do:`One eigenvalue is $-1 &lt; 0$.`, why:`PSD requires every eigenvalue $\\ge 0$.`}
      ],
      answer:`Not valid; eigenvalue $-1$ violates positive semidefiniteness.` },

    { q:`<p>The degree-2 polynomial kernel $K(x,z)=(x^\\top z)^2$ in 2D corresponds to the feature map $\\phi(x)=(x_1^2,\\ \\sqrt2\\,x_1 x_2,\\ x_2^2)$. Verify $K=\\phi(x)^\\top\\phi(z)$ for $x=(1,2)$, $z=(1,0)$.</p>`,
      steps:[
        {do:`Direct: $x^\\top z = (1)(1)+(2)(0) = 1$, so $K=(1)^2 = 1$.`, why:`Evaluate the kernel formula straight from the definition.`},
        {do:`Maps: $\\phi(x)=(1,\\,2\\sqrt2,\\,4)$, $\\phi(z)=(1,\\,0,\\,0)$.`, why:`Apply $\\phi$ to each point coordinate-wise.`},
        {do:`Dot: $(1)(1)+(2\\sqrt2)(0)+(4)(0) = 1$.`, why:`Only the first component survives.`}
      ],
      answer:`Both give $1$; the feature map reproduces the kernel.` },

    { q:`<p>Kernels combine: if $K_1$ and $K_2$ are valid kernels, so is $K=aK_1+bK_2$ for $a,b\\ge0$. With $K_1(x,z)=x^\\top z$ and $K_2$ the Gaussian ($\\sigma=1$), evaluate $K=2K_1+3K_2$ for $x=(1,0)$, $z=(0,0)$ (distance$^2=1$).</p>`,
      steps:[
        {do:`$K_1 = x^\\top z = (1)(0)+(0)(0) = 0$.`, why:`The linear part is just the dot product.`},
        {do:`$K_2 = \\exp(-1/(2\\cdot1^2)) = \\exp(-0.5) \\approx 0.607$.`, why:`Gaussian with squared distance $1$ and $\\sigma=1$.`},
        {do:`$K = 2(0) + 3(0.607) = 1.82$.`, why:`Nonnegative combinations of valid kernels stay valid.`}
      ],
      answer:`$K \\approx 1.82$.` },

    { q:`<p>The product of valid kernels is valid: $K=K_1 K_2$. With $K_1(x,z)=x^\\top z$ and $K_2(x,z)=(x^\\top z)$ again (so $K=(x^\\top z)^2$), evaluate $K$ for $x=(2,1)$, $z=(1,1)$.</p>`,
      steps:[
        {do:`Inner product: $x^\\top z = (2)(1)+(1)(1) = 3$.`, why:`Compute the shared dot product once.`},
        {do:`$K = K_1 K_2 = 3 \\times 3 = 9$.`, why:`Product of two kernels multiplies their values.`}
      ],
      answer:`$K = 9$ (equals $(x^\\top z)^2$).` },

    { q:`<p>Center a Gaussian RBF on each of two training points and evaluate the new feature vector for a query. Landmarks $\\ell_1=0$, $\\ell_2=4$; query $x=1$; $\\sigma=2$. Compute $f_1=K(x,\\ell_1)$ and $f_2=K(x,\\ell_2)$.</p>`,
      steps:[
        {do:`$2\\sigma^2 = 2(2^2) = 8$.`, why:`Shared denominator for both RBF features.`},
        {do:`$f_1 = \\exp(-(1-0)^2/8) = \\exp(-1/8) = \\exp(-0.125) \\approx 0.882$.`, why:`Distance$^2=1$ to the near landmark gives a high similarity.`},
        {do:`$f_2 = \\exp(-(1-4)^2/8) = \\exp(-9/8) = \\exp(-1.125) \\approx 0.325$.`, why:`Distance$^2=9$ to the far landmark gives a lower similarity.`}
      ],
      answer:`$f_1\\approx 0.882$, $f_2\\approx 0.325$.` },

    { q:`<p>A kernelized prediction is $f(x)=\\sum_i \\alpha_i K(x_i,x)$. Two training points with $\\alpha_1=1$ at $x_1=0$ and $\\alpha_2=-1$ at $x_2=4$, Gaussian $\\sigma=2$. Predict $f$ at query $x=1$ (reuse $K(x_1,x)\\approx0.882$, $K(x_2,x)\\approx0.325$).</p>`,
      steps:[
        {do:`$K(x_1,x)=\\exp(-1/8)\\approx 0.882$; $K(x_2,x)=\\exp(-9/8)\\approx 0.325$.`, why:`Reuse the RBF similarities to each training point.`},
        {do:`$f = \\alpha_1(0.882) + \\alpha_2(0.325) = 0.882 - 0.325$.`, why:`Weight each kernel value by its coefficient and sum.`},
        {do:`$= 0.557$.`, why:`Subtract; the result is positive, so the near positive point dominates.`}
      ],
      answer:`$f \\approx 0.557$ (positive — leans toward $x_1$'s class).` },

    { q:`<p>Effect of $\\sigma$ on the Gram matrix off-diagonal. Two points at distance$^2=4$. Compute $K$ for $\\sigma=0.5$ and $\\sigma=4$, and say which kernel acts more "local".</p>`,
      steps:[
        {do:`$\\sigma=0.5$: $2\\sigma^2 = 0.5$, $K=\\exp(-4/0.5)=\\exp(-8)\\approx 0.000335$.`, why:`A tiny $\\sigma$ makes the bump narrow, so even moderate distances score near $0$.`},
        {do:`$\\sigma=4$: $2\\sigma^2 = 32$, $K=\\exp(-4/32)=\\exp(-0.125)\\approx 0.882$.`, why:`A large $\\sigma$ makes the bump wide, so the same points stay similar.`},
        {do:`The small-$\\sigma$ kernel sees these points as nearly unrelated.`, why:`Small $\\sigma$ ⇒ each point influences only its immediate neighborhood (local).`}
      ],
      answer:`$\\sigma=0.5$ gives $\\approx 0.000335$ (very local); $\\sigma=4$ gives $\\approx 0.882$.` },

    { q:`<p>Normalized kernel (cosine): $\\tilde K(x,z)=\\dfrac{x^\\top z}{\\sqrt{x^\\top x}\\,\\sqrt{z^\\top z}}$. Compute it for $x=(3,0)$, $z=(0,4)$, then for $z'=(3,4)$.</p>`,
      steps:[
        {do:`For $z=(0,4)$: numerator $x^\\top z = 0$, so $\\tilde K = 0$.`, why:`Orthogonal vectors have zero cosine similarity.`},
        {do:`For $z'=(3,4)$: $x^\\top z' = 9$, $\\sqrt{x^\\top x}=3$, $\\sqrt{z'^\\top z'}=\\sqrt{25}=5$.`, why:`Compute the dot product and both norms.`},
        {do:`$\\tilde K = 9/(3\\cdot 5) = 9/15 = 0.6$.`, why:`Divide by the product of norms.`}
      ],
      answer:`$\\tilde K(x,z)=0$; $\\tilde K(x,z')=0.6$.` },

    { q:`<p>The inhomogeneous kernel $K(x,z)=(x^\\top z + c)^2$ expands to $(x^\\top z)^2 + 2c(x^\\top z) + c^2$. With $c=1$, $x=(1,1)$, $z=(2,0)$, evaluate via both the closed form and the expansion to confirm they match.</p>`,
      steps:[
        {do:`$x^\\top z = (1)(2)+(1)(0) = 2$.`, why:`Compute the inner product once.`},
        {do:`Closed form: $(2+1)^2 = 9$.`, why:`Add $c$ then square.`},
        {do:`Expansion: $(2)^2 + 2(1)(2) + 1^2 = 4+4+1 = 9$.`, why:`The expanded terms (quadratic, linear, constant) recover the same value.`}
      ],
      answer:`Both give $9$; the constant $c$ adds linear and bias features.` }
  ]);

  /* ---------------- ml-gda ---------------- */
  add("ml-gda", [
    { q:`<p>1D Gaussians, shared variance $\\sigma^2=1$. Class 0: $\\mu_0=0$; class 1: $\\mu_1=4$; equal priors. With equal variance, the boundary is where the two squared distances tie. Find the decision boundary $x$.</p>`,
      steps:[
        {do:`Boundary where the likelihoods tie: $(x-0)^2 = (x-4)^2$.`, why:`With equal priors and variance, the nearer mean wins; the tie is the boundary.`},
        {do:`$x^2 = x^2 - 8x + 16 \\Rightarrow 8x = 16$.`, why:`Expand and cancel $x^2$.`},
        {do:`$x = 2$.`, why:`The boundary is the midpoint of the two means.`}
      ],
      answer:`Boundary at $x=2$ (the midpoint).` },

    { q:`<p>Same Gaussians ($\\mu_0=0$, $\\mu_1=4$, $\\sigma^2=1$) but unequal priors $\\phi=p(y=1)=0.2$. The boundary shifts from the midpoint by $\\frac{\\sigma^2}{\\mu_1-\\mu_0}\\ln\\frac{1-\\phi}{\\phi}$. Find the new boundary.</p>`,
      steps:[
        {do:`Midpoint $=(0+4)/2 = 2$.`, why:`Start from the equal-prior boundary.`},
        {do:`Shift $= \\frac{1}{4}\\ln\\frac{0.8}{0.2} = \\frac{1}{4}\\ln 4 = \\frac{1}{4}(1.386) \\approx 0.347$.`, why:`A rarer class 1 ($\\phi=0.2$) pushes the boundary toward $\\mu_1$, shrinking class 1's region.`},
        {do:`Boundary $= 2 + 0.347 = 2.347$.`, why:`Add the prior-driven shift to the midpoint.`}
      ],
      answer:`Boundary at $x\\approx 2.347$ (shifted toward the rarer class).` },

    { q:`<p>Estimate the shared variance in GDA. Class 0 points $\\{1,3\\}$ ($\\mu_0=2$); class 1 points $\\{8,10\\}$ ($\\mu_1=9$). The MLE pooled variance is $\\hat\\sigma^2=\\frac{1}{m}\\sum_i (x_i-\\mu_{y_i})^2$ over all $m=4$ points.</p>`,
      steps:[
        {do:`Class 0 squared deviations: $(1-2)^2+(3-2)^2 = 1+1 = 2$.`, why:`Subtract each point from its own class mean and square.`},
        {do:`Class 1: $(8-9)^2+(10-9)^2 = 1+1 = 2$.`, why:`Same within the other class.`},
        {do:`$\\hat\\sigma^2 = (2+2)/4 = 1$.`, why:`Pool both classes and divide by the total count $m=4$.`}
      ],
      answer:`$\\hat\\sigma^2 = 1$.` },

    { q:`<p>Full posterior. $\\mu_0=0$, $\\mu_1=4$, $\\sigma^2=1$, equal priors, query $x=3$. Compute $p(y=1\\mid x)$ using $p(x\\mid y)\\propto \\exp(-(x-\\mu_y)^2/2)$.</p>`,
      steps:[
        {do:`Unnormalized class 1: $\\exp(-(3-4)^2/2) = \\exp(-0.5) \\approx 0.607$.`, why:`Closer to $\\mu_1$, so higher density.`},
        {do:`Unnormalized class 0: $\\exp(-(3-0)^2/2) = \\exp(-4.5) \\approx 0.0111$.`, why:`Far from $\\mu_0$, so low density.`},
        {do:`$p(y=1\\mid x) = \\frac{0.607}{0.607+0.0111} \\approx \\frac{0.607}{0.618} \\approx 0.982$.`, why:`Normalize by the sum (equal priors cancel).`}
      ],
      answer:`$p(y=1\\mid x) \\approx 0.982$.` },

    { q:`<p>GDA yields a logistic posterior $p(y=1\\mid x)=\\sigma(\\theta x + \\theta_0)$. For $\\mu_0=0$, $\\mu_1=4$, $\\sigma^2=1$, equal priors, the slope is $\\theta=(\\mu_1-\\mu_0)/\\sigma^2$ and the intercept centers the sigmoid at the midpoint. Compute $\\theta$, $\\theta_0$, and the score $z$ at $x=2$.</p>`,
      steps:[
        {do:`$\\theta = (4-0)/1 = 4$.`, why:`The logistic slope from GDA is the mean gap over the variance.`},
        {do:`$\\theta_0 = -\\theta\\cdot 2 = -8$.`, why:`The intercept centers the sigmoid at the boundary midpoint $x=2$.`},
        {do:`At $x=2$: $z = 4(2) - 8 = 0$, so $\\sigma(0)=0.5$.`, why:`A zero score means a $50/50$ posterior — exactly the boundary.`}
      ],
      answer:`$\\theta=4$, $\\theta_0=-8$; at $x=2$, $z=0$ and $p=0.5$.` },

    { q:`<p>Two-feature GDA with shared $\\Sigma=I$ (identity). $\\mu_0=(0,0)$, $\\mu_1=(2,2)$, equal priors. Classify $x=(1,0)$ by comparing squared distances $\\lVert x-\\mu_y\\rVert^2$.</p>`,
      steps:[
        {do:`$\\lVert x-\\mu_0\\rVert^2 = 1^2+0^2 = 1$.`, why:`With $\\Sigma=I$, Mahalanobis distance is ordinary squared distance.`},
        {do:`$\\lVert x-\\mu_1\\rVert^2 = (1-2)^2+(0-2)^2 = 1+4 = 5$.`, why:`Distance to the other class mean.`},
        {do:`$1 &lt; 5$, so class 0 wins.`, why:`Closer mean (smaller distance) gives larger likelihood under equal priors.`}
      ],
      answer:`Class 0 (distances $1$ vs $5$).` },

    { q:`<p>QDA (separate covariances) vs GDA. Class 0 has variance $\\sigma_0^2=1$, class 1 has $\\sigma_1^2=4$; means coincide at $0$. A point sits at $x=3$. Which class has the higher 1D density $\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp(-x^2/(2\\sigma^2))$?</p>`,
      steps:[
        {do:`Class 0: $\\frac{1}{\\sqrt{2\\pi}\\,(1)}\\exp(-9/2) = 0.399\\cdot\\exp(-4.5)\\approx 0.399(0.0111)\\approx 0.00443$.`, why:`Narrow class 0 drops fast far from its mean.`},
        {do:`Class 1: $\\frac{1}{\\sqrt{2\\pi}\\,(2)}\\exp(-9/8) = 0.199\\cdot\\exp(-1.125)\\approx 0.199(0.3247)\\approx 0.0647$.`, why:`Wider class 1 keeps more density out at $x=3$.`},
        {do:`$0.0647 &gt; 0.00443$.`, why:`Different variances make the boundary curved (quadratic), not a midpoint.`}
      ],
      answer:`Class 1 (density $0.0647$ vs $0.00443$); unequal variances give a quadratic boundary.` },

    { q:`<p>Generative log-odds. With $\\mu_0=0,\\mu_1=4,\\sigma^2=1$ and priors $\\phi=p(y{=}1)=0.5$, the log-odds is $\\frac{(\\mu_1-\\mu_0)}{\\sigma^2}x - \\frac{\\mu_1^2-\\mu_0^2}{2\\sigma^2} + \\log\\frac{\\phi}{1-\\phi}$. Evaluate at $x=3$.</p>`,
      steps:[
        {do:`Linear term: $\\frac{4-0}{1}(3) = 12$.`, why:`Slope times the query value.`},
        {do:`Mean-offset term: $-\\frac{4^2-0^2}{2} = -\\frac{16}{2} = -8$.`, why:`Constant offset from the squared means.`},
        {do:`Prior term: $\\log\\frac{0.5}{0.5} = 0$; total $= 12 - 8 + 0 = 4$.`, why:`Equal priors add nothing; positive log-odds favors class 1.`}
      ],
      answer:`Log-odds $=4 &gt; 0$ ⇒ predict class 1.` },

    { q:`<p>Estimate both class means and the prior from 2D data. Class 1: $(2,0),(4,2)$. Class 0: $(0,0),(0,2),(0,4)$. Find $\\mu_1$, $\\mu_0$, and $\\phi=p(y=1)$.</p>`,
      steps:[
        {do:`$\\mu_1 = \\big(\\frac{2+4}{2},\\frac{0+2}{2}\\big) = (3,1)$.`, why:`Average the class 1 points coordinate-wise.`},
        {do:`$\\mu_0 = \\big(\\frac{0+0+0}{3},\\frac{0+2+4}{3}\\big) = (0,2)$.`, why:`Average the three class 0 points.`},
        {do:`$\\phi = 2/5 = 0.4$.`, why:`Two of the five examples are class 1.`}
      ],
      answer:`$\\mu_1=(3,1)$, $\\mu_0=(0,2)$, $\\phi=0.4$.` },

    { q:`<p>Why does GDA beat logistic regression with very little data, but logistic regression win with lots? Reason in one chain about the Gaussian assumption.</p>`,
      steps:[
        {do:`GDA assumes each class is Gaussian, a strong modeling assumption.`, why:`Strong (correct) assumptions extract more signal per example, so GDA is data-efficient when the assumption roughly holds.`},
        {do:`If the assumption is wrong, that bias does not vanish with more data.`, why:`A misspecified generative model has irreducible bias.`},
        {do:`Logistic regression models only $p(y\\mid x)$, making fewer assumptions, so it converges to the best boundary as $m\\to\\infty$.`, why:`Discriminative models are more robust given enough data.`}
      ],
      answer:`Small data: GDA's strong-but-helpful assumption wins. Large data: logistic regression's weaker assumptions avoid GDA's bias.` }
  ]);

  /* ---------------- ml-naive-bayes ---------------- */
  add("ml-naive-bayes", [
    { q:`<p>Three independent words appear. Spam likelihoods $0.5, 0.4, 0.2$ with prior $P(s)=0.3$; ham likelihoods $0.1, 0.2, 0.6$ with prior $P(h)=0.7$. Compute both unnormalized scores and classify.</p>`,
      steps:[
        {do:`Spam: $0.3\\times(0.5\\times0.4\\times0.2) = 0.3\\times0.04 = 0.012$.`, why:`Multiply the prior by the product of the three independent likelihoods.`},
        {do:`Ham: $0.7\\times(0.1\\times0.2\\times0.6) = 0.7\\times0.012 = 0.0084$.`, why:`Same product rule for ham.`},
        {do:`$0.012 &gt; 0.0084$.`, why:`The larger posterior numerator wins.`}
      ],
      answer:`Spam (score $0.012$ vs $0.0084$).` },

    { q:`<p>Normalize the previous scores into $P(\\text{spam}\\mid x)$. Spam score $0.012$, ham score $0.0084$.</p>`,
      steps:[
        {do:`Total evidence $= 0.012 + 0.0084 = 0.0204$.`, why:`The denominator $P(x)$ is the sum over classes.`},
        {do:`$P(\\text{spam}\\mid x) = 0.012/0.0204 \\approx 0.588$.`, why:`Divide the spam numerator by the total.`}
      ],
      answer:`$P(\\text{spam}\\mid x) \\approx 0.588$.` },

    { q:`<p>Log-space scoring avoids underflow. Spam prior log $\\ln 0.3\\approx-1.204$ and word logs $\\ln 0.5\\approx-0.693$, $\\ln 0.4\\approx-0.916$, $\\ln 0.2\\approx-1.609$. Compute the summed log-score.</p>`,
      steps:[
        {do:`Sum the word logs: $-0.693 - 0.916 - 1.609 = -3.218$.`, why:`Log turns the product of likelihoods into a sum.`},
        {do:`Add the prior log: $-1.204 + (-3.218) = -4.422$.`, why:`Adding the prior log completes the unnormalized log-posterior.`},
        {do:`Check: $\\exp(-4.422)\\approx 0.012$.`, why:`Exponentiating recovers the original product $0.012$.`}
      ],
      answer:`Log-score $\\approx -4.422$ (i.e. $\\exp$ gives $0.012$).` },

    { q:`<p>Laplace smoothing over a 3-word vocabulary. Word "deal" appeared $2$ times among $10$ word-tokens in spam. Estimate $P(\\text{deal}\\mid\\text{spam})=\\frac{\\text{count}+1}{\\text{total}+V}$ with $V=3$.</p>`,
      steps:[
        {do:`Numerator $= 2+1 = 3$.`, why:`Add-one smoothing bumps the observed count.`},
        {do:`Denominator $= 10 + 3 = 13$.`, why:`Add the vocabulary size $V$ so probabilities over the vocabulary sum to $1$.`},
        {do:`$P = 3/13 \\approx 0.231$.`, why:`Divide.`}
      ],
      answer:`$P(\\text{deal}\\mid\\text{spam}) = 3/13 \\approx 0.231$.` },

    { q:`<p>Smoothing matters for unseen words. "crypto" appeared $0$ times in $10$ spam tokens, vocabulary $V=3$. Compute the unsmoothed and Laplace-smoothed $P(\\text{crypto}\\mid\\text{spam})$ and say why smoothing is needed.</p>`,
      steps:[
        {do:`Unsmoothed: $0/10 = 0$.`, why:`A zero here would zero out the entire spam product, regardless of other words.`},
        {do:`Smoothed: $(0+1)/(10+3) = 1/13 \\approx 0.077$.`, why:`Add-one keeps the estimate strictly positive.`},
        {do:`Smoothed value is small but nonzero.`, why:`This prevents a single unseen word from vetoing the class.`}
      ],
      answer:`Unsmoothed $0$ (kills product); smoothed $1/13\\approx0.077$.` },

    { q:`<p>Bernoulli Naive Bayes: a word can be present (1) or absent (0), and absence counts too. $P(w{=}1\\mid s)=0.6$. An email lacks $w$. Compute $P(w{=}0\\mid s)$ and its contribution.</p>`,
      steps:[
        {do:`$P(w{=}0\\mid s) = 1 - P(w{=}1\\mid s) = 1 - 0.6 = 0.4$.`, why:`Bernoulli features model presence and absence as complementary.`},
        {do:`The absence contributes a factor of $0.4$ to the spam product.`, why:`Unlike the multinomial model, missing words are not ignored — they push probability down.`}
      ],
      answer:`$P(w{=}0\\mid s)=0.4$; absence multiplies the score by $0.4$.` },

    { q:`<p>Full Bernoulli example. Vocabulary $\\{$free, win$\\}$. Email has "free" but not "win". Spam: $P(\\text{free}{=}1\\mid s)=0.8$, $P(\\text{win}{=}1\\mid s)=0.5$, prior $0.5$. Compute the spam score (include the absence of "win").</p>`,
      steps:[
        {do:`Present "free": factor $0.8$.`, why:`Word is present, so use $P(\\text{free}{=}1\\mid s)$.`},
        {do:`Absent "win": factor $1-0.5 = 0.5$.`, why:`Word is absent, so use $P(\\text{win}{=}0\\mid s)=1-P(\\text{win}{=}1\\mid s)$.`},
        {do:`Score $= 0.5\\times0.8\\times0.5 = 0.2$.`, why:`Multiply prior by both Bernoulli factors.`}
      ],
      answer:`Spam score $=0.2$.` },

    { q:`<p>Decision via log-odds. Spam log-score $-4.0$, ham log-score $-5.2$. Compute the log-odds $\\Delta$ and the implied $P(\\text{spam}\\mid x)=\\sigma(\\Delta)$.</p>`,
      steps:[
        {do:`Log-odds $\\Delta = (-4.0) - (-5.2) = 1.2$.`, why:`Subtract the ham log-score from the spam log-score.`},
        {do:`$P(\\text{spam}\\mid x) = \\sigma(1.2) = \\frac{1}{1+e^{-1.2}} = \\frac{1}{1+0.301} \\approx 0.769$.`, why:`The sigmoid of the log-odds is the normalized posterior for two classes.`}
      ],
      answer:`Log-odds $1.2$ ⇒ $P(\\text{spam}\\mid x)\\approx 0.769$.` },

    { q:`<p>Word counts via the multinomial model. Word "sale" occurs with count $c=3$; $P(\\text{sale}\\mid s)=0.2$. Its contribution to the (unnormalized) log-likelihood is $c\\,\\ln P(\\text{sale}\\mid s)$. Compute it ($\\ln 0.2\\approx-1.609$).</p>`,
      steps:[
        {do:`$c\\,\\ln P = 3\\times(-1.609) = -4.827$.`, why:`Each occurrence multiplies the likelihood, i.e. adds its log $c$ times.`},
        {do:`Equivalent product: $0.2^3 = 0.008$, and $\\ln 0.008\\approx -4.828$.`, why:`Counts enter as exponents; logs make them coefficients.`}
      ],
      answer:`Contribution $\\approx -4.827$ (i.e. $0.2^3=0.008$).` },

    { q:`<p>Two equally likely classes, one word with $P(w\\mid A)=0.9$, $P(w\\mid B)=0.3$. After seeing the word, by what factor does the odds of A over B multiply (the likelihood ratio)?</p>`,
      steps:[
        {do:`Likelihood ratio $= \\frac{P(w\\mid A)}{P(w\\mid B)} = \\frac{0.9}{0.3} = 3$.`, why:`Bayes updates the odds by multiplying with the likelihood ratio.`},
        {do:`Prior odds $1{:}1$ become posterior odds $3{:}1$.`, why:`Equal priors mean the ratio is the whole story.`}
      ],
      answer:`Odds for A multiply by $3$ (posterior odds $3{:}1$).` }
  ]);

  /* ---------------- ml-trees ---------------- */
  add("ml-trees", [
    { q:`<p>A 3-class node holds $\\{6$ A, $3$ B, $1$ C$\\}$ ($10$ total). Compute its Gini impurity $1-\\sum_c p_c^2$.</p>`,
      steps:[
        {do:`Fractions: $0.6, 0.3, 0.1$.`, why:`Divide each class count by the total $10$.`},
        {do:`$\\sum p_c^2 = 0.36 + 0.09 + 0.01 = 0.46$.`, why:`Square and sum the fractions.`},
        {do:`Gini $= 1 - 0.46 = 0.54$.`, why:`Subtract from $1$.`}
      ],
      answer:`Gini $= 0.54$.` },

    { q:`<p>Entropy of the same 3-class node $\\{0.6,0.3,0.1\\}$ using $-\\sum_c p_c\\log_2 p_c$ (use $\\log_2 0.6\\approx-0.737$, $\\log_2 0.3\\approx-1.737$, $\\log_2 0.1\\approx-3.322$).</p>`,
      steps:[
        {do:`Terms: $-0.6(-0.737)=0.442$; $-0.3(-1.737)=0.521$; $-0.1(-3.322)=0.332$.`, why:`Each class contributes $-p\\log_2 p$.`},
        {do:`Sum $= 0.442 + 0.521 + 0.332 = 1.295$.`, why:`Add the three contributions (in bits).`}
      ],
      answer:`Entropy $\\approx 1.295$ bits.` },

    { q:`<p>Information gain. Parent (12 examples) has entropy $1.0$. A split makes a left child of $8$ examples with entropy $0.5$ and a right child of $4$ with entropy $0.0$. Compute the gain.</p>`,
      steps:[
        {do:`Weighted child entropy $= \\frac{8}{12}(0.5) + \\frac{4}{12}(0.0) = 0.667(0.5) = 0.333$.`, why:`Average children's entropy by their sizes.`},
        {do:`Gain $= 1.0 - 0.333 = 0.667$.`, why:`Information gain is parent entropy minus weighted child entropy.`}
      ],
      answer:`Information gain $\\approx 0.667$ bits.` },

    { q:`<p>A 3-way split of a $12$-example node sends $\\{4,4,4\\}$ to children with Gini $\\{0.0, 0.5, 0.375\\}$. Parent Gini is $0.5$. Compute the weighted child Gini and the gain.</p>`,
      steps:[
        {do:`Each child weight $= 4/12 = 1/3$.`, why:`Equal-sized children share weight equally.`},
        {do:`Weighted Gini $= \\frac13(0.0+0.5+0.375) = \\frac13(0.875) \\approx 0.292$.`, why:`Average the three children's Gini by their sizes.`},
        {do:`Gain $= 0.5 - 0.292 = 0.208$.`, why:`Subtract weighted child impurity from the parent.`}
      ],
      answer:`Weighted Gini $\\approx 0.292$; gain $\\approx 0.208$.` },

    { q:`<p>Compare two splits of a 50/50 parent (Gini $0.5$, 10 examples). Split A: children $(7,3)$ with Gini $(0.245, 0.444)$. Split B: children $(5,5)$ with Gini $(0.32, 0.32)$. Which has the higher Gini gain?</p>`,
      steps:[
        {do:`A weighted $= 0.7(0.245)+0.3(0.444) = 0.1715 + 0.1332 = 0.305$; gain $= 0.5-0.305 = 0.195$.`, why:`Weight each child's Gini by its share, then subtract from the parent.`},
        {do:`B weighted $= 0.5(0.32)+0.5(0.32) = 0.32$; gain $= 0.5-0.32 = 0.18$.`, why:`Same computation for split B.`},
        {do:`$0.195 &gt; 0.18$.`, why:`CART greedily picks the split with the larger gain.`}
      ],
      answer:`Split A (gain $0.195$ vs $0.18$).` },

    { q:`<p>Gain ratio penalizes high-cardinality splits. A split has information gain $0.6$ and split-information (entropy of the partition sizes) $\\text{SI}=1.5$. Compute the gain ratio $=\\text{gain}/\\text{SI}$.</p>`,
      steps:[
        {do:`Gain ratio $= 0.6 / 1.5 = 0.4$.`, why:`Dividing by split-information discounts splits that fragment data into many tiny pieces.`},
        {do:`A many-way split inflates SI, shrinking its ratio.`, why:`This is why C4.5 prefers gain ratio over raw gain.`}
      ],
      answer:`Gain ratio $= 0.4$.` },

    { q:`<p>Misclassification impurity is $1-\\max_c p_c$. For a node $\\{7$ yes, $3$ no$\\}$, compute Gini, entropy, and misclassification impurity, and order them ($\\log_2 0.7\\approx-0.515$, $\\log_2 0.3\\approx-1.737$).</p>`,
      steps:[
        {do:`Gini $= 1-(0.7^2+0.3^2) = 1-(0.49+0.09) = 0.42$.`, why:`Sum of squared fractions subtracted from $1$.`},
        {do:`Entropy $= -0.7(-0.515)-0.3(-1.737) = 0.361+0.521 = 0.882$ bits.`, why:`Standard entropy formula.`},
        {do:`Misclass $= 1-\\max(0.7,0.3) = 1-0.7 = 0.3$.`, why:`Error if you always guess the majority class.`}
      ],
      answer:`Misclass $0.3 &lt;$ Gini $0.42 &lt;$ Entropy $0.882$.` },

    { q:`<p>Regression tree split. A node's targets are $\\{2,4,6,8\\}$ (mean $5$). A split gives left $\\{2,4\\}$ and right $\\{6,8\\}$. Compute the parent SSE $=\\sum(y-\\bar y)^2$, the total child SSE, and the variance reduction.</p>`,
      steps:[
        {do:`Parent SSE $= (2-5)^2+(4-5)^2+(6-5)^2+(8-5)^2 = 9+1+1+9 = 20$.`, why:`Regression trees minimize squared error around the node mean.`},
        {do:`Left (mean $3$): $(2-3)^2+(4-3)^2 = 1+1 = 2$. Right (mean $7$): $1+1 = 2$.`, why:`Each child re-centers on its own mean.`},
        {do:`Child SSE $= 2+2 = 4$; reduction $= 20-4 = 16$.`, why:`The split cuts squared error from $20$ to $4$.`}
      ],
      answer:`Parent SSE $20$, child SSE $4$, variance reduction $16$.` },

    { q:`<p>Cost-complexity pruning uses $R_\\alpha(T)=R(T)+\\alpha|T|$, where $R$ is error and $|T|$ is leaf count. Tree A: error $0.10$, $5$ leaves. Tree B: error $0.16$, $2$ leaves. With $\\alpha=0.03$, which tree is preferred?</p>`,
      steps:[
        {do:`A: $R_\\alpha = 0.10 + 0.03(5) = 0.10+0.15 = 0.25$.`, why:`Penalize each leaf by $\\alpha$ to discourage large trees.`},
        {do:`B: $R_\\alpha = 0.16 + 0.03(2) = 0.16+0.06 = 0.22$.`, why:`Same penalized cost for the smaller tree.`},
        {do:`$0.22 &lt; 0.25$.`, why:`Pruning prefers the lower penalized cost.`}
      ],
      answer:`Tree B (cost $0.22$ vs $0.25$).` },

    { q:`<p>Find the critical $\\alpha$ where two trees tie. Tree A: error $0.10$, $5$ leaves. Tree B: error $0.16$, $2$ leaves. Solve $0.10+5\\alpha = 0.16+2\\alpha$.</p>`,
      steps:[
        {do:`$0.10 + 5\\alpha = 0.16 + 2\\alpha \\Rightarrow 3\\alpha = 0.06$.`, why:`Set the penalized costs equal and collect $\\alpha$ terms.`},
        {do:`$\\alpha = 0.02$.`, why:`Below $0.02$ the larger tree A wins; above it the pruned tree B wins.`}
      ],
      answer:`Critical $\\alpha = 0.02$.` }
  ]);

  /* ---------------- ml-ensembles ---------------- */
  add("ml-ensembles", [
    { q:`<p>Averaging $T$ independent trees, each with variance $\\sigma^2$, gives ensemble variance $\\sigma^2/T$. With $\\sigma^2=3$ and $T=12$, compute the ensemble variance and the standard-deviation shrink factor.</p>`,
      steps:[
        {do:`Ensemble variance $= 3/12 = 0.25$.`, why:`Averaging independent estimates divides variance by the count.`},
        {do:`Std shrink $= \\sqrt{1/12} = 1/\\sqrt{12} \\approx 0.289$.`, why:`Standard deviation falls like $1/\\sqrt T$.`}
      ],
      answer:`Variance $0.25$; std shrinks to $\\approx 0.289\\times$.` },

    { q:`<p>Correlated trees. With pairwise correlation $\\rho$, the bagged variance is $\\rho\\sigma^2 + \\frac{1-\\rho}{T}\\sigma^2$. With $\\sigma^2=1$, $\\rho=0.5$, $T\\to\\infty$, find the floor variance.</p>`,
      steps:[
        {do:`As $T\\to\\infty$, the term $\\frac{1-\\rho}{T}\\sigma^2 \\to 0$.`, why:`More trees drive the averaged part to zero.`},
        {do:`Floor $= \\rho\\sigma^2 = 0.5(1) = 0.5$.`, why:`Correlation leaves an irreducible variance floor.`},
        {do:`This is why random forests decorrelate trees (random feature subsets).`, why:`Lowering $\\rho$ lowers the floor.`}
      ],
      answer:`Floor variance $=0.5$ (set by $\\rho$, not $T$).` },

    { q:`<p>AdaBoost round. A weak learner has weighted error $\\epsilon=0.2$. Compute its vote $\\alpha=\\tfrac12\\ln\\frac{1-\\epsilon}{\\epsilon}$ and the reweighting factors $e^{-\\alpha}$ (correct) and $e^{+\\alpha}$ (wrong).</p>`,
      steps:[
        {do:`$\\alpha = \\tfrac12\\ln\\frac{0.8}{0.2} = \\tfrac12\\ln 4 = \\tfrac12(1.386) = 0.693$.`, why:`Lower error earns a larger vote.`},
        {do:`Correct points: weight $\\times e^{-\\alpha} = e^{-0.693} = 0.5$.`, why:`Correctly classified points are down-weighted, shrinking their influence next round.`},
        {do:`Wrong points: weight $\\times e^{+\\alpha} = e^{0.693} = 2.0$.`, why:`Misclassified points are up-weighted so the next learner focuses on them.`}
      ],
      answer:`$\\alpha=0.693$; correct $\\times 0.5$, wrong $\\times 2.0$.` },

    { q:`<p>Continue the AdaBoost round ($\\alpha=0.693$). Start with $5$ equal weights $0.2$ each; $4$ are correct, $1$ is wrong. Apply $e^{\\mp\\alpha}$, then renormalize. Find the new weight on the misclassified point.</p>`,
      steps:[
        {do:`Unnormalized: correct $0.2\\times0.5 = 0.1$ each ($4$ of them); wrong $0.2\\times2.0 = 0.4$.`, why:`Apply the reweighting factors from $\\alpha$.`},
        {do:`Sum $= 4(0.1) + 0.4 = 0.4 + 0.4 = 0.8$.`, why:`Total before renormalizing.`},
        {do:`Wrong point's new weight $= 0.4/0.8 = 0.5$.`, why:`Divide by the sum so weights form a distribution.`}
      ],
      answer:`The misclassified point's weight jumps from $0.2$ to $0.5$.` },

    { q:`<p>AdaBoost with a strong learner: $\\epsilon=0.1$. Compute $\\alpha=\\tfrac12\\ln\\frac{1-\\epsilon}{\\epsilon}$ and compare its vote to the $\\epsilon=0.2$ learner ($\\alpha=0.693$).</p>`,
      steps:[
        {do:`Ratio $= 0.9/0.1 = 9$.`, why:`A much lower error gives a much larger odds ratio.`},
        {do:`$\\alpha = \\tfrac12\\ln 9 = \\tfrac12(2.197) = 1.099$.`, why:`Halve the log of the ratio.`},
        {do:`$1.099 &gt; 0.693$.`, why:`The more accurate learner gets a bigger say in the final vote.`}
      ],
      answer:`$\\alpha\\approx 1.099$, larger than $0.693$.` },

    { q:`<p>Final AdaBoost prediction over $3$ rounds. Votes $\\alpha=(0.7, 0.5, 1.0)$; the learners output $h=(+1, -1, +1)$ on a point. Compute $H(x)=\\text{sign}\\big(\\sum_t\\alpha_t h_t\\big)$.</p>`,
      steps:[
        {do:`Weighted sum $= 0.7(+1) + 0.5(-1) + 1.0(+1) = 0.7 - 0.5 + 1.0 = 1.2$.`, why:`Each learner votes with its weight.`},
        {do:`$\\text{sign}(1.2) = +1$.`, why:`A positive aggregate score yields class $+1$.`}
      ],
      answer:`$H(x)=+1$ (score $1.2$).` },

    { q:`<p>Gradient boosting fits residuals. Targets $y=(10, 20)$; the first model predicts the constant $F_0=15$ for both. Compute the residuals, then the update $F_1 = F_0 + \\nu\\, r$ with learning rate $\\nu=0.1$ if the next tree predicts the residuals exactly.</p>`,
      steps:[
        {do:`Residuals $r = y - F_0 = (10-15,\\ 20-15) = (-5, +5)$.`, why:`The next tree targets the current errors (negative gradient of squared loss).`},
        {do:`$F_1 = 15 + 0.1(-5,\\ +5) = (15-0.5,\\ 15+0.5) = (14.5, 15.5)$.`, why:`A small learning rate takes a shrunken step toward the residuals.`}
      ],
      answer:`Residuals $(-5,+5)$; $F_1=(14.5, 15.5)$.` },

    { q:`<p>Soft voting with class probabilities and per-model weights. Models give $P(\\text{spam}) = (0.9, 0.4, 0.6)$ with weights $(0.5, 0.2, 0.3)$. Compute the weighted-average probability and classify at threshold $0.5$.</p>`,
      steps:[
        {do:`Weighted sum $= 0.5(0.9)+0.2(0.4)+0.3(0.6) = 0.45+0.08+0.18 = 0.71$.`, why:`Weights sum to $1$, so this is the weighted mean.`},
        {do:`$0.71 &gt; 0.5$.`, why:`Above threshold means predict spam.`}
      ],
      answer:`Weighted $P=0.71$ ⇒ spam.` },

    { q:`<p>Out-of-bag (OOB) estimate. In a bootstrap sample of size $n$, a given example is left out with probability $(1-1/n)^n \\to e^{-1}$. About what fraction of examples are OOB for each tree (large $n$)?</p>`,
      steps:[
        {do:`$P(\\text{left out}) = (1-1/n)^n \\to e^{-1} \\approx 0.368$.`, why:`The classic bootstrap limit: each draw misses a fixed example with this probability.`},
        {do:`So roughly $37\\%$ of examples are OOB per tree.`, why:`These unused points give a free validation set for each tree.`}
      ],
      answer:`About $e^{-1}\\approx 0.368$ ($37\\%$) are OOB.` },

    { q:`<p>Why does boosting reduce bias while bagging reduces variance? Reason in one chain.</p>`,
      steps:[
        {do:`Bagging averages many low-bias, high-variance trees trained independently.`, why:`Averaging independent errors cancels variance but keeps the (already low) bias.`},
        {do:`Boosting adds shallow high-bias learners sequentially, each correcting prior errors.`, why:`Stacking corrections steadily reduces the systematic bias of the ensemble.`},
        {do:`So bagging targets variance; boosting targets bias.`, why:`Their mechanisms attack different error components.`}
      ],
      answer:`Bagging averages out variance; boosting stacks corrections to cut bias.` }
  ]);

  /* ---------------- ml-knn ---------------- */
  add("ml-knn", [
    { q:`<p>Manhattan ($L_1$) vs Euclidean ($L_2$) distance. Query $(0,0)$, neighbor $(3,4)$. Compute both distances.</p>`,
      steps:[
        {do:`$L_1 = |3-0|+|4-0| = 3+4 = 7$.`, why:`Manhattan sums absolute coordinate differences.`},
        {do:`$L_2 = \\sqrt{3^2+4^2} = \\sqrt{25} = 5$.`, why:`Euclidean is the root of summed squares.`},
        {do:`$L_1=7 &gt; L_2=5$.`, why:`$L_1 \\ge L_2$ always; the gap grows with dimensionality.`}
      ],
      answer:`$L_1=7$, $L_2=5$.` },

    { q:`<p>Standardize before k-NN. Feature 2 has standard deviation $50$, feature 1 has std $1$. Query $(0,0)$; raw neighbor $(2, 100)$. Compute the standardized distance (divide each coordinate by its std before measuring).</p>`,
      steps:[
        {do:`Scaled coords: $(2/1,\\ 100/50) = (2, 2)$.`, why:`Dividing by std puts both features on a comparable scale.`},
        {do:`Distance $= \\sqrt{2^2+2^2} = \\sqrt8 \\approx 2.83$.`, why:`Now feature 2 no longer dominates by sheer magnitude.`},
        {do:`Unscaled it was $\\sqrt{4+10000}\\approx 100$, swamped by feature 2.`, why:`Standardization fixes the scale imbalance.`}
      ],
      answer:`Standardized distance $\\approx 2.83$ (vs $\\approx 100$ unscaled).` },

    { q:`<p>Distance-weighted k-NN regression. Three neighbors: value $10$ at $d=1$, value $20$ at $d=2$, value $30$ at $d=2$. Predict using weights $w=1/d^2$ and $\\hat y=\\frac{\\sum w_i y_i}{\\sum w_i}$.</p>`,
      steps:[
        {do:`Weights: $1/1^2=1$, $1/2^2=0.25$, $1/2^2=0.25$.`, why:`Closer neighbors get quadratically more influence.`},
        {do:`Numerator $= 1(10)+0.25(20)+0.25(30) = 10+5+7.5 = 22.5$.`, why:`Weighted sum of the target values.`},
        {do:`$\\hat y = 22.5/(1+0.25+0.25) = 22.5/1.5 = 15$.`, why:`Divide by the total weight.`}
      ],
      answer:`$\\hat y = 15$.` },

    { q:`<p>Distance-weighted classification. Neighbors with $w=1/d$: red at $d=1$, blue at $d=1.5$, blue at $d=3$, red at $d=6$. Which class wins by total weight?</p>`,
      steps:[
        {do:`Red weight $= 1/1 + 1/6 = 1 + 0.167 = 1.167$.`, why:`Sum the inverse-distance weights of red neighbors.`},
        {do:`Blue weight $= 1/1.5 + 1/3 = 0.667 + 0.333 = 1.0$.`, why:`Same for blue neighbors.`},
        {do:`$1.167 &gt; 1.0$.`, why:`The class with greater total weight wins, even though blue had a near neighbor.`}
      ],
      answer:`Red (weight $1.167$ vs $1.0$).` },

    { q:`<p>Choosing $k$ by validation error. $k=1$ gives error $12\\%$, $k=5$ gives $8\\%$, $k=15$ gives $11\\%$. Which $k$, and what does the U-shape over $k$ mean?</p>`,
      steps:[
        {do:`Pick the lowest validation error: $k=5$ at $8\\%$.`, why:`Validation error directly estimates generalization.`},
        {do:`Small $k$ overfits (high variance); large $k$ underfits (high bias).`, why:`The error rises on both sides of the sweet spot.`}
      ],
      answer:`$k=5$ (error $8\\%$); errors form a U over $k$.` },

    { q:`<p>The curse of dimensionality. In a unit hypercube, to capture a fraction $f=0.01$ of the volume, the side length of a neighborhood is $\\ell = f^{1/d}$. Compute $\\ell$ for $d=1$, $d=2$, and $d=10$.</p>`,
      steps:[
        {do:`$d=1$: $\\ell = 0.01^{1} = 0.01$.`, why:`In 1D a tiny slice captures $1\\%$.`},
        {do:`$d=2$: $\\ell = 0.01^{1/2} = 0.1$.`, why:`In 2D you need a side of $0.1$ for the same fraction.`},
        {do:`$d=10$: $\\ell = 0.01^{1/10} \\approx 0.631$.`, why:`In high dimensions a "$1\\%$" neighborhood spans most of each axis — neighbors are no longer local.`}
      ],
      answer:`$\\ell = 0.01,\\ 0.1,\\ 0.631$ for $d=1,2,10$ — neighborhoods blow up.` },

    { q:`<p>Weighted vote tie-break. With $k=4$ and uniform votes you get $2$ cats, $2$ dogs (a tie). Using $1/d$ weights: cats at $d=1,4$; dogs at $d=2,2$. Break the tie.</p>`,
      steps:[
        {do:`Cat weight $= 1/1 + 1/4 = 1 + 0.25 = 1.25$.`, why:`Inverse-distance weights replace the tied uniform count.`},
        {do:`Dog weight $= 1/2 + 1/2 = 1.0$.`, why:`Sum the dog weights.`},
        {do:`$1.25 &gt; 1.0$.`, why:`Weighting by closeness resolves the tie toward the nearer class.`}
      ],
      answer:`Cat (weight $1.25$ vs $1.0$); weighting breaks the even-$k$ tie.` },

    { q:`<p>3-class k-NN with $k=5$. Neighbor labels: A, A, B, C, A. Predict the class and give its vote share.</p>`,
      steps:[
        {do:`Counts: A$=3$, B$=1$, C$=1$.`, why:`Tally the labels of the $5$ nearest neighbors.`},
        {do:`Majority is A; share $= 3/5 = 0.6$.`, why:`Plurality wins; the share estimates confidence.`}
      ],
      answer:`Class A with vote share $0.6$.` },

    { q:`<p>k-NN with $k=m$ (all points). The training set has $30$ class-0 and $20$ class-1 examples. What does k-NN predict for every query, and which fit failure is this?</p>`,
      steps:[
        {do:`With $k=m$, every query sees all $50$ points: $30$ vs $20$.`, why:`Setting $k$ to the full size ignores locality entirely.`},
        {do:`Majority is class 0 for all queries.`, why:`The prediction collapses to the global majority class.`},
        {do:`This is maximal underfitting (high bias).`, why:`A constant predictor has no flexibility.`}
      ],
      answer:`Always class 0; extreme underfitting (high bias).` },

    { q:`<p>Euclidean k-NN in 3D. Query $(1,2,3)$; neighbors A$(2,2,3)$ class red, B$(1,0,3)$ class blue, C$(1,2,5)$ class red. With $k=2$, classify (compute distances, take the two nearest).</p>`,
      steps:[
        {do:`Distances: A $\\sqrt{1^2}=1$; B $\\sqrt{2^2}=2$; C $\\sqrt{2^2}=2$.`, why:`Each differs in one coordinate; take the root of the squared difference.`},
        {do:`Nearest is A ($d=1$, red); the second slot ties B and C at $d=2$, and C is red.`, why:`Collect the $k=2$ smallest distances; resolve the tie consistently.`},
        {do:`Selecting A and C gives red, red.`, why:`Both chosen neighbors are red.`}
      ],
      answer:`Red (nearest A red, plus a red at the tie distance).` }
  ]);

  /* ---------------- ml-bias-variance ---------------- */
  add("ml-bias-variance", [
    { q:`<p>Decompose expected squared error $=\\text{bias}^2+\\text{variance}+\\sigma^2_{\\text{noise}}$. A model has $\\text{bias}=0.5$, $\\text{variance}=0.3$, noise variance $0.2$. Compute the total.</p>`,
      steps:[
        {do:`$\\text{bias}^2 = 0.5^2 = 0.25$.`, why:`The decomposition squares the bias.`},
        {do:`Total $= 0.25 + 0.3 + 0.2 = 0.75$.`, why:`Add the squared bias, variance, and noise.`}
      ],
      answer:`Expected squared error $= 0.75$.` },

    { q:`<p>Two models for the same task. Model A: $\\text{bias}=1.0$, $\\text{variance}=0.1$. Model B: $\\text{bias}=0.3$, $\\text{variance}=1.2$. With noise $0.2$, which has lower expected error?</p>`,
      steps:[
        {do:`A: $1.0^2 + 0.1 + 0.2 = 1.0 + 0.3 = 1.3$.`, why:`Compute each model's full error.`},
        {do:`B: $0.3^2 + 1.2 + 0.2 = 0.09 + 1.4 = 1.49$.`, why:`B trades bias for a large variance.`},
        {do:`$1.3 &lt; 1.49$.`, why:`A's lower variance more than offsets its higher bias here.`}
      ],
      answer:`Model A (error $1.3$ vs $1.49$).` },

    { q:`<p>Estimate variance empirically. The same model trained on different samples predicts $\\{4, 6, 8\\}$ at one query point (mean $6$). Compute the prediction variance $\\frac1n\\sum(\\hat y-\\bar y)^2$.</p>`,
      steps:[
        {do:`Deviations: $(4-6)^2+(6-6)^2+(8-6)^2 = 4+0+4 = 8$.`, why:`Variance measures spread of predictions around their mean.`},
        {do:`Variance $= 8/3 \\approx 2.667$.`, why:`Divide by $n=3$.`}
      ],
      answer:`Prediction variance $\\approx 2.667$.` },

    { q:`<p>Estimate bias. The true value is $10$; the average model prediction across samples is $7$. Compute the bias and bias$^2$.</p>`,
      steps:[
        {do:`Bias $= \\mathbb{E}[\\hat y] - y_{\\text{true}} = 7 - 10 = -3$.`, why:`Bias is the gap between the average prediction and the truth.`},
        {do:`$\\text{bias}^2 = (-3)^2 = 9$.`, why:`The decomposition uses the squared bias.`}
      ],
      answer:`Bias $=-3$, bias$^2=9$.` },

    { q:`<p>Adding data shrinks variance roughly like $1/m$. A model has variance $0.6$ at $m=100$ and irreducible noise $0.2$. Estimate its variance at $m=300$ and the total (assume bias $\\approx 0$).</p>`,
      steps:[
        {do:`Variance scales by $100/300 = 1/3$: $0.6\\times\\tfrac13 = 0.2$.`, why:`Tripling the data cuts variance to a third.`},
        {do:`Noise stays $0.2$.`, why:`Noise is irreducible — more data cannot remove it.`},
        {do:`Total $\\approx 0 + 0.2 + 0.2 = 0.4$.`, why:`Add reduced variance and fixed noise.`}
      ],
      answer:`Variance $\\approx 0.2$ at $m=300$; total $\\approx 0.4$.` },

    { q:`<p>Regularization trades bias for variance. Increasing $\\lambda$ drops variance from $0.8$ to $0.3$ but raises bias$^2$ from $0.1$ to $0.4$. With fixed noise $0.15$, did the total error improve?</p>`,
      steps:[
        {do:`Before: $0.1 + 0.8 + 0.15 = 1.05$.`, why:`Sum the three components at the small $\\lambda$.`},
        {do:`After: $0.4 + 0.3 + 0.15 = 0.85$.`, why:`Sum again at the larger $\\lambda$.`},
        {do:`$0.85 &lt; 1.05$.`, why:`The variance drop outweighs the bias rise.`}
      ],
      answer:`Yes — total error falls from $1.05$ to $0.85$.` },

    { q:`<p>Find the regularization sweet spot. Bias$^2(\\lambda)=0.1+0.5\\lambda$ rises and variance$(\\lambda)=0.9-0.3\\lambda$ falls (for $\\lambda\\in[0,2]$). Minimize the total bias$^2$+variance over $\\lambda$.</p>`,
      steps:[
        {do:`Total $= (0.1+0.5\\lambda)+(0.9-0.3\\lambda) = 1.0 + 0.2\\lambda$.`, why:`Sum the two pieces; the $\\lambda$ terms combine.`},
        {do:`Slope $+0.2 &gt; 0$, so the total increases with $\\lambda$.`, why:`Here the bias rise outpaces the variance drop, so more regularization only hurts.`},
        {do:`Minimum at the smallest allowed $\\lambda=0$.`, why:`A monotonically increasing function is smallest at the left endpoint.`}
      ],
      answer:`Best at $\\lambda=0$ (total $=1.0$); bias grows faster than variance shrinks.` },

    { q:`<p>Ensembling and variance. One model has variance $\\sigma^2=1.2$ and bias$^2=0.2$. Averaging $4$ independent copies leaves bias unchanged but divides variance by $4$. Compute the new total (noise $0.1$).</p>`,
      steps:[
        {do:`New variance $= 1.2/4 = 0.3$.`, why:`Averaging independent models cuts variance by the count.`},
        {do:`Bias$^2$ unchanged $= 0.2$.`, why:`Averaging copies of the same model does not change its systematic bias.`},
        {do:`Total $= 0.2 + 0.3 + 0.1 = 0.6$.`, why:`Add the three components.`}
      ],
      answer:`Total $=0.6$ (down from $0.2+1.2+0.1=1.5$).` },

    { q:`<p>Diagnose from a learning curve. As training size grows, training error rises toward $18\\%$ and validation error falls toward $20\\%$, nearly meeting. Is this high bias or high variance, and will more data help?</p>`,
      steps:[
        {do:`The curves converge but at a high error ($\\approx 18$–$20\\%$).`, why:`Converging-but-high curves are the signature of high bias (underfitting).`},
        {do:`A small train/validation gap means variance is already low.`, why:`More data shrinks the gap, not the floor.`},
        {do:`So more data will not help much.`, why:`You need a richer model (more features/complexity), not more examples.`}
      ],
      answer:`High bias; more data won't help — increase model complexity.` },

    { q:`<p>Opposite learning curve. Training error stays near $2\\%$ while validation error sits at $17\\%$ with a large persistent gap. High bias or variance? Name two fixes.</p>`,
      steps:[
        {do:`Big train/validation gap with low training error.`, why:`That is the hallmark of high variance (overfitting).`},
        {do:`Fix 1: more training data (shrinks variance).`, why:`Variance falls roughly like $1/m$.`},
        {do:`Fix 2: regularize or simplify the model.`, why:`Reducing capacity lowers sensitivity to the training sample.`}
      ],
      answer:`High variance; fix with more data and/or stronger regularization.` }
  ]);

  /* ---------------- ml-learning-theory ---------------- */
  add("ml-learning-theory", [
    { q:`<p>Finite hypothesis class bound: with probability $\\ge 1-\\delta$, true error $\\le \\hat\\epsilon + \\sqrt{\\frac{1}{2m}\\ln\\frac{2|H|}{\\delta}}$. With $|H|=100$, $m=200$, $\\delta=0.05$, $\\hat\\epsilon=0.1$, compute the bound.</p>`,
      steps:[
        {do:`Inside the log: $\\frac{2|H|}{\\delta} = \\frac{200}{0.05} = 4000$; $\\ln 4000 \\approx 8.294$.`, why:`Larger class or smaller $\\delta$ widens the confidence term.`},
        {do:`$\\sqrt{\\frac{8.294}{2(200)}} = \\sqrt{\\frac{8.294}{400}} = \\sqrt{0.02074} \\approx 0.144$.`, why:`The $1/(2m)$ factor shrinks the gap as data grows.`},
        {do:`Bound $= 0.1 + 0.144 = 0.244$.`, why:`Add the training error and the generalization term.`}
      ],
      answer:`True error $\\le 0.244$ with $95\\%$ confidence.` },

    { q:`<p>Sample complexity. To guarantee gap $\\le \\gamma$ with confidence $1-\\delta$ for a finite class, $m \\ge \\frac{1}{2\\gamma^2}\\ln\\frac{2|H|}{\\delta}$. With $|H|=100$, $\\delta=0.05$, $\\gamma=0.1$, find the required $m$.</p>`,
      steps:[
        {do:`$\\ln\\frac{2(100)}{0.05} = \\ln 4000 \\approx 8.294$.`, why:`Same log term as before.`},
        {do:`$m \\ge \\frac{8.294}{2(0.1)^2} = \\frac{8.294}{0.02} = 414.7$.`, why:`Halving $\\gamma$ quadruples the required sample (the $\\gamma^2$ in the denominator).`},
        {do:`So $m \\ge 415$.`, why:`Round up to a whole number of examples.`}
      ],
      answer:`$m \\ge 415$ examples.` },

    { q:`<p>VC bound shape: gap $\\sim \\sqrt{\\frac{d\\,(\\ln(m/d)+1) + \\ln(1/\\delta)}{m}}$. Without computing exactly, what happens to the gap as VC dimension $d$ grows and as $m$ grows? State the tradeoff.</p>`,
      steps:[
        {do:`Larger $d$ increases the numerator, widening the gap.`, why:`A more expressive class is easier to overfit, so its guarantee is weaker.`},
        {do:`Larger $m$ increases the denominator, shrinking the gap.`, why:`More data tightens the bound like $\\sqrt{1/m}$.`},
        {do:`Tradeoff: you need $m$ to grow with $d$ to keep the gap small.`, why:`Roughly $m \\gtrsim d$ is required for learnability.`}
      ],
      answer:`Gap grows with $d$, shrinks with $m$; keep $m$ large relative to $d$.` },

    { q:`<p>VC dimension of axis-aligned rectangles in 2D is $4$. A dataset has $5$ points. Can this class shatter all $5$? What does that imply?</p>`,
      steps:[
        {do:`Shattering needs producing all $2^5=32$ labelings of the $5$ points.`, why:`Shattering means realizing every possible labeling.`},
        {do:`VC $=4$ means some labeling of any $5$ points is unrealizable.`, why:`The VC dimension is the largest set the class can always shatter.`},
        {do:`So it cannot shatter $5$ points.`, why:`There exists a labeling (e.g. the innermost point negative) a rectangle cannot capture.`}
      ],
      answer:`No; VC $=4$ means $5$ points cannot all be shattered.` },

    { q:`<p>Growth function bound (Sauer's lemma): for VC dimension $d$, the number of labelings on $m$ points is at most $\\big(\\frac{em}{d}\\big)^d$ once $m&gt;d$. With $d=2$, $m=10$, bound it ($e\\approx2.718$).</p>`,
      steps:[
        {do:`$\\frac{em}{d} = \\frac{2.718\\times 10}{2} = 13.59$.`, why:`Compute the base of the power.`},
        {do:`$(13.59)^2 \\approx 184.7$.`, why:`Raise to the power $d=2$.`},
        {do:`So at most $\\approx 185$ labelings (vs $2^{10}=1024$ possible).`, why:`Polynomial-in-$m$ growth (not exponential) is what makes the class learnable.`}
      ],
      answer:`At most $\\approx 185$ labelings (polynomial, not $1024$).` },

    { q:`<p>Union bound intuition. A class has $|H|=8$ hypotheses; each has probability $\\le 0.01$ of a large generalization gap. Bound the probability that <i>any</i> of them does.</p>`,
      steps:[
        {do:`Union bound: $P(\\cup_i A_i) \\le \\sum_i P(A_i) = 8\\times 0.01$.`, why:`The chance that at least one fails is at most the sum of individual chances.`},
        {do:`$= 0.08$.`, why:`This is why the bound carries a factor of $|H|$ (or its log inside a root).`}
      ],
      answer:`At most $0.08$ — the $|H|$ factor comes from the union bound.` },

    { q:`<p>Quadrupling data. The VC gap scales like $\\sqrt{1/m}$. Going from $m=100$ to $m=400$, by what factor does the gap shrink?</p>`,
      steps:[
        {do:`Ratio $= \\frac{\\sqrt{1/400}}{\\sqrt{1/100}} = \\sqrt{100/400} = \\sqrt{1/4}$.`, why:`Divide the new bound by the old.`},
        {do:`$= 1/2$.`, why:`Quadrupling $m$ halves the $\\sqrt{1/m}$ gap.`}
      ],
      answer:`The gap halves (factor $1/2$).` },

    { q:`<p>PAC sample complexity. To learn to accuracy $\\epsilon=0.05$ with confidence $1-\\delta=0.99$ from a class with $|H|=2^{20}$, use $m\\ge \\frac{1}{\\epsilon}\\big(\\ln|H| + \\ln\\frac{1}{\\delta}\\big)$. Estimate $m$ ($\\ln 2\\approx0.693$, $\\ln 100\\approx4.605$).</p>`,
      steps:[
        {do:`$\\ln|H| = 20\\ln 2 = 20(0.693) = 13.86$.`, why:`$\\log$ of $2^{20}$ is $20\\ln 2$ — the description length in nats.`},
        {do:`$\\ln\\frac1\\delta = \\ln 100 = 4.605$.`, why:`$\\delta=0.01$, so $1/\\delta=100$.`},
        {do:`$m \\ge \\frac{1}{0.05}(13.86 + 4.605) = 20(18.47) = 369.3$.`, why:`Divide by $\\epsilon$; the sample grows only logarithmically in $|H|$.`}
      ],
      answer:`$m \\ge 370$ examples.` },

    { q:`<p>Description length view. Two classes both achieve $\\hat\\epsilon=0.05$. Class P has $|H_P|=2^{10}$, class Q has $|H_Q|=2^{30}$. Whose generalization bound (which grows with $\\ln|H|$) is tighter, and by what ratio in the $\\ln|H|$ term?</p>`,
      steps:[
        {do:`$\\ln|H_P| = 10\\ln2$, $\\ln|H_Q| = 30\\ln2$.`, why:`The bound's complexity term scales with $\\ln|H|$.`},
        {do:`Ratio $= 30/10 = 3$.`, why:`Q's complexity term is $3\\times$ larger.`},
        {do:`P has the tighter (smaller) bound.`, why:`Simpler classes generalize better at equal training error — Occam's razor.`}
      ],
      answer:`P is tighter; its $\\ln|H|$ term is $1/3$ of Q's.` },

    { q:`<p>Realizable case bound: $m\\ge\\frac1\\epsilon\\ln\\frac{|H|}{\\delta}$ suffices for true error $\\le\\epsilon$ with probability $\\ge1-\\delta$. With $|H|=1000$, $\\epsilon=0.1$, $\\delta=0.1$, compute the required $m$ ($\\ln 10000\\approx9.21$).</p>`,
      steps:[
        {do:`$\\frac{|H|}{\\delta} = \\frac{1000}{0.1} = 10000$; $\\ln 10000 \\approx 9.21$.`, why:`Combine the class size and the confidence level inside the log.`},
        {do:`$m \\ge \\frac{1}{0.1}(9.21) = 92.1$.`, why:`In the realizable (zero training error) case, $\\epsilon$ enters linearly, not squared.`},
        {do:`So $m \\ge 93$.`, why:`Round up.`}
      ],
      answer:`$m \\ge 93$ examples.` }
  ]);

})();
