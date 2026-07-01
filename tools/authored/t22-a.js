module.exports = {
  "math-22-01": {
    id: "math-22-01",
    title: "Optimization problem formulations",
    tagline: "Optimization is the habit of naming what you can choose, what you want, and what rules you must obey.",
    connections: {
      buildsOn: ["functions", "vectors", "inequalities", "basic derivatives"],
      leadsTo: ["Convex sets", "Convex functions", "Gradient descent"],
      usedWith: ["linear algebra", "calculus", "probability", "constraints"]
    },
    motivation:
      "<p>You already optimize informally. You choose a route that is short, a model that predicts well, or a budget that stays under a limit. The hard part is not always solving the problem; often it is writing the problem so the mathematics can see it.</p>" +
      "<p>An <b>optimization formulation</b> separates choices from goals and constraints. In ML, training is exactly this: choose parameters so a loss is small, while sometimes respecting limits such as nonnegative weights, fairness targets, or model size.</p>",
    definition:
      "<p>A standard optimization problem is written $\\min_{x\\in S} f(x)$ or $\\max_{x\\in S} f(x)$. The vector $x$ contains the <b>decision variables</b>, $f(x)$ is the <b>objective</b>, and $S$ is the <b>feasible set</b> of allowed choices. With constraints, one common form is $\\min_x f(x)$ subject to $g_i(x)\\le 0$ and $h_j(x)=0$.</p>" +
      "<p>Why this notation is useful: every feasible candidate $x$ receives a number $f(x)$. Minimizing means comparing those numbers only among candidates that obey the constraints. A point $x^\\ast$ is a global minimizer when $x^\\ast\\in S$ and $f(x^\\ast)\\le f(x)$ for every feasible $x$.</p>" +
      "<p><b>Assumptions that matter:</b> the variables, objective, and constraints must be defined on compatible domains; minimizers may fail to exist if the feasible set is open or unbounded; and changing the objective scale or constraint set can change the optimizer even when the story sounds similar.</p>",
    worked: {
      problem: "A one-parameter model has loss $L(w)=(w-3)^2+2$ and the rule $w\\ge1$. Formulate the problem and find the optimizer.",
      skills: ["decision variables", "constraints", "quadratic minimization"],
      strategy: "The unconstrained minimum is visible from the square — then check whether it obeys the constraint.",
      steps: [
        { do: "Name the decision variable", result: "$w$", why: "the model has one parameter we can choose" },
        { do: "Write the objective", result: "$L(w)=(w-3)^2+2$", why: "training tries to make loss small" },
        { do: "Write the feasible set", result: "$S=[1,\\infty)$", why: "the rule requires $w\\ge1$" },
        { do: "Read the square's minimum", result: "$w=3$", why: "$(w-3)^2$ is smallest when it equals $0$" },
        { do: "Check feasibility", result: "$3\\in[1,\\infty)$", why: "the candidate obeys the rule" },
        { do: "Compute the best value", result: "$L(3)=2$", why: "substitute the feasible minimizer" }
      ],
      verify: "Any feasible $w$ gives $(w-3)^2\\ge0$, so the loss cannot be below $2$.",
      answer: "The formulation is $\\min_{w\\ge1}(w-3)^2+2$; the optimizer is $w^\\ast=3$ with value $2$.",
      connects: "A formulation turns a training story into variables, objective, feasible set, and optimum."
    },
    practice: [
      { problem: "Formulate and solve: choose $x\\ge0$ to minimize $f(x)=(x-4)^2$.", steps: [
        { do: "Name the variable", result: "$x$", why: "this is the choice being optimized" },
        { do: "Write the feasible set", result: "$[0,\\infty)$", why: "the condition is $x\\ge0$" },
        { do: "Find the unconstrained minimizer", result: "$x=4$", why: "the square is zero there" },
        { do: "Check feasibility", result: "$4\\ge0$", why: "the candidate is allowed" },
        { do: "Compute the value", result: "$f(4)=0$", why: "zero is the smallest possible square" }
      ], answer: "$\\min_{x\\ge0}(x-4)^2$ has optimizer $x^\\ast=4$ and value $0$." },
      { problem: "Choose $x\\le2$ to minimize $f(x)=(x-5)^2+1$.", steps: [
        { do: "Write the problem", result: "$\\min_{x\\le2}(x-5)^2+1$", why: "objective plus feasibility rule" },
        { do: "Find the unconstrained minimizer", result: "$x=5$", why: "the square is centered at 5" },
        { do: "Check feasibility", result: "$5\\nleq2$", why: "the unconstrained point is not allowed" },
        { do: "Choose the closest feasible point", result: "$x=2$", why: "within $x\\le2$, this is closest to 5" },
        { do: "Compute the value", result: "$(2-5)^2+1=10$", why: "the distance is 3" }
      ], answer: "The optimizer is $x^\\ast=2$ with objective value $10$." },
      { problem: "A diet toy problem chooses apples $a$ and bars $b$ to minimize cost $1a+2b$ subject to calories $80a+200b\\ge400$ and $a,b\\ge0$. Identify variables, objective, and constraints.", steps: [
        { do: "Name the variables", result: "$a,b$", why: "they are the quantities chosen" },
        { do: "Write the objective", result: "$C(a,b)=a+2b$", why: "cost is one dollar per apple and two per bar" },
        { do: "Write the calorie constraint", result: "$80a+200b\\ge400$", why: "total calories must reach 400" },
        { do: "Write nonnegativity", result: "$a\\ge0, b\\ge0$", why: "negative food amounts are not meaningful" },
        { do: "Give one feasible point", result: "$(a,b)=(0,2)$", why: "$200\\cdot2=400$ and cost is $4$" }
      ], answer: "Minimize $a+2b$ subject to $80a+200b\\ge400$, $a\\ge0$, and $b\\ge0$." },
      { problem: "Convert maximizing accuracy $A(\\lambda)=0.8-0.1(\\lambda-2)^2$ over $0\\le\\lambda\\le4$ into a minimization problem and solve it.", steps: [
        { do: "Negate the objective", result: "$\\min -A(\\lambda)$", why: "maximizing a function equals minimizing its negative" },
        { do: "Write the feasible interval", result: "$0\\le\\lambda\\le4$", why: "the tuning range is constrained" },
        { do: "Find where accuracy is largest", result: "$\\lambda=2$", why: "the negative square is highest when the square is zero" },
        { do: "Check feasibility", result: "$2\\in[0,4]$", why: "the best point is allowed" },
        { do: "Compute the accuracy", result: "$A(2)=0.8$", why: "the penalty term vanishes" }
      ], answer: "Solve $\\min_{0\\le\\lambda\\le4}-A(\\lambda)$; the optimizer is $\\lambda^\\ast=2$ with accuracy $0.8$." },
      { problem: "For linear regression data $(x,y)=(1,2),(3,4)$, formulate the least-squares objective for a line $\\hat y=wx+b$.", steps: [
        { do: "Name the parameters", result: "$w,b$", why: "slope and intercept are chosen during training" },
        { do: "Write the first prediction", result: "$w+b$", why: "substitute $x=1$" },
        { do: "Write the second prediction", result: "$3w+b$", why: "substitute $x=3$" },
        { do: "Write the squared errors", result: "$(w+b-2)^2$ and $(3w+b-4)^2$", why: "prediction minus target is squared" },
        { do: "Add the losses", result: "$L(w,b)=(w+b-2)^2+(3w+b-4)^2$", why: "least squares sums squared errors" }
      ], answer: "Train by solving $\\min_{w,b}(w+b-2)^2+(3w+b-4)^2$." }
    ],
    applications: [
      { title: "Supervised learning", background: "Modern ML usually starts by writing training as an optimization problem over parameters. This tradition runs from least squares to deep networks.", numbers: "For errors $1,-2,0.5$, squared loss is $1^2+(-2)^2+0.5^2=5.25$, the objective value to reduce." },
      { title: "Regularization", background: "Regularization adds a preference for simpler parameters, helping models generalize rather than merely memorize.", numbers: "If data loss is $12$ and $||w||_2^2=9$ with $\\lambda=0.1$, total objective is $12+0.1\\cdot9=12.9$." },
      { title: "Constrained resource allocation", background: "Operations research has long optimized decisions under budgets, capacities, and schedules.", numbers: "Choosing ads with values $5,8$ and costs $2,4$ under budget $4$ makes the second ad feasible with value $8$, while both cost $6$ and are infeasible." },
      { title: "Hyperparameter tuning", background: "Validation-based tuning treats each hyperparameter setting as a candidate and chooses the best measured score.", numbers: "Losses $0.42,0.35,0.39$ for learning rates $0.001,0.01,0.1$ select $0.01$ because $0.35$ is smallest." },
      { title: "Maximum likelihood", background: "Statistics often chooses parameters that make observed data most probable; ML commonly minimizes negative log-likelihood.", numbers: "Probabilities $0.8$ and $0.5$ give loss $-\\ln0.8-\\ln0.5\\approx0.223+0.693=0.916$." },
      { title: "Fairness constraints", background: "Some training problems include explicit limits on metric gaps across groups. This changes the feasible set rather than only the loss.", numbers: "If group rates are $0.72$ and $0.68$, the gap is $0.04$, feasible under a $0.05$ limit but infeasible under $0.02$." }
    ],
    applicationsClose: "The shared move is simple and powerful: make the choices, goal, and rules visible before trying to solve anything.",
    takeaways: ["An optimization problem has decision variables, an objective, and a feasible set.", "A global minimizer beats every feasible candidate, not every imaginable point.", "Maximization can be rewritten as minimization by negating the objective.", "Training an ML model is an optimization formulation over parameters."]
  },

  "math-22-02": {
    id: "math-22-02",
    title: "Convex sets",
    tagline: "A convex set contains the whole straight path between any two of its points.",
    connections: {
      buildsOn: ["vectors", "line segments", "inequalities", "Optimization problem formulations"],
      leadsTo: ["Convex functions", "projected methods", "constrained optimization"],
      usedWith: ["affine combinations", "halfspaces", "norm balls", "linear algebra"]
    },
    motivation:
      "<p>If two choices are both allowed, it is comforting when every blend between them is allowed too. That is the geometric promise of convexity.</p>" +
      "<p>Convex feasible sets make optimization kinder. A straight move from one feasible point to another never leaves the allowed region, so local reasoning is much less likely to be fooled by disconnected islands.</p>",
    definition:
      "<p>A set $C$ is <b>convex</b> if for every $x,y\\in C$ and every $t\\in[0,1]$, the point $tx+(1-t)y$ is also in $C$. The point $tx+(1-t)y$ is a weighted average on the line segment joining $x$ and $y$.</p>" +
      "<p>The definition comes directly from the geometry of a segment. When $t=1$, the point is $x$; when $t=0$, it is $y$; and intermediate $t$ values trace the straight path between them. Convexity says the whole path stays inside.</p>" +
      "<p><b>Assumptions that matter:</b> the set lives in a vector space where addition and scalar multiplication make sense; the weights must satisfy $0\\le t\\le1$; intersections of convex sets stay convex; unions of convex sets usually do not.</p>",
    worked: {
      problem: "Show that the interval $C=[2,6]$ is convex.",
      skills: ["weighted averages", "inequalities", "proof of convexity"],
      strategy: "Take two arbitrary points in the interval and show every weighted average remains between the same bounds.",
      steps: [
        { do: "Choose arbitrary points", result: "$x,y\\in[2,6]$", why: "convexity must hold for any two points" },
        { do: "Write the lower bounds", result: "$x\\ge2$ and $y\\ge2$", why: "both points lie in the interval" },
        { do: "Weight the lower bounds", result: "$tx+(1-t)y\\ge2t+2(1-t)$", why: "the weights are nonnegative" },
        { do: "Simplify the lower bound", result: "$2t+2(1-t)=2$", why: "the weights add to 1" },
        { do: "Write the upper bounds", result: "$x\\le6$ and $y\\le6$", why: "both points also lie below 6" },
        { do: "Weight and simplify the upper bound", result: "$tx+(1-t)y\\le6$", why: "$6t+6(1-t)=6$" }
      ],
      verify: "The weighted average is always at least $2$ and at most $6$, so it stays in the interval.",
      answer: "$[2,6]$ is convex.",
      connects: "Convexity is the straight-line closure property that makes feasible regions manageable."
    },
    practice: [
      { problem: "Decide whether $[0,1]\\cup[2,3]$ is convex.", steps: [
        { do: "Pick one point from each piece", result: "$x=1$ and $y=2$", why: "both are in the set" },
        { do: "Choose the midpoint weight", result: "$t=1/2$", why: "a midpoint is the easiest segment test" },
        { do: "Compute the midpoint", result: "$0.5\\cdot1+0.5\\cdot2=1.5$", why: "average the two points" },
        { do: "Check membership", result: "$1.5\\notin[0,1]\\cup[2,3]$", why: "it falls in the gap" },
        { do: "Conclude", result: "not convex", why: "one failed pair is enough" }
      ], answer: "The set is not convex." },
      { problem: "Show that the halfspace $C=\\{x\\in R^2: x_1+x_2\\le5\\}$ is convex.", steps: [
        { do: "Choose two feasible points", result: "$a_1+a_2\\le5$ and $b_1+b_2\\le5$", why: "these encode $a,b\\in C$" },
        { do: "Form the weighted average", result: "$z=ta+(1-t)b$", why: "convexity tests this point" },
        { do: "Add its coordinates", result: "$z_1+z_2=t(a_1+a_2)+(1-t)(b_1+b_2)$", why: "distribute the weights" },
        { do: "Use feasibility", result: "$z_1+z_2\\le5t+5(1-t)$", why: "replace each coordinate sum by at most 5" },
        { do: "Simplify", result: "$z_1+z_2\\le5$", why: "the weights add to 1" }
      ], answer: "The halfspace is convex." },
      { problem: "For $C=\\{x: |x|\\le3\\}$, test the points $x=-2$, $y=3$, and $t=0.4$.", steps: [
        { do: "Check $x$", result: "$|-2|=2\\le3$", why: "$x$ is feasible" },
        { do: "Check $y$", result: "$|3|=3\\le3$", why: "$y$ is feasible" },
        { do: "Compute the weighted average", result: "$0.4(-2)+0.6(3)$", why: "$1-t=0.6$" },
        { do: "Simplify", result: "$-0.8+1.8=1.0$", why: "combine the weighted values" },
        { do: "Check the result", result: "$|1.0|\\le3$", why: "the blend remains feasible" }
      ], answer: "For this pair and weight, the convex combination is $1$, which lies in $C$." },
      { problem: "Is the circle boundary $C=\\{x\\in R^2: ||x||_2=1\\}$ convex?", steps: [
        { do: "Choose two boundary points", result: "$x=(1,0)$ and $y=(-1,0)$", why: "both have norm 1" },
        { do: "Choose the midpoint", result: "$t=1/2$", why: "midpoints must stay in a convex set" },
        { do: "Compute the midpoint", result: "$0.5x+0.5y=(0,0)$", why: "the opposite points cancel" },
        { do: "Compute its norm", result: "$||(0,0)||_2=0$", why: "the origin has zero length" },
        { do: "Check membership", result: "$(0,0)\\notin C$", why: "the boundary requires norm exactly 1" }
      ], answer: "The unit circle boundary is not convex." },
      { problem: "A feasible weight vector must satisfy $w_1\\ge0$, $w_2\\ge0$, and $w_1+w_2=1$. Blend $a=(1,0)$ and $b=(0.2,0.8)$ with $t=0.25$ and check feasibility.", steps: [
        { do: "Compute the first coordinate", result: "$0.25\\cdot1+0.75\\cdot0.2=0.4$", why: "blend coordinate by coordinate" },
        { do: "Compute the second coordinate", result: "$0.25\\cdot0+0.75\\cdot0.8=0.6$", why: "use the same weights" },
        { do: "Check nonnegativity", result: "$0.4\\ge0$ and $0.6\\ge0$", why: "both coordinates are allowed" },
        { do: "Check the sum", result: "$0.4+0.6=1$", why: "probability weights must add to 1" },
        { do: "State the blend", result: "$(0.4,0.6)$", why: "the simplex is closed under averaging" }
      ], answer: "The blend is feasible: $(0.4,0.6)$." }
    ],
    applications: [
      { title: "Probability simplices", background: "Classification probabilities live in a simplex: nonnegative entries that add to one. Mixtures of distributions should still be distributions.", numbers: "Averaging $[1,0]$ and $[0.2,0.8]$ gives $[0.6,0.4]$, nonnegative with sum $1$." },
      { title: "Linear constraints in optimization", background: "Many engineering constraints are halfspaces, and halfspaces are convex. This is why linear programming is so useful.", numbers: "If $2x+y\\le10$ holds with values $8$ and $6$ at two points, their midpoint has value $(8+6)/2=7\\le10$." },
      { title: "Norm balls for regularization", background: "Constraints such as $||w||_2\\le r$ limit parameter size. The filled ball is convex even though the boundary alone is not.", numbers: "Vectors with norms $2$ and $4$ inside radius $5$ have midpoint norm at most $(2+4)/2=3\\le5$." },
      { title: "Portfolio weights", background: "Classical portfolio optimization chooses asset weights that are nonnegative and sum to one. Blending two portfolios remains a portfolio.", numbers: "$0.3[1,0]+0.7[0.4,0.6]=[0.58,0.42]$, and the entries sum to $1$." },
      { title: "Fairness feasible regions", background: "When constraints are linearized, allowed model settings can form convex regions, making tradeoffs easier to search.", numbers: "If two models have gaps $0.02$ and $0.04$, their equal blend has gap at most $0.03$ under linear metrics." },
      { title: "Image interpolation", background: "Pixel intensities in a bounded range form a convex box. Averaging images stays in the valid range.", numbers: "Pixels $40$ and $200$ averaged with weight $0.25$ give $0.25\\cdot40+0.75\\cdot200=160$, still between $0$ and $255$." }
    ],
    applicationsClose: "Convex sets are the geometry of safe blending: averages of allowed choices remain allowed.",
    takeaways: ["A set is convex when every line segment between two of its points stays inside.", "Intervals, halfspaces, boxes, norm balls, and simplices are convex.", "Boundaries and unions often fail convexity because midpoints can leave the set.", "Convex feasible sets make constrained optimization more predictable."]
  },

  "math-22-03": {
    id: "math-22-03",
    title: "Convex functions",
    tagline: "A convex function curves upward enough that chords sit above the graph.",
    connections: {
      buildsOn: ["Convex sets", "functions", "derivatives", "second derivatives"],
      leadsTo: ["Optimality conditions (unconstrained)", "Gradient descent", "Convergence rates"],
      usedWith: ["Jensen's inequality", "quadratics", "epigraphs", "tangent lines"]
    },
    motivation:
      "<p>Optimization becomes much friendlier when the landscape is shaped like a bowl instead of a mountain range. A bowl may be steep or shallow, but it has no hidden lower valley elsewhere.</p>" +
      "<p>Convex functions capture that bowl idea precisely. For ML, convex losses like least squares and logistic loss teach us what reliable training looks like, even when deep networks later become nonconvex.</p>",
    definition:
      "<p>A function $f:C\\to R$ on a convex set $C$ is <b>convex</b> if $f(tx+(1-t)y)\\le t f(x)+(1-t)f(y)$ for all $x,y\\in C$ and $t\\in[0,1]$. The left side is the function at the blended input; the right side is the blended output.</p>" +
      "<p>For twice-differentiable one-dimensional functions, $f''(x)\\ge0$ on an interval implies convexity. In many dimensions, $\\nabla^2 f(x)$ being positive semidefinite plays the same role. The key consequence is powerful: every local minimum of a convex function on a convex set is global.</p>" +
      "<p><b>Assumptions that matter:</b> the domain must be convex; differentiability is helpful but not required; strict convexity can give a unique minimizer, while ordinary convexity may have a flat set of minimizers.</p>",
    worked: {
      problem: "Show that $f(x)=x^2$ satisfies the convexity inequality for $x=0$, $y=4$, and $t=0.25$.",
      skills: ["convexity inequality", "weighted averages", "squares"],
      strategy: "Compute the function at the blended input and compare it with the blended function values.",
      steps: [
        { do: "Compute the blended input", result: "$0.25\\cdot0+0.75\\cdot4=3$", why: "$1-t=0.75$" },
        { do: "Evaluate the function at the blend", result: "$f(3)=9$", why: "$3^2=9$" },
        { do: "Evaluate the endpoint functions", result: "$f(0)=0$ and $f(4)=16$", why: "square each endpoint" },
        { do: "Blend the endpoint values", result: "$0.25\\cdot0+0.75\\cdot16=12$", why: "use the same weights on outputs" },
        { do: "Compare", result: "$9\\le12$", why: "the graph lies below the chord" }
      ],
      verify: "The inequality goes in the right direction: function at average is no more than average of function values.",
      answer: "For these values, $f(tx+(1-t)y)=9\\le12=t f(x)+(1-t)f(y)$.",
      connects: "Convexity says averaging inputs cannot be worse than averaging their objective values."
    },
    practice: [
      { problem: "Use the second derivative to show $f(x)=3x^2-2x+5$ is convex.", steps: [
        { do: "Differentiate once", result: "$f'(x)=6x-2$", why: "apply the power rule" },
        { do: "Differentiate again", result: "$f''(x)=6$", why: "differentiate the gradient" },
        { do: "Check the sign", result: "$6\\ge0$", why: "convexity in one dimension follows from nonnegative second derivative" },
        { do: "State the domain", result: "all real $x$", why: "the polynomial is defined everywhere" },
        { do: "Conclude", result: "convex on $R$", why: "the curvature is never negative" }
      ], answer: "$f$ is convex on $R$." },
      { problem: "Is $f(x)=-x^2$ convex on $R$?", steps: [
        { do: "Differentiate once", result: "$f'(x)=-2x$", why: "power rule" },
        { do: "Differentiate again", result: "$f''(x)=-2$", why: "curvature is constant" },
        { do: "Check the sign", result: "$-2<0$", why: "convex functions need nonnegative curvature" },
        { do: "Test with endpoints", result: "$f(0)=0$, $f(2)=-4$, $f(1)=-1$", why: "a midpoint check can expose concavity" },
        { do: "Compare midpoint values", result: "$-1\\nleq-2$", why: "the convexity inequality fails" }
      ], answer: "$-x^2$ is not convex on $R$." },
      { problem: "Find the minimizer of the convex quadratic $f(x)=(x+1)^2+4$.", steps: [
        { do: "Identify the square", result: "$(x+1)^2$", why: "the objective is a shifted bowl" },
        { do: "Set the square to zero", result: "$x+1=0$", why: "a square is minimized at zero" },
        { do: "Solve", result: "$x=-1$", why: "subtract 1" },
        { do: "Compute the value", result: "$f(-1)=4$", why: "the square term vanishes" },
        { do: "Use convexity", result: "global minimizer", why: "local bottom of a convex function is global" }
      ], answer: "$x^\\ast=-1$ with minimum value $4$." },
      { problem: "Check the convexity inequality for $f(x)=|x|$, $x=-2$, $y=4$, $t=0.5$.", steps: [
        { do: "Compute the midpoint", result: "$0.5(-2)+0.5(4)=1$", why: "average the inputs" },
        { do: "Evaluate at the midpoint", result: "$|1|=1$", why: "absolute value of 1" },
        { do: "Evaluate endpoints", result: "$|-2|=2$ and $|4|=4$", why: "absolute values" },
        { do: "Average endpoint values", result: "$0.5\\cdot2+0.5\\cdot4=3$", why: "blend outputs" },
        { do: "Compare", result: "$1\\le3$", why: "the convexity inequality holds for this test" }
      ], answer: "For these points, $|x|$ passes the convexity check." },
      { problem: "For least squares $L(w)=(2w-6)^2$, find the second derivative and minimizer.", steps: [
        { do: "Expand the loss", result: "$L(w)=4w^2-24w+36$", why: "square $2w-6$" },
        { do: "Differentiate", result: "$L'(w)=8w-24$", why: "power rule" },
        { do: "Differentiate again", result: "$L''(w)=8$", why: "curvature is constant" },
        { do: "Set gradient to zero", result: "$8w-24=0$", why: "convex differentiable minima satisfy zero slope" },
        { do: "Solve", result: "$w=3$", why: "divide 24 by 8" }
      ], answer: "$L$ is convex because $L''=8>0$, and its minimizer is $w=3$." }
    ],
    applications: [
      { title: "Least-squares regression", background: "Gauss and Legendre popularized least squares for fitting observations. The squared-error objective is convex in linear-model weights.", numbers: "For one point with feature $2$ and label $6$, loss $(2w-6)^2$ has curvature $8$ and minimum at $w=3$." },
      { title: "Logistic regression", background: "Before deep learning, logistic regression was a central convex classifier. Its loss is convex for linear scores.", numbers: "If true label is $1$ and predicted probability is $0.8$, loss $-\\ln0.8\\approx0.223$; at $0.4$, loss $0.916$, larger as confidence worsens." },
      { title: "Jensen's inequality", background: "Jensen's inequality is the algebraic voice of convexity and appears throughout probability and information theory.", numbers: "For $f(x)=x^2$, average inputs $1$ and $3$ give $f(2)=4$, while average outputs give $(1+9)/2=5$." },
      { title: "Regularization penalties", background: "Convex penalties such as $||w||_2^2$ and $||w||_1$ discourage large weights while preserving tractable optimization.", numbers: "For $w=[3,4]$, $||w||_2^2=25$ and $||w||_1=7$; both add predictable penalty as weights grow." },
      { title: "Global guarantees", background: "Convexity is prized because any local minimum is global. This gives algorithms a target they can trust.", numbers: "If a convex loss has stationary points at $w=2$ and no lower value elsewhere, checking $L(2)=0.3$ certifies the global minimum." },
      { title: "Calibration and proper losses", background: "Many scoring rules in statistics are convex so expected loss rewards honest probabilities.", numbers: "For true event probability $0.7$, squared loss risk at prediction $0.7$ is lower than at $0.5$ by $(0.7-0.5)^2=0.04$ in the deterministic target picture." }
    ],
    applicationsClose: "Convex functions are the bowl-shaped objectives where optimization can make promises instead of guesses.",
    takeaways: ["Convexity means $f$ at a blended input is at most the blended function values.", "For twice-differentiable one-dimensional functions, $f''\\ge0$ implies convexity.", "Convex functions have no nonglobal local minima on convex domains.", "Many foundational ML objectives are convex even when modern models are not."]
  },

  "math-22-04": {
    id: "math-22-04",
    title: "Optimality conditions (unconstrained)",
    tagline: "At a smooth unconstrained minimum, the first-order push disappears and curvature tells the local story.",
    connections: {
      buildsOn: ["derivatives", "gradients", "Hessians", "Convex functions"],
      leadsTo: ["Gradient descent", "Convergence rates", "Line search methods"],
      usedWith: ["Taylor expansion", "critical points", "positive semidefinite matrices", "quadratics"]
    },
    motivation:
      "<p>When you stand at the bottom of a smooth bowl, every tiny direction feels flat to first order. If one direction still slopes down, you are not at the bottom.</p>" +
      "<p>Optimality conditions turn that physical feeling into tests. They tell us what a candidate minimizer must satisfy, and for convex problems they can certify that training has reached the best possible point.</p>",
    definition:
      "<p>For a differentiable unconstrained function $f:R^n\\to R$, a local minimizer $x^\\ast$ must satisfy $\\nabla f(x^\\ast)=0$. If $f$ is twice differentiable, a second-order necessary condition is $\\nabla^2 f(x^\\ast)$ positive semidefinite. If $f$ is convex, $\\nabla f(x^\\ast)=0$ is also sufficient for global optimality.</p>" +
      "<p>The gradient condition comes from directional derivatives. If $\\nabla f(x^\\ast)\\ne0$, moving a tiny amount in direction $-\\nabla f(x^\\ast)$ changes the function by approximately $-\\alpha ||\\nabla f(x^\\ast)||^2$, which is negative for small $\\alpha>0$. So a smooth local minimum cannot have nonzero gradient.</p>" +
      "<p><b>Assumptions that matter:</b> these are unconstrained conditions; constraints can allow nonzero gradients at boundaries; differentiability is required for the gradient test; and nonzero curvature signs classify only local behavior unless convexity supplies global structure.</p>",
    worked: {
      problem: "Find and classify the stationary point of $f(x)=x^2-6x+10$.",
      skills: ["first derivative", "second derivative", "global minimum"],
      strategy: "Set the derivative to zero, then use curvature to classify the point.",
      steps: [
        { do: "Differentiate", result: "$f'(x)=2x-6$", why: "power rule and constant derivative" },
        { do: "Set the derivative to zero", result: "$2x-6=0$", why: "smooth unconstrained optima need zero slope" },
        { do: "Solve for $x$", result: "$x=3$", why: "add 6 and divide by 2" },
        { do: "Differentiate again", result: "$f''(x)=2$", why: "curvature decides local shape" },
        { do: "Classify by curvature", result: "local minimum", why: "$2>0$ means the curve bends upward" },
        { do: "Compute the value", result: "$f(3)=1$", why: "$9-18+10=1$" }
      ],
      verify: "Completing the square gives $f(x)=(x-3)^2+1$, so no value below $1$ is possible.",
      answer: "The stationary point is $x=3$, a global minimum with value $1$.",
      connects: "Zero gradient plus positive curvature identifies the bottom of this smooth convex bowl."
    },
    practice: [
      { problem: "Find the unconstrained minimizer of $f(x)=4x^2+8x+7$.", steps: [
        { do: "Differentiate", result: "$f'(x)=8x+8$", why: "power rule" },
        { do: "Set to zero", result: "$8x+8=0$", why: "first-order condition" },
        { do: "Solve", result: "$x=-1$", why: "subtract 8 and divide by 8" },
        { do: "Compute curvature", result: "$f''(x)=8$", why: "second derivative" },
        { do: "Evaluate the value", result: "$f(-1)=3$", why: "$4-8+7=3$" }
      ], answer: "$x^\\ast=-1$ is the global minimizer with value $3$." },
      { problem: "Classify the stationary point of $g(x)=-x^2+4x$.", steps: [
        { do: "Differentiate", result: "$g'(x)=-2x+4$", why: "find the slope" },
        { do: "Set to zero", result: "$-2x+4=0$", why: "stationary point condition" },
        { do: "Solve", result: "$x=2$", why: "move terms and divide" },
        { do: "Compute the second derivative", result: "$g''(x)=-2$", why: "curvature is constant" },
        { do: "Classify", result: "local maximum", why: "negative curvature bends downward" }
      ], answer: "$x=2$ is a local and global maximum, not a minimum." },
      { problem: "For $f(x,y)=x^2+y^2-4x+2y$, find the stationary point.", steps: [
        { do: "Compute $\\partial f/\\partial x$", result: "$2x-4$", why: "differentiate with respect to $x$" },
        { do: "Compute $\\partial f/\\partial y$", result: "$2y+2$", why: "differentiate with respect to $y$" },
        { do: "Set the first component to zero", result: "$2x-4=0$", why: "gradient must be zero" },
        { do: "Set the second component to zero", result: "$2y+2=0$", why: "both gradient components vanish" },
        { do: "Solve", result: "$(x,y)=(2,-1)$", why: "solve the two linear equations" }
      ], answer: "The stationary point is $(2,-1)$, the global minimum because the Hessian is positive definite." },
      { problem: "Use the gradient to show $f(x,y)=x^2-y^2$ has a saddle at $(0,0)$.", steps: [
        { do: "Compute the gradient", result: "$\\nabla f(x,y)=(2x,-2y)$", why: "differentiate by coordinate" },
        { do: "Evaluate at the origin", result: "$\\nabla f(0,0)=(0,0)$", why: "it is stationary" },
        { do: "Move along the $x$-axis", result: "$f(a,0)=a^2>0$ for $a\\ne0$", why: "values rise in one direction" },
        { do: "Move along the $y$-axis", result: "$f(0,a)=-a^2<0$ for $a\\ne0$", why: "values fall in another direction" },
        { do: "Classify", result: "saddle point", why: "nearby values occur above and below $f(0,0)$" }
      ], answer: "$(0,0)$ is stationary but not a minimum; it is a saddle." },
      { problem: "A one-parameter model has empirical loss $L(w)=0.5w^2-3w+5$. Find the training optimum.", steps: [
        { do: "Differentiate", result: "$L'(w)=w-3$", why: "slope of the loss" },
        { do: "Set slope to zero", result: "$w-3=0$", why: "first-order optimality" },
        { do: "Solve", result: "$w=3$", why: "add 3" },
        { do: "Check curvature", result: "$L''(w)=1>0$", why: "positive curvature gives a minimum" },
        { do: "Compute the loss", result: "$L(3)=0.5\\cdot9-9+5=0.5$", why: "substitute the optimizer" }
      ], answer: "$w^\\ast=3$ with minimum loss $0.5$." }
    ],
    applications: [
      { title: "Normal equations", background: "Least-squares regression sets the gradient of squared error to zero, producing equations for the best linear fit.", numbers: "For $L(w)=(2w-6)^2$, $L'(w)=8w-24=0$ gives $w=3$." },
      { title: "Checking convergence", background: "Optimization software often reports gradient norms because a small gradient suggests first-order stationarity.", numbers: "If $||\\nabla L||=0.002$, a step of size $0.1$ in steepest descent predicts a loss drop about $0.1(0.002)^2=0.0000004$." },
      { title: "Saddle points in deep learning", background: "High-dimensional nonconvex losses can have many stationary points that are not minima. Saddles slow training.", numbers: "$f(x,y)=x^2-y^2$ has gradient zero at $(0,0)$, but values $0.01$ and $-0.01$ nearby." },
      { title: "Convex certification", background: "For convex differentiable objectives, zero gradient is not just necessary; it certifies global optimality.", numbers: "If convex $L$ has $L(2)=1.7$ and $\\nabla L(2)=0$, then no other point has loss below $1.7$." },
      { title: "Second-order methods", background: "Newton-style methods use Hessian curvature to scale steps. Positive curvature means a local quadratic model has a bottom.", numbers: "For $f(x)=5x^2$, gradient $10x$ and Hessian $10$ give Newton step $-10x/10=-x$, reaching zero in one ideal step." },
      { title: "Boundary caution", background: "Unconstrained conditions fail at constrained boundaries. A minimum can occur with nonzero gradient if movement outside is forbidden.", numbers: "Minimize $f(x)=x$ over $x\\ge0$: optimum is $0$, but $f'(0)=1$, not zero." }
    ],
    applicationsClose: "Optimality conditions are diagnostic tools: first ask whether slope remains, then ask what the curvature allows.",
    takeaways: ["A smooth unconstrained local minimum must have zero gradient.", "Positive second derivative or positive semidefinite Hessian supports a local minimum test.", "For convex differentiable functions, zero gradient is sufficient for global optimality.", "Stationary points can be minima, maxima, or saddles when convexity is absent."]
  },

  "math-22-05": {
    id: "math-22-05",
    title: "Gradient descent",
    tagline: "Gradient descent trains by repeatedly stepping downhill in the direction the loss decreases fastest.",
    connections: {
      buildsOn: ["gradients", "Optimality conditions (unconstrained)", "Convex functions", "vectors"],
      leadsTo: ["Convergence rates", "Line search methods", "Momentum"],
      usedWith: ["learning rates", "Taylor approximation", "norms", "iterations"]
    },
    motivation:
      "<p>Once a loss is written down, we still need a way to move the parameters. The gradient tells us the direction of steepest increase, so the negative gradient gives the most direct local downhill direction.</p>" +
      "<p>Gradient descent is the basic training loop hiding under much of ML: compute a gradient, choose a learning rate, update parameters, repeat. The method is simple, but the choice of step size carries real wisdom.</p>",
    definition:
      "<p>For differentiable $f$, <b>gradient descent</b> updates $$x_{k+1}=x_k-\\alpha_k \\nabla f(x_k),$$ where $x_k$ is the current iterate, $\\alpha_k>0$ is the learning rate, and $\\nabla f(x_k)$ points uphill. The minus sign moves downhill.</p>" +
      "<p>The update follows from the first-order approximation $f(x+s)\\approx f(x)+\\nabla f(x)^T s$. Among small steps of fixed length, choosing $s$ opposite the gradient gives the largest predicted decrease. A step that is too large can overshoot; a step that is too small can crawl.</p>" +
      "<p><b>Assumptions that matter:</b> gradients must exist or be replaced by subgradients; the learning rate affects stability; convex smooth objectives give stronger guarantees; and nonconvex objectives may converge only to stationary points.</p>",
    worked: {
      problem: "Run three steps of gradient descent on $f(w)=(w-4)^2$ from $w_0=0$ with learning rate $\\alpha=0.25$.",
      skills: ["gradients", "iterations", "learning rate"],
      strategy: "Differentiate once, then apply the same update formula repeatedly.",
      steps: [
        { do: "Compute the gradient", result: "$f'(w)=2(w-4)$", why: "chain rule for the square" },
        { do: "Evaluate the first gradient", result: "$f'(0)=-8$", why: "substitute $w_0=0$" },
        { do: "Update once", result: "$w_1=0-0.25(-8)=2$", why: "subtract the scaled gradient" },
        { do: "Evaluate the second gradient", result: "$f'(2)=-4$", why: "the point is closer to 4" },
        { do: "Update twice", result: "$w_2=2-0.25(-4)=3$", why: "take another downhill step" },
        { do: "Evaluate and update third", result: "$w_3=3-0.25(-2)=3.5$", why: "$f'(3)=-2$" }
      ],
      verify: "The iterates $0,2,3,3.5$ move toward the minimizer $4$, and the loss drops from $16$ to $0.25$.",
      answer: "After three steps, $w_3=3.5$.",
      connects: "Gradient descent repeatedly uses local slope information to reduce the training objective."
    },
    practice: [
      { problem: "For $f(w)=w^2$, start at $w_0=6$ with $\\alpha=0.1$ and compute two steps.", steps: [
        { do: "Differentiate", result: "$f'(w)=2w$", why: "power rule" },
        { do: "Evaluate at $w_0$", result: "$f'(6)=12$", why: "substitute 6" },
        { do: "Update to $w_1$", result: "$w_1=6-0.1\\cdot12=4.8$", why: "move against the gradient" },
        { do: "Evaluate at $w_1$", result: "$f'(4.8)=9.6$", why: "gradient is twice the current value" },
        { do: "Update to $w_2$", result: "$w_2=4.8-0.1\\cdot9.6=3.84$", why: "repeat the update" }
      ], answer: "$w_1=4.8$ and $w_2=3.84$." },
      { problem: "For $f(w)=(w+2)^2$, start at $w_0=2$ with $\\alpha=0.5$ and compute one step.", steps: [
        { do: "Differentiate", result: "$f'(w)=2(w+2)$", why: "chain rule" },
        { do: "Evaluate the gradient", result: "$f'(2)=8$", why: "$2(4)=8$" },
        { do: "Scale the gradient", result: "$0.5\\cdot8=4$", why: "learning rate times slope" },
        { do: "Update", result: "$w_1=2-4=-2$", why: "move downhill" },
        { do: "Check the optimum", result: "$w_1=-2$", why: "the square is minimized at $-2$" }
      ], answer: "One step reaches $w_1=-2$, the minimizer." },
      { problem: "For $f(w)=0.5(w-1)^2$, start at $w_0=5$ with $\\alpha=1$ and compute two steps.", steps: [
        { do: "Differentiate", result: "$f'(w)=w-1$", why: "the factor $0.5$ cancels the 2" },
        { do: "Evaluate at 5", result: "$f'(5)=4$", why: "current point is four units above optimum" },
        { do: "Update", result: "$w_1=5-1\\cdot4=1$", why: "subtract the gradient" },
        { do: "Evaluate at 1", result: "$f'(1)=0$", why: "the optimum has zero slope" },
        { do: "Update again", result: "$w_2=1$", why: "zero gradient gives no movement" }
      ], answer: "$w_1=1$ and $w_2=1$." },
      { problem: "For $f(x,y)=x^2+4y^2$, start at $(2,1)$ with $\\alpha=0.25$ and compute one step.", steps: [
        { do: "Compute the gradient", result: "$\\nabla f(x,y)=(2x,8y)$", why: "differentiate by coordinate" },
        { do: "Evaluate the gradient", result: "$\\nabla f(2,1)=(4,8)$", why: "substitute the current point" },
        { do: "Scale the gradient", result: "$0.25(4,8)=(1,2)$", why: "multiply each component" },
        { do: "Subtract from current point", result: "$(2,1)-(1,2)=(1,-1)$", why: "gradient descent update" },
        { do: "Compare losses", result: "$f(2,1)=8$ and $f(1,-1)=5$", why: "the step decreased loss" }
      ], answer: "The next point is $(1,-1)$." },
      { problem: "A mini model has loss gradient $\\nabla L(w,b)=(0.6,-0.2)$ at $(w,b)=(1,3)$. Use learning rate $0.1$ for one update.", steps: [
        { do: "Scale the gradient", result: "$0.1(0.6,-0.2)=(0.06,-0.02)$", why: "learning rate times gradient" },
        { do: "Write the current parameters", result: "$(1,3)$", why: "start from the given point" },
        { do: "Subtract the scaled gradient", result: "$(1,3)-(0.06,-0.02)$", why: "move downhill" },
        { do: "Compute the update", result: "$(0.94,3.02)$", why: "subtract coordinate by coordinate" },
        { do: "Interpret signs", result: "$w$ decreases and $b$ increases", why: "positive gradient lowers parameter; negative gradient raises it" }
      ], answer: "The updated parameters are $(w,b)=(0.94,3.02)$." }
    ],
    applications: [
      { title: "Training neural networks", background: "Backpropagation computes gradients, and gradient-based optimizers update millions or billions of parameters.", numbers: "If a weight has gradient $0.03$ and learning rate $0.001$, the update is $-0.00003$." },
      { title: "Linear regression by iteration", background: "Even though least squares has a closed form, iterative gradient descent scales naturally to large datasets.", numbers: "For gradient $-12$ at $w=0$ with $\\alpha=0.05$, the next weight is $0.6$." },
      { title: "Learning-rate sensitivity", background: "The same gradient can be helpful or harmful depending on step size. Large steps may overshoot a narrow bowl.", numbers: "For $f(w)=w^2$ at $w=10$, $\\alpha=0.1$ gives $w=8$, while $\\alpha=1.1$ gives $w=-12$, farther in loss." },
      { title: "Feature scaling", background: "Badly scaled features stretch the loss landscape, making one learning rate too small in one direction and too large in another.", numbers: "$f(x,y)=x^2+100y^2$ has gradients $(2x,200y)$, so at $(1,1)$ the $y$ gradient is $100$ times the $x$ gradient." },
      { title: "Differentiable programming", background: "Modern software frameworks build computations so gradients can be calculated automatically through many operations.", numbers: "If $z=3w$ and $L=z^2$, then $dL/dw=6z$; at $w=2$, $z=6$ and gradient is $36$." },
      { title: "Fine-tuning", background: "Fine-tuning pretrained models uses small gradient steps so existing knowledge is adjusted rather than erased.", numbers: "A parameter $1.2000$ with gradient $5$ and learning rate $0.0001$ updates to $1.1995$." }
    ],
    applicationsClose: "Gradient descent is the repeated act of asking the loss which way is uphill, then taking a measured step the other way.",
    takeaways: ["The update is $x_{k+1}=x_k-\\alpha_k\\nabla f(x_k)$.", "The negative gradient is the steepest local downhill direction.", "Learning rate controls the tradeoff between progress and stability.", "Gradient descent is the core training loop behind much of ML."]
  },

  "math-22-06": {
    id: "math-22-06",
    title: "Convergence rates",
    tagline: "A convergence rate tells you not only that an optimizer improves, but how quickly the remaining error shrinks.",
    connections: {
      buildsOn: ["Gradient descent", "sequences", "logarithms", "Convex functions"],
      leadsTo: ["Line search methods", "Momentum", "Nesterov acceleration"],
      usedWith: ["Big-O notation", "smoothness", "strong convexity", "geometric sequences"]
    },
    motivation:
      "<p>Two training runs can both improve, yet one becomes useful in minutes while the other crawls for days. Convergence rates give language to that difference.</p>" +
      "<p>Instead of only asking where the algorithm goes, we ask how the error $E_k$ behaves after $k$ iterations. Does it shrink like $1/k$, like $1/k^2$, or by a fixed percentage each step? That speed matters in real training budgets.</p>",
    definition:
      "<p>If $E_k=f(x_k)-f(x^\\ast)$ is the optimization error, a <b>sublinear</b> rate might satisfy $E_k\\le C/k$, while a <b>linear</b> rate satisfies $E_k\\le C\\rho^k$ for some $0<\\rho<1$. Linear here means geometric decay, not a straight line in $k$.</p>" +
      "<p>For smooth convex gradient descent, a common guarantee is $E_k=O(1/k)$. With strong convexity and a good fixed step size, the error can decay linearly. The difference is dramatic: $1/k$ halves slowly, while $0.9^k$ eventually falls by a fixed percent every step.</p>" +
      "<p><b>Assumptions that matter:</b> rates depend on smoothness, convexity, strong convexity, step size, and condition number; a theoretical upper bound can be pessimistic; and stochastic gradients add noise that changes the rate story.</p>",
    worked: {
      problem: "Compare errors $E_k=10/k$ and $F_k=10(0.8)^k$ at $k=5$ and $k=20$.",
      skills: ["sublinear rates", "linear rates", "numerical comparison"],
      strategy: "Evaluate both formulas at the same iteration counts and compare the remaining errors.",
      steps: [
        { do: "Compute the sublinear error at $k=5$", result: "$E_5=10/5=2$", why: "substitute $k=5$" },
        { do: "Compute the linear-rate error at $k=5$", result: "$F_5=10(0.8)^5=3.2768$", why: "$0.8^5=0.32768$" },
        { do: "Compute the sublinear error at $k=20$", result: "$E_{20}=10/20=0.5$", why: "substitute $k=20$" },
        { do: "Compute $0.8^{20}$", result: "$0.8^{20}\\approx0.01153$", why: "geometric decay compounds" },
        { do: "Compute the linear error at $k=20$", result: "$F_{20}\\approx0.1153$", why: "multiply by 10" },
        { do: "Compare at $k=20$", result: "$0.1153<0.5$", why: "geometric decay wins after enough steps" }
      ],
      verify: "The geometric sequence may not be smaller immediately, but its fixed percentage decay becomes powerful.",
      answer: "At $k=5$, $E_5=2$ and $F_5\\approx3.2768$; at $k=20$, $E_{20}=0.5$ and $F_{20}\\approx0.1153$.",
      connects: "Rates describe the shape of improvement across iterations, not just one update."
    },
    practice: [
      { problem: "If $E_k=4/k$, how many iterations make $E_k\\le0.1$?", steps: [
        { do: "Write the target inequality", result: "$4/k\\le0.1$", why: "error must be at most 0.1" },
        { do: "Multiply by $k$", result: "$4\\le0.1k$", why: "$k$ is positive" },
        { do: "Divide by $0.1$", result: "$40\\le k$", why: "isolate $k$" },
        { do: "Choose an integer iteration", result: "$k=40$", why: "iteration counts are whole numbers" },
        { do: "Check", result: "$4/40=0.1$", why: "meets the target exactly" }
      ], answer: "At least $40$ iterations are needed." },
      { problem: "If $E_k=5(0.5)^k$, compute $E_1$, $E_3$, and $E_6$.", steps: [
        { do: "Compute $E_1$", result: "$5(0.5)=2.5$", why: "one halving" },
        { do: "Compute $(0.5)^3$", result: "$0.125$", why: "three halvings" },
        { do: "Compute $E_3$", result: "$5\\cdot0.125=0.625$", why: "multiply by the starting scale" },
        { do: "Compute $(0.5)^6$", result: "$0.015625$", why: "six halvings" },
        { do: "Compute $E_6$", result: "$5\\cdot0.015625=0.078125$", why: "multiply by 5" }
      ], answer: "$E_1=2.5$, $E_3=0.625$, and $E_6=0.078125$." },
      { problem: "A bound drops from $1/k$ to $1/k^2$. Compare both at $k=10$ and $k=100$.", steps: [
        { do: "Compute $1/10$", result: "$0.1$", why: "sublinear first-order rate" },
        { do: "Compute $1/10^2$", result: "$0.01$", why: "accelerated rate at 10" },
        { do: "Compute $1/100$", result: "$0.01$", why: "first-order rate at 100" },
        { do: "Compute $1/100^2$", result: "$0.0001$", why: "square the iteration count" },
        { do: "Compare improvement at 100", result: "$0.01/0.0001=100$", why: "$1/k^2$ is 100 times smaller at $k=100$" }
      ], answer: "At $k=10$: $0.1$ versus $0.01$; at $k=100$: $0.01$ versus $0.0001$." },
      { problem: "If a linearly convergent method has contraction $\\rho=0.9$, what fraction of error remains after $10$ steps?", steps: [
        { do: "Write the fraction", result: "$0.9^{10}$", why: "each step keeps 90 percent" },
        { do: "Square $0.9^5$ or compute directly", result: "$0.9^{10}\\approx0.3487$", why: "geometric powers compound" },
        { do: "Convert to percent", result: "$34.87%$", why: "multiply by 100" },
        { do: "Compute reduction", result: "$100%-34.87%=65.13%$", why: "remaining plus reduced equals total" },
        { do: "Interpret", result: "about one third remains", why: "ten modest contractions add up" }
      ], answer: "About $0.3487$ of the original error remains." },
      { problem: "A strongly convex training loss has bound $E_k\\le2(0.75)^k$. Find $k$ so the bound is below $0.1$ using $0.75^8\\approx0.100$ and $0.75^{11}\\approx0.042$.", steps: [
        { do: "Write the target", result: "$2(0.75)^k\\le0.1$", why: "desired error bound" },
        { do: "Divide by 2", result: "$(0.75)^k\\le0.05$", why: "isolate the geometric factor" },
        { do: "Test $k=8$", result: "$2(0.75)^8\\approx0.2$", why: "given power times 2" },
        { do: "Test $k=11$", result: "$2(0.75)^{11}\\approx0.084$", why: "given power times 2" },
        { do: "Choose the listed sufficient count", result: "$k=11$", why: "this is below $0.1$" }
      ], answer: "$11$ iterations are sufficient from the given powers." }
    ],
    applications: [
      { title: "Training budgets", background: "Teams choose optimizers partly by how many steps are needed to reach a useful loss. Rates translate math into compute cost.", numbers: "If each step costs $0.2$ seconds, $10,000$ steps cost $2,000$ seconds, about $33.3$ minutes." },
      { title: "Condition numbers", background: "Ill-conditioned quadratics converge slowly because some directions are much flatter than others.", numbers: "For condition number $100$, a simple contraction estimate $(99/101)\\approx0.9802$ keeps about $0.9802^{100}\\approx0.136$ after 100 steps." },
      { title: "Accelerated methods", background: "Nesterov acceleration improves a classic convex rate from $1/k$ to $1/k^2$ under smooth convex assumptions.", numbers: "At $k=50$, $1/k=0.02$ while $1/k^2=0.0004$." },
      { title: "Early stopping", background: "Validation curves often improve quickly then flatten. Rate thinking helps decide when additional compute gives little return.", numbers: "If loss gains shrink as $1/k$, moving from $100$ to $200$ steps changes the bound from $0.01$ to $0.005$." },
      { title: "Stochastic optimization", background: "Noisy gradients often have slower asymptotic rates, so averaging and learning-rate decay matter.", numbers: "A noisy $1/\\sqrt{k}$ term is $0.1$ at $k=100$ and $0.01$ only at $k=10,000$." },
      { title: "Benchmark comparisons", background: "Optimizer papers compare curves by iteration and wall-clock time because rate constants and per-step costs both matter.", numbers: "Method A needs $500$ steps at $4$ ms, total $2$ s; Method B needs $300$ steps at $10$ ms, total $3$ s." }
    ],
    applicationsClose: "Convergence rates put a clock on optimization: they connect mathematical progress to compute, time, and patience.",
    takeaways: ["Sublinear rates such as $C/k$ improve steadily but slowly.", "Linear convergence means geometric decay $C\\rho^k$ with $0<\\rho<1$.", "Smoothness, strong convexity, conditioning, and step size control rates.", "A faster iteration bound is useful only alongside the cost of each iteration."]
  },
  "math-22-07": {
    id: "math-22-07",
    title: "Line search methods",
    tagline: "Line search chooses a step length by asking how far downhill is wise along a chosen direction.",
    connections: {
      buildsOn: ["Gradient descent", "Taylor approximation", "derivatives", "Convergence rates"],
      leadsTo: ["Momentum", "Nesterov acceleration", "quasi-Newton methods"],
      usedWith: ["descent directions", "Armijo condition", "backtracking", "one-dimensional minimization"]
    },
    motivation:
      "<p>Gradient descent needs a learning rate, and a fixed learning rate can feel like wearing one shoe size on every trail. Sometimes the terrain is gentle; sometimes it is steep.</p>" +
      "<p>A <b>line search</b> keeps the direction but chooses the step length using the objective itself. It is a practical compromise: use gradient information for direction, then test how far to move.</p>",
    definition:
      "<p>Given a current point $x_k$ and descent direction $p_k$, a line search chooses $\\alpha_k>0$ for $x_{k+1}=x_k+\\alpha_k p_k$. For steepest descent, $p_k=-\\nabla f(x_k)$. An exact line search minimizes $\\phi(\\alpha)=f(x_k+\\alpha p_k)$ over $\\alpha\\ge0$.</p>" +
      "<p>Backtracking line search starts with a trial step and shrinks it, often by a factor $\\beta\\in(0,1)$, until a sufficient decrease condition holds, such as $f(x_k+\\alpha p_k)\\le f(x_k)+c\\alpha\\nabla f(x_k)^T p_k$ with $0<c<1$.</p>" +
      "<p><b>Assumptions that matter:</b> $p_k$ should be a descent direction, meaning $\\nabla f(x_k)^T p_k<0$; objective evaluations must be affordable; exact line search can be expensive; and noisy minibatch losses can make acceptance tests unreliable.</p>",
    worked: {
      problem: "For $f(x)=(x-3)^2$, current $x_0=0$, direction $p=6$, find the exact line-search step $\\alpha\\ge0$.",
      skills: ["line search", "one-dimensional minimization", "quadratics"],
      strategy: "Write the loss as a function of $\\alpha$, then minimize that one-variable quadratic.",
      steps: [
        { do: "Write the trial point", result: "$x(\\alpha)=0+6\\alpha$", why: "move from $x_0$ along direction $p$" },
        { do: "Substitute into the objective", result: "$\\phi(\\alpha)=(6\\alpha-3)^2$", why: "line search minimizes along the line" },
        { do: "Differentiate with respect to $\\alpha$", result: "$\\phi'(\\alpha)=12(6\\alpha-3)$", why: "chain rule" },
        { do: "Set the derivative to zero", result: "$12(6\\alpha-3)=0$", why: "exact line search finds the one-dimensional minimum" },
        { do: "Solve", result: "$\\alpha=0.5$", why: "$6\\alpha=3$" },
        { do: "Compute the new point", result: "$x_1=3$", why: "$6\\cdot0.5=3$" }
      ],
      verify: "The new point is exactly the minimizer of $f$, so the resulting loss is $0$.",
      answer: "The exact line-search step is $\\alpha=0.5$, giving $x_1=3$.",
      connects: "Line search turns step-size choice into a smaller optimization problem along one direction."
    },
    practice: [
      { problem: "For $f(x)=x^2$, current $x=4$, direction $p=-8$, find the exact line-search step.", steps: [
        { do: "Write the line", result: "$x(\\alpha)=4-8\\alpha$", why: "start at 4 and move along $p$" },
        { do: "Substitute into $f$", result: "$\\phi(\\alpha)=(4-8\\alpha)^2$", why: "objective along the line" },
        { do: "Differentiate", result: "$\\phi'(\\alpha)=-16(4-8\\alpha)$", why: "chain rule" },
        { do: "Set to zero", result: "$4-8\\alpha=0$", why: "the square is minimized at zero" },
        { do: "Solve", result: "$\\alpha=0.5$", why: "divide 4 by 8" }
      ], answer: "$\\alpha=0.5$, which moves to $x=0$." },
      { problem: "Backtracking starts with $\\alpha=1$ and $\\beta=0.5$. List the first four trial step sizes.", steps: [
        { do: "Start", result: "$\\alpha_0=1$", why: "initial trial step" },
        { do: "Shrink once", result: "$\\alpha_1=0.5$", why: "multiply by $\\beta=0.5$" },
        { do: "Shrink twice", result: "$\\alpha_2=0.25$", why: "multiply by 0.5 again" },
        { do: "Shrink three times", result: "$\\alpha_3=0.125$", why: "halve the previous trial" },
        { do: "Recognize the pattern", result: "$1,0.5,0.25,0.125$", why: "geometric shrinkage" }
      ], answer: "The first four trial sizes are $1,0.5,0.25,0.125$." },
      { problem: "For $f(x)=x^2$, $x=1$, direction $p=-2$, test the Armijo condition with $c=0.1$ and $\\alpha=0.5$.", steps: [
        { do: "Compute the new point", result: "$1+0.5(-2)=0$", why: "apply the trial step" },
        { do: "Compute new loss", result: "$f(0)=0$", why: "square the new point" },
        { do: "Compute old gradient", result: "$f'(1)=2$", why: "derivative of $x^2$" },
        { do: "Compute the Armijo right side", result: "$1+0.1\\cdot0.5\\cdot2(-2)=0.8$", why: "$f(1)=1$ and $f'(1)p=-4$" },
        { do: "Compare", result: "$0\\le0.8$", why: "sufficient decrease holds" }
      ], answer: "The step $\\alpha=0.5$ is accepted by this Armijo test." },
      { problem: "For $f(x)=(x-2)^2+1$, at $x=0$, compare trial steps $\\alpha=0.25$ and $\\alpha=1$ along $p=4$.", steps: [
        { do: "Compute the $0.25$ point", result: "$0+0.25\\cdot4=1$", why: "first trial step" },
        { do: "Evaluate the first loss", result: "$f(1)=2$", why: "$(1-2)^2+1=2$" },
        { do: "Compute the $1$ point", result: "$0+1\\cdot4=4$", why: "second trial step" },
        { do: "Evaluate the second loss", result: "$f(4)=5$", why: "$(4-2)^2+1=5$" },
        { do: "Compare with old loss", result: "$f(0)=5$", why: "$\\alpha=1$ does not improve, while $0.25$ does" }
      ], answer: "$\\alpha=0.25$ is better here, giving loss $2$ instead of $5$." },
      { problem: "At a model parameter $w=2$, the gradient is $10$ and direction is $p=-10$. If backtracking accepts $\\alpha=0.01$, what is the update?", steps: [
        { do: "Scale the direction", result: "$0.01(-10)=-0.1$", why: "step length times direction" },
        { do: "Add to current parameter", result: "$2+(-0.1)=1.9$", why: "line-search update" },
        { do: "Compute gradient-direction product", result: "$10(-10)=-100$", why: "negative product confirms descent" },
        { do: "Interpret step size", result: "small accepted step", why: "large gradient may require caution" },
        { do: "State new parameter", result: "$w_1=1.9$", why: "complete the update" }
      ], answer: "The updated parameter is $w_1=1.9$." }
    ],
    applications: [
      { title: "Classical numerical optimization", background: "Line search is a core ingredient in steepest descent, Newton, and quasi-Newton methods from numerical analysis.", numbers: "If backtracking tests $1,0.5,0.25$ and accepts $0.25$, it used three objective evaluations for the step." },
      { title: "Stable large-batch training", background: "When full-batch gradients are available, checking actual loss decrease can prevent unstable steps.", numbers: "A proposed step lowering loss from $2.40$ to $2.31$ gives decrease $0.09$; one raising it to $2.55$ is rejected." },
      { title: "Newton methods", background: "Newton directions can be excellent but sometimes too aggressive far from the solution. Line search damps them.", numbers: "A Newton direction $p=-5$ from $x=10$ with accepted $\\alpha=0.2$ moves only $1$ unit to $x=9$." },
      { title: "Logistic regression solvers", background: "Convex logistic regression packages often use line search inside quasi-Newton routines to get reliable monotone progress.", numbers: "If loss values along trials are $0.70,0.62,0.61$, the best of those trials is $0.61$." },
      { title: "Engineering safety checks", background: "Objective evaluations can catch bad scaling, coding errors, or directions that are not truly descent directions.", numbers: "If $\\nabla f^Tp=3>0$, then small positive $\\alpha$ predicts an increase of about $3\\alpha$, so the direction is suspect." },
      { title: "Hyperparameter-free step choice", background: "Line search reduces dependence on a manually tuned learning rate, though it pays with extra function evaluations.", numbers: "A fixed step uses one gradient evaluation; a backtracking step with four trials uses one gradient plus four loss evaluations." }
    ],
    applicationsClose: "Line search is the optimizer's careful footstep: choose a direction, then let the function say how far is safe.",
    takeaways: ["Line search chooses $\\alpha$ in $x_{k+1}=x_k+\\alpha p_k$.", "A descent direction satisfies $\\nabla f(x_k)^Tp_k<0$.", "Exact line search minimizes along one line; backtracking shrinks until decrease is sufficient.", "Line search trades extra objective evaluations for safer step sizes."]
  },

  "math-22-08": {
    id: "math-22-08",
    title: "Momentum",
    tagline: "Momentum remembers recent downhill directions so optimization can move smoothly through long valleys.",
    connections: {
      buildsOn: ["Gradient descent", "sequences", "vectors", "Convergence rates"],
      leadsTo: ["Nesterov acceleration", "adaptive optimizers", "SGD variants"],
      usedWith: ["exponential moving averages", "velocity", "damping", "condition numbers"]
    },
    motivation:
      "<p>Plain gradient descent can zigzag in a narrow valley: one step bounces left, the next bounces right, and progress down the valley is slow.</p>" +
      "<p><b>Momentum</b> adds memory. Instead of trusting only today's gradient, it carries a velocity built from recent gradients, smoothing noisy directions and accelerating repeated agreement.</p>",
    definition:
      "<p>A common momentum update is $v_{k+1}=\\mu v_k-\\alpha \\nabla f(x_k)$ and $x_{k+1}=x_k+v_{k+1}$, where $v_k$ is velocity, $0\\le\\mu<1$ is the momentum coefficient, and $\\alpha$ is the learning rate. Some libraries write equivalent forms with gradients averaged first.</p>" +
      "<p>The velocity is an exponentially weighted memory. Expanding the recurrence shows recent gradients receive weights involving $1,\\mu,\\mu^2$, and so on. Consistent gradients accumulate; alternating gradients partially cancel.</p>" +
      "<p><b>Assumptions that matter:</b> too much momentum can overshoot; the learning rate and momentum must be tuned together; momentum changes the state of the optimizer, so $x_k$ alone no longer tells the whole story.</p>",
    worked: {
      problem: "Use momentum with $v_0=0$, $x_0=0$, gradients $g_0=-4$, $g_1=-2$, learning rate $\\alpha=0.1$, and $\\mu=0.9$. Compute $x_2$.",
      skills: ["momentum recurrence", "velocity", "parameter updates"],
      strategy: "Update velocity first, then add it to the parameter at each step.",
      steps: [
        { do: "Compute first velocity", result: "$v_1=0.9\\cdot0-0.1(-4)=0.4$", why: "use $g_0=-4$" },
        { do: "Update first position", result: "$x_1=0+0.4=0.4$", why: "add velocity" },
        { do: "Compute second velocity memory", result: "$0.9v_1=0.36$", why: "carry most of the previous velocity" },
        { do: "Compute second gradient push", result: "$-0.1(-2)=0.2$", why: "move opposite the new gradient" },
        { do: "Add for second velocity", result: "$v_2=0.36+0.2=0.56$", why: "memory and new push agree" },
        { do: "Update second position", result: "$x_2=0.4+0.56=0.96$", why: "add the new velocity" }
      ],
      verify: "Both gradients are negative, so downhill movement is positive; momentum makes the second move larger than the new gradient step alone.",
      answer: "$x_2=0.96$.",
      connects: "Momentum accelerates when recent gradients point in similar directions."
    },
    practice: [
      { problem: "With $v_0=0$, $g_0=5$, $\\alpha=0.2$, and $\\mu=0.8$, compute $v_1$.", steps: [
        { do: "Write the update", result: "$v_1=\\mu v_0-\\alpha g_0$", why: "momentum recurrence" },
        { do: "Substitute values", result: "$v_1=0.8\\cdot0-0.2\\cdot5$", why: "use the given numbers" },
        { do: "Multiply", result: "$0.2\\cdot5=1$", why: "scale the gradient" },
        { do: "Subtract", result: "$v_1=-1$", why: "positive gradient means move negative" },
        { do: "Interpret", result: "velocity points downhill", why: "it opposes the gradient" }
      ], answer: "$v_1=-1$." },
      { problem: "If $x_0=3$, $v_1=-1$, compute $x_1$.", steps: [
        { do: "Write the position update", result: "$x_1=x_0+v_1$", why: "momentum adds velocity" },
        { do: "Substitute", result: "$x_1=3+(-1)$", why: "use the current position and velocity" },
        { do: "Simplify", result: "$x_1=2$", why: "add the signed velocity" },
        { do: "Compare direction", result: "moved left", why: "negative velocity decreases $x$" },
        { do: "State the new state", result: "$(x_1,v_1)=(2,-1)$", why: "momentum keeps both values" }
      ], answer: "$x_1=2$." },
      { problem: "With $v_1=-1$, next gradient $g_1=5$, $\\alpha=0.2$, $\\mu=0.8$, compute $v_2$.", steps: [
        { do: "Compute memory", result: "$0.8(-1)=-0.8$", why: "keep 80 percent of velocity" },
        { do: "Compute gradient push", result: "$-0.2(5)=-1$", why: "move opposite gradient" },
        { do: "Add terms", result: "$v_2=-1.8$", why: "same direction pushes accumulate" },
        { do: "Compare with plain step", result: "plain step would be $-1$", why: "momentum makes it larger in magnitude" },
        { do: "Interpret", result: "accelerating left", why: "the gradient direction repeated" }
      ], answer: "$v_2=-1.8$." },
      { problem: "Show cancellation: $v_0=0$, $g_0=4$, $g_1=-4$, $\\alpha=0.1$, $\\mu=0.9$. Compute $v_2$.", steps: [
        { do: "Compute $v_1$", result: "$0.9\\cdot0-0.1\\cdot4=-0.4$", why: "first gradient pushes left" },
        { do: "Compute memory for step 2", result: "$0.9(-0.4)=-0.36$", why: "carry previous motion" },
        { do: "Compute new gradient push", result: "$-0.1(-4)=0.4$", why: "opposite gradient now pushes right" },
        { do: "Add them", result: "$v_2=0.04$", why: "opposing signals nearly cancel" },
        { do: "Interpret", result: "small rightward velocity", why: "momentum smooths oscillation" }
      ], answer: "$v_2=0.04$." },
      { problem: "A training run uses $\\mu=0.9$. What are the relative weights of gradients from 0, 1, and 2 steps ago in the velocity expansion?", steps: [
        { do: "Identify current weight", result: "$1$", why: "the newest gradient enters without a momentum power" },
        { do: "Identify one-step-old weight", result: "$0.9$", why: "one recurrence multiplies by $\\mu$" },
        { do: "Identify two-step-old weight", result: "$0.9^2=0.81$", why: "two recurrences multiply by $\\mu^2$" },
        { do: "List the pattern", result: "$1,0.9,0.81$", why: "exponential memory" },
        { do: "Interpret", result: "older gradients fade", why: "powers of a number below 1 shrink" }
      ], answer: "The relative weights are $1$, $0.9$, and $0.81$." }
    ],
    applications: [
      { title: "Deep learning optimizers", background: "Momentum became a default tool because neural-network losses are noisy and poorly conditioned.", numbers: "With gradient $0.02$, $\\alpha=0.1$, and previous velocity $-0.01$, $v_{new}=0.9(-0.01)-0.1(0.02)=-0.011$." },
      { title: "Narrow valleys", background: "In elongated quadratics, momentum damps zigzags across the steep direction while building speed along the shallow direction.", numbers: "Alternating gradients $4,-4$ produce plain steps $-0.4,0.4$, but momentum example above gives velocities $-0.4,0.04$." },
      { title: "Exponential moving averages", background: "Momentum is a close cousin of signal smoothing, where recent observations matter most.", numbers: "Weights with $\\mu=0.9$ after four lags are $1,0.9,0.81,0.729$." },
      { title: "Escaping plateaus", background: "When gradients are small but consistent, accumulated velocity can move farther than a single tiny gradient step.", numbers: "Ten gradients of $-0.01$ with $\\alpha=0.1$ and no momentum give total push $0.01$; momentum can make later steps larger through memory." },
      { title: "Optimizer state memory", background: "Checkpoints for momentum optimizers must save velocity as well as weights, or resumed training changes behavior.", numbers: "If $w=5$ and $v=-0.2$, the next position before new effects differs by $0.2$ from restarting with $v=0$." },
      { title: "Tuning risk", background: "High momentum with high learning rate can overshoot, especially near sharp minima.", numbers: "If $v=1.5$ near an optimum only $0.2$ away, the next raw velocity move can cross far past it." }
    ],
    applicationsClose: "Momentum gives optimization a memory of direction, useful when repeated evidence should carry more force than a single noisy gradient.",
    takeaways: ["Momentum updates a velocity and then moves parameters by that velocity.", "Consistent gradients accumulate; alternating gradients cancel partly.", "The momentum coefficient controls how quickly old gradients fade.", "Learning rate and momentum must be tuned together for stability."]
  },

  "math-22-09": {
    id: "math-22-09",
    title: "Nesterov acceleration",
    tagline: "Nesterov acceleration looks ahead before taking the gradient, adding foresight to momentum.",
    connections: {
      buildsOn: ["Momentum", "Gradient descent", "Convergence rates", "Convex functions"],
      leadsTo: ["adaptive optimizers", "accelerated gradient methods", "Stochastic gradient descent (SGD)"],
      usedWith: ["lookahead points", "velocity", "smooth convex functions", "estimate sequences"]
    },
    motivation:
      "<p>Momentum is like rolling downhill with memory. But if you only look at the slope under your current feet, you may react late when the valley turns.</p>" +
      "<p>Nesterov's idea is beautifully practical: first look where momentum is about to take you, then measure the gradient there. That small change can improve theoretical rates and often gives better control in practice.</p>",
    definition:
      "<p>One common Nesterov-style update is $y_k=x_k+\\mu v_k$, $v_{k+1}=\\mu v_k-\\alpha\\nabla f(y_k)$, and $x_{k+1}=x_k+v_{k+1}$. The point $y_k$ is the <b>lookahead</b> point.</p>" +
      "<p>For smooth convex objectives, accelerated gradient methods achieve an $O(1/k^2)$ function-error rate, improving the basic $O(1/k)$ rate of ordinary gradient descent. The update can be understood as momentum corrected by gradient information at the anticipated position.</p>" +
      "<p><b>Assumptions that matter:</b> exact rate statements require smooth convex structure and carefully chosen parameters; practical deep-learning versions are related but not identical to the clean theorem; and too much lookahead can still overshoot.</p>",
    worked: {
      problem: "Let $f(w)=(w-5)^2$, $x_0=0$, $v_0=2$, $\\mu=0.5$, and $\\alpha=0.1$. Compute one Nesterov update.",
      skills: ["lookahead", "gradient evaluation", "velocity update"],
      strategy: "Move to the lookahead point for the gradient, then update velocity and position.",
      steps: [
        { do: "Compute the lookahead point", result: "$y_0=x_0+\\mu v_0=0+0.5\\cdot2=1$", why: "peek where momentum points" },
        { do: "Differentiate", result: "$f'(w)=2(w-5)$", why: "gradient of the quadratic" },
        { do: "Evaluate at lookahead", result: "$f'(1)=-8$", why: "use $y_0$, not $x_0$" },
        { do: "Compute momentum memory", result: "$\\mu v_0=1$", why: "carry half the old velocity" },
        { do: "Compute gradient correction", result: "$-0.1(-8)=0.8$", why: "move opposite the lookahead gradient" },
        { do: "Update velocity and position", result: "$v_1=1.8$ and $x_1=1.8$", why: "add velocity to $x_0$" }
      ],
      verify: "The lookahead point is below 5, so the gradient is negative and the update moves $x$ to the right.",
      answer: "$y_0=1$, $v_1=1.8$, and $x_1=1.8$.",
      connects: "Nesterov acceleration changes where the gradient is measured, not just how it is stored."
    },
    practice: [
      { problem: "With $x=3$, $v=-1$, and $\\mu=0.9$, compute the lookahead point $y$.", steps: [
        { do: "Write the formula", result: "$y=x+\\mu v$", why: "Nesterov lookahead" },
        { do: "Substitute values", result: "$y=3+0.9(-1)$", why: "use current position and velocity" },
        { do: "Multiply", result: "$0.9(-1)=-0.9$", why: "scale the velocity" },
        { do: "Add", result: "$y=2.1$", why: "look ahead in the velocity direction" },
        { do: "Interpret", result: "lookahead is left of $x$", why: "velocity is negative" }
      ], answer: "$y=2.1$." },
      { problem: "For $f(w)=w^2$, $x=3$, $v=-1$, $\\mu=0.9$, and $\\alpha=0.1$, compute one Nesterov velocity.", steps: [
        { do: "Compute lookahead", result: "$y=3+0.9(-1)=2.1$", why: "gradient is evaluated at $y$" },
        { do: "Compute gradient", result: "$f'(2.1)=4.2$", why: "derivative is $2w$" },
        { do: "Compute memory", result: "$0.9(-1)=-0.9$", why: "carry velocity" },
        { do: "Compute gradient step", result: "$-0.1(4.2)=-0.42$", why: "move opposite gradient" },
        { do: "Add for velocity", result: "$v_{new}=-1.32$", why: "combine memory and correction" }
      ], answer: "The new velocity is $-1.32$." },
      { problem: "Compare rate bounds $1/k$ and $4/k^2$ at $k=20$.", steps: [
        { do: "Compute the basic bound", result: "$1/20=0.05$", why: "ordinary gradient-style rate" },
        { do: "Compute the accelerated denominator", result: "$20^2=400$", why: "square the iteration count" },
        { do: "Compute the accelerated bound", result: "$4/400=0.01$", why: "use the given numerator" },
        { do: "Compare", result: "$0.01<0.05$", why: "accelerated bound is smaller" },
        { do: "Compute factor", result: "$0.05/0.01=5$", why: "basic bound is five times larger" }
      ], answer: "At $k=20$, $4/k^2=0.01$, five times smaller than $1/k=0.05$." },
      { problem: "Nesterov and classical momentum have $x=0$, $v=4$, $\\mu=0.5$. For $f(w)=w^2$, compare gradients at $x$ and at lookahead.", steps: [
        { do: "Compute lookahead", result: "$y=0+0.5\\cdot4=2$", why: "anticipated position" },
        { do: "Compute gradient at current point", result: "$f'(0)=0$", why: "derivative is $2w$" },
        { do: "Compute gradient at lookahead", result: "$f'(2)=4$", why: "evaluate where momentum is heading" },
        { do: "Compare", result: "$0$ versus $4$", why: "lookahead sees the slope ahead" },
        { do: "Interpret", result: "Nesterov will correct the velocity", why: "the future point is already uphill" }
      ], answer: "Classical momentum sees gradient $0$ at $x$, while Nesterov sees gradient $4$ at the lookahead point." },
      { problem: "For $f(w)=(w-1)^2$, $x=2$, $v=1$, $\\mu=0.5$, $\\alpha=0.25$, compute $x_{new}$.", steps: [
        { do: "Compute lookahead", result: "$y=2+0.5\\cdot1=2.5$", why: "look ahead" },
        { do: "Compute gradient", result: "$f'(2.5)=3$", why: "$2(2.5-1)=3$" },
        { do: "Compute new velocity", result: "$v_{new}=0.5\\cdot1-0.25\\cdot3$", why: "Nesterov velocity update" },
        { do: "Simplify velocity", result: "$v_{new}=-0.25$", why: "$0.5-0.75=-0.25$" },
        { do: "Update position", result: "$x_{new}=2-0.25=1.75$", why: "add velocity" }
      ], answer: "$x_{new}=1.75$." }
    ],
    applications: [
      { title: "Accelerated convex optimization", background: "Nesterov's 1980s acceleration result is a landmark because it improves worst-case smooth convex rates.", numbers: "At $k=100$, $1/k=0.01$ while $1/k^2=0.0001$, a 100-fold difference in the ideal bound." },
      { title: "Deep learning momentum variants", background: "Many optimizers include Nesterov momentum as an option because lookahead gradients can reduce overshoot.", numbers: "If lookahead gradient is $4$ and $\\alpha=0.01$, the correction term is $-0.04$." },
      { title: "Learning-rate schedules", background: "Accelerated methods are sensitive to parameter choices, so schedules often pair with momentum.", numbers: "Reducing $\\alpha$ from $0.1$ to $0.01$ makes a gradient $3$ correction shrink from $0.3$ to $0.03$." },
      { title: "Quadratic valleys", background: "Lookahead helps detect that momentum is about to climb a wall in a narrow valley.", numbers: "For $f(w)=w^2$, current $0$ has gradient $0$, but lookahead $2$ has gradient $4$, warning against continuing right." },
      { title: "Optimizer libraries", background: "Frameworks implement Nesterov variants with slightly different algebra but the same core idea: evaluate using anticipated motion.", numbers: "With $v=0.2$ and $\\mu=0.9$, lookahead displacement is $0.18$." },
      { title: "Theory versus practice", background: "The clean $O(1/k^2)$ theorem is for smooth convex objectives; deep learning uses the intuition in nonconvex terrain.", numbers: "A validation loss dropping from $1.0$ to $0.8$ in 10 epochs is empirical progress, not proof of the convex rate." }
    ],
    applicationsClose: "Nesterov acceleration teaches a durable optimization lesson: momentum is stronger when it also checks where it is going.",
    takeaways: ["Nesterov methods evaluate the gradient at a lookahead point.", "The classic smooth convex rate improves from $O(1/k)$ to $O(1/k^2)$.", "Lookahead can correct momentum before it overshoots too far.", "The practical deep-learning version borrows the idea, while theorem assumptions remain important."]
  },

  "math-22-10": {
    id: "math-22-10",
    title: "Subgradients",
    tagline: "A subgradient generalizes slope so nonsmooth convex functions can still be optimized.",
    connections: {
      buildsOn: ["Convex functions", "derivatives", "absolute value", "tangent lines"],
      leadsTo: ["Nonsmooth optimization", "Proximal methods", "regularization"],
      usedWith: ["supporting lines", "subdifferentials", "piecewise linear functions", "convex analysis"]
    },
    motivation:
      "<p>Some useful functions have corners. The absolute value $|x|$ is the friendliest example: it is perfectly convex, but at $0$ there is no single ordinary derivative.</p>" +
      "<p>Subgradients keep optimization alive at corners. Instead of one tangent slope, a convex corner may have a whole interval of slopes that support the graph from below.</p>",
    definition:
      "<p>For a convex function $f$, a vector $g$ is a <b>subgradient</b> at $x$ if $f(y)\\ge f(x)+g^T(y-x)$ for every $y$ in the domain. The set of all such $g$ is the <b>subdifferential</b>, written $\\partial f(x)$.</p>" +
      "<p>If $f$ is differentiable at $x$, then $\\partial f(x)=\\{\\nabla f(x)\\}$. For $f(x)=|x|$, the subdifferential is $\\partial f(0)=[-1,1]$, because any slope between $-1$ and $1$ gives a line through the origin that stays below the V-shaped graph.</p>" +
      "<p><b>Assumptions that matter:</b> the clean subgradient inequality is for convex functions; subgradients need not be unique; and the optimality condition for unconstrained convex nonsmooth minimization is $0\\in\\partial f(x^\\ast)$.</p>",
    worked: {
      problem: "Find $\\partial |x|$ at $x=0$ and decide whether $0$ minimizes $|x|$.",
      skills: ["subdifferential", "absolute value", "optimality"],
      strategy: "Use the supporting-line inequality and then check whether zero is in the subdifferential.",
      steps: [
        { do: "Write the subgradient inequality at 0", result: "$|y|\\ge |0|+g(y-0)$", why: "definition with $x=0$" },
        { do: "Simplify", result: "$|y|\\ge gy$", why: "$|0|=0$" },
        { do: "Use positive $y$", result: "$g\\le1$", why: "for $y>0$, divide $y\\ge gy$ by $y$" },
        { do: "Use negative $y$", result: "$g\\ge-1$", why: "dividing by negative $y$ reverses the inequality" },
        { do: "Combine bounds", result: "$g\\in[-1,1]$", why: "both positive and negative tests must hold" },
        { do: "Check optimality", result: "$0\\in[-1,1]$", why: "zero subgradient certifies convex minimum" }
      ],
      verify: "$|x|\\ge0$ for all $x$, so $x=0$ really is the global minimizer.",
      answer: "$\\partial |0|=[-1,1]$, and $0$ minimizes $|x|$.",
      connects: "Subgradients replace a missing derivative with all slopes that support the convex graph."
    },
    practice: [
      { problem: "Find a subgradient of $f(x)=|x|$ at $x=3$.", steps: [
        { do: "Note the point is positive", result: "$3>0$", why: "absolute value is smooth away from zero" },
        { do: "Write the local formula", result: "$|x|=x$ near $3$", why: "positive inputs keep their sign" },
        { do: "Differentiate", result: "$f'(3)=1$", why: "derivative of $x$ is 1" },
        { do: "Use differentiable rule", result: "$\\partial f(3)=\\{1\\}$", why: "subdifferential is singleton when differentiable" },
        { do: "State one subgradient", result: "$g=1$", why: "the only choice" }
      ], answer: "The subgradient set is $\\{1\\}$, so one subgradient is $1$." },
      { problem: "Find a subgradient of $f(x)=|x|$ at $x=-2$.", steps: [
        { do: "Note the point is negative", result: "$-2<0$", why: "use the left branch" },
        { do: "Write the local formula", result: "$|x|=-x$ near $-2$", why: "negative inputs are negated" },
        { do: "Differentiate", result: "$f'(-2)=-1$", why: "derivative of $-x$ is $-1$" },
        { do: "Use differentiable rule", result: "$\\partial f(-2)=\\{-1\\}$", why: "smooth point" },
        { do: "State one subgradient", result: "$g=-1$", why: "the only subgradient there" }
      ], answer: "The subgradient set is $\\{-1\\}$." },
      { problem: "For $f(x)=\\max(x,0)$, find $\\partial f(0)$.", steps: [
        { do: "Identify the left slope", result: "$0$", why: "for $x<0$, $f(x)=0$" },
        { do: "Identify the right slope", result: "$1$", why: "for $x>0$, $f(x)=x$" },
        { do: "Use convex corner rule", result: "$\\partial f(0)=[0,1]$", why: "supporting slopes lie between side slopes" },
        { do: "Check a middle slope", result: "$g=0.5$", why: "the line $0.5y$ stays below ReLU" },
        { do: "Check optimality", result: "$0\\in[0,1]$", why: "zero is a valid subgradient" }
      ], answer: "$\\partial f(0)=[0,1]$." },
      { problem: "For $f(x)=|x|+2x$, find whether $x=0$ is optimal.", steps: [
        { do: "Find subdifferential of $|x|$ at 0", result: "[-1,1]", why: "absolute-value corner" },
        { do: "Find derivative of $2x$", result: "$2$", why: "linear term slope" },
        { do: "Add subdifferentials", result: "$\\partial f(0)=[1,3]$", why: "add 2 to every slope in $[-1,1]$" },
        { do: "Check for zero", result: "$0\\notin[1,3]$", why: "optimality requires zero subgradient" },
        { do: "Conclude", result: "not optimal", why: "there is still a descent direction" }
      ], answer: "$x=0$ is not optimal for $|x|+2x$." },
      { problem: "For $f(w)=|w|+0.5(w-2)^2$, compute $\\partial f(0)$ and decide if $0$ is optimal.", steps: [
        { do: "Subdifferentiate $|w|$ at 0", result: "[-1,1]", why: "corner at zero" },
        { do: "Differentiate the quadratic", result: "$w-2$", why: "derivative of $0.5(w-2)^2$" },
        { do: "Evaluate quadratic derivative at 0", result: "$-2$", why: "substitute $w=0$" },
        { do: "Add the pieces", result: "$\\partial f(0)=[-3,-1]$", why: "shift $[-1,1]$ by $-2$" },
        { do: "Check optimality", result: "$0\\notin[-3,-1]$", why: "zero is not a possible subgradient" }
      ], answer: "$\\partial f(0)=[-3,-1]$, so $0$ is not optimal." }
    ],
    applications: [
      { title: "L1 regularization", background: "Lasso and sparse models use $||w||_1$, which has corners at zero. Subgradients explain why exact zeros can be optimal.", numbers: "For one weight, $\\partial |0|=[-1,1]$; if the data gradient is $0.3$ and penalty $\\lambda=0.5$, zero can balance it because $-0.3/0.5=-0.6$." },
      { title: "ReLU networks", background: "ReLU is not differentiable at zero, but training frameworks choose a valid convention such as subgradient $0$ or $1$.", numbers: "For $r(x)=\\max(0,x)$, slopes are $0$ left, $1$ right, and $\\partial r(0)=[0,1]$." },
      { title: "Hinge loss", background: "Support vector machines use hinge loss, a convex loss with a kink at the margin.", numbers: "$L(m)=\\max(0,1-m)$ has slope $-1$ when $m<1$, slope $0$ when $m>1$, and subgradients $[-1,0]$ at $m=1$." },
      { title: "Quantile regression", background: "Quantile loss uses asymmetric absolute-value-like penalties, so subgradients handle the kink at zero residual.", numbers: "For median loss $|r|$, residual $r=0$ has subgradient interval $[-1,1]$." },
      { title: "Robust optimization", background: "Absolute deviations are less sensitive to outliers than squared errors, but they require nonsmooth calculus.", numbers: "Errors $1,-1,10$ give absolute loss $12$ and squared loss $102$, showing why robust losses matter." },
      { title: "Optimality certificates", background: "For convex nonsmooth objectives, checking $0\\in\\partial f(x)$ certifies a global minimum.", numbers: "If $\\partial f(2)=[-0.1,0.3]$, then $0$ lies inside, so $2$ is optimal for convex $f$." }
    ],
    applicationsClose: "Subgradients let corners participate in optimization without pretending the corner has only one slope.",
    takeaways: ["A subgradient defines a supporting affine lower bound for a convex function.", "At smooth points, the subdifferential contains only the ordinary gradient.", "At convex corners, there may be an interval or set of subgradients.", "For unconstrained convex nonsmooth minimization, $0\\in\\partial f(x^\\ast)$ is the optimality condition."]
  },

  "math-22-11": {
    id: "math-22-11",
    title: "Nonsmooth optimization",
    tagline: "Nonsmooth optimization trains objectives with corners by using valid descent information instead of ordinary gradients everywhere.",
    connections: {
      buildsOn: ["Subgradients", "Convex functions", "Gradient descent", "Optimization problem formulations"],
      leadsTo: ["Proximal methods", "Stochastic gradient descent (SGD)", "regularized learning"],
      usedWith: ["hinge loss", "absolute loss", "piecewise linear functions", "step-size schedules"]
    },
    motivation:
      "<p>Many useful losses are not smooth. Absolute error has a corner at zero, hinge loss has a corner at the margin, and L1 regularization has corners whenever a weight is zero.</p>" +
      "<p>Nonsmooth optimization accepts that reality. It uses subgradients, proximal steps, or smoothing to make progress even when the ordinary derivative is missing at important points.</p>",
    definition:
      "<p>A basic subgradient method for convex nonsmooth $f$ uses $x_{k+1}=x_k-\\alpha_k g_k$ with $g_k\\in\\partial f(x_k)$. Unlike smooth gradient descent, a subgradient need not point in the steepest descent direction, and objective values may not decrease every step.</p>" +
      "<p>Convergence often requires diminishing step sizes such as $\\alpha_k=a/\\sqrt{k}$. The method is robust and simple, but slower than smooth gradient descent. This is why proximal methods are often preferred when the nonsmooth part has useful structure.</p>" +
      "<p><b>Assumptions that matter:</b> convex guarantees require convex objectives and bounded subgradients; constant step sizes may leave a neighborhood rather than converge exactly; and nonconvex nonsmooth problems need more careful stationarity notions.</p>",
    worked: {
      problem: "Run two subgradient steps on $f(x)=|x|$ from $x_0=2$ using $\\alpha_1=1$ and $\\alpha_2=0.5$.",
      skills: ["subgradient method", "absolute value", "step sizes"],
      strategy: "Choose the natural subgradient sign away from zero and update like gradient descent.",
      steps: [
        { do: "Choose a subgradient at $x_0=2$", result: "$g_1=1$", why: "$|x|$ has slope 1 for positive $x$" },
        { do: "Take the first step", result: "$x_1=2-1\\cdot1=1$", why: "subgradient update" },
        { do: "Choose a subgradient at $x_1=1$", result: "$g_2=1$", why: "still on the positive side" },
        { do: "Take the second step", result: "$x_2=1-0.5\\cdot1=0.5$", why: "use the smaller step size" },
        { do: "Compute losses", result: "$f(2)=2$, $f(1)=1$, $f(0.5)=0.5$", why: "absolute value gives distance from zero" }
      ],
      verify: "The iterates move toward the minimizer $0$, and the chosen step sizes do not cross it yet.",
      answer: "$x_1=1$ and $x_2=0.5$.",
      connects: "Subgradient methods extend the gradient-descent loop to convex objectives with corners."
    },
    practice: [
      { problem: "For $f(x)=|x-3|$, choose a subgradient at $x=5$ and take a step with $\\alpha=0.4$.", steps: [
        { do: "Determine the side", result: "$5-3>0$", why: "the point is right of the kink" },
        { do: "Choose subgradient", result: "$g=1$", why: "absolute value slope is positive on the right" },
        { do: "Scale the subgradient", result: "$0.4\\cdot1=0.4$", why: "step size times subgradient" },
        { do: "Update", result: "$x_{new}=5-0.4=4.6$", why: "move left toward 3" },
        { do: "Check loss", result: "$|4.6-3|=1.6$", why: "loss decreased from 2" }
      ], answer: "A valid step gives $x_{new}=4.6$." },
      { problem: "For hinge loss $L(m)=\\max(0,1-m)$, choose a subgradient at $m=0.2$.", steps: [
        { do: "Compare to margin", result: "$0.2<1$", why: "the example violates the margin" },
        { do: "Select the active branch", result: "$L(m)=1-m$", why: "this branch is larger than 0" },
        { do: "Differentiate the branch", result: "$-1$", why: "slope of $1-m$" },
        { do: "State subgradient", result: "$g=-1$", why: "away from the kink the subgradient is ordinary slope" },
        { do: "Interpret", result: "increasing $m$ lowers loss", why: "negative slope means move $m$ upward" }
      ], answer: "A subgradient is $-1$." },
      { problem: "For $L(m)=\\max(0,1-m)$, find the subdifferential at $m=1$.", steps: [
        { do: "Find the left slope", result: "$-1$", why: "for $m<1$, $L=1-m$" },
        { do: "Find the right slope", result: "$0$", why: "for $m>1$, $L=0$" },
        { do: "Use convex corner rule", result: "$\\partial L(1)=[-1,0]$", why: "valid supporting slopes lie between side slopes" },
        { do: "Check zero", result: "$0\\in[-1,0]$", why: "flat branch begins at the margin" },
        { do: "Interpret", result: "any slope from $-1$ to $0$ is valid", why: "the kink has many subgradients" }
      ], answer: "$\\partial L(1)=[-1,0]$." },
      { problem: "Use a diminishing schedule $\\alpha_k=1/\\sqrt{k}$. Compute $\\alpha_1$, $\\alpha_4$, and $\\alpha_{25}$.", steps: [
        { do: "Compute $\\alpha_1$", result: "$1/\\sqrt1=1$", why: "first step" },
        { do: "Compute $\\sqrt4$", result: "$2$", why: "needed for $k=4$" },
        { do: "Compute $\\alpha_4$", result: "$1/2=0.5$", why: "use the schedule" },
        { do: "Compute $\\sqrt{25}$", result: "$5$", why: "needed for $k=25$" },
        { do: "Compute $\\alpha_{25}$", result: "$1/5=0.2$", why: "steps shrink over time" }
      ], answer: "$\\alpha_1=1$, $\\alpha_4=0.5$, and $\\alpha_{25}=0.2$." },
      { problem: "For $f(w)=|w|+0.1w^2$, take one subgradient step from $w=2$ with $\\alpha=0.5$.", steps: [
        { do: "Subgradient of $|w|$ at 2", result: "$1$", why: "positive side" },
        { do: "Gradient of $0.1w^2$", result: "$0.2w$", why: "differentiate the smooth term" },
        { do: "Evaluate smooth gradient", result: "$0.2\\cdot2=0.4$", why: "substitute current weight" },
        { do: "Add subgradient pieces", result: "$g=1.4$", why: "sum rule" },
        { do: "Update", result: "$w_{new}=2-0.5\\cdot1.4=1.3$", why: "subgradient step" }
      ], answer: "The new weight is $1.3$." }
    ],
    applications: [
      { title: "Support vector machines", background: "Classic SVM training uses hinge loss, which is convex and nonsmooth at the margin.", numbers: "For margin $m=0.3$, hinge loss is $1-0.3=0.7$ and subgradient with respect to $m$ is $-1$." },
      { title: "Sparse learning", background: "L1 penalties encourage exact zeros, but the objective is nonsmooth at zero, requiring subgradient or proximal ideas.", numbers: "Penalty $0.05|w|$ contributes subgradient in $[-0.05,0.05]$ at $w=0$." },
      { title: "Robust absolute loss", background: "Least absolute deviations reduce outlier influence compared with squared loss.", numbers: "Residuals $1,1,20$ give absolute loss $22$ but squared loss $402$, so the outlier dominates less with absolute loss." },
      { title: "Quantile forecasting", background: "Pinball loss trains conditional quantiles and is nonsmooth at zero residual.", numbers: "For quantile $0.9$ and residual $2$, loss is $0.9\\cdot2=1.8$; for residual $-2$, loss is $0.1\\cdot2=0.2$." },
      { title: "Max losses", background: "Objectives that take a maximum over cases are often nonsmooth where two cases tie.", numbers: "For $f(x)=\\max(x,2-x)$, the branches tie at $x=1$, with value $1$ and subgradients between $-1$ and $1$." },
      { title: "Step-size decay", background: "Subgradient methods often need diminishing steps because directions can be less informative than smooth gradients.", numbers: "The schedule $1/\\sqrt{k}$ moves from $1$ at $k=1$ to $0.1$ at $k=100$." }
    ],
    applicationsClose: "Nonsmooth optimization is the craft of making reliable progress when useful objectives have corners.",
    takeaways: ["Subgradient methods use $x_{k+1}=x_k-\\alpha_k g_k$ with $g_k\\in\\partial f(x_k)$.", "Nonsmooth objective values may not decrease every iteration.", "Diminishing step sizes are common for convergence guarantees.", "Hinge loss, absolute loss, max losses, and L1 penalties are central nonsmooth examples."]
  },

  "math-22-12": {
    id: "math-22-12",
    title: "Proximal methods",
    tagline: "Proximal methods handle nonsmooth penalties by solving a small denoising-like problem at each step.",
    connections: {
      buildsOn: ["Nonsmooth optimization", "Subgradients", "Gradient descent", "Convex functions"],
      leadsTo: ["Stochastic gradient descent (SGD)", "regularized empirical risk", "operator splitting"],
      usedWith: ["soft thresholding", "L1 regularization", "projection", "composite objectives"]
    },
    motivation:
      "<p>Subgradient steps work, but for structured nonsmooth terms they can feel blunt. L1 regularization, for example, has a special ability to set weights exactly to zero.</p>" +
      "<p>Proximal methods use that structure directly. They take a gradient step on the smooth part, then apply a proximal operator that knows how to handle the nonsmooth part cleanly.</p>",
    definition:
      "<p>For a function $h$, the <b>proximal operator</b> is $\\operatorname{prox}_{\\alpha h}(z)=\\arg\\min_x \\left(h(x)+\\dfrac{1}{2\\alpha}||x-z||^2\\right)$. It balances making $h(x)$ small with staying near $z$.</p>" +
      "<p>For a composite objective $F(x)=g(x)+h(x)$ with smooth $g$ and possibly nonsmooth $h$, proximal gradient uses $z_k=x_k-\\alpha\\nabla g(x_k)$ and $x_{k+1}=\\operatorname{prox}_{\\alpha h}(z_k)$. For $h(x)=\\lambda |x|$, the prox is soft thresholding: $\\operatorname{sign}(z)\\max(|z|-\\alpha\\lambda,0)$.</p>" +
      "<p><b>Assumptions that matter:</b> prox steps are useful when the proximal operator is easy to compute; convergence guarantees often need convexity and smoothness of $g$; and projections are prox operators of constraint indicators.</p>",
    worked: {
      problem: "Compute the proximal step for $h(w)=0.5|w|$, $z=3$, and $\\alpha=1$.",
      skills: ["proximal operator", "soft thresholding", "L1 penalty"],
      strategy: "Use soft thresholding with threshold $\\alpha\\lambda$.",
      steps: [
        { do: "Identify $\\lambda$", result: "$\\lambda=0.5$", why: "the penalty is $0.5|w|$" },
        { do: "Compute the threshold", result: "$\\alpha\\lambda=1\\cdot0.5=0.5$", why: "soft threshold uses step size times penalty" },
        { do: "Compute the magnitude after shrinkage", result: "$|3|-0.5=2.5$", why: "subtract the threshold" },
        { do: "Keep the sign", result: "$\\operatorname{sign}(3)=1$", why: "positive input stays positive" },
        { do: "Apply soft thresholding", result: "$1\\cdot2.5=2.5$", why: "multiply sign by shrunken magnitude" }
      ],
      verify: "The result is closer to zero than $z=3$ but not zero, exactly what an L1 prox should do for a large coefficient.",
      answer: "$\\operatorname{prox}_{|\\cdot|/2}(3)=2.5$ for this step size.",
      connects: "The prox step performs the nonsmooth regularization exactly for this small subproblem."
    },
    practice: [
      { problem: "Soft-threshold $z=0.3$ with threshold $0.5$.", steps: [
        { do: "Compute the magnitude", result: "$|0.3|=0.3$", why: "soft threshold depends on magnitude" },
        { do: "Subtract threshold", result: "$0.3-0.5=-0.2$", why: "the coefficient is smaller than the threshold" },
        { do: "Apply nonnegative part", result: "$\\max(-0.2,0)=0$", why: "negative shrinkage becomes zero" },
        { do: "Keep sign if needed", result: "$0$", why: "zero has no sign effect" },
        { do: "Interpret", result: "coefficient is killed", why: "L1 prox creates sparsity" }
      ], answer: "The soft-thresholded value is $0$." },
      { problem: "Soft-threshold $z=-2$ with threshold $0.5$.", steps: [
        { do: "Compute magnitude", result: "$|-2|=2$", why: "use absolute value" },
        { do: "Subtract threshold", result: "$2-0.5=1.5$", why: "shrink toward zero" },
        { do: "Find sign", result: "$\\operatorname{sign}(-2)=-1$", why: "restore direction" },
        { do: "Multiply", result: "$-1\\cdot1.5=-1.5$", why: "signed shrunken magnitude" },
        { do: "Compare to input", result: "moved from $-2$ to $-1.5$", why: "closer to zero" }
      ], answer: "The result is $-1.5$." },
      { problem: "For $g(w)=0.5(w-4)^2$ and $h(w)=|w|$, start at $w=0$ with $\\alpha=0.5$. Compute one proximal-gradient step.", steps: [
        { do: "Compute smooth gradient", result: "$g'(w)=w-4$", why: "derivative of the quadratic" },
        { do: "Evaluate at $w=0$", result: "$g'(0)=-4$", why: "current point" },
        { do: "Take gradient step", result: "$z=0-0.5(-4)=2$", why: "step on smooth part" },
        { do: "Compute threshold", result: "$\\alpha\\lambda=0.5\\cdot1=0.5$", why: "penalty coefficient is 1" },
        { do: "Soft-threshold", result: "$2-0.5=1.5$", why: "positive $z$ shrinks by threshold" }
      ], answer: "The next iterate is $w_1=1.5$." },
      { problem: "Projection as prox: project $z=7$ onto the interval $[0,5]$.", steps: [
        { do: "Check lower bound", result: "$7\\ge0$", why: "no need to raise it" },
        { do: "Check upper bound", result: "$7>5$", why: "the point exceeds the interval" },
        { do: "Choose nearest feasible point", result: "$5$", why: "projection minimizes distance to $z$" },
        { do: "Compute distance", result: "$|7-5|=2$", why: "nearest endpoint distance" },
        { do: "State projection", result: "$\\Pi_{[0,5]}(7)=5$", why: "constraint indicator prox is projection" }
      ], answer: "The projection is $5$." },
      { problem: "Apply soft thresholding with threshold $0.2$ to vector $z=[0.1,-0.5,2]$ coordinatewise.", steps: [
        { do: "Threshold first coordinate", result: "$0$", why: "$0.1<0.2$" },
        { do: "Threshold second magnitude", result: "$0.5-0.2=0.3$", why: "shrink magnitude" },
        { do: "Restore second sign", result: "$-0.3$", why: "original coordinate was negative" },
        { do: "Threshold third coordinate", result: "$2-0.2=1.8$", why: "positive coordinate shrinks" },
        { do: "Assemble vector", result: "$[0,-0.3,1.8]$", why: "apply prox coordinatewise for L1" }
      ], answer: "The result is $[0,-0.3,1.8]$." }
    ],
    applications: [
      { title: "Sparse linear models", background: "Proximal gradient is a natural solver for Lasso because the L1 prox is soft thresholding.", numbers: "With $z=[0.1,0.8]$ and threshold $0.3$, the prox gives $[0,0.5]$, creating one exact zero." },
      { title: "Projected gradient descent", background: "Projection is a proximal operator for constraints, so constrained optimization fits the same template.", numbers: "A probability $1.2$ projected onto $[0,1]$ becomes $1$, while $0.7$ stays $0.7$." },
      { title: "Image denoising", background: "Proximal operators can be viewed as denoisers balancing fidelity to an input and preference for structure.", numbers: "If a pixel-like coefficient $0.12$ is below threshold $0.2$, soft thresholding sets it to $0$." },
      { title: "Composite objectives", background: "Many objectives split into smooth data fit plus nonsmooth regularizer. Proximal gradient handles each part with the right tool.", numbers: "If smooth step gives $z=4$ and L1 threshold is $0.6$, the next coefficient is $3.4$." },
      { title: "Neural network pruning", background: "Sparsity-inducing penalties can push small weights exactly to zero, supporting compression.", numbers: "Weights $[0.02,0.5]$ with threshold $0.05$ become $[0,0.45]$." },
      { title: "Constraints as penalties", background: "The indicator of a feasible set is zero inside and infinite outside; its prox is projection onto that set.", numbers: "Projecting $[-0.2,0.6,1.4]$ onto the box $[0,1]^3$ gives $[0,0.6,1]$." }
    ],
    applicationsClose: "Proximal methods succeed by respecting structure: smooth parts get gradients, nonsmooth parts get their own exact little solver.",
    takeaways: ["A proximal operator minimizes a penalty plus a squared-distance term.", "Proximal gradient handles $g+h$ by a gradient step on $g$ followed by a prox for $h$.", "L1 prox is soft thresholding, which can create exact zeros.", "Projection is the prox operator for a constraint indicator."]
  },

  "math-22-13": {
    id: "math-22-13",
    title: "Stochastic gradient descent (SGD)",
    tagline: "SGD trains on noisy gradient estimates, trading exactness for speed and scale.",
    connections: {
      buildsOn: ["Gradient descent", "Convergence rates", "probability", "Optimization problem formulations"],
      leadsTo: ["adaptive optimizers", "generalization", "large-scale ML training"],
      usedWith: ["mini-batches", "unbiased estimators", "learning-rate schedules", "variance"]
    },
    motivation:
      "<p>Full gradient descent asks every training example for its opinion before taking one step. That is careful, but with millions of examples it can be painfully expensive.</p>" +
      "<p><b>Stochastic gradient descent</b> uses one example or a small mini-batch to estimate the full gradient. The estimate is noisy, but it is cheap enough to take many steps, which is why SGD became a foundation of modern ML training.</p>",
    definition:
      "<p>If the empirical loss is $F(w)=\\dfrac1n\\sum_{i=1}^n \\ell_i(w)$, the full gradient is $\\nabla F(w)=\\dfrac1n\\sum_i \\nabla \\ell_i(w)$. SGD samples an index or mini-batch $B_k$ and updates $w_{k+1}=w_k-\\alpha_k \\dfrac1{|B_k|}\\sum_{i\\in B_k}\\nabla \\ell_i(w_k)$.</p>" +
      "<p>When the batch is sampled uniformly, the mini-batch gradient is an unbiased estimate of the full gradient. Larger batches reduce variance but cost more per step. Learning-rate schedules are important because persistent noise can keep the iterates bouncing around an optimum.</p>" +
      "<p><b>Assumptions that matter:</b> unbiasedness depends on sampling; data order and replacement choices matter in practice; stochastic convergence usually needs step-size control; and the noisy path can help exploration but also destabilize training.</p>",
    worked: {
      problem: "A dataset has per-example gradients $g_1=2$, $g_2=4$, $g_3=-1$, $g_4=3$ at the current weight. Compute the full gradient and one mini-batch gradient using examples $2$ and $4$.",
      skills: ["full gradients", "mini-batches", "averages"],
      strategy: "Average all gradients for the full gradient, then average the sampled gradients for the mini-batch estimate.",
      steps: [
        { do: "Add all gradients", result: "$2+4-1+3=8$", why: "full gradient sums every example" },
        { do: "Divide by number of examples", result: "$8/4=2$", why: "empirical loss uses the average" },
        { do: "Select mini-batch gradients", result: "$4$ and $3$", why: "examples 2 and 4 are sampled" },
        { do: "Add mini-batch gradients", result: "$4+3=7$", why: "batch estimate uses sampled examples" },
        { do: "Average the mini-batch", result: "$7/2=3.5$", why: "two examples in the batch" }
      ],
      verify: "The mini-batch gradient is not equal to the full gradient for this sample, but across random batches it can average out correctly.",
      answer: "The full gradient is $2$; the mini-batch estimate from examples 2 and 4 is $3.5$.",
      connects: "SGD replaces the exact gradient with a cheaper random estimate."
    },
    practice: [
      { problem: "Using the mini-batch gradient $3.5$, current weight $w=10$, and $\\alpha=0.1$, compute one SGD update.", steps: [
        { do: "Scale the gradient", result: "$0.1\\cdot3.5=0.35$", why: "learning rate times gradient estimate" },
        { do: "Write the update", result: "$w_{new}=10-0.35$", why: "SGD subtracts the estimated gradient" },
        { do: "Simplify", result: "$w_{new}=9.65$", why: "subtract the step" },
        { do: "Interpret direction", result: "weight decreases", why: "the estimated gradient is positive" },
        { do: "Name the estimate", result: "stochastic step", why: "it used a mini-batch, not all data" }
      ], answer: "$w_{new}=9.65$." },
      { problem: "Gradients in a batch are $[-2,1,5]$. Compute the mini-batch gradient.", steps: [
        { do: "Count examples", result: "$3$", why: "three gradients are listed" },
        { do: "Add gradients", result: "$-2+1+5=4$", why: "sum the batch" },
        { do: "Divide by batch size", result: "$4/3$", why: "average the gradients" },
        { do: "Approximate", result: "$1.333$", why: "decimal form" },
        { do: "Interpret sign", result: "positive average", why: "the update will decrease the parameter" }
      ], answer: "The mini-batch gradient is $4/3\\approx1.333$." },
      { problem: "A full gradient is the average of $[1,3,5,7]$. If one example is sampled uniformly, what is the expected sampled gradient?", steps: [
        { do: "Add all gradients", result: "$1+3+5+7=16$", why: "sum possible sampled values" },
        { do: "Divide by four", result: "$16/4=4$", why: "uniform expectation is the average" },
        { do: "Compute full gradient", result: "$4$", why: "empirical gradient is also the average" },
        { do: "Compare", result: "expected sample equals full gradient", why: "uniform single-sample gradient is unbiased" },
        { do: "State implication", result: "unbiased estimate", why: "noise averages out in expectation" }
      ], answer: "The expected sampled gradient is $4$, equal to the full gradient." },
      { problem: "Learning rate decays as $\\alpha_k=0.2/\\sqrt{k}$. Compute $\\alpha_1$, $\\alpha_4$, and $\\alpha_{100}$.", steps: [
        { do: "Compute $\\alpha_1$", result: "$0.2/1=0.2$", why: "$\\sqrt1=1$" },
        { do: "Compute $\\alpha_4$", result: "$0.2/2=0.1$", why: "$\\sqrt4=2$" },
        { do: "Compute $\\sqrt{100}$", result: "$10$", why: "needed for the last step" },
        { do: "Compute $\\alpha_{100}$", result: "$0.2/10=0.02$", why: "apply the schedule" },
        { do: "Interpret", result: "steps shrink over time", why: "noise should have less effect near a solution" }
      ], answer: "$0.2$, $0.1$, and $0.02$." },
      { problem: "Two mini-batch gradients for the same point are $6$ and $-2$. Average them and compare to using either one alone.", steps: [
        { do: "Add the two estimates", result: "$6+(-2)=4$", why: "combine independent noisy estimates" },
        { do: "Divide by two", result: "$4/2=2$", why: "average the estimates" },
        { do: "Compare to first estimate", result: "$2$ is $4$ lower than $6$", why: "averaging reduces extreme noise" },
        { do: "Compare to second estimate", result: "$2$ is $4$ higher than $-2$", why: "it balances the signs" },
        { do: "Interpret as larger batch", result: "less variable estimate", why: "more samples reduce variance" }
      ], answer: "The average estimate is $2$, less extreme than either noisy mini-batch alone." }
    ],
    applications: [
      { title: "Large-scale neural network training", background: "SGD and its variants made it practical to train on datasets too large for full gradients at every step.", numbers: "With $1,000,000$ examples and batch size $100$, one step reads $0.01%$ of the data." },
      { title: "Mini-batch parallelism", background: "GPUs process batches efficiently, so mini-batch SGD balances statistical noise and hardware throughput.", numbers: "Batch size $256$ with per-example gradient vectors of length $1000$ averages $256,000$ gradient components per step." },
      { title: "Noise and generalization", background: "SGD noise can bias training toward flatter regions, which is one reason practitioners study batch size and learning rate together.", numbers: "A gradient estimate fluctuating between $0.8$ and $1.2$ has mean about $1.0$ but injects step noise of size $0.2\\alpha$." },
      { title: "Online learning", background: "In streaming settings, examples arrive one at a time, so stochastic updates are natural.", numbers: "If a new example gives gradient $-0.7$ and $\\alpha=0.05$, the immediate update is $+0.035$." },
      { title: "Epoch accounting", background: "Training progress is often measured in epochs, meaning passes through the dataset, because SGD uses partial data per step.", numbers: "With $50,000$ examples and batch size $100$, one epoch contains $500$ mini-batch steps." },
      { title: "Learning-rate warmup and decay", background: "Noisy stochastic training often starts cautiously, then decays the learning rate to settle.", numbers: "A schedule from $0.001$ to $0.01$ over $1000$ steps increases by about $0.000009$ per step if linear." }
    ],
    applicationsClose: "SGD is optimization scaled to data: each noisy step is imperfect, but many cheap steps can train enormous models.",
    takeaways: ["SGD uses a sampled gradient estimate instead of the full gradient.", "Uniform mini-batch gradients can be unbiased estimates of the empirical gradient.", "Larger batches reduce variance but cost more per step.", "Learning-rate schedules are central because stochastic noise persists near optima."]
  }
};
