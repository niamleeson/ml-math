# Lesson Plan — 05 Supervised Learning: Introduction & Notations

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Concept/Framework |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 35–50 min |
| Source topic file | ../05-supervised-learning-intro.md |

## Part 1 — Overview (plan)
Introduce the supervised-learning vocabulary that will be reused throughout CS 229: data points, labels, hypotheses, losses, costs, gradients, likelihoods, and optimization updates. Hook: most ML algorithms differ mainly in what $h_\theta$ is, which loss they minimize, and how they update $\theta$.

## Part 2 — Key Idea (plan)
- **Focus (per category = Concept/Framework):** vocabulary + structure; connect prediction type, model family, loss, objective, and optimization update in a single supervised-learning pipeline.
- **Core artifacts to present:** training set $\{(x^{(i)},y^{(i)})\}_{i=1}^m$; regression vs classifier table; discriminative $P(y\mid x)$ vs generative $P(x\mid y)$; hypothesis $h_\theta(x^{(i)})$; losses $\frac12(y-z)^2$, $\log(1+\exp(-yz))$, $\max(0,1-yz)$, and cross-entropy $-[y\log z+(1-y)\log(1-z)]$; cost $J(\theta)=\sum_i L(h_\theta(x^{(i)}),y^{(i)})$; gradient descent $\theta\leftarrow\theta-\alpha\nabla J(\theta)$; likelihood/log-likelihood and $\theta^{\mathrm{opt}}=\arg\max_\theta L(\theta)$; Newton updates in 1-D and multidimensional form.

## Part 3 — Worked Examples

### 🟡 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| E1 | Classify a task as regression or classification | Three mini datasets: house size→price, email text→spam/not spam, image→digit class | Identify output type and choose regression vs classifier using the lesson table. |
| E2 | Discriminative vs generative modeling decision | Binary medical label $y$ with features $x$; compare direct boundary vs class-conditional densities | Decide whether the model estimates $P(y\mid x)$ or $P(x\mid y)$ and how $P(y\mid x)$ is obtained. |
| E3 | Compute squared loss and total cost | $m=3$ examples with predictions $z=(2,4,5)$ and labels $y=(3,4,1)$ | Evaluate $L=\frac12(y-z)^2$ per example and sum into $J(\theta)$. |
| E4 | One gradient-descent step | Current $\theta=2$, learning rate $\alpha=0.1$, gradient $\nabla J(\theta)=3.5$ | Apply $\theta\leftarrow\theta-\alpha\nabla J(\theta)$ and interpret direction/downhill movement. |
| E5 | Logistic and hinge loss from a margin | Binary label $y=1$ and scores $z=-1,0,2$ | Compute margins $yz$, logistic loss $\log(1+e^{-yz})$, hinge loss $\max(0,1-yz)$; compare penalties. |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| A1 | Cross-entropy penalty for confident wrong predictions | Binary labels $y\in\{0,1\}$ with predicted probabilities $z=0.01,0.2,0.8,0.99$ | Compute $-[y\log z+(1-y)\log(1-z)]$ and show why confident wrong predictions dominate cost. |
| A2 | Build a full cost from a hypothesis | Linear hypothesis $h_\theta(x)=\theta_0+\theta_1x$; three points $(0,1),(1,3),(2,2)$; $\theta=(1,0.5)$ | Generate predictions, per-example squared losses, and $J(\theta)$; distinguish hypothesis, loss, and cost. |
| A3 | Batch vs stochastic gradient update | Two training examples with gradients $g_1=4$, $g_2=-1$, current $\theta=5$, $\alpha=0.2$ | Compute one batch update using $g_1+g_2$ and two SGD updates sequentially; compare paths. |
| A4 | Maximum likelihood vs log-likelihood | Bernoulli observations $(1,0,1,1)$ with parameter $p$ | Write $L(p)=p^3(1-p)$, log-likelihood $\ell(p)=3\log p+\log(1-p)$, differentiate, and solve $p^{\mathrm{opt}}=3/4$. |
| A5 | Newton's algorithm step for a scalar objective | $\ell(\theta)=-(\theta-3)^2+5$ or a supplied $\ell'(\theta)$, $\ell''(\theta)$ at $\theta_0=0$ | Apply $\theta\leftarrow\theta-\ell'(\theta)/\ell''(\theta)$; contrast second-order Newton movement with first-order gradient descent. |

## Part 4 — Colab Notebook (omit if 🧮)
N/A — 🧮 numeric topic (no notebook).
