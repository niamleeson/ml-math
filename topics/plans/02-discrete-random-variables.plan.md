# Lesson Plan — 02 Discrete Random Variables

| Field | Value |
|---|---|
| Source | Probability (MIT) |
| Content category | Distributions/Formula |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 40–55 min |
| Source topic file | ../02-discrete-random-variables.md |

## Part 1 — Overview (plan)
Discrete random variables turn outcomes into numbers, so probability questions become PMFs, expectations, variances, and conditional distributions. Hook: once the PMF is known, almost every summary is a weighted sum.

## Part 2 — Key Idea (plan)
- **Focus (per category = Distributions/Formula):** PMF definitions and named distributions with mean/variance; derive expectations, variances, conditioning, joint PMFs, independence, and transformations by summing over support points.
- **Core artifacts to present:** random variable $X:\Omega\to\mathbb{R}$; PMF $p_X(x)=\mathbb{P}(X=x)$ with $p_X(x)\ge0$ and $\sum_xp_X(x)=1$; Bernoulli, discrete uniform, binomial, geometric PMFs; $\mathbb{E}[X]=\sum_x xp_X(x)$; expected value rule $\mathbb{E}[g(X)]=\sum_x g(x)p_X(x)$; $\operatorname{Var}(X)=\mathbb{E}[X^2]-(\mathbb{E}[X])^2$; conditional PMF; total expectation; geometric memorylessness; joint/marginal PMFs; $p_{X\mid Y}(x\mid y)$; independence; $\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y]$ and variance additivity under independence.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| E1 | Validate and summarize a PMF | $X\in\{0,1,2,3\}$ with probabilities $(0.1,0.2,0.4,0.3)$ | Check normalization; compute $\mathbb{P}(X\ge2)$, $\mathbb{E}[X]$, and $\mathbb{E}[X^2]$. |
| E2 | Bernoulli as an indicator | Event $A$ has probability $0.35$; $I_A=1$ if $A$ occurs | Show $I_A\sim\operatorname{Ber}(0.35)$; derive $\mathbb{E}[I_A]=\mathbb{P}(A)$ and variance $p(1-p)$. |
| E3 | Binomial probability and mean | $X\sim\operatorname{Bin}(5,0.4)$ | Compute $\mathbb{P}(X=2)$ using $\binom ni p^i(1-p)^{n-i}$; compute $\mathbb{E}[X]=np$ and $\operatorname{Var}(X)=np(1-p)$. |
| E4 | Geometric waiting time | $X\sim\operatorname{Geo}(0.2)$ | Compute $\mathbb{P}(X=4)$, $\mathbb{P}(X>4)$, $\mathbb{E}[X]=1/p$, and interpret trials until first success. |
| E5 | Expected value rule for a function | $X\in\{-1,0,2\}$ with probabilities $(0.2,0.5,0.3)$; $g(x)=x^2+1$ | Compute $\mathbb{E}[g(X)]$ directly and compare with $g(\mathbb{E}[X])$ to show nonlinearity. |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| A1 | Conditional PMF after truncation | $X\sim\operatorname{Bin}(4,0.5)$; condition on $A=\{X\ge2\}$ | Renormalize $p_X(x)$ on $A$; compute $p_{X\mid A}$ and $\mathbb{E}[X\mid A]$. |
| A2 | Total expectation through a partition | Machine state $Y\in\{\text{normal},\text{rush}\}$ with probabilities $(0.7,0.3)$; $\mathbb{E}[X\mid Y]=(2,5)$ | Use $\mathbb{E}[X]=\sum_y p_Y(y)\mathbb{E}[X\mid Y=y]$ and interpret mixture averages. |
| A3 | Joint PMF to marginals and conditional expectation | Table for $X\in\{0,1,2\}$, $Y\in\{0,1\}$ with entries $\begin{smallmatrix}0.10&0.20\\0.15&0.25\\0.05&0.25\end{smallmatrix}$ | Sum rows/columns for marginals; compute $p_{X\mid Y}(x\mid1)$ and $\mathbb{E}[X\mid Y=1]$. |
| A4 | Independence test and product expectation | A joint PMF for two binary variables with entries $p_{00}=0.28,p_{01}=0.12,p_{10}=0.42,p_{11}=0.18$ | Check whether $p_{X,Y}=p_Xp_Y$ for all cells; if independent, verify $\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y]$. |
| A5 | Variance of a sum of Bernoulli variables | $X_1,\ldots,X_n$ independent $\operatorname{Ber}(p)$ and $S=\sum_iX_i$ | Derive binomial mean/variance from linearity and variance additivity; contrast with what fails if variables are dependent. |

## Part 4 — Colab Notebook (omit if 🧮)
N/A — 🧮 numeric topic (no notebook).

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** read a PMF table; compute Bernoulli/binomial/geometric probabilities; calculate expectation; calculate variance via $\mathbb{E}[X^2]-(\mathbb{E}[X])^2$; transform a PMF under a simple function.
- **🔴 Hard (5) — themes:** derive a conditional PMF; use total expectation; marginalize a joint PMF; prove or disprove independence; derive variance of a sum under independence and identify dependence pitfalls.
