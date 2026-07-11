# Refresher: Probability & Statistics
> **Source:** CS 229 · **Category:** Formula · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 This section is written as a runnable notebook; an `.ipynb` will be generated from it. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up the core idea one tiny step at a time. Each step **prints** the numbers it
> computes and **draws a picture** so you can *see* what is happening. Run the cells in order
> from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

- **Mean** is the center; **variance/standard deviation** measure spread.
- **Covariance** measures how two variables move together; **correlation** rescales it to −1…1.
- Every one of these is a short sum you can compute by hand.

### Step 0 — Set up our tools

We import NumPy (arrays + math) and Matplotlib (pictures), fix a **seed** for reproducibility,
and define a tiny `log()` helper so every printed line is clearly labeled.

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)
plt.rcParams["figure.figsize"] = (6, 4)

def log(label, value):
    print(f"[{label}] {value}")

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Mean, variance, standard deviation

For a tiny sample, the **mean** is the average, the **variance** is the average squared distance from the mean, and the **standard deviation** is its square root (back in the original units).

```python
a = np.array([2, 4, 6, 8, 10.])
mean_a = a.mean()
var_a = np.mean((a - mean_a) ** 2)
std_a = np.sqrt(var_a)
log("mean", mean_a); log("variance = avg of (x-mean)^2", var_a); log("std = sqrt(variance)", round(std_a, 3))
assert mean_a == 6.0

plt.bar(range(len(a)), a); plt.axhline(mean_a, color="red", ls="--", label="mean")
plt.title("values with their mean"); plt.legend(); plt.show()
```
▶ What you'll see: mean 6, variance 8, std ≈ 2.83, and bars with the mean line.

### Step 2 — Covariance and correlation between two variables

**Covariance** is the average product of the two variables' deviations from their means; **correlation** divides that by both standard deviations so it lands in −1…1.

```python
b = np.array([1, 3, 2, 5, 4.])
cov = np.mean((a - a.mean()) * (b - b.mean()))                 # do they deviate together?
corr = cov / (a.std() * b.std())                              # rescaled to -1..1
log("covariance", round(cov, 3)); log("correlation", round(corr, 3))
assert abs(corr - np.corrcoef(a, b)[0, 1]) < 1e-9

plt.scatter(a, b); plt.title(f"scatter (correlation = {corr:.2f})"); plt.xlabel("a"); plt.ylabel("b"); plt.show()
```
▶ What you'll see: a positive covariance and a correlation of 0.8 with an upward-trending scatter.

## 1. Overview

Probability and statistics provide the language used by machine learning to describe uncertainty, data, noise, parameters, and generalization. A model prediction, a loss, a likelihood, a confidence statement, and a validation metric are often expectations, conditional probabilities, variances, covariances, or estimators written compactly.

**Intuition:** probability tells us how uncertain quantities behave before and after observing evidence; statistics tells us how to infer unknown quantities from samples.

## 2. Key Idea

### Sample spaces, events, and probability axioms

The **sample space** $S$ is the set of all possible outcomes of an experiment. An **event** $E$ is any subset of $S$.

For each event $E$, the probability $P(E)$ satisfies

$$
(1)\quad 0 \leq P(E) \leq 1 \qquad (2)\quad P(S)=1 \qquad (3)\quad P\left(\bigcup_{i=1}^n E_i\right)=\sum_{i=1}^n P(E_i)
$$

when $E_1,\ldots,E_n$ are mutually exclusive.

**Reading:** probabilities are nonnegative weights totaling one over the whole sample space, and disjoint event probabilities add.

### Counting: permutations and combinations

A **permutation** arranges $r$ objects from $n$ objects in order:

$$
P(n,r)=\frac{n!}{(n-r)!}.
$$

A **combination** selects $r$ objects from $n$ objects when order does not matter:

$$
C(n,r)=\frac{P(n,r)}{r!}=\frac{n!}{r!(n-r)!}.
$$

**Reading:** permutations count ordered selections; combinations divide by the $r!$ reorderings of the same selected set.

### Conditional probability, Bayes' rule, and independence

For events $A$ and $B$ such that $P(B)>0$, Bayes' rule is

$$
P(A|B)=\frac{P(B|A)P(A)}{P(B)}.
$$

Equivalently,

$$
P(A\cap B)=P(A)P(B|A)=P(A|B)P(B).
$$

If $\{A_i, i\in [\![1,n]\!]\}$ is a partition of the sample space, then

$$
\forall i\neq j,\ A_i\cap A_j=\varnothing \qquad \textrm{and}\qquad \bigcup_{i=1}^n A_i=S.
$$

For any event $B$,

$$
P(B)=\sum_{i=1}^n P(B|A_i)P(A_i).
$$

The extended form of Bayes' rule is

$$
P(A_k|B)=\frac{P(B|A_k)P(A_k)}{\sum_{i=1}^n P(B|A_i)P(A_i)}.
$$

Two events $A$ and $B$ are independent if and only if

$$
P(A\cap B)=P(A)P(B).
$$

**Reading:** Bayes' rule updates a prior probability after evidence by multiplying prior times likelihood and normalizing over all ways the evidence could occur.

### Random variables, CDFs, PDFs, and PMFs

A **random variable** $X$ maps outcomes in the sample space to real numbers.

The **cumulative distribution function** is

$$
F(x)=P(X\leq x).
$$

For interval probabilities,

$$
P(a<X\leq b)=F(b)-F(a).
$$

For a discrete random variable,

$$
F(x)=\sum_{x_i\leq x}P(X=x_i), \qquad f(x_j)=P(X=x_j),
$$

with

$$
0\leq f(x_j)\leq 1 \qquad \textrm{and}\qquad \sum_j f(x_j)=1.
$$

For a continuous random variable,

$$
F(x)=\int_{-\infty}^x f(y)dy, \qquad f(x)=\frac{dF}{dx},
$$

with

$$
f(x)\geq 0 \qquad \textrm{and}\qquad \int_{-\infty}^{+\infty} f(x)dx=1.
$$

**Reading:** the CDF accumulates probability up to a cutoff; PMFs assign point masses, while PDFs assign density whose integrals give probabilities.

### Expectation, moments, characteristic functions, and variance

For the discrete and continuous cases, expectation and related quantities are:

| Case | $E[X]$ | $E[g(X)]$ | $E[X^k]$ | $\psi(\omega)$ |
|---|---|---|---|---|
| (D) | $\sum_{i=1}^n x_i f(x_i)$ | $\sum_{i=1}^n g(x_i)f(x_i)$ | $\sum_{i=1}^n x_i^k f(x_i)$ | $\sum_{i=1}^n f(x_i)e^{i\omega x_i}$ |
| (C) | $\int_{-\infty}^{+\infty} x f(x)dx$ | $\int_{-\infty}^{+\infty} g(x)f(x)dx$ | $\int_{-\infty}^{+\infty} x^k f(x)dx$ | $\int_{-\infty}^{+\infty} f(x)e^{i\omega x}dx$ |

The characteristic-function identity for moments is

$$
E[X^k]=\frac{1}{i^k}\left[\frac{\partial^k\psi}{\partial \omega^k}\right]_{\omega=0}.
$$

The variance is

$$
\operatorname{Var}(X)=E[(X-E[X])^2]=E[X^2]-E[X]^2.
$$

The standard deviation is

$$
\sigma=\sqrt{\operatorname{Var}(X)}.
$$

**Reading:** expectation is a probability-weighted average, variance is the average squared distance from the mean, and standard deviation puts spread back in the original units.

### Transformations, Leibniz rule, and Chebyshev's inequality

For a transformation between variables $X$ and $Y$,

$$
f_Y(y)=f_X(x)\left|\frac{dx}{dy}\right|.
$$

The Leibniz integral rule is

$$
\frac{\partial}{\partial c}\left(\int_a^b g(x)dx\right)=\frac{\partial b}{\partial c}\cdot g(b)-\frac{\partial a}{\partial c}\cdot g(a)+\int_a^b \frac{\partial g}{\partial c}(x)dx.
$$

Chebyshev's inequality says that if $X$ has expected value $\mu$ and standard deviation $\sigma$, then for $k,\sigma>0$,

$$
P(|X-\mu|\geq k\sigma)\leq \frac{1}{k^2}.
$$

**Reading:** transformations adjust densities by the change-of-scale factor, and Chebyshev bounds tail probability using only mean and variance.

### Joint, marginal, and conditional distributions

The conditional density of $X$ with respect to $Y$ is

$$
f_{X|Y}(x)=\frac{f_{XY}(x,y)}{f_Y(y)}.
$$

Two random variables $X$ and $Y$ are independent if

$$
f_{XY}(x,y)=f_X(x)f_Y(y).
$$

Marginal densities and cumulative functions are obtained from a joint distribution as follows:

| Case | Marginal density | Cumulative function |
|---|---|---|
| (D) | $f_X(x_i)=\sum_j f_{XY}(x_i,y_j)$ | $F_{XY}(x,y)=\sum_{x_i\leq x}\sum_{y_j\leq y} f_{XY}(x_i,y_j)$ |
| (C) | $f_X(x)=\int_{-\infty}^{+\infty} f_{XY}(x,y)dy$ | $F_{XY}(x,y)=\int_{-\infty}^x \int_{-\infty}^y f_{XY}(x',y')dx'dy'$ |

If $Y=X_1+\cdots+X_n$ with $X_1,\ldots,X_n$ independent, then

$$
\psi_Y(\omega)=\prod_{k=1}^n \psi_{X_k}(\omega).
$$

**Reading:** a joint distribution describes variables together; marginals sum or integrate away unwanted variables, and conditionals divide a joint by the observed variable's marginal.

### Covariance and correlation

Covariance is

$$
\operatorname{Cov}(X,Y)\triangleq \sigma^2_{XY}=E[(X-\mu_X)(Y-\mu_Y)]=E[XY]-\mu_X\mu_Y.
$$

Correlation is

$$
\rho_{XY}=\frac{\sigma^2_{XY}}{\sigma_X\sigma_Y}.
$$

For any $X,Y$,

$$
\rho_{XY}\in [-1,1].
$$

If $X$ and $Y$ are independent, then

$$
\rho_{XY}=0.
$$

**Reading:** covariance measures signed co-movement, while correlation rescales it to a unitless number between $-1$ and $1$.

### Common distributions

| Type | Distribution | PDF | $\psi(\omega)$ | $E[X]$ | $\operatorname{Var}(X)$ |
|---|---|---|---|---|---|
| (D) | $X\sim \mathcal{B}(n,p)$ Binomial | $P(X=x)=\binom{n}{x}p^xq^{n-x}$, $x\in [\![0,n]\!]$ | $(pe^{i\omega}+q)^n$ | $np$ | $npq$ |
| (D) | $X\sim \operatorname{Po}(\mu)$ Poisson | $P(X=x)=\frac{\mu^x}{x!}e^{-\mu}$, $x\in \mathbb{N}$ | $e^{\mu(e^{i\omega}-1)}$ | $\mu$ | $\mu$ |
| (C) | $X\sim \mathcal{U}(a,b)$ Uniform | $f(x)=\frac{1}{b-a}$, $x\in [a,b]$ | $\frac{e^{i\omega b}-e^{i\omega a}}{(b-a)i\omega}$ | $\frac{a+b}{2}$ | $\frac{(b-a)^2}{12}$ |
| (C) | $X\sim \mathcal{N}(\mu,\sigma)$ Gaussian | $f(x)=\frac{1}{\sqrt{2\pi}\sigma}e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$, $x\in \mathbb{R}$ | $e^{i\omega\mu-\frac{1}{2}\omega^2\sigma^2}$ | $\mu$ | $\sigma^2$ |
| (C) | $X\sim \operatorname{Exp}(\lambda)$ Exponential | $f(x)=\lambda e^{-\lambda x}$, $x\in \mathbb{R}_+$ | $\frac{1}{1-\frac{i\omega}{\lambda}}$ | $\frac{1}{\lambda}$ | $\frac{1}{\lambda^2}$ |

**Reading:** these families are reusable probability templates; each gives a formula for probability, mean, variance, and often characteristic function.

### Parameter estimation, MLE, MAP, bias, and sample variance

A **random sample** is a collection $X_1,\ldots,X_n$ of independent and identically distributed random variables with $X$.

An **estimator** $\hat{\theta}$ is a function of the data used to infer an unknown parameter $\theta$.

The bias of an estimator is

$$
\operatorname{Bias}(\hat{\theta})=E[\hat{\theta}]-\theta.
$$

The sample mean and unbiased sample variance are

$$
\overline{X}=\frac{1}{n}\sum_{i=1}^n X_i \qquad \textrm{and}\qquad s^2=\hat{\sigma}^2=\frac{1}{n-1}\sum_{i=1}^n (X_i-\overline{X})^2.
$$

For data $x_1,\ldots,x_n$ with likelihood $L(\theta)=P(x_1,\ldots,x_n\mid \theta)$ or density $f(x_1,\ldots,x_n\mid \theta)$, maximum likelihood estimation chooses

$$
\hat{\theta}_{\mathrm{MLE}}=\arg\max_{\theta} L(\theta).
$$

With a prior $P(\theta)$ or density $p(\theta)$, maximum a posteriori estimation chooses

$$
\hat{\theta}_{\mathrm{MAP}}=\arg\max_{\theta} P(\theta\mid x_1,\ldots,x_n)=\arg\max_{\theta} L(\theta)P(\theta).
$$

**Reading:** MLE chooses the parameter making the data most likely; MAP does the same after multiplying by prior belief.

### Central Limit Theorem

For a random sample $X_1,\ldots,X_n$ from a distribution with mean $\mu$ and variance $\sigma^2$,

$$
\overline{X}\underset{n\to +\infty}{\sim}\mathcal{N}\left(\mu,\frac{\sigma}{\sqrt{n}}\right).
$$

**Reading:** for large samples, the sample mean is approximately Gaussian with center $\mu$ and standard error $\sigma/\sqrt n$.

## 3. Worked Examples

### 🟡 Easy

#### E1. Count ordered vs unordered selections

**Problem.** A club has $8$ students. First, choose $3$ students for distinct offices: president, vice president, and secretary. Second, choose $3$ students for an ordinary committee with no titles. Compute both counts and explain why they differ.

**Solution.**

For the officer selection, order matters because assigning Alice president and Ben vice president is different from assigning Ben president and Alice vice president.

Use the permutation formula

$$
P(n,r)=\frac{n!}{(n-r)!}.
$$

Here $n=8$ and $r=3$, so

$$
P(8,3)=\frac{8!}{(8-3)!}=\frac{8!}{5!}.
$$

Expand only the factors not canceled by $5!$:

$$
\frac{8!}{5!}=\frac{8\cdot 7\cdot 6\cdot 5!}{5!}=8\cdot 7\cdot 6.
$$

Multiply step by step:

$$
8\cdot 7=56,
$$

$$
56\cdot 6=336.
$$

Thus the number of ordered officer assignments is

$$
\boxed{P(8,3)=336}.
$$

For the committee selection, order does not matter. A set such as $\{\text{Alice},\text{Ben},\text{Cara}\}$ is the same committee regardless of the order in which the names are listed.

Use the combination formula

$$
C(n,r)=\frac{n!}{r!(n-r)!}.
$$

With $n=8$ and $r=3$,

$$
C(8,3)=\frac{8!}{3!(8-3)!}=\frac{8!}{3!5!}.
$$

Cancel $5!$:

$$
C(8,3)=\frac{8\cdot 7\cdot 6\cdot 5!}{3!5!}=\frac{8\cdot 7\cdot 6}{3!}.
$$

Since

$$
3!=3\cdot 2\cdot 1=6,
$$

we get

$$
C(8,3)=\frac{8\cdot 7\cdot 6}{6}=8\cdot 7=56.
$$

Therefore

$$
\boxed{C(8,3)=56}.
$$

The ordered count is larger by a factor of $3!$ because each unordered committee of $3$ students can be assigned to the $3$ officer roles in $3!$ ways:

$$
336=56\cdot 6=56\cdot 3!.
$$

So the final comparison is

$$
\boxed{\text{officers: }336 \qquad \text{committee: }56}.
$$

#### E2. Bayes' rule for a medical test

**Problem.** A disease has prevalence $1\%$. A test has sensitivity $95\%$, meaning $P(+\mid D)=0.95$, and specificity $90\%$, meaning $P(-\mid D^c)=0.90$. If a person tests positive, compute $P(D\mid +)$.

**Solution.**

Translate the given information:

$$
P(D)=0.01, \qquad P(D^c)=1-P(D)=0.99,
$$

$$
P(+\mid D)=0.95.
$$

Specificity is the probability of a negative test when there is no disease:

$$
P(-\mid D^c)=0.90.
$$

Therefore the false positive probability is

$$
P(+\mid D^c)=1-P(-\mid D^c)=1-0.90=0.10.
$$

Bayes' rule gives

$$
P(D\mid +)=\frac{P(+\mid D)P(D)}{P(+)}.
$$

The denominator $P(+)$ is found by total probability over the partition $D,D^c$:

$$
P(+)=P(+\mid D)P(D)+P(+\mid D^c)P(D^c).
$$

Substitute the numbers:

$$
P(+)=0.95(0.01)+0.10(0.99).
$$

Compute the two contributions:

$$
0.95(0.01)=0.0095,
$$

$$
0.10(0.99)=0.099.
$$

Thus

$$
P(+)=0.0095+0.099=0.1085.
$$

Now substitute into Bayes' rule:

$$
P(D\mid +)=\frac{0.95(0.01)}{0.1085}=\frac{0.0095}{0.1085}.
$$

Convert the ratio:

$$
\frac{0.0095}{0.1085}=\frac{95}{1085}=\frac{19}{217}\approx 0.08756.
$$

Therefore

$$
\boxed{P(D\mid +)\approx 0.0876=8.76\%}.
$$

Even with a positive test, the posterior probability is under $10\%$ because the disease is rare and false positives are relatively common.

#### E3. Expectation and variance of a discrete random variable

**Problem.** Let $X\in\{0,1,2\}$ with

$$
P(X=0)=0.2,\qquad P(X=1)=0.5,\qquad P(X=2)=0.3.
$$

Compute $E[X]$, $E[X^2]$, $\operatorname{Var}(X)$, and $\sigma$.

**Solution.**

First compute expectation using

$$
E[X]=\sum_i x_i f(x_i).
$$

List each weighted value:

$$
0\cdot P(X=0)=0\cdot 0.2=0,
$$

$$
1\cdot P(X=1)=1\cdot 0.5=0.5,
$$

$$
2\cdot P(X=2)=2\cdot 0.3=0.6.
$$

Add them:

$$
E[X]=0+0.5+0.6=1.1.
$$

So

$$
\boxed{E[X]=1.1}.
$$

Now compute the second moment:

$$
E[X^2]=\sum_i x_i^2 f(x_i).
$$

Evaluate each term:

$$
0^2\cdot 0.2=0,
$$

$$
1^2\cdot 0.5=0.5,
$$

$$
2^2\cdot 0.3=4\cdot 0.3=1.2.
$$

Therefore

$$
E[X^2]=0+0.5+1.2=1.7.
$$

So

$$
\boxed{E[X^2]=1.7}.
$$

Use the computational variance formula

$$
\operatorname{Var}(X)=E[X^2]-E[X]^2.
$$

Substitute:

$$
\operatorname{Var}(X)=1.7-(1.1)^2.
$$

Since

$$
(1.1)^2=1.21,
$$

we have

$$
\operatorname{Var}(X)=1.7-1.21=0.49.
$$

Thus

$$
\boxed{\operatorname{Var}(X)=0.49}.
$$

Finally, the standard deviation is

$$
\sigma=\sqrt{\operatorname{Var}(X)}=\sqrt{0.49}=0.7.
$$

Hence

$$
\boxed{\sigma=0.7}.
$$

#### E4. CDF differences for interval probability

**Problem.** A random variable $X$ has CDF values $F(1)=0.25$ and $F(3)=0.80$. Compute $P(1<X\leq 3)$ and state the endpoint convention.

**Solution.**

By definition, the CDF is

$$
F(x)=P(X\leq x).
$$

The event $1<X\leq 3$ includes all outcomes at or below $3$, but excludes all outcomes at or below $1$.

The reference interval identity is

$$
P(a<X\leq b)=F(b)-F(a).
$$

Here $a=1$ and $b=3$, so

$$
P(1<X\leq 3)=F(3)-F(1).
$$

Substitute the given CDF values:

$$
P(1<X\leq 3)=0.80-0.25.
$$

Subtract:

$$
0.80-0.25=0.55.
$$

Therefore

$$
\boxed{P(1<X\leq 3)=0.55}.
$$

The endpoint convention is important: $F(1)=P(X\leq 1)$ is subtracted, so probability at $X=1$ is excluded; $F(3)=P(X\leq 3)$ is retained, so probability at $X=3$ is included.

#### E5. Covariance and correlation by hand

**Problem.** Treat the three paired observations

$$
(1,2),\qquad (2,4),\qquad (3,3)
$$

as equally likely outcomes of random variables $(X,Y)$. Compute $\mu_X$, $\mu_Y$, $\operatorname{Cov}(X,Y)$, $\sigma_X$, $\sigma_Y$, and $\rho_{XY}$.

**Solution.**

Since the three observations are equally likely, each has probability $1/3$.

Compute the means:

$$
\mu_X=E[X]=\frac{1+2+3}{3}=\frac{6}{3}=2,
$$

$$
\mu_Y=E[Y]=\frac{2+4+3}{3}=\frac{9}{3}=3.
$$

So

$$
\boxed{\mu_X=2,\qquad \mu_Y=3}.
$$

Use the covariance definition

$$
\operatorname{Cov}(X,Y)=E[(X-\mu_X)(Y-\mu_Y)].
$$

Make a centered table:

| Observation | $X-\mu_X$ | $Y-\mu_Y$ | $(X-\mu_X)(Y-\mu_Y)$ |
|---|---:|---:|---:|
| $(1,2)$ | $1-2=-1$ | $2-3=-1$ | $(-1)(-1)=1$ |
| $(2,4)$ | $2-2=0$ | $4-3=1$ | $(0)(1)=0$ |
| $(3,3)$ | $3-2=1$ | $3-3=0$ | $(1)(0)=0$ |

Average the centered products:

$$
\operatorname{Cov}(X,Y)=\frac{1+0+0}{3}=\frac{1}{3}.
$$

Thus

$$
\boxed{\operatorname{Cov}(X,Y)=\frac{1}{3}}.
$$

Now compute the variances. For $X$,

$$
\operatorname{Var}(X)=E[(X-\mu_X)^2]=\frac{(-1)^2+0^2+1^2}{3}=\frac{1+0+1}{3}=\frac{2}{3}.
$$

For $Y$,

$$
\operatorname{Var}(Y)=E[(Y-\mu_Y)^2]=\frac{(-1)^2+1^2+0^2}{3}=\frac{1+1+0}{3}=\frac{2}{3}.
$$

Therefore

$$
\sigma_X=\sqrt{\frac{2}{3}},\qquad \sigma_Y=\sqrt{\frac{2}{3}}.
$$

So

$$
\boxed{\sigma_X=\sigma_Y=\sqrt{\frac{2}{3}}}.
$$

Finally, correlation is

$$
\rho_{XY}=\frac{\sigma^2_{XY}}{\sigma_X\sigma_Y}=\frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}.
$$

Substitute:

$$
\rho_{XY}=\frac{\frac{1}{3}}{\sqrt{\frac{2}{3}}\sqrt{\frac{2}{3}}}.
$$

Since

$$
\sqrt{\frac{2}{3}}\sqrt{\frac{2}{3}}=\frac{2}{3},
$$

we get

$$
\rho_{XY}=\frac{\frac{1}{3}}{\frac{2}{3}}=\frac{1}{3}\cdot \frac{3}{2}=\frac{1}{2}.
$$

Hence

$$
\boxed{\rho_{XY}=\frac{1}{2}=0.5}.
$$

The positive value means the paired values tend to move together, but not perfectly.

### 🔴 Advanced

#### A1. Extended Bayes with three hypotheses

**Problem.** Three mutually exclusive and exhaustive hypotheses $H_1,H_2,H_3$ have priors

$$
P(H_1)=0.5,\qquad P(H_2)=0.3,\qquad P(H_3)=0.2.
$$

For evidence $B$, the likelihoods are

$$
P(B\mid H_1)=0.1,\qquad P(B\mid H_2)=0.4,\qquad P(B\mid H_3)=0.8.
$$

Compute $P(H_1\mid B)$, $P(H_2\mid B)$, and $P(H_3\mid B)$.

**Solution.**

Because $H_1,H_2,H_3$ form a partition, use extended Bayes' rule:

$$
P(H_k\mid B)=\frac{P(B\mid H_k)P(H_k)}{\sum_{i=1}^3 P(B\mid H_i)P(H_i)}.
$$

Compute each unnormalized posterior weight, likelihood times prior:

$$
w_1=P(B\mid H_1)P(H_1)=0.1(0.5)=0.05,
$$

$$
w_2=P(B\mid H_2)P(H_2)=0.4(0.3)=0.12,
$$

$$
w_3=P(B\mid H_3)P(H_3)=0.8(0.2)=0.16.
$$

The normalizing denominator is the total probability of the evidence:

$$
P(B)=w_1+w_2+w_3=0.05+0.12+0.16=0.33.
$$

Now normalize each weight. For $H_1$,

$$
P(H_1\mid B)=\frac{0.05}{0.33}=\frac{5}{33}\approx 0.1515.
$$

For $H_2$,

$$
P(H_2\mid B)=\frac{0.12}{0.33}=\frac{12}{33}=\frac{4}{11}\approx 0.3636.
$$

For $H_3$,

$$
P(H_3\mid B)=\frac{0.16}{0.33}=\frac{16}{33}\approx 0.4848.
$$

Check that the posterior probabilities sum to one:

$$
\frac{5}{33}+\frac{12}{33}+\frac{16}{33}=\frac{33}{33}=1.
$$

Thus

$$
\boxed{P(H_1\mid B)=\frac{5}{33}\approx 0.1515,\quad P(H_2\mid B)=\frac{4}{11}\approx 0.3636,\quad P(H_3\mid B)=\frac{16}{33}\approx 0.4848}.
$$

Although $H_1$ had the largest prior, $H_3$ has the largest posterior because it gives the evidence much higher likelihood.

#### A2. Transform a uniform random variable

**Problem.** Let $X\sim \mathcal{U}(0,1)$ and define $Y=X^2$. Derive $F_Y(y)$ and $f_Y(y)$.

**Solution.**

Since $X\sim \mathcal{U}(0,1)$, its density is

$$
f_X(x)=\frac{1}{1-0}=1,\qquad 0\leq x\leq 1.
$$

Because $Y=X^2$ and $0\leq X\leq 1$, the possible values of $Y$ are

$$
0\leq Y\leq 1.
$$

Start with the CDF:

$$
F_Y(y)=P(Y\leq y).
$$

Substitute $Y=X^2$:

$$
F_Y(y)=P(X^2\leq y).
$$

Now consider ranges of $y$.

If $y<0$, then $X^2\leq y$ is impossible because $X^2\geq 0$, so

$$
F_Y(y)=0,\qquad y<0.
$$

If $0\leq y\leq 1$, then $X\geq 0$, so $X^2\leq y$ is equivalent to $X\leq \sqrt{y}$:

$$
F_Y(y)=P(X\leq \sqrt{y}).
$$

For a uniform random variable on $[0,1]$,

$$
P(X\leq t)=t \quad \text{for } 0\leq t\leq 1.
$$

Using $t=\sqrt y$,

$$
F_Y(y)=\sqrt y,\qquad 0\leq y\leq 1.
$$

If $y>1$, then $X^2\leq y$ always holds because $X^2\leq 1$, so

$$
F_Y(y)=1,\qquad y>1.
$$

Therefore

$$
\boxed{F_Y(y)=\begin{cases}
0, & y<0,\\
\sqrt y, & 0\leq y\leq 1,\\
1, & y>1.
\end{cases}}
$$

Now derive the density by differentiating the CDF on $(0,1)$:

$$
f_Y(y)=\frac{d}{dy}F_Y(y)=\frac{d}{dy}y^{1/2}.
$$

Use the power rule:

$$
\frac{d}{dy}y^{1/2}=\frac{1}{2}y^{-1/2}=\frac{1}{2\sqrt y}.
$$

Thus

$$
f_Y(y)=\frac{1}{2\sqrt y},\qquad 0<y<1.
$$

The density is $0$ outside the support, so

$$
\boxed{f_Y(y)=\begin{cases}
\dfrac{1}{2\sqrt y}, & 0<y<1,\\
0, & \text{otherwise.}
\end{cases}}
$$

This matches the transformation formula. Since $y=x^2$, the inverse on $[0,1]$ is $x=\sqrt y$, and

$$
\left|\frac{dx}{dy}\right|=\left|\frac{1}{2\sqrt y}\right|=\frac{1}{2\sqrt y}.
$$

Therefore

$$
f_Y(y)=f_X(x)\left|\frac{dx}{dy}\right|=1\cdot \frac{1}{2\sqrt y}=\frac{1}{2\sqrt y}.
$$

#### A3. Marginalize and condition from a joint table

**Problem.** Suppose $X\in\{0,1\}$ and $Y\in\{0,1,2\}$ have joint PMF

|  | $Y=0$ | $Y=1$ | $Y=2$ |
|---|---:|---:|---:|
| $X=0$ | $0.10$ | $0.20$ | $0.10$ |
| $X=1$ | $0.15$ | $0.25$ | $0.20$ |

Compute the marginals $f_X$ and $f_Y$, compute $P(X=1\mid Y=1)$ and $P(Y=2\mid X=0)$, and test whether $X$ and $Y$ are independent.

**Solution.**

First verify that the table is a valid joint PMF by summing all entries:

$$
0.10+0.20+0.10+0.15+0.25+0.20=1.00.
$$

So the probabilities sum to one.

The marginal of $X$ is found by summing over $Y$:

$$
f_X(x_i)=\sum_j f_{XY}(x_i,y_j).
$$

For $X=0$,

$$
f_X(0)=0.10+0.20+0.10=0.40.
$$

For $X=1$,

$$
f_X(1)=0.15+0.25+0.20=0.60.
$$

Thus

$$
\boxed{f_X(0)=0.40,\qquad f_X(1)=0.60}.
$$

The marginal of $Y$ is found by summing over $X$:

$$
f_Y(0)=0.10+0.15=0.25,
$$

$$
f_Y(1)=0.20+0.25=0.45,
$$

$$
f_Y(2)=0.10+0.20=0.30.
$$

So

$$
\boxed{f_Y(0)=0.25,\qquad f_Y(1)=0.45,\qquad f_Y(2)=0.30}.
$$

Now compute the conditional probability $P(X=1\mid Y=1)$. Use

$$
f_{X|Y}(x)=\frac{f_{XY}(x,y)}{f_Y(y)}.
$$

With $x=1$ and $y=1$,

$$
P(X=1\mid Y=1)=\frac{P(X=1,Y=1)}{P(Y=1)}.
$$

Substitute from the table and the marginal:

$$
P(X=1\mid Y=1)=\frac{0.25}{0.45}=\frac{25}{45}=\frac{5}{9}\approx 0.5556.
$$

Thus

$$
\boxed{P(X=1\mid Y=1)=\frac{5}{9}\approx 0.5556}.
$$

Now compute $P(Y=2\mid X=0)$:

$$
P(Y=2\mid X=0)=\frac{P(X=0,Y=2)}{P(X=0)}.
$$

Substitute:

$$
P(Y=2\mid X=0)=\frac{0.10}{0.40}=0.25.
$$

So

$$
\boxed{P(Y=2\mid X=0)=0.25}.
$$

To test independence, check whether

$$
f_{XY}(x,y)=f_X(x)f_Y(y)
$$

for all pairs. It is enough to find one pair that fails.

For $(X=0,Y=0)$, the joint table gives

$$
f_{XY}(0,0)=0.10.
$$

The product of marginals is

$$
f_X(0)f_Y(0)=0.40\cdot 0.25=0.10.
$$

This pair matches, but we must not stop because independence requires all pairs to match.

For $(X=0,Y=1)$,

$$
f_{XY}(0,1)=0.20.
$$

The product of marginals is

$$
f_X(0)f_Y(1)=0.40\cdot 0.45=0.18.
$$

Since

$$
0.20\neq 0.18,
$$

$X$ and $Y$ are not independent.

Therefore

$$
\boxed{X\text{ and }Y\text{ are not independent}.}
$$

#### A4. Chebyshev bound from mean and variance

**Problem.** A random variable $X$ has mean $\mu=50$ and standard deviation $\sigma=5$. Use Chebyshev's inequality to bound

$$
P(|X-50|\geq 15).
$$

Interpret the result.

**Solution.**

Chebyshev's inequality states that for $k,\sigma>0$,

$$
P(|X-\mu|\geq k\sigma)\leq \frac{1}{k^2}.
$$

Here the event is

$$
|X-50|\geq 15.
$$

Because $\mu=50$ and $\sigma=5$, write $15$ as a multiple of $\sigma$:

$$
15=k\sigma=k(5).
$$

Solve for $k$:

$$
k=\frac{15}{5}=3.
$$

So the event is

$$
|X-50|\geq 3\sigma.
$$

Apply Chebyshev's inequality:

$$
P(|X-50|\geq 15)=P(|X-\mu|\geq 3\sigma)\leq \frac{1}{3^2}.
$$

Compute the bound:

$$
\frac{1}{3^2}=\frac{1}{9}\approx 0.1111.
$$

Thus

$$
\boxed{P(|X-50|\geq 15)\leq \frac{1}{9}\approx 0.1111}.
$$

Equivalently, the probability of being within $15$ units of the mean is at least

$$
P(|X-50|<15)=1-P(|X-50|\geq 15)\geq 1-\frac{1}{9}=\frac{8}{9}\approx 0.8889.
$$

So

$$
\boxed{P(35<X<65)\geq \frac{8}{9}\approx 88.89\%}.
$$

This is a conservative distribution-free bound: it uses only the mean and standard deviation, not the exact shape of the distribution.

#### A5. Estimator bias and CLT standard error

**Problem.** Let $X_1,\ldots,X_{64}$ be a random sample from a population with mean $\mu=10$ and standard deviation $\sigma=8$. Compare the variance estimators

$$
\hat{\sigma}^2_{\mathrm{biased}}=\frac{1}{n}\sum_{i=1}^n (X_i-\overline X)^2
$$

and

$$
s^2=\hat{\sigma}^2=\frac{1}{n-1}\sum_{i=1}^n (X_i-\overline X)^2.
$$

Then use the Central Limit Theorem to approximate the distribution of $\overline X$.

**Solution.**

The sample mean is

$$
\overline{X}=\frac{1}{n}\sum_{i=1}^n X_i.
$$

The reference sample variance uses denominator $n-1$:

$$
s^2=\hat{\sigma}^2=\frac{1}{n-1}\sum_{i=1}^n (X_i-\overline{X})^2.
$$

The reason is bias. Bias is defined as

$$
\operatorname{Bias}(\hat{\theta})=E[\hat{\theta}]-\theta.
$$

For the denominator-$n$ variance estimator, a standard identity gives

$$
E\left[\frac{1}{n}\sum_{i=1}^n (X_i-\overline X)^2\right]=\frac{n-1}{n}\sigma^2.
$$

Therefore its bias is

$$
\operatorname{Bias}(\hat{\sigma}^2_{\mathrm{biased}})=E[\hat{\sigma}^2_{\mathrm{biased}}]-\sigma^2.
$$

Substitute the expectation:

$$
\operatorname{Bias}(\hat{\sigma}^2_{\mathrm{biased}})=\frac{n-1}{n}\sigma^2-\sigma^2.
$$

Factor out $\sigma^2$:

$$
\operatorname{Bias}(\hat{\sigma}^2_{\mathrm{biased}})=\left(\frac{n-1}{n}-1\right)\sigma^2.
$$

Put the terms over a common denominator:

$$
\frac{n-1}{n}-1=\frac{n-1}{n}-\frac{n}{n}=\frac{-1}{n}.
$$

Thus

$$
\operatorname{Bias}(\hat{\sigma}^2_{\mathrm{biased}})=-\frac{\sigma^2}{n}.
$$

With $n=64$ and $\sigma=8$, the population variance is

$$
\sigma^2=8^2=64.
$$

So the bias is

$$
-\frac{\sigma^2}{n}=-\frac{64}{64}=-1.
$$

Hence

$$
\boxed{\operatorname{Bias}(\hat{\sigma}^2_{\mathrm{biased}})=-1}.
$$

This means the denominator-$n$ estimator underestimates the population variance by $1$ on average in this setting.

For the denominator-$(n-1)$ estimator,

$$
s^2=\frac{1}{n-1}\sum_{i=1}^n (X_i-\overline X)^2.
$$

Using the same identity,

$$
E\left[\sum_{i=1}^n (X_i-\overline X)^2\right]=(n-1)\sigma^2.
$$

Therefore

$$
E[s^2]=E\left[\frac{1}{n-1}\sum_{i=1}^n (X_i-\overline X)^2\right].
$$

Move the constant outside expectation:

$$
E[s^2]=\frac{1}{n-1}E\left[\sum_{i=1}^n (X_i-\overline X)^2\right].
$$

Substitute:

$$
E[s^2]=\frac{1}{n-1}(n-1)\sigma^2=\sigma^2.
$$

Thus

$$
\operatorname{Bias}(s^2)=E[s^2]-\sigma^2=\sigma^2-\sigma^2=0,
$$

so

$$
\boxed{s^2\text{ is unbiased for }\sigma^2}.
$$

Now apply the Central Limit Theorem. The reference form is

$$
\overline{X}\underset{n\to +\infty}{\sim}\mathcal{N}\left(\mu,\frac{\sigma}{\sqrt{n}}\right).
$$

Here

$$
\mu=10,\qquad \sigma=8,\qquad n=64.
$$

Compute the standard error:

$$
\frac{\sigma}{\sqrt n}=\frac{8}{\sqrt{64}}.
$$

Since

$$
\sqrt{64}=8,
$$

we have

$$
\frac{8}{\sqrt{64}}=\frac{8}{8}=1.
$$

Therefore the CLT approximation is

$$
\overline X\approx \mathcal{N}(10,1).
$$

In the reference notation, the second parameter is the standard error, so the approximate mean is $10$ and approximate standard deviation is $1$.

Thus

$$
\boxed{\overline X\approx \mathcal{N}(10,1)}.
$$
