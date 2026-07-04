# Convergence of Random Variables (LLN & CLT)

> **Source:** Probability (MIT 6.431x) &middot; Topic 4/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## Convergence of random variables

### Inequalities, convergence, and the Weak Law of Large Numbers

**Theorem (Markov inequality).** Given a random variable $X\geq 0$ and, for every $a>0$ we have

$$
\mathbb{P}(X\geq a)\leq \frac{\mathbb{E}[X]}{a}.
$$

**Theorem (Chebyshev inequality).** Given a random variable $X$ with $\mathbb{E}[X]=\mu$ and $\operatorname{Var}(X)=\sigma^2$, for every $c>0$ we have

$$
\mathbb{P}(|X-\mu|\geq c)\leq \frac{\sigma^2}{c^2}.
$$

**Theorem (Weak Law of Large Number (WLLN)).** Given a sequence of i.i.d. random variables $\{X_1,X_2,\ldots\}$ with $\mathbb{E}[X_i]=\mu$ and $\operatorname{Var}(X_i)=\sigma^2$, we define

$$
M_n=\frac{1}{n}\sum_{i=1}^{n}X_i,
$$

for every $\epsilon>0$ we have

$$
\lim_{n\to\infty}\mathbb{P}(|M_n-\mu|\geq \epsilon)=0.
$$

**Definition (Convergence in probability).** A sequence of random variables $\{Y_i\}$ converges in probability to the random variable $Y$ if

$$
\lim_{n\to\infty}\mathbb{P}(|Y_i-Y|\geq \epsilon)=0,
$$

for every $\epsilon>0$.

**Properties (Properties of convergence in probability).** If $X_n\to a$ and $Y_n\to b$ in probability, then

- $X_n+Y_n\to a+b$.
- If $g$ is a continuous function, then $g(X_n)\to g(a)$.
- $\mathbb{E}[X_n]$ does not always converge to $a$.

### The Central Limit Theorem

**Theorem (Central Limit Theorem (CLT)).** Given a sequence of independent random variables $\{X_1,X_2,\ldots\}$ with $\mathbb{E}[X_i]=\mu$ and $\operatorname{Var}(X_i)=\sigma^2$, we define

$$
Z_n=\frac{1}{\sigma\sqrt{n}}\sum_{i=1}^{n}(X_i-\mu).
$$

Then, for every $z$, we have

$$
\lim_{n\to\infty}\mathbb{P}(Z_n\leq z)=\mathbb{P}(Z\leq z),
$$

where $Z\sim \mathcal{N}(0,1)$.

**Corollary (Normal approximation of a binomial).** Let $X\sim \operatorname{Bin}(n,p)$ with $n$ large. Then $S_n$ can be approximated by $Z\sim \mathcal{N}(np,np(1-p))$.

**Remark (De Moivre-Laplace 1/2 approximation).** Let $X\sim \operatorname{Bin}$, then $\mathbb{P}(X=i)=\mathbb{P}\left(i-\frac{1}{2}\leq X\leq i+\frac{1}{2}\right)$ and we can use the CLT to approximate the PMF of $X$.
