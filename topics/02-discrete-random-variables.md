# Discrete Random Variables

> **Source:** Probability (MIT 6.431x) &middot; Topic 2/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## Discrete random variables

### Probability mass function and expectation

**Definition (Random variable).** A random variable $X$ is a function of the sample space $\Omega$ into the real numbers (or $\mathbb{R}^n$). Its range can be discrete or continuous.

**Definition (Probability mass function (PMF)).** The probability law of a discrete random variable $X$ is called its PMF. It is defined as

$$
p_X(x)=\mathbb{P}(X=x)=\mathbb{P}(\{\omega \in \Omega:X(\omega)=x\}).
$$

**Properties.**

$$
p_X(x)\geq 0,\ \forall x.
$$

$$
\sum_x p_X(x)=1.
$$

**Example (Bernoulli random variable).** A Bernoulli random variable $X$ with parameter $0 \leq p \leq 1$ ($X\sim \operatorname{Ber}(p)$) takes the following values:

$$
X=\begin{cases}
1 & \text{w.p. } p,\\
0 & \text{w.p. } 1-p.
\end{cases}
$$

An indicator random variable of an event ($I_A=1$ if $A$ occurs) is an example of a Bernoulli random variable.

**Example (Discrete uniform random variable).** A Discrete uniform random variable $X$ between $a$ and $b$ with $a \leq b$ ($X\sim \operatorname{Unif}_{a,b}()$) takes any of the values in $\{a,a+1,\ldots,b\}$ with probability $\frac{1}{b-a+1}$.

**Example (Binomial random variable).** A Binomial random variable $X$ with parameters $n$ (natural number) and $0 \leq p \leq 1$ ($X\sim \operatorname{Bin}(n,p)$) takes values in the set $\{0,1,\ldots,n\}$ with probabilities $p_X(i)=\binom{n}{i}p^i(1-p)^{n-i}$.

It represents the number of successes in $n$ independent trials where each trial has a probability of success $p$. Therefore, it can also be seen as the sum of $n$ independent Bernoulli random variables, each with parameter $p$.

**Example (Geometric random variable).** A Geometric random variable $X$ with parameter $0 \leq p \leq 1$ ($X\sim \operatorname{Geo}(p)$) takes values in the set $\{1,2,\ldots\}$ with probabilities $p_X(i)=(1-p)^{i-1}p$.

It represents the number of independent trials until (and including) the first success, when the probability of success in each trial is $p$.

**Definition (Expectation/mean of a random variable).** The expectation of a discrete random variable is defined as

$$
\mathbb{E}[X]\triangleq \sum_x xp_X(x),
$$

assuming $\sum_x |x|p_X(x)<\infty$.

**Properties (Properties of expectation).**

- If $X\geq 0$ then $\mathbb{E}[X]\geq 0$.
- If $a\leq X\leq b$ then $a\leq \mathbb{E}[X]\leq b$.
- If $X=c$ then $\mathbb{E}[X]=c$.

**Example Expected value of know r.v.**

- If $X\sim \operatorname{Ber}(p)$ then $\mathbb{E}[X]=p$.
- If $X=I_A$ then $\mathbb{E}[X]=\mathbb{P}(A)$.
- If $X\sim \operatorname{Uni}[a,b]$ then $\mathbb{E}[X]=\frac{a+b}{2}$.
- If $X\sim \operatorname{Bin}(n,p)$ then $\mathbb{E}[X]=np$.
- If $X\sim \operatorname{Geo}(p)$ then $\mathbb{E}[X]=\frac{1}{p}$.

**Theorem (Expected value rule).** Given a random variable $X$ and a function $g:\mathbb{R}\to\mathbb{R}$, we construct the random variable $Y=g(X)$. Then

$$
\sum_y yp_Y(y)=\mathbb{E}[Y]=\mathbb{E}[g(X)]=\sum_x g(x)p_X(x).
$$

**Remark (PMF of $Y=g(X)$).** The PMF of $Y=g(X)$ is

$$
p_Y(y)=\sum_{\{x:g(x)=y\}}p_X(x).
$$

**Remark.** In general $g(\mathbb{E}[X])\neq \mathbb{E}[g(X)]$. They are equal if $g(x)=ax+b$.

### Variance, conditioning on an event, multiple r.v.

**Definition (Variance of a random variable).** Given a random variable $X$ with $\mu=\mathbb{E}[X]$, its variance is a measure of the spread of the random variable and is defined as

$$
\operatorname{Var}(X)\triangleq \mathbb{E}[(X-\mu)^2]=\sum_x (x-\mu)^2p_X(x).
$$

**Definition (Standard deviation).**

$$
\sigma_X=\sqrt{\operatorname{Var}(X)}.
$$

**Properties (Properties of the variance).**

- $\operatorname{Var}(aX)=a^2\operatorname{Var}(X)$, for all $a\in\mathbb{R}$.
- $\operatorname{Var}(X+b)=\operatorname{Var}(X)$, for all $b\in\mathbb{R}$.
- $\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)$.
- $\operatorname{Var}(X)=\mathbb{E}[X^2]-(\mathbb{E}[X])^2$.

**Example (Variance of known r.v.).**

- If $X\sim \operatorname{Ber}(p)$, then $\operatorname{Var}(X)=p(1-p)$.
- If $X\sim \operatorname{Uni}[a,b]$, then $\operatorname{Var}(X)=\frac{(b-a)(b-a+2)}{12}$.
- If $X\sim \operatorname{Bin}(n,p)$, then $\operatorname{Var}(X)=np(1-p)$.
- If $X\sim \operatorname{Geo}(p)$, then $\operatorname{Var}(X)=\frac{1-p}{p^2}$.

**Proposition (Conditional PMF and expectation, given an event).** Given the event $A$, with $\mathbb{P}(A)>0$, we have the following

$$
p_{X\mid A}(x)=\mathbb{P}(X=x\mid A).
$$

If $A$ is a subset of the range of $X$, then:

$$
p_{X\mid A}(x) \triangleq p_{X\mid X\in A}(x)=\begin{cases}
\frac{1}{\mathbb{P}(A)}p_X(x), & \text{if } x\in A,\\
0, & \text{otherwise.}
\end{cases}
$$

- $\sum_x p_{X\mid A}(x)=1$.
- $\mathbb{E}[X\mid A]=\sum_x xp_{X\mid A}(x)$.
- $\mathbb{E}[g(X)\mid A]=\sum_x g(x)p_{X\mid A}(x)$.

**Proposition (Total expectation rule).** Given a partition of disjoint events $A_1,\ldots,A_n$ such that $\sum_i \mathbb{P}(A_i)=1$, and $\mathbb{P}(A_i)>0$,

$$
\mathbb{E}[X]=\mathbb{P}(A_1)\mathbb{E}[X\mid A_1]+\cdots+\mathbb{P}(A_n)\mathbb{E}[X\mid A_n].
$$

**Definition (Memorylessness of the geometric random variable).** When we condition a geometric random variable $X$ on the event $X>n$ we have memorylessness, meaning that the “remaining time” $X-n$, given that $X>n$, is also geometric with the same parameter. Formally,

$$
p_{X-n\mid X>n}(i)=p_X(i).
$$

**Definition (Joint PMF).** The joint PMF of random variables $X_1,X_2,\ldots,X_n$ is

$$
p_{X_1,X_2,\ldots,X_n}(x_1,\ldots,x_n)=\mathbb{P}(X_1=x_1,\ldots,X_n=x_n).
$$

**Properties (Properties of joint PMF).**

- $\sum_{x_1}\sum_{x_2}\cdots\sum_{x_n}p_{X_1,\ldots,X_n}(x_1,\ldots,x_n)=1$.
- $p_{X_1}(x_1)=\sum_{x_2}\cdots\sum_{x_n}p_{X_1,\ldots,X_n}(x_1,x_2,\ldots,x_n)$.
- $p_{X_2,\ldots,X_n}(x_2,\ldots,x_n)=\sum_{x_1}p_{X_1,X_2,\ldots,X_n}(x_1,x_2,\ldots,x_n)$.

**Definition (Functions of multiple r.v.).** If $Z=g(X_1,\ldots,X_n)$, where $g:\mathbb{R}^n\to\mathbb{R}$, then $p_Z(z)=\mathbb{P}(g(X_1,\ldots,X_n)=z)$.

**Proposition (Expected value rule for multiple r.v.).** Given $g:\mathbb{R}^n\to\mathbb{R}$,

$$
\mathbb{E}[g(X_1,\ldots,X_n)]=\sum_{x_1,\ldots,x_n}g(x_1,\ldots,x_n)p_{X_1,\ldots,X_n}(x_1,\ldots,x_n).
$$

**Properties (Linearity of expectations).**

- $\mathbb{E}[aX+b]=a\mathbb{E}[X]+b$.
- $\mathbb{E}[X_1+\cdots+X_n]=\mathbb{E}[X_1]+\cdots+\mathbb{E}[X_n]$.

### Conditioning on a random variable, independence

**Definition (Conditional PMF given another random variable).** Given discrete random variables $X,Y$ and $y$ such that $p_Y(y)>0$ we define

$$
p_{X\mid Y}(x\mid y)=\frac{p_{X,Y}(x,y)}{p_Y(y)}.
$$

**Proposition (Multiplication rule).** Given discrete random variables $X,Y$, and whenever the conditional probabilities are defined,

$$
p_{X,Y}(x,y)=p_X(x)p_{Y\mid X}(y\mid x)=p_Y(y)p_{X\mid Y}(x\mid y).
$$

**Definition (Conditional expectation).** Given discrete random variables $X,Y$ and $y$ such that $p_Y(y)>0$ we define

$$
\mathbb{E}[X\mid Y=y]=\sum_x xp_{X\mid Y}(x\mid y).
$$

Additionally we have

$$
\mathbb{E}[g(X)\mid Y=y]=\sum_x g(x)p_{X\mid Y}(x\mid y).
$$

**Theorem (Total probability and expectation theorems).** If $p_Y(y)>0$, then

$$
p_X(x)=\sum_y p_Y(y)p_{X\mid Y}(x\mid y),
$$

$$
\mathbb{E}[X]=\sum_y p_Y(y)\mathbb{E}[X\mid Y=y].
$$

**Definition (Independence of a random variable and an event).** A discrete random variable $X$ and an event $A$ are independent if $\mathbb{P}(X=x \text{ and } A)=p_X(x)\mathbb{P}(A)$, for all $x$.

**Definition (Independence of two random variables).** Two discrete random variables $X$ and $Y$ are independent if $p_{X,Y}(x,y)=p_X(x)p_Y(y)$ for all $x,y$.

**Remark (Independence of a collection of random variables).** A collection $X_1,X_2,\ldots,X_n$ of random variables are independent if

$$
p_{X_1,\ldots,X_n}(x_1,\ldots,x_n)=p_{X_1}(x_1)\cdots p_{X_n}(x_n),\ \forall x_1,\ldots,x_n.
$$

**Remark (Independence and expectation).** In general, $\mathbb{E}[g(X,Y)]\neq g(\mathbb{E}[X],\mathbb{E}[Y])$. An exception is for linear functions: $\mathbb{E}[aX+bY]=a\mathbb{E}[X]+b\mathbb{E}[Y]$.

**Proposition (Expectation of product of independent r.v.).** If $X$ and $Y$ are discrete independent random variables,

$$
\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y].
$$

**Remark.** If $X$ and $Y$ are independent, $\mathbb{E}[g(X)h(Y)]=\mathbb{E}[g(X)]\mathbb{E}[h(Y)]$.

**Proposition (Variance of sum of independent random variables).** If $X$ and $Y$ are discrete independent random variables,

$$
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y).
$$
