# Continuous Random Variables

> **Source:** Probability (MIT 6.431x) &middot; Topic 3/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## Continuous random variables

### PDF, Expectation, Variance, CDF

**Definition (Probability density function (PDF)).** A probability density function of a r.v. $X$ is a non-negative real valued function $f_X$ that satisfies the following

- $\int_{-\infty}^{\infty} f_X(x)dx=1$.
- $\mathbb{P}(a\leq X\leq b)=\int_a^b f_X(x)dx$ for some random variable $X$.

**Definition (Continuous random variable).** A random variable $X$ is continuous if its probability law can be described by a PDF $f_X$.

**Remark.** Continuous random variables satisfy:

- For small $\delta>0$, $\mathbb{P}(a\leq X\leq a+\delta)\approx f_X(a)\delta$.
- $\mathbb{P}(X=a)=0$, $\forall a\in\mathbb{R}$.

**Definition (Expectation of a continuous random variable).** The expectation of a continuous random variable is

$$
\mathbb{E}[X]\triangleq \int_{-\infty}^{\infty}xf_X(x)dx.
$$

assuming $\int_{-\infty}^{\infty}|x|f_X(x)dx<\infty$.

**Properties (Properties of expectation).**

- If $X\geq 0$ then $\mathbb{E}[X]\geq 0$.
- If $a\leq X\leq b$ then $a\leq \mathbb{E}[X]\leq b$.
- $\mathbb{E}[g(X)]=\int_{-\infty}^{\infty}g(x)f_X(x)dx$.
- $\mathbb{E}[aX+b]=a\mathbb{E}[X]+b$.

**Definition (Variance of a continuous random variable).** Given a continuous random variable $X$ with $\mu=\mathbb{E}[X]$, its variance is

$$
\operatorname{Var}(X)=\mathbb{E}[(X-\mu)^2]=\int_{-\infty}^{\infty}(x-\mu)^2f_X(x)dx.
$$

It has the same properties as the variance of a discrete random variable.

**Example (Uniform continuous random variable).** A Uniform continuous random variable $X$ between $a$ and $b$, with $a<b$, ($X\sim \operatorname{Uni}(a,b)$) has PDF

$$
f_X(x)=\begin{cases}
\frac{1}{b-a}, & \text{if } a\leq x\leq b,\\
0, & \text{otherwise.}
\end{cases}
$$

We have $\mathbb{E}[X]=\frac{a+b}{2}$ and $\operatorname{Var}(X)=\frac{(b-a)^2}{12}$.

**Example (Exponential random variable).** An Exponential random variable $X$ with parameter $\lambda>0$ ($X\sim \operatorname{Exp}(\lambda)$) has PDF

$$
f_X(x)=\begin{cases}
\lambda e^{-\lambda x}, & \text{if } x\geq 0,\\
0, & \text{otherwise.}
\end{cases}
$$

We have $\mathbb{E}[X]=\frac{1}{\lambda}$ and $\operatorname{Var}(X)=\frac{1}{\lambda^2}$.

**Definition (Cumulative Distribution Function (CDF)).** The CDF of a random variable $X$ is $F_X(x)=\mathbb{P}(X\leq x)$. In particular, for a continuous random variable, we have

$$
F_X(x)=\int_{-\infty}^{x}f_X(t)dt,
$$

$$
f_X(x)=\frac{dF_X(x)}{dx}.
$$

**Properties (Properties of CDF).**

- If $y\geq x$, then $F_X(y)\geq F_X(x)$.
- $\lim_{x\to -\infty}F_X(x)=0$.
- $\lim_{x\to \infty}F_X(x)=1$.

**Definition (Normal/Gaussian random variable).** A Normal random variable $X$ with mean $\mu$ and variance $\sigma^2>0$ ($X\sim \mathcal{N}(\mu,\sigma^2)$) has PDF

$$
f_X(x)=\frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{1}{2\sigma^2}(x-\mu)^2}.
$$

We have $\mathbb{E}[X]=\mu$ and $\operatorname{Var}(X)=\sigma^2$.

**Remark (Standard Normal).** The standard Normal is $\mathcal{N}(0,1)$.

**Proposition (Linearity of Gaussians).** Given $X\sim \mathcal{N}(\mu,\sigma^2)$, and if $a\neq 0$, then $aX+b\sim \mathcal{N}(a\mu+b,a^2\sigma^2)$.

Using this $Y=\frac{X-\mu}{\sigma}$ is a standard gaussian.

### Conditioning on an event, and multiple continuous r.v.

**Definition (Conditional PDF given an event).** Given a continuous random variable $X$ and event $A$ with $\mathbb{P}(A)>0$, we define the conditional PDF as the function that satisfies

$$
\mathbb{P}(X\in B\mid A)=\int_B f_{X\mid A}(x)dx.
$$

**Definition (Conditional PDF given $X\in A$).** Given a continuous random variable $X$ and an $A\subset \mathbb{R}$, with $\mathbb{P}(A)>0$:

$$
f_{X\mid X\in A}(x)=\begin{cases}
\frac{1}{\mathbb{P}(A)}f_X(x), & x\in A,\\
0, & x\notin A.
\end{cases}
$$

**Definition (Conditional expectation).** Given a continuous random variable $X$ and an event $A$, with $\mathbb{P}(A)>0$:

$$
\mathbb{E}[X\mid A]=\int_{-\infty}^{\infty}xf_{X\mid A}(x)dx.
$$

**Definition (Memorylessness of the exponential random variable).** When we condition an exponential random variable $X$ on the event $X>t$ we have memorylessness, meaning that the “remaining time” $X-t$ given that $X>t$ is also geometric with the same parameter i.e.,

$$
\mathbb{P}(X-t>s\mid X>t)=\mathbb{P}(X>s).
$$

**Theorem (Total probability and expectation theorems).** Given a partition of the space into disjoint events $A_1,A_2,\ldots,A_n$ such that $\sum_i\mathbb{P}(A_i)=1$ we have the following:

$$
F_X(x)=\mathbb{P}(A_1)F_{X\mid A_1}(x)+\cdots+\mathbb{P}(A_n)F_{X\mid A_n}(x),
$$

$$
f_X(x)=\mathbb{P}(A_1)f_{X\mid A_1}(x)+\cdots+\mathbb{P}(A_n)f_{X\mid A_n}(x),
$$

$$
\mathbb{E}[X]=\mathbb{P}(A_1)\mathbb{E}[X\mid A_1]+\cdots+\mathbb{P}(A_n)\mathbb{E}[X\mid A_n].
$$

**Definition (Jointly continuous random variables).** A pair (collection) of random variables is jointly continuous if there exists a joint PDF $f_{X,Y}$ that describes them, that is, for every set $B\subset \mathbb{R}^n$

$$
\mathbb{P}((X,Y)\in B)=\iint_B f_{X,Y}(x,y)dxdy.
$$

**Properties (Properties of joint PDFs).**

- $f_X(x)=\int_{-\infty}^{\infty}f_{X,Y}(x,y)dy$.
- $F_{X,Y}(x,y)=\mathbb{P}(X\leq x,Y\leq y)=\int_{-\infty}^{x}\left[\int_{-\infty}^{y}f_{X,Y}(u,v)dv\right]du$.
- $f_{X,Y}(x,y)=\frac{\partial^2 F_{X,Y}(x,y)}{\partial x\partial y}$.

**Example (Uniform joint PDF on a set $S$).** Let $S\subset \mathbb{R}^2$ with area $s>0$, then the random variable $(X,Y)$ is uniform over $S$ if it has PDF

$$
f_{X,Y}(x,y)=\begin{cases}
\frac{1}{s}, & (x,y)\in S,\\
0, & (x,y)\notin S.
\end{cases}
$$

### Conditioning on a random variable, independence, Bayes' rule

**Definition (Conditional PDF given another random variable).** Given jointly continuous random variables $X,Y$ and a value $y$ such that $f_Y(y)>0$, we define the conditional PDF as

$$
f_{X\mid Y}(x\mid y)\triangleq \frac{f_{X,Y}(x,y)}{f_Y(y)}.
$$

Additionally we define $\mathbb{P}(X\in A\mid Y=y)\int_A f_{X\mid Y}(x\mid y)dx$.

**Proposition (Multiplication rule).** Given jointly continuous random variables $X,Y$, and $y$ such that $f_Y(y)>0$ we define

$$
f_{X,Y}(x,y)=f_X(x)f_{Y\mid X}(y\mid x)=f_Y(y)f_{X\mid Y}(x\mid y).
$$

**Definition (Conditional expectation).** Given jointly continuous random variables $X,Y$, and $y$ such that $f_Y(y)>0$, we define the conditional expected value as

$$
\mathbb{E}[X\mid Y=y]=\int_{-\infty}^{\infty}xf_{X\mid Y}(x\mid y)dx.
$$

Additionally we have

$$
\mathbb{E}[g(X)\mid Y=y]=\int_{-\infty}^{\infty}g(x)f_{X\mid Y}(x\mid y)dx.
$$

**Theorem (Total probability and total expectation theorems).**

$$
f_X(x)=\int_{-\infty}^{\infty}f_Y(y)f_{X\mid Y}(x\mid y)dy,
$$

$$
\mathbb{E}[X]=\int_{-\infty}^{\infty}f_Y(y)\mathbb{E}[X\mid Y=y]dy.
$$

**Definition (Independence).** Jointly continuous random variables $X,Y$ are independent if $f_{X,Y}(x,y)=f_X(x)f_Y(y)$ for all $x,y$.

**Proposition (Expectation of product of independent r.v.).** If $X$ and $Y$ are independent continuous random variables,

$$
\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y].
$$

**Remark.** If $X$ and $Y$ are independent, $\mathbb{E}[g(X)h(Y)]=\mathbb{E}[g(X)]\mathbb{E}[h(Y)]$.

**Proposition (Variance of sum of independent random variables).** If $X$ and $Y$ are independent continuous random variables,

$$
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y).
$$

**Proposition (Bayes' rule summary).**

- For $X,Y$ discrete: $p_{X\mid Y}(x\mid y)=\frac{p_X(x)p_{Y\mid X}(y\mid x)}{p_Y(y)}$.
- For $X,Y$ continuous: $f_{X\mid Y}(x\mid y)=\frac{f_X(x)f_{Y\mid X}(y\mid x)}{f_Y(y)}$.
- For $X$ discrete, $Y$ continuous: $p_{X\mid Y}(x\mid y)=\frac{p_X(x)f_{Y\mid X}(y\mid x)}{f_Y(y)}$.
- For $X$ continuous, $Y$ discrete: $f_{X\mid Y}(x\mid y)=\frac{f_X(x)p_{Y\mid X}(y\mid x)}{p_Y(y)}$.

### Derived distributions

**Proposition (Discrete case).** Given a discrete random variable $X$ and a function $g$, the r.v. $Y=g(X)$ has PMF

$$
p_Y(y)=\sum_{x:g(x)=y}p_X(x).
$$

**Remark (Linear function of discrete random variable).** If $g(x)=ax+b$, then $p_Y(y)=p_X\left(\frac{y-b}{a}\right)$.

**Proposition (Linear function of continuous r.v.).** Given a continuous random variable $X$ and $Y=aX+b$, with $a\neq 0$, we have

$$
f_Y(y)=\frac{1}{|a|}f_X\left(\frac{y-b}{a}\right).
$$

**Corollary (Linear function of normal r.v.).** If $X\sim \mathcal{N}(\mu,\sigma^2)$ and $Y=aX+b$, with $a\neq 0$, then $Y\sim \mathcal{N}(a\mu+b,a^2\sigma^2)$.

**Example (General function of a continuous r.v.).** If $X$ is a continuous random variable and $g$ is any function, to obtain the pdf of $Y=g(X)$ we follow the two-step procedure:

1. Find the CDF of $Y$: $F_Y(y)=\mathbb{P}(Y\leq y)=\mathbb{P}(g(X)\leq y)$.
2. Differentiate the CDF of $Y$ to obtain the PDF: $f_Y(y)=\frac{dF_Y(y)}{dy}$.

**Proposition (General formula for monotonic function).** Let $X$ be a continuous random variable and $g$ a function that is monotonic wherever $f_X(x)>0$. The PDF of $Y=g(X)$ is given by

$$
f_Y(y)=f_X(h(y))\left|\frac{dh(y)}{dy}\right|,
$$

where $h=g^{-1}$ in the interval where $g$ is monotonic.

### Sums of independent r.v., covariance and correlation

**Proposition (Discrete case).** Let $X,Y$ be discrete independent random variables and $Z=X+Y$, then the PMF of $Z$ is

$$
p_Z(z)=\sum_x p_X(x)p_Y(z-x).
$$

**Proposition (Continuous case).** Let $X,Y$ be continuous independent random variables and $Z=X+Y$, then the PDF of $Z$ is

$$
f_Z(z)=\int_{-\infty}^{\infty}f_X(x)f_Y(z-x)dx.
$$

**Proposition (Sum of independent normal r.v.).** Let $X\sim \mathcal{N}(\mu_X,\sigma_X^2)$ and $Y\sim \mathcal{N}(\mu_Y,\sigma_Y^2)$ independent. Then

$$
Z=X+Y\sim \mathcal{N}(\mu_X+\mu_Y,\sigma_X^2+\sigma_Y^2).
$$

**Definition (Covariance).** We define the covariance of random variables $X,Y$ as

$$
\operatorname{Cov}(X,Y) \triangleq \mathbb{E}[(X-\mathbb{E}[X])(Y-\mathbb{E}[Y])].
$$

**Properties (Properties of covariance).**

- If $X,Y$ are independent, then $\operatorname{Cov}(X,Y)=0$.
- $\operatorname{Cov}(X,X)=\operatorname{Var}(X)$.
- $\operatorname{Cov}(aX+b,Y)=a\operatorname{Cov}(X,Y)$.
- $\operatorname{Cov}(X,Y+Z)=\operatorname{Cov}(X,Y)+\operatorname{Cov}(X,Z)$.
- $\operatorname{Cov}(X,Y)=\mathbb{E}[XY]-\mathbb{E}[X]\mathbb{E}[Y]$.

**Proposition (Variance of a sum of r.v.).**

$$
\operatorname{Var}(X_1+\cdots+X_n)=\sum_i\operatorname{Var}(X_i)+\sum_{i\neq j}\operatorname{Cov}(X_i,X_j).
$$

**Definition (Correlation coefficient).** We define the correlation coefficient of random variables $X,Y$, with $\sigma_X,\sigma_Y>0$, as

$$
\rho(X,Y)\triangleq \frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}.
$$

**Properties (Properties of the correlation coefficient).**

- $-1\leq \rho \leq 1$.
- If $X,Y$ are independent, then $\rho=0$.
- $|\rho|=1$ if and only if $X-\mathbb{E}[X]=c(Y-\mathbb{E}[Y])$.
- $\rho(aX+b,Y)=\operatorname{sign}(a)\rho(X,Y)$.

### Conditional expectation and variance, sum of random number of r.v.

**Definition (Conditional expectation as a random variable).** Given random variables $X,Y$ the conditional expectation $\mathbb{E}[X\mid Y]$ is the random variable that takes the value $\mathbb{E}[X\mid Y=y]$ whenever $Y=y$.

**Theorem (Law of iterated expectations).**

$$
\mathbb{E}[\mathbb{E}[X\mid Y]]=\mathbb{E}[X].
$$

**Definition (Conditional variance as a random variable).** Given random variables $X,Y$ the conditional variance $\operatorname{Var}(X\mid Y)$ is the random variable that takes the value $\operatorname{Var}(X\mid Y=y)$ whenever $Y=y$.

**Theorem (Law of total variance).**

$$
\operatorname{Var}(X)=\mathbb{E}[\operatorname{Var}(X\mid Y)]+\operatorname{Var}(\mathbb{E}[X\mid Y]).
$$

**Proposition (Sum of a random number of independent r.v.).** Let $N$ be a nonnegative integer random variable. Let $X,X_1,X_2,\ldots,X_N$ be i.i.d. random variables. Let $Y=\sum_{i=1}^{N}X_i$. Then

$$
\mathbb{E}[Y]=\mathbb{E}[N]\mathbb{E}[X],
$$

$$
\operatorname{Var}(Y)=\mathbb{E}[N]\operatorname{Var}(X)+(\mathbb{E}[X])^2\operatorname{Var}(N).
$$
