# SGD & Fine-tuning Models

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 30/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 1.4 Stochastic gradient descent

- **Gradient descent** — By noting $\eta\in\mathbb{R}$ the learning rate (also called step size), the update rule for gradient descent is expressed with the learning rate and the loss function $\operatorname{Loss}(x,y,w)$ as follows:

$$
w\leftarrow w-\eta\nabla_w\operatorname{Loss}(x,y,w)
$$

*[Figure: A blue contour plot of a loss surface with nested ellipses around a minimum. An arrow from an initial point $w$ points downhill in the direction $-\nabla_w\operatorname{Loss}(x,y,w)$, and the update rule $w\leftarrow w-\eta\nabla_w\operatorname{Loss}(x,y,w)$ is shown above to illustrate gradient descent.]*

- **Stochastic updates** — Stochastic gradient descent (SGD) updates the parameters of the model one training example $(\phi(x),y)\in\mathcal{D}_{\text{train}}$ at a time. This method leads to sometimes noisy, but fast updates.

- **Batch updates** — Batch gradient descent (BGD) updates the parameters of the model one batch of examples (e.g. the entire training set) at a time. This method computes stable update directions, at a greater computational cost.

### 1.5 Fine-tuning models

- **Hypothesis class** — A hypothesis class $\mathcal{F}$ is the set of possible predictors with a fixed $\phi(x)$ and varying $w$:

$$
\mathcal{F}=\{f_w:w\in\mathbb{R}^d\}
$$

- **Logistic function** — The logistic function $\sigma$, also called the sigmoid function, is defined as:

$$
\forall z\in]-\infty,+\infty[,\quad \sigma(z)=\frac{1}{1+e^{-z}}
$$

*Remark: we have $\sigma'(z)=\sigma(z)(1-\sigma(z))$.*

- **Backpropagation** — The forward pass is done through $f_i$, which is the value for the subexpression rooted at $i$, while the backward pass is done through $g_i=\frac{\partial\operatorname{out}}{\partial f_i}$ and represents how $f_i$ influences the output.

*[Figure: A computation graph fragment with an input $x$ feeding into node $f_i$, then to $f_i(x)$, with a forward green arrow. A backward pink arrow is labeled $g_i(x)=\frac{\partial\operatorname{out}}{\partial f_i(x)}$ and a local derivative is labeled $\frac{\partial f_i(x)}{\partial x}$, illustrating forward values and backward gradients in backpropagation.]*

- **Approximation and estimation error** — The approximation error $\operatorname{Err}_{\text{approx}}$ represents how far the entire hypothesis class $\mathcal{F}$ is from the target predictor $g^*$, while the estimation error $\operatorname{Err}_{\text{est}}$ quantifies how good the predictor $f$ is with respect to the best predictor $f^*$ of the hypothesis class $\mathcal{F}$.

*[Figure: A nested-set diagram with a large oval $\Omega$ containing the hypothesis class region $\mathcal{F}$; inside $\mathcal{F}$ are $f^*$ and an estimated predictor $f$, while the target $g^*$ lies outside $\mathcal{F}$. The gap from $g^*$ to $f^*$ is labeled $\operatorname{Err}_{\text{approx}}$, and the gap from $f^*$ to $f$ is labeled $\operatorname{Err}_{\text{est}}$, illustrating approximation versus estimation error.]*

- **Regularization** — The regularization procedure aims at avoiding the model to overfit the data and thus deals with high variance issues. The following table sums up the different types of commonly used regularization techniques:

| LASSO | Ridge | Elastic Net |
|---|---|---|
| - Shrinks coefficients to 0<br>- Good for variable selection | Makes coefficients smaller | Tradeoff between variable selection and small coefficients |
| *Constraint diagram with elliptical contours of $\theta$ and a blue diamond $\ell_1$ ball labeled $\|\theta\|_1\leq 1$; the diamond corners encourage sparse coefficients.* | *Constraint diagram with elliptical contours of $\theta$ and a blue circular $\ell_2$ ball labeled $\|\theta\|_2\leq 1$; the circle shrinks coefficients smoothly.* | *Constraint diagram with elliptical contours of $\theta$ and a combined blue elastic-net constraint labeled $(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2\leq 1$, combining sparsity and shrinkage.* |
| $\ldots +\lambda\|\theta\|_1$<br>$\lambda\in\mathbb{R}$ | $\ldots +\lambda\|\theta\|_2^2$<br>$\lambda\in\mathbb{R}$ | $\ldots +\lambda\left[(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2\right]$<br>$\lambda\in\mathbb{R},\ \alpha\in[0,1]$ |

- **Hyperparameters** — Hyperparameters are the properties of the learning algorithm, and include features, regularization parameter $\lambda$, number of iterations $T$, step size $\eta$, etc.

- **Sets vocabulary** — When selecting a model, we distinguish 3 different parts of the data that we have as follows:

| Training set | Validation set | Testing set |
|---|---|---|
| - Model is trained<br>- Usually 80 of the dataset | - Model is assessed<br>- Usually 20 of the dataset<br>- Also called hold-out | - Model gives predictions<br>- Unseen data<br>- or development set |

Once the model has been chosen, it is trained on the entire dataset and tested on the unseen test set. These are represented in the figure below:

*[Figure: A horizontal split diagram. Under “Dataset,” a long rounded bar shows a large red training segment and a smaller green validation segment. To the right, under “Unseen data,” a separate blue rounded bar is labeled Test. This illustrates training/validation/test data partitions.]*
