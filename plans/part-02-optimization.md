# Part 2 — Optimization

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F4 (Optimizer).

### 2.1 — Convex sets & convex functions   [notebook: 2.1-convex-sets-functions.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Portfolio allocation — convex combinations preserve feasible mixes: lesson's $0.25x+0.75y=(1.5,0.75)$ re-derived as a weighted blend.
2. Model ensembling — averaging two predictors is safe when the loss is convex; lesson's Jensen check uses $0.25\cdot1+0.75\cdot3=2.5$.
3. Ad delivery budget pacing — feasible bids inside a box stay feasible under interpolation; lesson's point $(1.5,0.75)$ lies inside $[0,2]^2$.
4. Risk penalty design — squared penalties obey Jensen; lesson's $f(2.5)=6.25$ versus weighted endpoint value $0.25\cdot1+0.75\cdot9=7$.
5. Feasible-set QA for constraints — ring-shaped business rules fail midpoint tests; 2 opposite points with midpoint in the hole is illustrative.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `is_convex_combo()` and `run_optimizer()` on a 1-D quadratic; verify the lesson formula $0.25x+0.75y=(1.5,0.75)$ and Jensen $6.25\le7$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl (closed-form min to verify) · D2 anisotropic/ill-conditioned quadratic · D3 nonconvex (Rosenbrock/multimodal) · D4 real logistic-regression loss on a small sklearn dataset · D5 high-dim or constrained
- Metric: final loss across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels (b) loss-vs-iteration curve
- Pitfall on D5: reproduce "connected is not convex" with a ring/annulus feasible mask, then fix by projecting to a convex box/simplex.
- Notes: delete copied dead helpers; keep all non-lesson application numbers marked illustrative.

### 2.2 — Unconstrained optimization & optimality conditions   [notebook: 2.2-unconstrained-optimality.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Logistic-regression training — stationarity screens candidate optima; lesson's $f'(1)=0$, $f''(1)=2\gt0$, $f(1)=2$ is the tiny verification.
2. Neural-net loss diagnosis — zero gradient can be a saddle; lesson's $f(x)=-x^2$ has $f'(0)=0$ but $f(1)=-1\lt0$.
3. Hyperparameter response curves — flat validation curves need curvature checks; illustrative tolerance $|\nabla f|\lt10^{-3}$ is not enough alone.
4. Calibration threshold tuning — local minimum tests use slope plus curvature; lesson's positive curvature value $2$ is the re-derivable certificate.
5. Simulator parameter fitting — avoid accepting hilltops; lesson's negative curvature $f''(0)=-2$ marks a maximum, not success.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `classify_stationary_point(f, grad, hess, x)` and verify lesson cases $(x-1)^2+2$ at $x=1$ and $-x^2$ at $x=0$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl (closed-form min to verify) · D2 anisotropic/ill-conditioned quadratic · D3 nonconvex (Rosenbrock/multimodal) · D4 real logistic-regression loss on a small sklearn dataset · D5 high-dim or constrained
- Metric: final loss across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels (b) loss-vs-iteration curve
- Pitfall on D5: reproduce treating stationarity as success at a saddle/flat point, then fix with Hessian eigenvalue and objective-decrease checks.
- Notes: delete template helpers; surface that convexity is what turns local tests into global guarantees.

### 2.3 — Gradient descent (foundations)   [notebook: 2.3-gradient-descent.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Linear/logistic models — repeated updates use $x_{t+1}=x_t-\eta\nabla f(x_t)$; lesson's $x_1=0.6$ from $x_0=0$, $\eta=0.1$.
2. Deep-learning training — every batch applies the same descent step; lesson's loss drops from $9$ to $5.76$ on the toy quadratic.
3. Feature-scaling checks — same $\eta$ becomes unsafe after rescaling; lesson's safe constant rule is $0\lt\eta\lt1$ for curvature $L=2$.
4. Production retraining monitors — convergence can be summarized by error contraction; lesson's $\eta=0.2$ gives multiplier $1-2\eta=0.6$.
5. AutoML optimizer baselines — compare fancier methods against vanilla GD; illustrative 20-step budget uses the lesson's 20-step error calculation.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `gradient_descent(grad, x0, eta, steps)` and verify lesson arithmetic: gradient $-6$, update $0.6$, loss $9\to5.76$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl (closed-form min to verify) · D2 anisotropic/ill-conditioned quadratic · D3 nonconvex (Rosenbrock/multimodal) · D4 real logistic-regression loss on a small sklearn dataset · D5 high-dim or constrained
- Metric: final loss across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels (b) loss-vs-iteration curve
- Pitfall on D5: reproduce one step size failing on ill-conditioned/high-dim features, then fix with scaling or a smaller/adaptive step.
- Notes: remove dead helper code; for this component topic keep surfaces fixed and vary only learning rate/feature scaling.

### 2.4 — Line search & trust regions   [notebook: 2.4-line-search-trust-regions.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Safe Newton training — backtracking rejects unstable full steps; lesson rejects $\alpha=1$ and accepts $\alpha=0.5$.
2. Reinforcement-learning policy updates — trust regions limit parameter moves; illustrative trust radius $\Delta=0.1$ is a chosen safety budget.
3. Ads bid-model calibration — sufficient decrease avoids tiny accidental wins; lesson's Armijo right side is $-4$ for $\alpha=1$.
4. Scientific simulation fitting — accept a local model only when actual/predicted ratio is credible; lesson names $\rho=\text{actual}/\text{predicted}$.
5. Large-scale recommender updates — damped steps prevent metric spikes; lesson's accepted step reaches $f(2)=0$ from $f(0)=4$.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `backtracking_line_search()` plus optional `trust_region_step()`; verify lesson Armijo arithmetic for $f(x)=(x-2)^2$, $x=0$, $p=4$, $c=0.5$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl (closed-form min to verify) · D2 anisotropic/ill-conditioned quadratic · D3 nonconvex (Rosenbrock/multimodal) · D4 real logistic-regression loss on a small sklearn dataset · D5 high-dim or constrained
- Metric: iterations-to-tolerance across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels (b) loss-vs-iteration curve
- Pitfall on D5: reproduce accepting any decrease with a too-large step, then fix with Armijo sufficient decrease and trust-region ratio checks.
- Notes: fixed surface ladder; vary only step acceptance/control policy.

### 2.5 — Newton & quasi-Newton methods (BFGS, L-BFGS)   [notebook: 2.5-newton-quasi-newton.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Logistic regression solvers — L-BFGS is standard for medium-scale convex losses; lesson's quadratic Newton step solves $Hs=b$ in 1 iteration.
2. Conditional random fields — quasi-Newton curvature avoids dense Hessian storage; lesson's BFGS secant uses $s=(1,2)$, $y=(3,5)$.
3. Hyperparameter objective polishing — Newton rescales by curvature; lesson optimum is $(0.090909,0.636364)$ for the 2-D bowl.
4. Portfolio QP refinement — Hessian solves capture coupled curvature; lesson matrix has entries $4,1,1,3$.
5. Second-order deep-learning experiments — damping protects nonconvex steps; illustrative compare full Newton vs damped Newton on equal 50-iteration budget.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `newton_step()` and a small `bfgs_update()`; verify lesson $H=[[4,1],[1,3]]$, $b=(1,2)$ gives $(0.090909,0.636364)$ and $s^Ty=13$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl (closed-form min to verify) · D2 anisotropic/ill-conditioned quadratic · D3 nonconvex (Rosenbrock/multimodal) · D4 real logistic-regression loss on a small sklearn dataset · D5 high-dim or constrained
- Metric: iterations-to-tolerance across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels (b) loss-vs-iteration curve
- Pitfall on D5: reproduce an indefinite Hessian producing an unsafe Newton direction, then fix with damping/line search or positive-definite BFGS curvature checks.
- Notes: fixed surfaces; vary curvature model Newton vs BFGS/L-BFGS.

### 2.6 — Conjugate gradient   [notebook: 2.6-conjugate-gradient.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Large sparse linear models — CG solves $Ax=b$ without dense inverse; lesson first step has $\alpha_0=5/20=0.25$.
2. Kernel ridge regression — matrix-vector products replace factorization; lesson residual starts at $r_0=(1,2)$.
3. Hessian-free neural optimization — inner CG solves curvature systems; lesson denominator $p_0^TAp_0=20$ checks positive curvature.
4. Recommender least-squares blocks — repeated SPD solves use conjugate directions; lesson $\beta=0.0625$ updates the second direction.
5. PDE/simulation calibration — residual norm tracks stationarity; lesson $r_1=(-0.5,0.25)$ after one step is re-derivable.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `conjugate_gradient(A, b, x0)`; verify lesson $r_0=(1,2)$, $\alpha_0=0.25$, $r_1=(-0.5,0.25)$, $\beta=0.0625$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl (closed-form min to verify) · D2 anisotropic/ill-conditioned quadratic · D3 nonconvex (Rosenbrock/multimodal via SPD local system) · D4 real logistic-regression loss Hessian-vector products on a small sklearn dataset · D5 high-dim or constrained SPD system
- Metric: iterations-to-tolerance across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels (b) loss-vs-iteration curve
- Pitfall on D5: reproduce CG on a non-SPD/poorly conditioned matrix, then fix with SPD projection/preconditioning and restarts.
- Notes: fixed surface ladder; vary residual/conjugacy behavior, not dataset semantics.

### 2.7 — Coordinate descent   [notebook: 2.7-coordinate-descent.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Lasso sparse regression — one-coordinate/prox updates drive coefficients to zero; lesson coordinate update gives $x_0=0.25$.
2. Matrix-factorization recommenders — alternating coordinate/block updates are cheap; lesson second update gives $x_1=1.75/3=0.583333$.
3. Large linear classifiers — sparse feature columns make single-coordinate updates efficient; lesson true solution is $(0.090909,0.636364)$.
4. Ad allocation knobs — cyclic knob tuning mirrors coordinate schedules; lesson error norm after two updates is $0.167824$.
5. Embedded model pruning — one weight at a time is auditable; illustrative update budget of 1 pass over 100 coordinates.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `coordinate_descent_quadratic(A,b, schedule)`; verify lesson updates $(0,0)\to(0.25,0)\to(0.25,0.583333)$ and error norm $0.167824$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl (closed-form min to verify) · D2 anisotropic/ill-conditioned quadratic · D3 nonconvex (Rosenbrock/multimodal coordinate slices) · D4 real logistic-regression loss on a small sklearn dataset · D5 high-dim sparse or constrained L1 case
- Metric: final loss across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels (b) loss-vs-iteration curve
- Pitfall on D5: reproduce feature-scale sensitivity or stale Jacobi updates, then fix with standardization and Gauss-Seidel/newest-value updates.
- Notes: fixed surfaces; vary coordinate schedule and scaling.

### 2.8 — Proximal & subgradient methods   [notebook: 2.8-proximal-subgradient.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Sparse linear models — L1 prox zeroes small coefficients; lesson maps $(-2,-0.5,0.5,2)$ to $(-1,0,0,1)$ at $\lambda=1$.
2. SVM hinge losses — subgradients handle margin corners; lesson validates $g=0.5$ as a support slope at $x=0$.
3. Robust regression — absolute-error corners need generalized slopes; lesson checks $z=2$ line value $1\le2$.
4. Compressed model fine-tuning — prox scale controls shrinkage; lesson pitfall says threshold is $\eta\lambda$, illustrative $\eta=0.1$, $\lambda=1$ gives $0.1$.
5. Constrained composite objectives — prox encodes simple constraints; illustrative projection clips 2 coordinates to a box.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `subgradient_step()` and `soft_threshold_prox(v, lam)`; verify lesson support-line checks and prox vector $(-1,0,0,1)$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic plus absolute value (closed-form prox) · D2 anisotropic/ill-conditioned composite quadratic · D3 nonsmooth nonconvex/multimodal composite · D4 real logistic-regression loss with L1 on a small sklearn dataset · D5 high-dim sparse or constrained
- Metric: final objective value across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels (b) loss-vs-iteration curve
- Pitfall on D5: reproduce using smooth step-size rules/arbitrary subgradients at corners, then fix with diminishing steps and correctly scaled $\eta\lambda$ prox.
- Notes: delete dead helpers; component variation is nonsmooth handler/prox scale.

### 2.9 — Constrained optimization, Lagrange multipliers, KKT   [notebook: 2.9-constrained-kkt.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. SVM margin training — active constraints push back through multipliers; lesson stationarity balances $(1,1)-1(1,1)=(0,0)$.
2. Fairness-constrained ML — inequality multipliers must be nonnegative; lesson inactive wall at $x=2$ has $g(2)=-1$ and $\mu=0$.
3. Budgeted bidding — constrained optimum can sit on a boundary; lesson equality solution $(0.5,0.5)$ satisfies $x+y=1$.
4. Resource allocation — complementarity means untouched capacity has no price; lesson computes $\mu g=0\cdot(-1)=0$.
5. Calibration under monotonicity — active gradient degeneracy is a QA risk; illustrative check requires active-gradient rank 1 for one equality.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `projected_optimizer_with_kkt_check()`; verify lesson equality problem minimizer $(0.5,0.5)$, $\lambda=-1$, and inactive inequality complementarity.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D constrained quadratic bowl (closed-form min to verify) · D2 anisotropic/ill-conditioned constrained quadratic · D3 nonconvex constrained Rosenbrock/multimodal · D4 real logistic-regression loss with norm/fairness-style constraint on a small sklearn dataset · D5 high-dim or constrained simplex/box
- Metric: final feasible loss across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels with feasible boundary (b) loss-vs-iteration curve
- Pitfall on D5: reproduce inactive inequalities forced to equality or negative multipliers, then fix with complementarity and dual-feasibility checks.
- Notes: fixed F4 ladder, constraints added per rung; mark any fairness thresholds illustrative.

### 2.10 — Duality (Lagrangian & Wolfe)   [notebook: 2.10-duality.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. SVM dual training — multipliers certify a lower/upper bound match; lesson best multiplier $\mu=2$ gives $q(2)=1$.
2. Resource pricing — constraint prices quantify tightening; lesson $x\ge1$ has primal value $1$.
3. Portfolio risk constraints — weak dual bounds audit solver output; lesson $q(1)=0.75\le p^\star=1$.
4. Hyperparameter-constrained learning — dual gap is a stopping signal; illustrative stop when primal-dual gap $\lt10^{-4}$.
5. Sensitivity analysis — rescaling a constraint rescales multipliers; lesson warns units matter, with one unit of tightening priced by $\mu$.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `lagrangian_dual_bound(mu)` for $\min x^2$ subject to $x\ge1$; verify lesson $q(1)=0.75$ and $q(2)=1$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D constrained quadratic bowl (closed-form min/dual to verify) · D2 anisotropic/ill-conditioned constrained quadratic · D3 nonconvex constrained/multimodal showing gap · D4 real logistic-regression loss with regularization/constraint on a small sklearn dataset · D5 high-dim or constrained
- Metric: primal-dual gap across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels with bound annotations (b) gap-vs-iteration curve
- Pitfall on D5: reproduce assuming strong duality everywhere or using supremum/infimum incorrectly, then fix by checking convexity/regularity and lower-bound direction.
- Notes: despite F4 metric variation, keep one gap metric across D1-D5 for this topic.

### 2.11 — Stochastic optimization theory   [notebook: 2.11-stochastic-optimization.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Neural-network SGD — minibatches estimate full gradients; lesson full gradient from $(-4,-16,-36,-64)$ is $-30$.
2. Online ads training — noisy examples arrive continuously; lesson batch means $-10$ and $-50$ wobble around the target.
3. Federated/on-device updates — sampling distribution controls unbiasedness; illustrative 4-client average mirrors the lesson's 4 gradients.
4. Large recommender retraining — batch size reduces variance; lesson states independent variance $9$ shrinks with batch size.
5. Streaming anomaly models — constant step leaves a stationary cloud; illustrative diminishing schedule $\eta_t=1/\sqrt{t}$ fixes drift.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `sgd(loss_grad_i, batch_size, schedule)`; verify lesson gradients average to $-30$ and size-2 examples can be $-10$ or $-50$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl with four sample gradients (closed-form full gradient) · D2 anisotropic/ill-conditioned stochastic quadratic · D3 noisy nonconvex Rosenbrock/multimodal · D4 real logistic-regression loss on a small sklearn dataset · D5 high-dim/noisy minibatch case
- Metric: final loss across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels with stochastic paths (b) loss-vs-iteration curve
- Pitfall on D5: reproduce biased minibatch sampling or large constant step wandering, then fix with uniform sampling and a decaying schedule.
- Notes: fixed surface ladder; vary batch size/noise/schedule.

### 2.12 — Linear & quadratic programming   [notebook: 2.12-linear-quadratic-programming.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Resource allocation LPs — linear objectives choose vertices; lesson evaluates $(0,0),(2,0),(0,1)$ as $0,2,2$.
2. Portfolio QPs — convex quadratic risk needs $H\succeq0$; lesson projection has squared distance $4.00$.
3. SVM quadratic programs — active constraints define the optimum; lesson projected point $(0.4,0.8)$ satisfies $0.4+2(0.8)=2.0$.
4. Scheduling relaxations — tied vertices mean nonunique optima; lesson has a tie value $2$ at two vertices.
5. Ad inventory pacing — linear constraints form a polytope; illustrative two-channel budget $x+2y\le2$ copies the lesson wall.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `solve_lp_by_vertices()` and `project_qp()`; verify lesson LP vertex values $0,2,2$ and QP projection distance $4.00$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl clipped by linear constraints (closed-form min to verify) · D2 anisotropic/ill-conditioned QP · D3 nonconvex/indefinite QP contrast · D4 real logistic-regression loss with linear constraints on a small sklearn dataset · D5 high-dim or constrained LP/QP
- Metric: final feasible objective across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels with feasible polytope (b) objective-vs-iteration curve
- Pitfall on D5: reproduce using an indefinite $H$ or expecting interior LP optimum, then fix by PSD check and vertex/boundary diagnostics.
- Notes: use simple projected-gradient/active-set illustration, not a heavy solver dependency unless already present.

### 2.13 — Integer & combinatorial optimization   [notebook: 2.13-integer-combinatorial-optimization.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Feature subset selection — binary variables choose features; lesson knapsack picks items 1 and 2 with weight $2+3=5$ and value $7$.
2. Route/schedule assignment — discrete choices break convex averaging; illustrative 5-job assignment gives $2^5=32$ subsets.
3. Model compression — keep/drop decisions are 0-1; lesson infeasible choice items 1 and 3 has weight $6\gt5$.
4. Ad slot allocation — LP relaxations can overstate value; lesson two-item case has best integer value $10$ before fractional fill.
5. Branch-and-bound certificates — bounds prune without being solutions; illustrative incumbent $7$ versus relaxed upper bound $11$.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `knapsack_branch_and_bound()`; verify lesson weights $(2,3,4)$, values $(3,4,5)$, capacity $5$, best $z=(1,1,0)$, value $7$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D binary quadratic/knapsack with closed-form enumeration · D2 anisotropic/ill-conditioned relaxed quadratic · D3 nonconvex multimodal binary landscape · D4 real logistic-regression feature-subset loss on a small sklearn dataset · D5 high-dim or constrained combinatorial subset
- Metric: best feasible objective across all rungs.
- Closing viz: (a) optimizer/search trajectory on contour or state panels (b) best-objective-vs-iteration curve
- Pitfall on D5: reproduce rounding a fractional relaxation into infeasibility, then fix with feasibility repair and bound-vs-incumbent reporting.
- Notes: F4 black-box/discrete variant; no gap flag, but emphasize exact enumeration only on D1.

### 2.14 — Bayesian optimization   [notebook: 2.14-bayesian-optimization.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Hyperparameter tuning — expensive trials use acquisition instead of grid search; lesson observations $(0,0),(1,1),(2,0)$ set current best $1$.
2. Architecture search — uncertainty directs limited experiments; illustrative budget of 20 evaluations is chosen, not cited.
3. Simulator calibration — surrogate posterior honors data; lesson says posterior mean near $x=1$ is about $1.000$.
4. A/B policy search — explore-exploit balances expected value and uncertainty; lesson UCB form is $a(x)=\mu(x)+\kappa\sigma(x)$.
5. Materials/drug design analogs — noisy evaluations need noise modeling; illustrative duplicate-evaluation variance estimate from 3 repeats.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `bayes_opt_step(surrogate, acquisition)` with a lightweight GP/RBF surrogate; verify lesson interpolation at observed $x=1$ gives $\mu(1)\approx1.000$ and uses current best $1$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D quadratic/cheap black-box with closed-form optimum · D2 anisotropic/ill-conditioned 2-D black-box · D3 nonconvex Rosenbrock/multimodal · D4 real logistic-regression validation loss over 1-2 hyperparameters on a small sklearn dataset · D5 high-dim or constrained search space
- Metric: best observed loss across all rungs.
- Closing viz: (a) optimizer trajectory/acquisition samples on contour panels (b) best-loss-vs-iteration curve
- Pitfall on D5: reproduce optimizing posterior mean alone or using a mismatched/noiseless kernel, then fix with uncertainty-aware acquisition and noise term.
- Notes: keep CPU-only; if sklearn GaussianProcess is used, cap candidate grids tightly.

### 2.15 — Black-box & derivative-free optimization   [notebook: 2.15-black-box-derivative-free.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Simulator calibration — finite differences estimate slopes without analytic gradients; lesson central difference equals $-4.00$.
2. Validation-metric tuning — pattern search uses comparisons only; lesson moves value $5\to4\to1\to0$.
3. A/B policy search — noisy value comparisons need repeats; illustrative 5 repeats per candidate stabilizes one comparison.
4. Nondifferentiable preprocessing pipelines — optimize thresholds through function calls; illustrative threshold grid of 21 candidates.
5. Hardware/compiler autotuning — coordinate probes scale with dimension; illustrative 10 knobs require at least 20 central-difference calls.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `finite_difference_gradient()` and `pattern_search()`; verify lesson $f(0.1)=3.61$, $f(-0.1)=4.41$, slope $-4.00$, and pattern-search values $5\to0$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D quadratic bowl (closed-form min to verify) · D2 anisotropic/ill-conditioned quadratic · D3 nonconvex Rosenbrock/multimodal · D4 real logistic-regression validation loss as black-box on a small sklearn dataset · D5 high-dim or constrained/nondifferentiable
- Metric: best observed loss across all rungs.
- Closing viz: (a) optimizer trajectory on contour panels (b) best-loss-vs-iteration curve
- Pitfall on D5: reproduce bad finite-difference $h$ or one-shot noisy comparisons, then fix with scale-aware $h$ and repeated/averaged evaluations.
- Notes: F4 black-box variant; do not import heavy derivative-free packages.

### 2.16 — Simulated annealing & tabu search   [notebook: 2.16-simulated-annealing-tabu.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Routing and scheduling — annealing escapes local traps; lesson uphill $\Delta=2$ has acceptance $0.135335$ at $T=1$.
2. Feature subset search — random uphill moves explore model subsets; lesson at $T=5$ raises acceptance to $0.670320$.
3. Hyperparameter search — cooling controls exploration; lesson at $T=0.1$ gives $\exp(-20)=0.00000000206$.
4. Tabu local search for assignments — recent reversals are forbidden; lesson move $+1$ from 0 to 1 makes immediate $-1$ reversal tabu.
5. Model compression masks — memory prevents cycling among equal masks; illustrative tabu tenure 3 masks is chosen, not cited.

**Notebook plan:**
- Family: F4 Optimizer
- Concept built once (D1): implement `simulated_annealing()` and `tabu_search()` on a tiny discrete landscape; verify lesson acceptance probabilities for $\Delta=2$ at $T=1,5,0.1$.
- Datasets D1–D5: loss surfaces of rising difficulty — D1 1-D/2-D discrete quadratic bowl (closed-form best state) · D2 anisotropic/ill-conditioned discrete quadratic · D3 rugged multimodal landscape · D4 real logistic-regression feature-subset validation loss on a small sklearn dataset · D5 high-dim or constrained discrete subset
- Metric: best feasible loss across all rungs.
- Closing viz: (a) optimizer trajectory/state path on contour panels (b) best-loss-vs-iteration curve
- Pitfall on D5: reproduce cooling too fast/too slowly or tabu tenure too long, then fix by comparing schedules and tenure sweeps.
- Notes: F4 black-box/discrete variant; fixed surface family, vary only memory/temperature policy.
