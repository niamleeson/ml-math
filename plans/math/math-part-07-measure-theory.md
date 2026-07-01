# Math · Part 07 — Measure theory  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles (warm voice · complete step-by-step derivations · case-by-case · name every
> symbol), the fix recipe, and the Definition of Done. This section is the rigorous foundation underneath
> probability, expectation, densities, and expected loss. Numbers below were checked with `python3` in the
> project root; representative checks include simple-function expectation $0.2+2+3=5.2$, $L^2=2.214$,
> Radon--Nikodym mass $0.75$, Fubini integral $0.25$, and Jensen values $1.96\le3.20$.

**Section:** Measure theory · **Lessons:** 20 · **Breadcrumb:** `Mathematics · Analysis & Calculus` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — no whole-section shared application block detected | 0 / 20 |
| Templated / thin motivation | 0 / 20 |
| Key formula not in display form; promote and gloss symbols | 5 / 20 |
| Unclosed dollar-sign LaTeX bug | 0 / 20 |
| Derivation to author / deepen / explain-only in this plan | 17 derivation lessons / 3 explain-only lessons |

**The core change:** keep the existing strong conceptual spine, especially `math-07-08`, but deepen every
lesson into a per-lesson authoring spec. Each §5 set now uses that lesson's own object: measurable events,
simple-function integrals, countable additivity, convergence theorems, $L^p$ norms, densities, likelihood
ratios, and expectations as Lebesgue integrals.

---

## Priority & systemic issues

- **No §5 boilerplate block.** The current applications are already mostly on-topic, so the work is not a
  bulk replacement. The work is to make each application numerically re-derivable from the lesson's exact
  concept.
- **Measure theory has many definition lessons.** Mark only genuinely conceptual lessons explain-only:
  `math-07-01`, `math-07-03`, and `math-07-20`. Do not force fake proofs into them. Other definition-heavy
  lessons still have real consequences to derive, such as closure under countable intersections,
  monotonicity, probability complement rules, pushforward measures, and simple-function integrals.
- **Probability connection.** Thread expected loss through the section: a loss is a measurable function, risk
  is $\int L\,dP$, empirical risk is an integral against an empirical measure, density ratios are
  Radon--Nikodym derivatives, and moment bounds live in $L^p$.
- **Formula display fixes.** Promote the central formulas in `07-03`, `07-06`, `07-07`, `07-16`, and `07-20`
  to display form and gloss every symbol.
- **LaTeX bugs.** None found in the current section dump. Flag only genuine future issues: odd dollar counts
  or broken matrix row breaks.

---

## Model entry (full prose)

### `math-07-17` — Expectation as a Lebesgue integral  — **full-depth model entry (this is the bar)**

**Connections (§1).** *(Plain textbook voice: what the reader already knows, and where this fits. Prose, not a bullet list.)*
> This lesson connects the integral built in `math-07-08` with the average used throughout probability and
> machine learning. Earlier lessons made two pieces precise. A random variable is a measurable function, and
> the Lebesgue integral adds a measurable function over a measure space. When the measure is a probability
> measure, that integral is expectation.
>
> This viewpoint is more than a change in notation. It makes discrete averages, continuous averages,
> indicator probabilities, expected losses, and moments all part of one definition. It also explains why
> convergence theorems matter in probability: they are the rules that allow limits to pass through
> expectations when a model, estimator, or approximation improves.

**Motivation & Intuition (§2).** *(Plain, clear explanation of the concept itself.)*
> An ordinary average adds observed values and divides by how many observations there are. A probability
> average does the same thing, except the weights come from probability mass instead of from a fixed list.
> If $X$ takes values $0,1,3$ with probabilities $0.2,0.5,0.3$, the average is
> $0\cdot0.2+1\cdot0.5+3\cdot0.3=1.4$.
>
> The Lebesgue integral writes that same calculation without separating the discrete and continuous cases.
> The random variable $X$ is a measurable function on the outcome space $\Omega$, and the probability
> measure $P$ supplies the weights. The expectation is
> $$
> \mathbb E[X]=\int_\Omega X\,dP.
> $$
> For an indicator function this gives $\mathbb E[\mathbf 1_A]=P(A)$; for a loss function it gives the risk
> $\mathbb E[L]=\int L\,dP$; for a density it gives the familiar integral $\int x f(x)\,dx$.
>
> This is the foundation of expected loss in machine learning. Training objectives often replace the true
> probability measure by an empirical one, but the object being approximated is still an integral. The same
> definition also supports Jensen's inequality, moment bounds, and change-of-measure formulas later in the
> probability track.

**Definition & Assumptions (§3).** Display
$$
\mathbb E[X]=\int_\Omega X\,dP
$$
when the Lebesgue integral is defined. For signed $X$, require $\mathbb E[X^+]<\infty$ or
$\mathbb E[X^-]<\infty$ so the expression is not $\infty-\infty$.

**Derive (complete).** From simple random variables to expectation and Jensen:
1. Write a simple random variable as $X=\sum_{k=1}^n x_k\mathbf 1_{A_k}$, where the disjoint events $A_k$ are
   the value regions $\{\omega:X(\omega)=x_k\}$. This partitions the outcomes by the value of $X$.
2. Integrate the simple function: $\int X\,dP=\sum_{k=1}^n x_k P(A_k)$. This is the Lebesgue integral rule for
   simple functions.
3. Read $P(A_k)$ as $P(X=x_k)$. This changes the same weights from event notation to distribution notation.
4. Conclude $\mathbb E[X]=\sum_{k=1}^n x_kP(X=x_k)$ for finite-valued $X$. This recovers the familiar weighted
   average from the integral definition.
5. For an indicator, set $X=\mathbf 1_A=1\cdot\mathbf 1_A+0\cdot\mathbf 1_{A^c}$. This is the simplest
   two-value simple function.
6. Integrate: $\mathbb E[\mathbf 1_A]=1\cdot P(A)+0\cdot P(A^c)=P(A)$. This shows probabilities are special
   expectations.
7. For a convex function $\varphi$, draw a supporting line at the mean $m=\mathbb E[X]$:
   $\varphi(x)\ge \varphi(m)+a(x-m)$. This is the defining geometric property of convexity.
8. Take expectations of both sides:
   $\mathbb E[\varphi(X)]\ge\varphi(m)+a(\mathbb E[X]-m)=\varphi(m)$. This gives Jensen's inequality
   $\varphi(\mathbb E[X])\le\mathbb E[\varphi(X)]$.

**Symbols.** $\Omega$ is the outcome space; $\mathcal F$ is the event sigma-algebra; $P$ is the probability
measure; $X$ is a measurable real-valued function; $X^+=\max(X,0)$ and $X^-=\max(-X,0)$ are positive and
negative parts; $\mathbf 1_A$ is the indicator of event $A$; $\varphi$ is a convex function; $m$ is the mean.

**Real-World Applications (§5).**
1. **Expected loss.** If losses $L\in\{1,4,10\}$ occur with probabilities $(0.2,0.5,0.3)$, then
   $\mathbb E[L]=1(0.2)+4(0.5)+10(0.3)=5.2$.
2. **Empirical risk.** The empirical measure on four losses $(1.0,0.5,2.0,1.5)$ gives
   $\int L\,dP_n=(1.0+0.5+2.0+1.5)/4=1.25$.
3. **Indicator metric.** If a classifier violates a latency budget on event $A$ with $P(A)=0.07$, then
   $\mathbb E[\mathbf 1_A]=0.07$.
4. **Mean squared error.** If errors are $1,2,3$ with probabilities $(0.2,0.5,0.3)$, then
   $\mathbb E[E^2]=0.2(1)^2+0.5(2)^2+0.3(3)^2=4.9$.
5. **A/B experiment lift.** If treatment lift is $-1,0,3$ with probabilities $(0.2,0.5,0.3)$, then the expected
   lift is $-0.2+0+0.9=0.7$.
6. **Jensen for risk.** With $X\in\{0,1,3\}$ and probabilities $(0.2,0.5,0.3)$,
   $(\mathbb E[X])^2=1.4^2=1.96\le\mathbb E[X^2]=3.2$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson, in render order. The labels
(Intuition / Derive / Symbols / Apps) are plan shorthand; the app should expand them into flowing prose in a
plain, warm textbook voice. Every app set has exactly six concept-specific uses with re-derivable numbers.

### `math-07-01` — Why measure theory?  · explain-only

**Connections (§1).**
> This opening lesson connects familiar ideas about length, area, probability, and averages to the common structure that supports them. Earlier mathematics already treats intervals as having length and events as having probability; measure theory explains what these assignments have in common. The lesson sets up the triple $(X,\mathcal F,\mu)$, which will appear throughout the section. It also prepares the probability interpretation used later for expected loss and random variables.

**Motivation & Intuition (§2).**
> Length and probability are often first learned through examples: intervals have lengths, finite outcomes have probabilities, and averages add weighted values. Those examples work well until limits, infinitely many events, continuous outcomes, or functions with complicated value sets enter the picture. A common language is needed so the same rules continue to apply without rebuilding the theory each time.
>
> Measure theory supplies that language. The set $X$ contains the points or outcomes, $\mathcal F$ says which subsets are measurable, and $\mu$ assigns size to those subsets. Probability is the special case where the total size is $1$, and expected loss is an integral with respect to that probability measure. This lesson is explain-only because its job is orientation: it names the structure that the rest of the section will make precise.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — this is an orientation lesson. There is no single theorem to prove;
explain the need for the triple $(X,\mathcal F,\mu)$ and preview how later lessons use it.

**Symbols.** $X$ is the underlying set of outcomes or points; $\mathcal F$ is the collection of measurable
subsets; $\mu$ assigns size; $P$ is the special case of a probability measure with total mass $1$.

**Real-World Applications (§5).**
1. **Expected loss language.** Loss $L\in\{1,4,10\}$ with probabilities $(0.2,0.5,0.3)$ gives $\int L\,dP=5.2$.
2. **Continuous probability.** A uniform point on $[0,2]$ has $P([0.5,1.5])=(1.5-0.5)/2=0.5$.
3. **Dataset slices.** An empirical measure on $1000$ rows gives a $73$-row event mass $0.073$.
4. **Null exceptions.** Changing a model on a probability-zero set changes expected loss by $0$.
5. **Risk constraints.** If bad outcomes have mass $0.04$, an indicator-risk integral is $0.04$.
6. **Limit arguments.** If event masses $0.3,0.03,0.003$ shrink geometrically, the tail total is $0.333\ldots$ by countable addition.

---

### `math-07-02` — σ-algebras  · deepen

**Connections (§1).**
> This lesson follows naturally from the need to say which sets are legitimate events. Once a set is observable, its complement should also be observable, and countable combinations of observable events should remain observable. Sigma-algebras give exactly that stable collection. This stability is what lets probability, integration, and limiting events use the same event language.

**Motivation & Intuition (§2).**
> Events are not useful if the collection of legal events falls apart under ordinary logical operations. If an event can be observed, then the event that it does not happen should also be observable. If events can be observed one after another, then the event that at least one of them happens should still be legal. Countable unions are included because many limiting events are built from infinitely many stages.
>
> The complement and countable-union axioms are enough to recover countable intersections through De Morgan's law. This matters because intersections express persistent conditions such as all checks failing or every constraint holding. A sigma-algebra is therefore not just a list of allowed sets; it is a stable event language for probability and integration.

**Definition & Assumptions (§3).**

**Derive (complete).** Closure under countable intersections from the axioms:
1. Start with events $A_1,A_2,\ldots\in\mathcal F$. These are the sets whose intersection we want to use.
2. Take complements $A_n^c\in\mathcal F$ for every $n$. This uses closure under complement.
3. Form the countable union $\bigcup_{n=1}^\infty A_n^c\in\mathcal F$. This uses closure under countable
   union.
4. Take its complement $\left(\bigcup_n A_n^c\right)^c\in\mathcal F$. This uses closure under complement
   again.
5. Apply De Morgan's law to get $\bigcap_n A_n$. This shows countable intersections are measurable too.

**Symbols.** $X$ is the whole space; $\mathcal F$ is the sigma-algebra; $A^c=X\setminus A$ is the complement;
$\bigcup$ combines events; $\bigcap$ keeps points common to all events.

**Real-World Applications (§5).**
1. **Coarse logging.** For $X=\{1,2,3,4\}$, $\{\varnothing,X,\{1,2\},\{3,4\}\}$ has $4$ legal events.
2. **Feature binning.** Bins $B_1,B_2,B_3$ generate at most $2^3=8$ unions of bins.
3. **Privacy views.** If only age groups are measurable, a single user's row has mass hidden inside its group.
4. **A/B tests.** If treatment event $T$ is measurable, control $T^c$ is automatically measurable.
5. **Monitoring.** Events $A_n=$ "latency exceeds threshold on day $n$" make $\bigcup_n A_n$ a measurable ever-exceeded event.
6. **Alert persistence.** $\bigcap_n A_n$ is measurable, so "all checks failed" is a legal event.

---

### `math-07-03` — Measurable spaces  · explain-only

**Connections (§1).**
> This lesson separates observability from size. A measurable space records the raw set and the collection of subsets that are allowed to be discussed as events, before any probability or length is assigned. That distinction is useful because the same underlying set can support different levels of information. Later lessons add measures and functions on top of this measurable structure.

**Motivation & Intuition (§2).**
> Before assigning probabilities or lengths, we must decide what can be observed. On a finite set, full observation may allow every subset; in a coarsened logging system, only groups of points may be visible. Both cases can have the same raw set $X$, but they support different measurable events.
>
> A measurable space records this decision as the pair $(X,\mathcal F)$. It has no numerical sizes yet, so there is no probability or integral at this stage. The point is to make the event structure explicit, because later a measure can only assign sizes to sets that are in $\mathcal F$.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — this is a definition lesson. Emphasize that $(X,\mathcal F)$ is a pair:
changing $\mathcal F$ changes what can be measured even when $X$ is the same.

**Symbols.** $(X,\mathcal F)$ is the measurable space; $X$ is the raw set; $\mathcal F$ is a sigma-algebra;
members of $\mathcal F$ are measurable sets; $\mathcal P(X)$ is the full power set.

**Real-World Applications (§5).**
1. **Full observation.** If $X=\{1,2,3\}$ and $\mathcal F=\mathcal P(X)$, all $2^3=8$ subsets are measurable.
2. **Coarsened telemetry.** If $\mathcal F=\{\varnothing,X,\{1,2\},\{3\}\}$, only $4$ subsets are measurable.
3. **Label spaces.** A three-class label with full sigma-algebra has $8$ possible label events.
4. **Borel data.** Real-valued scores use $(\mathbb R,\mathcal B(\mathbb R))$, so intervals like $(-\infty,0.7]$ are measurable.
5. **Product observations.** Two binary features with full observation have $2^4=16$ measurable subsets of four pairs.
6. **Random-variable target.** A score map is admissible only when preimages of Borel score sets are in $\mathcal F$.

---

### `math-07-04` — Measures  · deepen

**Connections (§1).**
> This lesson adds numerical size to the measurable sets from the previous lessons. A measure can be length, area, counting size, probability, or a weighted data mass, depending on the context. The important common rule is countable additivity on disjoint pieces. From that rule come the everyday facts that larger sets have at least as much size and that non-overlapping pieces add.

**Motivation & Intuition (§2).**
> Once legal sets have been chosen, the next step is to assign them sizes. Counting measure counts elements, Lebesgue measure gives length or area, and probability measures assign masses that sum to one. These examples are different in interpretation, but they share nonnegativity and additivity over disjoint measurable pieces.
>
> Countable additivity is the load-bearing rule. It says that if a set is assembled from non-overlapping measurable pieces, its size is the sum of their sizes. From that rule, monotonicity follows by splitting a larger set into a smaller set plus the leftover part. This is why measures behave consistently when sets are nested or decomposed.

**Definition & Assumptions (§3).**

**Derive (complete).** Consequences of countable additivity:
1. Let $A\subseteq B$ with both sets measurable. This sets up monotonicity.
2. Split $B$ as $A\cup(B\setminus A)$ disjointly. This separates the part already in $A$ from the rest.
3. Apply finite additivity from countable additivity: $\mu(B)=\mu(A)+\mu(B\setminus A)$. Disjoint pieces add.
4. Use nonnegativity $\mu(B\setminus A)\ge0$. Measures cannot subtract size.
5. Conclude $\mu(A)\le\mu(B)$. Larger measurable sets have at least as much measure.
6. If $\mu(A)<\infty$, rearrange to $\mu(B\setminus A)=\mu(B)-\mu(A)$. This is the subtraction rule when the
   smaller size is finite.

**Symbols.** $\mu$ is the measure; $\varnothing$ is the empty set; $A_n$ are disjoint measurable sets;
$[0,\infty]$ allows infinite size.

**Real-World Applications (§5).**
1. **Counting measure.** $\mu(\{a,b,c\})=3$.
2. **Empirical distribution.** $200$ selected rows out of $1000$ have empirical mass $0.2$.
3. **Probability model.** Disjoint events with masses $0.1,0.25,0.4$ have union mass $0.75$.
4. **Weighted sampling.** Weights $2,5,3$ on three rows give total measure $10$.
5. **Geometric area.** Two disjoint rectangles of areas $6$ and $4$ have union area $10$.
6. **Dirac measure.** $\delta_x(A)=1$ if $x\in A$ and $0$ otherwise, so a set containing $x$ has size $1$.

---

### `math-07-05` — Outer measure  · AUTHOR derivation

**Connections (§1).**
> This lesson explains how Lebesgue measure begins before measurability is imposed. Outer measure assigns a candidate size to every subset of the real line by covering it with intervals. This gives a universal upper estimate even for sets that may not behave well under cutting and recombining. The subadditivity derivation is the basic reason these outside estimates control unions.

**Motivation & Intuition (§2).**
> Some subsets of the real line are too irregular to handle by simply declaring their length directly. Outer measure starts from something concrete: cover the set by intervals and add the interval lengths. The best possible total cover length gives an outside estimate for the set's size.
>
> This construction does not yet say that every set is measurable. Instead, it gives a size-like upper bound for every set and then identifies which sets interact correctly with cutting and recombining. Countable subadditivity is the essential first property: a union can be covered by covering each part, so the outside size of the union cannot exceed the sum of the outside sizes.

**Definition & Assumptions (§3).**

**Derive (complete).** Countable subadditivity of Lebesgue outer measure:
1. For each set $E_j$ and each tolerance $\varepsilon 2^{-j}$, choose interval covers
   $E_j\subseteq\bigcup_k I_{jk}$ with $\sum_k |I_{jk}|\le m^*(E_j)+\varepsilon2^{-j}$. This uses the
   infimum definition with a small allowance.
2. Combine all chosen intervals. Their union covers $\bigcup_j E_j$ because each $E_j$ is covered.
3. The total length of the combined cover is $\sum_j\sum_k |I_{jk}|$. This is the cost of that particular
   countable cover.
4. Bound it by $\sum_j m^*(E_j)+\varepsilon\sum_j2^{-j}$. This substitutes the near-optimal bounds.
5. Use $\sum_j2^{-j}=1$ to get a cover cost at most $\sum_jm^*(E_j)+\varepsilon$.
6. Take the infimum over all covers and let $\varepsilon\downarrow0$. This gives
   $m^*(\bigcup_jE_j)\le\sum_jm^*(E_j)$.

**Symbols.** $m^*$ is outer measure; $E$ is any subset of $\mathbb R$; $I_n$ are open intervals; $|I_n|$ is
interval length; $\inf$ is the greatest lower bound over all covers.

**Real-World Applications (§5).**
1. **Union bounds.** Events with outer-size bounds $0.02,0.03,0.01$ have union size at most $0.06$.
2. **Anomaly windows.** Intervals of lengths $0.1,0.05,0.02$ cover a suspicious score set, so its outer measure is at most $0.17$.
3. **Sparse events.** Countably many points have outer measure $0$ because they can be covered with intervals totaling any $\varepsilon>0$.
4. **Confidence sets.** Two covered regions of lengths $1.2$ and $0.8$ give a combined outer bound $2.0$.
5. **Approximate geometry.** A fractal-like set covered by $4^n$ intervals of length $3^{-2n}$ has bound $(4/9)^n\to0$.
6. **Score thresholds.** If all bad scores lie in intervals totaling $0.04$, their Lebesgue outer measure is no more than $0.04$.

---

### `math-07-06` — Lebesgue measure  · deepen

**Connections (§1).**
> This lesson turns the outer-measure construction into the familiar length used on measurable subsets of the real line. Lebesgue measure agrees with interval length, treats endpoints as having no length, and supports countable additivity. It is the measure behind continuous probability densities and ordinary integration over real-valued data. The key point here is that changing finitely many points does not change length.

**Motivation & Intuition (§2).**
> Ordinary length should give $b-a$ for an interval from $a$ to $b$, and it should not care whether endpoints are included. Lebesgue measure preserves that intuition while extending length to a much richer collection of sets. This extension is what makes continuous probability and integration over real variables rigorous.
>
> The reason endpoints do not matter is that a single point can be covered by intervals with arbitrarily small total length. Its measure is therefore zero. Once singletons have measure zero, adding or removing finitely many endpoints changes no interval length. This same idea later supports almost-everywhere equality and null edits to functions.

**Definition & Assumptions (§3).**

**Derive (complete).** Singletons have measure zero, so endpoints do not change interval length:
1. Cover the singleton $\{a\}$ by the open interval $(a-\varepsilon/2,a+\varepsilon/2)$. This interval has
   length $\varepsilon$.
2. Since the cover cost can be made as small as any $\varepsilon>0$, $m^*(\{a\})=0$. Outer measure is
   nonnegative, so the only possible value is $0$.
3. Lebesgue measure agrees with outer measure on measurable singletons. Thus $m(\{a\})=0$.
4. Write $[a,b]=(a,b)\cup\{a\}\cup\{b\}$ disjointly. This separates the open interval from endpoints.
5. Add the measures: $m([a,b])=m((a,b))+0+0=b-a$. Endpoints add no length.

**Symbols.** $m$ is Lebesgue measure; $m^*$ is outer measure; $[a,b]$ and $(a,b)$ are intervals; $b-a$ is
their length; "almost everywhere" means except on a set of measure zero.

**Real-World Applications (§5).**
1. **Uniform probability.** On $[0,2]$, $P([0.5,1.5])=m([0.5,1.5])/2=0.5$.
2. **Continuous features.** $P(X=0.7)=0$ under any bounded density, because a singleton has Lebesgue measure $0$.
3. **Image masks.** A normalized rectangle $[0,0.2]\times[0,0.5]$ has area $0.1$.
4. **Histograms.** Five bins of width $0.2$ cover $[0,1]$ with total length $1$.
5. **Translation invariance.** Shifting $[1,4]$ to $[6,9]$ keeps length $3$.
6. **Null edits.** Changing a predictor at one real-valued score changes a Lebesgue integral by $0$.

---

### `math-07-07` — Measurable functions  · deepen

**Connections (§1).**
> This lesson connects measurable sets with functions. In probability, a random variable is useful only when statements about its values correspond to events whose probabilities can be assigned. Measurable functions guarantee this by requiring preimages of observable value-sets to be measurable. That condition is also what makes losses, indicators, and model scores compatible with integration.

**Motivation & Intuition (§2).**
> A function on a measure space becomes useful for probability or integration only when value-based statements are measurable. For a score $s$, the statement $s\le0.7$ must correspond to an event in the original space. For a loss $L$, the regions where the loss falls in a given range must be measurable before an expected loss can be defined.
>
> Measurability is exactly this preimage condition. It looks backward from value sets to the original space and requires those preimages to be legal events. Indicators show the simplest case: the indicator of a set is measurable precisely when the set itself is measurable. Composition then shows that measurable pipelines remain measurable.

**Definition & Assumptions (§3).**

**Derive (complete).** Indicator and composition rules:
1. Let $1_A:X\to\{0,1\}$ be the indicator of $A$. This function records whether $x$ is in $A$.
2. The preimage of $\{1\}$ is $A$. A value-set is measurable precisely when the event is measurable.
3. The preimage of $\{0\}$ is $A^c$. Sigma-algebras include complements.
4. Therefore $1_A$ is measurable exactly when $A\in\mathcal F$. Indicator measurability matches event
   measurability.
5. If $f:X\to Y$ and $g:Y\to Z$ are measurable, then $(g\circ f)^{-1}(C)=f^{-1}(g^{-1}(C))$. This is the
   preimage rule for composition.
6. Since $g^{-1}(C)$ is measurable in $Y$ and $f$ pulls measurable sets back to $X$, $g\circ f$ is measurable.

**Symbols.** $f:(X,\mathcal F)\to(Y,\mathcal G)$ is a function between measurable spaces; $f^{-1}(B)$ is the
preimage of $B$; $\mathcal B(\mathbb R)$ is the Borel sigma-algebra; $1_A$ is an indicator.

**Real-World Applications (§5).**
1. **Random variables.** If $X$ is measurable, $\{X\le0.7\}$ is an event whose probability can be computed.
2. **Loss functions.** If $L$ is measurable, expected loss $\int L\,dP$ is defined.
3. **Classifiers.** A threshold classifier $1_{\{s\ge0.8\}}$ is measurable when the score $s$ is measurable.
4. **Feature thresholds.** If $P(s\le0.3)=0.18$, the preimage event has probability $0.18$.
5. **Calibration curves.** Bins like $s^{-1}([0.6,0.7])$ are measurable score events.
6. **Pipelines.** If a feature map and a model score are measurable, their composition is measurable.

---

### `math-07-08` — The Lebesgue integral  · AUTHOR derivation

**Connections (§1).**
> This lesson builds the integral that the rest of the probability track uses. The previous lessons supplied measurable sets, measures, and measurable functions; the Lebesgue integral combines them by adding function values over measured regions. It starts from simple functions because their value regions are clear and disjoint. From there, nonnegative and signed functions are handled by approximation and decomposition.

**Motivation & Intuition (§2).**
> The Riemann integral often imagines slicing the input axis into intervals. The Lebesgue integral instead begins with the values a function takes and the measurable regions where it takes them. For a simple function, each value-region contributes height times measure, exactly like a rectangle but with measurable sets in place of ordinary intervals.
>
> General nonnegative functions are handled by approximating from below with simple functions. Taking the supremum over all such lower approximations captures the full area without depending on a particular partition. Signed functions are then split into positive and negative parts, with the usual warning that $\infty-\infty$ is not defined. This construction is why expectations, densities, indicators, and limits share one integral.

**Definition & Assumptions (§3).**

**Derive (complete).** Simple functions first, then nonnegative functions:
1. Start with a nonnegative simple function $s=\sum_{k=1}^n a_k1_{A_k}$ on disjoint measurable sets $A_k$.
   This means $s$ has value $a_k$ on $A_k$.
2. The contribution from $A_k$ is height times size: $a_k\mu(A_k)$. This is the rectangle rule generalized
   to measurable sets.
3. Add the disjoint contributions to define $\int s\,d\mu=\sum_{k=1}^n a_k\mu(A_k)$. Disjoint value-regions
   do not overlap.
4. For a nonnegative measurable $f$, choose simple functions $0\le s\le f$. They approximate $f$ from below.
5. Take the supremum of their integrals: $\int f\,d\mu=\sup_{0\le s\le f}\int s\,d\mu$. This captures all
   lower approximations.
6. For signed $f$, write $f=f^+-f^-$. Define $\int f\,d\mu=\int f^+\,d\mu-\int f^-\,d\mu$ when this is not
   the undefined form $\infty-\infty$.

**Symbols.** $s$ is a simple function; $a_k$ are its values; $A_k$ are measurable value-regions; $1_{A_k}$
is an indicator; $\mu(A_k)$ is the size of a value-region; $f^+$ and $f^-$ are positive and negative parts.

**Real-World Applications (§5).**
1. **Expected loss.** $L\in\{1,4,10\}$ with probabilities $(0.2,0.5,0.3)$ gives $\int L\,dP=5.2$.
2. **Empirical risk.** Four losses $(1,0.5,2,1.5)$ under equal mass give $1.25$.
3. **Density integration.** $f(x)=3x^2$ on $[0,1]$ integrates to $1$.
4. **Weighted metric.** A score equal to $2$ on mass $0.3$ and $5$ on mass $0.7$ has integral $4.1$.
5. **Image intensity.** Intensity $0.2$ on area $0.25$ and $0.8$ on area $0.75$ has total $0.65$.
6. **Regularization moment.** Under probabilities $(0.2,0.5,0.3)$, $\int |X|\,dP$ for values $(1,-2,3)$ is $2.1$.

---

### `math-07-09` — The monotone convergence theorem  · deepen

**Connections (§1).**
> This lesson gives the first major rule for passing from approximations to a limiting integral. Many useful functions are built as increasing limits of simpler ones, such as growing truncations, expanding events, or refined lower approximations. Monotone convergence says that when the approximations only increase, the integrals increase to the integral of the limit. That makes approximation a reliable way to define and compute integrals.

**Motivation & Intuition (§2).**
> Many measurable functions are reached through increasing approximations. A truncated loss grows as the truncation level rises, an expanding union of events grows as more events are included, and lower step functions improve as a partition is refined. In each case, previously counted mass is never removed.
>
> Monotone convergence says that this one-sided growth is enough to make integrals converge to the integral of the pointwise limit. The proof idea is that every simple block lying below the limit is eventually almost captured by the increasing sequence. Because the integral of the limit is defined through simple lower approximations, capturing all such blocks forces equality.

**Definition & Assumptions (§3).**

**Derive (complete).** Statement and proof idea from simple lower bounds:
1. Assume $0\le f_1\le f_2\le\cdots$ and $f_n\uparrow f$ pointwise. This means every point's value climbs to
   its limit.
2. Since $f_n\le f$, monotonicity of the integral gives $\int f_n\,d\mu\le\int f\,d\mu$. The limit of the
   integrals cannot exceed the target integral.
3. Let $s$ be any simple function with $0\le s\le f$. This tests whether the increasing approximations reach
   every lower simple block.
4. For $0<c<1$, the sets where $f_n\ge cs$ increase to the support of $s$. Pointwise convergence makes each
   positive block eventually covered.
5. Countable additivity gives $\int f_n\,d\mu$ eventually at least nearly $c\int s\,d\mu$. The increasing
   functions capture nearly all of the simple lower area.
6. Let $c\uparrow1$ and take the supremum over simple $s\le f$. This gives
   $\lim_n\int f_n\,d\mu\ge\int f\,d\mu$, completing equality.

**Symbols.** $f_n\uparrow f$ means increasing pointwise convergence; $\lim_n\int f_n$ may be infinite;
$s$ is a simple lower approximation; $c$ is a scaling factor below $1$.

**Real-World Applications (§5).**
1. **Truncated expected loss.** $L_n=\min(L,n)$ increases to $L$, so if integrals are $1.8,2.4,2.7$, the expected loss limit is $2.7$ when the sequence stabilizes.
2. **Histogram refinement.** Lower step approximations $0.5,0.75,0.875$ climb toward area $1$.
3. **Counting infinite events.** $1_{\cup_{i=1}^nA_i}\uparrow1_{\cup_iA_i}$, so probabilities converge upward.
4. **Series as integrals.** Partial sums of nonnegative terms $0.5+0.25+0.125$ increase to $1$.
5. **Reliability over time.** Events "failure by day $n$" with masses $0.1,0.18,0.25$ increase toward eventual failure probability.
6. **Data filters.** Expanding eligible sets of masses $0.4,0.6,0.7$ gives integrals that increase with the set.

---

### `math-07-10` — Fatou's lemma  · deepen

**Connections (§1).**
> This lesson introduces a limit theorem that works even when a sequence is not monotone. Fatou's lemma looks at the eventual lower value of a nonnegative sequence and compares its integral with the eventual lower behavior of the integrals. It is weaker than equality, but it is very robust. This makes it a basic tool for proving convergence results and protecting lower bounds.

**Motivation & Intuition (§2).**
> Sequences of functions often do not increase neatly. They may oscillate, have moving spikes, or settle only in an eventual lower sense. Fatou's lemma handles this rougher situation by focusing on the liminf, the value that remains after ignoring early behavior and looking at the lower envelope of the tails.
>
> The lemma does not promise equality. It gives a safe inequality for nonnegative functions: the integral of the eventual lower pointwise value is no larger than the eventual lower integral. The proof turns the tail infima into an increasing sequence and then applies monotone convergence. This is why Fatou's lemma is a bridge from MCT to more flexible convergence theorems.

**Definition & Assumptions (§3).**

**Derive (complete).** From monotone convergence:
1. Define $g_k(x)=\inf_{n\ge k} f_n(x)$. This is the lower envelope of the tail starting at $k$.
2. Observe $g_k\le g_{k+1}$. Dropping the first term from a tail can only raise its infimum.
3. The increasing limit of $g_k$ is $\liminf_{n\to\infty}f_n$. This is the definition of pointwise liminf.
4. Apply MCT: $\int\liminf f_n\,d\mu=\lim_k\int g_k\,d\mu$. The lower envelopes increase.
5. Since $g_k\le f_n$ for every $n\ge k$, $\int g_k\,d\mu\le\inf_{n\ge k}\int f_n\,d\mu$. Integrals preserve
   order.
6. Let $k\to\infty$ to get
   $\int\liminf f_n\,d\mu\le\liminf_n\int f_n\,d\mu$.

**Symbols.** $\liminf f_n$ is the eventual lower pointwise value; $g_k$ is the tail infimum; all functions
are nonnegative measurable; $\le$ is the inequality direction that makes Fatou a lower-bound theorem.

**Real-World Applications (§5).**
1. **Lower-bound risk.** If eventual pointwise losses have integral $1.7$, then liminf training risks cannot be below $1.7$.
2. **Escaping spikes.** Functions $f_n=n1_{[0,1/n]}$ have integrals $1$ but pointwise liminf $0$, so Fatou gives $0\le1$.
3. **Eventual events.** Indicators give $P(\liminf A_n)\le\liminf P(A_n)$.
4. **Optimization limits.** If validation losses have liminf integrals $0.42$, a candidate limit cannot certify risk above that direction.
5. **Risk certificates.** Lower envelopes with areas $0.3,0.35,0.37$ yield at least $0.37$ in the limit.
6. **Series envelopes.** Tail infimum functions protect against undercounting nonnegative mass.

---

### `math-07-11` — The dominated convergence theorem  · AUTHOR derivation

**Connections (§1).**
> This lesson gives one of the most useful conditions for exchanging limits and integrals. Pointwise convergence alone can miss moving spikes of mass, so a shared integrable bound is needed. Dominated convergence supplies that bound and turns pointwise convergence into convergence of integrals. It is the formal justification behind many limits of expected losses, gradients, and numerical approximations.

**Motivation & Intuition (§2).**
> A pointwise limit can be misleading for integrals if mass escapes into thinner and taller spikes. The functions may converge to zero at every fixed point while their integrals stay away from zero. To rule out this behavior, all functions in the sequence need to be controlled by one integrable envelope.
>
> Dominated convergence uses that envelope to make limits and integrals commute. The dominating function keeps positive and negative parts uniformly integrable, while Fatou's lemma supplies the two inequalities that trap the limiting integral. In applications, the domination condition often appears as bounded losses, bounded gradients, or an integrable tail bound.

**Definition & Assumptions (§3).**

**Derive (complete).** Statement and standard Fatou proof:
1. Assume $f_n\to f$ almost everywhere and $|f_n|\le g$ with $g$ integrable. This gives pointwise convergence
   plus a shared integrable ceiling.
2. Since $|f_n|\le g$, the limit also satisfies $|f|\le g$ almost everywhere. Pointwise limits preserve the
   bound outside a null set.
3. The nonnegative functions $g+f_n$ satisfy Fatou's lemma. They are nonnegative because $f_n\ge-g$.
4. Fatou gives $\int(g+f)\,d\mu\le\liminf_n\int(g+f_n)\,d\mu$. This is the lower inequality.
5. Cancel $\int g\,d\mu<\infty$ to get $\int f\,d\mu\le\liminf_n\int f_n\,d\mu$.
6. Apply the same argument to $g-f_n$. This gives $-\int f\,d\mu\le\liminf_n(-\int f_n\,d\mu)$, equivalent to
   $\limsup_n\int f_n\,d\mu\le\int f\,d\mu$.
7. Combine liminf and limsup inequalities. The integrals converge to $\int f\,d\mu$.

**Symbols.** $g$ is the dominating integrable function; almost everywhere means outside a measure-zero set;
$\liminf$ and $\limsup$ bracket possible integral limits; integrable means $\int |g|\,d\mu<\infty$.

**Real-World Applications (§5).**
1. **Model limits.** If losses $f_n\to f$ and all are bounded by $10$, then validation risk limits pass through expectation on a probability space.
2. **Bounded payoffs.** Monte Carlo payoffs in $[-2,2]$ have dominating function $g=2$ with integral $2$.
3. **Truncated tails.** $f_n=x1_{x\le n}$ under density $e^{-x}$ is dominated by $x$, whose integral is $1$.
4. **Quadrature refinement.** Bounded integrands under $g=1$ allow grid limits to match the integral.
5. **Expected gradients.** If coordinate gradients satisfy $|G_n|\le5$ and converge, expected gradients converge too.
6. **Spike warning.** $f_n=n1_{[0,1/n]}$ has integral $1$ and pointwise limit $0$, but no integrable shared bound, so DCT does not apply.

---

### `math-07-12` — Lᵖ spaces  · deepen

**Connections (§1).**
> This lesson organizes measurable functions by average size. The $L^p$ norm uses the Lebesgue integral to measure magnitude after taking powers, which makes it suitable for errors, signals, moments, and energies. The earlier integral machinery ensures these quantities are defined on general measure spaces, not only finite vectors. The scaling derivation shows why the formula behaves like a norm.

**Motivation & Intuition (§2).**
> After defining integration, it becomes possible to measure the size of functions themselves. The $L^1$ norm measures average absolute magnitude, $L^2$ measures energy or root-mean-square size on a probability space, and higher $p$ values penalize large deviations more strongly. These are function-space versions of familiar vector norms.
>
> The formula first removes signs, raises magnitudes to the $p$th power, integrates, and then takes the $p$th root. The root restores the original units of the function. Scaling behaves as expected because constants factor out of the integral as $|c|^p$ before the root is taken. The triangle inequality is deeper, but the derivation here shows why the expression has the right homogeneity.

**Definition & Assumptions (§3).**

**Derive (complete).** The $L^p$ norm formula and scaling:
1. Start with a measurable function $f$. To measure its magnitude, remove signs with $|f|$.
2. Raise to the $p$th power: $|f|^p$. This emphasizes large values according to $p$.
3. Integrate $\int |f|^p\,d\mu$. This averages the powered magnitude over the measure space.
4. Take the $p$th root: $\lVert f\rVert_p=(\int|f|^p\,d\mu)^{1/p}$. This returns the units to those of $f$.
5. For scaling, compute $\lVert cf\rVert_p=(\int |c|^p|f|^p\,d\mu)^{1/p}$. Constants factor out of the
   integral.
6. Take the root to get $\lVert cf\rVert_p=|c|\lVert f\rVert_p$. This is one norm axiom; Minkowski supplies
   the triangle inequality for $p\ge1$.

**Symbols.** $L^p(X,\mu)$ is the space of measurable functions with finite $p$-norm; $p\ge1$; equality is
almost-everywhere equality; $\lVert f\rVert_p$ is the norm; $L^2$ has inner product $\int fh\,d\mu$.

**Real-World Applications (§5).**
1. **Mean absolute error.** Values $(1,2,3)$ with probabilities $(0.2,0.5,0.3)$ give $\lVert X\rVert_1=2.1$.
2. **RMS error.** The same values give $\lVert X\rVert_2=\sqrt{4.9}=2.214$.
3. **Fourth-moment penalty.** $\lVert X\rVert_4=(0.2+8+24.3)^{1/4}=2.388$.
4. **Signal energy.** Values $1,-1$ on equal halves have $L^2$ norm $1$.
5. **Image difference.** Error $0.2$ on area $0.25$ and $0.8$ on area $0.75$ has $L^2$ norm $\sqrt{0.49}=0.7$.
6. **Moment control.** If $\lVert X\rVert_2=3$, then $\mathbb E[X^2]=9$ on a probability space.

---

### `math-07-13` — Product measures  · AUTHOR derivation

**Connections (§1).**
> This lesson extends measure from one space to pairs of spaces. Product measure is the measure-theoretic version of rectangle area and independent joint probability. It lets a size on $X$ and a size on $Y$ combine into a size on pairs $(x,y)$. This construction is the foundation for joint distributions, grids, images, and data-by-time spaces.

**Motivation & Intuition (§2).**
> Many problems involve pairs: two random variables, an image coordinate, a data point and a time step, or a parameter and a simulation seed. If each coordinate has its own measure, the product space needs a measure on pairs. Rectangles are the basic sets where the answer is forced: size should be the product of the coordinate sizes.
>
> Product measure extends this rectangle rule to the sigma-algebra generated by measurable rectangles. For probability spaces, the same construction expresses independence when rectangle probabilities multiply. Sigma-finiteness is the regularity condition that makes this extension unique and well behaved. Once product measure exists, joint distributions and iterated integrals have a rigorous base.

**Definition & Assumptions (§3).**

**Derive (complete).** From rectangles to simple product integrals:
1. Start with measurable rectangles $A\times B$. These are the basic observable sets in a product space.
2. Define $(\mu\times\nu)(A\times B)=\mu(A)\nu(B)$. This matches ordinary rectangle area.
3. Generate $\mathcal A\otimes\mathcal B$ from countable operations on rectangles. This creates all product
   measurable sets.
4. For disjoint finite rectangles $R_i=A_i\times B_i$, add their product measures. Countable additivity
   extends the rectangle rule.
5. For independent probability spaces, $P_{X,Y}(A\times B)=P_X(A)P_Y(B)$. This is independence expressed as
   product measure.
6. Sigma-finiteness ensures this rectangle rule determines a unique product measure. It prevents ambiguous
   extensions.

**Symbols.** $(X,\mathcal A,\mu)$ and $(Y,\mathcal B,\nu)$ are measure spaces; $\mathcal A\otimes\mathcal B$
is the product sigma-algebra; $\mu\times\nu$ is the product measure; $A\times B$ is a rectangle of pairs.

**Real-World Applications (§5).**
1. **Joint feature grids.** $P(X\in A)=0.4$ and $P(Y\in B)=0.25$ under independence give $P(A\times B)=0.1$.
2. **Image area.** Rectangle width $0.2$ and height $0.5$ has product measure $0.1$.
3. **Independent choices.** Two fair coins give product mass $0.5\cdot0.5=0.25$ for HH.
4. **Batch-time axes.** $100$ examples and $20$ time steps give counting product size $2000$.
5. **Simulation design.** A $5\times4$ parameter grid has $20$ product cells.
6. **Continuous-discrete mixture.** Interval length $0.3$ and class probability $0.2$ give joint mass $0.06$.

---

### `math-07-14` — Fubini's theorem  · AUTHOR derivation

**Connections (§1).**
> This lesson explains when an integral over pairs can be computed one coordinate at a time. Product measures make the joint space precise, and Fubini's theorem gives the rule for iterated integration when the hypotheses are met. The theorem supports the everyday practice of summing by rows then columns, averaging over data then randomness, or reversing those orders. Its proof begins with rectangle indicators because their product structure is transparent.

**Motivation & Intuition (§2).**
> Computing a joint integral directly can be difficult, but many joint spaces have a coordinate structure. For rectangles, integrating first in $y$ and then in $x$ clearly gives the same value as multiplying the two coordinate measures. Fubini's theorem says this agreement extends far beyond rectangle indicators when the right integrability conditions hold.
>
> The theorem has two closely related forms. Tonelli's theorem handles nonnegative functions and allows the value $\infty$; Fubini's theorem handles signed functions when the absolute integral is finite. Together they justify changing the order of summation or integration in product spaces. This is why row-first and column-first computations agree when the hypotheses are satisfied.

**Definition & Assumptions (§3).**

**Derive (complete).** First for simple rectangles, then extend:
1. Let $f=c\,1_{A\times B}$. This is the simplest function on a product space.
2. The product integral is $\int f\,d(\mu\times\nu)=c\mu(A)\nu(B)$. This uses the product rectangle rule.
3. Integrate in $y$ first: $\int_Y c1_A(x)1_B(y)\,d\nu(y)=c1_A(x)\nu(B)$. For fixed $x$, only the $B$ part
   is averaged over $Y$.
4. Integrate the result over $x$: $\int_X c1_A(x)\nu(B)\,d\mu(x)=c\mu(A)\nu(B)$. This matches the product
   integral.
5. Add finitely many such rectangle indicators by linearity. Simple functions follow.
6. Use monotone convergence for nonnegative functions and absolute integrability for signed functions.
   This gives Tonelli and Fubini in their full forms.

**Symbols.** $\int_X\int_Y f(x,y)\,d\nu(y)\,d\mu(x)$ is an iterated integral; $\mu\times\nu$ is the product
measure; sigma-finite spaces avoid pathologies; absolute integrability means $\int |f|<\infty$.

**Real-World Applications (§5).**
1. **Marginalizing joint densities.** $\int_0^1\int_0^1 xy\,dy\,dx=1/4$.
2. **Expected loss over data and dropout.** Average losses $1,3$ over two data points and $0.5,1.5$ over two masks total mean $1.5$.
3. **Image brightness.** Summing rows then columns of a $2\times2$ image $\begin{bmatrix}1&2\\3&4\end{bmatrix}$ gives total $10$ either way.
4. **Database aggregation.** Group sums $7$ and $5$ total $12$ independent of grouping order.
5. **Attention summaries.** A $3\times4$ attention table has $12$ weights whose total is unchanged by row-first or column-first summation.
6. **Simulation averages.** $5$ seeds and $10$ examples give $50$ losses averaged in either order.

---

### `math-07-15` — Probability spaces as measure spaces  · deepen

**Connections (§1).**
> This lesson identifies probability as a special case of measure theory. The sample space is the whole measurable space, events are measurable sets, and probability is a measure whose total mass is one. Familiar probability rules are therefore not separate assumptions; they follow from additivity. This viewpoint prepares the later lessons on random variables, distributions, and expectations.

**Motivation & Intuition (§2).**
> Probability rules become simpler when probability is viewed as measure with total mass one. The whole sample space has measure $1$, an event is a measurable set, and a probability is the measure of that set. Complement and union formulas are then consequences of splitting sets into disjoint pieces.
>
> This perspective explains why the same additivity rules apply to finite experiments, continuous distributions, and empirical datasets. It also prepares the integral view of expectation: once probability is a measure, averaging a random variable is integration with respect to that measure. The derivation here recovers familiar probability identities from the measure axioms.

**Definition & Assumptions (§3).**

**Derive (complete).** Complement and union rules from additivity:
1. Start with a probability space $(\Omega,\mathcal F,P)$ and event $A$. This means $P(\Omega)=1$.
2. Split $\Omega=A\cup A^c$ disjointly. Every outcome is either in $A$ or not.
3. Apply additivity: $1=P(\Omega)=P(A)+P(A^c)$. Disjoint event probabilities add.
4. Rearrange to $P(A^c)=1-P(A)$. This is the complement rule.
5. For two events, split $A\cup B$ into disjoint pieces $A$, $B\setminus A$. This avoids double-counting the
   overlap.
6. Add and rewrite $P(B\setminus A)=P(B)-P(A\cap B)$ to get
   $P(A\cup B)=P(A)+P(B)-P(A\cap B)$.

**Symbols.** $\Omega$ is the sample space; $\mathcal F$ is the event sigma-algebra; $P$ is a measure with
$P(\Omega)=1$; $A^c$ is the complement; $A\cap B$ is the overlap.

**Real-World Applications (§5).**
1. **Dataset proportions.** $73$ positives in $1000$ examples have empirical probability $0.073$.
2. **A/B tests.** If $P(T)=0.5$, then $P(T^c)=0.5$.
3. **Union events.** If $P(A)=0.3$, $P(B)=0.4$, and $P(A\cap B)=0.12$, then $P(A\cup B)=0.58$.
4. **Confusion matrices.** A false-positive event with $40$ of $1000$ rows has probability $0.04$.
5. **Independent services.** Failures with probabilities $0.01$ and $0.02$ have joint probability $0.0002$ under independence.
6. **Rare continuous events.** A point event can have probability $0$ while an interval event has positive probability.

---

### `math-07-16` — Random variables, measure-theoretically  · AUTHOR derivation

**Connections (§1).**
> This lesson gives the measure-theoretic definition of a random variable. A random variable is a measurable map from outcomes to a value space, so value conditions pull back to events. Its distribution is the measure created by pushing the original probability measure through that map. This is how a model score, label, feature transform, or loss obtains its own probability law.

**Motivation & Intuition (§2).**
> In elementary probability, a random variable is often described as a numerical outcome of an experiment. Measure theory makes that precise by treating it as a measurable function from the outcome space to the value space. The measurability condition ensures that value questions such as $X\le t$ are genuine events.
>
> The distribution of $X$ is obtained by pushing the original probability measure forward through $X$. Instead of measuring values directly, we measure the outcomes that map into a value set. This definition works for discrete, continuous, and mixed random variables in the same way. It also explains why transformations of random variables create new distributions.

**Definition & Assumptions (§3).**

**Derive (complete).** Pushforward distribution:
1. Let $X:\Omega\to\mathbb R$ be measurable. This ensures value conditions pull back to events.
2. For a Borel set $B\subseteq\mathbb R$, define $P_X(B)=P(X^{-1}(B))$. This measures the outcomes whose
   values land in $B$.
3. Check the empty set: $P_X(\varnothing)=P(X^{-1}(\varnothing))=P(\varnothing)=0$. The distribution has zero
   empty mass.
4. For disjoint Borel sets $B_i$, preimages $X^{-1}(B_i)$ are disjoint. A single outcome cannot land in two
   disjoint value sets.
5. Use preimage union preservation:
   $X^{-1}(\bigcup_iB_i)=\bigcup_iX^{-1}(B_i)$. This transfers countable unions back to outcomes.
6. Apply countable additivity of $P$ to get
   $P_X(\bigcup_iB_i)=\sum_iP_X(B_i)$. Thus $P_X$ is a probability measure.

**Symbols.** $X$ is a random variable; $P_X$ is its distribution or law; $B$ is a Borel set of values;
$X^{-1}(B)=\{\omega:X(\omega)\in B\}$ is a preimage event; pushforward means moving the measure through $X$.

**Real-World Applications (§5).**
1. **Model scores.** If $P(\omega:s(\omega)>0.8)=0.12$, then $P_s((0.8,1])=0.12$.
2. **Label indicators.** $Y=1_A$ has distribution $P_Y(\{1\})=P(A)$.
3. **Feature transforms.** If $Z=2X+1$ and $P(X\le3)=0.7$, then $P(Z\le7)=0.7$.
4. **Simulation.** Mapping random seeds to outputs turns seed measure into output distribution.
5. **Ranking buckets.** A bucket map with bucket masses $0.2,0.5,0.3$ defines a discrete pushforward law.
6. **Loss as random variable.** $L(h(X),Y)$ has a distribution whose mean is risk.

---

### `math-07-18` — The Radon–Nikodym theorem  · AUTHOR derivation

**Connections (§1).**
> This lesson connects measures through densities. When one measure gives zero mass to every set that a reference measure considers null, the Radon--Nikodym theorem represents the target measure by integrating a derivative against the reference measure. This is the rigorous form of a density ratio. It is central in likelihood ratios, importance sampling, and distribution-shift reweighting.

**Motivation & Intuition (§2).**
> Sometimes two measures live on the same measurable space and one is used as a reference for the other. If the target measure never assigns positive mass to a reference-null set, then the target can be described by a density relative to the reference. This condition is called absolute continuity.
>
> The Radon--Nikodym derivative is that relative density. On a finite space it is simply the ratio of masses on each atom, and integrating the ratio against the reference measure reconstructs the target measure. The theorem says that the same representation holds in much broader sigma-finite settings. This is the measure-theoretic basis for likelihood ratios and change of measure.

**Definition & Assumptions (§3).**

**Derive (complete).** Necessity and finite example:
1. Assume $\nu(A)=\int_A h\,d\mu$ for a nonnegative measurable $h$. This is the density representation.
2. If $\mu(A)=0$, then $\int_A h\,d\mu=0$. Integrating over a null set gives zero.
3. Therefore $\nu(A)=0$. This proves absolute continuity $\nu\ll\mu$ is necessary.
4. On a finite space with $\mu_i>0$, define $h_i=\nu_i/\mu_i$. This is the only possible density value on
   atom $i$.
5. For any set $A$, compute $\int_A h\,d\mu=\sum_{i\in A}h_i\mu_i=\sum_{i\in A}\nu_i=\nu(A)$. The density
   reconstructs the measure.
6. The theorem says the same reconstruction holds on sigma-finite measure spaces, with $h=d\nu/d\mu$
   unique up to $\mu$-almost everywhere equality.

**Symbols.** $\nu\ll\mu$ means absolute continuity; $h=d\nu/d\mu$ is the Radon--Nikodym derivative; $\mu$ is
the reference measure; $\nu$ is the target measure; sigma-finite means the space is a countable union of
finite-measure pieces.

**Real-World Applications (§5).**
1. **Likelihood ratios.** If $P=(0.2,0.5,0.3)$ and $Q=(0.1,0.6,0.3)$, then $dP/dQ=(2,0.833,1)$.
2. **Importance sampling.** Under $Q=(0.5,0.5)$ and $P=(0.2,0.8)$, weights are $(0.4,1.6)$.
3. **Dataset reweighting.** Source mass $0.4$ and target mass $0.6$ in a bin give ratio $1.5$.
4. **Continuous density.** If $dP/dm=2$ on $[0,0.5]$ and $0$ elsewhere, $P([0,0.25])=0.5$.
5. **Change of measure.** For $h=2$ on mass $0.25$ and $0.5$ on mass $0.5$, $\nu(A)=0.75$.
6. **Singular warning.** If $Q(A)=0$ but $P(A)=0.1$, then $dP/dQ$ does not exist as an ordinary finite density on that event.

---

### `math-07-19` — Densities  · AUTHOR derivation

**Connections (§1).**
> This lesson specializes the Radon--Nikodym idea to ordinary continuous distributions. A density with respect to Lebesgue measure tells how probability accumulates over intervals. The density is not the probability of a single point; points have zero Lebesgue length under ordinary densities. Interval probabilities, cumulative distribution functions, and likelihood calculations all come from integrating the density.

**Motivation & Intuition (§2).**
> A continuous density is best understood as a rate of probability accumulation, not as point probability. To find the probability of an interval, integrate the density over that interval. To find the cumulative distribution function, integrate the density from the left up to the threshold.
>
> This view matches the Radon--Nikodym theorem with Lebesgue measure as the reference measure. If $f=dP/dm$, then $P(A)=\int_A f(x)\,dx$ for Borel sets $A$. When the CDF is differentiable, the density is its derivative. Single points have zero probability under ordinary densities because they have zero Lebesgue measure.

**Definition & Assumptions (§3).**

**Derive (complete).** From density to CDF and back:
1. Suppose $P(A)=\int_A f(x)\,dx$ for every Borel set $A$. This defines a probability measure by a density.
2. Set $A=(-\infty,t]$ to get $F(t)=P(X\le t)=\int_{-\infty}^t f(x)\,dx$. The CDF is accumulated density.
3. If $f\ge0$ and $\int_\mathbb R f(x)\,dx=1$, then $P(\mathbb R)=1$. This is total probability.
4. For an interval $(a,b]$, subtract CDF values:
   $P(a<X\le b)=F(b)-F(a)=\int_a^b f(x)\,dx$. This gives interval probabilities.
5. When $F$ is differentiable at $t$, the fundamental theorem of calculus gives $F'(t)=f(t)$. Density is the
   derivative of accumulated probability.
6. A point has probability $\int_{\{t\}}f(x)\,dx=0$ for ordinary densities. Probability comes from intervals,
   not single points.

**Symbols.** $f=dP/dm$ is the density; $m$ is Lebesgue measure; $F$ is the cumulative distribution function;
$dx$ denotes integration with respect to Lebesgue measure; $A$ is a Borel set.

**Real-World Applications (§5).**
1. **Uniform score.** Density $1/2$ on $[0,2]$ gives $P(0.5\le X\le1.5)=0.5$.
2. **Triangular density.** $f(x)=2x$ on $[0,1]$ gives $F(0.5)=0.25$.
3. **Likelihood.** Observations $0.2,0.4$ under $f(x)=2x$ have likelihood $0.4\cdot0.8=0.32$.
4. **Histogram normalization.** Bin count $30$ out of $100$ in width $0.2$ estimates density $0.30/0.2=1.5$.
5. **Generative models.** A normalizing flow with base density $0.2$ and Jacobian factor $3$ gives density $0.6$.
6. **Anomaly thresholds.** If $P(X>t)=0.01$, then the upper tail interval has density integral $0.01$.

---

### `math-07-20` — Measure-theoretic foundations of probability  · explain-only capstone

**Connections (§1).**
> This capstone lesson gathers the section into the probability language used later in the track. The earlier lessons introduced measurable spaces, measures, measurable maps, integrals, product measures, and Radon--Nikodym derivatives. Together they explain probability spaces, random variables, distributions, expectations, densities, and joint laws. The same chain also supports expected loss and risk in machine learning.

**Motivation & Intuition (§2).**
> The section's separate constructions now fit into one probability framework. A probability model begins with $(\Omega,\mathcal F,P)$, where $P$ is a measure on events. Random variables are measurable maps out of that space, and their distributions are pushforward measures. Expectations are Lebesgue integrals of measurable functions.
>
> Densities and likelihood ratios are Radon--Nikodym derivatives, while product measures describe joint spaces and support iterated averaging. This synthesis matters because later probability and machine-learning arguments often move among these forms without changing the underlying object. Expected loss, empirical risk, distribution shift, and moment control all use this same measure-theoretic chain.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — this is a synthesis lesson. Do not add a new theorem; present the
dependency chain clearly and connect it to probability and expected loss.

**Symbols.** $(\Omega,\mathcal F,P)$ is the probability space; $X:\Omega\to S$ is a random variable;
$P_X$ is the pushforward distribution; $\mathbb E[g(X)]$ is an integral; $dP/dQ$ is a density ratio;
$P\times Q$ is a product measure.

**Real-World Applications (§5).**
1. **Empirical risk.** $R_n(h)=\int L(h(x),y)\,dP_n$ equals the average loss, such as $1.25$ for four losses $(1,0.5,2,1.5)$.
2. **Expected population risk.** Replacing $P_n$ by $P$ gives the target quantity optimized in learning theory.
3. **Distribution shift.** If $dP_{target}/dP_{train}=1.5$ in a bin, losses in that bin receive $1.5\times$ weight.
4. **Joint modeling.** Product measures give $P(X\in A,Y\in B)=0.1$ from masses $0.4$ and $0.25$ under independence.
5. **Threshold metrics.** An FPR is an expectation of an indicator, such as $40/1000=0.04$.
6. **Moment control.** $\lVert X\rVert_2=2.214$ means $\mathbb E[X^2]=4.9$ for the checked discrete example.


---

## Build order for this section

1. **Model first:** author `07-17` at full prose depth so the section has a local voice and rigor reference
   for expectation, expected loss, indicators, and Jensen.
2. **Core integral chain:** author `07-07`, `07-08`, `07-09`, `07-10`, and `07-11` together because
   measurability, the Lebesgue integral, and convergence theorems depend on one another.
3. **Measure foundations:** author `07-01` through `07-06`, keeping `07-01` and `07-03` explain-only while
   deriving the real consequences in sigma-algebras, measures, outer measure, and Lebesgue measure.
4. **Probability bridge:** author `07-15`, `07-16`, `07-18`, and `07-19` so probability spaces, random
   variables, density ratios, and densities all share notation.
5. **Norms, products, and iterated integrals:** author `07-12`, `07-13`, and `07-14`, using the verified
   $L^p$, rectangle, and Fubini numbers.
6. **Capstone last:** author `07-20` as the synthesis tying the whole section to probability foundations,
   expected loss, densities, and distribution shift.
