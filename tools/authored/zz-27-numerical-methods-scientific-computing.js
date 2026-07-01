module.exports = {
  "math-27-01": {
    connectionsProse:
      "<p>This lesson gathers ideas that appeared throughout the applied mathematics track: modeling, approximation, computation, and error checking. Earlier lessons often focused on one formula or method at a time. Scientific computing asks how those pieces become a reliable answer to a real question. The workflow also prepares the reader for the rest of this section. Vectorization, floating-point arithmetic, linear solvers, ODE methods, Monte Carlo estimates, and GPU execution all fit into the same loop: state the model, compute carefully, and check what the answer can honestly support.</p>",
    motivation:
      "<p>Scientific computing turns a real question into a trustworthy numerical answer by moving through a reproducible chain: model the problem, discretize or approximate it, compute, check error, and report limits. The important word is trustworthy. A numerical answer can be wrong because the model is wrong, because the approximation is too coarse, because the solver has not converged, because the code has a bug, or because the result is interpreted more precisely than the computation allows.</p>" +
      "<p>The workflow separates those risks. The model stage asks whether the mathematical description matches the question. The discretization or approximation stage decides what finite problem the computer will actually solve. The compute stage produces a numerical answer, while residuals, grid refinement, repeated runs, and unit checks test whether the answer is stable. The final reporting stage records both the answer and the limits of confidence around it.</p>",
    definition:
      "<p>The <b>scientific computing workflow</b> is a five-stage loop: state the real question, build a mathematical model, discretize or approximate it, compute, check error, and report the result with its limits.</p>" +
      "<p><b>Assumptions that matter:</b> each stage catches a different failure mode: wrong model, unstable discretization, solver error, implementation bug, or overconfident interpretation.</p>",
    symbols: [
      { sym: "$q$", desc: "the real question" },
      { sym: "$m$", desc: "the mathematical model" },
      { sym: "$h$", desc: "a discretization or approximation scale" },
      { sym: "$\\hat", desc: "y$ the computed answer" },
      { sym: "$e$", desc: "an error estimate" },
      { sym: "$r$", desc: "a residual used to check whether the computed answer satisfies the model" }
    ],
    applications: [
      { title: "Residual check", background: "if a linear solve returns $\\|Ax-b\\|=10^{-6}$ and $\\|b\\|=10$, the relative residual is $10^{-7}$.", numbers: "if a linear solve returns $\\|Ax-b\\|=10^{-6}$ and $\\|b\\|=10$, the relative residual is $10^{-7}$." },
      { title: "Grid refinement", background: "halving $h$ from $0.1$ to $0.05$ should cut a first-order error from $0.02$ to about $0.01$.", numbers: "halving $h$ from $0.1$ to $0.05$ should cut a first-order error from $0.02$ to about $0.01$." },
      { title: "Runtime budget", background: "a workflow with 3 model candidates and 4 grid sizes creates $12$ runs before solver sweeps.", numbers: "a workflow with 3 model candidates and 4 grid sizes creates $12$ runs before solver sweeps." },
      { title: "Reproducibility", background: "five repeated Monte Carlo runs with standard deviation $0.04$ have standard error $0.04/\\sqrt5\\approx0.0179$.", numbers: "five repeated Monte Carlo runs with standard deviation $0.04$ have standard error $0.04/\\sqrt5\\approx0.0179$." },
      { title: "Unit consistency", background: "a velocity of $30$ m/s over $2$ s predicts $60$ m; a solver returning $60$ km is a modeling-unit failure.", numbers: "a velocity of $30$ m/s over $2$ s predicts $60$ m; a solver returning $60$ km is a modeling-unit failure." },
      { title: "Stopping rule", background: "if the validation metric changes by $0.002$ while the numerical tolerance is $0.01$, the computation cannot justify reporting the smaller change.", numbers: "if the validation metric changes by $0.002$ while the numerical tolerance is $0.01$, the computation cannot justify reporting the smaller change." }
    ]
  },
  "math-27-02": {
    connectionsProse:
      "<p>This lesson connects matrix multiplication with the way numerical programs actually run on modern hardware. Earlier linear algebra lessons treated $Xw$ as a compact notation for many dot products. Vectorization keeps that mathematical meaning but changes how the work is expressed to the computer. The lesson leads directly into scientific Python, array programming, GPU kernels, and batched machine-learning inference. It also sets up a recurring theme in this section: the arithmetic count is only part of performance, because overhead and data movement also matter.</p>",
    motivation:
      "<p>Vectorization replaces many scalar operations with one array operation that a numerical library can run in optimized kernels. Instead of asking an interpreter to perform one row prediction, then another, then another, the program hands the whole batch to a compiled routine. The mathematical operation is the same collection of multiply-adds, but the organization of the work is different.</p>" +
      "<p>This matters because modern CPUs, GPUs, and BLAS libraries are built to move and multiply blocks of data, not one Python loop iteration at a time. A vectorized call can reuse optimized memory access, SIMD instructions, cache behavior, and parallel execution. The speedup is not a new formula for $Xw$; it is the benefit of giving the same formula to the layer of software and hardware designed to execute it efficiently.</p>",
    definition:
      "<p><b>Vectorization</b> computes a batch of scalar dot products as one array operation. For a batch matrix-vector product, $$y=Xw.$$</p>" +
      "<p><b>Assumptions that matter:</b> $X$ has $n$ rows and $d$ features, all rows use the same weight vector $w$, and the vectorized call performs the same arithmetic as the scalar loop while reducing interpreter overhead.</p>",
    symbols: [
      { sym: "$X\\in\\mathbb R^{n\\times d}$", desc: "a batch of $n$ examples and $d$ features" },
      { sym: "$w\\in\\mathbb R^d$", desc: "the weight vector" },
      { sym: "$y\\in\\mathbb R^n$", desc: "the prediction vector" },
      { sym: "$n d$", desc: "scalar feature-weight products" }
    ],
    derivation: [
      { do: "Write the $i$th scalar prediction as $y_i=\\sum_{j=1}^d X_{ij}w_j$", result: "Write the $i$th scalar prediction as $y_i=\\sum_{j=1}^d X_{ij}w_j$", why: "row $i$ combines all $d$ features." },
      { do: "Stack all $n$ scalar equations vertically", result: "Stack all $n$ scalar equations vertically", why: "every row uses the same weights." },
      { do: "The stacked equations equal $y=Xw$ by the definition of matrix multiplication.", result: "The stacked equations equal $y=Xw$ by the definition of matrix multiplication.", why: "" },
      { do: "The scalar loop performs $nd$ multiply-add pairs", result: "The scalar loop performs $nd$ multiply-add pairs", why: "it repeats the dot product for each of $n$ rows." },
      { do: "The vectorized call performs the same arithmetic but hands it to a compiled kernel, so overhead is paid once instead of $n$ times.", result: "overhead is paid once instead of $n$ times.", why: "" },
      { do: "If the loop takes $120$ ms and the vectorized kernel takes $6$ ms, the measured speedup is $120/6=20$.", result: "$120/6=20$.", why: "" }
    ],
    applications: [
      { title: "Batch inference", background: "for $X=\\begin{bmatrix}1&2\\3&4\\5&6\\end{bmatrix}$ and $w=(0.5,-1)$, vectorization gives $Xw=(-1.5,-2.5,-3.5)$.", numbers: "for $X=\\begin{bmatrix}1&2\\3&4\\5&6\\end{bmatrix}$ and $w=(0.5,-1)$, vectorization gives $Xw=(-1.5,-2.5,-3.5)$." },
      { title: "Transformer projection", background: "a batch with $4096$ tokens and width $768$ performs $4096\\cdot768=3{,}145{,}728$ multiply-add pairs for one vector projection.", numbers: "a batch with $4096$ tokens and width $768$ performs $4096\\cdot768=3{,}145{,}728$ multiply-add pairs for one vector projection." },
      { title: "Measured kernel speedup", background: "$120$ ms loop versus $6$ ms vectorized call gives a $20\\times$ speedup.", numbers: "$120$ ms loop versus $6$ ms vectorized call gives a $20\\times$ speedup." },
      { title: "Memory-transfer bound", background: "moving $100$ MB at $800$ GB/s takes $100\\times10^6/(800\\times10^9)=0.125$ ms before arithmetic is counted.", numbers: "moving $100$ MB at $800$ GB/s takes $100\\times10^6/(800\\times10^9)=0.125$ ms before arithmetic is counted." },
      { title: "Broadcast normalization", background: "subtracting a length-$768$ mean vector from $4096$ rows applies $3{,}145{,}728$ scalar subtractions.", numbers: "subtracting a length-$768$ mean vector from $4096$ rows applies $3{,}145{,}728$ scalar subtractions." },
      { title: "Mini-batch loss", background: "computing $Xw-y$ for $8192$ examples produces $8192$ residuals in one array operation.", numbers: "computing $Xw-y$ for $8192$ examples produces $8192$ residuals in one array operation." }
    ]
  },
  "math-27-03": {
    connectionsProse:
      "<p>This lesson builds on real-number arithmetic, logarithmic scale, and the error estimates used in earlier numerical examples. In exact algebra, $20$ dollars and $19.97$ dollars differ by exactly $0.03$ dollars, and a long sum has the value dictated by the usual field rules. Floating-point arithmetic keeps the same intended operations but stores rounded representatives of real numbers. The lesson prepares the reader to judge when a computed result is numerically meaningful. It also connects to direct solvers, iterative methods, mixed precision, and machine-learning loss curves, where small reported changes can be below the precision that the computation can support.</p>",
    motivation:
      "<p>Floating-point arithmetic stores a rounded version of real arithmetic. Most roundoff is tiny because each operation is close to the corresponding real-number operation. The difficulty is that programs usually perform many operations, and the small errors can accumulate or be magnified by the structure of the computation.</p>" +
      "<p>Some computations are much more sensitive than others. Long sums collect many rounded operations. Subtracting nearly equal numbers can erase leading digits and leave mostly roundoff behind. Ill-conditioned solves can turn a small data or arithmetic perturbation into a large change in the answer. The purpose of the standard floating-point model is to give a compact way to estimate these effects before trusting extra digits.</p>",
    definition:
      "<p><b>Floating-point error</b> is modeled by treating each rounded operation as the exact operation multiplied by a small relative perturbation: $$\\operatorname{fl}(a\\circ b)=(a\\circ b)(1+\\delta).$$</p>" +
      "<p><b>Assumptions that matter:</b> one rounding obeys $|\\delta|\\le u$, accumulated bounds use $\\gamma_n=nu/(1-nu)$, and the bound requires $nu<1$.</p>",
    symbols: [
      { sym: "$\\operatorname{fl}$", desc: "the floating-point result" },
      { sym: "$u$", desc: "unit roundoff" },
      { sym: "$\\delta$", desc: "one operation's relative rounding error" },
      { sym: "$\\gamma_n$", desc: "a compact bound for $n$ accumulated roundings" }
    ],
    derivation: [
      { do: "Let $\\circ$ be one operation and $\\operatorname{fl}$ be the rounded result", result: "Let $\\circ$ be one operation and $\\operatorname{fl}$ be the rounded result", why: "computers store finite precision." },
      { do: "Bound one rounding by $|\\delta|\\le u$, where $u$ is the unit roundoff.", result: "the unit roundoff.", why: "" },
      { do: "For a chain of $n$ rounded operations, multiply the factors $(1+\\delta_1)\\cdots(1+\\delta_n)$.", result: "For a chain of $n$ rounded operations, multiply the factors $(1+\\delta_1)\\cdots(1+\\delta_n)$.", why: "" },
      { do: "Bound the accumulated relative error by $\\gamma_n=nu/(1-nu)$ when $nu<1$.", result: "Bound the accumulated relative error by $\\gamma_n=nu/(1-nu)$ when $nu<1$.", why: "" },
      { do: "For FP32, $u=2^{-24}\\approx5.96\\times10^{-8}$.", result: "For FP32, $u=2^{-24}\\approx5.96\\times10^{-8}$.", why: "" },
      { do: "With $n=1000$, $\\gamma_{1000}\\approx5.96\\times10^{-5}$, so a stable sum's relative roundoff should be about six parts in $10^5$ or less.", result: "a stable sum's relative roundoff should be about six parts in $10^5$ or less.", why: "" }
    ],
    applications: [
      { title: "FP32 accumulation bound", background: "$1000$ operations give $\\gamma_{1000}\\approx5.96\\times10^{-5}$.", numbers: "$1000$ operations give $\\gamma_{1000}\\approx5.96\\times10^{-5}$." },
      { title: "Cancellation audit", background: "in FP32, $1.000001-1.000000$ rounds to about $9.5367\\times10^{-7}$, a $-4.63\\%$ relative error from $10^{-6}$.", numbers: "in FP32, $1.000001-1.000000$ rounds to about $9.5367\\times10^{-7}$, a $-4.63\\%$ relative error from $10^{-6}$." },
      { title: "Dot-product budget", background: "a 768-term dot product has roundoff scale roughly $768u\\approx4.58\\times10^{-5}$ before conditioning effects.", numbers: "a 768-term dot product has roundoff scale roughly $768u\\approx4.58\\times10^{-5}$ before conditioning effects." },
      { title: "Loss logging", background: "reporting a validation loss change of $10^{-7}$ from FP32 arithmetic is suspicious because it is near single-operation roundoff.", numbers: "reporting a validation loss change of $10^{-7}$ from FP32 arithmetic is suspicious because it is near single-operation roundoff." },
      { title: "Stable summation", background: "pairwise summation reduces the effective depth from $n$ to about $\\log_2 n$; for $1024$ terms that is $10$ levels.", numbers: "pairwise summation reduces the effective depth from $n$ to about $\\log_2 n$; for $1024$ terms that is $10$ levels." },
      { title: "Mixed-precision warning", background: "FP16 unit roundoff $2^{-11}\\approx4.88\\times10^{-4}$ makes a $0.1\\%$ metric change only about two units of roundoff.", numbers: "FP16 unit roundoff $2^{-11}\\approx4.88\\times10^{-4}$ makes a $0.1\\%$ metric change only about two units of roundoff." }
    ]
  },
  "math-27-04": {
    connectionsProse:
      "<p>This lesson continues the study of linear systems from earlier algebra lessons, now with attention to how the system is solved on a computer. The equation $Ax=b$ still means that a matrix transforms an unknown vector into a known right-hand side. A direct solver provides a finite sequence of algebraic operations that produces the unknown vector, up to floating-point error. Direct solvers are the reference point for several later lessons. Residuals from this lesson are used to check CG and GMRES, and factorization cost explains why sparse and iterative methods become necessary for very large systems.</p>",
    motivation:
      "<p>A direct solver uses elimination or factorization to solve $Ax=b$ in a predictable number of algebraic steps. For moderate dense systems, this predictability is valuable: the method does not depend on gradually improving a guess, and the same factorization can often be reused for many right-hand sides.</p>" +
      "<p>The practical habit is to solve and then check. The computed vector should be substituted back into the original system by forming the residual $r=b-Ax$. A small residual does not answer every conditioning question, but it is the first test that the algebraic problem has been solved as stated. That same residual language will carry into iterative solvers, where stopping depends on whether the remaining equation error is small enough.</p>",
    definition:
      "<p>A <b>direct linear solver</b> solves $Ax=b$ through a finite elimination or factorization process and then checks the answer with the residual $$r=b-Ax.$$</p>" +
      "<p><b>Assumptions that matter:</b> the pivot used for elimination is nonzero, arithmetic is exact except for floating-point roundoff, and a small residual is a first check of the stated algebraic system.</p>",
    symbols: [
      { sym: "$A$", desc: "the coefficient matrix" },
      { sym: "$x$", desc: "the unknown vector" },
      { sym: "$b$", desc: "the right-hand side" },
      { sym: "$r=b-Ax$", desc: "the residual" },
      { sym: "LU", desc: "factorization writes $A=LU$ to reuse elimination for many $b$ values" }
    ],
    derivation: [
      { do: "Use row 1 as the pivot", result: "Use row 1 as the pivot", why: "its first entry is nonzero." },
      { do: "Subtract $2$ times row 1 from row 2 to eliminate the lower-left entry: row 2 becomes $[0,1\\mid1]$.", result: "row 2 becomes $[0,1\\mid1]$.", why: "" },
      { do: "Read $x_2=1$ from the second row.", result: "Read $x_2=1$ from the second row.", why: "" },
      { do: "Substitute into row 1: $2x_1+1=5$.", result: "$2x_1+1=5$.", why: "" },
      { do: "Solve $2x_1=4$, so $x_1=2$.", result: "$x_1=2$.", why: "" },
      { do: "Check $Ax=(5,11)^T$, so the residual $r=b-Ax$ is $(0,0)^T$.", result: "the residual $r=b-Ax$ is $(0,0)^T$.", why: "" }
    ],
    applications: [
      { title: "Dense calibration solve", background: "the example system gives $x=(2,1)$ with zero residual.", numbers: "the example system gives $x=(2,1)$ with zero residual." },
      { title: "Residual QA", background: "if $\\|r\\|=10^{-8}$ and $\\|b\\|=4$, the relative residual is $2.5\\times10^{-9}$.", numbers: "if $\\|r\\|=10^{-8}$ and $\\|b\\|=4$, the relative residual is $2.5\\times10^{-9}$." },
      { title: "Factorization cost", background: "dense LU for $n=3000$ costs about $(2/3)n^3=18$ billion flops.", numbers: "dense LU for $n=3000$ costs about $(2/3)n^3=18$ billion flops." },
      { title: "Many right-hand sides", background: "after one LU factorization, solving $20$ right-hand sides reuses the factors instead of repeating elimination $20$ times.", numbers: "after one LU factorization, solving $20$ right-hand sides reuses the factors instead of repeating elimination $20$ times." },
      { title: "Normal-equation caution", background: "solving $(X^TX)w=X^Ty$ squares the condition number; $\\kappa(X)=100$ becomes $\\kappa(X^TX)=10{,}000$.", numbers: "solving $(X^TX)w=X^Ty$ squares the condition number; $\\kappa(X)=100$ becomes $\\kappa(X^TX)=10{,}000$." },
      { title: "Small Newton system", background: "a $50\\times50$ dense Hessian solve costs about $(2/3)50^3\\approx83{,}333$ flops, small compared with a large model forward pass.", numbers: "a $50\\times50$ dense Hessian solve costs about $(2/3)50^3\\approx83{,}333$ flops, small compared with a large model forward pass." }
    ]
  },
  "math-27-05": {
    connectionsProse:
      "<p>This lesson builds on quadratic functions, gradients, and linear systems. For a symmetric positive definite matrix, solving $Ax=b$ is the same as minimizing a convex quadratic energy. That connection lets an algebra problem become an optimization problem with carefully chosen search directions. Conjugate gradient is the first Krylov method in this section. It prepares the reader for GMRES, preconditioning, and large sparse systems, where forming a dense factorization would be too expensive but matrix-vector products are still available.</p>",
    motivation:
      "<p>Conjugate gradient solves symmetric positive definite systems by choosing search directions that do not undo previous progress. Ordinary steepest descent can zigzag because each new step may partially disturb progress made by earlier steps. CG instead chooses directions that are independent in the geometry created by the matrix $A$.</p>" +
      "<p>The geometry is not ordinary perpendicularity; it is $A$-orthogonality, which matches the quadratic energy being minimized. Once the method has minimized along one direction, later $A$-conjugate directions preserve that minimization in exact arithmetic. This is why CG can reach the exact solution in at most the dimension of the system in exact arithmetic, while in practice it is valued because good approximations often arrive much sooner.</p>",
    definition:
      "<p><b>Conjugate gradient</b> solves symmetric positive definite systems by minimizing the quadratic energy $$\\phi(x)=\\tfrac12x^TAx-b^Tx.$$</p>" +
      "<p><b>Assumptions that matter:</b> $A$ is symmetric positive definite, residuals are negative gradients of the quadratic, and search directions are kept $A$-orthogonal.</p>",
    symbols: [
      { sym: "$A$", desc: "symmetric positive definite" },
      { sym: "$r_k$", desc: "the residual" },
      { sym: "$p_k$", desc: "the search direction" },
      { sym: "$\\alpha_k$", desc: "the step length" },
      { sym: "$\\beta_k$", desc: "mixes in the previous direction" },
      { sym: "$p_i^TAp_j=0$", desc: "$A$-orthogonality" }
    ],
    derivation: [
      { do: "Compute the residual $r_k=b-Ax_k$", result: "Compute the residual $r_k=b-Ax_k$", why: "$-\\nabla\\phi(x_k)=r_k$." },
      { do: "Search along $p_k$ by writing $x_{k+1}=x_k+\\alpha_kp_k$.", result: "Search along $p_k$ by writing $x_{k+1}=x_k+\\alpha_kp_k$.", why: "" },
      { do: "Minimize $\\phi(x_k+\\alpha p_k)$ in $\\alpha$ by setting the derivative to zero.", result: "Minimize $\\phi(x_k+\\alpha p_k)$ in $\\alpha$ by setting the derivative to zero.", why: "" },
      { do: "The derivative is $p_k^T(Ax_k-b)+\\alpha p_k^TAp_k=-p_k^Tr_k+\\alpha p_k^TAp_k$.", result: "$p_k^T(Ax_k-b)+\\alpha p_k^TAp_k=-p_k^Tr_k+\\alpha p_k^TAp_k$.", why: "" },
      { do: "Therefore $\\alpha_k=(r_k^Tr_k)/(p_k^TAp_k)$ for the standard CG recurrence.", result: "Therefore $\\alpha_k=(r_k^Tr_k)/(p_k^TAp_k)$ for the standard CG recurrence.", why: "" },
      { do: "Update $r_{k+1}=r_k-\\alpha_kAp_k$", result: "Update $r_{k+1}=r_k-\\alpha_kAp_k$", why: "$A(x_k+\\alpha_kp_k)=Ax_k+\\alpha_kAp_k$." },
      { do: "Choose $p_{k+1}=r_{k+1}+\\beta_kp_k$ and require $p_k^TAp_{k+1}=0$.", result: "Choose $p_{k+1}=r_{k+1}+\\beta_kp_k$ and require $p_k^TAp_{k+1}=0$.", why: "" },
      { do: "This gives $\\beta_k=(r_{k+1}^Tr_{k+1})/(r_k^Tr_k)$ in exact arithmetic, preserving $A$-conjugacy.", result: "$\\beta_k=(r_{k+1}^Tr_{k+1})/(r_k^Tr_k)$ in exact arithmetic, preserving $A$-conjugacy.", why: "" }
    ],
    applications: [
      { title: "One CG step", background: "for $A=\\begin{bmatrix}4&1\\1&3\\end{bmatrix}$, $b=(1,2)$, $x_0=0$, $\\alpha_0=5/20=0.25$ and $x_1=(0.25,0.5)$.", numbers: "for $A=\\begin{bmatrix}4&1\\1&3\\end{bmatrix}$, $b=(1,2)$, $x_0=0$, $\\alpha_0=5/20=0.25$ and $x_1=(0.25,0.5)$." },
      { title: "Residual update", background: "the same step gives $r_1=(-0.5,0.25)$ and $\\|r_1\\|\\approx0.559$.", numbers: "the same step gives $r_1=(-0.5,0.25)$ and $\\|r_1\\|\\approx0.559$." },
      { title: "Direction mixing", background: "$\\beta_0=(0.3125)/5=0.0625$, so $p_1=(-0.4375,0.375)$.", numbers: "$\\beta_0=(0.3125)/5=0.0625$, so $p_1=(-0.4375,0.375)$." },
      { title: "A-orthogonality check", background: "$p_0^TAp_1=0$, so the second direction does not spoil the first minimization.", numbers: "$p_0^TAp_1=0$, so the second direction does not spoil the first minimization." },
      { title: "Two-step exactness in 2-D", background: "the next step has $\\alpha_1\\approx0.3636$ and reaches $x=(0.0909,0.6364)$, the exact solution.", numbers: "the next step has $\\alpha_1\\approx0.3636$ and reaches $x=(0.0909,0.6364)$, the exact solution." },
      { title: "Condition-number estimate", background: "with $\\kappa=10$, the textbook CG error bound needs about $23$ iterations to push the relative factor below $10^{-6}$.", numbers: "with $\\kappa=10$, the textbook CG error bound needs about $23$ iterations to push the relative factor below $10^{-6}$." }
    ]
  },
  "math-27-06": {
    connectionsProse:
      "<p>This lesson follows naturally after CG and keeps the focus on solving large linear systems by using matrix-vector products. CG depends on symmetry and positive definiteness. Many systems from transport, advection, optimization, and engineering do not have those properties. GMRES is the corresponding Krylov idea for nonsymmetric systems. It also introduces a pattern that appears throughout numerical linear algebra: build a small problem inside a carefully chosen subspace, solve that small problem accurately, and use it to update the large solution.</p>",
    motivation:
      "<p>GMRES solves nonsymmetric linear systems by searching a growing Krylov subspace and choosing the vector with the smallest residual. The subspace is built from the initial residual and repeated multiplication by $A$, so it contains directions that are directly tied to how the current error behaves under the system matrix.</p>" +
      "<p>The method does not require the same energy-minimization geometry as CG. Instead, it asks for the approximate solution whose residual norm is smallest among all candidates in the current Krylov subspace. Arnoldi orthogonalization turns that large residual minimization into a small least-squares problem, which is the computational core of the method.</p>",
    definition:
      "<p><b>GMRES</b> solves nonsymmetric systems by choosing the approximate solution with minimum residual over a Krylov subspace: $$\\mathcal K_m(A,r_0)=\\operatorname{span}\\{r_0,Ar_0,\\dots,A^{m-1}r_0\\}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the Arnoldi basis is orthonormal, the update has the form $x_m=x_0+V_my$, and residual minimization reduces to a small least-squares problem.</p>",
    symbols: [
      { sym: "$\\mathcal K_m$", desc: "the Krylov subspace" },
      { sym: "$V_m$", desc: "its orthonormal basis" },
      { sym: "$\\bar H_m$", desc: "the small Hessenberg matrix from Arnoldi" },
      { sym: "$y$", desc: "the coordinate vector chosen by least squares" }
    ],
    derivation: [
      { do: "Form the Krylov subspace $\\mathcal K_m(A,r_0)=\\operatorname{span}\\{r_0,Ar_0,\\dots,A^{m-1}r_0\\}$", result: "Form the Krylov subspace $\\mathcal K_m(A,r_0)=\\operatorname{span}\\{r_0,Ar_0,\\dots,A^{m-1}r_0\\}$", why: "repeated multiplication by $A$ reveals directions connected to the residual." },
      { do: "Write $x_m=x_0+V_my$ where columns of $V_m$ are an orthonormal basis for that subspace.", result: "Write $x_m=x_0+V_my$ where columns of $V_m$ are an orthonormal basis for that subspace.", why: "" },
      { do: "The residual is $r_m=b-Ax_m=r_0-AV_my$.", result: "$r_m=b-Ax_m=r_0-AV_my$.", why: "" },
      { do: "Arnoldi gives $AV_m=V_{m+1}\\bar H_m$, so the residual becomes $V_{m+1}(\\|r_0\\|e_1-\\bar H_my)$.", result: "$AV_m=V_{m+1}\\bar H_m$, so the residual becomes $V_{m+1}(\\|r_0\\|e_1-\\bar H_my)$.", why: "" },
      { do: "Orthogonality of $V_{m+1}$ preserves norms, so minimizing $\\|r_m\\|$ is the small least-squares problem $\\min_y\\|\\|r_0\\|e_1-\\bar H_my\\|$.", result: "minimizing $\\|r_m\\|$ is the small least-squares problem $\\min_y\\|\\|r_0\\|e_1-\\bar H_my\\|$.", why: "" },
      { do: "That small least-squares solve is the GMRES update.", result: "the GMRES update.", why: "" }
    ],
    applications: [
      { title: "One-dimensional GMRES", background: "for $A=\\begin{bmatrix}2&1\\0&1\\end{bmatrix}$, $b=(1,1)$, $x_0=0$, searching $x=\\alpha b$ gives $\\alpha=0.4$.", numbers: "for $A=\\begin{bmatrix}2&1\\0&1\\end{bmatrix}$, $b=(1,1)$, $x_0=0$, searching $x=\\alpha b$ gives $\\alpha=0.4$." },
      { title: "Residual norm", background: "that step has residual $(-0.2,0.6)$ with norm $0.6325$.", numbers: "that step has residual $(-0.2,0.6)$ with norm $0.6325$." },
      { title: "Restart memory", background: "GMRES(50) stores $50$ basis vectors; for $10^6$ unknowns in FP32 that is $50\\cdot10^6\\cdot4=200$ MB.", numbers: "GMRES(50) stores $50$ basis vectors; for $10^6$ unknowns in FP32 that is $50\\cdot10^6\\cdot4=200$ MB." },
      { title: "Nonsymmetric PDE solve", background: "advection creates nonsymmetric matrices, so CG is invalid while GMRES can still minimize residuals.", numbers: "advection creates nonsymmetric matrices, so CG is invalid while GMRES can still minimize residuals." },
      { title: "Stopping rule", background: "if $\\|r_m\\|/\\|b\\|=8\\times10^{-7}$ and tolerance is $10^{-6}$, GMRES stops.", numbers: "if $\\|r_m\\|/\\|b\\|=8\\times10^{-7}$ and tolerance is $10^{-6}$, GMRES stops." },
      { title: "Least-squares size", background: "at iteration $m=30$, the inner problem has only $31$ rows and $30$ columns, much smaller than the original system.", numbers: "at iteration $m=30$, the inner problem has only $31$ rows and $30$ columns, much smaller than the original system." }
    ]
  },
  "math-27-07": {
    connectionsProse:
      "<p>This lesson connects linear solves with the condition-number ideas that appeared earlier in numerical analysis. CG and GMRES choose better approximations inside Krylov subspaces, but their speed still depends strongly on the matrix they see. A difficult matrix can make a good iterative method look slow. Preconditioning is the practical response. It also connects linear algebra with feature scaling in machine learning: changing the coordinates or operator can make the same underlying problem easier for an algorithm to navigate.</p>",
    motivation:
      "<p>Preconditioning changes the linear system into an equivalent one that is easier for an iterative solver. The goal is not to change the answer. The goal is to change the operator seen by the iteration so that the residual can be reduced in fewer steps.</p>" +
      "<p>A useful preconditioner resembles the original matrix enough to improve the spectrum, but is much cheaper to apply than solving the original system exactly. In practice, applying $M^{-1}$ usually means solving a simpler system $Mz=v$. The benefit must be measured as a tradeoff: fewer Krylov iterations are valuable only if each preconditioned iteration is not too expensive.</p>",
    definition:
      "<p><b>Preconditioning</b> replaces $Ax=b$ by an equivalent system whose operator is easier for an iterative method: $$M^{-1}Ax=M^{-1}b.$$</p>" +
      "<p><b>Assumptions that matter:</b> $M$ is invertible, applying $M^{-1}$ means solving a simpler system, and the solution $x$ is unchanged.</p>",
    symbols: [
      { sym: "$M$", desc: "the preconditioner" },
      { sym: "$M^{-1}A$", desc: "the preconditioned operator" },
      { sym: "$\\kappa$", desc: "the condition number" },
      { sym: "“applying $M^{-1}$”", desc: "solving $Mz=v$, not explicitly forming an inverse" }
    ],
    derivation: [
      { do: "Start with $Ax=b$.", result: "Start with $Ax=b$.", why: "" },
      { do: "Choose an invertible matrix $M$ that approximates $A$ but is easier to solve with.", result: "easier to solve with.", why: "" },
      { do: "Multiply both sides by $M^{-1}$ to get $M^{-1}Ax=M^{-1}b$.", result: "$M^{-1}Ax=M^{-1}b$.", why: "" },
      { do: "The solution $x$ is unchanged", result: "unchanged", why: "multiplying by an invertible matrix preserves equality." },
      { do: "Iterative convergence depends on the spectrum of the operator; the new operator is $M^{-1}A$.", result: "$M^{-1}A$.", why: "" },
      { do: "If $M^{-1}A$ has a smaller condition number or clustered eigenvalues, fewer Krylov iterations are needed.", result: "If $M^{-1}A$ has a smaller condition number or clustered eigenvalues, fewer Krylov iterations are needed.", why: "" }
    ],
    applications: [
      { title: "Perfect diagonal case", background: "for $A=\\operatorname{diag}(100,1)$ and $M=A$, $M^{-1}A=I$, so $\\kappa$ drops from $100$ to $1$.", numbers: "for $A=\\operatorname{diag}(100,1)$ and $M=A$, $M^{-1}A=I$, so $\\kappa$ drops from $100$ to $1$." },
      { title: "Jacobi preconditioner", background: "for $A=\\begin{bmatrix}4&1\\1&3\\end{bmatrix}$, symmetric diagonal scaling has eigenvalues about $0.7113$ and $1.2887$, so $\\kappa\\approx1.812$.", numbers: "for $A=\\begin{bmatrix}4&1\\1&3\\end{bmatrix}$, symmetric diagonal scaling has eigenvalues about $0.7113$ and $1.2887$, so $\\kappa\\approx1.812$." },
      { title: "CG acceleration", background: "lowering $\\kappa$ from $100$ to $4$ changes the CG convergence factor from $(10-1)/(10+1)=0.818$ to $(2-1)/(2+1)=0.333$.", numbers: "lowering $\\kappa$ from $100$ to $4$ changes the CG convergence factor from $(10-1)/(10+1)=0.818$ to $(2-1)/(2+1)=0.333$." },
      { title: "Feature scaling analogy", background: "standardizing a feature from variance $100$ to variance $1$ is diagonal preconditioning for gradient methods.", numbers: "standardizing a feature from variance $100$ to variance $1$ is diagonal preconditioning for gradient methods." },
      { title: "Incomplete factorization budget", background: "if an ILU apply costs $5$ sparse matvecs but cuts iterations from $200$ to $30$, the effective cost drops from $200$ to about $150$ matvec equivalents.", numbers: "if an ILU apply costs $5$ sparse matvecs but cuts iterations from $200$ to $30$, the effective cost drops from $200$ to about $150$ matvec equivalents." },
      { title: "Solver design check", background: "a preconditioner that takes $20$ ms and saves only one $5$ ms iteration is a net loss for that solve.", numbers: "a preconditioner that takes $20$ ms and saves only one $5$ ms iteration is a net loss for that solve." }
    ]
  },
  "math-27-08": {
    connectionsProse:
      "<p>This lesson returns to eigenvalues and eigenvectors from linear algebra, now with a computational question in mind. Instead of diagonalizing a whole matrix, power iteration asks for the dominant direction using only repeated matrix-vector multiplication. That makes it useful when a matrix is large but multiplying by it is still feasible. The same idea supports PCA approximations, PageRank-style stationary distributions, spectral normalization, and several randomized algorithms. It also prepares the reader for QR and Lanczos, which compute spectral information in more refined ways.</p>",
    motivation:
      "<p>Power iteration finds the dominant eigenvector by repeatedly multiplying by a matrix. If the starting vector has any component in the dominant eigenvector direction, each multiplication scales that component by the largest eigenvalue. Components in other eigendirections are scaled by smaller eigenvalues in magnitude.</p>" +
      "<p>After several multiplications, the relative contribution of the non-dominant components shrinks according to ratios such as $|\\lambda_2/\\lambda_1|^k$. Normalization keeps the vector from overflowing or underflowing while preserving the direction. The method is simple, but its speed depends on the spectral gap: close eigenvalues produce slow separation.</p>",
    definition:
      "<p><b>Power iteration</b> repeatedly multiplies by a matrix so the dominant eigenvector component separates from the others: $$A^kv_0=\\lambda_1^k(c_1q_1+c_2(\\lambda_2/\\lambda_1)^kq_2+\\cdots).$$</p>" +
      "<p><b>Assumptions that matter:</b> the starting vector has a nonzero dominant component and $|\\lambda_1|>|\\lambda_2|\\ge\\cdots$.</p>",
    symbols: [
      { sym: "$\\lambda_i$", desc: "eigenvalues" },
      { sym: "$q_i$", desc: "eigenvectors" },
      { sym: "$c_i$", desc: "starting-vector components" },
      { sym: "$|\\lambda_2/\\lambda_1|$", desc: "the convergence ratio" }
    ],
    derivation: [
      { do: "Write the starting vector as $v_0=c_1q_1+c_2q_2+\\cdots$", result: "Write the starting vector as $v_0=c_1q_1+c_2q_2+\\cdots$", why: "the eigenvectors form a basis for the example setting." },
      { do: "Multiply once: $Av_0=c_1\\lambda_1q_1+c_2\\lambda_2q_2+\\cdots$.", result: "$Av_0=c_1\\lambda_1q_1+c_2\\lambda_2q_2+\\cdots$.", why: "" },
      { do: "After $k$ multiplications, $A^kv_0=c_1\\lambda_1^kq_1+c_2\\lambda_2^kq_2+\\cdots$.", result: "After $k$ multiplications, $A^kv_0=c_1\\lambda_1^kq_1+c_2\\lambda_2^kq_2+\\cdots$.", why: "" },
      { do: "Factor out $\\lambda_1^k$: $A^kv_0=\\lambda_1^k(c_1q_1+c_2(\\lambda_2/\\lambda_1)^kq_2+\\cdots)$.", result: "$A^kv_0=\\lambda_1^k(c_1q_1+c_2(\\lambda_2/\\lambda_1)^kq_2+\\cdots)$.", why: "" },
      { do: "The non-dominant ratios shrink like $|\\lambda_i/\\lambda_1|^k$.", result: "The non-dominant ratios shrink like $|\\lambda_i/\\lambda_1|^k$.", why: "" },
      { do: "Normalizing each step prevents overflow while keeping the direction.", result: "Normalizing each step prevents overflow while keeping the direction.", why: "" }
    ],
    applications: [
      { title: "Dominant direction", background: "for $A=\\operatorname{diag}(3,1)$ and $v_0=(1,1)$, after $5$ powers the component ratio is $(1/3)^5\\approx0.004115$.", numbers: "for $A=\\operatorname{diag}(3,1)$ and $v_0=(1,1)$, after $5$ powers the component ratio is $(1/3)^5\\approx0.004115$." },
      { title: "Rayleigh quotient", background: "the normalized fifth iterate gives eigenvalue estimate $2.99997$.", numbers: "the normalized fifth iterate gives eigenvalue estimate $2.99997$." },
      { title: "Iteration count", background: "to make the ratio below $10^{-3}$ when $|\\lambda_2/\\lambda_1|=1/3$, need $7$ iterations.", numbers: "to make the ratio below $10^{-3}$ when $|\\lambda_2/\\lambda_1|=1/3$, need $7$ iterations." },
      { title: "PCA warmup", background: "if singular values are $10$ and $8$, the power ratio is $0.8$ and convergence is much slower.", numbers: "if singular values are $10$ and $8$, the power ratio is $0.8$ and convergence is much slower." },
      { title: "PageRank-style stationary vector", background: "repeated transition-matrix multiplication is power iteration on an eigenvalue-$1$ operator.", numbers: "repeated transition-matrix multiplication is power iteration on an eigenvalue-$1$ operator." },
      { title: "Spectral normalization", background: "estimating the top singular value by power iteration lets a layer rescale weights using one or two matrix multiplies per training step.", numbers: "estimating the top singular value by power iteration lets a layer rescale weights using one or two matrix multiplies per training step." }
    ]
  },
  "math-27-09": {
    connectionsProse:
      "<p>This lesson builds on orthogonal matrices, triangular factors, and eigenvalue preservation under similarity transforms. Earlier lessons treated QR factorization as a stable way to decompose a matrix. The QR algorithm uses that factorization repeatedly to reveal eigenvalues. The method sits between elementary eigenvalue theory and production eigensolvers. It explains why orthogonal transformations are so valuable in numerical linear algebra: they change the representation of a matrix while preserving its spectrum and controlling numerical growth.</p>",
    motivation:
      "<p>The QR algorithm computes eigenvalues by repeatedly factoring a matrix into an orthogonal part and an upper-triangular part, then reversing the factors. The reversed product is not the same matrix, but it is orthogonally similar to the original matrix at that step. Similarity keeps the eigenvalues unchanged.</p>" +
      "<p>For symmetric matrices, the repeated process tends to move the matrix toward diagonal form under favorable conditions. As the off-diagonal entries shrink, the diagonal entries approach the eigenvalues. Practical eigensolvers add shifts and reductions to make this efficient, but the unshifted step shows the central invariant: the eigenvalues are preserved while the matrix becomes easier to read.</p>",
    definition:
      "<p>The <b>QR algorithm</b> factors $A_k=Q_kR_k$ and reverses the factors to form an orthogonally similar matrix: $$A_{k+1}=R_kQ_k=Q_k^TA_kQ_k.$$</p>" +
      "<p><b>Assumptions that matter:</b> $Q_k$ is orthogonal, similarity preserves eigenvalues, and favorable symmetric cases tend toward diagonal form.</p>",
    symbols: [
      { sym: "$Q_k$", desc: "orthogonal" },
      { sym: "$R_k$", desc: "upper triangular" },
      { sym: "$A_{k+1}$", desc: "similar to $A_k$" },
      { sym: "similarity", desc: "preserves eigenvalues" }
    ],
    derivation: [
      { do: "Factor $A_k=Q_kR_k$ where $Q_k^TQ_k=I$ and $R_k$ is upper triangular.", result: "upper triangular.", why: "" },
      { do: "Define $A_{k+1}=R_kQ_k$ by reversing the factors.", result: "Define $A_{k+1}=R_kQ_k$ by reversing the factors.", why: "" },
      { do: "Substitute $R_k=Q_k^TA_k$ from the factorization.", result: "Substitute $R_k=Q_k^TA_k$ from the factorization.", why: "" },
      { do: "Then $A_{k+1}=Q_k^TA_kQ_k$.", result: "Then $A_{k+1}=Q_k^TA_kQ_k$.", why: "" },
      { do: "This is an orthogonal similarity transform, so $A_{k+1}$ has the same eigenvalues as $A_k$.", result: "$A_{k+1}$ has the same eigenvalues as $A_k$.", why: "" },
      { do: "Repeating the step drives a symmetric matrix toward diagonal form under favorable conditions, leaving eigenvalues on the diagonal.", result: "Repeating the step drives a symmetric matrix toward diagonal form under favorable conditions, leaving eigenvalues on the diagonal.", why: "" }
    ],
    applications: [
      { title: "One QR step", background: "for $A=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$, one step gives approximately $\\begin{bmatrix}2.8&-0.6\\-0.6&1.2\\end{bmatrix}$.", numbers: "for $A=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$, one step gives approximately $\\begin{bmatrix}2.8&-0.6\\-0.6&1.2\\end{bmatrix}$." },
      { title: "Eigenvalue preservation", background: "the original and updated matrices both have eigenvalues $3$ and $1$.", numbers: "the original and updated matrices both have eigenvalues $3$ and $1$." },
      { title: "Off-diagonal shrinkage", background: "after five unshifted steps on that matrix, the off-diagonal magnitude is about $0.00823$.", numbers: "after five unshifted steps on that matrix, the off-diagonal magnitude is about $0.00823$." },
      { title: "Symmetric eigensolver", background: "covariance PCA can use QR after reducing the matrix to tridiagonal form.", numbers: "covariance PCA can use QR after reducing the matrix to tridiagonal form." },
      { title: "Convergence diagnosis", background: "when the subdiagonal falls below $10^{-10}$, the lower block can be deflated.", numbers: "when the subdiagonal falls below $10^{-10}$, the lower block can be deflated." },
      { title: "Small Hessian analysis", background: "a $2\\times2$ Hessian with eigenvalues $3$ and $1$ has condition number $3$.", numbers: "a $2\\times2$ Hessian with eigenvalues $3$ and $1$ has condition number $3$." }
    ]
  },
  "math-27-10": {
    connectionsProse:
      "<p>This lesson follows power iteration and QR by focusing on spectral information for large symmetric matrices. A full eigendecomposition may be impossible when the matrix has millions of rows, but matrix-vector products may still be affordable. Lanczos uses those products to build a much smaller matrix that captures important eigenvalue information. The method also connects Krylov subspaces with optimization diagnostics and graph computations. It is one reason large systems can estimate top curvature, embedding spectra, or kernel behavior without ever forming all dense matrix entries.</p>",
    motivation:
      "<p>Lanczos is a Krylov method specialized to symmetric matrices. Starting from one unit vector, it repeatedly applies $A$ and removes components in directions already represented. Symmetry makes the recurrence short: each new vector only needs nearby correction terms, producing a tridiagonal projected matrix.</p>" +
      "<p>The small tridiagonal matrix is useful because its eigenvalues approximate eigenvalues of the original large matrix. This is a controlled compression of spectral information. The large matrix is still present through matrix-vector products, but the expensive eigenvalue calculation happens on the small matrix $T_k$.</p>",
    definition:
      "<p><b>Lanczos iteration</b> builds an orthonormal Krylov basis for a symmetric matrix and represents the large operator by a small tridiagonal projection: $$AQ_k=Q_kT_k+\\beta_kq_{k+1}e_k^T.$$</p>" +
      "<p><b>Assumptions that matter:</b> $A$ is symmetric, the Lanczos vectors are orthonormal, and the recurrence produces diagonal coefficients $\\alpha_i$ and off-diagonal coefficients $\\beta_i$.</p>",
    symbols: [
      { sym: "$q_i$", desc: "orthonormal Lanczos vectors" },
      { sym: "$\\alpha_i$", desc: "diagonal entries of $T_k$" },
      { sym: "$\\beta_i$", desc: "off-diagonal entries" },
      { sym: "$T_k$", desc: "the small tridiagonal projection of $A$" }
    ],
    derivation: [
      { do: "Start with a unit vector $q_1$.", result: "Start with a unit vector $q_1$.", why: "" },
      { do: "Compute $w=Aq_1$", result: "Compute $w=Aq_1$", why: "the Krylov space begins by applying $A$." },
      { do: "Set $\\alpha_1=q_1^Tw$ to capture the component of $w$ along $q_1$.", result: "Set $\\alpha_1=q_1^Tw$ to capture the component of $w$ along $q_1$.", why: "" },
      { do: "Subtract it: $w\\leftarrow w-\\alpha_1q_1$ so the remaining vector is orthogonal to $q_1$.", result: "$w\\leftarrow w-\\alpha_1q_1$ so the remaining vector is orthogonal to $q_1$.", why: "" },
      { do: "Set $\\beta_1=\\|w\\|$ and $q_2=w/\\beta_1$ if $\\beta_1\\ne0$.", result: "Set $\\beta_1=\\|w\\|$ and $q_2=w/\\beta_1$ if $\\beta_1\\ne0$.", why: "" },
      { do: "Repeating this process gives $AQ_k=Q_kT_k+\\beta_kq_{k+1}e_k^T$, where $T_k$ is tridiagonal.", result: "$AQ_k=Q_kT_k+\\beta_kq_{k+1}e_k^T$, where $T_k$ is tridiagonal.", why: "" }
    ],
    applications: [
      { title: "First step", background: "for $A=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$ and $q_1=(1,0)$, $\\alpha_1=2$, $w=(0,1)$, and $\\beta_1=1$.", numbers: "for $A=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$ and $q_1=(1,0)$, $\\alpha_1=2$, $w=(0,1)$, and $\\beta_1=1$." },
      { title: "Second basis vector", background: "the same step gives $q_2=(0,1)$.", numbers: "the same step gives $q_2=(0,1)$." },
      { title: "Projected matrix", background: "after two steps, $T=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$ with eigenvalues $1$ and $3$.", numbers: "after two steps, $T=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$ with eigenvalues $1$ and $3$." },
      { title: "Top Hessian eigenvalue", background: "Lanczos can estimate curvature using Hessian-vector products without forming a dense Hessian.", numbers: "Lanczos can estimate curvature using Hessian-vector products without forming a dense Hessian." },
      { title: "Embedding spectra", background: "a sparse graph Laplacian with $10^6$ nodes can be probed with $50$ Lanczos vectors instead of a full eigendecomposition.", numbers: "a sparse graph Laplacian with $10^6$ nodes can be probed with $50$ Lanczos vectors instead of a full eigendecomposition." },
      { title: "Memory budget", background: "storing $50$ FP32 vectors of length $10^6$ costs $50\\cdot10^6\\cdot4=200$ MB.", numbers: "storing $50$ FP32 vectors of length $10^6$ costs $50\\cdot10^6\\cdot4=200$ MB." }
    ]
  },
  "math-27-11": {
    connectionsProse:
      "<p>This lesson builds on matrices and matrix-vector multiplication, but changes the storage model. A dense matrix records every possible entry, including zeros. Many scientific and graph problems have matrices where most entries are zero, so dense storage wastes both memory and arithmetic. Sparse matrices connect directly to CG, GMRES, Lanczos, PDE grids, and graph machine learning. In all of those settings, the core operation is often not forming a matrix inverse, but multiplying a sparse matrix by a vector many times.</p>",
    motivation:
      "<p>Sparse matrices store only the nonzero entries. This is not just a memory trick. It changes which algorithms are practical because matrix-vector products scale with the number of nonzeros rather than the number of possible entries.</p>" +
      "<p>The storage format must match the operation. Compressed sparse row storage is organized row by row because a matrix-vector product computes one output row at a time. Each nonzero contributes one multiplication with the matching entry of $x$ and one addition into the row sum. The savings become large when the number of nonzeros is tiny compared with the dense matrix size.</p>",
    definition:
      "<p>A <b>sparse matrix</b> stores only nonzero entries. In compressed sparse row form, row $i$ uses the slice from `row_ptr[i]` to `row_ptr[i+1]` to compute $$(Ax)_i=\\sum_k \\text{values}[k]x_{\\text{col\\_idx}[k]}.$$</p>" +
      "<p><b>Assumptions that matter:</b> CSR is organized row by row, each nonzero contributes one multiply and one add, and work scales with $\\operatorname{nnz}$ rather than dense size.</p>",
    symbols: [
      { sym: "$\\operatorname{nnz}$", desc: "the number of nonzero entries" },
      { sym: "CSR", desc: "compressed sparse row" },
      { sym: "`row_ptr`, `col_idx`, and `values`", desc: "the three arrays" },
      { sym: "$Ax$", desc: "a sparse matrix-vector product" }
    ],
    derivation: [
      { do: "Scan row by row", result: "Scan row by row", why: "matrix-vector multiplication also consumes rows." },
      { do: "Store each nonzero value in `values`.", result: "Store each nonzero value in `values`.", why: "" },
      { do: "Store its column index in `col_idx` so the matching entry of $x$ can be found.", result: "the matching entry of $x$ can be found.", why: "" },
      { do: "Store row start positions in `row_ptr` so row $i$ is the slice from `row_ptr[i]` to `row_ptr[i+1]`.", result: "row $i$ is the slice from `row_ptr[i]` to `row_ptr[i+1]`.", why: "" },
      { do: "Compute $(Ax)_i$ by summing `values[k] * x[col_idx[k]]` over that slice.", result: "Compute $(Ax)_i$ by summing `values[k] * x[col_idx[k]]` over that slice.", why: "" },
      { do: "The work is about $2\\operatorname{nnz}$ floating-point operations", result: "about $2\\operatorname{nnz}$ floating-point operations", why: "each nonzero contributes one multiply and one add." }
    ],
    applications: [
      { title: "CSR example", background: "for $A=\\begin{bmatrix}0&5&0&0\\2&0&0&3\\0&0&4&0\\end{bmatrix}$ and $x=(1,2,3,4)$, $Ax=(10,14,12)$.", numbers: "for $A=\\begin{bmatrix}0&5&0&0\\2&0&0&3\\0&0&4&0\\end{bmatrix}$ and $x=(1,2,3,4)$, $Ax=(10,14,12)$." },
      { title: "Storage comparison", background: "that $3\\times4$ example has $12$ dense entries and $4$ nonzeros; CSR also needs row pointers, so tiny matrices may not save space.", numbers: "that $3\\times4$ example has $12$ dense entries and $4$ nonzeros; CSR also needs row pointers, so tiny matrices may not save space." },
      { title: "Large sparse win", background: "a $10{,}000\\times10{,}000$ matrix at $0.1\\%$ density has $100{,}000$ nonzeros instead of $100{,}000{,}000$ dense entries.", numbers: "a $10{,}000\\times10{,}000$ matrix at $0.1\\%$ density has $100{,}000$ nonzeros instead of $100{,}000{,}000$ dense entries." },
      { title: "CSR array count", background: "that large matrix uses about $2\\cdot100{,}000+10{,}001=210{,}001$ stored numbers/indices.", numbers: "that large matrix uses about $2\\cdot100{,}000+10{,}001=210{,}001$ stored numbers/indices." },
      { title: "Sparse matvec flops", background: "$100{,}000$ nonzeros cost about $200{,}000$ multiply-add operations.", numbers: "$100{,}000$ nonzeros cost about $200{,}000$ multiply-add operations." },
      { title: "Graph ML", background: "a graph with $1{,}000{,}000$ edges stores about $2{,}000{,}000$ adjacency nonzeros when edges are symmetrized.", numbers: "a graph with $1{,}000{,}000$ edges stores about $2{,}000{,}000$ adjacency nonzeros when edges are symmetrized." }
    ]
  },
  "math-27-12": {
    connectionsProse:
      "<p>This lesson builds on gradients, Taylor approximation, and the optimization ideas used throughout machine learning. Earlier calculus lessons explain why a gradient points toward local increase. Numerical optimization asks how to turn that local information into a stable sequence of computed steps. The lesson also prepares the reader for automatic differentiation and training stability. Gradients are only useful when the surrounding workflow chooses step sizes, scales updates, checks progress, and stops at a level of precision the computation can justify.</p>",
    motivation:
      "<p>Numerical optimization is the engineering layer around gradients: choose a step, scale it, test whether it helped, and stop when further work is not justified. The mathematics is local because a gradient describes the function near the current point. A step that is sensible locally can still fail if it is too large or if the function curves sharply.</p>" +
      "<p>That is why optimization practice includes line searches, learning-rate schedules, clipping, validation checks, and stopping criteria. These tools do not replace the gradient; they make the gradient usable in finite-precision computation. The goal is to make steady progress without interpreting noise, roundoff, or validation fluctuation as meaningful improvement.</p>",
    definition:
      "<p><b>Numerical optimization</b> turns local gradient information into stable computed steps. A steepest-descent step uses $$f(x-\\alpha g)\\approx f(x)-\\alpha g^Tg.$$</p>" +
      "<p><b>Assumptions that matter:</b> $g=\\nabla f(x)$, small positive $\\alpha$ predicts decrease, and line searches or schedules control steps when the first-order approximation is unreliable.</p>",
    symbols: [
      { sym: "$g$", desc: "the gradient" },
      { sym: "$s$", desc: "the proposed step" },
      { sym: "$\\alpha$", desc: "the learning rate or step size" },
      { sym: "$\\|g\\|$", desc: "first-order stationarity" },
      { sym: "a line search", desc: "tests actual decrease" }
    ],
    derivation: [
      { do: "Use the first-order Taylor approximation $f(x+s)\\approx f(x)+\\nabla f(x)^Ts$.", result: "Use the first-order Taylor approximation $f(x+s)\\approx f(x)+\\nabla f(x)^Ts$.", why: "" },
      { do: "Choose steepest-descent step $s=-\\alpha g$ with $g=\\nabla f(x)$.", result: "Choose steepest-descent step $s=-\\alpha g$ with $g=\\nabla f(x)$.", why: "" },
      { do: "Substitute to get $f(x-\\alpha g)\\approx f(x)-\\alpha g^Tg$.", result: "$f(x-\\alpha g)\\approx f(x)-\\alpha g^Tg$.", why: "" },
      { do: "Since $g^Tg=\\|g\\|^2\\ge0$, small positive $\\alpha$ predicts a decrease.", result: "Since $g^Tg=\\|g\\|^2\\ge0$, small positive $\\alpha$ predicts a decrease.", why: "" },
      { do: "A line search or schedule controls $\\alpha$", result: "A line search or schedule controls $\\alpha$", why: "the first-order approximation can fail for large steps." },
      { do: "Stopping criteria compare gradient norm, step size, validation change, and numerical tolerance.", result: "Stopping criteria compare gradient norm, step size, validation change, and numerical tolerance.", why: "" }
    ],
    applications: [
      { title: "Quadratic step", background: "for $f(x)=(x-3)^2$, $x_0=0$, and $\\alpha=0.1$, the update is $x_1=0.6$ and $f(x_1)=5.76$.", numbers: "for $f(x)=(x-3)^2$, $x_0=0$, and $\\alpha=0.1$, the update is $x_1=0.6$ and $f(x_1)=5.76$." },
      { title: "Gradient clipping", background: "clipping $g=(3,4)$ to norm $2$ returns $(1.2,1.6)$.", numbers: "clipping $g=(3,4)$ to norm $2$ returns $(1.2,1.6)$." },
      { title: "Loss decrease check", background: "for the Part 02 quadratic at $(1,2)$, step $0.1(4,9)$ gives new value $2.78$, down from $11$.", numbers: "for the Part 02 quadratic at $(1,2)$, step $0.1(4,9)$ gives new value $2.78$, down from $11$." },
      { title: "Learning-rate sweep", background: "testing $5$ learning rates across $3$ seeds gives $15$ training runs.", numbers: "testing $5$ learning rates across $3$ seeds gives $15$ training runs." },
      { title: "Stopping by gradient norm", background: "if $\\|g\\|=8\\times10^{-4}$ and tolerance is $10^{-3}$, the first-order stopping test passes.", numbers: "if $\\|g\\|=8\\times10^{-4}$ and tolerance is $10^{-3}$, the first-order stopping test passes." },
      { title: "Weight decay update", background: "with gradient $0.6$, weight $2$, decay $0.01$, and step $0.1$, the update uses $0.6+0.02=0.62$ and moves the weight by $0.062$.", numbers: "with gradient $0.6$, weight $2$, decay $0.01$, and step $0.1$, the update uses $0.6+0.02=0.62$ and moves the weight by $0.062$." }
    ]
  },
  "math-27-13": {
    connectionsProse:
      "<p>This lesson builds on the chain rule and on the idea of a computation as a sequence of intermediate values. In earlier calculus lessons, derivatives were usually taken from a formula written on one line. In real machine-learning code, the loss is produced by a program: matrix multiplications, nonlinearities, reshapes, normalizations, and reductions all happen before the final scalar appears. Automatic differentiation is the bridge between those two views. It applies the chain rule to the actual operations the program executed. That makes it different from finite differences, which estimate a slope by rerunning the program, and different from symbolic algebra, which tries to rewrite a formula. Reverse-mode automatic differentiation is the engine behind backpropagation, so this lesson is the numerical-methods version of how gradients are computed in modern training systems.</p>",
    motivation:
      "<p>A derivative through a long computation is difficult because every intermediate value can affect later values. The safe way to handle that dependency is to name the intermediate values and keep local derivative rules for each operation. If $u=3x$, then the local rule is $du/dx=3$. If $v=u^2$, then the local rule is $dv/du=2u$. The whole derivative is built by chaining these local rules together.</p>" +
      "<p>Reverse mode starts from a scalar output, usually a loss, and walks backward. It attaches to each intermediate value an adjoint, written $\\bar v$, meaning “how much the final loss changes when this value changes.” When one value feeds several later operations, reverse mode adds all contributions into the same adjoint. That accumulation is the practical heart of backpropagation: every parameter receives the total effect of all paths by which it influences the loss.</p>" +
      "<p>The important point is that automatic differentiation computes derivatives of the executed numerical program. It does not remove floating-point roundoff, and it still needs conventions at nondifferentiable points, but it gives exact chain-rule derivatives for the operations that were actually run.</p>",
    definition:
      "<p><b>Reverse-mode automatic differentiation</b> walks backward through an executed computation and accumulates adjoints using $$\\bar u \\mathrel{+}= \\bar v\\,{\\partial v \\over \\partial u}.$$</p>" +
      "<p><b>Assumptions that matter:</b> intermediate values from the forward pass are available, the output is scalar, and contributions from multiple downstream paths add into the same adjoint.</p>",
    symbols: [
      { sym: "$x$", desc: "the input" },
      { sym: "$u,v$", desc: "intermediate values stored from the forward pass" },
      { sym: "$L$", desc: "the scalar loss" },
      { sym: "$\\bar v=\\partial L/\\partial v$", desc: "the adjoint of $v$" },
      { sym: "$\\mathrel{+}=$", desc: "“accumulate into the existing adjoint,” which matters when several paths meet" }
    ],
    derivation: [
      { do: "Forward pass: $u=3\\cdot2=6$", result: "$u=3\\cdot2=6$", why: "$u$ is three times the input." },
      { do: "Forward pass: $v=6^2=36$", result: "$v=6^2=36$", why: "$v$ squares the intermediate $u$." },
      { do: "Forward pass: $L=36+5\\cdot6=66$", result: "$L=36+5\\cdot6=66$", why: "the loss adds $v$ and $5u$." },
      { do: "Seed the backward pass with $\\bar L=1$", result: "Seed the backward pass with $\\bar L=1$", why: "$\\partial L/\\partial L=1$." },
      { do: "From $L=v+5u$, add $\\bar v=1$", result: "From $L=v+5u$, add $\\bar v=1$", why: "$\\partial L/\\partial v=1$." },
      { do: "From the same line, add $5$ to $\\bar u$", result: "From the same line, add $5$ to $\\bar u$", why: "$\\partial L/\\partial u=5$ through the direct $5u$ path." },
      { do: "From $v=u^2$, add $\\bar v(2u)=1\\cdot12=12$ to $\\bar u$", result: "From $v=u^2$, add $\\bar v(2u)=1\\cdot12=12$ to $\\bar u$", why: "the square path also changes the loss." },
      { do: "Combine the two paths: $\\bar u=5+12=17$", result: "$\\bar u=5+12=17$", why: "adjoints add contributions from all downstream uses." },
      { do: "From $u=3x$, compute $\\bar x=\\bar u\\cdot3=17\\cdot3=51$", result: "From $u=3x$, compute $\\bar x=\\bar u\\cdot3=17\\cdot3=51$", why: "$\\partial u/\\partial x=3$." },
      { do: "Therefore $dL/dx=51$.", result: "Therefore $dL/dx=51$.", why: "" }
    ],
    applications: [
      { title: "Backpropagation at scale", background: "reverse-mode AD computes one gradient of a scalar loss with cost on the order of a few forward passes; a model with $10^7$ parameters avoids $10^7$ finite-difference reruns.", numbers: "reverse-mode AD computes one gradient of a scalar loss with cost on the order of a few forward passes; a model with $10^7$ parameters avoids $10^7$ finite-difference reruns." },
      { title: "Worked graph audit", background: "for $x=2,u=3x,v=u^2,L=v+5u$, the adjoint check returns $dL/dx=51$, so a framework trace can be tested against a hand calculation.", numbers: "for $x=2,u=3x,v=u^2,L=v+5u$, the adjoint check returns $dL/dx=51$, so a framework trace can be tested against a hand calculation." },
      { title: "Custom layer backward rule", background: "if a scale layer outputs $y=3x$ and receives incoming adjoint $0.7$, it returns $0.7\\cdot3=2.1$.", numbers: "if a scale layer outputs $y=3x$ and receives incoming adjoint $0.7$, it returns $0.7\\cdot3=2.1$." },
      { title: "Hypergradient contribution", background: "if a validation-loss adjoint through a learning-rate node is $0.8$ and the local derivative is $-0.03$, the contribution is $0.8(-0.03)=-0.024$.", numbers: "if a validation-loss adjoint through a learning-rate node is $0.8$ and the local derivative is $-0.03$, the contribution is $0.8(-0.03)=-0.024$." },
      { title: "Forward-mode sensitivity", background: "for $f(a,b)=ab^2$ at $(3,2)$, local differentiation gives $\\partial f/\\partial a=4$ and $\\partial f/\\partial b=12$.", numbers: "for $f(a,b)=ab^2$ at $(3,2)$, local differentiation gives $\\partial f/\\partial a=4$ and $\\partial f/\\partial b=12$." },
      { title: "HMC log-density gradient", background: "for log density $\\ell(x)=-x^2/2$ at $x=1.5$, AD returns $\\ell'(x)=-1.5$, the number a Hamiltonian Monte Carlo step needs.", numbers: "for log density $\\ell(x)=-x^2/2$ at $x=1.5$, AD returns $\\ell'(x)=-1.5$, the number a Hamiltonian Monte Carlo step needs." }
    ]
  },
  "math-27-14": {
    connectionsProse:
      "<p>This lesson connects differential equations from calculus with the discrete updates used by a computer. An exact solution $y(t)$ describes a continuous trajectory. A numerical solver stores only selected time points and uses the differential equation to move from one point to the next. ODE solvers also connect to simulations, control systems, neural ODEs, and time-dependent physical models. The same questions appear repeatedly: how accurate is each step, how stable is the update, and how many function evaluations are needed.</p>",
    motivation:
      "<p>An ODE solver advances a state through time by replacing an exact trajectory with carefully chosen discrete steps. The derivative $f(t,y)$ tells the local direction of motion. Euler's method uses that local direction as if it stayed constant over a short interval of length $h$.</p>" +
      "<p>The central questions are accuracy, stability, and cost per step. Smaller steps usually reduce approximation error, but they require more steps. Higher-order methods use more information per step to reduce error faster. Stability adds a separate restriction: even a formula that is locally consistent can behave badly if the step size is too large for the dynamics.</p>",
    definition:
      "<p>An <b>ODE solver</b> replaces a continuous trajectory by discrete updates. Forward Euler uses $$y_{n+1}=y_n+hf(t_n,y_n).$$</p>" +
      "<p><b>Assumptions that matter:</b> the exact solution satisfies $y'=f(t,y)$, Taylor's formula justifies the local step, local truncation error is $O(h^2)$, and global error is $O(h)$ on a fixed interval.</p>",
    symbols: [
      { sym: "$y(t)$", desc: "the exact state" },
      { sym: "$y_n$", desc: "the numerical state" },
      { sym: "$h$", desc: "the step size" },
      { sym: "$f$", desc: "the time derivative" },
      { sym: "local error", desc: "one-step error" },
      { sym: "global error", desc: "accumulated error" }
    ],
    derivation: [
      { do: "Start from Taylor's formula $y(t+h)=y(t)+hy'(t)+O(h^2)$.", result: "Start from Taylor's formula $y(t+h)=y(t)+hy'(t)+O(h^2)$.", why: "" },
      { do: "Substitute the ODE $y'(t)=f(t,y(t))$.", result: "Substitute the ODE $y'(t)=f(t,y(t))$.", why: "" },
      { do: "Drop the $O(h^2)$ term to get $y(t+h)\\approx y(t)+hf(t,y(t))$.", result: "$y(t+h)\\approx y(t)+hf(t,y(t))$.", why: "" },
      { do: "Define the numerical update $y_{n+1}=y_n+hf(t_n,y_n)$.", result: "Define the numerical update $y_{n+1}=y_n+hf(t_n,y_n)$.", why: "" },
      { do: "The local truncation error is $O(h^2)$", result: "$O(h^2)$", why: "that is the first omitted term." },
      { do: "Over about $1/h$ steps on a fixed interval, global error is $O(h)$ for Euler.", result: "$O(h)$ for Euler.", why: "" }
    ],
    applications: [
      { title: "Euler decay step", background: "for $y'=-2y$, $y_0=1$, $h=0.1$, Euler gives $0.8$ while exact is $e^{-0.2}\\approx0.81873$, error $0.01873$.", numbers: "for $y'=-2y$, $y_0=1$, $h=0.1$, Euler gives $0.8$ while exact is $e^{-0.2}\\approx0.81873$, error $0.01873$." },
      { title: "RK4 comparison", background: "RK4 on the same step gives about $0.818733$, error $2.58\\times10^{-6}$.", numbers: "RK4 on the same step gives about $0.818733$, error $2.58\\times10^{-6}$." },
      { title: "Order check", background: "halving $h$ should reduce Euler global error by about $2$ and RK4 error by about $16$.", numbers: "halving $h$ should reduce Euler global error by about $2$ and RK4 error by about $16$." },
      { title: "Stability bound", background: "for $y'=-10y$, Euler needs $h<2/10=0.2$ for the linear stability interval.", numbers: "for $y'=-10y$, Euler needs $h<2/10=0.2$ for the linear stability interval." },
      { title: "Neural ODE cost", background: "an adaptive solve using $64$ function evaluations costs about $64$ network evaluations per forward pass.", numbers: "an adaptive solve using $64$ function evaluations costs about $64$ network evaluations per forward pass." },
      { title: "Simulation budget", background: "integrating $10$ seconds with $h=0.01$ uses $1000$ steps.", numbers: "integrating $10$ seconds with $h=0.01$ uses $1000$ steps." }
    ]
  },
  "math-27-15": {
    connectionsProse:
      "<p>This lesson extends the ODE idea from time-dependent states to fields over space and time. A PDE describes how nearby values of a field relate through spatial and temporal derivatives. A computer cannot store a full continuum, so the field must be represented on a grid or mesh. PDE discretization connects Taylor expansions, sparse matrices, stability conditions, and simulation workflows. It also explains why many large scientific systems lead naturally to sparse linear algebra.</p>",
    motivation:
      "<p>PDE solvers turn fields over space and time into values on a grid or mesh. A derivative becomes a stencil: a weighted pattern of neighboring grid values that approximates the local derivative. The centered second derivative is one of the basic examples because adding values on both sides cancels the first-derivative terms.</p>" +
      "<p>The method is only useful if the discretization is consistent with the derivatives and stable under the chosen time step. Refining the grid usually improves spatial accuracy, but it also increases the number of unknowns and can force smaller time steps. A PDE solver is therefore a balance among accuracy, stability, memory, and runtime.</p>",
    definition:
      "<p>A <b>PDE finite-difference solver</b> approximates derivatives with stencils on a grid. The centered second derivative is $$u''(x)\\approx\\{u(x-h)-2u(x)+u(x+h)\\}/h^2.$$</p>" +
      "<p><b>Assumptions that matter:</b> Taylor expansions are valid near $x$, grid spacing is $h$, and stability restrictions may constrain the time step.</p>",
    symbols: [
      { sym: "$u(x)$", desc: "a field" },
      { sym: "$h$ or $\\Delta x$", desc: "grid spacing" },
      { sym: "a stencil", desc: "the weighted pattern of neighboring grid values" },
      { sym: "$\\Delta t$", desc: "the time step" },
      { sym: "$r=\\alpha\\Delta t/\\Delta x^2$", desc: "the heat-equation stability ratio" }
    ],
    derivation: [
      { do: "Expand $u(x+h)=u(x)+hu'(x)+\\tfrac12h^2u''(x)+O(h^3)$.", result: "Expand $u(x+h)=u(x)+hu'(x)+\\tfrac12h^2u''(x)+O(h^3)$.", why: "" },
      { do: "Expand $u(x-h)=u(x)-hu'(x)+\\tfrac12h^2u''(x)+O(h^3)$.", result: "Expand $u(x-h)=u(x)-hu'(x)+\\tfrac12h^2u''(x)+O(h^3)$.", why: "" },
      { do: "Add the expansions so the first-derivative terms cancel.", result: "the first-derivative terms cancel.", why: "" },
      { do: "The sum is $u(x+h)+u(x-h)=2u(x)+h^2u''(x)+O(h^4)$.", result: "$u(x+h)+u(x-h)=2u(x)+h^2u''(x)+O(h^4)$.", why: "" },
      { do: "Rearrange to get $u''(x)\\approx\\{u(x-h)-2u(x)+u(x+h)\\}/h^2$.", result: "$u''(x)\\approx\\{u(x-h)-2u(x)+u(x+h)\\}/h^2$.", why: "" },
      { do: "This stencil is the core of many finite-difference diffusion and Poisson solvers.", result: "the core of many finite-difference diffusion and Poisson solvers.", why: "" }
    ],
    applications: [
      { title: "Second derivative", background: "for values $(1,2,4)$ with $h=0.5$, the stencil gives $(1-4+4)/0.25=4$.", numbers: "for values $(1,2,4)$ with $h=0.5$, the stencil gives $(1-4+4)/0.25=4$." },
      { title: "Heat stability", background: "with $\\alpha=1$ and $\\Delta x=0.1$, explicit heat stepping needs $\\Delta t\\le0.005$.", numbers: "with $\\alpha=1$ and $\\Delta x=0.1$, explicit heat stepping needs $\\Delta t\\le0.005$." },
      { title: "Grid unknowns", background: "a $100\\times100$ image-like grid has $10{,}000$ scalar unknowns per field.", numbers: "a $100\\times100$ image-like grid has $10{,}000$ scalar unknowns per field." },
      { title: "2-D Laplacian cost", background: "the five-point stencil uses about $5$ neighboring coefficients per interior grid point.", numbers: "the five-point stencil uses about $5$ neighboring coefficients per interior grid point." },
      { title: "Physics-informed residual", background: "if $u_t=0.3$ and $0.1u_{xx}=0.25$, the heat residual is $0.05$.", numbers: "if $u_t=0.3$ and $0.1u_{xx}=0.25$, the heat residual is $0.05$." },
      { title: "Mesh refinement", background: "halving $\\Delta x$ in a 2-D grid increases cell count by about $4\\times$.", numbers: "halving $\\Delta x$ in a 2-D grid increases cell count by about $4\\times$." }
    ]
  },
  "math-27-16": {
    connectionsProse:
      "<p>This lesson builds on expectation, variance, and sample averages from probability. Many quantities in scientific computing can be written as integrals or expected values, but exact evaluation may be unavailable. Monte Carlo replaces exact calculation with repeated random sampling. The method connects numerical analysis with uncertainty quantification, simulation, Bayesian computation, and machine-learning evaluation. Its error law is simple and important: the dimension of the problem may be large, but the sampling error still falls only as the square root of the number of samples.</p>",
    motivation:
      "<p>Monte Carlo methods replace an exact integral or expectation with an average of random samples. Each sample is noisy, but the average is stable because independent positive and negative deviations tend to cancel. The estimator is useful when drawing samples is easier than evaluating the target quantity analytically.</p>" +
      "<p>The signature fact is slow but dimension-friendly error: the standard error falls like $1/\\sqrt N$. This means that a tenfold reduction in error requires one hundred times as many samples. The method is therefore easy to parallelize and broadly applicable, but accuracy must be reported with uncertainty rather than as if the random average were exact.</p>",
    definition:
      "<p>A <b>Monte Carlo estimator</b> replaces an exact expectation with a sample average: $$\\hat\\mu=N^{-1}\\sum_{i=1}^N X_i.$$</p>" +
      "<p><b>Assumptions that matter:</b> samples are independent with mean $\\mu$ and variance $\\sigma^2$, so the estimator is unbiased and its standard error is $\\sigma/\\sqrt N$.</p>",
    symbols: [
      { sym: "$X_i$", desc: "random samples" },
      { sym: "$\\mu$", desc: "the target expectation" },
      { sym: "$\\hat\\mu$", desc: "the Monte Carlo estimate" },
      { sym: "$N$", desc: "sample count" },
      { sym: "$\\sigma/\\sqrt N$", desc: "standard error" }
    ],
    derivation: [
      { do: "Define the estimator $\\hat\\mu=N^{-1}\\sum_{i=1}^N X_i$.", result: "Define the estimator $\\hat\\mu=N^{-1}\\sum_{i=1}^N X_i$.", why: "" },
      { do: "Take expectation: $E[\\hat\\mu]=N^{-1}\\sum E[X_i]=\\mu$, so the estimator is unbiased.", result: "$E[\\hat\\mu]=N^{-1}\\sum E[X_i]=\\mu$, so the estimator is unbiased.", why: "" },
      { do: "Use independence: $\\operatorname{Var}(\\sum X_i)=\\sum\\operatorname{Var}(X_i)=N\\sigma^2$.", result: "$\\operatorname{Var}(\\sum X_i)=\\sum\\operatorname{Var}(X_i)=N\\sigma^2$.", why: "" },
      { do: "Scale by $1/N^2$ to get $\\operatorname{Var}(\\hat\\mu)=\\sigma^2/N$.", result: "$\\operatorname{Var}(\\hat\\mu)=\\sigma^2/N$.", why: "" },
      { do: "Take the square root to get standard error $\\sigma/\\sqrt N$.", result: "standard error $\\sigma/\\sqrt N$.", why: "" },
      { do: "Therefore reducing error by $10\\times$ needs $100\\times$ more samples.", result: "Therefore reducing error by $10\\times$ needs $100\\times$ more samples.", why: "" }
    ],
    applications: [
      { title: "Pi estimate uncertainty", background: "with hit probability $\\pi/4$ and $N=10{,}000$, the standard error of $4\\hat p$ is about $0.0164$.", numbers: "with hit probability $\\pi/4$ and $N=10{,}000$, the standard error of $4\\hat p$ is about $0.0164$." },
      { title: "Sample-size planning", background: "if $\\sigma=2$ and desired standard error is $0.01$, need $(2/0.01)^2=40{,}000$ samples.", numbers: "if $\\sigma=2$ and desired standard error is $0.01$, need $(2/0.01)^2=40{,}000$ samples." },
      { title: "Error reduction", background: "increasing samples from $100$ to $10{,}000$ reduces standard error by $10\\times$.", numbers: "increasing samples from $100$ to $10{,}000$ reduces standard error by $10\\times$." },
      { title: "Dropout prediction averaging", background: "averaging $25$ stochastic forward passes cuts standard deviation by $5\\times$.", numbers: "averaging $25$ stochastic forward passes cuts standard deviation by $5\\times$." },
      { title: "Policy evaluation", background: "if return standard deviation is $50$ and $N=2500$, the standard error is $1$.", numbers: "if return standard deviation is $50$ and $N=2500$, the standard error is $1$." },
      { title: "A/B simulation", background: "two independent estimates with standard errors $0.03$ and $0.04$ have difference standard error $\\sqrt{0.03^2+0.04^2}=0.05$.", numbers: "two independent estimates with standard errors $0.03$ and $0.04$ have difference standard error $\\sqrt{0.03^2+0.04^2}=0.05$." }
    ]
  },
  "math-27-17": {
    connectionsProse:
      "<p>This lesson connects linear algebra, probability, and large-scale computation. Earlier lessons computed subspaces using deterministic factorizations or iterations. Randomized numerical linear algebra uses random test directions to discover the part of a large matrix that matters most. The method leads naturally from power iteration and SVD ideas into modern large-data workflows. It is especially useful when the matrix is too large to decompose directly but multiplying it by a block of vectors is affordable.</p>",
    motivation:
      "<p>Randomized linear algebra uses random projections to find the important subspace of a large matrix before doing expensive deterministic work. Random directions are unlikely to miss a dominant low-rank structure completely, especially when a few oversampling directions are included. Multiplying $A$ by those directions produces sample columns that live in the column space of $A$.</p>" +
      "<p>Once those sample columns are orthonormalized, the large matrix can be projected onto their span. The expensive work is then performed on a compressed matrix with only $\\ell$ rows. Power iterations can sharpen the separation when singular values decay slowly, but the main idea remains the same: use randomness to find a good working subspace cheaply.</p>",
    definition:
      "<p><b>Randomized numerical linear algebra</b> uses random test directions to find an approximate range for a large matrix: $$A\\approx QQ^TA.$$</p>" +
      "<p><b>Assumptions that matter:</b> $\\Omega\\in\\mathbb R^{n\\times \\ell}$ is random, $Y=A\\Omega$ samples the column space, and $Q$ is an orthonormal basis for the sampled range.</p>",
    symbols: [
      { sym: "$A$", desc: "the large matrix" },
      { sym: "$\\Omega$", desc: "a random test matrix" },
      { sym: "$\\ell=k+p$", desc: "target rank plus oversampling" },
      { sym: "$Y$", desc: "the sample matrix" },
      { sym: "$Q$", desc: "an orthonormal basis" },
      { sym: "$B$", desc: "the compressed matrix" }
    ],
    derivation: [
      { do: "Draw a random test matrix $\\Omega\\in\\mathbb R^{n\\times \\ell}$", result: "Draw a random test matrix $\\Omega\\in\\mathbb R^{n\\times \\ell}$", why: "random directions usually touch the dominant right-singular subspace." },
      { do: "Form $Y=A\\Omega$ so the columns of $Y$ live in the column space of $A$.", result: "the columns of $Y$ live in the column space of $A$.", why: "" },
      { do: "Orthonormalize $Y$ to get $Q$ with $Q^TQ=I$.", result: "$Q$ with $Q^TQ=I$.", why: "" },
      { do: "Approximate $A$ by projecting onto that range: $A\\approx QQ^TA$.", result: "$A\\approx QQ^TA$.", why: "" },
      { do: "Compress to $B=Q^TA$, which has only $\\ell$ rows.", result: "Compress to $B=Q^TA$, which has only $\\ell$ rows.", why: "" },
      { do: "Compute an SVD of $B$ and lift left singular vectors back with $Q$.", result: "Compute an SVD of $B$ and lift left singular vectors back with $Q$.", why: "" }
    ],
    applications: [
      { title: "Projection example", background: "with $A=\\begin{bmatrix}3&0\\0&1\\0&0\\end{bmatrix}$ and $\\omega=(1,-1)$, $y=A\\omega=(3,-1,0)$.", numbers: "with $A=\\begin{bmatrix}3&0\\0&1\\0&0\\end{bmatrix}$ and $\\omega=(1,-1)$, $y=A\\omega=(3,-1,0)$." },
      { title: "Basis vector", background: "$q=y/\\|y\\|=(0.9487,-0.3162,0)$.", numbers: "$q=y/\\|y\\|=(0.9487,-0.3162,0)$." },
      { title: "Compressed row", background: "$q^TA=(2.8460,-0.3162)$.", numbers: "$q^TA=(2.8460,-0.3162)$." },
      { title: "Projection error", background: "the Frobenius norm drops from $\\sqrt{10}$ to captured norm $2.8636$, leaving residual about $1.3416$.", numbers: "the Frobenius norm drops from $\\sqrt{10}$ to captured norm $2.8636$, leaving residual about $1.3416$." },
      { title: "Power iteration sharpening", background: "if $\\sigma_2/\\sigma_1=0.5$ and $q=1$ power step is used, the unwanted ratio scales like $0.5^3=0.125$.", numbers: "if $\\sigma_2/\\sigma_1=0.5$ and $q=1$ power step is used, the unwanted ratio scales like $0.5^3=0.125$." },
      { title: "Memory budget", background: "storing $\\ell=60$ FP32 sketch vectors of length $10^6$ costs $240$ MB.", numbers: "storing $\\ell=60$ FP32 sketch vectors of length $10^6$ costs $240$ MB." }
    ]
  },
  "math-27-18": {
    connectionsProse:
      "<p>This lesson connects numerical methods with the hardware that executes them. Vectorization showed how to hand many operations to optimized kernels. GPU and parallel computing ask how much speed is actually possible when work is divided across many workers. The lesson also prepares the reader to interpret performance claims in machine learning systems. Arithmetic throughput, memory bandwidth, communication, kernel launches, and serial fractions all affect the observed runtime.</p>",
    motivation:
      "<p>Parallel computing makes a numerical method fast only when enough work can run at the same time and data movement does not dominate. Some operations, such as large matrix multiplication, contain enough repeated arithmetic to use many GPU cores efficiently. Other operations move so much data relative to their arithmetic that memory bandwidth sets the limit.</p>" +
      "<p>The useful speedup calculation always includes serial work, memory bandwidth, and communication. Amdahl's law gives the simplest warning: even a small serial fraction can cap the benefit of adding more workers. In distributed training, communication can become the new bottleneck after computation is parallelized.</p>",
    definition:
      "<p><b>Amdahl's law</b> estimates the speedup from parallel computing when only a fraction of work can be parallelized: $$S_N=1/((1-p)+p/N).$$</p>" +
      "<p><b>Assumptions that matter:</b> $p$ is perfectly parallelizable, $1-p$ remains serial, and ideal scaling ignores bandwidth and communication costs unless they are added separately.</p>",
    symbols: [
      { sym: "$p$", desc: "the parallel fraction" },
      { sym: "$N$", desc: "number of workers" },
      { sym: "$S_N$", desc: "speedup" },
      { sym: "bandwidth", desc: "bytes per second" },
      { sym: "FLOP/s", desc: "arithmetic throughput" }
    ],
    derivation: [
      { do: "Normalize single-worker runtime to $1$.", result: "Normalize single-worker runtime to $1$.", why: "" },
      { do: "Let fraction $p$ be perfectly parallelizable and fraction $1-p$ be serial.", result: "Let fraction $p$ be perfectly parallelizable and fraction $1-p$ be serial.", why: "" },
      { do: "On $N$ workers, the serial part still costs $1-p$.", result: "On $N$ workers, the serial part still costs $1-p$.", why: "" },
      { do: "The parallel part costs $p/N$ under ideal scaling.", result: "The parallel part costs $p/N$ under ideal scaling.", why: "" },
      { do: "Total time is $(1-p)+p/N$.", result: "$(1-p)+p/N$.", why: "" },
      { do: "Speedup is the reciprocal: $S_N=1/((1-p)+p/N)$.", result: "$S_N=1/((1-p)+p/N)$.", why: "" }
    ],
    applications: [
      { title: "Amdahl limit", background: "with $p=0.95$ and $N=100$, speedup is $1/(0.05+0.95/100)\\approx16.81$, not $100$.", numbers: "with $p=0.95$ and $N=100$, speedup is $1/(0.05+0.95/100)\\approx16.81$, not $100$." },
      { title: "Matrix multiply ideal time", background: "a $1024^3$ GEMM needs about $2.147\\times10^9$ flops, so at $10$ TFLOP/s the ideal compute time is $0.215$ ms.", numbers: "a $1024^3$ GEMM needs about $2.147\\times10^9$ flops, so at $10$ TFLOP/s the ideal compute time is $0.215$ ms." },
      { title: "All-reduce cost", background: "communicating $100$ MB over $25$ GB/s takes about $4$ ms before latency.", numbers: "communicating $100$ MB over $25$ GB/s takes about $4$ ms before latency." },
      { title: "Memory-bound vector add", background: "reading and writing $1.2$ GB at $900$ GB/s takes about $1.33$ ms, often larger than arithmetic time.", numbers: "reading and writing $1.2$ GB at $900$ GB/s takes about $1.33$ ms, often larger than arithmetic time." },
      { title: "Batch scaling", background: "doubling batch size from $512$ to $1024$ doubles data-parallel examples per step if memory fits.", numbers: "doubling batch size from $512$ to $1024$ doubles data-parallel examples per step if memory fits." },
      { title: "Kernel launch overhead", background: "fusing ten $20\\,\\mu$s elementwise kernels can save roughly $9$ launches, or about $180\\,\\mu$s, before arithmetic changes.", numbers: "fusing ten $20\\,\\mu$s elementwise kernels can save roughly $9$ launches, or about $180\\,\\mu$s, before arithmetic changes." }
    ]
  },
  "math-27-19": {
    connectionsProse:
      "<p>This lesson brings together floating-point error, vectorized hardware, automatic differentiation, and optimization practice. Modern training systems often use low-precision formats because they are faster and use less memory. The numerical question is how to gain that speed without losing the small updates and accumulated sums that make training stable. Mixed precision is the capstone for the section because it is both mathematical and systems-oriented. It depends on unit roundoff, representable ranges, gradient scaling, optimizer state, and hardware throughput all at once.</p>",
    motivation:
      "<p>Mixed-precision training uses low-precision arithmetic for speed while keeping selected accumulations and master weights in higher precision for stability. Low precision can be safe for many matrix multiplications because the operations are regular and hardware support is strong. It can be unsafe for tiny gradients, long accumulations, or small parameter updates near values where the format has coarse spacing.</p>" +
      "<p>The capstone idea is controlled compromise: use faster formats where their error is safe, and protect the parts of training that are numerically fragile. Loss scaling protects small gradients from underflow by temporarily enlarging them during backpropagation. FP32 accumulators or master weights protect repeated small updates from being rounded away.</p>",
    definition:
      "<p><b>Mixed-precision training</b> uses low precision where it is fast while protecting fragile quantities with scaling and higher-precision state. Loss scaling uses $$Sg\\mapsto g\\quad\\text{after dividing by }S.$$</p>" +
      "<p><b>Assumptions that matter:</b> differentiation is linear in the loss scale, scaled gradients must avoid FP16 overflow, and accumulators or master weights stay in FP32.</p>",
    symbols: [
      { sym: "$g$", desc: "a gradient" },
      { sym: "$S$", desc: "the loss scale" },
      { sym: "FP16 maximum finite value", desc: "about $65504$" },
      { sym: "unit roundoff", desc: "about $2^{-11}$ for FP16 and $2^{-24}$ for FP32" },
      { sym: "an accumulator", desc: "the variable that stores sums or optimizer state" }
    ],
    derivation: [
      { do: "Let $g$ be a small gradient that may underflow in low precision.", result: "Let $g$ be a small gradient that may underflow in low precision.", why: "" },
      { do: "Multiply the loss by a scale $S$, so backpropagation produces scaled gradient $Sg$ by linearity of differentiation.", result: "backpropagation produces scaled gradient $Sg$ by linearity of differentiation.", why: "" },
      { do: "Choose $S$ so $Sg$ lies in the representable FP16 range.", result: "$Sg$ lies in the representable FP16 range.", why: "" },
      { do: "Before applying the optimizer update, divide the gradient by $S$ to recover $g$.", result: "Before applying the optimizer update, divide the gradient by $S$ to recover $g$.", why: "" },
      { do: "If the largest scaled gradient would exceed the FP16 maximum, reduce $S$ to avoid overflow.", result: "If the largest scaled gradient would exceed the FP16 maximum, reduce $S$ to avoid overflow.", why: "" },
      { do: "Keep accumulators or master weights in FP32 so repeated small updates are not rounded away.", result: "repeated small updates are not rounded away.", why: "" }
    ],
    applications: [
      { title: "Loss scaling", background: "a gradient $g=2\\times10^{-8}$ scaled by $S=4096$ becomes $8.192\\times10^{-5}$, then unscales back to $2\\times10^{-8}$.", numbers: "a gradient $g=2\\times10^{-8}$ scaled by $S=4096$ becomes $8.192\\times10^{-5}$, then unscales back to $2\\times10^{-8}$." },
      { title: "Overflow guard", background: "if the largest gradient magnitude is $20$, the scale must satisfy $S\\le65504/20\\approx3275.2$.", numbers: "if the largest gradient magnitude is $20$, the scale must satisfy $S\\le65504/20\\approx3275.2$." },
      { title: "Accumulation error", background: "summing $1024$ products has FP16 bound $\\gamma_{1024}\\approx1.0$, while FP32 gives $\\gamma_{1024}\\approx6.10\\times10^{-5}$.", numbers: "summing $1024$ products has FP16 bound $\\gamma_{1024}\\approx1.0$, while FP32 gives $\\gamma_{1024}\\approx6.10\\times10^{-5}$." },
      { title: "Throughput tradeoff", background: "a step that falls from $80$ ms in FP32 to $35$ ms in mixed precision is a $2.29\\times$ speedup.", numbers: "a step that falls from $80$ ms in FP32 to $35$ ms in mixed precision is a $2.29\\times$ speedup." },
      { title: "Master-weight update", background: "if a weight is $1.0$ and the update is $10^{-5}$, FP32 can track the change while FP16's coarse spacing near $1$ may lose it.", numbers: "if a weight is $1.0$ and the update is $10^{-5}$, FP32 can track the change while FP16's coarse spacing near $1$ may lose it." },
      { title: "Softmax stability", background: "subtracting the max logit changes logits $(1000,999)$ to $(0,-1)$, preventing overflow while preserving probabilities.", numbers: "subtracting the max logit changes logits $(1000,999)$ to $(0,-1)$, preventing overflow while preserving probabilities." }
    ]
  }
};
