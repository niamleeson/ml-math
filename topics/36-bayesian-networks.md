# Bayesian Networks & Inference

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 36/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 3.2 Bayesian networks

In this section, our goal will be to compute conditional probabilities. What is the probability of a query given evidence?

#### 3.2.1 Introduction

- **Explaining away** — Suppose causes $C_1$ and $C_2$ influence an effect $E$. Conditioning on the effect $E$ and on one of the causes (say $C_1$) changes the probability of the other cause (say $C_2$). In this case, we say that $C_1$ has explained away $C_2$.

- **Directed acyclic graph** — A directed acyclic graph (DAG) is a finite directed graph with no directed cycles.

- **Bayesian network** — A Bayesian network is a directed acyclic graph (DAG) that specifies a joint distribution over random variables $X=(X_1,...,X_n)$ as a product of local conditional distributions, one for each node:

$$
P(X_1=x_1,...,X_n=x_n)=\prod_{i=1}^{n}p(x_i\mid x_{\operatorname{Parents}(i)})
$$

_Remark: Bayesian networks are factor graphs imbued with the language of probability._

*[Figure: A Bayesian network with directed edges among variables such as $X_1$, $X_2$, $X_3$, $X_4$, $X_5$, and isolated $X_6$, shown converting into a factor graph whose factors are local conditional probability tables $p(x_i\mid x_{\operatorname{Parents}(i)})$. The figure demonstrates how DAG structure becomes factor-graph factors.]*

- **Locally normalized** — For each $x_{\operatorname{Parents}(i)}$, all factors are local conditional distributions. Hence they have to satisfy:

$$
\sum_{x_i}p(x_i\mid x_{\operatorname{Parents}(i)})=1
$$

As a result, sub-Bayesian networks and conditional distributions are consistent.

_Remark: local conditional distributions are the true conditional distributions._

- **Marginalization** — The marginalization of a leaf node yields a Bayesian network without that node.

#### 3.2.2 Probabilistic programs

- **Concept** — A probabilistic program randomizes variables assignment. That way, we can write down complex Bayesian networks that generate assignments without us having to explicitly specify associated probabilities.

_Remark: examples of probabilistic programs include Hidden Markov model (HMM), factorial HMM, naive Bayes, latent Dirichlet allocation, diseases and symptoms and stochastic block models._

- **Summary** — The table below summarizes the common probabilistic programs as well as their applications:

| Program | Algorithm | Illustration | Example |
|---|---|---|---|
| Markov Model | $X_i \sim p(X_i\mid X_{i-1})$ | *Chain $X_1 \to X_2 \to X_3 \to \cdots \to X_n$.* | Language modeling |
| Hidden Markov Model (HMM) | $H_t \sim p(H_t\mid H_{t-1})$<br>$E_t \sim p(E_t\mid H_t)$ | *Hidden states $H_1 \to H_2 \to H_3 \to \cdots \to H_T$ in a top row, observed emissions $E_1,E_2,E_3,\ldots,E_T$ in a bottom row, and vertical arrows $H_t \to E_t$.* | Object tracking |
| Factorial HMM | $H_t^o \sim \alpha(a,b)\ p(H_t^o\mid H_{t-1}^o)$<br>$E_t \sim p(E_t\mid H_t^a,H_t^b)$ | *Two parallel hidden Markov chains $H_t^1$ and $H_t^2$ with emissions $E_t$ between them, modeling multiple hidden objects jointly.* | Multiple object tracking |
| Naive Bayes | $Y \sim p(Y)$<br>$W_i \sim p(W_i\mid Y)$ | *Class node $Y$ points to observed word nodes $W_1,W_2,W_3,\ldots,W_L$.* | Document classification |
| Latent Dirichlet Allocation (LDA) | $\alpha \in \mathbb{R}^K$ distribution<br>$Z_i \sim p(Z_i\mid \alpha)$<br>$W_i \sim p(W_i\mid Z_i)$ | *Topic-proportion node $\alpha$ points to topic nodes $Z_1,Z_2,Z_3,\ldots,Z_L$, each topic node points to a word node $W_i$.* | Topic modeling |

#### 3.2.3 Inference

- **General probabilistic inference strategy** — The strategy to compute the probability $P(Q\mid E=e)$ of query $Q$ given evidence $E=e$ is as follows:

  - Step 1: Remove variables that are not ancestors of the query $Q$ or the evidence $E$ by marginalization
  - Step 2: Convert Bayesian network to factor graph
  - Step 3: Condition on the evidence $E=e$
  - Step 4: Remove nodes disconnected from the query $Q$ by marginalization
  - Step 5: Run probabilistic inference algorithm (manual, variable elimination, Gibbs sampling, particle filtering)

- **Forward-backward algorithm** — This algorithm computes the exact value of $P(H_i=h_k\mid E=e)$ (smoothing query) for any $k \in \{1,...,L\}$ in the case of an HMM of size $L$. To do so, we proceed in 3 steps:

  - Step 1: for $i \in \{1,...,L\}$, compute $F_i(h_i)=\sum_{h_{i-1}}F_{i-1}(h_{i-1})p(h_i\mid h_{i-1})p(e_i\mid h_i)$
  - Step 2: for $i \in \{L,...,1\}$, compute $B_i(h_i)=\sum_{h_{i+1}}B_{i+1}(h_{i+1})p(h_{i+1}\mid h_i)p(e_{i+1}\mid h_{i+1})$
  - Step 3: for $i \in \{1,...,L\}$, compute $S_i(h_i)=\frac{F_i(h_i)B_i(h_i)}{\sum_{h_i}F_i(h_i)B_i(h_i)}$


with the convention $F_0 = B_{L+1} = 1$. From this procedure and these notations, we get that

$$
P(H = h_k \mid E = e) = S_k(h_k)
$$

*Remark: this algorithm interprets each assignment to be a path where each edge $h_{i-1} \to h_i$ is of weight $p(h_i \mid h_{i-1})p(e_i \mid h_i)$.*

- **Gibbs sampling** — This algorithm is an iterative approximate method that uses a small set of assignments (particles) to represent a large probability distribution. From a random assignment $x$, Gibbs sampling performs the following steps for $i \in \{1,...,n\}$ until convergence:

  - For all $u \in \operatorname{Domain}_i$, compute the weight $w(u)$ of assignment $x$ where $X_i = u$
  - Sample $v$ from the probability distribution induced by $w$: $v \sim P(X_i = v \mid X_{-i} = x_{-i})$
  - Set $X_i = v$

*Remark: $X_{-i}$ denotes $X \setminus \{X_i\}$ and $x_{-i}$ represents the corresponding assignment.*

- **Particle filtering** — This algorithm approximates the posterior density of state variables given the evidence of observation variables by keeping track of $K$ particles at a time. Starting from a set of particles $C$ of size $K$, we run the following 3 steps iteratively:

  - Step 1: proposal - For each old particle $x_{t-1} \in C$, sample $x$ from the transition probability distribution $p(x \mid x_{t-1})$ and add $x$ to a set $C'$.
  - Step 2: weighting - Weigh each $x$ of the set $C'$ by $w(x) = p(e_t \mid x)$, where $e_t$ is the evidence observed at time $t$.
  - Step 3: resampling - Sample $K$ elements from the set $C'$ using the probability distribution induced by $w$ and store them in $C$: these are the current particles $x_t$.

*Remark: a more expensive version of this algorithm also keeps track of past particles in the proposal step.*

- **Maximum likelihood** — If we don't know the local conditional distributions, we can learn them using maximum likelihood.

$$
\max_\theta \prod_{x \in \mathcal{D}_{\textrm{train}}} p(X = x; \theta)
$$

- **Laplace smoothing** — For each distribution $d$ and partial assignment $(x_{\operatorname{Parents}(i)}, x_i)$, add $\lambda$ to $\operatorname{count}_d(x_{\operatorname{Parents}(i)}, x_i)$, then normalize to get probability estimates.

- **Algorithm** — The Expectation-Maximization (EM) algorithm gives an efficient method at estimating the parameter $\theta$ through maximum likelihood estimation by repeatedly constructing a lower-bound on the likelihood (E-step) and optimizing that lower bound (M-step) as follows:

  - E-step: Evaluate the posterior probability $q(h)$ that each data point $e$ came from a particular cluster $h$ as follows:

$$
q(h) = P(H = h \mid E = e; \theta)
$$

  - M-step: Use the posterior probabilities $q(h)$ as cluster specific weights on data points $e$ to determine $\theta$ through maximum likelihood.
