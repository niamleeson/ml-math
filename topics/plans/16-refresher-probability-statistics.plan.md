# Lesson Plan — 16 Refresher: Probability & Statistics

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Formula |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 50–70 min |
| Source topic file | ../16-refresher-probability-statistics.md |

## Part 1 — Overview (plan)
This refresher rebuilds the probability and statistics toolkit used throughout ML. Hook: most ML formulas are expectations, conditioning, variance/covariance, or estimation written in compact notation.

## Part 2 — Key Idea (plan)
- **Focus (per category = Formula):** formula statements with quick derivations and careful interpretation of conditions.
- **Core artifacts to present:** probability axioms; permutations $P(n,r)=n!/(n-r)!$ and combinations $C(n,r)=n!/[r!(n-r)!]$; Bayes' rule and partition form; independence; CDF/PDF/PMF relationships; expectation, $E[g(X)]$, moments, characteristic functions; variance $E[X^2]-E[X]^2$; transformations $f_Y(y)=f_X(x)|dx/dy|$; Leibniz integral rule; Chebyshev's inequality; joint/marginal/conditional densities; covariance and correlation; common distributions; estimator bias; sample mean/variance; CLT.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| E1 | Count ordered vs unordered selections | choose 3 students from 8 for president/VP/secretary vs committee | compute $P(8,3)$ and $C(8,3)$ and explain why order changes the count |
| E2 | Bayes' rule for a medical test | prevalence 1%, sensitivity 95%, specificity 90% | compute $P(\text{disease}\mid +)$ using total probability in the denominator |
| E3 | Expectation and variance of a discrete random variable | $X\in\{0,1,2\}$ with probabilities $.2,.5,.3$ | compute $E[X]$, $E[X^2]$, $Var(X)$, and $\sigma$ |
| E4 | CDF differences for interval probability | CDF values $F(1)=.25,F(3)=.80$ | compute $P(1<X\le 3)=F(3)-F(1)$ and state the endpoint convention |
| E5 | Covariance and correlation by hand | three paired observations $(1,2),(2,4),(3,3)$ | compute means, centered products, covariance, standard deviations, and correlation |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| A1 | Extended Bayes with three hypotheses | partition priors $.5,.3,.2$ and likelihoods $.1,.4,.8$ | compute posterior for each hypothesis by normalizing likelihood × prior |
| A2 | Transform a uniform random variable | $X\sim U(0,1)$, $Y=X^2$ | derive $F_Y(y)$ and then $f_Y(y)=1/(2\sqrt y)$ using transformation logic |
| A3 | Marginalize and condition from a joint table | 2×3 joint PMF for $X,Y$ | compute marginals, conditional probabilities, and test independence |
| A4 | Chebyshev bound from mean and variance | $\mu=50$, $\sigma=5$, ask $P(|X-50|\ge 15)$ | apply $k=3$ and interpret the conservative upper bound |
| A5 | Estimator bias and CLT standard error | sample size $n=64$, population $\mu=10$, $\sigma=8$; compare variance estimators with $1/n$ vs $1/(n-1)$ | show the unbiased sample variance idea and compute $\bar X\approx N(10,1)$ |

## Part 4 — Colab Notebook (omit if 🧮)
N/A — 🧮 numeric topic (no notebook).

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** compute permutations/combinations; apply basic Bayes; calculate expectation/variance; use CDF to find interval probability; compute covariance/correlation from a small table.
- **🔴 Hard (5) — themes:** use partition-form Bayes; derive a transformed density; marginalize a joint distribution and test independence; apply Chebyshev carefully; analyze estimator bias and CLT scaling.
