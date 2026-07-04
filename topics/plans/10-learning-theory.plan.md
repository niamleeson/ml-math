# Lesson Plan — 10 Learning Theory

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Formula/Theorem |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 45–60 min |
| Source topic file | ../10-learning-theory.md |

## Part 1 — Overview (plan)
Learning theory explains when low training error is evidence of low test error, and how confidence depends on sample size, hypothesis-class size, and model capacity. Hook: generalization is a probability statement, not a wish — bounds make the assumptions explicit.

## Part 2 — Key Idea (plan)
- **Focus (per category = Formula/Theorem):** statement + quick derivation of finite-class and VC-style generalization bounds from union bound, Hoeffding inequality, empirical risk, PAC assumptions, shattering, and VC dimension.
- **Core artifacts to present:** union bound $P(\cup_i A_i)\le\sum_iP(A_i)$; Hoeffding $P(|\phi-\hat\phi|>\gamma)\le2\exp(-2\gamma^2m)$; empirical error $\hat\epsilon(h)=\frac1m\sum_i\mathbf1_{\{h(x^{(i)})\ne y^{(i)}\}}$; PAC iid/same-distribution assumptions; finite-class bound $\epsilon(\hat h)\le\min_h\epsilon(h)+2\sqrt{\frac{1}{2m}\log\frac{2k}{\delta}}$; shattering definition; VC dimension; Vapnik-style bound $O(\sqrt{\frac dm\log(m/d)+\frac1m\log(1/\delta)})$.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|
| E1 | Apply the union bound to three bad events | $P(A_1)=0.02$, $P(A_2)=0.04$, $P(A_3)=0.01$ | Compute an upper bound on any bad event and discuss why overlap makes it conservative |
| E2 | Hoeffding sample-size calculation | Bernoulli classifier estimate, target $\gamma=0.05$, confidence $1-\delta=0.95$ | Solve $2e^{-2\gamma^2m}\le\delta$ for $m$ step by step |
| E3 | Compute empirical training error | 10 predictions with 2 mistakes | Evaluate $\hat\epsilon(h)=\frac1m\sum_i\mathbf1\{h(x_i)\ne y_i\}$ |
| E4 | Finite hypothesis class penalty | $k=100$, $m=1000$, $\delta=0.05$, best training error $0.08$ | Plug into the finite-class bound and interpret the additive term |
| E5 | Check PAC assumptions | Mini story with train data from one distribution and test data from another | Identify violated iid/same-distribution assumptions and why the bound no longer applies |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|
| A1 | Derive the finite-class uniform convergence bound | Hoeffding for one $h$, class size $k$, failure probability $\delta$ | Use union bound over $\mathcal H$, solve for $\gamma$, and connect to all hypotheses simultaneously |
| A2 | From uniform convergence to ERM excess error | Bound $|\epsilon(h)-\hat\epsilon(h)|\le\gamma$ for all $h$ | Prove $\epsilon(\hat h)\le\min_h\epsilon(h)+2\gamma$ by chaining inequalities |
| A3 | Shattering three points with 2-D linear classifiers | Three non-collinear points and all $2^3$ labelings | Construct separating lines for each labeling pattern; conclude VC dimension at least 3 |
| A4 | Why four planar points are not always shattered by lines | Four points in convex position with alternating labels | Show the XOR labeling cannot be linearly separated; conclude VC dimension of 2-D linear classifiers is not 4 |
| A5 | Compare finite-class and VC-style bounds numerically | $k=10^6$, $d=10$, $m=5000$, $\delta=0.01$ | Compute/order the complexity terms and explain when VC bounds are preferable for infinite classes |

## Part 4 — Colab Notebook
N/A — 🧮 numeric topic (no notebook).

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** use the union bound; compute a Hoeffding probability; calculate empirical error; define PAC assumptions; identify whether a set is shattered from a simple picture.
- **🔴 Hard (5) — themes:** derive a sample-complexity inequality; prove the ERM excess-error step; reason about VC dimension of intervals or linear classifiers; compare two hypothesis classes by capacity; explain how increasing $m$, $d$, $k$, or $\delta$ changes a bound.
