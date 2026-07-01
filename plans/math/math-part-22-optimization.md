# Math · Part 22 — Optimization  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles, the fix recipe, and the Definition of Done. Every numeric claim below was checked
> with `python3` using `numpy`; key checks include gradient-descent iterates, convergence bounds, line-search
> steps, momentum/Nesterov steps, proximal shrinkage, SGD expectations, AdaGrad/RMSProp/Adam moments,
> coordinate descent, Newton/BFGS steps, dual values, KKT multipliers, LP vertices, and QP solutions.

**Section:** Optimization · **Lessons:** 26 · **Breadcrumb:** `Mathematics · Applied / Computational` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared app-set with a sibling) | 0 / 26 |
| Templated / thin motivation (stock opener or ≤45 words) | 12 / 26 |
| Key formula not in display form ($$…$$) | 21 / 26 |
| Unclosed-`$` LaTeX bug | 0 / 26 |
| Derivation to author / deepen / explain-only | 24 / 26 derivation · 2 / 26 explain-only |

**The core change:** keep the section's strong optimization focus, but replace asserted definitions with complete derivations where a formula is doing work. Each lesson below has six optimization-specific applications with numbers that can be re-derived from that lesson's own method.

---

## Priority & systemic issues

- **No whole-section §5 boilerplate block was detected.** The risk in this section is not copied applications; it is that many definitions state the update, inequality, or optimality condition without showing where it comes from.
- **Core ML optimizers need full derivations.** `math-22-05`…`math-22-17` should show update rules and one or two concrete numeric steps, because learners will meet these formulas in training-loop code.
- **Second-order and constrained optimization need algebra, not slogans.** `math-22-19`…`math-22-25` should derive Newton, BFGS, Lagrangians, KKT, dual objectives, LP vertex checks, and QP stationarity case by case.
- **LaTeX bugs found:** none in the current dump by the authoring-brief definition. No odd-dollar `numbers` field and no lost matrix row break was found.

---

## Model entry (full prose)

### `math-22-05` — Gradient descent  — **full-depth model entry**

**Connections (§1).**
> This lesson builds on the gradient and on the first-order Taylor approximation. The gradient tells the local
> direction in which a loss increases fastest. Taylor's formula tells how a small step changes the loss to
> first order. Put those together, and the update rule for gradient descent becomes a direct consequence rather
> than a rule to memorize.
>
> This is also the central optimizer pattern for the rest of the section. Momentum changes how steps are
> accumulated, SGD changes how the gradient is estimated, adaptive methods rescale the step coordinate by
> coordinate, and Newton-type methods replace the first-order local model with a second-order one. The plain
> gradient descent step is the baseline those refinements modify.

**Motivation & Intuition (§2).**
> Training a model means choosing parameters that make a loss small. At a current parameter value $w$, the
> optimizer usually does not know the whole loss surface. It only has local information: the value of the loss
> and its gradient. Gradient descent uses that local information in the most direct way. If $\nabla f(w)$ points
> uphill, then $-\nabla f(w)$ points downhill, so a small step in that direction should reduce the loss.
>
> The learning rate $\rho$ controls how much trust the optimizer puts in this local picture. A tiny $\rho$ is
> cautious and may require many steps. A very large $\rho$ can jump past the low point and increase the loss.
> On the simple loss $f(w)=(w-4)^2$, starting from $w_0=0$ with $\rho=0.25$ gives $w_1=2$, $w_2=3$, and
> $w_3=3.5$. The iterates move halfway from the current value to the minimizer each time, so the loss drops
> from $16$ to $4$ to $1$ to $0.25$.

**Definition & Assumptions (§3).** Display
$$
w_{k+1}=w_k-\rho \nabla f(w_k).
$$
Then derive it from the local linear model:
1. Start with the first-order Taylor approximation $f(w+s)\approx f(w)+\nabla f(w)^\top s$ — for a small step $s$, the gradient gives the linear change in loss.
2. Restrict to steps with fixed length $\Vert s\Vert=\rho$ — otherwise the linear model would prefer an infinitely long downhill step.
3. Write $s=\rho u$ with $\Vert u\Vert=1$ — this separates step size from direction.
4. Substitute to get $f(w+\rho u)\approx f(w)+\rho \nabla f(w)^\top u$ — only the dot product depends on direction.
5. Use Cauchy--Schwarz: $\nabla f(w)^\top u\ge -\Vert\nabla f(w)\Vert$ — the smallest possible dot product occurs when $u$ points opposite the gradient.
6. The minimizing unit direction is $u=-\nabla f(w)/\Vert\nabla f(w)\Vert$ — this is the steepest local decrease direction.
7. Absorb the gradient length into the step coefficient by choosing $s=-\rho\nabla f(w)$ — practical gradient descent uses a learning rate multiplying the whole gradient.
8. Add the step to the current point: $w_{k+1}=w_k+s=w_k-\rho\nabla f(w_k)$ — this is the update rule.
9. For $f(w)=(w-4)^2$, compute $\nabla f(w)=2(w-4)$ — differentiate the scalar quadratic.
10. With $w_0=0$ and $\rho=0.25$, get $w_1=0-0.25(-8)=2$ — one explicit step verifies the rule.

**Symbols.** $w_k$ is the parameter vector after $k$ updates; $f$ is the objective or loss; $\nabla f(w_k)$ is the gradient at the current parameters; $\rho>0$ is the learning rate; $s$ is the proposed step; $u$ is a unit direction; $\Vert\nabla f(w_k)\Vert$ is the local steepness. Assume $f$ is differentiable near $w_k$ and $\rho$ is small enough that the local model is useful.

**Real-World Applications (§5).**
1. **Quadratic training step** — for $f(w)=(w-4)^2$, $w_0=0$, and $\rho=0.25$, the gradient is $-8$, so $w_1=2$ and the loss drops from $16$ to $4$.
2. **Three-step loss check** — the same run gives $w_2=3$, $w_3=3.5$, and $f(w_3)=0.25$, showing the half-distance pattern.
3. **Too-large learning rate** — with $\rho=1.1$, $w_1=8.8$ and $f(w_1)=23.04$, so the loss increases from $16$; the update rule exposes overshoot.
4. **Linear-regression gradient** — for $L(w)=\tfrac12(2w-6)^2$, $\nabla L=2(2w-6)$. At $w=0$ and $\rho=0.1$, $w^+=1.2$.
5. **Vector weight update** — for $g=(3,-4)$ and $\rho=0.05$, the update is $w^+=w-(0.15,-0.20)$; the step length is $0.05\cdot5=0.25$.
6. **Fine-tuning scale** — if an adapter gradient norm is $0.8$ and $\rho=2\times10^{-4}$, the parameter step norm is $1.6\times10^{-4}$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson. The labels are plan shorthand; in the app they become flowing prose in the same plain textbook voice as the model entry. The model entry above is the prose bar for §1 and §2; the remaining lessons are compressed to their distinct derivation and application content.

### `math-22-01` — Optimization problem formulations  · deepen · explain-only

**Connections (§1).**
> This lesson starts the section by turning ordinary decision problems into optimization problems. Earlier algebra and modeling work already gave names to variables and equations; here those pieces are organized into variables, an objective, and constraints. That separation matters because every optimizer in the rest of the section assumes the problem has already been written in a form it can act on. Once the formulation is clear, methods such as gradient descent, KKT conditions, linear programming, and quadratic programming have a common language.

**Motivation & Intuition (§2).**
> Many practical problems begin as sentences: choose a model, allocate a budget, fit data, or satisfy a policy. An optimization formulation translates that sentence into mathematical parts. The decision variables are the quantities allowed to move. The objective measures what counts as better. The constraints describe what choices are allowed.
>
> This separation prevents several common mistakes. A quantity that is fixed data should not be optimized, and a requirement that must always hold should not be treated as a preference unless the model really allows tradeoffs. The feasible set collects all choices that obey the constraints, and an optimum is the feasible choice with the best objective value. This lesson is explain-only because the main skill is careful construction rather than proving a single formula.

**Definition & Assumptions (§3).** explain-only — this is a modeling concept rather than a theorem. Author the transformation from a sentence to a mathematical program as a careful construction: choose variables, write the objective, write constraints, and state the feasible set.

**Symbols.** $x$ is the decision variable; $f(x)$ is the objective; $g_i(x)\le0$ and $h_j(x)=0$ are inequality and equality constraints; $\mathcal F$ is the feasible set; $x^*$ is an optimal feasible point.

**Real-World Applications (§5).**
1. **Ridge regression formulation**: choose $w$, minimize $\tfrac12\Vert Xw-y\Vert^2+\tfrac\lambda2\Vert w\Vert^2$; with residual norm $3$ and $\Vert w\Vert=2$, $\lambda=0.5$ gives objective $4.5+1=5.5$.
2. **Budgeted ads allocation**: choose spends $x_1,x_2$, maximize $4x_1+5x_2$ with $x_1+x_2\le10$; spending all on channel 2 gives value $50$.
3. **SVM margin problem**: minimize $\tfrac12\Vert w\Vert^2$ subject to $y_i(w^Tx_i+b)\ge1$; if $\Vert w\Vert=2$, margin is $1/2$.
4. **Constrained calibration**: choose probabilities $p_i$ with $\sum p_i=1$; $(0.2,0.3,0.5)$ is feasible and sums to $1$.
5. **Portfolio objective**: minimize risk $x^T\Sigma x$ with expected return at least $r_0$; for $x=(0.4,0.6)$ and returns $(0.05,0.10)$, return is $0.08$.
6. **Neural-network training**: choose all weights $\theta$, minimize average loss $\tfrac1n\sum_i \ell_i(\theta)$; losses $(0.8,0.4,0.2)$ average to $0.467$.

### `math-22-02` — Convex sets  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on vectors, line segments, and weighted averages. A convex set is a feasible region that does not develop holes or bends inward between feasible points. That simple geometric idea will support later results about convex functions, optimality conditions, and constrained optimization. When a feasible region is convex, averaging two allowed decisions remains safe.

**Motivation & Intuition (§2).**
> In optimization, constraints describe the choices an algorithm is allowed to make. If the feasible set is convex, moving partway from one feasible point to another cannot leave the allowed region. This matters because many algorithms take steps, averages, or mixtures of current candidate solutions.
>
> Convexity is especially useful when several constraints are imposed at once. Each constraint may define its own feasible set, and the final feasible region is their intersection. The derivation below shows that if every individual set has the line-segment property, then satisfying all of them preserves that property too.

**Definition & Assumptions (§3).** Convexity of an intersection:
1. Let $C=\cap_i C_i$ — a point is in $C$ only if it is in every $C_i$.
2. Choose $x,y\in C$ — both points are feasible for every set in the intersection.
3. Fix $t\in[0,1]$ — this is the weight in a line segment.
4. Since $x,y\in C_i$ and each $C_i$ is convex, $tx+(1-t)y\in C_i$ for every $i$.
5. Therefore $tx+(1-t)y\in\cap_i C_i=C$ — membership in all sets gives membership in the intersection.

**Symbols.** $C$ is a set of feasible points; $x,y$ are points; $t$ is a mixing weight; $tx+(1-t)y$ is a point on the segment.

**Real-World Applications (§5).**
1. **Box constraints**: $x=(0,2)$ and $y=(4,0)$ lie in $[0,4]^2$; the midpoint $(2,1)$ is feasible.
2. **Probability simplex**: averaging $p=(1,0,0)$ and $q=(0,1,0)$ with $t=0.3$ gives $(0.3,0.7,0)$, still sums to $1$.
3. **Budget set**: spends $(10,0)$ and $(0,10)$ both satisfy $x_1+x_2\le10$; their average $(5,5)$ also spends $10$.
4. **Half-space feasibility**: if $a^Tx\le3$ and $a^Ty\le3$, then $a^T(0.25x+0.75y)\le3$; the inequality stays feasible.
5. **Fairness constraint**: two models with violation rates $0.02$ and $0.04$ average to $0.03$, meeting a $0.05$ cap.
6. **Embedding interpolation**: two normalized mixture weights average to a valid mixture, e.g. $(0.6,0.4)$ and $(0.2,0.8)$ give $(0.4,0.6)$.

### `math-22-03` — Convex functions  · AUTHOR derivation

**Connections (§1).**
> This lesson moves from convex feasible sets to convex objectives. Earlier lessons described lines and gradients; now those tools describe a function whose graph bends upward in a controlled way. Convex functions are the main reason many optimization problems can be solved reliably. They connect local slope information to global statements about the whole objective.

**Motivation & Intuition (§2).**
> A convex function lies below the chord joining any two points on its graph. For optimization, that means there are no hidden lower valleys between points that the function averages over. If a method finds a point where the slope vanishes, convexity can turn that local condition into a global optimality certificate.
>
> The most useful analytic form is the first-order lower bound. At any point $x$, the tangent plane supports the function from below. The derivation restricts the function to the line from $x$ to $y$, applies the one-dimensional convex tangent inequality, and then translates the result back to the original variables.

**Definition & Assumptions (§3).** First-order lower bound for differentiable convex $f$:
1. Define $\phi(t)=f(x+t(y-x))$ for $t\in[0,1]$ — restrict $f$ to the line from $x$ to $y$.
2. Convexity of $f$ makes $\phi$ convex — a convex function stays convex on a line.
3. For a one-dimensional convex differentiable function, $\phi(1)\ge\phi(0)+\phi'(0)$ — the tangent is a global lower bound.
4. Compute $\phi'(0)=\nabla f(x)^T(y-x)$ — chain rule along the line.
5. Substitute to get $f(y)\ge f(x)+\nabla f(x)^T(y-x)$ — the tangent plane sits below the graph.

**Symbols.** $f$ is the objective; $x,y$ are points; $t$ is a line parameter; $\nabla f(x)$ is the gradient; $\phi$ is the one-dimensional slice.

**Real-World Applications (§5).**
1. **Quadratic lower bound**: for $f(w)=(w-4)^2$, at $x=1$ and $y=3$, $f(3)=1\ge9-6(2)=-3$.
2. **Global certificate**: if $\nabla f(x)=0$ for convex $f$, then $f(y)\ge f(x)$ for every $y$; stationarity is enough.
3. **Jensen loss mix**: $f(w)=w^2$, $w_1=1,w_2=3$, $t=0.5$ gives $f(2)=4\le(1+9)/2=5$.
4. **Logistic-loss safety**: averaging two parameter vectors cannot make a convex regularized objective exceed the averaged objective.
5. **Epigraph check**: $f(2)=4$ and $f(4)=16$ imply midpoint chord value $10$, while $f(3)=9\le10$.
6. **No spurious local minima**: if a point is locally minimal for convex $f$, the tangent lower-bound argument makes it globally minimal.

### `math-22-04` — Optimality conditions (unconstrained)  · deepen derivation

**Connections (§1).**
> This lesson uses gradients, Hessians, and one-dimensional calculus to describe what must happen at a smooth unconstrained minimum. The key point is local: if a point is truly a minimum, then no tiny movement in any direction should reduce the objective. That condition forces the gradient to vanish. The Hessian then describes whether the surface bends upward around the stationary point.

**Motivation & Intuition (§2).**
> Gradient descent tries to reduce a loss by following a direction where the gradient points downhill. At a smooth unconstrained minimum, that downhill direction cannot exist. If the gradient were nonzero, moving a little in the negative-gradient direction would lower the objective, contradicting the claim that the point is locally minimal.
>
> Vanishing gradient alone is not enough. A saddle can also have zero gradient, but it bends upward in some directions and downward in others. The second-order condition captures this by checking the Hessian along every direction. At a local minimum, every one-dimensional slice through the point must have nonnegative second derivative.

**Definition & Assumptions (§3).** First- and second-order conditions:
1. Suppose $x^*$ is a local minimizer — nearby points have no smaller value.
2. For any direction $u$, define $\phi(t)=f(x^*+tu)$ — inspect a line through the point.
3. Since $t=0$ minimizes $\phi$ locally, $\phi'(0)=0$ — one-dimensional calculus.
4. Compute $\phi'(0)=\nabla f(x^*)^Tu$ — chain rule.
5. Because this equals $0$ for every $u$, choose $u=\nabla f(x^*)$ to get $\Vert\nabla f(x^*)\Vert^2=0$ — hence $\nabla f(x^*)=0$.
6. Also $\phi''(0)=u^T\nabla^2f(x^*)u\ge0$ — a one-dimensional local minimum has nonnegative second derivative.
7. Therefore the Hessian is positive semidefinite at a smooth local minimizer.

**Symbols.** $x^*$ is a candidate optimum; $u$ is any direction; $\nabla f$ is the gradient; $\nabla^2 f$ or $H$ is the Hessian.

**Real-World Applications (§5).**
1. **Quadratic minimizer**: $f(w)=(w-4)^2$ has gradient $2(w-4)=0$, so $w^*=4$.
2. **Saddle diagnosis**: $f(x,y)=x^2-y^2$ has gradient $0$ at $(0,0)$ but Hessian diag$(2,-2)$, so it is not a minimum.
3. **Least squares normal equation**: $\nabla \tfrac12\Vert Xw-y\Vert^2=X^T(Xw-y)=0$.
4. **Ridge solution**: if $X^TX=3$ and $\lambda=1$, $X^Ty=8$, then $(3+1)w=8$ gives $w=2$.
5. **Flat direction**: Hessian diag$(2,0)$ means no curvature in one direction, so the condition is inconclusive.
6. **Logistic optimum check**: if a reported model has gradient norm $10^{-5}$, it is nearly stationary.

### `math-22-05` — Gradient descent  · deepen derivation

**Connections (§1).**
> This lesson builds on the gradient and on the first-order Taylor approximation. The gradient tells the local
> direction in which a loss increases fastest. Taylor's formula tells how a small step changes the loss to
> first order. Put those together, and the update rule for gradient descent becomes a direct consequence rather
> than a rule to memorize.
>
> This is also the central optimizer pattern for the rest of the section. Momentum changes how steps are
> accumulated, SGD changes how the gradient is estimated, adaptive methods rescale the step coordinate by
> coordinate, and Newton-type methods replace the first-order local model with a second-order one. The plain
> gradient descent step is the baseline those refinements modify.

**Motivation & Intuition (§2).**
> Training a model means choosing parameters that make a loss small. At a current parameter value $w$, the
> optimizer usually does not know the whole loss surface. It only has local information: the value of the loss
> and its gradient. Gradient descent uses that local information in the most direct way. If $\nabla f(w)$ points
> uphill, then $-\nabla f(w)$ points downhill, so a small step in that direction should reduce the loss.
>
> The learning rate $\rho$ controls how much trust the optimizer puts in this local picture. A tiny $\rho$ is
> cautious and may require many steps. A very large $\rho$ can jump past the low point and increase the loss.
> On the simple loss $f(w)=(w-4)^2$, starting from $w_0=0$ with $\rho=0.25$ gives $w_1=2$, $w_2=3$, and
> $w_3=3.5$. The iterates move halfway from the current value to the minimizer each time, so the loss drops
> from $16$ to $4$ to $1$ to $0.25$.

**Definition & Assumptions (§3).** Display
$$
w_{k+1}=w_k-\rho \nabla f(w_k).
$$
Then derive it from the local linear model:
1. Start with the first-order Taylor approximation $f(w+s)\approx f(w)+\nabla f(w)^\top s$ — for a small step $s$, the gradient gives the linear change in loss.
2. Restrict to steps with fixed length $\Vert s\Vert=\rho$ — otherwise the linear model would prefer an infinitely long downhill step.
3. Write $s=\rho u$ with $\Vert u\Vert=1$ — this separates step size from direction.
4. Substitute to get $f(w+\rho u)\approx f(w)+\rho \nabla f(w)^\top u$ — only the dot product depends on direction.
5. Use Cauchy--Schwarz: $\nabla f(w)^\top u\ge -\Vert\nabla f(w)\Vert$ — the smallest possible dot product occurs when $u$ points opposite the gradient.
6. The minimizing unit direction is $u=-\nabla f(w)/\Vert\nabla f(w)\Vert$ — this is the steepest local decrease direction.
7. Absorb the gradient length into the step coefficient by choosing $s=-\rho\nabla f(w)$ — practical gradient descent uses a learning rate multiplying the whole gradient.
8. Add the step to the current point: $w_{k+1}=w_k+s=w_k-\rho\nabla f(w_k)$ — this is the update rule.
9. For $f(w)=(w-4)^2$, compute $\nabla f(w)=2(w-4)$ — differentiate the scalar quadratic.
10. With $w_0=0$ and $\rho=0.25$, get $w_1=0-0.25(-8)=2$ — one explicit step verifies the rule.

**Symbols.** $w_k$ is the parameter vector after $k$ updates; $f$ is the objective or loss; $\nabla f(w_k)$ is the gradient at the current parameters; $\rho>0$ is the learning rate; $s$ is the proposed step; $u$ is a unit direction; $\Vert\nabla f(w_k)\Vert$ is the local steepness. Assume $f$ is differentiable near $w_k$ and $\rho$ is small enough that the local model is useful.

**Real-World Applications (§5).**
1. **Quadratic training step** — for $f(w)=(w-4)^2$, $w_0=0$, and $\rho=0.25$, the gradient is $-8$, so $w_1=2$ and the loss drops from $16$ to $4$.
2. **Three-step loss check** — the same run gives $w_2=3$, $w_3=3.5$, and $f(w_3)=0.25$, showing the half-distance pattern.
3. **Too-large learning rate** — with $\rho=1.1$, $w_1=8.8$ and $f(w_1)=23.04$, so the loss increases from $16$; the update rule exposes overshoot.
4. **Linear-regression gradient** — for $L(w)=\tfrac12(2w-6)^2$, $\nabla L=2(2w-6)$. At $w=0$ and $\rho=0.1$, $w^+=1.2$.
5. **Vector weight update** — for $g=(3,-4)$ and $\rho=0.05$, the update is $w^+=w-(0.15,-0.20)$; the step length is $0.05\cdot5=0.25$.
6. **Fine-tuning scale** — if an adapter gradient norm is $0.8$ and $\rho=2\times10^{-4}$, the parameter step norm is $1.6\times10^{-4}$.

### `math-22-06` — Convergence rates  · AUTHOR derivation

**Connections (§1).**
> This lesson follows directly from gradient descent. The update rule tells where the next iterate goes; a convergence rate tells how quickly the iterates approach the optimum. For smooth strongly convex losses, the distance to the optimum can shrink by a fixed factor at each step. That makes progress measurable before running an optimizer indefinitely.

**Motivation & Intuition (§2).**
> Optimization is not only about choosing a direction. It is also about understanding how much improvement to expect after many repeated updates. A convergence rate turns the repeated update into a bound on the remaining error. In the simplest quadratic case, the whole story is visible from one scalar recurrence.
>
> Strong convexity supplies enough upward curvature to pull the iterate toward a unique minimum, while smoothness limits how abruptly the gradient can change. When the step size is chosen from the smoothness scale, the error is multiplied by a factor less than one. A smaller factor means faster convergence; a poor condition number makes the factor close to one and progress slow.

**Definition & Assumptions (§3).** Scalar strongly convex quadratic $f(w)=\tfrac12 a(w-w^*)^2$:
1. Compute the gradient $\nabla f(w)=a(w-w^*)$ — differentiate the quadratic.
2. Apply gradient descent $w_{k+1}=w_k-\rho a(w_k-w^*)$ — substitute the gradient.
3. Subtract $w^*$: $w_{k+1}-w^*=(1-\rho a)(w_k-w^*)$ — isolate the error.
4. Take absolute values: $|w_{k+1}-w^*|=|1-\rho a| |w_k-w^*|$ — one step multiplies error.
5. Iterate the recurrence: $|w_k-w^*|=|1-\rho a|^k |w_0-w^*|$ — repeated multiplication.
6. For a general $\mu$-strongly convex, $L$-smooth objective with $\rho=1/L$, the analogous factor is at most $1-\mu/L$.

**Symbols.** $\mu$ is strong convexity; $L$ is gradient Lipschitz smoothness; $\kappa=L/\mu$ is condition number; $w^*$ is the optimum; $k$ is iteration count.

**Real-World Applications (§5).**
1. **Exact scalar rate**: for $a=2$ and $\rho=0.25$, the error factor is $0.5$ per step.
2. **Six-step bound**: from initial loss $16$, the factor $0.5^6$ gives loss bound $0.25$.
3. **Condition number effect**: $\mu=1,L=10$ gives factor $0.9$ with $\rho=0.1$.
4. **Iteration planning**: $0.9^{44}\approx0.0097$, so about $44$ steps reduce error below $1\%$.
5. **Better conditioning**: if scaling improves $L/\mu$ from $100$ to $10$, the factor improves from $0.99$ to $0.9$.
6. **Early-stopping readout**: loss ratio $0.25$ after two steps matches a per-step error factor $0.5$ and loss factor $0.25$ on the quadratic.

### `math-22-07` — Line search methods  · AUTHOR derivation

**Connections (§1).**
> This lesson keeps the descent direction from gradient-based methods but changes how the step length is chosen. Instead of fixing one learning rate ahead of time, line search studies the objective along a single line. That turns a multivariable choice into a one-dimensional problem. Later damped Newton and quasi-Newton methods use the same idea to make large steps safer.

**Motivation & Intuition (§2).**
> A direction can be good while a step length is poor. Moving too little wastes progress, while moving too far can pass the valley and increase the loss. Line search separates those two decisions: first choose a direction $p$, then choose a scalar $\alpha$ that says how far to travel along that direction.
>
> For a quadratic objective, exact line search can be derived by substituting $x+\alpha p$ into the objective and minimizing the resulting one-variable quadratic. In more general training loops, exact minimization may be too expensive, so backtracking and Armijo checks look for enough decrease rather than the perfect line minimum.

**Definition & Assumptions (§3).** Exact line search for a quadratic $f(x)=\tfrac12x^TAx-b^Tx$ along direction $p$:
1. Define $\phi(\alpha)=f(x+\alpha p)$ — restrict the objective to the line.
2. Expand $\phi(\alpha)=\tfrac12(x+\alpha p)^TA(x+\alpha p)-b^T(x+\alpha p)$ — substitute the line.
3. Differentiate: $\phi'(\alpha)=p^T(Ax-b)+\alpha p^TAp$ — collect the linear terms in $\alpha$.
4. Recognize $g=Ax-b$ — this is the gradient at $x$.
5. Set $\phi'(\alpha)=0$ for the line minimum — one-dimensional optimality.
6. Solve $\alpha^*=-p^Tg/(p^TAp)$ — isolate the step length.

**Symbols.** $\alpha$ is the line-search step; $p$ is the search direction; $g$ is the current gradient; $A$ is the quadratic curvature matrix.

**Real-World Applications (§5).**
1. **Steepest descent line step**: for $f(w)=(w-4)^2$, $w=0$, $p=8$, exact $\alpha=0.5$ reaches $w=4$.
2. **Quadratic matrix case**: $g=(-2,-4)$, $p=(2,4)$, $A=I$ gives $\alpha=20/20=1$.
3. **Backtracking**: with $f(0)=16$, $g=-8$, $p=8$, $\alpha=1$ gives $f(8)=16$ not enough decrease; $\alpha=0.5$ gives $0$.
4. **Armijo threshold**: if $c=10^{-4}$, $\alpha=0.25$, and $g^Tp=-64$, required decrease is at least $0.0016$.
5. **Training-loop tuning**: a line search choosing $\alpha=0.05$ along a gradient norm $10$ takes step norm $0.5$.
6. **Newton line search**: if full Newton increases validation loss, halving $\alpha$ changes step $(-2,1)$ into $(-1,0.5)$.

### `math-22-08` — Momentum  · deepen derivation

**Connections (§1).**
> This lesson modifies the gradient descent baseline by adding memory. Plain gradient descent reacts only to the current gradient, while momentum also remembers recent directions. That makes the update less sensitive to one noisy or alternating slope. The idea prepares the way for Nesterov acceleration and for adaptive optimizers that also keep running averages.

**Motivation & Intuition (§2).**
> Loss surfaces often have narrow valleys. In such regions, gradients can alternate across the valley while still pointing consistently along the valley floor. Plain gradient descent may zig-zag because each step responds to the newest gradient without remembering that some directions keep reversing.
>
> Momentum stores a velocity that blends past gradients with the current one. Directions that agree over several steps accumulate, while directions that flip sign partly cancel. The parameter update then moves against this accumulated velocity, so the method can be smoother than using the latest gradient alone.

**Definition & Assumptions (§3).** Heavy-ball update:
1. Store a velocity $v_k$ — this variable remembers past gradient directions.
2. Blend old velocity and current gradient: $v_{k+1}=\beta v_k+\nabla f(w_k)$ — $\beta$ controls memory.
3. Move against the velocity: $w_{k+1}=w_k-\rho v_{k+1}$ — the accumulated direction becomes the step.
4. Unroll once: $v_{k+1}=\nabla f(w_k)+\beta\nabla f(w_{k-1})+\beta^2v_{k-1}$ — recent gradients get geometrically decaying weights.
5. If gradients keep the same sign, the velocity magnitude grows; if they alternate, the blend cancels part of the motion.

**Symbols.** $v_k$ is velocity; $\beta\in[0,1)$ is momentum; $\rho$ is learning rate; $w_k$ is the parameter vector.

**Real-World Applications (§5).**
1. **First momentum step**: for $f(w)=(w-4)^2$, $w_0=0$, $\beta=0.9$, $\rho=0.1$, $v_1=-8$, so $w_1=0.8$.
2. **Second step**: gradient at $0.8$ is $-6.4$, so $v_2=-13.6$ and $w_2=2.16$.
3. **Third step**: gradient at $2.16$ is $-3.68$, so $v_3=-15.92$ and $w_3=3.752$.
4. **Zig-zag damping**: gradients $(5,-5)$ with $\beta=0.9$ give $v_2=-0.5$, much smaller than $5$.
5. **Memory weight**: a gradient from three steps ago has weight $\beta^3=0.729$ when $\beta=0.9$.
6. **Step norm**: if $\Vert v\Vert=12$ and $\rho=0.01$, the update length is $0.12$.

### `math-22-09` — Nesterov acceleration  · AUTHOR derivation

**Connections (§1).**
> This lesson follows momentum by changing where the gradient is evaluated. Heavy-ball momentum uses the slope at the current point and then moves with accumulated velocity. Nesterov acceleration first looks ahead in the direction the velocity is already carrying the parameters. This connects naturally to the idea of correcting a step before it overshoots.

**Motivation & Intuition (§2).**
> Momentum can move quickly when gradients agree, but near a valley it may keep pushing in a direction that is about to become too large. Nesterov's method addresses this by computing the gradient at the anticipated next location rather than at the current one. The optimizer uses information from where the momentum is taking it.
>
> The update still has a velocity and a learning rate, so it remains close to ordinary momentum. The important change is the lookahead point $y_k$. If the slope at that future point has already weakened or changed sign, the velocity is corrected earlier, which can reduce overshoot around curved valleys.

**Definition & Assumptions (§3).** Lookahead update in velocity form:
1. Keep a velocity $v_k$ — it stores the current motion.
2. Form the lookahead point $y_k=w_k-\beta v_k$ — this is where momentum alone would move next.
3. Evaluate the gradient $\nabla f(y_k)$ — use the slope at the anticipated point.
4. Update velocity $v_{k+1}=\beta v_k+\rho\nabla f(y_k)$ — combine memory and lookahead gradient.
5. Move $w_{k+1}=w_k-v_{k+1}$ — subtract the corrected velocity.
6. Compared with heavy-ball momentum, the gradient location changes from $w_k$ to $y_k$, giving earlier correction near a valley.

**Symbols.** $w_k$ is the current point; $y_k$ is the lookahead point; $v_k$ is velocity; $\beta$ is momentum; $\rho$ is learning rate.

**Real-World Applications (§5).**
1. **First Nesterov step**: from $w_0=0,v_0=0$, $f(w)=(w-4)^2$, $\beta=0.9$, $\rho=0.1$, gradient $-8$ gives $v_1=-0.8$ and $w_1=0.8$.
2. **Lookahead second step**: $y_1=0.8-0.9(-0.8)=1.52$, gradient $-4.96$, $v_2=-1.216$, and $w_2=2.016$.
3. **Correction size**: heavy-ball used gradient $-6.4$ at $0.8$; Nesterov uses $-4.96$, a smaller correction by $1.44$.
4. **Lookahead distance**: if $\Vert v\Vert=0.5$ and $\beta=0.9$, the lookahead is $0.45$ units away.
5. **Learning-rate step**: with gradient norm $4.96$ and $\rho=0.1$, the fresh gradient contribution has norm $0.496$.
6. **Valley braking**: if the lookahead gradient flips from $-3$ to $+1$, the velocity update is reduced by $0.1$ in the forward direction.

### `math-22-10` — Subgradients  · deepen derivation

**Connections (§1).**
> This lesson extends the gradient idea to convex functions with corners. Earlier optimality conditions used ordinary derivatives, but losses and penalties such as absolute value, hinge loss, and ReLU are not smooth everywhere. A subgradient keeps the first-order lower-bound idea alive at those nonsmooth points. That makes nonsmooth optimization possible without pretending every objective has a classical derivative.

**Motivation & Intuition (§2).**
> At a smooth point, the tangent line gives the local slope. At a corner, there may be many supporting lines rather than one tangent. A subgradient is any slope that stays below the convex function everywhere when anchored at the point of interest.
>
> The absolute value function at zero is the cleanest example. Its left derivative is $-1$ and its right derivative is $1$, and every slope between them supports the V-shaped graph from below. This interval of valid slopes becomes the subdifferential, which can be used in optimality certificates and subgradient steps.

**Definition & Assumptions (§3).** Subdifferential of $f(x)=|x|$ at $0$:
1. A number $g$ is a subgradient at $0$ if $|y|\ge |0|+g(y-0)$ for every $y$.
2. Simplify to $|y|\ge gy$ — $|0|=0$.
3. For $y>0$, divide by $y$ to get $1\ge g$ — positive directions bound $g$ above.
4. For $y<0$, divide by the negative number $y$ and reverse the inequality to get $-1\le g$.
5. Combine the bounds: $g\in[-1,1]$.
6. Therefore $\partial |0|=[-1,1]$ — every slope between the left and right derivatives supports the corner.

**Symbols.** $\partial f(x)$ is the set of subgradients; $g$ is one subgradient; $y$ is a comparison point.

**Real-World Applications (§5).**
1. **L1 penalty at zero**: $\partial |0|=[-1,1]$, so gradient $0.3$ from the smooth loss can be canceled by L1 with $\lambda=0.5$ because $-0.6\in[-1,1]$.
2. **L1 away from zero**: at $x=3$, the subgradient of $|x|$ is $1$.
3. **Hinge loss**: for $\max(0,1-yw^Tx)$ at margin $0.7$, subgradient is $-yx$; at margin $1.2$, it is $0$.
4. **ReLU corner**: at input $0$, any slope in $[0,1]$ is a valid subgradient choice.
5. **Subgradient step**: for $|x|$ at $x=2$, step $\rho=0.4$ gives $x^+=1.6$.
6. **Optimality certificate**: $0\in\partial |0|$, so $x=0$ minimizes $|x|$.

### `math-22-11` — Nonsmooth optimization  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on subgradients and applies them to objectives made from corners, maxima, and piecewise formulas. Many machine-learning losses are smooth only in pieces. Nonsmooth optimization keeps a usable descent signal by choosing from active gradients or their convex combinations. The lesson also prepares for proximal methods, which handle some nonsmooth terms by solving a small exact subproblem.

**Motivation & Intuition (§2).**
> A max objective changes behavior depending on which piece is largest. Away from a tie, the active piece supplies the slope. At a tie, several pieces are active, and the set of valid first-order signals can include combinations of their gradients.
>
> The main idea is still the convex lower-bound property. If an active component supports itself from below, and the maximum is at least that component everywhere, then the active gradient supports the maximum. This gives an optimization method a principled slope-like object even when the ordinary gradient is not unique.

**Definition & Assumptions (§3).** Subgradient of a maximum $f(x)=\max_i f_i(x)$:
1. Let $A(x)=\{i:f_i(x)=f(x)\}$ — active indices attain the maximum.
2. For any active $i$, convexity gives $f_i(y)\ge f_i(x)+\nabla f_i(x)^T(y-x)$ — tangent lower bound for that piece.
3. Since $f(y)=\max_j f_j(y)\ge f_i(y)$ — the maximum is at least any piece.
4. Combine to get $f(y)\ge f(x)+\nabla f_i(x)^T(y-x)$ — an active gradient supports the max.
5. Therefore every active gradient is a subgradient; convex combinations of active gradients are also subgradients because the inequality is preserved by averaging.

**Symbols.** $f_i$ are smooth component functions; $A(x)$ is the active set; $\partial f(x)$ is the subdifferential.

**Real-World Applications (§5).**
1. **Max loss**: $f(x)=\max(x,2x-1)$ at $x=1$ has both pieces active and subgradients in $[1,2]$.
2. **Hinge objective**: if margin is $0.4$, the active hinge piece gives subgradient $-yx$.
3. **Worst-case robust loss**: losses $(0.8,1.2,0.9)$ activate the second example only.
4. **Minibatch max**: two active examples with gradients $(1,0)$ and $(0,3)$ allow average subgradient $(0.5,1.5)$.
5. **Absolute value as max**: $|x|=\max(x,-x)$; at $0$, active slopes $1$ and $-1$ give interval $[-1,1]$.
6. **Step with active gradient**: for $f(x)=\max(x,2x-1)$ at $x=2$, active slope $2$ and $\rho=0.1$ give $x^+=1.8$.

### `math-22-12` — Proximal methods  · AUTHOR derivation

**Connections (§1).**
> This lesson follows nonsmooth optimization by showing a different way to handle a nonsmooth term. Instead of taking an arbitrary subgradient step, a proximal method solves a small local problem exactly. The method is especially useful for penalties such as L1 regularization. It connects optimization updates to sparsity through the soft-thresholding operator.

**Motivation & Intuition (§2).**
> In a regularized problem, the smooth loss may suggest a gradient step to a point $v$, while the nonsmooth penalty may prefer shrinking or zeroing coordinates. A proximal step balances those two forces. It stays near $v$ but pays the penalty cost exactly in the local subproblem.
>
> For the L1 penalty, this balance has a simple form. Large positive values are pulled down by $\lambda$, large negative values are pulled up by $\lambda$, and small values are set exactly to zero. The derivation checks the positive, negative, and zero cases separately, which is why soft-thresholding naturally appears.

**Definition & Assumptions (§3).** Proximal operator of $\lambda |x|$:
1. Define $\operatorname{prox}_{\lambda|\cdot|}(v)=\arg\min_x \tfrac12(x-v)^2+\lambda|x|$ — stay near $v$ while paying L1 cost.
2. For $x>0$, derivative is $x-v+\lambda$ — $|x|=x$.
3. Set derivative $0$ to get $x=v-\lambda$ — valid only when $v>\lambda$.
4. For $x<0$, derivative is $x-v-\lambda$ — $|x|=-x$.
5. Set derivative $0$ to get $x=v+\lambda$ — valid only when $v<-\lambda$.
6. For $x=0$, optimality requires $0\in -v+\lambda[-1,1]$ — the subgradient at the kink must contain zero.
7. This holds when $|v|\le\lambda$.
8. Combine cases: $\operatorname{prox}_{\lambda|\cdot|}(v)=\operatorname{sign}(v)\max(|v|-\lambda,0)$.

**Symbols.** $v$ is the point after the smooth gradient step; $\lambda$ is penalty strength; $\operatorname{prox}$ is the proximal operator.

**Real-World Applications (§5).**
1. **Soft threshold large weight**: $v=3$, $\lambda=0.4$ gives $2.6$.
2. **Soft threshold small weight**: $v=0.2$, $\lambda=0.4$ gives $0$.
3. **Sparse vector**: applying $\lambda=0.5$ to $(1.2,-0.3,0.7)$ gives $(0.7,0,0.2)$.
4. **ISTA step**: if smooth gradient step gives $v=1.1$ and $\lambda\rho=0.2$, the L1 prox gives $0.9$.
5. **Denoising coefficient**: wavelet coefficient $-0.9$ with threshold $0.25$ becomes $-0.65$.
6. **Group shrink analogy**: vector norm $5$ with threshold $1$ scales by $1-1/5=0.8$.

### `math-22-13` — Stochastic gradient descent (SGD)  · deepen derivation

**Connections (§1).**
> This lesson returns to gradient descent and changes how the gradient is obtained. Full-batch gradient descent uses every example before taking one step. SGD uses one example or a minibatch, making each update cheaper and noisier. That tradeoff is central to large-scale machine learning and leads naturally to variance reduction and adaptive optimizers.

**Motivation & Intuition (§2).**
> When a dataset is large, computing the full gradient can be expensive. SGD replaces that full average with a randomly sampled example or minibatch. The step may not point exactly in the full-gradient direction, but it can be computed quickly and repeated many times.
>
> The key mathematical comfort is unbiasedness. If the example is sampled uniformly, the expected sampled gradient equals the full empirical gradient. The noise can make individual steps move in imperfect directions, but over repeated fair samples the update is centered on the same direction as full gradient descent.

**Definition & Assumptions (§3).** Unbiased minibatch gradient:
1. Write the empirical loss $F(w)=\tfrac1n\sum_{i=1}^n f_i(w)$ — average over examples.
2. Differentiate: $\nabla F(w)=\tfrac1n\sum_i \nabla f_i(w)$ — gradient of an average is the average gradient.
3. Sample index $I$ uniformly from $\{1,\dots,n\}$ — each example has probability $1/n$.
4. Take expectation: $\mathbb E[\nabla f_I(w)]=\sum_i (1/n)\nabla f_i(w)$ — definition of expectation.
5. Therefore $\mathbb E[\nabla f_I(w)]=\nabla F(w)$ — the single-example gradient is unbiased.
6. For minibatch $B$, averaging sampled gradients keeps the same expectation and reduces variance.

**Symbols.** $F$ is full empirical loss; $f_i$ is one-example loss; $I$ is a random index; $B$ is a minibatch; $\eta$ is the SGD learning rate.

**Real-World Applications (§5).**
1. **Unbiased scalar sample**: gradients $-6$ and $-10$ average to $-8$, matching the full gradient.
2. **One SGD step**: from $w=0$, sample gradient $-6$ and $\eta=0.1$ gives $w^+=0.6$.
3. **Minibatch average**: gradients $(-6,-10,-8,-4)$ average to $-7$.
4. **Variance reduction by batch**: if single-gradient variance is $16$, batch size $4$ reduces variance to $4$.
5. **Epoch accounting**: $1000$ examples with batch size $50$ gives $20$ updates per epoch.
6. **Noisy direction**: if full gradient is $-8$ but one sample gives $+2$, the step can briefly move uphill while remaining unbiased over samples.

### `math-22-14` — Variance reduction (SVRG, SAG)  · deepen derivation

**Connections (§1).**
> This lesson follows SGD by reducing one of its main costs: gradient noise. SGD is cheap because it samples, but that sampling creates variance. Variance-reduced methods keep stochastic updates while adding stored or reference information. The result is a gradient estimate that remains inexpensive but becomes more stable near the optimum.

**Motivation & Intuition (§2).**
> A stochastic gradient can be far from the full gradient for a particular sampled example. SVRG corrects this by comparing the sampled gradient at the current point with the same sampled gradient at a snapshot point. It then adds back the exact full gradient at the snapshot.
>
> This construction keeps the estimator centered on the true gradient at the current point. Near the snapshot, the difference term can be small, so the variance is reduced. SAG uses stored gradients differently, but the shared goal is the same: avoid paying for a full gradient at every step while making the stochastic direction less noisy.

**Definition & Assumptions (§3).** SVRG estimator:
1. Choose a snapshot point $\tilde w$ — this is where the full gradient will be computed.
2. Compute $\mu=\nabla F(\tilde w)=\tfrac1n\sum_i \nabla f_i(\tilde w)$ — exact reference gradient.
3. At current $w$, sample $i$ and form $g_i(w)=\nabla f_i(w)-\nabla f_i(\tilde w)+\mu$ — replace the old sample gradient with its change plus the full reference.
4. Take expectation over $i$: $\mathbb E[g_i(w)]=\tfrac1n\sum_i\nabla f_i(w)-\tfrac1n\sum_i\nabla f_i(\tilde w)+\mu$.
5. Substitute $\mu=\tfrac1n\sum_i\nabla f_i(\tilde w)$ — reference terms cancel.
6. Therefore $\mathbb E[g_i(w)]=\nabla F(w)$ — the estimator is unbiased.

**Symbols.** $\tilde w$ is the snapshot; $\mu$ is the full gradient at the snapshot; $g_i(w)$ is the corrected stochastic gradient.

**Real-World Applications (§5).**
1. **SVRG scalar check**: at $w$, sample gradient $-5$; at snapshot, same sample gradient $-7$; full snapshot gradient $-8$ gives estimator $-6$.
2. **Unbiased average**: sample pairs $(-5,-7)$ and $(-11,-9)$ with $\mu=-8$ give estimators $-6$ and $-10$, average $-8$.
3. **Step from estimator**: with $\eta=0.1$ and $g=-6$, $w^+=w+0.6$.
4. **SAG memory average**: stored gradients $(-6,-10,-8,-4)$ average to $-7$.
5. **Updating one memory slot**: replacing $-4$ by $-12$ changes the average from $-7$ to $-9$.
6. **Near-snapshot variance**: if $\nabla f_i(w)-\nabla f_i(\tilde w)=0.2$ and $\mu=-1$, estimator is $-0.8$.

### `math-22-15` — AdaGrad  · deepen derivation

**Connections (§1).**
> This lesson begins the adaptive optimizer family. Gradient descent and SGD use one learning-rate scale for all coordinates. AdaGrad changes that by tracking how much gradient each coordinate has accumulated. Coordinates with large historical gradients receive smaller future steps, while rarely active coordinates can keep larger effective steps.

**Motivation & Intuition (§2).**
> In high-dimensional models, not every parameter behaves the same way. Some coordinates receive frequent large gradients, while sparse features may be updated only occasionally. A single global learning rate can be too large for one coordinate and too small for another.
>
> AdaGrad stores the coordinatewise sum of squared gradients. Dividing by the square root of that history normalizes future steps by past activity. The price is that the accumulated sum only grows, so effective learning rates can become very small after many updates.

**Definition & Assumptions (§3).** Coordinate update:
1. Observe gradient $g_k$ — this may have one component per parameter.
2. Accumulate squared gradients $G_k=G_{k-1}+g_k\odot g_k$ — each coordinate stores total past squared slope.
3. Take square roots $\sqrt{G_k+\epsilon}$ — this converts accumulated squared units back to gradient scale and avoids division by zero.
4. Rescale the gradient coordinatewise: $g_k/(\sqrt{G_k}+\epsilon)$ — frequently large coordinates are damped.
5. Update $w_{k+1}=w_k-\eta g_k/(\sqrt{G_k}+\epsilon)$ — apply the adaptive step.

**Symbols.** $g_k$ is the current gradient; $G_k$ is the coordinatewise sum of squared gradients; $\odot$ is elementwise multiplication; $\eta$ is the base learning rate; $\epsilon$ is a small stabilizer.

**Real-World Applications (§5).**
1. **First scalar step**: $g_1=-8$, $G_1=64$, $\eta=1$ gives step $-1$, so $w_1=1$.
2. **Second scalar step**: $g_2=-4$, $G_2=80$, step $-4/\sqrt{80}=-0.447$, so $w_2=1.447$.
3. **Sparse feature**: coordinate with $G=1$ and $g=1$ steps by $1$, while coordinate with $G=100$ steps by $0.1$.
4. **Embedding update**: rare token gradient norm $0.5$ with history $0.25$ gets normalized step $1.0\eta$.
5. **Learning-rate decay**: repeated gradient $2$ for $4$ steps gives $G=16$ and effective scale $1/4$.
6. **Zero-gradient coordinate**: $g=0$ gives zero parameter change no matter how small $G$ is.

### `math-22-16` — RMSProp  · deepen derivation

**Connections (§1).**
> This lesson continues adaptive optimization after AdaGrad. AdaGrad's accumulated squared-gradient history never forgets, which can make learning rates shrink too much. RMSProp keeps the coordinatewise scaling idea but replaces the total history with an exponential moving average. That lets the optimizer respond to recent gradient scale.

**Motivation & Intuition (§2).**
> The useful part of AdaGrad is coordinatewise normalization: large-gradient coordinates should often take smaller steps. The difficult part is permanent accumulation. A coordinate that had large gradients early may continue to be damped long after the loss surface has changed.
>
> RMSProp solves this by giving recent squared gradients more weight and older squared gradients geometrically less weight. The denominator estimates recent root-mean-square gradient size. Dividing by that estimate makes steps smaller in recently steep coordinates while allowing old history to fade.

**Definition & Assumptions (§3).** RMSProp update:
1. Observe gradient $g_k$ — current stochastic slope.
2. Update the second-moment average $r_k=\rho r_{k-1}+(1-\rho)g_k\odot g_k$ — blend old squared scale with current squared gradient.
3. Divide by $\sqrt{r_k+\epsilon}$ — coordinates with large recent RMS gradients get smaller steps.
4. Update $w_{k+1}=w_k-\eta g_k/\sqrt{r_k+\epsilon}$ — use the rescaled gradient.
5. Since weights decay geometrically, a squared gradient from $m$ steps ago has weight $(1-\rho)\rho^m$.

**Symbols.** $r_k$ is the moving average of squared gradients; $\rho$ is the decay rate; $\eta$ is base learning rate; $\epsilon$ prevents division by zero.

**Real-World Applications (§5).**
1. **First RMSProp scale**: with $g_1=-8$, $\rho=0.9$, $r_1=6.4$.
2. **First step**: with $\eta=0.1$, step is $0.1(-8)/\sqrt{6.4}=-0.316$, so subtracting it moves $w$ by $+0.316$.
3. **Second scale**: $g_2=-4$ gives $r_2=0.9(6.4)+0.1(16)=7.36$.
4. **Second step**: $0.1(-4)/\sqrt{7.36}=-0.147$.
5. **Forgetting**: a squared gradient's weight after $5$ steps is $0.1(0.9)^5\approx0.059$.
6. **Coordinate damping**: if $r_1=100$ and $r_2=1$ for equal gradients $1$, the first coordinate step is one tenth the second.

### `math-22-17` — Adam  · deepen derivation

**Connections (§1).**
> This lesson combines the two running-average ideas already introduced. Momentum tracks an average of gradients, and RMSProp tracks an average of squared gradients. Adam uses both, then corrects the early-time bias caused by starting those averages at zero. It is one of the most common optimizer updates in modern neural-network training.

**Motivation & Intuition (§2).**
> The first moment in Adam behaves like momentum: it smooths the direction of travel by averaging gradients. The second moment behaves like RMSProp: it estimates the recent squared scale of each coordinate. The update divides the smoothed direction by the root of the smoothed squared scale.
>
> Because both moving averages start at zero, their early values are too small in magnitude. Bias correction divides by the accumulated weight so that the first few estimates are on the right scale. Without that correction, the initial steps would not represent the intended moving averages.

**Definition & Assumptions (§3).** Adam update:
1. Update first moment $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$ — exponential average of gradients.
2. Update second moment $v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2$ — exponential average of squared gradients.
3. Because $m_0=v_0=0$, early averages are biased toward zero.
4. Correct first moment: $\hat m_t=m_t/(1-\beta_1^t)$ — divide by the total accumulated weight.
5. Correct second moment: $\hat v_t=v_t/(1-\beta_2^t)$ — same correction for squared gradients.
6. Update $w_{t+1}=w_t-\eta \hat m_t/(\sqrt{\hat v_t}+\epsilon)$ — momentum direction scaled by RMS magnitude.

**Symbols.** $m_t$ is first moment; $v_t$ is second moment; $\beta_1,\beta_2$ are decay rates; $\hat m_t,\hat v_t$ are bias-corrected estimates; $\eta$ is learning rate.

**Real-World Applications (§5).**
1. **First Adam moment**: with $g_1=-8$, $\beta_1=0.9$, $m_1=-0.8$ and $\hat m_1=-8$.
2. **First second moment**: with $\beta_2=0.999$, $v_1=0.064$ and $\hat v_1=64$.
3. **First step**: $\eta=0.1$ gives update $-0.1(-8)/8=+0.1$, so $w_1=0.1$.
4. **Second moment estimates**: with $g_2=-4$, $\hat m_2\approx-5.895$ and $\hat v_2\approx39.988$.
5. **Second step**: Adam step is about $+0.0932$, so $w_2\approx0.1932$.
6. **Coordinate scaling**: if $\hat m=(1,1)$ and $\hat v=(100,1)$, equal learning rate gives coordinate steps $(0.1\eta,1\eta)$.

### `math-22-18` — Coordinate descent  · deepen derivation

**Connections (§1).**
> This lesson changes the update unit from a full vector step to a one-coordinate step. Instead of moving all variables at once, coordinate descent optimizes one variable while holding the rest fixed. That idea uses ordinary one-dimensional calculus inside a multivariable problem. It is especially useful when each coordinate update is cheap or has a closed form.

**Motivation & Intuition (§2).**
> Some objectives are large, sparse, or structured so that updating every parameter at every step is unnecessary. Coordinate descent exploits that structure by reducing the problem to a sequence of simpler one-coordinate minimizations. Each subproblem is easier because all other variables are treated as constants.
>
> A sweep through coordinates resembles Gauss-Seidel iteration for linear systems. The method can be slow if coordinates are strongly coupled, but it can be very efficient when updates are sparse or separable. The derivation below shows the basic pattern on a two-variable quadratic.

**Definition & Assumptions (§3).** One coordinate update for a quadratic:
1. Write $f(x,y)=(x-3)^2+2(y+1)^2+xy$ — a two-variable objective.
2. Hold $y$ fixed and differentiate with respect to $x$: $\partial f/\partial x=2(x-3)+y$.
3. Set this derivative to zero: $2x-6+y=0$ — one-dimensional optimality along the $x$ coordinate.
4. Solve $x=(6-y)/2$ — coordinate minimizer.
5. Hold the new $x$ fixed and differentiate with respect to $y$: $\partial f/\partial y=4(y+1)+x$.
6. Set to zero and solve $y=(2-x)/4$ — the $y$ coordinate minimizer.

**Symbols.** $x_j$ is the active coordinate; all other coordinates are held fixed; $f$ is the objective; a sweep updates every coordinate once.

**Real-World Applications (§5).**
1. **First $x$ update**: from $(0,0)$, $x=(6-0)/2=3$.
2. **First $y$ update**: with $x=3$, $y=(2-3)/4=-0.25$.
3. **Lasso coordinate soft threshold**: if unregularized coordinate value is $1.2$ and threshold $0.5$, update is $0.7$.
4. **Gauss-Seidel linear solve**: equations $2x+y=6$, $x+4y=2$ from $(0,0)$ give $(3,-0.25)$ after one sweep.
5. **Sparse update savings**: updating $10$ active features out of $10{,}000$ touches $0.1\%$ of coordinates.
6. **Block coordinate**: updating an embedding vector of dimension $64$ instead of all $1{,}000{,}000$ parameters changes $0.0064\%$ of weights.

### `math-22-19` — Newton's method  · deepen derivation

**Connections (§1).**
> This lesson extends the local model behind gradient descent. Gradient descent uses a first-order linear approximation and steps downhill. Newton's method uses a second-order quadratic approximation, so it also uses curvature. When that quadratic model is accurate and well behaved, the Newton step can move directly to the model's minimizer.

**Motivation & Intuition (§2).**
> The gradient tells which direction is downhill, but it does not say how quickly the slope itself is changing. Curvature information helps scale the step. In a direction with high curvature, the method should be more cautious; in a flatter direction, it can move farther.
>
> Newton's method builds a quadratic model around the current point and minimizes that model exactly. The resulting linear system $Hp=-g$ balances gradient against curvature. This can be powerful, but it depends on the Hessian being useful and often needs damping or line search in non-quadratic problems.

**Definition & Assumptions (§3).** Multivariate Newton step:
1. Start from the second-order Taylor model $m(p)=f(x)+g^Tp+\tfrac12p^THp$ — approximate the loss after step $p$.
2. Differentiate the model with respect to $p$: $\nabla_p m=g+Hp$ — gradient of a quadratic.
3. Set $\nabla_p m=0$ — minimize the local quadratic.
4. Solve $Hp=-g$ — isolate the Newton equation.
5. If $H$ is invertible, $p=-H^{-1}g$ — explicit step direction.
6. Update $x^+=x+p=x-H^{-1}g$ — move to the quadratic model's minimizer.

**Symbols.** $g=\nabla f(x)$ is the gradient; $H=\nabla^2f(x)$ is the Hessian; $p$ is the Newton step; $x^+$ is the next iterate.

**Real-World Applications (§5).**
1. **Scalar quadratic**: for $f(w)=(w-4)^2$ at $w=1$, $g=-6$, $H=2$, so $p=3$ and $w^+=4$.
2. **Logistic one-parameter step**: if $g=0.6$ and $H=3$, $p=-0.2$.
3. **Two-dimensional diagonal Hessian**: $g=(-2,8)$, $H=\operatorname{diag}(2,4)$ gives $p=(1,-2)$.
4. **Damped Newton**: with $p=(1,-2)$ and line-search $\alpha=0.5$, the applied step is $(0.5,-1)$.
5. **Ill-conditioning warning**: Hessian eigenvalues $1$ and $1000$ give condition number $1000$.
6. **Second-order optimum**: for $f=\tfrac12x^THx-b^Tx$, Newton reaches $H^{-1}b$ in one step when $H$ is positive definite.

### `math-22-20` — Quasi-Newton methods (BFGS, L-BFGS)  · deepen derivation

**Connections (§1).**
> This lesson follows Newton's method by keeping the benefit of curvature scaling while avoiding the full Hessian. Quasi-Newton methods infer curvature from changes in gradients across steps. BFGS maintains an approximation to the inverse Hessian, and L-BFGS stores only recent step-gradient pairs. These methods sit between first-order updates and full second-order Newton steps.

**Motivation & Intuition (§2).**
> Full Hessians can be expensive to compute, store, and invert. Still, each step of an optimization run reveals some curvature information: the parameters changed by $s_k$, and the gradient changed by $y_k$. A quadratic objective would connect those through the Hessian.
>
> Quasi-Newton methods use that observed relation as a constraint on the next curvature approximation. In one dimension, the inverse curvature estimate is simply displacement divided by gradient change. In many dimensions, BFGS updates a matrix while preserving symmetry and positive definiteness when the curvature condition is satisfied.

**Definition & Assumptions (§3).** Secant condition and scalar BFGS intuition:
1. Let $s_k=x_{k+1}-x_k$ — the step taken.
2. Let $y_k=g_{k+1}-g_k$ — the observed gradient change.
3. For a true Hessian $B$, a quadratic has $y_k=Bs_k$ — gradient change equals curvature times displacement.
4. For an inverse-Hessian approximation $H_k$, require $H_{k+1}y_k=s_k$ — this is the inverse secant condition.
5. In one dimension, solve $H_{k+1}=s_k/y_k$ — divide the observed step by observed gradient change.
6. In many dimensions, BFGS chooses a symmetric positive-definite update satisfying the same secant condition when $s_k^Ty_k>0$.

**Symbols.** $s_k$ is parameter displacement; $y_k$ is gradient displacement; $B_k$ approximates Hessian; $H_k$ approximates inverse Hessian; L-BFGS stores only recent $(s,y)$ pairs.

**Real-World Applications (§5).**
1. **Scalar inverse curvature**: if $s=2$ and $y=4$, then $H=0.5$.
2. **Quasi-Newton step**: with approximate inverse $H=0.5$ and gradient $g=-6$, step $p=-Hg=3$.
3. **Curvature condition**: $s^Ty=8>0$ keeps the BFGS update positive definite.
4. **L-BFGS memory**: storing $10$ pairs for $1{,}000{,}000$ parameters stores $20{,}000{,}000$ floats, not a $10^{12}$-entry Hessian.
5. **Bad curvature skip**: if $s^Ty=-0.1$, skip or damp the update because curvature is not positive.
6. **Line-search pair**: step norm $0.2$ and gradient-change norm $1.0$ imply rough inverse scale $0.2$ along that direction.

### `math-22-21` — Lagrangian duality  · deepen derivation

**Connections (§1).**
> This lesson begins the constrained optimization block. Earlier lessons described objectives and feasible sets; Lagrangian duality shows how constraints can be folded into an objective using multipliers. The result is not just a new formula, but a way to create lower bounds for constrained minimization problems. Those bounds lead directly to KKT conditions and the dual problem.

**Motivation & Intuition (§2).**
> A constrained minimization problem only allows feasible points. The Lagrangian attaches a multiplier to each inequality constraint, so violations and feasibility affect the objective-like expression. For feasible points and nonnegative multipliers, the constraint terms are nonpositive when written as $g_i(x)\le0$.
>
> Because of that sign, minimizing the Lagrangian over all $x$ gives a value no larger than any feasible objective value. This is weak duality: every valid multiplier vector produces a lower bound on the primal optimum. The best such lower bound becomes the dual objective.

**Definition & Assumptions (§3).** Weak duality for inequalities $g_i(x)\le0$:
1. Start with primal problem $\min f(x)$ subject to $g_i(x)\le0$ — feasible points obey all constraints.
2. Define $L(x,\lambda)=f(x)+\sum_i\lambda_i g_i(x)$ with $\lambda_i\ge0$ — nonnegative multipliers penalize violations.
3. For any feasible $x$, each $g_i(x)\le0$, so $\lambda_i g_i(x)\le0$ — nonnegative times nonpositive is nonpositive.
4. Therefore $L(x,\lambda)\le f(x)$ for feasible $x$ — the Lagrangian is a lower value at feasible points.
5. Define $q(\lambda)=\inf_x L(x,\lambda)$ — the best value of the Lagrangian over all $x$.
6. Since $q(\lambda)\le L(x,\lambda)\le f(x)$ for every feasible $x$, $q(\lambda)$ is a lower bound on the primal optimum.

**Symbols.** $L$ is the Lagrangian; $\lambda$ are inequality multipliers; $q(\lambda)$ is the dual function; $p^*$ is the primal optimum; $d^*$ is the best dual lower bound.

**Real-World Applications (§5).**
1. **Simple constrained quadratic**: minimize $(x-2)^2$ subject to $x\le1$; with $L=(x-2)^2+\lambda(x-1)$, minimizing gives $q(\lambda)=\lambda-\lambda^2/4$.
2. **Best bound**: $q(2)=1$, matching the primal value at $x=1$.
3. **Weak bound**: $q(1)=0.75$, a valid lower bound below $1$.
4. **Multiplier sign**: $\lambda=-1$ is invalid for an inequality multiplier because it would reward violation.
5. **Regularized ERM constraint**: $\Vert w\Vert^2\le4$ gets multiplier $\lambda(\Vert w\Vert^2-4)$ with $\lambda\ge0$.
6. **Duality gap**: primal value $1.05$ and dual bound $1.00$ give gap $0.05$.

### `math-22-22` — The KKT conditions  · deepen derivation

**Connections (§1).**
> This lesson builds on the Lagrangian by collecting the conditions that characterize constrained optima. The KKT conditions combine stationarity, feasibility, multiplier signs, and complementary slackness. For convex problems with standard regularity assumptions, satisfying these conditions certifies optimality. They are the constrained analogue of setting the gradient to zero.

**Motivation & Intuition (§2).**
> At an unconstrained optimum, the gradient must vanish because no direction should reduce the objective. With constraints, some directions are not allowed, so the objective gradient can be balanced by constraint gradients. The Lagrangian expresses that balance through multipliers.
>
> Feasibility keeps the primal point legal. Nonnegative multipliers preserve the lower-bound logic for inequality constraints. Complementary slackness says that an inactive inequality has no price: if the constraint is loose, its multiplier must be zero. Active constraints may carry nonzero multipliers because they shape the optimum.

**Definition & Assumptions (§3).** KKT from Lagrangian logic:
1. Write the constrained problem $\min f(x)$ subject to $g_i(x)\le0$ and $h_j(x)=0$.
2. Form $L=f+\sum_i\lambda_i g_i+\sum_j\nu_jh_j$ — attach multipliers to constraints.
3. At an optimum, local movement in $x$ should not reduce the Lagrangian, so $\nabla_xL(x^*,\lambda^*,\nu^*)=0$ — stationarity.
4. The primal point must satisfy $g_i(x^*)\le0$ and $h_j(x^*)=0$ — primal feasibility.
5. Inequality multipliers must satisfy $\lambda_i^*\ge0$ — required for lower-bound logic.
6. If a constraint is inactive, $g_i(x^*)<0$, it should have zero price; write $\lambda_i^*g_i(x^*)=0$ — complementary slackness.

**Symbols.** $\lambda_i$ are inequality multipliers; $\nu_j$ are equality multipliers; $g_i$ and $h_j$ are constraints; stationarity means gradient with respect to $x$ is zero.

**Real-World Applications (§5).**
1. **Bounded quadratic**: minimize $(x-2)^2$ subject to $x\le1$; stationarity $2(x-2)+\lambda=0$ at $x=1$ gives $\lambda=2$.
2. **Complementary slackness**: the active constraint has $x-1=0$, so $\lambda(x-1)=0$.
3. **Inactive constraint**: for minimize $(x-2)^2$ subject to $x\le3$, optimum $x=2$ has multiplier $0$.
4. **SVM support vector**: margin constraint active when $y_i(w^Tx_i+b)=1$, allowing $\alpha_i>0$.
5. **Probability simplex**: equality $\sum p_i=1$ uses multiplier $\nu$ with no nonnegativity sign restriction.
6. **Certificate check**: primal value $1$, dual multiplier $2$, and zero gap certify the $x\le1$ solution.

### `math-22-23` — The dual problem  · deepen derivation

**Connections (§1).**
> This lesson continues from Lagrangian duality and KKT conditions. Once each multiplier gives a lower bound, the dual problem asks for the best lower bound. That turns constrained optimization into a related problem over multiplier variables. The dual variables often also explain the sensitivity or price of constraints.

**Motivation & Intuition (§2).**
> The Lagrangian dual function $q(\lambda)$ is built by minimizing over the primal variable while holding multipliers fixed. Weak duality says each value of $q$ is a lower bound on the primal optimum for a minimization problem. The dual problem maximizes that lower bound over valid multipliers.
>
> In favorable convex problems, the best dual bound equals the primal optimum. Even when the primal variable is simple, working through the dual shows the logic clearly: form the Lagrangian, minimize over $x$, then choose the multiplier that makes the resulting bound as large as possible.

**Definition & Assumptions (§3).** Dual of the simple quadratic with $x\le1$:
1. Start with $\min (x-2)^2$ subject to $x-1\le0$ — the constraint forces $x$ left of $1$.
2. Form $L(x,\lambda)=(x-2)^2+\lambda(x-1)$ with $\lambda\ge0$.
3. Minimize over $x$: derivative $2(x-2)+\lambda=0$.
4. Solve $x=2-\lambda/2$ — the Lagrangian minimizer for fixed $\lambda$.
5. Substitute into $L$ to get $q(\lambda)=\lambda-\lambda^2/4$ — the dual function.
6. Maximize $q$: $q'(\lambda)=1-\lambda/2=0$, so $\lambda^*=2$.
7. The dual value is $q(2)=1$ — equal to the constrained primal optimum at $x=1$.

**Symbols.** $q$ is the dual function; $\lambda$ is the dual variable; $d^*$ is the dual optimum; strong duality means $d^*=p^*$.

**Real-World Applications (§5).**
1. **Dual optimum**: for the worked problem, $\lambda^*=2$ and dual value $1$.
2. **Lower bound at $\lambda=1$**: $q(1)=0.75$.
3. **Bad multiplier**: $\lambda=4$ gives $q(4)=0$, still a lower bound but not best.
4. **Constraint price**: multiplier $2$ means tightening the boundary by $0.1$ changes optimum value by about $0.2$.
5. **SVM dual size**: $n=1000$ examples gives $1000$ dual variables $\alpha_i$.
6. **Gap stopping**: if primal objective is $1.02$ and dual objective is $1.00$, relative gap is about $1.96\%$.

### `math-22-24` — Linear programming  · AUTHOR derivation

**Connections (§1).**
> This lesson applies constrained optimization to linear objectives and linear inequalities. A linear program has a flat objective and a feasible region made from half-spaces. The geometry is simple enough to see in two variables and powerful enough to support large practical allocation and feasibility problems. It also sets up quadratic programming, where the constraints stay linear but the objective gains curvature.

**Motivation & Intuition (§2).**
> In a linear program, objective level sets are parallel lines or hyperplanes. Improving the objective slides that level set across the feasible polyhedron. If a finite optimum is attained, the last contact happens at a face, and at least one optimum occurs at a vertex.
>
> This does not mean every vertex is good; it means checking vertices is enough in the small two-dimensional example. The derivation lists the polygon's candidate corners, evaluates the objective, and selects the largest value. Higher-dimensional algorithms use the same geometry more systematically.

**Definition & Assumptions (§3).** Vertex check in two variables:
1. Write the LP maximize $2x+3y$ subject to $x+y\le4$, $x\le2$, $y\le3$, $x,y\ge0$.
2. The feasible set is an intersection of half-spaces — each linear inequality keeps one side of a line.
3. A linear objective has level sets $2x+3y=c$ — parallel lines.
4. Sliding the level line upward until it last touches the polygon makes contact at an edge or vertex.
5. List candidate vertices: $(0,0)$, $(2,0)$, $(2,2)$, $(1,3)$, $(0,3)$.
6. Evaluate objective values: $0$, $4$, $10$, $11$, $9$.
7. Choose $(1,3)$ with value $11$ — the largest vertex value solves this LP.

**Symbols.** $x,y$ are decision variables; $c^Tx$ is the linear objective; $Ax\le b$ are linear constraints; a vertex is a corner formed by active constraints.

**Real-World Applications (§5).**
1. **Production mix**: the worked LP chooses $(1,3)$ and value $11$.
2. **Active constraints**: at $(1,3)$, $x+y=4$ and $y=3$ are active.
3. **Slack**: constraint $x\le2$ has slack $1$ at $(1,3)$.
4. **Ad allocation**: objective $2x+3y$ means the $y$ channel has higher value per unit, but the $y\le3$ cap limits it.
5. **Relaxed classification**: LP feasibility with $100$ constraints and $20$ variables still uses the same half-space geometry.
6. **Sensitivity**: increasing the $y$ cap from $3$ to $3.5$ would allow $(0.5,3.5)$ with value $11.5$ if other constraints stay the same.

### `math-22-25` — Quadratic programming  · deepen derivation

**Connections (§1).**
> This lesson extends linear programming by allowing a quadratic objective while keeping linear constraints. Quadratic programming is the natural form for constrained least squares, support vector machines, portfolio variance, and trust-region models. The curvature matrix $Q$ supplies the second-order shape. The linear constraints determine which stationary point is feasible.

**Motivation & Intuition (§2).**
> A convex quadratic objective has a bowl-shaped surface. Without constraints, the minimizer is found by setting the gradient to zero, which produces a linear system. With constraints, the same stationarity idea is combined with KKT conditions for the active constraints.
>
> Positive definiteness of $Q$ matters because it makes the quadratic curve upward in every direction. Then a stationary feasible point is not just locally good; it is globally minimizing for the convex QP. The derivation begins with the unconstrained case so the role of $Qx=c$ is clear before constraints are added.

**Definition & Assumptions (§3).** Equality-free convex QP stationarity:
1. Write the unconstrained QP $\min \tfrac12x^TQx-c^Tx$ with $Q$ positive definite — convex quadratic objective.
2. Differentiate: $\nabla f(x)=Qx-c$ — gradient of the quadratic term is $Qx$ when $Q$ is symmetric.
3. Set stationarity $Qx-c=0$ — unconstrained optimum has zero gradient.
4. Solve $Qx=c$ — linear system for the minimizer.
5. If linear constraints are present, add KKT conditions with multipliers for active constraints.
6. The positive-definite $Q$ makes the stationary feasible point the global minimizer.

**Symbols.** $Q$ is the curvature matrix; $c$ is the linear objective vector; $x$ is the decision variable; active constraints are constraints holding with equality at the solution.

**Real-World Applications (§5).**
1. **Unconstrained QP**: $Q=\operatorname{diag}(2,4)$ and $c=(2,8)$ give $x=(1,2)$.
2. **Objective value**: at $(1,2)$, $\tfrac12(2+16)-(2+16)=-9$.
3. **Box-constrained coordinate**: if the unconstrained solution has $x_1=1.4$ but constraint $x_1\le1$, the active value is $x_1=1$.
4. **SVM primal form**: $\tfrac12\Vert w\Vert^2+C\sum \xi_i$ with linear margin constraints is a QP.
5. **Portfolio variance**: $Q=\operatorname{diag}(0.04,0.09)$ and weights $(0.5,0.5)$ give variance $0.0325$.
6. **Trust-region local model**: $g=(2,0)$, $Q=I$, unconstrained step $-g=(-2,0)$ is clipped to radius $1$ as $(-1,0)$.

### `math-22-26` — Nonconvex optimization & the DL landscape  · deepen · explain-only

**Connections (§1).**
> This lesson closes the section by contrasting convex guarantees with the landscapes common in deep learning. Earlier convex lessons gave clean global certificates; nonconvex objectives can have saddles, flat directions, local minima, and sharp valleys. The optimizer tools still matter, but their guarantees are more limited. The focus shifts from proving a unique global optimum to finding low-loss solutions that also generalize.

**Motivation & Intuition (§2).**
> In a convex problem, stationarity and curvature conditions can often certify global optimality. In a nonconvex problem, the same local signals are harder to interpret. A zero gradient may indicate a local minimum, a saddle, or a flat region, and the Hessian may reveal mixed curvature.
>
> Deep-learning models are usually overparameterized, which can create many low-loss parameter settings rather than a single isolated solution. Stochasticity from minibatches can help the optimizer move through flat or saddle-like regions. This lesson is explain-only because the main point is landscape behavior: stationary points need not be global, and low training loss must be considered together with generalization.

**Definition & Assumptions (§3).** explain-only — this is a landscape concept, not one formula. Author the lesson by contrasting convex guarantees with nonconvex behavior: stationary points need not be global, saddles can have zero gradient, stochasticity can help escape, and overparameterization can create many connected low-loss solutions.

**Symbols.** $\theta$ is the full parameter vector; $L(\theta)$ is training loss; $\nabla L$ is the gradient; $\nabla^2L$ is the Hessian; a saddle has mixed Hessian curvature; a basin is a region whose local descent paths lead to similar low loss.

**Real-World Applications (§5).**
1. **Saddle example**: $L(x,y)=x^2-y^2$ has $\nabla L(0,0)=0$ but Hessian eigenvalues $2$ and $-2$, so it is not a minimum.
2. **Local minimum example**: $L(x)=x^4-x^2$ has stationary points $0$ and $\pm1/\sqrt2$; the latter have value $-0.25$.
3. **Flat direction**: $L(x,y)=x^2$ has zero curvature in $y$, so all $(0,y)$ minimize training loss equally.
4. **Sharpness number**: Hessian eigenvalue $100$ means a step of $0.01$ in that eigen-direction raises the quadratic model by about $0.5\cdot100\cdot0.01^2=0.005$.
5. **SGD noise scale**: minibatch gradient standard deviation $0.2$ with learning rate $0.01$ gives update noise scale $0.002$.
6. **Generalization gap**: training loss $0.05$ and validation loss $0.08$ give gap $0.03$, so low training loss alone is not the full optimization story.

---

## Build order

1. **Model entry first:** author `math-22-05` in full prose, including the Taylor derivation and checked iterates $0\to2\to3\to3.5$.
2. **Core descent family:** author `math-22-06`…`math-22-14` so rates, line search, momentum, Nesterov, subgradients, proximal steps, SGD, and variance reduction share notation.
3. **Adaptive optimizers:** author `math-22-15`…`math-22-17` together and verify all moving-average and bias-correction numbers.
4. **Coordinate and second-order methods:** author `math-22-18`…`math-22-20`, keeping the quadratic examples consistent.
5. **Constrained optimization:** author `math-22-21`…`math-22-25` in order: Lagrangian lower bounds, KKT, dual problem, LP, QP.
6. **Landscape close:** author `math-22-26` last as explain-only, tying nonconvex behavior back to the optimizer methods without inventing a universal guarantee.
