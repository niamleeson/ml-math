# Math · Part 08 — Numerical analysis  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles (plain warm voice · complete step-by-step derivations · case-by-case · name every
> symbol), the fix recipe, and the Definition of Done. Every number below was checked with Python/numpy from
> the repo root; the verification covered epsilon values, condition numbers, iteration traces, factorizations,
> quadrature estimates, finite differences, eigenvalue iteration, and stable softmax/log-sum-exp.

**Section:** Numerical analysis · **Lessons:** 23 · **Breadcrumb:** `Mathematics · Analysis & Calculus` · **Priority:** HIGH

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — `math-08-01…12` share generic apps such as _Model training numerics · Validation and testing · Scientific computing history · Optimization workflows · Data preprocessing · Production ML systems_ | 12 / 23 |
| Templated / thin motivation, especially `math-08-18…22` | 17 / 23 |
| Key formula not in display form | 20 / 23 |
| Unclosed math-delimiter LaTeX bug | 12 lessons / 57 fields |
| Deep-authored action in this plan | 21 derivations / 2 explain-only |

**The core change:** every §5 below is rewritten so all six applications use that lesson's own numerical idea
and contain a re-derivable number. The copy-pasted §5 block is removed, the unclosed math-delimiter fields are listed for
repair, and each formula is either derived step by step or explicitly marked explain-only.

---

## Priority & systemic issues

- **Shared §5 block to delete:** `math-08-01…12` reuse the same application titles and many of the same
  numbers. These must be replaced lesson-by-lesson, not lightly edited.
- **Conditioning and stability first:** `math-08-06` and `math-08-07` are ML-central and called out in the
  master. `math-08-06` is the model entry below.
- **LaTeX bugs found by odd math-delimiter scan:**
  - `math-08-01` — `applications.1.numbers`; `applications.2.numbers`.
  - `math-08-02` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`; `takeaways.0`.
  - `math-08-03` — `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.5.numbers`.
  - `math-08-04` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`.
  - `math-08-05` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`.
  - `math-08-06` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`.
  - `math-08-07` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`.
  - `math-08-08` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`.
  - `math-08-09` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`.
  - `math-08-10` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`.
  - `math-08-11` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`.
  - `math-08-12` — `applications.0.numbers`; `applications.1.numbers`; `applications.2.numbers`; `applications.3.numbers`; `applications.4.numbers`.

---

## Model entry (full prose)

### Model lesson: math-08-06 — Conditioning of problems  — **full-depth model entry**

**Connections (§1).**
> This lesson builds directly on absolute error, relative error, and first-order error propagation. Relative
> error gives a scale-aware way to describe a small input change, and the derivative tells how a smooth
> function carries that change into the output. Conditioning puts those two ideas together: it asks whether
> the problem itself magnifies small changes before any algorithm is chosen.
>
> This distinction matters throughout numerical analysis. Stability is about the algorithm; conditioning is
> about the mathematical problem being solved. A stable algorithm can still return a poor answer for an
> ill-conditioned problem, because the exact answer may genuinely change a lot when the input changes a
> little. Matrix solves, least squares, loss curvature, normal equations, and softmax/log-sum-exp all use this
> same sensitivity lens.

**Motivation & Intuition (§2).**
> Numerical error is not always caused by bad code. Sometimes the data describe a delicate problem: a small
> measurement error, rounding error, or perturbation changes the exact answer substantially. Conditioning is
> the number that measures this built-in sensitivity.
>
> For a scalar function, the local question is simple. If the input $x$ changes by a small amount $\Delta x$, the output $f(x)$ changes by about $f'(x)\Delta x$. To compare different scales fairly, divide
> the output change by the output size and the input change by the input size. The condition number is the
> ratio of those two relative changes. A condition number near $1$ means relative errors stay about the same
> size; a condition number of $1000$ means a $0.1\%$ input error can become about a $100\%$ output error.
>
> This is why the condition number belongs before the algorithm. It tells whether the problem is sensitive in
> exact arithmetic. After that, stability tells whether the chosen algorithm adds unnecessary numerical error.

**Definition & Assumptions (§3).** Display the scalar formula
$$
\kappa_f(x)=\left|\frac{x f'(x)}{f(x)}\right|
$$
and the matrix formula
$$
\kappa(A)=\lVert A\rVert\,\lVert A^{-1}\rVert.
$$
Then derive the scalar formula completely:
1. Start with the first-order change $\Delta y\approx f'(x)\Delta x$ — this is Taylor's linear approximation.
2. Divide by the output size: $\dfrac{|\Delta y|}{|f(x)|}\approx \dfrac{|f'(x)|\,|\Delta x|}{|f(x)|}$ — this turns output error into relative output error.
3. The relative input error is $\dfrac{|\Delta x|}{|x|}$ — this measures the input change on the input's own scale.
4. Divide relative output error by relative input error: $\dfrac{|f'(x)|\,|\Delta x|/|f(x)|}{|\Delta x|/|x|}$ — this is the amplification factor.
5. Cancel $|\Delta x|$ to get $\left|\dfrac{x f'(x)}{f(x)}\right|$ — the small perturbation size drops out, leaving local sensitivity.
6. For $f(x)=x^2$ at $x=3$, $f'(3)=6$ and $f(3)=9$, so $\kappa_f(3)=|3\cdot6/9|=2$ — a $1\%$ input error gives about a $2\%$ output error.

**Symbols.** $f$ is the exact scalar function; $x$ is the input point; $f'(x)$ is the local derivative; $\Delta x$ and $\Delta y$ are small input and output changes; $\kappa_f(x)$ is the scalar condition number; $A$ is an invertible matrix; $A^{-1}$ is the inverse map; $\lVert\cdot\rVert$ is the chosen norm; $\kappa(A)$ is the worst-case relative amplification for the matrix problem.

**Real-World Applications (§5).**
1. **Ill-conditioned solve** — for $A=\operatorname{diag}(1000,1)$, $\kappa_2(A)=1000$, so a $0.1\%$ right-side error can produce a worst-case $100\%$ solution error.
2. **Loss curvature sets gradient-descent speed** — for $f(x,y)=x^2+100y^2$, the Hessian eigenvalues are $2$ and $200$, so $\kappa=100$.
3. **Normal equations square conditioning** — if $\kappa_2(X)=100$, then $\kappa_2(X^TX)=10{,}000$, which is why QR is preferred for least squares.
4. **Catastrophic cancellation as sensitivity** — $f(x)=1-\cos x$ near $x=10^{-4}$ gives $f(x)\approx5.0\times10^{-9}$ and $\kappa\approx2$ for the exact problem, but the direct floating-point subtraction is algorithmically unstable; the rewrite $2\sin^2(x/2)$ preserves the small value.
5. **Softmax reconditioning** — logits $[1000,1001,1002]$ are shifted by $1002$ to $[-2,-1,0]$; the probabilities are unchanged, and the largest is $0.6652$.
6. **Scalar sensitivity check** — $\kappa_f(3)=2$ for $f(x)=x^2$, so a $0.5\%$ input error gives about a $1\%$ output error.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson. The labels are plan shorthand; in the
app they become flowing prose with display formulas, symbol glosses, and six concept-specific applications.

### `math-08-01` — Floating-point representation (IEEE 754)  · rewrite §5 · explain-only

**Connections (§1).**
> This lesson begins the numerical analysis section with the way real numbers are stored on actual machines. Earlier algebra and calculus treated numbers as exact objects, but programs must encode them using finitely many bits. Floating point is the standard compromise: it keeps a fixed number of significant binary digits while allowing the exponent to move the scale. That representation prepares the ground for rounding error, machine epsilon, conditioning, and stability in the next lessons.

**Motivation & Intuition (§2).**
> Floating point is best understood as scientific notation in base two. A number is stored with a sign, a significand carrying the leading binary digits, and an exponent that shifts those digits left or right. This gives a very large range of magnitudes without storing every real number, which would be impossible.
>
> The price is that representable numbers form a grid, not a continuum. Near one scale the grid is fine; at larger scales the grid spacing grows. That is why a decimal such as $0.15625$ can be exact while $128/255$ is generally not exact in binary. The representation is systematic and predictable, but it means every later numerical method must account for finite spacing.

**Definition & Assumptions (§3).** Explain-only: IEEE 754 is a storage convention, not a theorem. Show the value rule $(-1)^s(1.f)_2 2^e$ and explain that spacing near $2^k$ is $2^{k-(p-1)}$ because the significand grid has $p-1$ stored fractional bits.

**Symbols.** $s$ sign bit; $(1.f)_2$ normalized binary significand; $e$ unbiased exponent; $p$ significant binary bits; spacing means the gap between adjacent representable values.

**Real-World Applications (§5).**
1. **Exact binary weights**: $0.15625=5/32=(1.01)_2 2^{-3}$ is stored exactly.
2. **Float32 grid near 1**: spacing is $2^{-23}\approx1.19\times10^{-7}$.
3. **Double range**: exponent bits allow ordinary magnitudes roughly $10^{-308}$ to $10^{308}$.
4. **Matrix kernels**: a $1024\times1024$ matrix product performs about $2\cdot1024^3=2.147$ billion floating operations.
5. **Pixel normalization**: $128/255\approx0.502$ is not generally exact in binary.
6. **Ties-to-even**: $1+2^{-53}$ lies halfway between double values and rounds to $1$.

### `math-08-02` — Machine epsilon and rounding  · rewrite §5 · deepen derivation

**Connections (§1).**
> Floating-point representation explains where the grid of machine numbers comes from. This lesson measures the size of that grid near $1$, where the spacing has a special name: machine epsilon. Once that spacing is known, rounding can be described with a small relative-error model. That model becomes the basic unit for later estimates of cancellation, stability, and finite-difference step size.

**Motivation & Intuition (§2).**
> Machine epsilon is the distance from $1$ to the next representable floating-point number. It is not a vague statement that computers are approximate; it is a precise spacing determined by the number of stored significant bits. In base two, each extra precision bit halves the spacing.
>
> Rounding to nearest usually lands within half a spacing of the exact value. That half-spacing, called unit roundoff, is the scale used to model one rounded operation. Writing a rounded value as the exact value times $(1+\delta)$ gives a compact way to carry rounding through formulas, as long as $|\delta|$ is bounded by the unit roundoff.

**Definition & Assumptions (§3).** 1. In a base-2 format with precision $p$, numbers in $[1,2)$ have significands $1.b_2\dots b_p$. 2. Changing the last stored bit changes the value by $2^{-(p-1)}$. 3. Therefore $\epsilon_{\text{mach}}=2^{1-p}$. 4. Round-to-nearest moves at most half a gap, so $u=\epsilon_{\text{mach}}/2$. 5. Model one rounded operation as $\operatorname{fl}(x)=x(1+\delta)$ with $|\delta|\le u$.

**Symbols.** $p$ precision in significant bits; $\epsilon_{\text{mach}}$ next-after-one spacing; $u$ unit roundoff; $\operatorname{fl}(x)$ rounded value; $\delta$ relative rounding error.

**Real-World Applications (§5).**
1. **fp32 tolerance**: $\epsilon=2^{-23}\approx1.19\times10^{-7}$.
2. **double tolerance**: $\epsilon=2^{-52}\approx2.22\times10^{-16}$ and $u=2^{-53}\approx1.11\times10^{-16}$.
3. **Loss scale**: a value near $100$ has one-rounding scale $100u\approx1.11\times10^{-14}$.
4. **Feature scale**: a feature near $10^6$ has roundoff scale $10^6u\approx1.11\times10^{-10}$.
5. **Finite-difference step**: balancing truncation and roundoff often gives $h\approx\sqrt{u}\approx1.05\times10^{-8}$ for first-order checks.
6. **Tiny increment**: $1+10^{-18}$ rounds to $1$ in double because $10^{-18}<2^{-52}$.

### `math-08-03` — Absolute and relative error  · rewrite §5 · deepen derivation

**Connections (§1).**
> After seeing that machine numbers are spaced apart and rounded, the next task is to describe the error that results. Absolute error gives the direct distance between an exact value and an approximation. Relative error compares that distance with the size of the exact value, so it is often more meaningful across different scales. These two measures are the language used by conditioning, residual tests, and numerical stopping rules.

**Motivation & Intuition (§2).**
> Absolute error is the simplest measure: it says how far the approximation missed the exact value. A miss of $0.001$ may be tiny for a quantity near one million, but large for a probability near zero. That is why absolute error alone does not always describe the practical severity of a numerical error.
>
> Relative error divides the miss by the size of the exact value. This makes the error dimensionless and allows fair comparisons across scales. The same idea also explains its weakness: when the exact value is zero or very close to zero, the denominator becomes fragile, so absolute error or a problem-specific tolerance may be safer.

**Definition & Assumptions (§3).** 1. Let $x$ be exact and $\hat x$ approximate. 2. The signed error is $\hat x-x$ because it records direction. 3. The absolute error is $|\hat x-x|$ because distance should be nonnegative. 4. If $x\ne0$, divide by $|x|$ to get $|\hat x-x|/|x|$. 5. Multiply by $100$ to report a percent.

**Symbols.** $x$ exact value; $\hat x$ approximation; $|\cdot|$ absolute value; relative error is dimensionless; vector versions replace absolute value by a norm.

**Real-World Applications (§5).**
1. **AUC lift**: $0.804-0.800=0.004$, relative lift $0.004/0.800=0.5\%$.
2. **Small probability**: predicting $0.003$ instead of $0.002$ has relative error $50\%$.
3. **GPS scale**: $1$ m error over $1000$ m is $0.1\%$.
4. **Linear residual**: if $\lVert b\rVert=200$ and $\lVert r\rVert=0.02$, relative residual is $10^{-4}$.
5. **Tolerance conversion**: relative tolerance $10^{-9}$ at scale $10^6$ allows absolute error $0.001$.
6. **Pixel changes**: $5\to7$ is $40\%$, while $200\to202$ is $1\%$.

### `math-08-04` — Error propagation  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Absolute and relative error describe how large an error is after it appears. Error propagation explains how an input error moves through a formula. The derivative gives the local multiplier in one variable, and partial derivatives give the corresponding pieces in several variables. This lesson connects calculus directly to practical numerical uncertainty.

**Motivation & Intuition (§2).**
> A small input error does not usually pass through a computation unchanged. If the formula is steep at the input, the output error grows; if the formula is flat, the output error shrinks. Taylor's linear approximation is the natural tool for making this precise because it replaces the formula locally by its best linear model.
>
> In several variables, each input can push the output up or down according to its own partial derivative. Signed errors can cancel, while worst-case bounds avoid relying on cancellation by summing absolute contributions. This gives a practical way to estimate how measurement noise, rounding, or preprocessing error affects a computed quantity.

**Definition & Assumptions (§3).** 1. Start with Taylor's formula $f(x+\Delta x)=f(x)+f'(x)\Delta x+O(\Delta x^2)$. 2. Subtract $f(x)$ to isolate output change: $\Delta y=f(x+\Delta x)-f(x)$. 3. Drop second-order terms for small $\Delta x$, giving $\Delta y\approx f'(x)\Delta x$. 4. For $f(x_1,\dots,x_n)$, Taylor gives $\Delta f\approx\sum_i (\partial f/\partial x_i)\Delta x_i$. 5. For worst-case bounds, take absolute values before summing.

**Symbols.** $\Delta x$ input error; $\Delta y$ output error; $f'(x)$ local multiplier; $\partial f/\partial x_i$ sensitivity to input $i$; $O(\Delta x^2)$ smaller second-order remainder.

**Real-World Applications (§5).**
1. **Squared feature**: $y=x^2$ at $x=3$ with $\Delta x=0.01$ gives $\Delta y\approx6(0.01)=0.06$.
2. **Exact check**: $3.01^2-3^2=0.0601$, close to the estimate.
3. **Log transform**: $y=\log x$ at $x=100$ with $\Delta x=0.5$ gives $\Delta y\approx0.005$.
4. **Product feature**: $f=ab$ at $(4,5)$ with errors $(0.01,-0.02)$ gives $\Delta f\approx5(0.01)+4(-0.02)=-0.03$.
5. **Normed worst case**: sensitivities $(3,4)$ and input-error bound $0.01$ give at most $0.07$.
6. **Sensor standardization**: $z=(x-100)/15$, so a $0.3$ input error gives $0.02$ output error.

### `math-08-05` — Catastrophic cancellation  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Rounding error is often small when viewed as an absolute error, but subtraction can make it large in relative terms. This lesson uses the error ideas from the previous lessons to explain catastrophic cancellation. It also introduces an important habit in numerical analysis: keep the mathematics the same, but rewrite the computation to avoid exposing fragile operations. The stable forms used later for cosine, quadratic roots, logarithms, and softmax follow the same pattern.

**Motivation & Intuition (§2).**
> When two nearly equal rounded numbers are subtracted, their leading matching digits disappear. Those leading digits were the reliable part of the numbers, so the small remaining difference may be made mostly from the earlier rounding errors. The absolute error may not have grown much, but the target difference is small, making the relative error large.
>
> Cancellation is not a statement that subtraction is always bad. It is dangerous when the difference itself is the important answer and the inputs already carry error. Algebraic rewrites, such as rationalizing a square-root difference or using `log1p`, preserve the exact mathematical value while computing it in a way that keeps significant information.

**Definition & Assumptions (§3).** 1. Suppose computed inputs are $a+e_a$ and $b+e_b$. 2. The computed difference is $(a-b)+(e_a-e_b)$. 3. The absolute error is about $|e_a-e_b|\le |e_a|+|e_b|$. 4. The relative error is about $|e_a-e_b|/|a-b|$. 5. When $a\approx b$, the denominator is small, so the relative error can be large. 6. Rationalize $\sqrt{x+1}-\sqrt{x}$ by multiplying by the conjugate, giving $1/(\sqrt{x+1}+\sqrt{x})$.

**Symbols.** $a,b$ nearly equal quantities; $e_a,e_b$ prior rounding errors; $a-b$ small target difference; relative error compares error with $|a-b|$.

**Real-World Applications (§5).**
1. **Square-root difference**: $\sqrt{101}-10=1/(\sqrt{101}+10)\approx0.0498756$.
2. **Tiny cosine loss**: $1-\cos(10^{-4})\approx5.0\times10^{-9}$; $2\sin^2(5\times10^{-5})$ computes the same scale stably.
3. **Quadratic formula**: for $x^2+10^8x+1=0$, the small root is better as $2c/(-b-\sqrt{b^2-4ac})\approx-10^{-8}$.
4. **Variance formula**: data $10^8\pm1$ should have variance about $1$, but $E[X^2]-E[X]^2$ subtracts two numbers near $10^{16}$.
5. **Residual loss**: subtracting predictions $1.000001-1.000000$ leaves $10^{-6}$, so one $10^{-12}$ absolute input error becomes about $10^{-6}$ relative.
6. **Log probability**: use `log1p(x)`; for $x=10^{-8}$, $\log(1+x)\approx9.99999995\times10^{-9}$.

### `math-08-06` — Conditioning of problems  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson builds directly on absolute error, relative error, and first-order error propagation. Relative error gives a scale-aware way to describe a small input change, and the derivative tells how a smooth function carries that change into the output. Conditioning puts those two ideas together: it asks whether the problem itself magnifies small changes before any algorithm is chosen.
>
> This distinction matters throughout numerical analysis. Stability is about the algorithm; conditioning is about the mathematical problem being solved. A stable algorithm can still return a poor answer for an ill-conditioned problem, because the exact answer may genuinely change a lot when the input changes a little. Matrix solves, least squares, loss curvature, normal equations, and softmax/log-sum-exp all use this same sensitivity lens.

**Motivation & Intuition (§2).**
> Numerical error is not always caused by bad code. Sometimes the data describe a delicate problem: a small measurement error, rounding error, or perturbation changes the exact answer substantially. Conditioning is the number that measures this built-in sensitivity.
>
> For a scalar function, the local question is simple. If the input $x$ changes by a small amount $\Delta x$, the output $f(x)$ changes by about $f'(x)\Delta x$. To compare different scales fairly, divide the output change by the output size and the input change by the input size. The condition number is the ratio of those two relative changes. A condition number near $1$ means relative errors stay about the same size; a condition number of $1000$ means a $0.1\%$ input error can become about a $100\%$ output error.
>
> This is why the condition number belongs before the algorithm. It tells whether the problem is sensitive in exact arithmetic. After that, stability tells whether the chosen algorithm adds unnecessary numerical error.

**Definition & Assumptions (§3).** Use the six-step scalar derivation in the model entry; also state the matrix rule $\kappa(A)=\lVert A\rVert\lVert A^{-1}\rVert$ and the SPD/eigenvalue version $\lambda_{\max}/\lambda_{\min}$.

Display the scalar formula
$$
\kappa_f(x)=\left|\frac{x f'(x)}{f(x)}\right|
$$
and the matrix formula
$$
\kappa(A)=\lVert A\rVert\,\lVert A^{-1}\rVert.
$$
Then derive the scalar formula completely:
1. Start with the first-order change $\Delta y\approx f'(x)\Delta x$ — this is Taylor's linear approximation.
2. Divide by the output size: $\dfrac{|\Delta y|}{|f(x)|}\approx \dfrac{|f'(x)|\,|\Delta x|}{|f(x)|}$ — this turns output error into relative output error.
3. The relative input error is $\dfrac{|\Delta x|}{|x|}$ — this measures the input change on the input's own scale.
4. Divide relative output error by relative input error: $\dfrac{|f'(x)|\,|\Delta x|/|f(x)|}{|\Delta x|/|x|}$ — this is the amplification factor.
5. Cancel $|\Delta x|$ to get $\left|\dfrac{x f'(x)}{f(x)}\right|$ — the small perturbation size drops out, leaving local sensitivity.
6. For $f(x)=x^2$ at $x=3$, $f'(3)=6$ and $f(3)=9$, so $\kappa_f(3)=|3\cdot6/9|=2$ — a $1\%$ input error gives about a $2\%$ output error.

**Symbols.** See model entry. $f$ is the exact scalar function; $x$ is the input point; $f'(x)$ is the local derivative; $\Delta x$ and $\Delta y$ are small input and output changes; $\kappa_f(x)$ is the scalar condition number; $A$ is an invertible matrix; $A^{-1}$ is the inverse map; $\lVert\cdot\rVert$ is the chosen norm; $\kappa(A)$ is the worst-case relative amplification for the matrix problem.

**Real-World Applications (§5).**
1. **Ill-conditioned solve** — for $A=\operatorname{diag}(1000,1)$, $\kappa_2(A)=1000$, so a $0.1\%$ right-side error can produce a worst-case $100\%$ solution error.
2. **Loss curvature sets gradient-descent speed** — for $f(x,y)=x^2+100y^2$, the Hessian eigenvalues are $2$ and $200$, so $\kappa=100$.
3. **Normal equations square conditioning** — if $\kappa_2(X)=100$, then $\kappa_2(X^TX)=10{,}000$, which is why QR is preferred for least squares.
4. **Catastrophic cancellation as sensitivity** — $f(x)=1-\cos x$ near $x=10^{-4}$ gives $f(x)\approx5.0\times10^{-9}$ and $\kappa\approx2$ for the exact problem, but the direct floating-point subtraction is algorithmically unstable; the rewrite $2\sin^2(x/2)$ preserves the small value.
5. **Softmax reconditioning** — logits $[1000,1001,1002]$ are shifted by $1002$ to $[-2,-1,0]$; the probabilities are unchanged, and the largest is $0.6652$.
6. **Scalar sensitivity check** — $\kappa_f(3)=2$ for $f(x)=x^2$, so a $0.5\%$ input error gives about a $1\%$ output error.

### `math-08-07` — Stability of algorithms  · rewrite §5 · deepen derivation

**Connections (§1).**
> Conditioning separated the sensitivity of the problem from the behavior of the algorithm. Stability studies the algorithmic side of that split. It asks whether the computed answer can be interpreted as the exact answer to a nearby problem. This viewpoint connects rounding error to useful forward-error estimates through the condition number.

**Motivation & Intuition (§2).**
> A numerical algorithm does not need to reproduce exact arithmetic step by step to be trustworthy. A stable algorithm may make tiny rounding choices internally, but its final answer behaves as if the input data had been changed only slightly. That is the backward-error idea.
>
> Forward error then depends on both pieces. If the problem is well-conditioned, a small backward error usually produces a small answer error. If the problem is ill-conditioned, even a backward-stable algorithm can have a large forward error because the exact mathematical problem is sensitive. This is why stability and conditioning are normally discussed together.

**Definition & Assumptions (§3).** 1. Let $y=f(x)$ be the exact answer and $\hat y$ the computed answer. 2. Forward error is $\lVert\hat y-y\rVert/\lVert y\rVert$. 3. Backward error is the smallest relative perturbation $\lVert\Delta x\rVert/\lVert x\rVert$ such that $\hat y=f(x+\Delta x)$. 4. A backward stable algorithm makes this backward error $O(u)$. 5. Conditioning gives forward error $\lesssim\kappa\cdot$ backward error.

**Symbols.** $x$ input; $y$ exact output; $\hat y$ computed output; $\Delta x$ nearby-input perturbation; $u$ unit roundoff; $\kappa$ condition number.

**Real-World Applications (§5).**
1. **Forward estimate**: $\kappa=20$ and backward error $3\times10^{-8}$ give forward error $6\times10^{-7}$.
2. **Stable summation check**: pairwise summing $1024$ terms has depth $10$, not $1023$ sequential additions.
3. **Unstable recurrence**: error multiplied by $1.1$ for $50$ steps grows by $1.1^{50}\approx117.4$.
4. **Stable recurrence**: multiplier $0.9$ for $50$ steps shrinks error to $0.9^{50}\approx0.00515$.
5. **Backward-stable solve**: if LU has backward error $10^{-15}$ and $\kappa=10^6$, forward error may be $10^{-9}$.
6. **Ill-conditioned limit**: the same backward error $10^{-15}$ with $\kappa=10^{12}$ can become $10^{-3}$ forward error.

### `math-08-08` — Bisection  · rewrite §5 · deepen derivation

**Connections (§1).**
> Bisection brings numerical analysis back to a basic calculus fact: a continuous function that changes sign must cross zero. Instead of using slopes or high-order models, it protects a bracket known to contain a root. This makes it slower than Newton-type methods but much easier to trust. The lesson also introduces iteration counts based on interval width.

**Motivation & Intuition (§2).**
> The method keeps two endpoints with opposite signs. The root may not be known exactly, but continuity guarantees that at least one root lies between them. By testing the midpoint, the method discards the half of the interval that no longer needs to be kept.
>
> Each step halves the uncertainty. That simple geometric shrinkage gives a direct plan for how many steps are needed to reach a target width. Bisection is therefore a reliable baseline: it may not use much information about the function's shape, but it preserves the root-containing guarantee at every step.

**Definition & Assumptions (§3).** 1. Assume $f$ is continuous and $f(a)f(b)<0$. 2. The Intermediate Value Theorem gives at least one root in $[a,b]$. 3. Set $m=(a+b)/2$. 4. If $f(a)f(m)\le0$, keep $[a,m]$; otherwise keep $[m,b]$. 5. The width halves each step, so after $n$ steps width is $(b-a)/2^n$. 6. The midpoint error is at most half the final width.

**Symbols.** $a,b$ bracket endpoints; $m$ midpoint; $n$ number of bisection steps; width is interval length; $f(a)f(b)<0$ means opposite signs.

**Real-World Applications (§5).**
1. **Root of $x^2-2$**: after two steps from $[1,2]$, bracket is $[1.25,1.5]$.
2. **Tolerance planning**: starting width $1$, ten steps give width $1/1024\approx0.0009766$.
3. **Safe learning-rate search**: halving $[0,1]$ until width $10^{-3}$ needs $10$ steps.
4. **Quantile inversion**: a CDF bracket of width $0.5$ after $12$ steps has width $0.000122$.
5. **Calibration threshold**: bracket $[0,100]$ to width $0.1$ needs $\lceil\log_2(1000)\rceil=10$ steps.
6. **Residual check**: $f(1.375)=-0.109375$ picks the right half of $[1.25,1.5]$ for $x^2-2$.

### `math-08-09` — Newton's method  · rewrite §5 · deepen derivation

**Connections (§1).**
> Newton's method builds on Taylor linearization, the same local idea used for error propagation. Instead of estimating an output error, it uses the tangent line to choose the next root estimate. This makes the method fast near a simple root, but also dependent on a useful derivative and a good local starting point. It is the standard reference point for faster root-finding and optimization updates.

**Motivation & Intuition (§2).**
> Near a current guess, a smooth curve can be approximated by its tangent line. The tangent line is easy to solve, so Newton's method uses the zero of that line as the next guess for the zero of the original function. When the tangent model is accurate, the new guess can be much closer than the old one.
>
> The same strength creates the main caution. If the derivative is tiny, the tangent crosses the axis far away, producing a large correction. If the root is multiple or the starting point is poor, the fast local behavior can disappear. Newton's method is therefore powerful, but it is not as globally protective as bisection.

**Definition & Assumptions (§3).** 1. Start at $x_n$. 2. Linearize: $f(x)\approx f(x_n)+f'(x_n)(x-x_n)$. 3. Set the linear model equal to zero because we want a root. 4. Solve $0=f(x_n)+f'(x_n)(x-x_n)$ for $x$. 5. Get $x_{n+1}=x_n-f(x_n)/f'(x_n)$. 6. State assumptions: $f'(x_n)\ne0$ and good local start for fast convergence.

**Symbols.** $x_n$ current iterate; $x_{n+1}$ next iterate; $f'(x_n)$ tangent slope; residual $f(x_n)$; simple root means derivative at the root is nonzero.

**Real-World Applications (§5).**
1. **Square root**: for $x^2-2$ from $1.5$, iterates are $1.4166667$ then $1.4142157$.
2. **Error drop**: second iterate is about $2.12\times10^{-6}$ from $\sqrt2$.
3. **Reciprocal computation**: solving $1/x-a=0$ gives $x_{n+1}=2x_n-a x_n^2$.
4. **Logistic intercept**: one Newton update uses $\Delta=-g/H$; with $g=0.8,H=4$, step is $-0.2$.
5. **Multiple-root slowdown**: $f=(x-1)^2$ gives $x_{n+1}=(x_n+1)/2$, so error halves.
6. **Bad derivative warning**: if $f'(x_n)=0.001$ and $f(x_n)=0.1$, Newton correction is $100$.

### `math-08-10` — The secant method  · rewrite §5 · deepen derivation

**Connections (§1).**
> The secant method sits between bisection and Newton's method. It keeps Newton's idea of replacing the curve by a line, but it estimates the slope from two function values instead of using an explicit derivative. This makes it useful when derivatives are expensive, unavailable, or inconvenient. It also shows how derivative-free methods can still use local geometry.

**Motivation & Intuition (§2).**
> Newton's method asks for the tangent slope at the current point. The secant method replaces that tangent slope with the slope of the line through the two most recent points. The next iterate is where this secant line crosses zero.
>
> This saves derivative evaluations and usually uses only one new function value per step after the first two points. The tradeoff is that the slope estimate can fail if the two function values are equal or nearly equal. Locally, the method is faster than simple linear convergence but usually not as fast as Newton's quadratic convergence.

**Definition & Assumptions (§3).** 1. Use points $(x_{n-1},f(x_{n-1}))$ and $(x_n,f(x_n))$. 2. The secant slope is $[f(x_n)-f(x_{n-1})]/[x_n-x_{n-1}]$. 3. Write the line through $x_n$: $f(x_n)+s(x-x_n)$. 4. Set it equal to zero. 5. Solve for $x$ to get $x_{n+1}=x_n-f(x_n)(x_n-x_{n-1})/[f(x_n)-f(x_{n-1})]$.

**Symbols.** $x_{n-1},x_n$ two most recent iterates; $s$ secant slope; denominator is the change in function values; $x_{n+1}$ secant intercept.

**Real-World Applications (§5).**
1. **Root of $x^2-2$**: from $1,2$, one step gives $4/3\approx1.3333$.
2. **Second secant step**: using $2$ and $4/3$ gives $1.4$.
3. **Derivative-free calibration**: if losses are $0.2$ at $0.1$ and $-0.1$ at $0.4$, the secant root estimate is $0.3$.
4. **Function-call budget**: after startup, each secant step needs one new function evaluation, while Newton also needs a derivative.
5. **Zero denominator guard**: if two residuals are both $0.01$, the secant denominator is $0$ and the step is invalid.
6. **Superlinear rate note**: the local order is about $1.618$, between bisection's linear rate and Newton's quadratic rate.

### `math-08-11` — Fixed-point iteration  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Fixed-point iteration presents many numerical methods in a common form: repeat a map until it stops changing. Root finding, nonlinear solves, expectation-maximization style updates, and some linear solvers can all be viewed this way. The key issue is not just whether $x=g(x)$ has a solution, but whether the chosen map pulls nearby guesses toward it. This lesson uses the derivative as a local contraction factor.

**Motivation & Intuition (§2).**
> Rewriting a problem as $x=g(x)$ turns solving into iteration. Starting from a guess, the algorithm feeds the current value back into $g$ to get the next value. If the map brings nearby points closer to the fixed point, the errors shrink.
>
> The derivative of $g$ at the fixed point gives the local shrink-or-grow factor. A magnitude below $1$ means errors contract locally, while a magnitude above $1$ usually means they expand. This is why different algebraic rearrangements of the same equation can behave very differently as numerical algorithms.

**Definition & Assumptions (§3).** 1. Let $x^*$ satisfy $g(x^*)=x^*$. 2. Subtract fixed-point equations: $x_{n+1}-x^*=g(x_n)-g(x^*)$. 3. Linearize $g(x_n)$ near $x^*$: $g(x_n)-g(x^*)\approx g'(x^*)(x_n-x^*)$. 4. Thus $e_{n+1}\approx g'(x^*)e_n$. 5. If $|g'(x^*)|<1$, errors contract locally; if $|g'(x^*)|>1$, they usually grow.

**Symbols.** $g$ iteration map; $x^*$ fixed point; $x_n$ iterate; $e_n=x_n-x^*$ error; $g'(x^*)$ local contraction factor.

**Real-World Applications (§5).**
1. **Cosine iteration**: from $0.5$, $x_1=0.8776$, $x_2=0.6390$, $x_3=0.8027$.
2. **Contraction check**: at the fixed point $0.7391$, $|g'|=|-\sin(0.7391)|\approx0.674<1$.
3. **Divergent rearrangement**: $g(x)=2x$ has $|g'|=2$, so error doubles each step.
4. **Convergence budget**: factor $0.5$ needs $10$ steps to reduce error by about $1/1024$.
5. **EM-style iteration**: if likelihood change contracts by $0.8$, after $20$ iterations the remaining linear error factor is $0.8^{20}\approx0.0115$.
6. **Stopping rule**: changes $0.1,0.04,0.016$ suggest contraction factor $0.4$.

### `math-08-12` — LU factorization  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Many numerical problems reduce to solving linear systems, and LU factorization is one of the central tools for doing that efficiently. It records Gaussian elimination as matrix factors. Once the factorization is built, new right-hand sides can be solved without repeating the full elimination. This lesson prepares for pivoting, condition numbers, and iterative alternatives.

**Motivation & Intuition (§2).**
> Gaussian elimination turns a matrix into an upper triangular form by subtracting multiples of earlier rows from later rows. LU factorization stores exactly those multipliers in a lower triangular matrix. The result is a decomposition $A=LU$ when row swaps are not needed.
>
> Triangular systems are much easier to solve than general systems. Solving $Ax=b$ becomes two simpler stages: first solve $Ly=b$ by forward substitution, then solve $Ux=y$ by backward substitution. This is especially valuable when the same matrix appears with many different right-hand sides.

**Definition & Assumptions (§3).** 1. Start with $A=\begin{bmatrix}2&1\\4&3\end{bmatrix}$. 2. Use pivot $2$. 3. Compute multiplier $m=4/2=2$ to eliminate the lower-left entry. 4. Row 2 becomes $[4,3]-2[2,1]=[0,1]$, so $U=\begin{bmatrix}2&1\\0&1\end{bmatrix}$. 5. Store the multiplier in $L=\begin{bmatrix}1&0\\2&1\end{bmatrix}$. 6. Verify $LU=A$ by multiplication.

**Symbols.** $A$ original matrix; $L$ lower triangular multiplier matrix; $U$ upper triangular matrix; $m$ elimination multiplier; $P$ permutation matrix when row swaps are used.

**Real-World Applications (§5).**
1. **Repeated solves**: factoring one $1000\times1000$ matrix costs about $2n^3/3\approx6.67\times10^8$ flops; each triangular solve pair costs about $2n^2=2.0\times10^6$ flops.
2. **Worked factor**: $L=\begin{bmatrix}1&0\\2&1\end{bmatrix}$ and $U=\begin{bmatrix}2&1\\0&1\end{bmatrix}$.
3. **Determinant from $U$**: $\det A=2\cdot1=2$.
4. **Solve with factor**: for $b=(3,7)$, forward/back substitution gives $x=(1,1)$.
5. **Memory scale**: dense $1000\times1000$ double matrix stores $10^6$ entries, about $8$ MB.
6. **Pivoting connection**: if the first pivot were $10^{-6}$ with lower entry $1$, the multiplier would be $10^6$.

### `math-08-13` — Cholesky factorization  · deepen derivation

**Connections (§1).**
> LU factorization works for broad classes of square matrices, but many important matrices have extra structure. Symmetric positive-definite matrices appear in covariance models, kernel methods, least squares, and optimization. Cholesky factorization uses that structure to produce a lower triangular factor that acts like a matrix square root. It is faster and cleaner than general LU when its assumptions hold.

**Motivation & Intuition (§2).**
> A positive number can be written as a square of its positive square root. Cholesky extends that idea to a symmetric positive-definite matrix by writing it as $LL^T$. The lower triangular form keeps the computation organized and gives positive diagonal entries.
>
> The factor is useful because it turns covariance transformations, Mahalanobis distances, and linear solves into triangular operations. The assumptions matter: without symmetry and positive definiteness, the square-root interpretation and the clean triangular construction can fail.

**Definition & Assumptions (§3).** 1. Let $L=\begin{bmatrix}a&0\\b&c\end{bmatrix}$. 2. Multiply $LL^T=\begin{bmatrix}a^2&ab\\ab&b^2+c^2\end{bmatrix}$. 3. Match $A=\begin{bmatrix}4&2\\2&3\end{bmatrix}$. 4. $a^2=4$ gives $a=2$ because Cholesky uses positive diagonal entries. 5. $ab=2$ gives $b=1$. 6. $b^2+c^2=3$ gives $c=\sqrt2$. 7. Therefore $L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}$.

**Symbols.** $A$ SPD matrix; $L$ lower triangular factor; $L^T$ transpose; positive definite means $x^TAx>0$ for nonzero $x$.

**Real-World Applications (§5).**
1. **Gaussian sampling**: with $L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}$ and $z=(1,-1)$, $Lz=(2,-0.414)$.
2. **Ridge solve**: $A=\begin{bmatrix}4&2\\2&3\end{bmatrix}$ and $b=(6,5)$ gives $x=(1,1)$.
3. **Covariance check**: $\begin{bmatrix}9&3\\3&2\end{bmatrix}$ has factor $\begin{bmatrix}3&0\\1&1\end{bmatrix}$.
4. **Kernel factor**: $K=\begin{bmatrix}1&0.5\\0.5&1\end{bmatrix}$ has lower-right factor $\sqrt{0.75}\approx0.866$.
5. **Mahalanobis distance**: solving $Ly=(2,1)$ gives $y=(1,0)$, so distance squared is $1$.
6. **Cost saving**: Cholesky costs about $n^3/3$, half of LU's $2n^3/3$ for dense matrices.

### `math-08-14` — Pivoting  · AUTHOR derivation

**Connections (§1).**
> LU factorization depends on dividing by pivot entries during elimination. If a pivot is zero, the next elimination step cannot proceed; if it is tiny, the multipliers can become very large. Pivoting is the practical safeguard that chooses safer rows before division. It links factorization to stability by controlling how rounding errors can be amplified.

**Motivation & Intuition (§2).**
> Elimination removes entries below a pivot by subtracting a multiple of the pivot row. The multiplier is the entry being eliminated divided by the pivot. A small pivot therefore creates a large multiplier, and large multipliers can carry rounding error into later rows.
>
> Partial pivoting reduces this danger by swapping the largest available entry in the current column into the pivot position. Then the entries below the pivot are no larger in magnitude than the pivot itself, so the immediate multipliers are bounded by $1$. The row swaps are recorded in a permutation matrix, giving $PA=LU$.

**Definition & Assumptions (§3).** 1. In column $k$, elimination uses multiplier $m=a_{ik}/a_{kk}$. 2. A tiny pivot $a_{kk}$ makes $|m|$ large. 3. Large multipliers multiply any rounding error in the pivot row. 4. Partial pivoting swaps in the row with largest $|a_{ik}|$ in that column. 5. Then $|m|\le1$ for entries below that pivot. 6. Record row swaps in $P$, giving $PA=LU$.

**Symbols.** Pivot $a_{kk}$; multiplier $m$; $P$ permutation matrix; partial pivoting searches rows in one column; complete pivoting may also swap columns.

**Real-World Applications (§5).**
1. **Worked system**: without swapping, $0.001$ as pivot gives multiplier $1000$; after swapping, multiplier is $0.001$.
2. **Solve result**: pivoted solve for $[[0.001,1],[1,1]]x=(1,2)$ gives $x\approx(1.001001,0.998999)$.
3. **Permutation**: $P=\begin{bmatrix}0&1\\1&0\end{bmatrix}$ swaps two rows.
4. **Feature-scale danger**: pivot $10^{-6}$ with lower entry $1$ gives multiplier $10^6$.
5. **Newton system**: pivot $0.02$ and lower entry $1$ give multiplier $50$.
6. **Safe column**: entries $8,3,-4$ need no swap because multipliers are $0.375$ and $-0.5$.

### `math-08-15` — Matrix condition number  · AUTHOR derivation

**Connections (§1).**
> The scalar condition number measured local sensitivity for a function. Matrix condition numbers apply the same idea to linear systems and linear transformations. They describe how much solving with a matrix can amplify relative perturbations in the data. This lesson is central for understanding least squares, normal equations, covariance matrices, and numerical diagnostics.

**Motivation & Intuition (§2).**
> A matrix can stretch space by different amounts in different directions. When solving $Ax=b$, directions that the matrix barely stretches become dangerous because the inverse must stretch them back strongly. The condition number compares the largest stretch with the smallest stretch.
>
> In the $2$-norm, this comparison is the ratio of largest to smallest singular value. A large ratio means that some right-side errors can be greatly magnified in the solution. The condition number is a worst-case warning, not a guarantee that every perturbation will be amplified that much.

**Definition & Assumptions (§3).** 1. For $Ax=b$, a right-side perturbation gives $A(x+\Delta x)=b+\Delta b$. 2. Subtract $Ax=b$ to get $A\Delta x=\Delta b$. 3. Thus $\Delta x=A^{-1}\Delta b$. 4. Bound $\lVert\Delta x\rVert\le\lVert A^{-1}\rVert\lVert\Delta b\rVert$. 5. Also $\lVert b\rVert=\lVert Ax\rVert\le\lVert A\rVert\lVert x\rVert$, so $1/\lVert x\rVert\le\lVert A\rVert/\lVert b\rVert$. 6. Combine to get relative solution error bounded by $\kappa(A)$ times relative data error.

**Symbols.** $A$ invertible matrix; $x$ solution; $b$ right side; $\Delta b,\Delta x$ perturbations; $\lVert\cdot\rVert$ norm; $\sigma_{\max},\sigma_{\min}$ singular values; $\kappa_2(A)=\sigma_{\max}/\sigma_{\min}$.

**Real-World Applications (§5).**
1. **Diagonal matrix**: $\operatorname{diag}(4,1)$ has $\kappa_2=4$.
2. **Ill-conditioned diagonal**: $\operatorname{diag}(1,0.001)$ has $\kappa_2=1000$.
3. **Worst-case error**: $\kappa=200$ and data error $0.001$ can give $20\%$ solution error.
4. **Covariance spread**: eigenvalues $100,25,1$ give condition number $100$.
5. **Kernel near-duplicate**: singular values $2$ and $10^{-6}$ give $\kappa=2{,}000{,}000$.
6. **Reciprocal diagnostic**: $1/\kappa=10^{-12}$ means $\kappa=10^{12}$.

### `math-08-16` — Jacobi and Gauss–Seidel iteration  · AUTHOR derivation

**Connections (§1).**
> Direct factorizations such as LU and Cholesky can be expensive or memory-heavy for very large sparse systems. Jacobi and Gauss-Seidel take an iterative approach instead. They repeatedly update an approximate solution using the structure of the matrix. These methods also illustrate fixed-point iteration in a linear-system setting.

**Motivation & Intuition (§2).**
> The idea is to split the matrix into parts that are easy to use. Jacobi isolates the diagonal and computes all new components from the old iterate. Gauss-Seidel goes one step further by using newly computed components immediately within the same sweep.
>
> Convergence depends on the matrix and on the resulting iteration map. Diagonal dominance is a common sufficient condition because the diagonal terms control the update strongly enough. When the matrix is very sparse and large, even simple iterations can be valuable because each sweep touches only the nonzero entries.

**Definition & Assumptions (§3).** 1. Split $A=D+L+U$ into diagonal, lower, and upper parts. 2. Rearrange $Ax=b$ as $Dx=b-(L+U)x$ for Jacobi. 3. Iterate $x^{(k+1)}=D^{-1}(b-(L+U)x^{(k)})$. 4. Rearrange as $(D+L)x=b-Ux$ for Gauss-Seidel. 5. Iterate $(D+L)x^{(k+1)}=b-Ux^{(k)}$. 6. If the iteration converges to $x$, the fixed-point equation rearranges back to $Ax=b$.

**Symbols.** $D$ diagonal of $A$; $L$ strictly lower part; $U$ strictly upper part; $x^{(k)}$ current iterate; residual $r=b-Ax$; diagonal dominance is a common convergence condition.

**Real-World Applications (§5).**
1. **Jacobi worked system**: from $(0,0)$, two steps for $4x+y=9$, $x+3y=7$ give $(1.667,1.583)$.
2. **Gauss-Seidel first step**: same system gives $(2.25,1.583)$ after one sweep.
3. **Residual**: at $(1,1)$, residual is $(4,3)$ with norm $5$.
4. **Diagonal dominance**: $[[5,1],[2,6]]$ passes because $5>1$ and $6>2$.
5. **Convergence factor**: residuals $10,4,1.6,0.64$ give factor $0.4$ and next residual $0.256$.
6. **Sparse scale**: a graph with $10^8$ nodes and $20$ links per node has about $2\times10^9$ nonzeros, favoring iterative methods.

### `math-08-17` — Polynomial interpolation  · deepen derivation

**Connections (§1).**
> Interpolation turns sampled data into a function that matches the samples exactly. Polynomial interpolation uses one polynomial of low enough degree to pass through all the given distinct nodes. It connects algebra, function approximation, and numerical data tables. The lesson also sets up why splines can be preferable when many nodes or noisy data are involved.

**Motivation & Intuition (§2).**
> The Lagrange form builds the interpolating polynomial from basis polynomials that act like switches at the nodes. Each basis polynomial is $1$ at its own node and $0$ at all the other nodes. Multiplying each basis by the corresponding data value then forces the sum to match every data point.
>
> Exact matching is useful when the samples are trusted values from a smooth function. It is risky when the data are noisy, because the polynomial is required to chase every point. The uniqueness argument explains why there is only one polynomial of degree at most $n$ through $n+1$ distinct points.

**Definition & Assumptions (§3).** 1. Define Lagrange basis $\ell_i(x)=\prod_{j\ne i}(x-x_j)/(x_i-x_j)$. 2. At $x=x_i$, every factor is $1$, so $\ell_i(x_i)=1$. 3. At another node $x_k$, one numerator factor is zero, so $\ell_i(x_k)=0$. 4. Therefore $p(x)=\sum_i y_i\ell_i(x)$ satisfies $p(x_k)=y_k$. 5. If two degree-$n$ interpolants existed, their difference would have $n+1$ roots. 6. A nonzero degree-$n$ polynomial has at most $n$ roots, so the difference is zero and the interpolant is unique.

**Symbols.** $x_i$ distinct nodes; $y_i$ data values; $p$ interpolating polynomial; $\ell_i$ Lagrange basis polynomial; degree at most $n$ for $n+1$ nodes.

**Real-World Applications (§5).**
1. **Line through two points**: $(1,3),(4,9)$ gives $p(x)=2x+1$ and $p(2)=5$.
2. **Quadratic fit**: $(0,1),(1,3),(2,7)$ gives $p(x)=x^2+x+1$, so $p(1.5)=4.75$.
3. **Basis value**: for nodes $0,1,3$, $\ell_0(2)=(1)(-1)/3=-1/3$.
4. **Calibration table**: 2.0 V at 20 C and 2.5 V at 30 C gives 2.2 V at 24 C by linear interpolation.
5. **Learning curve**: loss $0.8$ at epoch 1 and $0.5$ at epoch 3 gives $0.65$ at epoch 2.
6. **Vandermonde caution**: nodes $0,1,2$ produce a $3\times3$ interpolation system for a quadratic.

### `math-08-18` — Spline interpolation  · deepen · explain-only

**Connections (§1).**
> Polynomial interpolation gives one global polynomial through all nodes. Splines take a more local approach by using low-degree polynomials on separate intervals. The pieces are tied together by smoothness conditions at the knots. This keeps interpolation flexible while avoiding some instability that can come from one high-degree global polynomial.

**Motivation & Intuition (§2).**
> A spline treats each interval between neighboring knots as its own small approximation problem. Low-degree pieces are easier to control than one large polynomial over the whole domain. Matching values makes the curve continuous, and matching derivatives makes the pieces join smoothly.
>
> There is not one universal spline formula because the construction depends on degree, smoothness, and boundary conditions. Natural and clamped cubic splines make different endpoint choices, and smoothing splines add a tradeoff between fit and roughness. The common principle is local polynomial structure plus linear conditions that determine the pieces.

**Definition & Assumptions (§3).** Explain-only: a spline is a construction with chosen smoothness and boundary conditions, not one universal formula. State how pieces are selected on intervals and how value/slope/curvature matching imposes linear conditions.

**Symbols.** Knots are input breakpoints; $s_i(x)$ is the polynomial on interval $i$; cubic means degree at most $3$ per piece; natural boundary means endpoint second derivatives are zero; clamped boundary means endpoint slopes are fixed.

**Real-World Applications (§5).**
1. **Local linear piece**: through $(1,2)$ and $(3,3)$, the slope is $0.5$ and $s(2)=2.5$.
2. **First interval**: through $(0,0)$ and $(1,2)$, $s(0.5)=1$.
3. **Natural boundary**: for endpoints $0$ and $3$, natural conditions set $s''(0)=0$ and $s''(3)=0$.
4. **Clamped boundary**: endpoint slopes $4$ and $1$ impose $s'(0)=4$, $s'(3)=1$.
5. **Smoothing spline objective**: fit error $6$ plus $0.5\cdot2$ roughness gives $7$.
6. **Bezier spline check**: endpoints $0,10$ with controls $3,7$ have midpoint value $(0+3\cdot3+3\cdot7+10)/8=5$.

### `math-08-19` — Least-squares approximation  · AUTHOR derivation

**Connections (§1).**
> Interpolation asks for exact agreement at the data points. Least squares is used when exact agreement is impossible, undesirable, or too sensitive to noise. It chooses coefficients that make the residual vector as small as possible in squared length. This lesson connects approximation, linear algebra, optimization, and the condition-number concerns introduced earlier.

**Motivation & Intuition (§2).**
> In an overdetermined system, there may be no vector $x$ with $Ax=b$ exactly. Least squares replaces exact solving with the best compromise under squared residual error. Squaring gives a smooth objective and penalizes larger residuals more strongly.
>
> The minimum occurs when the residual is orthogonal to every column direction available in $A$. Algebraically, that orthogonality becomes the normal equations. When the columns of $A$ are independent, those equations determine a unique least-squares solution, though the conditioning of $A^TA$ must be treated carefully.

**Definition & Assumptions (§3).** 1. For $Ax\approx b$, define residual $r=Ax-b$. 2. Minimize $\phi(x)=\lVert Ax-b\rVert^2=(Ax-b)^T(Ax-b)$. 3. Expand derivative: $\nabla\phi(x)=2A^T(Ax-b)$. 4. At the minimizer, set the gradient to zero. 5. This gives $A^TAx=A^Tb$. 6. If $A$ has full column rank, $A^TA$ is invertible and the solution is unique.

**Symbols.** $A$ design matrix; $x$ coefficients; $b$ observations; $r$ residual vector; $A^T$ transpose; $A^TAx=A^Tb$ normal equations.

**Real-World Applications (§5).**
1. **Best constant**: for data $2,4,7$, the constant fit is $13/3\approx4.333$ and SSE is $12.667$.
2. **One-parameter fit**: $A=(1,2)$, $b=(3,5)$ gives $x=13/5=2.6$.
3. **Squared errors**: predictions $2,5,6$ vs labels $3,4,10$ give SSE $18$ and MSE $6$.
4. **Ridge objective**: squared error $8$, $\lambda=0.1$, $\lVert w\rVert=5$ gives total $10.5$.
5. **Normal-equation conditioning**: if $\kappa(A)=100$, then $\kappa(A^TA)=10{,}000$.
6. **Residual orthogonality**: at a least-squares solution, $A^Tr=0$; for residual $(1,-1)$ and column $(1,1)$, dot product is $0$.

### `math-08-20` — Numerical integration (quadrature)  · AUTHOR derivation

**Connections (§1).**
> Calculus defines integrals as exact accumulated quantities, but applications often provide only finitely many function values. Quadrature turns those samples into an approximate integral. Different rules correspond to simple local shapes fitted to the curve. This lesson connects geometric area, sampled data, and approximation error.

**Motivation & Intuition (§2).**
> The trapezoid rule replaces the curve over an interval by a straight line through the endpoints. The area under that line is easy to compute, and adding panels gives an estimate over a longer interval. Shared interior points are counted once after the panel areas are combined.
>
> Other quadrature rules use different local shapes. The midpoint rule uses a rectangle based on the center value, while Simpson's rule uses a quadratic through two endpoints and a midpoint. The common idea is to trade an integral that may be hard to evaluate exactly for a weighted sum of sampled function values.

**Definition & Assumptions (§3).** 1. On one panel $[a,b]$, set $h=b-a$. 2. Approximate $f$ by the straight line through endpoint values. 3. The area under that line is trapezoid area $h(f(a)+f(b))/2$. 4. For multiple equal panels, add trapezoids and combine shared interior points. 5. This gives $h(\tfrac12 f_0+f_1+\cdots+f_{n-1}+\tfrac12 f_n)$. 6. Simpson's rule replaces the line by a quadratic through two endpoints and the midpoint.

**Symbols.** $a,b$ endpoints; $h$ step size; $f_i=f(a+ih)$ sampled value; quadrature means weighted sum approximating an integral.

**Real-World Applications (§5).**
1. **One trapezoid**: $\int_0^2 x^2dx$ estimates as $2(0+4)/2=4$; exact is $8/3\approx2.667$.
2. **Midpoint rule**: midpoint $1$ gives estimate $2\cdot1=2$.
3. **Simpson rule**: values $0,1,4$ give $2(0+4\cdot1+4)/6=8/3$.
4. **Composite trapezoid**: values $1,3,5$ at $h=2$ give $12$.
5. **AUC**: TPR $0,0.7,1$ at FPR $0,0.5,1$ gives AUC $0.6$.
6. **Work estimate**: forces $10$ N and $14$ N over $3$ m give trapezoid work $36$ J.

### `math-08-21` — Numerical differentiation  · AUTHOR derivation

**Connections (§1).**
> Numerical differentiation is the counterpart of quadrature: instead of estimating accumulated area from samples, it estimates a local rate of change from nearby values. Taylor expansion gives the formulas and their truncation errors. Floating-point rounding adds another source of error because nearby values may be close enough to subtract poorly. This lesson ties calculus, cancellation, and step-size choice together.

**Motivation & Intuition (§2).**
> A derivative is the limit of a difference quotient, but a computer cannot take a literal limit. It must choose a finite step size $h$. If $h$ is too large, the difference quotient is a rough approximation; if $h$ is too small, subtracting nearly equal function values can amplify rounding error.
>
> Forward differences use one nearby point and have first-order truncation error. Central differences use symmetric points, which cancels the leading error term and gives a more accurate formula for smooth functions. The practical step size balances the Taylor truncation error against roundoff from finite precision.

**Definition & Assumptions (§3).** 1. Taylor expand $f(x+h)=f(x)+hf'(x)+\tfrac12h^2f''(x)+O(h^3)$. 2. Subtract $f(x)$ and divide by $h$. 3. Get forward difference $(f(x+h)-f(x))/h=f'(x)+\tfrac12hf''(x)+O(h^2)$. 4. Taylor expand $f(x-h)=f(x)-hf'(x)+\tfrac12h^2f''(x)+O(h^3)$. 5. Subtract the two expansions and divide by $2h$. 6. Get central difference $(f(x+h)-f(x-h))/(2h)=f'(x)+O(h^2)$.

**Symbols.** $h$ step size; $f'(x)$ true derivative; forward difference uses one-sided values; central difference uses symmetric values; truncation error comes from omitted Taylor terms.

**Real-World Applications (§5).**
1. **Forward difference**: for $x^2$ at $2$ with $h=0.1$, estimate is $4.1$.
2. **Central difference**: same function and step gives exactly $4$ in this quadratic case.
3. **Cubic central difference**: for $x^3$ at $1$ with $h=0.1$, estimate is $3.01$.
4. **Gradient check**: loss $1.00025-1.000$ over $h=0.001$ gives slope $0.25$.
5. **Relative gradient difference**: analytic $0.250$ vs numerical $0.251$ gives $0.4\%$.
6. **Roundoff balance**: a common first-order choice is $h\approx\sqrt{u}\approx1.05\times10^{-8}$ in double precision.

### `math-08-22` — Eigenvalue computation  · AUTHOR derivation

**Connections (§1).**
> Eigenvalues describe directions that a matrix stretches without turning. Numerical methods rarely compute all eigen-information by symbolic formulas, especially for large matrices. Power iteration shows the basic computational idea: repeated multiplication reveals the dominant direction. This connects linear algebra to stability, PCA, spectral radius, and iterative algorithms.

**Motivation & Intuition (§2).**
> If a starting vector contains some component in the dominant eigenvector direction, multiplying by the matrix repeatedly scales that component by the dominant eigenvalue again and again. Components in weaker eigenvalue directions grow more slowly or shrink relative to it. Normalization keeps the vector size controlled while preserving the direction information.
>
> The convergence rate depends on the ratio between the next-largest eigenvalue and the dominant eigenvalue. A large spectral gap makes the unwanted components fade quickly; a small gap makes them fade slowly. The Rayleigh quotient then provides a way to estimate the eigenvalue from an approximate eigenvector.

**Definition & Assumptions (§3).** 1. Suppose $A$ has eigenvectors $v_i$ with eigenvalues $\lambda_i$ and $|\lambda_1|>|\lambda_2|\ge\cdots$. 2. Write the start vector as $x_0=c_1v_1+c_2v_2+\cdots$ with $c_1\ne0$. 3. After $k$ multiplications, $A^kx_0=c_1\lambda_1^kv_1+c_2\lambda_2^kv_2+\cdots$. 4. Factor out $\lambda_1^k$. 5. The other terms contain $(\lambda_i/\lambda_1)^k$, which shrink when the ratios are below $1$ in magnitude. 6. Normalize each step to keep scale controlled.

**Symbols.** $A$ matrix; $v_i$ eigenvectors; $\lambda_i$ eigenvalues; dominant eigenvalue has largest magnitude; $x_k$ power-iteration vector; Rayleigh quotient estimates an eigenvalue.

**Real-World Applications (§5).**
1. **Power iteration**: for $A=\operatorname{diag}(2,1)$ from $(1,1)$, two normalized steps give $(1,0.25)$.
2. **Rayleigh quotient**: for $v=(1,0.5)$, quotient is $2.25/1.25=1.8$.
3. **Convergence ratio**: eigenvalues $10$ and $9$ leave unwanted component factor $0.9^{20}\approx0.122$.
4. **PCA variance**: eigenvalues $9$ and $1$ mean first PC has $9$ times the variance.
5. **Stability of updates**: spectral radius $0.8$ shrinks errors by $0.8^{10}\approx0.107$ after ten steps.
6. **Normalization need**: eigenvalue $5$ grows length by $5^4=625$ after four unnormalized steps.

### `math-08-23` — Numerical precision & stability in deep learning  · deepen derivation

**Connections (§1).**
> The section's earlier ideas all appear in deep learning systems. Floating-point formats limit range and spacing, conditioning affects optimization, and stable algebraic rewrites prevent overflow or underflow. Deep models scale these issues across many layers, large tensors, and repeated updates. This lesson gathers the numerical habits that make the same mathematical model compute reliably.

**Motivation & Intuition (§2).**
> Deep learning computations often involve exponentials, long chains of multiplications, and gradients that vary widely in size. Logits can overflow when exponentiated directly, small gradients can underflow in low precision, and large gradient norms can destabilize updates. These are numerical issues, not changes in the intended model.
>
> Stable formulas keep the exact mathematics but change the way the computation is performed. Shifting logits before softmax multiplies numerator and denominator by the same positive factor, so probabilities do not change. Loss scaling, clipping, normalization, and log-sum-exp use the same practical principle: respect finite precision while preserving the intended calculation.

**Definition & Assumptions (§3).** 1. Softmax is $p_i=e^{z_i}/\sum_j e^{z_j}$. 2. Let $m=\max_j z_j$. 3. Multiply numerator and denominator by $e^{-m}$. 4. Get $p_i=e^{z_i-m}/\sum_j e^{z_j-m}$. 5. Because the same positive factor was applied to every term, probabilities are unchanged. 6. Now the largest exponent is $e^0=1$, preventing overflow.

**Symbols.** $z_i$ logits; $p_i$ softmax probabilities; $m$ maximum logit; fp32/fp16/bfloat16 are floating formats; loss scaling multiplies small gradients temporarily; clipping rescales large gradient norms.

**Real-World Applications (§5).**
1. **Stable softmax**: logits $[1000,1001,1002]$ shift to $[-2,-1,0]$ and largest probability is $0.6652$.
2. **Log-sum-exp**: for $[10,12]$, stable value is $12+\log(1+e^{-2})\approx12.1269$.
3. **Loss scaling**: gradient $2\times10^{-8}$ scaled by $1024$ becomes $2.048\times10^{-5}$.
4. **Gradient clipping**: norm $12$ clipped to threshold $3$ scales all components by $0.25$.
5. **Layer normalization**: values $[2,4,6]$ have mean $4$ and standard deviation $1.633$, giving normalized values about $[-1.225,0,1.225]$.
6. **Attention scores**: scores $[30,35]$ shift to $[-5,0]$, giving probabilities about $[0.0067,0.9933]$.

---

## Build order

1. **Mechanical LaTeX pass first** — fix every odd math-delimiter field listed above, including `math-08-02`'s `takeaways.0`.
2. **Replace the shared §5 block** for `math-08-01…12`, starting with `math-08-06` and `math-08-07`.
3. **Author derivations** for sensitivity and algorithms: `08-02…12`, then `08-15,16,19,20,21,22,23`.
4. **Polish non-boilerplate lessons** `08-13…23`: keep good existing numerical examples, but make the derivation and symbol gloss explicit.
5. **Regenerate and lint**: run the odd math-delimiter scan, lesson dump, and targeted rendering check to confirm zero boilerplate and zero LaTeX bugs.
