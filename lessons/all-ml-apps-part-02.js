/* All ML — Part 02 applications (5 each). Loaded after content-part-02.js, before all-ml-register.js. */

/* ---- _apps-part02-A.js ---- */
/* All ML — Part 02 Optimization applications, topics 2.1–2.6. */

(window.ALLML_CONTENT["2.1"] = window.ALLML_CONTENT["2.1"] || {}).applications = [
  { title: "Portfolio allocation", background: "<p>Portfolio weights are convex combinations, so a blended allocation stays feasible when the original allocations obey the same budget rules.</p>", numbers: "<p>Using the lesson points $x=(0,0)$, $y=(2,1)$, and $\\lambda=0.25$, the blend is $0.25x+0.75y=(1.5,0.75)$, which remains inside the illustrative box $[0,2]^2$.</p>" },
  { title: "Model ensembling", background: "<p>Ensembles often average predictions because convex losses make the averaged prediction safe to evaluate with Jensen's inequality.</p>", numbers: "<p>The lesson average is $0.25\\cdot1+0.75\\cdot3=2.5$; for $f(x)=x^2$, $f(2.5)=6.25\\le0.25\\cdot1+0.75\\cdot9=7$.</p>" },
  { title: "Ad delivery budget pacing", background: "<p>Budget pacing systems interpolate between bid or spend settings during rollout, so convex feasible boxes are useful guardrails.</p>", numbers: "<p>The same point $(1.5,0.75)$ satisfies $0\\le1.5\\le2$ and $0\\le0.75\\le2$, so interpolation has not left the illustrative allowed bid box.</p>" },
  { title: "Risk penalty design", background: "<p>Squared risk penalties are convex, which makes mixtures easier to audit than penalties with hidden local valleys.</p>", numbers: "<p>The lesson chord calculation compares $6.25$ with $7.00$; the gap $7.00-6.25=0.75$ is the Jensen safety margin for those chosen endpoints.</p>" },
  { title: "Feasible-set QA", background: "<p>Constraint QA should test midpoint behavior, not only whether a feasible region is connected.</p>", numbers: "<p>For an illustrative annulus, opposite feasible points $(1,0)$ and $(-1,0)$ have midpoint $(0,0)$ in the hole, so the convex-combination test fails.</p>" }
];

(window.ALLML_CONTENT["2.2"] = window.ALLML_CONTENT["2.2"] || {}).applications = [
  { title: "Logistic-regression training", background: "<p>Convex classifiers use stationarity and curvature checks to verify whether an optimizer has reached the bottom of the loss.</p>", numbers: "<p>For the lesson function $(x-1)^2+2$, $f'(1)=0$, $f''(1)=2\\gt0$, and $f(1)=2$, which certificates a strict local minimum.</p>" },
  { title: "Neural-net loss diagnosis", background: "<p>Nonconvex neural losses can have stationary points that are saddles or maxima rather than useful solutions.</p>", numbers: "<p>For $f(x)=-x^2$, the lesson has $f'(0)=0$ but $f''(0)=-2\\lt0$ and $f(1)=-1\\lt f(0)=0$, so the stationary point is a maximum.</p>" },
  { title: "Hyperparameter response curves", background: "<p>Validation curves can look flat near a candidate setting, but flatness alone is not enough to choose it.</p>", numbers: "<p>An illustrative tolerance $|\\nabla f|\\lt10^{-3}$ would pass a tiny-gradient point; the lesson warns that curvature must also be checked.</p>" },
  { title: "Calibration threshold tuning", background: "<p>Threshold tuning often reduces to a one-dimensional objective where second-derivative signs are easy to audit.</p>", numbers: "<p>The lesson's positive curvature value is $2$, so the local quadratic model opens upward at the accepted threshold.</p>" },
  { title: "Simulator parameter fitting", background: "<p>Physical or business simulators can produce response surfaces with hilltops that fool first-order stopping rules.</p>", numbers: "<p>The lesson hilltop has $f''(0)=-2$, so accepting only because $f'(0)=0$ would choose a maximum, not a fitted minimum.</p>" }
];

(window.ALLML_CONTENT["2.3"] = window.ALLML_CONTENT["2.3"] || {}).applications = [
  { title: "Linear and logistic models", background: "<p>First-order solvers for linear and logistic models repeatedly apply the same gradient-descent update.</p>", numbers: "<p>With $x_0=0$, $\\eta=0.1$, and gradient $-6$, the lesson update gives $x_1=0-0.1(-6)=0.6$.</p>" },
  { title: "Deep-learning training", background: "<p>Every minibatch update in a neural network is still the same local descent rule applied to many parameters.</p>", numbers: "<p>On the lesson quadratic, the loss drops from $f(0)=9$ to $f(0.6)=(0.6-3)^2=5.76$ after one step.</p>" },
  { title: "Feature-scaling checks", background: "<p>Rescaling inputs rescales gradients, so an apparently reasonable learning rate can become unsafe.</p>", numbers: "<p>For curvature $L=2$, the lesson safe constant-step interval is $0\\lt\\eta\\lt1$; choosing outside it can flip contraction into growth.</p>" },
  { title: "Production retraining monitors", background: "<p>Training monitors often track error contraction to detect a bad step size before full divergence.</p>", numbers: "<p>With $\\eta=0.2$, the lesson error multiplier is $1-2\\eta=0.6$, so an initial error magnitude $3$ becomes $3\\cdot0.6^{20}=0.0001097$ after 20 steps.</p>" },
  { title: "AutoML optimizer baselines", background: "<p>Fancy optimizers should be compared with vanilla gradient descent on the same objective and budget.</p>", numbers: "<p>An illustrative 20-step budget uses the same $3\\cdot0.6^{20}$ calculation, giving a concrete baseline error before changing methods.</p>" }
];

(window.ALLML_CONTENT["2.4"] = window.ALLML_CONTENT["2.4"] || {}).applications = [
  { title: "Safe Newton training", background: "<p>Newton and quasi-Newton solvers often need backtracking because the full curvature step can be too aggressive.</p>", numbers: "<p>For $f(x)=(x-2)^2$, $x=0$, $p=4$, and $c=0.5$, the lesson rejects $\\alpha=1$ because the Armijo right side is $4+0.5\\cdot1\\cdot(-16)=-4$ while $f(4)=4$.</p>" },
  { title: "Reinforcement-learning policy updates", background: "<p>Policy updates use trust-region ideas to avoid moving too far from the policy that generated the data.</p>", numbers: "<p>An illustrative trust radius $\\Delta=0.1$ means a proposed parameter step with norm $0.25$ must be clipped or rejected before evaluation.</p>" },
  { title: "Ads bid-model calibration", background: "<p>Bid calibration needs sufficient decrease so a tiny accidental improvement does not consume training budget.</p>", numbers: "<p>The same Armijo check accepts $\\alpha=0.5$ because $f(2)=0$ and the right side is $4+0.5\\cdot0.5\\cdot(-16)=0$.</p>" },
  { title: "Scientific simulation fitting", background: "<p>Simulation objectives often trust a local model only when actual reduction matches predicted reduction.</p>", numbers: "<p>If predicted reduction is $0.60$ and actual reduction is $0.61$, the lesson ratio is $\\rho=0.61/0.60=1.017$, a strong agreement signal.</p>" },
  { title: "Large-scale recommender updates", background: "<p>Damped steps protect recommender retraining from parameter jumps that could spike validation metrics.</p>", numbers: "<p>The accepted lesson half-step moves from $x=0$ to $x=2$ and reaches $f(2)=0$ from the starting value $f(0)=4$.</p>" }
];

(window.ALLML_CONTENT["2.5"] = window.ALLML_CONTENT["2.5"] || {}).applications = [
  { title: "Logistic-regression solvers", background: "<p>Medium-scale logistic regression commonly uses Newton, BFGS, or L-BFGS because curvature speeds convergence.</p>", numbers: "<p>For $H=\\begin{bmatrix}4&1\\\\1&3\\end{bmatrix}$ and $b=(1,2)$, the lesson Newton solve gives $s=H^{-1}b=(0.090909,0.636364)$ in one quadratic step.</p>" },
  { title: "Conditional random fields", background: "<p>Quasi-Newton methods reduce dense Hessian storage by learning curvature from recent parameter and gradient differences.</p>", numbers: "<p>With lesson vectors $s=(1,2)$ and $y=(3,5)$, the curvature check is $s^Ty=1\\cdot3+2\\cdot5=13\\gt0$.</p>" },
  { title: "Hyperparameter objective polishing", background: "<p>After a coarse search, second-order polishing can exploit local curvature around the best hyperparameter setting.</p>", numbers: "<p>The lesson optimum for the 2-D bowl is $(0.090909,0.636364)$, matching the Newton solve rather than many fixed gradient steps.</p>" },
  { title: "Portfolio QP refinement", background: "<p>Quadratic portfolio objectives have coupled curvature, so solving the Hessian system accounts for interactions between assets.</p>", numbers: "<p>The lesson Hessian entries $4,1,1,3$ have determinant $4\\cdot3-1\\cdot1=11$, so the two-variable solve is well-defined.</p>" },
  { title: "Second-order deep-learning experiments", background: "<p>Nonconvex deep-learning experiments must damp or line-search curvature steps because Hessians can be indefinite.</p>", numbers: "<p>On an illustrative 50-iteration budget, comparing full Newton with damped Newton over five rungs creates $2\\cdot5=10$ optimizer outcomes.</p>" }
];

(window.ALLML_CONTENT["2.6"] = window.ALLML_CONTENT["2.6"] || {}).applications = [
  { title: "Large sparse linear models", background: "<p>CG solves SPD systems with matrix-vector products, avoiding a dense inverse for large models.</p>", numbers: "<p>With lesson $A=\\begin{bmatrix}4&1\\\\1&3\\end{bmatrix}$ and $b=(1,2)$, $r_0=(1,2)$ and $\\alpha_0=(r_0^Tr_0)/(p_0^TAp_0)=5/20=0.25$.</p>" },
  { title: "Kernel ridge regression", background: "<p>Kernel methods often expose matrix-vector products more cheaply than explicit factorizations.</p>", numbers: "<p>The first residual starts at $r_0=(1,2)$, so $r_0^Tr_0=1^2+2^2=5$ before any kernel-system step is taken.</p>" },
  { title: "Hessian-free neural optimization", background: "<p>Hessian-free methods use CG inside a larger optimizer to solve curvature systems without materializing the Hessian.</p>", numbers: "<p>The lesson denominator $p_0^TAp_0=(1,2)\\cdot(6,7)=20\\gt0$ checks the required positive curvature on the first direction.</p>" },
  { title: "Recommender least-squares blocks", background: "<p>Alternating least-squares recommenders repeatedly solve SPD normal-equation blocks, making CG a natural inner loop.</p>", numbers: "<p>After the first lesson step, $r_1=(-0.5,0.25)$ and $\\beta=(0.25+0.0625)/5=0.0625$ updates the next direction.</p>" },
  { title: "PDE and simulation calibration", background: "<p>Simulation calibration tracks residual norms because residuals measure stationarity of the quadratic system.</p>", numbers: "<p>The lesson residual norm after one step is $\\sqrt{(-0.5)^2+0.25^2}=\\sqrt{0.3125}=0.5590$, distinct from the objective value.</p>" }
];

/* ---- _apps-part02-B.js ---- */
(window.ALLML_CONTENT["2.7"] = window.ALLML_CONTENT["2.7"] || {}).applications = [
  { title: "Lasso sparse regression", background: "<p>Coordinate descent became a workhorse for Lasso because each coefficient has a one-dimensional update and the L1 prox can set it exactly to zero.</p>", numbers: "<p>With the lesson quadratic, the first coordinate update is $x_0=(1-1\cdot0)/4=0.25$, showing how one coefficient can be solved while the other is held fixed.</p>" },
  { title: "Matrix-factorization recommenders", background: "<p>Alternating user and item blocks in recommender systems is a block-coordinate version of the same local solve.</p>", numbers: "<p>After the first update gives $x_0=0.25$, the second coordinate uses the newest value: $x_1=(2-1\cdot0.25)/3=1.75/3=0.583333$.</p>" },
  { title: "Large linear classifiers", background: "<p>Sparse feature columns make coordinate updates cheap because a training pass can touch only the examples that contain one feature.</p>", numbers: "<p>The lesson system has true solution $(0.090909,0.636364)$, so the two-update point $(0.25,0.583333)$ is close but not finished.</p>" },
  { title: "Ad allocation knobs", background: "<p>Budget, bid, and pacing knobs are often tuned one at a time when a full simultaneous update is too costly or hard to audit.</p>", numbers: "<p>The lesson error after two Gauss-Seidel updates is $\|(0.25,0.583333)-(0.090909,0.636364)\|=0.167824$.</p>" },
  { title: "Embedded model pruning", background: "<p>One-weight-at-a-time updates are auditable on constrained devices because each accepted change has a local explanation.</p>", numbers: "<p>Illustratively, one pass over 100 coordinates means 100 scalar subproblems rather than one dense 100-dimensional step.</p>" }
];

(window.ALLML_CONTENT["2.8"] = window.ALLML_CONTENT["2.8"] || {}).applications = [
  { title: "Sparse linear models", background: "<p>L1-regularized models use proximal steps because the soft threshold can both shrink and delete coefficients.</p>", numbers: "<p>The lesson prox maps $(-2,-0.5,0.5,2)$ to $(-1,0,0,1)$ at $\lambda=1$, producing two exact zeros.</p>" },
  { title: "SVM hinge losses", background: "<p>Support-vector machines optimize a cornered hinge loss where subgradients replace ordinary derivatives at nondifferentiable points.</p>", numbers: "<p>At the absolute-value corner, choosing $g=0.5$ gives support value $0.5\cdot2=1\le2$ at $z=2$.</p>" },
  { title: "Robust regression", background: "<p>Absolute-error regression limits the influence of large residuals, but its kink requires generalized slopes.</p>", numbers: "<p>The same support line gives $0.5\cdot(-2)=-1\le2$ at $z=-2$, so the selected subgradient remains valid.</p>" },
  { title: "Compressed model fine-tuning", background: "<p>Proximal fine-tuning can encourage smaller or sparser models after an ordinary gradient step.</p>", numbers: "<p>The lesson pitfall is scale: with illustrative $\eta=0.1$ and $\lambda=1$, proximal gradient thresholds at $\eta\lambda=0.1$, not $1$.</p>" },
  { title: "Constrained composite objectives", background: "<p>Many objectives combine a smooth data term with a nonsmooth regularizer or projection that encodes feasible structure.</p>", numbers: "<p>Illustratively, projecting a vector with two entries outside a box clips exactly those 2 coordinates while leaving interior coordinates unchanged.</p>" }
];

(window.ALLML_CONTENT["2.9"] = window.ALLML_CONTENT["2.9"] || {}).applications = [
  { title: "SVM margin training", background: "<p>KKT multipliers explain how active margin constraints push back against the objective in maximum-margin classifiers.</p>", numbers: "<p>The lesson stationarity check is $(1,1)-1(1,1)=(0,0)$, so the active constraint normal cancels the objective gradient.</p>" },
  { title: "Fairness-constrained ML", background: "<p>Inequality constraints are common in fairness and policy controls, where inactive limits should have zero price.</p>", numbers: "<p>For the lesson inactive wall $g(x)=1-x$ at $x=2$, $g(2)=-1$ and $\mu g=0\cdot(-1)=0$.</p>" },
  { title: "Budgeted bidding", background: "<p>Budget constraints often put the optimizer on a boundary, making multiplier checks more informative than unconstrained gradients.</p>", numbers: "<p>The equality-constrained lesson solution $(0.5,0.5)$ satisfies $x+y=1$ exactly.</p>" },
  { title: "Resource allocation", background: "<p>Complementarity says an unused resource has no shadow price, while a fully used one can carry a positive multiplier.</p>", numbers: "<p>The lesson active boundary $x\ge1$ has stationarity $2+\mu(-1)=0$, giving $\mu=2\ge0$.</p>" },
  { title: "Monotonic calibration", background: "<p>Constrained calibration can enforce monotone or policy-safe outputs, but degenerate active gradients need QA.</p>", numbers: "<p>Illustratively, one equality constraint should contribute active-gradient rank 1; rank 0 would fail the constraint-qualification check.</p>" }
];

(window.ALLML_CONTENT["2.10"] = window.ALLML_CONTENT["2.10"] || {}).applications = [
  { title: "SVM dual training", background: "<p>The SVM dual turns examples into multipliers whose optimum certifies the margin solution.</p>", numbers: "<p>In the lesson bound, $q(2)=2-4/4=1$, matching the primal value $p^\star=1$ with zero gap.</p>" },
  { title: "Resource pricing", background: "<p>Dual multipliers price scarce constraints, which is useful when a business asks what one more unit of capacity is worth.</p>", numbers: "<p>For $x\ge1$, the lesson primal value is $1^2=1$, so any valid $q(\mu)$ must be at most $1$.</p>" },
  { title: "Portfolio risk constraints", background: "<p>Risk limits can be audited with weak-duality lower bounds before trusting a solver result.</p>", numbers: "<p>The lesson computes $q(1)=1-1/4=0.75\le p^\star=1$, a valid but not tight certificate.</p>" },
  { title: "Constrained hyperparameter learning", background: "<p>Primal-dual gaps provide a stopping signal when tuning under latency, fairness, or budget constraints.</p>", numbers: "<p>Illustratively, a solver might stop only when $p-q\lt10^{-4}$, while the lesson has exact gap $1-1=0$ at $\mu=2$.</p>" },
  { title: "Sensitivity analysis", background: "<p>Multipliers quantify sensitivity to constraint tightening, but their units depend on how the constraint is scaled.</p>", numbers: "<p>The lesson derivative of $q(\mu)=\mu-\mu^2/4$ is $1-\mu/2$, so the best multiplier is $\mu=2$.</p>" }
];

(window.ALLML_CONTENT["2.11"] = window.ALLML_CONTENT["2.11"] || {}).applications = [
  { title: "Neural-network SGD", background: "<p>Deep learning uses minibatches because full gradients over all examples are too expensive to compute every step.</p>", numbers: "<p>The lesson full gradient from $(-4,-16,-36,-64)$ is $(-4-16-36-64)/4=-30$.</p>" },
  { title: "Online ads training", background: "<p>Streaming training accepts noisy examples as long as the sampling target is the intended empirical objective.</p>", numbers: "<p>The lesson size-2 batches can wobble from $(-4-16)/2=-10$ to $(-36-64)/2=-50$ around the full target $-30$.</p>" },
  { title: "Federated updates", background: "<p>Client sampling in federated learning must be designed carefully so the aggregate gradient represents the target population.</p>", numbers: "<p>Illustratively, averaging 4 client gradients mirrors the lesson's 4-example average and changes if one client is over-sampled.</p>" },
  { title: "Large recommender retraining", background: "<p>Batch size mainly buys variance reduction, not a different objective, which is why it is tuned separately from learning rate.</p>", numbers: "<p>With independent variance $9$, the lesson rule gives variance $9/9=1$ for batch size 9 and $9/100=0.09$ for batch size 100.</p>" },
  { title: "Streaming anomaly models", background: "<p>Constant-step stochastic optimization can track drift, but without drift it leaves a stationary cloud around the optimum.</p>", numbers: "<p>For lesson gradients $(-4,-2,0,2)$, biased probabilities $(0.7,0.1,0.1,0.1)$ give mean $-2.8$ instead of uniform mean $-1$.</p>" }
];

(window.ALLML_CONTENT["2.12"] = window.ALLML_CONTENT["2.12"] || {}).applications = [
  { title: "Resource allocation LPs", background: "<p>Linear programs model allocation when returns and constraints are linear, and optima occur on supporting faces of the polytope.</p>", numbers: "<p>The lesson vertices $(0,0),(2,0),(0,1)$ have values $0,2,2$ for $c=(1,2)$, so two vertices tie.</p>" },
  { title: "Portfolio QPs", background: "<p>Convex quadratic programs balance a quadratic risk model against linear exposure or budget constraints.</p>", numbers: "<p>Projecting $p=(2,2)$ to $(0.4,0.8)$ gives squared distance $(1.6)^2+(1.2)^2=2.56+1.44=4.00$.</p>" },
  { title: "SVM quadratic programs", background: "<p>Classical SVM training is a QP where active linear constraints identify support vectors.</p>", numbers: "<p>The lesson projected point satisfies the active wall exactly: $0.4+2(0.8)=2.0$.</p>" },
  { title: "Scheduling relaxations", background: "<p>LP relaxations of scheduling and assignment problems can expose bounds even when the final decision must be discrete.</p>", numbers: "<p>The lesson tie value $2$ at both $(2,0)$ and $(0,1)$ shows that LP optima need not be unique.</p>" },
  { title: "Ad inventory pacing", background: "<p>Inventory and pacing rules often form linear polytopes before additional business logic is layered on top.</p>", numbers: "<p>Illustratively, the two-channel wall $x+2y\le2$ is the same wall used in the lesson projection calculation.</p>" }
];

/* ---- _apps-part02-C.js ---- */
(window.ALLML_CONTENT["2.13"] = window.ALLML_CONTENT["2.13"] || {}).applications = [
  {
    title: "Feature subset selection",
    background: "<p>Feature selection is a 0-1 decision problem: each candidate feature is either included or dropped. Integer optimization is useful because averaging two valid feature masks usually creates a fractional mask that cannot be deployed.</p>",
    numbers: "<p>In the lesson knapsack, choosing items 1 and 2 gives weight $2+3=5$ and value $3+4=7$, so the selected mask is $z=(1,1,0)$ under capacity $C=5$.</p>"
  },
  {
    title: "Route and schedule assignment",
    background: "<p>Scheduling and routing models contain discrete choices such as assigning a job to one slot or another. The search space grows exponentially, so exact enumeration is only a toy baseline.</p>",
    numbers: "<p>An illustrative 5-job binary assignment has $2^5=32$ possible subsets before any extra feasibility rules are added.</p>"
  },
  {
    title: "Model compression masks",
    background: "<p>Compression often asks which weights, channels, or blocks to keep. A mask must be legal after selection, not merely close to a legal fractional solution.</p>",
    numbers: "<p>The lesson's items 1 and 3 have weight $2+4=6$, which violates capacity $5$, so that high-looking mask is infeasible because $6\gt5$.</p>"
  },
  {
    title: "Ad slot allocation",
    background: "<p>Ad allocation can use relaxations to obtain bounds, but the deployable decision still needs an integer assignment of slots or impressions.</p>",
    numbers: "<p>With weights $(4,5)$, values $(7,10)$, and capacity $6$, the best integer choice is item 2 with value $10$ before any fractional fill is considered.</p>"
  },
  {
    title: "Branch-and-bound certificates",
    background: "<p>Branch-and-bound uses upper bounds to prove that parts of a discrete search tree cannot beat the incumbent. A bound is a certificate for pruning, not a candidate answer.</p>",
    numbers: "<p>An illustrative node with incumbent $7$ and relaxed upper bound $11$ cannot be pruned yet, while a node with upper bound below $7$ can be discarded safely.</p>"
  }
];

(window.ALLML_CONTENT["2.14"] = window.ALLML_CONTENT["2.14"] || {}).applications = [
  {
    title: "Hyperparameter tuning",
    background: "<p>Bayesian optimization is common when model evaluations are expensive. A surrogate model proposes the next run by balancing promising mean predictions with uncertainty.</p>",
    numbers: "<p>The lesson observations $(0,0),(1,1),(2,0)$ set the current best observed value to $1$, so acquisition compares candidates against that incumbent.</p>"
  },
  {
    title: "Architecture search",
    background: "<p>Architecture search often has too many choices for a dense grid. Bayesian optimization spends a small budget on points that look either good or uncertain.</p>",
    numbers: "<p>With an illustrative budget of $20$ evaluations, a 2-D grid of $21\times21=441$ candidates cannot be fully tested, so the acquisition chooses a small subset.</p>"
  },
  {
    title: "Simulator calibration",
    background: "<p>When a simulation run is slow, the GP posterior summarizes what has already been learned and where the simulator remains uncertain.</p>",
    numbers: "<p>For the lesson data, the RBF posterior interpolates near the observed point $x=1$, giving posterior mean $\mu(1)\approx1.000$.</p>"
  },
  {
    title: "A/B policy search",
    background: "<p>Policy search needs explore-exploit control because early winners can be noisy or incomplete. UCB adds an explicit uncertainty bonus.</p>",
    numbers: "<p>The lesson UCB form is $a(x)=\mu(x)+\kappa\sigma(x)$. If $\mu=0.6$, $\sigma=0.2$, and $\kappa=2$, then $a=0.6+2(0.2)=1.0$.</p>"
  },
  {
    title: "Noisy design optimization",
    background: "<p>Materials and drug-design analogs often evaluate noisy candidates. Repeated measurements estimate noise so the surrogate does not treat every observation as exact.</p>",
    numbers: "<p>For three illustrative repeats $0.70,0.76,0.82$, the sample mean is $(0.70+0.76+0.82)/3=0.76$, and the spread signals observation noise.</p>"
  }
];

(window.ALLML_CONTENT["2.15"] = window.ALLML_CONTENT["2.15"] || {}).applications = [
  {
    title: "Simulator calibration",
    background: "<p>Derivative-free optimization is useful when a simulator returns only function values. Finite differences can estimate local slopes without an analytic derivative.</p>",
    numbers: "<p>For $f(x)=(x-2)^2$ at $x=0$ with $h=0.1$, $f(0.1)=3.61$ and $f(-0.1)=4.41$, so $\frac{3.61-4.41}{0.2}=-4.00$.</p>"
  },
  {
    title: "Validation-metric tuning",
    background: "<p>Direct or pattern search is useful when the validation metric is piecewise, cached, or otherwise awkward to differentiate.</p>",
    numbers: "<p>The lesson pattern search moves the objective from $5$ to $4$ to $1$ to $0$ using accepted comparison steps, reaching the minimizer without gradients.</p>"
  },
  {
    title: "A/B policy search",
    background: "<p>Noisy policy comparisons can be misleading if each candidate is evaluated once. Replication spends budget to reduce variance before accepting a move.</p>",
    numbers: "<p>If one evaluation has noise standard deviation $0.5$, averaging $5$ illustrative repeats gives standard error $0.5/\sqrt{5}=0.2236$.</p>"
  },
  {
    title: "Nondifferentiable preprocessing pipelines",
    background: "<p>Thresholds, clipping rules, and feature gates often create nondifferentiable objectives. A derivative-free search can probe candidate thresholds directly.</p>",
    numbers: "<p>An illustrative threshold grid of $21$ candidates over $[0,1]$ has spacing $1/(21-1)=0.05$ between neighboring probes.</p>"
  },
  {
    title: "Hardware and compiler autotuning",
    background: "<p>Compiler flags and hardware knobs often expose only benchmark runtimes. Coordinate probes scale with the number of knobs, so budget accounting matters.</p>",
    numbers: "<p>With $10$ knobs, central differences require at least $2\cdot10=20$ function calls for one gradient estimate before any extra baseline or repeats.</p>"
  }
];

(window.ALLML_CONTENT["2.16"] = window.ALLML_CONTENT["2.16"] || {}).applications = [
  {
    title: "Routing and scheduling",
    background: "<p>Rugged routing and scheduling landscapes can trap greedy local search. Simulated annealing sometimes accepts worse moves so it can leave a local basin.</p>",
    numbers: "<p>For the lesson uphill move $\Delta=2$ at temperature $T=1$, the acceptance probability is $\exp(-2/1)=0.135335$.</p>"
  },
  {
    title: "Feature subset search",
    background: "<p>Feature subset objectives often have interactions, so a locally worse mask may lead to a better later subset. Higher temperature increases exploratory acceptance.</p>",
    numbers: "<p>At $T=5$, the same uphill move has probability $\exp(-2/5)=0.670320$, much larger than at $T=1$.</p>"
  },
  {
    title: "Hyperparameter search",
    background: "<p>Cooling schedules control when search changes from exploratory to nearly greedy. Too-fast cooling can remove the escape mechanism almost immediately.</p>",
    numbers: "<p>At $T=0.1$, the lesson probability is $\exp(-20)=0.00000000206$, so uphill moves of size $2$ are essentially never accepted.</p>"
  },
  {
    title: "Tabu assignment search",
    background: "<p>Tabu search keeps short-term memory to avoid immediate backtracking or cycling among equivalent assignments.</p>",
    numbers: "<p>If the search moves $+1$ from state $0$ to state $1$, the immediate reversal is $-1$; storing the recent move makes that reversal tabu until tenure expires.</p>"
  },
  {
    title: "Model compression masks",
    background: "<p>Compression masks can have many equivalent or near-equivalent states. Tabu memory helps prevent repeated toggling among the same few masks.</p>",
    numbers: "<p>With illustrative tabu tenure $3$, the memory list can hold the last three mask moves, so a reversal may be blocked for up to three accepted steps.</p>"
  }
];

