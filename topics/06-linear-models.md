# Linear Models: Regression, Logistic, GLM

> **Source:** Machine Learning — Stanford CS 229 &middot; Topic 6/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 1.3 Linear models

#### 1.3.1 Linear regression

We assume here that $y\mid x;\theta\sim\mathcal{N}(\mu,\sigma^2)$.

- **Normal equations** — By noting $X$ the matrix design, the value of $\theta$ that minimizes the cost function is a closed-form solution such that:

$$
\theta=(X^TX)^{-1}X^Ty
$$

- **LMS algorithm** — By noting $\alpha$ the learning rate, the update rule of the Least Mean Squares (LMS) algorithm for a training set of $m$ data points, which is also known as the Widrow-Hoff learning rule, is as follows:

$$
\forall j,\quad \theta_j\leftarrow\theta_j+\alpha\sum_{i=1}^{m}\left[y^{(i)}-h_\theta\left(x^{(i)}\right)\right]x_j^{(i)}
$$

Remark: the update rule is a particular case of the gradient ascent.

- **LWR** — Locally Weighted Regression, also known as LWR, is a variant of linear regression that weights each training example in its cost function by $w^{(i)}(x)$, which is defined with parameter $\tau\in\mathbb{R}$ as:

$$
w^{(i)}(x)=\exp\left(-\frac{\left(x^{(i)}-x\right)^2}{2\tau^2}\right)
$$

#### 1.3.2 Classification and logistic regression

- **Sigmoid function** — The sigmoid function $g$, also known as the logistic function, is defined as follows:

$$
\forall z\in\mathbb{R},\quad g(z)=\frac{1}{1+e^{-z}}\in]0,1[
$$

- **Logistic regression** — We assume here that $y\mid x;\theta\sim\operatorname{Bernoulli}(\phi)$. We have the following form:

$$
\phi=p(y=1\mid x;\theta)=\frac{1}{1+\exp(-\theta^Tx)}=g(\theta^Tx)
$$

Remark: there is no closed form solution for the case of logistic regressions.

- **Softmax regression** — A softmax regression, also called a multiclass logistic regression, is used to generalize logistic regression when there are more than 2 outcome classes. By convention, we set $\theta_K=0$, which makes the Bernoulli parameter $\phi_i$ of each class $i$ equal to:

$$
\phi_i=\frac{\exp(\theta_i^Tx)}{\sum_{j=1}^{K}\exp(\theta_j^Tx)}
$$

#### 1.3.3 Generalized Linear Models

- **Exponential family** — A class of distributions is said to be in the exponential family if it can be written in terms of a natural parameter, also called the canonical parameter or link function, $\eta$, a sufficient statistic $T(y)$ and a log-partition function $a(\eta)$ as follows:

$$
p(y;\eta)=b(y)\exp(\eta T(y)-a(\eta))
$$

Remark: we will often have $T(y)=y$. Also, $\exp(-a(\eta))$ can be seen as a normalization parameter that will make sure that the probabilities sum to one.

Here are the most common exponential distributions summed up in the following table:

| Distribution | $\eta$ | $T(y)$ | $a(\eta)$ | $b(y)$ |
|---|---|---|---|---|
| Bernoulli | $\log\left(\frac{\phi}{1-\phi}\right)$ | $y$ | $\log(1+\exp(\eta))$ | $1$ |
| Gaussian | $\mu$ | $y$ | $\frac{\eta^2}{2}$ | $\frac{1}{\sqrt{2\pi}}\exp\left(-\frac{y^2}{2}\right)$ |
| Poisson | $\log(\lambda)$ | $y$ | $e^\eta$ | $\frac{1}{y!}$ |
| Geometric | $\log(1-\phi)$ | $y$ | $\log\left(\frac{e^\eta}{1-e^\eta}\right)$ | $1$ |

- **Assumptions of GLMs** — Generalized Linear Models (GLM) aim at predicting a random variable $y$ as a function of $x\in\mathbb{R}^{n+1}$ and rely on the following 3 assumptions:

$$
(1)\quad y\mid x;\theta\sim\operatorname{ExpFamily}(\eta)
$$

$$
(2)\quad h_\theta(x)=\mathbb{E}[y\mid x;\theta]
$$

$$
(3)\quad \eta=\theta^Tx
$$

Remark: ordinary least squares and logistic regression are special cases of generalized linear models.
