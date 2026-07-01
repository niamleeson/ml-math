# Math · Part 27 — Numerical methods / scientific computing  (deep-authored reference)

> **Per-section execution plan.** Load together with the master [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four exposition principles: warm voice, complete step-by-step derivations, case-by-case judgment, and every symbol named.
> This rewrite replaces the scaffold with authored per-lesson specs. Numeric claims were checked with `python3` + `numpy` on 2026-07-01; representative checks include CG steps, GMRES residuals, QR iteration, Lanczos coefficients, power-iteration ratios, reverse-mode AD adjoints, ODE order examples, Monte Carlo error, randomized SVD projection error, Amdahl speedup, and mixed-precision scaling.

**Section:** Numerical methods / scientific computing · **Lessons:** 19 · **Breadcrumb:** `Mathematics · Applied / Computational` · **Priority:** MEDIUM (targeted deepening, ML-systems capstone)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared app-set with a sibling) | 0 / 19 |
| Templated / thin motivation (stock opener or ≤45 words) | 0 / 19 |
| Key formula not in display form ($$…$$) | 17 / 19 |
| Unclosed dollar-delimiter LaTeX bug | 1 / 19 |
| Derivation action after case-by-case rewrite | 18 authored/deepened · 1 explain-only |

**The core change:** keep the section's already strong applied focus, but make every lesson teach the numerical method itself: formulas move into display form, derivations show the local algebra one operation at a time, and each application carries a number that can be recomputed from that lesson's concept.

---

## Priority & systemic issues

- No whole-section §5 boilerplate block is present. The fix is not deduplication; it is depth: make each lesson's method, error estimate, or workflow decision explicit enough to rederive.
- **LaTeX bug found:** `math-27-03` motivation is missing the closing math delimiter after `19.97` in the phrase about `$20` dollars versus `19.97`. Fix by closing the inline math after `19.97`.
- Several lessons contain matrix examples in the dump. Preserve row breaks carefully in source when implementing, but the single confirmed bug for this section is the unclosed dollar delimiter above.
- This is the applied/scientific-computing section. Applications should stay concrete: Krylov solvers, eigenvalue iteration, sparse storage, automatic differentiation, ODE/PDE discretization, Monte Carlo error, GPU speedups, randomized SVD, and mixed-precision training stability.

---

## Model entry (full prose)

### `math-27-13` — Automatic differentiation  — **full-depth model entry (this is the bar)**

**Connections (§1).**
> This lesson builds on the chain rule and on the idea of a computation as a sequence of intermediate values. In earlier calculus lessons, derivatives were usually taken from a formula written on one line. In real machine-learning code, the loss is produced by a program: matrix multiplications, nonlinearities, reshapes, normalizations, and reductions all happen before the final scalar appears.
>
> Automatic differentiation is the bridge between those two views. It applies the chain rule to the actual operations the program executed. That makes it different from finite differences, which estimate a slope by rerunning the program, and different from symbolic algebra, which tries to rewrite a formula. Reverse-mode automatic differentiation is the engine behind backpropagation, so this lesson is the numerical-methods version of how gradients are computed in modern training systems.

**Motivation & Intuition (§2).**
> A derivative through a long computation is difficult because every intermediate value can affect later values. The safe way to handle that dependency is to name the intermediate values and keep local derivative rules for each operation. If $u=3x$, then the local rule is $du/dx=3$. If $v=u^2$, then the local rule is $dv/du=2u$. The whole derivative is built by chaining these local rules together.
>
> Reverse mode starts from a scalar output, usually a loss, and walks backward. It attaches to each intermediate value an adjoint, written $\bar v$, meaning “how much the final loss changes when this value changes.” When one value feeds several later operations, reverse mode adds all contributions into the same adjoint. That accumulation is the practical heart of backpropagation: every parameter receives the total effect of all paths by which it influences the loss.
>
> The important point is that automatic differentiation computes derivatives of the executed numerical program. It does not remove floating-point roundoff, and it still needs conventions at nondifferentiable points, but it gives exact chain-rule derivatives for the operations that were actually run.

**Definition & Assumptions (§3).** Display the reverse-mode accumulation rule
$$
\bar u \mathrel{+}= \bar v\,{\partial v \over \partial u}.
$$
Then work the example $x=2$, $u=3x$, $v=u^2$, $L=v+5u$ completely:
1. Forward pass: $u=3\cdot2=6$ because $u$ is three times the input.
2. Forward pass: $v=6^2=36$ because $v$ squares the intermediate $u$.
3. Forward pass: $L=36+5\cdot6=66$ because the loss adds $v$ and $5u$.
4. Seed the backward pass with $\bar L=1$ because $\partial L/\partial L=1$.
5. From $L=v+5u$, add $\bar v=1$ because $\partial L/\partial v=1$.
6. From the same line, add $5$ to $\bar u$ because $\partial L/\partial u=5$ through the direct $5u$ path.
7. From $v=u^2$, add $\bar v(2u)=1\cdot12=12$ to $\bar u$ because the square path also changes the loss.
8. Combine the two paths: $\bar u=5+12=17$ because adjoints add contributions from all downstream uses.
9. From $u=3x$, compute $\bar x=\bar u\cdot3=17\cdot3=51$ because $\partial u/\partial x=3$.
10. Therefore $dL/dx=51$.

**Symbols.** $x$ is the input; $u,v$ are intermediate values stored from the forward pass; $L$ is the scalar loss; $\bar v=\partial L/\partial v$ is the adjoint of $v$; $\mathrel{+}=$ means “accumulate into the existing adjoint,” which matters when several paths meet.

**Real-World Applications (§5).**
1. **Backpropagation at scale** — reverse-mode AD computes one gradient of a scalar loss with cost on the order of a few forward passes; a model with $10^7$ parameters avoids $10^7$ finite-difference reruns.
2. **Worked graph audit** — for $x=2,u=3x,v=u^2,L=v+5u$, the adjoint check returns $dL/dx=51$, so a framework trace can be tested against a hand calculation.
3. **Custom layer backward rule** — if a scale layer outputs $y=3x$ and receives incoming adjoint $0.7$, it returns $0.7\cdot3=2.1$.
4. **Hypergradient contribution** — if a validation-loss adjoint through a learning-rate node is $0.8$ and the local derivative is $-0.03$, the contribution is $0.8(-0.03)=-0.024$.
5. **Forward-mode sensitivity** — for $f(a,b)=ab^2$ at $(3,2)$, local differentiation gives $\partial f/\partial a=4$ and $\partial f/\partial b=12$.
6. **HMC log-density gradient** — for log density $\ell(x)=-x^2/2$ at $x=1.5$, AD returns $\ell'(x)=-1.5$, the number a Hamiltonian Monte Carlo step needs.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson in render order. The labels are plan shorthand; in the lesson they become flowing prose. Every application below has six concept-specific uses with recomputable numbers.

### `math-27-01` — The scientific computing workflow  · explain-only

**Connections (§1).**
> This lesson gathers ideas that appeared throughout the applied mathematics track: modeling, approximation, computation, and error checking. Earlier lessons often focused on one formula or method at a time. Scientific computing asks how those pieces become a reliable answer to a real question.
>
> The workflow also prepares the reader for the rest of this section. Vectorization, floating-point arithmetic, linear solvers, ODE methods, Monte Carlo estimates, and GPU execution all fit into the same loop: state the model, compute carefully, and check what the answer can honestly support.

**Motivation & Intuition (§2).**
> Scientific computing turns a real question into a trustworthy numerical answer by moving through a reproducible chain: model the problem, discretize or approximate it, compute, check error, and report limits. The important word is trustworthy. A numerical answer can be wrong because the model is wrong, because the approximation is too coarse, because the solver has not converged, because the code has a bug, or because the result is interpreted more precisely than the computation allows.
>
> The workflow separates those risks. The model stage asks whether the mathematical description matches the question. The discretization or approximation stage decides what finite problem the computer will actually solve. The compute stage produces a numerical answer, while residuals, grid refinement, repeated runs, and unit checks test whether the answer is stable. The final reporting stage records both the answer and the limits of confidence around it.

**Definition & Assumptions (§3).** Explain-only: this lesson defines a workflow, not a formula. Give the five-stage loop in prose and show how each stage catches a different failure mode: wrong model, unstable discretization, solver error, implementation bug, or overconfident interpretation.

**Symbols.** $q$ is the real question; $m$ the mathematical model; $h$ a discretization or approximation scale; $\hat y$ the computed answer; $e$ an error estimate; $r$ a residual used to check whether the computed answer satisfies the model.

**Real-World Applications (§5).**
1. **Residual check** — if a linear solve returns $\|Ax-b\|=10^{-6}$ and $\|b\|=10$, the relative residual is $10^{-7}$.
2. **Grid refinement** — halving $h$ from $0.1$ to $0.05$ should cut a first-order error from $0.02$ to about $0.01$.
3. **Runtime budget** — a workflow with 3 model candidates and 4 grid sizes creates $12$ runs before solver sweeps.
4. **Reproducibility** — five repeated Monte Carlo runs with standard deviation $0.04$ have standard error $0.04/\sqrt5\approx0.0179$.
5. **Unit consistency** — a velocity of $30$ m/s over $2$ s predicts $60$ m; a solver returning $60$ km is a modeling-unit failure.
6. **Stopping rule** — if the validation metric changes by $0.002$ while the numerical tolerance is $0.01$, the computation cannot justify reporting the smaller change.

### `math-27-02` — Vectorization  · AUTHOR derivation

**Connections (§1).**
> This lesson connects matrix multiplication with the way numerical programs actually run on modern hardware. Earlier linear algebra lessons treated $Xw$ as a compact notation for many dot products. Vectorization keeps that mathematical meaning but changes how the work is expressed to the computer.
>
> The lesson leads directly into scientific Python, array programming, GPU kernels, and batched machine-learning inference. It also sets up a recurring theme in this section: the arithmetic count is only part of performance, because overhead and data movement also matter.

**Motivation & Intuition (§2).**
> Vectorization replaces many scalar operations with one array operation that a numerical library can run in optimized kernels. Instead of asking an interpreter to perform one row prediction, then another, then another, the program hands the whole batch to a compiled routine. The mathematical operation is the same collection of multiply-adds, but the organization of the work is different.
>
> This matters because modern CPUs, GPUs, and BLAS libraries are built to move and multiply blocks of data, not one Python loop iteration at a time. A vectorized call can reuse optimized memory access, SIMD instructions, cache behavior, and parallel execution. The speedup is not a new formula for $Xw$; it is the benefit of giving the same formula to the layer of software and hardware designed to execute it efficiently.

**Definition & Assumptions (§3).** For a batch matrix-vector product $y=Xw$:
1. Write the $i$th scalar prediction as $y_i=\sum_{j=1}^d X_{ij}w_j$ because row $i$ combines all $d$ features.
2. Stack all $n$ scalar equations vertically because every row uses the same weights.
3. The stacked equations equal $y=Xw$ by the definition of matrix multiplication.
4. The scalar loop performs $nd$ multiply-add pairs because it repeats the dot product for each of $n$ rows.
5. The vectorized call performs the same arithmetic but hands it to a compiled kernel, so overhead is paid once instead of $n$ times.
6. If the loop takes $120$ ms and the vectorized kernel takes $6$ ms, the measured speedup is $120/6=20$.

**Symbols.** $X\in\mathbb R^{n\times d}$ is a batch of $n$ examples and $d$ features; $w\in\mathbb R^d$ is the weight vector; $y\in\mathbb R^n$ is the prediction vector; $n d$ counts scalar feature-weight products.

**Real-World Applications (§5).**
1. **Batch inference** — for $X=\begin{bmatrix}1&2\\3&4\\5&6\end{bmatrix}$ and $w=(0.5,-1)$, vectorization gives $Xw=(-1.5,-2.5,-3.5)$.
2. **Transformer projection** — a batch with $4096$ tokens and width $768$ performs $4096\cdot768=3{,}145{,}728$ multiply-add pairs for one vector projection.
3. **Measured kernel speedup** — $120$ ms loop versus $6$ ms vectorized call gives a $20\times$ speedup.
4. **Memory-transfer bound** — moving $100$ MB at $800$ GB/s takes $100\times10^6/(800\times10^9)=0.125$ ms before arithmetic is counted.
5. **Broadcast normalization** — subtracting a length-$768$ mean vector from $4096$ rows applies $3{,}145{,}728$ scalar subtractions.
6. **Mini-batch loss** — computing $Xw-y$ for $8192$ examples produces $8192$ residuals in one array operation.

### `math-27-03` — Applied floating-point error  · deepen derivation · FIX LaTeX

**Connections (§1).**
> This lesson builds on real-number arithmetic, logarithmic scale, and the error estimates used in earlier numerical examples. In exact algebra, $20$ dollars and $19.97$ dollars differ by exactly $0.03$ dollars, and a long sum has the value dictated by the usual field rules. Floating-point arithmetic keeps the same intended operations but stores rounded representatives of real numbers.
>
> The lesson prepares the reader to judge when a computed result is numerically meaningful. It also connects to direct solvers, iterative methods, mixed precision, and machine-learning loss curves, where small reported changes can be below the precision that the computation can support.

**Motivation & Intuition (§2).**
> Floating-point arithmetic stores a rounded version of real arithmetic. Most roundoff is tiny because each operation is close to the corresponding real-number operation. The difficulty is that programs usually perform many operations, and the small errors can accumulate or be magnified by the structure of the computation.
>
> Some computations are much more sensitive than others. Long sums collect many rounded operations. Subtracting nearly equal numbers can erase leading digits and leave mostly roundoff behind. Ill-conditioned solves can turn a small data or arithmetic perturbation into a large change in the answer. The purpose of the standard floating-point model is to give a compact way to estimate these effects before trusting extra digits.

**Definition & Assumptions (§3).** Use the standard model $\operatorname{fl}(a\circ b)=(a\circ b)(1+\delta)$:
1. Let $\circ$ be one operation and $\operatorname{fl}$ be the rounded result because computers store finite precision.
2. Bound one rounding by $|\delta|\le u$, where $u$ is the unit roundoff.
3. For a chain of $n$ rounded operations, multiply the factors $(1+\delta_1)\cdots(1+\delta_n)$.
4. Bound the accumulated relative error by $\gamma_n=nu/(1-nu)$ when $nu<1$.
5. For FP32, $u=2^{-24}\approx5.96\times10^{-8}$.
6. With $n=1000$, $\gamma_{1000}\approx5.96\times10^{-5}$, so a stable sum's relative roundoff should be about six parts in $10^5$ or less.

**Symbols.** $\operatorname{fl}$ is the floating-point result; $u$ is unit roundoff; $\delta$ is one operation's relative rounding error; $\gamma_n$ is a compact bound for $n$ accumulated roundings.

**Real-World Applications (§5).**
1. **FP32 accumulation bound** — $1000$ operations give $\gamma_{1000}\approx5.96\times10^{-5}$.
2. **Cancellation audit** — in FP32, $1.000001-1.000000$ rounds to about $9.5367\times10^{-7}$, a $-4.63\%$ relative error from $10^{-6}$.
3. **Dot-product budget** — a 768-term dot product has roundoff scale roughly $768u\approx4.58\times10^{-5}$ before conditioning effects.
4. **Loss logging** — reporting a validation loss change of $10^{-7}$ from FP32 arithmetic is suspicious because it is near single-operation roundoff.
5. **Stable summation** — pairwise summation reduces the effective depth from $n$ to about $\log_2 n$; for $1024$ terms that is $10$ levels.
6. **Mixed-precision warning** — FP16 unit roundoff $2^{-11}\approx4.88\times10^{-4}$ makes a $0.1\%$ metric change only about two units of roundoff.

### `math-27-04` — Direct linear solvers in practice  · AUTHOR derivation

**Connections (§1).**
> This lesson continues the study of linear systems from earlier algebra lessons, now with attention to how the system is solved on a computer. The equation $Ax=b$ still means that a matrix transforms an unknown vector into a known right-hand side. A direct solver provides a finite sequence of algebraic operations that produces the unknown vector, up to floating-point error.
>
> Direct solvers are the reference point for several later lessons. Residuals from this lesson are used to check CG and GMRES, and factorization cost explains why sparse and iterative methods become necessary for very large systems.

**Motivation & Intuition (§2).**
> A direct solver uses elimination or factorization to solve $Ax=b$ in a predictable number of algebraic steps. For moderate dense systems, this predictability is valuable: the method does not depend on gradually improving a guess, and the same factorization can often be reused for many right-hand sides.
>
> The practical habit is to solve and then check. The computed vector should be substituted back into the original system by forming the residual $r=b-Ax$. A small residual does not answer every conditioning question, but it is the first test that the algebraic problem has been solved as stated. That same residual language will carry into iterative solvers, where stopping depends on whether the remaining equation error is small enough.

**Definition & Assumptions (§3).** For Gaussian elimination on $\begin{bmatrix}2&1\\4&3\end{bmatrix}x=\begin{bmatrix}5\\11\end{bmatrix}$:
1. Use row 1 as the pivot because its first entry is nonzero.
2. Subtract $2$ times row 1 from row 2 to eliminate the lower-left entry: row 2 becomes $[0,1\mid1]$.
3. Read $x_2=1$ from the second row.
4. Substitute into row 1: $2x_1+1=5$.
5. Solve $2x_1=4$, so $x_1=2$.
6. Check $Ax=(5,11)^T$, so the residual $r=b-Ax$ is $(0,0)^T$.

**Symbols.** $A$ is the coefficient matrix; $x$ is the unknown vector; $b$ is the right-hand side; $r=b-Ax$ is the residual; LU factorization writes $A=LU$ to reuse elimination for many $b$ values.

**Real-World Applications (§5).**
1. **Dense calibration solve** — the example system gives $x=(2,1)$ with zero residual.
2. **Residual QA** — if $\|r\|=10^{-8}$ and $\|b\|=4$, the relative residual is $2.5\times10^{-9}$.
3. **Factorization cost** — dense LU for $n=3000$ costs about $(2/3)n^3=18$ billion flops.
4. **Many right-hand sides** — after one LU factorization, solving $20$ right-hand sides reuses the factors instead of repeating elimination $20$ times.
5. **Normal-equation caution** — solving $(X^TX)w=X^Ty$ squares the condition number; $\kappa(X)=100$ becomes $\kappa(X^TX)=10{,}000$.
6. **Small Newton system** — a $50\times50$ dense Hessian solve costs about $(2/3)50^3\approx83{,}333$ flops, small compared with a large model forward pass.

### `math-27-05` — Conjugate gradient (CG)  · deepen derivation

**Connections (§1).**
> This lesson builds on quadratic functions, gradients, and linear systems. For a symmetric positive definite matrix, solving $Ax=b$ is the same as minimizing a convex quadratic energy. That connection lets an algebra problem become an optimization problem with carefully chosen search directions.
>
> Conjugate gradient is the first Krylov method in this section. It prepares the reader for GMRES, preconditioning, and large sparse systems, where forming a dense factorization would be too expensive but matrix-vector products are still available.

**Motivation & Intuition (§2).**
> Conjugate gradient solves symmetric positive definite systems by choosing search directions that do not undo previous progress. Ordinary steepest descent can zigzag because each new step may partially disturb progress made by earlier steps. CG instead chooses directions that are independent in the geometry created by the matrix $A$.
>
> The geometry is not ordinary perpendicularity; it is $A$-orthogonality, which matches the quadratic energy being minimized. Once the method has minimized along one direction, later $A$-conjugate directions preserve that minimization in exact arithmetic. This is why CG can reach the exact solution in at most the dimension of the system in exact arithmetic, while in practice it is valued because good approximations often arrive much sooner.

**Definition & Assumptions (§3).** For $Ax=b$ with SPD $A$, minimize $\phi(x)=\tfrac12x^TAx-b^Tx$:
1. Compute the residual $r_k=b-Ax_k$ because $-\nabla\phi(x_k)=r_k$.
2. Search along $p_k$ by writing $x_{k+1}=x_k+\alpha_kp_k$.
3. Minimize $\phi(x_k+\alpha p_k)$ in $\alpha$ by setting the derivative to zero.
4. The derivative is $p_k^T(Ax_k-b)+\alpha p_k^TAp_k=-p_k^Tr_k+\alpha p_k^TAp_k$.
5. Therefore $\alpha_k=(r_k^Tr_k)/(p_k^TAp_k)$ for the standard CG recurrence.
6. Update $r_{k+1}=r_k-\alpha_kAp_k$ because $A(x_k+\alpha_kp_k)=Ax_k+\alpha_kAp_k$.
7. Choose $p_{k+1}=r_{k+1}+\beta_kp_k$ and require $p_k^TAp_{k+1}=0$.
8. This gives $\beta_k=(r_{k+1}^Tr_{k+1})/(r_k^Tr_k)$ in exact arithmetic, preserving $A$-conjugacy.

**Symbols.** $A$ is symmetric positive definite; $r_k$ is the residual; $p_k$ is the search direction; $\alpha_k$ is the step length; $\beta_k$ mixes in the previous direction; $p_i^TAp_j=0$ means $A$-orthogonality.

**Real-World Applications (§5).**
1. **One CG step** — for $A=\begin{bmatrix}4&1\\1&3\end{bmatrix}$, $b=(1,2)$, $x_0=0$, $\alpha_0=5/20=0.25$ and $x_1=(0.25,0.5)$.
2. **Residual update** — the same step gives $r_1=(-0.5,0.25)$ and $\|r_1\|\approx0.559$.
3. **Direction mixing** — $\beta_0=(0.3125)/5=0.0625$, so $p_1=(-0.4375,0.375)$.
4. **A-orthogonality check** — $p_0^TAp_1=0$, so the second direction does not spoil the first minimization.
5. **Two-step exactness in 2-D** — the next step has $\alpha_1\approx0.3636$ and reaches $x=(0.0909,0.6364)$, the exact solution.
6. **Condition-number estimate** — with $\kappa=10$, the textbook CG error bound needs about $23$ iterations to push the relative factor below $10^{-6}$.

### `math-27-06` — GMRES  · AUTHOR derivation

**Connections (§1).**
> This lesson follows naturally after CG and keeps the focus on solving large linear systems by using matrix-vector products. CG depends on symmetry and positive definiteness. Many systems from transport, advection, optimization, and engineering do not have those properties.
>
> GMRES is the corresponding Krylov idea for nonsymmetric systems. It also introduces a pattern that appears throughout numerical linear algebra: build a small problem inside a carefully chosen subspace, solve that small problem accurately, and use it to update the large solution.

**Motivation & Intuition (§2).**
> GMRES solves nonsymmetric linear systems by searching a growing Krylov subspace and choosing the vector with the smallest residual. The subspace is built from the initial residual and repeated multiplication by $A$, so it contains directions that are directly tied to how the current error behaves under the system matrix.
>
> The method does not require the same energy-minimization geometry as CG. Instead, it asks for the approximate solution whose residual norm is smallest among all candidates in the current Krylov subspace. Arnoldi orthogonalization turns that large residual minimization into a small least-squares problem, which is the computational core of the method.

**Definition & Assumptions (§3).** With $x_0$ and $r_0=b-Ax_0$:
1. Form the Krylov subspace $\mathcal K_m(A,r_0)=\operatorname{span}\{r_0,Ar_0,\dots,A^{m-1}r_0\}$ because repeated multiplication by $A$ reveals directions connected to the residual.
2. Write $x_m=x_0+V_my$ where columns of $V_m$ are an orthonormal basis for that subspace.
3. The residual is $r_m=b-Ax_m=r_0-AV_my$.
4. Arnoldi gives $AV_m=V_{m+1}\bar H_m$, so the residual becomes $V_{m+1}(\|r_0\|e_1-\bar H_my)$.
5. Orthogonality of $V_{m+1}$ preserves norms, so minimizing $\|r_m\|$ is the small least-squares problem $\min_y\|\|r_0\|e_1-\bar H_my\|$.
6. That small least-squares solve is the GMRES update.

**Symbols.** $\mathcal K_m$ is the Krylov subspace; $V_m$ is its orthonormal basis; $\bar H_m$ is the small Hessenberg matrix from Arnoldi; $y$ is the coordinate vector chosen by least squares.

**Real-World Applications (§5).**
1. **One-dimensional GMRES** — for $A=\begin{bmatrix}2&1\\0&1\end{bmatrix}$, $b=(1,1)$, $x_0=0$, searching $x=\alpha b$ gives $\alpha=0.4$.
2. **Residual norm** — that step has residual $(-0.2,0.6)$ with norm $0.6325$.
3. **Restart memory** — GMRES(50) stores $50$ basis vectors; for $10^6$ unknowns in FP32 that is $50\cdot10^6\cdot4=200$ MB.
4. **Nonsymmetric PDE solve** — advection creates nonsymmetric matrices, so CG is invalid while GMRES can still minimize residuals.
5. **Stopping rule** — if $\|r_m\|/\|b\|=8\times10^{-7}$ and tolerance is $10^{-6}$, GMRES stops.
6. **Least-squares size** — at iteration $m=30$, the inner problem has only $31$ rows and $30$ columns, much smaller than the original system.

### `math-27-07` — Preconditioning  · AUTHOR derivation

**Connections (§1).**
> This lesson connects linear solves with the condition-number ideas that appeared earlier in numerical analysis. CG and GMRES choose better approximations inside Krylov subspaces, but their speed still depends strongly on the matrix they see. A difficult matrix can make a good iterative method look slow.
>
> Preconditioning is the practical response. It also connects linear algebra with feature scaling in machine learning: changing the coordinates or operator can make the same underlying problem easier for an algorithm to navigate.

**Motivation & Intuition (§2).**
> Preconditioning changes the linear system into an equivalent one that is easier for an iterative solver. The goal is not to change the answer. The goal is to change the operator seen by the iteration so that the residual can be reduced in fewer steps.
>
> A useful preconditioner resembles the original matrix enough to improve the spectrum, but is much cheaper to apply than solving the original system exactly. In practice, applying $M^{-1}$ usually means solving a simpler system $Mz=v$. The benefit must be measured as a tradeoff: fewer Krylov iterations are valuable only if each preconditioned iteration is not too expensive.

**Definition & Assumptions (§3).** For left preconditioning:
1. Start with $Ax=b$.
2. Choose an invertible matrix $M$ that approximates $A$ but is easier to solve with.
3. Multiply both sides by $M^{-1}$ to get $M^{-1}Ax=M^{-1}b$.
4. The solution $x$ is unchanged because multiplying by an invertible matrix preserves equality.
5. Iterative convergence depends on the spectrum of the operator; the new operator is $M^{-1}A$.
6. If $M^{-1}A$ has a smaller condition number or clustered eigenvalues, fewer Krylov iterations are needed.

**Symbols.** $M$ is the preconditioner; $M^{-1}A$ is the preconditioned operator; $\kappa$ is the condition number; “applying $M^{-1}$” means solving $Mz=v$, not explicitly forming an inverse.

**Real-World Applications (§5).**
1. **Perfect diagonal case** — for $A=\operatorname{diag}(100,1)$ and $M=A$, $M^{-1}A=I$, so $\kappa$ drops from $100$ to $1$.
2. **Jacobi preconditioner** — for $A=\begin{bmatrix}4&1\\1&3\end{bmatrix}$, symmetric diagonal scaling has eigenvalues about $0.7113$ and $1.2887$, so $\kappa\approx1.812$.
3. **CG acceleration** — lowering $\kappa$ from $100$ to $4$ changes the CG convergence factor from $(10-1)/(10+1)=0.818$ to $(2-1)/(2+1)=0.333$.
4. **Feature scaling analogy** — standardizing a feature from variance $100$ to variance $1$ is diagonal preconditioning for gradient methods.
5. **Incomplete factorization budget** — if an ILU apply costs $5$ sparse matvecs but cuts iterations from $200$ to $30$, the effective cost drops from $200$ to about $150$ matvec equivalents.
6. **Solver design check** — a preconditioner that takes $20$ ms and saves only one $5$ ms iteration is a net loss for that solve.

### `math-27-08` — Power iteration  · AUTHOR derivation

**Connections (§1).**
> This lesson returns to eigenvalues and eigenvectors from linear algebra, now with a computational question in mind. Instead of diagonalizing a whole matrix, power iteration asks for the dominant direction using only repeated matrix-vector multiplication. That makes it useful when a matrix is large but multiplying by it is still feasible.
>
> The same idea supports PCA approximations, PageRank-style stationary distributions, spectral normalization, and several randomized algorithms. It also prepares the reader for QR and Lanczos, which compute spectral information in more refined ways.

**Motivation & Intuition (§2).**
> Power iteration finds the dominant eigenvector by repeatedly multiplying by a matrix. If the starting vector has any component in the dominant eigenvector direction, each multiplication scales that component by the largest eigenvalue. Components in other eigendirections are scaled by smaller eigenvalues in magnitude.
>
> After several multiplications, the relative contribution of the non-dominant components shrinks according to ratios such as $|\lambda_2/\lambda_1|^k$. Normalization keeps the vector from overflowing or underflowing while preserving the direction. The method is simple, but its speed depends on the spectral gap: close eigenvalues produce slow separation.

**Definition & Assumptions (§3).** Assume $A$ has eigenvectors $q_i$ and $|\lambda_1|>|\lambda_2|\ge\cdots$:
1. Write the starting vector as $v_0=c_1q_1+c_2q_2+\cdots$ because the eigenvectors form a basis for the example setting.
2. Multiply once: $Av_0=c_1\lambda_1q_1+c_2\lambda_2q_2+\cdots$.
3. After $k$ multiplications, $A^kv_0=c_1\lambda_1^kq_1+c_2\lambda_2^kq_2+\cdots$.
4. Factor out $\lambda_1^k$: $A^kv_0=\lambda_1^k(c_1q_1+c_2(\lambda_2/\lambda_1)^kq_2+\cdots)$.
5. The non-dominant ratios shrink like $|\lambda_i/\lambda_1|^k$.
6. Normalizing each step prevents overflow while keeping the direction.

**Symbols.** $\lambda_i$ are eigenvalues; $q_i$ are eigenvectors; $c_i$ are starting-vector components; $|\lambda_2/\lambda_1|$ is the convergence ratio.

**Real-World Applications (§5).**
1. **Dominant direction** — for $A=\operatorname{diag}(3,1)$ and $v_0=(1,1)$, after $5$ powers the component ratio is $(1/3)^5\approx0.004115$.
2. **Rayleigh quotient** — the normalized fifth iterate gives eigenvalue estimate $2.99997$.
3. **Iteration count** — to make the ratio below $10^{-3}$ when $|\lambda_2/\lambda_1|=1/3$, need $7$ iterations.
4. **PCA warmup** — if singular values are $10$ and $8$, the power ratio is $0.8$ and convergence is much slower.
5. **PageRank-style stationary vector** — repeated transition-matrix multiplication is power iteration on an eigenvalue-$1$ operator.
6. **Spectral normalization** — estimating the top singular value by power iteration lets a layer rescale weights using one or two matrix multiplies per training step.

### `math-27-09` — The QR algorithm  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on orthogonal matrices, triangular factors, and eigenvalue preservation under similarity transforms. Earlier lessons treated QR factorization as a stable way to decompose a matrix. The QR algorithm uses that factorization repeatedly to reveal eigenvalues.
>
> The method sits between elementary eigenvalue theory and production eigensolvers. It explains why orthogonal transformations are so valuable in numerical linear algebra: they change the representation of a matrix while preserving its spectrum and controlling numerical growth.

**Motivation & Intuition (§2).**
> The QR algorithm computes eigenvalues by repeatedly factoring a matrix into an orthogonal part and an upper-triangular part, then reversing the factors. The reversed product is not the same matrix, but it is orthogonally similar to the original matrix at that step. Similarity keeps the eigenvalues unchanged.
>
> For symmetric matrices, the repeated process tends to move the matrix toward diagonal form under favorable conditions. As the off-diagonal entries shrink, the diagonal entries approach the eigenvalues. Practical eigensolvers add shifts and reductions to make this efficient, but the unshifted step shows the central invariant: the eigenvalues are preserved while the matrix becomes easier to read.

**Definition & Assumptions (§3).** For one unshifted QR step:
1. Factor $A_k=Q_kR_k$ where $Q_k^TQ_k=I$ and $R_k$ is upper triangular.
2. Define $A_{k+1}=R_kQ_k$ by reversing the factors.
3. Substitute $R_k=Q_k^TA_k$ from the factorization.
4. Then $A_{k+1}=Q_k^TA_kQ_k$.
5. This is an orthogonal similarity transform, so $A_{k+1}$ has the same eigenvalues as $A_k$.
6. Repeating the step drives a symmetric matrix toward diagonal form under favorable conditions, leaving eigenvalues on the diagonal.

**Symbols.** $Q_k$ is orthogonal; $R_k$ is upper triangular; $A_{k+1}$ is similar to $A_k$; similarity preserves eigenvalues.

**Real-World Applications (§5).**
1. **One QR step** — for $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, one step gives approximately $\begin{bmatrix}2.8&-0.6\\-0.6&1.2\end{bmatrix}$.
2. **Eigenvalue preservation** — the original and updated matrices both have eigenvalues $3$ and $1$.
3. **Off-diagonal shrinkage** — after five unshifted steps on that matrix, the off-diagonal magnitude is about $0.00823$.
4. **Symmetric eigensolver** — covariance PCA can use QR after reducing the matrix to tridiagonal form.
5. **Convergence diagnosis** — when the subdiagonal falls below $10^{-10}$, the lower block can be deflated.
6. **Small Hessian analysis** — a $2\times2$ Hessian with eigenvalues $3$ and $1$ has condition number $3$.

### `math-27-10` — Lanczos iteration  · AUTHOR derivation

**Connections (§1).**
> This lesson follows power iteration and QR by focusing on spectral information for large symmetric matrices. A full eigendecomposition may be impossible when the matrix has millions of rows, but matrix-vector products may still be affordable. Lanczos uses those products to build a much smaller matrix that captures important eigenvalue information.
>
> The method also connects Krylov subspaces with optimization diagnostics and graph computations. It is one reason large systems can estimate top curvature, embedding spectra, or kernel behavior without ever forming all dense matrix entries.

**Motivation & Intuition (§2).**
> Lanczos is a Krylov method specialized to symmetric matrices. Starting from one unit vector, it repeatedly applies $A$ and removes components in directions already represented. Symmetry makes the recurrence short: each new vector only needs nearby correction terms, producing a tridiagonal projected matrix.
>
> The small tridiagonal matrix is useful because its eigenvalues approximate eigenvalues of the original large matrix. This is a controlled compression of spectral information. The large matrix is still present through matrix-vector products, but the expensive eigenvalue calculation happens on the small matrix $T_k$.

**Definition & Assumptions (§3).** For symmetric $A$:
1. Start with a unit vector $q_1$.
2. Compute $w=Aq_1$ because the Krylov space begins by applying $A$.
3. Set $\alpha_1=q_1^Tw$ to capture the component of $w$ along $q_1$.
4. Subtract it: $w\leftarrow w-\alpha_1q_1$ so the remaining vector is orthogonal to $q_1$.
5. Set $\beta_1=\|w\|$ and $q_2=w/\beta_1$ if $\beta_1\ne0$.
6. Repeating this process gives $AQ_k=Q_kT_k+\beta_kq_{k+1}e_k^T$, where $T_k$ is tridiagonal.

**Symbols.** $q_i$ are orthonormal Lanczos vectors; $\alpha_i$ are diagonal entries of $T_k$; $\beta_i$ are off-diagonal entries; $T_k$ is the small tridiagonal projection of $A$.

**Real-World Applications (§5).**
1. **First step** — for $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ and $q_1=(1,0)$, $\alpha_1=2$, $w=(0,1)$, and $\beta_1=1$.
2. **Second basis vector** — the same step gives $q_2=(0,1)$.
3. **Projected matrix** — after two steps, $T=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ with eigenvalues $1$ and $3$.
4. **Top Hessian eigenvalue** — Lanczos can estimate curvature using Hessian-vector products without forming a dense Hessian.
5. **Embedding spectra** — a sparse graph Laplacian with $10^6$ nodes can be probed with $50$ Lanczos vectors instead of a full eigendecomposition.
6. **Memory budget** — storing $50$ FP32 vectors of length $10^6$ costs $50\cdot10^6\cdot4=200$ MB.

### `math-27-11` — Sparse matrices  · deepen derivation

**Connections (§1).**
> This lesson builds on matrices and matrix-vector multiplication, but changes the storage model. A dense matrix records every possible entry, including zeros. Many scientific and graph problems have matrices where most entries are zero, so dense storage wastes both memory and arithmetic.
>
> Sparse matrices connect directly to CG, GMRES, Lanczos, PDE grids, and graph machine learning. In all of those settings, the core operation is often not forming a matrix inverse, but multiplying a sparse matrix by a vector many times.

**Motivation & Intuition (§2).**
> Sparse matrices store only the nonzero entries. This is not just a memory trick. It changes which algorithms are practical because matrix-vector products scale with the number of nonzeros rather than the number of possible entries.
>
> The storage format must match the operation. Compressed sparse row storage is organized row by row because a matrix-vector product computes one output row at a time. Each nonzero contributes one multiplication with the matching entry of $x$ and one addition into the row sum. The savings become large when the number of nonzeros is tiny compared with the dense matrix size.

**Definition & Assumptions (§3).** For compressed sparse row (CSR) storage:
1. Scan row by row because matrix-vector multiplication also consumes rows.
2. Store each nonzero value in `values`.
3. Store its column index in `col_idx` so the matching entry of $x$ can be found.
4. Store row start positions in `row_ptr` so row $i$ is the slice from `row_ptr[i]` to `row_ptr[i+1]`.
5. Compute $(Ax)_i$ by summing `values[k] * x[col_idx[k]]` over that slice.
6. The work is about $2\operatorname{nnz}$ floating-point operations because each nonzero contributes one multiply and one add.

**Symbols.** $\operatorname{nnz}$ is the number of nonzero entries; CSR means compressed sparse row; `row_ptr`, `col_idx`, and `values` are the three arrays; $Ax$ is a sparse matrix-vector product.

**Real-World Applications (§5).**
1. **CSR example** — for $A=\begin{bmatrix}0&5&0&0\\2&0&0&3\\0&0&4&0\end{bmatrix}$ and $x=(1,2,3,4)$, $Ax=(10,14,12)$.
2. **Storage comparison** — that $3\times4$ example has $12$ dense entries and $4$ nonzeros; CSR also needs row pointers, so tiny matrices may not save space.
3. **Large sparse win** — a $10{,}000\times10{,}000$ matrix at $0.1\%$ density has $100{,}000$ nonzeros instead of $100{,}000{,}000$ dense entries.
4. **CSR array count** — that large matrix uses about $2\cdot100{,}000+10{,}001=210{,}001$ stored numbers/indices.
5. **Sparse matvec flops** — $100{,}000$ nonzeros cost about $200{,}000$ multiply-add operations.
6. **Graph ML** — a graph with $1{,}000{,}000$ edges stores about $2{,}000{,}000$ adjacency nonzeros when edges are symmetrized.

### `math-27-12` — Numerical optimization in practice  · deepen derivation

**Connections (§1).**
> This lesson builds on gradients, Taylor approximation, and the optimization ideas used throughout machine learning. Earlier calculus lessons explain why a gradient points toward local increase. Numerical optimization asks how to turn that local information into a stable sequence of computed steps.
>
> The lesson also prepares the reader for automatic differentiation and training stability. Gradients are only useful when the surrounding workflow chooses step sizes, scales updates, checks progress, and stops at a level of precision the computation can justify.

**Motivation & Intuition (§2).**
> Numerical optimization is the engineering layer around gradients: choose a step, scale it, test whether it helped, and stop when further work is not justified. The mathematics is local because a gradient describes the function near the current point. A step that is sensible locally can still fail if it is too large or if the function curves sharply.
>
> That is why optimization practice includes line searches, learning-rate schedules, clipping, validation checks, and stopping criteria. These tools do not replace the gradient; they make the gradient usable in finite-precision computation. The goal is to make steady progress without interpreting noise, roundoff, or validation fluctuation as meaningful improvement.

**Definition & Assumptions (§3).** For a gradient step on a smooth function:
1. Use the first-order Taylor approximation $f(x+s)\approx f(x)+\nabla f(x)^Ts$.
2. Choose steepest-descent step $s=-\alpha g$ with $g=\nabla f(x)$.
3. Substitute to get $f(x-\alpha g)\approx f(x)-\alpha g^Tg$.
4. Since $g^Tg=\|g\|^2\ge0$, small positive $\alpha$ predicts a decrease.
5. A line search or schedule controls $\alpha$ because the first-order approximation can fail for large steps.
6. Stopping criteria compare gradient norm, step size, validation change, and numerical tolerance.

**Symbols.** $g$ is the gradient; $s$ is the proposed step; $\alpha$ is the learning rate or step size; $\|g\|$ measures first-order stationarity; a line search tests actual decrease.

**Real-World Applications (§5).**
1. **Quadratic step** — for $f(x)=(x-3)^2$, $x_0=0$, and $\alpha=0.1$, the update is $x_1=0.6$ and $f(x_1)=5.76$.
2. **Gradient clipping** — clipping $g=(3,4)$ to norm $2$ returns $(1.2,1.6)$.
3. **Loss decrease check** — for the Part 02 quadratic at $(1,2)$, step $0.1(4,9)$ gives new value $2.78$, down from $11$.
4. **Learning-rate sweep** — testing $5$ learning rates across $3$ seeds gives $15$ training runs.
5. **Stopping by gradient norm** — if $\|g\|=8\times10^{-4}$ and tolerance is $10^{-3}$, the first-order stopping test passes.
6. **Weight decay update** — with gradient $0.6$, weight $2$, decay $0.01$, and step $0.1$, the update uses $0.6+0.02=0.62$ and moves the weight by $0.062$.

### `math-27-13` — Automatic differentiation  · full-depth model above

**Connections (§1).**
> This lesson builds on the chain rule and on the idea of a computation as a sequence of intermediate values. In earlier calculus lessons, derivatives were usually taken from a formula written on one line. In real machine-learning code, the loss is produced by a program: matrix multiplications, nonlinearities, reshapes, normalizations, and reductions all happen before the final scalar appears.
>
> Automatic differentiation is the bridge between those two views. It applies the chain rule to the actual operations the program executed. That makes it different from finite differences, which estimate a slope by rerunning the program, and different from symbolic algebra, which tries to rewrite a formula. Reverse-mode automatic differentiation is the engine behind backpropagation, so this lesson is the numerical-methods version of how gradients are computed in modern training systems.

**Motivation & Intuition (§2).**
> A derivative through a long computation is difficult because every intermediate value can affect later values. The safe way to handle that dependency is to name the intermediate values and keep local derivative rules for each operation. If $u=3x$, then the local rule is $du/dx=3$. If $v=u^2$, then the local rule is $dv/du=2u$. The whole derivative is built by chaining these local rules together.
>
> Reverse mode starts from a scalar output, usually a loss, and walks backward. It attaches to each intermediate value an adjoint, written $\bar v$, meaning “how much the final loss changes when this value changes.” When one value feeds several later operations, reverse mode adds all contributions into the same adjoint. That accumulation is the practical heart of backpropagation: every parameter receives the total effect of all paths by which it influences the loss.
>
> The important point is that automatic differentiation computes derivatives of the executed numerical program. It does not remove floating-point roundoff, and it still needs conventions at nondifferentiable points, but it gives exact chain-rule derivatives for the operations that were actually run.

**Definition & Assumptions (§3).** Display the reverse-mode accumulation rule
$$
\bar u \mathrel{+}= \bar v\,{\partial v \over \partial u}.
$$
Then work the example $x=2$, $u=3x$, $v=u^2$, $L=v+5u$ completely:
1. Forward pass: $u=3\cdot2=6$ because $u$ is three times the input.
2. Forward pass: $v=6^2=36$ because $v$ squares the intermediate $u$.
3. Forward pass: $L=36+5\cdot6=66$ because the loss adds $v$ and $5u$.
4. Seed the backward pass with $\bar L=1$ because $\partial L/\partial L=1$.
5. From $L=v+5u$, add $\bar v=1$ because $\partial L/\partial v=1$.
6. From the same line, add $5$ to $\bar u$ because $\partial L/\partial u=5$ through the direct $5u$ path.
7. From $v=u^2$, add $\bar v(2u)=1\cdot12=12$ to $\bar u$ because the square path also changes the loss.
8. Combine the two paths: $\bar u=5+12=17$ because adjoints add contributions from all downstream uses.
9. From $u=3x$, compute $\bar x=\bar u\cdot3=17\cdot3=51$ because $\partial u/\partial x=3$.
10. Therefore $dL/dx=51$.

**Symbols.** $x$ is the input; $u,v$ are intermediate values stored from the forward pass; $L$ is the scalar loss; $\bar v=\partial L/\partial v$ is the adjoint of $v$; $\mathrel{+}=$ means “accumulate into the existing adjoint,” which matters when several paths meet.

**Real-World Applications (§5).**
1. **Backpropagation at scale** — reverse-mode AD computes one gradient of a scalar loss with cost on the order of a few forward passes; a model with $10^7$ parameters avoids $10^7$ finite-difference reruns.
2. **Worked graph audit** — for $x=2,u=3x,v=u^2,L=v+5u$, the adjoint check returns $dL/dx=51$, so a framework trace can be tested against a hand calculation.
3. **Custom layer backward rule** — if a scale layer outputs $y=3x$ and receives incoming adjoint $0.7$, it returns $0.7\cdot3=2.1$.
4. **Hypergradient contribution** — if a validation-loss adjoint through a learning-rate node is $0.8$ and the local derivative is $-0.03$, the contribution is $0.8(-0.03)=-0.024$.
5. **Forward-mode sensitivity** — for $f(a,b)=ab^2$ at $(3,2)$, local differentiation gives $\partial f/\partial a=4$ and $\partial f/\partial b=12$.
6. **HMC log-density gradient** — for log density $\ell(x)=-x^2/2$ at $x=1.5$, AD returns $\ell'(x)=-1.5$, the number a Hamiltonian Monte Carlo step needs.

### `math-27-14` — ODE solvers in practice  · deepen derivation

**Connections (§1).**
> This lesson connects differential equations from calculus with the discrete updates used by a computer. An exact solution $y(t)$ describes a continuous trajectory. A numerical solver stores only selected time points and uses the differential equation to move from one point to the next.
>
> ODE solvers also connect to simulations, control systems, neural ODEs, and time-dependent physical models. The same questions appear repeatedly: how accurate is each step, how stable is the update, and how many function evaluations are needed.

**Motivation & Intuition (§2).**
> An ODE solver advances a state through time by replacing an exact trajectory with carefully chosen discrete steps. The derivative $f(t,y)$ tells the local direction of motion. Euler's method uses that local direction as if it stayed constant over a short interval of length $h$.
>
> The central questions are accuracy, stability, and cost per step. Smaller steps usually reduce approximation error, but they require more steps. Higher-order methods use more information per step to reduce error faster. Stability adds a separate restriction: even a formula that is locally consistent can behave badly if the step size is too large for the dynamics.

**Definition & Assumptions (§3).** For forward Euler on $y'=f(t,y)$:
1. Start from Taylor's formula $y(t+h)=y(t)+hy'(t)+O(h^2)$.
2. Substitute the ODE $y'(t)=f(t,y(t))$.
3. Drop the $O(h^2)$ term to get $y(t+h)\approx y(t)+hf(t,y(t))$.
4. Define the numerical update $y_{n+1}=y_n+hf(t_n,y_n)$.
5. The local truncation error is $O(h^2)$ because that is the first omitted term.
6. Over about $1/h$ steps on a fixed interval, global error is $O(h)$ for Euler.

**Symbols.** $y(t)$ is the exact state; $y_n$ is the numerical state; $h$ is the step size; $f$ is the time derivative; local error is one-step error; global error is accumulated error.

**Real-World Applications (§5).**
1. **Euler decay step** — for $y'=-2y$, $y_0=1$, $h=0.1$, Euler gives $0.8$ while exact is $e^{-0.2}\approx0.81873$, error $0.01873$.
2. **RK4 comparison** — RK4 on the same step gives about $0.818733$, error $2.58\times10^{-6}$.
3. **Order check** — halving $h$ should reduce Euler global error by about $2$ and RK4 error by about $16$.
4. **Stability bound** — for $y'=-10y$, Euler needs $h<2/10=0.2$ for the linear stability interval.
5. **Neural ODE cost** — an adaptive solve using $64$ function evaluations costs about $64$ network evaluations per forward pass.
6. **Simulation budget** — integrating $10$ seconds with $h=0.01$ uses $1000$ steps.

### `math-27-15` — PDE solvers in practice  · deepen derivation

**Connections (§1).**
> This lesson extends the ODE idea from time-dependent states to fields over space and time. A PDE describes how nearby values of a field relate through spatial and temporal derivatives. A computer cannot store a full continuum, so the field must be represented on a grid or mesh.
>
> PDE discretization connects Taylor expansions, sparse matrices, stability conditions, and simulation workflows. It also explains why many large scientific systems lead naturally to sparse linear algebra.

**Motivation & Intuition (§2).**
> PDE solvers turn fields over space and time into values on a grid or mesh. A derivative becomes a stencil: a weighted pattern of neighboring grid values that approximates the local derivative. The centered second derivative is one of the basic examples because adding values on both sides cancels the first-derivative terms.
>
> The method is only useful if the discretization is consistent with the derivatives and stable under the chosen time step. Refining the grid usually improves spatial accuracy, but it also increases the number of unknowns and can force smaller time steps. A PDE solver is therefore a balance among accuracy, stability, memory, and runtime.

**Definition & Assumptions (§3).** For the centered second derivative:
1. Expand $u(x+h)=u(x)+hu'(x)+\tfrac12h^2u''(x)+O(h^3)$.
2. Expand $u(x-h)=u(x)-hu'(x)+\tfrac12h^2u''(x)+O(h^3)$.
3. Add the expansions so the first-derivative terms cancel.
4. The sum is $u(x+h)+u(x-h)=2u(x)+h^2u''(x)+O(h^4)$.
5. Rearrange to get $u''(x)\approx\{u(x-h)-2u(x)+u(x+h)\}/h^2$.
6. This stencil is the core of many finite-difference diffusion and Poisson solvers.

**Symbols.** $u(x)$ is a field; $h$ or $\Delta x$ is grid spacing; a stencil is the weighted pattern of neighboring grid values; $\Delta t$ is the time step; $r=\alpha\Delta t/\Delta x^2$ is the heat-equation stability ratio.

**Real-World Applications (§5).**
1. **Second derivative** — for values $(1,2,4)$ with $h=0.5$, the stencil gives $(1-4+4)/0.25=4$.
2. **Heat stability** — with $\alpha=1$ and $\Delta x=0.1$, explicit heat stepping needs $\Delta t\le0.005$.
3. **Grid unknowns** — a $100\times100$ image-like grid has $10{,}000$ scalar unknowns per field.
4. **2-D Laplacian cost** — the five-point stencil uses about $5$ neighboring coefficients per interior grid point.
5. **Physics-informed residual** — if $u_t=0.3$ and $0.1u_{xx}=0.25$, the heat residual is $0.05$.
6. **Mesh refinement** — halving $\Delta x$ in a 2-D grid increases cell count by about $4\times$.

### `math-27-16` — Monte Carlo methods  · deepen derivation

**Connections (§1).**
> This lesson builds on expectation, variance, and sample averages from probability. Many quantities in scientific computing can be written as integrals or expected values, but exact evaluation may be unavailable. Monte Carlo replaces exact calculation with repeated random sampling.
>
> The method connects numerical analysis with uncertainty quantification, simulation, Bayesian computation, and machine-learning evaluation. Its error law is simple and important: the dimension of the problem may be large, but the sampling error still falls only as the square root of the number of samples.

**Motivation & Intuition (§2).**
> Monte Carlo methods replace an exact integral or expectation with an average of random samples. Each sample is noisy, but the average is stable because independent positive and negative deviations tend to cancel. The estimator is useful when drawing samples is easier than evaluating the target quantity analytically.
>
> The signature fact is slow but dimension-friendly error: the standard error falls like $1/\sqrt N$. This means that a tenfold reduction in error requires one hundred times as many samples. The method is therefore easy to parallelize and broadly applicable, but accuracy must be reported with uncertainty rather than as if the random average were exact.

**Definition & Assumptions (§3).** For independent samples $X_1,\dots,X_N$ with mean $\mu$ and variance $\sigma^2$:
1. Define the estimator $\hat\mu=N^{-1}\sum_{i=1}^N X_i$.
2. Take expectation: $E[\hat\mu]=N^{-1}\sum E[X_i]=\mu$, so the estimator is unbiased.
3. Use independence: $\operatorname{Var}(\sum X_i)=\sum\operatorname{Var}(X_i)=N\sigma^2$.
4. Scale by $1/N^2$ to get $\operatorname{Var}(\hat\mu)=\sigma^2/N$.
5. Take the square root to get standard error $\sigma/\sqrt N$.
6. Therefore reducing error by $10\times$ needs $100\times$ more samples.

**Symbols.** $X_i$ are random samples; $\mu$ is the target expectation; $\hat\mu$ is the Monte Carlo estimate; $N$ is sample count; $\sigma/\sqrt N$ is standard error.

**Real-World Applications (§5).**
1. **Pi estimate uncertainty** — with hit probability $\pi/4$ and $N=10{,}000$, the standard error of $4\hat p$ is about $0.0164$.
2. **Sample-size planning** — if $\sigma=2$ and desired standard error is $0.01$, need $(2/0.01)^2=40{,}000$ samples.
3. **Error reduction** — increasing samples from $100$ to $10{,}000$ reduces standard error by $10\times$.
4. **Dropout prediction averaging** — averaging $25$ stochastic forward passes cuts standard deviation by $5\times$.
5. **Policy evaluation** — if return standard deviation is $50$ and $N=2500$, the standard error is $1$.
6. **A/B simulation** — two independent estimates with standard errors $0.03$ and $0.04$ have difference standard error $\sqrt{0.03^2+0.04^2}=0.05$.

### `math-27-17` — Randomized numerical linear algebra  · AUTHOR derivation

**Connections (§1).**
> This lesson connects linear algebra, probability, and large-scale computation. Earlier lessons computed subspaces using deterministic factorizations or iterations. Randomized numerical linear algebra uses random test directions to discover the part of a large matrix that matters most.
>
> The method leads naturally from power iteration and SVD ideas into modern large-data workflows. It is especially useful when the matrix is too large to decompose directly but multiplying it by a block of vectors is affordable.

**Motivation & Intuition (§2).**
> Randomized linear algebra uses random projections to find the important subspace of a large matrix before doing expensive deterministic work. Random directions are unlikely to miss a dominant low-rank structure completely, especially when a few oversampling directions are included. Multiplying $A$ by those directions produces sample columns that live in the column space of $A$.
>
> Once those sample columns are orthonormalized, the large matrix can be projected onto their span. The expensive work is then performed on a compressed matrix with only $\ell$ rows. Power iterations can sharpen the separation when singular values decay slowly, but the main idea remains the same: use randomness to find a good working subspace cheaply.

**Definition & Assumptions (§3).** For a randomized range finder:
1. Draw a random test matrix $\Omega\in\mathbb R^{n\times \ell}$ because random directions usually touch the dominant right-singular subspace.
2. Form $Y=A\Omega$ so the columns of $Y$ live in the column space of $A$.
3. Orthonormalize $Y$ to get $Q$ with $Q^TQ=I$.
4. Approximate $A$ by projecting onto that range: $A\approx QQ^TA$.
5. Compress to $B=Q^TA$, which has only $\ell$ rows.
6. Compute an SVD of $B$ and lift left singular vectors back with $Q$.

**Symbols.** $A$ is the large matrix; $\Omega$ is a random test matrix; $\ell=k+p$ is target rank plus oversampling; $Y$ is the sample matrix; $Q$ is an orthonormal basis; $B$ is the compressed matrix.

**Real-World Applications (§5).**
1. **Projection example** — with $A=\begin{bmatrix}3&0\\0&1\\0&0\end{bmatrix}$ and $\omega=(1,-1)$, $y=A\omega=(3,-1,0)$.
2. **Basis vector** — $q=y/\|y\|=(0.9487,-0.3162,0)$.
3. **Compressed row** — $q^TA=(2.8460,-0.3162)$.
4. **Projection error** — the Frobenius norm drops from $\sqrt{10}$ to captured norm $2.8636$, leaving residual about $1.3416$.
5. **Power iteration sharpening** — if $\sigma_2/\sigma_1=0.5$ and $q=1$ power step is used, the unwanted ratio scales like $0.5^3=0.125$.
6. **Memory budget** — storing $\ell=60$ FP32 sketch vectors of length $10^6$ costs $240$ MB.

### `math-27-18` — GPU and parallel computing  · deepen derivation

**Connections (§1).**
> This lesson connects numerical methods with the hardware that executes them. Vectorization showed how to hand many operations to optimized kernels. GPU and parallel computing ask how much speed is actually possible when work is divided across many workers.
>
> The lesson also prepares the reader to interpret performance claims in machine learning systems. Arithmetic throughput, memory bandwidth, communication, kernel launches, and serial fractions all affect the observed runtime.

**Motivation & Intuition (§2).**
> Parallel computing makes a numerical method fast only when enough work can run at the same time and data movement does not dominate. Some operations, such as large matrix multiplication, contain enough repeated arithmetic to use many GPU cores efficiently. Other operations move so much data relative to their arithmetic that memory bandwidth sets the limit.
>
> The useful speedup calculation always includes serial work, memory bandwidth, and communication. Amdahl's law gives the simplest warning: even a small serial fraction can cap the benefit of adding more workers. In distributed training, communication can become the new bottleneck after computation is parallelized.

**Definition & Assumptions (§3).** Use Amdahl's law:
1. Normalize single-worker runtime to $1$.
2. Let fraction $p$ be perfectly parallelizable and fraction $1-p$ be serial.
3. On $N$ workers, the serial part still costs $1-p$.
4. The parallel part costs $p/N$ under ideal scaling.
5. Total time is $(1-p)+p/N$.
6. Speedup is the reciprocal: $S_N=1/((1-p)+p/N)$.

**Symbols.** $p$ is the parallel fraction; $N$ is number of workers; $S_N$ is speedup; bandwidth measures bytes per second; FLOP/s measures arithmetic throughput.

**Real-World Applications (§5).**
1. **Amdahl limit** — with $p=0.95$ and $N=100$, speedup is $1/(0.05+0.95/100)\approx16.81$, not $100$.
2. **Matrix multiply ideal time** — a $1024^3$ GEMM needs about $2.147\times10^9$ flops, so at $10$ TFLOP/s the ideal compute time is $0.215$ ms.
3. **All-reduce cost** — communicating $100$ MB over $25$ GB/s takes about $4$ ms before latency.
4. **Memory-bound vector add** — reading and writing $1.2$ GB at $900$ GB/s takes about $1.33$ ms, often larger than arithmetic time.
5. **Batch scaling** — doubling batch size from $512$ to $1024$ doubles data-parallel examples per step if memory fits.
6. **Kernel launch overhead** — fusing ten $20\,\mu$s elementwise kernels can save roughly $9$ launches, or about $180\,\mu$s, before arithmetic changes.

### `math-27-19` — Mixed precision & stability in training  · AUTHOR derivation · ML capstone

**Connections (§1).**
> This lesson brings together floating-point error, vectorized hardware, automatic differentiation, and optimization practice. Modern training systems often use low-precision formats because they are faster and use less memory. The numerical question is how to gain that speed without losing the small updates and accumulated sums that make training stable.
>
> Mixed precision is the capstone for the section because it is both mathematical and systems-oriented. It depends on unit roundoff, representable ranges, gradient scaling, optimizer state, and hardware throughput all at once.

**Motivation & Intuition (§2).**
> Mixed-precision training uses low-precision arithmetic for speed while keeping selected accumulations and master weights in higher precision for stability. Low precision can be safe for many matrix multiplications because the operations are regular and hardware support is strong. It can be unsafe for tiny gradients, long accumulations, or small parameter updates near values where the format has coarse spacing.
>
> The capstone idea is controlled compromise: use faster formats where their error is safe, and protect the parts of training that are numerically fragile. Loss scaling protects small gradients from underflow by temporarily enlarging them during backpropagation. FP32 accumulators or master weights protect repeated small updates from being rounded away.

**Definition & Assumptions (§3).** For loss scaling in FP16 training:
1. Let $g$ be a small gradient that may underflow in low precision.
2. Multiply the loss by a scale $S$, so backpropagation produces scaled gradient $Sg$ by linearity of differentiation.
3. Choose $S$ so $Sg$ lies in the representable FP16 range.
4. Before applying the optimizer update, divide the gradient by $S$ to recover $g$.
5. If the largest scaled gradient would exceed the FP16 maximum, reduce $S$ to avoid overflow.
6. Keep accumulators or master weights in FP32 so repeated small updates are not rounded away.

**Symbols.** $g$ is a gradient; $S$ is the loss scale; FP16 maximum finite value is about $65504$; unit roundoff is about $2^{-11}$ for FP16 and $2^{-24}$ for FP32; an accumulator is the variable that stores sums or optimizer state.

**Real-World Applications (§5).**
1. **Loss scaling** — a gradient $g=2\times10^{-8}$ scaled by $S=4096$ becomes $8.192\times10^{-5}$, then unscales back to $2\times10^{-8}$.
2. **Overflow guard** — if the largest gradient magnitude is $20$, the scale must satisfy $S\le65504/20\approx3275.2$.
3. **Accumulation error** — summing $1024$ products has FP16 bound $\gamma_{1024}\approx1.0$, while FP32 gives $\gamma_{1024}\approx6.10\times10^{-5}$.
4. **Throughput tradeoff** — a step that falls from $80$ ms in FP32 to $35$ ms in mixed precision is a $2.29\times$ speedup.
5. **Master-weight update** — if a weight is $1.0$ and the update is $10^{-5}$, FP32 can track the change while FP16's coarse spacing near $1$ may lose it.
6. **Softmax stability** — subtracting the max logit changes logits $(1000,999)$ to $(0,-1)$, preventing overflow while preserving probabilities.

---

## Build order

1. **Mechanical pass first:** fix `math-27-03`'s unclosed dollar delimiter; promote key formulas to display form; preserve matrix row breaks.
2. **Central ML method:** implement `math-27-13` from the model entry, then use its voice for the rest.
3. **Linear algebra solvers:** author `27-04` through `27-11` together so CG, GMRES, preconditioning, power iteration, QR, Lanczos, and sparse storage use consistent notation.
4. **Simulation and uncertainty:** author `27-14` through `27-17` together so order, stability, Monte Carlo error, and randomized SVD examples stay numerically checked.
5. **Systems capstone:** finish `27-02`, `27-18`, and `27-19` as the performance-and-stability thread: vectorization, GPU parallelism, and mixed precision.
6. **Final verification:** rerun the section dump, count 19 lessons, confirm 6 apps per lesson, confirm `math-27-03` is the only LaTeX bug fixed, and spot-check numeric examples with `python3` + `numpy`.
