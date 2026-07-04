# Activation Functions (Deep Learning)

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 19/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 1.5 Commonly used activation functions

- **Rectified Linear Unit** — The rectified linear unit layer (ReLU) is an activation function $g$ that is used on all elements of the volume. It aims at introducing non-linearities to the network. Its variants are summarized in the table below:

| ReLU | Leaky ReLU | ELU |
|---|---|---|
| $g(z) = \max(0, z)$ | $g(z) = \max(\epsilon z, z)$<br>with $\epsilon \ll 1$ | $g(z) = \max(\alpha(e^z - 1), z)$<br>with $\alpha \ll 1$ |
| *[Figure: ReLU plot. Axes show zero output for negative $z$ and a straight line of slope 1 for positive $z$.]* | *[Figure: Leaky ReLU plot. Axes show a small positive slope for negative $z$ and slope 1 for positive $z$, avoiding a flat negative side.]* | *[Figure: ELU plot. Axes show an exponential negative branch saturating near $-\alpha$ and a linear positive branch.]* |
| - Non-linearity complexities biologically interpretable | - Addresses dying ReLU issue for negative values | - Differentiable everywhere |

- **Softmax** — The softmax step can be seen as a generalized logistic function that takes as input a vector of scores $x \in \mathbb{R}^n$ and outputs a vector of output probability $p \in \mathbb{R}^n$ through a softmax function at the end of the architecture. It is defined as follows:

$$
\boxed{p = \begin{pmatrix} p_1 \\ \vdots \\ p_n \end{pmatrix}} \quad \textrm{where} \quad \boxed{p_i = \frac{e^{x_i}}{\displaystyle\sum_{j=1}^{n} e^{x_j}}}
$$
