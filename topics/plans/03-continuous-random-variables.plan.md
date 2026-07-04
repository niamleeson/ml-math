# Lesson Plan — 03 Continuous Random Variables

| Field | Value |
|---|---|
| Source | Probability (MIT) |
| Content category | Distributions/Formula |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 50–65 min |
| Source topic file | ../03-continuous-random-variables.md |

## Part 1 — Overview (plan)
Continuous probability replaces sums with integrals: PDFs give density, CDFs give accumulated probability, and expectations are areas weighted by values. Hook: a point can have probability zero while intervals around it still have positive probability.

## Part 2 — Key Idea (plan)
- **Focus (per category = Distributions/Formula):** PDF/CDF mechanics, named continuous distributions, conditioning, joint densities, transformations, convolution, covariance/correlation, and laws of total expectation/variance.
- **Core artifacts to present:** PDF conditions $f_X(x)\ge0$, $\int f_X=1$; interval probability $\int_a^b f_X(x)dx$; $\mathbb{E}[X]=\int xf_X(x)dx$; $\operatorname{Var}(X)=\int(x-\mu)^2f_X(x)dx$; uniform, exponential, normal PDFs and means/variances; CDF $F_X(x)=\int_{-\infty}^xf_X(t)dt$ and $f_X=F_X'$; conditional PDF; joint PDF and marginals; $f_{X\mid Y}=f_{X,Y}/f_Y$; independence; change-of-variables $f_Y(y)=f_X(h(y))|h'(y)|$; convolution $f_Z(z)=\int f_X(x)f_Y(z-x)dx$; covariance/correlation; law of iterated expectation and total variance.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| E1 | Validate a triangular PDF | $f_X(x)=cx$ for $0\le x\le2$, $0$ otherwise | Solve for $c$ by normalization; compute $\mathbb{P}(1\le X\le2)$. |
| E2 | Uniform interval summaries | $X\sim\operatorname{Uni}(3,9)$ | Derive $f_X$, compute $\mathbb{P}(4\le X\le7)$, $\mathbb{E}[X]=(a+b)/2$, and $\operatorname{Var}(X)=(b-a)^2/12$. |
| E3 | Exponential tail and mean | $X\sim\operatorname{Exp}(\lambda=0.5)$ | Integrate PDF to get $F_X(x)=1-e^{-\lambda x}$; compute $\mathbb{P}(X>4)$ and $\mathbb{E}[X]=1/\lambda$. |
| E4 | Standardizing a Gaussian | $X\sim\mathcal{N}(10,4)$ and $Y=(X-10)/2$ | Use linearity of Gaussians to show $Y\sim\mathcal{N}(0,1)$; convert $\mathbb{P}(8\le X\le12)$ to standard-normal form. |
| E5 | CDF to PDF and expectation | $F_X(x)=0$ for $x<0$, $x^2$ for $0\le x\le1$, $1$ for $x>1$ | Differentiate to get $f_X(x)=2x$; compute $\mathbb{E}[X]$ by integration. |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| A1 | Conditional density on an interval | $X\sim\operatorname{Exp}(\lambda)$; condition on $X>t$ | Derive $f_{X\mid X>t}$ and prove memorylessness via $\mathbb{P}(X-t>s\mid X>t)=\mathbb{P}(X>s)$. |
| A2 | Joint density over a triangle | $(X,Y)$ uniform on $S=\{0\le y\le x\le1\}$ | Find area and joint density; integrate for $f_X(x)$ and $f_Y(y)$; compute $\mathbb{P}(Y\le 1/2)$. |
| A3 | Conditional expectation from a joint PDF | $f_{X,Y}(x,y)=2$ on $0<y<x<1$ | Derive $f_Y(y)$, $f_{X\mid Y}(x\mid y)$, and $\mathbb{E}[X\mid Y=y]$. |
| A4 | Transform a continuous random variable | $X\sim\operatorname{Uni}(0,1)$ and $Y=-\log X$ | Use CDF method to derive $F_Y(y)$ and $f_Y(y)$; identify the exponential distribution. |
| A5 | Sum, covariance, and total variance | Independent $X\sim\mathcal{N}(1,4)$ and $Y\sim\mathcal{N}(3,9)$; also a two-group conditional variance setup | Derive $X+Y\sim\mathcal{N}(4,13)$; compute covariance under independence; apply $\operatorname{Var}(X)=\mathbb{E}[\operatorname{Var}(X\mid Y)]+\operatorname{Var}(\mathbb{E}[X\mid Y])$ in a numeric mixture. |

## Part 4 — Colab Notebook (omit if 🧮)
N/A — 🧮 numeric topic (no notebook).

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** normalize a PDF; integrate interval probability; move between CDF and PDF; compute uniform/exponential/normal summaries; standardize a Gaussian probability.
- **🔴 Hard (5) — themes:** derive conditional PDFs; marginalize a joint density; compute conditional expectation; transform variables using CDF or inverse methods; use convolution/covariance/total variance in multi-step problems.
