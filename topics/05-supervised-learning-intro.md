# Supervised Learning: Introduction & Notations

> **Source:** Machine Learning — Stanford CS 229 &middot; Topic 5/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## 1 Supervised Learning

### 1.1 Introduction to Supervised Learning

Given a set of data points $\{x^{(1)},\ldots,x^{(m)}\}$ associated to a set of outcomes $\{y^{(1)},\ldots,y^{(m)}\}$, we want to build a classifier that learns how to predict $y$ from $x$.

- **Type of prediction** — The different types of predictive models are summed up in the table below:

|  | Regression | Classifier |
|---|---|---|
| **Outcome** | Continuous | Class |
| **Examples** | Linear regression | Logistic regression, SVM, Naive Bayes |

- **Type of model** — The different models are summed up in the table below:

|  | Discriminative model | Generative model |
|---|---|---|
| **Goal** | Directly estimate $P(y\mid x)$ | Estimate $P(x\mid y)$ to deduce $P(y\mid x)$ |
| **What’s learned** | Decision boundary | Probability distributions of the data |
| **Illustration** | *A two-class scatter plot with blue and red points separated by a dashed linear decision boundary; illustrates learning a boundary directly.* | *A two-class scatter plot with blue and red probability-density contour regions; illustrates learning class-conditional distributions.* |
| **Examples** | Regressions, SVMs | GDA, Naive Bayes |

### 1.2 Notations and general concepts

- **Hypothesis** — The hypothesis is noted $h_\theta$ and is the model that we choose. For a given input data $x^{(i)}$, the model prediction output is $h_\theta(x^{(i)})$.

- **Loss function** — A loss function is a function $L:(z,y)\in\mathbb{R}\times Y\longmapsto L(z,y)\in\mathbb{R}$ that takes as inputs the predicted value $z$ corresponding to the real data value $y$ and outputs how different they are. The common loss functions are summed up in the table below:

| Least squared | Logistic | Hinge | Cross-entropy |
|---|---|---|---|
| $\frac{1}{2}(y-z)^2$ | $\log(1+\exp(-yz))$ | $\max(0,1-yz)$ | $-\left[y\log(z)+(1-y)\log(1-z)\right]$ |
| *U-shaped quadratic curve with minimum at $z=y\in\mathbb{R}$; illustrates squared error.* | *Two smooth logistic-loss curves for $y=-1$ and $y=1$ decreasing as the margin $yz$ grows; illustrates logistic loss.* | *Two piecewise-linear hinge-loss curves for $y=-1$ and $y=1$ with zero loss after margin 1; illustrates SVM hinge loss.* | *Two cross-entropy curves for binary labels $y=0$ and $y=1$ over prediction $z\in[0,1]$; illustrates penalty for confident wrong probabilities.* |
| Linear regression | Logistic regression | SVM | Neural Network |

- **Cost function** — The cost function $J$ is commonly used to assess the performance of a model, and is defined with the loss function $L$ as follows:

$$
J(\theta)=\sum_{i=1}^{m}L\left(h_\theta\left(x^{(i)}\right),y^{(i)}\right)
$$

- **Gradient descent** — By noting $\alpha\in\mathbb{R}$ the learning rate, the update rule for gradient descent is expressed with the learning rate and the cost function $J$ as follows:

$$
\theta \leftarrow \theta-\alpha\nabla J(\theta)
$$

*[Figure: Contour plot of a cost function with parameter point $\theta$ moving in the direction $-\alpha\nabla J(\theta)$ toward the center minimum; illustrates iterative gradient descent updates.]*

Remark: Stochastic gradient descent (SGD) is updating the parameter based on each training example, and batch gradient descent is on a batch of training examples.

- **Likelihood** — The likelihood of a model $L(\theta)$ given parameters $\theta$ is used to find the optimal parameters $\theta$ through maximizing the likelihood. In practice, we use the log-likelihood $\ell(\theta)=\log(L(\theta))$ which is easier to optimize. We have:

$$
\theta^{\mathrm{opt}}=\operatorname*{argmax}_{\theta} L(\theta)
$$

- **Newton’s algorithm** — The Newton’s algorithm is a numerical method that finds $\theta$ such that $\ell'(\theta)=0$. Its update rule is as follows:

$$
\theta \leftarrow \theta-\frac{\ell'(\theta)}{\ell''(\theta)}
$$

Remark: the multidimensional generalization, also known as the Newton-Raphson method, has the following update rule:

$$
\theta \leftarrow \theta-\left(\nabla_\theta^2\ell(\theta)\right)^{-1}\nabla_\theta\ell(\theta)
$$
