# Continuous Random Variables
> **Source:** Probability (MIT) · **Category:** Distributions/Formula · **Type:** 🧮 Numeric · [↑ Full reference](../../ai-ml-cheatsheets.md)

## 1. Overview

Continuous random variables model numerical outcomes that vary over intervals: waiting times, lengths, errors, temperatures, and many measurements. Instead of assigning probability to individual points, we assign a probability density and obtain probabilities by integrating area under that density.

**Intuition:** a PDF is probability per unit length; intervals have area and positive probability, but a single point has probability zero.

## 2. Key Idea

### PDF and interval probability

A probability density function of a random variable $X$ is a non-negative real valued function $f_X$ such that

$$
\int_{-\infty}^{\infty} f_X(x)dx=1.
$$

For an interval,

$$
\mathbb{P}(a\leq X\leq b)=\int_a^b f_X(x)dx.
$$

A random variable $X$ is continuous if its probability law can be described by a PDF $f_X$.

For small $\delta>0$,

$$
\mathbb{P}(a\leq X\leq a+\delta)\approx f_X(a)\delta,
$$

and

$$
\mathbb{P}(X=a)=0,\quad \forall a\in\mathbb{R}.
$$

**Reading:** density height is local probability concentration, but only area under the curve is probability.

### CDF and PDF

The CDF is

$$
F_X(x)=\mathbb{P}(X\leq x).
$$

For a continuous random variable,

$$
F_X(x)=\int_{-\infty}^{x}f_X(t)dt,
$$

and

$$
f_X(x)=\frac{dF_X(x)}{dx}.
$$

The CDF is nondecreasing and satisfies

$$
\lim_{x\to -\infty}F_X(x)=0,
\qquad
\lim_{x\to \infty}F_X(x)=1.
$$

**Reading:** the CDF accumulates density from the far left, and the PDF is its slope.

### Expectation and variance

The expectation of a continuous random variable is

$$
\mathbb{E}[X]\triangleq \int_{-\infty}^{\infty}xf_X(x)dx,
$$

assuming

$$
\int_{-\infty}^{\infty}|x|f_X(x)dx<\infty.
$$

For a function $g$,

$$
\mathbb{E}[g(X)]=\int_{-\infty}^{\infty}g(x)f_X(x)dx.
$$

Linearity gives

$$
\mathbb{E}[aX+b]=a\mathbb{E}[X]+b.
$$

Given $\mu=\mathbb{E}[X]$, variance is

$$
\operatorname{Var}(X)=\mathbb{E}[(X-\mu)^2]=\int_{-\infty}^{\infty}(x-\mu)^2f_X(x)dx.
$$

**Reading:** expectation is a density-weighted average, and variance is a density-weighted average squared distance from the mean.

### Uniform distribution

A Uniform continuous random variable $X$ between $a$ and $b$, with $a<b$, written $X\sim \operatorname{Uni}(a,b)$, has PDF

$$
f_X(x)=\begin{cases}
\frac{1}{b-a}, & \text{if } a\leq x\leq b,\\
0, & \text{otherwise.}
\end{cases}
$$

Its mean and variance are

$$
\mathbb{E}[X]=\frac{a+b}{2},
\qquad
\operatorname{Var}(X)=\frac{(b-a)^2}{12}.
$$

**Reading:** equal-length subintervals inside $[a,b]$ have equal probability.

### Exponential distribution

An Exponential random variable $X$ with parameter $\lambda>0$, written $X\sim \operatorname{Exp}(\lambda)$, has PDF

$$
f_X(x)=\begin{cases}
\lambda e^{-\lambda x}, & \text{if } x\geq 0,\\
0, & \text{otherwise.}
\end{cases}
$$

Its mean and variance are

$$
\mathbb{E}[X]=\frac{1}{\lambda},
\qquad
\operatorname{Var}(X)=\frac{1}{\lambda^2}.
$$

It is memoryless:

$$
\mathbb{P}(X-t>s\mid X>t)=\mathbb{P}(X>s).
$$

**Reading:** exponential variables model waiting times whose remaining time does not depend on how long we have already waited.

### Normal/Gaussian distribution

A Normal random variable $X$ with mean $\mu$ and variance $\sigma^2>0$, written $X\sim \mathcal{N}(\mu,\sigma^2)$, has PDF

$$
f_X(x)=\frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{1}{2\sigma^2}(x-\mu)^2}.
$$

Its mean and variance are

$$
\mathbb{E}[X]=\mu,
\qquad
\operatorname{Var}(X)=\sigma^2.
$$

The standard Normal is $\mathcal{N}(0,1)$. If $X\sim \mathcal{N}(\mu,\sigma^2)$ and $a\neq0$, then

$$
aX+b\sim \mathcal{N}(a\mu+b,a^2\sigma^2).
$$

Using this,

$$
Y=\frac{X-\mu}{\sigma}
$$

is a standard gaussian.

**Reading:** Gaussian distributions stay Gaussian under nonzero linear transformations.

### Conditioning on an event

Given a continuous random variable $X$ and event $A$ with $\mathbb{P}(A)>0$, the conditional PDF satisfies

$$
\mathbb{P}(X\in B\mid A)=\int_B f_{X\mid A}(x)dx.
$$

For $A\subset\mathbb{R}$ with $\mathbb{P}(A)>0$,

$$
f_{X\mid X\in A}(x)=\begin{cases}
\frac{1}{\mathbb{P}(A)}f_X(x), & x\in A,\\
0, & x\notin A.
\end{cases}
$$

Conditional expectation is

$$
\mathbb{E}[X\mid A]=\int_{-\infty}^{\infty}xf_{X\mid A}(x)dx.
$$

For a partition $A_1,\ldots,A_n$,

$$
F_X(x)=\mathbb{P}(A_1)F_{X\mid A_1}(x)+\cdots+\mathbb{P}(A_n)F_{X\mid A_n}(x),
$$

$$
f_X(x)=\mathbb{P}(A_1)f_{X\mid A_1}(x)+\cdots+\mathbb{P}(A_n)f_{X\mid A_n}(x),
$$

and

$$
\mathbb{E}[X]=\mathbb{P}(A_1)\mathbb{E}[X\mid A_1]+\cdots+\mathbb{P}(A_n)\mathbb{E}[X\mid A_n].
$$

**Reading:** conditioning restricts density to the event and renormalizes; totals are weighted averages of conditional pieces.

### Joint PDFs, marginals, and conditional densities

A pair $(X,Y)$ is jointly continuous if, for every set $B\subset\mathbb{R}^n$,

$$
\mathbb{P}((X,Y)\in B)=\iint_B f_{X,Y}(x,y)dxdy.
$$

Marginals are obtained by integrating out the other variable:

$$
f_X(x)=\int_{-\infty}^{\infty}f_{X,Y}(x,y)dy,
\qquad
f_Y(y)=\int_{-\infty}^{\infty}f_{X,Y}(x,y)dx.
$$

The joint CDF is

$$
F_{X,Y}(x,y)=\mathbb{P}(X\leq x,Y\leq y)=\int_{-\infty}^{x}\left[\int_{-\infty}^{y}f_{X,Y}(u,v)dv\right]du.
$$

Where differentiable,

$$
f_{X,Y}(x,y)=\frac{\partial^2 F_{X,Y}(x,y)}{\partial x\partial y}.
$$

If $(X,Y)$ is uniform over $S\subset\mathbb{R}^2$ with area $s>0$, then

$$
f_{X,Y}(x,y)=\begin{cases}
\frac{1}{s}, & (x,y)\in S,\\
0, & (x,y)\notin S.
\end{cases}
$$

For $f_Y(y)>0$,

$$
f_{X\mid Y}(x\mid y)\triangleq \frac{f_{X,Y}(x,y)}{f_Y(y)}.
$$

Also,

$$
\mathbb{P}(X\in A\mid Y=y)=\int_A f_{X\mid Y}(x\mid y)dx.
$$

The multiplication rule is

$$
f_{X,Y}(x,y)=f_X(x)f_{Y\mid X}(y\mid x)=f_Y(y)f_{X\mid Y}(x\mid y).
$$

Conditional expectation is

$$
\mathbb{E}[X\mid Y=y]=\int_{-\infty}^{\infty}xf_{X\mid Y}(x\mid y)dx,
$$

and

$$
\mathbb{E}[g(X)\mid Y=y]=\int_{-\infty}^{\infty}g(x)f_{X\mid Y}(x\mid y)dx.
$$

**Reading:** joint densities measure probability over regions, marginals collapse a variable, and conditional densities are normalized slices.

### Independence, Bayes' rule, and total expectation

Jointly continuous random variables $X,Y$ are independent if

$$
f_{X,Y}(x,y)=f_X(x)f_Y(y)
$$

for all $x,y$. If $X$ and $Y$ are independent continuous random variables, then

$$
\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y],
$$

and

$$
\mathbb{E}[g(X)h(Y)]=\mathbb{E}[g(X)]\mathbb{E}[h(Y)].
$$

For $X,Y$ continuous, Bayes' rule is

$$
f_{X\mid Y}(x\mid y)=\frac{f_X(x)f_{Y\mid X}(y\mid x)}{f_Y(y)}.
$$

Total probability and total expectation are

$$
f_X(x)=\int_{-\infty}^{\infty}f_Y(y)f_{X\mid Y}(x\mid y)dy,
$$

$$
\mathbb{E}[X]=\int_{-\infty}^{\infty}f_Y(y)\mathbb{E}[X\mid Y=y]dy,
$$

and

$$
\mathbb{E}[\mathbb{E}[X\mid Y]]=\mathbb{E}[X].
$$

**Reading:** independence means no density interaction; Bayes reverses conditioning; iterated expectation averages conditional means.

### Transformations and convolution

For $Y=aX+b$, with $a\neq0$,

$$
f_Y(y)=\frac{1}{|a|}f_X\left(\frac{y-b}{a}\right).
$$

For $Y=g(X)$, first find

$$
F_Y(y)=\mathbb{P}(Y\leq y)=\mathbb{P}(g(X)\leq y),
$$

then differentiate:

$$
f_Y(y)=\frac{dF_Y(y)}{dy}.
$$

If $g$ is monotonic wherever $f_X(x)>0$, with inverse $h=g^{-1}$, then

$$
f_Y(y)=f_X(h(y))\left|\frac{dh(y)}{dy}\right|.
$$

If $X,Y$ are continuous independent random variables and $Z=X+Y$, then

$$
f_Z(z)=\int_{-\infty}^{\infty}f_X(x)f_Y(z-x)dx.
$$

If $X\sim \mathcal{N}(\mu_X,\sigma_X^2)$ and $Y\sim \mathcal{N}(\mu_Y,\sigma_Y^2)$ are independent, then

$$
Z=X+Y\sim \mathcal{N}(\mu_X+\mu_Y,\sigma_X^2+\sigma_Y^2).
$$

**Reading:** transformations conserve probability area, while convolution adds all ways independent variables can sum to $z$.

### Covariance, correlation, and total variance

Covariance is

$$
\operatorname{Cov}(X,Y) \triangleq \mathbb{E}[(X-\mathbb{E}[X])(Y-\mathbb{E}[Y])].
$$

Equivalently,

$$
\operatorname{Cov}(X,Y)=\mathbb{E}[XY]-\mathbb{E}[X]\mathbb{E}[Y].
$$

Properties include

$$
\operatorname{Cov}(X,X)=\operatorname{Var}(X),
$$

$$
\operatorname{Cov}(aX+b,Y)=a\operatorname{Cov}(X,Y),
$$

$$
\operatorname{Cov}(X,Y+Z)=\operatorname{Cov}(X,Y)+\operatorname{Cov}(X,Z),
$$

and, if $X,Y$ are independent,

$$
\operatorname{Cov}(X,Y)=0.
$$

For a sum,

$$
\operatorname{Var}(X_1+\cdots+X_n)=\sum_i\operatorname{Var}(X_i)+\sum_{i\neq j}\operatorname{Cov}(X_i,X_j).
$$

Correlation is

$$
\rho(X,Y)\triangleq \frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y},
$$

with

$$
-1\leq \rho \leq 1.
$$

If $X,Y$ are independent, then $\rho=0$.

The law of total variance is

$$
\operatorname{Var}(X)=\mathbb{E}[\operatorname{Var}(X\mid Y)]+\operatorname{Var}(\mathbb{E}[X\mid Y]).
$$

**Reading:** covariance and correlation measure linear co-movement, and total variance separates within-condition spread from between-condition mean variation.

## 3. Worked Examples

### 🟡 Easy

#### E1. Validate a triangular PDF

**Problem.** Let

$$
f_X(x)=\begin{cases}
cx, & 0\le x\le2,\\
0, & \text{otherwise.}
\end{cases}
$$

Find $c$ and compute $\mathbb{P}(1\le X\le2)$.

**Solution.**

A PDF must integrate to one:

$$
\int_{-\infty}^{\infty} f_X(x)dx=1.
$$

Since $f_X(x)=0$ outside $[0,2]$,

$$
\int_0^2 cx\,dx=1.
$$

Pull out $c$:

$$
c\int_0^2 x\,dx=1.
$$

Evaluate the integral:

$$
\int_0^2 x\,dx=\left[\frac{x^2}{2}\right]_0^2=\frac{4}{2}-0=2.
$$

Therefore

$$
2c=1,
$$

so

$$
c=\frac12.
$$

The density is nonnegative because $c=1/2>0$ and $x\ge0$ on $[0,2]$.

Now compute the interval probability:

$$
\mathbb{P}(1\le X\le2)=\int_1^2 \frac{x}{2}\,dx.
$$

Evaluate:

$$
\int_1^2 \frac{x}{2}\,dx=\frac12\left[\frac{x^2}{2}\right]_1^2
=\frac12\left(\frac{4}{2}-\frac{1}{2}\right).
$$

Simplify:

$$
\frac12\left(2-\frac12\right)=\frac12\cdot\frac32=\frac34.
$$

Thus

$$
\boxed{c=\frac12},\qquad \boxed{\mathbb{P}(1\le X\le2)=\frac34}.
$$

#### E2. Uniform interval summaries

**Problem.** Let $X\sim\operatorname{Uni}(3,9)$. Derive $f_X$, compute $\mathbb{P}(4\le X\le7)$, $\mathbb{E}[X]$, and $\operatorname{Var}(X)$.

**Solution.**

For $X\sim\operatorname{Uni}(a,b)$,

$$
f_X(x)=\begin{cases}
\frac{1}{b-a}, & a\le x\le b,\\
0, & \text{otherwise.}
\end{cases}
$$

Here $a=3$ and $b=9$, so $b-a=6$ and

$$
f_X(x)=\begin{cases}
\frac16, & 3\le x\le9,\\
0, & \text{otherwise.}
\end{cases}
$$

Since $[4,7]\subset[3,9]$,

$$
\mathbb{P}(4\le X\le7)=\int_4^7 \frac16\,dx.
$$

Compute the area:

$$
\int_4^7 \frac16\,dx=\frac16[x]_4^7=\frac16(7-4)=\frac36=\frac12.
$$

The uniform mean is

$$
\mathbb{E}[X]=\frac{a+b}{2}=\frac{3+9}{2}=6.
$$

The uniform variance is

$$
\operatorname{Var}(X)=\frac{(b-a)^2}{12}=\frac{(9-3)^2}{12}=\frac{36}{12}=3.
$$

Therefore

$$
\boxed{f_X(x)=\begin{cases}\frac16, & 3\le x\le9,\\0, & \text{otherwise,}\end{cases}}
$$

$$
\boxed{\mathbb{P}(4\le X\le7)=\frac12},\qquad
\boxed{\mathbb{E}[X]=6},\qquad
\boxed{\operatorname{Var}(X)=3}.
$$

#### E3. Exponential tail and mean

**Problem.** Let $X\sim\operatorname{Exp}(\lambda=0.5)$. Integrate the PDF to get $F_X(x)$, compute $\mathbb{P}(X>4)$, and compute $\mathbb{E}[X]$.

**Solution.**

The PDF is

$$
f_X(x)=\begin{cases}
0.5e^{-0.5x}, & x\ge0,\\
0, & x<0.
\end{cases}
$$

For $x<0$, no density has appeared yet, so

$$
F_X(x)=0.
$$

For $x\ge0$,

$$
F_X(x)=\int_0^x 0.5e^{-0.5t}\,dt.
$$

An antiderivative is

$$
\int 0.5e^{-0.5t}\,dt=-e^{-0.5t}.
$$

Thus

$$
F_X(x)=\left[-e^{-0.5t}\right]_0^x=-e^{-0.5x}-(-e^0)=1-e^{-0.5x}.
$$

So

$$
F_X(x)=\begin{cases}
0, & x<0,\\
1-e^{-0.5x}, & x\ge0.
\end{cases}
$$

Now

$$
\mathbb{P}(X>4)=1-F_X(4)=1-(1-e^{-0.5\cdot4})=e^{-2}.
$$

Since $e^{-2}\approx0.1353$,

$$
\mathbb{P}(X>4)\approx0.1353.
$$

The exponential mean is

$$
\mathbb{E}[X]=\frac{1}{\lambda}=\frac{1}{0.5}=2.
$$

Hence

$$
\boxed{F_X(x)=\begin{cases}0, & x<0,\\1-e^{-0.5x}, & x\ge0,\end{cases}}
$$

$$
\boxed{\mathbb{P}(X>4)=e^{-2}\approx0.1353},\qquad \boxed{\mathbb{E}[X]=2}.
$$

#### E4. Standardizing a Gaussian

**Problem.** Let $X\sim\mathcal{N}(10,4)$ and $Y=(X-10)/2$. Show $Y\sim\mathcal{N}(0,1)$ and convert $\mathbb{P}(8\le X\le12)$ to standard-normal form.

**Solution.**

The distribution $X\sim\mathcal{N}(10,4)$ has

$$
\mu=10,
\qquad
\sigma^2=4,
\qquad
\sigma=2.
$$

Write $Y$ as a linear transformation:

$$
Y=\frac{X-10}{2}=\frac12X-5.
$$

Using $aX+b\sim\mathcal{N}(a\mu+b,a^2\sigma^2)$ with $a=1/2$ and $b=-5$,

$$
\mathbb{E}[Y]=\frac12(10)-5=0,
$$

and

$$
\operatorname{Var}(Y)=\left(\frac12\right)^2(4)=1.
$$

Therefore

$$
Y\sim\mathcal{N}(0,1).
$$

Now standardize the event:

$$
8\le X\le12.
$$

Subtract $10$ throughout:

$$
-2\le X-10\le2.
$$

Divide by $2>0$:

$$
-1\le \frac{X-10}{2}\le1.
$$

Since $Y=(X-10)/2$,

$$
\mathbb{P}(8\le X\le12)=\mathbb{P}(-1\le Y\le1).
$$

If $\Phi$ is the standard-normal CDF,

$$
\mathbb{P}(-1\le Y\le1)=\Phi(1)-\Phi(-1).
$$

By symmetry, $\Phi(-1)=1-\Phi(1)$, so

$$
\Phi(1)-\Phi(-1)=2\Phi(1)-1.
$$

Thus

$$
\boxed{Y\sim\mathcal{N}(0,1)},\qquad
\boxed{\mathbb{P}(8\le X\le12)=\Phi(1)-\Phi(-1)=2\Phi(1)-1}.
$$

#### E5. CDF to PDF and expectation

**Problem.** Let

$$
F_X(x)=\begin{cases}
0, & x<0,\\
x^2, & 0\le x\le1,\\
1, & x>1.
\end{cases}
$$

Differentiate to get $f_X(x)$ and compute $\mathbb{E}[X]$.

**Solution.**

For a continuous random variable,

$$
f_X(x)=\frac{dF_X(x)}{dx}
$$

where the derivative exists.

For $x<0$, $F_X(x)=0$, so $f_X(x)=0$. For $0<x<1$, $F_X(x)=x^2$, so

$$
f_X(x)=\frac{d}{dx}x^2=2x.
$$

For $x>1$, $F_X(x)=1$, so $f_X(x)=0$. Single endpoints do not affect integrals, so

$$
f_X(x)=\begin{cases}
2x, & 0\le x\le1,\\
0, & \text{otherwise.}
\end{cases}
$$

Now compute expectation:

$$
\mathbb{E}[X]=\int_{-\infty}^{\infty}xf_X(x)dx=\int_0^1 x(2x)dx.
$$

Simplify and integrate:

$$
\int_0^1 x(2x)dx=\int_0^1 2x^2dx=2\left[\frac{x^3}{3}\right]_0^1.
$$

Evaluate endpoints:

$$
2\left(\frac13-0\right)=\frac23.
$$

Therefore

$$
\boxed{f_X(x)=\begin{cases}2x, & 0\le x\le1,\\0, & \text{otherwise,}\end{cases}}
\qquad
\boxed{\mathbb{E}[X]=\frac23}.
$$

### 🔴 Advanced

#### A1. Conditional density on an interval

**Problem.** Let $X\sim\operatorname{Exp}(\lambda)$ and condition on $X>t$. Derive $f_{X\mid X>t}$ and prove

$$
\mathbb{P}(X-t>s\mid X>t)=\mathbb{P}(X>s).
$$

**Solution.**

First compute the conditioning probability:

$$
\mathbb{P}(X>t)=\int_t^\infty \lambda e^{-\lambda x}dx.
$$

Since

$$
\int \lambda e^{-\lambda x}dx=-e^{-\lambda x},
$$

we have

$$
\mathbb{P}(X>t)=\left[-e^{-\lambda x}\right]_t^\infty=0-(-e^{-\lambda t})=e^{-\lambda t}.
$$

Conditioning on $X>t$ means restricting to $(t,\infty)$ and renormalizing:

$$
f_{X\mid X>t}(x)=\begin{cases}
\frac{\lambda e^{-\lambda x}}{e^{-\lambda t}}, & x>t,\\
0, & x\le t.
\end{cases}
$$

Simplify:

$$
\frac{\lambda e^{-\lambda x}}{e^{-\lambda t}}=\lambda e^{-\lambda x+\lambda t}=\lambda e^{-\lambda(x-t)}.
$$

Hence

$$
f_{X\mid X>t}(x)=\begin{cases}
\lambda e^{-\lambda(x-t)}, & x>t,\\
0, & x\le t.
\end{cases}
$$

For $s\ge0$,

$$
\mathbb{P}(X-t>s\mid X>t)=\mathbb{P}(X>t+s\mid X>t).
$$

Using conditional probability,

$$
\mathbb{P}(X>t+s\mid X>t)=\frac{\mathbb{P}(X>t+s\text{ and }X>t)}{\mathbb{P}(X>t)}.
$$

Since $X>t+s$ implies $X>t$,

$$
\mathbb{P}(X>t+s\mid X>t)=\frac{\mathbb{P}(X>t+s)}{\mathbb{P}(X>t)}.
$$

Use the exponential tail:

$$
\frac{\mathbb{P}(X>t+s)}{\mathbb{P}(X>t)}=\frac{e^{-\lambda(t+s)}}{e^{-\lambda t}}=e^{-\lambda s}.
$$

But

$$
\mathbb{P}(X>s)=e^{-\lambda s}.
$$

Thus

$$
\boxed{f_{X\mid X>t}(x)=\begin{cases}\lambda e^{-\lambda(x-t)}, & x>t,\\0, & x\le t,\end{cases}}
$$

and

$$
\boxed{\mathbb{P}(X-t>s\mid X>t)=\mathbb{P}(X>s)}.
$$

#### A2. Joint density over a triangle

**Problem.** Let $(X,Y)$ be uniform on

$$
S=\{0\le y\le x\le1\}.
$$

Find the joint density, derive $f_X(x)$ and $f_Y(y)$, and compute $\mathbb{P}(Y\le1/2)$.

**Solution.**

The area of $S$ is

$$
s=\int_0^1\int_0^x dy\,dx.
$$

Evaluate inside first:

$$
\int_0^x dy=x.
$$

Then

$$
s=\int_0^1 x\,dx=\left[\frac{x^2}{2}\right]_0^1=\frac12.
$$

Uniform density over area $s$ is $1/s$, so

$$
f_{X,Y}(x,y)=\begin{cases}
2, & 0\le y\le x\le1,\\
0, & \text{otherwise.}
\end{cases}
$$

For the marginal of $X$, fix $x\in[0,1]$. The variable $y$ ranges from $0$ to $x$, hence

$$
f_X(x)=\int_0^x 2\,dy=2[y]_0^x=2x,
\qquad 0\le x\le1.
$$

Thus

$$
f_X(x)=\begin{cases}
2x, & 0\le x\le1,\\
0, & \text{otherwise.}
\end{cases}
$$

For the marginal of $Y$, fix $y\in[0,1]$. The variable $x$ ranges from $y$ to $1$, hence

$$
f_Y(y)=\int_y^1 2\,dx=2[x]_y^1=2(1-y),
\qquad 0\le y\le1.
$$

Thus

$$
f_Y(y)=\begin{cases}
2(1-y), & 0\le y\le1,\\
0, & \text{otherwise.}
\end{cases}
$$

Now

$$
\mathbb{P}(Y\le1/2)=\int_0^{1/2}2(1-y)dy.
$$

Integrate:

$$
\int_0^{1/2}2(1-y)dy=\left[2y-y^2\right]_0^{1/2}.
$$

Substitute:

$$
2\cdot\frac12-\left(\frac12\right)^2=1-\frac14=\frac34.
$$

Therefore

$$
\boxed{f_{X,Y}(x,y)=\begin{cases}2, & 0\le y\le x\le1,\\0, & \text{otherwise,}\end{cases}}
$$

$$
\boxed{f_X(x)=\begin{cases}2x, & 0\le x\le1,\\0, & \text{otherwise,}\end{cases}}
\qquad
\boxed{f_Y(y)=\begin{cases}2(1-y), & 0\le y\le1,\\0, & \text{otherwise,}\end{cases}}
$$

$$
\boxed{\mathbb{P}(Y\le1/2)=\frac34}.
$$

#### A3. Conditional expectation from a joint PDF

**Problem.** Let $f_{X,Y}(x,y)=2$ on $0<y<x<1$ and $0$ otherwise. Derive $f_Y(y)$, $f_{X\mid Y}(x\mid y)$, and $\mathbb{E}[X\mid Y=y]$.

**Solution.**

For fixed $y$, the constraint $0<y<x<1$ implies $y<x<1$, possible only for $0<y<1$.

Thus

$$
f_Y(y)=\int_{-\infty}^{\infty}f_{X,Y}(x,y)dx=\int_y^1 2\,dx,
\qquad 0<y<1.
$$

Evaluate:

$$
f_Y(y)=2[x]_y^1=2(1-y).
$$

So

$$
f_Y(y)=\begin{cases}
2(1-y), & 0<y<1,\\
0, & \text{otherwise.}
\end{cases}
$$

For $0<y<1$ and $y<x<1$,

$$
f_{X\mid Y}(x\mid y)=\frac{f_{X,Y}(x,y)}{f_Y(y)}=\frac{2}{2(1-y)}=\frac{1}{1-y}.
$$

Therefore

$$
f_{X\mid Y}(x\mid y)=\begin{cases}
\frac{1}{1-y}, & y<x<1,\\
0, & \text{otherwise,}
\end{cases}
\qquad 0<y<1.
$$

Now compute conditional expectation:

$$
\mathbb{E}[X\mid Y=y]=\int_{-\infty}^{\infty}x f_{X\mid Y}(x\mid y)dx.
$$

Use the conditional support:

$$
\mathbb{E}[X\mid Y=y]=\int_y^1 x\frac{1}{1-y}dx
=\frac{1}{1-y}\int_y^1 x\,dx.
$$

Evaluate the integral:

$$
\int_y^1 x\,dx=\left[\frac{x^2}{2}\right]_y^1=\frac{1-y^2}{2}.
$$

Thus

$$
\mathbb{E}[X\mid Y=y]=\frac{1-y^2}{2(1-y)}.
$$

Factor $1-y^2=(1-y)(1+y)$:

$$
\mathbb{E}[X\mid Y=y]=\frac{(1-y)(1+y)}{2(1-y)}=\frac{1+y}{2}.
$$

Hence

$$
\boxed{f_Y(y)=\begin{cases}2(1-y), & 0<y<1,\\0, & \text{otherwise,}\end{cases}}
$$

$$
\boxed{f_{X\mid Y}(x\mid y)=\begin{cases}\frac{1}{1-y}, & y<x<1,\\0, & \text{otherwise,}\end{cases}}
$$

and

$$
\boxed{\mathbb{E}[X\mid Y=y]=\frac{1+y}{2}},\qquad 0<y<1.
$$

#### A4. Transform a continuous random variable

**Problem.** Let $X\sim\operatorname{Uni}(0,1)$ and $Y=-\log X$. Use the CDF method to derive $F_Y(y)$ and $f_Y(y)$, and identify the distribution.

**Solution.**

Since $0<X<1$ with probability one, $\log X\le0$, so $Y=-\log X\ge0$. Therefore

$$
F_Y(y)=0,\qquad y<0.
$$

For $y\ge0$,

$$
F_Y(y)=\mathbb{P}(Y\le y)=\mathbb{P}(-\log X\le y).
$$

Multiply by $-1$, reversing the inequality:

$$
-\log X\le y \Longleftrightarrow \log X\ge -y.
$$

Exponentiate both sides; the exponential function is increasing:

$$
\log X\ge -y \Longleftrightarrow X\ge e^{-y}.
$$

Thus

$$
F_Y(y)=\mathbb{P}(X\ge e^{-y}).
$$

Because $X$ is uniform on $(0,1)$ and $e^{-y}\in(0,1]$ for $y\ge0$,

$$
\mathbb{P}(X\ge e^{-y})=\int_{e^{-y}}^1 1\,dx.
$$

Evaluate:

$$
\int_{e^{-y}}^1 1\,dx=[x]_{e^{-y}}^1=1-e^{-y}.
$$

So

$$
F_Y(y)=\begin{cases}
0, & y<0,\\
1-e^{-y}, & y\ge0.
\end{cases}
$$

Differentiate:

$$
f_Y(y)=\frac{d}{dy}F_Y(y)=\begin{cases}
e^{-y}, & y\ge0,\\
0, & y<0.
\end{cases}
$$

This matches the exponential PDF with $\lambda=1$:

$$
f(y)=\begin{cases}
\lambda e^{-\lambda y}, & y\ge0,\\
0, & y<0.
\end{cases}
$$

Therefore

$$
\boxed{F_Y(y)=\begin{cases}0, & y<0,\\1-e^{-y}, & y\ge0,\end{cases}}
$$

$$
\boxed{f_Y(y)=\begin{cases}e^{-y}, & y\ge0,\\0, & y<0,\end{cases}}
\qquad
\boxed{Y\sim\operatorname{Exp}(1)}.
$$

#### A5. Sum, covariance, and total variance

**Problem.** Let $X\sim\mathcal{N}(1,4)$ and $Y\sim\mathcal{N}(3,9)$ be independent. Derive the distribution of $X+Y$, compute $\operatorname{Cov}(X,Y)$ and $\rho(X,Y)$, and then compute a numeric total variance: let $G\in\{0,1\}$ with $\mathbb{P}(G=0)=0.4$ and $\mathbb{P}(G=1)=0.6$, and suppose

$$
\mathbb{E}[W\mid G=0]=2,
\quad
\operatorname{Var}(W\mid G=0)=1,
$$

$$
\mathbb{E}[W\mid G=1]=5,
\quad
\operatorname{Var}(W\mid G=1)=4.
$$

Use

$$
\operatorname{Var}(W)=\mathbb{E}[\operatorname{Var}(W\mid G)]+\operatorname{Var}(\mathbb{E}[W\mid G]).
$$

**Solution.**

For independent normal random variables,

$$
X\sim\mathcal{N}(\mu_X,\sigma_X^2),
\qquad
Y\sim\mathcal{N}(\mu_Y,\sigma_Y^2)
$$

implies

$$
X+Y\sim\mathcal{N}(\mu_X+\mu_Y,\sigma_X^2+\sigma_Y^2).
$$

Here

$$
\mu_X=1,
\quad
\sigma_X^2=4,
\quad
\mu_Y=3,
\quad
\sigma_Y^2=9.
$$

Therefore

$$
\mu_X+\mu_Y=1+3=4,
$$

and

$$
\sigma_X^2+\sigma_Y^2=4+9=13.
$$

So

$$
X+Y\sim\mathcal{N}(4,13).
$$

For covariance,

$$
\operatorname{Cov}(X,Y)=\mathbb{E}[XY]-\mathbb{E}[X]\mathbb{E}[Y].
$$

Independence gives

$$
\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y],
$$

so

$$
\operatorname{Cov}(X,Y)=0.
$$

The standard deviations are

$$
\sigma_X=\sqrt4=2,
\qquad
\sigma_Y=\sqrt9=3.
$$

Thus

$$
\rho(X,Y)=\frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}=\frac{0}{2\cdot3}=0.
$$

Now compute the two pieces of total variance. First,

$$
\mathbb{E}[\operatorname{Var}(W\mid G)]
=0.4\cdot1+0.6\cdot4.
$$

Calculate:

$$
0.4\cdot1=0.4,
\qquad
0.6\cdot4=2.4,
$$

so

$$
\mathbb{E}[\operatorname{Var}(W\mid G)]=0.4+2.4=2.8.
$$

Next define

$$
M=\mathbb{E}[W\mid G].
$$

Then

$$
M=\begin{cases}
2, & G=0,\\
5, & G=1.
\end{cases}
$$

Compute its mean:

$$
\mathbb{E}[M]=0.4\cdot2+0.6\cdot5=0.8+3.0=3.8.
$$

Compute its second moment:

$$
\mathbb{E}[M^2]=0.4\cdot2^2+0.6\cdot5^2.
$$

Since $2^2=4$ and $5^2=25$,

$$
\mathbb{E}[M^2]=0.4\cdot4+0.6\cdot25=1.6+15=16.6.
$$

Therefore

$$
\operatorname{Var}(M)=\mathbb{E}[M^2]-(\mathbb{E}[M])^2=16.6-(3.8)^2.
$$

Because

$$
(3.8)^2=14.44,
$$

we get

$$
\operatorname{Var}(M)=16.6-14.44=2.16.
$$

Thus

$$
\operatorname{Var}(\mathbb{E}[W\mid G])=2.16.
$$

Apply total variance:

$$
\operatorname{Var}(W)=2.8+2.16=4.96.
$$

Final answers:

$$
\boxed{X+Y\sim\mathcal{N}(4,13)},
\qquad
\boxed{\operatorname{Cov}(X,Y)=0},
\qquad
\boxed{\rho(X,Y)=0},
$$

and

$$
\boxed{\operatorname{Var}(W)=4.96}.
$$
