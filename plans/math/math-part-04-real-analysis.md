# Math · Part 04 — Real analysis  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four exposition
> principles, the fix recipe, and the Definition of Done. This file rewrites the scaffold into concrete
> per-lesson authoring specs: plain prose, complete derivations where the lesson has a theorem or formula,
> symbol glosses, and six concept-specific applications per lesson.
> Numeric examples below were checked with `python3` on 2026-07-01: geometric/telescoping sums, epsilon
> thresholds, bisection widths, Taylor bounds, contraction iterates, Riemann bounds, and gradient-method rates.

**Section:** Real analysis · **Lessons:** 32 · **Breadcrumb:** `Mathematics · Analysis & Calculus` · **Priority:** MEDIUM-HIGH (rigor + LaTeX repair + ML convergence capstone)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate shared with a sibling | 0 / 32 |
| Templated / thin motivation | 0 / 32 |
| Key formula or theorem not promoted to display form | 20 / 32 |
| Odd-`$` LaTeX fields found by source scan | 21 fields across 9 lessons |
| Derivation/proof specs below | 29 / 32 |
| Explain-only conceptual specs below | 3 / 32 |

## Priority & systemic issues

- There is no whole-section §5 boilerplate block. Keep the existing on-topic direction, but make every
  application use the lesson's own real-analysis concept with a re-derivable number or concrete tolerance.
- The section's real value is proof discipline. Most lessons should not merely state a theorem; they should
  give a short proof with one justified step per line.
- `math-04-10` is already strong in the master sample. Preserve its late-terms-crowd intuition while adding
  the complete Cauchy-completeness proof and epsilon choices.
- `math-04-32` is the ML capstone. It should explicitly connect real-analysis guarantees to gradient-method
  convergence rates, not just describe gradient descent.
- **LaTeX bugs to repair first** (odd number of `$` in a source field):
  - `math-04-01` · `practice[4].steps[3].result` · `n\ge101$`
  - `math-04-02` · `practice[4].steps[0].result` · `k/8$ for $k\in\mathbb{N}$`
  - `math-04-05` · `worked.steps[2].result` · `2k=f(k)$`
  - `math-04-05` · `practice[0].steps[3].result` · `k=f(k+1)$`
  - `math-04-05` · `practice[0].steps[4].result` · `n-1=m-1\Rightarrow n=m$`
  - `math-04-06` · `practice[4].steps[3].result` · `|0.2(-1)^n/n|\le0.2$`
  - `math-04-07` · `practice[3].steps[4].result` · `n\ge1\Rightarrow |a_n-4|<\varepsilon$`
  - `math-04-08` · `practice[2].steps[0].result` · `a_{2k}=1$`
  - `math-04-08` · `practice[2].steps[2].result` · `a_{2k-1}=-1$`
  - `math-04-09` · `practice[0].steps[0].result` · `n_k=2k$`
  - `math-04-09` · `practice[0].steps[1].result` · `a_{2k}=1$`
  - `math-04-09` · `practice[0].steps[2].result` · `1,1,1,\ldots$`
  - `math-04-09` · `practice[0].steps[3].result` · `1$`
  - `math-04-10` · `practice[0].steps[4].result` · `m,n\ge1\Rightarrow |a_m-a_n|<\varepsilon$`
  - `math-04-10` · `practice[1].steps[1].result` · `N$ arbitrary`
  - `math-04-10` · `practice[1].steps[2].result` · `m\ge N$ even`
  - `math-04-10` · `practice[1].steps[3].result` · `n\ge N$ odd`
  - `math-04-10` · `practice[1].steps[4].result` · `|a_m-a_n|=|1-(-1)|=2$`
  - `math-04-10` · `practice[2].steps[0].result` · `m,n\ge100$`
  - `math-04-10` · `practice[3].steps[4].result` · `|a_m-a_n|<\varepsilon$`
  - `math-04-11` · `worked.steps[2].result` · `|r|=1/2<1$`

---

## Model entry (full prose) — `math-04-31` The contraction mapping theorem

**Connections (§1).**
> This lesson brings together several ideas from the section. A metric space gives a way to measure distance,
> a Cauchy sequence describes terms that crowd together, and completeness says that such a sequence has a
> point to crowd around. The contraction mapping theorem uses all three ideas in one useful result.
>
> The setting is simple: a function sends points of a complete metric space back into the same space, and it
> always shrinks distances by a fixed factor. If the shrink factor is less than one, repeated application of
> the function cannot wander forever. The iterates form a Cauchy sequence, completeness supplies the limit,
> and continuity of the contraction shows that the limit is a fixed point. This theorem is one of the cleanest
> bridges from analysis to algorithms, because it gives both existence and a convergence rate.

**Motivation & Intuition (§2).**
> Many numerical methods are built by turning a hard equation into a repeated update. Instead of solving
> $x=g(x)$ directly, we start from $x_0$ and compute $x_1=g(x_0)$, $x_2=g(x_1)$, and so on. This process is
> reliable only when the update pulls points closer together. If every application cuts distances by half,
> then two possible iterates become rapidly indistinguishable.
>
> The contraction mapping theorem turns that picture into a proof. The shrinking condition says
> $d(g(x),g(y))\le qd(x,y)$ for one constant $0\le q<1$. After $n$ steps, the remaining uncertainty is bounded
> by a geometric tail. Since geometric tails go to zero, the iterates are Cauchy. In a complete space, Cauchy
> sequences converge, so the update has a limiting point. The same shrinking inequality then forces that
> limiting point to satisfy $g(x^*)=x^*$, and it also proves that no second fixed point can exist.
>
> This matters in machine learning because many convergence guarantees have the same shape. A gradient step
> near a strongly convex optimum can become a contraction. Value iteration in reinforcement learning is a
> contraction under discounting. Some fixed-point layers and iterative solvers are designed so the update map
> has $q<1$, making the number of iterations needed for a tolerance a direct consequence of this theorem.

**Definition & Assumptions (§3).** Display the theorem
$$
d(Tx,Ty)\le q\,d(x,y),\qquad 0\le q<1.
$$
If $(X,d)$ is complete and $T:X\to X$ satisfies this inequality, then $T$ has a unique fixed point $x^*$ and
$T^n x_0\to x^*$ for every starting point $x_0$.

**Derive (complete).**
1. Let $x_{n+1}=T(x_n)$ — this is the iteration whose limit we want to prove exists.
2. Apply the contraction repeatedly: $d(x_{n+1},x_n)\le q^n d(x_1,x_0)$ — each new gap is at most $q$ times the previous gap.
3. For $m>n$, use the triangle inequality: $d(x_m,x_n)\le \sum_{k=n}^{m-1}d(x_{k+1},x_k)$ — a long jump is bounded by short jumps.
4. Bound the sum by a geometric tail: $d(x_m,x_n)\le d(x_1,x_0)\sum_{k=n}^{m-1}q^k\le d(x_1,x_0)q^n/(1-q)$ — tails vanish because $q<1$.
5. Given $\varepsilon>0$, choose $n$ so $d(x_1,x_0)q^n/(1-q)<\varepsilon$ — this proves $(x_n)$ is Cauchy.
6. Completeness gives a limit $x_n\to x^*$ — Cauchy sequences in $X$ are guaranteed to converge inside $X$.
7. Use $d(Tx^*,x^*)\le d(Tx^*,T x_n)+d(x_{n+1},x^*)\le qd(x^*,x_n)+d(x_{n+1},x^*)\to0$ — the limit is fixed.
8. If $u$ and $v$ are fixed, then $d(u,v)=d(Tu,Tv)\le qd(u,v)$ — since $q<1$, this forces $d(u,v)=0$, so $u=v$.

**Symbols.** $(X,d)$ is the metric space; complete means every Cauchy sequence in $X$ converges to a point of
$X$; $T$ is the update map; $q$ is the contraction factor; $x^*$ is the unique fixed point; $x_n=T^n x_0$ is
the $n$th iterate.

**Real-World Applications (§5).**
1. **Fixed-point solver.** If $q=0.5$ and the initial gap bound is $1$, after $10$ steps the tail bound is
   $0.5^{10}/(1-0.5)=0.001953125$.
2. **Value iteration.** With discount $\gamma=0.9$, the Bellman update is a $0.9$-contraction; after $44$ rounds,
   $0.9^{44}<0.01$, so the leading error factor is below one percent.
3. **Gradient method near a strong convex optimum.** If the local contraction factor is $0.8$, then after $21$
   steps the distance factor is $0.8^{21}\approx0.00922$.
4. **Fixed-point layer iteration budget.** A tolerance $10^{-3}$ with $q=0.5$ needs $n\ge10$ because
   $2^{-10}=0.0009765625$.
5. **Picard iteration for an ODE.** On a short interval with Lipschitz constant $L=2$ and length $h=0.2$, the
   Picard map has factor $Lh=0.4$, so the theorem applies.
6. **Denoising iteration.** If an update halves the distance between any two images, two starting images
   initially $12$ units apart are at most $12\cdot0.5^5=0.375$ apart after five iterations.

---

## Per-lesson change specs

### `math-04-01` — Proof techniques · explain-only
**Connections (§1).**
> Proof techniques are the working language of real analysis. The reader already knows how to test
> examples and compute with formulas, but analysis asks for statements that hold for every allowed
> object. Direct proof, contrapositive, contradiction, induction, and counterexample each give a
> reliable way to match reasoning to the shape of a claim. These methods will support the later
> lessons on limits, completeness, continuity, and convergence.

**Motivation & Intuition (§2).**
> Checking examples is useful for learning a pattern, but examples alone do not prove a universal
> statement. A claim about all natural numbers, all tolerances, or all points in an interval needs a
> reason that covers every case at once. Proof techniques are a small set of reliable forms for
> building that reason.
>
> The method should match the statement. Direct proof follows the implication forward, contrapositive
> proves an equivalent reversed statement, contradiction shows an assumption cannot survive, induction
> handles step-by-step claims, and a counterexample disproves a universal claim. Real analysis uses
> these forms constantly because its definitions quantify over every $\varepsilon>0$, every
> sufficiently large index, or every point in a domain.

**Definition & Assumptions (§3).** Explain-only: this is a methods lesson, not a theorem. Teach direct proof, contrapositive, contradiction, induction, and counterexample by matching each method to the shape of the statement.

**Symbols.** $P\Rightarrow Q$ means assumption $P$ guarantees conclusion $Q$; $\forall$ means every allowed object; $\exists$ means at least one object; $\varepsilon$ is an arbitrary positive error tolerance.

**Real-World Applications (§5).**
1. Direct proof: if $n=2k$, then $n^2=4k^2=2(2k^2)$ is even.
2. Contrapositive: proving $n^2$ even implies $n$ even can use $n$ odd $\Rightarrow n^2$ odd;
   $3^2=9$ illustrates the odd case.
3. Contradiction: assume $\sqrt2=a/b$ in lowest terms, then both $a,b$ become even.
4. Induction: $1+\cdots+n=n(n+1)/2$ gives $55$ when $n=10$.
5. Counterexample: one discontinuity refutes “all monotone functions are continuous”; a step at
   $0$ suffices.
6. Epsilon proof planning: to prove $1/n\to0$ with $\varepsilon=0.01$, choose $N=101$.

### `math-04-02` — The natural and rational numbers · explain-only
**Connections (§1).**
> The natural, integer, and rational numbers are the first number systems used throughout mathematics.
> Counting indices, measuring signed offsets, and forming ratios already cover many ordinary
> computations. Real analysis begins with these familiar sets so the later need for real numbers is
> clear rather than mysterious. The rational numbers are especially important because they are dense,
> yet still incomplete.

**Motivation & Intuition (§2).**
> Counting numbers model repeated steps, integers add signed direction, and rationals express exact
> ratios. These sets already support many computations, so they are the natural starting point for
> analysis. Their algebraic closure properties explain why operations such as adding counts or
> multiplying rational scales stay inside the expected system.
>
> The important limitation is that rational numbers, although dense, still have gaps. Between any two
> rationals there is another rational, but some limiting processes point to values such as $\sqrt2$
> that no rational equals. This prepares the need for real numbers, where the gaps needed by limits
> are filled.

**Definition & Assumptions (§3).** Explain-only: define $\mathbb N$, $\mathbb Z$, and $\mathbb Q$ and emphasize closure properties rather than forcing a proof. Show that rationals are dense by inserting $(a+b)/2$ between $a<b$.

**Symbols.** $\mathbb N$ are counting numbers; $\mathbb Z$ are integers; $\mathbb Q=\{p/q:q\ne0\}$; dense means every interval contains a point of the set.

**Real-World Applications (§5).**
1. Batch counts live in $\mathbb N$; a batch of $128$ is a natural number.
2. Class-label offsets use $\mathbb Z$; label shift $-3$ is valid.
3. Learning rates like $1/1000$ are rational.
4. Quantized weights with denominator $8$ have values $k/8$; $3/8=0.375$.
5. Between $0.7$ and $0.8$, the rational midpoint is $0.75$.
6. Rationals miss $\sqrt2\approx1.41421356$, motivating real numbers.

### `math-04-03` — The real numbers · explain-only
**Connections (§1).**
> The real numbers extend the number systems from counting and ratios to a complete number line. This
> lesson connects rational approximation with the limits and endpoints that analysis needs. Once the
> real line is available, sequences can converge to values such as $\sqrt2$ even when rational
> arithmetic only approaches them. Completeness of $\mathbb R$ becomes the foundation for suprema,
> Cauchy sequences, continuity, and optimization.

**Motivation & Intuition (§2).**
> Rational approximations can get closer and closer to a target without ever being exactly equal to
> it. The decimal approximations to $\sqrt2$ show this clearly: each interval narrows, but rational
> endpoints alone do not explain why there is a final number being trapped. Real numbers supply that
> final landing place.
>
> Calling $\mathbb R$ a complete ordered field means it has arithmetic, order, and no missing limit
> points of the kind analysis needs. Completeness allows nested intervals, Cauchy sequences, and least
> upper bounds to produce real values. Later convergence proofs depend on this guarantee rather than
> on decimal notation itself.

**Definition & Assumptions (§3).** Explain-only: present $\mathbb R$ as a complete ordered field. Use the nested decimal intervals for $\sqrt2$ to show why completion is needed: $[1,2]$, $[1.4,1.5]$, $[1.41,1.42]$, and so on.

**Symbols.** $\mathbb R$ is the real line; $<$ is the order; completeness means no Cauchy or least-upper-bound gaps remain; $\sqrt2$ is the positive real whose square is $2$.

**Real-World Applications (§5).**
1. A loss value $0.0137$ is modeled as real.
2. A continuous feature such as age $34.5$ lies in $\mathbb R$.
3. The diagonal of a unit square has length $\sqrt2$.
4. Decimal bisection traps $\sqrt2$ in an interval of width $10^{-3}$ after three displayed
   decimals.
5. Optimization assumes a minimizer can be a real number such as $w=\pi/4$.
6. Probability scores fill $[0,1]$, not just rational grid points.

### `math-04-04` — Completeness, suprema, and infima · AUTHOR derivation
**Connections (§1).**
> This lesson gives the first precise form of completeness. Earlier number systems let us compare and
> approximate, but the real numbers also guarantee best possible upper and lower bounds for nonempty
> bounded sets. Suprema and infima turn the informal idea of an endpoint into a usable mathematical
> object. The same language will appear in continuity proofs, compactness arguments, and optimization
> guarantees.

**Motivation & Intuition (§2).**
> A bounded set may have many upper bounds, but analysis often needs the best one. For an open
> interval such as $(0,1)$, the endpoint $1$ is not in the set, yet it is still the least ceiling. The
> supremum records this boundary without requiring membership.
>
> The epsilon property of the supremum is what makes it useful in proofs. If $\sup S-\varepsilon$ were
> still an upper bound, then the proposed supremum would not be least. Therefore elements of the set
> must come within every positive distance below the supremum, which turns an endpoint statement into
> approximating elements.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Let $S$ be nonempty and bounded above — this gives at least one ceiling.
2. Completeness states that the set of ceilings has a least element, called $\sup S$ — the real line has no gap at the best ceiling.
3. For every $\varepsilon>0$, $\sup S-\varepsilon$ is not an upper bound — otherwise $\sup S$ would not be least.
4. Therefore some $s\in S$ satisfies $\sup S-\varepsilon<s\le\sup S$ — elements of $S$ approach the supremum from below.
5. The infimum follows by applying the same argument to $-S$ — lower bounds become upper bounds after negation.

**Symbols.** $\sup S$ is the least upper bound; $\inf S$ is the greatest lower bound; $\varepsilon$ measures closeness to the endpoint.

**Real-World Applications (§5).**
1. For $S=(0,1)$, $\sup S=1$ and $\inf S=0$ although neither is in $S$.
2. Validation loss bounded below by $0$ has an infimum.
3. If accuracies are below $0.93$ but reach $0.929$, the supremum can be $0.93$.
4. Binary search maintains a supremum-like boundary; after $10$ halvings of width $1$, width is
   $0.0009765625$.
5. The set $\{1-1/n:n\ge1\}$ has supremum $1$.
6. Clipped activations in $[-1,1]$ have output supremum at most $1$.

### `math-04-05` — Countable and uncountable sets · AUTHOR derivation
**Connections (§1).**
> Sequences list objects one at a time, so they provide a natural test for whether a set can be
> exhausted by counting. The rational numbers can be organized into such a list, but the real numbers
> in even a small interval cannot. This distinction explains why finite grids and rational
> approximations do not capture the full real line. The diagonal argument also introduces a proof
> pattern that uses an assumed list against itself.

**Motivation & Intuition (§2).**
> A set is countable when its elements can be assigned positions in a list. Finite sets, integers, and
> rational grid points fit this idea, even when the listing order takes some work. Countability is
> therefore a way to measure whether a collection can be searched or enumerated in sequence.
>
> Cantor's diagonal argument shows that real numbers in $(0,1)$ are different. If a supposed list is
> given, a new decimal can be built to differ from the first entry in the first digit, the second
> entry in the second digit, and so on. The constructed number belongs to the interval but cannot be
> anywhere on the list, so no list can be complete.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Assume every number in $(0,1)$ has been listed as decimals $x_1,x_2,\ldots$ — this is the countability claim.
2. Build a new decimal $y$ by choosing its $n$th digit different from the $n$th digit of $x_n$ — diagonal choice.
3. Then $y\ne x_n$ for every $n$ because it differs in digit $n$ — no listed entry equals $y$.
4. But $y\in(0,1)$ — the list missed a real number in the interval.
5. Therefore $(0,1)$ is uncountable — the original listing assumption is false.

**Symbols.** Countable means there is a bijection with $\mathbb N$ or a subset of it; uncountable means no such listing exists; bijection means one-to-one and onto.

**Real-World Applications (§5).**
1. Integers are countable by listing $0,1,-1,2,-2,\ldots$.
2. Rational grid points are countable, so a finite-precision model searches a countable subset.
3. Real-valued weights form an uncountable space.
4. A vocabulary of $50{,}000$ tokens is finite and countable.
5. Binary strings of length $10$ number $2^{10}=1024$.
6. All infinite binary sequences are uncountable by the same diagonal argument.

### `math-04-06` — Sequences · AUTHOR derivation
**Connections (§1).**
> Sequences are the basic objects used to describe limiting processes. They appear whenever a value
> changes by step number: iterations of an algorithm, sample sizes, partial sums, or checkpoints in
> training. Real analysis studies sequences first because many later ideas reduce to controlling what
> happens far out in the index. Geometric sequences provide the cleanest model for convergence.

**Motivation & Intuition (§2).**
> A sequence packages a changing quantity as $a_1,a_2,a_3,\ldots$. The index can represent time,
> iteration number, sample size, or position in a construction. This makes sequences the natural first
> setting for convergence.
>
> The geometric sequence $r^n$ captures the core behavior of repeated shrinkage. When $|r|<1$, each
> step multiplies size by a fixed factor below one. Logarithms identify how far out in the sequence we
> must go to make the term smaller than any chosen tolerance.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Define $a_n=r^n$ with $|r|<1$ — this is the basic geometric sequence.
2. Given $\varepsilon>0$, choose $N>\log(\varepsilon)/\log(|r|)$ — logarithms solve $|r|^N<\varepsilon$ because $0<|r|<1$.
3. For $n\ge N$, $|a_n|=|r|^n\le |r|^N<\varepsilon$ — later terms are smaller.
4. Therefore $r^n\to0$ — the sequence converges to zero.

**Symbols.** $a_n$ is the $n$th term; $n\in\mathbb N$ is the index; $r$ is the common ratio; $\lim a_n$ is the sequence limit.

**Real-World Applications (§5).**
1. Learning-rate decay $0.9^n$ gives $0.9^{10}\approx0.3487$.
2. Running error $1/n$ is below $0.01$ after $n\ge101$.
3. Alternating signs $(-1)^n$ form a sequence that does not converge.
4. Momentum decay $0.5^8=0.00390625$.
5. Validation checkpoints form a finite prefix such as $a_1,\ldots,a_{20}$.
6. Batch mean estimates often behave like a sequence approaching a population mean.

### `math-04-07` — Limits of sequences · AUTHOR derivation
**Connections (§1).**
> Limits of sequences make the phrase “approaches a value” precise. The definition separates early
> behavior from eventual behavior, which is why it fits iterative processes so well. Once a cutoff
> index is chosen, every later term must stay within the requested error band. This epsilon-and-$N$
> pattern becomes the model for Cauchy sequences, series, and function limits.

**Motivation & Intuition (§2).**
> The limit definition is designed to ignore finitely many early terms. A sequence may start
> irregularly, but convergence only asks what happens after a sufficiently late cutoff. For every
> allowed error band, all later terms must remain inside that band.
>
> In the proof that $1/n\to0$, the tolerance $\varepsilon$ is chosen first. The job is then to find a
> cutoff $N$ large enough that every reciprocal after that point is below $\varepsilon$. This order of
> choices is the main discipline of epsilon proofs.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. To prove $1/n\to0$, start with an arbitrary $\varepsilon>0$ — the error tolerance is chosen before $N$.
2. Choose $N>1/\varepsilon$ — this makes the reciprocal smaller than the tolerance.
3. If $n\ge N$, then $|1/n-0|=1/n\le1/N<\varepsilon$ — every later term is inside the band.
4. Since the choice works for every $\varepsilon>0$, $\lim_{n\to\infty}1/n=0$ — this is the definition.

**Symbols.** $\varepsilon$ is the allowed error; $N$ is the cutoff index; $L$ is the proposed limit; $|a_n-L|$ is the distance to the limit.

**Real-World Applications (§5).**
1. For $1/n<0.001$, choose $N=1001$.
2. For $2/n<0.01$, choose $N=201$.
3. The sequence $4+1/n$ converges to $4$; with $\varepsilon=0.1$, $N=11$ works.
4. SGD noise averages can be modeled by $1/\sqrt n$; to get below $0.05$, need $n>400$.
5. $0.8^n<0.01$ after $n\ge21$.
6. A nonconvergent oscillation $(-1)^n$ stays distance $2$ between adjacent signs.

### `math-04-08` — Subsequences · AUTHOR derivation
**Connections (§1).**
> Subsequences let us inspect selected parts of a sequence without changing their order. They are
> useful when the full sequence has complicated behavior but some hidden tail pattern is still stable.
> The basic compatibility result says that a convergent sequence passes its limit to every
> subsequence. Later compactness arguments will run in the opposite direction by extracting convergent
> subsequences from bounded data.

**Motivation & Intuition (§2).**
> Sometimes a sequence contains several behaviors interleaved with one another. A subsequence selects
> one ordered stream from the original sequence, such as only even terms or only saved checkpoints.
> The selected indices must keep increasing so that the subsequence still moves forward through the
> original sequence.
>
> If the full sequence already converges, every subsequence must inherit the same limit. The reason is
> simple: selected late indices eventually pass any cutoff that works for the original sequence. This
> result is later paired with compactness, where one proves convergence by finding a well-behaved
> subsequence.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Let $a_n\to L$ and let $a_{n_k}$ be a subsequence with $n_k\to\infty$ — selected indices still go late.
2. Given $\varepsilon>0$, choose $N$ so $n\ge N$ implies $|a_n-L|<\varepsilon$ — use convergence of the full sequence.
3. Choose $K$ so $n_k\ge N$ whenever $k\ge K$ — subsequence indices eventually pass the cutoff.
4. Then $|a_{n_k}-L|<\varepsilon$ for $k\ge K$ — the subsequence has the same limit.

**Symbols.** $n_k$ is an increasing sequence of indices; $a_{n_k}$ is the selected term; $K$ is the subsequence cutoff.

**Real-World Applications (§5).**
1. Even terms of $(-1)^n$ are $1$ and converge to $1$.
2. Odd terms of $(-1)^n$ are $-1$ and converge to $-1$.
3. Checkpoints every $5$ epochs form $a_5,a_{10},a_{15},\ldots$.
4. If $a_n=1/n$, the subsequence $a_{2k}=1/(2k)$ still converges to $0$.
5. A validation curve with two subsequential limits signals nonconvergence.
6. From $32$ epochs, saving every $4$th gives $8$ subsequence terms.

### `math-04-09` — The Bolzano–Weierstrass theorem · AUTHOR derivation
**Connections (§1).**
> Bolzano-Weierstrass is the first major compactness result for sequences on the real line. It says
> that boundedness prevents a sequence from avoiding all limiting behavior. Even if the full sequence
> does not converge, some ordered selection of terms must settle down. The proof links interval
> bisection, nested control, Cauchy behavior, and completeness.

**Motivation & Intuition (§2).**
> Boundedness confines a sequence to a finite interval, but it does not force the entire sequence to
> converge. The sequence $(-1)^n$ stays bounded and still oscillates forever. Bolzano-Weierstrass says
> that boundedness at least forces some subsequence to converge.
>
> The proof repeatedly halves an interval that contains infinitely many terms. At each stage, one half
> must still contain infinitely many terms, so a later sequence term can be chosen inside it. The
> nested intervals shrink to length zero, making the chosen subsequence Cauchy and then convergent by
> completeness of $\mathbb R$.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Place the bounded sequence inside a closed interval $[a,b]$ — boundedness supplies finite walls.
2. Split the interval in half — at least one half contains infinitely many terms.
3. Keep that half and choose one sequence term inside it after the previously chosen index — this builds a subsequence.
4. Repeat the halving — the nested intervals have lengths $(b-a)/2^k$.
5. The chosen subsequence is Cauchy because later terms lie in the same tiny interval — interval lengths go to zero.
6. Completeness of $\mathbb R$ gives a limit — the subsequence converges.

**Symbols.** Bounded means $a_n\in[a,b]$; subsequence means $a_{n_k}$ with increasing $n_k$; nested intervals are intervals contained in previous ones.

**Real-World Applications (§5).**
1. Any sequence in $[0,1]$ has a convergent subsequence.
2. For values in $[-1,1]$, after $10$ bisections interval width is $2/2^{10}=0.001953125$.
3. Bounded validation losses have subsequential limits.
4. Embeddings clipped to norm at most $1$ have convergent coordinate subsequences.
5. The sequence $(-1)^n$ has subsequences converging to $1$ and $-1$.
6. Compactness arguments in ML often start by extracting a convergent subsequence from bounded
   parameters.

### `math-04-10` — Cauchy sequences · AUTHOR derivation
**Connections (§1).**
> Cauchy sequences shift attention from distance to an unknown limit to distance among late terms.
> This is useful because many algorithms can certify that successive or late iterates are close before
> the exact destination is known. In the real numbers, the completeness of the space turns that
> internal crowding into actual convergence. The proof uses boundedness, Bolzano-Weierstrass, and the
> triangle inequality together.

**Motivation & Intuition (§2).**
> A usual limit proof compares each late term with a known number $L$. A Cauchy proof compares late
> terms with one another instead. This is especially useful when the eventual limit is hard to name
> but the tail of the process is visibly settling.
>
> In $\mathbb R$, late-term crowding is enough. A Cauchy sequence first becomes bounded, so
> Bolzano-Weierstrass supplies a convergent subsequence. The Cauchy property then pulls the whole tail
> close to that subsequential limit, proving that the entire sequence converges.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Assume $(a_n)$ is Cauchy — late terms are close to each other.
2. Choose $N_1$ so $m,n\ge N_1$ implies $|a_m-a_n|<1$ — the tail is bounded near $a_{N_1}$.
3. The finite initial segment plus the bounded tail makes the whole sequence bounded — finitely many early terms have a maximum size.
4. Bolzano–Weierstrass gives a convergent subsequence $a_{n_k}\to L$ — bounded real sequences have convergent subsequences.
5. Given $\varepsilon>0$, choose $N_2$ so $m,n\ge N_2$ implies $|a_m-a_n|<\varepsilon/2$ — use the Cauchy property.
6. Choose $k$ with $n_k\ge N_2$ and $|a_{n_k}-L|<\varepsilon/2$ — use subsequence convergence.
7. For $n\ge N_2$, $|a_n-L|\le |a_n-a_{n_k}|+|a_{n_k}-L|<\varepsilon$ — triangle inequality closes the proof.

**Symbols.** Cauchy means late terms are close to each other; $m,n$ are two late indices; $L$ is the eventual limit; $N$ is the cutoff.

**Real-World Applications (§5).**
1. For $a_n=1/n$, $m,n\ge200$ gives $|a_m-a_n|\le1/200<0.01$.
2. The partial sums of $\sum2^{-n}$ are Cauchy because the tail after $N$ is $2^{-N}$.
3. Floating-point iteration can stop when all last $5$ iterates differ by less than $10^{-6}$.
4. $(-1)^n$ is not Cauchy because even and odd late terms differ by $2$.
5. A contraction with $q=0.5$ has tail bound $2^{-10}/(1-0.5)=0.001953125$ after $10$ steps.
6. Completeness says a Cauchy parameter sequence in $\mathbb R^d$ has a real limit vector.

### `math-04-11` — Infinite series · AUTHOR derivation
**Connections (§1).**
> Infinite series are sequences built from running totals. Instead of asking whether individual terms
> exist, analysis asks whether the partial sums approach a finite value. Geometric series are the
> central example because their finite sums can be computed exactly and their tails have explicit
> bounds. Those bounds will reappear in convergence tests and contraction arguments.

**Motivation & Intuition (§2).**
> An expression with infinitely many additions is understood through finite partial sums. The $N$th
> partial sum is an ordinary finite number, so convergence of a series is really convergence of the
> sequence of those sums. This keeps infinite addition within the earlier theory of sequences.
>
> The geometric series is the model case because its partial sums telescope after multiplying by the
> ratio. The finite formula shows exactly what remains: a power of $r$. When $|r|<1$, that remaining
> term tends to zero, leaving the closed form for the infinite sum.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Define $S_N=\sum_{n=0}^{N}r^n$ — partial sums make the infinite sum finite first.
2. Multiply by $r$: $rS_N=r+r^2+\cdots+r^{N+1}$ — shift the same terms.
3. Subtract: $(1-r)S_N=1-r^{N+1}$ — all middle terms cancel.
4. Divide: $S_N=(1-r^{N+1})/(1-r)$ — solve the finite identity.
5. If $|r|<1$, then $r^{N+1}\to0$ — geometric sequences decay.
6. Therefore $\sum_{n=0}^\infty r^n=1/(1-r)$ — the partial sums converge.

**Symbols.** $S_N$ is the $N$th partial sum; $r$ is the ratio; convergence means $S_N$ has a finite limit.

**Real-World Applications (§5).**
1. $\sum_{n=0}^\infty(1/2)^n=2$.
2. The first $10$ terms sum to $1.998046875$.
3. The remaining tail after $10$ terms is $0.001953125$.
4. Telescoping $\sum_{n=1}^{10}1/(n(n+1))=10/11\approx0.90909$.
5. Discounted reward with $\gamma=0.9$ and reward $1$ has value $10$.
6. A residual series with terms $0.1^n$ sums to $1/(1-0.1)=1.111\ldots$.

### `math-04-12` — Convergence tests for series · AUTHOR derivation
**Connections (§1).**
> Convergence tests are tools for deciding whether an infinite series has a finite sum without
> computing the sum directly. The ratio test compares late terms to a geometric pattern, which is
> already known to converge when the ratio is below one. This turns a difficult tail into a familiar
> tail estimate. The same comparison logic supports error bounds in numerical methods and power
> series.

**Motivation & Intuition (§2).**
> Most series do not come with a simple closed form for partial sums. Convergence tests solve a
> different problem: they decide whether the tail is small enough to settle. The ratio test works when
> late terms shrink at least as fast as a geometric sequence.
>
> Once the ratio is bounded by $r<1$, every later term is controlled by repeated multiplication by
> $r$. The tail is then no larger than a geometric tail, which is already known to converge. This
> proves absolute convergence because the comparison is made with absolute values.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Suppose $|a_{n+1}/a_n|\le r<1$ for all large $n$ — this is the ratio-test hypothesis after some cutoff.
2. Then $|a_{N+k}|\le |a_N|r^k$ — apply the inequality repeatedly.
3. The tail is bounded by $|a_N|\sum_{k=0}^\infty r^k=|a_N|/(1-r)$ — compare with a geometric series.
4. Geometric tails go to zero as the starting index grows — the series is Cauchy.
5. Therefore the series converges absolutely — absolute convergence follows from the comparison.

**Symbols.** $a_n$ is the $n$th term; $r$ is a comparison ratio below $1$; absolute convergence means $\sum |a_n|$ converges.

**Real-World Applications (§5).**
1. For $a_n=2^{-n}$, the ratio is $1/2$, so the series converges.
2. For $a_n=n!/n^n$, ratio tends to $1/e<1$.
3. For $a_n=1/n$, ratio tends to $1$, so the test is inconclusive.
4. Root test on $3^{-n}$ gives root limit $1/3$.
5. Tail of a ratio-$1/2$ series after $10$ is at most $0.001953125$ when the next scale is
   $2^{-10}$.
6. Power-series coefficients with root limit $3$ give radius $1/3$.

### `math-04-13` — Absolute and conditional convergence · AUTHOR derivation
**Connections (§1).**
> Signed series can converge because positive and negative terms cancel. Absolute convergence
> separates safe convergence from convergence that depends on a delicate order of cancellation. If the
> absolute values have a finite sum, every signed tail is automatically controlled. Conditional
> convergence is weaker and therefore requires more care in rearrangement and accumulation.

**Motivation & Intuition (§2).**
> Positive and negative terms can cancel, and cancellation can make a series converge even when the
> magnitudes alone are too large. Absolute convergence removes the signs and asks for a stronger kind
> of convergence. If that stronger condition holds, the original signed series is safe.
>
> The triangle inequality is the key estimate. Any signed tail has magnitude no larger than the
> corresponding tail of absolute values. If the absolute-value series has tails tending to zero, the
> signed partial sums are Cauchy, and completeness gives convergence.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. If $\sum |a_n|$ converges, then for $m>n$, $|\sum_{k=n}^m a_k|\le\sum_{k=n}^m |a_k|$ — triangle inequality.
2. The absolute-value tail goes to zero — convergence of $\sum|a_n|$ makes its tails small.
3. Therefore the original partial sums are Cauchy — every signed tail is small.
4. In $\mathbb R$, Cauchy partial sums converge — completeness finishes absolute convergence.
5. For $\sum(-1)^{n+1}/n$, alternating monotone terms go to $0$ — Leibniz gives convergence.
6. But $\sum1/n$ diverges — the convergence is conditional.

**Symbols.** $a_n$ are signed terms; $|a_n|$ removes signs; conditional means $\sum a_n$ converges but $\sum|a_n|$ diverges.

**Real-World Applications (§5).**
1. $\sum(-1)^{n+1}/n$ is conditional.
2. Its first $6$ terms sum to $0.616666\ldots$.
3. $\sum(-1)^n/n^2$ is absolute because $\sum1/n^2$ converges.
4. Dropout-style signed corrections need absolute bounds for order-safe accumulation.
5. Alternating-series error after $N$ terms is at most the next term; after $100$ terms it is
   below $1/101$.
6. Rearranging a conditional series can change its sum, so deterministic accumulation order
   matters.

### `math-04-14` — Limits of functions (ε–δ) · AUTHOR derivation
**Connections (§1).**
> Function limits extend the sequence-limit idea from late indices to nearby inputs. The key
> relationship is between an output tolerance and an input tolerance. An epsilon-delta proof records
> exactly how close the input must be to force the desired output closeness. This is the language
> needed for continuity, derivatives, and stability.

**Motivation & Intuition (§2).**
> For functions, closeness is controlled near an input value rather than far out in an index. The
> epsilon-delta definition asks for an input radius that guarantees an output tolerance. This makes
> the idea of approaching a point independent of whether the function is defined at the point itself.
>
> The proof for $x^2$ at $2$ shows the standard pattern. Factor the output error into a controllable
> input error and a nearby bounded factor. A preliminary bound such as $|x-2|<1$ keeps the extra
> factor under control, and the final choice of $\delta$ satisfies both needs.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. To prove $\lim_{x\to2}x^2=4$, start with $|x^2-4|=|x-2||x+2|$ — factor the error.
2. Require $|x-2|<1$ — this keeps $x\in(1,3)$.
3. Then $|x+2|<5$ — local input control bounds the extra factor.
4. Choose $\delta=\min(1,\varepsilon/5)$ — this handles both requirements.
5. If $0<|x-2|<\delta$, then $|x^2-4|<5\delta\le\varepsilon$ — the output error is controlled.

**Symbols.** $\varepsilon$ is output tolerance; $\delta$ is input tolerance; $x\to a$ means $x$ approaches but need not equal $a$.

**Real-World Applications (§5).**
1. For $x^2$ at $2$ with $\varepsilon=0.01$, choose $\delta=0.002$.
2. For $3x+1$ at $2$, $\delta=\varepsilon/3$ works.
3. Numerical stability of a feature transform asks for this input-output control.
4. Clipping a score near a threshold uses a chosen $\delta$ margin.
5. A discontinuous step fails because outputs differ by $1$ arbitrarily near $0$.
6. For $\sin x$ at $0$, $|\sin x|\le |x|$, so $\delta=\varepsilon$ works.

### `math-04-15` — Continuity (ε–δ) · AUTHOR derivation
**Connections (§1).**
> Continuity adds the actual value of the function to the limit idea. A function is continuous at a
> point when nearby inputs have values near the function value at that point. This makes small
> perturbations predictable and rules out jumps. The proof for $x^2$ follows the same factor-and-bound
> pattern as the function-limit proof.

**Motivation & Intuition (§2).**
> Continuity at a point is a limit statement tied to the function's actual value. The input is allowed
> to move slightly, and the output must remain close to $f(a)$. This turns nearby-input behavior into
> a local stability guarantee.
>
> For $x^2$ at $2$, the same algebra used in the limit proof applies. The expression $|x^2-4|$ factors
> into $|x-2||x+2|$, so the input distance can be made small while $|x+2|$ is bounded locally. The
> result is a concrete $\delta$ that proves continuity at the point.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. A function $f$ is continuous at $a$ when for every $\varepsilon>0$ there is $\delta>0$ with $|x-a|<\delta\Rightarrow |f(x)-f(a)|<\varepsilon$ — this is the definition.
2. For $f(x)=x^2$ at $a=2$, rewrite $|f(x)-f(2)|=|x-2||x+2|$ — reduce to the limit proof.
3. Keep $|x-2|<1$, so $|x+2|<5$ — bound the local factor.
4. Choose $\delta=\min(1,\varepsilon/5)$ — a single input radius works.
5. Therefore $x^2$ is continuous at $2$ — the limit equals the value.

**Symbols.** $f(a)$ is the actual function value; continuity at $a$ means limit and value match; $\delta$ may depend on $a$ and $\varepsilon$.

**Real-World Applications (§5).**
1. ReLU is continuous at $0$ because both one-sided values approach $0$.
2. A step activation is not continuous at $0$ because the jump size is $1$.
3. $x^2$ at $2$ uses $\delta=0.002$ for $\varepsilon=0.01$.
4. Continuous loss curves make small parameter perturbations predictable.
5. Bilinear interpolation changes continuously across pixels.
6. A polynomial feature map is continuous at every real input.

### `math-04-16` — Properties of continuous functions · AUTHOR derivation
**Connections (§1).**
> Continuous functions on intervals carry local smoothness into global information. The intermediate
> value theorem says they cannot jump over a value, and the extreme value theorem says they attain
> maxima and minima on closed bounded intervals. Both results rely on completeness and compactness
> ideas from earlier lessons. They are basic tools for root finding, optimization, and calibration.

**Motivation & Intuition (§2).**
> A continuous function on an interval cannot jump from one side of a value to the other without
> reaching it. That is the content of the intermediate value theorem. It turns the geometric picture
> of an unbroken graph into a proof using suprema.
>
> Extreme values require a different global guarantee. On a closed bounded interval, sequences of
> nearly maximal values have convergent subsequences, and the limit remains in the interval.
> Continuity carries the function values to the limit, so the supremum is actually attained.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. For the intermediate value theorem, take $f(a)<y<f(b)$ and define $S=\{x\in[a,b]:f(x)<y\}$ — locate the crossing from below.
2. Let $c=\sup S$ — completeness supplies the boundary point.
3. Continuity rules out $f(c)<y$ and $f(c)>y$ — either inequality would persist in a small neighborhood and contradict the boundary.
4. Therefore $f(c)=y$ — the function reaches the intermediate value.
5. Extreme values follow by compactness: every sequence approaching the supremum of $f([a,b])$ has a convergent subsequence whose limit stays in $[a,b]$ — continuity carries the value to the limit.

**Symbols.** IVT is the intermediate value theorem; EVT is the extreme value theorem; $[a,b]$ is a closed bounded interval.

**Real-World Applications (§5).**
1. If validation loss is continuous and goes from $0.8$ to $0.2$, it equals $0.5$ somewhere.
2. A continuous score crossing from $-1$ to $2$ has a zero.
3. On $[0,1]$, $x(1-x)$ attains maximum $0.25$ at $0.5$.
4. Calibration curves use intermediate crossing points.
5. A continuous clipped activation on $[-3,3]$ has a maximum and minimum.
6. Binary search for a root relies on sign change and IVT.

### `math-04-17` — Uniform continuity · AUTHOR derivation
**Connections (§1).**
> Uniform continuity strengthens ordinary continuity by using one input radius across the whole
> domain. This matters when a local guarantee must be applied globally, such as over an interval, a
> dataset domain, or a bounded parameter set. Compactness is what allows many local radii to be
> reduced to finite control. The result is a stable bridge from pointwise behavior to domain-wide
> behavior.

**Motivation & Intuition (§2).**
> Ordinary continuity may choose a different $\delta$ at each point. That is enough for local
> reasoning but not enough when one tolerance must work over an entire domain. Uniform continuity asks
> for a single radius that applies everywhere.
>
> Compactness provides the mechanism. The local neighborhoods supplied by continuity cover the domain,
> and compactness reduces this cover to finitely many neighborhoods. A finite collection can be
> controlled by one positive scale, giving a global $\delta$ for the chosen $\varepsilon$.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Suppose $f$ is continuous on compact $K$ — every point has its own radius for $\varepsilon/2$.
2. These local neighborhoods cover $K$ — each point is protected by continuity.
3. Compactness gives a finite subcover — finitely many local radii suffice.
4. Let $\delta$ be a Lebesgue-number-scale radius for that finite cover — points within $\delta$ lie in a common protected neighborhood.
5. Then $d(x,y)<\delta$ implies $|f(x)-f(y)|<\varepsilon$ for all $x,y\in K$ — the same radius works everywhere.

**Symbols.** Uniform means one $\delta$ for the whole domain; $K$ is the domain; compactness supplies finite control.

**Real-World Applications (§5).**
1. For a $3$-Lipschitz function, $\delta=0.1/3\approx0.0333$ guarantees output error below $0.1$.
2. $x^2$ is uniformly continuous on $[0,2]$; $\delta=\varepsilon/4$ works from $|x+y|\le4$.
3. $x^2$ is not uniformly continuous on all $\mathbb R$.
4. Numerical quadrature uses one mesh width across the interval.
5. A bounded-input neural layer with Lipschitz constant $5$ needs input tolerance $0.002$ for
   output tolerance $0.01$.
6. Embedding drift bounded by a uniform Lipschitz constant gives global stability.

### `math-04-18` — The derivative, rigorously · AUTHOR derivation
**Connections (§1).**
> The derivative makes local rate of change precise. It begins with slopes of secant lines, which
> compare two nearby function values, and then takes the limiting slope as the input gap shrinks to
> zero. This definition connects algebraic calculation with geometric tangent lines. It also prepares
> the ground for mean-value, Taylor, and optimization results.

**Motivation & Intuition (§2).**
> A secant slope measures average change over a nonzero input gap. As the gap shrinks, those slopes
> may approach a stable value. The derivative is that limiting value when it exists.
>
> For $f(x)=x^2$, the difference quotient simplifies exactly. The term $2a+h$ contains the desired
> local rate $2a$ plus a leftover $h$ that vanishes in the limit. This calculation illustrates how a
> derivative extracts the linear part of local change.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Start with $f(x)=x^2$ and the difference quotient $\frac{f(a+h)-f(a)}{h}$ — this is the secant slope.
2. Substitute: $\frac{(a+h)^2-a^2}{h}$ — compute the change in $f$.
3. Expand: $\frac{2ah+h^2}{h}=2a+h$ — isolate the term that vanishes.
4. Let $h\to0$ — the quotient tends to $2a$.
5. Therefore $(x^2)'\big|_{x=a}=2a$ — the derivative is the limiting slope.

**Symbols.** $h$ is the input increment; $f'(a)$ is the derivative at $a$; the quotient is defined for $h\ne0$ before the limit.

**Real-World Applications (§5).**
1. For $x^2$ at $3$, the derivative is $6$.
2. Linear approximation near $3$: $(3.01)^2\approx9+6(0.01)=9.06$.
3. For $e^x$ at $0$, derivative is $1$.
4. Gradient checks compare finite differences with derivative values.
5. Velocity is derivative of position; $s=t^2$ gives velocity $2t$.
6. A kinked ReLU has left derivative $0$ and right derivative $1$ at $0$, so no derivative there.

### `math-04-19` — The Mean Value Theorem · AUTHOR derivation
**Connections (§1).**
> The Mean Value Theorem connects average change over an interval with instantaneous change at some
> interior point. It turns endpoint information into a derivative statement. The proof subtracts the
> secant line so that Rolle's theorem can find a flat point in the adjusted function. This result is a
> core reason derivative bounds imply Lipschitz and stability bounds.

**Motivation & Intuition (§2).**
> Average slope over an interval is easy to compute from endpoints, but it does not directly tell us a
> local derivative. The Mean Value Theorem supplies the missing link. Under continuity and
> differentiability assumptions, some interior point realizes that average slope as an instantaneous
> slope.
>
> The proof removes the straight-line trend between the endpoints. After subtracting the secant line,
> the adjusted function has equal values at $a$ and $b$. Rolle's theorem then gives an interior point
> with zero adjusted derivative, which rearranges to the mean-value conclusion.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. For continuous $f$ on $[a,b]$ and differentiable inside, define the secant line $\ell(x)=f(a)+\frac{f(b)-f(a)}{b-a}(x-a)$ — match endpoints.
2. Let $g(x)=f(x)-\ell(x)$ — subtract the straight-line trend.
3. Then $g(a)=g(b)=0$ — the adjusted function has equal endpoint values.
4. Rolle's theorem gives some $c\in(a,b)$ with $g'(c)=0$ — a differentiable function returning to the same height has a flat point.
5. Thus $f'(c)=\frac{f(b)-f(a)}{b-a}$ — rearrange $g'(c)=0$.

**Symbols.** $[a,b]$ is the interval; $c$ is the guaranteed interior point; the secant slope is average rate of change.

**Real-World Applications (§5).**
1. For $f(x)=x^2$ on $[1,3]$, average slope is $4$, so $2c=4$ and $c=2$.
2. If $|f'|\le3$ over length $0.2$, output changes by at most $0.6$.
3. Since $|\cos x|\le1$, $|\sin(x)-\sin(y)|\le |x-y|$.
4. Lipschitz loss bounds use derivative suprema.
5. If training loss drops $0.4$ over $10$ epochs, some epoch has average slope $-0.04$ per epoch.
6. MVT justifies line-search slope estimates.

### `math-04-20` — Taylor's theorem with remainder · AUTHOR derivation
**Connections (§1).**
> Taylor's theorem turns differentiability into controlled approximation. A Taylor polynomial matches
> a function and several derivatives at a base point, while the remainder measures what has not been
> captured. The theorem is useful because it does not only approximate; it gives a boundable error
> term. That error term is central in numerical analysis, optimization, and local model building.

**Motivation & Intuition (§2).**
> A polynomial is often easier to compute with than the original function. Taylor's theorem explains
> when a polynomial built from derivatives at a point is a valid local approximation. Matching more
> derivatives gives a higher-order approximation.
>
> The remainder is the essential part of the theorem. It identifies the next derivative as the source
> of error and places it at some intermediate point. Bounding that derivative turns Taylor's formula
> into a practical error estimate rather than just a formal expansion.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Expand $f$ at $a$ through degree $n$: $P_n(x)=\sum_{k=0}^n f^{(k)}(a)(x-a)^k/k!$ — match derivatives at $a$.
2. Define the error $R_n(x)=f(x)-P_n(x)$ — separate approximation from remainder.
3. Repeated Rolle-style reasoning gives $R_n(x)=f^{(n+1)}(\xi)(x-a)^{n+1}/(n+1)!$ for some $\xi$ between $a$ and $x$ — the unmatched derivative controls the error.
4. If $|f^{(n+1)}|\le M$, then $|R_n(x)|\le M|x-a|^{n+1}/(n+1)!$ — turn the existence form into a bound.

**Symbols.** $P_n$ is the Taylor polynomial; $R_n$ is the remainder; $\xi$ is an intermediate point; $M$ bounds the next derivative.

**Real-World Applications (§5).**
1. $e^1\approx1+1+1/2+1/6=2.666666\ldots$ with order-$3$ polynomial.
2. The order-$3$ remainder for $e^1$ is at most $e/24\approx0.11326$.
3. For $\sin x\approx x$, error is at most $|x|^3/6$.
4. Newton methods use a second-order Taylor model.
5. Trust regions choose radius so the remainder stays small.
6. For $\log(1+x)$ at $0$, $x-x^2/2$ gives $0.095$ at $x=0.1$.

### `math-04-21` — The Riemann integral · AUTHOR derivation
**Connections (§1).**
> The Riemann integral defines accumulated area through finite partitions. Lower sums and upper sums
> trap the possible area from below and above. When the trap can be made arbitrarily tight, the
> function has a single well-defined integral. This viewpoint connects area, averaging, probability
> mass, and accumulated quantities.

**Motivation & Intuition (§2).**
> Area under a curve can be approximated by rectangles. Lower rectangles use the smallest value on
> each subinterval, while upper rectangles use the largest value. The true area, if it exists, must
> lie between those two sums.
>
> Riemann integrability means the upper and lower estimates can be forced as close as desired.
> Refining the partition reduces the uncertainty until there is only one possible accumulated value.
> This definition is precise enough to support probability densities, averages, and physical
> accumulation.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Partition $[a,b]$ into subintervals — replace a continuum with finitely many pieces.
2. On each piece, take $m_i=\inf f$ and $M_i=\sup f$ — lower and upper rectangle heights.
3. Form $L(P,f)=\sum m_i\Delta x_i$ and $U(P,f)=\sum M_i\Delta x_i$ — these bracket the area.
4. If for every $\varepsilon>0$ some partition has $U(P,f)-L(P,f)<\varepsilon$, the lower and upper integrals agree — there is a single area value.
5. That common value is $\int_a^b f(x)\,dx$ — the Riemann integral.

**Symbols.** $P$ is a partition; $\Delta x_i$ is subinterval width; $L$ and $U$ are lower and upper sums.

**Real-World Applications (§5).**
1. For $f(x)=x$ on $[0,1]$, the integral is $1/2$.
2. For $f(x)=x^2$ on $[0,1]$, the integral is $1/3$.
3. A uniform partition with $1000$ intervals has mesh width $0.001$.
4. If oscillation per interval is below $0.001$ over total length $2$, upper-lower gap is below
   $0.002$.
5. Pixel intensities averaged over a line segment approximate a Riemann integral.
6. Probability density over $[0,1]$ must integrate to $1$.

### `math-04-22` — The Fundamental Theorem of Calculus · AUTHOR derivation
**Connections (§1).**
> The Fundamental Theorem of Calculus links the two main operations of calculus. Integration
> accumulates values over an interval, while differentiation reads off local rate of change. The
> theorem says that differentiating accumulated area recovers the original continuous function. It
> also turns definite integrals into endpoint differences of antiderivatives.

**Motivation & Intuition (§2).**
> Accumulation and rate of change are inverse ideas in calculus. If $F(x)$ records the area
> accumulated up to $x$, then increasing $x$ by a small $h$ adds only the area over a short interval.
> Dividing by $h$ gives the average value of $f$ over that short interval.
>
> Continuity makes that short-interval average approach the point value $f(x)$. Thus the derivative of
> the accumulation function is the original integrand. The antiderivative form follows by comparing
> any function $G$ with derivative $f$ to the accumulation function.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Define $F(x)=\int_a^x f(t)\,dt$ — accumulated area up to $x$.
2. Compute the difference quotient: $\frac{F(x+h)-F(x)}{h}=\frac1h\int_x^{x+h}f(t)\,dt$ — subtract adjacent areas.
3. By continuity, $f(t)$ is close to $f(x)$ when $t$ is close to $x$ — the average value over a short interval is close to $f(x)$.
4. Let $h\to0$ to get $F'(x)=f(x)$ — the local average becomes the point value.
5. If $G'=f$, then $\int_a^b f=G(b)-G(a)$ — apply the result to $G-G(a)$.

**Symbols.** $F$ is the accumulation function; $f$ is the integrand; $G$ is any antiderivative.

**Real-World Applications (§5).**
1. $\int_0^1 2x\,dx=1^2-0^2=1$.
2. Accumulated gradient over a path recovers potential change.
3. Cumulative distribution derivatives recover density.
4. Area under velocity gives displacement; constant velocity $3$ for $4$ seconds gives $12$.
5. Training loss decrease equals integral of its time derivative in continuous-time models.
6. $\int_0^\pi \cos x\,dx=0-0=0$.

### `math-04-23` — Sequences of functions · AUTHOR derivation
**Connections (§1).**
> Sequences of functions add a new layer to ordinary sequences. Each index now carries an entire
> function, so convergence can be checked input by input or over the whole domain at once. The example
> $f_n(x)=x^n$ shows why those two notions differ. It also prepares the contrast between pointwise and
> uniform convergence.

**Motivation & Intuition (§2).**
> A sequence of functions can converge differently at different inputs. For each fixed $x$, the values
> $f_n(x)$ form an ordinary numeric sequence. Studying all those numeric sequences gives pointwise
> convergence.
>
> The example $x^n$ on $[0,1]$ shows the endpoint issue. Every fixed $x<1$ produces geometric decay to
> zero, while $x=1$ stays equal to one forever. Because points close to one decay very slowly, no
> uniform cutoff controls the whole interval.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Define $f_n(x)=x^n$ on $[0,1]$ — a concrete sequence of functions.
2. If $0\le x<1$, then $x^n\to0$ — geometric decay.
3. If $x=1$, then $x^n=1$ for every $n$ — the endpoint stays fixed.
4. Therefore the pointwise limit is $f(x)=0$ for $x<1$ and $f(1)=1$ — limits depend on the input.
5. The convergence is not uniform because $\sup_{[0,1]}|f_n-f|$ stays $1$ near the endpoint — no single $N$ controls all $x$.

**Symbols.** $f_n$ is the $n$th function; pointwise means fix $x$ first; uniform means control the supremum over $x$.

**Real-World Applications (§5).**
1. $0.5^{10}=0.0009765625$ for $f_{10}(0.5)$.
2. At $x=0.9$, $0.9^{10}\approx0.3487$.
3. At $x=1$, every $f_n(1)=1$.
4. Model families indexed by width form sequences of functions.
5. Approximation curves can converge for each data point but fail uniformly.
6. Uniform error $\sup_x|f_n-f|<0.01$ is stronger than test-point error.

### `math-04-24` — Series of functions · AUTHOR derivation
**Connections (§1).**
> Series of functions combine infinite sums with function behavior across a domain. The main challenge
> is controlling all inputs while adding infinitely many terms. The Weierstrass M-test solves this by
> comparing each function term to a numeric majorant. When the numeric majorants have a convergent
> sum, the function series has a uniform tail bound.

**Motivation & Intuition (§2).**
> Adding functions term by term creates a sequence of partial-sum functions. To know that the infinite
> sum behaves well on a domain, the tails must be controlled uniformly in $x$. A pointwise tail
> estimate is often not enough.
>
> The M-test supplies a clean sufficient condition. If each $|f_n(x)|$ is bounded by a numeric $M_n$
> and the numeric series converges, then every function tail is bounded by the same numeric tail. This
> makes the partial sums uniformly Cauchy and gives uniform convergence.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Suppose $|f_n(x)|\le M_n$ for every $x$ in the domain — dominate each function by a numeric term.
2. If $\sum M_n$ converges, then its tails become small — numeric convergence supplies a tail bound.
3. For $m>n$, $|\sum_{k=n}^m f_k(x)|\le\sum_{k=n}^m M_k$ for all $x$ — triangle inequality works uniformly.
4. The function partial sums are uniformly Cauchy — the same tail bound works for every $x$.
5. Therefore $\sum f_n$ converges uniformly — this is the Weierstrass M-test.

**Symbols.** $f_n$ is a function term; $M_n$ is a numeric majorant; uniform Cauchy means one cutoff controls all inputs.

**Real-World Applications (§5).**
1. $\sum x^n/2^n$ on $[0,1]$ is bounded by $\sum2^{-n}=2$ if starting at $0$.
2. Tail after $7$ terms of a $1/2$ majorant is $0.015625$.
3. Neural basis expansions use coefficient bounds to guarantee convergence.
4. Fourier-like approximations need uniform tails for pointwise plotting guarantees.
5. Power series inside $|x|\le0.5$ have geometric tail bounds.
6. If $M_n=10^{-n}$, total bound is $1/9$ when starting at $n=1$.

### `math-04-25` — Pointwise convergence · AUTHOR derivation
**Connections (§1).**
> Pointwise convergence fixes one input and then studies the resulting numeric sequence. This makes
> the definition approachable, but it also allows the required cutoff to vary from point to point.
> Near difficult parts of the domain, the cutoff may become very large. That is why pointwise
> convergence alone does not preserve many global properties.

**Motivation & Intuition (§2).**
> Pointwise convergence is the most direct way to define convergence for functions. Fix an input, then
> apply the familiar sequence-limit definition to the values at that input. The allowed cutoff $N$ may
> depend on the chosen input.
>
> For $x^n$ on $[0,1)$, every fixed $x<1$ gives a ratio below one, so the values go to zero. But as
> $x$ approaches one, that ratio becomes closer to one and the necessary cutoff grows. This dependence
> on $x$ explains why pointwise convergence can fail to preserve continuity.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. For $f_n(x)=x^n$ on $[0,1)$, fix one $x<1$ — pointwise convergence starts by freezing the input.
2. Since $0\le x<1$, the geometric sequence $x^n$ tends to $0$ — the fixed input supplies a ratio below $1$.
3. Given $\varepsilon>0$, choose $N>\log(\varepsilon)/\log(x)$ when $x>0$ — this makes $x^N<\varepsilon$.
4. For $n\ge N$, $|f_n(x)-0|<\varepsilon$ — convergence holds at that point.
5. The needed $N$ grows as $x$ approaches $1$ — this is why pointwise need not be uniform.

**Symbols.** $x$ is fixed before choosing $N$; $f_n(x)$ is the value of the $n$th function at that point; $f(x)$ is the pointwise limit.

**Real-World Applications (§5).**
1. At $x=0.5$, $n=10$ gives $0.0009765625$.
2. At $x=0.9$, reaching below $0.01$ needs $n\ge44$.
3. At $x=0.99$, the needed $n$ is much larger, about $459$ for $0.01$.
4. A model can converge on each fixed example but not uniformly over all inputs.
5. Pointwise confidence estimates do not guarantee worst-case confidence.
6. The limit of continuous $x^n$ on $[0,1]$ is discontinuous, showing pointwise convergence does
   not preserve continuity.

### `math-04-26` — Uniform convergence · AUTHOR derivation
**Connections (§1).**
> Uniform convergence controls the largest error over the entire domain. Unlike pointwise convergence,
> it uses one cutoff that works for all inputs. This stronger control is what lets continuity pass
> from approximating functions to their limit. The proof is a careful triangle-inequality argument
> using one continuous approximant.

**Motivation & Intuition (§2).**
> Uniform convergence asks for the same cutoff to work for every input. Equivalently, the supremum of
> the error over the domain must go to zero. This makes it a worst-case convergence guarantee.
>
> The preservation of continuity follows by using one approximating function $f_N$. Uniform
> convergence makes both $f(x)$ and $f(a)$ close to $f_N(x)$ and $f_N(a)$, while continuity of $f_N$
> controls the middle difference. The three errors are each kept below $\varepsilon/3$.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Suppose $f_n\to f$ uniformly and each $f_n$ is continuous — start with the preservation theorem.
2. Given $\varepsilon>0$, choose $N$ so $|f_N(x)-f(x)|<\varepsilon/3$ for all $x$ — uniform convergence gives global approximation.
3. By continuity of $f_N$ at $a$, choose $\delta$ so $|x-a|<\delta$ implies $|f_N(x)-f_N(a)|<\varepsilon/3$ — one fixed function is continuous.
4. Use the triangle inequality on $|f(x)-f(a)|$ with three terms — approximate both endpoint values by $f_N$.
5. The total is below $\varepsilon$ — the limit $f$ is continuous.

**Symbols.** $\sup_x|f_n(x)-f(x)|$ is the worst-case error; uniform convergence means that supremum goes to $0$.

**Real-World Applications (§5).**
1. If $\sup|f_n-f|<0.01$, every prediction is within $0.01$.
2. $x^n$ on $[0,0.5]$ converges uniformly with error at most $0.5^n$.
3. At $n=10$, that uniform error is $0.0009765625$.
4. Uniformly convergent continuous surrogate models keep continuity.
5. Uniform loss convergence supports generalization bounds.
6. Uniform convergence of gradients is a route to stable optimizer behavior.

### `math-04-27` — Power series and analyticity · AUTHOR derivation
**Connections (§1).**
> Power series are infinite polynomial expansions centered at a point. They are easier to control than
> arbitrary function series because powers separate coefficient growth from distance to the center.
> The radius of convergence marks the region where the series behaves reliably. Inside that radius,
> analytic functions can be studied through their coefficients and tails.

**Motivation & Intuition (§2).**
> Power series behave like infinite polynomials centered at $c$. Each term has a coefficient and a
> power of the distance $x-c$. This structure lets convergence be decided by comparing coefficient
> growth with distance from the center.
>
> The root test isolates exactly that comparison. The $n$th root of the absolute term separates into
> $\sqrt[n]{|a_n|}$ and $|x-c|$. The boundary where their product crosses one determines the radius of
> convergence, while endpoint behavior needs separate analysis.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Consider $\sum a_n(x-c)^n$ — terms are powers around center $c$.
2. Apply the root test to absolute values: $\sqrt[n]{|a_n(x-c)^n|}=\sqrt[n]{|a_n|}\,|x-c|$ — separate coefficient growth from distance.
3. Let $L=\limsup\sqrt[n]{|a_n|}$ — this measures asymptotic coefficient size.
4. The series converges when $L|x-c|<1$ and diverges when $L|x-c|>1$ — root test.
5. Therefore the radius is $R=1/L$ — endpoints need separate checks.

**Symbols.** $c$ is the center; $a_n$ are coefficients; $R$ is the radius of convergence; analytic means equal to a power series locally.

**Real-World Applications (§5).**
1. $\sum x^n$ has radius $1$.
2. $\sum (3x)^n$ has radius $1/3$.
3. $e^x=\sum x^n/n!$ has infinite radius.
4. Taylor approximations of activations use power-series truncations.
5. Inside $|x|\le0.5$, geometric tail after $10$ is at most $0.001953125$.
6. Analytic kernels can be expanded into feature maps.

### `math-04-28` — Metric spaces · AUTHOR derivation
**Connections (§1).**
> Metric spaces keep the idea of distance while removing dependence on coordinates or the real line.
> Once a distance function satisfies the metric rules, analysis can discuss balls, limits, Cauchy
> sequences, compactness, and contractions. This abstraction lets the same proofs apply to vectors,
> functions, strings, distributions, and other objects. The Euclidean metric is the guiding example.

**Motivation & Intuition (§2).**
> Many spaces have a meaningful notion of distance even when their elements are not real numbers. A
> metric abstracts the rules that distance must obey. With those rules, balls and convergence can be
> defined in the same way across many settings.
>
> The triangle inequality is the most important structural rule. It says that traveling through an
> intermediate point cannot beat the direct shortest-distance bound. In Euclidean space,
> Cauchy-Schwarz proves this rule algebraically, showing that the familiar distance fits the metric
> framework.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. A metric $d$ must satisfy $d(x,y)\ge0$ and $d(x,y)=0$ only when $x=y$ — distance is nonnegative and separates points.
2. It must satisfy $d(x,y)=d(y,x)$ — distance is symmetric.
3. It must satisfy $d(x,z)\le d(x,y)+d(y,z)$ — going through $y$ cannot be shorter than the shortest direct distance.
4. For Euclidean distance, the triangle inequality follows from Cauchy-Schwarz: $\|u+v\|^2\le(\|u\|+\|v\|)^2$ — algebra proves the metric rule.

**Symbols.** $X$ is the set; $d$ is the distance function; open balls are $B(x,r)=\{y:d(x,y)<r\}$.

**Real-World Applications (§5).**
1. Euclidean distance between $(0,0)$ and $(3,4)$ is $5$.
2. Cosine distance is used for embeddings after normalization.
3. Edit distance between strings is a metric in NLP.
4. Wasserstein distance compares distributions.
5. Nearest-neighbor search only needs a metric-like distance.
6. In discrete metric, $d(x,y)=1$ for distinct points, so every ball of radius $0.5$ is a
   singleton.

### `math-04-29` — Open and closed sets · AUTHOR derivation
**Connections (§1).**
> Open and closed sets describe the local shape of a space. Open sets contain a small ball around each
> of their points, while closed sets keep the limits of convergent sequences that stay inside. These
> definitions connect geometry with convergence. They also provide the language used in compactness,
> constraints, continuity, and stability arguments.

**Motivation & Intuition (§2).**
> Open sets formalize the idea that each included point has some room to move while staying inside.
> Closed sets formalize the idea that limits of internal sequences are not lost. These two views are
> linked through complements.
>
> The sequence characterization of closed sets is often the most useful in analysis. If a sequence
> stays in a closed set and converges, the limit cannot fall outside because the open complement would
> eventually capture the tail. Conversely, if outside points had no protective ball, one could build a
> sequence from the set converging to that outside point.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. A set $U$ is open if every $x\in U$ has some $r>0$ with $B(x,r)\subset U$ — each point has breathing room.
2. A set $F$ is closed if its complement is open — outside points have room to stay outside.
3. If $F$ is closed and $x_n\in F$ with $x_n\to x$, then $x\in F$ — otherwise the open complement would contain a ball around $x$ that eventually contains $x_n$, contradiction.
4. Conversely, if every convergent sequence in $F$ has its limit in $F$, then the complement is open — failure of openness would build a sequence in $F$ converging to an outside point.

**Symbols.** $B(x,r)$ is an open ball; $U$ denotes open; $F$ denotes closed; complement means all points not in the set.

**Real-World Applications (§5).**
1. $(0,1)$ is open in $\mathbb R$ but not closed.
2. $[0,1]$ is closed but not open in $\mathbb R$.
3. If $x=0.4$ in $(0,1)$, radius $0.1$ stays inside.
4. A margin set $\{x:f(x)>0.2\}$ is open when $f$ is continuous.
5. Feasible constraints $g(x)\le0$ are closed for continuous $g$.
6. If a point is $0.05$ from a decision boundary, a ball of radius $0.025$ stays on the same
   side.

### `math-04-30` — Compactness · AUTHOR derivation
**Connections (§1).**
> Compactness is a way to turn infinitely many local facts into finitely many facts. On the real line,
> closed and bounded sets have this property. Compactness is powerful because it supports subsequence
> extraction, extreme values, uniform continuity, and finite coverings. It is the final structural
> idea needed before contraction mapping and convergence guarantees.

**Motivation & Intuition (§2).**
> Infinite sets can still be manageable when local information has finite control. Compactness records
> this by requiring every open cover to have a finite subcover. On real intervals, this aligns with
> the familiar condition of being closed and bounded.
>
> The proof uses the same nested-interval intuition as Bolzano-Weierstrass. Boundedness lets us
> extract convergent subsequences, closedness keeps their limits inside, and metric-space equivalences
> connect sequential compactness with finite subcovers. This is why compact sets support global
> existence and uniformity results.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. In $\mathbb R$, a compact set is one where every open cover has a finite subcover — infinitely many local neighborhoods reduce to finitely many.
2. For $[a,b]$, bisect intervals as in Bolzano-Weierstrass to show every sequence has a convergent subsequence — boundedness creates nested intervals.
3. Closedness keeps the subsequential limit inside the set — no boundary point is missing.
4. Sequential compactness implies finite-subcover compactness in metric spaces — otherwise one can choose points escaping every finite cover and extract a convergent contradiction.
5. Therefore closed bounded intervals are compact — this is Heine-Borel in one dimension.

**Symbols.** Open cover means open sets whose union contains $K$; finite subcover means finitely many still cover $K$; compact means finite control.

**Real-World Applications (§5).**
1. $[0,1]$ is compact.
2. $(0,1)$ is not compact because the cover $(1/n,1)$ has no finite subcover.
3. A continuous loss on compact parameters attains a minimum.
4. A grid with spacing $0.01$ on $[0,1]$ has $101$ points.
5. Clipping weights to $[-1,1]^d$ creates a closed bounded box.
6. Robustness certificates often cover a compact perturbation ball with finitely many local
   bounds.

### `math-04-31` — The contraction mapping theorem · AUTHOR derivation · MODEL
**Connections (§1).**
> This lesson brings together several ideas from the section. A metric space gives a way to measure
> distance, a Cauchy sequence describes terms that crowd together, and completeness says that such a
> sequence has a point to crowd around. The contraction mapping theorem uses all three ideas in one
> useful result. The theorem is also a bridge from abstract analysis to algorithms because it gives
> both a fixed point and a rate of approach.

**Motivation & Intuition (§2).**
> Many numerical methods are built by turning a hard equation into a repeated update. Instead of
> solving $x=g(x)$ directly, we start from $x_0$ and compute $x_1=g(x_0)$, $x_2=g(x_1)$, and so on.
> This process is reliable only when the update pulls points closer together.
>
> The contraction mapping theorem turns that picture into a proof. The shrinking condition gives a
> geometric tail bound, so the iterates are Cauchy. Completeness supplies the limit, and the same
> shrinking inequality forces the limit to be the unique fixed point.

**Definition & Assumptions (§3).** Display the theorem
$$
d(Tx,Ty)\le q\,d(x,y),\qquad 0\le q<1.
$$
If $(X,d)$ is complete and $T:X\to X$ satisfies this inequality, then $T$ has a unique fixed point $x^*$ and
$T^n x_0\to x^*$ for every starting point $x_0$.

**Derive (complete).**
1. Let $x_{n+1}=T(x_n)$ — this is the iteration whose limit we want to prove exists.
2. Apply the contraction repeatedly: $d(x_{n+1},x_n)\le q^n d(x_1,x_0)$ — each new gap is at most $q$ times the previous gap.
3. For $m>n$, use the triangle inequality: $d(x_m,x_n)\le \sum_{k=n}^{m-1}d(x_{k+1},x_k)$ — a long jump is bounded by short jumps.
4. Bound the sum by a geometric tail: $d(x_m,x_n)\le d(x_1,x_0)\sum_{k=n}^{m-1}q^k\le d(x_1,x_0)q^n/(1-q)$ — tails vanish because $q<1$.
5. Given $\varepsilon>0$, choose $n$ so $d(x_1,x_0)q^n/(1-q)<\varepsilon$ — this proves $(x_n)$ is Cauchy.
6. Completeness gives a limit $x_n\to x^*$ — Cauchy sequences in $X$ are guaranteed to converge inside $X$.
7. Use $d(Tx^*,x^*)\le d(Tx^*,T x_n)+d(x_{n+1},x^*)\le qd(x^*,x_n)+d(x_{n+1},x^*)\to0$ — the limit is fixed.
8. If $u$ and $v$ are fixed, then $d(u,v)=d(Tu,Tv)\le qd(u,v)$ — since $q<1$, this forces $d(u,v)=0$, so $u=v$.

**Symbols.** $(X,d)$ is the metric space; complete means every Cauchy sequence in $X$ converges to a point of
$X$; $T$ is the update map; $q$ is the contraction factor; $x^*$ is the unique fixed point; $x_n=T^n x_0$ is
the $n$th iterate.

**Real-World Applications (§5).**
1. **Fixed-point solver.** If $q=0.5$ and the initial gap bound is $1$, after $10$ steps the tail bound is
   $0.5^{10}/(1-0.5)=0.001953125$.
2. **Value iteration.** With discount $\gamma=0.9$, the Bellman update is a $0.9$-contraction; after $44$ rounds,
   $0.9^{44}<0.01$, so the leading error factor is below one percent.
3. **Gradient method near a strong convex optimum.** If the local contraction factor is $0.8$, then after $21$
   steps the distance factor is $0.8^{21}\approx0.00922$.
4. **Fixed-point layer iteration budget.** A tolerance $10^{-3}$ with $q=0.5$ needs $n\ge10$ because
   $2^{-10}=0.0009765625$.
5. **Picard iteration for an ODE.** On a short interval with Lipschitz constant $L=2$ and length $h=0.2$, the
   Picard map has factor $Lh=0.4$, so the theorem applies.
6. **Denoising iteration.** If an update halves the distance between any two images, two starting images
   initially $12$ units apart are at most $12\cdot0.5^5=0.375$ apart after five iterations.

### `math-04-32` — Convergence guarantees for gradient methods · AUTHOR derivation · ML capstone
**Connections (§1).**
> This capstone connects the section's convergence language to gradient methods. Sequences describe
> iterates, metrics measure distance to an optimum, and contraction estimates provide rates. Strong
> convexity and smoothness supply the analytic assumptions that make a gradient step reliable. The
> result is a real-analysis explanation of when a common optimization procedure converges
> geometrically.

**Motivation & Intuition (§2).**
> Gradient descent produces a sequence, so convergence is an analysis question. The goal is to show
> not only that the objective improves, but that the iterates move toward a definite minimizer. Strong
> convexity and smoothness are the assumptions that make this possible.
>
> Under a safe step size, the gradient update behaves like a contraction toward $x^*$. Each iteration
> reduces the distance by a factor such as $1-\eta\mu$. Repeating the inequality gives a geometric
> bound, which turns a qualitative convergence claim into an iteration-count estimate.

**Definition & Assumptions (§3).**

**Derive (complete).**
1. Assume $f$ is $\mu$-strongly convex and $L$-smooth — curvature is bounded below by $\mu$ and above by $L$.
2. Use the gradient step $x_{k+1}=x_k-\eta\nabla f(x_k)$ with $0<\eta\le1/L$ — the step is small enough for smoothness.
3. Strong convexity and smoothness imply $\|x_{k+1}-x^*\|\le(1-\eta\mu)\|x_k-x^*\|$ for the quadratic model and, more generally, a contraction in the appropriate norm — curvature pulls toward the minimizer.
4. Iterate the inequality: $\|x_k-x^*\|\le(1-\eta\mu)^k\|x_0-x^*\|$ — repeated contraction gives a geometric rate.
5. Since $(1-\eta\mu)^k\to0$, the iterates converge to $x^*$ — geometric decay proves convergence.

**Symbols.** $\eta$ is learning rate; $\mu$ is strong-convexity curvature; $L$ is smoothness; $x^*$ is the minimizer; $k$ is the iteration count.

**Real-World Applications (§5).**
1. For $f(x)=\tfrac12x^2$ and $\eta=0.1$, $x_{k+1}=0.9x_k$.
2. Starting at $10$, after $10$ steps with factor $0.8$, distance is
   $10\cdot0.8^{10}=1.073741824$.
3. Factor $0.8$ needs $21$ steps to get below one percent.
4. If $L=5$, the safe fixed step is $\eta\le0.2$.
5. If $\mu=1$ and $\eta=0.1$, rate factor is $0.9$.
6. Early stopping can be tied to a tolerance: with factor $0.5$, ten steps reduce error below
   $0.001$ times a unit initial error.


---

## Build order for this section

1. **Mechanical LaTeX pass first.** Fix every odd-`$` field listed above before broader prose edits so MathJax failures do not obscure content review.
2. **Model and convergence spine.** Author `04-31` first, then `04-10`, `04-04`, `04-09`, and `04-32`; these establish completeness, compactness, Cauchy behavior, contractions, and ML convergence.
3. **Epsilon and sequence cluster.** Author `04-06` through `04-17` as one pass so the epsilon-N and epsilon-delta notation stays consistent.
4. **Calculus rigor cluster.** Author `04-18` through `04-22` together: derivative, MVT, Taylor, Riemann integral, FTC.
5. **Function-space and metric cluster.** Author `04-23` through `04-30` together, ending with compactness as the bridge into contraction mapping.
6. **Concept introductions last.** Polish `04-01` through `04-03` after the theorem lessons so the proof-technique and real-number introductions point forward accurately.
