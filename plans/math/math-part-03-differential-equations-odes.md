# Math · Part 03 — Differential equations (ODEs)  (deep-authored reference)

> **Per-section execution plan.** Load together with the master [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) and the authoring brief for the voice, derivation, symbol, and verification rules. Every numeric claim below was checked with `python3` using `sympy`/standard math; key checks include `dsolve` for separable, linear first-order, integrating-factor, Bernoulli, constant-coefficient, variation-of-parameters, Laplace IVP examples, plus direct checks for Euler/RK steps, half-lives, equilibria, matrix exponentials, and finite-difference values.

**Section:** Differential equations (ODEs) · **Lessons:** 35 · **Breadcrumb:** `Mathematics · Analysis & Calculus` · **Priority:** MEDIUM (deepening + one LaTeX fix)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared app-set with a sibling) | 0 / 35 |
| Templated / thin motivation (stock opener or ≤45 words) | 5 / 35 |
| Key formula not in display form (`$$…$$`) | 28 / 35 |
| Genuine LaTeX bugs: unclosed math delimiter or lost matrix `\\` | 1 / 35 |
| Derivation action in this authored plan | 30 derivation / 5 explain-only |

**The core change:** this section already has mostly concept-specific applications, with `math-03-05` especially solid. The rewrite completes the derivations case by case, keeps conceptual lessons explain-only, names every symbol, and makes every application compute a number from that lesson's own method.

---

## Priority & systemic issues

- **No whole-section §5 boilerplate:** keep the existing on-topic spirit, but tighten every application so it uses the lesson's own method rather than a generic ODE fact.
- **Derivation gap:** first-order solution methods, constant-coefficient ODEs, variation of parameters, Laplace solving, eigenvalue systems, linearization, Euler, RK4, BVP finite differences, and Sturm–Liouville orthogonality need complete numbered derivations.
- **Concept lessons stay conceptual:** `math-03-01`, `math-03-02`, `math-03-04`, `math-03-12`, and `math-03-26` should explain clearly without forcing a proof.
- **LaTeX bug:** `math-03-07` has one genuine unclosed math delimiter in the worked example result; the step for `(e^{4x}y)'=8` is missing its trailing math delimiter and should render as `$(e^{4x}y)'=8$`.

---

## Model entry (full prose)

### `math-03-05` — Separable equations  — **full-depth model entry**

**Connections (§1).**
> This lesson builds on two familiar ideas: derivatives as rates of change, and antiderivatives as the way to recover a function from its rate. A separable equation is the first major ODE-solving method where those two ideas work together. The equation gives a rate law, and the special separable form lets each variable move to its own side before integration.
>
> This method leads directly into many later lessons. Logistic growth, Newton cooling, several first-order models, Bernoulli substitutions, and homogeneous substitutions all use separation either directly or after a change of variables. Learning the method carefully also builds the habit that matters throughout ODEs: check where division is allowed, integrate both sides, and use the initial condition only after the general relationship is found.

**Motivation & Intuition (§2).**
> A differential equation such as $y'=xy$ says that the slope depends on both the input $x$ and the current value $y$. That can seem harder than a plain antiderivative because the unknown function appears on the right side too. The separable structure is what makes this example manageable: the right side is a product of one factor involving $x$ and one factor involving $y$.
>
> Separation uses that product structure. We divide by the $y$ factor, place the $x$ factor with $dx$, and integrate. The result is not a shortcut around calculus; it is the chain rule in reverse. After integration, the constant of integration represents the whole family of solution curves, and the initial condition chooses the one curve that passes through the starting point.

**Definition & Assumptions (§3).** Display
$$
\frac{dy}{dx}=g(x)h(y).
$$
Then derive the method and solve $\dfrac{dy}{dx}=xy$, $y(0)=2$:
1. Start with $\dfrac{dy}{dx}=g(x)h(y)$ — the right side factors into an $x$ part and a $y$ part.
2. Divide by $h(y)$ where $h(y)\ne0$: $\dfrac{1}{h(y)}\dfrac{dy}{dx}=g(x)$ — this isolates the unknown-function factor.
3. Multiply by $dx$: $\dfrac{1}{h(y)}\,dy=g(x)\,dx$ — this is shorthand for the chain-rule-backed differential relationship.
4. Integrate both sides: $\int \dfrac{1}{h(y)}\,dy=\int g(x)\,dx+C$ — each side now has one variable.
5. For $y'=xy$, divide by $y$: $\dfrac{1}{y}\,dy=x\,dx$ — this is valid away from $y=0$, and the initial value $2$ keeps this solution nonzero near $0$.
6. Integrate: $\ln|y|=x^2/2+C$ — the left antiderivative is logarithmic.
7. Exponentiate: $|y|=e^C e^{x^2/2}$ — exponentials undo logarithms.
8. Absorb sign and $e^C$ into one nonzero constant: $y=Ce^{x^2/2}$ — the constant carries the branch.
9. Apply $y(0)=2$: $2=Ce^0=C$ — the initial value fixes the curve.
10. The solution is $y=2e^{x^2/2}$ — differentiating gives $y'=2xe^{x^2/2}=xy$, so the equation and initial value both check.

**Symbols.** $x$ is the independent variable; $y(x)$ is the unknown dependent function; $g(x)$ is the factor depending only on $x$; $h(y)$ is the factor depending only on $y$; $C$ is the integration constant; $dy$ and $dx$ mark the variables being integrated after separation.

**Real-World Applications (§5).**
1. **Exponential growth** — $P'=0.3P$, $P(0)=100$ separates to $P=100e^{0.3t}$, so $P(5)=100e^{1.5}\approx448.17$.
2. **Radioactive half-life** — $A'=-0.02A$ gives $A=A_0e^{-0.02t}$; setting $A/A_0=0.5$ gives $t=\ln2/0.02\approx34.66$.
3. **Logistic growth rate** — $P'=0.1P(1-P/1000)$ is separable; at $P=200$ the instantaneous rate is $0.1\cdot200\cdot0.8=16$.
4. **Gradient flow for a quadratic** — $w'=-0.5w$ gives $w=20e^{-0.5t}$ from $w(0)=20$, so $w(6)=20e^{-3}\approx0.996$.
5. **Newton cooling** — $T'=-0.1(T-20)$ gives $T=20+50e^{-0.1t}$ from $T(0)=70$, so $T(10)\approx38.39^\circ$.
6. **Memory-score decay** — $s'=-0.7s$, $s(0)=1$ gives $s(3)=e^{-2.1}\approx0.122$.

---

## Per-lesson change specs

**How to read these specs.** Each block is now expanded into the same full prose format as the model entry. The verified derivations, symbols, and six concept-specific numeric applications are preserved while §1 and §2 supply the reader-facing narrative.

### `math-03-01` — What is a differential equation?  · explain-only

**Connections (§1).**

> This lesson connects basic derivative notation and antiderivatives to the question of what a differential equation is. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for the vocabulary used by every later ODE method, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A differential equation describes a function by describing its rate of change. Instead of giving the curve directly, it gives a motion law and asks for the function whose derivative obeys that law. The concrete gap is that the curve is not supplied directly.
> 
> The load-bearing idea is that the rate law itself becomes the description of the unknown function. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

Explain-only: this is the vocabulary entry for ODEs, solutions, independent variables, and dependent variables. Show the reverse-derivative example $y'=3x^2\Rightarrow y=x^3+C$ rather than forcing a theorem.


**Symbols.** $x$ or $t$ is the independent variable; $y(x)$ or $s(t)$ is the unknown function; $y'$ and $dy/dx$ are derivatives; $C$ is an integration constant.


**Real-World Applications (§5).**

1. Velocity law $v'=4$, $v(0)=3$ gives $v(5)=23$.

2. Growth law $P'=0.2P$, $P(0)=100$ gives $P(10)\approx738.91$.

3. Neural state $h'=0.5h$, $h(0)=2$ gives $h(4)\approx14.78$.

4. Gradient flow $w'=-w$, $w(0)=8$ gives $w(3)\approx0.398$.

5. RC discharge $V'=-0.1V$, $V(0)=5$ gives $V(10)\approx1.84$.

6. Queue law $Q'=20$, $Q(0)=50$ gives $Q(6)=170$.



### `math-03-02` — Classifying differential equations  · explain-only

**Connections (§1).**

> This lesson connects the habit of inspecting formulas before solving them to classifying differential equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for choosing separation, linear methods, systems, or numerical tools, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Classification tells which solving tools are reasonable before any algebra begins. Order, ordinary versus partial, linearity, and systems are labels that prevent using a method on the wrong kind of equation. The concrete gap is that many equations look similar on the page.
> 
> The load-bearing idea is that order, variable type, linearity, and coupling identify the right toolbox. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

Explain-only: classification is a decision procedure. Teach it by checking one equation at a time: highest derivative for order, number of independent variables for ODE/PDE, and powers/products of the unknown for linearity.


**Symbols.** $y^{(n)}$ is the $n$th derivative; $a_i(x)$ are coefficient functions; $g(x)$ is forcing; $u_t$ and $u_{xx}$ are partial derivatives; a system has vector state $x$.


**Real-World Applications (§5).**

1. $y''+3y'+2y=\sin x$ is second-order, ordinary, linear.

2. $x''=-9.8$ is order $2$ and needs two constants.

3. $u_t=0.01u_{xx}$ has first time order and second space order.

4. A 64-coordinate hidden state gives 64 first-order equations.

5. SIR term $0.0002SI$ with $S=900,I=10$ gives nonlinear rate $1.8$.

6. $y'+5y=u$ has time constant $1/5=0.2$.



### `math-03-03` — Solutions and initial conditions  · deepen derivation

**Connections (§1).**

> This lesson connects families of antiderivatives and constants of integration to solutions and initial conditions. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for initial-value problems throughout the section, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A differential equation usually gives a family of curves. An initial condition anchors the family at one point, turning a general solution into a specific prediction. The concrete gap is that a rate law alone leaves many possible curves.
> 
> The load-bearing idea is that the initial condition selects the one curve that passes through the starting point. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Start with $y'=2x$ — the rate law names the derivative. 2. Integrate: $y=x^2+C$ — antiderivatives differ by constants. 3. Apply $y(1)=5$: $5=1+C$ — the chosen curve must pass through the point. 4. Solve $C=4$ — subtract the known value. 5. State $y=x^2+4$ — this member of the family satisfies both the ODE and the initial condition.


**Symbols.** $x_0$ is the starting input; $y_0$ is the starting value; $C$ selects one solution; an interval of validity is where the formula satisfies the equation.


**Real-World Applications (§5).**

1. $T'=0.1T$ with starts 10 and 20 gives solutions that remain in ratio $2$.

2. $w'=-0.5w$, $w(0)=8$ gives $w(4)\approx1.08$.

3. $V=Ce^{-t/5}$, $V(0)=12$ gives $V(10)\approx1.62$.

4. $I'=0.2I$, $I(0)=50$ gives $I(7)\approx202.76$.

5. $z'=-z$, $z(0)=0.6$ gives $z(2)\approx0.0812$.

6. $x'=2$, $x(0)=5$ gives $x(3)=11$.



### `math-03-04` — Direction fields  · explain-only

**Connections (§1).**

> This lesson connects derivatives as slopes of tangent lines to direction fields. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for equilibria, phase planes, and numerical stepping, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A direction field draws the slope required by $y'=f(x,y)$ at many points. A solution curve is a path whose tangent follows those local line segments. The concrete gap is that some ODEs are easier to understand visually than symbolically.
> 
> The load-bearing idea is that a grid of local slopes shows the motion a solution must follow. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

Explain-only: the lesson is a construction. For each grid point $(x,y)$, compute the number $f(x,y)$, draw a short segment with that slope, and read horizontal segments where $f=0$ as possible equilibria or turning levels.


**Symbols.** $f(x,y)$ is the slope rule; $(x,y)$ is a point in the plane; slope $0$ means a horizontal tangent; undefined $f$ means no segment is drawn there.


**Real-World Applications (§5).**

1. For $y'=x-y$, slopes at $(0,0),(1,0),(1,2),(2,2)$ are $0,1,-1,0$.

2. Euler at $(0,1)$ with $h=0.1$ for $y'=x-y$ changes by $-0.1$.

3. Logistic slope $0.2P(1-P/1000)$ is $50$ at $P=500$ and $-48$ at $P=1200$.

4. $w'=-2w$ gives slopes $-4,0,4$ at $w=2,0,-2$.

5. $y'=5-y$ gives slopes $2$ at $y=3$ and $-2$ at $y=7$.

6. $Q'=80-0.5Q$ balances at $Q=160$.



### `math-03-05` — Separable equations  · full-depth model entry

**Connections (§1).**
> This lesson builds on two familiar ideas: derivatives as rates of change, and antiderivatives as the way to recover a function from its rate. A separable equation is the first major ODE-solving method where those two ideas work together. The equation gives a rate law, and the special separable form lets each variable move to its own side before integration.
>
> This method leads directly into many later lessons. Logistic growth, Newton cooling, several first-order models, Bernoulli substitutions, and homogeneous substitutions all use separation either directly or after a change of variables. Learning the method carefully also builds the habit that matters throughout ODEs: check where division is allowed, integrate both sides, and use the initial condition only after the general relationship is found.

**Motivation & Intuition (§2).**
> A differential equation such as $y'=xy$ says that the slope depends on both the input $x$ and the current value $y$. That can seem harder than a plain antiderivative because the unknown function appears on the right side too. The separable structure is what makes this example manageable: the right side is a product of one factor involving $x$ and one factor involving $y$.
>
> Separation uses that product structure. We divide by the $y$ factor, place the $x$ factor with $dx$, and integrate. The result is not a shortcut around calculus; it is the chain rule in reverse. After integration, the constant of integration represents the whole family of solution curves, and the initial condition chooses the one curve that passes through the starting point.

**Definition & Assumptions (§3).** Display
$$
\frac{dy}{dx}=g(x)h(y).
$$
Then derive the method and solve $\dfrac{dy}{dx}=xy$, $y(0)=2$:
1. Start with $\dfrac{dy}{dx}=g(x)h(y)$ — the right side factors into an $x$ part and a $y$ part.
2. Divide by $h(y)$ where $h(y)\ne0$: $\dfrac{1}{h(y)}\dfrac{dy}{dx}=g(x)$ — this isolates the unknown-function factor.
3. Multiply by $dx$: $\dfrac{1}{h(y)}\,dy=g(x)\,dx$ — this is shorthand for the chain-rule-backed differential relationship.
4. Integrate both sides: $\int \dfrac{1}{h(y)}\,dy=\int g(x)\,dx+C$ — each side now has one variable.
5. For $y'=xy$, divide by $y$: $\dfrac{1}{y}\,dy=x\,dx$ — this is valid away from $y=0$, and the initial value $2$ keeps this solution nonzero near $0$.
6. Integrate: $\ln|y|=x^2/2+C$ — the left antiderivative is logarithmic.
7. Exponentiate: $|y|=e^C e^{x^2/2}$ — exponentials undo logarithms.
8. Absorb sign and $e^C$ into one nonzero constant: $y=Ce^{x^2/2}$ — the constant carries the branch.
9. Apply $y(0)=2$: $2=Ce^0=C$ — the initial value fixes the curve.
10. The solution is $y=2e^{x^2/2}$ — differentiating gives $y'=2xe^{x^2/2}=xy$, so the equation and initial value both check.

**Symbols.** $x$ is the independent variable; $y(x)$ is the unknown dependent function; $g(x)$ is the factor depending only on $x$; $h(y)$ is the factor depending only on $y$; $C$ is the integration constant; $dy$ and $dx$ mark the variables being integrated after separation.

**Real-World Applications (§5).**
1. **Exponential growth** — $P'=0.3P$, $P(0)=100$ separates to $P=100e^{0.3t}$, so $P(5)=100e^{1.5}\approx448.17$.
2. **Radioactive half-life** — $A'=-0.02A$ gives $A=A_0e^{-0.02t}$; setting $A/A_0=0.5$ gives $t=\ln2/0.02\approx34.66$.
3. **Logistic growth rate** — $P'=0.1P(1-P/1000)$ is separable; at $P=200$ the instantaneous rate is $0.1\cdot200\cdot0.8=16$.
4. **Gradient flow for a quadratic** — $w'=-0.5w$ gives $w=20e^{-0.5t}$ from $w(0)=20$, so $w(6)=20e^{-3}\approx0.996$.
5. **Newton cooling** — $T'=-0.1(T-20)$ gives $T=20+50e^{-0.1t}$ from $T(0)=70$, so $T(10)\approx38.39^\circ$.
6. **Memory-score decay** — $s'=-0.7s$, $s(0)=1$ gives $s(3)=e^{-2.1}\approx0.122$.

### `math-03-06` — Linear first-order equations  · AUTHOR derivation

**Connections (§1).**

> This lesson connects exponential decay and relaxation toward a target to linear first-order equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for cooling, circuits, queues, and smoothing models, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A linear first-order equation lets $y$ and $y'$ appear only to the first power. With constant coefficients, it describes relaxation toward an equilibrium set by the forcing. The concrete gap is that the forcing term hides the simple decay variable.
> 
> The load-bearing idea is that subtracting the equilibrium exposes exponential decay of the deviation. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

Solve $y'+ay=b$: 1. Find equilibrium by setting $y'=0$: $ay_*=b$ — a constant solution has no rate. 2. Get $y_*=b/a$ — divide by the coefficient. 3. Define $u=y-y_*$ — measure distance from equilibrium. 4. Differentiate: $u'=y'$ — the equilibrium is constant. 5. Substitute into the ODE: $u'+a u=0$ — the forcing cancels. 6. Separate: $du/u=-a\,dx$ — this is proportional decay. 7. Integrate to get $u=Ce^{-ax}$ — distance decays exponentially. 8. Therefore $y=b/a+Ce^{-ax}$. For $y'+2y=6$, $y(0)=1$, get $y=3-2e^{-2x}$.


**Symbols.** $p(x)$ is the coefficient of $y$ in standard form; $q(x)$ is forcing; $a,b$ are constants; $y_*$ is equilibrium; $u$ is deviation from equilibrium.


**Real-World Applications (§5).**

1. Cooling $T'+0.2T=4$, $T(0)=80$ gives $T=20+60e^{-0.2t}$ and $T(10)\approx28.12$.

2. Exponential smoothing $m'+5m=50$ has target $10$ and time constant $0.2$.

3. RC charging $V'+2V=10$, $V(0)=0$ gives $V(1)\approx4.32$.

4. Regularized flow $w'+3w=6$ tends to $2$.

5. Queue $Q'+0.1Q=50$ balances at $500$.

6. $x'+0.4x=2$ has half-life $\ln2/0.4\approx1.73$.



### `math-03-07` — Integrating factors  · deepen derivation · FIX LaTeX

**Connections (§1).**

> This lesson connects the product rule from calculus to integrating factors. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for variable-coefficient first-order linear equations, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> An integrating factor is a multiplier chosen so the left side of a linear equation becomes one product derivative. It extends the first-order linear method to variable coefficients. The concrete gap is that the left side is almost, but not yet, one derivative.
> 
> The load-bearing idea is that a multiplier is chosen so the product rule matches exactly. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Start with $y'+p(x)y=q(x)$ — standard linear form. 2. Multiply by an unknown $\mu(x)$: $\mu y'+\mu p y=\mu q$ — seek a product-rule pattern. 3. Compare with $(\mu y)'=\mu y'+\mu' y$ — the first term already matches. 4. Require $\mu'=p\mu$ — this makes the $y$ coefficients equal. 5. Separate $d\mu/\mu=p(x)\,dx$ — solve the multiplier equation. 6. Integrate: $\mu=e^{\int p(x)dx}$ — exponentials undo the logarithm. 7. Then $(\mu y)'=\mu q$ — the ODE has become one derivative. 8. Integrate: $\mu y=\int \mu q\,dx+C$. For $y'+3y=e^{-x}$, $\mu=e^{3x}$ and $y=\tfrac12(e^{-x}-e^{-3x})$.


**Symbols.** $\mu(x)$ is the integrating factor; $p(x)$ and $q(x)$ are known functions; $C$ is the integration constant. LaTeX fix: close the worked-step result as `$(e^{4x}y)'=8$`.


**Real-World Applications (§5).**

1. $y'+y=t$ gives $y=t-1+Ce^{-t}$.

2. $m'+2m=2t$ gives $m=t-0.5+Ce^{-2t}$.

3. $C'+0.3C=6$ has steady value $20$.

4. $V'+5V=10e^{-t}$ has particular term $2.5e^{-t}$.

5. $h'+h=0.9$, $h(0)=0.1$ gives $h(2)\approx0.792$.

6. $m'+10m=10g$, $g=0.4$ tends to $0.4$ with time constant $0.1$.



### `math-03-08` — Exact equations  · AUTHOR derivation

**Connections (§1).**

> This lesson connects partial derivatives and level curves to exact equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for conservative fields and energy-like implicit solutions, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> An exact equation is a hidden total differential. Once the potential function is recovered, solutions are level curves of that potential. The concrete gap is that the equation may not solve cleanly for y as a function of x.
> 
> The load-bearing idea is that a potential function turns the solution into a level curve. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $(2xy+3)dx+(x^2+4y)dy=0$: 1. Set $M=2xy+3$, $N=x^2+4y$ — identify the differential coefficients. 2. Compute $M_y=2x$ — differentiate $M$ with respect to $y$. 3. Compute $N_x=2x$ — differentiate $N$ with respect to $x$. 4. Since $M_y=N_x$, seek $F$ with $F_x=M$, $F_y=N$. 5. Integrate $M$ in $x$: $F=x^2y+3x+\phi(y)$ — the missing part may depend on $y$. 6. Differentiate in $y$: $F_y=x^2+\phi'(y)$ — match $N$. 7. Set $x^2+\phi'(y)=x^2+4y$, so $\phi'=4y$. 8. Integrate $\phi=2y^2$. 9. Solutions satisfy $F=x^2y+3x+2y^2=C$.


**Symbols.** $M,N$ are coefficient functions; $F$ is the potential; $F_x,F_y$ are partial derivatives; $C$ labels a level curve.


**Real-World Applications (§5).**

1. $F=x^2+y^2=25$ gives radius $5$.

2. $F=w^2+b^2=1$ keeps $(w,b)$ on a unit circle.

3. $F=x^2+y^2-9=0$ gives radius $3$.

4. Field $(2x,2y)$ has potential $x^2+y^2$.

5. $dF=3T^2dT+2VdV$ gives $F=T^3+V^2+C$.

6. Potential change from $(1,2)$ to $(3,4)$ for $F=x^2+y^2$ is $25-5=20$.



### `math-03-09` — Bernoulli equations  · deepen derivation

**Connections (§1).**

> This lesson connects linear first-order equations and substitutions to bernoulli equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for more nonlinear first-order models, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A Bernoulli equation is nonlinear in $y$, but the power is organized enough that one substitution turns it into a linear first-order equation. The concrete gap is that the equation is nonlinear in y but has one organized power.
> 
> The load-bearing idea is that the substitution y^(1-n) converts the problem to a linear one. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Start with $y'+p(x)y=q(x)y^n$, $n\ne0,1$ — the nonlinear term is a single power. 2. Divide by $y^n$: $y^{-n}y'+p y^{1-n}=q$ — put powers where one substitution can reach them. 3. Set $v=y^{1-n}$ — this is the power already present. 4. Differentiate: $v'=(1-n)y^{-n}y'$ — chain rule. 5. Replace $y^{-n}y'$ by $v'/(1-n)$ and $y^{1-n}$ by $v$. 6. Multiply by $1-n$ to get $v'+(1-n)p v=(1-n)q$ — linear in $v$. For $y'+y=xy^2$, $v=1/y$ gives $v'-v=-x$ and $y=1/(x+2e^x+1)$ from $y(0)=1/3$.


**Symbols.** $n$ is the nonlinear power; $v$ is the transformed dependent variable; $p,q$ are known functions; $y=0$ must be checked separately when division is used.


**Real-World Applications (§5).**

1. $y'+y=y^2$ gives $v'-v=-1$.

2. $v'+0.2v=0.01v^2$ with $u=1/v$ gives $u'-0.2u=-0.01$.

3. $a'+a=0.5a^2$, $a(0)=1$ gives $a(2)=1/(0.5+0.5e^2)\approx0.238$.

4. $c'+2c=tc^2$ gives $v'-2v=-t$.

5. $I'-I=I^2$ gives $1/I=-1+Ce^{-t}$.

6. $y'+y=y^2$, $y(0)=0.5$ gives $y(1)=1/(1+e)\approx0.269$.



### `math-03-10` — Homogeneous substitutions  · deepen derivation

**Connections (§1).**

> This lesson connects ratios, scaling, and product-rule differentiation to homogeneous substitutions. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for more change-of-variable methods, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> When the slope depends only on the ratio $y/x$, the curve's scale matters less than its shape from the origin. The substitution $v=y/x$ tracks that ratio directly. The concrete gap is that the slope depends on position only through y/x.
> 
> The load-bearing idea is that tracking the ratio y/x removes the scale from the equation. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

Solve $y'=1+y/x$, $y(1)=2$: 1. Set $v=y/x$ — the right side depends on this ratio. 2. Rewrite $y=vx$ — return to the original variable. 3. Differentiate: $y'=v+xv'$ — product rule. 4. Substitute: $v+xv'=1+v$ — replace the ODE. 5. Cancel $v$: $xv'=1$ — the equation is separable. 6. Divide: $dv=dx/x$ — separate variables. 7. Integrate: $v=\ln|x|+C$ — logarithm appears. 8. Return to $y$: $y=x(\ln|x|+C)$. 9. Use $y(1)=2$ to get $C=2$.


**Symbols.** $v$ is the ratio $y/x$; $x\ne0$ on the interval; $F(y/x)$ is the ratio-only slope rule; $C$ is the integration constant.


**Real-World Applications (§5).**

1. $y'=y/x$ gives $y=Ax$ and constant ratio $A$.

2. At $(4,2)$, $y/x=0.5$, so $y'=1.5$ for $y'=1+y/x$.

3. $(2,4)$ and $(10,20)$ both have ratio $2$.

4. On ray $y=3x$, $y'=4$ for $1+y/x$.

5. Doubling $(3,6)$ to $(6,12)$ keeps ratio $2$.

6. Threshold $y/x>0.8$ is true for $(5,4.5)$ and $(50,45)$ because both ratios are $0.9$.



### `math-03-11` — Modeling with first-order ODEs  · AUTHOR derivation

**Connections (§1).**

> This lesson connects solved first-order equations and units for rates to modeling with first-order odes. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for building usable models before solving them, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Modeling means translating a story about change into a rate law with units that match. The mathematics starts only after the state variable, rate, constant, and initial condition are named. The concrete gap is that the story must be translated before algebra can begin.
> 
> The load-bearing idea is that naming the state, target, rate constant, and initial condition creates the ODE. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For Newton cooling: 1. Choose state $T(t)$ — the temperature changes over time. 2. Identify ambient temperature $20$ — the gap is $T-20$. 3. State proportional cooling: $T'=-k(T-20)$ — hotter objects cool faster toward the room. 4. Use $k=0.2$ and $T(0)=80$ — units are per minute. 5. Separate: $d(T-20)/(T-20)=-0.2dt$ — the gap decays. 6. Integrate to get $T-20=Ce^{-0.2t}$. 7. Use $C=60$ from $T(0)=80$. 8. Compute $T(5)=20+60e^{-1}\approx42.07$.


**Symbols.** $T$ is the state; $t$ is time; $k$ is a rate constant with units $1/$time; ambient temperature is the target; the initial condition fixes the starting gap.


**Real-World Applications (§5).**

1. Cooling gap $60$ with $k=0.2$ cools initially at $12^\circ$/min.

2. Tank inflow $12$ g/min and outflow $S/25$ balance at $S=300$ g.

3. Queue $Q'=90-0.3Q$ at $Q=100$ gives $60$ jobs/min.

4. For $J=0.2(w-5)^2$, $w'=-0.4(w-5)$ moves $w=1$ at rate $1.6$.

5. Logistic $0.5P(1-P/1000)$ at $P=500$ gives $125$.

6. Smoothing $m'=0.2(70-50)$ gives $4$ units/min.



### `math-03-12` — The existence–uniqueness theorem  · explain-only

**Connections (§1).**

> This lesson connects slope fields and initial conditions to the existence–uniqueness theorem. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for knowing when an IVP is well posed, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Existence says a solution starts at the initial point. Uniqueness says there is not a second solution curve passing through the same point under the same well-behaved slope rule. The concrete gap is that a drawn slope field can suggest paths but not guarantee a single one.
> 
> The load-bearing idea is that continuity and controlled y-dependence give local existence and uniqueness. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

Explain-only: this lesson states a theorem whose proof is beyond the section's solving toolkit. Explain the hypotheses through slope-field behavior: continuity gives slopes to follow, and controlled dependence on $y$ prevents two nearby curves from splitting through one initial point.


**Symbols.** $f(x,y)$ is the slope field; $f_y$ measures slope sensitivity to $y$; $(x_0,y_0)$ is the initial point; the guaranteed interval is local.


**Real-World Applications (§5).**

1. For $y'=xy$, $f_y=x$ is continuous, so the path through $(1,2)$ is unique locally.

2. For $y'=x+y$, $f_y=1$ gives no crossings in the region.

3. $y'=1/(y-2)$ fails at $y(0)=2$ because the slope is undefined.

4. $y'=\sqrt{|y|}$, $y(0)=0$ has nonunique delayed-start behavior.

5. A Neural ODE field with state derivative bounded by $3$ is locally controlled.

6. $v'=-0.1v$, $v(0)=20$ gives one trajectory $20e^{-0.1t}$.



### `math-03-13` — Second-order linear ODE theory  · AUTHOR derivation

**Connections (§1).**

> This lesson connects linear combinations and two initial data values to second-order linear ode theory. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for the theory behind second-order homogeneous solutions, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A second-order linear homogeneous equation has a two-dimensional solution space. Two independent solutions are enough because two initial values determine the two constants. The concrete gap is that one solution is not enough for a second-order equation.
> 
> The load-bearing idea is that two independent modes span the solution family. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $y''+y'-2y=0$ with $y_1=e^t$, $y_2=e^{-2t}$: 1. Verify each solves the equation — substitution gives zero. 2. Compute $W=y_1y_2'-y_1'y_2=-3e^{-t}$ — nonzero means independence. 3. Write $y=C_1e^t+C_2e^{-2t}$ — linearity allows combinations. 4. Apply $y(0)=3$: $C_1+C_2=3$. 5. Differentiate: $y'=C_1e^t-2C_2e^{-2t}$. 6. Apply $y'(0)=0$: $C_1-2C_2=0$. 7. Solve to get $C_1=2$, $C_2=1$, so $y=2e^t+e^{-2t}$.


**Symbols.** $a_2,a_1,a_0$ are coefficient functions; $g$ is forcing; $W$ is the Wronskian; $C_1,C_2$ are constants set by position and velocity.


**Real-World Applications (§5).**

1. $x''+4x=0$, $x(0)=3$, $x'(0)=0$ gives $x=3\cos2t$ and $x(\pi/4)=0$.

2. $q=2e^{-t}+e^{-3t}$ gives $q(0)=3$, $q'(0)=-5$.

3. Error mode $10e^{-0.5t}$ gives $1.35$ at $t=4$.

4. $5e^{-2t}$ gives angle $0.677^\circ$ at $t=1$.

5. $6e^{-t}-2e^{-2t}$ gives $0.775$ at $t=2$.

6. $0.7e^{-3}+0.3e^{-9}\approx0.0350$ at $t=1$.



### `math-03-14` — Constant-coefficient homogeneous equations  · deepen derivation

**Connections (§1).**

> This lesson connects exponential solutions from first-order equations to constant-coefficient homogeneous equations. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for constant-coefficient linear ODEs of higher order, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Constant coefficients make exponentials natural because derivatives of $e^{rt}$ only multiply by powers of $r$. The ODE becomes a polynomial equation for the growth or decay rates. The concrete gap is that differentiation of a general function is hard to predict.
> 
> The load-bearing idea is that exponentials turn derivatives into powers of a rate r. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Start with $ay''+by'+cy=0$ — coefficients are constants. 2. Try $y=e^{rt}$ — exponentials keep their shape under differentiation. 3. Compute $y'=re^{rt}$ and $y''=r^2e^{rt}$. 4. Substitute: $(ar^2+br+c)e^{rt}=0$. 5. Since $e^{rt}\ne0$, set $ar^2+br+c=0$ — the characteristic equation. 6. Distinct roots give independent modes $e^{r_1t},e^{r_2t}$. 7. For $y''-3y'+2y=0$, roots are $1,2$. 8. Apply $y(0)=5$, $y'(0)=8$ to $C_1+C_2=5$, $C_1+2C_2=8$, giving $C_1=2$, $C_2=3$ and $y=2e^t+3e^{2t}$.


**Symbols.** $r$ is a characteristic root; $a,b,c$ are constants; $C_i$ are mode weights; complex roots $\alpha\pm i\beta$ produce $e^{\alpha t}\cos\beta t$ and $e^{\alpha t}\sin\beta t$.


**Real-World Applications (§5).**

1. $r^2+6r+8=0$ gives modes $e^{-2t},e^{-4t}$; at $t=1$ they are $0.135,0.0183$.

2. Pole $-50$ has time constant $0.02$s and four-time-constant settling about $0.08$s.

3. Mode $e^{-0.2t}$ keeps $0.135$ after $10$ units.

4. Roots $-3\pm40i$ oscillate at $40/(2\pi)\approx6.37$ Hz.

5. $100e^{-3}+20e^{-15}\approx4.98$ for queue recovery at $t=3$.

6. Euler multiplier $0.5$ for $y'=-10y$, $h=0.05$ gives $0.5^{10}\approx0.00098$.



### `math-03-15` — Method of undetermined coefficients  · deepen derivation

**Connections (§1).**

> This lesson connects homogeneous modes and standard forcing shapes to method of undetermined coefficients. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for nonhomogeneous constant-coefficient equations, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> When forcing has a standard shape, a matching trial form turns a nonhomogeneous constant-coefficient ODE into algebra. The concrete gap is that the natural modes do not include the forced response.
> 
> The load-bearing idea is that a matching trial form reduces the particular solution to algebra. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $y''-3y'+2y=e^{3t}$: 1. Solve the homogeneous characteristic equation $r^2-3r+2=0$ — roots $1,2$ give natural modes. 2. Since $e^{3t}$ is not a natural mode, try $y_p=Ae^{3t}$ — match the forcing shape. 3. Compute $y_p'=3Ae^{3t}$ and $y_p''=9Ae^{3t}$. 4. Substitute: $(9A-9A+2A)e^{3t}=e^{3t}$ — collect coefficients. 5. Solve $2A=1$, so $A=1/2$. 6. The full solution is $C_1e^t+C_2e^{2t}+\tfrac12e^{3t}$.


**Symbols.** $L$ is the linear differential operator; $y_h$ is homogeneous solution; $y_p$ is one particular solution; $A$ is an unknown trial coefficient.


**Real-World Applications (§5).**

1. $x''+4x=8\cos t$ has particular amplitude $8/(4-1)=8/3\approx2.67$.

2. $T'+0.5T=10$ has constant particular value $20$.

3. $y'+y=2t$ gives trial $At+B$ and $y_p=2t-2$.

4. $y''+9y=5\cos2t$ gives amplitude $1$.

5. $m'+3m=e^{-t}$ gives $m_p=0.5e^{-t}$.

6. $q'+4q=12$ has $q_p=3$.



### `math-03-16` — Variation of parameters  · AUTHOR derivation

**Connections (§1).**

> This lesson connects homogeneous solution bases and the Wronskian to variation of parameters. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for a systematic method for arbitrary forcing, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Variation of parameters keeps the homogeneous solutions but lets their coefficients become functions. It replaces guessing a forcing shape with a systematic integral recipe. The concrete gap is that guessing a trial form only works for selected inputs.
> 
> The load-bearing idea is that letting the mode weights vary produces integral formulas. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $y''+p(t)y'+q(t)y=g(t)$: 1. Start with homogeneous solutions $y_1,y_2$ — they span natural motion. 2. Try $y_p=u_1y_1+u_2y_2$ — let weights vary. 3. Impose $u_1'y_1+u_2'y_2=0$ — this removes second-derivative clutter. 4. Differentiate and substitute into the ODE — homogeneous terms cancel. 5. The remaining condition is $u_1'y_1'+u_2'y_2'=g$. 6. Solve the $2\times2$ system to get $u_1'=-y_2g/W$, $u_2'=y_1g/W$. 7. Integrate $u_1',u_2'$. For $y''+y=e^t$, $y_1=\cos t$, $y_2=\sin t$, $W=1$, and a particular solution is $e^t/2$.


**Symbols.** $u_1,u_2$ are varying coefficients; $W=y_1y_2'-y_1'y_2$ is the Wronskian; $g(t)$ is forcing; standard form has leading coefficient $1$.


**Real-World Applications (§5).**

1. If $g=2e^t$ in $y''+y=g$, the particular solution is $e^t$.

2. Zero-state $y''+y=1$ gives $y=1-\cos t$.

3. $y''+y=t$ has particular $y_p=t$.

4. $y''+4y=3\cos t$ gives response $\cos t$.

5. $y'+5y=0.2$ has steady value $0.04$.

6. $z'+0.4z=8$ has steady target $20$.



### `math-03-17` — Forced oscillations and resonance  · AUTHOR derivation

**Connections (§1).**

> This lesson connects second-order oscillators and sinusoidal forcing to forced oscillations and resonance. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for resonance, filters, sensors, and vibration models, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A sinusoidal force produces a sinusoidal response whose amplitude depends on the gap between forcing frequency and natural frequency. Resonance is the limiting case where that gap vanishes in the undamped model. The concrete gap is that forcing frequency may compete with a system natural frequency.
> 
> The load-bearing idea is that substitution shows how the frequency gap controls amplitude. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $x''+\omega_0^2x=F_0\cos\omega t$: 1. Try $x_p=A\cos\omega t$ — forcing is cosine. 2. Compute $x_p''=-A\omega^2\cos\omega t$. 3. Substitute: $A(\omega_0^2-\omega^2)\cos\omega t=F_0\cos\omega t$. 4. Match coefficients: $A=F_0/(\omega_0^2-\omega^2)$ when $\omega\ne\omega_0$. 5. If $\omega=\omega_0$, the trial overlaps the homogeneous mode — multiply by $t$ and get growing resonant form. 6. For $x''+4x=3\cos t$, $A=3/(4-1)=1$.


**Symbols.** $m,c,k$ are mass, damping, stiffness; $F_0$ is forcing amplitude; $\omega$ is forcing angular frequency; $\omega_0$ is natural frequency; $A$ is response amplitude.


**Real-World Applications (§5).**

1. Bridge mode $2.0$ Hz and forcing $1.9$ Hz differ by $5\%$.

2. Bandwidth $0.5$ MHz selects $64$ MHz and attenuates $63$ MHz if centered tightly.

3. Equalizer with center $1000$ Hz and $Q=10$ has bandwidth $100$ Hz.

4. Envelope $e^{-0.1t}$ leaves $0.368$ at $t=10$ and $0.0067$ at $t=50$.

5. Period $10$ min has angular frequency $2\pi/10\approx0.628$ rad/min.

6. Sensor ratio $20/200=0.1$ is well below natural frequency.



### `math-03-18` — Higher-order linear ODEs  · AUTHOR derivation

**Connections (§1).**

> This lesson connects constant-coefficient characteristic equations to higher-order linear odes. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for higher-order dynamics and repeated modes, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> An $n$th-order linear equation needs $n$ independent constants. Constant coefficients turn the search for those modes into an $n$th-degree characteristic polynomial. The concrete gap is that more stored derivative data requires more constants.
> 
> The load-bearing idea is that an nth-degree characteristic polynomial supplies the needed modes. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $y'''-6y''+11y'-6y=0$: 1. Try $y=e^{rt}$ — derivatives become powers of $r$. 2. Substitute to get $(r^3-6r^2+11r-6)e^{rt}=0$. 3. Set characteristic polynomial $r^3-6r^2+11r-6=0$. 4. Factor $(r-1)(r-2)(r-3)=0$ — roots are $1,2,3$. 5. Write $y=C_1e^t+C_2e^{2t}+C_3e^{3t}$. 6. Use $y(0)=6$, $y'(0)=14$, $y''(0)=36$ to solve $C_1+C_2+C_3=6$, $C_1+2C_2+3C_3=14$, $C_1+4C_2+9C_3=36$. 7. The constants are $1,2,3$.


**Symbols.** $y^{(n)}$ is the $n$th derivative; $a_n$ is the leading coefficient; root multiplicity $m$ contributes $t^0e^{rt}$ through $t^{m-1}e^{rt}$.


**Real-World Applications (§5).**

1. Beam deflection scaling $L^4$ means doubling length multiplies deflection by $16$.

2. Fourth-order filter rolloff is about $80$ dB per decade.

3. Four identical decay stages with rate $2$ give repeated root $-2$ and modes through $t^3e^{-2t}$.

4. A cubic spline segment has four coefficients.

5. Slow pole $-0.5$ gives settling about $4/0.5=8$s.

6. Discrete root $0.9$ keeps $0.9^{20}\approx0.122$.



### `math-03-19` — Systems of first-order ODEs  · AUTHOR derivation

**Connections (§1).**

> This lesson connects position-velocity state descriptions to systems of first-order odes. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for matrix methods and phase-plane analysis, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A system tracks several changing quantities at once. Rewriting higher-order scalar equations as first-order systems puts all needed memory into one state vector. The concrete gap is that a higher-order scalar equation carries hidden memory.
> 
> The load-bearing idea is that a state vector stores all variables needed for first-order evolution. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $y''+3y'+2y=0$: 1. Set $x_1=y$ — first state is position. 2. Set $x_2=y'$ — second state stores velocity. 3. Differentiate $x_1'=y'=x_2$. 4. Solve the ODE for $y''=-3y'-2y$. 5. Substitute states: $x_2'=-2x_1-3x_2$. 6. Write vector form $x'=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}x$. 7. Initial data $y(0)=3$, $y'(0)=0$ becomes $x(0)=(3,0)$.


**Symbols.** $\mathbf{x}$ is the state vector; $\mathbf{f}$ is the vector field; $A$ is a system matrix; $\mathbf{b}(t)$ is forcing.


**Real-World Applications (§5).**

1. SIR $S'=-0.002SI$ with $S=900,I=10$ gives $-18$.

2. Predator-prey $x'=0.5x-0.02xy$ at $(40,10)$ gives $12$.

3. Momentum state $v'=-0.1v-2x$ at $(x,v)=(3,4)$ gives $-6.4$.

4. Reaction $A\to B$ at rate $0.3A$, $A=50$, gives $A'=-15$, $B'=15$.

5. State $(x,v)=(2,-1)$ has $x'=-1$.

6. Interest $i'=0.4c-0.1i$ with $c=5,i=8$ gives $1.2$.



### `math-03-20` — The matrix exponential  · deepen derivation

**Connections (§1).**

> This lesson connects the scalar exponential solution of x prime equals ax to the matrix exponential. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for linear systems with constant matrices, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> The matrix exponential is the flow map for a constant linear system. It generalizes $x(t)=e^{at}x(0)$ from one scalar rate to a whole matrix of coupled rates. The concrete gap is that coupled coordinates cannot be advanced by a scalar factor.
> 
> The load-bearing idea is that the matrix exponential is the state-transition map. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Define $e^{At}=I+At+(At)^2/2!+\cdots$ — use the same power series as the scalar exponential. 2. Differentiate term by term — convergence permits this for finite matrices. 3. The derivative is $A+A^2t+A^3t^2/2!+\cdots=Ae^{At}$. 4. Let $x(t)=e^{At}x_0$. 5. Then $x'=Ae^{At}x_0=Ax(t)$ — it satisfies the system. 6. At $t=0$, $e^{A0}=I$, so $x(0)=x_0$. 7. For diagonal $A=\operatorname{diag}(2,-1)$, $e^{At}=\operatorname{diag}(e^{2t},e^{-t})$.


**Symbols.** $A$ is a constant square matrix; $I$ is the identity; $x_0$ is the initial state; $e^{At}$ is the state-transition matrix.


**Real-World Applications (§5).**

1. Mode rate $-4$ over $0.5$s multiplies by $e^{-2}\approx0.135$.

2. Leaving rate $0.2$ over $5$ units gives stay factor $e^{-1}\approx0.368$.

3. Stable eigenvalue $-0.1$ over depth $20$ gives $0.135$.

4. Angular speed $\pi/2$ for $2$s gives angle $\pi$, or $180^\circ$.

5. Damping $-0.5$ over $0.1$s gives factor $e^{-0.05}\approx0.951$.

6. Growth rate $0.08$ for $30$ days gives factor $e^{2.4}\approx11.02$.



### `math-03-21` — Eigenvalue methods for systems  · AUTHOR derivation

**Connections (§1).**

> This lesson connects eigenvectors and scalar exponential growth to eigenvalue methods for systems. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for modal solutions for coupled systems, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Eigenvectors find directions where a coupled linear system behaves like a scalar exponential. In those coordinates, each mode grows or decays by its own eigenvalue. The concrete gap is that a matrix can mix coordinates in ordinary axes.
> 
> The load-bearing idea is that eigenvector coordinates separate the system into scalar modes. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $x'=Ax$: 1. Suppose $Av=\lambda v$ — $v$ is an eigenvector. 2. Try $x(t)=Ce^{\lambda t}v$ — scalar exponential along that direction. 3. Differentiate: $x'=C\lambda e^{\lambda t}v$. 4. Apply $A$: $Ax=Ce^{\lambda t}Av=C\lambda e^{\lambda t}v$. 5. The two sides match, so it is a solution. 6. If eigenvectors form a basis, add modes. 7. For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, eigenpairs are $3,(1,1)$ and $1,(1,-1)$; $(4,2)=3(1,1)+1(1,-1)$, so $x(t)=3e^{3t}(1,1)+e^t(1,-1)$.


**Symbols.** $A$ is the system matrix; $v$ is an eigenvector; $\lambda$ is its rate; $PDP^{-1}$ diagonalizes $A$ when enough eigenvectors exist.


**Real-World Applications (§5).**

1. Eigenvalues $-1,-4$ give factors $0.135$ and $0.000335$ at $t=2$.

2. Damping $0.85$ shrinks a mode to $0.85^{10}\approx0.197$.

3. PCA variances $9,1$ give a $9:1$ direction ratio.

4. Difference mode $e^{-0.3t}$ gives $0.050$ after $10$ minutes.

5. Discrete eigenvalue $1.02$ grows to $1.02^{100}\approx7.24$.

6. A $12$ Hz vibration mode completes $12$ cycles per second.



### `math-03-22` — Phase-plane analysis  · AUTHOR derivation

**Connections (§1).**

> This lesson connects systems of first-order equations and vector fields to phase-plane analysis. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for qualitative analysis without closed forms, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> The phase plane shows a two-dimensional autonomous system as arrows in state space. Nullclines and equilibria organize the picture before exact solutions are known. The concrete gap is that time graphs can hide the geometry of a two-state system.
> 
> The load-bearing idea is that arrows, nullclines, and equilibria organize motion in state space. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $x'=y$, $y'=-2x-3y$: 1. Write the vector field $(f,g)=(y,-2x-3y)$ — arrows show instantaneous motion. 2. Find the $x$-nullcline $y=0$ — here horizontal motion is zero. 3. Find the $y$-nullcline $-2x-3y=0$ — here vertical motion is zero. 4. Intersect them at $(0,0)$ — both derivatives vanish. 5. Matrix form is $A=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}$. 6. Eigenvalues solve $r^2+3r+2=0$, so $r=-1,-2$ — trajectories approach the equilibrium along stable directions.


**Symbols.** $x,y$ are state coordinates; nullclines are derivative-zero curves; equilibria are intersections; eigenvalues classify nearby linear behavior.


**Real-World Applications (§5).**

1. Predator-prey at $(40,10)$ gives prey arrow component $12$.

2. Pendulum at angle $0.1$ rad and zero velocity has acceleration about $-0.98$.

3. Gradient $(4,-2)$ with step $0.1$ gives update direction $(-0.4,0.2)$.

4. Epidemic coefficient $0.3S/1000-0.1$ at $S=200$ is $-0.04$.

5. Controller acceleration $-4x-2v$ at $(1,-0.2)$ is $-3.6$.

6. Queue arrow $120-100=20$ points toward larger backlog.



### `math-03-23` — Equilibria and stability  · AUTHOR derivation

**Connections (§1).**

> This lesson connects direction fields and autonomous rate laws to equilibria and stability. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for stability and linearization, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> An equilibrium is a state where the derivative is zero. Stability asks whether small nearby disturbances stay near, return, or move away. The concrete gap is that a zero derivative marks rest but not its durability.
> 
> The load-bearing idea is that nearby arrows decide whether disturbances return or move away. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $y'=y(1-y/10)$: 1. Set $y(1-y/10)=0$ — equilibria make the derivative zero. 2. Solve $y=0$ or $y=10$ — these are stationary states. 3. Test $0<y<10$, for example $y=5$, giving positive derivative $2.5$ — arrows point right. 4. Test $y>10$, for example $y=12$, giving negative derivative $-2.4$ — arrows point left. 5. Near $10$, arrows point toward $10$, so it is stable. 6. Near $0$, positive-side arrows point away, so it is unstable for positive populations.


**Symbols.** $x^*$ or $y^*$ is an equilibrium; stable means nearby solutions remain nearby; asymptotically stable means they approach; unstable means some perturbations move away.


**Real-World Applications (§5).**

1. Logistic with $K=1000$ at $P=900$ grows at $18$.

2. $A'=10-0.5A$ balances at $A=20$.

3. $w'=-2(w-3)$ has half-life $\ln2/2\approx0.347$.

4. $T'=0.1(70-T)$ at $T=65$ gives $0.5$ deg/min.

5. $I'=-0.2I$ gives factor $e^{-2}\approx0.135$ after $10$ days.

6. $s'=1.2s-s^2$ has equilibria $0$ and $1.2$.



### `math-03-24` — Linearization  · deepen derivation

**Connections (§1).**

> This lesson connects Taylor approximation and Jacobian matrices to linearization. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for local stability of nonlinear systems, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Linearization replaces a nonlinear vector field near an equilibrium by its best first-order matrix approximation. The Jacobian carries the local motion. The concrete gap is that a nonlinear field can be too complicated globally.
> 
> The load-bearing idea is that near an equilibrium the first-order matrix part controls local motion. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $x'=x(2-x-y)$, $y'=y(1+x-2y)$ at $(1,1)$: 1. Verify equilibrium: both right sides are $0$. 2. Compute $J=\begin{bmatrix}2-2x-y&-x\\y&1+x-4y\end{bmatrix}$ — partial derivatives of the vector field. 3. Evaluate at $(1,1)$: $J=\begin{bmatrix}-1&-1\\1&-2\end{bmatrix}$. 4. Let $u=(x,y)-(1,1)$ — displacement from equilibrium. 5. Taylor expansion gives $f(x^*+u)=f(x^*)+Ju+O(\|u\|^2)$. 6. Since $f(x^*)=0$, local motion is $u'=Ju$. 7. Eigenvalues solve $\lambda^2+3\lambda+3=0$, with real part $-1.5$, so the linearized equilibrium is locally attracting with spiral behavior.


**Symbols.** $J$ is the Jacobian; $x^*$ is equilibrium; $u$ is perturbation; higher-order terms are smaller near the equilibrium.


**Real-World Applications (§5).**

1. Jacobian pole $-4$ gives settling about $1$s.

2. Growth rate $0.06$/day gives factor $e^{1.8}\approx6.05$ in $30$ days.

3. Curvature $20$ suggests gradient-step size below $0.1$.

4. Eigenvalue $-0.2\pm6i$ has frequency $6/(2\pi)\approx0.955$ Hz.

5. $\sin(0.05)\approx0.05$ with error about $0.00002$.

6. Rate $0.02$/hour gives $e^{0.48}\approx1.62$ in a day.



### `math-03-25` — Series solutions  · deepen derivation

**Connections (§1).**

> This lesson connects Taylor series and coefficient matching to series solutions. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for special functions and local approximation methods, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A power series solves an ODE locally by turning the unknown function into unknown coefficients. The ODE becomes a coefficient-matching rule. The concrete gap is that closed elementary formulas are not always available.
> 
> The load-bearing idea is that the ODE can determine the coefficients of a local power series. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $y'=y$, $y(0)=1$: 1. Assume $y=\sum_{n=0}^\infty a_nx^n$ — local power series. 2. Differentiate: $y'=\sum_{n=1}^\infty n a_nx^{n-1}$. 3. Reindex: $y'=\sum_{n=0}^\infty (n+1)a_{n+1}x^n$. 4. Set $y'=y$ and match powers: $(n+1)a_{n+1}=a_n$. 5. Initial condition gives $a_0=1$. 6. Recurrence gives $a_n=1/n!$. 7. Therefore $y=\sum x^n/n!=e^x$.


**Symbols.** $a_n$ are coefficients; $x_0$ is expansion point; recurrence means each coefficient determines later ones; radius of convergence bounds validity.


**Real-World Applications (§5).**

1. Airy equation $y''-xy=0$ with $a_0=1,a_1=0$ begins $1+x^3/6+\cdots$.

2. $1+0.1+0.1^2/2=1.105$ approximates $e^{0.1}\approx1.10517$.

3. $\sin0.1\approx0.1-0.001/6=0.099833$.

4. Sigmoid approximation $0.5+x/4$ gives $0.55$ at $x=0.2$.

5. For $e^x$ near $0$, variance scale $(f'(0))^2=1$.

6. $\cos0.3\approx1-0.09/2+0.0081/24=0.9553375$.



### `math-03-26` — Special functions  · explain-only

**Connections (§1).**

> This lesson connects series, integrals, and named solution families to special functions. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for Bessel, Legendre, Gamma, and error functions, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Special functions are named solutions that appear too often to treat as failures of elementary algebra. They are standard functions defined by ODEs, integrals, or series. The concrete gap is that important ODE solutions may not be elementary.
> 
> The load-bearing idea is that standard names and defining properties make those solutions usable. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

Explain-only: this lesson introduces a library of named functions and their defining properties. Show how a definition such as Bessel's equation or the Gamma recurrence identifies a function rather than deriving a universal formula.


**Symbols.** $J_0$ is a Bessel function; $P_n$ is a Legendre polynomial; $\Gamma$ is the Gamma function; $\operatorname{erf}$ is the error function; normalization choices are part of each definition.


**Real-World Applications (§5).**

1. $J_0(1)\approx1-1/4+1/64=0.765625$.

2. $P_2(1)=1$ and $P_2(0)=-0.5$.

3. $\Phi(1)\approx0.8413$, so central normal mass is $0.6826$.

4. $\Gamma(3)=2!=2$.

5. Squared-exponential kernel at distance $2$, length $1$, gives $e^{-2}\approx0.135$.

6. Prediction $J_0(0.5)=0.94$ versus three-term $0.93848$ has error $0.00152$.



### `math-03-27` — The Laplace transform  · deepen derivation

**Connections (§1).**

> This lesson connects integration by parts and exponential weighting to the laplace transform. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for Laplace methods for initial-value problems, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> The Laplace transform rewrites a time function as an algebraic function of $s$. Its main value for ODEs is that differentiation becomes multiplication by $s$ plus an initial-value term. The concrete gap is that derivatives complicate time-domain equations.
> 
> The load-bearing idea is that the transform turns differentiation into algebra plus initial data. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Define $F(s)=\int_0^\infty e^{-st}f(t)\,dt$ — exponential weighting measures time behavior. 2. To transform $f'$, integrate $\int_0^\infty e^{-st}f'(t)dt$ by parts. 3. Use $u=e^{-st}$, $dv=f'(t)dt$ — move differentiation from $f$ to the exponential. 4. Boundary term is $[e^{-st}f(t)]_0^\infty=0-f(0)$ when the transform converges. 5. The remaining integral is $s\int_0^\infty e^{-st}f(t)dt=sF(s)$. 6. Therefore $\mathcal L\{f'\}=sF(s)-f(0)$. For $y'+2y=2$, $y(0)=0$, get $(s+2)Y=2/s$, so $Y=2/(s(s+2))$ and $y=1-e^{-2t}$.


**Symbols.** $s$ is the transform variable; $F(s)$ is the transformed function; $\mathcal L$ denotes the transform; region of convergence states where the integral exists.


**Real-World Applications (§5).**

1. Heavy-ball pole with $c=2$ is $-1$ critical damping.

2. EMA memory for $\beta=0.99$ is about $1/(1-0.99)=100$ steps.

3. State-space multiplier $r=0.999$ gives memory about $1000$ steps.

4. Euler stability for $x'=-10x$ needs $h<0.2$.

5. Plant pole moved from $-1$ to $-10$ changes settling from about $4$s to $0.4$s.

6. M/M/1 with $\rho=0.8$ gives $L=4$ and $W=0.5$s when arrivals are $8$/s.



### `math-03-28` — The inverse Laplace transform  · AUTHOR derivation

**Connections (§1).**

> This lesson connects partial fractions and transform tables to the inverse laplace transform. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for returning algebraic Laplace answers to time, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> The inverse Laplace transform turns algebraic pieces in $s$ back into time-domain modes. Partial fractions separate those modes. The concrete gap is that an s-domain formula is not yet a time prediction.
> 
> The load-bearing idea is that simple pole pieces invert to individual time-domain modes. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $(5s+7)/((s+1)(s+3))$: 1. Write $F=A/(s+1)+B/(s+3)$ — simple poles correspond to exponentials. 2. Combine: $A(s+3)+B(s+1)=5s+7$. 3. Match coefficients: $A+B=5$ and $3A+B=7$. 4. Subtract to get $2A=2$, so $A=1$. 5. Then $B=4$. 6. Use the table $\mathcal L^{-1}\{1/(s+a)\}=e^{-at}$. 7. The inverse is $e^{-t}+4e^{-3t}$.


**Symbols.** $F(s)$ is the algebraic transform; $f(t)$ is the time function; poles are denominator roots; residues $A,B$ are mode weights.


**Real-World Applications (§5).**

1. $4/(s+4)$ gives $4e^{-4t}$ and value $0.541$ at $t=0.5$.

2. $5/(s+2)$ gives $5e^{-2t}$ and $0.677$ at $t=1$.

3. $1/(s+1)+2/(s+5)$ gives $0.381$ at $t=1$.

4. $10/((s+1)^2+100)$ gives $e^{-t}\sin10t$ with envelope $0.819$ at $t=0.2$.

5. $6/(s+6)$ gives density $6e^{-6t}=3.29$ at $t=0.1$.

6. Pole $-0.02$ gives kernel weight $e^{-2}\approx0.135$ at $t=100$.



### `math-03-29` — Solving IVPs with Laplace  · AUTHOR derivation

**Connections (§1).**

> This lesson connects Laplace derivative rules and initial conditions to solving ivps with laplace. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for efficient solving of linear IVPs, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Laplace methods carry initial conditions into the transformed equation immediately. The constants are handled during algebra rather than after solving. The concrete gap is that constants can be cumbersome when solved after the fact.
> 
> The load-bearing idea is that the transform carries initial values directly into the algebra. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

Solve $y''+3y'+2y=0$, $y(0)=1$, $y'(0)=0$: 1. Let $Y=\mathcal L\{y\}$ — transform the unknown. 2. Use $\mathcal L\{y'\}=sY-1$. 3. Use $\mathcal L\{y''\}=s^2Y-s$. 4. Substitute: $(s^2Y-s)+3(sY-1)+2Y=0$. 5. Collect: $(s^2+3s+2)Y=s+3$. 6. Factor denominator: $Y=(s+3)/((s+1)(s+2))$. 7. Partial fractions give $Y=2/(s+1)-1/(s+2)$. 8. Invert to get $y=2e^{-t}-e^{-2t}$.


**Symbols.** $Y(s)$ is the transform of $y(t)$; initial values enter derivative transforms; partial fractions separate modes.


**Real-World Applications (§5).**

1. The worked IVP gives $y(1)\approx0.600$.

2. $c'+0.2c=10$, $c(0)=0$ gives $c(5)\approx31.61$.

3. $T'+0.1T=7$, $T(0)=20$ gives $T(10)\approx51.61$.

4. $x'+8x=8$, $x(0)=0$ has 2 percent settling about $0.5$s.

5. $w'+0.5w=0$, $w(0)=4$ gives $w(6)\approx0.199$.

6. Natural decay $e^{-0.01t}$ keeps $0.368$ after $100$ steps.



### `math-03-30` — Euler's method  · deepen derivation

**Connections (§1).**

> This lesson connects tangent-line approximation from calculus to Euler's method. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for basic numerical ODE solving, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Euler's method follows the tangent line implied by the ODE for one small step, then repeats. It is the first-order Taylor approximation used as a numerical solver. The concrete gap is that exact formulas are not always available.
> 
> The load-bearing idea is that the current slope gives a short computable step. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Taylor expand $y(t+h)=y(t)+hy'(t)+O(h^2)$ — local linear approximation. 2. Replace $y'(t)$ by the ODE slope $f(t,y)$ — the differential equation supplies the derivative. 3. Drop the $O(h^2)$ term — this makes a first-order method. 4. Define $t_{n+1}=t_n+h$. 5. Define $y_{n+1}=y_n+h f(t_n,y_n)$. 6. For $y'=y-t$, $y(0)=1$, $h=0.5$: first step $y_1=1+0.5(1)=1.5$ at $t=0.5$; second step $y_2=1.5+0.5(1.0)=2.0$ at $t=1$.


**Symbols.** $h$ is step size; $t_n,y_n$ are numerical values; $f(t_n,y_n)$ is the current slope; local error comes from omitted higher terms.


**Real-World Applications (§5).**

1. $p'=0.1p$, $p_0=1000$, $h=1$ gives $1100$ then $1210$.

2. Gradient flow $w'=-2w$, $w_0=5$, $h=0.1$ gives $w_1=4$.

3. Acceleration $-9.8$, $v_0=20$, $h=0.1$ gives $v_1=19.02$.

4. SIR $S'= -0.0002SI$ with $S=990,I=10,h=1$ gives $S_1=988.02$.

5. Charge rate $-0.3$ for $h=0.5$ changes charge by $-0.15$.

6. Hidden state $h'=0.4h$, $h_0=2$, step $0.25$ gives $h_1=2.2$.



### `math-03-31` — Runge–Kutta methods  · AUTHOR derivation

**Connections (§1).**

> This lesson connects Euler stepping and Taylor accuracy to Runge–Kutta methods. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for higher-accuracy numerical solvers, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Runge–Kutta methods improve on Euler by sampling several slopes within one step. RK4 combines those slopes to match the Taylor expansion through fourth order. The concrete gap is that one endpoint slope may miss curvature across a step.
> 
> The load-bearing idea is that several sampled slopes approximate the average slope better. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

For $y'=y$, $y(0)=1$, $h=0.5$: 1. Compute $k_1=f(0,1)=1$ — slope at the left edge. 2. Compute $k_2=f(0.25,1+0.25)=1.25$ — midpoint using $k_1$. 3. Compute $k_3=f(0.25,1+0.25\cdot1.25)=1.3125$ — midpoint using $k_2$. 4. Compute $k_4=f(0.5,1+0.5\cdot1.3125)=1.65625$ — right edge using $k_3$. 5. Average with weights: $\Delta y=\frac{0.5}{6}(1+2(1.25)+2(1.3125)+1.65625)=0.6484375$. 6. So $y(0.5)\approx1.6484375$, close to $e^{0.5}\approx1.64872$.


**Symbols.** $k_i$ are sampled slopes; $h$ is step size; RK4 weights are $1,2,2,1$; order four means local Taylor matching through degree four.


**Real-World Applications (§5).**

1. RK4 for $y'=y$, $h=0.5$ has error about $0.00028$.

2. Constant velocity $1.2$ for $h=0.1$ changes position by $0.12$.

3. Slopes $-0.3,-0.4,-0.5,-0.6$ over $h=1$ change temperature by $-0.45$.

4. 32 vector-field calls at 2 ms cost 64 ms.

5. At 60 fps, slope $9$ changes velocity by $0.150$ per frame.

6. Slopes $-2.0,-1.8,-1.7,-1.5$ over $h=0.25$ change concentration by $-0.4375$.



### `math-03-32` — Boundary value problems  · AUTHOR derivation

**Connections (§1).**

> This lesson connects integration constants and endpoint conditions to boundary value problems. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for finite-difference methods for boundary problems, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A boundary value problem asks for a whole curve that satisfies conditions at separate points. Finite differences turn derivative constraints into algebraic equations for interior values. The concrete gap is that conditions at two endpoints cannot be handled by marching alone.
> 
> The load-bearing idea is that grid values and derivative approximations turn the problem into algebra. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

Solve $y''=2$, $y(0)=0$, $y(1)=3$: 1. Integrate once: $y'=2x+C_1$ — reverse the second derivative. 2. Integrate again: $y=x^2+C_1x+C_2$. 3. Apply $y(0)=0$ to get $C_2=0$. 4. Apply $y(1)=3$: $1+C_1=3$. 5. Solve $C_1=2$. 6. Therefore $y=x^2+2x$. 7. For finite differences, $y''(x_i)\approx(y_{i-1}-2y_i+y_{i+1})/h^2$ comes from adding the forward and backward Taylor expansions and canceling first derivatives.


**Symbols.** $a,b$ are boundary endpoints; $\alpha,\beta$ are boundary values; $h$ is grid spacing; $y_i$ approximates $y(x_i)$.


**Real-World Applications (§5).**

1. $T''=0$, $T(0)=20$, $T(1)=80$ gives $T(0.25)=35$.

2. $y''=0.02$, $y(0)=y(100)=0$ gives midpoint $y(50)=-25$.

3. $V''=0$, $V(0)=0$, $V(10)=5$ gives $V(4)=2$.

4. Linear fill between 40 and 100 over three equal gaps gives 60 and 80.

5. 1000 interior 1D nodes give about $2998$ tridiagonal nonzeros.

6. Path from $x(0)=2$ to $x(5)=12$ has velocity $2$ and midpoint $7$.



### `math-03-33` — Sturm–Liouville theory  · deepen derivation

**Connections (§1).**

> This lesson connects eigenvectors, inner products, and boundary conditions to Sturm–Liouville theory. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for Fourier-type mode expansions and PDE separation, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> Sturm–Liouville theory gives boundary-value problems an eigenvector-like structure. Under the right boundary conditions, eigenfunctions are orthogonal modes. The concrete gap is that boundary-value operators need a mode structure.
> 
> The load-bearing idea is that self-adjoint form makes distinct eigenfunctions orthogonal. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Start with $-(py_m')'+qy_m=\lambda_mwy_m$ and $-(py_n')'+qy_n=\lambda_nwy_n$ — two eigenfunctions. 2. Multiply the first by $y_n$ and the second by $y_m$ — prepare for subtraction. 3. Subtract and integrate over $[a,b]$ — common $q$ terms cancel. 4. Integrate the derivative terms by parts — self-adjoint boundary conditions cancel boundary terms. 5. The result is $(\lambda_m-\lambda_n)\int_a^b w y_my_n\,dx=0$. 6. If $\lambda_m\ne\lambda_n$, divide by the nonzero difference to get $\int_a^b w y_my_n\,dx=0$. For $-y''=\lambda y$ on $(0,\pi)$ with zero endpoints, eigenfunctions are $\sin nx$ and eigenvalues $n^2$.


**Symbols.** $p,q,w$ are coefficient and weight functions; $\lambda$ is an eigenvalue; $y_n$ is an eigenfunction; self-adjoint boundary conditions cancel boundary terms.


**Real-World Applications (§5).**

1. For $f(x)=x$ on $[0,\pi]$, first sine coefficient is $2$.

2. String length $1$, speed $100$, mode $3$ has frequency $150$ Hz.

3. Heat mode $n=2$, $\kappa=0.01$, $t=10$ decays by $e^{-3.948}\approx0.0193$.

4. If $E_1=0.5$ eV, box level $E_3=4.5$ eV.

5. Graph heat smoothing with $\lambda=4$ and factor $0.2$ multiplies by $e^{-0.8}\approx0.449$.

6. Keeping 16 modes for 64 channels stores 1024 coefficients.



### `math-03-34` — Neural ODEs  · deepen derivation

**Connections (§1).**

> This lesson connects residual network updates and Euler steps to neural odes. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for continuous-depth machine-learning models, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A Neural ODE replaces a finite stack of residual updates with a learned continuous-time vector field. The solver, not a fixed layer count, chooses the intermediate steps. The concrete gap is that a fixed layer stack is a discrete approximation.
> 
> The load-bearing idea is that a learned vector field defines continuous hidden-state motion. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Start with a residual block $h_{k+1}=h_k+\Delta t\,F_\theta(t_k,h_k)$ — update equals current state plus learned change. 2. Rearrange: $(h_{k+1}-h_k)/\Delta t=F_\theta(t_k,h_k)$ — this is a difference quotient. 3. Let $\Delta t\to0$ — the quotient becomes $dh/dt$. 4. Define the Neural ODE $dh/dt=f_\theta(t,h)$ — the network supplies the vector field. 5. The output is $h(t_1)$ obtained by numerical integration from $h(t_0)=h_0$. 6. For $h'=0.4h$, $h(0)=2$, two Euler steps of size $0.5$ give $2\to2.4\to2.88$.


**Symbols.** $h(t)$ is hidden state; $f_\theta$ is the learned vector field; $\theta$ are parameters; solver tolerances control numerical accuracy.


**Real-World Applications (§5).**

1. 20 vector-field calls make the ODE block about 20 times one residual-layer call.

2. Decay rate $0.3$ over 5 hours keeps $e^{-1.5}\approx0.223$.

3. Constant divergence $0.2$ over 3 seconds changes density by factor $e^{-0.6}\approx0.549$.

4. $z'=0.5$, $z(0)=1$ gives $z(2)=2$ and midpoint $1.5$.

5. Saving 100 states of dimension 256 in float32 costs 102400 bytes.

6. Rate $-1.2$ over 4 units contracts by $e^{-4.8}\approx0.0082$.



### `math-03-35` — Stochastic differential equations & diffusion  · deepen derivation

**Connections (§1).**

> This lesson connects Euler stepping and random variation to stochastic differential equations & diffusion. The reader can bring the familiar habit of reading a derivative as a local rate of change. Here that habit is organized around the structure that makes this particular kind of equation useful. The lesson prepares for diffusion models and stochastic dynamics, where recognizing the structure before solving is often the most important step.


**Motivation & Intuition (§2).**

> A stochastic differential equation keeps deterministic drift and adds calibrated random motion. Diffusion models use this structure to add noise forward and guide denoising backward. The concrete gap is that deterministic drift does not capture random fluctuations.
> 
> The load-bearing idea is that Brownian increments add noise with variance proportional to time. The derivation or explanation below keeps the algebra tied to that idea, so each step shows why the method applies rather than only recording a formal manipulation. After the structure is clear, the initial data, constants, or numerical values have a specific role to play.


**Definition & Assumptions (§3).**

1. Start with $dX_t=f(X_t,t)dt+g(t)dW_t$ — drift plus Brownian noise. 2. Over a small step $\Delta t$, approximate drift by $f(X_n,t_n)\Delta t$ — Euler's deterministic idea. 3. Brownian increments satisfy $\Delta W\sim\mathcal N(0,\Delta t)$ — variance grows like time. 4. Write $\Delta W=\sqrt{\Delta t}\,\varepsilon_n$ with $\varepsilon_n\sim\mathcal N(0,1)$. 5. Combine terms to get $X_{n+1}=X_n+f(X_n,t_n)\Delta t+g(t_n)\sqrt{\Delta t}\varepsilon_n$. 6. For $dX=-0.5Xdt+0.2dW$, $X_0=1$, $\Delta t=0.04$, $\varepsilon=1.5$, the update is $1-0.02+0.06=1.04$.


**Symbols.** $f$ is drift; $g$ is diffusion scale; $W_t$ is Brownian motion; $\Delta t$ is step size; $\varepsilon_n$ is a standard normal sample.


**Real-World Applications (§5).**

1. 50 denoiser calls at 40 ms take 2000 ms.

2. DDPM noising with $\alpha=0.81$, $x=0.6$, noise $-1$ gives $0.104$.

3. Langevin step with score $-2$, step $0.005$, noise $1$ changes by $0.09$.

4. Gradient noise standard deviation $0.3$ with learning rate $0.01$ gives scale $0.003$.

5. Volatility $20\%$ yearly gives one-day standard deviation $0.20\sqrt{1/252}\approx0.0126$.

6. Brownian diffusion with $D=0.5,t=10$ has RMS displacement $\sqrt{10}\approx3.16$.

---

## Build order for this section

1. **Start with `math-03-05`** as the full-prose model entry and keep its solved example $dy/dx=xy$, $y(0)=2$, $y=2e^{x^2/2}$ as the voice and derivation bar.
2. **Fix the one LaTeX bug** in `math-03-07` before content work: close `$(e^{4x}y)'=8$`.
3. **Author the first-order methods** in order: separable, linear first-order, integrating factors, exact equations, Bernoulli, homogeneous substitutions, and first-order modeling.
4. **Author the linear ODE core**: second-order theory, constant coefficients, undetermined coefficients, variation of parameters, forced oscillations, and higher-order equations.
5. **Author systems and qualitative analysis**: first-order systems, matrix exponential, eigenvalue methods, phase plane, equilibria, and linearization.
6. **Author transforms and numerical/BVP methods**: Laplace transform, inverse Laplace, Laplace IVPs, Euler, RK4, boundary value problems, and Sturm–Liouville.
7. **Finish advanced bridges**: Neural ODEs and SDEs/diffusion, preserving six applications per lesson and keeping every numeric claim reproducible.
8. **Run final mechanical checks**: math-delimiter balance, matrix row-break scan, and numeric spot checks with `python3`/`sympy dsolve` for the formulas listed in the preamble.
