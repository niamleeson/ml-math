# Math · Part 01 — Single-variable calculus  (deep-authored reference)

> **Per-section execution plan.** Load together with the master [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the exposition principles, fix recipe, and Definition of Done. Every numeric claim below was checked with `python3` using `sympy 1.14.0`; key checks include derivatives, limits, integrals, series sums, Taylor coefficients, convergence-test examples, numerical differentiation, numerical integration, and the backpropagation capstone.

**Section:** Single-variable calculus · **Lessons:** 62 · **Breadcrumb:** `Mathematics · Analysis & Calculus` · **Priority:** HIGH (largest section; targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared app-set with a sibling) | 0 / 62 |
| Templated / thin motivation (stock opener or ≤45 words) | 0 / 62 |
| Key formula not in display form (`$$…$$`) | 17 / 62 |
| Genuine LaTeX bugs: unclosed math delimiter or lost matrix `\\` | 0 / 62 |
| Derivation action in this authored plan | 57 derivation / 5 explain-only |

**The core change:** this section already has strong single-variable examples, especially `math-01-13`, but many lessons need the full derivation behind the rule and six applications that compute with that lesson's own idea. The plan below keeps the current strengths and fills in complete derivations, plain symbol glosses, and checked concept-specific numbers for all 62 lessons.

---

## Priority & systemic issues

- **No shared §5 boilerplate:** the current dump shows no whole-section repeated application block. The main work is not replacing a bad shared tail; it is completing the mathematics behind each rule.
- **Calculus rule derivations:** derivative rules, trigonometric derivatives, implicit/logarithmic differentiation, FTC, substitution, integration by parts, Taylor/Maclaurin series, geometric series, and convergence tests need complete step-by-step derivations rather than asserted formulas.
- **Case-by-case lessons:** `math-01-01`, `math-01-12`, `math-01-31`, `math-01-36`, and `math-01-37` are explain-only because they organize concepts and decisions rather than proving a single formula.
- **LaTeX pass:** no unclosed math delimiter or lost matrix row-break bugs were found in the current dump. Keep promoted formulas in display form and preserve all delimiters.

---

## Model entry (full prose)

### `math-01-13` — The derivative — definition and meaning  — **full-depth model entry**

**Connections (§1).**
> This lesson builds on limits and on the slope of a line. A secant line measures average change between two nearby input values. The derivative is what remains when the second point moves all the way into the first point by a limit.
>
> This one definition supports nearly everything that follows in the section. The power, product, quotient, chain, exponential, logarithmic, and trigonometric derivative rules are all efficient ways to evaluate the same limit. Linear approximation, optimization, related rates, Taylor series, numerical differentiation, and backpropagation all use the derivative as a local rate of change.

**Motivation & Intuition (§2).**
> Average speed is easy to compute over a time interval. If a car moves from position $s(3)$ to $s(3.1)$, its average speed is the change in position divided by $0.1$. Instantaneous speed asks for the same kind of rate at one time, where the interval has no visible width.
>
> The derivative answers that by using nearby intervals and then taking a limit. For a function $f$, the quotient
> $$
> \frac{f(x+h)-f(x)}{h}
> $$
> is the slope of the secant line through $x$ and $x+h$. As $h$ approaches $0$, those secant slopes approach the slope of the tangent line, if the limit exists. That limiting slope is $f'(x)$.
>
> The important point is local linear behavior. Near a differentiable input, the function behaves almost like a line. The derivative is the slope of that line, so it tells how many output units change per one input unit at that exact location.

**Definition & Assumptions (§3).** Display
$$
f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}.
$$
Then derive $f'(x)=2x$ for $f(x)=x^2$:
1. Start from the definition: $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$ — the derivative is the limiting secant slope.
2. Substitute $f(t)=t^2$: $f'(x)=\lim_{h\to0}\frac{(x+h)^2-x^2}{h}$ — the rule is applied to the chosen function.
3. Expand the square: $(x+h)^2=x^2+2xh+h^2$ — this separates the change caused by $h$.
4. Subtract $x^2$: $(x^2+2xh+h^2)-x^2=2xh+h^2$ — unchanged parts cancel.
5. Factor $h$: $2xh+h^2=h(2x+h)$ — this exposes the common interval length.
6. Divide by $h$: $\frac{h(2x+h)}{h}=2x+h$ for $h\ne0$ — the quotient is only evaluated for nearby nonzero intervals.
7. Take the limit: $\lim_{h\to0}(2x+h)=2x$ — the remaining $h$ term vanishes.
8. Conclude $\frac{d}{dx}x^2=2x$ — the tangent slope at input $x$ is twice that input.

**Symbols.** $f'(x)$ is the derivative of $f$ at input $x$; $h$ is the small input change; $f(x+h)-f(x)$ is the output change; the quotient is average rate of change; the limit turns the average rate into the instantaneous rate when it exists.

**Real-World Applications (§5).**
1. **Instantaneous velocity** — $s(t)=t^2$ gives $s'(3)=6$, so position changes at $6$ units per time at $t=3$.
2. **Marginal cost** — $C(q)=q^2+10$ gives $C'(5)=10$, so the next unit near $q=5$ costs about $10$ units.
3. **Loss sensitivity** — $L(w)=(w-2)^2$ gives $L'(3)=2$, so increasing $w$ locally raises loss at rate $2$.
4. **Tangent line** — for $f(x)=x^2$ at $x=4$, slope $8$ and point $(4,16)$ give $y=16+8(x-4)$.
5. **Linear prediction** — near $x=10$, $x^2$ changes by about $20(0.1)=2$ when $x$ increases by $0.1$.
6. **Gradient check in one variable** — $\frac{(3.001)^2-3^2}{0.001}=6.001$, close to $f'(3)=6$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson. The labels are plan shorthand; in the app they become flowing prose in the same plain textbook voice as the model entry. Each Apps line has exactly six concept-specific, checked numeric uses.

### `math-01-01` — Functions and their graphs  · explain-only

**Connections (§1).**
> This lesson begins with the basic language of functions, which is already present whenever one quantity is determined by another. Tables, formulas, and graphs are different ways to describe that same assignment from inputs to outputs. This foundation makes later calculus approachable because limits, derivatives, and integrals all act on functions.

**Motivation & Intuition (§2).**
> A function is a rule with a strict input-output agreement: each allowed input has exactly one output. The graph gives a picture of that agreement by placing every pair $(x,f(x))$ in the coordinate plane. Reading the graph is therefore another way of reading the rule.
>
> The main habit is to keep track of domain and range. The domain tells which inputs are allowed before any calculation begins, and the range records the outputs that actually occur. The vertical-line test is a graphical version of the same rule: if one input line hits two outputs, the relation is not a function.

**Definition & Assumptions (§3).** Explain-only: this is a definition lesson about inputs, outputs, domain, range, and graph reading. Teach the vertical-line test and evaluate concrete rules rather than forcing a proof.

**Symbols.** $x$ is an input; $f(x)$ is the output; the domain is the allowed input set; the range is the set of outputs produced.

**Real-World Applications (§5).**
1. Parking rule $f(h)=5+2h$ gives $f(3)=11$.
2. Temperature conversion $C(F)=\frac59(F-32)$ gives $C(68)=20$.
3. Feature map $f(x)=3x-1$ sends $4$ to $11$.
4. Domain of $\sqrt{x-2}$ starts at $x=2$; $f(6)=2$.
5. Table inputs $1,2,3$ with outputs $2,4,6$ fit $f(x)=2x$.
6. The relation $(1,2),(1,3)$ fails to be a function because input $1$ has two outputs.

### `math-01-02` — Function transformations  · deepen derivation

**Connections (§1).**
> This lesson builds on familiar parent graphs such as lines, parabolas, and absolute value graphs. Instead of plotting a new graph from scratch, transformations let you carry a known shape to a new location or scale. These ideas prepare the reader for recognizing families of functions quickly throughout calculus.

**Motivation & Intuition (§2).**
> A transformation changes how inputs or outputs are recorded while preserving the underlying shape in a predictable way. Adding outside the function moves outputs up or down, multiplying outside stretches or reflects vertical distances, and changing the input inside the function moves or rescales the graph horizontally.
>
> The important distinction is outside versus inside. Outside changes act directly on the output, so their visual effect follows the sign and scale you see. Inside changes act on the input needed to reach an old point, so horizontal shifts and scales often feel reversed until you track which old input is being used.

**Definition & Assumptions (§3).** 1. Start with a point $(x,f(x))$ on the graph — this records the old input and output. 2. Add $k$ outside the function: $g(x)=f(x)+k$ — every output increases by $k$, so the graph shifts vertically. 3. Replace $x$ by $x-h$: $g(x)=f(x-h)$ — the old input $x-h$ equals the new coordinate $x$, so the graph shifts right by $h$. 4. Multiply outside: $g(x)=a f(x)$ — every output is scaled by $a$. 5. Multiply inside: $g(x)=f(bx)$ — the old input is reached when the new input is $x/b$, so horizontal lengths scale by $1/b$.

**Symbols.** $h$ is horizontal shift; $k$ is vertical shift; $a$ is vertical scale; $b$ is horizontal reciprocal scale.

**Real-World Applications (§5).**
1. $f(x)=x^2$ shifted right $3$ gives $g(5)=(5-3)^2=4$.
2. Vertical shift $x^2+2$ gives value $11$ at $x=3$.
3. Reflection $-x^2$ gives $-9$ at $x=3$.
4. Vertical stretch $2x^2$ gives $18$ at $x=3$.
5. Horizontal compression $f(2x)=4x^2$ gives $16$ at $x=2$.
6. Combined $2(x-1)^2+3$ gives $11$ at $x=3$.

### `math-01-03` — Exponential functions  · deepen derivation

**Connections (§1).**
> This lesson builds on repeated multiplication and on the idea of a function as a changing quantity. Exponentials describe situations where equal steps multiply by equal factors. That pattern leads naturally to compounding, decay, and continuous growth models.

**Motivation & Intuition (§2).**
> Linear growth adds the same amount over equal steps, but exponential growth multiplies by the same factor. That makes the current amount part of the future change: a larger current amount produces a larger next increase under the same relative rate.
>
> Continuous exponentials arise by making the compounding steps very small. The base $e$ records the limiting factor produced by infinitely fine compounding, so $Ce^{rt}$ is the natural form when growth happens continuously at rate $r$.

**Definition & Assumptions (§3).** 1. Require equal steps to multiply by the same factor — this is constant relative growth. 2. Let one unit step multiply by $a$ — after $n$ integer steps the output is $C a^n$. 3. For continuous growth at rate $r$, split one time unit into $n$ pieces with factor $1+r/n$. 4. After one unit the factor is $(1+r/n)^n$ — all small factors multiply. 5. Let $n\to\infty$ to define $e^r$ — continuous compounding is the limiting factor. 6. Therefore $y=C e^{rt}$.

**Symbols.** $C$ is initial amount; $a$ is per-step factor; $r$ is continuous growth rate; $e$ is the base from continuous compounding.

**Real-World Applications (§5).**
1. $100e^{0.05\cdot2}\approx110.517$ after two years.
2. Half-life factor after $3$ half-lives is $2^{-3}=0.125$.
3. Population $50e^{0.1\cdot4}\approx74.591$.
4. Neural activation $e^2\approx7.389$.
5. Discount $200e^{-0.03\cdot5}\approx172.142$.
6. Doubling model $10\cdot2^4=160$.

### `math-01-04` — Logarithmic functions  · deepen derivation

**Connections (§1).**
> This lesson builds on exponential notation. If exponentials answer what value a base produces, logarithms answer which exponent was used. This inverse viewpoint is essential for solving growth equations and for measuring relative scale.

**Motivation & Intuition (§2).**
> A logarithm turns the question around. Instead of asking for $a^y$, it starts from a positive value $x$ and finds the exponent $y$ that makes $a^y=x$. That is why logarithms undo exponential functions.
>
> Because exponents add when powers are multiplied, logarithms convert products into sums. This makes them useful whenever multiplicative structure is easier to analyze additively, including likelihoods, odds, and scale measurements.

**Definition & Assumptions (§3).** 1. Start with $a^y=x$ — exponentiation sends exponent $y$ to value $x$. 2. Define $y=\log_a x$ — the logarithm names the exponent that produced $x$. 3. For a product, write $x=a^m$ and $z=a^n$ — logs of the factors are $m$ and $n$. 4. Multiply: $xz=a^{m+n}$ — exponents add under multiplication. 5. Take $\log_a$ to get $\log_a(xz)=m+n=\log_a x+\log_a z$.

**Symbols.** $a>0$, $a\ne1$ is the base; $x>0$ is the input; $\log_a x$ is the exponent needed to get $x$ from base $a$.

**Real-World Applications (§5).**
1. $\log_2 8=3$.
2. $\ln(e^5)=5$.
3. $\log_{10}(1000)=3$.
4. Product rule gives $\ln(2e^3)=\ln2+3\approx3.693$.
5. Odds logit for $p=0.8$ is $\ln(4)\approx1.386$.
6. Solving $3e^{2t}=12$ gives $t=\ln4/2\approx0.693$.

### `math-01-05` — Trigonometric functions  · deepen derivation

**Connections (§1).**
> This lesson builds on coordinates, angles, and the unit circle. Trigonometric functions turn rotation into ordinary functions of one variable. They will later supply the standard language for oscillation, waves, and circular motion.

**Motivation & Intuition (§2).**
> The unit circle gives sine and cosine a geometric meaning. At angle $\theta$, cosine is the horizontal coordinate and sine is the vertical coordinate of the point on the circle. The identity $\sin^2\theta+\cos^2\theta=1$ is just the radius-one Pythagorean theorem.
>
> Tangent compares the vertical coordinate to the horizontal coordinate, so it behaves like a slope. Periodicity comes from returning to the same point after a full turn, which is why sine and cosine repeat every $2\pi$ radians.

**Definition & Assumptions (§3).** 1. Put a point on the unit circle at angle $\theta$ from the positive $x$-axis. 2. Define its coordinates as $(\cos\theta,\sin\theta)$ — cosine is horizontal position and sine is vertical position. 3. The radius is $1$, so Pythagoras gives $\cos^2\theta+\sin^2\theta=1$. 4. Define $\tan\theta=\sin\theta/\cos\theta$ when $\cos\theta\ne0$ — slope is vertical change over horizontal change. 5. A full turn returns to the same point, so sine and cosine have period $2\pi$.

**Symbols.** $\theta$ is angle in radians; $\sin\theta$ is vertical coordinate; $\cos\theta$ is horizontal coordinate; $\tan\theta$ is their ratio.

**Real-World Applications (§5).**
1. $\sin(\pi/6)=0.5$.
2. $\cos(\pi/3)=0.5$.
3. $\tan(\pi/4)=1$.
4. Unit-circle point at $\pi/4$ is $(\sqrt2/2,\sqrt2/2)$.
5. Oscillation $3\sin(2t)$ has amplitude $3$ and period $\pi$.
6. For $\theta=\pi/3$, $\sin^2\theta+\cos^2\theta=0.75+0.25=1$.

### `math-01-06` — Inverse trigonometric functions  · deepen derivation

**Connections (§1).**
> This lesson builds on trigonometric functions and inverse functions. Since trigonometric values repeat, inverse trigonometric functions need carefully chosen output intervals. These restricted inverses let calculus recover angles from ratios in a consistent way.

**Motivation & Intuition (§2).**
> Sine, cosine, and tangent are not one-to-one on their full domains because many angles can produce the same value. An inverse function needs one output for each input, so the original trigonometric function is restricted to a principal interval before it is inverted.
>
> The result is not every possible angle, but a standard angle. $\arcsin x$, $\arccos x$, and $\arctan x$ return principal values that make equations and geometric interpretations unambiguous.

**Definition & Assumptions (§3).** 1. Sine is not one-to-one on all real numbers — many angles share a sine value. 2. Restrict sine to $[-\pi/2,\pi/2]$ — on that interval it increases without repeating values. 3. Define $\arcsin x$ as the angle in that interval whose sine is $x$. 4. If $y=\arcsin x$, then $\sin y=x$. 5. The same restriction idea gives $\arccos x\in[0,\pi]$ and $\arctan x\in(-\pi/2,\pi/2)$.

**Symbols.** $\arcsin x$, $\arccos x$, and $\arctan x$ are principal angles; $x$ is a ratio or coordinate, not an angle.

**Real-World Applications (§5).**
1. $\arcsin(1/2)=\pi/6$.
2. $\arccos(1/2)=\pi/3$.
3. $\arctan(1)=\pi/4$.
4. A slope $3/4$ has angle $\arctan(0.75)\approx0.644$ radians.
5. Correlation $0.8$ has angle $\arccos(0.8)\approx0.644$.
6. Height ratio $0.6$ gives launch angle $\arcsin(0.6)\approx0.644$.

### `math-01-07` — Limits: definition and computation  · deepen derivation

**Connections (§1).**
> This lesson builds on evaluating functions near a point. Limits formalize the value a function approaches, even when the function may not be defined at the point itself. This idea supports the derivative, the definite integral, and continuity.

**Motivation & Intuition (§2).**
> Substitution is often the first way to look for a limit, but it is not always enough. If substitution gives an expression like $0/0$, the nearby behavior is hidden by algebraic cancellation or another structure.
>
> The key is that a limit uses nearby inputs rather than the target input alone. By rewriting the expression so the nearby values are visible, the limiting value can often be found even when the original formula has a hole at the point.

**Definition & Assumptions (§3).** For $\lim_{x\to2}\frac{x^2-4}{x-2}$: 1. Direct substitution gives $0/0$ — the expression is not defined at $x=2$. 2. Factor the numerator: $x^2-4=(x-2)(x+2)$ — expose the removable factor. 3. Cancel $x-2$ for $x\ne2$ — limits use nearby inputs, not the point itself. 4. The simplified expression is $x+2$. 5. Let $x\to2$ to get $4$ — the nearby values approach $4$.

**Symbols.** $\lim_{x\to a}f(x)=L$ means $f(x)$ approaches $L$ as $x$ approaches $a$; $a$ is the input approached; $L$ is the limiting value.

**Real-World Applications (§5).**
1. Removable limit above equals $4$.
2. $\lim_{x\to0}\frac{\sin x}{x}=1$.
3. $\lim_{x\to3}(2x+1)=7$.
4. $\lim_{x\to1}\frac{x^3-1}{x-1}=3$.
5. Average velocity for $s=t^2$ near $3$ tends to $6$.
6. $\lim_{x\to0}\frac{e^x-1}{x}=1$.

### `math-01-08` — One-sided limits  · deepen derivation

**Connections (§1).**
> This lesson builds on ordinary limits by paying attention to direction. Some functions behave differently when an input approaches from the left than from the right. One-sided limits give the language needed for jumps, boundaries, and piecewise definitions.

**Motivation & Intuition (§2).**
> A two-sided limit requires the same approached value from both directions. At a jump or endpoint, the left-hand and right-hand stories may not match, so treating them separately prevents us from hiding important behavior.
>
> One-sided limits are especially useful for piecewise rules. The formula that applies to inputs below the point may differ from the formula above it, and the two-sided limit exists only when those two approaching values agree.

**Definition & Assumptions (§3).** For $f(x)=0$ if $x<1$ and $f(x)=2$ if $x\ge1$: 1. Approach $1$ using $x<1$ — the formula is $0$. 2. The left-hand limit is therefore $\lim_{x\to1^-}f(x)=0$. 3. Approach $1$ using $x>1$ — the formula is $2$. 4. The right-hand limit is $\lim_{x\to1^+}f(x)=2$. 5. Since the one-sided limits differ, the two-sided limit does not exist.

**Symbols.** $x\to a^-$ means from below; $x\to a^+$ means from above; a two-sided limit exists only when both one-sided limits agree.

**Real-World Applications (§5).**
1. Step function above has left limit $0$ and right limit $2$.
2. ReLU $\max(0,x)$ has both one-sided limits $0$ at $0$.
3. $1/x$ has left limit $-\infty$ and right limit $+\infty$ at $0$.
4. Price threshold $f(x)=10$ below $100$ and $15$ above has a jump of $5$.
5. Floor function at $3$ has left limit $2$ and right limit $3$.
6. Domain boundary $\sqrt{x}$ has right limit $0$ at $0$.

### `math-01-09` — Continuity  · deepen derivation

**Connections (§1).**
> This lesson builds on limits and function values. Continuity says that the approached value and the actual value are the same. It is the condition that lets graphs be read without holes or jumps at a point.

**Motivation & Intuition (§2).**
> A function can fail to be continuous in several ways: the value may be missing, the nearby values may not approach one number, or the approached value may not equal the assigned value. Continuity requires all three parts to line up.
>
> This matters because many calculus theorems rely on functions having no sudden breaks. When a function is continuous, small changes in input produce controlled changes in output near that point.

**Definition & Assumptions (§3).** 1. To be continuous at $a$, $f(a)$ must be defined — the point has an output. 2. The limit $\lim_{x\to a}f(x)$ must exist — nearby values agree from both sides. 3. The two must match: $\lim_{x\to a}f(x)=f(a)$ — no hole or jump remains. 4. For $f(x)=x^2$, $\lim_{x\to3}x^2=9$ by substitution. 5. Since $f(3)=9$, $x^2$ is continuous at $3$.

**Symbols.** $a$ is the point tested; $f(a)$ is the actual value; the limit is the approached value.

**Real-World Applications (§5).**
1. $x^2$ is continuous at $3$ with value $9$.
2. $1/x$ is continuous at $2$ with value $0.5$.
3. $\sqrt{x}$ is continuous at $4$ with value $2$.
4. ReLU is continuous at $0$ since both sides give $0$.
5. A removable hole with limit $4$ but value $5$ is not continuous.
6. Piecewise jump from $1$ to $3$ at $0$ is discontinuous by gap $2$.

### `math-01-10` — The Intermediate Value Theorem  · deepen derivation

**Connections (§1).**
> This lesson builds on continuity over an interval. The Intermediate Value Theorem turns the visual idea of an unbroken graph into a precise guarantee. It prepares the reader for existence arguments, root-finding, and threshold crossing.

**Motivation & Intuition (§2).**
> If a continuous function starts below a target value and ends above it, it cannot skip over the target. The graph may curve or wiggle, but without a jump it must pass through every intermediate height.
>
> The theorem is an existence statement. It may not tell where the input is or whether it is unique, but it guarantees that at least one such input exists between the endpoints.

**Definition & Assumptions (§3).** 1. Let $f$ be continuous on $[a,b]$ — there are no jumps or gaps on the interval. 2. Suppose $f(a)<N<f(b)$ — the target lies between endpoint values. 3. Consider $g(x)=f(x)-N$ — hitting $N$ means finding a zero of $g$. 4. Then $g(a)<0$ and $g(b)>0$ — the sign changes. 5. Continuity prevents a sign change without passing through $0$. 6. Therefore some $c\in(a,b)$ satisfies $f(c)=N$.

**Symbols.** $[a,b]$ is the closed interval; $N$ is the target output; $c$ is the input guaranteed by the theorem.

**Real-World Applications (§5).**
1. $f(x)=x^2$ on $[1,3]$ hits $4$ at $x=2$.
2. $x^3-x-1$ changes from $-1$ at $1$ to $5$ at $2$, so it has a root in $(1,2)$.
3. Temperature from $60$ to $75$ hits $70$ at least once.
4. Model score from $-0.2$ to $0.3$ crosses decision threshold $0$.
5. Continuous cost from $90$ to $110$ hits budget $100$.
6. $\sin x$ on $[0,\pi/2]$ hits $0.5$ at $\pi/6$.

### `math-01-11` — Limits at infinity  · deepen derivation

**Connections (§1).**
> This lesson builds on ordinary limits and long-run comparisons. Limits at infinity describe what remains important as the input grows without bound. They are the basis for horizontal asymptotes and end behavior.

**Motivation & Intuition (§2).**
> For large inputs, not every term matters equally. In a polynomial or rational expression, the highest powers dominate because lower powers become small by comparison after dividing by the largest scale.
>
> A limit at infinity captures that dominant behavior. It tells whether the function settles toward a number, grows without bound, or approaches another long-run pattern.

**Definition & Assumptions (§3).** For $\lim_{x\to\infty}\frac{3x^2+1}{x^2-4}$: 1. Identify the highest power $x^2$ — it dominates numerator and denominator. 2. Divide every term by $x^2$ — compare terms on the same scale. 3. Get $\frac{3+1/x^2}{1-4/x^2}$. 4. Let $x\to\infty$ so $1/x^2\to0$ and $4/x^2\to0$. 5. The limit is $3/1=3$.

**Symbols.** $x\to\infty$ means input grows without bound; dominant term means highest power controlling long-run size.

**Real-World Applications (§5).**
1. The worked rational limit is $3$.
2. $\lim_{x\to\infty}1/x=0$.
3. $\lim_{x\to\infty}\frac{2x+5}{x}=2$.
4. Logistic curve $1/(1+e^{-x})$ tends to $1$.
5. $e^{-0.2t}$ tends to $0$ as $t\to\infty$.
6. $\frac{x}{x+10}$ tends to $1$.

### `math-01-12` — Asymptotes  · explain-only

**Connections (§1).**
> This lesson builds on limits near a point and at infinity. Asymptotes summarize how a graph behaves when it approaches a line without necessarily reaching it. They make end behavior and blow-up visible in a compact way.

**Motivation & Intuition (§2).**
> Vertical asymptotes come from nearby inputs making function values grow without bound. Horizontal asymptotes describe long-run output levels as inputs go far left or right, while slant asymptotes describe long-run linear behavior.
>
> This is a classification lesson because different formulas reveal asymptotes in different ways. Limits, factoring, and polynomial division all contribute to deciding which line the graph approaches.

**Definition & Assumptions (§3).** Explain-only: this is a classification lesson. Teach vertical, horizontal, and slant asymptotes from limits and polynomial division instead of presenting one theorem.

**Symbols.** $x=a$ is a vertical asymptote; $y=L$ is a horizontal asymptote; $y=mx+b$ is a slant asymptote.

**Real-World Applications (§5).**
1. $1/(x-2)$ has vertical asymptote $x=2$.
2. $\frac{3x+1}{x+2}$ has horizontal asymptote $y=3$.
3. $\frac{x^2+1}{x}=x+1/x$ has slant asymptote $y=x$.
4. $e^{-x}$ has horizontal asymptote $y=0$.
5. $\ln x$ has vertical asymptote $x=0$.
6. $\frac{2x^2+1}{x^2+5}$ has horizontal asymptote $y=2$.

### `math-01-13` — The derivative — definition and meaning  · AUTHOR derivation


**Connections (§1).**
> This lesson builds on limits and on the slope of a line. A secant line measures average change between two nearby input values. The derivative is what remains when the second point moves all the way into the first point by a limit.
>
> This one definition supports nearly everything that follows in the section. The power, product, quotient, chain, exponential, logarithmic, and trigonometric derivative rules are all efficient ways to evaluate the same limit. Linear approximation, optimization, related rates, Taylor series, numerical differentiation, and backpropagation all use the derivative as a local rate of change.

**Motivation & Intuition (§2).**
> Average speed is easy to compute over a time interval. If a car moves from position $s(3)$ to $s(3.1)$, its average speed is the change in position divided by $0.1$. Instantaneous speed asks for the same kind of rate at one time, where the interval has no visible width.
>
> The derivative answers that by using nearby intervals and then taking a limit. For a function $f$, the quotient
> $$
> \frac{f(x+h)-f(x)}{h}
> $$
> is the slope of the secant line through $x$ and $x+h$. As $h$ approaches $0$, those secant slopes approach the slope of the tangent line, if the limit exists. That limiting slope is $f'(x)$.
>
> The important point is local linear behavior. Near a differentiable input, the function behaves almost like a line. The derivative is the slope of that line, so it tells how many output units change per one input unit at that exact location.

**Definition & Assumptions (§3).** Display
$$
f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}.
$$
Then derive $f'(x)=2x$ for $f(x)=x^2$:
1. Start from the definition: $f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$ — the derivative is the limiting secant slope.
2. Substitute $f(t)=t^2$: $f'(x)=\lim_{h\to0}\frac{(x+h)^2-x^2}{h}$ — the rule is applied to the chosen function.
3. Expand the square: $(x+h)^2=x^2+2xh+h^2$ — this separates the change caused by $h$.
4. Subtract $x^2$: $(x^2+2xh+h^2)-x^2=2xh+h^2$ — unchanged parts cancel.
5. Factor $h$: $2xh+h^2=h(2x+h)$ — this exposes the common interval length.
6. Divide by $h$: $\frac{h(2x+h)}{h}=2x+h$ for $h\ne0$ — the quotient is only evaluated for nearby nonzero intervals.
7. Take the limit: $\lim_{h\to0}(2x+h)=2x$ — the remaining $h$ term vanishes.
8. Conclude $\frac{d}{dx}x^2=2x$ — the tangent slope at input $x$ is twice that input.

**Symbols.** $f'(x)$ is the derivative of $f$ at input $x$; $h$ is the small input change; $f(x+h)-f(x)$ is the output change; the quotient is average rate of change; the limit turns the average rate into the instantaneous rate when it exists.

**Real-World Applications (§5).**
1. **Instantaneous velocity** — $s(t)=t^2$ gives $s'(3)=6$, so position changes at $6$ units per time at $t=3$.
2. **Marginal cost** — $C(q)=q^2+10$ gives $C'(5)=10$, so the next unit near $q=5$ costs about $10$ units.
3. **Loss sensitivity** — $L(w)=(w-2)^2$ gives $L'(3)=2$, so increasing $w$ locally raises loss at rate $2$.
4. **Tangent line** — for $f(x)=x^2$ at $x=4$, slope $8$ and point $(4,16)$ give $y=16+8(x-4)$.
5. **Linear prediction** — near $x=10$, $x^2$ changes by about $20(0.1)=2$ when $x$ increases by $0.1$.
6. **Gradient check in one variable** — $\frac{(3.001)^2-3^2}{0.001}=6.001$, close to $f'(3)=6$.

### `math-01-14` — Differentiability vs continuity  · deepen derivation

**Connections (§1).**
> This lesson builds on continuity and the derivative definition. Differentiability adds the stronger requirement that the local slope settle to one value. This connection explains why every differentiable function is continuous, while some continuous functions still have corners or vertical tangents.

**Motivation & Intuition (§2).**
> Continuity only asks whether nearby outputs approach the function value. Differentiability asks more: the ratio of output change to input change must approach a finite limiting slope.
>
> When that slope exists, the output change can be written as slope times input change in the limit, and the input change goes to zero. A corner such as $|x|$ shows why the reverse implication fails: the graph can meet without a single tangent slope.

**Definition & Assumptions (§3).** 1. Suppose $f'(a)$ exists — the difference quotient has a finite limit. 2. Rewrite $f(x)-f(a)=\frac{f(x)-f(a)}{x-a}(x-a)$ for $x\ne a$ — factor change into slope times input change. 3. Let $x\to a$ — the quotient tends to $f'(a)$ and $x-a\to0$. 4. The product tends to $f'(a)\cdot0=0$. 5. Therefore $f(x)\to f(a)$, so $f$ is continuous at $a$. 6. The converse fails: $|x|$ is continuous at $0$ but left slope $-1$ and right slope $1$ differ.

**Symbols.** Differentiable means derivative exists; continuous means limit equals value; one-sided slopes test corners.

**Real-World Applications (§5).**
1. $x^2$ is differentiable at $2$ and continuous with value $4$.
2. $|x|$ is continuous at $0$ but not differentiable.
3. ReLU is continuous at $0$ but slopes $0$ and $1$ differ.
4. Step function has jump $1$, so not continuous or differentiable.
5. $\sqrt{x}$ is continuous at $0$ but derivative blows up.
6. $x^{2/3}$ is continuous at $0$ with vertical tangent.

### `math-01-15` — The power rule  · deepen derivation

**Connections (§1).**
> This lesson builds on the derivative definition and polynomial powers. The power rule is the first major shortcut for evaluating derivatives. It turns repeated limit work into a simple rule that will be used throughout the rest of calculus.

**Motivation & Intuition (§2).**
> The derivative of $x^n$ measures how a power changes under a small input increase. Expanding $(x+h)^n$ shows that the first-order change is $n x^{n-1}h$, while higher powers of $h$ become negligible in the limit.
>
> That first-order term is the slope. After dividing by $h$ and letting $h$ go to zero, only $n x^{n-1}$ remains, which is why powers can be differentiated so efficiently.

**Definition & Assumptions (§3).** 1. Start with $\frac{d}{dx}x^n=\lim_{h\to0}\frac{(x+h)^n-x^n}{h}$. 2. Expand by the binomial theorem: $(x+h)^n=x^n+n x^{n-1}h+\binom n2x^{n-2}h^2+\cdots+h^n$. 3. Subtract $x^n$ — the constant term cancels. 4. Factor $h$ from every remaining term. 5. Divide by $h$ to get $n x^{n-1}+\binom n2x^{n-2}h+\cdots$. 6. Let $h\to0$ — all terms with $h$ vanish. 7. The derivative is $n x^{n-1}$.

**Symbols.** $n$ is the power; $x$ is the input; $\binom nk$ counts binomial terms.

**Real-World Applications (§5).**
1. $\frac{d}{dx}x^3=3x^2$, so at $2$ the slope is $12$.
2. $\frac{d}{dx}x^5=5x^4$, so at $1$ the slope is $5$.
3. $\frac{d}{dx}\sqrt{x}=1/(2\sqrt{x})$, so at $4$ the slope is $0.25$.
4. $\frac{d}{dx}x^{-1}=-x^{-2}$, so at $2$ the slope is $-0.25$.
5. Cost $q^4$ has marginal cost $108$ at $q=3$.
6. Regularizer $w^2$ has gradient $2w$, so at $w=-3$ it is $-6$.

### `math-01-16` — The sum and difference rule  · deepen derivation

**Connections (§1).**
> This lesson builds on the derivative as a limit of output change. When functions are added or subtracted, their output changes add or subtract too. This rule lets larger formulas be handled one term at a time.

**Motivation & Intuition (§2).**
> A sum changes by the change in the first function plus the change in the second function. The difference quotient for $f+g$ can therefore be separated into the quotient for $f$ and the quotient for $g$.
>
> Taking the limit preserves that separation when both derivatives exist. This is why polynomial differentiation becomes straightforward after the power rule: each term contributes its own derivative.

**Definition & Assumptions (§3).** 1. Start with $\frac{d}{dx}(f+g)=\lim_{h\to0}\frac{f(x+h)+g(x+h)-f(x)-g(x)}{h}$. 2. Regroup the numerator as $[f(x+h)-f(x)]+[g(x+h)-g(x)]$ — separate the two changes. 3. Split the fraction into two quotients. 4. Take limits term by term when both derivatives exist. 5. Get $(f+g)'=f'+g'$. 6. Replacing $g$ by $-g$ gives $(f-g)'=f'-g'$.

**Symbols.** $f,g$ are differentiable functions; $h$ is the input change; prime means derivative with respect to $x$.

**Real-World Applications (§5).**
1. $(x^2+x^3)'=2x+3x^2$, at $2$ gives $16$.
2. $(x^3-x)'=3x^2-1$, at $1$ gives $2$.
3. $C(q)=q^2+5q+10$ has $C'(4)=13$.
4. $L(w)=w^2+(w-1)^2$ has $L'(2)=6$.
5. Position $t^2+3t$ has velocity $9$ at $t=3$.
6. Polynomial $4x^4-2x$ has slope $30$ at $x=1.5$.

### `math-01-17` — The product rule  · deepen derivation

**Connections (§1).**
> This lesson builds on derivatives of single functions and on products of quantities. Products are common in models where two changing factors interact. The product rule explains how each factor contributes to the local rate of the whole product.

**Motivation & Intuition (§2).**
> When $f(x)g(x)$ changes, part of the change comes from $f$, part comes from $g$, and a very small overlap comes from both changing at once. In the limit, the overlap is too small to contribute to the derivative.
>
> The resulting rule has two terms. One term changes $f$ while holding $g$ locally fixed, and the other changes $g$ while holding $f$ locally fixed.

**Definition & Assumptions (§3).** 1. Start with $\frac{f(x+h)g(x+h)-f(x)g(x)}{h}$. 2. Add and subtract $f(x+h)g(x)$ — this creates two single-factor changes. 3. Regroup as $\frac{f(x+h)[g(x+h)-g(x)]}{h}+\frac{g(x)[f(x+h)-f(x)]}{h}$. 4. Let $h\to0$ — continuity from differentiability gives $f(x+h)\to f(x)$. 5. The first term tends to $f(x)g'(x)$ and the second to $g(x)f'(x)$. 6. Therefore $(fg)'=f'g+fg'$.

**Symbols.** $f,g$ are factors; $f',g'$ are their local rates; the two terms measure changing one factor while holding the other locally fixed.

**Real-World Applications (§5).**
1. $(x^2\sin x)'=2x\sin x+x^2\cos x$, at $x=\pi/2$ gives $\pi$.
2. $(xe^x)'=e^x+xe^x$, at $1$ gives $2e\approx5.437$.
3. Revenue $p(q)q=(10-q)q$ has derivative $10-2q$, at $3$ gives $4$.
4. $x^2\ln x$ has slope $2x\ln x+x$, at $e$ gives $3e\approx8.155$.
5. $\sqrt{x}(x+1)$ has slope $3.25$ at $4$.
6. $w\sigma(w)$ with $\sigma(0)=0.5$, $\sigma'(0)=0.25$ has derivative $0.5$ at $0$.

### `math-01-18` — The quotient rule  · deepen derivation

**Connections (§1).**
> This lesson builds on the product rule and reciprocal powers. Quotients appear whenever one changing quantity is measured relative to another. The quotient rule keeps track of how numerator and denominator changes push the ratio in opposite directions.

**Motivation & Intuition (§2).**
> A quotient can be rewritten as a product with a reciprocal. That means the product rule and chain rule are enough to derive the quotient rule, provided the denominator is not zero.
>
> The numerator's change raises or lowers the ratio directly. The denominator's change works in the opposite direction because increasing the denominator makes the same numerator count for less.

**Definition & Assumptions (§3).** 1. Write $f/g=f\cdot g^{-1}$ with $g\ne0$ — turn the quotient into a product. 2. Differentiate using the product rule: $(f/g)'=f'g^{-1}+f(g^{-1})'$. 3. Differentiate $g^{-1}$ by the chain rule: $(g^{-1})'=-g^{-2}g'$. 4. Substitute: $(f/g)'=f'/g-fg'/g^2$. 5. Put over a common denominator: $(f'g-fg')/g^2$.

**Symbols.** $g(x)\ne0$ is required; $f'g$ is numerator-change contribution; $fg'$ is denominator-change contribution.

**Real-World Applications (§5).**
1. $\left(\frac{x^2+1}{x}\right)'=1-1/x^2$, at $2$ gives $0.75$.
2. $\left(\frac{x}{x+1}\right)'=1/(x+1)^2$, at $3$ gives $0.0625$.
3. $\left(\frac{\sin x}{x}\right)'$ at $\pi/2$ is $-4/\pi^2\approx-0.405$.
4. Average cost $(q^2+10)/q$ has derivative $1-10/q^2$, at $5$ gives $0.6$.
5. Ratio $e^x/(1+x)$ has slope $e/4\approx0.680$ at $1$.
6. Odds $p/(1-p)$ has derivative $1/(1-p)^2$, at $p=0.8$ gives $25$.

### `math-01-19` — The chain rule  · deepen derivation

**Connections (§1).**
> This lesson builds on composition of functions. Many useful formulas have an inside process followed by an outside process. The chain rule is the derivative rule that follows that path of dependence.

**Motivation & Intuition (§2).**
> A composed function changes in stages. A small change in $x$ first changes the inner value $g(x)$, and that changed inner value then changes the outer output $f(g(x))$.
>
> The total local rate is the product of those local rates. The outside derivative is evaluated at the current inside value, then multiplied by the derivative of the inside function.

**Definition & Assumptions (§3).** 1. Let $y=f(u)$ and $u=g(x)$ — the output changes through an intermediate variable. 2. For a small $\Delta x$, the inner change is $\Delta u\approx g'(x)\Delta x$. 3. The outer change is $\Delta y\approx f'(u)\Delta u$ — use the local slope of $f$ at $u$. 4. Substitute the inner change: $\Delta y\approx f'(g(x))g'(x)\Delta x$. 5. Divide by $\Delta x$ and take the limit. 6. Get $(f\circ g)'(x)=f'(g(x))g'(x)$.

**Symbols.** $g$ is the inner function; $f$ is the outer function; $u$ is the intermediate value.

**Real-World Applications (§5).**
1. $(3x+1)^2$ has derivative $6(3x+1)$, at $2$ gives $42$.
2. $e^{2x}$ has derivative $2e^{2x}$, at $0$ gives $2$.
3. $\sin(x^2)$ has derivative $2x\cos(x^2)$, at $0$ gives $0$.
4. $\ln(1+x^2)$ has derivative $2x/(1+x^2)$, at $1$ gives $1$.
5. Loss $(wx-y)^2$ with $x=3,w=2,y=5$ has derivative $6$ with respect to $w$.
6. $\sqrt{1+x}$ has slope $1/(2\sqrt{1+x})$, at $3$ gives $0.25$.

### `math-01-20` — Derivative of exponential functions  · deepen derivation

**Connections (§1).**
> This lesson builds on exponential functions and the derivative definition. Exponentials are central because their rate is tied to their current size. The natural exponential $e^x$ is the base where that rate matches the function itself.

**Motivation & Intuition (§2).**
> For $e^x$, a small input change factors out as the current value times a small growth factor. The remaining limit is the defining rate property of the base $e$.
>
> Other exponential bases are converted through $a^x=e^{x\ln a}$. The chain rule then shows that $\ln a$ is the scale factor translating base-$a$ growth into natural exponential growth.

**Definition & Assumptions (§3).** 1. Use the definition: $\frac{d}{dx}e^x=\lim_{h\to0}\frac{e^{x+h}-e^x}{h}$. 2. Factor $e^x$: $e^x\lim_{h\to0}\frac{e^h-1}{h}$. 3. The defining limit of $e$ gives $\lim_{h\to0}\frac{e^h-1}{h}=1$. 4. Therefore $(e^x)'=e^x$. 5. For $a^x=e^{x\ln a}$, apply the chain rule to get $(a^x)'=a^x\ln a$.

**Symbols.** $e^x$ is the natural exponential; $a>0$ is any base; $\ln a$ converts base $a$ growth to natural growth.

**Real-World Applications (§5).**
1. $\frac{d}{dx}e^x$ at $2$ is $e^2\approx7.389$.
2. $\frac{d}{dx}2^x$ at $3$ is $8\ln2\approx5.545$.
3. $e^{-0.5t}$ has derivative $-0.5e^{-0.5t}$, at $0$ gives $-0.5$.
4. $5e^{0.2t}$ has rate $1$ at $t=0$.
5. Softplus derivative of $\ln(1+e^x)$ at $0$ is $0.5$.
6. Continuous growth $100e^{0.03t}$ has initial rate $3$.

### `math-01-21` — Derivative of logarithmic functions  · deepen derivation

**Connections (§1).**
> This lesson builds on logarithms as inverse exponentials. Since $\ln x$ undoes $e^x$, its derivative can be found by differentiating the inverse relation. The result makes relative change a central calculus idea.

**Motivation & Intuition (§2).**
> The logarithm grows slowly because multiplying the input by a fixed factor only adds a fixed amount to the output. That slow growth appears in the derivative $1/x$, which gets smaller as $x$ gets larger.
>
> Implicit differentiation makes the derivation clean. Writing $y=\ln x$ as $e^y=x$ lets the exponential derivative and the chain rule solve for $dy/dx$.

**Definition & Assumptions (§3).** 1. Let $y=\ln x$ — this means $e^y=x$. 2. Differentiate both sides with respect to $x$. 3. The left side gives $e^y\frac{dy}{dx}$ by the chain rule. 4. The right side gives $1$. 5. Solve $\frac{dy}{dx}=1/e^y$. 6. Since $e^y=x$, $\frac{d}{dx}\ln x=1/x$. 7. For $\log_a x=\ln x/\ln a$, derivative is $1/(x\ln a)$.

**Symbols.** $x>0$; $y$ is the logarithm; $a$ is a positive base not equal to $1$.

**Real-World Applications (§5).**
1. $\frac{d}{dx}\ln x$ at $4$ is $0.25$.
2. $\frac{d}{dx}\log_{10}x$ at $100$ is $1/(100\ln10)\approx0.00434$.
3. $\ln(1+x)$ has slope $1/(1+x)$, at $3$ gives $0.25$.
4. Log loss $-\ln p$ has derivative $-1/p$, at $p=0.8$ gives $-1.25$.
5. $x\ln x$ has derivative $\ln x+1$, at $e^2$ gives $3$.
6. Elasticity derivative $d\ln y/dy$ at $y=20$ is $0.05$.

### `math-01-22` — Derivatives of trigonometric functions  · deepen derivation

**Connections (§1).**
> This lesson builds on trigonometric functions, limits, and angle measure in radians. Trigonometric derivatives describe how coordinates change during rotation. They are used throughout oscillation, waves, circular motion, and periodic modeling.

**Motivation & Intuition (§2).**
> Sine and cosine are linked because they are the vertical and horizontal coordinates of the same rotating point. As the point moves around the circle, the rate of change of one coordinate is controlled by the other coordinate.
>
> The derivation depends on angle-addition identities and the basic trigonometric limits. Radian measure is essential because those limits have the simple values used in the derivative formulas.

**Definition & Assumptions (§3).** 1. Start with $\frac{d}{dx}\sin x=\lim_{h\to0}\frac{\sin(x+h)-\sin x}{h}$. 2. Use $\sin(x+h)=\sin x\cos h+\cos x\sin h$. 3. Regroup as $\sin x\frac{\cos h-1}{h}+\cos x\frac{\sin h}{h}$. 4. Use limits $\lim_{h\to0}\frac{\sin h}{h}=1$ and $\lim_{h\to0}\frac{\cos h-1}{h}=0$. 5. Get $(\sin x)'=\cos x$. 6. The same identity method gives $(\cos x)'=-\sin x$, and quotient rule gives $(\tan x)'=\sec^2x$.

**Symbols.** $x$ is in radians; $h$ is angle change; $\sec x=1/\cos x$.

**Real-World Applications (§5).**
1. $\sin x$ slope at $\pi/3$ is $0.5$.
2. $\cos x$ slope at $\pi/6$ is $-0.5$.
3. $\tan x$ slope at $0$ is $1$.
4. $3\sin(2t)$ has derivative $6\cos(2t)$, at $0$ gives $6$.
5. Harmonic position $\cos t$ has velocity $-1$ at $\pi/2$.
6. $\sec^2(\pi/4)=2$.

### `math-01-23` — Implicit differentiation  · deepen derivation

**Connections (§1).**
> This lesson builds on the chain rule and equations for curves. Some curves are easier to describe by a relation between $x$ and $y$ than by solving for $y$. Implicit differentiation keeps that relation intact while finding slope.

**Motivation & Intuition (§2).**
> When $y$ depends on $x$ but is not isolated, differentiating terms involving $y$ requires the chain rule. Each derivative of a $y$ expression carries a factor of $dy/dx$.
>
> After differentiating the whole equation, the slope can be solved algebraically. This is especially useful for circles, level curves, and constraints where solving for one branch would be awkward.

**Definition & Assumptions (§3).** For $x^2+y^2=25$: 1. Treat $y$ as a function of $x$ — the curve may have changing vertical coordinate. 2. Differentiate $x^2$ to get $2x$. 3. Differentiate $y^2$ by the chain rule to get $2y\,dy/dx$. 4. Differentiate $25$ to get $0$. 5. Solve $2x+2y\,dy/dx=0$ for $dy/dx=-x/y$. 6. At $(3,4)$ the slope is $-3/4$.

**Symbols.** $dy/dx$ is the slope of the curve; $x,y$ are coordinates constrained by the equation.

**Real-World Applications (§5).**
1. Circle slope at $(3,4)$ is $-0.75$.
2. $xy=6$ gives $y'=-y/x$, at $(2,3)$ gives $-1.5$.
3. $x^2+xy+y^2=7$ gives $y'=-(2x+y)/(x+2y)$, at $(1,2)$ gives $-0.8$.
4. Level curve $x^2+y^2=1$ at $(\sqrt3/2,1/2)$ has slope $-\sqrt3\approx-1.732$.
5. Demand relation $pq=100$ has $dq/dp=-q/p$, at $(10,10)$ gives $-1$.
6. Unit circle at $(0,1)$ has slope $0$.

### `math-01-24` — Logarithmic differentiation  · deepen derivation

**Connections (§1).**
> This lesson builds on logarithm rules, implicit differentiation, and the product rule. Logarithmic differentiation is useful when a formula has products, quotients, powers, or variable exponents. It turns a complicated derivative into simpler additive pieces.

**Motivation & Intuition (§2).**
> Taking a logarithm can simplify structure before differentiating. Products become sums, quotients become differences, and exponents move down as factors, so the derivative is often easier on the log scale.
>
> Because the logarithm is applied to the dependent variable, implicit differentiation is used. After finding $y'/y$, multiplying by $y$ returns the derivative of the original function.

**Definition & Assumptions (§3).** For $y=x^x$: 1. Take logs: $\ln y=x\ln x$ — the exponent moves down. 2. Differentiate both sides: $\frac{y'}{y}=\ln x+1$ — use implicit differentiation on $\ln y$. 3. Multiply by $y$: $y'=y(\ln x+1)$. 4. Substitute $y=x^x$. 5. Get $\frac{d}{dx}x^x=x^x(\ln x+1)$.

**Symbols.** $y$ is the original function; $\ln y$ is differentiated implicitly; $x>0$ for real logarithms.

**Real-World Applications (§5).**
1. $x^x$ derivative at $1$ is $1$.
2. $x^x$ derivative at $e$ is $2e^e\approx30.309$.
3. $y=x^2\sqrt{x+1}$ has $y'/y=2/x+1/[2(x+1)]$, at $3$ with $y=18$ gives $13.5$.
4. $y=(x^2+1)^3$ at $1$ has derivative $24$.
5. $y=\frac{x^3}{x+1}$ has log derivative $3/x-1/(x+1)$, at $2$ gives $1.167$ and $y'=3.111$.
6. Elasticity of $x^x$ is $x(\ln x+1)$, at $1$ gives $1$.

### `math-01-25` — Related rates  · deepen derivation

**Connections (§1).**
> This lesson builds on implicit differentiation and rates of change. Related rates problems describe several quantities changing at the same time. An equation connecting the quantities lets one measured rate determine another.

**Motivation & Intuition (§2).**
> The central move is to write the geometric or physical relation before differentiating. Since the variables depend on time, differentiating with respect to time produces rates such as $dA/dt$ and $dr/dt$.
>
> Current numerical values are substituted after the derivative relation is found. This order matters because differentiating first preserves how the rates are connected at any moment.

**Definition & Assumptions (§3).** For a circle with area $A=\pi r^2$: 1. Identify the relation $A=\pi r^2$ — area depends on radius. 2. Treat $A$ and $r$ as functions of time. 3. Differentiate both sides with respect to $t$: $dA/dt=2\pi r\,dr/dt$. 4. Substitute $r=3$ and $dr/dt=0.5$. 5. Compute $dA/dt=3\pi\approx9.425$.

**Symbols.** $t$ is time; $dA/dt$ and $dr/dt$ are rates; current values are substituted after differentiating.

**Real-World Applications (§5).**
1. Circle area rate above is $3\pi\approx9.425$.
2. Sphere volume $V=4\pi r^3/3$ with $r=2$, $dr/dt=0.1$ gives $dV/dt=1.6\pi\approx5.027$.
3. Ladder $x^2+y^2=25$, $x=3$, $dx/dt=1$ gives $dy/dt=-0.75$.
4. Rectangle $A=lw$ with $l=4,w=5,l'=2,w'=1$ gives $A'=14$.
5. Distance $s=\sqrt{x^2+y^2}$ at $(3,4)$ with velocity $(1,2)$ gives $s'=2.2$.
6. Cone volume $V=\pi r^2h/3$ with $r=2,h=6,r'=0.1,h'=0.2$ gives $V'\approx2.094$.

### `math-01-26` — Linear approximation  · deepen derivation

**Connections (§1).**
> This lesson builds on differentiability and tangent lines. A differentiable function looks nearly linear when viewed very close to a point. Linear approximation uses that local line as a practical estimate.

**Motivation & Intuition (§2).**
> The derivative gives the slope of the tangent line at a base input. If the input moves a small amount, the tangent line predicts the output change by slope times displacement.
>
> Curvature creates error, so the approximation is best for nearby inputs. This local linear viewpoint is also the starting point for differentials, error estimates, Newton's method, and Taylor polynomials.

**Definition & Assumptions (§3).** 1. The derivative gives local slope $f'(a)$. 2. The tangent line through $(a,f(a))$ with that slope is $L(x)=f(a)+f'(a)(x-a)$. 3. Let $\Delta x=x-a$ — the input moves a small amount. 4. Then $f(a+\Delta x)\approx f(a)+f'(a)\Delta x$ — ignore higher-order curvature terms. 5. The approximation improves as $\Delta x\to0$.

**Symbols.** $a$ is the base point; $L(x)$ is the tangent-line approximation; $\Delta x$ is the small input change.

**Real-World Applications (§5).**
1. $\sqrt{4.1}\approx2+(1/4)(0.1)=2.025$.
2. True $\sqrt{4.1}\approx2.025$.
3. $e^{0.05}\approx1+0.05=1.05$.
4. $\ln(1.02)\approx0.02$.
5. $\sin(0.1)\approx0.1$.
6. For $x^2$ near $10$, $10.1^2\approx100+20(0.1)=102$.

### `math-01-27` — Differentials  · deepen derivation

**Connections (§1).**
> This lesson builds on linear approximation. Differentials give names to small input changes and their corresponding tangent-line output changes. They make local change calculations easier to track with units.

**Motivation & Intuition (§2).**
> The actual output change $\Delta y$ can be difficult to compute exactly, but the tangent-line change $dy$ is simple. It is the derivative at the point multiplied by the chosen input change $dx$.
>
> This notation is especially helpful in applications. It separates the measured input uncertainty from the function's sensitivity, so approximate error propagation becomes a direct multiplication.

**Definition & Assumptions (§3).** 1. Start from linear approximation $f(x+\Delta x)\approx f(x)+f'(x)\Delta x$. 2. Define $dx=\Delta x$ — name the small input change. 3. Define $dy=f'(x)dx$ — the tangent-line output change. 4. The actual change is $\Delta y=f(x+\Delta x)-f(x)$. 5. For small $dx$, $\Delta y\approx dy$.

**Symbols.** $dx$ is a small input change; $dy$ is the linearized output change; $f'(x)$ converts units of input to units of output.

**Real-World Applications (§5).**
1. $y=x^2$ at $x=3$, $dx=0.01$ gives $dy=0.06$.
2. $A=\pi r^2$ at $r=10$, $dr=0.1$ gives $dA=2\pi\approx6.283$.
3. $\ln x$ at $x=100$, $dx=1$ gives $dy=0.01$.
4. $e^x$ at $0$, $dx=0.02$ gives $dy=0.02$.
5. $\sqrt{x}$ at $25$, $dx=0.5$ gives $dy=0.05$.
6. Sensor scale $y=5x$, $dx=0.2$ gives $dy=1$.

### `math-01-28` — Indeterminate forms  · deepen derivation

**Connections (§1).**
> This lesson builds on limits and algebraic rewriting. An indeterminate form signals that substitution has not revealed the limiting behavior. The expression needs to be transformed before the limit can be read.

**Motivation & Intuition (§2).**
> Forms such as $0/0$ are not values. They mean that two competing effects are happening at once, and the first substitution does not say which effect dominates.
>
> Algebra, identities, logarithms, or later L'Hôpital's rule can expose the deciding structure. The goal is to rewrite the expression so known basic limits can be applied.

**Definition & Assumptions (§3).** For $\lim_{x\to0}\frac{1-\cos x}{x^2}$: 1. Direct substitution gives $0/0$ — more work is needed. 2. Multiply by the conjugate: $\frac{1-\cos x}{x^2}\cdot\frac{1+\cos x}{1+\cos x}$. 3. Use $1-\cos^2x=\sin^2x$. 4. Rewrite as $\left(\frac{\sin x}{x}\right)^2\frac{1}{1+\cos x}$. 5. Let $x\to0$ using $\sin x/x\to1$ and $\cos x\to1$. 6. The limit is $1/2$.

**Symbols.** $0/0$, $\infty/\infty$, $0\cdot\infty$, and $1^\infty$ describe forms, not values.

**Real-World Applications (§5).**
1. Worked limit is $0.5$.
2. $\lim_{x\to0}\frac{e^x-1}{x}=1$.
3. $\lim_{x\to0}x\ln x=0$ from the right.
4. $\lim_{x\to\infty}\frac{x}{e^x}=0$.
5. $\lim_{x\to0}(1+x)^{1/x}=e\approx2.718$.
6. $\lim_{x\to0}\frac{\ln(1+x)}{x}=1$.

### `math-01-29` — L'Hôpital's rule  · deepen derivation

**Connections (§1).**
> This lesson builds on indeterminate forms and derivatives. L'Hôpital's rule uses rates to compare two quantities whose values alone do not decide a limit. It is a theorem for specific forms, not a general simplification trick.

**Motivation & Intuition (§2).**
> When numerator and denominator both approach zero, their leading local behavior often comes from their tangent lines. Comparing those tangent-line slopes explains why derivative ratios can determine the original limit.
>
> The rule also applies to suitable $\infty/\infty$ forms under its hypotheses. The important habit is to check the form first, then differentiate numerator and denominator separately.

**Definition & Assumptions (§3).** 1. Suppose $f(a)=g(a)=0$ and $g'(a)\ne0$ — this is a $0/0$ form with a nonzero denominator slope. 2. Near $a$, use linear approximations $f(x)\approx f'(a)(x-a)$ and $g(x)\approx g'(a)(x-a)$. 3. Divide the approximations: $f(x)/g(x)\approx f'(a)/g'(a)$. 4. A full theorem justifies replacing the functions by derivative ratios under its hypotheses. 5. Thus $\lim f/g=\lim f'/g'$ when the derivative limit exists.

**Symbols.** $f,g$ are numerator and denominator; $a$ is the limiting point; the rule applies to $0/0$ or $\infty/\infty$ forms.

**Real-World Applications (§5).**
1. $\lim_{x\to0}\frac{\sin x}{x}=\lim\frac{\cos x}{1}=1$.
2. $\lim_{x\to0}\frac{e^x-1}{x}=1$.
3. $\lim_{x\to\infty}\frac{x}{e^x}=0$.
4. $\lim_{x\to0}\frac{1-\cos x}{x^2}=\lim\frac{\sin x}{2x}=0.5$.
5. $\lim_{x\to1}\frac{\ln x}{x-1}=1$.
6. $\lim_{x\to\infty}\frac{\ln x}{x}=0$.

### `math-01-30` — Critical points  · deepen derivation

**Connections (§1).**
> This lesson builds on the derivative as a sign and slope detector. Critical points identify interior locations where extrema may occur. They narrow optimization and graphing problems to a manageable candidate list.

**Motivation & Intuition (§2).**
> At a smooth local maximum or minimum, the graph cannot be rising through the point with a nonzero slope. The derivative must flatten to zero if it exists.
>
> A point is also critical when the derivative is missing, because corners and cusps can still create local extrema. Critical points are candidates, not automatic maxima or minima; later tests classify them.

**Definition & Assumptions (§3).** 1. At an interior local maximum or minimum, values on both sides are no better than $f(c)$. 2. For $h>0$, the quotient $[f(c+h)-f(c)]/h$ has one sign constraint. 3. For $h<0$, the quotient has the opposite sign constraint. 4. If the derivative exists, the two-sided limit must be both nonnegative and nonpositive. 5. Therefore $f'(c)=0$. 6. If the derivative does not exist, $c$ is still critical because the slope test cannot be applied.

**Symbols.** $c$ is a critical point; interior means not an endpoint; local extremum means nearby values are all no larger or no smaller.

**Real-World Applications (§5).**
1. $f=x^2-4x$ has $f'=2x-4$, critical point $x=2$.
2. $x^3-3x$ has critical points $x=\pm1$.
3. $|x|$ has critical point $0$ because derivative is missing.
4. $e^x$ has no critical point because derivative is always positive.
5. Loss $(w-5)^2$ has critical point $w=5$.
6. Revenue $-q^2+10q$ has critical point $q=5$.

### `math-01-31` — The first derivative test  · explain-only

**Connections (§1).**
> This lesson builds on critical points and derivative signs. The first derivative test uses increasing and decreasing intervals to classify local behavior. It is a practical decision procedure for graphs and optimization.

**Motivation & Intuition (§2).**
> A positive derivative means the function is increasing locally, and a negative derivative means it is decreasing locally. Around a critical point, those signs show whether the graph climbs into the point or falls away from it.
>
> A change from positive to negative gives a local maximum, while a change from negative to positive gives a local minimum. If the sign does not change, the critical point may be flat without being an extremum.

**Definition & Assumptions (§3).** Explain-only: this lesson is a decision procedure built from the meaning of derivative sign. Explain intervals, sign charts, and classification rather than forcing a separate formula.

**Symbols.** $f'>0$ means increasing; $f'<0$ means decreasing; sign change determines local behavior.

**Real-World Applications (§5).**
1. $f=x^2-4x$ has $f'<0$ before $2$ and $>0$ after, so $x=2$ is a minimum.
2. $-x^2+4x$ has maximum at $2$ with value $4$.
3. $x^3$ has $f'=3x^2\ge0$ and no max/min at $0$.
4. $x^3-3x$ has max at $-1$ and min at $1$.
5. Revenue $-q^2+10q$ increases before $5$ and decreases after.
6. Loss $(w-5)^2$ decreases before $5$ and increases after.

### `math-01-32` — Concavity  · deepen derivation

**Connections (§1).**
> This lesson builds on first derivatives and slope behavior. Concavity describes how the slope itself changes. It gives a precise way to talk about bending upward or bending downward.

**Motivation & Intuition (§2).**
> If slopes are increasing, tangent lines rotate upward as $x$ increases, and the graph is concave up. If slopes are decreasing, tangent lines rotate downward, and the graph is concave down.
>
> The second derivative measures this change in slope. Its sign is therefore the main computational test for concavity wherever the second derivative exists.

**Definition & Assumptions (§3).** 1. Concavity is about the derivative $f'$ — slopes are themselves a function. 2. If $f'$ is increasing, then $f''>0$ where the second derivative exists. 3. Increasing slopes make tangent lines rotate upward, so the graph is concave up. 4. If $f'$ is decreasing, then $f''<0$. 5. Decreasing slopes make the graph concave down. 6. For $f=x^3$, $f''=6x$, so it is concave down for $x<0$ and up for $x>0$.

**Symbols.** $f''$ is the derivative of $f'$; concave up means slopes increase; concave down means slopes decrease.

**Real-World Applications (§5).**
1. $x^2$ has $f''=2>0$, concave up.
2. $-x^2$ has $f''=-2<0$, concave down.
3. $x^3$ changes concavity at $0$.
4. $\ln x$ has $f''=-1/x^2$, so at $2$ it is $-0.25$.
5. $e^x$ has $f''=e^x$, so at $0$ it is $1$.
6. Cost $q^3$ has marginal cost increasing at rate $6q$, so at $q=2$ the rate is $12$.

### `math-01-33` — The second derivative test  · deepen derivation

**Connections (§1).**
> This lesson builds on critical points and concavity. The second derivative test classifies a flat critical point by the local bending of the graph. It gives a quick alternative to a full sign chart when the curvature is decisive.

**Motivation & Intuition (§2).**
> At a critical point with $f'(c)=0$, the linear term in the local approximation disappears. The first nonzero shape information often comes from the quadratic term involving $f''(c)$.
>
> Positive second derivative bends the graph like a bowl, making nearby values larger than the center. Negative second derivative bends it like a cap, making nearby values smaller than the center.

**Definition & Assumptions (§3).** 1. Let $f'(c)=0$ — the tangent is flat. 2. Use the second-order Taylor approximation $f(c+h)\approx f(c)+\frac12 f''(c)h^2$. 3. Since $h^2>0$ for $h\ne0$, the sign of the change is the sign of $f''(c)$. 4. If $f''(c)>0$, nearby values are larger, so $c$ is a local minimum. 5. If $f''(c)<0$, nearby values are smaller, so $c$ is a local maximum. 6. If $f''(c)=0$, the test gives no decision.

**Symbols.** $c$ is critical; $h$ is a small displacement; $f''(c)$ is local curvature.

**Real-World Applications (§5).**
1. $x^2$ at $0$ has $f''=2$, minimum.
2. $-x^2$ at $0$ has $f''=-2$, maximum.
3. $x^4$ has $f''(0)=0$, inconclusive but minimum.
4. $x^3$ has $f''(0)=0$, inconclusive and no extremum.
5. $x^3-3x$ has $f''(-1)=-6$ max and $f''(1)=6$ min.
6. Loss $(w-5)^2$ has $f''=2$, so $w=5$ is a minimum.

### `math-01-34` — Inflection points  · deepen derivation

**Connections (§1).**
> This lesson builds on concavity and the second derivative. Inflection points mark where the bending pattern changes. They help complete a graph's shape beyond just maxima and minima.

**Motivation & Intuition (§2).**
> A zero of the second derivative is only a candidate for an inflection point. The graph must actually switch concavity from up to down or from down to up.
>
> Checking signs on both sides keeps the test honest. If the sign of $f''$ changes, slopes switch from increasing to decreasing or the reverse, and the point is an inflection point.

**Definition & Assumptions (§3).** 1. Concavity is controlled by the sign of $f''$. 2. A possible inflection point occurs where $f''=0$ or $f''$ is undefined. 3. Check signs on both sides — a zero alone is not enough. 4. If $f''$ changes sign, slopes switch from increasing to decreasing or vice versa. 5. That sign change is an inflection point. 6. For $f=x^3$, $f''=6x$ changes from negative to positive at $0$.

**Symbols.** $f''$ is curvature; sign change means crossing from concave up to concave down or back.

**Real-World Applications (§5).**
1. $x^3$ has inflection at $0$.
2. $x^4$ has $f''(0)=0$ but no inflection.
3. Logistic $1/(1+e^{-x})$ has inflection at $0$ with value $0.5$.
4. $\sin x$ has inflections at $0$ and $\pi$ in $[0,\pi]$.
5. $x^3-3x$ has inflection at $0$.
6. $\ln x$ has no inflection on $x>0$ because $f''<0$.

### `math-01-35` — The Mean Value Theorem  · deepen derivation

**Connections (§1).**
> This lesson builds on continuity, differentiability, and average rate of change. The Mean Value Theorem connects a secant slope across an interval to a tangent slope inside it. It is one of the main bridges between global change and local derivative information.

**Motivation & Intuition (§2).**
> The theorem says that a smooth enough function cannot complete a net change without matching its average rate somewhere along the way. The graph may speed up and slow down, but at some interior point its instantaneous slope equals the secant slope.
>
> Subtracting the secant line turns the statement into a function with equal endpoint values. Rolle's theorem then supplies a point where the adjusted function has horizontal tangent, which gives the desired slope equality.

**Definition & Assumptions (§3).** 1. Assume $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$. 2. Compute the secant slope $m=\frac{f(b)-f(a)}{b-a}$. 3. Build $g(x)=f(x)-[f(a)+m(x-a)]$ — subtract the secant line. 4. Then $g(a)=0$ and $g(b)=0$. 5. Rolle's theorem gives some $c$ with $g'(c)=0$. 6. Since $g'(x)=f'(x)-m$, $f'(c)=m$.

**Symbols.** $m$ is average rate; $c$ is the guaranteed interior point; continuity and differentiability are the hypotheses.

**Real-World Applications (§5).**
1. $f=x^2$ on $[1,3]$ has average slope $4$, so $c=2$.
2. Distance $100$ miles in $2$ hours means some instant speed was $50$ mph.
3. $\sin x$ on $[0,\pi]$ has average slope $0$, so some $c$ has $\cos c=0$.
4. $e^x$ on $[0,1]$ has average slope $e-1\approx1.718$, so $c=\ln(e-1)\approx0.541$.
5. If $|f'|\le3$ over length $4$, output changes by at most $12$.
6. $x^3$ on $[0,2]$ has average slope $4$, so $c=2/\sqrt3\approx1.155$.

### `math-01-36` — Curve sketching  · explain-only

**Connections (§1).**
> This lesson builds on limits, derivative tests, concavity, and asymptotes. Curve sketching brings those tools together into one organized picture. It is a synthesis skill rather than a new theorem.

**Motivation & Intuition (§2).**
> A graph can be understood by collecting reliable clues. Intercepts locate crossings, limits describe end behavior, $f'$ shows increasing and decreasing intervals, and $f''$ shows bending.
>
> The purpose is to assemble these clues in a fixed order. A careful checklist prevents one feature, such as an intercept or asymptote, from being mistaken for the whole graph.

**Definition & Assumptions (§3).** Explain-only: this lesson organizes previous tests. Show a fixed checklist and a worked graph summary rather than forcing a proof.

**Symbols.** Intercepts locate crossings; critical points locate flat or sharp candidates; $f'$ gives increasing/decreasing; $f''$ gives concavity; limits give end behavior.

**Real-World Applications (§5).**
1. $f=x^3-3x$ has critical points $-1,1$ and values $2,-2$.
2. It increases on $(-\infty,-1)$ and $(1,\infty)$.
3. It decreases on $(-1,1)$.
4. It has inflection at $0$.
5. $x/(x+1)$ has vertical asymptote $x=-1$ and horizontal asymptote $y=1$.
6. $x^2-4$ crosses at $x=\pm2$.

### `math-01-37` — Applied optimization  · explain-only

**Connections (§1).**
> This lesson builds on critical points, endpoints, and derivative tests. Applied optimization translates a real constraint into a one-variable calculus problem. It connects the symbolic tools of the section to decision-making.

**Motivation & Intuition (§2).**
> The hardest part is usually modeling. The objective names what should be maximized or minimized, while the constraints describe which values are allowed.
>
> Once the problem is reduced to one variable on a feasible domain, calculus supplies candidates from critical points and endpoints. Comparing objective values then identifies the best feasible choice.

**Definition & Assumptions (§3).** Explain-only: the method is a modeling workflow. Define variables, write the objective, use constraints to reduce to one variable, find candidates, and compare values.

**Symbols.** The objective is the quantity optimized; constraints restrict allowed values; feasible interval is the domain that makes sense in context.

**Real-World Applications (§5).**
1. Max area with perimeter $20$: $A=x(10-x)$ gives $x=5$, area $25$.
2. Min $x^2+(10-x)^2$ gives $x=5$, value $50$.
3. Revenue $q(100-q)$ maximizes at $q=50$, revenue $2500$.
4. Box volume $x^2(12-4x)$ maximizes at $x=2$, volume $16$.
5. Closest point on $y=x$ to $(3,0)$ is $(1.5,1.5)$ with distance $\sqrt{4.5}\approx2.121$.
6. Fence three sides with $60$ feet gives dimensions $15$ by $30$, area $450$.

### `math-01-38` — Antiderivatives  · deepen derivation

**Connections (§1).**
> This lesson builds on derivative rules, especially the power rule. Antiderivatives reverse differentiation by asking which function has a given derivative. They are the entry point to indefinite integrals and accumulated change.

**Motivation & Intuition (§2).**
> Differentiation loses constants because every constant has derivative zero. That is why an antiderivative represents a whole family of functions rather than one function.
>
> For powers, the reverse power rule is found by undoing the exponent drop and coefficient multiplication. The exception $n=-1$ leads to the logarithm, which becomes its own important antiderivative case.

**Definition & Assumptions (§3).** 1. Seek $F$ with $F'(x)=x^n$. 2. Use the power rule in reverse: derivative of $x^{n+1}$ is $(n+1)x^n$. 3. Divide by $n+1$ to make the coefficient $1$. 4. Therefore $F=x^{n+1}/(n+1)$ for $n\ne-1$. 5. Add $C$ because constants differentiate to $0$. 6. Thus $\int x^n dx=x^{n+1}/(n+1)+C$.

**Symbols.** $F$ is an antiderivative; $C$ is an arbitrary constant; $\int f(x)dx$ denotes the family of antiderivatives.

**Real-World Applications (§5).**
1. $\int x^2dx=x^3/3+C$, from $0$ to $3$ gives $9$.
2. $\int 2x dx=x^2+C$.
3. $\int 1/x dx=\ln|x|+C$.
4. Velocity $v=3t^2$ gives position $t^3+C$.
5. Marginal cost $2q$ gives cost $q^2+C$.
6. $\int e^x dx=e^x+C$, increase from $0$ to $1$ is $e-1\approx1.718$.

### `math-01-39` — Riemann sums  · deepen derivation

**Connections (§1).**
> This lesson builds on area formulas and finite sums. Riemann sums approximate curved area by adding many rectangle areas. They make the definite integral a limit of ordinary arithmetic.

**Motivation & Intuition (§2).**
> On each small subinterval, a rectangle uses one sample height to represent the function. Multiplying that height by the width gives a small area contribution.
>
> As the partition is refined, the rectangles better track the curve. When the sums approach a single value independent of sample choices, that value is the definite integral.

**Definition & Assumptions (§3).** 1. Split $[a,b]$ into $n$ pieces of width $\Delta x=(b-a)/n$. 2. Choose a sample point $x_i^*$ in each piece. 3. Rectangle $i$ has area $f(x_i^*)\Delta x$. 4. Add all rectangles: $\sum_{i=1}^n f(x_i^*)\Delta x$. 5. Let the largest width go to $0$. 6. The limit is $\int_a^b f(x)dx$.

**Symbols.** $\Delta x$ is rectangle width; $x_i^*$ is sample point; the summation totals rectangle areas.

**Real-World Applications (§5).**
1. Right sum for $f=x$ on $[0,1]$ with $n=4$ is $(0.25+0.5+0.75+1)0.25=0.625$.
2. Left sum is $(0+0.25+0.5+0.75)0.25=0.375$.
3. Midpoint sum is $0.5$ exactly for $f=x$.
4. Right sum for $x^2$ with $n=2$ is $(0.25+1)0.5=0.625$.
5. Left sum for $x^2$ with $n=2$ is $0.125$.
6. Exact area under $x$ on $[0,1]$ is $0.5$.

### `math-01-40` — The definite integral  · deepen derivation

**Connections (§1).**
> This lesson builds on Riemann sums. The definite integral records signed accumulation over an interval. It turns many small local heights into one total net amount.

**Motivation & Intuition (§2).**
> Positive function values contribute positive signed area, while negative values contribute negative signed area. This is why a definite integral can represent net displacement as well as geometric area.
>
> The definition comes from refining Riemann sums until the accumulated total stabilizes. Constant functions anchor the meaning because height times total width gives the expected rectangle area.

**Definition & Assumptions (§3).** 1. Begin with Riemann sums $\sum f(x_i^*)\Delta x$ — each term is a small signed rectangle. 2. Refine the partition so widths shrink. 3. If the sums approach one value independent of sample choices, call it $\int_a^b f(x)dx$. 4. For constant $c$, each rectangle has height $c$. 5. The total is $c\sum\Delta x=c(b-a)$. 6. This anchors the integral as accumulated height times width.

**Symbols.** $a,b$ are bounds; $dx$ marks the variable and limiting width; signed area can be positive, negative, or zero.

**Real-World Applications (§5).**
1. $\int_0^3 2dx=6$.
2. $\int_0^1 xdx=0.5$.
3. $\int_0^2 x^2dx=8/3\approx2.667$.
4. $\int_0^\pi\sin xdx=2$.
5. Net displacement from $v=t-1$ on $[0,3]$ is $1.5$.
6. Average value of $x^2$ on $[0,3]$ is $3$.

### `math-01-41` — The Fundamental Theorem of Calculus  · deepen derivation

**Connections (§1).**
> This lesson builds on derivatives, antiderivatives, and definite integrals. The Fundamental Theorem of Calculus shows that rate and accumulation are inverse ideas. It is the central connection between differential and integral calculus.

**Motivation & Intuition (§2).**
> An accumulation function adds area from a fixed starting point up to a moving endpoint. If the endpoint moves a tiny amount, the new area is a thin strip whose height is approximately the function value at that endpoint.
>
> This explains why differentiating accumulated area returns the original function. The second part says that definite integrals can be evaluated by any antiderivative, turning accumulation into endpoint subtraction.

**Definition & Assumptions (§3).** 1. Define $A(x)=\int_a^x f(t)dt$ — accumulated area up to $x$. 2. The change $A(x+h)-A(x)=\int_x^{x+h}f(t)dt$ — only the new thin strip remains. 3. Divide by $h$ to get the average value of $f$ on $[x,x+h]$. 4. Let $h\to0$ — continuity makes the average value approach $f(x)$. 5. Thus $A'(x)=f(x)$. 6. If $F'=f$, then $\int_a^b f(x)dx=F(b)-F(a)$.

**Symbols.** $A(x)$ is an accumulation function; $F$ is any antiderivative; $a,b$ are bounds.

**Real-World Applications (§5).**
1. $\int_0^3 x^2dx=3^3/3=9$.
2. $\frac{d}{dx}\int_0^x\cos tdt=\cos x$.
3. $\int_1^e 1/x dx=1$.
4. Position change from velocity $2t$ over $[0,4]$ is $16$.
5. Accumulated probability density $2x$ on $[0,1]$ totals $1$.
6. $\int_0^\pi\sin xdx=2$.

### `math-01-42` — Integration by substitution  · deepen derivation

**Connections (§1).**
> This lesson builds on the chain rule and antiderivatives. Substitution is the integration method that recognizes a composition and its derivative. It is the reverse direction of differentiating an outside function of an inside function.

**Motivation & Intuition (§2).**
> When an integrand contains an inside expression and a matching derivative factor, the integral is often simpler in a new variable. Naming the inside expression $u$ packages the chain rule structure.
>
> The differential $du$ carries the derivative factor needed to change variables. After integrating in $u$, substituting back returns the answer in the original variable.

**Definition & Assumptions (§3).** 1. Start with the chain rule: $\frac{d}{dx}F(g(x))=F'(g(x))g'(x)$. 2. Let $f=F'$. 3. Then $\int f(g(x))g'(x)dx=F(g(x))+C$. 4. Name $u=g(x)$ and $du=g'(x)dx$. 5. The integral becomes $\int f(u)du$. 6. Substitute back after integrating.

**Symbols.** $u$ is the new variable; $du$ carries the derivative factor; $C$ is the constant of integration.

**Real-World Applications (§5).**
1. $\int 2x\cos(x^2)dx=\sin(x^2)+C$.
2. From $0$ to $1$, this gives $\sin1\approx0.841$.
3. $\int_0^1 3(3x+1)^2dx=21$.
4. $\int x e^{x^2}dx=\frac12e^{x^2}+C$.
5. $\int_0^1 x/(1+x^2)dx=\frac12\ln2\approx0.347$.
6. $\int_0^2 2x\sqrt{1+x^2}dx=\frac23(5^{3/2}-1)\approx6.787$.

### `math-01-43` — Integration by parts  · deepen derivation

**Connections (§1).**
> This lesson builds on the product rule and antiderivatives. Integration by parts is used when an integrand is a product but substitution does not remove the difficulty. It transfers differentiation from one factor to another.

**Motivation & Intuition (§2).**
> The product rule says the derivative of a product has two terms. Integrating that identity and rearranging gives a way to replace one product integral with another.
>
> The method depends on choosing $u$ and $dv$ well. A good choice makes $u$ simpler after differentiation and keeps $dv$ easy to integrate.

**Definition & Assumptions (§3).** 1. Start with the product rule $(uv)'=u'v+uv'$. 2. Integrate both sides: $uv=\int u'v\,dx+\int uv'\,dx$. 3. Rearrange to isolate one integral. 4. Get $\int u\,dv=uv-\int v\,du$. 5. Choose $u$ to become simpler after differentiating and $dv$ to be easy to integrate. 6. For $\int x e^x dx$, set $u=x$, $dv=e^x dx$, giving $xe^x-e^x+C$.

**Symbols.** $u$ is the factor differentiated; $dv$ is the factor integrated; $du$ and $v$ are the transformed pieces.

**Real-World Applications (§5).**
1. $\int x e^x dx=e^x(x-1)+C$.
2. From $0$ to $1$, $\int_0^1 xe^x dx=1$.
3. $\int \ln x dx=x\ln x-x+C$.
4. $\int_1^e\ln x dx=1$.
5. $\int x\cos xdx=x\sin x+\cos x+C$.
6. $\int_0^\pi x\sin xdx=\pi$.

### `math-01-44` — Trigonometric integrals  · deepen derivation

**Connections (§1).**
> This lesson builds on trigonometric identities and substitution. Trigonometric integrals often become manageable after powers and products are rewritten. The identities turn oscillating expressions into pieces with known antiderivatives.

**Motivation & Intuition (§2).**
> Odd powers allow one factor to be saved for $du$ while the remaining even power is converted with $\sin^2x+\cos^2x=1$. Even powers often use half-angle identities to lower the power.
>
> The goal is not to memorize every integral separately. It is to choose an identity that exposes either a substitution pattern or a simpler standard trigonometric integral.

**Definition & Assumptions (§3).** For $\int\sin^3x\,dx$: 1. Split $\sin^3x=\sin x(1-\cos^2x)$ — keep one sine for substitution. 2. Let $u=\cos x$, so $du=-\sin xdx$. 3. Rewrite the integral as $-\int(1-u^2)du$. 4. Integrate: $-u+u^3/3+C$. 5. Substitute back: $-\cos x+\cos^3x/3+C$.

**Symbols.** Identities such as $\sin^2x+\cos^2x=1$ convert powers; $u$ is the substitution variable.

**Real-World Applications (§5).**
1. $\int_0^{\pi/2}\sin^3x dx=2/3$.
2. $\int_0^{\pi/2}\cos^2x dx=\pi/4$.
3. $\int_0^{\pi}\sin^2x dx=\pi/2$.
4. $\int\sin x\cos x dx=\frac12\sin^2x+C$.
5. $\int_0^{\pi/2}\sin x\cos xdx=0.5$.
6. Average of $\sin^2x$ over $[0,2\pi]$ is $0.5$.

### `math-01-45` — Trigonometric substitution  · deepen derivation

**Connections (§1).**
> This lesson builds on substitution, trigonometric identities, and right-triangle geometry. Trigonometric substitution handles square roots that resemble Pythagorean forms. It changes an algebraic root into a trigonometric identity.

**Motivation & Intuition (§2).**
> Expressions such as $\sqrt{a^2-x^2}$ match identities like $1-\sin^2\thetaheta=\cos^2\thetaheta$. Choosing $x=a\sin\thetaheta$ makes the square root simplify in the new variable.
>
> After the integral is evaluated in $\theta$, a triangle or inverse substitution returns the answer to $x$. The method works because the substitution builds the right triangle into the algebra.

**Definition & Assumptions (§3).** For $\int\sqrt{a^2-x^2}dx$: 1. Set $x=a\sin\theta$ — this matches $1-\sin^2\theta$. 2. Then $dx=a\cos\theta d\theta$. 3. The root becomes $\sqrt{a^2-a^2\sin^2\theta}=a\cos\theta$ on the chosen interval. 4. The integral becomes $a^2\int\cos^2\theta d\theta$. 5. Use $\cos^2\theta=(1+\cos2\theta)/2$. 6. Integrate and substitute back when needed.

**Symbols.** $a$ is a positive constant; $\theta$ is the trig angle; the triangle relates $x$, $a$, and the remaining root.

**Real-World Applications (§5).**
1. $\int_0^1\sqrt{1-x^2}dx=\pi/4$.
2. Area of unit circle from four quadrants is $\pi$.
3. $\sqrt{4-x^2}$ uses $x=2\sin\theta$.
4. At $x=1$ with $a=2$, $\theta=\pi/6$.
5. $\sqrt{x^2+9}$ uses $x=3\tan\theta$.
6. $\int_0^1\frac{dx}{\sqrt{1-x^2}}=\pi/2$.

### `math-01-46` — Partial fraction decomposition  · deepen derivation

**Connections (§1).**
> This lesson builds on rational functions and logarithmic antiderivatives. Partial fractions decompose a complicated rational expression into simpler terms. It is especially useful before integrating rational functions.

**Motivation & Intuition (§2).**
> A denominator that factors into simpler pieces suggests writing the fraction as a sum over those pieces. Clearing denominators turns the decomposition into an algebra problem for constants.
>
> Once those constants are found, each simple fraction can be integrated or analyzed separately. Linear factors usually lead to logarithms, while repeated or irreducible factors have their own standard forms.

**Definition & Assumptions (§3).** For $\frac{3x+5}{(x+1)(x+2)}$: 1. Assume $\frac{3x+5}{(x+1)(x+2)}=\frac{A}{x+1}+\frac{B}{x+2}$ — denominators are linear factors. 2. Multiply by $(x+1)(x+2)$ to clear denominators. 3. Get $3x+5=A(x+2)+B(x+1)$. 4. Substitute $x=-1$ to get $2=A$, because the $B$ term vanishes. 5. Substitute $x=-2$ to get $-1=-B$, so $B=1$. 6. The decomposition is $2/(x+1)+1/(x+2)$.

**Symbols.** $A,B$ are constants to solve; factors in the denominator determine the simpler fractions.

**Real-World Applications (§5).**
1. Worked decomposition has $A=2,B=1$.
2. $\int \frac{3x+5}{(x+1)(x+2)}dx=2\ln|x+1|+\ln|x+2|+C$.
3. $1/[x(x+1)]=1/x-1/(x+1)$.
4. $\int_1^2 1/[x(x+1)]dx=\ln(4/3)\approx0.288$.
5. $\frac{5}{(x-1)(x+4)}=1/(x-1)-1/(x+4)$.
6. $\frac{1}{x^2-1}=\frac12/(x-1)-\frac12/(x+1)$.

### `math-01-47` — Improper integrals  · deepen derivation

**Connections (§1).**
> This lesson builds on definite integrals and limits. Improper integrals extend integration to infinite intervals or unbounded functions. The integral is accepted only if the limiting area is finite.

**Motivation & Intuition (§2).**
> An infinite endpoint is handled by replacing it with a finite cutoff. The ordinary definite integral is computed first, and then the cutoff is sent toward infinity.
>
> Convergence means this limiting process settles to a finite value. Tail behavior controls the outcome, which is why powers like $x^{-p}$ produce a sharp threshold at $p=1$.

**Definition & Assumptions (§3).** For $\int_1^\infty x^{-p}dx$: 1. Replace the infinite upper bound by $B$. 2. Integrate $\int_1^B x^{-p}dx=\frac{B^{1-p}-1}{1-p}$ for $p\ne1$. 3. Let $B\to\infty$. 4. If $p>1$, then $B^{1-p}\to0$, so the value is $1/(p-1)$. 5. If $p<1$, the term grows without bound, so the integral diverges. 6. For $p=1$, $\int_1^B dx/x=\ln B$ diverges.

**Symbols.** $B$ is a finite cutoff; convergence means the cutoff limit exists and is finite; $p$ controls tail decay.

**Real-World Applications (§5).**
1. $\int_1^\infty x^{-2}dx=1$.
2. $\int_1^\infty x^{-3}dx=0.5$.
3. $\int_1^\infty 1/x\,dx$ diverges.
4. $\int_0^1 x^{-1/2}dx=2$.
5. $\int_0^1 x^{-2}dx$ diverges.
6. $\int_0^\infty e^{-x}dx=1$.

### `math-01-48` — Area between curves  · deepen derivation

**Connections (§1).**
> This lesson builds on definite integrals as accumulation. Area between curves accumulates the vertical distance between an upper and a lower graph. It turns a geometric region into an integral of height.

**Motivation & Intuition (§2).**
> For a thin vertical slice, the width is $dx$ and the height is top minus bottom. Multiplying gives a small rectangle whose area approximates the slice of the region.
>
> If the curves cross, the identity of top and bottom changes. Splitting at intersection points keeps each integral's height nonnegative and correctly represents the total area.

**Definition & Assumptions (§3).** 1. On a small interval of width $dx$, the vertical height is $f(x)-g(x)$ when $f\ge g$. 2. Small area is approximately $[f(x)-g(x)]dx$. 3. Add across the interval with an integral. 4. Area is $\int_a^b [f(x)-g(x)]dx$. 5. If curves cross, split at intersection points so top and bottom are fixed on each piece.

**Symbols.** $f$ is the upper curve; $g$ is the lower curve; $a,b$ bound the region; area is nonnegative.

**Real-World Applications (§5).**
1. Between $x$ and $x^2$ on $[0,1]$ is $1/6\approx0.167$.
2. Between $4$ and $x^2$ on $[-2,2]$ is $32/3\approx10.667$.
3. Between $2x$ and $x$ on $[0,3]$ is $4.5$.
4. Between $\sqrt{x}$ and $x$ on $[0,1]$ is $1/6$.
5. Demand surplus between $10-q$ and $5$ on $[0,5]$ is $12.5$.
6. Absolute area between $x^2$ and $x$ on $[-1,1]$ is $5/6\approx0.833$.

### `math-01-49` — Volumes of revolution  · deepen derivation

**Connections (§1).**
> This lesson builds on definite integrals and cross-sectional area. Volumes of revolution come from rotating a region and adding the volumes of thin slices. Disks, washers, and shells are different ways to choose those slices.

**Motivation & Intuition (§2).**
> When a vertical slice is rotated about the $x$-axis, it forms a disk if there is no hole and a washer if there is an inner radius. The area of that circular cross-section is then multiplied by the slice thickness.
>
> The integral adds all slice volumes across the interval. Choosing the slicing direction to match the axis of rotation usually determines whether disks, washers, or shells are simplest.

**Definition & Assumptions (§3).** 1. Rotate $y=f(x)\ge0$ around the $x$-axis. 2. A thin slice of width $dx$ becomes a disk. 3. Its radius is $f(x)$, so area is $\pi[f(x)]^2$. 4. Slice volume is $\pi[f(x)]^2dx$. 5. Add slices to get $V=\pi\int_a^b[f(x)]^2dx$. 6. With an inner radius $g(x)$, subtract to get washers: $\pi\int(R^2-r^2)dx$.

**Symbols.** $R$ is outer radius; $r$ is inner radius; $dx$ is slice thickness.

**Real-World Applications (§5).**
1. Rotate $y=x$ on $[0,1]$: $V=\pi/3\approx1.047$.
2. Rotate $y=2$ on $[0,3]$: cylinder volume $12\pi\approx37.699$.
3. Washer with $R=3,r=1,h=2$ gives $16\pi\approx50.265$.
4. Rotate $y=\sqrt{x}$ on $[0,4]$: $8\pi\approx25.133$.
5. Cone radius $2$, height $3$ has volume $4\pi\approx12.566$.
6. Shell method for $y=x$ on $[0,1]$ about $y$-axis gives $2\pi/3\approx2.094$.

### `math-01-50` — Arc length  · deepen derivation

**Connections (§1).**
> This lesson builds on derivatives and the Pythagorean theorem. Arc length measures distance along a curve by adding many tiny straight segments. The derivative supplies the local rise for each tiny run.

**Motivation & Intuition (§2).**
> A small piece of graph has horizontal change $dx$ and vertical change approximately $f'(x)dx$. Those two changes form the legs of a tiny right triangle.
>
> Pythagoras gives the segment length, and integration adds those lengths along the interval. The formula reduces to ordinary horizontal length when the slope is zero.

**Definition & Assumptions (§3).** 1. Split the curve $y=f(x)$ into short pieces. 2. A small piece has horizontal change $dx$ and vertical change $dy\approx f'(x)dx$. 3. Pythagoras gives segment length $ds\approx\sqrt{dx^2+dy^2}$. 4. Factor $dx$: $ds\approx\sqrt{1+[f'(x)]^2}dx$. 5. Add and refine to get $L=\int_a^b\sqrt{1+[f'(x)]^2}dx$.

**Symbols.** $ds$ is a small arc length; $f'(x)$ is local slope; $L$ is total length.

**Real-World Applications (§5).**
1. Line $y=3x$ on $[0,4]$ has length $4\sqrt{10}\approx12.649$.
2. Horizontal line on length $5$ has arc length $5$.
3. $y=x$ on $[0,1]$ has length $\sqrt2\approx1.414$.
4. $y=x^2$ on $[0,1]$ has length about $1.479$.
5. Parametric unit circle length is $2\pi\approx6.283$.
6. Training curve with constant speed $0.2$ for $10$ units has length $2$.

### `math-01-51` — Parametric equations and calculus  · deepen derivation

**Connections (§1).**
> This lesson builds on functions, derivatives, and motion. Parametric equations describe coordinates as functions of a third variable, often time. They allow calculus to follow curves that may not be functions of $x$ alone.

**Motivation & Intuition (§2).**
> Instead of eliminating the parameter, calculus can compare the component changes directly. The slope $dy/dx$ is the vertical rate divided by the horizontal rate when the horizontal rate is not zero.
>
> The same viewpoint gives speed, acceleration, second derivatives, and arc length. Parametric form is especially natural for motion, circles, and paths traced over time.

**Definition & Assumptions (§3).** 1. Let $x=x(t)$ and $y=y(t)$. 2. Small changes satisfy $dx=x'(t)dt$ and $dy=y'(t)dt$. 3. The slope is $dy/dx=(dy/dt)/(dx/dt)$ when $dx/dt\ne0$. 4. The second derivative differentiates $dy/dx$ with respect to $t$ and divides by $dx/dt$. 5. Arc length follows from Pythagoras: $ds=\sqrt{(x')^2+(y')^2}dt$.

**Symbols.** $t$ is the parameter; $x'(t),y'(t)$ are component velocities; $dy/dx$ is geometric slope.

**Real-World Applications (§5).**
1. $x=t^2,y=t^3$ gives $dy/dx=3t/2$, at $t=2$ gives $3$.
2. Unit circle $x=\cos t,y=\sin t$ has slope $-\cot t$, at $\pi/4$ gives $-1$.
3. Speed of $(t,t^2)$ at $1$ is $\sqrt5\approx2.236$.
4. Circle speed is $1$.
5. Area for unit circle by parametric formula is $\pi$.
6. Projectile $x=10t,y=20t-5t^2$ has slope $1$ at $t=1$.

### `math-01-52` — Polar coordinates and calculus  · deepen derivation

**Connections (§1).**
> This lesson builds on coordinates and trigonometric geometry. Polar coordinates describe position by distance from the origin and angle. They fit circular, radial, and spiral shapes more directly than rectangular coordinates.

**Motivation & Intuition (§2).**
> The conversion formulas $x=r\cos\thetaheta$ and $y=r\sin\thetaheta$ connect polar coordinates to the usual plane. A polar curve changes radius as the angle changes.
>
> Area is built from small sectors rather than rectangles. Each sector has area approximately $\frac12 r^2d\thetaheta$, and integrating those sector areas gives the polar area formula.

**Definition & Assumptions (§3).** 1. Coordinates are $x=r\cos\theta$ and $y=r\sin\theta$. 2. A small sector of radius $r$ and angle $d\theta$ has area about $\frac12 r^2d\theta$. 3. For a curve $r=f(\theta)$, add sectors from $\alpha$ to $\beta$. 4. Area is $A=\frac12\int_\alpha^\beta r^2d\theta$. 5. Slope follows from parametric form: $dy/dx=(dy/d\theta)/(dx/d\theta)$.

**Symbols.** $r$ is distance from origin; $\theta$ is angle; $d\theta$ is small angular width.

**Real-World Applications (§5).**
1. Circle $r=2$ over $[0,2\pi]$ has area $4\pi\approx12.566$.
2. Unit circle area is $\pi$.
3. Spiral $r=\theta$ from $0$ to $1$ has area $1/6\approx0.167$.
4. Point $(r,\theta)=(2,\pi/3)$ has Cartesian $(1,\sqrt3)$.
5. $r=3\cos\theta$ is a circle of area $9\pi/4\approx7.069$.
6. Sector radius $5$, angle $0.2$ has area $2.5$.

### `math-01-53` — Sequences  · deepen derivation

**Connections (§1).**
> This lesson builds on functions and limits. A sequence is a function whose inputs are positive integers. It provides the language for long-run term behavior before moving to infinite series.

**Motivation & Intuition (§2).**
> A sequence limit asks what happens to individual terms as the index grows. This is different from adding the terms; it only tracks where the list entries themselves settle.
>
> The formal idea of closeness uses a cutoff index. After some sufficiently large $N$, every later term must stay within any chosen tolerance of the proposed limit.

**Definition & Assumptions (§3).** 1. A sequence is a function $a_n$ whose input is an integer $n$. 2. To test $a_n\to L$, examine $|a_n-L|$ as $n$ grows. 3. For $a_n=1/n$, compute $|1/n-0|=1/n$. 4. Given any tolerance $\varepsilon>0$, choose $N>1/\varepsilon$. 5. Then for $n>N$, $1/n<\varepsilon$. 6. Therefore $1/n\to0$.

**Symbols.** $n$ is the index; $a_n$ is term $n$; $L$ is the sequence limit; $N$ is a cutoff after which terms stay close.

**Real-World Applications (§5).**
1. $a_{10}=0.1$ for $a_n=1/n$.
2. $2^n$ has $a_5=32$.
3. Geometric $0.5^n$ has $a_4=0.0625$.
4. Arithmetic $3+2n$ has $a_{10}=23$.
5. Running error $0.9^n$ after $20$ steps is $0.122$.
6. Sequence $(n+1)/n$ tends to $1$ and has term $1.1$ at $n=10$.

### `math-01-54` — Series  · deepen derivation

**Connections (§1).**
> This lesson builds on sequences and finite sums. A series adds sequence terms and studies the behavior of the running totals. It asks whether infinitely many additions can approach a finite value.

**Motivation & Intuition (§2).**
> Partial sums are the bridge from finite arithmetic to infinite series. Each partial sum is ordinary addition, and convergence means those partial sums settle toward one number.
>
> For convergence, the terms must at least approach zero; otherwise each new addition remains too large for the totals to settle. That condition is necessary but not sufficient, as the harmonic series shows.

**Definition & Assumptions (§3).** 1. Start with terms $a_1,a_2,\dots$. 2. Define partial sums $s_n=a_1+\cdots+a_n$ — these are finite totals. 3. The infinite series $\sum a_n$ converges if $s_n$ has a finite limit. 4. If $a_n$ does not approach $0$, then partial sums cannot settle. 5. Therefore $a_n\to0$ is necessary for convergence. 6. It is not sufficient: harmonic terms $1/n$ approach $0$ but the series diverges.

**Symbols.** $a_n$ is the term; $s_n$ is the partial sum; $\sum$ denotes repeated addition.

**Real-World Applications (§5).**
1. $\sum_{n=1}^3 n=6$.
2. $\sum_{n=1}^{10}1=10$.
3. Partial sum of $1/2^n$ through $n=4$ is $0.9375$.
4. Harmonic partial sum through $4$ is $25/12\approx2.083$.
5. Alternating $1-1+1-1$ has partial sums $1,0,1,0$ and no ordinary limit.
6. $\sum_{n=1}^\infty 1/n^2=\pi^2/6\approx1.645$.

### `math-01-55` — The geometric series  · deepen derivation

**Connections (§1).**
> This lesson builds on series and repeated multiplication. A geometric series adds powers of a fixed ratio. It is the basic model for shrinking tails, discounts, repeated errors, and many convergence comparisons.

**Motivation & Intuition (§2).**
> The partial sum has a special cancellation pattern. Multiplying the sum by the common ratio lines up nearly all terms, and subtracting removes the middle powers.
>
> The infinite sum exists exactly when the powers of the ratio shrink to zero. If $|r|<1$, the tail disappears in the limit; if not, the partial sums do not settle in the same way.

**Definition & Assumptions (§3).** 1. Let $S_n=1+r+r^2+\cdots+r^n$. 2. Multiply by $r$: $rS_n=r+r^2+\cdots+r^{n+1}$. 3. Subtract: $S_n-rS_n=1-r^{n+1}$ — all middle terms cancel. 4. Factor: $S_n(1-r)=1-r^{n+1}$. 5. Divide: $S_n=(1-r^{n+1})/(1-r)$. 6. If $|r|<1$, then $r^{n+1}\to0$, so $\sum_{n=0}^\infty r^n=1/(1-r)$.

**Symbols.** $r$ is common ratio; $S_n$ is partial sum; convergence requires $|r|<1$.

**Real-World Applications (§5).**
1. $1+1/2+1/4+\cdots=2$.
2. $\sum_{n=0}^\infty 0.9^n=10$.
3. Discounted reward with reward $5$ and $\gamma=0.8$ totals $25$.
4. Repeated error $0.5^n$ sums to $2$.
5. Partial sum for $r=0.5,n=3$ is $1.875$.
6. $1+2+4+\cdots$ diverges because $|r|=2$.

### `math-01-56` — Convergence tests  · deepen derivation

**Connections (§1).**
> This lesson builds on series, geometric behavior, and improper integrals. Convergence tests compare an unfamiliar series to behavior that is already understood. Different tests match different term patterns.

**Motivation & Intuition (§2).**
> The ratio test looks at how consecutive terms compare. If the terms eventually shrink like a geometric series with ratio below one, the series converges absolutely.
>
> No single test solves every series. Positive-term comparisons, $p$-series, alternating signs, ratios, roots, and integral-like tails each provide a different lens for deciding convergence.

**Definition & Assumptions (§3).** Ratio test: 1. Suppose $\lim_{n\to\infty}|a_{n+1}/a_n|=L$. 2. For large $n$, terms behave roughly like repeated multiplication by $L$. 3. If $L<1$, compare to a geometric series with ratio below $1$, so the series converges absolutely. 4. If $L>1$, terms do not shrink fast enough and the series diverges. 5. If $L=1$, the test gives no decision. 6. For $a_n=1/n!$, the ratio is $1/(n+1)\to0$, so it converges.

**Symbols.** $a_n$ is the term; $L$ is the limiting ratio or root; absolute convergence means $\sum|a_n|$ converges.

**Real-World Applications (§5).**
1. $\sum1/n!$ converges by ratio limit $0$.
2. $\sum2^n/n!$ converges by ratio limit $0$.
3. $\sum1/n^2$ converges by $p=2>1$.
4. $\sum1/n$ diverges by $p=1$.
5. $\sum(-1)^{n+1}/n$ converges conditionally by alternating test.
6. $\sum n/2^n$ converges by ratio limit $1/2$.

### `math-01-57` — Power series  · deepen derivation

**Connections (§1).**
> This lesson builds on series and functions of a variable. A power series is an infinite polynomial centered at a point. Inside its interval of convergence, it behaves like an ordinary function that can often be differentiated or integrated term by term.

**Motivation & Intuition (§2).**
> The powers $(x-a)^n$ measure distance from the center. Coefficients determine how strongly each power contributes, but convergence depends on how those coefficients balance the growing powers.
>
> The ratio test usually reveals a radius around the center where the series converges. Endpoints require separate checks because the ratio test often becomes inconclusive there.

**Definition & Assumptions (§3).** 1. Write $\sum c_n(x-a)^n$ — powers are centered at $a$. 2. Apply the ratio test to terms $c_n(x-a)^n$. 3. The limiting ratio often has the form $L|x-a|$. 4. Convergence occurs when $L|x-a|<1$. 5. This gives a radius $R=1/L$. 6. Endpoints $x=a\pm R$ must be tested separately.

**Symbols.** $c_n$ are coefficients; $a$ is center; $R$ is radius of convergence.

**Real-World Applications (§5).**
1. $\sum x^n$ has radius $1$.
2. At $x=0.5$, sum is $2$.
3. At $x=1$, $\sum1$ diverges.
4. $\sum x^n/n!$ has infinite radius.
5. $\sum n x^n$ has radius $1$.
6. $\sum (x-2)^n/3^n$ has radius $3$.

### `math-01-58` — Taylor series  · deepen derivation

**Connections (§1).**
> This lesson builds on power series and derivatives. Taylor series choose coefficients so an infinite polynomial matches a function's derivatives at one point. They turn local derivative data into an approximating function.

**Motivation & Intuition (§2).**
> The constant term must match the function value at the center. The linear coefficient must match the slope, the quadratic coefficient must match curvature after accounting for $2!$, and the pattern continues for higher derivatives.
>
> Taylor series explain why local polynomial approximations work. Each added term matches one more derivative at the center, improving the local description when the series converges to the function.

**Definition & Assumptions (§3).** 1. Seek $f(x)=\sum_{n=0}^\infty c_n(x-a)^n$. 2. Set $x=a$ to get $c_0=f(a)$. 3. Differentiate once and set $x=a$ to get $c_1=f'(a)$. 4. Differentiate twice and set $x=a$ to get $2!c_2=f''(a)$. 5. After $n$ derivatives, $n!c_n=f^{(n)}(a)$. 6. Therefore $c_n=f^{(n)}(a)/n!$.

**Symbols.** $a$ is center; $f^{(n)}(a)$ is the $n$th derivative at $a$; $n!$ counts the repeated differentiation factor.

**Real-World Applications (§5).**
1. $e^x=1+x+x^2/2+x^3/6+\cdots$.
2. At $x=1$, cubic Taylor gives $2.667$ versus $e\approx2.718$.
3. $\ln x$ about $1$ has first terms $(x-1)-(x-1)^2/2$.
4. For $\sqrt{x}$ about $4$, linear term is $2+(x-4)/4$.
5. $\cos x$ quadratic near $0$ is $1-x^2/2$.
6. $\sin(0.1)$ cubic gives $0.099833$.

### `math-01-59` — Maclaurin series  · deepen derivation

**Connections (§1).**
> This lesson builds on Taylor series. A Maclaurin series is simply a Taylor series centered at zero. This center is especially convenient for common functions near the origin.

**Motivation & Intuition (§2).**
> Setting the center to zero simplifies the powers to $x^n$. For functions such as sine, cosine, and the exponential, derivatives at zero create recognizable coefficient patterns.
>
> Maclaurin series are useful both for approximation and for understanding function behavior near zero. Keeping only the first few terms gives practical numerical estimates with controlled local meaning.

**Definition & Assumptions (§3).** 1. Start from Taylor coefficients $f^{(n)}(a)/n!$. 2. Set $a=0$ — the center is the origin. 3. Get $f(x)=\sum_{n=0}^\infty f^{(n)}(0)x^n/n!$. 4. For $\sin x$, derivatives cycle through $\sin,\cos,-\sin,-\cos$. 5. At $0$, the nonzero coefficients occur at odd powers with alternating signs. 6. Therefore $\sin x=x-x^3/3!+x^5/5!-\cdots$.

**Symbols.** Maclaurin means centered at $0$; factorials scale derivative coefficients; powers of $x$ measure distance from $0$.

**Real-World Applications (§5).**
1. $e^1$ with terms through $x^4$ gives $2.708$.
2. $\sin(0.5)$ through $x^5$ gives $0.479427$.
3. $\cos(0.5)$ through $x^4$ gives $0.877604$.
4. $\ln(1+0.5)$ through cubic gives $0.416667$.
5. $1/(1-x)$ at $x=0.25$ sums to $1.333$.
6. $e^{-0.1}$ quadratic gives $0.905$.

### `math-01-60` — Numerical differentiation  · deepen derivation

**Connections (§1).**
> This lesson builds on derivatives and Taylor expansions. Numerical differentiation estimates slopes when a formula derivative is unavailable or when function values come from data. The method turns sampled values into approximate rates.

**Motivation & Intuition (§2).**
> A forward difference uses the slope of a small secant line. Taylor expansion shows that it equals the true derivative plus an error term proportional to the step size.
>
> A central difference samples symmetrically on both sides, which cancels more of the error. Very small steps can still suffer from rounding, so practical numerical differentiation balances two kinds of error.

**Definition & Assumptions (§3).** 1. Taylor expand $f(x+h)=f(x)+hf'(x)+h^2f''(x)/2+O(h^3)$. 2. Subtract $f(x)$ and divide by $h$. 3. Get forward difference $[f(x+h)-f(x)]/h=f'(x)+h f''(x)/2+O(h^2)$. 4. Expand $f(x-h)=f(x)-hf'(x)+h^2f''(x)/2+O(h^3)$. 5. Subtract the backward expansion from the forward expansion. 6. Divide by $2h$ to get central difference $[f(x+h)-f(x-h)]/(2h)=f'(x)+O(h^2)$.

**Symbols.** $h$ is step size; truncation error comes from omitted Taylor terms; central difference uses symmetric samples.

**Real-World Applications (§5).**
1. Forward difference for $x^2$ at $3$, $h=0.01$, gives $6.01$.
2. Central difference gives exactly $6$ for $x^2$.
3. Forward difference for $\sin x$ at $0$, $h=0.01$, gives $0.999983$.
4. Central difference for $\sin x$ at $0$, $h=0.01$, gives $0.999983$.
5. Gradient check for $(w-2)^2$ at $3$, $h=0.001$, gives $2.001$ forward.
6. Central check for the same gives $2$.

### `math-01-61` — Numerical integration  · deepen derivation

**Connections (§1).**
> This lesson builds on definite integrals and polynomial approximation. Numerical integration estimates accumulated area from finitely many sampled values. It is used when exact antiderivatives are unavailable or unnecessary.

**Motivation & Intuition (§2).**
> Rectangle rules use simple constant approximations, while the trapezoid rule replaces the curve by line segments between endpoints. Simpson's rule goes further by fitting a quadratic over pairs of subintervals.
>
> Better local shape matching usually improves accuracy for smooth functions. The integral is still an accumulation idea: each rule assigns an approximate area to small pieces and then adds them.

**Definition & Assumptions (§3).** 1. Split $[a,b]$ into subintervals of width $h$. 2. On one subinterval, approximate the curve by the line through endpoint values. 3. The trapezoid area is $h[f(x_i)+f(x_{i+1})]/2$. 4. Add trapezoids over all subintervals. 5. Simpson's rule fits a quadratic through two subintervals. 6. For one pair, the area is $h[f(x_0)+4f(x_1)+f(x_2)]/3$.

**Symbols.** $h$ is subinterval width; trapezoid rule uses endpoints; Simpson's rule uses endpoint-midpoint-endpoint weights $1,4,1$.

**Real-World Applications (§5).**
1. Trapezoid for $x^2$ on $[0,1]$ with one panel gives $0.5$.
2. Simpson for $x^2$ on $[0,1]$ gives $1/3$.
3. Trapezoid with two panels for $x^2$ gives $0.375$.
4. Midpoint rule one panel gives $0.25$.
5. Simpson for $\sin x$ on $[0,\pi]$ gives $2.094$.
6. Exact $\int_0^1 x^2dx=0.333$.

### `math-01-62` — Backpropagation as the chain rule  · deepen derivation

**Connections (§1).**
> This lesson builds on the chain rule and derivatives of composed functions. Backpropagation is the chain rule arranged for a computation graph. It connects single-variable calculus to the way machine learning models compute gradients.

**Motivation & Intuition (§2).**
> A loss often depends on a weight through several intermediate quantities. Backpropagation records the local derivative at each step and passes sensitivity backward from the final loss.
>
> Multiplying local derivatives along a path gives the derivative with respect to an earlier variable. In the scalar example, this produces the gradient used to update the weight by a small step in the direction that reduces loss.

**Definition & Assumptions (§3).** For $L=(wx-y)^2$: 1. Define prediction $\hat y=wx$ — the weight affects loss through the prediction. 2. Define error $e=\hat y-y$ — the loss depends on error. 3. Define $L=e^2$ — this is the final scalar output. 4. Compute local derivatives: $dL/de=2e$, $de/d\hat y=1$, and $d\hat y/dw=x$. 5. Multiply along the path: $dL/dw=(dL/de)(de/d\hat y)(d\hat y/dw)$. 6. Substitute to get $dL/dw=2(wx-y)x$. 7. With $w=2,x=3,y=5$, prediction is $6$, error is $1$, and gradient is $6$. 8. A gradient step with learning rate $0.1$ gives $w_{new}=2-0.1\cdot6=1.4$.

**Symbols.** $w$ is a weight; $x$ is an input feature; $\hat y$ is prediction; $y$ is target; $e$ is error; upstream sensitivity means derivative of the final loss with respect to an intermediate value.

**Real-World Applications (§5).**
1. Worked scalar example gives $dL/dw=6$ and update $1.4$.
2. For $w=1,x=4,y=6$, gradient is $2(4-6)4=-16$.
3. Bias model $L=(wx+b-y)^2$ has $dL/db=2e$; with $e=1$ gives $2$.
4. Chain $z=3w$, $a=z^2$, $L=a$ gives $dL/dw=18w$; at $w=2$ gives $36$.
5. Sigmoid unit with upstream $0.5$ and activation $0.8$ sends local gradient $0.5\cdot0.8(0.2)=0.08$.
6. Two-layer scalar $L=(v(wx)-y)^2$ with $v=2,w=1,x=3,y=5$ has error $1$, $dL/dw=12$, and $dL/dv=6$.

---

## Build order for this section

1. **Lock the model entry first:** expand `math-01-13` exactly from the full prose above, because derivative-as-limit sets the voice and derivation bar for the whole section.
2. **Author derivative-rule spine:** `01-14…01-29`, then optimization and shape lessons `01-30…01-37`.
3. **Author integral spine:** `01-38…01-52`, keeping FTC, substitution, and integration by parts as the conceptual anchors.
4. **Author sequence/series spine:** `01-53…01-59`, with geometric series and convergence tests checked carefully.
5. **Finish computational capstones:** `01-60`, `01-61`, and ML capstone `01-62`; verify every derivative, integral, series, limit, and update number with Python before implementation.
