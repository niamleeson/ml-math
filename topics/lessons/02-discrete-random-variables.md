# Discrete Random Variables
> **Source:** Probability (MIT) · **Category:** Distributions/Formula · **Type:** 🧮 Numeric · [↑ Full reference](../../ai-ml-cheatsheets.md)

## 1. Overview

Discrete random variables turn outcomes of a random experiment into numbers. Once we know the probability mass function (PMF), questions about likelihood, average value, spread, conditioning, and independence become sums over possible values.

**Intuition:** a discrete random variable is a weighted list of possible numbers, and probability theory tells us how to add those weights correctly.

## 2. Key Idea

### Random variables and PMFs

A **random variable** is a function of the sample space $\Omega$ into the real numbers (or $\mathbb{R}^n$). Its range can be discrete or continuous.

For a discrete random variable $X$, the **probability mass function (PMF)** is

$$
p_X(x)=\mathbb{P}(X=x)=\mathbb{P}(\{\omega \in \Omega:X(\omega)=x\}).
$$

It must satisfy

$$
p_X(x)\geq 0,\ \forall x,
$$

and

$$
\sum_x p_X(x)=1.
$$

**Interpretation:** the PMF assigns a nonnegative probability to each possible value, and all probabilities add to one.

### Expectation

The **expectation** or mean of a discrete random variable is

$$
\mathbb{E}[X]\triangleq \sum_x xp_X(x),
$$

assuming $\sum_x |x|p_X(x)<\infty$.

**Interpretation:** $\mathbb{E}[X]$ is the long-run weighted average value of $X$.

Useful properties are:

- If $X\geq 0$ then $\mathbb{E}[X]\geq 0$.
- If $a\leq X\leq b$ then $a\leq \mathbb{E}[X]\leq b$.
- If $X=c$ then $\mathbb{E}[X]=c$.

### Expected value rule

If $Y=g(X)$, then

$$
\sum_y yp_Y(y)=\mathbb{E}[Y]=\mathbb{E}[g(X)]=\sum_x g(x)p_X(x).
$$

The PMF of $Y=g(X)$ is

$$
p_Y(y)=\sum_{\{x:g(x)=y\}}p_X(x).
$$

**Interpretation:** to average a function of $X$, apply the function to each possible value of $X$ and weight by the original PMF.

In general,

$$
g(\mathbb{E}[X])\neq \mathbb{E}[g(X)],
$$

except for linear functions $g(x)=ax+b$.

### Variance and standard deviation

If $\mu=\mathbb{E}[X]$, then

$$
\operatorname{Var}(X)\triangleq \mathbb{E}[(X-\mu)^2]=\sum_x (x-\mu)^2p_X(x).
$$

An equivalent computational formula is

$$
\operatorname{Var}(X)=\mathbb{E}[X^2]-(\mathbb{E}[X])^2.
$$

The standard deviation is

$$
\sigma_X=\sqrt{\operatorname{Var}(X)}.
$$

Variance scaling rules are:

- $\operatorname{Var}(aX)=a^2\operatorname{Var}(X)$, for all $a\in\mathbb{R}$.
- $\operatorname{Var}(X+b)=\operatorname{Var}(X)$, for all $b\in\mathbb{R}$.
- $\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)$.

**Interpretation:** variance measures average squared distance from the mean; shifting does not change spread, but scaling by $a$ multiplies spread by $a^2$.

### Named discrete distributions

#### Bernoulli

A Bernoulli random variable $X$ with parameter $0\leq p\leq 1$, written $X\sim \operatorname{Ber}(p)$, is

$$
X=\begin{cases}
1 & \text{w.p. } p,\\
0 & \text{w.p. } 1-p.
\end{cases}
$$

Its mean and variance are

$$
\mathbb{E}[X]=p,
$$

and

$$
\operatorname{Var}(X)=p(1-p).
$$

If $X=I_A$ is the indicator of event $A$, then

$$
\mathbb{E}[X]=\mathbb{P}(A).
$$

**Interpretation:** a Bernoulli variable is one yes/no trial, and its average equals the probability of yes.

#### Discrete uniform

A discrete uniform random variable $X$ between $a$ and $b$ with $a\leq b$, written $X\sim \operatorname{Unif}_{a,b}()$, takes values in

$$
\{a,a+1,\ldots,b\}
$$

with probability

$$
\frac{1}{b-a+1}
$$

for each value. Its mean and variance are

$$
\mathbb{E}[X]=\frac{a+b}{2},
$$

and

$$
\operatorname{Var}(X)=\frac{(b-a)(b-a+2)}{12}.
$$

**Interpretation:** every integer in the interval is equally likely, so the mean is the midpoint.

#### Binomial

A binomial random variable $X\sim \operatorname{Bin}(n,p)$ takes values in $\{0,1,\ldots,n\}$ with probabilities

$$
p_X(i)=\binom{n}{i}p^i(1-p)^{n-i}.
$$

It represents the number of successes in $n$ independent trials with success probability $p$. Its mean and variance are

$$
\mathbb{E}[X]=np,
$$

and

$$
\operatorname{Var}(X)=np(1-p).
$$

**Interpretation:** a binomial variable counts how many successes occur across repeated independent Bernoulli trials.

#### Geometric

A geometric random variable $X\sim \operatorname{Geo}(p)$ takes values in $\{1,2,\ldots\}$ with probabilities

$$
p_X(i)=(1-p)^{i-1}p.
$$

It represents the number of independent trials until, and including, the first success. Its mean and variance are

$$
\mathbb{E}[X]=\frac{1}{p},
$$

and

$$
\operatorname{Var}(X)=\frac{1-p}{p^2}.
$$

**Interpretation:** a geometric variable is a waiting time; smaller $p$ means longer average waiting.

It is memoryless: when conditioning on $X>n$,

$$
p_{X-n\mid X>n}(i)=p_X(i).
$$

**Interpretation:** after failures have already occurred, the remaining waiting time has the same distribution as the original waiting time.

### Conditioning on an event

Given an event $A$ with $\mathbb{P}(A)>0$,

$$
p_{X\mid A}(x)=\mathbb{P}(X=x\mid A).
$$

If $A$ is a subset of the range of $X$, then

$$
p_{X\mid A}(x) \triangleq p_{X\mid X\in A}(x)=\begin{cases}
\frac{1}{\mathbb{P}(A)}p_X(x), & \text{if } x\in A,\\
0, & \text{otherwise.}
\end{cases}
$$

Then

$$
\sum_x p_{X\mid A}(x)=1,
$$

$$
\mathbb{E}[X\mid A]=\sum_x xp_{X\mid A}(x),
$$

and

$$
\mathbb{E}[g(X)\mid A]=\sum_x g(x)p_{X\mid A}(x).
$$

**Interpretation:** conditioning on an event restricts attention to outcomes inside the event and renormalizes their probabilities.

### Total expectation

For a partition of disjoint events $A_1,\ldots,A_n$ with $\sum_i \mathbb{P}(A_i)=1$ and $\mathbb{P}(A_i)>0$,

$$
\mathbb{E}[X]=\mathbb{P}(A_1)\mathbb{E}[X\mid A_1]+\cdots+\mathbb{P}(A_n)\mathbb{E}[X\mid A_n].
$$

For conditioning on another random variable $Y$,

$$
\mathbb{E}[X]=\sum_y p_Y(y)\mathbb{E}[X\mid Y=y].
$$

**Interpretation:** the overall average is a weighted average of conditional averages.

### Joint PMFs, marginals, and functions of multiple variables

The joint PMF of random variables $X_1,X_2,\ldots,X_n$ is

$$
p_{X_1,X_2,\ldots,X_n}(x_1,\ldots,x_n)=\mathbb{P}(X_1=x_1,\ldots,X_n=x_n).
$$

It satisfies

$$
\sum_{x_1}\sum_{x_2}\cdots\sum_{x_n}p_{X_1,\ldots,X_n}(x_1,\ldots,x_n)=1.
$$

Marginals are obtained by summing out variables:

$$
p_{X_1}(x_1)=\sum_{x_2}\cdots\sum_{x_n}p_{X_1,\ldots,X_n}(x_1,x_2,\ldots,x_n),
$$

and

$$
p_{X_2,\ldots,X_n}(x_2,\ldots,x_n)=\sum_{x_1}p_{X_1,X_2,\ldots,X_n}(x_1,x_2,\ldots,x_n).
$$

If $Z=g(X_1,\ldots,X_n)$, then

$$
p_Z(z)=\mathbb{P}(g(X_1,\ldots,X_n)=z).
$$

For $g:\mathbb{R}^n\to\mathbb{R}$,

$$
\mathbb{E}[g(X_1,\ldots,X_n)]=\sum_{x_1,\ldots,x_n}g(x_1,\ldots,x_n)p_{X_1,\ldots,X_n}(x_1,\ldots,x_n).
$$

**Interpretation:** joint PMFs describe simultaneous behavior; marginals forget variables by summing over them.

### Linearity

Linearity of expectation says

$$
\mathbb{E}[aX+b]=a\mathbb{E}[X]+b,
$$

and

$$
\mathbb{E}[X_1+\cdots+X_n]=\mathbb{E}[X_1]+\cdots+\mathbb{E}[X_n].
$$

**Interpretation:** expectations add even when the random variables are not independent.

### Conditional PMF given another random variable

For discrete random variables $X,Y$ and $y$ such that $p_Y(y)>0$,

$$
p_{X\mid Y}(x\mid y)=\frac{p_{X,Y}(x,y)}{p_Y(y)}.
$$

The multiplication rule is

$$
p_{X,Y}(x,y)=p_X(x)p_{Y\mid X}(y\mid x)=p_Y(y)p_{X\mid Y}(x\mid y).
$$

Conditional expectation is

$$
\mathbb{E}[X\mid Y=y]=\sum_x xp_{X\mid Y}(x\mid y),
$$

and

$$
\mathbb{E}[g(X)\mid Y=y]=\sum_x g(x)p_{X\mid Y}(x\mid y).
$$

The total probability theorem is

$$
p_X(x)=\sum_y p_Y(y)p_{X\mid Y}(x\mid y).
$$

**Interpretation:** conditioning on $Y=y$ means using the row or column of the joint PMF consistent with that observed value, then renormalizing.

### Independence

A random variable $X$ and an event $A$ are independent if

$$
\mathbb{P}(X=x \text{ and } A)=p_X(x)\mathbb{P}(A),
$$

for all $x$.

Two discrete random variables $X$ and $Y$ are independent if

$$
p_{X,Y}(x,y)=p_X(x)p_Y(y)
$$

for all $x,y$.

A collection $X_1,X_2,\ldots,X_n$ is independent if

$$
p_{X_1,\ldots,X_n}(x_1,\ldots,x_n)=p_{X_1}(x_1)\cdots p_{X_n}(x_n),\ \forall x_1,\ldots,x_n.
$$

If $X$ and $Y$ are independent, then

$$
\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y],
$$

and more generally,

$$
\mathbb{E}[g(X)h(Y)]=\mathbb{E}[g(X)]\mathbb{E}[h(Y)].
$$

If $X$ and $Y$ are independent, then

$$
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y).
$$

**Interpretation:** independence means learning one variable does not change the distribution of the other; product expectations and variance additivity require this stronger structure.

## 3. Worked Examples

### 🟢 Easy

#### E1. Validate and summarize a PMF

**Problem.** Let $X\in\{0,1,2,3\}$ with probabilities

$$
p_X(0)=0.1,\quad p_X(1)=0.2,\quad p_X(2)=0.4,\quad p_X(3)=0.3.
$$

Check that this is a valid PMF. Then compute $\mathbb{P}(X\geq 2)$, $\mathbb{E}[X]$, and $\mathbb{E}[X^2]$.

**Solution.**

First check nonnegativity:

$$
0.1\geq 0,\quad 0.2\geq 0,\quad 0.4\geq 0,\quad 0.3\geq 0.
$$

Each probability is nonnegative, so the first PMF property holds.

Now check normalization:

$$
\sum_x p_X(x)=p_X(0)+p_X(1)+p_X(2)+p_X(3).
$$

Substitute the probabilities:

$$
\sum_x p_X(x)=0.1+0.2+0.4+0.3.
$$

Add from left to right:

$$
0.1+0.2=0.3,
$$

$$
0.3+0.4=0.7,
$$

$$
0.7+0.3=1.0.
$$

Thus

$$
\sum_x p_X(x)=1.
$$

The PMF is valid because its probabilities are nonnegative and sum to one.

Next compute the event probability. The event $X\geq 2$ means $X=2$ or $X=3$:

$$
\mathbb{P}(X\geq 2)=p_X(2)+p_X(3).
$$

Substitute values:

$$
\mathbb{P}(X\geq 2)=0.4+0.3=0.7.
$$

Now compute the expectation using $\mathbb{E}[X]=\sum_x xp_X(x)$:

$$
\mathbb{E}[X]=0\cdot p_X(0)+1\cdot p_X(1)+2\cdot p_X(2)+3\cdot p_X(3).
$$

Substitute probabilities:

$$
\mathbb{E}[X]=0\cdot 0.1+1\cdot 0.2+2\cdot 0.4+3\cdot 0.3.
$$

Multiply each value by its probability:

$$
0\cdot 0.1=0,
$$

$$
1\cdot 0.2=0.2,
$$

$$
2\cdot 0.4=0.8,
$$

$$
3\cdot 0.3=0.9.
$$

Add the weighted values:

$$
\mathbb{E}[X]=0+0.2+0.8+0.9=1.9.
$$

Now compute $\mathbb{E}[X^2]$ using the expected value rule with $g(x)=x^2$:

$$
\mathbb{E}[X^2]=\sum_x x^2p_X(x).
$$

Write all terms:

$$
\mathbb{E}[X^2]=0^2\cdot0.1+1^2\cdot0.2+2^2\cdot0.4+3^2\cdot0.3.
$$

Evaluate powers:

$$
0^2=0,\quad 1^2=1,\quad 2^2=4,\quad 3^2=9.
$$

Substitute:

$$
\mathbb{E}[X^2]=0\cdot0.1+1\cdot0.2+4\cdot0.4+9\cdot0.3.
$$

Multiply:

$$
0\cdot0.1=0,
$$

$$
1\cdot0.2=0.2,
$$

$$
4\cdot0.4=1.6,
$$

$$
9\cdot0.3=2.7.
$$

Add:

$$
\mathbb{E}[X^2]=0+0.2+1.6+2.7=4.5.
$$

Therefore,

$$
\boxed{\text{valid PMF},\quad \mathbb{P}(X\geq2)=0.7,\quad \mathbb{E}[X]=1.9,\quad \mathbb{E}[X^2]=4.5.}
$$

#### E2. Bernoulli as an indicator

**Problem.** Event $A$ has probability $0.35$. Define $I_A=1$ if $A$ occurs and $I_A=0$ otherwise. Show that $I_A\sim\operatorname{Ber}(0.35)$, then derive $\mathbb{E}[I_A]=\mathbb{P}(A)$ and $\operatorname{Var}(I_A)=p(1-p)$ for $p=0.35$.

**Solution.**

By definition of the indicator variable,

$$
I_A=\begin{cases}
1, & \text{if } A \text{ occurs},\\
0, & \text{if } A \text{ does not occur}.
\end{cases}
$$

Since $\mathbb{P}(A)=0.35$,

$$
\mathbb{P}(I_A=1)=\mathbb{P}(A)=0.35.
$$

The complementary event has probability

$$
\mathbb{P}(A^c)=1-\mathbb{P}(A)=1-0.35=0.65.
$$

Therefore

$$
\mathbb{P}(I_A=0)=0.65.
$$

This matches the Bernoulli PMF with parameter $p=0.35$:

$$
I_A=\begin{cases}
1 & \text{w.p. } 0.35,\\
0 & \text{w.p. } 1-0.35.
\end{cases}
$$

Thus

$$
I_A\sim\operatorname{Ber}(0.35).
$$

Now derive the expectation from the definition:

$$
\mathbb{E}[I_A]=\sum_i i\,p_{I_A}(i).
$$

The possible values are $0$ and $1$:

$$
\mathbb{E}[I_A]=0\cdot \mathbb{P}(I_A=0)+1\cdot \mathbb{P}(I_A=1).
$$

Substitute the probabilities:

$$
\mathbb{E}[I_A]=0\cdot0.65+1\cdot0.35.
$$

Compute:

$$
\mathbb{E}[I_A]=0+0.35=0.35.
$$

Since $\mathbb{P}(A)=0.35$,

$$
\mathbb{E}[I_A]=\mathbb{P}(A).
$$

For the variance, first compute $\mathbb{E}[I_A^2]$:

$$
\mathbb{E}[I_A^2]=0^2\cdot0.65+1^2\cdot0.35.
$$

Because $0^2=0$ and $1^2=1$,

$$
\mathbb{E}[I_A^2]=0\cdot0.65+1\cdot0.35=0.35.
$$

Use

$$
\operatorname{Var}(I_A)=\mathbb{E}[I_A^2]-(\mathbb{E}[I_A])^2.
$$

Substitute values:

$$
\operatorname{Var}(I_A)=0.35-(0.35)^2.
$$

Compute the square:

$$
(0.35)^2=0.1225.
$$

Subtract:

$$
\operatorname{Var}(I_A)=0.35-0.1225=0.2275.
$$

Equivalently,

$$
p(1-p)=0.35(1-0.35)=0.35\cdot0.65=0.2275.
$$

So

$$
\boxed{I_A\sim\operatorname{Ber}(0.35),\quad \mathbb{E}[I_A]=0.35=\mathbb{P}(A),\quad \operatorname{Var}(I_A)=0.2275.}
$$

#### E3. Binomial probability and mean

**Problem.** Let $X\sim\operatorname{Bin}(5,0.4)$. Compute $\mathbb{P}(X=2)$, $\mathbb{E}[X]$, and $\operatorname{Var}(X)$.

**Solution.**

For a binomial random variable,

$$
p_X(i)=\binom{n}{i}p^i(1-p)^{n-i}.
$$

Here $n=5$, $p=0.4$, and $i=2$, so

$$
\mathbb{P}(X=2)=\binom{5}{2}(0.4)^2(1-0.4)^{5-2}.
$$

Compute the failure probability:

$$
1-0.4=0.6.
$$

Compute the exponent:

$$
5-2=3.
$$

Therefore

$$
\mathbb{P}(X=2)=\binom{5}{2}(0.4)^2(0.6)^3.
$$

Compute the binomial coefficient:

$$
\binom{5}{2}=\frac{5!}{2!3!}=\frac{5\cdot4}{2\cdot1}=10.
$$

Compute powers:

$$
(0.4)^2=0.16,
$$

and

$$
(0.6)^3=0.6\cdot0.6\cdot0.6=0.216.
$$

Multiply all factors:

$$
\mathbb{P}(X=2)=10\cdot0.16\cdot0.216.
$$

First

$$
10\cdot0.16=1.6.
$$

Then

$$
1.6\cdot0.216=0.3456.
$$

So

$$
\mathbb{P}(X=2)=0.3456.
$$

For the mean of a binomial random variable,

$$
\mathbb{E}[X]=np.
$$

Substitute $n=5$ and $p=0.4$:

$$
\mathbb{E}[X]=5\cdot0.4=2.
$$

For the variance,

$$
\operatorname{Var}(X)=np(1-p).
$$

Substitute:

$$
\operatorname{Var}(X)=5\cdot0.4\cdot(1-0.4).
$$

Use $1-0.4=0.6$:

$$
\operatorname{Var}(X)=5\cdot0.4\cdot0.6.
$$

Compute:

$$
5\cdot0.4=2,
$$

so

$$
\operatorname{Var}(X)=2\cdot0.6=1.2.
$$

Thus

$$
\boxed{\mathbb{P}(X=2)=0.3456,\quad \mathbb{E}[X]=2,\quad \operatorname{Var}(X)=1.2.}
$$

#### E4. Geometric waiting time

**Problem.** Let $X\sim\operatorname{Geo}(0.2)$. Compute $\mathbb{P}(X=4)$, $\mathbb{P}(X>4)$, and $\mathbb{E}[X]$. Interpret the result as trials until first success.

**Solution.**

For $X\sim\operatorname{Geo}(p)$,

$$
p_X(i)=(1-p)^{i-1}p,
$$

where $X$ counts trials until and including the first success.

Here $p=0.2$, so the failure probability is

$$
1-p=1-0.2=0.8.
$$

To compute $\mathbb{P}(X=4)$, use $i=4$:

$$
\mathbb{P}(X=4)=(1-p)^{4-1}p.
$$

Substitute $p=0.2$:

$$
\mathbb{P}(X=4)=(0.8)^3(0.2).
$$

Compute the cube:

$$
(0.8)^3=0.8\cdot0.8\cdot0.8=0.512.
$$

Multiply by $0.2$:

$$
\mathbb{P}(X=4)=0.512\cdot0.2=0.1024.
$$

This means the first three trials fail and the fourth succeeds.

Now compute $\mathbb{P}(X>4)$. The event $X>4$ means no success occurs in the first four trials. Each failure has probability $0.8$, and trials are independent, so

$$
\mathbb{P}(X>4)=(0.8)^4.
$$

Compute:

$$
(0.8)^4=0.8\cdot0.8\cdot0.8\cdot0.8=0.4096.
$$

Now compute the mean of a geometric random variable:

$$
\mathbb{E}[X]=\frac{1}{p}.
$$

Substitute $p=0.2$:

$$
\mathbb{E}[X]=\frac{1}{0.2}=5.
$$

Interpretation: with success probability $0.2$ on each independent trial, the average waiting time until the first success is $5$ trials.

Therefore

$$
\boxed{\mathbb{P}(X=4)=0.1024,\quad \mathbb{P}(X>4)=0.4096,\quad \mathbb{E}[X]=5\text{ trials}.}
$$

#### E5. Expected value rule for a function

**Problem.** Let $X\in\{-1,0,2\}$ with probabilities

$$
p_X(-1)=0.2,\quad p_X(0)=0.5,\quad p_X(2)=0.3.
$$

Let $g(x)=x^2+1$. Compute $\mathbb{E}[g(X)]$ directly and compare it with $g(\mathbb{E}[X])$.

**Solution.**

First compute $\mathbb{E}[X]$:

$$
\mathbb{E}[X]=(-1)(0.2)+0(0.5)+2(0.3).
$$

Multiply each term:

$$
(-1)(0.2)=-0.2,
$$

$$
0(0.5)=0,
$$

$$
2(0.3)=0.6.
$$

Add:

$$
\mathbb{E}[X]=-0.2+0+0.6=0.4.
$$

Now compute $g(x)=x^2+1$ for each possible value of $X$:

$$
g(-1)=(-1)^2+1=1+1=2,
$$

$$
g(0)=0^2+1=0+1=1,
$$

$$
g(2)=2^2+1=4+1=5.
$$

Use the expected value rule:

$$
\mathbb{E}[g(X)]=\sum_x g(x)p_X(x).
$$

Substitute the three values:

$$
\mathbb{E}[g(X)]=g(-1)p_X(-1)+g(0)p_X(0)+g(2)p_X(2).
$$

Substitute numeric values:

$$
\mathbb{E}[g(X)]=2(0.2)+1(0.5)+5(0.3).
$$

Multiply:

$$
2(0.2)=0.4,
$$

$$
1(0.5)=0.5,
$$

$$
5(0.3)=1.5.
$$

Add:

$$
\mathbb{E}[g(X)]=0.4+0.5+1.5=2.4.
$$

Now compute $g(\mathbb{E}[X])$. Since $\mathbb{E}[X]=0.4$,

$$
g(\mathbb{E}[X])=g(0.4)=(0.4)^2+1.
$$

Compute the square:

$$
(0.4)^2=0.16.
$$

Therefore

$$
g(\mathbb{E}[X])=0.16+1=1.16.
$$

Compare the two quantities:

$$
\mathbb{E}[g(X)]=2.4,
$$

but

$$
g(\mathbb{E}[X])=1.16.
$$

They are not equal because $g(x)=x^2+1$ is nonlinear.

Thus

$$
\boxed{\mathbb{E}[g(X)]=2.4\neq1.16=g(\mathbb{E}[X]).}
$$

### 🔴 Advanced

#### A1. Conditional PMF after truncation

**Problem.** Let $X\sim\operatorname{Bin}(4,0.5)$ and condition on the event $A=\{X\geq2\}$. Find the conditional PMF $p_{X\mid A}$ and compute $\mathbb{E}[X\mid A]$.

**Solution.**

For $X\sim\operatorname{Bin}(4,0.5)$,

$$
p_X(i)=\binom{4}{i}(0.5)^i(1-0.5)^{4-i}.
$$

Since $1-0.5=0.5$,

$$
p_X(i)=\binom{4}{i}(0.5)^i(0.5)^{4-i}.
$$

Combine the powers of $0.5$:

$$
(0.5)^i(0.5)^{4-i}=(0.5)^4=\frac{1}{16}.
$$

So

$$
p_X(i)=\binom{4}{i}\frac{1}{16}.
$$

Compute the binomial probabilities:

$$
p_X(0)=\binom{4}{0}\frac{1}{16}=1\cdot\frac{1}{16}=\frac{1}{16},
$$

$$
p_X(1)=\binom{4}{1}\frac{1}{16}=4\cdot\frac{1}{16}=\frac{4}{16},
$$

$$
p_X(2)=\binom{4}{2}\frac{1}{16}=6\cdot\frac{1}{16}=\frac{6}{16},
$$

$$
p_X(3)=\binom{4}{3}\frac{1}{16}=4\cdot\frac{1}{16}=\frac{4}{16},
$$

$$
p_X(4)=\binom{4}{4}\frac{1}{16}=1\cdot\frac{1}{16}=\frac{1}{16}.
$$

The event $A=\{X\geq2\}$ includes $X=2,3,4$. Therefore

$$
\mathbb{P}(A)=p_X(2)+p_X(3)+p_X(4).
$$

Substitute:

$$
\mathbb{P}(A)=\frac{6}{16}+\frac{4}{16}+\frac{1}{16}=\frac{11}{16}.
$$

For conditioning on a subset of the range,

$$
p_{X\mid A}(x)=\begin{cases}
\frac{1}{\mathbb{P}(A)}p_X(x), & x\in A,\\
0, & x\notin A.
\end{cases}
$$

Thus for $x=0$ and $x=1$,

$$
p_{X\mid A}(0)=0,\quad p_{X\mid A}(1)=0.
$$

For $x=2$,

$$
p_{X\mid A}(2)=\frac{p_X(2)}{\mathbb{P}(A)}=\frac{6/16}{11/16}.
$$

Divide fractions:

$$
\frac{6/16}{11/16}=\frac{6}{16}\cdot\frac{16}{11}=\frac{6}{11}.
$$

For $x=3$,

$$
p_{X\mid A}(3)=\frac{4/16}{11/16}=\frac{4}{16}\cdot\frac{16}{11}=\frac{4}{11}.
$$

For $x=4$,

$$
p_{X\mid A}(4)=\frac{1/16}{11/16}=\frac{1}{16}\cdot\frac{16}{11}=\frac{1}{11}.
$$

Check normalization:

$$
\frac{6}{11}+\frac{4}{11}+\frac{1}{11}=\frac{11}{11}=1.
$$

Now compute conditional expectation:

$$
\mathbb{E}[X\mid A]=\sum_x xp_{X\mid A}(x).
$$

Only $x=2,3,4$ contribute:

$$
\mathbb{E}[X\mid A]=2\cdot\frac{6}{11}+3\cdot\frac{4}{11}+4\cdot\frac{1}{11}.
$$

Multiply each term:

$$
2\cdot\frac{6}{11}=\frac{12}{11},
$$

$$
3\cdot\frac{4}{11}=\frac{12}{11},
$$

$$
4\cdot\frac{1}{11}=\frac{4}{11}.
$$

Add:

$$
\mathbb{E}[X\mid A]=\frac{12}{11}+\frac{12}{11}+\frac{4}{11}=\frac{28}{11}.
$$

Therefore

$$
\boxed{p_{X\mid A}(2)=\frac{6}{11},\ p_{X\mid A}(3)=\frac{4}{11},\ p_{X\mid A}(4)=\frac{1}{11},\ \mathbb{E}[X\mid A]=\frac{28}{11}.}
$$

#### A2. Total expectation through a partition

**Problem.** A machine has state $Y\in\{\text{normal},\text{rush}\}$. Suppose

$$
\mathbb{P}(Y=\text{normal})=0.7,\quad \mathbb{P}(Y=\text{rush})=0.3,
$$

and

$$
\mathbb{E}[X\mid Y=\text{normal}]=2,\quad \mathbb{E}[X\mid Y=\text{rush}]=5.
$$

Use total expectation to compute $\mathbb{E}[X]$.

**Solution.**

The two events $Y=\text{normal}$ and $Y=\text{rush}$ form a partition because exactly one machine state occurs.

The total expectation rule gives

$$
\mathbb{E}[X]=\sum_y p_Y(y)\mathbb{E}[X\mid Y=y].
$$

With two states, this is

$$
\mathbb{E}[X]=\mathbb{P}(Y=\text{normal})\mathbb{E}[X\mid Y=\text{normal}]+\mathbb{P}(Y=\text{rush})\mathbb{E}[X\mid Y=\text{rush}].
$$

Substitute the given probabilities and conditional means:

$$
\mathbb{E}[X]=0.7\cdot2+0.3\cdot5.
$$

Compute each product:

$$
0.7\cdot2=1.4,
$$

and

$$
0.3\cdot5=1.5.
$$

Add the weighted conditional means:

$$
\mathbb{E}[X]=1.4+1.5=2.9.
$$

Interpretation: the overall mean is closer to $2$ than to $5$ because the normal state is more likely.

Thus

$$
\boxed{\mathbb{E}[X]=2.9.}
$$

#### A3. Joint PMF to marginals and conditional expectation

**Problem.** Let $X\in\{0,1,2\}$ and $Y\in\{0,1\}$ have joint PMF

$$
\begin{array}{c|cc}
& Y=0 & Y=1\\ \hline
X=0 & 0.10 & 0.20\\
X=1 & 0.15 & 0.25\\
X=2 & 0.05 & 0.25
\end{array}
$$

Find the marginal PMFs of $X$ and $Y$, compute $p_{X\mid Y}(x\mid1)$, and compute $\mathbb{E}[X\mid Y=1]$.

**Solution.**

First check that the joint probabilities sum to one:

$$
0.10+0.20+0.15+0.25+0.05+0.25=1.00.
$$

So the table is a valid joint PMF.

To find $p_X(x)$, sum across the possible values of $Y$.

For $X=0$:

$$
p_X(0)=p_{X,Y}(0,0)+p_{X,Y}(0,1)=0.10+0.20=0.30.
$$

For $X=1$:

$$
p_X(1)=p_{X,Y}(1,0)+p_{X,Y}(1,1)=0.15+0.25=0.40.
$$

For $X=2$:

$$
p_X(2)=p_{X,Y}(2,0)+p_{X,Y}(2,1)=0.05+0.25=0.30.
$$

Thus

$$
p_X(0)=0.30,\quad p_X(1)=0.40,\quad p_X(2)=0.30.
$$

To find $p_Y(y)$, sum across the possible values of $X$.

For $Y=0$:

$$
p_Y(0)=p_{X,Y}(0,0)+p_{X,Y}(1,0)+p_{X,Y}(2,0).
$$

Substitute:

$$
p_Y(0)=0.10+0.15+0.05=0.30.
$$

For $Y=1$:

$$
p_Y(1)=p_{X,Y}(0,1)+p_{X,Y}(1,1)+p_{X,Y}(2,1).
$$

Substitute:

$$
p_Y(1)=0.20+0.25+0.25=0.70.
$$

Now compute the conditional PMF of $X$ given $Y=1$:

$$
p_{X\mid Y}(x\mid1)=\frac{p_{X,Y}(x,1)}{p_Y(1)}.
$$

Since $p_Y(1)=0.70$, for $x=0$:

$$
p_{X\mid Y}(0\mid1)=\frac{0.20}{0.70}=\frac{20}{70}=\frac{2}{7}.
$$

For $x=1$:

$$
p_{X\mid Y}(1\mid1)=\frac{0.25}{0.70}=\frac{25}{70}=\frac{5}{14}.
$$

For $x=2$:

$$
p_{X\mid Y}(2\mid1)=\frac{0.25}{0.70}=\frac{25}{70}=\frac{5}{14}.
$$

Check normalization:

$$
\frac{2}{7}+\frac{5}{14}+\frac{5}{14}=\frac{4}{14}+\frac{5}{14}+\frac{5}{14}=\frac{14}{14}=1.
$$

Now compute conditional expectation:

$$
\mathbb{E}[X\mid Y=1]=\sum_x xp_{X\mid Y}(x\mid1).
$$

Substitute the conditional PMF:

$$
\mathbb{E}[X\mid Y=1]=0\cdot\frac{2}{7}+1\cdot\frac{5}{14}+2\cdot\frac{5}{14}.
$$

Compute each term:

$$
0\cdot\frac{2}{7}=0,
$$

$$
1\cdot\frac{5}{14}=\frac{5}{14},
$$

$$
2\cdot\frac{5}{14}=\frac{10}{14}.
$$

Add:

$$
\mathbb{E}[X\mid Y=1]=0+\frac{5}{14}+\frac{10}{14}=\frac{15}{14}.
$$

Therefore

$$
\boxed{p_X=(0.30,0.40,0.30),\ p_Y=(0.30,0.70),\ p_{X\mid Y}(\cdot\mid1)=\left(\frac{2}{7},\frac{5}{14},\frac{5}{14}\right),\ \mathbb{E}[X\mid Y=1]=\frac{15}{14}.}
$$

#### A4. Independence test and product expectation

**Problem.** Let $X,Y\in\{0,1\}$ have joint probabilities

$$
p_{00}=0.28,\quad p_{01}=0.12,\quad p_{10}=0.42,\quad p_{11}=0.18,
$$

where $p_{xy}=\mathbb{P}(X=x,Y=y)$. Check whether $X$ and $Y$ are independent. If they are independent, verify that $\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y]$.

**Solution.**

First compute the marginal PMF of $X$ by summing over $Y$.

For $X=0$:

$$
p_X(0)=p_{00}+p_{01}=0.28+0.12=0.40.
$$

For $X=1$:

$$
p_X(1)=p_{10}+p_{11}=0.42+0.18=0.60.
$$

Now compute the marginal PMF of $Y$ by summing over $X$.

For $Y=0$:

$$
p_Y(0)=p_{00}+p_{10}=0.28+0.42=0.70.
$$

For $Y=1$:

$$
p_Y(1)=p_{01}+p_{11}=0.12+0.18=0.30.
$$

To test independence, check whether

$$
p_{X,Y}(x,y)=p_X(x)p_Y(y)
$$

for every cell.

For $(x,y)=(0,0)$:

$$
p_X(0)p_Y(0)=0.40\cdot0.70=0.28=p_{00}.
$$

For $(x,y)=(0,1)$:

$$
p_X(0)p_Y(1)=0.40\cdot0.30=0.12=p_{01}.
$$

For $(x,y)=(1,0)$:

$$
p_X(1)p_Y(0)=0.60\cdot0.70=0.42=p_{10}.
$$

For $(x,y)=(1,1)$:

$$
p_X(1)p_Y(1)=0.60\cdot0.30=0.18=p_{11}.
$$

All four products match the joint probabilities, so $X$ and $Y$ are independent.

Now compute $\mathbb{E}[XY]$. Since $X,Y\in\{0,1\}$, the product $XY$ equals $1$ only when $X=1$ and $Y=1$; otherwise it equals $0$. Therefore

$$
\mathbb{E}[XY]=1\cdot\mathbb{P}(X=1,Y=1)+0\cdot\mathbb{P}(XY=0).
$$

Thus

$$
\mathbb{E}[XY]=p_{11}=0.18.
$$

Next compute $\mathbb{E}[X]$:

$$
\mathbb{E}[X]=0\cdot p_X(0)+1\cdot p_X(1)=0\cdot0.40+1\cdot0.60=0.60.
$$

Compute $\mathbb{E}[Y]$:

$$
\mathbb{E}[Y]=0\cdot p_Y(0)+1\cdot p_Y(1)=0\cdot0.70+1\cdot0.30=0.30.
$$

Multiply the expectations:

$$
\mathbb{E}[X]\mathbb{E}[Y]=0.60\cdot0.30=0.18.
$$

This equals $\mathbb{E}[XY]$:

$$
\mathbb{E}[XY]=0.18=\mathbb{E}[X]\mathbb{E}[Y].
$$

Therefore

$$
\boxed{X\text{ and }Y\text{ are independent, and }\mathbb{E}[XY]=0.18=\mathbb{E}[X]\mathbb{E}[Y].}
$$

#### A5. Variance of a sum of Bernoulli variables

**Problem.** Let $X_1,\ldots,X_n$ be independent $\operatorname{Ber}(p)$ random variables and let

$$
S=\sum_{i=1}^n X_i.
$$

Derive the mean and variance of $S$ from linearity and variance additivity. Contrast with what fails if the variables are dependent.

**Solution.**

Each $X_i\sim\operatorname{Ber}(p)$ has

$$
\mathbb{E}[X_i]=p,
$$

and

$$
\operatorname{Var}(X_i)=p(1-p).
$$

Because

$$
S=X_1+X_2+\cdots+X_n,
$$

linearity of expectation gives

$$
\mathbb{E}[S]=\mathbb{E}[X_1+X_2+\cdots+X_n].
$$

Apply linearity:

$$
\mathbb{E}[S]=\mathbb{E}[X_1]+\mathbb{E}[X_2]+\cdots+\mathbb{E}[X_n].
$$

Since every $X_i$ has mean $p$,

$$
\mathbb{E}[S]=p+p+\cdots+p.
$$

There are $n$ terms, so

$$
\mathbb{E}[S]=np.
$$

Now compute the variance. Because the $X_i$ are independent, variance additivity applies:

$$
\operatorname{Var}(S)=\operatorname{Var}(X_1+X_2+\cdots+X_n).
$$

Therefore

$$
\operatorname{Var}(S)=\operatorname{Var}(X_1)+\operatorname{Var}(X_2)+\cdots+\operatorname{Var}(X_n).
$$

Since every $X_i$ has variance $p(1-p)$,

$$
\operatorname{Var}(S)=p(1-p)+p(1-p)+\cdots+p(1-p).
$$

There are $n$ terms, so

$$
\operatorname{Var}(S)=np(1-p).
$$

Thus $S$ has the binomial mean and variance.

What changes if the variables are dependent? Linearity of expectation still holds, so $\mathbb{E}[S]=np$ still holds as long as each $X_i$ has mean $p$. However, variance additivity may fail because dependence can create covariance terms. In the extreme case where $X_1=\cdots=X_n=Z$ for one Bernoulli random variable $Z\sim\operatorname{Ber}(p)$, then

$$
S=nZ.
$$

The expectation is still

$$
\mathbb{E}[S]=\mathbb{E}[nZ]=n\mathbb{E}[Z]=np.
$$

But the variance is

$$
\operatorname{Var}(S)=\operatorname{Var}(nZ)=n^2\operatorname{Var}(Z)=n^2p(1-p),
$$

not $np(1-p)$.

Therefore

$$
\boxed{\mathbb{E}[S]=np,\quad \operatorname{Var}(S)=np(1-p)\text{ under independence; without independence, variance additivity can fail.}}
$$
