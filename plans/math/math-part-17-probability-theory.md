# Math · Part 17 — Probability theory  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four exposition
> principles, the case-by-case derivation rule, and the Definition of Done. This file rewrites the scaffold into
> authored per-lesson specifications. Every displayed application number was checked with `python3` using
> `numpy`, `scipy`, and `sympy` where useful; key checks include Bayes posteriors, distribution moments, inequality
> bounds, Gaussian tail areas, convolution counts, and multivariate-Gaussian quadratic forms.

**Section:** Probability theory · **Lessons:** 40 · **Breadcrumb:** `Mathematics · Probability & Statistics` · **Priority:** HIGH

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate shared with a sibling | 0 / 40 |
| Templated / thin motivation that needs real probability context | 17 / 40 |
| Key formula not in display form | 40 / 40 |
| Definition asserts a formula/result without deriving it | 36 / 40 |
| Pure concept lessons that should stay explain-only | 4 / 40 |
| Genuine LaTeX bugs found under the brief's rule | 0 / 40 |

**Compute log.** Verified examples: diagnostic posterior $0.3242$; spam posterior $0.6923$; $\mathrm{Bin}(10,0.3)$ mass at 3 is $0.2668$ with mean $3$ and variance $2.1$; $\mathrm{Pois}(4)$ mass at 2 is $0.1465$; $\mathrm{Geom}(0.2)$ mass at 4 is $0.1024$; $\mathcal N(100,15^2/36)$ tail above 105 is $0.0228$; Chebyshev bound $15^2/30^2=0.25$; Hoeffding coin bound for $n=100,\epsilon=0.1$ is $0.2707$; multivariate Gaussian example has $|\Sigma|=35$, quadratic form $12/7$, and density at the mean $0.0269$.

---

## Priority & systemic issues

- **Main defect: thin motivation.** The section does not have a whole-section §5 boilerplate block, but many lessons open by naming the object rather than explaining the probability problem it solves.
- **Main mathematical defect: assert-not-derive.** Most formulas are correct but stated as facts. The rewrite below derives them: Bayes, total probability, expectation and variance identities, distribution pmfs and moments, covariance, total expectation, Markov/Chebyshev/Jensen, LLN, CLT, Hoeffding, and the multivariate Gaussian density.
- **Applications need local numbers.** Each lesson gets six applications whose numbers come from that lesson's own concept rather than generic probability arithmetic.
- **LaTeX bugs.** None found by the brief's rule: no unclosed `$` and no lost matrix row break were detected in the current plan/dump.

---

## Model entry (full prose)

### `math-17-38` — The Central Limit Theorem  — **full-depth model entry**

**Connections (§1).**
> This lesson gathers several tools from the section into one result. Expectation gives the long-run center of a random quantity, variance measures its spread, and independence lets the variation in separate samples combine in a controlled way. The Law of Large Numbers says that sample averages settle near the mean. The Central Limit Theorem adds the shape of the remaining error: after the average is centered and scaled by its standard error, its distribution becomes approximately normal.
>
> This is why normal curves appear in measurement error, polling, A/B tests, stochastic optimization, and confidence intervals even when the original data are not normal. The theorem is not saying that every dataset is normal. It says that sums and averages of many independent small contributions have a normal limiting shape after the correct centering and scaling.

**Motivation & Intuition (§2).**
> Suppose individual observations have mean $\mu$ and standard deviation $\sigma$. The sample average $\bar X_n$ still has mean $\mu$, but its standard deviation is smaller: $\sigma/\sqrt n$. That explains the scale. If the sample size is multiplied by $4$, the typical error in the average is cut in half.
>
> The deeper point is the shape. A single observation may be skewed, discrete, or bounded, but a sum of many independent observations is built by repeatedly averaging independent noise. After centering by $\mu$ and scaling by $\sigma/\sqrt n$, the linear part of the distribution has been removed and the variance has been normalized to $1$. The terms beyond variance become less important as $n$ grows. What remains is the standard normal shape.
>
> The practical reading is direct. For $n$ large enough and no single observation dominating the sum, probabilities about $\bar X_n$ can be estimated with a normal $z$-score. If $\mu=100$, $\sigma=15$, and $n=36$, then $\mathrm{sd}(\bar X_n)=15/6=2.5$, so $\bar X_n=105$ is two standard errors above the mean and $P(\bar X_n>105)\approx P(Z>2)=0.0228$.

**Definition & Assumptions (§3).** Display
$$
\frac{\bar X_n-\mu}{\sigma/\sqrt n}\Rightarrow \mathcal N(0,1)
$$
for independent, identically distributed variables with finite mean $\mu$ and finite nonzero variance $\sigma^2$.

**Derive (complete).** Reuse the master E-2 characteristic-function derivation, expanded as numbered operations.
1. Define standardized variables $Y_i=(X_i-\mu)/\sigma$, so each $Y_i$ has mean $0$ and variance $1$; this removes location and scale before taking a limit.
2. Rewrite the normalized average as $Z_n=\frac{\bar X_n-\mu}{\sigma/\sqrt n}=\frac{1}{\sqrt n}\sum_{i=1}^n Y_i$; this puts the whole problem into the form of a standardized sum.
3. Use the characteristic function $\varphi_X(t)=\mathbb E[e^{itX}]$; for independent variables, the characteristic function of a sum is the product of the factors.
4. Apply that product rule to $Z_n$: $\varphi_{Z_n}(t)=\prod_{i=1}^n\varphi_Y(t/\sqrt n)=[\varphi_Y(t/\sqrt n)]^n$; the factor $t/\sqrt n$ appears because each $Y_i$ is scaled by $1/\sqrt n$.
5. Expand one factor near $0$: $\varphi_Y(s)=1+s\varphi_Y'(0)+\frac{s^2}{2}\varphi_Y''(0)+o(s^2)$; Taylor expansion captures the small argument $s=t/\sqrt n$.
6. Substitute the standardized moments: $\varphi_Y(0)=1$, $\varphi_Y'(0)=i\mathbb E[Y]=0$, and $\varphi_Y''(0)=-\mathbb E[Y^2]=-1$; mean $0$ removes the linear term and variance $1$ fixes the quadratic term.
7. Therefore $\varphi_Y(s)=1-\frac{s^2}{2}+o(s^2)$; all higher details are smaller than $s^2$ near zero.
8. Put $s=t/\sqrt n$: $\varphi_Y(t/\sqrt n)=1-\frac{t^2}{2n}+o(1/n)$; the error shrinks on the same scale as $1/n$.
9. Raise to the $n$th power: $\varphi_{Z_n}(t)=\left(1-\frac{t^2}{2n}+o(1/n)\right)^n$; this is the accumulated effect of $n$ small factors.
10. Use $(1+a/n)^n\to e^a$ with $a=-t^2/2$ to get $\varphi_{Z_n}(t)\to e^{-t^2/2}$; this is the limiting characteristic function.
11. Recognize $e^{-t^2/2}$ as the characteristic function of $\mathcal N(0,1)$; since characteristic functions determine distributions, $Z_n\Rightarrow\mathcal N(0,1)$.

**Symbols.** $X_i$ are the original observations; $\mu$ is their mean; $\sigma$ is their standard deviation; $\bar X_n$ is the sample average; $\Rightarrow$ means convergence in distribution; $\varphi_X(t)$ is the characteristic function; $t$ is a frequency argument; $o(s^2)$ means a remainder that is small compared with $s^2$.

**Real-World Applications (§5).**
1. **Average score monitoring.** With $\mu=100$, $\sigma=15$, $n=36$, $P(\bar X>105)=P(Z>2)=0.0228$.
2. **A/B lift estimate.** If per-user lift has $\sigma=20$ and $n=400$, the standard error is $20/20=1$, so a measured lift of $2.5$ is $z=2.5$ and has one-sided tail $0.0062$.
3. **Polling proportion.** For $p=0.52$, $n=1600$, $\mathrm{se}=\sqrt{0.52\cdot0.48/1600}=0.0125$, so $0.50$ is about $1.60$ standard errors below $0.52$.
4. **Batch loss average.** If example losses have $\sigma=3$ and batch size $64$, the average loss has standard error $3/8=0.375$.
5. **Manufacturing fill weights.** With $\mu=500$ g, $\sigma=12$ g, $n=36$, the sample-mean standard error is $2$ g, so $\bar X<496$ is about $P(Z<-2)=0.0228$.
6. **Monte Carlo mean.** If simulated payoff variance is $25$, then $10{,}000$ draws give standard error $5/100=0.05$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for the lesson: plain intuition, complete derivation when there is a formula to justify, symbol glossary, and exactly six concept-specific applications with checked numbers. `math-17-38` above is the full prose bar for the section; it is included in the lesson count.

### `math-17-01` — Sample spaces and events  · explain-only

**Connections (§1).**
> This opening lesson gives probability its basic vocabulary. Before calculating any chance, the model has to say which outcomes are possible and which outcomes count for the event of interest. That language connects directly to set operations, probability axioms, and random variables. A clear sample space also keeps later formulas from being applied to the wrong universe of outcomes.

**Motivation & Intuition (§2).**
> In ordinary counting problems, it is tempting to begin with a number such as one half or one sixth. Probability is safer when it begins one step earlier, by naming the experiment and listing or describing the outcomes that could occur. The sample space is that full collection, and an event is a selected part of it.
>
> This distinction matters because the same real situation can be modeled at different levels of detail. A coin flipped twice may have four ordered outcomes, while a simpler model may only record the number of heads. Once the outcome space is chosen, events become subsets, and probability rules can operate on those subsets consistently.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** explain-only: this is a naming and modeling lesson; the mathematical work is choosing $\Omega$ and subsets correctly, not proving a formula.

**Symbols.** $\Omega$ is the sample space; $\omega$ is one outcome; $A\subseteq\Omega$ is an event; $|A|$ counts outcomes in a finite event.

**Real-World Applications (§5).**
1. **Coin twice**: $\Omega=\{HH,HT,TH,TT\}$ and event at least one head has $3$ outcomes.
2. **Die roll**: even event $\{2,4,6\}$ has $3$ of $6$ outcomes.
3. **Classifier**: correctness space $\{TP,FP,TN,FN\}$ has $4$ outcomes.
4. **Card suit**: hearts event has $13$ outcomes in a $52$-card deck.
5. **Two bits**: exactly one 1 is $\{01,10\}$, so $2$ outcomes.
6. **Ad click**: $\Omega=\{0,1\}$ and click event has $1$ outcome.

---

### `math-17-02` — Set operations on events  · explain-only

**Connections (§1).**
> This lesson continues the sample-space language from the previous lesson. Once events are subsets of a sample space, the usual set operations become probability operations. Union, intersection, complement, and difference describe common phrases such as “at least one,” “both,” “not,” and “without.” These operations are used constantly in conditional probability, Bayes theorem, and distribution calculations.

**Motivation & Intuition (§2).**
> Many probability statements combine simpler events. A die roll might be even, high, both even and high, or even but not high. Set notation gives a compact way to say each of those cases without inventing new rules for every example.
>
> The load-bearing idea is membership. To understand a combined event, check which outcomes belong to it. This keeps logical statements precise before any probabilities are assigned, and it prevents double counting when events overlap.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** explain-only: the lesson is set language; use membership checks rather than a separate probability derivation.

**Symbols.** $A\cup B$ means $A$ or $B$; $A\cap B$ means both; $A^c$ means not $A$; $A\setminus B$ means in $A$ but not in $B$.

**Real-World Applications (§5).**
1. **Die roll**: $A=\{2,4,6\}$, $B=\{4,5,6\}$, so $A\cup B=\{2,4,5,6\}$ has $4$ outcomes.
2. **Intersection**: same $A,B$ give $A\cap B=\{4,6\}$ with $2$ outcomes.
3. **Complement**: not even is $\{1,3,5\}$ with $3$ outcomes.
4. **Difference**: even but not high is $\{2\}$ with $1$ outcome.
5. **Classifier errors**: false positives or false negatives are $2$ error types.
6. **Two dice**: sum 7 has $6$ ordered outcomes.

---

### `math-17-03` — Axioms of probability  · AUTHOR derivation

**Connections (§1).**
> After sample spaces and events are named, probability needs rules that make all assignments consistent. The axioms are deliberately small: probabilities are nonnegative, the whole sample space has mass one, and disjoint pieces add. From those rules, useful facts such as complements, impossible events, and monotonicity follow. These facts support every later calculation in the section.

**Motivation & Intuition (§2).**
> A probability model should behave like a careful accounting system. It should never assign negative mass, it should put total mass one on all possible outcomes, and it should add masses without overlap when events cannot happen together. These requirements are enough to rule out many inconsistent assignments.
>
> The main intuition is conservation of probability mass. If an event and its complement split the whole sample space, their probabilities must add to one. If one event sits inside another, the larger event must have at least as much probability because it contains all the smaller event’s mass and possibly more.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** Derive complement and empty-set facts from the axioms: 1. Split $\Omega=A\cup A^c$ with disjoint pieces because every outcome is either in $A$ or not. 2. Apply additivity: $P(\Omega)=P(A)+P(A^c)$. 3. Use normalization $P(\Omega)=1$ to get $P(A^c)=1-P(A)$. 4. Put $A=\Omega$ to get $P(\varnothing)=1-P(\Omega)=0$. 5. If $A\subseteq B$, write $B=A\cup(B\setminus A)$ disjointly, so $P(B)=P(A)+P(B\setminus A)\ge P(A)$.

**Symbols.** $P(A)$ is probability of event $A$; $\varnothing$ is impossible event; disjoint means intersection is empty.

**Real-World Applications (§5).**
1. **Reliability**: if failure probability is $0.02$, success is $0.98$.
2. **Email filter**: if spam probability is $0.15$, non-spam is $0.85$.
3. **Disjoint dice events**: $P(1\text{ or }6)=1/6+1/6=1/3$.
4. **Impossible overlap**: heads and tails on one flip has probability $0$.
5. **Nested events**: rolling 6 is within rolling even, so $1/6\le1/2$.
6. **Mass check**: probabilities $0.2,0.5,0.3$ sum to $1$.

---

### `math-17-04` — Combinatorial probability  · AUTHOR derivation

**Connections (§1).**
> This lesson applies the probability axioms to finite equally likely models. When every outcome has the same probability, the problem becomes counting favorable outcomes and total outcomes. That connects sample spaces with combinatorics, especially combinations. Later discrete distributions use the same counting logic inside their probability mass functions.

**Motivation & Intuition (§2).**
> Listing outcomes is possible for two dice or a few coin flips, but it quickly becomes impractical for cards, lotteries, and large samples. When outcomes are equally likely, counting replaces listing. The probability of an event is the fraction of equally likely outcomes that fall inside it.
>
> The important modeling step is deciding what counts as one outcome. Ordered selections and unordered selections are different sample spaces. Combinations appear when order is irrelevant, because each unordered group has many ordered descriptions that must be divided out.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. For equally likely outcomes, each outcome in finite $\Omega$ has mass $1/|\Omega|$. 2. An event $A$ contains $|A|$ such outcomes. 3. Add the equal masses: $P(A)=\sum_{\omega\in A}1/|\Omega|=|A|/|\Omega|$. 4. For combinations, choose $k$ unordered items by dividing ordered selections $n(n-1)\cdots(n-k+1)$ by $k!$, giving $\binom nk=\frac{n!}{k!(n-k)!}$.

**Symbols.** $|A|$ is the favorable count; $|\Omega|$ is the total count; $\binom nk$ counts $k$-subsets.

**Real-World Applications (§5).**
1. **Poker pair event**: choose 2 aces from 4 gives $\binom42=6$ pairs.
2. **Batch sample**: choose 3 from 10 gives $\binom{10}{3}=120$.
3. **Lottery**: one 6-number ticket from 49 has chance $1/\binom{49}{6}=1/13{,}983{,}816$.
4. **Defective selection**: choose 2 defectives from 5 and 1 good from 15 gives $\binom52\binom{15}1=150$ samples.
5. **Two dice sum 7**: $6/36=1/6$.
6. **Coin strings**: exactly 3 heads in 5 flips has $\binom53=10$ strings.

---

### `math-17-05` — Conditional probability  · AUTHOR derivation

**Connections (§1).**
> Conditional probability is the first formal update rule in the section. It builds on events, intersections, and probability mass. Once information says that event B occurred, probabilities are measured only inside B. This idea becomes the basis for independence, Bayes theorem, conditional distributions, and conditional expectation.

**Motivation & Intuition (§2).**
> New information changes which outcomes are still possible. If B is known, outcomes outside B no longer participate in the calculation. The event A can only occur through the overlap A cap B, so that overlap is compared with the probability mass of B.
>
> The renormalization is the essential step. The old whole sample space had mass one, but the restricted world B has mass P(B). Dividing by P(B) makes the remaining world have total mass one again, so ordinary probability reasoning can continue inside the condition.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Restrict attention to $B$, whose probability mass is $P(B)$. 2. Inside that restricted world, $A$ occurs exactly on $A\cap B$. 3. Renormalize the overlap by the available mass: $P(A\mid B)=P(A\cap B)/P(B)$. 4. Multiply both sides by $P(B)$ to get $P(A\cap B)=P(A\mid B)P(B)$.

**Symbols.** $P(A\mid B)$ means probability of $A$ given $B$; require $P(B)>0$.

**Real-World Applications (§5).**
1. **Cards**: $P(\text{ace}\mid\text{spade})=1/13$.
2. **Die**: given even, probability greater than 3 is $2/3$.
3. **Medical test base group**: if positives are $0.0293$ and true-positive overlap is $0.0095$, disease given positive is $0.3242$.
4. **Website**: $40$ buyers among $200$ visitors gives $0.20$.
5. **Confusion matrix**: precision $TP/(TP+FP)=80/(80+20)=0.80$.
6. **Weather**: rain among cloudy days $18/60=0.30$.

---

### `math-17-06` — Independence  · AUTHOR derivation

**Connections (§1).**
> Independence uses conditional probability to express absence of probabilistic influence. If learning B does not change the probability of A, the events are independent. The same idea also has a product form, which is often easier to compute. This product rule later extends to independent random variables, sums, and limit theorems.

**Motivation & Intuition (§2).**
> Some pieces of information matter and others do not. Knowing that a die roll is even changes the chance that it is six, but knowing the result of a separate coin flip does not. Independence gives a precise test for that second situation.
>
> The product formula says that the overlap of independent events has exactly the mass expected from multiplying their separate masses. This is not a rule to assume automatically. It is a modeling claim that must match the experiment or data-generating process.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Start from the condition $P(A\mid B)=P(A)$ for $P(B)>0$. 2. Substitute conditional probability: $P(A\cap B)/P(B)=P(A)$. 3. Multiply by $P(B)$ to get $P(A\cap B)=P(A)P(B)$. 4. Conversely, if the product rule holds and $P(B)>0$, divide by $P(B)$ to recover $P(A\mid B)=P(A)$.

**Symbols.** $A\perp B$ denotes independence; $P(A)P(B)$ is the product mass expected with no influence.

**Real-World Applications (§5).**
1. **Two coins**: $P(HH)=1/2\cdot1/2=1/4$.
2. **Die and coin**: $P(6\text{ and }H)=1/6\cdot1/2=1/12$.
3. **System failures**: two independent $0.01$ failures both occur with probability $0.0001$.
4. **Dropout masks**: two units kept with $0.8^2=0.64$.
5. **Not independent**: $P(\text{even}\cap\text{6})=1/6\ne(1/2)(1/6)$.
6. **A/B exposure and weekday**: if $0.4$ exposed and $5/7$ weekdays, joint is $2/7\approx0.2857$ under independence.

---

### `math-17-07` — The law of total probability  · AUTHOR derivation

**Connections (§1).**
> The law of total probability organizes calculations by cases. It uses disjoint events that cover the sample space, together with conditional probability inside each case. This is the denominator machinery behind Bayes theorem. It is also a common way to combine segment-level rates into an overall rate.

**Motivation & Intuition (§2).**
> Many events can happen through several routes. A positive test can come from diseased and non-diseased groups, a click can come from mobile and desktop users, and a delay can come from different shipping methods. Total probability says to compute within each route and then average using the route frequencies.
>
> The key requirement is that the cases form a partition. They must not overlap, and together they must cover the world being modeled. With that structure in place, each piece of A is counted once, and the weighted sum gives the full probability of A.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Let $B_1,\dots,B_k$ be disjoint and cover $\Omega$. 2. Split $A$ into disjoint pieces: $A=(A\cap B_1)\cup\cdots\cup(A\cap B_k)$. 3. Add disjoint probabilities: $P(A)=\sum_iP(A\cap B_i)$. 4. Use conditional probability on each piece: $P(A\cap B_i)=P(A\mid B_i)P(B_i)$. 5. Substitute to get $P(A)=\sum_iP(A\mid B_i)P(B_i)$.

**Symbols.** $B_i$ are cases or strata; $P(B_i)$ are case weights.

**Real-World Applications (§5).**
1. **Diagnostic positives**: $0.01\cdot0.95+0.99\cdot0.02=0.0293$.
2. **Ad click**: mobile $0.7$ at $0.04$ and desktop $0.3$ at $0.02$ gives $0.034$.
3. **Shipping delay**: air $0.6$ at $0.05$, ground $0.4$ at $0.12$ gives $0.078$.
4. **Model error by segment**: $0.5\cdot0.08+0.5\cdot0.12=0.10$.
5. **Factory defect**: lines $0.3,0.7$ with rates $0.01,0.03$ give $0.024$.
6. **Rain by season**: $0.25(0.4+0.2+0.1+0.3)=0.25$.

---

### `math-17-08` — Bayes theorem  · AUTHOR derivation

**Connections (§1).**
> Bayes theorem combines conditional probability with total probability. It is used when the available information is naturally stated in the forward direction, such as signal given state, but the needed answer is the reverse direction, such as state given signal. The theorem separates prior belief, likelihood, and evidence. This structure reappears in diagnostics, spam filtering, classification, and Bayesian modeling.

**Motivation & Intuition (§2).**
> A test result or signal is often easier to model from each possible cause than the other way around. For example, it may be known how often a test is positive among sick people and among healthy people. The question after observing a positive result is different: how much of the positive group actually comes from the sick population.
>
> Bayes theorem answers by comparing the mass of the target overlap with the total mass of the evidence. The numerator is the joint mass of the cause and signal. The denominator includes every way the signal can happen, which is why base rates matter so strongly in rare-event problems.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Write the same overlap two ways: $P(A\cap B)=P(A\mid B)P(B)$ and $P(A\cap B)=P(B\mid A)P(A)$. 2. Set the right-hand sides equal. 3. Divide by $P(B)$ to get $P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}$. 4. If $B$ can happen through cases $A$ and $A^c$, expand $P(B)$ by total probability.

**Symbols.** $P(A)$ prior; $P(B\mid A)$ likelihood; $P(A\mid B)$ posterior; $P(B)$ evidence.

**Real-World Applications (§5).**
1. **Medical test**: $0.0095/0.0293=0.3242$ disease given positive.
2. **Spam filter**: $0.2\cdot0.9/(0.2\cdot0.9+0.8\cdot0.1)=0.6923$.
3. **Fraud alert**: prior $0.01$, hit $0.8$, false alert $0.05$ gives $0.1391$.
4. **Rare bug**: prior $0.02$, detector $0.9$, false $0.1$ gives $0.1552$.
5. **Weather radar**: prior rain $0.3$, radar hit $0.8$, false $0.2$ gives $0.6316$.
6. **A/B winner**: prior $0.5$, signal likelihoods $0.7,0.3$ gives posterior $0.7$.

---

### `math-17-09` — Discrete random variables  · explain-only

**Connections (§1).**
> This lesson moves from events to random variables. A random variable turns outcomes into numbers, so probability can describe quantities such as counts, labels, and scores. Discrete random variables use probability masses on countable values. They prepare the ground for expectation, variance, Bernoulli, binomial, Poisson, and geometric models.

**Motivation & Intuition (§2).**
> Events answer yes-or-no questions about outcomes, but many models need a numeric summary. In two coin flips, the outcome might be HT, while the random variable records the number of heads as 1. The probability model then shifts from raw outcomes to the values the variable can take.
>
> For a discrete random variable, probability sits on individual values. The mass function records how much probability each value receives, and the masses must sum to one. This makes it possible to compute averages, spreads, and distribution-specific probabilities from a compact table or formula.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** explain-only: the core move is modeling outcomes as numbers and assigning masses that sum to $1$.

**Symbols.** $X$ is the random variable; $x$ is a possible value; $p_X(x)=P(X=x)$ is the mass function.

**Real-World Applications (§5).**
1. **Coin heads in 2 flips**: $P(X=0,1,2)=(1/4,1/2,1/4)$.
2. **Support count**: a die-valued $X$ has $6$ possible values.
3. **Click count** in 3 impressions can be $0,1,2,3$.
4. **Classifier error** $X\in\{0,1\}$ has two values.
5. **Queue length** might be $0,1,2,\dots$.
6. **Mass check**: $0.2+0.5+0.3=1$.

---

### `math-17-10` — Continuous random variables  · explain-only

**Connections (§1).**
> Continuous random variables extend probability from counts to measurements. Instead of putting mass on individual values, they assign probability to intervals. This shift is essential for wait times, heights, latencies, noise, and real-valued model outputs. The next lesson makes the interval-area idea precise through density functions.

**Motivation & Intuition (§2).**
> A measurement such as time or height can vary on a continuum. In such models, the chance of landing on one exact value is usually zero, not because the value is impossible, but because probability is spread across infinitely many nearby values. Meaningful probabilities come from ranges.
>
> The central idea is area rather than point mass. To ask about a continuous variable, one usually asks whether it falls below a threshold, above a threshold, or inside an interval. Densities and CDFs are tools for computing those interval probabilities.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** explain-only: the conceptual shift is from point mass to interval area; density formulas are derived in the next lesson.

**Symbols.** $X$ is continuous; $P(a\le X\le b)$ is interval probability; $f_X$ is density when it exists.

**Real-World Applications (§5).**
1. **Uniform wait 0 to 10**: wait between 2 and 5 has probability $3/10=0.3$.
2. **Exact wait**: $P(X=4)=0$ for a continuous wait.
3. **Height interval**: 170--180 cm is an interval event.
4. **Latency below 100 ms** is $P(X<100)$.
5. **Sensor noise** uses intervals such as $[-0.1,0.1]$.
6. **Revenue lift** can be positive with probability $P(X>0)$.

---

### `math-17-11` — Probability density functions  · AUTHOR derivation

**Connections (§1).**
> Density functions make continuous probability calculable. They connect the interval language of continuous variables with integration from calculus. A density can be high or low locally, but probability is obtained only after multiplying by width and adding area. This lesson supports CDFs, Gaussian models, transformations, and continuous joint distributions.

**Motivation & Intuition (§2).**
> For continuous variables, a point has no probability mass, so the height of a curve cannot be read as a probability by itself. Instead, the height describes probability per unit of horizontal distance. A narrow bin gets probability approximately equal to height times width.
>
> Integration is the limiting version of adding many small bins. As the bins become thinner, the approximate sum of rectangle areas becomes the exact area under the density. The total area must be one because the variable has to land somewhere on its support.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Require total probability $1$, so $\int_{-\infty}^{\infty}f_X(x)\,dx=1$. 2. Probability in a small interval $[x,x+\Delta x]$ is approximately $f_X(x)\Delta x$. 3. Add small interval probabilities across $[a,b]$. 4. Take the limit as interval widths shrink to get $P(a\le X\le b)=\int_a^b f_X(x)\,dx$.

**Symbols.** $f_X(x)$ is density; $dx$ is a small width; the integral is area.

**Real-World Applications (§5).**
1. **Uniform density** on $[2,6]$ is $1/4$, so $P(3\le X\le5)=2/4=0.5$.
2. **Triangular density** $f(x)=2x$ on $[0,1]$ integrates to $1$.
3. **Small bin**: density $0.2$ over width $0.5$ gives approximate mass $0.1$.
4. **Normal within one sd** has area $0.6827$.
5. **Exponential rate 0.5** has density at $2$ equal $0.5e^{-1}=0.1839$.
6. **Area check**: rectangle height $0.25$ width $4$ has area $1$.

---

### `math-17-12` — Cumulative distribution functions  · AUTHOR derivation

**Connections (§1).**
> The cumulative distribution function gives a single function that summarizes a distribution. It applies to discrete, continuous, and mixed cases, so it is more general than a density. By subtracting CDF values, interval probabilities become easy to express. Percentiles, medians, tail probabilities, and quantiles all use this function.

**Motivation & Intuition (§2).**
> Instead of asking for the probability at a value or inside a small bin, the CDF asks for all probability accumulated up to a threshold. As the threshold moves to the right, the accumulated mass can only increase. This creates a stable way to describe the distribution as a whole.
>
> The subtraction rule is the practical payoff. Probability between two thresholds is the mass accumulated by the upper threshold minus the mass already accumulated by the lower threshold. When a density exists, the CDF is the accumulated area under that density.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Define $F(x)=P(X\le x)$. 2. For $a<b$, split $\{X\le b\}$ into disjoint events $\{X\le a\}$ and $\{a<X\le b\}$. 3. Add probabilities: $F(b)=F(a)+P(a<X\le b)$. 4. Rearrange to get $P(a<X\le b)=F(b)-F(a)$. 5. If a density exists, accumulated area gives $F(x)=\int_{-\infty}^x f(t)\,dt$.

**Symbols.** $F$ is CDF; $f$ is density; $a,b$ are interval endpoints.

**Real-World Applications (§5).**
1. **Interval from CDF**: $F(8)=0.7$, $F(3)=0.2$ gives $0.5$.
2. **Median**: $F(m)=0.5$.
3. **95th percentile**: $F(q)=0.95$.
4. **Uniform [0,10]**: $F(4)=0.4$.
5. **Tail**: $P(X>7)=1-F(7)$.
6. **Discrete CDF**: masses $0.2,0.5,0.3$ give $F(1)=0.7$.

---

### `math-17-13` — Expectation  · AUTHOR derivation

**Connections (§1).**
> Expectation is the central average used throughout probability. It turns a distribution into its long-run center by weighting values according to their probabilities. This idea links random variables to variance, moments, conditional expectation, inequalities, and limit theorems. Many later formulas are built by applying expectation to transformed variables.

**Motivation & Intuition (§2).**
> An ordinary average gives equal weight to each observed value in a dataset. A probability-weighted average gives more influence to values that occur more often. If an experiment were repeated many times, the empirical average would be pulled toward this weighted center.
>
> For discrete variables, the expectation is a weighted sum. For continuous variables, the same idea becomes an integral because probability is spread through density. In both cases, expectation is not necessarily the most likely value; it is the balance point of the distribution.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. In $n$ repetitions, value $x_i$ appears about $np_i$ times. 2. The sample average is approximately $\frac{1}{n}\sum_i (np_i)x_i$. 3. Cancel $n$ to get $\sum_i x_ip_i$. 4. For a continuous variable, replace the sum of small bins by $\int x f(x)\,dx$.

**Symbols.** $\mathbb E[X]$ is expectation; $p_i=P(X=x_i)$; $f(x)$ is density.

**Real-World Applications (§5).**
1. **Three-point distribution**: values $0,1,2$ with masses $0.2,0.5,0.3$ give mean $1.1$.
2. **Dice**: $(1+2+3+4+5+6)/6=3.5$.
3. **Ad revenue**: $0.04\cdot2=0.08$ dollars expected per impression.
4. **Insurance**: $0.01\cdot1000=10$ expected payout.
5. **Bernoulli**: $E[X]=p$, so $p=0.3$ gives $0.3$.
6. **Uniform [2,6]**: mean $(2+6)/2=4$.

---

### `math-17-14` — Variance  · AUTHOR derivation

**Connections (§1).**
> Variance builds on expectation by measuring spread around the mean. It is the average squared deviation, so it uses expectation after centering the variable. The identity involving E[X squared] makes variance easier to compute in many distributions. Variance later controls Chebyshev bounds, sample averages, Gaussian scale, and the Central Limit Theorem.

**Motivation & Intuition (§2).**
> A mean alone does not say how variable the outcomes are. Two distributions can have the same center while one is tightly concentrated and the other is widely spread. Variance measures this spread by looking at distances from the mean.
>
> Squaring deviations has two roles. It prevents positive and negative deviations from canceling, and it gives larger deviations more weight. The algebraic identity for variance is useful because raw second moments are often easier to compute than centered squared deviations directly.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Start with $\operatorname{Var}(X)=\mathbb E[(X-\mu)^2]$. 2. Expand the square: $(X-\mu)^2=X^2-2\mu X+\mu^2$. 3. Take expectation term by term. 4. Use $\mathbb E[X]=\mu$ and $\mathbb E[\mu^2]=\mu^2$. 5. Get $\operatorname{Var}(X)=\mathbb E[X^2]-2\mu^2+\mu^2=\mathbb E[X^2]-\mu^2$.

**Symbols.** $\mu=\mathbb E[X]$; $\sigma^2=\operatorname{Var}(X)$; $\sigma$ is standard deviation.

**Real-World Applications (§5).**
1. **Three-point distribution** above has $E[X^2]=1.7$, mean $1.1$, variance $0.49$.
2. **Bernoulli $p=0.3$** has variance $0.21$.
3. **Die** has variance $35/12=2.9167$.
4. **Uniform [2,6]** variance is $16/12=1.3333$.
5. **Batch average** of variance $9$ with $n=36$ has variance $0.25$.
6. **Standard deviation** for variance $2.25$ is $1.5$.

---

### `math-17-15` — Moments  · AUTHOR derivation

**Connections (§1).**
> Moments generalize expectation and variance into a family of summaries. The first raw moment gives the mean, the second raw moment helps compute variance, and central moments describe shape around the mean. This language prepares for moment generating functions and distribution comparisons. It also gives a compact way to discuss skew and tail behavior.

**Motivation & Intuition (§2).**
> A distribution has more structure than just its center and spread. Powers of the random variable emphasize different parts of the distribution. Low powers describe basic location and scale, while higher powers become sensitive to asymmetry and extreme values.
>
> Raw moments measure powers from zero, while central moments measure powers after subtracting the mean. That centering is what makes central moments describe shape rather than location. The second central moment is variance, and higher central moments help describe skewness and tail weight.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Define raw moment $m_k=\mathbb E[X^k]$. 2. For $k=1$, $m_1=\mathbb E[X]$ is the mean. 3. For $k=2$, combine with the variance identity: $\operatorname{Var}(X)=m_2-m_1^2$. 4. Define central moment $\mu_k=\mathbb E[(X-\mathbb E[X])^k]$ to measure shape around the mean.

**Symbols.** $m_k$ raw moment; $\mu_k$ central moment; $k$ is the power.

**Real-World Applications (§5).**
1. **Three-point distribution** has $m_1=1.1$ and $m_2=1.7$.
2. **Bernoulli $p=0.3$** has every raw moment $m_k=0.3$ for $k\ge1$.
3. **Standard normal** has $m_2=1$ and $m_4=3$.
4. **Uniform [0,1]** has $m_2=1/3$.
5. **Exponential rate 0.5** has mean $2$ and second raw moment $8$.
6. **Skew direction**: values $0,0,3$ have positive third central moment.

---

### `math-17-16` — Moment generating functions  · AUTHOR derivation

**Connections (§1).**
> Moment generating functions package many moment calculations into one function. They use expectation applied to an exponential transform, then recover moments by differentiating at zero. This connects power-series algebra with probability summaries. MGFs are also useful for sums of independent variables and for recognizing named distributions.

**Motivation & Intuition (§2).**
> Computing moments one at a time can become repetitive. The exponential series contains every power of X, so taking its expectation stores all raw moments as coefficients in one function. Differentiation at zero selects the desired coefficient.
>
> The other major advantage appears with independent sums. Exponentials turn sums into products, and independence lets expectations of products factor. This makes the MGF of a sum especially simple when the summands are independent.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Define $M_X(t)=\mathbb E[e^{tX}]$. 2. Expand $e^{tX}=1+tX+t^2X^2/2!+\cdots$. 3. Take expectation term by term to get $M_X(t)=1+t\mathbb E[X]+t^2\mathbb E[X^2]/2!+\cdots$. 4. Differentiate $k$ times and set $t=0$; all terms vanish except $\mathbb E[X^k]$. 5. For independent sums, $M_{X+Y}(t)=E[e^{tX}e^{tY}]=M_X(t)M_Y(t)$.

**Symbols.** $M_X(t)$ is the MGF; $t$ is an auxiliary variable; $M_X^{(k)}(0)$ is the $k$th derivative at zero.

**Real-World Applications (§5).**
1. **Bernoulli**: $M(t)=1-p+pe^t$, so $M'(0)=p$.
2. **Poisson**: $M(t)=\exp(\lambda(e^t-1))$, so mean $\lambda$.
3. **Normal**: $M(t)=\exp(\mu t+\sigma^2t^2/2)$.
4. **Sum of two Poisson(2)** has MGF of Poisson(4).
5. **Exponential rate 0.5** has $M(t)=0.5/(0.5-t)$ for $t<0.5$.
6. **Moment check**: $M''(0)-M'(0)^2$ gives variance.

---

### `math-17-17` — The Bernoulli distribution  · AUTHOR derivation

**Connections (§1).**
> The Bernoulli distribution is the simplest nontrivial random-variable model. It records one trial with two outcomes, usually coded as 1 for success and 0 for failure. Because many counts are sums of yes-or-no trials, Bernoulli variables are building blocks for the binomial distribution and sample proportions. They also appear in classification, clicks, labels, and dropout masks.

**Motivation & Intuition (§2).**
> Many random situations reduce to one binary outcome. A user clicks or does not click, a component fails or does not fail, and a label is correct or incorrect. Coding success as 1 and failure as 0 turns the event into a numeric random variable.
>
> The coding makes the mean especially interpretable. Since the variable is 1 exactly on success, its expected value is the success probability. The variance is largest near p=0.5 and smaller near 0 or 1, reflecting that nearly certain outcomes have less variability.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Let $X=1$ for success and $X=0$ for failure. 2. Assign $P(X=1)=p$ and $P(X=0)=1-p$ so masses sum to $1$. 3. Compute mean: $E[X]=1\cdot p+0\cdot(1-p)=p$. 4. Since $X^2=X$, $E[X^2]=p$. 5. Use variance identity to get $p-p^2=p(1-p)$.

**Symbols.** $p$ is success probability; $X\in\{0,1\}$.

**Real-World Applications (§5).**
1. **CTR click** with $p=0.04$ has mean $0.04$.
2. **Conversion** with $p=0.1$ has variance $0.09$.
3. **Fair coin** has mean $0.5$.
4. **Dropout keep** with $p=0.8$ has variance $0.16$.
5. **Label error** with $p=0.03$ has expected error $0.03$.
6. **Two independent successes** at $p=0.3$ both occur with $0.09$.

---

### `math-17-18` — The binomial distribution  · AUTHOR derivation

**Connections (§1).**
> The binomial distribution extends Bernoulli trials from one trial to a fixed number of independent trials. It counts how many successes occur, not which exact sequence occurred. The formula combines sequence probabilities with combinatorial counts. This distribution supports click counts, defect counts, coin experiments, and many normal-approximation examples later in the section.

**Motivation & Intuition (§2).**
> A single Bernoulli trial says whether one success occurred. In many applications, the natural question is how many successes appear across n repeated trials. Each exact sequence with k successes has the same probability when trials are independent with the same success chance.
>
> The binomial coefficient counts where the successes could be placed. Multiplying the probability of one such sequence by the number of such sequences gives the mass at k. The mean and variance then come from viewing the count as a sum of independent Bernoulli variables.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. A particular sequence with $k$ successes and $n-k$ failures has probability $p^k(1-p)^{n-k}$. 2. The $k$ success positions can be chosen in $\binom nk$ ways. 3. Add equal-probability sequences to get $P(X=k)=\binom nk p^k(1-p)^{n-k}$. 4. Sum Bernoulli means to get $E[X]=np$. 5. Sum independent Bernoulli variances to get $\operatorname{Var}(X)=np(1-p)$.

**Symbols.** $n$ trials; $k$ successes; $p$ success probability.

**Real-World Applications (§5).**
1. **10 impressions, CTR 0.3**: $P(X=3)=0.2668$.
2. **Mean clicks**: $10\cdot0.3=3$.
3. **Variance**: $10\cdot0.3\cdot0.7=2.1$.
4. **At least one success in 5 at $p=0.2$**: $1-0.8^5=0.6723$.
5. **Fair coins**: exactly 5 heads in 10 has $\binom{10}5/2^{10}=0.2461$.
6. **Batch defects**: $n=100,p=0.01$ gives expected defects $1$.

---

### `math-17-19` — The Poisson distribution  · AUTHOR derivation

**Connections (§1).**
> The Poisson distribution models counts in a fixed interval when events occur at a constant average rate. It can be derived as the limit of many tiny Bernoulli opportunities. This makes it useful for rare events, arrivals, defects, and calls. It also connects to the exponential distribution, which models the waiting time between such events.

**Motivation & Intuition (§2).**
> Some counts do not have a natural fixed number of trials. Calls arrive during a minute, defects appear along a production run, and requests hit a server over time. The Poisson model describes the count when events occur independently and the average rate is stable.
>
> The limiting construction divides the interval into many small pieces. Each piece has a tiny chance of one event, and the expected total count stays at lambda. As the pieces become smaller, the binomial count approaches the Poisson mass formula.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Start with a binomial count over $n$ tiny subintervals with success probability $p=\lambda/n$. 2. The mass is $\binom nk(\lambda/n)^k(1-\lambda/n)^{n-k}$. 3. As $n\to\infty$, $\binom nk(\lambda/n)^k\to\lambda^k/k!$. 4. The no-event factor $(1-\lambda/n)^n\to e^{-\lambda}$. 5. The remaining finite correction tends to $1$. 6. Therefore $P(X=k)=e^{-\lambda}\lambda^k/k!$; mean and variance are both $\lambda$ by the MGF.

**Symbols.** $\lambda$ is expected count; $k$ is observed count.

**Real-World Applications (§5).**
1. **Calls per minute** with $\lambda=4$: $P(2)=0.1465$.
2. **Expected calls** is $4$.
3. **Variance** is $4$.
4. **Zero events** at $\lambda=3$ has probability $e^{-3}=0.0498$.
5. **Two independent streams** with rates 2 and 5 combine to rate 7.
6. **Rare defects** with $\lambda=1$ gives $P(0)=0.3679$.

---

### `math-17-20` — The geometric distribution  · AUTHOR derivation

**Connections (§1).**
> The geometric distribution changes the focus from how many successes occur to how long it takes to see the first one. It is built from independent Bernoulli trials with the same success probability. The model is useful for retries, first clicks, first heads, and waiting for a rare event. It also introduces a simple discrete waiting-time pattern.

**Motivation & Intuition (§2).**
> Waiting for a first success has a special structure. To succeed for the first time on trial k, every earlier trial must fail and the kth trial must succeed. There is only one pattern of success and failure for that event.
>
> Independence turns that pattern into a product of probabilities. The longer the wait, the more failure factors are multiplied before the final success factor. The mean wait 1/p reflects the basic scale: smaller success probabilities create longer expected waits.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. To have first success on trial $k$, the first $k-1$ trials must fail. 2. The failure probability for those trials is $(1-p)^{k-1}$. 3. The $k$th trial succeeds with probability $p$. 4. Independence gives $P(X=k)=(1-p)^{k-1}p$. 5. Summing the power series gives $E[X]=1/p$ and $\operatorname{Var}(X)=(1-p)/p^2$.

**Symbols.** $p$ success probability; $k$ trial number of first success.

**Real-World Applications (§5).**
1. **First click** at CTR $0.2$ on trial 4: $0.8^3\cdot0.2=0.1024$.
2. **Expected trials** for $p=0.2$ is $5$.
3. **Variance** for $p=0.2$ is $20$.
4. **First head** on trial 3 has $0.5^3=0.125$.
5. **No success in 5** at $p=0.1$ has $0.9^5=0.5905$.
6. **Median wait rough check** for $p=0.5$: $P(X\le1)=0.5$.

---

### `math-17-21` — The uniform distribution  · AUTHOR derivation

**Connections (§1).**
> The uniform distribution is the simplest model of equal likelihood over a range. In the continuous case, equal-length intervals receive equal probability. This provides a clean example of density, CDF, mean, variance, and quantiles. It also appears as a reference model for random initialization and simulation.

**Motivation & Intuition (§2).**
> When no location inside an interval is favored, a constant density is the natural continuous model. Since probability is area, equal lengths get equal areas under a flat density. The density height is determined entirely by the requirement that total area equals one.
>
> The mean sits at the midpoint by symmetry. The variance depends only on the length of the interval, because shifting the interval changes location but not spread. These features make the uniform distribution a useful baseline for understanding more shaped distributions.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. On $[a,b]$, a constant density must be $c$. 2. Total area is $c(b-a)=1$, so $c=1/(b-a)$. 3. Interval probability is length times density: $P(r\le X\le s)=(s-r)/(b-a)$. 4. Symmetry gives mean $(a+b)/2$. 5. Integrating $(x-\mu)^2/(b-a)$ gives variance $(b-a)^2/12$.

**Symbols.** $a,b$ endpoints; $c$ density; $r,s$ interval endpoints.

**Real-World Applications (§5).**
1. **Wait from 2 to 6** has mean $4$.
2. **Variance** on $[2,6]$ is $1.3333$.
3. **Between 3 and 5** on $[2,6]$ has probability $0.5$.
4. **Random initialization** on $[-1,1]$ has density $0.5$.
5. **Die as discrete uniform** has mean $3.5$.
6. **Quantile** on $[0,10]$: 90th percentile is $9$.

---

### `math-17-22` — The exponential distribution  · AUTHOR derivation

**Connections (§1).**
> The exponential distribution is the waiting-time partner of the Poisson distribution. If Poisson counts describe how many events arrive by a time, the exponential distribution describes the time until the next arrival. Its CDF and density come directly from the probability of no event occurring yet. The model is central in queues, reliability, and continuous-time processes.

**Motivation & Intuition (§2).**
> A waiting time exceeds t exactly when no event has arrived by time t. In a constant-rate Poisson process, the probability of zero arrivals over that interval is easy to compute. That survival probability determines the exponential distribution.
>
> Differentiating the CDF turns accumulated probability into a density. The rate lambda controls the time scale: larger rates make shorter waits more likely. The memoryless property reflects the constant-rate assumption, where waiting additional time does not depend on how long one has already waited.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. If events arrive at rate $\lambda$, no event by time $t$ has Poisson probability $e^{-\lambda t}$. 2. Thus $P(T>t)=e^{-\lambda t}$. 3. The CDF is $F(t)=1-e^{-\lambda t}$ for $t\ge0$. 4. Differentiate the CDF to get density $f(t)=\lambda e^{-\lambda t}$. 5. Integrating $t f(t)$ gives mean $1/\lambda$; integrating $t^2f(t)$ gives variance $1/\lambda^2$.

**Symbols.** $T$ waiting time; $\lambda$ rate; $f$ density; $F$ CDF.

**Real-World Applications (§5).**
1. **Rate 0.5** has mean wait $2$.
2. **Variance** at rate $0.5$ is $4$.
3. **Wait over 6** has probability $e^{-3}=0.0498$.
4. **CDF at 2** for rate $0.5$ is $1-e^{-1}=0.6321$.
5. **Memoryless wait**: $P(T>7\mid T>5)=P(T>2)=e^{-1}=0.3679$.
6. **Median wait** at rate $0.5$ is $\ln2/0.5=1.3863$.

---

### `math-17-23` — The Gaussian distribution  · AUTHOR derivation

**Connections (§1).**
> The Gaussian distribution is the main bell-shaped continuous model in probability. It is determined by a mean for location and a standard deviation for scale. Standardization converts any Gaussian with positive scale into the standard normal. This distribution is later justified by the Central Limit Theorem and extended by the multivariate Gaussian.

**Motivation & Intuition (§2).**
> The standard normal gives a reference density centered at zero with variance one. Many real-valued models use a shifted and scaled version of that reference shape. Subtracting the mean recenters the variable, and dividing by the standard deviation expresses distance in standard-deviation units.
>
> The density transformation accounts for the horizontal stretch caused by sigma. Wider distributions have lower peak density because the total area must remain one. This is why the same bell shape can represent many centers and scales while preserving total probability.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Begin with the standard normal density $\phi(z)=\frac1{\sqrt{2\pi}}e^{-z^2/2}$. 2. Standardize $X$ by $Z=(X-\mu)/\sigma$. 3. Solve for $x=\mu+\sigma z$, so $dz=dx/\sigma$. 4. Substitute into density area: $f_X(x)dx=\phi((x-\mu)/\sigma)\,dx/\sigma$. 5. Therefore $f_X(x)=\frac1{\sigma\sqrt{2\pi}}\exp[-(x-\mu)^2/(2\sigma^2)]$.

**Symbols.** $\mu$ mean; $\sigma$ standard deviation; $z$ standardized value.

**Real-World Applications (§5).**
1. **Exam score** $70\pm10$: $P(60<X<80)=0.6827$.
2. **Tail** $P(Z>2)=0.0228$.
3. **Standardize** $x=85$, $\mu=70$, $\sigma=10$ gives $z=1.5$.
4. **95% band** is about $\mu\pm1.96\sigma$.
5. **Density at mean** with $\sigma=10$ is $1/(10\sqrt{2\pi})=0.0399$.
6. **Sum of normals**: means $2+3=5$, variances $4+9=13$.

---

### `math-17-24` — The Beta and Gamma distributions  · AUTHOR derivation

**Connections (§1).**
> The Beta and Gamma distributions are flexible continuous families for constrained positive quantities. Beta variables live on the probability interval from 0 to 1, while Gamma variables live on the positive line. Their parameters control shape, center, and spread. They are common in Bayesian modeling, waiting-time models, rates, and uncertainty over probabilities.

**Motivation & Intuition (§2).**
> Some quantities have natural boundaries. A probability cannot be below 0 or above 1, and a waiting time or rate cannot be negative. The Beta and Gamma families build those constraints into the density while still allowing many different shapes.
>
> Normalization is the main technical issue. The density shape is written first up to proportionality, and then a special-function constant makes the total area equal one. Once normalized, the parameters give simple mean and variance formulas that make the families practical to use.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. For Beta, use density proportional to $x^{\alpha-1}(1-x)^{\beta-1}$ on $[0,1]$. 2. Normalize by $B(\alpha,\beta)=\frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}$. 3. Integrating $x f(x)$ gives mean $\alpha/(\alpha+\beta)$. 4. For Gamma, normalize $x^{k-1}e^{-x/\theta}$ on $x>0$ by $\Gamma(k)\theta^k$. 5. Its mean is $k\theta$ and variance is $k\theta^2$.

**Symbols.** $\alpha,\beta$ are Beta shape parameters; $k,\theta$ are Gamma shape and scale; $\Gamma$ is the gamma function.

**Real-World Applications (§5).**
1. **Beta(2,5)** mean is $2/7=0.2857$.
2. **Beta(2,5)** variance is $10/(49\cdot8)=0.0255$.
3. **Uniform prior** is Beta(1,1).
4. **After 3 successes and 7 failures** with Beta(1,1), posterior is Beta(4,8).
5. **Gamma(3,2)** mean is $6$.
6. **Gamma(3,2)** variance is $12$.

---

### `math-17-25` — Joint distributions  · AUTHOR derivation

**Connections (§1).**
> Joint distributions move from one random variable to several variables considered together. They preserve co-occurrence information that separate marginal distributions would lose. This is the starting point for marginals, conditional distributions, independence of random variables, covariance, and correlation. It also supports multivariate models such as the multivariate Gaussian.

**Motivation & Intuition (§2).**
> Two variables can each have simple individual behavior while still being related to each other. A joint distribution records the probability of pairs or regions, so it can answer questions about variables happening together. Without the joint distribution, dependence information is missing.
>
> For discrete variables, the joint distribution is a table of masses that sum to one. For continuous variables, it is a density over a region, and probabilities come from integrating over that region. In both cases, the joint object is the full probability model for the variables together.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. For discrete variables, assign mass $p_{X,Y}(x,y)=P(X=x,Y=y)$. 2. All joint masses must be nonnegative and sum to $1$. 3. The probability of a rectangle is the sum over pairs inside it. 4. For continuous variables, replace sums by double integrals: $P((X,Y)\in R)=\iint_R f_{X,Y}(x,y)\,dx\,dy$.

**Symbols.** $p_{X,Y}$ joint pmf; $f_{X,Y}$ joint density; $R$ a region in the plane.

**Real-World Applications (§5).**
1. **Joint table** $[[0.1,0.4],[0.2,0.3]]$ sums to $1$.
2. **Event $X=1,Y=2$** in that table has mass $0.3$.
3. **$X+Y>1$** for $X\in\{0,1\},Y\in\{0,2\}$ has mass $0.4+0.3=0.7$.
4. **Bivariate density over unit square** $f=1$ has total mass $1$.
5. **Rectangle half-square** area $0.5$ has probability $0.5$.
6. **Two labels** with 3 classes each have $9$ joint cells.

---

### `math-17-26` — Marginal distributions  · AUTHOR derivation

**Connections (§1).**
> Marginal distributions extract one variable from a joint distribution. They answer how X behaves by itself after the other variables are ignored. The operation is summing in the discrete case and integrating in the continuous case. Marginals are needed for conditional distributions, independence tests, and covariance calculations.

**Motivation & Intuition (§2).**
> A joint table or density contains more information than is sometimes needed. If the current question only concerns X, all possibilities for Y should be included rather than fixed. Marginalization adds up the joint probabilities across the variable being removed.
>
> The name marginal comes from table margins, where row and column sums sit at the edges of a joint table. The same idea works in continuous models by integration. The resulting distribution is a valid distribution because it collects all joint mass associated with each value of the variable kept.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. The event $X=x$ is the disjoint union over all possible $Y=y$: $(X=x,Y=y)$. 2. Add those disjoint masses: $p_X(x)=\sum_y p_{X,Y}(x,y)$. 3. For continuous variables, add by integration: $f_X(x)=\int f_{X,Y}(x,y)\,dy$. 4. The resulting marginal sums or integrates to $1$ because the joint does.

**Symbols.** $p_X$ and $f_X$ are marginals; $y$ is the variable removed.

**Real-World Applications (§5).**
1. **Joint table** row sums give $P(X=0)=0.5$, $P(X=1)=0.5$.
2. **Column sums** give $P(Y=0)=0.3$, $P(Y=2)=0.7$.
3. **Continuous square** marginal of uniform unit square is $1$ on $[0,1]$.
4. **Customer segment** marginal sums campaign responses across devices.
5. **Image pixels** marginal color distribution sums over positions.
6. **Joint labels** 3 by 4 table marginal has 3 row probabilities.

---

### `math-17-27` — Conditional distributions  · AUTHOR derivation

**Connections (§1).**
> Conditional distributions combine joint and marginal distributions. They give the full distribution of one variable after another variable has been observed. This extends conditional probability from single events to all values of a random variable. It is used in Bayesian classifiers, regression, Gaussian conditioning, and conditional expectation.

**Motivation & Intuition (§2).**
> Knowing Y=y changes the relevant part of the joint distribution. Only the slice of the joint model at that value of Y remains, and it must be renormalized so probabilities over X sum to one. That normalized slice is the conditional distribution.
>
> The formula mirrors ordinary conditional probability. The numerator is the joint mass or density for the specific pair, and the denominator is the total marginal mass or density of the condition. This denominator is what makes the conditional distribution a proper distribution over X.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Start with conditional probability for events: $P(X=x\mid Y=y)=P(X=x,Y=y)/P(Y=y)$. 2. Replace the numerator with joint mass $p_{X,Y}(x,y)$. 3. Replace denominator with marginal $p_Y(y)$. 4. Get $p_{X\mid Y}(x\mid y)=p_{X,Y}(x,y)/p_Y(y)$. 5. For densities, use the same ratio $f_{X\mid Y}=f_{X,Y}/f_Y$ where $f_Y(y)>0$.

**Symbols.** $p_{X\mid Y}$ conditional pmf; $f_{X\mid Y}$ conditional density; $p_Y(y)$ normalizing marginal.

**Real-World Applications (§5).**
1. **Joint table** gives $P(X=1\mid Y=2)=0.3/0.7=0.4286$.
2. **Given $Y=0$**, $P(X=0\mid Y=0)=0.1/0.3=0.3333$.
3. **Bayes classifier** uses $P(\text{class}\mid\text{features})$.
4. **Recommendation** uses item distribution conditional on user segment.
5. **Conditional Gaussian** narrows uncertainty after an observation.
6. **Confusion matrix recall** $P(\hat Y=1\mid Y=1)=TP/(TP+FN)$.

---

### `math-17-28` — Independence of random variables  · AUTHOR derivation

**Connections (§1).**
> Independence of random variables extends independence of events to full distributions. Instead of one event leaving another event unchanged, every value of one variable leaves the distribution of the other unchanged. The joint distribution then factors into the product of marginals. This factorization simplifies sums, MGFs, convolution, and limit theorems.

**Motivation & Intuition (§2).**
> Random variables can be unrelated in a stronger sense than merely having zero covariance. If X and Y are independent, observing Y gives no distributional information about X. Every conditional distribution of X is the same as its marginal distribution.
>
> The product form is the practical test. In a joint table, each cell must equal the row marginal times the column marginal. In a density, the joint surface must factor into one function of x times one function of y. When this fails, the variables carry dependence information.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Independence means $P(X=x\mid Y=y)=P(X=x)$ for all relevant $x,y$. 2. Substitute the conditional formula $p_{X,Y}(x,y)/p_Y(y)=p_X(x)$. 3. Multiply by $p_Y(y)$ to get $p_{X,Y}(x,y)=p_X(x)p_Y(y)$. 4. The density version uses the same factorization with $f$.

**Symbols.** $X\perp Y$ means independent; $p_X,p_Y$ are marginals.

**Real-World Applications (§5).**
1. **Two fair dice**: $P(2,5)=1/36=(1/6)(1/6)$.
2. **Joint table check**: if marginals are $0.5,0.5$ and $0.3,0.7$, independent cell $(1,2)$ would be $0.35$, not $0.3$.
3. **Feature independence** in Naive Bayes multiplies likelihoods.
4. **Independent normals** have diagonal covariance matrix.
5. **Independent Bernoulli $0.2,0.3$** both succeed with $0.06$.
6. **A product density** $2x\cdot3y^2$ on unit square factors into marginals.

---

### `math-17-29` — Covariance  · AUTHOR derivation

**Connections (§1).**
> Covariance is the first numeric summary of how two variables move together. It uses centered variables, so it measures joint deviations from their means. Positive, negative, and zero covariance describe different kinds of linear co-movement. This lesson prepares for correlation, covariance matrices, and the multivariate Gaussian.

**Motivation & Intuition (§2).**
> To compare movement, each variable is first measured relative to its own mean. When both centered values are usually positive together or negative together, their product tends to be positive. When one is often above its mean while the other is below, the product tends to be negative.
>
> Averaging those centered products gives covariance. Its sign is easy to interpret, but its units depend on the units of both variables. That is why the next lesson rescales covariance into correlation for comparisons across different measurement scales.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Define covariance as $\operatorname{Cov}(X,Y)=E[(X-\mu_X)(Y-\mu_Y)]$. 2. Expand the product: $XY-X\mu_Y-Y\mu_X+\mu_X\mu_Y$. 3. Take expectation term by term. 4. Use $E[X]=\mu_X$ and $E[Y]=\mu_Y$. 5. Get $\operatorname{Cov}(X,Y)=E[XY]-\mu_X\mu_Y$.

**Symbols.** $\mu_X,\mu_Y$ are means; $E[XY]$ is expected product.

**Real-World Applications (§5).**
1. **Joint table** example has $E[X]=0.5$, $E[Y]=1.4$, $E[XY]=0.6$, covariance $-0.1$.
2. **Independent variables** have covariance $0$.
3. **Portfolio** variance uses $2\operatorname{Cov}(X,Y)$.
4. **Feature redundancy**: positive covariance flags similar movement.
5. **Centered vectors**: average product of centered columns is sample covariance.
6. **Scale effect**: $\operatorname{Cov}(2X,Y)=2\operatorname{Cov}(X,Y)$.

---

### `math-17-30` — Correlation  · AUTHOR derivation

**Connections (§1).**
> Correlation turns covariance into a unitless measure of linear association. It standardizes both variables before measuring their average product. The result always lies between negative one and one, making comparisons easier across different units. Correlation is used in feature screening, portfolio analysis, and covariance-matrix interpretation.

**Motivation & Intuition (§2).**
> Covariance changes when variables are rescaled, so its magnitude is hard to compare across contexts. Dividing by the two standard deviations removes the units. The result measures association after both variables have been put on standard-deviation scale.
>
> The bound between negative one and one comes from Cauchy-Schwarz applied to the standardized variables. Values near one or negative one indicate strong linear alignment, while zero means no linear association. Zero correlation alone does not rule out nonlinear dependence.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Standardize variables: $Z_X=(X-\mu_X)/\sigma_X$ and $Z_Y=(Y-\mu_Y)/\sigma_Y$. 2. Take covariance of standardized variables. 3. Constants factor out, giving $E[Z_XZ_Y]=\operatorname{Cov}(X,Y)/(\sigma_X\sigma_Y)$. 4. Cauchy-Schwarz gives $|E[Z_XZ_Y]|\le\sqrt{E[Z_X^2]E[Z_Y^2]}=1$, so correlation is between $-1$ and $1$.

**Symbols.** $\rho$ correlation; $\sigma_X,\sigma_Y$ standard deviations.

**Real-World Applications (§5).**
1. **Covariance $6$, sds $2$ and $3$** gives $\rho=1$.
2. **Covariance $-1$, sds $2$ and $4$** gives $\rho=-0.125$.
3. **Feature screening** uses $|\rho|>0.9$ for near-duplicates.
4. **Zero correlation** means no linear association, not full independence.
5. **Portfolio pairs** with $\rho=-0.5$ diversify more than $\rho=0.8$.
6. **Units vanish** when centimeters are converted to meters.

---

### `math-17-31` — Transformations of random variables  · AUTHOR derivation

**Connections (§1).**
> Transformations create new random variables from old ones. They are used when shifting, scaling, standardizing, logging, squaring, or otherwise re-expressing a quantity. For densities, probability must be preserved while the horizontal scale changes. This is the basis of change-of-variables calculations in continuous probability.

**Motivation & Intuition (§2).**
> If Y is defined as a function of X, probabilities for Y must come from the corresponding probabilities for X. A shift moves the distribution, a scale stretches it, and nonlinear transformations can bend or fold the support. The distribution changes even though the underlying probability mass is conserved.
>
> For a one-to-one differentiable transformation, matching small intervals have the same probability. If the transformation stretches the horizontal axis, the density height must shrink, and if it compresses the axis, the density height must grow. The Jacobian factor records that stretch.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Let $Y=g(X)$ with one-to-one differentiable $g$. 2. Equal probabilities in matching small intervals: $f_Y(y)dy=f_X(x)dx$. 3. Since $x=g^{-1}(y)$, divide by $dy$ to get $f_Y(y)=f_X(g^{-1}(y))\left|\frac{d}{dy}g^{-1}(y)\right|$. 4. The absolute derivative is the Jacobian scale factor.

**Symbols.** $g$ transformation; $g^{-1}$ inverse; Jacobian is the stretch factor.

**Real-World Applications (§5).**
1. **Scale** $Y=2X$ for uniform $[0,1]$ gives uniform $[0,2]$ with density $0.5$.
2. **Shift** $Y=X+3$ shifts mean by $3$.
3. **Square** $Y=X^2$ needs two preimages except at $0$.
4. **Log transform**: if $Y=e^X$, density includes $1/y$.
5. **Standardization** $Z=(X-\mu)/\sigma$ gives unitless values.
6. **Variance scaling**: $\operatorname{Var}(2X+1)=4\operatorname{Var}(X)$.

---

### `math-17-32` — Sums of random variables and convolution  · AUTHOR derivation

**Connections (§1).**
> Sums of random variables combine probability distributions. A target sum can be produced by many pairs of component values, so all matching pairs must be accounted for. Convolution is the operation that performs this accounting. It appears in dice sums, noise addition, delivery times, Poisson rates, and normal sums.

**Motivation & Intuition (§2).**
> When Z equals X plus Y, the event Z=z is not usually a single event in the joint space. It includes every combination where X takes one value and Y supplies the remaining amount. For dice, a sum of seven comes from several ordered pairs.
>
> Convolution adds the probability of each matching pair. Independence simplifies the joint probability into a product of marginal probabilities. In continuous models, the same idea becomes an integral over all ways to split the total z into x and z minus x.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. For discrete $Z=X+Y$, event $Z=z$ is the disjoint union over $x$ of $X=x$ and $Y=z-x$. 2. Add the joint probabilities. 3. If $X,Y$ are independent, joint mass factors. 4. Therefore $p_Z(z)=\sum_xp_X(x)p_Y(z-x)$. 5. For densities, replace the sum by $f_Z(z)=\int f_X(x)f_Y(z-x)\,dx$.

**Symbols.** $Z=X+Y$; convolution is the sum/integral over matching pairs.

**Real-World Applications (§5).**
1. **Two dice sum 7**: $6/36=1/6$.
2. **Two fair coins heads count** has masses $1/4,1/2,1/4$.
3. **Poisson rates 2 and 5** sum to Poisson rate $7$.
4. **Independent normals** add variances: $4+9=13$.
5. **Delivery time** as packing plus shipping uses convolution.
6. **Ensemble error** sums independent noise variances.

---

### `math-17-33` — Conditional expectation  · AUTHOR derivation

**Connections (§1).**
> Conditional expectation summarizes a conditional distribution by its average. It combines the conditional-distribution idea with expectation. When the condition is random, the conditional expectation is itself a random variable that changes with the observed information. This leads directly to the law of total expectation and to prediction as conditional averaging.

**Motivation & Intuition (§2).**
> After observing information such as a segment, feature bin, or class, the distribution of X may change. Conditional expectation gives the center of that updated distribution. It is the best single average to use within that condition.
>
> The law of total expectation says that averaging conditional averages over the cases returns the overall average. This is a consistency rule: first average within each group, then weight by group frequency. It is the expectation counterpart of the law of total probability.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. For a fixed condition $Y=y$, use the conditional distribution of $X$. 2. Average with those conditional probabilities: $E[X\mid Y=y]=\sum_xx p_{X\mid Y}(x\mid y)$. 3. To derive total expectation, average these conditional means over $Y$: $E[E[X\mid Y]]=\sum_y E[X\mid Y=y]P(Y=y)$. 4. Substitute the conditional sum and simplify to $\sum_xxP(X=x)=E[X]$.

**Symbols.** $E[X\mid Y]$ is the conditional mean as a function of $Y$.

**Real-World Applications (§5).**
1. **Segment revenue**: mobile mean $5$ with weight $0.6$, desktop mean $8$ with weight $0.4$ gives overall $6.2$.
2. **Risk score** averages labels within a feature bin.
3. **Joint table** gives $E[X\mid Y=2]=0.3/0.7=0.4286$.
4. **Dice given even** has mean $(2+4+6)/3=4$.
5. **Forecast calibration** checks average outcome at predicted $0.7$.
6. **Queue time** conditioned on priority class creates class-specific averages.

---

### `math-17-34` — Markov's inequality  · AUTHOR derivation

**Connections (§1).**
> Markov’s inequality is a broad tail bound for nonnegative random variables. It uses only the mean and does not require a distributional shape. Because it assumes so little, the bound can be loose, but it is widely applicable. It also serves as the main ingredient for Chebyshev’s inequality.

**Motivation & Intuition (§2).**
> For a nonnegative variable to be very large with high probability, its mean must also be large. Markov’s inequality formalizes that basic constraint. If the mean is small, the probability of exceeding a much larger threshold cannot be too high.
>
> The proof isolates the contribution to the expectation from the tail event. On the event X is at least a, each outcome contributes at least a to the average. That forces the mean to be at least a times the tail probability, which gives the bound after division.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Assume $X\ge0$. 2. On event $X\ge a$, the value of $X$ is at least $a$. 3. Therefore $E[X]$ is at least the contribution from that event: $E[X]\ge aP(X\ge a)$. 4. Divide by $a>0$ to get $P(X\ge a)\le E[X]/a$.

**Symbols.** $a$ threshold; $E[X]$ mean; require $X\ge0$.

**Real-World Applications (§5).**
1. **Runtime** mean 100 ms: $P(X\ge500)\le0.2$.
2. **Loss** mean 0.4: $P(L\ge2)\le0.2$.
3. **Queue length** mean 3: $P(Q\ge10)\le0.3$.
4. **Spend** mean $50$: $P(S\ge200)\le0.25$.
5. **Gradient norm squared** mean 0.01: $P(\|g\|^2\ge0.1)\le0.1$.
6. **Nonnegative error** mean 0.02: $P(E\ge0.1)\le0.2$.

---

### `math-17-35` — Chebyshev's inequality  · AUTHOR derivation

**Connections (§1).**
> Chebyshev’s inequality strengthens the basic tail-bound idea by using variance. It applies to deviations from the mean and does not assume normality or any particular distribution shape. The result explains how smaller variance forces more concentration around the mean. It is also the key proof tool for the Law of Large Numbers in this section.

**Motivation & Intuition (§2).**
> Variance measures the average squared distance from the mean. If many outcomes were far from the mean, that average squared distance would have to be large. Chebyshev’s inequality turns this observation into a bound on the probability of a large deviation.
>
> The proof applies Markov’s inequality to the nonnegative squared deviation. The event of being at least a away from the mean is exactly the event that the squared deviation is at least a squared. This converts a variance statement into a probability tail bound.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Let $Y=(X-\mu)^2$, which is nonnegative. 2. Event $|X-\mu|\ge a$ is the same as $Y\ge a^2$. 3. Apply Markov: $P(Y\ge a^2)\le E[Y]/a^2$. 4. Use $E[Y]=\operatorname{Var}(X)=\sigma^2$. 5. Get $P(|X-\mu|\ge a)\le\sigma^2/a^2$.

**Symbols.** $\mu$ mean; $\sigma^2$ variance; $a$ distance from mean.

**Real-World Applications (§5).**
1. **Mean 100, sd 15, distance 30**: bound $225/900=0.25$.
2. **Within 2 sd** has probability at least $0.75$.
3. **Within 3 sd** at least $0.8889$.
4. **Estimator sd 0.05**: error over $0.2$ bounded by $0.0625$.
5. **Queue mean 10, sd 4**: outside 8 units bounded by $0.25$.
6. **Model metric sd 0.01**: deviation over $0.05$ bounded by $0.04$.

---

### `math-17-36` — Jensen's inequality  · AUTHOR derivation

**Connections (§1).**
> Jensen’s inequality connects probability with convexity. It compares applying a function after averaging with averaging after applying the function. This is important whenever nonlinear losses, utilities, penalties, or transformations appear. It also explains common inequalities involving squares, absolute values, logarithms, and square roots.

**Motivation & Intuition (§2).**
> Linear functions commute with averaging, but curved functions generally do not. For a convex function, the graph lies below the chord between two points. That geometry implies that applying the function to an average is no larger than averaging the function values.
>
> The probability version treats the weights in a convex combination as probabilities. A random variable is an average over its possible values, and the inequality compares two orders of operation. Concave functions reverse the direction, which is why logarithms and square roots behave differently from squares.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. For two points, convexity says $f(\lambda x+(1-\lambda)y)\le\lambda f(x)+(1-\lambda)f(y)$. 2. Interpret $\lambda$ and $1-\lambda$ as probabilities of a two-valued random variable. 3. Then the left side is $f(E[X])$ and the right side is $E[f(X)]$. 4. Approximate a general distribution by finite weighted points and take limits to get $f(E[X])\le E[f(X)]$ for convex $f$.

**Symbols.** $f$ convex; $\lambda$ weight; $E$ expectation.

**Real-World Applications (§5).**
1. **Square loss**: $E[X^2]\ge(E[X])^2$.
2. **Log utility** is concave, so $E[\log X]\le\log E[X]$.
3. **Sqrt concavity**: average of $\sqrt1$ and $\sqrt9$ is $2$, while $\sqrt5=2.2361$.
4. **Risk penalty**: variance appears because squared average error is below average squared error.
5. **ELBO style**: concavity of log moves expectation inside as an upper direction.
6. **Absolute value**: $E|X|\ge|E[X]|$.

---

### `math-17-37` — The Law of Large Numbers  · AUTHOR derivation

**Connections (§1).**
> The Law of Large Numbers turns expectation into an observable long-run average. It uses independence, variance, and Chebyshev’s inequality to show that sample averages stabilize near the true mean. This result justifies estimating population means with repeated samples. It also sets up the Central Limit Theorem, which describes the remaining fluctuation around the mean.

**Motivation & Intuition (§2).**
> Each observation contains noise, but averaging independent observations reduces that noise. The mean of the average remains the true mean, while the variance of the average shrinks by a factor of n. This is the mathematical reason repeated measurements become more stable.
>
> Chebyshev’s inequality converts the shrinking variance into a probability statement. For any fixed tolerance, the probability that the sample average misses the mean by at least that tolerance goes to zero. The theorem says convergence happens in probability, not that every finite sample equals the mean.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Let $\bar X_n=(X_1+\cdots+X_n)/n$ with independent variables of mean $\mu$ and variance $\sigma^2$. 2. Linearity gives $E[\bar X_n]=\mu$. 3. Independence gives $\operatorname{Var}(\bar X_n)=\frac{1}{n^2}n\sigma^2=\sigma^2/n$. 4. Apply Chebyshev: $P(|\bar X_n-\mu|\ge\epsilon)\le\sigma^2/(n\epsilon^2)$. 5. As $n\to\infty$, the bound goes to $0$, proving convergence in probability.

**Symbols.** $\bar X_n$ sample average; $\epsilon$ tolerance; $n$ sample size.

**Real-World Applications (§5).**
1. **Coin flips** with $p=0.5$, $n=10000$, sd of sample proportion is $0.005$.
2. **Ratings** variance 4, $n=400$, average variance $0.01$.
3. **Monte Carlo** variance 9, $n=900$, standard error $0.1$.
4. **A/B metric** more users shrink noise like $1/\sqrt n$.
5. **Manufacturing** average fill weight stabilizes across batches.
6. **Dice average** converges to $3.5$.

---

### `math-17-39` — Hoeffding's inequality  · AUTHOR derivation

**Connections (§1).**
> Hoeffding’s inequality is a concentration bound for averages of independent bounded variables. It uses more information than Chebyshev’s inequality, because boundedness limits how much any one observation can move the average. In return, it gives an exponential tail bound. This is useful for bounded losses, validation accuracy, click rates, and Monte Carlo estimates.

**Motivation & Intuition (§2).**
> When each observation is trapped inside a fixed interval, large deviations of the average require many observations to lean in the same direction. Independence makes that coordinated movement increasingly unlikely as n grows. Hoeffding’s inequality quantifies this decay.
>
> The proof strategy uses exponential moments rather than only variance. Center the variables, bound each centered MGF using the range, multiply the bounds by independence, and apply Chernoff’s method. Optimizing the exponential bound gives a probability that shrinks like an exponential in n epsilon squared.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Let independent $X_i\in[a_i,b_i]$ and $\bar X$ be their average. 2. Center each variable by its mean so the average deviation is a sum of bounded centered terms. 3. Hoeffding's lemma bounds the MGF of each centered term by an exponential quadratic in its range. 4. Multiply MGFs using independence. 5. Apply Chernoff's method $P(S\ge t)\le e^{-\lambda t}E[e^{\lambda S}]$. 6. Optimize over $\lambda$ to get $P(\bar X-E\bar X\ge\epsilon)\le\exp(-2n\epsilon^2/(b-a)^2)$ for common range $[a,b]$; double it for two-sided deviation.

**Symbols.** $[a,b]$ bounded range; $\epsilon$ deviation; $n$ sample size.

**Real-World Applications (§5).**
1. **Coin average**: $n=100$, $\epsilon=0.1$ gives two-sided bound $0.2707$.
2. **Ratings in [1,5]**: range 4 changes denominator to 16.
3. **Bounded loss [0,1]** with $n=1000$, $\epsilon=0.05$ gives bound $0.0135$.
4. **A/B click rate** uses bounded Bernoulli outcomes.
5. **Monte Carlo bounded payoff** certifies sample error.
6. **Validation accuracy**: $n=10{,}000$, $\epsilon=0.01$ bound is $2e^{-2}=0.2707$.

---

### `math-17-40` — The multivariate Gaussian  · AUTHOR derivation

**Connections (§1).**
> The multivariate Gaussian extends the normal distribution from one real-valued variable to a random vector. The mean becomes a vector, and variance becomes a covariance matrix. This matrix controls scale, correlation, and the directions of spread. The lesson connects Gaussian density, transformations, covariance, correlation, and Mahalanobis distance.

**Motivation & Intuition (§2).**
> A vector-valued measurement often has components that vary together. Modeling each coordinate separately loses information about correlation and joint spread. The multivariate Gaussian keeps that information through the covariance matrix.
>
> The construction starts from independent standard normal coordinates and applies a linear transformation. The transformation shifts the center to the mean vector and reshapes the spherical standard normal into an ellipsoid determined by Sigma. The density must include both the quadratic Mahalanobis distance and the determinant factor that accounts for volume scaling.

**Definition & Assumptions (§3).** The verified derivation is kept unchanged.

**Derive (complete).** 1. Start with $Z\sim\mathcal N(0,I_d)$ having density $(2\pi)^{-d/2}\exp(-z^Tz/2)$. 2. Build $X=\mu+LZ$ where $LL^T=\Sigma$. 3. Solve $z=L^{-1}(x-\mu)$, so $z^Tz=(x-\mu)^T\Sigma^{-1}(x-\mu)$. 4. The change of variables contributes $|\det L|^{-1}=|\Sigma|^{-1/2}$. 5. Therefore $f(x)=\frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}}\exp[-\frac12(x-\mu)^T\Sigma^{-1}(x-\mu)]$.

**Symbols.** $\mu$ mean vector; $\Sigma$ covariance matrix; $|\Sigma|$ determinant; quadratic form is squared Mahalanobis distance.

**Real-World Applications (§5).**
1. **2-D covariance** $\begin{bmatrix}4&1\\1&9\end{bmatrix}$ has determinant $35$.
2. **At the mean**, density is $1/(2\pi\sqrt{35})=0.0269$.
3. **For $x=(2,3),\mu=0$**, quadratic form is $12/7=1.7143$.
4. **Independent coordinates** make $\Sigma$ diagonal.
5. **Correlation** from covariance 1 and sds 2,3 is $1/6=0.1667$.
6. **Mahalanobis radius** $r^2=5.99$ gives the common 95% ellipse in 2-D.

---

## Build order

1. **Foundation language:** author `math-17-01` through `math-17-08` first so all event, conditioning, total-probability, and Bayes language is stable.
2. **Random-variable machinery:** author `math-17-09` through `math-17-16`, keeping sums/integrals and moment identities consistent.
3. **Named distributions:** author `math-17-17` through `math-17-24`, verifying each pmf/pdf moment and tail number.
4. **Joint probability:** author `math-17-25` through `math-17-33`, using one small joint table repeatedly for marginal, conditional, independence, covariance, and conditional-expectation checks.
5. **Inequalities and limits:** author `math-17-34` through `math-17-39`, with `math-17-38` as the prose model and characteristic-function derivation.
6. **Vector probability finish:** author `math-17-40` last, after covariance/correlation are already defined.

**Completion report:** 40 / 40 lessons covered; 36 derivation lessons and 4 explain-only concept lessons; 0 genuine LaTeX bugs flagged.
